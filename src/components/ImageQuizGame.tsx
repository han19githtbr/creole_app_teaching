"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Check,
  Heart,
  RotateCcw,
  Share2,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Flame,
  Coins,
  Award,
  Maximize2,
} from "lucide-react";
import { IMAGE_BANK } from "@/lib/imageBank";
import { soundEffects } from "@/lib/soundEffects";
import {
  recordQuizWin,
  type Badge,
  type LevelInfo,
} from "@/lib/gamification";
import { useGamification } from "@/hooks/useGamification";
import { Confetti } from "@/components/Confetti";
import { RewardUnlockModal } from "@/components/RewardUnlockModal";
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

export function ImageQuizGame({ initialChallenge }: { initialChallenge: ImageQuizChallenge }) {
  const router = useRouter();
  const { state: gamificationState, levelInfo } = useGamification();

  const [challenge, setChallenge] = useState(initialChallenge);
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(3);
  const [result, setResult] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checking, setChecking] = useState(false);

  // Estados visuais e interativos
  const [isMuted, setIsMuted] = useState(() => soundEffects.isMuted());
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Estados de recompensa
  const [earnedReward, setEarnedReward] = useState<{ xp: number; goud: number } | null>(null);
  const [unlockedModal, setUnlockedModal] = useState<{
    open: boolean;
    badge: Badge | null;
    level: LevelInfo | null;
    xp: number;
    goud: number;
  }>({
    open: false,
    badge: null,
    level: null,
    xp: 0,
    goud: 0,
  });

  function toggleSound() {
    const next = soundEffects.toggleMute();
    setIsMuted(next);
  }

  function toggleOption(word: string) {
    if (result !== "playing") return;
    const isAlreadySelected = selected.includes(word);
    if (isAlreadySelected) {
      soundEffects.playUntap();
      setSelected((current) => current.filter((item) => item !== word));
    } else {
      soundEffects.playTap();
      setSelected((current) => [...current, word]);
    }
  }

  async function submitAnswer() {
    if (!selected.length || result !== "playing" || checking) return;
    setChecking(true);
    setFeedback("");
    try {
      const response = await fetch("/api/image-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: challenge.postId,
          imageId: challenge.postId ? undefined : challenge.id,
          selected,
        }),
      });
      if (!response.ok) throw new Error("Não foi possível conferir agora. Tente novamente.");
      const { correct } = (await response.json()) as { correct: boolean };

      if (correct) {
        setResult("won");
        const nextScore = score + 1;
        const nextStreak = streak + 1;
        setScore(nextScore);
        setStreak(nextStreak);

        // Som de vitória e celebração
        if (nextStreak > 1) {
          soundEffects.playStreak(nextStreak);
        } else {
          soundEffects.playSuccess();
        }

        // Ativa chuva de confetes festiva
        setShowConfetti(true);

        // Processa recompensas de gamificação
        const rewardResult = recordQuizWin({
          sceneId: challenge.id,
          attemptsLeft: attempts,
          streak: nextStreak,
        });

        setEarnedReward({
          xp: rewardResult.gainedXp,
          goud: rewardResult.gainedGoud,
        });

        // Se subiu de nível ou desbloqueou badge, exibe modal de comemoração
        if (rewardResult.leveledUp) {
          setUnlockedModal({
            open: true,
            badge: null,
            level: rewardResult.newLevel,
            xp: rewardResult.gainedXp,
            goud: rewardResult.gainedGoud,
          });
        } else if (rewardResult.newBadges.length > 0) {
          setUnlockedModal({
            open: true,
            badge: rewardResult.newBadges[0],
            level: null,
            xp: rewardResult.gainedXp,
            goud: rewardResult.gainedGoud,
          });
        }

        return;
      }

      // Resposta incorreta
      const remaining = attempts - 1;
      setAttempts(remaining);
      setSelected([]);
      setStreak(0);
      setFeedback("Ainda não! Observe a imagem com atenção e tente outra combinação.");
      soundEffects.playError();

      // Ativa efeito de tremor no container
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

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
    setEarnedReward(null);
    setShowConfetti(false);
  }

  async function nextRound() {
    const choices = IMAGE_BANK.filter((image) => image.id !== challenge.id);
    const next = choices[Math.floor(Math.random() * choices.length)];
    const response = await fetch(`/api/image-quiz?image=${encodeURIComponent(next.id)}`);
    if (!response.ok) {
      setFeedback("Não foi possível carregar a próxima imagem. Tente novamente.");
      return;
    }
    const data = (await response.json()) as { challenge: ImageQuizChallenge };
    setChallenge(data.challenge);
    setSelected([]);
    setAttempts(3);
    setResult("playing");
    setShareMessage("");
    setFeedback("");
    setEarnedReward(null);
    setShowConfetti(false);
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
    shareUrl.searchParams.set(
      "quote",
      `Acertei todos os elementos de “${challenge.title}” no Jogo das Imagens em Kreyòl!`
    );
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6">
      {/* Chuva de confetes ao vencer */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Modal de Recompensa (Nível ou Conquista) */}
      <RewardUnlockModal
        isOpen={unlockedModal.open}
        onClose={() => setUnlockedModal((prev) => ({ ...prev, open: false }))}
        badge={unlockedModal.badge}
        level={unlockedModal.level}
        xpGained={unlockedModal.xp}
        goudGained={unlockedModal.goud}
      />

      {/* Modal de Zoom da Imagem */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={challenge.src}
              alt={challenge.alt}
              className="h-auto max-h-[85vh] w-auto max-w-full object-contain"
            />
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black"
              aria-label="Fechar ampliação"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/75 px-3 py-1.5 text-xs font-semibold text-white">
              {challenge.title} · {challenge.theme}
            </div>
          </div>
        </div>
      )}

      {/* Header do Jogo com Status de Gamificação */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]">
              <Sparkles className="h-3.5 w-3.5" /> Pratik Kreyòl
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              {levelInfo.current.badgeEmoji} Nivo {levelInfo.current.level}: {levelInfo.current.kreyol}
            </span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text)] sm:text-3xl">
            Jogo das Imagens
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Encontre todas as palavras em Kreyòl que aparecem na ilustração.
          </p>
        </div>

        {/* Painel de Recompensas e Controles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Moedas Goud */}
          <div
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400"
            title="Suas moedas Goud acumuladas"
          >
            <Coins className="h-4 w-4 text-amber-500" />
            <span>{gamificationState.goud} Goud</span>
          </div>

          {/* Sequência de Combo */}
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all",
              streak > 0
                ? "border-orange-500/40 bg-orange-500/15 text-orange-600 dark:text-orange-400 animate-pulse"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
            )}
            title="Sequência de acertos consecutivos"
          >
            <Flame className={cn("h-4 w-4", streak > 0 ? "text-orange-500" : "text-gray-400")} />
            <span>{streak} Combo</span>
          </div>

          {/* Acertos */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] shadow-sm">
            <span className="font-bold text-[var(--accent)]">{score}</span>
            <span className="ml-1 text-[var(--text-muted)]">acertos</span>
          </div>

          {/* Botão de Som / Mudo */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Ativar som" : "Desativar som"}
            title={isMuted ? "Ativar som" : "Desativar som"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors shadow-sm"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-rose-500" />
            ) : (
              <Volume2 className="h-4 w-4 text-[var(--accent)]" />
            )}
          </button>
        </div>
      </header>

      {/* Grid Principal do Desafio */}
      <div
        className={cn(
          "grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)] transition-transform duration-150",
          isShaking && "animate-[shake_0.4s_ease-in-out]"
        )}
      >
        {/* Lado Esquerdo: Imagem da Cena */}
        <section className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md transition-shadow hover:shadow-lg">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={challenge.src}
              alt={challenge.alt}
              className="aspect-[3/2] w-full bg-[var(--surface-2)] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Tema e Botão de Zoom */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="rounded-lg bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-sm">
                {challenge.theme}
              </span>
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-black/75 px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:bg-black hover:text-white backdrop-blur-md shadow-sm transition-colors"
                title="Ampliar imagem para inspecionar detalhes"
              >
                <Maximize2 className="h-3.5 w-3.5" /> Ampliar
              </button>
            </div>

            {/* Vidas (Corações) */}
            <div
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-md"
              aria-label={`${attempts} tentativas restantes`}
            >
              {Array.from({ length: 3 }, (_, index) => (
                <Heart
                  key={index}
                  className={cn(
                    "h-4 w-4 transition-all duration-300",
                    index < attempts
                      ? "fill-rose-500 text-rose-500 drop-shadow-sm scale-100"
                      : "text-white/25 scale-90"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                OBSERVE A ILUSTRAÇÃO
              </p>
              <h2 className="truncate text-lg font-bold text-[var(--text)] sm:text-xl">
                {challenge.title}
              </h2>
            </div>
            <span className="shrink-0 rounded-lg bg-[var(--accent-soft)] px-3 py-1 text-xs font-extrabold text-[var(--accent)]">
              {challenge.answerCount} palavras certas
            </span>
          </div>
        </section>

        {/* Lado Direito: Palavras e Resposta */}
        <section className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                ESCOLHA AS PALAVRAS PRESENTES
              </p>
              <p className="mt-0.5 text-xs font-medium text-[var(--text-secondary)]">
                Marcadas:{" "}
                <span className="font-bold text-[var(--accent)]">
                  {selected.length}
                </span>{" "}
                de {challenge.answerCount} esperadas
              </p>
            </div>
            {result === "playing" && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playUntap();
                  setSelected([]);
                }}
                disabled={!selected.length}
                aria-label="Limpar seleção"
                title="Limpar seleção"
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] disabled:opacity-30 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Limpar
              </button>
            )}
          </div>

          {/* Grade de 10 Palavras em Kreyòl */}
          <div className="grid grid-cols-2 gap-2.5">
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
                    "min-h-12 rounded-xl border px-3.5 py-2.5 text-left text-sm font-bold transition-all duration-150 transform active:scale-95",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm ring-2 ring-[var(--accent)]/40 scale-[1.02]"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--accent)]/60 hover:bg-[var(--surface)]"
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="break-words">{word}</span>
                    {active && <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ação e Feedback */}
          <div className="mt-auto pt-5">
            {result === "playing" ? (
              <>
                <button
                  type="button"
                  onClick={submitAnswer}
                  disabled={!selected.length || checking}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[var(--accent)]/20 hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40 transition-all transform active:scale-98"
                >
                  {checking ? "Conferindo..." : "Conferir respostas"}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
                  Você tem {attempts} {attempts === 1 ? "tentativa restante" : "tentativas restantes"} nesta rodada.
                </p>
                {feedback && (
                  <p
                    className="mt-2 text-center text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in"
                    role="status"
                  >
                    {feedback}
                  </p>
                )}
              </>
            ) : result === "won" ? (
              <div
                className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-5 text-center shadow-sm animate-in zoom-in-95 duration-200"
                role="status"
              >
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black text-[var(--text)]">
                  Ou byen fè! Acertou tudo! 🎉
                </h3>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Todas as {challenge.answerCount} palavras em Kreyòl foram identificadas com sucesso.
                </p>

                {/* Banner de Recompensa Coletada */}
                {earnedReward && (
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/25 px-3 py-1 text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      <Award className="h-3.5 w-3.5" /> +{earnedReward.xp} XP
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-3 py-1 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                      💰 +{earnedReward.goud} Goud
                    </span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={shareFacebook}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" /> Facebook
                  </button>
                  <button
                    type="button"
                    onClick={shareInstagram}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" /> Instagram
                  </button>
                </div>
                {shareMessage && (
                  <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400" role="status">
                    {shareMessage}
                  </p>
                )}
                <button
                  type="button"
                  onClick={nextRound}
                  className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[var(--accent)]/20 hover:bg-[var(--accent-hover)] transition-all transform active:scale-98"
                >
                  Próxima imagem <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-center shadow-sm animate-in zoom-in-95 duration-200"
                role="status"
              >
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30">
                  <X className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black text-[var(--text)]">
                  Pa gen pwoblèm! Tente de novo.
                </h3>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Suas três tentativas acabaram nesta rodada. Mas a imagem continua aqui para você dominar.
                </p>
                <button
                  type="button"
                  onClick={restartRound}
                  className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[var(--accent)]/20 hover:bg-[var(--accent-hover)] transition-all transform active:scale-98"
                >
                  Tentar novamente <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
