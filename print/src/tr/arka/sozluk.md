# Sözlük

Bölüm numarası (ör. 3.6), terimin kitapta tanıtıldığı bölümü ve o bölüm içindeki kesimi gösterir.

**AB YZ Yasası (EU AI Act)** · Bölüm 7.5
Avrupa Birliği’nin yapay zekâ kullanımlarını riske göre dört kademeye ayıran düzenlemesi: kabul edilemez (yasak), yüksek, sınırlı ve minimal. Risk arttıkça yükümlülükler de artar.

**Açıklanabilir yapay zekâ (explainable AI, XAI)** · Bölüm 7.3
Bir modelin çıktısını insanın anlayabileceği gerekçelere bağlama çabası. Özellik önemi (SHAP, LIME) gibi yöntemlerle kara kutuyu denetlenebilir ve itiraz edilebilir kılar. Bkz. Kara kutu.

**Ağırlık (weight)** · Bölüm 4.2
Yapay nöronun her girdiye verdiği önem değeri. Eğitim, bu değerleri kaybı azaltacak yönde ayarlama işidir. Bkz. Parametre.

**Ajan (agent)** · Bölüm 6.4
Dil modelini araçlarla (hesap, arama, API) donatıp “düşün, aracı kullan, sonucu gözlemle, tekrar dene” döngüsüyle (ReAct) çalıştıran sistem. Konuşmakla kalmaz, işe girişir.

**Aktivasyon fonksiyonu (activation function)** · Bölüm 4.2
Nöronun ağırlıklı toplamını çıktıya çeviren doğrusal olmayan işlev: sigmoid, tanh, ReLU. Onsuz üst üste konan katmanlar tek bir doğrusal işleve çöker.

**Algoritma (algorithm)** · Bölüm 1.3
Sonlu, kesin tanımlı adımlar dizisi; bir kek tarifi gibi. Sözcük, 9. yüzyıl matematikçisi el-Harezmî’nin adından gelir.

**Anomali tespiti (anomaly detection)** · Bölüm 3.5
Çoğunluğun dağılımından belirgin biçimde sapan örnekleri yakalama. Bankaların şüpheli işlemi fark etmesi büyük ölçüde buna dayanır.

**Aşırı uyum (overfitting)** · Bölüm 3.7
Modelin eğitim örneklerini gürültüsüyle birlikte ezberleyip görülmemiş veride başarımını yitirmesi. Tersi, örüntüyü yakalayamayacak kadar basit kalan eksik uyumdur (underfitting). İyi model ikisinin ortasında durur.

**Bağlam penceresi (context window)** · Bölüm 5.8
Dil modelinin aynı anda tutabildiği en fazla token sayısı; küçük bir not defteri. Defter dolunca en eski satırlar silinir; pencereyi büyütmek pahalıdır.

**Belirtim oyunlama, ödül oyunlama (specification gaming, reward hacking)** · Bölüm 7.6
Sistemin verilen ölçütü en üst düzeye çıkarırken asıl amacı kaçırması: “çöp görünmesin” deyince çöpü halının altına süpürmek. Bkz. Hizalama.

**Bilgi edinme darboğazı (knowledge acquisition bottleneck)** · Bölüm 2.6
Klasik YZ’nin duvarı: dünya hakkındaki bütün kuralları elle yazmak ölçeklenmez. Kırılganlıkla (öngörülmeyen durumda çökme) birlikte veriden öğrenmeye geçişi hızlandırdı.

**Bilgi temsili (knowledge representation)** · Bölüm 2.2
Sembolik YZ’de bilgiyi açık semboller ve aralarındaki bağlarla (“Tekir bir kedidir”) kodlama. Semantik ağlar, çerçeveler ve mantık önermeleri bunun araçlarıdır.

**Büyük dil modeli (large language model, LLM)** · Bölüm 5.1
Devasa metinle eğitilmiş, her adımda en olası bir sonraki token’ı tahmin edip diziye ekleyerek (otoregresif) yazan Transformer tabanlı model. Bugünkü sohbet asistanlarının temeli.

**Çıkarım (inference)** · Bölüm 2.2
Bilgi temsili üzerinde kurallar uygulayarak açıkça söylenmemiş bilgiye ulaşma. “Tekir kedidir, kedi memelidir” bağlarından “Tekir memelidir” sonucunu türetmek gibi.

**Çince Oda (Chinese Room)** · Bölüm 8.3
Searle’ün düşünce deneyi: kural kitabıyla kusursuz Çince cevaplar üreten ama tek kelime Çince anlamayan kişi. Sembol işlemenin anlamaya yetmediğini savunur; karşı görüşler de güçlüdür.

