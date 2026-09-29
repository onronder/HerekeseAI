// iyzico fraud sonucu bildirimi (IFN): POST {"paymentId": ..., "fraudStatus": 2 | -1}
// Panel: fraud callback URL'si → bu fonksiyon. Belge imza vermiyor; gövdeye güvenilmez:
// sipariş paymentId ile bulunur, sonuç Retrieve Payment (/payment/detail) + imza ile alınır → fulfil() / markRefunded().
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { makeRateLimiter } from "../_shared/token.ts";
import { IyzicoError, retrievePaymentDetail, siteUrl } from "../_shared/iyzico.ts";
import { fulfil, loadOrderByPaymentId, markRefunded } from "../_shared/fulfil.ts";

const allow = makeRateLimiter(60, 60 * 1000);

serve(async (req: Request) => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(ip)) return json({ error: "rate_limited" }, 429);

  try {
    const body = await req.json().catch(() => null);
    const paymentId = String(body?.paymentId ?? "").trim();
    if (!paymentId) return json({ ignored: true, reason: "no_payment_id" });
    console.log(`ifn paymentId=${paymentId} fraudStatus=${body?.fraudStatus}`);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const order = await loadOrderByPaymentId(admin, paymentId);
    if (!order) return json({ ignored: true, reason: "unknown_order" });

    let r;
    try {
      r = await retrievePaymentDetail({ paymentId }, order.lang === "en" ? "en" : "tr");
    } catch (e) {
      console.error("retrieve error:", e instanceof IyzicoError ? `${e.kind}: ${e.message}` : e);
      return json({ error: "retrieve_failed" }, 500);
    }
    if (r.status !== "success" || !r.signatureValid) return json({ outcome: "unchanged" });

    // İnceleme sonrası red: iyzico iadeyi yapar; erişim kapanır.
    if (r.fraudStatus === -1) {
      const ok = await markRefunded(admin, order, r.raw, "ifn");
      return json({ outcome: ok ? "refunded" : "unchanged" });
    }
    // İnceleme sonrası onay (2) ya da zaten onaylı (1): fulfil review → paid.
    const outcome = await fulfil(admin, order, r, "ifn", siteUrl());
    return json({ outcome });
  } catch (e) {
    console.error("iyzico-ifn error:", e);
    return json({ error: "internal" }, 500);
  }
});
