**KARAR: DÜZELTME GEREKİR** — 1 yayın engeli (kapak sırt yazısı sırtın dışında), 10 düzeltilmesi gereken madde, 9 kozmetik not.

# Herkes İçin Yapay Zekâ (TR, basılı) — matbaa öncesi son okuma raporu

Tarih: 30 Eylül 2026. Denetlenen dosyalar: `print/kitap/ic-blok.pdf` (232 s., 470.88×696.96 pt = 166×246 mm, TrimBox 160×240 mm, PDF/X-1:2001, 28 gömülü alt-küme font), `print/kitap/kapak.pdf` (972×708.96 pt = 343×250 mm, TrimBox 333×240 mm), `print/kitap/matbaa/matbaa-notu.md`, `print/kapak/kapak.json`, `print/typeset/out/defer.json`, `print/typeset/print.css`, kaynak el yazması. Yöntem: pdftotext (-layout / -bbox-layout) ile 232 sayfanın satır koordinatları; 50–100 dpi örnek sayfa görüntüleri (s. 13–16, 23–24, 42–43, 66–67, 97, 104, 117, 123, 191, 194, 223, 227); kapak 50 dpi + sırt 200 dpi. Sayfa numaraları = PDF sayfası = basılı folyo (s. 13 "Bölüm 1" açılışı, folyo 13).

---

## A — Yayın engeli

### A1. Kapak: sırt başlığı sırtın dışında, arka kapağın üstüne basılıyor
- **Dosya:** `kapak.pdf`. `pdftotext -bbox` ile sırt yazılarının konumu:
  - "Herkes İçin Yapay Zekâ" (dikey): x = **422.6–438.6 pt**
  - "ONUR ÖNDER" (dikey): x = 481.5–490.5 pt (doğru; sırt ortası 486.2 pt)
  - Sırt alanı: 14.17 pt taşma + 453.5 pt arka kapak = **467.7–504.6 pt** (13 mm).
- Başlık, sırt katlama çizgisinin **10–16 mm solunda**, arka kapağın sağ üst kenarında duruyor (50 dpi kapak görüntüsünde de arka kapak üzerinde, sırtın dışında görülüyor). Baskıda arka kapakta yatık bir başlık, sırtta ise yalnız yazar adı çıkar.
- **Neden:** `print/kapak/kapak.mjs` satır 223: `.spine .t { left: 50%; transform: translateX(-50%) rotate(90deg); transform-origin: left top; }`. `translateX(-50%)` metnin döndürülmemiş genişliğinin yarısı (~47 pt) kadar sola kaydırıyor, sonra sol-üst köşe etrafında döndürüyor. Yazar adı `writing-mode: vertical-rl` kullandığı için doğru yerde.
- **Öneri:** Başlığı da yazar adı gibi kur: `.spine .t { writing-mode: vertical-rl; left: 50%; transform: translateX(-50%); top: ${BLEED+12}mm }` (ya da `transform-origin: center; transform: translate(-50%, 0) rotate(90deg)` yerine `left:50%; top:…; transform: rotate(90deg) translateY(-50%); transform-origin: top left` biçimini deneyip bbox ile doğrula). `sh print/kapak/kapak.sh` sonrası `pdftotext -bbox print/kitap/kapak.pdf - | grep Herkes` ile x aralığının 467.7–504.6 pt içinde kaldığını kontrol et; bu denetimi `check.sh`'e ekle (sırt metni x-aralığı ⊂ sırt).

---

## B — Düzeltilmeli

### B1. Sol (çift) sayfalarda koşan başlık yok
- **Sayfalar:** 14–232 arası bütün çift sayfalar (ör. s. 16, 66, 192). Sağ sayfalarda "BÖLÜM 1 · ZEKÂ VE MAKİNELER" var (y ≈ 31 pt), sol sayfalarda üst kenarda hiçbir metin yok; ilk satır gövdeyle başlıyor.
- `print.css` satır 9–10: `@page :left { @top-left { content: string(book) … } }`. `ic-blok.html` satır 322: `body { string-set: book "Herkes İçin Yapay Zekâ"; }` — Paged.js `string-set`'i yalnız akışa giren öğelerde işler, `body` üzerindeki tanımı sayfalara taşımaz; bu yüzden değer boş kalıyor.
- **Öneri:** Tanımı gövdede tekrar eden bir öğeye taşı (ör. her bölümdeki gizli `.rh` öğesine `string-set: chap content(), book "Herkes İçin Yapay Zekâ"`) ya da `@top-left { content: "HERKES İÇİN YAPAY ZEKÂ" }` sabit yaz. Ardından s. 14, 16, 66'da üst-sol başlığı doğrula. (Bölüm açılış ve boş sayfalar zaten başlıksız kalmalı: `@page opener`/`:blank` doğru.)

