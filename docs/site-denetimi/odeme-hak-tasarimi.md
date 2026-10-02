# P2 tasarımı: ödeme, hak, e-posta ve sunucu sağlamlaştırma

> Durum: **tasarım (kod yok)**. Yazar kararı 2026-10-02: backend, test ortamı (yerel Supabase veya staging) kurulana dek uygulanmaz.
> Kaynak: "Uygulama Planı İncelemesi" B01–B11 ve K01–K08. Ad önerileri zorunlu değil; karşılanması gereken sorumluluklar belirleyicidir.
> Mevcut kod referansları: `supabase/functions/_shared/fulfil.ts`, `create-checkout`, `iyzico-callback`, `iyzico-webhook`, `iyzico-ifn`, `order-status`, `refund-book`, `grant-book`, `book-token`, `book-content`.

## 0. Neden (mevcut koddaki somut riskler)

| Risk | Kod | Sonuç |
|---|---|---|
| Paralel iki checkout | `create-checkout` yalnız mevcut hakkı kontrol ediyor | İki ödenebilir oturum; ikisi de tahsil edilebilir |
| Tek ortak hak satırı | `book_entitlements UNIQUE(user_id, product_code)` + upsert `ignoreDuplicates` | İkinci satın alma veya manuel grant ayrı kaynak değil; iade hepsini siliyor |
| Durum geçişi ile hak ve makbuz ayrı adımlarda | `fulfil.ts` `transition()` → upsert → `sendReceipt` | Geç gelen eski sonuç iadeden sonra hakkı geri verebilir; makbuz çift gidebilir veya hiç gitmeyebilir |
| Ham yanıt ezilmesi | `storeRaw` durum koruması yok | Ödenmiş siparişin denetim kaydı kaybolur |
| Bellek limiter'ı | `_shared/token.ts:95` `new Map` | Isolate başına ayrı bütçe |
| İçerik anında hak kontrolü yok | `book-content` yalnız HMAC | İade sonrası 10 dk erişim (yazar kararı: anında iptal) |
| Hesap silinince sipariş silinir | `book_orders.user_id ON DELETE CASCADE` | Ticari kayıt kaybı; metindeki saklama beyanıyla çelişki |

## 1. Veri sözleşmesi (sorumluluklar)

| Sorumluluk | Önerilen yapı | Ana alanlar | Kısıtlar |
|---|---|---|---|
| Sipariş snapshot'ı | `book_orders` (genişletilir) | user_id (nullable), product_code, price_minor (kuruş), currency, terms_version, terms_locale, terms_hash, consent_kinds, payment_state, access_state, version (CAS) | `iyzico_payment_id UNIQUE`, `iyzico_token UNIQUE` |
| Ödeme başlatma denemesi | `checkout_attempt` | id, user_id, product_code, snapshot_hash, idempotency_key, state (initializing/initialized/unknown/expired/terminal), order_id, lease_until, provider_token, token_expires_at | `UNIQUE(user_id, idempotency_key)`; kısmi tekillik: kullanıcı+ürün başına tek etkin deneme (`WHERE state IN ('initializing','initialized','unknown')`) |
| Doğrulanmış ödeme olguları | `payment_fact` (projection) | order_id, source (callback/webhook/reconcile/ifn), paymentId, paymentStatus, fraudStatus, price_minor, paid_price_minor, currency, item_transactions (aşağıdaki şema), verified_at, schema_version | Yalnız imza doğrulandıktan sonra yazılır; ödeme olguları iade yanıtıyla ezilmez |
| İade işlemi | `refund_operation` | id (sabit işlem anahtarı), order_id, payment_transaction_id, amount_minor, currency, state (requested/unknown/failed/partial/full), provider_ref, requested_by, created_at, settled_at | Ödeme başına tek etkin iş (`WHERE state IN ('requested','unknown')`) |
| Hak kaynağı | `entitlement_source` | id, user_id, product_code, source_type (purchase/manual), source_id (order_id / grant id), granted_at, revoked_at, revoked_by, reason | Her satın alma ve manuel grant ayrı satır; iade yalnız kendi kaynağını kapatır |
| Etkin erişim (türetilmiş) | `book_entitlements` (geriye uyum için korunur) | user_id, product_code, access_version | Yazarlar aynı transaction ve kilit kuralıyla günceller; satır yalnız açık kaynak varsa bulunur |
| Koşul sürümü | `policy_version` | kind (pre_contract/distance_sales/privacy), locale, version, content_hash, effective_at, immutable_url | Değişmez; içerik kopyası saklanır |
| E-posta kuyruğu | `mail_outbox` | id, order_id, message_kind, template_version, payload (minimum), state, attempts, next_attempt_at, lease_until, lease_version, provider_idempotency_key, provider_message_id, accepted_at, last_error_code | `UNIQUE(order_id, message_kind)` |
| Hız sınırı | `rate_limit` | key (kullanıcı+endpoint türevi), window_start, hits | Anahtar uzunluk sınırı, temizlik işi |

