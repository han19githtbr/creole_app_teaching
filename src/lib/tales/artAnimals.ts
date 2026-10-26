/**
 * Personagens dos contos (vetor, vistos de lado, virados para a direita, pés na origem).
 * Cada função recebe o tempo `t` (s) e as opções de animação.
 */
import { TAU, circle, ell, fillStroke, limb, smoothPath, vgrad, rgrad, clamp, type Ctx } from "./artCore";

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

/* ------------------------------ Sistema de Personagens Realistas ------------------------------ */

export interface RealisticHumanConfig {
  gender: "male" | "female";
  skinBase: string;
  skinShadow: string;
  skinHighlight: string;
  hairColor: string;
  hairHighlight: string;
  hairStyle: "farmer_cap" | "sage_long" | "paulo_teen" | "paulo_adult" | "marcos" | "pedro" | "sabrina";
  hasStubble?: boolean;
  hasBeard?: boolean;
  shirtColor: string;
  shirtShadow: string;
  pantsColor: string;
  pantsShadow: string;
  shoeColor: string;
  shoeType: "boot" | "sneaker" | "oxford" | "flat";
  eyeColor?: string;
  accessories?: "suspenders" | "watch" | "tie" | "necklace" | "apron";
}

export function drawRealisticHuman(ctx: Ctx, t: number, o: PoseOpts, cfg: RealisticHumanConfig) {
  const anim = o.anim ?? "idle";
  const walk = anim === "walk";
  const wave = anim === "wave";
  const talk = anim === "talk";
  const sad = anim === "sad";
  const shock = anim === "shock";
  const point = anim === "point";
  const work = anim === "work";
  const dropStone = anim === "drop_stone";
  const carryTank = anim === "carry_tank";

  const ph = t * (o.speed ?? 4.8);
  const breathe = Math.sin(t * 1.8) * 2.2;
  const bob = walk ? Math.abs(Math.sin(ph)) * 6.5 : 0;
  const legSwing = walk ? Math.sin(ph) * 24 : 0;
  const armSwing = walk ? Math.sin(ph) * 20 : 0;

  ctx.save();
  ctx.translate(0, -bob);

  // 1. PERNA DE TRÁS
  ctx.save();
  const backLegX = -14 - legSwing;
  ctx.translate(backLegX, -160);
  limb(ctx, 0, 0, backLegX * 0.4, 80, 28, cfg.pantsShadow, OUT);
  limb(ctx, backLegX * 0.4, 80, backLegX * 0.6, 150, 24, cfg.pantsShadow, OUT);
  // Sapato de trás
  ctx.translate(backLegX * 0.6, 150);
  if (cfg.shoeType === "sneaker") {
    ell(ctx, 10, 8, 24, 11);
    fillStroke(ctx, cfg.shoeColor, OUT, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-2, 14, 26, 5); // sola branca
  } else if (cfg.shoeType === "oxford") {
    ell(ctx, 12, 8, 25, 10);
    fillStroke(ctx, cfg.shoeColor, OUT, 2);
    ctx.fillStyle = "#ffffff";
    circle(ctx, 16, 5, 2); // brilho de sapato de verniz
    ctx.fill();
  } else {
    ell(ctx, 10, 8, 25, 13);
    fillStroke(ctx, cfg.shoeColor, OUT, 2);
  }
  ctx.restore();

  // 2. BRAÇO DE TRÁS
  ctx.save();
  const backArmY = -280 + breathe;
  if (carryTank) {
    limb(ctx, -10, backArmY, 35, -220, 22, cfg.shirtShadow, OUT);
    limb(ctx, 35, -220, 70, -210, 18, cfg.skinShadow, OUT);
  } else if (work) {
    limb(ctx, -10, backArmY, 20, -220, 22, cfg.shirtShadow, OUT);
    limb(ctx, 20, -220, 45, -190, 18, cfg.skinShadow, OUT);
  } else {
    const swingB = walk ? -armSwing : sad ? 5 : 0;
    limb(ctx, -8, backArmY, -8 + swingB, -190, 22, cfg.shirtShadow, OUT);
    circle(ctx, -8 + swingB, -180, 12);
    fillStroke(ctx, cfg.skinShadow, OUT, 1.5);
  }
  ctx.restore();

  // 3. TRONCO E VESTIMENTA (ANATOMIA REALISTA COM DOBRAS E GRADIENTES)
  ctx.save();
  // Tronco
  ctx.beginPath();
  ctx.moveTo(-38, -300 + breathe);
  ctx.quadraticCurveTo(-46, -225, -34, -155);
  ctx.lineTo(36, -155);
  ctx.quadraticCurveTo(48, -225, 36, -300 + breathe);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -300, -155, [[0, cfg.shirtColor], [1, cfg.shirtShadow]]), OUT, 2);

  // Dobras de tecido no peito e cintura
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-20, -240 + breathe);
  ctx.quadraticCurveTo(0, -230 + breathe, 22, -242 + breathe);
  ctx.stroke();

  // Acessórios de tronco: suspensórios, gravata, colar, avental
  if (cfg.accessories === "suspenders") {
    ctx.fillStyle = "#2c221a";
    ctx.fillRect(-24, -295 + breathe, 8, 140);
    ctx.fillRect(16, -295 + breathe, 8, 140);
  } else if (cfg.accessories === "tie") {
    // Gravata de seda
    ctx.fillStyle = "#7a1a28";
    ctx.beginPath();
    ctx.moveTo(10, -305 + breathe);
    ctx.lineTo(24, -305 + breathe);
    ctx.lineTo(22, -210 + breathe);
    ctx.lineTo(17, -195 + breathe);
    ctx.lineTo(12, -210 + breathe);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (cfg.accessories === "necklace") {
    // Delicado colar de ouro
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(10, -295 + breathe, 16, 0.2, Math.PI - 0.2);
    ctx.stroke();
    circle(ctx, 10, -278 + breathe, 3);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
  } else if (cfg.accessories === "apron") {
    // Avental de chef da Sabrina
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(-26, -250 + breathe);
    ctx.lineTo(26, -250 + breathe);
    ctx.lineTo(32, -155);
    ctx.lineTo(-32, -155);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(100,100,100,0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Cinto / cós da calça
  ctx.fillStyle = "#1e1610";
  ctx.fillRect(-34, -162, 70, 9);
  ctx.fillStyle = "#d4af37";
  ctx.fillRect(-4, -163, 10, 11); // fivela metálica
  ctx.restore();

  // 4. PERNA DA FRENTE
  ctx.save();
  const frontLegX = 14 + legSwing;
  ctx.translate(frontLegX, -160);
  limb(ctx, 0, 0, frontLegX * 0.4, 80, 30, cfg.pantsColor, OUT);
  limb(ctx, frontLegX * 0.4, 80, frontLegX * 0.6, 150, 26, cfg.pantsColor, OUT);

  // Sapato da frente
  ctx.translate(frontLegX * 0.6, 150);
  if (cfg.shoeType === "sneaker") {
    // Tênis moderno com sola branca e detalhes
    ell(ctx, 12, 8, 26, 12);
    fillStroke(ctx, cfg.shoeColor, OUT, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-4, 13, 32, 6);
    // Linha de cadarço
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 2);
    ctx.lineTo(16, 5);
    ctx.stroke();
  } else if (cfg.shoeType === "oxford") {
    // Sapato social de verniz brilhante
    ell(ctx, 14, 8, 27, 11);
    fillStroke(ctx, cfg.shoeColor, OUT, 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    circle(ctx, 18, 5, 2.5);
    ctx.fill();
    // Salto
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(-2, 14, 12, 5);
  } else if (cfg.shoeType === "flat") {
    // Sapatilha feminina elegante
    ell(ctx, 12, 7, 24, 9);
    fillStroke(ctx, cfg.shoeColor, OUT, 2);
  } else {
    // Bota de couro resistente (mecânico/fazendeiro)
    ell(ctx, 12, 8, 27, 14);
    fillStroke(ctx, cfg.shoeColor, OUT, 2);
    ctx.fillStyle = "#0c0805";
    ctx.fillRect(-4, 15, 34, 6); // sola de borracha pesada
  }
  ctx.restore();

  // 5. BRAÇO DA FRENTE COM ARTICULAÇÃO DINÂMICA
  ctx.save();
  const armY = -282 + breathe;
  if (wave) {
    // Acenando alegremente
    const waveHand = Math.sin(t * 8) * 16;
    limb(ctx, 8, armY, 60, -350, 24, cfg.shirtColor, OUT);
    limb(ctx, 60, -350, 84 + waveHand, -420, 22, cfg.shirtColor, OUT);
    circle(ctx, 86 + waveHand, -432, 15);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  } else if (point) {
    // Apontando confiantemente para a frente (Marcos mostrando o carro)
    limb(ctx, 8, armY, 75, -270, 24, cfg.shirtColor, OUT);
    limb(ctx, 75, -270, 140, -260, 22, cfg.skinBase, OUT);
    circle(ctx, 145, -260, 13);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  } else if (shock) {
    // Chocado, mãos próximas ao rosto / peito
    limb(ctx, 8, armY, 40, -330, 24, cfg.shirtColor, OUT);
    limb(ctx, 40, -330, 50, -370, 20, cfg.skinBase, OUT);
    circle(ctx, 52, -376, 14);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  } else if (talk) {
    // Gesticulando enquanto fala
    const gesture = Math.sin(t * 4) * 8;
    limb(ctx, 8, armY, 55, -270, 24, cfg.shirtColor, OUT);
    limb(ctx, 55, -270, 85 + gesture, -300, 20, cfg.skinBase, OUT);
    circle(ctx, 90 + gesture, -305, 14);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  } else if (dropStone) {
    // Sabrina soltando a pedra com tristeza no aquário
    limb(ctx, 8, armY, 55, -280, 22, cfg.shirtColor, OUT);
    limb(ctx, 55, -280, 95, -260, 18, cfg.skinBase, OUT);
    // Mão segurando/soltando a pedra
    circle(ctx, 100, -258, 13);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
    // Pedra escura caindo
    ctx.fillStyle = "#2d333b";
    ell(ctx, 104, -242, 10, 8, 0.3);
    ctx.fill();
    ctx.strokeStyle = "#1b1f24";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (carryTank) {
    // Carregando o aquário nos braços
    limb(ctx, 8, armY, 55, -230, 22, cfg.shirtColor, OUT);
    limb(ctx, 55, -230, 90, -225, 18, cfg.skinBase, OUT);
    circle(ctx, 94, -225, 13);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  } else if (work) {
    // Trabalhando/digitando
    limb(ctx, 8, armY, 35, -220, 24, cfg.shirtColor, OUT);
    limb(ctx, 35, -220, 65, -195, 20, cfg.skinBase, OUT);
    circle(ctx, 70, -195, 13);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  } else if (sad) {
    // Triste / derrotado, braço caído
    limb(ctx, 8, armY, 14, -185, 24, cfg.shirtColor, OUT);
    circle(ctx, 16, -170, 14);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  } else {
    // Idle / natural walk
    const swingF = walk ? armSwing : 0;
    limb(ctx, 8, armY, 8 + swingF * 0.7, -190, 24, cfg.shirtColor, OUT);
    circle(ctx, 8 + swingF * 0.7, -178, 14);
    fillStroke(ctx, cfg.skinBase, OUT, 2);
  }

  // Relógio de pulso executivo / mestre mecânico
  if (cfg.accessories === "watch") {
    ctx.fillStyle = "#d4af37";
    circle(ctx, 12, -186, 5);
    ctx.fill();
  }
  ctx.restore();

  // 6. PESCOÇO E CABEÇA REALISTA
  ctx.save();
  ctx.translate(0, breathe);
  const headTilt = sad ? 0.12 : shock ? -0.08 : 0;
  ctx.rotate(headTilt);

  // Pescoço com linha anatômica do músculo esternocleidomastóideo
  limb(ctx, 2, -300, 2, -328, 24, cfg.skinBase, null);
  ctx.strokeStyle = cfg.skinShadow;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(8, -304);
  ctx.lineTo(-2, -326);
  ctx.stroke();

  // Sombra suave sob a mandíbula
  ctx.fillStyle = "rgba(40,20,10,0.18)";
  ell(ctx, 4, -325, 28, 8);
  ctx.fill();

  // Cabeça: Crânio esculpido e queixo definido
  ell(ctx, 6, -360, 36, 42);
  fillStroke(ctx, vgrad(ctx, -402, -318, [[0, cfg.skinHighlight], [0.6, cfg.skinBase], [1, cfg.skinShadow]]), OUT, 2);

  // Orelha detalhada
  ctx.save();
  ctx.translate(-16, -358);
  ell(ctx, 0, 0, 8, 14);
  fillStroke(ctx, cfg.skinBase, OUT, 1.5);
  // Sulco interno da orelha (hélice e concha)
  ctx.strokeStyle = cfg.skinShadow;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -2, 5, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();
  ctx.restore();

  // Olho realista com esclera, íris pigmentada e brilho (catchlight)
  const eyeBlink = blinkAmt(t, 0.7);
  const eyeX = 22;
  const eyeY = -364;
  const eyeR = 6.5;

  ctx.fillStyle = "#fffdf7";
  ell(ctx, eyeX, eyeY, eyeR, eyeR * (1 - eyeBlink * 0.9));
  ctx.fill();

  if (eyeBlink < 0.7) {
    // Íris pigmentada com gradiente
    const irisColor = cfg.eyeColor ?? "#4a2e16";
    ctx.fillStyle = irisColor;
    circle(ctx, eyeX + 1.2, eyeY, eyeR * 0.58);
    ctx.fill();
    // Pupila preta profunda
    ctx.fillStyle = "#0c0a08";
    circle(ctx, eyeX + 1.2, eyeY, eyeR * 0.35);
    ctx.fill();
    // Ponto de luz especular (catchlight que dá vida ao olhar!)
    ctx.fillStyle = "#ffffff";
    circle(ctx, eyeX + 2.5, eyeY - 2, 1.8);
    ctx.fill();
  }

  // Dobra da pálpebra superior e cílios
  ctx.strokeStyle = "#382012";
  ctx.lineWidth = cfg.gender === "female" ? 2.5 : 2;
  ctx.beginPath();
  ctx.moveTo(eyeX - 8, eyeY - 4);
  ctx.quadraticCurveTo(eyeX, eyeY - 8, eyeX + 9, eyeY - 2);
  ctx.stroke();

  // Sobrancelha expressiva e desenhada
  ctx.strokeStyle = cfg.hairColor;
  ctx.lineWidth = cfg.gender === "female" ? 2.8 : 3.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (sad) {
    ctx.moveTo(eyeX - 8, eyeY - 14);
    ctx.lineTo(eyeX + 10, eyeY - 9);
  } else if (shock) {
    ctx.moveTo(eyeX - 8, eyeY - 15);
    ctx.lineTo(eyeX + 10, eyeY - 17);
  } else {
    ctx.moveTo(eyeX - 8, eyeY - 12);
    ctx.quadraticCurveTo(eyeX, eyeY - 15, eyeX + 10, eyeY - 11);
  }
  ctx.stroke();

  // Nariz realista com ponte sombreada e asa nasal
  ctx.strokeStyle = cfg.skinShadow;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(eyeX + 4, eyeY - 5);
  ctx.lineTo(eyeX + 14, eyeY + 12);
  ctx.quadraticCurveTo(eyeX + 12, eyeY + 18, eyeX + 4, eyeY + 17);
  ctx.stroke();

  // Lábios realistas com arco do cupido e brilho
  ctx.beginPath();
  if (shock) {
    // Boca aberta em choque/surpresa
    ell(ctx, eyeX + 4, eyeY + 28, 6, 8);
    fillStroke(ctx, "#3b1616", "#260e0e", 1.5);
  } else if (sad) {
    // Cantos caídos com desilusão
    ctx.strokeStyle = "#6b332a";
    ctx.lineWidth = 2.5;
    ctx.moveTo(eyeX - 2, eyeY + 29);
    ctx.quadraticCurveTo(eyeX + 4, eyeY + 26, eyeX + 10, eyeY + 30);
    ctx.stroke();
  } else if (talk) {
    // Falando / articulando
    const open = Math.abs(Math.sin(t * 6)) * 4;
    ell(ctx, eyeX + 4, eyeY + 27, 7, 2 + open);
    fillStroke(ctx, "#8a4338", "#451c16", 1.5);
  } else {
    // Sorriso suave / calmo
    ctx.strokeStyle = cfg.gender === "female" ? "#b84242" : "#7a372e";
    ctx.lineWidth = cfg.gender === "female" ? 3.2 : 2.5;
    ctx.moveTo(eyeX - 2, eyeY + 26);
    ctx.quadraticCurveTo(eyeX + 4, eyeY + 29, eyeX + 11, eyeY + 26);
    ctx.stroke();
  }

  // Barba / Cavanhaque / Stubble
  if (cfg.hasStubble) {
    // Barba sombreada elegante de mecânico experiente (Marcos)
    ctx.fillStyle = "rgba(40, 25, 18, 0.28)";
    ctx.beginPath();
    ctx.moveTo(0, -345);
    ctx.quadraticCurveTo(24, -340, 24, -320);
    ctx.quadraticCurveTo(8, -315, -4, -325);
    ctx.closePath();
    ctx.fill();
  } else if (cfg.hasBeard) {
    // Barba nobre de sábio
    ctx.fillStyle = cfg.hairColor;
    ctx.beginPath();
    ctx.moveTo(6, -345);
    ctx.quadraticCurveTo(34, -330, 24, -300);
    ctx.quadraticCurveTo(10, -280, -2, -315);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = cfg.hairHighlight;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // CABELO REALISTA COM VOLUME, STRANDS E BRILHOS
  ctx.save();
  if (cfg.hairStyle === "farmer_cap") {
    // Boina rústica estilizada sobre cabelos castanhos
    ctx.fillStyle = cfg.hairColor;
    ell(ctx, 4, -385, 34, 18);
    ctx.fill();
    // Aba e copa da boina
    ell(ctx, 2, -394, 46, 14);
    fillStroke(ctx, "#4a3c30", OUT, 2);
    ctx.beginPath();
    ctx.ellipse(4, -398, 38, 22, 0, Math.PI, 0);
    fillStroke(ctx, "#5c4b3c", OUT, 2);
  } else if (cfg.hairStyle === "sage_long") {
    // Cabelos longos e prateados do sábio
    ctx.fillStyle = cfg.hairColor;
    ctx.beginPath();
    ctx.moveTo(-16, -360);
    ctx.quadraticCurveTo(-24, -310, -10, -280);
    ctx.lineTo(10, -290);
    ctx.quadraticCurveTo(15, -340, 10, -380);
    ctx.quadraticCurveTo(0, -408, -16, -360);
    ctx.closePath();
    ctx.fill();
    // Fios prateados iluminados
    ctx.strokeStyle = cfg.hairHighlight;
    ctx.lineWidth = 1.5;
    for (let h = -10; h <= 10; h += 5) {
      ctx.beginPath();
      ctx.moveTo(h, -390);
      ctx.quadraticCurveTo(h - 10, -340, h - 5, -290);
      ctx.stroke();
    }
  } else if (cfg.hairStyle === "sabrina") {
    // Cabelo feminino volumoso, ondulado e brilhante com mechas suaves
    ctx.fillStyle = cfg.hairColor;
    // Coque elegante no topo traseiro
    circle(ctx, -14, -390, 24);
    ctx.fill();
    // Presilha dourada
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(-22, -394, 6, 16);

    // Volume do cabelo ao redor da cabeça
    ctx.fillStyle = cfg.hairColor;
    ctx.beginPath();
    ctx.moveTo(-18, -350);
    ctx.quadraticCurveTo(-26, -395, 2, -406);
    ctx.quadraticCurveTo(34, -402, 38, -365);
    ctx.quadraticCurveTo(24, -370, 18, -382);
    ctx.quadraticCurveTo(-4, -388, -12, -360);
    ctx.closePath();
    ctx.fill();

    // Mechas onduladas emoldurando o rosto
    ctx.strokeStyle = cfg.hairHighlight;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(14, -388);
    ctx.quadraticCurveTo(28, -370, 26, -345);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-8, -394);
    ctx.quadraticCurveTo(8, -378, 4, -350);
    ctx.stroke();
  } else if (cfg.hairStyle === "pedro") {
    // Corte executivo impecável com risca lateral e brilho de pomada
    ctx.fillStyle = cfg.hairColor;
    ctx.beginPath();
    ctx.moveTo(-14, -360);
    ctx.quadraticCurveTo(-22, -390, 4, -404);
    ctx.quadraticCurveTo(34, -400, 36, -370);
    ctx.quadraticCurveTo(18, -375, 4, -386);
    ctx.quadraticCurveTo(-8, -380, -14, -360);
    ctx.closePath();
    ctx.fill();

    // Brilho elegante no topo
    ctx.strokeStyle = cfg.hairHighlight;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-4, -398);
    ctx.lineTo(24, -394);
    ctx.stroke();
  } else if (cfg.hairStyle === "marcos") {
    // Cabelo de mecânico maduro (46 anos) com reflexos grisalhos nas têmporas
    ctx.fillStyle = cfg.hairColor;
    ctx.beginPath();
    ctx.moveTo(-16, -360);
    ctx.quadraticCurveTo(-20, -390, 6, -402);
    ctx.quadraticCurveTo(32, -398, 35, -368);
    ctx.quadraticCurveTo(16, -372, 6, -384);
    ctx.quadraticCurveTo(-8, -378, -16, -360);
    ctx.closePath();
    ctx.fill();

    // Têmporas discretamente grisalhas
    ctx.strokeStyle = "rgba(220, 225, 230, 0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -362);
    ctx.lineTo(-4, -372);
    ctx.stroke();
  } else {
    // Paulo (jovem, textura moderna despojada)
    ctx.fillStyle = cfg.hairColor;
    ctx.beginPath();
    ctx.moveTo(-16, -358);
    ctx.quadraticCurveTo(-22, -390, 2, -406);
    ctx.quadraticCurveTo(36, -402, 38, -364);
    ctx.quadraticCurveTo(24, -370, 16, -380);
    ctx.quadraticCurveTo(-6, -378, -16, -358);
    ctx.closePath();
    ctx.fill();

    // Mechas repicadas modernas no topo
    ctx.strokeStyle = cfg.hairHighlight;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(4, -404);
    ctx.lineTo(12, -388);
    ctx.moveTo(14, -402);
    ctx.lineTo(24, -386);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore(); // fim da cabeça
  ctx.restore(); // fim do personagem
}

/* ------------------------------ Personagens dos Novos Contos e Clássicos ------------------------------ */

export function drawPaulo(ctx: Ctx, t: number, o: PoseOpts) {
  const is18 = o.variant === 1;
  const cfg: RealisticHumanConfig = {
    gender: "male",
    skinBase: "#f2cca8",
    skinShadow: "#d4a37b",
    skinHighlight: "#fae2cd",
    hairColor: "#332216",
    hairHighlight: "#614430",
    hairStyle: is18 ? "paulo_adult" : "paulo_teen",
    shirtColor: is18 ? "#1f334d" : "#2f6966", // Jaqueta navy aos 18 / hoodie verde-petróleo aos 16
    shirtShadow: is18 ? "#122033" : "#1a403e",
    pantsColor: "#2c3d59", // Jeans slim moderno
    pantsShadow: "#182333",
    shoeColor: is18 ? "#332218" : "#f1f3f5", // Botas aos 18 / tênis branco aos 16
    shoeType: is18 ? "boot" : "sneaker",
    eyeColor: "#3d2719",
  };
  drawRealisticHuman(ctx, t, o, cfg);
}

export function drawMarcos(ctx: Ctx, t: number, o: PoseOpts) {
  // Marcos, 46 anos, mecânico experiente e bem-sucedido
  const cfg: RealisticHumanConfig = {
    gender: "male",
    skinBase: "#d89c74",
    skinShadow: "#b37750",
    skinHighlight: "#e8b894",
    hairColor: "#2e2118",
    hairHighlight: "#544033",
    hairStyle: "marcos",
    hasStubble: true,
    shirtColor: "#314152", // Camisa polo de mecânico profissional
    shirtShadow: "#1e2936",
    pantsColor: "#47453d", // Calça de oficina resistente
    pantsShadow: "#2e2c26",
    shoeColor: "#2a1c12", // Botas de couro lubrificado
    shoeType: "boot",
    eyeColor: "#4a3321",
    accessories: "watch",
  };
  drawRealisticHuman(ctx, t, o, cfg);
}

export function drawPedro(ctx: Ctx, t: number, o: PoseOpts) {
  // Pedro, 30 anos, homem de negócios elegante e bem-sucedido
  const cfg: RealisticHumanConfig = {
    gender: "male",
    skinBase: "#edd0b6",
    skinShadow: "#cca383",
    skinHighlight: "#fae8d9",
    hairColor: "#241913",
    hairHighlight: "#4f372a",
    hairStyle: "pedro",
    shirtColor: "#1a2230", // Terno azul-marinho executivo sob medida
    shirtShadow: "#0f1520",
    pantsColor: "#1a2230",
    pantsShadow: "#0f1520",
    shoeColor: "#08080a", // Sapato Oxford de verniz brilhante
    shoeType: "oxford",
    eyeColor: "#2d3748",
    accessories: "tie",
  };
  drawRealisticHuman(ctx, t, o, cfg);
}

export function drawSabrina(ctx: Ctx, t: number, o: PoseOpts) {
  // Sabrina, mulher atraente, acolhedora e dona de restaurante de sucesso
  const cfg: RealisticHumanConfig = {
    gender: "female",
    skinBase: "#fbe4d0",
    skinShadow: "#e0b89b",
    skinHighlight: "#fff2e6",
    hairColor: "#331c12", // Castanho elegante e luminoso
    hairHighlight: "#663e2a",
    hairStyle: "sabrina",
    shirtColor: "#802236", // Blusa de seda vinho bordô / avental
    shirtShadow: "#541221",
    pantsColor: "#1a1c22", // Calça de alfaiataria preta elegante
    pantsShadow: "#0d0e12",
    shoeColor: "#12141a",
    shoeType: "flat",
    eyeColor: "#3d2a1c",
    accessories: "necklace",
  };
  drawRealisticHuman(ctx, t, o, cfg);
}

export function drawPerson(ctx: Ctx, t: number, o: PoseOpts) {
  const v = o.variant ?? 0;
  if (v === 1) {
    // Sábio de barbas prateadas (Tale da Águia)
    const cfg: RealisticHumanConfig = {
      gender: "male",
      skinBase: "#e8cbb0",
      skinShadow: "#c49e7e",
      skinHighlight: "#f5e4d3",
      hairColor: "#d9e2ec",
      hairHighlight: "#ffffff",
      hairStyle: "sage_long",
      hasBeard: true,
      shirtColor: "#2d3b59",
      shirtShadow: "#1a243a",
      pantsColor: "#334155",
      pantsShadow: "#1e293b",
      shoeColor: "#241e17",
      shoeType: "boot",
    };
    drawRealisticHuman(ctx, t, o, cfg);
  } else {
    // Fazendeiro realista (Tale da Águia)
    const cfg: RealisticHumanConfig = {
      gender: "male",
      skinBase: "#d8a379",
      skinShadow: "#b5794d",
      skinHighlight: "#ecc09b",
      hairColor: "#422e20",
      hairHighlight: "#6e4f39",
      hairStyle: "farmer_cap",
      hasStubble: true,
      shirtColor: "#576b82",
      shirtShadow: "#374657",
      pantsColor: "#3b342a",
      pantsShadow: "#241f18",
      shoeColor: "#261a10",
      shoeType: "boot",
      accessories: "suspenders",
    };
    drawRealisticHuman(ctx, t, o, cfg);
  }
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
  paulo: drawPaulo,
  marcos: drawMarcos,
  pedro: drawPedro,
  sabrina: drawSabrina,
  cheese: (ctx) => drawCheese(ctx, 1.5),
};

export { clamp };
