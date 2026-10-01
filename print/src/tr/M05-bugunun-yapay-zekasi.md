# Bölüm 5
## Bugünün Yapay Zekâsı
*Token’dan dil modeline, dikkatten difüzyona*

<!-- acc #7a3fb0 · tag Üretken Çağ -->

### 5.1 Üretken çağ: tanımaktan üretmeye

Şimdiye dek makineler hep “tanıyan” taraftaydı: Bu spam mı, bu kedi mi, bu ev kaç para eder? Bir ressam çırağının yıllarca tablo seyretmesi gibiydi bu. Sonra bir gün çırak fırçayı eline aldı: Makineler artık üretiyor. Yazı yazıyor, resim çiziyor, kod üretiyor, sohbet ediyor.

Bu sıçramanın dönüm noktalarından biri Transformer mimarisi ve onun kalbindeki dikkat (attention) fikri. Üretken modeller (GAN gibi) ve dikkat mekanizmaları daha önce de araştırılıyordu; Transformer, üretken dil modellerinin büyük ölçekte eğitilmesini mümkün kıldı. Hikâyeye en küçük parçadan başlıyoruz: bir cümle makineye nasıl görünür? Token denen küçük metin parçaları olarak. Önce token, sonra gömü, dikkat ve kelime kelime üretim; ardından eğitim, difüzyon ve sınırlar.

> **Kenar notu.** “Neden tam şimdi?” sorusunun cevabı üç ayakta: bol veri (internet), güçlü donanım (GPU) ve doğru mimari (Transformer). Üçü bir araya gelince üretken çağ başladı.

#### Teknik derinlik

Üretken YZ, ayırt edici (discriminative) modellemeden üretken (generative) modellemeye geçişi temsil eder. Ayırt edici bir sınıflandırıcı, girdi x verildiğinde etiket y’nin olasılığını modeller: p(y|x). Üretici model ise üretilecek içeriğin, yani x’in, dağılımını modeller: p(x) ya da bir koşula bağlı olarak p(x|koşul); bu dağılımdan yeni içerik örnekleri üretilir. Transformer mimarisi (Vaswani vd., 2017, “Attention Is All You Need”) üretken dil modellerinin ölçeklenmesinde önemli bir dönüm noktasıydı; üretken modeller (ör. GAN, 2014) ve dikkat mekanizmaları daha önce de araştırılıyordu. Modern sıçrama bu mimari ile onu büyük ölçekte eğitebilen veri + hesaplama birikiminin birleşmesinden doğdu.

Bu bölüm üretken yığını uçtan uca kurar: tokenleştirme → gömü uzayı → öz-dikkat (self-attention) → otoregresif üretim → eğitim hattı (ön eğitim, ince ayar, RLHF) → difüzyon tabanlı görüntü üretimi → ve pratik sınırlar (halüsinasyon, bağlam penceresi, maliyet). Böylece bugünün LLM ve üretken modellerinin neden ve nasıl çalıştığı yerine oturur.

Bu yığının ilk basamağı en küçük parça. Sen bir cümleyi harf harf, kelime kelime okursun; makine neyi okur?

### 5.2 Makine kelimeleri nasıl görür: token’lar

Bir dil modeli, harfleri ya da kelimeleri “olduğu gibi” görmez. Metni önce minik lego parçalarına ayırır; bunlara token denir. Bir token bazen koca bir kelimedir, bazen bir kelimeden kopmuş küçük bir parça, bazen de yalnızca bir virgül.

Neden parçalıyor? Lego kutusunu düşün: sınırlı sayıda parçayla sonsuz şey kurulur. Dünyadaki bütün kelimeleri ezberlemek imkânsızdır; ama sınırlı bir parça takımıyla her kelime kurulabilir. Aşağıdan bir örnek seç, makinenin cümleyi parçalara ayırışını izle.

> **Kenar notu.** Aynı metin, farklı dillerde farklı sayıda token tutar. Bu yüzden bir LLM’e Türkçe sormak bazen İngilizce sormaktan daha “pahalı” olabilir.

**Şekil 5.1 · Cümleni token’lara böl**
![Şekil 5.1](../../figures/out/tr/sekil-5-1-token.svg)

*Kurulum.* Şekilde üç örnek cümle ve her birinin token’lara ayrılmış hâli var. Her token bir kutu içinde. Beyaz kutular bağımsız bir parçayı, turuncu tonlu kutular ise “##” ile başlayan devam parçalarını gösterir. Her cümlenin altında iki sayı yazıyor: kelime sayısı ve token sayısı. Bölücünün kuralı canlı demodakiyle aynı; oyuncak bir kuraldır, gerçek bir tokenizer değildir.

*Adım adım.* Bölücünün kuralı üç satır. Altı karakter ve daha kısa kelimeler tek token kalır. Daha uzun kelimeler dörder karakterlik parçalara bölünür; ilk parça düz, sonrakiler “##” ile yazılır. Virgül, nokta ve ünlem her zaman ayrı bir token’dır. Şimdi bu kuralı üç cümleye uygula:

| Cümle | Token’lar | Kelime | Token |
|---|---|---|---|
| Merhaba dünya, bugün 2026. | Merh · ##aba · dünya · , · bugün · 2026 · . | 4 | 7 |
| Yapay zekâ metni token’lara böler. | Yapay · zekâ · metni · toke · ##n’la · ##ra · böler · . | 5 | 8 |
| Tokenleştirme şaşırtıcı derecede önemli! | Toke · ##nleş · ##tirm · ##e · şaşı · ##rtıc · ##ı · dere · ##cede · önemli · ! | 4 | 11 |

Birinci cümlede “Merhaba” yedi harf; sınırı bir harfle aşıyor ve ikiye bölünüyor. “2026” bir sayı ama bölücü için sıradan bir dört karakterli kelime. Nokta ayrı kutuya düşüyor. İkinci cümlede “token’lara” kesme işaretiyle birlikte on karakter; üç parçaya ayrılıyor. Kesme işareti, virgül gibi ayrı sayılmıyor; kelimenin içinde kalıyor. Üçüncü cümle en çarpıcı olanı: dört kelime, on bir token. “Tokenleştirme” tek başına dört parça. “önemli” tam altı harf; sınırı aşmadığı için tek parça kalıyor.

Aynı sayıda kelimeden çok farklı sayıda token çıkabiliyor: birinci ve üçüncü cümle dörder kelime, ama biri 7 token, öteki 11. Belirleyici olan kelime sayısı değil, uzun ve nadir kelimelerin sayısı. Gerçek bir tokenizer sınırları bu kuraldan farklı çizer; kaç token çıkacağı seçilen tokenizer’a ve sözlüğüne bağlıdır. Yön ise aynıdır: Türkçe ekler kelimeleri uzattığı için bu dilde token sayısı çoğu zaman İngilizceye göre şişer. Türkçe sormanın bazen daha pahalı olması bu yüzden.

*Ne oluyor?* Model bir cümleyi olduğu gibi görmez; önce küçük parçalara (token) böler. Buradaki bölücü kısa kelimeleri tek parça bırakır, uzun kelimeleri “##” ile böler, noktalama işaretlerini ayrı sayar; gerçek token sınırları kullanılan tokenizer’a ve sözlüğüne bağlıdır. Model her şeyi bu parçalar hâlinde okur; hem kapasitesi hem ücreti token sayısına göre hesaplanır.

*Kendin dene.* 1) “Yapay zekâ öğreniyor.” cümlesini aynı kuralla böl; kaç token çıkar? 2) “Bilgisayarlarımızla” kelimesi kaç parçaya ayrılır? Parçaları yaz. 3) Üçüncü örnek cümlede kelime başına ortalama kaç token düşüyor? Birinci cümleyle karşılaştır. Canlı demo: [QR 5.1]

#### Teknik derinlik

Modern modeller alt-kelime (subword) tokenleştirme kullanır (yaklaşımlar: BPE, WordPiece, unigram; SentencePiece ise bu modelleri eğiten bir araçtır): sık geçen diziler tek token olur, nadir kelimeler birden çok parçaya ayrılır. Sözlük tipik olarak 30K–100K+ token içerir; her token bir tam sayı kimliğine (ID) eşlenir.

Kabaca İngilizcede 1 token ≈ 0.75 kelime; Türkçe gibi eklemeli dillerde kelime başına daha çok token düşebilir. Model bağlamı ve maliyeti token cinsinden ölçülür: hem bağlam penceresi hem ücretlendirme token sayısına bağlıdır. Şekil 5.1 basitleştirilmiş bir alt-kelime bölücü kullanır (uzun kelimeleri “##” ile parçalara ayırır).

Bu gösterimde kısa kelimeler tek token kalır, uzun kelimeler “##” ile parçalara ayrılır, noktalama ayrı bir token sayılır; gerçek token sınırları seçilen tokenizer’a ve sözlüğe bağlıdır.

Şekil 5.1’deki kural (en çok 6 karakter tek token, sonrası dörder karakter) gerçek bir tokenizer sözlüğünün yerini tutmaz. Gerçek bir sözlükte sınırlar sıklık istatistiğine göre düşer: sık geçen bir kelime çoğu zaman tek token kalır, nadir bir kelime birkaç parçaya ayrılır. “Merhaba” ya da “Tokenleştirme” için kesin bir token sayısı, tokenizer ve sürümü sabitlenip çalıştırılmadan verilemez. Kural basit, sonuç aynı yöne işaret eder: nadir ve uzun kelimeler daha çok parça tutar.

Her token artık bir sayı kimliği taşıyor. Ama bir kimlik numarası, “kedi” ile “köpek”in yakın olduğunu söylemez. Anlam nereden gelir?

### 5.3 Anlamı sayıya çevirmek: gömüler

Token’lar makineye sayı olarak girer ama kuru bir kimlik numarası “anlam” taşımaz. Vektör gösterimi, kısaca gömü (embedding), burada sahneye çıkar: Her kelime, kocaman bir şehirde bir adrese yerleştirilir. O adres, kelimenin anlamını taşıyan bir sayı listesidir.

Bu şehirde anlamca benzeşen kelimeler aynı mahalleye taşınır. “Kedi” ile “köpek” kapı komşusudur; “kral” ile “kraliçe” de öyle. Şekil 5.2’de bir kelimeye bak, komşularını gör.

> **Kenar notu.** Gömüler yalnızca kelimeler için değil: cümleler, görseller, sesler de aynı uzaya gömülebilir. Çok-kipli (multimodal) modellerin ve anlamsal aramanın (semantic search) temeli budur.

**Şekil 5.2 · Anlam haritası**
![Şekil 5.2](../../figures/out/tr/sekil-5-2-embed.svg)

*Kurulum.* Şekil, dokuz kelimeyi iki boyutlu bir haritaya yerleştiriyor. Üç kesikli daire, üç anlam ailesi: hayvanlar (kedi, köpek, kuş), krallık (kral, kraliçe, prens), yiyecekler (elma, ekmek, peynir). Her noktanın yanında kelimesi yazıyor; koordinatlar aşağıdaki tabloda. Noktalar yakınlık fikrini göstermek için elle yerleştirilmiş; eğitilmiş bir modelden ya da PCA/t-SNE çalıştırılarak elde edilmemiş. Bu haritada yakın duran noktalar anlamca da yakın sayılıyor; uzaklık düz bir cetvelle ölçülüyor.

*Adım adım.* Haritadaki konumlar ve her kelimenin en yakın iki komşusu:

| Kelime | Aile | x | y | En yakın 2 komşu (uzaklık) |
|---|---|---|---|---|
| kedi | hayvan | 58 | 62 | köpek (28.6), kuş (30.6) |
| köpek | hayvan | 84 | 50 | kedi (28.6), kuş (52.8) |
| kuş | hayvan | 52 | 92 | kedi (30.6), köpek (52.8) |
| kral | krallık | 198 | 54 | kraliçe (28.8), prens (34.1) |
| kraliçe | krallık | 222 | 70 | kral (28.8), prens (31.6) |
| prens | krallık | 196 | 88 | kraliçe (31.6), kral (34.1) |
| elma | yiyecek | 128 | 132 | peynir (17.2), ekmek (26.8) |
| ekmek | yiyecek | 152 | 120 | elma (26.8), peynir (42.8) |
| peynir | yiyecek | 118 | 146 | elma (17.2), ekmek (42.8) |

Uzaklık Pisagor’la hesaplanıyor: iki noktanın yatay ve dikey farklarının karelerini topla, karekökünü al. “kedi” ile “köpek” için farklar 26 ve 12; kareleri 676 ve 144; toplam 820; karekök 28.6. Bu hesabı dokuz kelime için yaptığında her kelimenin en yakın iki komşusu kendi ailesinden çıkıyor; tek istisna yok.

Aileler arasında uzaklık büyüyor. “kedi” ile “elma” arası 99 birim; “kedi” ile “kraliçe” arası 164. Harita yalnız kimin komşu olduğunu değil, kimin ne kadar yabancı olduğunu da söylüyor. Sınır bölgesi de var: “prens”in üçüncü en yakın kelimesi “ekmek” (54.4); krallık mahallesiyle yiyecek mahallesi birbirine değiyor. Makinenin anlam dediği şey bu geometri: adresler arasındaki mesafe. Bir sınır: gerçek gömüler yüzlerce boyutludur; iki boyutlu bir haritada en yakın görünen iki nokta, asıl uzayda en yakın ikili olmayabilir.

*Ne oluyor?* Her kelime, bir haritadaki noktaya dönüştürülür. Anlamca yakın kelimeler bu haritada da yan yana durur; buradaki en yakın 2 komşu, anlamca en benzer 2 kelimeyi temsil eder. Bu haritanın noktaları fikri göstermek için elle yerleştirilmiştir, eğitilmiş bir modelden alınmamıştır. Makine de “kedi” ile “köpek”in akraba, “elma”nın uzak olduğunu aradaki mesafeye bakarak anlar.

*Kendin dene.* 1) “kuş” ile “peynir” arasındaki uzaklığı hesapla. Tablodaki aile içi uzaklıkların en büyüğüyle karşılaştır. 2) Haritaya “aslan” kelimesini eklemek istesen hangi bölgeye koyardın? x ve y için makul bir çift öner ve en yakın iki komşusunu bul. 3) “ekmek” için en yakın üçüncü kelime hangisi, hangi aileden? Bu sana harita hakkında ne söylüyor? Canlı demo: [QR 5.2]

