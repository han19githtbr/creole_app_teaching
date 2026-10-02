"use client";

import { useEffect } from "react";
import { Sparkles, Trophy, Award, X } from "lucide-react";
import { type Badge, type LevelInfo } from "@/lib/gamification";
import { soundEffects } from "@/lib/soundEffects";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Efeito de brilho de fundo */}
        <div className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-2xl" />

        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400/20 to-orange-400/20 border border-amber-500/30 text-4xl shadow-inner">
          {level ? level.badgeEmoji : badge ? badge.emoji : <Trophy className="h-10 w-10 text-amber-500" />}
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
          <Sparkles className="h-3.5 w-3.5" />
          {level ? "Nouvo Nivo Atteint!" : "Nouvo Konkèt Debloke!"}
        </p>

        <h3 className="mt-1 text-xl font-extrabold text-[var(--text)]">
          {level ? `Nivo ${level.level}: ${level.kreyol}` : badge?.kreyol}
        </h3>

        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {level ? level.title : badge?.description}
        </p>

        {(xpGained || goudGained) && (
          <div className="mt-4 flex items-center justify-center gap-3">
            {xpGained && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Award className="h-3.5 w-3.5" /> +{xpGained} XP
              </span>
            )}
            {goudGained && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                💰 +{goudGained} Goud
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white shadow-md shadow-[var(--accent)]/25 hover:bg-[var(--accent-hover)] transition-all transform active:scale-95"
        >
          Kontinye Jwe! 🚀
        </button>
      </div>
    </div>
  );
}
