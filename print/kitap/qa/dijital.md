# Dijital kitap (web) TR + EN — yayın öncesi kalite denetimi

**KARAR: DÜZELTME GEREKİR** — tek bir yayın engeli var (A-1: TR 2.5 demosunun "Ne oluyor?" metni yerine redaksiyon notu görünüyor); onun dışında iki sürüm de teknik olarak sağlam, build'ler güncel, TR↔EN yapı birebir.

Tarih: 2026-09-30 · Denetlenen: `Atlas-Kitap.dc.html`, `Atlas-Kitap-EN.dc.html`, `dist/web/{index,en}.html`, `dist/gated/book-{tr,en}.html`, `dist/tek-dosya/*.html`, `store/demo/demo{,-en}.html`, `store/d/*.html` (45 TR) + `store/d/en/*.html` (45 EN), `print/src/{tr,en}/book.json`. Hiçbir kaynak dosya değiştirilmedi; git komutu çalıştırılmadı.

---

## A — Yayın engeli

### A-1 · TR 2.5 "Hangi yaklaşım?" demosu: "Ne oluyor?" (Teknik) kutusunda redaksiyon notu yayınlanıyor

Görünür metin (Teknik modda, demo altındaki "Ne oluyor?" kutusu):

> `(basılı sürümde silindi: 2.6 teknik[0] ve teknik[1] aynı içeriği zaten taşıyor; dijital sürümde kalabilir)`

Nerede:
- `Atlas-Kitap.dc.html:1199` → `neOluyor:'(basılı sürümde silindi: …)'`
- `dist/web/index.html:1199`, `dist/gated/book-tr.html:1789`, `dist/tek-dosya/Herkes-Icin-Yapay-Zeka-TR.html:1789`
- QR tek-demo sayfası `store/d/330f95d0cf.html` ("Şekil 2.5 · Hangi yaklaşım?") — basılı kitaptaki QR'dan gelen okur bu notu görüyor (headless Chrome'da doğrulandı: 106 karakterlik bu metin render ediliyor).
- `print/src/tr/book.json:541` (export bunu "gerçek" metin sanıyor).

Kök neden: `print/src/tr/M02-kurallarin-cagi.md:333` satırı `ORİJİNAL ||| NOT` biçiminde; sağ taraf bir editör notu ama senkron aracı `|||` sağını "web'e yazılacak yeni metin" olarak aldı. Satırın sol tarafı (orijinal web metni):

> `Bu, YZ’de yöntemsel bir gerilimdir: ilkeli/kanıtlanabilir yaklaşımlar (neat: mantık, olasılık) ile ampirik/mühendislik-odaklı yaklaşımlar (scruffy). Klasik YZ’nin duvarı: bilgi edinme darboğazı ve kırılganlık.`

EN karşılığı sağlam: `Classical AI’s wall, in two words: the knowledge-acquisition bottleneck and brittleness.`

Öneri: `Atlas-Kitap.dc.html:1199`'daki `neOluyor` değerini orijinale (ya da EN ile paralel kısa hâline: "Klasik YZ’nin duvarı, iki kelimeyle: bilgi edinme darboğazı ve kırılganlık.") geri al; `M02-kurallarin-cagi.md:333`'teki `|||` sağını sil ya da notu `<!-- -->` yorumuna taşı (aynı tuzağın tekrarını önlemek için); sonra dist/web + gated + tek-dosya + `store/d/330f95d0cf.html` yeniden üret ve `print/export.py` ile book.json'u tazele.

---

## B — Düzeltilmeli

### B-1 · EN 3.2 "Which kind of learning?" teknik paragrafı basılı şekil numarasına gönderme yapıyor

`Atlas-Kitap-EN.dc.html:1231` (M3.2 `turler` teknik[1], son cümle):

> `… Sort the tasks of Figure 3.2 into the three core types.`

TR karşılığı ekran fiiliyle doğru: `Aşağıdaki görevleri üç temel türe ayır.` Web'de "Figure 3.2" diye bir etiket yok; okur neyi kastettiğini bulamaz. Aynı cümle `dist/web/en.html:1231`, `dist/gated/book-en.html:1821`, tek-dosya EN ve book.json EN'e taşınmış durumda.