#### Teknik derinlik

Gömü, bir token’ı yoğun (dense) bir vektöre eşler (tipik olarak yüzlerce–binlerce boyut). Bu vektörler eğitimle öğrenilir; anlamsal/sözdizimsel ilişkiler geometriye yansır. Benzerlik genelde kosinüs benzerliğiyle ölçülür.

Ünlü örnek: vektör aritmetiğiyle kral − adam + kadın ≈ kraliçe gibi analojiler ortaya çıkabilir. Şekil 5.2’deki noktalar benzerlik fikrini göstermek için elle yerleştirilmiştir; eğitilmiş bir modelden çıkarılmış gömüler ya da PCA/t-SNE sonucu değildir. Gerçek gömüler çok daha yüksek boyutludur; iki boyutlu bir izdüşümde en yakın görünen iki nokta, asıl uzayda en benzer ikili olmayabilir.

Bu gösterimde en kısa mesafedeki 2 nokta = anlamca en benzer 2 kelime; yakınlık = benzer anlam. Noktalar elle yerleştirilmiştir; iki boyutlu yakınlık, asıl uzaydaki en yakın komşuyu garanti etmez.

Şekil 5.2’deki uzaklık Öklid uzaklığıdır: d = √((x₁ − x₂)² + (y₁ − y₂)²). Gerçek gömülerde daha çok kosinüs benzerliği kullanılır: cos θ = (a·b) / (‖a‖·‖b‖). Bu ölçü vektörlerin uzunluğunu değil yönünü karşılaştırır; 1’e yakın değer aynı yön, 0 dik (ilgisiz), −1 zıt yön demektir.

Her kelimenin bir adresi var. Ama cümle içinde bir kelime, o an hangi komşusuna bakması gerektiğini nasıl seçer?

### 5.4 Dikkat: Transformer’ın kalbi

Şu cümleyi oku: “Kedi kaçtı çünkü o korkmuştu.” Buradaki “o” kim? Sen farkında bile olmadan dönüp “kedi”ye baktın. Dikkat (attention) mekanizması, makineye bu dönüp bakmayı öğretir: Her kelime, anlamı için hangi kelimelere “bakacağını” öğrenir.

Şekil 5.3’te bir kelime al; o kelimenin cümledeki ötekilere ne kadar “dikkat ettiğini” rengin koyuluğundan gör. Renk ne kadar koyuysa bağ o kadar güçlü.

> **Kenar notu.** “Attention Is All You Need” (2017): dikkat mekanizması, önceki RNN’lerin tek tek/sıralı işleme zorunluluğunu kaldırdı. Eğitimde tüm konumları birlikte işlemek hem hızı hem anlama gücünü bambaşka bir düzeye taşıdı; üretim yine token token ilerler.

**Şekil 5.3 · Hangi kelime hangisine bakıyor?**
![Şekil 5.3](../../figures/out/tr/sekil-5-3-attn.svg)

*Kurulum.* Şekil, “Kedi kaçtı çünkü o korkmuştu.” cümlesinin beş kelimesini bir ısı tablosuna yerleştiriyor. Satırlar bakan kelime (sorgu), sütunlar bakılan kelime. Her hücre bir dikkat ağırlığı; bir satırdaki sayıların toplamı 1.00 eder. Hücre ne kadar koyuysa ağırlık o kadar büyük. Her satırın en koyu hücresi kalın yazılmış. Tablo temsili bir çift yönlü (encoder) öz-dikkat örneği: ağırlıklar elle seçilmiş, her kelime kendinden sonraki kelimelere de bakabiliyor.

*Adım adım.* Ağırlık tablosu:

| Sorgu ↓ · Bakılan → | Kedi | kaçtı | çünkü | o | korkmuştu |
|---|---|---|---|---|---|
| Kedi | **0.50** | 0.30 | 0.05 | 0.10 | 0.05 |
| kaçtı | **0.50** | 0.30 | 0.10 | 0.05 | 0.05 |
| çünkü | 0.20 | **0.40** | 0.20 | 0.10 | 0.10 |
| o | **0.55** | 0.10 | 0.05 | 0.20 | 0.10 |
| korkmuştu | 0.30 | 0.10 | 0.05 | **0.40** | 0.15 |

Satırları tek tek oku:

1. “Kedi”: en yüksek ağırlık kendisinde (0.50). Kendisi dışında en çok “kaçtı”ya bakıyor (0.30); özne, fiilini arıyor.
2. “kaçtı”: ağırlığın yarısı “Kedi”de. Fiil, kimin kaçtığını bilmek istiyor.
3. “çünkü”: en çok “kaçtı”ya bakıyor (0.40). Bağlaç, açıkladığı olaya tutunuyor.
4. “o”: bölümün asıl sorusu burada. En koyu hücre 0.55 ile “Kedi”; kendine ayırdığı pay yalnızca 0.20. Bu temsili tabloda zamir en çok kediye bakıyor; gerçek bir modelde tek bir dikkat ağırlığı, zamirin kimi kastettiğinin çözüldüğünü tek başına kanıtlamaz.
5. “korkmuştu”: en çok “o”ya bakıyor (0.40), ikinci sırada “Kedi” (0.30). Fiil, öznesini iki adımda buluyor: önce zamir, sonra zamirin işaret ettiği kedi.

Tablo simetrik değil: “o” kediye 0.55 ile bakıyor, “Kedi” ise “o”ya yalnız 0.10 ile. Bakış yönlü. Uzaklık da önemsiz: “o” ile “Kedi” arasında iki kelime var; ağırlık yine de tablonun en yükseği. Kelimeleri sırayla işleyen eski modeller burada zorlanıyordu.

Bir ayrım daha: “Kedi” satırı kendinden sonraki “kaçtı”ya 0.30 veriyor. Metin üreten (otoregresif) bir modelde böyle bir bakış yoktur; her kelime yalnız kendinden öncekileri görür, sonrakiler maskelenir. Bu tablo bu yüzden çift yönlü, encoder tipi bir örnektir.

*Ne oluyor?* Bir cümleyi anlamak için her kelime, ötekilerden hangilerine “dikkat etmesi” gerektiğine karar verir. Renk ne kadar koyuysa iki kelime arasındaki bağ o kadar güçlü demektir. Bu temsili örnekte “o”, en çok kediye bakıyor; ağırlıklar elle seçilmiştir ve tek başına zamirin çözüldüğünü kanıtlamaz.

*Kendin dene.* 1) Her satırın toplamını kontrol et; hepsi 1.00 mu? 2) Cümle “Kedi kaçtı çünkü köpek korkmuştu.” olsaydı, “korkmuştu” satırının en koyu hücresi nereye kayardı? Sebebini yaz. 3) “çünkü” sütunundaki ağırlıklar neden bu kadar düşük? Bu düşük ağırlıklardan bağlacın anlam yükü hakkında kesin bir hüküm çıkar mı? Canlı demo: [QR 5.3]

#### Teknik derinlik

Öz-dikkat (self-attention) her token için sorgu (Q), anahtar (K) ve değer (V) vektörleri üretir; ağırlıklar softmax(Q·Kᵀ/√d_k) ile hesaplanır (d_k anahtar vektörünün boyutu) ve çıktı bu ağırlıklarla V’lerin toplamıdır. Maskesiz öz-dikkatte her konum tüm diziye uzaklıktan bağımsız erişebilir; otoregresif (nedensel) decoder ise gelecekteki token’ları maskeler, her konum yalnız kendinden öncekileri görür. Eğitimde dizinin birçok konumu birlikte hesaplanır; otoregresif üretim token’ları sırayla ekler.

Transformer bunu çok-başlı (multi-head) yapar: farklı “başlar” farklı ilişki türlerini (sözdizimi, eş-gönderim, vb.) yakalar. Konumsal kodlama (positional encoding) sıra bilgisini ekler. Maliyet dizi uzunluğunda O(n²)’dir; bağlam penceresi sınırının ana nedeni de budur.

Renk ne kadar koyuysa bağ o kadar güçlü; bu temsili ağırlıklar “o” gibi bir kelimenin kime baktığını gösterir. Dikkat ağırlığı tek başına göndergenin çözüldüğünü kanıtlamaz.

Şekil 5.3’teki her satır bir softmax çıktısıdır: ağırlıklar 0 ile 1 arasında, toplamı 1. “o” konumunun çıktısı bu ağırlıklarla değer vektörlerinin toplamıdır: 0.55·V(Kedi) + 0.10·V(kaçtı) + 0.05·V(çünkü) + 0.20·V(o) + 0.10·V(korkmuştu). “o”nun yeni temsili böylece, yarısından fazlası “Kedi”den gelen bir karışım olur. Tablodaki asimetri de buradan çıkar: her satır kendi sorgusuyla hesaplanır, Q·Kᵀ simetrik bir matris değildir. Tablo çift yönlüdür: “Kedi” satırı kendinden sonraki “kaçtı”ya 0.30 veriyor. Otoregresif bir modelde bu hücre maskelenir (softmax’tan önce −∞ eklenir, ağırlık 0 olur) ve satırın kalan ağırlıkları yeniden 1’e tamamlanır.

Her kelime kime bakacağını biliyor. Bu bakışlardan, henüz yazılmamış bir sonraki kelime nasıl doğar?

### 5.5 Dil modeli: bir sonraki kelimeyi tahmin et

Şu oyunu bilirsin: Biri “Ayağını yorganına göre...” der, sen “uzat!” diye tamamlarsın. Garip gelecek ama bu bölümdeki dil modellerinin işi budur: Metne bakıp en olası bir sonraki kelimeyi (token) tahmin etmek. Tahminini metne ekler, yeniden tahmin eder. Bu minik oyunu binlerce kez oynayarak koca paragraflar yazar.

Şekil 5.4’te modelin her adımda hangi kelimeleri hangi olasılıkla düşündüğüne ve cümleyi nasıl kurduğuna bak. İki seçim kuralını da karşılaştır: hep en olası kelimeyi mi seçsin (açgözlü), yoksa olasılıklara göre zar mı atsın (örnekleme)?

> **Kenar notu.** “Anlıyor mu, yoksa tahmin mi ediyor?” Bir bakıma ikisi de doğru: anlamı bir ölçüde yakalamadan bu kadar tutarlı tahmin yapamazdı. Ama özünde yaptığı şey, bir sonraki token’ı kestirmek.

**Şekil 5.4 · Kelime kelime üret**
![Şekil 5.4](../../figures/out/tr/sekil-5-4-generate.svg)

*Kurulum.* Şekil bir film şeridi: üç kare, üç üretim adımı. Başlangıç metni “Yapay zekâ”. Her karede model dört aday kelime ve her birine verdiği olasılığı gösteriyor; çubuğun uzunluğu olasılıkla orantılı. Şeridin üst sırası “Açgözlü (argmax)”: her adımda en olası aday. Alt sırası “Örnekleme, T = 1.5”: olasılıklar sıcaklıkla yumuşatılıyor ve sabit bir rastgele sayıyla zar atılıyor. İki sıra aynı adaylardan iki farklı cümle kuruyor.

