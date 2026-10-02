// Yönetici: elle erişim kaynakları (JWT + güncel admin rolü; aktör RPC'ye doğrulanmış kimlikle geçer, RPC yeniden doğrular).
// action:
//  - grant {email, note?, lang?}: alıcı TAM e-posta eşleşmesiyle bulunur → book_grant_manual (ayrı kaynak satırı)
//      → "kitabın açıldı" e-postası olay anahtarı grant:<kaynak> ile kuyruktan hemen denenir
//  - list {email}: alıcının erişim kaynakları (satın alma + elle) ve erişim durumu
//  - revoke {sourceId, reason?}: yalnız o kaynağı kapatır; erişim kalan kaynaklardan yeniden hesaplanır
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors } from "../_shared/token.ts";
import { errorResponse, HttpError, json, readJson, requestId, requireMethod, UUID_RX } from "../_shared/http.ts";
import { getVerifiedUser, requireAdmin, serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { deliverNow } from "../_shared/outbox.ts";
import { PRODUCT_CODE } from "../_shared/fulfil.ts";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  const rid = requestId();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    requireMethod(req, ["POST"]);
    const user = await getVerifiedUser(req);
    const admin = serviceClient();
    await requireAdmin(admin, user.id);
    await limit(admin, `grant:${user.id}`, 30, 600, { critical: true });
    const body = await readJson(req, 2048);
    const action = String(body.action ?? "grant");

    const findUser = async () => {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!EMAIL_RX.test(email) || email.length > 254) throw new HttpError(400, "bad_email");
      const { data, error } = await admin.rpc("book_find_user_by_email", { p_email: email });
      if (error) throw new HttpError(503, "db_unavailable", true);
      const rows = (data ?? []) as { user_id: string; lang: string }[];
      if (rows.length !== 1) throw new HttpError(404, "user_not_found");
      return rows[0];
    };

    if (action === "grant") {
      const target = await findUser();
      const lang = body.lang === "en" || body.lang === "tr" ? body.lang : target.lang;
      const note = body.note ? String(body.note).slice(0, 200) : null;
      const { data, error } = await admin.rpc("book_grant_manual", { p_user: target.user_id, p_product: PRODUCT_CODE, p_actor: user.id, p_note: note, p_lang: lang });
      if (error) throw new HttpError(error.code === "42501" ? 403 : 503, error.code === "42501" ? "forbidden" : "db_unavailable", error.code !== "42501");
      const g = data as { action: string; source_id?: string; outbox_id?: string };
      if (g.action !== "granted") throw new HttpError(404, g.action);
      const mail = await deliverNow(admin, g.outbox_id);
      return json({ ok: true, source_id: g.source_id, mailed: mail === "accepted", mail_state: mail }, 200, corsHeaders);
    }

    if (action === "list") {
      const target = await findUser();
      const { data: sources } = await admin.from("book_entitlement_source")
        .select("id,source_type,order_id,granted_at,note,revoked_at,revoke_reason")
        .eq("user_id", target.user_id).eq("product_code", PRODUCT_CODE).order("granted_at", { ascending: false }).limit(50);
      const { data: acc } = await admin.rpc("book_access_check", { p_user: target.user_id, p_product: PRODUCT_CODE });
      return json({ sources: sources ?? [], access: acc }, 200, corsHeaders);
    }

    if (action === "revoke") {
      const sourceId = String(body.sourceId ?? "");
      if (!UUID_RX.test(sourceId)) throw new HttpError(400, "bad_request");
      const reason = body.reason ? String(body.reason).slice(0, 100) : "admin";
      const { data, error } = await admin.rpc("book_revoke_source", { p_source: sourceId, p_actor: user.id, p_reason: reason });
      if (error) throw new HttpError(error.code === "42501" ? 403 : 503, error.code === "42501" ? "forbidden" : "db_unavailable", error.code !== "42501");
      return json(data, 200, corsHeaders);
    }
    throw new HttpError(400, "bad_action");
  } catch (e) {
    if (e instanceof HttpError) return errorResponse(e, rid, corsHeaders);
    console.error("grant-book error rid=" + rid, (e as Error).message);
    return errorResponse(new HttpError(500, "internal", true), rid, corsHeaders);
  }
});
