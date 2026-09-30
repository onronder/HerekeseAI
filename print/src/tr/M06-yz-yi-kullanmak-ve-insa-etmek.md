# Bölüm 6
## YZ’yi Kullanmak ve İnşa Etmek
*İstemden ajana, mimariden gerçek dünyaya*

<!-- acc #2a7d86 · tag Uygulama -->

### 6.1 YZ’yi kullanmak ve inşa etmek

Çok bilen ama atölyesi olmayan bir usta düşün: Eline alet verilmemiş, defterine bakması yasak, dünkü konuşmayı bile hatırlamıyor. Tek başına bir dil modeli böyledir. Onu işe yarar bir asistana çeviren şey, etrafına kurduğumuz atölyedir: iyi istemler, modeli kendi verinle besleme (RAG), araç kullanımı, ajanlar ve sağlam bir mimari. Şimdi bu atölyeyi parça parça kuracağız; sonunda da bu araçların gerçek dünyada neleri dönüştürdüğüne bakacağız.

> **Kenar notu.** Bugün rekabet avantajı çoğu zaman “en büyük modele sahip olmak” değil, “modeli kendi verin ve araçlarınla en iyi şekilde kullanmak”tır. Bu bölüm bunu anlatıyor.

#### Teknik derinlik

Önceki bölümler temel yetenekleri kurdu; bu bölüm uygulama katmanını ele alır: temel bir modeli (foundation model) güvenilir, bağlama duyarlı ve eyleme geçebilen bir ürüne dönüştüren tasarım desenleri.

Kapsam: istem mühendisliği (rol, bağlam, few-shot, format), bilgiyle topraklama (retrieval-augmented generation), araç/işlev çağırma ve ajan döngüleri (ReAct), tipik bir YZ uygulamasının bileşen mimarisi (orkestrasyon, bilgi tabanı, araçlar, bellek) ve sektörel uygulama örnekleri. Ana fikir, modeli değiştirmeden çevresine kurulan sistemle güvenilirliği ve faydayı artırmak.

Atölyenin ilk aleti en ucuzu: doğru soruyu sormak. Aynı modelden bambaşka cevaplar almanın yolu, istemi nasıl kurduğuna bağlı.

### 6.2 İstem mühendisliği: doğru soruyu sormak

Terziye “bana bir şey dik” dersen ne çıkacağını terzi de bilmez. Ölçünü verir, kumaşı seçer, modeli tarif edersen bambaşka olur. Dil modeli de böyledir: “Bana bir plan yap” demekle, ona bir rol verip derdini anlatmak ve istediğin biçimi söylemek arasında dağlar kadar fark var.

Bir istemi parça parça kur: rol, bağlam, örnek ve format ekledikçe modelin cevabının nasıl keskinleştiğini gör.

> **Kenar notu.** İyi istem = açık rol + yeterli bağlam + net format + (gerekirse) örnek. Modeli suçlamadan önce istemini gözden geçir; çoğu kötü cevap eksik sorudur.

**Şekil 6.1 · Bir istem inşa et**
![Şekil 6.1](../../figures/out/tr/sekil-6-1-prompt.svg)

*Kurulum.* Şekilde bir istem dört parçadan kuruluyor. En altta hep aynı taban istek duruyor: “Bana bir hafta sonu tatil planı öner.” Üstüne dört parça eklenebiliyor: rol, bağlam, örnek ve format. Sağda bir kalite çubuğu ve modelin o istemle verdiği cevap var. Her eklenen parça çubuğu yükseltir; belli eşiklerde cevap da değişir.

*Adım adım.* Önce parçaların her birinin isteme hangi cümleyi eklediğine bak.

| Parça | İsteme eklenen cümle |
|---|---|
| Taban istek | Bana bir hafta sonu tatil planı öner. |
| Rol | Sen deneyimli bir seyahat danışmanısın. |
| Bağlam | 3 kişilik bir aile, deniz kenarında, orta bütçeli bir tatil istiyor. |
| Örnek | Örnek: “Gün 1 · Sabah: …, Öğlen: …, Akşam: …” |
| Format | Cevabı gün başlıklarıyla, madde madde ver. |

