# Bölüm 5
## Bugünün Yapay Zekâsı
*Token’dan dil modeline, dikkatten difüzyona*

<!-- acc #7a3fb0 · tag Üretken Çağ -->

### 5.1 Üretken çağ: tanımaktan üretmeye

Şimdiye dek makineler hep “tanıyan” taraftaydı: Bu spam mı, bu kedi mi, bu ev kaç para eder? Bir ressam çırağının yıllarca tablo seyretmesi gibiydi bu. Sonra bir gün çırak fırçayı eline aldı: Makineler artık üretiyor. Yazı yazıyor, resim çiziyor, kod üretiyor, sohbet ediyor.

Bütün bunları mümkün kılan tek bir buluş var: Transformer mimarisi ve onun kalbindeki dikkat (attention) fikri. Hikâyeye en küçük parçadan başlıyoruz: bir cümle makineye nasıl görünür? Token denen küçük metin parçaları olarak. Önce token, sonra gömü, dikkat ve kelime kelime üretim; ardından eğitim, difüzyon ve sınırlar.

> **Kenar notu.** “Neden tam şimdi?” sorusunun cevabı üç ayakta: bol veri (internet), güçlü donanım (GPU) ve doğru mimari (Transformer). Üçü bir araya gelince üretken çağ başladı.

#### Teknik derinlik

Üretken YZ, ayırt edici (discriminative) modellemeden üretken (generative) modellemeye geçişi temsil eder: p(y|x) yerine veriyi üreten dağılımı, p(x) ya da p(x|koşul), modellemek. Modern sıçrama büyük ölçüde Transformer mimarisinden (Vaswani vd., 2017, “Attention Is All You Need”) ve onu büyük ölçekte eğitebilen veri + hesaplama birikiminden doğdu.

Bu bölüm üretken yığını uçtan uca kurar: tokenleştirme → gömü uzayı → öz-dikkat (self-attention) → otoregresif üretim → eğitim hattı (ön eğitim, ince ayar, RLHF) → difüzyon tabanlı görüntü üretimi → ve pratik sınırlar (halüsinasyon, bağlam penceresi, maliyet). Böylece bugünün LLM ve üretken modellerinin neden ve nasıl çalıştığı yerine oturur.

Bu yığının ilk basamağı en küçük parça. Sen bir cümleyi harf harf, kelime kelime okursun; makine neyi okur?

### 5.2 Makine kelimeleri nasıl görür: token’lar

Bir dil modeli, harfleri ya da kelimeleri “olduğu gibi” görmez. Metni önce minik lego parçalarına ayırır; bunlara token denir. Bir token bazen koca bir kelimedir, bazen bir kelimeden kopmuş küçük bir parça, bazen de yalnızca bir virgül.

Neden parçalıyor? Lego kutusunu düşün: sınırlı sayıda parçayla sonsuz şey kurulur. Dünyadaki bütün kelimeleri ezberlemek imkânsızdır; ama sınırlı bir parça takımıyla her kelime kurulabilir. Aşağıdan bir örnek seç, makinenin cümleyi parçalara ayırışını izle.

> **Kenar notu.** Aynı metin, farklı dillerde farklı sayıda token tutar. Bu yüzden bir LLM’e Türkçe sormak bazen İngilizce sormaktan daha “pahalı” olabilir.

**Şekil 5.1 · Cümleni token’lara böl**
![Şekil 5.1](../../figures/out/tr/sekil-5-1-token.svg)

*Kurulum.* Şekilde üç örnek cümle ve her birinin token’lara ayrılmış hâli var. Her token bir kutu içinde. Beyaz kutular bağımsız bir parçayı, turuncu tonlu kutular ise “##” ile başlayan devam parçalarını gösterir. Her cümlenin altında iki sayı yazıyor: kelime sayısı ve token sayısı. Bölücünün kuralı canlı demodakiyle aynı.

*Adım adım.* Bölücünün kuralı üç satır. Altı karakter ve daha kısa kelimeler tek token kalır. Daha uzun kelimeler dörder karakterlik parçalara bölünür; ilk parça düz, sonrakiler “##” ile yazılır. Virgül, nokta ve ünlem her zaman ayrı bir token’dır. Şimdi bu kuralı üç cümleye uygula:

| Cümle | Token’lar | Kelime | Token |
|---|---|---|---|
| Merhaba dünya, bugün 2026. | Merh · ##aba · dünya · , · bugün · 2026 · . | 4 | 7 |
| Yapay zekâ metni token’lara böler. | Yapay · zekâ · metni · toke · ##n’la · ##ra · böler · . | 5 | 8 |
| Tokenleştirme şaşırtıcı derecede önemli! | Toke · ##nleş · ##tirm · ##e · şaşı · ##rtıc · ##ı · dere · ##cede · önemli · ! | 4 | 11 |

Birinci cümlede “Merhaba” yedi harf; sınırı bir harfle aşıyor ve ikiye bölünüyor. “2026” bir sayı ama bölücü için sıradan bir dört karakterli kelime. Nokta ayrı kutuya düşüyor. İkinci cümlede “token’lara” kesme işaretiyle birlikte on karakter; üç parçaya ayrılıyor. Kesme işareti, virgül gibi ayrı sayılmıyor; kelimenin içinde kalıyor. Üçüncü cümle en çarpıcı olanı: dört kelime, on bir token. “Tokenleştirme” tek başına dört parça. “önemli” tam altı harf; sınırı aşmadığı için tek parça kalıyor.

