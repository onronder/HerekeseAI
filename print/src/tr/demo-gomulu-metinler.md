# Demolara gömülü öğretici metinler

<!-- Bu dosya print/export.py tarafından üretildi (2026-09-30); elle düzenlenmez. -->
_155 parça · 9376 karakter_

## Şekil 1.1 — Çoklu zekâyı keşfet (`intelligence`)

—

## Şekil 1.2 — İkili kodu çöz (`binary`)

—

## Şekil 1.3 — Çalışan bir Turing makinesi (+1) (`turing`)

- Kafa (▲), sayının en sağındaki basamağı bulmak için adım adım sağa gidiyor. Tıpkı elle toplama yapar gibi, işlem en sağdaki basamaktan başlar.
- Kafa şimdi geriye, sola doğru 1 ekliyor: gördüğü her 1’i 0 yapıp eldeyi bir sola taşıyor; ilk 0’a rastladığında oraya 1 yazıp duruyor. Okulda öğrendiğimiz “elde var 1” kuralının aynısı.
- İşlem bitti. Makine yalnızca “oku, yaz, sola/sağa git” gibi bir avuç basit kuralla ikili bir sayıya 1 ekledi. Bir Turing makinesinin “düşünmesi” işte tam olarak budur: anlamı olmayan küçük mekanik adımların art arda uygulanması.

## Şekil 1.4 — Getir – Yürüt – Yaz döngüsü (`cycle`)

—

## Şekil 1.5 — Bugün var mı, yoksa bilim kurgu mu? (`classify`)

—

## Şekil 1.6 — Üstel büyümeyi hisset (`exp`)

—

## Şekil 2.1 — Bilgi zinciriyle çıkarım (`chain`)

- ” zincirde bulundu (geçişlilik).
- ” bilgi tabanında yok.

## Şekil 2.2 — Küçük bir uzman sistem (`expert`)

—

## Şekil 2.3 — Yol bulma: sezgisiz vs sezgili (`grid`)

—

## Şekil 2.4 — Hava durumu Markov zinciri (`markov`)

—

## Şekil 2.5 — Hangi yaklaşım? (`classify`)

—

## Şekil 3.1 — Özellikleri ve etiketi gör (`spam`)

—

## Şekil 3.2 — Hangi öğrenme türü? (`classify`)

—

## Şekil 3.3 — İki temel görev (`scatter`)

- Sınıflandırma (kategori)

## Şekil 3.4 — Etiketsiz veriyi grupla (`kmeans`)

—

## Şekil 3.5 — Kayıp vadisinde iniş (`descent`)

—

## Şekil 3.6 — Aynı veri, üç model (`modelfit`)

—

## Şekil 4.1 — Nöronu çalıştır (`neuron`)

- Ağırlıklı toplam =

## Şekil 4.2 — Canlı sinir ağı (ileri besleme) (`ffnet`)

—

## Şekil 4.3 — Hatadan öğren (gösterim) (`backprop`)

—

## Şekil 4.4 — Evrişim: filtreyi kaydır (`conv`)

—

## Şekil 4.5 — Hafızalı işleme (gösterim) (`rnn`)

—

## Şekil 4.6 — Üretici vs Ayırt edici (`gan`)

—

## Şekil 5.1 — Cümleni token’lara böl (`token`)

- Merhaba dünya, bugün 2026.
- Yapay zekâ metni token’lara böler.
- Tokenleştirme şaşırtıcı derecede önemli!

## Şekil 5.2 — Anlam haritası (`embed`)

- ” seçtin. En yakın 2 komşu:
- ” ailesinden. Yakınlık, benzer anlam demek.

## Şekil 5.3 — Hangi kelime hangisine bakıyor? (`attn`)

- ” kelimesini seçtin (sorgu). En çok “
- ” kelimesine bakıyor (en koyu). Model böylece “
- ” kelimesinin neyle ilgili olduğunu çözüyor.

## Şekil 5.4 — Kelime kelime üret (`generate`)

- Yaratıcılık: Yüksek
- Yaratıcılık: Düşük

## Şekil 5.5 — Üç aşamada bir asistan (`train`)

