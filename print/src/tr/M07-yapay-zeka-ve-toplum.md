# Bölüm 7
## Yapay Zekâ ve Toplum
*Önyargıdan düzenlemeye, deepfake’ten hizalamaya*

<!-- acc #b03a52 · tag Toplum -->

### 7.1 Yapay zekâ ve toplum

Yapay zekâ artık bir laboratuvar oyuncağı değil; kredi başvurularını, iş ilanlarını, haber akışını, hatta sağlık kararlarını etkiliyor. Etkisi büyüdükçe sorumluluk da büyüyor. Artık sıra teknolojinin insana dokunduğu yerde.

Beş başlık var: makinelerin veriden miras aldığı önyargı, kara kutu kararlar, deepfake ve dezenformasyon, düzenleme (AB AI Act, KVKK) ve hizalama: makine amacımızı gerçekten anlıyor mu? İşin değişen doğası ve filtre balonu gibi sessiz etkiler de arada.

> **Kenar notu.** “Yapay zekâ tarafsızdır” bir efsanedir. Bir model, kendisini eğiten verinin ve onu kuran insanların değerlerini taşır. O yüzden “nasıl çalışıyor” kadar “kime, nasıl etki ediyor” da önemlidir.

#### Teknik derinlik

Bu bölüm YZ’nin toplumsal-teknik (sociotechnical) boyutunu ele alır: sistemler boşlukta değil, kurumların, verinin ve insanların içine gömülü çalışır; etkileri de oradan doğar.

Ele alınan eksenler: veri kaynaklı yanlılık ve adalet (fairness), açıklanabilirlik/yorumlanabilirlik (XAI), sentetik medya ve dezenformasyon, düzenleyici çerçeveler (AB AI Act’in risk temelli yaklaşımı, KVKK/GDPR’ın kişisel veri ilkeleri) ve hizalama/güvenlik. Amaç, teknik bilgiyi toplumsal sorumlulukla birlikte okumak.

Beş başlığın ilki en sessiz olanı: model, kimse fark etmeden geçmişin defterinden neyi öğreniyor?

### 7.2 Önyargı: veriden karara

Bir model ders kitabı olarak geçmişin defterini okur. Defter çarpıksa, çalışkan öğrenci çarpıklığı da ezberler. Geçmişte bir gruba sistematik olarak daha az kredi verilmişse, o defterle eğitilen model bunu “dünyanın kuralı” sanır ve aynısını tekrarlar; birebir aynı nitelikteki insanlara bile farklı kararlar verir. Kötü niyetten değil, çarpık defterden.

İki grup (A ve B) tıpatıp aynı nitelikte; Şekil 7.1’de yalnızca eğitim verisindeki önyargı artıp azalıyor. Modelin kararının nasıl kaydığını gör.

> **Kenar notu.** “Çöp girer, çöp çıkar.” Bir modelin adil olması için önce verisinin adil ve temsili olması gerekir. Sorumluluk modelde değil, çoğu zaman veriyi seçen ve kuran insanlardadır.

**Şekil 7.1 · Önyargı simülasyonu**
![Şekil 7.1](../../figures/out/tr/sekil-7-1-bias.svg)

*Kurulum.* Şekilde iki grup var: A ve B. İkisi de aynı gelire, aynı ödeme geçmişine, aynı borca sahip; niteliklerde tek bir fark yok. Değişen tek şey eğitim verisindeki önyargı; şekil bunu yüzde 0 ile yüzde 100 arasında bir ölçek olarak gösteriyor. Şekildeki üç panel ölçeğin yüzde 0, 50 ve 100 noktalarını gösteriyor. Her önyargı düzeyi için model iki gruba ayrı onay oranı veriyor. İki çubuk bu oranları yan yana koyuyor; aradaki boşluk parite farkı.

*Adım adım.* Gösterimin kuralı tek satır: önyargı e ise A grubunun onay oranı 50 + 0.4·e, B grubununki 50 − 0.4·e. Parite farkı bu iki oran arasındaki fark (0.8·e); önyargı her bir puan arttığında fark 0.8 puan açılıyor. Tablo, ölçeğin beş noktasında ne olduğunu gösteriyor:

| Veri önyargısı (e) | A onay | B onay | Parite farkı | Gösterimin yorumu |
|---|---|---|---|---|
| %0 | %50 | %50 | 0 | Veri dengeli |
| %8 | %53 | %47 | 6 | Veri dengeli (sınır) |
| %25 | %60 | %40 | 20 | Çarpık |
| %50 | %70 | %30 | 40 | Çarpık |
| %100 | %90 | %10 | 80 | Çarpık |

1. Önyargı yüzde 0: iki grup da yüzde 50 onay alıyor. Aynı niteliğe aynı karar; adil olan da bu.
2. Önyargı yüzde 8’e kadar fark 6 puanı geçmiyor; gösterim bu aralığı hâlâ dengeli sayıyor.
3. Yüzde 9’dan itibaren etiket çarpığa dönüyor. Yüzde 50’de model A’yı 70, B’yi 30 onaylıyor; nitelikler aynı, fark yalnız veriden.
4. Yüzde 100’de fark 80 puana çıkıyor. A grubundan on başvurunun dokuzu onay alırken B grubundan yalnız biri alıyor. Başvuranların nitelikleri hiç değişmedi; yalnız modelin okuduğu defter değişti.