Aynı sayıda kelimeden çok farklı sayıda token çıkabiliyor: birinci ve üçüncü cümle dörder kelime, ama biri 7 token, öteki 11. Belirleyici olan kelime sayısı değil, uzun ve nadir kelimelerin sayısı. Türkçe ekler kelimeleri uzattığı için bu dilde token sayısı İngilizceye göre şişer. Türkçe sormanın bazen daha pahalı olması bu yüzden.

*Ne oluyor?* Model bir cümleyi olduğu gibi görmez; önce küçük parçalara (token) böler. Kısa kelimeler tek parça kalır, uzun kelimeler “##” ile bölünür, noktalama işaretleri de ayrı sayılır. Model her şeyi bu parçalar hâlinde okur; hem kapasitesi hem ücreti token sayısına göre hesaplanır.

*Kendin dene.* 1) “Yapay zekâ öğreniyor.” cümlesini aynı kuralla böl; kaç token çıkar? 2) “Bilgisayarlarımızla” kelimesi kaç parçaya ayrılır? Parçaları yaz. 3) Üçüncü örnek cümlede kelime başına ortalama kaç token düşüyor? Birinci cümleyle karşılaştır. Canlı demo: [QR 5.1]

#### Teknik derinlik

Modern modeller alt-kelime (subword) tokenleştirme kullanır (ör. BPE, WordPiece, SentencePiece): sık geçen diziler tek token olur, nadir kelimeler birden çok parçaya ayrılır. Sözlük tipik olarak 30K–100K+ token içerir; her token bir tam sayı kimliğine (ID) eşlenir.

Kabaca İngilizcede 1 token ≈ 0.75 kelime; Türkçe gibi eklemeli dillerde kelime başına daha çok token düşebilir. Model bağlamı ve maliyeti token cinsinden ölçülür: hem bağlam penceresi hem ücretlendirme token sayısına bağlıdır. Şekil 5.1 basitleştirilmiş bir alt-kelime bölücü kullanır (uzun kelimeleri “##” ile parçalara ayırır).

Kısa kelimeler tek token kalır; uzun kelimeler “##” ile parçalara ayrılır, noktalama ise ayrı bir token sayılır.

Şekil 5.1’deki kural (en çok 6 karakter tek token, sonrası dörder karakter) gerçek bir BPE sözlüğünün yerini tutmaz. Gerçek bir sözlükte “Merhaba” gibi sık bir kelime tek token olurdu; “Tokenleştirme” ise sözlüğün sıklık istatistiğine göre ikiye ya da üçe bölünürdü. Kural basit, sonuç aynı yöne işaret eder: nadir ve uzun kelimeler daha çok parça tutar.

Her token artık bir sayı kimliği taşıyor. Ama bir kimlik numarası, “kedi” ile “köpek”in yakın olduğunu söylemez. Anlam nereden gelir?

### 5.3 Anlamı sayıya çevirmek: gömüler

Token’lar makineye sayı olarak girer ama kuru bir kimlik numarası “anlam” taşımaz. Gömü (embedding) burada sahneye çıkar: Her kelime, kocaman bir şehirde bir adrese yerleştirilir. O adres, kelimenin anlamını taşıyan bir sayı listesidir.

Bu şehirde anlamca benzeşen kelimeler aynı mahalleye taşınır. “Kedi” ile “köpek” kapı komşusudur; “kral” ile “kraliçe” de öyle. Şekil 5.2’de bir kelime seç, komşularını gör.

> **Kenar notu.** Gömüler yalnızca kelimeler için değil: cümleler, görseller, sesler de aynı uzaya gömülebilir. Çok-kipli (multimodal) modellerin ve anlamsal aramanın (semantic search) temeli budur.

**Şekil 5.2 · Anlam haritası**
![Şekil 5.2](../../figures/out/tr/sekil-5-2-embed.svg)

*Kurulum.* Şekil, dokuz kelimeyi iki boyutlu bir haritaya yerleştiriyor. Üç kesikli daire, üç anlam ailesi: hayvanlar (kedi, köpek, kuş), krallık (kral, kraliçe, prens), yiyecekler (elma, ekmek, peynir). Her noktanın yanında kelimesi yazıyor; koordinatlar aşağıdaki tabloda. Yakın duran noktalar anlamca da yakın; uzaklık düz bir cetvelle ölçülüyor.

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

Aileler arasında uzaklık büyüyor. “kedi” ile “elma” arası 99 birim; “kedi” ile “kraliçe” arası 164. Harita yalnız kimin komşu olduğunu değil, kimin ne kadar yabancı olduğunu da söylüyor. Sınır bölgesi de var: “prens”in üçüncü en yakın kelimesi “ekmek” (54.4); krallık mahallesiyle yiyecek mahallesi birbirine değiyor. Makinenin anlam dediği şey bu geometri: adresler arasındaki mesafe.

*Ne oluyor?* Her kelime, bir haritadaki noktaya dönüştürülür. Anlamca yakın kelimeler bu haritada da yan yana durur; en yakın 2 komşu, anlamca en benzer 2 kelimedir. Böylece makine “kedi” ile “köpek”in akraba, “elma”nın uzak olduğunu aradaki mesafeye bakarak anlar.

*Kendin dene.* 1) “kuş” ile “peynir” arasındaki uzaklığı hesapla. Tablodaki aile içi uzaklıkların en büyüğüyle karşılaştır. 2) Haritaya “aslan” kelimesini eklemek istesen hangi bölgeye koyardın? x ve y için makul bir çift öner ve en yakın iki komşusunu bul. 3) “ekmek” için en yakın üçüncü kelime hangisi, hangi aileden? Bu sana harita hakkında ne söylüyor? Canlı demo: [QR 5.2]

