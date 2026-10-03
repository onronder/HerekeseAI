// E-posta kuyruğu gönderici. Erişim, ödeme transaction'ında açılır; bu modül e-postayı hemen göndermeyi DENER
// (deliverNow), başaramazsa iş kuyrukta kalır ve ops-worker yeniden dener. Asla hata fırlatmaz.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as b64 } from "https://deno.land/std@0.190.0/encoding/base64.ts";
import { grantEmail, type MailAttachment, receiptEmail, refundEmail, sendResend, tl } from "./mail.ts";

export const SUPPORT_EMAIL = "support@fittechs.com";
const LEASE_SECONDS = 60;

export interface OutboxRow {
  id: string;
  event_key: string;
  kind: "receipt" | "refund" | "grant";
  order_id: string | null;
  recipient: string | null;
  lang: "tr" | "en";
  payload: Record<string, unknown>;
  lease_version: number;
}

function siteUrl(): string {
  return (Deno.env.get("SITE_URL") ?? "https://book.onuronder.com").replace(/\/$/, "");
}

// Siparişin kabul ettiği koşullar (book_orders.terms_* + book_policy_version'daki değişmez metin)
export interface TermsDoc { version: string; hash: string; trText: string; enText: string | null }

export function render(m: OutboxRow, terms?: TermsDoc | null): { subject: string; html: string } {
  const lang = m.lang === "en" ? "en" : "tr";
  if (m.kind === "receipt") {
    return receiptEmail({ lang, orderId: m.order_id ?? "", price: m.payload.amount, paidAt: new Date(String(m.payload.paid_at ?? Date.now())), siteUrl: siteUrl(), supportEmail: SUPPORT_EMAIL, termsVersion: terms?.version ?? null });
  }
  if (m.kind === "refund") {
    return refundEmail({ lang, orderId: m.order_id ?? "", amount: m.payload.amount, full: m.event_key.startsWith("fraud_refund:") || m.payload.full === true, supportEmail: SUPPORT_EMAIL });
  }
  return grantEmail({ lang, siteUrl: siteUrl(), supportEmail: SUPPORT_EMAIL });
}

// Sipariş teyidi eki: sipariş bilgileri + kabul edilen sürüm ve SHA-256 + değişmez metnin kendisi. Deterministik
// (aynı olay → aynı gövde; Resend aynı anahtarı farklı gövdeyle reddeder). Başlık özet hesabına girmez; özet
// yalnız metnin kendisine aittir ve herkese açık değişmez kopyayla (/kosullar/<sürüm>-tr.txt) doğrulanabilir.
export function termsAttachments(m: OutboxRow, t: TermsDoc): MailAttachment[] {
  const short = (m.order_id ?? "").slice(0, 8);
  const paidAt = new Date(String(m.payload.paid_at ?? 0)).toISOString();
  const line = "-".repeat(72);
  const tr = [
    "SİPARİŞ TEYİDİ — Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi",
    `Sipariş: ${m.order_id ?? ""}`,
    `Ödeme tarihi (UTC): ${paidAt}`,
    `Tutar: ${tl(m.payload.amount)} (KDV dahil)`,
    `Alıcı e-postası: ${m.recipient ?? ""}`,
    `Kabul edilen koşullar: sürüm ${t.version} · SHA-256 ${t.hash}`,
    `Değişmez kopya: ${siteUrl()}/kosullar/${t.version}-tr.txt`,
    line, "", t.trText,
  ].join("\n");
  const out: MailAttachment[] = [{ filename: `siparis-teyidi-${short}.txt`, content: b64(tr) }];
  if (m.lang === "en" && t.enText) {
    const en = [
      "ORDER CONFIRMATION — English summary of the terms (the Turkish text is legally binding)",
      `Order: ${m.order_id ?? ""}`,
      `Payment date (UTC): ${paidAt}`,
      `Amount: ${tl(m.payload.amount)} (VAT included)`,
      `Buyer email: ${m.recipient ?? ""}`,
      `Accepted terms: version ${t.version} · binding Turkish text SHA-256 ${t.hash}`,
      line, "", t.enText,
    ].join("\n");
    out.push({ filename: `order-confirmation-${short}-en.txt`, content: b64(en) });
  }
  return out;
}

// null: siparişte koşul kaydı yok (eski sipariş) ya da metin bulunamadı → ek olmadan gönderilir.
// "retry": veritabanına ulaşılamadı → e-posta EKSİZ gönderilmez, iş yeniden denenir.
async function loadTerms(admin: SupabaseClient, orderId: string): Promise<TermsDoc | null | "retry"> {
  const { data: o, error } = await admin.from("book_orders").select("terms_version,terms_hash").eq("id", orderId).maybeSingle();
  if (error) return "retry";
  const ord = o as { terms_version: string | null; terms_hash: string | null } | null;
  if (!ord?.terms_version || !ord.terms_hash) return null;
  const { data: rows, error: e2 } = await admin.from("book_policy_version").select("locale,content,content_hash")
    .eq("kind", "terms_bundle").eq("version", ord.terms_version);
  if (e2) return "retry";
  const list = (rows ?? []) as { locale: string; content: string | null; content_hash: string }[];
  const tr = list.find((r) => r.locale === "tr" && r.content_hash === ord.terms_hash && r.content);
  if (!tr) {
    console.error("terms attachment missing version=" + ord.terms_version);
    return null;
  }
  return { version: ord.terms_version, hash: ord.terms_hash, trText: tr.content!, enText: list.find((r) => r.locale === "en")?.content ?? null };
}

export async function sendClaimed(admin: SupabaseClient, m: OutboxRow): Promise<string> {
  if (!m.recipient) return "skipped";
  let terms: TermsDoc | null = null;
  if (m.kind === "receipt" && m.order_id) {
    const t = await loadTerms(admin, m.order_id);
    if (t === "retry") {
      const { data } = await admin.rpc("book_complete_outbox", {
        p_id: m.id, p_lease_version: m.lease_version,
        p_result: { ok: false, provider_message_id: null, error_code: "terms_load", permanent: false },
      });
      return String(data ?? "retry");
    }
    terms = t;
  }
  const mail = render(m, terms);
  const r = await sendResend({ to: m.recipient, subject: mail.subject, html: mail.html, idempotencyKey: m.event_key, attachments: terms ? termsAttachments(m, terms) : undefined });
  const { data, error } = await admin.rpc("book_complete_outbox", {
    p_id: m.id,
    p_lease_version: m.lease_version,
    p_result: { ok: r.ok, provider_message_id: r.providerMessageId, error_code: r.errorCode, permanent: r.permanent },
  });
  if (error) {
    console.error("outbox complete error code=" + (error.code ?? "?"));
    return "complete_error";
  }
  return String(data);
}

// Tek işi hemen sahiplenip gönder (callback/webhook/iade/grant yolunda)
export async function deliverNow(admin: SupabaseClient, outboxId: string | null | undefined): Promise<string> {
  if (!outboxId) return "none";
  try {
    const { data, error } = await admin.rpc("book_claim_outbox", { p_limit: 1, p_lease_seconds: LEASE_SECONDS, p_only: outboxId });
    if (error || !Array.isArray(data) || !data.length) return "not_claimed";
    return await sendClaimed(admin, data[0] as OutboxRow);
  } catch (e) {
    console.error("deliverNow error:", (e as Error).name);
    return "error";
  }
}
