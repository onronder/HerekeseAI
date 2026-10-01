# Bölüm 2
## Kuralların Çağı
*Öğrenmeden önce: elle yazılan zekâ*

<!-- acc #bb4d17 · tag Klasik YZ -->

### 2.1 Kuralların çağı

Bugün yapay zekâ deyince verilerden öğrenen sistemleri düşünüyoruz. Oysa hikâyenin ilk büyük bölümü tam tersiydi: o çağın ustaları makineye dünyayı ezberletmeye çalıştı. Akıllı davranması için ne gerekiyorsa (bütün bilgileri, bütün kuralları) tek tek elle yazdılar.

Bu yaklaşıma “klasik” ya da “sembolik” YZ denir. Mantık, kurallar, arama ve uzman sistemler o çağın alet çantasıydı. Şimdi o çağa konuk oluyoruz: nasıl çalışıyordu, neleri başardı, neden bir gün tosladı? Hepsini kendin deneyeceksin.

> **Kenar notu.** İlk YZ’ciler şöyle düşünüyordu: “Yeterince kural yazarsak, makine akıllı olur.” Bu fikir bazı işlerde çok iyi çalıştı, bazılarında ise hiç.

#### Teknik derinlik

Klasik YZ (sembolik YZ ya da GOFAI, açılımıyla “Good Old-Fashioned AI”), zekâyı biçimsel sembollerin kural-tabanlı manipülasyonu olarak ele alır. Temel varsayım: dünya hakkındaki bilgi açıkça temsil edilebilir ve akıl yürütme, bu temsiller üzerinde mantıksal işlemlerle yürütülebilir.

Bu paradigma 1950’lerden 1980’lere kadar baskındı ve mantık programlama, arama algoritmaları ve uzman sistemler gibi güçlü araçlar üretti. Bu bölüm bu araçları kurar; sonunda “bilgi edinme darboğazı” ve kırılganlık sorunlarının, zaten araştırılmakta olan öğrenmeye dayalı yaklaşımlara (Bölüm 3) ilgiyi neden artırdığını gösterir.

İlk soru en temeli: bir makine Tekir’in kedi olduğunu nereden bilir?

### 2.2 Bilgiyi sembollerle temsil etmek

Bir makineye Tekir’i nasıl öğretirsin? Makine onu göremez, okşayamaz; ancak senin yazdığın cümlelerden tanır: “Tekir bir kedidir”, “kedi bir memelidir”, “memeli bir hayvandır”. Klasik YZ bilgiyi böyle saklar: açık semboller ve aralarındaki bağlar.

İşin güzel yanı, makinenin bu bağları izleyip kimsenin söylemediği bilgiye kendisinin ulaşması. “Tekir bir hayvandır” cümlesini hiç duymadı; ama zinciri halka halka izleyince bunu kendisi bulur. Şekil 2.1’de dört soru var; makinenin düşünüşünü orada adım adım oku.

> **Kenar notu.** Sembolik YZ’nin gücü: az sayıda kuraldan çok sayıda yeni bilgi türetebilir. Zayıflığı: önce o kuralları birinin yazması gerekir.

**Şekil 2.1 · Bilgi zinciriyle çıkarım**
![Şekil 2.1](../../figures/out/tr/sekil-2-1-chain.svg)

*Kurulum.* Şekilde beş kutu tek sıra hâlinde dizili: Tekir, Kedi, Memeli, Hayvan, Canlı. Kutular arasındaki her ok “bir …dır” demek: Tekir bir Kedi’dir, Kedi bir Memeli’dir ve böyle sürer. İlk ok bir bireyi sınıfına bağlar: Tekir, Kedi sınıfının bir örneği. Öbür oklar sınıfı üst sınıfa bağlar: Kedi, Memeli’nin alt sınıfı. Şekil ikisini de aynı okla gösterir. Makinenin bütün bilgisi bu dört ok; başka hiçbir şey bilmiyor. Altta dört soru var; her soru için makine zinciri baştan yürür ve kararını söyler.

*Adım adım.* Önce “Tekir bir Memeli mi?” sorusu.

1. Makine Tekir’den başlar. Aradığı kelime “Memeli”. Tekir’in kendisi Memeli mi? Hayır; ama Tekir’den bir ok çıkıyor: Kedi.
2. Kedi’ye geçer. Kedi, “Memeli” mi? Hayır; Kedi’den de bir ok çıkıyor: Memeli.
3. Memeli’ye varır. Aranan kelime bulundu. Şekilde ilk üç kutu turuncuya boyanır ve karar yazılır: ✓ Evet: “Memeli” zincirde bulundu (geçişlilik).

İki ok izledi. “Tekir bir Memeli’dir” cümlesini kimse yazmadı; makine onu türetti.

Sonra “Tekir bir Bitki mi?” sorusu.

1. Tekir: Bitki değil; ok Kedi’ye.
2. Kedi: değil; ok Memeli’ye.
3. Memeli: değil; ok Hayvan’a.
4. Hayvan: değil; ok Canlı’ya.
5. Canlı: değil. Canlı’dan çıkan ok yok, zincir bitti. Karar: ✗ Bilinmiyor: “Bitki” bilgi tabanında yok.

Dört sorunun tamamı:

| Soru | İzlenen ok | Karar |
|---|---|---|
| Tekir bir Hayvan mı? | 3 | Evet |
| Tekir bir Memeli mi? | 2 | Evet |
| Tekir bir Bitki mi? | 4, zincir bitti | Bilinmiyor |
| Tekir bir Taş mı? | 4, zincir bitti | Bilinmiyor |

Karar “Hayır” değil, “Bilinmiyor”. Makine Tekir’in bitki olmadığını iddia etmiyor; yalnızca elindeki oklarla bu bilgiye ulaşamadığını söylüyor. Bilmediği konuda susmak sembolik sistemlerin iyi huyudur.

*Ne oluyor?* Makine yalnızca “kim kimin türü” bilgisini tutuyor: Tekir bir kedi, kedi bir memeli... Sorunca zinciri halka halka izliyor ve kimsenin ona söylemediği bir bilgiye kendisi ulaşıyor. Zincirde yoksa da “bilinmiyor” diyor.

*Kendin dene.* 1) Zincirin sonuna bir ok daha ekle: Canlı bir Varlık’tır. “Tekir bir Varlık mı?” sorusuna makine ne der, kaç ok izler? 2) Soruyu ters çevir: “Kedi bir Tekir mi?” Oklar tek yönlü; makine ne cevaplar? Bu cevap sence doğru mu? 3) Makineye “Tekir bir Bitki değildir” dedirtmek için bilgi tabanına ne eklemek gerekirdi? Canlı demo: [QR 2.1]

#### Teknik derinlik

Sembolik YZ’de bilgi, bilgi temsili (knowledge representation) ile kodlanır: semantik ağlar, çerçeveler (frames), ontolojiler ya da mantık önermeleri. Varlıklar ve aralarındaki ilişkiler (ör. is-a, has-a) açıkça tanımlanır.

Çıkarım (inference), bu temsiller üzerinde kuralların uygulanmasıdır. Şekil 2.1’deki gösterim bir is-a hiyerarşisinde geçişliliği (transitivity) kullanır. Ontolojide iki bağ ayrılır: Tekir, Kedi sınıfının bir örneğidir (instance-of); Kedi, Memeli sınıfının alt sınıfıdır (subclass-of). “Tekir instance-of Kedi” ve “Kedi subclass-of Memeli” ise “Tekir instance-of Memeli” türetilir; bu nedenle Tekir bir memelidir. Şekil iki bağı da tek ok türüyle, “bir …dır” diye gösterir. Sembolik akıl yürütmenin özü budur.

Bilgi tabanı yalnızca ardışık “is-a” (bir …dır) bağlarını içerir. Hedef zincirde varsa “Evet”, yoksa “Bilinmiyor”.

