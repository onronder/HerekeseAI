// Site denetimi P1 kabul testi (mobil K10, erişilebilirlik ve form K11, rotalar K12).
// Kullanım:
//   node tools/site_qa/site_test.mjs                       → yerel (store/ için Vercel cleanUrls/404 öykünmesi; GELİŞTİRME kanıtı)
//   BASE_URL=https://<preview>.vercel.app node tools/site_qa/site_test.mjs   → Vercel preview (KABUL kanıtı)
// Yerel öykünme kendi yönlendirme kuralını uyguladığı için Vercel'in gerçek davranışını kanıtlamaz; rota ve başlık
// sonuçları yalnız BASE_URL ile kabul sayılır. Çıktı: tools/site_qa/site-test.json + tools/site_qa/shots/*.png
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const { default: puppeteer } = await import(path.join(ROOT, 'print/typeset/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'));
const REMOTE = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : null;
const ENV = REMOTE ? `preview:${REMOTE}` : 'yerel-öykünme';
const SHOTS = path.join(ROOT, 'tools/site_qa/shots'); fs.mkdirSync(SHOTS, { recursive: true });
const routes = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/site/routes.json'), 'utf8'));
const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'qr-slugs.json'), 'utf8'));
const R = [];
const T = (id, test, ok, actual, expected = '', evidence = '', status) =>
  R.push({ id, test, env: ENV, expected, actual, status: status || (ok ? 'PASS' : 'FAIL'), evidence });
