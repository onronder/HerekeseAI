// Girişli ve erişimi etkin kullanıcıya kısa ömürlü okuma tokenı (10 dk). Erişim kararı book_access_check (service rolü):
// etkin erişimde token güncel erişim sürümünü (epoch) taşır; yazar (yönetici) için a=1 ve içerikte rol yeniden denetlenir.
// Token e-posta taşımaz (K4).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors, signReadToken } from "../_shared/token.ts";
import { errorResponse, HttpError, json, requestId, requireMethod } from "../_shared/http.ts";
import { getVerifiedUser, serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { PRODUCT_CODE } from "../_shared/fulfil.ts";

const TOKEN_TTL_SECONDS = 600;

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  const rid = requestId();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    requireMethod(req, ["POST", "GET"]);
    const user = await getVerifiedUser(req);
    const admin = serviceClient();
    await limit(admin, `token:${user.id}`, 20, 600, { critical: false });
    const { data, error } = await admin.rpc("book_access_check", { p_user: user.id, p_product: PRODUCT_CODE });
    if (error) throw new HttpError(503, "db_unavailable", true);
    const acc = data as { active: boolean; epoch: number; admin: boolean };
    const e = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    let token: string;
    if (acc.active) token = await signReadToken({ u: user.id, p: PRODUCT_CODE, ep: Number(acc.epoch), k: "read", e });
    else if (acc.admin) token = await signReadToken({ u: user.id, p: PRODUCT_CODE, ep: 0, a: 1, k: "read", e });
    else throw new HttpError(403, "no_entitlement");
    return json({ token, expiresIn: TOKEN_TTL_SECONDS }, 200, corsHeaders);
  } catch (err) {
    if (err instanceof HttpError) return errorResponse(err, rid, corsHeaders);
    console.error("book-token error rid=" + rid, (err as Error).message);
    return errorResponse(new HttpError(500, "internal", true), rid, corsHeaders);
  }
});
