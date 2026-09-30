"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareAchievementButton } from "@/components/ShareAchievement";
import { currentMilestone } from "@/lib/achievements";

/** Botão "Marcar como concluída" no rodapé da lição + convite para compartilhar. */
export function LessonCompleteButton({
  lessonId,
  lessonTitle,
  initialCompleted,
  initialCount,
  total,
  userName,
}: {
  lessonId: string;
  lessonTitle: string;
  initialCompleted: boolean;
  initialCount: number;
  total: number;
  userName: string;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [count, setCount] = useState(initialCount);
  const [totalLessons, setTotalLessons] = useState(total);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setBusy(true);
    setError(null);
    const next = !completed;
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Não foi possível salvar seu progresso.");
      }
      const data = (await res.json()) as { completed: number; total: number };
      setCompleted(next);
      setCount(data.completed);
      setTotalLessons(data.total);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setBusy(false);
    }
  }

  const milestone = currentMilestone(count, totalLessons);

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--text)]">
            {completed ? "Lição concluída! 🎉" : "Terminou de estudar esta lição?"}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Seu progresso: {count} de {totalLessons} lições
          </p>
        </div>
        <Button
          type="button"
          variant={completed ? "outline" : "primary"}
          onClick={toggle}
          disabled={busy}
          aria-pressed={completed}
        >
          {completed ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Concluída
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" /> Marcar como concluída
            </>
          )}
        </Button>
      </div>

      {completed && milestone && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--accent-soft)] p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
            <PartyPopper className="h-5 w-5 text-amber-500" />
            {milestone.kreyol} {milestone.emoji} {milestone.title}
          </p>
          <ShareAchievementButton completed={count} total={totalLessons} name={userName} lessonTitle={lessonTitle} />
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-[#dc2626]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
