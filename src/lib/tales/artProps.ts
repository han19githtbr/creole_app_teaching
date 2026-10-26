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
  const gold = (o.variant ?? 0) >= 10;
  const count = gold ? o.variant! - 10 : eggs;
  for (let i = 0; i < count; i++) drawEggAt(ctx, (i - (count - 1) / 2) * 52, -34, 1, gold);
  ell(ctx, 0, -4, 80, 14);
  fillStroke(ctx, "#b98a3a", OUT, 3);
}

export function drawEggAt(ctx: Ctx, x: number, y: number, s = 1, gold = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ell(ctx, 0, 0, 24, 31);
  fillStroke(ctx, gold ? rgrad(ctx, -8, -10, 2, 34, [[0, "#fff2a8"], [0.5, "#ffd23f"], [1, "#c98a10"]]) : rgrad(ctx, -8, -10, 2, 34, [[0, "#fff8ea"], [1, "#e6d6b4"]]), gold ? "rgba(120,70,0,0.55)" : OUT, 2);
  if (gold) {
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ell(ctx, -8, -12, 5, 10, -0.4);
    ctx.fill();
    ctx.restore();
    return;
  }
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

/* ------------------------------ Carro Clássico / Raro ------------------------------ */

export function drawCar(ctx: Ctx, t: number, o: PropOpts) {
  ctx.save();
  // Sombra suave de contato no chão
  ctx.fillStyle = "rgba(10, 15, 25, 0.45)";
  ell(ctx, 0, 6, 270, 24);
  ctx.fill();
  ctx.fillStyle = "rgba(5, 8, 15, 0.6)";
  ell(ctx, 0, 4, 210, 14);
  ctx.fill();

  const broken = o.variant === 1;

  // Carroceria principal (estilo clássico cupê britânico dos anos 60)
  // Gradiente metálico de alta classe (Verde Racing / Esmeralda Profundo)
  const bodyPaint = vgrad(ctx, -140, 0, [
    [0, "#2a6845"],
    [0.15, "#3d8e5f"],
    [0.45, "#1e4f34"],
    [0.85, "#133824"],
    [1, "#0b2216"],
  ]);
  const highlight = "rgba(255, 255, 255, 0.35)";
  const chrome = vgrad(ctx, -20, 0, [
    [0, "#f5f9fc"],
    [0.4, "#cbd7e3"],
    [0.7, "#6b8094"],
    [1, "#3c4d5c"],
  ]);

  // Cabine e vidros (curva aerodinâmica)
  ctx.beginPath();
  ctx.moveTo(-160, -60);
  ctx.quadraticCurveTo(-110, -135, 10, -140);
  ctx.quadraticCurveTo(110, -140, 160, -65);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -140, -60, [[0, "#1f3344"], [0.6, "#2e4860"], [1, "#182838"]]), "rgba(200, 215, 230, 0.8)", 3);

  // Reflexo do céu no vidro curvo
  ctx.save();
  ctx.clip();
  ctx.beginPath();
  ctx.moveTo(-120, -135);
  ctx.lineTo(-40, -135);
  ctx.lineTo(-110, -65);
  ctx.lineTo(-150, -65);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(10, -138);
  ctx.lineTo(80, -138);
  ctx.lineTo(130, -65);
  ctx.lineTo(70, -65);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fill();

  // Coluna central da janela (chrome)
  ctx.strokeStyle = "#cbd7e3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(12, -140);
  ctx.lineTo(20, -60);
  ctx.stroke();

  // Silhueta do volante e encostos de couro
  ctx.fillStyle = "rgba(20, 12, 8, 0.75)";
  ell(ctx, 35, -88, 16, 16);
  ctx.fill();
  ell(ctx, -40, -90, 18, 22);
  ctx.fill();
  ctx.restore();

  // Carroceria inferior e para-lamas esculpidos
  ctx.beginPath();
  ctx.moveTo(-250, -42); // traseira
  ctx.quadraticCurveTo(-240, -78, -170, -72); // curva traseira
  ctx.quadraticCurveTo(-50, -64, 40, -66); // linha de cintura
  if (broken) {
    // Capô ligeiramente erguido / quebrado
    ctx.lineTo(150, -84);
    ctx.quadraticCurveTo(225, -80, 248, -48);
  } else {
    ctx.quadraticCurveTo(180, -68, 250, -42); // capô longo dianteiro
  }
  ctx.quadraticCurveTo(262, -25, 256, -15); // bico dianteiro
  ctx.lineTo(205, -15); // cava da roda dianteira
  ctx.arc(160, -15, 46, 0, Math.PI, true);
  ctx.lineTo(-100, -15); // saia lateral
  ctx.arc(-150, -15, 46, 0, Math.PI, true);
  ctx.lineTo(-240, -15); // cava da roda traseira
  ctx.quadraticCurveTo(-258, -25, -250, -42);
  ctx.closePath();
  fillStroke(ctx, bodyPaint, "rgba(8, 20, 14, 0.7)", 2.5);

  // Linha de reflexo especular na lataria (brilho metálico automotivo)
  ctx.strokeStyle = highlight;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-235, -60);
  ctx.quadraticCurveTo(-60, -52, 235, -50);
  ctx.stroke();

  // Friso lateral cromado
  ctx.strokeStyle = "#d6e2ed";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-240, -32);
  ctx.lineTo(245, -30);
  ctx.stroke();

  // Farol clássico redondo cromado
  ctx.save();
  ctx.translate(244, -36);
  ell(ctx, 0, 0, 11, 14);
  fillStroke(ctx, chrome, "#506475", 1.5);
  ell(ctx, -1, 0, 8, 11);
  fillStroke(ctx, rgrad(ctx, -2, -2, 1, 9, [[0, "#ffffff"], [0.5, "#fff2cc"], [1, "#d9aa36"]]), null);
  // Brilho do farol
  ctx.fillStyle = "#ffffff";
  circle(ctx, -2, -3, 3);
  ctx.fill();
  ctx.restore();

  // Para-choques cromados envolventes
  // Dianteiro
  ctx.beginPath();
  ctx.moveTo(230, -16);
  ctx.quadraticCurveTo(260, -18, 264, -28);
  ctx.lineTo(260, -30);
  ctx.quadraticCurveTo(256, -22, 228, -20);
  ctx.closePath();
  fillStroke(ctx, chrome, "#425566", 2);

  // Traseiro
  ctx.beginPath();
  ctx.moveTo(-232, -18);
  ctx.quadraticCurveTo(-260, -20, -262, -32);
  ctx.lineTo(-258, -34);
  ctx.quadraticCurveTo(-256, -24, -230, -22);
  ctx.closePath();
  fillStroke(ctx, chrome, "#425566", 2);

  // Grade frontal cromada
  ctx.fillStyle = "#111820";
  ctx.fillRect(238, -25, 6, 12);
  ctx.strokeStyle = "#cbd7e3";
  ctx.lineWidth = 1.5;
  for (let gy = -24; gy <= -14; gy += 3) {
    ctx.beginPath();
    ctx.moveTo(238, gy);
    ctx.lineTo(244, gy);
    ctx.stroke();
  }

  // Rodas com pneus de borracha realista e aros raiados clássicos
  const drawWheel = (wx: number) => {
    ctx.save();
    ctx.translate(wx, -15);
    // Pneu preto vulcanizado com sombreamento
    circle(ctx, 0, 0, 42);
    fillStroke(ctx, vgrad(ctx, -42, 42, [[0, "#262b33"], [0.5, "#14171c"], [1, "#0a0c0f"]]), "#050608", 2);
    // Roda interna (banda branca clássica sutil)
    circle(ctx, 0, 0, 31);
    ctx.strokeStyle = "#e8ecef";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Aro metálico cromado
    circle(ctx, 0, 0, 27);
    fillStroke(ctx, chrome, "#425566", 1.5);
    // Raios de arame cromado
    ctx.strokeStyle = "rgba(240, 245, 250, 0.75)";
    ctx.lineWidth = 1.2;
    for (let a = 0; a < Math.PI; a += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(-23 * Math.cos(a), -23 * Math.sin(a));
      ctx.lineTo(23 * Math.cos(a), 23 * Math.sin(a));
      ctx.stroke();
    }
    // Cubo central da roda com borboleta "knock-off spinner"
    circle(ctx, 0, 0, 9);
    fillStroke(ctx, rgrad(ctx, -2, -2, 1, 9, [[0, "#ffffff"], [0.7, "#cbd7e3"], [1, "#506475"]]), "#22313f", 1);
    ctx.fillStyle = "#e8edf2";
    ell(ctx, 0, 0, 14, 4, 0.4);
    ctx.fill();
    ctx.restore();
  };

  drawWheel(-150);
  drawWheel(160);

  // Se o motor quebrou (variant 1): fumaça/vapor saindo do capô aberto
  if (broken) {
    ctx.save();
    ctx.translate(180, -78);
    for (let i = 0; i < 4; i++) {
      const ph = (t * 0.8 + i * 0.25) % 1;
      const sx = Math.sin(ph * 4 + i) * 22 + i * 8;
      const sy = -ph * 130;
      const r = 14 + ph * 32;
      const a = Math.sin(ph * Math.PI) * 0.45;
      ctx.fillStyle = `rgba(230, 240, 245, ${a})`;
      circle(ctx, sx, sy, r);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

/* ------------------------------ Maleta de Ferramentas Raras ------------------------------ */

export function drawToolbox(ctx: Ctx, t: number, o: PropOpts) {
  ctx.save();
  const missing = o.variant === 1;

  // Sombra suave no piso
  ctx.fillStyle = "rgba(20, 15, 10, 0.4)";
  ell(ctx, 0, 5, 130, 16);
  ctx.fill();

  // Base da maleta de madeira nobre (nogueira polida com cantoneiras de latão)
  const wood = vgrad(ctx, -90, 0, [
    [0, "#6e3f22"],
    [0.4, "#8a4f2b"],
    [0.8, "#573019"],
    [1, "#3c1e0e"],
  ]);

  // Tampa aberta inclinada para trás
  ctx.beginPath();
  ctx.moveTo(-110, -55);
  ctx.lineTo(-95, -130);
  ctx.lineTo(95, -130);
  ctx.lineTo(110, -55);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -130, -55, [[0, "#4a2814"], [1, "#66381c"]]), "#2a150a", 3);

  // Veludo interno da tampa
  ctx.fillStyle = "#1a121d";
  ctx.beginPath();
  ctx.moveTo(-98, -60);
  ctx.lineTo(-85, -122);
  ctx.lineTo(85, -122);
  ctx.lineTo(98, -60);
  ctx.closePath();
  ctx.fill();

  // Emblema dourado de mestre mecânico na tampa
  ctx.fillStyle = "#e0ad38";
  circle(ctx, 0, -92, 10);
  ctx.fill();
  ctx.strokeStyle = "#996f17";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Corpo inferior da maleta
  ctx.beginPath();
  ctx.moveTo(-110, -55);
  ctx.lineTo(-110, 0);
  ctx.lineTo(110, 0);
  ctx.lineTo(110, -55);
  ctx.closePath();
  fillStroke(ctx, wood, "#241208", 3);

  // Cantoneiras reforçadas de latão brilhante
  const brass = rgrad(ctx, 0, 0, 1, 14, [[0, "#ffe88a"], [0.5, "#d4a73b"], [1, "#8a661c"]]);
  for (const [bx, by] of [[-104, -6], [104, -6], [-104, -48], [104, -48]] as const) {
    ctx.save();
    ctx.translate(bx, by);
    ctx.fillStyle = brass;
    ctx.fillRect(-6, -6, 12, 12);
    ctx.strokeStyle = "#5e4310";
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, -6, 12, 12);
    ctx.fillStyle = "#221508";
    circle(ctx, 0, 0, 1.8);
    ctx.fill();
    ctx.restore();
  }

  // Fecho central dourado
  ctx.fillStyle = brass;
  ctx.fillRect(-12, -35, 24, 20);
  ctx.strokeStyle = "#5e4310";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-12, -35, 24, 20);

  // Bandeja interna moldada em veludo escuro
  ctx.fillStyle = "#12141a";
  ctx.fillRect(-96, -50, 192, 42);

  // Ferramentas cromadas de precisão
  const toolChrome = vgrad(ctx, -48, -12, [[0, "#ffffff"], [0.5, "#cbd6e0"], [1, "#5b6d7d"]]);

  // Chaves de boca e estrela
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(-76 + i * 28, -28);
    ctx.fillStyle = toolChrome;
    ctx.fillRect(-4, -16, 8, 32);
    circle(ctx, 0, -16, 7);
    ctx.fill();
    circle(ctx, 0, 16, 7);
    ctx.fill();
    ctx.fillStyle = "#12141a";
    circle(ctx, 0, -16, 3.5);
    ctx.fill();
    ctx.restore();
  }

  // Soquetes e catraca do lado direito
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(45 + i * 18, -26);
    ctx.fillStyle = toolChrome;
    ctx.fillRect(-5, -12, 10, 24);
    ctx.strokeStyle = "#404d59";
    ctx.lineWidth = 1;
    ctx.strokeRect(-5, -12, 10, 24);
    ctx.restore();
  }

  // ESPAÇO CENTRAL: A FERRAMENTA MAIS RARA DO MUNDO!
  ctx.save();
  ctx.translate(0, -28);
  if (missing) {
    // A ferramenta foi PERDIDA: silhueta vazia no veludo preto com contorno pontilhado
    ctx.fillStyle = "#090a0d";
    ctx.beginPath();
    ctx.moveTo(-16, -14);
    ctx.lineTo(16, -14);
    ctx.lineTo(10, 14);
    ctx.lineTo(-10, 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(220, 180, 80, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    // A ferramenta rara está presente: chave mestra com entalhes dourados e brilho radiante!
    ctx.fillStyle = rgrad(ctx, 0, 0, 2, 18, [[0, "#fff5cc"], [0.4, "#ffd700"], [1, "#c4880c"]]);
    ctx.beginPath();
    ctx.moveTo(-14, -15);
    ctx.lineTo(14, -15);
    ctx.lineTo(8, 14);
    ctx.lineTo(-8, 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8f5f04";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Entalhes da chave especial
    circle(ctx, 0, -6, 5);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Brilho pulsante
    const sparkle = 0.5 + 0.5 * Math.sin(t * 3.5);
    ctx.fillStyle = `rgba(255, 250, 200, ${sparkle * 0.8})`;
    circle(ctx, 0, -10, 4 + sparkle * 3);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

/* ------------------------------ O Aquário do Amor ------------------------------ */

export function drawAquarium(ctx: Ctx, t: number, o: PropOpts) {
  ctx.save();
  const v = o.variant ?? 0;
  // 0: Perfeito/Pristino (muitos peixes, água translúcida cristalina, plantas verdes viçosas)
  // 1: 1ª pedra (Sabrina magoada, uma pedra escura no fundo)
  // 2: 2ª pedra (aniversário esquecido, várias pedras pesadas, menos peixes, plantas dobradas)
  // 3: Destruído/Abandonado (cheio de pedras, plantas mortas, água escura e turva, sem peixes)

  const W = 320;
  const H = 220;

  // Móvel aparador de suporte do aquário (madeira elegante / laca moderna)
  ctx.fillStyle = "rgba(10, 15, 25, 0.35)";
  ell(ctx, 0, 8, W * 0.65, 20);
  ctx.fill();

  ctx.fillStyle = vgrad(ctx, 0, 70, [[0, "#2c2621"], [1, "#15120f"]]);
  ctx.fillRect(-W * 0.52, 0, W * 1.04, 60);
  ctx.strokeStyle = "rgba(220, 190, 140, 0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(-W * 0.52, 0, W * 1.04, 60);

  // Luminária suspensa ultra-fina no topo do aquário (LED)
  const lampY = -H - 18;
  ctx.fillStyle = "#1e242d";
  ctx.fillRect(-W * 0.46, lampY, W * 0.92, 12);
  ctx.fillStyle = v === 3 ? "rgba(100, 100, 100, 0.2)" : "rgba(190, 240, 255, 0.85)";
  ctx.fillRect(-W * 0.42, lampY + 10, W * 0.84, 3);

  // Feixe de luz suave penetrando na água
  if (v < 3) {
    ctx.save();
    ctx.fillStyle = vgrad(ctx, -H, 0, [[0, "rgba(220, 245, 255, 0.25)"], [1, "rgba(120, 200, 240, 0.03)"]]);
    ctx.beginPath();
    ctx.moveTo(-W * 0.42, -H);
    ctx.lineTo(W * 0.42, -H);
    ctx.lineTo(W * 0.48, 0);
    ctx.lineTo(-W * 0.48, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Fundo interno do vidro
  ctx.fillStyle = v === 3 ? "#24201c" : vgrad(ctx, -H, 0, [[0, "#193547"], [1, "#0d1e2b"]]);
  ctx.fillRect(-W / 2, -H, W, H);

  // ÁGUA
  const waterColor =
    v === 3
      ? vgrad(ctx, -H, 0, [[0, "rgba(65, 58, 48, 0.85)"], [1, "rgba(42, 36, 28, 0.95)"]])
      : v === 2
        ? vgrad(ctx, -H, 0, [[0, "rgba(40, 130, 170, 0.65)"], [1, "rgba(20, 75, 110, 0.82)"]])
        : vgrad(ctx, -H, 0, [[0, "rgba(75, 185, 230, 0.58)"], [0.6, "rgba(40, 140, 195, 0.7)"], [1, "rgba(20, 95, 150, 0.85)"]]);

  ctx.fillStyle = waterColor;
  ctx.fillRect(-W / 2 + 6, -H + 12, W - 12, H - 14);

  // Substrato / Cascalho no fundo do aquário
  const gravelColor = v === 3 ? "#362f27" : vgrad(ctx, -26, 0, [[0, "#dfd2b5"], [1, "#8e7c60"]]);
  ctx.fillStyle = gravelColor;
  ctx.fillRect(-W / 2 + 6, -26, W - 12, 26);
  // Grânulos de cascalho
  ctx.fillStyle = v === 3 ? "rgba(20, 15, 10, 0.5)" : "rgba(100, 80, 50, 0.35)";
  for (let gx = -W / 2 + 12; gx < W / 2 - 12; gx += 14) {
    circle(ctx, gx + Math.sin(gx) * 4, -12 + Math.cos(gx) * 6, 4.5);
    ctx.fill();
  }

  // PEDRAS (A metáfora central da história!)
  const drawStone = (sx: number, sy: number, sr: number, rot = 0) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);
    // Rocha escura, pesada, angulosa
    ctx.fillStyle = vgrad(ctx, -sr, sr, [[0, "#565c66"], [0.5, "#383c42"], [1, "#1c1f24"]]);
    ctx.beginPath();
    ctx.moveTo(-sr * 1.1, -sr * 0.4);
    ctx.lineTo(-sr * 0.6, -sr * 1.1);
    ctx.lineTo(sr * 0.5, -sr * 0.9);
    ctx.lineTo(sr * 1.2, -sr * 0.2);
    ctx.lineTo(sr * 0.9, sr * 0.9);
    ctx.lineTo(-sr * 0.7, sr * 1.0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(15, 18, 22, 0.8)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ranhuras e arestas da pedra
    ctx.strokeStyle = "rgba(180, 195, 210, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-sr * 0.6, -sr * 1.1);
    ctx.lineTo(0, 0);
    ctx.lineTo(sr * 1.2, -sr * 0.2);
    ctx.stroke();
    ctx.restore();
  };

  if (v === 1) {
    // 1ª Pedra: no fundo, visível e pesada
    drawStone(15, -28, 26, 0.2);
  } else if (v === 2) {
    // 2ª Pedra e outras: se acumulando no aquário
    drawStone(-60, -32, 28, -0.3);
    drawStone(20, -30, 34, 0.15);
    drawStone(85, -34, 25, 0.4);
    drawStone(5, -62, 27, -0.2);
  } else if (v === 3) {
    // Cenas Finais: O aquário entupido de pedras, sufocado e destruído!
    for (let px = -W / 2 + 35; px <= W / 2 - 35; px += 45) {
      drawStone(px, -35, 28 + (px % 7), (px * 0.1) % 0.8);
      drawStone(px + 15, -75, 29 + (px % 5), (-px * 0.12) % 0.8);
      drawStone(px - 10, -115, 27 + (px % 9), (px * 0.15) % 0.8);
      drawStone(px + 8, -155, 25 + (px % 4), (-px * 0.18) % 0.8);
    }
  }

  // PLANTAS AQUÁTICAS
  if (v < 3) {
    const drawPlant = (px: number, py: number, height: number, leafCount: number) => {
      ctx.save();
      ctx.translate(px, py);
      for (let i = 0; i < leafCount; i++) {
        const sway = Math.sin(t * 1.5 + px + i) * 12;
        const leafH = height * (0.7 + (i / leafCount) * 0.3);
        ctx.strokeStyle = v === 2 ? "#556b4f" : i % 2 ? "#3fa352" : "#2d8040";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(sway * 0.5, -leafH * 0.5, sway, -leafH);
        ctx.stroke();
      }
      ctx.restore();
    };

    drawPlant(-W / 2 + 35, -24, 140, 5);
    drawPlant(-W / 2 + 65, -24, 110, 4);
    drawPlant(W / 2 - 45, -24, 130, 5);
    drawPlant(W / 2 - 75, -24, 95, 3);
  }

  // PEIXES TROPICAIS NADANDO (somente se não estiver destruído)
  if (v < 3) {
    // 1. Neon Tetra (pequeno, azul elétrico brilhante e vermelho)
    const drawNeonTetra = (fx: number, fy: number, flip = false) => {
      ctx.save();
      ctx.translate(fx, fy);
      if (flip) ctx.scale(-1, 1);
      // Corpo
      ell(ctx, 0, 0, 16, 6);
      ctx.fillStyle = "#1e405e";
      ctx.fill();
      // Faixa azul neon fluorescente
      ctx.strokeStyle = "#00e1ff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-14, -2);
      ctx.lineTo(8, -2);
      ctx.stroke();
      // Faixa vermelha rubi inferior
      ctx.strokeStyle = "#ff2244";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-4, 2);
      ctx.lineTo(14, 1);
      ctx.stroke();
      // Cauda translúcida
      const tailWiggle = Math.sin(t * 8 + fx) * 4;
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(-24, -6 + tailWiggle);
      ctx.lineTo(-22, 0);
      ctx.lineTo(-24, 6 + tailWiggle);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 2. Peixe Acará-Bandeira / Angelfish majestoso
    const drawAngelfish = (ax: number, ay: number) => {
      ctx.save();
      ctx.translate(ax, ay);
      const wag = Math.sin(t * 3.5) * 3;
      // Corpo triangular prateado
      ctx.beginPath();
      ctx.moveTo(22, 0); // boca
      ctx.lineTo(-12, -24); // topo
      ctx.lineTo(-18, 0); // cauda
      ctx.lineTo(-12, 24); // base
      ctx.closePath();
      fillStroke(ctx, vgrad(ctx, -24, 24, [[0, "#ffffff"], [0.5, "#d6e5ef"], [1, "#8faec7"]]), "rgba(20, 40, 60, 0.4)", 1.5);

      // Listras verticais pretas
      ctx.strokeStyle = "#1b2836";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-4, -18);
      ctx.lineTo(-4, 18);
      ctx.moveTo(8, -10);
      ctx.lineTo(8, 10);
      ctx.stroke();

      // Longa barbatana dorsal e ventral
      ctx.fillStyle = "rgba(220, 240, 255, 0.65)";
      ctx.beginPath();
      ctx.moveTo(-10, -22);
      ctx.lineTo(-18, -65 + wag);
      ctx.lineTo(-4, -20);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-10, 22);
      ctx.lineTo(-18, 65 - wag);
      ctx.lineTo(-4, 20);
      ctx.closePath();
      ctx.fill();

      // Olhinho brilhante
      circle(ctx, 14, -4, 2.5);
      ctx.fillStyle = "#ff5522";
      ctx.fill();
      circle(ctx, 14.5, -4.5, 1);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();
    };

    if (v === 0) {
      // 3 Neons e 1 Angelfish nadando livremente e graciosamente
      const t1 = (t * 22) % (W - 80) - (W / 2 - 40);
      drawNeonTetra(t1, -120 + Math.sin(t * 2) * 12);
      drawNeonTetra(-t1 * 0.8 + 20, -80 + Math.cos(t * 2.2) * 10, true);
      drawNeonTetra(t1 * 0.6 - 40, -150 + Math.sin(t * 1.8) * 8);

      const ax = Math.sin(t * 0.6) * 60;
      const ay = -95 + Math.cos(t * 0.8) * 16;
      drawAngelfish(ax, ay);
    } else if (v === 1) {
      // 2 Neons nadando mais no topo
      const t1 = (t * 18) % (W - 80) - (W / 2 - 40);
      drawNeonTetra(t1, -145 + Math.sin(t * 2) * 8);
      drawNeonTetra(-t1 * 0.7, -110 + Math.cos(t * 2.2) * 8, true);
    } else if (v === 2) {
      // Apenas 1 neon retraído bem perto da superfície
      drawNeonTetra(Math.sin(t * 0.8) * 30 + 40, -170, true);
    }

    // Bolhinhas de oxigênio subindo
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (let bi = 0; bi < 6; bi++) {
      const bph = ((t * 0.4 + bi * 0.18) % 1);
      const bx = W / 2 - 50 + Math.sin(bph * 8 + bi) * 8;
      const by = -28 - bph * (H - 35);
      circle(ctx, bx, by, 2 + bi * 0.5);
      ctx.fill();
    }
  }

  // Paredes de vidro ultra-clear com espessura realista e reflexos chanfrados
  ctx.strokeStyle = "rgba(220, 245, 255, 0.85)";
  ctx.lineWidth = 4;
  ctx.strokeRect(-W / 2, -H, W, H);

  // Reflexo diagonal clássico de vidro cristalino
  ctx.save();
  ctx.beginPath();
  ctx.rect(-W / 2, -H, W, H);
  ctx.clip();
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.beginPath();
  ctx.moveTo(-W / 2 + 30, -H);
  ctx.lineTo(-W / 2 + 90, -H);
  ctx.lineTo(-W / 2 - 20, 0);
  ctx.lineTo(-W / 2 - 80, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-W / 2 + 130, -H);
  ctx.lineTo(-W / 2 + 155, -H);
  ctx.lineTo(-W / 2 + 45, 0);
  ctx.lineTo(-W / 2 + 20, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/* ------------------------------ Mesa Elegante de Restaurante / Jantar ------------------------------ */

export function drawDiningTable(ctx: Ctx, t: number, o: PropOpts) {
  ctx.save();
  const W = 280;

  // Sombra no chão
  ctx.fillStyle = "rgba(15, 12, 10, 0.35)";
  ell(ctx, 0, 4, W * 0.55, 16);
  ctx.fill();

  // Pés da mesa em mogno trabalhado
  ctx.fillStyle = "#2d1b11";
  ctx.fillRect(-W * 0.42, -90, 14, 90);
  ctx.fillRect(W * 0.42 - 14, -90, 14, 90);

  // Tampo da mesa
  ctx.fillStyle = vgrad(ctx, -104, -90, [[0, "#5a3622"], [1, "#3c2214"]]);
  ctx.fillRect(-W * 0.48, -104, W * 0.96, 14);

  // Toalha fina com caída elegante
  ctx.fillStyle = vgrad(ctx, -106, -70, [[0, "#fafaf8"], [0.8, "#ebece8"], [1, "#ccd0cc"]]);
  ctx.beginPath();
  ctx.moveTo(-W * 0.45, -106);
  ctx.lineTo(W * 0.45, -106);
  ctx.lineTo(W * 0.42, -65);
  ctx.lineTo(-W * 0.42, -65);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(100, 100, 100, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Castiçal com vela acesa (chama tremeluzente)
  ctx.save();
  ctx.translate(0, -106);
  // Base de latão
  ctx.fillStyle = "#d4af37";
  ell(ctx, 0, 0, 16, 5);
  ctx.fill();
  ctx.fillRect(-3, -24, 6, 24);
  // Vela branca
  ctx.fillStyle = "#fcf9f2";
  ctx.fillRect(-5, -54, 10, 30);
  // Pavio
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -54);
  ctx.lineTo(0, -60);
  ctx.stroke();
  // Chama com glow acolhedor
  const flick = Math.sin(t * 12) * 1.5;
  ctx.fillStyle = rgrad(ctx, flick * 0.5, -68, 2, 28, [[0, "rgba(255, 230, 120, 0.8)"], [0.6, "rgba(255, 140, 40, 0.3)"], [1, "rgba(255, 100, 20, 0)"]]);
  circle(ctx, flick * 0.5, -68, 28);
  ctx.fill();

  ctx.fillStyle = "#ffe57f";
  ell(ctx, flick * 0.5, -68, 5, 10);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  circle(ctx, flick * 0.3, -66, 2.5);
  ctx.fill();
  ctx.restore();

  // Taças de vinho de cristal e pratos
  for (const tx of [-60, 60]) {
    ctx.save();
    ctx.translate(tx, -106);
    // Prato
    ell(ctx, 0, 0, 26, 6);
    fillStroke(ctx, "#ffffff", "rgba(150, 150, 150, 0.3)", 1);
    // Taça
    ctx.strokeStyle = "rgba(230, 245, 255, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx > 0 ? 20 : -20, 0);
    ctx.lineTo(tx > 0 ? 20 : -20, -14); // haste
    ctx.stroke();
    ell(ctx, tx > 0 ? 20 : -20, -22, 7, 10);
    fillStroke(ctx, "rgba(160, 30, 50, 0.4)", "rgba(230, 245, 255, 0.8)", 1.5);
    ctx.restore();
  }

  ctx.restore();
}

/* ------------------------------ Mesa de Escritório Executiva (Pedro) ------------------------------ */

export function drawOfficeDesk(ctx: Ctx, t: number, o: PropOpts) {
  ctx.save();
  const W = 260;

  // Sombra
  ctx.fillStyle = "rgba(15, 20, 30, 0.35)";
  ell(ctx, 0, 4, W * 0.55, 14);
  ctx.fill();

  // Pernas de aço escovado minimalista
  ctx.fillStyle = "#2c333d";
  ctx.fillRect(-W * 0.45, -95, 10, 95);
  ctx.fillRect(W * 0.45 - 10, -95, 10, 95);

  // Tampo em carvalho escuro executivo
  ctx.fillStyle = vgrad(ctx, -108, -95, [[0, "#3e322a"], [1, "#251d18"]]);
  ctx.fillRect(-W * 0.48, -108, W * 0.96, 13);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-W * 0.48, -108, W * 0.96, 13);

  // Laptop de alumínio aberto brilhando
  ctx.save();
  ctx.translate(15, -108);
  // Base do notebook
  ctx.fillStyle = "#9ba7b4";
  ctx.fillRect(-35, -4, 70, 4);
  // Tela inclinada aberta com luz azul emitida
  ctx.beginPath();
  ctx.moveTo(-32, -4);
  ctx.lineTo(-30, -50);
  ctx.lineTo(30, -50);
  ctx.lineTo(32, -4);
  ctx.closePath();
  ctx.fillStyle = "#1e242c";
  ctx.fill();
  // Display luminoso
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(-27, -47, 54, 40);
  // Janelas e linhas de texto na tela do laptop
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(-24, -44, 22, 14);
  ctx.fillStyle = "#94a3b8";
  for (let ly = -26; ly <= -12; ly += 4) {
    ctx.fillRect(-24, ly, 46, 2);
  }
  ctx.restore();

  // Pasta de contratos de negócios e xícara de café expresso
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(-85, -112, 42, 6);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-82, -114, 36, 3);

  // Xícara de café
  ctx.fillStyle = "#f8fafc";
  circle(ctx, -95, -113, 7);
  ctx.fill();
  ctx.fillStyle = "#3e2723";
  circle(ctx, -95, -113, 5);
  ctx.fill();

  ctx.restore();
}

/* ------------------------------ Oficina de Mecânica / Bancada ------------------------------ */

export function drawGarageBenches(ctx: Ctx, t: number, o: PropOpts) {
  ctx.save();
  // Painel de ferramentas metálico perfurado ao fundo
  ctx.fillStyle = "#2b343d";
  ctx.fillRect(-150, -260, 300, 160);
  ctx.strokeStyle = "#1b2126";
  ctx.lineWidth = 4;
  ctx.strokeRect(-150, -260, 300, 160);

  // Furos do pegboard
  ctx.fillStyle = "#161b20";
  for (let px = -135; px <= 135; px += 24) {
    for (let py = -245; py <= -115; py += 24) {
      circle(ctx, px, py, 2.5);
      ctx.fill();
    }
  }

  // Ferramentas penduradas no painel
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-110 + i * 28, -230);
    ctx.lineTo(-110 + i * 28, -160 - i * 8);
    ctx.stroke();
  }

  // Bancada de trabalho vermelha pesada
  ctx.fillStyle = vgrad(ctx, -100, 0, [[0, "#a82424"], [1, "#661313"]]);
  ctx.fillRect(-140, -100, 280, 100);
  ctx.strokeStyle = "#380808";
  ctx.lineWidth = 3;
  ctx.strokeRect(-140, -100, 280, 100);

  // Gavetas da bancada
  for (let dy = -85; dy <= -25; dy += 30) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(-130, dy, 260, 22);
    // Puxador cromado
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(-20, dy + 8, 40, 6);
  }

  // Pilha de 2 pneus esportivos encostados
  const drawTire = (tx: number, ty: number) => {
    ctx.save();
    ctx.translate(tx, ty);
    ell(ctx, 0, 0, 48, 16);
    fillStroke(ctx, "#181a1d", "#0b0d0e", 2);
    ell(ctx, 0, 0, 28, 9);
    fillStroke(ctx, "#475569", "#1e293b", 1.5);
    ctx.restore();
  };
  drawTire(120, -16);
  drawTire(120, -42);

  ctx.restore();
}

