// book.onuronder.com yapılandırması
window.BOOK_CONFIG = {
  SUPABASE_URL: "https://dtsgewamjkcojffustrg.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0c2dld2Ftamtjb2pmZnVzdHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDAxOTcsImV4cCI6MjA4NTgxNjE5N30.N4KD1QBW1nUFW64-bBOgPwm029Dtt41s_T4ZmjiV0kA",
  FUNCTIONS_URL: "https://dtsgewamjkcojffustrg.supabase.co/functions/v1",
  PRODUCT_CODE: "herkes-icin-yz",
  SUPPORT_EMAIL: "support@fittechs.com",

  // iyzico Checkout Form (siteden başlatılan, sunucuda doğrulanan ödeme). false iken aşağıdaki iyzilink
  // akışı (elle onay) kullanılır. Test için tarayıcıda localStorage.book_checkout_beta = "1".
  // Fiyat: Supabase secret BOOK_PRICE_TRY ile PRICING.label AYNI tutulmalıdır.
  CHECKOUT_ENABLED: false,
  PURCHASE_PAGE: { tr: "/satin-alma", en: "/en/purchase" },

  // Dil başına fiyat + iyzilink. ÖNEMLİ: iyzico panelindeki tutarla buradaki
  // etiket AYNI tutulmalıdır (fiyat iyzico'dan okunamaz; iki yerde elle yönetilir).
  // iyzilink çok para birimlidir ama link başına TEK fiyat/para birimi taşır;
  // EN için dövizli ayrı link oluşturulunca url+label burada güncellenir.
  PRICING: {
    tr: { label: "₺349", url: null },   // iyzico onayı gelince TL linki buraya
    en: { label: "₺349", url: null },   // dövizli link açılana dek TL linkiyle aynı yapılabilir
  },
};
