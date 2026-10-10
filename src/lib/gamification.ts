// Motor de Gamificação, Níveis de Fluência, Conquistas e Recompensas.
// Cada idioma (Kreyòl Ayisyen e Français) tem o SEU próprio progresso, níveis,
// conquistas, títulos e moeda — nada é compartilhado entre os painéis.
import type { AppLanguage } from "@/lib/languageShared";

export interface Badge {
  id: string;
  title: string;
  /** Nome da conquista no idioma estudado (Kreyòl ou Français). */
  native: string;
  description: string;
  emoji: string;
  xpReward: number;
  goudReward: number;
  category: "streak" | "precision" | "collection" | "economy" | "vocabulary";
}

export const BADGES: Badge[] = [
  {
    id: "first_win",
    title: "Primeira Vitória",
    native: "Premye Viktwa!",
    description: "Acertou todos os elementos da sua primeira cena.",
    emoji: "🌱",
    xpReward: 35,
    goudReward: 20,
    category: "collection",
  },
  {
    id: "streak_3",
    title: "Em Chamas",
    native: "Sou Dife!",
    description: "Alcançou 3 acertos consecutivos.",
    emoji: "🔥",
    xpReward: 60,
    goudReward: 30,
    category: "streak",
  },
  {
    id: "streak_5",
    title: "Impressionante",
    native: "Enpresyonan!",
    description: "Alcançou 5 acertos consecutivos sem errar.",
    emoji: "⚡",
    xpReward: 120,
    goudReward: 60,
    category: "streak",
  },
  {
    id: "streak_10",
    title: "Imbatível",
    native: "Endontab!",
    description: "Sequência épica de 10 rodadas sem perder.",
    emoji: "👑",
    xpReward: 300,
    goudReward: 150,
    category: "streak",
  },
  {
    id: "first_try",
    title: "Olhar Clínico",
    native: "Je Klè!",
    description: "Acertou a cena de primeira com todas as 3 vidas intactas.",
    emoji: "🎯",
    xpReward: 45,
    goudReward: 25,
    category: "precision",
  },
  {
    id: "perfectionist",
    title: "Mestre da Precisão",
    native: "Mèt Presizyon!",
    description: "Conquistou 3 rodadas perfeitas consecutivas com 3 corações.",
    emoji: "💎",
    xpReward: 150,
    goudReward: 80,
    category: "precision",
  },
  {
    id: "collector_5",
    title: "Explorador da Galeria",
    native: "Eksploratè Imaj",
    description: "Dominou 5 cenas distintas no jogo.",
    emoji: "🎨",
    xpReward: 80,
    goudReward: 45,
    category: "collection",
  },
  {
    id: "collector_15",
    title: "Conhecedor Cultural",
    native: "Konesè Kilti",
    description: "Dominou 15 cenas distintas na galeria ilustrada.",
    emoji: "🏛️",
    xpReward: 180,
    goudReward: 90,
    category: "collection",
  },
  {
    id: "collector_30",
    title: "Mestre da Galeria",
    native: "Gran Mèt Galeri",
    description: "Dominou 30 cenas com riqueza de vocabulário.",
    emoji: "🌟",
    xpReward: 350,
    goudReward: 160,
    category: "collection",
  },
  {
    id: "words_25",
    title: "Caçador de Palavras",
    native: "Chasè Mo",
    description: "Acertou mais de 25 palavras em Kreyòl nas cenas.",
    emoji: "🏹",
    xpReward: 75,
    goudReward: 40,
    category: "vocabulary",
  },
  {
    id: "words_100",
    title: "Dicionário Vivo",
    native: "Diksyonè Vivan",
    description: "Identificou mais de 100 palavras em Kreyòl.",
    emoji: "📚",
    xpReward: 250,
    goudReward: 120,
    category: "vocabulary",
  },
  {
    id: "rich_goud",
    title: "Rico em Gouds",
    native: "Boujwa Kreyòl",
    description: "Acumulou 100 moedas haitianas Goud.",
    emoji: "💰",
    xpReward: 100,
    goudReward: 50,
    category: "economy",
  },
  {
    id: "tycoon_goud",
    title: "Tesouro Nacional",
    native: "Trezò Nasyonal",
    description: "Acumulou 500 moedas Goud em sua carteira.",
    emoji: "🪙",
    xpReward: 300,
    goudReward: 150,
    category: "economy",
  },
  {
    id: "heritage_master",
    title: "Alma Haitiana",
    native: "Nanm Ayisyen",
    description: "Dominou cenas com temas culturais de festa, história e natureza haitiana.",
    emoji: "🇭🇹",
    xpReward: 120,
    goudReward: 60,
    category: "collection",
  },
];

