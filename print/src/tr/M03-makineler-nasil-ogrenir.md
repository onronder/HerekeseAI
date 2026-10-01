# Bölüm 3
## Makineler Nasıl Öğrenir
*Kuraldan örüntüye*

<!-- acc #1d6149 · tag İstatistiksel YZ -->

### 3.1 Makineler nasıl öğrenir?

Bir çocuğa kediyi nasıl öğretirsin? “Dört bacaklı, bıyıklı, kuyruklu...” diye kural yazarak mı? Hayır; kedileri gösterirsin, çocuk gerisini kendisi çözer. Geçen bölümde kural yazmanın duvarına toslamıştık. Ya makineler de çocuklar gibi öğrenseydi?

Makine öğrenmesinin bütün fikri bu kadar basit: bol bol örnek göster, örüntüyü kendisi yakalasın. Veri nasıl hazırlanır, bir model her denemede nasıl birazcık daha ustalaşır? Hepsini adım adım göreceksin.

> **Kenar notu.** Klasik YZ: “İşte kurallar, uygula.” Makine öğrenmesi: “İşte örnekler, kuralı sen bul.” Bu küçük fikir, modern yapay zekânın tamamını mümkün kıldı.

#### Teknik derinlik

Makine öğrenmesi (ML), açıkça programlanmış kurallar yerine verideki istatistiksel örüntülerden bir fonksiyon öğrenen yaklaşımdır. Klasik YZ “bilgiyi nasıl temsil ederiz?” diye sorarken, ML “girdiden çıktıya eşlemeyi veriden nasıl tahmin ederiz?” diye sorar.

Kurulum üç parçadan oluşur: bir model, parametreleri (ağırlıkları) aracılığıyla girdileri çıktılara eşler; bir kayıp fonksiyonu tahminlerin ne kadar yanlış olduğunu ölçer; bir optimizasyon yöntemi (ör. gradyan inişi) parametreleri kaybı azaltacak yönde günceller. Bu bölüm bu döngüyü ve temel görev türlerini kurar.

Örnekle öğrenmenin ilk şartı, örneğin neye benzediğini bilmek. Bir makineye örnek derken ona ne veriyoruz?

### 3.2 Özellik ve etiket

Bir dedektif düşün: elinde ipuçları var, bir de dosyanın sonucu, yani doğru cevap. Makine de örnekle öğrenirken aynı ikiliye bakar. İpuçlarına özellik denir: bir örneği tarif eden ölçülebilir bilgiler. Doğru cevaba da etiket denir. Bir e-postada ipuçları “kaç kelime”, “link veya şifre isteği var mı”, “bedava geçiyor mu” olabilir; etiketse “Spam” ya da “Normal”dir.

Model, yüzlerce çözülmüş dosyaya baka baka hangi ipucunun hangi cevapla gittiğini öğrenir. Şekil 3.1’deki örneklerden birine bak; ipuçlarını ve doğru cevabını gör.

> **Kenar notu.** “Çöp girerse çöp çıkar” burada da geçerli: özellikler kötüyse, en iyi model bile öğrenemez. Veriyi anlamak, çoğu zaman modeli seçmekten daha önemlidir.

**Şekil 3.1 · Özellikleri ve etiketi gör**
![Şekil 3.1](../../figures/out/tr/sekil-3-1-spam.svg)

*Kurulum.* Şekilde dört kısa e-posta ve her biri için üç ipucu var: “bedava” geçiyor mu, link veya şifre isteği var mı, aciliyet dili kullanıyor mu. Link veya şifre isteği, okurdan bir bağlantıyı açmasını ya da şifresini vermesini istemek demektir. Üç ipucu sütununun üstünde “Özellikler (girdi)”, son sütunun üstünde “Etiket (çıktı)” yazar. Dolu işaret (✓) ipucunun var olduğunu, boş halka (○) ipucunun bulunmadığını gösterir. En sağ sütun doğru cevabı, yani etiketi verir: Spam ya da Normal. Dört örneğin tamamı aşağıdaki tabloda.

*Adım adım.*

| # | E-posta | “bedava” geçiyor | link veya şifre isteği | aciliyet dili | Etiket |
|---|---|---|---|---|---|
| 1 | “Bedava iPhone kazandınız! Hemen tıklayın” | ✓ | ✓ | ✓ | Spam |
| 2 | “Toplantı yarın saat 10:00’da” | ○ | ○ | ○ | Normal |
| 3 | “ACİL: hesabınız kapanacak, şifrenizi girin” | ○ | ✓ | ✓ | Spam |
| 4 | “Rapor taslağını ekte gönderdim” | ○ | ○ | ○ | Normal |

1. Tabloyu satır satır oku. Her satır bir örnektir: ilk üç işaret sütunu o örneğin özellikleri, son sütun etiketi. Model yalnız bu ikiliyi görür, e-postanın kendisini değil.
2. Birinci e-posta üç ipucunun üçünü de taşıyor ve etiketi Spam. 3. e-posta “bedava” demiyor; ama şifre istiyor ve acele ettiriyor. O da Spam.
3. İkinci ve dördüncü e-postada üç ipucundan hiçbiri yok. İkisi de Normal.
4. Sütunlarla etiket arasındaki ilişkiye bak. İşaret sayısı sıfırsa etiket hep Normal; iki ya da üçse hep Spam. “Bedava” tek başına belirleyici değil: 3. e-posta onsuz da Spam çıktı. Link veya şifre isteği ile aciliyet dili ise iki Spam örneğinde de var.
5. Bu ilişkiyi biz yazmadık; tablodan okuduk. Model de aynısını yapar, yalnız dört değil binlerce satırla. Dört satırdan çıkan “iki işaret varsa spam” kuralı geçici bir tahmindir; beşinci örnek onu bozabilir.

*Ne oluyor?* Bir e-postayı tarif eden ipuçlarını (özellikler) ve doğru cevabı (etiket) yan yana koyuyoruz: “bedava” geçmesi, link veya şifre isteği, aciliyet dili… Makine bol örnek görerek hangi ipuçlarının “Spam” ile birlikte gittiğini kendi kendine öğrenir; kuralı biz yazmayız, o örneklerden çıkarır.

*Kendin dene.* 1) “Şifrenizin süresi doldu, bugün yenilemezseniz hesabınız silinir” e-postasının üç ipucunu işaretle. Tablodaki ilişkiye göre etiketi ne olur? 2) “Bedava kahve için yarın öğlen mutfakta buluşalım” e-postası gerçekte Normal. Bu satır tabloya eklenirse model “bedava” ipucuna daha çok mu, daha az mı güvenmeli? 3) Dört satırın hepsiyle uyuşan, tek cümlelik bir kural yaz. Kuralın 2. sorudaki e-postada da doğru çalışıyor mu? Canlı demo: [QR 3.1]

#### Teknik derinlik

Denetimli öğrenmede her örnek, bir özellik vektörü x ile bir etiket y çiftidir. Özellikler sayısal ya da kategorik olabilir; model f(x) ≈ y eşlemesini öğrenmeye çalışır. İyi özellik seçimi (feature engineering), klasik ML’de başarımı belirleyen en önemli adımlardan biridir.

Etiketin türü görevi belirler: kategorik etiket → sınıflandırma, nicel (sürekli) etiket → regresyon. Kategoriler sayıyla kodlanabilir; bu onları regresyon hedefi yapmaz. Aşağıdaki örnekte basit özelliklerle bir e-postanın spam olup olmadığını ayırt etme sezgisini göreceksin.

Özellik vektörü x = [“bedava” geçiyor; link veya şifre isteği; aciliyet dili], etiket y = “Spam”. Denetimli öğrenmede model bu (x, y) çiftlerinden f(x) ≈ y eşlemesini, yani P(spam | x) gibi bir karar kuralını kestirmeye çalışır.

Spam örneğinde her e-postanın doğru cevabı elimizdeydi. Cevap anahtarı olmadan, hatta öğretmen olmadan da öğrenilir mi?

### 3.3 Üç öğrenme türü

Makinelerin okulunda üç tür öğretmen var. Birincisi cevap anahtarıyla gezer: “Bu spam, bu değil” diye tek tek gösterir (denetimli). İkincisi hiç cevap vermez: “Sen ayıkla bakalım” der, makine veriyi kendi gruplar (denetimsiz). Üçüncüsü hiç ders anlatmaz; makine oyuna girer, denedikçe ödül ya da ceza toplar (pekiştirmeli).

Şimdi aşağıdaki görevlerin hangi öğretmene ait olduğunu bul. Her birinde kendine sor: Cevap anahtarı verilmiş mi, makine kendi mi ayıklıyor, yoksa deneye deneye mi öğreniyor?

> **Kenar notu.** İpucu: “Doğru cevaplar verilmiş mi?” → Denetimli. “Makine kendi mi gruplandırıyor?” → Denetimsiz. “Deneyip ödül mü topluyor?” → Pekiştirmeli.

**Şekil 3.2 · Hangi öğrenme türü?**
![Şekil 3.2](../../figures/out/tr/sekil-3-2-classify.svg)