Şekildeki kalite kuralı basit: taban istek yüzde 40 puandan başlar, eklenen her parça 15 puan getirir. Kural parçanın hangisi olduğuna bakmaz, yalnız sayısına bakar; bilerek bu kadar basit tutulmuş. Yüzde 60’ın altı düşük, 60 ile 84 arası orta, 85 ve üstü yüksek sayılır. Cevap da bu üç düzeye göre değişir.

| Eklenen parça sayısı | Kalite | Düzey | Modelin cevabı |
|---|---|---|---|
| 0 | %40 | düşük | Bir yere gidebilirsiniz, birkaç müze gezip güzel yemekler yiyebilirsiniz. İyi tatiller! |
| 1 | %55 | düşük | (aynı cevap) |
| 2 | %70 | orta | Deniz kenarında bir destinasyon öneriyorum: sabah plaj, öğleden sonra kısa bir kasaba turu, akşam balık restoranı. Bütçeye uygun bir pansiyon seçebilirsiniz. |
| 3 | %85 | yüksek | Gün 1 · Sabah: plajda yüzme; Öğlen: sahilde hafif öğle; Akşam: yerel balıkçıda akşam yemeği. Gün 2 · Sabah: kasaba & pazar turu; Öğlen: aile dostu kafe; Akşam: gün batımı yürüyüşü. |
| 4 | %100 | yüksek | (aynı cevap) |

Parçaları sırayla ekleyerek tabloyu bir kez de kendin yürüt:

1. Yalnız taban istek: kalite yüzde 40, düzey düşük. Cevap müzeden ve yemekten söz ediyor; deniz yok, aile yok, gün planı yok. Model ne istediğini bilmiyor, o da genelgeçer konuşuyor.
2. Rolü ekle: kalite yüzde 55. Düzey hâlâ düşük, cevap aynı. Tek başına bir unvan vermek modele derdini anlatmıyor.
3. Bağlamı ekle: kalite yüzde 70, düzey orta. Cevap birden deniz kenarına, plaja, pansiyona geliyor. Model artık kimin için plan yaptığını biliyor.
4. Örneği ekle: kalite yüzde 85, düzey yüksek. Cevap gün başlıklarına ve sabah, öğlen, akşam bölmelerine giriyor; örnekteki kalıbın aynısı.
5. Formatı da ekle: kalite yüzde 100. Cevap değişmiyor; çubuk tavana varıyor. İstenen biçim zaten örnekle gelmişti; format kuralı onu garantiye alıyor.

Cevap ikinci parçada değişti. Şekilde bu yalnızca bir sayma meselesi; pratikte unvan tek başına az iş görür, durumu anlatmak çok.

*Ne oluyor?* Bir isteme rol (kim olsun), bağlam (durum), örnek ve format ekledikçe modele ne istediğini daha net anlatırsın; cevabın kalitesi de her parçayla yükselir. Model yeniden eğitilmiyor; ona sadece daha iyi bir soru sorulmuş oluyor.

*Kendin dene.* 1) Yalnız bağlam ve format işaretli olsa kalite kaç olur, düzey ne çıkar, hangi cevap gelir? 2) Yüksek düzeye ulaşmak için en az kaç parça gerekir? İki parça neden yetmez? 3) “Bana bir e-posta yaz” isteğine kendi rol, bağlam, örnek ve format cümlelerini yaz. Canlı demo: [QR 6.1]

#### Teknik derinlik

İstem mühendisliği, modeli yeniden eğitmeden davranışını yönlendirme pratiğidir. Etkili bileşenler: sistem/rol tanımı, görev bağlamı, çıktı formatı kısıtları ve örnekler. Sıfır-atış (zero-shot) yerine birkaç-atış (few-shot) örnekler genelde tutarlılığı artırır.

İleri teknikler: adım adım düşündürme (chain-of-thought), kendini doğrulama, kısıt/şema dayatma (ör. JSON), ve görevi alt-görevlere bölme. İstem; bağlam penceresini ve dolayısıyla maliyeti de etkiler, çünkü uzun örnekler token tüketir.

Kalite ~%40’tan başlar ve her parçayla artar.