*Adım adım.* Üç adımın aday listeleri:

| Adım | Adaylar ve olasılıklar |
|---|---|
| 1 | çok %42 · artık %28 · bugün %18 · giderek %12 |
| 2 | hızlı %38 · güçlü %30 · yaygın %20 · akıllı %12 |
| 3 | gelişiyor %50 · ilerliyor %25 · yayılıyor %15 · büyüyor %10 |

Açgözlü sırada model her adımda en olası adayı alıyor:

1. “çok” (%42) → “Yapay zekâ çok”
2. “hızlı” (%38) → “Yapay zekâ çok hızlı”
3. “gelişiyor” (%50) → “Yapay zekâ çok hızlı gelişiyor.”

Örnekleme sırası iki iş yapıyor. Önce olasılıkları T = 1.5 sıcaklığıyla yumuşatıyor: büyük paylar küçülüyor, küçükler büyüyor. Sonra 0 ile 1 arasında bir rastgele sayı (U) çekip adayları sırayla topluyor; birikimli toplam U’yu geçtiği anda o aday seçiliyor. Şekil, sonuç her baskıda aynı olsun diye sabit bir U dizisi kullanıyor: 0.37, 0.81, 0.12. Sayılar iki basamağa yuvarlandı.

| Adım | Yumuşatılmış olasılıklar (T = 1.5) | Birikimli toplam | U | Seçilen |
|---|---|---|---|---|
| 1 | çok 0.36 · artık 0.28 · bugün 0.21 · giderek 0.16 | 0.36 · 0.64 · 0.84 · 1.00 | 0.37 | artık |
| 2 | hızlı 0.34 · güçlü 0.29 · yaygın 0.22 · akıllı 0.16 | 0.34 · 0.63 · 0.85 · 1.00 | 0.81 | yaygın |
| 3 | gelişiyor 0.41 · ilerliyor 0.26 · yayılıyor 0.19 · büyüyor 0.14 | 0.41 · 0.67 · 0.86 · 1.00 | 0.12 | gelişiyor |

1. “artık” (U = 0.37) → “Yapay zekâ artık”: “çok”un payı 0.36’ya inmiş; 0.37 bu eşiği kıl payı geçiyor ve seçim ikinci adaya düşüyor.
2. “yaygın” (U = 0.81) → “Yapay zekâ artık yaygın”: ilk iki aday birlikte 0.63’e geliyor; 0.81 üçüncü adayın dilimine düşüyor.
3. “gelişiyor” (U = 0.12) → “Yapay zekâ artık yaygın gelişiyor.”: küçük bir U en olası adayı seçiyor. Örnekleme de çoğu zaman en olasıyı seçer, yalnız her zaman değil.

İki cümle de dilbilgisi olarak düzgün; ikincisi daha az beklenen bir yoldan gidiyor. Açgözlü seçimde zar yok; sonuç her seferinde aynı. Örneklemede zar var: U dizisi değişse cümle de değişir, aynı başlangıçla her seferinde farklı bir cümle çıkabilir. Sıcaklık zarın yüzlerini ayarlar: T yükseldikçe paylar birbirine yaklaşır, T düştükçe en olası aday büyür. Ama T sıfırdan büyük olduğu sürece zar atılır; düşük sıcaklık, açgözlü seçimle aynı şey değildir.

Her adımın olasılıkları dört adaya dağılmış ve toplamı yüzde yüz. Gerçekte model bu dağılımı on binlerce token üzerinde kurar; dört aday, listenin yalnız tepesidir. Her seçim bir sonraki adımın sorusunu değiştirir: “çok”tan sonra “hızlı” olası, “artık”tan sonra da olası; ama gerçek bir modelde ikinci adımın listesi birinci adımın seçimine göre yeniden hesaplanır.

*Ne oluyor?* Model her adımda “şimdiye kadarki metinden sonra en olası kelime ne?” diye düşünür, birini seçip cümleye ekler ve baştan sorar. Açgözlü seçim hep en olası kelimeyi alır; kararlı ama tahmin edilebilir olur. Örneklemede model olasılıklara göre zar atar. “Yaratıcılık” (sıcaklık) yükseldikçe zar daha dengeli olur ve seçimler çeşitlenir; düştükçe en olası kelime öne çıkar ama zar yine atılır.

*Kendin dene.* 1) Örnekleme sırasında ikinci U sayısı 0.81 yerine 0.50 olsaydı ikinci adımda hangi aday seçilirdi? Cümle ne olurdu? 2) Açgözlü cümlenin olasılık çarpımını hesapla: 0.42 × 0.38 × 0.50. Aynı hesabı örnekleme cümlesi için modelin özgün olasılıklarıyla yap (artık %28, yaygın %20, gelişiyor %50); hangisi kaç kat daha olası? 3) Üç adımdan hangisinde model en “kararsız”? En olası adayın payına bak. Canlı demo: [QR 5.4]

#### Teknik derinlik

Burada otoregresif üretici dil modellerini inceliyoruz; bugünün sohbet modellerinin çoğu bu sınıftadır, ama her dil modeli otoregresif değildir. Model, bir sonraki token için sözlükteki her adaya bir skor (logit) üretir; softmax bu skorları toplamı 1 olan bir olasılık dağılımına, P(tokenₜ | token₁…tokenₜ₋₁), çevirir ve bir token seçilip diziye eklenir. Açgözlü seçim (greedy, argmax) en olasıyı alır; örnekleme (sampling) dağılımdan rastgele çeker.

Sıcaklık (temperature) dağılımı keskinleştirir/yumuşatır: düşük sıcaklık daha kararlı/tekrarlı, yüksek sıcaklık daha çeşitli/riskli çıktı verir (top-k / top-p ile birlikte). T sıfırdan büyük olduğu sürece örnekleme rastlantısaldır; açgözlü (argmax) seçim ayrı bir kuraldır, düşük sıcaklıklı örnekleme değildir. Şekil 5.4’teki olasılıklar örnek değerlerdir; gerçek model sözlüğün tamamı üzerinde bir dağılım üretir.

Açgözlü seçim (argmax) her adımda en olasıyı alır; örnekleme softmax(z/T) dağılımından rastgele çeker. T pozitifken örnekleme rastlantısaldır: düşük T dağılımı sivriltir, yüksek T düzleştirir.

Sıcaklık T, softmax’tan önce model skorlarını (logit) böler: pᵢ = exp(zᵢ/T) / Σⱼ exp(zⱼ/T). T küçüldükçe dağılım tek adaya sıkışır ve örnekleme argmax’a yaklaşır, ama T > 0 olduğu sürece rastlantısal kalır; argmax ayrı bir seçim kuralıdır. T büyüdükçe dağılım düzleşir, yüzde 12’lik “giderek” bile makul bir şans kazanır. Şekil 5.4’ün örnekleme sırası bu dönüşümü T = 1.5 ile uygular: aday olasılıklarından z = ln p alınır, softmax(z/1.5) hesaplanır ve sabit bir U dizisiyle (0.37, 0.81, 0.12) ters birikimli dağılımdan seçim yapılır; birinci adımda “çok”un payı 0.42’den 0.36’ya iner, “giderek”inki 0.12’den 0.16’ya çıkar. Bir cümlenin olasılığı adımların çarpımıdır: P(çok, hızlı, gelişiyor) = 0.42 × 0.38 × 0.50 ≈ 0.08.

Model her adımda olasılık dağıtmayı biliyor. Bu olasılıkları nereden öğrendi? Çoğu zaman üç aşamalı bir eğitimden.

### 5.6 Bir model nasıl yetişir: eğitim hattı

Bir sohbet asistanı da çocuk gibi yetişir; yaygın bir yol üç okuldan geçer. Önce devasa metinlerle “ön eğitim” görür: Dili ve dünyayı orada öğrenir. Sonra “ince ayar” okulunda soruya cevap vermeyi, talimata uymayı öğrenir. En son “insan geri bildirimiyle hizalama” gelir: Orada da yardımcı, dürüst ve güvenli olmayı, yani görgüyü öğrenir.

Şekil 5.5’teki üç aşamaya tek tek bak ve aynı soruya modelin her aşamadan sonra nasıl farklı cevap verdiğini gör.

> **Kenar notu.** Kabaca: ön eğitim modele “ne bildiğini”, ince ayar ve hizalama “nasıl davranacağını” kazandırır; ince ayar bilgiyi ve görev başarımını da değiştirebilir. Aynı bilgi, çok farklı tonlarda sunulabilir.

**Şekil 5.5 · Üç aşamada bir asistan**
![Şekil 5.5](../../figures/out/tr/sekil-5-5-train.svg)

*Kurulum.* Şekil üç sütunlu bir tablo; her sütun bir eğitim aşaması. Her aşama için dört satır var: modelin gördüğü veri, öğrendiği şey, aynı başkent sorusuna verdiği örnek cevap ve kısa bir not. Soru üç sütunda da aynı; değişen yalnız cevabın biçimi.

*Adım adım.* Üç aşamayı yan yana koy:

| | 1 · Ön eğitim | 2 · İnce ayar | 3 · RLHF / hizalama |
|---|---|---|---|
| Veri | Devasa internet metni | Talimat–cevap çiftleri | İnsan tercihleri (tercih çiftleri) |
| Öğrendiği | Dili ve dünyayı (bir sonraki kelimeyi tahmin) | Yönergeyi izlemeyi (soruyu cevaplamayı) | Yardımcı, dürüst ve güvenli olmayı |
| Örnek çıktı | “Türkiye’nin başkenti Ankara’dır ve nüfusu yaklaşık altı milyondur. Bu şehir...” | “Türkiye’nin başkenti Ankara’dır.” | “Türkiye’nin başkenti Ankara’dır. İstersen şehir hakkında birkaç ilginç bilgi de paylaşabilirim.” |
| Not | Ham model “tamamlayıcı”dır: soruyu cevaplamaz, metni sürdürür. | Artık soruyu doğrudan, derli toplu cevaplıyor. | Aynı bilgi; ama daha yardımcı, kibar ve hizalı bir tonla. |

1. Ön eğitim: cevap doğru bilgiyle başlıyor ama durmuyor. Nüfus ekliyor, “Bu şehir...” diye sürüyor. Model kendisine soru sorulduğunu bilmiyor; internetteki bir ansiklopedi sayfasını sürdürür gibi yazıyor. Bilgi var, görgü yok.
2. İnce ayar: aynı bilgi, tek cümle. Model artık “soru geldi, cevap ver, dur” kalıbını binlerce talimat–cevap çiftinden öğrenmiş.
3. RLHF / hizalama: cevap yine aynı, üstüne bir teklif: daha fazla bilgi ister misin? İnsanlara iki cevap gösterilip “hangisi daha iyi?” diye sorulmuş; model tercih edilen tona doğru ayarlanmış.

Bu üç örnekte değişmeyen tek şey bilgi: Ankara. Değişen, aynı bilginin yanıt biçimi; gerçek ince ayar bilgiyi ve görev başarımını da değiştirebilir. Sıra yaygın bir reçete, zorunlu bir kural değil: kimi modeller aşamaları birleştirir ya da atlar. Üçüncü aşama da tek yoldan gitmez: PPO tabanlı RLHF ayrı bir ödül modeli kullanır, DPO tercih çiftleriyle doğrudan ayar yapar.

*Ne oluyor?* Bir asistan yaygın bir yolda üç aşamada yetişir. Önce devasa metinlerle “ön eğitim”de dili ve dünyayı öğrenir. Sonra “ince ayar”da örnek soru–cevaplarla talimat izlemeyi öğrenir. En sonda insan tercihleriyle “hizalanır”: yardımcı, dürüst ve güvenli bir tonda cevap vermeyi öğrenir. Aynı bilgi, her aşamada daha kullanışlı sunulur; tüm modeller aynı aşamalardan geçmez.

*Kendin dene.* 1) Soru “Su kaç derecede kaynar?” olsaydı, birinci aşama modelinin çıktısını bir cümleyle tahmin et; ikinci aşamanınkini de yaz. 2) Üçüncü aşamada insanlara “yanlış ama kibar” ile “doğru ama kaba” iki cevap gösterilse hangisi tercih edilmeli? Hizalamanın üç hedefi (yardımcı, dürüst, güvenli) buna nasıl karar verir? 3) Tablodaki hangi satır bilginin aynı kalıp yanıt biçiminin değiştiğini en açık gösteriyor? Bu üç örnekten ince ayarın bilgiyi değiştiremeyeceği sonucu çıkar mı? Canlı demo: [QR 5.5]

#### Teknik derinlik

