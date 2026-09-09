// Admin (has_role 'admin') bir alıcının e-postasına kitabı açar.
// iyzilink ödemesini panelde gören Onur, /yonetim'den bu fonksiyonu çağırır.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors } from "../_shared/token.ts";

const PRODUCT_CODE = "herkes-icin-yz";
const SITE = "https://book.onuronder.com";
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Çağıran admin mi?
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "unauthorized" }, 401);

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: role } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) return json({ error: "forbidden" }, 403);

    const { email, note, lang } = await req.json();
    const target = String(email ?? "").trim().toLowerCase();
    if (!EMAIL_RX.test(target) || target.length > 254) return json({ error: "bad_email" }, 400);
    const langParam = lang === "en" || lang === "tr" ? lang : null;

    // Alıcı hesabını bul (kayıtlı olmalı; satın alma akışı önce üyelik istiyor)
    let buyer: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null = null;
    let page = 1;
    while (!buyer && page <= 20) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      buyer = data.users.find((u) => (u.email ?? "").toLowerCase() === target) ?? null;
      if (data.users.length < 200) break;
      page++;
    }
    if (!buyer) return json({ error: "user_not_found" }, 404);

    const { error: upErr } = await admin.from("book_entitlements").upsert(
      {
        user_id: buyer.id,
        product_code: PRODUCT_CODE,
        granted_by: user.email ?? user.id,
        note: note ? String(note).slice(0, 200) : null,
      },
      { onConflict: "user_id,product_code", ignoreDuplicates: false },
    );
    if (upErr) throw upErr;

    // "Kitabın açıldı" e-postası (best-effort; Resend doğrudan — proje secret'ı ortak)
    let mailed = false;
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        // Dil: açık parametre > alıcının kayıt dili (user_metadata.lang) > TR
        const buyerLang = langParam ?? (buyer.user_metadata?.lang as string | undefined) ?? "tr";
        const isEn = buyerLang === "en";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Herkes İçin Yapay Zekâ <noreply@onuronder.com>",
            to: [target],
            subject: isEn
              ? "Your book is unlocked — AI for Everyone"
              : "Kitabın açıldı — Herkes İçin Yapay Zekâ",
            html: isEn
              ? `<p>Your purchase is confirmed and the book is now unlocked.</p><p><a href="${SITE}/en/read">Start reading</a> — sign in with this email address.</p>`
              : `<p>Ödemen onaylandı, kitabın açıldı.</p><p><a href="${SITE}/oku">Okumaya başla</a> — bu e-posta adresinle giriş yapman yeterli.</p>`,
          }),
        });
        mailed = res.ok;
        if (!res.ok) console.error("resend failed:", res.status, await res.text());
      }
    } catch (mailErr) {
      console.error("access email failed:", mailErr);
    }

    return json({ ok: true, userId: buyer.id, mailed });
  } catch (e) {
    console.error("grant-book error:", e);
    return json({ error: "internal" }, 500);
  }
});