### B2. "Kapaktaki kadran" göndermesi — kapakta kadran yok
- **Sayfa 7** (Bu Kitabı Nasıl Okumalı): "Kutular atlanabilir; ana metin onlara dayanmaz. **Kapaktaki kadran bunu anlatır: aynı fikir, iki derinlik.**"
- `kapak.json → "variant": "ag"`; kapak görseli ağ/çizgi grafiği. "kadran" `kapak.mjs`'in seçilmemiş B varyantı. Kaynak: `Herkes-Icin-Yapay-Zeka-TR.md` satır 69.
- **Öneri:** Cümleyi sil ya da kapağa uyarla ("Kapaktaki ağ bunu anlatır: aynı düğümler, iki katman" gibi).

### B3. Cevap anahtarı tek paragrafa akmış
- **Sayfalar 191–193:** "1.8 · Soru 1: d — Zekânın tek değil, birçok türü olduğunu 1.8 · Soru 2: c — 0 ve 1 1.8 · Soru 3: a — …" satır sonu olmadan tek blok; s. 192 "7.7 · Soru 1: d — Çarpık/eksik eğitim verisinden 7.7 · Soru 2: b —" satır ortasında kırılıyor.
- **Neden:** md satır 3178–3190 vb. cevaplar arasında boş satır yok → tek `<p>` (HTML satır 7234).
- **Öneri:** md'de her cevabı liste maddesi yap (`- 1.8 · Soru 1: **d** — …`) ya da satır sonuna iki boşluk/`<br>`; dizgide `.back li { break-inside: avoid }`. Şekil cevapları (s. 194–209, "1) … 2) …") tek paragraf olarak kalabilir; okunuyor.

### B4. Dizin sayfa numaraları terimin geçtiği sayfayı değil bölüm başlangıcını gösteriyor
- **Sayfalar 225–226**, başlık altı: "Sayılar sayfa numarasını gösterir." Doğrulanan girdiler (dizin → terimin gerçekten geçtiği sayfa):
  - "DPO 116" → 118; "Searle, John 27, 173, 176" → 29, 175–178; "KVKK / GDPR 152, 162" → 152, 164; "BPE / WordPiece 103" → 105–106; "Regresyon 57, 60, 62, 75" → 59, 62–65, 75–76; "Sınıflandırma 57, 60, 62, 75, 145" → 59, 62–65, 75–76, 147–148; "Gradyan inişi … 84" → s. 84'te yok; "Hinton, Geoffrey 84" → s. 84'te yok (bkz. 4.4 içi).
  - "Dikkat 40, 72, 79, 91, 94, 102, …": s. 40–42 (2.3 kurallar) ve 72, 79'da dikkat *mekanizması* yok; genel "dikkat et" kullanımı eşleşmiş (eş sesli).
  - 89 girdi / 271 referansın **97'sinde** terim (kök eşleme) verilen sayfada geçmiyor; çoğu 1–3 sayfa sonra bulunuyor.
- **Öneri:** Dizini dizgi sonrası PDF metninden sayfa bazlı üret (terim listesi × `pdftotext` sayfa eşlemesi), "dikkat", "sapma", "özellik", "kayıp" gibi eş seslileri elle ayıkla. Alternatif: notu "Sayılar bölümün başladığı sayfayı gösterir" yap (daha zayıf).

