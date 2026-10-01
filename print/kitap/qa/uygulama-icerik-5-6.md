# Uygulama raporu · İçerik ajanı (Bölüm 5–6) · 2026-10-01

Kaynak: `print/kitap/qa/duzeltme-kayitlari.json` → R033–R050, R066 (Bölüm 5 embedding), R096.
Dosyalar: `print/src/tr/M05-bugunun-yapay-zekasi.md`, `M06-yz-yi-kullanmak-ve-insa-etmek.md`, `cevaplar/M05.md`, `cevaplar/M06.md`;
`print/src/en/M05-today-s-ai.md`, `M06-using-and-building-ai.md`, `answers/M05.md`, `answers/M06.md`. Dijital HTML'e dokunulmadı; kaynak paragraf
değişiklikleri dört bölüm dosyasının SOURCE-CHANGES bloğuna eklendi (TR M05 33 satır, TR M06 20, EN M05 32, EN M06 18; ESKİ = book.json birebir,
doğrulandı). Git komutu çalıştırılmadı. Kısaltmalar: TR5 = tr/M05, TR6 = tr/M06, EN5 = en/M05, EN6 = en/M06, C5/C6 = cevaplar, A5/A6 = answers.

## Kayıt satırları

R033 | TR5:11 | Basit: "tek bir buluş" → "dönüm noktalarından biri"; üretken modeller (GAN) ve dikkat daha önce de araştırılıyordu, Transformer ölçekleme sağladı (SOURCE-CHANGES) | uygulandı
R033 | TR5:17 | Teknik: Transformer "önemli bir dönüm noktası", GAN 2014 anılıyor, sıçrama mimari + veri/hesap birleşiminden (SOURCE-CHANGES) | uygulandı
R033 | EN5:11, EN5:17 | Aynı iki değişiklik İngilizce (SOURCE-CHANGES) | uygulandı
R034 | TR5:17 | Teknik: ayırt edici sınıflandırıcı p(y|x) (x girdi, y etiket); üretici model içeriğin, x'in, dağılımı p(x) / p(x|koşul); yeni örnekler bu dağılımdan üretilir (SOURCE-CHANGES) | uygulandı
R034 | EN5:17 | Aynı tanım İngilizce (SOURCE-CHANGES) | uygulandı
R035 | TR5:34 | Kurulum: bölücü oyuncak kural, gerçek tokenizer değil | uygulandı
R035 | TR5:46 | Adım adım: Türkçe/İngilizce token farkı genellemesi "gerçek tokenizer sınırları farklı çizer; kaç token çıkacağı tokenizer ve sözlüğe bağlı; yön aynı, çoğu zaman" ile sınırlandı | uygulandı
R035 | TR5:48 | Ne oluyor (basit): "Kısa kelimeler tek parça kalır…" evrensel kuralı "Buradaki bölücü…; gerçek token sınırları tokenizer'a ve sözlüğüne bağlıdır" (SOURCE-CHANGES) | uygulandı
R035 | TR5:54 | Teknik: "(ör. BPE, WordPiece, SentencePiece)" → yaklaşımlar BPE/WordPiece/unigram, SentencePiece araç (SOURCE-CHANGES) | uygulandı
R035 | TR5:58 | Teknik Ne oluyor: "Bu gösterimde…; gerçek token sınırları seçilen tokenizer'a ve sözlüğe bağlıdır" (SOURCE-CHANGES) | uygulandı
R035 | TR5:60 | "Merhaba tek token olurdu / Tokenleştirme ikiye ya da üçe bölünürdü" kesin sayıları kaldırıldı; "tokenizer ve sürümü sabitlenip çalıştırılmadan verilemez" | uygulandı
R035 | EN5:34, 48, 50, 56, 60 | Aynı beş değişiklik İngilizce; ayrıca EN dijital teknik Ne oluyor (basılıda yok) için SOURCE-CHANGES satırı (BPE/WordPiece/unigram) | uygulandı
R036 | TR5:75 | Kurulum (ilk bakışta görünür): noktalar elle yerleştirilmiş, eğitilmiş modelden ya da PCA/t-SNE'den değil; "bu haritada … sayılıyor" | uygulandı
R036 | TR5:93 | Adım adım: iki boyut sınırı (2B'de en yakın görünen ikili asıl uzayda en yakın olmayabilir) | uygulandı
R036 | TR5:95 | Ne oluyor (basit): "en yakın 2 komşu … temsil eder; noktalar elle yerleştirilmiştir, eğitilmiş modelden alınmamıştır" (SOURCE-CHANGES) | uygulandı
R036 | TR5:103 | Teknik: "2B'ye indirgenmiş (PCA/t-SNE benzeri) temsil" → elle yerleştirilmiş, PCA/t-SNE değil, iki boyut sınırı (SOURCE-CHANGES) | uygulandı
R036 | TR5:105 | Teknik Ne oluyor: "bu gösterimde …; noktalar elle yerleştirilmiştir; iki boyutlu yakınlık garanti değil" (SOURCE-CHANGES) | uygulandı
R036 | EN5:75, 93, 95, 103 | Aynı değişiklikler; EN basitteki "The machine learned this placement itself" iddiası "placed by hand to show the idea; a real model learns its placement…" oldu; EN dijital teknik Ne oluyor için SOURCE-CHANGES satırı | uygulandı
R037 | TR5:122 | Kurulum: tablo "temsili bir çift yönlü (encoder) öz-dikkat örneği", ağırlıklar elle seçilmiş, sonraki kelimelere de bakabiliyor | uygulandı
R037 | TR5:144 | Yeni paragraf: "Kedi" satırı sonraki "kaçtı"ya 0.30 veriyor; otoregresif modelde sonrakiler maskelenir; tablo encoder tipi örnek | uygulandı
R037 | TR5:152 | Teknik: √d → √d_k (anahtar boyutu); maskesiz öz-dikkat / nedensel decoder ayrımı; eğitimde paralel, üretimde ardışık (SOURCE-CHANGES) | uygulandı
R037 | TR5:158 | Teknik ek: çift yönlü hücre otoregresif modelde maskelenir (−∞, ağırlık 0, satır yeniden normalize) | uygulandı
R037 | TR5:117 | Kenar notu: "Tüm kelimelere aynı anda bakmak" → "Eğitimde tüm konumları birlikte işlemek …; üretim yine token token ilerler" (SOURCE-CHANGES) | uygulandı
R037 | EN5:120, 142, 150, 154, 115 | Aynı değişiklikler İngilizce (SOURCE-CHANGES: teknik, tip, dijital teknik Ne oluyor √d_k) | uygulandı
R038 | TR5:139 | Adım adım 4. madde: "Zamir, kimi kastettiğini kediye bakarak çözüyor" → temsili tabloda en çok kediye bakıyor; tek ağırlık gönderge çözümünü kanıtlamaz (1. madde zaten "kendisi dışında en çok" diyordu: 0.50 kendi, 0.30 kaçtı) | uygulandı
R038 | TR5:146 | Ne oluyor (basit): "o'nun kediyi kastettiği ortaya çıkar" → temsili örnek, ağırlıklar elle seçilmiş, tek başına kanıt değil (SOURCE-CHANGES) | uygulandı
R038 | TR5:156 | Teknik Ne oluyor: "neyi kastettiği çözülür" → "kime baktığını gösterir; dikkat ağırlığı tek başına göndergeyi çözmez" (SOURCE-CHANGES) | uygulandı
R038 | TR5:148, C5:10 | Kendin dene 3 "bağlacın anlam yükü hakkında bu ne söylüyor?" → "kesin bir hüküm çıkar mı?"; cevap: tablo bu sezgiyle kurulmuş, elle seçilmiş ağırlıktan hüküm çıkmaz, başka baş yüksek ağırlık verebilir | uygulandı
R038 | TR5:417 | Kalanlar: "o zamiri böylece kediye bakmayı öğrenir" → "bu örnekte … en çok kediye bakar" | uygulandı
R038 | EN5:137, 144, 146, 405; A5:10 | Aynı değişiklikler İngilizce | uygulandı
R038 | figür | Figür altyazısı (strings/M05.mjs attn.caption "zamir kediye bakıyor") figür ajanının alanı; metinde en koyu hücre = kendi (0.50) zaten doğru | uygulanmadı: figür dosyası bu ajanın kapsamı dışında, nota yazıldı
R039 | TR5:164 | Basit: "bir dil modelinin tek işi budur" → "bu bölümdeki dil modellerinin işi budur" (SOURCE-CHANGES) | uygulandı
R039 | TR5:211 | Teknik: "LLM'ler otoregresiftir" → "Burada otoregresif üretici dil modellerini inceliyoruz; her dil modeli otoregresif değildir"; model skor (logit) üretir, softmax toplamı 1 olan dağılıma çevirir (SOURCE-CHANGES) | uygulandı
R039 | TR5:217 | Teknik ek: "model puanlarını" → "model skorlarını (logit)" | uygulandı
R039 | TR5:383 | Sınav 4 soru kökü: "Bir LLM özünde ne yapar?" → "Bu bölümdeki otoregresif bir LLM özünde ne yapar?" (şıklar ve sıra değişmedi; SOURCE-CHANGES) | uygulandı
R039 | EN5:160, 207, 211, 371 | Aynı değişiklikler İngilizce; EN dijital teknik Ne oluyor için SOURCE-CHANGES satırı | uygulandı
R040 | TR5:173 | Kurulum: sıralar "Açgözlü (argmax)" ve "Örnekleme, T = 1.5" (ondalık nokta: R095 kararı; görev metnindeki "1,5" uygulanmadı) | uygulandı
R040 | TR5:183–201 | Adım adım: örnekleme sırası demo-data.json temp54 kuralıyla hesaplandı (z = ln p, softmax(z/1.5), U = 0.37/0.81/0.12 ters-CDF): adım 1 çok 0.36·artık 0.28·bugün 0.21·giderek 0.16 → artık; adım 2 hızlı 0.34·güçlü 0.29·yaygın 0.22·akıllı 0.16 → yaygın; adım 3 gelişiyor 0.41·ilerliyor 0.26·yayılıyor 0.19·büyüyor 0.14 → gelişiyor; cümle "Yapay zekâ artık yaygın gelişiyor."; birikimli toplam tablosu; "zar yok" ifadesi açgözlü seçime bağlandı, düşük sıcaklık ≠ açgözlü | uygulandı
R040 | TR5:166 | Basit: "iki yaratıcılık sırası" → "iki seçim kuralı: açgözlü / olasılıklara göre zar (örnekleme)" (SOURCE-CHANGES, dijitalde "Üret'e bas" cümlesi korunarak) | uygulandı
R040 | TR5:205 | Ne oluyor (basit): açgözlü hep en olası; örneklemede zar, sıcaklık zarın dengesini ayarlar, düşükken de zar atılır (SOURCE-CHANGES) | uygulandı
R040 | TR5:207, C5:13 | Kendin dene 1 → "ikinci U 0.81 yerine 0.50 olsaydı?" (cevap: güçlü; "Yapay zekâ artık güçlü gelişiyor."); 2 → açgözlü 0.080 vs örnekleme 0.28×0.20×0.50 = 0.028, yaklaşık üç kat; 3 aynı | uygulandı
R040 | TR5:213 | Teknik: "T > 0 iken örnekleme rastlantısal; argmax ayrı kural, düşük sıcaklıklı örnekleme değil" (SOURCE-CHANGES) | uygulandı
R040 | TR5:215 | Teknik Ne oluyor: "Düşük sıcaklık → greedy" → argmax ayrı kural; örnekleme softmax(z/T); düşük T sivriltir (SOURCE-CHANGES) | uygulandı
R040 | TR5:217 | Teknik ek: "hep ikinci aday anlatım kolaylığı" kaldırıldı; T = 1.5, z = ln p, U dizisi, "çok" 0.42→0.36, "giderek" 0.12→0.16 | uygulandı
R040 | TR5:418 | Kalanlar: açgözlü / örnekleme / sıcaklık ayrımı | uygulandı
R040 | EN5:169, 179–197, 162, 201, 203, 207, 209, 211, 406; A5:13 | Aynı hesap İngilizce adaylarla: "AI already creates fast."; Kendin dene 1 cevabı "AI already writes fast." | uygulandı
R040 | figür | Şekil 5.4 dizgileri (strings/M05.mjs generate.high "GÖSTERİMDE İKİNCİ ADAY", mdHigh) ve gen/M05.mjs idx=1 seçimi hâlâ eski; figür ajanı iki sırayı "Açgözlü (argmax)" / "Örnekleme, T = 1.5" ve seçimleri artık/yaygın/gelişiyor (EN already/creates/fast) yapmalı | uygulanmadı: figür dosyaları kapsam dışı, nota yazıldı
R041 | TR5:223 | Basit: "üç okuldan geçer" → "yaygın bir yol üç okuldan geçer" (SOURCE-CHANGES) | uygulandı
R041 | TR5:227 | Kenar notu: "Kabaca: …; ince ayar bilgiyi ve görev başarımını da değiştirebilir" (SOURCE-CHANGES) | uygulandı
R041 | TR5:238 | Tablo: "İnsan tercihleri (ödül modeli)" → "(tercih çiftleri)" (figür dizgisi train.stages[2].data hâlâ "ödül modeli": figür ajanı) | uygulandı
R041 | TR5:247 | Adım adım: "Bu üç örnekte … aynı bilginin yanıt biçimi"; sıra yaygın reçete, zorunlu değil; PPO tabanlı RLHF ödül modeli / DPO tercih çiftleri | uygulandı
R041 | TR5:249 | Ne oluyor (basit): "yaygın bir yolda üç aşamada"; "tüm modeller aynı aşamalardan geçmez" (SOURCE-CHANGES) | uygulandı
R041 | TR5:251, C5:16 | Kendin dene 3 → "bilgi aynı kalıp biçim değişiyor; ince ayarın bilgiyi değiştiremeyeceği sonucu çıkar mı?"; cevap: "aynı bilginin farklı yanıt biçimleri", üç hazır cümleden o sonuç çıkmaz (B077) | uygulandı
R041 | TR5:255 | Teknik: PPO tabanlı RLHF ayrı ödül modeli; DPO tercih çiftlerinden doğrudan politika kaybı, ödül modeli gerektirmez; üç aşama yaygın akış (SOURCE-CHANGES) | uygulandı
R041 | TR5:259 | Teknik Ne oluyor: "Üç aşamanın sırası sabittir" → "Yaygın sıra …; sabit bir reçete değildir" (SOURCE-CHANGES) | uygulandı
R041 | TR5:261 | Teknik ek: hizalama hedefi insan tercihi; PPO/RLHF ve DPO kayıpları ayrı anlatıldı | uygulandı
R041 | TR5:389, 219, 419 | Sınav 5 kökü "Bölümde anlatılan yaygın eğitim hattının sırası?" (SOURCE-CHANGES); köprü "çoğu zaman üç aşamalı"; kalanlar "yaygın bir yolda" | uygulandı
R041 | EN5:217, 221, 232, 241, 243, 245, 249, 253, 213, 377, 407; A5:16 | Aynı değişiklikler İngilizce; EN dijital teknik Ne oluyor için SOURCE-CHANGES satırı | uygulandı
R042 | TR5:267 | Basit: "Görsel üreten modeller … difüzyon" → "çoğu …; GAN gibi başka yollar da var" (SOURCE-CHANGES) | uygulandı
R042 | TR5:276, 280 | Kurulum ve tablo: yüzde = şeridin ilerlemesi (adım/8; şekilde "temizlenen pay" yazar), 6/64 (yüzde 9) ayrı nicelik; sütun "İlerleme (adım/8)" | uygulandı
R042 | TR5:296 | Adım adım: gerçek model saklı resmi ortaya çıkarmaz, öğrenilmiş dönüşümlerle yeni örnek üretir; şerit sabit desen | uygulandı
R042 | TR5:298 | Ne oluyor (basit): "bu şerit geçişi sabit bir desenle canlandırır, gerçek model saklı bir resmi açmaz" (SOURCE-CHANGES; dijital YENİ "Kaydıracı" cümlesini korur) | uygulandı
R042 | TR5:300, C5:19 | Kendin dene 2 "temizlenen pay" → "ilerleme payı"; cevap uyarlandı | uygulandı
R042 | TR5:310 | Teknik kutu: tek adım xₜ = √(1−βₜ)xₜ₋₁ + √βₜ εₜ; toplu biçim xₜ = √ᾱₜ x₀ + √(1−ᾱₜ) ε, ε ~ N(0, I), ᾱₜ = Π(1−βₛ); kayıptaki ε toplu gürültü; sayaç yalnız görsel benzetme, yüzde ilerleme ≠ temizlenen gürültü | uygulandı
R042 | EN5:259, 268, 272, 286, 288, 290, 298; A5:19 | Aynı değişiklikler İngilizce | uygulandı
R042 | figür | Şekil 5.6 alt etiketi "temizlenen pay (%)" / "cleaned share" (strings/M05.mjs diffuse.under, mdHead) "ilerleme (adım/8)" olmalı | uygulanmadı: figür ajanı, nota yazıldı
R043 | TR5:316 | Basit: "Defter dolunca en eski satırlar silinir" → "ne olacağını kullanılan sistem belirler: hata verir, kırpar ya da özetler" (SOURCE-CHANGES) | uygulandı
R043 | TR5:318 | Basit: gösterim son sekiz kelimeyi tutan temsili kayan pencere; gerçek uygulamalar hata/kırpma/özetleme (SOURCE-CHANGES) | uygulandı
R043 | TR5:325 | Kurulum: kayan pencere şekle özgü kural; gerçek sınır token | uygulandı
R043 | TR5:343 | Adım adım: taşma politikası uygulamanın seçimi; "pencerede olmak tam hatırlama garantisi değil" | uygulandı
R043 | TR5:345 | Ne oluyor (basit): "belli sayıda token"; "bu gösterimde"; hata/kırpma/özetleme (SOURCE-CHANGES) | uygulandı
R043 | TR5:347, C5:22 | Kendin dene 3: "iki çözüm" → "üç seçenek (hata verme, kırpma, özetleme)"; cevap uyarlandı | uygulandı
R043 | TR5:355, 357 | Teknik Ne oluyor "son N token'ı hatırlar … kırpılır" → "bu gösterim … kayan pencere; gerçek uygulama hata/kırpma/özetleme" (SOURCE-CHANGES); teknik ek "taşma politikası sistemin seçimi" | uygulandı
R043 | EN5:304, 306, 313, 331, 333, 335, 343, 345; A5:22 | Aynı değişiklikler İngilizce | uygulandı
R044 | TR5:316 | Basit: "Çünkü işi doğruyu bilmek değil, olası devamı üretmek" → "Akıcı ya da yüksek olasılıklı bir cevap doğru olduğunun garantisi değil; yanlış bilgi zar atılmadan da üretilebilir" (SOURCE-CHANGES) | uygulandı
R044 | TR5:343 | Adım adım: "pencereden düşen bilginin yerine olası devamı üretir" → "eksik bilginin yerine akıcı bir devam üretebilir" | uygulandı
R044 | TR5:351 | Teknik: "olasılıksal üretimin doğal sonucu" → tek nedenli değil; eğitim hedefi ile doğruluk arasında garanti yok; açgözlü çözümlemede de olur; kaynak ve görev doğrulaması yolu; "kaynaklarla temellendirme (RAG)" (SOURCE-CHANGES; dijital YENİ "Modül 6'da" korur) | uygulandı
R044 | EN5:304, 331, 339 | Aynı değişiklikler İngilizce | uygulandı
R045 | TR6:32 | Kurulum: "kalite çubuğu / modelin cevabı" → "tamamlanma göstergesi (şekilde 'kalite' yazar)"; gösterge yalnız parça sayar; cevaplar temsili, model çıktısı değil | uygulandı
R045 | TR6:44, 46, 56–60 | Adım adım: "kalite kuralı" → "göstergenin kuralı; açıklık kontrol listesi, ölçülmüş yanıt kalitesi değil"; tablo sütunları "Gösterge / Temsili cevap"; maddelerde "gösterge"; 5. madde "format kuralı onu garantiye alıyor" → "listeyi tamamlıyor; biçim kuralı garanti değil, talimat" | uygulandı
R045 | TR6:62 | "Her parça kaliteyi kesin yükseltmez: uygun bağlam/biçim yardımcı olabilir, gereksiz ya da çelişkili ayrıntı kötüleştirebilir" | uygulandı
R045 | TR6:64 | Ne oluyor (basit): "kalitesi her parçayla yükselir" → "göreve uygun parçalar çoğu zaman iyileştirir; gereksiz/çelişkili ayrıntı kötüleştirebilir; puan tamamlanma göstergesi" (SOURCE-CHANGES) | uygulandı
R045 | TR6:27 | Kenar notu: "çoğu kötü cevap eksik sorudur" → "kötü cevapların bir kısmı eksik sorudan gelir" (SOURCE-CHANGES) | uygulandı
R045 | TR6:66, C6:4 | Kendin dene 1 "kalite kaç olur" → "gösterge kaç olur"; cevap "gösterge = …, temsili cevap" | uygulandı
R045 | TR6:74, 76 | Teknik Ne oluyor "Kalite ~%40'tan başlar" → "Gösterge …; tamamlanma göstergesi, ölçülmüş kalite değil" (SOURCE-CHANGES); teknik ek "puan tamamlanma göstergesi; cevaplar temsili, model çağrısı yok" | uygulandı
R045 | EN6:32, 44, 46, 56–60, 62, 64, 66, 74, 27; A6:4 | Aynı değişiklikler İngilizce; EN dijital teknik Ne oluyor için SOURCE-CHANGES satırı | uygulandı
R045 | figür | Şekil 6.1 etiketi "KALİTE / QUALITY = 40 + 15·n" (strings/M06.mjs) "GÖSTERGE / INDICATOR" olabilir | uygulanmadı: figür ajanı, nota yazıldı
R046 | TR6:115 | Teknik: "sorguyu gömüye çevirip vektör veri tabanından" → ilgili parçaları arayıp isteme ekler; erişim vektör/anahtar sözcük/hibrit, vektör DB yaygın ama zorunlu değil; kaynak metin ve köken bilgileri erişilebilir kalmalı (SOURCE-CHANGES) | uygulandı
R046 | TR6:117 | Teknik: "Tipik hat … göm → indeksle; en yakın k (semantik arama)" → "Yaygın bir hat … indeksle (gömü ve/veya anahtar sözcük); en ilgili k"; "cevabın kaynağa dayandığı doğrulanmalı" (SOURCE-CHANGES) | uygulandı
R046 | TR6:121 | Teknik ek: gerçek sistemde gömü ya da anahtar sözcük araması; erişim ile model üretimi ayrı adımlar | uygulandı
R046 | TR6:190 | Şekil 6.4 tablosu "Bilgi tabanı": "gömü olarak durur" → "özgün parçalar, metadata ve arama indeksi (gömü ve/veya anahtar sözcük)" | uygulandı
R046 | EN6:113, 115, 117, 184 | Aynı değişiklikler İngilizce; EN dijital teknik Ne oluyor (vector store) için SOURCE-CHANGES satırı | uygulandı
R047 | TR6:91 | Kurulum: "üç hazır soru, belge parçası ve cevap çiftiyle akışı canlandırır; gerçek bir model ya da arama çalıştırmaz" | uygulandı
R047 | TR6:107 | Adım adım: kaynak göstermek doğruluk garantisi değil; dayanma ve kaynağın doğruluğu ayrıca denetlenir; kesin ton tek başına ölçüt değil | uygulandı
R047 | TR6:109 | Ne oluyor (basit): "yalnızca o kaynağa bakarak cevaplar … büyük ölçüde azalır" → "dayanması söylenir; … azalır, ama dayandığı ayrıca denetlenir" (SOURCE-CHANGES) | uygulandı
R047 | TR6:86 | Kenar notu: "önündeki kaynaktan cevaplar" → "cevaplaması istenir" (SOURCE-CHANGES) | uygulandı
R047 | TR6:119, 121, 123 | Teknik Ne oluyor "dayanır" → "dayanması istenir; garanti değil" (SOURCE-CHANGES); teknik ek "hazır çiftler, soru anahtarına göre eşlenmiş, gömü/model çağrısı yok"; köprü "artık doğru konuşuyor" → "daha güvenilir konuşuyor" | uygulandı
R047 | C6:7 | Şekil 6.2 Kendin dene 1 cevabı: atıf desteği, kaynağın doğruluğu, belirsizliği açıklama ölçütleri; kesin ton başarı değil (B078) | uygulandı
R047 | EN6:89, 105, 107, 84, 117, 119; A6:7 | Aynı değişiklikler İngilizce | uygulandı
R048 | TR6:136 | Kurulum: üç adım önceden yazılmış senaryo; şekil gerçek araç çağırmaz | uygulandı
R048 | TR6:150 | "Durma kararı modelindir; kimse bitti demedi" (isFinal çelişkisi) → gerçek ajanda model çıktısı; bu senaryoda üçüncü adım önceden son adım | uygulandı
R048 | TR6:152 | "araç kesin sonuç verir" → "doğru çalıştığı sürece daha güvenilir; araç da bozulabilir"; gerçek ajanda yetki sınırı, adım sınırı, durma koşulu, dış veri talimatı güvenilir komut değil, önemli eylemler onaya bağlı | uygulandı
R048 | TR6:154 | Ne oluyor (basit): "şekildeki üç adım önceden yazılmış senaryo; gerçek ajan araç çağrısını model çıktısına göre seçer" (SOURCE-CHANGES) | uygulandı
R048 | TR6:162 | Teknik: güvenlik maddesi somutlaştırıldı: araç izinleri, dış verideki talimatlar, onay (SOURCE-CHANGES) | uygulandı
R048 | TR6:166 | Teknik ek: isFinal önceden yazılmış, durmaya model karar vermez; yetki/adım/durma koşulu ayrı doğrulanır | uygulandı
R048 | TR6:332 | Kalanlar: "yetki sınırı, tur sınırı ve doğrulama" | uygulandı
R048 | EN6:132, 146, 148, 150, 158, 160, 324 | Aynı değişiklikler İngilizce; EN dijital teknik Ne oluyor için SOURCE-CHANGES satırı | uygulandı
R049 | TR6:172 | Basit: "orkestrasyon; asıl beyin odur" → "orkestrasyon. Cevabı pişiren şef ise modeldir; müdür malzemeyi önüne getirir" (SOURCE-CHANGES) | uygulandı
R049 | TR6:181 | Kurulum: orkestrasyon kutusunun altındaki "model çağrısı" etiketi tarif edildi (basılı Şekil 6.4 modeli etiket olarak gösterir) | uygulandı
R049 | TR6:188–190 | Tablo: orkestrasyon "yöneten katman, modeli çağırır"; yeni satır "Model çağrısı"; bilgi tabanı "özgün parça + metadata + indeks" | uygulandı
R049 | TR6:199, 202, 204 | Akış: 4. adım özgün metin ve kaynak (İK Politikası §4); 7. adım "cuma uygun" → "takvimde boş görünüyor; iznin kesinleşmesi yöneticinin onayına bağlı; izni açmak onaya bağlı araç çağrısı olurdu"; "Akış: istek → erişim → araç → model → çıktı" | uygulandı
R049 | TR6:206 | Ne oluyor (basit): "(asıl beyin)" kaldırıldı, "cevabı üreten model çağrısı" eklendi (SOURCE-CHANGES) | uygulandı
R049 | TR6:208, C6:13 | Kendin dene 3'e "şef"; cevap 2 "yalnız model çağrısı etiketinin arkasındaki model değişir", cevap 3 "şef → model çağrısı" | uygulandı
R049 | TR6:216, 218, 224, 230, 333 | Teknik Ne oluyor "orkestrasyon (asıl beyin)" → "(yöneten katman), model çağrısı" (SOURCE-CHANGES); eşleme tablosu "model çağrısı etiketi"; veri akışı modele (istek, kaynak parçaları + metadata, araç sonuçları → çıktı); kalanlar | uygulandı
R049 | EN6:166, 175, 182–184, 193, 196, 198, 200, 202, 210, 216, 222, 325; A6:13 | Aynı değişiklikler İngilizce; EN dijital teknik Ne oluyor için SOURCE-CHANGES satırı | uygulandı
R049 | figür | Şekil 6.4 dizgileri (strings/M06.mjs arch.parts[1] "Asıl beyin", brain etiketi, modelNote) metinle uyumlu olmalı; dijital mimariye "Model çağrısı (LLM)" demo-kod ajanınca | uygulanmadı: figür/demo-kod ajanı, nota yazıldı
R050 | TR6:17 | 6.1 Teknik: "bilgiyle topraklama" → "kaynaklarla temellendirme (grounding; retrieval-augmented generation)" (SOURCE-CHANGES) | uygulandı
R050 | TR6:115 | 6.3 Teknik: "topraklar (grounding)" → "temellendirir (grounding)" (SOURCE-CHANGES) | uygulandı
R050 | TR6:214, C6:13 | "geri çekilme (fallback)" → "yedek yönteme geçiş (fallback)" (SOURCE-CHANGES; cevaplar da) | uygulandı
R050 | TR6:212, 230, 273, 334 | "korkuluklar/korkuluk" → "koruyucu kontroller (guardrails)" (teknik SOURCE-CHANGES; 6.6 Adım adım ve kalanlar) | uygulandı
R050 | TR6:236 | 6.6 Basit: "fabrikada arızayı kokusundan tanıyor" → "sensör verileriyle olası arızaları önceden tahmin ediyor" (SOURCE-CHANGES) | uygulandı
R050 | TR5:351 | 5.8 Teknik "kaynak temelli üretim (RAG)" → "kaynaklarla temellendirme (RAG)" | uygulandı
R050 | EN6:228 | EN: "grounding/fallback/guardrails" korundu; fabrika örneği "predicts failures from sensor data" (SOURCE-CHANGES) | uygulandı
R050 | sözlük | `print/src/tr/arka/sozluk.md:168` RAG girdisinde "(topraklama)" duruyor; dizin/sözlük eşlemesi R097 sözlük ajanının işi | uygulanmadı: dosya bu ajanın kapsamı dışında, nota yazıldı
R066 | TR5:66 | 5.3 ilk kullanım: "Gömü (embedding) burada sahneye çıkar" → "Vektör gösterimi, kısaca gömü (embedding), burada sahneye çıkar" (SOURCE-CHANGES); sonraki kullanımlar "gömü" (kör değiştirme yok; sözlük girdisi "Gömü (embedding)" ile uyumlu) | uygulandı
R096 | TR6:262–269 | Şekil 6.5 beceri tablosu "Tablodan örnekler (bir örnek birden çok beceriye girebilir)": öneri sistemleri → tahmin; sesli asistan → tanıma + üretme (+özetleme), ajan yalnız araç kullanıp eylemde; örüntü keşfi "beşliye tam oturmayan" satırı; müşteri destek asistanı koşullu ajan | uygulandı
R096 | TR6:271 | "on sekiz örneğin tamamını kapsıyor" → "bu eşleme bir örnek; çoğu uygulama birkaç beceriyi birleştirir" ve açıklamalar | uygulandı
R096 | TR6:240, 273, 321, 335 | "En başarılı uygulamalar" (kenar notu, SOURCE-CHANGES), "yardımcı pilot fikri", sınav 6 kökü (SOURCE-CHANGES) ve kalanlar "bu kitabın tasarım görüşü" diye işaretlendi | uygulandı
R096 | TR6:275, C6:16 | Ne oluyor (basit): "çoğu uygulama birkaçını birleştirir" (SOURCE-CHANGES); Kendin dene 1 cevabı genişletildi | uygulandı
R096 | EN6:254–263, 232, 265, 267, 313, 327; A6:16 | Aynı değişiklikler İngilizce | uygulandı
— | TR5:480, TR6:370, EN5:457, EN6:359 | REDAKSİYON NOTLARI / EDITORIAL NOTES'a "2026-10-01 düzeltme belgesi" satırı | uygulandı

## Denetim sonuçları (iş sonunda)

- `python3 print/check_style_tr.py`: 45 şekil, 0 sorun (M05 7 şekil 0, M06 5 şekil 0).
- `python3 print/check_style_en.py`: 45 figures, 0 issues.
- `python3 print/check_consistency_en.py 5 6`: Bölüm 5 1 bulgu (önceden var olan, tasarım gereği: Şekil 5.1 kelime/token sayıları TR 8 / EN 1.4, 1.8, 2.75, 6); Bölüm 6 0 bulgu. Yeni eklenen sayılar (0.36/0.64/0.84, 0.34/0.63/0.85, 0.41/0.67/0.86, U = 0.37/0.81/0.12, yüzde 9, 0.028) TR = EN.
- `python3 print/check_verbatim_tr.py`: Bölüm 5 38, Bölüm 6 23 kaynak paragraf birebir değil (önce 12 / 5). Yeni farkların tamamı SOURCE-CHANGES satırlarıyla karşılanıyor; ESKİ metinler book.json ile birebir doğrulandı (TR M05 33, TR M06 20 satır). Basılıda dijital YENİ'den bilinçli ayrılan üç TR paragrafı eski notlarda zaten gerekçeli: 5.5 basit[1] ("Üret'e bas" → "Şekil 5.4'te"), 5.7 Ne oluyor ("Kaydıracı" → "Karelerde"), 5.8 teknik[0] ("Modül 6" → "Bölüm 6").
- `python3 print/check_verbatim_en.py`: Bölüm 5 36, Bölüm 6 20 (önce 15 / 8); aynı şekilde SOURCE-CHANGES ile karşılanıyor (EN M05 32, EN M06 18 satır). Basılıdan daha önce kırpılmış dijital teknik "Ne oluyor" paragrafları (5.2, 5.3, 5.4, 5.5, 5.6, 6.2, 6.3, 6.4, 6.5) için de düzeltilmiş YENİ metin yazıldı; bunlar yalnız dijitale gider.

## Başka ajanlara devredilen noktalar

1. Figür ajanı (`print/figures/strings/M05.mjs`, `gen/M05.mjs`): Şekil 5.4 alt sıra etiketi "Örnekleme, T = 1.5" ve seçimler artık/yaygın/gelişiyor (EN already/creates/fast); Şekil 5.5 veri satırı "İnsan tercihleri (tercih çiftleri)"; Şekil 5.6 alt etiket "ilerleme (adım/8)"; Şekil 5.3 altyazısındaki "zamir kediye bakıyor" ifadesi.
2. Figür ajanı (`strings/M06.mjs`): Şekil 6.1 "KALİTE/QUALITY" → "GÖSTERGE/INDICATOR"; Şekil 6.4 orkestrasyon "Asıl beyin" → "Yöneten katman", bilgi tabanı açıklaması "özgün parça + metadata + indeks".
3. Demo-kod ajanı: SOURCE-CHANGES satırlarını dijitale uygular; 5.4 demosu hazır iki yol kalırsa R040 dijital düzeltme cümlesi ("gerçek sıcaklık örneklemesi yapmaz") demoya ait kalır, basılı metin gerçek hesabı veriyor.
4. Sözlük ajanı (R097): `sozluk.md` RAG girdisi "(topraklama)" → "kaynaklarla temellendirme (grounding)"; "yedek yönteme geçiş (fallback)", "koruyucu kontroller (guardrails)" ve "vektör gösterimi / gömü (embedding)" eşlemesi dizin ve sözlükte.
5. Sayı biçimi kararı: görev metnindeki "T = 1,5" yerine R095 ondalık nokta kuralıyla "T = 1.5" yazıldı; figür etiketi de aynı olmalı.
6. Şekil 5.4 bloğu, örnekleme tablosu eklendiğinden 250–400 kelime ölçüsünü aşıyor (yaklaşık 470 kelime TR); R040 kabul testi (softmax z/T yeniden hesaplanmalı) gereği bilerek bırakıldı.
