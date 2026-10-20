import { connectDB } from "@/lib/mongodb";
import CoAdmin from "@/models/CoAdmin";
import User from "@/models/User";

/**
 * Níveis de acesso administrativo:
 *  - principal: a conta de ADMIN_EMAIL. Única que adiciona/remove administradores.
 *  - admin: e-mails autorizados pelo principal. Criam, publicam, editam, etc.
 *  - null: usuário comum.
 */
export type AdminLevel = "primary" | "admin" | null;

export const MAX_CO_ADMINS = 20;

export function normalizeEmail(raw: unknown): string {
  return typeof raw === "string" ? raw.toLowerCase().trim() : "";
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getPrimaryAdminEmail(): string {
  return normalizeEmail(process.env.ADMIN_EMAIL);
}

export function isPrimaryAdminEmail(email: unknown): boolean {
  const primary = getPrimaryAdminEmail();
  return Boolean(primary) && normalizeEmail(email) === primary;
}

// Cache curto: o acesso é conferido a cada requisição, e a lista de admins
// quase nunca muda. Mudanças feitas neste servidor invalidam na hora; em
// outras instâncias valem em até CACHE_TTL_MS.
const CACHE_TTL_MS = 15_000;
const coAdminCache = new Map<string, { value: boolean; at: number }>();

export function invalidateAdminCache() {
  coAdminCache.clear();
}

export async function isCoAdminEmail(email: unknown): Promise<boolean> {
  const clean = normalizeEmail(email);
  if (!clean) return false;

  const hit = coAdminCache.get(clean);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

  try {
    await connectDB();
    const found = await CoAdmin.exists({ email: clean });
    const value = Boolean(found);
    coAdminCache.set(clean, { value, at: Date.now() });
    return value;
  } catch (err) {
    console.warn("[adminAccess] Falha ao consultar administradores:", err);
    // Em falha do banco, mantém o último valor conhecido; sem histórico, nega.
    return hit?.value ?? false;
  }
}

export async function getAdminLevel(email: unknown): Promise<AdminLevel> {
  if (isPrimaryAdminEmail(email)) return "primary";
  if (await isCoAdminEmail(email)) return "admin";
  return null;
}

/** Mantém o campo `role` do usuário no banco alinhado com a lista de admins. */
export async function syncUserRole(email: string, isAdmin: boolean) {
  try {
    await connectDB();
    await User.updateOne({ email }, { $set: { role: isAdmin ? "admin" : "user" } });
  } catch (err) {
    console.warn("[adminAccess] Falha ao sincronizar o papel do usuário:", err);
  }
}
