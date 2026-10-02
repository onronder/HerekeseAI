# Bölüm 6
## YZ’yi Kullanmak ve İnşa Etmek
*İstemden ajana, mimariden gerçek dünyaya*

<!-- acc #2a7d86 · tag Uygulama -->

### 6.1 YZ’yi kullanmak ve inşa etmek

Çok bilen ama atölyesi olmayan bir usta düşün: Eline alet verilmemiş, defterine bakması yasak, dünkü konuşmayı bile hatırlamıyor. Tek başına bir dil modeli böyledir. Onu işe yarar bir asistana çeviren şey, etrafına kurduğumuz atölyedir: iyi istemler, modeli kendi verinle besleme (RAG), araç kullanımı, ajanlar ve sağlam bir mimari. Şimdi bu atölyeyi parça parça kuracağız; sonunda da bu araçların gerçek dünyada neleri dönüştürdüğüne bakacağız.

> **Kenar notu.** Bugün rekabet avantajı çoğu zaman “en büyük modele sahip olmak” değil, “modeli kendi verin ve araçlarınla en iyi şekilde kullanmak”tır. Bu bölüm bunu anlatıyor.

#### Teknik derinlik

Önceki bölümler temel yetenekleri kurdu; bu bölüm uygulama katmanını ele alır: temel bir modeli (foundation model) güvenilir, bağlama duyarlı ve eyleme geçebilen bir ürüne dönüştüren tasarım desenleri.

Kapsam: istem mühendisliği (rol, bağlam, few-shot, format), kaynaklarla temellendirme (grounding; retrieval-augmented generation), araç/işlev çağırma ve ajan döngüleri (ReAct), tipik bir YZ uygulamasının bileşen mimarisi (orkestrasyon, bilgi tabanı, araçlar, bellek) ve sektörel uygulama örnekleri. Ana fikir, modeli değiştirmeden çevresine kurulan sistemle güvenilirliği ve faydayı artırmak.

Atölyenin ilk aleti en ucuzu: doğru soruyu sormak. Aynı modelden bambaşka cevaplar almanın yolu, istemi nasıl kurduğuna bağlı.

### 6.2 İstem mühendisliği: doğru soruyu sormak

Terziye “bana bir şey dik” dersen ne çıkacağını terzi de bilmez. Ölçünü verir, kumaşı seçer, modeli tarif edersen bambaşka olur. Dil modeli de böyledir: “Bana bir plan yap” demekle, ona bir rol verip derdini anlatmak ve istediğin biçimi söylemek arasında dağlar kadar fark var.

Bir istemi parça parça kur: rol, bağlam, örnek ve format ekledikçe modelin cevabının nasıl keskinleştiğini gör.

> **Kenar notu.** İyi istem = açık rol + yeterli bağlam + net format + (gerekirse) örnek. Modeli suçlamadan önce istemini gözden geçir; kötü cevapların bir kısmı eksik sorudan gelir.

**Şekil 6.1 · Bir istem inşa et**
![Şekil 6.1](../../figures/out/tr/sekil-6-1-prompt.svg)

*Kurulum.* Şekilde bir istem dört parçadan kuruluyor. En altta hep aynı taban istek duruyor: “Bana bir hafta sonu tatil planı öner.” Üstüne dört parça eklenebiliyor: rol, bağlam, örnek ve format. Sağda bir tamamlanma göstergesi ve o istem için yazılmış temsili bir cevap var. Gösterge yalnız kaç parça eklendiğini sayar; ölçülmüş bir cevap kalitesi değildir. Cevaplar da gerçek model çıktısı değil, anlatım için hazırlanmış örnek metinlerdir. Her eklenen parça göstergeyi yükseltir; belli eşiklerde cevap da değişir.

*Adım adım.* Önce parçaların her birinin isteme hangi cümleyi eklediğine bak.

| Parça | İsteme eklenen cümle |
|---|---|
| Taban istek | Bana bir hafta sonu tatil planı öner. |
| Rol | Sen deneyimli bir seyahat danışmanısın. |
| Bağlam | 3 kişilik bir aile, deniz kenarında, orta bütçeli bir tatil istiyor. |
| Örnek | Örnek: “Gün 1 · Sabah: …, Öğlen: …, Akşam: …” |
| Format | Cevabı gün başlıklarıyla, madde madde ver. |

Göstergenin kuralı basit: taban istek yüzde 40 puandan başlar, eklenen her parça 15 puan getirir. Kural parçanın hangisi olduğuna bakmaz, yalnız sayısına bakar; bir açıklık kontrol listesi, ölçülmüş yanıt kalitesi değil. Yüzde 60’ın altı düşük, 60 ile 84 arası orta, 85 ve üstü yüksek sayılır. Temsili cevap da bu üç düzeye göre değişir.

| Eklenen parça sayısı | Gösterge | Düzey | Temsili cevap |
|---|---|---|---|
| 0 | %40 | düşük | Bir yere gidebilirsiniz, birkaç müze gezip güzel yemekler yiyebilirsiniz. İyi tatiller! |
| 1 | %55 | düşük | (aynı cevap) |
| 2 | %70 | orta | Deniz kenarında bir destinasyon öneriyorum: sabah plaj, öğleden sonra kısa bir kasaba turu, akşam balık restoranı. Bütçeye uygun bir pansiyon seçebilirsiniz. |
| 3 | %85 | yüksek | Gün 1 · Sabah: plajda yüzme; Öğlen: sahilde hafif öğle; Akşam: yerel balıkçıda akşam yemeği. Gün 2 · Sabah: kasaba & pazar turu; Öğlen: aile dostu kafe; Akşam: gün batımı yürüyüşü. |
| 4 | %100 | yüksek | (aynı cevap) |

Parçaları sırayla ekleyerek tabloyu bir kez de kendin yürüt:

1. Yalnız taban istek: gösterge yüzde 40, düzey düşük. Cevap müzeden ve yemekten söz ediyor; deniz yok, aile yok, gün planı yok. Model ne istediğini bilmiyor, o da genelgeçer konuşuyor.
2. Rolü ekle: gösterge yüzde 55. Düzey hâlâ düşük, cevap aynı. Tek başına bir unvan vermek modele derdini anlatmıyor.
3. Bağlamı ekle: gösterge yüzde 70, düzey orta. Cevap birden deniz kenarına, plaja, pansiyona geliyor. Model artık kimin için plan yaptığını biliyor.
4. Örneği ekle: gösterge yüzde 85, düzey yüksek. Cevap gün başlıklarına ve sabah, öğlen, akşam bölmelerine giriyor; örnekteki kalıbın aynısı.
5. Formatı da ekle: gösterge yüzde 100. Cevap değişmiyor; çubuk tavana varıyor. İstenen biçim zaten örnekle gelmişti; format satırı listeyi tamamlıyor. Gerçekte biçim kuralı bir garanti değil, modele verilen bir talimattır.

Cevap ikinci parçada değişti. Şekilde bu yalnızca bir sayma meselesi; pratikte unvan tek başına az iş görür, durumu anlatmak çok. Her parça kaliteyi kesin yükseltmez: göreve uygun bağlam ve biçim yardımcı olabilir, gereksiz ya da çelişkili ayrıntı sonucu kötüleştirebilir.

*Ne oluyor?* Bir isteme rol (kim olsun), bağlam (durum), örnek ve format ekledikçe modele ne istediğini daha net anlatırsın. Göreve uygun parçalar cevabı çoğu zaman iyileştirir; gereksiz ya da çelişkili ayrıntı ise kötüleştirebilir. Buradaki puan bir tamamlanma göstergesidir, ölçülmüş kalite değil. Model yeniden eğitilmiyor; ona sadece daha iyi bir soru sorulmuş oluyor.

*Kendin dene.* 1) Yalnız bağlam ve format işaretli olsa gösterge kaç olur, düzey ne çıkar, hangi cevap gelir? 2) Yüksek düzeye ulaşmak için en az kaç parça gerekir? İki parça neden yetmez? 3) “Bana bir e-posta yaz” isteğine kendi rol, bağlam, örnek ve format cümlelerini yaz. Canlı demo: [QR 6.1]

#### Teknik derinlik

İstem mühendisliği, modeli yeniden eğitmeden davranışını yönlendirme pratiğidir. Etkili bileşenler: sistem/rol tanımı, görev bağlamı, çıktı formatı kısıtları ve örnekler. Sıfır-atış (zero-shot) yerine birkaç-atış (few-shot) örnekler genelde tutarlılığı artırır.

