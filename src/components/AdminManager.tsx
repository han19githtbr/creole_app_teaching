"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, ShieldCheck, Trash2, UserPlus } from "lucide-react";

export interface AdminListItem {
  email: string;
  name: string | null;
  image: string | null;
  addedByEmail?: string;
  createdAt?: string;
}

interface AdminManagerProps {
  primary: AdminListItem | null;
  admins: AdminListItem[];
  max: number;
  /** Só o administrador principal vê os controles de adicionar/remover. */
  canManage: boolean;
}

function Avatar({ item }: { item: AdminListItem }) {
  const initial = (item.name || item.email).charAt(0).toUpperCase();
  return item.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-sm font-bold text-[var(--text-secondary)]">
      {initial}
    </span>
  );
}

export function AdminManager({ primary, admins, max, canManage }: AdminManagerProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível adicionar o administrador.");
      setNotice(`${data.email} agora é administrador.`);
      setEmail("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar administrador.");
    } finally {
      setBusy(false);
    }
  }

  async function removeAdmin(target: string) {
    if (!window.confirm(`Remover o acesso de administrador de ${target}?`)) return;
    setRemoving(target);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/admins?email=${encodeURIComponent(target)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível remover o administrador.");
      setNotice(`${target} não é mais administrador.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover administrador.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="space-y-6">
      {canManage ? (
        <form
          onSubmit={addAdmin}
          className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
            <UserPlus className="h-4 w-4 text-[var(--accent)]" /> Adicionar administrador
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com (conta Google da pessoa)"
              autoComplete="off"
              required
            />
            <Button type="submit" disabled={busy || admins.length >= max} className="cursor-pointer">
              {busy ? "Adicionando…" : "Adicionar"}
            </Button>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Administradores adicionais podem criar e publicar conteúdo, mas não podem adicionar ou
            remover outros administradores. {admins.length}/{max} adicionados.
          </p>
          {error && (
            <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              {notice}
            </p>
          )}
        </form>
      ) : (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text-secondary)]">
          Somente o administrador principal pode adicionar ou remover administradores.
        </p>
      )}

      <ul className="space-y-2">
        {primary && (
          <li className="flex items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/60 p-3 dark:border-amber-800/60 dark:bg-amber-950/20">
            <Avatar item={primary} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text)]">
                {primary.name || primary.email}
              </p>
              <p className="truncate text-xs text-[var(--text-secondary)]">{primary.email}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-amber-950">
              <Crown className="h-3 w-3" /> Principal
            </span>
          </li>
        )}
        {admins.map((a) => (
          <li
            key={a.email}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <Avatar item={a} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text)]">{a.name || a.email}</p>
              <p className="truncate text-xs text-[var(--text-secondary)]">{a.email}</p>
              {a.createdAt && (
                <p className="text-[11px] text-[var(--text-muted)]">
                  Adicionado em {new Date(a.createdAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-bold text-white">
              <ShieldCheck className="h-3 w-3" /> Administrador
            </span>
            {canManage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={removing === a.email}
                onClick={() => removeAdmin(a.email)}
                className="cursor-pointer"
                aria-label={`Remover ${a.email}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </li>
        ))}
        {admins.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--text-secondary)]">
            Nenhum administrador adicional ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
