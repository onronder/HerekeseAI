// Yönetici: sunucu tarafı durdurma anahtarları ve işletim sağlığı (JWT + güncel admin rolü; aktör RPC'de yeniden doğrulanır).
// action: get → {settings, health};  set {key: checkout_enabled|refunds_enabled, value: boolean}
// Satış/iade durdurulduğunda yeni ödeme ve iade başlatma sunucuda 503 döner; callback/webhook/uzlaştırma çalışmaya devam eder.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors } from "../_shared/token.ts";
import { errorResponse, HttpError, json, readJson, requestId, requireMethod } from "../_shared/http.ts";
import { getVerifiedUser, requireAdmin, serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  const rid = requestId();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    requireMethod(req, ["POST"]);
    const user = await getVerifiedUser(req);
    const admin = serviceClient();
    await requireAdmin(admin, user.id);
    await limit(admin, `settings:${user.id}`, 60, 600, { critical: true });
    const body = await readJson(req, 1024);
    if (body.action === "set") {
      const key = String(body.key ?? "");
      if (!["checkout_enabled", "refunds_enabled"].includes(key) || typeof body.value !== "boolean") throw new HttpError(422, "bad_setting");
      const { data, error } = await admin.rpc("book_set_app_setting", { p_key: key, p_value: body.value, p_actor: user.id });
      if (error) throw new HttpError(error.code === "42501" ? 403 : 503, error.code === "42501" ? "forbidden" : "db_unavailable");
      return json({ settings: data }, 200, corsHeaders);
    }
    const [{ data: settings }, { data: health }] = await Promise.all([
      admin.from("book_app_settings").select("checkout_enabled,refunds_enabled,updated_at").eq("id", 1).maybeSingle(),
      admin.from("book_ops_health").select("*").maybeSingle(),
    ]);
    return json({ settings, health }, 200, corsHeaders);
  } catch (e) {
    if (e instanceof HttpError) return errorResponse(e, rid, corsHeaders);
    console.error("admin-settings error rid=" + rid, (e as Error).message);
    return errorResponse(new HttpError(500, "internal", true), rid, corsHeaders);
  }
});