İleri teknikler: adım adım düşündürme (chain-of-thought), kendini doğrulama, kısıt/şema dayatma (ör. JSON), ve görevi alt-görevlere bölme. İstem; bağlam penceresini ve dolayısıyla maliyeti de etkiler, çünkü uzun örnekler token tüketir.

Gösterge ~%40’tan başlar ve her parçayla 15 puan artar; bu bir tamamlanma göstergesidir, ölçülmüş kalite puanı değil.

Şekil 6.1’in puanı bir tamamlanma göstergesidir: gösterge = min(100, 40 + 15·n), n eklenen parça sayısı. Düzey eşikleri: gösterge ≥ 85 yüksek, 60 ≤ gösterge < 85 orta, altı düşük; cevaplar temsilidir, model çağrısı yoktur. Gerçek sistemlerde kalite böyle doğrusal artmaz; ölçmek için bir değerlendirme kümesi (eval set) ve bir puanlayıcı gerekir.

İyi kurulmuş bir istem bile modelin hiç görmediği bilgiyi yaratamaz. Şirketinin izin kuralını modele kim söyleyecek?

### 6.3 RAG: modele kendi verini ver

Bir dil modeli senin şirket belgelerini, notlarını, güncel verini bilmez; okulu belli bir tarihte bitmiştir. Sorarsan da bozuntuya vermez, kendinden emin bir tonla uydurabilir (halüsinasyon). Çözüm, iyi bir kütüphaneci tutmak kadar basit: Cevaptan önce rafa gidilir, doğru belge bulunur ve modele “işte kaynak, buna göre cevapla” denir.

Buna RAG (bilgiyle desteklenmiş üretim) deniyor. Bir soru seç ve Şekil 6.2’de RAG’ın kapalı ve açık hâlini karşılaştır: kapalıyken model tahmin eder, açıkken ilgili belgeyi bulup ona dayanarak cevaplar.

> **Kenar notu.** RAG, modeli “açık kitap sınavına” sokmak gibidir: artık ezberden değil, önündeki kaynaktan cevaplaması istenir. Kurumsal YZ uygulamalarının çoğunun belkemiği budur.

**Şekil 6.2 · Kaynağa dayalı cevap**
![Şekil 6.2](../../figures/out/tr/sekil-6-2-rag.svg)

*Kurulum.* Şekilde üç İK sorusu var. Her sorunun karşısında iki cevap duruyor: RAG kapalıyken modelin kaynaksız tahmini, RAG açıkken kaynaklı cevabı. Açık tarafta arada bir kutu daha var: şirket belgesinden bulunup modele verilen kaynak parçası. Kapalı tarafta o kutu boş; cevabın yanında “Doğrulanmadı” uyarısı duruyor. İki taraf arasında tek fark kütüphanecinin devrede olup olmaması; soru da model de aynı. Şekil üç hazır soru, belge parçası ve cevap çiftiyle akışı canlandırır; gerçek bir model ya da arama çalıştırmaz.

*Adım adım.* Üç soruyu ve iki durumu tek tabloda karşılaştır.

| Soru | Bulunan kaynak parçası (RAG açık) | RAG kapalı: kaynaksız tahmin | RAG açık: kaynaklı cevap |
|---|---|---|---|
| Yıllık izin hakkım kaç gün? | İK Politikası §4: Tam zamanlı çalışanlara yılda 20 gün ücretli yıllık izin verilir; 5 yıldan sonra 26 güne çıkar. | Genelde yıllık izin 14 gün civarındadır ama şirketinize göre değişebilir. | İK Politikası §4’e göre tam zamanlı çalışanlar yılda 20 gün ücretli izin alır (5 yıldan sonra 26 gün). |
| Uzaktan çalışma kuralı nedir? | İK Politikası §7: Çalışanlar haftada en fazla 3 gün uzaktan çalışabilir; Salı günleri ofiste olunması beklenir. | Çoğu şirkette haftada 2 gün uzaktan çalışmaya izin verilir sanırım. | İK Politikası §7’ye göre haftada en fazla 3 gün uzaktan çalışılabilir; Salı günü ofiste olunması beklenir. |
| Yemek harcama limiti ne kadar? | Harcama Yönergesi §2: İş yemeklerinde kişi başı günlük limit 500 TL’dir; fatura ibrazı zorunludur. | Limit muhtemelen 250–300 TL arasıdır, emin değilim. | Harcama Yönergesi §2’ye göre iş yemeklerinde kişi başı günlük limit 500 TL’dir ve fatura gerekir. |

Şimdi satırları tek tek oku:

1. İzin sorusu. Kapalıyken model “14 gün civarında” diyor; pek çok şirkete uyan ama seninkine uymayan genel bir sayı. Şirketin kuralı 20 gün. Model yalan söylemiyor, ilgisiz konuşuyor; senin şirketini hiç görmedi. Açıkken kütüphaneci §4’ü getiriyor; cevap hem 20 günü hem 5 yıl sonraki 26 günü söylüyor.
2. Uzaktan çalışma. Tahmin “2 gün, sanırım”; belge 3 gün diyor ve Salı günü ofis şartı ekliyor. Salı ayrıntısını hiçbir model kendi başına bilemez; o bilgi yalnız belgede var.
3. Harcama limiti. Tahmin “250 ile 300 TL arası, emin değilim”; belge 500 TL diyor ve fatura zorunluluğunu ekliyor. Tahmin gerçeğin yarısı civarında kalmış.

Üç satırda aynı örüntü var. Tahminler makul duruyor ama üçü de yanlış; üstelik her birinde bir kaçamak kelime var: civarında, sanırım, muhtemelen. Kaynaklı cevaplar ise bir sayı, bir madde numarası ve bir koşul veriyor. Kaynak gösterildiği için doğrulamak da kolay: belgede §4’ü bul, karşılaştır. Bu doğrulama gerekli de: kaynak göstermek doğruluk garantisi değildir. Cevabın kaynağa gerçekten dayanıp dayanmadığı ve kaynağın doğru olup olmadığı ayrıca denetlenir; kesin ton tek başına ölçüt değildir. Kaynak parçası en az cevap kadar önemli. Yanlış parça gelirse model onu da aynı güvenle kullanır; RAG uydurmayı azaltır, getirme hatasını değil.

*Ne oluyor?* RAG kapalıyken model yalnızca ezberinden konuşur ve bilmediği özel bilgiyi uydurabilir (halüsinasyon). Açıkken önce soruyla ilgili belge bulunup modele verilir; modele yalnızca o kaynağa dayanması söylenir; model cevaplar ve kaynağı gösterir. Uydurma riski azalır, ama cevabın kaynağa gerçekten dayandığı ayrıca denetlenir; açık kitap sınavına girmek gibi.

*Kendin dene.* 1) Üç tahmin cevabındaki belirsizlik kelimelerini listele; kaynaklı cevaplarda böyle bir kelime var mı? 2) Belgelerde izinle ilgili hiçbir madde olmasaydı, RAG açıkken iyi kurulmuş bir sistem ne demeli? 3) Yeni soru: “Altı yıldır çalışıyorum, yıllık iznim kaç gün?” Tablodaki kaynak parçasına göre kaynaklı cevabı sen yaz. Canlı demo: [QR 6.2]

#### Teknik derinlik

RAG (Retrieval-Augmented Generation), ilgili kaynak parçalarını arayıp isteme ekler ve modeli o kaynaklarla temellendirir (grounding). Erişim vektör benzerliğiyle, anahtar sözcükle ya da ikisinin karışımıyla (hibrit) yapılabilir; vektör veri tabanı yaygın bir seçenektir, zorunlu değildir. Kaynak metinler ve köken bilgileri (hangi belge, hangi bölüm) erişilebilir kalmalıdır. Böylece güncel/özel bilgi, modeli yeniden eğitmeden kullanılır.

Yaygın bir hat: belgeleri parçalara böl (chunking) → indeksle (gömüyle ve/veya anahtar sözcükle) → sorguda en ilgili k parçayı getir → isteme ekle → üret. Avantaj: kaynak gösterilebilir ve halüsinasyon azalır; yine de cevabın kaynağa dayandığı doğrulanmalıdır. Zorluklar: getirme kalitesi, parça boyutu, ve bağlam penceresi sınırı.

