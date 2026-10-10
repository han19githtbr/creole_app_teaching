"use client";

import "./CestQuoiGame.css";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, Award, Check, Coins, Flame, Heart, Lock, RotateCcw, Trophy, Volume2, VolumeX, X } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";
import { Confetti } from "@/components/Confetti";
import { CestQuoiStickman, type StickmanMood } from "@/components/CestQuoiStickman";
import { cn } from "@/lib/utils";
import { recordQuizWin, type Badge, type LevelInfo } from "@/lib/gamification";
import { useGamification } from "@/hooks/useGamification";
import { AchievementsModal } from "@/components/AchievementsModal";
import { RewardUnlockModal } from "@/components/RewardUnlockModal";

export interface CestQuoiItem {
  id: string;
  themeId: string;
  theme: string;
  fr: string; // "Un fouet"
  article: string;
  name: string;
  speak: string;
  scene: string;
  w: number;
  h: number;
  arrow: { x: number; y: number };
}

// ---------------------------------------------------------------------------
// Configuração do jogo
// ---------------------------------------------------------------------------
export type Level = "easy" | "intermediate" | "master";

const LEVEL_ORDER: Level[] = ["easy", "intermediate", "master"];

const LEVELS: Record<
  Level,
  { label: string; emoji: string; seconds: number; multiplier: number; desc: string; grad: string; ring: string; text: string }
> = {
  easy: { label: "Fácil", emoji: "🌱", seconds: 15, multiplier: 1, desc: "15 segundos por palavra", grad: "from-emerald-400 to-green-600", ring: "ring-emerald-400", text: "text-emerald-600" },
  intermediate: { label: "Intermediário", emoji: "⚡", seconds: 10, multiplier: 1.5, desc: "10 segundos por palavra", grad: "from-amber-400 to-orange-500", ring: "ring-amber-400", text: "text-amber-600" },
  master: { label: "Master", emoji: "🔥", seconds: 5, multiplier: 2, desc: "5 segundos por palavra", grad: "from-rose-500 to-red-700", ring: "ring-rose-500", text: "text-rose-600" },
};

const MAX_ATTEMPTS = 2; // 1ª tentativa + mais uma
const ROUNDS_PER_GAME = 10;
const PASS_RATIO = 0.7; // 7 de 10 acertos para passar de nível

type Phase = "intro" | "countdown" | "playing" | "done";
type RoundState = "asking" | "correct" | "retry" | "reveal";
type RoundResult = "hit" | "miss" | null;

// ---------------------------------------------------------------------------
// Progresso dos níveis (salvo neste navegador) — cada nível bloqueia o próximo
// ---------------------------------------------------------------------------
interface Progress {
  passed: Level[];
  best: Partial<Record<Level, number>>;
}
const PROGRESS_KEY = "cquoi:progress:v1";
const SEEN_KEY = "cquoi:seen:v1";
const EMPTY_PROGRESS: Progress = { passed: [], best: {} };

const progressListeners = new Set<() => void>();
function subscribeProgress(cb: () => void) {
  progressListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    progressListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function readProgressRaw(): string {
  try {
    return window.localStorage.getItem(PROGRESS_KEY) ?? "";
  } catch {
    return "";
  }
}
function parseProgress(raw: string): Progress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const p = JSON.parse(raw) as Partial<Progress>;
    return {
      passed: Array.isArray(p.passed) ? p.passed.filter((l): l is Level => LEVEL_ORDER.includes(l as Level)) : [],
      best: p.best && typeof p.best === "object" ? p.best : {},
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}
function writeProgress(p: Progress) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    // sem armazenamento: o progresso vale só até fechar a página
  }
  progressListeners.forEach((fn) => fn());
}
/** Fácil sempre liberado; Intermediário exige passar no Fácil; Master exige passar no Intermediário. */
function isUnlocked(level: Level, progress: Progress): boolean {
  const idx = LEVEL_ORDER.indexOf(level);
  return idx === 0 || progress.passed.includes(LEVEL_ORDER[idx - 1]);
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Sorteia as imagens da partida dando preferência às que o jogador ainda não viu (mais variedade). */
function pickRounds(pool: CestQuoiItem[], count: number): CestQuoiItem[] {
  let seen = new Set<string>();
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    if (raw) seen = new Set(JSON.parse(raw) as string[]);
  } catch {
    // ignora
  }
  const fresh = shuffle(pool.filter((i) => !seen.has(i.id)));
  let list = fresh.slice(0, count);
  if (list.length < count) {
    // acabaram as inéditas: completa com as já vistas e recomeça o ciclo
    const chosen = new Set(list.map((i) => i.id));
    const extra = shuffle(pool.filter((i) => !chosen.has(i.id))).slice(0, count - list.length);
    list = [...list, ...extra];
    seen = new Set(list.map((i) => i.id));
  } else {
    list.forEach((i) => seen.add(i.id));
  }
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {
    // ignora
  }
  return shuffle(list);
}

// ---------- pré-carregamento das imagens (evita imagem em branco / demorada no meio da partida) ----------
/** Baixa a imagem antes de usá-la. Tenta de novo uma vez; se o servidor só estiver lento, segue após 8 s. */
function preloadImage(src: string, retry = 1): Promise<boolean> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(true), 8000);
    const finish = (ok: boolean) => {
      clearTimeout(timeout);
      resolve(ok);
    };
    const img = new Image();
    img.onload = () => finish(true);
    img.onerror = () => {
      if (retry > 0) setTimeout(() => preloadImage(src, retry - 1).then(finish), 400);
      else finish(false);
    };
    img.src = src;
  });
}

