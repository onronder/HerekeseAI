// Zamanlanmış işletim işçisi: pg_cron (5 dk) → pg_net → bu fonksiyon. verify_jwt=false; kimlik Bearer gizli anahtarla.
// Güvenlik: yalnız POST; OPS_WORKER_SECRET sabit zamanlı karşılaştırılır; eksik/yanlışsa 401 ve gövde okunmaz.
// Çalışma: book_ops_begin ile tek satırlık süreli kilit (eşzamanlı çalışma → skipped kaydı), toplam süre bütçesi 45 sn,
// sınırlı iş grupları (e-posta 25, sipariş uzlaştırma 10, iade uzlaştırma 10). Her çalışma book_ops_run'a yazılır;
// cron'un tetiklenmesi başarı sayılmaz — izleme book_ops_health.last_ok_run'a bakar.
// İşler: (1) e-posta kuyruğu  (2) açık sipariş uzlaştırma (/payment/detail; "ödeme yok" yalnız sağlayıcı teyidiyle)
//        (3) belirsiz iade uzlaştırma (raporlama eşleşmesi)  (4) saklama dry-run sayımı (silme yok, K5)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { json } from "../_shared/http.ts";
import { serviceClient } from "../_shared/authz.ts";
import { retrievePaymentDetail, timingSafeEqualStr } from "../_shared/iyzico.ts";
import { mapPaymentDetail } from "../_shared/provider-map.ts";
import { applyFact } from "../_shared/fulfil.ts";
import { sendClaimed, type OutboxRow } from "../_shared/outbox.ts";
import { reconcileRefundOp } from "../_shared/refund.ts";

const BUDGET_MS = 45_000;
const LIMITS = { outbox: 25, reconcile: 10, refunds: 10 };

serve(async (req: Request) => {
  if (req.method !== "POST") return json({ code: "method_not_allowed" }, 405, { Allow: "POST" });
  const secret = Deno.env.get("OPS_WORKER_SECRET") ?? "";
  const auth = req.headers.get("Authorization") ?? "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (secret.length < 32 || !timingSafeEqualStr(given, secret)) return json({ code: "unauthorized" }, 401);
  await req.body?.cancel();

  const started = Date.now();
  const left = () => BUDGET_MS - (Date.now() - started);
  const admin = serviceClient();
  const { data: lock, error: lErr } = await admin.rpc("book_ops_begin", { p_lease_seconds: 55 });
  if (lErr) return json({ code: "db_unavailable" }, 503);
  const { acquired, run_id } = lock as { acquired: boolean; run_id: string };
  if (!acquired) return json({ skipped: true });

  const counts: Record<string, number> = { outbox: 0, outbox_accepted: 0, reconcile: 0, reconcile_changed: 0, refunds: 0, refunds_changed: 0 };
  let ok = true;
  let errorCode: string | null = null;
  try {
    // (1) e-posta kuyruğu
    if (left() > 5000) {
      const { data } = await admin.rpc("book_claim_outbox", { p_limit: LIMITS.outbox, p_lease_seconds: 60, p_only: null });
      for (const m of (data ?? []) as OutboxRow[]) {
        if (left() < 3000) break; // lease süresi dolunca iş bir sonraki çalışmada yeniden sahiplenilir
        counts.outbox++;
        if ((await sendClaimed(admin, m)) === "accepted") counts.outbox_accepted++;
      }
    }
    // (2) açık sipariş uzlaştırma
    if (left() > 5000) {
      const { data } = await admin.rpc("book_claim_reconcile", { p_limit: LIMITS.reconcile, p_lease_seconds: 60 });
      for (const o of (data ?? []) as { id: string; conversation_id: string; lang: string; token_expires_at: string | null }[]) {
        if (left() < 3000) break;
        counts.reconcile++;
        try {
          const r = await retrievePaymentDetail({ paymentConversationId: o.conversation_id }, o.lang === "en" ? "en" : "tr");
          // Sağlayıcı yanıt kodu sayımı (book_ops_run.counts): "ödeme yok" kodunun sandbox'ta kaydı ve izleme için
          const tag = r.status === "failure" ? `detail_failure_${String(r.errorCode ?? r.raw?.errorCode ?? "none").slice(0, 12)}`
            : `detail_${String(r.paymentStatus ?? r.status ?? "none").slice(0, 20).toLowerCase()}`;
          counts[tag] = (counts[tag] ?? 0) + 1;
          const sessionClosed = o.token_expires_at != null && new Date(o.token_expires_at).getTime() < Date.now();
          const out = await applyFact(admin, o.id, "reconcile", mapPaymentDetail(r, { sessionClosed }));
          if (out.outcome !== "unchanged") counts.reconcile_changed++;
        } catch (e) {
          console.error("ops reconcile error:", (e as Error).name);
        }
      }
    }
    // (3) belirsiz iade uzlaştırma
    if (left() > 5000) {
      const { data } = await admin.rpc("book_claim_refund_reconcile", { p_limit: LIMITS.refunds, p_lease_seconds: 60 });
      for (const r of (data ?? []) as { op_id: string; order_id: string; amount: number; currency: string; payment_id: string; created_at: string }[]) {
        if (left() < 3000) break;
        counts.refunds++;
        const out = await reconcileRefundOp(admin, { id: r.op_id, order_id: r.order_id, amount: r.amount, currency: r.currency, created_at: r.created_at }, r.payment_id ?? "");
        if (out.outcome !== "unknown") counts.refunds_changed++;
      }
    }
    // (4) saklama dry-run (K5: yalnız sayım; silme yok)
    if (left() > 2000) {
      const { count } = await admin.from("book_orders").select("id", { count: "exact", head: true }).eq("provider_env", "legacy_test");
      counts.dry_run_legacy_test = count ?? 0;
    }
  } catch (e) {
    ok = false;
    errorCode = (e as Error).name || "error";
    console.error("ops-worker error:", errorCode);
  } finally {
    await admin.rpc("book_ops_finish", { p_run: run_id, p_ok: ok, p_counts: counts, p_error_code: errorCode });
  }
  return json({ ok, counts, ms: Date.now() - started });
});
