# Uygulama kaydı — DEMO-KOD ajanı (2026-10-01)

Kapsam: yalnız `Atlas-Kitap.dc.html` (TR) ve `Atlas-Kitap-EN.dc.html` (EN): demo kodu (`renderVals()`, yardımcı metotlar, `state`), HTML şablonu ve `modules()` içindeki demo VERİ dizileri. `basit/teknik/neOluyor/neOluyorBasit` paragraflarına ve sınav metinlerine dokunulmadı. İki dosya satır satır paralel (ikisi de 2669 → 2740 satır; her kayıt aynı satırda). Sayılar `print/kitap/qa/demo-data.json` (bp43, rnn45, temp54) ile aynı sabit ve formüllerden üretilir.

Ondalık: dijital demolarda nokta kullanıldı (0.50, 4.6) — R095 kararıyla uyumlu; belgedeki "0,50" yazımı basılı tabloya aittir.

## Kayıt satırları (R0NN | dosya:satır | yapılan | durum)

R006 | Atlas-Kitap.dc.html:1137-1140 | 1.4 cycle demo verisi: `phases[2]` "3 · Yaz" → "3 · Kaydet / Yaz"; `phaseParts:[0,1,0]` (Kaydet/Yaz evresi Belleği vurgular, Giriş/Çıkışı değil); `phaseNotes` ile evre notu ("Sonuç bir yazmaca ya da belleğe kaydedilir; Giriş / Çıkış yalnızca çıkış talimatında devreye girer."); Giriş/Çıkış açıklaması "sonuç yalnızca bir çıkış talimatı varsa buradan çıkar". | uygulandı
R006 | Atlas-Kitap.dc.html:238, 1083, 1836-1842 | Şablonda evre notu satırı (`cyclePhaseNote`); tik ve render mantığı `phaseParts` eşlemesini kullanıyor. | uygulandı
R006 | Atlas-Kitap-EN.dc.html:238, 1083, 1137-1140, 1836-1842 | Aynı mantık; "3 · Store / Write", "The result is stored in a register or in memory; Input / Output takes part only on an output instruction." | uygulandı
R007 | Atlas-Kitap.dc.html:1148, 1152 | 1.5 classify: `catA/catB` yerine üç kategori `cats` — "Bugün kullanılan sistem" / "Varsayımsal sistem" / "Bilinç sorusu"; "Kendini fark eden, bilinçli bir YZ" kartı `bilinc` kategorisine taşındı (AGI'den puan almıyor). | uygulandı
R007 | Atlas-Kitap-EN.dc.html:1148, 1152 | "In use today" / "Hypothetical" / "Consciousness question"; "A self-aware, conscious AI" → `bilinc`. | uygulandı
R017 | Atlas-Kitap.dc.html:1244 | 3.1 spam `featureNames[1]`: "link / şifre isteği" → "Link veya şifre isteği" (demo verisindeki tek geçiş; `neOluyor` paragrafındaki "link var" içerik ajanının işi). | uygulandı
R017 | Atlas-Kitap-EN.dc.html:1244 | "link / password request" → "Link or password request". | uygulandı
R020 | Atlas-Kitap.dc.html:407 | 3.4 kmeans şablonuna görünür not: "Merkezler (✕) ve aykırı nokta bu gösterimde önceden seçilmiştir (temsili); gerçek yöntem bir eşikle hesaplar." | uygulandı
R020 | Atlas-Kitap-EN.dc.html:407 | "The centers (✕) and the outlier are predefined in this illustration; a real method computes them with a threshold." | uygulandı
R021 | Atlas-Kitap.dc.html:1647-1652 | 3.5 `descentStep`: yüksek hız 0.92 → 4.6 (kodda formül yorumu: 1 − 0.36·4.6 = −0.656 → salınarak yakınsar); x aralığı [0,9]'a kırpılır; `descN` adım sayacı. | uygulandı
R021 | Atlas-Kitap.dc.html:425, 1067, 1594, 2026-2039 | Grafik ekseni x∈[0,9] (`sx = 20 + (xx/9)·220`, kayıp ekseni L(0)=4.6 tepe); etiketler "Düşük (η = 0.18)" / "Yüksek (η = 4.6)"; hız değişince x=0.6, adım=0'a döner; şablonda "Adım n · x = … · Kayıp: …" (adım sayısı formülden). Düşük hız 0.18 korundu. | uygulandı
R021 | Atlas-Kitap-EN.dc.html:425, 1067, 1594, 1647-1652, 2026-2039 | Aynı; "Low (η = 0.18)" / "High (η = 4.6)", "Step n · x = …". | uygulandı
R024 | Atlas-Kitap.dc.html:1295, 448 | 3.6 `fits[1]` etiketi "İyi (dengeli)" → "Daha düzgün temsili eğri"; hükmü "eğitim ve doğrulama hatası burada ölçülmedi; genelleme, eğitimde kullanılmamış veride hata ölçülerek sınanır"; şablonda "Üç eğri de elle çizilmiştir (temsili); veriden eğitilmedi." | uygulandı
R024 | Atlas-Kitap-EN.dc.html:1295, 448 | "Smoother illustrative curve"; "All three curves are drawn by hand (illustrative); none is fitted to the data." | uygulandı
R027 | Atlas-Kitap.dc.html:2110-2136 | 4.3 backprop: 0.43·0.6^r eğrisi kaldırıldı; demo-data.json bp43 ile aynı GERÇEK eğitim (x=[1.0,0.5], y=0.8, η=2.0, W1=[[0.3,−0.2],[0.4,0.1]], b1=[0,0], W2=[0.5,−0.3], b2=0, sigmoid, L=½(ŷ−y)²); her turda ileri geçiş, ∂L/∂z₂=(ŷ−y)ŷ(1−ŷ), gizli gradyanlar (güncellenmemiş w₂ ile) ve W1/b1/W2/b2 güncellemesi hesaplanır; tur 0–8 (tavan 8). | uygulandı
R027 | Atlas-Kitap.dc.html:495-513 | Şablon: kurulum satırı (x, y, η, L, tur n/8), ŷ ve hedef çubukları, "ŷ · hata (y − ŷ) · L", "∂L/∂z₂ · w₂ · b₂", bu turun güncellemesi satırı, düğme "Eğit (tur n)" + "baştan". | uygulandı
R027 | Atlas-Kitap-EN.dc.html:495-513, 2110-2136 | Aynı kod; "Train (round n)", "Network output ŷ", "Target y = 0.8". | uygulandı
R028 | Atlas-Kitap.dc.html:2132-2133 | Tur 8 mesajı: "Tur 8/8: bu örnekte eğitim hatası küçüldü; yeni örneklerde başarı ayrıca sınanmalıdır." (genelleme iddiası yok); güncelleme satırı gradyanı hesaplayan adımla parametreyi değiştiren adımı ayrı gösterir. | uygulandı
R028 | Atlas-Kitap-EN.dc.html:2132-2133 | "Round 8/8: training error has decreased on this example; performance on new examples still needs testing." | uygulandı
R031 | Atlas-Kitap.dc.html:2159-2172 | 4.5 rnn: sinüs çubukları kaldırıldı; demo-data.json rnn45 ile aynı hₜ = tanh(Wₓ xₜ + Wₕ hₜ₋₁), h₀=0, Wₓ/Wₕ sabitleri aynen; xₜ one-hot (kelime k → sütun k mod 5); kelimeler ['Kedi','kaçtı','çünkü','o','korkmuştu']; çubuk = |h| (0–1), etiket işaretli değer; negatif çubuk turuncu. | uygulandı
R031 | Atlas-Kitap.dc.html:542-551 | Şablon: 4 çubuk + değer etiketi (adım 0: dört çubuk 0 ve görünür "0.00"); başlık "… · h₀ = 0"; formül satırı. | uygulandı
R031 | Atlas-Kitap-EN.dc.html:542-551, 2159-2172 | Aynı; kelimeler ['The','cat','ran','because','it','was','scared'] (7 kelime, sütun k mod 5); "Hidden state / memory (n words processed) · h₀ = 0". | uygulandı
R032 | Atlas-Kitap.dc.html:570 | 4.6 gan: "sahte olasılığı" → "sahte olasılığı (temsili, ölçülmüş değil)". | uygulandı
R032 | Atlas-Kitap-EN.dc.html:570 | "fake probability (illustrative, not measured)". | uygulandı
R036 | Atlas-Kitap.dc.html:613 | 5.2 embed: "Noktalar elle yerleştirilmiştir; eğitilmiş bir modelin gömüsü ya da PCA/t-SNE çıktısı değildir." | uygulandı
R036 | Atlas-Kitap-EN.dc.html:613 | "The points are placed by hand; this is not an embedding from a trained model or a PCA/t-SNE result." | uygulandı
R037 | Atlas-Kitap.dc.html:619 | 5.3 attn tablo başlığı notu: "Temsili ağırlıklar · çift yönlü (encoder) tablo · her satırın toplamı 1". | uygulandı
R037 | Atlas-Kitap-EN.dc.html:619 | "Illustrative weights · bidirectional (encoder) table · each row sums to 1". | uygulandı
R038 | Atlas-Kitap.dc.html:2261, 2267-2270 | Altyazı kendi konumunu dahil eder: kendi ağırlığı en yüksekse "En yüksek ağırlık kendi konumunda (0.50); diğer sözcükler arasında en çok “kaçtı” (0.30)." değilse "En yüksek ağırlık “o” sözcüğünde (0.40); kendi konumu 0.15."; ardından "Ağırlıklar temsilidir; tek başına anlam ilişkisinin kanıtı değildir."; her kutuda ağırlık yazılı. | uygulandı
R038 | Atlas-Kitap-EN.dc.html:2261, 2267-2270 | "Highest weight on itself (0.50); among the other words, mostly “ran” (0.30)." / "Highest weight on “it” (0.40); its own position gets 0.15." | uygulandı
R040 | Atlas-Kitap.dc.html:2273-2301 | 5.4 generate: iki satır "Açgözlü (argmax)" ve "Örnekleme, T = 1.5"; z = ln p, q = softmax(z/1.5); örnekleme ters-CDF: U[i mod 8] < q₀+…+qₖ olan ilk k, U = demo-data.json temp54.U; argmax satırı en yüksek p; gösterilen olasılıklar q (p parantezde); kod yorumunda formül. "Yaratıcılık" anahtarı ve `genCreative` durumu kaldırıldı. | uygulandı
R040 | Atlas-Kitap.dc.html:626-643 | Şablon: iki cümle satırı, adım etiketi (U değeri, örnekleme/argmax seçimi), aday çubukları (yeşil = argmax, mor = örnek), kural notu. | uygulandı
R040 | Atlas-Kitap-EN.dc.html:626-643, 2273-2301 | "Greedy (argmax)" / "Sampling, T = 1.5". | uygulandı
R042 | Atlas-Kitap.dc.html:680, 2324, 2332 | 5.6 diffuse: "ilerleme %n · temizlenen pay k/64" ayrı nicelikler (adım 1: ilerleme %13, temizlenen pay 6/64). | uygulandı
R042 | Atlas-Kitap-EN.dc.html:680, 2324, 2332 | "progress n% · cleared share k/64". | uygulandı
R043 | Atlas-Kitap.dc.html:692 | 5.7 ctx: "Bağlam penceresi (bu demoya özgü kayan pencere) · n / 8 kelime". | uygulandı
R043 | Atlas-Kitap-EN.dc.html:692 | "Context window (sliding window specific to this demo) · n / m words". | uygulandı
R045 | Atlas-Kitap.dc.html:714, 718, 2383-2385 | 6.1 prompt: puan etiketi "Tamamlanma: %n (kalite ölçümü değil)"; kademe "düşük/orta/yüksek tamamlanma"; yanıt kartında "temsili yanıt" rozeti; kod yorumu "40 + 15·parça; kalite ölçümü değil". | uygulandı
R045 | Atlas-Kitap-EN.dc.html:714, 718, 2383-2385 | "Completeness: n% (not a quality score)"; "illustrative answer". | uygulandı
R047 | Atlas-Kitap.dc.html:726 | 6.2 rag rozeti: "Hazır kaynak–yanıt çiftleri · gerçek arama ya da model çağrısı yok". | uygulandı
R047 | Atlas-Kitap-EN.dc.html:726 | "Predefined source–answer pairs · no real search or model call". | uygulandı
R048 | Atlas-Kitap.dc.html:747 | 6.3 agent: "GÖREV · HAZIR SENARYO". | uygulandı
R048 | Atlas-Kitap-EN.dc.html:747 | "TASK · SCRIPTED SCENARIO". | uygulandı
R049 | Atlas-Kitap.dc.html:1463, 775, 2431-2436 | 6.4 arch: `parts` dizisine "Model çağrısı (LLM)" (istek + erişilen kaynak parçaları + araç sonucu modele gider; çıktı/araç çağrısı isteği orkestrasyona döner); Orkestrasyon "Asıl beyin" yerine "Bileşenleri yöneten katman … model çağrısını yapar"; Bilgi tabanı "gömüleriyle birlikte özgün parça ve metadata"; ipucu "Akış: kullanıcı → arayüz → orkestrasyon → model çağrısı ↔ (bilgi · araçlar · bellek) → çıktı." | uygulandı
R049 | Atlas-Kitap-EN.dc.html:1463, 775, 2431-2436 | "Model call (LLM)"; "original chunks plus metadata"; "The flow: user → interface → orchestration → model call ↔ (knowledge · tools · memory) → output." | uygulandı
R052 | Atlas-Kitap.dc.html:2483, 806, 2476 | 7.1 bias: fark etiketi "(fark 80 yüzde puan)"; görünür "Temsili formül: A = 50 + 0.4·e, B = 50 − 0.4·e (e = veri önyargısı, %); ölçülmüş eğitim sonucu değil." | uygulandı
R052 | Atlas-Kitap-EN.dc.html:2483, 806, 2476 | "(a 80 percentage point gap)"; "Illustrative formula: …". | uygulandı
R053 | Atlas-Kitap.dc.html:827, 833, 2504-2506 | 7.2 explain: görünür "Taban değer φ₀ = 0 puan (bu örneğe özgü seçim) · karar eşiği 0 puan · birim: puan (temsili)"; katkılar "+32 puan / −46 puan / …"; altyazı "Toplam: φ₀ 0 + 32 − 46 + 18 − 12 = −8 puan; eşik 0 → ret. … Katkılar temsilidir, hesaplanmış SHAP değerleri değildir; bu sonradan açıklama modeli bütünüyle şeffaf yapmaz." ("kara kutuyu beyaz kutuya çevirir" kalktı). | uygulandı
R053 | Atlas-Kitap-EN.dc.html:827, 833, 2504-2506 | "Base value φ₀ = 0 points …"; "Total: φ₀ 0 + 32 − 46 + 18 − 12 = −8 points; threshold 0 → declined." | uygulandı
R055 | Atlas-Kitap.dc.html:2509-2535 | 7.3 df: üç seçenek "Gerçek görünüyor" / "Şüpheli: doğrula" / "Belirlenemez"; her vaka `best` + `ipucu` + `dogrulama`; geri bildirim "Bu kurgu örnekte … işareti var; önerilen adım: …"; hüküm yok ("✓ Önerilen adımla eşleşti: …" / "○ Önerilen adım farklı: …"); not "İpuçları inceleme gerekçesidir; … Olayın gerçekliği ile üretim yöntemi ayrı sorulardır."; sayaç "önerilen adımla eşleşen: n" (`dfHits`). | uygulandı
R055 | Atlas-Kitap.dc.html:844-859, 1067, 1594 | Şablon üç düğme (`dfOpts`), başlıkta "kurgu örnek"; durum/sıfırlama. | uygulandı
R055 | Atlas-Kitap-EN.dc.html:844-859, 1067, 1594, 2509-2535 | "Looks real" / "Suspicious: verify" / "Cannot tell"; "In this fictional example the sign is …; the recommended step: …". | uygulandı
R060 | Atlas-Kitap.dc.html:900, 2591-2594, 2605-2606 | 8.2 tur: "kurgusal örnek" rozeti; "Anında" süre ipucu çıkarıldı ("Kusursuz, tereddütsüz aritmetik bu kurguda makine olarak yazıldı; ama bir insan da doğru hesaplayabilir."); 1. ve 2. ipucu yumuşatıldı; geri bildirim "✓/○ Tahminin kurguyla eşleşti/eşleşmedi: bu kurguda cevap makine/insan olarak yazıldı; ipuçları kesin kanıt değildir." | uygulandı
R060 | Atlas-Kitap-EN.dc.html:900, 2591-2594, 2605-2606 | "fictional example"; "Instant" çıkarıldı; "in this fiction the reply was written as a machine/human; the tells are not conclusive proof." | uygulandı
R061 | Atlas-Kitap.dc.html:960, 974 | 8.3 çubuk altı "temsili düzey · ölçülmüş zekâ puanı ya da AGI’ye ilerleme oranı değil"; 8.4 eksen "zekâ (temsili, birimsiz)" (eksende birim yok). | uygulandı
R061 | Atlas-Kitap-EN.dc.html:960, 974 | "illustrative level · not a measured intelligence score or a percentage of progress toward AGI"; "intelligence (illustrative, no unit)". | uygulandı
R062 | Atlas-Kitap.dc.html:2669-2692 | 8.6 responsibility: çoklu seçim (`respPicks`, "Değerlendir →" ile gösterim); her senaryoda `primary` + `shared`; son senaryo "… birini aldatmak veya zarara uğratmak amacıyla sahte kanıt üretmek için kullanır."; geri bildirim "İlk incelenecek: X; paylaşılan sorumluluk: Y; hukuki sonuç ülkeye, role ve olaya bağlıdır."; "YZ’nin kendisi" seçilirse hâkim görüş notu. | uygulandı
R062 | Atlas-Kitap.dc.html:983-996, 1067, 1594 | Şablon: "Sorumluluk kimde? Birden çok taraf seçebilirsin.", seçili taraf "✓" ile; `respShow` durumu. | uygulandı
R062 | Atlas-Kitap-EN.dc.html:983-996, 1067, 1594, 2669-2692 | "First to examine: X; shared responsibility: Y; the legal outcome depends on the country, the role and the incident." | uygulandı
R064 | Atlas-Kitap-EN.dc.html:1160, 1224, 1299, 1357, 1421, 1473, 1523, 1573 | `h2:'Kendini test et'` ×8 → 'Test yourself'. | uygulandı
R064 | Atlas-Kitap-EN.dc.html:333, 347, 513, 547, 574, 580, 582, 599, 680, 692, 900, 923 | "→ transition probabilities"; "days · long-run distribution:"; "Train (round n)"; "Hidden state / memory (n words processed)"; "Round (n/8)"; "Year"; "transistors · n doublings"; "token · n words" (ek bulgu); "progress … cleared share"; "Context window · n / m words"; "Exchange n / m"; "Note n / m · you do not know Chinese". | uygulandı
R027/R031/R040/R055/R062 (ipucu) | Atlas-Kitap.dc.html:1333, 1347, 1397, 1506, 1570 | Demo başlık/ipucu verisi güncellendi: 4.3 başlık "Hatadan öğren (gerçek eğitim)", ipucu artık "Hata ≈ 0 olunca ağ öğrenmiş demektir" demiyor; 4.5 başlık "Hafızalı işleme (gerçek yineleme)" + formül; 5.4 ipucu iki satırı anlatıyor (yaratıcılık anahtarı yok); 7.3 ipucu önerilen adımı soruyor; 8.6 ipucu çoklu seçimi söylüyor. | uygulandı
R027/R031/R040/R055/R062 (ipucu) | Atlas-Kitap-EN.dc.html:1333, 1347, 1397, 1506, 1570 | "Learn from error (real training)", "Processing with memory (real recurrence)", greedy/sampling hint, recommended-step hint, multi-select hint. | uygulandı
R064 | Atlas-Kitap-EN.dc.html:1827, 1845, 1950, 2037 | Ek bulgu: görünür `'⏸ Duraklat'` (Turing/Markov/iniş "Auto" düğmeleri ve döngü "▶ Oynat") → "⏸ Pause" / "▶ Play". Tarama (modules() dışı, ğşıİçöü harfli satırlar): kalan yalnız "TÜRKİYE" (özel ad, :666) ve bir eski kod yorumu (:2702). | uygulandı

## Test

- `node -e` / `new Function`: iki dosyanın `<script data-dc-script>` içeriği ayrıştırıldı; 8 modül × 61 bölüm × {basit, teknik} = 122 `renderVals()` çağrısı, sıfır istisna (TR ve EN).
- Headless Chrome (puppeteer-core 20.9, sistem Chrome, `file://` + `#m=N&s=i` derin bağlantı, düğme tıklamaları): 25 değişen demo iki dilde de tıklanarak doğrulandı — 3.5 yüksek hız dizisi 0.60 → 7.89 → 3.11 → 6.24 → 4.19 → 5.53 → 4.65 → 5.23 → 4.85; 4.3 dokuz turun ŷ, L, ∂L/∂z₂, w₂, b₂ değerleri demo-data.json ile birebir (t0 L=0.03839 … t8 L=0.00186); 4.5 adım 0 dört çubuk 0% + "0.00" etiketi, adım 1 h=[0.72, −0.54, 0.20, −0.66] (EN 7. adım dahil); 5.4 iki satır; 7.3 üç seçenek; 8.6 çoklu seçim; R064 EN etiketleri. Etkileşim sonrası konsol hatası: 0.
  Not: sayfa yüklenirken tarayıcı ham şablondaki SVG `{{ }}` özniteliklerinden 58 "Expected length/moveto" hatası basar — değişiklik öncesi de vardı (`dijital.md` C-3), support.js devralınca kaybolur; bu turda dokunulmadı.
- `python3 build.py`: dist/tek-dosya, dist/web, dist/gated, store/demo ve store/d (90 QR sayfası) yenilendi. `grep -c` ile dist/web/index.html ve en.html'de yukarıdaki tüm etiketler doğrulandı ("Kendini test et" ve "Duraklat" EN'de 0). QR sayfaları: TR 1.4/3.5/4.3/4.5/5.4/7.3/8.5 ve EN 4.3/4.5/5.4/7.3/8.5 yeni kodu içeriyor (QR numarası modül içi demo sırasıdır: sorumluluk demosu 8.5).
- Kural denetimleri (bilgi için; basılı dosyalara dokunulmadı, `export.py` çalıştırılmadı): `check_style_tr.py` 0 sorun; `check_style_en.py` 1 sorun (M03 L245 42 kelimelik cümle, önceden var); `check_verbatim_tr.py` 124 / `check_verbatim_en.py` 132 fark (book.json eski; içerik ajanları ve export turu sonrası yeniden bakılmalı).

