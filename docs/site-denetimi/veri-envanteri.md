# Kişisel veri envanteri: book.onuronder.com (taslak, 2026-10-02)

> Yayına girmez. Koddan çıkarıldı (dosya:satır, 2026-10-02 çalışma ağacı). Hukuki dayanak ve süre sütunları
> **önerilen değerlendirme alanlarıdır, karar değildir**: veri sorumlusu (Fittechs) ve hukukçu doldurur.
> `[ ]` = kanıt veya karar bekliyor.

## A. Hesap ve kimlik

| Veri | Nerede toplanır / tutulur | Amaç | Alıcı / rol | Dayanak (değerlendirilecek) | Saklama (karar) |
|---|---|---|---|---|---|
| E-posta, parola (hash) | Kayıt formu `store/assets/store.js:345-349`; Supabase Auth | Hesap, kitabın hesaba bağlanması, giriş | Supabase (işleyen) `[sözleşme tarafı, bölge]` | KVKK 5/2-c (sözleşme) | `[hesap kapanışından sonra ?]` |
| Ad soyad (`full_name`, zorunlu, boşluk içermeli) | `store.js:340-348` → Auth user_metadata | Hesap; iyzico alıcı adı | Supabase; iyzico (ödeme başlatmada) | 5/2-c | `[ ]` |
| Dil tercihi (`lang`) | `store.js:348` → user_metadata | Arayüz ve e-posta dili | Supabase | 5/2-c / 5/2-f | `[ ]` |
| Auth olay kayıtları (IP, user-agent, zaman) | Supabase Auth platform logu | Güvenlik | Supabase `[log süresi, bölge]` | 5/2-f / 5/2-ç | `[platform varsayılanı: kanıt]` |

## B. Sipariş ve ödeme

| Veri | Nerede | Amaç | Alıcı / rol | Dayanak | Saklama |
|---|---|---|---|---|---|
| Sipariş: kullanıcı kimliği, ürün, dil, fiyat, durum, zamanlar | `book_orders` (`supabase/migrations/20260928120000_book_orders.sql`), `create-checkout/index.ts:84-98` | Satış, teslim, mutabakat | Supabase | 5/2-c, 5/2-ç (VUK/TTK) | `[muhasebe süresi; kapsamı yalnız fatura için gerekli alanlar]` |
| `buyer_email` (sipariş anı kopyası) | `create-checkout/index.ts:95` | Makbuz e-postası, destek | Supabase, Resend | 5/2-c | `[ ]` |
| Telefon (isteğe bağlı; boşsa saklanmaz) | Form `store.js:495`; `create-checkout/index.ts:96` | iyzico alıcı alanı | Supabase; iyzico | 5/2-c (yalnız verilirse) | `[ ]` |
| IP adresi (`buyer_ip`, `x-forwarded-for` ilk değeri) | `create-checkout/index.ts:69,97` | iyzico zorunlu alanı, dolandırıcılık önleme | Supabase; iyzico | 5/2-f / 5/2-c `[iyzico zorunluluk kanıtı]` | `[ ]` · Not: başlık türetilemezse sabit bir IP iyzico'ya gönderiliyor ve kaydediliyor (P2 düzeltmesi) |
| iyzico'ya giden yer tutucu kimlik/adres (`11111111111`, "Dijital teslimat", İstanbul/Türkiye) | `create-checkout/index.ts:111`; `_shared/iyzico.ts:143-168` | iyzico zorunlu alanları | iyzico | — | TCKN veya adres **toplanmıyor**; gönderilen değerler gerçek değil `[iyzico canlı alan kuralları D04]` |
| Ham iyzico yanıtı (`raw`; BIN ve son 4 hane, kart ailesi olabilir) | `_shared/fulfil.ts:84` ve diğer yazım yerleri; migration `:29` | Mutabakat, iade | Supabase | `[gereklilik; P2 allowlist ile daraltılacak]` | `[ ]` |
| Onay zamanı (`consent_at`), cayma istisnası beyanı | `create-checkout/index.ts:94` | Hemen ifa ve cayma istisnası delili | Supabase | 5/2-c, 5/2-ç | `[ ]` · Koşul sürümü saklanmıyor (P2/P3) |
| Kart verisi | Bu siteye gelmez; iyzico sayfasında | — | iyzico `[rolü: işleyen mi, bağımsız sorumlu mu]` | — | — |