Şekil 6.1’in kalite puanı bir öğretim sadeleştirmesidir: kalite = min(100, 40 + 15·n), n eklenen parça sayısı. Düzey eşikleri: kalite ≥ 85 yüksek, 60 ≤ kalite < 85 orta, altı düşük. Gerçek sistemlerde kalite böyle doğrusal artmaz; ölçmek için bir değerlendirme kümesi (eval set) ve bir puanlayıcı gerekir.

İyi kurulmuş bir istem bile modelin hiç görmediği bilgiyi yaratamaz. Şirketinin izin kuralını modele kim söyleyecek?

### 6.3 RAG: modele kendi verini ver

Bir dil modeli senin şirket belgelerini, notlarını, güncel verini bilmez; okulu belli bir tarihte bitmiştir. Sorarsan da bozuntuya vermez, kendinden emin bir tonla uydurabilir (halüsinasyon). Çözüm, iyi bir kütüphaneci tutmak kadar basit: Cevaptan önce rafa gidilir, doğru belge bulunur ve modele “işte kaynak, buna göre cevapla” denir.

Buna RAG (bilgiyle desteklenmiş üretim) deniyor. Bir soru seç ve Şekil 6.2’de RAG’ın kapalı ve açık hâlini karşılaştır: kapalıyken model tahmin eder, açıkken ilgili belgeyi bulup ona dayanarak cevaplar.

> **Kenar notu.** RAG, modeli “açık kitap sınavına” sokmak gibidir: artık ezberden değil, önündeki kaynaktan cevaplar. Kurumsal YZ uygulamalarının çoğunun belkemiği budur.

**Şekil 6.2 · Kaynağa dayalı cevap**
![Şekil 6.2](../../figures/out/tr/sekil-6-2-rag.svg)

*Kurulum.* Şekilde üç İK sorusu var. Her sorunun karşısında iki cevap duruyor: RAG kapalıyken modelin kaynaksız tahmini, RAG açıkken kaynaklı cevabı. Açık tarafta arada bir kutu daha var: şirket belgesinden bulunup modele verilen kaynak parçası. Kapalı tarafta o kutu boş; cevabın yanında “Doğrulanmadı” uyarısı duruyor. İki taraf arasında tek fark kütüphanecinin devrede olup olmaması; soru da model de aynı.

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

Üç satırda aynı örüntü var. Tahminler makul duruyor ama üçü de yanlış; üstelik her birinde bir kaçamak kelime var: civarında, sanırım, muhtemelen. Kaynaklı cevaplar ise bir sayı, bir madde numarası ve bir koşul veriyor. Kaynak gösterildiği için doğrulamak da kolay: belgede §4’ü bul, karşılaştır. Kaynak parçası en az cevap kadar önemli. Yanlış parça gelirse model onu da aynı güvenle kullanır; RAG uydurmayı azaltır, getirme hatasını değil.

*Ne oluyor?* RAG kapalıyken model yalnızca ezberinden konuşur ve bilmediği özel bilgiyi uydurabilir (halüsinasyon). Açıkken önce soruyla ilgili belge bulunup modele verilir; model de yalnızca o kaynağa bakarak cevaplar ve kaynağı gösterir. Böylece uydurma riski büyük ölçüde azalır; açık kitap sınavına girmek gibi.

*Kendin dene.* 1) Üç tahmin cevabındaki belirsizlik kelimelerini listele; kaynaklı cevaplarda böyle bir kelime var mı? 2) Belgelerde izinle ilgili hiçbir madde olmasaydı, RAG açıkken iyi kurulmuş bir sistem ne demeli? 3) Yeni soru: “Altı yıldır çalışıyorum, yıllık iznim kaç gün?” Tablodaki kaynak parçasına göre kaynaklı cevabı sen yaz. Canlı demo: [QR 6.2]

#### Teknik derinlik

RAG (Retrieval-Augmented Generation), bir sorguyu gömüye çevirip bir vektör veri tabanından en ilgili metin parçalarını getirir ve bunları isteme ekleyerek modeli o kaynaklara “topraklar” (grounding). Böylece güncel/özel bilgi, modeli yeniden eğitmeden kullanılır.

Tipik hat: belgeleri parçalara böl (chunking) → göm → indeksle; sorguda en yakın k parçayı getir (semantik arama) → isteme ekle → üret. Avantaj: kaynak gösterilebilir ve halüsinasyon azalır. Zorluklar: getirme kalitesi, parça boyutu, ve bağlam penceresi sınırı.

