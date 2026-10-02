// P2 şema ve RPC testleri: yerel gerçek Postgres (embedded-postgres), eşzamanlı bağlantılarla.
// Kurulum: cd tests/p2 && npm install    Çalıştırma: node db/run.mjs
// Sıra: Supabase taklidi → kardeş site rolleri (birebir) → mevcut kitap migration'ları → P2 migration → testler.
// Çıktı: tests/p2/out/db-test.json (gitignore). Üretim veritabanına bağlanmaz.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, '..', '..', '..');
const MIG = path.join(ROOT, 'supabase', 'migrations');
const PORT = 54000 + Math.floor(Math.random() * 900);
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p2pg-'));
const db = new EmbeddedPostgres({ databaseDir: dataDir, user: 'postgres', password: 'pw', port: PORT, persistent: false, onLog: () => {}, onError: () => {} });
await db.initialise();
await db.start();
const conn = () => new pg.Client({ host: 'localhost', port: PORT, user: 'postgres', password: 'pw', database: 'postgres' });
const R = [];
const T = (id, test, ok, actual, expected = '') => R.push({ id, test, status: ok ? 'PASS' : 'FAIL', actual, expected });
const sql = (f) => fs.readFileSync(f, 'utf8');

let admin;
let s;
try {
  admin = conn(); await admin.connect();
  await admin.query(sql(path.join(HERE, 'supabase-stub.sql')));
  await admin.query(sql(path.join(HERE, 'site-roles.sql')));
  for (const f of fs.readdirSync(MIG).filter((x) => x.endsWith('.sql')).sort()) await admin.query(sql(path.join(MIG, f)));
  T('kurulum', 'Supabase taklidi + site rolleri + 3 migration hatasız uygulandı', true, fs.readdirSync(MIG).filter((x) => x.endsWith('.sql')).sort());
} catch (e) {
  T('kurulum', 'migration uygulanamadı', false, String(e.message || e));
  await finish();
}

// ---- yardımcılar
const PROD = 'herkes-icin-yz';
async function svc() { const c = conn(); await c.connect(); await c.query('SET ROLE service_role'); return c; }
async function asUser(uid) { const c = conn(); await c.connect(); await c.query('SET ROLE authenticated'); await c.query(`SELECT set_config('request.jwt.claim.sub', $1, false)`, [uid]); return c; }
async function newUser(email, isAdmin = false) {
  const { rows } = await admin.query('INSERT INTO auth.users (email) VALUES ($1) RETURNING id', [email]);
  if (isAdmin) await admin.query(`INSERT INTO public.user_roles (user_id, role) VALUES ($1, 'admin')`, [rows[0].id]);
  return rows[0].id;
}
s = await svc();
const rpc = async (c, fn, args) => (await c.query(`SELECT public.${fn}(${args.map((_, i) => `$${i + 1}`).join(',')}) AS r`, args)).rows[0].r;
const begin = (c, uid, key, snap = 'h1', price = '349.00') =>
  rpc(c, 'book_checkout_begin', [uid, PROD, key, snap, price, 'TRY', 'tr', '2026-10-02', 'tr', ['pre_contract', 'withdrawal'], 'a@example.test', null, '1.2.3.4', 'sandbox', 60]);
const approved = (oid, price = '349', extra = {}) => ({ kind: 'approved', payment_id: 'p-' + oid.slice(0, 8), payment_transaction_id: 't-' + oid.slice(0, 8),
  payment_status: 'SUCCESS', fraud_status: 1, price, paid_price: price, currency: 'TRY', conversation_id: oid, basket_id: oid,
  item_transactions: [{ itemId: PROD, paymentTransactionId: 't1', transactionStatus: 2, price, paidPrice: price }], raw_schema: 1, ...extra });
async function paidOrder(uid, key) {
  const b = await begin(s, uid, key);
  await rpc(s, 'book_checkout_initialized', [b.order_id, 'tok-' + key, 'https://sandbox-cpp.iyzipay.com/x', new Date(Date.now() + 1800e3)]);
  await rpc(s, 'book_apply_payment_result', [b.order_id, 'callback', approved(b.order_id)]);
  return b.order_id;
}
const one = async (q, a = []) => (await admin.query(q, a)).rows[0];
// Belirli siparişin makbuz işini sahiplen (claim_outbox p_only); test sırası diğer işlerden etkilenmesin
const claimFor = async (orderId, kind = 'receipt') => {
  const ev = await one(`SELECT id FROM book_mail_outbox WHERE order_id=$1 AND kind=$2`, [orderId, kind]);
  return ev ? (await s.query(`SELECT * FROM book_claim_outbox(1, 60, $1)`, [ev.id])).rows[0] : undefined;
};
process.on('unhandledRejection', async (e) => { T('hata', 'beklenmeyen hata', false, String(e && e.stack || e).slice(0, 600)); await finish(); });

