/**
 * Personagens dos contos (vetor, vistos de lado, virados para a direita, pés na origem).
 * Cada função recebe o tempo `t` (s) e as opções de animação.
 */
import { TAU, circle, ell, fillStroke, limb, smoothPath, vgrad, clamp, type Ctx } from "./artCore";

export interface PoseOpts {
  anim?: string;
  variant?: number;
  speed?: number;
  carry?: string;
  /** progresso 0→1 da cena (para movimentos que acontecem uma vez) */
  p?: number;
}

const OUT = "rgba(40,24,12,0.38)";
const blinkAmt = (t: number, off = 0) => {
  const c = (t + off) % 3.7;
  return c < 0.15 ? Math.sin((c / 0.15) * Math.PI) : 0;
};

function eye(ctx: Ctx, x: number, y: number, r: number, t: number, off = 0, iris = "#1a1209") {
  const b = blinkAmt(t, off);
  ctx.fillStyle = "#fffdf5";
  ell(ctx, x, y, r, r * (1 - b * 0.9));
  ctx.fill();
  if (b < 0.7) {
    ctx.fillStyle = iris;
    circle(ctx, x + r * 0.2, y, r * 0.58);
    ctx.fill();
    ctx.fillStyle = "#fff";
    circle(ctx, x + r * 0.4, y - r * 0.25, r * 0.2);
    ctx.fill();
  }
}

/* ------------------------------ galinha ------------------------------ */

export function drawHen(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = o.anim === "walk" || o.anim === "run";
  const ph = t * (o.speed ?? 7);
  const peck = o.anim === "peck" ? Math.pow(Math.max(0, Math.sin(t * 5.5)), 2) : 0;
  const bob = walk ? Math.abs(Math.sin(ph)) * 5 : 0;
  const brown = o.variant === 1;
  const body = brown ? "#b8662f" : "#f8f5ee";
  const shade = brown ? "#8a4a22" : "#d6cfc0";
  const wingC = brown ? "#9a5426" : "#e7e1d3";

  ctx.translate(0, -bob);
  const l = walk ? Math.sin(ph) * 16 : 0;
  for (const [x, s] of [[-12, 1], [14, -1]] as const) {
    limb(ctx, x, -52, x + l * s, 0, 7, "#e3a22c", OUT);
    limb(ctx, x + l * s, 0, x + l * s + 15, 2, 6, "#e3a22c", OUT);
  }
  // cauda
  ctx.save();
  ctx.translate(-62, -102);
  for (const a of [-0.9, -0.55, -0.2]) {
    ctx.save();
    ctx.rotate(a);
    ell(ctx, -28, 0, 36, 13);
    fillStyle(ctx, shade);
    ctx.restore();
  }
  ctx.restore();
  // corpo
  ell(ctx, 0, -85, 72, 56, -0.12);
  fillStroke(ctx, vgrad(ctx, -140, -30, [[0, body], [1, shade]]), OUT);
  // asa
  ell(ctx, -6, -82, 42, 28, 0.25);
  fillStroke(ctx, wingC, OUT, 2);
  ctx.strokeStyle = "rgba(60,30,10,0.18)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-34 + i * 10, -76 + i * 3);
    ctx.quadraticCurveTo(-12 + i * 8, -66, 6 + i * 8, -84);
    ctx.stroke();
  }
  // pescoço e cabeça
  const hx = 62 + peck * 34;
  const hy = -128 + peck * 62;
  ell(ctx, 44 + peck * 14, -112 + peck * 28, 26, 38, 0.5 - peck * 0.6);
  fillStroke(ctx, body, null);
  circle(ctx, hx, hy, 29);
  fillStroke(ctx, body, OUT);
  // crista e barbela
  ctx.fillStyle = "#d8322b";
  for (const [dx, dy, r] of [[-8, -30, 9], [2, -35, 11], [13, -29, 8]] as const) {
    circle(ctx, hx + dx, hy + dy, r);
    ctx.fill();
  }
  ell(ctx, hx + 20, hy + 22, 7, 12, 0.2);
  ctx.fill();
  // bico
  ctx.beginPath();
  ctx.moveTo(hx + 24, hy - 5);
  ctx.lineTo(hx + 50, hy + 4);
  ctx.lineTo(hx + 24, hy + 12);
  ctx.closePath();
  fillStroke(ctx, "#f0a01c", OUT, 2);
  eye(ctx, hx + 8, hy - 6, 6, t, 0.3);
}

