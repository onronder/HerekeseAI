# Dış kabul protokolü — Herkes İçin Yapay Zekâ / AI for Everyone

Bu protokol, ikinci doğrulama raporunda "ek ve dış kabul bekliyor" diye kalan altı grubu (R079, R080, R081, R082, R084, R099) kapatmak için
gereken kanıtları tanımlar. Bu kanıtlar dosyadan üretilemez: basılı numune, matbaa yazısı, gerçek cihaz ya da yazar kararı gerekir.
Her test aşağıdaki **dosya kimliğine** bağlıdır; dosya değişirse (yeniden dizgi, ISBN, künye) test yeniden yapılır.

<!-- KIMLIK -->
```
TR iç blok: e2e389204f0f9fa293a157d79957fec74bdb83487e45eaedc3a599354212f271  (print/kitap/ic-blok.pdf)
TR kapak: 46f11ca2f294401439508e5add77c0a5bc5bd54677fe9f37ac74efad4e64ac0a  (print/kitap/kapak.pdf)
EN iç blok: d96e7d5a10137e7c9218e1e5ee05bd8b987cfca8bfaa9e7fe50d2c794f89bf20  (print/kitap/en/kdp-interior.pdf)
EN kapak: 900240e5a642453a8311d125dfebdb14bbd085df746e2707cc8d7a432cf432a6  (print/kitap/en/kdp-cover.pdf)
EN EPUB: 626bda8e2848892767b3cd2ed22409ea33d5c0fdb8d0c9813b68beabe9a95acd  (print/kitap/en/AI-for-Everyone.epub)
```

Tablolar bu klasörde ve `python3 print/teslim/kabul_hazirla.py` ile son PDF'lerden yeniden üretilir. Doldurulan tablolar bu klasörde saklanır.

## R079 · EAN-13 barkod (TR kapak, 978-625-00-5211-2)
Dosyada doğrulanan: 95 modül, X ≈ 0,336 mm, normal çubuk ≈ 23,37 mm, koruma çubuğu uzaması 5X, çözülen sayı 9786250052112.
Kalan iki ayrı kanıt (biri tek başına ötekinin yerine geçmez):
1. **Tarayıcı okuması:** son basılı numunede barkod en az bir el tarayıcısı ya da kasa okuyucusuyla okunur; okunan sayı, cihaz ve tarih yazılır.
2. **Baskı kalitesi doğrulaması:** ISO/IEC 15416 uyumlu bir doğrulayıcıyla (verifier) sınıf notu alınır (perakende için genellikle ≥ 1,5 / C).
   Matbaa ya da bir GS1 üye hizmeti yapabilir. Rapor PDF'i bu klasöre konur.

| Kanıt | Cihaz | Sonuç | Tarih | Kim |
|---|---|---|---|---|
| Tarayıcı okuması | | | | |
| Verifier sınıf notu | | | | |

## R080 · Renk profili ve bağımsız PDF/X preflight
Dosyalarda şu an Ghostscript varsayılan CMYK profili var ("printer profile pending"). Matbaaya gidecek yazı:
> "Basılı kitap için hedef baskı koşulunuzu (ICC profili ya da FOGRA/PSO kodu) ve kabul ettiğiniz PDF/X sürümünü yazılı bildirir misiniz?
> Gönderdiğimiz dosyanın (SHA-256 aşağıda) kendi preflight raporunuzu da rica ederiz."

Profil gelince: `ICC=<profil.icc> sh print/typeset/dizgi.sh --lang tr --profile matbaa && sh print/kapak/kapak.sh && sh print/typeset/check.sh tr matbaa`.
Yeni dosyanın hash'iyle preflight raporu (Acrobat Preflight, callas pdfToolbox ya da matbaanın aracı) bu klasöre konur.

| Kanıt | Değer |
|---|---|
| Matbaanın yazılı hedef profili / baskı koşulu | |
| Kabul edilen PDF/X sürümü | |
| Preflight aracı ve sürümü | |
| Preflight sonucu (hata / uyarı) | |
| Preflight yapılan dosyanın SHA-256 değeri | |

