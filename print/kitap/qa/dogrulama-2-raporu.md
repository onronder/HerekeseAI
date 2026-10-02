# İkinci doğrulama raporu: açık kayıtların kapanışı

Üretim: 2026-10-02T11:23 · `print/kitap/qa/dogrulama2.py` · ham sonuç `dogrulama-2.json`.
Kapsam: raporun beş somut kusuru (R056, R064, R071, R073, R094), altı ek/dış kabul grubu (R079, R080, R081, R082, R084, R099) ve N001–N008.

## Dosya kimlikleri (SHA-256)

| Çıktı | Dosya | SHA-256 |
|---|---|---|
| TR iç blok | `print/kitap/ic-blok.pdf` | `e2e389204f0f9fa293a157d79957fec74bdb83487e45eaedc3a599354212f271` |
| TR kapak | `print/kitap/kapak.pdf` | `46f11ca2f294401439508e5add77c0a5bc5bd54677fe9f37ac74efad4e64ac0a` |
| EN iç blok | `print/kitap/en/kdp-interior.pdf` | `d96e7d5a10137e7c9218e1e5ee05bd8b987cfca8bfaa9e7fe50d2c794f89bf20` |
| EN kapak | `print/kitap/en/kdp-cover.pdf` | `900240e5a642453a8311d125dfebdb14bbd085df746e2707cc8d7a432cf432a6` |
| EN EPUB | `print/kitap/en/AI-for-Everyone.epub` | `626bda8e2848892767b3cd2ed22409ea33d5c0fdb8d0c9813b68beabe9a95acd` |
| EN KPF | `print/kitap/en/AI-for-Everyone-preview.kpf` | `32513562c98c0f73de114e634cf568fcb73fb8876907da382287748894857e64` |
| TR dijital | `Atlas-Kitap.dc.html` | `57e370834a8a302e24c42eb8c91814e8739da4a5332f556068a1fb9ef9d60b35` |
| EN dijital | `Atlas-Kitap-EN.dc.html` | `2a33e6388f0f8472583bf1d31846037eb2da8a815e8146dd08d71372ec8116e1` |
| TR web | `dist/web/index.html` | `c180994aae1dfd436b8bd1d3f65f5044cceec9fc59f51b1cca29ef99bf7f2cf8` |
| EN web | `dist/web/en.html` | `51e16adfa4952330cc86866aa33f48f8b509cd0458c83142cb634ce9b77336cb` |

## Özet

