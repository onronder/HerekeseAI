// Yetki: kullanıcı kimliği SUNUCUDA doğrulanır (auth.getUser), yönetici rolü service rolüyle güncel olarak okunur.
// RPC'lere yalnız bu doğrulanmış kimlik p_actor olarak geçer; istemci gövdesindeki actor/by alanları yok sayılır.
// RPC'ler de admin gerektiren işlemde aktörü user_roles'ten yeniden doğrular (derinlemesine savunma).
import { createClient, type SupabaseClient, type User } from "https://esm.sh/@supabase/supabase-js@2";
import { HttpError } from "./http.ts";

export function serviceClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getVerifiedUser(req: Request): Promise<User> {
  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) throw new HttpError(401, "unauthorized");
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new HttpError(401, "unauthorized");
  return data.user;
}

export async function isAdmin(admin: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await admin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new HttpError(503, "authz_unavailable", true);
  return !!data;
}

export async function requireAdmin(admin: SupabaseClient, userId: string): Promise<void> {
  if (!(await isAdmin(admin, userId))) throw new HttpError(403, "forbidden");
}