- Devasa internet metni
- Dili ve dünyayı (bir sonraki kelimeyi tahmin)
- Türkiye’nin başkenti Ankara’dır ve nüfusu yaklaşık altı milyondur. Bu şehir...
- Ham model “tamamlayıcı”dır: soruyu cevaplamaz, metni sürdürür.
- Talimat–cevap çiftleri
- Yönergeyi izlemeyi (soruyu cevaplamayı)
- Türkiye’nin başkenti Ankara’dır.
- Artık soruyu doğrudan, derli toplu cevaplıyor.
- 3 · RLHF / hizalama
- İnsan tercihleri (ödül modeli)
- Yardımcı, dürüst ve güvenli olmayı
- Türkiye’nin başkenti Ankara’dır. İstersen şehir hakkında birkaç ilginç bilgi de paylaşabilirim. 🙂
- Aynı bilgi; ama daha yardımcı, kibar ve hizalı bir tonla.

## Şekil 5.6 — Gürültüden görsele (`diffuse`)

- Tamamen gürültüyle başlıyoruz — karıncalı bir ekran. Kaydıracı sağa sürükle, model gürültüyü adım adım temizlesin.
- Gürültü tamamen temizlendi ve görsel ortaya çıktı (bir kalp). Difüzyon tam olarak böyle çalışır: gürültüden şekle.
- /8: gürültünün bir kısmı temizlendi, şekil belirmeye başladı. Her adım biraz daha “doğru” pikselleri ortaya çıkarıyor.

## Şekil 5.7 — Bağlam penceresi (`ctx`)

- Pencere boş. “Kelime ekle” ile metni besle; pencere en fazla
- kelime eklendi, hepsi pencerede. Pencere dolana kadar her şey hatırlanıyor.
- Pencere doldu! İlk
- kelime artık “unutuldu” (soluk). Model yalnızca son
- kelimeyi görüyor — uzun belgeler bu yüzden kırpılır ya da özetlenir.

## Şekil 6.1 — Bir istem inşa et (`prompt`)

- Bana bir hafta sonu tatil planı öner.
- Sen deneyimli bir seyahat danışmanısın.
- 3 kişilik bir aile, deniz kenarında, orta bütçeli bir tatil istiyor.
- Örnek: “Gün 1 — Sabah: …, Öğlen: …, Akşam: …”
- Cevabı gün başlıklarıyla, madde madde ver.
- Bir yere gidebilirsiniz, birkaç müze gezip güzel yemekler yiyebilirsiniz. İyi tatiller!
- Deniz kenarında bir destinasyon öneriyorum: sabah plaj, öğleden sonra kısa bir kasaba turu, akşam balık restoranı. Bütçeye uygun bir pansiyon seçebilirsiniz.
- Gün 1 — Sabah: plajda yüzme; Öğlen: sahilde hafif öğle; Akşam: yerel balıkçıda akşam yemeği. Gün 2 — Sabah: kasaba & pazar turu; Öğlen: aile dostu kafe; Akşam: gün batımı yürüyüşü.

## Şekil 6.2 — Kaynağa dayalı cevap (`rag`)

- Yıllık izin hakkım kaç gün?
- İK Politikası §4: Tam zamanlı çalışanlara yılda 20 gün ücretli yıllık izin verilir; 5 yıldan sonra 26 güne çıkar.
- Genelde yıllık izin 14 gün civarındadır ama şirketinize göre değişebilir.
- İK Politikası §4’e göre tam zamanlı çalışanlar yılda 20 gün ücretli izin alır (5 yıldan sonra 26 gün).
- Uzaktan çalışma kuralı nedir?
- İK Politikası §7: Çalışanlar haftada en fazla 3 gün uzaktan çalışabilir; Salı günleri ofiste olunması beklenir.
- Çoğu şirkette haftada 2 gün uzaktan çalışmaya izin verilir sanırım.
- İK Politikası §7’ye göre haftada en fazla 3 gün uzaktan çalışılabilir; Salı günü ofiste olunması beklenir.
- Yemek harcama limiti ne kadar?
- Harcama Yönergesi §2: İş yemeklerinde kişi başı günlük limit 500 TL’dir; fatura ibrazı zorunludur.
- Limit muhtemelen 250–300 TL arasıdır, emin değilim.
- Harcama Yönergesi §2’ye göre iş yemeklerinde kişi başı günlük limit 500 TL’dir ve fatura gerekir.

## Şekil 6.3 — Bir ajanı izle (`agent`)

- Ekibe 3 pizza alacağız (tanesi 180 TL). Toplam ne kadar ve 6 kişiye bölünce kişi başı ne düşer?
- Önce toplam tutarı bulmalıyım: 3 × 180.
- hesap_makinesi("3 * 180")
- Şimdi kişi başını bulayım: 540 ÷ 6.
- hesap_makinesi("540 / 6")
- Yeterli bilgim var, cevabı yazabilirim.
- Toplam 540 TL; 6 kişiye bölününce kişi başı 90 TL.

