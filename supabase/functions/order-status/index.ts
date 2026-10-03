// Satın alma dönüş sayfasının durum sorgusu (JWT). Yalnız kendi siparişi; başkasınınki 404 (varlık gizlenir).
// Açık siparişte sağlayıcıyla uzlaştırma yapılır (karar book_apply_payment_result'ta). Makbuz gönderimi outbox'ın işidir.
// Yanıt: {status, payment_state, access_state, pending}. URL'deki ipucu sonucu belirlemez; yalnız bu yanıt esas alınır.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors } from "../_shared/token.ts";
import { errorResponse, HttpError, json, readJson, requestId, requireMethod, UUID_RX } from "../_shared/http.ts";
import { getVerifiedUser, serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { IyzicoError, retrievePaymentDetail } from "../_shared/iyzico.ts";
import { mapPaymentDetail } from "../_shared/provider-map.ts";
import { applyFact, loadOrderById, OPEN_STATES, PRODUCT_CODE } from "../_shared/fulfil.ts";

const RECONCILE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  const rid = requestId();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    requireMethod(req, ["POST"]);
    const user = await getVerifiedUser(req);
    const admin = serviceClient();
    await limit(admin, `status:${user.id}`, 60, 600, { critical: false });
    const body = await readJson(req, 1024);
    const orderId = String(body.orderId ?? "");
    if (!UUID_RX.test(orderId)) throw new HttpError(400, "bad_request");

    let order = await loadOrderById(admin, orderId);
    if (!order || order.user_id !== user.id) throw new HttpError(404, "not_found");
    const age = Date.now() - new Date(order.created_at).getTime();
    if (OPEN_STATES.includes(order.status) && order.status !== "created" && age < RECONCILE_WINDOW_MS) {
      try {
        const r = await retrievePaymentDetail({ paymentConversationId: order.conversation_id }, order.lang === "en" ? "en" : "tr");
        const sessionClosed = order.token_expires_at != null && new Date(order.token_expires_at).getTime() < Date.now();
        await applyFact(admin, order.id, "status", mapPaymentDetail(r, { sessionClosed }));
        order = (await loadOrderById(admin, orderId)) ?? order;
      } catch (e) {
        console.error("order-status reconcile error kind=" + (e instanceof IyzicoError ? e.kind : "db"));
      }
    }
    const { data: acc, error: aErr } = await admin.rpc("book_access_check", { p_user: user.id, p_product: PRODUCT_CODE });
    if (aErr) throw new HttpError(503, "db_unavailable", true);
    const active = !!(acc as { active?: boolean }).active;
    return json({
      status: order.status,
      payment_state: order.status,
      access_state: active ? "active" : "none",
      entitled: active,
      pending: OPEN_STATES.includes(order.status),
      fraudPending: order.status === "review",
      lang: order.lang,
    }, 200, corsHeaders);
  } catch (e) {
    if (e instanceof HttpError) return errorResponse(e, rid, corsHeaders);
    console.error("order-status error rid=" + rid, (e as Error).message);
    return errorResponse(new HttpError(500, "internal", true), rid, corsHeaders);
  }
});
