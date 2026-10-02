// Motor de Gamificação, Níveis de Fluência, Conquistas e Recompensas em Kreyòl Ayisyen

export interface Badge {
  id: string;
  title: string;
  kreyol: string;
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
    kreyol: "Premye Viktwa!",
    description: "Acertou todos os elementos da sua primeira cena.",
    emoji: "🌱",
    xpReward: 35,
    goudReward: 20,
    category: "collection",
  },
  {
    id: "streak_3",
    title: "Em Chamas",
    kreyol: "Sou Dife!",
    description: "Alcançou 3 acertos consecutivos.",
    emoji: "🔥",
    xpReward: 60,
    goudReward: 30,
    category: "streak",
  },
  {
    id: "streak_5",
    title: "Impressionante",
    kreyol: "Enpresyonan!",
    description: "Alcançou 5 acertos consecutivos sem errar.",
    emoji: "⚡",
    xpReward: 120,
    goudReward: 60,
    category: "streak",
  },
  {
    id: "streak_10",
    title: "Imbatível",
    kreyol: "Endomptab!",
    description: "Sequência épica de 10 rodadas sem perder.",
    emoji: "👑",
    xpReward: 300,
    goudReward: 150,
    category: "streak",
  },
  {
    id: "first_try",
    title: "Olhar Clínico",
    kreyol: "Je Klè!",
    description: "Acertou a cena de primeira com todas as 3 vidas intactas.",
    emoji: "🎯",
    xpReward: 45,
    goudReward: 25,
    category: "precision",
  },
  {
    id: "perfectionist",
    title: "Mestre da Precisão",
    kreyol: "Mèt Presizyon!",
    description: "Conquistou 3 rodadas perfeitas consecutivas com 3 corações.",
    emoji: "💎",
    xpReward: 150,
    goudReward: 80,
    category: "precision",
  },
  {
    id: "collector_5",
    title: "Explorador da Galeria",
    kreyol: "Eksploratè Imaj",
    description: "Dominou 5 cenas distintas no jogo.",
    emoji: "🎨",
    xpReward: 80,
    goudReward: 45,
    category: "collection",
  },
  {
    id: "collector_15",
    title: "Conhecedor Cultural",
    kreyol: "Konè Kilti",
    description: "Dominou 15 cenas distintas na galeria ilustrada.",
    emoji: "🏛️",
    xpReward: 180,
    goudReward: 90,
    category: "collection",
  },
  {
    id: "collector_30",
    title: "Mestre da Galeria",
    kreyol: "Gran Mèt Galeri",
    description: "Dominou 30 cenas com riqueza de vocabulário.",
    emoji: "🌟",
    xpReward: 350,
    goudReward: 160,
    category: "collection",
  },
  {
    id: "words_25",
    title: "Caçador de Palavras",
    kreyol: "Chasè Mo",
    description: "Acertou mais de 25 palavras em Kreyòl nas cenas.",
    emoji: "🏹",
    xpReward: 75,
    goudReward: 40,
    category: "vocabulary",
  },
  {
    id: "words_100",
    title: "Dicionário Vivo",
    kreyol: "Diksyonè Vivant",
    description: "Identificou mais de 100 palavras em Kreyòl.",
    emoji: "📚",
    xpReward: 250,
    goudReward: 120,
    category: "vocabulary",
  },
  {
    id: "rich_goud",
    title: "Rico em Gouds",
    kreyol: "Bourjwa Kreyòl",
    description: "Acumulou 100 moedas haitianas Goud.",
    emoji: "💰",
    xpReward: 100,
    goudReward: 50,
    category: "economy",
  },
  {
    id: "tycoon_goud",
    title: "Tesouro Nacional",
    kreyol: "Trezò Nasyonal",
    description: "Acumulou 500 moedas Goud em sua carteira.",
    emoji: "🪙",
    xpReward: 300,
    goudReward: 150,
    category: "economy",
  },
  {
    id: "heritage_master",
    title: "Alma Haitiana",
    kreyol: "Nanm Ayisyen",
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
  kreyol: string;
  badgeEmoji: string;
  minXp: number;
  nextXp: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Iniciante", kreyol: "Inisyatè", badgeEmoji: "🐣", minXp: 0, nextXp: 120 },
  { level: 2, title: "Aprendiz", kreyol: "Apranti", badgeEmoji: "📘", minXp: 120, nextXp: 300 },
  { level: 3, title: "Explorador", kreyol: "Eksploratè", badgeEmoji: "🧭", minXp: 300, nextXp: 600 },
  { level: 4, title: "Conversador", kreyol: "Konversatè", badgeEmoji: "💬", minXp: 600, nextXp: 1050 },
  { level: 5, title: "Conhecedor", kreyol: "Konè Kreyòl", badgeEmoji: "🌟", minXp: 1050, nextXp: 1650 },
  { level: 6, title: "Mestre da Língua", kreyol: "Mèt Lang", badgeEmoji: "🏅", minXp: 1650, nextXp: 2500 },
  { level: 7, title: "Grão-Mestre Kreyòl", kreyol: "Gran Mèt Kreyòl", badgeEmoji: "👑", minXp: 2500, nextXp: 4000 },
];

