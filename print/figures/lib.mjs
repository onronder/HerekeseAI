// Basılı figürler için ortak kütüphane: stil sabitleri, etiket sözlüğü, SVG yardımcıları.
// Stil: siyah mürekkep + tek aksan (ember), duotone baskı varsayımı (BASKI.md §6). Birimler pt; metin bloğu genişliği ≤ 320.

// ---------------------------------------------------------------- stil sözlüğü
export const INK = '#1f1f1f', INK2 = '#6c6555', MUTED = '#8a8270', RULE = 'rgba(31,31,31,0.22)';
export const EMBER = '#e85d3a', EMBER_SOFT = '#f6c9bb', PAPER = '#faf7ef';
export const SANS = "'Work Sans', 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'Space Mono', 'Menlo', monospace";
export const SERIF = "'Instrument Serif', Georgia, serif";

export const L = {
  tr: {
    state: 'durum', head: 'kafa', start: 'başlangıç', done: 'bitti', right: 'sağa git', add: 'ekle',
    step: 'adım', frame: 'kare', loss: 'kayıp', low: 'düşük öğrenme oranı', high: 'yüksek öğrenme oranı',
    gradient: 'eğim', newx: 'yeni x', x: 'x', table_title: 'Adım tablosu', day: 'gün', today: 'bugün', tomorrow: 'yarın',
    matrix: 'Geçiş matrisi (%)', min: 'en düşük nokta',
  },
  en: {
    state: 'state', head: 'head', start: 'start', done: 'done', right: 'move right', add: 'add',
    step: 'step', frame: 'frame', loss: 'loss', low: 'low learning rate', high: 'high learning rate',
    gradient: 'slope', newx: 'new x', x: 'x', table_title: 'Step table', day: 'day', today: 'today', tomorrow: 'tomorrow',
    matrix: 'Transition matrix (%)', min: 'minimum',
  },
};

// ---------------------------------------------------------------- dil yardımcıları
// Üreticiler etiketlerini strings/M0N.mjs içinden okur (S = STRINGS[lang]); L yalnız eski çağrılar için kalır.
export const up = (s, lang) => String(s).toLocaleUpperCase(lang === 'en' ? 'en-US' : 'tr-TR');
export const pct = (n, lang) => (lang === 'en' ? `${n}%` : `%${n}`);
export const num = (n, lang) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.');
export const bn = (n, lang) => (lang === 'en' ? `${n} bn` : `${n} mr`);
export const dec = (v, digits, lang) => { const s = Number(v).toFixed(digits); return lang === 'en' ? s : s.replace('.', ','); };

// ---------------------------------------------------------------- svg yardımcıları
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const f1 = (v) => Number(v).toFixed(1);
export const text = (x, y, s, o = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-family="${o.font || SANS}" font-size="${o.size || 9}" fill="${o.fill || INK}"` +
  `${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.weight ? ` font-weight="${o.weight}"` : ''}` +
  `${o.italic ? ' font-style="italic"' : ''}${o.spacing ? ` letter-spacing="${o.spacing}"` : ''}>${esc(s)}</text>`;
export const rect = (x, y, w, h, o = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${o.fill || 'none'}"` +
  `${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 0.8}"` : ''}${o.rx ? ` rx="${o.rx}"` : ''}/>`;
export const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${o.stroke || INK}" stroke-width="${o.sw || 0.8}"` +
  `${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.marker ? ' marker-end="url(#arrow)"' : ''}/>`;
export const circle = (cx, cy, r, o = {}) =>
  `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${o.fill || 'none'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 0.8}"` : ''}/>`;
export const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}pt" height="${h}pt" viewBox="0 0 ${w} ${h}">\n` +
  `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" markerUnits="userSpaceOnUse" orient="auto-start-reverse">` +
  `<path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>\n${body}\n</svg>\n`;
export const caption = (x, y, kicker, o = {}) => text(x, y, kicker, { font: MONO, size: 6.5, fill: MUTED, spacing: 1.2, ...o });

