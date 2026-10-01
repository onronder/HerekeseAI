# Uygulama kaydı — şekil ajanı, 2. tur (2026-10-01)

Kapsam: `print/figures/gen/M01,M05,M07,M08.mjs`, `print/figures/strings/M01,M03,M05,M06,M07,M08.mjs`, `print/figures/out/tr-baseline/`. `lib.mjs` değişmedi; `print/src` dosyalarına dokunulmadı; git komutu çalıştırılmadı.
Kaynak: içerik ajanlarının "figür ajanına" notları (uygulama-icerik-1-2 / 3-4 / 5-6 / 7-8.md) ve ilgili bölüm dosyalarındaki yeni ifadeler (şekil etiketleri bölüm metniyle birebir).
Üretim: `node print/figures/make.mjs tr` ve `en` → 45 + 45 figür hatasız; `node print/figures/check_i18n.mjs` → temiz; `node print/figures/check_fig_fonts.mjs all` → yeni 6 pt altı etiket yok
(✗ listesi birinci turdakiyle aynı: 2.3 grid, 3.4 kmeans, 6.4 arch "(RAG)", EN 2.1 chain; 5.6 diffuse "n/64" 5 → 6 ile ✗ listesinden çıktı). Değişen 19 TR/EN figür PNG olarak
(render.sh, belge fontları) göz kontrolünden geçti: taşma/çakışma yok; geçici PNG'ler silindi.

## Kayıt satırları

