// Ödeme sonucunun tek uygulama yolu. Karar SQL'de (book_apply_payment_result): sipariş satırı kilitlenir,
// tutar/döviz/sepet eşleşmesi doğrulanır, durum asla geriye gitmez; paid geçişinde erişim kaynağı, erişim sürümü ve
// makbuz işi AYNI transaction'da oluşur. Callback, webhook, IFN, order-status ve ops-worker hepsi buraya iner.
// Bu modül: imzası doğrulanmış sağlayıcı sonucunu (provider-map.ts) RPC'ye iletir, sonra makbuzu hemen göndermeyi dener.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { PaymentFact } from "./provider-map.ts";
import { deliverNow } from "./outbox.ts";

export const PRODUCT_CODE = "herkes-icin-yz";

export type FulfilSource = "callback" | "webhook" | "reconcile" | "ifn" | "status";

export interface OrderRow {
  id: string;
  user_id: string | null;
  product_code: string;
  lang: "tr" | "en";
  conversation_id: string;
  basket_id: string;
  price: string | number;
  currency: string;
  status: string;
  iyzico_token: string | null;
  iyzico_payment_id: string | null;
  token_expires_at: string | null;
  provider_env: string | null;
  created_at: string;
}

const ORDER_COLS =
  "id,user_id,product_code,lang,conversation_id,basket_id,price,currency,status,iyzico_token,iyzico_payment_id,token_expires_at,provider_env,created_at";

async function loadBy(admin: SupabaseClient, col: string, v: string): Promise<OrderRow | null> {
  if (!v) return null;
  const { data, error } = await admin.from("book_orders").select(ORDER_COLS).eq(col, v).maybeSingle();
  if (error) throw new Error("db_unavailable");
  return (data as OrderRow | null) ?? null;
}
export const loadOrderByToken = (a: SupabaseClient, t: string) => loadBy(a, "iyzico_token", t);
export const loadOrderByConversationId = (a: SupabaseClient, c: string) => loadBy(a, "conversation_id", c);
export const loadOrderById = (a: SupabaseClient, id: string) => loadBy(a, "id", id);
export const loadOrderByPaymentId = (a: SupabaseClient, p: string) => loadBy(a, "iyzico_payment_id", p);

export const OPEN_STATES = ["created", "initialized", "unknown", "review", "mismatch"];

export interface ApplyOutcome {
  outcome: string; // paid | already_paid | review | failed | mismatch | refunded | expired_confirmed | unchanged | conflict | not_found
  outbox_id?: string | null;
  orphan?: boolean;
  status?: string;
}

// fact null = imza doğrulanamadı ya da API hatası: karar üretilmez, durum değişmez.
export async function applyFact(admin: SupabaseClient, orderId: string, source: FulfilSource, fact: PaymentFact | null): Promise<ApplyOutcome> {
  if (!fact) return { outcome: "unchanged" };
  const { data, error } = await admin.rpc("book_apply_payment_result", { p_order: orderId, p_source: source, p_fact: fact });
  if (error) throw new Error("db_unavailable");
  const r = data as ApplyOutcome;
  if (r.outbox_id) await deliverNow(admin, r.outbox_id); // erişim zaten açık; e-posta en iyi çabayla, kuyruk yedekte
  return r;
}