Geçişlilik kuralı sınıflar arasında biçimsel olarak şöyle yazılır: subclass-of(A, B) ∧ subclass-of(B, C) → subclass-of(A, C). Örnek için: instance-of(a, B) ∧ subclass-of(B, C) → instance-of(a, C). Motor bu kuralı zincir boyunca tekrar tekrar uygular; beş düğümlük zincirde en fazla dört adımda ya hedefe ulaşır ya da zincirin sonuna gelir.

Zincir yalnızca “bir …dır” bağlarını izledi. Makine bildiğinden eyleme nasıl geçer, yağmur yağıyorsa ne yapmalı? Bunun için “eğer … ise” kuralları gerekiyor.

### 2.3 Eğer... ise...: kurallar ve uzman sistemler

Klasik YZ’nin kalbi küçücük bir cümleyle atar: “EĞER şu doğruysa, O ZAMAN şunu yap.” Buna kural denir. Kuralları üst üste koyunca, bir alanda usta gibi davranan sistemler doğar. Bunlara uzman sistemler denir; bir doktorun bilgisini soru-cevap kurallarına döken çıraklar gibi.

1980’lerde bu çıraklar tıptan mühendisliğe her yerde çalıştı. Aşağıda minik bir tanesi var: koşulları sen aç kapa; hangi kuralın ateşlendiğini, önerinin nasıl doğduğunu Şekil 2.2’de gör.

> **Kenar notu.** Bir kuralın çıktısı başka bir kuralı tetikleyebilir; buna “zincirleme” denir. Sistem böylece tek bir olgudan uzun bir akıl yürütme zinciri kurabilir.

**Şekil 2.2 · Küçük bir uzman sistem**
![Şekil 2.2](../../figures/out/tr/sekil-2-2-expert.svg)

*Kurulum.* Şekilde üstte üç olgu var: “Yağmur yağıyor” açık (✓), “Hava soğuk” ve “Rüzgârlı” kapalı (○). Altında beş kural kartı, R1’den R5’e; her kartın solunda EĞER koşulu, sağında O ZAMAN önerisi. Ateşlenen kart koyulaşır; R5’in yanındaki “zincir” işareti, onun başka bir kurala bağlı olduğunu söyler. En altta ateşlenen kuralların önerileri yan yana dizilir; şeklin alt tablosu üç senaryoyu listeler, aşağıda tek tek açılıyor. Başlangıçta yalnız R1 yanıyor: Şemsiye al.

*Adım adım.* Sistem her seferinde aynı üç işi yapar: açık olgulara bakar, her kuralın EĞER kısmını bu olgularla karşılaştırır, tutanları ateşler. Üç senaryo:

| Senaryo | Açık olgular | Ateşlenen kurallar | Öneri satırı |
|---|---|---|---|
| A (başlangıç) | Yağmur | R1 | Şemsiye al |
| B | Yağmur, Rüzgâr | R1, R5 | Şemsiye al · Dikkat: şemsiye ters dönebilir! |
| C | Soğuk, Rüzgâr | R2, R3 | Mont giy · Atkı tak |

Senaryo A’da yalnız yağmur açık. R1’in koşulu “Yağmur yağıyor”: tutuyor, ateşler. R2 ve R3 soğuk ister, R5 rüzgâr ister; üçü de sessiz. R4 “yağmur YOK” der; yağmur var, o da sessiz.

Senaryo B’de rüzgârı da açtık. R5’in EĞER kısmında bir olgu değil, başka bir kuralın sonucu var: “Şemsiye al” tetiklendi. Bu yüzden motor iki tur döner. Birinci turda R1 ateşler ve çalışma belleğine “şemsiye” notunu düşer. İkinci turda R5 bu notu görür, rüzgârla birleştirir ve ateşler. İki olgudan iki öneri çıktı; ikincisi ilkinin üstüne kurulu, zincirleme dedikleri bu. Yağmuru kapatırsan R1 söner, not düşülmez ve R5 de susar: rüzgâr tek başına yetmez.

Senaryo C’de yağmur kapalı, soğuk ve rüzgâr açık. R1 ve R5 sessiz. Soğuk R2’yi ateşler; soğuk VE rüzgâr R3’ü. R4 yağmur yok diye umutlanır ama “soğuk DEĞİL” koşulu tutmaz; sessiz kalır.

*Ne oluyor?* Sistem, açtığın her koşula bakıp elindeki kurallarla karşılaştırıyor: hangisinin “EĞER” kısmı tutuyorsa o kural ateşleniyor ve önerisini söylüyor. R5’e dikkat: o, başka bir kuralın sonucunu bekliyor. Kurallar birbirine böyle zincirleniyor.

*Kendin dene.* 1) Üç olgu da açık: hangi kurallar ateşler, öneri satırında kaç öneri olur? 2) Yalnız “Rüzgârlı” açık. Sistem ne önerir? Bu öneri sana mantıklı geliyor mu; hangi kural eksik? 3) R5’i yalnızca “Rüzgârlı” koşuluna bağlasaydık ne kaybederdik? Canlı demo: [QR 2.2]

#### Teknik derinlik

Üretim kuralları (production rules) IF-THEN biçimindedir; bir çıkarım motoru (inference engine) çalışma belleğindeki olgularla eşleşen kuralları tetikler. İleri zincirleme (forward chaining) olgulardan sonuçlara, geri zincirleme (backward chaining) hedeften kanıta doğru ilerler.

Uzman sistemler (ör. MYCIN, 1970’ler) bu mimariyi kullandı: bir bilgi tabanı (kurallar) + çıkarım motoru. Şekil 2.2’deki gösterimde bir kuralın ürettiği olgunun başka bir kuralı tetiklemesini (zincirleme) de göreceksin. Sınır: kuralların elle yazılması ve istisnaların patlaması.

R5 zincirlemedir: yalnızca R1 ateşlediyse (şemsiye) ve rüzgâr varsa tetiklenir.

Gösterimin motoru iki geçişlidir. Birinci geçiş yalnızca olgulara bağlı kuralları değerlendirir ve ürettikleri türetilmiş olguları (R1 → şemsiye) çalışma belleğine ekler. İkinci geçiş bütün kuralları bu genişletilmiş bellekle yeniden değerlendirir. Daha uzun zincirler için aynı döngü, yeni olgu üretilmeyene kadar tekrarlanır.

Kurallar ne yapılacağını söylüyor; ama seçenek binlerceyse hangisini önce denemeli? Klasik YZ’nin ikinci aracı bunun için var: arama.

### 2.4 Arama ve sezgisel kısayollar

Labirentte çıkışı bulmak, satrançta hamle seçmek, şehirde rota çizmek... Hepsi aynı oyunun çeşitleri: Önünde bir sürü olasılık var ve içlerinden hedefe götüreni arıyorsun.

En sabırlı yöntem her ihtimali tek tek denemektir ama bu çok yavaş olabilir. Sezgisel yöntem (heuristic) kestirmeden gider: “Hangi yön daha umut verici?” diye tahmin yürütür. Şekil 2.3’te ikisini yarıştırdık: sezgisiz olan her yeri tarar, sezgisel olan burnunu hedefe çevirir.

> **Kenar notu.** Açgözlü sezgisel yöntemler hız kazandırır ama bedeli vardır: bazen en iyi çözümü kaçırabilirler. “Yeterince iyi”yi “mükemmel”e tercih ederler. A* gibi daha dikkatli yöntemler, uygun bir sezgiyle garantiyi geri alır.

**Şekil 2.3 · Yol bulma: sezgisiz vs sezgili**
![Şekil 2.3](../../figures/out/tr/sekil-2-3-grid.svg)

