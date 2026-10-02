// Veri azaltma: sağlayıcı yanıtından YALNIZ izinli alanlar saklanır. İmza, tam yanıt üzerinde (iyzico.ts) önce
// doğrulanır; burada saklanacak kesit çıkarılır. Saklanmayanlar: kart BIN'i, son 4 hane, kart ailesi/tipi/kurumu,
// token, signature, errorMessage (serbest metin), alıcı/adres alanları. Şema sürümü RAW_SCHEMA ile izlenir.

export const RAW_SCHEMA = 1;
const MAX_ITEMS = 5;

function s(v: unknown, max = 64): string | null {
  if (v == null) return null;
  const t = String(v);
  return t.length > max ? t.slice(0, max) : t;
}
function money(v: unknown): string | null {
  if (v == null) return null;
  const t = String(v).trim();
  return /^\d{1,8}(\.\d{1,8})?$/.test(t) ? t : null;
}
function int(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

export interface ItemTx {
  itemId: string | null;
  paymentTransactionId: string | null;
  transactionStatus: number | null;
  price: string | null;
  paidPrice: string | null;
}

export function projectItems(raw: Record<string, unknown>): ItemTx[] {
  const items = Array.isArray(raw.itemTransactions) ? raw.itemTransactions : [];
  return items.slice(0, MAX_ITEMS).map((x) => {
    const i = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
    return {
      itemId: s(i.itemId),
      paymentTransactionId: s(i.paymentTransactionId),
      transactionStatus: int(i.transactionStatus),
      price: money(i.price),
      paidPrice: money(i.paidPrice),
    };
  });
}

export interface PaymentProjection {
  payment_id: string | null;
  payment_transaction_id: string | null;
  payment_status: string | null;
  fraud_status: number | null;
  price: string | null;
  paid_price: string | null;
  currency: string | null;
  conversation_id: string | null;
  basket_id: string | null;
  item_transactions: ItemTx[];
  raw_schema: number;
}

export function projectPayment(raw: Record<string, unknown>): PaymentProjection {
  const items = projectItems(raw);
  return {
    payment_id: s(raw.paymentId),
    payment_transaction_id: items[0]?.paymentTransactionId ?? null,
    payment_status: s(raw.paymentStatus, 32),
    fraud_status: int(raw.fraudStatus),
    price: money(raw.price),
    paid_price: money(raw.paidPrice),
    currency: s(raw.currency, 8),
    conversation_id: s(raw.conversationId),
    basket_id: s(raw.basketId),
    item_transactions: items,
    raw_schema: RAW_SCHEMA,
  };
}

// Log ve istemci için: hata metni yerine yalnız kod
export function errorCodeOf(raw: Record<string, unknown>): string | null {
  return s(raw.errorCode, 40);
}