R006 | print/figures/strings/M01.mjs:32,78 | Şekil 1.4: üçüncü kare adı bölüm dosyasındaki tabloyla aynı ("3 · Yaz" / "3 · Write"; 1. turdaki "Kaydet / Yaz" override'ı kaldırıldı, book.json evre adı kullanılır); kare içi vurgu (Bellek tam, İşlemci (yazmaç) yarım, Giriş / Çıkış kesikli + not) aynı. | uygulandı
R006 | print/figures/strings/M01.mjs:35-36,81-82 | Şekil 1.4 .md tablosu 3. satırı print/src/{tr,en}/M01 tablosuyla birebir: "Yazmaç ya da bellek; çıkış talimatında Giriş / Çıkış" + "Sonucu kaydet: …" (EN "Register or memory; Input / Output on an output instruction" + "Save the result: …"). | uygulandı
R065 | print/figures/strings/M03.mjs:6,49 | Şekil 3.2 EN görev 5: `classify.itemOverride[4]` = "Learning to achieve a high score by playing a game" (book.json "Learning a high score …"); TR override boş (book.json görev metinleri bölümle aynı). | uygulandı
R065 | print/figures/gen/M01.mjs:4,188-192 | Ortak classify üreticisi 3. bölüm için strings/M03 `classify.itemOverride` okur (SVG satırı ve .md). | uygulandı
R038 | print/figures/strings/M05.mjs:31-35,126-130 | Şekil 5.3 altyazısı: en koyu hücre sorgunun kendisiyse "en koyu hücre kendi konumu (0.50) · diğerleri arasında en çok “…” (0.30)", değilse "en koyu hücre 0.55 ile “Kedi” · kendi konumu 0.20"; "zamir kediye bakıyor" kalktı; iki not satırı: "temsili, çift yönlü (encoder) tablo · ağırlıklar elle seçildi" / "tek bir dikkat hücresi göndergenin çözüldüğünü kanıtlamaz" (EN karşılıkları). | uygulandı
R038 | print/figures/gen/M05.mjs:199-202 | Altyazıya kendi payı ve (kendisi hariç) en yüksek hücre geçirilir; not satırları basılır (yükseklik +18). Figürde vurgulu sorgu ekran başlangıç durumu gibi "o" (q = 3) olduğundan basılan altyazı ikinci dal: "“o” sorgu: en koyu hücre 0.55 ile “Kedi” · kendi konumu 0.20". | uygulandı
R041 | print/figures/strings/M05.mjs:60,154 | Şekil 5.5 veri satırı "İnsan tercihleri (tercih çiftleri)" / "Human preferences (preference pairs)" (PPO/DPO ayrımına uygun; bölüm tablosuyla aynı). | uygulandı
R042 | print/figures/strings/M05.mjs:81-83,175-177 | Şekil 5.6 alt etiket "her karenin altında: ilerleme (adım/8, %) · çözülen piksel / 64 (ayrı nicelik)" (EN "progress (step/8, %) · resolved pixels / 64 (a different quantity)"); .md başlığı "İlerleme (adım/8)" / "Progress (step/8)". Kare altındaki yüzde = adım/8, "6/64" ayrı satır (aynı). | uygulandı
R082 | print/figures/gen/M05.mjs:349 | Şekil 5.6 "n/64" etiketi 5 → 6 (≈ 6.59 pt); kare genişliğine sığıyor. | uygulandı
R045 | print/figures/strings/M06.mjs:24-33,146-155 | Şekil 6.1: merdiven başlığı "KALİTE = 40 + 15·n" → "GÖSTERGE = 40 + 15·n" (EN "INDICATOR = 40 + 15·n"; bölümün "gösterge/indicator = min(100, 40 + 15·n)" formülüyle aynı sözcük); sağ not sonuna "tamamlanma göstergesidir, ölçülmüş kalite değil" (EN "a completeness indicator, not measured quality"); cevap bloğu başlığı "TEMSİLİ CEVAP · DÜZEYE GÖRE" / "ILLUSTRATIVE ANSWER · BY TIER"; .md sütunları "Gösterge … Temsili cevap", kural satırına tamamlanma/temsili notu. | uygulandı (not: talimattaki EN "COMPLETENESS" yerine bölüm formülündeki "INDICATOR"; başlık sütununa 26 karakter sığar, "COMPLETENESS INDICATOR" sığmaz)
R049 | print/figures/strings/M06.mjs:92-93,99,214-215,221 | Şekil 6.4: orkestrasyon açıklaması "Yöneten katman: istemi hazırlar, …, modeli çağırır, akışı yönetir." (EN "The coordinating layer: …"); kutu altı etiket "asıl “beyin”" → "yöneten katman" / "coordinating layer"; "model çağrısı" kutusu ve notu korundu; bilgi tabanı "özgün parçalar, metadata’sı (hangi belge, hangi bölüm) ve arama indeksiyle (gömü ve/veya anahtar sözcük) durur" (EN karşılığı) — bölüm tablosuyla birebir. | uygulandı
R055 | print/figures/strings/M07.mjs:48-50,131-133 | Şekil 7.3 kart seçenekleri iki (Gerçek / Yapay-sahte) → üç: "Gerçek görünüyor / Şüpheli: doğrula / Belirlenemez" (EN "Looks real / Suspicious: verify / Cannot determine" — bölüm dosyası ve EN tablosu "Cannot determine" dediğinden talimattaki "Cannot tell" yerine bu); .md'ye seçenek sütunu ve not. | uygulandı
R055 | print/figures/gen/M07.mjs:119,129-136 | Seçenekler kartın altında alt alta üç kutu; kart yüksekliği +18.5 pt. | uygulandı
R069 | print/figures/strings/M08.mjs:37,42-44,100,105-107 | Şekil 8.3 Dar YZ açıklaması bölüm tablosuyla aynı: "Bir görevde ya da belirli bir görev kümesinde çok iyi (…); insan düzeyinde genel öğrenme ve aktarım göstermez. Bugünkü sistemler buradadır." (EN "Very good at one task or a set of tasks …"); SVG'ye eksen satırında "çubuklar temsili düzey: sıralama, ölçüm değil" (EN "bars are illustrative levels: ordering, not a measurement"); .md sütunu "Çubuk (temsili)" ve not. | uygulandı
R069 | print/figures/gen/M08.mjs:133 | Çubuk notu eksen satırının sağına basılır (yükseklik aynı). | uygulandı
R062 | print/figures/strings/M08.mjs:58,63-65,121,125-127 | Şekil 8.5 senaryo 3 "Bir kullanıcı, birini aldatmak ya da zarara uğratmak için bir YZ aracıyla sahte kanıt üretir." (EN "A user creates fabricated evidence with an AI tool to deceive or harm someone.") — bölüm dosyasıyla birebir; sütun grubu başlığı "SORUMLULUK KİMDE?" → "İLK İNCELENECEK TARAF" (EN "PARTY TO EXAMINE FIRST"); tablo altına "sorumluluk çoğu olayda paylaşılır · yaygın görüş kitabın sonunda" (EN "responsibility is usually shared · prevailing view at the end of the book"); .md başlığı buna göre. | uygulandı
R062 | print/figures/gen/M08.mjs:197,222 | Dipnot satırı basılır; yükseklik +10. | uygulandı
— | print/figures/out/tr-baseline/ | Bilerek değişen 17 dosya baseline'a kopyalandı (aşağıda); out/tr ile baseline arasında qr-*.svg dışında fark kalmadı (qr dosyaları baseline'da yok, bu ajanın kapsamı dışında). | uygulandı

