"use client";

import { useEffect } from "react";
import { Sparkles, Trophy, Award, X, Coins } from "lucide-react";
import { type Badge, type LevelInfo } from "@/lib/gamification";
import { soundEffects } from "@/lib/soundEffects";
import { Confetti } from "@/components/Confetti";

interface RewardUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge?: Badge | null;
  level?: LevelInfo | null;
  xpGained?: number;
  goudGained?: number;
}

export function RewardUnlockModal({
  isOpen,
  onClose,
  badge,
  level,
  xpGained,
  goudGained,
}: RewardUnlockModalProps) {
  useEffect(() => {
    if (isOpen) {
      if (level) {
        soundEffects.playLevelUp();
      } else {
        soundEffects.playReward();
      }
    }
  }, [isOpen, level]);

  if (!isOpen) return null;

  return (
    <>
      <Confetti active={isOpen} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Efeito de brilho de fundo */}
          <div className="pointer-events-none absolute -top-12 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[var(--accent)]/20 blur-3xl animate-pulse" />

          {/* Emblema central animado com brilho de vitória */}
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400/25 to-orange-400/25 border-2 border-amber-500/40 text-5xl shadow-xl animate-badge-glow">
            {level ? level.badgeEmoji : badge ? badge.emoji : <Trophy className="h-12 w-12 text-amber-500" />}
          </div>

          <p className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--accent)]">
            <Sparkles className="h-4 w-4" />
            {level ? "Nouvo Nivo Atteint!" : "Nouvo Konkèt Debloke!"}
          </p>

          <h3 className="mt-1 text-2xl font-black text-[var(--text)]">
            {level ? `Nivo ${level.level}: ${level.kreyol}` : badge?.kreyol}
          </h3>

          <p className="mt-1.5 text-xs font-semibold text-[var(--text-secondary)]">
            {level ? level.title : badge?.description}
          </p>

          {(xpGained || goudGained) && (
            <div className="mt-5 flex items-center justify-center gap-3">
              {xpGained && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-black text-blue-600 dark:text-blue-400 shadow-sm">
                  <Award className="h-4 w-4" /> +{xpGained} XP
                </span>
              )}
              {goudGained && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-black text-amber-600 dark:text-amber-400 shadow-sm">
                  <Coins className="h-4 w-4 text-amber-500" /> +{goudGained} Goud
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-2xl bg-[var(--accent)] py-3.5 text-sm font-black text-white shadow-lg shadow-[var(--accent)]/30 hover:bg-[var(--accent-hover)] transition-all transform active:scale-95 cursor-pointer"
          >
            Kontinye Jwe! 🚀
          </button>
        </div>
      </div>
    </>
  );
}