export interface LevelInfo {
  level: number;
  title: string;
  native: string;
  badgeEmoji: string;
  minXp: number;
  nextXp: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Iniciante", native: "Inisyatè", badgeEmoji: "🐣", minXp: 0, nextXp: 120 },
  { level: 2, title: "Aprendiz", native: "Apranti", badgeEmoji: "📘", minXp: 120, nextXp: 300 },
  { level: 3, title: "Explorador", native: "Eksploratè", badgeEmoji: "🧭", minXp: 300, nextXp: 600 },
  { level: 4, title: "Conversador", native: "Konversatè", badgeEmoji: "💬", minXp: 600, nextXp: 1050 },
  { level: 5, title: "Conhecedor", native: "Konesè Kreyòl", badgeEmoji: "🌟", minXp: 1050, nextXp: 1650 },
  { level: 6, title: "Mestre da Língua", native: "Mèt Lang", badgeEmoji: "🏅", minXp: 1650, nextXp: 2500 },
  { level: 7, title: "Grão-Mestre Kreyòl", native: "Gran Mèt Kreyòl", badgeEmoji: "👑", minXp: 2500, nextXp: 4000 },
];

export interface HonoraryTitle {
  id: string;
  native: string;
  portuguese: string;
  description: string;
  price: number;
  xpReward: number; // XP de bônus concedido ao desbloquear este nível/título com Goud
  levelTarget: number; // Nível correspondente
  icon: string;
  gradientClass: string;
}

export const HONORARY_TITLES: HonoraryTitle[] = [
  {
    id: "title_inisyate",
    native: "Inisyatè Kreyòl",
    portuguese: "Nível 1 • Iniciante Kreyòl",
    description: "Nível inicial concedido a todo estudante apaixonado pela língua.",
    price: 0,
    xpReward: 0,
    levelTarget: 1,
    icon: "🌱",
    gradientClass: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    id: "title_zanmi",
    native: "Zanmi Ayiti",
    portuguese: "Nível 2 • Amigo do Haiti",
    description: "Desbloqueie com 50 Gouds virtuais acumulados nas postagens para avançar ao Nível 2.",
    price: 50,
    xpReward: 120, // Garante que o aluno atinja o Nível 2 (Aprendiz: 120 XP)
    levelTarget: 2,
    icon: "🤝",
    gradientClass: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    id: "title_flanm",
    native: "Flanm Kreyòl",
    portuguese: "Nível 3 • Chama Kreyòl",
    description: "Desbloqueie com 100 Gouds virtuais. Para estudantes constantes, avançando ao Nível 3.",
    price: 100,
    xpReward: 200, // Leva o XP a 300+ (Nível 3: Explorador)
    levelTarget: 3,
    icon: "🔥",
    gradientClass: "from-orange-500/20 to-amber-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  {
    id: "title_anbasade",
    native: "Anbasadè Lang",
    portuguese: "Nível 4 • Embaixador da Língua",
    description: "Desbloqueie com 200 Gouds virtuais. Fluência, liderança e comunicação em Kreyòl.",
    price: 200,
    xpReward: 350, // Leva a 600+ (Nível 4: Conversador)
    levelTarget: 4,
    icon: "📜",
    gradientClass: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    id: "title_sitadel",
    native: "Gadyen Sitadèl",
    portuguese: "Nível 5 • Guardião da Citadelle",
    description: "Desbloqueie com 350 Gouds virtuais. Inabalável como a fortaleza Citadelle Laferrière.",
    price: 350,
    xpReward: 500, // Leva a 1050+ (Nível 5: Conhecedor)
    levelTarget: 5,
    icon: "🏰",
    gradientClass: "from-amber-500/25 to-yellow-500/25 text-amber-600 dark:text-amber-400 border-amber-500/40",
  },
  {
    id: "title_gran_met",
    native: "Gran Mèt Sajès",
    portuguese: "Nível 6 • Grão-Mestre da Sabedoria",
    description: "Desbloqueie com 500 Gouds virtuais. O mais alto patamar de sabedoria e prestígio da comunidade.",
    price: 500,
    xpReward: 800, // Leva a 1650+ (Nível 6: Mestre da Língua)
    levelTarget: 6,
    icon: "👑",
    gradientClass: "from-rose-500/25 to-purple-600/25 text-rose-600 dark:text-rose-400 border-rose-500/40",
  },
];

