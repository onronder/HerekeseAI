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