/** Carrega todas as imagens da partida; se alguma não existir/falhar, troca por outra do mesmo conjunto. */
async function loadRounds(list: CestQuoiItem[], pool: CestQuoiItem[]): Promise<CestQuoiItem[]> {
  const ok = await Promise.all(list.map((i) => preloadImage(i.scene)));
  const good = list.filter((_, k) => ok[k]);
  if (good.length === list.length) return list;
  const used = new Set(list.map((i) => i.id));
  for (const spare of shuffle(pool.filter((i) => !used.has(i.id)))) {
    if (good.length >= list.length) break;
    if (await preloadImage(spare.scene)) good.push(spare);
  }
  return shuffle(good);
}

/** 4 alternativas: 2 do mesmo tema (quando houver) + as demais de outros temas. */
function buildOptions(item: CestQuoiItem, pool: CestQuoiItem[]): string[] {
  const others = pool.filter((o) => o.id !== item.id && o.fr !== item.fr);
  const same = shuffle(others.filter((o) => o.themeId === item.themeId));
  const rest = shuffle(others.filter((o) => o.themeId !== item.themeId));
  const picked: string[] = [];
  for (const o of [...same.slice(0, 2), ...rest, ...same.slice(2)]) {
    if (picked.length >= 3) break;
    if (!picked.includes(o.fr)) picked.push(o.fr);
  }
  return shuffle([item.fr, ...picked]);
}

// ---------- pronúncia (Web Speech API em francês) ----------
let cachedVoice: SpeechSynthesisVoice | null = null;
function pickFrenchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang.toLowerCase() === "fr-fr" && /google|thomas|amelie|audrey|marie|natural/i.test(v.name)) ??
    voices.find((v) => v.lang.toLowerCase() === "fr-fr") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("fr")) ??
    null;
  return cachedVoice;
}
function speakFrench(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || soundEffects.isMuted()) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    const voice = pickFrenchVoice();
    if (voice) utter.voice = voice;
    utter.rate = 0.82;
    utter.pitch = 1;
    utter.volume = Math.max(0.2, soundEffects.getVolume());
    window.speechSynthesis.speak(utter);
  } catch {
    // sem áudio de pronúncia neste navegador
  }
}
function cancelSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