## Demo başına nihai veri / mantık özeti (basılı tablolar için)

### 1.4 Getir – Yürüt – Kaydet/Yaz
Evreler: "1 · Getir" (Bellek vurgulu: kontrol birimi sıradaki komutu bellekteki adresinden okur) · "2 · Yürüt" (İşlemci: ALU + kontrol birimi) · "3 · Kaydet / Yaz" (Bellek vurgulu: sonuç bir yazmaca ya da belleğe kaydedilir; Giriş / Çıkış yalnızca çıkış talimatında devreye girer). Giriş/Çıkış kartı: veri buradan girer; sonuç yalnızca çıkış talimatı varsa buradan çıkar. EN: Fetch · Execute · Store / Write.

### 1.5 Kartlar ve kategoriler
Kategoriler: "Bugün kullanılan sistem" (dar) · "Varsayımsal sistem" (agi) · "Bilinç sorusu" (bilinc). EN: "In use today" · "Hypothetical" · "Consciousness question".
Kartlar: Satranç motoru → dar · Yüz tanıma sistemi → dar · Sohbet botu (dil modeli) → dar · Her mesleği insan gibi öğrenip yapan, kendi amaçları olan makine → agi · Kendini fark eden, bilinçli bir YZ → bilinc.

### 3.1 Özellik adı
featureNames = ["“bedava” geçiyor", "Link veya şifre isteği", "aciliyet dili"]; EN ["mentions “free”", "Link or password request", "urgency language"]. E-posta satırları ve [true/false] vektörleri değişmedi.

