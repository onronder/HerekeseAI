# Herkes İçin Yapay Zekâ — Basılı Sürüm Analizi ve Yol Haritası

> Durum (2026-09-10): P0 onaylandı. P1 dışa aktarım aracı hazır: `python3 print/export.py` → `print/src/{tr,en}/`.
> P2 figürler tamam (45/45, TR+EN): `node print/figures/make.mjs` → `print/figures/out/{tr,en}/`; etiketler `print/figures/strings/`. QR: `cd print/qr && npx -y -p qrcode node make_qr.mjs tr`. Ayrıntı: `print/README.md`, `print/figures/FIGUR-KILAVUZU.md`.
> P3 ilk el yazması (yalnız TR) hazır: `python3 print/assemble.py` → `print/kitap/Herkes-Icin-Yapay-Zeka-TR.{md,html}`; yazım kuralları `print/YAZIM-KILAVUZU.md`. Yazar redaksiyonu bekliyor.

## Bağlam

Kitap bugün tek dosyalık interaktif bir web ürünü (`Atlas-Kitap.dc.html`, EN ikizi `Atlas-Kitap-EN.dc.html`). Değer önermesi "45 canlı demo"; YAYIN.md bunu açıkça yazıyor: interaktiviteyi öldüren format ana değeri siler. Basılı sürüm bu yüzden **aynı kitabın kâğıda çevrilmesi değil, aynı içeriğin yeniden yazılması** olmak zorunda. Animasyonun yaptığı işi (süreci zamanda göstermek) kâğıtta üç şey yapar: çok panelli çizim, sayılarla yürütülmüş örnek ve anlatan metin.

Bu belge, mevcut kaynağın ölçülmüş envanterinden yola çıkarak (a) neyin doğrudan taşınabileceğini, (b) neyin yeniden üretilmesi gerektiğini, (c) Basit/Teknik ayrımının kâğıtta nasıl kurulacağını ve (d) üretim hattını tanımlar.

---

## 1. Elimizde ne var (ölçülmüş)

Tüm içerik `Atlas-Kitap.dc.html:1071–1559` içindeki `modules()` dizisinde; TR/EN birebir paralel, bölüm id'leri aynı.

