import imageSceneVariants from "./imageSceneVariants.json";
import type { BankImage } from "./imageBank";
import { kreyolToFrench } from "./frenchVocabulary";

export interface ImageQuizConfig {
  options: string[];
  answers: string[];
}

export const MIN_IMAGE_QUIZ_OPTIONS = 2;
export const MAX_IMAGE_QUIZ_OPTIONS = 20;

const THEME_QUIZZES: Record<string, ImageQuizConfig> = {
  Tecnologia: { options: ["òdinatè", "robo", "dròn", "moulen van", "tanbou", "legliz", "papiyon", "bato", "bouji", "pòm"], answers: ["òdinatè", "robo", "dròn", "moulen van"] },
  Natureza: { options: ["pyebwa", "flè", "papiyon", "zwazo", "robo", "dròn", "tanbou", "legliz", "bato", "òdinatè"], answers: ["pyebwa", "flè", "papiyon", "zwazo"] },
  Cultura: { options: ["tanbou", "drapo", "lanp", "kay", "òdinatè", "bato", "pòm", "liv", "bisiklèt", "chodyè"], answers: ["tanbou", "drapo", "lanp", "kay"] },
  Turismo: { options: ["bato", "lanmè", "balon", "fa", "tanbou", "òdinatè", "legliz", "pòm", "liv", "papiyon"], answers: ["bato", "lanmè", "balon", "fa"] },
  "Vida no interior": { options: ["kay", "pyebwa", "jaden", "kloti", "dròn", "tanbou", "legliz", "balon", "liv", "lanp"], answers: ["kay", "pyebwa", "jaden", "kloti"] },
  Dança: { options: ["dansè", "lanp", "riban", "flè", "òdinatè", "bato", "pòm", "fa", "liv", "kloti"], answers: ["dansè", "lanp", "riban", "flè"] },
  Geografia: { options: ["mòn", "rivyè", "bousòl", "drapo", "tanbou", "pòm", "legliz", "liv", "bato", "bouji"], answers: ["mòn", "rivyè", "bousòl", "drapo"] },
  História: { options: ["fò", "drapo", "kanon", "flanbo", "òdinatè", "pòm", "bisiklèt", "balon", "chodyè", "papiyon"], answers: ["fò", "drapo", "kanon", "flanbo"] },
  Cinema: { options: ["sinema", "pòp-kòn", "zetwal", "pyebwa", "tanbou", "legliz", "bato", "kloti", "konpa", "bouji"], answers: ["sinema", "pòp-kòn", "zetwal", "pyebwa"] },
  Música: { options: ["gita", "tanbou", "nòt mizik", "opalè", "bato", "legliz", "pòm", "kloti", "fa", "rivyè"], answers: ["gita", "tanbou", "nòt mizik", "opalè"] },
  Lazeres: { options: ["kap", "bisiklèt", "pyebwa", "dra", "òdinatè", "tanbou", "legliz", "fa", "chodyè", "konpa"], answers: ["kap", "bisiklèt", "pyebwa", "dra"] },
  Estoicismo: { options: ["kolòn", "liv", "pye oliv", "moun saj", "dròn", "tanbou", "balon", "pòp-kòn", "bato", "bouji"], answers: ["kolòn", "liv", "pye oliv", "moun saj"] },
  Religião: { options: ["legliz", "bouji", "pijon", "kwa", "òdinatè", "bisiklèt", "kap", "fa", "gita", "pòm"], answers: ["legliz", "bouji", "pijon", "kwa"] },
  Gastronomia: { options: ["chodyè", "pen", "fwi", "piman", "dròn", "legliz", "bisiklèt", "konpa", "fa", "papiyon"], answers: ["chodyè", "pen", "fwi", "piman"] },
  Idiomas: { options: ["liv", "glòb", "dyalòg", "lèt", "bato", "tanbou", "legliz", "pòm", "fa", "bisiklèt"], answers: ["liv", "glòb", "dyalòg", "lèt"] },
};

const sceneData = imageSceneVariants as Record<string, {
  options: string[];
  labels: Record<string, string>;
  scenes: { objects: string[] }[];
}>;

export function getDefaultImageQuiz(theme: string, imageId?: string): ImageQuizConfig | undefined {
  const variant = Number(imageId?.match(/-(\d{2})$/)?.[1] ?? 1);
  const themeData = sceneData[theme];
  const scene = variant > 1 ? themeData?.scenes[variant - 2] : undefined;
  if (scene && themeData) {
    const answers = scene.objects.map((object) => themeData.labels[object]);
    // Temas com vocabulário próprio por cena (ex.: Cultura e Natureza): as respostas nem sempre estão na lista
    // fixa do tema, então o desafio usa as respostas da cena + palavras distratoras do mesmo tema.
    if (!answers.every((word) => themeData.options.includes(word))) {
      const pool = Array.from(new Set(Object.values(themeData.labels))).filter((word) => !answers.includes(word));
      const start = pool.length ? (variant * 7) % pool.length : 0;
      const distractors = [...pool.slice(start), ...pool.slice(0, start)].slice(0, Math.max(0, 10 - answers.length));
      const key = (word: string) => {
        let h = variant;
        for (const ch of word) h = (h * 31 + ch.charCodeAt(0)) % 9973;
        return h;
      };
      return { options: [...answers, ...distractors].sort((a, b) => key(a) - key(b)), answers };
    }
    return {
      options: themeData.options,
      answers,
    };
  }
  return THEME_QUIZZES[theme];
}

/** Passa as palavras do desafio (guardadas em Kreyòl) para o francês, sem repetir palavras. */
export function translateQuizToFrench(quiz: ImageQuizConfig, theme?: string): ImageQuizConfig {
  const unique = (words: string[]) => words.filter((word, index) => words.indexOf(word) === index);
  return {
    options: unique(quiz.options.map((word) => kreyolToFrench(word, theme))),
    answers: unique(quiz.answers.map((word) => kreyolToFrench(word, theme))),
  };
}

/**
 * Desafio de uma imagem do banco: imagens geradas por IA já trazem o seu; as demais usam o padrão do tema.
 * No painel em francês as palavras saem em francês.
 */
export function getQuizForImage(
  image: Pick<BankImage, "theme" | "id" | "quiz">,
  language: "kreyol" | "francais" = "kreyol"
): ImageQuizConfig | undefined {
  const quiz = image.quiz ?? getDefaultImageQuiz(image.theme, image.id);
  return quiz && language === "francais" ? translateQuizToFrench(quiz, image.theme) : quiz;
}

export function isValidImageQuiz(value: unknown): value is ImageQuizConfig {
  if (!value || typeof value !== "object") return false;
  const quiz = value as Partial<ImageQuizConfig>;
  if (!Array.isArray(quiz.options) || !Array.isArray(quiz.answers)) return false;
  if (
    quiz.options.length < MIN_IMAGE_QUIZ_OPTIONS ||
    quiz.options.length > MAX_IMAGE_QUIZ_OPTIONS ||
    quiz.answers.length < 1
  ) return false;
  if (quiz.options.some((word) => typeof word !== "string" || !word.trim())) return false;
  if (quiz.answers.some((word) => typeof word !== "string" || !word.trim())) return false;
  const options = quiz.options.map((word) => word.trim().toLocaleLowerCase());
  const answers = quiz.answers.map((word) => word.trim().toLocaleLowerCase());
  return new Set(options).size === options.length && answers.every((word) => options.includes(word));
}

export function normalizeImageQuiz(value: ImageQuizConfig): ImageQuizConfig {
  return {
    options: value.options.map((word) => word.trim()),
    answers: value.answers.map((word) => word.trim()),
  };
}
