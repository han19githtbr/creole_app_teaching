/** Cenário dos contos: árvores, celeiro, cerca, flores, etc. (origem = base no chão). */
import { TAU, circle, ell, fillStroke, limb, rng, vgrad, rgrad, type Ctx } from "./artCore";

export interface PropOpts {
  variant?: number;
  w?: number;
  seed?: number;
  /** progresso da cena 0→1 */
  p?: number;
}

const OUT = "rgba(40,24,12,0.3)";

export type TreeKind = "round" | "oak" | "pine" | "bare" | "autumn" | "snow";

export function drawTree(ctx: Ctx, t: number, o: PropOpts, kind: TreeKind = "round") {
  const sway = Math.sin(t * 0.9 + (o.seed ?? 0)) * 0.012;
  ctx.rotate(sway);
  const trunkC = kind === "pine" ? "#5a3d26" : "#6e4a2c";
  if (kind === "pine" || kind === "snow") {
    const green = kind === "snow" ? "#3f6b55" : "#2f6a43";
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(-10, -90);
    ctx.lineTo(10, -90);
    ctx.lineTo(14, 0);
    ctx.fillStyle = trunkC;
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      const y = -70 - i * 78;
      const w = 130 - i * 26;
      ctx.beginPath();
      ctx.moveTo(-w, y);
      ctx.lineTo(0, y - 118);
      ctx.lineTo(w, y);
      ctx.closePath();
      fillStroke(ctx, vgrad(ctx, y - 118, y, [[0, "#4a8a5a"], [1, green]]), OUT, 3);
      if (kind === "snow") {
        ctx.beginPath();
        ctx.moveTo(-w * 0.62, y - 46);
        ctx.quadraticCurveTo(0, y - 138, w * 0.62, y - 46);
        ctx.quadraticCurveTo(0, y - 74, -w * 0.62, y - 46);
        ctx.fillStyle = "#f4f8fc";
        ctx.fill();
      }
    }
    return;
  }
  // tronco
  ctx.beginPath();
  ctx.moveTo(-26, 0);
  ctx.quadraticCurveTo(-20, -120, -14, -230);
  ctx.lineTo(16, -230);
  ctx.quadraticCurveTo(24, -120, 30, 0);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -230, 0, [[0, "#80573a"], [1, "#4f3320"]]), OUT, 3);
  if (kind === "bare") {
    limb(ctx, 0, -200, -110, -330, 18, trunkC, OUT);
    limb(ctx, 0, -220, 120, -340, 18, trunkC, OUT);
    limb(ctx, -110, -330, -150, -420, 11, trunkC, OUT);
    limb(ctx, 120, -340, 170, -430, 11, trunkC, OUT);
    return;
  }
  if (kind === "oak") {
    limb(ctx, 4, -190, 96, -250, 22, trunkC, OUT);
  }
  const palette =
    kind === "autumn"
      ? ["#d9852b", "#c9601f", "#e8a63a", "#b8461c"]
      : kind === "oak"
        ? ["#3f8f4a", "#2f7a3e", "#52a35a", "#6bb866"]
        : ["#4aa14f", "#3a8f43", "#62b865", "#79c677"];
  const r = rng((o.seed ?? 1) + 3);
  const blobs: [number, number, number][] = [
    [0, -300, 120],
    [-100, -260, 96],
    [104, -266, 100],
    [-46, -370, 92],
    [58, -360, 90],
    [0, -240, 100],
  ];
  if (kind === "oak") blobs.push([150, -250, 70], [-150, -230, 66]);
  blobs.forEach(([x, y, rad], i) => {
    ctx.save();
    ctx.translate(x, y);
    circle(ctx, 0, 0, rad);
    fillStroke(ctx, rgrad(ctx, -rad * 0.3, -rad * 0.35, rad * 0.1, rad * 1.1, [[0, palette[2 + (i % 2)]], [1, palette[i % 2]]]), OUT, 3);
    ctx.restore();
  });
  // luzes e manchas de folhas
  ctx.fillStyle = "rgba(255,255,200,0.14)";
  for (let i = 0; i < 12; i++) {
    circle(ctx, (r() - 0.5) * 220, -230 - r() * 180, 8 + r() * 14);
    ctx.fill();
  }
}