| Kayıt | Konu | Tür | Testler | Kalan dış koşul |
|---|---|---|---|---|
| R056 | AI Act: sosyal puanlama koşulları ve Madde 50(4) editoryal sorumluluk | AÇIK KUSUR | ✔ 8/8 | Bütün kitap için hukuki uygunluk sertifikası değildir; hukukçu onayı yazara önerilir. |
| R064 | EN arayüzünde Türkçe kalan metin (üstel büyüme sayacı) | AÇIK KUSUR · N007 | ✔ 6/6 | yok |
| R071 | Tablolar: başlık ile ilk veri satırı birlikte; kısa tablo ve tek satır bölünmez | AÇIK KUSUR · N001 | ✔ 6/6 | yok |
| R073 | Şekil etiketleri: çakışma, kesilme, çizgi teması | AÇIK KUSUR · N008 | ✔ 2/2 | Fiziksel prova R082 kapsamında. |
| R094 | Önsöz ve EPUB: tarihsel ardıllık kapakla tutarlı | AÇIK KUSUR · N004 | ✔ 3/3 | yok |
| R079 | EAN-13 basılı kabul | EK VE DIŞ KABUL | ✔ 1/1 | Basılı numunede tarayıcı okuması ve verifier sınıf notu. |
| R080 | Hedef ICC ve bağımsız PDF/X preflight | EK VE DIŞ KABUL | ✔ 1/1 | Matbaanın yazılı ICC/baskı koşulu ve bağımsız preflight raporu. |
| R081 | Künye matbaa satırı ve EN ISBN | EK VE DIŞ KABUL (yazar kararı) | ✔ 1/1 | Matbaa adı/adres/sertifika no ve EN ISBN. |
| R082 | Şekil puntosu: iddianın kapsamı ve %100 prova | EK VE DIŞ KABUL · N002 | ✔ 4/4 | %100 fiziksel prova ve küçük glif okunurluğu (kabul/KABUL-PROTOKOLU.md, kucuk-glif-*.csv). |
| R084 | Kâğıt, cilt, sırt ve KDP kabulü | EK VE DIŞ KABUL | ✔ 5/5 | Matbaa kâğıt/sırt yazılı onayı; KDP Print Previewer ve proof copy; QR testlerinin yapılması. |
| R099 | EPUB erişilebilirliği, şekil eşdeğerliği, bağımsız Previewer dönüşümü | EK VE DIŞ KABUL · N003, N005 | ✔ 10/10 | VoiceOver/TalkBack ve gerçek Kindle cihaz/profil/font/yön testleri (kabul/erisilebilirlik-testi.csv); Previewer GUI denemesi aynı JAVA_TOOL_OPTIONS ile. |
| N001 | Tablo başlıklarının veriden ayrılması | kusur | ✔ 1/1 | yok |
| N002 | Punto iddiasının kapsamı | açıklama | ✔ 1/1 | %100 fiziksel prova ve küçük glif okunurluğu (kabul/KABUL-PROTOKOLU.md, kucuk-glif-*.csv). |
| N003 | FigureData eşleme oranının sınırı | yöntem | ✔ 1/1 | VoiceOver/TalkBack ve gerçek Kindle cihaz/profil/font/yön testleri (kabul/erisilebilirlik-testi.csv); Previewer GUI denemesi aynı JAVA_TOOL_OPTIONS ile. |
| N004 | Tarihsel anlatımın önsöze yayılmaması | kusur | ✔ 1/1 | yok |
| N005 | Bağımsız Previewer dönüşümünün tekrarlanması | kabul engeli | ✔ 1/1 | VoiceOver/TalkBack ve gerçek Kindle cihaz/profil/font/yön testleri (kabul/erisilebilirlik-testi.csv); Previewer GUI denemesi aynı JAVA_TOOL_OPTIONS ile. |
| N006 | Deepfake vaka 1: anlatıcı bilgisi ve doğrulama belirsizliği (isteğe bağlı öneri, uygulandı) | REDAKSİYON | ✔ 3/3 | yok |
| N007 | EN üstel büyüme sayacında Türkçe metin | kusur | ✔ 1/1 | yok |
| N008 | ReAct çıktı etiketinin oval çizgisine teması | kusur | ✔ 1/1 | Fiziksel prova R082 kapsamında. |

## Kayıtlar

### R056 · AI Act: sosyal puanlama koşulları ve Madde 50(4) editoryal sorumluluk

**Durum:** testler geçti; dış koşul: Bütün kitap için hukuki uygunluk sertifikası değildir; hukukçu onayı yazara önerilir.

**Değişiklik:** Şekil 7.4 kart 1 ve dijital kart Madde 5(1)(c)'nin olumsuz muamele koşullarını taşıyor; cevap ve gerekçe iki koşulu ve yasağın kamuya özgü olmadığını söylüyor; Madde 50(4) metin istisnası iki koşullu.

**Kaynak (güncel satır):** `print/src/tr/M07-yapay-zeka-ve-toplum.md:177`; `print/src/tr/M07-yapay-zeka-ve-toplum.md:200`; `print/src/en/M07-ai-and-society.md:196`; `print/src/tr/cevaplar/M07.md:14`; `print/src/en/answers/M07.md:14`; `print/figures/strings/M07.mjs:60`; `Atlas-Kitap.dc.html:2552`; `Atlas-Kitap-EN.dc.html:1513`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| var: Sosyal davranış puanıyla ilgisiz alanlarda orantısız yaptırı — TR PDF, TR dijital, TR web | her kanalda var | hepsinde var | ✔ |
| var: A state social-behavior score that triggers disproportionate — EN PDF, EPUB, EN dijital, EN web | her kanalda var | hepsinde var | ✔ |
| headless Chrome (ui_test.mjs): kart 1 etiketi görünür, "Yasak" seçimi doğru, gerekçe 5(1)(c) ve kamuya özgü olmama (TR ve EN) |  | {"sonuc": {"tr": true, "en": true}, "ui-test.json dist/web'den yeni": true, "tarih": "2026-10-02T08:05:41.316Z"} | ✔ |
| var: verinin toplandığı bağlamla ilgisiz alanlarda / yasak yalnız kamu otoritelerine özgü değildir — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: in contexts unrelated to where the data was collected / the ban is not limited to public authorities — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| var: yayımının editoryal sorumluluğunu bir gerçek ya da tüzel kiş / iki koşul birlikte aranır — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: a natural or legal person holds editorial responsibility for / both conditions must hold — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |
| yok: Vatandaşları davranışına göre puanlayan devlet sistemi / A state system scoring citizens by behavior / social scoring by a public authority is prohibited / insan editoryal denetiminden geçen metin / text under human editorial control is outside — TR PDF, EN PDF, EPUB, TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |

