# Bölüm 1
## Zekâ ve Makineler
*Bir makine düşünebilir mi?*

<!-- acc #2a3bb0 · tag Temeller -->

### 1.1 Bir makine düşünebilir mi?

Bu kitap “bir varmış bir yokmuş” diye başlamıyor; çünkü bu hikâye bitmedi, sen de içindesin. Başlangıcıysa çok eskiye, bilgisayarlardan çok öncesine uzanıyor. O günden beri sorulan soru aynı: düşünmek dediğimiz şey ne? Kafamızın içinde bir tür çark dönüyorsa, aynı çarkı bir makine de döndüremez mi? İnsanlar yüzyıllardır bunu tartışıyor.

Bu ilk bölümde yolun en başına gidiyoruz. Zekâ denen şey ne? Düşünmek gerçekten adım adım bir tarife dökülebilir mi? Babbage’ın dişli çarklarından modern bilgisayarın doğuşuna yürüyeceğiz. Yol bittiğinde, yapay zekânın (kısaca YZ) neden mümkün olduğu kendiliğinden görünecek.

> **Kenar notu.** YZ yeni değil. “Makineler düşünebilir mi?” sorusu 1600’lerden beri filozofları meşgul ediyor. Yeni olan, buna cevap verebilecek donanım.

#### Teknik derinlik

Yapay zekâ, hesaplama kuramı ile zihin felsefesinin kesişiminde doğdu. Temel iddia şudur: eğer zihinsel süreçler biçimsel (formel) kurallarla tanımlanabiliyorsa, prensipte bir makine tarafından da yürütülebilir.

Bu bölüm zekânın tanımından başlar; hesaplama kuramının taşlarını (ikili gösterim, algoritma, Turing makinesi, depolanmış-program mimarisi) döşer ve “zayıf/güçlü YZ” ayrımıyla modern tartışmaya bağlanır. Sonraki bölümlerin öğrenme ve sinir ağı kavramları bu zemine oturur.

İlk soru en baştaki: makineye vermek istediğimiz zekâ ne?

### 1.2 Zekâ nedir?

Kolay bir soru gibi görünür ama “zekâ nedir?” sorusunun tek bir cevabı yok. Bilmece çözen mi zekidir, yeni taşındığı şehirde yolunu hemen bulan mı, yoksa üzgün arkadaşını tek bakışta anlayan mı? Belki hepsi; ama her biri bambaşka bir beceri.

Psikolog Howard Gardner da böyle düşünmüş: zekâ tek bir sayıya (IQ) sığmaz; birden çok türü vardır. Aşağıda bu türlere bak; bugünkü YZ kimisinde usta, kimisinde daha emekleme çağında.

> **Kenar notu.** Bir hesap makinesi aritmetikte senden milyon kat hızlı ama bir şakaya gülemez. Zeki olmak tek bir eksen değildir.

**Şekil 1.1 · Çoklu zekâyı keşfet**
![Şekil 1.1](../../figures/out/tr/sekil-1-1-intelligence.svg)

*Kurulum.* Şekilde sekiz kart var; her kart, Gardner’ın saydığı bir zekâ türü. Kartın altındaki çubuk, bugünkü yapay zekânın o alanda nerede durduğunu gösterir. Dolu çubuk güçlü, yarım çubuk orta, kısacık çubuk zayıf demek.

*Adım adım.* Sekiz kartın tamamı, kaynaktaki sırayla:

| Zekâ türü | Ne demek | Bugünkü YZ | Çubuk |
|---|---|---|---|
| Dilsel | Dili, yazıyı ve anlatıyı kullanma becerisi. | Güçlü | %90 |
| Mantıksal-Matematiksel | Sayılar, mantık ve sistematik akıl yürütme. | Güçlü | %90 |
| Uzamsal | Mekânı, biçimleri ve görselleri kavrama. | Orta | %55 |
| Müziksel | Ritim, melodi ve sesin örüntülerini sezme. | Orta | %55 |
| Bedensel-Kinestetik | Bedeni ve el becerisini ustaca kullanma. | Zayıf | %22 |
| Kişilerarası | Başkalarını anlama, empati ve iletişim. | Zayıf | %22 |
| İçsel | Kendi duygularını ve amaçlarını tanıma. | Zayıf | %22 |
| Doğacı | Doğadaki canlı ve örüntüleri ayırt etme. | Orta | %55 |

Tabloyu sayarsan iki güçlü, üç orta, üç zayıf çıkar. Güçlü ikisinin ortak yanı, sembollerle iş görmeleri: harfler, sayılar, kurallar. Bilgisayar da bu malzemeyle çalışır; sıradaki bölümdeki ikili kod bir sembol dizisi.

Zayıf üçü ise başka bir malzeme ister: bir beden, karşındaki insanın yüzü, kendi iç dünyan. Bunların hiçbiri sembole kolay dökülmez. Ortadaki üçü (uzam, müzik, doğa) ikisinin arasında durur. Sesin ve görüntünün bir kısmı sayıya çevrilebiliyor; bir kısmı hâlâ direniyor.

Listenin sırası bir başarı sıralaması değil. Kartlar ayrı becerileri sayıyor; hiçbiri ötekinden daha zeki sayılmaz. YZ için de öyle: dilde güçlü olmak, öbür yedi alanda güçlü olmak anlamına gelmiyor.

*Ne oluyor?* Gardner’a göre zekâ tek bir sayı değil, sekiz ayrı yetenek ailesidir; şekildeki her kart bunlardan biri. Bugünkü yapay zekâ dilde ve mantıkta çok iyi ama beden ve duygu işlerinde küçük bir çocuğun bile gerisinde.

*Kendin dene.* 1) Kitabı kapat ve sekiz zekâ türünü ezberden say. Kaçını hatırladın; hangileri unutuluyor? 2) Dünkü gününü düşün: Sabahtan akşama en çok hangi üç türü kullandın? Tabloya göre bugünkü YZ bunların kaçında güçlü? 3) Tabloda zayıf olan üç türün ortak yanı ne? Bir cümleyle yaz. Canlı demo: [QR 1.1]

#### Teknik derinlik

Zekânın üzerinde uzlaşılmış tek bir tanımı yoktur; çalışan tanımlar genelde “hedefe yönelik uyum, soyutlama, öğrenme ve problem çözme kapasitesi” etrafında toplanır. YZ alanı pragmatik bir tanım kullanır: insan zekâsı gerektiren görevleri yerine getirebilen sistemler.

Howard Gardner’ın Çoklu Zekâ Kuramı (1983), zekâyı dilsel, mantıksal-matematiksel, uzamsal, müziksel, bedensel-kinestetik, kişilerarası, içsel ve doğacı gibi görece bağımsız alanlara ayırır. Kuram psikometride tartışmalıdır ancak zekânın çok-boyutluluğunu göstermesi açısından öğreticidir: mevcut YZ bu boyutlarda son derece dengesizdir.

Asıl ders, zekânın tek boyutlu olmaması: YZ dil ve mantıkta güçlü, bedensel ve sosyal/içsel alanlarda zayıftır.

