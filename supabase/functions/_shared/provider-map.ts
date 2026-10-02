// iyzico sonuçlarının UÇ NOKTA BAZINDA eşlenmesi. Enumlar uç noktalar arasında karıştırılmaz; karar SQL'de
// (book_apply_payment_result / book_apply_refund_result) verilir, burası yalnız normalize eder.
//
// | Uç nokta                  | Kullanılan alanlar                                            | Yerel karşılık
// | CF-Retrieve               | status, paymentStatus, fraudStatus (1/0/-1), tutarlar, kimlikler | approved/review/rejected/failure/pending
// | /payment/detail           | aynı + fraudStatus 2 (inceleme sonrası onay); "kayıt yok" kodu   | uzlaştırma; not_found yalnız buradan
// | Webhook (HPP), IFN        | yalnız tetikleyici; sonuç her zaman Retrieve / payment/detail'dan | —
// | Refund V2                 | status, price, currency, (sağlayıcı iade kimliği)                | success/failure; ağ hatası → unknown
// | Reporting payment details | paymentRefundStatus + iade kayıtları (kimlik/tutar/döviz/durum)  | belirsiz iadenin eşleştirilmesi
//
// Sandbox'ta doğrulanması gerekenler (D04, tests/p2/fixtures): "ödeme kaydı yok" hata kodları (IYZICO_NOT_FOUND_CODES),
// Refund V2 yanıtındaki iade kimliği alanı, reporting iade kaydı alan adları. Doğrulanana kadar güvenli varsayılan:
// not_found üretilmez (sipariş açık kalır, uzlaştırma sürer), iade eşleşmesi tek anlamlı değilse needs_review.
import type { RetrieveResult } from "./iyzico.ts";
import { projectPayment, errorCodeOf, type PaymentProjection } from "./projection.ts";

export type PaymentKind = "approved" | "review" | "rejected" | "failure" | "pending" | "not_found";
export type PaymentFact = PaymentProjection & { kind: PaymentKind };

// İmza doğrulanamayan ya da API hatası olan yanıt karar üretmez (null).
function fromVerified(r: RetrieveResult, allowFraud2: boolean): PaymentFact | null {
  if (r.status !== "success" || !r.signatureValid) return null;
  const p = projectPayment(r.raw);
  const ps = (r.paymentStatus ?? "").toUpperCase();
  let kind: PaymentKind;
  if (ps === "SUCCESS") {
    const f = r.fraudStatus;
    if (f === 1 || (allowFraud2 && f === 2)) kind = "approved";
    else if (f === 0) kind = "review";
    else if (f === -1) kind = "rejected";
    else kind = "review"; // beklenmeyen fraud değeri: teslim yok, inceleme
  } else if (ps === "FAILURE") {
    kind = "failure";
  } else {
    kind = "pending"; // INIT_THREEDS, CALLBACK_THREEDS, INIT_BANK_TRANSFER ... ya da alan yok
  }
  return { ...p, kind };
}

// CF-Retrieve (callback, webhook): fraudStatus 2 bu uçta beklenmez; gelirse inceleme sayılır.
export function mapCheckoutRetrieve(r: RetrieveResult): PaymentFact | null {
  return fromVerified(r, false);
}

function notFoundCodes(): Set<string> {
  return new Set((Deno.env.get("IYZICO_NOT_FOUND_CODES") ?? "").split(",").map((x) => x.trim()).filter(Boolean));
}

// /payment/detail (uzlaştırma, IFN): fraudStatus 2 = inceleme sonrası onay. "Kayıt yok" yalnız doğrulanmış kodlarla.
export function mapPaymentDetail(r: RetrieveResult): PaymentFact | null {
  if (r.status === "failure") {
    const code = errorCodeOf(r.raw) ?? "";
    if (code && notFoundCodes().has(code)) {
      return { ...projectPayment({}), kind: "not_found" };
    }
    return null;
  }
  return fromVerified(r, true);
}

// ---------------------------------------------------------------- iade
export type RefundResult =
  | { kind: "success"; provider_refund_id: string | null; amount: string | null; currency: string | null }
  | { kind: "failure"; error_code: string | null }
  | { kind: "unknown" }
  | { kind: "needs_review"; error_code: string };

