# print/ — basılı sürüm çalışma alanı

Analiz ve yol haritası: [BASKI.md](../BASKI.md). Kaynak kitap `Atlas-Kitap.dc.html` / `Atlas-Kitap-EN.dc.html` tek gerçek olmaya devam eder; buradaki her şey ondan türetilir ya da onun üstüne yazarın eklediği metindir.

## Akış

```
python3 print/export.py            # P1: modules() → print/src/{tr,en}/  (M0x-*.md, book.json, cevap anahtarı, gömülü metinler)
node print/figures/make.mjs        # P2: book.json → print/figures/out/{tr,en}/*.svg (+ adım tabloları .md)
```

- `src/<dil>/M0x-*.md` — yazarın genişleteceği bölüm dosyaları. `[YAZILACAK]` işaretli yerler: Kurulum, Adım adım, Kendin dene, geçiş cümlesi, bölüm sonu özeti. **export tekrar çalıştırılınca bu dosyalar korunur**; `--force` verilirse silinip yeniden üretilir.
- `src/<dil>/book.json` — figür üreticisinin okuduğu ham veri; her çalıştırmada yenilenir.
- `src/<dil>/cevap-anahtari.md` (`answer-key.md`) — quiz seçenekleri ekrandaki `_order()` ile aynı deterministik sırayla karıştırılır; doğru şık harf olarak verilir. `df`, `reg`, `tur`, `responsibility` demolarının cevapları koda gömülü olduğundan elle yazılır.
- `src/<dil>/demo-gomulu-metinler.md` (`demo-embedded-texts.md`) — `renderVals()` içinde, yalnız etkileşimden sonra görünen öğretici metinler (TR 155 parça). Basılı sürümde bunlar "Adım adım" ve tablolara taşınır.
- `figures/make.mjs` — deterministik SVG üretici; 45 demonun tamamı için üretici var (`figures/gen/M0x.mjs`, ortak yardımcılar `figures/lib.mjs`, kurallar `figures/FIGUR-KILAVUZU.md`). Etiket ve veri dizileri iki dilde `figures/strings/M0x.mjs`; `node figures/check_i18n.mjs` kapsama denetimi (temiz). `figures/render.sh` SVG'yi PNG'ye çevirir (headless Chrome). Çıktı: `out/tr/sekil-N-j-<type>.svg`, `out/en/figure-N-j-<type>.svg`; `out/tr-baseline/` regresyon tabanı (TR çıktısı bayt bayt aynı kalmalı). Stil: siyah mürekkep + ember aksan (duotone), Space Mono etiket, Work Sans gövde.
- `figures/out/` — üretilen çıktı; git'e girmez.

## Bilinen boşluklar