### R064 · EN arayüzünde Türkçe kalan metin (üstel büyüme sayacı)

**Durum:** testler geçti; dış koşul yok.

**Değişiklik:** EN expCount getter: en-US binlik ayraç ve million/billion; TR getter: basılı kitapla aynı ondalık nokta (R095).

**Kaynak (güncel satır):** `Atlas-Kitap-EN.dc.html:2200`; `Atlas-Kitap.dc.html:2200`; `print/kitap/qa/exp_getter_test.mjs:1`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| EN Atlas getter 27 durum (d = 0…26) biçim |  | [{"d": 0, "year": 1971, "out": "2,300"}, {"d": 9, "year": 1989, "out": "1.2 million"}, {"d": 13, "year": 1997, "out": "18.8 million"}, {"d": 20, "year": 2011, "out": "2.4 billion"}, {"d": 26, "year": 2023, "out": "154.4 billion"}] | ✔ |
| EN derlenmiş web getter 27 durum |  | ["2,300", "1.2 million", "18.8 million", "2.4 billion", "154.4 billion"] | ✔ |
| TR getter 27 durum (2.300 · 1.2 milyon · 2.4 milyar) |  | ["2.300", "1.2 milyon", "18.8 milyon", "2.4 milyar", "154.4 milyar"] | ✔ |
| headless Chrome (ui_test.mjs): sayaç düğmesine 26 kez tıklanarak 27 görünür durum, TR ve EN biçimi |  | {"sonuc": {"tr": true, "en": true}, "ui-test.json dist/web'den yeni": true, "tarih": "2026-10-02T08:05:41.316Z"} | ✔ |
| headless Chrome (ui_test.mjs): EN 61 bölüm × Basit + Teknik = 122 görünümde Türkçe karakter/sözcük 0 (özel adlar hariç) |  | {"sonuc": {"en": true}, "ui-test.json dist/web'den yeni": true, "tarih": "2026-10-02T08:05:41.316Z"} | ✔ |
| yok: milyon / milyar / toLocaleString('tr-TR') — EN dijital, EN web | hiçbir kanalda yok | hiçbirinde yok | ✔ |

### R071 · Tablolar: başlık ile ilk veri satırı birlikte; kısa tablo ve tek satır bölünmez

**Durum:** testler geçti; dış koşul yok.

**Değişiklik:** Uzun tabloda ilk, ikinci ve son veri satırı komşusundan ayrılmaz (data-break-before="avoid"); hooks.js yalnız başlıklı parçayı sayar, check.sh kapısı.

**Kaynak (güncel satır):** `print/typeset/typeset.py:415`; `print/typeset/hooks.js:137`; `print/typeset/check.sh:52`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR DOM sayaçları: kısa tablo bölünmesi 0, tek veri satırlı parça 0, yalnız başlıklı parça 0 |  | {"tablo-kucuk-bolunen": "0", "tablo-tek-satir": "0", "tablo-yalniz-baslik": "0", "thead-tekrar": "11"} | ✔ |
| EN DOM sayaçları: kısa tablo bölünmesi 0, tek veri satırlı parça 0, yalnız başlıklı parça 0 |  | {"tablo-kucuk-bolunen": "0", "tablo-tek-satir": "0", "tablo-yalniz-baslik": "0", "thead-tekrar": "10"} | ✔ |
| TR DOM: önceki sayfadan devam eden her tablo parçasında sütun başlığı var (tablo-devam-basliksiz 0) |  | {"tablo-devam": "11", "tablo-devam-basliksiz": "0"} | ✔ |
| EN DOM: önceki sayfadan devam eden her tablo parçasında sütun başlığı var (tablo-devam-basliksiz 0) |  | {"tablo-devam": "10", "tablo-devam-basliksiz": "0"} | ✔ |
| TR PDF bağımsız ölçüm: sayfanın son satırı bir tablo başlığı olan sayfa yok (48 başlıklı tablo) |  | yok | ✔ |
| EN PDF bağımsız ölçüm: sayfanın son satırı bir tablo başlığı olan sayfa yok (54 başlıklı tablo) |  | yok | ✔ |

