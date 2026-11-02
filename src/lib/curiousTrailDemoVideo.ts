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
  const walkingRound = round;
  const isWalking = Boolean(walkingRound && t < walkingRound.walkEnd);
  const walkFrac = walkingRound
    ? isWalking
      ? clamp((t - walkingRound.start) / (walkingRound.walkEnd - walkingRound.start))
      : 1
    : t >= (plan.rounds.at(-1)?.end ?? introDur)
      ? 1
      : 0;
  const trailProgress = plan.rounds.length
    ? clamp(((activeRoundIndex >= 0 ? activeRoundIndex : plan.rounds.length - 1) + walkFrac) / plan.rounds.length)
    : 0;
  const studentX = w * 0.12 + trailProgress * (w * 0.72);
  const studentY = h * 0.79 - trailProgress * (h * 0.43);

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
  if (plan.settings.level === 7 && t >= (plan.rounds.at(-1)?.end ?? outroStart)) {
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
