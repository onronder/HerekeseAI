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
console.log(`QR okunan: ${found.size} · beklenen ile eşleşen: ${ok.length}/${expect.size} · eksik: ${missing.length} · yabancı: ${bad.length}`);
if (missing.length) console.log('eksik:', missing.join(' '));
if (bad.length) console.log('yabancı:', bad.join(' '));
process.exit(missing.length || bad.length ? 1 : 0);
