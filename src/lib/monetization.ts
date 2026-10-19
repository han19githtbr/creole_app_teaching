import { connectDB } from "@/lib/mongodb";
import User, { type IUser } from "@/models/User";
import MonetizationSettings, {
  DEFAULT_MONETIZATION_SETTINGS,
  type IMonetizationSettings,
  type IMonetizationPackage,
} from "@/models/MonetizationSettings";

export interface UserMonetizationStatus {
  isAdmin: boolean;
  isExempt: boolean;
  freeAccessReason?: string;
  hasUnlimitedAccess: boolean;

  // Degustação (Trial) de 3 Dias
  inTrial: boolean;
  trialExpiresAt: string | null;
  trialDaysLeft: number;
  trialHoursLeft: number;
  trialStoriesUsed: number;
  trialStoriesTotal: number;
  trialStoriesLeft: number;
  trialGamesUsed: number;
  trialGamesTotal: number;
  trialGamesLeft: number;

  // Saldo
  availableMinutes: number;
  bonusStoriesBalance: number;
  bonusGamesBalance: number;

  // Métricas do Sistema
  storyMinuteCost: number; // Ex: 2 créditos * 2 min = 4 minutos
  storyCreditsCost: number;
  minutesPerCredit: number;
  gameMinuteCost: number;
  gameCreditsCost: number;

  // Permissão de Acesso
  canAccessStories: boolean;
  canAccessGame: boolean;

  // Uso Acumulado
  totalStoriesTimeMinutes: number;
  totalCquoiTimeMinutes: number;
  totalStoriesWatched: number;
  totalCquoiGamesPlayed: number;

  packages: IMonetizationPackage[];
}

/**
 * Obtém ou inicializa as configurações globais de monetização no banco.
 */
export async function getMonetizationSettings(): Promise<IMonetizationSettings> {
  await connectDB();
  let settings = await MonetizationSettings.findOne({ key: "default" });
  if (!settings) {
    try {
      settings = await MonetizationSettings.create(DEFAULT_MONETIZATION_SETTINGS);
    } catch {
      settings = await MonetizationSettings.findOne({ key: "default" });
    }
  }
  return settings || (DEFAULT_MONETIZATION_SETTINGS as unknown as IMonetizationSettings);
}

/**
 * Calcula o status de acesso e monetização do usuário.
 */
