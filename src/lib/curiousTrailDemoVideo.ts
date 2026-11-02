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
  type TrailLevelConfig,
  type TrailThemeOption,
} from "@/lib/curiousTrailData";
import { buildWordOptions, type CestQuoiItem } from "@/lib/cquoiContent";

export interface TrailDemoSettings {
  title: string;
  themeId: string;
  level: number; // 1 a 7
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
  level: 4, // Nível 4 demonstra a transição com chuva e guarda-chuva!
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
  walkEnd: number;
  correctAt: number;
  end: number;
  scoreBefore: number;
  scoreAfter: number;
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

  const walkDur = 1.1;
  const answerDur = 2.6;
  const revealDur = 1.5;
  let cursor = introDur + countdownDur;
  let score = 0;
  const rounds: TrailDemoRound[] = picked.map((item) => {
    const start = cursor;
    const walkEnd = start + walkDur;
    const correctAt = walkEnd + answerDur;
    const end = correctAt + revealDur;
    const opts = buildWordOptions(item, items, false);
    const scoreBefore = score;
    score += 100;
    cursor = end;
    return {
      item,
      options: opts,
      correctIndex: opts.indexOf(item.fr),
      levelCfg,
      start,
      walkEnd,
      correctAt,
      end,
      scoreBefore,
      scoreAfter: score,
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
  };
}

const FONT = '"Inter", "Segoe UI", -apple-system, sans-serif';
const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];

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

  // 1. FUNDO CÉU E ATMOSFERA ALPINA CONFORME O CLIMA
  const isRain = levelCfg.weather === "rain";
  const isSnow = levelCfg.weather === "snow";

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

  // 2. MACIÇO ALPINO REALISTA (Picos Nevados Distantes, Paredões de Granito e Encosta)
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

  // 3. A TRILHA REALISTA EM CURVA SINUOSA COM CAMADAS E DETALHES ALPINOS
  // Definição dos waypoints da trilha no formato proporcional ao jogo real
  const trailPoints = [
    { x: w * 0.12, y: h * 0.86 }, // N1 Base
    { x: w * 0.26, y: h * 0.74 }, // N2 Bosque
    { x: w * 0.44, y: h * 0.62 }, // N3 Mirante
    { x: w * 0.33, y: h * 0.48 }, // N4 Encosta (curva fechada / switchback)
    { x: w * 0.56, y: h * 0.38 }, // N5 Cascata
    { x: w * 0.74, y: h * 0.26 }, // N6 Planalto
    { x: w * 0.88, y: h * 0.13 }, // N7 Cume
  ];

  // Função para desenhar a curva contínua da trilha
  const traceTrailCurve = () => {
    ctx.beginPath();
    ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
    ctx.quadraticCurveTo(w * 0.19, h * 0.80, trailPoints[1].x, trailPoints[1].y);
    ctx.quadraticCurveTo(w * 0.35, h * 0.68, trailPoints[2].x, trailPoints[2].y);
    ctx.quadraticCurveTo(w * 0.40, h * 0.55, trailPoints[3].x, trailPoints[3].y);
    ctx.quadraticCurveTo(w * 0.44, h * 0.42, trailPoints[4].x, trailPoints[4].y);
    ctx.quadraticCurveTo(w * 0.65, h * 0.32, trailPoints[5].x, trailPoints[5].y);
    ctx.quadraticCurveTo(w * 0.81, h * 0.19, trailPoints[6].x, trailPoints[6].y);
  };

  // 1ª camada: Sombra de escavação da trilha na encosta
  ctx.save();
  ctx.translate(0, 5);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
  ctx.lineWidth = 26;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  traceTrailCurve();
  ctx.stroke();
  ctx.restore();

  // 2ª camada: Base de terra compactada e cascalho largo
  ctx.strokeStyle = isSnow ? "#cbd5e1" : isRain ? "#3e1f06" : "#a16207";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  traceTrailCurve();
  ctx.stroke();

  // 3ª camada: Leito central de terra batida pelas passadas dos caminhantes
  ctx.strokeStyle = isSnow ? "#94a3b8" : isRain ? "#291103" : "#78350f";
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  traceTrailCurve();
  ctx.stroke();

  // 4ª camada: Textura de pedrinhas e pontilhados na trilha
  ctx.save();
  ctx.setLineDash([6, 10]);
  ctx.strokeStyle = isSnow ? "#ffffff" : isRain ? "#54280b" : "#fef08a";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  traceTrailCurve();
  ctx.stroke();
  ctx.restore();