#### Teknik derinlik

Gömü, bir token’ı yoğun (dense) bir vektöre eşler (tipik olarak yüzlerce–binlerce boyut). Bu vektörler eğitimle öğrenilir; anlamsal/sözdizimsel ilişkiler geometriye yansır. Benzerlik genelde kosinüs benzerliğiyle ölçülür.

Ünlü örnek: vektör aritmetiğiyle kral − adam + kadın ≈ kraliçe gibi analojiler ortaya çıkabilir. Şekil 5.2’deki görselleştirme yüksek boyutlu uzayın 2B’ye indirgenmiş (PCA/t-SNE benzeri) bir temsilidir; gerçek gömüler çok daha yüksek boyutludur.

En kısa mesafedeki 2 nokta = anlamca en benzer 2 kelime. Yakınlık = benzer anlam.

Şekil 5.2’deki uzaklık Öklid uzaklığıdır: d = √((x₁ − x₂)² + (y₁ − y₂)²). Gerçek gömülerde daha çok kosinüs benzerliği kullanılır: cos θ = (a·b) / (‖a‖·‖b‖). Bu ölçü vektörlerin uzunluğunu değil yönünü karşılaştırır; 1’e yakın değer aynı yön, 0 dik (ilgisiz), −1 zıt yön demektir.

Her kelimenin bir adresi var. Ama cümle içinde bir kelime, o an hangi komşusuna bakması gerektiğini nasıl seçer?

### 5.4 Dikkat: Transformer’ın kalbi

Şu cümleyi oku: “Kedi kaçtı çünkü o korkmuştu.” Buradaki “o” kim? Sen farkında bile olmadan dönüp “kedi”ye baktın. Dikkat (attention) mekanizması, makineye bu dönüp bakmayı öğretir: Her kelime, anlamı için hangi kelimelere “bakacağını” öğrenir.

Şekil 5.3’te bir kelime seç; o kelimenin cümledeki ötekilere ne kadar “dikkat ettiğini” rengin koyuluğundan gör. Renk ne kadar koyuysa bağ o kadar güçlü.

> **Kenar notu.** “Attention Is All You Need” (2017): dikkat mekanizması, önceki RNN’lerin tek tek/sıralı işleme zorunluluğunu kaldırdı. Tüm kelimelere aynı anda bakmak, hem hızı hem anlama gücünü bambaşka bir düzeye taşıdı.

**Şekil 5.3 · Hangi kelime hangisine bakıyor?**
![Şekil 5.3](../../figures/out/tr/sekil-5-3-attn.svg)

*Kurulum.* Şekil, “Kedi kaçtı çünkü o korkmuştu.” cümlesinin beş kelimesini bir ısı tablosuna yerleştiriyor. Satırlar bakan kelime (sorgu), sütunlar bakılan kelime. Her hücre bir dikkat ağırlığı; bir satırdaki sayıların toplamı 1.00 eder. Hücre ne kadar koyuysa ağırlık o kadar büyük. Her satırın en koyu hücresi kalın yazılmış.

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
4. “o”: bölümün asıl sorusu burada. En koyu hücre 0.55 ile “Kedi”; kendine ayırdığı pay yalnızca 0.20. Zamir, kimi kastettiğini kediye bakarak çözüyor.
5. “korkmuştu”: en çok “o”ya bakıyor (0.40), ikinci sırada “Kedi” (0.30). Fiil, öznesini iki adımda buluyor: önce zamir, sonra zamirin işaret ettiği kedi.

Tablo simetrik değil: “o” kediye 0.55 ile bakıyor, “Kedi” ise “o”ya yalnız 0.10 ile. Bakış yönlü. Uzaklık da önemsiz: “o” ile “Kedi” arasında iki kelime var; ağırlık yine de tablonun en yükseği. Kelimeleri sırayla işleyen eski modeller burada zorlanıyordu.

*Ne oluyor?* Bir cümleyi anlamak için her kelime, ötekilerden hangilerine “dikkat etmesi” gerektiğine karar verir. Renk ne kadar koyuysa iki kelime arasındaki bağ o kadar güçlü demektir. Böylece “o korkmuştu” derken “o”nun kediyi kastettiği ortaya çıkar.

*Kendin dene.* 1) Her satırın toplamını kontrol et; hepsi 1.00 mu? 2) Cümle “Kedi kaçtı çünkü köpek korkmuştu.” olsaydı, “korkmuştu” satırının en koyu hücresi nereye kayardı? Sebebini yaz. 3) “çünkü” sütunundaki ağırlıklar neden bu kadar düşük? Bir bağlacın anlam yükü hakkında bu ne söylüyor? Canlı demo: [QR 5.3]

#### Teknik derinlik

Öz-dikkat (self-attention) her token için sorgu (Q), anahtar (K) ve değer (V) vektörleri üretir; ağırlıklar softmax(Q·Kᵀ/√d) ile hesaplanır ve çıktı bu ağırlıklarla V’lerin toplamıdır. Böylece her konum, tüm diziye uzaklıktan bağımsız erişebilir.

