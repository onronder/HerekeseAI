# Bölüm 4
## Yapay Beyin
*Nörondan sinir ağına*

<!-- acc #3155c4 · tag Derin Öğrenme -->

### 4.1 Yapay beyin: derin öğrenme

Kafanın içinde milyarlarca minik haberci yaşar: nöronlar. Her biri komşularının fısıltısını dinler; fısıltılar yeterince güçlenince o da bağırır ve haberi bir sonrakine iletir. Araştırmacılar bu basit oyuna bakıp sormuş: ya bunun kabataslak bir matematik taklidini yapsak?

Yapay sinir ağları bu sorudan doğdu. Tek tek “yapay nöronları” katman katman dizince, ortaya beklenmedik ölçüde güçlü bir öğrenme makinesi çıkıyor. Katmanlar çoğaldıkça adı da değişiyor: derin öğrenme. Önce tek bir habercinin başına oturacağız; sonra koca bir ağa, oradan görüntü ve dizi işleyen özel ağlara uzanacağız.

> **Kenar notu.** Yapay nöron beynin gerçek bir kopyası değil; çok kaba bir matematiksel benzetmedir. Güç tek bir nöronda değil, milyonlarcasının birlikte oluşturduğu örüntülerdedir.

#### Teknik derinlik

Yapay sinir ağları, biyolojik nöronlardan yalnızca gevşek biçimde esinlenir; özünde, katmanlı biçimde düzenlenmiş doğrusal olmayan dönüşümler yığınıdır. Her yapay nöron, girdilerin ağırlıklı toplamına bir sabit terim (bias) ekler ve sonucu bir aktivasyon fonksiyonundan geçirir.

Derin öğrenme, çok sayıda gizli katmanın üst üste konmasıdır; bu derinlik, ham veriden giderek soyut temsiller (kenar → şekil → nesne) öğrenmeyi sağlar. Aktivasyon fonksiyonları olmadan üst üste konan doğrusal katmanlar tek bir doğrusal işleve çöker; derinliği anlamlı kılan şey doğrusal olmayanlıktır. Alan, 2012’de AlexNet’in ImageNet’teki sıçramasıyla modern çağına girdi.

Bütün bu yapının en küçük parçası tek bir yapay nörondur. Tek başına ne hesaplar, üç sayıdan nasıl karar çıkarır?

### 4.2 Tek bir yapay nöron

Yapay nöronu bir kapı bekçisi gibi düşün. Kapısına birkaç haber gelir; bekçi her habere bir önem verir (buna ağırlık denir), hepsini toplar, üstüne kendi huyunu ekler (sabit terim, yani bias). Toplamı bir süzgeçten geçirip bir çıktıya çevirir; aktivasyon denen şey bu süzgeçtir. Zilin çalıp çalmadığına ise ayrı bir kuralla karar verilir: çıktı bir eşiği aşıyor mu?

Şekil 4.1’de girdileri güçlendir ya da zayıflat; toplamın nasıl değiştiğini ve bekçinin zili ne zaman çaldığını, yani nöronun ne zaman “ateşlediğini” izle.

> **Kenar notu.** Nöronun yaptığı tek şey: “girdileri tart, topla, bir aktivasyon fonksiyonundan geçir.” Bu kadar basit bir işlem, milyonlarca kez tekrarlandığında yüz tanıyabiliyor, metin yazabiliyor.

**Şekil 4.1 · Nöronu çalıştır**
![Şekil 4.1](../../figures/out/tr/sekil-4-1-neuron.svg)

*Kurulum.* Şekilde üç girdi görüyorsun: x₁, x₂ ve x₃. Her biri 0 ile 1 arasında bir değer taşır; başlangıçta 0.60, 0.30 ve 0.80. Her girdinin yanında sabit bir ağırlık yazar: w = [0.7, −0.5, 0.9]. Ortadaki kutu bunları toplar, üstüne sabit terim b = −0.3 ekler. Sağdaki kutu aktivasyonu verir; sigmoid ya da ReLU. Aktivasyon, nöronun sayısal çıktısıdır. “Ateşledi” ise gösterime özgü ayrı bir karar kuralıdır: sigmoid çıktısı 0.5’i, ReLU çıktısı 0’ı geçince sağdaki panelde “Nöron ateşledi!” yazar; aşağıdaki tabloda geçmeyen durumlar “sessiz” diye anılır.

*Adım adım.* Başlangıç değerleriyle bekçinin hesabını kendin yürüt.

1. Her girdiyi ağırlığıyla çarp: 0.7 × 0.60 = 0.42; −0.5 × 0.30 = −0.15; 0.9 × 0.80 = 0.72.
2. Üçünü topla: 0.42 − 0.15 + 0.72 = 0.99. Sabit terimi ekle: 0.99 − 0.3 = 0.69. Şekildeki “Ağırlıklı toplam = 0.69” satırı bu sayıdır.
3. Sigmoid ile çıktı 1 / (1 + e⁻⁰·⁶⁹) = 0.666 olur. Bu değer karar eşiği 0.5’in üstünde; nöron ateşler.
4. ReLU ile çıktı max(0, 0.69) = 0.690 olur: artı toplam olduğu gibi geçer. Sıfırdan büyük olduğu için yine ateşler.
5. x₂’yi 1.00’a çıkar. Ağırlığı eksi olduğu için toplam düşer: 0.42 − 0.50 + 0.72 − 0.3 = 0.34. Sigmoid 0.584 verir; nöron hâlâ ateşler ama daha zayıf.
6. Bu kez x₂’yi 0.30’a geri al, x₃’ü sıfırla. Toplam 0.42 − 0.15 + 0 − 0.3 = −0.03 olur. Sigmoid 0.493, ReLU 0.000; iki durumda da nöron sessiz kalır. Sessiz, çıktı sıfır demek değil: sigmoid hâlâ 0.493 veriyor, yalnız 0.5 eşiğinin altında kaldı.

| x₁ | x₂ | x₃ | Ağırlıklı toplam | Sigmoid | ReLU | Durum |
|---|---|---|---|---|---|---|
| 0.60 | 0.30 | 0.80 | 0.69 | 0.666 | 0.690 | ateşler |
| 0.60 | 1.00 | 0.80 | 0.34 | 0.584 | 0.340 | ateşler |
| 0.60 | 0.30 | 0.00 | −0.03 | 0.493 | 0.000 | sessiz |
| 0.00 | 0.00 | 0.00 | −0.30 | 0.426 | 0.000 | sessiz |

Son satıra dikkat: bütün girdiler sıfırken bile toplam −0.30 çıkar. Bu, sabit terimin işidir; bekçi huyu gereği kapalı başlar. x₂ her zaman frene basar, x₁ ve x₃ ise gaza. En güçlü söz x₃’te, çünkü ağırlığı en büyük.

*Ne oluyor?* Bir nöron çok basit bir şey yapar: her girdiyi bir “önem ağırlığı”yla çarpıp toplar, sonra küçük bir sabit terim (bias) ekler. Aktivasyon fonksiyonu bu toplamı çıktıya çevirir: sigmoid 0 ile 1 arasında bir sayı verir, ReLU eksi toplamı sıfırlar, artı toplamı olduğu gibi geçirir. Çıktı 0.5’i geçince “ateşledi” demek, bu gösterime özgü bir karar kuralıdır. Girdileri değiştirdikçe toplamın ve çıktının nasıl değiştiğini görürsün.

*Kendin dene.* 1) Üç girdiyi de 1.00 yap. Ağırlıklı toplam ve sigmoid çıktısı ne olur; nöron ateşler mi? 2) Yalnız x₃ = 1.00, diğerleri 0. Toplamı ve ReLU çıktısını hesapla. 3) Yalnız x₂ = 1.00, diğerleri 0. Sigmoid çıktısı 0.5’i geçer mi? Canlı demo: [QR 4.1]

#### Teknik derinlik

Bir yapay nöron z = Σ wᵢxᵢ + b hesaplar; ardından bir aktivasyon fonksiyonu uygular: a = φ(z). Yaygın seçimler sigmoid (0–1), tanh (−1–1) ve ReLU = max(0, z)’dir. Ağırlıklar her girdinin önemini ayarlar, sabit terim (bias) ise toplamı kaydırır; ikisi de eğitimle öğrenilir.

Aktivasyonun rolü belirleyicidir: doğrusal olmayanlık eklemeseydi, kaç katman koyarsak koyalım ağ tek bir doğrusal dönüşüme eşdeğer olurdu. ReLU, basitliği ve gradyan akışını koruması nedeniyle derin ağlarda fiilî standart hâline gelmiştir.

z = Σwᵢxᵢ + b, φ(z) sigmoid ya da ReLU ile hesaplanır. Ağırlıklar w = [0.7, -0.5, 0.9], sabit terim b = -0.3. Gösterimde φ(z) karar eşiğini (sigmoid için 0.5, ReLU için 0) aşarsa “ateşledi” yazılır; bu eşik aktivasyonun parçası değil, gösterimin karar kuralıdır.

Şekildeki sigmoid σ(z) = 1 / (1 + e⁻ᶻ) biçimindedir; z = 0’da tam 0.5 verir, bu yüzden şekilde ateşleme eşiği 0.5 seçilmiştir. ReLU’da eşik doğrudan z > 0’dır. Eşik, aktivasyonun kendisi değil, çıktı üstüne konmuş bir karar kuralıdır: sigmoid eşik altında da sıfırlanmaz (−0.03 için 0.493), ReLU ise artı girdiyi olduğu gibi geçirir.

Tek nöron girdi uzayında yalnızca bir çizgi çekebilir. Onlarcasını katman katman dizersen sinyal içeriden nasıl geçer?

### 4.3 Katmanlar ve ileri besleme

Tek bekçi tek başına pek bir şey başaramaz. Ama bekçileri katlar hâlinde bir apartmana dizersen her şey değişir. Haber giriş katından çıkış katına doğru akar; aradaki “gizli” katlar, ham haberi her seferinde biraz daha işlenmiş bir hâle çevirir.

Haberin girişten çıkışa akmasına ileri besleme denir. Şekil 4.2’de girdileri açık ve kapalı hâlleriyle karşılaştır; sinyalin kattan kata ilerleyişini, hangi nöronların parladığını izle.

> **Kenar notu.** Derinliğin sırrı: ilk katmanlar basit özellikleri (kenarlar), sonraki katmanlar onların birleşimini (şekiller, nesneler) öğrenir. Kimse bunu elle programlamaz; ağ kendisi keşfeder.

**Şekil 4.2 · Canlı sinir ağı (ileri besleme)**
![Şekil 4.2](../../figures/out/tr/sekil-4-2-ffnet.svg)

