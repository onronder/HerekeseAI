// Yönetici iadesi. action:
//  - "refund": iyzico Refund V2 (/v2/payment/refund, paymentId + tutar) → refunded + hak silme + e-posta
//  - "mark_refunded": iade panelden yapıldıysa Raporlama ile (paymentRefundStatus=TOTALLY_REFUNDED) teyit → aynı kapanış
// JWT + has_role(admin).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, makeRateLimiter } from "../_shared/token.ts";
import { IyzicoError, refundV2, reportingPaymentDetails } from "../_shared/iyzico.ts";
import { loadOrderById, markRefunded, SUPPORT_EMAIL } from "../_shared/fulfil.ts";
import { refundEmail, sendResend } from "../_shared/mail.ts";

const allow = makeRateLimiter(20, 10 * 60 * 1000);
const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "unauthorized" }, 401);
    if (!allow(user.id)) return json({ error: "rate_limited" }, 429);
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const orderId = String(body?.orderId ?? "");
    const action = body?.action === "mark_refunded" ? "mark_refunded" : "refund";
    if (!UUID_RX.test(orderId)) return json({ error: "bad_request" }, 400);

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const order = await loadOrderById(admin, orderId);
    if (!order) return json({ error: "not_found" }, 404);
    if (order.status === "refunded") {
      // İdempotent temizlik: iade sonrası (eski kod / yarış) kalmış sipariş bağlı hak varsa sil.
      const { data: gone } = await admin.from("book_entitlements").delete().eq("order_id", order.id).select("id");
      return json({ ok: true, already: true, cleaned: Array.isArray(gone) ? gone.length : 0 });
    }
    if (!(order.status === "paid" || order.status === "review") || !order.iyzico_payment_id) {
      return json({ error: "not_refundable", status: order.status }, 409);
    }

    let raw: Record<string, unknown>;
    try {
      if (action === "refund") {
        const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "85.34.78.112";
        raw = await refundV2(order.iyzico_payment_id, Number(order.price).toFixed(2), ip, `refund-${order.id}`);
        if (raw.status !== "success") {
          return json({ error: "refund_failed", code: raw.errorCode ?? null, message: raw.errorMessage ?? null }, 502);
        }
      } else {
        raw = await reportingPaymentDetails(order.iyzico_payment_id);
        const payments = Array.isArray(raw.payments) ? (raw.payments as Record<string, unknown>[]) : [];
        const st = payments[0]?.paymentRefundStatus;
        if (raw.status !== "success" || st !== "TOTALLY_REFUNDED") {
          return json({ error: "not_refunded_at_iyzico", refundStatus: st ?? null }, 409);
        }
      }
    } catch (e) {
      console.error("refund error:", e instanceof IyzicoError ? `${e.kind}: ${e.message}` : e);
      return json({ error: "iyzico_unreachable" }, 502);
    }

    const ok = await markRefunded(admin, order, raw, "admin");
    let mailed = false;
    if (ok) {
      const m = refundEmail({ lang: order.lang === "en" ? "en" : "tr", orderId: order.id, price: String(order.price), supportEmail: SUPPORT_EMAIL });
      mailed = await sendResend({ to: order.buyer_email, subject: m.subject, html: m.html });
    }
    return json({ ok, mailed, action });
  } catch (e) {
    console.error("refund-book error:", e);
    return json({ error: "internal" }, 500);
  }
});
