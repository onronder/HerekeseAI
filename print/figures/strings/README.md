# Figür etiket ve veri sözlükleri (iki dil)

Her bölüm için bir dosya: `M0N.mjs` → `export default { tr: {...}, en: {...} }`.
Üretici (`gen/M0N.mjs`) dosyayı içe aktarır ve `const S = STRINGS[lang]` ile okur. Kurallar:

- **Tüm** görünen metin (SVG etiketleri, lejantlar, eksen adları, altyazılar, `.md` tablo başlıkları) ve **tüm** veri dizileri
  (kelimeler, cümleler, vaka metinleri, kategori adları, senaryolar) buradan gelir. `gen/` içinde insanın okuyacağı hiçbir dizgi sabiti kalmaz.
- TR değerleri mevcut üreticideki metinlerin birebir aynısıdır (TR çıktısı bayt bayt değişmemeli).
- EN değerleri `Atlas-Kitap-EN.dc.html` `renderVals()` içindeki karşılıklardan alınır (uydurma çeviri yok); orada olmayan
  figür-özel etiketler (ör. "KARE", "durak", "taranan") burada İngilizceleştirilir.
- Anahtarlar demo tipi altında gruplanır: `S.turing.frame`, `S.grid.explored`… Ortak anahtarlar `S.common.*`.
- Yer tutucu için şablon fonksiyon: `frame: (n) => \`KARE ${n}\`` / `(n) => \`FRAME ${n}\``.
- Sayı biçimi için `lib.mjs`: `pct(n, lang)` (%40 / 40%), `num(n, lang)` (binlik ayracı), `bn(n, lang)` (mr / bn), `dec(v, d, lang)`, `up(s, lang)`.
- Mantık asla görünen metne bağlanmaz: `'Güçlü'`, `'yüksek'` gibi karşılaştırmalar sembolik anahtarla (`level: 'strong'|'mid'|'weak'`, `tier: 'high'|'mid'|'low'`) yapılır; sözlük bu anahtardan etikete gider.