*Kurulum.* Şekilde 8 sütun, 6 satırlık bir ızgara var; 48 karenin 11’i siyah duvar. Sol üst köşede S (başlangıç), sağ alt köşede H (hedef). Duvarlar üç dikey engel oluşturuyor: 3. sütunda üstten dört kare, 5. sütunda alttan dört kare, 7. sütunda ortada üç kare. Bu yüzden düz gitmek imkânsız; yol birinci engeli alttan, ikincisini üstten, üçüncüsünü yine alttan dolaşmak zorunda. İki panel aynı ızgarayı gösteriyor: solda sezgisiz arama, sağda sezgisel arama. Açık turuncu kareler taranmış, koyu turuncu kareler bulunan yol. Her karedeki sayı tarama sırası; S 1’dir.

*Adım adım.* Sezgisiz arama (BFS):

1. S’den başlar, komşularını bir sıraya alır; sıraya ilk giren ilk çıkar.
2. Halka halka yayılır: önce S’ye bir adım uzaktaki kareler, sonra iki adım, sonra üç. Yön bilgisi yok; sol koridoru, alt satırı, orta koridoru aynı sabırla tarar.
3. H sıradan çıktığında durur. Şekildeki sayaç “İncelenen: 36” diyor. 37 boş karenin 36’sı; yalnız 8. sütun, 4. satırdaki kareye el değmedi.
4. Yol geriye doğru okunur: 19 kare (S ve H dâhil), 18 adım. Bu, olabilecek en az adımlı yol; ızgarada her adım aynı bedelde olduğu için en ucuz yol da bu.

Açgözlü sezgisel arama (hedefe):

1. Her kareye bir puan verir: hedefe sokak mesafesi, sütun farkı artı satır farkı. S için 7 + 5 = 12.
2. Sıradan hep en düşük puanlı kareyi çeker. Sol koridordan aşağı iner (puan her adımda düşer), birinci engelin altından geçip 4. sütuna varır.
3. Burada aldanır: alt satırdaki kareler H ile aynı satırda olduğundan puanca yakın görünür. 5. sütun, 6. satırdaki duvar sağa giden yolu kestiği için alt satırı sola doğru dener: 4, 3, 2, 1. sütun, sonra 1. sütun, 5. satır. Beş kare boşa gitti.
4. Puan sırasına göre yukarı döner, 4. sütundan 2. satıra çıkar, 6. sütundan iner, H’ye ulaşır. Şekildeki sayaç “İncelenen: 24” diyor.
5. Yol: yine 19 kare, 18 adım.

| Yöntem | Taranan kare | Yol (kare) |
|---|---|---|
| Sezgisiz (BFS) | 36 | 19 |
| Açgözlü sezgisel (hedefe) | 24 | 19 |

Bu ızgarada açgözlü arama üçte bir daha az kare gezdi ve yine en kısa yolu buldu. Ama bu bir garanti değil, şans: puanı düşük görünen bir çıkmaz onu beş kare oyaladı. Daha sinsi bir labirentte aynı huy onu uzun bir dolambaca da sokabilirdi. BFS’nin 36 karesi, garantinin bedeli. Gidilen yolu da puana katan A*, aynı sezgiyle hem garantiyi hem tasarrufu korur.

*Ne oluyor?* İki arayıcıyı yarıştırıyorsun. Sezgisiz olan her yönü sabırla tarar; her adım aynı bedeldeyse sonunda en az adımlı yolu bulur ama çok kare gezer. Açgözlü sezgisel olan hep hedefe doğru koşar; az kare gezer ama bazen en kısa yolu kaçırır. Hız ile garanti arasındaki takas bu; A* gibi yöntemler gidilen yolu da hesaba katarak garantiyi geri alır.

*Kendin dene.* 1) Sezgisel puanı iki kare için hesapla: 4. sütun, 2. satır ve 1. sütun, 6. satır. Hangisi hedefe daha yakın görünür? Hangisi gerçekten yolun üstünde? 2) S’nin puanı 12, ama en kısa yol 18 adım. Fark nereden geliyor? 3) 5. sütun, 6. satırdaki duvar kaldırılsa en kısa yol kaç adım olur? Canlı demo: [QR 2.3]

#### Teknik derinlik

Pek çok klasik YZ problemi durum-uzayı araması (state-space search) olarak modellenir. Bilgisiz (uninformed) arama, örneğin genişlik-öncelikli arama (BFS), hiçbir yön bilgisi kullanmadan sistematik tarar; tüm kenarların maliyeti eşitse en az adımlı, dolayısıyla en düşük maliyetli yolu garanti eder, ama çok düğüm açar. Farklı kenar maliyetlerinde başka yöntemler gerekir.

Bilgili (informed) arama, bir sezgisel fonksiyon h(n) ile hedefe yakınlığı tahmin eder; açgözlü en-iyi-öncelikli arama yalnızca h’yi kullanır (hızlı ama eniyilik garantisi yok), A* ise g(n)+h(n) kullanır: h kabul edilebilirse (gerçek uzaklığı hiç aşmıyorsa) ağaç aramasında en kısa yolu bulur; graf aramasında ayrıca h’nin tutarlı olması ya da daha iyi bir yolla ulaşılan düğümlerin yeniden açılması gerekir. Şekil 2.3’te BFS ile sezgisel aramanın taradığı hücre sayısını karşılaştır.

BFS (bilgisiz) bir FIFO kuyruğuyla katman katman genişler ve eş-maliyetli ızgarada en kısa yolu garanti eder. Sezgisel (açgözlü en-iyi-öncelikli) arama, hedefe Manhattan uzaklığı h(n)’yi en aza indiren düğümü seçer; çok daha az hücre açar ama en kısa yolu garanti etmez.

Bu ızgarada, sıfırdan başlayan koordinatlarla h(n) = |x − 7| + |y − 5|. Sonuçlar: BFS 36 düğüm açtı, açgözlü arama 24; ikisi de 18 adımlık en kısa yolu buldu. h gerçek uzaklığı hiçbir düğümde aşmadığı için (kabul edilebilir) ve komşu kareler arasında en fazla 1 değiştiği için (tutarlı), aynı h ile A* graf aramasında da en kısa yolu bulur ve genellikle BFS’den az düğüm açar.

Arama, dünyanın kesin olduğunu varsaydı: duvar duvardır, hedef yerinde durur. Yarın yağmur yağacak mı sorusu ise kesin cevap tanımaz.

### 2.5 Belirsizlikle başa çıkmak: olasılık ve Markov

Katı kurallar gerçek dünyada tökezler, çünkü dünya belirsizdir. “Yağmur yağarsa şemsiye al” demesi kolay; peki yağacak mı? Kimse kesin bilemez. Olsa olsa ihtimalini söyleriz.

Klasik YZ buna zarif bir çözüm buldu: durumdan duruma olasılıkla geçmek. Markov zinciri bunun en ünlüsüdür; hileli bir zarla oynanan hava durumu oyunu gibi. Şekil 2.4’ün altındaki tabloda yedi günlük bir örnek var; havanın olasılıklara göre değişimini orada takip et.

> **Kenar notu.** Markov özelliği: “şimdiyi biliyorsan gelecek daha eski geçmişe bağlı değildir; buraya nasıl geldiğin önemli değil.” Basit görünür ama hava durumundan Google aramasına kadar her yerde.

**Şekil 2.4 · Hava durumu Markov zinciri**
![Şekil 2.4](../../figures/out/tr/sekil-2-4-markov.svg)

*Kurulum.* Şekilde üç durum kutusu var: Güneşli, Bulutlu, Yağmurlu; oklarla birbirine bağlı, her okun üstündeki sayı o geçişin yüzdesi. Yanında aynı sayılar geçiş matrisi olarak: satır bugün, sütun yarın; her satırın toplamı 100. Yedi günlük bir zincirin gün gün gidişi aşağıda.

| bugün \ yarın | Güneşli | Bulutlu | Yağmurlu |
|---|---|---|---|
| Güneşli | 70 | 20 | 10 |
| Bulutlu | 30 | 40 | 30 |
| Yağmurlu | 20 | 40 | 40 |

