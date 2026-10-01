# Uygulama raporu: içerik ajanı, Bölüm 7–8 + kapak + kaynakça + yazım kılavuzu (2026-10-01)

Kaynak: `print/kitap/qa/duzeltme-kayitlari.json` (R051–R063, R066, R067, R069, R070, R091, R092, R094, R095, R098).
Dijital HTML'e dokunulmadı; dijitale giden paragraflar her bölüm dosyasının SOURCE-CHANGES bloğunda (ESKİ = book.json birebir; betikle doğrulandı).
Satır biçimi: `R0NN | dosya:satır | yapılan | durum`.

## Bölüm 7 (TR: `print/src/tr/M07-yapay-zeka-ve-toplum.md`, EN: `print/src/en/M07-ai-and-society.md`)

R051 | src/tr/M07:57 | Teknik 7.2 ilk paragraf: yanlılık veri, ölçüm/modelleme tercihleri, kurumsal süreç ve kullanım bağlamından doğabilir; veri dengesi kaynakların yalnız bir kısmını ele alır (SOURCE-CHANGES). | uygulandı
R051 | src/en/M07:57 | Aynı paragraf EN ("Bias can arise from data, measurement and modeling choices, institutional processes, and deployment context … Balancing a dataset addresses only some of these sources"). | uygulandı
R051 | src/tr/M07:29 · src/en/M07:29 | 7.2 kenar notu: "verisi adil olmalı; ama bu yalnız başlangıç; hedefi, ölçütü ve kullanım yerini de insanlar seçer" (SOURCE-CHANGES). | uygulandı
R051 | src/tr/M07:249 · src/en/M07:243 | Sınav 1 "çoğunlukla nereden gelir" → "hangisinden kaynaklanabilir" / "Which of these can be a source of"; şık sırası ve anahtar aynı (SOURCE-CHANGES). | uygulandı
R051 | src/tr/M07:288 · src/en/M07:282 | "Kalanlar" maddesi: ayrımcılık veriden miras kalabilir, veriyi dengelemek tek başına yetmez. | uygulandı
R052 | src/tr/M07:34,36,38,46–49,53 | Şekil 7.1 Kurulum/Adım adım/tablo: fark "yüzde puan"; kural yuvarla(50 + 0.4·e)/yuvarla(50 − 0.4·e) (yuvarlama ilk formülde); e=8 için 53.2/46.8 → 53/47; madde 4 "80 yüzde puan (yüzde 80 değil)"; "sayılar anlatım için seçilmiştir" uyarısı; Kendin dene 1–2 yüzde puan. | uygulandı
R052 | src/en/M07:34,36,38,46–49,53 | Aynı değişiklikler EN; gömülü altyazı alıntıları ("(40% gap)") kaldırıldı, düz anlatıma çevrildi. | uygulandı
R052 | src/tr/M07:59,63 · src/en/M07:59,61 | Teknik 7.2: "temsili olarak gösterir"; gösterim modeli "oyuncak kural: oranlar eğitimden gelmez, formülle atanır; veri dengesi–adalet yasası çıkarılamaz". | uygulandı
R052 | figures/strings/M07.mjs | Figür etiketi "parite farkı N" → yüzde puan: figür/demo ajanının işi; bölüm metni buna göre yazıldı. | uygulanmadı: figür ajanı
R053 | src/tr/M07:69,71 · src/en/M07:67,69 | Basit 7.3: "kara kutuyu camdan kutuya çevirmek" → "kapağını karar karar aralamak"; "Kara kutu böyle beyaz kutuya döner" → "Kapak bir karar için açılır; modelin tamamı yine kapalı kalabilir" (SOURCE-CHANGES; bölüm ve şekil başlıkları kaynak metin, kaldı). | uygulandı
R053 | src/tr/M07:78,80 · src/en/M07:76,78 | Şekil 7.2 Kurulum/Adım adım: birim puan, taban değer 0, karar eşiği 0, katkılar temsili (gerçek modelden hesaplanmadı). | uygulandı
R053 | src/tr/M07:99 · src/en/M07:97 | Borç yorumu: "+32+18 = +50; borç −46 ile +4 kalır, tek başına reddettirmez; −12 ile toplam −8 → ret; borç en büyük eksi katkı, kısa hesap geçmişiyle birlikte artıları aşıyor" (B063). | uygulandı
R053 | src/tr/M07:101,103,113 · src/en/M07:99,101 | Adım 4 / Ne oluyor / teknik Ne oluyor: "kara kutuyu açıyor / beyaz kutuya çevirir" iddiası kalktı; açıklama tek karar içindir, model saydamlaşmaz (SOURCE-CHANGES; EN teknik Ne oluyor basılıdan zaten kırpık, yalnız SOURCE-CHANGES). | uygulandı
R053 | src/tr/M07:111 · src/en/M07:109 | Teknik 7.3: "denge işidir" → "çoğu zaman denge işidir; bu kayıp her durumda zorunlu değildir"; "sayılar hesaplanmış SHAP değerleri değil, temsili katkılar" (SOURCE-CHANGES). | uygulandı
R053+R091 | src/tr/M07:115 · src/en/M07:111 | SHAP paragrafı bütün olarak yeniden kuruldu: karar = onay ⇔ φ₀ + Σcᵢ > 0; φ₀ = 0 örneğe özgü; çıktı ölçeği puan, −8 olasılık değil; f(x) = φ₀ + Σφᵢ (yerel doğruluk); katkılar çıktıyla aynı ölçekte (puan/olasılık/log-odds); 2017 makalesinin üç koşulu (yerel doğruluk, eksiklik, tutarlılık); eski "verimlilik, simetri, sıfır katkı" özeti kalktı; tam/yaklaşık hesap; nedensellik kanıtı değil; sayılar temsili. B064 kayıp metnin dizgisi dizgi ajanında. | uygulandı
R053 | src/tr/cevaplar/M07.md:7 · src/en/answers/M07.md:7 | Şekil 7.2 cevap 1: 10 puan yetiyor çünkü borç −12 ile birlikte reddettiriyordu; katkılar temsili. | uygulandı
R054 | src/tr/M07:147 · src/en/M07:145 | Teknik 7.4: "sentetik medya (deepfake bunun bir türüdür)"; C2PA köken/değişiklik geçmişi için imzalı kayıt, filigran erişimi destekler, hiçbiri olgusal doğruluğu kanıtlamaz, kayıt yokluğu sahtelik kanıtı değil (SOURCE-CHANGES). | uygulandı
R055 | src/tr/M07:123,130,132–139 · src/en/M07:119,126,128–137 | Basit 7.4 ve Şekil 7.3: üç seçenek (gerçek görünüyor / şüpheli: doğrula / belirlenemez); her kart için "şüphe işareti ve doğrulama kanalı?"; "Dört kartta kaç doğru?" puanlaması kalktı; gerçek/yapay ekseni ile doğru/yanlış ekseni ayrıldı; ipucu köken hükmü değil (basit paragraf SOURCE-CHANGES'ta; EN tablo üç sütun). | uygulandı
R055 | src/tr/cevaplar/M07.md:10 · src/en/answers/M07.md:10 | Şekil 7.3 cevapları her kart için seçenek + şüphe işareti + bağımsız doğrulama kanalı; üretim yöntemi ile olayın doğruluğu ayrı puanlanır; "belirlenemez" ne zaman doğru. | uygulandı
R055 | figures/strings/M07.mjs (df.real/fake) | Kart seçenekleri figür/demo ajanının işi; dijital demo da üç seçeneğe geçiyor. | uygulanmadı: figür/demo ajanı
R056 | src/tr/M07:166,184,186,192 · src/en/M07:162,182,184,190 | Şekil 7.4 Kurulum "kitabın öğretici ölçütü; yasadaki sınıflandırma amaca, role ve maddeye göre"; Ne oluyor "sadece şeffaflık / serbest" → "şeffaflık yükümlülüğü / bu yasada büyük ölçüde serbest; kişisel veri ve diğer hukuk kuralları her kademede geçerli"; teknik ilk paragraf "belirli koşullardaki sosyal puanlama", "gerçek kişilerin kredi değerliliği", "dört kademe öğretici bir özettir" (SOURCE-CHANGES). | uygulandı
R056 | src/tr/M07:198 · src/en/M07:194 | Yeni teknik paragraf: (AB) 2024/1689, (AB) 2026/1744 ile değişik 27 Temmuz 2026 konsolide sürümü (erişim 1 Ekim 2026); uygulanma tarihleri (Md.5: 2 Şubat 2025; Md.50: 2 Ağustos 2026; Ek III büyük ölçüde 2 Aralık 2027); Ek III 5(b) dolandırıcılık istisnası; Md.5(1)(h) kolluk amacı ve koşullu istisnalar; Md.50 yükümlülüklerinin tek kural olmadığı ve diğer yükümlülüklerin yerine geçmediği. | uygulandı
R056 | src/tr/cevaplar/M07.md:14–15 · src/en/answers/M07.md:14–15 | Şekil 7.4 Kendini sına: her örnek madde/ek'e bağlandı (Md.5(1)(c), Ek III 4(a), Md.50(1), Ek III 5(b)); "hak etkisi yok" → "verilen bilgilerle bu özel yüksek-risk kategorisi gösterilemiyor"; Kendin dene 1 dolandırıcılık istisnası (belgedeki metin), 2 Md.5(1)(h) kolluk amacı + biyometrik doğrulama/Ek III 1(a) ayrımı + GDPR Md.9; 3 sayım kitabın ölçütüyle. | uygulandı
R057 | src/tr/M07:194,200,202 · src/en/M07:192,196,198 | Teknik 7.5 ikinci paragraf "rıza, …, otomatik kararlara itiraz hakkı" parantezi → "hukuki dayanak, amaç sınırlaması, veri minimizasyonu" (SOURCE-CHANGES); yeni GDPR paragrafı (Md.6(1) dayanakları; Md.22 kapsamı, koşullu istisnalar, insan müdahalesi/görüş/itiraz güvenceleri); ayrı KVKK paragrafı (m.5(2); m.11(1)(g); GDPR Md.22 ile aynı kapsam değil). EN basılıya KVKK paragrafı TR ile eşlik için eklendi. | uygulandı
R058 | src/tr/M07:11 · src/en/M07:11 | Giriş vaatleri ("İşin değişen doğası ve filtre balonu…" / "changing nature of work and filter bubbles") kaldırıldı (SOURCE-CHANGES). | uygulandı
R058 | src/tr/M07:212 · src/en/M07:208 | 7.6 kenar notu "güçlü YZ çağı" → "gelişmiş YZ sistemleri çağı" / "powerful AI" → "highly capable AI systems" (SOURCE-CHANGES). | uygulandı
R058 | src/tr/M07:232 · src/en/M07:228 | Ne oluyor 7.6: "RLHF bunu azaltır ama tümüyle çözmez" → "RLHF bu sorunları azaltabilir, ancak tek başına tam çözüm sağlamaz"; EN "never fully solves" → "can reduce … but is not, by itself, a complete solution"; EN teknik Ne oluyor da SOURCE-CHANGES'ta. | uygulandı
R066 | src/tr/M07:19 · src/en/M07:19 | 7.1 teknik "veri kaynaklı yanlılık ve adalet (fairness)" → "yanlılık (bias) ve adalet (fairness)" (bölümde ilk geçiş; nöron "sabit terim (bias)" ile ayrı) (SOURCE-CHANGES). | uygulandı
R070 | src/tr/cevaplar/M07.md:18 · src/en/answers/M07.md:18 | Şekil 7.5 soru 1: "çöp olmayan eşyayı çöp sayma" kaldı; "kutu dolunca durmak" ve "pencereden atmak" çıktı; yerine dolu kutuyu odanın ortasında/koridorda bırakmak ve atık ayrımı/tehlikeli atık kuralını atlamak; pencereden atmanın doğrudan ihlal olduğu açıkça yazıldı. | uygulandı

## Bölüm 8 (TR: `print/src/tr/M08-felsefe-ve-gelecek.md`, EN: `print/src/en/M08-philosophy-and-the-future.md`)

R059 | src/tr/M08:53 · src/en/M08:55 | Teknik 8.2: "Modern büyük dil modelleri … gevşek sürümlerini geçebiliyor" → "Bazı modeller belirli Turing testi deneylerinde insan katılımcılardan ayırt edilemedi (Jones ve Bergen, 2025); sonuç model, istem ve deney düzenine bağlı; bilinç ya da genel zekâ kanıtı değil" (SOURCE-CHANGES). | uygulandı
R059 | src/tr/arka/kaynakca.md:33 · src/en/back/bibliography.md:33 | Jones, C. R. ve Bergen, B. K. (2025). "Large Language Models Pass the Turing Test." arXiv:2503.23674 eklendi. | uygulandı
R060 | src/tr/M08:34,36,43,63 · src/en/M08:34,36,45,63 | Şekil 8.1: dört yazışma kurgusal (Kurulum); Kendini sına "kurgudaki rol, kesin tanı değil"; ölçütlerden hız çıktı ("kâğıtta cevap süresi görünmüyor"); "tek bir anı ya da doğru hesap kanıt değil"; teknik tablo "Kusursuz, anlık aritmetik" → "Kusursuz aritmetik … bir muhasebecide". | uygulandı
R060 | src/tr/cevaplar/M08.md:7–11 · src/en/answers/M08.md:6 | Şekil 8.1 cevapları "Kurguda makine/insan" biçiminde; her ipucunun karşı örneği; "anında" ölçütü kalktı; kesin tanı yok. | uygulandı
R061 | src/tr/M08:128,154 · src/en/M08:126,150 | Şekil 8.3 Kurulum uyarısı korunup belgedeki ifadeyle güçlendirildi ("kavramlar arasındaki varsayımsal fark; ölçülmüş zekâ puanı ya da AGI'ye ilerleme oranı değil"); teknik "AGI'ye kalan mesafeyi göstermez". | uygulandı
R062 | src/tr/M08:214,216,220,224,240 · src/en/M08:208,210,216,218,232 | Şekil 8.5: "doğru tarafın hücresi / Doğru = uzlaşı" → "ilk incelenecek taraf; hukuk hükmü değil; sorumluluk paylaşılır, ülke/kusur/sözleşmeye bağlı"; Kendini sına "başka kimin payı olabilir"; senaryo 3 "birini aldatmak ya da zarara uğratmak için sahte kanıt üretir"; "sahte içerik üretmek tek başına zarar/kötü niyet değil; kurgu ve sanat da sentetik"; teknik: birden çok taraf pay alabilir. Figür dizgisi (figures/strings/M08.mjs senaryo 3) figür ajanında; dijital demo çoklu seçime geçiyor. | uygulandı (figür dizgisi hariç)
R062 | src/tr/cevaplar/M08.md:24–28 · src/en/answers/M08.md:20 | Şekil 8.5 cevapları "ilk incelenecek aktör" + her senaryoda diğer tarafların payı (ürün sorumluluğu / özen yükümlülüğü / ceza hukuku; üretici-platform payı); kesin hukuk hükmü değil. | uygulandı
R063 | src/tr/M08:226,236 | "duyarlılık/bilinç (sentience)" → "öznel deneyim yaşayabilme kapasitesi (sentience), yani haz ve acı duyabilme"; basit 8.6 "öznel deneyim (haz ve acı duyabilme) ya da bilinç"; "zekâ, bilinç ve öz farkındalık birbirinin yerine kullanılmaz" (SOURCE-CHANGES). | uygulandı
R063 | src/en/M08:220,230 | EN: "sentience, the capacity for subjective experience including pleasure and pain"; "subjective experience (the capacity for pleasure and pain)"; aynı ayrım cümlesi (SOURCE-CHANGES). | uygulandı
R067 | src/tr/M08:265 · src/en/M08:257 | Sınav 4 "en dengeli duruş hangisidir" → "bu kitapta savunulan temkinli yaklaşım hangisidir" / "Which cautious stance on the singularity does this book defend?"; şık sırası aynı (SOURCE-CHANGES). | uygulandı
R067 | src/tr/M08:209,291 · src/en/M08:203,283 | 8.6 kenar notu kitabın tutumunu tutum olarak söylüyor ("insanın karar gücünü artıran ve sonuçları denetlenebilen kullanımları savunuyor"); "teknoloji değil … belirleyecek" → "teknoloji tek başına belirlemeyecek; değerler de belirleyecek" (SOURCE-CHANGES); "Kalanlar" son maddesi aynı yönde. | uygulandı
R067 | src/tr/M08:257 | "Çince'nin zorluğunu" → "Çincenin zorluğunu" (SOURCE-CHANGES). | uygulandı
R069 | src/tr/cevaplar/M08.md:16 · src/en/answers/M08.md:12 | Şekil 8.3 cevap 1 belgedeki metinle: sohbet modeli birçok görevde çalışır, bağlamdaki örneklere uyum gösterir; sabit ağırlık ≠ bağlam içi uyum yokluğu (Brown vd., 2020); bu yetenekler AGI kanıtı değil; AGI sınırı için uzlaşılmış test yok. | uygulandı
R069 | src/tr/M08:119,134,140,288 · src/en/M08:117,132,138,280 | Basit 8.4 "o işin dışına çıkamaz" → "birçok görevde çalışan sohbet modelleri bile insan düzeyinde genel öğrenme göstermez" (SOURCE-CHANGES); tablo Dar YZ satırı; "Bir sohbet modeli…" paragrafına bağlam içi uyum (Brown vd., 2020) ve "uzlaşılmış ölçüt yok"; "Kalanlar" maddesi. Figür tablosu dizgisi (figures/strings/M08.mjs narrow.desc) figür ajanında. | uygulandı (figür dizgisi hariç)
R069 | src/tr/arka/kaynakca.md:32 · src/en/back/bibliography.md:32 | Brown, T. B. vd. (2020). "Language Models are Few-Shot Learners." NeurIPS 33, arXiv:2005.14165 eklendi. | uygulandı
R092 | src/tr/M08:97,99,113 · src/en/M08:97,99,111 | Çince Oda: "cevaplar doğruydu, çünkü kural kitabı doğruydu" → "kurala uygundu, dilbilgisi kusursuzdu; doğru muydu, orası ayrı; saat belki üç değildi"; "LLM bu kitabın devasa sürümü sayılabilir" → "benzetilir; ama ağırlıkları hazır bir cevap tablosu değildir"; teknik paragraf: model cevabı o anda bağlamdan üretir, aynı soruya farklı cevap verebilir, benzetme burada zorlanır. | uygulandı

## Kapak (R094)

R094 | kapak/kapak.json:7 · kapak/kapak.en.json:11 | "Her fikir bir öncekinin duvara tosladığı yerde doğdu" → "Fikirlerin çoğu …" / "Most of these ideas were born …" (en az dokunuş). | uygulandı
R094 | kapak/kapak.json:12–16 · kapak/kapak.en.json:16–20 | author_bio tek anlatıcı: 1. paragraf üçüncü kişi; 2–4. paragraflar "Yazarın sözleriyle: “…”" / "In the author's words: “…”" ile tırnak içinde yazar sözü olarak işaretlendi (metin aynen); 5. paragraf QR cümlesi kaldırıldı, yalnız adres kaldı ("Kitabın etkileşimli dijital sürümü: book.onuronder.com"); QR çağrısı arka metinde tek kez. JSON geçerli. | uygulandı

## Yazım kılavuzu (R095)

R095 | YAZIM-KILAVUZU.md:21–28 | §1'e tek kural: ondalık ayırıcı düzyazıda, tabloda ve formülde nokta (0.55; "yüzde 0.4"); binlik ayırıcı yalnız M01 tablosunda nokta ("2.300"), başka yerde yok; oran farkı "yüzde puan"; kod sabitleri/formül değişkenleri mekanik değiştirilmez; yabancı terim ilk geçişte parantez ("yanlılık (bias)", nöron için "sabit terim (bias)"); şekil ve karşılaştırma başlıklarında "vs" yok, "ile/karşı". Bölüm 7–8'de "vs" yok; Şekil 2.3, 2.6, 4.6 başlıkları ilgili bölüm ajanının işi. | uygulandı (kural); Bölüm 2/4 başlıkları ilgili ajan

## Kaynakça (R098)

R098 | src/tr/arka/kaynakca.md:5 · src/en/back/bibliography.md:5 | Künye biçimi notu: DOI / arXiv / kalıcı adres; mevzuatta madde ve sürüm tarihi; NeurIPS = Advances in NIPS, 2018 öncesi NIPS adı, tek ad kullanıldı; erişim 1 Ekim 2026. | uygulandı
R098 | kaynakca.md:10 · bibliography.md:10 | Turing 1936: "Proceedings of the London Mathematical Society, s2-42(1), 230–265", DOI 10.1112/plms/s2-42.1.230. | uygulandı
R098 | kaynakca.md:22 · bibliography.md:22 | DPO tam başlık: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model", arXiv:2305.18290. | uygulandı
R098 | kaynakca.md:9–25 · bibliography.md:9–25 | Turing 1950, Rumelhart 1986, Hochreiter 1997, Sennrich 2016, Searle 1980, Good 1965 DOI; Krizhevsky 2012 papers.nips.cc adresi; Goodfellow 2014, Vaswani 2017, Ho 2020, Ouyang 2022, Lewis 2020, Yao 2023, Lundberg & Lee 2017 arXiv + DOI; von Neumann 1945 ve Moore 1965 yeniden basım DOI'leri; Vinge 1993 NASA NTRS adresi. | uygulandı
R098 | kaynakca.md:26–29 · bibliography.md:26–29 | Mevzuat: AI Act künyesi konsolide sürüm (27 Temmuz 2026, (AB) 2026/1744 ile değişik), Md.5, 6, 50, 111, Ek III, ELI adresi; GDPR 2016/679 Md.6, 9, 22, ELI; KVKK 6698 (RG 29677, 7 Nisan 2016) m.5, 6, 9, 11, mevzuat.gov.tr; NIST SP 1270 (Schwartz vd. 2022, R051 dayanağı) eklendi. | uygulandı
R098 | — | DOI/URL'lerin erişim testi bu oturumda yapılmadı (ağ erişimi kullanılmadı); yazar/son kontrol tıklayarak doğrulamalı. | kısmen

## Redaksiyon notları

- "2026-10-01 düzeltme belgesi" satırı: src/tr/M07:343, src/en/M07:336, src/tr/M08:326, src/en/M08:318 (REDAKSİYON NOTLARI / EDITORIAL NOTES).
- SOURCE-CHANGES blokları: src/tr/M07:294, src/en/M07:288, src/tr/M08:293, src/en/M08:285. Betikle doğrulandı: bu turda eklenen her ESKİ book.json'daki bir paragraf/sınav metniyle birebir; her YENİ basılıda aynen var, şu bilinen ve notlu farklar hariç: "Aşağıdaki demo" → "Şekil 7.1/7.2" (basılı), yeşil/kırmızı → turuncu/gri (basılı figür rengi), EN basılıdan kırpılan teknik "Ne oluyor" paragrafları, 7.4/8.2 basit "ipucunu kitabın sonunda gör".

## Denetim sonuçları (iş sonunda)

- `python3 print/check_style_tr.py`: 45 şekil, 0 sorun.
- `python3 print/check_style_en.py`: M07/M08 0 sorun (M03 L245, M04 L34/L234'teki uzun cümleler başka ajanların bölümleri).
- `python3 print/check_consistency_en.py 7 8`: Bölüm 7 ve 8'de yalnız "tables: TR 5 vs EN 7" (önceden var; EN Kendini sına tabloları ☐ ile, TR numaralı liste). Şekil 7.1 "only TR: 9" uyarısı giderildi (EN "From 9 percent on").
- `python3 print/check_verbatim_tr.py`: Bölüm 7: 20, Bölüm 8: 7 birebir olmayan paragraf; `check_verbatim_en.py`: Bölüm 7: 22, Bölüm 8: 11. Hepsi ya bu turun SOURCE-CHANGES satırları ya da önceki turda notlanmış farklar (modül→bölüm, ekran fiili uyarlamaları, kırpılan teknik Ne oluyor).
- Teknik 7.5 kutusu 371 (TR) / 445 (EN) kelime; hukuk paragrafları (AI Act sürüm/istisnalar, GDPR, KVKK) yüzünden ~350 kelimelik bir sayfa sınırını aşabilir; dizgi kontrol etmeli (notlara yazıldı).

## Başka ajanlara devredilenler

- Figür/demo ajanı: Şekil 7.1 etiketi "parite farkı N" → yüzde puan; Şekil 7.3 kart seçenekleri (gerçek görünüyor / şüpheli: doğrula / belirlenemez); Şekil 8.3 Dar YZ tablo açıklaması ("o işin dışına çıkamaz" → genel öğrenme yok); Şekil 8.5 senaryo 3 metni (figures/strings/M07.mjs, M08.mjs).
- Dizgi ajanı: B064 (TR s.158–159 SHAP teknik kutusunda kayıp satır) ve 7.5 teknik kutusunun sayfa taşması.
- Demo-kod ajanı: SOURCE-CHANGES bloklarındaki 23 (TR 7) + 6 (TR 8) + 19 (EN 7) + 5 (EN 8) yeni satır; sınav soru/şık metinleri (7.1, 8.4, 8.2 "Çincenin") dahil; opts[0] sırası değişmedi.
- R097 sözlük: "yanlılık (bias)" / "sabit terim (bias)" / "sentience" karşılıkları sözlükle eşlenmeli (sozluk.md'de "Sapma (bias)" nöron maddesi var; kılavuz "sabit terim (bias)" diyor; karar sözlük ajanında).