*Ne oluyor?* İki grup birebir aynı nitelikte; değiştirdiğimiz tek şey eğitim verisindeki önyargı. Model geçmişteki çarpık örüntüyü “doğru” sanıp tekrarlıyor ve aynı nitelikteki insanlara bile farklı kararlar veriyor.

*Kendin dene.* 1) Önyargı yüzde 75 iken A ve B’nin onay oranını ve parite farkını kendin hesapla. 2) Gösterim, fark 6 puan ve altındayken veriyi dengeli sayıyor. Bu eşik ilk kez hangi önyargı düzeyinde aşılır? 3) Kural gereği A hiçbir zaman yüzde 95’i geçemez, B yüzde 5’in altına inemez. Ölçeğin ucunda bile bu sınırlara ulaşılıyor mu? Neden? Canlı demo: [QR 7.1]

#### Teknik derinlik

Algoritmik yanlılık çoğunlukla veriden kaynaklanır: tarihsel önyargı, eksik temsil, etiketleme hatası veya vekil değişkenler (proxy) korunan özelliklerle ilişkilenir. Model, dağılımdaki bu örüntüyü öğrenir ve pekiştirir.

Adalet (fairness) tek bir tanım değildir; demografik parite, fırsat eşitliği ve kalibrasyon gibi ölçütler bazen birbiriyle çelişir. Azaltma: veri denetimi, dengeleme, adalet-kısıtlı eğitim ve dağıtım sonrası izleme. Şekil 7.1, aynı niteliklere rağmen veri önyargısının karar farkı (gap) ürettiğini gösterir.

Nitelikler sabit; tek değişen eğitim verisindeki yanlılık. Karar farkı (demografik parite ihlali) buradan doğar.

Gösterimin modeli: A = yuvarla(min(95, 50 + 0.4·e)), B = yuvarla(max(5, 50 − 0.4·e)), gap = A − B. Demografik parite, P(onay | A) = P(onay | B) koşuludur; gap = 0 dışında her değer bu koşulu ihlal eder. Gösterim, gap ≤ 6 için “dengeli” etiketi kullanır; bu bir tolerans seçimidir, adaletin tanımı değil.

Önyargıyı ölçebildik. Modelin verdiği tek bir kararın gerekçesini de görebilir miyiz?

### 7.3 Kara kutu mu, beyaz kutu mu?

Model “kredin reddedildi” deyince haklı bir soru yükselir: Neden? Birçok güçlü model, kararını verir ama gerekçesini anlatamaz; kapağı açılmayan bir kara kutu gibidir. Oysa insan hayatına dokunan kararlarda (kredi, işe alım, sağlık) “neden?” diye sorabilmek ve cevabını görebilmek bir hak meselesidir. Kara kutuyu camdan bir kutuya çevirmek gerekir.

Önce bir kredi kararına bak; sonra Şekil 7.2’deki gerekçe tablosunda hangi etkenin kararı ne yönde ittiğini (artı mı, eksi mi) gör. Kara kutu böyle beyaz kutuya döner.

> **Kenar notu.** Açıklanabilirlik yalnızca teknik bir lüks değil; güven, itiraz hakkı ve hesap verebilirliğin önkoşuludur. “Neden?” sorusuna cevap veremeyen bir sistem, yüksek etkili kararlarda tehlikelidir.

**Şekil 7.2 · Beyaz kutu: kararı açıkla**
![Şekil 7.2](../../figures/out/tr/sekil-7-2-explain.svg)

*Kurulum.* İki kredi başvurusu var. Her başvurunun üst yarısı kara kutu: yalnızca sonucu gösteriyor, onay ya da ret. Alt yarısı aynı kararın kapağını açıyor. Her etkenin yanında işaretli bir sayı duruyor; artı olanlar onaya, eksi olanlar redde doğru çekiyor. Çubuğun uzunluğu etkenin gücünü gösteriyor; en güçlü etken tam boy, ötekiler ona oranla kısa.

*Adım adım.* Kural tek cümle: dört katkının toplamı sıfırdan büyükse kredi onaylanır, değilse reddedilir.

| Başvuru #1 | Katkı |
|---|---|
| Düzenli gelir | +32 |
| Yüksek mevcut borç | −46 |
| İyi ödeme geçmişi | +18 |
| Kısa hesap geçmişi | −12 |
| **Toplam** | **−8 → Kredi reddedildi** |

| Başvuru #2 | Katkı |
|---|---|
| Yüksek gelir | +40 |
| Düşük borç | +28 |
| Uzun, temiz geçmiş | +22 |
| Yeni işe başlama | −14 |
| **Toplam** | **+76 → Kredi onaylandı** |

1. Başvuru #1, kapak kapalıyken: “Kredi reddedildi”. Başka hiçbir bilgi yok; itiraz edecek bir yer de yok. Başvuran, sonuçla baş başa kalıyor.
2. Kapak açılınca hesap ortaya çıkıyor. İki artı etken (+32 ve +18) toplam +50 ediyor; iki eksi etken (−46 ve −12) toplam −58. Fark −8; sıfırın altında kaldığı için ret. Tek bir etken, yüksek mevcut borç, bütün artıları siliyor. Tabloyu gören başvuran ne yapacağını da biliyor: itiraz edecekse borç kalemine itiraz eder, düzeltecekse önce onu düzeltir.
3. Başvuru #2’de üç artı etken +90 ediyor, tek eksi etken −14. Toplam +76; onay. Yeni işe başlama kararı aşağı çekiyor ama sonucu değiştirmeye yetmiyor.
4. İki başvuruda da aynı hesap: artı etkenler onaya, eksiler redde itti; toplam (−8 ya da +76) sonucu belirledi. İşaretli katkılar kara kutuyu böyle açıyor.

