import { Trophy, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShareAchievementButton } from "@/components/ShareAchievement";
import { currentMilestone, nextMilestoneAt } from "@/lib/achievements";

/** Cartão de progresso do aluno no painel, com botão de compartilhar conquista. */
export function ProgressCard({
  completed,
  total,
  name,
  lastLessonTitle,
}: {
  completed: number;
  total: number;
  name: string;
  /** Título da última lição concluída — usado no cartão de conquista. */
  lastLessonTitle?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const milestone = currentMilestone(completed, total);
  const next = nextMilestoneAt(completed, total);

  return (
    <Card className="border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-2)] shadow-sm">
      <CardContent className="flex flex-wrap items-center gap-5 p-5 sm:p-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400/20 to-orange-500/20 border border-amber-500/30 text-3xl shadow-sm">
          {milestone?.emoji ?? <Trophy className="h-7 w-7 text-amber-500" />}
        </span>
        <div className="min-w-[14rem] flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-bold text-base sm:text-lg text-[var(--text)]">
              {milestone ? milestone.title : "Comece sua jornada de aprendizado"}
            </p>
            <p className="text-xs font-semibold text-[var(--text-muted)]">
              {completed} de {total} lições concluídas ({pct}%)
            </p>
          </div>
          <div className="relative mt-2.5">
            <div
              className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)] p-0.5 border border-[var(--border)]"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso nas lições"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-[var(--accent)] transition-all duration-500 shadow-sm"
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* Marcadores visuais de etapas (25%, 50%, 75%, 100%) */}
            <div className="pointer-events-none absolute inset-0 flex justify-between px-1 items-center">
              {[25, 50, 75, 100].map((step) => {
                const reached = pct >= step;
                return (
                  <span
                    key={step}
                    title={`Marco de ${step}%`}
                    className={`h-2 w-2 rounded-full border transition-all ${
                      reached
                        ? "border-white bg-amber-300 shadow-sm ring-1 ring-amber-500/50"
                        : "border-[var(--border)] bg-[var(--surface-2)]/80"
                    }`}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
            <span>
              {completed === 0
                ? "Conclua sua primeira lição para desbloquear sua primeira conquista oficial."
                : next
                ? `Próxima conquista: ${next} lições concluídas.`
                : "Parabéns! Todas as lições deste módulo foram concluídas com sucesso!"}
            </span>
            {completed > 0 && (
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {total - completed > 0 ? `Restam ${total - completed} lições` : "Módulo concluído"}
              </span>
            )}
          </div>
        </div>
        <ShareAchievementButton completed={completed} total={total} name={name} lessonTitle={lastLessonTitle} />
      </CardContent>
    </Card>
  );
}
