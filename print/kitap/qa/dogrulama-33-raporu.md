# 2026-10-01 doğrulama raporu: 33 açık kaydın kapanışı

Üretim zamanı: 2026-10-02T00:03 · üretici: `print/kitap/qa/dogrulama33.py` · ham sonuç: `dogrulama-33.json`

## Çıktılar ve hash (SHA-256)

| Çıktı | Dosya | Sayfa | SHA-256 |
|---|---|---|---|
| tr_pdf | `print/kitap/ic-blok.pdf` | 256 | `4d74bf636ab84c3ed6c6ad9e8e12204d29eb467f4faeeb02f71719553a6921ba` |
| tr_cover | `print/kitap/kapak.pdf` | 1 | `d0105410e03d822a6217f4b9c9aaae0719c94a5b20172ac4003706505932b696` |
| en_pdf | `print/kitap/en/kdp-interior.pdf` | 278 | `7cd8ae257dd6ea98e187e5b680c9cc0450821e42516e4068ca18d6fb42fa2605` |
| en_cover | `print/kitap/en/kdp-cover.pdf` | 1 | `f1faef62abb0881e4a89fe225f34b7b519da6ea0c9139b74b34c37c02baa116c` |
| epub | `print/kitap/en/AI-for-Everyone.epub` |  | `eba97ad69af17f3bb4fe7d83163a163fea65cb856da674fa32158ab218a19fd0` |
| tr_html | `Atlas-Kitap.dc.html` |  | `3c38107d4787f45a9ac79788cf4701f37d15b6c3d4da9695ea50193122285e3b` |
| en_html | `Atlas-Kitap-EN.dc.html` |  | `cf6983dcee265f8101246c1b18af0fc384a6ea232a2f76b5eb66adfbf3b65a01` |
| tr_web | `dist/web/index.html` |  | `b5bb0447831839a2404e10f23cdef7b1dc93550608739530b3717fdd322fdf83` |
| en_web | `dist/web/en.html` |  | `e9c434b7604064717c31b47f3f50bd4e9ceb5d2eb555cae3dbdfec9d5a653505` |

## Özet

| Kayıt | Konu | Otomatik testler | Kalan dış koşul |
|---|---|---|---|
| R002 | İnsan/makine karşılaştırması: çubuklar temsili | ✔ 6/6 | yok |
| R004 | Turing makinesi: özel/evrensel, hesaplanabilirlik | ✔ 5/5 | yok |
| R007 | AGI ile bilincin ayrılması; dar YZ tanımı | ✔ 5/5 | yok |
| R012 | Örnek olma (instance-of) ile alt sınıf (subclass-of) | ✔ 5/5 | yok |
| R018 | Sayısal çıktı her zaman regresyon değil | ✔ 3/3 | yok |
| R024 | Model uyumu: doğrulama verisi ve eğitim yöntemi | ✔ 5/5 | yok |
| R031 | RNN çubukları: \|h\|, renk ve işaret | ✔ 4/4 | yok |
| R033 | Üretken YZ tek buluş değil; GAN geçişi | ✔ 2/2 | yok |
| R037 | Nedensel maske kendi konumunu içerir | ✔ 5/5 | yok |
| R040 | Sıcaklıklı örnekleme: CDF tam değerden tek yuvarlama | ✔ 4/4 | yok |
| R041 | Ham model genellemesi örneğe bağlandı | ✔ 3/3 | yok |
| R043 | Bağlam penceresi: kelime/token birimi, hatırlama | ✔ 5/5 | yok |
| R050 | Grounding/fallback/guardrails: dizin ve sözlük eşliği | ✔ 3/3 | yok |
| R053 | SHAP: itiraz hedefi ve nedensellik | ✔ 6/6 | yok |
| R055 | Deepfake: olay, köken ve bağımsız kanal ayrı puanlanır | ✔ 4/4 | yok |
| R056 | AI Act: amaç/aktör/madde, geçişler, roller | ✔ 6/6 | Hukuki metin birincil kaynakla eşlendi (EUR-Lex 2026/1744, konsolide 27.07.2026); hukukçu onayı yazara önerilir. |
| R057 | GDPR ve KVKK ayrı koşullar (dijital) | ✔ 2/2 | yok |
| R059 | Turing testi: model, istem, süre, düzen | ✔ 2/2 | yok |
| R069 | Sabit ağırlık ≠ bağlam içi uyum yokluğu; M01/M08 tutarlılığı | ✔ 6/6 | yok |
| R071 | Tablolar: başlık tekrarı, kısa tablo/tek satır bölünmez | ✔ 2/2 | yok |
| R073 | Şekil etiketi çakışma/kesilme | ✔ 3/3 | R082 fiziksel prova ayrı (yazar/matbaa). |
| R076 | Dizin hedefleri kavram bağlamında ve aynı sayfada | ✔ 6/6 | yok |
| R079 | EAN-13: modül, normal ve koruma çubuğu | ✔ 4/4 | Basılı provada ISO/IEC 15416 doğrulayıcı (verifier) ölçümü: matbaa/yazar. |
| R080 | Renk profili ve bağımsız preflight | ✔ 1/1 | Matbaanın yazılı ICC kabulü + aynı hash üzerinde bağımsız PDF/X preflight raporu (Acrobat/callas). ICC gelince: ICC=<profil> sh print/typeset/dizgi.sh … |
| R081 | Künye: matbaa bilgisi ve EN ISBN | ✔ 1/1 | Matbaa adı/adres/sertifika no (TR) ve EN paperback ISBN yazar kararı; girilince assemble + dizgi + check. |
| R082 | Şekil puntosu dizgi ölçeğinde ≥ 6,5 pt | ✔ 4/4 | %100 ölçekte fiziksel prova (matbaa provası / KDP proof copy). |
| R084 | Üretim ölçüsü: kutular ve teslim notu | ✔ 4/4 | Kâğıt/cilt/sırt kalınlığının matbaa tarafından yazılı onayı; KDP seçilen kâğıt/renkle kapak şablonu kabulü. |
| R085 | Teslim notu: font gömme ve alt küme | ✔ 3/3 | Bağımsız preflight (R080 ile). |
| R089 | Formül dizgisi: terim ortasından satır kırımı yok | ✔ 3/3 | yok |
| R095 | Yazım birliği: başlıklarda vs yok; bozuk cümleler | ✔ 3/3 | yok |
| R097 | Sözlük–bölüm anlam eşliği | ✔ 5/5 | yok |
| R098 | Kaynakça: AI Act sürümü, Turing 1936/1937 | ✔ 3/3 | yok |
| R099 | EPUB: alt metin, okuma sırası, şekil verisi eşliği | ✔ 8/8 | Gerçek ekran okuyucu (VoiceOver/TalkBack) ve fiziksel Kindle cihaz testi: yazar (Kindle Previewer 4 dönüşümü yapıldı). |