// ---------------------------------------------------------------------------
// Catálogo em FRANCÊS (painel do Français): mesmos moldes do Kreyòl, mas com
// títulos, níveis e conquistas em francês.
// ---------------------------------------------------------------------------
export const BADGES_FR: Badge[] = [
  { id: "first_win", title: "Primeira Vitória", native: "Première victoire !", description: "Acertou sua primeira palavra em francês.", emoji: "🌱", xpReward: 35, goudReward: 20, category: "collection" },
  { id: "streak_3", title: "Em Chamas", native: "En feu !", description: "Alcançou 3 acertos consecutivos.", emoji: "🔥", xpReward: 60, goudReward: 30, category: "streak" },
  { id: "streak_5", title: "Impressionante", native: "Impressionnant !", description: "Alcançou 5 acertos consecutivos sem errar.", emoji: "⚡", xpReward: 120, goudReward: 60, category: "streak" },
  { id: "streak_10", title: "Imbatível", native: "Imbattable !", description: "Sequência épica de 10 acertos sem perder.", emoji: "👑", xpReward: 300, goudReward: 150, category: "streak" },
  { id: "first_try", title: "Olhar Clínico", native: "Œil de lynx !", description: "Acertou a palavra de primeira, sem usar a segunda chance.", emoji: "🎯", xpReward: 45, goudReward: 25, category: "precision" },
  { id: "perfectionist", title: "Mestre da Precisão", native: "Maître de la précision !", description: "Acertou 10 palavras de primeira, sem usar a segunda chance.", emoji: "💎", xpReward: 150, goudReward: 80, category: "precision" },
  { id: "collector_5", title: "Explorador da Galeria", native: "Explorateur d'images", description: "Dominou 10 objetos distintos da galeria.", emoji: "🎨", xpReward: 80, goudReward: 45, category: "collection" },
  { id: "collector_15", title: "Conhecedor Cultural", native: "Connaisseur culturel", description: "Dominou 40 objetos distintos da galeria ilustrada.", emoji: "🏛️", xpReward: 180, goudReward: 90, category: "collection" },
  { id: "collector_30", title: "Mestre da Galeria", native: "Grand maître de la galerie", description: "Dominou 100 objetos com riqueza de vocabulário.", emoji: "🌟", xpReward: 350, goudReward: 160, category: "collection" },
  { id: "words_25", title: "Caçador de Palavras", native: "Chasseur de mots", description: "Acertou 25 palavras em francês.", emoji: "🏹", xpReward: 75, goudReward: 40, category: "vocabulary" },
  { id: "words_100", title: "Dicionário Vivo", native: "Dictionnaire vivant", description: "Acertou 100 palavras em francês.", emoji: "📚", xpReward: 250, goudReward: 120, category: "vocabulary" },
  { id: "rich_goud", title: "Rico em Écus", native: "Riche en écus", description: "Acumulou 100 écus.", emoji: "💰", xpReward: 100, goudReward: 50, category: "economy" },
  { id: "tycoon_goud", title: "Tesouro Nacional", native: "Trésor national", description: "Acumulou 500 écus em sua carteira.", emoji: "💶", xpReward: 300, goudReward: 150, category: "economy" },
  { id: "heritage_master", title: "Alma Francesa", native: "Âme française", description: "Dominou 25 objetos da coleção cultural francesa.", emoji: "🥖", xpReward: 120, goudReward: 60, category: "collection" },
];