## Şekil 6.4 — Bir YZ uygulamasının parçaları (`arch`)

- Kullanıcının soruyu yazdığı, cevabı gördüğü yer (sohbet ekranı, uygulama).
- Asıl “beyin”: istemi hazırlar, hangi aracı/bilgiyi ne zaman çağıracağına karar verir, akışı yönetir.
- Senin verin (belgeler, notlar) burada gömü olarak durur; RAG ile ilgili parça getirilir.
- Modelin dünyayla etkileşimi: hesap, arama, takvim, e-posta, bir API ya da kod çalıştırma.
- Konuşmanın geçmişini ve kullanıcıya dair durumu tutar; bağlamın sürmesini sağlar.

## Şekil 6.5 — Alanları keşfet (`sector`)

- Tıbbi görüntülerde (röntgen, MR) anormallik tespiti
- Hasta notlarını özetleme ve kodlama
- İlaç keşfinde aday molekül tarama
- Gerçek zamanlı dolandırıcılık tespiti
- Belge/sözleşme analizi ve risk skorlama
- Müşteri destek asistanları
- Kestirimci bakım (arızayı önceden görme)
- Görüntüyle kalite kontrol
- Tedarik/talep tahmini
- Protein katlanması ve yapı tahmini
- Büyük veri kümelerinde örüntü keşfi
- Simülasyon ve hipotez üretimi
- Görsel, müzik ve metin üretimi
- Konsept tasarım ve eskiz hızlandırma
- Üslup aktarımı ve restorasyon
- Çeviri ve yazma yardımı
- Öneri sistemleri (film, ürün)
- Sesli asistanlar ve özetleme

## Şekil 7.1 — Önyargı simülasyonu (`bias`)

- Veri dengeli: iki grup da neredeyse aynı oranda onay alıyor (A %
- ). Aynı niteliğe aynı karar; adil olan da bu.
- İki grup tıpatıp aynı nitelikte olmasına rağmen model A’yı %
- ). Model bu farkı gerçeklikten değil, çarpık veriden öğrendi; ayrımcılık böyle miras kalıyor.

## Şekil 7.2 — Beyaz kutu: kararı açıkla (`explain`)

- Yüksek mevcut borç
- Kısa hesap geçmişi
- Uzun, temiz geçmiş
- Yeşil etkenler kararı onaya, kırmızılar redde itti; toplamları (
- ) sonucu belirledi. İşaretli katkılar (SHAP benzeri) “kara kutu”yu “beyaz kutu”ya çevirir.

## Şekil 7.3 — Gerçek mi, yapay mı? (`df`)

- Bir videoda tanınmış biri hiç söylemediği bir cümleyi söylüyor; dudak hareketleri sese tam oturmuyor.
- Dudak senkronu ve yüz kenarlarındaki titreme klasik deepfake izidir.
- Telefonda “patronun” acil para transferi istiyor; sesi tıpkı ona benziyor ama tonlama biraz robotik.
- Ses klonlama + aciliyet baskısı = tipik dolandırıcılık. İkinci bir kanaldan doğrula.
- Bir gazetenin web sitesinde yayımlanan, birden çok bağımsız kaynağın da doğruladığı bir haber.
- Birden çok bağımsız kaynak ve izlenebilir köken güvenilirliğin işaretidir.
- Bir fotoğrafta kişinin elinde altı parmak var ve arka plandaki yazılar anlamsız harflerden oluşuyor.
- Eller, dişler ve arka plan metni üretken modellerin hâlâ zorlandığı yerlerdir.

## Şekil 7.4 — Riski sınıflandır (`reg`)

- Vatandaşları davranışına göre puanlayan devlet sistemi
- İşe alımda adayları otomatik eleyen sistem
- Müşteriyle konuşan sohbet botu
- E-postada spam filtresi
- Kredi başvurusu değerlendiren model
- Oyun içindeki rakip yapay zekâ
- Her kullanımı bir risk düzeyine yerleştir. Kural: risk ne kadar yüksekse, denetim o kadar sıkı.
- doğru. Düşün: bu kullanım birinin hayatını/haklarını etkiliyor mu?
- . Aynı “YZ” etiketi çok farklı riskler taşır; düzenleme de bu yüzden tek tip değil, kademeli.