*Kurulum.* Şekil iki panelden oluşur; her panelde üç katman var. Solda üç girdi kutusu; her biri ya açık (1) ya kapalı (0). Ortada dört gizli nöron, sağda iki çıktı nöronu. Bütün bağlantıların ağırlığı sabittir; değerleri aşağıdaki hesapta bulacaksın. Bu ağda sabit terim yoktur. Ağırlıklar elle seçilmiştir; iki çıktının bir sınıf anlamı yoktur. Her nöron gelen sinyalleri ağırlıklarıyla toplar ve sigmoidden geçirir. Nöron ne kadar koyu boyalıysa aktivasyonu o kadar yüksektir. Sol panel başlangıç durumunu gösterir: x₁ ve x₃ açık, x₂ kapalı. Sağ panelde yalnız x₂ açık.

*Adım adım.* Sol paneli, yani girdi [1, 0, 1] durumunu adım adım hesapla. Gizli nöronların girdi ağırlıkları sırasıyla: G1 [0.6, −0.4, 0.8], G2 [0.5, 0.7, −0.3], G3 [−0.6, 0.5, 0.6], G4 [0.3, −0.7, 0.5].

1. G1: 0.6 × 1 + (−0.4) × 0 + 0.8 × 1 = 1.40; sigmoid 0.80. Katmanın en parlak nöronu.
2. G2: 0.5 + 0 − 0.3 = 0.20; sigmoid 0.55.
3. G3: −0.6 + 0 + 0.6 = 0.00; sigmoid tam 0.50. Toplam sıfır olsa bile nöron yarı parlaklıkta kalır.
4. G4: 0.3 + 0 + 0.5 = 0.80; sigmoid 0.69.
5. Çıktı Ç1, ağırlıkları [0.7, −0.5, 0.6, 0.4]: 0.7 × 0.80 − 0.5 × 0.55 + 0.6 × 0.50 + 0.4 × 0.69 = 0.86; sigmoid 0.70.
6. Çıktı Ç2, ağırlıkları [−0.4, 0.6, 0.5, −0.6]: −0.32 + 0.33 + 0.25 − 0.41 = −0.15; sigmoid 0.46.
7. Ç1 > Ç2. Gösterimde buna ağın “tahmini” diyoruz; şekilde en koyu kutu odur. Ç1 ile Ç2 bir sınıfı temsil etmiyor; gösterim bir görevin öğrenildiğini kanıtlamaz.

Sağ panelde yalnız x₂ açık; aynı işlemin sonucu aşağıdaki tabloda.

| Girdi | G1 | G2 | G3 | G4 | Ç1 | Ç2 | Tahmin |
|---|---|---|---|---|---|---|---|
| [1, 0, 1] | 0.80 | 0.55 | 0.50 | 0.69 | 0.70 | 0.46 | Ç1 |
| [0, 1, 0] | 0.40 | 0.67 | 0.62 | 0.33 | 0.61 | 0.59 | Ç1 |

Girdi değişince gizli katmanın parlaklık deseni tersine döner: solda G1 öne çıkarken sağda G2 ve G3 parlar. Yine de kazanan değişmez; ikinci durumda Ç1 yalnızca 0.02 farkla önde. Ağırlıklar hiç eğitilmediği için bu ağın “fikri” henüz keyfîdir.

*Ne oluyor?* Sinyal soldan sağa, katman katman ilerliyor: her nöron kendisine gelenleri toplayıp bir sonraki katmana aktarıyor. Bir nöron ne kadar parlaksa o kadar güçlü tepki vermiş demektir. En sağdaki en parlak kutuya ağın “tahmini” diyoruz; ağırlıklar elle seçildiği için bu tahminin henüz bir anlamı yok.

*Kendin dene.* 1) Bütün girdiler kapalıyken ([0, 0, 0]) dört gizli nöron hangi değeri alır? Çıktıları da hesapla. 2) Girdi [1, 1, 1] için G1’in toplamını ve sigmoid değerini bul. 3) Sekiz olası girdi düzeninden herhangi birinde Ç2 kazanır mı? Tahmin et, sonra iki tanesini hesaplayarak sına. Canlı demo: [QR 4.2]

#### Teknik derinlik

İleri beslemeli ağda her katman, bir önceki katmanın aktivasyonlarını alır: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). Girdi katmanı ham veriyi, gizli katmanlar ara temsilleri, çıktı katmanı ise tahmini taşır. Ağırlık matrisleri ve sabit terim vektörleri ağın öğrenilen parametreleridir.

Şekil 4.2’deki gösterim, elle seçilmiş sabit ağırlıklarla gerçek bir ileri besleme yapar: girdiden çıktıya hesaplama yürütülür ve nöron parlaklıkları aktivasyon değerlerini gösterir. En yüksek çıktıya gösterim gereği ağın “tahmini” diyoruz; çıkışların bir sınıf anlamı yoktur ve gösterim bir görevin öğrenildiğini kanıtlamaz. Eğitim, bu ağırlıkları ayarlama işidir; o da sıradaki adımın konusu.

a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾) katman katman hesaplanır; nöron parlaklığı aktivasyon değerini gösterir.

Şekildeki ağda W⁽¹⁾ 4 × 3, W⁽²⁾ 2 × 4 boyutundadır; b⁽¹⁾ = b⁽²⁾ = 0 alınmıştır. Toplam 12 + 8 = 20 öğrenilebilir ağırlık vardır; φ her iki katmanda sigmoiddir.

Bu ağ iki girdi düzeninde de aynı kapıyı gösterdi, çünkü ağırlıklarını kimse ayarlamadı. Ağırlıkları hataya bakarak düzeltmenin bir yolu var mı?

### 4.4 Geri yayılım: hatadan öğrenmek

Ağ işe rastgele tahminlerle başlar; ilk günkü acemiliğine şaşmamalı. Nasıl ustalaşır? Önce tahminini doğru cevapla kıyaslar, ne kadar yanıldığını ölçer; buna hata denir. Sonra bu hata, çıkıştan girişe doğru geri geri yürür ve uğradığı her bağlantıya “sen de birazcık payını düzelt” der.

Bu geri geri yürüyüşe geri yayılım denir; her bağlantının hatadaki payını hesaplar. Düzeltmeyi ayrı bir adım yapar: her ağırlık, payı oranında biraz kaydırılır (gradyan inişi). Şekil 4.3’ü tur tur oku; hatanın geriye akışını ve çıktının her turda doğru cevaba biraz daha yaklaşmasını gör. Hata küçüldükçe geriye taşınan fısıltı da zayıflar; düzeltilecek pay azalır.

> **Kenar notu.** İleri besleme “tahmin et”, geri yayılım “hatadan ders al” demektir. Bu iki adımı milyonlarca kez tekrarlamak; derin öğrenmenin özü bu.

**Şekil 4.3 · Hatadan öğren (gerçek eğitim)**
![Şekil 4.3](../../figures/out/tr/sekil-4-3-backprop.svg)

*Kurulum.* Şekil bir film şeridi gibi düzenlenmiş; her kare bir eğitim turu. Ağ küçük ama hesap gerçek: iki girdi (x₁ = 1.0, x₂ = 0.5), iki gizli nöron, tek çıktı; hepsi sigmoid. Hedef 0.8; kayıp L = ½(ŷ − 0.8)²; öğrenme oranı η = 2. Başlangıç ağırlıkları anlatım için seçilmiştir: gizli katman W₁ = [[0.3, −0.2], [0.4, 0.1]], sabit terimler 0; çıktı ağırlıkları w₂ = [0.5, −0.3], b₂ = 0. Karenin solunda ağ ve çıkıştan girişe dönen bir ok var: gradyanın geriye akışı. Ortada dikey bir çubuk ağın çıktısını (ŷ), üstündeki çizgi hedefi (0.8) gösterir. Karenin başlığında o turun hatası (hedef − ŷ) yazar. Tur 0’da ağırlıklar henüz hiç güncellenmemiştir; her tur bir ileri geçiş, bir gradyan hesabı ve bir güncellemedir.

*Adım adım.* Her kareyi sırayla oku; ilk turu kendin hesapla.

1. Tur 0, ileri geçiş: gizli nöron 1’in toplamı 0.3 · 1.0 + (−0.2) · 0.5 = 0.20, sigmoid 0.5498; nöron 2’nin toplamı 0.4 · 1.0 + 0.1 · 0.5 = 0.45, sigmoid 0.6106. Çıktı toplamı 0.5 · 0.5498 − 0.3 · 0.6106 + 0 = 0.0917; ŷ = sigmoid(0.0917) = 0.5229.
2. Tur 0, kayıp: hata 0.8 − 0.5229 = 0.2771; L = ½ · 0.2771² = 0.0384.
3. Tur 0, geri yayılım (gradyan hesabı): çıktı nöronunda δ₂ = (ŷ − 0.8) · ŷ · (1 − ŷ) = −0.2771 · 0.5229 · 0.4771 = −0.0691. Çıktı ağırlıklarının gradyanı bu sayı çarpı gizli aktivasyon: ∂L/∂w₂ = [−0.0691 · 0.5498, −0.0691 · 0.6106] = [−0.0380, −0.0422]; ∂L/∂b₂ = −0.0691. Zincir bir adım daha geriye gider: gizli nöron j için δⱼ = δ₂ · w₂ⱼ · hⱼ(1 − hⱼ), gradyan δⱼ · xᵢ.
4. Tur 0, güncelleme (optimizasyon): w ← w − η · gradyan. w₂ = [0.5 + 2 · 0.0380, −0.3 + 2 · 0.0422] = [0.5760, −0.2156]; b₂ = 0 + 2 · 0.0691 ≈ 0.1383. Gizli katman W₁ = [[0.3171, −0.1914], [0.3901, 0.0951]]. Geri yayılım gradyanı hesapladı; ağırlıkları değiştiren bu adımdır.
5. Tur 1: yeni ağırlıklarla ileri geçiş ŷ = 0.5817, hata 0.2183, kayıp 0.0238. Tek turda çıktı 5.9 puan yaklaştı.
6. Tur 2–8: aynı üç adım tekrarlanır; sayılar tabloda. Sekizinci turda ŷ = 0.7390, hata 0.0610, kayıp 0.0019.
7. Adımlar küçülüyor: ilk tur ŷ’yi 0.059 artırdı, sekizinci tur 0.010. Hata küçüldükçe gradyan da küçülür; güncelleme ona orantılı olduğu için adım kısalır.

