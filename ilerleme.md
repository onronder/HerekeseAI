# Atlas-Kitap.dc.html — İLERLEME DURUMU (devam notu)

## TAM REDAKSİYON TAMAMLANDI ✓ (M0–M8, insanileştirme + okunabilirlik)
Kapsam: ~90K karakter düzyazı, 62 bölüm, 45 demo paneli, 11 dinamik caption, kapak.
- AI-yazım kalıpları temizlendi: "şaşırtıcı kadar" 0, em-dash 45→0 (modül verisi), "Amaç,/Vurgu," 0,
  "kritik" 13→2, "Bu modülde" iskelesi 9→0 (her giriş farklı açılışla), "Kulağa tuhaf gelebilir" 0.
- Basit modda 28+ kelimelik 6 cümle bölündü (artık 30+ kelime = 0).
- Jargon ilk-geçiş kuralı: token/gömü/dikkat/RAG/CNN... hepsi ilk geçtiği yerde Türkçe karşılıkla.
- "NE OLUYOR?" panelleri artık moda duyarlı: 45/45 demoda neOluyorBasit (M1–M2'deki eksik 11 yazıldı);
  mekanizma renderVals'ta zaten vardı, kod değişmedi. Canlıda toggle doğrulandı.
- Buton sözlüğü birleşti: tüm reset butonları "baştan" (10 adet); verdict ayracı "—"→":".
- Kapak sloganı yeniden yazıldı (jargonsuz); kicker'daki em-dash kaldırıldı.
- Teknik mod: formüller ve terimler korundu, yalnızca cümle akışı doğallaştırıldı (kullanıcı kararı).
Doğrulama: node --check temiz; kalıp denetimi tüm hedefler OK; canlı testte (support.js + http-server)
kapak/M1/M5/M8 gezildi, token + turing demoları çalıştırıldı, Basit/Teknik panel değişimi görüldü, konsol hatasız.


## Tamamlanan
- Kapak (derinlik kadranı) + editöryel içindekiler ✓
- Modül 1 (Zekâ ve Makineler) — 8 bölüm + demolar (intelligence, binary, turing, cycle, classify, exp) + quiz ✓ TEST EDİLDİ
- Modül 2 (Kuralların Çağı) — 7 bölüm + demolar (chain, expert, grid BFS/greedy, markov, classify) + quiz ✓ TEST EDİLDİ
- Modül 3 (Makineler Nasıl Öğrenir) — 8 bölüm + demolar (spam, classify3, scatter, kmeans, descent, modelfit) + quiz ✓ TEST EDİLDİ

## Modül 4 (Yapay Beyin) — TAMAMLANDI ✓ (kod bağlandı)
Aşağıdaki 5 KALAN madde uygulandı: state init alanları, resetDemos alanları,
renderVals flag satırı (d_neuron…d_gan), upcoming()'den '04' silindi, modules()'e
Modül 4 data objesi (8 bölüm + neuron/ffnet/backprop/conv/rnn/gan demoları + quiz) eklendi.
Statik doğrulama: node --check temiz; 6 demo şablonu mevcut; şablon değişkenleri ↔ out.* eşleşiyor.
NOT: Canlı demo testi (eval_js_user_view) Claude Design runtime gerektirir — bu ortamda çalıştırılamadı.

## Modül 5 (Bugünün Yapay Zekâsı) — TAMAMLANDI ✓ (sıfırdan inşa)
acc:'#7a3fb0'. 9 bölüm (Giriş, Token, Gömü, Dikkat, Üretim, Eğitim, Difüzyon, Sınırlar, Quiz).
İçerik v2.html derlenmiş bundle'ından STATİK olarak çıkarıldı (canlı scrape yerine; runtime yok):
- Bölüm gövdeleri (basit/teknik) ~408K–427K arası, quiz Ur=[] ~428K, demo hint/metinleri render bileşeninde ~432K.
- Tüm basit/teknik/tip metinleri v2'den birebir; quiz 8 soru (a:0 → correct=opts[0], Atlas ile uyumlu).
7 YENİ interaktif demo sıfırdan yazıldı (şablon + renderVals dalı + state):
  token (tokenizer), embed (anlam haritası SVG), attn (dikkat ısı-hücreleri),
  generate (kelime kelime + sıcaklık), train (3 aşamalı hat), diffuse (gürültü→kalp sürgü), ctx (bağlam penceresi).
Uygulanan bağlama: state init (8 alan), resetDemos (8 alan), renderVals flag satırı (d_token…d_ctx),
7 renderVals dalı, 7 sc-if şablonu (exp sonrası), modules()'e M5 data, upcoming()'den '05' silindi.
Statik doğrulama: node --check temiz; 5 modül; 7 demo şablon değişkeni ↔ out.* tam eşleşiyor;
8 state alanı init+reset'te; 7 demo type'ının hepsi handler'lı.
NOT: Canlı render testi yapılamadı (support.js runtime bu ortamda yok) — demolar M1–M4 kalıplarına
göre yazıldı; Claude Design'da bir kez tıklanarak doğrulanmalı.

## Modül 6 (YZ'yi Kullanmak ve İnşa Etmek) — TAMAMLANDI ✓ (sıfırdan inşa)
acc:'#2a7d86'. 7 bölüm (Giriş, İstem, RAG, Ajanlar, Mimari, Gerçek dünya, Quiz).
İçerik v2 bundle'ından STATİK çıkarıldı; tüm basit/teknik/tip birebir; quiz 6 soru (a:0 → correct=opts[0]).
5 YENİ interaktif demo (tüm veri v2'den birebir, hiçbir detay atlanmadı):
  prompt (istem inşası: 4 parça Rol/Bağlam/Örnek/Format + kalite %40+15n + low/mid/high tatil planı çıktısı),
  rag (3 İK sorusu izin/uzak/harcama; RAG aç/kapat → grounded/ungrounded + kaynak chunk),
  agent (ReAct: pizza görevi + 2 hesap makinesi adımı + final; düşünce→araç→gözlem),
  arch (5 parça: Arayüz/Orkestrasyon/Bilgi tabanı/Araçlar/Bellek, renk kodlu),
  sector (6 alan: Sağlık/Finans/Üretim/Bilim/Sanat/Günlük × 3 örnek).
Bağlama: state init (6 alan), resetDemos (6 alan), renderVals flag (d_prompt…d_sector),
5 renderVals dalı, 5 sc-if şablonu, modules()'e M6 data, upcoming()'den '06' silindi.
Statik doğrulama: node --check temiz; 6 modül; 5 demo şablon değişkeni ↔ out.* tam eşleşiyor;
6 state alanı init+reset'te; 5 demo type handler'lı. Canlı render testi yapılamadı (support.js yok).

## Modül 7 (Yapay Zekâ ve Toplum) — TAMAMLANDI ✓ (sıfırdan inşa)
acc:'#b03a52'. 7 bölüm (Giriş, Önyargı, Açıklama, Deepfake, Düzenleme, Hizalama, Quiz).
İçerik v2 bundle'ından STATİK çıkarıldı; tüm basit/teknik/tip birebir; quiz 6 soru (a:0).
5 YENİ interaktif demo (tüm veri v2'den birebir):
  bias (adalet simülasyonu: sürgü, A=min(95,50+e·.4) B=max(5,50−e·.4), parite farkı),
  explain (XAI: 2 kredi başvurusu, işaretli SHAP-benzeri katkılar, sum>0→onay + Açıkla),
  df (deepfake: 4 durum, gerçek/yapay tahmin + ipucu),
  reg (AB AI Act: 6 kullanım → 4 risk kademesi ban/high/limited/minimal, skor),
  align (hizalama: 3 hedef → belirtim/ödül oyunlama davranışı + ders).
Bağlama: state init (8 alan), resetDemos (8 alan), renderVals flag (d_bias…d_align),
5 renderVals dalı + 3 inverse flag (explainNotShown/dfNotAnswered/alignNotShown temiz UX için),
5 sc-if şablonu, modules()'e M7 data, upcoming()'den '07' silindi.
Statik doğrulama: node --check temiz; 7 modül; şablon değişkenleri (iç içe sc-for + inverse flag dahil) ↔ out.* tam;
8 state alanı init+reset'te; 5 demo type handler'lı. Canlı render testi yapılamadı (support.js yok).

## Modül 8 (Felsefe ve Gelecek) — TAMAMLANDI ✓ (sıfırdan inşa)
acc:'#9a5a1f'. 7 bölüm (Giriş, Turing, Çince Oda, Yetenek, Tekillik, Sorumluluk, Quiz).
İçerik v2 bundle'ından STATİK çıkarıldı; tüm basit/teknik/tip birebir; quiz 6 soru (a:0).
5 YENİ interaktif demo (tüm veri v2'den birebir):
  turing (4 yazışma, insan/makine tahmin + ipucu), chineseroom (3 Çince sembol çifti, kuralı uygula→anlam açığa çıkar),
  capability (3 kademe dar/AGI/süper, durum + cap barı), singularity (3 eğri accel/plateau/uncertain SVG + not),
  responsibility (3 senaryo × 4 taraf, doğru sorumlu + yaygın görüş).
Bağlama: state init (8 alan), resetDemos (8 alan), renderVals flag (d_tur…d_resp),
5 renderVals dalı, 5 sc-if şablonu, modules()'e M8 data, upcoming() artık [] (son modül).
Statik doğrulama: node --check temiz; şablon değişkenleri ↔ out.* tam; 8 state alanı init+reset'te; 5 demo handler'lı.

## ═══════════ KİTAP TAMAMLANDI: 8/8 MODÜL ✓ ═══════════
Kapak + M1–M8, toplam 42 demo tipi, tüm quizler. node --check temiz, 8 modules() objesi, upcoming() boş.
M1–M3 önceki oturumlarda TEST EDİLDİ (Design runtime). M4–M8 sıfırdan/bağlanarak eklendi; statik doğrulama tam,
ANCAK canlı render testi bu ortamda yapılamadı (support.js Design runtime yok). Teslim öncesi Claude Design'da
her modülün her demosu bir kez tıklanarak görsel/etkileşim teyidi önerilir.

## (eski not) Modül 4 (Yapay Beyin) — YARIM KALDI
Bölümler: Giriş, Yapay Nöron, Katmanlar, Geri Yayılım, Görüntü (CNN), Dizi (RNN), Üretim (GAN), Quiz
Demolar: neuron, ffnet, backprop, conv, rnn, gan (6 yeni tip)

YAPILDI:
- Template blokları (neuron/ffnet/backprop/conv/rnn/gan) modelfit sonrası eklendi ✓
- renderVals demo branch'leri (neuron/ffnet/backprop/conv/rnn/gan) exp branch öncesi eklendi ✓

KALAN (Modül 4'ü tamamlamak için ZORUNLU):
1. state init'e yeni alanlar ekle (state = {...} bloğuna):
   neuronX:[0.6,0.3,0.8], neuronAct:'sigmoid', ffIn:[1,0,1], ffFed:false, bpRound:0, convFilter:'vert', convPos:0, rnnStep:0, ganRound:0
2. resetDemos() içine aynı alanların sıfırlamasını ekle (mevcut setState'e):
   neuronX:[0.6,0.3,0.8], neuronAct:'sigmoid', ffIn:[1,0,1], ffFed:false, bpRound:0, convFilter:'vert', convPos:0, rnnStep:0, ganRound:0
3. renderVals flags satırına ekle:
   out.d_neuron = out.d_ffnet = out.d_backprop = out.d_conv = out.d_rnn = out.d_gan = false;
   (mevcut: "out.d_spam = out.d_scatter = out.d_kmeans = out.d_descent = out.d_modelfit = false;" satırının altına)
4. upcoming()'den '04' satırını sil (artık aktif modül)
5. modules() dizisine Modül 3'ün quiz kapanışından ("Kuralları ezberleyerek" opts) sonra Modül 4 data objesini ekle. İçerik aşağıdaki "M4 İÇERİK" bölümünde.
6. show_to_user ile yükle + her demoyu eval_js_user_view ile test et.

## M4 İÇERİK (v2'den birebir çıkarıldı — acc:'#3155c4', dot:'#3155c4', tag:'Derin Öğrenme', title:'Yapay Beyin', subtitle:'Nörondan sinir ağına')

### Giriş — h2:'Yapay beyin: derin öğrenme'
basit[0]: Beynimizde milyarlarca nöron var. Her biri komşularından sinyal alır ve yeterince uyarılınca ateşleyip sinyali bir sonrakine geçirir. Bu basit fikir araştırmacılara şunu sordurmuş: ya bunun çok kabaca bir matematiksel taklidini yapsak?
basit[1]: Yapay sinir ağları işte böyle doğdu. Tek tek «yapay nöronları» katman katman üst üste koyunca ortaya şaşırtıcı kadar güçlü bir öğrenme makinesi çıkıyor. Katman sayısı arttıkça da buna derin öğrenme diyoruz. Bu modülde tek bir nörondan koca bir ağa, oradan da görüntü ve dizi işleyen özel ağlara doğru ilerleyeceğiz.
teknik[0]: Yapay sinir ağları, biyolojik nöronlardan yalnızca gevşek biçimde esinlenir; özünde, katmanlı biçimde düzenlenmiş doğrusal olmayan dönüşümler yığınıdır. Her yapay nöron, girdilerin ağırlıklı toplamına bir sapma (bias) ekler ve sonucu bir aktivasyon fonksiyonundan geçirir.
teknik[1]: Derin öğrenme, çok sayıda gizli katmanın üst üste konmasıdır; bu derinlik, ham veriden giderek soyut temsiller (kenar → şekil → nesne) öğrenmeyi sağlar. Kritik bir not: aktivasyon fonksiyonları olmadan üst üste konan doğrusal katmanlar tek bir doğrusal işleve çöker — doğrusal olmayanlık, derinliği anlamlı kılan şeydir. Alan, 2012'de AlexNet'in ImageNet'teki sıçramasıyla modern çağına girdi.
tip: «Yapay nöron» beynin gerçek bir kopyası değil; çok kaba bir matematiksel benzetmedir. Güç tek bir nöronda değil, milyonlarcasının birlikte oluşturduğu örüntülerdedir.

### Yapay Nöron — h2:'Tek bir yapay nöron' — demo type:'neuron'
basit[0]: Her şey tek bir küçük birimle başlar: yapay nöron. Birkaç girdi alır, her birini bir ağırlıkla çarpar (yani önemini ayarlar), hepsini toplar ve üstüne bir de sapma (bias) ekler. Sonra bu toplamı bir «aktivasyon» fonksiyonundan geçirip çıktısını verir.
basit[1]: Kaydıraçları oynatarak girdileri değiştir; nöronun toplamı nasıl hesapladığını ve ne zaman «ateşlediğini», yani güçlü bir çıktı verdiğini izle.
teknik[0]: Bir yapay nöron z = Σ wᵢxᵢ + b hesaplar; ardından bir aktivasyon fonksiyonu uygular: a = φ(z). Yaygın seçimler sigmoid (0–1), tanh (−1–1) ve ReLU = max(0, z)'dir. Ağırlıklar her girdinin önemini, sapma ise eşiği ayarlar; ikisi de eğitimle öğrenilir.
teknik[1]: Aktivasyonun rolü kritiktir: doğrusal olmayanlık eklemeseydi, kaç katman koyarsak koyalım ağ tek bir doğrusal dönüşüme eşdeğer olurdu. ReLU; basitliği ve gradyan akışını koruması nedeniyle derin ağlarda fiilî standart hâline gelmiştir.
tip: Nöronun yaptığı tek şey: «girdileri tart, topla, bir eşikten geçir.» Bu kadar basit bir işlem, milyonlarca kez tekrarlandığında yüz tanıyabiliyor, metin yazabiliyor.
demo: { type:'neuron', title:'Nöronu çalıştır', hint:'Girdileri (xᵢ) oynat; z = Σwᵢxᵢ + b ve aktivasyon φ(z) değerlerinin nasıl değiştiğini izle.', neOluyor:'z = Σwᵢxᵢ + b, φ(z) sigmoid ya da ReLU ile hesaplanır. Ağırlıklar w = [0.7, -0.5, 0.9], sapma b = -0.3. Aktivasyon eşiği aşarsa nöron ateşler.' }
(NOT: neuron branch weights=[0.7,-0.5,0.9], b=-0.3 zaten kodlu.)

### Katmanlar — h2:'Katmanlar ve ileri besleme' — demo type:'ffnet'
basit[0]: Tek bir nöron tek başına pek bir işe yaramaz. Ama onları katman katman üst üste dizdiğimizde her şey değişir. Sinyaller girdi katmanından çıktı katmanına doğru akar; aradaki «gizli» katmanlar veriyi adım adım daha kullanışlı temsillere çevirir.
basit[1]: Sinyalin girişten çıkışa doğru akmasına ileri besleme deniyor. Girdileri aç/kapat, «İleri besle»ye bas ve sinyalin katmanlar arasında nasıl ilerlediğini, hangi nöronların güçlü tepki verdiğini izle.
teknik[0]: İleri beslemeli ağda her katman, bir önceki katmanın aktivasyonlarını alır: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). Girdi katmanı ham veriyi, gizli katmanlar ara temsilleri, çıktı katmanı ise tahmini taşır. Ağırlık matrisleri ve sapma vektörleri ağın öğrenilen parametreleridir.
teknik[1]: Aşağıdaki demo gerçek bir ileri besleme yapar: sabit ağırlıklarla girdiden çıktıya hesaplama yürütülür ve nöron parlaklıkları aktivasyon değerlerini gösterir. En yüksek çıktı, ağın «tahmini»dir. Eğitim, bu ağırlıkları ayarlama işidir — sıradaki adımın konusu.
tip: Derinliğin sırrı: ilk katmanlar basit özellikleri (kenarlar), sonraki katmanlar onların birleşimini (şekiller, nesneler) öğrenir. Kimse bunu elle programlamaz; ağ kendisi keşfeder.
demo: { type:'ffnet', title:'Canlı sinir ağı (ileri besleme)', hint:'Girdileri aç/kapat ve «İleri besle»ye bas; sinyalin katmanlar arasında nasıl aktığını izle.', neOluyor:'a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾) katman katman hesaplanır; nöron parlaklığı aktivasyon değerini gösterir. En yüksek çıktı ağın tahminidir.' }

### Geri Yayılım — h2:'Geri yayılım: hatadan öğrenmek' — demo type:'backprop'
basit[0]: Ağ en başta rastgele tahminler yapar. Peki kendini nasıl düzeltir? Önce tahminini doğru cevapla karşılaştırıp ne kadar yanıldığını, yani hatayı ölçer. Sonra bu hatayı çıkıştan girişe doğru geriye yayar ve her ağırlığı, hatayı azaltacak yönde azıcık ayarlar.
basit[1]: Bu işleme geri yayılım deniyor. «Eğit»e bas; hatanın geriye doğru aktığını ve ağın çıktısının her turda doğru cevaba nasıl yaklaştığını izle. Hata küçüldükçe geriye akan sinyalin de zayıfladığını göreceksin.
teknik[0]: Geri yayılım, kayıp fonksiyonunun her ağırlığa göre gradyanını zincir kuralıyla verimli biçimde hesaplar; gradyanlar çıkıştan girişe doğru katman katman geriye taşınır. Ardından gradyan inişi ağırlıkları günceller: W ← W − η·∂L/∂W.
teknik[1]: Bu yöntem (Rumelhart, Hinton ve Williams tarafından 1986'da popülerleştirildi) derin ağların eğitilebilmesinin anahtarıdır. Aşağıdaki gösterim, hatanın geriye akışını ve çıktının hedefe yakınsamasını niteliksel olarak canlandırır; gerçek eğitim aynı döngüyü milyonlarca örnekle yineler.
tip: İleri besleme «tahmin et», geri yayılım «hatadan ders al» demektir. Bu iki adımı milyonlarca kez tekrarlamak; derin öğrenmenin bütün büyüsü aslında bundan ibaret.
demo: { type:'backprop', title:'Hatadan öğren (gösterim)', hint:'«Eğit»e bas: hata geriye aksın, çıktı her turda doğru cevaba yaklaşsın. Hata ≈ 0 olunca ağ öğrenmiş demektir.', neOluyor:'Başlangıç: ağırlıklar rastgele, kayıp yüksek. Her «Eğit», zincir kuralıyla ∂L/∂W gradyanını çıkıştan girişe taşır ve W ← W − η·∂L/∂W ile günceller.' }

### Görüntü (CNN) — h2:'Görüntüyü görmek: evrişimli ağlar (CNN)' — demo type:'conv'
basit[0]: Bir görüntü on binlerce pikselden oluşur ve her pikseli ayrı bir girdi saymak çok verimsiz olur. Evrişimli sinir ağları (CNN) daha akıllıca davranır: küçük bir «filtreyi» görüntünün üzerinde gezdirerek yerel desenleri, yani kenarları ve köşeleri arar.
basit[1]: Bir filtrenin görüntü üzerinde adım adım kayışını izle. Her durakta küçük bir bölgeye bakar ve bir «özellik haritası» çıkarır. Filtreyi değiştir; hangi kenarları yakaladığını gör.
teknik[0]: CNN'ler, paylaşılan ağırlıklı evrişim çekirdekleriyle (kernel) yerel örüntüleri tespit eder; çekirdek görüntü üzerinde kaydırılır ve her konumda eleman-yönlü çarpımların toplamı bir özellik haritası üretir. Havuzlama (pooling) ile boyut indirgenir; katmanlar derinleştikçe kenarlardan şekillere, oradan nesnelere doğru hiyerarşik temsiller öğrenilir.
teknik[1]: Ağırlık paylaşımı ve yerel bağlantılılık, parametre sayısını büyük ölçüde azaltır ve öteleme değişmezliği kazandırır. LeNet (LeCun) bu mimariyi öncüledi; AlexNet (2012) ise CNN'leri büyük ölçekte görünür kıldı. Aşağıdaki demo gerçek bir evrişim işlemini gösterir.
tip: Aynı küçük filtre tüm görüntüde kullanılır (ağırlık paylaşımı). Böylece bir kenarı sol üstte de sağ altta da tanıyabilir, üstelik çok daha az parametreyle öğrenir.
demo: { type:'conv', title:'Evrişim: filtreyi kaydır', hint:'Bir filtre seç ve «Kaydır»a bas; filtrenin görüntüde gezinip nasıl bir «özellik haritası» çıkardığını izle.', neOluyor:'Seçili çekirdek görüntü üzerinde 3×3 pencerelerle gezinir; her konumda eleman-yönlü çarpımların toplamı özellik haritasını oluşturur. Dikey kenar çekirdeği dikey sınırları vurgular.' }

### Dizi (RNN) — h2:'Diziyi anlamak: özyinelemeli ağlar (RNN)' — demo type:'rnn'
basit[0]: Metin, müzik, konuşma... Bunların hepsi birer dizidir ve sıraları önemlidir. «Köpek adamı ısırdı» ile «Adam köpeği ısırdı» aynı kelimeleri taşır ama anlamları bambaşkadır. İşte bu yüzden özyinelemeli ağlar (RNN) bir «hafıza» taşır.
basit[1]: RNN diziyi tek tek işler ve her adımda bir gizli durumu, yani hafızasını günceller; böylece geçmişi hatırlayarak ilerler. Kelimeleri sırayla ver ve hafızanın her adımda nasıl değiştiğini izle.
teknik[0]: RNN, her zaman adımında hₜ = φ(Wₕ·hₜ₋₁ + Wₓ·xₜ + b) ile gizli durumunu günceller; aynı ağırlıklar her adımda yeniden kullanılır (zamanda parametre paylaşımı). Bu, değişken uzunluktaki dizileri bir bağlam vektörüyle işlemeyi sağlar.
teknik[1]: Klasik RNN'ler uzun bağımlılıklarda kaybolan gradyan sorunuyla zorlanır; LSTM (Hochreiter & Schmidhuber, 1997) ve GRU bunu kapı (gate) mekanizmalarıyla hafifletir. Çoğu modern dizi görevinde RNN'lerin yerini büyük ölçüde dikkat (attention) tabanlı transformer'lar aldı — sıradaki modülün konusu. Aşağıdaki gösterim, gizli durumun güncellenişini basitleştirilmiş biçimde canlandırır.
tip: RNN'in özü tek bir cümlede: «her yeni girdiyi, o ana kadar gördüklerinin hafızasıyla birlikte işle.» Aynı hücre tekrar tekrar kullanıldığı için diziye «döngüsel» bakar.
demo: { type:'rnn', title:'Hafızalı işleme (gösterim)', hint:'Kelimeleri sırayla ver; her adımda «hafızanın» (gizli durum) nasıl güncellendiğini izle.', neOluyor:'Gizli durum h₀ = 0. Her adımda hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ) ile güncellenir; aynı ağırlıklar her kelimede yeniden kullanılır.' }

### Üretim (GAN) — h2:'Sahteciliğin sanatı: GAN' — demo type:'gan'
basit[0]: Bazen amaç tanımak değil, üretmektir: gerçekçi yüzler, manzaralar, sesler. Üretken çekişmeli ağlar (GAN) bunu zekice bir rekabetle başarır. Ortada iki ağ vardır: Üretici sahte örnekler üretir, Ayırt edici ise gerçeği sahteden ayırmaya çalışır.
basit[1]: İkisi durmadan birbiriyle yarışır; ayırt edici yakaladıkça üretici daha iyi sahteler yapmayı öğrenir. «Tur»a bas ve gürültüden başlayan görüntünün, üretici ustalaştıkça gerçeğe nasıl yaklaştığını izle.
teknik[0]: GAN'lar (Goodfellow vd., 2014) iki ağı çekişmeli (adversarial) bir oyunda eğitir: üretici G, rastgele gürültüden örnekler üretir; ayırt edici D ise gerçek ile üretilen örnekleri ayırmaya çalışır. G, D'yi kandırma olasılığını en üst düzeye çıkaracak; D ise hata yapmamak için eş zamanlı eğitilir.
teknik[1]: Eğitim bir min-maks oyunudur; denge noktasında üretici örnekleri gerçek dağılımdan ayırt edilemez hâle gelir. GAN'lar fotogerçekçi görüntülerde çığır açtı; günümüzde difüzyon modelleri de yaygın bir alternatiftir (Modül 5). Aşağıdaki gösterim bu rekabet dinamiğini basitleştirilmiş biçimde canlandırır.
tip: GAN'ın güzelliği şurada: «iyi sahte üretmek» ile «sahteyi yakalamak» birbirini sürekli iter. Kalpazanla dedektifin yarışı gibi; ikisi de geliştikçe sonuç şaşırtıcı kadar gerçekçi olur.
demo: { type:'gan', title:'Üretici vs Ayırt edici', hint:'«Tur»a bas; gürültüden başlayan görüntünün, üretici ustalaştıkça gerçeğe nasıl yaklaştığını izle.', neOluyor:'Başlangıç: G rastgele gürültü üretir, D bunu kolayca sahte olarak işaretler (sahte olasılığı yüksek). Eğitim min-maks çekişmeli oyununu başlatır; üretici ustalaştıkça sahte olasılığı düşer.' }

### Quiz (correct = opts[0])
1. Bir yapay nöron ne hesaplar? → [Girdilerin ağırlıklı toplamı + sapma, sonra aktivasyon, Sadece girdilerin ortalaması, Rastgele bir sayı, Girdileri olduğu gibi kopyalar]
2. Bir sinir ağını «derin» yapan nedir? → [Çok sayıda gizli katman, Çok hızlı çalışması, İnternete bağlı olması, Tek bir nöronu olması]
3. Aktivasyon fonksiyonu hiç olmasaydı ne olurdu? → [Ağ tek bir doğrusal işleve çökerdi, Ağ daha güçlü olurdu, Hiçbir şey değişmezdi, Ağ daha hızlı olurdu]
4. Geri yayılım ne yapar? → [Hatayı geriye yayıp ağırlıkları hatayı azaltacak yönde günceller, Veriyi siler, Yeni katman ekler, Görüntüyü büyütür]
5. CNN'ler özellikle hangi veride güçlüdür? → [Görüntü, Tablolar, Tek bir sayı, Şifreler]
6. GAN'da çekişen iki ağ hangileridir? → [Üretici ve Ayırt edici, Girdi ve Çıktı, CNN ve RNN, Öğretmen ve Öğrenci]

## KALAN MODÜLLER (5,6,7,8) — henüz çıkarılmadı
v2'yi show_html ile aç, MODÜL N kartına tıkla, alt-sekmeleri scrape et (yukarıdaki async grab fonksiyonu pattern'i ile). Modül başlık/altbaşlık/renk:
- M5: Üretken Çağ / 'Bugünün Yapay Zekâsı' / 'Token'dan dil modeline' / acc:'#7a3fb0'
- M6: Uygulama / 'YZ'yi Kullanmak ve İnşa Etmek' / 'İstemden ajana' / acc:'#2a7d86'
- M7: Toplum / 'Yapay Zekâ ve Toplum' / 'Önyargıdan hizalamaya' / acc:'#b03a52'
- M8: Felsefe & Gelecek / 'Felsefe ve Gelecek' / 'Anlama, bilinç, sorumluluk' / acc:'#9a5a1f'

## scrape fonksiyonu (v2 iframe'de eval_js):
async grab(label): chip(label).click → Basit modu metni + Teknik modu metni; contentEl = h2'den yukarı <6500 char ata. clean() ile baş/son nav metnini temizle. Demo metinleri ve "NE OLUYOR?" içerik gövdesinde gelir.

## EN SÜRÜMÜ + PAKETLEME TAMAMLANDI ✓
- Atlas-Kitap-EN.dc.html: tam İngilizce (8 modül + 45 demo verisi + caption'lar + UI); v2'nin hazır
  EN metinleri temel, TR redaksiyon disiplini uygulandı. TR↔EN üst barda gerçek link.
- build.py → dist/: tek-dosya TR+EN (fontlar+runtime gömülü, ~580KB, 0 dış URL),
  dist/web (index/en/support.js), demo.html (yalnız M1, 2-8 "Tam sürümde" kilitli).
- YAYIN.md: gelir mimarisi (ücretsiz vitrin + Gumroad satışı), GitHub Pages adımları, PWA/mağaza/EPUB yol haritası.
- Not: gizli sekmede rAF render'ı bekletir (test ederken ekran görüntüsü almak sekmeyi görünür kılar); kullanıcıda sorun yok.

## ARKADAŞ GERİ BİLDİRİMİ UYGULANDI + MASALSI BASİT MOD ✓
- Mekanik: kapak virgülü, tırnak/büyük harf düzeltmeleri, ", ama/ancak" kuralı (7 yer),
  ikili-kod bölümü madde listesine çevrildi (arkadaşın önerdiği yapı).
- Binary paneli "neden ilk kutu 128?" sorusunu ikiye-katlama hikâyesiyle cevaplıyor (arkadaşın ana şikâyeti).
- 62 bölümün TÜM Basit anlatımı masallaştırıldı (TR+EN): kek tarifi, kapı bekçisi nöron,
  sisli vadi inişi, lego token'lar, kelime şehri, üç okul, Kral Midas, kartopu tekilliği...
  Teknik mod/quiz/demolar değişmedi; redaksiyon kuralları korundu ("Bir varmış"/"Once upon" 1'er kez, bilinçli).
- gh-pages güncellendi (arkadaşlar linkten yeni sürümü görür). Commit: 909df83 + cb2aed9.

## TDK EDİTÖR OKUMASI TAMAMLANDI ✓ (2026-09-08)
- Tetik: kullanıcı M2'de "cümleleri doğru mahalleye yerleştir"i yakaladı (Türkçede yok) → tüm kitap
  satır satır TDK esaslı okundu (M1–M8 basit/teknik/kurulum/hint/neOluyor/quiz + kapak/şablon/caption'lar).
- Kök neden: masallaştırmada metaforların yönerge cümlelerine sızması + eşdizim/anlatım hataları.
- ~45 düzeltme. Öne çıkanlar: mahalle→kamp (M2, kullanıcının şikâyeti), "öğretmene götür"→"hangi
  öğretmene ait olduğunu bul" (M3), "haberleri kıs"→"girdileri zayıflat" (M4), "kod döküyor"→"üretiyor",
  "difüzyona uğrayacağız"→"difüzyon modellerine uğrayacağız" (M5), "dolandırıcıyı enseliyor"→"yakalıyor"
  (argo), "isteminizi gözden geçirin"→"istemini gözden geçir" (sen/siz tutarlılığı, M6), "Midas'ın cini"→
  "masallardaki cinler" (olgu hatası: cin Midas'ta yok; TR+EN), "çığ gibi patlayıp"→"büyüyüp",
  "kaynakça da doğrulanan"→"kaynağın da doğruladığı" (M7-8), "sezgili"→"sezgisel", "roketleniş",
  "elden çıkıyor", "kalbinde cümle atar", "açık-kapa" vb. (M1-2, önceki partiler).
- Meşru metaforlara dokunulmadı: gömü "kelime şehri/mahalle/komşu" (M5, kurulumu yapılmış betimleme).
- EN dar yansıma: rival neighbourhoods→camps, "right neighbourhood"→"right camp", Midas's genie→genies in old tales.
- Doğrulama: her yama count==1; tüm değişen cümleler ikinci turda yeniden okundu; node --check TR+EN OK;
  canlı önizlemede M2/M3 ekranda teyit; build.py + gh-pages push, canlıda curl ile içerik teyidi.

## EN US-ENGLISH EDİTÖR OKUMASI TAMAMLANDI ✓ (2026-09-08)
- TR'deki TDK okumasının aynası: EN sürümün TÜM düzyazısı (M1–M8 + kapak/şablon/caption) satır satır okundu.
- US yazım dönüşümü: 114 kelime (colour→color, -ise→-ize ailesi, labelled→labeled, defence→defense,
  centre→center, artefacts→artifacts, neighbour→neighbor...) + backwards→backward (7), non-linear→nonlinear,
  fulfils→fulfills, skilful→skillful, memoriser→memorizer, dreamt→dreamed, leftwards→leftward.
- US noktalama: tırnak dışı nokta/virgül içeri alındı (”.→.” 58, ”,→,” 32); CMOS gereği ?,” → ?” (5).
- Britanya sözcükleri: torch→flashlight (3), collars→catches, sit an exam→take, junction→intersection,
  holiday/seaside→trip/beach, adviser→advisor, films→movies, any more→anymore.
- Çeviri kokusu/anlatım: "will show itself", "two stones are needed", "the cycle turns", "pour out code",
  "the case's solved verdict", "watch it all on stage", "keeper keep its tally", "keepers get excited",
  "nobody left to scold"→blame'e bağlandı, "forger ripens"→"masters its craft", "The turn now is",
  "question rises"→arises, "turned to glass"→"into a glass one", "moving symbols"→"shuffling symbols" (2),
  "usta/çırak" çelişkisi (hand the master its tools), bozuk quiz soruları (2), eksik Turing testi adlandırma
  cümlesi eklendi ("He called it the imitation game; today we call it the Turing test.").
- Doğrulama: her yama count==1; değişen tüm cümleler ikinci turda yeniden okundu; node --check OK;
  canlı önizleme (M5) teyit; build + gh-pages push; canlıda curl teyidi.

## SİTEYLE GÖRSEL UYUMLANDIRMA ✓ + KAPSAM DEĞİŞİKLİĞİ (2026-09-08)
- Kitap, onuronder.com'un "Charcoal & Ember" tasarım diline uyumlandı (54a11b2):
  Hanken Grotesk→Work Sans (65 yer + font URL), kapak/panel zeminleri #1a1a1a/#1f1f1f,
  UI altın vurgusu→Ember #e85d3a (kapak italiği, dial, TOC numaraları, seçim, CTA hover+beyaz),
  hairline mürekkep nötrlendi. Instrument Serif, Space Mono, 8 modül renk kimliği ve
  semantik amber paleti KORUNDU. TR+EN kapak ve iç sayfalar canlıda gözle doğrulandı;
  gh-pages yeniden yayınlandı (Work Sans canlıda teyitli).
- build.py: gated_variant (filigran yuvalı satış sürümü) + upload_book.py hazır (dist/gated/).
- KAPSAM: Kullanıcı kararıyla site UI'ı (satış/login/ödeme sayfaları) KULLANICIYA geçti;
  ben yalnız kitabın tasarımından sorumluyum. Site repo'sunda `book-sales` dalı duruyor:
  içinde migration (book_orders/book_entitlements+RLS+private bucket), 4 Edge Function
  (create-checkout, iyzico-callback, book-token, book-content), çeviriler ve örnek UI var —
  kullanıcı kendi sayfasını yaparken malzeme olarak kullanabilir ya da dalı silebilir.
  Supabase'e HİÇBİR ŞEY deploy edilmedi (migration uygulanmadı, fonksiyon/secret yok).

## BOOK.ONURONDER.COM SATIŞ SİTESİ KURULDU (2026-09-08)
- Karar: kalıcı iyzico "Link ile Ödeme" (Sanal POS/API yok) → teslimat elle onaylı
  (/yonetim → grant-book). Supabase: mevcut MyDomain (dtsgewamjkcojffustrg). Hosting: Vercel.
- store/: kitap kapak estetiğinde statik site — index (satış: hero, içindekiler, canlı M1
  demo iframe'i, 3 adım, ₺349 kartı, SSS, yasal linkler), oku (reader), yonetim (admin grant),
  yasal (5 metin), demo/, assets/ (config: IYZILINK_URL null=yakında modu). vercel.json cleanUrls.
- supabase/: migration (book_entitlements+RLS+private bucket), functions book-token /
  book-content (filigran) / grant-book (admin, has_role + Resend bildirimi), config.toml.
- DEPLOY EDİLDİ: 3 fonksiyon canlı, BOOK_TOKEN_SECRET set, 'book' bucket'ı oluşturuldu,
  filigran-yuvalı book-tr/en.html yüklendi. Doğrulanan: satış sayfası + auth (gerçek proje,
  geçici test alıcısı book-e2e-test@example.com / e2eTest!2026 — silinecek), paywall,
  sahte token 401, JWT'siz book-token 401, keysiz storage 400. gh-pages: tam kitap kaldırıldı,
  book.onuronder.com stub'u + demo kaldı.
- KULLANICI ADIMLARI BEKLENİYOR: (1) migration SQL'i Dashboard SQL Editor'da çalıştır,
  (2) Auth → URL Configuration'a book.onuronder.com redirect'i, (3) Vercel'e store/ deploy +
  GoDaddy CNAME, (4) iyzico onayı sonrası iyzilink → store/assets/config.js IYZILINK_URL,
  (5) yasal [KÖŞELİ] alanlar. SQL sonrası kalan E2E: grant → filigranlı okuma → teardown.
- lovable-icin-kitap-sayfasi.md: ana site tanıtım sayfası içerik paketi hazır.

## CANLI E2E TAMAMLANDI ✓ (2026-09-08, akşam)
- Kullanıcı adımları: SQL migration ✓, redirect URL ✓ (Site URL → book.onuronder.com önerildi),
  Vercel deploy + GoDaddy CNAME ✓ → book.onuronder.com CANLI (satış/oku/yonetim/yasal 200).
- SORUN+ÇÖZÜM: Supabase gateway, fonksiyon yanıtlarında Content-Type'ı text/plain+nosniff'e
  zorluyor (anti-phishing; apikey de kaldırmıyor) → kitap iframe.src yerine fetch + iframe.srcdoc
  ile servis ediliyor; book-content'e CORS eklendi. Ayrıca grant-book makbuzu send-email yerine
  Resend API'ye doğrudan gidiyor (mevcut fonksiyon yalnız contact/newsletter tipi tanıyor).
- CANLIDA DOĞRULANDI: geçici admin → grant-book → entitlement (audit alanlı) → alıcı girişi →
  /oku'da kitap filigranla açıldı (e-posta+sipariş görünür), kitap içi etkileşim srcdoc'ta
  çalışıyor, TR→EN geçişi ✓, RLS (alıcı yalnız kendi satırı) ✓. Test kullanıcıları silindi,
  tablo temiz (0 entitlement, mevcut admin rolü korunlu).
- KALAN: iyzico onayı → iyzilink → store/assets/config.js IYZILINK_URL; yasal [KÖŞELİ] alanlar;
  kullanıcının kendi admin hesabıyla /yonetim provası; Lovable tanıtım sayfası (paket hazır).

## LANDING YENİDEN TASARLANDI ✓ (2026-09-08, gece)
- Kullanıcı geri bildirimi: "hero, kapağın kopyası; demo div'i sayfanın kopyası gibi — orijinal
  (kapak) daha iyi." Haklı teşhis: hero tipografisi kapağı taklit ediyordu, altındaki demo
  iframe'i de kapakla açılınca sayfa kendini iki kez gösteriyordu.
- Yeni konsept: "KİTABIN KENDİSİ KARŞILAR" — hero = canlı demo iframe'i (gerçek kapak, çalışan
  kadran; '● Canlı' şeridi + altta satış çubuğu). Mobilde iframe dokunmaya kapalı önizleme +
  "Dokun → tam ekran dene" (scroll tuzağı yok). Kapak tipografisini kopyalayan hero silindi.
- Yeni bölümler: değer + sayı sütunu (45/8/2/2), 24 gerçek demo adından akan şerit (CSS marquee,
  hover'da durur), İçindekiler (korundu), "Aynı fikir · iki derinlik" karşılaştırma kartları
  (kapaktaki gerçek Basit/Teknik içerik), 3 adım, fiyat ızgarası (+ "önce dene" yan sütunu),
  SSS, büyük serif kapanış ("Okumayı elinle yap.").
- store.js kancaları aynen korundu (data-buy, #buy-state, #account-line, auth modal).
- Yerel 1024/375 doğrulandı; Vercel'e push.

## LANDING = KAPAĞIN KENDİSİ ✓ (2026-09-08, gece 2. tur)
- Kullanıcı: "iframe'li div amatörce; kitabın orijinal kapağı zaten landing." Doğru yaklaşım
  uygulandı: kapak (dev serif başlık, kadran paneli, kapak İçindekiler'i) sayfanın KENDİ
  HTML'i olarak birebir native inşa edildi — iframe/çerçeve yok. Kadran gerçek çalışıyor
  (initCoverDial, pointer sürükleme, Basit↔Teknik opacity + mod etiketi).
- Sadeleşme: "Bu kitap nedir", "İki derinlik" bölümü (kadran kapakta), "Üç adım" silindi.
  Akış: Kapak+İçindekiler → demo şeridi → fiyat (+ "ilk iki konu ücretsiz" yanı) → SSS → kapanış.
- Demo kullanıcı kararıyla İLK 2 ALT KONUYA indirildi (Giriş + Zekâ Nedir?): build.py
  demo_variant M1 sections kırpması + kapak metasında "Ücretsiz demo · Tamamı ₺349" → /#satin-al
  linki; build artık store/demo'yu da yazıyor. node --check OK.
- store.js kancaları korundu; data-buy metin mantığı sadeleşti (yalnız sahiplikte "Kitabı Aç").
- Yerel: native genişlik + 1200 ölçümleri + 375 mobil doğrulandı; kadran testi DOM'dan geçti.

## ÇİFT MENÜ + 3 KONULUK DEMO + FİYAT PANELİ + İLK BASIM ✓ (2026-09-09)
- Kitap şablonu (TR+EN): okuma düzeni kenar çubuğuna İKİ menü — "Bölümler" (8 modül, renk
  noktaları, aktif modül accent+bold, tıklayınca modül geçişi) + "Bu Bölümde · n/N" (alt
  konular, aktif vurgulu). renderVals'a modNav (upcoming→kilitli) ve chapList'e
  lockedSections stub desteği; kilit = inline SVG. Tek-dosya/gated/demo build'den miras alır.
- Demo: ilk 3 alt konu açık (Giriş, Zekâ Nedir?, Düşünmek=Hesaplamak); kalan 5 konu kenar
  çubuğunda kilitli (tıklanmaz), M2–M8 de kilitli listede. build.py kesimi babbage'a çekildi,
  kilit başlıkları kaynaktan regex'le (yalnız üst düzey section label'ları) üretiliyor.
- Landing: fiyat bölümü tam genişlik price-panel (630/380 iki sütun: maddeler+dene | ₺349+CTA
  +iyzico notu; 880px altı tek sütun). "İlk iki konu"→"ilk üç konu" metinleri.
- "Sürüm 03 · 8 Bölüm" → "İlk Basım · 8 Bölüm" (TR+landing), "Edition 03" → "First Edition" (EN).
- Doğrulama: node --check TR+EN; tam kitapta menüler+modül geçişi tıklamayla; demoda 12 kilit
  SVG ve kilitli tıklamanın etkisizliği; fiyat paneli ölçümü. Gated TR/EN bucket'a yeniden yüklendi.

## MENÜLER YAN YANA STICKY ✓ (2026-09-09)
- Okuma düzeni kenar çubuğu: "Bölümler" (176px) + "Bu Bölümde" (esnek) YAN YANA, birlikte
  sticky; Okuma Modu üstte. Dış ızgara minmax(280px,412px) 1fr + max-width 1220; dar ekranda
  flex-wrap ile menüler alt alta sarar (eski davranışa zarif düşüş). chapList fontu 13px.
- TR+EN şablon; build ile demo/gated/tek-dosya; gated bucket'a yeniden yüklendi.

## SAYFA KULLANIMI: MARJİNALYA RAYI ✓ (2026-09-09)
- Kullanıcı "sayfa kullanımı kötü gibi" dedi; teşhis: metin 620px'te bitip sütun sağı boş
  kalıyordu, Kenar Notu da akışı bölüyordu. Çözüm klasik kitap düzeni: içerik alanı
  [ana akış ≤660px] + [sağ kenar rayı 232px, sticky] flex'i; KENAR NOTU artık gerçek
  marjinalya (sağ rayda, bölüm boyunca görünür). Konteyner 1220→1400, boşluklar 48/44.
  Dar ekranda ray metnin altına sarar (flex-wrap). TR+EN; demo/gated/tek-dosya build'den;
  gated bucket'a yüklendi. Doğrulama: div dengesi 0, ray sticky+yan yana ölçümü, görsel.

## SSS: YERLEŞİM + REDAKSİYON ✓ (2026-09-09)
- Yerleşim: SSS 680px sol sütundan çıkıp TAM genişliğe yayıldı; iki sütunlu grid (72px ara,
  820px altında tek sütun). Ölü sağ boşluk bitti.
- Redaksiyon (TR, TDK disiplini): "Ödedim —" → "Ödeme yaptım;" (em-dash kalktı); zaman uyumu
  ("açıyoruz ve geliyor" → "açıyor, gönderiyoruz"); eksiltili "en geç 24 saat" tamamlandı;
  "her şeyde" (konuşma dili) → "her cihazda: bilgisayarda, tablette ve telefonda"; "dahil" →
  TDK "dâhil" (kitaptaki şapka tutarlılığı); "ifa başladıktan" (hukuk jargonu) → "erişim
  hesabında tanımlandıktan sonra"; "— tam da bunun için açık" → "; ücretsiz demo tam da bunun
  için var". Cevaplar tam cümlelerle yeniden kuruldu.
- Not: satış sitesi şu an yalnız TR; İngilizce satış sayfası ayrı iş (kitabın EN'i zaten
  US-English redaksiyonundan geçmişti).

## SİTE TAMAMEN İKİ DİLLİ ✓ (2026-09-09)
- Yapı: TR kökte (/), EN /en/ altında (hreflang + x-default çift yönlü; kapak metalarında
  TR↔EN geçiş linkleri). Vercel cleanUrls: /en/, /en/read, /en/legal.
- /en/index.html: tam İngilizce landing — kapak metinleri kitabın redakte EN'inden birebir
  ("AI for / Everyone", "One idea · two depths", kadran cevapları), 8 bölümlük EN İçindekiler,
  24 demo adlık EN şerit, fiyat paneli ("one-time · both languages", TL notu), 6 soruluk
  özenli EN SSS, "Read it with your hands." kapanışı.
- /en/read.html: EN okuyucu (Back/SIGN OUT, varsayılan kitap dili EN); /en/legal.html:
  İngilizce bilgilendirme (bağlayıcı metinlerin Türkçe olduğu açıkça belirtildi; teslimat,
  cayma istisnası, KVKK özeti, kişisel lisans+filigran, iletişim). /yasal ↔ /en/legal karşı linkli.
- store.js i18n: body[data-lang] → TR/EN sözlüğü (auth modalı, buy-state, okuyucu mesajları,
  GİRİŞ/SIGN IN, yönlendirmeler /oku vs /en/read). node --check OK.
- build.py: demo_variant(lang) — EN demo (demo-en.html) EN kitaptan üretiliyor: EN kilit
  başlıkları kaynaktan, EN upcoming tablosu, meta linki regex'le (renk sırası dilde farklıydı).
- Yönetim sayfası bilinçli olarak TR (iç araç).

## FAVICON ✓ (2026-09-09)
- Marka işareti: charcoal yuvarlatılmış kare üzerinde ember, Instrument Serif İTALİK "â"
  ("Yapay Zekâ"nın şapkalı â'sı; iki dilde de nötr). Tarayıcı canvas'ında kitabın gerçek
  fontuyla çizildi (16/32/180/512 PNG + PNG-gömülü favicon.ico); baytlar elle geçilmedi,
  yerel Node alıcısına POST edilerek birebir kaydedildi.
- 7 sayfaya <link rel=icon> etiketleri; demo sayfaları kök /favicon.ico'dan otomatik alır.

## HESAP MODALI: SUPABASE AKIŞLARIYLA YENİDEN ✓ (2026-09-09)
- Dört mod: giriş / kayıt / şifremi unuttum / yeni şifre belirle. Sıfırlama Supabase'in kendi
  akışıyla: resetPasswordForEmail(redirectTo=dil ana sayfası) → e-posta bağlantısı →
  PASSWORD_RECOVERY olayı yakalanıp modal "reset" modunda açılıyor → updateUser({password}).
- Kayıt: Ad Soyad (user_metadata.full_name'e yazılıyor) + e-posta + şifre ×2; istemci denetimi
  (ad soyad boşluk şartı, ≥8, eşleşme) + Supabase hataları düzgün mesaja eşleniyor
  (yanlış bilgi / doğrulanmamış e-posta / kayıtlı hesap / hız sınırı; TR+EN).
- Görsel: eyebrow+serif başlık+açıklama, çerçeveli hata/başarı kutuları, hairline ayraçlı
  bağlantı satırı (Şifremi unuttum · Hesap oluştur), yüklenme durumu, blur'lu zemin.
- Modal içeriği JS'ten dile göre üretiliyor; 5 sayfadaki markup ince kabuğa indi.

## SUPABASE E-POSTA ŞABLONLARI ✓ (2026-09-09)
- eposta-sablonlari/: dogrulama.html (Confirm signup), sifre-sifirlama.html (Reset password),
  eposta-degisikligi.html (Change email) + OKUBENI.md (konu satırları + yapıştırma adımları).
- Supabase tür başına TEK şablon/konu tuttuğu için İKİ DİLLİ tasarım (TR + altında muted EN).
- Palet: kitabın OKUMA sayfası (krem #faf7ef + charcoal marka bandı + ember düğme) — koyu
  zeminli e-postayı Gmail karanlık modu bozduğu için bilinçli; fontlar e-posta güvenli
  düşüşlerle (Georgia/Helvetica/Courier). Tablo düzeni, yalnız satır içi CSS, tek kalıptan
  üretim ({{ .ConfirmationURL }} korunarak, 3'ünde de doğrulandı). Tarayıcıda render kontrolü ✓.
- Kurulum kullanıcıda: Dashboard → Authentication → Email Templates (OKUBENI'de tablo).

## E-POSTALAR DİLE GÖRE TEK DİLLİ ✓ (2026-09-09)
- Kullanıcı Supabase dokümanını işaret etti: şablonlar Go template, .Data=user_metadata,
  koşul ({{ if eq .Data.lang "en" }}) ve konu satırı şablonu destekleniyor → iki dilli
  gövdeden vazgeçildi.
- store.js: kayıtta user_metadata.lang="tr|en" yazılıyor (sayfa diline göre).
- 3 şablon tek kalıptan, dil dalları ayrı kartlar (marka bandı da dilli: "AI for Everyone /
  First Edition"); konu satırları da koşullu (OKUBENI'de hazır). lang yoksa varsayılan TR.
- grant-book makbuzu: dil = parametre > alıcının metadata.lang > TR; EN makbuz linki
  /en/read'e düzeltildi. Fonksiyon yeniden dağıtıldı.

## TR KAPANIŞ DÜZELTMESİ ✓ (2026-09-09)
- "Okumayı elinle yap." (uydurma kalıp; EN 'Read it with your hands.' zorlama aynası)
  kullanıcı yönlendirmesiyle → "Yeni bir okuma deneyimi." ("tecrübe+deneyimleyin" kök
  ikilemesi ve siz-kayması giderilerek). EN kapanış deyimsel olduğu için korundu.

## SİTE GENELİ TR REDAKSİYON TURU ✓ (2026-09-09)
- Kapsam: landing, oku, yönetim, yasal, store.js TR sözlüğü, e-posta TR kartları, demo ekleri.
- Şerit calque'ları: "adımlamak"→"adım adım izlemek" (step-through), "sıcaklığı açıp"→
  "yükseltip" (turn-up), "böldürmek"→"token'larına ayırmak", "gradyan inişiyle inmek" kök
  tekrarı→"Gradyanla sisli vadiye inmek" (kitap imgesi), "ateşlemek"→"tetiklemek" (tırnaksız
  jargon), "hava tahmini"→"havayı tahmin etmek" (liste ritmi).
- "Kararsızsan karar senin elinde" kök yankısı → "Kararsız mısın? İlk üç konu ücretsiz;
  kadranıyla, demolarıyla." (em-dash de kalktı).
- store.js: yönetim etiketi em-dash'i giderildi ("isteğe bağlı iyzico işlem numarası");
  ölü sözlük anahtarları (created/authFailed, TR+EN) temizlendi.
- yasal.html: HUKUKİ DOĞRULUK — "1. bölümünü ücretsiz" → "ilk üç konusunu demolarıyla
  birlikte" (demo kapsamı değişmişti); "dosya indirmesi yoktur" → "alıcıya dosya indirilmez,
  içerik çevrimiçi okunur"; "iletişime rağmen çözülmemesi" eksiltisi → "iletişime geçilmesine
  rağmen sorunun çözülememesi". Kalan em-dash'ler yalnız <title> ayracı + kod yorumu.
- İkinci tur: tüm değişimler dosyadan yeniden okundu; node --check OK.