## Kayıt kayıt

### R002 · İnsan/makine karşılaştırması: çubuklar temsili

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `Atlas-Kitap.dc.html:186`; `Atlas-Kitap-EN.dc.html:186`.

**Ek dosyalar:** Atlas-Kitap.dc.html (zekâ şablonu); Atlas-Kitap-EN.dc.html (zekâ şablonu).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| dijital TR şablonda kalıcı uyarı (her modda, neOluyor dışında) |  | true | ✔ |
| dijital EN şablonda kalıcı uyarı |  | true | ✔ |
| derlenmiş web (dist/web) TR/EN |  | var | ✔ |
| var: temsili — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: illustrative — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| tarayıcı (dist/web, TR ve EN): uyarı zekâ bölümünde görünür |  | TR #m=1&s=1 ve EN #m=1&s=1 sayfa metninde bulundu (Browser pane, 2026-10-01) | ✔ |

### R004 · Turing makinesi: özel/evrensel, hesaplanabilirlik

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `Atlas-Kitap.dc.html:1127`; `print/src/tr/arka/sozluk.md:213`; `print/src/en/back/glossary.md:237`.

**Ek dosyalar:** Atlas-Kitap.dc.html (Turing basit metni); print/src/tr/arka/sozluk.md; print/src/en/back/glossary.md.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: prensipte her hesabı yapabilir / Her hesap bu makine — TR dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: algoritmaya dökülebilen her hesabı / yalnızca sayıya 1 ekleyen — TR dijital | her kanalda var | hepsinde var | ✔ |
| var: Hesaplanamayan problemler de vardır — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: Some problems are not computable at all — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| sözlük kaynak TR/EN: evrensel makine + hesaplanabilir |  | kaynakta var | ✔ |

### R007 · AGI ile bilincin ayrılması; dar YZ tanımı

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M01-zeka-ve-makineler.md:242`; `print/src/en/M01-minds-and-machines.md:242`; `print/src/tr/cevaplar/M01.md:16`; `print/src/en/answers/M01.md:16`; `print/src/tr/arka/sozluk.md:51`; `print/src/en/back/glossary.md:171`; `Atlas-Kitap.dc.html:1151`; `Atlas-Kitap-EN.dc.html:1151`.

**Ek dosyalar:** print/src/{tr,en}/M01 (Şekil 1.5 Ne oluyor); print/src/tr/cevaplar/M01.md; print/src/en/answers/M01.md; sozluk.md / glossary.md (Dar YZ); Atlas-Kitap(-EN).dc.html.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: eğitildiği işin dışına çıkamaz / Eğitildiği işlerin dışına çıkamayan / dar YZ tek bir işte iyidir / o işin dışına çıkamaz — TR PDF, TR dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| yok: None of them can step outside the job / cannot step outside the jobs it was trained for / narrow AI is good at one job / excellent at one job / whether it can step outside the jobs — EN PDF, EPUB, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: insan düzeyinde alanlar arası genel öğrenme — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: human-level general learning — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |
| dijital bilinç kartı ayrı kategori (cat bilinc) |  | true | ✔ |

### R012 · Örnek olma (instance-of) ile alt sınıf (subclass-of)

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M02-kurallarin-cagi.md:34`; `print/src/en/M02-the-age-of-rules.md:34`; `print/figures/gen/M02.mjs:74`; `Atlas-Kitap.dc.html:1876`.