Transformer bunu çok-başlı (multi-head) yapar: farklı “başlar” farklı ilişki türlerini (sözdizimi, eş-gönderim, vb.) yakalar. Konumsal kodlama (positional encoding) sıra bilgisini ekler. Maliyet dizi uzunluğunda O(n²)’dir; bağlam penceresi sınırının ana nedeni de budur.

Renk ne kadar koyuysa bağ o kadar güçlü; böylece “o” gibi bir kelimenin neyi kastettiği çözülür.

Şekil 5.3’teki her satır bir softmax çıktısıdır: ağırlıklar 0 ile 1 arasında, toplamı 1. “o” konumunun çıktısı bu ağırlıklarla değer vektörlerinin toplamıdır: 0.55·V(Kedi) + 0.10·V(kaçtı) + 0.05·V(çünkü) + 0.20·V(o) + 0.10·V(korkmuştu). “o”nun yeni temsili böylece, yarısından fazlası “Kedi”den gelen bir karışım olur. Tablodaki asimetri de buradan çıkar: her satır kendi sorgusuyla hesaplanır, Q·Kᵀ simetrik bir matris değildir.

Her kelime kime bakacağını biliyor. Bu bakışlardan, henüz yazılmamış bir sonraki kelime nasıl doğar?

### 5.5 Dil modeli: bir sonraki kelimeyi tahmin et

Şu oyunu bilirsin: Biri “Ayağını yorganına göre...” der, sen “uzat!” diye tamamlarsın. Garip gelecek ama bir dil modelinin tek işi budur: Metne bakıp en olası bir sonraki kelimeyi (token) tahmin etmek. Tahminini metne ekler, yeniden tahmin eder. Bu minik oyunu binlerce kez oynayarak koca paragraflar yazar.

Şekil 5.4’te modelin her adımda hangi kelimeleri hangi olasılıkla düşündüğüne ve cümleyi nasıl kurduğuna bak. İki “yaratıcılık” (sıcaklık) sırasını da karşılaştır: hep en olası kelimeyi mi seçsin, yoksa biraz risk mi alsın?

> **Kenar notu.** “Anlıyor mu, yoksa tahmin mi ediyor?” Bir bakıma ikisi de doğru: anlamı bir ölçüde yakalamadan bu kadar tutarlı tahmin yapamazdı. Ama özünde yaptığı şey, bir sonraki token’ı kestirmek.

**Şekil 5.4 · Kelime kelime üret**
![Şekil 5.4](../../figures/out/tr/sekil-5-4-generate.svg)

*Kurulum.* Şekil bir film şeridi: üç kare, üç üretim adımı. Başlangıç metni “Yapay zekâ”. Her karede model dört aday kelime ve her birine verdiği olasılığı gösteriyor; çubuğun uzunluğu olasılıkla orantılı. Şeridin üst sırası düşük yaratıcılık (sıcaklık), alt sırası yüksek yaratıcılık. İki sıra aynı adaylardan iki farklı cümle kuruyor.

*Adım adım.* Üç adımın aday listeleri:

| Adım | Adaylar ve olasılıklar |
|---|---|
| 1 | çok %42 · artık %28 · bugün %18 · giderek %12 |
| 2 | hızlı %38 · güçlü %30 · yaygın %20 · akıllı %12 |
| 3 | gelişiyor %50 · ilerliyor %25 · yayılıyor %15 · büyüyor %10 |

Düşük yaratıcılıkta model her adımda en olası adayı alıyor:

1. “çok” (%42) → “Yapay zekâ çok”
2. “hızlı” (%38) → “Yapay zekâ çok hızlı”
3. “gelişiyor” (%50) → “Yapay zekâ çok hızlı gelişiyor.”

Yüksek yaratıcılıkta şekil, anlatımı sade tutmak için her adımda ikinci adayı seçiyor:

1. “artık” (%28) → “Yapay zekâ artık”
2. “güçlü” (%30) → “Yapay zekâ artık güçlü”
3. “ilerliyor” (%25) → “Yapay zekâ artık güçlü ilerliyor.”

İki cümle de dilbilgisi olarak düzgün; ikincisi daha az beklenen bir yoldan gidiyor. Gerçek bir model örnekleme açıkken zar atar: bu olasılıklarla yüzde 42’lik adayı yüz denemenin yaklaşık kırk ikisinde, yüzde 12’lik adayı on ikisinde seçer. Sıcaklık yükseldikçe zarın yüzleri birbirine yaklaşır. Aynı başlangıçla her seferinde farklı bir cümle çıkabilir. Düşük sıcaklıkta zar yok; sonuç her seferinde aynı.

Her adımın olasılıkları dört adaya dağılmış ve toplamı yüzde yüz. Gerçekte model bu dağılımı on binlerce token üzerinde kurar; dört aday, listenin yalnız tepesidir. Her seçim bir sonraki adımın sorusunu değiştirir: “çok”tan sonra “hızlı” olası, “artık”tan sonra da olası; ama gerçek bir modelde ikinci adımın listesi birinci adımın seçimine göre yeniden hesaplanır.