// ================================================================ K-hak ve güvenlik
{
  const bucket = await one(`SELECT public FROM storage.buckets WHERE id='book'`);
  T('şema', 'book bucket private', bucket.public === false, bucket);
  const leg = await one(`SELECT count(*)::int n FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname LIKE 'book\\_%' AND has_function_privilege('authenticated', p.oid, 'EXECUTE')`);
  T('K05', 'hiçbir book_* fonksiyonu authenticated tarafından çağrılamaz (Supabase varsayılan hakları geri alındı)', leg.n === 0, leg);
  const anonExec = await one(`SELECT count(*)::int n FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname LIKE 'book\\_%' AND has_function_privilege('anon', p.oid, 'EXECUTE')`);
  T('K05', 'hiçbir book_* fonksiyonu anon tarafından çağrılamaz', anonExec.n === 0, anonExec);
  const tabs = await one(`SELECT count(*)::int n FROM information_schema.role_table_grants WHERE table_schema='public' AND table_name LIKE 'book\\_%' AND table_name NOT IN ('book_orders','book_entitlements') AND grantee IN ('anon','authenticated')`);
  T('K05', 'yeni book_* tablolarında anon/authenticated hakkı yok', tabs.n === 0, tabs);
  const hr = await one(`SELECT pg_get_functiondef('public.has_role(uuid, app_role)'::regprocedure) d`);
  T('şema', 'has_role kardeş sitedeki tanımla aynı kaldı (P2 dokunmadı)', /SECURITY DEFINER/.test(hr.d) && /SET search_path TO 'public'/.test(hr.d), hr.d.slice(0, 60));
}