Zekâ tek parça değilse, parçalarından en az biri adım adım bir tarife dökülebilir mi? Bir kek tarifi bu soruya iyi bir başlangıç.

### 1.3 Düşünmek = hesaplamak mı?

Şimdi mutfağa girelim. Elinde bir kek tarifi var: yumurtayı kır, çırp, unu ekle, fırına ver. Tarifi harfi harfine izleyen biri, kek yapmayı hiç anlamasa bile ortaya kek çıkarır. Yapay zekânın temelindeki fikir de bu: belki düşünmek de küçük, mekanik adımları sırayla uygulamaktır.

Eğer öyleyse, bu adımları bir makineye de yaptırabiliriz. Bunun için iki şey gerekir:

• Makinenin kullanabileceği basit bir alfabe (ikili kod: 0 ve 1)

• Net bir adım listesi (tarifin kendisi: algoritma)

Aşağıda ikili kodun nasıl çalıştığını kendin gör.

> **Kenar notu.** “Algoritma” kelimesi 9. yüzyıl Pers matematikçisi el-Harezmî’nin adından gelir. İkili sistemi ise 1703’te Leibniz biçimselleştirdi.

**Şekil 1.2 · İkili kodu çöz**
![Şekil 1.2](../../figures/out/tr/sekil-1-2-binary.svg)

*Kurulum.* Şekilde yan yana sekiz kutu var. Her kutunun üstünde bir ağırlık yazıyor; soldan sağa 128, 64, 32, 16, 8, 4, 2 ve 1. Yanık kutu 1, sönük kutu 0 demek. Şekilde gösterimin açılış hâli var: 01001001. Altındaki sayı, yanık kutuların ağırlıklarının toplamı. Onun altında üç satır daha var: 5, 73 ve 255 aynı yolla yazılmış.

*Adım adım.* Önce ağırlık şeması:

| Kutu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Ağırlık | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| Açılış | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 |

1. Açılıştaki sayıyı çöz. Yanık kutular 2, 5 ve 8; ağırlıkları 64, 8 ve 1. Topla: 64 + 8 + 1 = 73. Demek ki 01001001 = 73.
2. Tersini de yap: 5 sayısını kutulara yaz. Soldan başla, her kutuya sor: “Ağırlığın sayıya sığıyor mu?” 128, 64, 32, 16 ve 8 sığmaz; hepsi sönük kalır. 4 sığar: yak, geriye 1 kalır. 2 sığmaz. 1 sığar: yak, geriye 0. Sonuç 00000101.
3. Aynı yolla 73’ü yaz. 128 sığmaz. 64 sığar, kalan 9. 32 ve 16 sığmaz. 8 sığar, kalan 1. 4 ve 2 sığmaz. 1 sığar, kalan 0. Sonuç 01001001; açılıştaki desenle aynı.
4. Son olarak 255: bütün kutuları yak. 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255; desen 11111111. Bu, sekiz kutunun söyleyebileceği en büyük sayı. Bir fazlası olan 256 için dokuzuncu bir kutu gerekir.

Kural tek: soldan sağa git, sığıyorsa yak, kalanla devam et. Her sayının tek bir deseni var; iki farklı desen aynı sayıyı vermez. Sekiz kutu 0’dan 255’e kadar 256 ayrı sayı tutar; bilgisayarcılar buna bir bayt der.

*Ne oluyor?* Sekiz kutu, sekiz ampul: sönük 0, yanık 1 demek. Değerler neden böyle? En sağdaki kutu en küçüğü, 1’i tutar. Sola doğru her kutu, sağ komşusunun iki katını yüklenir: 1, 2, 4, 8, 16, 32, 64 ve en solda 128. Her yeni kutu, sağındaki kutuların toplamından bir fazlasını söyleyebilmeli; yoksa arada söylenemeyen sayılar kalırdı. Yanık kutuların değerlerini topla, sayın çıkar. Bilgisayarın bütün dünyası bu aç-kapa oyunu.

*Kendin dene.* 1) 10 sayısını sekiz kutuyla yaz. 2) 10110000 deseni hangi sayı? 3) Yalnız en soldaki kutu yanıksa sayı kaç? Dokuzuncu bir kutu eklesen en büyük sayı ne olurdu? Canlı demo: [QR 1.2]

#### Teknik derinlik

Bu görüşe hesaplamacılık (computationalism) denir: zihin bir bilgi-işleme sistemidir ve biliş, sembol manipülasyonu biçiminde bir hesaplamadır. Kökleri Hobbes’a (“akıl yürütmek hesaplamaktır”) uzanır; modern formu Putnam ve Fodor ile gelişti.

Pratikte iki taş gerekir. İkili gösterim: her bilgi taban-2’de (bit’ler) kodlanır; Boole cebiri (Boole, 1854) ve Shannon’ın 1937 tezi, mantığın elektrik anahtarlarıyla gerçeklenebileceğini gösterdi. Algoritma: sonlu, kesin tanımlı adımlar dizisi (terim, 9. yy matematikçisi el-Harezmî’den gelir). Bu ikisi “düşünmeyi” mekanik olarak yürütülebilir kılar.

İkili 01001001 = basamak değerlerinin toplamı = 64 + 8 + 1 = 73. Her bit, soldan sağa 128, 64, 32, … değerlerini temsil eder. 8 bit (1 bayt) 0–255 arası her sayıyı kodlar.

Genel kural: değer = Σ bᵢ · 2ⁱ, i = 0…7 sağdan sola sayılır; bᵢ ilgili bitin 0 ya da 1 değeridir. n bit 2ⁿ ayrı sayı kodlar; 8 bit için 2⁸ = 256.

Alfabe ve tarif hazır; tarifi yürütecek makinenin hikâyesi 1800’lerde bir dişli çark hayaliyle başlıyor.

### 1.4 Babbage’tan Turing’e

İlk “bilgisayar” hayali 1800’lerde kuruldu. Charles Babbage dişlilerden ve kollardan oluşan dev bir hesap makinesi çizdi: Analitik Makine. Parası ve ömrü yetmedi; makinesini hiç göremeden öldü. Ama arkadaşı Ada Lovelace, o hayaldeki makine için ilk “tarifi” yazdı. Bu yüzden tarihin ilk programcısı sayılır.

Yaklaşık yüz yıl sonra Alan Turing hayali bir adım öteye taşıdı: Bandı okuyan, yazan ve iki yana kayan tek bir kutucuk, prensipte her hesabı yapabilir. Buna Turing makinesi denir. Şekil 1.3’te gerçek bir tanesinin nasıl düşündüğünü kare kare gör.

> **Kenar notu.** Turing, 1948’de “Turochamp” adlı bir satranç algoritması tasarladı. O dönemin makineleri çalıştıramadığı için Turing hamleleri kâğıt üzerinde elle hesaplıyordu.

**Şekil 1.3 · Çalışan bir Turing makinesi (+1)**
![Şekil 1.3](../../figures/out/tr/sekil-1-3-turing.svg)

