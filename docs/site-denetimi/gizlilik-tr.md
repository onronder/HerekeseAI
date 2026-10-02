# TASLAK: Gizlilik ve Kişisel Verilerin Korunması (KVKK Aydınlatma Metni)

> **Yayına girmez.** `store/yasal.html#kvkk` bölümünün yerine geçecek taslak (2026-10-02). Kaynak: `veri-envanteri.md`.
> Köşeli parantezler kanıt ya da karar bekler; bu alanlar doldurulup yazar ve hukukçu onaylamadan metin yayımlanmaz.
> Değişiklik gerekçeleri sondaki tabloda.

---

**Veri sorumlusu:** Fittechs Yazılım Anonim Şirketi, Gayrettepe Mah. Yıldız Posta Cad. No: 8/34, İstanbul. İletişim: support@fittechs.com · `[KEP adresi, MERSİS no: D01/L08]`.

**Hangi verileri işliyoruz?**
- **Hesap:** ad soyad, e-posta adresi, parolanın şifrelenmiş özeti, arayüz dili.
- **Satın alma:**
  - sipariş kaydı (ürün, tutar, tarih, durum);
  - sipariş anındaki e-posta adresiniz;
  - verirseniz telefon numaranız;
  - ödeme sırasında bağlandığınız IP adresi;
  - hemen ifa ve cayma hakkı beyanınızın zamanı;
  - iyzico'nun ödeme sonucuna ilişkin bildirdiği işlem bilgileri (işlem numaraları, tutar, durum; kartın ilk 6 ve son 4 hanesi gibi kart özeti bilgileri `[P2 sonrası saklanıyorsa yazılır; saklanmıyorsa bu ifade çıkarılır]`).
- **Okuma:** kitabınıza size özel bir filigran (e-posta adresiniz ve kısa sipariş etiketi) eklenir; okuma bağlantısı 10 dakikalık imzalı bir erişim anahtarıyla açılır.
- **Destek ve yönetim:** bize yazdığınız mesajlar; elle erişim tanımlandığında işlemi yapan yöneticinin bilgisi ve kısa not.
- **Teknik kayıtlar:** hizmet sağlayıcılarımızın güvenlik ve işletim için tuttuğu bağlantı kayıtları (IP, tarayıcı bilgisi, zaman).

Kart numaranız ve güvenlik kodunuz bu siteye gelmez; ödeme iyzico'nun sayfasında alınır. T.C. kimlik numarası ya da adres toplamayız.

**Amaçlar ve hukuki sebepler:**
- Hesabın açılması, satın almanın kurulması ve ifası, erişimin tanımlanması, işlem e-postaları ve destek: KVKK m.5/2-c (sözleşmenin kurulması ve ifası).
- Fatura ve ticari kayıt yükümlülükleri: m.5/2-ç (hukuki yükümlülük).
- Hak iddialarında delil: m.5/2-e.
- Güvenlik kayıtları ve dolandırıcılığın önlenmesi: `[m.5/2-f: denge değerlendirmesiyle kesinleştirilecek]`.
- **Filigran:** `[Dayanak; amaç, zorunluluk, daha az müdahaleci alternatifler (örneğin e-posta yerine opak erişim kodu) ve kişi üzerindeki etkiler değerlendirilerek kesinleştirilecektir.]`

**Alıcılar ve yurt dışına aktarım:**
- **iyzico** `[rolü: veri işleyen / bağımsız veri sorumlusu, sözleşmeye göre]`. Ödeme işlemi için ad soyad, e-posta, telefon (verdiyseniz) ve IP adresini ödeme sayfasına aktarırız.
- **Supabase** `[tüzel kişi]`: hesap, sipariş ve erişim kayıtlarının barındırılması. `[Veri ve uzaktan erişim ülkeleri]`.
- **Resend** `[tüzel kişi]`: işlem e-postalarının gönderimi. `[Ülkeler]`.
- **Vercel** `[tüzel kişi]`: sitenin sunulması. `[Ülkeler, log yeri]`.
- Yurt dışına aktarım, KVKK m.9 kapsamında `[mekanizma: Türk standart sözleşmesi (modül …), imza tarihi, Kurul'a bildirim tarihi: kanıtlanmadan "akdedilmiştir" yazılmaz]` dayanağıyla yapılır.