Öneri: `Sort the tasks below into the three core types.` (sync-report-en'deki TAŞINAMADI kayıtlarında aynı ilke uygulanmış: "watch the bars below", "The demo below shows" — bu satır o filtreden kaçmış.)

Not: book.json'da "Şekil N.j / Figure N.j / kâğıt üstünde / basılı" taraması yalnız bu satırı ve A-1'i yakaladı; şablon metninde (HTML satır 1–1031) basılıya özgü ifade yok. EN'de "on paper" geçen iki yer (Turochamp'ı elle hesaplama, Turing makinesinin elde taşıması) içerik, gönderme değil — sorun yok.

---

## C — Kozmetik

### C-1 · Kapanış ipucu (M8.5 `sorumluluk` tip): EN'de 🌱 var, TR'de yok
- TR (`Atlas-Kitap.dc.html:1546`): `… O gelecek üzerinde söz hakkın var.`
- EN (`Atlas-Kitap-EN.dc.html:1546`): `… You have a say in that future. 🌱`
Öneri: iki sürümü eşitle (emoji ya ikisinde ya hiçbirinde).

### C-2 · EN 1.2 "Ne oluyor?" metninde ASCII üç nokta ve boşluk
- EN: `Each bit represents 128, 64, 32, ... from left to right.` (`Atlas-Kitap-EN.dc.html`, M1.2 `dusunmek` demo.neOluyor)
- TR: `… 128, 64, 32, … değerlerini temsil eder.` (tipografik …)
Öneri: `32, … from` ya da `32 … from`. (Tarama: TR/EN book.json'da " ," veya "  " içeren başka paragraf yok; bu tek satır " ." kalıbıyla yakalandı.)

### C-3 · Her sayfa açılışında 58 konsol hatası (şablon SVG öznitelikleri)
Tarayıcı, `support.js` şablonu devralmadan önce ham `<svg>` şablonundaki 13 bağlı elemanı ayrıştırırken `Error: <line> attribute x1: Expected length, "{{ scLine.x1 }}"`, `<path> attribute d: Expected moveto path command ('M' or 'm'), "{{ lossPath }}"` vb. 58 hata basıyor (TR, EN ve tüm QR sayfalarında aynı 58; gezinme/tıklama sonrası **yeni hata sıfır**). Okura görünmez, işlevi etkilemez; yalnız geliştirici konsolu kirleniyor. Öneri (isteğe bağlı): SVG şablonunda `x1="{{…}}"` yerine `data-x1` gibi geçici öznitelik + `support.js`'de eşleme, ya da olduğu gibi bırakıp bilinen-gürültü olarak not etmek.

### C-4 · `book.json` `embedded` sözlüğü: TR'de 26, EN'de 25 anahtar (`generate` EN'de yok)
`print/export.py:137 embedded_texts()` 18 karakterden kısa dizeleri eliyor; `'Creativity: High'` (16) elenirken `'Yaratıcılık: Yüksek'` (19) kalıyor. Dijital kitabı etkilemez, yalnız basılı "demoya gömülü metinler" listesinde EN tarafında bir satır eksik. Öneri: eşik 14'e çekilebilir ya da görmezden gelinebilir.

### C-5 · Nokta ile bitmeyen paragraflar (bilinçli madde imleri, işlem gerekmez)
- TR M1.2 basit[2]/[3]: `• Makinenin kullanabileceği basit bir alfabe (ikili kod: 0 ve 1)`, `• Net bir adım listesi (tarifin kendisi: algoritma)`
- EN M1.2 basit[2]/[3]: `• A simple alphabet the machine can use (binary: 0 and 1)`, `• A clear list of steps (the recipe itself: an algorithm)`
Liste öğesi oldukları için normal; başka nokta-siz/8 karakterden kısa/boş paragraf yok.

---

## Temiz çıkan denetimler (özet)

**1. Sözdizimi ve çalışma**
- 10 HTML'nin tüm satır içi betikleri `new Function` ile ayrıştırıldı: hepsi OK. `Component` sınıfı örneklendi; 8 modül / 61 bölüm / 45 demo / 8 quiz (50 soru) için `renderVals()` her bölümde **basit + teknik** modda çağrıldı: sıfır istisna (TR, EN, dist/web, gated, tek-dosya; store/demo 1 modül/3 bölüm OK).
- Headless Chrome (puppeteer-core 20.9 + sistem Chrome), `file://dist/web/index.html` ve `en.html`: kapak render (h1 "Herkes İçin Yapay Zekâ" / "AI for Everyone"); 8 modül `#m=N&s=0` hash'iyle açıldı, başlıklar DOM'da; **61 bölümün h2'si ve 45 demo başlığının tamamı** DOM'da bulundu (rastgele 10 yerine hepsi gezildi); her demoda "Ne oluyor?" kutusu basit ve teknik modda dolu (basit: neOluyorBasit, teknik: neOluyor; uzunluklar book.json ile birebir). Her demo bölümünde en az 11, rastgele 10 bölümde (7.5, 6.2, 4.1, 3.5, 7.1, 3.2, 8.1, 2.3, 1.4, 5.1) 21–39 düğme tıklandı: sıfır çalışma zamanı hatası, `support.js runtime error` kutusu hiç çıkmadı. 8 quiz'de seçenek işaretleme + "Cevapları kontrol et"/"Check answers" → skor metni ("2 / 6 doğru" vb.) çıktı. Ağ hatası 0.
- `store/d`: 5 TR (Şekil 6.5, 3.6, 2.4, 7.1, 1.4) + 5 EN (Figure 3.5, 4.5, 5.4, 5.2, 3.2) yerel http ile (`/d/support.js`, `/assets/fonts.css` çözülerek) açıldı: kapak yok, doğrudan demo, "Ne oluyor?" dolu, düğmeler tıklandı, `location.hash='m=0'` denemesi kilitli (`__DEEPLINK_LOCK` çalışıyor), C-3 dışında konsol temiz. Ayrıca 90 sayfanın tamamı Node'da ayrıştırıldı: her biri 1 modül/1 bölüm, `<title>` ↔ demo başlığı ↔ demo türü tutarlı, neOluyor boş olan yok.

**2. Metin kalitesi** (book.json TR 697 + EN 697 metin parçası: basit/teknik/tip/neOluyor/neOluyorBasit/demo başlık-ipucu/quiz)
- `[SİL]`, `[DELETE]`, `[YAZILACAK]`, `[TO WRITE]`, `TODO`, `FIXME`, `yazar baksın`: yok (A-1'deki "basılı sürümde silindi" notu hariç).
- Çift boşluk, `&…;` HTML varlığı, bozuk kodlama (`Ã`, `â€`, `�`), görünür `’`/`\'` kaçışı, HTML etiketi sızıntısı, boş paragraf: yok. (Kaynak JS'teki `’` kaçışları geçerli JS; tarayıcıda doğru ’ olarak render ediliyor — build freshness kontrolü bu yüzden grep değil, çözümlenmiş `modules()` metni üzerinden yapıldı.)
- Sync-report'taki 16 TR + 14 EN "TAŞINDI" ve web-overrides'taki 12 TR + 17 EN kaydın yeni metinleri okundu: bozuk/yarım cümle yok. EN'deki 2 "TAŞINAMADI" (2.4 belirsizlik neOluyorBasit, 4.4 cnn teknik) web'de doğru biçimde ekran fiiliyle kalmış.

**3. TR↔EN yapı eşitliği** (book.json)
- 8/8 modül; bölüm sayıları modül başına 8,7,8,8,9,7,7,7 (=61) her ikisinde; bölüm `id`'leri, demo var/yok ve demo `type`'ları, basit/teknik paragraf sayıları, tip var/yok birebir aynı.
- Quiz: 8/8, soru sayıları 6,6,6,6,8,6,6,6 (=50), seçenek sayıları eşit. Cevap indeksi ayrı alan değil: doğru cevap her zaman `opts[0]` (`renderVals`: `isCorrect = oi === 0`, `_order()` ile deterministik karıştırma). 50 sorunun TR/EN `opts[0]` çiftleri listelendi ve tek tek karşılaştırıldı: hepsi aynı anlam (ör. M4Q3 "Ağ tek bir doğrusal işleve çökerdi" ↔ "The network would collapse into one linear function").

**4. Basılıya özgü ifadeler**: yalnız B-1 (EN "Figure 3.2") ve A-1. Şablonda yok.

**5. Build güncelliği**
- `data-dc-script` gövdesi md5: TR `e4c841e7a6` (193 037 b) kaynak = dist/web/index.html = dist/gated/book-tr.html = tek-dosya TR; EN `1b1f821c0f` (199 905 b) kaynak = en.html = book-en.html = tek-dosya EN. dist/web ile kaynak arasındaki tek fark 33. satırdaki TR/EN bağlantı hedefleri (`./index.html`/`./en.html`) — beklenen.
- Sync-report + web-overrides'taki **29 TR + 29 EN** değişikliğin yeni metni dört tam build'in hepsinde (29/29) var, eski metin hiçbirinde yok. `store/demo/demo.html` (M1 giriş/zekâ/ikili) 3/29, `store/d/*` 10/29 (TR); EN 2/29 ve 5/29 — bu sayfalar kısmi içerik taşıdığı için beklenen; ilgili olanlar (ör. Şekil 1.1 sayfaları `1dbc74d595` / `40ee8a0d04`) yeni neOluyor metnini içeriyor.
- Tüm build dosyaları ve kaynaklar 13:23 damgalı (aynı üretim turu).

---

## Çalıştırılan komutlar (özet)

Betikler scratchpad'de; projeye dosya eklenmedi (bu rapor hariç).

1. `node syntax.js` — 10 HTML'de `<script>` gövdelerini `new Function` ile ayrıştırır; `Component`'i stub `DCLogic` ile örnekler, `modules()` sayar, her bölüm × {basit, teknik} için `renderVals()` çağırır, boş neOluyor arar.
2. `node scan.js` — TR/EN book.json'daki tüm paragrafları tarar (nokta-siz, <8 karakter, çift boşluk, " ,", kaçış/varlık, kalıntı işaretler, HTML sızıntısı, basılıya özgü ifadeler); modül/bölüm/demo/quiz yapısını ve `opts` sayılarını karşılaştırır; HTML'den quiz veri anahtarlarını çıkarır.
3. `node -e …` — 90 `store/d` sayfasını ayrıştırıp `<title>` ↔ `__DEEPLINK` ↔ demo başlığı/türü/neOluyor eşleşmesini listeler; 50 quiz sorusunun TR/EN `opts[0]` çiftlerini döker; `data-dc-script` md5'lerini karşılaştırır; `store/demo` bölümlerini listeler.
4. `node fresh.js` — sync-report-{tr,en}.md (`WEB_ESKİ`/`WEB_YENİ`) + web-overrides-{tr,en}.md (`eski ||| yeni`) kayıtlarını her build'in çözümlenmiş `modules()` JSON'unda arar (yeni var mı / eski kalmış mı).
5. `PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node browser.mjs` ve `browser2.mjs` — puppeteer-core (`print/typeset/node_modules`, ESM girişi) ile headless Chrome: `file://dist/web/{index,en}.html` açılır, konsol/pageerror/requestfailed toplanır, `location.hash` ile 8 modül + 61 bölüm gezilir, demo başlığı ve "Ne oluyor?" metni DOM'dan okunur (basit/teknik düğmeleriyle), düğmeler tıklanır, quiz işaretlenip kontrol edilir; `store/` kökünde geçici http sunucusuyla 5 TR + 5 EN `store/d` sayfası açılıp aynı denetimler ve hash kilidi testi yapılır. Hatalar "şablon-SVG-öznitelik" (yükleme anı, C-3) ve "diğer" olarak sınıflandırılır.
6. `grep`/`sed` — kalıntı işaretler, "Şekil/Figure N.j", "basılı", kaçış dizileri (şablon ve betik ayrı), 🌱 sayımı, `export.py embedded_texts()` filtresi, dosya zaman damgaları (`stat`).