/* ------------------------------ Miniaturas de Carros (Quarto de Paulo) ------------------------------ */

export function drawMiniCars(ctx: Ctx, t: number, o: PropOpts) {
  ctx.save();
  // Estante de madeira
  ctx.fillStyle = "#6b4a2f";
  ctx.fillRect(-120, -40, 240, 10);
  ctx.fillRect(-120, -110, 240, 10);
  ctx.fillRect(-125, -120, 10, 120);
  ctx.fillRect(115, -120, 10, 120);

  // 4 miniaturas de carros colecionáveis com cores vibrantes
  const colors = ["#dc2626", "#2563eb", "#eab308", "#16a34a"];
  colors.forEach((col, i) => {
    ctx.save();
    const mx = -85 + i * 56;
    const my = i < 2 ? -46 : -116;
    ctx.translate(mx, my);

    // Carroceriazinha em miniatura
    ctx.fillStyle = col;
    ell(ctx, 0, -8, 22, 9);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ell(ctx, 0, -12, 12, 6);
    ctx.fill();

    // Rodinhas pretas
    ctx.fillStyle = "#0f172a";
    circle(ctx, -12, -2, 5);
    ctx.fill();
    circle(ctx, 12, -2, 5);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

/** Parreira com cachos de uva pendurados. */
export function drawGrapevine(ctx: Ctx, t: number) {
  limb(ctx, -150, 0, -150, -420, 22, "#7a5232", OUT);
  limb(ctx, 150, 0, 150, -420, 22, "#7a5232", OUT);
  limb(ctx, -170, -420, 170, -420, 20, "#7a5232", OUT);
  const r = rng(31);
  for (let i = 0; i < 9; i++) {
    const x = -160 + i * 40;
    const sw = Math.sin(t * 1.2 + i) * 3;
    circle(ctx, x + sw, -430 + (i % 2) * 8, 34);
    fillStroke(ctx, rgrad(ctx, x - 10, -440, 4, 40, [[0, "#5fb260"], [1, "#2f7a3e"]]), OUT, 2);
  }
  for (const cx of [-90, 10, 100]) {
    const sw = Math.sin(t * 1.4 + cx) * 3;
    ctx.save();
    ctx.translate(cx + sw, -400);
    limb(ctx, 0, 0, 0, 20, 6, "#4a7a2e", null);
    const rows = [[0, 30, 2], [-12, 52, 3], [-24, 74, 4], [-12, 96, 3], [0, 116, 2]] as const;
    rows.forEach(([ox, oy, n]) => {
      for (let k = 0; k < n; k++) {
        circle(ctx, ox + (k - (n - 1) / 2) * 24 + 12, oy + (r() - 0.5) * 2, 15);
        fillStroke(ctx, rgrad(ctx, -4, oy - 5, 2, 18, [[0, "#b17ad0"], [1, "#5e2a86"]]), "rgba(40,10,60,0.5)", 2);
      }
    });
    ctx.restore();
  }
}

/** Jarro de vidro com água e pedrinhas: `v = 9` anima o nível com o progresso da cena. */
export function drawJug(ctx: Ctx, _t: number, o: PropOpts) {
  const level = o.variant === 9 ? 0.18 + 0.62 * Math.min(1, Math.max(0, (o.p ?? 0) * 1.1)) : [0.18, 0.4, 0.62, 0.8][Math.min(3, o.variant ?? 0)];
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(-52, 0);
    ctx.quadraticCurveTo(-66, -90, -34, -170);
    ctx.lineTo(-30, -250);
    ctx.lineTo(-44, -262);
    ctx.lineTo(44, -262);
    ctx.lineTo(30, -250);
    ctx.lineTo(34, -170);
    ctx.quadraticCurveTo(66, -90, 52, 0);
    ctx.closePath();
  };
  body();
  fillStroke(ctx, "rgba(200,230,245,0.35)", "rgba(80,120,150,0.7)", 4);
  ctx.save();
  body();
  ctx.clip();
  const waterTop = -level * 250;
  ctx.fillStyle = vgrad(ctx, waterTop, 0, [[0, "rgba(80,170,230,0.75)"], [1, "rgba(30,110,190,0.85)"]]);
  ctx.fillRect(-80, waterTop, 160, -waterTop);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ell(ctx, 0, waterTop, 44, 6);
  ctx.fill();
  // pedrinhas no fundo
  const pebbles = Math.round(level * 18);
  const r = rng(8);
  for (let i = 0; i < pebbles; i++) {
    const x = -34 + r() * 68;
    const y = -8 - Math.floor(i / 5) * 14 - r() * 4;
    ell(ctx, x, y, 11, 8, r());
    fillStroke(ctx, ["#9aa0a6", "#b7bdc2", "#7f868c"][i % 3], "rgba(0,0,0,0.35)", 1.5);
  }
  ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ell(ctx, -34, -130, 5, 52, 0.12);
  ctx.fill();
}

/** Rede de corda sobre o personagem (cúpula de malha). */
export function drawNet(ctx: Ctx, t: number) {
  const sway = Math.sin(t * 1.6) * 3;
  const dome = () => {
    ctx.beginPath();
    ctx.moveTo(-230, 0);
    ctx.bezierCurveTo(-230, -270 + sway, 230, -270 + sway, 230, 0);
    ctx.closePath();
  };
  ctx.save();
  dome();
  ctx.fillStyle = "rgba(190,150,80,0.1)";
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = "#b58a4a";
  ctx.lineWidth = 6;
  for (let i = -8; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 36 - 150, 0);
    ctx.lineTo(i * 36 + 150, -300);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i * 36 + 150, 0);
    ctx.lineTo(i * 36 - 150, -300);
    ctx.stroke();
  }
  ctx.restore();
  dome();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#8a6430";
  ctx.stroke();
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
  car: drawCar,
  toolbox: drawToolbox,
  aquarium: drawAquarium,
  diningTable: drawDiningTable,
  officeDesk: drawOfficeDesk,
  garageBenches: drawGarageBenches,
  miniCars: drawMiniCars,
  grapevine: (c, t) => drawGrapevine(c, t),
  jug: drawJug,
  net: (c, t) => drawNet(c, t),
};
