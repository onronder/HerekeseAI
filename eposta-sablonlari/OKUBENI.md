# Supabase E-posta Şablonları — dile göre TEK DİLLİ (kitap temalı)

Şablonlar Go template koşulu kullanır: kayıt sırasında `user_metadata.lang`
("tr" | "en") yazılır (store.js bunu otomatik yapar) ve e-posta o dilde gider.
`lang` yoksa (eski/elle açılmış hesaplar) varsayılan Türkçedir.

Palet, kitabın okuma sayfasıdır (krem #faf7ef + charcoal marka bandı + ember
düğme); koyu zemin, Gmail karanlık modu e-postayı bozduğu için bilinçli olarak
kullanılmadı. Fontlar e-posta güvenli düşüşlerdir (Georgia/Helvetica/Courier).

## Kurulum: Dashboard → Authentication → Email Templates

Her şablon için: dosya içeriğinin TAMAMINI "Message body"ye, aşağıdaki satırı
"Subject"e yapıştır (konu satırı da Go template'tir; Supabase destekler).

**Confirm signup** → `dogrulama.html`
```
{{ if eq .Data.lang "en" }}Confirm your email — AI for Everyone{{ else }}E-postanı doğrula — Herkes İçin Yapay Zekâ{{ end }}
```

**Reset password** → `sifre-sifirlama.html`
```
{{ if eq .Data.lang "en" }}Reset your password — AI for Everyone{{ else }}Şifreni sıfırla — Herkes İçin Yapay Zekâ{{ end }}
```

**Change email address** → `eposta-degisikligi.html`
```
{{ if eq .Data.lang "en" }}Confirm your email change — AI for Everyone{{ else }}E-posta değişikliğini onayla — Herkes İçin Yapay Zekâ{{ end }}
```

Notlar:
- `{{ .ConfirmationURL }}` her iki dil dalında da korunur; Supabase doldurur.
- Satın alma makbuzu (grant-book/Resend) da alıcının `user_metadata.lang`ına
  göre TR/EN gider; EN makbuz linki /en/read'e yönlenir.
- Magic Link / Invite kullanılmıyor; gerekirse aynı kalıptan türetilir.
- Gönderici adını "Herkes İçin Yapay Zekâ <noreply@onuronder.com>" yapmak için
  Resend SMTP bağlanabilir (Project Settings → Auth → SMTP); istenirse hazırlarım.
