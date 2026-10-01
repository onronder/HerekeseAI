# Uygulama kaydı · sözlük ve dizin (R097, R076) · 2026-10-01

Biçim: `R0NN | dosya:satır | yapılan | durum`

## R097 · Sözlük eşitlemesi (bölüm metinleriyle karşılaştırıldı)

Ön not: bağlam penceresi, LLM, BFS, Moore, sıcaklık, RAG, Transformer, üstel büyüme, ince ayar ve çıkarım girişleri bu turdan önce zaten güncellenmişti; bölüm metniyle yeniden karşılaştırıldı ve uyumlu bulundu, değişiklik gerekmedi.

R097 | print/src/tr/arka/sozluk.md:51 | Dar YZ girişine “Dar mı?” ölçütü (kaç iş değil, eğitildiği işlerin dışına çıkabilmek) ve “dar olmak tek bir işe sıkışmak demek değildir” eklendi. | uygulandı
R097 | print/src/en/back/glossary.md:162 | Narrow AI girişine “Is it narrow?” ölçütü ve “being narrow does not mean being confined to one task” eklendi. | uygulandı
R097 | print/src/tr/arka/sozluk.md:54 | Deepfake girişine tespitin kesin “gerçek/sahte” hükmü vermediği, ipucunun incelemeye götürüp kararı bağımsız doğrulamanın verdiği ve üretim ile olay doğruluğunun ayrı sorular olduğu eklendi (7.4 ile aynı). | uygulandı
R097 | print/src/en/back/glossary.md:81 | Deepfake girişine aynı anlam eklendi: kesin “real or fake” hükmü yok, ipucu incelemeye, bağımsız doğrulama karara götürür. | uygulandı
R097 | print/src/tr/arka/sozluk.md:138 | Markov girişine “kararlı dağılımın var olması tek başına yakınsama demek değildir” yakınsama koşulu eklendi (2.5 teknik). | uygulandı
R097 | print/src/en/back/glossary.md:156 | Markov chain girişine “the existence of a stationary distribution alone does not imply convergence” eklendi. | uygulandı
R097 | print/src/tr/arka/sozluk.md:237 | Yinelemeli sinir ağı girişine hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ) formülü ve “yinelemeli (recurrent)” adının kaynağı eklendi (4.6). | uygulandı
R097 | print/src/en/back/glossary.md:186 | Recurrent neural network girişine aynı formül ve “recurrent” adının kaynağı eklendi. | uygulandı
R097 | print/src/tr/arka/sozluk.md:153 | Önyargı girişinde “Toplumsal anlamda bias” → “Toplumsal anlamda yanlılık (bias)” yapıldı ve istatistiksel yanlılık için Yanlılık-varyans dengesine gönderme eklendi (R066: sabit terim / yanlılık ayrımı). | uygulandı
R097 | print/src/en/back/glossary.md:42 | Bias (social) girişine istatistiksel anlam için Bias–variance tradeoff gönderme eklendi; nöron için Bias term (neuron) göndermesi korundu. | uygulandı
R097 | print/src/tr/arka/sozluk.md:213 | Uzman sistem girişine “bir sistem bunlardan birini ya da ikisini kullanabilir” eklendi; ileri zincirlemeye indirgenmediği açıklaştı. | uygulandı
R097 | print/src/en/back/glossary.md:96 | Expert system girişine “a system may use either or both” eklendi. | uygulandı
R097 | print/src/en/back/glossary.md:12 | Agent girişindeki yasak “just” kaldırıldı (“does not stop at talking”). | uygulandı
R097 | print/src/en/back/glossary.md:120 | Generative AI girişindeki “just” → “only” yapıldı. | uygulandı
R097 | print/src/en/back/glossary.md:204 | Stored-program principle girişindeki “just like data” → “the same way as data” yapıldı. | uygulandı

## R076 · Dizin: kavram bağlamı

