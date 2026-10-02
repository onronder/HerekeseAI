# Dağıtım envanteri ve tek yetkili yol (2026-10-02)

Site denetimi planı rev. 2 §D. Bu dosya `store/` dışında olduğu için yayına girmez.

## Bileşenler ve dağıtım yolları

| Bileşen | Kaynak | Dağıtım | Yetkili | Not |
|---|---|---|---|---|
| Statik site `book.onuronder.com` | `Final/store/` (git: `github.com/onronder/HerekeseAI`, dal `main`) | GitHub `main` push → Vercel (Git entegrasyonu, kök dizin `store/`) | Yazar | Dal push'u Vercel preview üretir; kabul testi preview'de koşar. `vercel.json` dosyası `store/` içinde. Git entegrasyonu ve kök dizin ayarı Vercel panelinde, depoda değil: **yazarın panelden teyit etmesi gerekir**. |
| Okuyucu kitabı (`book-tr.html`, `book-en.html`) | `Atlas-Kitap(-EN).dc.html` → `python3 build.py` → `dist/gated/` | `python3 upload_book.py` → Supabase Storage (private `book` bucket) | Yazar | Şablon değişikliği okuyucuya ancak yükleme ile gider. |
| Ücretsiz demo ve 90 QR sayfası | `build.py` → `store/demo/`, `store/d/` | Statik siteyle (git push) | Yazar | |
| Edge Functions (9 kitap fonksiyonu) | `Final/supabase/functions/` | `supabase functions deploy <ad>` (Final kökünden) | Yazar (tek deployer) | Kardeş `site` deposunda `book-sales` dalındaki eski kopyalar kaldırıldı; `site/supabase/functions/KITAP-FONKSIYONLARI.md` guard notu. |
| Ana site fonksiyonları | `site/supabase/functions/` (cal-webhook, fetch-ai-news, google-indexing, send-email, send-newsletter, sitemap) | `site` deposundan | Yazar | Aynı Supabase projesi (`dtsgewamjkcojffustrg`). |
| Şema | `site/supabase/migrations/` (has_role, user_roles, book_sales) + `Final/supabase/migrations/` (book, book_orders) | SQL Editor (Final'de `db push` çalışmıyor; `DAGITIM.md:16`) | Yazar | Elle SQL kullanılırsa: versioned dosya + uygulanan hash kaydı + `supabase migration list` uzlaştırması. |
| CI | Yok (`site/.github/workflows` ve `Final/.github` yok) | — | — | Otomatik deploy tetikleyicisi yok. |
| Baskı dosyaları | `print/`, `BASKI.md` | **Hiçbir zaman push edilmez** | — | `tools/site/print_guard.py` build öncesi/sonrası hash karşılaştırır. |

## Proje kimlikleri
- Supabase project ref: `dtsgewamjkcojffustrg` (`store/vercel.json` CSP connect-src, `supabase/config.toml`)
- Final HEAD (iş başlangıcı): `d0da601`

## P1 yayın sırası
1. `python3 tools/site/print_guard.py --snapshot` → `python3 tools/site/gen_site.py` → `python3 build.py` → `print_guard.py --check` (fark 0).
2. `node tools/site_qa/site_test.mjs` (yerel, geliştirme) → `node print/kitap/qa/ui_test.mjs` (kitap gerilemesi).
3. Yazar: `site-audit-1` dalını push eder → Vercel preview URL'si.
4. `BASE_URL=<preview> node tools/site_qa/site_test.mjs` → kabul kanıtı (`tools/site_qa/site-test.json`, `kabul_kaniti: true`).
5. `sh tools/site/lh.sh <preview> docs/site-denetimi/lighthouse/after` (lab, "önce" ile aynı koşul).
6. Yazar: `main`'e merge/push, ardından `python3 upload_book.py` (okuyucu şablonu).
7. Üretim smoke testi: `BASE_URL=https://book.onuronder.com node tools/site_qa/site_test.mjs` (salt okunur).

Geri dönüş: Vercel panelinden önceki deploy'a "Promote", okuyucu için önceki `dist/gated` ile `upload_book.py`. P1 şema ve fonksiyon değişikliği içermez.
