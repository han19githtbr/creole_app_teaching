"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Camera, Check, Heart, RotateCcw, Share2, Sparkles, X } from "lucide-react";
import { IMAGE_BANK } from "@/lib/imageBank";
import { cn } from "@/lib/utils";

export interface ImageQuizChallenge {
  id: string;
  postId?: string;
  theme: string;
  title: string;
  src: string;
  alt: string;
  options: string[];
  answerCount: number;
}

function playNotes(notes: number[]) {
  try {
    const audio = new window.AudioContext();
    const now = audio.currentTime;
    notes.forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const start = now + index * 0.16;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.16);
      oscillator.onended = () => {
        if (index === notes.length - 1) void audio.close();
      };
    });
  } catch {
    // O jogo continua utilizável em navegadores sem Web Audio.
  }
}

export function ImageQuizGame({ initialChallenge }: { initialChallenge: ImageQuizChallenge }) {
  const router = useRouter();
  const [challenge, setChallenge] = useState(initialChallenge);
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(3);
  const [result, setResult] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checking, setChecking] = useState(false);

  function toggleOption(word: string) {
    if (result !== "playing") return;
    setSelected((current) => current.includes(word)
      ? current.filter((item) => item !== word)
      : [...current, word]);
  }

  async function submitAnswer() {
    if (!selected.length || result !== "playing" || checking) return;
    setChecking(true);
    setFeedback("");
    try {
      const response = await fetch("/api/image-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: challenge.postId, imageId: challenge.postId ? undefined : challenge.id, selected }),
      });
      if (!response.ok) throw new Error("Não foi possível conferir agora. Tente novamente.");
      const { correct } = await response.json() as { correct: boolean };
      if (correct) {
        setResult("won");
        setScore((value) => value + 1);
        setStreak((value) => value + 1);
        playNotes([523, 659, 784, 1047]);
        return;
      }
      const remaining = attempts - 1;
      setAttempts(remaining);
      setSelected([]);
      setStreak(0);
      setFeedback("Ainda não! Observe a imagem e tente outra combinação.");
      playNotes([330, 247, 196]);
      if (remaining === 0) setResult("lost");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao conferir as respostas.");
    } finally {
      setChecking(false);
    }
  }

  function restartRound() {
    setSelected([]);
    setAttempts(3);
    setResult("playing");
    setShareMessage("");
  }

  async function nextRound() {
    const choices = IMAGE_BANK.filter((image) => image.id !== challenge.id);
    const next = choices[Math.floor(Math.random() * choices.length)];
    const response = await fetch(`/api/image-quiz?image=${encodeURIComponent(next.id)}`);
    if (!response.ok) {
      setFeedback("Não foi possível carregar a próxima imagem. Tente novamente.");
      return;
    }
    const data = await response.json() as { challenge: ImageQuizChallenge };
    setChallenge(data.challenge);
    setSelected([]);
    setAttempts(3);
    setResult("playing");
    setShareMessage("");
    setFeedback("");
    router.replace(`/dashboard/jogo?image=${encodeURIComponent(next.id)}`);
  }

  function challengeUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("image");
    url.searchParams.delete("post");
    url.searchParams.set(challenge.postId ? "post" : "image", challenge.postId ?? challenge.id);
    return url.toString();
  }

  async function shareInstagram() {
    const text = `Acertei todos os elementos de “${challenge.title}” no Jogo das Imagens em Kreyòl!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Minha conquista em Kreyòl", text, url: challengeUrl() });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareMessage("Conquista copiada. Cole o texto em um Story ou publicação do Instagram.");
    } catch {
      setShareMessage("Não foi possível abrir o compartilhamento neste dispositivo.");
    }
  }

  function shareFacebook() {
    const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
    shareUrl.searchParams.set("u", challengeUrl());
    shareUrl.searchParams.set("quote", `Acertei todos os elementos de “${challenge.title}” no Jogo das Imagens em Kreyòl!`);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
            <Sparkles className="h-4 w-4" /> Pratik Kreyòl
          </p>
          <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">Jogo das Imagens</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Encontre todas as palavras que aparecem na cena.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
            <span className="font-bold text-[var(--text)]">{score}</span>
            <span className="ml-1.5 text-[var(--text-muted)]">acertos</span>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
            <span className="font-bold text-[var(--text)]">{streak}</span>
            <span className="ml-1.5 text-[var(--text-muted)]">sequência</span>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={challenge.src} alt={challenge.alt} className="aspect-[3/2] w-full bg-[var(--surface-2)] object-cover" />
            <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              {challenge.theme}
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm" aria-label={`${attempts} tentativas restantes`}>
              {Array.from({ length: 3 }, (_, index) => (
                <Heart key={index} className={cn("h-3.5 w-3.5", index < attempts ? "fill-rose-400 text-rose-400" : "text-white/35")} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--text-muted)]">OBSERVE A CENA</p>
              <h2 className="truncate text-base font-semibold text-[var(--text)]">{challenge.title}</h2>
            </div>
            <span className="shrink-0 rounded-md bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent)]">
              {challenge.answerCount} palavras
            </span>
          </div>
        </section>

        <section className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">SELECIONE TODAS AS CORRETAS</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Escolhidas: {selected.length}</p>
            </div>
            {result === "playing" && (
              <button type="button" onClick={() => setSelected([])} disabled={!selected.length} aria-label="Limpar seleção" title="Limpar seleção" className="rounded-md p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)] disabled:opacity-30">
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {challenge.options.map((word, index) => {
              const active = selected.includes(word);
              return (
                <button
                  key={`${word}-${index}`}
                  type="button"
                  aria-pressed={active}
                  disabled={result !== "playing"}
                  onClick={() => toggleOption(word)}
                  className={cn(
                    "min-h-12 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-all duration-150",
                    active ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--accent)]/60",
                  )}
                >
                  <span className="flex items-center justify-between gap-2"><span className="break-words">{word}</span>{active && <Check className="h-4 w-4 shrink-0" />}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            {result === "playing" ? (
              <>
                <button type="button" onClick={submitAnswer} disabled={!selected.length || checking} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-45">
                  {checking ? "Conferindo..." : "Conferir respostas"} <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-2 text-center text-xs text-[var(--text-muted)]">Você tem {attempts} {attempts === 1 ? "tentativa" : "tentativas"} nesta rodada.</p>
                {feedback && <p className="mt-2 text-center text-xs text-rose-600 dark:text-rose-300" role="status">{feedback}</p>}
              </>
            ) : result === "won" ? (
              <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 p-4 text-center" role="status">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white"><Check className="h-6 w-6" /></div>
                <h3 className="font-bold text-[var(--text)]">Ou byen fè! Acertou tudo!</h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Mais uma cena dominada em Kreyòl.</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={shareFacebook} className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)]"><Share2 className="h-3.5 w-3.5" /> Facebook</button>
                  <button type="button" onClick={shareInstagram} className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)]"><Camera className="h-3.5 w-3.5" /> Instagram</button>
                </div>
                {shareMessage && <p className="mt-2 text-xs text-[var(--text-secondary)]" role="status">{shareMessage}</p>}
                <button type="button" onClick={nextRound} className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-bold text-white hover:bg-[var(--accent-hover)]">Próxima imagem <ArrowRight className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-center" role="status">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white"><X className="h-6 w-6" /></div>
                <h3 className="font-bold text-[var(--text)]">Pa gen pwoblèm! Tente de novo.</h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Suas três tentativas acabaram. A imagem continua aqui para uma nova rodada.</p>
                <button type="button" onClick={restartRound} className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-bold text-white hover:bg-[var(--accent-hover)]">Tentar novamente <RotateCcw className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