Kullanıcıya açık sütunlar: sipariş durumu, tutar, tarih ve erişim durumu. `raw`, e-posta, telefon, IP, token ve olay tabloları tarayıcıya açılmaz. RLS ile sütun grant'ları birlikte sınanır.

### `payment_fact.item_transactions` projection şeması
`[{ itemId: string≤64, paymentTransactionId: string≤64, transactionStatus: int, price: decimal(10,2), paidPrice: decimal(10,2) }]`, en çok 5 öğe.

Saklanmaz:
- BIN, son 4 hane, kart ailesi ve tipi;
- `token`, `signature`;
- `errorMessage` (yalnız `errorCode` ve kontrollü iç mesaj).

İade yanıtı için ayrı projection: `{ paymentTransactionId, price, currency, status, errorCode }`.

## 2. Durum sözleşmesi

Tek işlem fonksiyonu: Postgres `apply_payment_result(order_id, expected_version, fact jsonb, source)`. SECURITY DEFINER, `SET search_path = pg_catalog, public`, EXECUTE yalnız `service_role`. Callback, webhook, order-status mutabakatı ve IFN, sağlayıcıdan **imzalı Retrieve** aldıktan sonra bu fonksiyonu çağırır. Ağ çağrısı sırasında DB kilidi tutulmaz.

Fonksiyon tek transaction'da:
1. `SELECT … FOR UPDATE` siparişi kilitler; `version` beklenenden farklıysa yeniden okur.
2. Geçiş tablosuna bakar:
   - `paid` yalnız `fraudStatus ∈ {1, 2}` ve tutar/para birimi/sepet eşleşmesiyle olur.
   - `fraudStatus = 0` → `review`.
   - `−1` veya `paymentStatus = FAILURE` → `failed`.
   - Ara durumlar (3DS) değişiklik yapmaz.
3. Geriye gidiş yok:
   - `refunded`/`revoked` → `paid` reddedilir;
   - `paid` → `pending`/`failed` reddedilir;
   - olay zamanı tek ölçüt değildir.
4. `paid` geçişinde aynı transaction'da:
   - `entitlement_source(purchase, order_id)` eklenir (varsa dokunulmaz);
   - `book_entitlements` türetilir;
   - `mail_outbox(order_id, 'receipt')` eklenir.
5. `payment_fact` yazılır, `version` artar.

API `status`, `paymentStatus`, fraud ve erişim durumu ayrı alanlardır. CF yanıtı ve IFN enumları ayrı eşlenir.

## 3. Ödeme başlatma (B01)
`create-checkout` isteği: `{ lang, consent_kinds, terms_version, gsm? }` + `Idempotency-Key` başlığı (istemci her "Ödemeye Git" niyetinde bir UUID üretir; yeniden denemede aynı anahtarı kullanır).

1. Sunucu snapshot'ı kendisi kurar: fiyat env'den, kullanıcı JWT'den, koşul sürümü sunucu sabitinden. İstemcinin sürümü eşleşmezse **409 terms_outdated**, yeni metin gösterilir.
2. `checkout_attempt` ekleme:
   - aynı anahtar + aynı snapshot → aynı deneme döner;
   - aynı anahtar + farklı snapshot → 409;
   - farklı anahtar ama etkin deneme var → mevcut deneme döner (snapshot aynıysa) ya da 409 `checkout_in_progress`.
3. Süreli sahiplenme (`lease_until`), ardından iyzico initialize. Yanıt kaybolursa durum `unknown`: yeni oturum **açılmaz**; mutabakat `retrievePaymentByConversationId` ile yapılır.
4. Token geçerliliği yerel 30 dk varsayımıyla değil, sağlayıcının `tokenExpireTime` değeriyle tutulur.
5. `paymentPageUrl` HTTPS ve izinli iyzico host'u değilse reddedilir.

Hata yanıtları:
- 400 bozuk JSON;
- 422 alan veya onay;
- 409 çatışma ya da eski koşul;
- 429 + `Retry-After`;
- belirsiz sonuçta 202 + mevcut `order_id`.

## 4. İade (B03) ve hak kaynakları (B04)
`refund-book`:
1. `refund_operation` (sabit anahtar) çağrıdan **önce** yazılır.
2. Ödeme başına tek etkin iş; kalan iade edilebilir tutar kuruş aritmetiğiyle hesaplanır.
3. Sağlayıcı yanıtı kaybolursa durum `unknown` olur; mutabakat (reporting `paymentRefundStatus`) yapılmadan yeni çağrı yapılmaz.
4. Kesinleşen **tam iade** `entitlement_source(purchase, order_id)`'yi kapatır (`revoked_at`). Etkin erişim kalan kaynaklardan yeniden türetilir; manuel grant ya da ikinci satın alma varsa erişim sürer.
5. Kısmi iadenin erişime etkisi D01 kararıdır.

