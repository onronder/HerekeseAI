-- P2 dağıtım sonrası salt okunur doğrulama. Çalıştırma: python3 tests/p2/sql/sorgula.py tests/p2/sql/p2-dogrula.sql

-- 1) Yeni tablolar var mı, RLS açık mı (11 satır, hepsi rowsecurity = true beklenir)
select tablename, rowsecurity from pg_tables where schemaname = 'public'
  and tablename in ('book_app_settings','book_access_state','book_entitlement_source','book_refund_operation','book_mail_outbox',
                    'book_rate_limit','book_policy_version','book_ops_lock','book_ops_run','book_orders','book_entitlements') order by 1;

-- 2) anon/authenticated'ın çalıştırabildiği book_* fonksiyonu (0 satır beklenir)
select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'book\_%'
  and (has_function_privilege('anon', p.oid, 'EXECUTE') or has_function_privilege('authenticated', p.oid, 'EXECUTE'));

-- 3) anon/authenticated'ın yeni tablolarda herhangi bir yetkisi (0 satır beklenir)
select table_name, grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon','authenticated')
  and table_name in ('book_app_settings','book_access_state','book_entitlement_source','book_refund_operation','book_mail_outbox',
                     'book_rate_limit','book_policy_version','book_ops_lock','book_ops_run','book_ops_health');

-- 4) Bucket özel mi (public = false beklenir)
select id, public from storage.buckets where id = 'book';

-- 5) Eski kayıtlar legacy_test olarak işaretlendi mi
select provider_env, status, count(*) from public.book_orders group by 1, 2 order by 1, 2;

-- 6) Sunucu tarafı anahtarlar (ikisi de true beklenir)
select checkout_enabled, refunds_enabled from public.book_app_settings where id = 1;

-- 7) Zamanlayıcı ve işçi sağlığı (cron kurulduktan ~5 dk sonra last_ok_run dolu olmalı)
select jobname, schedule, active from cron.job where jobname = 'book-ops-worker';
select * from public.book_ops_health;
select started_at, ok, skipped, counts, error_code from public.book_ops_run order by started_at desc limit 5;