### 3.5 Gradyan inişi (dijital)
L(x) = 0.18(x−5)² + 0.1; x ← x − η·0.36(x−5); x₀ = 0.6; eksen x∈[0,9]. Düşük η = 0.18 (çarpan 0.9352): 0.60 → 0.89 → 1.15 → … Yüksek η = 4.6 (çarpan −0.656): 0.60 → 7.89 → 3.11 → 6.24 → 4.19 → 5.53 → 4.65 → 5.23 → 4.85 (salınarak yakınsar). Kayıp L: 3.59 → 1.60 → 0.74 → 0.38 → 0.22 → 0.15 → 0.12 → 0.11 → 0.10.

### 4.3 Geri yayılım tur tablosu (demo-data.json bp43 ile aynı)
Kurulum: x = [1.0, 0.5], y = 0.8, η = 2.0; W1 = [[0.3, −0.2],[0.4, 0.1]], b1 = [0, 0], W2 = [0.5, −0.3], b2 = 0; sigmoid; L = ½(ŷ−y)²; ∂L/∂z₂ = (ŷ−y)·ŷ(1−ŷ); gizli gradyanlar güncellenmemiş w₂ ile; tüm parametreler w ← w − η·∂L/∂w.

| tur | ŷ | hata y−ŷ | L | ∂L/∂z₂ | w₂ (tur başı) | b₂ |
|---|---|---|---|---|---|---|
| 0 | 0.5229 | 0.2771 | 0.03839 | −0.06913 | [0.500, −0.300] | 0.000 |
| 1 | 0.5817 | 0.2183 | 0.02382 | −0.05311 | [0.576, −0.216] | 0.138 |
| 2 | 0.6258 | 0.1742 | 0.01518 | −0.04081 | [0.635, −0.151] | 0.244 |
| 3 | 0.6585 | 0.1415 | 0.01001 | −0.03183 | [0.682, −0.102] | 0.326 |
| 4 | 0.6832 | 0.1168 | 0.00682 | −0.02529 | [0.718, −0.064] | 0.390 |
| 5 | 0.7022 | 0.0978 | 0.00478 | −0.02045 | [0.748, −0.034] | 0.440 |
| 6 | 0.7172 | 0.0828 | 0.00343 | −0.01679 | [0.772, −0.009] | 0.481 |
| 7 | 0.7292 | 0.0708 | 0.00251 | −0.01398 | [0.791, 0.011] | 0.515 |
| 8 | 0.7390 | 0.0610 | 0.00186 | −0.01177 | [0.808, 0.028] | 0.543 |

