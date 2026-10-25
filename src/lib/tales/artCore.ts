/**
 * Ferramentas de desenho dos contos ilustrados: formas, gradientes, paletas do céu,
 * relevo (montanhas e colinas) e partículas. Tudo é vetor desenhado no canvas, então
 * fica nítido em qualquer resolução (tela e MP4 1080×1920).
 */

export const TAU = Math.PI * 2;
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

export type Ctx = CanvasRenderingContext2D;

/** Gerador pseudoaleatório determinístico (as cenas ficam iguais a cada quadro). */
export function rng(seed: number) {
  let s = Math.floor(seed * 9301 + 49297) % 233280 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function ell(ctx: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot, 0, TAU);
}

export function circle(ctx: Ctx, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.01, r), 0, TAU);
}

export function fillStroke(ctx: Ctx, fill: string | CanvasGradient, stroke: string | null = "rgba(30,20,10,0.35)", lw = 3) {
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}

export function vgrad(ctx: Ctx, y0: number, y1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

export function rgrad(ctx: Ctx, x: number, y: number, r0: number, r1: number, stops: [number, string][]) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

/** Traço arredondado entre dois pontos (patas, pernas, braços). */
export function limb(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w: number, color: string, outline: string | null = "rgba(30,20,10,0.35)") {
  ctx.lineCap = "round";
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = w + 5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** Curva suave passando por pontos (Catmull-Rom → Bézier). */
export function smoothPath(ctx: Ctx, pts: [number, number][], close = false) {
  const n = pts.length;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const a = i === 0 && !close ? p1 : p0;
    const d = i === n - 2 && !close ? p2 : p3;
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - a[0]) / 6,
      p1[1] + (p2[1] - a[1]) / 6,
      p2[0] - (d[0] - p1[0]) / 6,
      p2[1] - (d[1] - p1[1]) / 6,
      p2[0],
      p2[1]
    );
  }
  if (close) ctx.closePath();
}

/* ------------------------------------------------------------------ */
/* Céu                                                                 */
/* ------------------------------------------------------------------ */

export type Look = "day" | "dawn" | "sunset" | "night" | "autumn" | "winter" | "storm" | "barn";

export interface SkyPalette {
  top: string;
  mid: string;
  bottom: string;
  far: string; // montanhas distantes
  near: string; // colinas
  ground: string;
  groundDark: string;
  light: string; // cor da luz sobre os personagens
  sun?: string;
  stars?: boolean;
}

export const SKY: Record<Look, SkyPalette> = {
  day: { top: "#4c9be0", mid: "#8fcaf0", bottom: "#d9f1fb", far: "#8fb3c9", near: "#6fae5a", ground: "#7bbd5c", groundDark: "#4e9140", light: "rgba(255,244,214,0.18)", sun: "#ffd45a" },
  dawn: { top: "#4b5fa8", mid: "#e58f93", bottom: "#ffd9a0", far: "#9a8cb5", near: "#7f9f64", ground: "#8bb065", groundDark: "#58804a", light: "rgba(255,200,150,0.26)", sun: "#ffe08a" },
  sunset: { top: "#3f4a8c", mid: "#e5714f", bottom: "#ffc774", far: "#8c6a8f", near: "#6d8a4e", ground: "#7a9a55", groundDark: "#4d6b3c", light: "rgba(255,160,90,0.3)", sun: "#ffb347" },
  night: { top: "#0b1233", mid: "#1b2a5c", bottom: "#33467f", far: "#27345f", near: "#1f3a4a", ground: "#24473f", groundDark: "#16302d", light: "rgba(150,180,255,0.16)", stars: true },
  autumn: { top: "#6d9fc7", mid: "#e6b786", bottom: "#fbe3bb", far: "#a4947f", near: "#b98a45", ground: "#b79a4f", groundDark: "#8a6c34", light: "rgba(255,200,120,0.24)", sun: "#ffcf70" },
  winter: { top: "#8aa8c6", mid: "#c5d7e6", bottom: "#eef4f8", far: "#a9bccd", near: "#dfe8ef", ground: "#f2f6f9", groundDark: "#c8d6e2", light: "rgba(220,235,255,0.22)" },
  storm: { top: "#2f3a4d", mid: "#4f5d73", bottom: "#7d8ba0", far: "#566073", near: "#46604d", ground: "#4f7048", groundDark: "#33502f", light: "rgba(180,200,230,0.14)" },
  barn: { top: "#3d2c1e", mid: "#6b4a2f", bottom: "#9a7048", far: "#5a3f28", near: "#7a5636", ground: "#b58b4f", groundDark: "#8d6836", light: "rgba(255,220,150,0.25)" },
};

export function drawSky(ctx: Ctx, W: number, H: number, p: SkyPalette, t: number) {
  ctx.fillStyle = vgrad(ctx, 0, H * 0.72, [
    [0, p.top],
    [0.55, p.mid],
    [1, p.bottom],
  ]);
  ctx.fillRect(-W, -H, W * 3, H * 3);
  if (p.stars) {
    const r = rng(7);
    for (let i = 0; i < 70; i++) {
      const x = r() * W;
      const y = r() * H * 0.55;
      const tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i);
      ctx.fillStyle = `rgba(255,255,240,${0.35 + 0.6 * tw})`;
      circle(ctx, x, y, 1.5 + r() * 2.2);
      ctx.fill();
    }
  }
}