### B5. Ertelenmiş şekiller: "Kurulum. Şekilde … görüyorsun" şekilden önce, sayfa çevirmeli
- `defer.json` k>0 olan 30 şekilden 18'inde Kurulum paragrafı bir açılımda, şekil sonraki açılımda (Kurulum s. → şekil s.): **1.1** 15→16, **1.3** 21→22, **1.5** 27→28, **2.1** 37→38, **2.3** 43→44, **3.3** 63→64, **4.3** 85→86, **4.5** 91→**93** (2 s.), **4.6** 94→**96** (2 s.), **5.1** 103→104, **5.2** 106→**108** (2 s.), **5.4** 113→114, **5.6** 119→120, **6.1** 131→132, **7.1** 153→154, **7.5** 165→166, **8.3** 179→180, **8.5** 185→186. Aynı açılımda kalanlar (1.2, 1.4, 2.2, 2.5, 3.2, 4.4, 5.3, 5.5, 6.3, 7.3, 7.4, 8.4) kabul edilebilir.
- Metin göndermesi ile şekil arası ≥ 2 sayfa: "Şekil 4.3’te…" s. 84 → şekil s. 86; "Şekil 4.6’da…" s. 94 → s. 96; "Şekil 5.3’te…" s. 109 → s. 111; "Şekil 5.4’te…" s. 112 → s. 114.
- Örnek: s. 15 "Kurulum. Şekilde sekiz kart var…" + "Adım adım" tablosu; şekil ancak s. 16'nın ortasında (tablonun 2 satırı da s. 16'ya devrediyor, bkz. B6).
- **Öneri:** Yüzen motorda ertelemeden önce "şekil + Kurulum + Adım adım'ı tek blok olarak sonraki sayfaya taşı" seçeneğini dene (k yerine `break-before: page` + kuyruk boşluğunu `_tighten` ile kapat); en azından 2 sayfa fark olan 4.5, 4.6, 5.2 için Kurulum'u şekille birlikte taşı.

