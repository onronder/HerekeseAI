-- Test kayıtları temizliği (YAZAR ONAYIYLA, tek sefer). Önce önizleme: tests/p2/sql/p2-temizlik-onizleme.sql
-- Çalıştırma: supabase db query --linked -f tests/p2/sql/p2-temizlik.sql
-- Güvenlik: tek transaction; sayılar beklenenden farklıysa ya da kapsamda ödenmiş/açık sipariş varsa HİÇBİR ŞEY silinmez.
-- Korunanlar: book_access_state (epoch hiç sıfırlanmaz), elle erişim kaynakları, book_ops_run, auth kullanıcıları.
begin;

create temp table t_orders as
select id, user_id, product_code, provider_env, status from public.book_orders
where provider_env in ('legacy_test','sandbox')
   or (provider_env = 'live' and status = 'failed' and iyzico_payment_id is null and paid_at is null and created_at < '2026-10-03');

do $$
declare n_legacy int; n_sandbox int; n_live int; n_bad int;
begin
  select count(*) filter (where provider_env = 'legacy_test'), count(*) filter (where provider_env = 'sandbox'),
         count(*) filter (where provider_env = 'live'),
         count(*) filter (where status in ('paid','created','initialized','unknown','review','mismatch'))
    into n_legacy, n_sandbox, n_live, n_bad from t_orders;
  if n_legacy <> 6 or n_sandbox <> 3 or n_live <> 4 then
    raise exception 'beklenmeyen kapsam: legacy_test=% sandbox=% live=% (beklenen 6/3/4) — hiçbir şey silinmedi', n_legacy, n_sandbox, n_live;
  end if;
  if n_bad > 0 then
    raise exception 'kapsamda ödenmiş ya da açık sipariş var (%) — hiçbir şey silinmedi', n_bad;
  end if;
end $$;

create temp table t_ozet (tablo text, silinen int);
with d as (delete from public.book_mail_outbox where order_id in (select id from t_orders) returning 1)
  insert into t_ozet select 'eposta_kuyrugu', count(*) from d;
with d as (delete from public.book_refund_operation where order_id in (select id from t_orders) returning 1)
  insert into t_ozet select 'iade_islemi', count(*) from d;
with d as (delete from public.book_entitlement_source where order_id in (select id from t_orders) returning 1)
  insert into t_ozet select 'erisim_kaynagi', count(*) from d;
with d as (delete from public.book_entitlements where order_id in (select id from t_orders) returning 1)
  insert into t_ozet select 'book_entitlements', count(*) from d;
with d as (delete from public.book_orders where id in (select id from t_orders) returning 1)
  insert into t_ozet select 'siparis', count(*) from d;
with d as (delete from public.book_rate_limit returning 1)
  insert into t_ozet select 'hiz_siniri_sayaci', count(*) from d;

-- Türetilmiş erişimi etkilenen kullanıcılar için yeniden hesapla (epoch yalnız etkin durum değişirse artar)
select public.book_recompute_access(user_id, product_code)
from (select distinct user_id, product_code from t_orders where user_id is not null) u;

commit;

select tablo, silinen from t_ozet
union all select 'kalan_siparis', count(*)::int from public.book_orders
union all select 'saglik_iade_uyarisi', refunds_attention::int from public.book_ops_health
order by 1;
