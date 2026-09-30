// Chrome/Paged.js PDF'ine sayfa kutuları yazar: BleedBox = MediaBox, TrimBox = 3 mm içeri.
// node boxes.mjs in.pdf out.pdf [bleed_mm=3]  (Ghostscript pdfwrite giriş PDF'indeki kutuları korur)
import fs from 'node:fs';
import { PDFDocument } from 'pdf-lib';
const [, , inp, out, bleedMm] = process.argv;
const B = Number(bleedMm || 3) * 72 / 25.4; // 3 mm → 8.5039 pt; KDP 3.175 mm → 9 pt
const doc = await PDFDocument.load(fs.readFileSync(inp));
for (const p of doc.getPages()) {
  const { x, y, width, height } = p.getMediaBox();
  p.setBleedBox(x, y, width, height);
  p.setTrimBox(x + B, y + B, width - 2 * B, height - 2 * B);
  p.setArtBox(x + B, y + B, width - 2 * B, height - 2 * B);
}
fs.writeFileSync(out, await doc.save());
console.log(`kutular yazıldı: ${doc.getPageCount()} sayfa, taşma ${B.toFixed(3)} pt`);
