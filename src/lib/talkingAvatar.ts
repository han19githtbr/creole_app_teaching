import { SOCIAL_PLATFORMS, type SocialPlatform } from "./socialLinks";

/**
 * Avatar "falante": anima a foto Ghibli do professor direto no canvas de
 * gravação, então tudo fica gravado no vídeo exportado.
 *
 *  - boca sincronizada com a voz real do microfone (abertura + largura);
 *  - piscar natural, respiração, balanço e acenos de cabeça nas ênfases;
 *  - gestos de mão enquanto fala (palma aberta, alternando os lados);
 *  - ícone da rede social anotada + mão que aponta para ele.
 */

/* ------------------------------------------------------------------ */
/* Tipos e utilidades                                                  */
/* ------------------------------------------------------------------ */

export interface SpeechFeatures {
  /** Nível médio do espectro (0 a 1) — o mesmo usado para detectar fala. */
  level: number;
  /** Energia nas faixas grave / média / aguda (0 a 1). */
  low: number;
  mid: number;
  high: number;
}

export const SILENT_SPEECH: SpeechFeatures = { level: 0, low: 0, mid: 0, high: 0 };

/** Converte o espectro do AnalyserNode em nível total + três faixas de voz. */
export function speechFeaturesFromSpectrum(data: Uint8Array, sampleRate: number): SpeechFeatures {
  const n = data.length;
  if (!n) return SILENT_SPEECH;
  const binHz = sampleRate / 2 / n;
  const band = (fromHz: number, toHz: number) => {
    const a = Math.max(0, Math.floor(fromHz / binHz));
    const b = Math.min(n - 1, Math.max(a, Math.ceil(toHz / binHz)));
    let sum = 0;
    for (let i = a; i <= b; i++) sum += data[i];
    return sum / ((b - a + 1) * 255);
  };
  let total = 0;
  for (let i = 0; i < n; i++) total += data[i];
  return {
    level: total / (n * 255),
    low: band(100, 700),
    mid: band(700, 2000),
    high: band(2000, 5500),
  };
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
// Suavização independente da taxa de quadros (referência: 60 fps).
const smoothing = (k: number, dt: number) => 1 - Math.pow(1 - k, dt * 60);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/* ------------------------------------------------------------------ */
/* Mapa do rosto de cada foto                                          */
/* ------------------------------------------------------------------ */

/**
 * Posições em fração (0 a 1) do QUADRADO recortado da foto — o mesmo recorte
 * "cover" usado pelo avatar circular. `eyes: null` = sem piscar (óculos).
 * `jawFree: false` = mão sobre o queixo, então a boca abre menos.
 */
interface FaceMap {
  src: string;
  focusY: number;
  mouth: [number, number];
  /** Posição de cada olho (esquerdo, direito) — a cabeça pode estar inclinada na foto. */
  eyes: { ys: [number, number]; xs: [number, number] } | null;
}

export const TALKING_AVATAR_FACES: Record<string, FaceMap> = {
  you_sunset: {
    src: "/avatars/you-sunset.png",
    focusY: 0.3,
    mouth: [0.6, 0.675],
    eyes: { ys: [0.455, 0.455], xs: [0.46, 0.7] },
  },
  you_studio: {
    src: "/avatars/you-studio.png",
    focusY: 0.265,
    mouth: [0.49, 0.765],
    eyes: { ys: [0.52, 0.545], xs: [0.36, 0.61] },
  },
  you_thinking: {
    src: "/avatars/you-thinking.png",
    focusY: 0.266,
    mouth: [0.58, 0.595],
    eyes: null,
  },
  you_trail: {
    src: "/avatars/you-trail.png",
    focusY: 0.257,
    mouth: [0.61, 0.815],
    eyes: { ys: [0.56, 0.615], xs: [0.51, 0.72] },
  },
  you_night: {
    src: "/avatars/you-night.png",
    focusY: 0.356,
    mouth: [0.48, 0.805],
    eyes: { ys: [0.53, 0.53], xs: [0.32, 0.62] },
  },
  you_headphones: {
    src: "/avatars/you-headphones.png",
    focusY: 0.363,
    mouth: [0.6, 0.72],
    eyes: { ys: [0.44, 0.49], xs: [0.46, 0.71] },
  },
};

export function isTalkingAvatar(id: string) {
  return id in TALKING_AVATAR_FACES;
}

interface LoadedFace {
  img: HTMLImageElement;
  colors: { skin: string; skinDark: string; lip: string; sleeve: string; outline: string } | null;
}

const faceCache = new Map<string, LoadedFace>();

function cropRect(img: HTMLImageElement, focusY: number) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const side = Math.min(iw, ih);
  const sx = (iw - side) / 2;
  const sy = Math.min(Math.max(focusY * ih - side / 2, 0), Math.max(ih - side, 0));
  return { sx, sy, side };
}