Demo başlığı artık "Hatadan öğren (gerçek eğitim)" / "Learn from error (real training)" (QR sayfa başlıkları da yenilendi; basılı şekil başlığı buna göre güncellenmeli). Düğme "Eğit (tur n)" / "Train (round n)"; tur 8'de "bu örnekte eğitim hatası küçüldü; yeni örneklerde başarı ayrıca sınanmalıdır."

### 4.5 RNN gizli durumları (demo-data.json rnn45)
hₜ = tanh(Wₓ xₜ + Wₕ hₜ₋₁), h₀ = [0, 0, 0, 0]; Wₓ = [[0.9,−0.4,0.3,−0.7,0.5],[−0.6,0.8,−0.2,0.4,−0.9],[0.2,−0.5,0.7,0.6,−0.3],[−0.8,0.3,−0.6,0.9,0.1]]; Wₕ = [[0.5,−0.3,0.2,0.0],[0.1,0.4,−0.5,0.3],[−0.2,0.6,0.3,−0.4],[0.3,−0.1,0.4,0.5]]; xₜ one-hot (kelime k → sütun k mod 5). Çubuk = |h|, etiket işaretli değer, negatif çubuk turuncu. Demo başlığı "Hafızalı işleme (gerçek yineleme)" / "Processing with memory (real recurrence)".

