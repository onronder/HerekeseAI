-- ============================================================
-- "Herkes İçin Yapay Zekâ" — erişim hakları + private storage
-- Ödeme iyzilink'te (kayıt iyzico'da); burada yalnız erişim tutulur.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.book_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_code TEXT NOT NULL DEFAULT 'herkes-icin-yz',
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    granted_by TEXT,          -- açan admin e-postası (audit)
    note TEXT,                -- ör. iyzico işlem no
    UNIQUE (user_id, product_code)
);

CREATE INDEX IF NOT EXISTS idx_book_entitlements_user
    ON public.book_entitlements(user_id);

ALTER TABLE public.book_entitlements ENABLE ROW LEVEL SECURITY;

-- Kullanıcı yalnız kendi hakkını görür; yazma yalnız service-role (grant-book)
DROP POLICY IF EXISTS "Users can view their own book entitlements" ON public.book_entitlements;
CREATE POLICY "Users can view their own book entitlements"
ON public.book_entitlements
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Private bucket: filigran-yuvalı kitap ana kopyaları
INSERT INTO storage.buckets (id, name, public)
VALUES ('book', 'book', false)
ON CONFLICT (id) DO NOTHING;