| Tur | w₂ | b₂ | ŷ | Hata (0.8 − ŷ) | Kayıp |
|---|---|---|---|---|---|
| 0 | [0.5000, −0.3000] | 0.0000 | 0.5229 | 0.2771 | 0.0384 |
| 1 | [0.5760, −0.2156] | 0.1383 | 0.5817 | 0.2183 | 0.0238 |
| 2 | [0.6354, −0.1513] | 0.2445 | 0.6258 | 0.1742 | 0.0152 |
| 3 | [0.6818, −0.1021] | 0.3261 | 0.6585 | 0.1415 | 0.0100 |
| 4 | [0.7183, −0.0639] | 0.3897 | 0.6832 | 0.1168 | 0.0068 |
| 5 | [0.7477, −0.0335] | 0.4403 | 0.7022 | 0.0978 | 0.0048 |
| 6 | [0.7716, −0.0090] | 0.4812 | 0.7172 | 0.0828 | 0.0034 |
| 7 | [0.7914, 0.0111] | 0.5148 | 0.7292 | 0.0708 | 0.0025 |
| 8 | [0.8080, 0.0279] | 0.5427 | 0.7390 | 0.0610 | 0.0019 |

Tabloda hazır bir kural yok; her satır bir önceki satırdan gradyan ve güncellemeyle türetilmiştir. Hata sekiz turda 0.28’den 0.06’ya indi; sıfıra ulaşmadı ve bu hızla ulaşması da uzun sürer. Bu, tek bir örnek üzerinde ölçülen eğitim hatasıdır: ağın yeni örneklerdeki başarısı ayrıca sınanmalıdır. Milyonlarca örnekle gerçek eğitimde eğri bu kadar düz inmez, ara sıra yükselir bile; ama döngü aynıdır: ileri geçiş, kayıp, gradyan, güncelleme.

*Ne oluyor?* Ağ önce eğitilmemiş ağırlıklarla tahmin yapar, bu yüzden hata (kayıp) yüksektir. Her turda geri yayılım, kaybın her bağlantıya göre eğimini (gradyanı) çıkıştan girişe doğru hesaplar; sonra gradyan inişi her ağırlığı hatayı azaltacak yönde biraz kaydırır. Böyle böyle çıktı, doğru cevaba adım adım yaklaşır. Bu örnekte eğitim hatası küçüldü; ağın yeni örneklerde de başarılı olup olmadığı ayrıca sınanmalıdır.

*Kendin dene.* 1) Tur 8’in ağırlıklarıyla çıktıyı kendin hesapla: gizli aktivasyonlar h = [0.5957, 0.5994], w₂ = [0.8080, 0.0279], b₂ = 0.5427. Çıktı toplamı ve ŷ kaç; tabloyla uyuşuyor mu? 2) Tur 0’da b₂’nin gradyanı −0.0691. Öğrenme oranı 2 yerine 1 olsaydı ilk güncellemeden sonra b₂ kaç olurdu; adım nasıl değişir? 3) Tur 8’de hata 0.061. “Ağ öğrendi” diyebilir misin? Bu hatanın neyi ölçtüğüne, neyi ölçmediğine dikkat et. Canlı demo: [QR 4.3]

#### Teknik derinlik

Geri yayılım, kayıp fonksiyonunun her ağırlığa göre gradyanını zincir kuralıyla verimli biçimde hesaplar; gradyanlar çıkıştan girişe doğru katman katman geriye taşınır. Ardından gradyan inişi ağırlıkları günceller: W ← W − η·∂L/∂W.

Bu yöntem (Rumelhart, Hinton ve Williams tarafından 1986’da popülerleştirildi) derin ağların eğitilebilmesinin anahtarıdır. Şekil 4.3’teki gösterim, tek bir örnek üzerinde gerçek bir eğitim döngüsü yürütür: ileri geçiş, kayıp, zincir kuralıyla gradyan, gradyan inişiyle güncelleme; gerçek eğitim aynı döngüyü milyonlarca örnekle yineler. Geri yayılım gradyanı hesaplar; parametreleri değiştiren, optimizasyon adımıdır.

Başlangıç: ağırlıklar eğitilmemiş, kayıp yüksek. Her tur, zincir kuralıyla ∂L/∂W gradyanını çıkıştan girişe hesaplar (geri yayılım); ardından gradyan inişi W ← W − η·∂L/∂W ile günceller.

Şekildeki ağ 2-2-1 boyutundadır, bütün aktivasyonlar sigmoid; kayıp L = ½(ŷ − y)², η = 2. Çıktı nöronunda δ₂ = (ŷ − y)·ŷ(1 − ŷ); gizli nöron j için δⱼ = δ₂·w₂ⱼ·hⱼ(1 − hⱼ); gradyanlar ∂L/∂w₂ⱼ = δ₂·hⱼ, ∂L/∂b₂ = δ₂, ∂L/∂W₁ⱼᵢ = δⱼ·xᵢ. Tablodaki her satır bu formüllerle hesaplanmıştır; hazır bir eğri yoktur.

Geri yayılım her türden ağı eğitir. Ama bir fotoğrafın on binlerce pikselini düz bir katmana vermek israftır; görüntüye özel bir düzen gerekir.

### 4.5 Görüntüyü görmek: evrişimli ağlar (CNN)

Bir görüntü on binlerce pikselden oluşur; her pikseli tek tek dinlemek delilik olurdu. Evrişimli sinir ağları (CNN) daha kurnazdır: karanlık bir odada el feneri gezdirir gibi, küçük bir “filtreyi” görüntünün üzerinde dolaştırır ve yerel desenleri arar; bir kenarı, bir köşeyi.

Aşağıda fenerin görüntü üzerinde adım adım gezişini izle. Her durakta küçücük bir bölgeye bakar ve bulduklarını bir “özellik haritasına” işler. Şekil 4.4’te feneri (filtreyi) değiştirince bu kez hangi kenarları yakaladığını gör.

> **Kenar notu.** Aynı küçük filtre tüm görüntüde kullanılır (ağırlık paylaşımı). Böylece bir kenarı sol üstte de sağ altta da tanıyabilir, üstelik çok daha az parametreyle öğrenir.

**Şekil 4.4 · Evrişim: filtreyi kaydır**
![Şekil 4.4](../../figures/out/tr/sekil-4-4-conv.svg)

*Kurulum.* Şekil iki kuşaktan oluşur: üstte dikey kenar çekirdeği, altta yatay. Her kuşakta en solda 3 × 3’lük çekirdek (filtre). Ortada 7 × 7’lik görüntünün iki kopyası var; her birinde turuncu çerçeveyle seçilmiş bir durak ve o durağın küçük haritası. En sağda 25 durağın tamamı: 5 × 5’lik özellik haritası. Görüntüde koyu hücreler 1, açık hücreler 0 değerindedir; görüntü bir artı işaretidir: dördüncü satır ve dördüncü sütun baştan sona koyu. Dikey kenar çekirdeği üç satırında da [1, 0, −1] taşır; yatay kenar çekirdeği üstte [1, 1, 1], ortada sıfırlar, altta [−1, −1, −1]. Pencere soldan sağa, yukarıdan aşağıya 25 durak yapar, her durak bir hücre doldurur; seçili duraklar dikeyde 2 ve 4, yatayda 6 ve 16. Turuncu artı, siyah eksi sonuç demektir; koyuluk büyüklüğü gösterir.

*Adım adım.* Dikey kenar çekirdeğiyle ilk satırı durak durak kaydır.

1. Durak 1: pencere 1–3. satırlar, 1–3. sütunlar. Hepsi 0; toplam 0.
2. Durak 2: pencere 2–4. sütunlara kayar. Sağ sütun (görüntünün 4. sütunu) üç satırda da 1. Hesap: (1×0 + 0×0 + (−1)×1) + (1×0 + 0×0 + (−1)×1) + (1×0 + 0×0 + (−1)×1) = −3. Haritanın 2. hücresi koyu siyah: eksi.
3. Durak 3: pencere 3–5. sütunlar. Koyu sütun tam ortaya gelir; çekirdeğin orta sütunu sıfır. Toplam 0.
4. Durak 4: pencere 4–6. sütunlar. Koyu sütun bu kez solda, ağırlığı +1. Toplam +3. Haritada koyu turuncu: artı.
5. Durak 5: pencere 5–7. sütunlar. Yine hepsi 0.
6. İkinci satırda (pencere 2–4. satırlar) pencerenin son satırı artının yatay koluna gelir; orada sol ve sağ birbirini götürür. Değerler −2 ve +2’ye iner.

Yirmi beş durağın tamamı:

| Dikey çekirdek | | | | |
|---|---|---|---|---|
| 0 | −3 | 0 | 3 | 0 |
| 0 | −2 | 0 | 2 | 0 |
| 0 | −2 | 0 | 2 | 0 |
| 0 | −2 | 0 | 2 | 0 |
| 0 | −3 | 0 | 3 | 0 |

| Yatay çekirdek | | | | |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| −3 | −2 | −2 | −2 | −3 |
| 0 | 0 | 0 | 0 | 0 |
| 3 | 2 | 2 | 2 | 3 |
| 0 | 0 | 0 | 0 | 0 |

Dikey çekirdek yalnız dikey çizginin iki yanını işaretler; yatay kol haritada kaybolur. Yatay çekirdek tam tersini yapar. Eksi işaret açıktan koyuya, artı işaret koyudan açığa geçiştir. Aynı dokuz sayı bütün görüntüde dolaşır; kenar nerede olursa olsun bulunur. Görüntü bir hücre kaysa harita da bir hücre kayar: buna eşdeğişkenlik denir, değişmezlik değil.

*Ne oluyor?* Küçük bir “filtre” (büyüteç gibi) görüntünün üzerinde adım adım geziyor. Her durakta baktığı küçük bölgede aradığı deseni (mesela dikey bir kenar) bulursa orayı parlak işaretliyor. Sonuçta ortaya, o desenin görüntüde nerelerde olduğunu gösteren bir “özellik haritası” çıkıyor.

*Kendin dene.* 1) Dikey çekirdekle 22. durağı hesapla: pencere 5–7. satırlar, 2–4. sütunlar. 2) Yatay çekirdekle tam ortadaki durağı hesapla: pencere 3–5. satırlar, 3–5. sütunlar. 3) Çekirdek 3 × 3 yerine 5 × 5 olsaydı özellik haritası kaç hücre olurdu? Canlı demo: [QR 4.4]

#### Teknik derinlik

CNN’ler, paylaşılan ağırlıklı evrişim çekirdekleriyle (kernel) yerel örüntüleri tespit eder; çekirdek görüntü üzerinde kaydırılır ve her konumda eleman-yönlü çarpımların toplamı bir özellik haritası üretir. Havuzlama (pooling) ile boyut indirgenir; katmanlar derinleştikçe kenarlardan şekillere, oradan nesnelere doğru hiyerarşik temsiller öğrenilir.

Ağırlık paylaşımı ve yerel bağlantılılık parametre sayısını büyük ölçüde azaltır; evrişim ideal koşullarda ötelemeye eşdeğişken özellik haritaları üretir (girdi kayınca harita da kayar), havuzlama gibi işlemler ise küçük kaymalara karşı yaklaşık değişmezlik kazandırabilir. LeNet (LeCun) bu mimarinin öncüsü oldu; AlexNet (2012) ise CNN’leri büyük ölçekte görünür kıldı. Şekil 4.4’teki gösterim gerçek bir evrişim işlemini gösterir.