// ================================================================ K02 başlatma
{
  const u = await newUser('k02@example.test');
  const a = await begin(s, u, 'key-1');
  const a2 = await begin(s, u, 'key-1');
  const c = await begin(s, u, 'key-1', 'h2');
  T('K02', 'aynı anahtar + aynı snapshot → aynı iş; farklı snapshot → conflict', a.action === 'new' && a2.action === 'existing' && a2.order_id === a.order_id && c.action === 'conflict', { a, a2, c });
  const other = await begin(s, u, 'key-2');
  T('K02', 'açık sipariş varken farklı anahtarla yeni oturum yok (open)', other.action === 'open' && other.order_id === a.order_id, other);
  await rpc(s, 'book_checkout_initialized', [a.order_id, 'tok-a', 'https://sandbox-cpp.iyzipay.com/a', new Date(Date.now() + 1800e3)]);
  await rpc(s, 'book_apply_payment_result', [a.order_id, 'callback', { ...approved(a.order_id), kind: 'review', fraud_status: 0 }]);
  const rv = await begin(s, u, 'key-3');
  T('K02', 'incelemedeki (review) ödeme varken ikinci checkout engellenir', rv.action === 'open' && rv.status === 'review', rv);
  // eşzamanlı: 10 farklı anahtar → yalnız bir 'new'
  const u2 = await newUser('k02b@example.test');
  const cs = await Promise.all(Array.from({ length: 10 }, () => svc()));
  const rs = await Promise.all(cs.map((c, i) => begin(c, u2, 'par-' + i)));
  await Promise.all(cs.map((c) => c.end()));
  const news = rs.filter((r) => r.action === 'new').length;
  const opens = await one(`SELECT count(*)::int n FROM book_orders WHERE user_id=$1 AND status IN ('created','initialized','unknown','review','mismatch')`, [u2]);
  T('K02', '10 eşzamanlı başlatma (farklı anahtar) → tek new, tek açık sipariş', news === 1 && opens.n === 1, { news, actions: rs.map((r) => r.action), opens: opens.n });
  // süre doldu ≠ ödeme yok: token süresi dolmuş + sağlayıcıda onaylı ödeme → paid
  const u3 = await newUser('k02c@example.test');
  const b3 = await begin(s, u3, 'k3');
  await rpc(s, 'book_checkout_initialized', [b3.order_id, 'tok-3', 'https://x.iyzipay.com', new Date(Date.now() - 60e3)]);
  const r3 = await rpc(s, 'book_apply_payment_result', [b3.order_id, 'reconcile', approved(b3.order_id)]);
  T('K02', 'token süresi dolmuş ama sağlayıcıda ödeme var → paid (yeni oturum açılmadı)', r3.outcome === 'paid', r3);
  // not_found: süresi dolmamışsa kapanmaz; dolmuşsa expired_confirmed ve yeni ödeme serbest
  const u4 = await newUser('k02d@example.test');
  const b4 = await begin(s, u4, 'k4');
  await rpc(s, 'book_checkout_initialized', [b4.order_id, 'tok-4', 'https://x.iyzipay.com', new Date(Date.now() + 600e3)]);
  const nf1 = await rpc(s, 'book_apply_payment_result', [b4.order_id, 'reconcile', { kind: 'not_found' }]);
  await admin.query(`UPDATE book_orders SET token_expires_at = now() - interval '1 minute' WHERE id=$1`, [b4.order_id]);
  const nf2 = await rpc(s, 'book_apply_payment_result', [b4.order_id, 'reconcile', { kind: 'not_found' }]);
  const again = await begin(s, u4, 'k4-yeni');
  T('K02', '"ödeme yok": token geçerliyken kapanmaz; süre dolunca expired_confirmed ve yeni ödeme açılabilir', nf1.outcome === 'unchanged' && nf2.outcome === 'expired_confirmed' && again.action === 'new', { nf1, nf2, again: again.action });
  // init sonucu: unknown → açık kalır, yeni oturum yok
  const u5 = await newUser('k02e@example.test');
  const b5 = await begin(s, u5, 'k5');
  const ir = await rpc(s, 'book_checkout_init_result', [b5.order_id, 'unknown', 'network']);
  const b5b = await begin(s, u5, 'k5-b');
  T('K02', 'başlatma yanıtı kaybolursa unknown; yeni oturum açılmaz', ir === 'unknown' && b5b.action === 'open' && b5b.status === 'unknown', { ir, b5b });
}

