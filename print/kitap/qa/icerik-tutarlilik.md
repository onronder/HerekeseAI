**KARAR: DÜZELTME GEREKİR** (2 yayın engeli, 8 düzeltilmeli, ~20 kozmetik; metin gövdesi ve sayılar dört sürümde büyük ölçüde tutarlı)

# İçerik tutarlılık denetimi — dört sürüm (dijital TR/EN, basılı TR, KDP paperback EN, Kindle EN)

Tarih: 2026-09-30 · Kapsam: `print/src/{tr,en}` bölüm/ön/arka/cevap dosyaları, `book.json` (dijital kaynak), `print/figures/out/{tr,en}/*.md`, `print/kapak/*.json`, `print/src/*/on|front`, `print/kitap/ic-blok.pdf`, `print/kitap/en/kdp-interior.pdf`, `print/kitap/en/AI-for-Everyone.epub`, `print/kindle/out/book.html`, `store/*.html`, `store/en/*.html`, `store/d/*.html`. Salt okunur denetim; hiçbir kaynak dosya değiştirilmedi, git komutu çalıştırılmadı.

---

## 0. Denetleyici çıktıları (madde 1)

| Denetleyici | Sonuç |
|---|---|
| `check_style_tr.py` | 45 şekil, **0 sorun** |
| `check_style_en.py` | 45 figure, **0 issue** |
| `check_consistency_en.py` | exit 1, **6 uyarı**: tablo sayısı TR≠EN (B2: 5/6, B3: 3/4, B7: 5/7, B8: 5/7) ve sayı farkları (Şekil 5.1: TR `8` / EN `1.4 1.8 2.75 6`; Şekil 7.1: TR `9`). **Altısı da gerekçeli**: fazla EN tabloları Kendini sına şekillerinin işaretleme tablosu (EN notlar 2.5, 3.2, 7.3/7.4, 8.1/8.5: "a marking table replaces Step by step"; TR aynı içeriği numaralı liste olarak veriyor); 5.1 sayıları dile bağlı token sayımı (EN notlar: "Numbers recomputed for EN data"); 7.1 `9` = TR "Yüzde 9’dan itibaren" ↔ EN "From nine percent on" (yazıyla). Elle doğrulandı: TR 4/7, 5/8, 4/11; EN 5/7, 6/11, 4/11; 7/5=1.4, 11/6≈1.8, 11/4=2.75. |
| `check_verbatim_tr.py` | **76** kaynak paragraf birebir değil |
| `check_verbatim_en.py` | **90** kaynak paragraf birebir değil |
| `check_verbatim_diff.py` | 90 EN farkı kelime düzeyinde listeliyor (yalnız EN) |
| `notes_digest.py tr` | REDAKSIYON-NOTLARI.md: 36 satır, ~117 madde |
| `notes_digest.py en` | EDITORIAL-NOTES.md: 36 satır, ~147 madde |

**Gerekçe kontrolü (166 birebir olmayan paragraf).** SOURCE-CHANGES blokları dijital kaynağa zaten uygulanmış (`book.json` yeni metni taşıyor; 166’nın yalnız 1’i SOURCE-CHANGES sol tarafıyla eşleşiyor), dolayısıyla kalan farklar yalnız-basılı uyarlamalar. Rastgele 15 örnek (seed 20260930) tek tek notlarla karşılaştırıldı:

