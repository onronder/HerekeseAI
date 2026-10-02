# P1 kabul raporu: ön yüz, erişilebilirlik, SEO (2026-10-02)

Başlangıç commit'i `d0da601` (değişiklikler commit edilmedi; yazar dal açıp push eder).
**Durum: preview'de kabul edildi (commit `a668357`); tek düzeltme (EN nav kayması) yeniden push ve preview teyidi bekliyor.**
Kabul kanıtı Vercel preview'de çalışan `site_test.mjs` sonucudur; yerel öykünme geliştirme kanıtıdır.

## Değişiklikler

| İş | Dosyalar | Not |
|---|---|---|
| Şablon mobil düzeni (MOB05A) | `Atlas-Kitap.dc.html`, `Atlas-Kitap-EN.dc.html` (`<style>` içinde `@media (max-width:860px)`, `prefers-reduced-motion`, `<html lang>`) | Markup değişmedi; kurallar adı yorumda yazılı yerleşim kapsayıcılarının stil kalıplarına bağlı (`bk-cover`, `bk-topbar`, `bk-hero`, `bk-main`, `bk-side`, `bk-text`, `bk-toc`, `bk-split`). `qr_variant` dize çapaları korundu. Etki: demo, okuyucu (`upload_book.py` sonrası), QR sayfaları, dist/web. |
| Okuyucu kapağı ve QR kaynağı | `build.py` (`gated_variant`, `qr_variant`, `demo_variant`) | Okuyucu kapağındaki kırık TR/EN bağlantıları kaldırıldı (sandbox gevşetilmedi; dil geçişi okuyucu çubuğunda). QR kaynağındaki gizli `./index.html` bağlantıları kaldırıldı. Demo head'i rota manifestinden geliyor. |
| Ana sayfa nav, fiyat paneli, kontrast | `store/assets/store.css` | Nav sarıyor, e-posta kısaltılıyor, çıkış her zaman görünür. Fiyat paneli 320 px'de taşmıyor. Kontrast: `.btn-ember` zemini `#c2541d` (4,59:1), kapak üst başlığı `#e85d3a` (5,02:1), koyu panel grisi `#968d79` (4,95:1). Odak her zaman görünür. Okuyucu çubuğu ≤480 px. Diyalog kısa ekranda kayıyor. |
| Kadran, diyalog, formlar, teslim mesajları | `store/assets/store.js`, `store/index.html`, `store/en/index.html`, diğer 6 sayfanın diyalog rolü | APG slider: klavye, `aria-valuetext`, tek `setPct` yolu, EN etiketi. APG dialog: `inert` arka plan, Tab döngüsü, Escape, odak dönüşü ve yedeği. Durum bölgeleri ve alan hatası ilişkisi. Single-flight + istek nesli. Reset ve updateUser hata kontrolü (429/çevrimdışı). Teslim karar tablosu `DELIVERY` (taahhütsüz dil; SSS birebir). Satın alma sonucu yalnız sunucudan; siparişsiz ziyaret "başarısız" demiyor. Onay kutusunda yasal metin bağlantısı. iframe başlığı dile göre. Ticker durdur/oynat. |
| SEO | `tools/site/routes.json`, `tools/site/seo.py`, `tools/site/gen_site.py` → 6 sayfanın head bloğu, `store/sitemap.xml`, `store/robots.txt`, `store/llms.txt` | 8 rota: self canonical, karşılıklı hreflang (x-default yalnız ana sayfa çiftinde), özgün description; EN legal indekslenebilir; lastmod yok. `/en/` → `/en` (Supabase Auth yönlendirmeleri bilinçli olarak `/en/` kaldı). |
| 404 | `store/404.html` | İki dilli; Vercel bilinmeyen yolda 404 durumuyla sunar. |
| Başlıklar | `store/vercel.json` | HSTS canlıdaki değerle aynı (`max-age=63072000`), kapsam genişletilmedi. CSP aynı; istisna kaydı `csp-istisnasi.md`. |
| Dağıtım | `../site/supabase/functions` (book-sales dalı) | 4 eski kitap fonksiyonu + `_shared/iyzico.ts` kaldırıldı, guard notu eklendi (commit edilmedi). |