export function calculateUserMonetizationStatus(
  user: IUser,
  settings: IMonetizationSettings
): UserMonetizationStatus {
  const isAdmin = user.role === "admin";
  const isExempt = Boolean(user.isExemptFromBilling || isAdmin);
  const hasUnlimitedAccess = isAdmin || isExempt;

  const storyMinuteCost = Math.round((settings.storyCreditsCost || 2) * (settings.minutesPerCredit || 2));
  const gameMinuteCost = Math.round((settings.gameCreditsCost || 1) * (settings.minutesPerCredit || 2));

  // Cálculo da Degustação (Trial de 3 Dias)
  const now = Date.now();
  let trialExpiresAt = user.trialExpiresAt ? new Date(user.trialExpiresAt).getTime() : null;

  // Se o usuário não tiver data de trial (usuário antigo), inicializa a partir da criação ou dá os 3 dias
  if (!trialExpiresAt) {
    const createdTime = user.createdAt ? new Date(user.createdAt).getTime() : now;
    trialExpiresAt = createdTime + (settings.newStudentTrialDays || 3) * 24 * 60 * 60 * 1000;
  }

  const msLeft = trialExpiresAt - now;
  const trialDaysLeft = msLeft > 0 ? Math.ceil(msLeft / (24 * 60 * 60 * 1000)) : 0;
  const trialHoursLeft = msLeft > 0 ? Math.ceil(msLeft / (60 * 60 * 1000)) : 0;
  const isTimeInTrial = msLeft > 0;

  const trialStoriesTotal = settings.newStudentTrialStories || 3;
  const trialGamesTotal = settings.newStudentTrialGames || 3;
  const trialStoriesUsed = user.trialStoriesUsed || 0;
  const trialGamesUsed = user.trialGamesUsed || 0;
  const trialStoriesLeft = Math.max(0, trialStoriesTotal - trialStoriesUsed);
  const trialGamesLeft = Math.max(0, trialGamesTotal - trialGamesUsed);

  const inTrial = isTimeInTrial && (trialStoriesLeft > 0 || trialGamesLeft > 0);

  const availableMinutes = Number(user.availableMinutes || 0);
  const bonusStoriesBalance = Number(user.bonusStoriesBalance || 0);
  const bonusGamesBalance = Number(user.bonusGamesBalance || 0);

  // Regra de Permissão para Histórias
  // Acessa se: for Admin/Isento OU estiver no trial com histórias disponíveis OU tiver histórias bônus OU tiver saldo de minutos
  const canAccessStories =
    hasUnlimitedAccess ||
    (isTimeInTrial && trialStoriesLeft > 0) ||
    bonusStoriesBalance > 0 ||
    availableMinutes >= 0.5;

  // Regra de Permissão para o Jogo C'est quoi ?
  // Acessa se: for Admin/Isento OU estiver no trial com jogos disponíveis OU tiver saldo de minutos
  const canAccessGame =
    hasUnlimitedAccess ||
    (isTimeInTrial && trialGamesLeft > 0) ||
    bonusGamesBalance > 0 ||
    availableMinutes >= 0.5;

  return {
    isAdmin,
    isExempt,
    freeAccessReason: user.freeAccessReason || (isAdmin ? "Administrador" : ""),
    hasUnlimitedAccess,
    inTrial,
    trialExpiresAt: trialExpiresAt ? new Date(trialExpiresAt).toISOString() : null,
    trialDaysLeft,
    trialHoursLeft,
    trialStoriesUsed,
    trialStoriesTotal,
    trialStoriesLeft,
    trialGamesUsed,
    trialGamesTotal,
    trialGamesLeft,
    availableMinutes,
    bonusStoriesBalance,
    bonusGamesBalance,
    storyMinuteCost,
    storyCreditsCost: settings.storyCreditsCost,
    minutesPerCredit: settings.minutesPerCredit,
    gameMinuteCost,
    gameCreditsCost: settings.gameCreditsCost,
    canAccessStories,
    canAccessGame,
    totalStoriesTimeMinutes: Math.round((user.totalStoriesTimeSeconds || 0) / 60),
    totalCquoiTimeMinutes: Math.round((user.totalCquoiTimeSeconds || 0) / 60),
    totalStoriesWatched: user.totalStoriesWatched || 0,
    totalCquoiGamesPlayed: user.totalCquoiGamesPlayed || 0,
    packages: settings.packages || DEFAULT_MONETIZATION_SETTINGS.packages,
  };
}

/**
 * Registra o batimento de tempo ativo (apenas Histórias ou Jogo).
 * Retorna o status atualizado do usuário.
 */
export async function recordActiveHeartbeat(
  email: string,
  feature: "stories" | "cquoi",
  seconds: number
) {
  await connectDB();
  const settings = await getMonetizationSettings();
  const user = await User.findOne({ email });
  if (!user) return null;

  const safeSeconds = Math.max(1, Math.min(seconds, 60)); // Limite de 60s por batimento de segurança
  const status = calculateUserMonetizationStatus(user, settings);

  const update: Record<string, unknown> = {
    lastActiveAt: new Date(),
  };

  if (feature === "stories") {
    update.$inc = {
      totalStoriesTimeSeconds: safeSeconds,
    };
  } else {
    update.$inc = {
      totalCquoiTimeSeconds: safeSeconds,
    };
  }

  // Se o usuário não tiver acesso ilimitado e não estiver com histórias/jogos livres do trial
  if (!status.hasUnlimitedAccess) {
    const isExemptByTrial =
      feature === "stories"
        ? status.inTrial && status.trialStoriesLeft > 0
        : status.inTrial && status.trialGamesLeft > 0;

    // Se não estiver coberto pelo trial, deduz o tempo ativo da cota em minutos
    if (!isExemptByTrial) {
      const minutesToDeduct = safeSeconds / 60;
      const currentMinutes = user.availableMinutes || 0;
      const newMinutes = Math.max(0, Number((currentMinutes - minutesToDeduct).toFixed(2)));
      update.availableMinutes = newMinutes;
    }
  }

  const updatedUser = await User.findOneAndUpdate({ email }, update, { new: true });
  return calculateUserMonetizationStatus(updatedUser, settings);
}

/**
 * Registra o consumo de uma unidade de conteúdo (1 História assistida ou 1 Jogo completado).
 */
