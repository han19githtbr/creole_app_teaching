"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  MountainSnow,
  Play,
  Volume2,
  Timer,
  Trophy,
  Sparkles,
  X,
  ArrowRight,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Flame,
  Award,
  Zap,
} from "lucide-react";

interface GamesPromotionModalProps {
  /** Permite abrir o modal forçadamente (ex: via botão no dashboard). */
  forceOpen?: boolean;
  onClose?: () => void;
}

const STORAGE_KEY = "crioulo_games_promo_seen_v1";

export function GamesPromotionModal({ forceOpen, onClose }: GamesPromotionModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"both" | "cquoi" | "trilha">("both");
  const [simCountdown, setSimCountdown] = useState(5);

  // Animação de contagem regressiva para simular a dinâmica frenética de 5s do C'est quoi ?
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSimCountdown((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    // Ao fazer login/abrir o painel na sessão atual, verifica se já foi visualizado
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) {
        // Breve delay para a transição suave de entrada após carregar o dashboard
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 450);
        return () => clearTimeout(timer);
      }
    } catch {
      // Caso cookies/storage estejam bloqueados
    }
  }, [forceOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    if (onClose) onClose();
  }, [onClose]);

  // Tecla Esc fecha o modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Listener para evento customizado de reabrir a propaganda de qualquer lugar
  useEffect(() => {
    const handleReopen = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-games-promo", handleReopen);
    return () => window.removeEventListener("open-games-promo", handleReopen);
  }, []);

  const handlePlayGame = (url: string) => {
    handleClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 sm:py-8 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
    >
      <div className="relative my-auto w-full max-w-4xl rounded-3xl border border-white/20 bg-[var(--surface)] text-[var(--text)] shadow-2xl shadow-black/60 overflow-hidden transition-all scale-100 animate-in zoom-in-95 duration-200">
        {/* Faixa Superior com Efeito de Luz */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-500" />

        {/* Botão de Fechar Superior */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 hover:scale-105 transition-all cursor-pointer border border-white/10"
          aria-label="Fechar propaganda"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cabeçalho da Propaganda */}
        <div className="px-5 pt-7 pb-4 sm:px-8 sm:pt-8 text-center border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-2)]/60 to-transparent">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            Espaço de Jogos Interativos da Plataforma
          </div>

          <h2
            id="promo-modal-title"
            className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--text)]"
          >
            Aprenda Jogando: <span className="bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">Dois Mundos Interativos</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Seja bem-vindo! Além das lições estruturadas, você tem acesso a dois jogos completos desenvolvidos para acelerar sua fluência com desafios dinâmicos, áudio nativo e exploração visual.
          </p>

          {/* Abas de Navegação Rápida */}
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("both")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "both"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              Comparar os 2 Jogos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cquoi")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "cquoi"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              🎮 C'est quoi ?
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trilha")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "trilha"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              🏔️ Trilha do Aluno
            </button>
          </div>
        </div>

        {/* Corpo do Modal: Apresentação Detalhada da Dinâmica dos Jogos */}
        <div className="p-4 sm:p-6 lg:p-8 max-h-[68vh] overflow-y-auto">
          <div className={`grid gap-6 ${activeTab === "both" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* ============================================================== */}
            {/* JOGO 1: C'EST QUOI ? */}
            {/* ============================================================== */}
            {(activeTab === "both" || activeTab === "cquoi") && (
              <div className="flex flex-col rounded-2xl border-2 border-blue-500/30 bg-gradient-to-b from-blue-500/[0.07] to-transparent p-5 sm:p-6 shadow-sm hover:border-blue-500/60 transition-all">
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-inner">
                      <Gamepad2 className="h-7 w-7" />
                    </span>
                    <div>
                      <span className="inline-block text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Adivinhação de Vocabulário
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[var(--text)]">C&apos;est quoi ?</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-[11px] font-black text-blue-600 dark:text-blue-300">
                    ⚡ 5 Segundos
                  </span>
                </div>

                {/* Prévia Visual da Dinâmica de C'est quoi */}
                <div className="relative mt-4 aspect-video max-h-72 overflow-hidden rounded-xl border border-blue-500/25 bg-slate-900 shadow-md">
                  {/* Imagem de Fundo / Cena */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/games/cquoi-preview.webp"
                    alt="Cena do jogo C'est quoi ? com um computador para adivinhar"
                    className="h-full w-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
                  />

                  {/* Overlay Interativo Simulando a Dinâmica em Tempo Real */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-3">
                    {/* Timer de 5 segundos no topo */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 text-white px-2.5 py-0.5 text-xs font-bold shadow-md">
                        <Timer className="h-3.5 w-3.5" /> {simCountdown}s restantes
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/60 text-emerald-400 px-2 py-0.5 text-xs font-bold border border-emerald-500/40">
                        <Trophy className="h-3 w-3" /> +100 pts
                      </span>
                    </div>

                    {/* Pergunta e Cartão de Opção na base */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-black font-black text-xs">
                          ?
                        </span>
                        <p className="text-xs font-extrabold text-white drop-shadow">
                          « C&apos;est quoi cet objet ? »
                        </p>
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-blue-300 font-semibold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-400/30">
                          <Volume2 className="h-3 w-3 animate-pulse" /> Áudio nativo
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <span className="rounded-lg bg-white/10 px-2.5 py-1 text-white font-medium border border-white/15 truncate text-center">
                          A) Un livre
                        </span>
                        <span className="rounded-lg bg-blue-600 text-white font-bold border border-blue-400 px-2.5 py-1 truncate text-center shadow-sm">
                          B) Un ordinateur ✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista da Dinâmica do Jogo */}
                <div className="mt-4 space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <p className="font-semibold text-[var(--text)] leading-snug">
                    Como funciona a dinâmica:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                        1
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Cenas Ilustradas & Detalhes:</strong> Uma cena rica surge na tela com uma seta apontando para o objeto misterioso.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                        2
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Desafio Rápido de 5 Segundos:</strong> Treine o cérebro a pensar em francês sem tradução mental intermediária.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                        3
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Áudio com Pronúncia Nativa:</strong> Ouça a sonoridade oficial em cada palavra e acerte a grafia correta.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                        4
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Arena, Conquistas e Temas:</strong> Tecnologia, Cinema, Cozinha, Música, Cultura e centenas de desafios.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Botão de Ação CTA */}
                <button
                  type="button"
                  onClick={() => handlePlayGame("/dashboard/jogo?module=cquoi")}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Jogar C&apos;est quoi ? Agora
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* JOGO 2: TRILHA DO ALUNO CURIOSO */}
            {/* ============================================================== */}
            {(activeTab === "both" || activeTab === "trilha") && (
              <div className="flex flex-col rounded-2xl border-2 border-amber-500/35 bg-gradient-to-b from-amber-500/[0.08] to-transparent p-5 sm:p-6 shadow-sm hover:border-amber-500/60 transition-all">
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-inner">
                      <MountainSnow className="h-7 w-7" />
                    </span>
                    <div>
                      <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Aventura & Exploração 2.5D
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[var(--text)]">
                        Trilha do Aluno Curioso
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-black text-amber-700 dark:text-amber-300">
                    🏔️ 7 Níveis
                  </span>
                </div>

                {/* Prévia Visual da Dinâmica da Trilha */}
                <div className="relative mt-4 aspect-video max-h-72 overflow-hidden rounded-xl border border-amber-500/30 bg-slate-900 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/games/trilha-preview.webp"
                    alt="Trilha ilustrada do jogo Trilha do Aluno Curioso"
                    className="h-full w-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
                  />

                  {/* Overlay Interativo Simulando o Ecossistema da Montanha */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-3">
                    {/* Clima e Fauna no topo */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-slate-950 px-2.5 py-0.5 text-xs font-black shadow-md">
                          <Sun className="h-3 w-3" /> Sol
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-950/80 text-blue-300 border border-indigo-500/40 px-2 py-0.5 text-[11px] font-bold">
                          <Moon className="h-3 w-3 text-amber-300" /> Noite & Luar
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/40 px-2 py-0.5 text-[11px] font-bold">
                          <CloudRain className="h-3 w-3" /> Chuva
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 text-white px-2 py-0.5 text-xs font-black shadow-md">
                        <Flame className="h-3 w-3" /> Avalanche
                      </span>
                    </div>

                    {/* Indicador de Fauna e Aventura na base */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300 drop-shadow flex items-center gap-1.5">
                          🐾 Fauna Viva com Cadeia Alimentar
                        </span>
                        <span className="text-[11px] text-white/90 bg-white/10 backdrop-blur px-2 py-0.5 rounded-full border border-white/20">
                          20 Animais Articulados
                        </span>
                      </div>
                      <p className="text-[11px] text-white/80 leading-tight">
                        Cervo, Onça, Lobo-Guará, Tucano e Sapo interagem e se locomovem pela montanha enquanto você escala identificando elementos ocultos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista da Dinâmica do Jogo */}
                <div className="mt-4 space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <p className="font-semibold text-[var(--text)] leading-snug">
                    Como funciona a dinâmica:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                        1
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Escalada por 7 Níveis de Altitude:</strong> Suba da clareira até o cume nevado, descobrindo objetos em cada bioma.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                        2
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Ecossistema Vivo em Tempo Real:</strong> Animais com 4 patas articuladas, caça e fuga, vaga-lumes bioluminescentes à noite e névoa na chuva.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                        3
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Modo Avalanche Eletrizante:</strong> A neve desce a encosta; responda com precisão para manter distância e escapar a tempo!
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                        4
                      </span>
                      <span>
                        <strong className="text-[var(--text)]">Voz e Pronúncia Autêntica:</strong> Sons ambientes imersivos da mata, vento, chuva e locução de cada objeto.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Botão de Ação CTA */}
                <button
                  type="button"
                  onClick={() => handlePlayGame("/dashboard/jogo?module=trilha")}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-3 font-bold text-white shadow-lg shadow-amber-600/30 hover:from-amber-500 hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Subir a Trilha do Aluno Agora
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé com Botão para Fechar / Continuar no Painel */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-2)]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>
              Você pode voltar a jogar a qualquer momento através do menu <strong>&ldquo;Jogo&rdquo;</strong> na barra de navegação.
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-all cursor-pointer"
            >
              Fechar e ir para o Painel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Banner de Destaque elegante no Dashboard para os alunos reabrirem
 * a propaganda / explicação da dinâmica dos dois jogos sempre que quiserem.
 */
export function GamesPromoSpotlightBanner() {
  const triggerOpen = () => {
    window.dispatchEvent(new CustomEvent("open-games-promo"));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-blue-900/15 via-amber-900/15 to-emerald-900/15 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-blue-600 text-white shadow-md">
            <Gamepad2 className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3 w-3" /> Jogos Educativos
              </span>
              <span className="text-xs text-[var(--text-muted)] hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-[var(--text-secondary)] hidden sm:inline">
                C&apos;est quoi ? &amp; Trilha do Aluno Curioso
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-[var(--text)] mt-0.5">
              Quer treinar jogando? Explore os 2 jogos interativos da plataforma!
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={triggerOpen}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-3.5 py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-2)] shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Ver dinâmica dos jogos
          </button>
          <Link
            href="/dashboard/jogo?module=trilha"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 hover:scale-[1.02] transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Jogar agora
          </Link>
        </div>
      </div>
    </div>
  );
}
