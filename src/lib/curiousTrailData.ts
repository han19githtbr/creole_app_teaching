// Configuração de dados, níveis, clima, animais e estações da montanha
// para o módulo "Trilha do Aluno Curioso" (Sentier de l'Élève Curieux).
import type { CestQuoiItem } from "@/lib/cquoiContent";
import cquoiItemsRaw from "@/lib/cquoiItems.json";

export type TrailWeather = "sunny" | "rain" | "snow";

export interface TrailAnimal {
  id: string;
  name: string;
  namePt: string;
  emoji: string;
  quote: string;
  soundType: "chirp" | "croak" | "rustle" | "bell";
  badge: string;
}

export interface TrailLevelConfig {
  level: number; // 1 a 7
  altitude: number; // metros
  name: string;
  nameFr: string;
  elementCount: number; // 1, 2, 3, 4, 5, 6, 7
  weather: TrailWeather;
  hasUmbrella: boolean;
  hasSnowGear: boolean;
  animal: TrailAnimal;
  coord: { x: number; y: number }; // posição percentual na montanha (0..100)
  description: string;
  badgeEmoji: string;
  xpBase: number;
}

/**
 * Pontos (em % do cenário) na encosta onde os bichos passeiam.
 * Correspondem às marcações vermelhas no mapa da montanha.
 */
export const TRAIL_ROAM_SPOTS: { x: number; y: number }[] = [
  { x: 58, y: 56 },
  { x: 65, y: 66 },
  { x: 73, y: 39 },
  { x: 83, y: 62 },
  { x: 90, y: 55 },
  { x: 82, y: 84 },
  { x: 68, y: 89 },
  { x: 50, y: 82 },
];

/** Bichos extras que aparecem e somem da montanha (além dos 7 das estações). */
export const EXTRA_TRAIL_ANIMALS: TrailAnimal[] = [
  { id: "deer", name: "Le Cerf", namePt: "Cervo", emoji: "🦌", quote: "Je traverse la forêt en silence !", soundType: "rustle", badge: "Marcheur discret" },
  { id: "fox", name: "Le Renard roux", namePt: "Raposa", emoji: "🦊", quote: "Je suis rusé comme un renard !", soundType: "rustle", badge: "Esprit malin" },
  { id: "hedgehog", name: "Le Hérisson", namePt: "Ouriço", emoji: "🦔", quote: "Doucement, doucement, j'avance !", soundType: "rustle", badge: "Petit explorateur" },
  { id: "butterfly", name: "Le Papillon", namePt: "Borboleta", emoji: "🦋", quote: "Je vole de fleur en fleur !", soundType: "chirp", badge: "Ailes colorées" },
  { id: "turtle", name: "La Tortue", namePt: "Tartaruga", emoji: "🐢", quote: "Lentement mais sûrement !", soundType: "bell", badge: "Patience d'or" },
  { id: "bee", name: "L'Abeille", namePt: "Abelha", emoji: "🐝", quote: "Bzzz ! Je cueille le miel du matin.", soundType: "chirp", badge: "Travailleuse" },
];