1) Ön eğitim (pretraining): büyük derlem üzerinde öz-denetimli bir sonraki-token hedefiyle dilin istatistiğini öğrenir. 2) Denetimli ince ayar (SFT): talimat–cevap çiftleriyle yönergeyi izlemeyi öğrenir. 3) Tercih hizalaması: PPO tabanlı RLHF insan tercihleriyle ayrı bir ödül modeli eğitir ve politikayı bu sinyale göre günceller; DPO ise tercih çiftlerinden doğrudan bir politika kaybı kurar, ayrı ödül modeli gerektirmez. Bu üç aşama yaygın bir akıştır; tüm modeller aynı aşamalardan aynı sırayla geçmez.

Sonuç: ham “metin tamamlayıcı”dan yardımcı, dürüst ve görece güvenli bir asistana geçiş. Hizalama mükemmel değildir; jailbreak, ödül oyunlama (reward hacking) ve dağıtım kayması gibi açık sorunlar sürer.

Yaygın sıra: öz-denetimli ön eğitim → denetimli ince ayar (SFT) → tercih hizalaması (RLHF ya da DPO). Bu sıra sabit bir reçete değildir.

Üç aşamanın hedefleri birbirinden farklıdır. Ön eğitimde kayıp, bir sonraki token’ın olasılığına dayanır: L = −Σₜ log P(tokenₜ | token₁…tokenₜ₋₁). Şekil 5.5’teki birinci sütun bu hedefin doğal çıktısıdır; metni sürdürmek bu kaybı düşüren davranıştır. SFT aynı kaybı, yalnız cevap kısmında ve seçilmiş çiftlerde uygular. Hizalama aşamasında hedef insan tercihidir. PPO tabanlı RLHF’de bir ödül modeli iki cevaptan hangisinin tercih edildiğini kestirir ve politika bu kestirimi yükseltecek yönde güncellenir. DPO’da ayrı ödül modeli yoktur: tercih edilen cevabın olasılığını reddedilene göre yükselten bir kayıp doğrudan politikaya uygulanır.

Metin üreten modelin yetişme yolu böyle. Görsel üreten modeller ise saf gürültüden yola çıkar.

### 5.7 Görsel üretimi: difüzyon

Bugünün görsel üreten modellerinin çoğu bambaşka bir fikre dayanır: difüzyon; GAN gibi başka yollar da var. Buğulu bir cam düşün; arkasındaki resim seçilmiyor. Şimdi camı yavaş yavaş sil: Resim adım adım beliriyor. Difüzyon modeli bu silme işini öğrenir; yalnız o, işe tamamen karıncalı bir ekranla (saf gürültüyle) başlar ve her adımda biraz temizleyerek görüntüyü ortaya çıkarır.

Şekil 5.6’daki kareleri soldan sağa izle: sağa gittikçe model gürültüyü temizliyor ve görsel yavaş yavaş beliriyor.

> **Kenar notu.** Difüzyon “heykeltıraş” gibi çalışır: önünde bir mermer (gürültü) bloğu vardır, fazlalığı adım adım yontarak şekli ortaya çıkarır. GAN’lara göre daha kararlı eğitilir.

**Şekil 5.6 · Gürültüden görsele**
![Şekil 5.6](../../figures/out/tr/sekil-5-6-diffuse.svg)

*Kurulum.* Şekil dokuz kareden oluşan bir film şeridi. Her kare 8 × 8, 64 pikselden oluşan minik bir tuval. Soldaki ilk kare tamamen gürültü: koyu ve açık gri pikseller rastgele dağılmış. Sağdaki son karede 40 turuncu pikselden oluşan bir kalp var, kalan 24 piksel açık renk. Aradaki yedi karede model her adımda birkaç piksel daha “çözüyor”. Her karenin altında iki sayı var: şeritteki ilerleme (adım/8, yüzde olarak) ve çözülen piksel sayısı (ör. 6/64). İkisi farklı nicelikler; yüzde 13 ilerleme, 64 pikselin 6’sının (yüzde 9) çözülmesiyle aynı şey değil. Şeridin üst kenarında “ters süreç (üretim): gürültüden şekle”, alt kenarında “ileri süreç (eğitim): şekle gürültü ekleme” yazar.

*Adım adım.* Her kare bir adım:

| Adım | İlerleme (adım/8) | Çözülen piksel (64’te) | Görünen kalp pikseli | Karede görünen |
|---|---|---|---|---|
| 0 | %0 | 0 | 0 | Yalnız gürültü; karıncalı bir ekran |
| 1 | %13 | 6 | 4 | Birkaç turuncu nokta, henüz şekilsiz |
| 2 | %25 | 12 | 9 | Dağınık noktalar |
| 3 | %38 | 21 | 12 | Gövde seçilmeye başlıyor |
| 4 | %50 | 29 | 17 | Kalp tahmin edilebilir |
| 5 | %63 | 40 | 24 | Şekil kesin, kenarlar pürüzlü |
| 6 | %75 | 46 | 29 | Az sayıda gürültü lekesi |
| 7 | %88 | 55 | 36 | Son lekeler |
| 8 | %100 | 64 | 40 | Temiz kalp: 40 turuncu, 24 açık piksel |

Üç kareyi yan yana koy: sıfırıncıda yalnız karıncalı ekran var; dördüncüde gürültünün yarısı gitmiş, şekil belirmeye başlamış; sekizincide gürültü tamamen temizlenmiş, kalp ortada. Difüzyon böyle çalışır: gürültüden şekle.

Çözülen piksel sayısı her adımda eşit artmıyor: 6, 12, 21, 29, 40... Hangi pikselin hangi adımda açılacağı sabit bir rastgele tohumla belirleniyor; şerit her seferinde aynı, ama adımlar eşit değil. Şekil de yarı yolda tanınıyor: adım 4’te, şeridin yarısında, 64 pikselin 29’u çözülmüşken kalbin ne olduğu belli; kalan adımlar ayrıntıyı tamamlıyor.

Gerçek bir difüzyon modeli piksel açmaz ve saklı bir resmi ortaya çıkarmaz. Her adımda görüntünün tamamındaki gürültüyü biraz azaltır; bütün pikseller aynı anda, yavaş yavaş netleşir ve öğrenilmiş dönüşümlerle yeni bir örnek çıkar. Adım sayısı da 8 değil, onlarca ya da yüzlercedir. Bu şerit sabit bir desenle fikri anlatır: gürültü azalır, şekil belirir.

*Ne oluyor?* Difüzyon, karlı bir TV ekranını (saf gürültü) adım adım temizleyip içinden bir görsel çıkarmaya benzer. Model “bu gürültünün altında ne olabilir?” diye tahmin ederek her adımda biraz daha netleştirir. Karelerde sağa gittikçe gürültü azalır ve şekil (bir kalp) belirir; bu şerit geçişi sabit bir desenle canlandırır, gerçek model saklı bir resmi açmaz, yeni bir örnek üretir.

*Kendin dene.* 1) Son karede 64 pikselin 40’ı turuncu. Adım 4’te 29 piksel çözülmüşse ve pikseller rastgele açılıyorsa, bunların yaklaşık kaçının turuncu olmasını beklersin? 2) Adım sayısı 8 yerine 16 olsaydı, her adımdaki ilerleme payı yüzde kaç olurdu? 3) Teknik metindeki “ileri süreç” şeridin hangi yönünde okunur, “ters süreç” hangi yönünde? Canlı demo: [QR 5.6]

#### Teknik derinlik

Difüzyon iki süreçten oluşur. İleri süreç: bir görsele kademeli Gauss gürültüsü eklenir (sabit, öğrenmesiz). Ters süreç: bir sinir ağı her adımda eklenen gürültüyü kestirip çıkararak örneği temizler (denoising); böylece gürültüden veri dağılımına ulaşılır.

Metinden-görsele üretimde, üretim bir metin gömüsüyle koşullandırılır (genelde CLIP benzeri) ve hız için latent uzayda yapılır (latent diffusion). Şekil 5.6 yalnız fikri anlatır; gerçek modeller öğrenilmiş bir gürültü-kestirim ağı kullanır.

Eğitimde ileri süreç, üretimde ters süreç çalışır; ağ yalnız ters süreci öğrenir.

İleri süreçte tek adım: xₜ = √(1 − βₜ)·xₜ₋₁ + √βₜ·εₜ; εₜ o adımın standart Gauss gürültüsü, βₜ küçük bir gürültü payıdır. Adımlar birleştirilince xₜ doğrudan x₀’dan örneklenir: xₜ = √ᾱₜ·x₀ + √(1 − ᾱₜ)·ε, ε ~ N(0, I); burada ᾱₜ = (1 − β₁)(1 − β₂)…(1 − βₜ) ve ε, t adıma kadar birikmiş gürültünün toplu örneğidir, tek bir adımın gürültüsü değil. Ağ, xₜ ve t verildiğinde bu toplu ε’yi kestirmeyi öğrenir; eğitim kaybı ‖ε − ε_θ(xₜ, t)‖² ve kayıptaki ε, yukarıdaki toplu gürültünün ta kendisidir. Üretimde ters yönde gidilir: x_T saf gürültüden başlanır, her adımda kestirilen gürültünün bir payı çıkarılır, x₀’a ulaşılır. Şekil 5.6’daki “çözülen piksel” sayacı bu hesabın karşılığı değil, yalnız görsel bir benzetmedir; karelerin yüzdesi şeridin ilerlemesini gösterir, temizlenen gürültü payını değil.

Metin de görsel de üretilebiliyor. Şimdi sınırlar: bu modeller nerede yanılır, nerede tıkanır?

### 5.8 Sınırlar: halüsinasyon, bağlam ve maliyet

Bu modeller etkileyici ama kusursuz değil. En ünlü kusurları halüsinasyon: Model, hiç bozuntuya vermeden, kulağa doğru gelen ama yanlış bir bilgi anlatabilir. Akıcı ya da yüksek olasılıklı bir cevap, doğru olduğunun garantisi değildir; yanlış bilgi zar atılmadan da üretilebilir. Bir diğer sınır da bağlam penceresi: Modelin elinde küçük bir not defteri vardır; aynı anda ancak o kadar token tutar. Defter dolunca ne olacağını kullanılan sistem belirler: hata verir, metni kırpar ya da özetler.

Bağlam penceresini aşağıda kendin dene: bu gösterim son sekiz kelimeyi tutan temsili bir kayan penceredir. Kelime ekledikçe pencere dolar ve en eski kelimeler dışarı düşer. Gerçek uygulamalar sınıra gelince hata verebilir, metni kırpabilir ya da özetleyebilir.

> **Kenar notu.** Altın kural: bir LLM’i “her şeyi bilen kâhin” değil, “çok akıcı ama bazen yanılan bir stajyer” gibi düşün. Önemli bilgileri her zaman doğrula.

**Şekil 5.7 · Bağlam penceresi**
![Şekil 5.7](../../figures/out/tr/sekil-5-7-ctx.svg)

*Kurulum.* Şekil, on iki kelimelik bir cümlenin sekiz kelimelik bir pencereden geçişini gösteriyor: “Yapay zekâ modelleri metni sınırlı bir pencerede tutar ve eskiyi zamanla unutur.” Pencere en fazla 8 kelime tutuyor; bu kayan pencere şekle özgü bir kural, gerçek sınır token’la ölçülür. Şeritteki yedi kare, cümlenin 0, 1, 4, 8, 9, 10 ve 12 kelimelik hâlleri; turuncu çizgi modelin gördüğü pencereyi, son sekiz kelimeyi çevreler. Koyu çerçeveli kelimeler pencerede; soluk olanlar pencereden düşmüş, unutulmuş.

*Adım adım.* Kelimeler tek tek geliyor:

| Eklenen kelime | Pencerede olanlar | Unutulanlar |
|---|---|---|
| 0 | (boş) | |
| 1 | Yapay | |
| 4 | Yapay zekâ modelleri metni | |
| 8 | Yapay zekâ modelleri metni sınırlı bir pencerede tutar | (pencere tam doldu) |
| 9 | zekâ modelleri metni sınırlı bir pencerede tutar ve | Yapay |
| 10 | modelleri metni sınırlı bir pencerede tutar ve eskiyi | Yapay zekâ |
| 12 | sınırlı bir pencerede tutar ve eskiyi zamanla unutur | Yapay zekâ modelleri metni |

1. Sıfırdan sekize: pencere boş başlıyor. Her yeni kelime yerini buluyor; sekizinci kelimede pencere tam doluyor, hepsi içeride. Pencere dolana kadar her şey hatırlanıyor.
2. Dokuzuncu kelime: pencere dolu; “ve” girince “Yapay” dışarı düşüyor ve soluyor. Model artık yalnız son sekiz kelimeyi görüyor.
3. On ikinci kelime: ilk dört kelime gitmiş. Modelin gördüğü metin “sınırlı bir pencerede tutar ve eskiyi zamanla unutur”. Cümlenin öznesi, “Yapay zekâ modelleri”, artık pencerede yok. Model neyi unuttuğunu bilmiyor; cümle kendi kaderini anlatıyor.