*Adım adım.* Önce hileli zar. Bugün güneşli olsun; tablonun ilk satırı 70 / 20 / 10. Yüz yüzlü bir zar düşün: 1’den 70’e kadar güneş, 71’den 90’a bulut, 91’den 100’e yağmur. Makine 1 ile 100 arasında bir sayı çeker; sayı hangi aralığa düşerse yarın odur. Zar hileli, çünkü güneşten sonra yine güneş gelme payı yüzde 70; yağmur yalnızca yüzde 10.

Sonra yedi günlük bir zincir. Canlı gösterimde sayıları makine rastgele çeker; burada yedi çekilişi biz seçtik ki adımları takip edebilesin. Her satırda önce bugünün aralıklarına bak, sonra çekilen sayıyı yerleştir.

| Gün | Bugün | Aralıklar (G / B / Y) | Çekilen sayı | Yarın |
|---|---|---|---|---|
| 1 | Güneşli | 1–70 / 71–90 / 91–100 | 42 | Güneşli |
| 2 | Güneşli | 1–70 / 71–90 / 91–100 | 83 | Bulutlu |
| 3 | Bulutlu | 1–30 / 31–70 / 71–100 | 55 | Bulutlu |
| 4 | Bulutlu | 1–30 / 31–70 / 71–100 | 91 | Yağmurlu |
| 5 | Yağmurlu | 1–20 / 21–60 / 61–100 | 77 | Yağmurlu |
| 6 | Yağmurlu | 1–20 / 21–60 / 61–100 | 12 | Güneşli |
| 7 | Güneşli | 1–70 / 71–90 / 91–100 | 64 | Güneşli |

Yedi günün sonunda sayaç: 3 güneşli, 2 bulutlu, 2 yağmurlu; dağılım yüzde 43 / 29 / 29. Dördüncü gün yağmura geçerken makine önceki üç güne hiç bakmadı; “bugün bulutlu” bilgisi ve 91 sayısı yetti.

Son olarak uzun vade. Yedi gün az; bu zincirde her durumdan her duruma geçiş mümkün olduğundan yüzlerce gün sonra oranlar, başlangıç ne olursa olsun, sabitlenir. Sabitlenen oranı zar atmadan da bulabilirsin. Uzun vadede güneşli günlerin payı G, bulutluların B, yağmurluların Y olsun. Bir güneşli gün üç yoldan gelir: güneşten sonra (0.7·G), buluttan sonra (0.3·B), yağmurdan sonra (0.2·Y). Oranlar sabitse bu toplam yine G olmalı:

G = 0.7·G + 0.3·B + 0.2·Y  
B = 0.2·G + 0.4·B + 0.4·Y  
Y = 0.1·G + 0.3·B + 0.4·Y, ve G + B + Y = 1.

Çözüm: G = 6/13, B = 4/13, Y = 3/13; yaklaşık yüzde 46 / 31 / 23. Sağlama: 0.7·6 + 0.3·4 + 0.2·3 = 4.2 + 1.2 + 0.6 = 6. Gösterim yeterince uzun çalışınca alttaki dağılım bu sayıların etrafında salınır.

*Ne oluyor?* Yarının havası yalnızca bugüne bakılarak tahmin ediliyor; bugün bilinince dünün önemi kalmıyor. Her gün makine bir zar atıyor ama zar hileli: güneşli bir günden sonra yine güneş gelme ihtimali yüksek. Günler biriktikçe dağılım hep aynı orana oturur.

*Kendin dene.* 1) Bugün yağmurlu, çekilen sayı 35: yarın hava ne? 2) Bugün güneşli. İki gün sonra yağmurlu olma olasılığı kaç? İpucu: yarının üç ihtimalini ayrı ayrı hesapla, topla. 3) Güneşli satırını 90 / 5 / 5 yapsan uzun vadeli dağılım hangi yöne kayar? Önce tahmin et, sonra ilk denklemle kontrol et. Canlı demo: [QR 2.4]

#### Teknik derinlik

Belirsizlik altında akıl yürütmek için olasılıksal modeller kullanılır. Markov zinciri, mevcut durum bilindiğinde bir sonraki durumun daha eski geçmişe bağlı olmadığı (Markov özelliği: mevcut duruma koşullu bağımsızlık) bir stokastik süreçtir; geçişler, her satırının toplamı 1 olan bir olasılık matrisiyle tanımlanır.

Sonlu, indirgenemez ve periyodik olmayan bir zincirin durum dağılımı, başlangıç ne olursa olsun, tek bir kararlı dağılıma (stationary distribution) yakınsar; kararlı dağılımın var olması tek başına yakınsama demek değildir. Bu fikir, gizli Markov modelleri, PageRank ve pekiştirmeli öğrenmedeki Markov karar süreçlerine kadar uzanır. Şekil 2.4’teki gösterimde uzun vadeli dağılımın nasıl oluştuğunu gözlemle.

Geçiş matrisi P sabittir; her yeni gün, P’nin mevcut satırından bir örneklem üretir.

Kararlı dağılım π şu iki denklemin çözümüdür:

πP = π  
Σπᵢ = 1

Bu P için π = (6/13, 4/13, 3/13) ≈ (0.462, 0.308, 0.231). Matrisin her girdisi pozitif olduğundan zincir indirgenemez ve periyodik değildir; üç durumlu sonlu zincir bu yüzden her başlangıçtan aynı π’ye yakınsar. Güneşli başlangıçtan beklenen dağılımın gidişi: 1. gün (0.70, 0.20, 0.10), 2. gün (0.57, 0.26, 0.17), 3. gün (0.51, 0.29, 0.20), 5. gün (0.47, 0.30, 0.23). Yakınsama beş günde büyük ölçüde tamamlanır; gösterimdeki sayaç ise örneklem olduğundan bu değerlerin etrafında dalgalanır.

Olasılık kurallara esneklik kattı; ama tabloyu, kuralları, zinciri hâlâ bir insan elle yazıyor. Bu yükün ne kadar taşınabileceği konusunda YZ’ciler ikiye bölündü.

### 2.6 Düzenliler ve dağınıklar (Neat vs Scruffy)

YZ araştırmacıları yıllarca iki kampa bölündü. “Düzenliler” (neats) her adımın temiz matematikle kanıtlanmasını istedi. “Dağınıklar” (scruffies) ise omuz silkti: “Çalışıyorsa iyidir, teorisini sonra buluruz.”

Bu kavga yalnızca tarih değil; bugün de sürüyor. Aşağıdaki ifadeleri doğru kampa ayır. Sonunda anlaşılacak: klasik YZ neden duvara tosladı ve bu çarpışma, zaten araştırılan bir fikre, makinelerin “öğrenmesine”, ilgiyi nasıl artırdı?

> **Kenar notu.** Klasik YZ’nin dersi: dünyanın tüm kurallarını elle yazmak imkânsız. Çözüm, makineye kuralları biz vermek yerine onları veriden kendisinin bulmasını öğretmek. Sıradaki bölümün konusu bu.

**Şekil 2.5 · Hangi yaklaşım?**
![Şekil 2.5](../../figures/out/tr/sekil-2-5-classify.svg)

*Kurulum.* Şekilde dört ifade kartı alt alta duruyor; her kartın yanında iki seçenek: Düzenli (Neat) ve Dağınık (Scruffy). İşaretini kartın yanına koy; sonra kitabın sonundaki cevaplarla karşılaştır. Kartlar birer slogan gibi kısa; her biri bir araştırmacının ağzından çıkmış olabilecek tek cümle.

*Kendini sına.* Her ifade için kampı seç: Düzenli mi, Dağınık mı?

1. Her şeyi biçimsel mantıkla kanıtla.
2. Çalışan kısayolları kullan, teoriyi sonra düşün.
3. Matematiksel kesinlik şarttır.
4. Gerçek dünya dağınıktır; esnek ol.

Kelimeye değil tutuma bak: konuşan önce doğruluğu mu göstermek istiyor, önce işe yaramasını mı? İlki Düzenli, ikincisi Dağınık. Cevaplar ve gerekçeler kitabın sonunda.

