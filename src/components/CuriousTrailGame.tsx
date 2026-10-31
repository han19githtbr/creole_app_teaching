"use client";

import "./CuriousTrailGame.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  Coins,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";
import { Confetti } from "@/components/Confetti";
import { cn } from "@/lib/utils";
import { recordQuizWin, type Badge, type LevelInfo } from "@/lib/gamification";
import { useGamification } from "@/hooks/useGamification";
import { AchievementsModal } from "@/components/AchievementsModal";
import { RewardUnlockModal } from "@/components/RewardUnlockModal";
import { buildWordOptions, type CestQuoiItem } from "@/lib/cquoiContent";
import {
  getAllTrailItems,
  getTrailItemsForTheme,
  loadTrailProgress,
  pickTrailElementsForLevel,
  saveTrailProgress,
  TRAIL_LEVELS,
  TRAIL_THEMES,
  type TrailLevelConfig,
  type TrailProgressState,
  type TrailThemeOption,
} from "@/lib/curiousTrailData";
import { CuriousTrailMountain } from "./CuriousTrailMountain";

export type TrailDifficulty = "easy" | "intermediate" | "master" | "native";

interface DifficultyConfig {
  id: TrailDifficulty;
  label: string;
  emoji: string;
  seconds: number;
  multiplier: number;
  desc: string;
  color: string;
}

const DIFFICULTY_CONFIGS: Record<TrailDifficulty, DifficultyConfig> = {
  easy: {
    id: "easy",
    label: "Fácil",
    emoji: "🌱",
    seconds: 15,
    multiplier: 1.0,
    desc: "15s por elemento · Ideal para iniciantes",
    color: "from-emerald-500 to-green-600",
  },
  intermediate: {
    id: "intermediate",
    label: "Intermediário",
    emoji: "⚡",
    seconds: 10,
    multiplier: 1.5,
    desc: "10s por elemento · Ritmo dinâmico",
    color: "from-amber-500 to-orange-600",
  },
  master: {
    id: "master",
    label: "Master",
    emoji: "🔥",
    seconds: 5,
    multiplier: 2.0,
    desc: "5s por elemento · Desafio ágil",
    color: "from-rose-500 to-red-700",
  },
  native: {
    id: "native",
    label: "Nativo",
    emoji: "👑",
    seconds: 4,
    multiplier: 2.5,
    desc: "4s por elemento · Reflexo de nativo",
    color: "from-violet-600 to-indigo-700",
  },
};

const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];

// Pronúncia francesa nativa com Web Speech API
let cachedFrenchVoice: SpeechSynthesisVoice | null = null;
function getFrenchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedFrenchVoice) return cachedFrenchVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedFrenchVoice =
    voices.find((v) => v.lang.toLowerCase() === "fr-fr" && /google|thomas|amelie|audrey|marie|natural/i.test(v.name)) ??
    voices.find((v) => v.lang.toLowerCase() === "fr-fr") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("fr")) ??
    null;
  return cachedFrenchVoice;
}

function speakWordFrench(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") {
    onEnd?.();
    return;
  }
  if (!("speechSynthesis" in window) || soundEffects.isMuted()) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    const voice = getFrenchVoice();
    if (voice) utter.voice = voice;
    utter.rate = 0.84;
    utter.pitch = 1.0;
    utter.volume = Math.max(0.3, soundEffects.getVolume());
    utter.onend = () => onEnd?.();
    utter.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utter);
  } catch {
    onEnd?.();
  }
}

export interface CuriousTrailGameProps {
  items: CestQuoiItem[];
  initialTheme?: string;
  onSwitchToClassic?: () => void;
}