*Kurulum.* Şekilde altı gözlü bir bant var; üstünde gezen ok (▲) makinenin kafası. Bantta 000101 yazıyor, ikili sayı olarak 5. Makinenin üç durumu var: “sağa git”, “ekle” (elde ile 1 ekle) ve “bitti”. Film şeridindeki dokuz kare, 5’e 1 eklenirken atılan her adımı gösteriyor.

*Adım adım.* Kareleri sırayla oku; her karede bant, kafanın yeri ve durum var. Bant gözlerini soldan sağa sayarsan 0’dan 5’e.

0. Başlangıç. Kafa en soldaki gözde (0), durum “sağa git”. Bant 0 0 0 1 0 1, sayı olarak 5.
1. Kafa bir kare sağa kayar (1). Bant değişmez. Kafa (▲), sayının en sağındaki basamağı bulmak için adım adım sağa gidiyor. Tıpkı elle toplama yapar gibi, işlem en sağdaki basamaktan başlar.
2. Kafa 2. gözde. Hâlâ yalnızca okuyor, yazmıyor.
3. Kafa 3. gözde; burada 1 var ama makine bu durumda 1’e aldırmaz, geçer.
4. Kafa 4. gözde.
5. Kafa son gözde (5). Bant hâlâ 0 0 0 1 0 1.
6. Sağda göz kalmadı. Makine durum değiştirir: “ekle” (elde ile 1 ekle). Kafa yerinde, bant aynı.
7. Kafa son gözde 1 görür. 1’i 0 yapar, eldeyi bir sola taşır; kafa 4. göze geçer. Bant 0 0 0 1 0 0, bir anlığına 4. Kafa şimdi geriye, sola doğru 1 ekliyor: gördüğü her 1’i 0 yapıp eldeyi bir sola taşıyor; ilk 0’a rastladığında oraya 1 yazıp duruyor. Okulda öğrendiğimiz “elde var 1” kuralının aynısı.
8. Kafa 4. gözde 0 görür. Oraya 1 yazar ve durur; durum “bitti”. Bant 0 0 0 1 1 0, sayı olarak 6. İşlem bitti.

Toplam sekiz hamle: beş kez sağa yürümek, bir durum değişimi, bir sıfırlama, bir yazma. Makine oku, yaz, sola ya da sağa git gibi bir avuç basit kuralla ikili bir sayıya 1 ekledi; beş artı bir altı etti, bant bunu 000110 diye söylüyor. Bir Turing makinesinin düşünmesi bu: anlamı olmayan küçük mekanik adımlar, art arda.

*Ne oluyor?* Makine bandın üzerinde bir karınca gibi yürüyor: önce sağa gidip sayının ucunu buluyor, sonra dönüp 1 ekliyor. Eldeyi taşıyışı, senin kâğıtta toplama yapışından farksız. Her hesap bu minicik hamlelerle yapılıyor; başka bir şey yok.

*Kendin dene.* 1) Bandı 001111 (15) ile başlat ve kareleri kâğıtta sen çiz. Kaç tane 1 sıfırlanır, makine kaç hamlede biter, bantta hangi sayı kalır? 2) Bandı 010110 (22) ile başlat. Kafa sona varıp geri döndüğünde ilk gördüğü rakam ne? Kaç hamlede biter? 3) Bant 111111 (63) olsaydı ne olurdu? Makine en sol göze vardığında da 1 görüyor; sola gidemeyince durur. Canlı demo: [QR 1.3]

#### Teknik derinlik

Babbage’ın Analitik Makinesi (1837) bir “mill” (işlem birimi) ve “store” (bellek) içeren, delikli kartlarla programlanabilen genel amaçlı bir tasarımdı. Ada Lovelace’ın 1843 notları, Bernoulli sayılarını hesaplayan ve genelde ilk bilgisayar programı kabul edilen algoritmayı içerir.

Alan Turing’in 1936 tarihli “On Computable Numbers” makalesi, soyut Turing makinesini ve evrensel Turing makinesi fikrini tanıttı; bu, hesaplanabilirliğin biçimsel temelidir. Şekil 1.3’teki simülasyon, bir ikili sayıya 1 ekleyen küçük bir Turing makinesidir: yalnızca oku/yaz ve durum geçişleriyle aritmetik yapar.

Makine sağa kayarak bandın sonuna gider, sonra sola dönerek ikili sayıya 1 ekler (elde mantığı): gördüğü 1’ler 0 olur, ilk 0 ise 1 olur.

Şekil 1.3’teki makinenin geçiş tablosu:

| Durum | Okunan | Yazılan | Hareket | Yeni durum |
|---|---|---|---|---|
| sağa git | 0 ya da 1 | aynı | sağ (bant sonunda yerinde) | sağa git; bant sonundaysa “ekle” |
| ekle | 1 | 0 | sol | ekle; bant başındaysa “bitti” |
| ekle | 0 | 1 | dur | bitti |

Üç satır, altı gözlü bant ve tek bir kafa: 0–62 arası her sayıya 1 eklemeye yeter. 63 için bant taşar ve 0 kalır.

Turing’in makinesi kâğıt üstünde bir düşünceydi. Onu gerçek lambalara ve kablolara dökmek başka bir hikâye.

### 1.5 ENIAC ve modern bilgisayarın doğuşu

1945’te dev bir makine gürledi: ENIAC. Tonlarca ağırlığında, on binlerce lambayla çalışan bu ilk elektronik bilgisayarın huysuz bir yanı vardı: ona yeni bir iş öğretmek için kablolarını günlerce elle söküp takmak gerekiyordu.

Çözüm zarif bir fikirle geldi: tarifi de malzemelerin yanına, belleğe koy. Böylece makineyi yeniden kablolamak yerine yalnızca yeni talimat yüklersin. Cebindeki telefon dahil bugün neredeyse her bilgisayar bu düzeni kullanır. Aşağıdaki şekilde önce döngünün dönüşüne, sonra parçalarının ne yaptığına bak.

> **Kenar notu.** ENIAC’ı yeniden programlamak günler sürerdi; kabloları elle bağlamak gerekirdi. Programı belleğe koyma fikri bu yüzden büyük bir adımdı.

**Şekil 1.4 · Getir – Yürüt – Yaz döngüsü**
![Şekil 1.4](../../figures/out/tr/sekil-1-4-cycle.svg)

*Kurulum.* Şekilde üç kutu var: Bellek, İşlemci ve Giriş / Çıkış. Altlarında üç kare yan yana: “1 · Getir”, “2 · Yürüt”, “3 · Yaz”. Her karede o evrede iş başında olan parça koyu. Üçüncü kareden sonra döngü başa döner.

*Adım adım.* Önce parçalar:

| Evre | İş başındaki parça | Ne yapar |
|---|---|---|
| 1 · Getir | Bellek | Hem programı (talimatları) hem veriyi birlikte saklar. Asıl yenilik burada: talimatlar da veri gibi tutulur. |
| 2 · Yürüt | İşlemci | ALU hesaplar (toplama, karşılaştırma); Kontrol birimi bellekteki talimatları sırayla getirip yürütür. |
| 3 · Yaz | Giriş / Çıkış | Dış dünyayla bağlantı: klavye, ekran, sensörler. Veri buradan girer, sonuç buradan çıkar. |

