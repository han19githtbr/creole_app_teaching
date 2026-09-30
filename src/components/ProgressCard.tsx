import { Trophy } from "lucide-react";
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
    <Card>
      <CardContent className="flex flex-wrap items-center gap-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl dark:bg-amber-900/30">
          {milestone?.emoji ?? <Trophy className="h-6 w-6 text-amber-500" />}
        </span>
        <div className="min-w-[14rem] flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-semibold text-[var(--text)]">
              {milestone ? milestone.title : "Comece sua jornada"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {completed} de {total} lições · {pct}%
            </p>
          </div>
          <div
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso nas lições"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
            {completed === 0
              ? "Conclua sua primeira lição para desbloquear sua primeira conquista."
              : next
              ? `Próxima conquista: ${next} lições concluídas.`
              : "Você concluiu tudo — felisitasyon!"}
          </p>
        </div>
        <ShareAchievementButton completed={completed} total={total} name={name} lessonTitle={lastLessonTitle} />
      </CardContent>
    </Card>
  );
}