export const TRAIL_LEVELS: TrailLevelConfig[] = [
  {
    level: 1,
    altitude: 450,
    name: "Base da Montanha",
    nameFr: "Le Pied de la Montagne",
    elementCount: 1,
    weather: "sunny",
    hasUmbrella: false,
    hasSnowGear: false,
    animal: {
      id: "squirrel",
      name: "L'Écureuil des bois",
      namePt: "Esquilo curioso",
      emoji: "🐿️",
      quote: "Bienvenue sur le sentier ! Trouve ton premier trésor !",
      soundType: "rustle",
      badge: "Observateur agile",
    },
    coord: { x: 12, y: 84 },
    description: "Início da expedição. Reconheça 1 elemento no prado verde para liberar o caminho.",
    badgeEmoji: "🌱",
    xpBase: 50,
  },
  {
    level: 2,
    altitude: 980,
    name: "Bosque dos Pinheiros",
    nameFr: "La Forêt des Pins",
    elementCount: 2,
    weather: "sunny",
    hasUmbrella: false,
    hasSnowGear: false,
    animal: {
      id: "rabbit",
      name: "Le Lapin blanc",
      namePt: "Coelho da montanha",
      emoji: "🐇",
      quote: "Tu grimpes vite ! Deux objets t'attendent entre les arbres !",
      soundType: "rustle",
      badge: "Pied léger",
    },
    coord: { x: 26, y: 70 },
    description: "Bosque acolhedor com brisa fresca. Identifique 2 elementos para prosseguir.",
    badgeEmoji: "🌲",
    xpBase: 100,
  },
  {
    level: 3,
    altitude: 1520,
    name: "Mirante das Rochas",
    nameFr: "Le Belvédère des Rochers",
    elementCount: 3,
    weather: "sunny",
    hasUmbrella: false,
    hasSnowGear: false,
    animal: {
      id: "bird",
      name: "L'Oiseau des cimes",
      namePt: "Pássaro cantor",
      emoji: "🐦",
      quote: "Quelle belle vue ! Trois éléments se cachent sur ce versant !",
      soundType: "chirp",
      badge: "Chant d'altitude",
    },
    coord: { x: 44, y: 58 },
    description: "Encosta rochosa com vista panorâmica. Reconheça 3 elementos para subir mais alto.",
    badgeEmoji: "🪨",
    xpBase: 160,
  },
  {
    level: 4,
    altitude: 2100,
    name: "Encosta Chuvosa",
    nameFr: "Le Versant Pluvieux",
    elementCount: 4,
    weather: "rain",
    hasUmbrella: true, // Começa a chover e o aluno abre o guarda-chuva!
    hasSnowGear: false,
    animal: {
      id: "frog",
      name: "La Grenouille rieuse",
      namePt: "Sapinho da chuva",
      emoji: "🐸",
      quote: "Coâ ! Ouvre ton parapluie, la pluie commence à tomber !",
      soundType: "croak",
      badge: "Goutte d'argent",
    },
    coord: { x: 32, y: 44 },
    description: "As nuvens fecham e a chuva começa! Abra seu guarda-chuva e reconheça 4 elementos.",
    badgeEmoji: "🌧️",
    xpBase: 240,
  },
  {
    level: 5,
    altitude: 2750,
    name: "Cascata da Neblina",
    nameFr: "La Cascade des Brumes",
    elementCount: 5,
    weather: "rain",
    hasUmbrella: true, // Chuva continua até o fim do nível 5
    hasSnowGear: false,
    animal: {
      id: "snail",
      name: "L'Escargot voyageur",
      namePt: "Caracol e Raposa",
      emoji: "🐌",
      quote: "La pluie persiste ! Garde ton parapluie bien haut !",
      soundType: "rustle",
      badge: "Courage sous l'orage",
    },
    coord: { x: 56, y: 34 },
    description: "Chuva intensa e neblina. Avance com seu guarda-chuva e decifre 5 elementos.",
    badgeEmoji: "⛈️",
    xpBase: 330,
  },
  {
    level: 6,
    altitude: 3300,
    name: "Planalto Glacial",
    nameFr: "Le Plateau Glaciaire",
    elementCount: 6,
    weather: "snow", // A chuva cessa e começa a nevar!
    hasUmbrella: false,
    hasSnowGear: true, // Aluno coloca gorro e cachecol quentinho
    animal: {
      id: "chamois",
      name: "Le Chamois agile",
      namePt: "Cabra-montesa / Íbex",
      emoji: "🐐",
      quote: "Regarde, la neige tombe ! Mets ton bonnet et ton écharpe !",
      soundType: "bell",
      badge: "Pas de givre",
    },
    coord: { x: 74, y: 22 },
    description: "A chuva passou e a neve começou a cair! Agasalhe-se e identifique 6 elementos.",
    badgeEmoji: "❄️",
    xpBase: 440,
  },
  {
    level: 7,
    altitude: 3950,
    name: "Cume da Vitória",
    nameFr: "Le Pic de la Victoire",
    elementCount: 7,
    weather: "snow",
    hasUmbrella: false,
    hasSnowGear: true,
    animal: {
      id: "eagle",
      name: "L'Aigle royal",
      namePt: "Águia dourada",
      emoji: "🦅",
      quote: "Tu touches au sommet ! Plus que sept énigmes avant de hisser le drapeau !",
      soundType: "chirp",
      badge: "Conquérant du ciel",
    },
    coord: { x: 88, y: 10 },
    description: "O topo nevado do mundo! Reconheça os 7 elementos e hasteie a bandeira da vitória!",
    badgeEmoji: "🏔️",
    xpBase: 600,
  },
];