Döngüyü küçük bir programla döndürelim. Bellekte iki satır olsun: birinci satırda “5 ile 3’ü topla”, ikinci satırda “sonucu ekrana yaz”. 5 ve 3 sayıları da bellekte dursun.

1. Getir. Kontrol birimi belleğe uzanır, birinci satırdaki talimatı alır: “5 ile 3’ü topla”. Talimat da 5 ve 3 gibi bellekten geldi; kablo değil, veri.
2. Yürüt. ALU toplamayı yapar: 5 + 3 = 8. Sonuç şimdilik işlemcinin içinde.
3. Yaz. 8 belleğe geri konur; Giriş / Çıkış’ın bu turda işi yok, ekrana bir şey çıkmaz.
4. Getir. Döngü başa döndü; kontrol birimi ikinci satırı alır: “sonucu ekrana yaz”.
5. Yürüt. İşlemci 8’i bellekten okur ve çıkışa hazırlar.
6. Yaz. Ekranda 8 belirir. İki satırlık program bitti; sıradaki talimat varsa döngü sürer.

İki turda altı evre. ENIAC’ta birinci satırı değiştirmek günlerce kablo sökmek demekti. Burada tek yapılacak şey belleğin birinci satırına başka bir talimat yazmak, mesela “5 ile 3’ü çarp”. Döngü aynı kalır; yalnızca aldığı talimat değişir.

*Ne oluyor?* Bilgisayar hiç durmadan üç adımlık bir dans yapar: sıradaki talimatı hafızadan alır (getir), gereğini yapar (yürüt), sonucu kaydeder ya da ekrana verir (yaz). Telefonunun da bilgisayarının da kalbinde dönen döngü bu.

*Kendin dene.* 1) Telefonundaki hesap makinesine 7 × 6 yazdın. Üç evreyi kendi cümlelerinle sırala; her evrede hangi parça iş başında? 2) Yukarıdaki programa üçüncü bir satır ekle: “sonucu 2 ile çarp”. Kaç evre daha gerekir, belleğe hangi sayı yazılır? 3) Saniyede 3 milyar tur dönen bir işlemci düşün. Her tur üç evre. Bir saniyede kaç evre? Canlı demo: [QR 1.4]

#### Teknik derinlik

ENIAC (1945; Mauchly & Eckert) genel amaçlı bir elektronik dijital bilgisayardı; ~17.500 vakum tüpü kullanıyor ve fişli panolarla yeniden kablolanarak programlanıyordu (ilk programcıları altı kadın matematikçiydi). İç yapısında ikili değil, ondalık sayı düzeni kullanıyordu.

John von Neumann’ın 1945 EDVAC raporu, depolanmış-program ilkesini popülerleştirdi: program ve veri aynı bellekte tutulur. Mimari bir işlemci (ALU + kontrol birimi), bellek ve giriş/çıkıştan oluşur; bu parçalar bir veriyolu üzerinden haberleşir. İşlemci sürekli bir “getir–çöz–yürüt” döngüsü çevirir. “Von Neumann darboğazı” bu tasarımın bilinen sınırıdır.

“Getir” evresinde kontrol birimi bir sonraki talimatı bellekten okur; “Yürüt”te işlemci işi yapar, “Yaz”da sonuç dışarı verilir.

Makine artık her tarifi yürütebiliyor. Bugün ona yapay zekâ derken bunun ne kadarını kastediyoruz?

### 1.6 Dar YZ mı, Genel YZ mi?

Filmlerdeki gibi her şeyi anlayan bir yapay zekâ henüz yok. Bugünkü her YZ “dar” (narrow) YZ’dir: kendi işinde şampiyondur, işinin bir adım dışında acemidir. Satranç motoru seni yener ama ondan bir çorba tarifi isteyemezsin.

İnsan gibi her alanda öğrenebilen varsayımsal sisteme “genel yapay zekâ” (AGI) denir; öylesi daha yapılmadı. Aşağıdaki örnekleri sen ayır: hangisi bugün var, hangisi hâlâ bilim kurgu?

> **Kenar notu.** Bir sistemin birçok işi iyi yapması (genel) ile gerçekten “anlaması/bilinçli olması” (güçlü) farklı sorulardır. Bunları karıştırmamak modern YZ tartışmasının anahtarıdır.

**Şekil 1.5 · Bugün var mı, yoksa bilim kurgu mu?**
![Şekil 1.5](../../figures/out/tr/sekil-1-5-classify.svg)

*Kurulum.* Şekilde iki sütun var. Soldakinin başlığı “Dar YZ · bugün var”, sağdakinin “Genel / AGI · henüz yok”. Ortada beş kart duruyor. Kartların yanındaki kutuları kalemle sen dolduracaksın. Puan yok, iki sütundan başka seçenek de yok.

*Kendini sına.* Her kartı bir sütuna koy. Ölçüt tek: sistem tek bir işte mi usta, yoksa hiç görmediği bir işi insan gibi öğrenebiliyor mu? Karar verirken kartın ne kadar etkileyici olduğuna değil, kaç işi bildiğine bak. Cevaplar ve gerekçeler kitabın sonunda.

| # | Örnek | Dar YZ · bugün var | Genel / AGI · henüz yok |
|---|---|---|---|
| 1 | Satranç motoru | ☐ | ☐ |
| 2 | Yüz tanıma sistemi | ☐ | ☐ |
| 3 | Sohbet botu (dil modeli) | ☐ | ☐ |
| 4 | Her mesleği insan gibi öğrenip yapan, kendi amaçları olan makine | ☐ | ☐ |
| 5 | Kendini fark eden, bilinçli bir YZ | ☐ | ☐ |

Beşini de işaretledikten sonra say: sol sütunda kaç kart var, sağda kaç? Sağdaki kartların ortak yanı ne? Bunu bir cümleyle yazabiliyorsan bölümün ana fikri sende.

*Ne oluyor?* Tek işte usta olan her sistem dar sınıfına girer, sohbet botları bile. Genel olan, insan gibi her alanda öğrenebilen makinedir ve öylesi henüz yok. Bilinçli makine ise apayrı bir hikâye.

*Kendin dene.* 1) Kendi günlük hayatından üç YZ örneği yaz: navigasyon, çeviri, film önerisi gibi. Her birine bir sütun ver. 2) Dördüncü ve beşinci kart aynı sütunda; aynı soru mu? İkisine ayrı ayrı sor: her alanı öğrenebiliyor mu (genel), gerçekten anlıyor mu (güçlü)? 3) Satranç motoruna “bana bir çorba tarifi ver” desen ne olur? Cevabını, dar YZ’nin tanımını bir cümleyle yazarak ver. Canlı demo: [QR 1.5]

#### Teknik derinlik

Zayıf (dar) YZ, belirli görevleri yerine getiren ama gerçek anlama ya da bilince sahip olmayan sistemlerdir; bugünkü tüm sistemler bu kapsamdadır. Terimleri felsefeci John Searle (1980, Çince Oda argümanı) ortaya attı.