*Kurulum.* Şekilde altı görev ve üç sütun var: Denetimli, Denetimsiz, Pekiştirmeli. Her görevin satırında, sütun başına bir tane, üç boş kutu var; doğru olanı sen işaretle. Kurşun kalem kullan; cevaplar ve gerekçeler kitabın sonunda.

*Kendini sına.* Her görev için üç soruyu sırayla sor. Doğru cevaplar baştan verilmiş mi? Makine veriyi kendi mi gruplandırıyor? Yoksa deneyip ödül mü topluyor? Sonra kutulardan birini işaretle.

1. Etiketli fotoğraflardan kedi/köpek ayırmak · □ Denetimli □ Denetimsiz □ Pekiştirmeli
2. Müşterileri benzerliklerine göre gruplara ayırmak · □ Denetimli □ Denetimsiz □ Pekiştirmeli
3. Bir robotun yürümeyi deneme-yanılmayla öğrenmesi · □ Denetimli □ Denetimsiz □ Pekiştirmeli
4. Geçmiş (etiketli) verilerden ev fiyatı tahmini · □ Denetimli □ Denetimsiz □ Pekiştirmeli
5. Bir oyunu oynayarak yüksek skoru öğrenmek · □ Denetimli □ Denetimsiz □ Pekiştirmeli
6. Etiketsiz haberleri konularına göre kümelemek · □ Denetimli □ Denetimsiz □ Pekiştirmeli

Bitirince iki soru daha. Altı görevin üçünde “etiketli” ya da “etiketsiz” sözcüğü açıkça geçiyor; ötekilerde etiketin var olup olmadığını neye bakarak anladın? 3 ile 5’in ortak noktası ne: ikisinde de doğru cevap kimden geliyor?

*Ne oluyor?* Makineye öğretmenin üç yolu var: doğru cevapları göstererek (denetimli), hiç cevap vermeden kendi gruplamasını isteyerek (denetimsiz) ya da deneyip ödül/ceza alarak (pekiştirmeli). Her görevi doğru türe ayır; aradaki sınırlar her zaman keskin değildir.

*Kendin dene.* 1) Şu üç görevi de aynı üç kutuya yerleştir. Bir çeviri programının insan çevirmenlerin yaptığı milyonlarca çeviriden öğrenmesi; bir satranç programının kendi kendine oynayarak güçlenmesi; bir marketin fişlerinden “birlikte alınan ürün” gruplarını bulması. 2) Üç soruyu bir karar ağacına çevir: ilk soru hangisi olmalı, hangi cevapta duruyorsun? 3) İki kutuya birden yakışan bir görev yaz; sınırların neden her zaman keskin olmadığını bu örnekle açıkla. Canlı demo: [QR 3.2]

#### Teknik derinlik

Denetimli öğrenme, etiketli (x, y) çiftlerinden f(x) ≈ y öğrenir (sınıflandırma/regresyon). Denetimsiz öğrenme yalnızca x’lerden yapı çıkarır (kümeleme, boyut indirgeme). Pekiştirmeli öğrenme, bir ajanın bir ortamda ödül sinyalini en üst düzeye çıkaracak bir politika öğrenmesidir.

Bu sınırlar keskin değildir: yarı-denetimli ve öz-denetimli (self-supervised) öğrenme aradadır. Modern büyük dil modelleri büyük ölçüde öz-denetimli ön eğitimle, yani etiketleri verinin kendisinden üreterek eğitilir. Aşağıdaki görevleri üç temel türe ayır.

Üç paradigma: denetimli (etiketli (x, y) çiftleri), denetimsiz (yalnızca x’ten yapı), pekiştirmeli (ödül sinyali).

Denetimli kutusuna iki görev düştü: kedi/köpek ayırmak ve ev fiyatı tahmin etmek. İkisi de etiketli; ama biri bir kategori, öteki bir sayı istiyor. Bu fark neyi değiştirir?

### 3.4 Sınıflandırma ve regresyon

Denetimli öğrenmenin sorduğu iki temel soru var. Biri “ne kadar?” der: bu evin fiyatı kaç lira? Buna regresyon denir; cevabı bir sayıdır. Öteki “hangisi?” der: bu e-posta spam mı, değil mi? Buna da sınıflandırma denir; cevabı bir kategoridir.

İkisini de aşağıda kendin dene. Regresyonda noktaların tam ortasından geçen “en iyi doğru”yu bulacaksın; sınıflandırmada iki grubun arasına bir sınır çizeceksin.

> **Kenar notu.** Basit ayrım: model bir miktar tahmin ediyorsa regresyon, bir kategori seçiyorsa sınıflandırma. Ev fiyatı bir miktardır; spam kararı bir kategoridir, kategoriler sayıyla kodlansa bile.

**Şekil 3.3 · İki temel görev**
![Şekil 3.3](../../figures/out/tr/sekil-3-3-scatter.svg)

*Kurulum.* Şekil iki görevi yan yana gösterir. Solda “Regresyon (sayı)”: dokuz koyu nokta ve onlara uydurulan en iyi doğru. Sağda “Sınıflandırma (kategori)”: beş koyu, beş turuncu nokta ve aralarına çizilen sınır. Her panelin üst karesi noktaların ham hâli, alt karesi doğru ya da sınır çizilmiş hâli.

*Adım adım.*

1. Regresyon verisi dokuz noktadır: (1, 1.4), (2, 1.9), (3, 2.2), (4, 3.1), (5, 3.3), (6, 4.2), (7, 4.5), (8, 5.4), (9, 5.6). x büyüdükçe y büyüyor, ama noktalar tam bir doğru üstünde değil.
2. En küçük kareler doğrusu iki sayıyla bulunur. x’lerin ortalaması 5, y’lerin ortalaması 3.51. Eğim m = 33 / 60 = 0.55; kesişim b = 3.51 − 0.55 · 5 = 0.76. Doğru: y = 0.55x + 0.76.
3. Doğru her noktaya ne kadar yakın? Ölçü, aynı x’teki dikey fark: gözlenen y eksi doğrunun dediği y. Buna artık denir; doğruya en kısa (dik) uzaklık değildir. x = 3’te doğru 2.41 der, nokta 2.2’dir; artık −0.21. x = 8’de doğru 5.16 der, nokta 5.4; artık +0.24. Dokuz artığın hiçbiri 0.25’i geçmez. Artıkların karelerinin toplamı 0.22.
4. Bu toplam neden “en iyi”nin ölçüsü? Göz kararı çizilmiş başka bir doğruyu dene: y = 0.5x + 1. Dikey artıkların kareleri toplamı 0.37’ye çıkar. En küçük kareler doğrusu, bu toplamı olası bütün doğrular arasında en küçük yapan tek doğrudur.
5. Sınıflandırma verisi iki gruptur. Koyu: (1.5, 1.5), (2, 2.2), (2.6, 1.7), (3.1, 2.6), (1.9, 3). Turuncu: (6.5, 4.5), (7, 5.3), (7.6, 4.6), (6.9, 5.8), (8, 5.1).
6. Sınır, (1, 5.5) ile (8.5, 1) noktalarından geçen doğrudur: y = 6.1 − 0.6x. Kontrol et: x = 3.1’de sınır 4.24 der, koyu nokta 2.6 ile altında kalır. x = 6.5’te sınır 2.2 der, turuncu nokta 4.5 ile üstünde. On noktanın onu da doğru tarafta.
7. İki cevap iki türdür. Regresyon bir sayı verir: x = 10 için 0.55 · 10 + 0.76 = 6.26. Sınıflandırma bir taraf verir: sınırın altı koyu, üstü turuncu.

*Ne oluyor?* İki temel iş var. Regresyon bir sayı tahmin eder: noktaların arasından geçen “en iyi doğru”yu çizeriz; en iyi doğru, her noktanın aynı x’teki dikey farkının karelerini topladığımızda bu toplamı en küçük yapan doğrudur. Sınıflandırma ise bir grubu ötekinden ayıran bir sınır çeker.

*Kendin dene.* 1) y = 0.55x + 0.76 doğrusuna göre x = 6.5 için tahmin kaç? 2) (4.5, 3.5) noktası sınırın hangi tarafında kalır; koyu mu, turuncu mu? Ya (5, 3)? 3) Regresyon verisine (9, 9) gibi uzak bir nokta eklensin. Eğim artar mı, azalır mı? Doğrunun tek bir noktanın peşinden gitmesi bir sorun mudur? Canlı demo: [QR 3.3]

#### Teknik derinlik

Regresyon sürekli bir hedefi tahmin eder; en basit hâli, hata karelerinin toplamını en aza indiren en küçük kareler doğrusudur. Sınıflandırma kategorik bir hedefi tahmin eder ve sınıfları ayıran bir karar sınırı öğrenir (ör. lojistik regresyon, destek vektör makineleri).

Şekil 3.3’teki gösterimde regresyon için noktalara en küçük kareler doğrusu uydurulur; sınıflandırma için iki kümeyi ayıran doğrusal bir karar sınırı gösterilir. Gerçekte karar sınırları doğrusal olmak zorunda değildir.