| # | Madde | Fark | Not karşılığı |
|---|---|---|---|
| 1 | en 4.5 teknik[1] | "The demo below" → "Figure 4.4" | EN notlar M04: "4.3 / 4.4 / 4.5 / 4.6 / 4.7 Technical: … Figure 4.4" ✓ |
| 2 | en 3.6 basit[1] | "Below, lower the ball…" → "In the left panel of Figure 3.5…"; "Raise the learning rate…" → "The right panel shows…" | EN notlar M03 3.6 Simple ✓ (+ humanize "watch" → "follow") ✓ |
| 3 | en 8.3 demo.neOluyor | teknik Ne oluyor basılıdan çıkarıldı | EN notlar M08: "those five paragraphs were dropped from the print file" ✓ |
| 4 | tr 5.7 basit[1] | "Kaydıracı sürükle:" → "Şekil 5.6’daki kareleri soldan sağa izle:" | TR notlar M05 5.7 basit ✓ |
| 5 | en 1.4 basit[1] | "Watch … below" → "Follow … in Figure 1.3" | EN notlar M01 1.4 Simple ✓ |
| 6 | en 8.4 demo.neOluyor | kırpıldı | EN notlar M08 (beş paragraf) ✓ |
| 7 | en 5.3 teknik[1] | "below" → "in Figure 5.2" | EN notlar M05 5.3 ✓ |
| 8 | en 8.5 demo.neOluyor | kırpıldı | EN notlar M08 ✓ |
| 9 | en 4.2 basit[1] | "Use the sliders…" → "In Figure 4.1 … Follow" | EN notlar M04 4.2 Simple ✓ |
| 10 | tr 1.6 demo.neOluyor | "bilinç çubuğu bile sıfırdır" → "tanımında bile bilinç şartı yoktur" | TR notlar M01 1.6 ✓ |
| 11 | tr 2.3 basit[1] | "izle" → "Şekil 2.2’de gör" | TR notlar M02 2.3 basit ✓ |
| 12 | en 6.5 basit[1] | "Tap" → "Look at … of Figure 6.4" | EN notlar M06 6.5 ✓ |
| 13 | tr 7.3 tip | "kritik" → "yüksek etkili" | TR notlar M07 "7.3 kenar notu 'kritik kararlarda' → 'yüksek etkili'" ✓ |
| 14 | en 4.5 demo.neOluyor | teknik Ne oluyor çıkarıldı | EN notlar M04 "4.5 … dropped" ✓ |
| 15 | en 7.2 teknik[1] | "The demo" → "Figure 7.1" | EN notlar M07 7.2 Technical ✓ |

15/15 gerekçeli. Tam tarama ile bulunan **gerekçesiz** kalanlar aşağıda B6 (modül→bölüm) ve A1 (silinen paragrafın dijitale sızan notu) olarak raporlandı.

---

## A — YAYIN ENGELİ

### A1 · Dijital TR sürümde ve canlı QR sayfasında redaksiyon notu okura görünüyor
- `print/src/tr/book.json` → modül 2, bölüm 2.6, `demo.neOluyor`:
  `"(basılı sürümde silindi: 2.6 teknik[0] ve teknik[1] aynı içeriği zaten taşıyor; dijital sürümde kalabilir)"`
- `Atlas-Kitap.dc.html:1199` (dijital TR kitabın kaynağı) aynı dizeyi `neOluyor:'(basılı sürümde silindi: …)'` olarak taşıyor.
- `store/d/330f95d0cf.html:1008` (**Şekil 2.5 · Hangi yaklaşım?** — basılı kitaptaki QR 2.5’in açtığı, girişsiz canlı demo sayfası) aynı metni `"neOluyor":"(basılı sürümde silindi: …)"` olarak içeriyor.
- Sonuç: Teknik modda Şekil 2.5’in "Ne oluyor?" kutusu okura bir çalışma notu gösteriyor; hem dijital kitapta hem QR’dan gelen okurda. SOURCE-CHANGES’taki `[SİL]` işareti `apply_source_changes.py` tarafından silme değil metin değiştirme olarak uygulanmış.
- EN karşılığı sağlam: `print/src/en/book.json` aynı alanda "Classical AI’s wall, in two words: the knowledge-acquisition bottleneck and brittleness." (EN M02:266 ile aynı).
- **Öneri:** TR dijital kaynakta bu alanı EN’deki cümlenin TR karşılığıyla ("Klasik YZ’nin duvarı iki kelimeyle: bilgi edinme darboğazı ve kırılganlık.") doldur ya da alanı boşalt; `book.json` ve `store/d/330f95d0cf.html`’i yeniden üret; `apply_source_changes.py`’de `[SİL]` → gerçek silme.

