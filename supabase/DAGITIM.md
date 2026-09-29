# iyzico Checkout Form — dağıtım ve test rehberi (yazarın adımları)

Gizli anahtarlar (`IYZICO_API_KEY`, `IYZICO_SECRET`) **yalnız** Supabase secrets'ta yaşar. Sohbete, repoya, `.env`
dosyasına ya da bu belgeye yazılmaz. Kod onları `Deno.env` ile okur. Aşağıdaki komutlar senin terminalinde çalışır;
`<...>` yerlerini sen doldurursun.

## 0. Bir kez: CLI oturumu ve proje bağı
```bash
supabase login
```
```bash
supabase link --project-ref dtsgewamjkcojffustrg
```

## 1. Veritabanı (siparişler tablosu)
`supabase db push` bu repoda ÇALIŞMAZ: proje ana siteyle ortak, o projenin migration geçmişi kardeş `site` reposunda.
(`migration repair --status reverted` önerisini çalıştırma; uygulanmış migration'ları geri alınmış gösterir.)
SQL'i Dashboard'dan çalıştır:
```bash
pbcopy < supabase/migrations/20260928120000_book_orders.sql
```
Dashboard → SQL Editor → yapıştır → Run (`IF NOT EXISTS`; tekrar çalıştırmak zararsız). Doğrulama:
```sql
select column_name from information_schema.columns where table_name = 'book_orders' order by ordinal_position;
```

## 2. Sandbox anahtarları ve ayarlar
Sandbox hesabı: https://sandbox-merchant.iyzipay.com (yoksa `/auth/register`; OTP sandbox'ta `123456`).
Anahtarlar: Settings → Merchant Settings → API Keys → Show detail (`sandbox-…` önekli).

Kabuk geçmişine düşmesin diye değerleri önce gizli okut, sonra tek komutla gönder (macOS zsh sözdizimi; bash'te `read -s -p "…" VAR`):
```bash
read -s "IYZ_KEY?IYZICO_API_KEY: "; echo; read -s "IYZ_SECRET?IYZICO_SECRET: "; echo; supabase secrets set IYZICO_API_KEY="$IYZ_KEY" IYZICO_SECRET="$IYZ_SECRET" IYZICO_BASE_URL=https://sandbox-api.iyzipay.com IYZICO_MODE=sandbox IYZICO_WEBHOOK_REQUIRE_SIGNATURE=false SITE_URL=https://book.onuronder.com BOOK_PRICE_TRY=349.00; unset IYZ_KEY IYZ_SECRET
```
Kontrol: `supabase secrets list` çıktısında `IYZICO_API_KEY` ve `IYZICO_SECRET` özetleri `e3b0c442…` ile BAŞLAMAMALI (o, boş değerin özetidir).
(`RESEND_API_KEY` ve `BOOK_TOKEN_SECRET` zaten tanımlı. `BOOK_PRICE_TRY`, `store/assets/config.js` içindeki `PRICING.label` ile aynı olmalı.)

Kontrol (değerler görünmez, yalnız adlar):
```bash
supabase secrets list
```

## 3. Fonksiyonların dağıtımı
```bash
supabase functions deploy create-checkout iyzico-callback iyzico-webhook iyzico-ifn order-status refund-book
```
`supabase/config.toml` içindeki `verify_jwt = false` istisnaları (callback, webhook, ifn) bu komutla uygulanır.

## 4. iyzico sandbox paneli
- Settings → Merchant Settings → **Merchant Notifications** (webhook, HTTPS):
  `https://dtsgewamjkcojffustrg.supabase.co/functions/v1/iyzico-webhook`
- Fraud bildirimi (IFN) callback URL'si:
  `https://dtsgewamjkcojffustrg.supabase.co/functions/v1/iyzico-ifn`
- İsteğe bağlı: entegrasyon@iyzico.com'a "webhook imza (X-IYZ-SIGNATURE-V3) özelliğinin açılması" talebi. Akış buna bağımlı değil.

## 5. Site
`store/` Vercel'e deploy. `CHECKOUT_ENABLED` şimdilik `false`; kendi (admin) hesabınla tarayıcı konsolunda
`localStorage.setItem("book_checkout_beta","1")` yazınca satın alma kutusu Checkout Form yolunu kullanır.
Sandbox modunda `create-checkout` yalnız admin hesaplara açıktır (test kartıyla gerçek erişim alınamaz).

## 6. Sandbox test listesi (plan §2.7; sırayla)
Test kartı: `5528790000000008`, ileri tarihli SKT, herhangi CVV. Hata kartları: `4111111111111129` (yetersiz bakiye),
`4121111111111119` (fraud şüphesi), `4131111111111117` (mdStatus 0), `5406670000000009` (iade edilemez).
1. Satın al → iyzico sayfası açılır (initialize başarılı; log: `supabase functions logs create-checkout`).
2. Test kartıyla öde → `/satin-alma?status=ok` → "Kitabın açıldı" → `/oku` açılır; e-posta gelir.
3. `supabase functions logs iyzico-webhook` → `{"outcome":"already_paid"}` (webhook geldi ve doğrulandı).
4. Yeni siparişte ödeme sonrası iyzico sayfasını kapat (dönüşü bekleme) → 10–15 sn sonra `/satin-alma?order=<id>` "Kitabın açıldı" (yalnız webhook yolu).
5. Panelde webhook URL'sini geçici sil, ödeme sonrası dönüşü bekleme → `/satin-alma?order=<id>` polling ile açılır (mutabakat yolu). URL'yi geri koy.
6. Hata kartlarıyla öde → "Ödeme tamamlanamadı"; hak yok.
7. Yönetim (`/yonetim`) → sipariş numarasıyla "İade et" → e-posta gelir, `/oku` kapanır.
Her adımda DB: Dashboard → Table Editor → `book_orders` (status, source, iyzico_payment_id, fraud_status, receipt_sent_at).

## 6b. Sandbox test sonucu (2026-09-29)
1–7 numaralı testler geçti (ayrıntı ilerleme.md). Bulunan ve düzeltilen açık: iade sonrası tekrar gelen webhook hakkı yeniden açıyordu (fulfil.ts). Sandbox'ta initialize `1001` dönerse anahtar/URL uyumsuzluğudur (canlı anahtar + sandbox URL).

## 7. Canlıya geçiş
1. Canlı panelde (https://merchant.iyzipay.com) API anahtarları; aynı `read -s` komutu canlı değerlerle, ardından
   `supabase secrets set IYZICO_BASE_URL=https://api.iyzipay.com IYZICO_MODE=live`.
2. Canlı panelde 4. adımdaki iki URL.
3. Önce yalnız beta bayrağıyla bir **initialize** denemesi (para çekilmez): iyzico sayfası açılıyorsa Checkout Form canlıda yetkili.
4. `store/assets/config.js` → `CHECKOUT_ENABLED: true`, Vercel deploy.
5. Temiz bir test hesabıyla gerçek ₺349 ödeme → makbuz → `/yonetim` → İade et → erişim kapanır. Test hesabını sil.
6. İmza özelliği açıldıysa: `supabase secrets set IYZICO_WEBHOOK_REQUIRE_SIGNATURE=true`.

## 8. Geri alma
`CHECKOUT_ENABLED: false` → eski iyzilink + elle onay yolu anında geri gelir; fonksiyonlar zararsız kalır.

## İş bölümü
- Yazar: anahtarlar, `supabase login`, secrets, panel ayarları, gerçek ödeme testi.
- Claude: kod, tarayıcıdan sandbox akış testi, log okuma, hata düzeltme; istenirse `functions deploy` (secret gerektirmez).