Regresyonda hedef sürekli bir sayıdır; Şekil 3.3’teki doğru en küçük kareler doğrusudur. Sınıflandırmada iki grubu ayıran bir karar sınırı çizilir.

En küçük kareler doğrusunun kapalı biçimi: m = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)², b = ȳ − m·x̄. Şekil 3.3’ün verisinde pay 33, payda 60’tır. Küçültülen nicelik dikey artıkların kareleri toplamıdır, Σ(yᵢ − m·xᵢ − b)²; doğruya dik uzaklık değil.

Buraya kadar her noktanın etiketi ya da sayısı elimizdeydi. Etiketleri tamamen kaldırınca ortada yalnız noktalar kalır. Makine yine de bir düzen bulabilir mi?

### 3.5 Kümeleme ve anomali

Sana koca bir kutu düğme verip “bunları ayır” deseler ne yaparsın? Kimse hangisinin nereye ait olduğunu söylemez; yine de benzeri benzerin yanına koyarsın. Kümeleme de bu: makine, etiketsiz veriyi benzerliğe göre kendisi gruplar. Hiçbir gruba uymayan tuhaf düğmeler de vardır; anomali tespiti onları yakalar.

Aşağıdaki noktaların hiçbir etiketi yok. Şekil 3.4’te makine onları en yakın merkeze göre iki kümeye ayırıyor. İki kümeye de uzak kalan nokta aykırı diye işaretlenir.

> **Kenar notu.** Denetimsiz öğrenmenin gücü: kimse “bunlar bir grup” demeden makine yapıyı kendisi bulur. Aykırılık tespiti, bankaların dolandırıcılık analizinde kullandığı araçlardan biridir.

**Şekil 3.4 · Etiketsiz veriyi grupla**
![Şekil 3.4](../../figures/out/tr/sekil-3-4-kmeans.svg)

*Kurulum.* Şekilde on bir gri nokta ve iki ✕ işareti var. ✕’ler küme merkezleridir: A merkezi sol üstte (2.5, 7), B merkezi sağ altta (7, 3). Sol kare gruplamadan önceki hâl; her nokta aynı gri. Sağ karede noktalar en yakın merkezin rengini almış, tek bir nokta turuncu halkayla “aykırı” diye işaretlenmiş. Bu gösterimde iki merkez de aykırı nokta da önceden seçilmiştir; makine burada yalnız uzaklıkları hesaplar.

*Adım adım.* Gruplama tek bir soruya dayanır: bu nokta hangi merkeze daha yakın? Uzaklık Pisagor’la hesaplanır: √((x − xₘ)² + (y − yₘ)²). Aykırı için eşik baştan konur: en yakın merkeze uzaklığı 2.4’ü aşan nokta aykırı sayılır ve kümeye girmez. Sıra şöyle: önce atama, sonra eşik, sonra kalan üyelerle merkez güncellemesi.

| # | Nokta | A’ya uzaklık | B’ye uzaklık | Küme |
|---|---|---|---|---|
| 1 | (1.5, 7.5) | 1.12 | 7.11 | A |
| 2 | (2, 6.5) | 0.71 | 6.10 | A |
| 3 | (3, 7.8) | 0.94 | 6.25 | A |
| 4 | (2.8, 6.2) | 0.85 | 5.28 | A |
| 5 | (1.8, 8) | 1.22 | 7.21 | A |
| 6 | (7.5, 3.2) | 6.28 | 0.54 | B |
| 7 | (6.5, 2.5) | 6.02 | 0.71 | B |
| 8 | (7.8, 3.8) | 6.19 | 1.13 | B |
| 9 | (6.8, 4) | 5.24 | 1.02 | B |
| 10 | (8, 2.8) | 6.92 | 1.02 | B |
| 11 | (5, 8.5) | 2.92 | 5.85 | aykırı |

1. Nokta 1, (1.5, 7.5): A’ya √(1² + 0.5²) = 1.12, B’ye √(5.5² + 4.5²) = 7.11. A çok daha yakın; nokta A’ya gider.
2. Nokta 9, (6.8, 4): A’ya √(4.3² + 3²) = 5.24, B’ye √(0.2² + 1²) = 1.02. B’ye gider.
3. Nokta 4, (2.8, 6.2): 0.85’e karşı 5.28, yine A. Aynı hesabı ilk on nokta için yap; hepsinde iki uzaklık arasında en az beş kat fark var. Karar hiç zor değil.
4. Nokta 11, (5, 8.5), farklı. En yakın merkezi A, ama uzaklığı 2.92; eşik 2.4’ün üstünde. A’nın öteki üyeleri merkeze en çok 1.22 uzakta; bu nokta onların iki katından uzak. B’ye de 5.85 uzak. Kurala göre aykırı: hiçbir kümeye girmez.
5. Bu tek turdu. Sırada merkez güncellemesi var: aykırı dışarıda bırakılınca A’nın yeni merkezi 1–5 numaralı noktaların ortalamasıdır, (2.22, 7.2). Eski merkezden yalnız 0.34 uzakta; kümeler zaten oturmuş. Dikkat: standart k-ortalamalar aykırı diye bir şey bilmez; 11. noktayı da A’ya atar ve A’nın merkezi altı üyeyle (2.68, 7.42) olur. Buradaki eleme, bizim koyduğumuz eşik kuralının sonucudur.

*Ne oluyor?* Noktaların hiçbir etiketi yok. Şekil 3.4’te makine her noktayı kendisine en yakın merkeze (✕) bağlar; böylece birbirine benzeyenler aynı kümede toplanır. İki kümeye de uzak kalan tek nokta “aykırı” (tuhaf örnek) diye işaretlenir.

*Kendin dene.* 1) B kümesinin yeni merkezini hesapla: 6–10 numaralı noktaların x ve y ortalaması. Eski merkez (7, 3)’ten ne kadar kaydı? 2) Veriye (4.5, 5.5) noktası eklense hangi merkeze gider? Uzaklığına bakınca onu aykırı sayar mısın? 3) Kümeleme için hiç etiket kullanmadık. Aykırı kararı için hangi sayıyı, hangi eşiği kullandık; bu eşiği kim seçti? Canlı demo: [QR 3.4]

#### Teknik derinlik

Kümeleme, etiket olmadan benzerliğe göre grup keşfeder; k-ortalamalar (k-means) gibi yöntemler noktaları en yakın küme merkezine (centroid) atar ve merkezleri günceller. Anomali (aykırı değer) tespiti, çoğunluğun dağılımından belirgin biçimde sapan örnekleri belirler.

Şekil 3.4’teki gösterim, noktaları iki sabit merkeze en yakınlıklarına göre atayarak k-means’in “atama” adımını gösterir; ayrıca her iki kümeye de uzak duran bir aykırı noktayı vurgular. Gerçek k-means, merkezleri yakınsayana dek iteratif olarak günceller. Bu gösterimde küme merkezleri ve aykırı nokta önceden seçilmiştir; gerçek uygulamada aykırılık bir yöntem ve eşikle hesaplanır.

Etiketsiz x noktaları, iki sabit merkez (centroid, ✕); her iki kümeye de uzak nokta aykırı (anomali) olarak işaretlenir.

İki adımın formülü: atama c(i) = argminₖ ‖xᵢ − μₖ‖², güncelleme μₖ ← küme k’ye atanan noktaların ortalaması. Şekil 3.4’te, aykırı nokta eşik kuralıyla dışlandıktan sonra bir güncelleme merkez A’yı (2.5, 7)’den (2.22, 7.2)’ye, merkez B’yi (7, 3)’ten (7.32, 3.26)’ya taşır; ikinci atama turu hiçbir noktayı değiştirmez, algoritma yakınsamıştır. Eşiksiz standart k-means 11. noktayı A’ya atar; A’nın merkezi altı üyeyle (2.68, 7.42) olur ve ikinci turda nokta yine A’da kalır.

Kümelemede merkez bir kez kaydı ve iş bitti. Milyonlarca parametresi olan bir model o küçük düzeltme adımını nasıl atar? Sıradaki bölüm sisli bir vadide geçiyor.

### 3.6 Model nasıl iyileşir: kayıp ve gradyan inişi

Bir model nasıl “daha iyi” olur? Önce ne kadar yanıldığını ölçeriz; buna kayıp (loss) denir. Şimdi kendini sisli bir vadide düşün. Kayıp ne kadar büyükse o kadar yukarıdasın; hedefin vadinin dibi. Sis yüzünden yolu göremiyorsun ama bir şeyi hissedebiliyorsun: ayağının altındaki eğimi.

Gradyan inişi bu yürüyüştür: her adımda eğimi yokla, yokuş aşağı küçük bir adım at, tekrarla. Aşağıda topu adım adım indir, kaybın erimesini izle. Adımını çok büyük atarsan ne olur? Şekil 3.5’in sağ panelinde ne olduğuna bak.