*Ne oluyor?* İki kamp, iki karakter: Düzenliler her adımı matematikle kanıtlamak ister; Dağınıklar “önce çalışsın, teorisi sonra gelir” der. İkisinin de haklı çıktığı yerler var; bugünün yapay zekâsı ikisinin karışımı.

*Kendin dene.* 1) Bu bölümün beş yöntemini iki kampa dağıt: bilgi zinciri, uzman sistem, sezgisiz arama, sezgisel arama, Markov zinciri. Hangisi kesin sonuç vaat ediyor, hangisi “yeterince iyi” ile yetiniyor? 2) Sezgisel puan (Şekil 2.3) hangi kampın icadı? A*’ın ona eklediği garanti onu hangi kampa taşır? 3) Kendi hayatından bir örnek bul: bir işi önce “çalışsın” diye, teorisini sonra düşünerek çözdüğün bir an. Canlı demo: [QR 2.5]

#### Teknik derinlik

“Neat” ve “scruffy” ayrımı (Roger Schank’a atfedilir), YZ’de yöntemsel bir gerilimi tanımlar: biçimsel, kanıtlanabilir, ilkeli yaklaşımlar (neats; mantık ve olasılık kuramı gibi) ile sezgisel, mühendislik-odaklı, ampirik yaklaşımlar (scruffies) arasında.

Klasik sembolik YZ iki temel sınıra çarptı: bilgi edinme darboğazı (tüm kuralları elle yazmak ölçeklenmez) ve kırılganlık (öngörülmeyen durumlarda çökme). Bu sınırlar, zaten araştırılmakta olan öğrenmeye dayalı yöntemlere ilgiyi artırdı; sembolik ve öğrenmeye dayalı yaklaşımlar uzun süre birlikte gelişti (Rosenblatt’ın perceptron’u 1958 tarihlidir). Bilgiyi elle kodlamak yerine veriden öğrenen istatistiksel YZ’ye (Bölüm 3) geçiş böyle hızlandı.

Kavga iki kampı da kısmen haklı çıkardı; nasıl olduğu sıradaki bölümde. Önce altı soru.

### 2.7 Kendini test et

*Cevaplar kitabın sonunda.*
1. Klasik (sembolik) YZ bilgiyi nasıl temsil eder?
   a) Verilerden öğrenerek
   b) Sadece görsellerle
   c) Açık semboller ve kurallarla
   d) Rastgele tahminle

2. “Yağmur yağıyorsa şemsiye al” ifadesi nedir?
   a) Bir olasılık
   b) Bir sinir ağı
   c) Bir kural (IF-THEN)
   d) Bir veri kümesi

3. Açgözlü (greedy) sezgisel aramanın temel özelliği?
   a) Her zaman en iyi çözümü garanti eder
   b) Rastgele tahmin eder
   c) Veriden öğrenir
   d) Çözümü hızlandırır ama en iyiyi garanti etmez

4. Markov zincirinde bir sonraki durum neye bağlıdır?
   a) Yalnızca şu anki duruma
   b) Tüm geçmişe
   c) Geleceğe
   d) Hiçbir şeye

5. Klasik YZ’nin en büyük zorluğu neydi?
   a) Tüm kuralları elle yazmak ve dünyanın dağınıklığı
   b) Çok hızlı olması
   c) İnternete bağımlı olması
   d) Çok ucuz olması

6. “Neat” ve “Scruffy” neyi tanımlar?
   a) YZ araştırmasında iki farklı yaklaşımı
   b) İki robot türünü
   c) İki programlama dilini
   d) İki bilgisayar markasını

### Bu bölümden kalanlar

- Klasik YZ bilgiyi açık semboller ve elle yazılmış kurallar olarak saklar.
- Bir “bir …dır” zinciri (örnekten sınıfa, sınıftan üst sınıfa), geçişlilik sayesinde kimsenin yazmadığı bilgiyi türetir; zincirde olmayan için “bilinmiyor” der.
- Uzman sistem, açık olgularla eşleşen EĞER-O ZAMAN kurallarını ateşler; bir kuralın sonucu başka bir kuralı tetikleyebilir.
- Eş maliyetli ızgarada sezgisiz arama en az adımlı yolu garanti eder ama çok kare gezer; açgözlü sezgisel arama az gezer ama garanti vermez; A*, kabul edilebilir bir sezgiyle ikisini birleştirir.
- Markov zincirinde, bugün bilinince yarın daha eski geçmişe bağlı değildir; her duruma ulaşılabilen, döngüye kilitlenmeyen sonlu bir zincirde dağılım uzun vadede tek bir orana oturur.
- Düzenliler kanıt, Dağınıklar işe yarayan çözüm ister; bugünün YZ’si ikisinden de pay taşır.
- Kuralları elle yazmak ölçeklenmez ve kırılgandır; bu sınırlar, sembolik çağla birlikte yürüyen öğrenme araştırmalarına ilgiyi artırdı.

