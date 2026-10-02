// Dağıtık hız sınırı: book_rate_hit (atomik, iki kovalı kayan pencere, pencere zamanı DB'den).
// Anahtar doğrulanmış kullanıcı + uç noktadan türetilir; istemci anahtar/limit/pencere seçemez.
// DB kararı alınamazsa: kritik uç (checkout, refund, admin yazımı) → 503; düşük riskli okuma → isolate belleğiyle
// en iyi çaba (metrik loglanır). Yetkilendirme hiçbir durumda bu yedekle gevşemez.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { HttpError } from "./http.ts";

const memory = new Map<string, { n: number; t: number }>();

function memoryHit(key: string, limit: number, windowS: number): boolean {
  const now = Date.now();
  if (memory.size > 5000) for (const [k, v] of memory) if (now - v.t > windowS * 1000) memory.delete(k);
  const e = memory.get(key);
  if (!e || now - e.t > windowS * 1000) {
    memory.set(key, { n: 1, t: now });
    return true;
  }
  e.n++;
  return e.n <= limit;
}

export async function limit(
  admin: SupabaseClient,
  key: string,
  max: number,
  windowS: number,
  opts: { critical: boolean },
): Promise<void> {
  const k = key.slice(0, 200);
  const { data, error } = await admin.rpc("book_rate_hit", { p_key: k, p_limit: max, p_window_s: windowS });
  if (error || !Array.isArray(data) || !data.length) {
    if (opts.critical) throw new HttpError(503, "rate_limiter_unavailable", true);
    console.warn("metric rate_limiter_fallback key=" + k.split(":")[0]);
    if (!memoryHit(k, max, windowS)) throw new HttpError(429, "rate_limited", true, { "Retry-After": String(windowS) });
    return;
  }
  const row = data[0] as { allowed: boolean; retry_after: number };
  if (!row.allowed) throw new HttpError(429, "rate_limited", true, { "Retry-After": String(Math.max(1, row.retry_after)) });
}