Kapalıyken model yalnızca parametrik (ezber) bilgisine dayanır; açıkken getirilen parçaya dayanır ve kaynağı gösterir.

Şekil 6.2’de bu hat en küçük hâliyle çalışır: iki belge, üç parça (her parça tek bölüm), k = 1. Soru gömüye çevrilir, en yakın parça (izin sorusu için §4) isteme eklenir; model yalnız o parçaya dayanarak cevaplar ve parçanın adını kaynak olarak yazar. Gerçek bir sistemde binlerce parça vardır ve asıl zorluk yanlış parçanın getirilmesidir; kötü getirme, kötü cevaptır.

Kaynağı önünde bulan model artık doğru konuşuyor. İş konuşmakla bitmiyorsa, hesap yapmak ya da takvime bakmak gerekiyorsa?

### 6.4 Ajanlar: düşün, araç kullan, gözlemle

Tek başına bir dil modeli yalnızca konuşur. Şimdi ustamıza aletlerini verelim: hesap makinesi, arama, takvim, bir API. Bir de şu çalışma düzenini öğretelim: “düşün → aleti kullan → sonuca bak → tekrar dene”. Ortaya bir ajan çıkar: konuşmakla kalmayıp adım adım plan yapan, işe girişen bir asistan.

Bir ajanın bir görevi adım adım nasıl çözdüğüne Şekil 6.3’te bak. Her karede ne düşündüğünü, hangi aracı çağırdığını ve ne gözlemlediğini gör.

> **Kenar notu.** Sohbet botu sana nasıl yapılacağını anlatır; ajan onu senin için yapmaya çalışır. Güç de risk de buradan gelir; o yüzden sınırlar şart.

**Şekil 6.3 · Bir ajanı izle**
![Şekil 6.3](../../figures/out/tr/sekil-6-3-agent.svg)

*Kurulum.* Şekil bir film şeridi. En üstte ajana verilen görev, altında üç kare var. Her karede üç satır okuyorsun: ajanın düşüncesi, çağırdığı araç ve aracın döndürdüğü gözlem. Son karede araç satırı boş; onun yerine son cevap var. Ajanın elinde tek alet var: bir hesap makinesi. Görevin yanında düşünce → araç → gözlem döngüsü halka olarak çizili; kareler bu halkanın üç turu.

*Adım adım.* Ajana verilen görev: “Ekibe 3 pizza alacağız (tanesi 180 TL). Toplam ne kadar ve 6 kişiye bölünce kişi başı ne düşer?”

| Adım | Düşünce | Araç çağrısı | Gözlem |
|---|---|---|---|
| 1 | Önce toplam tutarı bulmalıyım: 3 × 180. | hesap_makinesi("3 * 180") | 540 |
| 2 | Şimdi kişi başını bulayım: 540 ÷ 6. | hesap_makinesi("540 / 6") | 90 |
| 3 | Yeterli bilgim var, cevabı yazabilirim. | (araç yok) | Son cevap: Toplam 540 TL; 6 kişiye bölününce kişi başı 90 TL. |

Kareleri sırayla oku:

1. İlk kare. Ajan görevi ikiye bölüyor ve önce toplamı hedefliyor. Hesabı kendisi yapmıyor; “3 * 180” karakter dizisini hesap makinesine gönderiyor. Makine 540 döndürüyor. Bu sayı ajanın ürettiği bir tahmin değil, aracın verdiği bir gözlem.
2. İkinci kare. Düşünce satırında 540 var: ilk karenin gözlemi ikinci karenin girdisi oldu. Döngü adını buradan alır: her tur öncekinin sonucunu kullanır. Makine 90 döndürüyor.
3. Üçüncü kare. Ajan elindeki iki gözleme bakıp durmaya karar veriyor. Araç çağrısı yok; iki sayıyı bir cümleye döküyor. Durma kararı da modelin kararıdır; kimse ona “bitti” demedi.

Bu görevi model kafadan da çözebilirdi; sayılar küçük. Ama araç kesin sonuç verir, model tahmin eder. Sayılar büyüdükçe ya da iş takvime, arama motoruna, bir API’ye uzandıkça bu fark hayati olur. Şekilde döngü üç turda kapandı. Gerçek bir sistemde bir tur sınırı konur; yoksa kararsız kalan bir ajan aynı aracı sonsuza dek çağırabilir.