Kapalıyken model yalnızca parametrik (ezber) bilgisine dayanır; açıkken getirilen parçaya dayanması istenir ve kaynağı gösterir, dayanma garantisi değildir.

Şekil 6.2 bu hattı hazır çiftlerle canlandırır: iki belge, üç parça (her parça tek bölüm), k = 1; soru anahtarına göre parça ve cevap önceden eşlenmiştir, gömü üretimi ya da model çağrısı yoktur. Gerçek bir sistemde soru gömüye çevrilir ya da anahtar sözcükle aranır, en ilgili parça (izin sorusu için §4) isteme eklenir; model cevaplar, parçanın adını kaynak olarak yazar ve cevabın parçaya dayandığı ayrıca denetlenir. Gerçek bir sistemde binlerce parça vardır ve asıl zorluk yanlış parçanın getirilmesidir; kötü getirme, kötü cevaptır.

Kaynağı önünde bulan model daha güvenilir konuşuyor. İş konuşmakla bitmiyorsa, hesap yapmak ya da takvime bakmak gerekiyorsa?

### 6.4 Ajanlar: düşün, araç kullan, gözlemle

Tek başına bir dil modeli yalnızca konuşur. Şimdi ustamıza aletlerini verelim: hesap makinesi, arama, takvim, bir API. Bir de şu çalışma düzenini öğretelim: “düşün → aleti kullan → sonuca bak → tekrar dene”. Ortaya bir ajan çıkar: konuşmakla kalmayıp adım adım plan yapan, işe girişen bir asistan.

Bir ajanın bir görevi adım adım nasıl çözdüğüne Şekil 6.3’te bak. Her karede ne düşündüğünü, hangi aracı çağırdığını ve ne gözlemlediğini gör.

> **Kenar notu.** Sohbet botu sana nasıl yapılacağını anlatır; ajan onu senin için yapmaya çalışır. Güç de risk de buradan gelir; o yüzden sınırlar şart.

**Şekil 6.3 · Bir ajanı izle**
![Şekil 6.3](../../figures/out/tr/sekil-6-3-agent.svg)

*Kurulum.* Şekil bir film şeridi. En üstte ajana verilen görev, altında üç kare var. Her karede üç satır okuyorsun: ajanın düşüncesi, çağırdığı araç ve aracın döndürdüğü gözlem. Son karede araç satırı boş; onun yerine son cevap var. Ajanın elinde tek alet var: bir hesap makinesi. Görevin yanında düşünce → araç → gözlem döngüsü halka olarak çizili; kareler bu halkanın üç turu. Üç adım önceden yazılmış bir senaryodur; şekil gerçek bir araç çağırmaz.

*Adım adım.* Ajana verilen görev: “Ekibe 3 pizza alacağız (tanesi 180 TL). Toplam ne kadar ve 6 kişiye bölünce kişi başı ne düşer?”

| Adım | Düşünce | Araç çağrısı | Gözlem |
|---|---|---|---|
| 1 | Önce toplam tutarı bulmalıyım: 3 × 180. | hesap_makinesi("3 * 180") | 540 |
| 2 | Şimdi kişi başını bulayım: 540 ÷ 6. | hesap_makinesi("540 / 6") | 90 |
| 3 | Yeterli bilgim var, cevabı yazabilirim. | (araç yok) | Son cevap: Toplam 540 TL; 6 kişiye bölününce kişi başı 90 TL. |

Kareleri sırayla oku:

1. İlk kare. Ajan görevi ikiye bölüyor ve önce toplamı hedefliyor. Hesabı kendisi yapmıyor; “3 * 180” karakter dizisini hesap makinesine gönderiyor. Makine 540 döndürüyor. Bu sayı ajanın ürettiği bir tahmin değil, aracın verdiği bir gözlem.
2. İkinci kare. Düşünce satırında 540 var: ilk karenin gözlemi ikinci karenin girdisi oldu. Döngü adını buradan alır: her tur öncekinin sonucunu kullanır. Makine 90 döndürüyor.
3. Üçüncü kare. Ajan elindeki iki gözleme bakıp durmaya karar veriyor. Araç çağrısı yok; iki sayıyı bir cümleye döküyor. Gerçek bir ajanda durma kararını model çıktısı verir; bu senaryoda üçüncü adım önceden “son adım” diye işaretlenmiştir.

Bu görevi model kafadan da çözebilirdi; sayılar küçük. Ama araç, doğru çalıştığı sürece, hesabı modelin tahmininden daha güvenilir yapar; aracın da bozulabileceğini ikinci sorudaki örnek gösterir. Sayılar büyüdükçe ya da iş takvime, arama motoruna, bir API’ye uzandıkça bu fark hayati olur. Şekilde döngü üç turda kapandı. Gerçek bir ajanda araç çağrısını model çıktısı seçer; uygulama ayrıca yetkiyi sınırlar (hangi araçlar, hangi eylemler), adım sınırı ve durma koşulu koyar, dış veriden gelen talimatları güvenilir komut saymaz ve önemli eylemleri onaya bağlar. Tur sınırı olmazsa kararsız kalan bir ajan aynı aracı sonsuza dek çağırabilir.

*Ne oluyor?* Ajan bir görevi adım adım çözer: önce “ne yapmalıyım?” diye düşünür, sonra bir araç kullanır (mesela hesap makinesi), aracın sonucunu görür ve bu sonuca göre bir sonraki adıma karar verir. Hedefe ulaşana kadar bu “düşün → kullan → gözlemle” döngüsünü tekrarlar. Şekildeki üç adım önceden yazılmış bir senaryodur; gerçek bir ajan araç çağrısını model çıktısına göre seçer.

*Kendin dene.* 1) Görev “4 pizza, tanesi 200 TL, 5 kişi” olsaydı üç kareyi düşünce, araç çağrısı ve gözlem sütunlarıyla kendin yaz. 2) İlk karede hesap makinesi bozulup 450 döndürseydi ikinci kare ve son cevap ne olurdu? Bu sana araçlar hakkında ne söylüyor? 3) Göreve “kişi başı bir de 30 TL içecek” eklenirse kaç araç çağrısı gerekir ve son cevap ne olur? Canlı demo: [QR 6.3]

#### Teknik derinlik

Ajan döngüsü (ör. ReAct): model bir düşünce üretir, bir eylem/araç çağrısı seçer (genelde yapılandırılmış “tool/function calling” ile), aracın çıktısını gözlem olarak alır ve hedefe ulaşana dek yineler. Araçlar modelin yeteneklerini dış dünyaya bağlar (hesap, arama, kod çalıştırma, API).

Tasarım konuları: araç şeması ve doğrulama, döngü/bütçe sınırı (sonsuz döngüyü önleme), hata yönetimi, ve güvenlik: araç izinleri sınırlandırılır, dış verideki (web sayfası, belge, e-posta) talimatlar güvenilir komut sayılmaz, önemli eylemler uygun onaya bağlanır. Çok adımlı ajanlar güçlüdür ama kırılgandır; bu yüzden izlenebilirlik ve net sınırlar şarttır.

Her gözlem bir sonraki adımı besler; döngü/bütçe sınırı sonsuz döngüyü engeller.

Şekil 6.3’teki araç çağrısı düz yazı değil, yapılandırılmış bir mesajdır; model bir şema doldurur: `{"tool": "hesap_makinesi", "input": "3 * 180"}`. Orkestrasyon bu mesajı yakalar, aracı çalıştırır ve çıktıyı (540) gözlem olarak bir sonraki isteme ekler. Şekil 6.3’teki üç adım hazır bir senaryodur; üçüncü adım `isFinal` işaretiyle önceden son adım olarak yazılmıştır, durmaya model karar vermez. Gerçek bir ajanda modelin çıktısı araç çağrısını ve durmayı belirler; uygulama bunun üstüne yetki (hangi araçlar), adım/bütçe sınırı ve durma koşulu koyar, her araç çıktısını şemaya göre doğrular ve tehlikeli eylemleri (silme, ödeme) insan onayına bağlar.

Elimizde üç alet var: iyi bir istem, bir kaynak rafı, bir araç kutusu. Bunları bir arada tutan iskelet nasıl kurulur?

### 6.5 Bir YZ uygulamasının mimarisi

Gerçek bir YZ uygulaması, iyi bir restoran gibidir; işi yalnız şef pişirmez. Siparişini alan garson vardır: arayüz. Mutfağı yöneten, kime ne zaman iş düşeceğine karar veren bir müdür vardır: orkestrasyon. Cevabı pişiren şef ise modeldir; müdür malzemeyi önüne getirir. Malzemelerin durduğu kiler bilgi tabanıdır, tezgâhtaki aletler modelin araçlarıdır, müdavimlerin defteri de bellektir.

