#!/usr/bin/env node
// Basılı sürüm figür üreticisi — BASKI.md §6 (P2).
//
// print/src/<dil>/book.json içindeki demo verisinden deterministik SVG figürler üretir.
// Üreticiler bölüm başına dosyalarda: print/figures/gen/M0x.mjs, her biri `export const FIGURES = { <demo type>: fn }`.
// fn(demo, { t, mod, sec, lang, book }) → [{ name, svg, md? }]. Ortak yardımcılar: print/figures/lib.mjs; etiketler strings/M0N.mjs.
//
// Kullanım:  node print/figures/make.mjs [tr|en] [demo-type]   →  print/figures/out/<dil>/sekil-N-j-<type>.svg (+ .md)

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { L } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');

async function loadGenerators() {
  const reg = {};
  for (const f of readdirSync(join(HERE, 'gen')).filter((x) => x.endsWith('.mjs')).sort()) {
    const m = await import(pathToFileURL(join(HERE, 'gen', f)).href);
    for (const [k, v] of Object.entries(m.FIGURES || {})) {
      if (reg[k] && reg[k] !== v) console.warn(`uyarı: '${k}' üreticisi ${f} içinde yeniden tanımlandı`);
      reg[k] = v;
    }
  }
  return reg;
}

async function run(lang, only) {
  const FIGURES = await loadGenerators();
  const book = JSON.parse(readFileSync(join(ROOT, 'print', 'src', lang, 'book.json'), 'utf8'));
  const out = join(HERE, 'out', lang);
  mkdirSync(out, { recursive: true });
  const t = L[lang], made = [], skipped = [], failed = [];
  book.modules.forEach((mod) => {
    let fig = 0;
    mod.sections.forEach((sec) => {
      const demo = sec.demo; if (!demo) return; fig += 1;
      if (only && demo.type !== only) return;
      const gen = FIGURES[demo.type];
      const id = `${lang === 'en' ? 'figure' : 'sekil'}-${Number(mod.n)}-${fig}`;
      if (!gen) { skipped.push(`${id} ${demo.type}`); return; }
      try {
        for (const f of gen(demo, { t, mod, sec, lang, book })) {
          writeFileSync(join(out, `${id}-${f.name}.svg`), f.svg);
          if (f.md) writeFileSync(join(out, `${id}-${f.name}.md`), f.md);
          made.push(`${id}-${f.name}`);
        }
      } catch (e) { failed.push(`${id} ${demo.type}: ${e.message}`); }
    });
  });
  console.log(`[${lang}] üretildi (${made.length}): ${made.join(', ')}`);
  if (skipped.length) console.log(`[${lang}] üretici yok (${skipped.length}): ${skipped.map((s) => s.split(' ')[1]).join(', ')}`);
  if (failed.length) console.log(`[${lang}] HATA (${failed.length}):\n  ` + failed.join('\n  '));
}

const args = process.argv.slice(2);
const langs = args[0] && ['tr', 'en'].includes(args[0]) ? [args[0]] : ['tr', 'en'];
const only = args.find((a) => !['tr', 'en'].includes(a));
for (const lang of langs) await run(lang, only);