Gerçek ölçek çok daha büyük: bu pencere 8 kelime; gerçek modellerde binlerce, bazılarında milyonlarca token. Fikir aynı: sınır var. Dolunca ne olacağına ise uygulama karar verir; kimi sistem hata verir, kimi en eskiyi kırpar, kimi özetler. Uzun bir sohbette asistanın en başta söylediklerini unutması çoğu zaman bu yüzden. Pencerede olmak da tam hatırlama garantisi değil; uzun bir bağlamın ortasındaki bilgi gözden kaçabilir. Halüsinasyonla bağı da burada: eksik bilginin yerine model akıcı bir devam üretebilir. Boşluk dolar, ama doğru bilgiyle dolduğunun garantisi yoktur.

*Ne oluyor?* Modelin bir “kısa süreli hafızası” var ve aynı anda yalnızca belli sayıda token tutabilir. Bu gösterimde yeni kelime ekledikçe pencere dolar; sınırı aşınca en eski kelimeler dışarı düşer, yani “unutulur”. Gerçek sistemler sınıra gelince hata verebilir, metni kırpabilir ya da özetleyebilir; çok uzun belgelerin kırpılması ya da özetlenmesi bu yüzden.

*Kendin dene.* 1) Pencere 8 yerine 5 kelime olsaydı, 12. kelime eklendiğinde kaç kelime unutulmuş olurdu? Pencerede kalanları yaz. 2) Şekil 5.1’deki bölücüyle bu on iki kelimelik cümle kaç token eder? Pencere kelime yerine token sayıyor olsaydı kaçıncı kelimede dolardı? 3) Yirmi sayfalık bir belgeyi bu penceredeki modele vermek istesen, bölümdeki üç seçenekten (hata verme, kırpma, özetleme) hangisini seçerdin, neden? Canlı demo: [QR 5.7]

#### Teknik derinlik

Halüsinasyonun tek bir nedeni yoktur: eğitim hedefi (olası devamı üretmek) ile ifadenin doğruluğu arasında garanti bulunmaz. Akıcı ya da yüksek olasılıklı bir yanıt yanlış olabilir; bu, rastgele örnekleme olmadan, açgözlü çözümlemede de olur. Azaltma yolları: kaynaklarla temellendirme (RAG), araç/doğrulama kullanımı ve daha iyi hizalama (Bölüm 6’da); önemli iddialar kaynakla ve görev doğrulamasıyla denetlenir. Bağlam penceresi sabit bir token sınırıdır; dikkat maliyeti O(n²) olduğundan pencereyi büyütmek pahalıdır.

Diğer sınırlar: bilgi kesim tarihi (knowledge cutoff), önyargı (eğitim verisinden miras), kararsızlık/yeniden üretilemezlik (örnekleme), ve hesaplama/enerji maliyeti. Bu sınırları bilmek, bu araçları sorumlu ve etkili kullanmanın ön koşuludur.

Bu gösterim son N token’ı tutan bir kayan penceredir; gerçek bir uygulama sınıra gelince hata verebilir, metni kırpabilir ya da özetleyebilir.

Şekil 5.7’deki pencere kayan bir kuyruktur: n kelime eklendiğinde unutulan sayısı max(0, n − N), N = 8. Gerçek modellerde birim kelime değil token’dır; Şekil 5.1’deki kuralla aynı cümle 19 token eder; pencere kelime saymaya göre yaklaşık 1.6 kat hızlı dolar: kelime sayarken 8., token sayarken 5. kelimede. O(n²) maliyetinin kaynağı Şekil 5.3’teki ısı tablosu: n token için n × n hücre; pencere 8’den 16’ya çıkınca hücre sayısı 64’ten 256’ya, dört katına çıkar. Bu kuyruk şekle özgüdür; gerçek uygulamada taşma politikası (hata, kırpma, özetleme) sistemin seçimidir.

Token, gömü, dikkat, üretim, eğitim, difüzyon, sınırlar: bölüm bu kadar. Ne kaldığına bak.

### 5.9 Kendini test et

*Cevaplar kitabın sonunda.*

1. Token nedir?
   a) Bir tür sinir ağı
   b) Modelin ağırlığı
   c) Bir GPU çekirdeği
   d) Metnin model tarafından işlenen küçük parçası

2. Gömü (embedding) uzayında ne doğrudur?
   a) Kelimeler rastgele dağılır
   b) Yalnızca sayılar saklanır, anlam yoktur
   c) Anlamca benzer kelimeler birbirine yakın olur
   d) Her kelime aynı noktadadır

3. Dikkat (attention) mekanizması ne sağlar?
   a) Görüntüleri büyütmek
   b) Modeli yavaşlatmak
   c) Her kelimenin diğer kelimelere ağırlıklı “bakması”
   d) Veriyi silmek

4. Bu bölümdeki otoregresif bir LLM özünde ne yapar?
   a) Bir sonraki token’ı tahmin eder
   b) Kuralları elle uygular
   c) Veritabanı sorgular
   d) İnterneti arar

5. Bölümde anlatılan yaygın eğitim hattının sırası?
   a) Ön eğitim → ince ayar → RLHF
   b) Yalnızca ön eğitim
   c) İnce ayar → ön eğitim → RLHF
   d) RLHF → ön eğitim → ince ayar

6. Difüzyon modeli görseli nasıl üretir?
   a) Pikselleri rastgele bırakarak
   b) İnternetten indirerek
   c) Tek seferde kopyalayarak
   d) Gürültüden başlayıp adım adım temizleyerek

7. Halüsinasyon nedir?
   a) Modelin emin tonda yanlış bilgi üretmesi
   b) Görüntü üretmesi
   c) Modelin çökmesi
   d) Daha hızlı çalışması

8. Bağlam penceresi neyi sınırlar?
   a) Modelin aynı anda dikkate aldığı token sayısını
   b) Disk boyutunu
   c) Ekran çözünürlüğünü
   d) İnternet hızını

### Bu bölümden kalanlar

- Bir dil modeli metni harf ya da kelime olarak değil, token denen küçük parçalar olarak okur; uzun ve nadir kelimeler daha çok token tutar.
- Gömü, her token’ı bir haritadaki adrese çevirir; anlamca yakın kelimeler o haritada da yan yana durur.
- Dikkat mekanizmasıyla her kelime, cümledeki ötekilere ağırlık dağıtır; bu örnekte “o” zamiri en çok kediye bakar.
- Bir dil modeli her adımda bir sonraki token’ı tahmin eder; açgözlü seçim hep en olasıyı alır, örnekleme olasılıklara göre zar atar; sıcaklık zarın ne kadar dengeli olduğunu belirler.
- Asistan yaygın bir yolda üç aşamada yetişir: ön eğitim bilgiyi, ince ayar talimat izlemeyi, hizalama yardımcı ve güvenli tonu verir.
- Difüzyon modeli saf gürültüden başlar ve her adımda biraz temizleyerek görseli ortaya çıkarır.
- Halüsinasyon ve bağlam penceresi bu modellerin yapısal sınırlarıdır; önemli bilgiyi her zaman doğrula.

