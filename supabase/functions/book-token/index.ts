// Girişli + erişim hakkı olan kullanıcıya kısa ömürlü okuma tokenı verir.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, signReadToken } from "../_shared/token.ts";

const PRODUCT_CODE = "herkes-icin-yz";
const TOKEN_TTL_SECONDS = 600; // 10 dakika

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: ent } = await admin
      .from("book_entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_code", PRODUCT_CODE)
      .maybeSingle();

    // Erişim kaydı yoksa: yönetici (yazar) her zaman okuyabilir
    let orderTag = ent ? String(ent.id).slice(0, 8) : "";
    if (!ent) {
      const { data: role } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) {
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
