# "Herkes İçin Yapay Zekâ" · YZ-tiki tarama raporu (TR)

Taranan: `print/src/tr/M01…M08`, `cevaplar/M01…M08`, `on/00-03`, `arka/sozluk.md`. Kılavuz (`print/YAZIM-KILAVUZU.md`) ölçütleri: "sen", ≤30 kelime, uzun tire yok, yasak kalıplar.

## 1. Ölçüm (bölüm başına, M01–M08, Σ / diğer)

| Tik | Σ | Not |
|---|---|---|
| İki nokta (düzyazı+tablo) | 833 | düzyazıda iki noktadan sonra 116 büyük / 475 küçük harf: tutarsız |
| Noktalı virgül | 693 | |
| Tırnaklı vurgu (“…” ≤15 karakter) | 427 | M05 120 (token adları haklı), M08 66 (kavram tırnakları fazla) |
| "X değil, Y" karşıtlık kalıbı | 61 / 11 | M08 15, M06 11, M07 10 |
| "gösterim" (demo yerine) | 43 / 9 | |
| "yani" | 37 / 14 | |
| "Bu yüzden" | 31 / 3 | M06 6, M07 5 |
| "Şimdi …" cümle açılışı | 27 | |
| "Peki …?" köprü sorusu | 22 | |
| "tam olarak / tam bu / tam da bu / tam burada" | 21 / 2 | |
| "İşte … / işte bu / İşte hata" | 18 | |
| "şu: / şudur: / şurada: / şöyle:" açıklama kapısı | 18 / 1 | |
| "Bir de… / Şunu da fark et / Bir şeye daha bak / İki gözlem daha" | 17 | |
| Paragraf sonu punchline ("… budur." / "… işte bu." / "… bu cümlede.") | 16 / 4 | |
| "Ekranda … -yordu; kâğıtta …" üretim-sızıntısı | 21 / 8 | M01 11, M02 6 |
| "kenar notundaki/notunun …" iç gönderme | 11 / 2 | |
| "Gösterimin altyazısı şöyle: “…”" (ekran altyazısı alıntısı) | 6 | |
| "Bu bir gösterimdir / gösterim amaçlıdır / niteliksel" uyarısı | 9 / 1 | |
| "hem … hem" | 12 | |
| "aslında" | 10 | |
| "ibaret" | 6 | |
| "Kısaca / Kısaca:" | 3 | |
| "dürüst / dürüstçe" | 12 / 3 | |
| Coşku sözcükleri (büyü, sihir, devrim, harika, şaşılacak, yolculuk) | 13 / 1 | |
| "gibi" benzetmesi | 68 / 18 | M01 16, M05 12 |

## 2. Bulgular (dosya sırasıyla) — format: `dosya:satır` · alıntı · tik · öneri

### on/*
- `on/01-tesekkur.md:5` · "nerede takıldıklarını dürüstçe söyleyenler" · dürüst · "nerede takıldıklarını açıkça söyleyenler"
- `on/02-onsoz.md:5` · "Soru yeni değil. Bilgisayarlardan çok önce, dört yüz yıl önce filozofları meşgul ediyordu." · "önce … önce" · "Soru yeni değil; dört yüz yıldır filozofları meşgul ediyor."
- `on/02-onsoz.md:7` · "Her biri bir öncekinin duvara tosladığı yerde doğdu. Bu yüzden … yeni fikri sahneye çağırıyor." · duvara tosla ×3 + sahne + Bu yüzden · "Her fikir bir öncekinin yetmediği yerde doğdu; bölümler de bu sırayla ilerliyor."
- `on/02-onsoz.md:9` · "Kâğıtta bunu yapamayız. Onun yerine her deneyi sana kâğıt üstünde yürüttüm" · kâğıt ×2, üretim sızıntısı · "Basılı kitapta bu yok; onun yerine her deneyi senin için sayılarla ve çizimlerle adım adım yürüttüm."
- `on/03-nasil-okumali.md:5` · "Kapaktaki kadranın kâğıt hâli budur: aynı fikir, iki derinlik." · punchline · "Kapaktaki kadran bunu anlatır: aynı fikir, iki derinlik."

