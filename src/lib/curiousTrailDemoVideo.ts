/**
 * Motor de geração de vídeos demonstrativos da "Trilha do Aluno Curioso"
 * para Instagram (Stories, Reels e Feed) e Facebook.
 *
 * Renderiza quadro a quadro (função pura do tempo `t`) na resolução nativa (1080x1920,
 * 1080x1350 ou 1080x1080) com física de montanha, clima dinâmico (chuva com guarda-chuva,
 * neve), passos do aluno, animais na trilha, reconhecimento de elementos, pronúncia
 * nativa em francês e subida triunfante da bandeira no cume!
 */
import {
  DEMO_FORMATS,
  type DemoFormat,
  type DemoFormatSpec,
  type DemoImages,
} from "@/lib/gameDemoVideo";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/socialLinks";
import { drawSocialIcon } from "@/lib/talkingAvatar";
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
}

export interface TrailDemoPlan {
  settings: TrailDemoSettings;
  theme: TrailThemeOption;
  rounds: TrailDemoRound[];
  levelCfg: TrailLevelConfig;
  introDur: number;
  walkDur: number;
  askDur: number;
  correctTapTime: number;
  revealHold: number;
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

  // Filtra itens do tema
  const pool = items.filter((i) => i.themeId === settings.themeId);
  const picked = (pool.length > 0 ? pool : items).slice(0, 2);

  const rounds: TrailDemoRound[] = picked.map((item) => {
    const opts = buildWordOptions(item, items, false);
    return {
      item,
      options: opts,
      correctIndex: opts.indexOf(item.fr),
      levelCfg,
    };
  });

  const introDur = settings.showIntro ? 2.8 : 0;
  const walkDur = 2.2;
  const askDur = 1.6;
  const correctTapTime = walkDur + askDur + 1.8;
  const revealHold = 2.4;
  const flagDur = settings.level === 7 ? 3.0 : 0;
  const roundTotal = correctTapTime + revealHold;
  const outroStart = introDur + roundTotal + flagDur;
  const outroDur = settings.showOutro ? 3.2 : 0;
  const total = outroStart + outroDur;

  return {
    settings,
    theme,
    rounds,
    levelCfg,
    introDur,
    walkDur,
    askDur,
    correctTapTime,
    revealHold,
    flagDur,
    outroStart,
    outroDur,
    total,
    finalScore: 240,
  };
}

