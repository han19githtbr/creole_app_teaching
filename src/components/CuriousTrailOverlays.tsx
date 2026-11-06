"use client";

// Peças de interface que ficam SOBRE o mapa da Trilha Curiosa (o jogo inteiro acontece no mapa).
import React from "react";
import { Check, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrailRoundState } from "./CuriousTrailMountain";

const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];

/** Cronômetro + pontos, no canto superior direito do mapa. */
export function TrailPlayHud({
  timeLeft,
  totalMs,
  score,
  streak,
  index,
  total,
  avalanche,
}: {
  timeLeft: number;
  totalMs: number;
  score: number;
  streak: number;
  index: number;
  total: number;
  /** Modo avalanche: no lugar do cronômetro aparece o medidor de perigo. */
  avalanche?: { danger: number; alert: "calm" | "warn" | "danger"; meters: number };
}) {
  const secs = Math.ceil(timeLeft / 1000);
  const urgent = timeLeft <= Math.min(3000, totalMs * 0.4);
  const warn = timeLeft <= totalMs * 0.5;
  return (
    <div className="pointer-events-none flex shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-slate-900/80 px-2.5 py-1.5 text-white shadow-lg backdrop-blur-md">
      <div className="text-right leading-tight">
        <span className="block text-[11px] font-black text-amber-300">✨ {score} pts</span>
        <span className={cn("block text-[10px] font-bold", streak > 1 ? "text-orange-300" : "text-slate-400")}>
          🔥 {streak} · {Math.min(index + 1, total)}/{total}
        </span>
      </div>
      {avalanche ? (
        <div
          className={cn(
            "flex h-11 min-w-[3.25rem] flex-col items-center justify-center rounded-2xl px-1.5 text-white shadow-md transition-colors",
            avalanche.alert === "danger" ? "trail-timer--urgent bg-red-600" : avalanche.alert === "warn" ? "bg-amber-500" : "bg-sky-600"
          )}
          role="status"
          aria-label={`Avalanche a ${avalanche.meters} metros`}
        >
          <span className="text-base leading-none">🏔️</span>
          <span className="text-[10px] font-black leading-tight">{avalanche.meters}m</span>
        </div>
      ) : (
      <div
        className={cn(
          "trail-timer flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white shadow-md transition-colors",
          urgent ? "trail-timer--urgent bg-red-600" : warn ? "bg-amber-500" : "bg-blue-600"
        )}
        role="timer"
        aria-label={`${secs} segundos restantes`}
      >
        {secs}s
      </div>
      )}
    </div>
  );
}

