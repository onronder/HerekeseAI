-- P2.0 salt okunur envanter (Supabase SQL Editor'da çalıştırın). Yalnız SAYI ve TANIM döner; kişisel veri döndürmez.
-- Sonuçları (tablo çıktıları) paylaşmanız yeterli.

-- 1) Siparişler: durum dağılımı ve tarih aralığı
select status, count(*) as adet, min(created_at)::date as ilk, max(created_at)::date as son,
       count(*) filter (where iyzico_payment_id is not null) as odeme_kimligi_olan,
       count(*) filter (where receipt_sent_at is not null) as makbuz_giden
from public.book_orders group by status order by status;

-- 2) Erişim kayıtları: kaynak türüne göre (granted_by içeriği değil, yalnız biçimi)
select case when granted_by like 'iyzico:%' then granted_by
            when granted_by is null then '(boş)'
            else 'admin/elle' end as kaynak,
       count(*) as adet, count(*) filter (where order_id is not null) as siparise_bagli
from public.book_entitlements group by 1 order by 1;

-- 3) Tutarlılık sayımları
select
  (select count(*) from public.book_orders o where o.status = 'paid'
     and not exists (select 1 from public.book_entitlements e where e.user_id = o.user_id)) as paid_ama_erisim_yok,
  (select count(*) from public.book_entitlements e where e.order_id is not null
     and not exists (select 1 from public.book_orders o where o.id = e.order_id and o.status = 'paid')) as erisim_var_siparis_paid_degil,
  (select count(*) from (select user_id from public.book_orders where status = 'paid' group by user_id having count(*) > 1) x) as birden_cok_paid_kullanici,
  (select count(distinct user_id) from public.book_orders) as siparisli_kullanici;

-- 4) Bucket bayrağı
select id, public from storage.buckets where id = 'book';

-- 5) RLS ve politikalar (kitap tabloları)
select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename in ('book_orders','book_entitlements','user_roles');
select tablename, policyname, cmd, roles, qual from pg_policies where schemaname = 'public' and tablename in ('book_orders','book_entitlements','user_roles') order by 1,2;

-- 6) Sütun grant'ları (authenticated / anon)
select table_name, grantee, string_agg(column_name, ',' order by column_name) as sutunlar
from information_schema.column_privileges
where table_schema = 'public' and table_name in ('book_orders','book_entitlements') and grantee in ('anon','authenticated')
group by 1,2 order by 1,2;

-- 7) has_role tanımı ve EXECUTE hakları (P2 has_role'e dokunmaz; yalnız kayıt)
select p.proname, pg_get_function_identity_arguments(p.oid) as args, p.prosecdef as security_definer,
       array(select grantee::regrole::text from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) where privilege_type = 'EXECUTE') as execute_haklari
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('has_role');

-- 8) Eklentiler (pg_cron, pg_net, vault) mevcut mu
select extname, extversion from pg_extension where extname in ('pg_cron','pg_net','supabase_vault','pgcrypto') order by 1;

-- 9) book_orders ve book_entitlements'a bağlı tetikleyici/görünüm/fonksiyon var mı (P2 değişikliklerinin etkisi)
select event_object_table as tablo, trigger_name from information_schema.triggers where event_object_schema='public' and event_object_table in ('book_orders','book_entitlements');
select distinct v.view_name as gorunum, v.table_name as tablo from information_schema.view_table_usage v where v.table_schema='public' and v.table_name in ('book_orders','book_entitlements');