> **Kenar notu.** Öğrenmenin özü bu: “ne kadar yanlışım?” diye sor, biraz düzelt ve tekrarla; hem de milyonlarca kez. Sinir ağları başta olmak üzere bugünün modellerinin çoğu böyle, gradyanla eğitiliyor; karar ağaçları gibi bazı yöntemlerse başka yoldan öğrenir.

**Şekil 3.5 · Kayıp vadisinde iniş**
![Şekil 3.5](../../figures/out/tr/sekil-3-5-descent.svg)

*Kurulum.* Vadi bir paraboldür: L(x) = 0.18·(x − 5)² + 0.1. Yatay eksen modelin tek parametresi x, dikey eksen kayıp. Dip x = 5’te; kayıp orada 0.1. Top x₀ = 0.6’dan, kaybın 3.58 olduğu sol yamaçtan başlar. Sol panel düşük öğrenme oranıyla (η = 0.18) altı adımı, sağ panel yüksek oranla (η = 4.6) altı adımı gösterir.

*Adım adım.* Kural her adımda aynı: x ← x − η·L′(x). Eğim L′(x) = 0.36·(x − 5); dibin solunda eksi, sağında artı. x’ten eksi bir sayı çıkarınca x büyür: top sağa, yani yokuş aşağı gider.

| adım | x (η = 0.18) | L(x) | x (η = 4.6) | L(x) |
|---|---|---|---|---|
| 0 | 0.60 | 3.58 | 0.60 | 3.58 |
| 1 | 0.89 | 3.15 | 7.89 | 1.60 |
| 2 | 1.15 | 2.77 | 3.11 | 0.75 |
| 3 | 1.40 | 2.43 | 6.24 | 0.38 |
| 4 | 1.63 | 2.14 | 4.19 | 0.22 |
| 5 | 1.85 | 1.88 | 5.53 | 0.15 |
| 6 | 2.06 | 1.66 | 4.65 | 0.12 |

1. Düşük oran, 1. adım: eğim 0.36·(0.6 − 5) = −1.58. Yeni x = 0.6 − 0.18·(−1.584) = 0.6 + 0.285 ≈ 0.89. Kayıp 3.58’den 3.15’e düştü.
2. Düşük oran, 2–6. adımlar: top her adımda biraz daha az ilerler (0.29, 0.26, 0.25, 0.23, 0.22, 0.21), çünkü dibe yaklaştıkça eğim azalır. Altı adım sonunda x = 2.06, kayıp 1.66. Dibe hâlâ uzak; 0.1 yakınına gelmesi altmışa yakın adım ister. Güvenli ama yavaş.
3. Yüksek oran, 1. adım: aynı eğim, ama adım 4.6·1.584 ≈ 7.29 birim. Top dibi ıskalayıp karşı yamaca, x = 7.89’a fırlar. Kayıp yine de düştü: 1.60.
4. Yüksek oran, 2–6. adımlar: eğim artık artı (+1.04), top sola atlar: 3.11. Sonra 6.24, 4.19, 5.53, 4.65. Dibin bir sağı, bir solu: salınım. Her sıçrama öncekinin 0.66 katı; o yüzden salınım sönüyor ve top yine de dibe yaklaşıyor. Kayıp 0.12.
5. Karşılaştır: altı adım sonra düşük oran 1.66’da, yüksek oran 0.12’de. Bu vadide büyük adım kazandı; ama sınırda. η·0.36 sayısı 2’yi geçseydi her sıçrama öncekinden büyük olur, top vadiden dışarı uçardı.

*Ne oluyor?* Bir modeli iyileştirmek, vadinin dibine inmeye benzer: “kayıp” ne kadar büyükse o kadar yukarıdasın. Her adımda topu yokuş aşağı biraz ittiriyoruz ve kayıp küçülüyor. Ama adım çok büyük olursa (yüksek öğrenme oranı) top dibi ıskalayıp karşı yamaca fırlar; adımın boyu bu yüzden önemlidir.

*Kendin dene.* 1) Düşük oranla 7. adımı hesapla: x = 2.06’da eğim kaç, yeni x ve kayıp kaç? 2) η = 6 ile iki adım at (η·0.36 = 2.16). Top dibe yaklaşıyor mu, uzaklaşıyor mu? 3) Bu vadide tek adımda tam dibe inen bir öğrenme oranı var mı? İpucu: x − η·0.36·(x − 5) = 5 olsun. Canlı demo: [QR 3.5]

#### Teknik derinlik

Eğitim, parametreleri kayıp fonksiyonu L(θ)’yı en aza indirecek şekilde ayarlamaktır. Gradyan inişi her adımda gradyanın ters yönünde ilerler: θ ← θ − η·∇L(θ), burada η öğrenme oranıdır (learning rate).

Öğrenme oranı işin en hassas ayarıdır: çok küçükse yakınsama yavaşlar; çok büyükse minimumun etrafında salınabilir ya da ıraksayabilir. Şekil 3.5’teki gösterimde dışbükey bir kayıp eğrisinde inişi ve büyük öğrenme oranının nasıl aşıma (overshoot) yol açtığını gözlemle. Derin ağların kayıp yüzeyleri genellikle dışbükey değildir ve eğitimde stokastik gradyan inişi gibi gradyan tabanlı yöntemler yaygındır; doğrusal regresyon gibi bazı modellerin kaybı dışbükeydir, ağaç tabanlı yöntemler gibi bazıları ise gradyan kullanmaz.

Gradyan inişi: θ ← θ − η·∇L(θ). Parametre minimuma (x* = 5) doğru ilerler, L(x) azalır. Yüksek öğrenme oranında top minimumun etrafında salınır (aşım).

Bu ikinci dereceden vadide adım kuralı doğrusaldır: xₜ₊₁ − 5 = (1 − 0.36·η)·(xₜ − 5). Çarpan η = 0.18’de 0.935 (tek yönlü, yavaş), η = 4.6’da −0.656 (sönümlü salınım), η > 5.56’da mutlak değeri 1’i aşar (ıraksama). Tablodaki her satır bu tek çarpanla öncekinden türer.

Kayıp sıfıra yaklaştıkça model iyileşiyor gibi görünür. Ama eğitim verisinde sıfır hata, yeni veride de sıfır hata demek midir?

### 3.7 Aşırı uyum ve topluluk öğrenmesi

Sınıfın ezbercisini bilirsin: eski soruların hepsini kelimesi kelimesine bilir ama soru birazcık değişince kalakalır. Modeller de bazen böyle “fazla iyi” öğrenir: eğitim örneklerini ezberler, yenisinde sınıfta kalır. Buna aşırı uyum (overfitting) denir. Tersi de var: çok basit kalan model örüntüyü hiç yakalayamaz (eksik uyum). İyi model ikisinin arasında durur.

Şimdi aynı veriye üç model uydur; üç öğrenci gibi düşün: tembel, dengeli ve ezberci. Sence hiç görmediği soruyu hangisi bilir?

> **Kenar notu.** Ezberlemek öğrenmek değildir. Sınavda yalnızca eski soruları ezberleyen öğrenci, yeni soruda çuvallar. İyi bir model örnekleri değil, altlarındaki örüntüyü öğrenir.

**Şekil 3.6 · Aynı veri, üç model**
![Şekil 3.6](../../figures/out/tr/sekil-3-6-modelfit.svg)

*Kurulum.* Üç panelde de aynı dokuz nokta var: (1, 3.2), (2, 2.4), (3, 3.0), (4, 2.0), (5, 2.7), (6, 1.7), (7, 2.3), (8, 1.4), (9, 2.0). Genel eğilim aşağı, ama her adımda bir zıplama var; ölçümlerdeki gürültü. Sol panel “Eksik uyum”: düz bir doğru. Orta panel “Daha düzgün temsili eğri”: hafif dalgalı bir eğri; veriden eğitilmedi, anlatım için elle çizildi. Sağ panel “Aşırı uyum”: dokuz noktayı tek tek birleştiren kırık çizgi. Her panelin altında o modelin hükmü yazar.

*Adım adım.*