export function drawBarn(ctx: Ctx) {
  // corpo
  ctx.beginPath();
  ctx.moveTo(-170, 0);
  ctx.lineTo(-170, -190);
  ctx.lineTo(-120, -270);
  ctx.lineTo(120, -270);
  ctx.lineTo(170, -190);
  ctx.lineTo(170, 0);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -270, 0, [[0, "#c6402e"], [1, "#9a2b20"]]), OUT, 3);
  ctx.strokeStyle = "rgba(60,10,5,0.22)";
  ctx.lineWidth = 3;
  for (let x = -150; x < 170; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, -4);
    ctx.lineTo(x, -190);
    ctx.stroke();
  }
  // telhado
  ctx.beginPath();
  ctx.moveTo(-190, -186);
  ctx.lineTo(-128, -290);
  ctx.lineTo(128, -290);
  ctx.lineTo(190, -186);
  ctx.lineTo(170, -176);
  ctx.lineTo(-170, -176);
  ctx.closePath();
  fillStroke(ctx, "#5b4a45", OUT, 3);
  // porta
  ctx.fillStyle = "#f4ece0";
  ctx.fillRect(-64, -140, 128, 140);
  ctx.strokeStyle = "#8f2a1f";
  ctx.lineWidth = 8;
  ctx.strokeRect(-64, -140, 128, 140);
  ctx.beginPath();
  ctx.moveTo(-64, -140);
  ctx.lineTo(64, 0);
  ctx.moveTo(64, -140);
  ctx.lineTo(-64, 0);
  ctx.moveTo(0, -140);
  ctx.lineTo(0, 0);
  ctx.stroke();
  // janela do sótão
  ctx.fillStyle = "#f4ece0";
  ctx.fillRect(-26, -250, 52, 48);
  ctx.fillStyle = "#3a2a22";
  ctx.fillRect(-18, -244, 36, 36);
}

export function drawHaystack(ctx: Ctx) {
  ctx.beginPath();
  ctx.moveTo(-100, 0);
  ctx.quadraticCurveTo(-110, -110, -40, -150);
  ctx.quadraticCurveTo(0, -178, 40, -150);
  ctx.quadraticCurveTo(110, -110, 100, 0);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -170, 0, [[0, "#f0d27a"], [1, "#c99a3d"]]), OUT, 3);
  ctx.strokeStyle = "rgba(140,100,30,0.45)";
  ctx.lineWidth = 3;
  const r = rng(5);
  for (let i = 0; i < 18; i++) {
    const x = -80 + r() * 160;
    const y = -20 - r() * 120;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 18, y - 8);
    ctx.stroke();
  }
}

export function drawFence(ctx: Ctx, _t: number, o: PropOpts) {
  const w = o.w ?? 520;
  ctx.lineCap = "round";
  for (const y of [-52, -100]) {
    ctx.strokeStyle = "#8a5f3a";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,230,190,0.25)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, y - 4);
    ctx.lineTo(w, y - 4);
    ctx.stroke();
  }
  for (let x = 0; x <= w; x += 130) {
    ctx.beginPath();
    ctx.moveTo(x - 14, 0);
    ctx.lineTo(x - 12, -128);
    ctx.lineTo(x + 12, -128);
    ctx.lineTo(x + 14, 0);
    ctx.closePath();
    fillStroke(ctx, "#7a5232", OUT, 3);
  }
}

export function drawAnthill(ctx: Ctx) {
  ctx.beginPath();
  ctx.moveTo(-190, 0);
  ctx.quadraticCurveTo(-150, -150, 0, -190);
  ctx.quadraticCurveTo(150, -150, 190, 0);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -190, 0, [[0, "#b98a57"], [1, "#8a5f36"]]), OUT, 3);
  ctx.fillStyle = "rgba(90,60,30,0.28)";
  const r = rng(9);
  for (let i = 0; i < 16; i++) {
    ell(ctx, -130 + r() * 260, -20 - r() * 110, 8 + r() * 10, 5 + r() * 5);
    ctx.fill();
  }
  ctx.fillStyle = "#2b1b10";
  ctx.beginPath();
  ctx.ellipse(0, -52, 44, 56, 0, Math.PI, 0);
  ctx.lineTo(44, -2);
  ctx.lineTo(-44, -2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,200,120,0.25)";
  ell(ctx, 0, -20, 30, 18);
  ctx.fill();
}