**Dar yapay zekâ (narrow AI)** · Bölüm 1.6
Tek bir işte usta, o işin bir adım dışında acemi sistem; “zayıf YZ” de denir. Bugünkü bütün YZ sistemleri, sohbet botları dahil, bu sınıftadır.

**Deepfake (sentetik medya)** · Bölüm 7.4
Üretken modellerle üretilen sahte içerik: hiç yaşanmamış konuşma, çekilmemiş fotoğraf. Tespit bir silahlanma yarışıdır; en sağlam savunma kaynak doğrulama ve şüpheciliktir.

**Denetimli öğrenme (supervised learning)** · Bölüm 3.3
Doğru cevabı verilmiş örneklerden, yani özellik-etiket çiftlerinden, girdiden çıktıya eşlemeyi öğrenme. Sınıflandırma ve regresyon bu türdendir.

**Denetimsiz öğrenme (unsupervised learning)** · Bölüm 3.3
Hiç cevap verilmeden, yalnızca girdilerden yapı çıkarma. Kümeleme ve boyut indirgeme örnekleridir.

**Depolanmış-program ilkesi (stored-program principle)** · Bölüm 1.5
Programın da veri gibi bellekte tutulması. Makineyi yeniden kablolamak yerine yeni talimat yüklersin; cebindeki telefon dahil bugünkü hemen her bilgisayar bu düzeni kullanır.

**Derin öğrenme (deep learning)** · Bölüm 4.1
Çok sayıda gizli katmanın üst üste konduğu sinir ağlarıyla öğrenme. Derinlik, ham veriden giderek soyut temsiller (kenar, şekil, nesne) çıkarmayı sağlar.

**Difüzyon modeli (diffusion model)** · Bölüm 5.7
Saf gürültüden başlayıp her adımda biraz temizleyerek görsel üreten model; buğulu camı yavaş yavaş silmek gibi. Gürültü ekleme sürecini tersine çevirmeyi öğrenir.

**Dikkat (attention)** · Bölüm 5.4
Her token’ın, anlamı için dizideki hangi token’lara bakacağını öğrenmesi; “o” zamirinin kimi kastettiğini böyle çözer. Öz-dikkat (self-attention) bunu sorgu, anahtar ve değer vektörleriyle hesaplar. Transformer’ın temeli.

**Düzenliler ve dağınıklar (neats and scruffies)** · Bölüm 2.6
YZ’deki yöntemsel gerilim: her adımın temiz matematikle kanıtlanmasını isteyenler (neats) ile “çalışıyorsa iyidir, teorisini sonra buluruz” diyenler (scruffies). Bugünün YZ’si ikisinin karışımıdır.

**Etiket (label)** · Bölüm 3.2
Bir eğitim örneğinin doğru cevabı: “Spam” ya da “Normal”. Etiket kategorikse sınıflandırma, sayısalsa regresyon görevi doğar. Bkz. Özellik.

**Evrişimli sinir ağı (convolutional neural network, CNN)** · Bölüm 4.5
Küçük bir filtreyi (çekirdek) görüntü üzerinde gezdirip yerel desenleri (kenar, köşe) arayan ve bulduklarını özellik haritasına işleyen ağ. Aynı filtre her yerde kullanılır; az parametreyle öğrenir.

**Genel yapay zekâ (artificial general intelligence, AGI)** · Bölüm 1.6
İnsan gibi her alanda öğrenip uyum sağlayabilen varsayımsal sistem; henüz yapılmadı. Genel olmak, bilinçli olmak demek değildir. Bkz. Güçlü yapay zekâ.

**Genişlik-öncelikli arama (breadth-first search, BFS)** · Bölüm 2.4
Hiçbir yön bilgisi kullanmadan her yeri katman katman tarayan bilgisiz arama. En kısa yolu garanti eder ama çok düğüm açar. Bkz. Sezgisel.

**Geri yayılım (backpropagation)** · Bölüm 4.4
Hatanın çıkıştan girişe geri geri yürüyüp her bağlantıya “payını düzelt” demesi; zincir kuralıyla gradyan hesabı. Derin ağların eğitilebilmesinin anahtarı.

**Gömü (embedding)** · Bölüm 5.3
Bir token’ı anlamını taşıyan yoğun bir sayı vektörüne, kocaman bir şehirdeki adrese, eşleme. Anlamca benzer kelimeler yakın düşer; “kedi” ile “köpek” kapı komşusudur.

