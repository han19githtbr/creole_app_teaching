"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaleCover } from "@/components/TaleCover";
import type { Tale } from "@/lib/tales/tales";
import { Download, Eye, EyeOff, Loader2, Send } from "lucide-react";

export interface TaleRow {
  tale: Tale;
  published: boolean;
  publishedAt: string | null;
  durationLabel: string;
}

/** Gestão dos contos ilustrados: publicar para os alunos, esconder e abrir para baixar o vídeo. */
export function TalesAdmin({ rows }: { rows: TaleRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<Record<string, boolean>>(() => Object.fromEntries(rows.map((r) => [r.tale.slug, r.published])));

  async function toggle(slug: string) {
    setBusy(slug);
    setError(null);
    const next = !state[slug];
    try {
      const res = await fetch(`/api/admin/tales/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível alterar a publicação.");
      setState((s) => ({ ...s, [slug]: next }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar a publicação.");
    } finally {
      setBusy(null);
    }
  }

  const publishedCount = Object.values(state).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">
        {publishedCount} de {rows.length} contos publicados. Os alunos do painel em francês só veem os publicados; os rascunhos aparecem só para os administradores.
      </p>
      {error && <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ tale, publishedAt, durationLabel }) => {
          const published = state[tale.slug];
          return (
            <li key={tale.slug} className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
              <div className="w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-2)]" style={{ aspectRatio: "9 / 16" }}>
                <TaleCover tale={tale} className="h-full w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      published ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                    }`}
                  >
                    {published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {published ? "Publicado" : "Rascunho"}
                  </span>
                  <h2 className="mt-1.5 text-sm font-bold leading-snug text-[var(--text)]">{tale.title}</h2>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Nível {tale.level} · {tale.scenes.length} cenas · ≈ {durationLabel}
                    {published && publishedAt ? ` · publicado em ${new Date(publishedAt).toLocaleDateString("pt-BR")}` : ""}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant={published ? "outline" : "primary"} className="cursor-pointer text-xs" disabled={busy === tale.slug} onClick={() => toggle(tale.slug)}>
                    {busy === tale.slug ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1.5 h-3.5 w-3.5" />}
                    {published ? "Despublicar" : "Publicar para os alunos"}
                  </Button>
                  <Link
                    href={`/dashboard/contos/${tale.slug}`}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                  >
                    <Download className="h-3.5 w-3.5" /> Abrir e baixar vídeo
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