*Ne oluyor?* Her etkenin kararı hangi yöne ittiğini görüyoruz: turuncular onaya, griler redde doğru çekiyor. Bu artı ve eksilerin toplamı sonucu belirliyor. Böylece “neden bu karar verildi?” sorusu cevaplanabiliyor; model “kara kutu” olmaktan çıkıp denetlenebilir ve itiraz edilebilir hâle geliyor.

*Kendin dene.* 1) Başvuru #1’deki kişi borcunun bir kısmını kapatıyor ve “Yüksek mevcut borç” katkısı −46’dan −36’ya iniyor. Karar değişir mi? 2) Başvuru #2’de “Yeni işe başlama” etkeni en az kaç puan olsaydı karar redde dönerdi? 3) Başvuru #1’de en uzun çubuk “Yüksek mevcut borç”. “Düzenli gelir” çubuğu onun yüzde kaçı uzunluğunda çizilir? Canlı demo: [QR 7.2]

#### Teknik derinlik

Açıklanabilir YZ (XAI), bir modelin çıktısını insanın anlayabileceği gerekçelere bağlamayı amaçlar. Yöntemler: özellik önemi (ör. SHAP, LIME), dikkat/temsil analizi ve doğası gereği yorumlanabilir modeller (karar ağaçları, doğrusal modeller).

Açıklanabilirlik bir denge işidir: yüksek başarımlı modeller genelde daha az saydamdır. Düzenleme açısından önemlidir: yüksek etkili kararlarda gerekçe, itiraz ve denetim hakkı doğar. Şekil 7.2, katkıların işaretli (signed) gösterimini basitleştirir.

İşaretli özellik katkıları hangi girdinin kararı ne kadar ve ne yönde etkilediğini gösterir: turuncu onaya, gri redde. Toplam sonucu belirler; model böylece denetlenebilir ve itiraz edilebilir olur.

Şekil 7.2’deki karar kuralı: karar = onay ⇔ Σᵢ cᵢ > 0. Bu, doğrusal bir modelin (ya da SHAP’ın toplamsallık özelliğinin) en yalın hâlidir: her cᵢ tek bir özelliğin taban değere göre katkısıdır ve katkılar toplanarak çıktıyı verir. Gerçek SHAP değerleri Shapley aksiyomlarıyla (verimlilik, simetri, sıfır katkı) hesaplanır; şekil bu sayıları verili kabul eder. Çubuk uzunluğu |cᵢ| / max|cᵢ| ile ölçeklenir; yön, işaretin rengidir.

Gerekçesi açık bir karar bile bir koşula dayanır: girdinin gerçek olması. Ya girdi sahteyse?

### 7.4 Deepfake ve dezenformasyon

“Gözümle gördüm, kulağımla duydum” demek eskiden yeterdi. Artık değil: Üretken YZ, hiç yaşanmamış bir konuşmayı, çekilmemiş bir fotoğrafı, söylenmemiş bir cümleyi gerçekmiş gibi üretebiliyor. Eğlencesi de var; ama sahte kanıt, taklit dolandırıcılığı ve toplu yanıltma da aynı kapıdan giriyor.

Aşağıda birkaç durum var. Her biri için “gerçek mi, yapay mı?” diye karar ver; sonra ipucunu görüp sahteyi yakalamanın yollarını öğren.

> **Kenar notu.** Tek bir görüntü ya da ses artık “kanıt” değildir. En iyi savunma şüphecilik ve kaynak doğrulamadır: “Kim söyledi, nereden geldi, başka nerede doğrulanıyor?”

**Şekil 7.3 · Gerçek mi, yapay mı?**
![Şekil 7.3](../../figures/out/tr/sekil-7-3-df.svg)

*Kurulum.* Şekil dört kart gösteriyor; her kartta ortamı ve kısa bir durum yazıyor. Kartların arkası, ipucu ve doğru cevap, kitabın sonundaki cevaplar bölümünde. Kuralı şimdiden koy: her kartta karar vermeden önce “kim söyledi, nereden geldi, başka nerede doğrulanıyor?” diye sor. Tutarsızlık da ara: görüntü sese uyuyor mu, ayrıntılar birbirini tutuyor mu, aciliyet baskısı var mı? Dört kartın ikisi görüntü, biri ses, biri yazılı haber; sahtecilik tek bir ortamda kalmıyor.

*Kendini sına.* Her durum için “gerçek” ya da “yapay/sahte” de; sonra bir cümleyle gerekçeni yaz.

1. Bir videoda tanınmış biri hiç söylemediği bir cümleyi söylüyor; dudak hareketleri sese tam oturmuyor. Gerçek mi, yapay mı?
2. Telefonda “patronun” acil para transferi istiyor; sesi tıpkı ona benziyor ama tonlama biraz robotik. Gerçek mi, dolandırıcılık mı?
3. Bir gazetenin web sitesinde yayımlanan, birden çok bağımsız kaynağın da doğruladığı bir haber. Gerçek mi, yapay mı?
4. Bir fotoğrafta kişinin elinde altı parmak var ve arka plandaki yazılar anlamsız harflerden oluşuyor. Gerçek mi, yapay mı?