*Ne oluyor?* Ajan bir görevi adım adım çözer: önce “ne yapmalıyım?” diye düşünür, sonra bir araç kullanır (mesela hesap makinesi), aracın sonucunu görür ve bu sonuca göre bir sonraki adıma karar verir. Hedefe ulaşana kadar bu “düşün → kullan → gözlemle” döngüsünü tekrarlar.

*Kendin dene.* 1) Görev “4 pizza, tanesi 200 TL, 5 kişi” olsaydı üç kareyi düşünce, araç çağrısı ve gözlem sütunlarıyla kendin yaz. 2) İlk karede hesap makinesi bozulup 450 döndürseydi ikinci kare ve son cevap ne olurdu? Bu sana araçlar hakkında ne söylüyor? 3) Göreve “kişi başı bir de 30 TL içecek” eklenirse kaç araç çağrısı gerekir ve son cevap ne olur? Canlı demo: [QR 6.3]

#### Teknik derinlik

Ajan döngüsü (ör. ReAct): model bir düşünce üretir, bir eylem/araç çağrısı seçer (genelde yapılandırılmış “tool/function calling” ile), aracın çıktısını gözlem olarak alır ve hedefe ulaşana dek yineler. Araçlar modelin yeteneklerini dış dünyaya bağlar (hesap, arama, kod çalıştırma, API).

Tasarım konuları: araç şeması ve doğrulama, döngü/bütçe sınırı (sonsuz döngüyü önleme), hata yönetimi, ve güvenlik (modelin tehlikeli eylemleri tetiklememesi). Çok adımlı ajanlar güçlüdür ama kırılgandır; bu yüzden izlenebilirlik ve net sınırlar şarttır.

Her gözlem bir sonraki adımı besler; döngü/bütçe sınırı sonsuz döngüyü engeller.

Şekil 6.3’teki araç çağrısı düz yazı değil, yapılandırılmış bir mesajdır; model bir şema doldurur: `{"tool": "hesap_makinesi", "input": "3 * 180"}`. Orkestrasyon bu mesajı yakalar, aracı çalıştırır ve çıktıyı (540) gözlem olarak bir sonraki isteme ekler. Şekil 6.3’te bütçe üç adımdır; üçüncü adımda `isFinal` işareti döngüyü kapatır. Gerçek sistemde bu sınıra ek olarak her araç çıktısı şemaya göre doğrulanır ve tehlikeli eylemler (silme, ödeme) insan onayına bağlanır.

Elimizde üç alet var: iyi bir istem, bir kaynak rafı, bir araç kutusu. Bunları bir arada tutan iskelet nasıl kurulur?

### 6.5 Bir YZ uygulamasının mimarisi

Gerçek bir YZ uygulaması, iyi bir restoran gibidir; işi yalnız şef pişirmez. Siparişini alan garson vardır: arayüz. Mutfağı yöneten, kime ne zaman iş düşeceğine karar veren bir müdür vardır: orkestrasyon; asıl “beyin” odur. Malzemelerin durduğu kiler bilgi tabanıdır, tezgâhtaki aletler modelin araçlarıdır, müdavimlerin defteri de bellektir.

Şekil 6.4’te parçalara tek tek bak ve her birinin sistemde ne işe yaradığını gör. Karşında tipik bir YZ ürününün iskeleti var.

> **Kenar notu.** İyi haber: bu parçaların çoğu hazır araçlarla (vektör DB, orkestrasyon kütüphaneleri) kuruluyor. Kötü haber: asıl zorluk modelde değil, bu parçaları güvenilir biçimde bir araya getirmekte.

**Şekil 6.4 · Bir YZ uygulamasının parçaları**
![Şekil 6.4](../../figures/out/tr/sekil-6-4-arch.svg)

*Kurulum.* Şekil bir akış diyagramı: solda kullanıcı, sonra beş kutu. Önce arayüz, sonra orkestrasyon; orkestrasyondan üç kol çıkıyor: bilgi tabanı, araçlar ve bellek. Orkestrasyon kutusu turuncu; her kutunun sistemdeki rolü altındaki numaralı tabloda yazıyor. Modelin kendisi ayrı bir kutu değil; orkestrasyon onu çağırır.

