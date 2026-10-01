#!/usr/bin/env node
// Figür punto denetimi (R082): her SVG'deki en küçük <text> font boyutunu baskı puntosuna çevirir ve < 6 pt olanları işaretler.
// Baskıda SVG 124 mm genişlikte basılır: pt = font_size × (124 / W_vb) × (72 / 25.4)  (W_vb = viewBox genişliği; 320 → ×1.098).
// Hedef: okunacak sayı/etiketler ≥ 6.5 pt (SVG'de ≥ 5.92); eşik: < 6 pt (SVG'de < 5.46) → işaret.
// Kullanım: node print/figures/check_fig_fonts.mjs [tr|en|all] [--min 6] [--target 6.5]   (çıkış kodu 1 = işaretli figür var)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PRINT_MM = 124;
const args = process.argv.slice(2);
const langArg = args.find((a) => ['tr', 'en', 'all'].includes(a)) || 'all';
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? Number(args[i + 1]) : d; };
const MIN = opt('--min', 6), TARGET = opt('--target', 6.5);
const langs = langArg === 'all' ? ['tr', 'en'] : [langArg];
let flagged = 0, total = 0;

for (const lang of langs) {
  const dir = join(HERE, 'out', lang);
  if (!existsSync(dir)) { console.log(`out/${lang} yok (önce: node print/figures/make.mjs ${lang})`); continue; }
  const files = readdirSync(dir).filter((f) => f.endsWith('.svg') && !f.startsWith('qr-')).sort();
  console.log(`[${lang}] ${files.length} figür · eşik ${MIN} pt · hedef ${TARGET} pt`);
  for (const f of files) {
    const svg = readFileSync(join(dir, f), 'utf8');
    const vb = svg.match(/viewBox="0 0 ([0-9.]+) [0-9.]+"/);
    const W = vb ? Number(vb[1]) : 320;
    const k = (PRINT_MM / W) * (72 / 25.4);
    const sizes = [...svg.matchAll(/<text[^>]*font-size="([0-9.]+)"/g)].map((m) => Number(m[1]));
    if (!sizes.length) { console.log(`  ${f}: <text> yok`); continue; }
    const minSvg = Math.min(...sizes), minPt = minSvg * k;
    const below = sizes.filter((s) => s * k < MIN).length, under = sizes.filter((s) => s * k < TARGET).length;
    const mark = minPt < MIN ? '✗' : minPt < TARGET ? '△' : '✓';
    total++; if (minPt < MIN) flagged++;
    console.log(`  ${mark} ${f.padEnd(34)} en küçük ${minSvg} → ${minPt.toFixed(2)} pt` +
      (below ? ` · ${below} metin < ${MIN} pt` : '') + (under && !below ? ` · ${under} metin < ${TARGET} pt hedefi` : ''));
  }
}
console.log(flagged ? `\n${flagged}/${total} figürde ${MIN} pt altı metin var` : `\ntemiz: tüm figürlerde en küçük metin ≥ ${MIN} pt`);
process.exit(flagged ? 1 : 0);