`grant-book`: `entitlement_source(manual, grant_id)` ekler. Yönetici yetkisi her çağrıda güncel `has_role` ile denetlenir.

## 5. E-posta (B05)
- `mail_outbox` işi hak ile aynı transaction'da oluşur; gönderim ayrı bir işçide yapılır.
- Sahiplenme: `UPDATE … SET lease_until = now()+interval '2 min', lease_version = lease_version+1 WHERE id=$1 AND (lease_until IS NULL OR lease_until < now()) AND state IN ('pending','retry') RETURNING lease_version`.
- Gönderim, sabit `Idempotency-Key = outbox.id` ile yapılır. Resend anahtarı 24 saat tutar; 24 saati aşan belirsiz iş kör gönderilmez, operatör incelemesine düşer.
- Sonuç yazımı `WHERE lease_version = $sahiplenilen` koşuluyla yapılır; eski işçi yeni sahiplenmeyi silemez.
- "Erişim hazır" içerikli mesaj gönderilmeden önce güncel hak kontrol edilir; arada iade olduysa bastırılır. Tarihsel ödeme makbuzu ayrı bir amaçtır.
- E-posta arızası erişimi geri almaz. API `accepted` durumu teslim edildi ya da okundu demek değildir.

## 6. Uzlaştırma ve webhook (B06, B07)
- **Kalıcı uzlaştırma işi** (pg_cron veya zamanlanmış fonksiyon):
  - kapsam: `initialized`, `unknown`, `review`, `refund unknown`;
  - artan aralıklı retry takvimi, süreli kilit, sorumlu ve operatör ekranı (`/yonetim`);
  - durum bilinmiyorsa `failed` denmez.
- **Webhook:** önce bilinen sipariş + token eşleşmesi; ardından imzalı Retrieve → `apply_payment_result`. 2xx yalnız kalıcı kayıt yazıldıktan sonra döner (iyzico 15 dakikada bir, en çok üç kez dener).
- **V3 imza politikası:**
  - eksik imzaya izin süresi, sahibi ve çıkış kanıtı `karar-kapilari.md` V3 satırında;
  - yanlış imza her modda 401;
  - imzasız olay sayacı ve alarmı.
- Callback (form POST, token), webhook (JSON, V3) ve direct sözleşmeleri ayrıdır. Tüm endpoint'lere kör bir JSON yardımcısı uygulanmaz.

## 7. Limiter (B08) ve parser
- `rate_hit(key text, lim int, window_s int) RETURNS boolean`: tek atomik `INSERT … ON CONFLICT DO UPDATE … RETURNING hits`; pencere DB saatinden.
- Anahtar doğrulanmış kullanıcı + endpoint'ten türer. Kullanıcı anahtar, limit ya da pencere seçemez; serbest `x-forwarded-for` kullanılmaz.
- Kayan pencere ya da iki kova ile sınırdaki çift burst engellenir.
- Webhook bütçesi kullanıcı bütçesinden ayrıdır.
- Checkout, refund ve admin'de DB kararı alınamazsa **503**. Bellek fallback'i yalnız düşük riskli okumada, metrikle. Yetkilendirme fallback ile gevşemez.
- SECURITY DEFINER: sabit `search_path`, schema-qualified adlar; `REVOKE EXECUTE … FROM PUBLIC, anon, authenticated`.
- Parser:
  - method allowlist (405 + `Allow`);
  - `Content-Type` denetimi;
  - Content-Length'e güvenmeden akış okuyarak gövde sınırı (413);
  - şema ve uzunluk doğrulaması (400);
  - imza ham bayt gerektiriyorsa gövde yeniden serileştirilmeden doğrulanır.
- CORS: localhost yalnız geliştirme modunda (`ALLOW_LOCALHOST_ORIGIN`); OPTIONS korunur; Origin'siz sağlayıcı çağrıları engellenmez.

## 8. İçerik erişimi (B10; yazar kararı: anında iptal)
`book-content`:
1. HMAC + süre + amaç (`read`) + ürün + alan tipleri denetlenir.
2. Service rolüyle güncel `book_entitlements` (user, product) ve token'daki `access_version` eşleşmesi aranır. `o = yazar` ise güncel admin rolü aranır.
3. Yoksa 403; sorgu hatasında 503 (fail-closed).
4. İade ve yeniden grant `access_version`'ı artırır; eski token canlanmaz.
5. `Cache-Control: no-store`. Signed URL veya başka indirme yolu aynı politikaya bağlıdır.
6. Logout mevcut token'ı otomatik geçersiz kılmaz; kabul edilen en çok gecikme belgelenir. Teslim edilmiş HTML geri alınamaz.

