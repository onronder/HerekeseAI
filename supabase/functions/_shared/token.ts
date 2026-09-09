// Kısa ömürlü okuma tokenı: book-token üretir, book-content doğrular.
// Token istemciden Authorization başlığıyla taşınır (query-string loglara düşer).

const enc = new TextEncoder();

async function hmacSha256Hex(key: string, data: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function b64urlEncode(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string): string {
  return atob(s.replace(/-/g, "+").replace(/_/g, "/"));
}

export interface ReadToken {
  u: string; // user id
  m: string; // alıcı e-postası (filigran)
  o: string; // erişim kaydı kısa id (filigran)
  e: number; // exp (unix saniye)
}

export async function signReadToken(payload: ReadToken): Promise<string> {
  const secret = Deno.env.get("BOOK_TOKEN_SECRET") ?? "";
  if (!secret) throw new Error("BOOK_TOKEN_SECRET not configured");
  const body = b64urlEncode(JSON.stringify(payload));
  const sig = await hmacSha256Hex(secret, body);
  return `${body}.${sig}`;
}

export async function verifyReadToken(token: string): Promise<ReadToken | null> {
  const secret = Deno.env.get("BOOK_TOKEN_SECRET") ?? "";
  if (!secret) return null;
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
    const payload = JSON.parse(b64urlDecode(body)) as ReadToken;
    if (!payload.u || !payload.e || payload.e < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// CORS: yalnız kendi origin'lerimiz. Origin göndermeyen (tarayıcı dışı) isteklere
// ACAO dönülmez; izinsiz origin'ler ACAO alamadığı için yanıtı okuyamaz.
const ALLOWED_ORIGINS = [
  "https://book.onuronder.com",
  "http://localhost:8643", // yerel önizleme
];

export function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const h: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (ALLOWED_ORIGINS.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export function htmlEscape(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Basit istek sınırlayıcı. Isolate başına bellek içi (best-effort): soğuk başlatma
// sayaçları sıfırlar, birden çok isolate ayrı sayar — amaç kaba kötüye kullanımı kesmek.
export function makeRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { n: number; t: number }>();
  return (key: string): boolean => {
    const now = Date.now();
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now - v.t > windowMs) hits.delete(k);
    }
    const e = hits.get(key);
    if (!e || now - e.t > windowMs) {
      hits.set(key, { n: 1, t: now });
      return true;
    }
    e.n++;
    return e.n <= limit;
  };
}