Şekil 6.4’te parçalara tek tek bak ve her birinin sistemde ne işe yaradığını gör. Karşında tipik bir YZ ürününün iskeleti var.

> **Kenar notu.** İyi haber: bu parçaların çoğu hazır araçlarla (vektör DB, orkestrasyon kütüphaneleri) kuruluyor. Kötü haber: asıl zorluk modelde değil, bu parçaları güvenilir biçimde bir araya getirmekte.

**Şekil 6.4 · Bir YZ uygulamasının parçaları**
![Şekil 6.4](../../figures/out/tr/sekil-6-4-arch.svg)

*Kurulum.* Şekil bir akış diyagramı: solda kullanıcı, sonra beş kutu. Önce arayüz, sonra orkestrasyon; orkestrasyondan üç kol çıkıyor: bilgi tabanı, araçlar ve bellek. Orkestrasyon kutusu turuncu; altında “model çağrısı” etiketi var: model ayrı bir kutu değil, orkestrasyonun çağırdığı bir adım. Her kutunun sistemdeki rolü altındaki numaralı tabloda yazıyor.

*Adım adım.* Önce beş parçayı ve rollerini tabloda oku.

| Parça | Sistemdeki rolü |
|---|---|
| Arayüz | Kullanıcının soruyu yazdığı, cevabı gördüğü yer (sohbet ekranı, uygulama). |
| Orkestrasyon | Yöneten katman: istemi hazırlar, hangi aracı/bilgiyi ne zaman çağıracağına karar verir, modeli çağırır, akışı yönetir. |
| Model çağrısı | Orkestrasyonun hazırladığı istemi alır, cevabı üretir; Şekil 6.4’te orkestrasyon kutusunun altındaki etiket. |
| Bilgi tabanı | Senin verin (belgeler, notlar) burada özgün parçalar, metadata’sı (hangi belge, hangi bölüm) ve arama indeksiyle (gömü ve/veya anahtar sözcük) durur; RAG ile ilgili parça getirilir. |
| Araçlar | Modelin dünyayla etkileşimi: hesap, arama, takvim, e-posta, bir API ya da kod çalıştırma. |
| Bellek | Konuşmanın geçmişini ve kullanıcıya dair durumu tutar; bağlamın sürmesini sağlar. |

Şimdi tek bir soruyu bu iskelette baştan sona yürüt. Kullanıcının sorusu: “Geçen hafta konuştuğumuz izin kuralına göre önümüzdeki cuma izin alabilir miyim?”

1. Arayüz soruyu alır ve orkestrasyona iletir. Garson siparişi mutfağa götürdü.
2. Orkestrasyon soruyu okur ve üç şeye ihtiyaç olduğuna karar verir: geçen haftaki konuşma, izin kuralı ve takvim.
3. Bellekten geçen haftanın özeti gelir: kullanıcı beş yılı doldurmuş bir çalışan, bu yıl 12 gün izin kullanmış.
4. Bilgi tabanından Şekil 6.2’deki §4 parçası, özgün metni ve kaynağıyla (İK Politikası, §4) gelir: 5 yıldan sonra 26 gün.
5. Araçlardan takvim çağrılır: cuma resmî tatil değil, ekipte o gün başka izinli yok.
6. Orkestrasyon bütün bunları tek bir isteme dizer, Şekil 6.1’deki gibi rol ve format ekler, modele gönderir.
7. Model cevabı yazar: 14 gün hakkı kalmış, cuma takvimde boş görünüyor; iznin kesinleşmesi yöneticinin onayına bağlı. Cevap arayüze döner; bellek bu konuşmayı da not eder. İzni fiilen açmak gibi bir eylem olsaydı, o da onaya bağlı bir araç çağrısı olurdu.

Akış: istek → erişim (bellek ve bilgi tabanı) → araç → model → çıktı. Yedi adımın beşinde model yok. Model altıncı adımda çağrılıyor, yedincide konuşuyor; cevabı iyi yapan ise öncesinde toplanan malzeme. Zor olan, bu yedi adımı her seferinde güvenilir biçimde yürütmek. Önceki üç şekil bu iskeletin birer parçasıydı: Şekil 6.1 orkestrasyonun istem hazırlaması, Şekil 6.2 bilgi tabanı, Şekil 6.3 araç kutusu.

*Ne oluyor?* Gerçek bir YZ uygulaması birkaç parçadan oluşur: kullanıcının konuştuğu arayüz, parçaları yöneten orkestrasyon katmanı, cevabı üreten model çağrısı, verinin durduğu bilgi tabanı, modelin kullandığı araçlar ve geçmişi tutan bellek. Parçaları bir arada tutan orkestrasyon katmanıdır; model ise çoğu zaman değiştirilebilir bir parçadır.

*Kendin dene.* 1) Şu üç soru hangi kutuyu çalıştırır? “Dün söylediğim tarihi hatırlıyor musun?” “Bugün dolar kaç?” “Şirketin iade politikası ne?” 2) Modeli daha ucuz bir modelle değiştirsen şekildeki hangi kutular değişir? 3) Restoran benzetmesini tamamla: garson, müdür, şef, kiler, tezgâh aletleri ve müdavim defteri hangi kutulara ya da adımlara denk geliyor? Canlı demo: [QR 6.4]

#### Teknik derinlik

Tipik mimari katmanları: (1) Arayüz/istemci; (2) Orkestrasyon (istem oluşturma, yönlendirme, araç/RAG çağrılarını koordine etme, bazen bir ajan çerçevesi); (3) Model(ler) (kendi barındırılan ya da API); (4) Bilgi tabanı (vektör DB + RAG); (5) Araçlar/eylemler (API’ler, fonksiyonlar); (6) Bellek (kısa süreli bağlam + kalıcı durum); (7) Gözlem/güvenlik (loglama, değerlendirme, koruyucu kontroller (guardrails)).

Pratikte orkestrasyon katmanı ürünü ürün yapan yerdir: maliyet, gecikme, önbellekleme, yedek yönteme geçiş (fallback) ve değerlendirme hattı burada kurulur. Model çoğu zaman değiştirilebilir bir bileşendir.

Tipik mimari: arayüz, orkestrasyon (yöneten katman), model çağrısı, bilgi tabanı (RAG), araçlar ve bellek.

Şekil 6.4 yedi katmandan beşini kutu olarak, modeli de etiket olarak gösterir. Eşleme:

| Teknik katman | Şekil 6.4’teki kutu |
|---|---|
| (1) Arayüz/istemci | Arayüz |
| (2) Orkestrasyon | Orkestrasyon |
| (3) Model(ler) | “model çağrısı” etiketi; orkestrasyon çağırır |
| (4) Bilgi tabanı | Bilgi tabanı |
| (5) Araçlar/eylemler | Araçlar |
| (6) Bellek | Bellek |
| (7) Gözlem/güvenlik | Şekilde yok; orkestrasyonun etrafını sarar |

Modelin ayrı kutu olmaması ve gözlem katmanının görünmemesi bilinçli bir seçimdir: ikisi de orkestrasyonun içinden ya da etrafından çalışır. Model bir çağrıdır ve veri ona şu sırayla ulaşır: kullanıcı isteği, erişilen kaynak parçaları (özgün metin ve metadata), araç sonuçları; çıktısı arayüze döner. Loglama, değerlendirme ve koruyucu kontroller ise her çağrının önüne ve arkasına konan süzgeçlerdir.

İskelet hazır. Aynı iskelet hastanede, bankada ve fabrikada neye dönüşüyor?

### 6.6 Gerçek dünyada yapay zekâ

Bütün bu parçalar birleşince yapay zekâ laboratuvardan çıkıp sokağa karışıyor. Hastanede filme bakan göze yardım ediyor, bankada dolandırıcıyı yakalıyor, fabrikada sensör verileriyle olası arızaları önceden tahmin ediyor, laboratuvarda yeni moleküller öneriyor, atölyede ressamın yanına oturuyor.

Bir alan seç; yapay zekânın orada bugün nasıl kullanıldığına dair somut örnekleri gör.

> **Kenar notu.** Yapay zekâ çoğu işi sıfırdan devralmaz; bir aracı, bir “yardımcı pilot” olur. Bu kitabın tasarım görüşü: iyi uygulamalar insanı değiştiren değil, insanı güçlendiren tasarımlardır.