**Gradyan inişi (gradient descent)** · Bölüm 3.6
Her adımda eğimi yoklayıp kaybı azaltacak yönde küçük bir adım atarak parametreleri güncelleme. Sisli vadide dibe iniş gibi. Bkz. Öğrenme oranı.

**Güçlü yapay zekâ (strong AI)** · Bölüm 1.6
Searle’ün terimi: makinenin gerçekten anlayıp anlamadığı, bir zihne sahip olup olmadığı iddiası. Felsefi bir sorudur; genel yapay zekâ (AGI) ile karıştırılmamalı.

**Halüsinasyon (hallucination)** · Bölüm 5.8
Modelin kulağa doğru gelen ama yanlış bilgiyi bozuntuya vermeden üretmesi. İşi doğruyu bilmek değil, olası devamı üretmektir; RAG ve doğrulama bunu azaltır.

**Hesaplamacılık (computationalism)** · Bölüm 1.3
Zihnin bir bilgi-işleme sistemi, düşünmenin de sembol manipülasyonu biçiminde bir hesaplama olduğu görüşü. Kökleri Hobbes’a uzanır; yapay zekânın temelindeki fikir.

**Hizalama (alignment)** · Bölüm 7.6
Bir sistemin davranışını insan niyet ve değerleriyle uyumlu kılma problemi. Söylediğini yapıp kastettiğini kaçıran makine bu sorunun örneğidir. Hem teknik hem normatif bir sorudur.

**İkili gösterim (binary representation)** · Bölüm 1.3
Her bilgiyi 0 ve 1’lerle (bit) kodlama; makinenin basit alfabesi. Sekiz bit bir bayt eder ve 0 ile 255 arası her sayıyı tutar.

**İleri besleme (feedforward)** · Bölüm 4.3
Sinyalin giriş katmanından gizli katmanlar üzerinden çıkış katmanına akması; ağın “tahmin et” adımı. Geri yayılım ise “hatadan ders al” adımıdır.

**İnce ayar (fine-tuning)** · Bölüm 5.6
Ön eğitilmiş modeli talimat-cevap çiftleriyle yeniden eğiterek soruya cevap vermeyi, yönergeyi izlemeyi öğretme aşaması (denetimli ince ayar, SFT).

**İstem mühendisliği (prompt engineering)** · Bölüm 6.2
Modeli yeniden eğitmeden, istemi (prompt) iyi kurarak davranışını yönlendirme pratiği: açık rol, yeterli bağlam, net format, gerekirse örnek (few-shot).

**Kara kutu (black box)** · Bölüm 7.3
Kararını veren ama gerekçesini anlatamayan model. Kredi, işe alım gibi kararlarda “neden?” diye sorabilmek bir hak meselesidir. Bkz. Açıklanabilir yapay zekâ.

**Kayıp (loss)** · Bölüm 3.6
Modelin ne kadar yanıldığının ölçüsü; ne kadar büyükse vadide o kadar yukarıdasın. Eğitim, kaybı en aza indirecek parametreleri bulmaktır.

**Kümeleme (clustering)** · Bölüm 3.5
Etiketsiz veriyi benzerliğe göre kendiliğinden gruplama; kutudaki düğmeleri ayırmak gibi. k-ortalamalar (k-means) noktaları en yakın küme merkezine atar, merkezleri günceller.

**KVKK / GDPR (Kişisel Verilerin Korunması Kanunu / General Data Protection Regulation)** · Bölüm 7.5
Kişisel veri rejimleri: rıza, amaç sınırlaması, veri minimizasyonu ve otomatik kararlara itiraz hakkı. AB YZ Yasası’nı tamamlar.

**Makine öğrenmesi (machine learning)** · Bölüm 3.1
Kural yazmak yerine bol örnek gösterip örüntüyü makinenin kendisinin yakalamasını sağlayan yaklaşım. Model, kayıp ve optimizasyon döngüsüne dayanır.

**Markov zinciri (Markov chain)** · Bölüm 2.5
Bir sonraki durumun yalnızca şimdiki duruma bağlı olduğu olasılıksal süreç (Markov özelliği: geçmiş önemli değil). Uzun vadede dağılım kararlı bir duruma yakınsar.

**Moore yasası (Moore’s law)** · Bölüm 1.7
Çipteki transistör sayısının yaklaşık her iki yılda bir ikiye katlandığı gözlemi (1965). Doğa yasası değil, ampirik bir eğilim; son yıllarda yavaşlıyor.

