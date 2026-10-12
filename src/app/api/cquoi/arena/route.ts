import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/apiAuth";
import User from "@/models/User";
import CquoiPlayer from "@/models/CquoiPlayer";
import CquoiChallenge from "@/models/CquoiChallenge";
import { LEVELS, isLevel, maxScoreFor, type Level } from "@/lib/cquoiLevels";

export const dynamic = "force-dynamic";

/** Quem deu sinal de vida nos últimos 45 s está online (o jogo manda um batimento a cada ~15 s). */
const ONLINE_MS = 45_000;
/** Um convite não respondido vale por 10 minutos. */
const PENDING_MS = 10 * 60_000;
const RANKING_SIZE = 20;
const ONLINE_LIST_SIZE = 30;

type Board = "week" | "all" | Level;

interface PlayerLean {
  userId: mongoose.Types.ObjectId;
  name: string;
  image?: string;
  visible: boolean;
  lastSeenAt: Date;
  status: "lobby" | "playing";
  level?: Level;
  liveScore: number;
  liveRound: number;
  liveTotal: number;
  weekKey: string;
  weekPoints: number;
  totalPoints: number;
  gamesPlayed: number;
  best?: Partial<Record<Level, number>>;
  duelWins: number;
  duelLosses: number;
  lastScoreAt?: Date;
}

interface ChallengeLean {
  _id: mongoose.Types.ObjectId;
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  level: Level;
  themeId: string;
  itemIds: string[];
  status: "pending" | "accepted" | "declined" | "finished";
  fromScore?: number;
  toScore?: number;
  winner?: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

/** Semana ISO no fuso de Brasília (UTC-3), ex.: 2026-W41. */
function weekKeyNow(): string {
  const d = new Date(Date.now() - 3 * 3600_000);
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function parseBoard(value: unknown): Board {
  if (value === "all" || value === "week") return value;
  return isLevel(value) ? value : "week";
}

function int(value: unknown, min: number, max: number): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  return r < min || r > max ? null : r;
}

function clampInt(value: unknown, max: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : 0;
}

async function currentUser() {
  const session = await requireUser();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) return null;
  await connectDB();
  return User.findOne({ email }).select("_id name image").lean<{ _id: mongoose.Types.ObjectId; name: string; image?: string }>();
}

function pointsFor(player: PlayerLean, board: Board): number {
  if (board === "week") return player.weekKey === weekKeyNow() ? player.weekPoints : 0;
  if (board === "all") return player.totalPoints;
  return player.best?.[board] ?? 0;
}

function boardFilter(board: Board): { filter: Record<string, unknown>; field: string } {
  if (board === "week") return { filter: { weekKey: weekKeyNow(), weekPoints: { $gt: 0 } }, field: "weekPoints" };
  if (board === "all") return { filter: { totalPoints: { $gt: 0 } }, field: "totalPoints" };
  return { filter: { [`best.${board}`]: { $gt: 0 } }, field: `best.${board}` };
}

