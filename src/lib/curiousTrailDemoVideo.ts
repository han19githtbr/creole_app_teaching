/**
 * Motor de geração de vídeos demonstrativos da "Trilha do Aluno Curioso"
 * para Instagram (Stories, Reels e Feed) e Facebook.
 *
 * Renderiza quadro a quadro (função pura do tempo `t`) na resolução nativa (1080x1920,
 * 1080x1350 ou 1080x1080) com a sequência de jogo completa: o aluno caminha até cada objeto,
 * observa a cena com a seta, escolhe entre alternativas, acerta e avança pela trilha.
 * Também mostra o clima do nível e, no nível 7, a bandeira no cume.
 */
import {
  DEMO_FORMATS,
  type DemoFormat,
  type DemoImages,
} from "@/lib/gameDemoVideo";
import type { SocialPlatform } from "@/lib/socialLinks";
import {
  TRAIL_LEVELS,
  TRAIL_THEMES,
  ROAMING_ANIMAL_POOL,
  type TrailLevelConfig,
  type TrailThemeOption,
} from "@/lib/curiousTrailData";
import { buildWordOptions, type CestQuoiItem } from "@/lib/cquoiContent";
import { CURIOUS_TRAIL_LENGTH, CURIOUS_TRAIL_PATH, getTrailPositionAtFraction } from "@/lib/curiousTrailGeometry";

export type TrailDemoDifficulty = "easy" | "intermediate" | "master" | "native" | "avalanche";

const TRAIL_DEMO_DIFFICULTY: Record<TrailDemoDifficulty, { seconds: number; multiplier: number }> = {
  easy: { seconds: 20, multiplier: 1 },
  intermediate: { seconds: 15, multiplier: 1.5 },
  master: { seconds: 10, multiplier: 2 },
  native: { seconds: 6, multiplier: 2.5 },
  avalanche: { seconds: 0, multiplier: 3 },
};

export interface TrailDemoSettings {
  title: string;
  themeId: string;
  level: number; // 1 a 7
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
  title: "Trilha do Aluno Curioso �Ÿ‡��Ÿ‡�\nSuba a montanha e aprenda francês!",
  themeId: "gastronomia",
  level: 4, // Nível 4 demonstra a transição com chuva e guarda-chuva!
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
}

export interface TrailDemoPlan {
  settings: TrailDemoSettings;
  theme: TrailThemeOption;
  rounds: TrailDemoRound[];
  levelCfg: TrailLevelConfig;
  introDur: number;
  countdownDur: number;
  flagDur: number;
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
  const levelCfg = TRAIL_LEVELS.find((l) => l.level === settings.level) || TRAIL_LEVELS[3];

  const introDur = settings.showIntro ? 2.8 : 0;
  const countdownDur = 2.4;
  const themePool = items.filter((item) => item.themeId === settings.themeId);
  const pool = themePool.length ? themePool : items;
  const picked = shuffle(pool).slice(0, levelCfg.elementCount);
  if (picked.length < levelCfg.elementCount) {
    const remaining = items.filter((item) => !picked.some((selected) => selected.id === item.id));
    picked.push(...shuffle(remaining).slice(0, levelCfg.elementCount - picked.length));
  }

  const answerDur = settings.difficulty === "avalanche" ? 4.8 : 2.6;
  const walkDur = 1.7;
  const difficulty = TRAIL_DEMO_DIFFICULTY[settings.difficulty];
  let cursor = introDur + countdownDur;
  let score = 0;
  let xp = 0;
  const rounds: TrailDemoRound[] = picked.map((item) => {
    const start = cursor;
    const correctAt = start + answerDur;
    const walkEnd = correctAt + walkDur;
    const end = walkEnd;
    const opts = buildWordOptions(item, items, false);
    const scoreBefore = score;
    const speedRatio = settings.difficulty === "avalanche" ? 0 : (difficulty.seconds - answerDur) / difficulty.seconds;
    const speedMultiplier = speedRatio >= 0.65 ? 1.5 : speedRatio >= 0.35 ? 1.25 : 1.1;
    score += Math.round(100 * difficulty.multiplier * speedMultiplier);
    xp += Math.round((levelCfg.xpBase / levelCfg.elementCount) * difficulty.multiplier * speedMultiplier);
    cursor = end;
    return {
      item,
      options: opts,
      correctIndex: opts.indexOf(item.fr),
      levelCfg,
      start,
      correctAt,
      walkEnd,
      end,
      scoreBefore,
      scoreAfter: score,
      xpAfter: xp,
    };
  });

  const flagDur = settings.level === 7 ? 3.0 : 0;
  const outroStart = cursor + flagDur;
  const outroDur = settings.showOutro ? 3.2 : 0;
  const total = outroStart + outroDur;

  return {
    settings,
    theme,
    rounds,
    levelCfg,
    introDur,
    countdownDur,
    flagDur,
    outroStart,
    outroDur,
    total,
    finalScore: score,
    finalXp: xp,
  };
}

