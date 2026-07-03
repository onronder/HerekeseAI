# Herkes İçin Yapay Zekâ — Yayın & Gelir Rehberi

> Ürünün farkı: **45 canlı, elle oynanan demo.** İnteraktiviteyi öldüren her format (PDF, Kindle)
> ana değeri siler. Strateji bunun üzerine kurulu: web ana ev, diğerleri uydu.

## Eldeki paketler (build.py üretir: `python3 build.py`)

| Dosya | Ne | Nerede kullanılır |
|---|---|---|
| `dist/tek-dosya/Herkes-Icin-Yapay-Zeka-TR.html` (~580 KB) | İnternetsiz, çift-tıkla açılan TEK dosya; fontlar+runtime gömülü | **Satılacak ürün** (Gumroad/Lemon Squeezy) |
| `dist/tek-dosya/AI-for-Everyone-EN.html` | Aynısının İngilizcesi | Global satış |
| `dist/web/` (index.html TR, en.html EN, support.js) | Web yayını | GitHub Pages / Netlify / kendi alan adın |
| `dist/web/demo.html` | **Ücretsiz vitrin**: yalnız Bölüm 1; 2–8 "Tam sürümde" diye kilitli listelenir | Pazarlama hunisinin girişi |

## Sorularının net cevapları

**"Kindle/Kobo'da animasyonları kaybeder miyim?"** Evet, tamamen. Kindle JS'i siler, Kobo neredeyse tamamen.
EPUB asla ana format olamaz. Ancak **yan ürün** olabilir: statik "okuma sürümü" + her demonun yerinde
ekran görüntüsü ve "canlı dene" QR/linki (web'e). Amazon'un keşif gücü için değerli, gelir için ikincil.

**"App Store / Google Play'e konabilir mi?"** Evet ve bu ürün için meşru: salt "kitap uygulaması" reddedilir
ama 45 interaktif demo bunu **eğitim uygulaması** yapar (Brilliant.org kategorisi). Capacitor sarmalayıcıyla
mevcut HTML olduğu gibi paketlenir; ek kod minimal. Komisyon %15 (küçük işletme tarifesi). Getirisi:
mağaza görünürlüğü, güven, IAP altyapısı. Bedeli: inceleme süreci + sürüm bakımı.

## Gelir mimarisi: "Ücretsiz vitrin + satılan tam sürüm"

```
demo.html (ücretsiz, paylaşılabilir M1)
   │  sosyal medya · Product Hunt · basın
   ▼
Vitrin sitesi (GitHub Pages)  ──satın al──▶  Gumroad: tek-dosya TR+EN paketi
                                              (isteğe bağlı: okul/kurum toplu lisans)
```

## Fazlı yol haritası (kazanç/emek sırası)

### B1 — Gumroad'da satış (BUGÜN yapılabilir; senin adımların)
1. gumroad.com → ücretsiz hesap aç (Lemon Squeezy da olur; ikisi de KDV/faturayı üstlenir).
2. "New product → Digital product" → `dist/tek-dosya/` içindeki iki HTML'i ZIP'leyip yükle
   (ZIP önerilir: iki dil tek üründe, alıcıya tek indirme).
3. Fiyat önerisi: **249–399 TL / $9–15** aralığı test et ("adil fiyat + gönlünden ne koparsa" modeli
   Gumroad'da var ve ilk hafta PR'ında iyi çalışır).
4. Ürün sayfasına: 2–3 demo ekran kaydı GIF'i + "45 canlı demo" vurgusu + demo.html linki.

### B2 — Vitrin sitesi: GitHub Pages (BUGÜN; senin adımların)
1. GitHub'da repo aç (ör. `herkes-icin-yapay-zeka`), `dist/web/` içeriğini push'la.
2. Repo → Settings → Pages → Branch: main, folder: / (root) → Save.
3. `https://<kullanıcı>.github.io/<repo>/` yayında; `demo.html`i paylaş, `index.html`i şimdilik
   paylaşma (ya da tam sürümü kaldırıp yalnız demo+satış sayfası koy — önerilen).
4. Alan adı bağla (Settings → Pages → Custom domain). Öneri: kısa .com/.dev.
   **Dikkat:** dist/web/index.html tam kitaptır; "yalnız satın alanlar görsün" istiyorsan
   Pages'a SADECE demo.html + satış sayfası koy, tam sürümü Gumroad indirmesi olarak bırak.

### B3 — PWA (sonraki oturum, ~1 saat iş)
manifest.json + service worker → telefona "uygulama gibi" kurulur, çevrimdışı çalışır,
mağaza komisyonu yok. Web sürümünün üstüne küçük ek.

### B4 — iOS/Android (ayrı proje, 1–2 gün)
Capacitor ile sarmala → App Store + Play. IAP ile "tam sürümü aç" modeli.
Okul/kurum alımları için mağaza varlığı önemli.

### B5 — EPUB "okuma sürümü" (ayrı proje)
Statik dışa aktarım + demo ekran görüntüleri + QR→web. KDP'ye (Kindle) yükle;
fiyatı düşük tut, açıklamaya "interaktif sürüm web'de" yaz. Amaç keşif, gelir değil.

## PR kaldıraçları
- **Ücretsiz M1 linki** her yerde: "kitabın ilk bölümü ücretsiz, demolarıyla oyna".
- **15 sn'lik demo ekran kayıtları** (tokenizer, Turing makinesi, difüzyon sürgüsü) — sosyal medyada
  "her kavramı elinle dene" mesajıyla.
- **Product Hunt** lansmanı (EN sürümü hazır olduğu için global).
- Öğretmenlere doğrudan ulaşım: interaktif demolar sınıf materyali; **okul toplu lisansı** ayrı fiyatla.
- TR teknoloji medyası (Webrazzi vb.): "Türkçe yazılmış, tamamen interaktif YZ kitabı" açısı.

## Teknik notlar
- Fontlar `dist/fonts-cache/` altında saklanır; build tekrarında yeniden indirilmez.
- Tek-dosyalar tamamen çevrimdışı: 0 dış URL (doğrulandı).
- Bilinen davranış: arka plandaki (gizli) sekmede runtime render'ı bekletir (rAF); kullanıcı
  görünümünde etkisi yok.
