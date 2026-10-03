// Kitap satın alma: iyzico Checkout Form başlatır. JWT'li (config.toml'da istisna yok).
// Sözleşme (P2): Idempotency-Key başlığı zorunlu (UUID). Snapshot (ürün, fiyat, döviz, koşul sürümü, dil) sunucuda kurulur.
//  - aynı anahtar + aynı snapshot → aynı iş;  farklı snapshot → 409 idempotency_conflict
//  - kullanıcı+ürün başına tek açık sipariş (inceleme dahil): yeni oturum açılmaz; oturum geçerliyse aynı sayfa döner,
//    değilse sağlayıcıyla uzlaştırma denenir; sonuç belirsizse 202 (yeni ödeme önerilmez)
//  - koşul sürümü eskiyse 409 terms_outdated;  satış durdurulduysa 503 paused (book_app_settings)
//  - iki ayrı beyan zorunlu (consent_contract: sözleşme kabulü, consent: hemen ifa/cayma); sipariş, kabul edilen
//    değişmez Türkçe koşul metninin SHA-256'sını taşır (book_policy_version); metin yayımlanmamışsa 503 terms_unavailable
//  - başlatma yanıtı kaybolursa sipariş 'unknown' kalır ve uzlaştırmaya girer; yeni oturum açılmaz
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { cors } from "../_shared/token.ts";
import { clientIp, errorResponse, HttpError, json, readJson, requestId, requireMethod, UUID_RX } from "../_shared/http.ts";
import { getVerifiedUser, isAdmin, serviceClient } from "../_shared/authz.ts";
import { limit } from "../_shared/limiter.ts";
import { bookPrice, initializeCheckoutForm, IyzicoError, iyzicoEnv, retrievePaymentDetail } from "../_shared/iyzico.ts";
import { mapPaymentDetail } from "../_shared/provider-map.ts";
import { applyFact, PRODUCT_CODE } from "../_shared/fulfil.ts";

const PRODUCT_NAME = "Herkes İçin Yapay Zekâ (dijital kitap, TR+EN)";
const termsVersion = () => Deno.env.get("TERMS_VERSION") ?? "2026-10-02";

