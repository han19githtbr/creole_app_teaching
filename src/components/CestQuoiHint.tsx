"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Pause, Play, RotateCcw, Snowflake, Volume2, X } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";
import { getHint, maskName, type CestQuoiItem } from "@/lib/cquoiContent";
import { HINT_LETTER_PENALTY, HINT_PENALTY, type AnswerMode } from "@/lib/cquoiLevels";
import { cn } from "@/lib/utils";

type Tab = "text" | "video" | "letter";

// ---------- narração em português (Web Speech API) ----------
function speakPt(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || soundEffects.isMuted()) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase() === "pt-br") ?? window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt"));
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    utter.volume = Math.max(0.3, soundEffects.getVolume());
    window.speechSynthesis.speak(utter);
  } catch {
    // sem narração neste navegador
  }
}
function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

// ---------------------------------------------------------------------------
// Mini-vídeo da dica
// Se o item tiver um MP4 cadastrado (campo "v"), ele é tocado. Sem MP4, a cena da própria imagem
// vira um pequeno filme animado: câmera que se aproxima do objeto, holofote, legendas e narração.
// ---------------------------------------------------------------------------
interface Step {
  icon: string;
  title: string;
  text: string;
}

function HintMovie({ item, steps }: { item: CestQuoiItem; steps: Step[] }) {
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const lastSpoken = useRef(-1);

  const durations = useMemo(() => steps.map((s) => Math.max(4200, s.text.length * 62)), [steps]);
  const total = durations.reduce((a, b) => a + b, 0);
  const done = elapsed >= total;

  let step = 0;
  let acc = 0;
  for (let i = 0; i < durations.length; i++) {
    if (elapsed < acc + durations[i]) {
      step = i;
      break;
    }
    acc += durations[i];
    step = i;
  }
  const stepProgress = Math.min(1, (elapsed - acc) / durations[step]);

  useEffect(() => {
    if (!playing || done) return;
    const id = window.setInterval(() => setElapsed((e) => Math.min(total, e + 100)), 100);
    return () => window.clearInterval(id);
  }, [playing, done, total]);

  // narra cada etapa quando ela começa
  useEffect(() => {
    if (!playing || done) return;
    if (lastSpoken.current !== step) {
      lastSpoken.current = step;
      speakPt(steps[step].text);
    }
  }, [step, playing, done, steps]);

  useEffect(() => () => stopSpeech(), []);

  function toggle() {
    soundEffects.playTap();
    if (done) {
      lastSpoken.current = -1;
      setElapsed(0);
      setPlaying(true);
      return;
    }
    if (playing) stopSpeech();
    else lastSpoken.current = -1;
    setPlaying((p) => !p);
  }

  const ox = (item.arrow.x / item.w) * 100;
  const oy = (item.arrow.y / item.h) * 100;
  const zoomClass = step === 0 ? "cqh-zoom-in" : step === 1 ? "cqh-zoom-pan" : "cqh-zoom-out";

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${item.w} / ${item.h}` }}>
        <div
          key={step}
          className={cn("absolute inset-0", zoomClass)}
          style={{ transformOrigin: `${ox}% ${oy}%`, animationPlayState: playing ? "running" : "paused" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.scene} alt="Cena com o objeto da dica" className="h-full w-full object-cover" draggable={false} />
          {/* holofote sobre o objeto */}
          <span
            className="cqh-spot pointer-events-none absolute rounded-full"
            style={{ left: `${ox}%`, top: `${oy}%`, animationPlayState: playing ? "running" : "paused" }}
            aria-hidden
          />
        </div>

        {/* barras de cinema e selo de gravação */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-black/70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-black/70" />
        <span className="absolute left-2 top-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur">
          <span className={cn("h-2 w-2 rounded-full bg-red-500", playing && !done && "animate-pulse")} /> DICA
        </span>
        <span className="absolute right-2 top-4 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
          {step + 1}/{steps.length}
        </span>

        {/* legenda */}
        <div key={`cap${step}`} className="cqh-caption absolute inset-x-2 bottom-5 rounded-xl bg-black/75 px-3 py-2 text-center text-[13px] font-semibold leading-snug text-white backdrop-blur">
          <span className="mr-1 text-base">{steps[step].icon}</span>
          <strong className="mr-1 text-amber-300">{steps[step].title}:</strong>
          {steps[step].text}
        </div>

        {/* faíscas */}
        {playing && !done && (
          <>
            <span className="cqh-sparkle absolute left-[12%] top-[28%]" aria-hidden>✨</span>
            <span className="cqh-sparkle absolute right-[14%] top-[36%]" style={{ animationDelay: "0.9s" }} aria-hidden>⭐</span>
          </>
        )}
      </div>

      {/* controles */}
      <div className="flex items-center gap-2 bg-slate-900 px-3 py-2">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-slate-900 hover:bg-amber-200"
          aria-label={done ? "Rever o vídeo" : playing ? "Pausar vídeo" : "Reproduzir vídeo"}
        >
          {done ? <RotateCcw className="h-4 w-4" /> : playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <div className="flex flex-1 gap-1" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <span
                className="block h-full rounded-full bg-amber-400"
                style={{ width: `${i < step || done ? 100 : i === step ? stepProgress * 100 : 0}%`, transition: "width 100ms linear" }}
              />
            </span>
          ))}
        </div>
        <span className="w-9 text-right text-[11px] font-bold tabular-nums text-slate-300">{Math.ceil(Math.max(0, total - elapsed) / 1000)}s</span>
      </div>
    </div>
  );
}

function HintVideoFile({ src, onError }: { src: string; onError: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg">
      <video src={src} className="aspect-[7/5] w-full" controls autoPlay muted loop playsInline onError={onError} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Painel da dica (tela cheia por cima do jogo)
// ---------------------------------------------------------------------------
export function CestQuoiHint({
  item,
  mode,
  secondsLeft,
  onClose,
  onLetterClue,
  letterAlready,
}: {
  item: CestQuoiItem;
  mode: AnswerMode;
  /** Segundos que ainda sobravam quando o tempo foi congelado. */
  secondsLeft: number;
  onClose: () => void;
  /** Chamado quando o jogador pede a pista da letra (custa mais pontos). */
  onLetterClue: () => void;
  letterAlready: boolean;
}) {
  const hint = useMemo(() => getHint(item), [item]);
  const [tab, setTab] = useState<Tab>("text");
  const [letterShown, setLetterShown] = useState(letterAlready);
  const [videoFailed, setVideoFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const steps = useMemo<Step[]>(
    () => [
      { icon: "👀", title: "Observe", text: hint.d },
      { icon: "🛠️", title: "Para que serve", text: hint.u },
      {
        icon: "🧠",
        title: "Agora é com você",
        text: mode === "phrase" ? "Volte ao jogo e escolha a frase que combina com o objeto da seta vermelha." : "Volte ao jogo e escolha o nome do objeto da seta vermelha em francês.",
      },
    ],
    [hint, mode]
  );

  const close = useCallback(() => {
    stopSpeech();
    onClose();
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stopSpeech();
    };
  }, [close]);

  function showLetter() {
    soundEffects.playTap();
    if (!letterShown) {
      setLetterShown(true);
      onLetterClue();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "text", label: "💬 Explicação" },
    { id: "video", label: "🎬 Vídeo" },
    { id: "letter", label: "🔤 Pista" },
  ];

  return (
    <div className="cqh-backdrop fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label="Dica">
      <div className="cqh-sheet relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-sky-300/40 bg-[var(--surface)] shadow-2xl">
        {/* cabeçalho congelado */}
        <div className="cqh-frost relative overflow-hidden bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner"><Lightbulb className="h-5 w-5" strokeWidth={2.6} /></span>
              <div className="min-w-0">
                <p className="text-base font-black leading-tight">Dica</p>
                <p className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-50">
                  <Snowflake className="h-3.5 w-3.5" /> Tempo congelado · sobram {Math.max(0, Math.ceil(secondsLeft))} s
                </p>
              </div>
            </div>
            <button ref={closeRef} type="button" onClick={close} className="cursor-pointer rounded-full bg-white/20 p-1.5 hover:bg-white/30" aria-label="Fechar dica">
              <X className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>
          <p className="mt-2 rounded-lg bg-black/15 px-2.5 py-1 text-[11px] font-semibold text-sky-50">
            Usar a dica reduz os pontos desta imagem em {Math.round(HINT_PENALTY * 100)}% (e em {Math.round(HINT_LETTER_PENALTY * 100)}% se pedir a pista da letra).
          </p>
        </div>

        {/* abas */}
        <div className="grid grid-cols-3 gap-1 border-b border-[var(--border)] bg-[var(--surface-2)] p-1.5" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => { soundEffects.playTap(); setTab(t.id); if (t.id !== "video") stopSpeech(); }}
              className={cn(
                "cursor-pointer rounded-xl px-2 py-2 text-xs font-extrabold transition-all active:scale-95",
                tab === t.id ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow" : "text-[var(--text-secondary)] hover:bg-[var(--surface)]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-[250px] flex-1 overflow-y-auto p-4">
          {tab === "text" && (
            <div key="text" className="cqh-pane space-y-3">
              <div className="flex gap-3 rounded-2xl border border-sky-300/40 bg-sky-500/10 p-3">
                <span className="text-2xl" aria-hidden>👀</span>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-sky-600 dark:text-sky-300">Como ele é</p>
                  <p className="mt-0.5 text-sm font-semibold leading-relaxed text-[var(--text)]">{hint.d}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-amber-300/50 bg-amber-500/10 p-3">
                <span className="text-2xl" aria-hidden>🛠️</span>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-amber-600 dark:text-amber-300">Para que serve</p>
                  <p className="mt-0.5 text-sm font-semibold leading-relaxed text-[var(--text)]">{hint.u}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => speakPt(`${hint.d} ${hint.u}`)}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text)] hover:bg-[var(--surface-2)] active:translate-y-[2px] active:border-b-2"
              >
                <Volume2 className="h-4 w-4" /> Ouvir a dica
              </button>
            </div>
          )}

          {tab === "video" && (
            <div key="video" className="cqh-pane space-y-2">
              {hint.v && !videoFailed ? <HintVideoFile src={hint.v} onError={() => setVideoFailed(true)} /> : <HintMovie item={item} steps={steps} />}
              <p className="text-center text-[11px] font-semibold text-[var(--text-muted)]">A câmera mostra o objeto da seta e explica para que ele serve.</p>
            </div>
          )}

          {tab === "letter" && (
            <div key="letter" className="cqh-pane space-y-3 text-center">
              {letterShown ? (
                <div className="cq2-unlock rounded-2xl border border-indigo-300/50 bg-indigo-500/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-indigo-600 dark:text-indigo-300">O nome em francês começa assim</p>
                  <p className="mt-2 break-words font-mono text-2xl font-black tracking-widest text-[var(--text)]">
                    {item.article} <span className="text-indigo-600 dark:text-indigo-300">{maskName(item)}</span>
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[var(--text-secondary)]">
                    {item.name.split(/\s+/).length > 1 ? `${item.name.split(/\s+/).length} palavras` : "1 palavra"} · {[...item.name.replace(/\s+/g, "")].length} letras
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] p-4">
                  <p className="text-3xl" aria-hidden>🔤</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">
                    Quer ainda mais ajuda? Mostro o artigo e a primeira letra de cada palavra do nome em francês.
                  </p>
                  <button
                    type="button"
                    onClick={showLetter}
                    className="mt-3 cursor-pointer rounded-2xl border-b-4 border-indigo-900 bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-black text-white shadow-md active:translate-y-[2px] active:border-b-2"
                  >
                    Mostrar a pista (−{Math.round(HINT_LETTER_PENALTY * 100)}% dos pontos)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3">
          <button
            type="button"
            onClick={close}
            className="cq2-shine relative w-full cursor-pointer overflow-hidden rounded-2xl border-b-4 border-green-800 bg-gradient-to-r from-emerald-400 to-green-600 px-4 py-3 text-base font-black text-white shadow-lg active:translate-y-[2px] active:border-b-2"
          >
            Voltar ao jogo ▶ (o tempo volta a correr)
          </button>
        </div>
      </div>
    </div>
  );
}
