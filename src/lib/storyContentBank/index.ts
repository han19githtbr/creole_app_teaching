import { STORY_SCRIPTS_PART_1 } from "./part1";
import { STORY_SCRIPTS_PART_2 } from "./part2";
import { STORY_SCRIPTS_PART_3 } from "./part3";
import { STORY_SCRIPTS_PART_4 } from "./part4";
import { STORY_SCRIPTS_PART_5 } from "./part5";
import type { StoryScriptItem } from "./types";

export type { LocalizedText, StoryScriptItem } from "./types";

/**
 * Banco completo de roteiros para gravação de áudio na seção de Curiosidades.
 * Contém 150 conteúdos (10 para cada um dos 15 temas do banco de imagens),
 * em Francês e Kreyòl Ayisyen, com tradução de apoio em Português.
 */
export const STORY_CONTENT_BANK: StoryScriptItem[] = [
  ...STORY_SCRIPTS_PART_1,
  ...STORY_SCRIPTS_PART_2,
  ...STORY_SCRIPTS_PART_3,
  ...STORY_SCRIPTS_PART_4,
  ...STORY_SCRIPTS_PART_5,
];

export const STORY_CONTENT_THEMES: string[] = Array.from(
  new Set(STORY_CONTENT_BANK.map((item) => item.theme))
);

export function getStoryScriptsByTheme(theme: string): StoryScriptItem[] {
  if (!theme || theme === "Todos") return STORY_CONTENT_BANK;
  return STORY_CONTENT_BANK.filter((item) => item.theme === theme);
}