Seçili çekirdek görüntü üzerinde 3×3 pencerelerle gezinir; dikey kenar çekirdeği dikey sınırları vurgular.

Şekildeki işlem (I ∗ K)(r, c) = Σᵢ Σⱼ K(i, j) · I(r + i, c + j), i, j ∈ {0, 1, 2} biçimindedir. Dolgu (padding) yok, adım (stride) 1; bu yüzden 7 × 7 görüntü ve 3 × 3 çekirdekten (7 − 3 + 1) = 5 boyutunda harita çıkar. Dokuz ağırlık 25 konumda paylaşılır. Çekirdek çevrilmeden uygulanır; bu işlem matematikteki adıyla çapraz korelasyondur, derin öğrenme literatüründe evrişim diye anılır. Dikey çekirdek simetrik olmadığından çevrilseydi haritanın işaretleri ters dönerdi.

Evrişim uzaydaki komşuluğu yakalar. Komşuluk zaman içindeyse, bir cümlede kelimelerin sırasını ağ nasıl taşır?

### 4.6 Diziyi anlamak: yinelemeli sinir ağları (RNN)

Bir masalı dinleyen çocuğu düşün: her yeni cümleyi, öncekilerin hatırasıyla dinler; yoksa hikâye dağılır. Metin, müzik, konuşma da böyledir: hepsi birer dizidir ve sıra önemlidir. İngilizcede “the dog bit the man” ile “the man bit the dog” aynı kelimeleri taşır ama bambaşka şeyler anlatır. Türkçede kimin kimi ısırdığını hâl ekleri söyler (“köpek adamı” / “adam köpeği”); sıra ise vurguyu değiştirir: “Köpek adamı ısırdı” ile “Adamı köpek ısırdı”. Yinelemeli sinir ağları (RNN) bu yüzden yanlarında bir hafıza taşır.

RNN diziyi kelime kelime dinler ve her adımda hafızasını tazeler; böylece geçmişi unutmadan ilerler. Aşağıda kelimelerin sırayla verilişini ve hafızanın her adımda nasıl değiştiğini izle.

> **Kenar notu.** RNN’in özü tek bir cümlede: “her yeni girdiyi, o ana kadar gördüklerinin hafızasıyla birlikte işle.” Aynı hücre tekrar tekrar kullanıldığı için diziye “döngüsel” bakar.

**Şekil 4.5 · Hafızalı işleme (gerçek yineleme)**
![Şekil 4.5](../../figures/out/tr/sekil-4-5-rnn.svg)

*Kurulum.* Şekil altı kareden oluşur; kare 0’dan kare 5’e. Her karenin üstünde beş kelimelik cümle var: “Kedi kaçtı çünkü o korkmuştu”. İşlenmiş kelimeler koyu boyalı. Altta dört çubuk gizli durumu, yani ağın hafızasını gösterir; her biri −1 ile 1 arasında bir sayıdır (tanh çıktısı), yukarı artı, aşağı eksi. Karenin başlığında kaç kelimenin işlendiği yazar. Kare 0’da dört çubuk da sıfırdır: h₀ = 0. Sayılar gerçekten hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁) ile hesaplanır; Wₓ (4 × 5) ve Wₕ (4 × 4) anlatım için seçilmiş sabit ağırlıklardır, eğitilmemiştir.

*Adım adım.* Kareleri soldan sağa oku; ilk iki adımı kendin hesapla. Her kelime bir birim vektördür: “Kedi” [1, 0, 0, 0, 0], “kaçtı” [0, 1, 0, 0, 0] ve böyle gider. Wₓxₜ bu yüzden Wₓ’in t. sütunudur.

1. Kare 0, “0 kelime işlendi”: h₀ = [0, 0, 0, 0]. Dört çubuk da sıfırda.
2. Kare 1, “Kedi” işlendi: Wₓ’in 1. sütunu [0.9, −0.6, 0.2, −0.8]; Wₕh₀ = 0. h₁ = tanh([0.9, −0.6, 0.2, −0.8]) = [0.72, −0.54, 0.20, −0.66].
3. Kare 2, “kaçtı” işlendi: Wₓ’in 2. sütunu [−0.4, 0.8, −0.5, 0.3]. Bu kez hafıza da konuşur: Wₕh₁ = [0.56, −0.44, −0.14, 0.02]. Toplam [0.16, 0.36, −0.64, 0.32]; h₂ = [0.16, 0.34, −0.57, 0.31]. İkinci kelime birinciyi silmedi; onunla karıştı.
4. Kare 3, “çünkü”: h₃ = [0.16, 0.32, 0.53, −0.58]. Üçüncü bileşen eksiden artıya döndü.
5. Kare 4, “o”: h₄ = [−0.54, 0.11, 0.82, 0.68]. Kısa bir kelime bile hafızayı baştan sona yeniden şekillendirdi.
6. Kare 5, “korkmuştu”: h₅ = [0.34, −0.81, −0.16, 0.53]. Cümlenin sonunda hafızada beş kelimenin izi var; ama hiçbiri ayrı bir yerde durmuyor, hepsi aynı dört sayıya karışmış.

| Adım | Kelime | h[1] | h[2] | h[3] | h[4] |
|---|---|---|---|---|---|
| 0 | (boş) | 0.00 | 0.00 | 0.00 | 0.00 |
| 1 | Kedi | 0.72 | −0.54 | 0.20 | −0.66 |
| 2 | kaçtı | 0.16 | 0.34 | −0.57 | 0.31 |
| 3 | çünkü | 0.16 | 0.32 | 0.53 | −0.58 |
| 4 | o | −0.54 | 0.11 | 0.82 | 0.68 |
| 5 | korkmuştu | 0.34 | −0.81 | −0.16 | 0.53 |

Önemli olan tek tek sayılar değil, davranış: hafıza yalnızca birikmiyor, her adımda yeniden karılıyor. Aynı dört sayı beş kelimeyi de taşıyor; ağ her kelime için yeni bir hafıza açmıyor, elindekini güncelliyor. Ağırlıklar eğitilmediği için bu sayılar kelimelerin anlamını bilmez; eğitilmiş bir RNN’de Wₓ ve Wₕ veriden öğrenilir ve her kelime, birim vektör yerine öğrenilmiş bir sayı dizisiyle girer.

*Ne oluyor?* Ağ kelimeleri tek tek okuyor ve bir “hafıza” taşıyor. Her yeni kelimede bu hafızayı, hem yeni kelimeye hem o ana kadar biriktirdiğine bakarak günceller. Böylece sırayı hatırlar; “köpek adamı ısırdı” ile “adamı köpek ısırdı” onun için artık aynı şey değildir.

*Kendin dene.* 1) hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ) formülünde h₀ = 0 ise ilk adımda hangi terim hesaba katkı vermez? 2) Sırayı değiştir: “Kedi kaçtı o çünkü korkmuştu”. Üçüncü adımda Wₓxₜ artık hangi sütundur? h₂ aynı kalır; h₃’ü hesapla ve tablodakiyle karşılaştır. 3) Kelime sırasını umursamayan bir model “köpek adamı ısırdı” ile “adamı köpek ısırdı” cümlelerine aynı hafızayı üretir mi? RNN ne yapar? Canlı demo: [QR 4.5]

#### Teknik derinlik

RNN, her zaman adımında hₜ = φ(Wₕ·hₜ₋₁ + Wₓ·xₜ + b) ile gizli durumunu günceller; aynı ağırlıklar her adımda yeniden kullanılır (zamanda parametre paylaşımı). Bu, değişken uzunluktaki dizileri bir bağlam vektörüyle işlemeyi sağlar.

Klasik RNN’ler uzun bağımlılıklarda kaybolan gradyan sorunuyla zorlanır; LSTM (Hochreiter & Schmidhuber, 1997) ve GRU bunu kapı (gate) mekanizmalarıyla hafifletir. Çoğu modern dizi görevinde RNN’lerin yerini büyük ölçüde dikkat (attention) tabanlı transformer’lar aldı; onları da sıradaki bölümde tanıyacağız. Şekil 4.5’teki gösterim, gizli durumu hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁) denklemiyle, sabit ve eğitilmemiş ağırlıklarla adım adım gerçekten hesaplar.

Gizli durum h₀ = 0. Her adımda hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ) ile güncellenir; aynı ağırlıklar her kelimede yeniden kullanılır.

Şekildeki dört çubuk 4 boyutlu bir gizli durum vektörüdür. Ağırlıklar: Wₓ satırları [0.9, −0.4, 0.3, −0.7, 0.5], [−0.6, 0.8, −0.2, 0.4, −0.9], [0.2, −0.5, 0.7, 0.6, −0.3], [−0.8, 0.3, −0.6, 0.9, 0.1]; Wₕ satırları [0.5, −0.3, 0.2, 0.0], [0.1, 0.4, −0.5, 0.3], [−0.2, 0.6, 0.3, −0.4], [0.3, −0.1, 0.4, 0.5]. Bunlar anlatım için seçilmiş sabitlerdir, eğitilmemiştir; gerçek bir uygulamada xₜ kelimenin gömme (embedding) vektörüdür ve Wₓ, Wₕ eğitimle öğrenilir.

Buraya kadar ağlar hep tanıdı: nöron ateşledi, kenar bulundu, dizi hatırlandı. Bir ağ hiç görmediği bir yüzü sıfırdan üretebilir mi?

### 4.7 Sahteciliğin sanatı: GAN

Bazen amaç tanımak değil, üretmektir: gerçekçi yüzler, manzaralar, sesler. Üretken çekişmeli ağların (GAN) hilesi, bir kalpazanla bir dedektifi aynı odaya kilitlemektir. Kalpazan (üretici) sahte örnekler üretir; dedektif (ayırt edici) gerçeği sahteden ayırmaya çalışır.

İkisi durmadan yarışır: dedektif yakaladıkça kalpazan ustalaşır, kalpazan ustalaştıkça dedektif keskinleşir. Şekil 4.6’yı tur tur oku; gürültüden ibaret görüntünün, kalpazan piştikçe gerçeğe nasıl yaklaştığını gör.

> **Kenar notu.** GAN’da iyi sahte üretmek ile sahteyi yakalamak birbirini sürekli iter. Kalpazanla dedektifin yarışı gibi; ikisi de geliştikçe sonuç giderek gerçeğe yaklaşır.

**Şekil 4.6 · Üretici vs Ayırt edici**
![Şekil 4.6](../../figures/out/tr/sekil-4-6-gan.svg)

