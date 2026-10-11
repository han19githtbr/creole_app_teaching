// Configuração compartilhada (cliente e servidor) da geração de imagens por IA.
// Nada aqui importa código de servidor, então pode ser usado em componentes "use client".
import type { AppLanguage } from "@/lib/languageShared";

export type ImageSection = "posts" | "stories" | "cquoi";
export type ImageEngine = "image" | "svg";
export type GeneratedStatus = "pending" | "approved" | "rejected";

/** Limite diário de chamadas de geração (protege a cota gratuita da IA). Padrão: 5 por dia. */
export const IMAGE_GEN_DAILY_LIMIT = (() => {
  const value = Number(process.env.IMAGE_GEN_DAILY_LIMIT);
  return Number.isInteger(value) && value > 0 ? value : 5;
})();

/** Nota mínima (0–10) da revisão automática para a imagem seguir para a fila de aprovação. */
export const IMAGE_GEN_MIN_SCORE = 7;
/** Nota a partir da qual a aprovação automática (opcional, por pedido) é permitida. */
export const IMAGE_GEN_AUTO_APPROVE_SCORE = 8.5;
/** Máximo de imagens que um único pedido pode solicitar. */
export const IMAGE_GEN_MAX_PER_JOB = 200;

export const SECTION_META: Record<
  ImageSection,
  { label: string; short: string; hint: string; language: AppLanguage }
> = {
  posts: {
    label: "Postagens e jogo de identificar elementos",
    short: "Postagens",
    hint: "Cena com 4 elementos em Kreyòl. Aparece no seletor de imagens das postagens e no jogo de identificar elementos.",
    language: "kreyol",
  },
  stories: {
    label: "Histórias animadas",
    short: "Histórias",
    hint: "Cena com 4 elementos bem separados (cada um recebe um rótulo animado na história). Aparece no seletor das histórias.",
    language: "kreyol",
  },
  cquoi: {
    label: "Jogo C'est quoi ? (francês)",
    short: "C'est quoi ?",
    hint: "Um objeto novo em contexto, com a seta vermelha apontando para ele. Entra direto no jogo C'est quoi ? depois de aprovado.",
    language: "francais",
  },
};

export const ENGINE_META: Record<ImageEngine, { label: string; hint: string }> = {
  image: {
    label: "Pintura Ghibli (Gemini — imagem)",
    hint: "Melhor qualidade visual. Usa o modelo de imagem do Gemini (verifique no Google AI Studio se a sua chave tem cota para imagens).",
  },
  svg: {
    label: "Vetor SVG (Gemini — texto)",
    hint: "Mesmo formato das imagens atuais do app (SVG). Usa o modelo de texto, que costuma ter cota gratuita; qualidade mais simples.",
  },
};

export const THEMES: { id: string; label: string; kreyol: string }[] = [
  { id: "tecnologia", label: "Tecnologia", kreyol: "Teknoloji" },
  { id: "natureza", label: "Natureza", kreyol: "Lanati" },
  { id: "cultura", label: "Cultura", kreyol: "Kilti" },
  { id: "turismo", label: "Turismo", kreyol: "Touris" },
  { id: "interior", label: "Vida no interior", kreyol: "Andeyò" },
  { id: "danca", label: "Dança", kreyol: "Dans" },
  { id: "geografia", label: "Geografia", kreyol: "Jewografi" },
  { id: "historia", label: "História", kreyol: "Istwa" },
  { id: "cinema", label: "Cinema", kreyol: "Sinema" },
  { id: "musica", label: "Música", kreyol: "Mizik" },
  { id: "lazeres", label: "Lazeres", kreyol: "Lwazi" },
  { id: "estoicismo", label: "Estoicismo", kreyol: "Sajès" },
  { id: "religiao", label: "Religião", kreyol: "Relijyon" },
  { id: "gastronomia", label: "Gastronomia", kreyol: "Manje" },
];

export const isSection = (value: unknown): value is ImageSection =>
  value === "posts" || value === "stories" || value === "cquoi";
export const isEngine = (value: unknown): value is ImageEngine => value === "image" || value === "svg";
export const getTheme = (id: unknown) => THEMES.find((theme) => theme.id === id);

/** Dia (AAAA-MM-DD) no fuso de Brasília — é por ele que a cota diária zera. */
export function saoPauloDay(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
