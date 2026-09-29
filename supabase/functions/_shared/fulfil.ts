// Tek karar noktası: bir siparişe erişim hakkı YALNIZ burada, yalnız iyzico'dan sunucu tarafında
// alınmış ve imzası doğrulanmış sonuçla verilir. Callback, webhook, IFN ve mutabakat hepsi buraya iner.
//
// Belge kuralları (docs.iyzico.com):
//  - paymentStatus SUCCESS ve status success → ödeme alındı.
//  - fraudStatus 1 (veya inceleme sonrası 2) → teslimat; 0 → bekle (review); -1 → red, iyzico iade eder.
//  - Retrieve yanıtındaki signature doğrulanır (Response Signature Validation).
//  - conversationId/basketId/paidPrice/price/currency bizim sipariş satırıyla eşleşmeli.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { trim0, type RetrieveResult } from "./iyzico.ts";
import { receiptEmail, sendResend } from "./mail.ts";

export const PRODUCT_CODE = "herkes-icin-yz";
export const SUPPORT_EMAIL = "support@fittechs.com";

export interface OrderRow {
  id: string;
  user_id: string;
  product_code: string;
  lang: "tr" | "en";
  conversation_id: string;
  basket_id: string;
  price: string | number;
  currency: string;
  status: string;
  iyzico_token: string | null;
  iyzico_payment_id: string | null;
  buyer_email: string;
  receipt_sent_at: string | null;
  created_at: string;
}

export type FulfilSource = "callback" | "webhook" | "reconcile" | "ifn" | "admin";
export type FulfilOutcome = "paid" | "already_paid" | "failed" | "review" | "unchanged";

const ORDER_COLS =
  "id,user_id,product_code,lang,conversation_id,basket_id,price,currency,status,iyzico_token,iyzico_payment_id,buyer_email,receipt_sent_at,created_at";

export async function loadOrderByToken(admin: SupabaseClient, token: string): Promise<OrderRow | null> {
  if (!token) return null;
  const { data } = await admin.from("book_orders").select(ORDER_COLS).eq("iyzico_token", token).maybeSingle();
  return (data as OrderRow | null) ?? null;
}

export async function loadOrderByConversationId(admin: SupabaseClient, cid: string): Promise<OrderRow | null> {
  if (!cid) return null;
  const { data } = await admin.from("book_orders").select(ORDER_COLS).eq("conversation_id", cid).maybeSingle();
  return (data as OrderRow | null) ?? null;
}

export async function loadOrderById(admin: SupabaseClient, id: string): Promise<OrderRow | null> {
  if (!id) return null;
  const { data } = await admin.from("book_orders").select(ORDER_COLS).eq("id", id).maybeSingle();
  return (data as OrderRow | null) ?? null;
}

export async function loadOrderByPaymentId(admin: SupabaseClient, paymentId: string): Promise<OrderRow | null> {
  if (!paymentId) return null;
  const { data } = await admin.from("book_orders").select(ORDER_COLS).eq("iyzico_payment_id", paymentId).maybeSingle();
  return (data as OrderRow | null) ?? null;
}

// Koşullu geçiş: yalnız verilen durumlardan; asla paid → failed düşüşü.
async function transition(
  admin: SupabaseClient,
  orderId: string,
  from: string[],
  patch: Record<string, unknown>,
): Promise<boolean> {
  const { data, error } = await admin
    .from("book_orders")
    .update(patch)
    .eq("id", orderId)
    .in("status", from)
    .select("id");
  if (error) {
    console.error("book_orders update error:", error.message);
    return false;
  }
  return Array.isArray(data) && data.length > 0;
}

async function storeRaw(admin: SupabaseClient, orderId: string, raw: unknown, extra: Record<string, unknown> = {}) {
  await admin.from("book_orders").update({ raw, ...extra }).eq("id", orderId);
}

export async function grantEntitlement(admin: SupabaseClient, order: OrderRow, source: FulfilSource, paymentId: string) {
  const { error } = await admin.from("book_entitlements").upsert(
    {
      user_id: order.user_id,
      product_code: order.product_code || PRODUCT_CODE,
      order_id: order.id,
      granted_by: `iyzico:${source}`,
      note: paymentId ? `paymentId ${paymentId}` : null,
    },
    { onConflict: "user_id,product_code", ignoreDuplicates: true },
  );
  if (error) console.error("entitlement upsert error:", error.message);
}

export async function sendReceiptOnce(admin: SupabaseClient, order: OrderRow, siteUrl: string): Promise<boolean> {
  if (order.receipt_sent_at) return true;
  const mail = receiptEmail({
    lang: order.lang === "en" ? "en" : "tr",
    orderId: order.id,
    price: String(order.price),
    paidAt: new Date(),
    siteUrl,
    supportEmail: SUPPORT_EMAIL,
  });
  const ok = await sendResend({ to: order.buyer_email, subject: mail.subject, html: mail.html });
  if (ok) await admin.from("book_orders").update({ receipt_sent_at: new Date().toISOString() }).eq("id", order.id);
  return ok;
}