### M01
- `M01:19` [kaynak] · "Böylece sonraki bölümlerde gelecek … kavramları için sağlam bir zemin kurulmuş olur." · ders planı meta · "Sonraki bölümlerin öğrenme ve sinir ağı kavramları bu zemine oturur."
- `M01:21` · "Makineye vermek istediğimiz o “zekâ” tam olarak ne?" · tam olarak + tırnak · "İlk sorudan başlayalım: makineye vermek istediğimiz zekâ ne?"
- `M01:27` [kaynak] · "Howard Gardner da tam bunu söylemiş … ilginç olanı da fark et" · "tam bunu", "fark et" · "Howard Gardner da böyle düşünmüş … Aşağıda türlere bak; bugünkü YZ kimisinde usta, kimisinde emekleme çağında."
- `M01:34` · "Ekranda kartlar tek tek açılıyordu; kâğıtta sekizini yan yana görüyorsun." · ekran/kâğıt şablonu (M01 34, 180, 226, 265; M02 184, 243) · Cümleyi sil; Kurulum yalnız şekli anlatsın.
- `M01:49` · "Bilgisayar tam olarak bu tür malzemeyle çalışır; bir sonraki bölümdeki ikili kod da bir sembol dizisidir." · tam olarak · "Bilgisayar da bu malzemeyle çalışır; sıradaki bölümdeki ikili kod bir sembol dizisi."
- `M01:53` · "Bir de sıraya bak: Gardner’ın listesi bir başarı sıralaması değil." · "Bir de … bak" · "Listenin sırası bir başarı sıralaması değil."
- `M01:55` [kaynak] · "Şunu da fark et: Bugünkü yapay zekâ dilde ve mantıkta çok iyi ama…" · Şunu da fark et · "Bugünkü yapay zekâ dilde ve mantıkta çok iyi; beden ve duygu işlerinde küçük bir çocuğun bile gerisinde."
- `M01:63-65` [kaynak] · 63 ile 65 aynı içeriği iki kez söylüyor · teknik "Ne oluyor" tekrarı · 65'i sil ya da yalnız "Asıl ders" cümlesini bırak.
- `M01:65` [kaynak] · "Asıl ders şu: zekâ tek boyutlu değildir" · "şu:" · "Asıl ders, zekânın tek boyutlu olmaması: YZ dilde güçlü, bedende zayıf."
- `M01:71` [kaynak] · "Yapay zekânın temelindeki fikir tam bu: Belki “düşünmek” de…" · tam bu · "Yapay zekânın temelindeki fikir de bu: belki düşünmek, küçük mekanik adımları sırayla uygulamaktır."
- `M01:100` · "Kuralı fark ettin mi? Soldan sağa gidip “sığıyorsa yak, kalanla devam et” demek yetiyor." · retorik soru + tırnak · "Kural tek: soldan sağa git, sığıyorsa yak, kalanla devam et."
- `M01:102` [kaynak] · "Peki bu değerleri kutulara kim dağıttı? Şöyle düşün: … Neden hep iki katı? Çünkü … İşte sayın. … bu aç-kapa oyunundan ibaret." · 2 retorik soru + Şöyle düşün + İşte + ibaret · "Değerler neden böyle? En sağdaki kutu 1'i tutar; sola doğru her kutu sağındakinin iki katı. Her yeni kutu sağındakilerin toplamından bir fazlasını söyleyebilmeli; yoksa arada söylenemeyen sayılar kalırdı. Yanık kutuları topla, sayın çıkar. Bilgisayarın bütün dünyası bu aç-kapa oyunu."
- `M01:116` · "Peki bu tarifi kim, hangi makinede yürütecek? Cevap 1800’lerde bir dişli çark hayaliyle başlıyor." · Peki + Cevap … şablonu (116, 191, 211, M08:156) · "Alfabe ve tarif hazır; tarifi yürütecek makine 1800'lerde bir dişli çark hayaliyle başlıyor."
- `M01:141` · "Bir Turing makinesinin “düşünmesi” işte tam olarak budur: …" · işte + tam olarak + budur; madde 60+ kelime · "Turing makinesinin düşünmesi bu: anlamı olmayan küçük mekanik adımlar, art arda." Maddeyi ikiye böl.
- `M01:145` [kaynak] · "Bu minicik hamlelerle her hesap yapılabiliyor. Bütün büyü işte bu." · büyü + punchline · "Her hesap bu minicik hamlelerle yapılıyor; başka bir şey yok."
- `M01:175` [kaynak] · "“Programı belleğe koyma” fikri bu yüzden bir devrimdi." · devrim (186'da "Asıl devrim buradadır" demo kartı) · "bu yüzden büyük bir adımdı" / "Asıl yenilik burada".
- `M01:199` · "Depolanmış programın bütün gücü bu cümlede." · punchline · "Depolanmış programın faydası bu: kablo değil, bellekteki satır değişir."
- `M01:213` · "Peki bugün ona “yapay zekâ” dediğimizde tam olarak ne kadarını kastediyoruz?" · Peki + tam olarak + tırnak · "Bugün ona yapay zekâ derken ne kadarını kastediyoruz?"
- `M01:226` · "Ekranda her kart bir sütuna yerleştiriliyor, doğru seçim yeşil, yanlış seçim kırmızı yanıyordu." · ekran sızıntısı · Sil; "Kartların yanındaki kutuları kalemle sen dolduracaksın." kalsın.
- `M01:238` · "Bunu bir cümleyle yazabiliyorsan bölümün ana fikrini yakaladın demektir." · ödül tonu · "Bunu bir cümleyle yazabiliyorsan bölümün ana fikri sende."
- `M01:240` [kaynak] · "Püf noktası şu: tek işte usta olan her sistem “dar” sınıfına girer" · "şu:" · "Tek işte usta olan her sistem dar sınıfına girer; sohbet botları bile."
- `M01:248-250` [kaynak] · "Önemli ayrım: …" ve "Dikkat: “genel” … ile “güçlü YZ” … farklı sorulardır." · aynı ayrım 3× · 250'yi sil; 248'de "Önemli ayrım:" yerine düz cümle.
- `M01:258` [kaynak] · "Modern YZ’yi taşıyan güç, işte bu katlana katlana biriken işlem gücü." · işte + güç ×2 · "Modern YZ'yi taşıyan da bu katlana katlana biriken işlem gücü."
- `M01:304` · "Bölümün taşları yerinde: … Aşağıdaki sorularla ne kadarının aklında kaldığına bak." · sınav-öncesi şablon (M05:351, M06:285, M07:238) · Her bölümde farklı, kısa bir cümle.
- `cevaplar/M01.md:18` · "En sık yanılınan kart budur. … Ama dikkat: bilinç “genel” değil “güçlü YZ” sorusudur" · punchline + Ama dikkat · "Kartların en yanıltıcısı bu. … Bilinç ise genel değil güçlü YZ sorusudur"

### M02
- `M02:11` [kaynak] · "Bu fikirler nasıl çalışıyordu, neleri başardı, neden bir gün duvara tosladı? Hepsini kendi elinle deneyeceksin." · üçlü soru + "Hepsini … -eceksin" (M03:11 aynı) · "Nasıl çalışıyordu, neleri başardı, neden tosladı? Hepsini kendin deneyeceksin."
- `M02:13` [kaynak] · "Bu fikir bazı işlerde harika çalıştı, bazılarında ise hiç." · harika · "Bu fikir bazı işlerde çok iyi çalıştı, bazılarında hiç."
- `M02:21` · "Yolculuk en temel sorudan başlıyor: … Sıradaki bölüm bilgiyi sembollere döküyor." · yolculuk; "Sıradaki bölüm … -yor" şablonu (12 köprüde) · "İlk soru en temeli: bir makine Tekir'in kedi olduğunu nereden bilir?"
- `M02:27` [kaynak] · "İşin güzel yanı şu: Makine bu bağları izleyip…" · "şu:" · "İşin güzel yanı, makinenin bu bağları izleyip kimsenin söylemediği bilgiye kendisinin ulaşması."
- `M02:61` · "Bilmediği şey hakkında sessiz kalmak, sembolik sistemlerin dürüst tarafıdır." · dürüst kişileştirme (63'te "dürüstçe") · "Bilmediği konuda susmak sembolik sistemlerin iyi huyudur."
- `M02:77` · "Peki makine bildiğinden eyleme nasıl geçer: yağmur yağıyorsa ne yapmalı? Sıradaki bölüm “eğer … ise” kurallarını kuruyor." · Peki + şablon · "Makine bildiğinden eyleme nasıl geçer, yağmur yağıyorsa ne yapmalı? Sıradaki bölümün konusu bu."
- `M02:83` · "Koşulları kâğıtta aç kapa" · anlamsız uyarlama · "Koşulları sen aç kapa; hangi kuralın ateşlendiğini Şekil 2.2'de gör."
- `M02:102` · "İki olgudan iki öneri çıktı; ikincisi ilkinin üstüne kurulu. Zincirleme budur." · punchline · "İkincisi ilkinin üstüne kurulu; zincirleme dedikleri bu."
- `M02:120` · "Bu soru klasik YZ’nin ikinci büyük aracını gerektiriyor: arama." · çeviri kokusu · "Klasik YZ'nin ikinci aracı bunun için var: arama."
- `M02:157` [kaynak] · "Hız ile garanti arasındaki takas işte bu." · işte bu · "Hız ile garanti arasındaki takas bu."
- `M02:171` · "Peki yarın yağmur yağacak mı? Sıradaki bölüm kesin olmayan bilgiyle ne yapılacağını anlatıyor." · Peki + şablon · "Yarın yağmur yağacak mı sorusu ise kesin cevap tanımaz."
- `M02:184` · "Ekranda matrisin altında gün sayacı … vardı; kâğıtta onların yerini … tablo alıyor." · ekran/kâğıt · "Gün gün ne olduğu aşağıdaki tabloda."
- `M02:238` [kaynak] · "Çözüm? … Sıradaki bölümün konusu tam olarak bu." · tek kelimelik soru + tam olarak · "Çözüm, kuralları veriden öğretmek. Sıradaki bölümün konusu bu."
- `M02:243` · "Ekranda seçim doğruysa yeşil, yanlışsa kırmızı yanıyordu. Kâğıtta işaretini kartın yanına koy" · ekran/kâğıt · "İşaretini kartın yanına koy; sonra kitabın sonundaki cevaplarla karşılaştır."
- `M02:252` · "Bir uyarı: kelimeler yanıltabilir. … Listede olmayan iki örnekle ısın. … Dört ifadenin ikisi bir kampa, ikisi öbürüne ait" · 150 kelimelik ipucu şişirmesi, cevap dağılımını ele verme · "Kelimeye değil tutuma bak: konuşan önce doğruluğu mu göstermek istiyor, önce işe yaramasını mı? İlki Düzenli, ikincisi Dağınık."
- `M02:254` [kaynak] · "bugünün yapay zekâsı aslında ikisinin karışımı." · aslında · "bugünün yapay zekâsı ikisinin karışımı."
- `cevaplar/M02.md:4` · "Tekir’e ulaşılmaz; Tekir’e ulaşılmaz." · çift cümle · Birini sil.
- `cevaplar/M02.md:7` · "Kuralların kör noktası budur: yazılmayan koşul yok sayılır." · punchline · "Yazılmayan koşul yok sayılır; kuralların kör noktası bu."
- `cevaplar/M02.md:17` · "İki kampın el sıkıştığı yer budur." · punchline · "İki kamp burada el sıkışır."

### M03
- `M03:11` [kaynak] · "Şimdi bu öğrenmenin perde arkasına giriyoruz … Hepsini sahnede, adım adım göreceksin." · tiyatro metaforu + göreceksin · "Veri nasıl hazırlanır, model her denemede nasıl biraz daha ustalaşır? Hepsini adım adım göreceksin."
- `M03:21` · "Bir makineye “örnek” derken ona tam olarak ne veriyoruz?" · tam olarak · "Bir makineye örnek derken ona ne veriyoruz?"
- `M03:45` · "Model tam olarak bu ikiliyi görür; e-postanın kendisini değil." · tam olarak · "Model yalnız bu ikiliyi görür, e-postanın kendisini değil."
- `M03:63` · "Peki cevap anahtarı olmadan, hatta hiç öğretmen olmadan da öğrenilir mi?" · Peki · "Cevap anahtarı olmadan, hatta öğretmen olmadan da öğrenilir mi?"
- `M03:76` · "Bu şekil bir sınamadır: adım adım çözüm yerine altı soru var … İşaretini kurşun kalemle koy; …" · meta + ders tonu · "Altı görev, üç sütun; doğru kutuyu sen işaretle. Cevaplar ve gerekçeler kitabın sonunda."
- `M03:87` · "Her sütuna iki görev düşmesi tesadüf değil; altı görev üç türü ikişer örnekle tanıtmak için seçildi." · cevap dağılımını ele verme · Cümleyi sil.
- `M03:89` [kaynak] · "Her görevi doğru türe ayır; unutma, aradaki sınırlar her zaman keskin değildir." · yasak "unutma" · "Her görevi doğru türe ayır; sınırlar her zaman keskin değildir."
- `M03:105/109/126/321` · "“ne kadar?” sorusu regresyon, “hangisi?” sorusu sınıflandırma" · aynı formül 4× · 126'daki "Kısaca:" cümlesini sil; kalanlarda tırnakları kaldır.
- `M03:144` [kaynak] · "Kümeleme tam budur: … Bankaların şüpheli işlemi yakalayışı gibi." · tam budur; banka 3× · "Kümeleme de bu: makine etiketsiz veriyi benzerliğe göre kendisi gruplar." Banka örneğini tek yerde bırak.
- `M03:191` · "Peki milyonlarca parametresi olan bir model “biraz düzelt” adımını nasıl atar? Cevap bir vadide saklı." · Peki + Cevap … saklı · "…nasıl atar? Sıradaki bölüm sisli bir vadide geçiyor."
- `M03:197` [kaynak] · "Gradyan inişi tam bu yürüyüştür" · tam bu · "Gradyan inişi bu yürüyüştür"
- `M03:199` [kaynak] · "Öğrenme aslında bundan ibaret:" · aslında + ibaret · "Öğrenmenin özü bu:"
- `M03:224` [kaynak] · "işte bu yüzden adımın boyu önemlidir." · işte bu yüzden · "adımın boyu bu yüzden önemlidir."
- `M03:242/246/261/275/324` · "ezberlemez, kavrar" / "ezberlemek öğrenmek değildir" · aynı aforizma 5× · Kenar notunda bırak; 261'deki "Kısaca, …" ve 275'teki kelime oyununu sil.
- `M03:259` · "“doğrulama” denen şey tam olarak budur." · tam olarak budur · "buna doğrulama denir."
- `M03:275` · "Ezberlemeyen, kavrayan model: bu bölüm bu fikrin etrafında döndü. Şimdi sen ne kadarını kavradığını sına." · kelime oyunu · "Bölüm bu fikrin etrafında döndü. Ne kadarı aklında kaldı, bak."
- `cevaplar/M03.md:12` · "Bu bir sorundur: önce (9, 9)’un ölçüm hatası mı…" · "Bu bir X'tir" · "Sorun da bu: önce (9, 9) ölçüm hatası mı, gerçek mi, bakmak gerekir."
- `cevaplar/M03.md:18` · "tek adımlık sihirli bir oran yoktur." · sihirli · "tek adımda dibe indiren bir oran yoktur."

### M04
- `M04:11` [kaynak] · "Yapay sinir ağları işte bu sorudan doğdu. … ortaya şaşılacak kadar güçlü bir öğrenme makinesi çıkıyor." · işte + şaşılacak · "Yapay sinir ağları bu sorudan doğdu. … beklenmedik ölçüde güçlü bir öğrenme makinesi çıkıyor."
- `M04:19` [kaynak] · "Şunu da bilmek gerekir: aktivasyon fonksiyonları olmadan…" · Şunu da · "Aktivasyon fonksiyonları olmadan üst üste konan doğrusal katmanlar tek bir doğrusal işleve çöker."
- `M04:21` · "Peki o tek başına ne hesaplar; üç sayıdan nasıl bir karar çıkarır?" · Peki · "Tek başına ne hesaplar, üç sayıdan nasıl karar çıkarır?"
- `M04:25` [kaynak] · "işte “aktivasyon” denen şey bu karardır." · işte + tırnak · "aktivasyon denen şey bu karardır."
- `M04:68` · "Peki onlarcasını katmanlar hâlinde dizersen sinyal içeriden nasıl geçer?" · Peki · "Onlarcasını katman katman dizersen sinyal içeriden nasıl geçer?"
- `M04:120` [kaynak] · "ilk günkü acemiliğine şaşmamalı. Peki nasıl ustalaşır? … ne kadar yanıldığını ölçer: İşte hata." · Peki + İşte hata · "…ne kadar yanıldığını ölçer; buna hata denir."
- `M04:124` [kaynak] · "derin öğrenmenin bütün büyüsü aslında bundan ibaret." · büyü + aslında + ibaret · "derin öğrenmenin özü bu."
- `M04:154` · "Bu bir gösterimdir; gerçek eğitimde eğri bu kadar pürüzsüz inmez" · gösterim uyarısı M04'te 4× (154, 257, 309, 271), kitapta 10× · Her şekilde bir kez, tek cümle: "Gerçek eğitimde eğri bu kadar düz inmez."
- `M04:228` · "Peki komşuluk zaman içindeyse: bir cümlede kelimelerin sırasını ağ nasıl taşır?" · Peki · "Komşuluk zaman içindeyse, kelimelerin sırasını ağ nasıl taşır?"
- `M04:232` [kaynak] · "İşte bu yüzden özyinelemeli ağlar (RNN) yanlarında bir “hafıza” taşır." · İşte bu yüzden · "Özyinelemeli ağlar (RNN) bu yüzden yanlarında bir hafıza taşır."
- `M04:273` · "Peki bir ağ hiç görmediği bir yüzü sıfırdan üretebilir mi?" · Peki · "Bir ağ hiç görmediği bir yüzü sıfırdan üretebilir mi?"
- `M04:281` [kaynak] · "GAN’ın güzelliği şurada: … sonuç şaşılacak kadar gerçekçi olur." · şurada: + şaşılacak · "GAN'da iyi sahte üretmek ile sahteyi yakalamak birbirini sürekli iter; sonuç giderek gerçeğe yaklaşır."
- `M04:309` · "Ama hükmün bir noktada devrilmesi, tam da GAN’ın aradığı andır." · tam da · "Hükmün bir noktada devrilmesi, GAN'ın aradığı an."
- `M04:56,104,158,216,261,313` · "Cevaplar kitabın sonunda. Canlı demo: [QR …]" · yalnız M04 ve M07-08'de var · Kitap genelinde tek karar (kılavuz: yalnız sınama şekillerinde).

### M05
- `M05:11` [kaynak] · "Oradan … geçeceğiz. Modelin nasıl eğitildiğini görecek, … uğrayacağız. Sonunda … konuşacağız." · bölüm planı · "Önce token, sonra gömü, dikkat ve kelime kelime üretim; ardından eğitim, difüzyon ve sınırlar."
- `M05:19` [kaynak] · "“neden ve nasıl” çalıştığı, sezgisel ama doğru bir çerçevede kurulmuş olur." · kurumsal ton · "Böylece bugünün üretken modellerinin neden ve nasıl çalıştığı yerine oturur."
- `M05:27` [kaynak] · "Peki neden parçalıyor? Lego kutusunu düşün:" · Peki · "Neden parçalıyor? Lego kutusunu düşün:"
- `M05:46` · "Kenar notundaki “pahalı” uyarısının sebebi bu." · kenar notu göndermesi + punchline · "Türkçe sormanın bazen daha pahalı olması bu yüzden."
- `M05:68` [kaynak] · "Bu şehrin güzelliği şurada: Anlamca benzeşen kelimeler aynı mahalleye taşınır." · şurada: · "Bu şehirde anlamca benzeşen kelimeler aynı mahalleye taşınır."
- `M05:91` · "Gösterim bunu bir cümleyle özetliyor: “kedi” seçildiğinde “En yakın 2 komşu: …”" · altyazı alıntısı · Alıntıyı sil; bilgi tabloda.
- `M05:93` · "Bir de sınır bölgesi var … Makinenin “anlam” dediği şey bu geometriden ibaret: Anlam, adresler arasındaki mesafede saklı." · Bir de, ibaret, punchline · "Sınır bölgesi de var: … Makinenin anlam dediği şey bu geometri: adresler arasındaki mesafe."
- `M05:113` [kaynak] · "makineye işte bu dönüp bakmayı öğretir" · işte · "makineye bu dönüp bakmayı öğretir"
- `M05:139` · "Gösterimin cümlesiyle: “o” kelimesini seçtin (sorgu); en çok “Kedi” kelimesine bakıyor (en koyu)." · altyazı alıntısı; "seçtin" · Sil.
- `M05:142` · "İki gözlem daha. … Bakmak karşılıklı değil, yönlü. … zorlandığı yer tam burasıydı." · numaralı gözlem + tam burası · "Tablo simetrik değil: … Bakış yönlü. Uzaklık da önemsiz: … Sırayla işleyen eski modeller burada zorlanıyordu."
- `M05:164` [kaynak] · "Şekil 5.4’ün adımlarını izle; … nasıl kurduğunu izle." · izle ×2 · "Şekil 5.4'te modelin her adımda hangi kelimeleri hangi olasılıkla düşündüğüne ve cümleyi nasıl kurduğuna bak."
- `M05:195` · "Bir şeye daha bak: Her adımın olasılıkları dört adaya dağılmış" · ek-gözlem · "Her adımın olasılıkları dört adaya dağılmış ve toplamı yüzde yüz."
- `M05:211` · "Peki bu olasılıkları nereden öğrendi? Cevap üç aşamalı bir eğitim hattında." · Peki + Cevap · "Bu olasılıkları nereden öğrendi? Üç aşamalı bir eğitimden."
- `M05:239` · "Kenar notu bunu tek cümlede söylüyor: …" · kenar notu alıntısı · Cümleyi sil.
- `M05:255/259` · köprü "bambaşka bir noktadan işe başlar" + [kaynak] "bambaşka bir fikre dayanır" · "bambaşka" ×2 · Köprüyü "Görsel üreten modeller ise saf gürültüden yola çıkar." yap.
- `M05:284` · "Sıfırıncı karede gösterim şöyle diyor: … Difüzyon tam olarak böyle çalışır: gürültüden şekle." · üç altyazı alıntısı + tam olarak · "Karelerin altyazıları aynı şeyi söyler: gürültüyle başla, her adımda biraz temizle, şekil çıksın."
- `M05:286` · "Şeritte dikkat çeken iki şey var. Birincisi, … İkincisi, …" · numaralı gözlem şablonu (142, 286; M08:43, 138, 224) · "Çözülen piksel sayısı her adımda eşit artmıyor: … Şekil de yarı yolda tanınıyor: …"
- `M05:288` · "Bir de dürüst bir uyarı: Gerçek bir difüzyon modeli piksel “açmaz”." · Bir de + dürüst · "Gerçek bir difüzyon modeli piksel açmaz."
- `M05:304` · "Şimdi frene basma vakti: Bu modeller nerede yanılır, nerede tıkanır?" · coşkulu köprü · "Şimdi sınırlar: bu modeller nerede yanılır, nerede tıkanır?"
- `M05:308` [kaynak] · "Bu modeller etkileyici ama sihirli değil." · sihir · "Bu modeller etkileyici ama kusursuz değil."
- `M05:310` [kaynak] · "işte burada görebilirsin." · işte · "burada görebilirsin."
- `M05:332` · "Gösterim: Pencere doldu! İlk 1 kelime artık “unutuldu”." · altyazı + ünlem + "1 kelime" · "Pencere doldu; ilk kelime unutuldu. Model yalnız son sekizini görüyor."
- `M05:351` · "Bölümün yığını tamam: … Şimdi neyin kaldığını ölç." · sınav-öncesi şablon · "Token, gömü, dikkat, üretim, eğitim, difüzyon, sınırlar: bölüm bu kadar. Ne kaldığına bak."
- `cevaplar/M05.md:7,16,22` · "Makul her cevap kabul", "Herhangi bir makul çift kabul", "Gerekçesi açık her cevap kabul." · kaçamak formülü (cevaplar genelinde 10×) · Tek biçim seç ve yalnız gerçekten açık uçlu sorularda kullan.

### M06
- `M06:11` [kaynak] · "Bu bölümün derdi de bu." · punchline · "Bu bölüm bunu anlatıyor."
- `M06:17` [kaynak] · "Ana fikir şu: modeli değiştirmeden, çevresine kurulan sistemle güvenilirlik ve fayda artırılabilir." · şu: · "Ana fikir, modeli değiştirmeden çevresine kurulan sistemle güvenilirliği artırmak."
- `M06:27` [kaynak] · "çoğu “kötü cevap” aslında “eksik soru”dur." · aslında + tırnak ×2 · "çoğu kötü cevap eksik sorudur."
- `M06:44` · "bu, gösterimin bilinçli sadeleştirmesidir." · gösterim uyarısı · "kural bilerek bu kadar basit."
- `M06:62` · "pratikte kenar notunun öğüdü geçerli: tek başına unvan az iş görür, durumu anlatmak en çok iş görür." · kenar notu + iş görür ×2 · "Pratikte unvan tek başına az iş görür, durumu anlatmak çok."
- `M06:64/74/330` · "Model yeniden eğitilmiyor; ona sadece daha iyi bir soru sorulmuş oluyor." · aynı cümle 3× · Kalanlar listesinde farklı sözcüklerle.
- `M06:107` · "Bir noktaya dikkat et: kaynak parçası en az cevap kadar önemli." · Bir noktaya dikkat et · "Kaynak parçası en az cevap kadar önemli."
- `M06:123` · "Peki iş konuşmakla bitmiyorsa, hesap yapmak, takvime bakmak gerekiyorsa?" · Peki · "İş konuşmakla bitmiyorsa, hesap yapmak ya da takvime bakmak gerekiyorsa?"
- `M06:131` [kaynak] · "Fark şu: bir sohbet botu sana “nasıl yapılacağını” anlatır" · şu: · "Sohbet botu sana nasıl yapılacağını anlatır; ajan onu senin için yapmaya çalışır."
- `M06:149` · "Döngü tam da bu yüzden döngü: her tur bir öncekinin sonucunu kullanır." · tam da bu yüzden · "Döngü adını buradan alır: her tur öncekinin sonucunu kullanır."
- `M06:203` · "Kenar notundaki uyarı burada somutlaşıyor: zor olan model değil, bu yedi adımı…" · kenar notu; "model değil, X" 6× · "Zor olan model değil, bu yedi adımı her seferinde güvenilir yürütmek."
- `M06:271` · "Kenar notundaki yardımcı pilot fikri buradan çıkıyor: …" · kenar notu · "Yardımcı pilot fikri de bu: karar insanın, hız ve dikkat yapay zekânın."
- `M06:273/281/283` [kaynak] · "önemli olan sadece “YZ eklemek” değil, onu sorumlu ve … kullanmaktır" · 3× · 283'ü sil (teknik "Ne oluyor" tekrarı).
- `M06:285` · "Altı alan, beş beceri, bir iskelet. Atölyenin aletleri yerine oturdu mu, altı soruyla sına." · üçlü sayım + şablon · "Atölyenin aletleri yerine oturdu mu? Altı soruyla sına."

### M07
- `M07:9` [kaynak] · "Bu güç, beraberinde sorumluluğu da getiriyor. Sıra artık teknolojinin kendisinde değil; onun insana dokunduğu yeri konuşmakta." · güç–sorumluluk klişesi + "X değil; Y" · "Etkisi büyüdükçe sorumluluk da büyüyor. Artık teknolojiyi değil, insana dokunduğu yeri konuşacağız."
- `M07:11` [kaynak] · 5 retorik soru + "göz ardı etmeyeceğiz" · "Beş başlık var: verideki önyargı, kara kutu kararlar, deepfake, düzenleme (AB AI Act, KVKK) ve hizalama. İşin değişen doğası da arada."
- `M07:19` [kaynak] · "Bütün bunlar, teknik yetkinliği toplumsal sorumlulukla birleştiren bir bakış kazandırmak için." · kurumsal amaç · "Amaç, teknik bilgiyi toplumsal sorumlulukla birlikte okumak."
- `M07:25/29/48/51/61/282` · "kötü niyetten değil, çarpık defterden/veriden" · 5× + kalanlar; "çarpık" 8× · Kaynak 25 ve kenar notunda kalsın; 48, 51, 61 ve 282'de farklı söyle ("veriden miras kalır").
- `M07:46/48` · "Gösterimin altyazısı şöyle: “Veri dengeli: …”" / "Yüzde 50’de şunu okuyorsun: “…”" · altyazı alıntısı ×2 · "Yüzde 50'de model A'yı 70, B'yi 30 onaylıyor; nitelikler aynı, fark yalnız veriden."
- `M07:51` [kaynak] · "Yani ayrımcılık kötü niyetten değil, çarpık veriden doğuyor." · yani + tekrar · Sil; 25 söyledi.
- `M07:53` · "Demo, fark 6 puan ve altındayken veriyi “dengeli” sayıyor." · kalan "Demo" · "Gösterim, fark 6 puan ve altındayken veriyi dengeli sayıyor."
- `M07:65` · "Peki modelin verdiği tek bir kararın gerekçesini görebilir miyiz?" · Peki · "Modelin verdiği tek bir kararın gerekçesini görebilir miyiz?"
- `M07:71` [kaynak] · "Kara kutuyu beyaz kutuya çeviren şey işte budur." · işte budur · Sil ya da "Kara kutu böyle beyaz kutuya döner."
- `M07:101` · "Gösterimin altyazısı her iki başvuruda aynı cümleyi kuruyor: “Yeşil etkenler …” Kâğıtta yeşili turuncu, kırmızıyı gri oku." · altyazı + renk çeviri notu · "Artı etkenler onaya, eksiler redde itti; toplam (−8 ya da +76) sonucu belirledi."
- `M07:121` [kaynak] · "Eğlencesi de var elbette; ama sahte kanıt…" · elbette · "Eğlencesi de var; ama sahte kanıt…"
- `M07:139` · "Dört durumun ortak dersi şu: … Skorunu tut: dört kartta kaç doğru?" · şu: + oyunlaştırma · "Dört durumun ortak dersi: karar tek ayrıntıya değil, üç sorunun toplamına dayanır. … Dört kartta kaç doğru?"
- `M07:175` · "Gösterim her seçimin yanına doğru kademeyi yazıyor; kâğıtta bunu kendin not et ve sonunda altı üzerinden puanını hesapla." · ekran/kâğıt · "Kademeni yanına yaz; sonunda altıda kaç doğru, say."
- `M07:184` · "Gösterim, altı kartın hepsi yerleştiğinde şu cümleyle kapanıyor: “…” Yarı yolda takılırsan gösterimin sorduğu soruya dön. “Düşün: …”" · çift altyazı · "Takılırsan tek soruya dön: bu kullanım birinin hayatını ya da haklarını etkiliyor mu?"
- `M07:198` · "Peki makinenin içine “ne istediğimizi” tam olarak koyabiliyor muyuz?" · Peki + tam olarak + tırnak · "Kurallar dışarıdan çizilen sınırlar. Makinenin içine ne istediğimizi koyabiliyor muyuz?"
- `M07:211` · "Üçünde de sistem hedefi başarıyla yerine getiriyor; sorun tam da burada." · tam da burada · "Üçünde de sistem hedefi yerine getiriyor; sorun da bu."
- `M07:224` · "hedef her zaman niyetin eksik bir çevirisidir. Sistem çeviriyi yapar, aslını değil. Boşluk büyüdükçe yan etki büyür. Bu yüzden hizalama tek seferlik bir ayar değil; …" · 4 aforizma · "Hedef, niyetin eksik bir çevirisidir; boşluk büyüdükçe yan etki büyür. Hizalama bu yüzden tek seferlik ayar değil, süren bir pazarlık."
- `M07:226` [kaynak] · "Yani verdiğin ölçütü en üst düzeye çıkarır, amacını değil." · yani · "Verdiğin ölçütü en üst düzeye çıkarır, amacını değil."
- `M07:238` · "Bölümü kapatmadan önce altı soruyla kendini yokla." · M08:242 ile aynı · "Altı soru, sonra kapanış."
- `cevaplar/M07.md:7` · "açık kutunun yararı tam da budur: …" · tam da budur · "açık kutunun yararı da bu: …"
- `cevaplar/M07.md:15` · "AB YZ Yasası’te, dar kolluk istisnaları dışında" · yazım hatası · "AB YZ Yasası'nda, dar kolluk istisnaları dışında"
- `cevaplar/M07.md:18` · "…bir yenisini bırakır; ders budur." · punchline · "…bir yenisini bırakır. Ders bu."

### M08
- `M08:9` [kaynak] · "Yolculuğun sonuna geldik." · yolculuk (kenar 209 ile çakışıyor) · "Son bölümdeyiz."
- `M08:43` · "Tahmin ederken üç şeye bak: … Sonra bir adım geri çekil ve ipuçlarının kendisini sorgula. … Turing’in oyunu tam da bu yüzden zamanla aşındı" · üç şeye bak + ders tonu + tam da · "Ölçütler kalıp, kişisellik ve hız. Ama ipuçlarının kendisini de sorgula: … Turing'in oyunu bu yüzden zamanla aşındı."
- `M08:66` · "Peki akıcı cevap vermek anlamak mıdır? John Searle’ün odası tam bu soruyu kurcalar." · Peki + tam bu · "Akıcı cevap vermek anlamak mıdır? John Searle'ün odası bu soruyu kurcalar."
- `M08:89` · "Şimdi perde açılıyor: aslında ne dedin?" · tiyatro + aslında · "Şimdi notların anlamı:"
- `M08:97` · "Searle’ün sorusu tam burada: … Peki oda, kitap ve sen birlikte anlıyor musunuz? İşte görüşler burada ayrılır." · tam burada + Peki + İşte · "Searle'ün sorusu bu: odadaki sen Çince anlıyor musun? Çoğu okur hayır der. Oda, kitap ve sen birlikte anlıyor musunuz? Görüşler burada ayrılır."
- `M08:99` · "Bir de şunu fark et: kural kitabı üç satırdı." · Bir de şunu fark et · "Kural kitabı üç satırdı."
- `M08:115` · "Anlama sorusunu bir yana koy. Makineler ne kadar ileri gidebilir? Şimdi yetenek merdivenine bakalım." · "Şimdi … -alım" (5×) · "Anlama sorusunu bir yana koy: makineler ne kadar ileri gidebilir?"
- `M08:128/154` · "Çubuk bir ölçüm değil, kaba bir sıralama; …" + teknik "yalnız sıralama taşır" · aynı uyarı 3× · Kurulum'da bir kez: "Çubuklar ölçüm değil, sıralama."
- `M08:138` · "Tabloyu okurken üç şeye dikkat et. Birincisi, … İkincisi, … Üçüncüsü, …" · numaralı gözlem · Madde işaretsiz üç kısa cümle.
- `M08:140` · "Şunu da fark et: bir sohbet modeli hem şiir yazıyor hem kod üretiyor. Bu “genel” değil mi? Bu yüzden…" · Şunu da fark et + retorik + Bu yüzden · "Bir sohbet modeli hem şiir yazıyor hem kod üretiyor; bu genel sayılmaz mı? Bazı uzmanlar bu yüzden ara basamaklar koyar."
- `M08:142` [kaynak] · "Dikkat: “her işi yapabilmek” ile “bilinçli olmak” birbirinden ayrı şeylerdir." · Dikkat: + 6× tekrar · "Her işi yapabilmek ile bilinçli olmak ayrı şeylerdir."
- `M08:156` · "Cevap, zekânın zamanla nasıl büyüdüğüne dair bir eğriye bağlı." · Cevap … şablonu · "Bu, zekânın zamanla nasıl büyüdüğüne bağlı."
- `M08:181` · "Kartopu masalı budur." · punchline · Sil.
- `M08:183` · "Dürüst cevap: bilmiyoruz." · dürüst · "Açık cevap: bilmiyoruz."
- `M08:187/195/197/289` [kaynak 187-197] · "kanıtlanmış bir kehanet değil, ciddiye alınması gereken ama belirsiz bir senaryo" · 4× · 187'de "Kısaca:" ile birlikte sil; 197 teknik tekrarını sil.
- `M08:224` · "Dördüncü tarafı seçmek istersen dur ve düşün. Bir yazılımı mahkemeye çıkarabilir misin; ceza verebilir misin; cezadan ne anlar?" · dur ve düşün + üçlü soru · "Dördüncü taraf için bir soru yeter: bir yazılımı mahkemeye çıkarıp ceza verebilir misin, cezadan ne anlar?"
- `M08:209` [kaynak] · "O gelecek üzerinde söz hakkın var. 🌱" · emoji · Emojiyi kaldır.
- `M08:242` · "Kitap burada bitiyor, soruları bitmiyor. Bölümü kapatmadan önce altı soruyla kendini yokla." · M07:238 ile aynı · "Kitap burada bitiyor, soruları bitmiyor. Son altı soru."
- `M08:285` · "Bu bölümün soruları açık; iyi bir soru sormak, kesin bir cevap vermekten daha değerlidir." · klişe · Maddeyi sil.
- `cevaplar/M08.md:4,16,22` · "Serbest cevap." ×4 · kaçamak formül · "Serbest." tek kelime ya da doğrudan ölçütle başla.

### arka/sozluk.md
- `sozluk.md:108` · "Söylediğini yapan ama kastettiğini kaçıran makine, bu sorunun ta kendisidir." · ta kendisi · "Söylediğini yapıp kastettiğini kaçıran makine bu sorunun örneğidir."
- `sozluk.md` · madde sonu punchline parçaları (≈8 madde); "kalbi" kitapta 6× · birini "temeli" yap.
- `sozluk.md:228` · "ezberlemez, kavrar." · aforizma tekrarı · "örüntüyü öğrenir."

## 3. Sayılı kalan bulgular
- "Peki …?" köprüleri: listelenen 12 dışında 10 daha.
- "Bu yüzden": 31; M06 (6) ve M07 (5) yoğun.
- "X değil, Y": 61; M08 15, M06 11, M07 10; Kalanlar listelerinde 7 madde.
- Ekran/kâğıt çifti Kurulum'larda: 6 (M01-M02).
- Kaynak teknik "Ne oluyor" paragrafının ilk teknik paragrafı tekrar ettiği yerler: 28 alt bölüm (özellikle M06:74/215/283, M07:61/113/151/196/236, M08:55/111/152/197/238).
- "gibi" benzetmesi: 68 + 18; M01 (16) ve M05 (12) yoğun.
- Tırnaklı vurgu: M05 120, M08 66.

## 4. En çok tekrar eden 5 alışkanlık
1. "Peki …?" köprü + "Cevap …/Sıradaki bölüm …-yor" kapanış şablonu.
2. Vurgu çivileri: "tam olarak / tam bu / işte / işte budur / bundan ibaret" ve paragraf sonu punchline (≈60).
3. Ekranı kâğıda çeviren meta dil: "Ekranda … -yordu; kâğıtta …", "Gösterimin altyazısı şöyle", "Bu bir gösterimdir", "gösterim" (43+9), "kenar notundaki …" (13).
4. Ek-gözlem açılışları ve numaralı bakış şablonu (≈25).
5. Aynı cümlenin bölüm içinde 3-5 kez söylenmesi.

Düz hatalar: `cevaplar/M02.md:4` çift cümle, `cevaplar/M07.md:15` "Yasası'te", `M07:53` "Demo", `M07:238`/`M08:242` aynı köprü, emojiler.
