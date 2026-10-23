/**
 * Vídeos demonstrativos do jogo "C'est quoi ?" para Instagram e Facebook.
 *
 * Tudo aqui é independente de React: monta as rodadas, calcula a linha do
 * tempo, desenha cada quadro no canvas (função pura do tempo `t`) e sintetiza
 * os efeitos sonoros. Assim o MESMO desenho serve para a pré-visualização na
 * tela e para a exportação em alta qualidade (quadro a quadro).
 */
import { LEVELS, type Level } from "@/lib/cquoiLevels";
import { buildWordOptions, type CestQuoiItem } from "@/lib/cquoiContent";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/socialLinks";
import { drawSocialIcon } from "@/lib/talkingAvatar";

/* ------------------------------------------------------------------ */
/* Formatos e configurações                                            */
/* ------------------------------------------------------------------ */

export type DemoFormat = "story" | "feed" | "square";

export interface DemoFormatSpec {
  id: DemoFormat;
  label: string;
  hint: string;
  w: number;
  h: number;
  /** Faixas que o Instagram cobre com a interface (respostas, legenda, perfil). */
  safeTop: number;
  safeBottom: number;
}

export const DEMO_FORMATS: Record<DemoFormat, DemoFormatSpec> = {
  story: {
    id: "story",
    label: "Stories e Reels (9:16)",
    hint: "1080 × 1920 · Stories e Reels do Instagram, Stories e Reels do Facebook",
    w: 1080,
    h: 1920,
    safeTop: 230,
    safeBottom: 330,
  },
  feed: {
    id: "feed",
    label: "Feed vertical (4:5)",
    hint: "1080 × 1350 · formato que ocupa mais tela no feed do Instagram e do Facebook",
    w: 1080,
    h: 1350,
    safeTop: 60,
    safeBottom: 60,
  },
  square: {
    id: "square",
    label: "Feed quadrado (1:1)",
    hint: "1080 × 1080 · funciona em qualquer rede",
    w: 1080,
    h: 1080,
    safeTop: 50,
    safeBottom: 50,
  },
};

export type DemoLevel = Extract<Level, "easy" | "intermediate" | "master" | "native_word">;
export const DEMO_LEVELS: DemoLevel[] = ["easy", "intermediate", "master", "native_word"];

/** Quando mostrar uma tentativa errada antes da certa. */
export type AttemptMode = "mixed" | "always" | "never";

export interface DemoSettings {
  title: string;
  level: DemoLevel;
  format: DemoFormat;
  attempts: AttemptMode;
  showIntro: boolean;
  showOutro: boolean;
  sound: boolean;
  cta: string;
  platform: SocialPlatform;
  handle: string;
}

export const DEFAULT_DEMO_SETTINGS: DemoSettings = {
  title: "Você sabe o que é isso?\nTeste o seu francês!",
  level: "intermediate",
  format: "story",
  attempts: "mixed",
  showIntro: true,
  showOutro: true,
  sound: true,
  cta: "Jogue grátis na plataforma",
  platform: "instagram",
  handle: "frances_com_tres_nativos",
};

export const MAX_DEMO_ROUNDS = 6;

/* ------------------------------------------------------------------ */
/* Rodadas e linha do tempo                                            */
/* ------------------------------------------------------------------ */

export interface DemoRound {
  item: CestQuoiItem;
  options: string[];
  correctIndex: number;
  /** Alternativa errada que é tocada antes da certa (null = acerta de primeira). */
  wrongIndex: number | null;
}

/** 4 alternativas como no jogo (palavras do mesmo tema nos níveis Nativo). */
export function buildDemoRounds(
  items: CestQuoiItem[],
  pool: CestQuoiItem[],
  settings: Pick<DemoSettings, "level" | "attempts">
): DemoRound[] {
  return items.slice(0, MAX_DEMO_ROUNDS).map((item, index) => {
    const options = buildWordOptions(item, pool, settings.level === "native_word");
    const correctIndex = options.indexOf(item.fr);
    const wrongs = options.map((_, i) => i).filter((i) => i !== correctIndex);
    const showWrong =
      settings.attempts === "always" || (settings.attempts === "mixed" && index % 2 === 0);
    const wrongIndex = showWrong && wrongs.length ? wrongs[Math.floor(Math.random() * wrongs.length)] : null;
    return { item, options, correctIndex, wrongIndex };
  });
}

export interface RoundTiming {
  /** Início da rodada na linha do tempo do vídeo (s). Os demais tempos são relativos a ele. */
  start: number;
  dur: number;
  secs: number;
  optionsAt: number;
  timerStart: number;
  wrongTap: number | null;
  correctTap: number;
  revealHold: number;
  exit: number;
  points: number;
  scoreBefore: number;
  scoreAfter: number;
}

