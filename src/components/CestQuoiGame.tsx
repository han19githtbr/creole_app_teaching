"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Flame, RotateCcw, Trophy, Volume2, VolumeX, X } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";
import { recordQuizWin } from "@/lib/gamification";
import { Confetti } from "@/components/Confetti";
import { CestQuoiStickman, type StickmanMood } from "@/components/CestQuoiStickman";
import { cn } from "@/lib/utils";

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

const SECONDS_PER_IMAGE = 5; // tempo para responder (a cada tentativa)
const MAX_ATTEMPTS = 2; // 1ª tentativa + mais uma
const ROUNDS_PER_GAME = 10;

type Phase = "intro" | "playing" | "done";
type RoundState = "asking" | "correct" | "retry" | "reveal";

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

// ---------- seta vermelha que balança para a esquerda e a direita ----------
const ARROW_PATH = "M-104 -12 L-44 -12 L-50 -29 L0 0 L-50 29 L-44 12 L-104 12 Z";
function SceneArrow({ item }: { item: CestQuoiItem }) {
  return (
    <svg viewBox={`0 0 ${item.w} ${item.h}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <g className="cq-sway">
        <g transform={`translate(${item.arrow.x} ${item.arrow.y}) rotate(25)`}>
          <path d={ARROW_PATH} fill="#e60012" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
          <path d={ARROW_PATH} fill="#e60012" stroke="#e60012" strokeWidth="1" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

// ---------- relógio azul com contagem de 5 s ----------
function CountdownClock({ left, running }: { left: number; running: boolean }) {
  const frac = Math.min(1, Math.max(0, left / (SECONDS_PER_IMAGE * 1000)));
  const elapsed = 1 - frac;
  const urgent = running && left <= 2000;
  const ring = left <= 2000 ? "#dc2626" : left <= 3500 ? "#f59e0b" : "#2c58c9";
  const C = 2 * Math.PI * 56;
  return (
    <div className={cn("relative h-[76px] w-[76px] sm:h-[88px] sm:w-[88px]", urgent && "cq-clock-urgent")}>
      <svg viewBox="0 0 140 140" className="h-full w-full">
        <circle cx="70" cy="70" r="64" fill="#fff" stroke={ring} strokeWidth="10" style={{ transition: "stroke .3s" }} />
        <circle cx="70" cy="70" r="56" fill="none" stroke={ring} strokeOpacity=".18" strokeWidth="6" />
        <circle cx="70" cy="70" r="56" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * elapsed} transform="rotate(-90 70 70)" />
        {[0, 90, 180, 270].map((a) => (
          <line key={a} x1="70" y1="17" x2="70" y2="27" stroke={ring} strokeWidth="4" strokeLinecap="round" transform={`rotate(${a} 70 70)`} />
        ))}
        <line x1="70" y1="70" x2="70" y2="26" stroke="#222" strokeWidth="5" strokeLinecap="round" transform={`rotate(${elapsed * 360} 70 70)`} />
        <circle cx="70" cy="70" r="6" fill="#222" />
      </svg>
      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white shadow" style={{ background: ring, transition: "background .3s" }}>{Math.ceil(left / 1000)}</span>
    </div>
  );
}

export function CestQuoiGame({ items, initialTheme }: { items: CestQuoiItem[]; initialTheme?: string }) {
  const themes = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((i) => map.set(i.themeId, i.theme));
    return [...map.entries()].map(([id, label]) => ({ id, label }));
  }, [items]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [themeId, setThemeId] = useState<string>(initialTheme && themes.some((t) => t.id === initialTheme) ? initialTheme : "all");
  const [rounds, setRounds] = useState<CestQuoiItem[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [roundState, setRoundState] = useState<RoundState>("asking");
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_IMAGE * 1000);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [goud, setGoud] = useState(0);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(() => soundEffects.isMuted());

  const deadlineRef = useRef(0);
  const lastSecRef = useRef(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const answeredRef = useRef(false);

  const item = rounds[index];
  const running = phase === "playing" && roundState === "asking";

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => () => {
    clearTimers();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [clearTimers]);

  // as vozes do navegador carregam de forma assíncrona
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const refresh = () => { cachedVoice = null; pickFrenchVoice(); };
    refresh();
    window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
  }, []);

  const startAttempt = useCallback(() => {
    deadlineRef.current = Date.now() + SECONDS_PER_IMAGE * 1000;
    lastSecRef.current = -1;
    answeredRef.current = false;
    setTimeLeft(SECONDS_PER_IMAGE * 1000);
    setRoundState("asking");
  }, []);

  function prepareRound(list: CestQuoiItem[], i: number, pool: CestQuoiItem[]) {
    setOptions(buildOptions(list[i], pool));
    setWrongPicks([]);
    setAttempt(1);
    setMessage("");
    setConfetti(false);
    soundEffects.playRoundStart();
    startAttempt();
  }

  function startGame() {
    const pool = themeId === "all" ? items : items.filter((i) => i.themeId === themeId);
    const list = shuffle(pool).slice(0, ROUNDS_PER_GAME);
    // as alternativas erradas vêm de todo o catálogo, para sempre haver 4 opções
    clearTimers();
    setRounds(list);
    setIndex(0);
    setScore(0);
    setHits(0);
    setStreak(0);
    setBestStreak(0);
    setXp(0);
    setGoud(0);
    setLevelUp(null);
    setPhase("playing");
    prepareRound(list, 0, items);
  }

  const goNext = useCallback(() => {
    clearTimers();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (index + 1 >= rounds.length) {
      setPhase("done");
      setConfetti(hits > 0);
      soundEffects.playPerfectRound();
      return;
    }
    const next = index + 1;
    setIndex(next);
    prepareRound(rounds, next, items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, rounds, items, hits, clearTimers]);

  // ---------- erro (opção errada ou tempo esgotado) ----------
  const registerMiss = useCallback(
    (picked: string | null) => {
      if (answeredRef.current || !item) return;
      answeredRef.current = true;
      setStreak(0);
      if (picked) setWrongPicks((w) => [...w, picked]);
      setShake(true);
      later(() => setShake(false), 500);

      if (picked === null) soundEffects.playTimeUp();
      else soundEffects.playError();

      if (attempt < MAX_ATTEMPTS) {
        setRoundState("retry");
        setMessage(picked === null ? "Tempo esgotado! Você tem mais uma tentativa." : "Ainda não! Você tem mais uma tentativa.");
        later(() => {
          setAttempt((a) => a + 1);
          setMessage("");
          startAttempt();
        }, 1500);
      } else {
        setRoundState("reveal");
        setMessage(`A resposta era: ${item.fr}.`);
        later(() => speakFrench(item.speak), 500);
        later(goNext, 4200);
      }
    },
    [item, attempt, later, startAttempt, goNext]
  );

  // ---------- acerto ----------
  function pick(option: string) {
    if (!item || roundState !== "asking" || answeredRef.current || wrongPicks.includes(option)) return;
    if (option !== item.fr) {
      registerMiss(option);
      return;
    }
    answeredRef.current = true;
    const nextStreak = streak + 1;
    const timeBonus = Math.round((timeLeft / 1000) * 2);
    const points = (attempt === 1 ? 10 : 6) + timeBonus;
    setRoundState("correct");
    setScore((s) => s + points);
    setHits((h) => h + 1);
    setStreak(nextStreak);
    setBestStreak((b) => Math.max(b, nextStreak));
    setMessage(attempt === 1 ? "Parfait ! 🎉" : "Très bien ! Na segunda tentativa 👏");
    setConfetti(true);
    if (nextStreak > 1) soundEffects.playStreak(nextStreak);
    else soundEffects.playSuccess();
    later(() => speakFrench(item.speak), 350);

    const reward = recordQuizWin({
      sceneId: `cquoi-${item.id}`,
      theme: item.theme,
      wordsCount: 1,
      attemptsLeft: attempt === 1 ? 3 : 2,
      streak: nextStreak,
    });
    setXp((x) => x + reward.gainedXp);
    setGoud((g) => g + reward.gainedGoud);
    if (reward.leveledUp) setLevelUp(reward.newLevel.level);
    later(goNext, 3200);
  }

  // ---------- relógio de 5 s com tique-taque ----------
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, deadlineRef.current - Date.now());
      setTimeLeft(left);
      const sec = Math.ceil(left / 1000);
      if (left > 0 && sec !== lastSecRef.current) {
        lastSecRef.current = sec;
        soundEffects.playClockTick(sec <= 2);
      }
      if (left <= 0) {
        clearInterval(id);
        registerMiss(null);
      }
    }, 80);
    return () => clearInterval(id);
  }, [running, registerMiss, attempt, index]);

  function toggleSound() {
    const next = soundEffects.toggleMute();
    setMuted(next);
    if (next && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  const mood: StickmanMood = roundState === "correct" ? "dance" : roundState === "retry" || roundState === "reveal" ? "sad" : "think";
  const stars = hits >= 9 ? 3 : hits >= 6 ? 2 : hits >= 3 ? 1 : 0;

  // =================== INTRO ===================
  if (phase === "intro") {
    return (
      <div className="mx-auto w-full max-w-lg space-y-5 px-4 py-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]">
            <ArrowLeft className="h-4 w-4" /> Painel
          </Link>
          <button type="button" onClick={toggleSound} className="cursor-pointer rounded-lg border border-[var(--border)] p-2 text-[var(--text-secondary)]" aria-label={muted ? "Ativar som" : "Silenciar"}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm">
          <div className="mx-auto h-40 w-40"><CestQuoiStickman mood="think" /></div>
          <h1 className="mt-2 text-2xl font-extrabold text-[var(--text)]">C&apos;est quoi ? 🇫🇷</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            A seta vermelha aponta para um objeto. Escolha o nome certo em francês <strong>em {SECONDS_PER_IMAGE} segundos</strong>!
            Se errar, você tem <strong>mais uma tentativa</strong>. Ao acertar, ouça a pronúncia correta da palavra.
          </p>
          <ul className="mx-auto mt-3 max-w-xs space-y-1 text-left text-xs text-[var(--text-muted)]">
            <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-[var(--accent)]" /> O relógio faz tique-taque: fique de olho!</li>
            <li className="flex items-center gap-2"><Flame className="h-3.5 w-3.5 text-[var(--accent)]" /> Acertos seguidos valem combo, XP e Goud.</li>
            <li className="flex items-center gap-2"><Volume2 className="h-3.5 w-3.5 text-[var(--accent)]" /> Ative o som para ouvir a pronúncia.</li>
          </ul>

          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Tema</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {[{ id: "all", label: "Todos os temas" }, ...themes].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId(t.id)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  themeId === t.id ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { soundEffects.playTap(); startGame(); }}
            className="mt-6 w-full cursor-pointer rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-bold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[var(--accent-hover)]"
          >
            Jouer ! ▶
          </button>
        </div>
      </div>
    );
  }

  // =================== FIM ===================
  if (phase === "done") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <Confetti active={confetti} onComplete={() => setConfetti(false)} />
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm">
          <div className="mx-auto h-44 w-44"><CestQuoiStickman mood={hits >= 4 ? "dance" : "sad"} /></div>
          <h2 className="mt-2 flex items-center justify-center gap-2 text-2xl font-extrabold text-[var(--text)]"><Trophy className="h-6 w-6 text-amber-500" /> {hits >= 4 ? "Bravo !" : "Continue !"}</h2>
          <p className="mt-1 text-lg">{[0, 1, 2].map((s) => <span key={s} className={s < stars ? "" : "opacity-25"}>⭐</span>)}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat label="Acertos" value={`${hits}/${rounds.length}`} />
            <Stat label="Pontos" value={String(score)} />
            <Stat label="Melhor combo" value={`x${bestStreak}`} />
          </div>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">+{xp} XP · +{goud} Goud{levelUp ? ` · Nível ${levelUp}! 🎊` : ""}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={startGame} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 font-bold text-white hover:bg-[var(--accent-hover)]"><RotateCcw className="h-4 w-4" /> Jogar de novo</button>
            <button type="button" onClick={() => setPhase("intro")} className="flex-1 cursor-pointer rounded-xl border border-[var(--border)] px-4 py-2.5 font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]">Trocar tema</button>
            <Link href="/dashboard" className="flex-1 rounded-xl border border-[var(--border)] px-4 py-2.5 text-center font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]">Painel</Link>
          </div>
        </div>
      </div>
    );
  }

  // =================== JOGO ===================
  if (!item) return null;
  const answered = roundState === "correct" || roundState === "reveal";
  return (
    <div className="mx-auto w-full max-w-md space-y-3 px-3 py-4">
      <Confetti active={confetti && roundState === "correct"} onComplete={() => setConfetti(false)} />

      <div className="flex items-center justify-between gap-2 text-sm">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text)]"><ArrowLeft className="h-4 w-4" /></Link>
        <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--text)]">{index + 1} / {rounds.length}</span>
        <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--text)]">{score} pts</span>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold", streak > 1 ? "bg-orange-500 text-white" : "bg-[var(--surface-2)] text-[var(--text-muted)]")}><Flame className="h-3 w-3" /> x{streak}</span>
        <span className="inline-flex gap-1" aria-label={`Tentativa ${attempt} de ${MAX_ATTEMPTS}`}>
          {Array.from({ length: MAX_ATTEMPTS }, (_, i) => <span key={i} className={cn("h-2.5 w-2.5 rounded-full", i < MAX_ATTEMPTS - attempt + 1 ? "bg-red-500" : "bg-[var(--border)]")} />)}
        </span>
        <button type="button" onClick={toggleSound} className="cursor-pointer rounded-lg border border-[var(--border)] p-1.5 text-[var(--text-secondary)]" aria-label={muted ? "Ativar som" : "Silenciar"}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      <div className={cn("overflow-hidden rounded-2xl border border-[var(--border)] bg-[#f1ece1] shadow-md", shake && "cq-card-shake")}>
        {/* cena com a seta vermelha que balança */}
        <div className="relative w-full" style={{ aspectRatio: `${item.w} / ${item.h}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.scene} alt="Objeto indicado pela seta vermelha" className="h-full w-full object-cover" draggable={false} />
          <SceneArrow item={item} />
          <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{item.theme}</span>
        </div>

        {/* painel do boneco (mesmo modelo das imagens c-quoi) */}
        <div className="relative bg-[#f1ece1]" style={{ aspectRatio: "490 / 440" }}>
          <div className="absolute left-2 top-2 z-10"><CountdownClock left={timeLeft} running={running} /></div>
          {answered && (
            <div key={roundState} className="cq-pop-in absolute inset-x-0 top-3 z-10 flex justify-center pl-24">
              <span className="inline-flex items-center gap-2 rounded-md bg-white/70 px-3 py-1 text-lg font-extrabold text-black">
                <span className={cn("flex h-5 w-5 items-center justify-center rounded-sm text-white", roundState === "correct" ? "bg-green-600" : "bg-red-500")}>
                  {roundState === "correct" ? <Check className="h-4 w-4" strokeWidth={4} /> : <X className="h-4 w-4" strokeWidth={4} />}
                </span>
                {item.fr}.
              </span>
            </div>
          )}
          <div className="mx-auto h-full w-[78%]"><CestQuoiStickman mood={mood} /></div>
          {message && <p className="absolute inset-x-0 bottom-2 px-3 text-center text-sm font-bold text-[#333]" role="status">{message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isWrong = wrongPicks.includes(opt);
          const isRight = answered && opt === item.fr;
          return (
            <button
              key={opt}
              type="button"
              disabled={roundState !== "asking" || isWrong}
              onClick={() => pick(opt)}
              className={cn(
                "min-h-[52px] cursor-pointer rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all",
                isRight ? "border-green-600 bg-green-600 text-white"
                  : isWrong ? "border-red-300 bg-red-50 text-red-400 line-through opacity-70 dark:bg-red-950/30"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)] active:scale-95",
                roundState !== "asking" && !isRight && !isWrong && "opacity-50"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="flex gap-2">
          <button type="button" onClick={() => speakFrench(item.speak)} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"><Volume2 className="h-4 w-4" /> Ouvir de novo</button>
          <button type="button" onClick={goNext} className="flex-1 cursor-pointer rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-bold text-white hover:bg-[var(--accent-hover)]">{index + 1 >= rounds.length ? "Ver resultado" : "Próximo ▶"}</button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface-2)] px-2 py-3">
      <p className="text-xl font-extrabold text-[var(--text)]">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