## R081 · Künye ve EN ISBN (yazar kararı)
- TR künye: `print/src/tr/on/00-kunye.md` içindeki `[matbaa adı, adres, sertifika no]` matbaanın verdiği bilgiyle doldurulur.
- EN paperback: KDP'nin ücretsiz ISBN'i ya da yazarın kendi ISBN'i. Numara `print/src/en/front/00-title.md` ve `print/kapak/kapak.en.json → isbn` alanlarına yazılır.
- Sonra: `python3 print/assemble.py --lang tr|en`, iki dizgi, iki kapak, `check.sh`; `python3 print/qa_evidence.py` yer tutucu listesi boş olmalı.

## R082 · %100 boyut fiziksel prova ve küçük glifler
Dosyada ölçülen: normal metin ve şekil yazısı ≥ 6,5 pt (TR en küçük 6,55 pt, EN 6,51 pt). Bu tasarım hedefidir, evrensel standart değildir.
Hedefin dışında kalanlar: matematik üst/alt simgeleri (≈ 4,5–4,8 pt) ve Type 3 yedek glifler (sembol, alt simge).
`kucuk-glif-tr.csv` / `kucuk-glif-en.csv` bu gösterimlerin bulunduğu sayfaları listeler. Provada her sayfa normal okuma mesafesinde okunur ve tabloya E/H yazılır.

## R084 · Kâğıt, cilt, sırt ve KDP kabulü
- TR: 256 sayfa, net 160 × 240 mm, sırt geçici 14,2 mm (80 g/m² varsayımı). Matbaa kâğıdı seçince sırtı yazılı bildirir. Değer farklıysa
  `print/kapak/kapak.json → spine_mm` güncellenir ve kapak yeniden üretilir.
- EN: 278 sayfa, 6 × 9 in, sırt 0,6261 in = 15,90 mm (278 × 0,002252 in; standart renk, beyaz kâğıt). Güncel değer her zaman `print/teslim/kdp/README-KDP.md`'de (guncelle.py ölçümden yazar). KDP'de iç blok ve kapak yüklenir. **Print Previewer** sonucu ("no issues")
  ve proof copy görsel kontrolü yazılır.
- QR: her dilde 45 kod, en az iki farklı telefonla okunur (`qr-testi-tr.csv`, `qr-testi-en.csv`). Örnekleme yeterli değildir; 45'in tamamı denenir.

| Kanıt | Sonuç | Tarih |
|---|---|---|
| Matbaanın yazılı kâğıt / cilt / sırt onayı | | |
| KDP Print Previewer (iç blok + kapak) | | |
| KDP proof copy görsel kontrolü | | |
| QR testi TR 45/45 (2 telefon) | | |
| QR testi EN 45/45 (2 telefon) | | |

## R099 · Ekran okuyucu ve Kindle cihaz testi
Dosyada doğrulanan: EPUBCheck 0 hata; 45 alt metin ve Kurulum bağlantısı; 45 şekil verisi eki (ileri/geri bağlantılı);
Kindle Previewer 4 dönüşümü (`sh print/kindle/preview.sh`): ayarsız (A) → Java `MissingResourceException … epubprocessor.ınfo_en`
(Türkçe küçük harf) ve CLI "Failed to get Mobi message stores"; ayarlı (B) → Success, 4 Java alt süreci ayarı aldı, istisna 0; export edilmeden
atama (C) → ayar Java'ya ulaşmaz, A ile aynı hata (ikinci raporda görülen sonuç). Arayüz A/B: `PREVIEW_GUI=1`.
Kaynakça adresleri EPUB'da tıklanabilir (27 bağlantı); basılı PDF'lerde bağlantı açıklaması yoktur, çünkü PDF/X-1a sayfa içinde
TrapNet ve PrinterMark dışındaki açıklamalara izin vermez; adresler tam metin, canlı demolar QR olarak basılıdır (R098).
Etiket eşleme yüzdesi (fig_coverage.py) mekanik bir ölçümdür, anlam eşdeğerliği değildir.
Kalan: `erisilebilirlik-testi.csv` listesine göre VoiceOver (iOS/macOS Books ya da Kindle uygulaması), TalkBack (Android Kindle) ve en az bir
Kindle e-mürekkep cihazında okuma; yazı boyutu, yön ve tema değişimleri.