### A2 · Basılı/KDP/Kindle dosyalarında köşeli parantezli yer tutucular
- **TR ic-blok.pdf** (`print/kitap/ic-blok.pdf`, 232 s.) metninde: `[İsimler]`, `[isimler]` ×2 (kaynak `print/src/tr/on/01-tesekkur.md:5,7,11`) ve `[matbaa adı, adres, sertifika no]` (`print/src/tr/on/00-kunye.md:25`). Matbaa notu (`print/kitap/matbaa/matbaa-notu.md:32`) künye satırının matbaayla dolacağını söylüyor; Teşekkür’deki isimler ise yazarın işi ve dosyada "TASLAK" uyarısı var (`01-tesekkur.md:3`).
- **EN kdp-interior.pdf** (`print/kitap/en/kdp-interior.pdf`, 228 s.): `[ISBN]` (beklenen; `00-title.md:17`), ayrıca `[month, year]` (`00-title.md:21`), `[printer name, address, certificate no.]` (`00-title.md:25`), `[names]` ×3 (`01-acknowledgments.md:5,7,11`), `[place, date]` (`02-preface.md:17`). TR önsözde "İstanbul, Eylül 2026" ve "Birinci basım: Eylül 2026" dolu; EN’de boş → iki sürüm arasında künye/önsöz tutarsız.
- **Kindle EPUB** (`print/kitap/en/AI-for-Everyone.epub`; `print/kindle/out/book.html`): aynı beş yer tutucu ("[ISBN]", "[month, year]", "[printer name…]", "[names]", "[place, date]") **ve** "Print edition ISBN: [ISBN]" / "Interactive digital edition ISBN: 978-625-00-5299-0" / "Printing and binding: …" satırları. Görev tanımı gereği Kindle’da ISBN olmamalı; `kindle.py:6` "başlık sayfası / künye korunur" diyerek basılı künyeyi olduğu gibi taşıyor.
- **Öneri:** TR: Teşekkür isimlerini doldur (ya da isimli cümleleri çıkar), künye matbaa satırını matbaa bilgisiyle tamamla. EN: `00-title.md` tarih ve matbaa satırı, `02-preface.md` yer/tarih, `01-acknowledgments.md` isimler. Kindle: `kindle.py`’ye künye filtresi (ISBN satırları, "Printing and binding", "First edition" satırı yerine e-kitap sürüm satırı).

---

## B — DÜZELTİLMELİ

### B1 · Sınav şık sırası: her bölümde 1. sorunun cevabı **d**, son (6.) sorunun cevabı **d**
- `print/src/tr/cevap-anahtari.md` ve `print/src/en/answer-key.md` (TR = EN, sekiz bölüm): `1.8 dcabcd · 2.7 dcaabd · 3.8 dcbcad · 4.8 dabcad · 5.9 daacadbb · 6.7 daabbd · 7.7 dbcabd · 8.7 dbcacd`.
- Kaynak: `print/export.py:115-121` `order(seed, n)`; seed = soru indeksi + 10 × bölüm. Hesap doğrulandı: seed 10, 20 … 80 için doğru şık hep 4. konuma, seed 15, 25 … 85 için de hep 4. konuma düşüyor. Dijital kitapta (seed = soru indeksi) desen **her bölümde aynı**: `d a a b c d c b`.
- Etki: okur iki bölüm sonra "1. ve 6. soru hep d" örüntüsünü fark eder; dijitalde bütün bölümler aynı deseni verir.
- **Öneri:** `order()`’a soru metninden türeyen bir seed (ör. bölüm×100 + soru + şık sayısı) ya da gerçek karıştırma; anahtarı yeniden üret (TR/EN aynı kalmalı, şu an ✓).

### B2 · TR ondalık ayırıcı iki biçimde
- Virgül: `print/src/tr/M01-zeka-ve-makineler.md:286` "yuvarlarsan 1,2 milyon. 1997’de 18,8 milyon", `:288` "kabaca 2,4 milyar … 154,4 milyar"; `print/src/tr/M08-felsefe-ve-gelecek.md:183` "3,6’ya iniyor", `:185` "Tabloda 2,5 satırına bak. Yavaşlayan eğri o noktada 6,8; hızlanan eğri 0,2"; `print/src/tr/cevaplar/M01.md` "37,7 milyon", "75,4 milyon".
- Nokta (aynı bölümlerin düzyazısında): `M01:302` "≈ 1.5 × 10¹¹"; `M08:176-178` tablo ve `:199` "τ = 2.2"; M02–M07 düzyazı tümüyle nokta (ör. `M03:214` "0.6 − 0.18·(−1.584) = 0.6 + 0.285 ≈ 0.89", `M07:63` "0.4·e").
- Kılavuz (`print/YAZIM-KILAVUZU.md:21`) "formüllerde ve tablolarda ondalık nokta; düzyazıda Türkçe yazım" der; düzyazı için ondalık kuralı yok. M01 notu (REDAKSIYON-NOTLARI M01) "düzyazıda demonun yuvarlaması virgülle" diyerek M01’e özel karar vermiş; M08 bunu izliyor, M02–M07 izlemiyor.
- Ek belirsizlik: TR tablolarda nokta hem binlik (M01 "1.024", "2.300") hem ondalık (M03 "0.55") anlamında.
- **Öneri:** Tek kural (öneri: her yerde nokta ondalık, binlik ayırıcı için ince boşluk ya da nokta yalnız M01 tablosunda); `M08:183,185` ve `M01:286,288` + `cevaplar/M01.md` düzeltilir; kılavuz §1 güncellenir.

