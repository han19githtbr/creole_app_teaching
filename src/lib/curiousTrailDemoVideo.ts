/**
 * Motor de geração de vídeos demonstrativos da "Trilha do Aluno Curioso"
 * para Instagram (Stories, Reels e Feed) e Facebook.
 *
 * Renderiza quadro a quadro (função pura do tempo `t`) na resolução nativa (1080x1920,
 * 1080x1350 ou 1080x1080) com a sequência de jogo completa: o aluno caminha até cada objeto,
 * observa a cena com a seta, escolhe entre alternativas, acerta e avança pela trilha.
 * Usa a MESMA arte da mata, a mesma câmera, o mesmo clima, os mesmos bichos (motor de fauna do jogo)
 * e a mesma avalanche do jogo, então o vídeo reflete a dinâmica real. No nível 7 o aluno entra
 * feliz na casinha do cume.
 */
import {
  DEMO_FORMATS,
  type DemoFormat,
} from "@/lib/gameDemoVideo";
import type { SocialPlatform } from "@/lib/socialLinks";
import type { TrailObjectImages } from "@/lib/curiousTrailObjectImages";
import {
  TRAIL_LEVELS,
  TRAIL_THEMES,
  type TrailLevelConfig,
  type TrailThemeOption,
} from "@/lib/curiousTrailData";
import { buildWordOptions, type CestQuoiItem } from "@/lib/cquoiContent";
import {
  CURIOUS_TRAIL_PATH,
  CURIOUS_TRAIL_LENGTH,
  CAMP_FRACS,
  MARKER_FRACS,
  WORLD_W,
  WORLD_H,
  HUT_DOOR,
  HUT_POSITION,
  getTrailPositionAtFraction,
} from "@/lib/curiousTrailGeometry";
import {
  makeAvalancheTrack,
  initAvalanche,
  stepAvalanche,
  studentFractionAt,
  applyAnswerToAvalanche,
  clampAvalancheGap,
  avalancheDanger,
  avalancheAlert,
  avalancheDistanceMeters,
  type AvalancheLevel,
} from "@/lib/trailAvalanche";

export type TrailDemoDifficulty = "easy" | "intermediate" | "master" | "native" | "avalanche";

const TRAIL_DEMO_DIFFICULTY: Record<TrailDemoDifficulty, { seconds: number; multiplier: number }> = {
  easy: { seconds: 20, multiplier: 1 },
  intermediate: { seconds: 15, multiplier: 1.5 },
  master: { seconds: 10, multiplier: 2 },
  native: { seconds: 6, multiplier: 2.5 },
  avalanche: { seconds: 12, multiplier: 3 },
};

export interface TrailDemoSettings {
  title: string;
  themeId: string;
  levels: number[]; // níveis da montanha incluídos na sequência do vídeo
  difficulty: TrailDemoDifficulty;
  format: DemoFormat;
  showIntro: boolean;
  showOutro: boolean;
  sound: boolean;
  cta: string;
  platform: SocialPlatform;
  handle: string;
}

export const DEFAULT_TRAIL_DEMO_SETTINGS: TrailDemoSettings = {
  title: "Trilha do Aluno Curioso 🇫🇷\nSuba a montanha e aprenda francês!",
  themeId: "gastronomia",
  levels: [4], // Nível 4 demonstra a transição com chuva e guarda-chuva!
  difficulty: "intermediate",
  format: "story",
  showIntro: true,
  showOutro: true,
  sound: true,
  cta: "Jogue a trilha grátis na plataforma",
  platform: "instagram",
  handle: "frances_com_tres_nativos",
};

export interface TrailDemoRound {
  item: CestQuoiItem;
  options: string[];
  correctIndex: number;
  levelCfg: TrailLevelConfig;
  start: number;
  correctAt: number;
  walkEnd: number;
  end: number;
  scoreBefore: number;
  scoreAfter: number;
  xpAfter: number;
  roundIndex: number;
  roundCount: number;
  segmentStart: number;
  segmentEnd: number;
}

export interface TrailDemoAvalanche {
  level: number;
  start: number;
  end: number;
  dt: number;
  active: boolean[];
  front: number[];
  danger: number[];
  meters: number[];
  alert: AvalancheLevel[];
  /** O vídeo é uma demonstração: o tempo da avalanche corre mais rápido que no jogo (mesma física). */
  timeScale: number;
}

export interface TrailDemoPlan {
  settings: TrailDemoSettings;
  theme: TrailThemeOption;
  rounds: TrailDemoRound[];
  levelCfg: TrailLevelConfig;
  introDur: number;
  countdownDur: number;
  /** duração da cena final em que o aluno entra feliz na casinha (nível 7) */
  houseDur: number;
  /** linha do tempo da avalanche (modo avalanche), amostrada a 30 quadros/s */
  avalanche: TrailDemoAvalanche[];
  levels: TrailLevelConfig[];
  outroStart: number;
  outroDur: number;
  total: number;
  finalScore: number;
  finalXp: number;
}

