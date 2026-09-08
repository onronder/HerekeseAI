# Supabase E-posta Şablonları (TR + EN, kitap temalı)

Supabase her e-posta türü için TEK şablon ve TEK konu tutar; dil seçtirmez.
Bu yüzden şablonlar iki dillidir (TR üstte, EN altında). Palet, kitabın okuma
sayfası paleti (krem #faf7ef zemin, charcoal #1a1a1a marka bandı, ember #e85d3a
düğme): koyu zeminli e-postaları Gmail karanlık modu bozduğu için bilinçli tercih.

## Kurulum: Dashboard → Authentication → Email Templates

| Supabase şablonu | Dosya | Konu satırına yapıştır |
|---|---|---|
| **Confirm signup** | `dogrulama.html` | `E-postanı doğrula · Confirm your email — Herkes İçin Yapay Zekâ` |
| **Reset password** | `sifre-sifirlama.html` | `Şifreni sıfırla · Reset your password — Herkes İçin Yapay Zekâ` |
| **Change email address** | `eposta-degisikligi.html` | `E-posta değişikliğini onayla · Confirm your email change` |

Her birinde: dosyanın TÜM içeriğini kopyala → ilgili şablonun "Message body"
alanına yapıştır (Source/HTML görünümünde) → konuyu yaz → Save.

Notlar:
- `{{ .ConfirmationURL }}` değişkenine dokunulmadı; Supabase doldurur.
- Magic Link ve Invite şablonları kullanılmıyor (sitede o akışlar yok); istersen
  aynı kalıptan türetilir.
- Gönderici adı için: Project Settings → Auth → SMTP ayarları özelleştirilmediyse
  Supabase varsayılan göndericisi kullanılır; Resend SMTP'ye bağlamak istersen
  söyle, kurulumunu hazırlarım (gönderen: "Herkes İçin Yapay Zekâ <noreply@onuronder.com>").