**Şekil 6.5 · Alanları keşfet**
![Şekil 6.5](../../figures/out/tr/sekil-6-5-sector.svg)

*Kurulum.* Şekil altı alanı üçerli iki sırada gösteriyor: Sağlık, Finans, Üretim, Bilim, Sanat ve Günlük. Her alanın altında bugün kullanılan üç somut örnek var. On sekiz örnek, tek sayfada.

*Adım adım.* Altı alanı ve örneklerini tek tabloda oku.

| Alan | Örnek 1 | Örnek 2 | Örnek 3 |
|---|---|---|---|
| Sağlık | Tıbbi görüntülerde (röntgen, MR) anormallik tespiti | Hasta notlarını özetleme ve kodlama | İlaç keşfinde aday molekül tarama |
| Finans | Gerçek zamanlı dolandırıcılık tespiti | Belge/sözleşme analizi ve risk skorlama | Müşteri destek asistanları |
| Üretim | Kestirimci bakım (arızayı önceden görme) | Görüntüyle kalite kontrol | Tedarik/talep tahmini |
| Bilim | Protein katlanması ve yapı tahmini | Büyük veri kümelerinde örüntü keşfi | Simülasyon ve hipotez üretimi |
| Sanat | Görsel, müzik ve metin üretimi | Konsept tasarım ve eskiz hızlandırma | Üslup aktarımı ve restorasyon |
| Günlük | Çeviri ve yazma yardımı | Öneri sistemleri (film, ürün) | Sesli asistanlar ve özetleme |

Önce satırları oku. Her alanda üç örnek farklı türden: Sağlıkta röntgen bir tanıma işi, molekül tarama bir tahmin işi, hasta notu bir dil işi. Üretimde kalite kontrol tanıma, kestirimci bakım ve talep tahmini birer tahmin. Her alan bilerek böyle karışık kurulmuş; tek bir alan tek bir beceriye dayanmıyor.

Şimdi tabloyu satır satır değil, çapraz oku. Aynı beceri farklı alanlarda farklı adlarla karşına çıkıyor:

| Temel beceri | Tablodan örnekler (bir örnek birden çok beceriye girebilir) |
|---|---|
| Tanıma (sınıflandırma) | Röntgende anormallik tespiti, görüntüyle kalite kontrol, dolandırıcılık tespiti, sesli asistanda konuşmayı tanıma |
| Tahmin | Kestirimci bakım, talep tahmini, protein yapısı, aday molekül tarama, öneri sistemleri (neyi beğeneceğini tahmin) |
| Üretme | Görsel ve müzik üretimi, konsept tasarım, üslup aktarımı, yazma yardımı, çeviri, hipotez üretimi, sesli asistanın cevabı |
| Getirme ve özetleme | Hasta notu özetleme, sözleşme analizi, sesli asistanın özetlemesi |
| Adım adım iş yapma (ajan) | Müşteri destek asistanları ve sesli asistanlar, ancak araç kullanıp eyleme geçtiklerinde |
| Beşliye tam oturmayan | Büyük veri kümelerinde örüntü keşfi: etiketsiz veride yapı arama; tanımaya yakın, getirme değil |

Röntgendeki lekeyi bulan sınıflandırıcı ile üretim bandındaki çatlağı bulan sınıflandırıcı aynı fikirdir; yalnız verisi farklı. Bu eşleme bir örnek; çoğu uygulama birkaç beceriyi birleştirir. Öneri sistemi bir tahmin işidir; sesli asistan konuşmayı tanımayı cevabı üretmekle birleştirir; ikisi de ancak araç kullanıp eylem yaptığında ajan olur. Örüntü keşfi de getirme değil, etiketsiz veride yapı aramadır. Yeni bir beceri yok; yeni olan, becerinin dokunduğu veri ve becerilerin birleşimi.

Fark eden şey hatanın bedeli. Sanatta yanlış bir eskiz silinir gider. Finansta yanlış bir dolandırıcılık alarmı bir müşteriyi kaybettirir; kaçan bir alarm daha pahalıdır. Sağlıkta gözden kaçan bir leke hayata mal olabilir. Tablodaki her satır bu yüzden aynı iskeleti kullanır ama farklı koruyucu kontroller ister. Bu kitabın yardımcı pilot görüşü de bu: karar insanın, hız ve dikkat yapay zekânın. Sağlıkta sınıflandırıcının çıktısı hekimin önüne bir öneri olarak gelir; son sözü hekim söyler. Sanatta ise eskizi ressam beğenmezse siler, yenisini ister.

*Ne oluyor?* Aynı temel beceriler (tanıma, tahmin, üretme, arama, adım adım iş yapma) farklı sektörlerin verisine uyarlanır; çoğu uygulama birkaçını birleştirir. Ama her alanın kuralları farklıdır: sağlıkta hata pahalıdır, finansta denetlenebilirlik şarttır. Bu yüzden önemli olan sadece “YZ eklemek” değil, onu sorumlu ve ölçülebilir biçimde kullanmaktır.

*Kendin dene.* 1) On sekiz örneği beş beceriye kendin dağıt; ikinci tabloyla karşılaştır, hangi örnekler iki beceriye birden giriyor? 2) Her alandan hatanın bedeli en yüksek örneği seç ve bir cümleyle nedenini yaz. 3) Kendi işinden bir örnek yaz: hangi beceri, hangi alan, Şekil 6.4’teki hangi kutular gerekir? Canlı demo: [QR 6.5]

#### Teknik derinlik

Uygulama alanları, aynı temel yetenekleri (sınıflandırma, tahmin, üretim, getirme, ajan) farklı verilere uyarlar. Örnekler: tıbbi görüntü analizi ve karar desteği; anomali/dolandırıcılık tespiti ve risk modelleme; kestirimci bakım ve kalite kontrol; ilaç/malzeme keşfi ve simülasyon; üretken tasarım ve içerik üretimi.

Gözden kaçmaması gereken nokta: her alanda doğruluk, güvenlik, mahremiyet ve düzenleme gereksinimleri farklıdır (ör. sağlıkta yüksek hata maliyeti, finansta denetlenebilirlik). Bu yüzden “YZ’yi entegre etmek” kadar “sorumlu ve değerlendirilebilir biçimde entegre etmek” önemlidir; sıradaki bölümlerin konusu da bu.

Atölyenin aletleri yerine oturdu mu? Altı soruyla sına.

### 6.7 Kendini test et

*Cevaplar kitabın sonunda.*

1. İstem mühendisliğinde bir cevabı iyileştiren nedir?
   a) Rol, bağlam, örnek ve net format eklemek
   b) Modeli yeniden eğitmek
   c) Daha pahalı GPU
   d) Daha kısa yazmak

2. RAG temelde ne yapar?
   a) Görsel üretir
   b) Veriyi siler
   c) Modeli hızlandırır
   d) İlgili kaynağı bulup modele vererek cevabı kaynağa dayandırır

3. Bir “ajanı” sohbet botundan ayıran nedir?
   a) Renkli arayüzü
   b) Daha hızlı yazması
   c) Araç kullanıp adım adım eyleme geçmesi
   d) İnternetsiz çalışması

4. Tipik bir YZ uygulamasında “orkestrasyon” katmanı ne yapar?
   a) Modeli eğitir
   b) Sadece veriyi saklar
   c) İstem, araç ve RAG çağrılarını koordine eder
   d) Yalnızca ekranı çizer

5. Halüsinasyonu azaltmanın pratik bir yolu nedir?
   a) Daha uzun istem yazmak
   b) Modeli kapatmak
   c) RAG ile cevabı kaynağa dayandırmak
   d) Sıcaklığı sonuna kadar açmak

6. Bu kitabın tasarım görüşüne göre iyi YZ uygulamaları nasıldır?
   a) Hiç değerlendirme gerektirmeyen
   b) İnsanı tamamen dışlayan
   c) Yalnızca en büyük modeli kullanan
   d) İnsanı güçlendiren (yardımcı pilot) tasarımlar

### Bu bölümden kalanlar

