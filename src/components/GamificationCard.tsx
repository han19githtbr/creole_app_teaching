"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Flame, Trophy, Coins, ArrowRight, Award } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { Card, CardContent } from "@/components/ui/card";
import { AchievementsModal } from "@/components/AchievementsModal";
import { LANGUAGE_META, type AppLanguage } from "@/lib/languageShared";

/** Nível, conquistas e jogo do idioma do painel (cada idioma tem o seu progresso). */
export function GamificationCard({ language }: { language: AppLanguage }) {
  const { state, levelInfo, activeTitle, unlockedBadgeList, allBadges, config } = useGamification(language);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <AchievementsModal language={language} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Card className="overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-2)] shadow-md">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Nível do Aluno e Avatar de Status */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400/25 to-orange-500/25 border border-amber-500/30 text-3xl shadow-sm">
                {levelInfo.current.badgeEmoji}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    {config.levelWord} {levelInfo.current.level}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    {levelInfo.current.title}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/25 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    {activeTitle.icon} {activeTitle.native}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text)] sm:text-xl">
                  {levelInfo.current.native}
                </h3>
              </div>
            </div>

            {/* Moedas e Sequência */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm cursor-pointer hover:bg-amber-500/20 transition"
                title={
                  language === "francais"
                    ? "Écu: moeda fictícia do jogo. Ganhe écus ao acertar palavras no C'est quoi ? para desbloquear novos níveis!"
                    : "Goud: Moeda fictícia do jogo. Ganhe +10 Goud ao acertar palavras nas postagens para desbloquear novos níveis!"
                }
                onClick={() => setModalOpen(true)}
              >
                <Coins className="h-4 w-4 text-amber-500" />
                <span>{state.goud} {config.currency}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 shadow-sm">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{state.currentStreak} Combo</span>
              </div>
            </div>
          </div>

          {/* Barra de Progresso de XP */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-blue-500" /> Experiência (XP)
              </span>
              <span>
                {state.xp} / {levelInfo.current.nextXp} XP ({levelInfo.progressPct}%)
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-[var(--accent)] transition-all duration-500 shadow-sm"
                style={{ width: `${levelInfo.progressPct}%` }}
              />
            </div>
          </div>

          {/* Badges e Conquistas Rápidas */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                Conquistas ({unlockedBadgeList.length}/{allBadges.length}):
              </button>
              <div className="flex items-center -space-x-1.5">
                {allBadges.slice(0, 7).map((badge) => {
                  const isUnlocked = state.unlockedBadges.includes(badge.id);
                  return (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => setModalOpen(true)}
                      title={`${badge.native} (${badge.title}): ${badge.description}`}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs shadow-sm transition-transform hover:scale-125 cursor-pointer ${
                        isUnlocked
                          ? "border-amber-400/50 bg-amber-100 dark:bg-amber-900/40"
                          : "border-[var(--border)] bg-[var(--surface-2)] opacity-35 grayscale"
                      }`}
                    >
                      {badge.emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors shadow-sm cursor-pointer"
              >
                <Trophy className="h-3.5 w-3.5 text-amber-500" /> Conquistas & Loja
              </button>
              <Link
                href="/dashboard/jogo"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> {LANGUAGE_META[language].gameTitle} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
