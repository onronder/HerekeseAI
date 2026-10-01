// Üst düzey blok öğelerinin gerçek yüksekliklerini (mm, kenar boşlukları dahil) ölçer: dizgi öncesi akış ölçümü.
//   node measure.mjs out/ic-blok.html 124 out/heights.json
// gapplan.py bu ölçümlerle sığmayan şekil bloklarını ne kadar erteleyeceğini hesaplar.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const [html, wmm, outJson] = process.argv.slice(2);
const exe = process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.goto('file://' + path.resolve(html), { waitUntil: 'networkidle0' });
await page.addStyleTag({ content: `html,body{margin:0;padding:0} body{width:${wmm}mm} section{display:block}` });
await page.evaluate(() => document.fonts.ready);
const data = await page.evaluate(() => {
  const mm = px => px * 25.4 / 96;
  return [...document.querySelectorAll('section > *')].map(e => {
    const cs = getComputedStyle(e);
    return {
      t: e.tagName.toLowerCase(),
      k: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      h: mm(e.getBoundingClientRect().height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom)),
    };
  });
});
await browser.close();
fs.writeFileSync(outJson, JSON.stringify(data));
console.log(`ölçüm: ${data.length} öğe → ${outJson}`);
