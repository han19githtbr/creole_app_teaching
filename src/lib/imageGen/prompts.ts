// Planejamento de cada imagem + prompts. O vocabulário em Kreyòl NUNCA é inventado pela IA:
// os elementos saem da lista já usada (e revisada) pelo app; a IA só desenha e revisa o desenho.
import imageSceneVariants from "@/lib/imageSceneVariants.json";
import { KREYOL_TO_PT } from "@/lib/imageBank";
import { THEMES } from "@/lib/imageGen/config";

type SceneData = Record<string, { options: string[]; labels: Record<string, string> }>;
const sceneData = imageSceneVariants as SceneData;

export interface Vocab {
  en: string;
  kreyol: string;
  pt: string;
}

export const SLOTS = [
  { where: "lower-left area", anchor: { left: 27, top: 64 } },
  { where: "lower-right area", anchor: { left: 73, top: 64 } },
  { where: "upper-left area (hanging, flying, or on a hill)", anchor: { left: 28, top: 28 } },
  { where: "upper-right area (hanging, flying, or on a hill)", anchor: { left: 72, top: 30 } },
];

export const GHIBLI_STYLE =
  "hand-painted Studio Ghibli-inspired anime background illustration, soft watercolor and gouache texture, warm natural light, gentle gradients, harmonious saturated palette, clean readable silhouettes, subtle paper grain";

const SETTINGS = [
  "bright sunny midday with fluffy white clouds",
  "golden-hour sunset glow",
  "soft misty morning light",
  "clear dusk with warm glowing lanterns",
  "fresh air after light rain with a faint rainbow",
  "gentle afternoon with long soft shadows",
];

/** Acompanha o prompt quando há imagens de referência anexadas. */
export const REFERENCE_NOTE =
  "The attached images are existing illustrations from the app. Match their art style closely: the same palette and color saturation, soft shading, level of detail, simplicity of shapes and clarity of the main objects. Draw a NEW scene with the requested objects; do NOT copy their composition or reuse their objects.";

export const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Palavras do tema (Kreyòl + português + nome em inglês para o prompt de imagem). */
export function vocabularyFor(themeLabel: string): Vocab[] {
  const theme = sceneData[themeLabel];
  if (!theme) return [];
  return Object.entries(theme.labels)
    .map(([en, kreyol]) => ({ en: en.replace(/_/g, " "), kreyol, pt: KREYOL_TO_PT[kreyol] }))
    .filter((word): word is Vocab => Boolean(word.pt));
}

export interface ScenePlan {
  themeId: string;
  themeLabel: string;
  themeKreyol: string;
  objects: Vocab[];
  setting: string;
  title: string;
  caption: string;
  quiz: { options: string[]; answers: string[] };
}

/** Escolhe 4 elementos do tema e monta título, legenda e desafio (10 palavras, 4 certas). */
export function planScene(themeId: string): ScenePlan {
  const theme = THEMES.find((item) => item.id === themeId) ?? pick(THEMES);
  const pool = vocabularyFor(theme.label);
  if (pool.length < 4) throw new Error(`O tema ${theme.label} não tem vocabulário suficiente para gerar cenas.`);
  const objects = shuffle(pool).slice(0, 4);

  const answers = objects.map((object) => object.kreyol);
  const distractors = shuffle(
    THEMES.filter((other) => other.id !== theme.id)
      .flatMap((other) => vocabularyFor(other.label).map((word) => word.kreyol))
      .filter((word, index, all) => all.indexOf(word) === index && !answers.includes(word))
  ).slice(0, 6);

  const title = `${theme.label}: ${objects.map((object) => object.pt.split("/")[0]).join(", ")}`;
  return {
    themeId: theme.id,
    themeLabel: theme.label,
    themeKreyol: theme.kreyol,
    objects,
    setting: pick(SETTINGS),
    title,
    caption: `${title} (${theme.label}): identifique na cena ${objects.map((object) => `${object.pt} (${object.kreyol})`).join(", ")}.`,
    quiz: { answers, options: shuffle([...answers, ...distractors]) },
  };
}

export function scenePrompt(plan: ScenePlan, forStory: boolean): string {
  const list = plan.objects.map((object, index) => `${index + 1}. ${object.en} — in the ${SLOTS[index].where}`).join("\n");
  return [
    `Illustration for a language-learning app, theme "${plan.themeLabel}".`,
    `Style: ${GHIBLI_STYLE}. Wide 3:2 landscape composition.`,
    `Mood: ${plan.setting}.`,
    `Show EXACTLY these 4 key objects, each one clearly recognisable, completely visible (never cropped), large (about 15-25% of the image width), with open space around it, and not overlapping any other key object:`,
    list,
    forStory
      ? "Leave a calm area above each object so an animated label can sit there. Keep the background simple so the four objects stand out."
      : "Keep the rest of the scene simple and uncluttered so the four objects stand out.",
    "Do not draw any text, letters, numbers, logos, written signs, borders, frames or watermarks. Avoid close-up faces.",
  ].join("\n");
}