1. Eksik uyum: doğru y = 3.1 − 0.18x. x = 5’te 2.2 der, nokta 2.7’dir; fark 0.5. x = 9’da 1.48 der, nokta 2.0. Doğru noktaların bir üstüne, bir altına düşer; zıplamaları hiç tutmaz. Hüküm: “Eksik uyum: model çok basit, örüntüyü yakalayamıyor (yüksek yanlılık).”
2. Daha düzgün temsili eğri: y = 3.0 − 0.16x + 0.15·sin(0.6x). x = 5’te 2.22, x = 9’da 1.44 der. Zikzağı kovalamaz; yalnız aşağı eğilimi ve hafif bir dalgayı taşır. Hüküm: “Yanlılık-varyans dengesi: ne örüntüyü kaçıracak kadar basit ne gürültüyü ezberleyecek kadar karmaşık.” İyi genellediğini söylemek için eğitimde kullanılmamış veride hatası ölçülmeli; bu eğri elle çizildiği için o ölçüm burada yok.
3. Aşırı uyum: kırık çizgi dokuz noktanın dokuzundan da geçer; eğitim hatası tam sıfır. Ama şekline bak: 5’ten 6’ya giderken 1.0 birim düşüyor, 6’dan 7’ye 0.6 yükseliyor. Bu iniş çıkışlar örüntü değil, gürültüdür; yeni ölçümde aynı yerde tekrarlamaz. Hüküm: “Aşırı uyum: her noktadan geçer ama gürültüyü ezberler; yeni veride başarısız (yüksek varyans).”
4. Sınav: 5. ve 7. noktayı sakla, kalan yediyle aynı kırık çizgiyi çiz. x = 5’te çizgi (4, 2.0) ile (6, 1.7)’yi birleştirir ve 1.85 der; gerçek 2.7, hata 0.85. x = 7’de 1.55 der; gerçek 2.3, hata 0.75. Basit doğru aynı iki noktada 0.5 ve 0.46 hata yapar. Ezberci, görmediği soruda tembelden bile kötü.
5. Eğitim hatası tek başına aldatır. Modeli hiç görmediği veriyle sınamak gerekir; buna doğrulama denir. Adil bir karşılaştırma için her aday aynı yedi noktayla eğitilip aynı iki noktada sınanır. Burada bunu kırık çizgi ile düz doğru için yaptık; orta eğri elle çizildiği için sınava girmedi.

*Ne oluyor?* Aynı veriye üç ayrı model uyduruyoruz. Çok basit olan örüntüyü ıskalar (eksik uyum); aşırı karmaşık olan her noktayı ezberler ama yeni veride şaşırır (aşırı uyum). En iyisi ikisinin arasındadır: daha önce hiç görmediği örnekleri de doğru tahmin edebilen model. Bu eğriler fikri gösterir; hangisinin iyi genellediğini ancak eğitimde kullanılmamış veride ölçülen hata söyler.

*Kendin dene.* 1) x = 10 için üç model ne der? Kırık çizgi için ne olduğuna dikkat et. 2) Aynı saklama sınavını 2. ve 8. noktalarla tekrarla: kırık çizgi ve düz doğru bu iki noktada kaçar hata yapıyor? 3) Dokuz noktadan tam geçen model “sıfır hata” diye övünüyor. Bu sayı neyi kanıtlar, neyi kanıtlamaz? Canlı demo: [QR 3.6]

#### Teknik derinlik

Aşırı uyum, modelin eğitim verisindeki gürültüyü de öğrenip görülmemiş veride başarımını yitirmesidir; eksik uyum ise modelin örüntüyü yakalayamayacak kadar basit olmasıdır. Bunlar yanlılık-varyans dengesinin (bias–variance tradeoff) iki ucudur ve genelde eğitim/doğrulama ayrımı, düzenlileştirme (regularization) ve çapraz doğrulama ile yönetilir.

Topluluk öğrenmesi (ensemble), birçok modelin tahminini birleştirir (oylama, bagging, boosting); hataları birbirini tamamlıyorsa genelleme iyileşebilir, ama her tekil modelden daha iyi sonuç garanti edilmez ve kazanç doğrulama verisiyle ölçülür. Rastgele orman (random forest) ve gradyan artırma (gradient boosting) en bilinen örneklerdir.

Yanlılık-varyans dengesi: eksik uyum örüntüyü kaçırır, aşırı uyum gürültüyü ezberler. En iyi model her ikisini dengeleyip görülmemiş veriye genelleşendir.

Şekil 3.6’daki saklama sınavı, tek katlı bir eğitim/doğrulama ayrımıdır: iki nokta doğrulama kümesi, yedi nokta eğitim kümesi. Çapraz doğrulama bunun k-katlı hâlidir: veri k parçaya bölünür, her parça sırayla saklanır, kalanla eğitilir ve hataların ortalaması alınır; her noktayı tek tek saklamak (burada k = 9) bunun bir özel durumudur.

Örnekten öğrenmek, ama ezberlemeden: bölüm bu fikrin etrafında döndü. Ne kadarı aklında kaldı, altı soruyla bak.

### 3.8 Kendini test et

*Cevaplar kitabın sonunda.*
1. Makine öğrenmesinin klasik YZ’den temel farkı nedir?
   a) Kuralları elle yazmak yerine veriden öğrenir
   b) Hiç hata yapmaz
   c) Daha hızlı çalışır
   d) İnternet gerektirir

2. Bir örneğin “doğru cevabına” ne denir?
   a) Etiket
   b) Gradyan
   c) Özellik
   d) Model

3. Etiketsiz veriyi gruplara ayırma görevi hangisidir?
   a) Kümeleme (denetimsiz)
   b) Sınıflandırma
   c) Pekiştirmeli
   d) Regresyon

4. Gradyan inişi ne yapar?
   a) Etiketleri üretir
   b) Veriyi siler
   c) Modeli yavaşlatır
   d) Kaybı azaltacak yönde parametreleri adım adım günceller

5. Aşırı uyum (overfitting) nedir?
   a) Hiç öğrenmemek
   b) Çok hızlı öğrenmek
   c) Eğitim verisini ezberleyip yeni veride başarısız olmak
   d) Veriyi sıkıştırmak

6. Pekiştirmeli öğrenmede ajan nasıl öğrenir?
   a) Ödül ve cezayla, deneme-yanılmayla
   b) Etiketli örneklerle
   c) Kuralları ezberleyerek
   d) Veriyi kümeleyerek

### Bu bölümden kalanlar

- Makine öğrenmesi kural yazmaz; kuralı örneklerden kendisi çıkarır.
- Her örnek iki parçadır: onu tarif eden özellikler ve doğru cevap, yani etiket.
- Etiket varsa denetimli, yoksa denetimsiz, ödülle öğreniyorsa pekiştirmeli öğrenmedir.
- Regresyon bir miktar tahmin eder (ev fiyatı), sınıflandırma bir kategori seçer (spam mı, değil mi); sayıyla kodlanmış kategori yine sınıflandırmadır.
- Kümeleme etiketsiz veriyi benzerliğe göre gruplar; her kümeye de uzak kalan nokta, önceden konan bir eşiğe göre aykırı sayılır.
- Gradyan inişi kaybı ölçer, eğime bakar, küçük bir adım atar ve bunu milyonlarca kez tekrarlar.
- Eğitim verisini ezberleyen model yeni veride çuvallar; modeli hiç görmediği veriyle sınamak bu yüzden şart.