export const LEVELS_FR: LevelInfo[] = [
  { level: 1, title: "Iniciante", native: "Initié", badgeEmoji: "🐣", minXp: 0, nextXp: 120 },
  { level: 2, title: "Aprendiz", native: "Apprenti", badgeEmoji: "📘", minXp: 120, nextXp: 300 },
  { level: 3, title: "Explorador", native: "Explorateur", badgeEmoji: "🧭", minXp: 300, nextXp: 600 },
  { level: 4, title: "Conversador", native: "Causeur", badgeEmoji: "💬", minXp: 600, nextXp: 1050 },
  { level: 5, title: "Conhecedor", native: "Connaisseur", badgeEmoji: "🌟", minXp: 1050, nextXp: 1650 },
  { level: 6, title: "Mestre da Língua", native: "Maître de la langue", badgeEmoji: "🏅", minXp: 1650, nextXp: 2500 },
  { level: 7, title: "Grão-Mestre do Francês", native: "Grand Maître du français", badgeEmoji: "👑", minXp: 2500, nextXp: 4000 },
];

export const HONORARY_TITLES_FR: HonoraryTitle[] = [
  {
    id: "title_initie",
    native: "Initié du français",
    portuguese: "Nível 1 • Iniciado em Francês",
    description: "Nível inicial concedido a todo estudante apaixonado pela língua francesa.",
    price: 0,
    xpReward: 0,
    levelTarget: 1,
    icon: "🌱",
    gradientClass: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    id: "title_ami",
    native: "Ami de la France",
    portuguese: "Nível 2 • Amigo da França",
    description: "Desbloqueie com 50 écus virtuais acumulados no jogo para avançar ao Nível 2.",
    price: 50,
    xpReward: 120,
    levelTarget: 2,
    icon: "🤝",
    gradientClass: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    id: "title_flamme",
    native: "Flamme française",
    portuguese: "Nível 3 • Chama Francesa",
    description: "Desbloqueie com 100 écus virtuais. Para estudantes constantes, avançando ao Nível 3.",
    price: 100,
    xpReward: 200,
    levelTarget: 3,
    icon: "🔥",
    gradientClass: "from-orange-500/20 to-amber-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  {
    id: "title_ambassadeur",
    native: "Ambassadeur de la langue",
    portuguese: "Nível 4 • Embaixador da Língua",
    description: "Desbloqueie com 200 écus virtuais. Fluência, liderança e comunicação em francês.",
    price: 200,
    xpReward: 350,
    levelTarget: 4,
    icon: "📜",
    gradientClass: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    id: "title_gardien",
    native: "Gardien de la tour",
    portuguese: "Nível 5 • Guardião da Torre Eiffel",
    description: "Desbloqueie com 350 écus virtuais. Inabalável como a Torre Eiffel.",
    price: 350,
    xpReward: 500,
    levelTarget: 5,
    icon: "🗼",
    gradientClass: "from-amber-500/25 to-yellow-500/25 text-amber-600 dark:text-amber-400 border-amber-500/40",
  },
  {
    id: "title_grand_maitre",
    native: "Grand Maître du savoir",
    portuguese: "Nível 6 • Grão-Mestre do Saber",
    description: "Desbloqueie com 500 écus virtuais. O mais alto patamar de sabedoria e prestígio da comunidade.",
    price: 500,
    xpReward: 800,
    levelTarget: 6,
    icon: "👑",
    gradientClass: "from-rose-500/25 to-purple-600/25 text-rose-600 dark:text-rose-400 border-rose-500/40",
  },
];

// ---------------------------------------------------------------------------
// Catálogo e textos por idioma
// ---------------------------------------------------------------------------
export interface GamificationLanguageConfig {
  badges: Badge[];
  levels: LevelInfo[];
  titles: HonoraryTitle[];
  defaultTitleId: string;
  /** Nome da moeda fictícia (Goud no Kreyòl, Écu no Français). */
  currency: string;
  /** Palavra "Nível" no idioma estudado. */
  levelWord: string;
  /** Título do modal de conquistas. */
  collectionTitle: string;
  /** Nome do jogo que dá recompensas neste idioma. */
  gameName: string;
  levelUpLabel: string;
  badgeUnlockedLabel: string;
  continueLabel: string;
}