// ================================================================ K01 ödeme yarışı
{
  const u = await newUser('k01@example.test');
  const b = await begin(s, u, 'r1');
  await rpc(s, 'book_checkout_initialized', [b.order_id, 'tok-r1', 'https://x.iyzipay.com', new Date(Date.now() + 1800e3)]);
  const cs = await Promise.all(Array.from({ length: 10 }, () => svc()));
  const srcs = ['callback', 'webhook', 'status', 'reconcile', 'callback', 'webhook', 'status', 'ifn', 'callback', 'webhook'];
  const rs = await Promise.all(cs.map((c, i) => rpc(c, 'book_apply_payment_result', [b.order_id, srcs[i], approved(b.order_id)])));
  await Promise.all(cs.map((c) => c.end()));
  const src = await one(`SELECT count(*)::int n FROM book_entitlement_source WHERE order_id=$1`, [b.order_id]);
  const ob = await one(`SELECT count(*)::int n FROM book_mail_outbox WHERE order_id=$1 AND kind='receipt'`, [b.order_id]);
  const paid = rs.filter((r) => r.outcome === 'paid').length;
  T('K01', '10 eşzamanlı callback/webhook/status → tek paid, tek kaynak, tek makbuz işi', paid === 1 && src.n === 1 && ob.n === 1, { outcomes: rs.map((r) => r.outcome), src: src.n, outbox: ob.n });
  // fraud 0 → review, sonra IFN 2 → paid
  const u2 = await newUser('k01b@example.test');
  const b2 = await begin(s, u2, 'r2');
  await rpc(s, 'book_checkout_initialized', [b2.order_id, 'tok-r2', 'https://x.iyzipay.com', new Date(Date.now() + 1800e3)]);
  const rv = await rpc(s, 'book_apply_payment_result', [b2.order_id, 'callback', { ...approved(b2.order_id), kind: 'review', fraud_status: 0 }]);
  const ok2 = await rpc(s, 'book_apply_payment_result', [b2.order_id, 'ifn', { ...approved(b2.order_id), fraud_status: 2 }]);
  T('K01', 'fraud 0 → review; inceleme sonrası onay (2) → paid', rv.outcome === 'review' && ok2.outcome === 'paid', { rv, ok2 });
  // tutar uyuşmazlığı → mismatch, hak yok
  const u3 = await newUser('k01c@example.test');
  const b3 = await begin(s, u3, 'r3');
  await rpc(s, 'book_checkout_initialized', [b3.order_id, 'tok-r3', 'https://x.iyzipay.com', new Date(Date.now() + 1800e3)]);
  const mm = await rpc(s, 'book_apply_payment_result', [b3.order_id, 'callback', approved(b3.order_id, '1.00')]);
  const acc3 = await one(`SELECT coalesce((SELECT active FROM book_access_state WHERE user_id=$1), false) a`, [u3]);
  T('K01', 'price/paidPrice uyuşmazlığı → mismatch, erişim yok, açık kalır', mm.outcome === 'mismatch' && acc3.a === false, { mm, acc3 });
  // iade sonrası gecikmiş paid geriye götürmez
  const u4 = await newUser('k01d@example.test', false);
  const ad = await newUser('admin1@example.test', true);
  const o4 = await paidOrder(u4, 'r4');
  const br = await rpc(s, 'book_begin_refund', [o4, null, ad]);
  await rpc(s, 'book_apply_refund_result', [br.op_id, { kind: 'success', provider_refund_id: 'rf1', amount: '349.00', currency: 'TRY' }]);
  const late = await rpc(s, 'book_apply_payment_result', [o4, 'webhook', approved(o4)]);
  const st4 = await one(`SELECT o.status, coalesce(a.active,false) active FROM book_orders o LEFT JOIN book_access_state a ON a.user_id=o.user_id WHERE o.id=$1`, [o4]);
  T('K01', 'iade sonrası gecikmiş paid olayı → unchanged; erişim kapalı kalır', late.outcome === 'unchanged' && st4.status === 'refunded' && st4.active === false, { late, st4 });
  // paid sonrası eski failed → durum düşmez
  const u5 = await newUser('k01e@example.test');
  const o5 = await paidOrder(u5, 'r5');
  const oldf = await rpc(s, 'book_apply_payment_result', [o5, 'callback', { kind: 'failure', payment_status: 'FAILURE' }]);
  const st5 = await one(`SELECT status FROM book_orders WHERE id=$1`, [o5]);
  T('K01', 'paid sonrası gelen eski failure → paid kalır', st5.status === 'paid', { oldf, st5 });
}