Dört durumun ortak dersi: karar tek bir ayrıntıya değil, üç sorunun toplamına dayanır. Kaynağı izlenebilen, başka kanallardan doğrulanan ve tutarsızlık taşımayan içerik güven kazanır. Bu üç koşuldan biri eksikse, içerik ne kadar inandırıcı olursa olsun bekle ve doğrula. Dört kartta kaç doğru? Cevaplar ve her karta ait ipucu kitabın sonunda.

*Ne oluyor?* Sahte içeriği yakalamak bir alışkanlık işidir: tutarsızlıklara, kaynağa ve bağlama dikkat et. Üretim teknolojisi geliştikçe sahteyi ayırt etmek zorlaşıyor; en sağlam korunma, “kim söylemiş, nereden gelmiş, başka yerde doğrulanıyor mu?” diye sormak ve tek bir görüntüye ya da sese kanıt gözüyle bakmamaktır.

*Kendin dene.* 1) İkinci karttaki aramayı sen aldın. Parayı göndermeden önce atacağın iki somut adımı yaz. 2) Kendi haber akışından bugün gördüğün bir içeriği seç. Üç soruyu ona uygula ve cevaplarını yaz; hangisi cevapsız kaldı? 3) Bir içerik dört karttaki izlerin hiçbirini taşımıyorsa kesinlikle gerçek midir? Neden? Canlı demo: [QR 7.3]

#### Teknik derinlik

Sentetik medya (deepfake), üretken modellerle (GAN/difüzyon, ses klonlama, dudak senkronu) üretilir. Tespit bir silahlanma yarışıdır: üretim iyileştikçe tespit zorlaşır. Yaklaşımlar: yapay üretim izlerini arayan sınıflandırıcılar, kaynak doğrulama ve içerik kimlik bilgisi (ör. C2PA gibi dijital köken/filigran standartları).

Birey düzeyinde en sağlam savunma medya okuryazarlığıdır: kaynağı sorgula, bağlamı doğrula, tek bir “kanıta” güvenme. Dezenformasyon teknik bir sorun olduğu kadar toplumsal bir sorundur.

Sentetik medyayı ayırt etmek bir alışkanlıktır: tutarsızlık, kaynak ve bağlam ipuçlarına bak.

Bireyin şüpheciliği tek başına yetmediğinde sıra kurumlara geliyor: devlet, bu riskleri nasıl sınıflandırıyor?

### 7.5 Düzenleme: riski sınıflandırmak

Trafikte bisikletle kamyona aynı kurallar uygulanmaz; biri yanlış park eder, öteki koca bir kavşağı kapatır. Yapay zekâ da her yerde aynı riski taşımaz: Spam filtresiyle, işe alım kararı veren sistem aynı şey değildir. Bu yüzden Avrupa Birliği’nin YZ Yasası (AI Act) gibi düzenlemeler kullanımları riske göre dört kademeye ayırır: kabul edilemez (yasak), yüksek, sınırlı ve minimal.

Aşağıdaki kullanımları doğru risk düzeyine yerleştir. Risk arttıkça yükümlülükler de (şeffaflık, denetim, insan gözetimi) artar.

> **Kenar notu.** Düzenlemenin mantığı basit: risk ne kadar yüksekse, kural o kadar sıkı. Bir oyun YZ’siyle birinin hayatını etkileyen bir karar sistemi aynı ölçüde denetlenmemeli.

**Şekil 7.4 · Riski sınıflandır**
![Şekil 7.4](../../figures/out/tr/sekil-7-4-reg.svg)

*Kurulum.* Şekil bir merdiven gösteriyor: dört basamak, en altta minimal, en üstte yasak. Her basamağın yanında o kademenin kuralı yazıyor. Altı kullanım kartı merdivenin dibinde bekliyor; senin işin her kartı doğru basamağa koymak. Ölçüt tek soru: bu kullanım birinin hayatını ya da haklarını etkiliyor mu? Merdivenin mantığı her basamağın getirdiği yükte: yukarı çıktıkça belge, denetim ve insan gözetimi eklenir.

| Kademe | Kural |
|---|---|
| Yasak (kabul edilemez risk) | Piyasaya sürülemez; temel haklara aykırı |
| Yüksek | Sıkı uyum, dokümantasyon ve insan gözetimi zorunlu |
| Sınırlı | Şeffaflık: kullanıcı bir YZ ile etkileştiğini bilmeli |
| Minimal | Büyük ölçüde serbest |

*Kendini sına.* Her kullanım için bir kademe seç: yasak, yüksek, sınırlı ya da minimal. Sonra bir cümleyle neden o basamak olduğunu yaz. Kademeni yanına yaz; sonunda altıda kaç doğru, say.

1. Vatandaşları davranışına göre puanlayan devlet sistemi. Hangi kademe?
2. İşe alımda adayları otomatik eleyen sistem. Hangi kademe?
3. Müşteriyle konuşan sohbet botu. Hangi kademe?
4. E-postada spam filtresi. Hangi kademe?
5. Kredi başvurusu değerlendiren model. Hangi kademe?
6. Oyun içindeki rakip yapay zekâ. Hangi kademe?

Takılırsan tek soruya dön: bu kullanım birinin hayatını ya da haklarını etkiliyor mu? Cevaplar ve gerekçeler kitabın sonunda.

