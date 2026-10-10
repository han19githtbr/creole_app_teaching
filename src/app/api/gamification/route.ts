import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/apiAuth";
import {
  getDefaultGamificationState,
  getGamificationConfig,
  type GamificationState,
} from "@/lib/gamification";
import { isAppLanguage, type AppLanguage } from "@/lib/languageShared";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const MAX_TRACKED_SCENES = 5000;

function boundedNumber(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(Math.floor(value), 1_000_000_000));
}

function stringList(value: unknown, allowed?: Set<string>, limit = MAX_TRACKED_SCENES): string[] {
  if (!Array.isArray(value)) return [];
  const values = value.filter((item): item is string =>
    typeof item === "string" && item.length > 0 && item.length <= 120 && (!allowed || allowed.has(item))
  );
  return [...new Set(values)].slice(0, limit);
}

/** Cada idioma guarda o seu progresso em campos próprios do usuário. */
function languageFields(language: AppLanguage) {
  return language === "francais"
    ? { stateField: "gamificationStateFrancais", revisionField: "gamificationRevisionFrancais" }
    : { stateField: "gamificationState", revisionField: "gamificationRevision" };
}

function readLanguage(value: unknown): AppLanguage {
  return isAppLanguage(value) ? value : "kreyol";
}

function sanitizeState(value: unknown, language: AppLanguage): GamificationState | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<GamificationState>;
  const defaults = getDefaultGamificationState(language);
  const config = getGamificationConfig(language);
  const defaultTitleId = config.defaultTitleId;
  const unlockedTitles = stringList(input.unlockedTitles, new Set(config.titles.map((title) => title.id)), 100);
  if (!unlockedTitles.includes(defaultTitleId)) unlockedTitles.unshift(defaultTitleId);
  const requestedActiveTitle = typeof input.activeTitleId === "string" ? input.activeTitleId : "";
  const activeTitleId = unlockedTitles.includes(requestedActiveTitle)
    ? requestedActiveTitle
    : defaultTitleId;
  const lastPlayedAt = typeof input.lastPlayedAt === "string" && !Number.isNaN(Date.parse(input.lastPlayedAt))
    ? new Date(input.lastPlayedAt).toISOString()
    : undefined;

  return {
    xp: boundedNumber(input.xp, defaults.xp),
    goud: boundedNumber(input.goud, defaults.goud),
    totalSolved: boundedNumber(input.totalSolved, defaults.totalSolved),
    highestStreak: boundedNumber(input.highestStreak, defaults.highestStreak),
    currentStreak: boundedNumber(input.currentStreak, defaults.currentStreak),
    perfectRoundsCount: boundedNumber(input.perfectRoundsCount, defaults.perfectRoundsCount),
    totalWordsFound: boundedNumber(input.totalWordsFound, defaults.totalWordsFound),
    unlockedBadges: stringList(input.unlockedBadges, new Set(config.badges.map((badge) => badge.id)), 100),
    scenesSolved: stringList(input.scenesSolved),
    unlockedTitles,
    activeTitleId,
    ...(lastPlayedAt ? { lastPlayedAt } : {}),
  };
}

function mergeLegacyState(current: GamificationState, legacy: GamificationState, defaultTitleId: string): GamificationState {
  const unlockedTitles = [...new Set([...current.unlockedTitles, ...legacy.unlockedTitles])];
  const legacyIsNewer = Boolean(
    legacy.lastPlayedAt && (!current.lastPlayedAt || legacy.lastPlayedAt > current.lastPlayedAt)
  );

  return {
    xp: Math.max(current.xp, legacy.xp),
    goud: Math.max(current.goud, legacy.goud),
    totalSolved: Math.max(current.totalSolved, legacy.totalSolved),
    highestStreak: Math.max(current.highestStreak, legacy.highestStreak),
    currentStreak: Math.max(current.currentStreak, legacy.currentStreak),
    perfectRoundsCount: Math.max(current.perfectRoundsCount, legacy.perfectRoundsCount),
    totalWordsFound: Math.max(current.totalWordsFound, legacy.totalWordsFound),
    unlockedBadges: [...new Set([...current.unlockedBadges, ...legacy.unlockedBadges])],
    scenesSolved: [...new Set([...current.scenesSolved, ...legacy.scenesSolved])].slice(0, MAX_TRACKED_SCENES),
    unlockedTitles,
    activeTitleId: unlockedTitles.includes(legacy.activeTitleId) &&
      (legacyIsNewer || current.activeTitleId === defaultTitleId)
      ? legacy.activeTitleId
      : current.activeTitleId,
    ...(current.lastPlayedAt || legacy.lastPlayedAt
      ? { lastPlayedAt: [current.lastPlayedAt, legacy.lastPlayedAt].filter(Boolean).sort().at(-1) }
      : {}),
  };
}