function cleanName(s: string, fallback: string): string {
  const v = String(s || "").replace(/\s+/g, " ").trim().slice(0, 50);
  return v || fallback;
}
// gsmNumber iyzico'da zorunlu; verilmezse yer tutucu yalnız sağlayıcıya gider, saklanmaz (D04'te alan kuralı teyit edilir)
function normalizeGsm(raw: unknown): string | null {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.startsWith("90") && d.length === 12) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = d.slice(1);
  return /^5\d{9}$/.test(d) ? `+90${d}` : null;
}
async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  const corsHeaders = cors(req);
  const rid = requestId();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    requireMethod(req, ["POST"]);
    const user = await getVerifiedUser(req);
    if (!user.email) throw new HttpError(401, "unauthorized");
    const admin = serviceClient();
    await limit(admin, `checkout:${user.id}`, 5, 600, { critical: true });

    const idem = req.headers.get("Idempotency-Key") ?? "";
    if (!UUID_RX.test(idem)) throw new HttpError(400, "idempotency_key_required");
    const body = await readJson(req, 4096);
    const lang: "tr" | "en" = body.lang === "en" ? "en" : "tr";
    // İki ayrı beyan: ön bilgilendirme + mesafeli satış sözleşmesi kabulü ve hemen ifa/cayma beyanı
    if (body.consent !== true) throw new HttpError(422, "consent_required");
    if (body.consent_contract !== true) throw new HttpError(422, "contract_consent_required");
    if (String(body.terms_version ?? "") !== termsVersion()) {
      return json({ code: "terms_outdated", terms_version: termsVersion(), request_id: rid }, 409, corsHeaders);
    }
    const consentKinds = ["pre_contract", "distance_sales", "withdrawal_waiver"];
    // Kabul edilen metin: güncel sürümün yayımlanmış, değiştirilemez Türkçe kopyası (yoksa sipariş açılmaz)
    const { data: pol, error: pErr } = await admin.from("book_policy_version").select("content_hash")
      .eq("kind", "terms_bundle").eq("locale", "tr").eq("version", termsVersion()).maybeSingle();
    if (pErr) throw new HttpError(503, "db_unavailable", true);
    if (!pol) {
      console.error("terms snapshot missing version=" + termsVersion());
      throw new HttpError(503, "terms_unavailable", true);
    }
    const termsHash = String((pol as { content_hash: string }).content_hash);

    let env;
    try { env = iyzicoEnv(); } catch { throw new HttpError(503, "checkout_unavailable", true); }
    // Sandbox anahtarları açıkken yalnız yönetici dener (test kartıyla gerçek erişim alınamasın)
    if (env.mode === "sandbox" && !(await isAdmin(admin, user.id))) throw new HttpError(403, "sandbox_admin_only");

    const price = bookPrice();
    const snapshot = await sha256Hex(JSON.stringify({ p: PRODUCT_CODE, price, cur: "TRY", tv: termsVersion(), th: termsHash, lang }));
    const ip = clientIp(req);
    const gsm = normalizeGsm(body.gsm);

    const { data: begun, error: bErr } = await admin.rpc("book_checkout_begin", {
      p_user: user.id, p_product: PRODUCT_CODE, p_idem_key: idem, p_snapshot_hash: snapshot, p_price: price, p_currency: "TRY",
      p_lang: lang, p_terms_version: termsVersion(), p_terms_locale: lang, p_consent_kinds: consentKinds,
      p_email: user.email, p_gsm: gsm, p_ip: ip, p_env: env.mode, p_lease_seconds: 60, p_terms_hash: termsHash,
    });
    if (bErr) throw new HttpError(503, "db_unavailable", true);
    const b = begun as { action: string; order_id?: string; status?: string; payment_page_url?: string | null; token_expires_at?: string | null };

    if (b.action === "paused") return json({ code: "paused", request_id: rid }, 503, corsHeaders);
    if (b.action === "terms_unavailable") throw new HttpError(503, "terms_unavailable", true);
    if (b.action === "owned") return json({ alreadyOwned: true }, 200, corsHeaders);
    if (b.action === "conflict") return json({ code: "idempotency_conflict", request_id: rid }, 409, corsHeaders);

    if (b.action === "existing" || b.action === "open") {
      const orderId = b.order_id!;
      // Aynı anahtar sonuçlanmış bir işe denk geldi: ödendiyse sahip; başarısız/kapandıysa yeni anahtarla yeni deneme
      if (b.status === "paid") return json({ alreadyOwned: true }, 200, corsHeaders);
      if (b.status === "failed" || b.status === "expired_confirmed" || b.status === "expired" || b.status === "refunded") {
        return json({ code: "retry_new_attempt", orderId, request_id: rid }, 409, corsHeaders);
      }
      const fresh = b.token_expires_at ? new Date(b.token_expires_at).getTime() - Date.now() > 60_000 : false;
      if (b.status === "initialized" && fresh && b.payment_page_url) {
        return json({ paymentPageUrl: b.payment_page_url, orderId, resumed: true }, 200, corsHeaders);
      }
      if (b.status === "created") return json({ orderId, pending: true, request_id: rid }, 202, corsHeaders); // başka istek başlatıyor
      // Oturum dolmuş / belirsiz / inceleme: önce sağlayıcıya sor; ödeme yoksa ve süre dolduysa sipariş kapanır
      try {
        const r = await retrievePaymentDetail({ paymentConversationId: orderId }, lang);
        const sessionClosed = b.token_expires_at != null && new Date(b.token_expires_at).getTime() < Date.now();
        const out = await applyFact(admin, orderId, "status", mapPaymentDetail(r, { sessionClosed }));
        if (out.outcome === "paid" || out.outcome === "already_paid") return json({ alreadyOwned: true }, 200, corsHeaders);
        if (out.outcome === "expired_confirmed" || out.outcome === "failed") return json({ code: "retry_new_attempt", orderId, request_id: rid }, 409, corsHeaders);
      } catch (e) {
        console.error("checkout reconcile error kind=" + (e instanceof IyzicoError ? e.kind : "db"));
      }
      return json({ orderId, checking: true, status: b.status, request_id: rid }, 202, corsHeaders);
    }

    // Yeni sipariş: sağlayıcı oturumu
    const orderId = b.order_id!;
    const fullName = cleanName(String(user.user_metadata?.full_name ?? ""), "");
    let name = "Okur", surname = "Okur";
    if (fullName.includes(" ")) {
      const k = fullName.lastIndexOf(" ");
      name = fullName.slice(0, k).trim() || "Okur";
      surname = fullName.slice(k + 1).trim() || "Okur";
    } else if (fullName) {
      name = fullName;
    } else {
      name = cleanName(user.email.split("@")[0], "Okur");
    }
    const callbackUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/iyzico-callback`;
    let result;
    try {
      result = await initializeCheckoutForm({
        orderId, lang, price, productCode: PRODUCT_CODE, productName: PRODUCT_NAME, callbackUrl,
        // Zorunlu ama toplanmayan alanlar iyzico.ts'deki kurala göre doldurulur; IP yoksa gönderilmez
        buyer: { id: user.id, name, surname, email: user.email, gsmNumber: gsm, ip },
      });
    } catch (e) {
      // Ağ/zaman aşımı/biçim: oturum açılmış olabilir → unknown, uzlaştırmaya girer; yeni oturum açılmaz
      console.error("initialize error kind=" + (e instanceof IyzicoError ? e.kind : "other"));
      await admin.rpc("book_checkout_init_result", { p_order: orderId, p_kind: "unknown", p_error_code: e instanceof IyzicoError ? e.kind : "other" });
      return json({ orderId, checking: true, request_id: rid }, 202, corsHeaders);
    }
    if (!result.ok) {
      const code = result.errorCode ?? "init_failed";
      // İmza uyuşmazlığı oturumun açılmadığını kanıtlamaz → unknown; sağlayıcının kesin iş hatası → failed
      const kind = code === "signature_mismatch" || code === "bad_page_url" ? "unknown" : "failed";
      console.error(`initialize failed code=${code} kind=${kind}`);
      await admin.rpc("book_checkout_init_result", { p_order: orderId, p_kind: kind, p_error_code: code });
      if (kind === "unknown") return json({ orderId, checking: true, request_id: rid }, 202, corsHeaders);
      return json({ code: "payment_init_failed", provider_code: code, request_id: rid }, 502, corsHeaders);
    }
    const expiresAt = new Date(Date.now() + (result.tokenExpireTime ?? 1800) * 1000).toISOString();
    const { error: iErr } = await admin.rpc("book_checkout_initialized", {
      p_order: orderId, p_token: result.token, p_page_url: result.paymentPageUrl, p_token_expires_at: expiresAt,
    });
    if (iErr) throw new HttpError(503, "db_unavailable", true);
    return json({ paymentPageUrl: result.paymentPageUrl, orderId }, 200, corsHeaders);
  } catch (e) {
    if (e instanceof HttpError) return errorResponse(e, rid, corsHeaders);
    console.error("create-checkout error rid=" + rid, (e as Error).name);
    return errorResponse(new HttpError(500, "internal", true), rid, corsHeaders);
  }
});
