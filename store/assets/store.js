/* book.onuronder.com — ortak istemci mantığı (satış, okuma, yönetim) — TR + EN */
(function () {
  "use strict";
  const C = window.BOOK_CONFIG;
  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
  window.__sb = sb;

  const $ = (sel) => document.querySelector(sel);
  const page = document.body.dataset.page;
  const L = document.body.dataset.lang === "en" ? "en" : "tr";
  const HOME = L === "en" ? "/en/" : "/";
  const READER = L === "en" ? "/en/read" : "/oku";

  const T = {
    tr: {
      signinTitle: "Giriş yap", signupTitle: "Hesap oluştur",
      switchToSignup: "Hesabın yok mu? Oluştur", switchToSignin: "Zaten hesabın var mı? Giriş yap",
      openBook: "Kitabı Aç", signinShort: "GİRİŞ", signoutShort: "çıkış",
      owned: (e) => `Kitap bu hesapta açık: <strong>${e}</strong>. İyi okumalar!`,
      pay: (e) => `Ödeme sayfasında e-posta olarak <strong>${e}</strong> adresini kullan; ` +
        `erişimini bu hesaba tanımlayacağız. Ödemen alındıktan sonra kitabın genellikle birkaç saat içinde açılır ` +
        `ve sana e-posta gelir.`,
      soon: (e) => `Hesabın hazır: <strong>${e}</strong>. Ödeme sayfamız çok yakında açılıyor; ` +
        `açılır açılmaz bu adrese haber vereceğiz.`,
      loading: "KİTABIN AÇILIYOR…", err: "Bir aksilik oldu.", retry: "Tekrar dene",
      notOpen: "Bu kitap henüz açılmamış", needSignin: "Okumak için giriş yapman gerekiyor.",
      backSales: "← satış sayfası", browse: "Kitaba göz at",
      pending: (e) => `Hesap: ${e}. Ödemen alındıysa erişimin kısa süre içinde tanımlanır ve e-posta alırsın.`,
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
      signupDone: "Hesabın oluşturuldu. Doğrulama bağlantısını e-postana gönderdik; tıkladıktan sonra giriş yapabilirsin.",
      errName: "Adını ve soyadını yaz.", errPassLen: "Şifre en az 8 karakter olmalı.",
      errPassMatch: "Şifreler birbirini tutmuyor.", errCreds: "E-posta ya da şifre hatalı.",
      errUnconfirmed: "E-postan henüz doğrulanmamış; gelen kutundaki bağlantıya tıkla.",
      errExists: "Bu e-postayla zaten bir hesap var; giriş yapmayı dene.",
      errRate: "Art arda çok deneme oldu; biraz bekleyip tekrar dene.",
      errGeneric: "Bir aksilik oldu; tekrar dener misin?",
    },
    en: {
      signinTitle: "Sign in", signupTitle: "Create an account",
      switchToSignup: "No account yet? Create one", switchToSignin: "Already have an account? Sign in",
      openBook: "Open the Book", signinShort: "SIGN IN", signoutShort: "sign out",
      owned: (e) => `The book is unlocked on this account: <strong>${e}</strong>. Happy reading!`,
      pay: (e) => `On the payment page, use <strong>${e}</strong> as your email address; ` +
        `we will grant access to this account. Once your payment is received, the book usually unlocks ` +
        `within a few hours and you will get an email.`,
      soon: (e) => `Your account is ready: <strong>${e}</strong>. Our payment page opens very soon; ` +
        `we will let you know at this address the moment it does.`,
      loading: "OPENING YOUR BOOK…", err: "Something went wrong.", retry: "Try again",
      notOpen: "This book is not unlocked yet", needSignin: "You need to sign in to read.",
      backSales: "← back to the book page", browse: "Browse the book",
      pending: (e) => `Account: ${e}. If your payment has been made, access will be granted shortly and you will get an email.`,
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
      signupDone: "Your account has been created. We sent a verification link to your email; sign in after clicking it.",
      errName: "Please enter your full name.", errPassLen: "The password must be at least 8 characters.",
      errPassMatch: "The passwords do not match.", errCreds: "Wrong email or password.",
      errUnconfirmed: "Your email is not verified yet; click the link in your inbox.",
      errExists: "An account with this email already exists; try signing in.",
      errRate: "Too many attempts in a row; wait a little and try again.",
      errGeneric: "Something went wrong; please try again.",
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

  async function callFn(name, body) {
    const { data } = await sb.auth.getSession();
    const jwt = data.session ? data.session.access_token : "";
    const res = await fetch(`${C.FUNCTIONS_URL}/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        apikey: C.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body || {}),
    });
    return { ok: res.ok, status: res.status, json: await res.json().catch(() => ({})) };
  }

  // ---- hesap modalı (giriş / kayıt / şifre sıfırlama — Supabase akışları) ----
  let authMode = "signin";
  let onAuthed = null;

  const F = (id, label, type, auto) =>
    `<div class="field"><label for="${id}">${label}</label>` +
    `<input id="${id}" type="${type}" autocomplete="${auto}" required></div>`;

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
        `<p class="form-msg" id="auth-msg"></p>` +
        `<button class="btn" type="submit" id="auth-submit">${T.signupTitle}</button>` +
        `<div class="acc-links"><span></span><button type="button" class="acc-link" data-go="signin">${T.switchToSignin}</button></div>` +
        `</form>`;
    }
    if (mode === "forgot") {
      return head(T.forgotTitle, T.forgotDesc) +
        `<form id="auth-form">` +
        F("auth-email", T.emailLabel, "email", "email") +
        `<p class="form-msg" id="auth-msg"></p>` +
        `<button class="btn" type="submit" id="auth-submit">${T.forgotSend}</button>` +
        `<div class="acc-links"><button type="button" class="acc-link" data-go="signin">${T.backToSignin}</button><span></span></div>` +
        `</form>`;
    }
    if (mode === "reset") {
      return head(T.resetTitle, T.resetDesc) +
        `<form id="auth-form">` +
        F("auth-password", T.passLabel, "password", "new-password") +
        F("auth-password2", T.pass2Label, "password", "new-password") +
        `<p class="form-msg" id="auth-msg"></p>` +
        `<button class="btn" type="submit" id="auth-submit">${T.resetDo}</button>` +
        `</form>`;
    }
    return head(T.signinTitle, T.signinDesc) +
      `<form id="auth-form">` +
      F("auth-email", T.emailLabel, "email", "email") +
      F("auth-password", T.passLabel, "password", "current-password") +
      `<p class="form-msg" id="auth-msg"></p>` +
      `<button class="btn" type="submit" id="auth-submit">${T.signinTitle}</button>` +
      `<div class="acc-links"><button type="button" class="acc-link" data-go="forgot">${T.forgotLink}</button>` +
      `<button type="button" class="acc-link" data-go="signup">${T.switchToSignup}</button></div>` +
      `</form>`;
  }

  function say(kind, text) {
    const m = $("#auth-msg");
    if (!m) return;
    m.className = "form-msg " + kind;
    m.textContent = text;
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

  async function busy(fn) {
    const btn = $("#auth-submit");
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = T.working;
    try { await fn(); } finally { btn.disabled = false; btn.textContent = label; }
  }

  function renderAuth(mode) {
    authMode = mode;
    $("#auth-body").innerHTML = authTemplate(mode);
    document.querySelectorAll(".acc-link").forEach((b) => (b.onclick = () => renderAuth(b.dataset.go)));
    $("#auth-form").onsubmit = (e) => {
      e.preventDefault();
      if (mode === "signin") return busy(async () => {
        const { error } = await sb.auth.signInWithPassword({
          email: $("#auth-email").value.trim(), password: $("#auth-password").value,
        });
        if (error) return say("err", mapAuthError(error));
        closeAuth();
        if (onAuthed) onAuthed();
        refresh();
      });
      if (mode === "signup") return busy(async () => {
        const name = $("#auth-name").value.trim().replace(/\s+/g, " ");
        const pass = $("#auth-password").value;
        if (name.length < 3 || !name.includes(" ")) return say("err", T.errName);
        if (pass.length < 8) return say("err", T.errPassLen);
        if (pass !== $("#auth-password2").value) return say("err", T.errPassMatch);
        const { data, error } = await sb.auth.signUp({
          email: $("#auth-email").value.trim(), password: pass,
          options: { data: { full_name: name, lang: L }, emailRedirectTo: window.location.origin + HOME },
        });
        if (error) return say("err", mapAuthError(error));
        if (data.user && !data.session) { renderAuth("signin"); say("ok", T.signupDone); return; }
        closeAuth(); if (onAuthed) onAuthed(); refresh();
      });
      if (mode === "forgot") return busy(async () => {
        await sb.auth.resetPasswordForEmail($("#auth-email").value.trim(), {
          redirectTo: window.location.origin + HOME,
        });
        say("ok", T.forgotSent);
      });
      if (mode === "reset") return busy(async () => {
        const pass = $("#auth-password").value;
        if (pass.length < 8) return say("err", T.errPassLen);
        if (pass !== $("#auth-password2").value) return say("err", T.errPassMatch);
        const { error } = await sb.auth.updateUser({ password: pass });
        if (error) return say("err", mapAuthError(error));
        renderAuth("signin"); say("ok", T.resetDone);
      });
    };
    const first = $("#auth-form input");
    if (first) first.focus();
  }

  function openAuth(cb, mode) {
    onAuthed = cb || null;
    renderAuth(mode || "signin");
    $("#auth-backdrop").classList.add("show");
  }
  function closeAuth() { $("#auth-backdrop").classList.remove("show"); }

  function wireAuthModal() {
    const bd = $("#auth-backdrop");
    if (!bd) return;
    $("#auth-close").onclick = closeAuth;
    bd.addEventListener("click", (e) => { if (e.target === bd) closeAuth(); });
  }

  // ---- satış sayfası ----
  async function refreshIndex() {
    const user = await getUser();
    const owned = user ? await hasBook(user.id) : false;
    const state = $("#buy-state");

    document.querySelectorAll("[data-buy]").forEach((btn) => {
      if (owned) btn.textContent = T.openBook;
    });
    const acct = $("#account-line");
    if (acct) {
      if (user) {
        acct.innerHTML = `<span class="muted">${user.email}</span> · <a href="#" id="signout" style="color:#8c8470;">${T.signoutShort}</a>`;
        $("#signout").onclick = async (e) => { e.preventDefault(); await sb.auth.signOut(); refresh(); };
      } else {
        acct.innerHTML = `<a href="#" id="signin-link" style="color:#8c8470;text-decoration:none;">${T.signinShort}</a>`;
        $("#signin-link").onclick = (e) => { e.preventDefault(); openAuth(); };
      }
    }

    if (!state) return;
    if (user && owned) {
      state.className = "buy-state show";
      state.innerHTML = T.owned(user.email);
    } else if (user && !owned) {
      state.className = "buy-state show";
      if (C.IYZILINK_URL) {
        state.innerHTML = T.pay(user.email);
      } else {
        state.innerHTML = T.soon(user.email);
      }
    } else {
      state.className = "buy-state";
    }
  }

  function buyFlow() {
    getUser().then(async (user) => {
      if (!user) { openAuth(buyFlow); return; }
      if (await hasBook(user.id)) { window.location.href = READER; return; }
      if (C.IYZILINK_URL) {
        window.open(C.IYZILINK_URL, "_blank", "noopener");
        refresh();
        document.getElementById("buy-state")?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        refresh();
        document.getElementById("buy-state")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
    if (!(await hasBook(user.id))) {
      frameWrap.innerHTML =
        `<p class="serif" style="font-size:26px;margin:0;">${T.notOpen}</p>` +
        `<p class="muted" style="max-width:360px;font-size:14px;">${T.pending(user.email)}</p>` +
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
      const res = await fetch(
        `${C.FUNCTIONS_URL}/book-content?t=${encodeURIComponent(r.json.token)}&lang=${bookLang}`,
        { headers: { apikey: C.SUPABASE_ANON_KEY } },
      );
      if (!res.ok) throw new Error("content " + res.status);
      const html = await res.text();
      const iframe = document.createElement("iframe");
      iframe.title = "Herkes İçin Yapay Zekâ";
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
      iframe.srcdoc = html;
      const body = $("#reader-body");
      body.querySelectorAll("iframe").forEach((f) => f.remove());
      body.appendChild(iframe);
      wrap.innerHTML = "";
    } catch (e) {
      console.error(e);
      wrap.innerHTML = `<p class="muted">${T.err}</p><button class="btn" onclick="location.reload()">${T.retry}</button>`;
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

  // ---- yönetim ----
  async function initAdmin() {
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
      box.innerHTML = `<p class="muted">Bu sayfa yönetici hesabına özel. (${user.email})</p>`;
      return;
    }
    box.innerHTML =
      `<form id="grant-form">
        <div class="field"><label>Alıcı e-postası</label><input id="g-email" type="email" required placeholder="alici@ornek.com"></div>
        <div class="field"><label>Not (isteğe bağlı iyzico işlem numarası)</label><input id="g-note" type="text"></div>
        <button class="btn btn-ember" type="submit">Kitabı Aç</button>
      </form>
      <div class="admin-result" id="g-result"></div>`;
    $("#grant-form").onsubmit = async (e) => {
      e.preventDefault();
      const res = $("#g-result");
      res.textContent = "Açılıyor…";
      const r = await callFn("grant-book", {
        email: $("#g-email").value, note: $("#g-note").value,
      });
      if (r.ok && r.json.ok) {
        res.innerHTML = `✓ Açıldı: <strong>${$("#g-email").value}</strong>` +
          (r.json.mailed ? " · bilgilendirme e-postası gönderildi" : " · e-posta gönderilemedi (elle haber ver)");
        $("#g-email").value = ""; $("#g-note").value = "";
      } else if (r.status === 404) {
        res.innerHTML = `✗ Bu e-postayla kayıtlı hesap yok. Alıcıdan önce sitede hesap oluşturmasını iste.`;
      } else {
        res.innerHTML = `✗ Olmadı (${r.status}). Tekrar dene.`;
      }
    };
  }

  // ---- kapak kadranı (kitaptaki Basit/Teknik geçişi, native) ----
  function initCoverDial() {
    const strip = $("#dial-strip");
    if (!strip) return;
    const fill = $("#dial-fill"), knob = $("#dial-knob");
    const basit = $("#dial-basit"), teknik = $("#dial-teknik"), mode = $("#dial-mode");
    let dragging = false;
    function setPct(p) {
      p = Math.max(0, Math.min(1, p));
      const pct = (p * 100).toFixed(1) + "%";
      fill.style.width = pct;
      knob.style.left = pct;
      const tek = p >= 0.5;
      basit.style.opacity = tek ? 0 : 1;
      teknik.style.opacity = tek ? 1 : 0;
      mode.textContent = tek ? "TEKNİK" : "BASİT";
    }
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

  // ---- sayfa yönlendirme ----
  function refresh() {
    if (page === "index") refreshIndex();
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireAuthModal();
    document.querySelectorAll("[data-buy]").forEach((b) => (b.onclick = buyFlow));
    if (page === "index") { refreshIndex(); initCoverDial(); }
    if (page === "reader") { wireReaderBar(); initReader(); }
    if (page === "admin") initAdmin();
    sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") openAuth(null, "reset");
      refresh();
    });
  });
})();
