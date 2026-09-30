# Figür kılavuzu (basılı sürüm)

Her demo → `print/figures/gen/M0N.mjs` içinde `FIGURES[<demo type>] = (demo, ctx) => [{ name, svg, md? }]`.
`ctx = { t, mod, sec, lang }`; `demo` = book.json'daki demo nesnesi (type, title, hint, neOluyor…, veri alanları).
Ortak yardımcılar `../lib.mjs`: INK, INK2, MUTED, RULE, EMBER, EMBER_SOFT, PAPER, SANS, MONO, SERIF, esc, f1, text, rect, line, circle, svg, caption.
Mevcut örnekler: `gen/M01.mjs` (turing film şeridi), `gen/M02.mjs` (markov diyagram+matris), `gen/M03.mjs` (descent iki panel).

## Sadakat
- Figür, demonun ekranda gösterdiği şeyin kâğıt hâlidir: aynı veri, aynı düzen mantığı, aynı etiketler. Veri `book.json`'da yoksa
  `Atlas-Kitap.dc.html` `renderVals()` dalından alınır (kod okunur, sayılar aynen hesaplanır; gerekirse algoritma JS'te yeniden çalıştırılır).
- Animasyon/adımlı demolar **film şeridi**: seçilmiş kareler (başlangıç, ara, son), her kare "KARE n" etiketi ve durum yazısı. Kare sayısı,
  bölüm metnindeki *Kurulum* ve *Adım adım* ile uyuşmalı (`print/src/tr/M0N-*.md`); metin "dokuz kare" diyorsa dokuz kare.
- Seçim demoları: tüm seçenekler tek figürde (tablo/panel ızgarası) ya da 2–3 örnek durum yan yana.
- Sınama demoları (classify, df, reg, tur, responsibility): figür soruyu gösterir, cevabı GÖSTERMEZ (cevaplar kitabın sonunda).

## Stil (duotone baskı)
- Zemin PAPER, çizgi INK 0.7–1pt, vurgu yalnız EMBER / EMBER_SOFT. Başka renk yok (ekrandaki mavi/mor/yeşil → INK tonları + EMBER).
- Etiketler MONO 6–7pt (büyük harf + letter-spacing için `caption()`), gövde metni SANS 7–9pt, başlık gerekmiyor (bölüm metni veriyor).
- Genişlik ≤ 320pt (metin bloğu); yükseklik serbest ama ≤ 420pt. Çok panelli figürlerde paneller arası 8–12pt boşluk.
- Ok uçları `marker-end="url(#arrow)"` (lib'de tanımlı, sabit boyut). Kesikli çizgi için `dash`.
- Etiketler ve veri dizileri iki dilde `strings/M0N.mjs` içinden gelir (`const S = STRINGS[lang]`); `gen/` içinde görünen metin sabiti kalmaz (`node print/figures/check_i18n.mjs` → temiz). Ekran fiili yok ("tıkla", "sürükle" yok). Bkz. `strings/README.md`.
- Her figür `md` alanında (isteğe bağlı) veri tablosunu Markdown olarak döndürür; yazar metinle karşılaştırır.

## Doğrulama
```
node print/figures/make.mjs tr <type>            # yalnız o demoyu üretir (en için: make.mjs en <type> → out/en/figure-N-j-<type>.svg)
node print/figures/check_i18n.mjs                # gen/ içinde Türkçe sabit ve out/en'de Türkçe karakter taraması
print/figures/render.sh print/figures/out/tr/sekil-N-j-<type>.svg /tmp/x.png   # PNG'ye çevir, Read ile bak
```
Her figür PNG olarak görülüp düzeltilir: çakışan etiket, taşan metin, okunmayan küçük yazı kabul edilmez.