| adım | TR kelime | EN kelime | h |
|---|---|---|---|
| 0 | — | — | [0.00, 0.00, 0.00, 0.00] |
| 1 | Kedi | The | [0.72, −0.54, 0.20, −0.66] |
| 2 | kaçtı | cat | [0.16, 0.34, −0.57, 0.31] |
| 3 | çünkü | ran | [0.16, 0.32, 0.53, −0.58] |
| 4 | o | because | [−0.54, 0.11, 0.82, 0.68] |
| 5 | korkmuştu | it | [0.34, −0.81, −0.16, 0.53] |
| 6 | — | was | [0.86, −0.57, −0.55, −0.39] |
| 7 | — | scared | [0.09, 0.67, −0.77, 0.20] |

### 5.3 Dikkat altyazısı
Tablo (5×5, satır toplamı 1, temsili, çift yönlü/encoder): Kedi [0.50,0.30,0.05,0.10,0.05] · kaçtı [0.50,0.30,0.10,0.05,0.05] · çünkü [0.20,0.40,0.20,0.10,0.10] · o [0.55,0.10,0.05,0.20,0.10] · korkmuştu [0.30,0.10,0.05,0.40,0.15]. Altyazı: sorgu "Kedi" → "En yüksek ağırlık kendi konumunda (0.50); diğer sözcükler arasında en çok “kaçtı” (0.30)."; sorgu "o" → "En yüksek ağırlık “Kedi” sözcüğünde (0.55); kendi konumu 0.20."; sorgu "korkmuştu" → "… “o” (0.40); kendi konumu 0.15." EN sözcükler: The cat · ran · because · it · was scared.