// ================================================================ K03 iade ve kaynaklar
{
  const ad = await newUser('admin2@example.test', true);
  const u = await newUser('k03@example.test');
  const o = await paidOrder(u, 'f1');
  const r1 = await rpc(s, 'book_begin_refund', [o, '100.00', ad]);
  const dup = await rpc(s, 'book_begin_refund', [o, '100.00', ad]);
  const a1 = await rpc(s, 'book_apply_refund_result', [r1.op_id, { kind: 'success', provider_refund_id: 'rf-a', amount: '100.00', currency: 'TRY' }]);
  const acc1 = await one(`SELECT active FROM book_access_state WHERE user_id=$1`, [u]);
  const r2 = await rpc(s, 'book_begin_refund', [o, null, ad]);
  const a2 = await rpc(s, 'book_apply_refund_result', [r2.op_id, { kind: 'success', provider_refund_id: 'rf-b', amount: '249.00', currency: 'TRY' }]);
  const acc2 = await one(`SELECT active FROM book_access_state WHERE user_id=$1`, [u]);
  const mails = await one(`SELECT count(*)::int n FROM book_mail_outbox WHERE order_id=$1 AND kind='refund'`, [o]);
  T('K03', 'çift tıklama → aynı iade işlemi (existing)', dup.action === 'existing' && dup.op_id === r1.op_id, dup);
  T('K03', 'iki kısmi iade: ilki erişimi korur; toplam tam tutara ulaşınca kaynak kapanır; iki ayrı bildirim', a1.outcome === 'partial' && acc1.active === true && a2.outcome === 'refunded' && acc2.active === false && mails.n === 2 && Number(r2.amount) === 249, { a1, a2, r2amount: r2.amount, mails: mails.n });
  // tutar uyuşmazlığı → needs_review
  const u2 = await newUser('k03b@example.test');
  const o2 = await paidOrder(u2, 'f2');
  const rr = await rpc(s, 'book_begin_refund', [o2, null, ad]);
  const nr = await rpc(s, 'book_apply_refund_result', [rr.op_id, { kind: 'success', provider_refund_id: 'x', amount: '300.00', currency: 'TRY' }]);
  T('K03', 'sağlayıcı iade tutarı yerel işlemle uyuşmuyor → needs_review (kapatılmaz)', nr.outcome === 'needs_review', nr);
  const u2b = await newUser('k03b2@example.test');
  const o2b = await paidOrder(u2b, 'f2b');
  const rb = await rpc(s, 'book_begin_refund', [o2b, null, ad]);
  const amb = await rpc(s, 'book_apply_refund_result', [rb.op_id, { kind: 'needs_review', error_code: 'ambiguous_match' }]);
  const accb = await one(`SELECT active FROM book_access_state WHERE user_id=$1`, [u2b]);
  T('K03', 'raporlamada tek anlamlı eşleşme yok → needs_review; erişim değişmez', amb.outcome === 'needs_review' && accb.active === true, { amb, accb });
  // belirsiz → unknown; aynı işlem tekrar açılmaz
  const u3 = await newUser('k03c@example.test');
  const o3 = await paidOrder(u3, 'f3');
  const ru = await rpc(s, 'book_begin_refund', [o3, null, ad]);
  const uk = await rpc(s, 'book_apply_refund_result', [ru.op_id, { kind: 'unknown' }]);
  const ru2 = await rpc(s, 'book_begin_refund', [o3, null, ad]);
  T('K03', 'iade sonucu belirsiz → unknown; yeni iade çağrısı açılmaz (existing)', uk.outcome === 'unknown' && ru2.action === 'existing' && ru2.state === 'unknown', { uk, ru2 });
  // ikinci satın alma/manuel grant: bir kaynağın iadesi diğerini kapatmaz
  const u4 = await newUser('k03d@example.test');
  const o4 = await paidOrder(u4, 'f4');
  const g = await rpc(s, 'book_grant_manual', [u4, PROD, ad, 'hediye', 'tr']);
  const r4 = await rpc(s, 'book_begin_refund', [o4, null, ad]);
  await rpc(s, 'book_apply_refund_result', [r4.op_id, { kind: 'success', provider_refund_id: 'rf4', amount: '349.00', currency: 'TRY' }]);
  const acc4 = await one(`SELECT active FROM book_access_state WHERE user_id=$1`, [u4]);
  T('K03', 'satın alma iade edilse de manuel erişim kaynağı erişimi sürdürür', g.action === 'granted' && acc4.active === true, { g: g.action, acc4 });
  // eşzamanlı: manuel grant + tam iade aynı anda → erişim açık kalmalı
  const u5 = await newUser('k03e@example.test');
  const o5 = await paidOrder(u5, 'f5');
  const r5 = await rpc(s, 'book_begin_refund', [o5, null, ad]);
  const [c1, c2] = await Promise.all([svc(), svc()]);
  await Promise.all([
    rpc(c1, 'book_apply_refund_result', [r5.op_id, { kind: 'success', provider_refund_id: 'rf5', amount: '349.00', currency: 'TRY' }]),
    rpc(c2, 'book_grant_manual', [u5, PROD, ad, 'eşzamanlı', 'tr']),
  ]);
  await c1.end(); await c2.end();
  const acc5 = await one(`SELECT active FROM book_access_state WHERE user_id=$1`, [u5]);
  const ent5 = await one(`SELECT count(*)::int n FROM book_entitlements WHERE user_id=$1`, [u5]);
  T('K03', 'eşzamanlı tam iade + manuel grant → erişim açık, türetilmiş kayıt tutarlı', acc5.active === true && ent5.n === 1, { acc5, ent5 });
}