**Orkestrasyon (orchestration)** · Bölüm 6.5
YZ uygulamasında istem oluşturma, yönlendirme, araç ve RAG çağrılarını koordine eden katman; restoranın müdürü, asıl “beyin”. Model çoğu zaman değiştirilebilir bir parçadır.

**Öğrenme oranı (learning rate)** · Bölüm 3.6
Gradyan inişinde her adımın boyu. Çok küçükse yakınsama yavaşlar; çok büyükse top vadinin dibini ıskalayıp karşı yamaca fırlar.

**Ön eğitim (pretraining)** · Bölüm 5.6
Devasa metin derlemi üzerinde, bir sonraki token’ı tahmin hedefiyle (öz-denetimli) dilin ve dünyanın istatistiğini öğrenme aşaması. Model “ne bildiğini” burada kazanır.

**Önyargı, algoritmik yanlılık (bias)** · Bölüm 7.2
Modelin verideki tarihsel önyargıyı, eksik temsili ya da vekil değişkenleri öğrenip pekiştirmesi. Model niyet taşımaz; çarpıklığı okuduğu defterden alır. Nöron sapması için bkz. Sapma.

**Özellik (feature)** · Bölüm 3.2
Bir örneği tarif eden ölçülebilir ipucu: e-postada “link var mı”, “bedava geçiyor mu”. Model, özelliklerden etikete giden eşlemeyi öğrenir. Bkz. Etiket.

**Özyinelemeli sinir ağı (recurrent neural network, RNN)** · Bölüm 4.6
Diziyi kelime kelime okuyup her adımda bir hafıza (gizli durum) taşıyan ağ. Uzun bağımlılıklarda kaybolan gradyanla zorlanır; LSTM bunu hafifletir. Yerini büyük ölçüde Transformer aldı.

**Parametre (parameter)** · Bölüm 3.1
Modelin eğitimle öğrendiği sayısal değerler: ağırlıklar ve sapmalar. Model, girdileri bu değerler aracılığıyla çıktılara eşler.

**Pekiştirmeli öğrenme (reinforcement learning)** · Bölüm 3.3
Bir ajanın ortamda deneyerek, ödül ya da ceza toplayarak, ödülü en üst düzeye çıkaran bir politika öğrenmesi. Öğretmen ders anlatmaz; makine oyuna girer.

**RAG (retrieval-augmented generation, bilgiyle desteklenmiş üretim)** · Bölüm 6.3
Cevaptan önce ilgili belgeleri bulup isteme ekleyerek modeli kaynağa dayandırma (topraklama). Açık kitap sınavı gibi: halüsinasyon azalır, kaynak gösterilebilir.

**Regresyon (regression)** · Bölüm 3.4
“Ne kadar?” sorusuna sayı cevabı veren denetimli görev: evin fiyatı kaç lira? En basit hâli, noktalara en küçük kareler doğrusu uydurmaktır.

**RLHF (reinforcement learning from human feedback, insan geri bildirimiyle hizalama)** · Bölüm 5.6
İnsan tercihleriyle bir ödül modeli eğitip dil modelini ona göre güncelleme. Asistanın yardımcı, dürüst ve güvenli olmayı, yani görgüyü öğrendiği aşama.

**Sapma (bias)** · Bölüm 4.2
Nöronun ağırlıklı toplamına eklenen, eşiği ayarlayan sabit; kapı bekçisinin kendi huyu. Eğitimle öğrenilir. Verideki önyargı anlamı için bkz. Önyargı.

**Sembolik yapay zekâ (symbolic AI, GOFAI)** · Bölüm 2.1
Zekâyı açıkça yazılmış semboller ve kurallar üzerinde mantıksal işlem olarak ele alan klasik yaklaşım; 1950’lerden 1980’lere baskındı. Mantık, arama ve uzman sistemler alet çantasıydı.

**Sezgisel (heuristic)** · Bölüm 2.4
Aramada “hangi yön daha umut verici?” diye tahmin yürüten kısayol. Hız kazandırır ama en iyi çözümü kaçırabilir; “yeterince iyi”yi “mükemmel”e tercih eder.

**Sıcaklık (temperature)** · Bölüm 5.5
Üretimde olasılık dağılımını keskinleştiren ya da yumuşatan “yaratıcılık” ayarı. Düşükse hep en olası kelime seçilir; yüksekse daha çeşitli, daha riskli çıktı.

**Sınıflandırma (classification)** · Bölüm 3.4
“Hangisi?” sorusuna kategori cevabı veren denetimli görev: spam mı, değil mi? Sınıfları ayıran bir karar sınırı öğrenir; sınır doğrusal olmak zorunda değildir.

