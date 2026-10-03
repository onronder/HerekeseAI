/* book.onuronder.com — ortak istemci mantığı (satış, okuma, yönetim) — TR + EN */
(function () {
  "use strict";
  const C = window.BOOK_CONFIG;
  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
  window.__sb = sb;

  const $ = (sel) => document.querySelector(sel);
  const page = document.body.dataset.page;
  const L = document.body.dataset.lang === "en" ? "en" : "tr";
  const HOME = L === "en" ? "/en" : "/";
  // Supabase Auth izinli yönlendirme listesi /en/ biçiminde kayıtlı; e-posta bağlantıları bu adresi kullanır (/en/ → /en 308 zararsız)
  const AUTH_HOME = L === "en" ? "/en/" : "/";
  const READER = L === "en" ? "/en/read" : "/oku";
  const PRICING = (C.PRICING && C.PRICING[L]) || { label: C.PRICE || "", url: C.IYZILINK_URL || null };
  const PURCHASE = (C.PURCHASE_PAGE && C.PURCHASE_PAGE[L]) || (L === "en" ? "/en/purchase" : "/satin-alma");
  const SUPPORT = C.SUPPORT_EMAIL || "support@fittechs.com";
  let checkoutBeta = false;
  try { checkoutBeta = localStorage.getItem("book_checkout_beta") === "1"; } catch (e) {}
  const CHECKOUT_ON = !!C.CHECKOUT_ENABLED || checkoutBeta;

  // Teslim mesajları tek kaynaktan (site denetimi F06/FAQ14). Kesin süre taahhüdü yok; yasal metindeki madde ayrıca onaylanır.
  const DELIVERY = {
    tr: {
      faq: "Ödemen iyzico tarafından doğrulanır doğrulanmaz kitabı hesabında açıyor, sana da bir bilgilendirme e-postası gönderiyoruz. " +
        "Bu genellikle saniyeler içinde olur. iyzico'nun güvenlik incelemesine aldığı ödemeler genellikle aynı gün sonuçlanır; gecikirse e-postayla bilgilendiririz.",
      review: "iyzico ödemeyi inceliyor; sonuçlanınca kitap açılır ve e-posta gelir. İnceleme genellikle aynı gün sonuçlanır; gecikirse e-postayla bilgilendiririz.",
      slow: "Ödemen alındıysa kitap genellikle birkaç dakika içinde açılır ve e-posta gelir. Bu sayfayı yenileyebilirsin; sonuç netleşmeden yeni bir ödeme başlatma.",
      legacy: "Ödemen alındıktan sonra kitabın açılır ve sana e-posta gelir; bu genellikle aynı gün olur.",
    },
    en: {
      faq: "As soon as iyzico verifies your payment, we unlock the book on your account and send you a confirmation email. " +
        "This usually takes seconds. Payments that iyzico holds for a security review are usually cleared the same day; if it takes longer, we will let you know by email.",
      review: "iyzico is reviewing the payment; once cleared the book unlocks and you get an email. Reviews usually clear the same day; if it takes longer, we will let you know by email.",
      slow: "If your payment went through, the book usually unlocks within a few minutes and you get an email. You can refresh this page; please don't start a new payment until the result is clear.",
      legacy: "Once your payment is received, the book unlocks and you get an email; this usually happens the same day.",
    },
  }[L];

  const T = {
    tr: {
      signinTitle: "Giriş yap", signupTitle: "Hesap oluştur",
      switchToSignup: "Hesabın yok mu? Oluştur", switchToSignin: "Zaten hesabın var mı? Giriş yap",
      openBook: "Kitabı Aç", signinShort: "GİRİŞ", signoutShort: "çıkış",
      owned: (e) => `Kitap bu hesapta açık: <strong>${e}</strong>. İyi okumalar!`,
      pay: (e) => `Ödeme sayfasında e-posta olarak <strong>${e}</strong> adresini kullan; ` +
        `erişimini bu hesaba tanımlayacağız. ` + DELIVERY.legacy,
      soon: (e) => `Hesabın hazır: <strong>${e}</strong>. Ödeme sayfamız çok yakında açılıyor; ` +
        `açılır açılmaz bu adrese haber vereceğiz.`,
      loading: "KİTABIN AÇILIYOR…", err: "Bir aksilik oldu.", retry: "Tekrar dene",
      notOpen: "Bu kitap henüz açılmamış", needSignin: "Okumak için giriş yapman gerekiyor.",
      backSales: "← satış sayfası", browse: "Kitaba göz at",
      pending: (e) => `Hesap: ${e}. Ödemen alındıysa erişimin kısa süre içinde tanımlanır ve e-posta alırsın.`,
      author: (e) => `Yazar erişimin açık: <strong>${e}</strong>. Kitap senin; iyi okumalar!`,
      metaRead: "Oku", ownerEyebrow: "Kitabın",
      confirmWorking: "BAĞLANTI DOĞRULANIYOR…",
      confirmOkSignup: "E-postan doğrulandı! Yönlendiriliyorsun…",
      confirmOkChange: "E-posta adresin güncellendi. Yönlendiriliyorsun…",
      confirmRecovery: "Kimliğin doğrulandı; şimdi yeni şifreni belirle.",
      confirmKind: { signup: "E-POSTA DOĞRULAMA", recovery: "ŞİFRE SIFIRLAMA", email_change: "E-POSTA DEĞİŞİKLİĞİ" },
      linkExpired: "Bu bağlantının süresi dolmuş ya da bağlantı daha önce kullanılmış. Ana sayfadan tekrar deneyebilirsin.",
      toHome: "← Ana sayfa",
      ownerNote: "Kitabın açık · iki dil, bütün bölümler ve demolar",
      consentLabel: "Dijital içeriğin hemen ifasına açık onay veriyorum; erişim hesabımda " +
        "tanımlandığında cayma hakkımı kaybedeceğimi biliyorum.",
      consentGo: "Ödemeye Git", consentNeed: "Devam etmek için onay kutusunu işaretlemen gerekiyor.",
      // Sözleşme kabulü ayrı beyan (tools/site/terms.py bu metni değişmez koşul kopyasına alır)
      consentContractLabel: "Ön Bilgilendirme Formu'nu ve Mesafeli Satış Sözleşmesi'ni okudum ve kabul ediyorum.",
      consentNeedBoth: "Devam etmek için iki onay kutusunu da işaretlemen gerekiyor.",
      consentContractLinks: (v) => `<a href="/yasal#on-bilgilendirme" target="_blank" rel="noopener" style="color:#e85d3a;">Metinler</a> · ` +
        `<a href="/kosullar/${encodeURIComponent(v)}-tr.txt" target="_blank" rel="noopener" style="color:#e85d3a;">değişmez kopya (sürüm ${esc(v)})</a>`,
      accEyebrow: "Hesap", signinDesc: "Kitabına ulaşmak için giriş yap.",
      signupDesc: "Kitap bu hesaba bağlanır; her cihazda bu hesapla okursun.",
      forgotTitle: "Şifreni mi unuttun?",
      forgotDesc: "E-posta adresini yaz; sana yeni şifre belirleme bağlantısı gönderelim.",
      forgotSend: "Sıfırlama bağlantısı gönder",
      forgotSent: "Bağlantı yola çıktı. Gelen kutunu, gerekirse istenmeyen klasörünü kontrol et.",
      resetTitle: "Yeni şifre belirle", resetDesc: "Hesabın için yeni bir şifre seç.",
      resetDo: "Şifreyi güncelle", resetDone: "Şifren güncellendi; artık giriş yapabilirsin.",
      nameLabel: "Ad Soyad", emailLabel: "E-posta", passLabel: "Şifre", pass2Label: "Şifre (tekrar)",
      forgotLink: "Şifremi unuttum", backToSignin: "← Girişe dön", working: "Bir saniye…",
      signupDone: "Hesabın oluşturuldu. Doğrulama bağlantısını e-postana gönderdik; bağlantı seni doğrudan kitaba getirecek.",
      errName: "Adını ve soyadını yaz.", errPassLen: "Şifre en az 8 karakter olmalı.",
      errPassMatch: "Şifreler birbirini tutmuyor.", errCreds: "E-posta ya da şifre hatalı.",
      errUnconfirmed: "E-postan henüz doğrulanmamış; gelen kutundaki bağlantıya tıkla.",
      errExists: "Bu e-postayla zaten bir hesap var; giriş yapmayı dene.",
      errRate: "Art arda çok deneme oldu; biraz bekleyip tekrar dene.",
      errGeneric: "Bir aksilik oldu; tekrar dener misin?",
      payCheckout: (e) => `Ödeme, iyzico'nun güvenli sayfasında alınır. Ödeme onaylanır onaylanmaz kitap bu hesapta açılır ve ` +
        `<strong>${e}</strong> adresine bilgilendirme gelir.`,
      gsmLabel: "Telefon (isteğe bağlı)", gsmHint: "Ödeme sayfasına aktarılır; boş bırakabilirsin.",
      checkoutStartFail: "Ödeme başlatılamadı; biraz sonra tekrar dene.",
      purchaseVerifying: "ÖDEME DOĞRULANIYOR…",
      purchaseOk: "Kitabın açıldı.", purchaseOkNote: "Bilgilendirme e-postası gönderildi. İyi okumalar!", purchaseRead: "Oku",
      purchaseFail: "Ödeme tamamlanamadı.", purchaseFailNote: "Kartından çekim yapılmadı. İstersen tekrar deneyebilirsin.",
      purchaseRetry: "Tekrar dene",
      purchaseReview: "Ödemen alındı, güvenlik incelemesinde.", purchaseReviewNote: DELIVERY.review,
      purchaseSlow: "Doğrulama uzun sürüyor.", purchaseSlowNote: DELIVERY.slow,
      purchaseRefresh: "Yenile", purchaseSignin: "Sonucu görmek için giriş yap.",
      purchaseSupport: (m) => `Sorun yaşarsan: <a href="mailto:${m}" style="color:#e85d3a;">${m}</a>`,
      purchaseNone: "Bu hesapta tamamlanmış bir satın alma görünmüyor.", purchaseNoneNote: "Ödeme yaptıysan ve kitap açılmadıysa bize yaz; yeni bir ödeme başlatmadan önce durumu birlikte kontrol edelim.",
      errOffline: "Bağlantı kurulamadı. İnternet bağlantını kontrol edip tekrar dene.",
      dialBasit: "BASİT", dialTeknik: "TEKNİK",
      dialValue: (n, m) => `Okuma derinliği %${n}, ${m === "t" ? "Teknik" : "Basit"} mod`,
      tickerPause: "Şeridi durdur", tickerPlay: "Şeridi oynat",
      consentLegal: `Ön bilgilendirme formu ve mesafeli satış sözleşmesi: <a href="/yasal" target="_blank" rel="noopener" style="color:#e85d3a;">yasal metinler</a>.`,
      checkoutChecking: "Daha önce başlattığın bir ödeme var ve sonucu kontrol ediliyor. Lütfen yeni bir ödeme başlatma; durumu buradan izleyebilirsin.",
      checkoutStatus: "Ödeme durumunu gör",
      checkoutPaused: "Satış şu anda geçici olarak kapalı. Kısa süre sonra tekrar dene.",
      termsOutdated: "Satış koşulları güncellendi. Sayfayı yenileyip yeni koşulları onaylaman gerekiyor.",
      reload: "Sayfayı yenile",
      purchaseUnknown: "Ödemenin sonucu netleşiyor.", purchaseUnknownNote: "iyzico'dan kesin sonuç henüz gelmedi. Kartından çekim yapıldıysa kitap kendiliğinden açılır ve e-posta gelir. Sonuç netleşmeden yeni bir ödeme başlatma.",
    },
    en: {
      signinTitle: "Sign in", signupTitle: "Create an account",
      switchToSignup: "No account yet? Create one", switchToSignin: "Already have an account? Sign in",
      openBook: "Open the Book", signinShort: "SIGN IN", signoutShort: "sign out",
      owned: (e) => `The book is unlocked on this account: <strong>${e}</strong>. Happy reading!`,
      pay: (e) => `On the payment page, use <strong>${e}</strong> as your email address; ` +
        `we will grant access to this account. ` + DELIVERY.legacy,
      soon: (e) => `Your account is ready: <strong>${e}</strong>. Our payment page opens very soon; ` +
        `we will let you know at this address the moment it does.`,
      loading: "OPENING YOUR BOOK…", err: "Something went wrong.", retry: "Try again",
      notOpen: "This book is not unlocked yet", needSignin: "You need to sign in to read.",
      backSales: "← back to the book page", browse: "Browse the book",
      pending: (e) => `Account: ${e}. If your payment has been made, access will be granted shortly and you will get an email.`,
      author: (e) => `You have author access: <strong>${e}</strong>. The book is yours; happy reading!`,
      metaRead: "Read", ownerEyebrow: "Your Book",
      confirmWorking: "VERIFYING YOUR LINK…",
      confirmOkSignup: "Your email is verified! Redirecting…",
      confirmOkChange: "Your email address has been updated. Redirecting…",
      confirmRecovery: "You're verified; now set your new password.",
      confirmKind: { signup: "EMAIL VERIFICATION", recovery: "PASSWORD RESET", email_change: "EMAIL CHANGE" },
      linkExpired: "This link has expired or has already been used. You can try again from the home page.",
      toHome: "← Home",
      ownerNote: "Your book is unlocked · both languages, every chapter and demo",
      consentLabel: "I expressly consent to the immediate performance of this digital content " +
        "and acknowledge that I lose my right of withdrawal once access is granted to my account.",
      consentGo: "Proceed to Payment", consentNeed: "Please check the consent box to continue.",
      consentContractLabel: "I have read and accept the pre-contract information form and the distance sales contract (the Turkish original is legally binding).",
      consentNeedBoth: "Please check both boxes to continue.",
      consentContractLinks: (v) => `<a href="/en/legal" target="_blank" rel="noopener" style="color:#e85d3a;">Summary</a> · ` +
        `<a href="/kosullar/${encodeURIComponent(v)}-tr.txt" target="_blank" rel="noopener" style="color:#e85d3a;">binding Turkish text (version ${esc(v)})</a>`,
      accEyebrow: "Account", signinDesc: "Sign in to open your book.",
      signupDesc: "The book is tied to this account; you’ll sign in with it to read on any device.",
      forgotTitle: "Forgot your password?",
      forgotDesc: "Enter your email address and we will send you a link to set a new one.",
      forgotSend: "Send reset link",
      forgotSent: "The link is on its way. Check your inbox, and your spam folder if needed.",
      resetTitle: "Set a new password", resetDesc: "Choose a new password for your account.",
      resetDo: "Update password", resetDone: "Your password has been updated; you can sign in now.",
      nameLabel: "Full name", emailLabel: "Email", passLabel: "Password", pass2Label: "Password (again)",
      forgotLink: "Forgot password", backToSignin: "← Back to sign in", working: "One moment…",
      signupDone: "Your account has been created. We sent a verification link to your email; it will take you straight to the book.",
      errName: "Please enter your full name.", errPassLen: "The password must be at least 8 characters.",
      errPassMatch: "The passwords do not match.", errCreds: "Wrong email or password.",
      errUnconfirmed: "Your email is not verified yet; click the link in your inbox.",
      errExists: "An account with this email already exists; try signing in.",
      errRate: "Too many attempts in a row; wait a little and try again.",
      errGeneric: "Something went wrong; please try again.",
      payCheckout: (e) => `Payment is taken on iyzico's secure page. As soon as it is approved, the book unlocks on this account and ` +
        `a confirmation goes to <strong>${e}</strong>.`,
      gsmLabel: "Phone (optional)", gsmHint: "Passed to the payment page; you can leave it empty.",
      checkoutStartFail: "Payment could not be started; please try again in a moment.",
      purchaseVerifying: "VERIFYING PAYMENT…",
      purchaseOk: "Your book is unlocked.", purchaseOkNote: "A confirmation email has been sent. Happy reading!", purchaseRead: "Read",
      purchaseFail: "Payment could not be completed.", purchaseFailNote: "Your card was not charged. You can try again.",
      purchaseRetry: "Try again",
      purchaseReview: "Payment received, under security review.", purchaseReviewNote: DELIVERY.review,
      purchaseSlow: "Verification is taking a while.", purchaseSlowNote: DELIVERY.slow,
      purchaseRefresh: "Refresh", purchaseSignin: "Sign in to see the result.",
      purchaseSupport: (m) => `If something is wrong: <a href="mailto:${m}" style="color:#e85d3a;">${m}</a>`,
      purchaseNone: "There is no completed purchase on this account.", purchaseNoneNote: "If you paid and the book has not unlocked, write to us; let's check the status together before you start a new payment.",
      errOffline: "Couldn't connect. Check your internet connection and try again.",
      dialBasit: "SIMPLE", dialTeknik: "TECHNICAL",
      dialValue: (n, m) => `Reading depth ${n}%, ${m === "t" ? "Technical" : "Simple"} mode`,
      tickerPause: "Pause the strip", tickerPlay: "Play the strip",
      consentLegal: `Pre-contract information and distance sales terms: <a href="/en/legal" target="_blank" rel="noopener" style="color:#e85d3a;">legal information</a>.`,
      checkoutChecking: "You have a payment in progress and its result is being checked. Please don't start a new payment; you can follow its status here.",
      checkoutStatus: "See payment status",
      checkoutPaused: "Sales are temporarily paused. Please try again shortly.",
      termsOutdated: "The sales terms have been updated. Please reload the page and accept the new terms.",
      reload: "Reload the page",
      purchaseUnknown: "The payment result is being confirmed.", purchaseUnknownNote: "We have not received a final result from iyzico yet. If your card was charged, the book unlocks on its own and you get an email. Please don't start a new payment until the result is clear.",
    },
  }[L];

  // ---- ortak: oturum + erişim ----
  async function getUser() {
    const { data } = await sb.auth.getSession();
    return data.session ? data.session.user : null;
  }

  async function hasBook(userId) {
    const { data, error } = await sb
      .from("book_entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("product_code", C.PRODUCT_CODE)
      .maybeSingle();
    if (error) return false;
    return !!data;
  }

  async function isAdmin(userId) {
    const { data } = await sb
      .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    return !!data;
  }

  async function callFn(name, body, extraHeaders) {
    const { data } = await sb.auth.getSession();
    const jwt = data.session ? data.session.access_token : "";
    const res = await fetch(`${C.FUNCTIONS_URL}/${name}`, {
      method: "POST",
      headers: Object.assign({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        apikey: C.SUPABASE_ANON_KEY,
      }, extraHeaders || {}),
      body: JSON.stringify(body || {}),
    });
    return { ok: res.ok, status: res.status, json: await res.json().catch(() => ({})) };
  }

  // "Yeniden yükle" düğmeleri: satır içi onclick yerine tek dinleyici (CSP script-src 'self', satır içi handler yok)
  document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest("[data-reload]")) location.reload(); });

  // innerHTML'e giren kullanıcı verisi (e-posta vb.) için HTML kaçışı
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---- hesap modalı (giriş / kayıt / şifre sıfırlama — Supabase akışları) ----
  // Erişilebilir diyalog (APG): açıkken arka plan inert, Tab döngüsü, Escape, odak dönüşü.
  // authGen: modal yeniden çizilince ya da kapanınca artar; geç dönen eski yanıt ekrana uygulanmaz.
  let authMode = "signin";
  let onAuthed = null;
  let authGen = 0;
  let authOpener = null;
  let authInflight = false;

  const F = (id, label, type, auto) =>
    `<div class="field"><label for="${id}">${label}</label>` +
    `<input id="${id}" type="${type}" autocomplete="${auto}" required></div>`;

  // Durum bölgesi form çizilirken boş olarak bulunur; metin sonradan bir kez yazılır (ekran okuyucu duyurusu).
  const MSG = `<p class="form-msg" id="auth-msg" role="status" aria-live="polite" aria-atomic="true"></p>`;

  function authTemplate(mode) {
    const head = (title, desc) =>
      `<p class="mono acc-eyebrow">${T.accEyebrow}</p><h2 id="auth-title">${title}</h2>` +
      `<p class="acc-desc">${desc}</p>`;
    if (mode === "signup") {
      return head(T.signupTitle, T.signupDesc) +
        `<form id="auth-form">` +
        F("auth-name", T.nameLabel, "text", "name") +
        F("auth-email", T.emailLabel, "email", "email") +
        F("auth-password", T.passLabel, "password", "new-password") +
        F("auth-password2", T.pass2Label, "password", "new-password") +
        MSG +
        `<button class="btn" type="submit" id="auth-submit">${T.signupTitle}</button>` +
        `<div class="acc-links"><span></span><button type="button" class="acc-link" data-go="signin">${T.switchToSignin}</button></div>` +
        `</form>`;
    }
    if (mode === "forgot") {
      return head(T.forgotTitle, T.forgotDesc) +
        `<form id="auth-form">` +
        F("auth-email", T.emailLabel, "email", "email") +
        MSG +
        `<button class="btn" type="submit" id="auth-submit">${T.forgotSend}</button>` +
        `<div class="acc-links"><button type="button" class="acc-link" data-go="signin">${T.backToSignin}</button><span></span></div>` +
        `</form>`;
    }
    if (mode === "reset") {
      return head(T.resetTitle, T.resetDesc) +
        `<form id="auth-form">` +
        F("auth-password", T.passLabel, "password", "new-password") +
        F("auth-password2", T.pass2Label, "password", "new-password") +
        MSG +
        `<button class="btn" type="submit" id="auth-submit">${T.resetDo}</button>` +
        `</form>`;
    }
    return head(T.signinTitle, T.signinDesc) +
      `<form id="auth-form">` +
      F("auth-email", T.emailLabel, "email", "email") +
      F("auth-password", T.passLabel, "password", "current-password") +
      MSG +
      `<button class="btn" type="submit" id="auth-submit">${T.signinTitle}</button>` +
      `<div class="acc-links"><button type="button" class="acc-link" data-go="forgot">${T.forgotLink}</button>` +
      `<button type="button" class="acc-link" data-go="signup">${T.switchToSignup}</button></div>` +
      `</form>`;
  }

  function clearInvalid() {
    document.querySelectorAll("#auth-form [aria-invalid]").forEach((f) => {
      f.removeAttribute("aria-invalid"); f.removeAttribute("aria-describedby");
    });
  }
  // fieldId verilirse alan hatalı işaretlenir ve mesaja bağlanır (aria-invalid + aria-describedby)
  function say(kind, text, fieldId) {
    const m = $("#auth-msg");
    if (!m) return;
    clearInvalid();
    m.className = "form-msg " + kind;
    m.textContent = text;
    const f = fieldId && document.getElementById(fieldId);
    if (f) { f.setAttribute("aria-invalid", "true"); f.setAttribute("aria-describedby", "auth-msg"); f.focus(); }
  }

  function mapAuthError(err) {
    const m = (err && err.message) || "";
    if (/invalid login credentials/i.test(m)) return T.errCreds;
    if (/email not confirmed/i.test(m)) return T.errUnconfirmed;
    if (/already registered|already exists/i.test(m)) return T.errExists;
    if (/rate limit|too many/i.test(m)) return T.errRate;
    if (/at least|password should/i.test(m)) return T.errPassLen;
    return T.errGeneric;
  }

  function isOffline(err) {
    return navigator.onLine === false || /failed to fetch|networkerror|load failed|network/i.test((err && err.message) || "");
  }
  // Tek gönderim (single-flight): Enter, çift tıklama ve programatik submit aynı bayrağa takılır.
  // fn(stale): stale() true dönerse modal bu arada kapandı/yeniden çizildi; sonuç ekrana uygulanmaz.
  async function busy(fn) {
    if (authInflight) return;
    authInflight = true;
    const gen = authGen;
    const stale = () => gen !== authGen;
    const btn = $("#auth-submit");
    const label = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = T.working; }
    try { await fn(stale); }
    catch (e) { if (!stale()) say("err", isOffline(e) ? T.errOffline : T.errGeneric); }
    finally {
      authInflight = false;
      if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = label; }
    }
  }

  function renderAuth(mode) {
    authMode = mode;
    authGen++;
    authInflight = false;
    $("#auth-body").innerHTML = authTemplate(mode);
    document.querySelectorAll(".acc-link").forEach((b) => (b.onclick = () => renderAuth(b.dataset.go)));
    document.querySelectorAll("#auth-form input").forEach((f) => f.addEventListener("input", () => {
      if (f.hasAttribute("aria-invalid")) { f.removeAttribute("aria-invalid"); f.removeAttribute("aria-describedby"); }
    }));
    $("#auth-form").onsubmit = (e) => {
      e.preventDefault();
      if (mode === "signin") return busy(async (stale) => {
        const { error } = await sb.auth.signInWithPassword({
          email: $("#auth-email").value.trim(), password: $("#auth-password").value,
        });
        if (stale()) return;
        if (error) return say("err", isOffline(error) ? T.errOffline : mapAuthError(error));
        closeAuth();
        if (onAuthed) onAuthed();
        refresh();
      });
      if (mode === "signup") return busy(async (stale) => {
        const name = $("#auth-name").value.trim().replace(/\s+/g, " ");
        const pass = $("#auth-password").value;
        if (name.length < 3 || !name.includes(" ")) return say("err", T.errName, "auth-name");
        if (pass.length < 8) return say("err", T.errPassLen, "auth-password");
        if (pass !== $("#auth-password2").value) return say("err", T.errPassMatch, "auth-password2");
        const { data, error } = await sb.auth.signUp({
          email: $("#auth-email").value.trim(), password: pass,
          options: { data: { full_name: name, lang: L }, emailRedirectTo: window.location.origin + AUTH_HOME },
        });
        if (stale()) return;
        if (error) return say("err", isOffline(error) ? T.errOffline : mapAuthError(error));
        if (data.user && !data.session) { renderAuth("signin"); say("ok", T.signupDone); return; }
        closeAuth(); if (onAuthed) onAuthed(); refresh();
      });
      if (mode === "forgot") return busy(async (stale) => {
        // Bilinmeyen hesapta Supabase hata vermez; mesaj nötr kalır. Ağ/limit hatasında sahte başarı gösterilmez.
        const { error } = await sb.auth.resetPasswordForEmail($("#auth-email").value.trim(), {
          redirectTo: window.location.origin + AUTH_HOME,
        });
        if (stale()) return;
        if (error) return say("err", isOffline(error) ? T.errOffline : (/rate limit|too many/i.test(error.message || "") ? T.errRate : T.errGeneric));
        say("ok", T.forgotSent);
      });
      if (mode === "reset") return busy(async (stale) => {
        const pass = $("#auth-password").value;
        if (pass.length < 8) return say("err", T.errPassLen, "auth-password");
        if (pass !== $("#auth-password2").value) return say("err", T.errPassMatch, "auth-password2");
        const { error } = await sb.auth.updateUser({ password: pass });
        if (stale()) return;
        if (error) return say("err", isOffline(error) ? T.errOffline : mapAuthError(error));
        if (page === "confirm") {
          say("ok", T.resetDone);
          setTimeout(() => { window.location.href = HOME; }, 1500);
          return;
        }
        renderAuth("signin"); say("ok", T.resetDone);
      });
    };
    // Odak yalnız diyalog görünürken taşınır (görünmez öğeye focus() etkisizdir)
    if ($("#auth-backdrop").classList.contains("show")) focusFirst();
  }

  const TABBABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function tabbables() {
    return [...document.querySelectorAll("#auth-backdrop .modal " + TABBABLE.split(",").join(",#auth-backdrop .modal "))]
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
  }
  function focusFirst() {
    const first = $("#auth-form input") || tabbables()[0];
    (first || $("#auth-backdrop .modal")).focus();
  }
  function setBackgroundInert(on) {
    const bd = $("#auth-backdrop");
    [...document.body.children].forEach((el) => {
      if (el === bd || el.tagName === "SCRIPT") return;
      if (on) el.setAttribute("inert", ""); else el.removeAttribute("inert");
    });
  }
  function openAuth(cb, mode) {
    const bd = $("#auth-backdrop");
    onAuthed = cb || null;
    if (!bd.classList.contains("show")) {
      authOpener = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
      bd.classList.add("show");
      setBackgroundInert(true);
    }
    renderAuth(mode || "signin");
  }
  function closeAuth() {
    const bd = $("#auth-backdrop");
    if (!bd.classList.contains("show")) return;
    authGen++;
    authInflight = false;
    bd.classList.remove("show");
    setBackgroundInert(false);
    // Odak dönüşü: açan öğe hâlâ sayfadaysa ona; değilse hesap bağlantısına ya da sayfa başlığına
    let target = authOpener && authOpener.isConnected ? authOpener : null;
    if (!target) target = document.querySelector("#account-line a, .reader-bar a, h1, h2");
    if (target) {
      if (!target.matches(TABBABLE)) target.setAttribute("tabindex", "-1");
      target.focus();
    }
    authOpener = null;
  }

  function wireAuthModal() {
    const bd = $("#auth-backdrop");
    if (!bd) return;
    const dlg = bd.querySelector(".modal");
    dlg.setAttribute("tabindex", "-1");
    $("#auth-close").onclick = closeAuth;
    bd.addEventListener("click", (e) => { if (e.target === bd) closeAuth(); });
    bd.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeAuth(); return; }
      if (e.key !== "Tab") return;
      const t = tabbables();
      if (!t.length) { e.preventDefault(); dlg.focus(); return; }
      const first = t[0], last = t[t.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dlg)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // ---- satış sayfası ----
  function fillPrices() {
    document.querySelectorAll("[data-price]").forEach((el) => (el.textContent = PRICING.label));
  }

  async function refreshIndex() {
    fillPrices();
    const user = await getUser();
    let owned = user ? await hasBook(user.id) : false;
    if (user && !owned && await reconcilePendingOrder(user.id)) owned = true;
    // Beta bayrağı açıkken yazar hesabı da alıcı görünümünü alır (sandbox testi; okuma yetkisi book-token'da korunur).
    const author = user && !owned && !checkoutBeta ? await isAdmin(user.id) : false;
    const isOwner = owned || author;
    const wasOwner = document.body.classList.contains("owner");
    if (!isOwner && wasOwner) { location.reload(); return; }
    if (isOwner && !wasOwner) {
      document.body.classList.add("owner");
      const metaCta = document.querySelector(".cover-meta .ember-link");
      if (metaCta) { metaCta.textContent = T.metaRead; metaCta.setAttribute("href", READER); }
      const startBtn = document.querySelector(".cover-cta .cbtn");
      if (startBtn) startBtn.setAttribute("href", READER);
      const note = document.querySelector(".cover-note");
      if (note) note.textContent = T.ownerNote;
      const eyebrow = document.querySelector(".price-panel")?.closest("section")?.querySelector(".sec-eyebrow");
      if (eyebrow) eyebrow.textContent = T.ownerEyebrow;
    }
    const state = $("#buy-state");

    document.querySelectorAll("[data-buy]").forEach((btn) => {
      if (isOwner) btn.textContent = T.openBook;
    });
    const acct = $("#account-line");
    if (acct) {
      if (user) {
        acct.innerHTML = `<span class="muted acct-email" title="${esc(user.email)}">${esc(user.email)}</span><span class="acct-sep" aria-hidden="true"> · </span><a href="#" id="signout" style="color:#8c8470;">${T.signoutShort}</a>`;
        $("#signout").onclick = async (e) => { e.preventDefault(); await sb.auth.signOut(); refresh(); };
      } else {
        acct.innerHTML = `<a href="#" id="signin-link" style="color:#8c8470;text-decoration:none;">${T.signinShort}</a>`;
        $("#signin-link").onclick = (e) => { e.preventDefault(); openAuth(); };
      }
    }

    if (!state) return;
    if (user && isOwner) {
      state.className = "buy-state show";
      state.innerHTML = author ? T.author(esc(user.email)) : T.owned(esc(user.email));
    } else if (user && !owned) {
      state.className = "buy-state show";
      if (CHECKOUT_ON) {
        state.innerHTML = T.payCheckout(esc(user.email)) +
          `<div class="field" style="margin-top:14px;"><label>${T.gsmLabel}</label>` +
          `<input id="gsm-box" type="tel" inputmode="tel" placeholder="05xx xxx xx xx" autocomplete="tel">` +
          `<p class="muted" style="font-size:12px;margin:6px 0 0;">${T.gsmHint}</p></div>` +
          `<label style="display:flex;gap:10px;align-items:flex-start;margin-top:14px;cursor:pointer;">` +
          `<input type="checkbox" id="contract-box" style="margin-top:3px;accent-color:#e85d3a;">` +
          `<span style="font-size:13px;line-height:1.55;color:#b8b0a0;">${T.consentContractLabel} ${T.consentContractLinks(C.TERMS_VERSION)}</span></label>` +
          `<label style="display:flex;gap:10px;align-items:flex-start;margin-top:10px;cursor:pointer;">` +
          `<input type="checkbox" id="consent-box" style="margin-top:3px;accent-color:#e85d3a;">` +
          `<span style="font-size:13px;line-height:1.55;color:#b8b0a0;">${T.consentLabel}</span></label>` +
          `<button class="btn btn-ember" id="consent-go" style="margin-top:14px;">${T.consentGo}</button>` +
          `<p class="form-msg" id="consent-msg" role="status" aria-live="polite" aria-atomic="true" style="margin-top:10px;"></p>`;
        const cbox = $("#consent-box"), kbox = $("#contract-box");
        for (const b of [cbox, kbox]) b.addEventListener("change", () => { b.removeAttribute("aria-invalid"); b.removeAttribute("aria-describedby"); });
        let starting = false;
        // Satın alma niyeti başına bir Idempotency-Key: aynı niyetin yeniden denemesi aynı işi döndürür
        let checkoutKey = null;
        $("#consent-go").onclick = async () => {
          if (starting) return;
          const m = $("#consent-msg");
          // İki ayrı beyan: sözleşme kabulü ve hemen ifa/cayma beyanı (biri diğerinin yerine geçmez)
          const unchecked = [kbox, cbox].filter((b) => !b.checked);
          if (unchecked.length) {
            m.className = "form-msg err"; m.textContent = T.consentNeedBoth;
            for (const b of unchecked) { b.setAttribute("aria-invalid", "true"); b.setAttribute("aria-describedby", "consent-msg"); }
            unchecked[0].focus();
            return;
          }
          starting = true;
          const btn = $("#consent-go");
          btn.disabled = true; btn.textContent = T.working; m.className = "form-msg"; m.textContent = "";
          const start = async () => {
            if (!checkoutKey) checkoutKey = crypto.randomUUID();
            try {
              return await callFn("create-checkout",
                { lang: L, consent: true, consent_contract: true, gsm: $("#gsm-box").value, terms_version: C.TERMS_VERSION },
                { "Idempotency-Key": checkoutKey });
            } catch (e) { return { ok: false, status: 0, json: {}, offline: isOffline(e) }; }
          };
          let r = await start();
          // Önceki deneme sonuçlandı (başarısız/kapandı) ya da anahtar başka içerikle kullanılmış: yeni niyet, bir kez
          if (r.status === 409 && (r.json.code === "retry_new_attempt" || r.json.code === "idempotency_conflict")) {
            checkoutKey = null;
            r = await start();
          }
          if (!btn.isConnected) return; // bu arada görünüm yeniden çizildi (çıkış, sahiplik değişimi)
          if (r.ok && r.json.alreadyOwned) { refreshIndex(); return; }
          if (r.ok && r.json.paymentPageUrl) { location.href = r.json.paymentPageUrl; return; }
          starting = false;
          btn.disabled = false; btn.textContent = T.consentGo;
          m.className = "form-msg err";
          if (r.status === 202 && r.json.orderId) {
            m.innerHTML = esc(T.checkoutChecking) + ` <a href="${PURCHASE}?order=${encodeURIComponent(r.json.orderId)}" style="color:#e85d3a;">${T.checkoutStatus}</a>`;
            btn.disabled = true; // açık ödeme varken yeni ödeme önerilmez
            return;
          }
          if (r.status === 409 && r.json.code === "terms_outdated") {
            m.innerHTML = esc(T.termsOutdated) + ` <button class="acc-link" data-reload>${T.reload}</button>`;
            return;
          }
          if (r.status === 503 && r.json.code === "paused") { m.textContent = T.checkoutPaused; return; }
          if (r.status === 429) { m.textContent = T.errRate; return; }
          m.innerHTML = esc(r.offline ? T.errOffline : T.checkoutStartFail) + " " + T.purchaseSupport(SUPPORT);
        };
      } else if (PRICING.url) {
        state.innerHTML = T.pay(esc(user.email)) +
          `<label style="display:flex;gap:10px;align-items:flex-start;margin-top:14px;cursor:pointer;">` +
          `<input type="checkbox" id="consent-box" style="margin-top:3px;accent-color:#e85d3a;">` +
          `<span style="font-size:13px;line-height:1.55;color:#b8b0a0;">${T.consentLabel} ${T.consentLegal}</span></label>` +
          `<button class="btn btn-ember" id="consent-go" style="margin-top:14px;">${T.consentGo}</button>` +
          `<p class="form-msg" id="consent-msg" role="status" aria-live="polite" aria-atomic="true" style="margin-top:10px;"></p>`;
        $("#consent-go").onclick = async () => {
          const m = $("#consent-msg");
          if (!$("#consent-box").checked) { m.className = "form-msg err"; m.textContent = T.consentNeed; return; }
          // Eski iyzilink yolu (CHECKOUT_ENABLED=false). Onay kaydı yazılamazsa ödeme sayfası açılmaz.
          const { error } = await sb.auth.updateUser({ data: { withdrawal_consent_at: new Date().toISOString() } });
          if (error) { m.className = "form-msg err"; m.textContent = isOffline(error) ? T.errOffline : T.errGeneric; return; }
          window.open(PRICING.url, "_blank", "noopener");
        };
      } else {
        state.innerHTML = T.soon(esc(user.email));
      }
    } else {
      state.className = "buy-state";
    }
  }

  function buyFlow() {
    getUser().then(async (user) => {
      if (!user) { openAuth(buyFlow); return; }
      if (await hasBook(user.id) || (!checkoutBeta && await isAdmin(user.id))) { window.location.href = READER; return; }
      await refreshIndex();
      document.getElementById("buy-state")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ---- reader ----
  let bookLang = document.body.dataset.booklang || (L === "en" ? "en" : "tr");
  async function initReader() {
    const user = await getUser();
    const frameWrap = $("#reader-msg");
    if (!user) {
      frameWrap.innerHTML =
        `<p class="serif" style="font-size:26px;margin:0;">${T.notOpen}</p>` +
        `<p class="muted" style="max-width:340px;font-size:14px;">${T.needSignin}</p>` +
        `<button class="btn" id="reader-signin">${T.signinTitle}</button>` +
        `<a class="muted" style="font-size:13px;" href="${HOME}">${T.backSales}</a>`;
      $("#reader-signin").onclick = () => openAuth(() => location.reload());
      return;
    }
    // Yetki kararını sunucu verir (erişim kaydı YA DA yönetici rolü)
    let probe = await callFn("book-token", {});
    if (!probe.ok && await reconcilePendingOrder(user.id)) probe = await callFn("book-token", {});
    if (!probe.ok) {
      frameWrap.innerHTML =
        `<p class="serif" style="font-size:26px;margin:0;">${T.notOpen}</p>` +
        `<p class="muted" style="max-width:360px;font-size:14px;">${T.pending(esc(user.email))}</p>` +
        `<a class="btn" href="${HOME}">${T.browse}</a>`;
      return;
    }
    loadBook();
  }

  async function loadBook() {
    const wrap = $("#reader-msg");
    wrap.innerHTML = `<p class="muted mono">${T.loading}</p>`;
    try {
      const r = await callFn("book-token", {});
      if (!r.ok || !r.json.token) throw new Error("token");
      // İçerik fetch edilip srcdoc ile basılır: Supabase gateway'i fonksiyon
      // yanıtlarının Content-Type'ını ezebildiği için iframe.src kullanılamıyor.
      // Token, loglara düşmemesi için query yerine Authorization başlığında.
      const res = await fetch(
        `${C.FUNCTIONS_URL}/book-content?lang=${bookLang}`,
        { headers: { apikey: C.SUPABASE_ANON_KEY, Authorization: `Bearer ${r.json.token}` } },
      );
      if (!res.ok) throw new Error("content " + res.status);
      let html = await res.text();
      // Derin bağlantı (#m=N&s=K): srcdoc iframe üst sayfanın hash'ini göremez; kitaba enjekte edilir.
      const deep = (location.hash || "").replace(/^#/, "");
      const inject = `<script>window.__DEEPLINK=${JSON.stringify(deep)};<\/script>`;
      html = html.includes("</body>") ? html.replace("</body>", inject + "</body>") : html + inject;
      const iframe = document.createElement("iframe");
      iframe.title = bookLang === "en" ? "AI for Everyone" : "Herkes İçin Yapay Zekâ";
      iframe.setAttribute("sandbox", "allow-scripts");
      iframe.srcdoc = html;
      const body = $("#reader-body");
      body.querySelectorAll("iframe").forEach((f) => f.remove());
      body.appendChild(iframe);
      wrap.innerHTML = "";
    } catch (e) {
      console.error("reader:", (e && e.message) || "error"); // ayrıntı (token/yanıt gövdesi) konsola yazılmaz
      wrap.innerHTML = `<p class="muted">${T.err}</p><button class="btn" data-reload>${T.retry}</button>`;
    }
  }

  function wireReaderBar() {
    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.onclick = () => {
        bookLang = b.dataset.lang;
        document.querySelectorAll("[data-lang]").forEach((x) =>
          x.classList.toggle("active", x === b));
        loadBook();
      };
    });
    const out = $("#reader-signout");
    if (out) out.onclick = async (e) => { e.preventDefault(); await sb.auth.signOut(); location.href = HOME; };
  }

  // ---- güvenlik ağı: yarım kalan sipariş varsa sunucuya (iyzico mutabakatı) sor ----
  // Alıcı ödeme sırasında sekmeyi kapatır ve webhook gelmezse, siteye döndüğünde burada tamamlanır.
  async function reconcilePendingOrder(userId) {
    try {
      const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      const { data } = await sb.from("book_orders").select("id").eq("user_id", userId)
        .in("status", ["initialized", "unknown", "review", "mismatch"]).gte("created_at", since)
        .order("created_at", { ascending: false }).limit(1);
      if (!data || !data.length) return false;
      const r = await callFn("order-status", { orderId: data[0].id });
      return !!(r.ok && (r.json.entitled || r.json.status === "paid"));
    } catch (e) { return false; }
  }

  // ---- satın alma dönüş sayfası ----
  async function initPurchase() {
    const box = $("#purchase-box");
    const q = new URLSearchParams(location.search);
    const orderId = /^[0-9a-f-]{36}$/i.test(q.get("order") || "") ? q.get("order") : null;
    const hint = q.get("status");
    const show = (title, note, actions) => {
      box.innerHTML = `<p class="serif" style="font-size:26px;margin:0;">${title}</p>` +
        (note ? `<p class="muted" style="max-width:380px;font-size:14px;">${note}</p>` : "") + (actions || "");
    };
    const user = await getUser();
    if (!user) {
      show(T.purchaseVerifying, T.purchaseSignin, `<button class="btn" id="p-signin">${T.signinTitle}</button>`);
      $("#p-signin").onclick = () => openAuth(() => location.reload());
      return;
    }
    const ok = () => show(T.purchaseOk, T.purchaseOkNote, `<a class="btn btn-ember" href="${READER}">${T.purchaseRead}</a>`);
    const fail = () => show(T.purchaseFail, T.purchaseFailNote + "<br>" + T.purchaseSupport(SUPPORT),
      `<a class="btn" href="${HOME}?buy=1">${T.purchaseRetry}</a>`);
    const review = () => show(T.purchaseReview, T.purchaseReviewNote + "<br>" + T.purchaseSupport(SUPPORT),
      `<a class="muted" style="font-size:13px;" href="${HOME}">${T.toHome}</a>`);
    const slow = () => show(T.purchaseSlow, T.purchaseSlowNote + "<br>" + T.purchaseSupport(SUPPORT),
      `<button class="btn" data-reload>${T.purchaseRefresh}</button>`);
    const unknown = () => show(T.purchaseUnknown, T.purchaseUnknownNote + "<br>" + T.purchaseSupport(SUPPORT),
      `<button class="btn" data-reload>${T.purchaseRefresh}</button>`);
    const none = () => show(T.purchaseNone, T.purchaseNoneNote + "<br>" + T.purchaseSupport(SUPPORT),
      `<a class="muted" style="font-size:13px;" href="${HOME}">${T.toHome}</a>`);
    if (!orderId) { if (await hasBook(user.id)) ok(); else none(); return; }
    show(T.purchaseVerifying, "");
    // Sonuç sunucudan: order-status (gerekirse iyzico ile mutabakat). Tarayıcıdaki status yalnız ipucu.
    const deadline = Date.now() + 45000;
    // Karar yalnız sunucunun doğruladığı durumdan; URL'deki status ipucu sonucu belirlemez. 404 = bu hesaba ait sipariş yok.
    let lastStatus = "";
    while (Date.now() < deadline) {
      let r;
      try { r = await callFn("order-status", { orderId }); } catch (e) { r = { ok: false, status: 0, json: {} }; }
      if (r.ok) {
        const st = r.json.status;
        lastStatus = st || lastStatus;
        if (r.json.entitled || st === "paid") { ok(); return; }
        if (st === "failed" || st === "expired" || st === "expired_confirmed") { fail(); return; }
        if (st === "review") { review(); return; }
      } else if (r.status === 404) { none(); return; }
      await new Promise((res) => setTimeout(res, hint === "fail" ? 1000 : 2000));
    }
    if (lastStatus === "unknown" || lastStatus === "mismatch") unknown(); else slow();
  }

  // ---- yönetim ----
  async function initAdmin() {
    // Sayfa içi onay: ilk tıklama düğmeyi "Onayla: …" yapar (6 sn), ikinci tıklama işi yapar.
    // Yerleşik confirm/alert bazı tarayıcı ortamlarında gösterilmez ve otomatik reddedilir.
    const armed = (b, label) => {
      if (b.dataset.armed === "1") { clearTimeout(b._armT); delete b.dataset.armed; b.textContent = b.dataset.orig; return true; }
      b.dataset.orig = b.textContent; b.dataset.armed = "1"; b.textContent = label;
      b._armT = setTimeout(() => { delete b.dataset.armed; b.textContent = b.dataset.orig; }, 6000);
      return false;
    };
    // Kalıcı bildirim: liste yeniden çizilse de sonuç ekranda kalır (8 sn; ekran okuyucuya duyurulur)
    const toast = (msg) => {
      let t = document.getElementById("admin-toast");
      if (!t) {
        t = document.createElement("div"); t.id = "admin-toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite");
        t.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;max-width:640px;margin:0 auto;padding:12px 16px;background:#f1eadb;color:#1a1a1a;font-size:14px;z-index:50;box-shadow:0 4px 18px rgba(0,0,0,.4);";
        document.body.appendChild(t);
      }
      t.textContent = msg; t.hidden = false;
      clearTimeout(t._h); t._h = setTimeout(() => { t.hidden = true; }, 8000);
    };

    const user = await getUser();
    const box = $("#admin-box");
    if (!user) {
      box.innerHTML = `<p class="muted">Yönetim için giriş yap.</p><button class="btn" id="adm-signin">Giriş yap</button>`;
      $("#adm-signin").onclick = () => openAuth(() => location.reload());
      return;
    }
    const { data: role } = await sb
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!role) {
      box.innerHTML = `<p class="muted">Bu sayfa yönetici hesabına özel. (${esc(user.email)})</p>`;
      return;
    }
    // Yönetim (P2): yetki sunucuda (güncel admin rolü + RPC'de aktör doğrulaması); bu ekran yalnız arayüzdür.
    const tl = (v) => `${Number(v).toFixed(2)} TL`;
    box.innerHTML =
      `<section class="adm-sec"><h3 class="serif">İşletim</h3><div id="ops-box" class="admin-result">Yükleniyor…</div></section>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,.12);margin:26px 0;">
      <section class="adm-sec"><h3 class="serif">Elle erişim</h3>
      <form id="grant-form">
        <div class="field"><label for="g-email">Alıcı e-postası</label><input id="g-email" type="email" required placeholder="alici@ornek.com"></div>
        <div class="field"><label for="g-note">Not (isteğe bağlı)</label><input id="g-note" type="text" maxlength="200"></div>
        <button class="btn btn-ember" type="submit">Erişim aç</button>
        <button class="btn" type="button" id="g-list" style="margin-left:8px;">Kaynakları listele</button>
      </form>
      <div class="admin-result" id="g-result" role="status" aria-live="polite"></div></section>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,.12);margin:26px 0;">
      <section class="adm-sec"><h3 class="serif">İade</h3>
      <form id="refund-form">
        <p class="muted" style="font-size:13px;">Alıcının e-postasıyla siparişleri listele. "İade et" tutar boş bırakılırsa kalan tutarın tamamını iade eder; kısmi iade erişimi korur, toplam tam tutara ulaşınca erişim kapanır. Sonucu belirsiz kalan iade için yeni çağrı yapılmaz; "Uzlaştır" iyzico raporlamasıyla eşleştirir. İade iyzico panelinden yapıldıysa "Panelde iade edildi" ile kayda bağla.</p>
        <div class="field"><label for="r-email">Alıcı e-postası</label><input id="r-email" type="email" required placeholder="alici@ornek.com"></div>
        <button class="btn" type="submit">Siparişleri listele</button>
      </form>
      <div class="admin-result" id="r-result" role="status" aria-live="polite"></div></section>`;

    // ---- işletim: ayarlar + sağlık
    const loadOps = async () => {
      const r = await callFn("admin-settings", { action: "get" });
      const ob = $("#ops-box");
      if (!r.ok) { ob.textContent = `✗ ${r.json.code || r.status}`; return; }
      const st = r.json.settings || {}, h = r.json.health || {};
      const age = h.last_ok_run ? Math.round((Date.now() - new Date(h.last_ok_run).getTime()) / 60000) : null;
      const warn = (c) => c ? ` style="color:#e8a08a;"` : "";
      ob.innerHTML =
        `<p style="font-size:13px;">Satış: <strong>${st.checkout_enabled ? "açık" : "DURDURULDU"}</strong> <button class="btn" data-set="checkout_enabled" data-val="${!st.checkout_enabled}" style="padding:4px 10px;font-size:12px;">${st.checkout_enabled ? "Durdur" : "Aç"}</button>
         · İade başlatma: <strong>${st.refunds_enabled ? "açık" : "DURDURULDU"}</strong> <button class="btn" data-set="refunds_enabled" data-val="${!st.refunds_enabled}" style="padding:4px 10px;font-size:12px;">${st.refunds_enabled ? "Durdur" : "Aç"}</button></p>
         <p class="mono" style="font-size:12px;line-height:1.8;">
         <span${warn(age === null || age > 15)}>Son başarılı işçi çalışması: ${age === null ? "yok" : age + " dk önce"}</span><br>
         <span${warn(h.paid_without_access > 0)}>Ödenmiş ama erişimi yok: ${h.paid_without_access ?? "?"}</span> ·
         <span${warn(h.access_without_source > 0)}>Kaynağı olmayan erişim: ${h.access_without_source ?? "?"}</span><br>
         <span${warn(h.open_orders_over_1h > 0)}>1 saati aşan açık sipariş: ${h.open_orders_over_1h ?? "?"}</span> ·
         <span${warn(h.orders_mismatch > 0)}>Tutar uyuşmazlığı: ${h.orders_mismatch ?? "?"}</span> ·
         <span${warn(h.orders_conflict > 0)}>Çelişki: ${h.orders_conflict ?? "?"}</span><br>
         <span${warn(h.refunds_attention > 0)}>İlgi bekleyen iade: ${h.refunds_attention ?? "?"}</span> ·
         <span${warn(h.outbox_needs_review > 0)}>İncelenecek e-posta: ${h.outbox_needs_review ?? "?"}</span> ·
         <span${warn(h.outbox_stale > 0)}>Bekleyen e-posta (1 sa+): ${h.outbox_stale ?? "?"}</span></p>`;
      ob.querySelectorAll("[data-set]").forEach((b) => {
        b.onclick = async () => {
          const val = b.dataset.val === "true";
          if (!val && !armed(b, "Onayla: durdur")) return;
          const rr = await callFn("admin-settings", { action: "set", key: b.dataset.set, value: val });
          toast(rr.ok ? "✓ Kaydedildi" : `✗ Olmadı: ${rr.json.code || rr.status}`);
          loadOps();
        };
      });
    };
    loadOps();

    // ---- elle erişim
    const listSources = async () => {
      const res = $("#g-result");
      res.textContent = "Kaynaklar alınıyor…";
      const r = await callFn("grant-book", { action: "list", email: $("#g-email").value.trim() });
      if (!r.ok) { res.textContent = r.status === 404 ? "✗ Bu e-postayla kayıtlı hesap yok." : `✗ ${r.json.code || r.status}`; return; }
      const acc = r.json.access || {};
      res.innerHTML = `<p style="font-size:13px;">Erişim: <strong>${acc.active ? "açık" : "kapalı"}</strong></p>` +
        (r.json.sources.length ? r.json.sources.map((x) =>
          `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px;">` +
          `<span class="mono">${esc(x.source_type === "purchase" ? "satın alma" : "elle")}</span> · ${esc(x.granted_at.slice(0, 16).replace("T", " "))}` +
          (x.note ? ` · ${esc(x.note)}` : "") +
          (x.revoked_at ? ` · <em>kapalı (${esc(x.revoke_reason || "")})</em>` : (x.source_type === "manual" ? ` <button class="btn" data-revoke="${esc(x.id)}" style="margin-left:8px;padding:4px 10px;font-size:12px;">Kapat</button>` : "")) +
          `</div>`).join("") : `<p class="muted" style="font-size:13px;">Kaynak yok.</p>`);
      res.querySelectorAll("[data-revoke]").forEach((b) => {
        b.onclick = async () => {
          if (!armed(b, "Onayla: kapat")) return;
          const rr = await callFn("grant-book", { action: "revoke", sourceId: b.dataset.revoke, reason: "admin" });
          toast(rr.ok ? "✓ Kaynak kapatıldı" : `✗ Olmadı: ${rr.json.code || rr.status}`);
          listSources();
        };
      });
    };
    $("#g-list").onclick = listSources;
    let granting = false;
    $("#grant-form").onsubmit = async (e) => {
      e.preventDefault();
      if (granting) return;
      granting = true;
      const res = $("#g-result");
      res.textContent = "Açılıyor…";
      try {
        const r = await callFn("grant-book", { action: "grant", email: $("#g-email").value, note: $("#g-note").value });
        if (r.ok && r.json.ok) {
          res.innerHTML = `✓ Açıldı: <strong>${esc($("#g-email").value)}</strong>` +
            (r.json.mailed ? " · bilgilendirme e-postası gönderildi" : " · e-posta kuyrukta; işçi yeniden deneyecek");
          $("#g-note").value = "";
        } else if (r.status === 404) {
          res.textContent = "✗ Bu e-postayla kayıtlı hesap yok. Alıcıdan önce sitede hesap oluşturmasını iste.";
        } else {
          res.textContent = `✗ Olmadı (${r.json.code || r.status}).`;
        }
      } finally { granting = false; }
    };

    // ---- iade
    const opLabel = { requested: "istendi", unknown: "SONUÇ BELİRSİZ", settled: "tamamlandı", failed: "başarısız", needs_review: "ELLE İNCELE" };
    const listOrders = async () => {
      const res = $("#r-result");
      res.textContent = "Siparişler alınıyor…";
      const r = await callFn("refund-book", { action: "list", email: $("#r-email").value.trim() });
      if (!r.ok) { res.textContent = `✗ ${r.json.code || r.status}`; return; }
      if (!r.json.orders.length) { res.textContent = "Bu e-postayla sipariş yok."; return; }
      const ops = r.json.refund_ops || [];
      res.innerHTML = r.json.orders.map((o) => {
        const mine = ops.filter((x) => x.order_id === o.id);
        const settled = mine.filter((x) => x.state === "settled").reduce((a, x) => a + Number(x.settled_amount || 0), 0);
        const paid = Number(o.paid_price ?? o.price);
        const active = mine.find((x) => x.state === "requested" || x.state === "unknown");
        const d = (o.paid_at || o.created_at).slice(0, 16).replace("T", " ");
        const can = (o.status === "paid" || o.status === "review") && o.iyzico_payment_id && !active;
        return `<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px;">` +
          `<span class="mono">${esc(o.id.slice(0, 8))}</span> · ${d} · ${esc(tl(paid))} · <strong>${esc(o.status)}</strong>` +
          (o.provider_env && o.provider_env !== "live" ? ` · <em>${esc(o.provider_env)}</em>` : "") +
          // Sipariş teyidi: kabul edilen koşul sürümü + değişmez kopya bağlantısı (özetin ilk 12 hanesi)
          (o.terms_version ? ` · <a class="mono" href="/kosullar/${encodeURIComponent(o.terms_version)}-tr.txt" target="_blank" rel="noopener" style="color:#e85d3a;" title="SHA-256 ${esc(o.terms_hash || "")}">koşullar ${esc(o.terms_version)}${o.terms_hash ? " · " + esc(String(o.terms_hash).slice(0, 12)) : ""}</a>` : "") +
          (settled ? ` · iade edilen ${esc(tl(settled))}, kalan ${esc(tl(paid - settled))}` : "") +
          mine.map((x) => `<div class="mono muted" style="font-size:11px;margin-top:3px;">iade ${esc(tl(x.amount))}: ${esc(opLabel[x.state] || x.state)}${x.error_code ? " · " + esc(x.error_code) : ""}` +
            ((x.state === "unknown" || x.state === "requested") ? ` <button class="btn" data-recon="${esc(x.id)}" style="padding:2px 8px;font-size:11px;">Uzlaştır</button>` : "") + `</div>`).join("") +
          (can ? `<div style="margin-top:6px;"><input type="number" step="0.01" min="0.01" max="${(paid - settled).toFixed(2)}" placeholder="tutar (boş = kalan)" data-amt="${esc(o.id)}" style="width:150px;padding:4px 8px;background:#171614;border:1px solid rgba(242,234,215,.2);color:#f2ead7;">` +
            ` <button class="btn" data-refund="${esc(o.id)}" style="padding:4px 10px;font-size:12px;">İade et</button>` +
            ` <button class="btn" data-mark="${esc(o.id)}" style="padding:4px 10px;font-size:12px;">Panelde iade edildi</button></div>` : "") +
          `<div class="mono muted" id="r-line-${esc(o.id.slice(0, 8))}" style="font-size:11px;margin-top:4px;"></div></div>`;
      }).join("");
      const hm = (iso) => { try { return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return iso; } };
      const unknownText = (j) => j.reason === "provider_unreachable" ? `… iyzico raporlamasına ulaşılamadı${j.provider_status ? " (HTTP " + j.provider_status + ")" : ""}; kayıt değişmedi`
        : j.reason === "provider_failure" ? `… iyzico raporlama hatası${j.provider_code ? " (" + j.provider_code + ")" : ""}; kayıt değişmedi`
        : j.reason === "no_record_yet" ? `… iyzico'da bu iadeye ait kayıt henüz yok; ${hm(j.review_after)} sonrası elle incelemeye düşer`
        : "… sonuç belirsiz; yeni çağrı yapılmadı, uzlaştırılacak";
      const outcomeText = (j) => j.outcome === "unknown" ? unknownText(j) : ({ refunded: "✓ tam iade tamamlandı, erişim kapandı", partial: "✓ kısmi iade tamamlandı, erişim korunuyor", needs_review: "! eşleşme belirsiz: elle incele", failed: "✗ iyzico iadeyi reddetti", unchanged: "değişiklik yok" }[j.outcome] || JSON.stringify(j));
      res.querySelectorAll("[data-refund],[data-mark]").forEach((b) => {
        b.onclick = async () => {
          const id = b.dataset.refund || b.dataset.mark;
          const action = b.dataset.refund ? "refund" : "mark_refunded";
          const amtEl = res.querySelector(`[data-amt="${id}"]`);
          const amount = amtEl && amtEl.value ? Number(amtEl.value) : null;
          if (!armed(b, action === "refund" ? `Onayla: ${amount ? tl(amount) : "kalanın tamamı"} iade` : "Onayla: panel iadesini bağla")) return;
          b.disabled = true;
          const line = document.getElementById("r-line-" + id.slice(0, 8));
          line.textContent = "iyzico ile görüşülüyor…";
          const rr = await callFn("refund-book", { orderId: id, action, amount });
          const msg = rr.ok ? outcomeText(rr.json) : `✗ ${rr.json.code || rr.status}${rr.json.remaining != null ? " · kalan " + tl(rr.json.remaining) : ""}`;
          line.textContent = msg;
          toast(msg);
          setTimeout(listOrders, 1200);
        };
      });
      res.querySelectorAll("[data-recon]").forEach((b) => {
        b.onclick = async () => {
          b.disabled = true;
          const rr = await callFn("refund-book", { action: "reconcile", opId: b.dataset.recon });
          toast(rr.ok ? outcomeText(rr.json) : `✗ ${rr.json.code || rr.status}`);
          listOrders();
        };
      });
    };
    $("#refund-form").onsubmit = (e) => { e.preventDefault(); listOrders(); };
  }

  // ---- kapak kadranı (kitaptaki Basit/Teknik geçişi, native) ----
  function initCoverDial() {
    const strip = $("#dial-strip");
    if (!strip) return;
    const fill = $("#dial-fill"), knob = $("#dial-knob");
    const basit = $("#dial-basit"), teknik = $("#dial-teknik"), mode = $("#dial-mode");
    let dragging = false;
    let cur = 0;
    // Tek yol: pointer ve klavye aynı fonksiyonla görseli ve ARIA değerlerini günceller (APG slider)
    function setPct(p) {
      p = Math.round(Math.max(0, Math.min(1, p)) * 100) / 100;
      cur = p;
      const pct = (p * 100).toFixed(1) + "%";
      fill.style.width = pct;
      knob.style.left = pct;
      const tek = p >= 0.5;
      basit.style.opacity = tek ? 0 : 1;
      teknik.style.opacity = tek ? 1 : 0;
      basit.setAttribute("aria-hidden", tek ? "true" : "false");
      teknik.setAttribute("aria-hidden", tek ? "false" : "true");
      mode.textContent = tek ? T.dialTeknik : T.dialBasit;
      const n = Math.round(p * 100);
      strip.setAttribute("aria-valuenow", String(n));
      strip.setAttribute("aria-valuetext", T.dialValue(n, tek ? "t" : "b"));
    }
    strip.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 0.1, ArrowUp: 0.1, ArrowLeft: -0.1, ArrowDown: -0.1, PageUp: 0.25, PageDown: -0.25 }[e.key];
      if (step !== undefined) { e.preventDefault(); setPct(cur + step); return; }
      if (e.key === "Home") { e.preventDefault(); setPct(0); }
      if (e.key === "End") { e.preventDefault(); setPct(1); }
    });
    function fromEvent(e) {
      const r = strip.getBoundingClientRect();
      setPct((e.clientX - r.left) / r.width);
    }
    strip.addEventListener("pointerdown", (e) => {
      dragging = true;
      strip.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    strip.addEventListener("pointermove", (e) => { if (dragging) fromEvent(e); });
    strip.addEventListener("pointerup", () => { dragging = false; });
    setPct(0.12);
  }

  // ---- demo şeridi: görünür durdur/oynat (hareket azaltma tercihinde CSS zaten durdurur) ----
  function initTicker() {
    const btn = $("#ticker-toggle"), sec = document.querySelector(".ticker-sec");
    if (!btn || !sec) return;
    const sync = () => {
      const paused = sec.classList.contains("paused");
      btn.setAttribute("aria-pressed", paused ? "true" : "false");
      btn.textContent = paused ? T.tickerPlay : T.tickerPause;
    };
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) sec.classList.add("paused");
    btn.onclick = () => { sec.classList.toggle("paused"); sync(); };
    sync();
  }

  // ---- e-posta bağlantısı doğrulama sayfası (/auth/confirm) ----
  async function initConfirm() {
    const q = new URLSearchParams(window.location.search);
    const tokenHash = q.get("token_hash");
    const rawType = q.get("type");
    const type = ["signup", "recovery", "email_change"].includes(rawType) ? rawType : "signup";
    const box = $("#confirm-box");
    const kind = $("#confirm-kind");
    const home = $("#confirm-home");
    if (home) home.setAttribute("href", HOME);
    if (kind) kind.textContent = T.confirmKind[type] || "";
    const fail = () => {
      box.innerHTML =
        `<p class="serif" style="font-size:24px;margin:0;max-width:420px;">${T.linkExpired}</p>` +
        `<a class="btn" href="${HOME}">${T.toHome}</a>`;
    };
    if (!tokenHash) { fail(); return; }
    box.innerHTML = `<p class="muted mono">${T.confirmWorking}</p>`;
    const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) { console.error(error); fail(); return; }
    if (type === "recovery") {
      box.innerHTML = `<p class="serif" style="font-size:24px;margin:0;">${T.confirmRecovery}</p>`;
      openAuth(null, "reset");
      return;
    }
    box.innerHTML = `<p class="serif" style="font-size:24px;margin:0;">` +
      (type === "email_change" ? T.confirmOkChange : T.confirmOkSignup) + `</p>`;
    const dest = type === "email_change" ? HOME : HOME + "?buy=1";
    setTimeout(() => { window.location.href = dest; }, 1500);
  }

  // ---- sayfa yönlendirme ----
  function refresh() {
    if (page === "index") refreshIndex();
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireAuthModal();
    document.querySelectorAll("[data-buy]").forEach((b) => (b.onclick = buyFlow));
    if (page === "index") {
      // Basılı kitaptaki QR'lar ve eski paylaşımlar: /#m=N&s=K → okuyucuya (sahip değilse giriş/satın alma görünür)
      if (/^#m=\d/.test(location.hash)) { location.replace(READER + location.hash); return; }
      refreshIndex(); initCoverDial(); initTicker();
      if (new URLSearchParams(location.search).has("buy")) {
        history.replaceState(null, "", location.pathname + location.hash);
        buyFlow();
      }
    }
    if (page === "reader") { wireReaderBar(); initReader(); }
    if (page === "admin") initAdmin();
    if (page === "purchase") initPurchase();
    if (page === "confirm") initConfirm();
    sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") openAuth(null, "reset");
      refresh();
    });
  });
})();
