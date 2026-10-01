// PDF'teki QR kodları okur: her sayfa 150 dpi PNG'ye çevrilir (pdftoppm), jsqr ile çözülür.
// node check_qr.mjs <pdf> [tr|en]  → bulunan URL'ler, beklenen 45 slug ile karşılaştırılır.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';

const pdf = process.argv[2];
const lang = process.argv[3] || 'tr';
const slugs = JSON.parse(fs.readFileSync(new URL('../../qr-slugs.json', import.meta.url), 'utf8'))[lang];
const base = lang === 'en' ? 'https://book.onuronder.com/d/en/' : 'https://book.onuronder.com/d/';
const expect = new Set(Object.values(slugs).map(s => `${base}${s}`));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qr-'));
const pages = Number(execSync(`pdfinfo "${pdf}"`).toString().match(/Pages:\s+(\d+)/)[1]);
const found = new Map();
const quiet = [];
for (let p = 1; p <= pages; p++) {
  execSync(`pdftoppm -r 150 -f ${p} -l ${p} -png "${pdf}" "${tmp}/p"`);
  const file = fs.readdirSync(tmp).find(f => f.startsWith('p'));
  const png = PNG.sync.read(fs.readFileSync(path.join(tmp, file)));
  fs.unlinkSync(path.join(tmp, file));
  // sayfada birden çok QR olabilir: bulunanı maskeleyip tekrar dene
  for (let k = 0; k < 4; k++) {
    const r = jsQR(png.data, png.width, png.height);
    if (!r) break;
    if (r.data) found.set(r.data, (found.get(r.data) ?? []).concat(p)); // boş çözüm = figürden yanlış pozitif
    if (r.data) { // sessiz alan (R078): kod kenarından dışa doğru kesintisiz beyaz piksel; 150 dpi → 1 px = 0,1693 mm
      const L = r.location, x0 = Math.min(L.topLeftCorner.x, L.bottomLeftCorner.x) | 0, x1 = Math.max(L.topRightCorner.x, L.bottomRightCorner.x) | 0;
      const y0 = Math.min(L.topLeftCorner.y, L.topRightCorner.y) | 0, y1 = Math.max(L.bottomLeftCorner.y, L.bottomRightCorner.y) | 0;
      const white = (x, y) => { if (x < 0 || y < 0 || x >= png.width || y >= png.height) return false; const i = (y * png.width + x) * 4; return png.data[i] > 235 && png.data[i+1] > 235 && png.data[i+2] > 235; };
      const run = (dx, dy, xs, ys) => { let n = 0; while (n < 60 && xs.every(x => ys.every(y => white(x + dx * (n + 1), y + dy * (n + 1))))) n++; return n; };
      const ysMid = [ (y0 + y1) / 2 | 0, y0 + 3, y1 - 3 ], xsMid = [ (x0 + x1) / 2 | 0, x0 + 3, x1 - 3 ];
      const mm = 25.4 / 150;
      const q = { l: run(-1, 0, [x0], ysMid) * mm, r: run(1, 0, [x1], ysMid) * mm, t: run(0, -1, xsMid, [y0]) * mm, b: run(0, 1, xsMid, [y1]) * mm };
      const minQ = Math.min(q.l, q.r, q.t, q.b);
      quiet.push({ p, min: minQ });
    }
    const { topLeftCorner: a, bottomRightCorner: b } = r.location;
    for (let y = Math.max(0, a.y - 8 | 0); y < Math.min(png.height, b.y + 8); y++)
      for (let x = Math.max(0, a.x - 8 | 0); x < Math.min(png.width, b.x + 8); x++) {
        const i = (y * png.width + x) * 4; png.data[i] = png.data[i + 1] = png.data[i + 2] = 255;
      }
  }
}
const ok = [...found.keys()].filter(u => expect.has(u));
const bad = [...found.keys()].filter(u => !expect.has(u));
const missing = [...expect].filter(u => !found.has(u));
const badQ = quiet.filter(q => q.min < 2.7);
console.log(`QR sessiz alan: ${quiet.length} kod ölçüldü · en dar ${quiet.length ? Math.min(...quiet.map(q => q.min)).toFixed(2) : '-'} mm · < 2,7 mm olan: ${badQ.length}` + (badQ.length ? ' (s.' + badQ.map(q => q.p).join(',') + ')' : ''));
console.log(`QR okunan: ${found.size} · beklenen ile eşleşen: ${ok.length}/${expect.size} · eksik: ${missing.length} · yabancı: ${bad.length}`);
if (missing.length) console.log('eksik:', missing.join(' '));
if (bad.length) console.log('yabancı:', bad.join(' '));
if (badQ.length) process.exitCode = 1;
process.exit(missing.length || bad.length ? 1 : 0);
