import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/apiAuth";
import {
  BADGES,
  getDefaultGamificationState,
  HONORARY_TITLES,
  type GamificationState,
} from "@/lib/gamification";
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

function sanitizeState(value: unknown): GamificationState | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<GamificationState>;
  const defaults = getDefaultGamificationState();
  const unlockedTitles = stringList(input.unlockedTitles, new Set(HONORARY_TITLES.map((title) => title.id)), 100);
  if (!unlockedTitles.includes("title_inisyate")) unlockedTitles.unshift("title_inisyate");
  const requestedActiveTitle = typeof input.activeTitleId === "string" ? input.activeTitleId : "";
  const activeTitleId = unlockedTitles.includes(requestedActiveTitle)
    ? requestedActiveTitle
    : "title_inisyate";
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
    unlockedBadges: stringList(input.unlockedBadges, new Set(BADGES.map((badge) => badge.id)), 100),
    scenesSolved: stringList(input.scenesSolved),
    unlockedTitles,
    activeTitleId,
    ...(lastPlayedAt ? { lastPlayedAt } : {}),
  };
}

function mergeLegacyState(current: GamificationState, legacy: GamificationState): GamificationState {
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
      (legacyIsNewer || current.activeTitleId === "title_inisyate")
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

export async function GET() {
  const session = await requireUser();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email })
    .select("gamificationState gamificationRevision")
    .lean<{ gamificationState?: unknown; gamificationRevision?: number }>();
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  const state = sanitizeState(user.gamificationState);
  return NextResponse.json({
    state: state ?? getDefaultGamificationState(),
    initialized: Boolean(state),
    revision: user.gamificationRevision ?? 0,
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
  } | null;
  const incomingState = sanitizeState(body?.state);
  if (!incomingState) return NextResponse.json({ error: "Estado de gamificação inválido." }, { status: 400 });
  if (body?.mode && body.mode !== "mergeLegacy" && body.mode !== "replace") {
    return NextResponse.json({ error: "Modo de sincronização inválido." }, { status: 400 });
  }
  const baseState = sanitizeState(body?.baseState) ?? getDefaultGamificationState();
  const expectedRevision = boundedNumber(body?.revision, 0);

  await connectDB();
  let user = await User.findOne({ email }).select("gamificationState gamificationRevision");
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const currentRevision = boundedNumber(user.gamificationRevision, 0);
    const currentState = sanitizeState(user.gamificationState) ?? getDefaultGamificationState();
    const state = body?.mode === "mergeLegacy" && user.gamificationState
      ? mergeLegacyState(currentState, incomingState)
      : currentRevision === expectedRevision
        ? incomingState
        : mergeConcurrentState(currentState, incomingState, baseState);
    const revisionFilter = currentRevision === 0
      ? { $or: [{ gamificationRevision: 0 }, { gamificationRevision: { $exists: false } }] }
      : { gamificationRevision: currentRevision };
    const updated = await User.findOneAndUpdate(
      { _id: user._id, ...revisionFilter },
      { $set: { gamificationState: state, gamificationRevision: currentRevision + 1 } },
      { new: true }
    ).select("gamificationState gamificationRevision");

    if (updated) {
      return NextResponse.json({
        state: sanitizeState(updated.gamificationState) ?? state,
        initialized: true,
        revision: updated.gamificationRevision ?? currentRevision + 1,
      });
    }

    user = await User.findOne({ email }).select("gamificationState gamificationRevision");
    if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ error: "Não foi possível sincronizar o progresso. Tente novamente." }, { status: 409 });
}