*Kurulum.* Şekil dokuz kareden oluşan bir film şerididir; tur 0’dan tur 8’e. Bu şerit temsilidir: görüntüler de yüzdeler de anlatım için önceden belirlenmiştir, eğitilmiş bir ağdan ölçülmemiştir. Her karede solda üreticinin çizdiği 8 × 8’lik görüntü var: koyu ve açık pikseller. Üreticinin öğrenmeye çalıştığı “gerçek” görüntü şeridin üstünde durur: ortası dolu bir daire; 64 pikselin 24’ü koyu. Sağda ayırt edicinin kararı yazar: görüntünün sahte olma olasılığı ve tek kelimelik hüküm. Yüzde 50’nin üstü “Sahte!”, altı “Gerçek?”.

*Adım adım.* Kareleri sırayla oku.

1. Tur 0: Üretici saf gürültü çiziyor; 64 pikselin yalnız 31’i hedefle uyuşuyor, yazı tura kadar. Dedektif kesin: sahte olasılığı yüzde 95, hüküm “Sahte!”.
2. Tur 1 ve 2: Olasılık yüzde 84’e, sonra 73’e iner. Görüntüde dairenin ilk izleri belirir; uyuşan piksel 34, sonra 36.
3. Tur 3 ve 4: Yüzde 62 ve 51. Uyuşan piksel 40 ve 45. Dedektif hâlâ “Sahte!” diyor ama zar zor; yüzde 51, sınırın hemen üstü.
4. Tur 5: Olasılık yüzde 40’a düşer, hüküm “Gerçek?” olur. Dedektif ilk kez kandırılır. Uyuşan piksel 50.
5. Tur 6 ve 7: Yüzde 29 ve 18. Daire artık seçiliyor; uyuşan piksel 54 ve 60.
6. Tur 8: Yüzde 7, hüküm “Gerçek?”. 64 pikselin 64’ü yerinde; şeritte üretici hedefi tam tutturdu. Yüzde 7 temsili bir sayıdır, ölçülmüş bir olasılık değil.

| Tur | Sahte olasılığı | Hüküm | Uyuşan piksel |
|---|---|---|---|
| 0 | %95 | Sahte! | 31 / 64 |
| 1 | %84 | Sahte! | 34 / 64 |
| 2 | %73 | Sahte! | 36 / 64 |
| 3 | %62 | Sahte! | 40 / 64 |
| 4 | %51 | Sahte! | 45 / 64 |
| 5 | %40 | Gerçek? | 50 / 64 |
| 6 | %29 | Gerçek? | 54 / 64 |
| 7 | %18 | Gerçek? | 60 / 64 |
| 8 | %7 | Gerçek? | 64 / 64 |

Her tur olasılık 11 puan düşer; bu, şeridin sabit kuralıdır, bir eğitim sonucu değil. Gerçek eğitimde dedektif de aynı anda keskinleşir ve düşüş böyle düz bir çizgi izlemez. Kuramsal hedef de yüzde 7 değildir: ideal dengede ayırt edici gerçekle sahteyi ayıramaz, her görüntüye yüzde 50 verir.

*Ne oluyor?* İki ağ yarışıyor: biri (üretici) sahte görüntü üretiyor, öteki (ayırt edici) bunun sahte mi gerçek mi olduğunu yakalamaya çalışıyor. Başta kalpazan acemidir, kolayca yakalanır. Her turda üretici biraz daha iyi sahte yapmayı öğrenir ve “sahte” olasılığı düşer; kalpazanla dedektifin yarışı gibi. Bu gösterimde görüntü de yüzde de önceden belirlenmiştir; gerçek eğitimde iki ağ birlikte öğrenir ve ideal dengede ayırt edici gerçekle sahteyi ayırt edemez.

*Kendin dene.* 1) Hüküm hangi turda “Sahte!”den “Gerçek?”e döner ve o turdaki olasılık nedir? 2) Tur 8’deki yüzde 7 nasıl bulunur; kuralı yazıp hesapla. 3) Dedektif her görüntüye tam yüzde 50 derse bu neyin işaretidir? Canlı demo: [QR 4.6]

#### Teknik derinlik

GAN’lar (Goodfellow vd., 2014) iki ağı çekişmeli (adversarial) bir oyunda eğitir: üretici G, rastgele gürültüden örnekler üretir; ayırt edici D ise gerçek ile üretilen örnekleri ayırmaya çalışır. G, D’yi kandırma olasılığını en üst düzeye çıkaracak; D ise hata yapmamak için eş zamanlı eğitilir.

Eğitim bir min-maks oyunudur; denge noktasında üretici örnekleri gerçek dağılımdan ayırt edilemez hâle gelir. GAN’lar fotogerçekçi görüntülerde çığır açtı; günümüzde difüzyon modelleri de yaygın bir alternatiftir (Bölüm 5). Şekil 4.6’daki gösterimde görüntü ve yüzde önceden belirlenmiştir; ölçülmüş eğitim sonucu değildir. İdeal GAN dengesinde ayırt edici gerçek ve üretilmiş örnekleri ayırt edemez.

Başlangıç: G rastgele gürültü üretir, D bunu kolayca sahte olarak işaretler (sahte olasılığı yüksek). Üretici ustalaştıkça sahte olasılığı düşer.

Oyunun amaç fonksiyonu min_G max_D V(D, G) = 𝔼ₓ[log D(x)] + 𝔼_z[log(1 − D(G(z)))] biçimindedir; kuramsal optimumda, üretici veri dağılımını yakaladığında, optimal ayırt edici her örneğe D(x) = 1/2 verir. Tek başına 1/2 çıktısı bu optimuma ulaşıldığını göstermez; eğitilmemiş bir ayırt edici de aynı değeri verebilir. Şekilde sahte olasılığı p(r) = 95 − 11·r yüzdesiyle, görüntü ise r. turda piksellerin yaklaşık r/8’inin hedefe kilitlenmesiyle üretilir; ikisi de temsilidir, bir eğitimden ölçülmemiştir.

Ağlar tanımayı da üretmeyi de öğrendi. Bugünün sohbet eden, resim çizen sistemleri ise bir adım ötede: dikkat mekanizması ve transformer’lar. Sırada onlar var.

### 4.8 Kendini test et

*Cevaplar kitabın sonunda.*
1. Bir yapay nöron ne hesaplar?
   a) Sadece girdilerin ortalaması
   b) Girdilerin ağırlıklı toplamı + sabit terim, sonra aktivasyon
   c) Rastgele bir sayı
   d) Girdileri olduğu gibi kopyalar

2. Bir sinir ağını “derin” yapan nedir?
   a) Çok hızlı çalışması
   b) Çok sayıda gizli katman
   c) Tek bir nöronu olması
   d) İnternete bağlı olması

3. Aktivasyon fonksiyonu hiç olmasaydı ne olurdu?
   a) Ağ daha hızlı olurdu
   b) Ağ tek bir doğrusal işleve çökerdi
   c) Hiçbir şey değişmezdi
   d) Ağ daha güçlü olurdu

4. Geri yayılım ne yapar?
   a) Yeni katman ekler
   b) Kaybın her ağırlığa göre gradyanını çıkıştan girişe doğru hesaplar
   c) Görüntüyü büyütür
   d) Veriyi siler

5. CNN’ler özellikle hangi veride güçlüdür?
   a) Tek bir sayı
   b) Şifreler
   c) Tablolar
   d) Görüntü

6. GAN’da çekişen iki ağ hangileridir?
   a) Girdi ve Çıktı
   b) CNN ve RNN
   c) Üretici ve Ayırt edici
   d) Öğretmen ve Öğrenci

### Bu bölümden kalanlar

- Yapay nöron beynin kaba bir matematik taklididir; güç tek nöronda değil, milyonlarcasının birlikte kurduğu örüntüdedir.
- Bir nöron girdileri ağırlıkla tartar, toplar, sabit terim ekler ve aktivasyondan geçirir; w = [0.7, −0.5, 0.9] ile 0.69’luk toplam sigmoidde 0.666 verir ve nöron ateşler.
- Katmanlar hâlinde dizilen nöronlarda sinyal girişten çıkışa akar; buna ileri besleme denir ve en yüksek çıktı ağın tahmini sayılır; eğitilmemiş ağda bu tahminin anlamı yoktur.
- Aktivasyon olmasaydı kaç katman olursa olsun ağ tek bir doğrusal işleve çökerdi.
- Geri yayılım kaybın her ağırlığa göre gradyanını çıkıştan girişe hesaplar; gradyan inişi ağırlıkları günceller. Şekil 4.3’te hata sekiz turda 0.28’den 0.06’ya indi.
- Evrişimli ağlar küçük bir çekirdeği bütün görüntüde gezdirir; aynı dokuz sayı kenarı nerede olursa olsun bulur.
- Yinelemeli sinir ağları her kelimeyi önceki hafızayla birlikte işler; GAN’da ise üretici ile ayırt edici birbirini iterek gerçeğe yaklaşır.

