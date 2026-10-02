// P2 ortak katman birim testleri (Deno). Çalıştırma: npx -y deno test --allow-env --allow-net=127.0.0.1 tests/p2/unit
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { mapCheckoutRetrieve, mapPaymentDetail, mapRefundV2, matchRefund } from "../../../supabase/functions/_shared/provider-map.ts";
import { projectPayment } from "../../../supabase/functions/_shared/projection.ts";
import { clientIp, HttpError, readJson, requireMethod } from "../../../supabase/functions/_shared/http.ts";
import { signReadToken, verifyReadToken } from "../../../supabase/functions/_shared/token.ts";
import { sendResend } from "../../../supabase/functions/_shared/mail.ts";
import { render, type OutboxRow } from "../../../supabase/functions/_shared/outbox.ts";
import { isProviderPageUrl, type RetrieveResult } from "../../../supabase/functions/_shared/iyzico.ts";

const OID = "11111111-2222-3333-4444-555555555555";
function rr(over: Partial<RetrieveResult> & { raw?: Record<string, unknown> } = {}): RetrieveResult {
  const raw = {
    status: "success", paymentStatus: "SUCCESS", paymentId: "999", fraudStatus: 1, price: "349.0", paidPrice: "349.0", currency: "TRY",
    conversationId: OID, basketId: OID, binNumber: "552879", lastFourDigits: "0008", cardFamily: "Bonus", cardAssociation: "MASTER_CARD",
    token: "secret-token", signature: "abc", errorMessage: "kart sahibi Ali Veli",
    itemTransactions: [{ itemId: "herkes-icin-yz", paymentTransactionId: "tx1", transactionStatus: 2, price: "349.0", paidPrice: "349.0", subMerchantKey: "x" }],
    ...(over.raw ?? {}),
  };
  return { status: String(raw.status), paymentStatus: String(raw.paymentStatus), paymentId: "999", fraudStatus: Number(raw.fraudStatus), signatureValid: true, raw, ...over } as RetrieveResult;
}

// ---------------------------------------------------------------- K06 veri azaltma
Deno.test("K06 projection: BIN, son 4, kart ailesi, token, imza ve hata metni saklanmaz; satır paidPrice ve itemId saklanır", () => {
  const p = projectPayment(rr().raw);
  const s = JSON.stringify(p);
  for (const bad of ["552879", "0008", "Bonus", "MASTER_CARD", "secret-token", "Ali Veli", "subMerchantKey"]) assert(!s.includes(bad), bad);
  assertEquals(p.item_transactions[0], { itemId: "herkes-icin-yz", paymentTransactionId: "tx1", transactionStatus: 2, price: "349.0", paidPrice: "349.0" });
  assertEquals(p.raw_schema, 1);
});
Deno.test("K06 projection: dizi sınırı 5, uzun/bozuk değerler kırpılır ya da null", () => {
  const items = Array.from({ length: 9 }, (_, i) => ({ itemId: "x".repeat(200), price: i % 2 ? "abc" : "1.5" }));
  const p = projectPayment({ itemTransactions: items, paidPrice: "1e9" });
  assertEquals(p.item_transactions.length, 5);
  assertEquals(p.item_transactions[0].itemId!.length, 64);
  assertEquals(p.item_transactions[1].price, null);
  assertEquals(p.paid_price, null);
});