**Ek dosyalar:** print/src/{tr,en}/M02 (Şekil 2.1 Kurulum, Adım adım, teknik, Ne oluyor); print/figures/gen/M02.mjs, strings/M02.mjs; Atlas-Kitap(-EN).dc.html (chain).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: Tekir'in kendisi Memeli mi / Is Tom himself a Mammal — TR PDF, EN PDF, EPUB, TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| Şekil 2.1 SVG iki ok etiketi |  | {"tr": [true, true], "en": [true, true]} | ✔ |
| dijital zincir: ilk bağ örneği, sonrakiler alt sınıfı |  | kodda var | ✔ |
| var: instance-of / subclass-of — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: instance of / subclass of — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |

### R018 · Sayısal çıktı her zaman regresyon değil

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/arka/sozluk.md (ifade bulunamadı: sayıyla kodlanmış)`; `print/src/en/back/glossary.md (ifade bulunamadı: numerically coded)`.

**Ek dosyalar:** print/src/tr/arka/sozluk.md (Etiket); print/src/en/back/glossary.md (Label).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: Etiket kategorikse sınıflandırma, sayısalsa regresyon / a numerical one a regression task — TR PDF, EN PDF, EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: Kategoriler sayıyla kodlanabilir — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: Categories can be coded as numbers — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |

### R024 · Model uyumu: doğrulama verisi ve eğitim yöntemi

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M03-makineler-nasil-ogrenir.md:255`; `print/src/tr/M03-makineler-nasil-ogrenir.md:258`; `print/src/en/M03-how-machines-learn.md:252`; `print/src/tr/cevaplar/M03.md:21`; `print/src/en/answers/M03.md:21`.

**Ek dosyalar:** print/src/{tr,en}/M03 (Şekil 3.6 adım 1, ayrılan nokta denetimi); cevaplar/M03, answers/M03 (2).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| dokuz nokta EKK (bağımsız hesap) | y ≈ 3.09 − 0.16x | y = 3.0917 -0.1583x | ✔ |
| yedi nokta EKK (x = 5 ve 7 ayrılır) + tahmin/hata | y ≈ 3.06 − 0.17x; 2.19/1.85; 0.51/0.45 | y = 3.0606 -0.1735x; x=5: ŷ=2.19, hata=0.51; x=7: ŷ=1.85, hata=0.45 | ✔ |
| var: 3.06 − 0.17x / 3.09 − 0.16x — TR PDF, EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| var: en küçük kareler — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: least squares — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |

### R031 · RNN çubukları: ∣h∣, renk ve işaret

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M04-yapay-beyin.md:240`; `print/src/en/M04-the-artificial-brain.md:232`.

**Ek dosyalar:** print/src/{tr,en}/M04 (Şekil 4.5 Kurulum).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| var: /h/ / hep yukarı doğru çizilir — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: /h/ / always grows upward — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| var: h₀ = 0 — TR PDF, EN PDF | her kanalda var | hepsinde var | ✔ |
| yok: artılar yukarı / eksiler aşağı / positives up / negatives down — TR PDF, EN PDF, EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |

### R033 · Üretken YZ tek buluş değil; GAN geçişi

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M05-bugunun-yapay-zekasi.md:9`; `Atlas-Kitap.dc.html:1371`.

**Ek dosyalar:** print/src/{tr,en}/M05 (giriş); Atlas-Kitap(-EN).dc.html (5. modül açılışı).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: Şimdiye dek makineler hep tanıyan taraftaydı / Until now, machines stayed on the recognizing side — TR PDF, EN PDF, EPUB, TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: GAN — TR PDF, EN PDF | her kanalda var | hepsinde var | ✔ |

### R037 · Nedensel maske kendi konumunu içerir

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M05-bugunun-yapay-zekasi.md:144`; `print/src/en/M05-today-s-ai.md:142`; `print/src/tr/arka/sozluk.md (ifade bulunamadı: kendisini ve kendinden öncekil)`.

**Ek dosyalar:** print/src/{tr,en}/M05 (5.4 metin, teknik); sozluk.md / glossary.md (Transformer); Atlas-Kitap(-EN).dc.html (dikkat teknik).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| var: kendisini ve kendinden öncekileri — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: sees itself and the — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| var: kendisini ve kendinden önceki konumları görür — TR dijital | her kanalda var | hepsinde var | ✔ |
| var: each position sees itself and the positions before it — EN dijital | her kanalda var | hepsinde var | ✔ |
| yok: her konum yalnız kendinden öncekileri görür / only the positions before it — TR PDF, EN PDF, EPUB, TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |

### R040 · Sıcaklıklı örnekleme: CDF tam değerden tek yuvarlama

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M05-bugunun-yapay-zekasi.md:194`; `print/src/en/M05-today-s-ai.md:190`; `print/src/tr/cevaplar/M05.md:13`.

**Ek dosyalar:** print/src/{tr,en}/M05 (Şekil 5.4 tablo + adım 2); cevaplar/M05, answers/M05.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| bağımsız hesap (z = ln p, softmax(z/1.5)) |  | ["0.36 · 0.64 · 0.84 · 1.00", "0.34 · 0.62 · 0.84 · 1.00", "0.41 · 0.67 · 0.86 · 1.00"] | ✔ |
| var: 0.36 · 0.64 · 0.84 · 1.00 / 0.34 · 0.62 · 0.84 · 1.00 / 0.41 · 0.67 · 0.86 · 1.00 — TR PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| EN PDF: her satırın birikimli toplamları sırayla aynı sayfada (dar hücrede sarılan son değer araya giren hücrelerden sonra gelebilir) |  | ["0.36 · 0.64 · 0.84 · 1.00", "0.34 · 0.62 · 0.84 · 1.00", "0.41 · 0.67 · 0.86 · 1.00"] | ✔ |
| yok: 0.34 · 0.63 · 0.85 — TR PDF, EN PDF, EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |

### R041 · Ham model genellemesi örneğe bağlandı

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M05-bugunun-yapay-zekasi.md:241`; `print/figures/strings/M05.mjs:58`; `Atlas-Kitap.dc.html:2311`.

**Ek dosyalar:** print/src/{tr,en}/M05 (Şekil 5.5 tablo notu, adım 1); print/figures/strings/M05.mjs (train note); Atlas-Kitap(-EN).dc.html (train stage notu).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: soruyu cevaplamaz, metni sürdürür / it doesn't answer the question — TR PDF, EN PDF, EPUB, TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: Bu örnekte ham model — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: In this example the raw model — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |

### R043 · Bağlam penceresi: kelime/token birimi, hatırlama

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M05-bugunun-yapay-zekasi.md:339`; `print/src/en/M05-today-s-ai.md:327`; `Atlas-Kitap.dc.html:2358`; `Atlas-Kitap-EN.dc.html:2358`.

**Ek dosyalar:** print/src/{tr,en}/M05 (Şekil 5.7 adım 1, teknik); Atlas-Kitap(-EN).dc.html (ctx durum satırı).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: bu gösterim son N token / this illustration keeps the last N tokens / Pencere dolana kadar her şey hatırlanıyor / Everything is remembered until it fills — TR PDF, EN PDF, EPUB, TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: son 8 kelimeyi tutan — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: keeps the last 8 words — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |
| var: pencerede olmak, modelin her ayrıntıyı kullanacağı anlamına gelmez — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: real applications may raise an error — EN dijital | her kanalda var | hepsinde var | ✔ |

### R050 · Grounding/fallback/guardrails: dizin ve sözlük eşliği

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/arka/dizin-terimler.yaml:119`; `print/src/en/back/index-terms.yaml:128`; `print/src/tr/arka/sozluk.md:102`.

**Ek dosyalar:** print/src/tr/arka/dizin-terimler.yaml; print/src/en/back/index-terms.yaml; sozluk.md / glossary.md.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR PDF dizininde üç giriş (sayfa numaralı) |  | {"Kaynaklarla temellendirme": true, "Yedek yönteme geçiş": true, "Koruyucu kontroller": true} | ✔ |
| EN PDF dizininde üç giriş |  | {"Fallback": true, "Grounding": true, "Guardrails": true} | ✔ |
| var: Kaynaklarla temellendirme (grounding) / Yedek yönteme geçiş (fallback) / Koruyucu kontroller (guardrails) — TR PDF | her kanalda var | hepsinde var | ✔ |

### R053 · SHAP: itiraz hedefi ve nedensellik

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M07-yapay-zeka-ve-toplum.md:99`; `print/src/tr/cevaplar/M07.md:7`; `print/src/en/answers/M07.md:7`.

**Ek dosyalar:** print/src/{tr,en}/M07 (Şekil 7.2 adım 2); cevaplar/M07, answers/M07 (1).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: itiraz edecekse en büyük kaleme / appeal the largest item / hangi etkeni düzeltince ne olacağını görürsün / which factor to fix and what happens — TR PDF, EN PDF, EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: kararın gerçekte hangi gerekçeye dayandığını — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: what the decision actually rested on — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| var: garanti etmez — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: do not guarantee how — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| aritmetik +32 − 46 + 18 − 12 | -8 | -8 | ✔ |

### R055 · Deepfake: olay, köken ve bağımsız kanal ayrı puanlanır

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `Atlas-Kitap.dc.html:2516`; `Atlas-Kitap.dc.html:1073`; `Atlas-Kitap-EN.dc.html:2516`.

**Ek dosyalar:** Atlas-Kitap(-EN).dc.html (df şablonu + mantık).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR: 4 vaka; her vakada olay/köken cevabı ve tam bir doğru kanal |  | [[["check"], ["trace"], 1], [["check"], ["trace", "unk"], 1], [["yes"], ["unk"], 1], [["check"], ["trace"], 1]] | ✔ |
| EN: 4 vaka; aynı yapı |  | [[["check"], ["trace"], 1], [["check"], ["trace", "unk"], 1], [["yes"], ["unk"], 1], [["check"], ["trace"], 1]] | ✔ |
| üç ayrı puan (dfScore e/o/c) ve sayaç metni |  | kodda var | ✔ |
| tarayıcı testi (TR, vaka 1) |  | ✓ Olay · ✓ Köken · ○ Kanal (önerilen gösterildi); sayaç "eşleşen: olay 1 · köken 1 · kanal 0" | ✔ |

### R056 · AI Act: amaç/aktör/madde, geçişler, roller

**Durum:** testler geçti; dış koşul açık: Hukuki metin birincil kaynakla eşlendi (EUR-Lex 2026/1744, konsolide 27.07.2026); hukukçu onayı yazara önerilir.