Searle’ün “güçlü YZ” terimi makinenin gerçekten anlayıp anlamadığı (bir zihne sahip olup olmadığı) sorusuna dairdir; günlük dilde ise çoğu zaman “genel yapay zekâ” (AGI) ile karıştırılır. AGI, alanlar arası genelleme yapabilen varsayımsal bir yetenek düzeyidir; “güçlü YZ” ise felsefi bir iddiadır. İkisi aynı şey değildir.

AGI tanımında bile bilinç şartı yoktur: genel olmak, bilinçli olmak demek değildir.

Fikirler yüz yıldır ortadaydı. Öyleyse dar YZ bile neden ancak son yıllarda hayatımıza girdi?

### 1.7 Neden tam şimdi? Moore yasası

Fikirler 1900’lerin ortasında hazırdı ama makineler cılızdı. Şu eski pirinç masalını bilir misin? Satranç tahtasının ilk karesine bir pirinç, sonraki her kareye öncekinin iki katı... Daha tahtanın yarısında ambarlar yetmez olur. 1965’te Gordon Moore, çiplerdeki transistörlerin tıpkı böyle düzenli aralıklarla ikiye katlandığını fark etti; 1975’te bu aralığı kabaca iki yıl olarak belirledi.

İkiye katlanmak masum görünür ama tekrar tekrar olunca patlar. Aşağıda kendin dene: Şekil 1.6’daki tabloda sayıyı her iki yılda bir ikiye katla, nasıl fırladığını gör. Modern YZ’yi taşıyan da bu katlana katlana biriken işlem gücü.

> **Kenar notu.** Bir kâğıdı 42 kez katlayabilseydin kalınlığı Ay’a ulaşırdı. Üstel büyümenin gücü bu; çipler onlarca yıl bu hızla büyüdü.

**Şekil 1.6 · Üstel büyümeyi hisset**
![Şekil 1.6](../../figures/out/tr/sekil-1-6-exp.svg)

*Kurulum.* Şekil 1971’den başlıyor. O yıl piyasaya çıkan ilk mikroişlemci Intel 4004’te 2.300 transistör vardı. Şekildeki her basamak “iki yıl geçti, sayı ikiye katlandı” demek; basamaklar 26 katlamada, 2023’te biter. Sağdaki iki küçük grafik aynı sayıları 2023’e kadar taşır: doğrusal ölçekte eğri önce yere yapışır, sonra fırlar; logaritmik ölçekte düz bir çizgidir.

*Adım adım.* Tabloyu satır satır oku. Üçüncü sütun 2ⁿ, dördüncü sütun 2.300 × 2ⁿ. Her satır bir öncekinin tam iki katı; başka hiçbir kural yok.

| Katlama (n) | Yıl | 2ⁿ | Transistör |
|---|---|---|---|
| 0 | 1971 | 1 | 2.300 |
| 1 | 1973 | 2 | 4.600 |
| 2 | 1975 | 4 | 9.200 |
| 3 | 1977 | 8 | 18.400 |
| 4 | 1979 | 16 | 36.800 |
| 5 | 1981 | 32 | 73.600 |
| 6 | 1983 | 64 | 147.200 |
| 7 | 1985 | 128 | 294.400 |
| 8 | 1987 | 256 | 588.800 |
| 9 | 1989 | 512 | 1.177.600 |
| 10 | 1991 | 1.024 | 2.355.200 |
| 11 | 1993 | 2.048 | 4.710.400 |
| 12 | 1995 | 4.096 | 9.420.800 |
| 13 | 1997 | 8.192 | 18.841.600 |

İlk satırlar uslu: 2.300, 4.600, 9.200. On yılda sayı 32 katına çıkıyor ama hâlâ on binlerde. 1989’da bir milyon eşiği aşılıyor: 1.177.600, yuvarlarsan 1.2 milyon. 1997’de 18.8 milyon. Tablo 13 katlamada, 26 yılda duruyor; şekildeki basamaklar 26 katlamaya kadar gidiyor.

Devam etsen ne olur? 20 katlamada, 2011’de, 2ⁿ = 1.048.576 ve sayı 2.411.724.800, kabaca 2.4 milyar. 26 katlamada, 2023’te, 2ⁿ = 67.108.864 ve sayı 154.350.387.200, kabaca 154.4 milyar. 1971 ile 2023 arasında, 26 katlamada, 67 milyon kat fark var. Pirinç masalında ambarlar tahtanın 32. karesinde doluyordu; çipler 26. kareye 2023’te vardı.

*Ne oluyor?* Her satır “iki yıl geçti, güç ikiye katlandı” demek. Birkaç satırda sayı kontrolden çıkıyor; üstel büyüme böyle bir şey. Bilgisayarlar onlarca yıl bu hızla güçlendi; bugünkü yapay zekâyı mümkün kılan birikim de bu.

*Kendin dene.* 1) Tabloyu iki satır uzat: 1999 ve 2001 için 2ⁿ ve transistör sayısı. 2) 2.300’den başlayıp bir milyonu ilk geçen satır hangisi; kaç yıl sürdü? 3) Katlama süresi 2 değil 3 yıl olsaydı 1995’te kaç transistör olurdu? Tablodaki 1995 değeriyle karşılaştır. Canlı demo: [QR 1.6]

#### Teknik derinlik

Moore yasası bir doğa yasası değil, ampirik bir gözlem ve ekonomik eğilimdir: entegre devredeki transistör sayısı yaklaşık her iki yılda bir ikiye katlanır (Moore’un 1965 gözlemi, 1975’te revize edildi). Bu üstel büyüme, derin öğrenmenin gerektirdiği yoğun matris hesaplamalarını ekonomik kıldı.

Üstel eğilim ~50 yıl sürdü (1971 Intel 4004: ~2.300 transistör → 2020’ler: on milyarlarca). Son yıllarda fiziksel sınırlar (atom-altı ölçek, ısı) nedeniyle yavaşlıyor; sektör artık paralelleştirme ve GPU/TPU gibi özel YZ donanımına yöneliyor.

Üstel büyüme: yaklaşık her 2 yılda ×2; n katlamada 2^n kat artış.

Şekil 1.6’nın formülü: N(t) = N₀ · 2^(t/2), t = 1971’den bu yana geçen yıl, N₀ = 2.300. t = 52 için N = 2.300 · 2²⁶ ≈ 1.5 × 10¹¹. Gerçek çipler bu eğrinin biraz altında kalır; katlama süresi 2000’lerden sonra uzamıştır.

Zekâ, ikili kod, algoritma, Turing makinesi, depolanmış program, dar ile genel ayrımı, üstel büyüme. Aşağıdaki altı soru bunları yokluyor.

### 1.8 Kendini test et

*Cevaplar kitabın sonunda.*
1. Howard Gardner ne öne sürdü?
   a) Beynin bir bilgisayar olduğunu
   b) Zekânın tek değil, birçok türü olduğunu
   c) Zekânın IQ ile tam ölçüldüğünü
   d) Makinelerin asla düşünemeyeceğini