export async function consumeContentUnit(
  email: string,
  feature: "story" | "game"
) {
  await connectDB();
  const settings = await getMonetizationSettings();
  const user = await User.findOne({ email });
  if (!user) return { success: false, error: "user_not_found" };

  const status = calculateUserMonetizationStatus(user, settings);

  // Se for admin ou isento, apenas registra a estatística de consumo
  if (status.hasUnlimitedAccess) {
    const incField = feature === "story" ? "totalStoriesWatched" : "totalCquoiGamesPlayed";
    await User.updateOne({ email }, { $inc: { [incField]: 1 } });
    return { success: true, isExempt: true };
  }

  // Se estiver no período de degustação (Trial) e tiver cota grátis disponível
  if (status.inTrial) {
    if (feature === "story" && status.trialStoriesLeft > 0) {
      await User.updateOne(
        { email },
        { $inc: { trialStoriesUsed: 1, totalStoriesWatched: 1 } }
      );
      return { success: true, consumedFrom: "trial", trialStoriesLeft: status.trialStoriesLeft - 1 };
    }
    if (feature === "game" && status.trialGamesLeft > 0) {
      await User.updateOne(
        { email },
        { $inc: { trialGamesUsed: 1, totalCquoiGamesPlayed: 1 } }
      );
      return { success: true, consumedFrom: "trial", trialGamesLeft: status.trialGamesLeft - 1 };
    }
  }

  // Se não estiver no trial, verificar bônus ou saldo de minutos
  if (feature === "story") {
    // 1. Tenta usar história bônus
    if ((user.bonusStoriesBalance || 0) > 0) {
      await User.updateOne(
        { email },
        { $inc: { bonusStoriesBalance: -1, totalStoriesWatched: 1 } }
      );
      return { success: true, consumedFrom: "bonus_story" };
    }

    // 2. Tenta descontar da cota de minutos: storyCreditsCost * minutesPerCredit
    const requiredMinutes = status.storyMinuteCost;
    if ((user.availableMinutes || 0) < requiredMinutes) {
      return {
        success: false,
        error: "insufficient_balance",
        requiredMinutes,
        availableMinutes: user.availableMinutes || 0,
      };
    }

    await User.updateOne(
      { email },
      {
        $inc: {
          availableMinutes: -requiredMinutes,
          totalStoriesWatched: 1,
        },
      }
    );
    return { success: true, consumedFrom: "minutes", deductedMinutes: requiredMinutes };
  } else {
    // Jogo C'est quoi
    const requiredMinutes = status.gameMinuteCost;
    if ((user.availableMinutes || 0) < requiredMinutes) {
      return {
        success: false,
        error: "insufficient_balance",
        requiredMinutes,
        availableMinutes: user.availableMinutes || 0,
      };
    }

    await User.updateOne(
      { email },
      {
        $inc: {
          availableMinutes: -requiredMinutes,
          totalCquoiGamesPlayed: 1,
        },
      }
    );
    return { success: true, consumedFrom: "minutes", deductedMinutes: requiredMinutes };
  }
}

/**
 * Sorteia alunos aleatórios que ainda não são isentos e concede Acesso Gratuito Vitalício.
 */
export async function drawRandomStudents(count: number = 1, reason: string = "Sorteio da Plataforma") {
  await connectDB();
  const eligibleUsers = await User.find({
    role: "user",
    isExemptFromBilling: { $ne: true },
  }).select("_id name email image createdAt");

  if (!eligibleUsers.length) {
    return { winners: [], count: 0, message: "Não há alunos elegíveis para sorteio no momento." };
  }

  // Embaralha usando algoritmo Fisher-Yates
  const shuffled = [...eligibleUsers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const winners = shuffled.slice(0, Math.min(count, shuffled.length));
  const winnerIds = winners.map((w) => w._id);

  await User.updateMany(
    { _id: { $in: winnerIds } },
    {
      $set: {
        isExemptFromBilling: true,
        freeAccessReason: reason,
      },
    }
  );

  return {
    winners: winners.map((w) => ({
      id: w._id.toString(),
      name: w.name,
      email: w.email,
      image: w.image,
      reason,
    })),
    count: winners.length,
    message: `${winners.length} aluno(s) sorteado(s) com sucesso com acesso gratuito!`,
  };
}