### R073 · Şekil etiketleri: çakışma, kesilme, çizgi teması

**Durum:** testler geçti; dış koşul: Fiziksel prova R082 kapsamında.

**Değişiklik:** Şekil 6.3 "çıktı/output" etiketi Gözlem düğümünün altına; geometri denetimi çerçeve/elips çizgi temasını da ölçüyor (köşe rozetleri hariç).

**Kaynak (güncel satır):** `print/figures/gen/M06.mjs:199`; `print/figures/check_fig_geom.mjs:55`; `print/figures/gen/M07.mjs:171`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| 90 şekil geometri denetimi (kenar payı, metin–metin, metin–çerçeve/elips çizgisi) |  | temiz: metin kutuları kenara taşmıyor ve birbirine binmiyor | ✔ |
| dizgi ölçeğinde 180 dpi görüntüler: 45 TR + 45 EN şekil, son PDF'lerle aynı SHA-256 (sekil_tarama.py) |  | {"tr": {"sekil": 45, "Sekil 6.3 sayfa": [153]}, "en": {"sekil": 45, "Sekil 6.3 sayfa": [167]}, "png": 90} | ✔ |

### R094 · Önsöz ve EPUB: tarihsel ardıllık kapakla tutarlı

**Durum:** testler geçti; dış koşul yok.

**Değişiklik:** TR/EN önsöz "her biri/each one" yerine "çoğu/most … bazıları yan yana"; EPUB önsözü aynı kaynaktan.

**Kaynak (güncel satır):** `print/src/tr/on/02-onsoz.md:7`; `print/src/en/front/02-preface.md:7`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: Her biri bir öncekinin yetmediği yerde doğdu / Each one was born where the one before it hit a wall / follow the order of history — TR PDF, EN PDF, EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: Bunların çoğu bir öncekinin yetmediği yerde doğdu, bazıları  — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: Most of them were born where the one before hit a wall, and  — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |

### R079 · EAN-13 basılı kabul

**Durum:** testler geçti; dış koşul: Basılı numunede tarayıcı okuması ve verifier sınıf notu.

**Değişiklik:** Dosya geometrisi doğrulandı (5X koruma, 9786250052112); basılı numune için tarayıcı ve verifier kayıt tablosu hazır.

**Kaynak (güncel satır):** `print/kapak/kapak.mjs:202`; `print/teslim/kabul/KABUL-PROTOKOLU.md:3`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| kabul protokolünde iki ayrı kanıt yolu (tarayıcı okuması + ISO/IEC 15416 verifier) |  | KABUL-PROTOKOLU.md R079 | ✔ |

### R080 · Hedef ICC ve bağımsız PDF/X preflight

**Durum:** testler geçti; dış koşul: Matbaanın yazılı ICC/baskı koşulu ve bağımsız preflight raporu.

**Değişiklik:** Matbaaya gidecek yazı ve profil gelince çalışacak komut protokolde; aynı hash üzerinde preflight tablosu.

**Kaynak (güncel satır):** `print/teslim/kabul/KABUL-PROTOKOLU.md:3`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| OutputCondition "printer profile pending" (dürüst etiket) |  | OutputCondition | ✔ |

### R081 · Künye matbaa satırı ve EN ISBN

**Durum:** testler geçti; dış koşul: Matbaa adı/adres/sertifika no ve EN ISBN.

**Değişiklik:** Değişmedi: yalnız yazar/matbaa doldurabilir; adımlar protokolde.

