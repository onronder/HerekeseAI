// Kapak yayılımı (arka + sırt + ön) → out/kapak.html. kapak.json: ölçü, metin, variant ("ag" | "kadran" | "vadi").
// Tüm çizimler vektör SVG, düz renk (saydamlık yok → PDF/X). node kapak.mjs [variant] [outName] [--lang tr|en] [--profile matbaa|kdp]
//   EN metinleri kapak.en.json'dan; kdp profili 6×9 in + 0.125 in taşma, sırt = sayfa × 0.002252 in (kapak.json → spine_mm ya da pages).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const LANG = opt('--lang', 'tr'), PROFILE = opt('--profile', 'matbaa');
const pos = argv.filter((a, i) => !a.startsWith('--') && (i === 0 || !argv[i - 1].startsWith('--')));
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, LANG === 'en' ? 'kapak.en.json' : 'kapak.json'), 'utf8'));
const VARIANT = pos[0] || cfg.variant || 'ag';
const KDP = PROFILE === 'kdp';
const IN = 25.4;
const W = KDP ? 6 * IN : 160, H = KDP ? 9 * IN : 240, BLEED = KDP ? 0.125 * IN : 5;
const SP = KDP && cfg.pages ? Number(cfg.pages) * 0.002252 * IN : Number(cfg.spine_mm);
const T = LANG === 'en'
  ? { eyebrow: 'From rules to deep learning', title: 'AI for<br>Everyone', spine: 'AI for Everyone', author: 'Onur Önder', isbnPh: 'ISBN barcode<br><small>[ISBN] → kapak.en.json → isbn</small>',
      labels: ['RULES', 'SEARCH', 'PROBABILITY', 'LEARNING', 'NEURONS', 'ATTENTION'], htmlLang: 'en', docTitle: 'Cover' }
  : { eyebrow: 'Kuraldan derin öğrenmeye', title: 'Herkes İçin<br>Yapay Zekâ', spine: 'Herkes İçin Yapay Zekâ', author: 'Onur Önder', isbnPh: 'ISBN barkodu<br><small>[YENİ ISBN] geldiğinde kapak.json → isbn</small>',
      labels: ['KURAL', 'ARAMA', 'OLASILIK', 'ÖĞRENME', 'NÖRON', 'DİKKAT'], htmlLang: 'tr', docTitle: 'Kapak' };
const TW = 2 * W + SP + 2 * BLEED, TH = H + 2 * BLEED;
const FX = BLEED + W + SP; // ön kapak sol kenarı (mm)
const INK = '#1f1f1f', PAPER = '#f4efe6', EMBER = '#e85d3a', MUTED = '#8a8270', RULE = '#d8d2c6', CREAM2 = '#efe9dc';

// deterministik rastgele
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const f2 = (n) => Number(n.toFixed(2));