export interface TrailThemeOption {
  id: string;
  label: string;
  kreyol: string;
  fr: string;
  emoji: string;
  gradient: string;
  accentColor: string;
  borderColor: string;
  description: string;
}

export const TRAIL_THEMES: TrailThemeOption[] = [
  {
    id: "gastronomia",
    label: "Gastronomia",
    kreyol: "Manje",
    fr: "Gastronomie",
    emoji: "🍳",
    gradient: "from-amber-500 via-orange-500 to-red-600",
    accentColor: "#f59e0b",
    borderColor: "border-amber-400",
    description: "Pratos, temperos, utensílios e sabores da culinária",
  },
  {
    id: "natureza",
    label: "Natureza",
    kreyol: "Lanati",
    fr: "Nature",
    emoji: "🌲",
    gradient: "from-emerald-500 via-green-600 to-teal-700",
    accentColor: "#10b981",
    borderColor: "border-emerald-400",
    description: "Árvores, flores, animais selvagens, rios e montanhas",
  },
  {
    id: "tecnologia",
    label: "Tecnologia",
    kreyol: "Teknoloji",
    fr: "Technologie",
    emoji: "💻",
    gradient: "from-blue-500 via-indigo-600 to-violet-700",
    accentColor: "#3b82f6",
    borderColor: "border-blue-400",
    description: "Computadores, robôs, dispositivos e inovação",
  },
  {
    id: "idiomas",
    label: "Idiomas",
    kreyol: "Lang",
    fr: "Langues",
    emoji: "📚",
    gradient: "from-violet-500 via-purple-600 to-fuchsia-700",
    accentColor: "#8b5cf6",
    borderColor: "border-purple-400",
    description: "Livros, dicionários, cartazes, escrita e palavras",
  },
  {
    id: "lazeres",
    label: "Lazeres",
    kreyol: "Lwazi",
    fr: "Loisirs",
    emoji: "🎨",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    accentColor: "#ec4899",
    borderColor: "border-pink-400",
    description: "Esportes, brinquedos, passatempos e diversão",
  },
  {
    id: "cultura",
    label: "Cultura",
    kreyol: "Kilti",
    fr: "Culture",
    emoji: "🎭",
    gradient: "from-amber-600 via-yellow-600 to-lime-600",
    accentColor: "#d97706",
    borderColor: "border-amber-400",
    description: "Tradições, bandeiras, tambores e folclore",
  },
  {
    id: "turismo",
    label: "Turismo",
    kreyol: "Touris",
    fr: "Tourisme",
    emoji: "⛵",
    gradient: "from-cyan-500 via-sky-600 to-blue-700",
    accentColor: "#06b6d4",
    borderColor: "border-cyan-400",
    description: "Viagens, faróis, barcos, praias e monumentos",
  },
  {
    id: "interior",
    label: "Vida no interior",
    kreyol: "Lavi andeyò",
    fr: "Vie à la campagne",
    emoji: "🌾",
    gradient: "from-lime-600 via-green-700 to-emerald-800",
    accentColor: "#65a30d",
    borderColor: "border-lime-500",
    description: "Sítios, pomares, animais rurais e vida campestre",
  },
  {
    id: "musica",
    label: "Música",
    kreyol: "Mizik",
    fr: "Musique",
    emoji: "🎵",
    gradient: "from-fuchsia-500 via-pink-600 to-purple-700",
    accentColor: "#d946ef",
    borderColor: "border-fuchsia-400",
    description: "Instrumentos musicais, ritmos, violões e notas",
  },
  {
    id: "danca",
    label: "Dança",
    kreyol: "Dans",
    fr: "Danse",
    emoji: "💃",
    gradient: "from-rose-500 via-pink-600 to-purple-600",
    accentColor: "#f43f5e",
    borderColor: "border-rose-400",
    description: "Sapatilhas, passos, ritmos e coreografias",
  },
  {
    id: "historia",
    label: "História",
    kreyol: "Istwa",
    fr: "Histoire",
    emoji: "📜",
    gradient: "from-amber-700 via-orange-800 to-stone-900",
    accentColor: "#b45309",
    borderColor: "border-amber-600",
    description: "Castelos, pergaminhos, coroas e tempos antigos",
  },
  {
    id: "cinema",
    label: "Cinema",
    kreyol: "Sinema",
    fr: "Cinéma",
    emoji: "🎬",
    gradient: "from-slate-700 via-zinc-800 to-neutral-950",
    accentColor: "#64748b",
    borderColor: "border-slate-500",
    description: "Câmeras, projetores, claquetes e grandes telas",
  },
  {
    id: "geografia",
    label: "Geografia",
    kreyol: "Jewografi",
    fr: "Géographie",
    emoji: "🗺️",
    gradient: "from-teal-600 via-emerald-700 to-cyan-800",
    accentColor: "#0d9488",
    borderColor: "border-teal-400",
    description: "Bússolas, mapas, globos terrestres e relevos",
  },
  {
    id: "religiao",
    label: "Religião",
    kreyol: "Relijyon",
    fr: "Spiritualité",
    emoji: "🕊️",
    gradient: "from-sky-500 via-indigo-500 to-blue-600",
    accentColor: "#0ea5e9",
    borderColor: "border-sky-400",
    description: "Velas, templos, sinos e símbolos sagrados",
  },
  {
    id: "estoicismo",
    label: "Estoicismo",
    kreyol: "Estoyisis",
    fr: "Stoïcisme",
    emoji: "🏛️",
    gradient: "from-stone-600 via-zinc-700 to-neutral-800",
    accentColor: "#78716c",
    borderColor: "border-stone-400",
    description: "Filosofia, sabedoria clássica, pergaminhos e serenidade",
  },
];