const BLOCK = (id, test, why) => R.push({ id, test, env: ENV, expected: '', actual: why, status: 'BLOCKED', evidence: '' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- yerel sunucu (Vercel cleanUrls + trailingSlash:false + 404.html)
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };
function serve(dir, prefix) {
  return (req, res) => {
    const u = new URL(req.url, 'http://x'); let p = decodeURIComponent(u.pathname);
    if (prefix) p = p.slice(prefix.length) || '/';
    const send = (code, file, extra = {}) => { res.writeHead(code, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', ...extra }); res.end(fs.readFileSync(file)); };
    const redirect = (to) => { res.writeHead(308, { location: (prefix || '') + to + u.search }); res.end(); };
    if (p.length > 1 && p.endsWith('/')) return redirect(p.replace(/\/+$/, ''));
    if (p.endsWith('.html')) return redirect(p.replace(/(index)?\.html$/, '').replace(/\/$/, '') || '/');
    const cands = p === '/' ? ['index.html'] : [p.slice(1), p.slice(1) + '.html', p.slice(1) + '/index.html'];
    for (const c of cands) { const f = path.join(dir, c); if (f.startsWith(dir) && fs.existsSync(f) && fs.statSync(f).isFile()) return send(200, f); }
    const nf = path.join(dir, '404.html'); if (fs.existsSync(nf)) return send(404, nf); res.writeHead(404); res.end('404');
  };
}
let server, BASE = REMOTE;
const STORE = path.join(ROOT, 'store'), DIST = path.join(ROOT, 'dist/web');
if (!REMOTE) {
  const st = serve(STORE), ds = serve(DIST, '/__dist');
  server = http.createServer((q, s) => (q.url.startsWith('/__dist') ? ds(q, s) : st(q, s)));
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  BASE = `http://127.0.0.1:${server.address().port}`;
}
const fetchNoRedirect = (url) => fetch(url, { redirect: 'manual' });

const browser = await puppeteer.launch({ headless: 'new', executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage();
const pageErrors = []; page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
// Supabase çağrıları testte gerçek projeye gitmez: anonim oturum, istekler engellenir (form testleri kendi yanıtını kurar)
let supaHandler = null;
// Sahte yanıtlar çapraz kaynak olduğu için CORS başlığı taşımalı; aksi hâlde tarayıcı "Failed to fetch" verir ve test yanlış sebeple geçer
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' };
const reply = (rq, status, body) => rq.respond({ status, headers: CORS, contentType: 'application/json', body: typeof body === 'string' ? body : JSON.stringify(body) });
await page.setRequestInterception(true);
page.on('request', (rq) => {
  if (/supabase\.co/.test(rq.url())) {
    if (rq.method() === 'OPTIONS') return rq.respond({ status: 204, headers: CORS, body: '' });
    if (supaHandler) return supaHandler(rq);
    return reply(rq, 200, {});
  }
  rq.continue();
});

// ---------------------------------------------------------------- K10 mobil
const VPS = [[320, 700], [360, 800], [390, 844], [768, 1024], [1280, 720], [667, 375]];
const qrPick = (lang, keys) => keys.map((k) => ({ name: `QR ${lang} ${k}`, url: `/d/${lang === 'en' ? 'en/' : ''}${slugs[lang][k]}` }));
const MOBILE_PAGES = [
  { name: 'demo TR giriş', url: '/demo/demo#m=1&s=0' }, { name: 'demo TR zekâ', url: '/demo/demo#m=1&s=1' },
  { name: 'demo EN giriş', url: '/demo/demo-en#m=1&s=0' }, { name: 'demo EN düşünmek', url: '/demo/demo-en#m=1&s=2' },
  { name: 'ana sayfa TR', url: '/' }, { name: 'ana sayfa EN', url: '/en' },
  { name: 'okuyucu çubuğu TR', url: '/oku' }, { name: 'yasal TR', url: '/yasal' },
  ...qrPick('tr', ['2.3', '4.4', '7.2']), ...qrPick('en', ['3.5', '5.3', '8.5']),
];
if (!REMOTE) {
  // Ücretli okuyucunun içeriği (dist/web ile aynı şablon); gerçek /oku yalnız yazar oturumuyla elle denetlenir
  MOBILE_PAGES.push({ name: 'kitap (okuyucu vekili) M3 tablo', url: '/__dist/index.html#m=3&s=0' },
    { name: 'kitap (okuyucu vekili) M5 dikkat', url: '/__dist/en.html#m=5&s=2' }, { name: 'kitap kapak', url: '/__dist/index.html#m=0&s=0' });
}
async function layoutCheck(W) {
  return page.evaluate((W) => {
    const inScroll = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const o = getComputedStyle(x).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
    const vis = (e) => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0; };
    const out = [], clipped = [];
    for (const e of document.querySelectorAll('body *')) {
      const r = e.getBoundingClientRect(); if (!r.width || !r.height || !vis(e)) continue;
      if (e.closest('[inert],[aria-hidden="true"],.ticker')) continue;
      if ((r.right > W + 1 || r.left < -1) && !inScroll(e)) {
        const p = e.parentElement, pr = p && p.getBoundingClientRect();
        if (!(pr && (pr.right > W + 1 || pr.left < -1) && !inScroll(p))) out.push(`${e.tagName}.${(e.className || '').toString().slice(0, 30)} ${Math.round(r.left)}–${Math.round(r.right)} "${(e.innerText || '').slice(0, 30).replace(/\n/g, ' ')}"`);
      }
      const cs = getComputedStyle(e);
      if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip') && e.scrollWidth > e.clientWidth + 2 && cs.textOverflow !== 'ellipsis'
          && e !== document.body && e.parentElement !== document.body && (e.innerText || '').trim()) clipped.push(`${e.tagName} ${e.scrollWidth}>${e.clientWidth} "${(e.innerText || '').slice(0, 30).replace(/\n/g, ' ')}"`);
    }
    // anahtar öğeler: başlık, ilk paragraf, ileri/geri; görünür ve örtülmemiş (ekrana kaydırıldıktan sonra)
    const keys = [];
    const h = [...document.querySelectorAll('h1,h2')].find((x) => vis(x) && x.getBoundingClientRect().height); if (h) keys.push(['başlık', h]);
    const pp = [...document.querySelectorAll('p')].find((x) => vis(x) && (x.innerText || '').length > 60); if (pp) keys.push(['paragraf', pp]);
    [...document.querySelectorAll('button,a')].filter((b) => /^(İleri|Next|← Geri|← Back|Geri|Back)\b|→$/.test((b.innerText || '').trim()) && vis(b)).slice(0, 2).forEach((b) => keys.push(['gezinme', b]));
    const keyBad = [];
    for (const [k, el] of keys) {
      el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect();
      const cx = Math.min(Math.max(r.left + Math.min(r.width / 2, 40), 1), W - 1), cy = r.top + Math.min(r.height / 2, 12);
      const top = document.elementFromPoint(cx, cy);
      if (r.left < -1 || r.right > W + 1) keyBad.push(`${k}: yatayda dışarıda (${Math.round(r.left)}–${Math.round(r.right)})`);
      else if (top && top !== el && !el.contains(top) && !top.contains(el)) keyBad.push(`${k}: örtülüyor (${top.tagName}.${(top.className || '').toString().slice(0, 20)})`);
    }
    window.scrollTo(0, 0);
    return { out: out.slice(0, 6), clipped: clipped.slice(0, 6), keyBad, keys: keys.length };
  }, W);
}
for (const pg of MOBILE_PAGES) {
  const bad = [];
  for (const [w, hgt] of VPS) {
    await page.setViewport({ width: w, height: hgt });
    await page.goto(BASE + pg.url, { waitUntil: 'networkidle0' }); await sleep(500);
    const r = await layoutCheck(w);
    if (r.out.length || r.clipped.length || r.keyBad.length) bad.push({ vp: `${w}×${hgt}`, ...r });
    if ([320, 390].includes(w) && /demo|ana sayfa|kitap|QR tr 2.3/.test(pg.name)) await page.screenshot({ path: path.join(SHOTS, `${pg.name.replace(/[^\w]+/g, '_')}-${w}.png`), fullPage: false });
  }
  T('K10', `${pg.name}: 6 görünümde (320–1280, 667×375) taşma/kırpılma yok; başlık, metin ve gezinme görünür ve örtülmemiş`, bad.length === 0,
    bad.length ? bad.slice(0, 2) : 'temiz', 'viewport içinde, örtülmemiş', 'tools/site_qa/shots/');
}
// hareket azaltma: animasyon kapalı, son durum görünür
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
for (const u of ['/demo/demo#m=1&s=1', '/']) {
  await page.setViewport({ width: 390, height: 844 }); await page.goto(BASE + u, { waitUntil: 'networkidle0' }); await sleep(300);
  const r = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h1 span')]; const tr = document.querySelector('.ticker-track');
    return { opak: hs.every((h) => +getComputedStyle(h).opacity === 1), ticker: tr ? getComputedStyle(tr).animationName : 'yok', paused: !!document.querySelector('.ticker-sec.paused') };
  });
  T('K10', `hareket azaltma (${u}): başlıklar opak (son durum görünür), demo şeridi durmuş`, r.opak && (r.ticker === 'none' || r.ticker === 'yok'), r, 'opak; animation none');
}
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
// okuyucu kapağında TR/EN bağlantısı yok (sandbox iframe üst gezinmeye izin vermez; dil geçişi okuyucu çubuğunda)
const gated = fs.readFileSync(path.join(ROOT, 'dist/gated/book-tr.html'), 'utf8') + fs.readFileSync(path.join(ROOT, 'dist/gated/book-en.html'), 'utf8');
T('K10', 'okuyucu kitabı (dist/gated): kapakta kırık TR/EN bağlantısı yok; okuyucu çubuğunda dil düğmeleri var',
  !/Herkes-Icin-Yapay-Zeka-TR\.html|AI-for-Everyone-EN\.html/.test(gated) && /data-lang="en"/.test(fs.readFileSync(path.join(STORE, 'oku.html'), 'utf8')),
  'kontrol edildi', 'bağlantı yok; data-lang düğmeleri');
BLOCK('K10', 'gerçek tarayıcı zoom (%200 metin), mobil ekran klavyesi ve gerçek /oku (yazar oturumu)', 'elle kontrol: Browser pane / cihaz');

// ---------------------------------------------------------------- K11 erişilebilirlik ve form
const storeJs = fs.readFileSync(path.join(STORE, 'assets/store.js'), 'utf8');
const delivery = (lang) => { const m = storeJs.match(/const DELIVERY = (\{[\s\S]*?\n {2}\})\[L\];/); return Function(`return (${m[1]})`)()[lang]; };
for (const [lang, url] of [['tr', '/'], ['en', '/en']]) {
  await page.setViewport({ width: 1280, height: 900 }); await page.goto(BASE + url, { waitUntil: 'networkidle0' }); await sleep(400);
  // SSS teslim metni = DELIVERY.faq (tek karar tablosu)
  const faq = await page.evaluate(() => document.querySelector('.faq details p.a').textContent.replace(/\s+/g, ' ').trim());
  T('K11', `${lang}: SSS teslim cevabı karar tablosuyla (store.js DELIVERY.faq) birebir; kesin süre taahhüdü yok`,
    faq === delivery(lang).faq && !/24/.test(faq), faq.slice(0, 90) + '…', 'DELIVERY.faq');
  // kadran (APG slider)
  const dial = await page.evaluate(async () => {
    const s = document.getElementById('dial-strip'); s.focus();
    const key = (k) => s.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    const snap = () => ({ now: s.getAttribute('aria-valuenow'), text: s.getAttribute('aria-valuetext'), mode: document.getElementById('dial-mode').textContent, knob: document.getElementById('dial-knob').style.left });
    const a = snap(); key('End'); const b = snap(); key('Home'); const c = snap(); key('ArrowRight'); key('ArrowRight'); const d = snap();
    return { role: s.getAttribute('role'), tabindex: s.getAttribute('tabindex'), focus: document.activeElement === s, a, b, c, d };
  });
  const tek = lang === 'en' ? 'TECHNICAL' : 'TEKNİK', bas = lang === 'en' ? 'SIMPLE' : 'BASİT';
  T('K11', `${lang}: kadran klavyeyle çalışıyor (role=slider, Home/End/ok); ARIA değeri, görsel düğme ve mod etiketi aynı yoldan; etiket dili doğru`,
    dial.role === 'slider' && dial.tabindex === '0' && dial.focus && dial.a.mode === bas && dial.b.now === '100' && dial.b.mode === tek && parseFloat(dial.b.knob) === 100
      && dial.c.now === '0' && dial.c.mode === bas && dial.d.now === '20' && /20/.test(dial.d.text), dial, 'Home 0 / End 100 / →→ 20');
  // modal (APG dialog)
  if (lang === 'tr') {
    const m = await page.evaluate(async () => {
      const link = document.getElementById('signin-link'); link.focus(); link.click(); await new Promise((r) => setTimeout(r, 200));
      const bd = document.getElementById('auth-backdrop'), dlg = bd.querySelector('.modal');
      return { show: bd.classList.contains('show'), role: dlg.getAttribute('role'), modal: dlg.getAttribute('aria-modal'), lab: !!document.getElementById(dlg.getAttribute('aria-labelledby')),
        firstFocus: document.activeElement && document.activeElement.id, inert: !!document.querySelector('.cover').inert, status: document.getElementById('auth-msg').getAttribute('role') };
    });
    // Tab döngüsü: 12 Tab sonrası odak hâlâ diyalogda; Shift+Tab ilk öğeden sona döner
    let inside = true;
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); inside = inside && await page.evaluate(() => !!document.activeElement.closest('#auth-backdrop')); }
    await page.focus('#auth-email'); await page.keyboard.down('Shift'); await page.keyboard.press('Tab'); await page.keyboard.up('Shift');
    const wrapped = await page.evaluate(() => document.activeElement.closest('#auth-backdrop') && document.activeElement.id !== 'auth-email');
    // arka plandaki bağlantı tıklanamıyor (inert)
    const bgClick = await page.evaluate(() => { const a = document.querySelector('.cover-cta .cbtn'); const r = a.getBoundingClientRect(); const t = document.elementFromPoint(r.left + 5, r.top + 5); return t ? (t.closest('#auth-backdrop') ? 'diyalog katmanı' : t.tagName) : 'yok'; });
    await page.keyboard.press('Escape'); await sleep(150);
    const after = await page.evaluate(() => ({ closed: !document.getElementById('auth-backdrop').classList.contains('show'), back: document.activeElement && document.activeElement.id, inert: !!document.querySelector('.cover').inert }));
    T('K11', 'tr: giriş diyaloğu role=dialog + aria-modal + ad; açılınca odak ilk alanda; arka plan inert; Tab döngüsü; Escape kapatır, odak açan bağlantıya döner',
      m.show && m.role === 'dialog' && m.modal === 'true' && m.lab && m.firstFocus === 'auth-email' && m.inert && m.status === 'status' && inside && wrapped && bgClick === 'diyalog katmanı'
        && after.closed && after.back === 'signin-link' && !after.inert, { m, inside, wrapped, bgClick, after });
    // form: parola sıfırlama hata/limit/çevrimdışı → sahte başarı yok; çift gönderim tek istek; geç yanıt yeni ekrana uygulanmaz
    const forgot = async (handler, act) => {
      let n = 0; supaHandler = (rq) => { if (/\/auth\/v1\/recover/.test(rq.url())) { n++; return handler(rq); } return reply(rq, 200, {}); };
      await page.evaluate(() => { document.getElementById('signin-link').click(); });
      await sleep(150); await page.click('[data-go="forgot"]'); await page.type('#auth-email', 'okur@example.test');
      await act(); await sleep(1800);
      const r = await page.evaluate(() => ({ cls: document.getElementById('auth-msg') && document.getElementById('auth-msg').className, txt: document.getElementById('auth-msg') && document.getElementById('auth-msg').textContent }));
      supaHandler = null; return { n, ...r };
    };
    const rl = await forgot((rq) => reply(rq, 429, { code: 429, msg: 'Email rate limit exceeded', error_code: 'over_email_send_rate_limit' }), () => page.keyboard.press('Enter'));
    await page.keyboard.press('Escape');
    const off = await forgot((rq) => rq.abort('internetdisconnected'), () => page.keyboard.press('Enter'));
    await page.keyboard.press('Escape');
    const dbl = await forgot(async (rq) => { await sleep(900); reply(rq, 200, {}); },
      async () => { await page.keyboard.press('Enter'); await page.keyboard.press('Enter'); await page.evaluate(() => document.getElementById('auth-form').requestSubmit()); });
    await page.keyboard.press('Escape');
    const okTxt = 'Bağlantı yola çıktı';
    T('K11', 'tr: parola sıfırlama 429 → "çok deneme" mesajı, çevrimdışı → bağlantı mesajı; ikisinde de başarı gösterilmiyor',
      /err/.test(rl.cls) && /Art arda çok deneme/.test(rl.txt) && /err/.test(off.cls) && /Bağlantı kurulamadı/.test(off.txt) && !rl.txt.includes(okTxt) && !off.txt.includes(okTxt), { limit: rl, cevrimdisi: off });
    T('K11', 'tr: Enter + Enter + programatik submit → tek istek; başarı yalnız sunucu yanıtından sonra', dbl.n === 1 && dbl.txt.includes(okTxt), dbl, '1 istek');
    // geç yanıt: istek sürerken diyalog kapanıp yeniden açılır; eski yanıt yeni ekrana uygulanmaz
    let release; supaHandler = (rq) => { if (/\/auth\/v1\/recover/.test(rq.url())) { release = () => reply(rq, 429, { msg: 'rate limit' }); return; } reply(rq, 200, {}); };
    await page.evaluate(() => document.getElementById('signin-link').click()); await sleep(150);
    await page.click('[data-go="forgot"]'); await page.type('#auth-email', 'okur@example.test'); await page.keyboard.press('Enter'); await sleep(300);
    await page.keyboard.press('Escape'); await sleep(100); await page.evaluate(() => document.getElementById('signin-link').click()); await sleep(150);
    if (release) release(); await sleep(600);
    const stale = await page.evaluate(() => ({ mode: document.getElementById('auth-title').textContent, msg: document.getElementById('auth-msg').textContent, btn: document.getElementById('auth-submit').disabled }));
    supaHandler = null; await page.keyboard.press('Escape');
    T('K11', 'tr: diyalog kapat-aç sonrası geç dönen eski yanıt yeni ekranı değiştirmiyor (istek nesli)', stale.msg === '' && !stale.btn, stale, 'boş mesaj, düğme etkin');
  }
}
// axe-core otomatik tarama (otomatik bulgu; AA uygunluğu iddiası değildir)
const axeSrc = fs.existsSync(path.join(ROOT, 'tools/site_qa/.cache/axe.min.js')) ? fs.readFileSync(path.join(ROOT, 'tools/site_qa/.cache/axe.min.js'), 'utf8') : null;
if (!axeSrc) BLOCK('K11', 'axe-core taraması', 'tools/site_qa/.cache/axe.min.js yok');
else for (const u of ['/', '/en', '/yasal', '/en/legal', '/hakkimizda', '/404-yok-boyle-bir-sayfa', '/demo/demo', '/demo/demo-en']) {
  // Giriş animasyonları (fadeIn 1,1 s) bitmeden ölçülürse yarı saydam renkler sahte kontrast ihlali verir
  await page.setViewport({ width: 1280, height: 900 }); await page.goto(BASE + u, { waitUntil: 'networkidle0' }); await sleep(2000); await page.addScriptTag({ content: axeSrc });
  const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })).violations
    .map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, ornek: x.nodes[0] && x.nodes[0].target.join(' ') })));
  const serious = v.filter((x) => ['serious', 'critical'].includes(x.impact));
  T('K11', `axe-core (${u}): ciddi/kritik ihlal yok (otomatik tarama; elle denetimin yerine geçmez)`, serious.length === 0, v.length ? v : 'ihlal yok', 'serious/critical 0');
}
BLOCK('K11', 'VoiceOver ile gerçek duyuru, gerçek e-posta ile şifre kurtarma uçtan uca (mail sink + test hesabı)', 'test ortamı ve elle denetim gerekir');