- Tek başına bir dil modeli atölyesiz bir ustadır; onu asistan yapan, etrafına kurulan istem, kaynak, araç ve mimaridir.
- İyi bir istem rol, bağlam, örnek ve format taşır; aynı model, daha iyi soruya daha iyi cevap verir.
- RAG, cevaptan önce doğru belgeyi bulup modele verir; model kaynağa dayanır, uydurma azalır ve kaynak gösterilir.
- Bir ajan “düşün, araç kullan, gözlemle” döngüsüyle çok adımlı iş yapar; yetki sınırı, tur sınırı ve doğrulama onu güvenli tutar.
- Gerçek bir YZ uygulamasında parçaları orkestrasyon katmanı yönetir, cevabı model çağrısı üretir; model çoğu zaman değiştirilebilir bir parçadır.
- Aynı temel beceriler her sektöre uyarlanır; alanlar arasında değişen şey hatanın bedeli ve gereken koruyucu kontrollerdir.
- Bu kitabın tasarım görüşü: iyi uygulamalar insanı güçlendiren yardımcı pilot tasarımlarıdır.

<!-- SOURCE-CHANGES
Bugün rekabet avantajı çoğu zaman “en büyük modele sahip olmak” değil, “modeli kendi verin ve araçlarınla en iyi şekilde kullanmak”tır. Bu bölümün derdi de bu. ||| Bugün rekabet avantajı çoğu zaman “en büyük modele sahip olmak” değil, “modeli kendi verin ve araçlarınla en iyi şekilde kullanmak”tır. Bu bölüm bunu anlatıyor.
Kapsam: istem mühendisliği (rol, bağlam, few-shot, format), bilgiyle topraklama (retrieval-augmented generation), araç/işlev çağırma ve ajan döngüleri (ReAct), tipik bir YZ uygulamasının bileşen mimarisi (orkestrasyon, bilgi tabanı, araçlar, bellek) ve sektörel uygulama örnekleri. Ana fikir şu: modeli değiştirmeden, çevresine kurulan sistemle güvenilirlik ve fayda artırılabilir. ||| Kapsam: istem mühendisliği (rol, bağlam, few-shot, format), bilgiyle topraklama (retrieval-augmented generation), araç/işlev çağırma ve ajan döngüleri (ReAct), tipik bir YZ uygulamasının bileşen mimarisi (orkestrasyon, bilgi tabanı, araçlar, bellek) ve sektörel uygulama örnekleri. Ana fikir, modeli değiştirmeden çevresine kurulan sistemle güvenilirliği ve faydayı artırmak.
İyi istem = açık rol + yeterli bağlam + net format + (gerekirse) örnek. Modeli suçlamadan önce istemini gözden geçir; çoğu “kötü cevap” aslında “eksik soru”dur. ||| İyi istem = açık rol + yeterli bağlam + net format + (gerekirse) örnek. Modeli suçlamadan önce istemini gözden geçir; çoğu kötü cevap eksik sorudur.
İstem bileşenleri: rol (kim olsun), bağlam (durum), örnek (few-shot) ve format (biçim). Her parça modele ne istediğini daha net söyler; kalite ~%40’tan başlar ve her parçayla artar. Model yeniden eğitilmez; yalnızca daha iyi sorulur. ||| Kalite ~%40’tan başlar ve her parçayla artar.
RAG kapalıyken model yalnızca parametrik (ezber) bilgisine dayanır ve özel bilgiyi uydurabilir (halüsinasyon). Açıkken sorgu bir vektör tabanından ilgili belge parçasını getirir; model yalnızca ona dayanarak cevaplar ve kaynağı gösterir; uydurma riski büyük ölçüde düşer. ||| Kapalıyken model yalnızca parametrik (ezber) bilgisine dayanır; açıkken getirilen parçaya dayanır ve kaynağı gösterir.
Fark şu: bir sohbet botu sana “nasıl yapılacağını” anlatır; bir ajan onu senin için yapmaya çalışır. Güç de risk de buradan gelir; o yüzden sınırlar şart. ||| Sohbet botu sana nasıl yapılacağını anlatır; ajan onu senin için yapmaya çalışır. Güç de risk de buradan gelir; o yüzden sınırlar şart.
ReAct döngüsü: model bir düşünce üretir, bir araç çağrısı seçer (tool/function calling), çıktısını gözlem olarak alır ve bu gözlem bir sonraki adımı besler; hedefe ulaşana dek yineler. Döngü/bütçe sınırı sonsuz döngüyü engeller. ||| Her gözlem bir sonraki adımı besler; döngü/bütçe sınırı sonsuz döngüyü engeller.
Tipik mimari: arayüz, orkestrasyon (asıl “beyin”), bilgi tabanı (RAG), araçlar ve bellek. Orkestrasyon katmanı ürünü ürün yapan yerdir (maliyet, gecikme, fallback, değerlendirme); model çoğu zaman değiştirilebilir bir bileşendir. ||| Tipik mimari: arayüz, orkestrasyon (asıl “beyin”), bilgi tabanı (RAG), araçlar ve bellek.
Aynı temel yetenekler (sınıflandırma, tahmin, üretim, getirme, ajan) farklı verilere uyarlanır. Her alanda doğruluk, güvenlik, mahremiyet ve düzenleme gereksinimleri farklıdır; bu yüzden asıl mesele YZ’yi kurmak değil, onu sorumlu ve denetlenebilir biçimde kurmaktır. ||| [SİL]
Kapsam: istem mühendisliği (rol, bağlam, few-shot, format), bilgiyle topraklama (retrieval-augmented generation), araç/işlev çağırma ve ajan döngüleri (ReAct), tipik bir YZ uygulamasının bileşen mimarisi (orkestrasyon, bilgi tabanı, araçlar, bellek) ve sektörel uygulama örnekleri. Ana fikir, modeli değiştirmeden çevresine kurulan sistemle güvenilirliği ve faydayı artırmak. ||| Kapsam: istem mühendisliği (rol, bağlam, few-shot, format), kaynaklarla temellendirme (grounding; retrieval-augmented generation), araç/işlev çağırma ve ajan döngüleri (ReAct), tipik bir YZ uygulamasının bileşen mimarisi (orkestrasyon, bilgi tabanı, araçlar, bellek) ve sektörel uygulama örnekleri. Ana fikir, modeli değiştirmeden çevresine kurulan sistemle güvenilirliği ve faydayı artırmak.
İyi istem = açık rol + yeterli bağlam + net format + (gerekirse) örnek. Modeli suçlamadan önce istemini gözden geçir; çoğu kötü cevap eksik sorudur. ||| İyi istem = açık rol + yeterli bağlam + net format + (gerekirse) örnek. Modeli suçlamadan önce istemini gözden geçir; kötü cevapların bir kısmı eksik sorudan gelir.
Bir isteme rol (kim olsun), bağlam (durum), örnek ve format ekledikçe modele ne istediğini daha net anlatırsın; cevabın kalitesi de her parçayla yükselir. Model yeniden eğitilmiyor; ona sadece daha iyi bir soru sorulmuş oluyor. ||| Bir isteme rol (kim olsun), bağlam (durum), örnek ve format ekledikçe modele ne istediğini daha net anlatırsın. Göreve uygun parçalar cevabı çoğu zaman iyileştirir; gereksiz ya da çelişkili ayrıntı ise kötüleştirebilir. Buradaki puan bir tamamlanma göstergesidir, ölçülmüş kalite değil. Model yeniden eğitilmiyor; ona sadece daha iyi bir soru sorulmuş oluyor.
Kalite ~%40’tan başlar ve her parçayla artar. ||| Gösterge ~%40’tan başlar ve her parçayla 15 puan artar; bu bir tamamlanma göstergesidir, ölçülmüş kalite puanı değil.
RAG (Retrieval-Augmented Generation), bir sorguyu gömüye çevirip bir vektör veri tabanından en ilgili metin parçalarını getirir ve bunları isteme ekleyerek modeli o kaynaklara “topraklar” (grounding). Böylece güncel/özel bilgi, modeli yeniden eğitmeden kullanılır. ||| RAG (Retrieval-Augmented Generation), ilgili kaynak parçalarını arayıp isteme ekler ve modeli o kaynaklarla temellendirir (grounding). Erişim vektör benzerliğiyle, anahtar sözcükle ya da ikisinin karışımıyla (hibrit) yapılabilir; vektör veri tabanı yaygın bir seçenektir, zorunlu değildir. Kaynak metinler ve köken bilgileri (hangi belge, hangi bölüm) erişilebilir kalmalıdır. Böylece güncel/özel bilgi, modeli yeniden eğitmeden kullanılır.
Tipik hat: belgeleri parçalara böl (chunking) → göm → indeksle; sorguda en yakın k parçayı getir (semantik arama) → isteme ekle → üret. Avantaj: kaynak gösterilebilir ve halüsinasyon azalır. Zorluklar: getirme kalitesi, parça boyutu, ve bağlam penceresi sınırı. ||| Yaygın bir hat: belgeleri parçalara böl (chunking) → indeksle (gömüyle ve/veya anahtar sözcükle) → sorguda en ilgili k parçayı getir → isteme ekle → üret. Avantaj: kaynak gösterilebilir ve halüsinasyon azalır; yine de cevabın kaynağa dayandığı doğrulanmalıdır. Zorluklar: getirme kalitesi, parça boyutu, ve bağlam penceresi sınırı.
RAG, modeli “açık kitap sınavına” sokmak gibidir: artık ezberden değil, önündeki kaynaktan cevaplar. Kurumsal YZ uygulamalarının çoğunun belkemiği budur. ||| RAG, modeli “açık kitap sınavına” sokmak gibidir: artık ezberden değil, önündeki kaynaktan cevaplaması istenir. Kurumsal YZ uygulamalarının çoğunun belkemiği budur.
RAG kapalıyken model yalnızca ezberinden konuşur ve bilmediği özel bilgiyi uydurabilir (halüsinasyon). Açıkken önce soruyla ilgili belge bulunup modele verilir; model de yalnızca o kaynağa bakarak cevaplar ve kaynağı gösterir. Böylece uydurma riski büyük ölçüde azalır; açık kitap sınavına girmek gibi. ||| RAG kapalıyken model yalnızca ezberinden konuşur ve bilmediği özel bilgiyi uydurabilir (halüsinasyon). Açıkken önce soruyla ilgili belge bulunup modele verilir; modele yalnızca o kaynağa dayanması söylenir; model cevaplar ve kaynağı gösterir. Uydurma riski azalır, ama cevabın kaynağa gerçekten dayandığı ayrıca denetlenir; açık kitap sınavına girmek gibi.
Kapalıyken model yalnızca parametrik (ezber) bilgisine dayanır; açıkken getirilen parçaya dayanır ve kaynağı gösterir. ||| Kapalıyken model yalnızca parametrik (ezber) bilgisine dayanır; açıkken getirilen parçaya dayanması istenir ve kaynağı gösterir, dayanma garantisi değildir.
Tasarım konuları: araç şeması ve doğrulama, döngü/bütçe sınırı (sonsuz döngüyü önleme), hata yönetimi, ve güvenlik (modelin tehlikeli eylemleri tetiklememesi). Çok adımlı ajanlar güçlüdür ama kırılgandır; bu yüzden izlenebilirlik ve net sınırlar şarttır. ||| Tasarım konuları: araç şeması ve doğrulama, döngü/bütçe sınırı (sonsuz döngüyü önleme), hata yönetimi, ve güvenlik: araç izinleri sınırlandırılır, dış verideki (web sayfası, belge, e-posta) talimatlar güvenilir komut sayılmaz, önemli eylemler uygun onaya bağlanır. Çok adımlı ajanlar güçlüdür ama kırılgandır; bu yüzden izlenebilirlik ve net sınırlar şarttır.
Ajan bir görevi adım adım çözer: önce “ne yapmalıyım?” diye düşünür, sonra bir araç kullanır (mesela hesap makinesi), aracın sonucunu görür ve bu sonuca göre bir sonraki adıma karar verir. Hedefe ulaşana kadar bu “düşün → kullan → gözlemle” döngüsünü tekrarlar. ||| Ajan bir görevi adım adım çözer: önce “ne yapmalıyım?” diye düşünür, sonra bir araç kullanır (mesela hesap makinesi), aracın sonucunu görür ve bu sonuca göre bir sonraki adıma karar verir. Hedefe ulaşana kadar bu “düşün → kullan → gözlemle” döngüsünü tekrarlar. Şekildeki üç adım önceden yazılmış bir senaryodur; gerçek bir ajan araç çağrısını model çıktısına göre seçer.
Gerçek bir YZ uygulaması, iyi bir restoran gibidir; işi yalnız şef pişirmez. Siparişini alan garson vardır: arayüz. Mutfağı yöneten, kime ne zaman iş düşeceğine karar veren bir müdür vardır: orkestrasyon; asıl “beyin” odur. Malzemelerin durduğu kiler bilgi tabanıdır, tezgâhtaki aletler modelin araçlarıdır, müdavimlerin defteri de bellektir. ||| Gerçek bir YZ uygulaması, iyi bir restoran gibidir; işi yalnız şef pişirmez. Siparişini alan garson vardır: arayüz. Mutfağı yöneten, kime ne zaman iş düşeceğine karar veren bir müdür vardır: orkestrasyon. Cevabı pişiren şef ise modeldir; müdür malzemeyi önüne getirir. Malzemelerin durduğu kiler bilgi tabanıdır, tezgâhtaki aletler modelin araçlarıdır, müdavimlerin defteri de bellektir.
Tipik mimari katmanları: (1) Arayüz/istemci; (2) Orkestrasyon (istem oluşturma, yönlendirme, araç/RAG çağrılarını koordine etme, bazen bir ajan çerçevesi); (3) Model(ler) (kendi barındırılan ya da API); (4) Bilgi tabanı (vektör DB + RAG); (5) Araçlar/eylemler (API’ler, fonksiyonlar); (6) Bellek (kısa süreli bağlam + kalıcı durum); (7) Gözlem/güvenlik (loglama, değerlendirme, korkuluklar). ||| Tipik mimari katmanları: (1) Arayüz/istemci; (2) Orkestrasyon (istem oluşturma, yönlendirme, araç/RAG çağrılarını koordine etme, bazen bir ajan çerçevesi); (3) Model(ler) (kendi barındırılan ya da API); (4) Bilgi tabanı (vektör DB + RAG); (5) Araçlar/eylemler (API’ler, fonksiyonlar); (6) Bellek (kısa süreli bağlam + kalıcı durum); (7) Gözlem/güvenlik (loglama, değerlendirme, koruyucu kontroller (guardrails)).
Pratikte orkestrasyon katmanı ürünü ürün yapan yerdir: maliyet, gecikme, önbellekleme, geri çekilme (fallback) ve değerlendirme hattı burada kurulur. Model çoğu zaman değiştirilebilir bir bileşendir. ||| Pratikte orkestrasyon katmanı ürünü ürün yapan yerdir: maliyet, gecikme, önbellekleme, yedek yönteme geçiş (fallback) ve değerlendirme hattı burada kurulur. Model çoğu zaman değiştirilebilir bir bileşendir.
Gerçek bir YZ uygulaması birkaç parçadan oluşur: kullanıcının konuştuğu arayüz, her şeyi yöneten orkestrasyon katmanı (asıl “beyin”), verinin durduğu bilgi tabanı, modelin kullandığı araçlar ve geçmişi tutan bellek. Parçaları asıl bir arada tutan, orkestrasyon katmanıdır; model ise çoğu zaman değiştirilebilir bir parçadır. ||| Gerçek bir YZ uygulaması birkaç parçadan oluşur: kullanıcının konuştuğu arayüz, parçaları yöneten orkestrasyon katmanı, cevabı üreten model çağrısı, verinin durduğu bilgi tabanı, modelin kullandığı araçlar ve geçmişi tutan bellek. Parçaları bir arada tutan orkestrasyon katmanıdır; model ise çoğu zaman değiştirilebilir bir parçadır.
Tipik mimari: arayüz, orkestrasyon (asıl “beyin”), bilgi tabanı (RAG), araçlar ve bellek. ||| Tipik mimari: arayüz, orkestrasyon (yöneten katman), model çağrısı, bilgi tabanı (RAG), araçlar ve bellek.
Bütün bu parçalar birleşince yapay zekâ laboratuvardan çıkıp sokağa karışıyor. Hastanede filme bakan göze yardım ediyor, bankada dolandırıcıyı yakalıyor, fabrikada arızayı kokusundan tanıyor, laboratuvarda yeni moleküller öneriyor, atölyede ressamın yanına oturuyor. ||| Bütün bu parçalar birleşince yapay zekâ laboratuvardan çıkıp sokağa karışıyor. Hastanede filme bakan göze yardım ediyor, bankada dolandırıcıyı yakalıyor, fabrikada sensör verileriyle olası arızaları önceden tahmin ediyor, laboratuvarda yeni moleküller öneriyor, atölyede ressamın yanına oturuyor.
Yapay zekâ çoğu işi sıfırdan devralmaz; bir aracı, bir “yardımcı pilot” olur. En başarılı uygulamalar, insanı değiştiren değil, insanı güçlendiren tasarımlardır. ||| Yapay zekâ çoğu işi sıfırdan devralmaz; bir aracı, bir “yardımcı pilot” olur. Bu kitabın tasarım görüşü: iyi uygulamalar insanı değiştiren değil, insanı güçlendiren tasarımlardır.
Aynı temel beceriler (tanıma, tahmin, üretme, arama, adım adım iş yapma) farklı sektörlerin verisine uyarlanır. Ama her alanın kuralları farklıdır: sağlıkta hata pahalıdır, finansta denetlenebilirlik şarttır. Bu yüzden önemli olan sadece “YZ eklemek” değil, onu sorumlu ve ölçülebilir biçimde kullanmaktır. ||| Aynı temel beceriler (tanıma, tahmin, üretme, arama, adım adım iş yapma) farklı sektörlerin verisine uyarlanır; çoğu uygulama birkaçını birleştirir. Ama her alanın kuralları farklıdır: sağlıkta hata pahalıdır, finansta denetlenebilirlik şarttır. Bu yüzden önemli olan sadece “YZ eklemek” değil, onu sorumlu ve ölçülebilir biçimde kullanmaktır.
En başarılı YZ uygulamaları genelde nasıldır? ||| Bu kitabın tasarım görüşüne göre iyi YZ uygulamaları nasıldır?
-->