  // Marcos de pedra (Cairns / Totens) com marcação alpina nas curvas
  const cairnLocs = [
    { x: w * 0.21, y: h * 0.79 },
    { x: w * 0.39, y: h * 0.65 },
    { x: w * 0.64, y: h * 0.34 },
  ];
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

  // 4. AS 7 ESTAÇÕES / WAYPOINTS DA TRILHA (N1 a N7 com altitudes)
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
    ctx.fillText(isDone ? "✓" : `N${lvl}`, pt.x, pt.y - 7);

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

  // 5. BANDEIRA NO CUME DA VITÓRIA (Nível 7)
  const summitPt = trailPoints[6];
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
        const x = rx + (y * 0.35); // Ângulo realista do vento alpino
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
  const animalX = w * 0.28;
  const animalY = h * 0.72;
  const breath = Math.sin(t * 3.5) * 2.5;

  ctx.save();
  ctx.translate(animalX, animalY);

  // Sombra natural do animal no solo
  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 16, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Desenho fidedigno de cada animal da montanha
  const animalId = levelCfg.animal.id;
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
  ctx.fillText(`${levelCfg.animal.emoji} ${levelCfg.animal.name}`, 0, 35);
  ctx.restore();

  // 7. PERSONAGEM ALUNO EXPLORADOR CAMINHANDO PELA TRILHA REAL
  const walkingRound = round;
  const isWalking = Boolean(walkingRound && t < walkingRound.walkEnd);
  const walkFrac = walkingRound
    ? isWalking
      ? clamp((t - walkingRound.start) / (walkingRound.walkEnd - walkingRound.start))
      : 1
    : t >= (plan.rounds.at(-1)?.end ?? introDur)
      ? 1
      : 0;

  // Determina o índice de segmento entre os marcos da trilha
  const curLevelIdx = Math.max(0, Math.min(6, plan.settings.level - 1));
  const startWaypoint = trailPoints[curLevelIdx];
  const nextWaypoint = trailPoints[Math.min(6, curLevelIdx + 1)];

  // Posição suave do aluno ao longo do trecho do nível
  const studentX = startWaypoint.x + (nextWaypoint.x - startWaypoint.x) * walkFrac;
  const studentY = startWaypoint.y + (nextWaypoint.y - startWaypoint.y) * walkFrac - 18;

  // Sentido do movimento (se vira para a esquerda na curva fechada do Nível 4)
  const isFacingLeft = nextWaypoint.x < startWaypoint.x;

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

  // 6. CARD DO ELEMENTO A RECONHECER
  if (round && t >= round.walkEnd && t < outroStart) {
    const cardT = t - round.walkEnd;
    const cardScale = easeOut(cardT / 0.4);

    const cardW = Math.min(w - 60, 920);
    const cardH = 610;
    const cardX = (w - cardW) / 2;
    const cardY = spec.safeTop + 60;

    ctx.save();
    ctx.translate(w / 2, cardY + cardH / 2);
    ctx.scale(cardScale, cardScale);
    ctx.translate(-w / 2, -(cardY + cardH / 2));

    // Fundo do Card Vidro Fosco Escuro
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 28);
    ctx.fill();
    ctx.stroke();

    // Cabeçalho do Card
    ctx.fillStyle = "#f59e0b";
    ctx.font = `bold 28px ${FONT}`;
    ctx.fillText(`NÍVEL ${levelCfg.level} · ${levelCfg.name.toUpperCase()}`, cardX + 24, cardY + 40);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `bold 24px ${FONT}`;
    ctx.fillText("O que a seta vermelha aponta?", cardX + 24, cardY + 70);
    ctx.textAlign = "right";
    ctx.fillStyle = "#cbd5e1";
    ctx.font = `bold 18px ${FONT}`;
    ctx.fillText(`${round.scoreBefore} PTS`, cardX + cardW - 82, cardY + 70);
    ctx.textAlign = "left";

