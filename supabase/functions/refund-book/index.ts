// Yönetici iadesi (JWT + güncel admin rolü; aktör RPC'ye doğrulanmış kimlikle geçer, RPC yeniden doğrular).
// action:
//  - list {email}: alıcının son siparişleri ve iade işlemleri
//  - refund {orderId, amount?}: book_begin_refund (sabit işlem anahtarı; etkin işlem varsa onu döner) → Refund V2
//      (conversationId = işlem kimliği) → book_apply_refund_result. Ağ/zaman aşımı → unknown; yeni çağrı açılmaz,
//      raporlamayla (kimlik/tutar/döviz/durum) eşleştirilir. Kısmi iade erişimi korur; toplam tam tutara ulaşınca kapanır.
//  - mark_refunded {orderId, amount?}: iade iyzico panelinden yapıldıysa raporlama ile doğrulanıp aynı kayda bağlanır
//  - reconcile {opId}: belirsiz işlemi raporlamayla şimdi eşleştir
// Satış/iade durdurulduysa (book_app_settings.refunds_enabled=false) yeni iade başlatma 503.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors } from "../_shared/token.ts";
import { clientIp, errorResponse, HttpError, json, readJson, requestId, requireMethod, UUID_RX } from "../_shared/http.ts";
import { getVerifiedUser, requireAdmin, serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { IyzicoError, refundV2 } from "../_shared/iyzico.ts";
import { mapRefundV2, type RefundResult } from "../_shared/provider-map.ts";
import { applyRefund, reconcileRefundOp } from "../_shared/refund.ts";

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  const rid = requestId();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    requireMethod(req, ["POST"]);
    const user = await getVerifiedUser(req);
    const admin = serviceClient();
    await requireAdmin(admin, user.id);
    await limit(admin, `refund:${user.id}`, 30, 600, { critical: true });
    const body = await readJson(req, 2048);
    const action = String(body.action ?? "refund");

    if (action === "list") {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new HttpError(400, "bad_request");
      const { data: orders } = await admin.from("book_orders")
        .select("id,status,price,paid_price,currency,lang,created_at,paid_at,refunded_at,iyzico_payment_id,fraud_status,provider_env,terms_version,terms_hash")
        .eq("buyer_email", email).order("created_at", { ascending: false }).limit(20);
      const ids = (orders ?? []).map((o) => (o as { id: string }).id);
      const { data: ops } = ids.length
        ? await admin.from("book_refund_operation").select("id,order_id,amount,currency,state,settled_amount,error_code,created_at,settled_at").in("order_id", ids).order("created_at")
        : { data: [] };
      return json({ orders: orders ?? [], refund_ops: ops ?? [] }, 200, corsHeaders);
    }

    if (action === "reconcile") {
      const opId = String(body.opId ?? "");
      if (!UUID_RX.test(opId)) throw new HttpError(400, "bad_request");
      const { data: op } = await admin.from("book_refund_operation").select("id,order_id,amount,currency,state,created_at").eq("id", opId).maybeSingle();
      if (!op) throw new HttpError(404, "not_found");
      const { data: o } = await admin.from("book_orders").select("iyzico_payment_id").eq("id", (op as { order_id: string }).order_id).maybeSingle();
      const out = await reconcileRefundOp(admin, op as never, String((o as { iyzico_payment_id?: string })?.iyzico_payment_id ?? ""));
      return json(out, 200, corsHeaders);
    }

    if (action !== "refund" && action !== "mark_refunded") throw new HttpError(400, "bad_action");
    const orderId = String(body.orderId ?? "");
    if (!UUID_RX.test(orderId)) throw new HttpError(400, "bad_request");
    const amount = body.amount == null || body.amount === "" ? null : Number(body.amount);
    if (amount !== null && !(Number.isFinite(amount) && amount > 0)) throw new HttpError(422, "amount_invalid");

    const { data: begun, error: bErr } = await admin.rpc("book_begin_refund", { p_order: orderId, p_amount: amount, p_actor: user.id });
    if (bErr) throw new HttpError(bErr.code === "42501" ? 403 : 503, bErr.code === "42501" ? "forbidden" : "db_unavailable", bErr.code !== "42501");
    const b = begun as { action: string; op_id?: string; state?: string; amount?: number; currency?: string; payment_id?: string; remaining?: number; status?: string };
    if (b.action === "paused") return json({ code: "paused", request_id: rid }, 503, corsHeaders);
    if (b.action === "not_found") throw new HttpError(404, "not_found");
    if (b.action === "not_refundable") return json({ code: "not_refundable", status: b.status }, 409, corsHeaders);
    if (b.action === "amount_invalid") return json({ code: "amount_invalid", remaining: b.remaining }, 422, corsHeaders);

    const { data: o } = await admin.from("book_orders").select("iyzico_payment_id").eq("id", orderId).maybeSingle();
    const paymentId = String((o as { iyzico_payment_id?: string })?.iyzico_payment_id ?? "");
    const { data: opRow } = await admin.from("book_refund_operation").select("id,order_id,amount,currency,state,created_at").eq("id", b.op_id!).maybeSingle();
    const op = opRow as { id: string; order_id: string; amount: number; currency: string; state: string; created_at: string };

    // Etkin (belirsiz) işlem varsa yeni sağlayıcı çağrısı YOK: raporlamayla eşleştir
    if (b.action === "existing" || action === "mark_refunded") {
      const out = await reconcileRefundOp(admin, op, paymentId);
      return json({ ...out, op_id: op.id, existing: b.action === "existing" }, 200, corsHeaders);
    }

    let r: RefundResult;
    try {
      const raw = await refundV2(paymentId, Number(op.amount).toFixed(2), clientIp(req), op.id);
      r = mapRefundV2(raw);
    } catch (e) {
      console.error("refund call error kind=" + (e instanceof IyzicoError ? e.kind : "other"));
      r = { kind: "unknown" };
    }
    const out = await applyRefund(admin, op.id, r);
    return json({ ...out, op_id: op.id }, 200, corsHeaders);
  } catch (e) {
    if (e instanceof HttpError) return errorResponse(e, rid, corsHeaders);
    console.error("refund-book error rid=" + rid, (e as Error).message);
    return errorResponse(new HttpError(500, "internal", true), rid, corsHeaders);
  }
});