function sampleColor(
  img: HTMLImageElement,
  focusY: number,
  u: number,
  v: number,
  half = 0.012
): [number, number, number] {
  const { sx, sy, side } = cropRect(img, focusY);
  const probe = document.createElement("canvas");
  probe.width = 8;
  probe.height = 8;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  if (!pctx) return [150, 100, 70];
  const box = Math.max(2, half * 2 * side);
  pctx.drawImage(img, sx + u * side - box / 2, sy + v * side - box / 2, box, box, 0, 0, 8, 8);
  const px = pctx.getImageData(0, 0, 8, 8).data;
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < px.length; i += 4) {
    r += px[i];
    g += px[i + 1];
    b += px[i + 2];
  }
  const count = px.length / 4;
  return [r / count, g / count, b / count];
}

const rgb = (c: [number, number, number], mul = 1) =>
  `rgb(${Math.round(clamp(c[0] * mul, 0, 255))},${Math.round(clamp(c[1] * mul, 0, 255))},${Math.round(
    clamp(c[2] * mul, 0, 255)
  )})`;

function getFace(id: string): LoadedFace | null {
  if (typeof Image === "undefined" || typeof document === "undefined") return null;
  const map = TALKING_AVATAR_FACES[id];
  if (!map) return null;
  let entry = faceCache.get(id);
  if (!entry) {
    const img = new Image();
    img.src = map.src;
    entry = { img, colors: null };
    faceCache.set(id, entry);
  }
  if (!entry.colors && entry.img.complete && entry.img.naturalWidth > 0) {
    try {
      const eyeY = map.eyes ? (map.eyes.ys[0] + map.eyes.ys[1]) / 2 : map.mouth[1] - 0.22;
      const eyeX = map.eyes ? (map.eyes.xs[0] + map.eyes.xs[1]) / 2 : map.mouth[0];
      const skin = sampleColor(entry.img, map.focusY, eyeX, eyeY - 0.07, 0.014);
      const lip = sampleColor(entry.img, map.focusY, map.mouth[0], map.mouth[1], 0.01);
      const sleeve = sampleColor(entry.img, map.focusY, 0.18, 0.95, 0.03);
      entry.colors = {
        skin: rgb(skin),
        skinDark: rgb(skin, 0.78),
        lip: rgb(lip, 0.85),
        sleeve: rgb(sleeve),
        outline: rgb(skin, 0.3),
      };
    } catch {
      entry.colors = {
        skin: "rgb(176,112,72)",
        skinDark: "rgb(138,86,54)",
        lip: "rgb(120,66,50)",
        sleeve: "rgb(30,30,36)",
        outline: "rgb(52,30,18)",
      };
    }
  }
  return entry;
}

/* ------------------------------------------------------------------ */
/* Mãos                                                                */
/* ------------------------------------------------------------------ */

type HandColors = NonNullable<LoadedFace["colors"]>;

function paint(ctx: CanvasRenderingContext2D, fill: string, outline: string, lw: number) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.strokeStyle = outline;
  ctx.stroke();
}