### B3 · Şekil 2.4 göndermesi şekilde olmayan içeriğe işaret ediyor (TR + EN)
- `print/src/tr/M02-kurallarin-cagi.md:177` "Şekil 2.4’te yedi günlük bir örnek var; havanın olasılıklara göre değişimini orada takip et."
- `print/src/en/M02-the-age-of-rules.md:177` "Figure 2.4 holds a seven-day example: follow the weather there as it changes according to its odds."
- `print/figures/out/{tr,en}/sekil-2-4-markov.md|figure-2-4-markov.md` ve SVG’lerde yalnız durum diyagramı + geçiş matrisi var; yedi günlük zincir (42, 83, 55, 91, 77, 12, 64), 3/2/2 sayımı ve %43/29/29 yalnız metindeki tabloda (`:196-206`).
- **Öneri:** "Şekil 2.4’ün altındaki tabloda yedi günlük bir örnek var" (EN: "The table under Figure 2.4 holds…") ya da zinciri şekle ekle.

### B4 · Şekil 7.1 EN teknik formülde yuvarlama eksik
- `print/src/en/M07-ai-and-society.md:61` "A = min(95, 50 + 0.4·e), B = max(5, 50 − 0.4·e), gap = A − B"
- `print/src/tr/M07-yapay-zeka-ve-toplum.md:63` "A = yuvarla(min(95, 50 + 0.4·e)), B = yuvarla(max(5, 50 − 0.4·e))" (demo kodu da yuvarlıyor).
- EN tablo satırı `:41` "8% | 53% | 47% | 6 | Balanced data (the limit)" ve `:48` "From nine percent on" yalnız yuvarlamayla doğru; yuvarlamasız e = 8 → 53.2/46.8, fark 6.4 > 6.
- **Öneri:** `A = round(min(95, 50 + 0.4·e)), B = round(max(5, 50 − 0.4·e))`.

### B5 · Kindle sürümünde "QR kod" ve basılı-kitap ifadeleri
- `print/kindle/out/book.html` / EPUB, "How to Read This Book": "**Live demos.** The QR code under each figure opens the live version of that experiment on your phone." ve Live Demos bölümü: "(and the QR codes under the figures)". Kaynak `print/src/en/front/03-how-to-read.md:18` ve arka bölüm. Kindle’da QR görseli yok; `kindle.py:23-25` QR’ı "↗ open the live demo" bağlantısına çeviriyor.
- `print/kindle/build.sh:16` EPUB açıklaması: "with 45 experiments worked out on paper and live on your phone" — e-kitap için "on paper".
- Kindle’da "Printing and binding: […]" satırı (A2 ile birlikte).
- **Öneri:** `kindle.py`’ye front-matter metin değişimi ("The link under each figure opens…", "the links under the figures"); build.sh açıklamasında "worked out step by step".

