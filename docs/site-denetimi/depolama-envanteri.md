# Depolama ve çerez envanteri (CK04)

- Ölçüm: `node tools/site_qa/storage_inventory.mjs [BASE_URL]` (puppeteer, incognito, temiz profil). Yalnız anahtar adları ve alan adları kaydedilir; değer kaydedilmez.
- Ham sonuç: `depolama-envanteri.json`.

## 2026-10-02 · https://book.onuronder.com (canlı, anonim)

| Sayfa | localStorage | sessionStorage | IndexedDB | Çerez | Ağ alan adları |
|---|---|---|---|---|---|
| `/` | — | — | — | — | book.onuronder.com |
| `/en` | — | — | — | — | book.onuronder.com |
| `/demo/demo` | — | — | — | — | book.onuronder.com |
| `/demo/demo-en` | — | — | — | — | book.onuronder.com |
| `/d/<slug>` (QR) | — | — | — | — | book.onuronder.com |
| `/yasal` | — | — | — | — | book.onuronder.com |

Anonim ziyarette site tarayıcıya hiçbir şey yazmıyor ve üçüncü taraf isteği yapmıyor.

## Kapsam dışı (BLOCKED)
Giriş, kayıt, çıkış, ödeme başlatma, iyzico sayfası ve dönüş, okuyucu. Test hesabı ve sandbox ortamı gerekir (P2).

Kaynak taramasına göre girişte yazılan tek anahtar Supabase oturumudur (`sb-dtsgewamjkcojffustrg-auth-token`). `book_checkout_beta` site tarafından yazılmaz, yalnız okunur. Bu, tarayıcı kanıtı yerine geçmez.

## Değerlendirme (hukuk onayına bağlı)
Yalnız zorunlu oturum depolaması doğrulanırsa çerez bandı gerekmeyebilir; bu durumda doğru aydınlatma yeterli olabilir. İzin gerektiren bir izleme eklenirse rızadan önce engelleme, ret ve geri alma gerekir. Mevcut gizlilik metnindeki çerez bölümü (`store/yasal.html` "Çerezler ve Yerel Depolama") bu ölçümle uyumlu.
