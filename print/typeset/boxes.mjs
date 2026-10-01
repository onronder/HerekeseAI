// Chrome/Paged.js PDF'ine sayfa kutuları yazar: BleedBox = MediaBox, TrimBox = taşma kadar içeri.
// node boxes.mjs in.pdf out.pdf [bleed_mm=3] [net_genişlik_mm net_yükseklik_mm]
// Net ölçü verilirse (R084) MediaBox tam (net + 2 × taşma) yapılır: Chrome sayfa ölçüsünü yazıcı birimine yuvarladığı için
// (ör. 166 → 166,116 mm) kutular sayfanın sol üst köşesine sabitlenerek kesin değerlere getirilir; içerik sol üstten dizildiği için
// fark yalnız sağ/alt taşma bandını etkiler (beyaz ya da zemin rengi). Ghostscript pdfwrite giriş PDF'indeki kutuları korur.
import fs from 'node:fs';
import { PDFDocument, PDFName } from 'pdf-lib';
const [, , inp, out, bleedMm, wMm, hMm] = process.argv;
const PT = 72 / 25.4;
const B = Number(bleedMm || 3) * PT; // 3 mm → 8.5039 pt; KDP 3.175 mm → 9 pt
const doc = await PDFDocument.load(fs.readFileSync(inp));
let note = '';
for (const p of doc.getPages()) {
  let { x, y, width, height } = p.getMediaBox();
  if (wMm && hMm) {
    const W = Number(wMm) * PT + 2 * B, H = Number(hMm) * PT + 2 * B, top = y + height;
    note = ` · MediaBox ${(width / PT).toFixed(3)}×${(height / PT).toFixed(3)} → ${(W / PT).toFixed(3)}×${(H / PT).toFixed(3)} mm (sol üst sabit)`;
    x = x; y = top - H; width = W; height = H;
    p.setMediaBox(x, y, width, height); p.setCropBox(x, y, width, height);
  }
  p.setBleedBox(x, y, width, height);
  p.setTrimBox(x + B, y + B, width - 2 * B, height - 2 * B);
  p.setArtBox(x + B, y + B, width - 2 * B, height - 2 * B);
}
// Dizgi ölçüm sayaçları (hooks.js → Keywords) yalnız ara PDF'te kalır; teslim dosyasının meta verisine taşınmaz.
try { const info = doc.context.lookup(doc.context.trailerInfo.Info); if (info && info.delete) info.delete(PDFName.of('Keywords')); } catch {}
fs.writeFileSync(out, await doc.save());
console.log(`kutular yazıldı: ${doc.getPageCount()} sayfa, taşma ${B.toFixed(3)} pt${note}`);
