# Karar kapıları (D01–D06 ve L07–L10)

Her kapı kapanınca bu tabloya sahip, karar, kanıt bağlantısı ve tarih yazılır. Kapı açıkken bağlı iş "yayına hazır" yapılmaz.
Teknik hazır / işletme kararı tamam / hukuk onaylı / üretimde doğrulandı durumları ayrı tutulur.

| Kapı | Doldurulacak alanlar | Bekleyen işler | Sahip | Karar | Kanıt | Tarih |
|---|---|---|---|---|---|---|
| **D01** İşletme ve ürün | Fiili hedef ülkeler (AB/ABD satışı var mı, reklam hedeflemesi); erişim süresi; lisans kapsamı; güncelleme vaadi; manuel teslim süresi; destek ve iade işleyişi; kısmi iadenin erişime etkisi | P3 satış koşulları; teslim dili (yazar 2026-10-02: taahhütsüz dil, P1'de uygulandı); P2 iade kuralları | Yazar | `[ ]` | | |
| **D02** Sağlayıcı ve hukuk kanıtı | Supabase, Resend, Vercel, iyzico için: sözleşme tarafı (tüzel kişi), plan, rol (işleyen/sorumlu), veri ve uzaktan erişim ülkeleri, alt işleyenler; Türk standart sözleşmesi modülü, imzalar, 5 iş günü bildirim alındısı; Auth SMTP sağlayıcısı; log ve yedek süreleri | P3 gizlilik metni; KVKK m.9 uygunluk kararı | Veri sorumlusu (Fittechs) + hukukçu | `[ ]` | | |
| **D03** Üretim metadata | Salt okunur: RLS politikaları, sütun grant'ları, `has_role`/`user_roles` tanımları ve EXECUTE hakları, bucket public/private bayrağı, fonksiyon sürümleri, env adları ve modu (değer değil) | P2 SEC02 fark raporu | Yazar (DB) | `[ ]` | | |
| **D04** Ödeme sözleşmesi | iyzico canlı alan kuralları (telefon, kimlik, adres, IP omission/null izni); webhook olay ve imza biçimi (HPP V3 aktivasyonu); callback ayrımı; sorgu ve iade durumları; token geçerlilik süresi | P2 checkout_attempt, webhook, iade | Yazar + iyzico | `[ ]` | | |
| **D05** Saklama ve iptal | Kategori bazlı saklama süreleri ve legal hold; imha yöntemi; erişim iptalinde kabul edilen gecikme (yazar 2026-10-02: anında iptal) | P2 veri azaltma, imha işi, access_version | Veri sorumlusu + hukukçu + yazar | `[ ]` | | |
| **D06** İndeksleme ve araçlar | İndeks niyeti (yazar 2026-10-02: satış, hakkında, demo, yasal TR+EN, **P1'de uygulandı**); test araçları: Vercel preview, test hesabı, mail sink, VoiceOver cihazı | P1 kabul (preview), P2 test ortamı | Yazar | İndeks: karar verildi | `tools/site/routes.json` | 2026-10-02 |
| **L07** Yurt dışı aktarım | D02 ile aynı; bilinmeyen bölge, yedek ve destek erişimi taslakta boş bırakılarak kapatılmış sayılmaz | Gizlilik metni yayını | Fittechs + hukukçu | `[ ]` | | |
| **L08** Satıcı kimliği | Ticari unvan, merkez adresi, MERSİS, KEP, telefon; ETBİS değerlendirmesi; işlem rehberi; fatura düzenleme, düzeltme ve iade sorumlusu | Künye, yasal sayfa, işlem teyidi | Fittechs | `[ ]` | | |
| **L09** Depolama | Giriş/checkout/iyzico akışında tarayıcı depolama envanteri (anonim kısım ölçüldü: `depolama-envanteri.md`); `book_checkout_beta`'nın üretimde kalıp kalmayacağı | Çerez metni teyidi | Yazar | Anonim: ölçüldü | `depolama-envanteri.json` | 2026-10-02 |
| **L10** Kapsam | GDPR (AB kuruluşu, hedefleme, izleme); CCPA (California bağlantısı, eşikler, bağlı kuruluş); VERBİS (çalışan sayısı, mali bilanço, ana faaliyet); hak başvurusu iş akışı (sorumlu, süre, kimlik doğrulama, yazılı yanıt) | Uluslararası bölüm metni | Fittechs + hukukçu | `[ ]` | | |
| **V3** Webhook imzası | iyzico'da HPP V3 aktivasyonu; sandbox imzalı örnek ve yanlış imza testi; imzasız modun bitiş tarihi ve sahibi | `IYZICO_WEBHOOK_REQUIRE_SIGNATURE=true` | Yazar + iyzico | `[ ]` | | |
