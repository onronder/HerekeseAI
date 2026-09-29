// Resend ile e-posta (grant-book kalıbı). Best-effort: başarısızlık yetkiyi etkilemez.

export async function sendResend(p: { to: string; subject: string; html: string }): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.error("RESEND_API_KEY missing; mail skipped");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        from: "Herkes İçin Yapay Zekâ <noreply@onuronder.com>",
        to: [p.to],
        subject: p.subject,
        html: p.html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("resend failed:", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("resend error:", e);
    return false;
  }
}

function esc(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function receiptEmail(o: {
  lang: "tr" | "en";
  orderId: string;
  price: string;
  paidAt: Date;
  siteUrl: string;
  supportEmail: string;
}): { subject: string; html: string } {
  const short = o.orderId.slice(0, 8);
  const date = o.paidAt.toISOString().slice(0, 10);
  const amount = `${Number(o.price).toFixed(2).replace(".", ",")} TL`;
  if (o.lang === "en") {
    return {
      subject: "Payment received — your book is unlocked — AI for Everyone",
      html:
        `<p>Thank you! Your payment was received and the book is now unlocked on this account.</p>` +
        `<p><a href="${o.siteUrl}/en/read">Start reading</a> — sign in with this email address.</p>` +
        `<p style="color:#666;font-size:13px">Order ${esc(short)} · ${esc(amount)} · ${date}<br>` +
        `This message is a payment confirmation. Questions: ${esc(o.supportEmail)}</p>`,
    };
  }
  return {
    subject: "Ödemen alındı, kitabın açıldı — Herkes İçin Yapay Zekâ",
    html:
      `<p>Teşekkürler! Ödemen alındı ve kitap bu hesapta açıldı.</p>` +
      `<p><a href="${o.siteUrl}/oku">Okumaya başla</a> — bu e-posta adresinle giriş yapman yeterli.</p>` +
      `<p style="color:#666;font-size:13px">Sipariş ${esc(short)} · ${esc(amount)} · ${date}<br>` +
      `Bu ileti bir ödeme bilgilendirmesidir. Sorular için: ${esc(o.supportEmail)}</p>`,
  };
}

export function refundEmail(o: { lang: "tr" | "en"; orderId: string; price: string; supportEmail: string }): { subject: string; html: string } {
  const short = o.orderId.slice(0, 8);
  const amount = `${Number(o.price).toFixed(2).replace(".", ",")} TL`;
  if (o.lang === "en") {
    return {
      subject: "Your refund has been issued — AI for Everyone",
      html: `<p>Your order ${esc(short)} (${esc(amount)}) has been refunded. Depending on your bank it may take a few days to appear on your statement. Book access on this account has been closed.</p><p>Questions: ${esc(o.supportEmail)}</p>`,
    };
  }
  return {
    subject: "İaden yapıldı — Herkes İçin Yapay Zekâ",
    html: `<p>${esc(short)} numaralı siparişinin (${esc(amount)}) iadesi yapıldı. Bankana göre ekstrene yansıması birkaç gün sürebilir. Bu hesaptaki kitap erişimi kapatıldı.</p><p>Sorular için: ${esc(o.supportEmail)}</p>`,
  };
}