<!-- SOURCE-CHANGES
Bir çocuğa kediyi nasıl öğretirsin? “Dört bacaklı, bıyıklı, kuyruklu...” diye kural yazarak mı? Hayır; kedileri gösterirsin, çocuk gerisini kendisi çözer. Geçen bölümde kural yazmanın duvarına toslamıştık. Peki ya makineler de çocuklar gibi öğrenseydi? ||| Bir çocuğa kediyi nasıl öğretirsin? “Dört bacaklı, bıyıklı, kuyruklu...” diye kural yazarak mı? Hayır; kedileri gösterirsin, çocuk gerisini kendisi çözer. Geçen bölümde kural yazmanın duvarına toslamıştık. Ya makineler de çocuklar gibi öğrenseydi?
Makine öğrenmesinin bütün fikri bu kadar basit: Bol bol örnek göster, örüntüyü kendisi yakalasın. Şimdi bu öğrenmenin perde arkasına giriyoruz: Veri nasıl hazırlanır, bir model her denemede nasıl birazcık daha ustalaşır? Hepsini sahnede, adım adım göreceksin. ||| Makine öğrenmesinin bütün fikri bu kadar basit: bol bol örnek göster, örüntüyü kendisi yakalasın. Veri nasıl hazırlanır, bir model her denemede nasıl birazcık daha ustalaşır? Hepsini adım adım göreceksin.
Temel kurulum şudur: bir model, parametreleri (ağırlıkları) aracılığıyla girdileri çıktılara eşler; bir kayıp fonksiyonu tahminlerin ne kadar yanlış olduğunu ölçer; bir optimizasyon yöntemi (ör. gradyan inişi) parametreleri kaybı azaltacak yönde günceller. Bu bölüm bu döngüyü ve temel görev türlerini kurar. ||| Kurulum üç parçadan oluşur: bir model, parametreleri (ağırlıkları) aracılığıyla girdileri çıktılara eşler; bir kayıp fonksiyonu tahminlerin ne kadar yanlış olduğunu ölçer; bir optimizasyon yöntemi (ör. gradyan inişi) parametreleri kaybı azaltacak yönde günceller. Bu bölüm bu döngüyü ve temel görev türlerini kurar.
Bir dedektif düşün: Elinde ipuçları var, bir de dosyanın sonucu, yani doğru cevap. Makine de örnekle öğrenirken aynı ikiliye bakar. İpuçlarına özellik denir: bir örneği tarif eden ölçülebilir bilgiler. Doğru cevaba da etiket denir. Bir e-postada ipuçları “kaç kelime”, “link var mı”, “bedava geçiyor mu” olabilir; etiketse “Spam” ya da “Normal”dir. ||| Bir dedektif düşün: elinde ipuçları var, bir de dosyanın sonucu, yani doğru cevap. Makine de örnekle öğrenirken aynı ikiliye bakar. İpuçlarına özellik denir: bir örneği tarif eden ölçülebilir bilgiler. Doğru cevaba da etiket denir. Bir e-postada ipuçları “kaç kelime”, “link var mı”, “bedava geçiyor mu” olabilir; etiketse “Spam” ya da “Normal”dir.
Makineye öğretmenin üç yolu var: doğru cevapları göstererek (denetimli), hiç cevap vermeden kendi gruplamasını isteyerek (denetimsiz) ya da deneyip ödül/ceza alarak (pekiştirmeli). Her görevi doğru türe ayır; unutma, aradaki sınırlar her zaman keskin değildir. ||| Makineye öğretmenin üç yolu var: doğru cevapları göstererek (denetimli), hiç cevap vermeden kendi gruplamasını isteyerek (denetimsiz) ya da deneyip ödül/ceza alarak (pekiştirmeli). Her görevi doğru türe ayır; aradaki sınırlar her zaman keskin değildir.
Üç paradigma: denetimli (etiketli (x, y) çiftleri), denetimsiz (yalnızca x’ten yapı), pekiştirmeli (ödül sinyali). Sınırların her zaman keskin olmadığını da aklında tut. ||| Üç paradigma: denetimli (etiketli (x, y) çiftleri), denetimsiz (yalnızca x’ten yapı), pekiştirmeli (ödül sinyali).
Denetimli öğrenmenin sorduğu iki temel soru var. Biri “ne kadar?” der: Bu evin fiyatı kaç lira? Buna regresyon denir; cevabı bir sayıdır. Öteki “hangisi?” der: Bu e-posta spam mı, değil mi? Buna da sınıflandırma denir; cevabı bir kategoridir. ||| Denetimli öğrenmenin sorduğu iki temel soru var. Biri “ne kadar?” der: bu evin fiyatı kaç lira? Buna regresyon denir; cevabı bir sayıdır. Öteki “hangisi?” der: bu e-posta spam mı, değil mi? Buna da sınıflandırma denir; cevabı bir kategoridir.
Basit ayrım: çıktı bir sayıysa regresyon, çıktı bir etiketse sınıflandırma. “Ne kadar?” sorusu regresyon, “Hangisi?” sorusu sınıflandırmadır. ||| Basit ayrım: çıktı bir sayıysa regresyon, çıktı bir etiketse sınıflandırma. Ev fiyatı bir sayı, spam kararı bir etikettir.
İki temel iş var. Regresyon bir sayı tahmin eder: noktaların tam ortasından geçen, hepsine en az uzaklıkta duran “en iyi doğru”yu çizeriz. Sınıflandırma ise bir grubu ötekinden ayıran bir sınır çeker. Kısaca: “ne kadar?” sorusu regresyon, “hangisi?” sorusu sınıflandırmadır. ||| İki temel iş var. Regresyon bir sayı tahmin eder: noktaların tam ortasından geçen, hepsine en az uzaklıkta duran “en iyi doğru”yu çizeriz. Sınıflandırma ise bir grubu ötekinden ayıran bir sınır çeker.
Regresyonda hedef sürekli bir sayıdır; Şekil 3.3’teki doğru, hata karelerinin toplamını en aza indiren en küçük kareler doğrusunu hesaplar. Sınıflandırmada iki grubu ayıran bir karar sınırı çizilir. ||| Regresyonda hedef sürekli bir sayıdır; Şekil 3.3’teki doğru en küçük kareler doğrusudur. Sınıflandırmada iki grubu ayıran bir karar sınırı çizilir.
Sana koca bir kutu düğme verip “bunları ayır” deseler ne yaparsın? Kimse hangisinin nereye ait olduğunu söylemez; yine de benzeri benzerin yanına koyarsın. Kümeleme tam budur: Makine, etiketsiz veriyi benzerliğe göre kendisi gruplar. Bir de hiçbir gruba uymayan tuhaf düğmeler vardır; anomali tespiti onları yakalar. Bankaların şüpheli işlemi yakalayışı gibi. ||| Sana koca bir kutu düğme verip “bunları ayır” deseler ne yaparsın? Kimse hangisinin nereye ait olduğunu söylemez; yine de benzeri benzerin yanına koyarsın. Kümeleme de bu: makine, etiketsiz veriyi benzerliğe göre kendisi gruplar. Hiçbir gruba uymayan tuhaf düğmeler de vardır; anomali tespiti onları yakalar.
Noktaların hiçbir etiketi yok. Şekil 3.4’te makine her noktayı kendisine en yakın merkeze (✕) bağlar; böylece birbirine benzeyenler aynı kümede toplanır. İki kümeye de uzak kalan tek nokta “aykırı” (tuhaf örnek) diye işaretlenir; bankaların dolandırıcılık yakalaması da buna benzer. ||| Noktaların hiçbir etiketi yok. Şekil 3.4’te makine her noktayı kendisine en yakın merkeze (✕) bağlar; böylece birbirine benzeyenler aynı kümede toplanır. İki kümeye de uzak kalan tek nokta “aykırı” (tuhaf örnek) diye işaretlenir.
Etiketsiz x noktaları, iki sabit merkez (centroid, ✕). Şekil 3.4, her noktayı en yakın merkeze atayarak k-means’in “atama” adımını gösterir; her iki kümeye de uzak nokta aykırı (anomali) olarak işaretlenir. ||| Etiketsiz x noktaları, iki sabit merkez (centroid, ✕); her iki kümeye de uzak nokta aykırı (anomali) olarak işaretlenir.
Bir model nasıl “daha iyi” olur? Önce ne kadar yanıldığını ölçeriz; buna kayıp (loss) denir. Şimdi kendini sisli bir vadide düşün. Kayıp ne kadar büyükse o kadar yukarıdasın; hedefin vadinin dibi. Sis yüzünden yolu göremiyorsun ama bir şeyi hissedebiliyorsun: Ayağının altındaki eğimi. ||| Bir model nasıl “daha iyi” olur? Önce ne kadar yanıldığını ölçeriz; buna kayıp (loss) denir. Şimdi kendini sisli bir vadide düşün. Kayıp ne kadar büyükse o kadar yukarıdasın; hedefin vadinin dibi. Sis yüzünden yolu göremiyorsun ama bir şeyi hissedebiliyorsun: ayağının altındaki eğimi.
Gradyan inişi tam bu yürüyüştür: Her adımda eğimi yokla, yokuş aşağı küçük bir adım at, tekrarla. Aşağıda topu adım adım indir, kaybın erimesini izle. Peki adımını çok büyük atarsan ne olur? Şekil 3.5’in sağ panelinde ne olduğuna bak. ||| Gradyan inişi bu yürüyüştür: her adımda eğimi yokla, yokuş aşağı küçük bir adım at, tekrarla. Aşağıda topu adım adım indir, kaybın erimesini izle. Adımını çok büyük atarsan ne olur? Şekil 3.5’in sağ panelinde ne olduğuna bak.
Öğrenme aslında bundan ibaret: “ne kadar yanlışım?” diye sor, biraz düzelt ve tekrarla; hem de milyonlarca kez. Sinir ağları da dahil neredeyse bütün modern YZ böyle eğitiliyor. ||| Öğrenmenin özü bu: “ne kadar yanlışım?” diye sor, biraz düzelt ve tekrarla; hem de milyonlarca kez. Sinir ağları da dahil neredeyse bütün modern YZ böyle eğitiliyor.
Bir modeli iyileştirmek, vadinin dibine inmeye benzer: “kayıp” ne kadar büyükse o kadar yukarıdasın. Her adımda topu yokuş aşağı biraz ittiriyoruz ve kayıp küçülüyor. Ama adım çok büyük olursa (yüksek öğrenme oranı) top dibi ıskalayıp karşı yamaca fırlar; işte bu yüzden adımın boyu önemlidir. ||| Bir modeli iyileştirmek, vadinin dibine inmeye benzer: “kayıp” ne kadar büyükse o kadar yukarıdasın. Her adımda topu yokuş aşağı biraz ittiriyoruz ve kayıp küçülüyor. Ama adım çok büyük olursa (yüksek öğrenme oranı) top dibi ıskalayıp karşı yamaca fırlar; adımın boyu bu yüzden önemlidir.
Sınıfın ezbercisini bilirsin: Eski soruların hepsini kelimesi kelimesine bilir ama soru birazcık değişince kalakalır. Modeller de bazen böyle “fazla iyi” öğrenir: Eğitim örneklerini ezberler, yenisinde sınıfta kalır. Buna aşırı uyum (overfitting) denir. Tersi de var: Çok basit kalan model örüntüyü hiç yakalayamaz (eksik uyum). İyi model tam ortada durur; ezberlemez, kavrar. ||| Sınıfın ezbercisini bilirsin: eski soruların hepsini kelimesi kelimesine bilir ama soru birazcık değişince kalakalır. Modeller de bazen böyle “fazla iyi” öğrenir: eğitim örneklerini ezberler, yenisinde sınıfta kalır. Buna aşırı uyum (overfitting) denir. Tersi de var: çok basit kalan model örüntüyü hiç yakalayamaz (eksik uyum). İyi model ikisinin arasında durur.
Aynı veriye üç ayrı model uyduruyoruz. Çok basit olan örüntüyü ıskalar (eksik uyum); aşırı karmaşık olan her noktayı ezberler ama yeni veride şaşırır (aşırı uyum). En iyisi tam ortadakidir: daha önce hiç görmediği örnekleri de doğru tahmin edebilen model. Kısaca, ezberlemek öğrenmek değildir. ||| Aynı veriye üç ayrı model uyduruyoruz. Çok basit olan örüntüyü ıskalar (eksik uyum); aşırı karmaşık olan her noktayı ezberler ama yeni veride şaşırır (aşırı uyum). En iyisi tam ortadakidir: daha önce hiç görmediği örnekleri de doğru tahmin edebilen model.
Bir dedektif düşün: elinde ipuçları var, bir de dosyanın sonucu, yani doğru cevap. Makine de örnekle öğrenirken aynı ikiliye bakar. İpuçlarına özellik denir: bir örneği tarif eden ölçülebilir bilgiler. Doğru cevaba da etiket denir. Bir e-postada ipuçları “kaç kelime”, “link var mı”, “bedava geçiyor mu” olabilir; etiketse “Spam” ya da “Normal”dir. ||| Bir dedektif düşün: elinde ipuçları var, bir de dosyanın sonucu, yani doğru cevap. Makine de örnekle öğrenirken aynı ikiliye bakar. İpuçlarına özellik denir: bir örneği tarif eden ölçülebilir bilgiler. Doğru cevaba da etiket denir. Bir e-postada ipuçları “kaç kelime”, “link veya şifre isteği var mı”, “bedava geçiyor mu” olabilir; etiketse “Spam” ya da “Normal”dir.
Etiketin türü görevi belirler: kategorik etiket → sınıflandırma, sürekli (sayısal) etiket → regresyon. Aşağıdaki örnekte basit özelliklerle bir e-postanın spam olup olmadığını ayırt etme sezgisini göreceksin. ||| Etiketin türü görevi belirler: kategorik etiket → sınıflandırma, nicel (sürekli) etiket → regresyon. Kategoriler sayıyla kodlanabilir; bu onları regresyon hedefi yapmaz. Aşağıdaki örnekte basit özelliklerle bir e-postanın spam olup olmadığını ayırt etme sezgisini göreceksin.
Bir e-postayı tarif eden ipuçlarını (özellikler) ve doğru cevabı (etiket) yan yana koyuyoruz: “bedava” geçmesi, link istemesi, aciliyet dili… Makine bol örnek görerek hangi ipuçlarının “Spam” ile birlikte gittiğini kendi kendine öğrenir; kuralı biz yazmayız, o örneklerden çıkarır. ||| Bir e-postayı tarif eden ipuçlarını (özellikler) ve doğru cevabı (etiket) yan yana koyuyoruz: “bedava” geçmesi, link veya şifre isteği, aciliyet dili… Makine bol örnek görerek hangi ipuçlarının “Spam” ile birlikte gittiğini kendi kendine öğrenir; kuralı biz yazmayız, o örneklerden çıkarır.
Özellik vektörü x = [“bedava” geçiyor; link var; aciliyet dili], etiket y = “Spam”. Denetimli öğrenmede model bu (x, y) çiftlerinden f(x) ≈ y eşlemesini, yani P(spam | x) gibi bir karar kuralını kestirmeye çalışır. ||| Özellik vektörü x = [“bedava” geçiyor; link veya şifre isteği; aciliyet dili], etiket y = “Spam”. Denetimli öğrenmede model bu (x, y) çiftlerinden f(x) ≈ y eşlemesini, yani P(spam | x) gibi bir karar kuralını kestirmeye çalışır.
Basit ayrım: çıktı bir sayıysa regresyon, çıktı bir etiketse sınıflandırma. Ev fiyatı bir sayı, spam kararı bir etikettir. ||| Basit ayrım: model bir miktar tahmin ediyorsa regresyon, bir kategori seçiyorsa sınıflandırma. Ev fiyatı bir miktardır; spam kararı bir kategoridir, kategoriler sayıyla kodlansa bile.
İki temel iş var. Regresyon bir sayı tahmin eder: noktaların tam ortasından geçen, hepsine en az uzaklıkta duran “en iyi doğru”yu çizeriz. Sınıflandırma ise bir grubu ötekinden ayıran bir sınır çeker. ||| İki temel iş var. Regresyon bir sayı tahmin eder: noktaların arasından geçen “en iyi doğru”yu çizeriz; en iyi doğru, her noktanın aynı x’teki dikey farkının karelerini topladığımızda bu toplamı en küçük yapan doğrudur. Sınıflandırma ise bir grubu ötekinden ayıran bir sınır çeker.
Aşağıdaki noktaların hiçbir etiketi yok. “Grupla”ya bas; makine onları benzerliğe göre iki kümeye ayırsın, hiçbirine uymayan aykırı noktayı da işaretlesin. ||| Aşağıdaki noktaların hiçbir etiketi yok. “Grupla”ya bas; makine onları en yakın merkeze göre iki kümeye ayırsın. İki kümeye de uzak kalan nokta aykırı diye işaretlenir.
Denetimsiz öğrenmenin gücü: kimse “bunlar bir grup” demeden makine yapıyı kendisi bulur. Bankaların dolandırıcılık tespiti büyük ölçüde anomali bulmaya dayanır. ||| Denetimsiz öğrenmenin gücü: kimse “bunlar bir grup” demeden makine yapıyı kendisi bulur. Aykırılık tespiti, bankaların dolandırıcılık analizinde kullandığı araçlardan biridir.
Aşağıdaki demo, noktaları iki sabit merkeze en yakınlıklarına göre atayarak k-means’in “atama” adımını gösterir; ayrıca her iki kümeye de uzak duran bir aykırı noktayı vurgular. Gerçek k-means, merkezleri yakınsayana dek iteratif olarak günceller. ||| Aşağıdaki demo, noktaları iki sabit merkeze en yakınlıklarına göre atayarak k-means’in “atama” adımını gösterir; ayrıca her iki kümeye de uzak duran bir aykırı noktayı vurgular. Gerçek k-means, merkezleri yakınsayana dek iteratif olarak günceller. Bu gösterimde küme merkezleri ve aykırı nokta önceden seçilmiştir; gerçek uygulamada aykırılık bir yöntem ve eşikle hesaplanır.
Öğrenmenin özü bu: “ne kadar yanlışım?” diye sor, biraz düzelt ve tekrarla; hem de milyonlarca kez. Sinir ağları da dahil neredeyse bütün modern YZ böyle eğitiliyor. ||| Öğrenmenin özü bu: “ne kadar yanlışım?” diye sor, biraz düzelt ve tekrarla; hem de milyonlarca kez. Sinir ağları başta olmak üzere bugünün modellerinin çoğu böyle, gradyanla eğitiliyor; karar ağaçları gibi bazı yöntemlerse başka yoldan öğrenir.
Öğrenme oranı işin en hassas ayarıdır: çok küçükse yakınsama yavaşlar; çok büyükse minimumun etrafında salınabilir ya da ıraksayabilir. Aşağıdaki demoda dışbükey bir kayıp eğrisinde inişi ve büyük öğrenme oranının nasıl aşıma (overshoot) yol açtığını gözlemle. Pratikte yüzeyler dışbükey değildir ve genelde stokastik gradyan inişi kullanılır. ||| Öğrenme oranı işin en hassas ayarıdır: çok küçükse yakınsama yavaşlar; çok büyükse minimumun etrafında salınabilir ya da ıraksayabilir. Aşağıdaki demoda dışbükey bir kayıp eğrisinde inişi ve büyük öğrenme oranının nasıl aşıma (overshoot) yol açtığını gözlemle. Derin ağların kayıp yüzeyleri genellikle dışbükey değildir ve eğitimde stokastik gradyan inişi gibi gradyan tabanlı yöntemler yaygındır; doğrusal regresyon gibi bazı modellerin kaybı dışbükeydir, ağaç tabanlı yöntemler gibi bazıları ise gradyan kullanmaz.
Topluluk öğrenmesi (ensemble), birçok modelin tahminini birleştirerek (oylama, bagging, boosting) tek bir modelden daha iyi ve daha kararlı sonuç elde eder; rastgele orman (random forest) ve gradyan artırma (gradient boosting) en bilinen örneklerdir. ||| Topluluk öğrenmesi (ensemble), birçok modelin tahminini birleştirir (oylama, bagging, boosting); hataları birbirini tamamlıyorsa genelleme iyileşebilir, ama her tekil modelden daha iyi sonuç garanti edilmez ve kazanç doğrulama verisiyle ölçülür. Rastgele orman (random forest) ve gradyan artırma (gradient boosting) en bilinen örneklerdir.
Aynı veriye üç ayrı model uyduruyoruz. Çok basit olan örüntüyü ıskalar (eksik uyum); aşırı karmaşık olan her noktayı ezberler ama yeni veride şaşırır (aşırı uyum). En iyisi tam ortadakidir: daha önce hiç görmediği örnekleri de doğru tahmin edebilen model. ||| Aynı veriye üç ayrı model uyduruyoruz. Çok basit olan örüntüyü ıskalar (eksik uyum); aşırı karmaşık olan her noktayı ezberler ama yeni veride şaşırır (aşırı uyum). En iyisi ikisinin arasındadır: daha önce hiç görmediği örnekleri de doğru tahmin edebilen model. Bu eğriler fikri gösterir; hangisinin iyi genellediğini ancak eğitimde kullanılmamış veride ölçülen hata söyler.
-->