**Kaynak (güncel satır):** `print/src/tr/on/00-kunye.md:27`; `print/src/en/front/00-title.md:17`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| kalan yer tutucular (sabit True değil: gerçek liste) |  | {"tr": ["[matbaa adı, adres, sertifika no]"], "en": ["[ISBN]"]} | ✔ |

### R082 · Şekil puntosu: iddianın kapsamı ve %100 prova

**Durum:** testler geçti; dış koşul: %100 fiziksel prova ve küçük glif okunurluğu (kabul/KABUL-PROTOKOLU.md, kucuk-glif-*.csv).

**Değişiklik:** İddia daraltıldı: "normal metin ve şekil yazısı ≥ 6,5 pt"; matematik üst/alt simgeleri ve Type 3 yedek glifler hedef dışı olarak sayılıp listeleniyor (kabul/kucuk-glif-*.csv).

**Kaynak (güncel satır):** `print/typeset/check.sh:51`; `print/kitap/qa/pdf_fontsize.mjs:86`; `print/teslim/kabul/KABUL-PROTOKOLU.md:3`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR PDF: normal yazıda 5,5–6,5 pt arası gösterim yok |  | {"normal_min_ge55": "6.555", "band_5_5_to_lim": 0, "sup_sub_lt55": 56, "type3_fallback": 142} | ✔ |
| EN PDF: normal yazıda 5,5–6,5 pt arası gösterim yok |  | {"normal_min_ge55": "6.510", "band_5_5_to_lim": 0, "sup_sub_lt55": 64, "type3_fallback": 140} | ✔ |
| check.sh ve rapor iddiası kapsamlı ("normal metin ve şekil yazısı"; istisnalar sayılıyor) |  | check.sh mesajı | ✔ |
| küçük glif sayfaları prova tablosunda |  | print/teslim/kabul/kucuk-glif-{tr,en}.csv | ✔ |

### R084 · Kâğıt, cilt, sırt ve KDP kabulü

**Durum:** testler geçti; dış koşul: Matbaa kâğıt/sırt yazılı onayı; KDP Print Previewer ve proof copy; QR testlerinin yapılması.

**Değişiklik:** Kutular kesin; 45 QR × 2 telefon test tabloları (TR/EN) ve KDP Print Previewer kayıt satırı hazır.

**Kaynak (güncel satır):** `print/teslim/kabul_hazirla.py:5`; `print/teslim/kabul/KABUL-PROTOKOLU.md:3`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| QR test tabloları 45/45 sayfa eşlemeli |  | {"tr": 45, "en": 45} | ✔ |
| TR TrimBox 160,00 × 240,00 mm |  | OKUBENI.md | ✔ |
| EN kapak net genişliği = 2 × 6 in + iç blok sayfası × 0,002252 in (KDP standart renk, beyaz kâğıt; ±0,05 pt) |  | {"ic_blok_sayfa": 278, "kapak_trim_pt": 909.08, "beklenen_pt": 909.076, "sirt_mm": 15.903} | ✔ |
| TR kapak net genişliği = 2 × 160 mm + kapak.json sırtı; iç blok 16'nın katı |  | {"ic_blok_sayfa": 256, "kapak_trim_mm": 334.2, "sirt_mm": 14.2} | ✔ |
| teslim kopyaları üretim dosyalarıyla aynı SHA-256 ve dosya adındaki sayfa sayısı doğru |  | {"AI-for-Everyone-paperback-interior-278p.pdf": true, "AI-for-Everyone-paperback-cover.pdf": true, "AI-for-Everyone-kindle.epub": true, "AI-for-Everyone-kindle-cover.jpg": true, "Herkes-Icin-Yapay-Zeka-ic-blok-256s.pdf": true, "Herkes-Icin-Yapay-Zeka-kapak-sirt14-2mm.pdf": true} | ✔ |

### R099 · EPUB erişilebilirliği, şekil eşdeğerliği, bağımsız Previewer dönüşümü

**Durum:** testler geçti; dış koşul: VoiceOver/TalkBack ve gerçek Kindle cihaz/profil/font/yön testleri (kabul/erisilebilirlik-testi.csv); Previewer GUI denemesi aynı JAVA_TOOL_OPTIONS ile.

