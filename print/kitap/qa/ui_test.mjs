// Gerçek tarayıcı (headless Chrome) UI testi — dist/web/index.html (TR) ve en.html (EN). Düğmelere tıklanır, görünür metin okunur;
// beklenen sonuçlar demonun kendi veri dizilerinden bağımsız hesaplanır. Kapsam: R002, R012, R043, R055 (4 vaka × 3 yol), R056,
// R060, R062, R064 (27 durum). Çıktı: print/kitap/qa/ui-test.json; çıkış 1 = başarısız test var.
// Kullanım: node print/kitap/qa/ui_test.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', '..');
const { default: puppeteer } = await import(path.join(ROOT, 'print/typeset/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'));
const browser = await puppeteer.launch({ headless: 'new', executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage(); await page.setViewport({ width: 1400, height: 1000 });
const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
const R = []; const T = (id, lang, test, ok, obs) => { R.push({ id, lang, test, ok: !!ok, obs }); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FILE = { tr: 'dist/web/index.html', en: 'dist/web/en.html' };
async function open(lang, m, s) {
  await page.goto(`file://${ROOT}/${FILE[lang]}?t=${Date.now()}#m=${m}&s=${s}`, { waitUntil: 'load' }); await sleep(900);
}
const text = () => page.evaluate(() => document.body.innerText);
async function click(label, exact = true) {
  const ok = await page.evaluate((label, exact) => {
    const els = [...document.querySelectorAll('button, [onclick], div, span')].filter((e) => e.children.length === 0 && getComputedStyle(e).cursor === 'pointer');
    const el = els.find((e) => exact ? e.innerText.trim() === label : e.innerText.trim().includes(label));
    if (el) { el.click(); return true; } return false;
  }, label, exact);
  await sleep(160); return ok;
}
async function findSection(lang, m, marker) {
  for (let s = 0; s < 10; s++) { await open(lang, m, s); if ((await text()).includes(marker)) return s; }
  return -1;
}
const src = { tr: fs.readFileSync(path.join(ROOT, 'Atlas-Kitap.dc.html'), 'utf8'), en: fs.readFileSync(path.join(ROOT, 'Atlas-Kitap-EN.dc.html'), 'utf8') };
for (const lang of ['tr', 'en']) {
  const L = lang === 'tr';
  // R002 — zekâ çubuğu uyarısı iki modda
  const cap = L ? 'Çubuk temsili düzeydir; ölçülmüş başarı değildir.' : 'The bar is an illustrative level, not a measured score.';
  await open(lang, 1, 1);
  const basic = (await text()).includes(cap); await click(L ? 'Teknik' : 'Technical'); const tech = (await text()).includes(cap);
  T('R002', lang, 'zekâ çubuğu uyarısı Basit ve Teknik modda görünür', basic && tech, { basit: basic, teknik: tech });
  // R012 — zincir etiketleri
  await open(lang, 2, 1); const t12 = await text();
  const inst = L ? 'örneği ▸' : 'instance of ▸', sub = L ? 'alt sınıfı ▸' : 'subclass of ▸';
  T('R012', lang, 'ilk bağ "örneği", sonraki üç bağ "alt sınıfı"', t12.split(inst).length - 1 === 1 && t12.split(sub).length - 1 === 3, { ornegi: t12.split(inst).length - 1, alt: t12.split(sub).length - 1 });
  // R064/N007 — üstel büyüme sayacı 27 durum, görünür çıktı
  const sExp = await findSection(lang, 1, L ? '+2 yıl → ikiye katla' : '+2 years → double');
  const outs = []; const rx = L ? /^(\d{1,3}(\.\d{3})*|\d+\.\d (milyon|milyar))$/ : /^(\d{1,3}(,\d{3})*|\d+\.\d (million|billion))$/;
  const readExp = () => page.evaluate((L) => { const t = document.body.innerText; const m = t.match(L ? /\n([^\n]+)\n\s*transistör · (\d+) kez ikiye katlandı/ : /\n([^\n]+)\n\s*transistors · (\d+) doublings/); return m ? [m[2], m[1].trim()] : null; }, L);
  outs.push(await readExp());
  for (let i = 0; i < 26; i++) { await click(L ? '+2 yıl → ikiye katla' : '+2 years → double'); outs.push(await readExp()); }
  const bad = outs.filter((o) => !o || !rx.test(o[1]));
  T('R064', lang, 'sayaç 27 durumda dile uygun biçim (tıklayarak)', sExp >= 0 && outs.length === 27 && !bad.length, { ornek: [outs[0], outs[9], outs[13], outs[20], outs[26]], hatali: bad.slice(0, 3) });
  // R043 — bağlam penceresi durum satırı
  const sCtx = await findSection(lang, 5, L ? 'Kelime ekle' : 'Add word');
  for (let i = 0; i < 9; i++) await click(L ? 'Kelime ekle' : 'Add word', false);
  const t43 = await text();
  T('R043', lang, '9. kelimede durum satırı gösterime özgü ve hata/kırpma/özetleme seçeneklerini ayırıyor', sCtx >= 0 && (L ? t43.includes('Bu gösterimde model yalnızca son 8 kelimeyi görüyor; gerçek uygulamalar sınıra gelince hata verebilir') : t43.includes('In this illustration the model sees only the last 8 words; real applications may raise an error')), { bolum: sCtx });
  // R055 — deepfake: 4 vaka × 3 yol; beklenen sonuç veri dizisinden
  const axes = JSON.parse(src[lang].match(/const axes = (\[.*?\]);\n/s)[1]); const cases = JSON.parse(src[lang].match(/const cases = (\[.*?\]);\n/s)[1]);
  const sDf = await findSection(lang, 7, L ? 'eşleşen: olay' : 'matched: event');
  let dfOk = true; const dfObs = [];
  for (let p = 0; p < 3; p++) {
    await open(lang, 7, sDf); let exp = { e: 0, o: 0, c: 0 };
    for (let ci = 0; ci < cases.length; ci++) {
      const c = cases[ci];
      const want = [c.e.includes(axes[0].opts[p][0]), c.o.includes(axes[1].opts[p][0]), !!c.ch[p][1]];
      await click(axes[0].opts[p][1]); await click(axes[1].opts[p][1]); await click(c.ch[p][0]);
      const t = await text();
      const got = axes.map((ax) => t.includes('✓ ' + ax.head + ':') ? true : t.includes('○ ' + ax.head + ':') ? false : null);
      exp = { e: exp.e + want[0], o: exp.o + want[1], c: exp.c + want[2] };
      const cnt = t.match(L ? /eşleşen: olay (\d+) · köken (\d+) · kanal (\d+)/ : /matched: event (\d+) · origin (\d+) · channel (\d+)/);
      const okCase = JSON.stringify(got) === JSON.stringify(want) && cnt && +cnt[1] === exp.e && +cnt[2] === exp.o && +cnt[3] === exp.c;
      dfOk = dfOk && okCase; dfObs.push({ yol: p + 1, vaka: ci + 1, beklenen: want, gorulen: got, sayac: cnt && cnt.slice(1).join('/') });
      if (ci < cases.length - 1) await click(L ? 'Sonraki →' : 'Next →');
    }
  }
  T('R055', lang, '4 vaka × 3 cevap yolu: olay/köken/kanal ayrı puanlanıyor, sayaç beklenene eşit', sDf >= 0 && dfOk && dfObs.length === 12, dfObs.filter((o) => JSON.stringify(o.beklenen) !== JSON.stringify(o.gorulen)).slice(0, 3).concat([{ yol_sayisi: dfObs.length }]));
  // R056 — risk kartı 1: koşullu etiket, doğru kademe ve gerekçe
  const sReg = await findSection(lang, 7, L ? 'Her kullanımı bir risk düzeyine yerleştir' : 'Place each use');
  const t56a = await text(); const lab = L ? 'Sosyal davranış puanıyla ilgisiz alanlarda orantısız yaptırım uygulayan devlet sistemi' : 'A state social-behavior score that triggers disproportionate penalties in unrelated areas';
  await click(L ? 'Yasak' : 'Banned'); const t56 = await text();
  T('R056', lang, 'kart 1 koşullu etiket; "Yasak" doğru; gerekçe 5(1)(c) ve kamuya özgü olmama', sReg >= 0 && t56a.includes(lab) && t56.includes('5(1)(c)') && (L ? t56.includes('yalnız kamuya özgü değildir') : t56.includes('not limited to public authorities')) && t56.includes('✓'), { bolum: sReg });
  // R060 — Turing yazışmaları kurgusal; cevap kesin köken tanısı vermiyor
  const sTur = await findSection(lang, 8, L ? 'kurgusal örnek' : 'fictional example');
  await click(L ? 'İnsan' : 'Human', false); const t60 = await text();
  T('R060', lang, 'kurgu etiketi görünür; cevap sonrası geri bildirim geliyor', sTur >= 0 && (L ? /kurgu/i.test(t60) : /fiction/i.test(t60)) && t60.includes('💡'), { bolum: sTur });
  // R062 — sorumluluk: çoklu seçim ve değerlendirme
  const sResp = await findSection(lang, 8, L ? 'Birden çok taraf seçebilirsin' : 'You can pick more than one party');
  const blk = src[lang].slice(src[lang].indexOf('out.d_resp = true;'), src[lang].indexOf("if (sec.quiz)", src[lang].indexOf('out.d_resp = true;')));
  const scen = [...blk.matchAll(/\{ scenario: '((?:[^'\\]|\\.)*)', primary: \[([^\]]*)\], shared: \[([^\]]*)\] \}/g)].map((m) => ({ label: m[1].replace(/\\u2019/g, '’').replace(/\\'/g, "'"), primary: m[2].match(/\w+/g), shared: m[3].match(/\w+/g) }));
  const pl = Object.fromEntries([...blk.matchAll(/\{ k: '(\w+)', label: '([^']+)' \}/g)].map((m) => [m[1], m[2]]));
  const r62 = [];
  for (const sc of scen) {
    await open(lang, 8, sResp); await click(sc.label);
    for (const k of [...sc.primary, ...sc.shared]) await click(pl[k]);
    await click(L ? 'Değerlendir →' : 'Evaluate →'); const tA = await text();
    const okA = tA.includes('✓ ') && sc.shared.every((k) => tA.includes(pl[k]));
    await open(lang, 8, sResp); await click(sc.label); await click(pl.ai); await click(L ? 'Değerlendir →' : 'Evaluate →'); const tB = await text();
    const okB = tB.includes('○ ') && (L ? /hâkim görüş değil|hakim görüş değil/.test(tB) : tB.includes('not the prevailing view'));
    r62.push({ senaryo: sc.label.slice(0, 30), coklu_secim_dogru: okA, yalniz_YZ_uyari: okB });
  }
  T('R062', lang, '3 senaryo: çoklu seçimle ilk incelenecek + ortak sorumluluk; "YZ\'nin kendisi" seçimi uyarı veriyor', sResp >= 0 && scen.length === 3 && r62.every((r) => r.coklu_secim_dogru && r.yalniz_YZ_uyari), r62);
}
// N007 — EN arayüzünde Türkçe kalıntı: 8 modül × tüm bölümler × Basit + Teknik mod görünür metin (özel adlar hariç)
{
  const TRCH = /[çğıöşüÇĞİÖŞÜ]/; const TRW = /(?<![\w’'])(ve|bir|için|ile|değil|olarak|Kendini|Bölüm|Şekil|Sonraki|Önceki|Değerlendir|Sıfırla|Teknik|Basit)(?![\w’'])/;
  const OK = ['Önder', 'Gödel', 'Türkiye', 'Türk', 'KVKK', 'Herkes İçin Yapay Zekâ', 'Zekâ', 'TÜRKİYE'];
  const hits = []; let views = 0;
  for (let m = 1; m <= 8; m++) {
    const seen = new Set();
    for (let s = 0; s < 14; s++) {
      await open('en', m, s);
      const h2 = await page.evaluate(() => (document.querySelector('h2') || {}).innerText || '');
      if (!h2 || seen.has(h2)) break; seen.add(h2);
      for (const mode of ['basic', 'technical']) {
        if (mode === 'technical' && !(await click('Technical'))) continue;
        views++;
        const lines = (await text()).split('\n').map((l) => l.trim()).filter(Boolean);
        for (const l of lines) { let c = l; for (const w of OK) c = c.split(w).join(''); if (TRCH.test(c) || TRW.test(c)) hits.push({ m, s, mode, l: l.slice(0, 90) }); }
      }
    }
  }
  T('N007', 'en', `EN 8 modül, tüm bölümler × Basit + Teknik (${views} görünüm): Türkçe karakter/sözcük 0 (özel adlar hariç)`, views >= 122 && hits.length === 0, { gorunum: views, bulgu: hits.slice(0, 30) });
}
T('genel', 'tr+en', 'sayfa JavaScript hatası yok', errors.length === 0, errors.slice(0, 5));
await browser.close();
const out = { tarih: new Date().toISOString(), tarayici: 'Google Chrome (headless, puppeteer-core)', gecen: R.filter((r) => r.ok).length, toplam: R.length, testler: R };
fs.writeFileSync(path.join(ROOT, 'print/kitap/qa/ui-test.json'), JSON.stringify(out, null, 1));
for (const r of R) console.log((r.ok ? '✔' : '✘'), r.id, r.lang, r.test, r.ok ? '' : JSON.stringify(r.obs).slice(0, 300));
console.log(`${out.gecen}/${out.toplam} UI testi geçti`);
process.exit(out.gecen === out.toplam ? 0 : 1);