/** Alternativas em francês, coladas na base do mapa. */
export function TrailAnswerDock({
  options,
  correct,
  roundState,
  wrongPicks,
  timeLeft,
  totalMs,
  bonusText,
  onPick,
  avalancheDanger,
  timed = true,
}: {
  options: string[];
  correct: string;
  roundState: TrailRoundState;
  wrongPicks: string[];
  timeLeft: number;
  totalMs: number;
  bonusText: string | null;
  onPick: (opt: string) => void;
  /** Modo avalanche (0..1): a barra mostra a distância da avalanche em vez do tempo. */
  avalancheDanger?: number;
  timed?: boolean;
}) {
  const canAnswer = roundState === "asking" || roundState === "retry";
  const isAv = avalancheDanger != null;
  const pct = isAv ? Math.max(4, Math.min(100, avalancheDanger * 100)) : Math.max(0, Math.min(100, (timeLeft / totalMs) * 100));
  const barColor = isAv
    ? avalancheDanger > 0.7 ? "bg-red-500" : avalancheDanger > 0.4 ? "bg-amber-400" : "bg-sky-400"
    : timeLeft <= Math.min(3000, totalMs * 0.4) ? "bg-red-500" : timeLeft <= totalMs * 0.5 ? "bg-amber-400" : "bg-sky-400";
  return (
    <div className="trail-answer-dock pointer-events-auto mx-auto w-full max-w-[560px] px-2 sm:px-0">
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-slate-950/78 shadow-2xl backdrop-blur-md">
        <div className="h-1 w-full bg-white/10" aria-hidden>
          <div
            className={cn("h-full transition-[width] duration-200 ease-linear", barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="px-2.5 pb-2.5 pt-1.5 sm:px-3">
          <p className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-bold text-slate-200">
            <span className="truncate">
              {roundState === "retry" ? (
                <span className="text-amber-300">Quase! Você tem mais uma chance 👀</span>
              ) : (
                <>Que objeto a <span className="text-red-400">seta vermelha</span> aponta?</>
              )}
            </span>
            {bonusText && <span className="trail-score-pop shrink-0 font-black text-amber-300">{bonusText}</span>}
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {options.map((opt, idx) => {
              const isWrong = wrongPicks.includes(opt);
              const isRight = (roundState === "correct" || roundState === "reveal") && opt === correct;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onPick(opt)}
                  disabled={!canAnswer || isWrong}
                  className={cn(
                    "trail-answer relative flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-2 py-1.5 text-left transition-all",
                    isWrong
                      ? "cursor-not-allowed border-red-400/50 bg-red-500/15 text-red-200 line-through opacity-60"
                      : isRight
                      ? "border-emerald-400 bg-emerald-500/25 text-emerald-100 ring-2 ring-emerald-400/70"
                      : canAnswer
                      ? "cursor-pointer border-white/15 bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]"
                      : "border-white/10 bg-white/5 text-slate-400"
                  )}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white shadow"
                    style={{ backgroundColor: OPTION_COLORS[idx % OPTION_COLORS.length] }}
                  >
                    {OPTION_LETTERS[idx] ?? "A"}
                  </span>
                  <span className="line-clamp-2 flex-1 text-[12px] font-extrabold leading-tight sm:text-sm">{opt}</span>
                  {isRight && <Check className="h-4 w-4 shrink-0 stroke-[3] text-emerald-300" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Contagem 3-2-1 no meio do mapa. */
export function TrailCountdownOverlay({
  num,
  badge,
  levelLabel,
  description,
  count,
}: {
  num: number;
  badge: string;
  levelLabel: string;
  description: string;
  count: number;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className="pointer-events-auto max-w-sm rounded-3xl border border-white/20 bg-slate-950/80 p-5 text-center text-white shadow-2xl">
        <span className="block animate-bounce text-3xl">{badge}</span>
        <p className="mt-1 text-[11px] font-black uppercase tracking-wider text-amber-400">{levelLabel}</p>
        <p className="mt-1 text-sm font-bold leading-snug text-slate-100">{description}</p>
        <div className="mx-auto mt-3 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-5xl font-black shadow-2xl">
          {num}
        </div>
        <p className="mt-3 text-[11px] font-semibold text-slate-300">
          Reconheça {count} {count === 1 ? "objeto" : "objetos"} pelo caminho!
        </p>
      </div>
    </div>
  );
}

/** Nível concluído: aparece sobre o mapa, o aluno já está na próxima estação. */
export function TrailLevelCompleteOverlay({
  level,
  name,
  xp,
  score,
  nextCount,
  onNext,
  onMap,
}: {
  level: number;
  name: string;
  xp: number;
  score: number;
  nextCount?: number;
  onNext: () => void;
  onMap: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className="pointer-events-auto w-full max-w-sm rounded-3xl border-2 border-emerald-400/60 bg-slate-950/85 p-5 text-center text-white shadow-2xl animate-in zoom-in-95">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/25 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-300">
          Nível {level} conquistado!
        </span>
        <h2 className="mt-2 text-xl font-black">{name} superada! 🌲✨</h2>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-300">
          Você reconheceu todos os objetos. O caminho para o <strong className="text-white">Nível {level + 1}</strong> está aberto.
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5">
            <span className="block text-[10px] font-bold uppercase text-slate-400">XP</span>
            <span className="text-base font-black text-sky-300">+{xp}</span>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Pontos</span>
            <span className="text-base font-black text-amber-300">+{score}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Subir ao Nível {level + 1}
            {nextCount ? ` (${nextCount})` : ""}
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMap}
            className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-slate-100 hover:bg-white/20"
          >
            Ver o mapa
          </button>
        </div>
      </div>
    </div>
  );
}

/** Final: chegada feliz à cabana no cume. */
export function TrailSummitOverlay({
  theme,
  totalXp,
  bestStreak,
  onOtherTheme,
  onReplay,
}: {
  theme: string;
  totalXp: number;
  bestStreak: number;
  onOtherTheme: () => void;
  onReplay: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
      <div className="pointer-events-auto w-full max-w-sm rounded-3xl border-2 border-amber-400 bg-slate-950/88 p-5 text-center text-white shadow-2xl animate-in zoom-in-95">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-400/20 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-300">
          🏡 Cabana do topo conquistada · 3950m
        </span>
        <div className="mt-2 text-4xl">🏔️🏆</div>
        <h2 className="mt-1 text-xl font-black">Você chegou à cabana!</h2>
        <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-300">
          Félicitations ! Os 7 níveis do tema <strong className="text-white">{theme}</strong> estão completos.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/15 bg-white/10 p-2">
            <span className="block text-[10px] font-bold text-slate-400">Níveis</span>
            <span className="text-base font-black text-emerald-300">7/7</span>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-2">
            <span className="block text-[10px] font-bold text-slate-400">XP total</span>
            <span className="text-base font-black text-sky-300">+{totalXp}</span>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-2">
            <span className="block text-[10px] font-bold text-slate-400">Sequência</span>
            <span className="text-base font-black text-orange-300">{bestStreak} 🔥</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onOtherTheme}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-4 w-4" /> Outro tema
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-slate-100 hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" /> Jogar de novo
          </button>
        </div>
      </div>
    </div>
  );
}

/** A avalanche alcançou o aluno: tentar de novo ou voltar ao mapa. */
export function TrailAvalancheCaughtOverlay({
  level,
  name,
  onRetry,
  onMap,
}: {
  level: number;
  name: string;
  onRetry: () => void;
  onMap: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]" role="alertdialog" aria-live="assertive">
      <div className="w-full max-w-sm rounded-3xl border border-sky-200/40 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-5 text-center text-white shadow-2xl">
        <div className="text-5xl" aria-hidden>🏔️💨</div>
        <h2 className="mt-2 text-xl font-black text-sky-200">A avalanche te alcançou!</h2>
        <p className="mt-1 text-sm text-slate-300">
          Nível {level} · {name}. Responda mais rápido para manter a neve longe: cada acerto empurra a avalanche para trás.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={onRetry} className="cursor-pointer rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2.5 text-sm font-black shadow-lg active:scale-95">
            <RotateCcw className="mr-1 inline h-4 w-4" /> Tentar de novo
          </button>
          <button type="button" onClick={onMap} className="cursor-pointer rounded-2xl border border-white/25 bg-white/10 px-3 py-2.5 text-sm font-black active:scale-95">
            Voltar ao mapa
          </button>
        </div>
      </div>
    </div>
  );
}
