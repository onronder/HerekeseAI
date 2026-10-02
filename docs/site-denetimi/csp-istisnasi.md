# CSP uyumluluk istisnası: `script-src 'unsafe-inline' 'unsafe-eval'`

Kayıt tarihi 2026-10-02. Durum: **kayıtlı istisna (kalıcı karar değil)**. Sahip: yazar.

## Kapsam
- Politika `store/vercel.json` dosyasında, tüm rotalarda.
- Okuyucu kitabı `srcdoc` iframe olarak yüklenir ve üst sayfanın politikasını devralır (`sandbox="allow-scripts"`, `store/assets/store.js` `loadBook`).

## Neden gerekli
| Yönerge | Bağımlılık | Etkilenen rotalar |
|---|---|---|
| `'unsafe-eval'` | `support.js:287` şablon motoru ifadeleri `new Function(...)` ile derliyor | `/oku`, `/en/read` (iframe), `/demo/demo*`, `/d/*` (90 QR) |
| `'unsafe-inline'` | Şablonun satır içi bileşen betikleri; `store.js` içindeki `onclick="location.reload()"` | Aynı rotalar + mağaza sayfaları |

## Risk
XSS açığı olursa satır içi ve eval kodu engellenmez. Hafifletenler:
- `default-src 'self'`, `connect-src` yalnız Supabase projesine, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`;
- kullanıcı verisi `innerHTML`'e yalnız `esc()` ile girer;
- okuyucu iframe'i `allow-same-origin` olmadan sandbox içinde çalışır.

## Alternatif iş (ayrı proje)
1. Şablon motorunu önceden derlenen (build-time) render'a çevirmek; `new Function` kalkar.
2. Satır içi handler'ları `addEventListener`'a taşımak. Kalan satır içi betikler için build sırasında hesaplanan `sha256-…` hash'leri kullanılır (statik dağıtımda nonce için dinamik üretim yok).
3. Önce `Content-Security-Policy-Report-Only` ile izole testte sıkı politika denenir; raporlar veri azaltma kuralına uyar (token veya kişisel veri içeren tam URL loglanmaz). Ardından enforce edilir.

Bu yamada (P1) kaldırılmadı. Kör kaldırma okuyucuyu, demoları ve QR sayfalarını bozar.