// ---------------------------------------------------------------- A) AĞ: kuraldan öğrenmeye geçen ağ
function artAg() {
  const r = rng(7);
  const x0 = FX + 14, x1 = FX + W - 12, y0 = 104, y1 = 212;
  const cols = 11, colW = (x1 - x0) / (cols - 1);
  const nodes = [];
  for (let c = 0; c < cols; c++) {
    const t = c / (cols - 1);                // 0 = kural (ızgara), 1 = öğrenme (organik)
    const rows = Math.round(5 + t * 9);
    const jitter = t * t * 9;
    const col = [];
    for (let i = 0; i < rows; i++) {
      const y = y0 + (i + 0.5) * (y1 - y0) / rows + (r() - 0.5) * jitter * 2;
      const x = x0 + c * colW + (r() - 0.5) * jitter;
      col.push({ x, y, t });
    }
    nodes.push(col);
  }
  let edges = '', hot = '', dots = '', hotdots = '';
  const hotPath = [2]; // vurgulu yol: her sütunda bir düğüm; orta banda yakın dalgalı rota
  for (let c = 0; c < cols - 1; c++) {
    const a = nodes[c], b = nodes[c + 1], t = c / (cols - 1);
    const kmax = 1 + Math.round(t * 1.4);
    a.forEach((p, i) => {
      const targets = new Set();
      const base = Math.round(i * (b.length - 1) / Math.max(1, a.length - 1));
      targets.add(Math.min(b.length - 1, Math.max(0, base)));
      for (let k = 0; k < kmax; k++) targets.add(Math.floor(r() * b.length));
      targets.forEach(j => {
        const q = b[j];
        const mid = (p.x + q.x) / 2;
        // ızgara: dirsekli çizgi; organik: bezier
        const d = t < 0.35
          ? `M${f2(p.x)} ${f2(p.y)}H${f2(mid)}V${f2(q.y)}H${f2(q.x)}`
          : `M${f2(p.x)} ${f2(p.y)}C${f2(mid)} ${f2(p.y)} ${f2(mid)} ${f2(q.y)} ${f2(q.x)} ${f2(q.y)}`;
        const isHot = hotPath[c] === i && j === (hotPath[c + 1] ?? -1);
        edges += `<path d="${d}" stroke="${t < 0.35 ? '#5a554a' : '#6c6555'}" stroke-width="${f2(0.22 + t * 0.12)}" fill="none"/>`;
      });
    });
    // vurgulu yolun bir sonraki düğümü: hedeflerden orta bir tanesi
    const ty = (y0 + y1) / 2 + Math.sin((c + 1) * 0.9) * (y1 - y0) * 0.22 + (r() - 0.5) * 6;
    let j = 0; b.forEach((q, k) => { if (Math.abs(q.y - ty) < Math.abs(b[j].y - ty)) j = k; });
    hotPath.push(j);
  }
  for (let c = 0; c < cols - 1; c++) {
    const p = nodes[c][hotPath[c]], q = nodes[c + 1][hotPath[c + 1]], t = c / (cols - 1), mid = (p.x + q.x) / 2;
    const d = t < 0.35 ? `M${f2(p.x)} ${f2(p.y)}H${f2(mid)}V${f2(q.y)}H${f2(q.x)}`
      : `M${f2(p.x)} ${f2(p.y)}C${f2(mid)} ${f2(p.y)} ${f2(mid)} ${f2(q.y)} ${f2(q.x)} ${f2(q.y)}`;
    hot += `<path d="${d}" stroke="${EMBER}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
  }
  nodes.forEach((col, c) => col.forEach((p, i) => {
    const t = c / (cols - 1), isHot = hotPath[c] === i;
    if (t < 0.35 && !isHot) dots += `<rect x="${f2(p.x - 1.1)}" y="${f2(p.y - 1.1)}" width="2.2" height="2.2" fill="${INK}" stroke="${RULE}" stroke-width="0.3"/>`;
    else if (!isHot) dots += `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="${f2(0.9 + t * 0.9)}" fill="${INK}" stroke="${RULE}" stroke-width="0.3"/>`;
    if (isHot) hotdots += `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="${f2(1.5 + t * 1.6)}" fill="${EMBER}"/>` + (c === cols - 1 ? `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="6" stroke="${EMBER}" stroke-width="0.5" fill="none"/>` : '');
  }));
  // sırt ve arkaya taşan ince ızgara (arka: sol üstte küçük motif)
  const back = (() => {
    let s = '';
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
      const x = BLEED + 16 + i * 4.2, y = BLEED + 16 + j * 4.2;
      s += (i + j) % 7 === 3 ? `<circle cx="${x}" cy="${y}" r="0.9" fill="${EMBER}"/>` : `<rect x="${x - 0.7}" y="${y - 0.7}" width="1.4" height="1.4" fill="${RULE}"/>`;
    }
    return s;
  })();
  return { bg: INK, fg: PAPER, sub: RULE, svg: `${edges}${hot}${dots}${hotdots}${back}`, titleColor: PAPER, backBg: INK, backFg: PAPER, spineBg: INK, spineFg: PAPER, eyebrowColor: EMBER };
}

// ---------------------------------------------------------------- B) KADRAN: basitten tekniğe çevrilen kadran
function artKadran() {
  const cx = FX + W + 26, cy = 286;       // merkez sayfa dışında sağ altta
  const R = 168;
  let s = '';
  const arc = (rad, a0, a1, stroke, w) => {
    const p = (a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    const [ax, ay] = p(a0), [bx, by] = p(a1);
    return `<path d="M${f2(ax)} ${f2(ay)}A${rad} ${rad} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f2(bx)} ${f2(by)}" stroke="${stroke}" stroke-width="${w}" fill="none"/>`;
  };
  const A0 = Math.PI * 1.07, A1 = Math.PI * 1.57;
  // halkalar
  for (let k = 0; k < 12; k++) s += arc(R - k * 8.5, A0, A1, k === 0 ? INK : (k % 4 === 0 ? MUTED : RULE), k === 0 ? 0.8 : 0.35);
  // tik işaretleri
  const N = 72;
  for (let i = 0; i <= N; i++) {
    const a = A0 + (A1 - A0) * i / N, big = i % 12 === 0, mid = i % 4 === 0;
    const r0 = R + 1.5, r1 = R + (big ? 8 : mid ? 5 : 3);
    s += `<line x1="${f2(cx + r0 * Math.cos(a))}" y1="${f2(cy + r0 * Math.sin(a))}" x2="${f2(cx + r1 * Math.cos(a))}" y2="${f2(cy + r1 * Math.sin(a))}" stroke="${big ? INK : MUTED}" stroke-width="${big ? 0.6 : 0.3}"/>`;
  }
  // ember dolu yay: öğrenmeye doğru ilerleyen kısım
  s += arc(R - 25.5, A0 + (A1 - A0) * 0.42, A1, EMBER, 5.5);
  // ibre
  const an = A0 + (A1 - A0) * 0.42;
  s += `<line x1="${f2(cx + 30 * Math.cos(an))}" y1="${f2(cy + 30 * Math.sin(an))}" x2="${f2(cx + (R + 10) * Math.cos(an))}" y2="${f2(cy + (R + 10) * Math.sin(an))}" stroke="${INK}" stroke-width="0.9"/>`;
  s += `<circle cx="${f2(cx + (R + 10) * Math.cos(an))}" cy="${f2(cy + (R + 10) * Math.sin(an))}" r="2.4" fill="${EMBER}"/>`;
  // etiketler yay boyunca
  const labels = T.labels;
  labels.forEach((t, i) => {
    const a = A0 + (A1 - A0) * (i + 0.5) / labels.length, rr = R + 12;
    const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a), deg = (a * 180 / Math.PI) + 90;
    s += `<text x="${f2(x)}" y="${f2(y)}" transform="rotate(${f2(deg)} ${f2(x)} ${f2(y)})" text-anchor="middle" font-family="'Space Mono', monospace" font-size="3.4" letter-spacing="0.7" fill="${i >= 3 ? EMBER : '#37332a'}">${t}</text>`;
  });
  // arka: küçük kadran
  const bx = BLEED + 28, by = BLEED + 30;
  for (let i = 0; i <= 24; i++) { const a = Math.PI * (1 + 0.6 * i / 24); s += `<line x1="${f2(bx + 16 * Math.cos(a))}" y1="${f2(by + 16 * Math.sin(a))}" x2="${f2(bx + 19 * Math.cos(a))}" y2="${f2(by + 19 * Math.sin(a))}" stroke="${i > 10 ? EMBER : MUTED}" stroke-width="0.35"/>`; }
  return { bg: PAPER, svg: s, titleColor: INK, backBg: PAPER, backFg: INK, spineBg: EMBER, spineFg: PAPER, eyebrowColor: EMBER, sub: '#37332a' };
}

// ---------------------------------------------------------------- C) VADİ: kayıp yüzeyi eş yükselti çizgileri + gradyan inişi
function artVadi() {
  const gx0 = FX - 0.5, gy0 = 0, gw = W + BLEED + 1, gh = TH;  // ön panel tamamı (taşma dahil)
  const nx = 170, ny = 260, dx = gw / nx, dy = gh / ny;
  const f = (x, y) => { // x,y mm (ön panel içi koordinatı)
    const u = x / gw, v = y / gh;
    const g = (cx, cy, sx, sy, a) => a * Math.exp(-(((u - cx) ** 2) / (2 * sx * sx) + ((v - cy) ** 2) / (2 * sy * sy)));
    return g(0.72, 0.78, 0.22, 0.16, -1.0) + g(0.25, 0.55, 0.18, 0.14, 0.55) + g(0.85, 0.35, 0.14, 0.12, 0.45) + g(0.45, 0.9, 0.16, 0.1, 0.35) + g(0.15, 0.2, 0.2, 0.15, 0.3) + 0.12 * Math.sin(u * 7) * Math.cos(v * 5);
  };
  const grid = [];
  for (let j = 0; j <= ny; j++) { const row = []; for (let i = 0; i <= nx; i++) row.push(f(i * dx, j * dy)); grid.push(row); }
  const levels = []; for (let l = -1.0; l <= 1.0; l += 0.045) levels.push(l);
  let paths = '';
  const lerp = (a, b, va, vb, l) => a + (b - a) * ((l - va) / (vb - va || 1e-9));
  levels.forEach((l, li) => {
    let d = '';
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = gx0 + i * dx, y = gy0 + j * dy;
      const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], e = grid[j + 1][i];
      const idx = (a > l ? 8 : 0) | (b > l ? 4 : 0) | (c > l ? 2 : 0) | (e > l ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const top = [lerp(x, x + dx, a, b, l), y], right = [x + dx, lerp(y, y + dy, b, c, l)], bottom = [lerp(x, x + dx, e, c, l), y + dy], left = [x, lerp(y, y + dy, a, e, l)];
      const segs = { 1: [left, bottom], 2: [bottom, right], 3: [left, right], 4: [top, right], 5: [top, left, bottom, right], 6: [top, bottom], 7: [top, left], 8: [top, left], 9: [top, bottom], 10: [top, right, bottom, left], 11: [top, right], 12: [left, right], 13: [bottom, right], 14: [left, bottom] }[idx];
      for (let k = 0; k < segs.length; k += 2) d += `M${f2(segs[k][0])} ${f2(segs[k][1])}L${f2(segs[k + 1][0])} ${f2(segs[k + 1][1])}`;
    }
    const major = li % 4 === 0;
    paths += `<path d="${d}" stroke="${major ? '#6c6555' : '#b7b0a2'}" stroke-width="${major ? 0.32 : 0.2}" fill="none"/>`;
  });
  // gradyan inişi: sol üstteki sırttan sağ alttaki çukura
  let px = gw * 0.36, py = gh * 0.56, pts = [];
  for (let k = 0; k < 42; k++) {
    pts.push([gx0 + px, gy0 + py]);
    const h = 0.6, gxv = (f(px + h, py) - f(px - h, py)) / (2 * h), gyv = (f(px, py + h) - f(px, py - h)) / (2 * h);
    const n = Math.hypot(gxv, gyv) || 1e-6; const step = 6.5;
    px -= step * gxv / n * Math.min(1, n * 400); py -= step * gyv / n * Math.min(1, n * 400);
    px = Math.max(4, Math.min(gw - 8, px)); py = Math.max(gh * 0.42, Math.min(gh - 14, py));
    if (k > 6 && Math.hypot(gxv, gyv) < 0.002) break;
  }
  let desc = `<path d="M${pts.map(p => `${f2(p[0])} ${f2(p[1])}`).join('L')}" stroke="${EMBER}" stroke-width="1.1" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  const s0 = pts[0]; desc += `<line x1="${f2(s0[0]-2.2)}" y1="${f2(s0[1]-2.2)}" x2="${f2(s0[0]+2.2)}" y2="${f2(s0[1]+2.2)}" stroke="${EMBER}" stroke-width="0.8"/><line x1="${f2(s0[0]-2.2)}" y1="${f2(s0[1]+2.2)}" x2="${f2(s0[0]+2.2)}" y2="${f2(s0[1]-2.2)}" stroke="${EMBER}" stroke-width="0.8"/>`;
  pts.forEach((p, i) => { if (i % 3 === 0) desc += `<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="${i === pts.length - 1 ? 2.6 : 1.1}" fill="${EMBER}"/>`; });
  const last = pts[pts.length - 1]; desc += `<circle cx="${f2(last[0])}" cy="${f2(last[1])}" r="4.2" stroke="${EMBER}" stroke-width="0.5" fill="none"/>`;
  // başlık bandı: üstte temiz zemin (çizgiler kesilir)
  const band = `<rect x="${FX}" y="0" width="${W + BLEED}" height="98" fill="${PAPER}"/><line x1="${FX + 14}" y1="98" x2="${FX + W - 14}" y2="98" stroke="${INK}" stroke-width="0.5"/>`;
  return { bg: PAPER, svg: `${paths}${band}${desc}`, titleColor: INK, backBg: PAPER, backFg: INK, spineBg: INK, spineFg: PAPER, eyebrowColor: EMBER, sub: '#37332a' };
}

const art = { ag: artAg, kadran: artKadran, vadi: artVadi }[VARIANT]();
// Çizimler 160×240 mm ön panele göre kurgulandı; KDP 6×9 in (152.4×228.6) için dikey ölçek uygulanır (yatay konumlar FX'e göre zaten göreli).
if (KDP) { const sy = H / 240; art.svg = `<g transform="translate(0 0) scale(1 ${f2(sy)})">${art.svg}</g>`; }

// EAN-13 barkod (ISBN verildiyse); yoksa yer tutucu kutu
// KDP: barkod verilmezse KDP arka kapağın sağ altına kendi barkodunu basar (2×1.2 in alan); yer tutucu boş beyaz kutu bırakılır.
let barcode = KDP ? `<div class="isbn-ph kdp"></div>` : `<div class="isbn-ph">${T.isbnPh}</div>`;
const digits = String(cfg.isbn || '').replace(/[^0-9]/g, '');
if (digits.length === 13) {
  const { DOMImplementation, XMLSerializer } = require('@xmldom/xmldom');
  const JsBarcode = require('jsbarcode');
  const doc = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  JsBarcode(svg, digits, { xmlDocument: doc, format: 'EAN13', width: 2, height: 60, fontSize: 14, margin: 6, background: '#ffffff', lineColor: '#000000' });
  barcode = `<div class="isbn"><div class="isbn-no">ISBN ${cfg.isbn}</div>${new XMLSerializer().serializeToString(svg)}</div>`;
}
const fonts = fs.readFileSync(path.join(ROOT, 'store', 'assets', 'fonts.css'), 'utf8')
  .replaceAll('url(fonts/', `url(file://${path.join(ROOT, 'store', 'assets', 'fonts')}/`);
const paras = cfg.back_text.map(p => `<p>${p}</p>`).join('');
const dark = art.backBg === INK;
const html = `<!doctype html><html lang="${T.htmlLang}"><head><meta charset="utf-8"><title>${T.docTitle}</title>
<style>
${fonts}
@page { size: ${TW}mm ${TH}mm; margin: 0; }
html, body { margin: 0; padding: 0; }
body { width: ${TW}mm; height: ${TH}mm; background: ${art.backBg}; color: ${art.backFg}; font-family: 'Work Sans', sans-serif; position: relative; overflow: hidden; }
svg.art { position: absolute; left: 0; top: 0; width: ${TW}mm; height: ${TH}mm; }
.panel { position: absolute; top: 0; height: ${TH}mm; box-sizing: border-box; }
.back  { left: 0; width: ${BLEED + W}mm; padding: ${BLEED + 20}mm 16mm ${KDP ? BLEED + 14 + 30.5 + 4 : BLEED + 16}mm ${BLEED + 18}mm; }
.spine { left: ${BLEED + W}mm; width: ${SP}mm; background: ${art.spineBg}; color: ${art.spineFg}; }
.front { left: ${FX}mm; width: ${W + BLEED}mm; padding: ${BLEED + 20}mm ${BLEED + 16}mm ${BLEED + 16}mm 16mm; background: ${art.bg}; color: ${art.titleColor}; }
.eyebrow { font-family: 'Space Mono', monospace; font-size: 8pt; letter-spacing: .22em; text-transform: uppercase; color: ${art.eyebrowColor}; }
.front h1 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 52pt; line-height: .98; margin: 9mm 0 5mm; letter-spacing: -.01em; }
.front .sub { font-family: 'Instrument Serif', serif; font-size: 15.5pt; font-style: italic; color: ${art.sub}; margin: 0; }
.front .author { position: absolute; bottom: ${BLEED + 13}mm; left: 16mm; font-family: 'Space Mono', monospace; font-size: 10.5pt; letter-spacing: .2em; text-transform: uppercase; }
.spine .t { position: absolute; top: ${BLEED + 12}mm; left: 50%; transform: translateX(-50%); writing-mode: vertical-rl; white-space: nowrap; font-family: 'Instrument Serif', serif; font-size: ${Math.min(15, SP * 0.95)}pt; }
.spine .a { position: absolute; bottom: ${BLEED + 12}mm; left: 50%; transform: translateX(-50%); writing-mode: vertical-rl; white-space: nowrap; font-family: 'Space Mono', monospace; font-size: ${Math.min(7.5, SP * 0.5)}pt; letter-spacing: .16em; text-transform: uppercase; }
.back .eyebrow { margin-top: ${KDP ? 20 : 30}mm; }
.back .lead { font-family: 'Instrument Serif', serif; font-size: ${KDP ? 14 : 16}pt; line-height: 1.25; margin: ${KDP ? '4mm 0 5mm' : '5mm 0 6mm'}; }
.back p { font-size: ${KDP ? 9 : 9.6}pt; line-height: ${KDP ? 1.5 : 1.55}; margin: 0 0 .8em; text-align: left; }
.back .bio { font-size: ${KDP ? 7.6 : 8.3}pt; color: ${dark ? RULE : '#37332a'}; margin-top: ${KDP ? 5 : 7}mm; border-top: .5pt solid ${dark ? '#5a554a' : MUTED}; padding-top: 3mm; }
.back .bio p { font-size: inherit; line-height: ${KDP ? 1.45 : 1.5}; margin: 0 0 .55em; }
.back .bio p:last-child { margin-bottom: 0; }
.back .bottom { position: absolute; bottom: ${BLEED + (KDP ? 6.35 : 9)}mm; left: ${BLEED + 18}mm; right: ${KDP ? BLEED + 6.35 : 16}mm; display: flex; justify-content: space-between; align-items: flex-end; } /* KDP barkodu kesimden 0.25 in içeride basar; beyaz alan onunla çakışır */
${KDP ? '.back .seller { margin-bottom: 4mm; }' : ''}
.back .seller { font-family: 'Space Mono', monospace; font-size: 6.8pt; color: ${dark ? RULE : '#37332a'}; max-width: 64mm; line-height: 1.5; }
.isbn, .isbn-ph { background: #fff; color: ${INK}; padding: 2mm; border: .4pt solid ${MUTED}; font-family: 'Space Mono', monospace; font-size: 7pt; text-align: center; }
.isbn-ph { width: 40mm; height: 24mm; display: flex; flex-direction: column; justify-content: center; color: ${MUTED}; }
.isbn-ph.kdp { width: 2in; height: 1.2in; border: none; }
.isbn svg { display: block; width: 38mm; height: auto; }
</style></head><body>
<div class="panel back"></div>
<div class="panel spine"></div>
<div class="panel front"></div>
<svg class="art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${TH}">${art.svg}</svg>
<div class="panel back" style="background:none">
  <div class="eyebrow">${T.eyebrow}</div>
  <div class="lead">${cfg.back_lead}</div>
  ${paras}
  <div class="bio">${Array.isArray(cfg.author_bio) ? cfg.author_bio.map(p => `<p>${p}</p>`).join('') : cfg.author_bio}</div>
  <div class="bottom"><div class="seller">${cfg.seller}${cfg.price ? ` · ${cfg.price}` : ''}</div>${barcode}</div>
</div>
<div class="panel spine" style="background:none"><div class="t">${T.spine}</div><div class="a">${T.author}</div></div>
<div class="panel front" style="background:none">
  <div class="eyebrow">${T.eyebrow}</div>
  <h1>${T.title}</h1>
  <p class="sub">${cfg.subtitle}</p>
  <div class="author">${T.author}</div>
</div>
</body></html>`;
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
const outName = pos[1] || (LANG === 'tr' && !KDP ? 'kapak.html' : `kapak-${LANG}-${PROFILE}.html`);
fs.writeFileSync(path.join(HERE, 'out', outName), html);
console.log(`out/${outName} · ${VARIANT} · ${LANG}/${PROFILE} · ${f2(TW)}×${f2(TH)} mm (sırt ${f2(SP)} mm) · barkod: ${digits.length === 13 ? 'EAN-13' : (KDP ? 'KDP basar' : 'yer tutucu')}`);