*Adım adım.* Önce beş parçayı ve rollerini tabloda oku.

| Parça | Sistemdeki rolü |
|---|---|
| Arayüz | Kullanıcının soruyu yazdığı, cevabı gördüğü yer (sohbet ekranı, uygulama). |
| Orkestrasyon | Asıl “beyin”: istemi hazırlar, hangi aracı/bilgiyi ne zaman çağıracağına karar verir, akışı yönetir. |
| Bilgi tabanı | Senin verin (belgeler, notlar) burada gömü olarak durur; RAG ile ilgili parça getirilir. |
| Araçlar | Modelin dünyayla etkileşimi: hesap, arama, takvim, e-posta, bir API ya da kod çalıştırma. |
| Bellek | Konuşmanın geçmişini ve kullanıcıya dair durumu tutar; bağlamın sürmesini sağlar. |

Şimdi tek bir soruyu bu iskelette baştan sona yürüt. Kullanıcının sorusu: “Geçen hafta konuştuğumuz izin kuralına göre önümüzdeki cuma izin alabilir miyim?”

1. Arayüz soruyu alır ve orkestrasyona iletir. Garson siparişi mutfağa götürdü.
2. Orkestrasyon soruyu okur ve üç şeye ihtiyaç olduğuna karar verir: geçen haftaki konuşma, izin kuralı ve takvim.
3. Bellekten geçen haftanın özeti gelir: kullanıcı beş yılı doldurmuş bir çalışan, bu yıl 12 gün izin kullanmış.
4. Bilgi tabanından Şekil 6.2’deki §4 parçası gelir: 5 yıldan sonra 26 gün.
5. Araçlardan takvim çağrılır: cuma resmî tatil değil, ekipte o gün başka izinli yok.
6. Orkestrasyon bütün bunları tek bir isteme dizer, Şekil 6.1’deki gibi rol ve format ekler, modele gönderir.
7. Model cevabı yazar: 14 gün hakkı kalmış, cuma uygun. Cevap arayüze döner; bellek bu konuşmayı da not eder.

Yedi adımın beşinde model yok. Model altıncı adımda çağrılıyor, yedincide konuşuyor; cevabı iyi yapan ise öncesinde toplanan malzeme. Zor olan, bu yedi adımı her seferinde güvenilir biçimde yürütmek. Önceki üç şekil bu iskeletin birer parçasıydı: Şekil 6.1 orkestrasyonun istem hazırlaması, Şekil 6.2 bilgi tabanı, Şekil 6.3 araç kutusu.

*Ne oluyor?* Gerçek bir YZ uygulaması birkaç parçadan oluşur: kullanıcının konuştuğu arayüz, her şeyi yöneten orkestrasyon katmanı (asıl “beyin”), verinin durduğu bilgi tabanı, modelin kullandığı araçlar ve geçmişi tutan bellek. Parçaları asıl bir arada tutan, orkestrasyon katmanıdır; model ise çoğu zaman değiştirilebilir bir parçadır.

*Kendin dene.* 1) Şu üç soru hangi kutuyu çalıştırır? “Dün söylediğim tarihi hatırlıyor musun?” “Bugün dolar kaç?” “Şirketin iade politikası ne?” 2) Modeli daha ucuz bir modelle değiştirsen şekildeki hangi kutular değişir? 3) Restoran benzetmesini tamamla: garson, müdür, kiler, tezgâh aletleri ve müdavim defteri hangi kutulara denk geliyor? Canlı demo: [QR 6.4]

#### Teknik derinlik

Tipik mimari katmanları: (1) Arayüz/istemci; (2) Orkestrasyon (istem oluşturma, yönlendirme, araç/RAG çağrılarını koordine etme, bazen bir ajan çerçevesi); (3) Model(ler) (kendi barındırılan ya da API); (4) Bilgi tabanı (vektör DB + RAG); (5) Araçlar/eylemler (API’ler, fonksiyonlar); (6) Bellek (kısa süreli bağlam + kalıcı durum); (7) Gözlem/güvenlik (loglama, değerlendirme, korkuluklar).