export function buildTrailDemoPlan(
  items: CestQuoiItem[],
  settings: TrailDemoSettings
): TrailDemoPlan {
  const theme = TRAIL_THEMES.find((t) => t.id === settings.themeId) || TRAIL_THEMES[0];
  const selectedLevels = [...new Set(settings.levels)].filter((level) => TRAIL_LEVELS.some((cfg) => cfg.level === level)).sort((a, b) => a - b);
  if (!selectedLevels.length) selectedLevels.push(4);
  const levels = selectedLevels.map((level) => TRAIL_LEVELS.find((cfg) => cfg.level === level)!).filter(Boolean);
  const levelCfg = levels[0] || TRAIL_LEVELS[3];

  const introDur = settings.showIntro ? 2.8 : 0;
  const countdownDur = 2.4;
  const themePool = items.filter((item) => item.themeId === settings.themeId);
  const pool = themePool.length ? themePool : items;

  const walkDur = 1.7;
  const difficulty = TRAIL_DEMO_DIFFICULTY[settings.difficulty];
  const isAvalanche = settings.difficulty === "avalanche";
  const startAt = introDur + countdownDur;
  let cursor = startAt;
  let score = 0;
  let xp = 0;
  const roundsByLevel: TrailDemoRound[][] = [];
  const usedItemIds = new Set<string>();
  let think = 6.4;
  for (let order = 0; order < levels.length; order++) {
    const cfg = levels[order];
    if (order > 0) cursor += 1.8; // breve transição de estação após concluir o nível anterior
    const segmentStart = CAMP_FRACS[order === 0 ? cfg.level - 1 : levels[order - 1].level];
    const segmentEnd = CAMP_FRACS[cfg.level];
    const levelStartTime = cursor;
    const levelScoreBefore = score;
    const levelXpBefore = xp;
    const fresh = shuffle(pool.filter((item) => !usedItemIds.has(item.id)));
    const picked = [...fresh.slice(0, cfg.elementCount)];
    while (picked.length < cfg.elementCount && pool.length) picked.push(...shuffle(pool).slice(0, cfg.elementCount - picked.length));
    picked.forEach((item) => usedItemIds.add(item.id));

    const buildLevelRounds = (answerDur: number) => picked.map((item, roundIndex) => {
      const start = cursor;
      const correctAt = start + answerDur;
      const walkEnd = correctAt + walkDur;
      const end = walkEnd;
      const isHard = settings.difficulty === "master" || settings.difficulty === "native" || isAvalanche;
      const opts = buildWordOptions(item, items, isHard);
      const scoreBefore = score;
      const speedRatio = (difficulty.seconds - answerDur) / difficulty.seconds;
      const speedMultiplier = speedRatio >= 0.65 ? 1.5 : speedRatio >= 0.35 ? 1.25 : 1.1;
      score += Math.round(100 * difficulty.multiplier * speedMultiplier);
      xp += Math.round((cfg.xpBase / cfg.elementCount) * difficulty.multiplier * speedMultiplier);
      cursor = end;
      return { item, options: opts, correctIndex: opts.indexOf(item.fr), levelCfg: cfg, start, correctAt, walkEnd, end, scoreBefore, scoreAfter: score, xpAfter: xp, roundIndex, roundCount: picked.length, segmentStart, segmentEnd };
    });
    let levelRounds = buildLevelRounds(isAvalanche ? think : 2.6);
    if (isAvalanche) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const sim = simulateAvalancheTimeline(levelRounds, cfg, cfg.level, levelRounds[0]?.start ?? cursor);
        if (sim.minGapElements >= 0.6) break;
        think = Math.max(3, think - 0.6);
        cursor = levelStartTime;
        score = levelScoreBefore;
        xp = levelXpBefore;
        levelRounds = buildLevelRounds(think);
      }
    }
    roundsByLevel.push(levelRounds);
  }
  const rounds = roundsByLevel.flat();
  const avalanche = isAvalanche ? roundsByLevel.map((levelRounds) => {
    const cfg = levelRounds[0]?.levelCfg;
    return cfg ? simulateAvalancheTimeline(levelRounds, cfg, cfg.level, levelRounds[0].start).timeline : null;
  }).filter((timeline): timeline is TrailDemoAvalanche => Boolean(timeline)) : [];
  score = rounds.at(-1)?.scoreAfter ?? 0;
  xp = rounds.at(-1)?.xpAfter ?? 0;
  const finalCursor = rounds.at(-1)?.end ?? startAt;
  const houseDur = levels.at(-1)?.level === 7 ? 3.0 : 0;
  const outroStart = finalCursor + houseDur;
  const outroDur = settings.showOutro ? 3.2 : 0;
  const total = outroStart + outroDur;

  return {
    settings,
    theme,
    rounds,
    levelCfg,
    levels,
    introDur,
    countdownDur,
    houseDur,
    avalanche,
    outroStart,
    outroDur,
    total,
    finalScore: score,
    finalXp: xp,
  };
}


/* ------------------------------------------------------------------ avalanche, aluno e câmera (compartilhados) */

const AV_DT = 1 / 30;
const AVALANCHE_DEMO_TIME_SCALE = 3;

/**
 * Simula a avalanche com a MESMA física do jogo (trailAvalanche.ts) ao longo das rodadas do vídeo:
 * corre enquanto o aluno "pensa", desacelera na comemoração e recua a cada acerto.
 */