**Değişen kaynak (güncel satır):** `print/src/tr/M07-yapay-zeka-ve-toplum.md:198`; `print/src/tr/M07-yapay-zeka-ve-toplum.md:200`; `print/src/en/M07-ai-and-society.md:196`; `Atlas-Kitap.dc.html:2552`; `print/src/tr/cevaplar/M07.md:15`.

**Ek dosyalar:** print/src/{tr,en}/M07 (hukuk paragrafı → iki paragraf); cevaplar/M07, answers/M07 (7.4); Atlas-Kitap(-EN).dc.html (reg demo gerekçeleri + teknik).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| dijital TR: 6 kullanımın her birinde gerekçe (amaç + madde/ek) |  | 6 | ✔ |
| dijital EN: 6 gerekçe |  | 6 | ✔ |
| var: 111(4) / 2 Aralık 2026 / 2 Aralık 2027 / 2 Ağustos 2028 / 5(1)(ba) / 6(3) / 5(1)(h) / finansal dolandırıcılık / uygulayıcı — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: 111(4) / 2 December 2026 / 2 December 2027 / 2 August 2028 / 5(1)(ba) / 6(3) / 5(1)(h) / financial-fraud / deployer — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |
| yok: etkilemeyenler — TR PDF | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| yok: the ones that do not affect — EN PDF, EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |

### R057 · GDPR ve KVKK ayrı koşullar (dijital)

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `Atlas-Kitap.dc.html:1513`; `Atlas-Kitap-EN.dc.html:1513`.

**Ek dosyalar:** Atlas-Kitap(-EN).dc.html (reg teknik +GDPR/KVKK paragrafları).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| var: GDPR'de rıza tek işleme dayanağı değildir / 6698 sayılı KVKK — TR dijital, TR PDF | her kanalda var | hepsinde var | ✔ |
| var: Under GDPR, consent is not the only basis / KVKK — EN dijital, EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |

### R059 · Turing testi: model, istem, süre, düzen

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M08-felsefe-ve-gelecek.md:53`; `print/src/en/M08-philosophy-and-the-future.md:55`; `Atlas-Kitap.dc.html:1542`.

**Ek dosyalar:** print/src/{tr,en}/M08 (8.2 teknik); Atlas-Kitap(-EN).dc.html; kaynakca.md / bibliography.md.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| var: Jones ve Bergen, 2025 / beşer dakikalık / GPT-4.5 / yüzde 73 / LLaMa-3.1-405B / GPT-4o — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: Jones and Bergen, 2025 / five-minute / GPT-4.5 / 73 percent / LLaMa-3.1-405B / GPT-4o — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |

### R069 · Sabit ağırlık ≠ bağlam içi uyum yokluğu; M01/M08 tutarlılığı

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/M08-felsefe-ve-gelecek.md:142`; `print/src/en/M08-philosophy-and-the-future.md:140`; `print/src/tr/M08-felsefe-ve-gelecek.md:123`; `Atlas-Kitap.dc.html:1559`; `Atlas-Kitap-EN.dc.html:1559`.

**Ek dosyalar:** print/src/{tr,en}/M08 (8.4 basit, Ne oluyor, kenar notu); cevaplar/M01, answers/M01; Atlas-Kitap(-EN).dc.html (ufuk).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| yok: eğitildiği işin dışına çıkamaz / Eğitildiği işlerin dışına çıkamayan / dar YZ tek bir işte iyidir / o işin dışına çıkamaz / eğitildiği alanın dışına çıkamaz — TR PDF, TR dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| yok: None of them can step outside the job / cannot step outside the jobs it was trained for / narrow AI is good at one job / excellent at one job / whether it can step outside the jobs / cannot step outside what it was trained on — EN PDF, EPUB, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: bağlam içi uyum — TR PDF | her kanalda var | hepsinde var | ✔ |
| var: in-context adaptation — EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| var: belirli görevlerde iyidir — TR PDF, TR dijital | her kanalda var | hepsinde var | ✔ |
| var: good at particular tasks — EN PDF, EPUB, EN dijital | her kanalda var | hepsinde var | ✔ |