// ---------------------------------------------------------------- D7 sağlayıcı eşlemesi
Deno.test("D7 CF-Retrieve: fraud 1 → approved, 0 → review, -1 → rejected, 2 bu uçta → review", () => {
  assertEquals(mapCheckoutRetrieve(rr())!.kind, "approved");
  assertEquals(mapCheckoutRetrieve(rr({ fraudStatus: 0 }))!.kind, "review");
  assertEquals(mapCheckoutRetrieve(rr({ fraudStatus: -1 }))!.kind, "rejected");
  assertEquals(mapCheckoutRetrieve(rr({ fraudStatus: 2 }))!.kind, "review");
});
Deno.test("D7 /payment/detail: fraud 2 (inceleme sonrası onay) → approved", () => {
  assertEquals(mapPaymentDetail(rr({ fraudStatus: 2 }))!.kind, "approved");
});
Deno.test("D7 imzası doğrulanamayan ya da API hatası olan yanıt karar üretmez (null)", () => {
  assertEquals(mapCheckoutRetrieve(rr({ signatureValid: false })), null);
  assertEquals(mapCheckoutRetrieve(rr({ status: "failure" })), null);
});
Deno.test("D7 FAILURE → failure; 3DS ara durumu → pending", () => {
  assertEquals(mapCheckoutRetrieve(rr({ paymentStatus: "FAILURE" }))!.kind, "failure");
  assertEquals(mapCheckoutRetrieve(rr({ paymentStatus: "INIT_THREEDS" }))!.kind, "pending");
});
Deno.test("D7 'ödeme yok' yalnız doğrulanmış hata kodlarıyla; kod listesi boşken asla not_found üretilmez", () => {
  const f = rr({ status: "failure", signatureValid: false, raw: { status: "failure", errorCode: "5115" } });
  Deno.env.delete("IYZICO_NOT_FOUND_CODES");
  assertEquals(mapPaymentDetail(f), null);
  Deno.env.set("IYZICO_NOT_FOUND_CODES", "5115, 5116");
  assertEquals(mapPaymentDetail(f)!.kind, "not_found");
  Deno.env.delete("IYZICO_NOT_FOUND_CODES");
});
Deno.test("D7 Refund V2: success → tutar/döviz normalize; failure → hata kodu; tanımsız → unknown", () => {
  assertEquals(mapRefundV2({ status: "success", price: "100", currency: "TRY", paymentId: "9" }), { kind: "success", provider_refund_id: null, amount: "100.00", currency: "TRY" });
  assertEquals(mapRefundV2({ status: "failure", errorCode: "10051", errorMessage: "x" }), { kind: "failure", error_code: "10051" });
  assertEquals(mapRefundV2({}), { kind: "unknown" });
});
Deno.test("D7 iade eşleştirme: conversationId eşleşmesi > tek aday > çok aday needs_review > eski ve kayıtsız needs_review", () => {
  const now = new Date().toISOString();
  const op = { id: "op-1", amount: "100.00", currency: "TRY", createdAt: now };
  const rep = (refunds: unknown[]) => ({ status: "success", payments: [{ paymentRefundStatus: "PARTIALLY_REFUNDED", refunds }] });
  assertEquals(matchRefund(rep([{ conversationId: "op-1", refundPrice: "100", currency: "TRY", refundTxId: "r1" }]), op, []).kind, "success");
  assertEquals(matchRefund(rep([{ refundPrice: "100", currency: "TRY", refundTxId: "r2", createdDate: now }]), op, []).kind, "success");
  assertEquals(matchRefund(rep([{ refundPrice: "100", currency: "TRY", refundTxId: "r2" }, { refundPrice: "100", currency: "TRY", refundTxId: "r3" }]), op, []).kind, "needs_review");
  assertEquals(matchRefund(rep([{ refundPrice: "100", currency: "TRY", refundTxId: "r2" }]), op, ["r2"]).kind, "unknown", "bilinen kayıt yeniden kullanılmaz");
  assertEquals(matchRefund(rep([{ refundPrice: "50", currency: "TRY", refundTxId: "r4" }]), op, []).kind, "unknown", "tutar uyuşmuyor, yeni");
  const old = { ...op, createdAt: new Date(Date.now() - 31 * 60_000).toISOString() };
  assertEquals(matchRefund(rep([]), old, []).kind, "needs_review", "kayıt yokluğu otomatik başarısız sayılmaz");
  assertEquals(matchRefund({ status: "success" }, op, []).kind, "unknown", "biçim tanınmazsa karar yok");
});