## 9. Hesap silme ve saklama (B11, L03)
- `book_orders.user_id` → `ON DELETE SET NULL`, nullable. `user_id = null` olan kayıt hak üretmez ve aynı e-postayla açılan yeni hesabın mülkü sayılmaz.
- Silinmiş hesaba gelen callback, iade ya da kuyruk e-postası: ödeme olgusu kaydedilir, hak üretilmez, e-posta bastırılır (`[D05]`).
- SET NULL anonimleştirme değildir. `buyer_email`, `buyer_ip`, telefon ve `raw` için kategori bazlı imha işi kurulur: önce aday sayısıyla dry-run, sonra ayrı yetkili, sınırlı ve tekrar çalıştırılabilir işlem; yedekten dönüşte silme kararları yeniden uygulanır.

## 10. Migration sırası
1. Salt okunur metadata ile yerel migration farkı (D03).
2. Eklemeli migration: yeni tablolar ve nullable kolonlar; sentetik eski kayıtlar; duplicate anahtar sayımı.
3. Çakışmalar çözülünce UNIQUE ve kısmi index'ler eklenir.
4. Eski satırlar için `terms_version = legacy_unknown`; geçmişe uydurma onay yazılmaz.
5. `UPDATE storage.buckets SET public=false WHERE id='book' RETURNING id`: satır sayısı doğrulanır. `public=false`, storage politikalarının doğru olduğunu kanıtlamaz.
6. SQL Editor kullanılırsa: versioned dosya + uygulanan hash kaydı + `supabase migration list` uzlaştırması. Tek deployer.

## 11. Test matrisi (test ortamında; gerçek Postgres, sandbox iyzico, mail sink, A/B/anon/admin JWT)

| Test | Senaryo | Beklenen |
|---|---|---|
| K01 Ödeme yarışı | 10 eşzamanlı callback/status; geç paid/pending; fraud sonrası onay (2) | Tek hak kaynağı; geçiş kaydı; iade geri dönmez |
| K02 Başlatma belirsizliği | Çift oturum; kayıp yanıt; DB yazım hatası; aynı anahtar farklı snapshot | Tek etkin deneme; `unknown` kalıcı; kör yeni ödeme yok |
| K03 İade ve grant | Kısmi/tam/duplicate/timeout; ikinci satın alma ve manuel grant yarışı | Kalan tutar doğru; yalnız ilgili kaynak kapanır |
| K04 Outbox | Gönderim öncesi/sonrası çökme; lease yarışı; 24 saati aşan belirsizlik; e-posta beklerken iade | Kalıcı tek iş; sabit anahtar; uzlaştırma; erişim etkilenmez |
| K05 Yetki ve içerik | A/B/anon; admin rolü geri alma; süresi dolmuş token; DB kesintisi; doğrudan bucket | Yetkisiz bayt veya sütun yok; 401/403/503 doğru; `no-store` |
| K06 Veri azaltma | Sahte `raw` içine PII ve iç içe alan; price ≠ paidPrice; hata mesajı | Gerekli iade alanları kalır; allowlist dışı veri DB'ye, loga ya da istemciye taşınmaz |
| K07 Limiter ve parser | Çok isolate; DB kesintisi; anahtar seli; method/type/aşırı gövde | Tek bütçe; 400/405/413/429/503; yarım iş yok |
| K08 Migration ve silme | Eski/null satır; duplicate; hesap silme; callback; yedekten dönüş | Constraint ve RLS doğru; hayalet grant yok |

Service-role ile başarılı sorgu RLS testi sayılmaz. `deno check` ve yardımcı testleri yararlıdır ama transaction, privilege, yarış ve migration davranışının yerini tutmaz.

## 12. Yayın ve durdurma
- **Sıra:** geriye uyumlu şema → eski ve yeni sözleşmeyi okuyan backend + uzlaştırma → frontend (Idempotency-Key, terms_version, beyanlar) → katı terms ve imza zorunluluğu.
- **İzleme metrikleri:** paid-without-access, unknown/refund-unknown, duplicate kaynak veya outbox, gecikmiş e-posta, terms_outdated, 403/429/503/imza.
- **Durdurma:** finansal ya da hak invariantı bozulursa yeni checkout ve refund durdurulur; kalıcı durum korunur, uzlaştırılır.
- **Geri dönüş:** RLS ve private bucket koruması geri açılmaz, yeni tablolar düşürülmez, e-posta/ödeme/iade kör tekrarlanmaz.