// ---------- seta vermelha: cai sobre o objeto e depois balança ----------
const ARROW_PATH = "M-104 -12 L-44 -12 L-50 -29 L0 0 L-50 29 L-44 12 L-104 12 Z";
function SceneArrow({ item }: { item: CestQuoiItem }) {
  return (
    <svg viewBox={`0 0 ${item.w} ${item.h}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <g className="cq-sway">
        <g className="cq2-arrow-drop">
          <g transform={`translate(${item.arrow.x} ${item.arrow.y}) rotate(25)`}>
            <path d={ARROW_PATH} fill="#e60012" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
            <path d={ARROW_PATH} fill="#e60012" stroke="#e60012" strokeWidth="1" strokeLinejoin="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}

// ---------- relógio com contagem regressiva (tempo depende do nível) ----------
function CountdownClock({ left, total, running }: { left: number; total: number; running: boolean }) {
  const frac = Math.min(1, Math.max(0, left / total));
  const elapsed = 1 - frac;
  const urgent = running && frac <= 0.33;
  const ring = frac <= 0.33 ? "#dc2626" : frac <= 0.6 ? "#f59e0b" : "#2c58c9";
  const C = 2 * Math.PI * 56;
  return (
    <div className={cn("relative h-[72px] w-[72px] sm:h-[84px] sm:w-[84px]", urgent && "cq-clock-urgent")}>
      <svg viewBox="0 0 140 140" className="h-full w-full drop-shadow">
        <circle cx="70" cy="70" r="64" fill="#fff" stroke={ring} strokeWidth="10" style={{ transition: "stroke .3s" }} />
        <circle cx="70" cy="70" r="56" fill="none" stroke={ring} strokeOpacity=".18" strokeWidth="6" />
        <circle cx="70" cy="70" r="56" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * elapsed} transform="rotate(-90 70 70)" />
        {[0, 90, 180, 270].map((a) => (
          <line key={a} x1="70" y1="17" x2="70" y2="27" stroke={ring} strokeWidth="4" strokeLinecap="round" transform={`rotate(${a} 70 70)`} />
        ))}
        <line x1="70" y1="70" x2="70" y2="26" stroke="#222" strokeWidth="5" strokeLinecap="round" transform={`rotate(${elapsed * 360} 70 70)`} />
        <circle cx="70" cy="70" r="6" fill="#222" />
      </svg>
      <span
        className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-extrabold text-white shadow"
        style={{ background: ring, transition: "background .3s" }}
      >
        {Math.ceil(left / 1000)}
      </span>
    </div>
  );
}

// fagulhas que saem da cena quando o jogador acerta
const SPARKS = [
  { e: "✨", dx: -120, dy: -70 }, { e: "⭐", dx: 110, dy: -80 }, { e: "✨", dx: -60, dy: -110 }, { e: "🎉", dx: 70, dy: -105 },
  { e: "⭐", dx: -140, dy: 10 }, { e: "✨", dx: 140, dy: 20 }, { e: "🎊", dx: -90, dy: 70 }, { e: "✨", dx: 95, dy: 75 },
];

// ===========================================================================
export function CestQuoiGame({ items, initialTheme }: { items: CestQuoiItem[]; initialTheme?: string }) {
  const themes = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((i) => map.set(i.themeId, i.theme));
    return [...map.entries()].map(([id, label]) => ({ id, label }));
  }, [items]);

  // Progresso de gamificação do FRANCÊS (XP, écus, conquistas e títulos em francês)
  const { state: gameState, levelInfo, activeTitle, config: gamifConfig } = useGamification("francais");
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [rewardSummary, setRewardSummary] = useState<{ xp: number; goud: number; badges: Badge[]; level: LevelInfo | null } | null>(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const rewardRef = useRef<{ xp: number; goud: number; badges: Badge[]; level: LevelInfo | null }>({ xp: 0, goud: 0, badges: [], level: null });

  const progressRaw = useSyncExternalStore(subscribeProgress, readProgressRaw, () => "");
  const progress = useMemo(() => parseProgress(progressRaw), [progressRaw]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [level, setLevel] = useState<Level>("easy");
  const [themeId, setThemeId] = useState<string>(initialTheme && themes.some((t) => t.id === initialTheme) ? initialTheme : "all");
  const [rounds, setRounds] = useState<CestQuoiItem[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [roundState, setRoundState] = useState<RoundState>("asking");
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [passed, setPassed] = useState(false);
  const [unlockedNow, setUnlockedNow] = useState<Level | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [confetti, setConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
  const [floater, setFloater] = useState<{ key: number; text: string } | null>(null);
  const [message, setMessage] = useState("");
  const [lockedShake, setLockedShake] = useState<Level | null>(null);
  const [loadingImgs, setLoadingImgs] = useState(false);
  const [muted, setMuted] = useState(() => soundEffects.isMuted());

  // valores "vivos" usados dentro de timers (evitam closures desatualizadas)
  const levelRef = useRef<Level>("easy");
  const roundsRef = useRef<CestQuoiItem[]>([]);
  const indexRef = useRef(0);
  const attemptRef = useRef(1);
  const streakRef = useRef(0);
  const hitsRef = useRef(0);
  const scoreRef = useRef(0);
  const bestStreakRef = useRef(0);
  const floaterKey = useRef(0);
  const deadlineRef = useRef(0);
  const lastSecRef = useRef(-1);
  const answeredRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pickRef = useRef<(option: string) => void>(() => {});
  const startToken = useRef(0);

  const item = rounds[index];
  const levelCfg = LEVELS[level];
  const totalMs = levelCfg.seconds * 1000;
  const running = phase === "playing" && roundState === "asking";
  const need = Math.max(1, Math.ceil(rounds.length * PASS_RATIO));

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(
    () => () => {
      clearTimers();
      cancelSpeech();
    },
    [clearTimers]
  );

  // as vozes do navegador carregam de forma assíncrona
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const refresh = () => {
      cachedVoice = null;
      pickFrenchVoice();
    };
    refresh();
    window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
  }, []);

  const startAttempt = useCallback(() => {
    const ms = LEVELS[levelRef.current].seconds * 1000;
    deadlineRef.current = Date.now() + ms;
    lastSecRef.current = -1;
    answeredRef.current = false;
    setTimeLeft(ms);
    setRoundState("asking");
  }, []);

  const prepareRound = useCallback(
    (list: CestQuoiItem[], i: number) => {
      setOptions(buildOptions(list[i], items));
      setWrongPicks([]);
      attemptRef.current = 1;
      setAttempt(1);
      setMessage("");
      setConfetti(false);
      setFlash(null);
      soundEffects.playRoundStart();
      startAttempt();
    },
    [items, startAttempt]
  );

  // ---------- fim da partida: calcula se passou e libera o próximo nível ----------
  const finishGame = useCallback(() => {
    const total = roundsRef.current.length;
    const lv = levelRef.current;
    const ok = hitsRef.current >= Math.max(1, Math.ceil(total * PASS_RATIO));
    const prev = parseProgress(readProgressRaw());
    const next: Progress = {
      passed: ok && !prev.passed.includes(lv) ? [...prev.passed, lv] : prev.passed,
      best: { ...prev.best, [lv]: Math.max(prev.best[lv] ?? 0, scoreRef.current) },
    };
    const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(lv) + 1];
    setUnlockedNow(ok && nextLevel && !prev.passed.includes(lv) ? nextLevel : null);
    writeProgress(next);
    const earned = rewardRef.current;
    if (earned.xp > 0 || earned.goud > 0) {
      setRewardSummary({ ...earned, badges: [...earned.badges] });
      setRewardModalOpen(Boolean(earned.level) || earned.badges.length > 0);
    }
    setPassed(ok);
    setConfetti(ok);
    setPhase("done");
    if (ok) soundEffects.playPerfectRound();
    else soundEffects.playError();
  }, []);

  const goNext = useCallback(() => {
    clearTimers();
    cancelSpeech();
    const next = indexRef.current + 1;
    if (next >= roundsRef.current.length) {
      finishGame();
      return;
    }
    indexRef.current = next;
    setIndex(next);
    prepareRound(roundsRef.current, next);
  }, [clearTimers, finishGame, prepareRound]);

  // ---------- erro (opção errada ou tempo esgotado) ----------
  const registerMiss = useCallback(
    (picked: string | null) => {
      const current = roundsRef.current[indexRef.current];
      if (answeredRef.current || !current) return;
      answeredRef.current = true;
      streakRef.current = 0;
      setStreak(0);
      if (picked) setWrongPicks((w) => [...w, picked]);
      setShake(true);
      setFlash("red");
      later(() => setShake(false), 500);
      later(() => setFlash(null), 650);

      if (picked === null) soundEffects.playTimeUp();
      else soundEffects.playError();

      if (attemptRef.current < MAX_ATTEMPTS) {
        setRoundState("retry");
        setMessage(picked === null ? "Tempo esgotado! Mais uma chance." : "Ainda não! Mais uma chance.");
        later(() => {
          attemptRef.current += 1;
          setAttempt(attemptRef.current);
          setMessage("");
          startAttempt();
        }, 1500);
      } else {
        setRoundState("reveal");
        setResults((r) => r.map((v, i) => (i === indexRef.current ? "miss" : v)));
        setMessage("Veja a resposta certa!");
        later(() => speakFrench(current.speak), 500);
        later(goNext, 4200);
      }
    },
    [later, startAttempt, goNext]
  );

  // ---------- acerto ----------
  const pick = useCallback(
    (option: string) => {
      const current = roundsRef.current[indexRef.current];
      if (!current || answeredRef.current) return;
      if (option !== current.fr) {
        registerMiss(option);
        return;
      }
      answeredRef.current = true;
      const lv = levelRef.current;
      const msLeft = Math.max(0, deadlineRef.current - Date.now());
      const frac = msLeft / (LEVELS[lv].seconds * 1000);
      const nextStreak = streakRef.current + 1;
      const base = attemptRef.current === 1 ? 10 : 6;
      const timeBonus = Math.round(frac * 10);
      const comboBonus = nextStreak > 1 ? Math.min(nextStreak * 2, 10) : 0;
      const points = Math.round((base + timeBonus + comboBonus) * LEVELS[lv].multiplier);

      streakRef.current = nextStreak;
      hitsRef.current += 1;
      scoreRef.current += points;
      bestStreakRef.current = Math.max(bestStreakRef.current, nextStreak);

      // Recompensa de gamificação (somente no progresso do Français)
      const reward = recordQuizWin({
        language: "francais",
        sceneId: current.id,
        theme: current.themeId,
        wordsCount: 1,
        attemptsLeft: attemptRef.current === 1 ? 3 : 2,
        streak: nextStreak,
      });
      rewardRef.current = {
        xp: rewardRef.current.xp + reward.gainedXp + reward.newBadges.reduce((n, b) => n + b.xpReward, 0),
        goud: rewardRef.current.goud + reward.gainedGoud + reward.newBadges.reduce((n, b) => n + b.goudReward, 0),
        badges: [...rewardRef.current.badges, ...reward.newBadges],
        level: reward.leveledUp ? reward.newLevel : rewardRef.current.level,
      };

      setRoundState("correct");
      setScore(scoreRef.current);
      setHits(hitsRef.current);
      setStreak(nextStreak);
      setBestStreak(bestStreakRef.current);
      setResults((r) => r.map((v, i) => (i === indexRef.current ? "hit" : v)));
      setMessage(attemptRef.current === 1 ? "Parfait ! 🎉" : "Très bien ! Na segunda tentativa 👏");
      setConfetti(true);
      setFlash("green");
      later(() => setFlash(null), 750);
      floaterKey.current += 1;
      setFloater({ key: floaterKey.current, text: `+${points}` });
      later(() => setFloater(null), 1350);
      if (nextStreak > 1) soundEffects.playStreak(nextStreak);
      else soundEffects.playSuccess();
      later(() => speakFrench(current.speak), 350);
      later(goNext, 3200);
    },
    [later, goNext, registerMiss]
  );

  // mantém a versão mais recente do "pick" para o atalho de teclado
  useEffect(() => {
    pickRef.current = pick;
  }, [pick]);

  // ---------- atalhos 1-4 ----------
  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= options.length) {
        const opt = options[n - 1];
        if (!wrongPicks.includes(opt)) pickRef.current(opt);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, options, wrongPicks]);

  // ---------- relógio com tique-taque ----------
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, deadlineRef.current - Date.now());
      setTimeLeft(left);
      const sec = Math.ceil(left / 1000);
      // tique-taque nos últimos 5 segundos de cada tentativa
      if (left > 0 && sec !== lastSecRef.current) {
        lastSecRef.current = sec;
        if (sec <= 5) soundEffects.playClockTick(sec <= 2);
      }
      if (left <= 0) {
        clearInterval(id);
        registerMiss(null);
      }
    }, 80);
    return () => clearInterval(id);
  }, [running, registerMiss, attempt, index]);

  // ---------- início da partida ----------
  const startGame = useCallback(
    (lv: Level) => {
      if (!isUnlocked(lv, parseProgress(readProgressRaw()))) return;
      const pool = themeId === "all" ? items : items.filter((i) => i.themeId === themeId);
      const list = pickRounds(pool, Math.min(ROUNDS_PER_GAME, pool.length));
      clearTimers();
      cancelSpeech();
      levelRef.current = lv;
      roundsRef.current = list;
      indexRef.current = 0;
      attemptRef.current = 1;
      streakRef.current = 0;
      hitsRef.current = 0;
      scoreRef.current = 0;
      bestStreakRef.current = 0;
      rewardRef.current = { xp: 0, goud: 0, badges: [], level: null };
      setRewardSummary(null);
      setRewardModalOpen(false);
      setLevel(lv);
      setRounds(list);
      setResults(list.map(() => null));
      setIndex(0);
      setScore(0);
      setHits(0);
      setStreak(0);
      setBestStreak(0);
      setPassed(false);
      setUnlockedNow(null);
      setConfetti(false);
      setFloater(null);
      setMessage("");
      setRoundState("asking");
      setCountdown(3);
      setLoadingImgs(false);
      setPhase("countdown");
      // baixa as imagens da partida durante a contagem (a contagem esconde o tempo de carregamento)
      const token = ++startToken.current;
      const loading = loadRounds(list, pool);
      // 3 ... 2 ... 1 ... Partez !
      later(() => setCountdown(2), 850);
      later(() => setCountdown(1), 1700);
      later(() => setCountdown(0), 2550);
      later(() => {
        setLoadingImgs(true); // só aparece se as imagens ainda não terminaram de carregar
        loading.then((finalList) => {
          if (token !== startToken.current) return;
          roundsRef.current = finalList;
          setRounds(finalList);
          setResults(finalList.map(() => null));
          setLoadingImgs(false);
          setPhase("playing");
          prepareRound(finalList, 0);
        });
      }, 3300);
    },
    [items, themeId, clearTimers, later, prepareRound]
  );

  function toggleSound() {
    const next = soundEffects.toggleMute();
    setMuted(next);
    if (next) cancelSpeech();
  }

  function chooseLevel(lv: Level) {
    if (!isUnlocked(lv, progress)) {
      soundEffects.playError();
      setLockedShake(lv);
      setTimeout(() => setLockedShake(null), 450);
      return;
    }
    soundEffects.playTap();
    setLevel(lv);
  }

  const mood: StickmanMood = roundState === "correct" ? "dance" : roundState === "retry" || roundState === "reveal" ? "sad" : "think";
  const stars = rounds.length ? (hits >= rounds.length - 1 ? 3 : hits >= need + 1 ? 2 : hits >= need ? 1 : 0) : 0;
  const nextAfterCurrent = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1] as Level | undefined;
  const levelsDone = LEVEL_ORDER.every((l) => progress.passed.includes(l));

  // ===================== INTRO =====================
  if (phase === "intro") {
    const selectedUnlocked = isUnlocked(level, progress);
    return (
      <div className="cq2-bg min-h-[calc(100vh-4rem)]">
        <div className="mx-auto w-full max-w-lg space-y-5 px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]">
              <ArrowLeft className="h-4 w-4" /> Painel
            </Link>
            <button type="button" onClick={toggleSound} className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-secondary)]" aria-label={muted ? "Ativar som" : "Silenciar"}>
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          {/* Nível, XP e conquistas em francês */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-2xl">{levelInfo.current.badgeEmoji}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-[var(--text)]">
                    {gamifConfig.levelWord} {levelInfo.current.level} · {levelInfo.current.native}
                  </p>
                  <p className="truncate text-[11px] font-semibold text-[var(--text-muted)]">
                    {activeTitle.icon} {activeTitle.native}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { soundEffects.playTap(); setAchievementsOpen(true); }}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
              >
                <Trophy className="h-4 w-4" /> Conquistas
              </button>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1"><Award className="h-3.5 w-3.5 text-blue-500" /> {gameState.xp} / {levelInfo.current.nextXp} XP</span>
              <span className="inline-flex items-center gap-1"><Coins className="h-3.5 w-3.5 text-amber-500" /> {gameState.goud} {gamifConfig.currency}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-[var(--accent)] transition-all duration-500" style={{ width: `${levelInfo.progressPct}%` }} />
            </div>
          </div>
          <AchievementsModal language="francais" isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-lg">
            <div className="cq2-scene-in mx-auto h-36 w-36"><CestQuoiStickman mood="think" /></div>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--text)]">C&apos;est quoi ? 🇫🇷</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              A seta vermelha aponta para um objeto. Escolha o nome certo em francês antes que o tempo acabe! Você tem{" "}
              <strong>mais uma tentativa</strong> se errar.
            </p>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Escolha o nível</p>
            <div className="mt-2 space-y-2.5 text-left">
              {LEVEL_ORDER.map((lv, i) => {
                const cfg = LEVELS[lv];
                const unlocked = isUnlocked(lv, progress);
                const done = progress.passed.includes(lv);
                const best = progress.best[lv];
                const selected = level === lv && unlocked;
                const isNextGoal = unlocked && !done;
                return (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => chooseLevel(lv)}
                    aria-disabled={!unlocked}
                    className={cn(
                      "relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border-2 border-b-4 p-3 transition-all active:translate-y-[2px] active:border-b-2",
                      unlocked ? "bg-[var(--surface)] hover:bg-[var(--surface-2)]" : "cursor-not-allowed bg-[var(--surface-2)] opacity-70",
                      selected ? `border-transparent ring-2 ${cfg.ring} ring-offset-2 ring-offset-[var(--surface)]` : "border-[var(--border)]",
                      isNextGoal && selected && "cq2-glow",
                      lockedShake === lv && "cq2-lock-shake"
                    )}
                  >
                    <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-inner", unlocked ? cfg.grad : "from-slate-300 to-slate-400 grayscale")}>
                      {unlocked ? cfg.emoji : <Lock className="h-5 w-5 text-white" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[var(--text)]">{cfg.label}</span>
                        {done && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">✔ Concluído</span>}
                      </span>
                      <span className="block text-xs text-[var(--text-secondary)]">
                        {cfg.desc} · pontos x{cfg.multiplier}
                      </span>
                      {unlocked ? (
                        best ? <span className="block text-[11px] font-semibold text-[var(--text-muted)]">Melhor pontuação: {best} pts</span> : null
                      ) : (
                        <span className="block text-[11px] font-semibold text-[var(--text-muted)]">
                          🔒 Passe o nível {LEVELS[LEVEL_ORDER[i - 1]].label} para desbloquear
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 rounded-xl bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-secondary)]">
              Para <strong>passar de nível</strong>, acerte pelo menos <strong>{Math.ceil(ROUNDS_PER_GAME * PASS_RATIO)} de {ROUNDS_PER_GAME}</strong> palavras.
            </p>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Tema</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {[{ id: "all", label: "Todos os temas" }, ...themes].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { soundEffects.playTap(); setThemeId(t.id); }}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all active:scale-95",
                    themeId === t.id ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!selectedUnlocked}
              onClick={() => { soundEffects.playTap(); startGame(level); }}
              className={cn(
                "cq2-shine relative mt-6 w-full cursor-pointer overflow-hidden rounded-2xl border-b-4 bg-gradient-to-r px-4 py-3.5 text-lg font-black text-white shadow-lg transition-transform active:translate-y-[2px] active:border-b-2 disabled:cursor-not-allowed disabled:opacity-50",
                LEVELS[level].grad,
                level === "easy" ? "border-green-800" : level === "intermediate" ? "border-orange-700" : "border-red-900"
              )}
            >
              Jouer ! ▶ {LEVELS[level].emoji} {LEVELS[level].label}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== CONTAGEM 3-2-1 =====================
  if (phase === "countdown") {
    return (
      <div className="cq2-bg flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <p className={cn("text-sm font-extrabold uppercase tracking-widest", levelCfg.text)}>
            {levelCfg.emoji} Nível {levelCfg.label} · {levelCfg.seconds} s por palavra
          </p>
          <div key={countdown} className="cq2-count mt-4 text-[110px] font-black leading-none text-[var(--text)]" aria-live="assertive">
            {countdown > 0 ? countdown : "Partez !"}
          </div>
          {loadingImgs && <p className="mt-2 animate-pulse text-sm font-bold text-[var(--text-secondary)]">Carregando imagens…</p>}
          <div className="mx-auto mt-4 h-32 w-32"><CestQuoiStickman mood={countdown > 0 ? "think" : "dance"} /></div>
        </div>
      </div>
    );
  }

  // ===================== FIM =====================
  if (phase === "done") {
    return (
      <div className="cq2-bg min-h-[calc(100vh-4rem)]">
        <div className="mx-auto w-full max-w-lg px-4 py-6">
          <Confetti active={confetti} onComplete={() => setConfetti(false)} />
          <div className="cq2-scene-in rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-lg">
            <div className="mx-auto h-40 w-40"><CestQuoiStickman mood={passed ? "dance" : "sad"} /></div>
            <p className={cn("text-xs font-extrabold uppercase tracking-widest", levelCfg.text)}>{levelCfg.emoji} Nível {levelCfg.label}</p>
            <h2 className="mt-1 flex items-center justify-center gap-2 text-3xl font-black text-[var(--text)]">
              <Trophy className={cn("h-7 w-7", passed ? "text-amber-500" : "text-slate-400")} />
              {passed ? (levelsDone && level === "master" ? "Vous êtes Master !" : "Bravo !") : "Presque !"}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {passed ? `Você passou o nível ${levelCfg.label}!` : `Você precisa de ${need} acertos para passar. Tente de novo!`}
            </p>
            <p className="mt-2 text-2xl">{[0, 1, 2].map((s) => <span key={s} className={cn("inline-block", s < stars ? "cq2-unlock" : "opacity-25")} style={{ animationDelay: `${0.3 + s * 0.25}s` }}>⭐</span>)}</p>

            {rewardSummary && (
              <div className="cq2-unlock mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-black text-blue-600 dark:text-blue-400">
                  <Award className="h-4 w-4" /> +{rewardSummary.xp} XP
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
                  <Coins className="h-4 w-4" /> +{rewardSummary.goud} {gamifConfig.currency}
                </span>
                <span className="w-full text-center text-[11px] font-semibold text-[var(--text-muted)]">
                  {gamifConfig.levelWord} {levelInfo.current.level} · {levelInfo.current.native}
                  {rewardSummary.badges.length > 0 && ` · ${rewardSummary.badges.map((b) => `${b.emoji} ${b.native}`).join(" · ")}`}
                </span>
              </div>
            )}
            <RewardUnlockModal
              language="francais"
              isOpen={rewardModalOpen}
              onClose={() => setRewardModalOpen(false)}
              badge={rewardSummary?.level ? null : rewardSummary?.badges[0] ?? null}
              level={rewardSummary?.level ?? null}
              xpGained={rewardSummary?.xp}
              goudGained={rewardSummary?.goud}
            />

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Acertos" value={`${hits}/${rounds.length}`} />
              <Stat label="Pontos" value={String(score)} />
              <Stat label="Melhor combo" value={`x${bestStreak}`} />
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)]">
                <span>Meta para passar</span>
                <span>{hits}/{need}</span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div className={cn("h-full rounded-full transition-all duration-1000", passed ? "bg-green-500" : "bg-amber-500")} style={{ width: `${Math.min(100, (hits / need) * 100)}%` }} />
              </div>
            </div>

            {unlockedNow && (
              <div className="cq2-unlock mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-100 px-3 py-3 text-sm font-bold text-green-800 dark:from-emerald-950/40 dark:to-green-950/40 dark:text-green-300">
                🔓 Novo nível desbloqueado: {LEVELS[unlockedNow].emoji} {LEVELS[unlockedNow].label}!
              </div>
            )}
            {passed && !nextAfterCurrent && (
              <div className="cq2-unlock mt-4 rounded-2xl bg-amber-50 px-3 py-3 text-sm font-bold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                🏆 Você concluiu todos os níveis do C&apos;est quoi ?
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
              {passed && nextAfterCurrent && isUnlocked(nextAfterCurrent, progress) && (
                <button
                  type="button"
                  onClick={() => { soundEffects.playTap(); startGame(nextAfterCurrent); }}
                  className={cn("cursor-pointer rounded-2xl border-b-4 bg-gradient-to-r px-4 py-3 text-base font-black text-white shadow-md active:translate-y-[2px] active:border-b-2", LEVELS[nextAfterCurrent].grad, nextAfterCurrent === "intermediate" ? "border-orange-700" : "border-red-900")}
                >
                  Próximo nível: {LEVELS[nextAfterCurrent].emoji} {LEVELS[nextAfterCurrent].label} ▶
                </button>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => { soundEffects.playTap(); startGame(level); }} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 font-bold text-[var(--text)] hover:bg-[var(--surface-2)] active:translate-y-[2px] active:border-b-2">
                  <RotateCcw className="h-4 w-4" /> Jogar de novo
                </button>
                <button type="button" onClick={() => { soundEffects.playTap(); setPhase("intro"); }} className="flex-1 cursor-pointer rounded-2xl border-2 border-b-4 border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] active:translate-y-[2px] active:border-b-2">
                  Níveis e temas
                </button>
              </div>
              <Link href="/dashboard" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text)]">Voltar ao painel</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== JOGO =====================
  if (!item) return null;
  const answered = roundState === "correct" || roundState === "reveal";
  const frac = Math.min(1, Math.max(0, timeLeft / totalMs));
  const barColor = frac <= 0.33 ? "#ef4444" : frac <= 0.6 ? "#f59e0b" : "#22c55e";
  const heartsLeft = MAX_ATTEMPTS - attempt + 1;

  return (
    <div className="cq2-bg min-h-[calc(100vh-4rem)]">
      <div className="mx-auto w-full max-w-md space-y-2.5 px-3 py-3">
        <Confetti active={confetti && roundState === "correct"} onComplete={() => setConfetti(false)} />

        {/* ---------- HUD ---------- */}
        <div className="flex items-center justify-between gap-2 text-sm">
          <Link href="/dashboard" className="inline-flex items-center rounded-lg p-1 text-[var(--text-secondary)] hover:text-[var(--text)]" aria-label="Sair do jogo"><ArrowLeft className="h-5 w-5" /></Link>
          <span className={cn("inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-extrabold text-white shadow", levelCfg.grad)}>
            {levelCfg.emoji} {levelCfg.label}
          </span>
          <span key={score} className="cq2-bump rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-extrabold text-[var(--text)] shadow-sm ring-1 ring-[var(--border)]">{score} pts</span>
          <span key={`s${streak}`} className={cn("cq2-bump inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold shadow-sm", streak > 1 ? "bg-orange-500 text-white" : "bg-[var(--surface)] text-[var(--text-muted)] ring-1 ring-[var(--border)]")}>
            <span className={streak > 1 ? "cq2-flame" : ""}><Flame className="h-3.5 w-3.5" /></span> x{streak}
          </span>
          <span className="inline-flex gap-0.5" aria-label={`Tentativa ${attempt} de ${MAX_ATTEMPTS}`}>
            {Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
              const alive = i < heartsLeft;
              return (
                <span key={`${i}-${alive}`} className={cn(alive ? "cq2-heartbeat" : "cq2-heart-lost")}>
                  <Heart className={cn("h-5 w-5", alive ? "fill-red-500 text-red-500" : "fill-slate-300 text-slate-300")} />
                </span>
              );
            })}
          </span>
          <button type="button" onClick={toggleSound} className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1.5 text-[var(--text-secondary)]" aria-label={muted ? "Ativar som" : "Silenciar"}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* progresso das rodadas */}
        <div className="flex items-center gap-1" aria-label={`Palavra ${index + 1} de ${rounds.length}`}>
          {rounds.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors duration-300",
                results[i] === "hit" ? "bg-green-500" : results[i] === "miss" ? "bg-red-500" : i === index ? "animate-pulse bg-[var(--accent)]" : "bg-[var(--border)]"
              )}
            />
          ))}
        </div>

        {/* barra de tempo */}
        <div className="h-3 overflow-hidden rounded-full bg-[var(--surface)] shadow-inner ring-1 ring-[var(--border)]">
          <div
            className={cn("h-full rounded-full", running && frac <= 0.33 && "cq2-timer-urgent")}
            style={{ width: `${frac * 100}%`, background: barColor, transition: "width 100ms linear, background .3s" }}
          />
        </div>

        {/* ---------- cena + painel do boneco ---------- */}
        <div className={cn("overflow-hidden rounded-3xl border border-[var(--border)] bg-[#f1ece1] shadow-xl", shake && "cq-card-shake")}>
          <div key={item.id} className="cq2-scene-in">
            <div className="relative w-full" style={{ aspectRatio: `${item.w} / ${item.h}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.scene} alt="Objeto indicado pela seta vermelha" className="h-full w-full object-cover" draggable={false} decoding="async" />
              <SceneArrow item={item} />
              <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">{item.theme}</span>
              <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">{index + 1} / {rounds.length}</span>

              {flash && <div key={flash + roundState + attempt} className={cn("pointer-events-none absolute inset-0", flash === "green" ? "cq2-flash-green" : "cq2-flash-red")} />}
              {roundState === "correct" && (
                <div key={item.id + "sp"} className="pointer-events-none absolute inset-0">
                  {SPARKS.map((s, i) => (
                    <span key={i} className="cq2-spark" style={{ ["--dx" as string]: `${s.dx}px`, ["--dy" as string]: `${s.dy}px`, animationDelay: `${i * 30}ms` }}>{s.e}</span>
                  ))}
                </div>
              )}
              {floater && (
                <div key={floater.key} className="cq2-float pointer-events-none absolute inset-x-0 top-1/3 text-center text-5xl font-black text-white" style={{ textShadow: "0 3px 0 #16a34a, 0 0 18px rgba(34,197,94,.9)" }}>
                  {floater.text}
                </div>
              )}
            </div>
          </div>

          {/* painel bege: relógio · boneco · balão de fala */}
          <div className="relative grid grid-cols-[88px_1fr_1fr] items-center gap-1 bg-[#f1ece1] px-2 pb-2 pt-2" style={{ minHeight: 190 }}>
            <div className="self-start"><CountdownClock left={timeLeft} total={totalMs} running={running} /></div>
            <div className="h-[170px]"><CestQuoiStickman mood={mood} compact /></div>
            <div className="flex min-h-[90px] items-center">
              <div
                key={roundState + (answered ? item.id : "")}
                className="cq2-bubble relative w-full rounded-2xl bg-white px-3 py-2 text-center shadow-md ring-1 ring-black/5"
              >
                <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 bg-white ring-1 ring-black/5" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                {answered ? (
                  <span className="relative inline-flex flex-wrap items-center justify-center gap-1.5 text-base font-black leading-tight text-black">
                    <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-white", roundState === "correct" ? "bg-green-600" : "bg-red-500")}>
                      {roundState === "correct" ? <Check className="h-4 w-4" strokeWidth={4} /> : <X className="h-4 w-4" strokeWidth={4} />}
                    </span>
                    {item.fr}.
                  </span>
                ) : (
                  <span className="relative text-lg font-black text-[#333]">C&apos;est quoi ?</span>
                )}
                {message && <p className="relative mt-1 text-[11px] font-bold leading-snug text-[#555]" role="status">{message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- alternativas ---------- */}
        <div className="grid grid-cols-2 gap-2.5">
          {options.map((opt, i) => {
            const isWrong = wrongPicks.includes(opt);
            const isRight = answered && opt === item.fr;
            return (
              <button
                key={`${item.id}-${attempt}-${opt}`}
                type="button"
                disabled={roundState !== "asking" || isWrong}
                onClick={() => pick(opt)}
                style={{ animationDelay: `${i * 70}ms` }}
                className={cn(
                  "cq2-opt-in relative min-h-[58px] cursor-pointer rounded-2xl border-2 border-b-4 px-3 py-2 text-sm font-extrabold transition-colors",
                  isRight
                    ? "cq2-opt-correct border-green-700 bg-green-500 text-white"
                    : isWrong
                    ? "cq2-opt-wrong border-red-400 bg-red-100 text-red-500 line-through dark:bg-red-950/40"
                    : "border-[var(--border)] border-b-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)] active:translate-y-[2px] active:border-b-2",
                  roundState !== "asking" && !isRight && !isWrong && "opacity-45"
                )}
              >
                <span className="absolute left-2 top-1 text-[10px] font-bold opacity-40">{i + 1}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="cq2-opt-in flex gap-2">
            <button type="button" onClick={() => speakFrench(item.speak)} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text)] hover:bg-[var(--surface-2)] active:translate-y-[2px] active:border-b-2">
              <Volume2 className="h-4 w-4" /> Ouvir de novo
            </button>
            <button type="button" onClick={goNext} className="flex-1 cursor-pointer rounded-2xl border-b-4 border-blue-900 bg-[var(--accent)] px-3 py-2 text-sm font-black text-white hover:brightness-110 active:translate-y-[2px] active:border-b-2">
              {index + 1 >= rounds.length ? "Ver resultado" : "Próximo ▶"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--surface-2)] px-2 py-3">
      <p className="text-xl font-extrabold text-[var(--text)]">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