<!-- SOURCE-CHANGES
Bugün yapay zekâ deyince verilerden öğrenen sistemleri düşünüyoruz. Oysa hikâyenin ilk büyük bölümü tam tersiydi: O çağın ustaları makineye dünyayı ezberletmeye çalıştı. Akıllı davranması için ne gerekiyorsa (bütün bilgileri, bütün kuralları) tek tek elle yazdılar. ||| Bugün yapay zekâ deyince verilerden öğrenen sistemleri düşünüyoruz. Oysa hikâyenin ilk büyük bölümü tam tersiydi: o çağın ustaları makineye dünyayı ezberletmeye çalıştı. Akıllı davranması için ne gerekiyorsa (bütün bilgileri, bütün kuralları) tek tek elle yazdılar.
Bu yaklaşıma “klasik” ya da “sembolik” YZ denir. Mantık, kurallar, arama ve uzman sistemler o çağın alet çantasıydı. Şimdi o çağa konuk oluyoruz: Bu fikirler nasıl çalışıyordu, neleri başardı, neden bir gün duvara tosladı? Hepsini kendi elinle deneyeceksin. ||| Bu yaklaşıma “klasik” ya da “sembolik” YZ denir. Mantık, kurallar, arama ve uzman sistemler o çağın alet çantasıydı. Şimdi o çağa konuk oluyoruz: nasıl çalışıyordu, neleri başardı, neden bir gün tosladı? Hepsini kendin deneyeceksin.
İlk YZ’ciler şöyle düşünüyordu: “Yeterince kural yazarsak, makine akıllı olur.” Bu fikir bazı işlerde harika çalıştı, bazılarında ise hiç. ||| İlk YZ’ciler şöyle düşünüyordu: “Yeterince kural yazarsak, makine akıllı olur.” Bu fikir bazı işlerde çok iyi çalıştı, bazılarında ise hiç.
Bir makineye Tekir’i nasıl öğretirsin? Makine onu göremez, okşayamaz; ancak senin yazdığın cümlelerden tanır: “Tekir bir kedidir”, “kedi bir memelidir”, “memeli bir hayvandır”. Klasik YZ bilgiyi işte böyle saklar: açık semboller ve aralarındaki bağlar. ||| Bir makineye Tekir’i nasıl öğretirsin? Makine onu göremez, okşayamaz; ancak senin yazdığın cümlelerden tanır: “Tekir bir kedidir”, “kedi bir memelidir”, “memeli bir hayvandır”. Klasik YZ bilgiyi böyle saklar: açık semboller ve aralarındaki bağlar.
İşin güzel yanı şu: Makine bu bağları izleyip kimsenin söylemediği bilgiye kendisi ulaşır. “Tekir bir hayvandır” cümlesini hiç duymadı; ama zinciri halka halka izleyince bunu kendisi bulur. Şekil 2.1’de dört soru var; makinenin “düşünüşünü” orada adım adım oku. ||| İşin güzel yanı, makinenin bu bağları izleyip kimsenin söylemediği bilgiye kendisinin ulaşması. “Tekir bir hayvandır” cümlesini hiç duymadı; ama zinciri halka halka izleyince bunu kendisi bulur. Şekil 2.1’de dört soru var; makinenin düşünüşünü orada adım adım oku.
Makine aslında yalnızca “kim kimin türü” bilgisini tutuyor: Tekir bir kedi, kedi bir memeli... Sorunca zinciri halka halka izliyor ve kimsenin ona söylemediği bir bilgiye kendisi ulaşıyor. Zincirde yoksa da dürüstçe “bilinmiyor” diyor. ||| Makine yalnızca “kim kimin türü” bilgisini tutuyor: Tekir bir kedi, kedi bir memeli... Sorunca zinciri halka halka izliyor ve kimsenin ona söylemediği bir bilgiye kendisi ulaşıyor. Zincirde yoksa da “bilinmiyor” diyor.
Bilgi tabanı yalnızca ardışık “is-a” (bir …dır) bağlarını içerir. Bir sorgu verildiğinde çıkarım motoru zinciri geçişlilik (transitivity) kuralıyla takip eder. Hedef zincirde varsa “Evet”, yoksa “Bilinmiyor”. ||| Bilgi tabanı yalnızca ardışık “is-a” (bir …dır) bağlarını içerir. Hedef zincirde varsa “Evet”, yoksa “Bilinmiyor”.
1980’lerde bu çıraklar tıptan mühendisliğe her yerde çalıştı. Aşağıda minik bir tanesi var: Koşulları kâğıtta aç kapa; hangi kuralın “ateşlendiğini”, önerinin nasıl doğduğunu Şekil 2.2’de gör. ||| 1980’lerde bu çıraklar tıptan mühendisliğe her yerde çalıştı. Aşağıda minik bir tanesi var: koşulları sen aç kapa; hangi kuralın ateşlendiğini, önerinin nasıl doğduğunu Şekil 2.2’de gör.
Çalışma belleğindeki olgular, koşulları eşleşen üretim kurallarını ateşler (ileri zincirleme, forward chaining). R5 zincirlemedir: yalnızca R1 ateşlediyse (şemsiye) ve rüzgâr varsa tetiklenir. ||| R5 zincirlemedir: yalnızca R1 ateşlediyse (şemsiye) ve rüzgâr varsa tetiklenir.
En sabırlı yöntem her ihtimali tek tek denemektir ama bu çok yavaş olabilir. Sezgisel yöntem (heuristic) kestirmeden gider: “Hangi yön daha umut verici?” diye tahmin yürütür. Şekil 2.3’te ikisini yarıştırdık: Sezgisiz olan her yeri tarar, sezgisel olan burnunu hedefe çevirir. ||| En sabırlı yöntem her ihtimali tek tek denemektir ama bu çok yavaş olabilir. Sezgisel yöntem (heuristic) kestirmeden gider: “Hangi yön daha umut verici?” diye tahmin yürütür. Şekil 2.3’te ikisini yarıştırdık: sezgisiz olan her yeri tarar, sezgisel olan burnunu hedefe çevirir.
İki arayıcıyı yarıştırıyorsun. Sezgisiz olan her yönü sabırla tarar; sonunda en kısa yolu bulur ama çok kare gezer. Sezgisel olan hep hedefe doğru koşar; az kare gezer ama bazen en kısa yolu kaçırır. Hız ile garanti arasındaki takas işte bu. ||| İki arayıcıyı yarıştırıyorsun. Sezgisiz olan her yönü sabırla tarar; sonunda en kısa yolu bulur ama çok kare gezer. Sezgisel olan hep hedefe doğru koşar; az kare gezer ama bazen en kısa yolu kaçırır. Hız ile garanti arasındaki takas bu.
Klasik YZ buna zarif bir çözüm buldu: Durumdan duruma olasılıkla geçmek. Markov zinciri bunun en ünlüsüdür; hileli bir zarla oynanan hava durumu oyunu gibi. Şekil 2.4’te yedi günlük bir örnek var; havanın olasılıklara göre değişimini orada takip et. ||| Klasik YZ buna zarif bir çözüm buldu: durumdan duruma olasılıkla geçmek. Markov zinciri bunun en ünlüsüdür; hileli bir zarla oynanan hava durumu oyunu gibi. Şekil 2.4’te yedi günlük bir örnek var; havanın olasılıklara göre değişimini orada takip et.
Yarının havası yalnızca bugüne bakılarak tahmin ediliyor; dünün önemi yok. Her gün makine bir zar atıyor ama zar hileli: güneşli bir günden sonra yine güneş gelme ihtimali yüksek. Günler biriktikçe alttaki çubukların hep aynı orana oturduğunu göreceksin. ||| Yarının havası yalnızca bugüne bakılarak tahmin ediliyor; dünün önemi yok. Her gün makine bir zar atıyor ama zar hileli: güneşli bir günden sonra yine güneş gelme ihtimali yüksek. Günler biriktikçe dağılım hep aynı orana oturur.
Geçiş matrisi P sabittir; bir sonraki durum yalnızca şimdiki duruma bağlıdır (Markov özelliği). Her yeni gün, P’nin mevcut satırından bir örneklem üretir; uzun vadede dağılım kararlı duruma yakınsar. ||| Geçiş matrisi P sabittir; her yeni gün, P’nin mevcut satırından bir örneklem üretir.
Bu kavga yalnızca tarih değil; bugün de sürüyor. Aşağıdaki ifadeleri doğru kampa ayır. Sonunda anlaşılacak: Klasik YZ neden duvara tosladı ve bu çarpışma, makinelerin “öğrenmesi” fikrini nasıl doğurdu? ||| Bu kavga yalnızca tarih değil; bugün de sürüyor. Aşağıdaki ifadeleri doğru kampa ayır. Sonunda anlaşılacak: klasik YZ neden duvara tosladı ve bu çarpışma, makinelerin “öğrenmesi” fikrini nasıl doğurdu?
Klasik YZ’nin dersi: dünyanın tüm kurallarını elle yazmak imkânsız. Çözüm? Makineye kuralları biz vermek yerine, onları veriden kendisinin bulmasını öğretmek. Sıradaki bölümün konusu tam olarak bu. ||| Klasik YZ’nin dersi: dünyanın tüm kurallarını elle yazmak imkânsız. Çözüm, makineye kuralları biz vermek yerine onları veriden kendisinin bulmasını öğretmek. Sıradaki bölümün konusu bu.
İki kamp, iki karakter: Düzenliler her adımı matematikle kanıtlamak ister; Dağınıklar “önce çalışsın, teorisi sonra gelir” der. İkisinin de haklı çıktığı yerler var; bugünün yapay zekâsı aslında ikisinin karışımı. ||| İki kamp, iki karakter: Düzenliler her adımı matematikle kanıtlamak ister; Dağınıklar “önce çalışsın, teorisi sonra gelir” der. İkisinin de haklı çıktığı yerler var; bugünün yapay zekâsı ikisinin karışımı.
Bu, YZ’de yöntemsel bir gerilimdir: ilkeli/kanıtlanabilir yaklaşımlar (neat: mantık, olasılık) ile ampirik/mühendislik-odaklı yaklaşımlar (scruffy). Klasik YZ’nin duvarı: bilgi edinme darboğazı ve kırılganlık. ||| [SİL] (basılı sürümde silindi: 2.6 teknik[0] ve teknik[1] aynı içeriği zaten taşıyor; dijital sürümde kalabilir)
Bu paradigma 1950’lerden 1980’lere kadar baskındı ve mantık programlama, arama algoritmaları ve uzman sistemler gibi güçlü araçlar üretti. Bu modül bu araçları kurar; sonunda “bilgi edinme darboğazı” ve kırılganlık sorunlarının neden istatistiksel/öğrenen yaklaşımlara (Modül 3) yol açtığını gösterir. ||| Bu paradigma 1950’lerden 1980’lere kadar baskındı ve mantık programlama, arama algoritmaları ve uzman sistemler gibi güçlü araçlar üretti. Bu modül bu araçları kurar; sonunda “bilgi edinme darboğazı” ve kırılganlık sorunlarının, zaten araştırılmakta olan öğrenmeye dayalı yaklaşımlara (Modül 3) ilgiyi neden artırdığını gösterir.
Çıkarım (inference), bu temsiller üzerinde kuralların uygulanmasıdır. Aşağıdaki demo bir is-a hiyerarşisinde geçişliliği (transitivity) kullanır: “Tekir is-a Kedi” ve “Kedi is-a Memeli” ise “Tekir is-a Memeli” türetilebilir. Sembolik akıl yürütmenin özü budur. ||| Çıkarım (inference), bu temsiller üzerinde kuralların uygulanmasıdır. Aşağıdaki demo bir is-a hiyerarşisinde geçişliliği (transitivity) kullanır. Ontolojide iki bağ ayrılır: Tekir, Kedi sınıfının bir örneğidir (instance-of); Kedi, Memeli sınıfının alt sınıfıdır (subclass-of). “Tekir instance-of Kedi” ve “Kedi subclass-of Memeli” ise “Tekir instance-of Memeli” türetilir; bu nedenle Tekir bir memelidir. Demo iki bağı da tek ok türüyle, “bir …dır” diye gösterir. Sembolik akıl yürütmenin özü budur.
Sezgisel yöntemler hız kazandırır ama bedeli vardır: bazen en iyi çözümü kaçırabilirler. “Yeterince iyi”yi “mükemmel”e tercih ederler. ||| Açgözlü sezgisel yöntemler hız kazandırır ama bedeli vardır: bazen en iyi çözümü kaçırabilirler. “Yeterince iyi”yi “mükemmel”e tercih ederler. A* gibi daha dikkatli yöntemler, uygun bir sezgiyle garantiyi geri alır.
İki arayıcıyı yarıştırıyorsun. Sezgisiz olan her yönü sabırla tarar; sonunda en kısa yolu bulur ama çok kare gezer. Sezgisel olan hep hedefe doğru koşar; az kare gezer ama bazen en kısa yolu kaçırır. Hız ile garanti arasındaki takas bu. ||| İki arayıcıyı yarıştırıyorsun. Sezgisiz olan her yönü sabırla tarar; her adım aynı bedeldeyse sonunda en az adımlı yolu bulur ama çok kare gezer. Açgözlü sezgisel olan hep hedefe doğru koşar; az kare gezer ama bazen en kısa yolu kaçırır. Hız ile garanti arasındaki takas bu; A* gibi yöntemler gidilen yolu da hesaba katarak garantiyi geri alır.
Pek çok klasik YZ problemi durum-uzayı araması (state-space search) olarak modellenir. Bilgisiz (uninformed) arama, örneğin genişlik-öncelikli arama (BFS), hiçbir yön bilgisi kullanmadan sistematik tarar ve en kısa yolu garanti eder ama çok düğüm açar. ||| Pek çok klasik YZ problemi durum-uzayı araması (state-space search) olarak modellenir. Bilgisiz (uninformed) arama, örneğin genişlik-öncelikli arama (BFS), hiçbir yön bilgisi kullanmadan sistematik tarar; tüm kenarların maliyeti eşitse en az adımlı, dolayısıyla en düşük maliyetli yolu garanti eder, ama çok düğüm açar. Farklı kenar maliyetlerinde başka yöntemler gerekir.
Bilgili (informed) arama, bir sezgisel fonksiyon h(n) ile hedefe yakınlığı tahmin eder; açgözlü en-iyi-öncelikli arama yalnızca h’yi kullanır (hızlı ama eniyilik garantisi yok), A* ise g(n)+h(n) ile hem eniyiliği hem verimi dengeler (h kabul edilebilir ise). Aşağıda BFS ile sezgisel aramanın taradığı hücre sayısını karşılaştır. ||| Bilgili (informed) arama, bir sezgisel fonksiyon h(n) ile hedefe yakınlığı tahmin eder; açgözlü en-iyi-öncelikli arama yalnızca h’yi kullanır (hızlı ama eniyilik garantisi yok), A* ise g(n)+h(n) kullanır: h kabul edilebilirse (gerçek uzaklığı hiç aşmıyorsa) ağaç aramasında en kısa yolu bulur; graf aramasında ayrıca h’nin tutarlı olması ya da daha iyi bir yolla ulaşılan düğümlerin yeniden açılması gerekir. Aşağıda BFS ile sezgisel aramanın taradığı hücre sayısını karşılaştır.
Sezgisel (heuristic) yöntemlerin temel özelliği? ||| Açgözlü (greedy) sezgisel aramanın temel özelliği?
Markov özelliği: “gelecek, yalnızca şimdiye bağlıdır; nasıl geldiğin önemli değil.” Basit görünür ama hava durumundan Google aramasına kadar her yerde. ||| Markov özelliği: “şimdiyi biliyorsan gelecek daha eski geçmişe bağlı değildir; buraya nasıl geldiğin önemli değil.” Basit görünür ama hava durumundan Google aramasına kadar her yerde.
Yarının havası yalnızca bugüne bakılarak tahmin ediliyor; dünün önemi yok. Her basışta makine bir zar atıyor ama zar hileli: güneşli bir günden sonra yine güneş gelme ihtimali yüksek. Günler biriktikçe alttaki çubukların hep aynı orana oturduğunu göreceksin. ||| Yarının havası yalnızca bugüne bakılarak tahmin ediliyor; bugün bilinince dünün önemi kalmıyor. Her basışta makine bir zar atıyor ama zar hileli: güneşli bir günden sonra yine güneş gelme ihtimali yüksek. Günler biriktikçe alttaki çubukların hep aynı orana oturduğunu göreceksin.
Belirsizlik altında akıl yürütmek için olasılıksal modeller kullanılır. Markov zinciri, bir sonraki durumun yalnızca şu anki duruma bağlı olduğu (Markov özelliği: geçmişten bağımsızlık) bir stokastik süreçtir; geçişler bir olasılık matrisiyle tanımlanır. ||| Belirsizlik altında akıl yürütmek için olasılıksal modeller kullanılır. Markov zinciri, mevcut durum bilindiğinde bir sonraki durumun daha eski geçmişe bağlı olmadığı (Markov özelliği: mevcut duruma koşullu bağımsızlık) bir stokastik süreçtir; geçişler, her satırının toplamı 1 olan bir olasılık matrisiyle tanımlanır.
Yeterince adımda dağılım çoğu zaman bir kararlı duruma (stationary distribution) yakınsar. Bu fikir, gizli Markov modelleri, PageRank ve pekiştirmeli öğrenmedeki Markov karar süreçlerine kadar uzanır. Aşağıdaki demoda uzun vadeli dağılımın nasıl oluştuğunu gözlemle. ||| Sonlu, indirgenemez ve periyodik olmayan bir zincirin durum dağılımı, başlangıç ne olursa olsun, tek bir kararlı dağılıma (stationary distribution) yakınsar; kararlı dağılımın var olması tek başına yakınsama demek değildir. Bu fikir, gizli Markov modelleri, PageRank ve pekiştirmeli öğrenmedeki Markov karar süreçlerine kadar uzanır. Aşağıdaki demoda uzun vadeli dağılımın nasıl oluştuğunu gözlemle.
Bu kavga yalnızca tarih değil; bugün de sürüyor. Aşağıdaki ifadeleri doğru kampa ayır. Sonunda anlaşılacak: klasik YZ neden duvara tosladı ve bu çarpışma, makinelerin “öğrenmesi” fikrini nasıl doğurdu? ||| Bu kavga yalnızca tarih değil; bugün de sürüyor. Aşağıdaki ifadeleri doğru kampa ayır. Sonunda anlaşılacak: klasik YZ neden duvara tosladı ve bu çarpışma, zaten araştırılan bir fikre, makinelerin “öğrenmesine”, ilgiyi nasıl artırdı?
Klasik sembolik YZ iki temel sınıra çarptı: bilgi edinme darboğazı (tüm kuralları elle yazmak ölçeklenmez) ve kırılganlık (öngörülmeyen durumlarda çökme). Bu sınırlar, bilgiyi elle kodlamak yerine veriden öğrenmeyi öneren istatistiksel YZ’ye (Modül 3) geçişi hızlandırdı. ||| Klasik sembolik YZ iki temel sınıra çarptı: bilgi edinme darboğazı (tüm kuralları elle yazmak ölçeklenmez) ve kırılganlık (öngörülmeyen durumlarda çökme). Bu sınırlar, zaten araştırılmakta olan öğrenmeye dayalı yöntemlere ilgiyi artırdı; sembolik ve öğrenmeye dayalı yaklaşımlar uzun süre birlikte gelişti (Rosenblatt’ın perceptron’u 1958 tarihlidir). Bilgiyi elle kodlamak yerine veriden öğrenen istatistiksel YZ’ye (Modül 3) geçiş böyle hızlandı.
-->