export function CuriousTrailGame({ items, initialTheme, onSwitchToClassic }: CuriousTrailGameProps) {
  // Combina itens fornecidos com itens dedicados (incluindo idiomas)
  const allPool = useMemo(() => getAllTrailItems(items), [items]);

  // Tema inicial selecionado
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    if (initialTheme && TRAIL_THEMES.some((t) => t.id === initialTheme)) return initialTheme;
    return "gastronomia";
  });

  const selectedTheme = useMemo(
    () => TRAIL_THEMES.find((t) => t.id === selectedThemeId) || TRAIL_THEMES[0],
    [selectedThemeId]
  );

  // Progresso do tema (1 a 7 níveis)
  const [trailProgress, setTrailProgress] = useState<TrailProgressState>(() =>
    loadTrailProgress(selectedThemeId)
  );

  // Recarrega progresso ao trocar de tema
  useEffect(() => {
    setTrailProgress(loadTrailProgress(selectedThemeId));
  }, [selectedThemeId]);

  // Gamificação (XP, títulos e écus em francês)
  const { state: gameState, levelInfo, activeTitle, config: gamifConfig } = useGamification("francais");
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [rewardSummary, setRewardSummary] = useState<{ xp: number; goud: number; badges: Badge[]; level: LevelInfo | null } | null>(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  // Estados de fase da trilha
  const [phase, setPhase] = useState<"lobby" | "countdown" | "playing" | "level_complete" | "summit_victory">("lobby");
  const [difficulty, setDifficulty] = useState<TrailDifficulty>("intermediate");
  const diffCfg = DIFFICULTY_CONFIGS[difficulty];

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const currentLevelCfg = useMemo(
    () => TRAIL_LEVELS.find((l) => l.level === currentLevel) || TRAIL_LEVELS[0],
    [currentLevel]
  );

  // Elementos sorteados para o nível atual
  const [levelItems, setLevelItems] = useState<CestQuoiItem[]>([]);
  const [elementIndex, setElementIndex] = useState<number>(0);
  const currentItem: CestQuoiItem | undefined = levelItems[elementIndex];

  // Alternativas do elemento atual
  const [options, setOptions] = useState<string[]>([]);
  const [roundState, setRoundState] = useState<"asking" | "correct" | "retry" | "reveal">("asking");
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [attempt, setAttempt] = useState<number>(1);

  // Temporizador do elemento
  const [timeLeft, setTimeLeft] = useState<number>(diffCfg.seconds * 1000);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number>(3);

  // Pontuação e Bônus de Velocidade
  const [score, setScore] = useState<number>(0);
  const [levelXp, setLevelXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [speedBonusText, setSpeedBonusText] = useState<string | null>(null);

  // Animação do Aluno e Montanha
  const [isMovingStudent, setIsMovingStudent] = useState<boolean>(false);
  const [isCheering, setIsCheering] = useState<boolean>(false);
  const [isRaisingFlag, setIsRaisingFlag] = useState<boolean>(false);
  const [flagProgress, setFlagProgress] = useState<number>(0);
  const [confetti, setConfetti] = useState<boolean>(false);
  const [activeAnimalGreeting, setActiveAnimalGreeting] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(() => soundEffects.isMuted());

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    soundEffects.setMuted(next);
  }

  // Prepara as opções para o elemento atual
  useEffect(() => {
    if (!currentItem) return;
    const isHard = difficulty === "master" || difficulty === "native";
    const opts = buildWordOptions(currentItem, allPool, isHard);
    setOptions(opts);
    setRoundState("asking");
    setWrongPicks([]);
    setAttempt(1);
    setTimeLeft(diffCfg.seconds * 1000);
    setTimerRunning(true);
    setSpeedBonusText(null);
  }, [currentItem, allPool, difficulty, diffCfg.seconds]);

  // Cronômetro do elemento com contagem decrescente
  useEffect(() => {
    if (!timerRunning || roundState !== "asking") return;
    const interval = 100;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(t);
          handleTimeUp();
          return 0;
        }
        if (prev <= 3100 && prev % 1000 <= 150) {
          soundEffects.playClockTick(true);
        }
        return prev - interval;
      });
    }, interval);
    return () => clearInterval(t);
  }, [timerRunning, roundState]);

  // Tempo esgotado
  function handleTimeUp() {
    setTimerRunning(false);
    soundEffects.playTimeUp();
    if (attempt === 1) {
      setRoundState("retry");
      setAttempt(2);
      setTimeLeft(Math.max(4000, Math.round((diffCfg.seconds * 1000) / 2)));
      setTimerRunning(true);
    } else {
      setRoundState("reveal");
      if (currentItem) speakWordFrench(currentItem.speak);
      setTimeout(advanceElement, 3000);
    }
  }

  // Iniciar um nível
  function startLevel(lvl: number) {
    soundEffects.playRoundStart();
    setCurrentLevel(lvl);
    const itemsForThisLevel = pickTrailElementsForLevel(lvl, selectedThemeId, allPool);
    setLevelItems(itemsForThisLevel);
    setElementIndex(0);
    setLevelXp(0);
    setIsRaisingFlag(false);
    setFlagProgress(0);
    setCountdownNum(3);
    setPhase("countdown");

    let count = 3;
    const cInterval = setInterval(() => {
      count--;
      if (count > 0) {
        soundEffects.playClockTick(false);
        setCountdownNum(count);
      } else {
        clearInterval(cInterval);
        soundEffects.playWhoosh();
        setPhase("playing");
      }
    }, 800);
  }

  // Avançar para o próximo elemento do nível ou concluir o nível
  function advanceElement() {
    const nextIdx = elementIndex + 1;
    if (nextIdx < levelItems.length) {
      // Movimenta o aluno até o próximo elemento na montanha
      setIsMovingStudent(true);
      setTimeout(() => setIsMovingStudent(false), 900);
      setElementIndex(nextIdx);
    } else {
      // Concluiu todos os elementos deste nível da montanha!
      completeLevel();
    }
  }

  // Conclusão com sucesso do nível da trilha
  function completeLevel() {
    setTimerRunning(false);
    setIsCheering(true);

    const isLastLevel = currentLevel === 7;
    const nextUnlocked = Math.max(trailProgress.unlockedLevel, Math.min(7, currentLevel + 1));
    const nextCompleted = Array.from(new Set([...trailProgress.completedLevels, currentLevel]));
    const newProgress: TrailProgressState = {
      ...trailProgress,
      unlockedLevel: nextUnlocked,
      completedLevels: nextCompleted,
      totalXp: trailProgress.totalXp + levelXp,
      highScores: {
        ...trailProgress.highScores,
        [currentLevel]: Math.max(trailProgress.highScores[currentLevel] || 0, score),
      },
      stars: {
        ...trailProgress.stars,
        [currentLevel]: Math.max(trailProgress.stars[currentLevel] || 0, attempt === 1 ? 3 : 2),
      },
    };

    saveTrailProgress(selectedThemeId, newProgress);
    setTrailProgress(newProgress);

    if (isLastLevel) {
      // SUBIDA DA BANDEIRA NO CUME DA MONTANHA!
      setIsRaisingFlag(true);
      soundEffects.playVictoryFanfare();
      setConfetti(true);

      // Animação de subida da bandeira de 0 a 100%
      let prog = 0;
      const fInterval = setInterval(() => {
        prog += 5;
        setFlagProgress(prog);
        if (prog >= 100) {
          clearInterval(fInterval);
          setPhase("summit_victory");
        }
      }, 60);
    } else {
      soundEffects.playLevelUp();
      setConfetti(true);
      setPhase("level_complete");
    }
  }

  // Resposta do usuário
  function handleSelectOption(chosenFr: string) {
    if (roundState !== "asking" || !currentItem) return;

    if (chosenFr === currentItem.fr) {
      // ACERTO!
      setTimerRunning(false);
      setRoundState("correct");
      soundEffects.playSuccess();

      // Cálculo do Bônus de Velocidade
      const totalMs = diffCfg.seconds * 1000;
      const speedRatio = timeLeft / totalMs;
      let speedMultiplier = 1.0;
      let bonusLabel = "";

      if (speedRatio >= 0.65) {
        speedMultiplier = 1.5;
        bonusLabel = "⚡ Relâmpago ! +50% XP";
      } else if (speedRatio >= 0.35) {
        speedMultiplier = 1.25;
        bonusLabel = "🚀 Ágil ! +25% XP";
      } else {
        speedMultiplier = 1.1;
        bonusLabel = "✨ Muito bem ! +10% XP";
      }

      setSpeedBonusText(bonusLabel);

      const baseElementXp = Math.round((currentLevelCfg.xpBase / currentLevelCfg.elementCount) * diffCfg.multiplier * speedMultiplier);
      const pointsGain = Math.round(100 * diffCfg.multiplier * speedMultiplier);

      setScore((s) => s + pointsGain);
      setLevelXp((x) => x + baseElementXp);
      setStreak((st) => {
        const next = st + 1;
        if (next > bestStreak) setBestStreak(next);
        if (next % 3 === 0) soundEffects.playStreak(next);
        return next;
      });

      // Gamificação central
      const reward = recordQuizWin({
        language: "francais",
        sceneId: currentItem.id,
        theme: currentItem.themeId,
        wordsCount: 1,
        attemptsLeft: attempt === 1 ? 3 : 2,
      });

      if (reward.badges.length > 0 || reward.levelUp) {
        setRewardSummary({
          xp: reward.xpGained,
          goud: reward.goudGained,
          badges: reward.badges,
          level: reward.levelUp,
        });
        setRewardModalOpen(true);
      }

      // Pronúncia francesa nativa imediata
      speakWordFrench(currentItem.speak);

      // Avança suavemente após ouvir a pronúncia
      setTimeout(() => {
        advanceElement();
      }, 1600);
    } else {
      // ERRO
      soundEffects.playError();
      setStreak(0);
      setWrongPicks((w) => [...w, chosenFr]);

      if (attempt === 1) {
        setRoundState("retry");
        setAttempt(2);
        // Dá uma sobrevida de tempo para a 2ª tentativa
        setTimeLeft(Math.max(4000, Math.round((diffCfg.seconds * 1000) / 2)));
      } else {
        setRoundState("reveal");
        setTimerRunning(false);
        speakWordFrench(currentItem.speak);
        setTimeout(advanceElement, 3200);
      }
    }
  }

  return (
    <div className="cq2-bg min-h-[calc(100vh-4rem)] pb-12">
      {confetti && <Confetti count={100} onComplete={() => setConfetti(false)} />}
      <AchievementsModal language="francais" isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
      {rewardSummary && (
        <RewardUnlockModal
          language="francais"
          isOpen={rewardModalOpen}
          onClose={() => setRewardModalOpen(false)}
          xpGained={rewardSummary.xp}
          goudGained={rewardSummary.goud}
          badges={rewardSummary.badges}
          newLevel={rewardSummary.level}
        />
      )}

      <div className="mx-auto w-full max-w-4xl space-y-4 px-3 sm:px-4 py-4 sm:py-6">
        {/* ---------------- BARRA DE NAVEGAÇÃO SUPERIOR ---------------- */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text)] shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Painel
          </Link>

          {/* SELETOR DE MÓDULOS DE JOGO */}
          <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-1 shadow-inner">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-sm"
            >
              🏔️ Trilha Curiosa
              <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider">
                Novo
              </span>
            </button>
            <button
              type="button"
              onClick={onSwitchToClassic}
              className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            >
              🎯 C&apos;est quoi ?
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-secondary)] shadow-sm hover:text-[var(--text)]"
              aria-label={muted ? "Ativar som" : "Silenciar"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ---------------- CARD DE GAMIFICAÇÃO EM FRANCÊS ---------------- */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-xl shadow-inner">
                {levelInfo.current.badgeEmoji}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs sm:text-sm font-extrabold text-[var(--text)]">
                  {gamifConfig.levelWord} {levelInfo.current.level} · {levelInfo.current.native}
                </p>
                <p className="truncate text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)]">
                  {activeTitle.icon} {activeTitle.native}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEffects.playTap();
                setAchievementsOpen(true);
              }}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
            >
              <Trophy className="h-3.5 w-3.5" /> Conquistas
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-blue-500" /> {gameState.xp} XP
            </span>
            <span className="inline-flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-amber-500" /> {gameState.goud} {gamifConfig.currency}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-[var(--accent)] transition-all duration-500"
              style={{ width: `${levelInfo.progressPct}%` }}
            />
          </div>
        </div>

        {/* ---------------- 1. TELA LOBBY / SELEÇÃO DE TEMA E TRILHA ---------------- */}
        {phase === "lobby" && (
          <div className="space-y-5">
            {/* CABEÇALHO HERO DA TRILHA */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                🏔️ Sentier de l&apos;Élève Curieux · 7 Níveis
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text)]">
                Trilha do Aluno Curioso 🇫🇷
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                Escale a montanha do conhecimento decifrando os elementos pelo caminho! A cada nível superado,
                a altitude sobe, o clima se transforma com <strong>chuva e guarda-chuva</strong>, depois <strong>neve no cume</strong>,
                e ao vencer o Nível 7 você <strong>hasteia a bandeira da vitória</strong>!
              </p>

              {/* DIFICULDADE */}
              <div className="mt-5 max-w-lg mx-auto">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Ritmo e Dificuldade da Escalada
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(DIFFICULTY_CONFIGS) as TrailDifficulty[]).map((dKey) => {
                    const cfg = DIFFICULTY_CONFIGS[dKey];
                    const isSel = difficulty === dKey;
                    return (
                      <button
                        key={dKey}
                        type="button"
                        onClick={() => {
                          soundEffects.playTap();
                          setDifficulty(dKey);
                        }}
                        className={cn(
                          "cursor-pointer rounded-2xl border-2 p-2.5 text-center transition-all",
                          isSel
                            ? "border-amber-500 bg-amber-500/15 shadow-md ring-2 ring-amber-400/50"
                            : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] opacity-80"
                        )}
                      >
                        <span className="text-xl block">{cfg.emoji}</span>
                        <span className="text-xs font-extrabold text-[var(--text)] block">{cfg.label}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-semibold block">{cfg.seconds}s · x{cfg.multiplier}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SELEÇÃO DO TEMA */}
              <div className="mt-6 text-left">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                    Escolha o Tema da Trilha ({TRAIL_THEMES.length} temas disponíveis)
                  </span>
                  <span className="text-xs font-bold text-amber-500">
                    {selectedTheme.emoji} {selectedTheme.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {TRAIL_THEMES.map((thm) => {
                    const isSel = selectedThemeId === thm.id;
                    const thmProgress = loadTrailProgress(thm.id);
                    const doneCount = thmProgress.completedLevels.length;

                    return (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => {
                          soundEffects.playTap();
                          setSelectedThemeId(thm.id);
                        }}
                        className={cn(
                          "relative rounded-2xl border-2 p-3 text-left transition-all cursor-pointer trail-card-hover",
                          isSel
                            ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-400/40"
                            : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{thm.emoji}</span>
                          {doneCount > 0 && (
                            <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 text-[9px] font-black">
                              {doneCount}/7
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs font-black text-[var(--text)] truncate">{thm.label}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-semibold italic">{thm.fr}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PRÉVIA VISUAL DA MONTANHA COM AS 7 ESTAÇÕES DESTE TEMA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🗺️</span>
                  <h2 className="text-sm sm:text-base font-black text-[var(--text)]">
                    Mapa da Montanha · Tema {selectedTheme.label}
                  </h2>
                </div>
                <span className="text-xs font-bold text-amber-500">
                  {trailProgress.unlockedLevel}/7 Estações Desbloqueadas
                </span>
              </div>

              <CuriousTrailMountain
                currentLevel={trailProgress.unlockedLevel}
                unlockedLevel={trailProgress.unlockedLevel}
                completedLevels={trailProgress.completedLevels}
                onSelectLevel={(lvl) => startLevel(lvl)}
                activeAnimalGreeting={activeAnimalGreeting}
                onAnimalClick={(animalId, quote) => {
                  speakWordFrench(quote);
                  setActiveAnimalGreeting(animalId);
                }}
              />

              {/* BOTÃO PRINCIPAL DE INÍCIO DA ESCALADA */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => startLevel(trailProgress.unlockedLevel)}
                  className="inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-8 py-3.5 text-base font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
                >
                  <Play className="h-5 w-5 fill-current" />
                  {trailProgress.completedLevels.length === 0
                    ? `Iniciar Trilha do Aluno Curioso (${selectedTheme.label})`
                    : `Continuar Escalada no Nível ${trailProgress.unlockedLevel}`}
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 2. TELA DE CONTAGEM REGRESSIVA ---------------- */}
        {phase === "countdown" && (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-xl space-y-4">
            <span className="text-4xl animate-bounce block">{currentLevelCfg.badgeEmoji}</span>
            <p className="text-xs font-black uppercase tracking-wider text-amber-500">
              Nível {currentLevel} · {currentLevelCfg.name} ({currentLevelCfg.altitude}m)
            </p>
            <h2 className="text-2xl font-black text-[var(--text)]">{currentLevelCfg.description}</h2>
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-6xl font-black text-white shadow-2xl animate-pulse">
              {countdownNum}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-semibold">
              Prepare-se para reconhecer {currentLevelCfg.elementCount}{" "}
              {currentLevelCfg.elementCount === 1 ? "elemento" : "elementos"}!
            </p>
          </div>
        )}

        {/* ---------------- 3. TELA DE JOGO ATIVO (SUBINDO A MONTANHA) ---------------- */}
        {phase === "playing" && currentItem && (
          <div className="space-y-4">
            {/* O CENÁRIO DINÂMICO DA MONTANHA AO VIVO */}
            <CuriousTrailMountain
              currentLevel={currentLevel}
              unlockedLevel={trailProgress.unlockedLevel}
              completedLevels={trailProgress.completedLevels}
              isMoving={isMovingStudent}
              isCheering={isCheering}
              isRaisingFlag={isRaisingFlag}
              flagProgress={flagProgress}
              activeAnimalGreeting={activeAnimalGreeting}
              onAnimalClick={(animalId, quote) => {
                speakWordFrench(quote);
                setActiveAnimalGreeting(animalId);
              }}
            />

            {/* CARD PRINCIPAL DE IDENTIFICAÇÃO DO ELEMENTO */}
            <div className="rounded-3xl border-2 border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-xl space-y-4">
              {/* STATUS DO ELEMENTO / TEMPORIZADOR */}
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-base font-black text-amber-600 dark:text-amber-400">
                    {elementIndex + 1}/{levelItems.length}
                  </span>
                  <div>
                    <span className="block text-xs font-black text-[var(--text)]">
                      Elemento {elementIndex + 1} de {levelItems.length}
                    </span>
                    <span className="block text-[10px] text-[var(--text-muted)] font-semibold">
                      {currentLevelCfg.name} · {currentLevelCfg.altitude}m
                    </span>
                  </div>
                </div>

                {/* TEMPORIZADOR CIRCULAR */}
                <div className="flex items-center gap-2">
                  {speedBonusText && (
                    <span className="text-xs font-black text-amber-500 trail-score-pop">
                      {speedBonusText}
                    </span>
                  )}
                  <div
                    className={cn(
                      "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full font-black text-sm text-white shadow-md transition-colors",
                      timeLeft <= 3000 ? "bg-red-600 animate-ping" : timeLeft <= 6000 ? "bg-amber-500" : "bg-blue-600"
                    )}
                  >
                    {Math.ceil(timeLeft / 1000)}s
                  </div>
                </div>
              </div>

              {/* IMAGEM DO ELEMENTO NA CENA DA TRILHA */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[380px] w-full overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-slate-950 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentItem.scene}
                  alt={currentItem.name}
                  className="h-full w-full object-contain"
                />

                {/* Seta vermelha apontando o objeto exato da trilha */}
                <svg
                  viewBox={`0 0 ${currentItem.w} ${currentItem.h}`}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden
                >
                  <g className="cq-sway">
                    <g transform={`translate(${currentItem.arrow.x} ${currentItem.arrow.y}) rotate(25)`}>
                      <path
                        d="M-90 -10 L-40 -10 L-45 -25 L0 0 L-45 25 L-40 10 L-90 10 Z"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="5"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                </svg>

                {/* Feedback e Revelação do Nome com Áudio */}
                {(roundState === "correct" || roundState === "reveal") && (
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/90 backdrop-blur-md p-3 text-white flex items-center justify-between border-t border-amber-400/50 animate-in slide-in-from-bottom">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {roundState === "correct" ? "🎉" : "💡"}
                      </span>
                      <div>
                        <p className="text-sm sm:text-base font-black text-amber-300">
                          {currentItem.fr}
                        </p>
                        <p className="text-[11px] text-slate-300 font-semibold">
                          Significado: {currentItem.name}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakWordFrench(currentItem.speak)}
                      className="cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-black text-white flex items-center gap-1.5 shadow"
                    >
                      <Volume2 className="h-4 w-4" /> Ouvir pronúncia
                    </button>
                  </div>
                )}
              </div>

              {/* DICA DE SEGUNDA TENTATIVA SE O ALUNO ERROU A PRIMEIRA */}
              {roundState === "retry" && (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-center text-xs font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                  Quase! Você tem mais uma chance! Tente identificar novamente o objeto apontado pela seta vermelha.
                </div>
              )}

              {/* AS 4 ALTERNATIVAS EM FRANCÊS (A, B, C, D) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {options.map((opt, idx) => {
                  const letter = OPTION_LETTERS[idx] || "A";
                  const isWrong = wrongPicks.includes(opt);
                  const isCorrectChoice = roundState === "correct" && opt === currentItem.fr;
                  const isRevealed = roundState === "reveal" && opt === currentItem.fr;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      disabled={roundState !== "asking" || isWrong}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all",
                        isWrong
                          ? "border-red-300 bg-red-100/40 text-red-700 opacity-60 line-through cursor-not-allowed dark:bg-red-950/20"
                          : isCorrectChoice || isRevealed
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 shadow-md ring-2 ring-emerald-400"
                          : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] cursor-pointer trail-card-hover"
                      )}
                    >
                      {/* Letra A-D */}
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-black text-white text-sm shadow"
                        style={{ backgroundColor: OPTION_COLORS[idx % OPTION_COLORS.length] }}
                      >
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[var(--text)] flex-1 leading-snug">
                        {opt}
                      </span>
                      {isCorrectChoice && <Check className="h-5 w-5 text-emerald-500 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 4. TELA DE NÍVEL CONCLUÍDO (PASSANDO PARA O PRÓXIMO) ---------------- */}
        {phase === "level_complete" && (
          <div className="rounded-3xl border-2 border-emerald-500/50 bg-[var(--surface)] p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-in zoom-in-95">
            <span className="text-5xl block animate-bounce">🌲✨</span>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Nível {currentLevel} Conquistado!
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text)]">
              {currentLevelCfg.name} Superada!
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Você reconheceu todos os {currentLevelCfg.elementCount} elementos com sucesso! O caminho para o
              <strong> Nível {currentLevel + 1}</strong> agora está aberto na montanha.
            </p>

            <div className="flex items-center justify-center gap-6 py-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2">
                <span className="block text-[10px] text-[var(--text-muted)] font-bold uppercase">XP Ganho</span>
                <span className="text-lg font-black text-blue-500">+{levelXp} XP</span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2">
                <span className="block text-[10px] text-[var(--text-muted)] font-bold uppercase">Pontuação</span>
                <span className="text-lg font-black text-amber-500">+{score} pts</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => startLevel(currentLevel + 1)}
                className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-black text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                Subir para o Nível {currentLevel + 1} ({TRAIL_LEVELS[currentLevel]?.elementCount} elementos)
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPhase("lobby")}
                className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text)]"
              >
                Ver Mapa da Trilha
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 5. GRANDE FINAL: CUME DA MONTANHA & BANDEIRA HASTEADA ---------------- */}
        {phase === "summit_victory" && (
          <div className="rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-amber-500/10 via-[var(--surface)] to-[var(--surface)] p-6 sm:p-10 text-center shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400 bg-amber-400/20 px-4 py-1 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              🚩 Cume da Montanha Conquistado · Altitude 3950m
            </div>

            <div className="text-6xl animate-pulse">🏔️🇫🇷🏆</div>

            <h2 className="text-2xl sm:text-4xl font-black text-[var(--text)]">
              Você Subiu a Bandeira no Topo!
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
              Félicitations ! Você completou os <strong>7 níveis da Trilha do Aluno Curioso</strong> no tema{" "}
              <strong>{selectedTheme.label}</strong>, enfrentou a chuva com guarda-chuva, a neve no topo e
              hasteou a bandeira francesa da vitória no cume mais alto da montanha!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto py-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <span className="text-xs text-[var(--text-muted)] font-bold block">Níveis Vencidos</span>
                <span className="text-xl font-black text-emerald-500 block">7 / 7</span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <span className="text-xs text-[var(--text-muted)] font-bold block">XP Total</span>
                <span className="text-xl font-black text-blue-500 block">+{trailProgress.totalXp + levelXp}</span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <span className="text-xs text-[var(--text-muted)] font-bold block">Maior Sequência</span>
                <span className="text-xl font-black text-orange-500 block">{bestStreak} 🔥</span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <span className="text-xs text-[var(--text-muted)] font-bold block">Insígnia</span>
                <span className="text-xl font-black text-amber-500 block">👑 Alpinista</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhase("lobby")}
                className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3 text-sm font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
              >
                <Sparkles className="h-4 w-4" /> Escolher Outro Tema
              </button>
              <button
                type="button"
                onClick={() => startLevel(1)}
                className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text)]"
              >
                <RotateCcw className="h-4 w-4" /> Jogar Trilha Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