<!-- SOURCE-CHANGES
Bütün bunları mümkün kılan tek bir buluş var: Transformer mimarisi ve onun kalbindeki “dikkat” (attention) fikri. Hikâyeye en küçük parçadan başlıyoruz: bir cümle makineye nasıl görünür? Cevap, “token” denen küçük metin parçalarında. Oradan kelimelerin anlamını sayıya çeviren gömülere, dikkat mekanizmasına ve bir dil modelinin kelime kelime nasıl yazdığına geçeceğiz. Modelin nasıl eğitildiğini görecek, görsel üreten difüzyon modellerine de uğrayacağız. Sonunda bu sistemlerin sınırlarını konuşacağız. ||| Bütün bunları mümkün kılan tek bir buluş var: Transformer mimarisi ve onun kalbindeki dikkat (attention) fikri. Hikâyeye en küçük parçadan başlıyoruz: bir cümle makineye nasıl görünür? Token denen küçük metin parçaları olarak. Önce token, sonra gömü, dikkat ve kelime kelime üretim; ardından eğitim, difüzyon ve sınırlar.
Bu bölüm üretken yığını uçtan uca kurar: tokenleştirme → gömü uzayı → öz-dikkat (self-attention) → otoregresif üretim → eğitim hattı (ön eğitim, ince ayar, RLHF) → difüzyon tabanlı görüntü üretimi → ve pratik sınırlar (halüsinasyon, bağlam penceresi, maliyet). Böylece bugünün LLM ve üretken modellerinin “neden ve nasıl” çalıştığı, sezgisel ama doğru bir çerçevede kurulmuş olur. ||| Bu bölüm üretken yığını uçtan uca kurar: tokenleştirme → gömü uzayı → öz-dikkat (self-attention) → otoregresif üretim → eğitim hattı (ön eğitim, ince ayar, RLHF) → difüzyon tabanlı görüntü üretimi → ve pratik sınırlar (halüsinasyon, bağlam penceresi, maliyet). Böylece bugünün LLM ve üretken modellerinin neden ve nasıl çalıştığı yerine oturur.
Peki neden parçalıyor? Lego kutusunu düşün: Sınırlı sayıda parçayla sonsuz şey kurulur. Dünyadaki bütün kelimeleri ezberlemek imkânsızdır; ama sınırlı bir parça takımıyla her kelime kurulabilir. Aşağıdan bir örnek seç, makinenin cümleyi parçalara ayırışını izle. ||| Neden parçalıyor? Lego kutusunu düşün: sınırlı sayıda parçayla sonsuz şey kurulur. Dünyadaki bütün kelimeleri ezberlemek imkânsızdır; ama sınırlı bir parça takımıyla her kelime kurulabilir. Aşağıdan bir örnek seç, makinenin cümleyi parçalara ayırışını izle.
Kabaca İngilizcede 1 token ≈ 0.75 kelime; Türkçe gibi eklemeli dillerde kelime başına daha çok token düşebilir. Model bağlamı ve maliyeti token cinsinden ölçülür: hem bağlam penceresi hem ücretlendirme token sayısına bağlıdır. Şekil 5.1’deki gösterim basitleştirilmiş bir alt-kelime bölücüdür (uzun kelimeleri “##” ile parçalara ayırır). ||| Kabaca İngilizcede 1 token ≈ 0.75 kelime; Türkçe gibi eklemeli dillerde kelime başına daha çok token düşebilir. Model bağlamı ve maliyeti token cinsinden ölçülür: hem bağlam penceresi hem ücretlendirme token sayısına bağlıdır. Şekil 5.1 basitleştirilmiş bir alt-kelime bölücü kullanır (uzun kelimeleri “##” ile parçalara ayırır).
Kısa kelimeler tek token kalır; uzun kelimeler “##” ile parçalara ayrılır, noktalama ise ayrı bir token sayılır. Modern modeller alt-kelime (BPE/WordPiece) tokenleştirme kullanır; bağlam penceresi ve maliyet token cinsinden ölçülür. ||| Kısa kelimeler tek token kalır; uzun kelimeler “##” ile parçalara ayrılır, noktalama ise ayrı bir token sayılır.
Bu şehrin güzelliği şurada: Anlamca benzeşen kelimeler aynı mahalleye taşınır. “Kedi” ile “köpek” kapı komşusudur; “kral” ile “kraliçe” de öyle. Şekil 5.2’de bir kelime seç, komşularını gör. ||| Bu şehirde anlamca benzeşen kelimeler aynı mahalleye taşınır. “Kedi” ile “köpek” kapı komşusudur; “kral” ile “kraliçe” de öyle. Şekil 5.2’de bir kelime seç, komşularını gör.
Gömü her token’ı yoğun bir vektöre (uzayda bir konuma) eşler; anlamca benzer kelimeler birbirine yakın düşer. En kısa mesafedeki 2 nokta = anlamca en benzer 2 kelime. Yakınlık = benzer anlam; benzerlik genelde kosinüs benzerliğiyle ölçülür. ||| En kısa mesafedeki 2 nokta = anlamca en benzer 2 kelime. Yakınlık = benzer anlam.
Şu cümleyi oku: “Kedi kaçtı çünkü o korkmuştu.” Buradaki “o” kim? Sen farkında bile olmadan dönüp “kedi”ye baktın. Dikkat (attention) mekanizması, makineye işte bu dönüp bakmayı öğretir: Her kelime, anlamı için hangi kelimelere “bakacağını” öğrenir. ||| Şu cümleyi oku: “Kedi kaçtı çünkü o korkmuştu.” Buradaki “o” kim? Sen farkında bile olmadan dönüp “kedi”ye baktın. Dikkat (attention) mekanizması, makineye bu dönüp bakmayı öğretir: Her kelime, anlamı için hangi kelimelere “bakacağını” öğrenir.
Öz-dikkat her token için sorgu (Q), anahtar (K) ve değer (V) üretir; ağırlıklar softmax(Q·Kᵀ/√d) ile hesaplanır. Renk ne kadar koyuysa bağ o kadar güçlü. Böylece “o” gibi bir kelimenin neyi kastettiği çözülür. ||| Renk ne kadar koyuysa bağ o kadar güçlü; böylece “o” gibi bir kelimenin neyi kastettiği çözülür.
Şekil 5.4’ün adımlarını izle; modelin her adımda hangi kelimeleri hangi olasılıkla düşündüğünü ve cümleyi nasıl kurduğunu izle. İki “yaratıcılık” (sıcaklık) sırasını da dene: hep en olası kelimeyi mi seçsin, yoksa biraz risk mi alsın? ||| Şekil 5.4’te modelin her adımda hangi kelimeleri hangi olasılıkla düşündüğüne ve cümleyi nasıl kurduğuna bak. İki “yaratıcılık” (sıcaklık) sırasını da karşılaştır: hep en olası kelimeyi mi seçsin, yoksa biraz risk mi alsın?
“Anlıyor mu, yoksa tahmin mi ediyor?” Bir bakıma ikisi de doğru: anlamı bir ölçüde yakalamadan bu kadar tutarlı tahmin yapamazdı. Ama özünde yaptığı şey, bir sonraki token’ı kestirmekten ibaret. ||| “Anlıyor mu, yoksa tahmin mi ediyor?” Bir bakıma ikisi de doğru: anlamı bir ölçüde yakalamadan bu kadar tutarlı tahmin yapamazdı. Ama özünde yaptığı şey, bir sonraki token’ı kestirmek.
Sıcaklık (temperature) dağılımı keskinleştirir/yumuşatır: düşük sıcaklık daha kararlı/tekrarlı, yüksek sıcaklık daha çeşitli/riskli çıktı verir (top-k / top-p ile birlikte). Şekil 5.4’teki olasılıklar gösterim amaçlıdır; gerçek model sözlüğün tamamı üzerinde bir dağılım üretir. ||| Sıcaklık (temperature) dağılımı keskinleştirir/yumuşatır: düşük sıcaklık daha kararlı/tekrarlı, yüksek sıcaklık daha çeşitli/riskli çıktı verir (top-k / top-p ile birlikte). Şekil 5.4’teki olasılıklar örnek değerlerdir; gerçek model sözlüğün tamamı üzerinde bir dağılım üretir.
LLM’ler otoregresiftir: P(token | bağlam) dağılımını üretir ve bir token seçip diziye ekler. Düşük sıcaklık → greedy (en olası, argmax); yüksek sıcaklık → örnekleme (olasılığa göre daha çeşitli/riskli seçim). ||| Düşük sıcaklık → greedy (en olası, argmax); yüksek sıcaklık → örnekleme (olasılığa göre daha çeşitli/riskli seçim).
Üç aşama: (1) Öz-denetimli ön eğitim: bir sonraki-token hedefiyle dili ve dünyayı öğrenir. (2) Denetimli ince ayar (SFT): talimat–cevap çiftleriyle yönergeyi izlemeyi öğrenir. (3) Tercih hizalaması (RLHF/DPO): insan tercihlerinden türetilen bir ödül sinyaliyle yardımcı, dürüst ve güvenli olmayı öğrenir. ||| Üç aşamanın sırası sabittir: öz-denetimli ön eğitim → denetimli ince ayar (SFT) → tercih hizalaması (RLHF/DPO).
Görsel üreten modeller bambaşka bir fikre dayanır: difüzyon. Buğulu bir cam düşün; arkasındaki resim seçilmiyor. Şimdi camı yavaş yavaş sil: Resim adım adım beliriyor. Difüzyon modeli tam bu silme işini öğrenir; yalnız o, işe tamamen karıncalı bir ekranla (saf gürültüyle) başlar ve her adımda biraz temizleyerek görüntüyü ortaya çıkarır. ||| Görsel üreten modeller bambaşka bir fikre dayanır: difüzyon. Buğulu bir cam düşün; arkasındaki resim seçilmiyor. Şimdi camı yavaş yavaş sil: Resim adım adım beliriyor. Difüzyon modeli bu silme işini öğrenir; yalnız o, işe tamamen karıncalı bir ekranla (saf gürültüyle) başlar ve her adımda biraz temizleyerek görüntüyü ortaya çıkarır.
Metinden-görsele üretimde, üretim bir metin gömüsüyle koşullandırılır (genelde CLIP benzeri) ve hız için latent uzayda yapılır (latent diffusion). Şekil 5.6 niteliksel bir gösterimdir; gerçek modeller öğrenilmiş bir gürültü-kestirim ağı kullanır. ||| Metinden-görsele üretimde, üretim bir metin gömüsüyle koşullandırılır (genelde CLIP benzeri) ve hız için latent uzayda yapılır (latent diffusion). Şekil 5.6 yalnız fikri anlatır; gerçek modeller öğrenilmiş bir gürültü-kestirim ağı kullanır.
Difüzyon iki süreçtir. İleri süreç: görsele kademeli Gauss gürültüsü eklenir (öğrenmesiz). Ters süreç: bir ağ her adımda eklenen gürültüyü kestirip çıkararak örneği temizler (denoising); saf gürültüden şekle ulaşılır. ||| Eğitimde ileri süreç, üretimde ters süreç çalışır; ağ yalnız ters süreci öğrenir.
Bu modeller etkileyici ama sihirli değil. En ünlü kusurları halüsinasyon: Model, hiç bozuntuya vermeden, kulağa doğru gelen ama yanlış bir bilgi anlatabilir. Çünkü işi doğruyu bilmek değil, “olası devamı” üretmek. Bir diğer sınır da bağlam penceresi: Modelin elinde küçük bir not defteri vardır; aynı anda ancak o kadar token tutar. Defter dolunca en eski satırlar silinir. ||| Bu modeller etkileyici ama kusursuz değil. En ünlü kusurları halüsinasyon: Model, hiç bozuntuya vermeden, kulağa doğru gelen ama yanlış bir bilgi anlatabilir. Çünkü işi doğruyu bilmek değil, “olası devamı” üretmek. Bir diğer sınır da bağlam penceresi: Modelin elinde küçük bir not defteri vardır; aynı anda ancak o kadar token tutar. Defter dolunca en eski satırlar silinir.
Bağlam penceresini aşağıda kendin dene: kelime ekledikçe pencere dolar ve sınırı aşan en eski kelimeler “unutulur”. Uzun belgelerin neden kırpıldığını ya da özetlendiğini işte burada görebilirsin. ||| Bağlam penceresini aşağıda kendin dene: kelime ekledikçe pencere dolar ve sınırı aşan en eski kelimeler “unutulur”. Uzun belgelerin neden kırpıldığını ya da özetlendiğini burada görebilirsin.
Bağlam penceresi sabit bir token sınırıdır; model aynı anda yalnızca son N token’ı “hatırlar”, pencere dolunca en eskiler dışarı düşer. Dikkat maliyeti O(n²) olduğundan pencereyi büyütmek pahalıdır; uzun belgeler bu yüzden kırpılır ya da özetlenir. ||| Model aynı anda yalnızca son N token’ı “hatırlar”; pencere dolunca en eskiler dışarı düşer, uzun belgeler bu yüzden kırpılır ya da özetlenir.
Bütün bunları mümkün kılan tek bir buluş var: Transformer mimarisi ve onun kalbindeki dikkat (attention) fikri. Hikâyeye en küçük parçadan başlıyoruz: bir cümle makineye nasıl görünür? Token denen küçük metin parçaları olarak. Önce token, sonra gömü, dikkat ve kelime kelime üretim; ardından eğitim, difüzyon ve sınırlar. ||| Bu sıçramanın dönüm noktalarından biri Transformer mimarisi ve onun kalbindeki dikkat (attention) fikri. Üretken modeller (GAN gibi) ve dikkat mekanizmaları daha önce de araştırılıyordu; Transformer, üretken dil modellerinin büyük ölçekte eğitilmesini mümkün kıldı. Hikâyeye en küçük parçadan başlıyoruz: bir cümle makineye nasıl görünür? Token denen küçük metin parçaları olarak. Önce token, sonra gömü, dikkat ve kelime kelime üretim; ardından eğitim, difüzyon ve sınırlar.
Üretken YZ, ayırt edici (discriminative) modellemeden üretken (generative) modellemeye geçişi temsil eder: p(y|x) yerine veriyi üreten dağılımı, p(x) ya da p(x|koşul), modellemek. Modern sıçrama büyük ölçüde Transformer mimarisinden (Vaswani vd., 2017, “Attention Is All You Need”) ve onu büyük ölçekte eğitebilen veri + hesaplama birikiminden doğdu. ||| Üretken YZ, ayırt edici (discriminative) modellemeden üretken (generative) modellemeye geçişi temsil eder. Ayırt edici bir sınıflandırıcı, girdi x verildiğinde etiket y’nin olasılığını modeller: p(y|x). Üretici model ise üretilecek içeriğin, yani x’in, dağılımını modeller: p(x) ya da bir koşula bağlı olarak p(x|koşul); bu dağılımdan yeni içerik örnekleri üretilir. Transformer mimarisi (Vaswani vd., 2017, “Attention Is All You Need”) üretken dil modellerinin ölçeklenmesinde önemli bir dönüm noktasıydı; üretken modeller (ör. GAN, 2014) ve dikkat mekanizmaları daha önce de araştırılıyordu. Modern sıçrama bu mimari ile onu büyük ölçekte eğitebilen veri + hesaplama birikiminin birleşmesinden doğdu.
Modern modeller alt-kelime (subword) tokenleştirme kullanır (ör. BPE, WordPiece, SentencePiece): sık geçen diziler tek token olur, nadir kelimeler birden çok parçaya ayrılır. Sözlük tipik olarak 30K–100K+ token içerir; her token bir tam sayı kimliğine (ID) eşlenir. ||| Modern modeller alt-kelime (subword) tokenleştirme kullanır (yaklaşımlar: BPE, WordPiece, unigram; SentencePiece ise bu modelleri eğiten bir araçtır): sık geçen diziler tek token olur, nadir kelimeler birden çok parçaya ayrılır. Sözlük tipik olarak 30K–100K+ token içerir; her token bir tam sayı kimliğine (ID) eşlenir.
Model bir cümleyi olduğu gibi görmez; önce küçük parçalara (token) böler. Kısa kelimeler tek parça kalır, uzun kelimeler “##” ile bölünür, noktalama işaretleri de ayrı sayılır. Model her şeyi bu parçalar hâlinde okur; hem kapasitesi hem ücreti token sayısına göre hesaplanır. ||| Model bir cümleyi olduğu gibi görmez; önce küçük parçalara (token) böler. Buradaki bölücü kısa kelimeleri tek parça bırakır, uzun kelimeleri “##” ile böler, noktalama işaretlerini ayrı sayar; gerçek token sınırları kullanılan tokenizer’a ve sözlüğüne bağlıdır. Model her şeyi bu parçalar hâlinde okur; hem kapasitesi hem ücreti token sayısına göre hesaplanır.
Kısa kelimeler tek token kalır; uzun kelimeler “##” ile parçalara ayrılır, noktalama ise ayrı bir token sayılır. ||| Bu gösterimde kısa kelimeler tek token kalır, uzun kelimeler “##” ile parçalara ayrılır, noktalama ayrı bir token sayılır; gerçek token sınırları seçilen tokenizer’a ve sözlüğe bağlıdır.
Token’lar makineye sayı olarak girer ama kuru bir kimlik numarası “anlam” taşımaz. Gömü (embedding) burada sahneye çıkar: Her kelime, kocaman bir şehirde bir adrese yerleştirilir. O adres, kelimenin anlamını taşıyan bir sayı listesidir. ||| Token’lar makineye sayı olarak girer ama kuru bir kimlik numarası “anlam” taşımaz. Vektör gösterimi, kısaca gömü (embedding), burada sahneye çıkar: Her kelime, kocaman bir şehirde bir adrese yerleştirilir. O adres, kelimenin anlamını taşıyan bir sayı listesidir.
Ünlü örnek: vektör aritmetiğiyle kral − adam + kadın ≈ kraliçe gibi analojiler ortaya çıkabilir. Aşağıdaki görselleştirme yüksek boyutlu uzayın 2B’ye indirgenmiş (PCA/t-SNE benzeri) bir temsilidir; gerçek gömüler çok daha yüksek boyutludur. ||| Ünlü örnek: vektör aritmetiğiyle kral − adam + kadın ≈ kraliçe gibi analojiler ortaya çıkabilir. Şekil 5.2’deki noktalar benzerlik fikrini göstermek için elle yerleştirilmiştir; eğitilmiş bir modelden çıkarılmış gömüler ya da PCA/t-SNE sonucu değildir. Gerçek gömüler çok daha yüksek boyutludur; iki boyutlu bir izdüşümde en yakın görünen iki nokta, asıl uzayda en benzer ikili olmayabilir.
Her kelime, bir haritadaki noktaya dönüştürülür. Anlamca yakın kelimeler bu haritada da yan yana durur; en yakın 2 komşu, anlamca en benzer 2 kelimedir. Böylece makine “kedi” ile “köpek”in akraba, “elma”nın uzak olduğunu aradaki mesafeye bakarak anlar. ||| Her kelime, bir haritadaki noktaya dönüştürülür. Anlamca yakın kelimeler bu haritada da yan yana durur; buradaki en yakın 2 komşu, anlamca en benzer 2 kelimeyi temsil eder. Bu haritanın noktaları fikri göstermek için elle yerleştirilmiştir, eğitilmiş bir modelden alınmamıştır. Makine de “kedi” ile “köpek”in akraba, “elma”nın uzak olduğunu aradaki mesafeye bakarak anlar.
En kısa mesafedeki 2 nokta = anlamca en benzer 2 kelime. Yakınlık = benzer anlam. ||| Bu gösterimde en kısa mesafedeki 2 nokta = anlamca en benzer 2 kelime; yakınlık = benzer anlam. Noktalar elle yerleştirilmiştir; iki boyutlu yakınlık, asıl uzaydaki en yakın komşuyu garanti etmez.
Öz-dikkat (self-attention) her token için sorgu (Q), anahtar (K) ve değer (V) vektörleri üretir; ağırlıklar softmax(Q·Kᵀ/√d) ile hesaplanır ve çıktı bu ağırlıklarla V’lerin toplamıdır. Böylece her konum, tüm diziye uzaklıktan bağımsız erişebilir. ||| Öz-dikkat (self-attention) her token için sorgu (Q), anahtar (K) ve değer (V) vektörleri üretir; ağırlıklar softmax(Q·Kᵀ/√d_k) ile hesaplanır (d_k anahtar vektörünün boyutu) ve çıktı bu ağırlıklarla V’lerin toplamıdır. Maskesiz öz-dikkatte her konum tüm diziye uzaklıktan bağımsız erişebilir; otoregresif (nedensel) decoder ise gelecekteki token’ları maskeler, her konum yalnız kendinden öncekileri görür. Eğitimde dizinin birçok konumu birlikte hesaplanır; otoregresif üretim token’ları sırayla ekler.
“Attention Is All You Need” (2017): dikkat mekanizması, önceki RNN’lerin tek tek/sıralı işleme zorunluluğunu kaldırdı. Tüm kelimelere aynı anda bakmak, hem hızı hem anlama gücünü bambaşka bir düzeye taşıdı. ||| “Attention Is All You Need” (2017): dikkat mekanizması, önceki RNN’lerin tek tek/sıralı işleme zorunluluğunu kaldırdı. Eğitimde tüm konumları birlikte işlemek hem hızı hem anlama gücünü bambaşka bir düzeye taşıdı; üretim yine token token ilerler.
Bir cümleyi anlamak için her kelime, ötekilerden hangilerine “dikkat etmesi” gerektiğine karar verir. Renk ne kadar koyuysa iki kelime arasındaki bağ o kadar güçlü demektir. Böylece “o korkmuştu” derken “o”nun kediyi kastettiği ortaya çıkar. ||| Bir cümleyi anlamak için her kelime, ötekilerden hangilerine “dikkat etmesi” gerektiğine karar verir. Renk ne kadar koyuysa iki kelime arasındaki bağ o kadar güçlü demektir. Bu temsili örnekte “o”, en çok kediye bakıyor; ağırlıklar elle seçilmiştir ve tek başına zamirin çözüldüğünü kanıtlamaz.
Renk ne kadar koyuysa bağ o kadar güçlü; böylece “o” gibi bir kelimenin neyi kastettiği çözülür. ||| Renk ne kadar koyuysa bağ o kadar güçlü; bu temsili ağırlıklar “o” gibi bir kelimenin kime baktığını gösterir. Dikkat ağırlığı tek başına göndergenin çözüldüğünü kanıtlamaz.
Şu oyunu bilirsin: Biri “Ayağını yorganına göre...” der, sen “uzat!” diye tamamlarsın. Garip gelecek ama bir dil modelinin tek işi budur: Metne bakıp en olası bir sonraki kelimeyi (token) tahmin etmek. Tahminini metne ekler, yeniden tahmin eder. Bu minik oyunu binlerce kez oynayarak koca paragraflar yazar. ||| Şu oyunu bilirsin: Biri “Ayağını yorganına göre...” der, sen “uzat!” diye tamamlarsın. Garip gelecek ama bu bölümdeki dil modellerinin işi budur: Metne bakıp en olası bir sonraki kelimeyi (token) tahmin etmek. Tahminini metne ekler, yeniden tahmin eder. Bu minik oyunu binlerce kez oynayarak koca paragraflar yazar.
“Üret”e bas; modelin her adımda hangi kelimeleri hangi olasılıkla düşündüğünü ve cümleyi nasıl kurduğunu izle. “Yaratıcılık” (sıcaklık) düğmesiyle de dene: hep en olası kelimeyi mi seçsin, yoksa biraz risk mi alsın? ||| “Üret”e bas; modelin her adımda hangi kelimeleri hangi olasılıkla düşündüğünü ve cümleyi nasıl kurduğunu izle. İki seçim kuralını da dene: hep en olası kelimeyi mi seçsin (açgözlü), yoksa olasılıklara göre zar mı atsın (örnekleme)?
LLM’ler otoregresiftir: P(tokenₜ | token₁…tokenₜ₋₁) dağılımını üretir, softmax ile olasılığa çevirir ve bir token seçip diziye ekler. Greedy (argmax) en olasıyı seçer; örnekleme (sampling) dağılımdan çeker. ||| Burada otoregresif üretici dil modellerini inceliyoruz; bugünün sohbet modellerinin çoğu bu sınıftadır, ama her dil modeli otoregresif değildir. Model, bir sonraki token için sözlükteki her adaya bir skor (logit) üretir; softmax bu skorları toplamı 1 olan bir olasılık dağılımına, P(tokenₜ | token₁…tokenₜ₋₁), çevirir ve bir token seçilip diziye eklenir. Açgözlü seçim (greedy, argmax) en olasıyı alır; örnekleme (sampling) dağılımdan rastgele çeker.
Sıcaklık (temperature) dağılımı keskinleştirir/yumuşatır: düşük sıcaklık daha kararlı/tekrarlı, yüksek sıcaklık daha çeşitli/riskli çıktı verir (top-k / top-p ile birlikte). Aşağıdaki olasılıklar örnek değerlerdir; gerçek model sözlüğün tamamı üzerinde bir dağılım üretir. ||| Sıcaklık (temperature) dağılımı keskinleştirir/yumuşatır: düşük sıcaklık daha kararlı/tekrarlı, yüksek sıcaklık daha çeşitli/riskli çıktı verir (top-k / top-p ile birlikte). T sıfırdan büyük olduğu sürece örnekleme rastlantısaldır; açgözlü (argmax) seçim ayrı bir kuraldır, düşük sıcaklıklı örnekleme değildir. Şekil 5.4’teki olasılıklar örnek değerlerdir; gerçek model sözlüğün tamamı üzerinde bir dağılım üretir.
Model her adımda “şimdiye kadarki metinden sonra en olası kelime ne?” diye düşünür, birini seçip cümleye ekler ve baştan sorar. “Yaratıcılık” (sıcaklık) düşükse hep en olası kelimeyi seçer; kararlı ama tahmin edilebilir olur. Yükseldikçe daha çeşitli, sürprizli seçimler yapar. ||| Model her adımda “şimdiye kadarki metinden sonra en olası kelime ne?” diye düşünür, birini seçip cümleye ekler ve baştan sorar. Açgözlü seçim hep en olası kelimeyi alır; kararlı ama tahmin edilebilir olur. Örneklemede model olasılıklara göre zar atar. “Yaratıcılık” (sıcaklık) yükseldikçe zar daha dengeli olur ve seçimler çeşitlenir; düştükçe en olası kelime öne çıkar ama zar yine atılır.
Düşük sıcaklık → greedy (en olası, argmax); yüksek sıcaklık → örnekleme (olasılığa göre daha çeşitli/riskli seçim). ||| Açgözlü seçim (argmax) her adımda en olasıyı alır; örnekleme softmax(z/T) dağılımından rastgele çeker. T pozitifken örnekleme rastlantısaldır: düşük T dağılımı sivriltir, yüksek T düzleştirir.
Bir LLM özünde ne yapar? ||| Bu bölümdeki otoregresif bir LLM özünde ne yapar?
Bir sohbet asistanı da çocuk gibi yetişir; üç okuldan geçer. Önce devasa metinlerle “ön eğitim” görür: Dili ve dünyayı orada öğrenir. Sonra “ince ayar” okulunda soruya cevap vermeyi, talimata uymayı öğrenir. En son “insan geri bildirimiyle hizalama” gelir: Orada da yardımcı, dürüst ve güvenli olmayı, yani görgüyü öğrenir. ||| Bir sohbet asistanı da çocuk gibi yetişir; yaygın bir yol üç okuldan geçer. Önce devasa metinlerle “ön eğitim” görür: Dili ve dünyayı orada öğrenir. Sonra “ince ayar” okulunda soruya cevap vermeyi, talimata uymayı öğrenir. En son “insan geri bildirimiyle hizalama” gelir: Orada da yardımcı, dürüst ve güvenli olmayı, yani görgüyü öğrenir.
1) Ön eğitim (pretraining): büyük derlem üzerinde öz-denetimli bir sonraki-token hedefiyle dilin istatistiğini öğrenir. 2) Denetimli ince ayar (SFT): talimat–cevap çiftleriyle yönergeyi izlemeyi öğrenir. 3) RLHF/tercih hizalaması: insan tercihleriyle bir ödül modeli eğitilir ve politika (ör. PPO ya da DPO) bu sinyale göre güncellenir. ||| 1) Ön eğitim (pretraining): büyük derlem üzerinde öz-denetimli bir sonraki-token hedefiyle dilin istatistiğini öğrenir. 2) Denetimli ince ayar (SFT): talimat–cevap çiftleriyle yönergeyi izlemeyi öğrenir. 3) Tercih hizalaması: PPO tabanlı RLHF insan tercihleriyle ayrı bir ödül modeli eğitir ve politikayı bu sinyale göre günceller; DPO ise tercih çiftlerinden doğrudan bir politika kaybı kurar, ayrı ödül modeli gerektirmez. Bu üç aşama yaygın bir akıştır; tüm modeller aynı aşamalardan aynı sırayla geçmez.
Ön eğitim modele “ne bildiğini”, ince ayar ve RLHF ise “nasıl davranacağını” kazandırır. Aynı bilgi, çok farklı tonlarda sunulabilir. ||| Kabaca: ön eğitim modele “ne bildiğini”, ince ayar ve hizalama “nasıl davranacağını” kazandırır; ince ayar bilgiyi ve görev başarımını da değiştirebilir. Aynı bilgi, çok farklı tonlarda sunulabilir.
Bir asistan üç aşamada yetişir. Önce devasa metinlerle “ön eğitim”de dili ve dünyayı öğrenir. Sonra “ince ayar”da örnek soru–cevaplarla talimat izlemeyi öğrenir. En sonda insan tercihleriyle “hizalanır”: yardımcı, dürüst ve güvenli bir tonda cevap vermeyi öğrenir. Aynı bilgi, her aşamada daha kullanışlı sunulur. ||| Bir asistan yaygın bir yolda üç aşamada yetişir. Önce devasa metinlerle “ön eğitim”de dili ve dünyayı öğrenir. Sonra “ince ayar”da örnek soru–cevaplarla talimat izlemeyi öğrenir. En sonda insan tercihleriyle “hizalanır”: yardımcı, dürüst ve güvenli bir tonda cevap vermeyi öğrenir. Aynı bilgi, her aşamada daha kullanışlı sunulur; tüm modeller aynı aşamalardan geçmez.
Üç aşamanın sırası sabittir: öz-denetimli ön eğitim → denetimli ince ayar (SFT) → tercih hizalaması (RLHF/DPO). ||| Yaygın sıra: öz-denetimli ön eğitim → denetimli ince ayar (SFT) → tercih hizalaması (RLHF ya da DPO). Bu sıra sabit bir reçete değildir.
Eğitim hattının doğru sırası? ||| Bölümde anlatılan yaygın eğitim hattının sırası?
Görsel üreten modeller bambaşka bir fikre dayanır: difüzyon. Buğulu bir cam düşün; arkasındaki resim seçilmiyor. Şimdi camı yavaş yavaş sil: Resim adım adım beliriyor. Difüzyon modeli bu silme işini öğrenir; yalnız o, işe tamamen karıncalı bir ekranla (saf gürültüyle) başlar ve her adımda biraz temizleyerek görüntüyü ortaya çıkarır. ||| Bugünün görsel üreten modellerinin çoğu bambaşka bir fikre dayanır: difüzyon; GAN gibi başka yollar da var. Buğulu bir cam düşün; arkasındaki resim seçilmiyor. Şimdi camı yavaş yavaş sil: Resim adım adım beliriyor. Difüzyon modeli bu silme işini öğrenir; yalnız o, işe tamamen karıncalı bir ekranla (saf gürültüyle) başlar ve her adımda biraz temizleyerek görüntüyü ortaya çıkarır.
Difüzyon, karlı bir TV ekranını (saf gürültü) adım adım temizleyip içinden bir görsel çıkarmaya benzer. Model “bu gürültünün altında ne olabilir?” diye tahmin ederek her adımda biraz daha netleştirir. Kaydıracı sağa sürükledikçe gürültü azalır ve şekil (bir kalp) belirir. ||| Difüzyon, karlı bir TV ekranını (saf gürültü) adım adım temizleyip içinden bir görsel çıkarmaya benzer. Model “bu gürültünün altında ne olabilir?” diye tahmin ederek her adımda biraz daha netleştirir. Kaydıracı sağa sürükledikçe gürültü azalır ve şekil (bir kalp) belirir; bu canlandırma geçişi sabit bir desenle gösterir, gerçek model saklı bir resmi açmaz, yeni bir örnek üretir.
Bu modeller etkileyici ama kusursuz değil. En ünlü kusurları halüsinasyon: Model, hiç bozuntuya vermeden, kulağa doğru gelen ama yanlış bir bilgi anlatabilir. Çünkü işi doğruyu bilmek değil, “olası devamı” üretmek. Bir diğer sınır da bağlam penceresi: Modelin elinde küçük bir not defteri vardır; aynı anda ancak o kadar token tutar. Defter dolunca en eski satırlar silinir. ||| Bu modeller etkileyici ama kusursuz değil. En ünlü kusurları halüsinasyon: Model, hiç bozuntuya vermeden, kulağa doğru gelen ama yanlış bir bilgi anlatabilir. Akıcı ya da yüksek olasılıklı bir cevap, doğru olduğunun garantisi değildir; yanlış bilgi zar atılmadan da üretilebilir. Bir diğer sınır da bağlam penceresi: Modelin elinde küçük bir not defteri vardır; aynı anda ancak o kadar token tutar. Defter dolunca ne olacağını kullanılan sistem belirler: hata verir, metni kırpar ya da özetler.
Bağlam penceresini aşağıda kendin dene: kelime ekledikçe pencere dolar ve sınırı aşan en eski kelimeler “unutulur”. Uzun belgelerin neden kırpıldığını ya da özetlendiğini burada görebilirsin. ||| Bağlam penceresini aşağıda kendin dene: bu gösterim son sekiz kelimeyi tutan temsili bir kayan penceredir. Kelime ekledikçe pencere dolar ve en eski kelimeler dışarı düşer. Gerçek uygulamalar sınıra gelince hata verebilir, metni kırpabilir ya da özetleyebilir.
Halüsinasyon, modelin olasılıksal üretiminin doğal bir sonucudur; doğruluk garantisi yoktur. Azaltma yolları: kaynak temelli üretim (RAG), araç/doğrulama kullanımı ve daha iyi hizalama (Modül 6’da). Bağlam penceresi sabit bir token sınırıdır; dikkat maliyeti O(n²) olduğundan pencereyi büyütmek pahalıdır. ||| Halüsinasyonun tek bir nedeni yoktur: eğitim hedefi (olası devamı üretmek) ile ifadenin doğruluğu arasında garanti bulunmaz. Akıcı ya da yüksek olasılıklı bir yanıt yanlış olabilir; bu, rastgele örnekleme olmadan, açgözlü çözümlemede de olur. Azaltma yolları: kaynaklarla temellendirme (RAG), araç/doğrulama kullanımı ve daha iyi hizalama (Modül 6’da); önemli iddialar kaynakla ve görev doğrulamasıyla denetlenir. Bağlam penceresi sabit bir token sınırıdır; dikkat maliyeti O(n²) olduğundan pencereyi büyütmek pahalıdır.
Modelin bir “kısa süreli hafızası” var ve aynı anda yalnızca belli sayıda kelimeyi tutabilir. Yeni kelime ekledikçe pencere dolar; sınırı aşınca en eski kelimeler dışarı düşer, yani “unutulur”. Bu yüzden çok uzun belgeler ya kırpılır ya da özetlenerek modele verilir. ||| Modelin bir “kısa süreli hafızası” var ve aynı anda yalnızca belli sayıda token tutabilir. Bu gösterimde yeni kelime ekledikçe pencere dolar; sınırı aşınca en eski kelimeler dışarı düşer, yani “unutulur”. Gerçek sistemler sınıra gelince hata verebilir, metni kırpabilir ya da özetleyebilir; çok uzun belgelerin kırpılması ya da özetlenmesi bu yüzden.
Model aynı anda yalnızca son N token’ı “hatırlar”; pencere dolunca en eskiler dışarı düşer, uzun belgeler bu yüzden kırpılır ya da özetlenir. ||| Bu gösterim son N token’ı tutan bir kayan penceredir; gerçek bir uygulama sınıra gelince hata verebilir, metni kırpabilir ya da özetleyebilir.
-->

