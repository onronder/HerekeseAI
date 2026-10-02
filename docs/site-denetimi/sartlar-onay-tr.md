# TASLAK: Satış koşulları, onay beyanları, işlem teyidi ve teslim dili

> **Yayına girmez.** İnceleme L02, L04, L05 ve L06 maddelerine göre (2026-10-02). Yazar ve hukukçu onayı gerekir.
> Teknik karşılığı (sürüm ve snapshot kaydı) P2 tasarımında (`odeme-hak-tasarimi.md` §Koşul snapshot'ı).

## 1. Beyanlar birbirinden ayrı tutulur (L02)

| # | Beyan | Biçim | Kayıt |
|---|---|---|---|
| a | Aydınlatma metni sunuldu | Ödeme kutusunda bağlantı + kısa bildirim; **onay kutusu değil** (aydınlatma rızadan bağımsızdır) | "şu sürüm şu dilde sunuldu" |
| b | Ön bilgilendirme formu ve mesafeli satış sözleşmesi | Bağlantılı beyan: "Ön bilgilendirme formunu ve mesafeli satış sözleşmesini okudum, onaylıyorum." | sürüm + dil + içerik hash'i + sunucu zamanı |
| c | Erken ifa talebi ve cayma hakkının kaybı | Ayrı, önceden işaretlenmemiş kutu (mevcut kutu) | aynı kayıtta ayrı alan |
| d | Belirli veri işleme için açık rıza | **Şu an yok;** gerekirse ayrı ve isteğe bağlı, reddi satın almayı engellemez | ayrı kayıt |
| e | Pazarlama izni (ticari ileti) | **Şu an yok;** bülten planlanırsa ayrı, İYS süreciyle | ayrı kayıt |

Satış kutusu KVKK açık rızası sayılmaz.

Mevcut kutu yalnız (c)'yi alıyor. Sözleşme kabulü, yasal sayfadaki "ödemeyi tamamlamakla" maddesine dayanıyor (`store/yasal.html` mesafeli satış m.7). P1'de kutunun yanına yasal metin bağlantısı eklendi. (b) beyanının ayrı alınması bu taslağa göre P2/P3'te yapılır.

### Önerilen metin (TR)
- (b) "<a href=/yasal#on-bilgilendirme>Ön bilgilendirme formunu</a> ve <a href=/yasal#mesafeli-satis>mesafeli satış sözleşmesini</a> okudum ve onaylıyorum."
- (c) "Dijital içeriğin hemen ifasını talep ediyorum; erişim hesabımda tanımlandığında cayma hakkımı kaybedeceğimi biliyorum."

## 2. İşlem teyidi (L04)
Ödeme onaylandıktan sonra alıcıya saklanabilir bir teyit gider. İçeriği:
- satıcı (unvan, adres, iletişim);
- ürün ve biçimi (çevrimiçi okuma, iki dil);
- toplam bedel ve para birimi (KDV dahil);
- sipariş numarası ve tarihi;
- kabul edilen koşul sürümleri ve dili;
- değişmez koşul kopyasının adresi (`/yasal/v/<sürüm>`, sürümlü ve değişmeyen statik dosya) ya da e-postaya ek PDF `[seçim]`;
- cayma istisnası beyanı ve zamanı.

Yalnız değişebilir bir yasal sayfaya bağlantı yeterli sayılmaz. Sağlayıcının "kabul edildi" yanıtı, alıcının e-postayı teslim aldığının kanıtı değildir.

## 3. Cayma istisnası ve tüketici hakları (L05)
- Türkiye: Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ istisnası, **ayıplı ya da hiç teslim edilmemiş içerikte** tüketicinin zorunlu haklarını kaldırmaz.
- SSS'deki iade cevabı, iki iade hâlini bütün hakların kapalı listesi gibi sunmamalı. Önerilen ek: "Bunlar dışında, ayıplı ya da teslim edilmemiş içerik için kanundan doğan haklarınız saklıdır."
- AB tüketicileri hedefleniyorsa Türk istisnası aynen uygulanmaz. Erken ifa için açık talep ve hak kaybının kabulü, kalıcı ortamda teyit ve ifanın fiilen başlaması (ilk okuma mı, erişim tanımı mı) ayrıca değerlendirilir `[D01 hedef ülkeler]`. 19 Haziran 2026'dan itibaren uygulanan AB online cayma işlevi değişikliği (2023/2673) hedef ülke kapsamında kontrol edilir.

## 4. İptal tetikleyicisi ve teslim dili (L06; yazar kararı: taahhütsüz dil)
- **Erişim iptalinin tetikleyicisi:** sağlayıcıda kesinleşen iade (tam iade; kısmi iadenin etkisi işletme kararı `[ ]`). Talep tek başına erişimi kapatmaz. İndirilmiş kopyayı geri alma vaadi verilmez.
- **Teslim dili** (P1'de SSS ve ekran mesajlarına uygulandı):
  > "Bu genellikle saniyeler içinde olur. iyzico'nun güvenlik incelemesine aldığı ödemeler genellikle aynı gün sonuçlanır; gecikirse e-postayla bilgilendiririz."
- **Yasal metinde güncellenecek maddeler** (bu taslak onaylanınca):

| Yer | Mevcut | Önerilen |
|---|---|---|
| `yasal.html` Ön Bilgilendirme, Teslimat | "…genellikle saniyeler içinde; iyzico güvenlik incelemesindeki ödemelerde en geç 24 saatte tamamlanır." | "…genellikle saniyeler içinde tamamlanır; iyzico'nun güvenlik incelemesine aldığı ödemeler genellikle aynı gün sonuçlanır, gecikme olursa alıcı e-postayla bilgilendirilir." |
| `yasal.html` Teslimat ve İade | "(ödeme onaylanınca genellikle anında, en geç 24 saat)" | "(ödeme onaylanınca genellikle anında; güvenlik incelemesinde genellikle aynı gün)" |
| `yasal.html` İade (a) | "ödeme alınıp erişimin 24 saat içinde tanımlanmaması…" | Bu bir **tüketici lehine iade hakkı**, teslim taahhüdü değil. Süre korunabilir ya da `[işletme kararı]` ile değiştirilebilir. |
| `en/legal.html` | "always within 24 hours" | "usually within seconds; payments under iyzico's security review usually clear the same day, and we email you if it takes longer" |

## 5. Satıcı kimliği (L08)
Künyede ve yasal sayfada `[MERSİS no, KEP adresi, telefon]` ve ETBİS kaydı değerlendirilir; fatura düzenleme sorumlusu belirlenir (makbuz ≠ e-arşiv fatura).
