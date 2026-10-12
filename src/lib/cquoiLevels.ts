// Regras dos níveis do jogo "C'est quoi ?" — compartilhadas entre o jogo (cliente)
// e a API do ranking (servidor), por isso este arquivo não depende de React.

export type Level = "easy" | "intermediate" | "master" | "native_word" | "native_phrase";
/** "word" = escolher o nome do objeto · "phrase" = escolher a frase que descreve a imagem. */
export type AnswerMode = "word" | "phrase";

export const LEVEL_ORDER: Level[] = ["easy", "intermediate", "master", "native_word", "native_phrase"];

export interface LevelConfig {
  label: string;
  /** Rótulo curto usado no HUD e no ranking. */
  short: string;
  emoji: string;
  seconds: number;
  multiplier: number;
  rounds: number;
  mode: AnswerMode;
  desc: string;
  /** Classes Tailwind do degradê do nível. */
  grad: string;
  ring: string;
  text: string;
  /** Cor sólida da borda inferior dos botões 3D. */
  edge: string;
  /** Cores (hex) do nível, usadas em estilos inline e no CSS. */
  c1: string;
  c2: string;
}

export const LEVELS: Record<Level, LevelConfig> = {
  easy: {
    label: "Fácil", short: "Fácil", emoji: "🌱", seconds: 15, multiplier: 1, rounds: 10, mode: "word",
    desc: "15 segundos por palavra", grad: "from-emerald-400 to-green-600", ring: "ring-emerald-400", text: "text-emerald-600",
    edge: "border-green-800", c1: "#34d399", c2: "#16a34a",
  },
  intermediate: {
    label: "Intermediário", short: "Interm.", emoji: "⚡", seconds: 10, multiplier: 1.5, rounds: 10, mode: "word",
    desc: "10 segundos por palavra", grad: "from-amber-400 to-orange-500", ring: "ring-amber-400", text: "text-amber-600",
    edge: "border-orange-700", c1: "#fbbf24", c2: "#f97316",
  },
  master: {
    label: "Master", short: "Master", emoji: "🔥", seconds: 5, multiplier: 2, rounds: 10, mode: "word",
    desc: "5 segundos por palavra", grad: "from-rose-500 to-red-700", ring: "ring-rose-500", text: "text-rose-600",
    edge: "border-red-900", c1: "#f43f5e", c2: "#b91c1c",
  },
  native_word: {
    label: "Nativo · Palavra", short: "Nativo P", emoji: "👑", seconds: 4, multiplier: 2.5, rounds: 20, mode: "word",
    desc: "20 imagens · 4 segundos por palavra", grad: "from-violet-500 via-fuchsia-500 to-indigo-700", ring: "ring-violet-500", text: "text-violet-600",
    edge: "border-indigo-900", c1: "#8b5cf6", c2: "#4338ca",
  },
  native_phrase: {
    label: "Nativo · Frase", short: "Nativo F", emoji: "💎", seconds: 9, multiplier: 3, rounds: 20, mode: "phrase",
    desc: "20 imagens · 9 segundos por frase", grad: "from-fuchsia-500 via-purple-600 to-indigo-800", ring: "ring-fuchsia-500", text: "text-fuchsia-600",
    edge: "border-purple-950", c1: "#d946ef", c2: "#6d28d9",
  },
};

export const MAX_ATTEMPTS = 2; // 1ª tentativa + mais uma
export const PASS_RATIO = 0.7; // 70% de acertos para passar de nível

/** Quanto da pontuação da rodada se perde ao usar a Dica. */
export const HINT_PENALTY = 0.4;
/** Perda total quando o jogador também pede a pista da letra inicial. */
export const HINT_LETTER_PENALTY = 0.55;

export function isLevel(value: unknown): value is Level {
  return typeof value === "string" && (LEVEL_ORDER as string[]).includes(value);
}

export function passTarget(level: Level, total = LEVELS[level].rounds): number {
  return Math.max(1, Math.ceil(total * PASS_RATIO));
}

/** Pontuação máxima possível numa partida — usada pelo servidor para recusar valores impossíveis. */
export function maxScoreFor(level: Level): number {
  const cfg = LEVELS[level];
  // por rodada: base 10 + bônus de tempo 10 + bônus de combo 10, vezes o multiplicador
  return Math.round(cfg.rounds * 30 * cfg.multiplier) + cfg.rounds;
}