async function buildArena(meId: mongoose.Types.ObjectId, board: Board) {
  const now = Date.now();
  const onlineSince = new Date(now - ONLINE_MS);

  // ---- ranking ----
  const { filter, field } = boardFilter(board);
  const top = await CquoiPlayer.find(filter)
    .sort({ [field]: -1, totalPoints: -1, _id: 1 })
    .limit(RANKING_SIZE)
    .lean<PlayerLean[]>();
  const mine = await CquoiPlayer.findOne({ userId: meId }).lean<PlayerLean | null>();
  let myRank: { rank: number; points: number } | null = null;
  if (mine) {
    const points = pointsFor(mine, board);
    if (points > 0) {
      const ahead = await CquoiPlayer.countDocuments({ ...filter, [field]: { $gt: points } });
      myRank = { rank: ahead + 1, points };
    }
  }

  // ---- online ----
  const onlineDocs = await CquoiPlayer.find({ visible: true, lastSeenAt: { $gt: onlineSince }, userId: { $ne: meId } })
    .sort({ status: -1, liveScore: -1 })
    .limit(ONLINE_LIST_SIZE)
    .lean<PlayerLean[]>();
  const totalOnline = await CquoiPlayer.countDocuments({ visible: true, lastSeenAt: { $gt: onlineSince } });

  // ---- convites e duelos ----
  const incomingDocs = await CquoiChallenge.find({ to: meId, status: "pending", createdAt: { $gt: new Date(now - PENDING_MS) } })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean<ChallengeLean[]>();
  const duelDocs = (
    await CquoiChallenge.find({
      $or: [{ from: meId }, { to: meId }],
      status: { $in: ["pending", "accepted", "finished"] },
      createdAt: { $gt: new Date(now - 24 * 3600_000) },
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean<ChallengeLean[]>()
  ).filter((c) => c.status !== "pending" || now - c.createdAt.getTime() < PENDING_MS);

  const ids = new Set<string>();
  for (const c of [...incomingDocs, ...duelDocs]) {
    ids.add(String(c.from));
    ids.add(String(c.to));
  }
  const people = ids.size
    ? await CquoiPlayer.find({ userId: { $in: [...ids] } }).select("userId name image").lean<Pick<PlayerLean, "userId" | "name" | "image">[]>()
    : [];
  const personById = new Map(people.map((p) => [String(p.userId), { id: String(p.userId), name: p.name, image: p.image ?? null }]));
  const person = (id: mongoose.Types.ObjectId) => personById.get(String(id)) ?? { id: String(id), name: "Jogador", image: null };

  return {
    me: { id: String(meId), visible: mine?.visible !== false },
    board,
    weekKey: weekKeyNow(),
    totalOnline,
    online: onlineDocs.map((p) => ({
      id: String(p.userId),
      name: p.name,
      image: p.image ?? null,
      status: p.status,
      level: p.level ?? null,
      score: p.liveScore,
      round: p.liveRound,
      total: p.liveTotal,
    })),
    ranking: top.map((p, index) => ({
      rank: index + 1,
      id: String(p.userId),
      name: p.name,
      image: p.image ?? null,
      points: pointsFor(p, board),
      games: p.gamesPlayed,
      duelWins: p.duelWins,
      online: p.visible && p.lastSeenAt.getTime() > onlineSince.getTime(),
      isMe: String(p.userId) === String(meId),
    })),
    myRank,
    incoming: incomingDocs.map((c) => ({
      id: String(c._id),
      from: person(c.from),
      level: c.level,
      themeId: c.themeId,
      rounds: c.itemIds.length,
      createdAt: c.createdAt.toISOString(),
    })),
    duels: duelDocs.map((c) => {
      const iAmChallenger = String(c.from) === String(meId);
      const myScore = iAmChallenger ? c.fromScore : c.toScore;
      const theirScore = iAmChallenger ? c.toScore : c.fromScore;
      let result: "win" | "loss" | "draw" | null = null;
      if (c.status === "finished") result = c.winner ? (String(c.winner) === String(meId) ? "win" : "loss") : "draw";
      return {
        id: String(c._id),
        opponent: person(iAmChallenger ? c.to : c.from),
        level: c.level,
        status: c.status,
        iAmChallenger,
        myScore: myScore ?? null,
        theirScore: theirScore ?? null,
        result,
        canPlay: !iAmChallenger && c.status === "accepted" && myScore === undefined,
      };
    }),
  };
}

// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Faça login para jogar." }, { status: 401 });
  const board = parseBoard(req.nextUrl.searchParams.get("board"));
  return NextResponse.json(await buildArena(me._id, board));
}

export async function POST(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Faça login para jogar." }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.action !== "string") return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  const board = parseBoard(body.board);

  switch (body.action) {
    // ---------- batimento: marca o jogador como online e devolve o painel ----------
    case "heartbeat": {
      const set: Record<string, unknown> = {
        name: me.name,
        visible: body.visible !== false,
        lastSeenAt: new Date(),
        status: body.status === "playing" ? "playing" : "lobby",
        liveScore: clampInt(body.score, 6000),
        liveRound: clampInt(body.round, 20),
        liveTotal: clampInt(body.total, 20),
      };
      if (me.image) set.image = me.image;
      const update: Record<string, unknown> = { $set: set, $setOnInsert: { weekKey: weekKeyNow() } };
      if (isLevel(body.level)) set.level = body.level;
      else update.$unset = { level: "" };
      await CquoiPlayer.findOneAndUpdate({ userId: me._id }, update, { upsert: true });
      return NextResponse.json(await buildArena(me._id, board));
    }

    // ---------- saiu do jogo ----------
    case "leave": {
      await CquoiPlayer.updateOne({ userId: me._id }, { $set: { lastSeenAt: new Date(0), status: "lobby", liveScore: 0, liveRound: 0 } });
      return NextResponse.json({ ok: true });
    }

    // ---------- fim de partida: soma no ranking (e no duelo, se houver) ----------
    case "score": {
      if (!isLevel(body.level)) return NextResponse.json({ error: "Nível inválido." }, { status: 400 });
      const level = body.level;
      const cfg = LEVELS[level];
      const total = int(body.total, 1, cfg.rounds);
      const hits = total === null ? null : int(body.hits, 0, total);
      const score = int(body.score, 0, maxScoreFor(level));
      if (total === null || hits === null || score === null) return NextResponse.json({ error: "Pontuação inválida." }, { status: 400 });
      // cada acerto vale no máximo (10 + 10 + 10) × multiplicador
      if (score > hits * (Math.round(30 * cfg.multiplier) + 1)) return NextResponse.json({ error: "Pontuação inválida." }, { status: 400 });

      const existing = await CquoiPlayer.findOne({ userId: me._id }).select("lastScoreAt").lean<Pick<PlayerLean, "lastScoreAt"> | null>();
      if (existing?.lastScoreAt && Date.now() - existing.lastScoreAt.getTime() < 8_000) {
        return NextResponse.json({ error: "Calma! Envie a próxima pontuação em alguns segundos." }, { status: 429 });
      }

      const week = weekKeyNow();
      await CquoiPlayer.updateOne({ userId: me._id, weekKey: { $ne: week } }, { $set: { weekKey: week, weekPoints: 0 } });
      const set: Record<string, unknown> = { name: me.name, lastSeenAt: new Date(), status: "lobby", liveScore: 0, liveRound: 0, lastScoreAt: new Date() };
      if (me.image) set.image = me.image;
      await CquoiPlayer.findOneAndUpdate(
        { userId: me._id },
        {
          $inc: { totalPoints: score, weekPoints: score, gamesPlayed: 1 },
          $max: { [`best.${level}`]: score },
          $set: set,
          $setOnInsert: { weekKey: week },
        },
        { upsert: true }
      );

      let duel: { id: string; status: string; myScore: number; theirScore: number | null; result: "win" | "loss" | "draw" | null } | null = null;
      if (typeof body.challengeId === "string" && mongoose.isValidObjectId(body.challengeId)) {
        duel = await recordDuelScore(body.challengeId, me._id, score);
      }
      const arena = await buildArena(me._id, board);
      return NextResponse.json({ ok: true, duel, arena });
    }

    // ---------- desafiar um jogador online ----------
    case "challenge": {
      if (typeof body.to !== "string" || !mongoose.isValidObjectId(body.to) || body.to === String(me._id)) {
        return NextResponse.json({ error: "Jogador inválido." }, { status: 400 });
      }
      if (!isLevel(body.level)) return NextResponse.json({ error: "Nível inválido." }, { status: 400 });
      const level = body.level;
      const itemIds = Array.isArray(body.itemIds) ? body.itemIds : [];
      if (
        itemIds.length < 1 ||
        itemIds.length > LEVELS[level].rounds ||
        itemIds.some((id) => typeof id !== "string" || id.length > 80 || !/^[\w-]+$/.test(id))
      ) {
        return NextResponse.json({ error: "Imagens do duelo inválidas." }, { status: 400 });
      }
      const target = await CquoiPlayer.findOne({ userId: body.to }).lean<PlayerLean | null>();
      if (!target || !target.visible || target.lastSeenAt.getTime() < Date.now() - ONLINE_MS) {
        return NextResponse.json({ error: "Esse jogador não está mais online." }, { status: 409 });
      }
      if (target.status === "playing") {
        return NextResponse.json({ error: `${target.name} está no meio de uma partida. Tente de novo em instantes.` }, { status: 409 });
      }
      const already = await CquoiChallenge.exists({ from: me._id, to: body.to, status: "pending", createdAt: { $gt: new Date(Date.now() - PENDING_MS) } });
      if (already) return NextResponse.json({ error: "Você já desafiou esse jogador. Aguarde a resposta." }, { status: 409 });

      const challenge = await CquoiChallenge.create({
        from: me._id,
        to: body.to,
        level,
        themeId: typeof body.themeId === "string" ? body.themeId.slice(0, 40) : "all",
        itemIds: itemIds as string[],
      });
      return NextResponse.json({ ok: true, challengeId: String(challenge._id) });
    }

    // ---------- responder (ou retomar) um desafio recebido ----------
    case "respond": {
      if (typeof body.id !== "string" || !mongoose.isValidObjectId(body.id)) return NextResponse.json({ error: "Desafio inválido." }, { status: 400 });
      const challenge = await CquoiChallenge.findOne({ _id: body.id, to: me._id }).lean<ChallengeLean | null>();
      if (!challenge) return NextResponse.json({ error: "Desafio não encontrado." }, { status: 404 });

      if (body.accept === false) {
        if (challenge.status === "pending") await CquoiChallenge.updateOne({ _id: challenge._id, status: "pending" }, { $set: { status: "declined" } });
        return NextResponse.json({ ok: true });
      }
      const expired = challenge.status === "pending" && Date.now() - challenge.createdAt.getTime() > PENDING_MS;
      if (expired || challenge.status === "declined" || challenge.status === "finished" || challenge.toScore !== undefined) {
        return NextResponse.json({ error: "Esse desafio não está mais disponível." }, { status: 409 });
      }
      if (challenge.status === "pending") await CquoiChallenge.updateOne({ _id: challenge._id, status: "pending" }, { $set: { status: "accepted" } });
      return NextResponse.json({
        ok: true,
        challenge: { id: String(challenge._id), level: challenge.level, themeId: challenge.themeId, itemIds: challenge.itemIds },
      });
    }

    default:
      return NextResponse.json({ error: "Ação desconhecida." }, { status: 400 });
  }
}

/** Guarda a pontuação de um dos lados e, quando os dois terminam, fecha o duelo e atualiza vitórias/derrotas. */
async function recordDuelScore(challengeId: string, meId: mongoose.Types.ObjectId, score: number) {
  const challenge = await CquoiChallenge.findById(challengeId).lean<ChallengeLean | null>();
  if (!challenge || challenge.status === "declined") return null;
  const isFrom = String(challenge.from) === String(meId);
  const isTo = String(challenge.to) === String(meId);
  if (!isFrom && !isTo) return null;
  if (isTo && challenge.status !== "accepted") return null;

  const scoreField = isFrom ? "fromScore" : "toScore";
  const guard = isFrom ? { fromScore: { $exists: false } } : { toScore: { $exists: false } };
  await CquoiChallenge.updateOne({ _id: challenge._id, ...guard }, { $set: { [scoreField]: score } });

  const fresh = await CquoiChallenge.findById(challenge._id).lean<ChallengeLean | null>();
  if (!fresh) return null;
  const mine = isFrom ? fresh.fromScore : fresh.toScore;
  const theirs = isFrom ? fresh.toScore : fresh.fromScore;

  if (fresh.fromScore !== undefined && fresh.toScore !== undefined && fresh.status !== "finished") {
    const winner = fresh.fromScore === fresh.toScore ? null : fresh.fromScore > fresh.toScore ? fresh.from : fresh.to;
    // só quem conseguir virar o status fecha o duelo (evita contar vitória em dobro)
    const closed = await CquoiChallenge.findOneAndUpdate({ _id: fresh._id, status: { $ne: "finished" } }, { $set: { status: "finished", winner } });
    if (closed && winner) {
      const loser = String(winner) === String(fresh.from) ? fresh.to : fresh.from;
      await CquoiPlayer.updateOne({ userId: winner }, { $inc: { duelWins: 1 } });
      await CquoiPlayer.updateOne({ userId: loser }, { $inc: { duelLosses: 1 } });
    }
    const result = winner === null ? "draw" : String(winner) === String(meId) ? "win" : "loss";
    return { id: String(fresh._id), status: "finished", myScore: mine ?? score, theirScore: theirs ?? null, result } as const;
  }
  const result = fresh.status === "finished" ? (fresh.winner ? (String(fresh.winner) === String(meId) ? "win" : "loss") : "draw") : null;
  return { id: String(fresh._id), status: fresh.status, myScore: mine ?? score, theirScore: theirs ?? null, result } as const;
}
