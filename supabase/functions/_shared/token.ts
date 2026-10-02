// Kısa ömürlü okuma tokenı: book-token üretir, book-content doğrular.
// Token istemciden Authorization başlığıyla taşınır (query-string loglara düşer).
// İçerik: kullanıcı kimliği, ürün, erişim sürümü (epoch), amaç ve süre. E-posta TAŞINMAZ (K4): filigran içeriği
// sunucuda kullanıcı kaydından çözülür. İmzalı ama şifreli değildir; gizli veri koyulmaz.

const enc = new TextEncoder();

async function hmacSha256Hex(key: string, data: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64urlEncode(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string): string {
  return atob(s.replace(/-/g, "+").replace(/_/g, "/"));
}

export interface ReadToken {
  u: string; // kullanıcı kimliği
  p: string; // ürün kodu
  ep: number; // erişim sürümü (book_access_state.epoch); yazar tokenında 0
  a?: 1; // yazar (yönetici) erişimi: içerikte güncel rol yeniden denetlenir
  k: "read"; // amaç
  e: number; // bitiş (unix saniye)
}

export async function signReadToken(payload: ReadToken): Promise<string> {
  const secret = Deno.env.get("BOOK_TOKEN_SECRET") ?? "";
  if (!secret) throw new Error("BOOK_TOKEN_SECRET not configured");
  const body = b64urlEncode(JSON.stringify(payload));
  return `${body}.${await hmacSha256Hex(secret, body)}`;
}

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function verifyReadToken(token: string): Promise<ReadToken | null> {
  const secret = Deno.env.get("BOOK_TOKEN_SECRET") ?? "";
  if (!secret || token.length > 2048) return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacSha256Hex(secret, body);
  if (sig.length !== expected.length) return null;
  let diff = 0; // sabit-zamanlı karşılaştırma
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const t = JSON.parse(b64urlDecode(body)) as ReadToken;
    // Alan tipleri, amaç ve süre denetimi
    if (typeof t.u !== "string" || !UUID_RX.test(t.u)) return null;
    if (typeof t.p !== "string" || t.p.length > 64) return null;
    if (!Number.isInteger(t.ep) || t.ep < 0) return null;
    if (t.k !== "read") return null;
    if (!Number.isInteger(t.e) || t.e < Math.floor(Date.now() / 1000)) return null;
    if (t.a !== undefined && t.a !== 1) return null;
    return t;
  } catch {
    return null;
  }
}

// CORS: yalnız kendi origin'imiz. localhost yalnız geliştirmede (ALLOW_LOCALHOST_ORIGIN=1).
// CORS yetkilendirme değildir; sunucu tarafı denetimlerin yerine geçmez.
export function cors(req: Request): Record<string, string> {
  const allowed = ["https://book.onuronder.com"];
  if (Deno.env.get("ALLOW_LOCALHOST_ORIGIN") === "1") allowed.push("http://localhost:8643");
  const origin = req.headers.get("Origin") ?? "";
  const h: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, idempotency-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (allowed.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export function htmlEscape(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