2. İkili kod hangi sembollerden oluşur?
   a) A’dan Z’ye
   b) Noktalar ve çizgiler
   c) 0–9 arası
   d) 0 ve 1

3. Turing makinesi temelde ne yapabilir?
   a) Yalnızca satranç oynar
   b) Basit kurallarla prensipte her hesaplamayı
   c) Sadece toplama yapar
   d) Yalnızca metin saklar

4. Von Neumann mimarisinin temel fikri?
   a) İnterneti icat etmek
   b) Program ve veriyi aynı bellekte tutmak
   c) Her iş için kabloları yeniden bağlamak
   d) Ondalık yerine ikili kullanmak

5. Bugünkü yapay zekâlar hangi türdedir?
   a) Güçlü YZ
   b) Dar (narrow) YZ
   c) Genel YZ (AGI)
   d) Bilinçli YZ

6. Moore yasası ne der?
   a) İnternet hızı sabittir
   b) YZ insanı geçecek
   c) Transistör sayısı ~her 2 yılda ikiye katlanır
   d) Bilgisayarlar her yıl ucuzlar

### Bu bölümden kalanlar

- Zekâ tek bir sayı değil; Gardner’ın sekiz türünde bugünkü YZ dilde ve mantıkta güçlü, bedende ve duyguda zayıf.
- “Düşünmek hesaplamaktır” fikri için iki taş yeter: ikili kod (0 ve 1) ve algoritma (net adım listesi).
- Sekiz kutu 0’dan 255’e her sayıyı tutar; yanık kutuların ağırlıklarını toplamak yeter.
- Turing makinesi yalnızca oku, yaz ve bir kare kay hamleleriyle her hesabı yapar; 5’e 1 eklemek sekiz hamle sürdü.
- Depolanmış program: talimat da veri gibi bellekte durur; işlemci getir, yürüt, yaz döngüsünü hiç durmadan çevirir.
- Bugünkü her YZ dardır; genel YZ (AGI) henüz yok, bilinçli makine ise başka bir soru.
- Moore yasası: transistörler kabaca her iki yılda ikiye katlandı; 1971’deki 2.300, 26 katlamada 154 milyara ulaşır.

