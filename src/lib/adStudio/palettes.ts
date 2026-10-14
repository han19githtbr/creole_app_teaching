import type { FontId, Palette, PaletteToken } from "./types";

export const PALETTES: Palette[] = [
  {
    id: "haiti",
    name: "Haiti · azul e vermelho",
    colors: { bg1: "#0b1b6e", bg2: "#1e3fd1", primary: "#fbbf24", accent: "#e11d48", light: "#ffffff", dark: "#0a1240", card: "#ffffff", cardText: "#10163a" },
  },
  {
    id: "france",
    name: "França · bleu, blanc, rouge",
    colors: { bg1: "#10206b", bg2: "#2c4fc7", primary: "#ef4444", accent: "#fcd34d", light: "#ffffff", dark: "#0b1450", card: "#ffffff", cardText: "#10206b" },
  },
  {
    id: "ghibli",
    name: "Floresta · verde Ghibli",
    colors: { bg1: "#0f4c3a", bg2: "#2f9e6e", primary: "#fde68a", accent: "#f97316", light: "#fffdf2", dark: "#06281f", card: "#fffdf2", cardText: "#0f3b2e" },
  },
  {
    id: "sunset",
    name: "Pôr do sol caribenho",
    colors: { bg1: "#7c1d6f", bg2: "#f97316", primary: "#fef08a", accent: "#22d3ee", light: "#ffffff", dark: "#3b0a37", card: "#fff7ed", cardText: "#4a1042" },
  },
  {
    id: "app",
    name: "Cores do app · roxo",
    colors: { bg1: "#1b0a8a", bg2: "#3a1df4", primary: "#fbbf24", accent: "#34d399", light: "#ffffff", dark: "#0c0540", card: "#ffffff", cardText: "#1a1060" },
  },
  {
    id: "cream",
    name: "Creme elegante",
    colors: { bg1: "#fff7e6", bg2: "#fde7c0", primary: "#b45309", accent: "#1d4ed8", light: "#ffffff", dark: "#3b2a14", card: "#ffffff", cardText: "#3b2a14" },
  },
  {
    id: "night",
    name: "Noite · preto e dourado",
    colors: { bg1: "#07070c", bg2: "#1c1c2e", primary: "#f5c542", accent: "#ec4899", light: "#ffffff", dark: "#000000", card: "#1f2033", cardText: "#ffffff" },
  },
];

export const DEFAULT_PALETTE: Record<"kreyol" | "francais", string> = { kreyol: "haiti", francais: "france" };

export const TOKEN_LABELS: Record<PaletteToken, string> = {
  bg1: "Fundo 1",
  bg2: "Fundo 2",
  primary: "Destaque",
  accent: "Realce",
  light: "Claro",
  dark: "Escuro",
  card: "Cartão",
  cardText: "Texto do cartão",
};

export const TOKEN_ORDER: PaletteToken[] = ["bg1", "bg2", "primary", "accent", "light", "dark", "card", "cardText"];

export function resolveColor(value: string, palette: Palette): string {
  if (!value) return "";
  if (value.startsWith("@")) {
    const token = value.slice(1) as PaletteToken;
    return palette.colors[token] ?? "#ffffff";
  }
  return value;
}

export const FONT_STACKS: Record<FontId, string> = {
  sans: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  display: "'Arial Black', 'Segoe UI Black', Impact, Haettenschweiler, sans-serif",
  serif: "Georgia, 'Times New Roman', 'Noto Serif', serif",
  rounded: "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif",
  script: "'Segoe Script', 'Brush Script MT', 'Apple Chancery', cursive",
  mono: "'Courier New', Consolas, monospace",
};

export const FONT_LABELS: Record<FontId, string> = {
  sans: "Moderna",
  display: "Impacto",
  serif: "Clássica",
  rounded: "Arredondada",
  script: "Manuscrita",
  mono: "Máquina",
};