### B6 · TR teknik paragraflarda gerekçesiz uyarlama: "modül" → "bölüm" (8 yer) ve iki teknik "Aşağıdaki demo"
- Dijital kaynak (`book.json`) "modül" der, basılı "bölüm": `print/src/tr/M02-kurallarin-cagi.md:19` "Bu bölüm bu araçları kurar" (kaynak: "Bu modül bu araçları kurar"), `M02:262` "(Bölüm 3)", `M03-…:19` (3.1 teknik[1]), `M05-…:19` "Bu bölüm üretken yığını", `M05:343` "(Bölüm 6)", `M06-…:15` "Önceki bölümler … bu bölüm uygulama katmanını", `M07-…:17` "Bu bölüm YZ’nin toplumsal-teknik", `M08-…:164` kenar notu "(Bölüm 7)". EN kaynak zaten "chapter" diyor (EN book.json 2.1 teknik[1]: "This chapter builds them up"), yani TR dijital ile EN dijital de birbirinden farklı.
- REDAKSIYON-NOTLARI’nda "modül → bölüm" kararı yok (`grep modül` yalnız YAZIM-KILAVUZU:76’da numaralandırma notu).
- Ayrıca `M03-…` 3.6 teknik "Aşağıdaki demoda" → "Şekil 3.5’teki gösterimde" ve `M05-…` 5.2 teknik "Aşağıdaki demo" → "Şekil 5.1" yapılmış; M03 notu 49 ("Teknik paragraflardaki 'Aşağıdaki demoda' … aynen kaldı") artık **yanlış**.
- **Öneri:** Notlara "modül → bölüm (tüm teknik paragraflar; dijital kaynakta da 'bölüm' önerilir)" maddesi; M03 not 49 güncellensin; TR dijital kaynakta "modül" kelimesi EN ile hizalanarak "bölüm" yapılırsa 8 fark kapanır.

### B7 · Kapak / künye / iç metin vaat dili
- Sayılar dört sürümde ve mağazada **tutarlı**: 45 (kapak TR "Kırk beş deney", EN "forty-five experiments"; künye "45 canlı demo"/"45 live demos"; `03-nasil-okumali.md:9`, `03-how-to-read.md:9`; ic-blok/kdp/EPUB’da 45 `/d/` bağlantısı; `store/index.html:7,142`, `store/en/index.html`, `store/hakkimizda.html:28`, `store/en/about.html`, `store/yasal.html:25`; `matbaa-notu.md:26` "45 QR kod"); sekiz bölüm ✓; iki derinlik ✓ (mağaza "Basit + Teknik okuma modları" aynı anlam); "giriş gerekmez" ✓ (`03-nasil-okumali.md:18`, `03-how-to-read.md:18`, kapak arka metni TR/EN, `matbaa-notu.md:27`; mağazadaki "hesabınla giriş yapar" dijital kitabın kendisi için, çelişki değil); book.onuronder.com ✓ (künye, kapak, mağaza, `/d/<slug>` bağlantıları); ISBN: TR basılı 978-625-00-5211-2 yalnız TR künye + matbaa notu ✓, dijital 978-625-00-5299-0 künye/mağaza/yasal ✓, EN `[ISBN]` ✓ (beklenen), Kindle’da ISBN **var** (A2). Sırt: kapak.json 232 s./13 mm ↔ ic-blok 232 s. ✓; kapak.en.json 228 ↔ kdp-interior 228 ✓.
- Düzeltilmeli olan tek nokta: **terim**. Kapaklar "deney/experiment", iç metin ve mağaza "canlı demo/live demo/interaktif demo"; `03-nasil-okumali.md:18` "Canlı demolar", Şekil bloklarında "Canlı demo: [QR]". Kapak arka metni "Her şeklin altındaki QR kod aynı deneyin canlı halini" derken "hâl" şapkasız (`print/kapak/kapak.json` back_text[1]: "canlı halini"; author_bio[4]: "canlı halini") — iç metinde 40/40 "hâl" şapkalı.
- **Öneri:** Kapakta "kırk beş deney" kalabilir ama arka metinde bir kez "canlı demo" eşlemesi ("… QR kod aynı deneyin canlı demosunu …"); `kapak.json` "halini" → "hâlini" (2 yer).

### B8 · TR kapak yazar tanıtımı insanlaştırma kurallarına aykırı
- `print/kapak/kapak.json` author_bio[1]: "Bu kitap **tam olarak** bu sorunu çözmeye çalışıyor." — iç metinde "tam olarak" 0’a indirildi. author_bio[2]: "en radikal dönüşüm ve **devrimlerinden**" — "devrim" iç metinden çıkarıldı (M01 notu). EN karşılığı (`kapak.en.json`) "that very problem", "transformations and revolutions" aynı sorunu taşıyor.
- **Öneri:** "Bu kitap bu sorunu çözmeye çalışıyor." / "…dönüşümlerinden birini…"; EN paralel.

