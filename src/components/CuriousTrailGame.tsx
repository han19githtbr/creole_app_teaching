"use client";

import "./CuriousTrailGame.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, ChevronRight, Coins, Play, Trophy, Volume2, VolumeX } from "lucide-react";
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
  loadTrailProgress,
  pickTrailElementsForLevel,
  saveTrailProgress,
  TRAIL_LEVELS,
  TRAIL_THEMES,
  type TrailProgressState,
} from "@/lib/curiousTrailData";
import { CuriousTrailMountain } from "./CuriousTrailMountain";
import {
  TrailAnswerDock,
  TrailCountdownOverlay,
  TrailLevelCompleteOverlay,
  TrailPlayHud,
  TrailSummitOverlay,
} from "./CuriousTrailOverlays";

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
    seconds: 20,
    multiplier: 1.0,
    desc: "20s por elemento · Ideal para iniciantes",
    color: "from-emerald-500 to-green-600",
  },
  intermediate: {
    id: "intermediate",
    label: "Intermediário",
    emoji: "⚡",
    seconds: 15,
    multiplier: 1.5,
    desc: "15s por elemento · Ritmo dinâmico",
    color: "from-amber-500 to-orange-600",
  },
  master: {
    id: "master",
    label: "Master",
    emoji: "🔥",
    seconds: 10,
    multiplier: 2.0,
    desc: "10s por elemento · Desafio ágil",
    color: "from-rose-500 to-red-700",
  },
  native: {
    id: "native",
    label: "Nativo",
    emoji: "👑",
    seconds: 6,
    multiplier: 2.5,
    desc: "6s por elemento · Reflexo de nativo",
    color: "from-violet-600 to-indigo-700",
  },
};

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
}

