// iyzico fraud bildirimi (IFN): {paymentId, fraudStatus}. verify_jwt=false. Belge imza vermez: gövde YALNIZ tetikleyicidir;
// fraud sonucu her zaman /payment/detail (imzalı) yanıtından okunur ve tek işlem fonksiyonuna iner:
//  2 → inceleme sonrası onay (paid);  -1 → red (paid ise refunded + erişim kapanır; inceleme ise failed).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { clientIp, HttpError, json, readJson, requireMethod } from "../_shared/http.ts";
import { serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { IyzicoError, retrievePaymentDetail } from "../_shared/iyzico.ts";
import { mapPaymentDetail } from "../_shared/provider-map.ts";
import { applyFact, loadOrderByPaymentId } from "../_shared/fulfil.ts";

serve(async (req: Request) => {
  try {
    requireMethod(req, ["POST"]);
    const admin = serviceClient();
    await limit(admin, `ifn:${clientIp(req) ?? "noip"}`, 60, 60, { critical: false });
    const body = await readJson(req, 4096);
    const paymentId = String(body.paymentId ?? "").trim();
    if (!paymentId || paymentId.length > 64) return json({ ignored: true, reason: "no_payment_id" });
    const order = await loadOrderByPaymentId(admin, paymentId);
    if (!order) return json({ ignored: true, reason: "unknown_order" });
    let r;
    try {
      r = await retrievePaymentDetail({ paymentId }, order.lang === "en" ? "en" : "tr");
    } catch (e) {
      console.error("ifn retrieve error kind=" + (e instanceof IyzicoError ? e.kind : "other"));
      return json({ code: "retrieve_failed" }, 500);
    }
    const out = await applyFact(admin, order.id, "ifn", mapPaymentDetail(r));
    return json({ outcome: out.outcome });
  } catch (e) {
    if (e instanceof HttpError) return json({ code: e.code }, e.status, e.headers);
    console.error("iyzico-ifn error:", (e as Error).message);
    return json({ code: "internal" }, 500);
  }
});
