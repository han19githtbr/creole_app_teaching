// Planejamento de cada imagem + prompts. O vocabulário em Kreyòl NUNCA é inventado pela IA:
// os elementos saem da lista já usada (e revisada) pelo app; a IA só desenha e revisa o desenho.
import imageSceneVariants from "@/lib/imageSceneVariants.json";
import { KREYOL_TO_PT, getElementLabel } from "@/lib/imageBank";
import { THEMES, type ImageEngine } from "@/lib/imageGen/config";
import type { AppLanguage } from "@/lib/languageShared";

type SceneData = Record<string, { options: string[]; labels: Record<string, string> }>;
const sceneData = imageSceneVariants as SceneData;

export interface Vocab {
  en: string;
  kreyol: string;
  pt: string;
  fr?: string;
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

/** Palavras do tema (Kreyòl + português + francês + nome em inglês para o prompt de imagem). */
export function vocabularyFor(themeLabel: string): Vocab[] {
  const theme = sceneData[themeLabel];
  if (!theme) return [];
  return Object.entries(theme.labels)
    .map(([en, kreyol]): Vocab | null => {
      const pt = KREYOL_TO_PT[kreyol];
      if (!pt) return null;
      return {
        en: en.replace(/_/g, " "),
        kreyol,
        pt,
        fr: getElementLabel({ kreyol, pt }, "francais"),
      };
    })
    .filter((word): word is Vocab => word !== null);
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
export function planScene(themeId: string, language: AppLanguage = "kreyol"): ScenePlan {
  const theme = THEMES.find((item) => item.id === themeId) ?? pick(THEMES);
  const pool = vocabularyFor(theme.label);
  if (pool.length < 4) throw new Error(`O tema ${theme.label} não tem vocabulário suficiente para gerar cenas.`);
  const objects = shuffle(pool).slice(0, 4);

  const isFr = language === "francais";
  const wordFor = (object: Vocab) => (isFr ? object.fr || object.kreyol : object.kreyol);

  const answers = objects.map(wordFor);
  const distractors = shuffle(
    THEMES.filter((other) => other.id !== theme.id)
      .flatMap((other) => vocabularyFor(other.label).map(wordFor))
      .filter((word, index, all) => all.indexOf(word) === index && !answers.includes(word))
  ).slice(0, 6);

  const title = `${theme.label}: ${objects.map((object) => object.pt.split("/")[0]).join(", ")}`;
  const captionLabels = objects.map((object) => `${object.pt} (${wordFor(object)})`).join(", ");
  return {
    themeId: theme.id,
    themeLabel: theme.label,
    themeKreyol: theme.kreyol,
    objects,
    setting: pick(SETTINGS),
    title,
    caption: `${title} (${theme.label}): identifique na cena ${captionLabels}.`,
    quiz: { answers, options: shuffle([...answers, ...distractors]) },
  };
}


/**
 * O que pertence (e o que NÃO pertence) a cada tema. Entra nos prompts de geração e na revisão automática, para que
 * a IA não "invente" cenário genérico (mar e barcos, por exemplo) em temas que não têm nada a ver com isso.
 */
export const THEME_SCENE_RULES: Record<string, { context: string; life: string; forbid: string }> = {
  Tecnologia: { context: "technology, computers, robots, drones, satellites, renewable energy and science labs", life: "a small robot working, a drone flying, a wind turbine turning, a satellite dish tracking", forbid: "farm animals, traditional festivals, religious buildings, historic castles, sailing boats" },
  Natureza: { context: "wild nature: forests, rivers, waterfalls, oceans, palm trees, flowers and wild animals", life: "butterflies and birds flying, a river flowing, a turtle walking, flowers swaying in the wind", forbid: "cities, vehicles, machines, crowds, buildings, roads, electronics" },
  Cultura: { context: "Haitian culture: festivals, drums, flags, lanterns, traditional clothes, masks, crafts and street markets", life: "people dancing and playing drums, vendors selling food and cloth, a parade with flags and lanterns", forbid: "airports, modern gadgets, sports stadiums, castles, sailing ships, office or laboratory scenes" },
  Turismo: { context: "tourism and travel: beaches, lighthouses, boats, hotels, airplanes, hot-air balloons, maps and suitcases", life: "boats sailing, an airplane taking off, tourists with suitcases arriving at a hotel, a hot-air balloon drifting", forbid: "farms, laboratories, churches, theatre or cinema interiors, battle scenes" },
  "Vida no interior": { context: "rural life in the countryside: farm houses, gardens, wells, fences, wheat, goats, chickens and tractors", life: "chickens pecking, a farmer driving a tractor, goats grazing, smoke rising from a chimney", forbid: "skyscrapers, airports, laboratories, beaches with hotels, stages, cinemas" },
  Dança: { context: "dance: dancers in colourful costumes, drums, ribbons, fans, lanterns and a stage", life: "dancers spinning with ribbons, drummers playing, fans waving", forbid: "farm work, vehicles, laboratories, boats, sports, cooking" },
  Geografia: { context: "geography: mountains, rivers, islands, volcanoes, bridges, forests, oceans, maps and compasses", life: "a river flowing, smoke rising from a volcano, a flag waving on a summit, a hiker consulting a compass", forbid: "festivals, interiors, kitchens, stages, cinemas, concerts" },
  História: { context: "history: fortresses, cannons, torches, old sailing ships, horses, monuments, old houses and books", life: "torches flickering, a knight on a horse, an old ship sailing, flags waving on the fortress", forbid: "modern cars, airplanes, computers, phones, skyscrapers, electronics, modern clothes" },
  Cinema: { context: "cinema: movie theatres, projectors, screens, popcorn, tickets, film cameras and audience seats", life: "a projector beam, an audience watching, popcorn being eaten, a film crew filming", forbid: "farms, beaches, laboratories, churches, sports fields, kitchens" },
  Música: { context: "music: guitars, drums, pianos, keyboards, speakers, microphones, headphones and stage lights", life: "musical notes floating, a guitarist and drummer performing, stage lights sweeping", forbid: "farm work, vehicles, laboratories, boats, sports, kitchens" },
  Lazeres: { context: "leisure: kites, bicycles, picnics, swings, balls, ducks in a pond, parks and books", life: "a kite flying, children playing with a ball, a family on a picnic blanket, someone cycling", forbid: "laboratories, battle scenes, churches, stages, industrial machines" },
  Estoicismo: { context: "Stoic philosophy: marble columns, scrolls, books, olive trees, statues, lamps, gates and quiet paths", life: "a sage reading a scroll, a student listening, olive leaves moving in the breeze, a lamp flickering", forbid: "modern gadgets, vehicles, festivals, sports, farm machinery, crowds" },
  Religião: { context: "religion: churches, candles, doves, crosses, holy books, stained-glass windows, bells and pews", life: "doves flying, candle flames flickering, people praying quietly, a bell ringing", forbid: "sports, parties, machines, weapons, laboratories, cooking, cinemas" },
  Gastronomia: { context: "gastronomy: kitchens, pots, bread, fruit, peppers, vegetables, tables, plates and cutlery", life: "steam rising from a pot, a cook stirring, a family eating at a table", forbid: "laboratories, vehicles, battle scenes, stages, churches, sports" },
  Idiomas: { context: "language learning: books, dictionaries, globes, speech bubbles, letters, a blackboard, a teacher and students", life: "a teacher writing on a blackboard, students raising hands, speech bubbles appearing", forbid: "farms, boats, battle scenes, sports, kitchens, machines" },
};

const themeRule = (label: string) => THEME_SCENE_RULES[label];

function themeLines(label: string): string[] {
  const r = themeRule(label);
  if (!r) return [];
  return [
    `EVERYTHING in the image must belong to the theme "${label}" (${r.context}). The whole scene, the background and every extra detail must clearly say "${label}" at first glance.`,
    `Do NOT draw anything that does not belong to this theme (for example: ${r.forbid}).`,
  ];
}

export function scenePrompt(plan: ScenePlan, forStory: boolean): string {
  const list = plan.objects.map((object, index) => `${index + 1}. ${object.en} — in the ${SLOTS[index].where}`).join("\n");
  return [
    `Illustration for a language-learning app, theme "${plan.themeLabel}".`,
    `Style: ${GHIBLI_STYLE}. Wide 3:2 landscape composition.`,
    `Mood: ${plan.setting}.`,
    ...themeLines(plan.themeLabel),
    `Show EXACTLY these 4 key objects, each one clearly recognisable, completely visible (never cropped), large (about 15-25% of the image width), with open space around it, and not overlapping any other key object:`,
    list,
    forStory
      ? `Leave a calm area above each object so an animated label can sit there. Add movie-like life that fits THIS theme only (${themeRule(plan.themeLabel)?.life ?? "small natural movements"}), matching a frame of an animated film.`
      : "Keep the rest of the scene simple and uncluttered so the four objects stand out.",
    "Do not draw any text, letters, numbers, logos, written signs, borders, frames or watermarks. Avoid close-up faces.",
  ].join("\n");
}

export function svgScenePrompt(plan: ScenePlan, reference: string | null, forStory = false): string {
  const prefix = `g${Math.random().toString(36).slice(2, 6)}`;
  const animationRule = forStory
    ? "Para Histórias animadas, inclua dentro de <defs><style> regras de animação CSS @keyframes dando vida aos elementos da cena com movimentos realistas do mundo real (ex.: ondulação suave da água/mar, barco balançando e remadores, animais brincando, humanos interagindo com tecnologia, folhas/árvores balançando, vapor ou chamas tremulando, nuvens deslizando suavemente) e aplique as classes correspondentes com nomes descritivos nos grupos <g class='...'> dos elementos."
    : "- Apenas elementos estáticos: g, defs, linearGradient, radialGradient, filter (feGaussianBlur/feTurbulence/feDropShadow), path, rect, circle, ellipse, polygon. Sem script, image, text ou links externos.";

  return [
    "Você é ilustrador vetorial. Crie UMA cena em SVG no MESMO formato e estilo da referência (estilo Studio Ghibli: céu em gradiente, colinas em camadas, sombras suaves, textura de papel).",
    "REGRAS OBRIGATÓRIAS:",
    '- viewBox="0 0 1200 800" width="1200" height="800".',
    '- Fundo: inclua sempre como primeiro elemento visual um <rect width="1200" height="800" fill="..."/> com a cor do céu ou paisagem (nunca deixe o fundo transparente ou sem cor).',
    animationRule,
    `- IDs únicos com prefixo "${prefix}-". No máximo ~12 KB de código.`,
    `- Tema: ${plan.themeLabel}. Clima: ${plan.setting}.`,
    ...(themeRule(plan.themeLabel)
      ? [
          `- TUDO na imagem deve pertencer ao tema "${plan.themeLabel}" (${themeRule(plan.themeLabel)!.context}). Cenário e detalhes extras também devem ser do tema.`,
          `- NÃO desenhe nada fora do tema (por exemplo: ${themeRule(plan.themeLabel)!.forbid}).`,
        ]
      : []),
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
  /** Dica em português: como o objeto é, sem dizer o nome (jogo: botão Dica). */
  dica?: string;
  /** Para que o objeto serve, em português. */
  uso?: string;
  /** Frase curta em francês que descreve o objeto, sem citar o nome (nível Nativo · Frase). */
  frase?: string;
}

export function cquoiProposalPrompt(themeLabel: string, taken: string[]): string {
  return [
    'Você ajuda a montar o jogo de vocabulário de francês "C\'est quoi ?" (aluno vê um objeto e escolhe o nome em francês).',
    `Tema: ${themeLabel}.`,
    "Proponha UM objeto concreto, fácil de reconhecer numa ilustração, que NÃO esteja nesta lista de nomes já usados:",
    taken.join(", ") || "(nenhum)",
    "Regras: nome em francês correto, sem o artigo no campo name; article deve ser exatamente um de: Un, Une, Des, Du; english = nome do objeto em inglês; context = descrição curta em inglês de um lugar simples e natural onde o objeto aparece.",
    "Também escreva: dica = 1 ou 2 frases em português do Brasil dizendo como o objeto é (forma, partes, onde aparece) SEM dizer o nome dele; uso = 1 frase em português dizendo para que ele serve; frase = UMA frase curta em francês (8 a 14 palavras) que descreve o objeto SEM citar o nome dele, começando por Il, Elle, On ou Ce/Cette.",
    'Responda SOMENTE com JSON: {"article":"Un","name":"...","english":"...","context":"...","dica":"...","uso":"...","frase":"..."}',
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
    '- Fundo: inclua sempre como primeiro elemento visual um <rect width="490" height="350" fill="..."/> com uma cor suave de ambiente ou cenário (nunca deixe o fundo transparente ou escuro).',
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
export function reviewPrompt(objects: string[], engine: ImageEngine = "image", themeLabel?: string): string {
  const styleInstruction =
    engine === "svg"
      ? "ilustração vetorial limpa e colorida (formato SVG), estilizada e harmoniosa, inspirada nas cores e ambientação do Studio Ghibli. Como é uma arte vetorial (SVG), formas geométricas/planas e gradientes fazem parte do formato vetorial e NÃO devem ser penalizados como 'estilo incorreto' ou 'não é pintura à mão'."
      : "ilustração pintada à mão inspirada no Studio Ghibli, composição limpa e colorida.";

  return [
    "Você é revisor de qualidade de ilustrações de um app de ensino de idiomas.",
    `Estilo desejado: ${styleInstruction}`,
    `Objetos obrigatórios: ${JSON.stringify(objects)}.`,
    ...(themeLabel && THEME_SCENE_RULES[themeLabel]
      ? [
          `Tema da imagem: "${themeLabel}" (${THEME_SCENE_RULES[themeLabel].context}).`,
          `Avalie também "theme_fit" (0-10): o quanto a cena INTEIRA (cenário, fundo e detalhes extras, não só os objetos pedidos) combina com esse tema. Dê nota baixa se houver elementos claramente fora do tema (ex.: ${THEME_SCENE_RULES[themeLabel].forbid}) e liste-os em "off_theme_items".`,
        ]
      : []),
    "Analise a imagem e responda SOMENTE com JSON neste formato:",
    '{"score": 0-10, "theme_fit": 0-10, "off_theme_items": ["..."], "has_text_or_watermark": false, "objects": [{"name": "...", "visible": true, "box_2d": [ymin, xmin, ymax, xmax]}], "issues": ["..."]}',
    "box_2d usa coordenadas normalizadas de 0 a 1000. Se o objeto não aparece de forma clara, use visible=false e box_2d=null.",
    "A nota considera: objetos obrigatórios reconhecíveis (peso maior), formas naturais sem deformações graves, nitidez, ausência de letras/marca d'água e harmonia visual.",
    "Em issues, liste em português (curto) cada problema encontrado; lista vazia se estiver tudo certo.",
  ].join("\n");
}