<!-- REDAKSİYON NOTLARI
- 2026-10-01 düzeltme belgesi (R045–R050, R096): Şekil 6.1 puanı “tamamlanma göstergesi”, cevaplar temsili (figür etiketi “KALİTE” strings/M06.mjs: figür ajanı “GÖSTERGE” yapabilir), kenar notu “çoğu kötü cevap” genellemesi daraltıldı; Şekil 6.2 hazır soru/parça/cevap çiftleri, vektör DB zorunlu değil (vektör/anahtar sözcük/hibrit), kaynak göstermek garanti değil, Kendin dene 1 cevabı atıf desteği + belirsizlik ölçütleriyle; Şekil 6.3 hazır senaryo, isFinal çelişkisi giderildi (“kimse bitti demedi” kaldırıldı), yetki/adım sınırı/durma koşulu/dış veri talimatı/onay eklendi; Şekil 6.4 akış (istek → erişim → araç → model → çıktı), tabloya “Model çağrısı” satırı (figürde orkestrasyon altındaki “model çağrısı” etiketi), bilgi tabanı “özgün parça + metadata + indeks”, 7. adım “cuma uygun” hükmü yönetici onayına bağlandı, orkestrasyon “asıl beyin” → “yöneten katman” (figür dizgisi arch.parts[1] ve brain etiketi: figür ajanı); R050: grounding → “kaynaklarla temellendirme”, fallback → “yedek yönteme geçiş”, guardrails/korkuluk → “koruyucu kontroller”, “arızayı kokusundan tanıyor” → “sensör verileriyle olası arızaları önceden tahmin ediyor” (sözlük girdisi RAG’daki “topraklama” sözlük ajanı R097’de eşlenmeli); R096: Şekil 6.5 beceri tablosu çoklu/örnek eşleme, öneri sistemleri tahmin, sesli asistan tanıma+üretme (ajan yalnız eylemde), örüntü keşfi ayrı satır; “en başarılı uygulamalar” kenar notu, sınav 6 ve kalanlar “bu kitabın tasarım görüşü” olarak işaretlendi. Değişen kaynak paragraflar SOURCE-CHANGES’ta.
- 2026-09-30 inceleme: beş şekil bloğunda "Ne oluyor?" ile "Kendin dene" sırası kılavuza (§2) uyduruldu; 6.1 eşik "60–84"; 6.2 "yasal alt sınır" göndermesi kaldırıldı (EN ile aynı); 6.2 "iki belge, üç parça".
- 6.3 basit: "Bir soru seç ve RAG’ı aç/kapat:" → "Bir soru seç ve Şekil 6.2’de RAG’ın kapalı ve açık hâlini karşılaştır:"
- 6.4 basit: "Bir ajanın bir görevi adım adım nasıl çözdüğünü izle. “Sonraki adım”a bas; ne düşündüğünü, hangi aracı çağırdığını ve ne gözlemlediğini gör." → "Bir ajanın bir görevi adım adım nasıl çözdüğüne Şekil 6.3’te bak. Her karede ne düşündüğünü, hangi aracı çağırdığını ve ne gözlemlediğini gör."
- 6.5 basit: "Parçalara tek tek dokun ve her birinin sistemde ne işe yaradığını gör." → "Şekil 6.4’te parçalara tek tek bak ve her birinin sistemde ne işe yaradığını gör."
- 6.2 basit: "Bir istemi parça parça kur: … gör." aynen bırakıldı; Şekil 6.1 kâğıtta karşılıyor.
- 6.6 basit: "Bir alan seç; … gör." aynen bırakıldı; Şekil 6.5 tablosu karşılıyor.
- Kenar notları kaynakta bölüm başında; kılavuz gereği basit paragraflarının sonuna, Şekil bloğundan önceye alındı.
- Şekil 6.1 tablolarındaki “Gün 1 · Sabah …” dizgileri ve Şekil 6.2 tablosundaki “250–300 TL” demo metninden birebir; uzun/kısa tire kaynağa ait, yeni metinde yok.
- Şekil 6.2 Adım adım 1. madde: "yasal alt sınıra yakın, genel bir sayı" ifadesi yazarın doğrulaması için (İş Kanunu md. 53: 1–5 yıl için 14 gün).
- Şekil 6.4 Adım adım: yedi adımlık izin örneği (12 gün kullanılmış, 14 gün kalmış) demoda yok; Şekil 6.1–6.3 verisinden kurulmuş yeni bir senaryo.
- 6.7: export'un "_Cevaplar: cevap-anahtari.md_" çalışma notu yerine okura dönük "Cevaplar kitabın sonunda." yazıldı.
- Şekil 6.5 ikinci tablo (beceri eşlemesi) demoda yok; Ne oluyor? metnindeki beş beceriye göre yazar tarafından kuruldu, tartışmaya açık.
- Yazar kararı (2026-09-10): kaynak metin dahil tüm "demo" sözcükleri "gösterim" ya da "Şekil N.j" yapıldı; "Aşağıdaki demo" → şekil öncesinde "Aşağıda yer alan gösterim (Şekil N.j)", sonrasında "Şekil N.j'teki gösterim".
- Yazar kararı (2026-09-10, figürler): ekran renkleri (yeşil/kırmızı/mavi/mor) duotone baskıya göre 'koyu/gri' ve 'turuncu' yapıldı; figür düzeni tarifleri ('kendi rengi', 'yanında rolü', 'ok çekmen') figürlerle eşleştirildi.
- 2026-09-30 insanlaştırma geçişi: humanize-tr-report bulguları uygulandı ("şu:" kapıları, Peki köprüsü, "tam da", kenar notu göndermeleri ×3, "gösterim" uyarıları, "model değil, X" ve "yeniden eğitilmez" tekrarları). Teknik "Ne oluyor" paragraflarında ilk teknik paragrafı tekrar eden cümleler kırpıldı; 6.6'daki paragraf bütünüyle tekrar olduğu için silindi (SOURCE-CHANGES'ta [SİL]; dijitalde tek başına durduğundan karar yazara ait). Değişen kaynak paragraflar SOURCE-CHANGES bloğunda.
- 2026-10-01 doğrulama turu (R050, R082): dizine "Kaynaklarla temellendirme (grounding)", "Yedek yönteme geçiş (fallback)", "Koruyucu kontroller (guardrails)" girişleri eklendi (dizin-terimler.yaml, bölüm kısıtıyla) ve sözlükte aynı başlıklar açıldı; Şekil 6.2 dizgide en az 6,5 pt'ye sabitlendi (typeset FIG_MIN_PT, şekil başına en küçük ölçek).
- 2026-10-02 ikinci doğrulama turu (R073/N008): Şekil 6.3 "çıktı" etiketi Gözlem düğümünün alt çizgisinin altına alındı; "hedefe ulaşınca" satırı 3 birim aşağı (check_fig_geom.mjs çizgi teması kontrolü temiz).
-->
