-- ============================================================
-- P2: ödeme, erişim, e-posta ve işletim modeli (2026-10-03)
-- Tasarım: tek işlem fonksiyonu (apply_payment_result), erişim kaynağı (book_entitlement_source),
-- hiç sıfırlanmayan erişim sürümü (book_access_state.epoch), iade işlemi (book_refund_operation),
-- olaya bağlı e-posta kuyruğu (book_mail_outbox), sunucu tarafı durdurma (book_app_settings),
-- worker kilidi ve izleme (book_ops_lock, book_ops_run), DB tabanlı hız sınırı (book_rate_limit).
--
-- Kurallar:
--  * Kardeş site aynı projede: yeni nesnelerin hepsi book_ önekli; has_role / user_roles DEĞİŞTİRİLMEZ.
--  * Bütün RPC'ler SECURITY DEFINER + sabit search_path; EXECUTE yalnız service_role (edge functions).
--    Yönetici gerektiren işlemler p_actor'ü (edge function'ın doğruladığı kullanıcı) user_roles'ten yeniden doğrular;
--    auth.uid() kullanılmaz (service_role çağrısı istek sahibinin kimliğini taşımaz).
--  * Yeni tablolarda RLS açık, politika yok; anon/authenticated'a hiçbir hak verilmez.
--  * Mevcut kayıtlar test: provider_env = 'legacy_test' olarak işaretlenir; taşıma (backfill) yoktur.
-- ============================================================

-- ------------------------------------------------------------ book_orders genişletme
ALTER TABLE public.book_orders
  ADD COLUMN IF NOT EXISTS idempotency_key        TEXT,
  ADD COLUMN IF NOT EXISTS snapshot_hash          TEXT,
  ADD COLUMN IF NOT EXISTS terms_version          TEXT,
  ADD COLUMN IF NOT EXISTS terms_locale           TEXT,
  ADD COLUMN IF NOT EXISTS consent_kinds          TEXT[],
  ADD COLUMN IF NOT EXISTS provider_env           TEXT,
  ADD COLUMN IF NOT EXISTS lease_until            TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS token_expires_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_page_url       TEXT,
  ADD COLUMN IF NOT EXISTS version                INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status         TEXT,
  ADD COLUMN IF NOT EXISTS paid_price             NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS item_transactions      JSONB,
  ADD COLUMN IF NOT EXISTS raw_schema             INTEGER,
  ADD COLUMN IF NOT EXISTS review_note            TEXT,
  ADD COLUMN IF NOT EXISTS next_reconcile_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reconcile_lease_until  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reconcile_attempts     INTEGER NOT NULL DEFAULT 0;

-- Mevcut satırlar test kaydıdır (yazar kararı 2026-10-02): yeni kuralların kapsamı dışında tutulur.
UPDATE public.book_orders SET provider_env = 'legacy_test' WHERE provider_env IS NULL;

ALTER TABLE public.book_orders DROP CONSTRAINT IF EXISTS book_orders_provider_env_check;
ALTER TABLE public.book_orders ADD CONSTRAINT book_orders_provider_env_check
  CHECK (provider_env IN ('sandbox','live','legacy_test'));

ALTER TABLE public.book_orders DROP CONSTRAINT IF EXISTS book_orders_status_check;
ALTER TABLE public.book_orders ADD CONSTRAINT book_orders_status_check
  CHECK (status IN ('created','initialized','unknown','review','mismatch',
                    'paid','failed','refunded','expired','expired_confirmed'));

-- Hesap silinince ticari kayıt korunur (anonimleştirme değildir; saklama süreci ayrı).
ALTER TABLE public.book_orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.book_orders DROP CONSTRAINT IF EXISTS book_orders_user_id_fkey;
ALTER TABLE public.book_orders ADD CONSTRAINT book_orders_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Kullanıcı + ürün başına tek açık sipariş (inceleme ve uyuşmazlık dahil). Test kayıtları hariç.
CREATE UNIQUE INDEX IF NOT EXISTS uq_book_orders_open
  ON public.book_orders (user_id, product_code)
  WHERE status IN ('created','initialized','unknown','review','mismatch') AND provider_env <> 'legacy_test';
CREATE UNIQUE INDEX IF NOT EXISTS uq_book_orders_idem
  ON public.book_orders (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_book_orders_reconcile
  ON public.book_orders (next_reconcile_at) WHERE status IN ('created','initialized','unknown','review','mismatch');

-- ------------------------------------------------------------ yeni tablolar
CREATE TABLE IF NOT EXISTS public.book_app_settings (
    id                INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    checkout_enabled  BOOLEAN NOT NULL DEFAULT true,
    refunds_enabled   BOOLEAN NOT NULL DEFAULT true,
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by        UUID
);
INSERT INTO public.book_app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Erişim sürümü: satır HİÇ silinmez (kullanıcı silinince cascade hariç); epoch yalnız artar.
CREATE TABLE IF NOT EXISTS public.book_access_state (
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_code  TEXT NOT NULL,
    epoch         BIGINT NOT NULL DEFAULT 0,
    active        BOOLEAN NOT NULL DEFAULT false,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, product_code)
);