### B6. Tablolar sayfa sonunda bölünüyor, başlık satırı tekrarlanmıyor
- s. **15→16** (Adım adım, "Zekâ türü / Ne demek / Bugünkü YZ / Çubuk": "İçsel" ve "Doğacı" satırları s. 16'da, başlıksız)
- s. **23→24** (Turing geçiş tablosu "Durum / Okunan / Yazılan / Hareket / Yeni durum": 2 satır s. 24'te)
- s. **38→39** ("Soru / İzlenen ok / Karar": "Tekir bir Taş mı?" satırı s. 39'da)
- s. **85→86** ("Tur / Hata / Çıktı / Hedefe uzaklık": tek satır "7 | 0.01 | %79 | 1 puan" s. 86'da)
- s. **153→154** ("Veri önyargısı (e) / A onay / B onay / Parite farkı / Gösterimin yorumu": tek satır "%8 | %53 | %47 | 6" s. 154'te)
- s. **182→183** ("Zaman / Hızlanan / Yavaşlayan / Belirsiz": tek satır "10 | 10.0 | 9.9 | 6.4" s. 183'te)
- **Öneri:** `print.css`'e `thead { display: table-header-group } tr { break-inside: avoid }`; 8 satırı geçmeyen tablolar için `table { break-inside: avoid }`. Tek satır devreden 4 tabloda (85, 153, 182, 38) `_tighten` ile bir satır kazanmak yeter.

### B7. Sınav sorularının şıkları sayfa sonunda bölünüyor
- s. **32→33** (1.8 soru 6: "a) Zekânın IQ ile tam ölçüldüğünü" s. 32, b–d s. 33), s. **52→53** (2.7 soru 6: "a) İki programlama dilini" | "b) İki robot türünü"), s. **75→76** (3.8 soru 6: b | c), s. **126→127** (5.9 soru 4: "b) Veritabanı sorgular" | "c) Bir sonraki token’ı tahmin eder"), s. **168→169** (7.7: "b) Şirket büyüklüğüne" | "c) Programlama diline"), s. **188→189** (8.7: "a) Anlamsız bir soru" | "b) Yasayla yasaklanmış").
- **Öneri:** Soru kökü + 4 şık tek kap (`.quiz li { break-inside: avoid }`).

### B8. Formül sayfa sonunda kırılmış, kuyruğu tek satır dul
- s. **66** son satır: "Adım adım. Gruplama tek bir soruya dayanır: … Uzaklık Pisagor’la hesaplanır: √((x − xₘ)² + (y −" → s. **67** ilk satır: "yₘ)²)." tek başına, altında tablo.
- **Öneri:** Formülü `<span style="white-space:nowrap">` içine al; "Adım adım." paragraflarına `widows: 2; orphans: 2`.

### B9. Basılı okura yöneltilmiş ekran/etkileşim komutları
- s. **84**: "Şekil 4.3’te tur tur ilerle; hatanın geriye akışını … izle."
- s. **94**: "Şekil 4.6’da tur tur ilerle; gürültüden ibaret görüntünün … yaklaştığını izle."
- s. **106**: "Şekil 5.2’de bir kelime seç, komşularını gör."
- s. **109**: "Şekil 5.3’te bir kelime seç; o kelimenin cümledeki ötekilere ne kadar 'dikkat ettiğini' rengin koyuluğundan gör."
- s. **112**: "Şekil 5.4’te … bak. İki 'yaratıcılık' (sıcaklık) sırasını da karşılaştır: hep en olası kelimeyi mi seçsin, …"
- s. **49**: "Şekil 2.4’teki gösterimde uzun vadeli dağılımın nasıl oluştuğunu gözlemle." · s. **71**: "Şekil 3.5’teki gösterimde … gözlemle." · s. **42**: "Şekil 2.2’deki gösterimde … tetiklemesini (zincirleme) de göreceksin."
- s. **120** şekil lejantı: "kalp pikseli (ekranda mor)".
- **Öneri:** Kâğıda uygun fiiller: "Şekil 4.3’ün karelerini soldan sağa izle", "Şekil 5.3’te 'o' satırına bak", "Şekil 5.4’te iki sıcaklık sütununu karşılaştır"; "(ekranda mor)" → "(mor)". ("tıkla/kaydıraç/sürükle" hiç yok; s. 57–58 "Hemen tıklayın" spam örneği, s. 26/194 "ekrana yaz" bilgisayar örneği: doğru.)

### B10. PDF meta verisinde yazar adı bozuk: "Onur ÃŒnder"
- `pdfinfo` her iki dosyada `Author: Onur ÃŒnder`. Kaynak: `print/typeset/out/PDFX_def.ps` satır 8 `/Author (Onur Önder)` — UTF-8 baytlar PDFDocEncoding olarak okunuyor.
- **Öneri:** `/Author <FEFF004F006E00750072002000D6006E006400650072>` (UTF-16BE, BOM'lu) ve `/Title <FEFF…>`; `dizgi.sh`/`kapak.sh`'te üret. Baskıya etkisi yok ama preflight raporunda ve kütüphane/derleme kayıtlarında görünür.

---

## C — Kozmetik

- **C1. Bölüm sonu boşlukları** (> %30): s. 34 (%66, Bölüm 1 sonu), s. 99 (%69, Bölüm 4), s. 128 (%67, Bölüm 5), s. 209 (%55, cevap anahtarı sonu), s. 11 (%68, içindekiler sonu), s. 53 (%43), s. 76 (%44), s. 189 (%39), s. 226 (%43, dizin sonu), s. 3 (%56, teşekkür). Hepsi bölüm/kısım sonu; kabul edilebilir. `_tighten` Bölüm 1/5'i sıktığı hâlde kuyruklar 2/3 boş; gevşetip 2 sayfaya yaymak yerine olduğu gibi bırakılabilir.
- **C2. Küçültülmüş şekillerde yazı boyu** (100 dpi'de incelendi): Şekil 5.5 (×0.8, s. 117) hücre metinleri ≈ 5 pt; Şekil 5.7 (×0.8, s. 123) "pencere dolu 8/8 · unutulan 1" ≈ 4.5 pt; Şekil 5.1 (×0.814, s. 104) token kutuları ≈ 5.5 pt; Şekil 1.1 (×0.9, s. 16) çubuk etiketleri "Güçlü · %90" ≈ 4 pt. Ekranda okunuyor; fiziksel provada mutlaka kontrol. Kenar çizgileri, aksan rengi, QR sessiz alanı temiz; etiket taşması görülmedi.
- **C3. s. 97 Teknik derinlik:** "min_G max_D V(D, G) = 𝔼ₓ[log D(x)] + 𝔼_z[log(1 − D(G(z)))]" — düz metin alt simge (`_G`, `_D`, `_z`) ile gerçek alt simge (ₓ) karışık. `<sub>` ya da Unicode alt simge.
- **C4. Şekil adlarında "(gösterim)":** 4.3 "Hatadan öğren (gösterim)", 4.5 "Hafızalı işleme (gösterim)" (s. 86, 93; canlı demolar listesi s. 223–224'te de). Basılıda anlamsız; kaldır.
- **C5. "gösterim/gösterimde" kalıntıları** (demo kastıyla, çoğu Teknik derinlik kutusunda): s. 39, 42, 48, 49, 65, 68, 71, 84, 87, 91, 94, 97, 154, 181, 198, 205. "Şekil X’teki gösterim … canlandırır" → "Şekil X … gösterir". s. 48 ("Canlı gösterimde sayıları makine rastgele çeker; burada … biz seçtik") ve s. 198/205 bilinçli karşılaştırma; kalabilir.
- **C6. Künye s. 2:** "E-" satır sonunda kırılmış ("E-\nposta"). Kırılmaz tire (U+2011) kullan.
- **C7. kapak.json metinleri:** (a) "Fittechs'in" düz kesme (') — kitap ’ kullanıyor. (b) Arka kapak metni "sen" (çıkarıyorsun), yazar tanıtımı "siz" (bulabilirsiniz, okutun, hazır olun): ton tutarsız. (c) "İnsanlık ve teknoloji tarihinin en radikal dönüşüm ve devrimlerinden birini anlamak ve sindirmek için detaylı bir şekilde okumanız gerekli olan kaynağı paylaşmaktan mutluluk duyuyorum." — uzun ve dolambaçlı; öneri: "Teknoloji tarihinin en köklü dönüşümlerinden birini anlamak isteyenler için yazdım." (d) "Asıl sorun ne zaman neyi öğrenmemiz gerektiğini anlayamamamız." dilbilgisi doğru, ama "Bu kitap tam olarak bu sorunu çözmeye çalışıyor" ile birlikte tanıtımdan çok slogan; yazar kararı. Yazım hatası yok. `price` boş (fiyat basılmayacaksa sorun değil).
- **C8. Matbaa notu ↔ künye:** Not, künyede `[ay, yıl]` yer tutucusu olduğunu söylüyor; künyede "Birinci basım: Eylül 2026" basılı, yer tutucu yalnız `[matbaa adı, adres, sertifika no]`. Notu güncelle.
- **C9. Notlar sayfaları** (227–232): satır çizgileri dönüşümlü gri/turuncu; tasarım tercihiyse tamam.

---

## Yazarın elle dolduracağı alanlar

| Yer | Metin | Not |
|---|---|---|
| s. 2 künye | `Baskı ve cilt: [matbaa adı, adres, sertifika no]` | matbaa seçilince |
| s. 3 teşekkür | `[İsimler] başta olmak üzere ilk okurlarıma teşekkür ederim.` | |
| s. 3 teşekkür | `…çekinmeyen gözlere borçluyum: [isimler].` | |
| s. 3 teşekkür | `…sabreden aileme: [isimler]. Bu kitap sizin de kitabınız.` | |
| `kapak.json → spine_mm` | 13.0 (geçici) | matbaanın kâğıda göre vereceği değer; kapak yeniden üretilir |
| `kapak.json → price` | boş | fiyat basılacaksa |
| matbaa-notu † maddeleri | bandrol, derleme nüshaları, kâğıt/cilt, ICC profili | matbaa teyidi |

---

## Doğrulanan ve sorunsuz bulunanlar

- **Yapı:** s. 1 iç kapak (başlık, alt başlık, yazar); s. 2 künye — basılı ISBN 978-625-00-5211-2 (kontrol basamağı doğru), dijital ISBN 978-625-00-5299-0 (doğru), "Birinci basım: Eylül 2026", FSEK notu, satış/iletişim; s. 3 teşekkür; s. 5 önsöz (İstanbul, Eylül 2026); s. 7 nasıl okumalı; s. 9–11 içindekiler; bölümler s. 13, 35, 55, 77, 101, 129, 151, 171; cevap anahtarı 191–209 (8 sınav + 45 şekil girdisi); sözlük 211–219 (74 terim, alfabetik); kaynakça 221–222; canlı demolar 223–224; dizin 225–226; Notlar 227–232 (6 sayfa).
- **İçindekiler:** 74 girdinin **tamamı** gerçek sayfayla eşleşiyor (yalnız 12 değil, hepsi kontrol edildi).
- **Boş sayfalar:** 4, 6, 8, 12, 54, 100, 170, 190, 210, 220 — hepsi açılış öncesi verso, folyosuz/başlıksız. Bütün bölüm ve arka kısım açılışları sağ sayfada.
- **Sağ sayfa koşan başlıkları** her bölümde doğru (BÖLÜM N · AD; CEVAP ANAHTARI; SÖZLÜK; KAYNAKÇA VE İLERİ OKUMA; CANLI DEMOLAR; DİZİN; NOTLAR). Folyo alt ortada, ilk metin sayfası 13 = folyo 13.
- **Şekiller:** 45 şekil, 1.1–8.5 sıralı, numara atlaması yok; her birinin altında "Şekil N.j · Canlı demo: book.onuronder.com/d/<10 hex> [QR]" satırı; 45 adres canlı demolar listesiyle birebir aynı, kopya yok.
- **Teknik derinlik kutuları:** sayfa geçişlerinde kenarlık kapanıp devam sayfasında yeniden açılıyor, etiket ilk parçada (s. 42→43, 96→97 görsel kontrol). Sayfa sonunda yalnız kalan "TEKNİK DERİNLİK", "Kurulum." ya da "Adım adım." etiketi yok. Sayfa sonunda yalnız kalan alt başlık yok.
- **Başlıklar:** 1.1–8.7 toplam 61 alt başlık eksiksiz ve sıralı.
- **Sınavlar:** 8 sınav, 6 soru × 4 şık (5.9: 8 soru × 4 şık), a)–d) düzeni tutarlı. Cevap anahtarı Bölüm 2, 5 ve 6 sınavlarıyla birebir tutarlı (20 soru).
- **Metin taraması:** "[…]" yer tutucu yalnız künye ve teşekkürde; "TODO/YAZILACAK/TBD" yok; çift boşluk yok; yanlış tire (" - ", "--") yok; "tıkla/kaydıraç/sürükle/fare" komutu yok. Dul/yetim: yalnız s. 67 (B8).
- **Kapak:** 972×708.96 pt = 343×250 mm (net 333×240 mm + 5 mm taşma; TrimBox 14.17 pt içeride) ✓; arka kapak metni ve yazar tanıtımı kapak.json ile aynı, yazım hatası yok; ISBN yazısı ve EAN-13 barkod "9 786250 052112" = 978-625-00-5211-2 ✓; sırt yazar adı 200 dpi'de net okunuyor; ön kapakta üst başlık "KURALDAN DERİN ÖĞRENMEYE", alt başlık ve yazar adı doğru.
- **Matbaa notu ↔ dosya:** 232 sayfa ✓; 232 = 14×16 + 8 ✓; son 6 sayfa Notlar ✓; sırt 13 mm ✓ (kapak genişliği 160+13+160+2×5); iç blok 166×246 mm MediaBox / 160×240 mm TrimBox ✓; 45 QR ✓; PDF/X-1:2001 + OutputIntent ✓; fontlar gömülü ve alt küme ✓.

---

## Yeniden üretim sonrası hızlı kontrol listesi

1. `pdftotext -bbox print/kitap/kapak.pdf - | grep -E 'Herkes|ONUR'` → x aralıkları 467.7–504.6 pt içinde.
2. `pdftotext -f 16 -l 16 -bbox-layout print/kitap/ic-blok.pdf -` → y < 45 pt'te "HERKES İÇİN YAPAY ZEKÂ".
3. s. 7'de "kadran" yok; s. 191 cevaplar satır satır.
4. Dizin: "DPO", "Searle", "KVKK" verilen sayfada geçiyor.
5. Tablolar s. 15, 23, 38, 85, 153, 182 bölünmüyor ya da başlık tekrarlıyor; s. 66–67 formül tek satırda.
6. `pdfinfo` Author = "Onur Önder".
7. `sh print/typeset/check.sh` tüm maddeler ✔; fiziksel provada Şekil 1.1, 5.5, 5.7 en küçük yazılar ve 10 QR okutma.
