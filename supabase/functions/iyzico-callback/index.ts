// iyzico ödeme dönüşü: alıcının tarayıcısı buraya `token` ile POST edilir (form-urlencoded; JSON da kabul).
// Sonuç ASLA bu POST'tan okunmaz; token yalnız sipariş arama anahtarıdır. Karar: CF-Retrieve + imza → applyFact.
// verify_jwt = false (iyzico JWT gönderemez). Yanıt: 303 → site dönüş sayfası (status yalnız görünüm içindir;
// sayfa sonucu order-status'tan okur). Açık yönlendirme yok: hedef sabit site + sipariş kimliği.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { clientIp, HttpError, readText, UUID_RX } from "../_shared/http.ts";
import { serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { IyzicoError, retrieveCheckoutForm, siteUrl } from "../_shared/iyzico.ts";
import { mapCheckoutRetrieve } from "../_shared/provider-map.ts";
import { applyFact, loadOrderByToken } from "../_shared/fulfil.ts";

function redirect(lang: string, status: "ok" | "fail" | "pending", orderId?: string): Response {
  const q = new URLSearchParams({ status });
  if (orderId && UUID_RX.test(orderId)) q.set("order", orderId);
  const path = lang === "en" ? "/en/purchase" : "/satin-alma";
  return new Response(null, { status: 303, headers: { Location: `${siteUrl()}${path}?${q.toString()}`, "Cache-Control": "no-store" } });
}

serve(async (req: Request) => {
  if (req.method !== "POST") return redirect("tr", "fail");
  const admin = serviceClient();
  try {
    await limit(admin, `cb:${clientIp(req) ?? "noip"}`, 30, 60, { critical: false });
    const ct = (req.headers.get("Content-Type") ?? "").toLowerCase();
    const text = await readText(req, 4096);
    let token = "";
    if (ct.includes("application/json")) {
      try { token = String((JSON.parse(text) as { token?: unknown }).token ?? ""); } catch { token = ""; }
    } else {
      token = new URLSearchParams(text).get("token") ?? "";
    }
    token = token.trim();
    if (!token || token.length > 200) return redirect("tr", "fail");

    const order = await loadOrderByToken(admin, token);
    if (!order) return redirect("tr", "fail"); // bilinmeyen token: sağlayıcı çağrısı tetiklenmez
    const lang = order.lang === "en" ? "en" : "tr";
    let r;
    try {
      r = await retrieveCheckoutForm(token, lang, order.conversation_id);
    } catch (e) {
      console.error("callback retrieve error kind=" + (e instanceof IyzicoError ? e.kind : "other"));
      return redirect(lang, "pending", order.id); // uzlaştırma (order-status / ops-worker) tamamlar
    }
    const out = await applyFact(admin, order.id, "callback", mapCheckoutRetrieve(r));
    const view = out.outcome === "paid" || out.outcome === "already_paid" ? "ok" : out.outcome === "failed" ? "fail" : "pending";
    return redirect(lang, view, order.id);
  } catch (e) {
    if (e instanceof HttpError && e.status === 429) return new Response("Too many requests", { status: 429 });
    console.error("iyzico-callback error:", (e as Error).message);
    return redirect("tr", "pending");
  }
});