export function drawFinishLine(ctx: Ctx, t: number) {
  limb(ctx, -150, 0, -150, -330, 14, "#7a5232", OUT);
  limb(ctx, 150, 0, 150, -330, 14, "#7a5232", OUT);
  const wave = Math.sin(t * 2.5) * 5;
  ctx.beginPath();
  ctx.moveTo(-150, -330);
  ctx.quadraticCurveTo(0, -310 + wave, 150, -330);
  ctx.lineTo(150, -250);
  ctx.quadraticCurveTo(0, -230 + wave, -150, -250);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#fff";
  ctx.fillRect(-160, -340, 320, 100);
  ctx.fillStyle = "#222";
  for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) if ((r + c) % 2 === 0) ctx.fillRect(-150 + c * 30, -336 + r * 30, 30, 30);
  ctx.restore();
  ctx.lineWidth = 3;
  ctx.strokeStyle = OUT;
  ctx.stroke();
  ctx.fillStyle = "#c63c2f";
  ctx.fillRect(-120, -250, 240, 54);
  ctx.fillStyle = "#fff";
  ctx.font = "900 38px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ARRIVÉE", 0, -222);
}

export function drawFlowers(ctx: Ctx, t: number, o: PropOpts) {
  const r = rng((o.seed ?? 1) * 3 + 1);
  const colors = ["#ff5d7a", "#ffd23f", "#ffffff", "#b784ff", "#ff9a3d"];
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * 22 + (r() - 0.5) * 14;
    const h = 46 + r() * 52;
    const sw = Math.sin(t * 1.5 + i) * 6;
    ctx.strokeStyle = "#3e8a3c";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.quadraticCurveTo(x + sw * 0.4, -h * 0.5, x + sw, -h);
    ctx.stroke();
    const c = colors[(i + (o.variant ?? 0)) % colors.length];
    ctx.fillStyle = c;
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * TAU;
      circle(ctx, x + sw + Math.cos(a) * 11, -h + Math.sin(a) * 11, 8.5);
      ctx.fill();
    }
    ctx.fillStyle = "#ffd23f";
    circle(ctx, x + sw, -h, 6);
    ctx.fill();
  }
}

export function drawRock(ctx: Ctx, _t: number, o: PropOpts) {
  const w = o.w ?? 120;
  ctx.beginPath();
  ctx.moveTo(-w, 0);
  ctx.quadraticCurveTo(-w * 1.05, -w * 0.7, -w * 0.3, -w * 0.82);
  ctx.quadraticCurveTo(w * 0.5, -w * 0.95, w * 0.95, -w * 0.3);
  ctx.quadraticCurveTo(w * 1.1, -w * 0.05, w, 0);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -w, 0, [[0, "#b7bdc2"], [1, "#7e868c"]]), OUT, 3);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ell(ctx, -w * 0.3, -w * 0.55, w * 0.3, w * 0.12, -0.4);
  ctx.fill();
}

export function drawBush(ctx: Ctx, t: number, o: PropOpts) {
  const sway = Math.sin(t + (o.seed ?? 0)) * 0.01;
  ctx.rotate(sway);
  for (const [x, y, r, c] of [[-60, -50, 56, "#3f8f45"], [0, -78, 68, "#4aa14f"], [62, -50, 56, "#3a8a41"], [-6, -34, 60, "#55ad58"]] as const) {
    circle(ctx, x, y, r);
    fillStroke(ctx, c, OUT, 3);
  }
  ctx.fillStyle = "#d8322b";
  for (const [x, y] of [[-30, -70], [26, -96], [48, -52], [-62, -40]] as const) {
    circle(ctx, x, y, 7);
    ctx.fill();
  }
}