### R071 · Tablolar: başlık tekrarı, kısa tablo/tek satır bölünmez

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/typeset/typeset.py:404`; `print/typeset/typeset.py:409`; `print/typeset/hooks.js:109`; `print/typeset/check.sh:52`.

**Ek dosyalar:** print/typeset/typeset.py (table_class, last_row_keep: ikinci ve son veri satırı); print/typeset/hooks.js (sayaçlar); print/typeset/check.sh (kapı).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR Keywords: kısa tablo bölünmesi 0, tek satır parça 0, başlık tekrarı > 0 |  | {"tablo-kucuk-bolunen": "0", "tablo-tek-satir": "0", "thead-tekrar": "13"} | ✔ |
| EN Keywords: kısa tablo bölünmesi 0, tek satır parça 0, başlık tekrarı > 0 |  | {"tablo-kucuk-bolunen": "0", "tablo-tek-satir": "0", "thead-tekrar": "17"} | ✔ |

### R073 · Şekil etiketi çakışma/kesilme

**Durum:** testler geçti; dış koşul açık: R082 fiziksel prova ayrı (yazar/matbaa).

**Değişen kaynak (güncel satır):** `print/figures/check_fig_geom.mjs:2`; `print/figures/gen/M03.mjs:201`; `print/figures/gen/M03.mjs:228`; `print/figures/gen/M04.mjs:130`; `print/figures/gen/M07.mjs:75`; `print/figures/gen/M07.mjs:170`; `print/figures/gen/M08.mjs:91`; `print/figures/gen/M02.mjs:152`.

**Ek dosyalar:** print/figures/check_fig_geom.mjs (yeni denetim); M02.mjs (2.2 öneri şeridi); M03.mjs (3.3 gizli satır etiketleri kaldırıldı, 3.4 ve 3.6 başlık payı, 3.5 etiket yerleşimi); M04.mjs (4.1 iki satır, 4.3 hedef etiketi, 4.6 P(sahte); EN "x/64 match"); M05.mjs (embed hale); M07.mjs (7.2 iki satır etiket + alt not aralığı, 7.4 kart genişliği); M08.mjs (8.2 kural satırı).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| check_i18n temiz |  | temiz | ✔ |
| 90 şekil geometri denetimi (gerçek fontlarla getBBox: kenar payı ≥ 1 birim, metin kutuları binmiyor) |  | temiz: metin kutuları kenara taşmıyor ve birbirine binmiyor | ✔ |
| görsel tarama: TR/EN 2.1, 3.5, 4.1, 4.4, 4.6, 5.2, 6.2, 7.3, 7.4, 8.2 (dizgi ölçeğinde render) |  | 64 | ✔ |

### R076 · Dizin hedefleri kavram bağlamında ve aynı sayfada

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/assemble.py:191`; `print/typeset/print.css:32`; `print/src/tr/arka/dizin-terimler.yaml:97`; `print/src/en/back/index-terms.yaml:37`; `print/src/en/back/index-terms.yaml:17`.

**Ek dosyalar:** print/assemble.py (IXANCHOR{aid|len}, ix_bind, tr_key); print/typeset/print.css (span.ixw); index-terms.yaml (Clustering!hariç).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR dizin "AlexNet": her hedef sayfada terim tam geçiyor |  | {"82": ["AlexNet", "AlexNet"], "97": ["AlexNet", "AlexNet"]} | ✔ |
| TR dizin "Yapay sinir ağı": her hedef sayfada terim tam geçiyor |  | {"14": ["sinir ağı"], "82": ["sinir ağı", "sinir ağları"], "131": ["sinir ağı"]} | ✔ |
| EN dizin "Clustering": her hedef sayfada terim tam geçiyor |  | {"69": ["Clustering"], "72": ["Clustering", "clusters"], "84": ["Clustering"]} | ✔ |
| EN dizin "Embedding": her hedef sayfada terim tam geçiyor |  | {"109": ["Embedding"], "119": ["Embedding", "embedding space"], "125": ["Embedding", "embeddings"], "143": ["Embedding"], "148": ["Embedding"], "149": ["Embedding", "embedding space"], "164": ["Embedding"]} | ✔ |
| EN dizin "Orchestration": her hedef sayfada terim tam geçiyor |  | {"154": ["Orchestration"], "168": ["Orchestration"], "169": ["Orchestration"], "179": ["Orchestration"]} | ✔ |
| dizin sözcük grubu bölünmez (span.ixw) TR/EN |  | {"tr": "271", "en": "341"} | ✔ |

### R079 · EAN-13: modül, normal ve koruma çubuğu

**Durum:** testler geçti; dış koşul açık: Basılı provada ISO/IEC 15416 doğrulayıcı (verifier) ölçümü: matbaa/yazar.

**Değişen kaynak (güncel satır):** `print/kapak/kapak.mjs:202`.

**Ek dosyalar:** print/kapak/kapak.mjs (JsBarcode height 139, fontSize 14, textMargin 3).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| sayı ve kontrol hanesi |  | 9786250052112 | ✔ |
| X (modül) mm | ≈ 0.330 (38 mm / 115 modül, %100 büyütmede 0.33) | 0.3363 | ✔ |
| normal çubuk ≥ 22,85 mm (%100: 22,85) |  | 23.372 | ✔ |
| koruma uzaması = 5X | 5.000 | 5.0 | ✔ |

### R080 · Renk profili ve bağımsız preflight

**Durum:** testler geçti; dış koşul açık: Matbaanın yazılı ICC kabulü + aynı hash üzerinde bağımsız PDF/X preflight raporu (Acrobat/callas). ICC gelince: ICC=<profil> sh print/typeset/dizgi.sh ….

**Değişen kaynak (güncel satır):** `print/typeset/PDFX_def.ps:18`.