export interface DemoPlan {
  settings: DemoSettings;
  rounds: DemoRound[];
  timings: RoundTiming[];
  introDur: number;
  outroStart: number;
  outroDur: number;
  total: number;
  finalScore: number;
}

export function planDemo(rounds: DemoRound[], settings: DemoSettings): DemoPlan {
  const level = LEVELS[settings.level];
  const introDur = settings.showIntro ? 2.6 : 0;
  const outroDur = settings.showOutro ? 3.4 : 0;
  let cursor = introDur;
  let score = 0;

  const timings = rounds.map((round) => {
    const secs = level.seconds;
    const optionsAt = 0.95;
    const timerStart = 1.75;
    let wrongTap: number | null = null;
    let correctTap: number;
    if (round.wrongIndex !== null) {
      wrongTap = timerStart + clamp(secs * 0.25, 1.0, 1.6);
      correctTap = wrongTap + 1.6;
    } else {
      correctTap = timerStart + clamp(secs * 0.35, 1.2, 2.2);
    }
    const revealHold = 2.2;
    const exit = 0.4;
    const dur = correctTap + revealHold + exit;

    const frac = clamp(1 - (correctTap - timerStart) / secs, 0, 1);
    let base = 100 + Math.round(50 * frac);
    if (round.wrongIndex !== null) base = Math.round(base * 0.5); // 2ª tentativa vale menos
    const points = Math.max(1, Math.round(base * level.multiplier));

    const timing: RoundTiming = {
      start: cursor,
      dur,
      secs,
      optionsAt,
      timerStart,
      wrongTap,
      correctTap,
      revealHold,
      exit,
      points,
      scoreBefore: score,
      scoreAfter: score + points,
    };
    cursor += dur;
    score += points;
    return timing;
  });

  return {
    settings,
    rounds,
    timings,
    introDur,
    outroStart: cursor,
    outroDur,
    total: cursor + outroDur,
    finalScore: score,
  };
}

/* ------------------------------------------------------------------ */
/* Imagens                                                             */
/* ------------------------------------------------------------------ */

export type DemoImages = Map<string, HTMLImageElement>;