<!-- SOURCE-CHANGES
Bu kitap “bir varmış bir yokmuş” diye başlamıyor; çünkü bu hikâye bitmedi, sen de içindesin. Başlangıcıysa çok eskiye, bilgisayarlardan çok öncesine uzanıyor. O gün sorulan soru şuydu: Düşünmek dediğimiz şey ne? Kafamızın içinde bir tür çark dönüyorsa, aynı çarkı bir makine de döndüremez mi? İnsanlar yüzyıllardır bunu tartışıyor. ||| Bu kitap “bir varmış bir yokmuş” diye başlamıyor; çünkü bu hikâye bitmedi, sen de içindesin. Başlangıcıysa çok eskiye, bilgisayarlardan çok öncesine uzanıyor. O günden beri sorulan soru aynı: düşünmek dediğimiz şey ne? Kafamızın içinde bir tür çark dönüyorsa, aynı çarkı bir makine de döndüremez mi? İnsanlar yüzyıllardır bunu tartışıyor.
Bu ilk bölümde yolun en başına gidiyoruz. Zekâ denen şey ne? “Düşünmek” gerçekten adım adım bir tarife dökülebilir mi? Babbage’ın dişli çarklarından modern bilgisayarın doğuşuna yürüyeceğiz. Yol bittiğinde, yapay zekânın (kısaca YZ) neden mümkün olduğu kendiliğinden görünecek. ||| Bu ilk bölümde yolun en başına gidiyoruz. Zekâ denen şey ne? Düşünmek gerçekten adım adım bir tarife dökülebilir mi? Babbage’ın dişli çarklarından modern bilgisayarın doğuşuna yürüyeceğiz. Yol bittiğinde, yapay zekânın (kısaca YZ) neden mümkün olduğu kendiliğinden görünecek.
YZ aslında yeni değil. “Makineler düşünebilir mi?” sorusu 1600’lerden beri filozofları meşgul ediyor. Yeni olan, buna cevap verebilecek donanım. ||| YZ yeni değil. “Makineler düşünebilir mi?” sorusu 1600’lerden beri filozofları meşgul ediyor. Yeni olan, buna cevap verebilecek donanım.
Bu bölüm zekânın tanımından başlar; hesaplama kuramının taşlarını (ikili gösterim, algoritma, Turing makinesi, depolanmış-program mimarisi) döşer ve “zayıf/güçlü YZ” ayrımıyla modern tartışmaya bağlanır. Böylece sonraki bölümlerde gelecek öğrenme ve sinir ağı kavramları için sağlam bir zemin kurulmuş olur. ||| Bu bölüm zekânın tanımından başlar; hesaplama kuramının taşlarını (ikili gösterim, algoritma, Turing makinesi, depolanmış-program mimarisi) döşer ve “zayıf/güçlü YZ” ayrımıyla modern tartışmaya bağlanır. Sonraki bölümlerin öğrenme ve sinir ağı kavramları bu zemine oturur.
Psikolog Howard Gardner da tam bunu söylemiş: Zekâ tek bir sayıya (IQ) sığmaz; birden çok türü vardır. Aşağıda bu türleri keşfet, ilginç olanı da fark et: Bugünkü YZ kimisinde usta, kimisinde daha emekleme çağında. ||| Psikolog Howard Gardner da böyle düşünmüş: zekâ tek bir sayıya (IQ) sığmaz; birden çok türü vardır. Aşağıda bu türlere bak; bugünkü YZ kimisinde usta, kimisinde daha emekleme çağında.
Bir hesap makinesi aritmetikte senden milyon kat hızlı ama bir şakaya gülemez. “Zeki” olmak tek bir eksen değildir. ||| Bir hesap makinesi aritmetikte senden milyon kat hızlı ama bir şakaya gülemez. Zeki olmak tek bir eksen değildir.
Gardner’a göre zekâ tek bir sayı değil, sekiz ayrı yetenek ailesidir; şekildeki her kart bunlardan biri. Şunu da fark et: Bugünkü yapay zekâ dilde ve mantıkta çok iyi ama beden ve duygu işlerinde küçük bir çocuğun bile gerisinde. ||| Gardner’a göre zekâ tek bir sayı değil, sekiz ayrı yetenek ailesidir; şekildeki her kart bunlardan biri. Bugünkü yapay zekâ dilde ve mantıkta çok iyi ama beden ve duygu işlerinde küçük bir çocuğun bile gerisinde.
Her kart, Howard Gardner’ın çoklu zekâ kuramındaki sekiz alandan biri (kuram psikometride tartışmalıdır). Asıl ders şu: zekâ tek boyutlu değildir ve YZ bu boyutlarda son derece dengesizdir; dil ve mantıkta güçlü, bedensel ve sosyal/içsel alanlarda zayıftır. ||| Asıl ders, zekânın tek boyutlu olmaması: YZ dil ve mantıkta güçlü, bedensel ve sosyal/içsel alanlarda zayıftır.
Şimdi mutfağa girelim. Elinde bir kek tarifi var: yumurtayı kır, çırp, unu ekle, fırına ver. Tarifi harfi harfine izleyen biri, kek yapmayı hiç “anlamasa” bile ortaya kek çıkarır. Yapay zekânın temelindeki fikir tam bu: Belki “düşünmek” de küçük, mekanik adımları sırayla uygulamaktır. ||| Şimdi mutfağa girelim. Elinde bir kek tarifi var: yumurtayı kır, çırp, unu ekle, fırına ver. Tarifi harfi harfine izleyen biri, kek yapmayı hiç anlamasa bile ortaya kek çıkarır. Yapay zekânın temelindeki fikir de bu: belki düşünmek de küçük, mekanik adımları sırayla uygulamaktır.
• Net bir adım listesi (yani tarifin kendisi: algoritma) ||| • Net bir adım listesi (tarifin kendisi: algoritma)
Sekiz kutu, sekiz ampul: sönük 0, yanık 1 demek. Peki bu değerleri kutulara kim dağıttı? Şöyle düşün: En sağdaki kutu en küçüğü, 1’i tutar. Sola doğru her kutu, sağ komşusunun iki katını yüklenir: 1, 2, 4, 8, 16, 32, 64 ve en solda 128. Neden hep iki katı? Çünkü her yeni kutu, sağındaki kutuların toplamından bir fazlasını söyleyebilmeli; yoksa arada söylenemeyen sayılar kalırdı. Şimdi yanık kutuların değerlerini topla: İşte sayın. Bilgisayarın bütün dünyası, bu aç-kapa oyunundan ibaret. ||| Sekiz kutu, sekiz ampul: sönük 0, yanık 1 demek. Değerler neden böyle? En sağdaki kutu en küçüğü, 1’i tutar. Sola doğru her kutu, sağ komşusunun iki katını yüklenir: 1, 2, 4, 8, 16, 32, 64 ve en solda 128. Her yeni kutu, sağındaki kutuların toplamından bir fazlasını söyleyebilmeli; yoksa arada söylenemeyen sayılar kalırdı. Yanık kutuların değerlerini topla, sayın çıkar. Bilgisayarın bütün dünyası bu aç-kapa oyunu.
Yaklaşık yüz yıl sonra Alan Turing hayali bir adım öteye taşıdı: Bandı okuyan, yazan ve iki yana kayan tek bir kutucuk, prensipte her hesabı yapabilir. Buna Turing makinesi denir. Şekil 1.3’te gerçek bir tanesinin nasıl “düşündüğünü” kare kare izle. ||| Yaklaşık yüz yıl sonra Alan Turing hayali bir adım öteye taşıdı: Bandı okuyan, yazan ve iki yana kayan tek bir kutucuk, prensipte her hesabı yapabilir. Buna Turing makinesi denir. Şekil 1.3’te gerçek bir tanesinin nasıl düşündüğünü kare kare gör.
Makine bandın üzerinde bir karınca gibi yürüyor: önce sağa gidip sayının ucunu buluyor, sonra dönüp 1 ekliyor. Eldeyi taşıyışı, senin kâğıtta toplama yapışından farksız. Bu minicik hamlelerle her hesap yapılabiliyor. Bütün büyü işte bu. ||| Makine bandın üzerinde bir karınca gibi yürüyor: önce sağa gidip sayının ucunu buluyor, sonra dönüp 1 ekliyor. Eldeyi taşıyışı, senin kâğıtta toplama yapışından farksız. Her hesap bu minicik hamlelerle yapılıyor; başka bir şey yok.
Makine sağa kayarak bandın sonuna gider, sonra sola dönerek ikili sayıya 1 ekler (elde mantığı): gördüğü 1’ler 0 olur, ilk 0 ise 1 olur. Yalnızca oku/yaz ve durum geçişleriyle toplama yapar. ||| Makine sağa kayarak bandın sonuna gider, sonra sola dönerek ikili sayıya 1 ekler (elde mantığı): gördüğü 1’ler 0 olur, ilk 0 ise 1 olur.
1945’te dev bir makine gürledi: ENIAC. Tonlarca ağırlığında, on binlerce lambayla çalışan bu ilk elektronik bilgisayarın huysuz bir yanı vardı: Ona yeni bir iş öğretmek için kablolarını günlerce elle söküp takmak gerekiyordu. ||| 1945’te dev bir makine gürledi: ENIAC. Tonlarca ağırlığında, on binlerce lambayla çalışan bu ilk elektronik bilgisayarın huysuz bir yanı vardı: ona yeni bir iş öğretmek için kablolarını günlerce elle söküp takmak gerekiyordu.
Çözüm zarif bir fikirle geldi: Tarifi de malzemelerin yanına, yani belleğe koy. Böylece makineyi yeniden kablolamak yerine yalnızca yeni “talimat” yüklersin. Cebindeki telefon dahil bugün neredeyse her bilgisayar bu düzeni kullanır. Aşağıdaki şekilde döngünün dönüşünü izle, sonra parçalarının ne yaptığına bak. ||| Çözüm zarif bir fikirle geldi: tarifi de malzemelerin yanına, belleğe koy. Böylece makineyi yeniden kablolamak yerine yalnızca yeni talimat yüklersin. Cebindeki telefon dahil bugün neredeyse her bilgisayar bu düzeni kullanır. Aşağıdaki şekilde önce döngünün dönüşüne, sonra parçalarının ne yaptığına bak.
ENIAC’ı yeniden programlamak günler sürerdi; kabloları elle bağlamak gerekirdi. “Programı belleğe koyma” fikri bu yüzden bir devrimdi. ||| ENIAC’ı yeniden programlamak günler sürerdi; kabloları elle bağlamak gerekirdi. Programı belleğe koyma fikri bu yüzden büyük bir adımdı.
“Getir” evresinde kontrol birimi bir sonraki talimatı bellekten okur; program da veri gibi bellekte durur (depolanmış-program ilkesi). “Yürüt”te işlemci işi yapar, “Yaz”da sonuç dışarı verilir. ||| “Getir” evresinde kontrol birimi bir sonraki talimatı bellekten okur; “Yürüt”te işlemci işi yapar, “Yaz”da sonuç dışarı verilir.
İnsan gibi her alanda öğrenebilen varsayımsal sisteme “genel yapay zekâ” (AGI) denir; öylesi daha yapılmadı. Aşağıdaki örnekleri sen ayır: Hangisi bugün var, hangisi hâlâ bilim kurgu? ||| İnsan gibi her alanda öğrenebilen varsayımsal sisteme “genel yapay zekâ” (AGI) denir; öylesi daha yapılmadı. Aşağıdaki örnekleri sen ayır: hangisi bugün var, hangisi hâlâ bilim kurgu?
Püf noktası şu: tek işte usta olan her sistem “dar” sınıfına girer, sohbet botları bile. “Genel” olan, insan gibi her alanda öğrenebilen makinedir ve öylesi henüz yok. Bilinçli makine ise apayrı bir hikâye. ||| Tek işte usta olan her sistem dar sınıfına girer, sohbet botları bile. Genel olan, insan gibi her alanda öğrenebilen makinedir ve öylesi henüz yok. Bilinçli makine ise apayrı bir hikâye.
Önemli ayrım: Searle’ün “güçlü YZ” terimi aslında makinenin gerçekten anlayıp anlamadığı (bir zihne sahip olup olmadığı) sorusuna dairdir; günlük dilde ise çoğu zaman “genel yapay zekâ” (AGI) ile karıştırılır. AGI, alanlar arası genelleme yapabilen varsayımsal bir yetenek düzeyidir; “güçlü YZ” ise felsefi bir iddiadır. İkisi aynı şey değildir. ||| Searle’ün “güçlü YZ” terimi makinenin gerçekten anlayıp anlamadığı (bir zihne sahip olup olmadığı) sorusuna dairdir; günlük dilde ise çoğu zaman “genel yapay zekâ” (AGI) ile karıştırılır. AGI, alanlar arası genelleme yapabilen varsayımsal bir yetenek düzeyidir; “güçlü YZ” ise felsefi bir iddiadır. İkisi aynı şey değildir.
Dikkat: “genel” (AGI, yani alanlar arası genelleme) ile “güçlü YZ” (Searle: makine gerçekten anlıyor/bilinçli mi?) farklı sorulardır. AGI tanımında bile bilinç şartı yoktur: genel olmak, bilinçli olmak demek değildir. ||| AGI tanımında bile bilinç şartı yoktur: genel olmak, bilinçli olmak demek değildir.
İkiye katlanmak masum görünür ama tekrar tekrar olunca patlar. Aşağıda kendin dene: Şekil 1.6’daki tabloda sayıyı her iki yılda bir ikiye katla, nasıl fırladığını gör. Modern YZ’yi taşıyan güç, işte bu katlana katlana biriken işlem gücü. ||| İkiye katlanmak masum görünür ama tekrar tekrar olunca patlar. Aşağıda kendin dene: Şekil 1.6’daki tabloda sayıyı her iki yılda bir ikiye katla, nasıl fırladığını gör. Modern YZ’yi taşıyan da bu katlana katlana biriken işlem gücü.
Bir kâğıdı 42 kez katlayabilseydin kalınlığı Ay’a ulaşırdı. Üstel büyümenin gücü budur; çipler onlarca yıl bu hızla büyüdü. ||| Bir kâğıdı 42 kez katlayabilseydin kalınlığı Ay’a ulaşırdı. Üstel büyümenin gücü bu; çipler onlarca yıl bu hızla büyüdü.
Üstel büyüme: yaklaşık her 2 yılda ×2; n katlamada 2^n kat artış. Bu bir doğa yasası değil, ampirik bir eğilimdir ve son yıllarda fiziksel sınırlar yüzünden yavaşlamaktadır. ||| Üstel büyüme: yaklaşık her 2 yılda ×2; n katlamada 2^n kat artış.
-->