// ---------------------------------------------------------------- K12 rotalar ve head
const head = (h) => ({
  title: (h.match(/<title>([^<]*)<\/title>/) || [])[1], desc: (h.match(/<meta name="description" content="([^"]*)"/) || [])[1],
  robots: (h.match(/<meta name="robots" content="([^"]*)"/) || [])[1], canonical: (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1],
  alts: [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => m[1] + '=' + m[2]).sort(),
});
const unesc = (s) => s && s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
for (const r of routes.routes) {
  const res = await fetchNoRedirect(BASE + r.url); const html = await res.text(); const h = head(html);
  const alt = routes.routes.find((x) => x.id === r.alt);
  const wantAlts = [r, alt].map((x) => x.lang + '=' + routes.site + x.url).concat(r.x_default ? ['x-default=' + routes.site + '/'] : []).sort();
  const ok = res.status === 200 && unesc(h.title) === r.title && unesc(h.desc) === r.description && h.robots === 'index, follow'
    && h.canonical === routes.site + r.url && JSON.stringify(h.alts) === JSON.stringify(wantAlts) && new RegExp(`<html lang="${r.lang}"`).test(html);
  T('K12', `${r.url}: HTTP 200, lang, title, description, robots, self canonical, karşılıklı hreflang manifestle aynı`, ok, { status: res.status, ...h }, wantAlts.join(' '));
}
const variants = [['/yasal.html', '/yasal'], ['/en/', '/en'], ['/hakkimizda/', '/hakkimizda'], ['/index.html', '/'], ['/en/?ref=qr', '/en?ref=qr'], ['/demo/demo.html', '/demo/demo']];
const vres = [];
for (const [from, to] of variants) {
  const r1 = await fetchNoRedirect(BASE + from); const loc = r1.headers.get('location') || '';
  const final = loc ? await fetchNoRedirect(new URL(loc, BASE).href) : r1;
  vres.push({ from, status: r1.status, loc: loc.replace(BASE, ''), final: final.status, ok: [301, 307, 308].includes(r1.status) && new URL(loc, BASE).pathname + new URL(loc, BASE).search === to && final.status === 200 });
}
T('K12', '.html, sonda / ve query varyantları tek adımda kanonik 200 adrese gidiyor (query korunuyor)', vres.every((v) => v.ok), vres);
const nf = [];
for (const u of ['/yok-boyle-bir-sayfa', '/en/yok-boyle-bir-sayfa', '/d/yok']) { const r = await fetchNoRedirect(BASE + u); const t = await r.text(); nf.push({ u, status: r.status, marka: /Sayfa bulunamadı/.test(t) && /Page not found/.test(t) }); }
T('K12', 'bilinmeyen yollar gerçek HTTP 404 ve iki dilli 404.html (ana sayfaya 200 ile düşmüyor)', nf.every((x) => x.status === 404 && x.marka), nf);
const smx = await (await fetch(BASE + '/sitemap.xml')).text();
const locs = [...smx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const want = routes.routes.filter((r) => r.index).map((r) => routes.site + r.url).sort();
const smStat = [];
for (const l of locs) { const r = await fetchNoRedirect(BASE + new URL(l).pathname); smStat.push(r.status); }
T('K12', 'sitemap.xml: geçerli yapı, yalnız indekslenen 8 kamu URL\'si, lastmod yok, her loc 200; özel rota yok',
  /^<\?xml/.test(smx) && JSON.stringify([...locs].sort()) === JSON.stringify(want) && !/lastmod/.test(smx) && smStat.every((s) => s === 200) && !/oku|read|satin-alma|purchase|yonetim|\/d\//.test(locs.join(' ')), { locs: locs.length, smStat });
const rb = await fetchNoRedirect(BASE + '/robots.txt'); const rbt = await rb.text();
T('K12', 'robots.txt: 200, text/plain, Allow: / ve Sitemap satırı; Disallow listesi yok', rb.status === 200 && /text\/plain/.test(rb.headers.get('content-type') || '') && /Sitemap: https:\/\/book\.onuronder\.com\/sitemap\.xml/.test(rbt) && !/Disallow/.test(rbt), rbt.split('\n').filter((l) => /^[A-Z]/.test(l)));
const llm = await fetchNoRedirect(BASE + '/llms.txt'); const llmt = await llm.text();
T('K12', 'llms.txt: 200, H1 başlık, yalnız kamu bağlantıları', llm.status === 200 && /^# /.test(llmt) && ![...llmt.matchAll(/\]\(([^)]+)\)/g)].some((m) => !want.includes(m[1])), [...llmt.matchAll(/\]\(([^)]+)\)/g)].length + ' bağlantı');
// 90 QR sayfası: görünür bağlantılar yalnız / ve /en; noindex
let qrBad = [], qrN = 0;
await page.setViewport({ width: 390, height: 844 });
for (const lang of ['tr', 'en']) for (const [k, sl] of Object.entries(slugs[lang])) {
  const u = `/d/${lang === 'en' ? 'en/' : ''}${sl}`;
  await page.goto(BASE + u, { waitUntil: 'networkidle0' }); qrN++;
  const r = await page.evaluate(() => ({ hrefs: [...document.querySelectorAll('a')].filter((a) => a.getBoundingClientRect().width).map((a) => a.getAttribute('href')),
    noindex: /noindex/.test((document.querySelector('meta[name=robots]') || {}).content || ''), lang: document.documentElement.lang }));
  const exp = lang === 'en' ? '/en' : '/';
  if (!r.noindex || r.lang !== lang || !r.hrefs.length || r.hrefs.some((h) => h !== exp)) qrBad.push({ k: `${lang} ${k}`, ...r });
}
T('K12', `${qrN} QR sayfası: görünür bağlantılar yalnız ${'/'} (TR) ve /en (EN); noindex; doğru lang`, qrN === 90 && qrBad.length === 0, qrBad.slice(0, 3).concat([{ sayfa: qrN }]));
if (REMOTE) {
  const hd = await fetchNoRedirect(BASE + '/');
  const hs = { hsts: hd.headers.get('strict-transport-security'), csp: !!hd.headers.get('content-security-policy'), nosniff: hd.headers.get('x-content-type-options') };
  T('K12', 'üretim başlıkları: HSTS max-age=63072000 (kapsam genişletilmedi), CSP, nosniff', hs.hsts === 'max-age=63072000' && hs.csp && hs.nosniff === 'nosniff', hs);
  const d = await fetchNoRedirect(BASE + '/docs/site-denetimi/veri-envanteri.md');
  T('K12', 'taslak belgeler (docs/) dağıtımda yok', d.status === 404, d.status);
} else BLOCK('K12', 'üretim başlıkları (HSTS/CSP) ve docs/ dağıtım dışı', 'yalnız BASE_URL (Vercel preview) ile ölçülür');

T('genel', 'sayfa JavaScript hatası yok', pageErrors.length === 0, pageErrors.slice(0, 5));
await browser.close(); if (server) server.close();
let commit = ''; try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim() + (execSync('git status --porcelain store build.py Atlas-Kitap.dc.html', { cwd: ROOT }).toString().trim() ? '+değişiklik' : ''); } catch (e) {}
const sum = { tarih: new Date().toISOString(), commit, ortam: ENV, kabul_kaniti: !!REMOTE, PASS: R.filter((r) => r.status === 'PASS').length, FAIL: R.filter((r) => r.status === 'FAIL').length, BLOCKED: R.filter((r) => r.status === 'BLOCKED').length, testler: R };
fs.writeFileSync(path.join(ROOT, 'tools/site_qa/site-test.json'), JSON.stringify(sum, null, 1));
for (const r of R) console.log(r.status === 'PASS' ? '✔' : r.status === 'BLOCKED' ? '·' : '✘', r.id, r.test, r.status === 'FAIL' ? JSON.stringify(r.actual).slice(0, 400) : '');
console.log(`${sum.PASS} PASS · ${sum.FAIL} FAIL · ${sum.BLOCKED} BLOCKED · ortam ${ENV}${REMOTE ? '' : ' (geliştirme; kabul için BASE_URL=<preview>)'}`);
process.exit(sum.FAIL ? 1 : 0);