R076 | print/src/tr/arka/dizin-terimler.yaml:3 | Başlık yorumuna `!hariç` / `!bölümler` sözdizimi ve uzun çekimli takma adlardan kaçınma ilkesi yazıldı. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:33 | Dikkat için gündelik “dikkat:”, “dikkat et”, “hız ve dikkat” kalıpları dışlandı, terim Bölüm 5 ve 7 ile sınırlandı; dizin artık 5.1, 5.4, 5.8, 5.9, 7.3 (2.3/3.5/4.2 gündelik uyarıları ve 6.6/7.4/8.4 düştü). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:87 | Uzman sisteme “uzman sistemler” takma adı eklendi; 2.1 giriş anışları ve 2.6 düzenliler/dağınıklar alıştırması dışlandı; dizin 2.3 (asıl anlatım, “uzman sistemler denir”) ve 2.7 özeti gösteriyor. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:9 | Ağırlık, “Ağırlık (sinir ağı)” adıyla Bölüm 3–8 ile sınırlandı; 1.3 ikili basamak değeri artık bu girişe düşmüyor. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:18 | İkili sayının basamak ağırlığı için ayrı “Basamak değeri (ikili gösterim)” girişi eklendi (yalnız Bölüm 1; dizin 1.3). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:70 | Bölüm metinlerinde artık geçmeyen “Sapma: ['bias']” girişi kaldırıldı; nöron anlamı için “Sabit terim (bias)” girişi (yalnız Bölüm 4; 4.1–4.4, 4.8) kondu. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:92 | İstatistiksel yanlılık için ayrı “Yanlılık (istatistiksel)” girişi eklendi (yalnız Bölüm 3; 3.7). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:98 | Önyargı (algoritmik yanlılık) takma adları boşaltıldı ve Bölüm 5–8 ile sınırlandı; 3.7’deki istatistiksel “yanlılık” artık bu girişe düşmüyor (5.8, 7.1, 7.2, 7.7). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:97 | “Özyinelemeli sinir ağı (RNN)” girişi bölüm terimine uyarak “Yinelemeli sinir ağı (RNN)” oldu; takma ad “yinelemeli sinir ağları”. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:12 | Ajan, LLM ajanı anlamına uyarak Bölüm 6–8 ile sınırlandı (3.8 pekiştirmeli öğrenme ajanı düştü). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:38 | Etiket Bölüm 3 ve 5 ile sınırlandı (6.5 arayüz etiketi ve 7.2 şekil etiketi düştü). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:55 | Kayıp Bölüm 3–5 ile sınırlandı (7.3’teki gündelik “kayıp” düştü). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:74 | Sezgisel için “mühendislik-odaklı” sıfat kullanımı (2.6 dağınıklar) dışlandı. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:77 | Sınıflandırma için 7.5’teki hukuki risk sınıflandırması dışlandı. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:79 | Sorumluluk için 7.1’deki gündelik “sorumluluk da büyüyor” dışlandı. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:30 | Depolanmış-program ilkesine “depolanmış program / depolanmış-program” takma adları eklendi; giriş dizine yeniden girdi (1.1, 1.5, 1.7, 1.8). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:36 | Düzenliler ve dağınıklara “düzenliler”, “neats” takma adları eklendi; giriş dizine yeniden girdi (2.6 asıl anlatım, 2.7). | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:17 | Bağlam penceresi denetlendi: çapa terimin geçtiği konuma konuyor (5.8’de “bağlam penceresi: Modelin elinde…”); değişiklik gerekmedi. | uygulandı
R076 | print/src/tr/arka/dizin-terimler.yaml:63 | Önyargı/Ön eğitim sırası denetlendi: sıralama kod tarafında (assemble.py tr_key boşluğu harflerden sonra sıralıyor), YAML ile düzeltilemiyor. | uygulanmadı: assemble.py bu ajanın dosyası değil; öneri aşağıda
R076 | print/src/tr/arka/dizin-terimler.yaml:116 | ChatGPT ve GPT girişleri hiçbir bölümde geçmediği için dizinde görünmüyor (önceden de böyleydi). | kısmen: yazar kararı (sil ya da metinde kullanım ekle)
R076 | print/src/en/back/index-terms.yaml:3 | Başlık yorumuna seçenek sözdizimi yazıldı (seçenek anahtarları assemble.py’nin okuduğu gibi Türkçe: `!hariç`, `!bölümler`). | uygulandı
R076 | print/src/en/back/index-terms.yaml:18 | Attention: takma adlar boşaltıldı (çapa 5.4’te asıl açıklamaya, “The attention mechanism teaches…”, düşüyor); “pay attention”, “speed and attention” dışlandı; Bölüm 5 ve 7 ile sınırlandı (5.1, 5.4, 5.8, 5.9, 7.3). | uygulandı
R076 | print/src/en/back/index-terms.yaml:45 | Expert system için 2.1 giriş anışları ve 2.6 alıştırması dışlandı; dizin 2.3 ve 2.7. | uygulandı
R076 | print/src/en/back/index-terms.yaml:99 | Weight, “Weight (neural network)” adıyla Bölüm 3–8 ile sınırlandı; 8.6’daki gündelik “weight in today’s … debate” dışlandı; “weighted sum” takma adı kaldırıldı. | uygulandı
R076 | print/src/en/back/index-terms.yaml:75 | TR ile eş “Place value (binary)” girişi eklendi (yalnız Bölüm 1; 1.3). | uygulandı
R076 | print/src/en/back/index-terms.yaml:22 | “Bias, neuron” sözlükle aynı adla “Bias term (neuron)” oldu, Bölüm 4 ile sınırlandı (4.1–4.4, 4.8). | uygulandı
R076 | print/src/en/back/index-terms.yaml:24 | Bias, social girişine “bias/biases” takma adı verilip Bölüm 5–8 ile sınırlandı; önceden yalnız 7.7’yi buluyordu, artık 5.8, 7.1, 7.2, 7.7. | uygulandı
R076 | print/src/en/back/index-terms.yaml:26 | İstatistiksel anlam için ayrı “Bias, statistical” girişi eklendi (yalnız Bölüm 3; 3.7). | uygulandı
R076 | print/src/en/back/index-terms.yaml:37 | Context window’a “context windows” takma adı eklendi (5.4); çapa terimin kendisine konuyor. | uygulandı
R076 | print/src/en/back/index-terms.yaml:10 | Agent Bölüm 6–8 ile sınırlandı (3.3, 3.8 pekiştirmeli öğrenme ajanı düştü). | uygulandı
R076 | print/src/en/back/index-terms.yaml:34 | Classification için 7.5’teki “legal classification” dışlandı. | uygulandı
R076 | print/src/en/back/index-terms.yaml:55 | Gradient descent’ten “gradient(s)” takma adları kaldırıldı (3.7 gradient boosting, 4.2, 4.6 vanishing gradients yanlış eşleşmeleri düştü). | uygulandı
R076 | print/src/en/back/index-terms.yaml:58 | Heuristic için “engineering-driven” sıfat kullanımı (2.6) dışlandı. | uygulandı
R076 | print/src/en/back/index-terms.yaml:63 | Label Bölüm 3 ve 5 ile sınırlandı (1.2, 6.5, 7.2, 7.5 gündelik kullanımlar düştü). | uygulandı
R076 | print/src/en/back/index-terms.yaml:67 | Loss Bölüm 3–5 ile sınırlandı (7.3 düştü). | uygulandı
R076 | print/src/en/back/index-terms.yaml:79 | Prompt engineering’den genel “prompt(s)” takma adları kaldırıldı; dizin 6.1, 6.2, 6.7 (TR ile eş). | uygulandı
R076 | print/src/en/back/index-terms.yaml:80 | RAG’den genel “retrieval” takma adı kaldırıldı (6.6 yanlış eşleşmesi düştü). | uygulandı
R076 | print/src/en/back/index-terms.yaml:90 | Supervised learning Bölüm 3 ile sınırlandı (5.6 “self-supervised” eşleşmesi düştü). | uygulandı
R076 | print/src/en/back/index-terms.yaml:122 | ChatGPT ve GPT hiçbir bölümde geçmediği için dizinde görünmüyor (önceden de böyleydi). | kısmen: yazar kararı

