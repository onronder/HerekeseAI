// Kitabı private bucket'tan çekip alıcıya özel filigranla servis eder.
// verify_jwt=false: iframe JWT taşıyamaz; güvenlik kısa ömürlü HMAC tokenında.
// Filigran servis anında basılır ki filigransız ana kopya asla istemciye inmesin.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifyReadToken } from "../_shared/token.ts";

async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("t") ?? "";
    const lang = url.searchParams.get("lang") === "en" ? "en" : "tr";

    const payload = await verifyReadToken(token);
    if (!payload) {
      return new Response("Erişim süresi doldu ya da geçersiz. / Access expired or invalid.", {
        status: 401,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const objRes = await fetch(
      `${supabaseUrl}/storage/v1/object/book/book-${lang}.html`,
      { headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey } },
    );
    if (!objRes.ok) {
      console.error("storage fetch failed:", objRes.status);
      return new Response("Content unavailable", { status: 503 });
    }
    let html = await objRes.text();

    const wmHash = (await sha256Hex(`${payload.m}|${payload.o}`)).slice(0, 16);
    html = html
      .replaceAll("%%WM_EMAIL%%", payload.m || payload.u.slice(0, 8))
      .replaceAll("%%WM_ORDER%%", payload.o)
      .replaceAll("%%WM_HASH%%", wmHash);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
        // Yalnız kitap sitesi (ve yerel geliştirme) iframe'leyebilir
        "Content-Security-Policy":
          "frame-ancestors 'self' https://book.onuronder.com https://*.vercel.app http://localhost:* http://127.0.0.1:*",
      },
    });
  } catch (e) {
    console.error("book-content error:", e);
    return new Response("Internal error", { status: 500 });
  }
});
