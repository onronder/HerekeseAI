// Bölüm 1 figür etiketleri ve veri sözlüğü (tr / en). Bkz. strings/README.md.
// TR değerleri gen/M01.mjs içindeki eski sabitlerin birebir aynısı; EN değerleri Atlas-Kitap-EN.dc.html renderVals()
// (intelligence 1766–1778, binary 1779–1789, turing 1790–1808, cycle 1809–1821, classify 1822–1840, exp 2141–2152) ve
// print/src/en/book.json modules[0] karşılıkları; figür-özel etiketler (KARE, AĞIRLIK, ÇÖZÜM…) burada İngilizceleştirildi.
export default {
  tr: {
    turing: {
      frame: (n) => `KARE ${n}`,
      st: { right: 'sağa git', add: 'ekle', done: 'bitti' },
      status: (stLabel, val) => `durum: ${stLabel}  ·  = ${val}`,
      mdTitle: (title) => `# Adım tablosu — ${title}`,
      mdHeader: '| kare | durum | kafa | 0 1 2 3 4 5 | = |',
    },
    intelligence: {
      // book.json'daki seviye etiketi → sembolik anahtar (çubuk yüzdesi gen içinde anahtarla seçilir)
      levelKey: { 'Güçlü': 'strong', 'Orta': 'mid', 'Zayıf': 'weak' },
      ai: (level, pctStr) => `YZ: ${level} · ${pctStr}`,
      mdHeader: '| Zekâ türü | Ne demek | Bugünkü YZ | Çubuk |',
    },
    binary: {
      weight: 'AĞIRLIK',
      opening: (bits) => `AÇILIŞ · ${bits}`,
      rule: 'SAYIYI YAZ · SOLDAN SAĞA "SIĞIYORSA YAK, KALANLA DEVAM ET"',
      mdBox: 'Kutu', mdWeight: 'Ağırlık', mdOpening: 'Açılış',
    },
    cycle: {
      active: (label) => `iş başında: ${label}`,
      loop: 'döngü başa döner',
      mdHeader: '| Evre | İş başındaki parça | Ne yapar |',
    },
    classify: {
      example: 'Örnek',
      mdNote: '> Cevaplar figürde gösterilmez (kitabın sonunda).',
    },
    exp: {
      hdr: ['n', 'Yıl', '2ⁿ', 'Transistör'],
      note: 'tablo 13 katlamada durur; grafikler 26’ya kadar · mr = milyar',
      linear: 'DOĞRUSAL ÖLÇEK', log: 'LOGARİTMİK ÖLÇEK',
      mdFormula: (c0s, y0) => `N(n) = ${c0s} · 2ⁿ, yıl = ${y0} + 2n`,
      mdHeader: '| Katlama (n) | Yıl | 2ⁿ | Transistör |',
      mdNote: '> Figürdeki tablo 13 katlamada (1997) durur; iki mini grafik 26 katlamaya (2023) kadar gider.',
    },
  },
  en: {
    turing: {
      frame: (n) => `FRAME ${n}`,
      st: { right: 'move right', add: 'add', done: 'done' },
      status: (stLabel, val) => `state: ${stLabel}  ·  = ${val}`,
      mdTitle: (title) => `# Step table — ${title}`,
      mdHeader: '| frame | state | head | 0 1 2 3 4 5 | = |',
    },
    intelligence: {
      levelKey: { 'Strong': 'strong', 'Medium': 'mid', 'Weak': 'weak' },
      ai: (level, pctStr) => `AI: ${level} · ${pctStr}`,
      mdHeader: '| Intelligence type | What it means | AI today | Bar |',
    },
    binary: {
      weight: 'PLACE VALUE',
      opening: (bits) => `START · ${bits}`,
      rule: 'WRITE A NUMBER · LEFT TO RIGHT "FITS? LIGHT IT, KEEP THE REST"',
      mdBox: 'Box', mdWeight: 'Place value', mdOpening: 'Start',
    },
    cycle: {
      active: (label) => `active: ${label}`,
      loop: 'the cycle returns to the start',
      mdHeader: '| Phase | Active part | What it does |',
    },
    classify: {
      example: 'Example',
      mdNote: '> Answers are not shown in the figure (they are at the end of the book).',
    },
    exp: {
      hdr: ['n', 'Year', '2ⁿ', 'Transistors'],
      note: 'table stops at 13 doublings; charts go to 26 · bn = billion',
      linear: 'LINEAR SCALE', log: 'LOG SCALE',
      mdFormula: (c0s, y0) => `N(n) = ${c0s} · 2ⁿ, year = ${y0} + 2n`,
      mdHeader: '| Doubling (n) | Year | 2ⁿ | Transistors |',
      mdNote: '> The table in the figure stops at 13 doublings (1997); the two mini charts go up to 26 doublings (2023).',
    },
  },
};