-- Erişim kaynağı: her satın alma ve her elle erişim ayrı satır; iade/iptal yalnız kendi kaynağını kapatır.
CREATE TABLE IF NOT EXISTS public.book_entitlement_source (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_code   TEXT NOT NULL,
    source_type    TEXT NOT NULL CHECK (source_type IN ('purchase','manual')),
    order_id       UUID REFERENCES public.book_orders(id) ON DELETE SET NULL,
    granted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    granted_by     UUID,
    note           TEXT CHECK (note IS NULL OR length(note) <= 200),
    revoked_at     TIMESTAMPTZ,
    revoked_by     UUID,
    revoke_reason  TEXT,
    CHECK (source_type <> 'purchase' OR order_id IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_book_source_purchase
  ON public.book_entitlement_source (order_id) WHERE source_type = 'purchase';
CREATE INDEX IF NOT EXISTS idx_book_source_user
  ON public.book_entitlement_source (user_id, product_code) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS public.book_refund_operation (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES public.book_orders(id) ON DELETE RESTRICT,
    amount              NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency            TEXT NOT NULL,
    state               TEXT NOT NULL DEFAULT 'requested'
                        CHECK (state IN ('requested','unknown','settled','failed','needs_review')),
    provider_refund_id  TEXT,
    settled_amount      NUMERIC(10,2),
    error_code          TEXT,
    requested_by        UUID,
    attempts            INTEGER NOT NULL DEFAULT 0,
    next_reconcile_at   TIMESTAMPTZ,
    lease_until         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    settled_at          TIMESTAMPTZ
);
-- Sipariş başına tek etkin iade işlemi (belirsiz sonuç uzlaştırılmadan yenisi açılmaz)
CREATE UNIQUE INDEX IF NOT EXISTS uq_book_refund_active
  ON public.book_refund_operation (order_id) WHERE state IN ('requested','unknown');

-- E-posta kuyruğu: tekillik OLAYA bağlı (receipt:<order>, refund:<op>, grant:<source>, fraud_refund:<order>).
CREATE TABLE IF NOT EXISTS public.book_mail_outbox (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_key            TEXT NOT NULL UNIQUE,
    kind                 TEXT NOT NULL CHECK (kind IN ('receipt','refund','grant')),
    order_id             UUID REFERENCES public.book_orders(id) ON DELETE SET NULL,
    user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recipient            TEXT,
    lang                 TEXT NOT NULL DEFAULT 'tr' CHECK (lang IN ('tr','en')),
    payload              JSONB NOT NULL DEFAULT '{}'::jsonb,
    template_version     INTEGER NOT NULL DEFAULT 1,
    state                TEXT NOT NULL DEFAULT 'pending'
                         CHECK (state IN ('pending','sending','accepted','retry','failed','needs_review','suppressed')),
    attempts             INTEGER NOT NULL DEFAULT 0,
    first_attempt_at     TIMESTAMPTZ,
    next_attempt_at      TIMESTAMPTZ,
    lease_until          TIMESTAMPTZ,
    lease_version        INTEGER NOT NULL DEFAULT 0,
    provider_message_id  TEXT,
    accepted_at          TIMESTAMPTZ,
    last_error_code      TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_book_outbox_due
  ON public.book_mail_outbox (next_attempt_at) WHERE state IN ('pending','retry','sending');

CREATE TABLE IF NOT EXISTS public.book_rate_limit (
    key           TEXT NOT NULL CHECK (length(key) <= 200),
    window_start  TIMESTAMPTZ NOT NULL,
    hits          INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (key, window_start)
);

CREATE TABLE IF NOT EXISTS public.book_policy_version (
    kind            TEXT NOT NULL CHECK (kind IN ('pre_contract','distance_sales','privacy')),
    locale          TEXT NOT NULL CHECK (locale IN ('tr','en')),
    version         TEXT NOT NULL,
    content_hash    TEXT NOT NULL,
    effective_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    immutable_path  TEXT,
    PRIMARY KEY (kind, locale, version)
);

-- Worker: tek satırlık süreli kilit (pooled bağlantıda advisory lock güvenilir değil) + çalışma kayıtları.
CREATE TABLE IF NOT EXISTS public.book_ops_lock (
    id           INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    holder       UUID,
    lease_until  TIMESTAMPTZ NOT NULL DEFAULT '-infinity'
);
INSERT INTO public.book_ops_lock (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.book_ops_run (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at  TIMESTAMPTZ,
    ok           BOOLEAN,
    skipped      BOOLEAN NOT NULL DEFAULT false,
    counts       JSONB,
    error_code   TEXT
);
CREATE INDEX IF NOT EXISTS idx_book_ops_run_started ON public.book_ops_run (started_at DESC);

-- Erişim kaydı (türetilmiş): mevcut test satırları için kaynak satırı açılmaz (backfill yok);
-- bu satırlar ilk recompute'ta kaynağı olmadığı için kaldırılır. Yazar erişimi rol ile (book-token / book-content).

-- ------------------------------------------------------------ RLS ve haklar
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['book_app_settings','book_access_state','book_entitlement_source','book_refund_operation',
                           'book_mail_outbox','book_rate_limit','book_policy_version','book_ops_lock','book_ops_run']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
  END LOOP;
END $$;

-- ------------------------------------------------------------ yardımcılar
CREATE OR REPLACE FUNCTION public.book_is_admin(p_actor UUID) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, public AS $$
  SELECT p_actor IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.user_roles r WHERE r.user_id = p_actor AND r.role = 'admin'::public.app_role)
$$;

-- Erişimi kaynaklardan yeniden hesaplar. Kullanıcı+ürün kilidi: book_access_state satırı (FOR UPDATE).
-- epoch yalnız active değiştiğinde artar; iptalden sonra yeniden açılan erişim eski token'ı geçersiz kılar.
CREATE OR REPLACE FUNCTION public.book_recompute_access(p_user UUID, p_product TEXT)
RETURNS TABLE (active BOOLEAN, epoch BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  st public.book_access_state%ROWTYPE;
  v_active BOOLEAN;
  v_src public.book_entitlement_source%ROWTYPE;
BEGIN
  IF p_user IS NULL THEN RETURN; END IF;
  INSERT INTO public.book_access_state (user_id, product_code) VALUES (p_user, p_product)
    ON CONFLICT (user_id, product_code) DO NOTHING;
  SELECT * INTO st FROM public.book_access_state s
    WHERE s.user_id = p_user AND s.product_code = p_product FOR UPDATE;
  SELECT * INTO v_src FROM public.book_entitlement_source es
    WHERE es.user_id = p_user AND es.product_code = p_product AND es.revoked_at IS NULL
    ORDER BY es.granted_at LIMIT 1;
  v_active := FOUND;
  IF v_active IS DISTINCT FROM st.active THEN
    UPDATE public.book_access_state s SET active = v_active, epoch = s.epoch + 1, updated_at = now()
      WHERE s.user_id = p_user AND s.product_code = p_product
      RETURNING * INTO st;
  END IF;
  IF v_active THEN
    INSERT INTO public.book_entitlements (user_id, product_code, granted_by, note, order_id)
      VALUES (p_user, p_product, 'source:' || v_src.source_type, NULL, v_src.order_id)
      ON CONFLICT (user_id, product_code) DO UPDATE SET order_id = EXCLUDED.order_id, granted_by = EXCLUDED.granted_by;
  ELSE
    DELETE FROM public.book_entitlements e WHERE e.user_id = p_user AND e.product_code = p_product;
  END IF;
  active := st.active; epoch := st.epoch;
  RETURN NEXT;
END $$;

-- ------------------------------------------------------------ ödeme başlatma
-- Döner: {action: paused|owned|existing|conflict|open|new, order_id, status, payment_page_url, token_expires_at}
CREATE OR REPLACE FUNCTION public.book_checkout_begin(
  p_user UUID, p_product TEXT, p_idem_key TEXT, p_snapshot_hash TEXT, p_price NUMERIC, p_currency TEXT,
  p_lang TEXT, p_terms_version TEXT, p_terms_locale TEXT, p_consent_kinds TEXT[],
  p_email TEXT, p_gsm TEXT, p_ip TEXT, p_env TEXT, p_lease_seconds INTEGER DEFAULT 60)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  o public.book_orders%ROWTYPE;
  v_id UUID := gen_random_uuid();
BEGIN
  IF p_user IS NULL OR p_idem_key IS NULL OR length(p_idem_key) > 100 THEN
    RAISE EXCEPTION 'bad_request' USING ERRCODE = '22023';
  END IF;
  IF NOT (SELECT checkout_enabled FROM public.book_app_settings WHERE id = 1) THEN
    RETURN jsonb_build_object('action', 'paused');
  END IF;
  -- Aynı Idempotency-Key: aynı içerik → aynı iş; farklı içerik → çatışma
  SELECT * INTO o FROM public.book_orders WHERE user_id = p_user AND idempotency_key = p_idem_key;
  IF FOUND THEN
    IF o.snapshot_hash IS DISTINCT FROM p_snapshot_hash THEN
      RETURN jsonb_build_object('action', 'conflict', 'order_id', o.id);
    END IF;
    RETURN jsonb_build_object('action', 'existing', 'order_id', o.id, 'status', o.status,
      'payment_page_url', o.payment_page_url, 'token_expires_at', o.token_expires_at);
  END IF;
  -- Etkin erişim varsa ödeme yok
  IF EXISTS (SELECT 1 FROM public.book_access_state s WHERE s.user_id = p_user AND s.product_code = p_product AND s.active) THEN
    RETURN jsonb_build_object('action', 'owned');
  END IF;
  -- Açık sipariş varsa yeni oturum yok (inceleme/uyuşmazlık dahil; süre dolması kapanış değildir)
  SELECT * INTO o FROM public.book_orders
    WHERE user_id = p_user AND product_code = p_product AND provider_env <> 'legacy_test'
      AND status IN ('created','initialized','unknown','review','mismatch')
    ORDER BY created_at DESC LIMIT 1;
  IF FOUND THEN
    RETURN jsonb_build_object('action', 'open', 'order_id', o.id, 'status', o.status,
      'payment_page_url', o.payment_page_url, 'token_expires_at', o.token_expires_at);
  END IF;
  BEGIN
    INSERT INTO public.book_orders (id, user_id, product_code, lang, conversation_id, basket_id, price, currency, status,
      consent_at, buyer_email, buyer_gsm, buyer_ip, idempotency_key, snapshot_hash, terms_version, terms_locale,
      consent_kinds, provider_env, lease_until, next_reconcile_at)
    VALUES (v_id, p_user, p_product, p_lang, v_id::text, v_id::text, p_price, p_currency, 'created',
      now(), p_email, p_gsm, p_ip, p_idem_key, p_snapshot_hash, p_terms_version, p_terms_locale,
      p_consent_kinds, p_env, now() + make_interval(secs => p_lease_seconds), now() + interval '2 minutes');
  EXCEPTION WHEN unique_violation THEN
    -- Eşzamanlı istek kazandı: onun sonucunu döndür
    SELECT * INTO o FROM public.book_orders WHERE user_id = p_user AND idempotency_key = p_idem_key;
    IF FOUND THEN
      IF o.snapshot_hash IS DISTINCT FROM p_snapshot_hash THEN
        RETURN jsonb_build_object('action', 'conflict', 'order_id', o.id);
      END IF;
      RETURN jsonb_build_object('action', 'existing', 'order_id', o.id, 'status', o.status,
        'payment_page_url', o.payment_page_url, 'token_expires_at', o.token_expires_at);
    END IF;
    SELECT * INTO o FROM public.book_orders
      WHERE user_id = p_user AND product_code = p_product AND provider_env <> 'legacy_test'
        AND status IN ('created','initialized','unknown','review','mismatch')
      ORDER BY created_at DESC LIMIT 1;
    RETURN jsonb_build_object('action', 'open', 'order_id', o.id, 'status', o.status,
      'payment_page_url', o.payment_page_url, 'token_expires_at', o.token_expires_at);
  END;
  RETURN jsonb_build_object('action', 'new', 'order_id', v_id, 'status', 'created');
END $$;

-- Sağlayıcı oturumu açıldı (yalnız created iken; lease süresi içinde ya da sonrasında aynı sipariş)
CREATE OR REPLACE FUNCTION public.book_checkout_initialized(
  p_order UUID, p_token TEXT, p_page_url TEXT, p_token_expires_at TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  UPDATE public.book_orders SET status = 'initialized', iyzico_token = p_token, payment_page_url = p_page_url,
    token_expires_at = p_token_expires_at, lease_until = NULL, version = version + 1,
    next_reconcile_at = p_token_expires_at + interval '2 minutes'
  WHERE id = p_order AND status IN ('created','unknown');
  RETURN FOUND;
END $$;

-- Başlatma sonucu: 'failed' = sağlayıcı kesin hata döndü (oturum yok); 'unknown' = ağ/timeout (oturum açılmış olabilir)
CREATE OR REPLACE FUNCTION public.book_checkout_init_result(p_order UUID, p_kind TEXT, p_error_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE v TEXT;
BEGIN
  IF p_kind NOT IN ('failed','unknown') THEN RAISE EXCEPTION 'bad_kind'; END IF;
  UPDATE public.book_orders SET status = p_kind, review_note = left(p_error_code, 60), lease_until = NULL,
    version = version + 1, next_reconcile_at = CASE WHEN p_kind = 'unknown' THEN now() + interval '1 minute' END
  WHERE id = p_order AND status = 'created'
  RETURNING status INTO v;
  RETURN v;
END $$;

-- ------------------------------------------------------------ tek işlem fonksiyonu
-- p_fact: provider-map.ts'nin normalize ettiği sonuç:
--  {kind: approved|review|rejected|failure|pending|not_found, payment_id, payment_transaction_id, payment_status,
--   fraud_status, price, paid_price, currency, conversation_id, basket_id, item_transactions, raw_schema}
-- Tutar/döviz/sepet eşleşmesine SQL karar verir (otorite). Durum asla geriye gitmez.
CREATE OR REPLACE FUNCTION public.book_apply_payment_result(p_order UUID, p_source TEXT, p_fact JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  o public.book_orders%ROWTYPE;
  v_kind TEXT := p_fact->>'kind';
  v_match BOOLEAN;
  v_outbox UUID;
  v_src UUID;
  v_paid NUMERIC;
BEGIN
  SELECT * INTO o FROM public.book_orders WHERE id = p_order FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('outcome', 'not_found'); END IF;
  IF p_source NOT IN ('callback','webhook','reconcile','ifn','status') THEN RAISE EXCEPTION 'bad_source'; END IF;

  -- Terminal durumlar
  IF o.status IN ('refunded','expired') THEN
    RETURN jsonb_build_object('outcome', 'unchanged', 'status', o.status);
  END IF;
  IF o.status = 'paid' THEN
    IF v_kind = 'rejected' THEN
      -- İnceleme sonrası red (fraud -1): iyzico iadeyi yapar; erişim kapanır, bildirim gider.
      UPDATE public.book_orders SET status = 'refunded', refunded_at = now(), fraud_status = -1, source = p_source,
        version = version + 1 WHERE id = o.id;
      UPDATE public.book_entitlement_source SET revoked_at = now(), revoke_reason = 'fraud_rejected'
        WHERE order_id = o.id AND source_type = 'purchase' AND revoked_at IS NULL;
      PERFORM public.book_recompute_access(o.user_id, o.product_code);
      IF o.user_id IS NOT NULL THEN
        INSERT INTO public.book_mail_outbox (event_key, kind, order_id, user_id, recipient, lang, payload)
          VALUES ('fraud_refund:' || o.id, 'refund', o.id, o.user_id, o.buyer_email, o.lang,
                  jsonb_build_object('amount', coalesce(o.paid_price, o.price)))
          ON CONFLICT (event_key) DO NOTHING RETURNING id INTO v_outbox;
      END IF;
      RETURN jsonb_build_object('outcome', 'refunded', 'outbox_id', v_outbox);
    END IF;
    -- Onarım: paid ama kaynak yoksa (önceki yarış/kesinti) aç; idempotent.
    IF o.user_id IS NOT NULL THEN
      INSERT INTO public.book_entitlement_source (user_id, product_code, source_type, order_id)
        VALUES (o.user_id, o.product_code, 'purchase', o.id) ON CONFLICT DO NOTHING;
      PERFORM public.book_recompute_access(o.user_id, o.product_code);
    END IF;
    RETURN jsonb_build_object('outcome', 'already_paid');
  END IF;
  IF o.status = 'failed' THEN
    IF v_kind = 'approved' THEN
      UPDATE public.book_orders SET review_note = 'conflict:approved_after_failed', next_reconcile_at = NULL WHERE id = o.id;
      RETURN jsonb_build_object('outcome', 'conflict');
    END IF;
    RETURN jsonb_build_object('outcome', 'unchanged', 'status', o.status);
  END IF;
  -- expired_confirmed: sağlayıcı "ödeme yok" demişti; sonradan onaylı ödeme görünürse para gerçektir → paid'e izin verilir.

  -- Açık durumlar: created, initialized, unknown, review, mismatch, expired_confirmed
  IF v_kind = 'approved' THEN
    v_paid := nullif(p_fact->>'paid_price', '')::numeric;
    v_match := (p_fact->>'conversation_id') = o.conversation_id
           AND (p_fact->>'basket_id') = o.basket_id
           AND coalesce(p_fact->>'currency', '') = o.currency
           AND nullif(p_fact->>'price', '')::numeric = o.price
           AND v_paid = o.price;
    IF NOT v_match THEN
      UPDATE public.book_orders SET status = 'mismatch', source = p_source, version = version + 1,
        iyzico_payment_id = coalesce(p_fact->>'payment_id', iyzico_payment_id),
        payment_status = p_fact->>'payment_status', paid_price = v_paid,
        review_note = 'mismatch', next_reconcile_at = NULL
      WHERE id = o.id;
      RETURN jsonb_build_object('outcome', 'mismatch');
    END IF;
    UPDATE public.book_orders SET status = 'paid', paid_at = now(), source = p_source, version = version + 1,
      iyzico_payment_id = p_fact->>'payment_id',
      iyzico_payment_transaction_id = p_fact->>'payment_transaction_id',
      payment_status = p_fact->>'payment_status',
      fraud_status = nullif(p_fact->>'fraud_status', '')::int,
      paid_price = v_paid, item_transactions = p_fact->'item_transactions',
      raw_schema = nullif(p_fact->>'raw_schema', '')::int,
      next_reconcile_at = NULL, lease_until = NULL
    WHERE id = o.id;
    IF o.user_id IS NULL THEN
      -- Hesap silinmiş: ödeme kaydı tutulur; hak ve e-posta üretilmez.
      RETURN jsonb_build_object('outcome', 'paid', 'orphan', true);
    END IF;
    INSERT INTO public.book_entitlement_source (user_id, product_code, source_type, order_id)
      VALUES (o.user_id, o.product_code, 'purchase', o.id) ON CONFLICT DO NOTHING RETURNING id INTO v_src;
    PERFORM public.book_recompute_access(o.user_id, o.product_code);
    INSERT INTO public.book_mail_outbox (event_key, kind, order_id, user_id, recipient, lang, payload)
      VALUES ('receipt:' || o.id, 'receipt', o.id, o.user_id, o.buyer_email, o.lang,
              jsonb_build_object('amount', v_paid, 'paid_at', now()))
      ON CONFLICT (event_key) DO NOTHING RETURNING id INTO v_outbox;
    RETURN jsonb_build_object('outcome', 'paid', 'outbox_id', v_outbox);
  ELSIF v_kind = 'review' THEN
    UPDATE public.book_orders SET status = 'review', source = p_source, version = version + 1, fraud_status = 0,
      iyzico_payment_id = p_fact->>'payment_id', iyzico_payment_transaction_id = p_fact->>'payment_transaction_id',
      payment_status = p_fact->>'payment_status', paid_price = nullif(p_fact->>'paid_price', '')::numeric,
      next_reconcile_at = now() + interval '30 minutes'
    WHERE id = o.id;
    RETURN jsonb_build_object('outcome', 'review');
  ELSIF v_kind IN ('rejected','failure') THEN
    UPDATE public.book_orders SET status = 'failed', source = p_source, version = version + 1,
      fraud_status = CASE WHEN v_kind = 'rejected' THEN -1 ELSE fraud_status END,
      payment_status = p_fact->>'payment_status', next_reconcile_at = NULL, lease_until = NULL
    WHERE id = o.id;
    RETURN jsonb_build_object('outcome', 'failed');
  ELSIF v_kind = 'not_found' THEN
    -- Yalnız token süresi dolmuşsa ve sağlayıcı ödeme kaydı yok diyorsa kapanır.
    IF o.status IN ('created','initialized','unknown') AND coalesce(o.token_expires_at, o.created_at + interval '30 minutes') < now() THEN
      UPDATE public.book_orders SET status = 'expired_confirmed', source = p_source, version = version + 1,
        next_reconcile_at = NULL, lease_until = NULL WHERE id = o.id;
      RETURN jsonb_build_object('outcome', 'expired_confirmed');
    END IF;
    RETURN jsonb_build_object('outcome', 'unchanged', 'status', o.status);
  ELSIF v_kind = 'pending' THEN
    UPDATE public.book_orders SET payment_status = p_fact->>'payment_status' WHERE id = o.id;
    RETURN jsonb_build_object('outcome', 'unchanged', 'status', o.status);
  END IF;
  RAISE EXCEPTION 'bad_kind %', v_kind;
END $$;

-- ------------------------------------------------------------ iade
CREATE OR REPLACE FUNCTION public.book_begin_refund(p_order UUID, p_amount NUMERIC, p_actor UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  o public.book_orders%ROWTYPE;
  op public.book_refund_operation%ROWTYPE;
  v_settled NUMERIC;
  v_remaining NUMERIC;
  v_amount NUMERIC;
BEGIN
  IF NOT public.book_is_admin(p_actor) THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  IF NOT (SELECT refunds_enabled FROM public.book_app_settings WHERE id = 1) THEN
    RETURN jsonb_build_object('action', 'paused');
  END IF;
  SELECT * INTO o FROM public.book_orders WHERE id = p_order FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('action', 'not_found'); END IF;
  SELECT * INTO op FROM public.book_refund_operation WHERE order_id = o.id AND state IN ('requested','unknown');
  IF FOUND THEN
    RETURN jsonb_build_object('action', 'existing', 'op_id', op.id, 'state', op.state, 'amount', op.amount);
  END IF;
  IF o.status NOT IN ('paid','review') OR o.iyzico_payment_id IS NULL THEN
    RETURN jsonb_build_object('action', 'not_refundable', 'status', o.status);
  END IF;
  SELECT coalesce(sum(settled_amount), 0) INTO v_settled FROM public.book_refund_operation
    WHERE order_id = o.id AND state = 'settled';
  v_remaining := coalesce(o.paid_price, o.price) - v_settled;
  v_amount := coalesce(p_amount, v_remaining);
  IF v_amount <= 0 OR v_amount > v_remaining THEN
    RETURN jsonb_build_object('action', 'amount_invalid', 'remaining', v_remaining);
  END IF;
  INSERT INTO public.book_refund_operation (order_id, amount, currency, requested_by, next_reconcile_at)
    VALUES (o.id, v_amount, o.currency, p_actor, now() + interval '10 minutes') RETURNING * INTO op;
  RETURN jsonb_build_object('action', 'new', 'op_id', op.id, 'amount', op.amount, 'currency', op.currency,
    'payment_id', o.iyzico_payment_id, 'remaining_before', v_remaining);
END $$;

-- p_result: {kind: success|failure|unknown|needs_review, provider_refund_id, amount, currency, error_code}
-- success: tutar ve döviz yerel işlemle eşleşmeli; eşleşmezse needs_review. Toplam tam tutara ulaşınca satın alma kaynağı kapanır.
CREATE OR REPLACE FUNCTION public.book_apply_refund_result(p_op UUID, p_result JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  op public.book_refund_operation%ROWTYPE;
  o public.book_orders%ROWTYPE;
  v_kind TEXT := p_result->>'kind';
  v_total NUMERIC;
  v_outbox UUID;
BEGIN
  SELECT * INTO op FROM public.book_refund_operation WHERE id = p_op FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('outcome', 'not_found'); END IF;
  SELECT * INTO o FROM public.book_orders WHERE id = op.order_id FOR UPDATE;
  IF op.state IN ('settled','failed','needs_review') THEN
    RETURN jsonb_build_object('outcome', 'unchanged', 'state', op.state);
  END IF;
  IF v_kind = 'unknown' THEN
    UPDATE public.book_refund_operation SET state = 'unknown', attempts = attempts + 1,
      next_reconcile_at = now() + interval '5 minutes', lease_until = NULL WHERE id = op.id;
    RETURN jsonb_build_object('outcome', 'unknown');
  ELSIF v_kind = 'failure' THEN
    UPDATE public.book_refund_operation SET state = 'failed', error_code = left(p_result->>'error_code', 40),
      next_reconcile_at = NULL, lease_until = NULL WHERE id = op.id;
    RETURN jsonb_build_object('outcome', 'failed');
  ELSIF v_kind = 'needs_review' THEN
    -- Raporlamada tek anlamlı eşleşme yok (kimlik/tutar/döviz/durum): kapatılmaz, elle incelenir
    UPDATE public.book_refund_operation SET state = 'needs_review', error_code = left(coalesce(p_result->>'error_code', 'ambiguous_match'), 40),
      next_reconcile_at = NULL, lease_until = NULL WHERE id = op.id;
    RETURN jsonb_build_object('outcome', 'needs_review');
  ELSIF v_kind <> 'success' THEN
    RAISE EXCEPTION 'bad_kind %', v_kind;
  END IF;
  IF nullif(p_result->>'amount', '')::numeric IS DISTINCT FROM op.amount
     OR coalesce(p_result->>'currency', '') <> op.currency THEN
    UPDATE public.book_refund_operation SET state = 'needs_review', provider_refund_id = p_result->>'provider_refund_id',
      error_code = 'amount_or_currency_mismatch', next_reconcile_at = NULL, lease_until = NULL WHERE id = op.id;
    RETURN jsonb_build_object('outcome', 'needs_review');
  END IF;
  UPDATE public.book_refund_operation SET state = 'settled', settled_amount = op.amount, settled_at = now(),
    provider_refund_id = p_result->>'provider_refund_id', next_reconcile_at = NULL, lease_until = NULL WHERE id = op.id;
  SELECT coalesce(sum(settled_amount), 0) INTO v_total FROM public.book_refund_operation
    WHERE order_id = o.id AND state = 'settled';
  IF o.user_id IS NOT NULL THEN
    INSERT INTO public.book_mail_outbox (event_key, kind, order_id, user_id, recipient, lang, payload)
      VALUES ('refund:' || op.id, 'refund', o.id, o.user_id, o.buyer_email, o.lang,
              jsonb_build_object('amount', op.amount, 'currency', op.currency,
                                 'full', v_total >= coalesce(o.paid_price, o.price)))
      ON CONFLICT (event_key) DO NOTHING RETURNING id INTO v_outbox;
  END IF;
  IF v_total >= coalesce(o.paid_price, o.price) THEN
    UPDATE public.book_orders SET status = 'refunded', refunded_at = now(), version = version + 1 WHERE id = o.id;
    UPDATE public.book_entitlement_source SET revoked_at = now(), revoked_by = op.requested_by, revoke_reason = 'refund'
      WHERE order_id = o.id AND source_type = 'purchase' AND revoked_at IS NULL;
    PERFORM public.book_recompute_access(o.user_id, o.product_code);
    RETURN jsonb_build_object('outcome', 'refunded', 'outbox_id', v_outbox, 'total', v_total);
  END IF;
  RETURN jsonb_build_object('outcome', 'partial', 'outbox_id', v_outbox, 'total', v_total);
END $$;

-- ------------------------------------------------------------ elle erişim
CREATE OR REPLACE FUNCTION public.book_grant_manual(p_user UUID, p_product TEXT, p_actor UUID, p_note TEXT, p_lang TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  v_src UUID;
  v_outbox UUID;
  v_email TEXT;
BEGIN
  IF NOT public.book_is_admin(p_actor) THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = p_user;
  IF NOT FOUND THEN RETURN jsonb_build_object('action', 'user_not_found'); END IF;
  -- Kullanıcı+ürün kilidi önce alınır (eşzamanlı satın alma/iade ile sıralı)
  PERFORM 1 FROM public.book_access_state WHERE user_id = p_user AND product_code = p_product FOR UPDATE;
  INSERT INTO public.book_entitlement_source (user_id, product_code, source_type, granted_by, note)
    VALUES (p_user, p_product, 'manual', p_actor, left(p_note, 200)) RETURNING id INTO v_src;
  PERFORM public.book_recompute_access(p_user, p_product);
  INSERT INTO public.book_mail_outbox (event_key, kind, user_id, recipient, lang, payload)
    VALUES ('grant:' || v_src, 'grant', p_user, v_email, coalesce(p_lang, 'tr'), '{}'::jsonb)
    ON CONFLICT (event_key) DO NOTHING RETURNING id INTO v_outbox;
  RETURN jsonb_build_object('action', 'granted', 'source_id', v_src, 'outbox_id', v_outbox);
END $$;

CREATE OR REPLACE FUNCTION public.book_revoke_source(p_source UUID, p_actor UUID, p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE s public.book_entitlement_source%ROWTYPE;
BEGIN
  IF NOT public.book_is_admin(p_actor) THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  SELECT * INTO s FROM public.book_entitlement_source WHERE id = p_source;
  IF NOT FOUND THEN RETURN jsonb_build_object('action', 'not_found'); END IF;
  PERFORM 1 FROM public.book_access_state WHERE user_id = s.user_id AND product_code = s.product_code FOR UPDATE;
  UPDATE public.book_entitlement_source SET revoked_at = now(), revoked_by = p_actor, revoke_reason = left(p_reason, 100)
    WHERE id = p_source AND revoked_at IS NULL;
  PERFORM public.book_recompute_access(s.user_id, s.product_code);
  RETURN jsonb_build_object('action', 'revoked');
END $$;

-- Elle erişim için alıcıyı TAM e-posta eşleşmesiyle bulur (alt-dize/sayfalama sorunu yok); yalnız kimlik ve dil döner.
CREATE OR REPLACE FUNCTION public.book_find_user_by_email(p_email TEXT)
RETURNS TABLE (user_id UUID, lang TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, public AS $$
  SELECT u.id, CASE WHEN u.raw_user_meta_data->>'lang' = 'en' THEN 'en' ELSE 'tr' END
  FROM auth.users u WHERE lower(u.email) = lower(trim(p_email)) LIMIT 2
$$;

-- ------------------------------------------------------------ okuma erişimi (book-token / book-content)
CREATE OR REPLACE FUNCTION public.book_access_check(p_user UUID, p_product TEXT)
RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, public AS $$
  SELECT jsonb_build_object(
    'active', coalesce((SELECT s.active FROM public.book_access_state s WHERE s.user_id = p_user AND s.product_code = p_product), false),
    'epoch',  coalesce((SELECT s.epoch  FROM public.book_access_state s WHERE s.user_id = p_user AND s.product_code = p_product), 0),
    'admin',  public.book_is_admin(p_user))
$$;

-- ------------------------------------------------------------ e-posta kuyruğu
-- Sahiplenme: önce 24 saati aşan belirsiz gönderimler needs_review; erişimi kalmayan receipt/grant suppressed.
-- Süresi dolmuş lease (sending) belirsizdir: 24 saat içindeyse aynı Idempotency-Key (event_key) ile yeniden denenir.
CREATE OR REPLACE FUNCTION public.book_claim_outbox(p_limit INTEGER, p_lease_seconds INTEGER, p_only UUID DEFAULT NULL)
RETURNS SETOF public.book_mail_outbox
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  UPDATE public.book_mail_outbox SET state = 'needs_review', lease_until = NULL, last_error_code = 'uncertain_over_24h'
    WHERE state = 'sending' AND lease_until < now() AND first_attempt_at < now() - interval '24 hours'
      AND (p_only IS NULL OR id = p_only);
  UPDATE public.book_mail_outbox m SET state = 'suppressed', lease_until = NULL, last_error_code = 'access_inactive'
    WHERE m.kind IN ('receipt','grant') AND m.state IN ('pending','retry')
      AND (p_only IS NULL OR m.id = p_only)
      AND NOT EXISTS (SELECT 1 FROM public.book_access_state s
                      WHERE s.user_id = m.user_id AND s.active);
  RETURN QUERY
  WITH c AS (
    SELECT id FROM public.book_mail_outbox
    WHERE (p_only IS NULL OR id = p_only)
      AND ((state IN ('pending','retry') AND coalesce(next_attempt_at, '-infinity') <= now())
           OR (state = 'sending' AND lease_until < now()))
      AND recipient IS NOT NULL
    ORDER BY created_at
    LIMIT greatest(1, least(p_limit, 50))
    FOR UPDATE SKIP LOCKED)
  UPDATE public.book_mail_outbox m SET state = 'sending', attempts = m.attempts + 1,
    first_attempt_at = coalesce(m.first_attempt_at, now()),
    lease_until = now() + make_interval(secs => p_lease_seconds), lease_version = m.lease_version + 1
  FROM c WHERE m.id = c.id
  RETURNING m.*;
END $$;

-- p_result: {ok, provider_message_id, error_code, permanent}
CREATE OR REPLACE FUNCTION public.book_complete_outbox(p_id UUID, p_lease_version INTEGER, p_result JSONB)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE m public.book_mail_outbox%ROWTYPE; v TEXT;
BEGIN
  SELECT * INTO m FROM public.book_mail_outbox WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR m.state <> 'sending' OR m.lease_version <> p_lease_version THEN
    RETURN 'stale';
  END IF;
  IF (p_result->>'ok')::boolean THEN
    v := 'accepted';
    UPDATE public.book_mail_outbox SET state = v, accepted_at = now(), provider_message_id = left(p_result->>'provider_message_id', 100),
      lease_until = NULL, last_error_code = NULL WHERE id = p_id;
  ELSIF coalesce((p_result->>'permanent')::boolean, false) THEN
    v := 'failed';
    UPDATE public.book_mail_outbox SET state = v, lease_until = NULL, last_error_code = left(p_result->>'error_code', 40) WHERE id = p_id;
  ELSIF m.first_attempt_at < now() - interval '24 hours' THEN
    v := 'needs_review';
    UPDATE public.book_mail_outbox SET state = v, lease_until = NULL, last_error_code = left(p_result->>'error_code', 40) WHERE id = p_id;
  ELSE
    v := 'retry';
    UPDATE public.book_mail_outbox SET state = v, lease_until = NULL, last_error_code = left(p_result->>'error_code', 40),
      next_attempt_at = now() + make_interval(mins => least(60, (2 ^ least(m.attempts, 6))::int)) WHERE id = p_id;
  END IF;
  RETURN v;
END $$;

-- ------------------------------------------------------------ uzlaştırma
CREATE OR REPLACE FUNCTION public.book_claim_reconcile(p_limit INTEGER, p_lease_seconds INTEGER)
RETURNS TABLE (id UUID, conversation_id TEXT, lang TEXT, status TEXT, iyzico_payment_id TEXT, token_expires_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  RETURN QUERY
  WITH c AS (
    SELECT o.id FROM public.book_orders o
    WHERE o.status IN ('created','initialized','unknown','review') AND o.provider_env <> 'legacy_test'
      AND coalesce(o.next_reconcile_at, '-infinity') <= now()
      AND coalesce(o.reconcile_lease_until, '-infinity') < now()
      AND (o.status <> 'created' OR o.lease_until < now())
    ORDER BY o.next_reconcile_at NULLS FIRST
    LIMIT greatest(1, least(p_limit, 50))
    FOR UPDATE SKIP LOCKED)
  UPDATE public.book_orders o SET reconcile_lease_until = now() + make_interval(secs => p_lease_seconds),
    reconcile_attempts = o.reconcile_attempts + 1,
    next_reconcile_at = now() + make_interval(mins => least(240, 5 * (2 ^ least(o.reconcile_attempts, 6))::int))
  FROM c WHERE o.id = c.id
  RETURNING o.id, o.conversation_id, o.lang, o.status, o.iyzico_payment_id, o.token_expires_at;
END $$;

CREATE OR REPLACE FUNCTION public.book_claim_refund_reconcile(p_limit INTEGER, p_lease_seconds INTEGER)
RETURNS TABLE (op_id UUID, order_id UUID, amount NUMERIC, currency TEXT, payment_id TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  RETURN QUERY
  WITH c AS (
    SELECT r.id FROM public.book_refund_operation r
    WHERE r.state IN ('requested','unknown') AND coalesce(r.next_reconcile_at, '-infinity') <= now()
      AND coalesce(r.lease_until, '-infinity') < now()
    ORDER BY r.created_at LIMIT greatest(1, least(p_limit, 50))
    FOR UPDATE SKIP LOCKED)
  UPDATE public.book_refund_operation r SET lease_until = now() + make_interval(secs => p_lease_seconds),
    attempts = r.attempts + 1,
    next_reconcile_at = now() + make_interval(mins => least(240, 5 * (2 ^ least(r.attempts, 6))::int))
  FROM c, public.book_orders o WHERE r.id = c.id AND o.id = r.order_id
  RETURNING r.id, r.order_id, r.amount, r.currency, o.iyzico_payment_id, r.created_at;
END $$;

-- ------------------------------------------------------------ hız sınırı (iki kovalı kayan pencere, atomik)
CREATE OR REPLACE FUNCTION public.book_rate_hit(p_key TEXT, p_limit INTEGER, p_window_s INTEGER)
RETURNS TABLE (allowed BOOLEAN, retry_after INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_win TIMESTAMPTZ;
  v_cur INTEGER;
  v_prev INTEGER;
  v_elapsed DOUBLE PRECISION;
BEGIN
  IF p_key IS NULL OR length(p_key) > 200 OR p_window_s <= 0 OR p_limit <= 0 THEN
    RAISE EXCEPTION 'bad_request' USING ERRCODE = '22023';
  END IF;
  v_win := to_timestamp(floor(extract(epoch FROM v_now) / p_window_s) * p_window_s);
  v_elapsed := extract(epoch FROM (v_now - v_win));
  INSERT INTO public.book_rate_limit AS r (key, window_start, hits) VALUES (p_key, v_win, 1)
    ON CONFLICT (key, window_start) DO UPDATE SET hits = r.hits + 1 RETURNING r.hits INTO v_cur;
  SELECT r.hits INTO v_prev FROM public.book_rate_limit r
    WHERE r.key = p_key AND r.window_start = v_win - make_interval(secs => p_window_s);
  allowed := coalesce(v_prev, 0) * (1 - v_elapsed / p_window_s) + v_cur <= p_limit;
  retry_after := CASE WHEN allowed THEN 0 ELSE greatest(1, ceil(p_window_s - v_elapsed))::int END;
  RETURN NEXT;
END $$;

-- ------------------------------------------------------------ worker kilidi ve kayıtları
CREATE OR REPLACE FUNCTION public.book_ops_begin(p_lease_seconds INTEGER)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE v_run UUID := gen_random_uuid();
BEGIN
  UPDATE public.book_ops_lock SET holder = v_run, lease_until = now() + make_interval(secs => p_lease_seconds)
    WHERE id = 1 AND lease_until < now();
  IF NOT FOUND THEN
    INSERT INTO public.book_ops_run (id, finished_at, ok, skipped) VALUES (v_run, now(), true, true);
    RETURN jsonb_build_object('acquired', false, 'run_id', v_run);
  END IF;
  INSERT INTO public.book_ops_run (id) VALUES (v_run);
  RETURN jsonb_build_object('acquired', true, 'run_id', v_run);
END $$;

CREATE OR REPLACE FUNCTION public.book_ops_finish(p_run UUID, p_ok BOOLEAN, p_counts JSONB, p_error_code TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  UPDATE public.book_ops_run SET finished_at = now(), ok = p_ok, counts = p_counts, error_code = left(p_error_code, 60)
    WHERE id = p_run;
  UPDATE public.book_ops_lock SET holder = NULL, lease_until = '-infinity' WHERE id = 1 AND holder = p_run;
  DELETE FROM public.book_rate_limit WHERE window_start < now() - interval '1 day';
  DELETE FROM public.book_ops_run WHERE started_at < now() - interval '30 days';
END $$;

-- İzleme: tek satır, /yonetim ve SQL Editor için
CREATE OR REPLACE VIEW public.book_ops_health WITH (security_invoker = true) AS
SELECT
  (SELECT max(finished_at) FROM public.book_ops_run WHERE ok AND NOT skipped) AS last_ok_run,
  (SELECT count(*) FROM public.book_mail_outbox WHERE state = 'needs_review') AS outbox_needs_review,
  (SELECT count(*) FROM public.book_mail_outbox WHERE state IN ('pending','retry') AND created_at < now() - interval '1 hour') AS outbox_stale,
  (SELECT count(*) FROM public.book_orders WHERE status IN ('created','initialized','unknown','review','mismatch')
     AND provider_env <> 'legacy_test' AND created_at < now() - interval '1 hour') AS open_orders_over_1h,
  (SELECT count(*) FROM public.book_orders WHERE status = 'mismatch') AS orders_mismatch,
  (SELECT count(*) FROM public.book_orders WHERE review_note LIKE 'conflict:%') AS orders_conflict,
  (SELECT count(*) FROM public.book_refund_operation WHERE state IN ('unknown','needs_review')) AS refunds_attention,
  (SELECT count(*) FROM public.book_orders o WHERE o.status = 'paid' AND o.user_id IS NOT NULL AND o.provider_env <> 'legacy_test'
     AND NOT EXISTS (SELECT 1 FROM public.book_access_state s WHERE s.user_id = o.user_id AND s.product_code = o.product_code AND s.active)) AS paid_without_access,
  (SELECT count(*) FROM public.book_access_state s WHERE s.active
     AND NOT EXISTS (SELECT 1 FROM public.book_entitlement_source es WHERE es.user_id = s.user_id AND es.product_code = s.product_code AND es.revoked_at IS NULL)) AS access_without_source;
REVOKE ALL ON public.book_ops_health FROM anon, authenticated;

-- ------------------------------------------------------------ ayarlar (sunucu tarafı durdurma)
CREATE OR REPLACE FUNCTION public.book_set_app_setting(p_key TEXT, p_value BOOLEAN, p_actor UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  IF NOT public.book_is_admin(p_actor) THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  IF p_key = 'checkout_enabled' THEN
    UPDATE public.book_app_settings SET checkout_enabled = p_value, updated_at = now(), updated_by = p_actor WHERE id = 1;
  ELSIF p_key = 'refunds_enabled' THEN
    UPDATE public.book_app_settings SET refunds_enabled = p_value, updated_at = now(), updated_by = p_actor WHERE id = 1;
  ELSE
    RAISE EXCEPTION 'bad_key' USING ERRCODE = '22023';
  END IF;
  RETURN (SELECT to_jsonb(s) - 'id' FROM public.book_app_settings s WHERE id = 1);
END $$;

-- ------------------------------------------------------------ EXECUTE hakları: yalnız service_role
DO $$
DECLARE f TEXT;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure::text FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname IN (
      'book_is_admin','book_recompute_access','book_checkout_begin','book_checkout_initialized','book_checkout_init_result',
      'book_apply_payment_result','book_begin_refund','book_apply_refund_result','book_grant_manual','book_revoke_source',
      'book_access_check','book_claim_outbox','book_complete_outbox','book_claim_reconcile','book_claim_refund_reconcile',
      'book_rate_hit','book_ops_begin','book_ops_finish','book_set_app_setting','book_find_user_by_email')
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f);
  END LOOP;
END $$;

-- Mevcut tetikleyici fonksiyonu da Supabase varsayılan haklarından arındırılır (doğrudan çağrı anlamsız; hijyen)
REVOKE ALL ON FUNCTION public.book_orders_set_updated_at() FROM PUBLIC, anon, authenticated;

-- Bucket özel olmalı (satır sayısı uygulama sırasında doğrulanır: 1 beklenir)
UPDATE storage.buckets SET public = false WHERE id = 'book';
