-- ============================================================
-- Kitap satışı: iyzico Checkout Form siparişleri
-- Yetki (book_entitlements) yalnız sunucu tarafında doğrulanmış ödemeyle yazılır
-- (fulfil.ts). Bu tablo: audit + idempotency + mutabakat.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.book_orders (
    id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_code                  TEXT NOT NULL DEFAULT 'herkes-icin-yz',
    lang                          TEXT NOT NULL DEFAULT 'tr' CHECK (lang IN ('tr','en')),
    -- iyzico'ya gönderilen conversationId ve basketId = id::text (tek kimlik)
    conversation_id               TEXT NOT NULL UNIQUE,
    basket_id                     TEXT NOT NULL,
    price                         NUMERIC(10,2) NOT NULL,
    currency                      TEXT NOT NULL DEFAULT 'TRY',
    status                        TEXT NOT NULL DEFAULT 'created'
                                  CHECK (status IN ('created','initialized','paid','failed','review','refunded','expired')),
    iyzico_token                  TEXT UNIQUE,
    iyzico_payment_id             TEXT UNIQUE,
    iyzico_payment_transaction_id TEXT,
    fraud_status                  INTEGER,
    consent_at                    TIMESTAMPTZ NOT NULL,   -- cayma hakkı ön onayı (ödemeden ÖNCE)
    buyer_email                   TEXT NOT NULL,
    buyer_gsm                     TEXT,
    buyer_ip                      TEXT,
    receipt_sent_at               TIMESTAMPTZ,
    source                        TEXT,                    -- callback | webhook | reconcile | ifn | admin
    raw                           JSONB,                   -- son iyzico yanıtı (kart verisi yok; BIN/son 4 hane olabilir)
    created_at                    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                    TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at                       TIMESTAMPTZ,
    refunded_at                   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_book_orders_user ON public.book_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_orders_status ON public.book_orders(status, created_at);

CREATE OR REPLACE FUNCTION public.book_orders_set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_book_orders_updated ON public.book_orders;
CREATE TRIGGER trg_book_orders_updated BEFORE UPDATE ON public.book_orders
  FOR EACH ROW EXECUTE FUNCTION public.book_orders_set_updated_at();

ALTER TABLE public.book_orders ENABLE ROW LEVEL SECURITY;

-- Yazma politikası YOK: yalnız service role (edge functions) yazar.
-- Okuma: kullanıcı kendi siparişini görür; hassas sütunlar (raw, buyer_ip) sütun grant'ıyla gizli.
DROP POLICY IF EXISTS "Users can view their own book orders" ON public.book_orders;
CREATE POLICY "Users can view their own book orders"
ON public.book_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

REVOKE ALL ON public.book_orders FROM anon, authenticated;
GRANT SELECT (id, user_id, product_code, lang, status, price, currency, fraud_status, created_at, paid_at, refunded_at)
  ON public.book_orders TO authenticated;

-- Erişim hakkı → sipariş bağı (elle açılanlarda NULL kalır)
ALTER TABLE public.book_entitlements
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.book_orders(id) ON DELETE SET NULL;