## C. Okuma ve filigran

| Veri | Nerede | Amaç | Alıcı | Dayanak | Saklama |
|---|---|---|---|---|---|
| E-posta ve kısa erişim kimliği okuma token'ında (10 dk, imzalı, şifreli değil) | `_shared/token.ts:27-32`; `book-token/index.ts:9` | Kişiye özel filigran | Tarayıcı (alıcının kendisi) | **Kesinleşmedi.** Amaç, zorunluluk, daha az müdahaleci alternatif (opak erişim kodu) ve etkiler değerlendirilerek dayanak belirlenecek | Token 10 dk; filigran içerikte |
| Filigran (e-posta + sipariş etiketi) içerikte | `book-content/index.ts:51-55` | Eser koruma | Alıcı | Aynı | — |

## D. Yönetim, destek, e-posta

| Veri | Nerede | Amaç | Alıcı | Dayanak | Saklama |
|---|---|---|---|---|---|
| Elle erişim: yönetici e-postası (`granted_by`), serbest not (≤200) | `grant-book/index.ts:41-64` | İstisnai erişim, iz | Supabase | 5/2-f | `[ ]` |
| İşlem e-postası (alıcı, kısa sipariş no, tutar, tarih, okuma bağlantısı) | `_shared/mail.ts:10-60` | Makbuz/bilgilendirme | Resend `[bölge, alt işleyen, imzalı kapsam]` | 5/2-c | `[Resend log süresi]` |
| Auth e-postaları (doğrulama, sıfırlama) | Supabase Auth | Hesap | `[gerçek SMTP sağlayıcısı: config.toml'da yok, panelde]` | 5/2-c | `[ ]` |
| Destek yazışmaları | support@fittechs.com | Destek, iade | `[e-posta sağlayıcısı]` | 5/2-c | `[ ]` |
| Edge Function logları (sipariş/ödeme kimliği, sağlayıcı hata metni) | `console.*` (fonksiyonlar) | Hata ayıklama | Supabase `[log süresi]` | 5/2-f | `[ ]` · P2: hata metni redaksiyonu |
| Vercel istek logları (IP, yol, user-agent) | Platform | Barındırma, güvenlik | Vercel `[plan, bölge, süre]` | 5/2-f | `[ ]` |
| Yedekler | Supabase `[yedek süresi, bölge]` | Felaket kurtarma | Supabase | 5/2-f | `[ ]` |

## E. Tarayıcı depolaması (CK04)

Anonim kullanıcı ölçümü: `depolama-envanteri.json` (canlı site, temiz profil, 6 sayfa). Sonuç: localStorage, sessionStorage, IndexedDB ve çerez **yok**; ağ yalnız `book.onuronder.com`.

| Anahtar | Ne zaman yazılır | Amaç | Taraf | Değerlendirme |
|---|---|---|---|---|
| `sb-dtsgewamjkcojffustrg-auth-token` (localStorage) | Girişte (supabase-js varsayılanı `persistSession`) | Oturum sürekliliği | Birinci taraf | Hizmet için zorunlu olduğu değerlendirilebilir `[hukuk onayı]` |
| `book_checkout_beta` (localStorage, okunur; site yazmaz) | Yalnız elle ayarlanırsa (test bayrağı) | Sandbox ödeme testi | Birinci taraf | Kendiliğinden "zorunlu" sayılmaz; alıcıya etkisi yok (`store.js:19`). Üretimde kaldırılması değerlendirilir. |
| Giriş yapılmış hâl, checkout, iyzico sayfası ve dönüş | — | — | — | **BLOCKED:** test hesabı ve sandbox gerekir (P2 test ortamı) |

## Açık kanıtlar (karar-kapilari.md D02)
Sağlayıcı tüzel kişileri ve rolleri, bölgeler, uzaktan destek erişimi, alt işleyenler, Türk standart sözleşmesi ve bildirim, Auth SMTP, log/yedek süreleri.
