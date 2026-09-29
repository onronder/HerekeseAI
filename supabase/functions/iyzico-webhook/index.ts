// iyzico webhook (HPP formatı: token, paymentConversationId, status, iyziEventType, iyziPaymentId).
// Panel: Settings > Merchant Settings > Merchant Notifications → bu fonksiyonun URL'si (HTTPS).
// Gövdeye güvenilmez: sipariş bulunur, token eşleşir, sonuç CF-Retrieve + imza ile alınır → fulfil().
// X-IYZ-SIGNATURE-V3 (hesapta özellik açıksa) doğrulanır; IYZICO_WEBHOOK_REQUIRE_SIGNATURE=true iken zorunlu.
// iyzico 2xx görmezse yeniden dener (10-15 sn, sonra periyodik, en çok 3). Geçici hata → 500.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { makeRateLimiter } from "../_shared/token.ts";
import {
  IyzicoError,
  iyzicoEnv,
  retrieveCheckoutForm,
  siteUrl,
  timingSafeEqualStr,
  verifyWebhookSignatureV3,
  type WebhookBody,
} from "../_shared/iyzico.ts";
import { fulfil, loadOrderByConversationId } from "../_shared/fulfil.ts";

const allow = makeRateLimiter(60, 60 * 1000);
// Ödeme henüz bitmedi: Retrieve tetiklenmez, 200 ile kapatılır (sonraki bildirim gelir).
const INTERMEDIATE = new Set([
  "INIT_THREEDS", "CALLBACK_THREEDS", "BKM_POS_SELECTED", "INIT_APM", "INIT_BANK_TRANSFER",
  "INIT_CREDIT", "PENDING_CREDIT", "INIT_CONTACTLESS",
]);

serve(async (req: Request) => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(ip)) return json({ error: "rate_limited" }, 429);

  try {
    const body = (await req.json().catch(() => null)) as WebhookBody | null;
    if (!body || typeof body !== "object") return json({ ignored: true, reason: "no_json" });
    const token = String(body.token ?? "").trim();
    const cid = String(body.paymentConversationId ?? "").trim();
    if (!token || !cid) return json({ ignored: true, reason: "not_hpp" }); // Direct/Subscription formatı bizde yok
    console.log(`webhook event=${body.iyziEventType} status=${body.status} cid=${cid}`);

    const { secretKey } = iyzicoEnv();
    const sig = req.headers.get("x-iyz-signature-v3") ?? "";
    const requireSig = (Deno.env.get("IYZICO_WEBHOOK_REQUIRE_SIGNATURE") ?? "false") === "true";
    if (sig) {
      if (!(await verifyWebhookSignatureV3(secretKey, body, sig))) {
        console.error("webhook signature mismatch");
        return json({ error: "bad_signature" }, 401);
      }
    } else if (requireSig) {
      return json({ error: "signature_required" }, 401);
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const order = await loadOrderByConversationId(admin, cid);
    if (!order) return json({ ignored: true, reason: "unknown_order" }); // yeniden deneme faydasız → 200
    if (!order.iyzico_token || !timingSafeEqualStr(order.iyzico_token, token)) {
      console.error(`webhook token mismatch order=${order.id}`);
      return json({ error: "token_mismatch" }, 401);
    }
    if (INTERMEDIATE.has(String(body.status ?? ""))) return json({ ignored: true, reason: "intermediate" });

    let r;
    try {
      r = await retrieveCheckoutForm(order.iyzico_token, order.lang === "en" ? "en" : "tr", order.conversation_id);
    } catch (e) {
      console.error("retrieve error:", e instanceof IyzicoError ? `${e.kind}: ${e.message}` : e);
      return json({ error: "retrieve_failed" }, 500); // iyzico yeniden dener
    }

    // Belge: webhook ile Retrieve birbirini doğrulamalı (paymentId eşit).
    const hookPid = String(body.iyziPaymentId ?? body.paymentId ?? "");
    if (r.paymentId && hookPid && r.paymentId !== hookPid) {
      console.error(`webhook paymentId mismatch order=${order.id} hook=${hookPid} retrieve=${r.paymentId}`);
      return json({ outcome: "payment_id_mismatch" }); // yetki yok; mutabakat yolu bağımsız çalışır
    }

    const outcome = await fulfil(admin, order, r, "webhook", siteUrl());
    return json({ outcome });
  } catch (e) {
    console.error("iyzico-webhook error:", e);
    return json({ error: "internal" }, 500);
  }
});