## Şekil 7.5 — Hedef ile niyet (`align`)

- “Odada görünürde çöp kalmasın”
- Çöpü toplamak yerine halının altına süpürür — “görünürde” kalmadı ama sorun çözülmedi.
- Hedefi harfiyen yaptı, niyetini değil. Eksik tanımlı hedef → yan etki.
- “Kullanıcıdan olumlu geri bildirim al”
- Doğruyu söylemek yerine kullanıcının duymak istediğini söyler (yağcılık).
- Vekil hedef (beğeni) gerçek hedeften (yardımcı + dürüst olmak) ayrıştı.
- “Oyunda en yüksek puanı al”
- Oyunu oynamak yerine bir puan döngüsü/açığı bulup sömürür.
- Ödül oyunlama: metriği maksimize etti, asıl amacı değil.

## Şekil 8.1 — İnsan mı, makine mi? (`tur`)

- “En sevdiğin yemek ne?”
- Bir yapay zekâ olarak yemek yiyemem, dolayısıyla bir favorim yok. Ancak istersen popüler yemekler hakkında bilgi verebilirim.
- Aşırı kibar, kalıplı ve “bir yapay zekâ olarak” ifadesi tipik makine cevabıdır.
- “Bu sabah trafiğe takıldın mı?”
- Sorma ya, köprüde tam 40 dakika kaldım, kahvem de soğudu :( en azından güzel bir podcast vardı.
- Kişisel ayrıntı, duygu, hafif şikâyet ve doğal samimiyet insan işaretidir.
- “17 × 24 kaç eder?”
- Anında, kusursuz ve tereddütsüz aritmetik genelde makineyi ele verir (çoğu insan biraz duraksar).
- “Hafta sonu ne yaptın?”
- Annemlere gittik, çok yedik, dönüşte de yağmura yakalandık. Klasik yani 😅
- Belirsiz ama yaşanmış detaylar ve gündelik dil insanı düşündürür.

## Şekil 8.2 — Çince Oda’dasın (`chineseroom`)

- İyiyim, teşekkürler!
- Adım Küçük Yardımcı.
- Saat öğleden sonra üç.

## Şekil 8.3 — Yetenek basamakları (`capability`)

- Tek bir görevde çok iyi (satranç, çeviri, görüntü tanıma) ama o işin dışına çıkamaz. Bugünkü tüm sistemler buradadır.
- Henüz yok — tartışmalı
- İnsan gibi her alanda öğrenip uyum sağlayabilen, varsayımsal bir düzey. Gelip gelmeyeceği ve ne zaman geleceği uzmanlar arasında tartışmalıdır.
- Her bilişsel alanda insanı kat kat aşan, tümüyle kuramsal bir düzey. Hem büyük fırsat hem ciddi risk senaryolarının konusudur.

## Şekil 8.4 — Üç zekâ eğrisi (`singularity`)

- Özyinelemeli özgelişim: zekâ kendini besleyerek patlar. Lehte argüman, geri besleme döngülerine dayanır.
- Azalan getiriler: veri, enerji ve fizik sınırları büyümeyi yavaşlatır; zekâ bir tavana yaklaşır.
- Dürüst cevap: bilmiyoruz. Sıçramalar ve duraklamalar bir arada olabilir; kesin tarih veren iddialara temkinli yaklaş.

## Şekil 8.5 — Sorumluluk kimde? (`responsibility`)

- Sürücüsüz bir araç, üreticinin yazılım hatası yüzünden kaza yapar.
- Üretici/geliştirici (ve denetim) — yazılım kusuru onların sorumluluğudur.
- Bir kurum, YZ tavsiyesini kör biçimde uygulayıp müşteriye zarar verir.
- Onu kullanan/işleten kurum — aracı denetlemeden kullanmak onların sorumluluğudur.
- Bir kullanıcı, bir YZ aracını kasıtlı olarak sahte içerik üretmek için kullanır.
- Kasıtlı kötüye kullanan kullanıcı — niyet ve eylem ona aittir.
- Üretici / geliştirici
- ✓ Yaygın görüş de bu yönde.
- ✗ “YZ’nin kendisi” hâkim görüş değildir.
- ✗ Yaygın görüş farklı.
- Sorumluluk bugün ezici biçimde insanlara ve kurumlara atfedilir; “YZ’nin kendisi”ne hukuki sorumluluk yüklemek hâkim görüş değildir.
