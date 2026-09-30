#!/usr/bin/env node
// Çok dilli figür kapsama denetimi.
//  1) gen/*.mjs içinde Türkçe karakter ya da Türkçe kelime taşıyan dizgi sabitleri (etiket/veri strings/ dışında kalmış) → hata
//  2) out/en/*.svg ve *.md içinde Türkçe karakter → hata (özel adlar ve Çince Oda glifleri hariç)
// Kullanım: node print/figures/check_i18n.mjs   (çıkış kodu 0 = temiz)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TR_CHARS = /[çğıöşüÇĞİÖŞÜâîûÂÎÛ]/;
// Türkçe karakter içermeyen ama Türkçe olan sık etiketler (küçük harf karşılaştırma)
const TR_WORDS = /\b(ve|veya|ile|kare|durak|adım|harita|girdi|gizli|tahmin|sonuç|kaynak|soru|cevap|baştan|sonraki|bugün|yarın|gün|evet|hayır|yok|var|toplam|ortalama|doğru|yanlış|sahte|gerçek|kelime|resim|görüntü|hata|tur|kademe|insan|makine|senaryo|taraf|hedef|ders|kural|olgu|zincir|taranan|duvar|yol|bulunan|etiket|özellik|küme|merkez|aykırı|eğri|model|nokta|sınır|eğim|kayıp|düşük|yüksek|orta|zayıf|güçlü)\b/i;
const ALLOW_EN = /^(Istanbul|Turkey|TRY|Söz|tr|en|Ç\d|G\d|x\d|Σ|θ|η)$/;
let errors = 0;

function scanGen(file) {
  const src = readFileSync(file, 'utf8').split('\n');
  src.forEach((ln, i) => {
    if (/^\s*\/\//.test(ln)) return; // yorum
    const lits = ln.match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g) || [];
    for (const lit of lits) {
      const body = lit.slice(1, -1);
      if (body.length < 2) continue;
      if (/^[#./\\\-\d\s,%:()×·→←↓↑✓✗○●□▪■▲▼◆◇★☆⚠+*=<>|_\[\]{}&;'"]+$/.test(body)) continue; // sembol/sayı
      if (/^(url\(|#arrow|marker|rgba|http)/.test(body)) continue;
      if (TR_CHARS.test(body) || (TR_WORDS.test(body) && !/\$\{S\./.test(body))) {
        console.log(`${file.split('/').slice(-2).join('/')}:${i + 1}: ${lit.slice(0, 90)}`);
        errors++;
      }
    }
  });
}

const genDir = join(HERE, 'gen');
for (const f of readdirSync(genDir).filter((x) => x.endsWith('.mjs')).sort()) scanGen(join(genDir, f));

const enDir = join(HERE, 'out', 'en');
if (existsSync(enDir)) {
  for (const f of readdirSync(enDir).sort()) {
    const txt = readFileSync(join(enDir, f), 'utf8');
    // Çince Oda glifleri (CJK) ve özel ad listesi hariç
    const stripped = txt.replace(/[一-鿿]/g, '').replace(/Onur Önder|Çince Oda|Türkiye|İstanbul|Gödel|Ünlü/g, '');
    const m = stripped.match(new RegExp(`.{0,30}${TR_CHARS.source}.{0,30}`));
    if (m) { console.log(`out/en/${f}: ${m[0].trim()}`); errors++; }
  }
} else console.log('out/en yok (önce: node print/figures/make.mjs en)');

console.log(errors ? `\n${errors} sorun` : 'temiz');
process.exit(errors ? 1 : 0);