## Kod tarafı notlar (assemble.py; bu ajan düzenlemedi)

- Türkçe sıra: `tr_key` TR_ORDER dışındaki her karaktere 100+ord verdiği için boşluk harflerden sonra geliyor; “Önyargı” “Ön eğitim”den önce çıkıyor. Öneri: `tr_key` içinde boşluğu (ve virgül, tire gibi ayırıcıları) en küçük değere eşlemek, ör. `-1 if c == ' ' else …`.
- Takma ad sırası: `sorted(pats, key=len, reverse=True)` bir küme üzerinde çalışıyor; eşit uzunluktaki takma adların sırası PYTHONHASHSEED’e bağlı. Öneri: `key=lambda p: (-len(p), p)`.
- Alt bölümde en uzun takma ad önce denendiği için çapa ilk geçişe değil en uzun eşleşmeye düşebiliyor; bu turda takma adlar buna göre kısaltıldı. Kalıcı çözüm: alt bölümdeki en erken güvenli eşleşmeyi seçmek.
- B083’teki “Büyük dil modeli 103,103; Regresyon 62,62; Sınıflandırma 62,62” tekrarları aynı sayfaya düşen farklı alt bölüm çapalarından doğuyor; sayfa numarası tekilleştirmesi dizgi aşamasında (print/typeset) yapılmalı.

## Denetim sonuçları

- `python3 print/assemble.py --lang tr` ve `--lang en`: hatasız (TR dizin 95 giriş, EN 100 giriş; ChatGPT/GPT dışında her terimin en az bir konumu var).
- `python3 print/check_style_tr.py`: 0 sorun. `python3 print/check_style_en.py`: 0 issues (iki denetim yalnız bölümleri tarar; sözlükte uzun tire ve “just/exactly/really” elle arandı, kalan yok).
- `check_verbatim_tr.py` 181, `check_verbatim_en.py` 186 fark; `check_consistency_en.py 1–8` 6 sorun: hepsi bölüm dosyalarında, bu işin kapsamı dışında, değişmedi.
