-- P2 zamanlanmış işçi kurulumu (Supabase SQL Editor'da yazar çalıştırır; migration DEĞİLDİR).
-- Gizli anahtarın DEĞERİ bu dosyaya, depoya ya da sohbete yazılmaz.
-- Ön koşul: Edge Function secret OPS_WORKER_SECRET (en az 32 karakter rastgele) tanımlı ve ops-worker deploy edilmiş.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 1) Vault'a aynı değeri bir kez girin (SQL Editor'da '<...>' yerine değeri siz yapıştırın; dosyaya kaydetmeyin):
--    select vault.create_secret('<OPS_WORKER_SECRET ile aynı değer>', 'book_ops_worker_secret', 'ops-worker Bearer anahtarı');

-- 2) 5 dakikada bir çalıştır (anahtar Vault'tan okunur)
select cron.schedule(
  'book-ops-worker',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://dtsgewamjkcojffustrg.supabase.co/functions/v1/ops-worker',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'book_ops_worker_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 55000
  );
  $$
);

-- Kontrol:
--   select jobid, jobname, schedule, active from cron.job where jobname = 'book-ops-worker';
--   select * from public.book_ops_health;            -- last_ok_run 10 dk'dan yeni olmalı
--   select started_at, ok, skipped, counts, error_code from public.book_ops_run order by started_at desc limit 5;
-- Durdurma:  select cron.unschedule('book-ops-worker');
