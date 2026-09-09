// Kitabı private bucket'tan çekip alıcıya özel filigranla döner.
// verify_jwt=false: istemci fetch'i kısa ömürlü HMAC tokenıyla gelir; güvenlik tokendadır.
// Token, loglara düşmemesi için query-string yerine Authorization başlığıyla taşınır.
// NOT: Supabase gateway, fonksiyon yanıtlarının Content-Type'ını text/plain+nosniff'e
// zorlayabildiği için içerik iframe src olarak DEĞİL, istemcide fetch edilip
// iframe.srcdoc ile basılır (store.js). Bu yüzden CORS başlıkları şarttır.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors, htmlEscape, makeRateLimiter, verifyReadToken } from "../_shared/token.ts";

const allow = makeRateLimiter(30, 10 * 60 * 1000); // kullanıcı başına 30 istek / 10 dk

async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") === "en" ? "en" : "tr";
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    const payload = await verifyReadToken(token);
    if (!payload) {
      return new Response("Erişim süresi doldu ya da geçersiz. / Access expired or invalid.", {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    if (!allow(payload.u)) {
      return new Response("Too many requests", { status: 429, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const objRes = await fetch(
      `${supabaseUrl}/storage/v1/object/book/book-${lang}.html`,
      { headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey } },
    );
    if (!objRes.ok) {
      console.error("storage fetch failed:", objRes.status);
      return new Response("Content unavailable", { status: 503, headers: corsHeaders });
    }
    let html = await objRes.text();

    const wmHash = (await sha256Hex(`${payload.m}|${payload.o}`)).slice(0, 16);
    html = html
      .replaceAll("%%WM_EMAIL%%", htmlEscape(payload.m || payload.u.slice(0, 8)))
      .replaceAll("%%WM_ORDER%%", htmlEscape(payload.o))
      .replaceAll("%%WM_HASH%%", wmHash);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (e) {
    console.error("book-content error:", e);
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});