*Ne oluyor?* Model her adımda “şimdiye kadarki metinden sonra en olası kelime ne?” diye düşünür, birini seçip cümleye ekler ve baştan sorar. “Yaratıcılık” (sıcaklık) düşükse hep en olası kelimeyi seçer; kararlı ama tahmin edilebilir olur. Yükseldikçe daha çeşitli, sürprizli seçimler yapar.

*Kendin dene.* 1) Model her adımda üçüncü adayı seçseydi cümle ne olurdu? 2) Düşük yaratıcılık cümlesinin olasılık çarpımını hesapla: 0.42 × 0.38 × 0.50. Aynı hesabı yüksek yaratıcılık cümlesi için yap; hangisi kaç kat daha olası? 3) Üç adımdan hangisinde model en “kararsız”? En olası adayın payına bak. Canlı demo: [QR 5.4]

#### Teknik derinlik

LLM’ler otoregresiftir: P(tokenₜ | token₁…tokenₜ₋₁) dağılımını üretir, softmax ile olasılığa çevirir ve bir token seçip diziye ekler. Greedy (argmax) en olasıyı seçer; örnekleme (sampling) dağılımdan çeker.

Sıcaklık (temperature) dağılımı keskinleştirir/yumuşatır: düşük sıcaklık daha kararlı/tekrarlı, yüksek sıcaklık daha çeşitli/riskli çıktı verir (top-k / top-p ile birlikte). Şekil 5.4’teki olasılıklar örnek değerlerdir; gerçek model sözlüğün tamamı üzerinde bir dağılım üretir.

Düşük sıcaklık → greedy (en olası, argmax); yüksek sıcaklık → örnekleme (olasılığa göre daha çeşitli/riskli seçim).

Sıcaklık T, softmax’tan önce model puanlarını böler: pᵢ = exp(zᵢ/T) / Σⱼ exp(zⱼ/T). T küçüldükçe dağılım tek adaya sıkışır ve seçim argmax’a yaklaşır; T büyüdükçe dağılım düzleşir, yüzde 12’lik “giderek” bile makul bir şans kazanır. Şekil 5.4’ün yüksek sıcaklık sırasında hep ikinci adayın seçilmesi bir anlatım kolaylığıdır; gerçek örnekleme bu dağılımdan rastgele çeker. Bir cümlenin olasılığı adımların çarpımıdır: P(çok, hızlı, gelişiyor) = 0.42 × 0.38 × 0.50 ≈ 0.08.

Model her adımda olasılık dağıtmayı biliyor. Bu olasılıkları nereden öğrendi? Üç aşamalı bir eğitimden.

### 5.6 Bir model nasıl yetişir: eğitim hattı

Bir sohbet asistanı da çocuk gibi yetişir; üç okuldan geçer. Önce devasa metinlerle “ön eğitim” görür: Dili ve dünyayı orada öğrenir. Sonra “ince ayar” okulunda soruya cevap vermeyi, talimata uymayı öğrenir. En son “insan geri bildirimiyle hizalama” gelir: Orada da yardımcı, dürüst ve güvenli olmayı, yani görgüyü öğrenir.

Şekil 5.5’teki üç aşamaya tek tek bak ve aynı soruya modelin her aşamadan sonra nasıl farklı cevap verdiğini gör.

> **Kenar notu.** Ön eğitim modele “ne bildiğini”, ince ayar ve RLHF ise “nasıl davranacağını” kazandırır. Aynı bilgi, çok farklı tonlarda sunulabilir.

**Şekil 5.5 · Üç aşamada bir asistan**
![Şekil 5.5](../../figures/out/tr/sekil-5-5-train.svg)

*Kurulum.* Şekil üç sütunlu bir tablo; her sütun bir eğitim aşaması. Her aşama için dört satır var: modelin gördüğü veri, öğrendiği şey, aynı başkent sorusuna verdiği örnek cevap ve kısa bir not. Soru üç sütunda da aynı; değişen yalnız cevabın biçimi.

*Adım adım.* Üç aşamayı yan yana koy:

| | 1 · Ön eğitim | 2 · İnce ayar | 3 · RLHF / hizalama |
|---|---|---|---|
| Veri | Devasa internet metni | Talimat–cevap çiftleri | İnsan tercihleri (ödül modeli) |
| Öğrendiği | Dili ve dünyayı (bir sonraki kelimeyi tahmin) | Yönergeyi izlemeyi (soruyu cevaplamayı) | Yardımcı, dürüst ve güvenli olmayı |
| Örnek çıktı | “Türkiye’nin başkenti Ankara’dır ve nüfusu yaklaşık altı milyondur. Bu şehir...” | “Türkiye’nin başkenti Ankara’dır.” | “Türkiye’nin başkenti Ankara’dır. İstersen şehir hakkında birkaç ilginç bilgi de paylaşabilirim.” |
| Not | Ham model “tamamlayıcı”dır: soruyu cevaplamaz, metni sürdürür. | Artık soruyu doğrudan, derli toplu cevaplıyor. | Aynı bilgi; ama daha yardımcı, kibar ve hizalı bir tonla. |

1. Ön eğitim: cevap doğru bilgiyle başlıyor ama durmuyor. Nüfus ekliyor, “Bu şehir...” diye sürüyor. Model kendisine soru sorulduğunu bilmiyor; internetteki bir ansiklopedi sayfasını sürdürür gibi yazıyor. Bilgi var, görgü yok.
2. İnce ayar: aynı bilgi, tek cümle. Model artık “soru geldi, cevap ver, dur” kalıbını binlerce talimat–cevap çiftinden öğrenmiş.
3. RLHF / hizalama: cevap yine aynı, üstüne bir teklif: daha fazla bilgi ister misin? İnsanlara iki cevap gösterilip “hangisi daha iyi?” diye sorulmuş; model tercih edilen tona doğru ayarlanmış.