### 5.4 İki satırın adım adım seçimleri (demo-data.json temp54)
z = ln p; q = softmax(z/1.5); U = [0.37, 0.81, 0.12, …]; örnekleme = U < kümülatif q olan ilk aday; açgözlü = argmax p.

| adım | adaylar p → q (T=1.5) | U | Açgözlü (argmax) | Örnekleme, T = 1.5 |
|---|---|---|---|---|
| 1 | çok 0.42→0.362 · artık 0.28→0.276 · bugün 0.18→0.206 · giderek 0.12→0.157 | 0.37 | çok | artık |
| 2 | hızlı 0.38→0.337 · güçlü 0.30→0.288 · yaygın 0.20→0.220 · akıllı 0.12→0.156 | 0.81 | hızlı | yaygın |
| 3 | gelişiyor 0.50→0.413 · ilerliyor 0.25→0.260 · yayılıyor 0.15→0.185 · büyüyor 0.10→0.141 | 0.12 | gelişiyor | gelişiyor |

Sonuç TR: Açgözlü "Yapay zekâ çok hızlı gelişiyor." · Örnekleme "Yapay zekâ artık yaygın gelişiyor."
EN (aynı p ve q): adım 1 now/already/today/rapidly → now | already; adım 2 learns/writes/creates/reasons → learns | creates; adım 3 fast/well/daily/deeply → fast | fast. Sonuç: Greedy "AI now learns fast." · Sampling "AI already creates fast."