export const GAMIFICATION_CONFIG: Record<AppLanguage, GamificationLanguageConfig> = {
  kreyol: {
    badges: BADGES,
    levels: LEVELS,
    titles: HONORARY_TITLES,
    defaultTitleId: "title_inisyate",
    currency: "Goud",
    levelWord: "Nivo",
    collectionTitle: "Koleksyon & Onè Kreyòl",
    gameName: "Jogo das Imagens",
    levelUpLabel: "Nouvo Nivo Atteint!",
    badgeUnlockedLabel: "Nouvo Konkèt Debloke!",
    continueLabel: "Kontinye Jwe! 🚀",
  },
  francais: {
    badges: BADGES_FR,
    levels: LEVELS_FR,
    titles: HONORARY_TITLES_FR,
    defaultTitleId: "title_initie",
    currency: "Écu",
    levelWord: "Niveau",
    collectionTitle: "Collection & Honneurs",
    gameName: "C'est quoi ?",
    levelUpLabel: "Nouveau niveau atteint !",
    badgeUnlockedLabel: "Nouvelle conquête débloquée !",
    continueLabel: "Continuez à jouer ! 🚀",
  },
};

export function getGamificationConfig(language: AppLanguage = "kreyol"): GamificationLanguageConfig {
  return GAMIFICATION_CONFIG[language] ?? GAMIFICATION_CONFIG.kreyol;
}

export interface GamificationState {
  xp: number;
  goud: number;
  totalSolved: number;
  highestStreak: number;
  currentStreak: number;
  perfectRoundsCount: number;
  totalWordsFound: number;
  unlockedBadges: string[];
  scenesSolved: string[];
  unlockedTitles: string[];
  activeTitleId: string;
  lastPlayedAt?: string;
}

/** Chave do localStorage por idioma (a do Kreyòl é a original, para não perder o progresso existente). */
export function gamificationStorageKey(language: AppLanguage = "kreyol"): string {
  return language === "kreyol" ? "kreyol:gamification-state" : `${language}:gamification-state`;
}

export const GAMIFICATION_CHANGE_EVENT = "kreyol:gamification-update";

export interface GamificationChangeDetail {
  language: AppLanguage;
  state: GamificationState;
}

export function getDefaultGamificationState(language: AppLanguage = "kreyol"): GamificationState {
  const titleId = getGamificationConfig(language).defaultTitleId;
  return {
    xp: 0,
    goud: 0,
    totalSolved: 0,
    highestStreak: 0,
    currentStreak: 0,
    perfectRoundsCount: 0,
    totalWordsFound: 0,
    unlockedBadges: [],
    scenesSolved: [],
    unlockedTitles: [titleId],
    activeTitleId: titleId,
  };
}

export function getGamificationState(language: AppLanguage = "kreyol"): GamificationState {
  if (typeof window === "undefined") return getDefaultGamificationState(language);
  const defaults = getDefaultGamificationState(language);
  try {
    const raw = localStorage.getItem(gamificationStorageKey(language));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      unlockedTitles: parsed.unlockedTitles || defaults.unlockedTitles,
      activeTitleId: parsed.activeTitleId || defaults.activeTitleId,
    };
  } catch {
    return defaults;
  }
}

export function saveGamificationState(state: GamificationState, language: AppLanguage = "kreyol"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(gamificationStorageKey(language), JSON.stringify(state));
    window.dispatchEvent(
      new CustomEvent<GamificationChangeDetail>(GAMIFICATION_CHANGE_EVENT, { detail: { language, state } })
    );
  } catch {}
}

export function applySyncedGamificationState(state: GamificationState, language: AppLanguage = "kreyol"): void {
  saveGamificationState(state, language);
}