Üç sütunda değişmeyen tek şey bilgi: Ankara. Değişen, bilginin sunuluşu. Sıra da önemli: birinci aşama olmadan ikincinin işleyeceği bilgi yok; ikinci olmadan üçüncünün inceltecek davranışı yok.

*Ne oluyor?* Bir asistan üç aşamada yetişir. Önce devasa metinlerle “ön eğitim”de dili ve dünyayı öğrenir. Sonra “ince ayar”da örnek soru–cevaplarla talimat izlemeyi öğrenir. En sonda insan tercihleriyle “hizalanır”: yardımcı, dürüst ve güvenli bir tonda cevap vermeyi öğrenir. Aynı bilgi, her aşamada daha kullanışlı sunulur.

*Kendin dene.* 1) Soru “Su kaç derecede kaynar?” olsaydı, birinci aşama modelinin çıktısını bir cümleyle tahmin et; ikinci aşamanınkini de yaz. 2) Üçüncü aşamada insanlara “yanlış ama kibar” ile “doğru ama kaba” iki cevap gösterilse hangisi tercih edilmeli? Hizalamanın üç hedefi (yardımcı, dürüst, güvenli) buna nasıl karar verir? 3) Tablodaki hangi satır “ne bildiği” ile “nasıl davrandığı” ayrımını en açık gösteriyor? Canlı demo: [QR 5.5]

#### Teknik derinlik

1) Ön eğitim (pretraining): büyük derlem üzerinde öz-denetimli bir sonraki-token hedefiyle dilin istatistiğini öğrenir. 2) Denetimli ince ayar (SFT): talimat–cevap çiftleriyle yönergeyi izlemeyi öğrenir. 3) RLHF/tercih hizalaması: insan tercihleriyle bir ödül modeli eğitilir ve politika (ör. PPO ya da DPO) bu sinyale göre güncellenir.

Sonuç: ham “metin tamamlayıcı”dan yardımcı, dürüst ve görece güvenli bir asistana geçiş. Hizalama mükemmel değildir; jailbreak, ödül oyunlama (reward hacking) ve dağıtım kayması gibi açık sorunlar sürer.

Üç aşamanın sırası sabittir: öz-denetimli ön eğitim → denetimli ince ayar (SFT) → tercih hizalaması (RLHF/DPO).

Üç aşamanın hedefleri birbirinden farklıdır. Ön eğitimde kayıp, bir sonraki token’ın olasılığına dayanır: L = −Σₜ log P(tokenₜ | token₁…tokenₜ₋₁). Şekil 5.5’teki birinci sütun bu hedefin doğal çıktısıdır; metni sürdürmek bu kaybı düşüren davranıştır. SFT aynı kaybı, yalnız cevap kısmında ve seçilmiş çiftlerde uygular. Hizalama aşamasında hedef bir ödül sinyalidir; ödül modeli iki cevaptan hangisinin tercih edildiğini kestirir, politika bu kestirimi yükseltecek yönde güncellenir.

Metin üreten modelin yetişme yolu böyle. Görsel üreten modeller ise saf gürültüden yola çıkar.

### 5.7 Görsel üretimi: difüzyon

Görsel üreten modeller bambaşka bir fikre dayanır: difüzyon. Buğulu bir cam düşün; arkasındaki resim seçilmiyor. Şimdi camı yavaş yavaş sil: Resim adım adım beliriyor. Difüzyon modeli bu silme işini öğrenir; yalnız o, işe tamamen karıncalı bir ekranla (saf gürültüyle) başlar ve her adımda biraz temizleyerek görüntüyü ortaya çıkarır.

Şekil 5.6’daki kareleri soldan sağa izle: sağa gittikçe model gürültüyü temizliyor ve görsel yavaş yavaş beliriyor.

> **Kenar notu.** Difüzyon “heykeltıraş” gibi çalışır: önünde bir mermer (gürültü) bloğu vardır, fazlalığı adım adım yontarak şekli ortaya çıkarır. GAN’lara göre daha kararlı eğitilir.

**Şekil 5.6 · Gürültüden görsele**
![Şekil 5.6](../../figures/out/tr/sekil-5-6-diffuse.svg)

*Kurulum.* Şekil dokuz kareden oluşan bir film şeridi. Her kare 8 × 8, 64 pikselden oluşan minik bir tuval. Soldaki ilk kare tamamen gürültü: koyu ve açık gri pikseller rastgele dağılmış. Sağdaki son karede 40 turuncu pikselden oluşan bir kalp var, kalan 24 piksel açık renk. Aradaki yedi karede model her adımda birkaç piksel daha “çözüyor”. Her karenin altında temizlenen pay yüzde olarak ve çözülen piksel sayısı (ör. 6/64) yazıyor. Şeridin üst kenarında “ters süreç (üretim): gürültüden şekle”, alt kenarında “ileri süreç (eğitim): şekle gürültü ekleme” yazar.

*Adım adım.* Her kare bir adım:

| Adım | Temizlenen pay | Çözülen piksel (64’te) | Görünen kalp pikseli | Karede görünen |
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