/** Itens adicionais dedicados para o tema de Idiomas */
export const IDIOMAS_EXTRA_ITEMS: CestQuoiItem[] = [
  {
    id: "idiomas-dictionnaire",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un dictionnaire de langues",
    article: "Un",
    name: "dictionnaire de langues",
    speak: "un dictionnaire de langues",
    scene: "/ghibli/idiomas.svg",
    w: 1200,
    h: 800,
    arrow: { x: 468, y: 576 },
    hint: {
      d: "Livro grosso com milhares de palavras explicadas em ordem alfabética.",
      u: "Serve para consultar o significado e a ortografia das palavras.",
      f: "C'est un gros livre qui donne la définition de tous les mots.",
    },
  },
  {
    id: "idiomas-livre-ouvert",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un livre ouvert sur la table",
    article: "Un",
    name: "livre ouvert sur la table",
    speak: "un livre ouvert sur la table",
    scene: "/ghibli/idiomas-02.svg",
    w: 1200,
    h: 800,
    arrow: { x: 520, y: 560 },
    hint: {
      d: "Páginas encadernadas abertas para leitura.",
      u: "Serve para ler histórias, textos e lições.",
      f: "Il contient des histoires et des connaissances à lire.",
    },
  },
  {
    id: "idiomas-globe",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un globe terrestre",
    article: "Un",
    name: "globe terrestre",
    speak: "un globe terrestre",
    scene: "/ghibli/idiomas-03.svg",
    w: 1200,
    h: 800,
    arrow: { x: 996, y: 496 },
    hint: {
      d: "Esfera giratória com o mapa mundi e todos os oceanos desenhados.",
      u: "Serve para localizar países e ver onde cada idioma é falado.",
      f: "Il représente la planète Terre avec tous ses pays.",
    },
  },
  {
    id: "idiomas-cahier",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un cahier d'exercices",
    article: "Un",
    name: "cahier d'exercices",
    speak: "un cahier d'exercices",
    scene: "/ghibli/idiomas-04.svg",
    w: 1200,
    h: 800,
    arrow: { x: 756, y: 552 },
    hint: {
      d: "Caderno com folhas pautadas para anotações do aluno.",
      u: "Serve para escrever frases, lições e praticar vocabulário.",
      f: "On écrit ses devoirs et ses notes sur ses pages lignées.",
    },
  },
  {
    id: "idiomas-crayon",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un crayon de bois",
    article: "Un",
    name: "crayon de bois",
    speak: "un crayon de bois",
    scene: "/ghibli/idiomas-05.svg",
    w: 1200,
    h: 800,
    arrow: { x: 640, y: 580 },
    hint: {
      d: "Objeto de madeira com ponta de grafite para escrita.",
      u: "Serve para escrever e desenhar no papel.",
      f: "On l'utilise pour écrire et dessiner sur du papier.",
    },
  },
  {
    id: "idiomas-tableau",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un tableau noir de classe",
    article: "Un",
    name: "tableau noir de classe",
    speak: "un tableau noir de classe",
    scene: "/ghibli/idiomas-06.svg",
    w: 1200,
    h: 800,
    arrow: { x: 600, y: 280 },
    hint: {
      d: "Grande painel escuro na parede da sala de aula.",
      u: "Serve para o professor explicar e escrever com giz.",
      f: "Le professeur écrit les leçons dessus avec de la craie.",
    },
  },
  {
    id: "idiomas-drapeaux",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Des drapeaux du monde",
    article: "Des",
    name: "drapeaux du monde",
    speak: "des drapeaux du monde",
    scene: "/ghibli/idiomas-07.svg",
    w: 1200,
    h: 800,
    arrow: { x: 600, y: 160 },
    hint: {
      d: "Tecidos coloridos com os símbolos e cores de vários países.",
      u: "Representam as nações e as línguas pelo mundo.",
      f: "Ils flottent pour représenter chaque nation du monde.",
    },
  },
  {
    id: "idiomas-cartable",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un cartable d'écolier",
    article: "Un",
    name: "cartable d'écolier",
    speak: "un cartable d'écolier",
    scene: "/ghibli/idiomas-08.svg",
    w: 1200,
    h: 800,
    arrow: { x: 380, y: 640 },
    hint: {
      d: "Bolsa resistente com alças que o estudante leva nas costas.",
      u: "Serve para transportar livros e cadernos para a escola.",
      f: "Les élèves y rangent leurs affaires pour aller en classe.",
    },
  },
  {
    id: "idiomas-lettres",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Des lettres de l'alphabet",
    article: "Des",
    name: "lettres de l'alphabet",
    speak: "des lettres de l'alphabet",
    scene: "/ghibli/idiomas-09.svg",
    w: 1200,
    h: 800,
    arrow: { x: 750, y: 240 },
    hint: {
      d: "Caracteres tipográficos que compõem todas as palavras.",
      u: "Serve para formar frases e aprender a ler.",
      f: "Ce sont les signes de base pour écrire et lire les mots.",
    },
  },
  {
    id: "idiomas-pupitre",
    themeId: "idiomas",
    theme: "Idiomas",
    fr: "Un pupitre d'école",
    article: "Un",
    name: "pupitre d'école",
    speak: "un pupitre d'école",
    scene: "/ghibli/idiomas-10.svg",
    w: 1200,
    h: 800,
    arrow: { x: 450, y: 620 },
    hint: {
      d: "Mesa inclinada individual com espaço para apoiar livros.",
      u: "Serve para o aluno se sentar e estudar confortavelmente.",
      f: "Le bureau où s'assoit l'élève pour écouter le cours.",
    },
  },
];