function simulateAvalancheTimeline(
  rounds: TrailDemoRound[],
  levelCfg: TrailLevelConfig,
  level: number,
  startAt: number
): { timeline: TrailDemoAvalanche; minGapElements: number } {
  const track = makeAvalancheTrack(rounds[0]?.segmentStart ?? CAMP_FRACS[level - 1], rounds[0]?.segmentEnd ?? CAMP_FRACS[level], levelCfg.elementCount, level);
  const st = initAvalanche(track);
  const endT = rounds.at(-1)?.end ?? startAt;
  const total = endT + 6;
  const timeline: TrailDemoAvalanche = { level, start: startAt, end: endT, dt: AV_DT, active: [], front: [], danger: [], meters: [], alert: [], timeScale: AVALANCHE_DEMO_TIME_SCALE };
  const recoiled = new Set<number>();
  let minGap = Infinity;
  for (let i = 0; i * AV_DT <= total; i++) {
    const tt = i * AV_DT;
    const ri = rounds.findIndex((r) => tt >= r.start && tt < r.end);
    const index = ri >= 0 ? ri : tt >= endT ? rounds.length : 0;
    if (tt >= startAt && tt < endT && ri >= 0) {
      const r = rounds[ri];
      if (tt >= r.correctAt && !recoiled.has(ri)) {
        recoiled.add(ri);
        applyAnswerToAvalanche(st, track, "first");
        clampAvalancheGap(st, track, studentFractionAt(track, ri, false));
      }
      const sf = studentFractionAt(track, ri, false);
      stepAvalanche(st, AV_DT * AVALANCHE_DEMO_TIME_SCALE, track, sf, tt >= r.correctAt);
      minGap = Math.min(minGap, (sf - st.front) / track.spacing);
    }
    const sfNow = studentFractionAt(track, Math.min(index, rounds.length - 1), tt >= endT);
    timeline.active.push(tt >= startAt && tt < endT);
    timeline.front.push(st.front);
    timeline.danger.push(avalancheDanger(st, track, sfNow));
    timeline.meters.push(avalancheDistanceMeters(st, sfNow));
    timeline.alert.push(avalancheAlert(st, track, sfNow));
  }
  return { timeline, minGapElements: st.caught ? 0 : minGap };
}

export function trailAvalancheAt(plan: TrailDemoPlan, t: number) {
  const av = plan.avalanche.find((segment) => t >= segment.start && t < segment.end);
  if (!av) return null;
  const f = Math.max(0, t) / av.dt;
  const i = Math.min(av.front.length - 2, Math.floor(f));
  const k = Math.min(1, f - i);
  if (i < 0) return null;
  const lerp = (arr: number[]) => arr[i] + (arr[i + 1] - arr[i]) * k;
  return { active: av.active[i], front: lerp(av.front), danger: lerp(av.danger), meters: Math.round(lerp(av.meters)), alert: av.alert[i] };
}

/** Fração da trilha em que o aluno está (visual) no instante `t`. */
export function trailStudentFraction(plan: TrailDemoPlan, t: number): number {
  const ri = plan.rounds.findIndex((entry) => t >= entry.start && t < entry.end);
  if (ri >= 0) {
    const r = plan.rounds[ri];
    const elementFraction = (index: number) => r.segmentStart + ((r.segmentEnd - r.segmentStart) * (index + 1)) / (r.roundCount + 1);
    const from = r.roundIndex === 0 ? r.segmentStart : elementFraction(r.roundIndex - 1);
    const to = r.roundIndex === r.roundCount - 1 ? r.segmentEnd : elementFraction(r.roundIndex);
    const walking = t >= r.correctAt;
    const p = walking ? easeOut((t - r.correctAt) / (r.walkEnd - r.correctAt)) : 0;
    return from + (to - from) * p;
  }
  const previous = [...plan.rounds].reverse().find((entry) => t >= entry.end);
  return previous ? previous.segmentEnd : plan.rounds[0]?.segmentStart ?? CAMP_FRACS[0];
}

export function trailLevelForTime(plan: TrailDemoPlan, t: number): TrailLevelConfig {
  const active = plan.rounds.find((entry) => t >= entry.start && t < entry.end);
  if (active) return active.levelCfg;
  const previous = [...plan.rounds].reverse().find((entry) => t >= entry.end);
  return previous?.levelCfg ?? plan.rounds.find((entry) => t < entry.start)?.levelCfg ?? plan.levelCfg;
}

/** O mapa ocupa a área superior do vídeo e mantém as respostas logo abaixo dele. */
export function trailMapHeight(videoHeight: number): number {
  return Math.round(videoHeight * 0.72);
}

export interface TrailCamera {
  s: number;
  tx: number;
  ty: number;
}

const VIDEO_ZOOM = 1.55;

function cameraTarget(plan: TrailDemoPlan, t: number) {
  const f = trailStudentFraction(plan, t);
  const p = getTrailPositionAtFraction(f);
  const ri = plan.rounds.findIndex((entry) => t >= entry.start && t < entry.end);
  if (ri >= 0) {
    const round = plan.rounds[ri];
    const qFraction = round.segmentStart + ((round.segmentEnd - round.segmentStart) * (round.roundIndex + 1)) / (round.roundCount + 1);
    const q = getTrailPositionAtFraction(qFraction);
    return { x: p.x + (q.x - p.x) * 0.75, y: p.y + (q.y - p.y) * 0.75 };
  }
  return p;
}

/** Câmera do vídeo: a mesma lógica do jogo (mundo cobrindo a largura, zoom, segue o aluno e o próximo objeto). */
export function computeTrailCamera(plan: TrailDemoPlan, t: number, w: number, h: number): TrailCamera {
  const s = Math.max(w / WORLD_W, h / WORLD_H) * VIDEO_ZOOM;
  let fx = 0;
  let fy = 0;
  const SAMPLES = 5;
  for (let i = 0; i < SAMPLES; i++) {
    const c = cameraTarget(plan, Math.max(0, t - i * 0.12));
    fx += c.x / SAMPLES;
    fy += c.y / SAMPLES;
  }
  const tx = clamp(w * 0.5 - fx * s, w - WORLD_W * s, 0);
  const ty = clamp(h * 0.44 - fy * s, h - WORLD_H * s, 0);
  return { s, tx, ty };
}

const FONT = '"Inter", "Segoe UI", -apple-system, sans-serif';
const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];
let cachedTrailPath: Path2D | null = null;

function getTrailPath() {
  cachedTrailPath ??= new Path2D(CURIOUS_TRAIL_PATH);
  return cachedTrailPath;
}