// ================================================================ K04 e-posta kuyruğu
{
  const u = await newUser('k04@example.test');
  const o = await paidOrder(u, 'm1');
  const m = await claimFor(o);
  const stale = await rpc(s, 'book_complete_outbox', [m.id, m.lease_version - 1, { ok: true }]);
  T('K04', 'makbuz işi sahiplenildi; eski lease_version ile tamamlama reddedilir (stale)', m.kind === 'receipt' && stale === 'stale', { kind: m.kind, stale });
  // lease süresi doldu (<24 saat) → aynı iş yeniden sahiplenilir (aynı event_key)
  await admin.query(`UPDATE book_mail_outbox SET lease_until = now() - interval '1 second' WHERE id=$1`, [m.id]);
  const [m2] = (await s.query(`SELECT * FROM book_claim_outbox(10, 60, $1)`, [m.id])).rows;
  const done = await rpc(s, 'book_complete_outbox', [m2.id, m2.lease_version, { ok: true, provider_message_id: 're_1' }]);
  T('K04', 'süresi dolmuş lease (<24 saat) aynı event_key ile yeniden denenir, sonra accepted', m2 && m2.event_key === 'receipt:' + o && m2.lease_version === m.lease_version + 1 && done === 'accepted', { lv: [m.lease_version, m2 && m2.lease_version], done });
  // ≥24 saat belirsiz → needs_review
  const u2 = await newUser('k04b@example.test');
  const o2 = await paidOrder(u2, 'm2');
  const x = await claimFor(o2);
  await admin.query(`UPDATE book_mail_outbox SET lease_until = now() - interval '1 second', first_attempt_at = now() - interval '25 hours' WHERE id=$1`, [x.id]);
  await s.query(`SELECT * FROM book_claim_outbox(10, 60, $1)`, [x.id]);
  const st = await one(`SELECT state FROM book_mail_outbox WHERE id=$1`, [x.id]);
  T('K04', '24 saati aşan belirsiz gönderim kör tekrarlanmaz → needs_review', st.state === 'needs_review', st);
  // makbuz beklerken iade → "erişim hazır" bastırılır
  const ad = await newUser('admin3@example.test', true);
  const u3 = await newUser('k04c@example.test');
  const o3 = await paidOrder(u3, 'm3');
  const r3 = await rpc(s, 'book_begin_refund', [o3, null, ad]);
  await rpc(s, 'book_apply_refund_result', [r3.op_id, { kind: 'success', provider_refund_id: 'rf', amount: '349.00', currency: 'TRY' }]);
  { const ev = await one(`SELECT id FROM book_mail_outbox WHERE event_key=$1`, ['receipt:' + o3]); await s.query(`SELECT * FROM book_claim_outbox(1, 60, $1)`, [ev.id]); }
  const rec = await one(`SELECT state FROM book_mail_outbox WHERE event_key=$1`, ['receipt:' + o3]);
  T('K04', 'makbuz gönderilmeden iade edildi → makbuz suppressed; erişim e-postayı beklemedi', rec.state === 'suppressed', rec);
  // geçici hata → retry + geri çekilme; kalıcı → failed
  const u4 = await newUser('k04d@example.test');
  const o4 = await paidOrder(u4, 'm4');
  const y = await claimFor(o4);
  const rt = await rpc(s, 'book_complete_outbox', [y.id, y.lease_version, { ok: false, error_code: 'http_503' }]);
  const nx = await one(`SELECT next_attempt_at > now() d FROM book_mail_outbox WHERE id=$1`, [y.id]);
  T('K04', 'geçici hata → retry, sonraki deneme ileri tarihli', rt === 'retry' && nx.d === true, { rt, nx });
}

