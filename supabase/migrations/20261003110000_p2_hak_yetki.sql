-- P2 ek: book_entitlements tablo yetkileri daraltılır (derinlemesine savunma; RLS zaten açık).
-- İlk migration grant tanımlamadığı için Supabase varsayılanı anon/authenticated'a tüm yetkileri vermişti.
-- Tabloyu yalnız book_recompute_access (service rolü) yazar; istemci yalnız kendi satırının varlığını okur
-- (store.js hasBook: select id where user_id, product_code). granted_by/note (yönetici notu) istemciye kapalı.
REVOKE ALL ON public.book_entitlements FROM anon, authenticated;
GRANT SELECT (id, user_id, product_code) ON public.book_entitlements TO authenticated;