<!-- REDAKSİYON NOTLARI
- 2.4 teknik: "Aşağıda BFS ile" → "Şekil 2.3’te BFS ile" (2026-09-30; 2.2, 2.3, 2.5 teknik cümleleri daha önce aynı biçimde uyarlanmıştı).
- 2.4 Kurulum ekranı değil şekli anlatacak biçimde yeniden yazıldı (durum diyagramı + geçiş matrisi; gün sayacı yalnız ekranda).
- Kâğıda uyarlandı (2026-09-30, teknik "Ne oluyor"): 2.2 "Bir sorgu seç; çıkarım motoru…", 2.5 "“Sonraki gün”, P’nin mevcut satırından…" (ekran buyruğu/düğme adı).
- 2.2 basit: "Aşağıda bir soru sor, makinenin “düşünüşünü” izle." → "Şekil 2.1’de dört soru var; makinenin “düşünüşünü” orada adım adım oku."
- 2.3 basit: "Koşulları aç kapa; hangi kuralın “ateşlendiğini”, önerinin nasıl doğduğunu izle." → "Koşulları kâğıtta aç kapa; hangi kuralın “ateşlendiğini”, önerinin nasıl doğduğunu Şekil 2.2’de gör."
- 2.4 basit: "Aşağıda ikisini yarıştır:" → "Şekil 2.3’te ikisini yarıştırdık:"
- 2.5 basit: "Aşağıda dene: “Sonraki gün”e bas, havanın olasılıklara göre değişimini izle." → "Şekil 2.4’te yedi günlük bir örnek var; havanın olasılıklara göre değişimini orada takip et."
- 2.6 basit: "Aşağıdaki ifadeleri doğru kampa ayır." aynen bırakıldı (Şekil 2.5 listesi kâğıtta karşılıyor). "Sonunda göreceğiz:" → "Sonunda anlaşılacak:" (dijital kaynakta da; 2026-09-30).
- Teknik paragraflar birebir korundu; şu cümleler ekrana atıf yapıyor ve nihai yerleşimde Şekil bloğunun ALTINDA kalıyor: 2.2 "Aşağıdaki demo bir is-a hiyerarşisinde…", 2.3 "Aşağıdaki demoda … göreceksin.", 2.4 "Aşağıda BFS ile sezgisel aramanın taradığı hücre sayısını karşılaştır.", 2.5 "Aşağıdaki demoda uzun vadeli dağılımın nasıl oluştuğunu gözlemle." Yazar kararı: "Aşağıdaki demo" → "Şekil 2.k" ya da olduğu gibi.
- Şekil 2.3: Demo kodundan hesaplandı (GRID + runGrid). BFS 36 kare tarar, açgözlü 24; ikisi de 19 karelik (18 adım) yolu bulur. Bu ızgarada açgözlü arama en kısa yolu KAÇIRMIYOR; metin bunu dürüstçe söylüyor ("garanti değil, şans"). Basit "Ne oluyor?" metnindeki "bazen en kısa yolu kaçırır" cümlesi genel ifade olarak doğru kalıyor. Demodaki "Yol uzunluğu" sayacı kare sayısını (19) gösterir; metinde hem kare hem adım verildi.
- Şekil 2.3 ızgara tarifi 1’den başlayan sütun/satır numaralarıyla yazıldı (okur için); Teknik derinlikteki h(n) formülü koddaki sıfır tabanlı koordinatları kullanıyor, metinde belirtildi.
- Şekil 2.4: Yedi günlük zincirdeki çekilişler (42, 83, 55, 91, 77, 12, 64) yazar tarafından seçilmiş örnek sayılardır; demoda Math.random ile üretilir. Metin bunu açıkça söylüyor. Kararlı dağılım 6/13, 4/13, 3/13 elle ve betikle doğrulandı.
- Şekil 2.4 Kurulum'a print/figures/out/tr/sekil-2-4-markov.md'deki matris tablosu aynen alındı; SVG şekil de aynı tabloyu içeriyorsa tekrar sayılabilir.
- Şekil 2.5 "Kendini sına" demosu: Adım adım yerine soru listesi; ifadeler book.json/demo verisiyle birebir. Gerekçeler cevaplar/M02.md'de.
- Şekil dosyaları üretildi; Kurulum metinleri SVG ile karşılaştırıldı (2026-09-30).
- Yazar kararı (2026-09-10): kaynak metin dahil tüm "demo" sözcükleri "gösterim" ya da "Şekil N.j" yapıldı; "Aşağıdaki demo" → şekil öncesinde "Aşağıda yer alan gösterim (Şekil N.j)", sonrasında "Şekil N.j'teki gösterim".
- 2026-10-01 düzeltme belgesi: R011 (öğrenme, sembolik çöküşün ardılı değil; "zaten araştırılan" + paralel gelişim: 2.1 teknik, 2.6 basit, 2.6 teknik, kalanlar), R012 (instance-of / subclass-of ayrımı: Kurulum, 2.2 teknik, biçimsel kural, kalanlar; cevaplar/M02), R013 (BFS garantisi eş kenar maliyetine bağlandı: teknik[0], Adım 4, Ne oluyor, kalanlar; sınav 3 sorusu açgözlü aramaya daraltıldı), R014 (greedy ile A* ayrıldı: kenar notu, Adım adım başlığı/tablo "Açgözlü sezgisel", Ne oluyor, teknik kabul edilebilirlik + graf aramasında tutarlılık/yeniden açma; cevaplar/M02), R015 (Markov: mevcut duruma koşullu bağımsızlık; sonlu/indirgenemez/periyodik olmayan zincir tek kararlı dağılıma yakınsar; satır toplamı 1; πP = π ve Σπᵢ = 1 ayrı satırlarda; kenar notu, Kurulum, Adım adım, Ne oluyor, teknik, kalanlar), R016 (yalnız EN: "in two words" → "in two ideas", rigour → rigor; TR'de değişiklik gerekmedi), R066 (Bölüm 1–2'de bias/embedding geçmiyor; işlem yok).
- 2026-09-30 insanlaştırma geçişi: humanize-tr-report.md bulguları uygulandı; "Peki/Sıradaki bölüm …-yor" köprüleri, "işte/tam olarak" çivileri, punchline'lar, "Ekranda … kâğıtta …" cümleleri (2.4, 2.5 Kurulum), "aslında/yani/dürüst/harika/yolculuk" sözcükleri, Şekil 2.5 ipucu şişkinliği (cevap dağılımını ele veren cümle dahil) ve kavram tırnakları temizlendi. Teknik "Ne oluyor" paragraflarında ilk teknik paragrafı tekrar eden cümleler kırpıldı (2.2, 2.3, 2.5; 2.6'daki paragraf tamamen tekrar olduğu için basılı sürümden çıkarıldı; dijital sürüm tam hâlini koruyabilir). Kaynak paragraf değişiklikleri yukarıdaki SOURCE-CHANGES bloğunda.
-->