// ---------------------------------------------------------------- K07 parser ve method
Deno.test("K07 requireMethod: yanlış method → 405 + Allow", () => {
  try { requireMethod(new Request("http://x", { method: "GET" }), ["POST"]); throw new Error("geçmemeliydi"); }
  catch (e) { assert(e instanceof HttpError); assertEquals(e.status, 405); assertEquals(e.headers.Allow, "POST"); }
});
Deno.test("K07 readJson: Content-Length olmadan sınır aşımı 413; bozuk JSON 400; yanlış tip 415; dizi reddedilir", async () => {
  const big = new ReadableStream({ start(c) { for (let i = 0; i < 10; i++) c.enqueue(new TextEncoder().encode("x".repeat(1000))); c.close(); } });
  const cases: [Request, number][] = [
    [new Request("http://x", { method: "POST", headers: { "Content-Type": "application/json" }, body: big, duplex: "half" } as RequestInit), 413],
    [new Request("http://x", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{bozuk" }), 400],
    [new Request("http://x", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "{}" }), 415],
    [new Request("http://x", { method: "POST", headers: { "Content-Type": "application/json" }, body: "[1,2]" }), 400],
  ];
  for (const [req, code] of cases) {
    try { await readJson(req, 4096); throw new Error("geçmemeliydi"); }
    catch (e) { assert(e instanceof HttpError, String(e)); assertEquals(e.status, code); }
  }
  assertEquals(await readJson(new Request("http://x", { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"a":1}' }), 4096), { a: 1 });
});
Deno.test("K07 clientIp: yalnız geçerli IP; sahte/bozuk başlık → null (sabit IP saklanmaz)", () => {
  const ip = (v: string) => clientIp(new Request("http://x", { headers: { "x-forwarded-for": v } }));
  assertEquals(ip("85.1.2.3, 10.0.0.1"), "85.1.2.3");
  assertEquals(ip("999.1.1.1"), null);
  assertEquals(ip("<script>"), null);
  assertEquals(ip("2a00:1450:4001::200e"), "2a00:1450:4001::200e");
});

// ---------------------------------------------------------------- K05 token
Deno.test("K05 token: e-posta taşımaz; imza/süre/amaç/tip denetimi; bozulmuş imza reddedilir", async () => {
  Deno.env.set("BOOK_TOKEN_SECRET", "t".repeat(40));
  const u = OID;
  const tok = await signReadToken({ u, p: "herkes-icin-yz", ep: 3, k: "read", e: Math.floor(Date.now() / 1000) + 60 });
  const body = JSON.parse(atob(tok.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")));
  assert(!("m" in body) && !JSON.stringify(body).includes("@"));
  assertEquals((await verifyReadToken(tok))!.ep, 3);
  assertEquals(await verifyReadToken(tok.slice(0, -1) + (tok.endsWith("a") ? "b" : "a")), null);
  const expired = await signReadToken({ u, p: "herkes-icin-yz", ep: 3, k: "read", e: Math.floor(Date.now() / 1000) - 1 });
  assertEquals(await verifyReadToken(expired), null);
  // deno-lint-ignore no-explicit-any
  const wrongKind = await signReadToken({ u, p: "herkes-icin-yz", ep: 3, k: "write" as any, e: Math.floor(Date.now() / 1000) + 60 });
  assertEquals(await verifyReadToken(wrongKind), null);
  // deno-lint-ignore no-explicit-any
  const badUser = await signReadToken({ u: "1 OR 1=1", p: "herkes-icin-yz", ep: 3, k: "read", e: Math.floor(Date.now() / 1000) + 60 } as any);
  assertEquals(await verifyReadToken(badUser), null);
});

// ---------------------------------------------------------------- K04 e-posta
Deno.test("K04 sendResend: Idempotency-Key = olay anahtarı; 2xx accepted; 429/5xx geçici; 4xx kalıcı; ağ hatası geçici", async () => {
  const seen: { key: string | null }[] = [];
  let status = 200;
  const srv = Deno.serve({ port: 0, onListen() {} }, (req) => {
    seen.push({ key: req.headers.get("Idempotency-Key") });
    return status === 200 ? Response.json({ id: "re_1" }) : new Response("alici@example.test geçersiz", { status });
  });
  Deno.env.set("RESEND_API_KEY", "k");
  Deno.env.set("RESEND_API_BASE", `http://127.0.0.1:${srv.addr.port}`);
  const send = () => sendResend({ to: "a@example.test", subject: "s", html: "h", idempotencyKey: "receipt:abc" });
  const a = await send(); status = 429; const b = await send(); status = 503; const c = await send(); status = 422; const d = await send();
  await srv.shutdown();
  Deno.env.set("RESEND_API_BASE", "http://127.0.0.1:1");
  const e = await send();
  assertEquals(seen.map((x) => x.key), ["receipt:abc", "receipt:abc", "receipt:abc", "receipt:abc"]);
  assertEquals([a.ok, a.providerMessageId], [true, "re_1"]);
  assertEquals([b.ok, b.permanent, c.permanent, d.permanent, d.errorCode], [false, false, false, true, "http_422"]);
  assertEquals([e.ok, e.permanent, e.errorCode], [false, false, "network"]);
  Deno.env.delete("RESEND_API_BASE");
});
Deno.test("K04 iade e-postası: kısmi iadede 'erişim değişmedi', tam iadede 'erişim kapatıldı'", () => {
  const base: OutboxRow = { id: "1", event_key: "refund:op1", kind: "refund", order_id: OID, recipient: "a@example.test", lang: "tr", payload: { amount: 100, full: false }, lease_version: 1 };
  assert(render(base).html.includes("erişimin değişmedi"));
  assert(render({ ...base, payload: { amount: 349, full: true } }).html.includes("erişimi kapatıldı"));
  assert(render({ ...base, event_key: "fraud_refund:x", payload: { amount: 349 } }).html.includes("erişimi kapatıldı"));
});

// ---------------------------------------------------------------- B01 ödeme sayfası adresi
Deno.test("B01 paymentPageUrl yalnız HTTPS + iyzipay.com", () => {
  assert(isProviderPageUrl("https://sandbox-cpp.iyzipay.com/?token=x"));
  assert(isProviderPageUrl("https://cpp.iyzipay.com/x"));
  assert(!isProviderPageUrl("http://cpp.iyzipay.com/x"));
  assert(!isProviderPageUrl("https://iyzipay.com.evil.example/x"));
  assert(!isProviderPageUrl("javascript:alert(1)"));
});