    // Imagem da Cena
    const imgObj = assets.images.get(round.item.scene);
    const imgW = cardW - 48;
    const imgH = 230;
    const imgX = cardX + 24;
    const imgY = cardY + 86;

    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, 18);
    ctx.fill();

    if (imgObj) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 18);
      ctx.clip();
      const sourceW = imgObj.naturalWidth || round.item.w;
      const sourceH = imgObj.naturalHeight || round.item.h;
      const imageScale = Math.min(imgW / sourceW, imgH / sourceH);
      const drawW = sourceW * imageScale;
      const drawH = sourceH * imageScale;
      const drawX = imgX + (imgW - drawW) / 2;
      const drawY = imgY + (imgH - drawH) / 2;
      ctx.drawImage(imgObj, drawX, drawY, drawW, drawH);

      // Seta Vermelha apontando para o objeto
      const arrowX = drawX + (round.item.arrow.x / sourceW) * drawW;
      const arrowY = drawY + (round.item.arrow.y / sourceH) * drawH;
      ctx.strokeStyle = "rgba(15, 23, 42, 0.9)";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(arrowX - 62, arrowY - 56);
      ctx.lineTo(arrowX - 8, arrowY - 8);
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 29, arrowY - 7);
      ctx.lineTo(arrowX - 7, arrowY - 29);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Cronômetro Circular
    const timerX = cardX + cardW - 55;
    const timerY = cardY + 40;
    const answerProgress = clamp((round.correctAt - t) / (round.correctAt - round.walkEnd));
    const secondsLeft = Math.ceil(answerProgress * 3);
    const isAnswered = t >= round.correctAt;
    ctx.fillStyle = isAnswered ? "#059669" : secondsLeft === 1 ? "#dc2626" : "#2563eb";
    ctx.beginPath();
    ctx.arc(timerX, timerY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 18px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(isAnswered ? "✓" : `${secondsLeft}s`, timerX, timerY + 5);

    // As 4 Alternativas (A, B, C, D)
    const optStartY = imgY + imgH + 16;
    const optH = 56;
    const optGap = 12;

    round.options.slice(0, 4).forEach((opt, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const ow = (imgW - optGap) / 2;
      const ox = imgX + col * (ow + optGap);
      const oy = optStartY + row * (optH + optGap);

      const isCorrect = idx === round.correctIndex;

      ctx.fillStyle = isAnswered && isCorrect ? "#059669" : "rgba(30, 41, 59, 0.9)";
      ctx.strokeStyle = isAnswered && isCorrect ? "#34d399" : "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(ox, oy, ow, optH, 14);
      ctx.fill();
      ctx.stroke();

      // Letra A-D
      ctx.fillStyle = OPTION_COLORS[idx];
      ctx.beginPath();
      ctx.roundRect(ox + 8, oy + 8, 34, 34, 8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 22px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText(OPTION_LETTERS[idx], ox + 25, oy + 30);

      // Texto da opção
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 23px ${FONT}`;
      ctx.textAlign = "left";
      ctx.fillText(opt, ox + 50, oy + 31);
    });

    // Indicador explícito de avanço: a resposta certa faz o aluno subir para o próximo objeto.
    ctx.textAlign = "left";
    ctx.fillStyle = "#cbd5e1";
    ctx.font = `bold 20px ${FONT}`;
    ctx.fillText(`OBJETO ${activeRoundIndex + 1} DE ${plan.rounds.length}`, imgX, cardY + cardH - 23);
    ctx.textAlign = "right";
    ctx.fillStyle = isAnswered ? "#34d399" : "#fbbf24";
    ctx.fillText(isAnswered ? "ACERTOU! AVANÇANDO ↑" : "ESCOLHA A RESPOSTA", imgX + imgW, cardY + cardH - 23);

    if (isAnswered) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#34d399";
      ctx.font = `bold 22px ${FONT}`;
      ctx.fillText(`${round.item.fr}  ·  ${round.scoreAfter} PTS`, w / 2, cardY + cardH - 55);
    }

    ctx.restore();
  }

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
    ctx.fillText("🏔️ 🇫🇷 🏆", w / 2, h * 0.38);

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 38px ${FONT}`;
    ctx.fillText("Cume da Vitória Conquistado!", w / 2, h * 0.46);

    ctx.fillStyle = "#10b981";
    ctx.font = `bold 28px ${FONT}`;
    ctx.fillText("+240 XP · Bandeira Hasteada!", w / 2, h * 0.52);

    ctx.fillStyle = "#93c5fd";
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(plan.settings.cta, w / 2, h * 0.6);

    // Cartão da Rede Social
    const socW = 440;
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