*Ne oluyor?* Her YZ aynı riski taşımaz, o yüzden kullanımlar riske göre kademelenir: kabul edilemez olanlar (ör. sosyal puanlama) yasaklanır; yüksek riskliler (kredi, işe alım) sıkı denetim ve insan gözetimi ister; sınırlı riskliler (sohbet botu) sadece şeffaflık; minimal riskliler serbesttir. Risk arttıkça kural da sıkılaşır.

*Kendin dene.* 1) Kendi gününden bir YZ kullanımı seç: harita uygulaması, telefon klavyesinin kelime önerisi ya da bankanın dolandırıcılık uyarısı. Kademesini belirle ve gerekçeni yaz. 2) Aynı teknoloji iki farklı basamağa düşebilir mi? Yüz tanımayı düşün: telefon kilidini açmak ile sokakta kalabalığı taramak. 3) Altı kullanımı önce iki kümeye ayır: birinin hayatını ya da haklarını etkileyenler ve etkilemeyenler. Sonra kümeleri kademelerle karşılaştır; kaç kart yüksek basamakta? Canlı demo: [QR 7.4]

#### Teknik derinlik

AB YZ Yasası risk-temelli bir çerçeve kurar: kabul edilemez risk (ör. sosyal puanlama) yasaklanır; yüksek risk (ör. işe alım, kredi, kritik altyapı) sıkı uyum, dokümantasyon ve insan gözetimi gerektirir; sınırlı risk (ör. sohbet botları) şeffaflık yükümlülüğü taşır; minimal risk büyük ölçüde serbesttir.

Bu, KVKK/GDPR gibi kişisel veri rejimlerini tamamlar (rıza, amaç sınırlaması, veri minimizasyonu, otomatik kararlara itiraz hakkı). Düzenleme henüz olgunlaşıyor; amaç inovasyonu boğmadan temel hakları korumaktır.

Aynı YZ etiketi çok farklı riskler taşır; düzenleme de bu yüzden kademeli.

Kurallar dışarıdan çizilen sınırlar. Makinenin içine ne istediğimizi koyabiliyor muyuz?

### 7.6 Hizalama: dediğin mi, demek istediğin mi?

Kral Midas’ı hatırla: “Dokunduğum her şey altın olsun” diledi ve dileği harfi harfine gerçekleşti; ekmeği de altın oldu, kızı da. Makineler de dilekleri masallardaki cinler gibi yerine getirir: söylediğin sözü yapar ama her zaman kastettiğini değil. “Odada görünürde çöp kalmasın” dersen çöpü halının altına süpürebilir. Buna hizalama sorunu denir: Belirttiğin hedef ile gerçekten istediğin şey her zaman aynı değildir.

Bir hedef seç; sistemin onu “teknik olarak doğru ama aslında yanlış” biçimde nasıl yerine getirebildiğini gör.

> **Kenar notu.** Asıl zorluk, makineye “ne istediğini” eksiksiz anlatmanın neredeyse imkânsız olmasıdır. Bu yüzden hizalama, güçlü YZ çağının en çetin açık problemlerinden biridir.

**Şekil 7.5 · Hedef ile niyet**
![Şekil 7.5](../../figures/out/tr/sekil-7-5-align.svg)

*Kurulum.* Şekil üç sütunlu bir tablo. Sol sütunda insanın verdiği hedef, ortada sistemin gerçekten yaptığı şey, sağda çıkarılan ders. Üç hedef üç ayrı dünyadan geliyor: bir temizlik robotu, bir sohbet asistanı ve bir oyun oyuncusu. Üçünde de sistem hedefi yerine getiriyor; sorun da bu. Sistem, hedef cümlesini bir hukukçu gibi okuyor: sözcükleri, niyeti değil. Üç hedef yan yana duruyor ki ortak deseni görebilesin.

*Adım adım.*

| Verilen hedef | Sistemin yaptığı | Ders |
|---|---|---|
| “Odada görünürde çöp kalmasın” | Çöpü toplamak yerine halının altına süpürür; “görünürde” kalmadı ama sorun çözülmedi. | Hedefi harfiyen yaptı, niyetini değil. Eksik tanımlı hedef → yan etki. |
| “Kullanıcıdan olumlu geri bildirim al” | Doğruyu söylemek yerine kullanıcının duymak istediğini söyler (yağcılık). | Vekil hedef (beğeni) gerçek hedeften (yardımcı + dürüst olmak) ayrıştı. |
| “Oyunda en yüksek puanı al” | Oyunu oynamak yerine bir puan döngüsü/açığı bulup sömürür. | Ödül oyunlama: metriği maksimize etti, asıl amacı değil. |

1. Birinci satırda hedefteki tek bir sözcük, “görünürde”, kapıyı açıyor. Sen temiz bir oda istedin; sistem görünmeyen çöp istedi. İkisi de cümleye uyuyor, yalnız biri niyetine uyuyor.
2. İkinci satırda hedef bir ölçüt: olumlu geri bildirim. Ölçüt, “yardımcı ve dürüst ol”un vekili. Vekil ile asıl amaç ayrışınca sistem vekili seçiyor; çünkü ölçülen o.
3. Üçüncü satırda ölçüt puan. Oyunu iyi oynamak puan getiriyor, ama puan getiren tek yol o değil. Bir döngü ya da açık daha ucuzsa sistem onu bulur. Ölçüt puan olduğu sürece sistem için “oyunun ruhu” diye bir şey yoktur.
4. Üç satırın ortak deseni: hedef, niyetin eksik bir çevirisidir; boşluk büyüdükçe yan etki büyür. Hizalama bu yüzden tek seferlik bir ayar değil, hedefi yazan insanla onu yorumlayan sistem arasında süren bir pazarlık.

