// Sipariş durumu (dönüş sayfası polling'i) + mutabakat: callback ve webhook ikisi de kayıpsa
// Retrieve Payment (/payment/detail, paymentConversationId) ile sonuç sunucudan alınır → fulfil().
// JWT zorunlu; yalnız kendi siparişi. Makbuz gitmediyse yeniden denenir.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, makeRateLimiter } from "../_shared/token.ts";
import { IyzicoError, retrievePaymentDetail, siteUrl } from "../_shared/iyzico.ts";
import { fulfil, loadOrderById, PRODUCT_CODE, sendReceiptOnce } from "../_shared/fulfil.ts";

const allow = makeRateLimiter(60, 10 * 60 * 1000);
const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RECONCILE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

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

    const body = await req.json().catch(() => ({}));
    const orderId = String(body?.orderId ?? "");
    if (!UUID_RX.test(orderId)) return json({ error: "bad_request" }, 400);

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    let order = await loadOrderById(admin, orderId);
    if (!order || order.user_id !== user.id) return json({ error: "not_found" }, 404);

    // Mutabakat: sonuç bize ulaşmadıysa iyzico'dan sor (token gerekmez; conversationId bizim id).
    const age = Date.now() - new Date(order.created_at).getTime();
    if ((order.status === "initialized" || order.status === "review") && age < RECONCILE_WINDOW_MS) {
      try {
        const r = await retrievePaymentDetail({ paymentConversationId: order.conversation_id }, order.lang === "en" ? "en" : "tr");
        if (r.status === "success") await fulfil(admin, order, r, "reconcile", siteUrl());
        // status:failure = iyzico'da böyle bir ödeme yok (henüz ödenmedi) → dokunma
      } catch (e) {
        console.error("reconcile error:", e instanceof IyzicoError ? `${e.kind}: ${e.message}` : e);
      }
      order = (await loadOrderById(admin, orderId)) ?? order;
    }
    // Süresi dolmuş başlatmalar: 24 saat sonra expired (token 30 dk'da dolar).
    if (order.status === "initialized" && age > 24 * 60 * 60 * 1000) {
      await admin.from("book_orders").update({ status: "expired" }).eq("id", order.id).eq("status", "initialized");
      order.status = "expired";
    }
    if (order.status === "paid" && !order.receipt_sent_at) await sendReceiptOnce(admin, order, siteUrl());

    const { data: ent } = await userClient
      .from("book_entitlements").select("id").eq("user_id", user.id).eq("product_code", PRODUCT_CODE).maybeSingle();

    return json({
      status: order.status,
      entitled: !!ent,
      lang: order.lang,
      paidAt: (order as unknown as { paid_at?: string }).paid_at ?? null,
      fraudPending: order.status === "review",
    });
  } catch (e) {
    console.error("order-status error:", e);
    return json({ error: "internal" }, 500);
  }
});