<!-- REDAKSİYON NOTLARI
- 1.4 teknik: "Aşağıdaki simülasyon" → "Şekil 1.3’teki simülasyon" (şekil artık paragrafın üstünde; 2026-09-10 kararı). Şekil 1.3 durum etiketi "ekle": metin etikete uyduruldu; bant gözleri "göz", film kareleri "kare".
- 1.6 teknik "Ne oluyor" (birebir): "AGI’nin ‘bilinç’ çubuğu bile sıfırdır" → "AGI tanımında bile bilinç şartı yoktur" (kâğıtta çubuk yok; EN ile aynı karar).
- Kâğıda uyarlandı (2026-09-30): 1.2 teknik "Bu, Howard Gardner’ın … sekiz alandan biri" ("Bu" dokunulan karta gönderme).
- 1.4 basit: "Aşağıda gerçek bir tanesinin nasıl 'düşündüğünü' izle." → "Şekil 1.3'te gerçek bir tanesinin nasıl 'düşündüğünü' kare kare izle."
- 1.5 basit: "Aşağıda döngünün dönüşünü izle, sonra parçalarına dokun." → "Aşağıdaki şekilde döngünün dönüşünü izle, sonra parçalarının ne yaptığına bak."
- 1.7 basit: "Aşağıda kendin dene: Her 2 yılda bir 'ikiye katla'ya bas, sayının nasıl fırladığını gör." → "Aşağıda kendin dene: Şekil 1.6'daki tabloda sayıyı her iki yılda bir ikiye katla, nasıl fırladığını gör."
- Dokunulmadı (kâğıtta anlamlı, hemen ardından Şekil geliyor): 1.2 basit "Aşağıda bu türleri keşfet"; 1.3 basit "Aşağıda ikili kodun nasıl çalıştığını kendin gör"; 1.6 basit "Aşağıdaki örnekleri sen ayır".
- Kâğıda uyarlandı (2026-09-30; ekran fiilleri kaynak metinde de çözüldü): Şekil 1.1 Ne oluyor "dokunduğun kart bunlardan biri"; Şekil 1.6 Ne oluyor "Her basış 'iki yıl geçti…'" ve "Birkaç basışta"; 1.4 teknik "Aşağıdaki simülasyon" (Şekil 1.3 artık bu paragrafın üstünde).
- Kurulum'larda kaynak hint'ler ekran fiillerinden arındırıldı ("dokun", "bas", "⏸", "Otomatik" yok).
- Şekil 1.5 (classify) "Kendini sına" demosu: Adım adım yerine işaretleme tablosu; gerekçeler cevaplar/M01.md'de.
- Sayı biçimi: tablolarda binlik ayracı kaynak teknik metindeki gibi nokta (2.300, 17.500); düzyazıda demonun yuvarlaması virgülle ("1.2 milyon"). Kılavuz §1 "tablolarda ondalık nokta" kuralı ondalık için; teknik formülde 1.5 × 10¹¹ ondalık noktayla.
- Yazar kararı (2026-09-10): kaynak metin dahil tüm "demo" sözcükleri "gösterim" ya da "Şekil N.j" yapıldı; "Aşağıdaki demo" → şekil öncesinde "Aşağıda yer alan gösterim (Şekil N.j)", sonrasında "Şekil N.j'teki gösterim".
- 2026-09-30 insanlaştırma geçişi: humanize-tr-report.md bulguları uygulandı; "Peki/Cevap/Sıradaki bölüm" köprüleri, "tam olarak/işte/ibaret" çivileri, punchline'lar, "Ekranda … kâğıtta …" cümleleri, "kenar notundaki" göndermeleri, "aslında/yani" dolguları, "büyü/devrim" sözcükleri ve kavram tırnakları temizlendi. Teknik "Ne oluyor" paragraflarında ilk teknik paragrafı tekrar eden cümleler kırpıldı (1.2, 1.4, 1.5, 1.6, 1.7; kâğıtta bitişik durdukları için; dijital sürüm tam hâlini koruyabilir). Kaynak paragraf değişiklikleri yukarıdaki SOURCE-CHANGES bloğunda.
-->