/** Carrega as cenas. Imagens que não carregam ficam de fora do mapa. */
export async function loadDemoImages(items: CestQuoiItem[]): Promise<DemoImages> {
  const map: DemoImages = new Map();
  await Promise.all(
    items.map(
      (item) =>
        new Promise<void>((resolve) => {
          if (map.has(item.scene)) return resolve();
          const img = new Image();
          // Imagens de outro domínio precisam de CORS, senão o canvas fica "contaminado" e não exporta.
          if (!item.scene.startsWith("/")) img.crossOrigin = "anonymous";
          img.onload = () => {
            map.set(item.scene, img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = item.scene;
        })
    )
  );
  return map;
}

/* ------------------------------------------------------------------ */
/* Desenho                                                             */
/* ------------------------------------------------------------------ */

const OPTION_COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];
const OPTION_LETTERS = ["A", "B", "C", "D"];
const FONT = '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const easeOutBack = (t: number) => {
  const x = clamp(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
/** Progresso 0→1 de `t` entre `from` e `from + dur`. */
const prog = (t: number, from: number, dur: number) => clamp((t - from) / dur);

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, weight: string, maxPx: number, minPx: number, maxW: number) {
  let px = maxPx;
  ctx.font = `${weight} ${px}px ${FONT}`;
  while (px > minPx && ctx.measureText(text).width > maxW) {
    px -= 2;
    ctx.font = `${weight} ${px}px ${FONT}`;
  }
  return px;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

interface Layout {
  pad: number;
  header: { x: number; y: number; w: number; h: number };
  card: { x: number; y: number; w: number; h: number };
  options: { x: number; y: number; w: number; h: number }[];
  footer: { x: number; y: number; w: number; h: number };
}

function layoutFor(format: DemoFormatSpec): Layout {
  const W = format.w;
  const pad = 60;
  const contentW = W - pad * 2;
  const top = format.safeTop;
  const bottom = format.h - format.safeBottom;
  const gap = 28;
  const headerH = 110;
  const footerH = 64;
  const optGap = 22;
  const optH = format.id === "story" ? 132 : 112;
  const optionsH = optH * 2 + optGap;

  const avail = bottom - top - headerH - footerH - optionsH - gap * 3;
  const sceneRatio = 490 / 350;
  const cardH = Math.min(avail, contentW / sceneRatio);
  const cardW = cardH * sceneRatio;
  const used = headerH + gap + cardH + gap + optionsH + gap + footerH;
  const y0 = top + Math.max(0, (bottom - top - used) / 2);

  const optW = (contentW - optGap) / 2;
  const optY = y0 + headerH + gap + cardH + gap;
  return {
    pad,
    header: { x: pad, y: y0, w: contentW, h: headerH },
    card: { x: (W - cardW) / 2, y: y0 + headerH + gap, w: cardW, h: cardH },
    options: [0, 1, 2, 3].map((i) => ({
      x: pad + (i % 2) * (optW + optGap),
      y: optY + Math.floor(i / 2) * (optH + optGap),
      w: optW,
      h: optH,
    })),
    footer: { x: pad, y: optY + optionsH + gap, w: contentW, h: footerH },
  };
}

function drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number, level: Level, t: number) {
  const cfg = LEVELS[level];
  const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
  g.addColorStop(0, "#1e1b4b");
  g.addColorStop(0.55, "#312e81");
  g.addColorStop(1, "#1e3a8a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // brilhos suaves na cor do nível, flutuando devagar
  for (let i = 0; i < 3; i++) {
    const cx = W * (0.2 + 0.3 * i) + Math.sin(t * 0.4 + i * 2) * 60;
    const cy = H * (0.18 + 0.32 * i) + Math.cos(t * 0.3 + i) * 80;
    const r = W * 0.55;
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    rg.addColorStop(0, i % 2 ? `${cfg.c2}55` : `${cfg.c1}44`);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
  }
}

function drawFlag(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  rr(ctx, x, y, w, h, h * 0.18);
  ctx.clip();
  ctx.fillStyle = "#0055a4";
  ctx.fillRect(x, y, w / 3, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + w / 3, y, w / 3, h);
  ctx.fillStyle = "#ef4135";
  ctx.fillRect(x + (2 * w) / 3, y, w / 3, h);
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawClock(ctx: CanvasRenderingContext2D, cx: number, cy: number, d: number, left: number, total: number, t: number) {
  const frac = clamp(left / total);
  const elapsed = 1 - frac;
  const ring = frac <= 0.33 ? "#dc2626" : frac <= 0.6 ? "#f59e0b" : "#2c58c9";
  const s = d / 140;
  const urgent = frac <= 0.33 && frac > 0;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * (urgent ? 1 + Math.sin(t * 14) * 0.04 : 1), s * (urgent ? 1 + Math.sin(t * 14) * 0.04 : 1));
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 64, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 10;
  ctx.strokeStyle = ring;
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.strokeStyle = ring;
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 0, 56, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
  ctx.stroke();
  ctx.lineWidth = 4;
  for (let a = 0; a < 4; a++) {
    ctx.save();
    ctx.rotate((a * Math.PI) / 2);
    ctx.beginPath();
    ctx.moveTo(0, -53);
    ctx.lineTo(0, -43);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.rotate(elapsed * Math.PI * 2);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -44);
  ctx.stroke();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();
  // segundos restantes
  ctx.beginPath();
  ctx.arc(52, 52, 26, 0, Math.PI * 2);
  ctx.fillStyle = ring;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `800 30px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(Math.ceil(left)), 52, 53);
  ctx.restore();
}

/** Seta vermelha do jogo (mesma forma), que cai sobre o objeto e balança. */
function drawArrow(ctx: CanvasRenderingContext2D, item: CestQuoiItem, k: number, lt: number) {
  const drop = prog(lt, 0.55, 0.5);
  const dy = -(1 - easeOutBack(drop)) * 260;
  const sway = Math.sin(lt * 4) * 5;
  const alpha = clamp(drop * 3);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(item.arrow.x * k + sway, item.arrow.y * k + dy);
  ctx.rotate((25 * Math.PI) / 180);
  ctx.scale(k * 1.15, k * 1.15);
  const pts: [number, number][] = [
    [-104, -12], [-44, -12], [-50, -29], [0, 0], [-50, 29], [-44, 12], [-104, 12],
  ];
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.lineJoin = "round";
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.fillStyle = "#e60012";
  ctx.fill();
  ctx.restore();
}

export interface RenderOptions {
  images: DemoImages;
}

/** Desenha o quadro do instante `t` (segundos). `W`×`H` são os pixels reais do canvas. */
export function renderDemoFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  plan: DemoPlan,
  opts: RenderOptions
) {
  const format = DEMO_FORMATS[plan.settings.format];
  const s = W / format.w;
  ctx.save();
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.globalAlpha = 1;

  drawBackground(ctx, format.w, format.h, plan.settings.level, t);

  if (t < plan.introDur) {
    drawIntro(ctx, format, plan, t);
  } else if (t >= plan.outroStart && plan.outroDur > 0) {
    drawOutro(ctx, format, plan, t - plan.outroStart);
  } else {
    const index = plan.timings.findIndex((tm) => t >= tm.start && t < tm.start + tm.dur);
    if (index >= 0) drawRound(ctx, format, plan, index, t - plan.timings[index].start, t, opts);
    else if (plan.timings.length) {
      // sem intro/outro: segura o último quadro
      const last = plan.timings.length - 1;
      drawRound(ctx, format, plan, last, plan.timings[last].dur - 0.001, t, opts);
    }
  }
  ctx.restore();
}

function drawIntro(ctx: CanvasRenderingContext2D, format: DemoFormatSpec, plan: DemoPlan, t: number) {
  const W = format.w;
  const cfg = LEVELS[plan.settings.level];
  const cx = W / 2;
  const cy = format.safeTop + (format.h - format.safeTop - format.safeBottom) / 2;
  const fade = 1 - prog(t, plan.introDur - 0.4, 0.4);
  ctx.save();
  ctx.globalAlpha = fade;

  // balão "C'est quoi ?"
  const pop = easeOutBack(prog(t, 0.05, 0.6));
  ctx.save();
  ctx.translate(cx, cy - format.h * 0.09);
  ctx.scale(pop, pop);
  const bw = 800;
  const bh = 230;
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  rr(ctx, -bw / 2, -bh / 2, bw, bh, 70);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.beginPath();
  ctx.moveTo(-60, bh / 2 - 4);
  ctx.lineTo(-20, bh / 2 + 70);
  ctx.lineTo(40, bh / 2 - 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#1e1b4b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 124px ${FONT}`;
  ctx.fillText("C'est quoi ?", 0, 6);
  drawFlag(ctx, bw / 2 - 150, -bh / 2 - 36, 110, 74);
  ctx.restore();

  // título
  const tp = easeOutCubic(prog(t, 0.5, 0.6));
  ctx.save();
  ctx.globalAlpha = fade * tp;
  ctx.translate(0, (1 - tp) * 40);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  ctx.font = `800 70px ${FONT}`;
  const lines = wrapLines(ctx, plan.settings.title || " ", W - 160);
  const startY = cy + format.h * 0.09 + 90;
  lines.forEach((line, i) => {
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 16;
    ctx.fillText(line, cx, startY + i * 86);
  });
  ctx.shadowColor = "transparent";

  // etiqueta do nível
  const label = `NÍVEL ${cfg.label.toUpperCase()} · PONTOS ×${cfg.multiplier}`;
  ctx.font = `800 34px ${FONT}`;
  const lw = ctx.measureText(label).width + 70;
  const ly = startY + lines.length * 86 + 20;
  const lg = ctx.createLinearGradient(cx - lw / 2, 0, cx + lw / 2, 0);
  lg.addColorStop(0, cfg.c1);
  lg.addColorStop(1, cfg.c2);
  rr(ctx, cx - lw / 2, ly, lw, 68, 34);
  ctx.fillStyle = lg;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, ly + 36);
  ctx.restore();
  ctx.restore();
}

function drawOutro(ctx: CanvasRenderingContext2D, format: DemoFormatSpec, plan: DemoPlan, lt: number) {
  const W = format.w;
  const cx = W / 2;
  const cy = format.safeTop + (format.h - format.safeTop - format.safeBottom) / 2;
  const pop = easeOutBack(prog(lt, 0, 0.55));
  const fadeIn = clamp(lt / 0.3);
  const platform = SOCIAL_PLATFORMS[plan.settings.platform];
  const handle = plan.settings.handle;

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.translate(cx, cy);
  ctx.scale(0.9 + 0.1 * pop, 0.9 + 0.1 * pop);
  ctx.translate(-cx, -cy);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 16;
  ctx.font = `900 92px ${FONT}`;
  ctx.fillText("Gostou do jogo?", cx, cy - 250);
  ctx.font = `800 58px ${FONT}`;
  const ctaLines = wrapLines(ctx, plan.settings.cta || " ", W - 180);
  ctaLines.forEach((line, i) => ctx.fillText(line, cx, cy - 160 + i * 70));
  ctx.shadowColor = "transparent";

  // pontuação
  const scoreY = cy - 160 + ctaLines.length * 70 + 30;
  rr(ctx, cx - 250, scoreY, 500, 120, 60);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fill();
  drawStar(ctx, cx - 160, scoreY + 60, 38, lt * 0.8);
  ctx.fillStyle = "#fbbf24";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `900 64px ${FONT}`;
  ctx.fillText(`${plan.finalScore} pts`, cx - 100, scoreY + 62);

  // cartão da rede social
  const cardY = scoreY + 170;
  const cardW = 800;
  const cardH = 200;
  rr(ctx, cx - cardW / 2, cardY, cardW, cardH, 44);
  ctx.fillStyle = "rgba(10,14,30,0.78)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.stroke();
  const pulse = 1 + Math.sin(lt * 5) * 0.03;
  ctx.save();
  ctx.translate(cx - cardW / 2 + 40 + 70, cardY + cardH / 2);
  ctx.scale(pulse, pulse);
  drawSocialIcon(ctx, plan.settings.platform, 0, 0, 140);
  ctx.restore();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `600 34px ${FONT}`;
  ctx.fillText(platform.cta, cx - cardW / 2 + 40 + 140 + 36, cardY + 78);
  ctx.fillStyle = "#fff";
  const hpx = fitFont(ctx, `@${handle}`, "800", 50, 30, cardW - 40 - 140 - 36 - 40);
  ctx.font = `800 ${hpx}px ${FONT}`;
  ctx.fillText(`@${handle}`, cx - cardW / 2 + 40 + 140 + 36, cardY + 78 + hpx + 10);
  ctx.restore();
}

function drawRound(
  ctx: CanvasRenderingContext2D,
  format: DemoFormatSpec,
  plan: DemoPlan,
  index: number,
  lt: number,
  t: number,
  opts: RenderOptions
) {
  const round = plan.rounds[index];
  const tm = plan.timings[index];
  const cfg = LEVELS[plan.settings.level];
  const L = layoutFor(format);
  const W = format.w;

  const enter = easeOutCubic(prog(lt, 0, 0.55));
  const exit = prog(lt, tm.dur - tm.exit, tm.exit);
  const alpha = clamp(prog(lt, 0, 0.25) * (1 - exit));
  const slideY = (1 - enter) * 120;
  const slideX = -exit * 160;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(slideX, slideY);

  /* ----- cabeçalho ----- */
  const hx = L.header.x;
  const hy = L.header.y;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 14;
  ctx.font = `900 62px ${FONT}`;
  ctx.fillText("C'est quoi ?", hx + 88, hy + 56);
  ctx.shadowColor = "transparent";
  drawFlag(ctx, hx, hy + 14, 70, 48);
  const levelLabel = `${cfg.label} · ×${cfg.multiplier}`;
  ctx.font = `700 30px ${FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(levelLabel, hx + 88, hy + 98);

  // pontuação (sobe depois do acerto)
  const scoreShown = Math.round(
    tm.scoreBefore + (tm.scoreAfter - tm.scoreBefore) * easeOutCubic(prog(lt, tm.correctTap + 0.2, 0.7))
  );
  const scoreText = `${scoreShown}`;
  ctx.font = `900 52px ${FONT}`;
  const pillW = ctx.measureText(scoreText).width + 130;
  const pillX = hx + L.header.w - pillW;
  const bump = 1 + Math.sin(prog(lt, tm.correctTap + 0.2, 0.5) * Math.PI) * 0.1;
  ctx.save();
  ctx.translate(pillX + pillW / 2, hy + 48);
  ctx.scale(bump, bump);
  rr(ctx, -pillW / 2, -42, pillW, 84, 42);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fill();
  drawStar(ctx, -pillW / 2 + 48, 0, 26, 0);
  ctx.fillStyle = "#fbbf24";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.font = `900 52px ${FONT}`;
  ctx.fillText(scoreText, -pillW / 2 + 88, 3);
  ctx.restore();
  ctx.textBaseline = "alphabetic";

  /* ----- cartão da imagem ----- */
  const c = L.card;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  rr(ctx, c.x - 10, c.y - 10, c.w + 20, c.h + 20, 44);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();

  ctx.save();
  rr(ctx, c.x, c.y, c.w, c.h, 36);
  ctx.clip();
  const img = opts.images.get(round.item.scene);
  if (img) {
    ctx.drawImage(img, c.x, c.y, c.w, c.h);
  } else {
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(c.x, c.y, c.w, c.h);
  }
  const k = c.w / round.item.w;
  ctx.save();
  ctx.translate(c.x, c.y);
  drawArrow(ctx, round.item, k, lt);
  ctx.restore();

  // flash verde / vermelho
  const flashCorrect = 1 - prog(lt, tm.correctTap, 0.5);
  if (lt >= tm.correctTap && flashCorrect > 0) {
    ctx.fillStyle = `rgba(34,197,94,${0.38 * flashCorrect})`;
    ctx.fillRect(c.x, c.y, c.w, c.h);
  }
  if (tm.wrongTap !== null && lt >= tm.wrongTap) {
    const f = 1 - prog(lt, tm.wrongTap, 0.45);
    if (f > 0) {
      ctx.fillStyle = `rgba(239,68,68,${0.36 * f})`;
      ctx.fillRect(c.x, c.y, c.w, c.h);
    }
  }

  // relógio
  const elapsedAnswer = Math.min(lt, tm.correctTap);
  const left = clamp(tm.secs - Math.max(0, elapsedAnswer - tm.timerStart), 0, tm.secs);
  drawClock(ctx, c.x + 84, c.y + 84, 128, left, tm.secs, t);

  // etiqueta do tema + contagem
  const tag = `${round.item.theme} · ${index + 1}/${plan.rounds.length}`;
  ctx.font = `800 28px ${FONT}`;
  const tw = ctx.measureText(tag).width + 40;
  rr(ctx, c.x + c.w - tw - 18, c.y + 18, tw, 52, 26);
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.fillText(tag, c.x + c.w - tw - 18 + 20, c.y + 45);

  // balão de pergunta / resposta
  const bubbleH = 92;
  const bubbleX = c.x + 24;
  const bubbleW = c.w - 48;
  const bubbleY = c.y + c.h - bubbleH - 22;
  const bubbleIn = easeOutBack(prog(lt, 0.7, 0.45));
  const revealed = lt >= tm.correctTap + 0.15;
  const popAns = revealed ? 1 + Math.sin(prog(lt, tm.correctTap + 0.15, 0.4) * Math.PI) * 0.08 : 1;
  ctx.save();
  ctx.translate(bubbleX + bubbleW / 2, bubbleY + bubbleH / 2);
  ctx.scale(bubbleIn * popAns, bubbleIn * popAns);
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  rr(ctx, -bubbleW / 2, -bubbleH / 2, bubbleW, bubbleH, 30);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (revealed) {
    const badge = 46;
    const txt = `${round.item.fr}.`;
    const px = fitFont(ctx, txt, "900", 52, 28, bubbleW - badge - 70);
    ctx.font = `900 ${px}px ${FONT}`;
    const textW = ctx.measureText(txt).width;
    const totalW = badge + 16 + textW;
    const startX = -totalW / 2;
    rr(ctx, startX, -badge / 2, badge, badge, 10);
    ctx.fillStyle = "#16a34a";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(startX + 11, 2);
    ctx.lineTo(startX + 20, 12);
    ctx.lineTo(startX + 36, -10);
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.textAlign = "left";
    ctx.fillText(txt, startX + badge + 16, 4);
  } else if (tm.wrongTap !== null && lt >= tm.wrongTap + 0.1) {
    ctx.fillStyle = "#dc2626";
    ctx.font = `900 46px ${FONT}`;
    ctx.fillText("Quase! Tente de novo", 0, 3);
  } else {
    ctx.fillStyle = "#333";
    ctx.font = `900 54px ${FONT}`;
    ctx.fillText("C'est quoi ?", 0, 3);
  }
  ctx.restore();
  ctx.restore(); // clip do cartão

  // fagulhas e pontos ao acertar
  if (lt >= tm.correctTap) {
    const sp = lt - tm.correctTap;
    const cx0 = c.x + c.w / 2;
    const cy0 = c.y + c.h * 0.42;
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2 + (i % 2) * 0.2;
      const speed = 260 + (i % 4) * 90;
      const life = clamp(sp / 1.0);
      if (life >= 1) continue;
      const px = cx0 + Math.cos(ang) * speed * life * 1.1;
      const py = cy0 + Math.sin(ang) * speed * life * 1.1 + 180 * life * life;
      ctx.globalAlpha = alpha * (1 - life);
      ctx.fillStyle = i % 3 === 0 ? "#fde047" : i % 3 === 1 ? "#ffffff" : "#86efac";
      drawStar(ctx, px, py, 24 * (1 - life * 0.4), sp * 4 + i);
      ctx.fill();
    }
    ctx.globalAlpha = alpha;
    const fp = prog(sp, 0.05, 1.3);
    if (fp > 0 && fp < 1) {
      ctx.save();
      ctx.globalAlpha = alpha * (fp < 0.7 ? 1 : 1 - (fp - 0.7) / 0.3);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fs = 120 * easeOutBack(prog(sp, 0.05, 0.35));
      ctx.font = `900 ${Math.max(1, fs)}px ${FONT}`;
      ctx.lineWidth = 14;
      ctx.strokeStyle = "#15803d";
      ctx.lineJoin = "round";
      const fy = c.y + c.h * 0.42 - fp * 90;
      ctx.strokeText(`+${tm.points}`, c.x + c.w / 2, fy);
      ctx.fillStyle = "#fff";
      ctx.fillText(`+${tm.points}`, c.x + c.w / 2, fy);
      ctx.restore();
    }
  }

  /* ----- alternativas ----- */
  round.options.forEach((text, i) => {
    const r = L.options[i];
    const appear = easeOutBack(prog(lt, tm.optionsAt + i * 0.14, 0.45));
    const isWrongPick = round.wrongIndex === i && tm.wrongTap !== null && lt >= tm.wrongTap;
    const isRight = i === round.correctIndex && lt >= tm.correctTap;
    const answered = lt >= tm.correctTap;

    // aperto (afunda) + tremida do erro
    let dx = 0;
    let dy = 0;
    const tapAt = i === round.correctIndex ? tm.correctTap : round.wrongIndex === i ? tm.wrongTap : null;
    if (tapAt !== null && lt >= tapAt - 0.12 && lt < tapAt + 0.12) dy = 6;
    if (isWrongPick && lt - (tm.wrongTap as number) < 0.5) {
      const d = lt - (tm.wrongTap as number);
      dx = Math.sin(d * 48) * 14 * (1 - d / 0.5);
    }
    const pulse = isRight ? 1 + Math.sin(prog(lt, tm.correctTap, 0.45) * Math.PI) * 0.06 : 1;

    ctx.save();
    ctx.globalAlpha = alpha * clamp(appear * 1.4);
    ctx.translate(r.x + r.w / 2 + dx, r.y + r.h / 2 + dy + (1 - appear) * 50);
    ctx.scale(pulse * (0.85 + 0.15 * appear), pulse * (0.85 + 0.15 * appear));
    if (answered && !isRight && !isWrongPick) ctx.globalAlpha *= 0.45;

    const bg = isRight ? "#22c55e" : isWrongPick ? "#fee2e2" : "#ffffff";
    const edge = isRight ? "#15803d" : isWrongPick ? "#f87171" : "#cbd5e1";
    const fg = isRight ? "#ffffff" : isWrongPick ? "#ef4444" : "#0f172a";
    // sombra de baixo (borda 3D)
    rr(ctx, -r.w / 2, -r.h / 2 + 8, r.w, r.h, 30);
    ctx.fillStyle = edge;
    ctx.fill();
    rr(ctx, -r.w / 2, -r.h / 2, r.w, r.h, 30);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = edge;
    ctx.stroke();

    // letra
    const chip = 56;
    ctx.beginPath();
    ctx.arc(-r.w / 2 + 22 + chip / 2, 0, chip / 2, 0, Math.PI * 2);
    ctx.fillStyle = isRight ? "#15803d" : isWrongPick ? "#f87171" : OPTION_COLORS[i];
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 31px ${FONT}`;
    ctx.fillText(OPTION_LETTERS[i], -r.w / 2 + 22 + chip / 2, 2);

    // texto (reduz a fonte se for comprido)
    const textMaxW = r.w - 22 - chip - 16 - 18;
    const px = fitFont(ctx, text, "800", format.id === "story" ? 42 : 38, 22, textMaxW);
    ctx.font = `800 ${px}px ${FONT}`;
    ctx.fillStyle = fg;
    const tx = -r.w / 2 + 22 + chip + 16 + textMaxW / 2;
    ctx.fillText(text, tx, 3);
    if (isWrongPick) {
      const w = ctx.measureText(text).width;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(tx - w / 2, 4);
      ctx.lineTo(tx + w / 2, 4);
      ctx.stroke();
    }
    ctx.restore();

    // anel do toque
    if (tapAt !== null && lt >= tapAt - 0.05 && lt < tapAt + 0.5) {
      const rp = prog(lt, tapAt - 0.05, 0.55);
      ctx.save();
      ctx.globalAlpha = alpha * (1 - rp) * 0.8;
      ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
      ctx.beginPath();
      ctx.arc(0, 0, 18 + rp * 90, 0, Math.PI * 2);
      ctx.lineWidth = 9;
      ctx.strokeStyle = isRightLike(round, i) ? "#bbf7d0" : "#fecaca";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - rp)})`;
      ctx.fill();
      ctx.restore();
    }
  });

  /* ----- rodapé ----- */
  const f = L.footer;
  const handle = `@${plan.settings.handle}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `800 40px ${FONT}`;
  const hw = ctx.measureText(handle).width;
  const total = 54 + 18 + hw;
  const fx = W / 2 - total / 2;
  drawSocialIcon(ctx, plan.settings.platform, fx + 27, f.y + f.h / 2, 54);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(handle, fx + 72, f.y + f.h / 2 + 2);

  ctx.restore();
}

