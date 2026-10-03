-- ============================================================
-- P2 ek: satış koşullarının değişmez kanıtı (2026-10-03)
-- - book_policy_version: tam metin (content) + veritabanında doğrulanan SHA-256; satırlar değiştirilemez ve silinemez.
-- - book_orders.terms_hash: sipariş, kabul edilen bağlayıcı Türkçe metnin özetini taşır.
-- - book_checkout_begin: yayımlanmamış/eşleşmeyen koşul özetiyle sipariş açılmaz (terms_unavailable).
-- Metinler tools/site/terms.py ile üretilir (store/kosullar/*.txt, supabase/sql/kosullar-<sürüm>.sql).
-- ============================================================

ALTER TABLE public.book_policy_version DROP CONSTRAINT IF EXISTS book_policy_version_kind_check;
ALTER TABLE public.book_policy_version ADD CONSTRAINT book_policy_version_kind_check
  CHECK (kind IN ('pre_contract','distance_sales','privacy','terms_bundle'));
ALTER TABLE public.book_policy_version ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.book_policy_version DROP CONSTRAINT IF EXISTS book_policy_version_content_hash_check;
ALTER TABLE public.book_policy_version ADD CONSTRAINT book_policy_version_content_hash_check
  CHECK (content IS NULL OR content_hash = encode(sha256(convert_to(content, 'UTF8')), 'hex'));

CREATE OR REPLACE FUNCTION public.book_policy_version_immutable() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
BEGIN
  RAISE EXCEPTION 'book_policy_version satırları değiştirilemez ve silinemez (yeni sürüm ekleyin)' USING ERRCODE = '55000';
END $$;
REVOKE ALL ON FUNCTION public.book_policy_version_immutable() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_book_policy_version_immutable ON public.book_policy_version;
CREATE TRIGGER trg_book_policy_version_immutable BEFORE UPDATE OR DELETE ON public.book_policy_version
  FOR EACH ROW EXECUTE FUNCTION public.book_policy_version_immutable();

ALTER TABLE public.book_orders ADD COLUMN IF NOT EXISTS terms_hash TEXT;

-- Eski imza kaldırılır (yeni parametre eklendi); yetkiler yeniden yalnız service_role
DROP FUNCTION IF EXISTS public.book_checkout_begin(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT, TEXT, INTEGER);
CREATE OR REPLACE FUNCTION public.book_checkout_begin(
  p_user UUID, p_product TEXT, p_idem_key TEXT, p_snapshot_hash TEXT, p_price NUMERIC, p_currency TEXT,
  p_lang TEXT, p_terms_version TEXT, p_terms_locale TEXT, p_consent_kinds TEXT[],
  p_email TEXT, p_gsm TEXT, p_ip TEXT, p_env TEXT, p_lease_seconds INTEGER DEFAULT 60, p_terms_hash TEXT DEFAULT NULL)
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
  -- Kabul edilen koşullar: yayımlanmış ve değiştirilemez Türkçe metnin özeti eşleşmeli (sözleşme kanıtı)
  IF p_terms_hash IS NULL OR NOT EXISTS (
       SELECT 1 FROM public.book_policy_version v
       WHERE v.kind = 'terms_bundle' AND v.locale = 'tr' AND v.version = p_terms_version AND v.content_hash = p_terms_hash) THEN
    RETURN jsonb_build_object('action', 'terms_unavailable');
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
      consent_kinds, provider_env, lease_until, next_reconcile_at, terms_hash)
    VALUES (v_id, p_user, p_product, p_lang, v_id::text, v_id::text, p_price, p_currency, 'created',
      now(), p_email, p_gsm, p_ip, p_idem_key, p_snapshot_hash, p_terms_version, p_terms_locale,
      p_consent_kinds, p_env, now() + make_interval(secs => p_lease_seconds), now() + interval '2 minutes', p_terms_hash);
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
REVOKE ALL ON FUNCTION public.book_checkout_begin(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_checkout_begin(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT) TO service_role;