Pratikte orkestrasyon katmanı ürünü ürün yapan yerdir: maliyet, gecikme, önbellekleme, geri çekilme (fallback) ve değerlendirme hattı burada kurulur. Model çoğu zaman değiştirilebilir bir bileşendir.

Tipik mimari: arayüz, orkestrasyon (asıl “beyin”), bilgi tabanı (RAG), araçlar ve bellek.

Şekil 6.4 yedi katmandan beşini gösterir. Eşleme:

| Teknik katman | Şekil 6.4’teki kutu |
|---|---|
| (1) Arayüz/istemci | Arayüz |
| (2) Orkestrasyon | Orkestrasyon |
| (3) Model(ler) | Ayrı kutu yok; orkestrasyon çağırır |
| (4) Bilgi tabanı | Bilgi tabanı |
| (5) Araçlar/eylemler | Araçlar |
| (6) Bellek | Bellek |
| (7) Gözlem/güvenlik | Şekilde yok; orkestrasyonun etrafını sarar |

Modelin ve gözlem katmanının şekilde kutu olmaması bilinçli bir seçimdir: ikisi de orkestrasyonun içinden ya da etrafından çalışır. Model bir çağrıdır; loglama, değerlendirme ve korkuluklar ise her çağrının önüne ve arkasına konan süzgeçlerdir.

İskelet hazır. Aynı iskelet hastanede, bankada ve fabrikada neye dönüşüyor?

### 6.6 Gerçek dünyada yapay zekâ

Bütün bu parçalar birleşince yapay zekâ laboratuvardan çıkıp sokağa karışıyor. Hastanede filme bakan göze yardım ediyor, bankada dolandırıcıyı yakalıyor, fabrikada arızayı kokusundan tanıyor, laboratuvarda yeni moleküller öneriyor, atölyede ressamın yanına oturuyor.

Bir alan seç; yapay zekânın orada bugün nasıl kullanıldığına dair somut örnekleri gör.

> **Kenar notu.** Yapay zekâ çoğu işi sıfırdan devralmaz; bir aracı, bir “yardımcı pilot” olur. En başarılı uygulamalar, insanı değiştiren değil, insanı güçlendiren tasarımlardır.

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

| Temel beceri | Tablodaki örnekleri |
|---|---|
| Tanıma (sınıflandırma) | Röntgende anormallik tespiti, görüntüyle kalite kontrol, dolandırıcılık tespiti |
| Tahmin | Kestirimci bakım, talep tahmini, protein yapısı, aday molekül tarama |
| Üretme | Görsel ve müzik üretimi, konsept tasarım, üslup aktarımı, yazma yardımı, hipotez üretimi |
| Getirme ve özetleme | Hasta notu özetleme, sözleşme analizi, örüntü keşfi, öneri sistemleri |
| Adım adım iş yapma (ajan) | Müşteri destek asistanları, sesli asistanlar |

Röntgendeki lekeyi bulan sınıflandırıcı ile üretim bandındaki çatlağı bulan sınıflandırıcı aynı fikirdir; yalnız verisi farklı. Önceki bölümlerde öğrendiğin örüntü tanıma ve üretim ile bu bölümdeki ajan döngüsü, on sekiz örneğin tamamını kapsıyor. Yeni bir beceri yok; yeni olan, becerinin dokunduğu veri.

Fark eden şey hatanın bedeli. Sanatta yanlış bir eskiz silinir gider. Finansta yanlış bir dolandırıcılık alarmı bir müşteriyi kaybettirir; kaçan bir alarm daha pahalıdır. Sağlıkta gözden kaçan bir leke hayata mal olabilir. Tablodaki her satır bu yüzden aynı iskeleti kullanır ama farklı korkuluk ister. Yardımcı pilot fikri de bu: karar insanın, hız ve dikkat yapay zekânın. Sağlıkta sınıflandırıcının çıktısı hekimin önüne bir öneri olarak gelir; son sözü hekim söyler. Sanatta ise eskizi ressam beğenmezse siler, yenisini ister.

*Ne oluyor?* Aynı temel beceriler (tanıma, tahmin, üretme, arama, adım adım iş yapma) farklı sektörlerin verisine uyarlanır. Ama her alanın kuralları farklıdır: sağlıkta hata pahalıdır, finansta denetlenebilirlik şarttır. Bu yüzden önemli olan sadece “YZ eklemek” değil, onu sorumlu ve ölçülebilir biçimde kullanmaktır.