*Ne oluyor?* Makineye bir hedef verirsin, o da hedefi harfi harfine yapar ama asıl niyetini kaçırabilir: “odada çöp görünmesin” dersen çöpü halının altına süpürebilir. Verdiğin ölçütü en üst düzeye çıkarır, amacını değil. İnsan geri bildirimi (RLHF) bunu azaltır ama tümüyle çözmez; üstelik “kimin değerleri?” sorusu da işin içindedir.

*Kendin dene.* 1) “Odada görünürde çöp kalmasın” hedefini, halının altına süpürmeyi engelleyecek biçimde yeniden yaz. Sonra yeni hedefindeki açığı bul. 2) Bir öğretmen ders asistanına “sınıfın sınav ortalamasını yükselt” hedefi veriyor. Sistemin bulabileceği iki kısa yol yaz; biri zararsız, biri zararlı olsun. 3) Üç satırın dersini tek cümleye indir; “ölçüt” ve “niyet” sözcüklerini kullan. Canlı demo: [QR 7.5]

#### Teknik derinlik

Hizalama (alignment), bir sistemin davranışını insan niyet ve değerleriyle uyumlu kılma problemidir. Vekil hedef (proxy) ile gerçek hedef ayrıştığında, model belirtim oyunlama (specification gaming) ya da ödül oyunlama (reward hacking) sergiler: metriği maksimize eder, amacı değil.

RLHF gibi yöntemler insan tercihleriyle hizalamayı iyileştirir ama tam çözmez; açık sorunlar: ölçeklenebilir gözetim, dürüstlük, jailbreak’lere dayanıklılık ve değer çoğulluğu. Hizalama, hem teknik hem normatif (kimin değerleri?) bir sorudur.

Belirtim/ödül oyunlama, üç örneğin ortak teknik adı: vekil hedef gerçek hedeften ayrıştığında model metriği maksimize eder, amacı değil.

Beş başlık bitti; altı soru kaldı.

### 7.7 Kendini test et

*Cevaplar kitabın sonunda.*
1. Algoritmik önyargı çoğunlukla nereden gelir?
   a) Ekran renginden
   b) Çarpık/eksik eğitim verisinden
   c) İnternet bağlantısından
   d) Yavaş donanımdan

2. “Kara kutu” model ne demektir?
   a) Çok hızlı olması
   b) Kararının gerekçesini anlamanın zor olması
   c) İnternetsiz çalışması
   d) Kutuda saklanması

3. Deepfake’e karşı en sağlam bireysel savunma?
   a) Daha hızlı internet
   b) Hiçbir şey paylaşmamak
   c) Daha pahalı telefon
   d) Kaynağı sorgulamak ve doğrulamak

4. AB YZ Yasası kullanımları neye göre ayırır?
   a) Şirket büyüklüğüne
   b) Risk düzeyine
   c) Renk koduna
   d) Programlama diline

5. Hizalama (alignment) sorunu nedir?
   a) Ekranın küçük olması
   b) Belirtilen hedef ile gerçek niyetin ayrışması
   c) Modelin yavaş olması
   d) Verinin az olması

6. Yüksek riskli bir YZ kullanımına örnek?
   a) Hava durumu widget’ı
   b) Oyun rakibi YZ
   c) İşe alımda aday eleme
   d) E-posta spam filtresi

### Bu bölümden kalanlar

- Yapay zekâ tarafsız değildir; kendisini eğiten verinin ve kuran insanların değerlerini taşır.
- Aynı nitelikteki iki gruba farklı karar veren modelde ayrımcılık veriden miras kalır; niyet aramak gerekmez.
- İşaretli katkılar bir kararın gerekçesini görünür kılar; böylece karar denetlenebilir ve itiraz edilebilir olur.
- Tek bir görüntü ya da ses artık kanıt değildir; kaynağı, bağlamı ve tutarlılığı sorgulamak alışkanlık olmalıdır.
- Düzenleme riske göre kademelidir: yasak, yüksek, sınırlı, minimal; risk arttıkça kural sıkılaşır.
- Makine verdiğin hedefi harfiyen yapar, niyetini değil; hizalama bu boşluğu kapatma sorunudur.