const FONT = '"Inter", "Segoe UI", -apple-system, sans-serif';
const OPTION_LETTERS = ["A", "B", "C", "D"];
const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];

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
  const { theme, levelCfg, introDur, outroStart, outroDur } = plan;
  const round = plan.rounds[0];

  // 1. FUNDO CÉU DA MONTANHA CONFORME O CLIMA
  const isRain = levelCfg.weather === "rain";
  const isSnow = levelCfg.weather === "snow";

  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  if (isRain) {
    skyGrad.addColorStop(0, "#1e293b");
    skyGrad.addColorStop(0.5, "#334155");
    skyGrad.addColorStop(1, "#064e3b");
  } else if (isSnow) {
    skyGrad.addColorStop(0, "#475569");
    skyGrad.addColorStop(0.5, "#cbd5e1");
    skyGrad.addColorStop(1, "#94a3b8");
  } else {
    skyGrad.addColorStop(0, "#38bdf8");
    skyGrad.addColorStop(0.45, "#bae6fd");
    skyGrad.addColorStop(1, "#fef08a");
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Sol ou Nuvens
  if (!isRain && !isSnow) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(w * 0.15, h * 0.12, 60, 0, Math.PI * 2);
    ctx.fillStyle = "#fde047";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 40;
    ctx.fill();
    ctx.restore();
  }

  // 2. PICOS DISTANTES E ENCOSTA DA MONTANHA
  ctx.save();
  ctx.fillStyle = isSnow ? "#94a3b8" : isRain ? "#1e293b" : "#60a5fa";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.6);
  ctx.lineTo(w * 0.25, h * 0.4);
  ctx.lineTo(w * 0.5, h * 0.55);
  ctx.lineTo(w * 0.78, h * 0.32);
  ctx.lineTo(w, h * 0.48);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Encosta Principal da Trilha
  const slopeGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
  slopeGrad.addColorStop(0, isSnow ? "#f8fafc" : isRain ? "#14532d" : "#22c55e");
  slopeGrad.addColorStop(1, isSnow ? "#94a3b8" : isRain ? "#022c22" : "#15803d");
  ctx.fillStyle = slopeGrad;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  ctx.quadraticCurveTo(w * 0.35, h * 0.58, w * 0.65, h * 0.48);
  ctx.quadraticCurveTo(w * 0.85, h * 0.36, w, h * 0.28);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Linha da Trilha Sinuosa
  ctx.strokeStyle = isSnow ? "#cbd5e1" : isRain ? "#582f0e" : "#fef08a";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.82);
  ctx.quadraticCurveTo(w * 0.3, h * 0.72, w * 0.48, h * 0.65);
  ctx.quadraticCurveTo(w * 0.7, h * 0.55, w * 0.88, h * 0.42);
  ctx.stroke();
  ctx.restore();

  // 3. EFEITOS CLIMÁTICOS ANIMADOS (Chuva ou Neve)
  if (isRain) {
    ctx.strokeStyle = "rgba(186, 230, 253, 0.65)";
    ctx.lineWidth = 2.5;
    const offset = (t * 800) % 120;
    for (let rx = 0; rx < w; rx += 45) {
      for (let ry = 0; ry < h; ry += 60) {
        const y = (ry + offset) % h;
        ctx.beginPath();
        ctx.moveTo(rx, y);
        ctx.lineTo(rx - 10, y + 25);
        ctx.stroke();
      }
    }
  } else if (isSnow) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    const snowOffset = (t * 120) % 100;
    for (let sx = 0; sx < w; sx += 60) {
      for (let sy = 0; sy < h; sy += 70) {
        const y = (sy + snowOffset) % h;
        const x = sx + Math.sin(t * 2 + sy) * 15;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 4. ANIMAL DA MONTANHA AO LADO DA TRILHA
  const animalX = w * 0.32;
  const animalY = h * 0.68;
  ctx.save();
  ctx.font = "44px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const animalBob = Math.sin(t * 4) * 6;
  ctx.fillText(levelCfg.animal.emoji, animalX, animalY + animalBob);

  // Nome do animal
  ctx.font = `bold 20px ${FONT}`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 6;
  ctx.fillText(levelCfg.animal.name, animalX, animalY + 38);
  ctx.restore();

  // 5. PERSONAGEM ALUNO CAMINHANDO / COM GUARDA-CHUVA
  const isWalking = t >= introDur && t < introDur + plan.walkDur;
  const walkFrac = clamp((t - introDur) / plan.walkDur, 0, 1);
  const studentX = w * 0.18 + walkFrac * (w * 0.35);
  const studentY = h * 0.76 - walkFrac * (h * 0.16);

  ctx.save();
  ctx.translate(studentX, studentY);
  const stepBob = isWalking ? Math.sin(t * 14) * 5 : 0;

  // Sombra
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 52, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corpo
  ctx.translate(0, stepBob);
  // Jaqueta azul
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(-18, 0, 36, 42);

  // Mochila laranja
  ctx.fillStyle = "#f97316";
  ctx.fillRect(-28, 4, 12, 32);

  // Cabeça
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.arc(0, -16, 18, 0, Math.PI * 2);
  ctx.fill();

  // Olhos e sorriso
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(-6, -18, 2.5, 0, Math.PI * 2);
  ctx.arc(6, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Gorro de Neve ou Boina
  if (isSnow) {
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(0, -28, 16, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, -42, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.ellipse(0, -30, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // GUARDA-CHUVA ABERTO NA CHUVA (Níveis 4 e 5)
  if (levelCfg.hasUmbrella) {
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, 10);
    ctx.lineTo(14, -40);
    ctx.stroke();

    // Cúpula do guarda-chuva
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(14, -40, 42, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // BANDEIRA HASTEADA NO CUME (NÍVEL 7)
  if (plan.settings.level === 7 && t >= introDur + plan.walkDur) {
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(35, 50);
    ctx.lineTo(35, -70);
    ctx.stroke();

    // Bandeira Tricolor Francesa
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(37, -68, 14, 28);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(51, -68, 14, 28);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(65, -68, 14, 28);
  }
  ctx.restore();

  // 6. CARD DO ELEMENTO A RECONHECER
  if (round && t >= introDur + plan.walkDur && t < outroStart) {
    const cardT = t - (introDur + plan.walkDur);
    const cardScale = easeOut(cardT / 0.4);

    const cardW = Math.min(w - 60, 920);
    const cardH = 580;
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
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(`NÍVEL ${levelCfg.level} · ${levelCfg.name.toUpperCase()}`, cardX + 24, cardY + 40);

    // Imagem da Cena
    const imgObj = assets.images.get(round.item.scene);
    const imgW = cardW - 48;
    const imgH = 260;
    const imgX = cardX + 24;
    const imgY = cardY + 60;

    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, 18);
    ctx.fill();

    if (imgObj) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 18);
      ctx.clip();
      ctx.drawImage(imgObj, imgX, imgY, imgW, imgH);

      // Seta Vermelha apontando para o objeto
      const arrowX = imgX + (round.item.arrow.x / round.item.w) * imgW;
      const arrowY = imgY + (round.item.arrow.y / round.item.h) * imgH;
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(arrowX - 40, arrowY - 20);
      ctx.lineTo(arrowX - 10, arrowY - 10);
      ctx.lineTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 10, arrowY - 10);
      ctx.lineTo(arrowX - 20, arrowY - 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Cronômetro Circular
    const timerX = cardX + cardW - 55;
    const timerY = cardY + 40;
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(timerX, timerY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 16px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText("⏱️", timerX, timerY + 5);

    // As 4 Alternativas (A, B, C, D)
    const optStartY = imgY + imgH + 20;
    const optH = 50;
    const optGap = 12;

    const isAnswered = t >= introDur + plan.correctTapTime;

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
      ctx.font = `bold 16px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText(OPTION_LETTERS[idx], ox + 25, oy + 30);

      // Texto da opção
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 16px ${FONT}`;
      ctx.textAlign = "left";
      ctx.fillText(opt, ox + 50, oy + 31);
    });

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
    ctx.fillText("7 Níveis · Chuva, Neve & Bandeira no Topo", w / 2, h * 0.61);
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