## Test sonuçları

### Yerel öykünme: `node tools/site_qa/site_test.mjs` → **51 PASS · 0 FAIL · 3 BLOCKED**
- **K10 Mobil:** 17 sayfa × 6 görünüm (320/360/390/768/1280, 667×375). Sayfalar:
  - TR/EN demo;
  - ana sayfa;
  - okuyucu çubuğu;
  - yasal;
  - 6 QR;
  - okuyucu vekili (kitap kapak, M3, M5).

  Yatay taşma ve kırpılma yok; başlık, paragraf ve gezinme görünür, `elementFromPoint` ile örtülmüyor. Hareket azaltmada son durum görünür ve şerit duruyor.
- **K11:**
  - SSS = `DELIVERY.faq` (TR/EN);
  - kadran klavye ve ARIA (TR/EN);
  - diyalog: rol, ilk odak, inert, Tab döngüsü, Escape, odak dönüşü;
  - parola sıfırlamada 429 ve çevrimdışı → doğru hata, sahte başarı yok;
  - Enter + Enter + programatik submit → tek istek;
  - kapat-aç sonrası geç yanıt uygulanmıyor;
  - axe-core (8 sayfa, WCAG 2.2 AA etiketleri): ciddi/kritik ihlal 0. Bu otomatik bir tarama; AA uygunluğu iddiası değil.
- **K12:**
  - 8 rota head'i manifestle aynı;
  - `.html`, sonda `/` ve query varyantları tek adımda kanonik adrese gidiyor;
  - bilinmeyen yol 404 ve iki dilli sayfa;
  - sitemap 8 URL, lastmod yok;
  - robots ve llms doğru;
  - 90 QR sayfasında görünür bağlantılar yalnız `/` ve `/en`, noindex, doğru lang.
- **BLOCKED:**
  - gerçek tarayıcı zoom'u, mobil klavye ve gerçek `/oku` (elle);
  - VoiceOver ve şifre kurtarma uçtan uca (test ortamı);
  - üretim başlıkları ve `docs/`'un dağıtım dışı olduğu (yalnız preview'de ölçülür).
- Browser pane görsel kontrolü: demo 375 px ve EN ana sayfa 320 px.

### Vercel preview: `BASE_URL=https://herkese-ai-git-site-audit-1-onur-onders-projects.vercel.app` (commit `a668357`) → **50 PASS · 0 FAIL · 2 BLOCKED**
- Gerçek Vercel davranışı doğrulandı:
  - `/yasal.html`, `/en/`, `/hakkimizda/`, `/index.html`, `/en/?ref=qr`, `/demo/demo.html` → 308 ile tek adımda kanonik 200 (query korunuyor);
  - bilinmeyen yollar gerçek **404** ve iki dilli sayfa;
  - sitemap'teki 8 URL'nin hepsi 200;
  - HSTS `max-age=63072000`, CSP ve nosniff mevcut;
  - `docs/` dağıtımda yok (404);
  - 90 QR sayfası temiz;
  - 8 sayfada axe ciddi/kritik ihlal 0;
  - JS hatası yok.
- Önizlemede okuyucu vekili sayfaları (dist/web) yok; bu üç satır yalnız yerelde koşar.
- Önizleme yanıtları Vercel'in `x-robots-tag: noindex` başlığını taşır (beklenen). Üretimde indeks hedefleri üretim smoke testinde kontrol edilir.
- Önizleme korumasının (Vercel Authentication) yazar tarafından test için kapatıldığı not edilmiştir; **testten sonra yeniden açılmalı.**

### Performans bulgusu ve düzeltme
- **Preview ile canlı (simüle Lighthouse, 5×):** ana sayfa LCP medyanı preview 2,77 sn, canlı 2,15 sn. EN'de preview'de her turda **CLS 0,029** (canlı 0).
- **Ayrıştırma (aynı makine, aynı yerel sunucu, eski `d0da601` ile yeni kod):**
  - TR simüle LCP birebir aynı (4205/4206 ms): preview ile canlı arasındaki TR farkı **ortamdan**, koddan değil.
  - EN'de gerçek gerileme: nav'a eklenen satır sarması, JS'in sonradan yazdığı "SIGN IN" bağlantısıyla satırı ikiye bölüyor ve kapak gövdesini kaydırıyordu.