export function buyTitle(titleId: string, language: AppLanguage = "kreyol"): {
  success: boolean;
  message: string;
  state: GamificationState;
  gainedXp?: number;
  leveledUp?: boolean;
  newLevel?: LevelInfo;
} {
  const config = getGamificationConfig(language);
  const current = getGamificationState(language);
  const target = config.titles.find((t) => t.id === titleId);

  if (!target) {
    return { success: false, message: "Nível não encontrado.", state: current };
  }

  if (current.unlockedTitles.includes(titleId)) {
    return { success: false, message: "Você já possui este nível desbloqueado!", state: current };
  }

  if (current.goud < target.price) {
    const hint =
      language === "francais"
        ? `Acerte palavras no jogo C'est quoi ? para acumular écus!`
        : `Acerte palavras nas postagens para acumular +10 Goud por acerto!`;
    return {
      success: false,
      message: `Você precisa de ${target.price} ${config.currency}s fictícios (saldo: ${current.goud} ${config.currency}). ${hint}`,
      state: current,
    };
  }

  const oldLevel = getLevelInfo(current.xp, language).current;
  const gainedXp = target.xpReward || 0;
  const newXp = current.xp + gainedXp;
  const newLevel = getLevelInfo(newXp, language).current;
  const leveledUp = newLevel.level > oldLevel.level;

  const updated: GamificationState = {
    ...current,
    goud: current.goud - target.price,
    xp: newXp,
    unlockedTitles: [...current.unlockedTitles, titleId],
    activeTitleId: titleId,
    lastPlayedAt: new Date().toISOString(),
  };

  saveGamificationState(updated, language);
  return {
    success: true,
    message: gainedXp > 0
      ? `Parabéns! Nível “${target.native}” desbloqueado! Ganhou +${gainedXp} XP e aumentou seu progresso!`
      : `Nível “${target.native}” desbloqueado e equipado!`,
    state: updated,
    gainedXp,
    leveledUp,
    newLevel,
  };
}

export function equipTitle(titleId: string, language: AppLanguage = "kreyol"): GamificationState {
  const current = getGamificationState(language);
  if (!current.unlockedTitles.includes(titleId)) return current;

  const updated: GamificationState = {
    ...current,
    activeTitleId: titleId,
    lastPlayedAt: new Date().toISOString(),
  };

  saveGamificationState(updated, language);
  return updated;
}

export function getLevelInfo(xp: number, language: AppLanguage = "kreyol"): {
  current: LevelInfo;
  progressPct: number;
  xpInLevel: number;
  xpForLevel: number;
} {
  const levels = getGamificationConfig(language).levels;
  let current = levels[0];
  for (const lvl of levels) {
    if (xp >= lvl.minXp) {
      current = lvl;
    }
  }

  const xpInLevel = Math.max(0, xp - current.minXp);
  const xpForLevel = current.nextXp - current.minXp;
  const progressPct = Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));

  return { current, progressPct, xpInLevel, xpForLevel };
}

export interface QuizWinResult {
  gainedXp: number;
  gainedGoud: number;
  newBadges: Badge[];
  leveledUp: boolean;
  isPerfect: boolean;
  oldLevel: LevelInfo;
  newLevel: LevelInfo;
  updatedState: GamificationState;
}

interface BadgeContext {
  totalSolved: number;
  streak: number;
  isPerfect: boolean;
  perfectRoundsCount: number;
  scenes: number;
  words: number;
  goud: number;
}

/** Regras de desbloqueio das conquistas de cada idioma (ids iguais, metas diferentes). */
const BADGE_RULES: Record<AppLanguage, Record<string, (c: BadgeContext) => boolean>> = {
  kreyol: {
    first_win: (c) => c.totalSolved >= 1,
    streak_3: (c) => c.streak >= 3,
    streak_5: (c) => c.streak >= 5,
    streak_10: (c) => c.streak >= 10,
    first_try: (c) => c.isPerfect,
    perfectionist: (c) => c.perfectRoundsCount >= 3,
    collector_5: (c) => c.scenes >= 5,
    collector_15: (c) => c.scenes >= 15,
    collector_30: (c) => c.scenes >= 30,
    words_25: (c) => c.words >= 25,
    words_100: (c) => c.words >= 100,
    rich_goud: (c) => c.goud >= 100,
    tycoon_goud: (c) => c.goud >= 500,
    heritage_master: (c) => c.scenes >= 4,
  },
  francais: {
    first_win: (c) => c.totalSolved >= 1,
    streak_3: (c) => c.streak >= 3,
    streak_5: (c) => c.streak >= 5,
    streak_10: (c) => c.streak >= 10,
    first_try: (c) => c.isPerfect,
    perfectionist: (c) => c.perfectRoundsCount >= 10,
    collector_5: (c) => c.scenes >= 10,
    collector_15: (c) => c.scenes >= 40,
    collector_30: (c) => c.scenes >= 100,
    words_25: (c) => c.words >= 25,
    words_100: (c) => c.words >= 100,
    rich_goud: (c) => c.goud >= 100,
    tycoon_goud: (c) => c.goud >= 500,
    heritage_master: (c) => c.scenes >= 25,
  },
};