export async function fulfil(
  admin: SupabaseClient,
  order: OrderRow,
  r: RetrieveResult,
  source: FulfilSource,
  siteUrl: string,
): Promise<FulfilOutcome> {
  // 1) API hatası: sonuç yok, durum düşürülmez.
  if (r.status !== "success") {
    await storeRaw(admin, order.id, r.raw);
    return "unchanged";
  }
  // 2) Belge: yanıt imzası doğrulanmalı. Doğrulanamayan yanıt yetki veremez.
  if (!r.signatureValid) {
    console.error(`signature_mismatch order=${order.id} source=${source}`);
    await storeRaw(admin, order.id, r.raw);
    return "unchanged";
  }
  // 3) Ödeme başarısız.
  if (r.paymentStatus === "FAILURE") {
    const ok = await transition(admin, order.id, ["created", "initialized"], { status: "failed", raw: r.raw, source });
    return ok ? "failed" : "unchanged";
  }
  // 4) Henüz bitmemiş (INIT_THREEDS, CALLBACK_THREEDS, INIT_BANK_TRANSFER ...).
  if (r.paymentStatus !== "SUCCESS") {
    await storeRaw(admin, order.id, r.raw);
    return "unchanged";
  }
  // 5) Sözleşme eşleşmesi: bizim sipariş satırı ↔ iyzico sonucu.
  const priceOk = trim0(r.paidPrice) === trim0(order.price) && trim0(r.price) === trim0(order.price);
  const matches =
    r.conversationId === order.conversation_id &&
    r.basketId === order.basket_id &&
    (r.currency ?? "") === (order.currency || "TRY") &&
    priceOk;
  if (!matches) {
    console.error(
      `order_mismatch order=${order.id} cid=${r.conversationId} basket=${r.basketId} cur=${r.currency} paid=${r.paidPrice} price=${r.price}`,
    );
    await transition(admin, order.id, ["created", "initialized"], {
      status: "review",
      raw: r.raw,
      source,
      iyzico_payment_id: r.paymentId ?? null,
      iyzico_payment_transaction_id: r.paymentTransactionId ?? null,
      fraud_status: r.fraudStatus ?? null,
    });
    return "review";
  }
  // 6) Fraud kararı (belge: yalnız 1 → teslimat; 0 → bekle; -1 → red; 2 → incelemeden sonra onay).
  const fraud = r.fraudStatus;
  if (fraud === -1) {
    await transition(admin, order.id, ["created", "initialized", "review"], {
      status: "failed",
      raw: r.raw,
      source,
      iyzico_payment_id: r.paymentId ?? null,
      fraud_status: -1,
    });
    return "failed";
  }
  if (fraud === 0) {
    await transition(admin, order.id, ["created", "initialized", "review"], {
      status: "review",
      raw: r.raw,
      source,
      iyzico_payment_id: r.paymentId ?? null,
      iyzico_payment_transaction_id: r.paymentTransactionId ?? null,
      fraud_status: 0,
    });
    return "review";
  }
  if (fraud !== 1 && fraud !== 2) {
    console.error(`unexpected fraudStatus=${String(fraud)} order=${order.id}`);
    await transition(admin, order.id, ["created", "initialized"], { status: "review", raw: r.raw, source });
    return "review";
  }
  // 7) Atomik geçiş → paid. 0 satır = zaten paid (yarış / tekrar).
  const now = new Date().toISOString();
  const became = await transition(admin, order.id, ["created", "initialized", "review"], {
    status: "paid",
    raw: r.raw,
    source,
    iyzico_payment_id: r.paymentId ?? null,
    iyzico_payment_transaction_id: r.paymentTransactionId ?? null,
    fraud_status: fraud,
    paid_at: now,
  });
  if (!became) {
    // Geçiş olmadı: sipariş zaten paid (yarış/tekrar) ya da refunded/failed. Hak YALNIZ paid ise tamamlanır;
    // iade edilmiş siparişe geç gelen callback/webhook erişimi geri açamaz.
    const fresh = await loadOrderById(admin, order.id);
    if (fresh && fresh.status === "paid") {
      await grantEntitlement(admin, fresh, source, r.paymentId ?? "");
      await sendReceiptOnce(admin, fresh, siteUrl);
      return "already_paid";
    }
    return "unchanged";
  }
  // 8) Erişim hakkı (idempotent) ve 9) makbuz (yalnız paid geçişinde; best-effort).
  await grantEntitlement(admin, order, source, r.paymentId ?? "");
  await sendReceiptOnce(admin, { ...order, status: "paid" }, siteUrl);
  return "paid";
}

// İade sonrası: sipariş refunded, sipariş bağlı hak silinir (elle açılanlar korunur).
export async function markRefunded(admin: SupabaseClient, order: OrderRow, raw: unknown, source: FulfilSource): Promise<boolean> {
  const ok = await transition(admin, order.id, ["paid", "review"], {
    status: "refunded",
    refunded_at: new Date().toISOString(),
    raw,
    source,
  });
  if (ok) {
    const { error } = await admin.from("book_entitlements").delete().eq("order_id", order.id);
    if (error) console.error("entitlement delete error:", error.message);
  }
  return ok;
}
