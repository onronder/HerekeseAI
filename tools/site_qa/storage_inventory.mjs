// CK04: anonim tarayıcıda depolama ve ağ envanteri (yalnız anahtar adı / alan adı; değer kaydedilmez).
// Kullanım: node tools/site_qa/storage_inventory.mjs [BASE_URL]  (varsayılan https://book.onuronder.com)
import path from 'node:path'; import fs from 'node:fs';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const BASE = (process.argv[2] || 'https://book.onuronder.com').replace(/\/$/, '');
const { default: puppeteer } = await import(path.join(ROOT, 'print/typeset/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'));
const b = await puppeteer.launch({ headless: 'new', executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await b.createIncognitoBrowserContext(); const p = await ctx.newPage();
const hosts = new Set(); p.on('request', (r) => { try { hosts.add(new URL(r.url()).host); } catch (e) {} });
const out = { tarih: new Date().toISOString(), base: BASE, profil: 'temiz anonim (incognito), giriş yok', sayfalar: {} };
const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'qr-slugs.json'), 'utf8'));
for (const u of ['/', '/en', '/demo/demo#m=1&s=0', '/demo/demo-en#m=1&s=1', `/d/${slugs.tr['2.3']}`, '/yasal']) {
  hosts.clear();
  await p.goto(BASE + u, { waitUntil: 'networkidle0' }); await new Promise((r) => setTimeout(r, 1500));
  const st = await p.evaluate(async () => ({
    localStorage: Object.keys(localStorage), sessionStorage: Object.keys(sessionStorage),
    indexedDB: indexedDB.databases ? (await indexedDB.databases()).map((d) => d.name) : 'desteklenmiyor',
    documentCookie: document.cookie ? document.cookie.split(';').map((c) => c.split('=')[0].trim()) : [],
  }));
  const cookies = (await p.cookies()).map((c) => `${c.name} (${c.domain})`);
  out.sayfalar[u] = { ...st, cookies, ag_alan_adlari: [...hosts].sort() };
}
await b.close();
fs.writeFileSync(path.join(ROOT, 'docs/site-denetimi/depolama-envanteri.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