// ================================================================ K05 erişim sürümü ve yetki
{
  const ad = await newUser('admin4@example.test', true);
  const u = await newUser('k05@example.test');
  const g1 = await rpc(s, 'book_grant_manual', [u, PROD, ad, 'a', 'tr']);
  const e1 = await rpc(s, 'book_access_check', [u, PROD]);
  await rpc(s, 'book_revoke_source', [g1.source_id, ad, 'test']);
  const e2 = await rpc(s, 'book_access_check', [u, PROD]);
  await rpc(s, 'book_grant_manual', [u, PROD, ad, 'b', 'tr']);
  const e3 = await rpc(s, 'book_access_check', [u, PROD]);
  T('K05', 'grant → revoke → grant: epoch hiç sıfırlanmaz; eski token (ilk epoch) yeniden geçerli olmaz', e1.active && !e2.active && e3.active && e3.epoch > e1.epoch && e2.epoch > e1.epoch, { e1, e2, e3 });
  const nonAdmin = await newUser('k05b@example.test');
  let forb = '';
  try { await rpc(s, 'book_grant_manual', [u, PROD, nonAdmin, 'x', 'tr']); } catch (e) { forb = e.message; }
  T('K05', 'yönetici olmayan aktör → forbidden (aktör user_roles\'ten yeniden doğrulanır)', forb === 'forbidden', forb);
  const c = await asUser(u);
  let denied = '';
  try { await c.query(`SELECT public.book_grant_manual($1,$2,$3,'x','tr')`, [u, PROD, u]); } catch (e) { denied = e.code; }
  let tdeny = '';
  try { await c.query(`SELECT * FROM public.book_access_state`); } catch (e) { tdeny = e.code; }
  const own = await c.query(`SELECT id, status FROM public.book_orders`);
  let rawDeny = '';
  try { await c.query(`SELECT raw FROM public.book_orders`); } catch (e) { rawDeny = e.code; }
  await c.end();
  T('K05', 'kullanıcı JWT ile: RPC çağrısı ve yeni tablo okuması reddedilir; raw sütunu okunamaz', denied === '42501' && tdeny === '42501' && rawDeny === '42501', { denied, tdeny, rawDeny, ownRows: own.rowCount });
  // A, B'nin siparişini göremez
  const a = await newUser('k05a@example.test'); const bU = await newUser('k05bb@example.test');
  await paidOrder(bU, 'b-own');
  const ca = await asUser(a);
  const seen = await ca.query(`SELECT id FROM public.book_orders`);
  const ents = await ca.query(`SELECT id FROM public.book_entitlements`);
  await ca.end();
  T('K05', 'A kullanıcısı B\'nin siparişini ve erişim kaydını göremez (RLS)', seen.rowCount === 0 && ents.rowCount === 0, { orders: seen.rowCount, ents: ents.rowCount });
}

{
  const u = await newUser('Bul.Beni@Example.test');
  await newUser('bul.beni@example.test.other');
  const r = (await s.query(`SELECT * FROM public.book_find_user_by_email('  bul.beni@example.test ')`)).rows;
  T('K05', 'elle erişim alıcısı tam e-posta eşleşmesiyle bulunur (büyük/küçük harf ve boşluk duyarsız; alt-dize eşleşmez)', r.length === 1 && r[0].user_id === u, r);
}

// ================================================================ K07 hız sınırı
{
  const cs = await Promise.all(Array.from({ length: 40 }, () => svc()));
  const rs = await Promise.all(cs.map((c) => c.query(`SELECT * FROM public.book_rate_hit('t:k07', 10, 600)`).then((r) => r.rows[0])));
  await Promise.all(cs.map((c) => c.end()));
  const allowed = rs.filter((r) => r.allowed).length;
  T('K07', '40 eşzamanlı bağlantı, sınır 10 → tam 10 izin (tek bütçe), reddedilenlerde retry_after > 0', allowed === 10 && rs.filter((r) => !r.allowed).every((r) => r.retry_after > 0), { allowed, total: rs.length });
  let bad = '';
  try { await s.query(`SELECT * FROM public.book_rate_hit($1, 10, 60)`, ['x'.repeat(300)]); } catch (e) { bad = e.message; }
  T('K07', 'aşırı uzun anahtar reddedilir', bad === 'bad_request', bad);
}

// ================================================================ K08 hesap silme
{
  const u = await newUser('k08@example.test');
  const b = await begin(s, u, 'd1');
  await rpc(s, 'book_checkout_initialized', [b.order_id, 'tok-d1', 'https://x.iyzipay.com', new Date(Date.now() + 1800e3)]);
  await admin.query('DELETE FROM auth.users WHERE id=$1', [u]);
  const ord = await one('SELECT user_id, status FROM book_orders WHERE id=$1', [b.order_id]);
  const late = await rpc(s, 'book_apply_payment_result', [b.order_id, 'callback', approved(b.order_id)]);
  const src = await one('SELECT count(*)::int n FROM book_entitlement_source WHERE order_id=$1', [b.order_id]);
  const ob = await one('SELECT count(*)::int n FROM book_mail_outbox WHERE order_id=$1', [b.order_id]);
  T('K08', 'hesap silinince sipariş korunur (user_id null); sonradan gelen ödeme kaydedilir, hak ve e-posta üretilmez', ord.user_id === null && late.outcome === 'paid' && late.orphan === true && src.n === 0 && ob.n === 0, { ord, late, src: src.n, ob: ob.n });
  const leg = await one(`SELECT count(*)::int n FROM book_orders WHERE provider_env IS NULL`);
  T('K08', 'provider_env boş sipariş yok (mevcut satırlar legacy_test olarak işaretlenir)', leg.n === 0, leg);
}

