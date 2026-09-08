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
      created: "Hesap oluşturuldu. E-postana gelen doğrulama linkine tıkla, sonra giriş yap.",
      authFailed: "Olmadı. E-posta ve şifreni kontrol et (şifre en az 8 karakter).",
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
    },
    en: {
      signinTitle: "Sign in", signupTitle: "Create an account",
      switchToSignup: "No account yet? Create one", switchToSignin: "Already have an account? Sign in",
      created: "Account created. Click the verification link in your email, then sign in.",
      authFailed: "That didn’t work. Check your email and password (at least 8 characters).",
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

  // ---- auth modal ----
  let authMode = "signin";
  let onAuthed = null;

  function openAuth(cb) {
    onAuthed = cb || null;
    $("#auth-backdrop").classList.add("show");
    $("#auth-email").focus();
  }
  function closeAuth() {
    $("#auth-backdrop").classList.remove("show");
    const m = $("#auth-msg");
    if (m) { m.className = "form-msg"; m.textContent = ""; }
  }
  function setAuthMode(mode) {
    authMode = mode;
    $("#auth-title").textContent = mode === "signin" ? T.signinTitle : T.signupTitle;
    $("#auth-submit").textContent = mode === "signin" ? T.signinTitle : T.signupTitle;
    $("#auth-switch").textContent =
      mode === "signin" ? T.switchToSignup : T.switchToSignin;
  }

  function wireAuthModal() {
    const bd = $("#auth-backdrop");
    if (!bd) return;
    $("#auth-close").onclick = closeAuth;
    bd.addEventListener("click", (e) => { if (e.target === bd) closeAuth(); });
    $("#auth-switch").onclick = () => setAuthMode(authMode === "signin" ? "signup" : "signin");
    $("#auth-form").onsubmit = async (e) => {
      e.preventDefault();
      const email = $("#auth-email").value.trim();
      const password = $("#auth-password").value;
      const msg = $("#auth-msg");
      msg.className = "form-msg";
      const btn = $("#auth-submit");
      btn.disabled = true;
      try {
        let error;
        if (authMode === "signin") {
          ({ error } = await sb.auth.signInWithPassword({ email, password }));
        } else {
          const r = await sb.auth.signUp({
            email, password,
            options: { emailRedirectTo: window.location.origin + "/" },
          });
          error = r.error;
          if (!error && r.data.user && !r.data.session) {
            msg.className = "form-msg ok";
            msg.textContent = T.created;
            btn.disabled = false;
            setAuthMode("signin");
            return;
          }
        }
        if (error) {
          msg.className = "form-msg err";
          msg.textContent = T.authFailed;
        } else {
          closeAuth();
          if (onAuthed) onAuthed();
          refresh();
        }
      } finally {
        btn.disabled = false;
      }
    };
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
        <div class="field"><label>Not (iyzico işlem no — isteğe bağlı)</label><input id="g-note" type="text"></div>
        <button class="btn btn-ember" type="submit">Kitabı Aç</button>
      </form>
      <div class="admin-result" id="g-result"></div>`;
    $("#grant-form").onsubmit = async (e) => {
      e.preventDefault();
      const res = $("#g-result");
      res.textContent = "Açılıyor…";
      const r = await callFn("grant-book", {
        email: $("#g-email").value, note: $("#g-note").value, lang: "tr",
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
    sb.auth.onAuthStateChange(() => refresh());
  });
})();
