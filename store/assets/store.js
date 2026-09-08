/* book.onuronder.com — ortak istemci mantığı (satış, okuma, yönetim) */
(function () {
  "use strict";
  const C = window.BOOK_CONFIG;
  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
  window.__sb = sb;

  const $ = (sel) => document.querySelector(sel);
  const page = document.body.dataset.page;

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
    $("#auth-title").textContent = mode === "signin" ? "Giriş yap" : "Hesap oluştur";
    $("#auth-submit").textContent = mode === "signin" ? "Giriş yap" : "Hesap oluştur";
    $("#auth-switch").textContent =
      mode === "signin" ? "Hesabın yok mu? Oluştur" : "Zaten hesabın var mı? Giriş yap";
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
            msg.textContent = "Hesap oluşturuldu. E-postana gelen doğrulama linkine tıkla, sonra giriş yap.";
            btn.disabled = false;
            setAuthMode("signin");
            return;
          }
        }
        if (error) {
          msg.className = "form-msg err";
          msg.textContent = "Olmadı. E-posta ve şifreni kontrol et (şifre en az 8 karakter).";
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
      if (owned) btn.textContent = "Kitabı Aç";
    });
    const acct = $("#account-line");
    if (acct) {
      if (user) {
        acct.innerHTML = `<span class="muted">${user.email}</span> · <a href="#" id="signout" style="color:#8c8470;">çıkış</a>`;
        $("#signout").onclick = async (e) => { e.preventDefault(); await sb.auth.signOut(); refresh(); };
      } else {
        acct.innerHTML = `<a href="#" id="signin-link" style="color:#8c8470;text-decoration:none;">GİRİŞ</a>`;
        $("#signin-link").onclick = (e) => { e.preventDefault(); openAuth(); };
      }
    }

    if (!state) return;
    if (user && owned) {
      state.className = "buy-state show";
      state.innerHTML = `Kitap bu hesapta açık: <strong>${user.email}</strong>. İyi okumalar!`;
    } else if (user && !owned) {
      state.className = "buy-state show";
      if (C.IYZILINK_URL) {
        state.innerHTML =
          `Ödeme sayfasında e-posta olarak <strong>${user.email}</strong> adresini kullan; ` +
          `erişimini bu hesaba tanımlayacağız. Ödemen alındıktan sonra kitabın genellikle birkaç saat içinde açılır ` +
          `ve sana e-posta gelir.`;
      } else {
        state.innerHTML = `Hesabın hazır: <strong>${user.email}</strong>. Ödeme sayfamız çok yakında açılıyor; ` +
          `açılır açılmaz bu adrese haber vereceğiz.`;
      }
    } else {
      state.className = "buy-state";
    }
  }

  function buyFlow() {
    getUser().then(async (user) => {
      if (!user) { openAuth(buyFlow); return; }
      if (await hasBook(user.id)) { window.location.href = "/oku"; return; }
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
  let bookLang = "tr";
  async function initReader() {
    const user = await getUser();
    const frameWrap = $("#reader-msg");
    if (!user) {
      frameWrap.innerHTML =
        `<p class="serif" style="font-size:26px;margin:0;">Bu kitap henüz açılmamış</p>` +
        `<p class="muted" style="max-width:340px;font-size:14px;">Okumak için giriş yapman gerekiyor.</p>` +
        `<button class="btn" id="reader-signin">Giriş yap</button>` +
        `<a class="muted" style="font-size:13px;" href="/">← satış sayfası</a>`;
      $("#reader-signin").onclick = () => openAuth(() => location.reload());
      return;
    }
    if (!(await hasBook(user.id))) {
      frameWrap.innerHTML =
        `<p class="serif" style="font-size:26px;margin:0;">Bu kitap henüz açılmamış</p>` +
        `<p class="muted" style="max-width:360px;font-size:14px;">Hesap: ${user.email}. Ödemen alındıysa erişimin kısa süre içinde tanımlanır ve e-posta alırsın.</p>` +
        `<a class="btn" href="/">Kitaba göz at</a>`;
      return;
    }
    loadBook();
  }

  async function loadBook() {
    const wrap = $("#reader-msg");
    wrap.innerHTML = `<p class="muted mono">KİTABIN AÇILIYOR…</p>`;
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
      wrap.innerHTML = `<p class="muted">Bir aksilik oldu.</p><button class="btn" onclick="location.reload()">Tekrar dene</button>`;
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
    if (out) out.onclick = async (e) => { e.preventDefault(); await sb.auth.signOut(); location.href = "/"; };
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
