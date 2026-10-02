// iyzico webhook (HPP formatı: token, paymentConversationId, status, iyziEventType, iyziPaymentId). verify_jwt=false.
// Gövde yalnız tetikleyicidir: sipariş bulunur, token sabit zamanlı eşleşir, sonuç CF-Retrieve + yanıt imzasıyla alınır.
// V3 imzası (X-IYZ-SIGNATURE-V3): başlık varsa her zaman doğrulanır (yanlışsa 401); IYZICO_WEBHOOK_REQUIRE_SIGNATURE=true
// iken zorunludur (K6: ilk müşteriden önce açılır). Zorunlu değilken imzasız olay metrik olarak loglanır.
// ACK: 2xx yalnız sonuç kalıcı olarak yazıldıktan (ya da bilinçli olarak yok sayıldıktan) sonra; geçici hata → 500 (iyzico yeniden dener).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { clientIp, HttpError, json, readJson, requireMethod } from "../_shared/http.ts";
import { serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { IyzicoError, iyzicoEnv, retrieveCheckoutForm, timingSafeEqualStr, verifyWebhookSignatureV3, type WebhookBody } from "../_shared/iyzico.ts";
import { mapCheckoutRetrieve } from "../_shared/provider-map.ts";
import { applyFact, loadOrderByConversationId } from "../_shared/fulfil.ts";

// Ödeme henüz bitmedi: Retrieve tetiklenmez (sonraki bildirim / uzlaştırma gelir)
const INTERMEDIATE = new Set(["INIT_THREEDS", "CALLBACK_THREEDS", "BKM_POS_SELECTED", "INIT_APM", "INIT_BANK_TRANSFER", "INIT_CREDIT", "PENDING_CREDIT", "INIT_CONTACTLESS"]);

serve(async (req: Request) => {
  try {
    requireMethod(req, ["POST"]);
    const admin = serviceClient();
    await limit(admin, `wh:${clientIp(req) ?? "noip"}`, 120, 60, { critical: false });
    const body = (await readJson(req, 8192)) as WebhookBody;
    const env = iyzicoEnv();
    const sig = req.headers.get("X-IYZ-SIGNATURE-V3") ?? req.headers.get("x-iyz-signature-v3") ?? "";
    const requireSig = (Deno.env.get("IYZICO_WEBHOOK_REQUIRE_SIGNATURE") ?? "false") === "true";
    if (sig) {
      if (!(await verifyWebhookSignatureV3(env.secretKey, body, sig))) return json({ code: "bad_signature" }, 401);
    } else if (requireSig) {
      return json({ code: "signature_required" }, 401);
    } else {
      console.warn("metric webhook_unsigned");
    }
    const token = String(body.token ?? "");
    const cid = String(body.paymentConversationId ?? "");
    if (!token || !cid || token.length > 200 || cid.length > 64) return json({ ignored: true, reason: "not_hpp" });
    const order = await loadOrderByConversationId(admin, cid);
    if (!order) return json({ ignored: true, reason: "unknown_order" }); // bilinmeyen sipariş sağlayıcı çağrısı tetiklemez
    if (!order.iyzico_token || !timingSafeEqualStr(order.iyzico_token, token)) return json({ code: "token_mismatch" }, 401);
    if (INTERMEDIATE.has(String(body.status ?? ""))) return json({ ignored: true, reason: "intermediate" });
    let r;
    try {
      r = await retrieveCheckoutForm(order.iyzico_token, order.lang === "en" ? "en" : "tr", order.conversation_id);
    } catch (e) {
      console.error("webhook retrieve error kind=" + (e instanceof IyzicoError ? e.kind : "other"));
      return json({ code: "retrieve_failed" }, 500);
    }
    const hookPid = String(body.iyziPaymentId ?? body.paymentId ?? "");
    if (hookPid && r.paymentId && hookPid !== r.paymentId) {
      console.error(`webhook paymentId mismatch order=${order.id}`);
      return json({ ignored: true, reason: "payment_id_mismatch" });
    }
    const out = await applyFact(admin, order.id, "webhook", mapCheckoutRetrieve(r)); // DB hatası fırlatır → 500
    return json({ outcome: out.outcome });
  } catch (e) {
    if (e instanceof HttpError) return json({ code: e.code }, e.status, e.headers);
    if (e instanceof IyzicoError && e.kind === "config") return json({ code: "unavailable" }, 503);
    console.error("iyzico-webhook error:", (e as Error).message);
    return json({ code: "internal" }, 500);
  }
});