### 5.6 / 5.7 / 6.1 / 7.1 / 7.2
5.6: "ilerleme %13 · temizlenen pay 6/64" (adım 1). 5.7: "bu demoya özgü kayan pencere", 8 kelime. 6.1: "Tamamlanma: %40/55/70/85/100 (kalite ölçümü değil)", kademe düşük (<60) / orta (60–84) / yüksek (≥85) tamamlanma; cevap kartı "temsili yanıt". 7.1: A = 50 + 0.4·e, B = 50 − 0.4·e; e=100 → A %90, B %10, "fark 80 yüzde puan"; "temsili formül". 7.2: φ₀ = 0 puan (örneğe özgü seçim), eşik 0 puan, birim puan; Başvuru #1: +32 − 46 + 18 − 12 = −8 puan → ret; Başvuru #2: +40 + 28 + 22 − 14 = +76 puan → onay.

### 7.3 Vakalar (kurgu)
Seçenekler: "Gerçek görünüyor" (real) · "Şüpheli: doğrula" (verify) · "Belirlenemez" (cannot). EN: Looks real · Suspicious: verify · Cannot tell.

| # | vaka | best | ipucu (işaret) | doğrulama (bağımsız kanal) |
|---|---|---|---|---|
| 1 | Video: tanınmış biri söylemediği cümleyi söylüyor; dudaklar sese oturmuyor | verify | dudak hareketleriyle ses arasındaki uyumsuzluk | konuşmanın özgün kaydını ve yayımlayan kurumu bağımsız bir kanaldan bul |
| 2 | Telefonda "patron" acil transfer istiyor; ses benziyor, tonlama robotik | verify | ses klonlamayla uyumlu robotik tonlama ve aciliyet baskısı | transferi bekletip patronu bilinen numarasından geri ara ya da yüz yüze teyit et |
| 3 | Gazete sitesinde, birden çok bağımsız kaynağın doğruladığı haber | real | birden çok bağımsız kaynak ve izlenebilir köken | kaynakların her birini ayrı ayrı aç; metni insanın mı makinenin mi yazdığı bu bilgiden çıkarılamaz |
| 4 | Fotoğrafta altı parmak, arka planda anlamsız yazı | verify | altı parmak ve anlamsız arka plan yazısı | ters görsel aramayla fotoğrafın özgün kaynağını bul |