function isRightLike(round: DemoRound, i: number) {
  return i === round.correctIndex;
}

/* ------------------------------------------------------------------ */
/* Efeitos sonoros (sintetizados, sem arquivos de áudio)               */
/* ------------------------------------------------------------------ */

type Sfx = "pop" | "tap" | "buzz" | "ding" | "whoosh" | "tick";

export interface SfxEvent {
  t: number;
  kind: Sfx;
}

export function sfxEvents(plan: DemoPlan): SfxEvent[] {
  const ev: SfxEvent[] = [];
  if (plan.introDur > 0) ev.push({ t: 0.05, kind: "whoosh" });
  plan.timings.forEach((tm, idx) => {
    const round = plan.rounds[idx];
    ev.push({ t: tm.start + 0.1, kind: "whoosh" });
    for (let i = 0; i < 4; i++) ev.push({ t: tm.start + tm.optionsAt + i * 0.14, kind: "pop" });
    const stop = tm.wrongTap ?? tm.correctTap;
    for (let s = tm.timerStart + 1; s < stop - 0.2; s += 1) ev.push({ t: tm.start + s, kind: "tick" });
    if (tm.wrongTap !== null && round.wrongIndex !== null) {
      ev.push({ t: tm.start + tm.wrongTap, kind: "tap" });
      ev.push({ t: tm.start + tm.wrongTap + 0.04, kind: "buzz" });
      for (let s = tm.wrongTap + 0.9; s < tm.correctTap - 0.2; s += 1) ev.push({ t: tm.start + s, kind: "tick" });
    }
    ev.push({ t: tm.start + tm.correctTap, kind: "tap" });
    ev.push({ t: tm.start + tm.correctTap + 0.04, kind: "ding" });
  });
  if (plan.outroDur > 0) ev.push({ t: plan.outroStart + 0.1, kind: "ding" });
  return ev;
}