**Saklama süreleri:**
- Hesap bilgileri: `[hesap kapatılınca … içinde silinir / anonimleştirilir]`.
- Sipariş ve fatura kayıtları: `[ilgili mevzuattaki süre; yalnız bu yükümlülük için gerekli alanlar]`.
- Ödeme işlem bilgileri: `[ ]`.
- Teknik kayıtlar: `[ ]`.
- Destek yazışmaları: `[ ]`.

Süresi dolan veriler periyodik imha ile silinir ya da anonimleştirilir. Hesabınızı kapattığınızda, kanunen saklamamız gereken satış kayıtları erişimi sınırlandırılmış olarak süresi boyunca tutulur; diğer veriler silinir.

**Haklarınız (KVKK m.11):**
- Verilerinizin işlenip işlenmediğini öğrenme ve bilgi isteme;
- düzeltme;
- silme;
- aktarılan üçüncü kişileri öğrenme;
- itiraz;
- zararın giderilmesini isteme.

Başvurularınızı support@fittechs.com adresine ya da `[KEP / yazılı adres]` yoluyla iletebilirsiniz. En geç 30 gün içinde yazılı ya da elektronik ortamda yanıtlarız.

**Çerezler ve yerel depolama:** Sitede reklam, analitik ya da izleme çerezi yoktur. Giriş yaptığınızda oturumunuzun sürmesi için tarayıcınızın yerel depolamasında yalnız zorunlu oturum bilgisi tutulur. Ziyaretçi olarak gezinirken tarayıcınıza bir şey yazılmaz.

---

## Mevcut metne göre değişiklikler

| Mevcut ifade (`store/yasal.html`) | Taslak | Neden |
|---|---|---|
| "yalnızca e-posta adresiniz, hesap kimliğiniz ve erişim kayıtlarınız işlenir" | Tam liste: ad soyad, dil, telefon, IP, ödeme işlem bilgileri, filigran, yönetici notu, teknik kayıtlar | Kod bu verileri işliyor (`veri-envanteri.md`). |
| Kart verileri yalnız iyzico'da | iyzico'ya hangi verilerin aktarıldığı açıkça yazıldı | Ad, e-posta, telefon ve IP iyzico'ya gidiyor (`create-checkout/index.ts:111`). |
| "akdedilen ve standart sözleşme hükümleri içeren veri işleme sözleşmelerine dayanır" | `[kanıt bekliyor]` | DPA veya AB SCC tek başına Türk m.9 mekanizması değildir; imza ve bildirim kanıtı yok. |
| "Supabase'in ABD'deki sunucuları", "ABD merkezli Resend" | `[ülkeler]` | Proje bölgesi ve uzaktan erişim doğrulanmadı. |
| "vergi mevzuatının öngördüğü süreler boyunca" (tüm kayıtlar) | Kategori bazlı | Muhasebe süresi bütün veriye ve ham ödeme yanıtına uygulanamaz (L03). |
| Filigran yalnız GDPR bölümünde m.6/1-f | KVKK bölümünde dayanak kesinleşmedi notu | L01: kesin dayanak yazılmaz. |
| EN: "You may request deletion … at any time" | TR ile eşit: kanunen saklanması gereken kayıtlar istisnası | Silme ile saklama çelişkisi; şema hesap silinince siparişi de siliyordu (P2: SET NULL). |
| EN listesi: "hashed password, record that your account owns the book" | TR ile aynı liste | TR ve EN aynı veri akışını anlatmalı. |
