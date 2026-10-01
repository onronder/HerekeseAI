# Uygulama kaydı — şekil ajanı (2026-10-01)

Kapsam: `print/figures/gen/M0N.mjs`, `print/figures/strings/M0N.mjs`, `print/figures/lib.mjs`, `print/figures/out/tr-baseline/`, yeni denetim `print/figures/check_fig_fonts.mjs`.
Üretim: `node print/figures/make.mjs tr` ve `en` hatasız; `node print/figures/check_i18n.mjs` → temiz; `node print/figures/check_fig_fonts.mjs all` → R082 listesindeki
sekiz şekil ✓ (en küçük metin ≥ 6.59 pt), kalan işaretler aşağıda. Değişen her TR/EN figürün PNG'si belge fontlarıyla (Work Sans / Space Mono, store/assets/fonts.css)
render edilip göz kontrolünden geçti: taşma/çakışma yok. Not: `print/figures/out/` (tr-baseline dahil) `.gitignore`'da; baseline güncellemesi diskte.

## Kayıt satırları

R087 | print/figures/gen/M01.mjs:67 | Şekil 1.1: "YZ: Güçlü · %90" etiketi çubuğun üstünde ayrı satıra alındı, çubuk kartın tam genişliğinde; kart yüksekliği 52 → 58. | uygulandı
R072 | print/figures/strings/M01.mjs:23,70 | Şekil 1.2: yönerge iki satır (TR "SAYIYI YAZ · SOLDAN SAĞA" / "SIĞIYORSA YAK, KALANLA DEVAM ET"; EN "WRITE A NUMBER · LEFT TO RIGHT" / "FITS? LIGHT IT, KEEP THE REST"); font küçültülmedi. | uygulandı
R072 | print/figures/gen/M01.mjs:116 | Yönerge dizisi satır satır basılır; alt tablo 9 pt aşağı kayar. | uygulandı
R006 | print/figures/gen/M01.mjs:142 | Şekil 1.4: üçüncü kare "3 · KAYDET / YAZ": Bellek tam vurgu, İşlemci (yazmaç) yarım vurgu, Giriş / Çıkış kesikli kutu; altında "Giriş / Çıkış yalnız çıkış talimatında"; .md tablosunun 3. satırı ve temsili-döngü notu eklendi. | uygulandı
R006 | print/figures/strings/M01.mjs:30,77 | Evre adı, aktif-parça satırı ("iş başında: yazmaç/Bellek" / "active: register/Memory"), G/Ç notu ve .md açıklaması iki dilde. | uygulandı
R007 | print/figures/gen/M01.mjs:185 | Şekil 1.5 (yalnız M01 demosu): sütun adları "Bugün kullanılan sistem" / "Varsayımsal sistem" (EN "In use today" / "Hypothetical"); 5. kart "Kendini fark eden, bilinçli bir YZ" altına "Bilinç sorusu (ayrı)" etiketi; işaret kutuları korundu (cevap anahtarı içerik ajanında). | uygulandı
R007 | print/figures/strings/M01.mjs:42,87 | agiCats ve consciousTag dizgileri. | uygulandı
R073 | print/figures/gen/M01.mjs:193 | Şekil 1.5 / 2.5 / 3.2 (ortak classify üreticisi): hücre ve başlık metni karakter sayısı yerine ölçülmüş genişlikle sarılır (lib wrapW); "deneme-yanılmayla" ve "…playing a game" sütun sınırını aşmıyor. | uygulandı
R073 | print/figures/gen/M02.mjs:139 | Şekil 2.2: "zincir"/"chain" rozeti kimlik sütununda R5'in altına ayrı satıra alındı; öneri metniyle ve "flip!" ile çakışma yok. | uygulandı
R073 | print/figures/gen/M02.mjs:155 | Şekil 2.2: üç-senaryo tablosunda öneri satırı sütun genişliğine göre sarılır, satır yüksekliği içeriğe göre (EN senaryo B iki satır). | uygulandı
R088 | print/figures/gen/M02.mjs:6 | Şekil 2.4: diyagram merkezi/yarıçapı (cy 78 → 96, R 46 → 50, r 15 → 18), yükseklik 150 → 156, matris x 172 → 180; güneşli öz-ilmek "70" görünür, "Yağmurlu/Rainy" daireye sığıyor; çizim ve matris aynı veri. | uygulandı
R017 | print/figures/strings/M03.mjs:10,52 | Şekil 3.1: 2. özellik adı "link veya şifre isteği" / "link or password request" (book.json "link / şifre isteği" yerine; dizin → ad override). | uygulandı
R017 | print/figures/gen/M03.mjs:103 | Özellik adı override okunur; e-posta satır yüksekliği içeriğe göre (sarma ölçülmüş genişlikle). | uygulandı
R073 | print/figures/gen/M03.mjs:36 | Şekil 3.5: adım numaraları nokta/eğri/ok/eksen yazısıyla çakışmayacak 8 yön × 3 yarıçap aday-konumla yerleşir, uzaktaysa ince çağrı çizgisi; η = 0.18 ve η = 4.6 verisi aynen korundu. | uygulandı
R024 | print/figures/strings/M03.mjs:37-38,79-80 | Şekil 3.6: orta panel etiketi "Daha düzgün temsili eğri" / "Smoother illustrative curve" (iki satır); hüküm metni "Temsili eğri: … veriden eğitilmedi, doğrulama hatası ölçülmedi." / EN karşılığı; .md başlık ve not. | uygulandı
R024 | print/figures/gen/M03.mjs:274 | Etiket/hüküm override'ları ve iki satırlı başlık yüksekliği. | uygulandı
R027 | print/figures/lib.mjs:9 | `DEMO` = print/kitap/qa/demo-data.json ortak yükleyici (bp43, rnn45, temp54). | uygulandı
R027 | print/figures/gen/M04.mjs:107 | Şekil 4.3: 9 kare bp43 turlarından (ŷ çubuk, "kayıp L 0.0384 … 0.0019" sağ üstte, hedef çizgisi 0.80, "ŷ 0.52 … 0.74" altta); "hata = 0.43·0.6ʳ" kuralı ve yüzde etiketleri kalktı; altta iki satır kurulum notu; .md tablosu ŷ/hata/L dört-beş ondalık. | uygulandı
R027 | print/figures/strings/M04.mjs:22-27,72-77 | Yeni etiketler: "kayıp L", "çıktı ŷ", "hedef y", alt not, .md kuralı/başlığı iki dilde. | uygulandı
R031 | print/figures/gen/M04.mjs:204 | Şekil 4.5: sinüs/0,04 kuralı kalktı; kareler rnn45[lang] (TR 6 kare: boş + 5 kelime; EN 8 kare: boş + 7 kelime), 4 gizli birim; çubuk boyu |h|, etiket işaretli ("−0.54"), eksi değer koyu çubuk; KARE 0 dört çubuk "0.00"; kelime şeridi karede (işlenenler dolu, sıradaki ok). | uygulandı
R031 | print/figures/strings/M04.mjs:36-42,85-91 | Kelime listesi strings'ten çıkarıldı (demo-data.json'dan gelir); lejant, formül satırı, .md başlığı/notu. | uygulandı
R040 | print/figures/gen/M05.mjs:209 | Şekil 5.4: 1. satır "AÇGÖZLÜ (ARGMAX) · HER ADIMDA EN YÜKSEK OLASILIK" (mevcut p, argmax); 2. satır "ÖRNEKLEME, T = 1.5 · softmax(z/T) · SEÇİM: U İLE TERS-CDF" (z = ln p, q = softmax(z/1.5), U[i mod 8] ile seçim; her karede "U = 0.37/0.81/0.12"); alt not; .md'de p, açgözlü seçim, softmax(z/1.5) ve U → seçim sütunları. | uygulandı
R040 | print/figures/strings/M05.mjs:40-52,131-143 | Satır başlıkları, alt not, .md kuralı/başlıkları iki dilde. TR'de "T = 1.5" nokta ile (R095 kararı: TR ondalık nokta); talimattaki "1,5" yazımı tercih edilirse strings/M05 sample() tek yerden değişir. | uygulandı (not)
R052 | print/figures/gen/M07.mjs:56 | Şekil 7.1: fark etiketi iki satır "onay oranı farkı" / "0 · 40 · 80 yüzde puan" (EN "approval rate gap" / "… percentage points"); .md sütunu ve notu. | uygulandı
R052 | print/figures/strings/M07.mjs:6-7,90-91 | gapLabel ve gap(g) dizgileri. | uygulandı
R053 | print/figures/gen/M07.mjs:71 | Şekil 7.2: "φ₀ = 0 puan · taban, örneğe özgü" satırı; "katkı toplamı Σφᵢ = −8 puan" ve "f(x) = −8 puan → ret" (#2: +76 puan → onay); alt notta karar eşiği 0, f(x) = φ₀ + Σφᵢ, aynı ölçek (puan), katkıların temsili olduğu; yükseklik 160 → 200; .md'de φ₀, Σφᵢ, f(x) satırları ve −8 hesabı notu. | uygulandı
R053 | print/figures/strings/M07.mjs:22-37,106-121 | unit, baseLine, totalLine, resultLine, footer, mdRule, mdBase, mdNote iki dilde. | uygulandı
R073 | print/figures/gen/M06.mjs:205 | Şekil 6.3: kare yüksekliği en uzun son cevaba göre (+8 pt iç boşluk); üçüncü panelde "… kişi başı 90 TL." alt çerçeveye değmiyor. | uygulandı
R082 | print/figures/gen/M01.mjs:251 | Şekil 1.6 (s30): tablo notu ve mini grafik tik etiketleri 5.5 → 6 (≈6.59 pt). | uygulandı
R082 | print/figures/gen/M02.mjs:7 | Şekil 2.4 (s47): "bugün ↓ yarın →" 5 → 6; diğer etiketler zaten ≥ 6. | uygulandı
R082 | print/figures/gen/M04.mjs:44 | Şekil 4.1 (s82): "sigmoid · ReLU" 5.5 → 6. | uygulandı
R082 | print/figures/gen/M05.mjs:106 | Şekil 5.2 (s108): eksen tik etiketleri ve x/y 5 → 6. | uygulandı
R082 | print/figures/gen/M05.mjs:169 | Şekil 5.3 (s110): "sorgu ↓", "bakılan →" 5.5 → 6; ölçek etiketleri 5 → 6. | uygulandı
R082 | print/figures/gen/M06.mjs:48 | Şekil 6.1 (s132): "+ parça n" ve 0/60/85/100 eksen etiketleri 5.5 → 6. | uygulandı
R082 | print/figures/gen/M06.mjs:111 | Şekil 6.2 (s135): akış başlığı, RAG KAPALI satırı, sütun başlıkları, "kaynak yok", "GETİRİLEN KAYNAK", uyarı ve kaynak satırı 5.5/5.8 → 6. | uygulandı
R082 | print/figures/gen/M08.mjs:184 | Şekil 8.4 (s183): formül göstergesi 5.5 → 6. | uygulandı
R082 | print/figures/check_fig_fonts.mjs:1 | Yeni denetim: her SVG'de en küçük <text> boyutunu pt'ye çevirir (124 mm / viewBox genişliği × 72/25.4), < 6 pt ✗, < 6.5 pt △ işaretler; `node print/figures/check_fig_fonts.mjs [tr|en|all] [--min 6] [--target 6.5]`. | uygulandı
R082 | print/figures/gen/M02.mjs:153; gen/M03.mjs:93; gen/M06.mjs:197; gen/M07.mjs:36 | Zaten dokunulan şekillerde kalan 5 pt etiketler 6'ya çekildi (2.2 "SİSTEM ÖNERİSİ", 3.3/3.4/3.6 ortak eksen tikleri, 6.3 döngü kenar etiketleri, 7.1 kaydırıcı 0/100). | uygulandı
R082 | — | Listede olmayan ve dokunulmayan şekillerde 6 pt altı metin kaldı (denetim çıktısı): 2.3 grid (hücre sıra numaraları 5), 3.4 kmeans (nokta numaraları 5), 5.6 diffuse (64'te çözülen 5), 6.4 arch ("(RAG)" 5), EN 2.1 chain (uzun düğüm adı 5.2). Büyütme hücre/nokta çakışması gerektirdiğinden ayrı tur. | uygulanmadı: kapsam dışı
— | print/figures/lib.mjs:43-66 | Metin genişliği artık ölçülmüş glif tablosundan (Chrome ile store/assets/fonts.css fontlarından ölçüldü): `tw(s, size, font, weight, italic, spacing)` ve `wrapW`; M03 yerel kestirimi buna bağlandı. Önceki kestirim Work Sans'ı %10 dar sayıyordu (R073 taşmalarının nedeni). | uygulandı
— | print/figures/out/tr-baseline/sekil-8-3-capability.md | Önceden güncellenmemiş baseline (uzun tire "Henüz yok — tartışmalı" → "Henüz yok; tartışmalı"); üretici değişmedi, yalnız baseline eşitlendi. | uygulandı

## tr-baseline'a kopyalanan (bilerek değişen) figürler
sekil-1-1-intelligence.svg · sekil-1-2-binary.svg · sekil-1-4-cycle.svg/.md · sekil-1-5-classify.svg/.md · sekil-1-6-exp.svg · sekil-2-2-expert.svg · sekil-2-4-markov.svg ·
sekil-3-1-spam.svg/.md · sekil-3-2-classify.svg · sekil-3-3-scatter.svg · sekil-3-4-kmeans.svg · sekil-3-5-descent.svg · sekil-3-6-modelfit.svg/.md · sekil-4-1-neuron.svg ·
sekil-4-3-backprop.svg/.md · sekil-4-5-rnn.svg/.md · sekil-5-2-embed.svg · sekil-5-3-attn.svg · sekil-5-4-generate.svg/.md · sekil-6-1-prompt.svg/.md · sekil-6-2-rag.svg ·
sekil-6-3-agent.svg · sekil-7-1-bias.svg/.md · sekil-7-2-explain.svg/.md · sekil-8-3-capability.md · sekil-8-4-singularity.svg
(2.5 classify: yalnız sarma farkı; 3.3/3.4: yalnız tik puntosu; 6.1 .md: tier metni aynı, satır sonu birleştirme — içerik değişmedi.)

## Figür başına yeni etiketler / değerler (içerik ajanları tablolarla eşleştirir)

- **Şekil 1.1** — Etiketler aynı ("YZ: Güçlü · %90", "Orta · %55", "Zayıf · %22"); yalnız konum değişti.
- **Şekil 1.2** — Yönerge TR: "SAYIYI YAZ · SOLDAN SAĞA" / "SIĞIYORSA YAK, KALANLA DEVAM ET"; EN: "WRITE A NUMBER · LEFT TO RIGHT" / "FITS? LIGHT IT, KEEP THE REST". Sayılar aynı (73, 5, 255).
- **Şekil 1.4** — Evreler: "1 · Getir" (Bellek), "2 · Yürüt" (İşlemci), "3 · Kaydet / Yaz" (İşlemci (yazmaç) ya da Bellek; çıkış talimatında Giriş / Çıkış). Kare 3 metni: "iş başında: yazmaç/Bellek" + "Giriş / Çıkış yalnız çıkış talimatında". EN: "3 · Store / Write", "active: register/Memory", "Input / Output only for an output instruction". Tablo açıklaması: "Sonuç bir yazmaca ya da belleğe yazılır; her komut giriş/çıkış aygıtı kullanmaz." Not: "Şekil temsili bir döngüdür; gerçek işlemcilerde her talimat üç eş süreli evreye bölünmez." Dijital demo (cycle) ile uyum demo-kod ajanında.
- **Şekil 1.5** — Sütunlar: "Bugün kullanılan sistem" | "Varsayımsal sistem" (EN "In use today" | "Hypothetical"); 5. satır "Kendini fark eden, bilinçli bir YZ · Bilinç sorusu (ayrı)" (EN "Consciousness question (separate)"). Kartlar ve kutular aynı (5 satır).
- **Şekil 2.2** — Metin/veri aynı; R5 satırında "zincir" ayrı satır; senaryo B önerisi "Şemsiye al · Dikkat: şemsiye ters dönebilir!" (EN iki satıra sarılır).
- **Şekil 2.4** — Veri aynı (70/20/10, 30/40/30, 20/40/40); öz-ilmek etiketleri 70, 40, 40 görünür.
- **Şekil 3.1** — Özellikler: "“bedava” geçiyor" | "link veya şifre isteği" | "aciliyet dili" (EN "mentions “free”" | "link or password request" | "urgency language"); ✓/○ ve etiketler aynı. Metin/tablo/vektör/cevap anahtarında aynı ad kullanılmalı (book.json featureNames değişmedi; figür override eder).
- **Şekil 3.2** — Metin aynı; yalnız sarma.
- **Şekil 3.5** — Veri aynı: η = 0.18 (x: 0.60, 1.39, 2.04, 2.57, 3.01, 3.37, 3.66) ve η = 4.6 (x: 0.60, 7.89, 3.10, 6.25, 4.18, 5.54, 4.65); adım numaraları 0–6 çağrı çizgili.
- **Şekil 3.6** — Paneller: "Eksik uyum" | "Daha düzgün temsili eğri" | "Aşırı uyum" (EN "Underfit" | "Smoother illustrative curve" | "Overfit"). Orta hüküm: "Temsili eğri: az ve aşırı uyum arasındaki dengeyi kavramsal olarak gösterir; veriden eğitilmedi, doğrulama hatası ölçülmedi." (EN "Illustrative curve: shows the balance between under- and overfitting conceptually; not fitted to the data, no validation error measured."). Eğri formülleri ve noktalar aynı; .md hata kareleri: eksik 1.43, temsili 1.52, aşırı 0.
- **Şekil 4.3** — Kurulum: girdi x = [1, 0.5], hedef y = 0.8, η = 2.0, L = ½(y − ŷ)², ağ 2 → 2 (sigmoid) → 1 (sigmoid), gerçek gradyan güncellemesi (demo-data.json bp43). Kare etiketleri "TUR r · kayıp L …" ve "ŷ …":
  t0 ŷ 0.52 L 0.0384 · t1 0.58 / 0.0238 · t2 0.63 / 0.0152 · t3 0.66 / 0.0100 · t4 0.68 / 0.0068 · t5 0.70 / 0.0048 · t6 0.72 / 0.0034 · t7 0.73 / 0.0025 · t8 0.74 / 0.0019; hedef çizgisi 0.80. Tam değerler (.md): ŷ 0.5229, 0.5817, 0.6258, 0.6585, 0.6832, 0.7022, 0.7172, 0.7292, 0.7390; hata y − ŷ 0.2771 … 0.0610; L 0.03839, 0.02382, 0.01518, 0.01001, 0.00682, 0.00478, 0.00343, 0.00251, 0.00186. "hata her tur yüzde 40 küçüldü" ve "%52 … %80" ifadeleri metinden kalkmalı.
- **Şekil 4.5** — Cümle TR "Kedi kaçtı çünkü o korkmuştu" (6 kare: KARE 0 boş + 5 kelime), EN "The cat ran because it was scared" (8 kare); 4 gizli birim h₁–h₄ (sekiz çubuk yok); kare 0 "0.00" × 4. Değerler (h₁ h₂ h₃ h₄):
  TR — Kedi 0.72 −0.54 0.20 −0.66 · kaçtı 0.16 0.34 −0.57 0.31 · çünkü 0.16 0.32 0.53 −0.58 · o −0.54 0.11 0.82 0.68 · korkmuştu 0.34 −0.81 −0.16 0.53.
  EN — The 0.72 −0.54 0.20 −0.66 · cat 0.16 0.34 −0.57 0.31 · ran 0.16 0.32 0.53 −0.58 · because −0.54 0.11 0.82 0.68 · it 0.34 −0.81 −0.16 0.53 · was 0.86 −0.57 −0.55 −0.39 · scared 0.09 0.67 −0.77 0.20.
  Lejant: "çubuk boyu = |h| · koyu çubuk = eksi değer · etiket işaretli değer · h₀ = 0"; formül "hₜ = tanh(Wₓ·xₜ + Wₕ·hₜ₋₁) · 4 gizli birim · sabit küçük ağırlıklar". M04 Kurulum/Adım adım ("dört kare", "sekiz çubuk", "yapay/zekâ/öğreniyor", "yüzde 4") buna göre yenilenmeli.
- **Şekil 5.4** — Satır 1 "Açgözlü (argmax)": çok %42 · hızlı %38 · gelişiyor %50 → "Yapay zekâ çok hızlı gelişiyor." Satır 2 "Örnekleme, T = 1.5" (softmax(z/1.5), yuvarlanmış; U = 0.37, 0.81, 0.12):
  adım 1: çok %36, artık %28, bugün %21, giderek %16 → U 0.37 → **artık**; adım 2: hızlı %34, güçlü %29, yaygın %22, akıllı %16 → U 0.81 → **yaygın**; adım 3: gelişiyor %41, ilerliyor %26, yayılıyor %19, büyüyor %14 → U 0.12 → **gelişiyor** → "Yapay zekâ artık yaygın gelişiyor." (tam: 36.2/27.6/20.6/15.7 · 33.7/28.8/22.0/15.6 · 41.3/26.0/18.5/14.1).
  EN: greedy now 42% · learns 38% · fast 50% → "AI now learns fast."; sampling already 28% (U 0.37) · creates 22% (U 0.81) · fast 41% (U 0.12) → "AI already creates fast."
- **Şekil 6.3** — Metin aynı; kare yüksekliği arttı.
- **Şekil 7.1** — "onay oranı farkı" / "0 yüzde puan · veri dengeli", "40 yüzde puan · çarpık veri", "80 yüzde puan · çarpık veri" (A/B: %50/%50, %70/%30, %90/%10 aynı). EN "approval rate gap" / "… percentage points".
- **Şekil 7.2** — "φ₀ = 0 puan · taban, örneğe özgü"; Başvuru #1: +32 −46 +18 −12 → "katkı toplamı Σφᵢ = −8 puan", "f(x) = −8 puan → ret"; Başvuru #2: +40 +28 +22 −14 → "Σφᵢ = +76 puan", "f(x) = +76 puan → onay". Alt not: "karar eşiği 0 puan: f(x) > 0 ⇒ onay, aksi hâlde ret · f(x) = φ₀ + Σφᵢ · taban değer, katkılar ve sonuç aynı ölçekte (puan) · temsili katkılar (hesaplanmış SHAP değil) · çubuk boyu en büyük |katkı|’ya oranlı". EN: "φ₀ = 0 points · base, chosen here", "sum of contributions Σφᵢ = −8 points", "f(x) = −8 points → declined" / "+76 points → approved".
- **Şekil 1.6, 2.4, 4.1, 5.2, 5.3, 6.1, 6.2, 8.4** — İçerik aynı; yalnız punto (≥ 6 SVG birimi ≈ 6.59 pt baskı).