/** Mão aberta (palma para o espectador), pulso na origem, dedos para -y. */
function drawOpenHand(ctx: CanvasRenderingContext2D, U: number, c: HandColors, wave: number) {
  const lw = U * 0.05;

  ctx.save();
  ctx.translate(-0.4 * U, -0.28 * U);
  ctx.rotate(-0.95 + wave * 0.12);
  ctx.beginPath();
  ctx.roundRect(-0.14 * U, -0.66 * U, 0.28 * U, 0.7 * U, 0.14 * U);
  paint(ctx, c.skin, c.outline, lw);
  ctx.restore();

  const fingers = [
    { x: -0.36, len: 0.8, rot: -0.14 },
    { x: -0.12, len: 0.96, rot: -0.04 },
    { x: 0.12, len: 0.92, rot: 0.05 },
    { x: 0.36, len: 0.72, rot: 0.15 },
  ];
  for (const f of fingers) {
    ctx.save();
    ctx.translate(f.x * U, -0.8 * U);
    ctx.rotate(f.rot + wave * 0.03);
    ctx.beginPath();
    ctx.roundRect(-0.11 * U, -f.len * U, 0.22 * U, f.len * U + 0.2 * U, 0.11 * U);
    paint(ctx, c.skin, c.outline, lw);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.roundRect(-0.5 * U, -1.0 * U, 1.0 * U, 1.08 * U, 0.3 * U);
  paint(ctx, c.skin, c.outline, lw);

  // sombra suave na base da palma
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-0.5 * U, -1.0 * U, 1.0 * U, 1.08 * U, 0.3 * U);
  ctx.clip();
  const g = ctx.createLinearGradient(0, -0.4 * U, 0, 0.08 * U);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = g;
  ctx.fillRect(-0.5 * U, -1.0 * U, 1.0 * U, 1.1 * U);
  ctx.restore();
}

/** Ponta do indicador, em coordenadas locais da mão que aponta. */
function pointTip(U: number) {
  return { x: -0.27 * U, y: -2.2 * U };
}

/** Mão fechada com o indicador esticado (para -y). */
function drawPointHand(ctx: CanvasRenderingContext2D, U: number, c: HandColors) {
  const lw = U * 0.05;

  // dedos recolhidos
  for (const x of [0.02, 0.24, 0.44]) {
    ctx.beginPath();
    ctx.roundRect((x - 0.11) * U, -1.12 * U, 0.22 * U, 0.5 * U, 0.11 * U);
    paint(ctx, c.skin, c.outline, lw);
  }

  // indicador esticado
  ctx.beginPath();
  ctx.roundRect(-0.38 * U, -2.2 * U, 0.22 * U, 1.35 * U, 0.11 * U);
  paint(ctx, c.skin, c.outline, lw);

  // palma
  ctx.beginPath();
  ctx.roundRect(-0.5 * U, -0.98 * U, 1.0 * U, 1.06 * U, 0.3 * U);
  paint(ctx, c.skin, c.outline, lw);

  // polegar sobre a palma
  ctx.save();
  ctx.translate(-0.42 * U, -0.3 * U);
  ctx.rotate(0.9);
  ctx.beginPath();
  ctx.roundRect(-0.13 * U, -0.62 * U, 0.26 * U, 0.66 * U, 0.13 * U);
  paint(ctx, c.skin, c.outline, lw);
  ctx.restore();

  // dobra entre os dedos recolhidos e a palma
  ctx.strokeStyle = c.skinDark;
  ctx.lineWidth = lw * 0.9;
  ctx.beginPath();
  ctx.moveTo(-0.05 * U, -0.72 * U);
  ctx.lineTo(0.48 * U, -0.72 * U);
  ctx.stroke();
}

/** Antebraço: manga da cor da camiseta e punho de pele, do pulso para +y. */
function drawForearm(ctx: CanvasRenderingContext2D, U: number, c: HandColors, length: number) {
  const lw = U * 0.05;
  ctx.beginPath();
  ctx.roundRect(-0.46 * U, 0.55 * U, 0.92 * U, length, 0.2 * U);
  paint(ctx, c.sleeve, "rgba(0,0,0,0.55)", lw);

  // dobras da manga
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.moveTo(-0.2 * U, 0.8 * U);
  ctx.lineTo(-0.28 * U, 1.7 * U);
  ctx.moveTo(0.22 * U, 0.9 * U);
  ctx.lineTo(0.3 * U, 1.8 * U);
  ctx.stroke();

  // punho (pele)
  ctx.beginPath();
  ctx.roundRect(-0.3 * U, -0.05 * U, 0.6 * U, 0.78 * U, 0.14 * U);
  paint(ctx, c.skin, c.outline, lw);
}

