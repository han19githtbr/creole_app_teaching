"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

type LoadingSize = "xs" | "sm" | "md" | "lg";
type LoadingLayout = "block" | "screen" | "inline" | "compact";

interface LoadingSpinnerProps {
  /** Texto exibido junto ao círculo. */
  label?: string;
  /**
   * Progresso real, de 0 a 100. Quando omitido, a porcentagem é estimada:
   * sobe rápido no começo, desacelera perto de 94% e só chega a 100% quando
   * o componente deixa de estar ativo (nunca "trava" em 100% antes da hora).
   */
  progress?: number;
  /** Quando false, mostra 100% (útil se o componente continuar na tela depois de carregar). */
  active?: boolean;
  size?: LoadingSize;
  /**
   * block: centralizado, com respiro (listas e cartões).
   * screen: ocupa a área da página (loading.tsx).
   * inline: linha com barra de progresso (formulários e uploads).
   * compact: só o círculo e um texto curto, sem barra (barra de navegação, botões).
   */
  layout?: LoadingLayout;
  /** Esconde a porcentagem (ex.: indicador minúsculo na barra superior). */
  showPercent?: boolean;
  className?: string;
}

const SIZES: Record<LoadingSize, { px: number; inside: boolean }> = {
  xs: { px: 20, inside: false },
  sm: { px: 40, inside: false },
  md: { px: 88, inside: true },
  lg: { px: 124, inside: true },
};

/** Estima uma porcentagem de carregamento enquanto não há progresso real. */
export function useSimulatedProgress(enabled: boolean, ceiling = 94) {
  const [value, setValue] = useState(4);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      setValue((current) => {
        const step = Math.max(0.2, (ceiling - current) * 0.045);
        return Math.min(ceiling, current + step);
      });
    }, 140);
    return () => window.clearInterval(id);
  }, [enabled, ceiling]);

  return value;
}

export function LoadingSpinner({
  label = "Carregando…",
  progress,
  active = true,
  size = "md",
  layout = "block",
  showPercent = true,
  className,
}: LoadingSpinnerProps) {
  const gradientId = `kreyol-grad-${useId().replace(/:/g, "")}`;
  const hasRealProgress = typeof progress === "number" && Number.isFinite(progress);
  const simulated = useSimulatedProgress(active && !hasRealProgress);

  const raw = hasRealProgress ? (progress as number) : active ? simulated : 100;
  const percent = Math.max(0, Math.min(100, Math.round(raw)));

  const { px, inside } = SIZES[size];

  // Anel interno que se enche conforme a porcentagem (r = 34 → circunferência ≈ 213,6)
  const innerCircumference = 2 * Math.PI * 34;
  const innerOffset = innerCircumference * (1 - percent / 100);

  const spinner = (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {size !== "xs" && (
        <span className="kreyol-loader-glow pointer-events-none absolute inset-[-18%] rounded-full bg-[var(--loader-soft)]/25 blur-xl" />
      )}

      {/* Círculo verde girando */}
      <svg viewBox="0 0 100 100" className="kreyol-loader-spin absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--loader-soft)" />
            <stop offset="100%" stopColor="var(--loader-deep)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--loader-track)" strokeWidth={size === "xs" ? 10 : 7} />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={size === "xs" ? 10 : 7}
          strokeLinecap="round"
          strokeDasharray="78 205"
        />
      </svg>

      {/* Anel de progresso (porcentagem) */}
      {size !== "xs" && (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="34" fill="none" stroke="var(--loader-track)" strokeWidth="5" />
          <circle
            className="kreyol-loader-arc"
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="var(--loader)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={innerCircumference}
            strokeDashoffset={innerOffset}
          />
        </svg>
      )}

      {showPercent && inside && (
        <span
          className={cn(
            "relative font-extrabold tabular-nums text-[var(--loader-ink)]",
            size === "lg" ? "text-2xl" : "text-lg"
          )}
        >
          {percent}
          <span className={size === "lg" ? "text-sm" : "text-[11px]"}>%</span>
        </span>
      )}
    </span>
  );

  if (layout === "compact") {
    return (
      <span role="status" aria-live="polite" aria-busy={active} className={cn("inline-flex items-center gap-2", className)}>
        {spinner}
        <span className="text-xs font-bold text-[var(--loader-ink)]">
          {label}
          {showPercent && <span aria-hidden="true" className="ml-1 tabular-nums">{percent}%</span>}
        </span>
      </span>
    );
  }

  if (layout === "inline") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy={active}
        className={cn(
          "kreyol-loader-enter flex items-center gap-3 rounded-xl border border-[var(--loader-track)] bg-[var(--surface-2)] p-3.5",
          className
        )}
      >
        {spinner}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 text-sm font-bold text-[var(--text)]">{label}</p>
            {showPercent && (
              <span aria-hidden="true" className="shrink-0 text-sm font-extrabold tabular-nums text-[var(--loader-ink)]">
                {percent}%
              </span>
            )}
          </div>
          <div
            className="relative h-2 overflow-hidden rounded-full bg-[var(--loader-track)]"
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[var(--loader-soft)] to-[var(--loader-deep)] transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            >
              <span className="kreyol-loader-shine absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-[2px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={active}
      className={cn(
        "kreyol-loader-enter flex flex-col items-center justify-center gap-4 text-center",
        layout === "screen" ? "min-h-[60vh] flex-1 px-4 py-16" : "px-4 py-10",
        className
      )}
    >
      {spinner}
      <div className="space-y-1">
        <p className="kreyol-loader-label text-base font-bold text-[var(--loader-ink)]">{label}</p>
        {showPercent && !inside && (
          <p aria-hidden="true" className="text-sm font-extrabold tabular-nums text-[var(--loader-ink)]">
            {percent}%
          </p>
        )}
      </div>
      <span className="sr-only">{percent}% concluído</span>
    </div>
  );
}