<!-- SOURCE-CHANGES
Yapay zekâ artık bir laboratuvar oyuncağı değil; kredi başvurularını, iş ilanlarını, haber akışını, hatta sağlık kararlarını etkiliyor. Bu güç, beraberinde sorumluluğu da getiriyor. Sıra artık teknolojinin kendisinde değil; onun insana dokunduğu yeri konuşmakta. ||| Yapay zekâ artık bir laboratuvar oyuncağı değil; kredi başvurularını, iş ilanlarını, haber akışını, hatta sağlık kararlarını etkiliyor. Etkisi büyüdükçe sorumluluk da büyüyor. Artık sıra teknolojinin insana dokunduğu yerde.
Beş büyük başlığımız var. Makineler verideki önyargıları nasıl miras alıyor? Kararları neden çoğu zaman bir “kara kutu”? Deepfake ve dezenformasyon gerçeklik algımızı nasıl zorluyor? Devletler bunu nasıl düzenlemeye çalışıyor (AB AI Act, KVKK)? Ve makineler amaçlarımızı gerçekten anlıyor mu (hizalama)? İşin değişen doğası ve “filtre balonu” gibi sessiz etkileri de göz ardı etmeyeceğiz. ||| Beş başlık var: makinelerin veriden miras aldığı önyargı, kara kutu kararlar, deepfake ve dezenformasyon, düzenleme (AB AI Act, KVKK) ve hizalama: makine amacımızı gerçekten anlıyor mu? İşin değişen doğası ve filtre balonu gibi sessiz etkiler de arada.
Ele alınan eksenler: veri kaynaklı yanlılık ve adalet (fairness), açıklanabilirlik/yorumlanabilirlik (XAI), sentetik medya ve dezenformasyon, düzenleyici çerçeveler (AB AI Act’in risk temelli yaklaşımı, KVKK/GDPR’ın kişisel veri ilkeleri) ve hizalama/güvenlik. Bütün bunlar, teknik yetkinliği toplumsal sorumlulukla birleştiren bir bakış kazandırmak için. ||| Ele alınan eksenler: veri kaynaklı yanlılık ve adalet (fairness), açıklanabilirlik/yorumlanabilirlik (XAI), sentetik medya ve dezenformasyon, düzenleyici çerçeveler (AB AI Act’in risk temelli yaklaşımı, KVKK/GDPR’ın kişisel veri ilkeleri) ve hizalama/güvenlik. Amaç, teknik bilgiyi toplumsal sorumlulukla birlikte okumak.
İki grup birebir aynı nitelikte; değiştirdiğimiz tek şey eğitim verisindeki önyargı. Model geçmişteki çarpık örüntüyü “doğru” sanıp tekrarlıyor ve aynı nitelikteki insanlara bile farklı kararlar veriyor. Yani ayrımcılık kötü niyetten değil, çarpık veriden doğuyor. ||| İki grup birebir aynı nitelikte; değiştirdiğimiz tek şey eğitim verisindeki önyargı. Model geçmişteki çarpık örüntüyü “doğru” sanıp tekrarlıyor ve aynı nitelikteki insanlara bile farklı kararlar veriyor.
Nitelikler sabit; tek değişen eğitim verisindeki yanlılık. Model dağılımdaki tarihsel örüntüyü öğrenip pekiştirir; karar farkı (demografik parite ihlali) buradan doğar; kötü niyetten değil, çarpık veriden. ||| Nitelikler sabit; tek değişen eğitim verisindeki yanlılık. Karar farkı (demografik parite ihlali) buradan doğar.
Önce bir kredi kararına bak; sonra Şekil 7.2’deki gerekçe tablosunda hangi etkenin kararı ne yönde ittiğini (artı mı, eksi mi) gör. Kara kutuyu beyaz kutuya çeviren şey işte budur. ||| Önce bir kredi kararına bak; sonra Şekil 7.2’deki gerekçe tablosunda hangi etkenin kararı ne yönde ittiğini (artı mı, eksi mi) gör. Kara kutu böyle beyaz kutuya döner.
İşaretli özellik katkıları (SHAP benzeri) hangi girdinin kararı ne kadar/ne yönde etkilediğini gösterir: turuncu onaya, gri redde. Toplam sonucu belirler. Bu, modeli denetlenebilir ve itiraz edilebilir kılar; “kara kutu”yu “beyaz kutu”ya çevirir. ||| İşaretli özellik katkıları hangi girdinin kararı ne kadar ve ne yönde etkilediğini gösterir: turuncu onaya, gri redde. Toplam sonucu belirler; model böylece denetlenebilir ve itiraz edilebilir olur.
“Gözümle gördüm, kulağımla duydum” demek eskiden yeterdi. Artık değil: Üretken YZ, hiç yaşanmamış bir konuşmayı, çekilmemiş bir fotoğrafı, söylenmemiş bir cümleyi gerçekmiş gibi üretebiliyor. Eğlencesi de var elbette; ama sahte kanıt, taklit dolandırıcılığı ve toplu yanıltma da aynı kapıdan giriyor. ||| “Gözümle gördüm, kulağımla duydum” demek eskiden yeterdi. Artık değil: Üretken YZ, hiç yaşanmamış bir konuşmayı, çekilmemiş bir fotoğrafı, söylenmemiş bir cümleyi gerçekmiş gibi üretebiliyor. Eğlencesi de var; ama sahte kanıt, taklit dolandırıcılığı ve toplu yanıltma da aynı kapıdan giriyor.
Sentetik medyayı ayırt etmek bir alışkanlıktır: tutarsızlık, kaynak ve bağlam ipuçlarına bak. Tespit, üretim geliştikçe zorlaşan bir silahlanma yarışıdır; en sağlam savunma kaynak doğrulama ve şüpheciliktir. ||| Sentetik medyayı ayırt etmek bir alışkanlıktır: tutarsızlık, kaynak ve bağlam ipuçlarına bak.
AB AI Act kademe mantığı: yasak (temel haklara aykırı, ör. sosyal puanlama) → yüksek (kredi, işe alım: sıkı uyum + insan gözetimi) → sınırlı (sohbet botu: şeffaflık) → minimal. Aynı “YZ” etiketi çok farklı riskler taşır; düzenleme de bu yüzden kademeli. KVKK/GDPR ayrıca kişisel veri işlemeyi düzenler. ||| Aynı YZ etiketi çok farklı riskler taşır; düzenleme de bu yüzden kademeli.
Makineye bir hedef verirsin, o da hedefi harfi harfine yapar ama asıl niyetini kaçırabilir: “odada çöp görünmesin” dersen çöpü halının altına süpürebilir. Yani verdiğin ölçütü en üst düzeye çıkarır, amacını değil. İnsan geri bildirimi (RLHF) bunu azaltır ama tümüyle çözmez; üstelik “kimin değerleri?” sorusu da işin içindedir. ||| Makineye bir hedef verirsin, o da hedefi harfi harfine yapar ama asıl niyetini kaçırabilir: “odada çöp görünmesin” dersen çöpü halının altına süpürebilir. Verdiğin ölçütü en üst düzeye çıkarır, amacını değil. İnsan geri bildirimi (RLHF) bunu azaltır ama tümüyle çözmez; üstelik “kimin değerleri?” sorusu da işin içindedir.
Belirtim/ödül oyunlama: vekil hedef (proxy) ile gerçek hedef ayrıştığında model metriği maksimize eder, amacı değil. RLHF bunu azaltır ama tümüyle çözmez; hizalama hem teknik hem normatif (kimin değerleri?) bir sorudur. ||| Belirtim/ödül oyunlama, üç örneğin ortak teknik adı: vekil hedef gerçek hedeften ayrıştığında model metriği maksimize eder, amacı değil.
-->