| Alan | TR karakter | Not |
|---|---|---|
| `basit` paragraflar (53 bölüm) | 25.8K | Tam, bağımsız metin |
| `teknik` paragraflar (53 bölüm) | 29.1K | Tam, bağımsız metin (basit'in üstüne eklenmiyor, **yerine geçiyor**) |
| `tip` kenar notu (53) | 8.5K | Moddan bağımsız |
| Demo "Ne oluyor?" basit / teknik (45+45) | 12.3K / 9.5K | Her demonun kavramsal özü burada |
| Demo başlık + ipucu | 4.9K | |
| Quiz (50 soru) | 6.4K | **Cevap anahtarı yok**: doğru = `opts[0]`, ekranda karıştırılıyor |
| Demo veri tabloları (`modules()` içinde) | 4.3K | 11 demo |
| **Demo içine gömülü öğretici metin (`renderVals()` içinde)** | ~7.9K | 34 demo; yalnız etkileşimden sonra görünür |
| Toplam | ~101K ≈ 17K kelime | Tek derinlik okuma yolu ≈ 58K karakter |

Bölüm yapısı: 8 modül, 53 düzyazı bölümü + 8 quiz = 61 bölüm (ilerleme.md "62" diyor; fark kapak).

Görsel varlık: **yok**. 45 demonun yalnız 7'si SVG; kalanı div/CSS ile çiziliyor. Basılabilir tek bir çizim, hazır figür, sözlük, kaynakça, dizin, `@media print`, EPUB/PDF hattı repo'da mevcut değil. Fontlar (`Instrument Serif`, `Work Sans`, `Space Mono`) `dist/fonts-cache/` altında binary olarak var; modül aksan renkleri (`acc`) tanımlı.

**Sayfa gerçeği:** 17K kelime, 16×24 cm'de ~300 kelime/sayfa ile ~60 sayfa eder. Bu, basılı kitap için ince. Kullanıcının öngörüsü doğru: animasyonun taşıdığı anlatım yükü metne dönünce **düzyazının 2–2,5 katına çıkması** gerekir. Hedef: 180–220 sayfa.

---

## 2. Basit / Teknik ayrımı kâğıtta nasıl kurulur

Üç seçenek değerlendirildi:

| Seçenek | Artı | Eksi |
|---|---|---|
| A. İki ayrı kitap (Basit / Teknik) | Her biri temiz akar | İki ISBN, iki baskı, ortak %60 içerik (figür, tip, quiz) çift basılır; markanın "aynı fikir, iki derinlik" vaadi kaybolur |
| B. **Tek kitap, iki katman (önerilen)** | Kapak kadranı metaforu aynen korunur; okur derinliği sayfada seçer; tek ürün | Sayfa tasarımı disiplin ister |
| C. Çift sütun paralel | Karşılaştırmalı okuma | Uzunluklar eşit değil; dar sütunlar figürlere yer bırakmaz |

**Öneri B — sayfa gramerı:**

1. **Ana akış = Basit metin.** Sayfanın omurgası; hikâye tonu, Instrument Serif başlık + Work Sans gövde, mevcut 620px ölçüye denk 11/16 pt.
2. **"Teknik Derinlik" kutuları.** Her bölümün sonunda (ya da figürden hemen sonra), modül aksan rengiyle tonlanmış zemin, Space Mono "TEKNİK ▸" başlık etiketi. İçeriği: `teknik` paragraflar + demonun teknik "Ne oluyor?" + formül/tablo. Okur atlayabilir; atlayınca akış bozulmaz. Bu, web'deki toggle'ın kâğıt karşılığı.
3. **Kenar notu** (`tip`) → dış marjda italik serif marjinalya. Web'deki "marjinalya rayı" kararı zaten kitap düzeni; aynen taşınır.
4. **Şekil bloğu** (her demo için, §3).
5. **Modül açılış sayfası**: aksan rengi tam sayfa, dev numara, tag, başlık, alt başlık (web'deki hero'nun kâğıt hâli).

Tutarlılık kuralı: Basit akış tek başına okunduğunda kitap eksiksiz olmalı. Teknik kutular hiçbir zaman Basit'in anlatmadığı bir kavramı ilk kez tanıtmaz; derinleştirir.

---

## 3. Animasyon yerine ne konur: "Şekil bloğu" şablonu

Her demo kâğıtta dört parçalı sabit bir bloğa dönüşür:

| Parça | Ne | Kaynak |
|---|---|---|
| **Şekil N.n** | Çizim/diyagram; süreç demolarında çok panelli "film şeridi" | Yeniden çizilir (§4) |
| **Kurulum** (2–4 cümle) | Okurun ekranda göreceği şeyin tarifi: "Altı kareli bir bant, üstünde okuyucu kafa…" | Yeni yazılır; `demo.hint` tohumdur |
| **Adım adım** (numaralı liste veya tablo) | Etkileşimin sayılarla yürütülmüş hâli: 5 → 6 için Turing makinesinin 7 adımı, 4 turluk gradyan inişinin x / L(x) / eğim tablosu | Yeni yazılır; `renderVals` içindeki dinamik caption ve verdict metinleri buraya erir |
| **Ne oluyor?** | Mevcut `neOluyorBasit` (ana akışta) + `neOluyor` (Teknik kutuda) | Doğrudan taşınır |
| **Kendin dene** | Kalem-kâğıt alıştırması ("73'ü ikili yaz", "yağmur+rüzgâr açıkken hangi kural ateşler?") + QR → canlı demo | Yeni yazılır; QR zaten YAYIN.md'de öngörülmüş |

Bu şablon "çok daha detaylı anlatım" ihtiyacını ölçülebilir kılar: her demo için ~250–400 kelime yeni metin (45 × ~320 ≈ 14K kelime). Bölüm giriş/geçiş metinleriyle birlikte düzyazı ~17K → ~35K kelimeye çıkar; figür ve ön/arka bölümlerle 190–210 sayfa.

---

## 4. 45 demonun basılı karşılığı (tam envanter)

Tip sınıflaması: **S** = statik seçim→sonuç (tek figür/tablo yeter), **A** = adımlı dizi (film şeridi), **Z** = zamanlayıcıya bağlı (kâğıtta mutlaka çok panel). Metin yükü: düşük / orta / **yüksek** (demoya gömülü içerik düzyazıya taşınacak).

### M1 Zekâ ve Makineler (`#2a3bb0`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| intelligence | S | 8 zekâ türü tablosu: tür, tanım, "YZ'de düzey" çubuğu (Güçlü/Orta/Zayıf) | düşük |
| binary | S | 8 kutu ağırlık şeması (128…1) + 3 çözülmüş örnek (73, 5, 255) | düşük |
| turing | Z | **Film şeridi**: 5→6 için ~7 kare; her karede bant, kafa oku, durum etiketi; `tStory` 3 caption'ı adım anlatısına dönüşür | **yüksek** |
| cycle | Z | Getir→Yürüt→Yaz döngü diyagramı + Bellek/İşlemci/G-Ç parça kutuları | orta |
| classify (dar/AGI) | S | 5 madde tablosu: doğru sütun işaretli + tek cümle gerekçe (gerekçeler yeni) | orta |
| exp | A | Katlanma tablosu (0…26 yıl) + doğrusal ve log ölçekli iki mini grafik | düşük |

### M2 Kuralların Çağı (`#bb4d17`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| chain | A | is-a ağacı; 4 sorgudan 2'sinin zinciri boyalı, biri "bilinmiyor" örneği | orta |
| expert | S | 5 kural listesi + 3 senaryo tablosu (olgular → ateşlenen kurallar → öneri); R5'in zincirlenmesi ayrı vurgu | orta |
| grid | Z | Yan yana 2 ızgara (BFS taranmış hücreler numaralı / açgözlü), sayaçlar altta | orta |
| markov | Z | Durum diyagramı (3 düğüm, olasılıklı oklar) + geçiş matrisi + örnek 7 günlük zincir + uzun-vade dağılım çubuğu; rastgelelik metinle açıklanır | **yüksek** |
| classify (neat/scruffy) | S | Tablo | düşük |

### M3 Makineler Nasıl Öğrenir (`#1d6149`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| spam | S | 4 e-posta × 3 özellik ✓/○ + etiket sütunu (özellik matrisi) | düşük |
| classify (3 tür) | S | Tablo | düşük |
| scatter | A | 2 panel: regresyon doğrusu / sınıflandırma sınırı | düşük |
| kmeans | A | 2 panel: önce (renksiz) / sonra (merkezlere atanmış, aykırı halkalı) | düşük |
| descent | Z | 2 panel: düşük η'de 5 adım iz / yüksek η'de salınım + sayısal tablo (adım, x, L(x), eğim) | **yüksek** |
| modelfit | S | 3 panel (eksik/iyi/aşırı) + verdict altyazıları | düşük |

### M4 Yapay Beyin (`#3155c4`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| neuron | S | Nöron şeması (x,w,b,z,φ) + 2 hesaplama tablosu (sigmoid / ReLU) | orta |
| ffnet | A | 2 panel: iki farklı girdi için aktivasyon parlaklığı | orta |
| backprop | A | İleri/geri ok akış diyagramı + 4 turluk çubuk şeridi (hata küçülür) | orta |
| conv | A | 7×7 görüntü + 3×3 filtre + 5×5 harita, 3 konum; bir hücrenin çarpım-toplamı açık yazılır | **yüksek** |
| rnn | A | Açılmış (unrolled) 4 zaman adımı diyagramı, paylaşılan ağırlık vurgusu | orta |
| gan | A | Film şeridi: tur 1/3/5/8 piksel ızgarası + D olasılığı | orta |

### M5 Bugünün Yapay Zekâsı (`#7a3fb0`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| token | S | 3 cümlenin token bölünmüşü (## işaretli) + sayım | düşük |
| embed | S | 2B anlam haritası, kümeler etiketli + en yakın komşu tablosu | orta |
| attn | S | Dikkat ısı matrisi (token × token), "o → kedi" vurgulu | orta |
| generate | A | 2 film şeridi (düşük / yüksek sıcaklık): 3 adım × 4 aday çubuğu | orta |
| train | S | 3 aşama tablosu: veri / öğrendiği / örnek çıktı | düşük |
| diffuse | A | Film şeridi: adım 0/2/4/6/8 ızgara; ileri (gürültüleme) ve ters (temizleme) okları | **yüksek** |
| ctx | A | 3 mini panel: boş / dolmakta / taşma (en eski soluk) | orta |

### M6 YZ'yi Kullanmak ve İnşa Etmek (`#2a7d86`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| prompt | S | 4 parça yığılmış istem şeması + kalite tablosu (0→4 parça; düşük/orta/yüksek çıktı örnekleri `renderVals`'tan) | **yüksek** |
| rag | S | Akış diyagramı (soru→getirme→cevap) + 3 soru × RAG açık/kapalı tablosu, kaynak parçaları basılı | **yüksek** |
| agent | A | ReAct döngü diyagramı + pizza görevinin adım listesi (düşünce/araç/gözlem) | **yüksek** |
| arch | S | 5 katman blok diyagramı + rol açıklamaları | orta |
| sector | S | 6 alan × 3 örnek tablosu | düşük |

### M7 Yapay Zekâ ve Toplum (`#b03a52`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| bias | S | 3 önyargı düzeyi (0/50/100) için çift çubuk + parite farkı | orta |
| explain | S | 2 başvuru için işaretli katkı (waterfall) çubukları | orta |
| df | A | 4 vaka kutusu; cevap + ipucu bölüm sonunda ("Cevaplar") | **yüksek** |
| reg | S | Risk piramidi (4 kademe) + 6 kullanım tablosu; cevaplar bölüm sonunda | **yüksek** |
| align | S | 3 hedef → davranış → ders tablosu | orta |

### M8 Felsefe ve Gelecek (`#9a5a1f`)
| Demo | Tip | Basılı karşılık | Metin |
|---|---|---|---|
| tur | A | 4 yazışma balonu; cevap + "ele veren şey" bölüm sonunda | **yüksek** |
| chineseroom | A | Oda şeması (giren sembol → kural kitabı → çıkan sembol) + 3 sembol çifti tablosu | orta |
| capability | S | 3 basamak merdiven diyagramı + tanım metinleri (`renderVals` 2568–2570 düzyazıya) | **yüksek** |
| singularity | S | 3 eğri tek grafikte, etiketli + not metinleri | düşük |
| responsibility | S | 3 senaryo × 4 taraf matrisi, doğru taraf işaretli + gerekçe | **yüksek** |

Özet: 23 statik, 17 adımlı, 5 zamanlayıcılı. Çok panelli figür gerektiren demo sayısı ~15; toplam panel/figür sayısı ~70. Metin yükü "yüksek" 14 demo; bunlar `renderVals()` içindeki ~7.9K karakterin sahibi ve öncelik sırası bunlardan başlar.

Ayrıca kavramsal metaforlar için **el çizimi illüstrasyon** (isteğe bağlı, ~8–10 adet): sisli vadi (gradyan), kalpazan-dedektif (GAN), Çince Oda, bant üstünde karınca (Turing), karlı TV (difüzyon), halının altına süpürülen çöp (hizalama), kısa süreli hafıza (bağlam penceresi). Bunlar veri taşımaz; ton verir.

---

## 5. Yeniden yazılacak / yeni yazılacak metin

1. **Demo içi içerik düzyazıya** (öncelik 1): `renderVals()` 1797–2622 arasındaki caption/verdict/veri metinleri (Turing adımları, difüzyon adım açıklamaları, prompt düşük/orta/yüksek çıktıları, RAG 3 kaynak parçası, ajan pizza adımları, mimari 5 rol, AI Act kademe kuralları, Turing testi yazışmaları, 3 yetenek kademesi tanımı, sorumluluk senaryoları). Basılı sürümde bunlar gizli kalamaz.
2. **Şekil bloğu metinleri** (Kurulum + Adım adım + Kendin dene) 45 demo için.
3. **Bölüm geçişleri**: web'de "İleri" tuşu bölümleri ayırıyor; kâğıtta her bölüm sonuna 1–2 cümlelik köprü.
4. **Modül sonu özeti** (yeni): 5–7 madde "Bu bölümden kalanlar". Basit modda 30+ kelimelik cümle yok kuralı korunur.
5. **Quiz**: seçenekler dışa aktarımda deterministik karıştırılır (mevcut `_order()` mantığı), **cevap anahtarı** arka bölüme; "Kendini sına" demoları (df, tur, reg, responsibility, 3 classify) da aynı anahtara.
6. **Arka bölümler** (tamamen yeni): Sözlük (jargon ilk-geçiş kuralı zaten uygulanmış; ~60 terim TR/EN), Kaynakça (metinde inline geçen Gardner 1983, Rumelhart 1986, Hochreiter 1997, AlexNet 2012, BPE/WordPiece, EU AI Act + eklenecekler), Dizin, Cevap anahtarı, "Canlı demolar" QR sayfası.
7. **Ön bölümler**: künye (ISBN 978-625-00-5299-0 basılı için **yeni ISBN** gerekir; mevcut dijital sürüme ait), "Bu kitabı nasıl okumalı" (Basit/Teknik katman açıklaması), içindekiler (web'deki editöryel TOC düzeni).

---

## 6. Üretim hattı (önerilen)

Kaynak `.dc.html` tek gerçek olmaya devam eder; basılı sürüm yeni bir çıktı hedefidir, `build.py` kalıbıyla aynı mantık.

```
Atlas-Kitap.dc.html ──(1) export ──▶ print/src/tr/M01.md … M08.md  (bölüm, basit, teknik, tip, neOluyor, quiz, demo verisi)
                                        │  (2) elle genişletme: şekil blokları, geçişler, özetler, arka bölümler
print/figures/*.svg ◀──(3) figür üretimi (node: modules() verisinden deterministik SVG; seçilen durumlar)
                                        ▼
                     (4) print/build_print.py ──▶ print/out/kitap-tr.html (@page CSS, fontlar gömülü)
                                        ▼
                     (5) Paged.js / Chromium print ──▶ PDF (prova) ──▶ matbaa için PDF/X (InDesign/Affinity son rötuş isteğe bağlı)
```

Kararlar ve gerekçeleri:
- **Kaynak formatı Markdown + YAML** (bölüm başına dosya): yazarın genişletme yapacağı yer; TR/EN paralel klasör. Export bir kez çalışır, sonra el yazımı kaynak olur; `.dc.html` değişirse diff raporlanır, üzerine yazılmaz.
- **Figürler kodla, SVG olarak**: 37 demo veri/durum güdümlü. Aynı `modules()` verisinden çizilirse TR/EN parite bedava, düzeltme tek yerden, vektör baskı kalitesi. Ekran görüntüsü kullanılmaz (UI kromu, düşük çözünürlük, ekran renkleri). El çizimi yalnız §4 sonundaki metafor illüstrasyonları için.
- **Dizgi HTML + CSS Paged Media**: fontlar, renk token'ları ve sayfa ölçüsü (620px gövde) zaten var; Paged.js ile sayfa numarası, koşan başlık, marjinalya, dipnot çözülür. InDesign'a geçiş gerekirse HTML → IDML değil, PDF üstünden son rötuş.
- **Ebat**: 16×24 cm (TR popüler bilim standardı; figürlere ve dış marj marjinalyasına yer var). Alternatif 13,5×21 sayfa sayısını %25 artırır, figürleri sıkıştırır.
- **Renk**: figürler renk kodlu (önyargı mavi/mor, is-a zinciri aksan, ısı matrisi). İki yol: (a) tam renkli iç, maliyet yüksek; (b) **siyah + tek aksan (ember `#e85d3a`) duotone**, modül rengi yalnız açılış sayfasında. Figür tasarımı baştan (b)'ye göre yapılırsa (a)'ya sonradan geçmek kolay; tersi zor. Öneri: (b) ile tasarla, matbaa teklifi sonrası karar.

---

## 7. Fazlar ve kaba iş yükü

| Faz | İş | Çıktı | Süre (tahmini) |
|---|---|---|---|
| P0 Karar | §2 katman modeli, ebat, renk, EN paralel mi | Bu belgenin onayı | — |
| P1 Export | `print/export.py`: modules() → md/yaml; cevap anahtarı; renderVals içi metinlerin listesi | print/src/tr, en | 1 gün |
| P2 Figür sistemi | SVG üretici + stil kılavuzu (çizgi kalınlığı, ızgara, etiket tipografisi) + 5 pilot figür (turing, descent, markov, conv, diffuse) | print/figures | 3–4 gün |
| P3 Yazım | 45 şekil bloğu + geçişler + özetler + arka bölümler (TR) | print/src/tr tamam | 3–4 hafta yazar işi |
| P4 Dizgi | build_print + Paged.js şablonu; modül açılışları, marjinalya, Teknik kutu stili | prova PDF | 4–5 gün |
| P5 Redaksiyon + prova | TDK denetimi (önceki kalıp kuralları yeniden koşulur), figür-metin eşleşmesi, cevap anahtarı doğrulaması, QR testleri | matbaa PDF/X | 1 hafta |
| P6 EN | P3–P5'in EN tekrarı (figürler etiket değişimiyle yeniden üretilir) | | P3'ün ~%60'ı |

Kritik yol P3 (yazım). P1–P2 bunu beklemeden başlar ve yazara "genişletilecek boşluklar" listesini verir.

---

## 8. Riskler ve açık kararlar

- **Metin hacmi**: 17K → ~35K kelime; ilk kitaplarda "detaylı anlatım" kolayca şişer. Şekil bloğu şablonunun kelime bütçesi (250–400) korunmalı.
- **Teknik kutuların akışı bölmesi**: kutu bir sayfayı aşarsa bölüm sonuna kayar; kural olarak kutu ≤ 1 sayfa, aşan içerik "Ek" bölümüne.
- **Quiz cevaplarının ilk seçenek olması**: export'ta karıştırma zorunlu; anahtar otomatik üretilir, elle yazılmaz.
- **ISBN**: basılı sürüm ayrı ISBN ister; künye ve yasal metinler (`store/yasal.html`) buna göre güncellenir.
- **Renk kararı** figür sisteminden önce verilmeli (§6).
- **Kapak kadranı**: kâğıtta çalışmaz; kapak arka yüzünde "iki derinlik" açıklaması + ön iç kapakta okuma kılavuzu ile karşılanır.
- **Gradyan inişi demosu metinle çelişiyor (P2 pilotunda bulundu):** `descentStep()` içinde "yüksek" η = 0.92; eğim 0.36·(x−5) olduğundan çarpan 0.33 kalır ve top hiç aşım yapmaz. Oysa Teknik "Ne oluyor?" salınım (aşım) anlatır. Basılı figür η = 4.6 ile gerçekten salınan izi çizer. Web demosunda da "yüksek" değerin ~4–5 aralığına çekilmesi önerilir (`Atlas-Kitap.dc.html:1623`, EN aynı satır).
- **Derin bağlantı (çözüldü 2026-09-28/29):** `support.js` `#m=N&s=K` okur; `/oku` hash'i kitaba enjekte eder. Basılı kitap QR'ları ise giriş istemeyen tek-demo sayfalarına gider: `/d/<slug>` (build.py `qr_variant`, `store/d/`, `qr-slugs.json`); yalnız o bölümün demosu + "Ne oluyor?", kitap metni yok. Kabul edilen sınır: 45 demo QR ile girişsiz açık.

---

## 9. Doğrulama (bitti demek için)

- `print/export.py` çıktısı: 61 bölüm, 45 demo, 50 quiz + 7 kendini-sına anahtarı; `renderVals` metin listesindeki her madde bir şekil bloğuna atanmış.
- Figür kontrol listesi: 45 demo × en az 1 figür, ~15 çok panelli; her figürün numarası metinde en az bir kez anılıyor.
- Prova PDF: sayfa sayısı 180–220; her modül açılışı sağ sayfa; Teknik kutu taşması 0; marjinalya gövdeyle hizalı.
- Basit-yalnız okuma testi: Teknik kutular kapatılarak (CSS sınıfı) üretilen PDF'te hiçbir kavram tanımsız kalmıyor.
- QR bağlantıları: her biri `#m=N&s=K` derin linkine gidiyor ve canlı sitede açılıyor.
- TR/EN: bölüm id ve figür sayıları birebir.
