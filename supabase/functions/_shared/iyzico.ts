// iyzico REST istemcisi (Deno, resmi SDK yok).
// Belge (docs.iyzico.com, 2026-09):
//  - HMACSHA256 Auth: encryptedData = HMACSHA256(randomKey + uri.path + body, secretKey) hex;
//    Authorization: "IYZWSv2 " + base64("apiKey:"+apiKey+"&randomKey:"+randomKey+"&signature:"+encryptedData);
//    başlık x-iyzi-rnd = randomKey.
//  - Checkout Form: /payment/iyzipos/checkoutform/initialize/auth/ecom ve .../auth/ecom/detail
//  - Retrieve Payment: /payment/detail (paymentId | paymentConversationId)
//  - Refund V2: /v2/payment/refund (paymentId, price)
//  - Response Signature Validation: HMACSHA256(alanlar ':' ile birleşik, secretKey); fiyatlarda trailing-zero
//  - Webhook V3 imzası (HPP): HMACSHA256(secret + iyziEventType + iyziPaymentId + token + paymentConversationId + status, secret)

const enc = new TextEncoder();

export async function hmacSha256Hex(key: string, data: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// Belgedeki "trailing zero" kuralı: "50.00" → "50", "10.50" → "10.5", "10" → "10".
export function trim0(v: unknown): string {
  const s = String(v ?? "").trim();
  if (!/^-?\d+(\.\d+)?$/.test(s)) return s;
  if (!s.includes(".")) return s;
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

export type IyzicoErrorKind = "config" | "network" | "http" | "parse";
export class IyzicoError extends Error {
  kind: IyzicoErrorKind;
  status?: number;
  constructor(kind: IyzicoErrorKind, message: string, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

export interface IyzicoEnv {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  mode: "sandbox" | "live";
}

export function iyzicoEnv(): IyzicoEnv {
  const apiKey = Deno.env.get("IYZICO_API_KEY") ?? "";
  const secretKey = Deno.env.get("IYZICO_SECRET") ?? "";
  const baseUrl = (Deno.env.get("IYZICO_BASE_URL") ?? "https://sandbox-api.iyzipay.com").replace(/\/$/, "");
  const mode = (Deno.env.get("IYZICO_MODE") ?? "sandbox") === "live" ? "live" : "sandbox";
  if (!apiKey || !secretKey) throw new IyzicoError("config", "IYZICO_API_KEY / IYZICO_SECRET not configured");
  return { apiKey, secretKey, baseUrl, mode };
}

export type IyzicoResponse = Record<string, unknown>;

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

// Genel istek: imza belgedeki formülle. uriPath, sorgu dizesi dahil yol (GET'te sorgu da imzaya girer).
export async function iyzicoRequest(
  uriPath: string,
  body: Record<string, unknown> | null,
  method: "POST" | "GET" = "POST",
): Promise<IyzicoResponse> {
  const { apiKey, secretKey, baseUrl } = iyzicoEnv();
  const payload = body ? JSON.stringify(body) : "";
  const randomKey = `${Date.now()}${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  // IYZWSv2 imzası sorgu dizesini içermez (iyzipay istemcileri: yol "?" öncesinde kesilir; GET'te gövde yok)
  const signature = await hmacSha256Hex(secretKey, randomKey + uriPath.split("?")[0] + payload);
  const authorization = "IYZWSv2 " + btoa(`apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`);

  let res: Response;
  try {
    res = await fetch(baseUrl + uriPath, {
      method,
      headers: {
        "Authorization": authorization,
        "x-iyzi-rnd": randomKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: method === "POST" ? payload : undefined,
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {
    throw new IyzicoError("network", `iyzico ${uriPath}: ${(e as Error).message}`);
  }
  const text = await res.text();
  let json: IyzicoResponse;
  try {
    json = JSON.parse(text) as IyzicoResponse;
  } catch {
    throw new IyzicoError("parse", `iyzico ${uriPath}: non-JSON response (HTTP ${res.status})`, res.status);
  }
  // iyzico iş hatalarını 200 + status:"failure" ile de döndürür; HTTP hatası + JSON gövde yine anlamlıdır.
  if (!res.ok && json.status !== "failure") {
    throw new IyzicoError("http", `iyzico ${uriPath}: HTTP ${res.status}`, res.status);
  }
  return json;
}

// ---------------------------------------------------------------- Checkout Form

// iyzico CF-Initialize alan kuralları (docs.iyzico.com, CF başlatma): buyer.identityNumber ve gsmNumber ZORUNLU,
// buyer.ip İSTEĞE BAĞLI; tüm kalemler VIRTUAL ise shippingAddress gerekmez, billingAddress zorunlu.
// Toplanmayan zorunlu alanlar iyzico'nun resmi WooCommerce eklentisindeki gibi doldurulur
// (iyzico/iyzipay-woocommerce DataFactory: identityNumber "11111111111", boş alan "UNKNOWN"). Uydurma IP gönderilmez.
export const PLACEHOLDER_IDENTITY = "11111111111";
export const PLACEHOLDER_UNKNOWN = "UNKNOWN";

export interface CheckoutBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  gsmNumber: string | null; // null → "UNKNOWN" (alıcı telefon vermedi)
  ip: string | null; // null → alan gönderilmez (isteğe bağlı)
}

export interface CheckoutInit {
  orderId: string; // conversationId = basketId = orderId
  lang: "tr" | "en";
  price: string; // "349.00"
  productCode: string;
  productName: string;
  callbackUrl: string;
  buyer: CheckoutBuyer;
}

export type InitResult =
  | { ok: true; token: string; paymentPageUrl: string; tokenExpireTime?: number; raw: IyzicoResponse }
  | { ok: false; errorCode?: string; errorMessage?: string; raw: IyzicoResponse };

export async function initializeCheckoutForm(i: CheckoutInit): Promise<InitResult> {
  const address = "Dijital teslimat";
  const contactName = `${i.buyer.name} ${i.buyer.surname}`.trim();
  const body: Record<string, unknown> = {
    locale: i.lang,
    conversationId: i.orderId,
    price: i.price,
    paidPrice: i.price,
    currency: "TRY",
    basketId: i.orderId,
    paymentGroup: "PRODUCT",
    callbackUrl: i.callbackUrl,
    enabledInstallments: [1],
    buyer: {
      id: i.buyer.id,
      name: i.buyer.name,
      surname: i.buyer.surname,
      identityNumber: PLACEHOLDER_IDENTITY,
      email: i.buyer.email,
      gsmNumber: i.buyer.gsmNumber || PLACEHOLDER_UNKNOWN,
      registrationAddress: address,
      city: "Istanbul",
      country: "Turkey",
      ...(i.buyer.ip ? { ip: i.buyer.ip } : {}),
    },
    // Tüm kalemler VIRTUAL: shippingAddress gerekmez (belge); billingAddress zorunlu.
    billingAddress: { address, contactName, city: "Istanbul", country: "Turkey" },
    basketItems: [
      { id: i.productCode, name: i.productName, category1: "Dijital Kitap", itemType: "VIRTUAL", price: i.price },
    ],
  };
  const raw = await iyzicoRequest("/payment/iyzipos/checkoutform/initialize/auth/ecom", body);
  if (raw.status !== "success" || !raw.token || !raw.paymentPageUrl) {
    return { ok: false, errorCode: str(raw.errorCode), errorMessage: str(raw.errorMessage), raw };
  }
  // Yanıt imzası (Initialize): conversationId:token
  if (raw.signature) {
    const { secretKey } = iyzicoEnv();
    const expected = await hmacSha256Hex(secretKey, `${str(raw.conversationId)}:${str(raw.token)}`);
    if (!timingSafeEqualStr(expected, str(raw.signature))) {
      return { ok: false, errorCode: "signature_mismatch", errorMessage: "initialize signature mismatch", raw };
    }
  }
  // Yönlendirme yalnız HTTPS ve iyzico alan adına (açık yönlendirme / sahte sayfa koruması)
  if (!isProviderPageUrl(str(raw.paymentPageUrl))) {
    return { ok: false, errorCode: "bad_page_url", errorMessage: "paymentPageUrl host not allowed", raw };
  }
  return {
    ok: true,
    token: str(raw.token),
    paymentPageUrl: str(raw.paymentPageUrl),
    tokenExpireTime: typeof raw.tokenExpireTime === "number" ? raw.tokenExpireTime : undefined,
    raw,
  };
}

export function isProviderPageUrl(u: string): boolean {
  try {
    const x = new URL(u);
    return x.protocol === "https:" && (x.hostname === "iyzipay.com" || x.hostname.endsWith(".iyzipay.com"));
  } catch {
    return false;
  }
}

export interface RetrieveResult {
  status: string; // "success" | "failure"
  paymentStatus?: string; // SUCCESS | FAILURE | INIT_THREEDS | CALLBACK_THREEDS ...
  paymentId?: string;
  paymentTransactionId?: string;
  conversationId?: string;
  basketId?: string;
  price?: string;
  paidPrice?: string;
  currency?: string;
  fraudStatus?: number;
  errorCode?: string;
  errorMessage?: string;
  signatureValid: boolean; // yalnız success yanıtlarında hesaplanır
  raw: IyzicoResponse;
}

function firstTxId(raw: IyzicoResponse): string {
  const items = raw.itemTransactions;
  if (Array.isArray(items) && items.length && items[0] && typeof items[0] === "object") {
    return str((items[0] as Record<string, unknown>).paymentTransactionId);
  }
  return "";
}

function toRetrieve(raw: IyzicoResponse, signatureValid: boolean): RetrieveResult {
  const fraudRaw = raw.fraudStatus;
  return {
    status: str(raw.status),
    paymentStatus: raw.paymentStatus == null ? undefined : str(raw.paymentStatus),
    paymentId: raw.paymentId == null ? undefined : str(raw.paymentId),
    paymentTransactionId: firstTxId(raw) || undefined,
    conversationId: raw.conversationId == null ? undefined : str(raw.conversationId),
    basketId: raw.basketId == null ? undefined : str(raw.basketId),
    price: raw.price == null ? undefined : str(raw.price),
    paidPrice: raw.paidPrice == null ? undefined : str(raw.paidPrice),
    currency: raw.currency == null ? undefined : str(raw.currency),
    fraudStatus: fraudRaw == null ? undefined : Number(fraudRaw),
    errorCode: raw.errorCode == null ? undefined : str(raw.errorCode),
    errorMessage: raw.errorMessage == null ? undefined : str(raw.errorMessage),
    signatureValid,
    raw,
  };
}

// CF-Retrieve: token ile sonuç. İmza: paymentStatus:paymentId:currency:basketId:conversationId:paidPrice:price:token
export async function retrieveCheckoutForm(token: string, locale: "tr" | "en", conversationId?: string): Promise<RetrieveResult> {
  const body: Record<string, unknown> = { locale, token };
  if (conversationId) body.conversationId = conversationId;
  const raw = await iyzicoRequest("/payment/iyzipos/checkoutform/auth/ecom/detail", body);
  let valid = false;
  if (raw.status === "success" && raw.signature) {
    const { secretKey } = iyzicoEnv();
    const data = [
      str(raw.paymentStatus),
      str(raw.paymentId),
      str(raw.currency),
      str(raw.basketId),
      str(raw.conversationId),
      trim0(raw.paidPrice),
      trim0(raw.price),
      str(raw.token),
    ].join(":");
    valid = timingSafeEqualStr(await hmacSha256Hex(secretKey, data), str(raw.signature));
  }
  return toRetrieve(raw, valid);
}

// Retrieve Payment (/payment/detail): paymentId ya da bizim conversationId ile; token gerektirmez (mutabakat).
// İmza: paymentId:currency:basketId:conversationId:paidPrice:price
export async function retrievePaymentDetail(
  q: { paymentId?: string; paymentConversationId?: string },
  locale: "tr" | "en" = "tr",
): Promise<RetrieveResult> {
  const body: Record<string, unknown> = { locale };
  if (q.paymentId) body.paymentId = q.paymentId;
  if (q.paymentConversationId) body.paymentConversationId = q.paymentConversationId;
  const raw = await iyzicoRequest("/payment/detail", body);
  let valid = false;
  if (raw.status === "success" && raw.signature) {
    const { secretKey } = iyzicoEnv();
    const data = [
      str(raw.paymentId),
      str(raw.currency),
      str(raw.basketId),
      str(raw.conversationId),
      trim0(raw.paidPrice),
      trim0(raw.price),
    ].join(":");
    valid = timingSafeEqualStr(await hmacSha256Hex(secretKey, data), str(raw.signature));
  }
  return toRetrieve(raw, valid);
}

// Refund V2: paymentId + tutar (tek kalemli sepet için belge önerisi).
// Refund V2: ip isteğe bağlı ("isteğin gönderildiği IP"); bilinmiyorsa gönderilmez
export async function refundV2(paymentId: string, price: string, ip: string | null, conversationId: string): Promise<IyzicoResponse> {
  return await iyzicoRequest("/v2/payment/refund", { locale: "tr", conversationId, paymentId, price, currency: "TRY", ...(ip ? { ip } : {}) });
}

// Raporlama: ödeme detayı (iade/fraud durumu). GET; imza yalnız yol üzerinden (sorgu dizesi hariç).
export async function reportingPaymentDetails(paymentId: string): Promise<IyzicoResponse> {
  const path = `/v2/reporting/payment/details?paymentId=${encodeURIComponent(paymentId)}&locale=tr`;
  return await iyzicoRequest(path, null, "GET");
}

// ---------------------------------------------------------------- Webhook (HPP formatı)

export interface WebhookBody {
  paymentConversationId?: string;
  merchantId?: number | string;
  token?: string;
  status?: string;
  iyziReferenceCode?: string;
  iyziEventType?: string;
  iyziEventTime?: number;
  iyziPaymentId?: number | string;
  paymentId?: number | string;
}

export async function verifyWebhookSignatureV3(secretKey: string, b: WebhookBody, headerSig: string): Promise<boolean> {
  if (!headerSig) return false;
  const paymentId = str(b.iyziPaymentId ?? b.paymentId);
  // HPP formatı: secret + iyziEventType + iyziPaymentId + token + paymentConversationId + status
  const data = secretKey + str(b.iyziEventType) + paymentId + str(b.token) + str(b.paymentConversationId) + str(b.status);
  const expected = await hmacSha256Hex(secretKey, data);
  return timingSafeEqualStr(expected, headerSig.trim().toLowerCase());
}

export function siteUrl(): string {
  return (Deno.env.get("SITE_URL") ?? "https://book.onuronder.com").replace(/\/$/, "");
}

export function bookPrice(): string {
  const p = Deno.env.get("BOOK_PRICE_TRY") ?? "349.00";
  return Number(p).toFixed(2);
}