function mergeConcurrentState(
  current: GamificationState,
  incoming: GamificationState,
  base: GamificationState
): GamificationState {
  const unlockedBadges = [...new Set([...current.unlockedBadges, ...incoming.unlockedBadges])];
  const scenesSolved = [...new Set([...current.scenesSolved, ...incoming.scenesSolved])].slice(0, MAX_TRACKED_SCENES);
  const unlockedTitles = [...new Set([...current.unlockedTitles, ...incoming.unlockedTitles])];
  const incomingIsNewer = Boolean(
    incoming.lastPlayedAt && (!current.lastPlayedAt || incoming.lastPlayedAt > current.lastPlayedAt)
  );
  const activeTitleId = incoming.activeTitleId !== base.activeTitleId &&
      unlockedTitles.includes(incoming.activeTitleId)
    ? incoming.activeTitleId
    : current.activeTitleId;

  return {
    xp: Math.min(1_000_000_000, current.xp + Math.max(0, incoming.xp - base.xp)),
    goud: Math.max(0, Math.min(1_000_000_000, current.goud + incoming.goud - base.goud)),
    totalSolved: Math.min(1_000_000_000, current.totalSolved + Math.max(0, incoming.totalSolved - base.totalSolved)),
    highestStreak: Math.max(current.highestStreak, incoming.highestStreak),
    currentStreak: incomingIsNewer ? incoming.currentStreak : current.currentStreak,
    perfectRoundsCount: Math.min(
      1_000_000_000,
      current.perfectRoundsCount + Math.max(0, incoming.perfectRoundsCount - base.perfectRoundsCount)
    ),
    totalWordsFound: Math.min(
      1_000_000_000,
      current.totalWordsFound + Math.max(0, incoming.totalWordsFound - base.totalWordsFound)
    ),
    unlockedBadges,
    scenesSolved,
    unlockedTitles,
    activeTitleId,
    ...(current.lastPlayedAt || incoming.lastPlayedAt
      ? { lastPlayedAt: [current.lastPlayedAt, incoming.lastPlayedAt].filter(Boolean).sort().at(-1) }
      : {}),
  };
}

export async function GET(req: NextRequest) {
  const language = readLanguage(req.nextUrl.searchParams.get("language"));
  const { stateField, revisionField } = languageFields(language);
  const session = await requireUser();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email })
    .select(`${stateField} ${revisionField}`)
    .lean<Record<string, unknown>>();
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  const state = sanitizeState(user[stateField], language);
  return NextResponse.json({
    state: state ?? getDefaultGamificationState(language),
    initialized: Boolean(state),
    revision: typeof user[revisionField] === "number" ? (user[revisionField] as number) : 0,
  });
}

export async function PUT(req: NextRequest) {
  const session = await requireUser();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null) as {
    state?: unknown;
    baseState?: unknown;
    revision?: unknown;
    mode?: string;
    language?: unknown;
  } | null;
  const language = readLanguage(body?.language);
  const { stateField, revisionField } = languageFields(language);
  const defaultTitleId = getGamificationConfig(language).defaultTitleId;
  const incomingState = sanitizeState(body?.state, language);
  if (!incomingState) return NextResponse.json({ error: "Estado de gamificação inválido." }, { status: 400 });
  if (body?.mode && body.mode !== "mergeLegacy" && body.mode !== "replace") {
    return NextResponse.json({ error: "Modo de sincronização inválido." }, { status: 400 });
  }
  const baseState = sanitizeState(body?.baseState, language) ?? getDefaultGamificationState(language);
  const expectedRevision = boundedNumber(body?.revision, 0);

  await connectDB();
  const selectFields = `${stateField} ${revisionField}`;
  let user = await User.findOne({ email }).select(selectFields);
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const currentRevision = boundedNumber(user.get(revisionField), 0);
    const storedState = user.get(stateField);
    const currentState = sanitizeState(storedState, language) ?? getDefaultGamificationState(language);
    const state = body?.mode === "mergeLegacy" && storedState
      ? mergeLegacyState(currentState, incomingState, defaultTitleId)
      : currentRevision === expectedRevision
        ? incomingState
        : mergeConcurrentState(currentState, incomingState, baseState);
    const revisionFilter = currentRevision === 0
      ? { $or: [{ [revisionField]: 0 }, { [revisionField]: { $exists: false } }] }
      : { [revisionField]: currentRevision };
    const updated = await User.findOneAndUpdate(
      { _id: user._id, ...revisionFilter },
      { $set: { [stateField]: state, [revisionField]: currentRevision + 1 } },
      { new: true }
    ).select(selectFields);

    if (updated) {
      return NextResponse.json({
        state: sanitizeState(updated.get(stateField), language) ?? state,
        initialized: true,
        revision: boundedNumber(updated.get(revisionField), currentRevision + 1),
      });
    }

    user = await User.findOne({ email }).select(selectFields);
    if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ error: "Não foi possível sincronizar o progresso. Tente novamente." }, { status: 409 });
}