/** Mistura os efeitos num buffer estéreo (Float32 por canal). */
export function synthDemoAudio(
  plan: DemoPlan,
  sampleRate: number,
  pronunciations?: Map<string, Float32Array>
): Float32Array[] {
  const length = Math.ceil((plan.total + 0.3) * sampleRate);
  const left = new Float32Array(length);

  const add = (start: number, dur: number, vol: number, fn: (x: number, i: number) => number) => {
    const from = Math.floor(start * sampleRate);
    const n = Math.floor(dur * sampleRate);
    for (let i = 0; i < n && from + i < length; i++) {
      const x = i / sampleRate;
      left[from + i] += fn(x, i) * vol;
    }
  };
  const env = (x: number, dur: number, attack = 0.004) =>
    Math.min(1, x / attack) * Math.pow(Math.max(0, 1 - x / dur), 2);
  let seed = 1;
  const noise = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed / 2147483647) * 2 - 1;
  };

  for (const e of sfxEvents(plan)) {
    switch (e.kind) {
      case "pop":
        add(e.t, 0.07, 0.16, (x) => Math.sin(2 * Math.PI * (520 + 900 * x) * x) * env(x, 0.07));
        break;
      case "tick":
        add(e.t, 0.04, 0.1, (x) => Math.sin(2 * Math.PI * 1900 * x) * env(x, 0.04, 0.001));
        break;
      case "tap":
        add(e.t, 0.09, 0.3, (x) => Math.sin(2 * Math.PI * (190 - 600 * x) * x) * env(x, 0.09, 0.001));
        break;
      case "buzz":
        add(e.t, 0.34, 0.2, (x) => {
          const saw = 2 * ((x * 145) % 1) - 1;
          const saw2 = 2 * ((x * 152) % 1) - 1;
          return (saw + saw2) * 0.5 * env(x, 0.34, 0.006);
        });
        break;
      case "ding":
        [1046.5, 1318.5, 1568].forEach((f, i) =>
          add(e.t + i * 0.085, 0.75, 0.2, (x) =>
            (Math.sin(2 * Math.PI * f * x) + 0.3 * Math.sin(2 * Math.PI * f * 2 * x)) * env(x, 0.75, 0.003)
          )
        );
        break;
      case "whoosh": {
        let lp = 0;
        add(e.t, 0.5, 0.18, (x) => {
          const a = 0.04 + 0.5 * Math.sin(Math.PI * Math.min(1, x / 0.5));
          lp += (noise() - lp) * a;
          return lp * Math.sin(Math.PI * Math.min(1, x / 0.5));
        });
        break;
      }
    }
  }

  // Pronúncia em francês de cada palavra ao acertar a resposta
  if (pronunciations && pronunciations.size > 0) {
    plan.timings.forEach((tm, idx) => {
      const round = plan.rounds[idx];
      if (!round) return;
      const key = round.item.speak || round.item.fr;
      const pcm = pronunciations.get(key) || pronunciations.get(round.item.fr);
      if (!pcm || pcm.length === 0) return;

      // Inicia a fala 0.15s após o toque na alternativa certa (junto com o banner verde e as estrelas)
      const speechStart = tm.start + tm.correctTap + 0.15;
      const from = Math.floor(speechStart * sampleRate);
      const speechVol = 0.95;

      for (let i = 0; i < pcm.length && from + i < length; i++) {
        const fadeIn = Math.min(1, i / (0.005 * sampleRate));
        const fadeOut = Math.min(1, (pcm.length - 1 - i) / (0.01 * sampleRate));
        const envelope = fadeIn * fadeOut;
        left[from + i] += pcm[i] * speechVol * envelope;
      }
    });
  }

  // limitador suave para nunca estourar
  for (let i = 0; i < length; i++) left[i] = Math.tanh(left[i] * 1.1);
  return [left, new Float32Array(left)];
}