export function drawChick(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = o.anim === "walk" || o.anim === "run";
  const ph = t * (o.speed ?? 9);
  const hop = walk ? Math.abs(Math.sin(ph)) * 9 : o.anim === "peck" ? 0 : Math.sin(t * 3) * 1.5;
  const peck = o.anim === "peck" ? Math.pow(Math.max(0, Math.sin(t * 6)), 2) : 0;
  ctx.translate(0, -hop);
  limb(ctx, -6, -12, -6, 0, 4, "#f0a01c", OUT);
  limb(ctx, 8, -12, 8, 0, 4, "#f0a01c", OUT);
  ell(ctx, 0, -28, 27, 24);
  fillStroke(ctx, vgrad(ctx, -52, -4, [[0, "#ffe66d"], [1, "#f2c230"]]), OUT, 2);
  const hx = 16 + peck * 12;
  const hy = -50 + peck * 18;
  circle(ctx, hx, hy, 17);
  fillStroke(ctx, "#ffe66d", OUT, 2);
  ctx.beginPath();
  ctx.moveTo(hx + 13, hy);
  ctx.lineTo(hx + 27, hy + 4);
  ctx.lineTo(hx + 13, hy + 9);
  ctx.closePath();
  fillStroke(ctx, "#f08a1c", null);
  eye(ctx, hx + 4, hy - 3, 4, t, 0.8);
  ell(ctx, -6, -28, 12, 8, 0.3);
  fillStroke(ctx, "#f2c230", null);
}

/* ------------------------------ águia ------------------------------ */

function feather(ctx: Ctx, len: number, w: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(0, -w / 2);
  ctx.quadraticCurveTo(len * 0.7, -w * 0.62, len, 0);
  ctx.quadraticCurveTo(len * 0.7, w * 0.62, 0, w / 2);
  ctx.closePath();
  fillStroke(ctx, color, "rgba(30,18,8,0.45)", 2);
}

function eagleWing(ctx: Ctx, len: number, color: string, light: string) {
  // base (coberteiras) + penas primárias em leque
  const n = 8;
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.rotate(-0.18 + (i / (n - 1)) * 0.95);
    ctx.translate(len * 0.16, 0);
    feather(ctx, len * (0.92 - Math.abs(i - 2) * 0.05), len * 0.17, i % 2 ? color : light);
    ctx.restore();
  }
  ctx.save();
  ctx.rotate(0.25);
  ell(ctx, len * 0.3, 0, len * 0.34, len * 0.13);
  fillStroke(ctx, color, "rgba(30,18,8,0.45)", 2);
  ctx.restore();
}

export function drawEagle(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  if (anim === "fly" || anim === "glide" || anim === "spread") return drawEagleFront(ctx, t, o);
  const walk = anim === "walk" || anim === "peck";
  const ph = t * (o.speed ?? 7);
  const dark = "#3b2a1c";
  const mid = "#5a4129";
  const peck = anim === "peck" ? Math.pow(Math.max(0, Math.sin(t * 5)), 2) : 0;
  const lean = walk ? 0.08 + peck * 0.35 : 0.04;
  const bob = walk ? Math.abs(Math.sin(ph)) * 4 : Math.sin(t * 1.6) * 1.5;

  ctx.translate(0, -bob);
  ctx.save();
  const l = walk ? Math.sin(ph) * 16 : 0;
  for (const [x, s] of [[-10, 1], [22, -1]] as const) {
    limb(ctx, x, -84, x + l * s, 0, 15, "#f0b628", OUT);
    for (let k = -1; k <= 1; k++) limb(ctx, x + l * s, 0, x + l * s + 22 + k * 3, -k * 4 + 3, 7, "#f0b628", OUT);
  }
  ctx.translate(0, -150);
  ctx.rotate(lean);
  ctx.translate(0, 150);

  // cauda
  ctx.save();
  ctx.translate(-62, -78);
  for (const a of [1.95, 2.15, 2.35, 2.55]) {
    ctx.save();
    ctx.rotate(a);
    feather(ctx, 120, 34, "#f7f3ea");
    ctx.restore();
  }
  ctx.restore();
  // corpo
  ell(ctx, 0, -178, 84, 128, 0.1);
  fillStroke(ctx, vgrad(ctx, -310, -50, [[0, mid], [1, dark]]), OUT);
  ell(ctx, 18, -150, 44, 78, 0.12);
  ctx.fillStyle = "rgba(170,120,70,0.35)";
  ctx.fill();
  ell(ctx, 6, -92, 52, 46, 0.1);
  fillStroke(ctx, "#6b4c2e", OUT, 2);
  // asa dobrada ao longo do corpo
  ctx.save();
  ctx.translate(-14, -262);
  ctx.rotate(1.7);
  eagleWing(ctx, 190, "#3d2b1e", "#4a3624");
  ctx.restore();
  // cabeça branca
  const hx = 36 + peck * 36;
  const hy = -318 + peck * 120;
  ell(ctx, 22 + peck * 18, -285 + peck * 70, 46, 60, 0.2 + peck * 0.8);
  fillStroke(ctx, "#fdfbf6", null);
  ell(ctx, hx, hy, 52, 47, 0.1);
  fillStroke(ctx, vgrad(ctx, hy - 50, hy + 50, [[0, "#ffffff"], [1, "#e4dfd2"]]), OUT);
  ctx.beginPath();
  ctx.moveTo(hx + 34, hy - 20);
  ctx.quadraticCurveTo(hx + 100, hy - 28, hx + 92, hy + 22);
  ctx.quadraticCurveTo(hx + 84, hy + 4, hx + 56, hy + 6);
  ctx.lineTo(hx + 32, hy + 10);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, hy - 28, hy + 22, [[0, "#ffd34d"], [1, "#e69a10"]]), OUT, 3);
  const b = blinkAmt(t, 0.5);
  ctx.fillStyle = "#ffd23a";
  ell(ctx, hx + 20, hy - 12, 12, 12 * (1 - b * 0.9));
  ctx.fill();
  if (b < 0.7) {
    ctx.fillStyle = "#111";
    circle(ctx, hx + 23, hy - 12, 6.5);
    ctx.fill();
  }
  ctx.strokeStyle = "#5a4129";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(hx + 4, hy - 30);
  ctx.lineTo(hx + 34, hy - 20);
  ctx.stroke();
  ctx.restore();
}