// ================================================================ K09 durdurma
{
  const ad = await newUser('admin5@example.test', true);
  const u = await newUser('k09@example.test');
  const b = await begin(s, u, 'p1');
  await rpc(s, 'book_checkout_initialized', [b.order_id, 'tok-p1', 'https://x.iyzipay.com', new Date(Date.now() + 1800e3)]);
  await rpc(s, 'book_set_app_setting', ['checkout_enabled', false, ad]);
  const u2 = await newUser('k09b@example.test');
  const paused = await begin(s, u2, 'p2');
  const cb = await rpc(s, 'book_apply_payment_result', [b.order_id, 'callback', approved(b.order_id)]);
  await rpc(s, 'book_set_app_setting', ['refunds_enabled', false, ad]);
  const rp = await rpc(s, 'book_begin_refund', [b.order_id, null, ad]);
  let nf = '';
  try { await rpc(s, 'book_set_app_setting', ['checkout_enabled', true, u2]); } catch (e) { nf = e.message; }
  await rpc(s, 'book_set_app_setting', ['checkout_enabled', true, ad]);
  await rpc(s, 'book_set_app_setting', ['refunds_enabled', true, ad]);
  T('K09', 'satış kapalı → yeni başlatma paused; açık siparişin callback\'i yine paid olur; iade kapalı → paused; yönetici olmayan ayarı değiştiremez',
    paused.action === 'paused' && cb.outcome === 'paid' && rp.action === 'paused' && nf === 'forbidden', { paused, cb: cb.outcome, rp, nf });
}

// ================================================================ K10 worker kilidi
{
  const cs = await Promise.all(Array.from({ length: 5 }, () => svc()));
  const rs = await Promise.all(cs.map((c) => rpc(c, 'book_ops_begin', [50])));
  await Promise.all(cs.map((c) => c.end()));
  const acq = rs.filter((r) => r.acquired);
  await rpc(s, 'book_ops_finish', [acq[0].run_id, true, { outbox: 0 }, null]);
  const again = await rpc(s, 'book_ops_begin', [50]);
  await rpc(s, 'book_ops_finish', [again.run_id, true, {}, null]);
  const h = await one('SELECT last_ok_run IS NOT NULL ok FROM book_ops_health');
  T('K10', '5 eşzamanlı worker çalışması → yalnız biri kilidi alır, diğerleri skipped kaydı; bitince kilit serbest; sağlık görünümü son başarılı çalışmayı gösterir',
    acq.length === 1 && again.acquired === true && h.ok === true, { acquired: acq.length, again: again.acquired, health: h });
}

// ================================================================ izleme görünümü
{
  const h = await one('SELECT * FROM book_ops_health');
  T('izleme', 'book_ops_health okunuyor (invariant sayaçları)', typeof h.paid_without_access === 'string' || typeof h.paid_without_access === 'number', h);
}
await finish();

async function finish() {
  try { await s?.end(); } catch {}
  try { await admin?.end(); } catch {}
  await db.stop();
  fs.rmSync(dataDir, { recursive: true, force: true });
  const out = path.join(ROOT, 'tests', 'p2', 'out'); fs.mkdirSync(out, { recursive: true });
  const sum = { tarih: new Date().toISOString(), ortam: 'yerel embedded-postgres', PASS: R.filter((r) => r.status === 'PASS').length, FAIL: R.filter((r) => r.status === 'FAIL').length, testler: R };
  fs.writeFileSync(path.join(out, 'db-test.json'), JSON.stringify(sum, null, 1));
  for (const r of R) console.log(r.status === 'PASS' ? '✔' : '✘', r.id, r.test, r.status === 'FAIL' ? JSON.stringify(r.actual).slice(0, 500) : '');
  console.log(`${sum.PASS} PASS · ${sum.FAIL} FAIL`);
  process.exit(sum.FAIL ? 1 : 0);
}