const FONT = '"Inter", "Segoe UI", -apple-system, sans-serif';
const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];
const TRAIL_LEVEL_WEIGHTS = TRAIL_LEVELS.map((level) => level.elementCount + 3);
const TRAIL_WEIGHT_TOTAL = TRAIL_LEVEL_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
const TRAIL_LEVEL_FRACTIONS = [0];
TRAIL_LEVEL_WEIGHTS.forEach((weight) => {
  TRAIL_LEVEL_FRACTIONS.push(TRAIL_LEVEL_FRACTIONS[TRAIL_LEVEL_FRACTIONS.length - 1] + weight / TRAIL_WEIGHT_TOTAL);
});
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
    fitted = `${fitted.slice(0, -2)}�€�`;
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
  assets: { images: DemoImages }
) {
  const spec = DEMO_FORMATS[plan.settings.format];
  const { theme, levelCfg, introDur, countdownDur, outroStart } = plan;
  const activeRoundIndex = plan.rounds.findIndex((entry) => t >= entry.start && t < entry.end);
  const round = activeRoundIndex >= 0 ? plan.rounds[activeRoundIndex] : undefined;
  const levelIndex = plan.settings.level - 1;
  const levelStart = TRAIL_LEVEL_FRACTIONS[levelIndex];
  const levelEnd = TRAIL_LEVEL_FRACTIONS[levelIndex + 1];
  const elementFraction = (index: number) =>
    levelStart + ((levelEnd - levelStart) * (index + 1)) / (levelCfg.elementCount + 1);

  // 1. FUNDO C�‰U E ATMOSFERA ALPINA CONFORME O CLIMA
  const isRain = levelCfg.weather === "rain" && plan.settings.difficulty !== "avalanche";
  const isSnow = levelCfg.weather === "snow" || plan.settings.difficulty === "avalanche";

  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  if (isRain) {
    skyGrad.addColorStop(0, "#0f172a");
    skyGrad.addColorStop(0.4, "#1e293b");
    skyGrad.addColorStop(0.75, "#334155");
    skyGrad.addColorStop(1, "#064e3b");
  } else if (isSnow) {
    skyGrad.addColorStop(0, "#334155");
    skyGrad.addColorStop(0.35, "#64748b");
    skyGrad.addColorStop(0.7, "#cbd5e1");
    skyGrad.addColorStop(1, "#f1f5f9");
  } else {
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(0.3, "#38bdf8");
    skyGrad.addColorStop(0.65, "#bae6fd");
    skyGrad.addColorStop(1, "#fef3c7");
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);
  const trailBackdrop = assets.images.get("/trilha.jfif");
  if (trailBackdrop?.complete && trailBackdrop.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(trailBackdrop, 0, 0, w, h);
    ctx.restore();
  }

  if (!trailBackdrop?.complete || trailBackdrop.naturalWidth === 0) {
  // Sol radiante com corona alpina ou camadas de nuvens densas
  if (!isRain && !isSnow) {
    ctx.save();
    // Brilho difuso do sol alpino
    const sunGlow = ctx.createRadialGradient(w * 0.18, h * 0.12, 10, w * 0.18, h * 0.12, 130);
    sunGlow.addColorStop(0, "rgba(254, 240, 138, 0.95)");
    sunGlow.addColorStop(0.4, "rgba(251, 191, 36, 0.45)");
    sunGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(w * 0.18, h * 0.12, 130, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo do sol
    ctx.beginPath();
    ctx.arc(w * 0.18, h * 0.12, 34, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.restore();

    // Nuvens cúmulus alpinas flutuando suavemente
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    const cloud1X = ((t * 18 + w * 0.6) % (w + 240)) - 120;
    ctx.beginPath();
    ctx.ellipse(cloud1X, h * 0.14, 90, 26, 0, 0, Math.PI * 2);
    ctx.ellipse(cloud1X + 40, h * 0.13, 60, 32, 0, 0, Math.PI * 2);
    ctx.ellipse(cloud1X - 35, h * 0.15, 55, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. MACI�‡O ALPINO REALISTA (Picos Nevados Distantes, Paredões de Granito e Encosta)
  ctx.save();

  // Maciço de picos distantes (Picos pontiagudos com luz e sombra geológica)
  const farGrad = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.7);
  if (isSnow) {
    farGrad.addColorStop(0, "#e2e8f0");
    farGrad.addColorStop(0.6, "#94a3b8");
    farGrad.addColorStop(1, "#64748b");
  } else if (isRain) {
    farGrad.addColorStop(0, "#334155");
    farGrad.addColorStop(0.6, "#1e293b");
    farGrad.addColorStop(1, "#0f172a");
  } else {
    farGrad.addColorStop(0, "#93c5fd");
    farGrad.addColorStop(0.5, "#60a5fa");
    farGrad.addColorStop(1, "#2563eb");
  }

  ctx.fillStyle = farGrad;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.55);
  ctx.lineTo(w * 0.12, h * 0.38);
  ctx.lineTo(w * 0.28, h * 0.46);
  ctx.lineTo(w * 0.42, h * 0.32);
  ctx.lineTo(w * 0.58, h * 0.44);
  ctx.lineTo(w * 0.72, h * 0.24);
  ctx.lineTo(w * 0.86, h * 0.36);
  ctx.lineTo(w, h * 0.28);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Calotas de gelo e cristas brancas nos picos do fundo
  ctx.fillStyle = isSnow ? "#ffffff" : "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  // Pico 1
  ctx.moveTo(w * 0.42, h * 0.32);
  ctx.lineTo(w * 0.38, h * 0.36);
  ctx.lineTo(w * 0.46, h * 0.36);
  ctx.closePath();
  // Pico 2 (O mais alto no fundo)
  ctx.moveTo(w * 0.72, h * 0.24);
  ctx.lineTo(w * 0.67, h * 0.30);
  ctx.lineTo(w * 0.77, h * 0.30);
  ctx.closePath();
  ctx.fill();

  // Crista rochosa média (Falésias e gargantas com cascatas de água do degelo)
  const midGrad = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.8);
  if (isSnow) {
    midGrad.addColorStop(0, "#94a3b8");
    midGrad.addColorStop(1, "#475569");
  } else if (isRain) {
    midGrad.addColorStop(0, "#1e293b");
    midGrad.addColorStop(1, "#064e3b");
  } else {
    midGrad.addColorStop(0, "#16a34a");
    midGrad.addColorStop(0.5, "#15803d");
    midGrad.addColorStop(1, "#14532d");
  }
  ctx.fillStyle = midGrad;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.65);
  ctx.lineTo(w * 0.2, h * 0.52);
  ctx.lineTo(w * 0.45, h * 0.42);
  ctx.lineTo(w * 0.7, h * 0.32);
  ctx.lineTo(w * 0.9, h * 0.22);
  ctx.lineTo(w, h * 0.24);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Cascata de montanha prateada descendo da geleira
  ctx.strokeStyle = "rgba(224, 242, 254, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.52, h * 0.43);
  ctx.quadraticCurveTo(w * 0.51, h * 0.48, w * 0.53, h * 0.54);
  ctx.stroke();

  // Encosta Principal com Pastagens e Dobras de Relevo
  const slopeGrad = ctx.createLinearGradient(0, h * 0.35, 0, h);
  if (isSnow) {
    slopeGrad.addColorStop(0, "#f8fafc");
    slopeGrad.addColorStop(0.4, "#e2e8f0");
    slopeGrad.addColorStop(0.8, "#cbd5e1");
    slopeGrad.addColorStop(1, "#94a3b8");
  } else if (isRain) {
    slopeGrad.addColorStop(0, "#166534");
    slopeGrad.addColorStop(0.5, "#14532d");
    slopeGrad.addColorStop(1, "#022c22");
  } else {
    slopeGrad.addColorStop(0, "#22c55e");
    slopeGrad.addColorStop(0.45, "#16a34a");
    slopeGrad.addColorStop(0.8, "#15803d");
    slopeGrad.addColorStop(1, "#14532d");
  }
  ctx.fillStyle = slopeGrad;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.92);
  ctx.quadraticCurveTo(w * 0.25, h * 0.82, w * 0.48, h * 0.68);
  ctx.quadraticCurveTo(w * 0.72, h * 0.52, w * 0.88, h * 0.32);
  ctx.lineTo(w, h * 0.34);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Campo de neve eterno no cume da vitória
  ctx.fillStyle = isSnow ? "#ffffff" : "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.moveTo(w * 0.82, h * 0.24);
  ctx.quadraticCurveTo(w * 0.9, h * 0.16, w * 0.98, h * 0.18);
  ctx.lineTo(w, h * 0.34);
  ctx.lineTo(w * 0.82, h * 0.34);
  ctx.closePath();
  ctx.fill();

  // Pinheiros e coníferas alpinas espalhadas pelas encostas
  const treePositions = [
    { x: 0.16, y: 0.82, s: 0.85 },
    { x: 0.22, y: 0.74, s: 0.95 },
    { x: 0.38, y: 0.62, s: 0.8 },
    { x: 0.48, y: 0.54, s: 0.75 },
    { x: 0.62, y: 0.44, s: 0.7 },
    { x: 0.76, y: 0.34, s: 0.65 },
  ];
  treePositions.forEach((tp) => {
    const tx = tp.x * w;
    const ty = tp.y * h;
    const ts = tp.s * (w / 1000);

    // Sombra
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.beginPath();
    ctx.ellipse(tx, ty + 12 * ts, 14 * ts, 5 * ts, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tronco
    ctx.fillStyle = "#451a03";
    ctx.fillRect(tx - 3 * ts, ty + 4 * ts, 6 * ts, 10 * ts);

    // Folhagem em camadas
    ctx.fillStyle = isSnow ? "#334155" : "#14532d";
    ctx.beginPath();
    ctx.moveTo(tx, ty - 24 * ts);
    ctx.lineTo(tx - 16 * ts, ty);
    ctx.lineTo(tx + 16 * ts, ty);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(tx, ty - 14 * ts);
    ctx.lineTo(tx - 20 * ts, ty + 10 * ts);
    ctx.lineTo(tx + 20 * ts, ty + 10 * ts);
    ctx.closePath();
    ctx.fill();

    // Neve nos ramos
    if (isSnow) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(tx, ty - 24 * ts);
      ctx.lineTo(tx - 9 * ts, ty - 12 * ts);
      ctx.lineTo(tx + 9 * ts, ty - 12 * ts);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Rochas de granito alpino ao longo da montanha
  const rockPositions = [
    { x: 0.34, y: 0.68, s: 1.1 },
    { x: 0.52, y: 0.49, s: 0.9 },
    { x: 0.71, y: 0.38, s: 0.8 },
  ];
  rockPositions.forEach((rp) => {
    const rx = rp.x * w;
    const ry = rp.y * h;
    const rs = rp.s * (w / 1000);
    ctx.fillStyle = isSnow ? "#64748b" : "#475569";
    ctx.beginPath();
    ctx.moveTo(rx - 20 * rs, ry + 6 * rs);
    ctx.lineTo(rx - 12 * rs, ry - 10 * rs);
    ctx.lineTo(rx + 4 * rs, ry - 14 * rs);
    ctx.lineTo(rx + 18 * rs, ry - 4 * rs);
    ctx.lineTo(rx + 22 * rs, ry + 6 * rs);
    ctx.closePath();
    ctx.fill();
    // Face iluminada da rocha
    ctx.fillStyle = isSnow ? "#f8fafc" : "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(rx - 12 * rs, ry - 10 * rs);
    ctx.lineTo(rx + 4 * rs, ry - 14 * rs);
    ctx.lineTo(rx + 8 * rs, ry - 4 * rs);
    ctx.lineTo(rx - 4 * rs, ry - 3 * rs);
    ctx.closePath();
    ctx.fill();
  });

  }

  // 3. A TRILHA REALISTA EM CURVA SINUOSA COM CAMADAS E DETALHES ALPINOS
  // Definição dos waypoints da trilha no formato proporcional ao jogo real
  const trailPoints = TRAIL_LEVELS.map((_, index) => {
    const point = getTrailPositionAtFraction(TRAIL_LEVEL_FRACTIONS[index]);
    return { x: (point.x / 1000) * w, y: (point.y / 600) * h };
  });
  const trailPath = getTrailPath();
  const traceTrailCurve = () => {
    ctx.save();
    ctx.scale(w / 1000, h / 600);
    ctx.stroke(trailPath);
    ctx.restore();
  };

  // 1ª camada: Sombra de escavação da trilha na encosta
  ctx.save();
  ctx.translate(0, (5 * h) / 600);
  ctx.strokeStyle = "rgba(45, 28, 12, 0.38)";
  ctx.lineWidth = 23;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  traceTrailCurve();
  ctx.restore();

  // 2ª camada: Base de terra compactada e cascalho largo
  ctx.strokeStyle = isSnow ? "#cbd5e1" : isRain ? "#5b3920" : "#b7793b";
  ctx.lineWidth = 17;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  traceTrailCurve();

  // 3ª camada: Leito central de terra batida pelas passadas dos caminhantes
  ctx.strokeStyle = isSnow ? "#94a3b8" : isRain ? "#3f2614" : "#8b5a2b";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  traceTrailCurve();

  // 4ª camada: Textura de pedrinhas e pontilhados na trilha
  ctx.save();
  ctx.setLineDash([1, 12]);
  ctx.strokeStyle = isSnow ? "#f8fafc" : isRain ? "#a8794e" : "#e7c68b";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  traceTrailCurve();
  ctx.restore();

  // Marcos de pedra (Cairns / Totens) com marcação alpina nas curvas
  const cairnLocs = [0.2, 0.45, 0.72].map((fraction) => {
    const point = getTrailPositionAtFraction(fraction);
    return { x: (point.x / 1000) * w, y: (point.y / 600) * h };
  });
  cairnLocs.forEach((cl) => {
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.ellipse(cl.x, cl.y, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.ellipse(cl.x, cl.y - 4, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Marcação alpina (Branco / Vermelho / Branco)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cl.x - 2, cl.y - 3, 4, 1.5);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(cl.x - 2, cl.y - 1.5, 4, 1.5);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cl.x - 2, cl.y, 4, 1.5);
  });

  // 4. AS 7 ESTA�‡�•ES / WAYPOINTS DA TRILHA (N1 a N7 com altitudes)
  trailPoints.forEach((pt, idx) => {
    const lvl = idx + 1;
    const isDone = lvl < plan.settings.level;
    const isCur = lvl === plan.settings.level;
    const isUnl = lvl <= plan.settings.level;

    // Estaca de madeira do marco
    ctx.fillStyle = "#451a03";
    ctx.fillRect(pt.x - 2, pt.y - 2, 4, 14);

    // Círculo do marco
    ctx.save();
    if (isCur) {
      // Pulso dourado de estação ativa
      const beaconPulse = Math.sin(t * 6) * 4;
      ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y - 8, 18 + beaconPulse, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = isCur ? "#f59e0b" : isDone ? "#10b981" : isUnl ? "#2563eb" : "#64748b";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y - 8, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Texto do nível dentro do marco
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 12px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isDone ? "�œ“" : `N${lvl}`, pt.x, pt.y - 7);

    // Plaquinha de altitude do marco
    ctx.fillStyle = isCur ? "#f59e0b" : "rgba(15, 23, 42, 0.85)";
    ctx.beginPath();
    ctx.roundRect(pt.x - 24, pt.y + 11, 48, 16, 6);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 10px ${FONT}`;
    ctx.fillText(`${TRAIL_LEVELS[idx].altitude}m`, pt.x, pt.y + 19);
    ctx.restore();
  });

  // 5. BANDEIRA NO CUME DA VIT�“RIA (Nível 7)
  const summitPosition = getTrailPositionAtFraction(1);
  const summitPt = { x: (summitPosition.x / 1000) * w, y: (summitPosition.y / 600) * h };
  ctx.save();
  // Pedestal de pedra no cume
  ctx.fillStyle = "#475569";
  ctx.beginPath();
  ctx.roundRect(summitPt.x - 12, summitPt.y - 4, 24, 8, 2);
  ctx.fill();

  // Mastro dourado
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(summitPt.x, summitPt.y - 4);
  ctx.lineTo(summitPt.x, summitPt.y - 58);
  ctx.stroke();

  // Esfera no topo do mastro
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(summitPt.x, summitPt.y - 58, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Se estiver no nível 7 no cume ou concluído, mostra a bandeira tremulando ao vento
  const showSummitFlag = plan.settings.level === 7 && t >= (plan.rounds.at(-1)?.end ?? outroStart);
  if (showSummitFlag) {
    const flagWiggle = Math.sin(t * 8) * 3;
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(summitPt.x + 2, summitPt.y - 56 + flagWiggle * 0.4, 12, 22);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(summitPt.x + 14, summitPt.y - 56 + flagWiggle * 0.7, 12, 22);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(summitPt.x + 26, summitPt.y - 56 + flagWiggle, 12, 22);
  }
  ctx.restore();

  // Efeitos Climáticos Animados (Chuva realista com ângulo de vento ou nevasca espiral)
  if (isRain) {
    ctx.save();
    ctx.strokeStyle = "rgba(186, 230, 253, 0.65)";
    ctx.lineWidth = 2.2;
    const rainOffset = (t * 900) % 140;
    for (let rx = -50; rx < w + 50; rx += 40) {
      for (let ry = -40; ry < h; ry += 65) {
        const y = (ry + rainOffset) % h;
        const x = rx + (y * 0.35); // �‚ngulo realista do vento alpino
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
      for (let sy = 0; sy < h; sy += 65) {
        const y = (sy + snowOffset) % h;
        const x = sx + Math.sin(t * 2.5 + sy * 0.1) * 20;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  ctx.restore();

  // 6. ANIMAL DA MONTANHA ILUSTRADO COM ANATOMIA REALISTA
  // Posicionado na encosta natural de cada nível, com movimento e respiração
  const breath = Math.sin(t * 3.5) * 2.5;
  const snowAnimalIds = ["chamois", "fox", "eagle", "rabbit"];
  const animal = plan.settings.difficulty === "avalanche"
    ? ROAMING_ANIMAL_POOL.find((candidate) => candidate.id === snowAnimalIds[plan.settings.level % snowAnimalIds.length]) ?? levelCfg.animal
    : levelCfg.animal;
  const animalId = animal.id;
  const habitatPosition = animalId === "squirrel" ? { x: 0.16, y: 0.14 }
    : animalId === "bird" || animalId === "eagle" ? { x: 0.87, y: 0.2 }
      : animalId === "bee" || animalId === "butterfly" ? { x: 0.72, y: 0.42 }
        : animalId === "frog" || animalId === "snail" ? { x: 0.58, y: 0.48 }
          : { x: 0.7, y: 0.43 };
  const animalX = w * habitatPosition.x;
  const animalY = h * habitatPosition.y;
  const hops = ["squirrel", "rabbit", "frog"].includes(animalId);
  const animalStep = Math.sin(t * (hops ? 4.2 : 2.1));

  ctx.save();
  ctx.translate(animalX + (animalId === "eagle" ? animalStep * 8 : animalId === "snail" ? Math.sin(t * 0.3) * 3 : 0), animalY + (hops ? Math.max(0, animalStep) * -7 : animalStep * 1.5));
  if (["deer", "fox", "chamois"].includes(animalId)) ctx.rotate(animalStep * 0.035);

  // Sombra natural do animal no solo
  if (!["bird", "eagle", "bee", "butterfly"].includes(animalId)) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.beginPath();
    ctx.ellipse(0, 16, 26, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Desenho fidedigno de cada animal da montanha
  if (animalId === "chamois") {
    // Camurça dos Alpes (Chifres em gancho, máscara facial e corpo atlético)
    ctx.fillStyle = "#78350f";
    // Pernas
    ctx.fillRect(-14, 0, 4, 18);
    ctx.fillRect(8, 0, 4, 18);
    // Corpo
    ctx.beginPath();
    ctx.ellipse(0, -2, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pescoço e Cabeça
    ctx.beginPath();
    ctx.ellipse(14, -14, 7, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Máscara facial clara com listra preta
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath();
    ctx.ellipse(16, -15, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#18181b";
    ctx.fillRect(13, -16, 8, 2);
    // Chifres em gancho característicos da camurça
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(12, -22);
    ctx.lineTo(11, -34);
    ctx.quadraticCurveTo(14, -36, 17, -32);
    ctx.stroke();
  } else if (animalId === "deer") {
    // Cervo Nobre com galhada ramificada
    ctx.fillStyle = "#b45309";
    ctx.fillRect(-16, 0, 4, 20);
    ctx.fillRect(10, 0, 4, 20);
    ctx.beginPath();
    ctx.ellipse(0, -4, 22, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(18, -18, 8, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Galhada
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(16, -26);
    ctx.lineTo(14, -42);
    ctx.moveTo(14, -36);
    ctx.lineTo(8, -42);
    ctx.moveTo(14, -32);
    ctx.lineTo(20, -40);
    ctx.stroke();
  } else if (animalId === "fox") {
    // Raposa Vermelha com cauda espessa de ponta branca
    ctx.fillStyle = "#ea580c";
    ctx.fillRect(-12, 0, 4, 15);
    ctx.fillRect(8, 0, 4, 15);
    ctx.beginPath();
    ctx.ellipse(0, -2, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Peito branco
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(10, 0, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cabeça afilada
    ctx.fillStyle = "#ea580c";
    ctx.beginPath();
    ctx.ellipse(16, -10, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cauda longa com ponta branca
    ctx.beginPath();
    ctx.ellipse(-22, -6, 12, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-30, -10, 4.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (animalId === "rabbit") {
    // Coelho Branco da Neve
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
    ctx.arc(14, -8, 9, 0, Math.PI * 2);
    ctx.fill();
    // Orelhas longas com pontas pretas
    ctx.beginPath();
    ctx.ellipse(12, -22, 3.5, 11, -0.15, 0, Math.PI * 2);
    ctx.ellipse(18, -21, 3.5, 10, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.arc(11.5, -31, 2.5, 0, Math.PI * 2);
    ctx.arc(18.5, -29, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (animalId === "frog") {
    // Sapinho da Chuva com saco vocal
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.ellipse(0, 2, 14, 9, 0, 0, Math.PI * 2);
    ctx.arc(10, -3, 8, 0, Math.PI * 2);
    ctx.fill();
    // Olhos dourados saltados
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(10, -9, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.arc(10, -9, 1.8, 0, Math.PI * 2);
    ctx.fill();
    // Saco vocal inflando com respiração
    ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
    ctx.beginPath();
    ctx.arc(14, 0, 4 + breath * 0.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (animalId === "eagle") {
    // Águia Real planando com envergadura recortada
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.ellipse(0, -6, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Asas abertas
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(-28, -26);
    ctx.lineTo(28, -26);
    ctx.closePath();
    ctx.fill();
    // Bico amarelo adunco
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(14, -6);
    ctx.lineTo(20, -4);
    ctx.lineTo(14, -2);
    ctx.closePath();
    ctx.fill();
  } else if (animalId === "bird") {
    for (let bird = 0; bird < 3; bird++) {
      const offset = bird - 1;
      const wingBeat = Math.sin(t * 10 + bird * 1.8) * 5;
      ctx.save();
      ctx.translate(offset * 24, Math.abs(offset) * 8 + Math.sin(t * 3 + bird) * 3);
      ctx.fillStyle = bird === 1 ? "#334155" : "#475569";
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.quadraticCurveTo(-9, -wingBeat, -16, -7);
      ctx.quadraticCurveTo(-10, 2, -2, 2);
      ctx.moveTo(2, 0);
      ctx.quadraticCurveTo(9, -wingBeat, 16, -7);
      ctx.quadraticCurveTo(10, 2, 2, 2);
      ctx.fill();
      ctx.restore();
    }
  } else if (animalId === "snail") {
    ctx.fillStyle = "#84a36a";
    ctx.beginPath();
    ctx.ellipse(0, 4, 19, 7, 0, Math.PI, Math.PI * 2);
    ctx.lineTo(17, 8);
    ctx.lineTo(-18, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#a16207";
    ctx.beginPath();
    ctx.arc(-2, -5, 12, Math.PI, Math.PI * 2);
    ctx.lineTo(10, 4);
    ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#713f12";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-2, -5, 6, 0, Math.PI * 1.7);
    ctx.stroke();
    ctx.strokeStyle = "#365314";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(15, -7);
    ctx.moveTo(17, 2);
    ctx.lineTo(19, -6);
    ctx.stroke();
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.arc(15, -8, 1.3, 0, Math.PI * 2);
    ctx.arc(19, -7, 1.3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Esquilo dos Bosques com cauda felpuda em curva de S
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.ellipse(0, 2, 14, 9, 0, 0, Math.PI * 2);
    ctx.arc(11, -5, 7, 0, Math.PI * 2);
    ctx.fill();
    // Cauda felpuda em S
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 11;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-8, 4);
    ctx.quadraticCurveTo(-22, -4, -18, -22);
    ctx.stroke();
  }

  // Cartão com Nome do Animal e Frase Alpina
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-55, 22, 110, 26, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fbbf24";
  ctx.font = `bold 12px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${animal.emoji} ${animal.name}`, 0, 35);
  ctx.restore();

  // 7. PERSONAGEM ALUNO EXPLORADOR CAMINHANDO PELA TRILHA REAL
  const walkingRound = round;
  const isWalking = Boolean(walkingRound && t >= walkingRound.correctAt && t < walkingRound.walkEnd);
  let studentFraction = levelStart;
  if (walkingRound) {
    const roundStart = activeRoundIndex === 0 ? levelStart : elementFraction(activeRoundIndex - 1);
    const roundEnd =
      activeRoundIndex === plan.rounds.length - 1 ? levelEnd : elementFraction(activeRoundIndex);
    const walkProgress = isWalking
      ? easeOut((t - walkingRound.correctAt) / (walkingRound.walkEnd - walkingRound.correctAt))
      : t >= walkingRound.walkEnd
        ? 1
        : 0;
    studentFraction = roundStart + (roundEnd - roundStart) * walkProgress;
  } else if (t >= (plan.rounds.at(-1)?.end ?? introDur)) {
    studentFraction = levelEnd;
  }
  const studentPosition = getTrailPositionAtFraction(studentFraction);
  const nextPosition = getTrailPositionAtFraction(Math.min(1, studentFraction + 0.002));
  const studentX = (studentPosition.x / 1000) * w;
  const studentY = (studentPosition.y / 600) * h - 18;
  const isFacingLeft = nextPosition.x < studentPosition.x;

  ctx.save();
  ctx.translate(studentX, studentY);
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

  if (plan.settings.difficulty === "avalanche" && t >= introDur + countdownDur && t < outroStart) {
    const elapsed = t - introDur - countdownDur;
    const hazardFraction = clamp(levelStart - 115 / CURIOUS_TRAIL_LENGTH + elapsed * (4.2 / CURIOUS_TRAIL_LENGTH), 0, Math.max(0, studentFraction - 42 / CURIOUS_TRAIL_LENGTH));
    const snowPath = new Path2D();
    const steps = Math.max(2, Math.ceil(hazardFraction * 180));
    for (let i = 0; i <= steps; i++) {
      const point = getTrailPositionAtFraction((hazardFraction * i) / steps);
      const x = (point.x / 1000) * w;
      const y = (point.y / 600) * h;
      if (i === 0) snowPath.moveTo(x, y);
      else snowPath.lineTo(x, y);
    }
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(96, 165, 250, .72)";
    ctx.lineWidth = Math.max(22, w * 0.022);
    ctx.stroke(snowPath);
    ctx.strokeStyle = "rgba(248, 250, 252, .96)";
    ctx.lineWidth = Math.max(15, w * 0.015);
    ctx.stroke(snowPath);
    const front = getTrailPositionAtFraction(hazardFraction);
    for (let flake = 0; flake < 9; flake++) {
      const phase = t * 4 + flake * 2.4;
      ctx.fillStyle = `rgba(255,255,255,${0.45 + (Math.sin(phase) + 1) * 0.2})`;
      ctx.beginPath();
      ctx.arc((front.x / 1000) * w + Math.sin(phase) * 18, (front.y / 600) * h + Math.cos(phase * 1.3) * 12, 3 + (flake % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

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
      plan.settings.difficulty === "avalanche" ? "Avalanche · Neve e frio" : levelCfg.weather === "sunny" ? "Ensolarado" : levelCfg.weather === "rain" ? "Chuva · Guarda-chuva" : "Neve e frio"
    }`,
    42,
    80
  );

  const score = round ? (t >= round.correctAt ? round.scoreAfter : round.scoreBefore) : plan.finalScore;
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
  ctx.fillText(`�œ� ${score} pts`, hudX + hudW - 72, 53);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = `600 ${Math.max(10, w * 0.011)}px ${FONT}`;
  const streak = round
    ? t >= round.correctAt
      ? activeRoundIndex + 1
      : activeRoundIndex
    : plan.rounds.length;
  ctx.fillText(`�Ÿ”� ${streak} · ${round ? activeRoundIndex + 1 : plan.rounds.length}/${plan.rounds.length}`, hudX + hudW - 72, 79);
  ctx.fillStyle = plan.settings.difficulty === "avalanche" ? "#0369a1" : secondsLeft <= 3 ? "#dc2626" : "#2563eb";
  ctx.beginPath();
  ctx.arc(hudX + hudW - 32, 62, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.max(11, w * 0.012)}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(plan.settings.difficulty === "avalanche" ? "�„" : round ? `${secondsLeft}s` : "�œ“", hudX + hudW - 32, 67);

  if (round && t >= round.start && t < round.walkEnd) {
    const target = getTrailPositionAtFraction(elementFraction(activeRoundIndex));
    const targetX = (target.x / 1000) * w;
    const targetY = (target.y / 600) * h;
    const imageW = Math.min(w * 0.38, 430);
    const imageH = Math.min(imageW * (round.item.h / round.item.w), h * 0.24);
    const dockTop = h * 0.73;
    const imageX = clamp(targetX - imageW / 2, 20, w - imageW - 20);
    const imageY = clamp(targetY - imageH - 30, spec.safeTop + 25, dockTop - imageH - 20);
    const image = assets.images.get(round.item.scene);

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.roundRect(imageX - 5, imageY - 5, imageW + 10, imageH + 10, 18);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
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
      const arrowX = drawX + (round.item.arrow.x / sourceW) * drawW;
      const arrowY = drawY + (round.item.arrow.y / sourceH) * drawH;
      ctx.strokeStyle = "rgba(15, 23, 42, 0.9)";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(arrowX - 38, arrowY - 32);
      ctx.lineTo(arrowX - 5, arrowY - 5);
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 18, arrowY - 4);
      ctx.lineTo(arrowX - 4, arrowY - 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    if (t >= round.correctAt) {
      const labelW = Math.min(imageW - 16, 200);
      ctx.fillStyle = "rgba(5, 150, 105, 0.95)";
      ctx.beginPath();
      ctx.roundRect(imageX + 8, imageY + imageH - 42, labelW, 34, 17);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(12, w * 0.014)}px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fitCanvasText(ctx, round.item.fr, labelW - 16), imageX + 8 + labelW / 2, imageY + imageH - 25);
      ctx.textBaseline = "alphabetic";
    }

    const dockHeight = h - dockTop;
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(18, dockTop, w - 36, dockHeight - 18, 24);
    ctx.fill();
    ctx.stroke();

    const progress = clamp((Math.min(t, round.correctAt) - round.start) / (round.correctAt - round.start));
    if (plan.settings.difficulty !== "avalanche") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.beginPath();
    ctx.roundRect(20, dockTop, w - 40, 8, 4);
    ctx.fill();
    ctx.fillStyle = secondsLeft <= 3 ? "#ef4444" : "#38bdf8";
    ctx.beginPath();
    ctx.roundRect(20, dockTop, (w - 40) * (1 - progress), 8, 4);
    ctx.fill();
    }

    ctx.textAlign = "left";
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `bold ${Math.max(13, w * 0.016)}px ${FONT}`;
    ctx.fillText(plan.settings.difficulty === "avalanche" ? "A neve avança! Que objeto a seta aponta?" : "Que objeto a seta vermelha aponta?", 38, dockTop + 44);
    const options = round.options.slice(0, 4);
    const gap = 12;
    const left = 32;
    const top = dockTop + 64;
    const optionW = (w - left * 2 - gap) / 2;
    const optionH = Math.max(50, Math.min(86, (dockHeight - 108) / 2 - gap / 2));
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
        ctx.fillText("�œ“", x + optionW - 12, y + optionH / 2);
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
    ctx.fillText("�Ÿ�”️ TRILHA DO ALUNO CURIOSO", w / 2, h * 0.4);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 42px ${FONT}`;
    ctx.fillText(plan.settings.title.split("\n")[0] || "Escale a Montanha", w / 2, h * 0.48);

    ctx.fillStyle = "#93c5fd";
    ctx.font = `bold 26px ${FONT}`;
    ctx.fillText(`Tema: ${theme.emoji} ${theme.label}`, w / 2, h * 0.55);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = `500 20px ${FONT}`;
    ctx.fillText(
      `${levelCfg.elementCount} ${levelCfg.elementCount === 1 ? "objeto" : "objetos"} · Caminhe, acerte e avance`,
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
    const summitWon = plan.settings.level === 7;
    ctx.fillText(summitWon ? "�Ÿ�”️ �Ÿ‡��Ÿ‡� �Ÿ�†" : "�ŸŒ� �Ÿ‡��Ÿ‡� ⭐", w / 2, h * 0.38);

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.min(38, w * 0.035)}px ${FONT}`;
    ctx.fillText(
      summitWon ? "Cume da Vitória conquistado!" : `Nível ${levelCfg.level} concluído!`,
      w / 2,
      h * 0.46
    );

    ctx.fillStyle = "#10b981";
    ctx.font = `bold 28px ${FONT}`;
    ctx.fillText(`${plan.finalXp} XP · ${plan.finalScore} pts`, w / 2, h * 0.52);

    ctx.fillStyle = "#fcd34d";
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(
      summitWon ? "Bandeira hasteada no topo!" : `Próximo: Nível ${levelCfg.level + 1}`,
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
