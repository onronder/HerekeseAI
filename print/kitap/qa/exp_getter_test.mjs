// R064/N007: Şekil 1.6 sayacının görünür çıktısı (expCount getter) bütün durumlarda (d = 0…26) dile uygun mu?
// Kullanım: node print/kitap/qa/exp_getter_test.mjs <Atlas-*.html> <tr|en>  → JSON; çıkış 1 = biçim hatası
import fs from 'node:fs';
const [, , file, lang] = process.argv;
const s = fs.readFileSync(file, 'utf8');
const m = s.match(/out\.expCount = (.*?);\s*(?:\/\/[^\n]*)?\n/);
if (!m) { console.log(JSON.stringify({ file, error: 'expCount bulunamadı' })); process.exit(1); }
const year0 = 1971, count0 = 2300;
const f = new Function('c', `return ${m[1]};`);
const rows = []; let bad = [];
for (let d = 0; d <= 26; d++) {
  const c = count0 * 2 ** d, out = f(c);
  const ok = lang === 'en' ? /^(\d{1,3}(,\d{3})*|\d+\.\d (million|billion))$/.test(out) : /^(\d{1,3}(\.\d{3})*|\d+\.\d (milyon|milyar))$/.test(out);
  rows.push({ d, year: year0 + 2 * d, out }); if (!ok) bad.push({ d, out });
}
console.log(JSON.stringify({ file, lang, states: rows.length, bad, sample: rows.filter((r) => [0, 9, 13, 20, 26].includes(r.d)) }));
process.exit(bad.length ? 1 : 0);
