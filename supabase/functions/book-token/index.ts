// Girişli + erişim hakkı olan kullanıcıya kısa ömürlü okuma tokenı verir.
// En az yetki: service role KULLANILMAZ — entitlement kendi-satır RLS ile,
// yazar denetimi SECURITY DEFINER has_role() ile kullanıcı bağlamında okunur.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, makeRateLimiter, signReadToken } from "../_shared/token.ts";

const PRODUCT_CODE = "herkes-icin-yz";
const TOKEN_TTL_SECONDS = 600; // 10 dakika
const allow = makeRateLimiter(10, 10 * 60 * 1000); // kullanıcı başına 10 token / 10 dk

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!allow(user.id)) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: ent } = await userClient
      .from("book_entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_code", PRODUCT_CODE)
      .maybeSingle();

    // Erişim kaydı yoksa: yönetici (yazar) her zaman okuyabilir
    let orderTag = ent ? String(ent.id).slice(0, 8) : "";
    if (!ent) {
      const { data: isAdmin } = await userClient.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "no_entitlement" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      orderTag = "yazar";
    }

    const token = await signReadToken({
      u: user.id,
      m: user.email ?? "",
      o: orderTag,
      e: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    });

    return new Response(
      JSON.stringify({ token, expiresIn: TOKEN_TTL_SECONDS }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("book-token error:", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
