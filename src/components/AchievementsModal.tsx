"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Trophy,
  Sparkles,
  Coins,
  Check,
  Lock,
  Award,
  Zap,
  Gamepad2,
} from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { soundEffects } from "@/lib/soundEffects";
import { Confetti } from "@/components/Confetti";
import { cn } from "@/lib/utils";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const {
    state,
    levelInfo,
    activeTitle,
    allBadges,
    allTitles,
    buyTitle,
    equipTitle,
  } = useGamification();

  const [activeTab, setActiveTab] = useState<"badges" | "titles">("badges");
  const [purchaseMsg, setPurchaseMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  function handleBuy(titleId: string) {
    const result = buyTitle(titleId);
    if (result.success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      if (result.leveledUp) {
        soundEffects.playLevelUp();
      } else {
        soundEffects.playReward();
      }
      setPurchaseMsg({ type: "success", text: result.message });
    } else {
      soundEffects.playError();
      setPurchaseMsg({ type: "error", text: result.message });
    }
    setTimeout(() => setPurchaseMsg(null), 4000);
  }

  function handleEquip(titleId: string) {
    soundEffects.playTap();
    equipTitle(titleId);
    setPurchaseMsg({ type: "success", text: "Nível/Título equipado com sucesso!" });
    setTimeout(() => setPurchaseMsg(null), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)]/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-sm">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--text)]">
                Koleksyon & Onè Kreyòl
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Conquistas, insígnias de honra e níveis desbloqueáveis do jogo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumo do Jogador */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{levelInfo.current.badgeEmoji}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                NÍVEL {levelInfo.current.level}
              </span>
              <p className="text-sm font-extrabold text-[var(--text)]">
                {levelInfo.current.kreyol} ({levelInfo.current.title})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400" title="Goud: Moeda fictícia do jogo ganha ao acertar palavras">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>{state.goud} Goud</span>
              <span className="hidden sm:inline rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-extrabold text-amber-700 dark:text-amber-300">
                Fictícia
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Award className="h-4 w-4 text-blue-500" />
              <span>{state.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Banner Explicativo da Moeda Fictícia e Desbloqueio de Níveis */}
        <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent px-6 py-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              🪙 <strong className="text-[var(--text)]">Moeda Fictícia do Jogo:</strong> As <em>Gourdes (Goud)</em> são moedas virtuais gratuitas. A cada postagem com palavras acertadas você ganha <strong>+10 Goud</strong>! Ao somar <strong>50, 100, 200 Goud</strong>, desbloqueie os próximos níveis para aumentar seu <strong>XP</strong>!
            </p>
            <Link
              href="/dashboard/jogo"
              onClick={onClose}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-amber-600 transition self-start sm:self-auto cursor-pointer"
            >
              <Gamepad2 className="h-3.5 w-3.5" /> +10 Goud por cena
            </Link>
          </div>
        </div>

        {/* Mensagem de Feedback de Compra/Equipamento */}
        {purchaseMsg && (
          <div
            className={cn(
              "px-6 py-2 text-center text-xs font-bold transition-all",
              purchaseMsg.type === "success"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
            )}
          >
            {purchaseMsg.text}
          </div>
        )}

        {/* Barra de Abas */}
        <div className="flex border-b border-[var(--border)] bg-[var(--surface-2)]/40 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={cn(
              "flex items-center gap-2 border-b-2 py-3 text-xs font-bold transition-colors cursor-pointer",
              activeTab === "badges"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            )}
          >
            <Trophy className="h-4 w-4" /> Conquistas & Insígnias (
            {state.unlockedBadges.length}/{allBadges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("titles")}
            className={cn(
              "ml-6 flex items-center gap-2 border-b-2 py-3 text-xs font-bold transition-colors cursor-pointer",
              activeTab === "titles"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            )}
          >
            <Sparkles className="h-4 w-4 text-amber-500" /> Desbloquear Níveis & Títulos (
            {state.unlockedTitles.length}/{allTitles.length})
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "badges" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {allBadges.map((badge) => {
                const isUnlocked = state.unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      "flex items-start gap-3.5 rounded-2xl border p-4 transition-all",
                      isUnlocked
                        ? "border-amber-400/40 bg-gradient-to-br from-amber-500/5 via-[var(--surface)] to-[var(--surface)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--surface-2)]/50 opacity-60 grayscale-[0.7]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl shadow-sm",
                        isUnlocked
                          ? "border-amber-400/50 bg-amber-500/15"
                          : "border-[var(--border)] bg-[var(--surface-2)]"
                      )}
                    >
                      {badge.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="truncate text-sm font-bold text-[var(--text)]">
                          {badge.kreyol}
                        </h4>
                        {isUnlocked ? (
                          <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3 w-3" /> Conquistado
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                            <Lock className="h-3 w-3" /> Bloqueado
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] font-medium text-[var(--text-muted)]">
                        {badge.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">
                        {badge.description}
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          +{badge.xpReward} XP
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          +{badge.goudReward} Goud
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  SEU TÍTULO EQUIPADO ATUALMENTE:
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xl">{activeTitle.icon}</span>
                  <span className="text-base font-black text-[var(--text)]">
                    {activeTitle.kreyol}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    ({activeTitle.portuguese})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {allTitles.map((title) => {
                  const isOwned = state.unlockedTitles.includes(title.id);
                  const isEquipped = state.activeTitleId === title.id;
                  const canAfford = state.goud >= title.price;

                  return (
                    <div
                      key={title.id}
                      className={cn(
                        "flex flex-col justify-between rounded-2xl border p-4.5 transition-all",
                        isEquipped
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]/50 shadow-md ring-2 ring-[var(--accent)]/30"
                          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{title.icon}</span>
                            <div>
                              <h4 className="text-sm font-black text-[var(--text)]">
                                {title.kreyol}
                              </h4>
                              <p className="text-[11px] text-[var(--text-muted)]">
                                {title.portuguese}
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="mt-2.5 text-xs text-[var(--text-secondary)]">
                          {title.description}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                        <div className="space-y-0.5">
                          {title.price === 0 ? (
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              Nível Inicial Gratuito
                            </span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400">
                                <Coins className="h-3.5 w-3.5" />
                                {title.price} Goud <span className="text-[10px] font-normal text-[var(--text-muted)]">(fictícios)</span>
                              </span>
                              {title.xpReward > 0 && (
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                  +{title.xpReward} XP ao desbloquear
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {isEquipped ? (
                          <span className="flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                            <Check className="h-3.5 w-3.5" /> Nível Equipado
                          </span>
                        ) : isOwned ? (
                          <button
                            type="button"
                            onClick={() => handleEquip(title.id)}
                            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
                          >
                            Equipar
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => handleBuy(title.id)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer",
                              canAfford
                                ? "bg-amber-500 text-white hover:bg-amber-600 hover:scale-105 active:scale-95"
                                : "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                            )}
                            title={
                              canAfford
                                ? `Desbloquear este nível e ganhar +${title.xpReward} XP`
                                : `Faltam ${title.price - state.goud} Goud. Acerte palavras nas postagens para acumular!`
                            }
                          >
                            {canAfford ? (
                              <>
                                <Zap className="h-3.5 w-3.5" /> Desbloquear (+{title.xpReward} XP)
                              </>
                            ) : (
                              `Faltam ${title.price - state.goud} Goud`
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
