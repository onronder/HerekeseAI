// Kısa ömürlü okuma tokenı: book-token üretir, book-content doğrular.
// iframe header taşıyamadığı için token query-string ile gider; ömrü kısadır.

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

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