/**
 * Retorna todos os itens disponíveis para a trilha, mesclando
 * os itens do banco, os gerados aprovados e os extras de idiomas.
 */
export function getAllTrailItems(extraItems: CestQuoiItem[] = []): CestQuoiItem[] {
  const base = [...(cquoiItemsRaw as unknown as CestQuoiItem[]), ...IDIOMAS_EXTRA_ITEMS, ...extraItems];
  const unique = new Map<string, CestQuoiItem>();
  base.forEach((item) => {
    if (!unique.has(item.id)) unique.set(item.id, item);
  });
  return Array.from(unique.values());
}

/**
 * Filtra itens por tema. Se for "idiomas", mapeia também termos de idiomas.
 */
export function getTrailItemsForTheme(themeId: string, allItems: CestQuoiItem[]): CestQuoiItem[] {
  if (themeId === "all") return allItems;
  return allItems.filter((i) => i.themeId === themeId);
}

/**
 * Embaralha lista de forma imutável.
 */
export function shuffleArray<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Sorteia N elementos de um tema sem repetição imediata para uma fase da trilha.
 * Se o tema tiver menos elementos que o solicitado, completa com elementos de outros temas.
 */
export function pickTrailElementsForLevel(
  level: number,
  themeId: string,
  allItems: CestQuoiItem[],
  excludeIds: Set<string> = new Set()
): CestQuoiItem[] {
  const cfg = TRAIL_LEVELS.find((l) => l.level === level) || TRAIL_LEVELS[0];
  const count = cfg.elementCount;

  const themePool = getTrailItemsForTheme(themeId, allItems);
  const availableInTheme = shuffleArray(themePool.filter((i) => !excludeIds.has(i.id)));

  const picked: CestQuoiItem[] = [];

  for (const item of availableInTheme) {
    if (picked.length >= count) break;
    picked.push(item);
  }

  // Se faltar itens no tema (ex: nível 7 pedindo 7 itens mas o pool filtrado esgotou),
  // reutiliza itens do tema ou busca nos outros temas
  if (picked.length < count) {
    const extraTheme = shuffleArray(themePool.filter((i) => !picked.some((p) => p.id === i.id)));
    for (const item of extraTheme) {
      if (picked.length >= count) break;
      picked.push(item);
    }
  }

  if (picked.length < count) {
    const outsidePool = shuffleArray(allItems.filter((i) => !picked.some((p) => p.id === i.id)));
    for (const item of outsidePool) {
      if (picked.length >= count) break;
      picked.push(item);
    }
  }

  return picked;
}

