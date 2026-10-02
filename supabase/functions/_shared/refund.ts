// İade sonucunun uygulanması ve belirsiz iade işleminin raporlamayla eşleştirilmesi (refund-book ve ops-worker ortak).
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { HttpError } from "./http.ts";
import { IyzicoError, reportingPaymentDetails } from "./iyzico.ts";
import { matchRefund, type RefundResult } from "./provider-map.ts";
import { deliverNow } from "./outbox.ts";

export async function applyRefund(admin: SupabaseClient, opId: string, r: RefundResult) {
  const { data, error } = await admin.rpc("book_apply_refund_result", { p_op: opId, p_result: r });
  if (error) throw new HttpError(503, "db_unavailable", true);
  const out = data as { outcome: string; outbox_id?: string | null };
  if (out.outbox_id) await deliverNow(admin, out.outbox_id);
  return out;
}

export async function reconcileRefundOp(admin: SupabaseClient, op: { id: string; order_id: string; amount: string | number; currency: string; created_at: string }, paymentId: string) {
  const { data: known } = await admin.from("book_refund_operation").select("provider_refund_id")
    .eq("order_id", op.order_id).eq("state", "settled").not("provider_refund_id", "is", null);
  let raw;
  try {
    raw = await reportingPaymentDetails(paymentId);
  } catch (e) {
    console.error("refund reconcile reporting error kind=" + (e instanceof IyzicoError ? e.kind : "other"));
    return { outcome: "unknown" };
  }
  const r = matchRefund(raw, { id: op.id, amount: String(op.amount), currency: op.currency, createdAt: op.created_at },
    (known ?? []).map((k) => String((k as { provider_refund_id: string }).provider_refund_id)));
  if (r.kind === "unknown") return { outcome: "unknown" };
  return await applyRefund(admin, op.id, r);
}