export interface HonoraryTitle {
  id: string;
  kreyol: string;
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
    kreyol: "Inisyatè Kreyòl",
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
    kreyol: "Zanmi Ayiti",
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
    kreyol: "Flanm Kreyòl",
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
    kreyol: "Anbasadè Lang",
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
    kreyol: "Gadyen Sitadèl",
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
    kreyol: "Gran Mèt Sajès",
    portuguese: "Nível 6 • Grão-Mestre da Sabedoria",
    description: "Desbloqueie com 500 Gouds virtuais. O mais alto patamar de sabedoria e prestígio da comunidade.",
    price: 500,
    xpReward: 800, // Leva a 1650+ (Nível 6: Mestre da Língua)
    levelTarget: 6,
    icon: "👑",
    gradientClass: "from-rose-500/25 to-purple-600/25 text-rose-600 dark:text-rose-400 border-rose-500/40",
  },
];

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

const STORAGE_KEY = "kreyol:gamification-state";
const CHANGE_EVENT = "kreyol:gamification-update";

export function getDefaultGamificationState(): GamificationState {
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
    unlockedTitles: ["title_inisyate"],
    activeTitleId: "title_inisyate",
  };
}

export function getGamificationState(): GamificationState {
  if (typeof window === "undefined") return getDefaultGamificationState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultGamificationState();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultGamificationState(),
      ...parsed,
      unlockedTitles: parsed.unlockedTitles || ["title_inisyate"],
      activeTitleId: parsed.activeTitleId || "title_inisyate",
    };
  } catch {
    return getDefaultGamificationState();
  }
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: state }));
  } catch {}
}

export function buyTitle(titleId: string): {
  success: boolean;
  message: string;
  state: GamificationState;
  gainedXp?: number;
  leveledUp?: boolean;
  newLevel?: LevelInfo;
} {
  const current = getGamificationState();
  const target = HONORARY_TITLES.find((t) => t.id === titleId);

  if (!target) {
    return { success: false, message: "Nível não encontrado.", state: current };
  }

  if (current.unlockedTitles.includes(titleId)) {
    return { success: false, message: "Você já possui este nível desbloqueado!", state: current };
  }

  if (current.goud < target.price) {
    return {
      success: false,
      message: `Você precisa de ${target.price} Gouds fictícios (saldo: ${current.goud} Goud). Acerte palavras nas postagens para acumular +10 Goud por acerto!`,
      state: current,
    };
  }

  const oldLevel = getLevelInfo(current.xp).current;
  const gainedXp = target.xpReward || 0;
  const newXp = current.xp + gainedXp;
  const newLevel = getLevelInfo(newXp).current;
  const leveledUp = newLevel.level > oldLevel.level;

  const updated: GamificationState = {
    ...current,
    goud: current.goud - target.price,
    xp: newXp,
    unlockedTitles: [...current.unlockedTitles, titleId],
    activeTitleId: titleId,
  };

  saveGamificationState(updated);
  return {
    success: true,
    message: gainedXp > 0
      ? `Parabéns! Nível “${target.kreyol}” desbloqueado! Ganhou +${gainedXp} XP e aumentou seu progresso!`
      : `Nível “${target.kreyol}” desbloqueado e equipado!`,
    state: updated,
    gainedXp,
    leveledUp,
    newLevel,
  };
}

export function equipTitle(titleId: string): GamificationState {
  const current = getGamificationState();
  if (!current.unlockedTitles.includes(titleId)) return current;

  const updated: GamificationState = {
    ...current,
    activeTitleId: titleId,
  };

  saveGamificationState(updated);
  return updated;
}

export function getLevelInfo(xp: number): {
  current: LevelInfo;
  progressPct: number;
  xpInLevel: number;
  xpForLevel: number;
} {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
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

/**
 * Processa a recompensa após uma vitória no jogo de imagens
 */
export function recordQuizWin(params: {
  sceneId: string;
  theme?: string;
  wordsCount: number;
  attemptsLeft: number;
  streak: number;
}): QuizWinResult {
  const current = getGamificationState();
  const oldLevel = getLevelInfo(current.xp).current;

  // Cálculo de recompensas
  // Base: 25 XP + 10 Goud
  let gainedXp = 25;
  let gainedGoud = 10;

  // Bônus por vida cheia (acertou de primeira sem erros: 3 vidas)
  const isPerfect = params.attemptsLeft === 3;
  if (isPerfect) {
    gainedXp += 20;
    gainedGoud += 10;
  }

  // Bônus por sequência (Combo)
  if (params.streak >= 2) {
    const streakBonus = Math.min(params.streak * 6, 60);
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

  function checkBadge(badgeId: string, condition: boolean) {
    if (condition && !current.unlockedBadges.includes(badgeId)) {
      const b = BADGES.find((item) => item.id === badgeId);
      if (b) {
        newBadges.push(b);
        totalXp += b.xpReward;
        totalGoud += b.goudReward;
      }
    }
  }

  checkBadge("first_win", totalSolved >= 1);
  checkBadge("streak_3", newStreak >= 3);
  checkBadge("streak_5", newStreak >= 5);
  checkBadge("streak_10", newStreak >= 10);
  checkBadge("first_try", isPerfect);
  checkBadge("perfectionist", perfectRoundsCount >= 3);
  checkBadge("collector_5", updatedScenes.length >= 5);
  checkBadge("collector_15", updatedScenes.length >= 15);
  checkBadge("collector_30", updatedScenes.length >= 30);
  checkBadge("words_25", totalWordsFound >= 25);
  checkBadge("words_100", totalWordsFound >= 100);
  checkBadge("rich_goud", totalGoud >= 100);
  checkBadge("tycoon_goud", totalGoud >= 500);
  checkBadge("heritage_master", updatedScenes.length >= 4);

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

  saveGamificationState(updatedState);

  const newLevel = getLevelInfo(totalXp).current;
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
