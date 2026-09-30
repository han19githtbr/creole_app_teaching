import { Hourglass } from "lucide-react";
import type { AnswerStatus } from "@/models/PostAnswer";
import { cn } from "@/lib/utils";

/** Ícone de status: ampulheta (em análise), check verde ou X vermelho — com animação. */
export function AnswerStatusIcon({ status, size = 40, className }: { status: AnswerStatus; size?: number; className?: string }) {
  const dim = { width: size, height: size };
  if (status === "correct") {
    return (
      <span
        className={cn("answer-pop flex shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30", className)}
        style={dim}
        aria-label="Correta"
      >
        <svg viewBox="0 0 24 24" className="answer-draw" width={size * 0.6} height={size * 0.6} fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (status === "incorrect") {
    return (
      <span
        className={cn("answer-shake flex shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-md shadow-red-500/30", className)}
        style={dim}
        aria-label="Incorreta"
      >
        <svg viewBox="0 0 24 24" className="answer-draw" width={size * 0.55} height={size * 0.55} fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className={cn("answer-glow flex shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400", className)}
      style={dim}
      aria-label="Em análise"
    >
      <Hourglass className="answer-hourglass" style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  );
}

const BADGE: Record<AnswerStatus, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  correct: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  incorrect: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};
const LABEL: Record<AnswerStatus, string> = { pending: "Em análise", correct: "Correta", incorrect: "Incorreta" };

export function AnswerStatusBadge({ status }: { status: AnswerStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", BADGE[status])}>
      <span
        className={cn("h-1.5 w-1.5 rounded-full", status === "pending" ? "animate-pulse bg-amber-500" : status === "correct" ? "bg-emerald-500" : "bg-red-500")}
      />
      {LABEL[status]}
    </span>
  );
}
