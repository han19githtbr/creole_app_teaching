"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GraduationCap, MessageCircle, Pencil, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnswerStatusBadge, AnswerStatusIcon } from "@/components/AnswerStatusIcon";
import { ANSWER_MAX_LENGTH, type AnswerDTO } from "@/lib/postAnswers";
import { cn } from "@/lib/utils";

const CONFETTI_COLORS = ["#10b981", "#fbbf24", "#3b82f6", "#ec4899", "#f97316", "#8b5cf6"];

function Confetti() {
  return (
    <div className="answer-confetti pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 60 + (i % 5) * 18;
        return (
          <i
            key={i}
            style={
              {
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                "--dx": `${Math.cos(angle) * dist}px`,
                "--dy": `${Math.sin(angle) * dist - 20}px`,
                "--rot": `${(i * 47) % 360}deg`,
                animationDelay: `${(i % 6) * 30}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/**
 * Caixa de resposta do aluno sob uma postagem:
 * responder → "Em análise" → ✓ correta / ✗ incorreta + texto do professor.
 */
export function PostAnswerBox({ postId, initialAnswer }: { postId: string; initialAnswer: AnswerDTO | null }) {
  const [answer, setAnswer] = useState<AnswerDTO | null>(initialAnswer);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [justReviewed, setJustReviewed] = useState(false);
  const statusRef = useRef(initialAnswer?.status);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/answers`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { answer: AnswerDTO | null };
      if (!data.answer) return;
      if (statusRef.current === "pending" && data.answer.status !== "pending") {
        setJustReviewed(true);
        setCelebrate(data.answer.status === "correct");
        setTimeout(() => setCelebrate(false), 1400);
      }
      statusRef.current = data.answer.status;
      setAnswer(data.answer);
    } catch {
      /* sem rede: tenta de novo no próximo ciclo */
    }
  }, [postId]);

  // Enquanto "em análise", confere o resultado sozinho (a cada 15 s e ao voltar para a aba).
  useEffect(() => {
    if (answer?.status !== "pending") return;
    const tick = () => document.visibilityState === "visible" && refresh();
    const id = setInterval(tick, 15000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [answer?.status, refresh]);

  async function submit() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: draft }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Não foi possível enviar sua resposta.");
      statusRef.current = "pending";
      setAnswer(data.answer as AnswerDTO);
      setEditing(false);
      setJustReviewed(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar.");
    } finally {
      setSending(false);
    }
  }

  function startEdit(clear: boolean) {
    setDraft(clear ? "" : answer?.text ?? "");
    setError(null);
    setEditing(true);
  }

  const showForm = editing || !answer;

  /* ---------- formulário ---------- */
  if (showForm) {
    if (!editing) {
      return (
        <button
          type="button"
          onClick={() => startEdit(true)}
          className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)]/50 px-4 py-3 text-left transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition-transform group-hover:scale-110">
            <MessageCircle className="h-4 w-4" strokeWidth={4} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-[var(--text)]">Responder ao professor</span>
            <span className="block text-xs text-[var(--text-muted)]">Escreva sua resposta — ela será corrigida em breve.</span>
          </span>
        </button>
      );
    }
    return (
      <div className="answer-slide space-y-2.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <MessageCircle className="h-4 w-4 text-[var(--accent)]" />
          {answer?.status === "incorrect" ? "Tente novamente" : "Sua resposta"}
        </label>
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, ANSWER_MAX_LENGTH))}
          rows={3}
          placeholder="Escreva aqui sua resposta (em Kreyòl ou português)…"
          className="w-full resize-y rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[var(--text-muted)]">
            {draft.length}/{ANSWER_MAX_LENGTH}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={sending}>
              Cancelar
            </Button>
            <Button type="button" size="sm" onClick={submit} disabled={sending || !draft.trim()}>
              <Send className="h-3.5 w-3.5" /> {sending ? "Enviando…" : "Enviar resposta"}
            </Button>
          </div>
        </div>
        {error && (
          <p className="text-xs text-[#dc2626]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  /* ---------- resposta enviada ---------- */
  const { status } = answer;
  const tone =
    status === "correct"
      ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
      : status === "incorrect"
      ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
      : "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20";
  const title =
    status === "correct" ? "Resposta correta! Bon travay! 🎉" : status === "incorrect" ? "Resposta incorreta" : "Resposta enviada";

  return (
    <div className={cn("relative rounded-xl border p-4", tone, justReviewed && "answer-pop")} aria-live="polite">
      {celebrate && <Confetti />}
      <div className="flex items-start gap-3">
        <AnswerStatusIcon status={status} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-[var(--text)]">{title}</p>
            <AnswerStatusBadge status={status} />
          </div>
          {status === "pending" && (
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              O professor vai analisar. Esta tela atualiza sozinha quando houver resultado.
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-[var(--surface)]/80 px-3.5 py-2.5 text-sm text-[var(--text)] shadow-sm">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Sua resposta</p>
        <p className="whitespace-pre-line break-words">{answer.text}</p>
      </div>

      {status !== "pending" && answer.feedback && (
        <div
          className={cn(
            "answer-slide mt-3 rounded-lg border-l-4 bg-[var(--surface)] px-3.5 py-2.5 text-sm shadow-sm",
            status === "correct" ? "border-emerald-500" : "border-red-500"
          )}
        >
          <p className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <GraduationCap className="h-3.5 w-3.5" /> {status === "correct" ? "Comentário do professor" : "Resposta correta / dica do professor"}
          </p>
          <p className="whitespace-pre-line break-words text-[var(--text)]">{answer.feedback}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {status === "pending" && (
          <Button type="button" variant="outline" size="sm" onClick={() => startEdit(false)}>
            <Pencil className="h-3.5 w-3.5" /> Editar resposta
          </Button>
        )}
        {status === "incorrect" && (
          <Button type="button" size="sm" onClick={() => startEdit(true)}>
            <RotateCcw className="h-3.5 w-3.5" /> Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}