*Kendin dene.* 1) On sekiz örneği beş beceriye kendin dağıt; ikinci tabloyla karşılaştır, hangi örnekler iki beceriye birden giriyor? 2) Her alandan hatanın bedeli en yüksek örneği seç ve bir cümleyle nedenini yaz. 3) Kendi işinden bir örnek yaz: hangi beceri, hangi alan, Şekil 6.4’teki hangi kutular gerekir? Canlı demo: [QR 6.5]

#### Teknik derinlik

Uygulama alanları, aynı temel yetenekleri (sınıflandırma, tahmin, üretim, getirme, ajan) farklı verilere uyarlar. Örnekler: tıbbi görüntü analizi ve karar desteği; anomali/dolandırıcılık tespiti ve risk modelleme; kestirimci bakım ve kalite kontrol; ilaç/malzeme keşfi ve simülasyon; üretken tasarım ve içerik üretimi.

Gözden kaçmaması gereken nokta: her alanda doğruluk, güvenlik, mahremiyet ve düzenleme gereksinimleri farklıdır (ör. sağlıkta yüksek hata maliyeti, finansta denetlenebilirlik). Bu yüzden “YZ’yi entegre etmek” kadar “sorumlu ve değerlendirilebilir biçimde entegre etmek” önemlidir; sıradaki bölümlerin konusu da bu.

Atölyenin aletleri yerine oturdu mu? Altı soruyla sına.

### 6.7 Kendini test et

*Cevaplar kitabın sonunda.*

1. İstem mühendisliğinde bir cevabı iyileştiren nedir?
   a) Daha kısa yazmak
   b) Modeli yeniden eğitmek
   c) Daha pahalı GPU
   d) Rol, bağlam, örnek ve net format eklemek

2. RAG temelde ne yapar?
   a) İlgili kaynağı bulup modele vererek cevabı kaynağa dayandırır
   b) Görsel üretir
   c) Modeli hızlandırır
   d) Veriyi siler

3. Bir “ajanı” sohbet botundan ayıran nedir?
   a) Araç kullanıp adım adım eyleme geçmesi
   b) Daha hızlı yazması
   c) Renkli arayüzü
   d) İnternetsiz çalışması

4. Tipik bir YZ uygulamasında “orkestrasyon” katmanı ne yapar?
   a) Yalnızca ekranı çizer
   b) İstem, araç ve RAG çağrılarını koordine eder
   c) Modeli eğitir
   d) Sadece veriyi saklar

5. Halüsinasyonu azaltmanın pratik bir yolu nedir?
   a) Sıcaklığı sonuna kadar açmak
   b) RAG ile cevabı kaynağa dayandırmak
   c) Modeli kapatmak
   d) Daha uzun istem yazmak

6. En başarılı YZ uygulamaları genelde nasıldır?
   a) Yalnızca en büyük modeli kullanan
   b) İnsanı tamamen dışlayan
   c) Hiç değerlendirme gerektirmeyen
   d) İnsanı güçlendiren (yardımcı pilot) tasarımlar

### Bu bölümden kalanlar

- Tek başına bir dil modeli atölyesiz bir ustadır; onu asistan yapan, etrafına kurulan istem, kaynak, araç ve mimaridir.
- İyi bir istem rol, bağlam, örnek ve format taşır; aynı model, daha iyi soruya daha iyi cevap verir.
- RAG, cevaptan önce doğru belgeyi bulup modele verir; model kaynağa dayanır, uydurma azalır ve kaynak gösterilir.
- Bir ajan “düşün, araç kullan, gözlemle” döngüsüyle çok adımlı iş yapar; tur sınırı ve doğrulama onu güvenli tutar.
- Gerçek bir YZ uygulamasında asıl beyin orkestrasyon katmanıdır; model çoğu zaman değiştirilebilir bir parçadır.
- Aynı temel beceriler her sektöre uyarlanır; alanlar arasında değişen şey hatanın bedeli ve gereken korkuluktur.
- En başarılı uygulamalar insanı güçlendiren yardımcı pilot tasarımlarıdır.

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
-->

<!-- REDAKSİYON NOTLARI
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
-->