**Değişiklik:** Şekil eşliği ayrı kabul kaydı (değer/işaret/sıra/bağlantı); etiket yüzdesi "mekanik eşleme" olarak adlandırıldı; Previewer kök nedeni A/B ve JVM kanıtıyla belirlendi, preview.sh tekrarlanabilir.

**Kaynak (güncel satır):** `print/kindle/preview.sh:3`; `print/kitap/qa/fig_relations.py:3`; `print/kitap/qa/fig_coverage.py:61`; `print/kindle/kindle.py:113`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| epubcheck |  | Messages: 0 fatals / 0 errors / 0 warnings / 0 infos | ✔ |
| 45 şekil ilişki kaydı: kritik değer (işaretli), sıra, görsel→Kurulum, görsel↔ek |  | {"sekil": 45, "kabul": 45, "kritik_deger_toplam": 672, "govdede_toplam": 571} | ✔ |
| mekanik etiket eşleme ayrı gösterge olarak etiketli |  | {"olcum": "mekanik etiket eşleme (N003): esnek meti", "yuzde": 98.3} | ✔ |
| N005 kök neden: aynı EPUB, ayarsız → Error; JAVA_TOOL_OPTIONS → Success; ayar Java alt süreçlerine ulaştı |  | {"tarih": "2026-10-02T08:14:35Z", "epub_sha256": "626bda8e2848892767b3cd2ed22409ea33d5c0fdb8d0c9813b68beabe9a95acd", "macos_AppleLocale": "tr_TR", "gomulu_jre_user_language": {"ayarsiz": "tr", "JAVA_TOOL_OPTIONS": "en"}, "A_ayarsiz": {"exit": 1, "ozet": "Not Supported,Error,0,0", "java_istisnasi_inf_o": 36, "istisna_ornegi": "Can't find bundle for base name com.amazon.language.resources.epubproces | ✔ |
| N005 asıl Java hatası: ayarsızda MissingResourceException "epubprocessor.ınfo_en" (Türkçe küçük harf) ve CLI "Failed to get Mobi message stores"; ayarlıda ikisi de 0 |  | {"A_ayarsiz": {"exit": 1, "ozet": "Not Supported,Error,0,0", "java_istisnasi_inf_o": 36, "istisna_ornegi": "Can't find bundle for base name com.amazon.language.resources.epubprocessor.ınfo_en", "cli_mobi_message_stores_uyarisi": 1}, "B_JAVA_TOOL_OPTIONS": {"exit": 0, "ozet": "Supported,Success,0,0", "ayari_alan_java_alt_sureci": 4, "java_istisnasi_inf_o": 0, "cli_mobi_message_stores_uyarisi": 0}} | ✔ |
| N005 incelemecinin sonucu yeniden üretildi: değişken export edilmeden atanınca ayar Java'ya ulaşmıyor (0 alt süreç) ve aynı Error + "Failed to get Mobi message stores" çıkıyor |  | {"exit": 1, "ozet": "Not Supported,Error,0,0", "ayari_alan_java_alt_sureci": 0, "cli_mobi_message_stores_uyarisi": 1} | ✔ |
| EPUB kapak görseli = güncel Kindle kapak JPEG'i (kapak sırtı değişince EPUB yeniden üretilmiş) |  | {"epub_kapak": "5293334d2b13ff27", "kdp_ebook_cover": "5293334d2b13ff27"} | ✔ |
| KPF içindeki book.epub, güncel EPUB ile aynı (SHA-256) ve KPF conversionLog'da hata satırı yok |  | {"kpf_icindeki_epub": "626bda8e2848892767b3cd2ed22409ea33d5c0fdb8d0c9813b68beabe9a95acd", "guncel_epub": "626bda8e2848892767b3cd2ed22409ea33d5c0fdb8d0c9813b68beabe9a95acd", "hata_satiri": 0} | ✔ |
| Previewer arayüzü (GUI) A/B: ayarsız açılış hata/önizleme yok, JAVA_TOOL_OPTIONS ile önizleme üretildi ve hata satırı 0 |  | A_ayarsiz: önizleme yok · hata satırı -
B_ayarli: önizleme 8539716 bayt · hata satırı 0
B: ayarı alan Java alt süreci 4 | ✔ |
| kaynakça bağlantıları EPUB'da tıklanabilir (R098 eki) |  | 117 | ✔ |

### N001 · Tablo başlıklarının veriden ayrılması

**Durum:** testler geçti; dış koşul yok.

**Değişiklik:** R071 kaydına bakın: kural + sayaç + PDF bağımsız ölçüm.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| R071 testleri |  | R071: geçti | ✔ |

### N002 · Punto iddiasının kapsamı

**Durum:** testler geçti; dış koşul: %100 fiziksel prova ve küçük glif okunurluğu (kabul/KABUL-PROTOKOLU.md, kucuk-glif-*.csv).

**Değişiklik:** R082 kaydına bakın: iddia daraltıldı, istisnalar sayılıyor.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| R082 testleri |  | R082: geçti | ✔ |

### N003 · FigureData eşleme oranının sınırı

**Durum:** testler geçti; dış koşul: VoiceOver/TalkBack ve gerçek Kindle cihaz/profil/font/yön testleri (kabul/erisilebilirlik-testi.csv); Previewer GUI denemesi aynı JAVA_TOOL_OPTIONS ile.

**Değişiklik:** R099 kaydına bakın: sekil-iliski-45.json ayrı kabul kaydı.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| R099 testleri |  | R099: geçti | ✔ |

### N004 · Tarihsel anlatımın önsöze yayılmaması

**Durum:** testler geçti; dış koşul yok.

**Değişiklik:** R094 kaydına bakın.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| R094 testleri |  | R094: geçti | ✔ |

### N005 · Bağımsız Previewer dönüşümünün tekrarlanması

**Durum:** testler geçti; dış koşul: VoiceOver/TalkBack ve gerçek Kindle cihaz/profil/font/yön testleri (kabul/erisilebilirlik-testi.csv); Previewer GUI denemesi aynı JAVA_TOOL_OPTIONS ile.

**Değişiklik:** R099 kaydına bakın: A/B + JVM kanıtı, preview.sh.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| R099 testleri |  | R099: geçti | ✔ |

### N006 · Deepfake vaka 1: anlatıcı bilgisi ve doğrulama belirsizliği (isteğe bağlı öneri, uygulandı)

**Durum:** testler geçti; dış koşul yok.

**Değişiklik:** Vaka metni artık anlatıcının bilemeyeceği bir kesinlik içermiyor: "hiçbir kaynakta doğrulanmayan bir cümleyi söylerken".

**Kaynak (güncel satır):** `print/src/tr/M07-yapay-zeka-ve-toplum.md:134`; `print/figures/strings/M07.mjs:42`; `Atlas-Kitap.dc.html:2516`.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: hiç söylemediği bir cümleyi söylüyor / says a sentence they never said — TR PDF, EN PDF, EPUB, TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: hiçbir kaynakta doğrulanmayan bir cümleyi söylerken — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: a sentence that no source confirms; — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |

### N007 · EN üstel büyüme sayacında Türkçe metin

**Durum:** testler geçti; dış koşul yok.

**Değişiklik:** R064 kaydına bakın.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| R064 testleri |  | R064: geçti | ✔ |

### N008 · ReAct çıktı etiketinin oval çizgisine teması

**Durum:** testler geçti; dış koşul: Fiziksel prova R082 kapsamında.

**Değişiklik:** R073 kaydına bakın.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| R073 testleri |  | R073: geçti | ✔ |

## Kanıt dosyaları

- `print/kitap/qa/dogrulama-2.json`, `sekil-iliski-45.json`, `kindle-previewer/` (A/B, JVM günlükleri, OZET.txt), `sekil-tarama/` (dizgi ölçeğinde görüntüler).
- `print/teslim/kabul/`: dış kabul protokolü ve doldurulacak tablolar (QR 45 × 2 telefon × 2 dil, küçük glif sayfaları, erişilebilirlik).
- `sh print/typeset/check.sh tr matbaa` ve `sh print/typeset/check.sh en kdp`: bu hash'lerdeki dosyalar için "tüm denetimler geçti".

Bu rapor kitabın hatasız olduğunun garantisi ya da matbaa/KDP onayı değildir; dış koşullar özet tablosunda listelidir.
