// E-posta kuyruğu gönderici. Erişim, ödeme transaction'ında açılır; bu modül e-postayı hemen göndermeyi DENER
// (deliverNow), başaramazsa iş kuyrukta kalır ve ops-worker yeniden dener. Asla hata fırlatmaz.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { grantEmail, receiptEmail, refundEmail, sendResend } from "./mail.ts";

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

export function render(m: OutboxRow): { subject: string; html: string } {
  const lang = m.lang === "en" ? "en" : "tr";
  if (m.kind === "receipt") {
    return receiptEmail({ lang, orderId: m.order_id ?? "", price: m.payload.amount, paidAt: new Date(String(m.payload.paid_at ?? Date.now())), siteUrl: siteUrl(), supportEmail: SUPPORT_EMAIL });
  }
  if (m.kind === "refund") {
    return refundEmail({ lang, orderId: m.order_id ?? "", amount: m.payload.amount, full: m.event_key.startsWith("fraud_refund:") || m.payload.full === true, supportEmail: SUPPORT_EMAIL });
  }
  return grantEmail({ lang, siteUrl: siteUrl(), supportEmail: SUPPORT_EMAIL });
}

export async function sendClaimed(admin: SupabaseClient, m: OutboxRow): Promise<string> {
  if (!m.recipient) return "skipped";
  const mail = render(m);
  const r = await sendResend({ to: m.recipient, subject: mail.subject, html: mail.html, idempotencyKey: m.event_key });
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