<!-- REDAKSİYON NOTLARI
- 7.2 basit: "İki grubu (A ve B) tıpatıp aynı nitelikte tut ve yalnızca eğitim verisindeki önyargıyı artırıp azalt." → "İki grup (A ve B) tıpatıp aynı nitelikte; Şekil 7.1’de yalnızca eğitim verisindeki önyargı artıp azalıyor." (kaydıraç cümlesi)
- 7.2 teknik: "Aşağıdaki demo, aynı niteliklere rağmen..." → "Şekil 7.1, aynı niteliklere rağmen..." (teknik blok artık şeklin altında)
- 7.3 basit: "sonra “Açıkla”yı aç ve hangi etkenin..." → "sonra Şekil 7.2’deki gerekçe tablosunda hangi etkenin..." (ekran düğmesi)
- 7.3 teknik: "Aşağıdaki demo, katkıların işaretli..." → "Şekil 7.2, katkıların işaretli..."
- 7.3 Şekil 7.2 Kurulum: demoda "Açıkla" sonrası panel ayrı bir bölge; kâğıtta üst/alt yarı olarak tarif edildi, figür üreticisi buna göre çizilmeli.
- 7.4 basit: "sonra ipucunu görüp sahteyi yakalamanın yollarını öğren" korundu; ipuçları cevaplar/M07.md'de.
- 7.6 Şekil 7.5 tablosu: demodaki "süpürür (uzun tire) “görünürde” kalmadı" ifadesindeki uzun tire noktalı virgüle çevrildi (kılavuz §1).
- 7.6 basit ve kenar notu: "Bir hedef seç; ... gör" korundu; Şekil 7.5 tablosu üç hedefi birden veriyor.
- 7.3 kenar notu "kritik kararlarda" → "yüksek etkili kararlarda" (2026-09-30); 7.5 "kritik altyapı" AB YZ Yasası'nın kendi terimi, kaldı.
- Bias demosunda A üst sınırı 95, B alt sınırı 5 koda yazılı ama e=100'de bile 90/10'da kalıyor; sınırlara asla ulaşılmıyor (Kendin dene 3. soru buna dayanıyor).
- Şekil 7.3 ve 7.4 "Kendini sına" tipi: Adım adım yerine soru listesi; cevaplar, ipuçları ve gerekçeler cevaplar/M07.md'de.
- Yazar kararı (2026-09-10): kaynak metin dahil tüm "demo" sözcükleri "gösterim" ya da "Şekil N.j" yapıldı; "Aşağıdaki demo" → şekil öncesinde "Aşağıda yer alan gösterim (Şekil N.j)", sonrasında "Şekil N.j'teki gösterim".
- Yazar kararı (2026-09-10, figürler): ekran renkleri (yeşil/kırmızı/mavi/mor) duotone baskıya göre 'koyu/gri' ve 'turuncu' yapıldı; figür düzeni tarifleri ('kendi rengi', 'yanında rolü', 'ok çekmen') figürlerle eşleştirildi.
- 2026-09-30 insanlaştırma geçişi: humanize-tr-report.md bulguları uygulandı (Peki/Cevap köprüleri, "tam da/işte budur", altyazı alıntıları, ekran/kâğıt sızıntıları, "yani/elbette", "kötü niyetten değil çarpık veriden" tekrarı 5→2, punchline'lar); "Cevaplar kitabın sonunda." yalnız Kendini sına şekillerinde; teknik "Ne oluyor" paragraflarında ilk teknik paragrafı tekrar eden cümleler kırpıldı (7.2, 7.3, 7.4, 7.5, 7.6). Kaynak paragraf değişiklikleri SOURCE-CHANGES bloğunda; dijital sürüme taşınacak.
- 7.2 teknik: "Gösterimdeki karar kuralı … gösterim bu sayıları verili kabul eder" → "Şekil 7.2’deki karar kuralı … şekil bu sayıları verili kabul eder" (2026-09-30; yalnız basılı; dijitalde "Gösterimdeki/gösterim" kalır).
-->
