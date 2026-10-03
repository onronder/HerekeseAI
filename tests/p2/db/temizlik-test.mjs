// p2-temizlik.sql sınaması (yerel gerçek Postgres): kapsam beklenenden farklıysa hiçbir şey silinmez;
// doğru kapsamda yalnız test siparişleri ve bağlı kayıtları silinir, erişim durumu ve kapsam dışı sipariş korunur.
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const ROOT = path.resolve(HERE, '../../..');
const MIG = path.join(ROOT, 'supabase', 'migrations'); const SCRIPT = path.join(ROOT, 'tests/p2/sql/p2-temizlik.sql');
const PORT = 55000 + Math.floor(Math.random() * 900);
const db = new EmbeddedPostgres({ databaseDir: fs.mkdtempSync(path.join(os.tmpdir(), 'p2tz-')), user: 'postgres', password: 'pw', port: PORT, persistent: false, onLog: () => {}, onError: () => {} });
await db.initialise(); await db.start();
const c = new pg.Client({ host: 'localhost', port: PORT, user: 'postgres', password: 'pw', database: 'postgres' }); await c.connect();
const q = (s, a) => c.query(s, a); const one = async (s, a) => (await q(s, a)).rows[0];
const R = []; const T = (t, ok, actual) => { R.push({ t, ok, actual }); console.log((ok ? '✔ ' : '✘ ') + t, ok ? '' : JSON.stringify(actual)); };
try {
  await q(fs.readFileSync(path.join(HERE, 'supabase-stub.sql'), 'utf8'));
  await q(fs.readFileSync(path.join(HERE, 'site-roles.sql'), 'utf8'));
  for (const f of fs.readdirSync(MIG).filter((x) => x.endsWith('.sql')).sort()) await q(fs.readFileSync(path.join(MIG, f), 'utf8'));
  const A = (await one(`INSERT INTO auth.users (email) VALUES ('a@x.test') RETURNING id`)).id;
  const ord = async (env, status, created = 'now()', pid = null) => (await one(
    `INSERT INTO public.book_orders (id, user_id, conversation_id, basket_id, price, status, consent_at, buyer_email, provider_env, created_at, iyzico_payment_id)
     SELECT g, $1, g::text, g::text, 349, $2, now(), 'a@x.test', $3, ${created}, $4 FROM gen_random_uuid() g RETURNING id`, [A, status, env, pid])).id;
  for (const s of ['expired', 'expired', 'failed', 'refunded', 'refunded', 'refunded']) await ord('legacy_test', s);
  const sb = await ord('sandbox', 'refunded', 'now()', 'p1'); await ord('sandbox', 'failed'); await ord('sandbox', 'expired_confirmed');
  for (let i = 0; i < 4; i++) await ord('live', 'failed', `'2026-10-02'::timestamptz`);
  await q(`INSERT INTO public.book_refund_operation (order_id, amount, currency, requested_by, state) VALUES ($1, 50, 'TRY', $2, 'settled'), ($1, 50, 'TRY', $2, 'needs_review')`, [sb, A]);
  await q(`INSERT INTO public.book_entitlement_source (user_id, product_code, source_type, order_id, revoked_at) VALUES ($1, 'herkes-icin-yz', 'purchase', $2, now())`, [A, sb]);
  await q(`INSERT INTO public.book_entitlement_source (user_id, product_code, source_type) VALUES ($1, 'herkes-icin-yz', 'manual')`, [A]);
  await q(`INSERT INTO public.book_mail_outbox (event_key, kind, order_id, user_id, recipient, lang, payload) VALUES ('receipt:'||$1::text, 'receipt', $1::uuid, $2, 'a@x.test', 'tr', '{}')`, [sb, A]);
  await q(`SELECT public.book_recompute_access($1, 'herkes-icin-yz')`, [A]);
  const epoch0 = (await one(`SELECT epoch FROM public.book_access_state WHERE user_id = $1`, [A])).epoch;

  // 1) Kapsam dışı fazladan bir legacy kaydı → istisna, hiçbir şey silinmez
  const extra = await ord('legacy_test', 'expired');
  let err = null; try { await q(fs.readFileSync(SCRIPT, 'utf8')); } catch (e) { err = e.message; } await q('ROLLBACK').catch(() => {});
  T('beklenmeyen kapsam (legacy 7) → istisna', /beklenmeyen kapsam/.test(err ?? ''), err);
  T('istisnada hiçbir şey silinmedi (14 sipariş, 2 iade, 1 e-posta)', (await one(`SELECT (SELECT count(*) FROM public.book_orders)::int o, (SELECT count(*) FROM public.book_refund_operation)::int r, (SELECT count(*) FROM public.book_mail_outbox)::int m`)).o === 14, null);
  await q(`DELETE FROM public.book_orders WHERE id = $1`, [extra]);

  // 2) Kapsam dışı ödemeli sipariş korunmalı
  const live2 = await ord('live', 'paid', 'now()', 'p-real');  // kapsam dışı (bugün, ödemeli): korunmalı
  // 3) Doğru kapsam → silme
  const res = await q(fs.readFileSync(SCRIPT, 'utf8'));
  const last = Array.isArray(res) ? res[res.length - 1].rows : res.rows;
  const m = Object.fromEntries(last.map((r) => [r.tablo, Number(r.silinen)]));
  T('özet: 13 sipariş, 2 iade, 1 kaynak, 1 e-posta silindi', m.siparis === 13 && m.iade_islemi === 2 && m.erisim_kaynagi === 1 && m.eposta_kuyrugu === 1, m);
  T('kapsam dışı ödemeli sipariş korundu (kalan 1)', m.kalan_siparis === 1 && !!(await one(`SELECT 1 x FROM public.book_orders WHERE id = $1`, [live2])), m);
  T('elle kaynak korundu', (await one(`SELECT count(*)::int n FROM public.book_entitlement_source WHERE source_type = 'manual'`)).n === 1, null);
  const st = await one(`SELECT active, epoch FROM public.book_access_state WHERE user_id = $1`, [A]);
  T('erişim durumu korundu, epoch geri gitmedi', st && Number(st.epoch) >= Number(epoch0), { epoch0, st });
} catch (e) { T('çalışma hatası', false, e.message); }
finally { await c.end(); await db.stop(); }
const f = R.filter((r) => !r.ok).length; console.log(`${R.length - f} PASS · ${f} FAIL`); process.exit(f ? 1 : 0);