/** Águia de frente, de asas abertas ("spread") ou batendo ("fly"/"glide"). */
function drawEagleFront(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "spread";
  const ph = t * (o.speed ?? 5.5);
  const flap = anim === "fly" ? Math.sin(ph) : anim === "glide" ? Math.sin(ph * 0.3) * 0.25 : Math.sin(t * 1.4) * 0.06;
  const wingAng = -0.3 - flap * 0.6;
  const bob = anim === "fly" ? Math.sin(ph + 1.2) * 14 : Math.sin(t * 1.5) * 3;
  const dark = "#3b2a1c";
  const mid = "#5a4129";

  ctx.translate(0, bob);
  // pernas penduradas
  if (anim !== "fly") {
    for (const x of [-22, 22]) {
      limb(ctx, x, -96, x, -24, 15, "#f0b628", OUT);
      for (let k = -1; k <= 1; k++) limb(ctx, x, -24, x + k * 16, 4, 7, "#f0b628", OUT);
    }
  } else {
    for (const x of [-18, 18]) limb(ctx, x, -100, x * 1.3, -50, 13, "#f0b628", OUT);
  }
  // cauda em leque
  ctx.save();
  ctx.translate(0, -96);
  for (const a of [1.15, 1.35, 1.57, 1.8, 2.0]) {
    ctx.save();
    ctx.rotate(a);
    feather(ctx, 120, 38, "#f7f3ea");
    ctx.restore();
  }
  ctx.restore();
  // asas (atrás do corpo)
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 50, -256);
    ctx.scale(side, 1);
    ctx.rotate(wingAng);
    eagleWing(ctx, 420, "#33231a", "#43301f");
    ctx.restore();
  }
  // corpo
  ell(ctx, 0, -190, 74, 124);
  fillStroke(ctx, vgrad(ctx, -310, -70, [[0, mid], [1, dark]]), OUT);
  ctx.strokeStyle = "rgba(190,140,90,0.45)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let r = 0; r < 5; r++) {
    for (let c = -2; c <= 2; c++) {
      ctx.beginPath();
      ctx.arc(c * 24, -230 + r * 26, 11, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }
  // cabeça branca
  ell(ctx, 0, -300, 64, 66);
  fillStroke(ctx, vgrad(ctx, -366, -234, [[0, "#ffffff"], [1, "#e4dfd2"]]), OUT);
  // bico de frente
  ctx.beginPath();
  ctx.moveTo(-22, -312);
  ctx.quadraticCurveTo(0, -336, 22, -312);
  ctx.quadraticCurveTo(28, -272, 0, -250);
  ctx.quadraticCurveTo(-28, -272, -22, -312);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -336, -250, [[0, "#ffd34d"], [1, "#e69a10"]]), OUT, 3);
  ctx.strokeStyle = "rgba(120,70,0,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -300);
  ctx.lineTo(0, -262);
  ctx.stroke();
  // olhos severos
  const b = blinkAmt(t, 0.4);
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#ffd23a";
    ell(ctx, side * 30, -326, 12, 12 * (1 - b * 0.9));
    ctx.fill();
    if (b < 0.7) {
      ctx.fillStyle = "#111";
      circle(ctx, side * 30, -326, 6.5);
      ctx.fill();
    }
    ctx.strokeStyle = "#5a4129";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(side * 10, -346);
    ctx.lineTo(side * 48, -338);
    ctx.stroke();
  }
}