export function svgScenePrompt(plan: ScenePlan, reference: string | null): string {
  const prefix = `g${Math.random().toString(36).slice(2, 6)}`;
  return [
    "Você é ilustrador vetorial. Crie UMA cena em SVG no MESMO formato e estilo da referência (estilo Studio Ghibli: céu em gradiente, colinas em camadas, sombras suaves, textura de papel).",
    "REGRAS OBRIGATÓRIAS:",
    '- viewBox="0 0 1200 800" width="1200" height="800".',
    "- Apenas elementos estáticos: g, defs, linearGradient, radialGradient, filter (feGaussianBlur/feTurbulence/feDropShadow), path, rect, circle, ellipse, polygon. Sem script, image, text, animações ou links externos.",
    `- IDs únicos com prefixo "${prefix}-". No máximo ~9 KB de código.`,
    `- Tema: ${plan.themeLabel}. Clima: ${plan.setting}.`,
    `- Desenhe EXATAMENTE estes 4 objetos, grandes, com vários detalhes, bem separados e sem sobreposição: ${plan.objects
      .map((object, index) => `${index + 1}) ${object.en} (${SLOTS[index].where})`)
      .join("; ")}.`,
    "Responda SOMENTE com o código SVG, começando em <svg e terminando em </svg>.",
    reference ? `\nREFERÊNCIA DE ESTILO (não copie a cena, apenas o estilo e a técnica):\n${reference}` : "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// C'est quoi ? (francês)
// ---------------------------------------------------------------------------
export interface CquoiProposal {
  article: string;
  name: string;
  english: string;
  context: string;
}

export function cquoiProposalPrompt(themeLabel: string, taken: string[]): string {
  return [
    'Você ajuda a montar o jogo de vocabulário de francês "C\'est quoi ?" (aluno vê um objeto e escolhe o nome em francês).',
    `Tema: ${themeLabel}.`,
    "Proponha UM objeto concreto, fácil de reconhecer numa ilustração, que NÃO esteja nesta lista de nomes já usados:",
    taken.join(", ") || "(nenhum)",
    "Regras: nome em francês correto, sem o artigo no campo name; article deve ser exatamente um de: Un, Une, Des, Du; english = nome do objeto em inglês; context = descrição curta em inglês de um lugar simples e natural onde o objeto aparece.",
    'Responda SOMENTE com JSON: {"article":"Un","name":"...","english":"...","context":"..."}',
  ].join("\n");
}

export function cquoiPrompt(themeLabel: string, proposal: CquoiProposal): string {
  return [
    `Illustration for a French vocabulary game, theme "${themeLabel}".`,
    `Style: ${GHIBLI_STYLE}. Landscape composition, about 7:5.`,
    `Show ONE main object: ${proposal.english}. It must be large, near the center, perfectly recognisable and completely visible, resting naturally in this simple setting: ${proposal.context}.`,
    "No other object that could be confused with it. Do not draw any text, letters, numbers, logos, borders, frames or watermarks.",
  ].join("\n");
}

export function cquoiSvgPrompt(themeLabel: string, proposal: CquoiProposal, reference: string | null): string {
  const prefix = `g${Math.random().toString(36).slice(2, 6)}`;
  return [
    "Você é ilustrador vetorial. Crie UMA cena em SVG no MESMO formato e estilo da referência (cena simples e colorida com um único objeto em destaque).",
    "REGRAS OBRIGATÓRIAS:",
    '- viewBox="0 0 490 350" width="490" height="350".',
    "- Apenas elementos estáticos: g, defs, linearGradient, radialGradient, path, rect, circle, ellipse, polygon. Sem script, image, text, animações ou links externos.",
    `- IDs únicos com prefixo "${prefix}-". No máximo ~7 KB.`,
    `- Tema: ${themeLabel}. Objeto principal: ${proposal.english}, grande, no centro, bem detalhado e inconfundível. Cenário: ${proposal.context}.`,
    "Responda SOMENTE com o código SVG, começando em <svg e terminando em </svg>.",
    reference ? `\nREFERÊNCIA DE ESTILO (não copie a cena):\n${reference}` : "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Revisão automática (visão): confere os objetos, o estilo e devolve a posição de cada um.
// ---------------------------------------------------------------------------
export function reviewPrompt(objects: string[]): string {
  return [
    "Você é revisor de qualidade de ilustrações de um app de ensino de idiomas.",
    "Estilo desejado: ilustração pintada à mão inspirada no Studio Ghibli, composição limpa e colorida.",
    `Objetos obrigatórios: ${JSON.stringify(objects)}.`,
    "Analise a imagem e responda SOMENTE com JSON neste formato:",
    '{"score": 0-10, "has_text_or_watermark": false, "objects": [{"name": "...", "visible": true, "box_2d": [ymin, xmin, ymax, xmax]}], "issues": ["..."]}',
    "box_2d usa coordenadas normalizadas de 0 a 1000. Se o objeto não aparece de forma clara, use visible=false e box_2d=null.",
    "A nota considera: objetos obrigatórios reconhecíveis (peso maior), formas naturais sem deformações, nitidez, ausência de letras/marca d'água e estilo.",
    "Em issues, liste em português (curto) cada problema encontrado; lista vazia se estiver tudo certo.",
  ].join("\n");
}