<!-- SOURCE-CHANGES
Kafanın içinde milyarlarca minik haberci yaşar: nöronlar. Her biri komşularının fısıltısını dinler; fısıltılar yeterince güçlenince o da bağırır ve haberi bir sonrakine iletir. Araştırmacılar bu basit oyuna bakıp sormuş: Ya bunun kabataslak bir matematik taklidini yapsak? ||| Kafanın içinde milyarlarca minik haberci yaşar: nöronlar. Her biri komşularının fısıltısını dinler; fısıltılar yeterince güçlenince o da bağırır ve haberi bir sonrakine iletir. Araştırmacılar bu basit oyuna bakıp sormuş: ya bunun kabataslak bir matematik taklidini yapsak?
Yapay sinir ağları işte bu sorudan doğdu. Tek tek “yapay nöronları” katman katman dizince, ortaya şaşılacak kadar güçlü bir öğrenme makinesi çıkıyor. Katmanlar çoğaldıkça adı da değişiyor: derin öğrenme. Bu bölümde tek bir habercinin başına oturacağız; sonra koca bir ağa, oradan görüntü ve dizi işleyen özel ağlara uzanacağız. ||| Yapay sinir ağları bu sorudan doğdu. Tek tek “yapay nöronları” katman katman dizince, ortaya beklenmedik ölçüde güçlü bir öğrenme makinesi çıkıyor. Katmanlar çoğaldıkça adı da değişiyor: derin öğrenme. Önce tek bir habercinin başına oturacağız; sonra koca bir ağa, oradan görüntü ve dizi işleyen özel ağlara uzanacağız.
“Yapay nöron” beynin gerçek bir kopyası değil; çok kaba bir matematiksel benzetmedir. Güç tek bir nöronda değil, milyonlarcasının birlikte oluşturduğu örüntülerdedir. ||| Yapay nöron beynin gerçek bir kopyası değil; çok kaba bir matematiksel benzetmedir. Güç tek bir nöronda değil, milyonlarcasının birlikte oluşturduğu örüntülerdedir.
Derin öğrenme, çok sayıda gizli katmanın üst üste konmasıdır; bu derinlik, ham veriden giderek soyut temsiller (kenar → şekil → nesne) öğrenmeyi sağlar. Şunu da bilmek gerekir: aktivasyon fonksiyonları olmadan üst üste konan doğrusal katmanlar tek bir doğrusal işleve çöker; derinliği anlamlı kılan şey doğrusal olmayanlıktır. Alan, 2012’de AlexNet’in ImageNet’teki sıçramasıyla modern çağına girdi. ||| Derin öğrenme, çok sayıda gizli katmanın üst üste konmasıdır; bu derinlik, ham veriden giderek soyut temsiller (kenar → şekil → nesne) öğrenmeyi sağlar. Aktivasyon fonksiyonları olmadan üst üste konan doğrusal katmanlar tek bir doğrusal işleve çöker; derinliği anlamlı kılan şey doğrusal olmayanlıktır. Alan, 2012’de AlexNet’in ImageNet’teki sıçramasıyla modern çağına girdi.
Yapay nöronu bir kapı bekçisi gibi düşün. Kapısına birkaç haber gelir; bekçi her habere bir önem verir (buna ağırlık denir), hepsini toplar, üstüne kendi huyunu ekler (sapma, yani bias). Toplam belli bir eşiği aşarsa zili çalar; işte “aktivasyon” denen şey bu karardır. ||| Yapay nöronu bir kapı bekçisi gibi düşün. Kapısına birkaç haber gelir; bekçi her habere bir önem verir (buna ağırlık denir), hepsini toplar, üstüne kendi huyunu ekler (sapma, yani bias). Toplam belli bir eşiği aşarsa zili çalar; aktivasyon denen şey bu karardır.
a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾) katman katman hesaplanır; nöron parlaklığı aktivasyon değerini gösterir. En yüksek çıktı ağın tahminidir. ||| a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾) katman katman hesaplanır; nöron parlaklığı aktivasyon değerini gösterir.
Ağ işe rastgele tahminlerle başlar; ilk günkü acemiliğine şaşmamalı. Peki nasıl ustalaşır? Önce tahminini doğru cevapla kıyaslar, ne kadar yanıldığını ölçer: İşte hata. Sonra bu hata, çıkıştan girişe doğru geri geri yürür ve uğradığı her bağlantıya “sen de birazcık payını düzelt” der. ||| Ağ işe rastgele tahminlerle başlar; ilk günkü acemiliğine şaşmamalı. Nasıl ustalaşır? Önce tahminini doğru cevapla kıyaslar, ne kadar yanıldığını ölçer; buna hata denir. Sonra bu hata, çıkıştan girişe doğru geri geri yürür ve uğradığı her bağlantıya “sen de birazcık payını düzelt” der.
İleri besleme “tahmin et”, geri yayılım “hatadan ders al” demektir. Bu iki adımı milyonlarca kez tekrarlamak; derin öğrenmenin bütün büyüsü aslında bundan ibaret. ||| İleri besleme “tahmin et”, geri yayılım “hatadan ders al” demektir. Bu iki adımı milyonlarca kez tekrarlamak; derin öğrenmenin özü bu.
Bir görüntü on binlerce pikselden oluşur; her pikseli tek tek dinlemek delilik olurdu. Evrişimli sinir ağları (CNN) daha kurnazdır: Karanlık bir odada el feneri gezdirir gibi, küçük bir “filtreyi” görüntünün üzerinde dolaştırır ve yerel desenleri arar; bir kenarı, bir köşeyi. ||| Bir görüntü on binlerce pikselden oluşur; her pikseli tek tek dinlemek delilik olurdu. Evrişimli sinir ağları (CNN) daha kurnazdır: karanlık bir odada el feneri gezdirir gibi, küçük bir “filtreyi” görüntünün üzerinde dolaştırır ve yerel desenleri arar; bir kenarı, bir köşeyi.
Seçili çekirdek görüntü üzerinde 3×3 pencerelerle gezinir; her konumda eleman-yönlü çarpımların toplamı özellik haritasını oluşturur. Dikey kenar çekirdeği dikey sınırları vurgular. ||| Seçili çekirdek görüntü üzerinde 3×3 pencerelerle gezinir; dikey kenar çekirdeği dikey sınırları vurgular.
Bir masalı dinleyen çocuğu düşün: Her yeni cümleyi, öncekilerin hatırasıyla dinler; yoksa hikâye dağılır. Metin, müzik, konuşma da böyledir: Hepsi birer dizidir ve sıra önemlidir. “Köpek adamı ısırdı” ile “Adam köpeği ısırdı” aynı kelimeleri taşır ama bambaşka şeyler anlatır. İşte bu yüzden özyinelemeli ağlar (RNN) yanlarında bir “hafıza” taşır. ||| Bir masalı dinleyen çocuğu düşün: her yeni cümleyi, öncekilerin hatırasıyla dinler; yoksa hikâye dağılır. Metin, müzik, konuşma da böyledir: hepsi birer dizidir ve sıra önemlidir. “Köpek adamı ısırdı” ile “Adam köpeği ısırdı” aynı kelimeleri taşır ama bambaşka şeyler anlatır. Özyinelemeli ağlar (RNN) bu yüzden yanlarında bir hafıza taşır.
İkisi durmadan yarışır: Dedektif yakaladıkça kalpazan ustalaşır, kalpazan ustalaştıkça dedektif keskinleşir. Şekil 4.6’da tur tur ilerle; gürültüden ibaret görüntünün, kalpazan piştikçe gerçeğe nasıl yaklaştığını izle. ||| İkisi durmadan yarışır: dedektif yakaladıkça kalpazan ustalaşır, kalpazan ustalaştıkça dedektif keskinleşir. Şekil 4.6’da tur tur ilerle; gürültüden ibaret görüntünün, kalpazan piştikçe gerçeğe nasıl yaklaştığını izle.
GAN’ın güzelliği şurada: “iyi sahte üretmek” ile “sahteyi yakalamak” birbirini sürekli iter. Kalpazanla dedektifin yarışı gibi; ikisi de geliştikçe sonuç şaşılacak kadar gerçekçi olur. ||| GAN’da iyi sahte üretmek ile sahteyi yakalamak birbirini sürekli iter. Kalpazanla dedektifin yarışı gibi; ikisi de geliştikçe sonuç giderek gerçeğe yaklaşır.
Başlangıç: G rastgele gürültü üretir, D bunu kolayca sahte olarak işaretler (sahte olasılığı yüksek). Eğitim min-maks çekişmeli oyununu başlatır; üretici ustalaştıkça sahte olasılığı düşer. ||| Başlangıç: G rastgele gürültü üretir, D bunu kolayca sahte olarak işaretler (sahte olasılığı yüksek). Üretici ustalaştıkça sahte olasılığı düşer.
Yapay sinir ağları, biyolojik nöronlardan yalnızca gevşek biçimde esinlenir; özünde, katmanlı biçimde düzenlenmiş doğrusal olmayan dönüşümler yığınıdır. Her yapay nöron, girdilerin ağırlıklı toplamına bir sapma (bias) ekler ve sonucu bir aktivasyon fonksiyonundan geçirir. ||| Yapay sinir ağları, biyolojik nöronlardan yalnızca gevşek biçimde esinlenir; özünde, katmanlı biçimde düzenlenmiş doğrusal olmayan dönüşümler yığınıdır. Her yapay nöron, girdilerin ağırlıklı toplamına bir sabit terim (bias) ekler ve sonucu bir aktivasyon fonksiyonundan geçirir.
Yapay nöronu bir kapı bekçisi gibi düşün. Kapısına birkaç haber gelir; bekçi her habere bir önem verir (buna ağırlık denir), hepsini toplar, üstüne kendi huyunu ekler (sapma, yani bias). Toplam belli bir eşiği aşarsa zili çalar; aktivasyon denen şey bu karardır. ||| Yapay nöronu bir kapı bekçisi gibi düşün. Kapısına birkaç haber gelir; bekçi her habere bir önem verir (buna ağırlık denir), hepsini toplar, üstüne kendi huyunu ekler (sabit terim, yani bias). Toplamı bir süzgeçten geçirip bir çıktıya çevirir; aktivasyon denen şey bu süzgeçtir. Zilin çalıp çalmadığına ise ayrı bir kuralla karar verilir: çıktı bir eşiği aşıyor mu?
Nöronun yaptığı tek şey: “girdileri tart, topla, bir eşikten geçir.” Bu kadar basit bir işlem, milyonlarca kez tekrarlandığında yüz tanıyabiliyor, metin yazabiliyor. ||| Nöronun yaptığı tek şey: “girdileri tart, topla, bir aktivasyon fonksiyonundan geçir.” Bu kadar basit bir işlem, milyonlarca kez tekrarlandığında yüz tanıyabiliyor, metin yazabiliyor.
Bir yapay nöron z = Σ wᵢxᵢ + b hesaplar; ardından bir aktivasyon fonksiyonu uygular: a = φ(z). Yaygın seçimler sigmoid (0–1), tanh (−1–1) ve ReLU = max(0, z)’dir. Ağırlıklar her girdinin önemini, sapma ise eşiği ayarlar; ikisi de eğitimle öğrenilir. ||| Bir yapay nöron z = Σ wᵢxᵢ + b hesaplar; ardından bir aktivasyon fonksiyonu uygular: a = φ(z). Yaygın seçimler sigmoid (0–1), tanh (−1–1) ve ReLU = max(0, z)’dir. Ağırlıklar her girdinin önemini ayarlar, sabit terim (bias) ise toplamı kaydırır; ikisi de eğitimle öğrenilir.
Bir nöron çok basit bir şey yapar: her girdiyi bir “önem ağırlığı”yla çarpıp toplar, sonra küçük bir eşik değeri (sapma) ekler. Bu toplam yeterince büyükse nöron “ateşler”, yani güçlü bir çıktı verir. Kaydıraçları oynattıkça toplamın ve çıktının nasıl değiştiğini görürsün. ||| Bir nöron çok basit bir şey yapar: her girdiyi bir “önem ağırlığı”yla çarpıp toplar, sonra küçük bir sabit terim (bias) ekler. Aktivasyon fonksiyonu bu toplamı çıktıya çevirir: sigmoid 0 ile 1 arasında bir sayı verir, ReLU eksi toplamı sıfırlar, artı toplamı olduğu gibi geçirir. Çıktı 0.5’i geçince “ateşledi” demek, bu gösterime özgü bir karar kuralıdır. Kaydıraçları oynattıkça toplamın ve çıktının nasıl değiştiğini görürsün.
z = Σwᵢxᵢ + b, φ(z) sigmoid ya da ReLU ile hesaplanır. Ağırlıklar w = [0.7, -0.5, 0.9], sapma b = -0.3. Aktivasyon eşiği aşarsa nöron ateşler. ||| z = Σwᵢxᵢ + b, φ(z) sigmoid ya da ReLU ile hesaplanır. Ağırlıklar w = [0.7, -0.5, 0.9], sabit terim b = -0.3. Gösterimde φ(z) karar eşiğini (sigmoid için 0.5, ReLU için 0) aşarsa “ateşledi” yazılır; bu eşik aktivasyonun parçası değil, gösterimin karar kuralıdır.
İleri beslemeli ağda her katman, bir önceki katmanın aktivasyonlarını alır: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). Girdi katmanı ham veriyi, gizli katmanlar ara temsilleri, çıktı katmanı ise tahmini taşır. Ağırlık matrisleri ve sapma vektörleri ağın öğrenilen parametreleridir. ||| İleri beslemeli ağda her katman, bir önceki katmanın aktivasyonlarını alır: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). Girdi katmanı ham veriyi, gizli katmanlar ara temsilleri, çıktı katmanı ise tahmini taşır. Ağırlık matrisleri ve sabit terim vektörleri ağın öğrenilen parametreleridir.
Aşağıdaki demo gerçek bir ileri besleme yapar: sabit ağırlıklarla girdiden çıktıya hesaplama yürütülür ve nöron parlaklıkları aktivasyon değerlerini gösterir. En yüksek çıktı, ağın “tahmini”dir. Eğitim, bu ağırlıkları ayarlama işidir; o da sıradaki adımın konusu. ||| Aşağıdaki demo, elle seçilmiş sabit ağırlıklarla gerçek bir ileri besleme yapar: girdiden çıktıya hesaplama yürütülür ve nöron parlaklıkları aktivasyon değerlerini gösterir. En yüksek çıktıya gösterim gereği ağın “tahmini” diyoruz; çıkışların bir sınıf anlamı yoktur ve gösterim bir görevin öğrenildiğini kanıtlamaz. Eğitim, bu ağırlıkları ayarlama işidir; o da sıradaki adımın konusu.
Sinyal soldan sağa, katman katman ilerliyor: her nöron kendisine gelenleri toplayıp bir sonraki katmana aktarıyor. Bir nöron ne kadar parlaksa o kadar güçlü tepki vermiş demektir. En sağdaki en parlak kutu da ağın nihai tahminidir. ||| Sinyal soldan sağa, katman katman ilerliyor: her nöron kendisine gelenleri toplayıp bir sonraki katmana aktarıyor. Bir nöron ne kadar parlaksa o kadar güçlü tepki vermiş demektir. En sağdaki en parlak kutuya ağın “tahmini” diyoruz; ağırlıklar elle seçildiği için bu tahminin henüz bir anlamı yok.
Bu geri geri yürüyüşe geri yayılım denir. “Eğit”e bas; hatanın geriye akışını ve çıktının her turda doğru cevaba biraz daha yaklaşmasını izle. Hata küçüldükçe geriye taşınan fısıltı da zayıflar; düzeltilecek pay kalmaz. ||| Bu geri geri yürüyüşe geri yayılım denir; her bağlantının hatadaki payını hesaplar. Düzeltmeyi ayrı bir adım yapar: her ağırlık, payı oranında biraz kaydırılır (gradyan inişi). “Eğit”e bas; hatanın geriye akışını ve çıktının her turda doğru cevaba biraz daha yaklaşmasını izle. Hata küçüldükçe geriye taşınan fısıltı da zayıflar; düzeltilecek pay azalır.
Bu yöntem (Rumelhart, Hinton ve Williams tarafından 1986’da popülerleştirildi) derin ağların eğitilebilmesinin anahtarıdır. Aşağıdaki gösterim, hatanın geriye akışını ve çıktının hedefe yakınsamasını niteliksel olarak canlandırır; gerçek eğitim aynı döngüyü milyonlarca örnekle yineler. ||| Bu yöntem (Rumelhart, Hinton ve Williams tarafından 1986’da popülerleştirildi) derin ağların eğitilebilmesinin anahtarıdır. Aşağıdaki gösterim, tek bir örnek üzerinde gerçek bir eğitim döngüsü yürütür: ileri geçiş, kayıp, zincir kuralıyla gradyan, gradyan inişiyle güncelleme; gerçek eğitim aynı döngüyü milyonlarca örnekle yineler. Geri yayılım gradyanı hesaplar; parametreleri değiştiren, optimizasyon adımıdır.
Ağ önce rastgele tahmin yapar, bu yüzden hata (kayıp) yüksektir. “Eğit”e her bastığında ağ, hatayı çıkıştan girişe doğru geriye yayar ve her bağlantıyı hatayı biraz azaltacak yönde ayarlar. Böyle böyle çıktı, doğru cevaba adım adım yaklaşır. ||| Ağ önce eğitilmemiş ağırlıklarla tahmin yapar, bu yüzden hata (kayıp) yüksektir. “Eğit”e her bastığında geri yayılım, kaybın her bağlantıya göre eğimini (gradyanı) çıkıştan girişe doğru hesaplar; sonra gradyan inişi her ağırlığı hatayı azaltacak yönde biraz kaydırır. Böyle böyle çıktı, doğru cevaba adım adım yaklaşır. Bu örnekte eğitim hatası küçüldü; ağın yeni örneklerde de başarılı olup olmadığı ayrıca sınanmalıdır.
Başlangıç: ağırlıklar rastgele, kayıp yüksek. Her “Eğit”, zincir kuralıyla ∂L/∂W gradyanını çıkıştan girişe taşır ve W ← W − η·∂L/∂W ile günceller. ||| Başlangıç: ağırlıklar eğitilmemiş, kayıp yüksek. Her “Eğit”, zincir kuralıyla ∂L/∂W gradyanını çıkıştan girişe hesaplar (geri yayılım); ardından gradyan inişi W ← W − η·∂L/∂W ile günceller.
Ağırlık paylaşımı ve yerel bağlantılılık, parametre sayısını büyük ölçüde azaltır ve öteleme değişmezliği kazandırır. LeNet (LeCun) bu mimarinin öncüsü oldu; AlexNet (2012) ise CNN’leri büyük ölçekte görünür kıldı. Aşağıdaki demo gerçek bir evrişim işlemini gösterir. ||| Ağırlık paylaşımı ve yerel bağlantılılık parametre sayısını büyük ölçüde azaltır; evrişim ideal koşullarda ötelemeye eşdeğişken özellik haritaları üretir (girdi kayınca harita da kayar), havuzlama gibi işlemler ise küçük kaymalara karşı yaklaşık değişmezlik kazandırabilir. LeNet (LeCun) bu mimarinin öncüsü oldu; AlexNet (2012) ise CNN’leri büyük ölçekte görünür kıldı. Aşağıdaki demo gerçek bir evrişim işlemini gösterir.
Diziyi anlamak: özyinelemeli ağlar (RNN) ||| Diziyi anlamak: yinelemeli sinir ağları (RNN)
Bir masalı dinleyen çocuğu düşün: her yeni cümleyi, öncekilerin hatırasıyla dinler; yoksa hikâye dağılır. Metin, müzik, konuşma da böyledir: hepsi birer dizidir ve sıra önemlidir. “Köpek adamı ısırdı” ile “Adam köpeği ısırdı” aynı kelimeleri taşır ama bambaşka şeyler anlatır. Özyinelemeli ağlar (RNN) bu yüzden yanlarında bir hafıza taşır. ||| Bir masalı dinleyen çocuğu düşün: her yeni cümleyi, öncekilerin hatırasıyla dinler; yoksa hikâye dağılır. Metin, müzik, konuşma da böyledir: hepsi birer dizidir ve sıra önemlidir. İngilizcede “the dog bit the man” ile “the man bit the dog” aynı kelimeleri taşır ama bambaşka şeyler anlatır. Türkçede kimin kimi ısırdığını hâl ekleri söyler (“köpek adamı” / “adam köpeği”); sıra ise vurguyu değiştirir: “Köpek adamı ısırdı” ile “Adamı köpek ısırdı”. Yinelemeli sinir ağları (RNN) bu yüzden yanlarında bir hafıza taşır.
Klasik RNN’ler uzun bağımlılıklarda kaybolan gradyan sorunuyla zorlanır; LSTM (Hochreiter & Schmidhuber, 1997) ve GRU bunu kapı (gate) mekanizmalarıyla hafifletir. Çoğu modern dizi görevinde RNN’lerin yerini büyük ölçüde dikkat (attention) tabanlı transformer’lar aldı; onları da sıradaki bölümde tanıyacağız. Aşağıdaki gösterim, gizli durumun güncellenişini basitleştirilmiş biçimde canlandırır. ||| Klasik RNN’ler uzun bağımlılıklarda kaybolan gradyan sorunuyla zorlanır; LSTM (Hochreiter & Schmidhuber, 1997) ve GRU bunu kapı (gate) mekanizmalarıyla hafifletir. Çoğu modern dizi görevinde RNN’lerin yerini büyük ölçüde dikkat (attention) tabanlı transformer’lar aldı; onları da sıradaki bölümde tanıyacağız. Aşağıdaki gösterim, gizli durumu hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁) denklemiyle, sabit ve eğitilmemiş ağırlıklarla adım adım gerçekten hesaplar.
Ağ kelimeleri tek tek okuyor ve bir “hafıza” taşıyor. Her yeni kelimede bu hafızayı, hem yeni kelimeye hem o ana kadar biriktirdiğine bakarak günceller. Böylece sırayı hatırlar; “köpek adamı ısırdı” ile “adam köpeği ısırdı” onun için artık aynı şey değildir. ||| Ağ kelimeleri tek tek okuyor ve bir “hafıza” taşıyor. Her yeni kelimede bu hafızayı, hem yeni kelimeye hem o ana kadar biriktirdiğine bakarak günceller. Böylece sırayı hatırlar; “köpek adamı ısırdı” ile “adamı köpek ısırdı” onun için artık aynı şey değildir.
Eğitim bir min-maks oyunudur; denge noktasında üretici örnekleri gerçek dağılımdan ayırt edilemez hâle gelir. GAN’lar fotogerçekçi görüntülerde çığır açtı; günümüzde difüzyon modelleri de yaygın bir alternatiftir (Modül 5). Aşağıdaki gösterim bu rekabet dinamiğini basitleştirilmiş biçimde canlandırır. ||| Eğitim bir min-maks oyunudur; denge noktasında üretici örnekleri gerçek dağılımdan ayırt edilemez hâle gelir. GAN’lar fotogerçekçi görüntülerde çığır açtı; günümüzde difüzyon modelleri de yaygın bir alternatiftir (Modül 5). Aşağıdaki gösterimde görüntü ve yüzde önceden belirlenmiştir; ölçülmüş eğitim sonucu değildir. İdeal GAN dengesinde ayırt edici gerçek ve üretilmiş örnekleri ayırt edemez.
İki ağ yarışıyor: biri (üretici) sahte görüntü üretiyor, öteki (ayırt edici) bunun sahte mi gerçek mi olduğunu yakalamaya çalışıyor. Başta kalpazan acemidir, kolayca yakalanır. Her turda üretici biraz daha iyi sahte yapmayı öğrenir ve “sahte” olasılığı düşer; kalpazanla dedektifin yarışı gibi. ||| İki ağ yarışıyor: biri (üretici) sahte görüntü üretiyor, öteki (ayırt edici) bunun sahte mi gerçek mi olduğunu yakalamaya çalışıyor. Başta kalpazan acemidir, kolayca yakalanır. Her turda üretici biraz daha iyi sahte yapmayı öğrenir ve “sahte” olasılığı düşer; kalpazanla dedektifin yarışı gibi. Bu gösterimde görüntü de yüzde de önceden belirlenmiştir; gerçek eğitimde iki ağ birlikte öğrenir ve ideal dengede ayırt edici gerçekle sahteyi ayırt edemez.
Girdilerin ağırlıklı toplamı + sapma, sonra aktivasyon ||| Girdilerin ağırlıklı toplamı + sabit terim, sonra aktivasyon
Hatayı geriye yayıp ağırlıkları hatayı azaltacak yönde günceller ||| Kaybın her ağırlığa göre gradyanını çıkıştan girişe doğru hesaplar
-->

