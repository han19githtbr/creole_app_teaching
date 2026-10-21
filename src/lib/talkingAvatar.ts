import { SOCIAL_PLATFORMS, type SocialPlatform } from "./socialLinks";

/**
 * Avatar "falante": anima a foto Ghibli do professor direto no canvas de
 * gravação, então tudo fica gravado no vídeo exportado.
 *
 *  - boca sincronizada com a voz real do microfone (abertura + largura);
 *  - piscar natural, respiração, balanço e acenos de cabeça nas ênfases;
 *  - ícone da rede social anotada + um dedo indicador que sai de trás do
 *    avatar e aponta para ele (sem mão nem braço aparecendo).
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
  /** Fator da abertura da mandíbula (1 = normal; menor quando há mão sobre o queixo). */
  jaw?: number;
}

export const TALKING_AVATAR_FACES: Record<string, FaceMap> = {
  you_sunset: {
    src: "/avatars/you-sunset.png",
    focusY: 0.3,
    mouth: [0.6, 0.69],
    eyes: { ys: [0.455, 0.455], xs: [0.46, 0.7] },
  },
  you_studio: {
    src: "/avatars/you-studio.png",
    focusY: 0.265,
    mouth: [0.49, 0.779],
    eyes: { ys: [0.52, 0.545], xs: [0.36, 0.61] },
  },
  you_thinking: {
    src: "/avatars/you-thinking.png",
    focusY: 0.266,
    mouth: [0.58, 0.609],
    eyes: null,
    jaw: 0.4,
  },
  you_trail: {
    src: "/avatars/you-trail.png",
    focusY: 0.257,
    mouth: [0.61, 0.829],
    eyes: { ys: [0.56, 0.615], xs: [0.51, 0.72] },
  },
  you_night: {
    src: "/avatars/you-night.png",
    focusY: 0.356,
    mouth: [0.48, 0.819],
    eyes: { ys: [0.53, 0.53], xs: [0.32, 0.62] },
  },
  you_headphones: {
    src: "/avatars/you-headphones.png",
    focusY: 0.363,
    mouth: [0.6, 0.734],
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
/* Dedo que aponta                                                     */
/* ------------------------------------------------------------------ */

type HandColors = NonNullable<LoadedFace["colors"]>;

/**
 * Só um dedo indicador (sem mão nem braço). Eixo no +x: a base fica em x = 0
 * (escondida atrás do avatar) e a ponta em x = length.
 */
function drawPointingFinger(
  ctx: CanvasRenderingContext2D,
  c: HandColors,
  length: number,
  width: number
) {
  const wb = width; // largura na base
  const wt = width * 0.7; // largura na ponta
  const lw = Math.max(2, width * 0.07);

  const body = () => {
    ctx.beginPath();
    ctx.moveTo(0, -wb / 2);
    ctx.lineTo(length - wt / 2, -wt / 2);
    ctx.arc(length - wt / 2, 0, wt / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(0, wb / 2);
    ctx.closePath();
  };

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = width * 0.5;
  ctx.shadowOffsetY = width * 0.12;
  body();
  ctx.fillStyle = c.skin;
  ctx.fill();
  ctx.restore();

  // volume: sombra embaixo, luz em cima
  ctx.save();
  body();
  ctx.clip();
  const g = ctx.createLinearGradient(0, -wb / 2, 0, wb / 2);
  g.addColorStop(0, "rgba(255,255,255,0.16)");
  g.addColorStop(0.45, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(0,0,0,0.26)");
  ctx.fillStyle = g;
  ctx.fillRect(0, -wb, length + wb, wb * 2);
  ctx.restore();

  body();
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.strokeStyle = c.outline;
  ctx.stroke();

  // vincos das articulações
  ctx.strokeStyle = c.skinDark;
  ctx.lineWidth = lw * 0.8;
  ctx.lineCap = "round";
  for (const at of [0.34, 0.52]) {
    const x = length * at;
    ctx.beginPath();
    ctx.moveTo(x, -wb * 0.22);
    ctx.quadraticCurveTo(x - wb * 0.08, 0, x, wb * 0.22);
    ctx.stroke();
  }

  // unha
  ctx.beginPath();
  ctx.roundRect(length - wt * 1.45, -wt * 0.3, wt * 1.0, wt * 0.6, wt * 0.3);
  ctx.fillStyle = "rgba(255,236,224,0.5)";
  ctx.fill();
  ctx.lineWidth = lw * 0.7;
  ctx.strokeStyle = c.outline;
  ctx.stroke();
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

export class TalkingAvatarAnimator {
  private lastNow = 0;
  private mouthOpen = 0;
  private mouthWide = 0.5;
  private prevLevel = 0;
  private emphasis = 0;
  private speakEnergy = 0;

  private blinkStart = -1;
  private nextBlink = 0;

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
    this.drawFinger(ctx, f);
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
    // cartão perto do avatar (o dedo fica curto, em vez de um "palito" comprido)
    const gap = Math.min(f.canvasW * 0.04, space * 0.2);
    const cx = f.x + side * (r + gap + chipW / 2);
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
      if (face.colors) this.drawMouth(ctx, f, map, face, toX, toY);
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

  /**
   * Boca que fala de verdade: em vez de colar um desenho por cima, o lábio
   * inferior e o queixo DA PRÓPRIA FOTO descem (mandíbula), e o espaço aberto
   * entre os lábios mostra um interior escuro. O pedaço que desce tem as
   * bordas esfumadas para se fundir à pele e à barba ao redor.
   */
  private drawMouth(
    ctx: CanvasRenderingContext2D,
    f: TalkingAvatarFrame,
    map: FaceMap,
    face: LoadedFace,
    toX: (u: number) => number,
    toY: (v: number) => number
  ) {
    const colors = face.colors;
    if (!colors) return;

    const eyeDist = map.eyes ? map.eyes.xs[1] - map.eyes.xs[0] : 0.25;
    const hw = eyeDist * 0.3 * f.size * (0.9 + this.mouthWide * 0.2); // meia largura da boca
    const norm = clamp(this.mouthOpen * 1.15, 0, 1);
    // Abertura da mandíbula; boca larga ("i", "e") abre menos que a redonda ("o", "a")
    const jaw = hw * 0.55 * norm * (map.jaw ?? 1) * (1 - this.mouthWide * 0.25);
    if (jaw < 1.2) return;

    const mx = toX(map.mouth[0]);
    const my = toY(map.mouth[1]);
    const cornerX = hw * (0.85 + this.mouthWide * 0.15);

    // 1) interior da boca (por baixo do queixo que desce)
    ctx.save();
    ctx.translate(mx, my);
    const cavity = () => {
      ctx.beginPath();
      ctx.moveTo(-cornerX, 0);
      ctx.quadraticCurveTo(0, -jaw * 0.14, cornerX, 0);
      // laterais curvas (a boca afina nos cantos), não um retângulo
      ctx.quadraticCurveTo(cornerX * 1.0, jaw * 0.55, cornerX * 0.82, jaw + 2);
      ctx.lineTo(-cornerX * 0.82, jaw + 2);
      ctx.quadraticCurveTo(-cornerX * 1.0, jaw * 0.55, -cornerX, 0);
      ctx.closePath();
    };
    cavity();
    const g = ctx.createLinearGradient(0, 0, 0, jaw);
    g.addColorStop(0, "#1c0a0c");
    g.addColorStop(1, "#3a1517");
    ctx.fillStyle = g;
    ctx.fill();

    ctx.save();
    cavity();
    ctx.clip();
    // dentes de cima só aparecem como uma faixa discreta, sombreada
    if (jaw > hw * 0.28) {
      const th = Math.min(jaw * 0.26, hw * 0.14);
      const tg = ctx.createLinearGradient(0, 0, 0, th);
      tg.addColorStop(0, "rgba(206,192,172,0.8)");
      tg.addColorStop(1, "rgba(150,132,116,0.35)");
      ctx.fillStyle = tg;
      ctx.fillRect(-cornerX * 0.82, -jaw * 0.05, cornerX * 1.64, th);
    }
    // língua
    if (jaw > hw * 0.34) {
      ctx.fillStyle = "rgba(120,46,54,0.75)";
      ctx.beginPath();
      ctx.ellipse(0, jaw * 0.95, cornerX * 0.5, jaw * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // borda de lábio contornando a abertura, para não parecer um recorte
    cavity();
    ctx.strokeStyle = colors.lip;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = Math.max(1.5, hw * 0.06);
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();

    // 2) lábio inferior + queixo da foto descendo, com bordas esfumadas
    const pw = Math.ceil(cornerX * 2 * 1.5);
    const ph = Math.ceil(hw * 2.1);
    if (!this.patch) this.patch = document.createElement("canvas");
    const patch = this.patch;
    if (patch.width !== pw || patch.height !== ph) {
      patch.width = pw;
      patch.height = ph;
    }
    const pctx = patch.getContext("2d");
    if (pctx) {
      const { sx, sy, side } = cropRect(face.img, map.focusY);
      const k = side / f.size;
      const r = f.size / 2;
      pctx.globalCompositeOperation = "source-over";
      pctx.clearRect(0, 0, pw, ph);
      pctx.drawImage(face.img, sx + (mx - pw / 2 + r) * k, sy + (my + r) * k, pw * k, ph * k, 0, 0, pw, ph);

      pctx.globalCompositeOperation = "destination-in";
      const hg = pctx.createLinearGradient(0, 0, pw, 0);
      hg.addColorStop(0, "rgba(0,0,0,0)");
      hg.addColorStop(0.2, "rgba(0,0,0,1)");
      hg.addColorStop(0.8, "rgba(0,0,0,1)");
      hg.addColorStop(1, "rgba(0,0,0,0)");
      pctx.fillStyle = hg;
      pctx.fillRect(0, 0, pw, ph);
      const vg = pctx.createLinearGradient(0, 0, 0, ph);
      vg.addColorStop(0, "rgba(0,0,0,1)");
      vg.addColorStop(0.45, "rgba(0,0,0,1)");
      vg.addColorStop(1, "rgba(0,0,0,0)");
      pctx.fillStyle = vg;
      pctx.fillRect(0, 0, pw, ph);
      pctx.globalCompositeOperation = "source-over";

      ctx.drawImage(patch, mx - pw / 2, my + jaw);
    }

    // 3) acabamento: sombra sob o lábio de cima e linha do lábio de baixo
    ctx.save();
    ctx.translate(mx, my);
    ctx.lineCap = "round";
    ctx.strokeStyle = colors.lip;
    ctx.lineWidth = Math.max(1.5, hw * 0.06);
    ctx.beginPath();
    ctx.moveTo(-cornerX, 0);
    ctx.quadraticCurveTo(0, -jaw * 0.14, cornerX, 0);
    ctx.stroke();
    ctx.strokeStyle = "rgba(30,10,10,0.35)";
    ctx.lineWidth = Math.max(1, hw * 0.035);
    ctx.beginPath();
    ctx.moveTo(-cornerX * 0.9, jaw + 0.5);
    ctx.lineTo(cornerX * 0.9, jaw + 0.5);
    ctx.stroke();
    ctx.restore();
  }

  private patch: HTMLCanvasElement | null = null;

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

  /* ----- dedo que aponta ----- */

  private drawFinger(ctx: CanvasRenderingContext2D, f: TalkingAvatarFrame) {
    if (this.pointP < 0.001 || !f.badge || this.badgeAlpha < 0.6) return;
    const face = getFace(f.avatarId);
    if (!face?.colors) return;

    const side = this.chip.side;
    const r = f.size / 2;
    const iconHalf = this.chip.icon / 2;

    // alvo: parte de baixo do ícone (o texto fica acima, então o dedo não cobre o perfil)
    const target = {
      x: this.iconCenter.x - side * iconHalf * 0.1,
      y: this.iconCenter.y + iconHalf * 1.08,
    };
    // base do dedo escondida atrás do avatar, no lado do ícone
    const base = { x: f.x + side * r * 0.3, y: f.y + r * 0.85 };

    const dx = target.x - base.x;
    const dy = target.y - base.y;
    const dist = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx);

    const eased =
      this.pointP >= 1 ? 1 : f.pointing ? easeOutBack(this.pointP) : easeInOut(this.pointP);
    const bob = this.pointP >= 0.98 ? Math.sin((f.now / 1000) * 7) * r * 0.025 : 0;
    const length = Math.max(0, dist * eased + bob);

    ctx.save();
    // só aparece fora do círculo do avatar: o dedo "sai de trás" dele
    ctx.beginPath();
    ctx.rect(0, 0, f.canvasW, f.canvasH);
    ctx.arc(f.x, f.y, r + 3, 0, Math.PI * 2);
    ctx.clip("evenodd");
    ctx.translate(base.x, base.y);
    ctx.rotate(angle);
    drawPointingFinger(ctx, face.colors, length, r * 0.25);
    ctx.restore();
  }
}