/**
 * Estrutura de progresso da trilha salva no navegador por tema.
 */
export interface TrailProgressState {
  unlockedLevel: number; // 1 a 7 (nível máximo liberado)
  completedLevels: number[]; // níveis já conquistados com sucesso
  stars: Record<number, number>; // estrelas (1 a 3) por nível
  highScores: Record<number, number>; // melhor pontuação por nível
  totalXp: number;
}

export const INITIAL_TRAIL_PROGRESS: TrailProgressState = {
  unlockedLevel: 1,
  completedLevels: [],
  stars: {},
  highScores: {},
  totalXp: 0,
};

export function getTrailProgressStorageKey(themeId: string): string {
  return `curious_trail:progress:v2:${themeId}`;
}

export function loadTrailProgress(themeId: string): TrailProgressState {
  if (typeof window === "undefined") return INITIAL_TRAIL_PROGRESS;
  try {
    const raw = localStorage.getItem(getTrailProgressStorageKey(themeId));
    if (!raw) return INITIAL_TRAIL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      unlockedLevel: Math.max(1, Math.min(7, Number(parsed.unlockedLevel) || 1)),
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
      stars: typeof parsed.stars === "object" && parsed.stars ? parsed.stars : {},
      highScores: typeof parsed.highScores === "object" && parsed.highScores ? parsed.highScores : {},
      totalXp: Number(parsed.totalXp) || 0,
    };
  } catch {
    return INITIAL_TRAIL_PROGRESS;
  }
}

export function saveTrailProgress(themeId: string, state: TrailProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getTrailProgressStorageKey(themeId), JSON.stringify(state));
  } catch {
    // ignora restrição de quota
  }
}


/** Todos os bichos que podem passear pela montanha. */
export const ROAMING_ANIMAL_POOL: TrailAnimal[] = [
  ...TRAIL_LEVELS.map((l) => l.animal),
  ...EXTRA_TRAIL_ANIMALS,
];
