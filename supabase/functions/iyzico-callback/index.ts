// iyzico ödeme dönüşü: alıcının tarayıcısı buraya `token` ile POST edilir (belge: CF-Retrieve/Redirection).
// Sonuç ASLA bu POST'tan okunmaz; token yalnız sipariş arama anahtarıdır. Karar: CF-Retrieve + imza → fulfil().
// verify_jwt = false (iyzico JWT gönderemez). Yanıt: 303 → site dönüş sayfası (status yalnız görünüm içindir).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { makeRateLimiter } from "../_shared/token.ts";
import { IyzicoError, retrieveCheckoutForm, siteUrl } from "../_shared/iyzico.ts";
import { fulfil, loadOrderByToken } from "../_shared/fulfil.ts";

const allow = makeRateLimiter(20, 60 * 1000); // IP başına 20 / dk
const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function purchasePath(lang: string): string {
  return lang === "en" ? "/en/purchase" : "/satin-alma";
}

function redirect(lang: string, status: "ok" | "fail" | "pending", orderId?: string): Response {
  const site = siteUrl();
  const q = new URLSearchParams({ status });
  if (orderId && UUID_RX.test(orderId)) q.set("order", orderId);
  return new Response(null, {
    status: 303,
    headers: { Location: `${site}${purchasePath(lang)}?${q.toString()}`, "Cache-Control": "no-store" },
  });
}

serve(async (req: Request) => {
  if (req.method !== "POST") return redirect("tr", "fail");
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(ip)) return new Response("Too many requests", { status: 429 });

  try {
    let token = "";
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const form = await req.formData();
      token = String(form.get("token") ?? "");
    } else {
      const body = await req.json().catch(() => ({}));
      token = String(body?.token ?? "");
    }
    token = token.trim();
    if (!token || token.length > 200) return redirect("tr", "fail");

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const order = await loadOrderByToken(admin, token);
    if (!order) {
      console.error("iyzico-callback: unknown token");
      return redirect("tr", "fail");
    }
    const lang = order.lang === "en" ? "en" : "tr";

    let r;
    try {
      r = await retrieveCheckoutForm(token, lang, order.conversation_id);
    } catch (e) {
      console.error("retrieve error:", e instanceof IyzicoError ? `${e.kind}: ${e.message}` : e);
      return redirect(lang, "pending", order.id); // dönüş sayfası mutabakatla tamamlar
    }

    const outcome = await fulfil(admin, order, r, "callback", siteUrl());
    if (outcome === "paid" || outcome === "already_paid") return redirect(lang, "ok", order.id);
    if (outcome === "failed") return redirect(lang, "fail", order.id);
    return redirect(lang, "pending", order.id);
  } catch (e) {
    console.error("iyzico-callback error:", e);
    return redirect("tr", "fail");
  }
});