function moneyStr(v: unknown): string | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : null;
}

export function mapRefundV2(raw: Record<string, unknown>): RefundResult {
  if (raw.status === "success") {
    const id = raw.refundHostReference ?? raw.hostReference ?? raw.paymentTransactionId ?? null;
    return { kind: "success", provider_refund_id: id == null ? null : String(id).slice(0, 64), amount: moneyStr(raw.price), currency: raw.currency == null ? null : String(raw.currency) };
  }
  if (raw.status === "failure") return { kind: "failure", error_code: errorCodeOf(raw) };
  return { kind: "unknown" };
}

interface ReportRefund { id: string | null; conversationId: string | null; amount: string | null; currency: string | null; ok: boolean; at: number | null }

function reportRefunds(raw: Record<string, unknown>): ReportRefund[] | null {
  const payments = Array.isArray(raw.payments) ? (raw.payments as Record<string, unknown>[]) : null;
  if (!payments || !payments.length) return null;
  const list = Array.isArray(payments[0].refunds) ? (payments[0].refunds as Record<string, unknown>[]) : [];
  return list.map((x) => {
    const id = x.refundTxId ?? x.refundHostReference ?? x.paymentTransactionId ?? x.id ?? null;
    const st = String(x.refundStatus ?? x.status ?? "").toUpperCase();
    const at = x.createdDate ?? x.refundDate ?? null;
    return {
      id: id == null ? null : String(id),
      conversationId: x.conversationId == null ? null : String(x.conversationId),
      amount: moneyStr(x.refundPrice ?? x.price ?? x.amount),
      currency: x.currency == null ? null : String(x.currency),
      ok: st === "" || st === "SUCCESS" || st === "1" || st === "COMPLETED",
      at: at == null ? null : Number(new Date(String(at))),
    };
  });
}

// Belirsiz iade işleminin raporlamayla eşleştirilmesi. Yalnız "kısmi iade var" bilgisiyle kapatılmaz.
//  1) conversationId = op id olan başarılı kayıt → eşleşme
//  2) yoksa: tutar + döviz eşit, işlemden sonra oluşmuş, başka bir yerel işleme bağlı olmayan TEK başarılı kayıt → eşleşme
//  3) birden çok aday → needs_review;  hiç aday yok ve işlem 30 dk'dan eski → needs_review (otomatik başarısız sayılmaz);  aksi → unknown
export function matchRefund(
  raw: Record<string, unknown>,
  op: { id: string; amount: string; currency: string; createdAt: string },
  knownProviderIds: string[],
): RefundResult {
  if (raw.status !== "success") return { kind: "unknown" };
  const refunds = reportRefunds(raw);
  if (!refunds) return { kind: "unknown" };
  const amount = Number(op.amount).toFixed(2);
  const byConv = refunds.filter((r) => r.ok && r.conversationId === op.id);
  if (byConv.length === 1) return { kind: "success", provider_refund_id: byConv[0].id, amount: byConv[0].amount, currency: byConv[0].currency };
  if (byConv.length > 1) return { kind: "needs_review", error_code: "duplicate_conversation_match" };
  const created = Number(new Date(op.createdAt)) - 60_000;
  const cands = refunds.filter((r) => r.ok && r.amount === amount && r.currency === op.currency
    && (r.at == null || r.at >= created) && !(r.id && knownProviderIds.includes(r.id)));
  if (cands.length === 1) return { kind: "success", provider_refund_id: cands[0].id, amount: cands[0].amount, currency: cands[0].currency };
  if (cands.length > 1) return { kind: "needs_review", error_code: "ambiguous_match" };
  // Kayıt görünmemesi iadenin yapılmadığını kanıtlamaz (raporlama gecikebilir): otomatik başarısız sayılmaz,
  // 30 dk sonra elle incelemeye düşer; yeniden iade ancak yönetici kararıyla.
  if (Date.now() - Number(new Date(op.createdAt)) > 30 * 60_000) return { kind: "needs_review", error_code: "not_found_at_provider" };
  return { kind: "unknown" };
}