- QR hedefi: giriş istemeyen tek-demo sayfaları `https://book.onuronder.com/d/<slug>` (EN `/d/en/<slug>`); slug'lar kökteki `qr-slugs.json` (build.py üretir, `store/d/` altına 45+45 sayfa yazar). QR üretimi: `cd print/qr && npm i && node make_qr.mjs tr` → `figures/out/tr/qr-N-j.svg`; `assemble.py` her `Canlı demo: [QR N.j]` satırına görseli yerleştirir.
- Gradyan inişi demosunda "yüksek" η = 0.92 aşım yapmıyor; figür η = 4.6 kullanır (bkz. BASKI.md §8).
- Dizin: `src/tr/arka/dizin-terimler.yaml` (terim → takma adlar) → `assemble.py build_index()` terim → alt bölüm; dizgide sayfa numarasına döner (h3 id'leri `sec-N-k`). Künye: `src/tr/on/00-kunye.md` (ISBN, matbaa, tarih yazar); Teşekkür: `01-tesekkur.md` (isim yuvaları yazar).

## El yazması (P3)

```
python3 print/assemble.py          # print/kitap/Herkes-Icin-Yapay-Zeka-TR.md + .html
```
- Bölüm dosyaları `src/tr/M0x-*.md` artık nihai biçimde (bkz. `YAZIM-KILAVUZU.md`); redaksiyon bu dosyalarda yapılır, sonra assemble tekrar çalıştırılır. **`export.py --force` çalıştırılmaz** (bölüm dosyalarını iskelete döndürür).
- Her bölüm dosyasının sonundaki `<!-- REDAKSİYON NOTLARI -->` bloğu, yazarın karar vereceği uyarlamaları listeler; kitaba girmez.
- Ön bölümler `src/tr/on/`, arka bölümler `src/tr/arka/` (sözlük, kaynakça); cevap anahtarı ve canlı demo listesi otomatik.
- HTML tarayıcıda açılıp "Yazdır → PDF" ile hızlı prova alınabilir; baskıya hazır PDF için aşağıdaki dizgi hattı kullanılır.

## Dizgi ve baskı (P4)

```
sh print/typeset/dizgi.sh      # el yazması HTML → Paged.js → PDF/X-1a  →  print/kitap/ic-blok.pdf
sh print/kapak/kapak.sh        # print/kapak/kapak.json → kapak yayılımı  →  print/kitap/kapak.pdf
sh print/typeset/check.sh      # baskı öncesi denetim (sayfa sayısı, kutular, fontlar, renk, PDF/X, 45 QR okuma)
```
Gereksinimler: Chrome (yerel), Node (`print/typeset` ve `print/kapak` altında `npm i`), Homebrew `ghostscript` ve `poppler`.

- `typeset/typeset.py`: `assemble.py` çıktısını dizgiye hazırlar: yerel `@font-face` (`store/assets/fonts*`), 45 figür + 45 QR SVG'si **inline**
  (img içinde belge fontları yüklenmez), saydamlık düzleştirme (rgba/opacity/#rrggbbaa → PDF/X'te saydamlık yok; aksi hâlde Ghostscript
  sayfayı rasterleştirir), Unicode alt/üst simge → tspan, SVG metin siyahı → %100 K, emoji düşürme, bölüm `<section>`'ları, koşan başlık
  dizgisi, İçindekiler ve Dizin bağlantıları (`target-counter` ile sayfa numarası), `--pad N` Notlar sayfaları.
- `typeset/print.css`: `@page` 160×240 mm + 3 mm taşma, iç 20 / dış 16 mm, sayfa numarası alt orta, koşan başlıklar (sol: kitap adı,
  sağ: bölüm), bölüm açılışı sağ sayfa + ayrı açılış sayfası, ön bölümde numara yok (ama sayılır: Paged.js sol/sağ kararı sayaçtan),
  kutu/figür/tablo bölünmez, dul/yetim 2. Justify yalnız `p, li` üzerinde (body'de kalıtımla verilince Paged.js son satırları da yayıyor).
- `typeset/dizgi.sh`: pagedjs-cli (yerel Chrome) → `boxes.mjs` (pdf-lib: BleedBox = kâğıt, TrimBox 3 mm içeri) → Ghostscript
  `-dPDFX` + CMYK (`-dUseFastColor`: siyah → yalnız K) + `PDFX_def.ps` (OutputIntent; `ICC=` ile matbaa profili) → 16'nın katına otomatik
  tamamlama (Notlar sayfaları). Bağlantı ek açıklamaları (`-dPreserveAnnots=false`) PDF/X'e uymaz, düşürülür.
- **Sayfa yerleşimi (2026-09-30, "yüzen şekil" öykünmesi):** `dizgi.sh` ilk dizgiden sonra `measure.mjs` (puppeteer; üst düzey öğe yükseklikleri) +
  `gapplan.py` (30 dpi render → sayfa sonu boşlukları) ile bir plan üretir (`out/defer.json`) ve yeniden dizer (en çok 24 tur, değişmeyince durur):
  sığmayan şekil bloğu (başlık + figür + altındaki QR satırı) ya %20'ye kadar küçültülür ya da boşluğu dolduracak kadar izleyen öğenin
  (Kurulum, Adım adım, tablo…) arkasına ertelenir; seçenek kalmazsa en iyi konum kilitlenir. Bölüm/arka bölüm kuyruğu tek başına bir sayfaya
  taşıyorsa o bölümün satır aralığı / paragraf aralığı / puntosu kademeli ayarlanır (`_tighten`). Teknik derinlik kutuları sayfalar arasında
  bölünebilir; QR her şeklin altında (figcaption satırı); figür yüksekliği ≤ 120 mm. Matbaa forma katı `MULT=8` (yarım forma; `MULT=16` verilebilir).
- `kapak/kapak.mjs`: arka + sırt + ön tek yayılım (`spine_mm` matbaadan), 5 mm taşma; ISBN girilince EAN-13 barkod (JsBarcode). Üç üretken
  konsept (`kapak.json → variant`): `ag` (koyu; ızgaradan organik ağa, ember öğrenme yolu — seçilen), `kadran`, `vadi` (eş yükselti + gradyan
  inişi). Metinler (`subtitle`, `back_lead`, `back_text`, `author_bio`, `seller`) kapak.json'da; önizleme `out/onizleme/`.
- `kitap/matbaa/matbaa-notu.md`: matbaaya giden şartname (ebat, forma, kâğıt, renk, QR, ISBN/bandrol/derleme, prova).
- Bilinen sınırlar: Ghostscript resmî olarak PDF/X-3 üretir; dosya X-1a koşullarını sağlar (yalnız DeviceCMYK, saydamlık yok, fontlar gömülü,
  OutputIntent) ve X-1a olarak etiketlenir; son söz matbaa preflight'ının. `check.sh` "SONUÇ: tüm denetimler geçti" demeden dosya gönderilmez.

## İngilizce sürüm → Amazon KDP (P5)

Türkçe KDP'de desteklenmediği için Amazon'a yalnız İngilizce sürüm gider (Kindle + standart renkli 6×9 in paperback). Hat aynı, dil ve profil parametreli:

```
python3 print/export.py --lang en                # book.json, answer-key.md (EN); bölüm dosyalarına dokunmaz
python3 print/check_style_en.py                  # STYLE-GUIDE-EN.md §6 denetimi (em dash, yasak sözler, ekran fiili, >30 kelime, figür/QR sayısı)
python3 print/assemble.py --lang en              # print/kitap/en/AI-for-Everyone-EN.{md,html}
sh print/typeset/dizgi.sh --lang en --profile kdp   # print/kitap/en/kdp-interior.pdf (6×9 in, 0.125 in taşma, çift sayfa)
sh print/kapak/kapak.sh en kdp                   # print/kitap/en/kdp-cover.pdf (sırt = sayfa × 0.002252 in) + kdp-ebook-cover.jpg
sh print/typeset/check.sh en kdp                 # KDP denetimi (TrimBox 6×9, çift sayfa, ≤ 600, fontlar, PDF/X, 45 QR /d/en/)
```
- Kaynaklar `print/src/en/`: `M0N-*.md` (İngilizce yeniden yazım; kural: `STYLE-GUIDE-EN.md`), `front/` (title, acknowledgments, preface,
  how-to-read), `back/` (glossary, bibliography, index-terms.yaml), `answers/M0N.md`. Kapak metinleri `print/kapak/kapak.en.json`
  (`pages` alanı sırtı belirler). TR çıktıları değişmez (assemble TR bayt bayt regresyon testi geçer).
- Profil CSS'leri `print/typeset/profiles/{matbaa,kdp}.css`; `boxes.mjs` taşma parametresi; `check_qr.mjs <pdf> en`.
- Kindle EPUB: `sh print/kindle/build.sh` → `print/kitap/en/AI-for-Everyone.epub` (figürler PNG `render_figs.sh`, QR yerine bağlantı, pandoc EPUB3, epubcheck).
- Denetim üçlüsü (yazım sonrası): `check_style_en.py` (stil), `check_consistency_en.py` (TR↔EN yapı/sayı), `check_verbatim_en.py` + `check_verbatim_diff.py` (kaynak metin birebir; farklar EDITORIAL NOTES'ta). Sınav şıkları basılıda bölüm bazlı karışır (export.py `order(qi + 10·n)`).

## Basılı → dijital kaynak eşitleme (P6)

Redaksiyon/insanlaştırma geçişlerinde kaynak paragraflarda (Basit/Teknik/kenar notu/"Ne oluyor?") yapılan değişiklikler bölüm dosyasının sonundaki
`<!-- SOURCE-CHANGES -->` bloğuna `ESKİ ||| YENİ` satırlarıyla yazılır (YENİ = `[SİL]` yalnız basılıdan çıkarıldı demektir). Dijitale aktarma:

```
python3 print/apply_source_changes.py tr --dry-run --report print/kitap/sync-report-tr.md   # önce rapor (en/tr)
#   1) ESKİ HTML'de birebir → doğrudan; 2) basılıya uyarlanmış paragraf → book.json'daki en yakın kaynak bulunur, kelime-düzeyi
#   farklar yalnız ortak metne taşınır (KISMİ/TAŞINAMADI raporlanır); 3) elle gözden geçirilmiş satırlar
#   print/kitap/web-overrides-<dil>.md (WEB_ESKİ ||| WEB_YENİ; aynı metin = "dokunma") önce uygulanır ve otomatik taşımayı bastırır.
python3 print/apply_source_changes.py tr          # Atlas-Kitap.dc.html güncellenir (EN: Atlas-Kitap-EN.dc.html)
python3 print/export.py --lang tr                 # book.json / cevap anahtarı yenilenir (--force YOK)
python3 build.py                                  # web, store/d, gated çıktılar → yazar upload_book.py + git push
python3 print/notes_digest.py tr                  # bölüm notlarını print/kitap/REDAKSIYON-NOTLARI.md'ye toplar (en → EDITORIAL-NOTES.md)
```
Ekran fiilleri (bas, sürükle, kaydıraç) dijitalde kalır; basılıda "Şekil N.j" ile karşılanır. Basılıdan kırpılan teknik "Ne oluyor?" tekrarları
dijitalde durur (demo altında tek başına anlamlı). İnsanlaştırma raporları: `print/kitap/humanize-{tr,en}-report.md`, özet `humanize-ozet.md`.