<!-- REDAKSİYON NOTLARI
- 4.2 basit: "Kaydıraçları oynatıp girdileri güçlendir ya da zayıflat; …" → "Şekil 4.1’de girdileri güçlendir ya da zayıflat; …" (kalan kısım aynen, "izle" korundu)
- 4.3 basit: "Girdileri açıp kapat, “İleri besle”ye bas; sinyalin kattan kata ilerleyişini, hangi nöronların parladığını izle." → "Şekil 4.2’de girdileri açık ve kapalı hâlleriyle karşılaştır; sinyalin kattan kata ilerleyişini, hangi nöronların parladığını izle."
- 4.4 basit: "“Eğit”e bas; hatanın geriye akışını …" → "Şekil 4.3’te tur tur ilerle; hatanın geriye akışını …"
- 4.5 basit: "Feneri (filtreyi) değiştir; bu kez hangi kenarları yakaladığını gör." → "Şekil 4.4’te feneri (filtreyi) değiştirince bu kez hangi kenarları yakaladığını gör." ("Aşağıda fenerin … gezişini izle." aynen bırakıldı; Şekil bloğu karşılıyor)
- 4.6 basit: "Aşağıda kelimeleri sırayla ver, hafızanın her adımda nasıl değiştiğini izle." → "Aşağıda kelimelerin sırayla verilişini ve hafızanın her adımda nasıl değiştiğini izle."
- 4.7 basit: "“Tur”a bas; gürültüden ibaret görüntünün, …" → "Şekil 4.6’da tur tur ilerle; gürültüden ibaret görüntünün, …"
- 4.3 / 4.4 / 4.5 / 4.6 / 4.7 teknik: "Aşağıdaki demo/gösterim" → "Şekil 4.x’teki demo/gösterim" (Teknik derinlik artık Şekil bloğundan SONRA geldiği için yön düzeltmesi; kılavuz teknik metni aynen ister, yazar isterse geri alabilir)
- 4.2 demo "Ne oluyor?" (basit): "Kaydıraçları oynattıkça toplamın ve çıktının…" → "Girdileri değiştirdikçe toplamın ve çıktının…" (2026-09-30; yalnız basılı, dijitalde kaydıraç metni kalır). 4.3 / 4.4 "Ne oluyor?" metinlerinde ekran ifadesi kalmadı.
- 4.5 (RNN) gösterimi: çubuk değerleri kodda yalnızca adım sayısına bağlı, kelimeye bağlı değil (kelime sırası değişse aynı çubuklar çıkar). Metinde "Bu bir gösterimdir … kelimelerin anlamını bilmez" cümlesiyle dürüstçe belirtildi; Kendin dene 3. soru kavramsal tutuldu.
- 4.8 quiz altındaki export notu "_Cevaplar: cevap-anahtari.md_" nihai dosyadan çıkarıldı (dosya adı basılı metne ait değil).
- Şekil dosyaları üretildi; Kurulum metinleri SVG yerleşimiyle karşılaştırılıp düzeltildi (2026-09-30: 4.4 kuşak/durak düzeni ve renkler, 4.2 iki panel, 4.3/4.5 başlıktaki sayaçlar, 4.6 hedefin yeri).
- Yazar kararı (2026-09-10): kaynak metin dahil tüm "demo" sözcükleri "gösterim" ya da "Şekil N.j" yapıldı; "Aşağıdaki demo" → şekil öncesinde "Aşağıda yer alan gösterim (Şekil N.j)", sonrasında "Şekil N.j'teki gösterim".
- Yazar kararı (2026-09-10, figürler): ekran renkleri (yeşil/kırmızı/mavi/mor) duotone baskıya göre 'koyu/gri' ve 'turuncu' yapıldı; figür düzeni tarifleri ('kendi rengi', 'yanında rolü', 'ok çekmen') figürlerle eşleştirildi.
- 2026-09-30 insanlaştırma geçişi: "Peki …?" köprüleri (4.1, 4.2, 4.5, 4.6 geçişleri ve 4.4 basit), "işte / tam da / şurada: / şöyledir: / Şunu da", "büyü … aslında … ibaret", "şaşılacak" (2×) düzeltildi; "Bu bir gösterimdir" uyarıları şekil başına tek cümleye indirildi (4.3 Adım adım, 4.5 Adım adım; 4.5 teknik ve 4.6 Adım adım'daki ikinciler silindi); altı Kendin dene'den "Cevaplar kitabın sonunda." kaldırıldı (yalnız Kendini test et'te kalıyor); iki nokta sonrası küçük harf; teknik "Ne oluyor" tekrarları (4.3, 4.5, 4.7) kırpıldı. Değişen kaynak paragraflar yukarıdaki SOURCE-CHANGES bloğunda (14 satır); dijital sürüme taşınacak. 4.2 "Ne oluyor?" basit metnindeki "Kaydıraçları oynattıkça" dijital sürüm için doğru olduğundan dokunulmadı.
- 2026-10-01 düzeltme belgesi (R025, R026, R027, R028, R029, R030, R031, R032, R066): nöron “sapma” → “sabit terim (bias)” (4.1 teknik, 4.2 basit/kenar notu/Kurulum/Adım adım/Ne oluyor/teknik, 4.3 Kurulum/teknik, sınav 1, kalanlar); aktivasyon ile “ateşledi” karar eşiği ayrıldı (4.2 basit, kenar notu, Kurulum, Adım adım 3–6, Ne oluyor, teknik; cevaplar 4.1/3: sigmoid(−0.8) = 0.310 sıfır değil); Şekil 4.2 sabit ağ: çıkışların sınıf anlamı yok, öğrenme kanıtı değil (Kurulum, Adım adım 7, Ne oluyor, teknik, kalanlar); Şekil 4.3 artık print/kitap/qa/demo-data.json bp43 ile GERÇEK eğitim (x = [1.0, 0.5], hedef 0.8, η = 2, sigmoid 2-2-1, L = ½(ŷ − y)²): Kurulum, Adım adım (ileri geçiş → kayıp → gradyan → güncelleme), tablo (tur 0–8: ŷ, hata, kayıp, w₂, b₂), Kendin dene ve cevaplar yeniden yazıldı; “L(r) = 0.43 · 0.6ʳ”, “hazır animasyon”, “her tur yüzde 40” ifadeleri kaldırıldı; geri yayılım gradyanı hesaplar / optimizasyon günceller ayrımı basit, Ne oluyor, teknik ve sınav 4’te; “sıfıra yakın hata = öğrendi” iması yerine “yeni örneklerde ayrıca sınanmalı”; evrişim: eşdeğişkenlik/değişmezlik ayrımı ve çapraz korelasyon notu (4.5 Adım adım, teknik; iki çekirdeğin 25 konumu yeniden hesaplanıp doğrulandı); terim “yinelemeli sinir ağı (RNN)” (başlık, basit, kalanlar); köpek/adam örneği → İngilizce çift + Türkçede hâl eklerinin rolü, yalnız sırayı değiştiren çift “Köpek adamı ısırdı / Adamı köpek ısırdı” (basit, Ne oluyor, Kendin dene 3, cevaplar); Şekil 4.5 artık demo-data.json rnn45 ile gerçek hesap: hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁), h₀ = 0, kelimeler Kedi/kaçtı/çünkü/o/korkmuştu, 4 bileşen, kare 0 sıfır, Wₓ ve Wₕ teknik metinde; sentetik çubuk ifadeleri kaldırıldı; GAN: yüzde 7 ve görüntü temsili, D = 1/2 yalnız ideal/iyi eğitilmiş ayırt edici koşuluyla (Kurulum, Adım adım 6, kapanış, Ne oluyor, teknik; cevaplar 4.6/2–3). Değişen kaynak paragraflar ve sınav şıkları yukarıdaki SOURCE-CHANGES bloğunun sonundaki 22 satırda (4.6 başlığı dahil).
- 2026-10-01 figür ajanına: Şekil 4.3 (gen/M04.mjs) demo-data.json bp43 ile yeniden üretilmeli: 9 kare, tur r için ŷ (0.5229 … 0.7390), hedef 0.80, kare başlığı “hata 0.2771” vb., ok “gradyan ◄”; md tablo başlığı “| Tur | w₂ | b₂ | ŷ | Hata (0.8 − ŷ) | Kayıp |”. Şekil 4.5 rnn45 ile: 6 kare (0–5), kelimeler Kedi/kaçtı/çünkü/o/korkmuştu, 4 çubuk, değerler −1…1 (çift yönlü çubuk), kare 0 sıfır; strings/M04.mjs rnn.words ve mdNote (sentetik notu kalkar). Şekil 4.1 “sapma” etiketi varsa “sabit terim”. 4.5 teknik “gömme (embedding)” R097 terim listesine bırakıldı; sözlük “Özyinelemeli sinir ağı”, “Sapma (bias)” girişleri ve dizin-terimler.yaml R097 kapsamında güncellenmeli.
- 2026-10-01 cevap-anahtari.md export.py ürünüdür (elle düzenlenmez); sınav 1 ve 4’ün yeni şık metinleri bir sonraki export ile oraya düşer. 4.5 “(gösterim)” ve 4.3 “(gösterim)” başlık ekleri dijital demo başlıklarıyla aynı olduğu için korundu.
-->
