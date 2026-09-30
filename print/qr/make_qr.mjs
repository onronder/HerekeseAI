#!/usr/bin/env node
// 45 şekil için canlı demo QR kodları (SVG) — tek süreçte, `qrcode` npm paketiyle.
// Kullanım: cd print/qr && npm i (bir kez) && node make_qr.mjs [tr|en]
// Hedef: https://book.onuronder.com/d/<slug> (EN: /d/en/<slug>), slug'lar ../../qr-slugs.json (build.py üretir). Hata düzeltme M, kenar boşluğu 0.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const QRCode = require('qrcode');
const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = dirname(HERE);
const lang = process.argv[2] === 'en' ? 'en' : 'tr';
const book = JSON.parse(readFileSync(join(ROOT, 'src', lang, 'book.json'), 'utf8'));
const slugs = JSON.parse(readFileSync(join(dirname(ROOT), 'qr-slugs.json'), 'utf8'))[lang];
const base = lang === 'tr' ? 'https://book.onuronder.com/d/' : 'https://book.onuronder.com/d/en/';
const out = join(ROOT, 'figures', 'out', lang); mkdirSync(out, { recursive: true });
let n = 0;
for (const mod of book.modules) {
  const m = Number(mod.n); let fig = 0;
  for (let si = 0; si < mod.sections.length; si++) {
    const sec = mod.sections[si];
    if (!sec.demo) continue; fig += 1;
    const slug = slugs[`${m}.${fig}`]; if (!slug) throw new Error(`slug yok: ${m}.${fig}`);
    const svg = await QRCode.toString(`${base}${slug}`, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, width: 160 });
    writeFileSync(join(out, `qr-${m}-${fig}.svg`), svg); n++;
  }
}
console.log(`[${lang}] ${n} QR üretildi → figures/out/${lang}/qr-N-j.svg`);
