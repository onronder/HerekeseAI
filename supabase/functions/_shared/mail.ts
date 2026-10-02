// Resend ile işlem e-postası. Gönderim book_mail_outbox üzerinden (outbox.ts); erişim e-postayı beklemez.
// Tekrar güvenliği: Idempotency-Key = outbox event_key. Sınır: Resend aynı anahtarı 24 saat tekilleştirir;
// 24 saati aşan belirsiz iş kör gönderilmez (needs_review). "accepted" teslim edildi/okundu anlamına gelmez.
// Yanıt gövdesi loglanmaz (alıcı adresini yansıtabilir).

export interface SendResult {
  ok: boolean;
  permanent: boolean; // tekrar denemenin anlamı yok (ör. 4xx doğrulama hatası)
  providerMessageId: string | null;
  errorCode: string | null;
}

export async function sendResend(p: { to: string; subject: string; html: string; idempotencyKey: string }): Promise<SendResult> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, permanent: false, providerMessageId: null, errorCode: "resend_not_configured" };
  const base = (Deno.env.get("RESEND_API_BASE") ?? "https://api.resend.com").replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
        "Idempotency-Key": p.idempotencyKey.slice(0, 256),
      },
      body: JSON.stringify({
        from: "Herkes İçin Yapay Zekâ <noreply@onuronder.com>",
        to: [p.to],
        subject: p.subject,
        html: p.html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      let id: string | null = null;
      try { id = String(((await res.json()) as { id?: string }).id ?? "") || null; } catch { /* gövde yok */ }
      return { ok: true, permanent: false, providerMessageId: id, errorCode: null };
    }
    // 429 ve 5xx geçici; 409 (aynı anahtar farklı gövde / işleniyor) ve diğer 4xx kalıcı
    const transient = res.status === 429 || res.status >= 500;
    await res.body?.cancel();
    return { ok: false, permanent: !transient, providerMessageId: null, errorCode: `http_${res.status}` };
  } catch (e) {
    return { ok: false, permanent: false, providerMessageId: null, errorCode: (e as Error).name === "TimeoutError" ? "timeout" : "network" };
  }
}

function esc(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function tl(v: unknown): string {
  return `${Number(v).toFixed(2).replace(".", ",")} TL`;
}

export function receiptEmail(o: { lang: "tr" | "en"; orderId: string; price: unknown; paidAt: Date; siteUrl: string; supportEmail: string }) {
  const short = o.orderId.slice(0, 8);
  const date = o.paidAt.toISOString().slice(0, 10);
  if (o.lang === "en") {
    return {
      subject: "Payment received — your book is unlocked — AI for Everyone",
      html:
        `<p>Thank you! Your payment was received and the book is now unlocked on this account.</p>` +
        `<p><a href="${o.siteUrl}/en/read">Start reading</a> — sign in with this email address.</p>` +
        `<p style="color:#666;font-size:13px">Order ${esc(short)} · ${esc(tl(o.price))} · ${date}<br>` +
        `This message is a payment confirmation. Questions: ${esc(o.supportEmail)}</p>`,
    };
  }
  return {
    subject: "Ödemen alındı, kitabın açıldı — Herkes İçin Yapay Zekâ",
    html:
      `<p>Teşekkürler! Ödemen alındı ve kitap bu hesapta açıldı.</p>` +
      `<p><a href="${o.siteUrl}/oku">Okumaya başla</a> — bu e-posta adresinle giriş yapman yeterli.</p>` +
      `<p style="color:#666;font-size:13px">Sipariş ${esc(short)} · ${esc(tl(o.price))} · ${date}<br>` +
      `Bu ileti bir ödeme bilgilendirmesidir. Sorular için: ${esc(o.supportEmail)}</p>`,
  };
}

// Kısmi iade erişimi korur; tam iade erişimi kapatır (metin buna göre)
export function refundEmail(o: { lang: "tr" | "en"; orderId: string; amount: unknown; full: boolean; supportEmail: string }) {
  const short = o.orderId.slice(0, 8);
  if (o.lang === "en") {
    return {
      subject: "Your refund has been issued — AI for Everyone",
      html: `<p>A refund of ${esc(tl(o.amount))} has been issued for your order ${esc(short)}. Depending on your bank it may take a few days to appear on your statement.` +
        (o.full ? ` Book access on this account has been closed.` : ` Your access to the book is unchanged.`) +
        `</p><p>Questions: ${esc(o.supportEmail)}</p>`,
    };
  }
  return {
    subject: "İaden yapıldı — Herkes İçin Yapay Zekâ",
    html: `<p>${esc(short)} numaralı siparişin için ${esc(tl(o.amount))} iade yapıldı. Bankana göre ekstrene yansıması birkaç gün sürebilir.` +
      (o.full ? ` Bu hesaptaki kitap erişimi kapatıldı.` : ` Kitap erişimin değişmedi.`) +
      `</p><p>Sorular için: ${esc(o.supportEmail)}</p>`,
  };
}

export function grantEmail(o: { lang: "tr" | "en"; siteUrl: string; supportEmail: string }) {
  if (o.lang === "en") {
    return {
      subject: "Your book is unlocked — AI for Everyone",
      html: `<p>The book has been unlocked on this account.</p><p><a href="${o.siteUrl}/en/read">Start reading</a> — sign in with this email address.</p><p style="color:#666;font-size:13px">Questions: ${esc(o.supportEmail)}</p>`,
    };
  }
  return {
    subject: "Kitabın açıldı — Herkes İçin Yapay Zekâ",
    html: `<p>Kitap bu hesapta açıldı.</p><p><a href="${o.siteUrl}/oku">Okumaya başla</a> — bu e-posta adresinle giriş yapman yeterli.</p><p style="color:#666;font-size:13px">Sorular için: ${esc(o.supportEmail)}</p>`,
  };
}