/* ------------------------------------------------------------------ */
/* Ícones de rede social                                               */
/* ------------------------------------------------------------------ */

function drawSocialIcon(ctx: CanvasRenderingContext2D, platform: SocialPlatform, cx: number, cy: number, s: number) {
  const x = cx - s / 2;
  const y = cy - s / 2;
  ctx.save();

  if (platform === "instagram") {
    const g = ctx.createRadialGradient(x + s * 0.3, y + s * 1.05, 0, x + s * 0.3, y + s * 1.05, s * 1.25);
    g.addColorStop(0, "#feda75");
    g.addColorStop(0.25, "#fa7e1e");
    g.addColorStop(0.5, "#d62976");
    g.addColorStop(0.75, "#962fbf");
    g.addColorStop(1, "#4f5bd5");
    ctx.beginPath();
    ctx.roundRect(x, y, s, s, s * 0.26);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.roundRect(x + s * 0.2, y + s * 0.2, s * 0.6, s * 0.6, s * 0.17);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + s * 0.69, y + s * 0.31, s * 0.036, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  } else if (platform === "facebook") {
    ctx.beginPath();
    ctx.arc(cx, cy, s / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#1877f2";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${s * 0.78}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("f", cx + s * 0.04, cy + s * 0.42);
  } else {
    ctx.beginPath();
    ctx.roundRect(x, y + s * 0.12, s, s * 0.76, s * 0.22);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.1, cy - s * 0.18);
    ctx.lineTo(cx + s * 0.2, cy);
    ctx.lineTo(cx - s * 0.1, cy + s * 0.18);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Animador                                                            */
/* ------------------------------------------------------------------ */

export interface SocialBadgeInput {
  platform: SocialPlatform;
  handle: string;
}

export interface TalkingAvatarFrame {
  avatarId: string;
  /** Centro e diâmetro do avatar circular. */
  x: number;
  y: number;
  size: number;
  canvasW: number;
  canvasH: number;
  features: SpeechFeatures;
  /** Date.now() do quadro. */
  now: number;
  badge: SocialBadgeInput | null;
  /** true enquanto o avatar deve apontar para o ícone. */
  pointing: boolean;
}

interface ActiveGesture {
  side: 1 | -1;
  start: number;
  duration: number;
}

export class TalkingAvatarAnimator {
  private lastNow = 0;
  private mouthOpen = 0;
  private mouthWide = 0.5;
  private prevLevel = 0;
  private emphasis = 0;
  private speakEnergy = 0;

  private blinkStart = -1;
  private nextBlink = 0;

  private gesture: ActiveGesture | null = null;
  private nextGestureAt = 0;
  private lastSide: 1 | -1 = 1;

  private pointP = 0;
  private chipActive = 0;
  private badgeAlpha = 0;

  /** Posição do ícone (reaproveitada pela mão para saber onde apontar). */
  private chip = { cx: 0, cy: 0, icon: 0, side: 1 as 1 | -1 };

  draw(ctx: CanvasRenderingContext2D, f: TalkingAvatarFrame) {
    const dt = this.tick(f);
    this.layoutChip(f);

    this.drawPerson(ctx, f);
    if (f.badge) this.drawChip(ctx, f, f.badge);
    this.drawHands(ctx, f);
    return dt;
  }

  /** Só o ícone da rede social (modo câmera real, sem avatar). */
  drawBadgeOnly(
    ctx: CanvasRenderingContext2D,
    f: Pick<TalkingAvatarFrame, "canvasW" | "canvasH" | "now" | "badge" | "pointing" | "features">
  ) {
    const full: TalkingAvatarFrame = {
      ...f,
      avatarId: "",
      x: f.canvasW * 0.3,
      y: f.canvasH * 0.5,
      size: f.canvasH * 0.7,
    };
    this.tick(full);
    const chipW = Math.min(f.canvasW * 0.2, 400);
    this.chip = {
      cx: f.canvasW - chipW / 2 - f.canvasW * 0.03,
      cy: f.canvasH * 0.2,
      icon: chipW * 0.3,
      side: 1,
    };
    if (f.badge) this.drawChip(ctx, full, f.badge, chipW);
  }

  /* ----- estado ----- */

  private tick(f: TalkingAvatarFrame) {
    const dt = this.lastNow ? clamp((f.now - this.lastNow) / 1000, 0.001, 0.1) : 1 / 60;
    this.lastNow = f.now;
    const s = f.features;

    // boca: abre rápido, fecha um pouco mais devagar
    const target = clamp((s.level - 0.025) * 7, 0, 1);
    const k = target > this.mouthOpen ? 0.6 : 0.3;
    this.mouthOpen += (target - this.mouthOpen) * smoothing(k, dt);

    // som agudo => boca larga ("i", "e"); som grave => boca arredondada ("o", "u")
    const total = s.low + s.mid + s.high + 1e-4;
    const wideTarget = clamp(((s.high + s.mid * 0.45) / total) * 1.5, 0, 1);
    this.mouthWide += (wideTarget - this.mouthWide) * smoothing(0.22, dt);

    // ênfase: subida brusca de volume => aceno de cabeça
    if (s.level - this.prevLevel > 0.05 && s.level > 0.08) this.emphasis = 1;
    this.emphasis *= Math.pow(0.9, dt * 60);
    this.prevLevel = s.level;

    this.speakEnergy += (clamp(s.level * 8, 0, 1) - this.speakEnergy) * smoothing(0.04, dt);

    // piscar
    if (!this.nextBlink) this.nextBlink = f.now + 1500;
    if (this.blinkStart < 0 && f.now >= this.nextBlink) {
      this.blinkStart = f.now;
      this.nextBlink = f.now + (Math.random() < 0.2 ? 380 : 2200 + Math.random() * 3800);
    }
    if (this.blinkStart >= 0 && f.now - this.blinkStart > 190) this.blinkStart = -1;

    // gestos de mão enquanto fala (nunca junto com o gesto de apontar)
    if (this.gesture && f.now - this.gesture.start > this.gesture.duration) {
      this.gesture = null;
      this.nextGestureAt = f.now + 2200 + Math.random() * 3800;
    }
    if (!this.gesture && !f.pointing && this.pointP < 0.05 && this.speakEnergy > 0.28) {
      if (!this.nextGestureAt) this.nextGestureAt = f.now + 1200;
      if (f.now >= this.nextGestureAt) {
        this.lastSide = this.lastSide === 1 ? -1 : 1;
        this.gesture = { side: this.lastSide, start: f.now, duration: 1500 + Math.random() * 1200 };
      }
    }
    if (f.pointing) this.gesture = null;

    // apontar / recolher
    this.pointP = clamp(this.pointP + (f.pointing ? dt / 0.8 : -dt / 0.55), 0, 1);
    this.chipActive += ((f.pointing ? 1 : 0) - this.chipActive) * smoothing(0.12, dt);
    this.badgeAlpha = clamp(this.badgeAlpha + (f.badge ? dt / 0.5 : -dt / 0.3), 0, 1);

    return dt;
  }

  private layoutChip(f: TalkingAvatarFrame) {
    const r = f.size / 2;
    const spaceRight = f.canvasW - (f.x + r);
    const spaceLeft = f.x - r;
    const side: 1 | -1 = spaceRight >= spaceLeft ? 1 : -1;
    const space = Math.max(side === 1 ? spaceRight : spaceLeft, f.canvasW * 0.18);
    const chipW = Math.min(space - f.canvasW * 0.04, 400);
    const cx = side === 1 ? f.x + r + space / 2 : f.x - r - space / 2;
    this.chip = { cx, cy: f.y - r * 0.12, icon: chipW * 0.3, side };
  }

  /* ----- pessoa ----- */

  private drawPerson(ctx: CanvasRenderingContext2D, f: TalkingAvatarFrame) {
    const map = TALKING_AVATAR_FACES[f.avatarId];
    const face = getFace(f.avatarId);
    const r = f.size / 2;
    const t = f.now / 1000;
    const sp = this.speakEnergy;
    const speaking = sp > 0.12 || this.mouthOpen > 0.08;

    ctx.save();
    ctx.translate(f.x, f.y);

    // sombra de contato
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, r * 1.12, r * 0.7, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fill();
    ctx.restore();

    // brilho pulsante enquanto fala
    if (speaking) {
      ctx.beginPath();
      ctx.arc(0, 0, r + 8 + this.mouthOpen * 22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99,102,241,0.28)";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1e1b4b";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#818cf8";
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    if (face && map && face.img.complete && face.img.naturalWidth > 0) {
      // movimento da cabeça: balanço leve, mais vivo ao falar, aceno nas ênfases
      const tilt = this.pointP * 0.022 * this.chip.side;
      const rot =
        Math.sin(t * 0.7) * 0.006 +
        Math.sin(t * 1.9 + 1.3) * 0.004 +
        sp * (Math.sin(t * 3.3) * 0.011 + Math.sin(t * 5.1 + 0.7) * 0.005) +
        tilt;
      const nodY = this.emphasis * f.size * 0.009 + sp * Math.sin(t * 4.2) * f.size * 0.0025;
      const swayX = Math.sin(t * 0.5) * f.size * 0.004;
      const breathe = Math.sin(t * 1.5) * 0.0035;
      const pivotY = r * 0.55;

      ctx.translate(swayX, nodY);
      ctx.translate(0, pivotY);
      ctx.rotate(rot);
      ctx.scale(1.06 + breathe, 1.06 + breathe);
      ctx.translate(0, -pivotY);

      const { sx, sy, side } = cropRect(face.img, map.focusY);
      ctx.drawImage(face.img, sx, sy, side, side, -r, -r, f.size, f.size);

      const toX = (u: number) => (u - 0.5) * f.size;
      const toY = (v: number) => (v - 0.5) * f.size;

      if (face.colors && map.eyes) this.drawBlink(ctx, f, map, face.colors, toX, toY, f.now);
      if (face.colors) this.drawMouth(ctx, f, map, face.colors, toX, toY);
    } else {
      ctx.fillStyle = "#334155";
      ctx.fillRect(-r, -r, f.size, f.size);
    }

    ctx.restore();
    ctx.restore();
  }

  private drawBlink(
    ctx: CanvasRenderingContext2D,
    f: TalkingAvatarFrame,
    map: FaceMap,
    colors: HandColors,
    toX: (u: number) => number,
    toY: (v: number) => number,
    now: number
  ) {
    if (!map.eyes || this.blinkStart < 0) return;
    const phase = clamp((now - this.blinkStart) / 190, 0, 1);
    const closed = Math.sin(phase * Math.PI);
    if (closed < 0.05) return;

    const eyeDist = map.eyes.xs[1] - map.eyes.xs[0];
    const halfW = eyeDist * 0.2 * f.size;
    const halfH = halfW * 0.46;
    for (let i = 0; i < 2; i++) {
      const cx = toX(map.eyes.xs[i]);
      const cy = toY(map.eyes.ys[i]);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, halfW * 1.02, halfH * 1.35, 0, 0, Math.PI * 2);
      ctx.clip();
      // pálpebra desce de cima para baixo
      const lidBottom = cy - halfH * 1.35 + closed * halfH * 2.7;
      ctx.fillStyle = colors.skinDark;
      ctx.fillRect(cx - halfW * 1.2, cy - halfH * 1.6, halfW * 2.4, lidBottom - (cy - halfH * 1.6));
      ctx.restore();

      // linha dos cílios
      ctx.strokeStyle = colors.outline;
      ctx.lineWidth = Math.max(2, halfW * 0.16);
      ctx.lineCap = "round";
      ctx.beginPath();
      const lidY = cy - halfH * 1.35 + closed * halfH * 2.7;
      ctx.moveTo(cx - halfW, lidY);
      ctx.quadraticCurveTo(cx, lidY + halfH * 0.5 * closed, cx + halfW, lidY);
      ctx.stroke();
    }
  }

  private drawMouth(
    ctx: CanvasRenderingContext2D,
    f: TalkingAvatarFrame,
    map: FaceMap,
    colors: HandColors,
    toX: (u: number) => number,
    toY: (v: number) => number
  ) {
    const open = this.mouthOpen;
    if (open < 0.07) return;

    const eyeDist = map.eyes ? map.eyes.xs[1] - map.eyes.xs[0] : 0.25;
    const hw = eyeDist * 0.3 * f.size * (0.88 + this.mouthWide * 0.22);
    // boca arredondada abre mais na vertical; boca larga fica mais fina
    const maxH = hw * (0.85 - this.mouthWide * 0.3);
    const openH = maxH * clamp(open * 1.15, 0, 1);
    const alpha = clamp((open - 0.07) * 8, 0, 1);

    const mx = toX(map.mouth[0]);
    const my = toY(map.mouth[1]);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(mx, my);

    const cornerX = hw * (0.8 + this.mouthWide * 0.2);
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(-cornerX, 0);
      ctx.quadraticCurveTo(0, -openH * 0.45, cornerX, 0);
      ctx.quadraticCurveTo(0, openH * 1.55, -cornerX, 0);
      ctx.closePath();
    };

    // interior
    path();
    const g = ctx.createLinearGradient(0, -openH * 0.3, 0, openH);
    g.addColorStop(0, "#2a0c10");
    g.addColorStop(1, "#14050a");
    ctx.fillStyle = g;
    ctx.fill();

    ctx.save();
    path();
    ctx.clip();
    if (openH > hw * 0.16) {
      // dentes de cima
      ctx.fillStyle = "rgba(232,222,206,0.9)";
      ctx.fillRect(-cornerX, -openH * 0.5, cornerX * 2, openH * 0.5 + Math.min(openH * 0.12, hw * 0.12));
      // língua
      ctx.fillStyle = "rgba(150,52,64,0.9)";
      ctx.beginPath();
      ctx.ellipse(0, openH * 0.82, cornerX * 0.55, openH * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // contorno dos lábios
    path();
    ctx.lineWidth = Math.max(2, hw * 0.08);
    ctx.lineJoin = "round";
    ctx.strokeStyle = colors.lip;
    ctx.stroke();
    ctx.restore();
  }

  /* ----- ícone da rede social ----- */

  private drawChip(
    ctx: CanvasRenderingContext2D,
    f: TalkingAvatarFrame,
    badge: SocialBadgeInput,
    forcedWidth?: number
  ) {
    const { cx, cy } = this.chip;
    const cardW = forcedWidth ?? Math.max(this.chip.icon / 0.3, 200);
    const icon = cardW * 0.3;
    const pad = cardW * 0.08;
    const label = `@${badge.handle}`;
    const cta = SOCIAL_PLATFORMS[badge.platform].cta;

    // texto cabendo na largura do cartão
    ctx.font = `bold ${cardW * 0.1}px Arial, sans-serif`;
    const natural = ctx.measureText(label).width;
    const fontPx = natural > cardW - pad * 2 ? (cardW * 0.1 * (cardW - pad * 2)) / natural : cardW * 0.1;
    const ctaPx = fontPx * 0.72;
    const cardH = pad + ctaPx * 1.15 + fontPx * 1.3 + pad * 0.5 + icon + pad;

    const t = f.now / 1000;
    const pulse = 1 + this.chipActive * Math.sin(t * 7) * 0.035;
    const scale = (0.86 + 0.14 * this.chipActive) * pulse;

    ctx.save();
    ctx.globalAlpha = this.badgeAlpha;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // anel de destaque quando a mão chega
    if (this.chipActive > 0.4 && this.pointP > 0.9) {
      for (let k = 0; k < 2; k++) {
        const ph = (t * 0.9 + k * 0.5) % 1;
        ctx.beginPath();
        ctx.arc(0, cardH / 2 - pad - icon / 2, icon * (0.62 + 0.55 * ph), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.6 * (1 - ph)})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cardW * 0.08);
    ctx.fillStyle = "rgba(10,14,30,0.78)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.stroke();

    const iconCy = cardH / 2 - pad - icon / 2;
    drawSocialIcon(ctx, badge.platform, 0, iconCy, icon);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "rgba(255,255,255,0.74)";
    ctx.font = `${ctaPx}px Arial, sans-serif`;
    const ctaY = -cardH / 2 + pad + ctaPx;
    ctx.fillText(cta, 0, ctaY);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontPx}px Arial, sans-serif`;
    ctx.fillText(label, 0, ctaY + fontPx * 1.2);
    ctx.restore();

    // posição final do ícone, em coordenadas do canvas, para a mão apontar
    this.chip.icon = icon * scale;
    this.chip.cy = cy;
    this.iconCenter = { x: cx, y: cy + iconCy * scale };
  }

  private iconCenter = { x: 0, y: 0 };

  /* ----- mãos ----- */

  private drawHands(ctx: CanvasRenderingContext2D, f: TalkingAvatarFrame) {
    const face = getFace(f.avatarId);
    if (!face?.colors) return;
    const colors = face.colors;
    const r = f.size / 2;
    const U = r * 0.26;

    if (this.pointP > 0.001 && f.badge && this.badgeAlpha > 0.6) {
      this.drawPointingArm(ctx, f, colors, U);
      return;
    }

    if (this.gesture) {
      const g = this.gesture;
      const age = (f.now - g.start) / 1000;
      const dur = g.duration / 1000;
      const inT = clamp(age / 0.45, 0, 1);
      const outT = clamp((dur - age) / 0.45, 0, 1);
      const e = easeInOut(Math.min(inT, outT));
      if (e < 0.01) return;

      const t = f.now / 1000;
      const wave = Math.sin(t * 5.2 + g.start);
      const restX = f.x + g.side * r * 0.98;
      const restY = f.y + r * 1.55;
      const upX = f.x + g.side * r * 0.9;
      const upY = f.y + r * 0.62 + Math.sin(t * 3.4) * U * 0.1;
      const hx = restX + (upX - restX) * e;
      const hy = restY + (upY - restY) * e;

      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(g.side * (0.28 + wave * 0.07));
      if (g.side === -1) ctx.scale(-1, 1);
      // sombra projetada
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = U * 0.35;
      drawForearm(ctx, U, colors, f.canvasH);
      ctx.shadowColor = "transparent";
      drawOpenHand(ctx, U, colors, wave);
      ctx.restore();
    }
  }

  private drawPointingArm(
    ctx: CanvasRenderingContext2D,
    f: TalkingAvatarFrame,
    colors: HandColors,
    U: number
  ) {
    const side = this.chip.side;
    const r = f.size / 2;
    const iconHalf = this.chip.icon / 2;

    // alvo: parte de baixo do ícone (o texto fica acima, então a mão não cobre o perfil)
    const target = {
      x: this.iconCenter.x - side * iconHalf * 0.25,
      y: this.iconCenter.y + iconHalf * 0.92,
    };
    // "ombro" fora da tela, embaixo e do lado do ícone
    const shoulder = { x: f.x + side * r * 0.75, y: f.canvasH + U * 4 };

    const dx = target.x - shoulder.x;
    const dy = target.y - shoulder.y;
    const len = Math.hypot(dx, dy) || 1;
    const dir = { x: dx / len, y: dy / len };
    // rotação que leva o "para cima" local (0,-1) até a direção do braço
    const theta = Math.atan2(dir.y, dir.x) + Math.PI / 2;

    const eased = this.pointP >= 1 || this.pointP === 0 ? this.pointP : (f.pointing ? easeOutBack(this.pointP) : easeInOut(this.pointP));
    const settle = this.pointP >= 0.98 ? Math.sin(f.now / 1000 * 7) * U * 0.09 : 0;

    const tip = pointTip(U);
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const rotTip = { x: tip.x * cos - tip.y * sin, y: tip.x * sin + tip.y * cos };

    const tipX = shoulder.x + (target.x - shoulder.x) * eased + dir.x * settle;
    const tipY = shoulder.y + (target.y - shoulder.y) * eased + dir.y * settle;
    const wristX = tipX - rotTip.x;
    const wristY = tipY - rotTip.y;

    ctx.save();
    ctx.translate(wristX, wristY);
    ctx.rotate(theta);
    ctx.shadowColor = "rgba(0,0,0,0.38)";
    ctx.shadowBlur = U * 0.4;
    drawForearm(ctx, U, colors, f.canvasH * 1.4);
    ctx.shadowColor = "transparent";
    drawPointHand(ctx, U, colors);
    ctx.restore();
  }
}