Gerçek bir difüzyon modeli piksel açmaz. Her adımda görüntünün tamamındaki gürültüyü biraz azaltır; bütün pikseller aynı anda, yavaş yavaş netleşir. Adım sayısı da 8 değil, onlarca ya da yüzlercedir. Bu şerit fikri anlatmak için basitleştirilmiş: gürültü azalır, şekil belirir.

*Ne oluyor?* Difüzyon, karlı bir TV ekranını (saf gürültü) adım adım temizleyip içinden bir görsel çıkarmaya benzer. Model “bu gürültünün altında ne olabilir?” diye tahmin ederek her adımda biraz daha netleştirir. Karelerde sağa gittikçe gürültü azalır ve şekil (bir kalp) belirir.

*Kendin dene.* 1) Son karede 64 pikselin 40’ı turuncu. Adım 4’te 29 piksel çözülmüşse ve pikseller rastgele açılıyorsa, bunların yaklaşık kaçının turuncu olmasını beklersin? 2) Adım sayısı 8 yerine 16 olsaydı, her adımda temizlenen pay yüzde kaç olurdu? 3) Teknik metindeki “ileri süreç” şeridin hangi yönünde okunur, “ters süreç” hangi yönünde? Canlı demo: [QR 5.6]

#### Teknik derinlik

Difüzyon iki süreçten oluşur. İleri süreç: bir görsele kademeli Gauss gürültüsü eklenir (sabit, öğrenmesiz). Ters süreç: bir sinir ağı her adımda eklenen gürültüyü kestirip çıkararak örneği temizler (denoising); böylece gürültüden veri dağılımına ulaşılır.

Metinden-görsele üretimde, üretim bir metin gömüsüyle koşullandırılır (genelde CLIP benzeri) ve hız için latent uzayda yapılır (latent diffusion). Şekil 5.6 yalnız fikri anlatır; gerçek modeller öğrenilmiş bir gürültü-kestirim ağı kullanır.

Eğitimde ileri süreç, üretimde ters süreç çalışır; ağ yalnız ters süreci öğrenir.

İleri süreçte t. adımda görüntü xₜ = √(1 − βₜ)·xₜ₋₁ + √βₜ·ε olarak bozulur; ε standart Gauss gürültüsü, βₜ küçük bir gürültü payıdır. Ağ, xₜ ve t verildiğinde eklenen ε’yi kestirmeyi öğrenir; eğitim kaybı kestirim ile gerçek gürültü arasındaki kare farktır: ‖ε − ε_θ(xₜ, t)‖². Üretimde ters yönde gidilir: x_T saf gürültüden başlanır, her adımda kestirilen gürültü çıkarılır, x₀’a ulaşılır. Şekil 5.6’daki “çözülen piksel” sayacı bu kestirimin kabalaştırılmış bir karşılığıdır.

Metin de görsel de üretilebiliyor. Şimdi sınırlar: bu modeller nerede yanılır, nerede tıkanır?

### 5.8 Sınırlar: halüsinasyon, bağlam ve maliyet

Bu modeller etkileyici ama kusursuz değil. En ünlü kusurları halüsinasyon: Model, hiç bozuntuya vermeden, kulağa doğru gelen ama yanlış bir bilgi anlatabilir. Çünkü işi doğruyu bilmek değil, “olası devamı” üretmek. Bir diğer sınır da bağlam penceresi: Modelin elinde küçük bir not defteri vardır; aynı anda ancak o kadar token tutar. Defter dolunca en eski satırlar silinir.

Bağlam penceresini aşağıda kendin dene: kelime ekledikçe pencere dolar ve sınırı aşan en eski kelimeler “unutulur”. Uzun belgelerin neden kırpıldığını ya da özetlendiğini burada görebilirsin.

> **Kenar notu.** Altın kural: bir LLM’i “her şeyi bilen kâhin” değil, “çok akıcı ama bazen yanılan bir stajyer” gibi düşün. Önemli bilgileri her zaman doğrula.

**Şekil 5.7 · Bağlam penceresi**
![Şekil 5.7](../../figures/out/tr/sekil-5-7-ctx.svg)

*Kurulum.* Şekil, on iki kelimelik bir cümlenin sekiz kelimelik bir pencereden geçişini gösteriyor: “Yapay zekâ modelleri metni sınırlı bir pencerede tutar ve eskiyi zamanla unutur.” Pencere en fazla 8 kelime tutuyor. Şeritteki yedi kare, cümlenin 0, 1, 4, 8, 9, 10 ve 12 kelimelik hâlleri; turuncu çizgi modelin gördüğü pencereyi, son sekiz kelimeyi çevreler. Koyu çerçeveli kelimeler pencerede; soluk olanlar pencereden düşmüş, unutulmuş.

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

Gerçek ölçek çok daha büyük: bu pencere 8 kelime; gerçek modellerde binlerce, bazılarında milyonlarca token. Fikir aynı. Sınır var ve dolunca bir şey dışarı düşer. Uzun bir sohbette asistanın en başta söylediklerini unutması bu yüzden. Halüsinasyonla bağı da burada: pencereden düşen bilginin yerine model “olası devamı” üretir. Boşluk dolar, ama doğru bilgiyle dolduğunun garantisi yoktur.