**Ek dosyalar:** print/typeset/PDFX_def.ps; dizgi.sh (ICC=).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| OutputCondition ASCII |  | OutputCondition(Ghostscript default CMYK \(printer profile pending\) | ✔ |

### R081 · Künye: matbaa bilgisi ve EN ISBN

**Durum:** testler geçti; dış koşul açık: Matbaa adı/adres/sertifika no (TR) ve EN paperback ISBN yazar kararı; girilince assemble + dizgi + check.

**Değişen kaynak (güncel satır):** `print/src/tr/on/00-kunye.md:27`; `print/src/en/front/00-title.md:17`.

**Ek dosyalar:** print/src/tr/on/00-kunye.md; print/src/en/front/00-title.md.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| kalan yer tutucular yalnız bunlar |  | {"tr": ["[matbaa adı, adres, sertifika no]"], "en": ["[ISBN]"]} | ✔ |

### R082 · Şekil puntosu dizgi ölçeğinde ≥ 6,5 pt

**Durum:** testler geçti; dış koşul açık: %100 ölçekte fiziksel prova (matbaa provası / KDP proof copy).

**Değişen kaynak (güncel satır):** `print/kitap/qa/pdf_fontsize.mjs:86`; `print/figures/lib.mjs:61`; `print/typeset/typeset.py:161`; `print/typeset/gapplan.py:103`; `print/typeset/hooks.js:109`; `print/typeset/check.sh:51`.

**Ek dosyalar:** print/figures/lib.mjs (MIN_TEXT); print/typeset/typeset.py (FIG_MIN_PT, data-minscale); print/typeset/gapplan.py (fig_min); print/typeset/hooks.js.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR dizgi (DOM, hooks): en küçük şekil metni | ≥ 6.58 (hedef 6.6; KDP şekil genişliği 120 mm ile 6.59) | 6.60 | ✔ |
| EN dizgi (DOM, hooks): en küçük şekil metni | ≥ 6.58 (hedef 6.6; KDP şekil genişliği 120 mm ile 6.59) | 6.59 | ✔ |
| TR PDF içerik akışı (Tf × Tm × CTM): 5,5–6,5 pt arası metin yok | band 0; en küçük ≥ 6.50 | {"normal_min_ge55": "6.555", "band_5_5_to_lim": 0, "sup_sub_lt55": 56, "type3_fallback": 142} | ✔ |
| EN PDF içerik akışı (Tf × Tm × CTM): 5,5–6,5 pt arası metin yok | band 0; en küçük ≥ 6.50 | {"normal_min_ge55": "6.510", "band_5_5_to_lim": 0, "sup_sub_lt55": 64, "type3_fallback": 140} | ✔ |

### R084 · Üretim ölçüsü: kutular ve teslim notu

**Durum:** testler geçti; dış koşul açık: Kâğıt/cilt/sırt kalınlığının matbaa tarafından yazılı onayı; KDP seçilen kâğıt/renkle kapak şablonu kabulü.

**Değişen kaynak (güncel satır):** `print/typeset/boxes.mjs:2`; `print/typeset/dizgi.sh:54`; `print/kapak/kapak.sh:14`; `print/teslim/guncelle.py:88`.

**Ek dosyalar:** print/typeset/boxes.mjs (kesin MediaBox/TrimBox); print/kapak/kapak.sh, kapak.mjs (size.txt); teslim notları.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| tr_pdf TrimBox = beklenen net ölçü (±0,01 mm) | 160 × 240 mm | {"MediaBox": [166.0, 245.999], "BleedBox": [166.0, 245.999], "TrimBox": [160.002, 240.002]} | ✔ |
| en_pdf TrimBox = beklenen net ölçü (±0,01 mm) | 152.4 × 228.6 mm | {"MediaBox": [158.75, 234.95], "BleedBox": [158.75, 234.95], "TrimBox": [152.4, 228.6]} | ✔ |
| tr_cover TrimBox = beklenen net ölçü (±0,01 mm) | 334.2 × 240 mm | {"MediaBox": [344.202, 250.0], "BleedBox": [344.202, 250.0], "TrimBox": [334.2, 240.002]} | ✔ |
| teslim notunda kapak net ölçüsü |  | 334,2 × 240,0 mm | ✔ |

### R085 · Teslim notu: font gömme ve alt küme

**Durum:** testler geçti; dış koşul açık: Bağımsız preflight (R080 ile).

**Değişen kaynak (güncel satır):** `print/teslim/matbaa/OKUBENI.md:7`; `print/kitap/matbaa/matbaa-notu.md:7`; `print/teslim/guncelle.py:22`.

**Ek dosyalar:** print/teslim/matbaa/OKUBENI.md; print/kitap/matbaa/matbaa-notu.md.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| pdffonts: hepsi gömülü |  | 59 font | ✔ |
| OKUBENI: Type 3 tam gömülü sayısı pdffonts ile aynı |  | {"pdffonts_type3": 15, "okubeni": ["15 Type 3 yedek font tam gömülü; pdffonts), tümü vektör, saydamlık yok "]} | ✔ |
| OKUBENI eski ifade yok ("tüm fontlar gömülü (alt küme)") |  | false | ✔ |

### R089 · Formül dizgisi: terim ortasından satır kırımı yok

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/typeset/typeset.py:419`; `print/typeset/print.css:31`.

**Ek dosyalar:** print/typeset/typeset.py (MATH_RX: √(…), f(…), (a − b), |a − b| → span.math); print/typeset/print.css (span.math nowrap).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR Öklid formülü tek satırda |  | ["√((x − xₘ)² + (y − yₘ)²). Aykırı için eşik baştan konur: en yakın"] | ✔ |
| TR: açık parantez/mutlak değer içinde biten satır yok |  | [] | ✔ |
| EN: açık parantez/mutlak değer içinde biten satır yok |  | [] | ✔ |

### R095 · Yazım birliği: başlıklarda vs yok; bozuk cümleler

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `Atlas-Kitap.dc.html:1206`; `Atlas-Kitap.dc.html:1356`; `Atlas-Kitap-EN.dc.html:1285`.

**Ek dosyalar:** Atlas-Kitap.dc.html (başlıklar); Atlas-Kitap-EN.dc.html (diverge cümlesi).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| TR dijital başlık/etiketlerde " vs " |  | [] | ✔ |
| yok: işe amen / diverge. the demo — TR dijital, EN dijital | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: sezgisiz ile sezgili / Üretici ile ayırt edici / Düzenliler ve dağınıklar (neats ve scruffies) — TR dijital | her kanalda var | hepsinde var | ✔ |

### R097 · Sözlük–bölüm anlam eşliği

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/arka/sozluk.md:77`; `print/src/en/back/glossary.md:149`; `print/src/tr/arka/sozluk.md:209`; `print/src/en/back/glossary.md:233`.

**Ek dosyalar:** print/src/tr/arka/sozluk.md; print/src/en/back/glossary.md.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| sözlük Turing: TR ve EN sözlükte yeni anlam |  | {"tr": true, "en": true} | ✔ |
| sözlük Transformer: TR ve EN sözlükte yeni anlam |  | {"tr": true, "en": true} | ✔ |
| sözlük Dar YZ: TR ve EN sözlükte yeni anlam |  | {"tr": true, "en": true} | ✔ |
| sözlük Etiket: TR ve EN sözlükte yeni anlam |  | {"tr": true, "en": true} | ✔ |
| yok: Etiket kategorikse sınıflandırma / a numerical one a regression task / yalnız kendinden öncekileri — TR PDF, EN PDF, EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |

### R098 · Kaynakça: AI Act sürümü, Turing 1936/1937

**Durum:** testler geçti; dış koşul yok.

**Değişen kaynak (güncel satır):** `print/src/tr/arka/kaynakca.md:27`; `print/src/en/back/bibliography.md:27`; `print/src/tr/arka/kaynakca.md:10`.

**Ek dosyalar:** print/src/tr/arka/kaynakca.md; print/src/en/back/bibliography.md.

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| var: 2024/1689/2026-07-27 / 2026/1744 — TR PDF, EN PDF, EPUB | her kanalda var | hepsinde var | ✔ |
| var: 1937 — TR PDF, EN PDF | her kanalda var | hepsinde var | ✔ |
| Crossref: 10.1112/plms/s2-42.1.230 yayın yılı |  | On Computable Numbers, with an Application to the Entscheidu [[1937]] s2-42 230-265 | ✔ |

### R099 · EPUB: alt metin, okuma sırası, şekil verisi eşliği

**Durum:** testler geçti; dış koşul açık: Gerçek ekran okuyucu (VoiceOver/TalkBack) ve fiziksel Kindle cihaz testi: yazar (Kindle Previewer 4 dönüşümü yapıldı).

**Değişen kaynak (güncel satır):** `print/kindle/kindle.py:35`; `print/kindle/kindle.py:101`; `print/kitap/qa/fig_coverage.py:34`; `print/src/en/M03-how-machines-learn.md:124`.

**Ek dosyalar:** print/kindle/kindle.py (alt, aria-describedby, Figure Data eki); print/kindle/kindle.css; print/src/en/M03 (Figure 3.3 dark).

| Test | Beklenen | Gözlenen | Sonuç |
|---|---|---|---|
| epubcheck |  | ["Messages: 0 fatals / 0 errors / 0 warnings / 0 infos"] | ✔ |
| 45 tanımlayıcı alt metin, ham etiket yok |  | 45 | ✔ |
| 45 görsel aria-describedby → Kurulum |  | 45 | ✔ |
| Figure Data eki: 45 metin sürümü, şekilden/şekle bağlantı |  | 45 | ✔ |
| şekil etiketlerinin metinde karşılığı (sayılar yuvarlama duyarlı) |  | {"kapsam_%": 98.3, "%80_alti": {}} | ✔ |
| yok: green group — EPUB | hiçbir kanalda yok | hiçbirinde yok | ✔ |
| var: dark group — EPUB | her kanalda var | hepsinde var | ✔ |
| Kindle Previewer 4 dönüşümü aynı EPUB üzerinde (Success, 0 hata, 0 kalite sorunu) |  | "AI-for-Everyone_epub","Supported","Success","0","0" | ✔ |

## Kanıt dosyaları

- `print/kitap/qa/dogrulama-33.json`: bütün testlerin ham sonucu, PDF Keywords sayaçları, sayfa kutuları, şekil kapsamı.
- `print/kitap/qa/sekil-tarama/`: dizgi ölçeğinde şekil renderları (TR 2.1, 3.5, 4.1, 4.4, 4.6, 5.2, 6.2, 8.2; EN eşdeğerleri).
- `print/kitap/qa/kanit.json`: genel üretim kanıtı (qa_evidence.py: QR 90/90, renk ayrımı, metin bütünlüğü, canlı adresler).
- `sh print/typeset/check.sh tr matbaa` ve `sh print/typeset/check.sh en kdp` çıktıları (bu rapordaki hash'lerle aynı dosyalar).

Bu rapor kitabın hiçbir hata içeremeyeceği garantisi ya da matbaa/KDP yayın onayı değildir; dış koşullar özet tablosunda açıkça listelidir.