/** No Français cada acerto é uma palavra (e não uma cena inteira), então a recompensa por acerto é menor. */
const REWARD_SCALE: Record<AppLanguage, number> = { kreyol: 1, francais: 0.3 };

/**
 * Processa a recompensa após uma vitória (Jogo das Imagens no Kreyòl,
 * "C'est quoi ?" no Français). O progresso é gravado só no idioma informado.
 */
export function recordQuizWin(params: {
  language?: AppLanguage;
  sceneId: string;
  theme?: string;
  wordsCount: number;
  attemptsLeft: number;
  streak: number;
}): QuizWinResult {
  const language: AppLanguage = params.language ?? "kreyol";
  const config = getGamificationConfig(language);
  const scale = REWARD_SCALE[language];
  const current = getGamificationState(language);
  const oldLevel = getLevelInfo(current.xp, language).current;

  // Cálculo de recompensas
  // Base (Kreyòl): 25 XP + 10 Goud
  let gainedXp = Math.max(1, Math.round(25 * scale));
  let gainedGoud = Math.max(1, Math.round(10 * scale));

  // Bônus por vida cheia (acertou de primeira sem erros: 3 vidas)
  const isPerfect = params.attemptsLeft === 3;
  if (isPerfect) {
    gainedXp += Math.round(20 * scale);
    gainedGoud += Math.round(10 * scale);
  }

  // Bônus por sequência (Combo)
  if (params.streak >= 2) {
    const streakBonus = Math.round(Math.min(params.streak * 6, 60) * scale);
    gainedXp += streakBonus;
    gainedGoud += Math.floor(streakBonus / 2);
  }

  const updatedScenes = current.scenesSolved.includes(params.sceneId)
    ? current.scenesSolved
    : [...current.scenesSolved, params.sceneId];

  const totalSolved = current.totalSolved + 1;
  const newStreak = params.streak;
  const highestStreak = Math.max(current.highestStreak, newStreak);
  const perfectRoundsCount = current.perfectRoundsCount + (isPerfect ? 1 : 0);
  const totalWordsFound = current.totalWordsFound + params.wordsCount;

  let totalXp = current.xp + gainedXp;
  let totalGoud = current.goud + gainedGoud;

  // Verificar novos badges
  const newBadges: Badge[] = [];
  const rules = BADGE_RULES[language];
  const ctx: BadgeContext = {
    totalSolved,
    streak: newStreak,
    isPerfect,
    perfectRoundsCount,
    scenes: updatedScenes.length,
    words: totalWordsFound,
    goud: totalGoud,
  };

  for (const badge of config.badges) {
    const rule = rules[badge.id];
    if (rule && rule(ctx) && !current.unlockedBadges.includes(badge.id)) {
      newBadges.push(badge);
      totalXp += badge.xpReward;
      totalGoud += badge.goudReward;
    }
  }

  const updatedUnlockedBadges = [
    ...current.unlockedBadges,
    ...newBadges.map((b) => b.id),
  ];

  const updatedState: GamificationState = {
    xp: totalXp,
    goud: totalGoud,
    totalSolved,
    highestStreak,
    currentStreak: newStreak,
    perfectRoundsCount,
    totalWordsFound,
    unlockedBadges: updatedUnlockedBadges,
    scenesSolved: updatedScenes,
    unlockedTitles: current.unlockedTitles,
    activeTitleId: current.activeTitleId,
    lastPlayedAt: new Date().toISOString(),
  };

  saveGamificationState(updatedState, language);

  const newLevel = getLevelInfo(totalXp, language).current;
  const leveledUp = newLevel.level > oldLevel.level;

  return {
    gainedXp,
    gainedGoud,
    newBadges,
    leveledUp,
    isPerfect,
    oldLevel,
    newLevel,
    updatedState,
  };
}