*Ne oluyor?* Modelin bir “kısa süreli hafızası” var ve aynı anda yalnızca belli sayıda kelimeyi tutabilir. Yeni kelime ekledikçe pencere dolar; sınırı aşınca en eski kelimeler dışarı düşer, yani “unutulur”. Bu yüzden çok uzun belgeler ya kırpılır ya da özetlenerek modele verilir.

*Kendin dene.* 1) Pencere 8 yerine 5 kelime olsaydı, 12. kelime eklendiğinde kaç kelime unutulmuş olurdu? Pencerede kalanları yaz. 2) Şekil 5.1’deki bölücüyle bu on iki kelimelik cümle kaç token eder? Pencere kelime yerine token sayıyor olsaydı kaçıncı kelimede dolardı? 3) Yirmi sayfalık bir belgeyi bu penceredeki modele vermek istesen, bölümdeki iki çözümden (kırpma, özetleme) hangisini seçerdin, neden? Canlı demo: [QR 5.7]

#### Teknik derinlik

Halüsinasyon, modelin olasılıksal üretiminin doğal bir sonucudur; doğruluk garantisi yoktur. Azaltma yolları: kaynak temelli üretim (RAG), araç/doğrulama kullanımı ve daha iyi hizalama (Bölüm 6’da). Bağlam penceresi sabit bir token sınırıdır; dikkat maliyeti O(n²) olduğundan pencereyi büyütmek pahalıdır.

Diğer sınırlar: bilgi kesim tarihi (knowledge cutoff), önyargı (eğitim verisinden miras), kararsızlık/yeniden üretilemezlik (örnekleme), ve hesaplama/enerji maliyeti. Bu sınırları bilmek, bu araçları sorumlu ve etkili kullanmanın ön koşuludur.

Model aynı anda yalnızca son N token’ı “hatırlar”; pencere dolunca en eskiler dışarı düşer, uzun belgeler bu yüzden kırpılır ya da özetlenir.

Şekil 5.7’deki pencere kayan bir kuyruktur: n kelime eklendiğinde unutulan sayısı max(0, n − N), N = 8. Gerçek modellerde birim kelime değil token’dır; Şekil 5.1’deki kuralla aynı cümle 19 token eder; pencere kelime saymaya göre yaklaşık 1.6 kat hızlı dolar: kelime sayarken 8., token sayarken 5. kelimede. O(n²) maliyetinin kaynağı Şekil 5.3’teki ısı tablosu: n token için n × n hücre; pencere 8’den 16’ya çıkınca hücre sayısı 64’ten 256’ya, dört katına çıkar.

Token, gömü, dikkat, üretim, eğitim, difüzyon, sınırlar: bölüm bu kadar. Ne kaldığına bak.

### 5.9 Kendini test et

*Cevaplar kitabın sonunda.*

1. Token nedir?
   a) Bir tür sinir ağı
   b) Modelin ağırlığı
   c) Bir GPU çekirdeği
   d) Metnin model tarafından işlenen küçük parçası

2. Gömü (embedding) uzayında ne doğrudur?
   a) Anlamca benzer kelimeler birbirine yakın olur
   b) Her kelime aynı noktadadır
   c) Kelimeler rastgele dağılır
   d) Yalnızca sayılar saklanır, anlam yoktur

3. Dikkat (attention) mekanizması ne sağlar?
   a) Her kelimenin diğer kelimelere ağırlıklı “bakması”
   b) Görüntüleri büyütmek
   c) Veriyi silmek
   d) Modeli yavaşlatmak

4. Bir LLM özünde ne yapar?
   a) Kuralları elle uygular
   b) Veritabanı sorgular
   c) Bir sonraki token’ı tahmin eder
   d) İnterneti arar

5. Eğitim hattının doğru sırası?
   a) Ön eğitim → ince ayar → RLHF
   b) RLHF → ön eğitim → ince ayar
   c) Yalnızca ön eğitim
   d) İnce ayar → ön eğitim → RLHF

6. Difüzyon modeli görseli nasıl üretir?
   a) İnternetten indirerek
   b) Tek seferde kopyalayarak
   c) Pikselleri rastgele bırakarak
   d) Gürültüden başlayıp adım adım temizleyerek

7. Halüsinasyon nedir?
   a) Daha hızlı çalışması
   b) Modelin emin tonda yanlış bilgi üretmesi
   c) Modelin çökmesi
   d) Görüntü üretmesi

8. Bağlam penceresi neyi sınırlar?
   a) Ekran çözünürlüğünü
   b) Modelin aynı anda dikkate aldığı token sayısını
   c) İnternet hızını
   d) Disk boyutunu

### Bu bölümden kalanlar

- Bir dil modeli metni harf ya da kelime olarak değil, token denen küçük parçalar olarak okur; uzun ve nadir kelimeler daha çok token tutar.
- Gömü, her token’ı bir haritadaki adrese çevirir; anlamca yakın kelimeler o haritada da yan yana durur.
- Dikkat mekanizmasıyla her kelime, cümledeki ötekilere ağırlık dağıtır; “o” zamiri böylece kediye bakmayı öğrenir.
- Bir dil modeli her adımda bir sonraki token’ı tahmin eder; sıcaklık, hep en olasıyı mı yoksa bazen daha az olasıyı mı seçeceğini belirler.
- Asistan üç aşamada yetişir: ön eğitim bilgiyi, ince ayar talimat izlemeyi, hizalama yardımcı ve güvenli tonu verir.
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
-->

<!-- REDAKSİYON NOTLARI
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
