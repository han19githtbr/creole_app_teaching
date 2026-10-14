// Estúdio de Propagandas — tipos compartilhados (cliente e servidor, sem dependência de React).
import type { AppLanguage } from "@/lib/languageShared";

export type FormatId = "feed45" | "square" | "story" | "landscape";

export interface FormatInfo {
  id: FormatId;
  w: number;
  h: number;
  label: string;
  hint: string;
}

export const FORMATS: Record<FormatId, FormatInfo> = {
  feed45: { id: "feed45", w: 1080, h: 1350, label: "Feed 4:5", hint: "Instagram e Facebook (retrato)" },
  square: { id: "square", w: 1080, h: 1080, label: "Quadrado 1:1", hint: "Instagram e Facebook (feed)" },
  story: { id: "story", w: 1080, h: 1920, label: "Story 9:16", hint: "Stories e Reels (Instagram e Facebook)" },
  landscape: { id: "landscape", w: 1200, h: 630, label: "Paisagem 1.91:1", hint: "Link e capa do Facebook" },
};

export const FORMAT_ORDER: FormatId[] = ["feed45", "square", "story", "landscape"];

/** Zonas onde Instagram/Facebook cobrem a imagem nos stories (topo e rodapé). */
export const STORY_SAFE = { top: 250, bottom: 340 };

// ---------------------------------------------------------------------------
// Cores: um valor pode ser "#rrggbb" ou um token de paleta ("@primary").
// ---------------------------------------------------------------------------
export type PaletteToken =
  | "bg1"
  | "bg2"
  | "primary"
  | "accent"
  | "light"
  | "dark"
  | "card"
  | "cardText";

export interface Palette {
  id: string;
  name: string;
  colors: Record<PaletteToken, string>;
}

export type FontId = "sans" | "display" | "serif" | "rounded" | "script" | "mono";

export type PatternId = "none" | "dots" | "rays" | "waves" | "grid" | "confetti" | "diagonal";

export interface Background {
  type: "solid" | "gradient" | "image";
  color: string;
  color2: string;
  angle: number;
  imageSrc: string;
  /** 0–0.9: película escura/colorida sobre a imagem de fundo. */
  overlay: number;
  overlayColor: string;
  /** Desfoque da imagem de fundo, em px. */
  blur: number;
  pattern: PatternId;
  patternOpacity: number;
  patternColor: string;
}

export type ScreenKind = "lessons" | "game" | "ranking" | "video" | "story" | "live" | "achievements";

export interface LayerBase {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  hidden?: boolean;
  locked?: boolean;
  /** Sombra suave atrás da camada. */
  shadow?: boolean;
}

export interface TextLayer extends LayerBase {
  kind: "text";
  text: string;
  font: FontId;
  size: number;
  weight: 400 | 600 | 700 | 800 | 900;
  color: string;
  align: "left" | "center" | "right";
  valign: "top" | "middle" | "bottom";
  italic: boolean;
  uppercase: boolean;
  lineHeight: number;
  letterSpacing: number;
  /** Reduz a fonte automaticamente para o texto caber na caixa. */
  autoFit: boolean;
  strokeColor: string;
  strokeWidth: number;
  /** Fundo atrás do texto (etiqueta). Vazio = sem fundo. */
  bgColor: string;
  bgRadius: number;
  bgPadding: number;
}

export interface ImageLayer extends LayerBase {
  kind: "image";
  src: string;
  fit: "cover" | "contain";
  radius: number;
  borderColor: string;
  borderWidth: number;
  /** Ponto de foco quando fit = cover (0–100). */
  focusX: number;
  focusY: number;
  zoom: number;
}

export interface ShapeLayer extends LayerBase {
  kind: "shape";
  shape: "rect" | "circle";
  fill: string;
  fill2: string;
  angle: number;
  strokeColor: string;
  strokeWidth: number;
  radius: number;
}

export interface PhoneLayer extends LayerBase {
  kind: "phone";
  screen: ScreenKind;
  title: string;
  items: string[];
  imageSrc: string;
  frameColor: string;
  screenColor: string;
  accentColor: string;
}

export interface CardLayer extends LayerBase {
  kind: "card";
  icon: string;
  title: string;
  desc: string;
  fill: string;
  textColor: string;
  accentColor: string;
  radius: number;
  layout: "row" | "column";
}

export interface StatLayer extends LayerBase {
  kind: "stat";
  value: string;
  label: string;
  fill: string;
  valueColor: string;
  labelColor: string;
  radius: number;
}

export interface ListLayer extends LayerBase {
  kind: "list";
  items: string[];
  bullet: string;
  size: number;
  color: string;
  bulletColor: string;
  weight: 400 | 600 | 700 | 800;
  font: FontId;
  gap: number;
}

export interface ButtonLayer extends LayerBase {
  kind: "button";
  text: string;
  icon: string;
  fill: string;
  fill2: string;
  color: string;
  size: number;
  radius: number;
  arrow: boolean;
}

export type Layer = TextLayer | ImageLayer | ShapeLayer | PhoneLayer | CardLayer | StatLayer | ListLayer | ButtonLayer;
export type LayerKind = Layer["kind"];

export interface Slide {
  id: string;
  name: string;
  bg: Background;
  layers: Layer[];
}

export interface Brand {
  /** Nome exibido nas peças (ex.: Prof. Handy). */
  name: string;
  /** @ do Instagram/Facebook. */
  handle: string;
  /** Link da plataforma. */
  url: string;
  /** Contato (WhatsApp, e-mail…) — opcional. */
  contact: string;
}

/** Escolhas feitas ao aplicar um modelo (lição, imagens, desafio…). */
export interface Picks {
  lessonId?: string;
  heroImage?: string;
  gameImage?: string;
  teacherImage?: string;
  challengeId?: string;
  wordIndex?: number;
}

export interface AdDesign {
  version: 1;
  /** Modelo que originou a peça — permite refazer o layout ao trocar de formato ou idioma. */
  source?: { templateId: string; picks: Picks };
  name: string;
  language: AppLanguage;
  format: FormatId;
  paletteId: string;
  /** Paleta própria (quando editada). Tem prioridade sobre paletteId. */
  customPalette?: Palette;
  brand: Brand;
  slides: Slide[];
  caption: string;
}

// ---------------------------------------------------------------------------
// Dados reais da plataforma usados para montar as peças.
// ---------------------------------------------------------------------------
export interface LibImage {
  id: string;
  src: string;
  title: string;
  group: string;
  kind: "ghibli" | "generated" | "cquoi" | "teacher";
  /** Palavras (no idioma ensinado) dos elementos da cena — usadas nos mockups e desafios. */
  elements?: string[];
  /** Imagem tall (retrato) — jogo C'est quoi ? e fotos do professor. */
  portrait?: boolean;
}

export interface AdLesson {
  id: string;
  title: string;
  category: string;
  order: number;
}

export interface AdChallenge {
  id: string;
  label: string;
  image: string;
  answerImage?: string;
  question: string;
  options: string[];
  correct: string;
  explain: string;
}

export interface AdLevel {
  native: string;
  title: string;
  emoji: string;
}

export interface AdBadge {
  native: string;
  title: string;
  emoji: string;
}

export interface AdData {
  language: AppLanguage;
  counts: { lessons: number; videos: number; stories: number; posts: number; images: number };
  lessons: AdLesson[];
  categories: string[];
  images: LibImage[];
  challenges: AdChallenge[];
  levels: AdLevel[];
  badges: AdBadge[];
  gameName: string;
  gameLevels: { label: string; emoji: string; seconds: number }[];
  appUrl: string;
}
