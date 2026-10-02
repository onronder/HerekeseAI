// Kitabı private bucket'tan çekip alıcıya özel filigranla döner. verify_jwt=false: güvenlik kısa ömürlü HMAC tokenındadır.
// Anında iptal (yazar kararı): her istekte güncel erişim yeniden denetlenir —
//  - normal token: book_access_state.active VE epoch = token.ep  (iade/iptal sonrası yeniden açılan erişimde eski token geçersiz)
//  - yazar tokenı (a=1): güncel admin rolü
//  - erişim yok → 403; denetim yapılamadı → 503 (fail-closed: içerik verilmez)
// Filigran içeriği sunucuda çözülür (token e-posta taşımaz). WATERMARK_MODE: email (varsayılan) | code (opak kod).
// K4: görünür filigran biçimi ilk müşteriden önce kesinleşir. Yanıt no-store.
// Supabase gateway Content-Type'ı ezebildiği için içerik istemcide fetch + iframe.srcdoc ile basılır (CORS şart).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors, htmlEscape, verifyReadToken } from "../_shared/token.ts";
import { HttpError, requireMethod } from "../_shared/http.ts";
import { serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";

async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function text(body: string, status: number, h: Record<string, string>): Response {
  return new Response(body, { status, headers: { ...h, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    requireMethod(req, ["GET"]);
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") === "en" ? "en" : "tr";
    const auth = req.headers.get("Authorization") ?? "";
    const payload = await verifyReadToken(auth.startsWith("Bearer ") ? auth.slice(7) : "");
    if (!payload) return text("Erişim süresi doldu ya da geçersiz. / Access expired or invalid.", 401, corsHeaders);

    const admin = serviceClient();
    await limit(admin, `content:${payload.u}`, 40, 600, { critical: false });
    const { data, error } = await admin.rpc("book_access_check", { p_user: payload.u, p_product: payload.p });
    if (error) return text("Erişim denetlenemedi. / Access check unavailable.", 503, corsHeaders);
    const acc = data as { active: boolean; epoch: number; admin: boolean };
    const ok = payload.a === 1 ? acc.admin : acc.active && Number(acc.epoch) === payload.ep;
    if (!ok) return text("Bu hesapta erişim yok. / No access on this account.", 403, corsHeaders);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const objRes = await fetch(`${supabaseUrl}/storage/v1/object/book/book-${lang}.html`, {
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    });
    if (!objRes.ok) {
      console.error("storage fetch failed status=" + objRes.status);
      return text("Content unavailable", 503, corsHeaders);
    }
    let html = await objRes.text();

    // Filigran: kullanıcı kaydından (e-posta) ya da opak kod; değer HTML'e kaçırılarak eklenir
    const code = (await sha256Hex(`${payload.u}:${payload.ep}`)).slice(0, 10).toUpperCase();
    let label = code;
    if ((Deno.env.get("WATERMARK_MODE") ?? "email") === "email") {
      const { data: u } = await admin.auth.admin.getUserById(payload.u);
      label = u?.user?.email ?? code;
    }
    const tag = payload.a === 1 ? "yazar" : `E${payload.ep}`;
    html = html
      .replaceAll("%%WM_EMAIL%%", htmlEscape(label))
      .replaceAll("%%WM_ORDER%%", htmlEscape(tag))
      .replaceAll("%%WM_HASH%%", (await sha256Hex(`${label}|${tag}`)).slice(0, 16));
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    if (e instanceof HttpError) return text(e.code, e.status, { ...corsHeaders, ...e.headers });
    console.error("book-content error:", (e as Error).message);
    return text("Internal error", 500, corsHeaders);
  }
});