/* ------------------------------ lebre ------------------------------ */

export function drawHare(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  const run = anim === "run";
  const sleep = anim === "sleep";
  const ph = t * (o.speed ?? 11);
  const g = run ? Math.sin(ph) : 0;
  const hop = run ? Math.abs(Math.sin(ph)) * 34 : 0;
  const fur = "#b9976a";
  const furD = "#8f6f47";

  if (sleep) {
    ctx.translate(0, 0);
    const br = Math.sin(t * 1.8) * 3;
    ell(ctx, 0, -48 + br * 0.3, 112, 52 + br);
    fillStroke(ctx, vgrad(ctx, -100, 0, [[0, fur], [1, furD]]), OUT);
    ell(ctx, -70, -50, 40, 36);
    fillStroke(ctx, furD, OUT, 2);
    circle(ctx, -108, -56, 22);
    fillStroke(ctx, "#fff7ea", OUT, 2);
    ell(ctx, 96, -60, 46, 34, 0.1);
    fillStroke(ctx, fur, OUT);
    ell(ctx, 80, -86, 20, 56, -1.45);
    fillStroke(ctx, fur, OUT, 2);
    ell(ctx, 52, -78, 18, 54, -1.5);
    fillStroke(ctx, furD, OUT, 2);
    ctx.strokeStyle = "#2a1a0e";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(100, -66, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();
    circle(ctx, 134, -56, 6);
    ctx.fillStyle = "#e58a8a";
    ctx.fill();
    return;
  }

  ctx.translate(0, -hop);
  ctx.rotate(run ? -g * 0.12 : 0);
  // patas
  const front = run ? 36 : 6;
  limb(ctx, 62, -62, 62 + front * (0.6 + g * 0.6), -4 + hop * 0.2, 22, furD, OUT);
  limb(ctx, 46, -62, 46 + front * (0.6 - g * 0.6), -4 + hop * 0.2, 20, fur, OUT);
  // orelhas (atrás da cabeça)
  const ear = run ? 0.5 + g * 0.15 : 0.15 + Math.sin(t * 2.2) * 0.04;
  ctx.save();
  ctx.translate(96, -150);
  ctx.rotate(-ear - 0.15);
  ell(ctx, -26, -64, 24, 78, -0.1);
  fillStroke(ctx, furD, OUT);
  ctx.restore();
  // corpo + anca
  ell(ctx, 0, -92, 98, 58);
  fillStroke(ctx, vgrad(ctx, -150, -30, [[0, fur], [1, furD]]), OUT);
  ell(ctx, 14, -70, 62, 30);
  ctx.fillStyle = "#f6ead2";
  ctx.fill();
  // pata traseira longa
  const back = run ? 54 : 18;
  ell(ctx, -52, -78, 52, 50);
  fillStroke(ctx, fur, OUT, 2);
  ell(ctx, -52 - back * (0.2 - g * 0.5), -16, 54, 15, 0.0);
  fillStroke(ctx, furD, OUT, 2);
  circle(ctx, -96, -108, 24);
  fillStroke(ctx, "#fff8ec", OUT, 2);
  // cabeça
  ell(ctx, 104, -128, 46, 38, -0.2);
  fillStroke(ctx, fur, OUT);
  ell(ctx, 130, -118, 22, 17, -0.2);
  fillStroke(ctx, "#fff0dc", null);
  circle(ctx, 148, -126, 7);
  ctx.fillStyle = "#e07a86";
  ctx.fill();
  // orelha da frente
  ctx.save();
  ctx.translate(88, -150);
  ctx.rotate(-ear + 0.1);
  ell(ctx, -22, -66, 22, 80, -0.05);
  fillStroke(ctx, fur, OUT);
  ell(ctx, -22, -62, 10, 58, -0.05);
  ctx.fillStyle = "#e7a5a0";
  ctx.fill();
  ctx.restore();
  eye(ctx, 116, -138, 8, t, 0.2);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2;
  for (const dy of [-2, 5]) {
    ctx.beginPath();
    ctx.moveTo(138, -116 + dy);
    ctx.lineTo(176, -122 + dy * 2);
    ctx.stroke();
  }
}

/* ------------------------------ tartaruga ------------------------------ */

export function drawTortoise(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = (o.anim ?? "walk") === "walk";
  const ph = t * (o.speed ?? 2.2);
  const bob = walk ? Math.sin(ph * 2) * 2.5 : 0;
  const headBob = walk ? Math.sin(ph) * 6 : Math.sin(t * 1.5) * 2;
  const legs = [-76, -32, 40, 84];
  ctx.translate(0, -bob);
  legs.forEach((x, i) => {
    const sw = walk ? Math.sin(ph + (i % 2) * Math.PI) * 12 : 0;
    ell(ctx, x + sw, -14, 20, 24);
    fillStroke(ctx, i % 2 ? "#7a9a52" : "#8aaa5c", OUT, 2);
  });
  // cabeça
  ell(ctx, 134 + headBob, -66 + Math.sin(ph) * 2, 36, 29, -0.1);
  fillStroke(ctx, "#8fb060", OUT);
  eye(ctx, 148 + headBob, -74, 7, t, 1.1);
  ctx.strokeStyle = "#3a4a22";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(152 + headBob, -60, 10, 0.2, 1.8);
  ctx.stroke();
  // casco
  ctx.beginPath();
  ctx.ellipse(0, -44, 124, 86, 0, Math.PI, 0);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -130, -40, [[0, "#6fa34a"], [1, "#3e6b2c"]]), OUT);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.strokeStyle = "rgba(25,50,15,0.45)";
  ctx.lineWidth = 3;
  for (const [cx, cy, rx, ry] of [[0, -92, 40, 30], [-62, -64, 36, 28], [62, -64, 36, 28], [-96, -44, 26, 22], [96, -44, 26, 22], [0, -44, 38, 24]] as const) {
    ell(ctx, cx, cy, rx, ry);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
  ell(ctx, 0, -40, 128, 16);
  fillStroke(ctx, "#d6b873", OUT, 2);
}