## Şekil başlıkları: bölüm dosyası ↔ figür (45 şekil × 2 dil)

Figür .md başlıkları book.json `demo.title`'dan gelir (strings'te başlık yok; SVG'de başlık basılmaz). Betikle karşılaştırıldı: `**Şekil N.j · …**` / `**Figure N.j · …**` satırları (90 adet) ile
book.json başlıkları (90 adet) **birebir aynı, fark 0**. "vs" başlıkları da aynı: 2.3 "Yol bulma: sezgisiz vs sezgili" / "Pathfinding: uninformed vs informed", 4.6 "Üretici vs Ayırt edici" /
"Generator vs Discriminator"; 1.4 "Getir – Yürüt – Yaz döngüsü" / "The Fetch – Execute – Write cycle". Bölüm dosyası "vs"yi "ile/karşı"ya çevirirse book.json başlığı (demo-kod ajanı) da
değişmeli; figür başlığı oradan gelir. (Not: 7.5 "Hedef ile niyet" / "Goal versus intent" — ikisi de bölüm dosyasıyla aynı.)

## tr-baseline'a kopyalanan (bilerek değişen) dosyalar
sekil-1-4-cycle.svg/.md · sekil-5-3-attn.svg · sekil-5-5-train.svg/.md · sekil-5-6-diffuse.svg/.md · sekil-6-1-prompt.svg/.md · sekil-6-4-arch.svg/.md · sekil-7-3-df.svg/.md ·
sekil-8-3-capability.svg/.md · sekil-8-5-responsibility.svg/.md

## İçerik ajanlarına notlar (print/src bu ajanın kapsamı dışında)
- **Şekil 5.6 Kurulum** (tr/M05:277, en/M05:270): "(şekilde “temizlenen pay” yazar)" / "(the figure labels it “cleaned share”)" parantezi artık yanlış; figür "ilerleme (adım/8, %)" / "progress (step/8, %)" yazıyor. Parantez silinmeli.
- **Şekil 6.1 Kurulum** (tr/M06:33, en/M06:33): "(şekilde “kalite” yazar)" / "(the figure labels it “quality”)" parantezi artık yanlış; figür "GÖSTERGE" / "INDICATOR" yazıyor. Parantez silinmeli.
- **Şekil 8.5 Kurulum**: figürde sütun grubu başlığı "İlk incelenecek taraf" ve dipnot "sorumluluk çoğu olayda paylaşılır" var; metin bununla uyumlu (değişiklik gerekmez).
- **Şekil 6.4**: figür tablosu beş kutu (1–5) + "model çağrısı" etiketi; bölüm tablosundaki ek "Model çağrısı" satırı figürde ayrı satır değil (talimat: model çağrısı kutusu korunur). Metin "beş parçayı … tabloda oku" dediği için uyumlu.
- **Şekil 1.4**: bölüm tablosunun 3. satırı ile figür .md'si artık birebir; dijital `cycle` demosunun evre adı "3 · Yaz" olduğundan book.json'da değişiklik gerekmez.
- **Şekil 7.3 EN**: üçüncü seçenek bölüm dosyasındaki "Cannot determine" ile aynı; talimatta geçen "Cannot tell" kullanılmadı.
