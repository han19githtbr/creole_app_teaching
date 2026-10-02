// Motor de Gamificação, Níveis de Fluência e Recompensas em Kreyòl Ayisyen

export interface Badge {
  id: string;
  title: string;
  kreyol: string;
  description: string;
  emoji: string;
  xpReward: number;
  goudReward: number;
}

export const BADGES: Badge[] = [
  {
    id: "first_win",
    title: "Primeira Vitória",
    kreyol: "Premye Viktwa!",
    description: "Acertou todos os elementos da sua primeira cena.",
    emoji: "🌱",
    xpReward: 30,
    goudReward: 15,
  },
  {
    id: "streak_3",
    title: "Em Chamas",
    kreyol: "Sou Dife!",
    description: "Alcançou 3 acertos consecutivos.",
    emoji: "🔥",
    xpReward: 50,
    goudReward: 25,
  },
  {
    id: "streak_5",
    title: "Impressionante",
    kreyol: "Enpresyonan!",
    description: "Alcançou 5 acertos consecutivos sem errar.",
    emoji: "⚡",
    xpReward: 100,
    goudReward: 50,
  },
  {
    id: "streak_10",
    title: "Imbatível",
    kreyol: "Endomptab!",
    description: "Sequência incrível de 10 rodadas sem perder.",
    emoji: "👑",
    xpReward: 250,
    goudReward: 100,
  },
  {
    id: "first_try",
    title: "Olhar Clínico",
    kreyol: "Je Klè!",
    description: "Acertou a cena de primeira com todas as 3 vidas intactas.",
    emoji: "🎯",
    xpReward: 40,
    goudReward: 20,
  },
  {
    id: "collector_5",
    title: "Explorador da Galeria",
    kreyol: "Eksploratè Imaj",
    description: "Dominou 5 cenas distintas no jogo.",
    emoji: "🎨",
    xpReward: 80,
    goudReward: 40,
  },
  {
    id: "collector_20",
    title: "Mestre do Banco Ghibli",
    kreyol: "Mèt Galeri",
    description: "Dominou 20 cenas distintas no jogo.",
    emoji: "🏛️",
    xpReward: 200,
    goudReward: 100,
  },
  {
    id: "rich_goud",
    title: "Rico em Gouds",
    kreyol: "Bourjwa Kreyòl",
    description: "Acumulou 100 moedas haitianas Goud.",
    emoji: "💰",
    xpReward: 100,
    goudReward: 50,
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

export interface GamificationState {
  xp: number;
  goud: number;
  totalSolved: number;
  highestStreak: number;
  currentStreak: number;
  unlockedBadges: string[];
  scenesSolved: string[];
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
    unlockedBadges: [],
    scenesSolved: [],
  };
}

export function getGamificationState(): GamificationState {
  if (typeof window === "undefined") return getDefaultGamificationState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultGamificationState();
    return { ...getDefaultGamificationState(), ...JSON.parse(raw) };
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

export function getLevelInfo(xp: number): { current: LevelInfo; progressPct: number; xpInLevel: number; xpForLevel: number } {
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
  oldLevel: LevelInfo;
  newLevel: LevelInfo;
  updatedState: GamificationState;
}

/**
 * Processa a recompensa após uma vitória no jogo de imagens
 */
export function recordQuizWin(params: {
  sceneId: string;
  attemptsLeft: number;
  streak: number;
}): QuizWinResult {
  const current = getGamificationState();
  const oldLevel = getLevelInfo(current.xp).current;

  // Cálculo de recompensas
  // Base: 25 XP
  let gainedXp = 25;
  let gainedGoud = 10;

  // Bônus por vida cheia (acertou de primeira sem erros)
  const isPerfect = params.attemptsLeft === 3;
  if (isPerfect) {
    gainedXp += 15;
    gainedGoud += 5;
  }

  // Bônus por sequência
  if (params.streak >= 2) {
    const streakBonus = Math.min(params.streak * 5, 50);
    gainedXp += streakBonus;
    gainedGoud += Math.floor(streakBonus / 2);
  }

  const updatedScenes = current.scenesSolved.includes(params.sceneId)
    ? current.scenesSolved
    : [...current.scenesSolved, params.sceneId];

  const totalSolved = current.totalSolved + 1;
  const newStreak = params.streak;
  const highestStreak = Math.max(current.highestStreak, newStreak);
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
  checkBadge("collector_5", updatedScenes.length >= 5);
  checkBadge("collector_20", updatedScenes.length >= 20);
  checkBadge("rich_goud", totalGoud >= 100);

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
    unlockedBadges: updatedUnlockedBadges,
    scenesSolved: updatedScenes,
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
    oldLevel,
    newLevel,
    updatedState,
  };
}