---

## C — KOZMETİK / BİLGİ

**Yapı (madde 2) — tutarlı.** Sekiz bölümde h3 sayısı (9/8/9/9/10/8/8/8), h4 (Teknik derinlik) sayısı, şekil sayı ve numaraları (6/5/6/6/7/5/5/5 = 45), Kurulum/Adım adım/Kendini sına/Ne oluyor/Kendin dene/kenar notu/QR sayıları, sınav soru sayıları (6, 5. bölümde 8) ve şık sayıları, doğru cevap harfleri (sekiz bölümde TR = EN, anahtar ↔ şık metni eşleşmesi 0 hata), cevaplar/M0N ↔ answers/M0N şekil başlıkları ve soru adetleri, "kalanlar" madde sayıları (7/7/7/7/7/7/6/6… B7 için 6/6, diğerleri 7/7), sözlük 78/78 madde ve bölüm atıfları birebir, kaynakça 27/27 aynı eserler (tek fark dil: "Avrupa Parlamentosu ve Konseyi" ↔ "European Parliament and Council") — hepsi TR ↔ EN eşit.

- C1 · Dizin terim sayısı TR 95 / EN 100 (`print/src/tr/arka/dizin-terimler.yaml`, `print/src/en/back/index-terms.yaml`). Beş EN terimi TR’de karşılıksız; dizin sayfaları basıldığında iki dil eşit değil. Öneri: eksik beşi TR’ye ekle.
- C2 · Şekil 2.4 5. gün beklenen dağılım: `print/src/tr/M02-kurallarin-cagi.md:228` ve `print/src/en/M02-the-age-of-rules.md:228` "(0.47, 0.30, 0.23)"; tam değer (0.4718, 0.3032, 0.2250) → 0.22. Toplamı 1’e tamamlamak içinse not düşülmeli.
- C3 · Şekil 1.6 TR anlatımı: `print/src/tr/M01-zeka-ve-makineler.md:265` "basamaklar 26 katlamada, 2023’te biter" ve `:286` "şekildeki basamaklar 26 katlamaya kadar gidiyor"; tablo 13’te durur, 26’ya giden mini grafiklerdir. EN `:265` doğru ayırıyor ("The table stops after 13 doublings … the two small charts … on to 2023"). Öneri: EN cümlesinin TR’si.
- C4 · Şekil 4.3 Kendin dene 1: `print/src/tr/M04-yapay-beyin.md:158` / `print/src/en/M04-the-artificial-brain.md:154` "tur 9’da hata … iki ondalıkla": 0.43·0.6⁹ = 0.004 → 0.00; tablodan yürüyen okur 0.01 bulur. Öneri: "üç ondalıkla".
- C5 · Şekil 3.3 EN renk: `print/src/en/M03-how-machines-learn.md:114,122,128` "green group"; baskı duotone’da noktalar koyu (INK). TR "koyu/turuncu" diyor. Öneri: "dark group" ya da figür lejandına "green on screen" notu.
- C6 · Şekil 7.1 EN altyazı alıntısı `print/src/en/M07-ai-and-society.md:48` "(40% gap)": fark puan cinsinden; "40-point gap". Baskı SVG’sinde altyazı zaten yok.
- C7 · Şekil 5.1 Kurulum sırası: `print/src/tr/M05-bugunun-yapay-zekasi.md:34` "iki sayı yazıyor: kelime sayısı ve token sayısı"; SVG "7 token · 4 kelime" (ters). EN `:34` doğru sırada.
- C8 · Şekil 6.5 Kurulum: `print/src/en/M06-using-and-building-ai.md:236` "six fields side by side"; SVG 2×3 ızgara. TR `:244` "üçerli iki sırada" doğru.
- C9 · Şekil 3.5 md başlık satırı (`print/figures/out/tr/sekil-3-5-descent.md:3`, `en/figure-3-5-descent.md:3`): "L(x) = 0.18·(x − 5)² + 0.1 · x₀ = 0.6 · x ← …" — ayraç olarak kullanılan " · " çarpma gibi okunuyor; noktalı virgül.
- C10 · Oxford virgülü: EN kitap kuralı "A, B and C" (89 örnek); 4 sapma: `print/src/en/M05-today-s-ai.md:150` "syntax, coreference, and so on"; `print/src/en/answers/M03.md:7` "tries, falls, and earns"; `print/src/en/answers/M08.md:6` "polite, formulaic, and the"; `M01:102` "…64, and 128" (kaynak metin, kalabilir). Kaynakça başlığı "Minds, Brains, and Programs" eser adı, doğru.
- C11 · "data are/is": `print/src/en/M04-the-artificial-brain.md:344` "What data are CNNs especially strong at?" ↔ metinde 3× "data is". Sınav şıkkı kaynak metin; yazar kararı.
- C12 · İngiliz yazımı: yalnız "rigour" (`M02-the-age-of-rules.md:251,254`, `answers/M02.md:16`); demo verisi, notlarda gerekçeli. "modelling/learnt" yok ✓; Amerikan yazımı 137 örnek tutarlı ✓.
- C13 · EN insanlaştırma kalıntıları (sayımlar): "exactly" **0** ✓ · "really" **0** ✓ · "just" 19 (çoğu "just like data", "only just"; kalıntı sayılmaz) · "On screen … on paper" **0** (kalan 4 "on the screen" program çıktısı/lejant, meşru) · "the digital version" **0** (bölümlerde; ön bölümlerde "digital edition" 10, meşru) · "That is why / This is why" **5** (`M04:224`, `M05:325`, `M07:153`, `M07:202`, `M08:45`; M01/M02 notları bunların kaldırıldığını söylüyor, diğer bölümlerde kaldı) · "revolution" 1 (`M01:186` tablo "The real revolution is here" — M01 notu "revolution removed" diyor, kalmış) · "very" 6 · kenar notuna geri gönderme 3 (`M01:242` "the two questions in the margin note", `M08:185`, `M08:224`; M03/M05/M06 notları bunları kaldırdığını söylüyor) · yazar "we" 28’in çoğu alıntı/deyim; gerçek kalıntı `M08:140` "(we are here today)".
- C14 · TR insanlaştırma kalıntıları: "Peki" **0** ✓ · "Cevap …" köprüsü **0** (17 eşleşme "Cevap anahtarı", "Cevap müzeden söz ediyor" gibi meşru) · "tam da / işte budur / tam olarak" **0** (13 "işte" eşleşmesi "bir işte" = iş, ve alıntı) · "ibaret" 1 (`M04:279` "gürültüden ibaret görüntü", punchline değil) · "Ekranda … kâğıtta" **0** (3 "Ekranda" program çıktısı) · "dijital sürümde" bölümlerde **0** (ön bölümlerde 7, meşru) · ekran fiilleri (dokun/bas/sürükle/kaydıraç) **0** ✓ · "aslında" 1 (`M07:204` alıntı içinde) · "yani" 20 (açıklayıcı kullanım) · "Sıradaki bölüm" 6 köprü (`M01:49`, `M02:238,264`, `M03:191`, `M04:267`, `M06`) — notlar "Sıradaki bölüm …-yor" köprülerini temizlediğini söylüyor; kalanlar kısa gönderme.
- C15 · TR terim: "yapay zekâ" 75 / "YZ" 144, şapkasız "yapay zeka" 0 ✓, "hâl" 40/0 ✓, "ret/redde" doğru ünsüz yumuşaması ✓, "kelime" 85 / "sözcük" 1 (`M07:221`), "cevap" 75 / "yanıt" 0 ✓, "özyinelemeli" ✓, "token’lar" ✓, uzun tire 0 ✓. Bölüm düzeyinde YZ/yapay zekâ oranı dengesiz: M05 1/16, M01 34/11, M08 24/14 (C).
- C16 · Başlık düzeni: TR/EN h2 Title Case, h3 ve şekil başlıkları cümle düzeni; tek istisna tutarlı özel adlar (Turing, Markov, Transformer, GAN). ✓
- C17 · Sözlük: TR "Tekir" ↔ EN "Tom" bölüm metniyle uyumlu (`glossary.md:132,138` "Tom"); EN notlar M02’deki "Tabby" uyarısı artık geçersiz (glossary Tom diyor) → notu sil.
- C18 · Şekil 3.5: web demosunda "Yüksek" η = 0.92 aşım yapmıyor; basılı tablo η = 4.6 (notlarda belirtilmiş, TR ve EN). QR’dan gelen okur salınımı göremez. Notların önerisi (web η = 4.6) uygulanmalı; dijital ↔ basılı sayı farkı sürüyor.
- C19 · Mağaza (`store/index.html`, `store/en/index.html`, `hakkimizda`, `about`, `yasal`, `legal`) yalnız dijital kitabı anlatıyor; basılı/KDP/Kindle sürümlerine ve "QR’lar girişsiz açılır" bilgisine hiç değinmiyor. Tutarsızlık değil, eksiklik.
- C20 · `store/index.html:175` "Kitap çevrimiçi okunur: hesabınla giriş yapar" ile kitap içi "giriş gerekmez" farklı ürünleri (tam kitap vs. tek demo) anlatıyor; mağazada tek cümleyle ayrım yapılırsa okur karışmaz.
- C21 · EN `EDITORIAL-NOTES` M05: "check_style_en.py therefore reports exactly one issue on that table line" — denetleyici şu an 0 sorun veriyor (allowlist). Not güncel değil.