- **Düzeltme:** hesap bağlantısı HTML'de baştan yazılıyor (`store/index.html`, `store/en/index.html` `#account-line`); JS aynı içeriği yazar. Sonuç: EN CLS **0,029 → 0** (yerel, 3/3).
- **Gerçek yavaşlatma (devtools throttling, 5×, eski ile yeni):**
  - LCP medyanı TR 2427 → 2499 ms (+72);
  - EN 2454 → 2506 ms (+52);
  - FCP +40–60 ms.

  Fark `store.js`'in 10,5 KB büyümesiyle (sıkıştırılmış ~3 KB) tutarlı ve küçük. Simüle yöntemdeki 300–450 ms fark bir ölçüm büyütmesiydi.
  Ham veri: `lighthouse/ab-devtools/`.
- TR ana sayfadaki **CLS 0,04** (`.cover-grid`) eski kodda da var; yeni değil. Ayrı iyileştirme adayı (font yükleme ile kapak gridi kayması).

### Gerileme
- `node print/kitap/qa/ui_test.mjs` → **18/18** (kitap davranışı).
- `python3 tools/site/print_guard.py --check` → **fark 0** (772 dosya; `print/` ve `BASKI.md` build'den etkilenmedi).

### Lab performansı (Lighthouse 12, mobil öykünme, yerel Chrome, medyan/3)

| Rota | Önce (canlı) skor | LCP | CLS | TBT | Aktarım | Sonra (preview) |
|---|---|---|---|---|---|---|
| `/` | 0,98 | 2091 ms | 0,040 | 0 ms | 271 KB | 0,96 · 2813 ms · 0,040 · 0 ms · 275 KB (ortam farkı; kod A/B'de eşit) |
| `/en` | 1,00 | 1877 ms | 0,000 | 0 ms | 237 KB | 0,97 · 2661 ms · **0,029** · 0 ms · 242 KB → kayma düzeltildi, yeniden ölçülecek |
| `/demo/demo` | 0,95 | 2310 ms | 0,077 | 0 ms | 274 KB | 0,99 · 1944 ms · 0,046 · 0 ms · 277 KB |
| `/demo/demo-en` | 1,00 | 1758 ms | 0,016 | 1 ms | 199 KB | 0,98 · 2213 ms · 0,016 · 0 ms · 201 KB |

Bunlar lab verisidir, saha (CrUX) değildir. "Sonra" ölçümü preview'de aynı komutla alınır: `sh tools/site/lh.sh <preview> docs/site-denetimi/lighthouse/after`.

### CK04 depolama (canlı, anonim, 6 sayfa)
Depolama yok, çerez yok, yalnız birinci taraf istek (`depolama-envanteri.md`).

## Kalan adımlar
1. ✅ Dal ve push → preview (`a668357`) → kabul testi 50 PASS / 0 FAIL.
2. Yazar: EN kayma düzeltmesini aynı dala push eder. Ardından preview'de kabul testi ve `/en` lab ölçümü yeniden alınır (`tools/site_qa/site-test-preview.json`).
3. Yazar: Vercel Authentication'ı yeniden açar.
4. Yazar: `main`'e merge, ardından `python3 upload_book.py` (okuyucu yeni şablonla).
5. Üretim smoke testi: `BASE_URL=https://book.onuronder.com node tools/site_qa/site_test.mjs` (`site-test-uretim.json`).

## Bilinen sınırlar ve açık kalanlar
- Yasal metinlerdeki "en geç 24 saat" ifadeleri (ön bilgilendirme ve teslimat) değişmedi; yeni dil P3 taslağında (`sartlar-onay-tr.md` §4). SSS ve ekran mesajları taahhütsüz dile geçti; yasal metin daha üst sınır vermeye devam ediyor (çelişmez, ama tek karar tablosuna bağlanması hukuk onayını bekliyor).
- P2 (ödeme, hak, e-posta, sunucu) ve P3 (yasal metin) bu yayının parçası değil.
