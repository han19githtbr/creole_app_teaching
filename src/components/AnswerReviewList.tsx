"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Inbox, RotateCcw, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnswerStatusBadge } from "@/components/AnswerStatusIcon";
import type { AnswerDTO } from "@/lib/postAnswers";
import type { AnswerStatus } from "@/models/PostAnswer";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface ReviewItem extends AnswerDTO {
  postId: string;
  postTitle: string;
  postImage: string;
  userName: string;
  userImage: string;
}

type Tab = "pending" | "correct" | "incorrect" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Em análise" },
  { id: "correct", label: "Corretas" },
  { id: "incorrect", label: "Incorretas" },
  { id: "all", label: "Todas" },
];

function ReviewCard({ item, onSaved }: { item: ReviewItem; onSaved: (a: AnswerDTO) => void }) {
  const [feedback, setFeedback] = useState(item.feedback);
  const [busy, setBusy] = useState<AnswerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<"correct" | "incorrect" | null>(null);

  async function review(status: AnswerStatus) {
    setBusy(status);
    setError(null);
    try {
      const res = await fetch(`/api/answers/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, feedback }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Não foi possível salvar.");
      if (status !== "pending") {
        setFlash(status);
        setTimeout(() => setFlash(null), 900);
      }
      onSaved(data.answer as AnswerDTO);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setBusy(null);
    }
  }

  const border =
    item.status === "correct"
      ? "border-l-emerald-500"
      : item.status === "incorrect"
      ? "border-l-red-500"
      : "border-l-amber-400";

  return (
    <article
      className={cn(
        "answer-slide overflow-hidden rounded-xl border border-l-4 border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md",
        border,
        flash === "correct" && "ring-2 ring-emerald-400",
        flash === "incorrect" && "answer-shake ring-2 ring-red-400"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-soft)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {item.userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.userImage} alt="" referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">
              {item.userName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">{item.userName}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: ptBR })}
              {item.attempts > 1 && ` · tentativa ${item.attempts}`}
            </p>
          </div>
        </div>
        <AnswerStatusBadge status={item.status} />
      </div>

      <div className="space-y-3 p-4">
        <Link
          href={`/admin/posts/${item.postId}/edit`}
          className="flex items-center gap-3 rounded-lg bg-[var(--surface-2)] p-2 pr-3 transition-colors hover:bg-[var(--border-soft)]"
        >
          {item.postImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.postImage} alt="" className="h-12 w-[4.5rem] shrink-0 rounded-md object-cover" />
          )}
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Postagem</span>
            <span className="block truncate text-sm font-medium text-[var(--text)]">{item.postTitle}</span>
          </span>
        </Link>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Resposta do aluno</p>
          <p className="whitespace-pre-line break-words text-sm text-[var(--text)]">{item.text}</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
            Texto para o aluno <span className="font-normal text-[var(--text-muted)]">(resposta correta, explicação ou elogio — opcional)</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.slice(0, 1000))}
            rows={2}
            placeholder="Ex.: A resposta certa é “Bonjou” — usamos de manhã e à tarde."
            className="w-full resize-y rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => review("correct")}
            disabled={busy !== null}
            className={cn("bg-emerald-600 hover:bg-emerald-700", item.status === "correct" && "ring-2 ring-emerald-300")}
          >
            <CheckCircle2 className="h-4 w-4" /> {busy === "correct" ? "Salvando…" : item.status === "correct" ? "Salvar (correta)" : "Correta"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={() => review("incorrect")}
            disabled={busy !== null}
            className={cn(item.status === "incorrect" && "ring-2 ring-red-300")}
          >
            <XCircle className="h-4 w-4" /> {busy === "incorrect" ? "Salvando…" : item.status === "incorrect" ? "Salvar (incorreta)" : "Incorreta"}
          </Button>
          {item.status !== "pending" && (
            <Button type="button" size="sm" variant="ghost" onClick={() => review("pending")} disabled={busy !== null}>
              <RotateCcw className="h-3.5 w-3.5" /> Voltar para análise
            </Button>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#dc2626]" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

export function AnswerReviewList({
  initialItems,
  filterPostTitle,
}: {
  initialItems: ReviewItem[];
  filterPostTitle?: string | null;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<Tab>("pending");

  const counts = useMemo(
    () => ({
      pending: items.filter((i) => i.status === "pending").length,
      correct: items.filter((i) => i.status === "correct").length,
      incorrect: items.filter((i) => i.status === "incorrect").length,
      all: items.length,
    }),
    [items]
  );

  const visible = items.filter((i) => tab === "all" || i.status === tab);

  function handleSaved(id: string, a: AnswerDTO) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...a } : i)));
    router.refresh(); // atualiza o contador da barra lateral
  }

  return (
    <div className="space-y-5">
      {filterPostTitle && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--accent-soft)] px-4 py-2.5 text-sm">
          <span className="text-[var(--text)]">
            Mostrando respostas de: <strong>{filterPostTitle}</strong>
          </span>
          <Link href="/admin/answers" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline">
            <X className="h-3.5 w-3.5" /> Ver todas
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              tab === t.id
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            )}
          >
            {t.label}
            <span
              className={cn(
                "min-w-[1.4rem] rounded-full px-1.5 text-center text-xs font-bold",
                tab === t.id ? "bg-white/25" : "bg-[var(--surface)]",
                t.id === "pending" && counts.pending > 0 && tab !== t.id && "bg-amber-400 text-amber-950"
              )}
            >
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--border-strong)] py-14 text-center">
          <Inbox className="h-9 w-9 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text)]">
            {tab === "pending" ? "Nenhuma resposta esperando correção 🎉" : "Nada por aqui ainda."}
          </p>
          <p className="text-xs text-[var(--text-muted)]">As respostas dos alunos às suas postagens aparecem aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((item) => (
            <ReviewCard key={item.id} item={item} onSaved={(a) => handleSaved(item.id, a)} />
          ))}
        </div>
      )}
    </div>
  );
}
