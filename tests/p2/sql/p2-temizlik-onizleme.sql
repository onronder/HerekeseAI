-- Test kayıtları temizliği: ÖNİZLEME (salt okunur). Çalıştırma: python3 tests/p2/sql/sorgula.py tests/p2/sql/p2-temizlik-onizleme.sql
-- Kapsam (T): provider_env legacy_test ya da sandbox olan tüm siparişler + 2026-10-03 öncesi, ödeme kimliği olmayan,
-- failed durumundaki "live" siparişler (sandbox anahtarları canlı adrese giderken oluşan 1001 denemeleri).

-- 1) Silinecek siparişler (beklenen: legacy_test 6, sandbox 3, live 4 = 13)
select provider_env, status, count(*) adet, min(created_at)::date ilk, max(created_at)::date son
from public.book_orders
where provider_env in ('legacy_test','sandbox')
   or (provider_env = 'live' and status = 'failed' and iyzico_payment_id is null and paid_at is null and created_at < '2026-10-03')
group by 1, 2 order by 1, 2;

-- 2) Kapsam DIŞINDA kalan siparişler (beklenen: 0 satır)
select provider_env, status, count(*) from public.book_orders
where not (provider_env in ('legacy_test','sandbox')
   or (provider_env = 'live' and status = 'failed' and iyzico_payment_id is null and paid_at is null and created_at < '2026-10-03'))
group by 1, 2;

-- 3) Bağlı kayıtlar (silinecek)
select 'iade_islemi' tablo, count(*) from public.book_refund_operation where order_id in (select id from public.book_orders where provider_env in ('legacy_test','sandbox') or (provider_env = 'live' and status = 'failed' and iyzico_payment_id is null and paid_at is null and created_at < '2026-10-03'))
union all select 'erisim_kaynagi', count(*) from public.book_entitlement_source where order_id in (select id from public.book_orders where provider_env in ('legacy_test','sandbox') or (provider_env = 'live' and status = 'failed' and iyzico_payment_id is null and paid_at is null and created_at < '2026-10-03'))
union all select 'eposta_kuyrugu', count(*) from public.book_mail_outbox where order_id in (select id from public.book_orders where provider_env in ('legacy_test','sandbox') or (provider_env = 'live' and status = 'failed' and iyzico_payment_id is null and paid_at is null and created_at < '2026-10-03'))
union all select 'book_entitlements', count(*) from public.book_entitlements where order_id in (select id from public.book_orders where provider_env in ('legacy_test','sandbox') or (provider_env = 'live' and status = 'failed' and iyzico_payment_id is null and paid_at is null and created_at < '2026-10-03'))
union all select 'hiz_sinири_sayaci', count(*) from public.book_rate_limit;

-- 4) Korunanlar (silinmez): erişim durumu (epoch hiç sıfırlanmaz), elle kaynaklar, işletim kayıtları
select 'erisim_durumu' tablo, count(*) from public.book_access_state
union all select 'elle_kaynak', count(*) from public.book_entitlement_source where source_type = 'manual'
union all select 'isletim_calismasi', count(*) from public.book_ops_run;