**Sorumluluk (accountability)** · Bölüm 8.6
Bir YZ zarara yol açtığında hesap verme yükümlülüğü. Bugün ezici biçimde insanlara ve kurumlara (geliştirici, işleten, kullanıcı) atfedilir; “YZ’nin kendisine” değil.

**Süper zekâ (superintelligence)** · Bölüm 8.4
Her bilişsel alanda insanı kat kat aşan varsayımsal YZ; dar YZ ve AGI’den sonraki basamak. Şimdilik spekülatif.

**Tekillik (singularity)** · Bölüm 8.5
Kendini geliştirebilen bir YZ’nin (özyinelemeli özgelişim) zekâ patlamasıyla öngörülemez bir noktaya varacağı hipotezi. Ne kesin ne imkânsız; ciddiye alınması gereken belirsiz bir senaryo.

**Token** · Bölüm 5.2
Dil modelinin metni böldüğü küçük lego parçası: bazen bir kelime, bazen kelimeden kopmuş bir parça, bazen bir virgül. Bağlam penceresi ve maliyet token’la ölçülür.

**Topluluk öğrenmesi (ensemble learning)** · Bölüm 3.7
Birçok modelin tahminini birleştirerek (oylama, bagging, boosting) tek modelden daha iyi ve kararlı sonuç alma. Rastgele orman ve gradyan artırma en bilinen örnekleridir.

**Transformer** · Bölüm 5.1
Dikkat mekanizmasına dayanan, diziyi sıralı değil aynı anda işleyen mimari (2017, “Attention Is All You Need”). Bugünün büyük dil modellerinin temeli.

**Turing makinesi (Turing machine)** · Bölüm 1.4
Bandı okuyan, yazan ve iki yana kayan tek bir kutucuktan oluşan soyut makine; prensipte her hesabı yapabilir. Hesaplanabilirliğin biçimsel temeli (1936).

**Turing testi (Turing test)** · Bölüm 8.2
Turing’in taklit oyunu (1950): makine yazışmada insandan ayırt edilemiyorsa yeterli sayılır. Davranışçı bir ölçüttür; akıcı taklit, anlama ya da bilinç kanıtı değildir.

**Uzman sistem (expert system)** · Bölüm 2.3
Bir alandaki uzman bilgisini “EĞER şu doğruysa O ZAMAN şunu yap” kurallarına döken sistem: bilgi tabanı artı çıkarım motoru. Kuralları ileri zincirlemeyle ateşler; 1980’lerde yaygındı.

**Üretken çekişmeli ağ (generative adversarial network, GAN)** · Bölüm 4.7
Kalpazan (üretici) ile dedektifi (ayırt edici) aynı odaya kilitleyen ikili ağ. Biri sahte üretir, öteki yakalamaya çalışır; yarış sürdükçe üretilenler gerçeğe yaklaşır.

**Üretken yapay zekâ (generative AI)** · Bölüm 5.1
Tanımakla kalmayıp yazı, görsel, kod üreten modeller; verinin kendisini üreten dağılımı öğrenir. Transformer ve difüzyon bu çağın motorlarıdır.

**Üstel büyüme (exponential growth)** · Bölüm 1.7
Belirli aralıklarla ikiye katlanan büyüme; satranç tahtasındaki pirinç gibi masum başlar, birkaç katlamada kontrolden çıkar. Modern YZ’yi taşıyan işlem gücü böyle birikti.

**Yanlılık-varyans dengesi (bias–variance tradeoff)** · Bölüm 3.7
Eksik uyum ile aşırı uyum arasındaki denge. İyi model ikisini dengeleyip görülmemiş veriye genelleşendir; örüntüyü öğrenir.

**Yapay nöron (artificial neuron)** · Bölüm 4.2
Girdileri ağırlıklarıyla tartıp toplayan, sapma ekleyen ve sonucu aktivasyondan geçiren basit birim; kapı bekçisi gibi. Beynin kopyası değil, kaba bir matematiksel benzetme.

**Yapay sinir ağı (artificial neural network)** · Bölüm 4.1
Yapay nöronların katman katman dizilmesiyle kurulan öğrenme makinesi; özünde doğrusal olmayan dönüşümler yığını. Biyolojik nörondan yalnızca gevşek biçimde esinlenir.

**Yapay zekâ (artificial intelligence, YZ)** · Bölüm 1.1
İnsan zekâsı gerektiren görevleri yerine getirebilen sistemler; alanın pragmatik tanımı. Hesaplama kuramı ile zihin felsefesinin kesişiminde doğdu.
