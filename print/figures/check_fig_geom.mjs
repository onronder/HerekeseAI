// R073: 90 şeklin geometri denetimi (gerçek fontlarla, headless Chrome). Her <text> için getBBox:
//  (a) viewBox içinde en az KENAR birim pay, (b) iki metin kutusu birbirine binmiyor, (c) metin, çerçeveli kutu/elips kenar çizgisine değmiyor (R073/N008).
// Kullanım: node print/figures/check_fig_geom.mjs [tr|en|all]   → çakışma/taşma listesi; çıkış kodu 1 = sorun var
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, '..', '..');
const { default: puppeteer } = await import(path.join(ROOT, 'print', 'typeset', 'node_modules', 'puppeteer-core', 'lib', 'esm', 'puppeteer', 'puppeteer-core.js'));
const KENAR = 1.0, BIN = 0.6;  // birim: SVG kullanıcı birimi (320 birim ≈ 120 mm → 1 birim ≈ 0,37 mm)
const langs = (process.argv[2] || 'all') === 'all' ? ['tr', 'en'] : [process.argv[2]];
const fontsCss = fs.readFileSync(path.join(ROOT, 'store', 'assets', 'fonts.css'), 'utf8').replace(/url\((['"]?)(?:\.\/)?fonts\//g, `url($1file://${ROOT}/store/assets/fonts/`);
const browser = await puppeteer.launch({ headless: 'new', executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
let problems = 0;
for (const lang of langs) {
  const dir = path.join(ROOT, 'print', 'figures', 'out', lang);
  for (const f of fs.readdirSync(dir).filter((x) => /^(sekil|figure)-\d+-\d+-.*\.svg$/.test(x)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
    const svg = fs.readFileSync(path.join(dir, f), 'utf8');
    await page.setContent(`<!doctype html><html><head><style>${fontsCss} body{margin:0}</style></head><body>${svg}</body></html>`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const res = await page.evaluate((KENAR, BIN) => {
      const s = document.querySelector('svg'); const vb = s.viewBox.baseVal; const out = [];
      const boxes = [...s.querySelectorAll('text')].map((t) => {
        const b = t.getBBox(); const m = t.getCTM(); const r = s.getCTM().inverse().multiply(m);
        // text kutusunu svg kök koordinatlarına taşı (döndürülmüş metinlerde dört köşe)
        const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => [r.a * x + r.c * y + r.e, r.b * x + r.d * y + r.f]);
        const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
        return { s: t.textContent.trim().slice(0, 30), x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), w: b.width };
      }).filter((b) => b.s && b.w > 0);
      for (const b of boxes) if (b.x0 < vb.x + KENAR || b.x1 > vb.x + vb.width - KENAR || b.y0 < vb.y || b.y1 > vb.y + vb.height) out.push(`kenar: "${b.s}" [${b.x0.toFixed(1)}–${b.x1.toFixed(1)} × ${b.y0.toFixed(1)}–${b.y1.toFixed(1)}] / ${vb.width}×${vb.height}`);
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], c = boxes[j];
        const ox = Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0), oy = Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0);
        if (ox > BIN && oy > BIN * 2.2) out.push(`çakışma: "${a.s}" ↔ "${c.s}" (${ox.toFixed(1)}×${oy.toFixed(1)})`);
      }
      // (c) metin kutusu çerçeveli bir kutunun ya da elipsin kenar çizgisini kesiyor mu (kısmen içeride, kısmen dışarıda; çizgiye değme dahil)
      const shapes = [...s.querySelectorAll('rect, ellipse, circle')].filter((e) => {
        const st = e.getAttribute('stroke'); return st && st !== 'none' && !(e.tagName === 'rect' && +e.getAttribute('width') >= vb.width - 0.5);
      }).map((e) => { const b = e.getBBox(); const sw = +(e.getAttribute('stroke-width') || 1); return { x0: b.x - sw / 2, x1: b.x + b.width + sw / 2, y0: b.y - sw / 2, y1: b.y + b.height + sw / 2, sw, tag: e.tagName }; });
      // dolu daire içindeki metin bir rozettir (ör. köşe numaraları); rozet kutu kenarına bilerek oturur
      const badges = [...s.querySelectorAll('circle')].filter((c) => (c.getAttribute('fill') || 'none') !== 'none').map((c) => ({ cx: +c.getAttribute('cx'), cy: +c.getAttribute('cy'), r: +c.getAttribute('r') }));
      const inBadge = (t) => badges.some((b) => Math.hypot((t.x0 + t.x1) / 2 - b.cx, (t.y0 + t.y1) / 2 - b.cy) < b.r && (t.x1 - t.x0) < 2 * b.r);
      for (const t of boxes) for (const r of shapes) {
        if (inBadge(t)) continue;
        const ix = Math.min(t.x1, r.x1) - Math.max(t.x0, r.x0), iy = Math.min(t.y1, r.y1) - Math.max(t.y0, r.y0);
        if (ix <= 0.3 || iy <= 0.3) continue;  // ayrık
        const inside = t.x0 >= r.x0 + r.sw && t.x1 <= r.x1 - r.sw && t.y0 >= r.y0 + r.sw && t.y1 <= r.y1 - r.sw;
        if (inside) continue;  // kutunun içinde
        const covers = t.x0 <= r.x0 && t.x1 >= r.x1 && t.y0 <= r.y0 && t.y1 >= r.y1;  // küçük işaretleyici (nokta) metnin altında: ayrı kural
        if (covers || (r.x1 - r.x0) < 8) continue;
        // metin kutusunun yazı gövdesi (bbox'ın üst %15 ve alt %20 boşluğu hariç) çizgiye değiyorsa raporla
        const ty0 = t.y0 + (t.y1 - t.y0) * 0.15, ty1 = t.y1 - (t.y1 - t.y0) * 0.2;
        const hitsH = (y) => y > ty0 && y < ty1 && t.x1 > r.x0 && t.x0 < r.x1;
        const hitsV = (x) => x > t.x0 && x < t.x1 && ty1 > r.y0 && ty0 < r.y1;
        if (hitsH(r.y0) || hitsH(r.y1) || hitsV(r.x0) || hitsV(r.x1)) out.push(`çizgi teması: "${t.s}" ↔ ${r.tag} [${r.x0.toFixed(1)}–${r.x1.toFixed(1)} × ${r.y0.toFixed(1)}–${r.y1.toFixed(1)}]`);
      }
      return out;
    }, KENAR, BIN);
    if (res.length) { problems += res.length; console.log(`${lang} ${f}`); res.forEach((r) => console.log('   ' + r)); }
  }
}
await browser.close();
console.log(problems ? `SORUN: ${problems}` : 'temiz: metin kutuları kenara taşmıyor ve birbirine binmiyor');
process.exit(problems ? 1 : 0);