Geri bildirim: "Bu kurgu örnekte {ipucu} işareti var; önerilen adım: {doğrulama}." + "✓ Önerilen adımla eşleşti: …" / "○ Önerilen adım farklı: …"; not: ipuçları inceleme gerekçesidir, üretim kökeninin kanıtı değildir; olayın gerçekliği ile üretim yöntemi ayrı sorulardır. Puan: önerilen adımla eşleşen seçim sayısı.

### 8.2 Rozet ve ipuçları
Başlıkta "kurgusal örnek" / "fictional example" rozeti. İpuçları: (1) "… “bir yapay zekâ olarak” ifadesi makineyi düşündürür; ama bir insan da böyle yazabilir." (2) "… insanı düşündürür; ama bir model de böyle bir anı uydurabilir." (3) "Kusursuz, tereddütsüz aritmetik bu kurguda makine olarak yazıldı; ama bir insan da doğru hesaplayabilir." (süre/"Anında" yok) (4) değişmedi. Geri bildirim: "✓/○ Tahminin kurguyla eşleşti/eşleşmedi: bu kurguda cevap makine/insan olarak yazıldı; ipuçları kesin kanıt değildir."

### 8.6 primary / shared
Taraflar: Üretici / geliştirici (maker) · İşleten kurum (org) · Son kullanıcı (user) · YZ’nin kendisi (ai); çoklu seçim.

| senaryo | primary (ilk incelenecek) | shared (paylaşılan) |
|---|---|---|
| Sürücüsüz araç, üreticinin yazılım hatası yüzünden kaza yapar | Üretici / geliştirici | İşleten kurum |
| Kurum, YZ tavsiyesini kör biçimde uygulayıp müşteriye zarar verir | İşleten kurum | Üretici / geliştirici |
| Kullanıcı, YZ aracını birini aldatmak veya zarara uğratmak amacıyla sahte kanıt üretmek için kullanır | Son kullanıcı | İşleten kurum |

Geri bildirim: "İlk incelenecek: X; paylaşılan sorumluluk: Y; hukuki sonuç ülkeye, role ve olaya bağlıdır." "YZ’nin kendisi" seçilirse: hukuki sorumluluk yüklemek bugün hâkim görüş değildir.

### 6.4 Mimari parçaları
Arayüz · Orkestrasyon (bileşenleri yöneten katman; model çağrısını yapar) · Model çağrısı (LLM) (istek + erişilen kaynak parçaları + araç sonuçları modele gider; çıktı ya da araç çağrısı isteği orkestrasyona döner) · Bilgi tabanı (gömülerle birlikte özgün parça ve metadata) · Araçlar · Bellek. Akış: kullanıcı → arayüz → orkestrasyon → model çağrısı ↔ (bilgi · araçlar · bellek) → çıktı.