function shuffle<T>(values: T[]): T[] {
  const shuffled = [...values];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

function fitCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let fitted = text;
  while (fitted.length > 1 && ctx.measureText(fitted).width > maxWidth) {
    fitted = `${fitted.slice(0, -2)}…`;
  }
  return fitted;
}

/**
 * Renderiza um quadro do vídeo no canvas dado o tempo `t` em segundos.
 */
export function renderTrailDemoFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  plan: TrailDemoPlan,
  assets: {
    images: TrailObjectImages;
    scene?: CanvasImageSource | null;
    /** água + folhagem + bichos (mundo do vídeo) */
    world?: { drawWorld: (ctx: CanvasRenderingContext2D, t: number) => void } | null;
    /** avalanche (imagem rasterizada do quadro) */
    dyn?: CanvasImageSource | null;
  }
) {
  const spec = DEMO_FORMATS[plan.settings.format];
  const { theme, introDur, countdownDur, outroStart } = plan;
  const activeRoundIndex = plan.rounds.findIndex((entry) => t >= entry.start && t < entry.end);
  const round = activeRoundIndex >= 0 ? plan.rounds[activeRoundIndex] : undefined;
  const previousRound = [...plan.rounds].reverse().find((entry) => t >= entry.end);
  const nextRound = plan.rounds.find((entry) => t < entry.start);
  const levelCfg = trailLevelForTime(plan, t);
  const elementFraction = (index: number) => round
    ? round.segmentStart + ((round.segmentEnd - round.segmentStart) * (index + 1)) / (round.roundCount + 1)
    : 0;

  // 1. O MUNDO: a mesma arte da mata do jogo, com a mesma câmera, clima, trilha e marcadores
  const isRain = levelCfg.weather === "rain";
  const isSnow = levelCfg.weather === "snow";
  const mapH = trailMapHeight(h);
  const dockTop = mapH + Math.max(12, h * 0.012);
  const dockHeight = h - dockTop - Math.max(12, h * 0.012);
  const cam = computeTrailCamera(plan, t, w, mapH);
  const toScreen = (p: { x: number; y: number }) => ({ x: p.x * cam.s + cam.tx, y: p.y * cam.s + cam.ty });
  const kPx = w / 1080; // tamanhos de interface pensados para 1080 px de largura

  ctx.save();
  ctx.fillStyle = "#052e16";
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, mapH);
  ctx.clip();
  ctx.save();
  ctx.translate(cam.tx, cam.ty);
  ctx.scale(cam.s, cam.s);

  if (assets.scene) {
    ctx.drawImage(assets.scene, 0, 0, WORLD_W, WORLD_H);
  } else {
    const fallback = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    fallback.addColorStop(0, "#38bdf8");
    fallback.addColorStop(0.12, "#65a30d");
    fallback.addColorStop(1, "#14532d");
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }

  // trilha coberta de neve / molhada (por cima da arte já com o clima aplicado)
  if (isRain || isSnow) {
    const trail = getTrailPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (isSnow) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 46;
      ctx.stroke(trail);
      ctx.strokeStyle = "rgba(234, 242, 255, 0.7)";
      ctx.lineWidth = 30;
      ctx.setLineDash([60, 70]);
      ctx.stroke(trail);
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = "rgba(127, 167, 196, 0.45)";
      ctx.lineWidth = 26;
      ctx.setLineDash([22, 120]);
      ctx.stroke(trail);
      ctx.setLineDash([]);
    }
  }


  // água, folhagem e bichos da mata (o mesmo motor e desenho do jogo)
  assets.world?.drawWorld(ctx, t);

  // casinha do cume: rótulo e brilho da porta (acende quando o aluno chega)
  const lastEnd = plan.rounds.at(-1)?.end ?? Infinity;
  const houseT = clamp((t - lastEnd) / 0.8);
  const finalLevel = plan.levels.at(-1)?.level ?? levelCfg.level;
  const glow = finalLevel === 7 ? houseT : 0;
  if (glow > 0) {
    const g = ctx.createRadialGradient(HUT_DOOR.x, HUT_DOOR.y, 2, HUT_DOOR.x, HUT_DOOR.y, 60);
    g.addColorStop(0, `rgba(255, 226, 140, ${0.95 * glow})`);
    g.addColorStop(0.4, `rgba(255, 200, 90, ${0.5 * glow})`);
    g.addColorStop(1, "rgba(255, 200, 90, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(HUT_DOOR.x, HUT_DOOR.y, 60, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.translate(HUT_POSITION.x, HUT_POSITION.y - 24);
  ctx.scale(kPx / cam.s, kPx / cam.s);
  ctx.font = `bold 15px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const hutLabel = "🏠 Casinha do Cume";
  const hutW = ctx.measureText(hutLabel).width + 22;
  ctx.fillStyle = "rgba(20, 25, 61, 0.92)";
  ctx.strokeStyle = "rgba(252, 211, 77, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-hutW / 2, -24, hutW, 24, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fcd34d";
  ctx.fillText(hutLabel, 0, -12);
  ctx.restore();

  // as 7 estações (N1 a N7), no mesmo estilo dos marcadores do jogo
  TRAIL_LEVELS.forEach((cfg, idx) => {
    const lvl = idx + 1;
    const pt = getTrailPositionAtFraction(MARKER_FRACS[idx]);
    const selectedIndex = plan.levels.findIndex((selected) => selected.level === lvl);
    const currentOrder = plan.levels.findIndex((selected) => selected.level === levelCfg.level);
    const isDone = selectedIndex >= 0 && selectedIndex < currentOrder;
    const isCur = lvl === levelCfg.level;
    const isUnl = lvl <= finalLevel;
    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.scale(kPx / cam.s, kPx / cam.s);
    if (isCur) {
      ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
      ctx.beginPath();
      ctx.arc(0, 0, 25 + Math.sin(t * 6) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = isCur ? "#f59e0b" : isDone ? "#059669" : isUnl ? "#fbbf24" : "#64748b";
    ctx.strokeStyle = isCur ? "#fde68a" : "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isUnl && !isCur && !isDone ? "#0f172a" : "#ffffff";
    ctx.font = `900 17px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isDone ? "✓" : !isUnl ? "🔒" : String(lvl), 0, 1);
    const label = `${cfg.name} · ${cfg.altitude.toLocaleString("pt-BR")}m`;
    ctx.font = `800 14px ${FONT}`;
    const lw = ctx.measureText(label).width + 22;
    ctx.fillStyle = isCur ? "#ea580c" : isDone ? "rgba(4, 120, 87, 0.95)" : "rgba(20, 25, 61, 0.92)";
    ctx.beginPath();
    ctx.roundRect(24, -12, lw, 24, 12);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(label, 35, 1);
    ctx.restore();
  });
  ctx.restore();

  // 2. BICHOS DA MATA + AVALANCHE (camada dinâmica gerada pelo mesmo motor do jogo)
  if (assets.dyn) ctx.drawImage(assets.dyn, 0, 0, w, mapH);

  // 3. CLIMA ANIMADO (chuva / neve caindo na tela)
  if (isRain) {
    ctx.save();
    ctx.strokeStyle = "rgba(186, 230, 253, 0.6)";
    ctx.lineWidth = 2.2;
    const rainOffset = (t * 900) % 140;
    for (let rx = -50; rx < w + 50; rx += 40) {
      for (let ry = -40; ry < mapH; ry += 65) {
        const y = (ry + rainOffset) % mapH;
        const x = rx + y * 0.35;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 12, y + 26);
        ctx.stroke();
      }
    }
    ctx.restore();
  } else if (isSnow) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    const snowOffset = (t * 110) % 120;
    for (let sx = 0; sx < w; sx += 50) {
      for (let sy = 0; sy < mapH; sy += 65) {
        const y = (sy + snowOffset) % mapH;
        const x = sx + Math.sin(t * 2.5 + sy * 0.1) * 20;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 4. AVISO DA AVALANCHE: bordas geladas pulsando conforme o perigo
  const avNow = trailAvalancheAt(plan, t);
  if (avNow && avNow.active) {
    const a = Math.min(0.85, avNow.danger * avNow.danger * 0.9);
    if (a > 0.02) {
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(255, 255, 255, 0)");
      vg.addColorStop(1, `rgba(190, 215, 255, ${a * 0.75})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, mapH);
    }
  }

  // 7. PERSONAGEM ALUNO EXPLORADOR CAMINHANDO PELA TRILHA REAL
  const isWalking = Boolean(round && t >= round.correctAt && t < round.walkEnd);
  const studentFraction = trailStudentFraction(plan, t);
  const studentPosition = getTrailPositionAtFraction(studentFraction);
  const nextPosition = getTrailPositionAtFraction(Math.min(1, studentFraction + 0.002));
  const studentScreen = toScreen(studentPosition);
  const studentX = studentScreen.x;
  const studentY = studentScreen.y - 18 * kPx;
  const isFacingLeft = nextPosition.x < studentPosition.x;
  // nível 7: depois da última pergunta o aluno entra feliz na casinha (encolhe e some na porta)
  const houseP = finalLevel === 7 ? clamp((t - (plan.rounds.at(-1)?.end ?? Infinity) - 0.6) / 1.8) : 0;
  const hopHappy = finalLevel === 7 && t >= (plan.rounds.at(-1)?.end ?? Infinity) && houseP < 1 ? Math.abs(Math.sin(t * 9)) * 10 : 0;

  ctx.save();
  ctx.translate(studentX, studentY - hopHappy * kPx);
  ctx.scale(1.25 * kPx * (1 - houseP * 0.55), 1.25 * kPx * (1 - houseP * 0.55));
  ctx.globalAlpha = 1 - clamp((houseP - 0.55) / 0.45);
  if (isFacingLeft) ctx.scale(-1, 1);

  // Bobbing rítmico do passo de montanha
  const stepBob = isWalking ? Math.sin(t * 12) * 4 : 0;
  ctx.translate(0, stepBob);

  // Sombra realista no solo da trilha
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(0, 38, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mochila técnica de expedição 40L (Costas)
  ctx.fillStyle = "#ea580c";
  ctx.beginPath();
  ctx.roundRect(-24, 0, 14, 28, 5);
  ctx.fill();
  // Saco de dormir verde enrolado no topo da mochila
  ctx.fillStyle = "#059669";
  ctx.beginPath();
  ctx.roundRect(-24, -6, 14, 6, 3);
  ctx.fill();
  // Garrafa d'água na lateral
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(-26, 8, 4, 10);

  // Pernas com botas de montanha e passada articulada
  const legSwing = isWalking ? Math.sin(t * 12) * 12 : 0;
  // Perna esquerda
  ctx.strokeStyle = isSnow ? "#0f172a" : "#1e293b";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-6, 24);
  ctx.lineTo(-6 - legSwing * 0.5, 36);
  ctx.stroke();
  // Bota esquerda
  ctx.fillStyle = "#54280b";
  ctx.fillRect(-10 - legSwing * 0.5, 34, 11, 5);

  // Perna direita
  ctx.beginPath();
  ctx.moveTo(6, 24);
  ctx.lineTo(6 + legSwing * 0.5, 36);
  ctx.stroke();
  // Bota direita
  ctx.fillStyle = "#54280b";
  ctx.fillRect(2 + legSwing * 0.5, 34, 11, 5);

  // Anorak térmico de montanha (Azul no sol/chuva, azul-petróleo na neve)
  ctx.fillStyle = isSnow ? "#0284c7" : "#2563eb";
  ctx.beginPath();
  ctx.roundRect(-14, 0, 28, 26, 8);
  ctx.fill();

  // Zíper e faixa refletiva
  ctx.strokeStyle = "#fcd34d";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 24);
  ctx.stroke();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, 4);
  ctx.lineTo(-3, 4);
  ctx.moveTo(3, 4);
  ctx.lineTo(10, 4);
  ctx.stroke();

  // Bastão de trilha de fibra de carbono (Balança na caminhada)
  if (!levelCfg.hasUmbrella) {
    const poleSwing = isWalking ? Math.sin(t * 12 + Math.PI) * 14 : 0;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(-15 + poleSwing, 38);
    ctx.stroke();
    // Anel de neve no bastão
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(-15 + poleSwing, 34, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cabeça e rosto
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(0, -14, 13, 0, Math.PI * 2);
  ctx.fill();

  // Bochechas rosadas
  ctx.fillStyle = isSnow ? "#ef4444" : "#f87171";
  ctx.beginPath();
  ctx.arc(-5, -11, isSnow ? 3.5 : 2.2, 0, Math.PI * 2);
  ctx.arc(5, -11, isSnow ? 3.5 : 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Olhos expressivos e sorriso
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(-4, -15, 1.8, 0, Math.PI * 2);
  ctx.arc(4, -15, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, -11, 4, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Gorro térmico de lã ou boina alpina clássica
  if (isSnow) {
    // Gorro vermelho com dobra branca canelada e pompom
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-14, -26, 28, 6, 3);
    ctx.fill();
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(0, -25, 12, Math.PI, Math.PI * 2);
    ctx.fill();
    // Pompom felpudo
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, -38, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // Cachecol de lã com ponta ondulando ao vento
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.roundRect(-12, -4, 24, 7, 3.5);
    ctx.fill();

    // Vapor da respiração no ar gélido
    const vaporPuff = (t * 2.5) % 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.arc(6 + vaporPuff * 8, -12 - vaporPuff * 6, 2.5 + vaporPuff * 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Boina alpina clássica azul-marinho
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.ellipse(0, -23, 16, 6, 0, 0, Math.PI * 2);
    ctx.arc(0, -23, 11, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  // GUARDA-CHUVA ABERTO NA CHUVA (Níveis 4 e 5)
  if (levelCfg.hasUmbrella) {
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 6);
    ctx.lineTo(8, -32);
    ctx.stroke();
    // Cúpula do guarda-chuva listrado com pontas
    const umbGrad = ctx.createLinearGradient(-26, -34, 42, -34);
    umbGrad.addColorStop(0, "#f59e0b");
    umbGrad.addColorStop(0.5, "#ef4444");
    umbGrad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = umbGrad;
    ctx.beginPath();
    ctx.arc(8, -32, 34, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();

  // HUD do mapa, imagem do objeto no caminho e alternativas fixas na base.
  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.84)";
  ctx.beginPath();
  ctx.roundRect(22, 24, Math.min(w * 0.62, 610), 76, 20);
  ctx.fill();
  ctx.fillStyle = "#fbbf24";
  ctx.font = `bold ${Math.max(14, w * 0.018)}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillText(
    `${levelCfg.badgeEmoji} Nível ${levelCfg.level} · ${levelCfg.name}`,
    42,
    54
  );
  ctx.fillStyle = "#cbd5e1";
  ctx.font = `600 ${Math.max(11, w * 0.012)}px ${FONT}`;
  ctx.fillText(
    `Altitude: ${levelCfg.altitude} m · ${
      levelCfg.weather === "sunny" ? "Ensolarado" : levelCfg.weather === "rain" ? "Chuva · Guarda-chuva" : "Neve e frio"
    }`,
    42,
    80
  );

  const score = round ? (t >= round.correctAt ? round.scoreAfter : round.scoreBefore) : previousRound?.scoreAfter ?? 0;
  const difficulty = TRAIL_DEMO_DIFFICULTY[plan.settings.difficulty];
  const secondsLeft = round
    ? Math.ceil(Math.max(0, difficulty.seconds - (Math.min(t, round.correctAt) - round.start)))
    : 0;
  const hudW = Math.min(w * 0.3, 300);
  const hudX = w - hudW - 22;
  ctx.fillStyle = "rgba(15, 23, 42, 0.84)";
  ctx.beginPath();
  ctx.roundRect(hudX, 24, hudW, 76, 20);
  ctx.fill();
  ctx.textAlign = "right";
  ctx.fillStyle = "#fcd34d";
  ctx.font = `bold ${Math.max(13, w * 0.016)}px ${FONT}`;
  ctx.fillText(`✨ ${score} pts`, hudX + hudW - 72, 53);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = `600 ${Math.max(10, w * 0.011)}px ${FONT}`;
  const streak = round
    ? t >= round.correctAt
      ? round.roundIndex + 1
      : round.roundIndex
    : (previousRound?.roundIndex ?? -1) + 1;
  const roundNumber = round ?? previousRound;
  ctx.fillText(`🔥 ${streak} · ${roundNumber ? roundNumber.roundIndex + 1 : 0}/${roundNumber?.roundCount ?? 0}`, hudX + hudW - 72, 79);
  if (avNow) {
    // modo avalanche: no lugar do cronômetro aparece o medidor de perigo (distância da avalanche)
    ctx.fillStyle = avNow.alert === "danger" ? "#dc2626" : avNow.alert === "warn" ? "#f59e0b" : "#0284c7";
    ctx.beginPath();
    ctx.roundRect(hudX + hudW - 66, 36, 54, 52, 16);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = `bold ${Math.max(16, w * 0.018)}px ${FONT}`;
    ctx.fillText("🏔️", hudX + hudW - 39, 58);
    ctx.font = `bold ${Math.max(11, w * 0.012)}px ${FONT}`;
    ctx.fillText(`${avNow.meters}m`, hudX + hudW - 39, 79);
  } else {
    ctx.fillStyle = secondsLeft <= 3 ? "#dc2626" : "#2563eb";
    ctx.beginPath();
    ctx.arc(hudX + hudW - 32, 62, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(11, w * 0.012)}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(round ? `${secondsLeft}s` : "✓", hudX + hudW - 32, 67);
  }

  if (!round && previousRound && nextRound && previousRound.levelCfg.level !== nextRound.levelCfg.level) {
    const message = `${previousRound.levelCfg.name} concluído!`;
    ctx.fillStyle = "rgba(15, 23, 42, 0.86)";
    ctx.beginPath();
    ctx.roundRect(w * 0.12, mapH * 0.4, w * 0.76, 92 * kPx, 20 * kPx);
    ctx.fill();
    ctx.fillStyle = "#fcd34d";
    ctx.textAlign = "center";
    ctx.font = `900 ${Math.max(16, w * 0.022)}px ${FONT}`;
    ctx.fillText(message, w / 2, mapH * 0.4 + 38 * kPx);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(12, w * 0.016)}px ${FONT}`;
    ctx.fillText(`Subindo para o Nível ${nextRound.levelCfg.level} · ${nextRound.levelCfg.name}`, w / 2, mapH * 0.4 + 68 * kPx);
  }

  if (round && t >= round.start && t < round.walkEnd) {
    const target = toScreen(getTrailPositionAtFraction(elementFraction(round.roundIndex)));
    const targetX = target.x;
    const targetY = target.y;
    const maxImageW = Math.min(w * 0.46, 500);
    const imageH = Math.min(maxImageW * (round.item.h / round.item.w), mapH * 0.24);
    const imageW = imageH * (round.item.w / round.item.h);
    const revealed = t >= round.correctAt;
    const answerLabelH = revealed ? 34 : 0;
    const imageX = clamp(targetX - imageW / 2, 20, w - imageW - 20);
    const imageY = clamp(targetY - imageH - 30, spec.safeTop + 25, mapH - imageH - answerLabelH - 45);
    const image = assets.images.get(round.item.id);

    const frame = ctx.createLinearGradient(imageX, imageY, imageX + imageW, imageY + imageH);
    frame.addColorStop(0, "#fbbf24");
    frame.addColorStop(0.52, "#f97316");
    frame.addColorStop(1, "#f43f5e");
    ctx.fillStyle = frame;
    ctx.beginPath();
    ctx.roundRect(imageX - 5, imageY - 5, imageW + 10, imageH + 10, 18);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(imageX, imageY, imageW, imageH, 14);
    ctx.fill();

    if (image) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imageX, imageY, imageW, imageH, 14);
      ctx.clip();
      const sourceW = image.naturalWidth || round.item.w;
      const sourceH = image.naturalHeight || round.item.h;
      const imageScale = Math.min(imageW / sourceW, imageH / sourceH);
      const drawW = sourceW * imageScale;
      const drawH = sourceH * imageScale;
      const drawX = imageX + (imageW - drawW) / 2;
      const drawY = imageY + (imageH - drawH) / 2;
      ctx.drawImage(image, drawX, drawY, drawW, drawH);
      ctx.restore();
    }
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(imageX + imageW + 2, imageY - 7, 21, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#fcd34d";
    ctx.font = `900 ${Math.max(13, w * 0.016)}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(round.roundIndex + 1), imageX + imageW + 2, imageY - 7);
    ctx.textBaseline = "alphabetic";
    if (revealed) {
      const labelW = Math.min(imageW - 16, 200);
      ctx.fillStyle = "rgba(5, 150, 105, 0.95)";
      ctx.beginPath();
      ctx.roundRect(imageX + (imageW - labelW) / 2, imageY + imageH + 8, labelW, answerLabelH, 17);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(12, w * 0.014)}px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fitCanvasText(ctx, round.item.fr, labelW - 16), imageX + imageW / 2, imageY + imageH + answerLabelH / 2 + 8);
      ctx.textBaseline = "alphabetic";
    }

    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(18, dockTop, w - 36, dockHeight, 24);
    ctx.fill();
    ctx.stroke();

    const progress = clamp((Math.min(t, round.correctAt) - round.start) / (round.correctAt - round.start));
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.beginPath();
    ctx.roundRect(20, dockTop, w - 40, 8, 4);
    ctx.fill();
    // sem cronômetro no modo avalanche: a barra mostra o quanto a avalanche está perto
    const barFill = avNow ? Math.max(0.04, avNow.danger) : 1 - progress;
    ctx.fillStyle = avNow ? (avNow.danger > 0.7 ? "#ef4444" : avNow.danger > 0.4 ? "#fbbf24" : "#38bdf8") : secondsLeft <= 3 ? "#ef4444" : "#38bdf8";
    ctx.beginPath();
    ctx.roundRect(20, dockTop, (w - 40) * barFill, 8, 4);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `bold ${Math.max(13, w * 0.016)}px ${FONT}`;
    ctx.fillText(avNow && avNow.alert === "danger" ? "🏔️ A avalanche está perto! Que objeto é esse?" : "Que objeto a seta vermelha aponta?", 38, dockTop + 44);
    const options = round.options.slice(0, 4);
    const gap = 12;
    const left = 32;
    const top = dockTop + 64;
    const optionW = (w - left * 2 - gap) / 2;
    const optionH = Math.max(48, Math.min(86, (dockHeight - 108) / 2 - gap / 2));
    options.forEach((option, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = left + col * (optionW + gap);
      const y = top + row * (optionH + gap);
      const answered = t >= round.correctAt;
      const correct = index === round.correctIndex;
      ctx.fillStyle = answered && correct ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.11)";
      ctx.strokeStyle = answered && correct ? "#34d399" : "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, optionW, optionH, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = OPTION_COLORS[index];
      ctx.beginPath();
      ctx.roundRect(x + 10, y + (optionH - 34) / 2, 34, 34, 9);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 20px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(OPTION_LETTERS[index], x + 27, y + optionH / 2);
      ctx.textAlign = "left";
      ctx.font = `bold ${Math.max(12, Math.min(22, w * 0.021))}px ${FONT}`;
      ctx.fillText(
        fitCanvasText(ctx, option, optionW - 62),
        x + 54,
        y + optionH / 2
      );
      if (answered && correct) {
        ctx.textAlign = "right";
        ctx.fillStyle = "#6ee7b7";
        ctx.font = `bold ${Math.max(12, w * 0.014)}px ${FONT}`;
        ctx.fillText("✓", x + optionW - 12, y + optionH / 2);
      }
    });
    if (t >= round.correctAt) {
      ctx.textAlign = "right";
      ctx.fillStyle = "#6ee7b7";
      ctx.font = `bold ${Math.max(12, w * 0.015)}px ${FONT}`;
      ctx.fillText(`Correto! +${round.scoreAfter - round.scoreBefore} pts`, w - 38, dockTop + 44);
    }
  }
  ctx.restore();

  // 7. ABERTURA (INTRO)
  if (plan.settings.showIntro && t < introDur) {
    const introProgress = t / introDur;
    const alpha = introProgress > 0.8 ? (1 - introProgress) / 0.2 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = "center";
    ctx.fillStyle = "#f59e0b";
    ctx.font = `900 32px ${FONT}`;
    ctx.fillText("🏔️ TRILHA DO ALUNO CURIOSO", w / 2, h * 0.4);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 42px ${FONT}`;
    ctx.fillText(plan.settings.title.split("\n")[0] || "Escale a Montanha", w / 2, h * 0.48);

    ctx.fillStyle = "#93c5fd";
    ctx.font = `bold 26px ${FONT}`;
    ctx.fillText(`Tema: ${theme.emoji} ${theme.label}`, w / 2, h * 0.55);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = `500 20px ${FONT}`;
    ctx.fillText(
      `${plan.levels.length} ${plan.levels.length === 1 ? "nível" : "níveis"} · ${plan.rounds.length} perguntas · Caminhe, acerte e avance`,
      w / 2,
      h * 0.61
    );
    ctx.restore();
  }

  // Contagem regressiva de início, igual à preparação antes da primeira rodada do jogo.
  if (t >= introDur && t < introDur + countdownDur) {
    const countdownProgress = (t - introDur) / countdownDur;
    const count = Math.max(1, Math.ceil((1 - countdownProgress) * 3));
    const pulse = 1 + (1 - ((t - introDur) % 0.8) / 0.8) * 0.12;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.38)";
    ctx.fillRect(0, 0, w, h);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.round(100 * pulse)}px ${FONT}`;
    ctx.shadowColor = "#0f172a";
    ctx.shadowBlur = 20;
    ctx.fillText(String(count), w / 2, h * 0.5);
    ctx.shadowBlur = 0;
    ctx.font = `bold 28px ${FONT}`;
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("PREPARE-SE PARA SUBIR!", w / 2, h * 0.56);
    ctx.restore();
  }

  // 8. ENCERRAMENTO (OUTRO) COM REDE SOCIAL
  if (plan.settings.showOutro && t >= outroStart) {
    const outroT = t - outroStart;
    const alpha = Math.min(1, outroT / 0.4);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = "center";
    ctx.fillStyle = "#f59e0b";
    ctx.font = `900 64px sans-serif`;
    const summitWon = finalLevel === 7;
    const levelSummary = plan.levels.length === 1 ? `Nível ${finalLevel} concluído!` : `${plan.levels.length} níveis concluídos!`;
    ctx.fillText(summitWon ? "🏔️ 🇫🇷 🏆" : "🌲 🇫🇷 ⭐", w / 2, h * 0.38);

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.min(38, w * 0.035)}px ${FONT}`;
    ctx.fillText(
      summitWon ? "Cume da Vitória conquistado!" : levelSummary,
      w / 2,
      h * 0.46
    );

    ctx.fillStyle = "#10b981";
    ctx.font = `bold 28px ${FONT}`;
    ctx.fillText(`${plan.finalXp} XP · ${plan.finalScore} pts`, w / 2, h * 0.52);

    ctx.fillStyle = "#fcd34d";
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(
      summitWon ? "Bandeira hasteada no topo!" : `Níveis: ${plan.levels.map((level) => level.level).join(" · ")}`,
      w / 2,
      h * 0.56
    );

    ctx.fillStyle = "#93c5fd";
    ctx.font = `bold ${Math.min(22, w * 0.02)}px ${FONT}`;
    ctx.fillText(fitCanvasText(ctx, plan.settings.cta, w - 80), w / 2, h * 0.62);

    // Cartão da Rede Social
    const socW = Math.min(440, w - 64);
    const socH = 70;
    const socX = (w - socW) / 2;
    const socY = h * 0.66;
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(socX, socY, socW, socH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(`@${plan.settings.handle}`, w / 2, socY + 44);
    ctx.restore();
  }
}