export function CuriousTrailGame({ items, initialTheme }: CuriousTrailGameProps) {
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
  const [trailProgress, setTrailProgress] = useState<TrailProgressState>(() => loadTrailProgress(selectedThemeId));

  // Recarrega progresso ao trocar de tema
  useEffect(() => {
    setTrailProgress(loadTrailProgress(selectedThemeId));
  }, [selectedThemeId]);

  // Gamificação (XP, títulos e écus em francês)
  const { state: gameState, levelInfo, activeTitle, config: gamifConfig } = useGamification("francais");
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [rewardSummary, setRewardSummary] = useState<{ xp: number; goud: number; badges: Badge[]; level: LevelInfo | null } | null>(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  // Fases: o jogo todo (contagem, perguntas, nível concluído, vitória) acontece em cima do mapa
  const [phase, setPhase] = useState<"lobby" | "countdown" | "playing" | "level_complete" | "summit_victory">("lobby");
  const [difficulty, setDifficulty] = useState<TrailDifficulty>("intermediate");
  const diffCfg = DIFFICULTY_CONFIGS[difficulty];

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const currentLevelCfg = useMemo(
    () => TRAIL_LEVELS.find((l) => l.level === currentLevel) || TRAIL_LEVELS[0],
    [currentLevel]
  );

  // Objetos sorteados para o nível atual (aparecem no mapa, ao longo da trilha)
  const [levelItems, setLevelItems] = useState<CestQuoiItem[]>([]);
  const [elementIndex, setElementIndex] = useState<number>(0);
  const currentItem: CestQuoiItem | undefined = levelItems[elementIndex];
  const [climbDone, setClimbDone] = useState<boolean>(false); // último objeto respondido: aluno sobe até a próxima estação

  // Alternativas do objeto atual
  const [options, setOptions] = useState<string[]>([]);
  const [roundState, setRoundState] = useState<"asking" | "correct" | "retry" | "reveal">("asking");
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const canAnswer = roundState === "asking" || roundState === "retry";

  // Temporizador do objeto
  const [timeLeft, setTimeLeft] = useState<number>(diffCfg.seconds * 1000);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number>(3);

  // Pontuação e bônus de velocidade
  const [score, setScore] = useState<number>(0);
  const [levelXp, setLevelXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [speedBonusText, setSpeedBonusText] = useState<string | null>(null);

  // Espelhos em ref: os setTimeout abaixo disparam depois do render que os criou
  const attemptRef = useRef(1);
  const indexRef = useRef(0);
  const itemsRef = useRef<CestQuoiItem[]>([]);
  const scoreRef = useRef(0);
  const levelXpRef = useRef(0);
  const progressRef = useRef(trailProgress);
  const levelRef = useRef(1);
  const advancedForRef = useRef(-1); // índice do objeto cujo avanço já foi feito (evita avanço duplo)
  indexRef.current = elementIndex;
  itemsRef.current = levelItems;
  progressRef.current = trailProgress;
  levelRef.current = currentLevel;

  // Animação do aluno e da montanha
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

  // Prepara as alternativas para o objeto atual
  useEffect(() => {
    if (!currentItem) return;
    const isHard = difficulty === "master" || difficulty === "native";
    setOptions(buildWordOptions(currentItem, allPool, isHard));
    setRoundState("asking");
    setWrongPicks([]);
    attemptRef.current = 1;
    setTimeLeft(diffCfg.seconds * 1000);
    setTimerRunning(true);
    setSpeedBonusText(null);
  }, [currentItem, elementIndex, allPool, difficulty, diffCfg.seconds]);

  // Cronômetro (corre na 1ª e na 2ª tentativa)
  useEffect(() => {
    if (!timerRunning || !canAnswer) return;
    const t = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 100)), 100);
    return () => clearInterval(t);
  }, [timerRunning, canAnswer]);

  // Tique nos últimos 3 segundos
  useEffect(() => {
    if (timerRunning && canAnswer && timeLeft > 0 && timeLeft <= 3000 && timeLeft % 1000 === 0) {
      soundEffects.playClockTick(true);
    }
  }, [timeLeft, timerRunning, canAnswer]);

  // Vigia: se, depois de acertar/revelar, a tela ficar parada, força o avanço (a trilha nunca trava)
  useEffect(() => {
    if (phase !== "playing" || climbDone) return;
    if (roundState !== "correct" && roundState !== "reveal") return;
    const idx = elementIndex;
    const t = setTimeout(() => {
      if (indexRef.current === idx) advanceElement();
    }, 4500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundState, elementIndex, climbDone]);

  // Tempo esgotado
  useEffect(() => {
    if (timerRunning && canAnswer && timeLeft <= 0) handleTimeUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerRunning, canAnswer]);

  function handleTimeUp() {
    soundEffects.playTimeUp();
    if (attemptRef.current === 1) {
      attemptRef.current = 2;
      setRoundState("retry");
      setTimeLeft(Math.max(4000, Math.round((diffCfg.seconds * 1000) / 2)));
    } else {
      setTimerRunning(false);
      setRoundState("reveal");
      setTimeout(advanceElement, 3000);
      try {
        if (currentItem) speakWordFrench(currentItem.speak);
      } catch {
        /* sem áudio, sem problema */
      }
    }
  }

  // Iniciar um nível
  function startLevel(lvl: number) {
    soundEffects.playRoundStart();
    setCurrentLevel(lvl);
    levelRef.current = lvl;
    const itemsForThisLevel = pickTrailElementsForLevel(lvl, selectedThemeId, allPool);
    setLevelItems(itemsForThisLevel);
    itemsRef.current = itemsForThisLevel;
    setElementIndex(0);
    indexRef.current = 0;
    advancedForRef.current = -1;
    setClimbDone(false);
    setIsCheering(false);
    setLevelXp(0);
    levelXpRef.current = 0;
    setIsRaisingFlag(false);
    setFlagProgress(0);
    setTimerRunning(false);
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

  // Próximo objeto (o aluno caminha pela trilha) ou fim do nível (sobe até a próxima estação)
  function advanceElement() {
    // idempotente: o timer normal e o "vigia" podem chamar; só o primeiro vale
    if (advancedForRef.current === indexRef.current) return;
    advancedForRef.current = indexRef.current;
    const nextIdx = indexRef.current + 1;
    if (nextIdx < itemsRef.current.length) {
      setElementIndex(nextIdx);
    } else {
      setTimerRunning(false);
      setClimbDone(true);
      setTimeout(completeLevel, 1400);
    }
  }

  // Conclusão com sucesso do nível da trilha
  function completeLevel() {
    setTimerRunning(false);
    setIsCheering(true);

    const lvl = levelRef.current;
    const progress = progressRef.current;
    const isLastLevel = lvl === 7;
    const nextUnlocked = Math.max(progress.unlockedLevel, Math.min(7, lvl + 1));
    const nextCompleted = Array.from(new Set([...progress.completedLevels, lvl]));
    const newProgress: TrailProgressState = {
      ...progress,
      unlockedLevel: nextUnlocked,
      completedLevels: nextCompleted,
      totalXp: progress.totalXp + levelXpRef.current,
      highScores: {
        ...progress.highScores,
        [lvl]: Math.max(progress.highScores[lvl] || 0, scoreRef.current),
      },
      stars: {
        ...progress.stars,
        [lvl]: Math.max(progress.stars[lvl] || 0, attemptRef.current === 1 ? 3 : 2),
      },
    };

    saveTrailProgress(selectedThemeId, newProgress);
    setTrailProgress(newProgress);

    if (isLastLevel) {
      // Bandeira sobe no cume da montanha
      setIsRaisingFlag(true);
      soundEffects.playVictoryFanfare();
      setConfetti(true);
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
    if (!canAnswer || !currentItem) return;

    if (chosenFr === currentItem.fr) {
      // ACERTO!
      setTimerRunning(false);
      setRoundState("correct");
      // O avanço é agendado ANTES de qualquer outra coisa: som, pontos, recompensa ou fala não podem travar a trilha
      setTimeout(advanceElement, 1700);
      try {
        soundEffects.playSuccess();
      } catch {
        /* sem áudio, sem problema */
      }

      // Bônus de velocidade
      const totalMs = diffCfg.seconds * 1000;
      const speedRatio = timeLeft / totalMs;
      let speedMultiplier = 1.0;
      let bonusLabel = "";
      if (speedRatio >= 0.65) {
        speedMultiplier = 1.5;
        bonusLabel = "⚡ Relâmpago! +50% XP";
      } else if (speedRatio >= 0.35) {
        speedMultiplier = 1.25;
        bonusLabel = "🚀 Ágil! +25% XP";
      } else {
        speedMultiplier = 1.1;
        bonusLabel = "✨ Muito bem! +10% XP";
      }
      setSpeedBonusText(bonusLabel);

      const baseElementXp = Math.round((currentLevelCfg.xpBase / currentLevelCfg.elementCount) * diffCfg.multiplier * speedMultiplier);
      const pointsGain = Math.round(100 * diffCfg.multiplier * speedMultiplier);

      scoreRef.current += pointsGain;
      levelXpRef.current += baseElementXp;
      setScore((s) => s + pointsGain);
      setLevelXp((x) => x + baseElementXp);

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      try {
        if (nextStreak % 3 === 0) soundEffects.playStreak(nextStreak);
      } catch {
        /* sem áudio, sem problema */
      }

      try {
        // Gamificação central
        const reward = recordQuizWin({
          language: "francais",
          sceneId: currentItem.id,
          theme: currentItem.themeId,
          wordsCount: 1,
          attemptsLeft: attemptRef.current === 1 ? 3 : 2,
          streak: nextStreak,
        });
        if (reward.newBadges.length > 0 || reward.leveledUp) {
          setRewardSummary({
            xp: reward.gainedXp,
            goud: reward.gainedGoud,
            badges: reward.newBadges,
            level: reward.leveledUp ? reward.newLevel : null,
          });
          setRewardModalOpen(true);
        }
      } catch (err) {
        console.warn("Falha ao registrar recompensa (a trilha continua):", err);
      }

      // Pronúncia francesa (o aluno já segue caminhando até o próximo ponto)
      try {
        speakWordFrench(currentItem.speak);
      } catch {
        /* sem áudio, sem problema */
      }
    } else {
      // ERRO
      soundEffects.playError();
      setStreak(0);
      setWrongPicks((w) => [...w, chosenFr]);

      if (attemptRef.current === 1) {
        attemptRef.current = 2;
        setRoundState("retry");
        setTimeLeft(Math.max(4000, Math.round((diffCfg.seconds * 1000) / 2)));
      } else {
        setRoundState("reveal");
        setTimerRunning(false);
        setTimeout(advanceElement, 3200);
        try {
          speakWordFrench(currentItem.speak);
        } catch {
          /* sem áudio, sem problema */
        }
      }
    }
  }

  // ---------------- o que aparece SOBRE o mapa em cada fase ----------------
  const inLobby = phase === "lobby";
  let overlay: React.ReactNode = null;
  if (phase === "countdown") {
    overlay = (
      <TrailCountdownOverlay
        num={countdownNum}
        badge={currentLevelCfg.badgeEmoji}
        levelLabel={`Nível ${currentLevel} · ${currentLevelCfg.name} (${currentLevelCfg.altitude}m)`}
        description={currentLevelCfg.description}
        count={currentLevelCfg.elementCount}
      />
    );
  } else if (phase === "playing" && currentItem && !climbDone) {
    overlay = (
      <TrailAnswerDock
        options={options}
        correct={currentItem.fr}
        roundState={roundState}
        wrongPicks={wrongPicks}
        timeLeft={timeLeft}
        totalMs={roundState === "retry" ? Math.max(4000, Math.round((diffCfg.seconds * 1000) / 2)) : diffCfg.seconds * 1000}
        bonusText={speedBonusText}
        onPick={handleSelectOption}
      />
    );
  } else if (phase === "level_complete") {
    overlay = (
      <TrailLevelCompleteOverlay
        level={currentLevel}
        name={currentLevelCfg.name}
        xp={levelXp}
        score={score}
        nextCount={TRAIL_LEVELS[currentLevel]?.elementCount}
        onNext={() => startLevel(currentLevel + 1)}
        onMap={() => setPhase("lobby")}
      />
    );
  } else if (phase === "summit_victory") {
    overlay = (
      <TrailSummitOverlay
        theme={selectedTheme.label}
        totalXp={trailProgress.totalXp}
        bestStreak={bestStreak}
        onOtherTheme={() => setPhase("lobby")}
        onReplay={() => startLevel(1)}
      />
    );
  }

  return (
    <div className="cq2-bg min-h-[calc(100vh-4rem)] pb-12">
      <Confetti active={confetti} onComplete={() => setConfetti(false)} />
      <AchievementsModal language="francais" isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
      {rewardSummary && (
        <RewardUnlockModal
          language="francais"
          isOpen={rewardModalOpen}
          onClose={() => setRewardModalOpen(false)}
          badge={rewardSummary.level ? null : rewardSummary.badges[0] ?? null}
          level={rewardSummary.level ?? null}
          xpGained={rewardSummary.xp}
          goudGained={rewardSummary.goud}
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

          <button
            type="button"
            onClick={toggleSound}
            className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-secondary)] shadow-sm hover:text-[var(--text)]"
            aria-label={muted ? "Ativar som" : "Silenciar"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* ---------------- LOBBY: gamificação, dificuldade e tema ---------------- */}
        {inLobby && (
          <>
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

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                🏔️ Sentier de l&apos;Élève Curieux · 7 Níveis
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text)]">Trilha do Aluno Curioso</h1>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                Tudo acontece no mapa: o aluno sobe a trilha, os objetos do tema aparecem pelo caminho e, a cada acerto,
                ele avança. Enfrente a <strong>chuva</strong>, a <strong>neve no cume</strong> e <strong>hasteie a bandeira</strong> no Nível 7!
              </p>

              {/* DIFICULDADE */}
              <div className="mt-5 max-w-lg mx-auto">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Ritmo e Dificuldade da Escalada</p>
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
                        <span className="text-[10px] text-[var(--text-muted)] font-semibold block">
                          {cfg.seconds}s · x{cfg.multiplier}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TEMA */}
              <div className="mt-6 text-left">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                    Escolha o Tema da Trilha ({TRAIL_THEMES.length} temas)
                  </span>
                  <span className="text-xs font-bold text-amber-500">
                    {selectedTheme.emoji} {selectedTheme.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {TRAIL_THEMES.map((thm) => {
                    const isSel = selectedThemeId === thm.id;
                    const doneCount = loadTrailProgress(thm.id).completedLevels.length;
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

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <h2 className="text-sm sm:text-base font-black text-[var(--text)]">Mapa da Montanha · Tema {selectedTheme.label}</h2>
              </div>
              <span className="text-xs font-bold text-amber-500">{trailProgress.unlockedLevel}/7 Estações Desbloqueadas</span>
            </div>
          </>
        )}

        {/* ---------------- O MAPA: único palco do jogo (mesma instância em todas as fases) ---------------- */}
        <CuriousTrailMountain
          key="trail-map"
          currentLevel={inLobby ? trailProgress.unlockedLevel : currentLevel}
          unlockedLevel={trailProgress.unlockedLevel}
          completedLevels={trailProgress.completedLevels}
          onSelectLevel={inLobby ? (lvl) => startLevel(lvl) : undefined}
          elements={inLobby ? undefined : levelItems}
          elementIndex={elementIndex}
          roundState={roundState}
          levelFinished={climbDone || phase === "level_complete" || phase === "summit_victory"}
          isCheering={isCheering}
          isRaisingFlag={isRaisingFlag}
          flagProgress={flagProgress}
          activeAnimalGreeting={activeAnimalGreeting}
          onAnimalClick={(animalId, quote) => {
            speakWordFrench(quote);
            setActiveAnimalGreeting(animalId);
          }}
          onSpeak={speakWordFrench}
          themeColor={selectedTheme.accentColor}
          hudRight={
            phase === "playing" && currentItem ? (
              <TrailPlayHud timeLeft={timeLeft} totalMs={diffCfg.seconds * 1000} score={score} streak={streak} index={elementIndex} total={levelItems.length} />
            ) : undefined
          }
        >
          {overlay}
        </CuriousTrailMountain>

        {inLobby && (
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
        )}
      </div>
    </div>
  );
}