export function drawWheat(ctx: Ctx, t: number, o: PropOpts) {
  const r = rng((o.seed ?? 2) + 5);
  const n = Math.round((o.w ?? 300) / 16);
  for (let i = 0; i < n; i++) {
    const x = (i / n - 0.5) * (o.w ?? 300);
    const h = 130 + r() * 60;
    const sw = Math.sin(t * 1.4 + i * 0.7) * 10;
    ctx.strokeStyle = "#c79a3a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.quadraticCurveTo(x + sw * 0.3, -h * 0.55, x + sw, -h);
    ctx.stroke();
    ctx.fillStyle = "#e8bd4c";
    for (let k = 0; k < 6; k++) {
      ell(ctx, x + sw + (k % 2 ? 6 : -6), -h + 8 + k * 11, 6, 11, k % 2 ? 0.5 : -0.5);
      ctx.fill();
    }
  }
}

export function drawNest(ctx: Ctx, _t: number, o: PropOpts) {
  ell(ctx, 0, -14, 78, 26);
  fillStroke(ctx, "#cfa24e", OUT, 3);
  ctx.strokeStyle = "rgba(120,80,20,0.5)";
  ctx.lineWidth = 3;
  const r = rng(4);
  for (let i = 0; i < 14; i++) {
    const x = -66 + r() * 132;
    ctx.beginPath();
    ctx.moveTo(x, -10 + r() * 14);
    ctx.lineTo(x + 24, -28 + r() * 10);
    ctx.stroke();
  }
  const eggs = o.variant ?? 1;
  for (let i = 0; i < eggs; i++) drawEggAt(ctx, (i - (eggs - 1) / 2) * 52, -34);
  ell(ctx, 0, -4, 80, 14);
  fillStroke(ctx, "#b98a3a", OUT, 3);
}

export function drawEggAt(ctx: Ctx, x: number, y: number, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ell(ctx, 0, 0, 24, 31);
  fillStroke(ctx, rgrad(ctx, -8, -10, 2, 34, [[0, "#fff8ea"], [1, "#e6d6b4"]]), OUT, 2);
  ctx.fillStyle = "rgba(140,100,60,0.55)";
  for (const [dx, dy, r] of [[-6, -6, 3], [8, 4, 3.4], [-2, 12, 2.6], [10, -10, 2.4]] as const) {
    circle(ctx, dx, dy, r);
    ctx.fill();
  }
  ctx.restore();
}

export function drawSign(ctx: Ctx) {
  limb(ctx, 0, 0, 0, -220, 16, "#7a5232", OUT);
  ctx.beginPath();
  ctx.moveTo(-90, -210);
  ctx.lineTo(70, -210);
  ctx.lineTo(104, -186);
  ctx.lineTo(70, -162);
  ctx.lineTo(-90, -162);
  ctx.closePath();
  fillStroke(ctx, "#d9a85a", OUT, 3);
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(-70, -192, 110, 8);
  ctx.fillRect(-70, -176, 70, 8);
}

export const PROPS: Record<string, (ctx: Ctx, t: number, o: PropOpts) => void> = {
  tree: (c, t, o) => drawTree(c, t, o, "round"),
  oak: (c, t, o) => drawTree(c, t, o, "oak"),
  pine: (c, t, o) => drawTree(c, t, o, "pine"),
  snowpine: (c, t, o) => drawTree(c, t, o, "snow"),
  bare: (c, t, o) => drawTree(c, t, o, "bare"),
  autumn: (c, t, o) => drawTree(c, t, o, "autumn"),
  barn: (c) => drawBarn(c),
  haystack: (c) => drawHaystack(c),
  fence: drawFence,
  anthill: (c) => drawAnthill(c),
  finish: (c, t) => drawFinishLine(c, t),
  flowers: drawFlowers,
  rock: drawRock,
  bush: drawBush,
  wheat: drawWheat,
  nest: drawNest,
  sign: (c) => drawSign(c),
};
