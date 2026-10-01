// R082 bağımsız ölçüm: PDF içerik akışlarından her metin gösteriminin gerçek puntosu = Tf boyutu × metin matrisi (Tm) × grafik matrisi (CTM)
// dikey ölçeği; Form XObject'lerin /Matrix'i ve iç içe q/Q yığını izlenir. Sayfa başına en küçük punto ve 6,5 pt altındaki gösterimler.
// Kullanım: node pdf_fontsize.mjs <pdf> [ilk son] [eşik=6.5]   (print/typeset/node_modules/pdf-lib ile)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../typeset/package.json'));
const { PDFDocument, PDFName, PDFRawStream, PDFArray, PDFDict, decodePDFRawStream, PDFRef } = require('pdf-lib');
const [, , file, a, b, thr] = process.argv;
const LIM = Number(thr || 6.5);
const doc = await PDFDocument.load(fs.readFileSync(file), { updateMetadata: false });
const pages = doc.getPages();
const first = Number(a || 1), last = Number(b || pages.length);
const mul = (m, n) => [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3], m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5]];
const vscale = (m) => Math.hypot(m[2], m[3]);
const dec = (s) => Buffer.from(s instanceof PDFRawStream ? decodePDFRawStream(s).decode() : s.getContents());
const look = (o) => (o instanceof PDFRef ? doc.context.lookup(o) : o);
function tokens(buf) {
  const s = buf.toString('latin1'); const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '%') { while (i < s.length && s[i] !== '\n' && s[i] !== '\r') i++; continue; }
    if (c === '(') { let d = 1, j = i + 1; while (j < s.length && d) { if (s[j] === '\\') j += 2; else { if (s[j] === '(') d++; else if (s[j] === ')') d--; j++; } } out.push({ t: 'str', v: s.slice(i + 1, j - 1) }); i = j; continue; }
    if (c === '<' && s[i + 1] === '<') { out.push({ t: 'op', v: '<<' }); i += 2; continue; }
    if (c === '>' && s[i + 1] === '>') { out.push({ t: 'op', v: '>>' }); i += 2; continue; }
    if (c === '<') { const j = s.indexOf('>', i); out.push({ t: 'str', v: s.slice(i + 1, j) }); i = j + 1; continue; }
    if (c === '[' || c === ']') { out.push({ t: 'op', v: c }); i++; continue; }
    if (c === '/') { let j = i + 1; while (j < s.length && !/[\s/\[\]()<>{}%]/.test(s[j])) j++; out.push({ t: 'name', v: s.slice(i + 1, j) }); i = j; continue; }
    let j = i; while (j < s.length && !/[\s/\[\]()<>{}%]/.test(s[j])) j++;
    const w = s.slice(i, j); i = j === i ? i + 1 : j;
    if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(w)) out.push({ t: 'num', v: Number(w) }); else out.push({ t: 'op', v: w });
  }
  return out;
}
const results = [];
function run(buf, res, ctm0, page) {
  const stack = []; let ctm = ctm0, tm = [1, 0, 0, 1, 0, 0], size = 0, font = '', args = [], inArr = 0, lastStr = '';
  for (const tk of tokens(buf)) {
    if (tk.t !== 'op' || tk.v === '<<' || tk.v === '>>') { args.push(tk); continue; }
    if (tk.v === '[') { inArr++; continue; } if (tk.v === ']') { inArr--; continue; }
    const n = args.filter((x) => x.t === 'num').map((x) => x.v);
    switch (tk.v) {
      case 'q': stack.push(ctm); break;
      case 'Q': ctm = stack.pop() || ctm0; break;
      case 'cm': ctm = mul(n.slice(-6), ctm); break;
      case 'BT': tm = [1, 0, 0, 1, 0, 0]; break;
      case 'Tf': size = n[n.length - 1]; font = (args.filter((x) => x.t === 'name').pop() || {}).v || ''; break;
      case 'Tm': tm = n.slice(-6); break;
      case 'Td': case 'TD': tm = mul([1, 0, 0, 1, n[n.length - 2], n[n.length - 1]], tm); break;
      case 'Tj': case 'TJ': case "'": case '"': results.push({ page, pt: size * vscale(mul(tm, ctm)), font, res, y: mul(tm, ctm)[5], s: args.filter((x) => x.t === 'str').map((x) => x.v).join('').slice(0, 24) }); break;
      case 'Do': {
        const nm = args.filter((x) => x.t === 'name').pop();
        const xo = nm && res && look(res.get(PDFName.of('XObject')));
        const x = xo && look(xo.get(PDFName.of(nm.v)));
        if (x && x.dict && x.dict.get(PDFName.of('Subtype'))?.toString() === '/Form') {
          const M = x.dict.get(PDFName.of('Matrix')); const mm = M ? M.asArray().map((v) => v.asNumber()) : [1, 0, 0, 1, 0, 0];
          run(dec(x), look(x.dict.get(PDFName.of('Resources'))) || res, mul(mm, ctm), page);
        }
        break;
      }
    }
    args = [];
  }
}
for (let p = first; p <= last; p++) {
  const pg = pages[p - 1]; const node = pg.node;
  const c = look(node.get(PDFName.of('Contents')));
  const parts = c instanceof PDFArray ? c.asArray().map(look) : [c];
  const buf = Buffer.concat(parts.map(dec).flatMap((x) => [x, Buffer.from('\n')]));
  run(buf, node.Resources(), [1, 0, 0, 1, 0, 0], p);
}
function ftype(r) {
  try { const F = look(look(r.res.get(PDFName.of('Font'))).get(PDFName.of(r.font))); const st = F.get(PDFName.of('Subtype')).toString();
    if (st === '/Type3') { const fm = F.get(PDFName.of('FontMatrix')).asArray().map((v) => v.asNumber()); return { t3: true, fm: Math.hypot(fm[2], fm[3]) * 1000, base: '' }; }
    return { t3: false, fm: 1, base: (F.get(PDFName.of('BaseFont')) || '').toString() }; } catch { return { t3: false, fm: 1, base: '?' }; }
}
for (const r of results) { const f = ftype(r); r.t3 = f.t3; r.base = f.base; if (f.t3) r.pt *= f.fm; }
if (process.env.DEBUG) for (const r of results.filter((r) => r.pt < LIM - 0.005)) console.log(r.page, r.pt.toFixed(2), r.t3 ? 'T3' : r.base, r.y.toFixed(0), JSON.stringify(r.s));
const byPage = {};
for (const r of results) if (r.pt > 0.5) byPage[r.page] = Math.min(byPage[r.page] ?? 99, r.pt);
const low = results.filter((r) => r.pt > 0.5 && r.pt < LIM - 0.005);
const lowPages = {}; for (const r of low) lowPages[r.page] = Math.min(lowPages[r.page] ?? 99, +r.pt.toFixed(2));
const norm_ = results.filter((r) => !r.t3 && r.pt > 0.5); const band = norm_.filter((r) => r.pt >= 5.5 && r.pt < LIM - 0.005);
const bandPages = {}; for (const r of band) bandPages[r.page] = Math.min(bandPages[r.page] ?? 99, +r.pt.toFixed(2));
console.log(JSON.stringify({ file, pages: `${first}-${last}`, shows: results.length, normal_min_ge55: Math.min(...norm_.filter((r) => r.pt >= 5.5).map((r) => r.pt)).toFixed(3), band_5_5_to_lim: band.length, bandPages, sup_sub_lt55: norm_.filter((r) => r.pt < 5.5).length, type3_fallback: results.filter((r) => r.t3).length, min: Math.min(...results.filter((r) => r.pt > 0.5).map((r) => r.pt)).toFixed(3),
  below: low.length, lowPages }, null, 0));
