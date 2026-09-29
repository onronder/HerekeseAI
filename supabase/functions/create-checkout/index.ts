// Kitap satın alma: iyzico Checkout Form başlatır, paymentPageUrl döner.
// JWT doğrulamalı (config.toml'da istisna YOK) — yalnız girişli kullanıcı çağırır.
// Sipariş satırı burada açılır; conversationId = basketId = sipariş id (tek kimlik).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, makeRateLimiter } from "../_shared/token.ts";
import { bookPrice, initializeCheckoutForm, IyzicoError, iyzicoEnv } from "../_shared/iyzico.ts";
import { PRODUCT_CODE } from "../_shared/fulfil.ts";

const PRODUCT_NAME = "Herkes İçin Yapay Zekâ (dijital kitap, TR+EN)";
const allow = makeRateLimiter(5, 10 * 60 * 1000); // kullanıcı başına 5 başlatma / 10 dk

function cleanName(s: string, fallback: string): string {
  const v = String(s || "").replace(/\s+/g, " ").trim().slice(0, 50);
  return v || fallback;
}

// gsmNumber belgede zorunlu; kullanıcı vermezse yer tutucu (sandbox'ta kabulü test planı #1).
function normalizeGsm(raw: unknown): string {
  const digits = String(raw ?? "").replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("90") && d.length === 12) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = d.slice(1);
  return /^5\d{9}$/.test(d) ? `+90${d}` : "+905000000000";
}

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user || !user.email) return json({ error: "unauthorized" }, 401);
    if (!allow(user.id)) return json({ error: "rate_limited" }, 429);

    const body = await req.json().catch(() => ({}));
    const lang: "tr" | "en" = body?.lang === "en" ? "en" : "tr";
    if (body?.consent !== true) return json({ error: "consent_required" }, 400);

    let env;
    try {
      env = iyzicoEnv();
    } catch {
      return json({ error: "checkout_unavailable" }, 503);
    }
    // Sandbox anahtarları canlı projede: yalnız yönetici test edebilir (test kartıyla gerçek erişim alınamasın).
    if (env.mode === "sandbox") {
      const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "sandbox_admin_only" }, 403);
    }

    // Zaten sahipse yeni ödeme başlatma (RLS: kendi satırı).
    const { data: ent } = await userClient
      .from("book_entitlements").select("id").eq("user_id", user.id).eq("product_code", PRODUCT_CODE).maybeSingle();
    if (ent) return json({ alreadyOwned: true });

    const admin = createClient(supabaseUrl, serviceKey);
    const orderId = crypto.randomUUID();
    const price = bookPrice();
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "85.34.78.112";
    const gsm = normalizeGsm(body?.gsm);

    const fullName = cleanName(String(user.user_metadata?.full_name ?? ""), "");
    let name = "Okur", surname = "Okur";
    if (fullName.includes(" ")) {
      const k = fullName.lastIndexOf(" ");
      name = fullName.slice(0, k).trim() || "Okur";
      surname = fullName.slice(k + 1).trim() || "Okur";
    } else if (fullName) {
      name = fullName;
    } else {
      name = cleanName(user.email.split("@")[0], "Okur");
    }

    const { error: insErr } = await admin.from("book_orders").insert({
      id: orderId,
      user_id: user.id,
      product_code: PRODUCT_CODE,
      lang,
      conversation_id: orderId,
      basket_id: orderId,
      price,
      currency: "TRY",
      status: "created",
      consent_at: new Date().toISOString(),
      buyer_email: user.email,
      buyer_gsm: gsm === "+905000000000" ? null : gsm,
      buyer_ip: ip,
    });
    if (insErr) throw insErr;

    const callbackUrl = `${supabaseUrl}/functions/v1/iyzico-callback`;
    let result;
    try {
      result = await initializeCheckoutForm({
        orderId,
        lang,
        price,
        productCode: PRODUCT_CODE,
        productName: PRODUCT_NAME,
        callbackUrl,
        buyer: { id: user.id, name, surname, email: user.email, gsmNumber: gsm, identityNumber: "11111111111", ip },
      });
    } catch (e) {
      const msg = e instanceof IyzicoError ? `${e.kind}: ${e.message}` : String(e);
      console.error("initialize error:", msg);
      await admin.from("book_orders").update({ status: "failed", raw: { error: msg } }).eq("id", orderId);
      return json({ error: "payment_init_failed" }, 502);
    }

    if (!result.ok) {
      console.error("iyzico initialize failed:", result.errorCode, result.errorMessage);
      await admin.from("book_orders").update({ status: "failed", raw: result.raw }).eq("id", orderId);
      return json({ error: "payment_init_failed", code: result.errorCode ?? null }, 502);
    }

    // checkoutFormContent (gömülü form HTML'i) saklanmaz; yönlendirme kullanılıyor.
    const rawSlim = { ...result.raw };
    delete rawSlim.checkoutFormContent;
    await admin.from("book_orders").update({ status: "initialized", iyzico_token: result.token, raw: rawSlim }).eq("id", orderId);

    return json({ paymentPageUrl: result.paymentPageUrl, orderId, expiresIn: result.tokenExpireTime ?? 1800 });
  } catch (e) {
    console.error("create-checkout error:", e);
    return json({ error: "internal" }, 500);
  }
});