/* ------------------------------ raposa ------------------------------ */

export function drawFox(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = o.anim === "walk";
  const ph = t * (o.speed ?? 6);
  const sway = Math.sin(t * 2.2);
  const orange = "#e2762d";
  const orangeD = "#b9531a";
  const l = walk ? Math.sin(ph) * 20 : 0;
  ctx.translate(0, walk ? -Math.abs(Math.sin(ph)) * 4 : 0);
  // cauda
  ctx.save();
  ctx.translate(-96, -124);
  ctx.rotate(0.3 + sway * 0.09);
  smoothPath(ctx, [[0, 0], [-60, -48], [-150, -34], [-170, 22], [-110, 52], [-40, 36], [0, 18]], true);
  fillStroke(ctx, vgrad(ctx, -50, 55, [[0, orange], [1, orangeD]]), OUT);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#fff6ea";
  ctx.beginPath();
  ctx.ellipse(-160, 10, 54, 60, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
  ctx.restore();
  // patas
  for (const [x, s, c] of [[-70, 1, orangeD], [-34, -1, orange], [52, -1, orangeD], [86, 1, orange]] as const) {
    limb(ctx, x, -76, x + l * s * 0.8, -6, 20, "#3a2416", OUT);
    limb(ctx, x, -76, x + l * s * 0.4, -52, 24, c, null);
  }
  // corpo
  ell(ctx, 0, -118, 112, 58, -0.03);
  fillStroke(ctx, vgrad(ctx, -178, -60, [[0, orange], [1, orangeD]]), OUT);
  ell(ctx, 42, -96, 60, 30, 0.1);
  ctx.fillStyle = "#fff4e4";
  ctx.fill();
  // cabeça
  ctx.save();
  ctx.translate(112, -170);
  ctx.rotate(-0.06 + Math.sin(t * 1.3) * 0.03);
  // orelhas
  for (const [x, ang] of [[-6, -0.3], [20, 0.1]] as const) {
    ctx.save();
    ctx.translate(x, -28);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(-18, 6);
    ctx.lineTo(2, -52);
    ctx.lineTo(22, 6);
    ctx.closePath();
    fillStroke(ctx, orange, OUT, 2);
    ctx.beginPath();
    ctx.moveTo(-8, 2);
    ctx.lineTo(2, -34);
    ctx.lineTo(12, 2);
    ctx.closePath();
    ctx.fillStyle = "#2f1c10";
    ctx.fill();
    ctx.restore();
  }
  ell(ctx, 0, 0, 52, 42);
  fillStroke(ctx, orange, OUT);
  // focinho
  ctx.beginPath();
  ctx.moveTo(14, -14);
  ctx.quadraticCurveTo(76, -6, 92, 14);
  ctx.quadraticCurveTo(60, 38, 8, 30);
  ctx.closePath();
  fillStroke(ctx, "#fff4e4", OUT, 2);
  circle(ctx, 92, 12, 9);
  ctx.fillStyle = "#1c1109";
  ctx.fill();
  // olho matreiro
  ctx.fillStyle = "#fff0a8";
  ctx.beginPath();
  ctx.ellipse(26, -14, 11, 7, -0.25, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#1c1109";
  ctx.beginPath();
  ctx.ellipse(28, -14, 3.4, 6, -0.25, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#3a2416";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(10, -30);
  ctx.lineTo(40, -22);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(52, 22, 16, 0.2, 1.1);
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

/* ------------------------------ corvo ------------------------------ */

export function drawCrow(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  const flap = anim === "fly";
  const caw = anim === "caw";
  const open = caw ? 0.4 + 0.6 * Math.max(0, Math.sin(t * 7)) : 0;
  const ph = t * 12;
  ctx.translate(0, flap ? -Math.abs(Math.sin(ph)) * 14 : 0);
  const black = "#1b1f2b";
  const sheen = "#3d4a6d";
  // pernas
  limb(ctx, -8, -34, -8, 0, 8, "#4a3a2a", OUT);
  limb(ctx, 16, -34, 16, 0, 8, "#4a3a2a", OUT);
  // cauda
  ctx.save();
  ctx.translate(-40, -50);
  ctx.rotate(2.5);
  feather(ctx, 98, 34, black);
  ctx.restore();
  // corpo
  ell(ctx, 0, -86, 48, 62, 0.35);
  fillStroke(ctx, vgrad(ctx, -150, -20, [[0, sheen], [0.5, black], [1, "#0e1018"]]), "rgba(0,0,0,0.5)");
  // asa
  ctx.save();
  ctx.translate(-6, -100);
  ctx.rotate(flap ? -0.6 + Math.sin(ph) * 0.8 : 0.5);
  ell(ctx, -20, 20, 26, 62, 0.15);
  fillStroke(ctx, "#232838", "rgba(0,0,0,0.5)", 2);
  ctx.restore();
  // cabeça
  circle(ctx, 40, -138, 32);
  fillStroke(ctx, vgrad(ctx, -170, -106, [[0, sheen], [1, black]]), "rgba(0,0,0,0.5)");
  // bico
  ctx.save();
  ctx.translate(62, -138);
  ctx.rotate(-open * 0.2);
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(54, -2);
  ctx.lineTo(0, 2);
  ctx.closePath();
  fillStroke(ctx, "#5d6270", "rgba(0,0,0,0.5)", 2);
  ctx.restore();
  ctx.save();
  ctx.translate(62, -134);
  ctx.rotate(open * 0.35);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(46, 4);
  ctx.lineTo(0, 12);
  ctx.closePath();
  fillStroke(ctx, "#4a4f5c", "rgba(0,0,0,0.5)", 2);
  ctx.restore();
  if (o.carry === "cheese" && !caw) {
    ctx.save();
    ctx.translate(86, -136);
    drawCheese(ctx, 0.7);
    ctx.restore();
  }
  ctx.fillStyle = "#fff";
  circle(ctx, 48, -146, 8);
  ctx.fill();
  ctx.fillStyle = "#111";
  circle(ctx, 50, -146, 4.4);
  ctx.fill();
}

export function drawCheese(ctx: Ctx, s = 1) {
  ctx.save();
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-36, 10);
  ctx.lineTo(34, -10);
  ctx.lineTo(34, 20);
  ctx.lineTo(-36, 28);
  ctx.closePath();
  fillStroke(ctx, "#f6c53b", "rgba(120,80,0,0.5)", 3);
  ctx.beginPath();
  ctx.moveTo(-36, 10);
  ctx.lineTo(34, -10);
  ctx.lineTo(40, -4);
  ctx.lineTo(-30, 16);
  ctx.closePath();
  fillStroke(ctx, "#ffe07a", "rgba(120,80,0,0.4)", 2);
  ctx.fillStyle = "#e0a826";
  for (const [x, y, r] of [[-8, 18, 6], [14, 10, 5], [-22, 20, 4]] as const) {
    circle(ctx, x, y, r);
    ctx.fill();
  }
  ctx.restore();
}

/* ------------------------------ formiga ------------------------------ */

export function drawAnt(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = (o.anim ?? "walk") !== "idle";
  const ph = t * (o.speed ?? 9);
  const c = "#6b2e1e";
  const cl = "#8e4630";
  ctx.translate(0, walk ? -Math.abs(Math.sin(ph)) * 2 : 0);
  // pernas
  for (let i = 0; i < 3; i++) {
    const x = -8 + i * 22;
    const s = walk ? Math.sin(ph + i * 2.1) * 12 : 0;
    limb(ctx, x, -34, x + s - 12, 0, 5, c, null);
    limb(ctx, x, -34, x - s + 14, 0, 5, c, null);
  }
  // abdômen, tórax, cabeça
  ell(ctx, -52, -44, 50, 36, -0.1);
  fillStroke(ctx, vgrad(ctx, -90, -8, [[0, cl], [1, c]]), OUT, 2);
  ell(ctx, 10, -48, 26, 22);
  fillStroke(ctx, cl, OUT, 2);
  circle(ctx, 56, -56, 26);
  fillStroke(ctx, vgrad(ctx, -84, -30, [[0, cl], [1, c]]), OUT, 2);
  eye(ctx, 66, -62, 7, t, 0.4);
  ctx.strokeStyle = c;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(70, -76);
    ctx.quadraticCurveTo(92 + s * 8, -104 + Math.sin(t * 5 + s) * 4, 108 + s * 14, -96);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(76, -48, 9, 0.3, 1.5);
  ctx.stroke();
  if (o.carry === "grain") {
    ctx.save();
    ctx.translate(14, -92);
    ell(ctx, 0, 0, 34, 20, -0.2);
    fillStroke(ctx, "#f0cf5a", "rgba(120,90,0,0.5)", 2);
    ctx.strokeStyle = "rgba(140,100,0,0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-24, 6);
    ctx.quadraticCurveTo(0, -8, 26, -6);
    ctx.stroke();
    ctx.restore();
  }
}

/* ------------------------------ cigarra ------------------------------ */

export function drawCicada(ctx: Ctx, t: number, o: PoseOpts) {
  const sing = (o.anim ?? "sing") === "sing";
  const sleep = o.anim === "sleep";
  const vib = sing ? Math.sin(t * 40) * 0.06 : Math.sin(t * 2) * 0.02;
  const bounce = sing ? Math.abs(Math.sin(t * 4.5)) * 6 : 0;
  ctx.translate(0, -bounce);
  limb(ctx, -10, -40, -12, 0, 6, "#4d6a1f", OUT);
  limb(ctx, 14, -40, 16, 0, 6, "#4d6a1f", OUT);
  // asas translúcidas
  for (const [a, al] of [[-1.15 + vib, 0.55], [-0.85 - vib, 0.4]] as const) {
    ctx.save();
    ctx.translate(-4, -96);
    ctx.rotate(a);
    ell(ctx, -80, 0, 86, 24);
    ctx.fillStyle = `rgba(230,245,230,${al})`;
    ctx.fill();
    ctx.strokeStyle = "rgba(90,130,70,0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(-150, -4);
    ctx.moveTo(-40, 0);
    ctx.lineTo(-120, 12);
    ctx.stroke();
    ctx.restore();
  }
  ell(ctx, 0, -66, 36, 56, 0.1);
  fillStroke(ctx, vgrad(ctx, -124, -10, [[0, "#9fcf3c"], [1, "#5f8f22"]]), OUT);
  ctx.fillStyle = "rgba(20,40,10,0.28)";
  for (let i = 0; i < 4; i++) {
    ell(ctx, 0, -48 + i * 10, 30 - i * 3, 2.6);
    ctx.fill();
  }
  circle(ctx, 18, -128, 28);
  fillStroke(ctx, "#a8d63f", OUT);
  ctx.fillStyle = "#c62d2d";
  circle(ctx, 30, -136, 10);
  ctx.fill();
  ctx.fillStyle = "#111";
  circle(ctx, 33, -136, 4.4);
  ctx.fill();
  // boca cantando
  ctx.fillStyle = "#3a1414";
  ell(ctx, 36, -112, 8, sing ? 6 + Math.abs(Math.sin(t * 6)) * 5 : 3);
  ctx.fill();
  if (sleep) {
    ctx.strokeStyle = "#1a2a0a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, -136, 8, 0.1, Math.PI - 0.1);
    ctx.stroke();
  }
}

/* ------------------------------ pessoa ------------------------------ */

export function drawPerson(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  const walk = anim === "walk";
  const wave = anim === "wave";
  const ph = t * (o.speed ?? 5);
  const v = o.variant ?? 0;
  const shirt = ["#6b7f94", "#3f6f8c", "#a8553a"][v % 3];
  const pants = ["#2f4a73", "#3a3a4a", "#4a3a2a"][v % 3];
  const hat = ["straw", "cap", "none"][v % 3];
  const skin = "#e8b48a";
  const breathe = Math.sin(t * 2) * 2;
  const s = walk ? Math.sin(ph) * 28 : 0;
  ctx.translate(0, walk ? -Math.abs(Math.sin(ph)) * 5 : 0);
  // pernas
  limb(ctx, -14, -160, -14 + s, -8, 34, pants, OUT);
  limb(ctx, 16, -160, 16 - s, -8, 34, pants, OUT);
  ell(ctx, -14 + s + 12, -6, 26, 12);
  fillStroke(ctx, "#3a2a1c", OUT, 2);
  ell(ctx, 16 - s + 12, -6, 26, 12);
  fillStroke(ctx, "#3a2a1c", OUT, 2);
  // braço de trás
  limb(ctx, -4, -280 + breathe, -4 - s * 0.7, -190, 26, shirt, OUT);
  // tronco
  ctx.beginPath();
  ctx.moveTo(-42, -300 + breathe);
  ctx.quadraticCurveTo(-52, -220, -38, -150);
  ctx.lineTo(40, -150);
  ctx.quadraticCurveTo(52, -220, 38, -300 + breathe);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -300, -150, [[0, shirt], [1, pants]]), OUT);
  if (v === 0) {
    ctx.beginPath();
    ctx.moveTo(-26, -260);
    ctx.lineTo(26, -260);
    ctx.lineTo(34, -150);
    ctx.lineTo(-34, -150);
    ctx.closePath();
    fillStroke(ctx, pants, null);
  }
  // braço da frente
  if (wave) {
    limb(ctx, 6, -282 + breathe, 66, -350, 26, shirt, OUT);
    limb(ctx, 66, -350, 88 + Math.sin(t * 8) * 16, -420, 24, shirt, OUT);
    circle(ctx, 90 + Math.sin(t * 8) * 18, -430, 17);
    fillStroke(ctx, skin, OUT, 2);
  } else {
    limb(ctx, 6, -282 + breathe, 6 + s * 0.7, -190, 26, shirt, OUT);
    circle(ctx, 6 + s * 0.7, -178, 15);
    fillStroke(ctx, skin, OUT, 2);
  }
  // pescoço e cabeça
  limb(ctx, 0, -306 + breathe, 0, -326 + breathe, 22, skin, null);
  ctx.save();
  ctx.translate(0, breathe);
  ell(ctx, 4, -360, 36, 42);
  fillStroke(ctx, vgrad(ctx, -402, -318, [[0, "#f3c39b"], [1, skin]]), OUT);
  eye(ctx, 18, -364, 5.5, t, 0.9);
  ctx.strokeStyle = "#3a2416";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(6, -378);
  ctx.lineTo(26, -376);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(14, -346, 10, 0.2, 1.3);
  ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = "#6b4a2a";
    ell(ctx, 14, -346, 16, 6);
    ctx.fill();
  }
  circle(ctx, 40, -354, 6);
  ctx.fillStyle = "#e8a37a";
  ctx.fill();
  if (hat === "straw") {
    ell(ctx, 2, -390, 66, 14);
    fillStroke(ctx, "#d9b45a", OUT, 2);
    ctx.beginPath();
    ctx.ellipse(2, -396, 38, 30, 0, Math.PI, 0);
    fillStroke(ctx, "#e8c870", OUT, 2);
    ctx.fillStyle = "#a8542f";
    ctx.fillRect(-34, -396, 72, 8);
  } else if (hat === "cap") {
    ctx.beginPath();
    ctx.ellipse(2, -392, 38, 26, 0, Math.PI, 0);
    fillStroke(ctx, "#2f5f8a", OUT, 2);
    ell(ctx, 40, -390, 22, 6);
    fillStroke(ctx, "#244a6b", OUT, 2);
  } else {
    ctx.beginPath();
    ctx.ellipse(0, -378, 40, 36, 0, Math.PI * 1.02, Math.PI * 1.98);
    ctx.fillStyle = "#4a3022";
    ctx.fill();
  }
  ctx.restore();
}

function fillStyle(ctx: Ctx, color: string) {
  fillStroke(ctx, color, OUT, 2);
}

export const ACTORS: Record<string, (ctx: Ctx, t: number, o: PoseOpts) => void> = {
  hen: drawHen,
  chick: drawChick,
  eagle: drawEagle,
  hare: drawHare,
  tortoise: drawTortoise,
  fox: drawFox,
  crow: drawCrow,
  ant: drawAnt,
  cicada: drawCicada,
  person: drawPerson,
  cheese: (ctx) => drawCheese(ctx, 1.5),
};

export { clamp };