<!-- REDAKSİYON NOTLARI
- 2026-10-01 düzeltme belgesi (R033–R044, R066): Transformer tek buluş değil (5.1); p(y|x)/p(x) değişkenleri tanımlandı; Şekil 5.1 oyuncak bölücü, kesin token sayısı yok, SentencePiece araç; Şekil 5.2 elle yerleştirilmiş noktalar, PCA/t-SNE değil, iki boyut sınırı; Şekil 5.3 çift yönlü (encoder) temsili tablo, nedensel maske, √d_k, eğitim paralel / üretim ardışık, ağırlıktan gönderge hükmü çıkmaz (Kendin dene 3 ve cevabı yeniden yazıldı); 5.5 otoregresif kapsam, softmax logitlere; Şekil 5.4 alt sıra artık gerçek sıcaklık örneklemesi (T = 1.5, z = ln p, U = 0.37/0.81/0.12 ters-CDF; demo-data.json temp54): “Yapay zekâ artık yaygın gelişiyor.”, Kendin dene 1–2 ve cevapları yeniden yazıldı, “zar yok” ifadesi açgözlü seçime bağlandı; 5.6 üç aşama zorunlu değil, PPO/DPO ayrımı, tablo “İnsan tercihleri (tercih çiftleri)” (figür dizgisi strings/M05.mjs train.stages[2].data hâlâ “ödül modeli”: figür ajanı), Kendin dene 3 “aynı bilginin farklı yanıt biçimleri”; 5.7 difüzyon tek yöntem değil, yüzde = ilerleme (adım/8) ≠ 6/64 (figür etiketi “temizlenen pay” figür ajanınca “ilerleme” yapılmalı), teknik kutuya xₜ = √ᾱₜ x₀ + √(1−ᾱₜ) ε; 5.8 taşma politikası uygulamaya bağlı, pencerede olmak tam hatırlama garantisi değil, halüsinasyon tek nedenli değil (Kendin dene 3 üç seçenek); “vektör gösterimi, kısaca gömü (embedding)” ilk kullanım (5.3). Sayı biçimi: “T = 1.5” (R095 ondalık nokta kararı; görev metnindeki “1,5” uygulanmadı). Değişen kaynak paragraflar SOURCE-CHANGES’ta.
- 2026-09-30 inceleme: 5.3/5.4/5.6 basit "dokun/bas" cümleleri "Şekil 5.k’de … seç/bak" diye uyarlandı (M06 ile aynı politika); 5.3 ve 5.5 teknik "Aşağıdaki" → "Şekil 5.k’deki"; 5.6 tablosuna "Görünen kalp pikseli" sütunu eklendi (EN ile aynı); 5.8 "iki kat" → "1.6 kat" (19 token / 12 kelime); mor → turuncu (duotone).
- 5.7 basit: "Kaydıracı sürükle: sağa gittikçe model gürültüyü temizliyor ve görsel yavaş yavaş beliriyor." → "Şekil 5.6’daki kareleri soldan sağa izle: sağa gittikçe model gürültüyü temizliyor ve görsel yavaş yavaş beliriyor." (kılavuz §1 örneğiyle aynı kalıp)
- 5.7 Ne oluyor? (basit): "Kaydıracı sağa sürükledikçe gürültü azalır ve şekil (bir kalp) belirir." → "Karelerde sağa gittikçe gürültü azalır ve şekil (bir kalp) belirir." (kılavuz Ne oluyor'u "aynen" der; "kaydıraç" kâğıtta anlamsız kaldığı için en az müdahaleyle uyarlandı, yazar onayı gerekir)
- 5.8 basit: "Bağlam penceresini aşağıda kendin dene: kelime ekledikçe pencere dolar…" olduğu gibi bırakıldı; Şekil 5.7 ve Kendin dene bu cümleyi kâğıtta karşılıyor.
- 5.2/5.3/5.4/5.5/5.6 basit paragraflarındaki "seç / dokun / bas / izle" cümleleri kılavuz §1 gereği çıkarılmadı; her birini hemen ardından gelen Şekil bloğu karşılıyor.
- 5.2 Şekil 5.1: demo verisi olan üçüncü örnek cümle ("Tokenleştirme şaşırtıcı derecede önemli!") yasak kelime içeriyor; demo verisi olduğu için birebir korundu.
- 5.6 Şekil 5.5: üçüncü aşamanın örnek çıktısındaki 🙂 emoji demo verisinden geldi; baskıdan çıkarıldı (2026-09-30).
- 5.6 Şekil 5.5: demo soruyu ekranda göstermiyor; Kurulum'da "başkent sorusu" diye anıldı, soru metni uydurulmadı.
- 5.7 Şekil 5.6: adım yüzdeleri demodaki Math.round ile aynı (13/25/38/50/63/75/88/100). "Çözülen piksel" sayıları demonun sabit tohumlu rastgele fonksiyonundan hesaplandı; figür üretilince sayılar SVG ile karşılaştırılmalı.
- 5.9: export'un "_Cevaplar: cevap-anahtari.md_" satırı "Cevaplar kitabın sonundaki cevap anahtarında." diye yazıldı.
- Demoların canlı demo captionlarındaki uzun tireler (—) Adım adım'a taşınırken virgül/noktaya çevrildi; kaynak paragraflardaki kısa tireler (–) dokunulmadan kaldı.
- Yazar kararı (2026-09-10): kaynak metin dahil tüm "demo" sözcükleri "gösterim" ya da "Şekil N.j" yapıldı; "Aşağıdaki demo" → şekil öncesinde "Aşağıda yer alan gösterim (Şekil N.j)", sonrasında "Şekil N.j'teki gösterim".
- Yazar kararı (2026-09-10, figürler): ekran renkleri (yeşil/kırmızı/mavi/mor) duotone baskıya göre 'koyu/gri' ve 'turuncu' yapıldı; figür düzeni tarifleri ('kendi rengi', 'yanında rolü', 'ok çekmen') figürlerle eşleştirildi.
- 2026-09-30 insanlaştırma geçişi: humanize-tr-report bulguları uygulandı (Peki/Cevap köprüleri, "tam olarak/işte/ibaret" çivileri, altyazı alıntıları, kenar notu göndermeleri, "Bir de/İki gözlem daha" şablonları, "gösterim" enflasyonu, iki nokta sonrası küçük harf). Teknik "Ne oluyor" paragraflarının ilk teknik paragrafı tekrar eden cümleleri kırpıldı. Değişen kaynak paragraflar yukarıdaki SOURCE-CHANGES bloğunda; dijital sürüme taşınacak. 5.6/5.7 teknik "Ne oluyor" paragrafları dijitalde tek başına durduğundan oradaki karar yazara ait.
-->