export function drawSun(ctx: Ctx, x: number, y: number, r: number, color: string, t: number) {
  const g = rgrad(ctx, x, y, r * 0.2, r * 3.4, [
    [0, "rgba(255,255,230,0.85)"],
    [0.25, "rgba(255,230,160,0.35)"],
    [1, "rgba(255,230,160,0)"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(x - r * 3.4, y - r * 3.4, r * 6.8, r * 6.8);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 0.05);
  ctx.fillStyle = "rgba(255,240,170,0.22)";
  for (let i = 0; i < 14; i++) {
    ctx.rotate(TAU / 14);
    ctx.beginPath();
    ctx.moveTo(r * 1.1, -r * 0.1);
    ctx.lineTo(r * 2.6, 0);
    ctx.lineTo(r * 1.1, r * 0.1);
    ctx.fill();
  }
  ctx.restore();
  circle(ctx, x, y, r);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawMoon(ctx: Ctx, x: number, y: number, r: number) {
  ctx.fillStyle = rgrad(ctx, x, y, r * 0.5, r * 3, [
    [0, "rgba(220,230,255,0.45)"],
    [1, "rgba(220,230,255,0)"],
  ]);
  ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  circle(ctx, x, y, r);
  ctx.fillStyle = "#f3f0dc";
  ctx.fill();
  ctx.fillStyle = "rgba(180,176,150,0.35)";
  circle(ctx, x - r * 0.3, y - r * 0.2, r * 0.22);
  ctx.fill();
  circle(ctx, x + r * 0.28, y + r * 0.25, r * 0.16);
  ctx.fill();
  circle(ctx, x + r * 0.1, y - r * 0.45, r * 0.12);
  ctx.fill();
}

export function drawCloud(ctx: Ctx, x: number, y: number, s: number, tint = "#ffffff", alpha = 0.95) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = tint;
  for (const [cx, cy, r] of [
    [0, 0, 60],
    [70, -22, 78],
    [150, -4, 64],
    [216, 8, 48],
    [90, 18, 70],
    [30, 22, 54],
  ] as const) {
    circle(ctx, cx, cy, r);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(140,170,210,0.18)";
  ctx.beginPath();
  ctx.ellipse(110, 52, 130, 22, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/** Cadeia de montanhas/colinas: soma de senos suaves, determinística por `seed`. */
export function drawRidge(ctx: Ctx, W: number, baseY: number, amp: number, seed: number, fill: string | CanvasGradient, jag = 0.5, span = 1) {
  const r = rng(seed);
  const a = [r() * 6, r() * 6, r() * 6];
  const f = [0.004 + r() * 0.002, 0.009 + r() * 0.004, 0.02 + r() * 0.01];
  ctx.beginPath();
  ctx.moveTo(-W * span, baseY + 900);
  for (let x = -W * span; x <= W * (1 + span); x += 12) {
    const y =
      baseY -
      amp * (0.55 + 0.45 * Math.sin(x * f[0] + a[0])) -
      amp * 0.35 * Math.sin(x * f[1] + a[1]) -
      amp * 0.18 * jag * Math.sin(x * f[2] + a[2]);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W * (1 + span), baseY + 900);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function drawGround(ctx: Ctx, W: number, horizon: number, p: SkyPalette, kind: "grass" | "dirt" | "snow" | "sand" | "wood", camX: number) {
  const bottom = horizon + 1100;
  const base = kind === "dirt" ? "#c9a06a" : kind === "sand" ? "#e2c88c" : kind === "wood" ? "#b58b4f" : p.ground;
  const dark = kind === "dirt" ? "#a07a47" : kind === "sand" ? "#c3a465" : kind === "wood" ? "#7f5a2c" : p.groundDark;
  ctx.fillStyle = vgrad(ctx, horizon - 30, bottom, [
    [0, base],
    [1, dark],
  ]);
  ctx.fillRect(-W, horizon - 20, W * 3, bottom - horizon + 40);
  const r = rng(11);
  ctx.lineCap = "round";
  for (let i = 0; i < 160; i++) {
    const x = ((r() * W * 3 - W - camX * 0.9) % (W * 3)) + (r() * 0);
    const y = horizon + 20 + Math.pow(r(), 1.6) * 760;
    const s = 6 + (y - horizon) * 0.05;
    ctx.strokeStyle = kind === "snow" ? "rgba(170,195,220,0.45)" : kind === "wood" ? "rgba(70,40,15,0.22)" : "rgba(30,60,20,0.18)";
    ctx.lineWidth = 2 + s * 0.12;
    if (kind === "wood") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + s * 4, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 2, y - s, x + s * 0.6, y - s * 1.4);
      ctx.stroke();
    }
  }
}