---

## Madde 3 — Sayısal doğrulama özeti (16 şekil, elle yeniden hesaplandı)

| Şekil | Sonuç |
|---|---|
| 1.6 Üstel | 2ⁿ ve 2.300·2ⁿ (0–26) ✓; 1.5×10¹¹ ✓ (C3) |
| 2.3 Izgara | BFS 36 / açgözlü 24 kare, 19 kare-18 adım; SVG numaraları birebir ✓ |
| 2.4 Markov | matris, 7 gün, 3/2/2, %43/29/29, π = 6/13, 4/13, 3/13 ✓ (B3 gönderme, C2 0.22) |
| 3.3 Saçılım | m = 0.55, b = 0.76, hata 0.22/0.37, x = 10 → 6.26, sınır y = 6.1 − 0.6x ✓ |
| 3.5 Gradyan | η = 0.18 ve 4.6, 7’şer adım x/L/eğim ✓; 57 adım ✓ |
| 4.1 Nöron | z = 0.69, σ = 0.666, ReLU 0.69; ek satırlar ✓ |
| 4.2 İleri besleme | [1,0,1] → 0.703/0.461; [0,1,0] → 0.61/0.59 ✓ |
| 4.3 Geri yayılım | 0.43·0.6ʳ, %37 → %79 ✓ (C4) |
| 4.4 Evrişim | 25+25 hücre, duraklar −3/+3 ✓ |
| 5.1 Token | TR 4/7, 5/8, 4/11; EN 5/7, 6/11, 4/11 ✓ (C7) |
| 5.3 Dikkat | satır toplamları 1.00 ✓ |
| 5.4 Üretim | 100’e tamamlanan olasılıklar, 0.08 vs 0.021 ✓ |
| 5.7 Bağlam | TR 19 token / EN 15 token, pencere 8 ✓ |
| 7.1 Önyargı | 0/8/25/50/100 → 50/53/60/70/90 ✓ (B4 formül) |
| 7.2 Beyaz kutu | −8 → ret, +76 → onay ✓ |
| 8.4 Üç eğri | 15 değer formülden ✓ (B2 virgül); EN 1.3 / TR 1.2 (t = 5, 1.25 yuvarlama; notlarda kayıtlı) |

Ondalık ayırıcı: EN her yerde nokta, binlik virgül ✓. TR: tablolar nokta; düzyazı M01/M08 virgül, diğerleri nokta (B2).

---

## Öncelik sırası (yapılacaklar)
1. A1 — TR dijital + `store/d/330f95d0cf.html` sızan not.
2. A2 — Yer tutucular (TR teşekkür/künye; EN künye/önsöz/teşekkür; Kindle künye + ISBN).
3. B1 — Sınav karıştırma deseni (export.py), anahtar yeniden.
4. B2 — TR ondalık kuralı ve M01/M08 düzeltmesi.
5. B3, B4 — Şekil 2.4 göndermesi, Şekil 7.1 EN formül.
6. B5 — Kindle "QR kod" metinleri.
7. B6 — modül→bölüm kararının notlara ve dijital kaynağa işlenmesi.
8. B7, B8 — Kapak: "hâlini", "tam olarak", "devrim".
9. C maddeleri: isteğe bağlı, yeniden dizgi gerektirmeyenler önce (C1, C10, C13 "revolution").