<!-- REDAKSİYON NOTLARI
- 3.1 basit: "Hepsini sahnede izleyeceksin." → "Hepsini sahnede, adım adım göreceksin." ("izle" ekran fiili)
- 3.2 basit: "Aşağıdaki örneklerden birine dokun; ipuçlarını ve doğru cevabını gör." → "Şekil 3.1’deki örneklere bak; ipuçlarını ve doğru cevabını gör." ("dokun" ekran fiili)
- 3.5 basit: "“Grupla”ya bas; makine onları benzerliğe göre iki kümeye ayırsın, hiçbirine uymayan aykırı noktayı da işaretlesin." → "Şekil 3.4’te makine onları benzerliğe göre iki kümeye ayırıyor, hiçbirine uymayan aykırı noktayı da işaretliyor." ("bas" ekran fiili)
- 3.6 basit: "Öğrenme oranını yükselt ve kendin gör." → "Şekil 3.5’in sağ panelinde ne olduğuna bak." (kılavuzdaki örnek). "Aşağıda topu adım adım indir, kaybın erimesini izle." kılavuz gereği korundu; Şekil 3.5 karşılıyor.
- 3.3 basit "Şimdi aşağıdaki görevlerin...", 3.4 basit "İkisini de aşağıda kendin dene...", 3.7 basit "Şimdi aynı veriye üç model uydur" kâğıtta anlamlı; dokunulmadı.
- "Ne oluyor?" basit metinleri kılavuz gereği aynen bırakıldı; içlerinde ekran ifadeleri var: 3.4 "“Grupla”ya basınca", teknik 3.3 "“Doğruyu uydur”", teknik 3.4 "“Grupla”". Bu ekran ifadeleri "Şekil 3.k" göndermesine çevrildi (2026-09-30).
- Teknik paragraflardaki "Aşağıdaki demoda" / "Aşağıdaki örnekte" / "Aşağıdaki görevleri" ifadeleri kılavuz gereği aynen kaldı.
- Şekil 3.5 (descent): web demosunda "Yüksek" öğrenme oranı η = 0.92’dir ve 1 − 0.36·0.92 = 0.67 > 0 olduğundan AŞIM YAPMAZ (top tek yönlü, hızlıca iner: 0.6 → 2.06 → 3.03 → 3.68 …). Basılı metin ve tablo, kaynak "Ne oluyor?" ve teknik metindeki salınım/aşım anlatısını göstermek için print/figures/out/tr/sekil-3-5-descent.md’deki η = 4.6 tablosunu kullanır. Web demosu ile basılı sayılar bu yüzden farklıdır; QR’dan gelen okur "Yüksek" seçince salınım göremez. Öneri: web demosunda high η’yi 4.6 (ya da en az 3) yapmak.
- Şekil 3.4 (kmeans): demo verisinde 12 değil 11 nokta var (10 küme üyesi + 1 aykırı, indeks 10). Aykırı nokta demoda uzaklık eşiğiyle değil sabit indeksle işaretlenir; metin bunu "A üyelerinin en uzağı 1.22, aykırı 2.92" karşılaştırmasıyla gerekçelendirir.
- Şekil 3.6 (modelfit): demodaki "İyi (dengeli)" eğrisi (y = 3.0 − 0.16x + 0.15·sin(0.6x)) eğitim verisinde düz doğrudan daha düşük hata vermez (hata kareleri toplamı: eksik 1.43, iyi 1.52, aşırı 0). Bu yüzden metin eksik/iyi arasında sayısal hata karşılaştırması yapmaz; yalnızca aşırı uyumla saklama sınavını karşılaştırır. Figür çizilirken "iyi" eğrisi noktalara biraz daha yakın geçirilebilir.
- Şekil 3.3 (scatter): "Demoya gömülü metinler" listesindeki "Sınıflandırma (kategori)" ve buton karşılığı "Regresyon (sayı)" Kurulum’da panel başlığı olarak kullanıldı.
- 3.8: export’un "_Cevaplar: cevap-anahtari.md_" satırı çalışma notu sayılıp kaldırıldı.
- Kendin dene cevapları: print/src/tr/cevaplar/M03.md
- Yazar kararı (2026-09-10): kaynak metin dahil tüm "demo" sözcükleri "gösterim" ya da "Şekil N.j" yapıldı; "Aşağıdaki demo" → şekil öncesinde "Aşağıda yer alan gösterim (Şekil N.j)", sonrasında "Şekil N.j'teki gösterim".
- Yazar kararı (2026-09-10, figürler): ekran renkleri (yeşil/kırmızı/mavi/mor) duotone baskıya göre 'koyu/gri' ve 'turuncu' yapıldı; figür düzeni tarifleri ('kendi rengi', 'yanında rolü', 'ok çekmen') figürlerle eşleştirildi.
- 2026-09-30 insanlaştırma geçişi: "Peki …?" köprüleri, "tam olarak/tam bu/işte", "Kısaca", "unutma", "aslında … ibaret" çivileri ve "ezberlemez, kavrar" / "ne kadar? – hangisi?" / banka tekrarları azaltıldı; Şekil 3.2 Kurulum'daki meta ve cevap dağılımını ele veren cümle silindi; "kenar notundaki/teknik metindeki" iç göndermeler kaldırıldı; iki nokta sonrası küçük harf; teknik "Ne oluyor" tekrarları (3.3, 3.4, 3.5) kırpıldı. Değişen kaynak paragraflar yukarıdaki SOURCE-CHANGES bloğunda (19 satır); dijital sürüme taşınacak.
- 2026-10-01 düzeltme belgesi (R017, R018, R019, R020, R021, R022, R023, R024, R068, R093): özellik adı her yerde “link veya şifre isteği” (3.2 basit, tablo, Kurulum, teknik vektör, cevaplar); sayı=regresyon genellemesi miktar/kategori ayrımıyla düzeltildi (3.2 teknik, 3.4 kenar notu, kalanlar, cevaplar 3.2/4); en küçük karelerde dikey artık kareleri açıkça adlandırıldı (3.3 Adım adım 3–4, Ne oluyor, teknik; toplamlar 0.22 / 0.37 dikey artıklarla yeniden doğrulandı); Şekil 3.4’te merkezler ve aykırı nokta önceden seçili, eşik 2.4 ve işlem sırası (atama → eşik → güncelleme) tanımlandı, “standart k-means 11. noktayı A’ya atar, A = (2.68, 7.42)” notu eklendi (Kurulum, Adım adım, teknik, cevaplar); banka/anomali genellemesi daraltıldı; 3.6 kenar notu ve teknik “bütün YZ gradyanla / bütün yüzeyler” koşullandı; topluluk garantisi kaldırıldı; Şekil 3.6 orta panel “Daha düzgün temsili eğri”, hüküm metni ve doğrulama verisi uyarısı, çapraz doğrulama k-katlı tanımı; cevaplar Şekil 3.3: 0.55 · 6.5 = 3.575; 3.575 + 0.76 = 4.335 ≈ 4.34, “önceki dokuz nokta”, güven yorumu kalibrasyon koşuluyla; Şekil 3.1 cevap 3 ikinci kural “‘Bedava’ geçiyorsa ya da link veya şifre isteği varsa Spam”. Değişen kaynak paragraflar yukarıdaki SOURCE-CHANGES bloğunun sonundaki 13 satırda.
- 2026-10-01 R021: dijital gösterimdeki “Yüksek” öğrenme oranı demo-kod ajanı tarafından 4.6 yapıldı; basılı Şekil 3.5 tablosu (η = 4.6: 0.60 → 7.89 → 3.11 → 6.24 → 4.19 → 5.53 → 4.65) ve Kendin dene’deki η = 6 ıraksama örneği korundu; kaynak “salınır / aşım” cümleleri artık dijitalde de doğru. Yukarıdaki 0.92 notu tarihçedir.
- 2026-10-01 figür ajanına: Şekil 3.6 orta panel etiketi “İyi (dengeli)” → “Daha düzgün temsili eğri”, hüküm metni “Yanlılık-varyans dengesi: ne örüntüyü kaçıracak kadar basit ne gürültüyü ezberleyecek kadar karmaşık.”; Şekil 3.4 lejandı/altyazısı isterse “merkezler ve aykırı önceden seçili” notu alabilir.
-->
