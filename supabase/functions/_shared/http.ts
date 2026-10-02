// HTTP yardımcıları: method allowlist, sınırlı gövde okuma, tutarlı hata gövdesi.
// Hata gövdesi: {code, message, retryable, request_id}. Ham sağlayıcı yanıtı ya da sır istemciye gitmez.

export class HttpError extends Error {
  status: number;
  code: string;
  retryable: boolean;
  headers: Record<string, string>;
  constructor(status: number, code: string, retryable = false, headers: Record<string, string> = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.retryable = retryable;
    this.headers = headers;
  }
}

export function requestId(): string {
  return crypto.randomUUID();
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export function errorResponse(e: HttpError, rid: string, headers: Record<string, string> = {}): Response {
  return json({ code: e.code, message: e.code, retryable: e.retryable, request_id: rid }, e.status, { ...headers, ...e.headers });
}

// Yanlış method → 405 + Allow
export function requireMethod(req: Request, allowed: string[]): void {
  if (!allowed.includes(req.method)) {
    throw new HttpError(405, "method_not_allowed", false, { Allow: allowed.join(", ") });
  }
}

// Gövdeyi akış olarak sayarak okur; Content-Length başlığına güvenmez. Aşımda 413.
export async function readText(req: Request, maxBytes: number): Promise<string> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      try { await reader.cancel(); } catch { /* yok say */ }
      throw new HttpError(413, "payload_too_large");
    }
    chunks.push(value);
  }
  const buf = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { buf.set(c, off); off += c.byteLength; }
  return new TextDecoder().decode(buf);
}

// JSON nesnesi bekler: Content-Type application/json, boyut sınırı, bozuk JSON → 400.
export async function readJson(req: Request, maxBytes: number): Promise<Record<string, unknown>> {
  const ct = (req.headers.get("Content-Type") ?? "").toLowerCase();
  if (!ct.includes("application/json")) throw new HttpError(415, "unsupported_media_type");
  const text = await readText(req, maxBytes);
  if (!text) return {};
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch {
    throw new HttpError(400, "bad_json");
  }
  if (!v || typeof v !== "object" || Array.isArray(v)) throw new HttpError(400, "bad_json");
  return v as Record<string, unknown>;
}

export const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// İstemci IP'si: Supabase gateway'in eklediği x-forwarded-for zincirinin İLK değeri. Biçim doğrulanır;
// geçersizse null (sabit/uydurma IP saklanmaz). Platformun başlığı nasıl kurduğu D04 kapsamında teyit edilir.
export function clientIp(req: Request): string | null {
  const first = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(first) && first.split(".").every((p) => Number(p) <= 255)) return first;
  if (/^[0-9a-f:]{2,39}$/i.test(first) && first.includes(":")) return first;
  return null;
}
