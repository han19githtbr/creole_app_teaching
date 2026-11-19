/**
 * Personagens dos contos (vetor, vistos de lado, virados para a direita, pés na origem).
 * Cada função recebe o tempo `t` (s) e as opções de animação.
 */
import { TAU, circle, ell, fillStroke, limb, smoothPath, vgrad, rgrad, lgrad, softContactShadow, clamp, type Ctx } from "./artCore";
import { drawCar } from "./artProps";

export interface PoseOpts {
  anim?: string;
  variant?: number;
  speed?: number;
  carry?: string;
  /** progresso 0→1 da cena (para movimentos que acontecem uma vez) */
  p?: number;
  dx?: number;
  dy?: number;
}

const OUT = "rgba(35,20,10,0.38)";
const blinkAmt = (t: number, off = 0) => {
  const c = (t + off) % 3.7;
  return c < 0.15 ? Math.sin((c / 0.15) * Math.PI) : 0;
};

/** Olho anatômico com esclera sombreada, íris com profundidade, pupila e duplo catchlight */
function eye(ctx: Ctx, x: number, y: number, r: number, t: number, off = 0, iris = "#1a1209", pupilSlit = false) {
  const b = blinkAmt(t, off);
  // Esclera realista com sombra superior da pálpebra
  ctx.save();
  ctx.fillStyle = "#fffdf7";
  ell(ctx, x, y, r, r * (1 - b * 0.9));
  ctx.fill();

  if (b < 0.7) {
    // Sombra suave na esclera superior
    ctx.fillStyle = "rgba(40,25,15,0.18)";
    ctx.beginPath();
    ctx.arc(x, y - r * 0.3, r * 0.9, -Math.PI, 0);
    ctx.fill();

    // Íris rica com gradiente de profundidade
    const g = rgrad(ctx, x + r * 0.15, y, r * 0.08, r * 0.65, [
      [0, iris],
      [0.72, iris],
      [1, "rgba(10,5,2,0.92)"],
    ]);
    ctx.fillStyle = g;
    circle(ctx, x + r * 0.2, y, r * 0.6);
    ctx.fill();

    // Pupila profunda (redonda ou fenda felina/vulpina)
    ctx.fillStyle = "#080706";
    if (pupilSlit) {
      ell(ctx, x + r * 0.2, y, r * 0.18, r * 0.52);
    } else {
      circle(ctx, x + r * 0.2, y, r * 0.36);
    }
    ctx.fill();

    // Catchlight duplo especular (dá vida e brilho fotográfico ao olhar)
    ctx.fillStyle = "#ffffff";
    circle(ctx, x + r * 0.36, y - r * 0.26, r * 0.2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    circle(ctx, x + r * 0.06, y + r * 0.22, r * 0.1);
    ctx.fill();
  }

  // Linha da pálpebra superior / cílio
  ctx.strokeStyle = "rgba(40,20,10,0.65)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y - r * 0.25, r * 1.05, -Math.PI * 0.85, -Math.PI * 0.15);
  ctx.stroke();
  ctx.restore();
}

/* ------------------------------ galinha ------------------------------ */

export function drawHen(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = o.anim === "walk" || o.anim === "run";
  const ph = t * (o.speed ?? 7);
  const peck = o.anim === "peck" ? Math.pow(Math.max(0, Math.sin(t * 5.5)), 2) : 0;
  // Bobbing optocinético clássico das aves: a cabeça projeta à frente e estabiliza
  const headBob = walk ? Math.sin(ph) * 9 : 0;
  const bob = walk ? Math.abs(Math.sin(ph)) * 5 : 0;
  const brown = o.variant === 1;
  const body = brown ? "#b8642a" : "#fdfbf6";
  const shade = brown ? "#7d3f18" : "#d8cfbd";
  const wingC = brown ? "#994d1f" : "#ebe3d2";

  ctx.save();
  ctx.translate(0, -bob);

  // Pernas com articulação realística de tarso, escamas (escudos) e garras
  const l = walk ? Math.sin(ph) * 16 : 0;
  for (const [x, s] of [[-12, 1], [14, -1]] as const) {
    const footX = x + l * s;
    // Coxa com penugem
    limb(ctx, x, -52, footX, 0, 7.5, "#e5a126", OUT);
    // Escudos horizontais nas canelas (escamas aviárias)
    ctx.strokeStyle = "rgba(100,60,10,0.35)";
    ctx.lineWidth = 1.2;
    for (let sy = -40; sy <= -10; sy += 8) {
      ctx.beginPath();
      ctx.moveTo(x + (footX - x) * 0.5 - 3, sy);
      ctx.lineTo(x + (footX - x) * 0.5 + 3, sy);
      ctx.stroke();
    }
    // Dedos articulados com unhas
    limb(ctx, footX, 0, footX + 16, 2, 5.5, "#e5a126", OUT);
    limb(ctx, footX, 0, footX - 8, 2, 4.5, "#e5a126", OUT); // dedo traseiro (hálux)
  }

  // Cauda com penas sobrepostas e reflexo sedoso
  ctx.save();
  ctx.translate(-62, -102);
  for (let i = 0; i < 4; i++) {
    const a = -0.95 + i * 0.22;
    ctx.save();
    ctx.rotate(a + Math.sin(t * 2 + i) * 0.03);
    ell(ctx, -30, 0, 42, 14);
    fillStroke(ctx, vgrad(ctx, -14, 14, [[0, body], [0.6, shade], [1, brown ? "#52240b" : "#b0a590"]]), OUT, 1.8);
    // Raque central da pena
    ctx.strokeStyle = "rgba(40,20,10,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-70, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Corpo com volume anatômico e gradiente de penugem macia
  ell(ctx, 0, -85, 74, 58, -0.12);
  fillStroke(ctx, vgrad(ctx, -142, -26, [[0, body], [0.55, wingC], [1, shade]]), OUT, 2.2);

  // Asa detalhada com coberteiras e penas primárias sobrepostas
  ctx.save();
  ctx.translate(-6, -82);
  ctx.rotate(0.22 + (peck ? 0.08 : 0));
  ell(ctx, 0, 0, 44, 30);
  fillStroke(ctx, wingC, OUT, 2);
  // Penas estriadas na asa
  ctx.strokeStyle = "rgba(50,25,10,0.22)";
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-32 + i * 11, -8 + i * 4);
    ctx.quadraticCurveTo(-10 + i * 8, 4, 10 + i * 8, -12);
    ctx.stroke();
  }
  ctx.restore();

  // Pescoço e cabeça com optocinética aviária
  const hx = 64 + peck * 36 + headBob;
  const hy = -128 + peck * 64;
  ell(ctx, 44 + peck * 14 + headBob * 0.5, -112 + peck * 28, 28, 40, 0.48 - peck * 0.5);
  fillStroke(ctx, body, null);
  circle(ctx, hx, hy, 30);
  fillStroke(ctx, vgrad(ctx, hy - 30, hy + 30, [[0, body], [1, wingC]]), OUT, 2);

  // Crista recortada com papilas vasculares carmesim
  ctx.fillStyle = "#d82424";
  for (const [dx, dy, r] of [[-10, -32, 9], [2, -37, 12], [14, -30, 9], [24, -22, 6]] as const) {
    circle(ctx, hx + dx, hy + dy, r);
    ctx.fill();
    // Brilho suave no topo das pontas da crista
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    circle(ctx, hx + dx + 1, hy + dy - 2, r * 0.35);
    ctx.fill();
    ctx.fillStyle = "#d82424";
  }

  // Barbelas carmesim pendentes sob o queixo
  ell(ctx, hx + 18, hy + 24, 8, 14, 0.18);
  ctx.fill();
  ell(ctx, hx + 24, hy + 22, 7, 11, -0.15);
  ctx.fill();

  // Bico curvo córneo com orifício nasal (narina)
  ctx.beginPath();
  ctx.moveTo(hx + 24, hy - 6);
  ctx.quadraticCurveTo(hx + 42, hy - 4, hx + 52, hy + 4);
  ctx.lineTo(hx + 24, hy + 13);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, hy - 6, hy + 13, [[0, "#ffb326"], [1, "#d97a08"]]), OUT, 1.8);
  // Narina
  circle(ctx, hx + 30, hy - 1, 1.5);
  ctx.fillStyle = "rgba(60,30,10,0.7)";
  ctx.fill();

  // Olho expressivo com esclera, íris âmbar e duplo catchlight
  eye(ctx, hx + 10, hy - 6, 6.5, t, 0.3, "#c66318");

  ctx.restore();
}

/* ------------------------------ pintinho ------------------------------ */

export function drawChick(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = o.anim === "walk" || o.anim === "run";
  const ph = t * (o.speed ?? 9);
  const hop = walk ? Math.abs(Math.sin(ph)) * 10 : o.anim === "peck" ? 0 : Math.sin(t * 3.5) * 1.8;
  const peck = o.anim === "peck" ? Math.pow(Math.max(0, Math.sin(t * 6)), 2) : 0;

  ctx.save();
  ctx.translate(0, -hop);

  // Pernas delicadas com garras finas
  limb(ctx, -6, -12, -6, 0, 3.8, "#f09a1c", OUT);
  limb(ctx, 8, -12, 8, 0, 3.8, "#f09a1c", OUT);

  // Corpo com penugem ultra-fofa (gradiente radial difuso)
  const chickGrad = rgrad(ctx, 0, -30, 6, 32, [
    [0, "#fff5a8"],
    [0.55, "#ffe652"],
    [0.85, "#f7c728"],
    [1, "#dfa414"],
  ]);
  ell(ctx, 0, -28, 28, 25);
  fillStroke(ctx, chickGrad, OUT, 1.8);

  // Asinha penugenta com leve vibração
  const wingFlap = walk ? Math.sin(ph * 1.5) * 0.12 : 0;
  ctx.save();
  ctx.translate(-6, -28);
  ctx.rotate(0.3 + wingFlap);
  ell(ctx, 0, 0, 14, 9);
  fillStroke(ctx, "#fce03f", OUT, 1.2);
  ctx.restore();

  // Cabeça rechonchuda e penugenta
  const hx = 16 + peck * 14;
  const hy = -52 + peck * 20;
  circle(ctx, hx, hy, 18);
  fillStroke(ctx, rgrad(ctx, hx - 4, hy - 4, 3, 22, [[0, "#fff7b8"], [0.6, "#ffe75c"], [1, "#f2ba24"]]), OUT, 1.8);

  // Biquinho delicado
  ctx.beginPath();
  ctx.moveTo(hx + 13, hy);
  ctx.lineTo(hx + 28, hy + 4);
  ctx.lineTo(hx + 13, hy + 9);
  ctx.closePath();
  fillStroke(ctx, "#f28e18", OUT, 1.2);

  // Olho negro brilhante como uma pérola
  eye(ctx, hx + 5, hy - 4, 4.5, t, 0.8, "#1a1209");

  ctx.restore();
}

/* ------------------------------ águia ------------------------------ */

function feather(ctx: Ctx, len: number, w: number, color: string, tipDark = true) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, -w / 2);
  ctx.quadraticCurveTo(len * 0.65, -w * 0.65, len, 0);
  ctx.quadraticCurveTo(len * 0.65, w * 0.65, 0, w / 2);
  ctx.closePath();

  // Gradiente de pena com ponta mais escura aerodinâmica
  const g = ctx.createLinearGradient(0, 0, len, 0);
  g.addColorStop(0, color);
  g.addColorStop(0.7, color);
  g.addColorStop(1, tipDark ? "#1a120a" : color);
  fillStroke(ctx, g, "rgba(25,15,8,0.45)", 1.8);

  // Raque da pena (linha central rígida)
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len * 0.9, 0);
  ctx.stroke();
  ctx.restore();
}

function eagleWing(ctx: Ctx, len: number, color: string, light: string) {
  // Coberteiras medianas + penas primárias aerodinâmicas em leque
  const n = 9;
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.rotate(-0.2 + (i / (n - 1)) * 0.98);
    ctx.translate(len * 0.15, 0);
    feather(ctx, len * (0.95 - Math.abs(i - 2.5) * 0.05), len * 0.18, i % 2 ? color : light, true);
    ctx.restore();
  }
  // Coberteiras maiores (camada sobreposta de penas menores)
  ctx.save();
  ctx.rotate(0.24);
  ell(ctx, len * 0.32, 0, len * 0.36, len * 0.14);
  fillStroke(ctx, vgrad(ctx, -len * 0.14, len * 0.14, [[0, light], [1, color]]), "rgba(30,16,8,0.45)", 2);
  ctx.restore();
}

export function drawEagle(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  if (anim === "fly" || anim === "glide" || anim === "spread") return drawEagleFront(ctx, t, o);
  const walk = anim === "walk" || anim === "peck";
  const ph = t * (o.speed ?? 7);
  const dark = "#2b1c11";
  const mid = "#4a321d";
  const light = "#6b4a2c";
  const peck = anim === "peck" ? Math.pow(Math.max(0, Math.sin(t * 5)), 2) : 0;
  const lean = walk ? 0.08 + peck * 0.35 : 0.04;
  const bob = walk ? Math.abs(Math.sin(ph)) * 4.5 : Math.sin(t * 1.6) * 1.6;

  ctx.save();
  ctx.translate(0, -bob);

  // Coxas emplumadas e garras formidáveis de ave de rapina
  const l = walk ? Math.sin(ph) * 16 : 0;
  for (const [x, s] of [[-10, 1], [22, -1]] as const) {
    const footX = x + l * s;
    // Coxas com penugem volumosa ("calças de águia")
    ell(ctx, x, -95, 18, 28, 0.1);
    fillStroke(ctx, vgrad(ctx, -120, -70, [[0, mid], [1, dark]]), OUT, 1.8);
    // Tarsos amarelos com placas de escamas (escudos)
    limb(ctx, x, -80, footX, 0, 16, "#e8a91a", OUT);
    // Anéis de escamas
    ctx.strokeStyle = "rgba(80,40,5,0.4)";
    ctx.lineWidth = 1.6;
    for (let sy = -65; sy <= -15; sy += 10) {
      ctx.beginPath();
      ctx.moveTo(x + (footX - x) * 0.5 - 6, sy);
      ctx.lineTo(x + (footX - x) * 0.5 + 6, sy);
      ctx.stroke();
    }
    // Garras curvas letais em preto azeviche com brilho especular
    for (let k = -1; k <= 1; k++) {
      const gx = footX + 24 + k * 3;
      const gy = -k * 4 + 3;
      limb(ctx, footX, 0, gx, gy, 8, "#e8a91a", OUT);
      // Unha curva
      ctx.strokeStyle = "#111417";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.quadraticCurveTo(gx + 8, gy + 2, gx + 12, gy + 8);
      ctx.stroke();
    }
  }

  ctx.translate(0, -150);
  ctx.rotate(lean);
  ctx.translate(0, 150);

  // Cauda em leque de penas brancas e retrizes majestosas
  ctx.save();
  ctx.translate(-64, -78);
  for (const a of [1.95, 2.15, 2.35, 2.55]) {
    ctx.save();
    ctx.rotate(a + Math.sin(t * 1.5) * 0.02);
    feather(ctx, 126, 36, "#fdfbf7", false);
    ctx.restore();
  }
  ctx.restore();

  // Tronco musculoso com volume peitoral e sombreamento escuro
  ell(ctx, 0, -178, 86, 130, 0.1);
  fillStroke(ctx, vgrad(ctx, -315, -45, [[0, light], [0.45, mid], [1, dark]]), OUT, 2.2);

  // Penas do peito com estrias de plumagem
  ctx.strokeStyle = "rgba(180,130,80,0.35)";
  ctx.lineWidth = 2.5;
  for (let r = 0; r < 5; r++) {
    for (let c = -1; c <= 2; c++) {
      ctx.beginPath();
      ctx.arc(14 + c * 20, -190 + r * 22, 10, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }

  // Asa dobrada com grande envergadura ao longo do flanco
  ctx.save();
  ctx.translate(-14, -262);
  ctx.rotate(1.72 + (peck ? 0.06 : 0));
  eagleWing(ctx, 195, "#332115", "#4a321e");
  ctx.restore();

  // Cabeça nobre e imponente com plumagem branca (Águia-de-cabeça-branca)
  const hx = 36 + peck * 36;
  const hy = -318 + peck * 120;
  ell(ctx, 22 + peck * 18, -285 + peck * 70, 48, 62, 0.2 + peck * 0.8);
  fillStroke(ctx, "#fbf9f4", null);
  ell(ctx, hx, hy, 54, 48, 0.1);
  fillStroke(ctx, vgrad(ctx, hy - 52, hy + 50, [[0, "#ffffff"], [0.75, "#f1ece1"], [1, "#d6cfbe"]]), OUT, 2);

  // Bico adunco (gancho poderoso de rapina) com cera amarela e narina
  ctx.beginPath();
  ctx.moveTo(hx + 34, hy - 22);
  ctx.quadraticCurveTo(hx + 104, hy - 30, hx + 95, hy + 24);
  ctx.quadraticCurveTo(hx + 86, hy + 4, hx + 58, hy + 6);
  ctx.lineTo(hx + 32, hy + 12);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, hy - 30, hy + 24, [[0, "#ffd84d"], [0.6, "#f5a814"], [1, "#c97604"]]), OUT, 2.5);

  // Cera do bico (cere) e narina
  ctx.fillStyle = "#ffb31a";
  ell(ctx, hx + 42, hy - 14, 10, 14, 0.2);
  ctx.fill();
  circle(ctx, hx + 44, hy - 12, 2.2);
  ctx.fillStyle = "#1e1308";
  ctx.fill();

  // Olho penetrante de predador com crista supraorbital acentuada (sobrancelha feroz)
  const b = blinkAmt(t, 0.5);
  ctx.save();
  // Esclera e íris dourada intensa
  ctx.fillStyle = "#ffd23a";
  ell(ctx, hx + 20, hy - 12, 12.5, 12.5 * (1 - b * 0.9));
  ctx.fill();
  if (b < 0.7) {
    // Íris com anel externo escuro
    ctx.strokeStyle = "#8a5806";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Pupila
    ctx.fillStyle = "#0c0a07";
    circle(ctx, hx + 23, hy - 12, 6.8);
    ctx.fill();
    // Catchlight penetrante
    ctx.fillStyle = "#ffffff";
    circle(ctx, hx + 25, hy - 14, 2.6);
    ctx.fill();
  }
  // Sobrancelha ossuda proeminente da águia (expressão altiva e poderosa)
  ctx.strokeStyle = "#402a14";
  ctx.lineWidth = 6.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(hx + 2, hy - 30);
  ctx.lineTo(hx + 36, hy - 20);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/** Águia de frente, de asas abertas ("spread") ou em vôo aerodinâmico ("fly"/"glide"). */
function drawEagleFront(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "spread";
  const ph = t * (o.speed ?? 5.5);
  // Cinemática aerodinâmica real: batimento potente de asas com flexão aeroelástica
  const flap = anim === "fly" ? Math.sin(ph) : anim === "glide" ? Math.sin(ph * 0.35) * 0.22 : Math.sin(t * 1.4) * 0.05;
  const wingAng = -0.32 - flap * 0.65;
  const bob = anim === "fly" ? Math.sin(ph + 1.2) * 16 : Math.sin(t * 1.5) * 3.5;
  const bankTilt = anim === "glide" ? Math.sin(t * 0.8) * 0.08 : 0;
  const dark = "#24160c";
  const mid = "#422b17";
  const light = "#5a3c22";

  ctx.save();
  ctx.translate(0, bob);
  ctx.rotate(bankTilt);

  // Garras recolhidas aerodinamicamente sob o ventre durante o vôo
  if (anim !== "fly") {
    for (const x of [-22, 22]) {
      limb(ctx, x, -96, x, -24, 15, "#e8a91a", OUT);
      for (let k = -1; k <= 1; k++) limb(ctx, x, -24, x + k * 16, 4, 7, "#e8a91a", OUT);
    }
  } else {
    // Pernas recolhidas contra o corpo aerodinâmico
    for (const x of [-18, 18]) {
      limb(ctx, x, -100, x * 1.2, -54, 13, "#e8a91a", OUT);
      circle(ctx, x * 1.2 + 4, -54, 5);
      ctx.fillStyle = "#111";
      ctx.fill();
    }
  }

  // Cauda branca aberta em leque (profundor e leme de voo)
  ctx.save();
  ctx.translate(0, -96);
  const tailTilt = anim === "glide" ? Math.sin(t * 1.2) * 0.1 : 0;
  ctx.rotate(tailTilt);
  for (const a of [1.15, 1.35, 1.57, 1.8, 2.0]) {
    ctx.save();
    ctx.rotate(a);
    feather(ctx, 128, 40, "#fbfaf6", false);
    ctx.restore();
  }
  ctx.restore();

  // Asas gigantescas com curvatura e pontas fletidas pelo vento relativo
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 52, -256);
    ctx.scale(side, 1);
    ctx.rotate(wingAng);

    // Na descida da asa (downstroke), as penas primárias curvam para cima com a sustentação!
    const liftBend = flap > 0 ? flap * 0.15 : flap * 0.05;
    ctx.rotate(-liftBend);
    eagleWing(ctx, 430, "#2b1c11", "#422b17");
    ctx.restore();
  }

  // Tronco com quilha peitoral musculosa de rapina
  ell(ctx, 0, -190, 76, 126);
  fillStroke(ctx, vgrad(ctx, -315, -65, [[0, light], [0.45, mid], [1, dark]]), OUT, 2.2);

  // Plumagem peitoral estriada
  ctx.strokeStyle = "rgba(190,140,90,0.4)";
  ctx.lineWidth = 2.8;
  for (let r = 0; r < 5; r++) {
    for (let c = -2; c <= 2; c++) {
      ctx.beginPath();
      ctx.arc(c * 24, -230 + r * 26, 11, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }

  // Cabeça branca frontal majestosa
  ell(ctx, 0, -300, 66, 68);
  fillStroke(ctx, vgrad(ctx, -368, -232, [[0, "#ffffff"], [0.75, "#f1ece1"], [1, "#d6cfbe"]]), OUT, 2.2);

  // Bico frontal formidável
  ctx.beginPath();
  ctx.moveTo(-24, -312);
  ctx.quadraticCurveTo(0, -338, 24, -312);
  ctx.quadraticCurveTo(30, -272, 0, -248);
  ctx.quadraticCurveTo(-30, -272, -24, -312);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -338, -248, [[0, "#ffd84d"], [0.6, "#f5a814"], [1, "#c97604"]]), OUT, 2.8);

  ctx.strokeStyle = "rgba(120,70,0,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -300);
  ctx.lineTo(0, -260);
  ctx.stroke();

  // Olhos severos de predador frontal
  const b = blinkAmt(t, 0.4);
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#ffd23a";
    ell(ctx, side * 30, -326, 12.5, 12.5 * (1 - b * 0.9));
    ctx.fill();
    if (b < 0.7) {
      ctx.fillStyle = "#0c0a07";
      circle(ctx, side * 30, -326, 6.8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      circle(ctx, side * 30 + side * 1.5, -328, 2.5);
      ctx.fill();
    }
    // Sobrancelha frontal severa
    ctx.strokeStyle = "#402a14";
    ctx.lineWidth = 7.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(side * 8, -346);
    ctx.lineTo(side * 48, -336);
    ctx.stroke();
  }

  ctx.restore();
}

/* ------------------------------ lebre ------------------------------ */

export function drawHare(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  const run = anim === "run";
  const sleep = anim === "sleep";
  const ph = t * (o.speed ?? 11);
  const g = run ? Math.sin(ph) : 0;
  // Galope lagomorfo realístico: suspensão elástica potente com flexão espinhal
  const hop = run ? Math.abs(Math.sin(ph)) * 34 : 0;
  const fur = "#b89568";
  const furD = "#84623a";
  const furL = "#d9b88a";

  ctx.save();

  if (sleep) {
    const br = Math.sin(t * 1.8) * 3;
    ell(ctx, 0, -48 + br * 0.3, 114, 54 + br);
    fillStroke(ctx, vgrad(ctx, -102, 0, [[0, fur], [0.6, furD], [1, "#543b1e"]]), OUT, 2);
    // Anca dobrada em repouso
    ell(ctx, -70, -50, 42, 38);
    fillStroke(ctx, furD, OUT, 2);
    // Rabinho de algodão branco
    circle(ctx, -110, -56, 24);
    fillStroke(ctx, rgrad(ctx, -110, -56, 4, 24, [[0, "#ffffff"], [0.7, "#f5ede1"], [1, "#d6caba"]]), OUT, 1.8);
    // Cabeça pousada
    ell(ctx, 96, -60, 48, 36, 0.1);
    fillStroke(ctx, fur, OUT, 2);
    // Orelhas longas deitadas para trás ao longo das costas
    ell(ctx, 80, -86, 22, 60, -1.45);
    fillStroke(ctx, fur, OUT, 2);
    ell(ctx, 52, -78, 20, 58, -1.5);
    fillStroke(ctx, furD, OUT, 2);
    // Olho fechado em sono sereno
    ctx.strokeStyle = "#2a1a0e";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(100, -66, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Narizinho rosa com micro-respiração
    circle(ctx, 136, -56, 6.5);
    ctx.fillStyle = "#e08080";
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.translate(0, -hop);
  // Inclinação do corpo durante o ciclo de galope
  ctx.rotate(run ? -g * 0.14 : 0);

  // Patas dianteiras ágeis com articulação de carpo
  const front = run ? 38 : 6;
  limb(ctx, 64, -62, 64 + front * (0.6 + g * 0.6), -4 + hop * 0.2, 20, furD, OUT);
  limb(ctx, 48, -62, 48 + front * (0.6 - g * 0.6), -4 + hop * 0.2, 19, fur, OUT);

  // Orelhas compridas (atrás da cabeça) com veias sutis e pontas escuras
  const ear = run ? 0.58 + g * 0.18 : 0.16 + Math.sin(t * 2.2) * 0.05;
  ctx.save();
  ctx.translate(96, -150);
  ctx.rotate(-ear - 0.15);
  ell(ctx, -26, -68, 22, 82, -0.1);
  fillStroke(ctx, vgrad(ctx, -150, 0, [[0, "#261a0e"], [0.25, furD], [1, fur]]), OUT, 1.8);
  ctx.restore();

  // Tronco alongado e atlético de lebre selvagem
  ell(ctx, 0, -92, 102, 60, run ? -0.05 : 0);
  fillStroke(ctx, vgrad(ctx, -152, -32, [[0, furL], [0.45, fur], [1, furD]]), OUT, 2.2);

  // Ventre e peito em tom creme claro
  ell(ctx, 16, -72, 64, 32);
  ctx.fillStyle = "#f8efe0";
  ctx.fill();

  // Pata traseira longa e musculosa (máquina de propulsão dos lagomorfos)
  const back = run ? 58 : 18;
  ell(ctx, -52, -78, 54, 52, run ? g * 0.2 : 0);
  fillStroke(ctx, fur, OUT, 2);
  ell(ctx, -52 - back * (0.2 - g * 0.55), -16, 56, 16, run ? g * 0.25 : 0.0);
  fillStroke(ctx, furD, OUT, 2);

  // Rabinho fofo de algodão
  circle(ctx, -98, -108, 25);
  fillStroke(ctx, rgrad(ctx, -98, -108, 4, 25, [[0, "#ffffff"], [0.7, "#f5ede1"], [1, "#d4c8b6"]]), OUT, 1.8);

  // Cabeça expressiva com focinho afilado
  ell(ctx, 106, -130, 48, 40, -0.2);
  fillStroke(ctx, vgrad(ctx, -170, -90, [[0, furL], [0.6, fur], [1, furD]]), OUT, 2);

  // Bochecha clara e bigodes
  ell(ctx, 132, -120, 24, 18, -0.2);
  fillStroke(ctx, "#fff3e4", null);

  // Focinho e narina rosa
  circle(ctx, 150, -128, 7.5);
  ctx.fillStyle = "#e07280";
  ctx.fill();

  // Orelha dianteira longa com interior rosado e ponta preta característica
  ctx.save();
  ctx.translate(88, -150);
  ctx.rotate(-ear + 0.1);
  ell(ctx, -22, -70, 22, 84, -0.05);
  fillStroke(ctx, vgrad(ctx, -154, 0, [[0, "#1f150c"], [0.22, fur], [1, furD]]), OUT, 2);
  // Interior rosado translúcido com vaso sanguíneo
  ell(ctx, -22, -66, 11, 62, -0.05);
  ctx.fillStyle = "#e89ea0";
  ctx.fill();
  ctx.strokeStyle = "rgba(180,60,70,0.35)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-22, -35);
  ctx.lineTo(-22, -95);
  ctx.stroke();
  ctx.restore();

  // Olho grande lateral de lebre com íris âmbar e brilho panorâmico
  eye(ctx, 118, -140, 8.5, t, 0.2, "#b86214");

  // Vibrissas (bigodes finos longos e translúcidos)
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 1.8;
  for (const dy of [-3, 3, 9]) {
    ctx.beginPath();
    ctx.moveTo(140, -118 + dy);
    ctx.quadraticCurveTo(160, -120 + dy * 1.5, 184, -124 + dy * 2.2);
    ctx.stroke();
  }

  ctx.restore();
}

/* ------------------------------ tartaruga ------------------------------ */

export function drawTortoise(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = (o.anim ?? "walk") === "walk";
  const ph = t * (o.speed ?? 2.2);
  const bob = walk ? Math.sin(ph * 2) * 2.5 : 0;
  // Pescoço enrugado se estende e retrai a cada passada cadenciada
  const headBob = walk ? Math.sin(ph) * 8 : Math.sin(t * 1.5) * 2;
  const legs = [-76, -32, 40, 84];

  ctx.save();
  ctx.translate(0, -bob);

  // 4 patas colunares com escamas rígidas e unhas de réptil
  legs.forEach((x, i) => {
    const sw = walk ? Math.sin(ph + (i % 2) * Math.PI) * 12 : 0;
    const px = x + sw;
    ell(ctx, px, -14, 21, 25);
    fillStroke(ctx, vgrad(ctx, -38, 10, [[0, i % 2 ? "#6f8d48" : "#82a154"], [1, "#445e2a"]]), OUT, 2);
    // Garras da pata
    ctx.fillStyle = "#e5dfce";
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      ctx.moveTo(px + c * 7, 6);
      ctx.lineTo(px + c * 7 + 4, 11);
      ctx.lineTo(px + c * 7 - 4, 11);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Pescoço retrátil enrugado com dobras de pele
  ctx.save();
  ctx.strokeStyle = "#5a7a36";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(90, -44);
  ctx.lineTo(130 + headBob, -64 + Math.sin(ph) * 2);
  ctx.stroke();
  // Dobras do pescoço
  ctx.strokeStyle = "rgba(40,55,20,0.35)";
  ctx.lineWidth = 2;
  for (let nx = 100; nx <= 122; nx += 8) {
    ctx.beginPath();
    ctx.moveTo(nx + headBob * 0.5, -48);
    ctx.lineTo(nx + headBob * 0.5 - 2, -62);
    ctx.stroke();
  }
  ctx.restore();

  // Cabeça ancestral de réptil
  ell(ctx, 136 + headBob, -66 + Math.sin(ph) * 2, 38, 30, -0.1);
  fillStroke(ctx, vgrad(ctx, -96, -36, [[0, "#98b965"], [1, "#547333"]]), OUT, 2);

  // Olho atento e sábio
  eye(ctx, 150 + headBob, -74, 7.5, t, 1.1, "#3d541e");

  // Boca curva com bico córneo
  ctx.strokeStyle = "#2b3b16";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(154 + headBob, -60, 10, 0.2, 1.7);
  ctx.stroke();

  // Carapaça 3D convexa com escudos poligonais e anéis de crescimento (annuli)
  ctx.beginPath();
  ctx.ellipse(0, -46, 128, 90, 0, Math.PI, 0);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -136, -40, [[0, "#76aa4e"], [0.45, "#528036"], [1, "#325320"]]), OUT, 2.5);

  // Escudos detalhados com relevo e chanfros dourados/âmbar
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(25, 45, 12, 0.65)";
  ctx.lineWidth = 3;
  for (const [cx, cy, rx, ry] of [
    [0, -96, 42, 32],
    [-64, -66, 38, 30],
    [64, -66, 38, 30],
    [-98, -46, 28, 24],
    [98, -46, 28, 24],
    [0, -46, 40, 26],
  ] as const) {
    // Escudo exterior
    ell(ctx, cx, cy, rx, ry);
    fillStroke(ctx, vgrad(ctx, cy - ry, cy + ry, [[0, "#8ebd5c"], [0.6, "#5b8b38"], [1, "#365922"]]), "rgba(25, 45, 12, 0.65)", 2);
    // Anel de crescimento concêntrico
    ell(ctx, cx, cy, rx * 0.65, ry * 0.65);
    ctx.strokeStyle = "rgba(215, 190, 110, 0.4)";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }
  ctx.restore();

  // Plastron inferior (borda inferior da carapaça)
  ell(ctx, 0, -42, 130, 18);
  fillStroke(ctx, vgrad(ctx, -52, -32, [[0, "#dec485"], [1, "#aa8d4e"]]), OUT, 2);

  ctx.restore();
}

/* ------------------------------ raposa ------------------------------ */

export function drawFox(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = o.anim === "walk";
  const ph = t * (o.speed ?? 6);
  const sway = Math.sin(t * 2.2);
  const orange = "#e57426";
  const orangeD = "#b34e14";
  const orangeL = "#f79148";
  const l = walk ? Math.sin(ph) * 22 : 0;

  ctx.save();
  ctx.translate(0, walk ? -Math.abs(Math.sin(ph)) * 4.5 : 0);

  // Cauda volumosa ("brush") com ponta branca e inércia fluida de onda
  ctx.save();
  ctx.translate(-96, -124);
  const tailSway = 0.32 + Math.sin(t * 2.2 - (walk ? ph * 0.3 : 0)) * 0.12;
  ctx.rotate(tailSway);
  smoothPath(ctx, [[0, 0], [-64, -52], [-155, -36], [-175, 24], [-115, 56], [-42, 38], [0, 18]], true);
  fillStroke(ctx, vgrad(ctx, -52, 58, [[0, orangeL], [0.5, orange], [1, orangeD]]), OUT, 2);

  // Ponta branca ("tag") da cauda da raposa
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#fff8f0";
  ctx.beginPath();
  ctx.ellipse(-164, 12, 58, 64, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // Patas esguias com meias pretas características da raposa (Vulpes vulpes)
  for (const [x, s, c] of [[-70, 1, orangeD], [-34, -1, orange], [52, -1, orangeD], [86, 1, orange]] as const) {
    const footX = x + l * s * 0.8;
    // Meia preta elegante até os dedos
    limb(ctx, x, -76, footX, -6, 19, "#2b180d", OUT);
    // Parte superior da perna ruiva
    limb(ctx, x, -76, x + l * s * 0.4, -50, 23, c, null);
    // Dedos da pata
    circle(ctx, footX + 4, -4, 5);
    ctx.fillStyle = "#1e1008";
    ctx.fill();
  }

  // Tronco ágil e esguio
  ell(ctx, 0, -118, 114, 60, -0.03);
  fillStroke(ctx, vgrad(ctx, -180, -58, [[0, orangeL], [0.55, orange], [1, orangeD]]), OUT, 2.2);

  // Peito e ventre branco como a neve
  ell(ctx, 44, -96, 62, 32, 0.1);
  ctx.fillStyle = "#fff7ee";
  ctx.fill();

  // Cabeça elegante com focinho afilado
  ctx.save();
  ctx.translate(114, -170);
  ctx.rotate(-0.06 + Math.sin(t * 1.4) * 0.03);

  // Orelhas triangulares eretas com dorso preto e pelagem branca interna
  for (const [x, ang] of [[-6, -0.3], [20, 0.1]] as const) {
    ctx.save();
    ctx.translate(x, -28);
    ctx.rotate(ang);
    // Casca exterior ruiva
    ctx.beginPath();
    ctx.moveTo(-19, 6);
    ctx.lineTo(2, -54);
    ctx.lineTo(23, 6);
    ctx.closePath();
    fillStroke(ctx, orange, OUT, 2);
    // Dorso preto característico
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.lineTo(2, -36);
    ctx.lineTo(13, 2);
    ctx.closePath();
    ctx.fillStyle = "#22140a";
    ctx.fill();
    // Pelos brancos de isolamento dentro da orelha
    ctx.fillStyle = "#fffaf2";
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(2, -26);
    ctx.lineTo(8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Crânio ruivo esculpido
  ell(ctx, 0, 0, 54, 44);
  fillStroke(ctx, vgrad(ctx, -44, 44, [[0, orangeL], [0.6, orange], [1, orangeD]]), OUT, 2);

  // Focinho branco afilado
  ctx.beginPath();
  ctx.moveTo(14, -14);
  ctx.quadraticCurveTo(78, -6, 94, 14);
  ctx.quadraticCurveTo(62, 38, 8, 30);
  ctx.closePath();
  fillStroke(ctx, "#fff8f0", OUT, 2);

  // Trufa preta (nariz) úmida com brilho especular
  circle(ctx, 94, 12, 9.5);
  fillStroke(ctx, "#180e07", null);
  circle(ctx, 96, 10, 2.8);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Olho matreiro e inteligente com fenda pupilar vulpina
  eye(ctx, 28, -14, 10, t, 0.65, "#d4861e", true);

  // Linha do focinho e bigodes finos
  ctx.strokeStyle = "#3a2010";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(92, 18);
  ctx.quadraticCurveTo(80, 28, 54, 26);
  ctx.stroke();

  ctx.restore(); // fim da cabeça
  ctx.restore(); // fim da raposa
}

/* ------------------------------ corvo ------------------------------ */

export function drawCrow(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  const flap = anim === "fly";
  const caw = anim === "caw";
  const open = caw ? 0.45 + 0.55 * Math.max(0, Math.sin(t * 7)) : 0;
  const ph = t * 12;

  ctx.save();
  ctx.translate(0, flap ? -Math.abs(Math.sin(ph)) * 14 : 0);
  if (anim === "drink") {
    ctx.translate(0, -30);
    ctx.rotate(0.55 + Math.sin(t * 2.4) * 0.06);
  }

  const black = "#151822";
  const sheen = "#2e3a58";
  const irid = "#3d4e78";

  // Pernas corvinas escuras com garras
  limb(ctx, -8, -34, -8, 0, 8.5, "#2b2f3a", OUT);
  limb(ctx, 16, -34, 16, 0, 8.5, "#2b2f3a", OUT);

  // Cauda em cunha preta com reflexo furta-cor
  ctx.save();
  ctx.translate(-42, -50);
  ctx.rotate(2.5 + (caw ? Math.sin(t * 8) * 0.08 : 0));
  feather(ctx, 104, 36, black, true);
  ctx.restore();

  // Corpo musculoso de corvídeo com reflexo metálico azul-petróleo
  ell(ctx, 0, -86, 50, 64, 0.35);
  fillStroke(ctx, vgrad(ctx, -150, -20, [[0, irid], [0.4, sheen], [0.8, black], [1, "#0a0c12"]]), "rgba(0,0,0,0.5)", 2);

  // Asa com penas primárias articuladas e brilho sedoso
  ctx.save();
  ctx.translate(-6, -100);
  ctx.rotate(flap ? -0.65 + Math.sin(ph) * 0.85 : 0.48);
  ell(ctx, -20, 20, 28, 66, 0.15);
  fillStroke(ctx, vgrad(ctx, -40, 80, [[0, irid], [0.6, sheen], [1, black]]), "rgba(0,0,0,0.5)", 2);
  ctx.restore();

  // Cabeça e garganta com penas que se eriçam ao grasnar (caw)
  const throatPuff = caw ? 6 : 0;
  circle(ctx, 42, -138, 33 + throatPuff * 0.3);
  fillStroke(ctx, vgrad(ctx, -172, -105, [[0, irid], [0.55, sheen], [1, black]]), "rgba(0,0,0,0.5)", 2);

  // Bico corvino robusto, arqueado e poderoso
  // Parte superior do bico com cerdas nasais
  ctx.save();
  ctx.translate(64, -140);
  ctx.rotate(-open * 0.22);
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.quadraticCurveTo(34, -10, 58, 0);
  ctx.lineTo(0, 3);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -13, 3, [[0, "#4a5160"], [1, "#1e222a"]]), "rgba(0,0,0,0.5)", 2);

  // Cerdas nasais no topo do bico (característica única e realista dos corvos!)
  ctx.strokeStyle = "#0c0d12";
  ctx.lineWidth = 1.8;
  for (let b = 4; b <= 18; b += 4) {
    ctx.beginPath();
    ctx.moveTo(b, -10);
    ctx.lineTo(b + 5, -14);
    ctx.stroke();
  }
  ctx.restore();

  // Mandíbula inferior do bico
  ctx.save();
  ctx.translate(64, -136);
  ctx.rotate(open * 0.38);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(50, 4);
  ctx.lineTo(0, 13);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, 0, 13, [[0, "#3a404c"], [1, "#161920"]]), "rgba(0,0,0,0.5)", 2);

  // Língua visível quando grasna
  if (open > 0.2) {
    ctx.fillStyle = "#b8546a";
    ell(ctx, 16, 2, 8, 3, 0.1);
    ctx.fill();
  }
  ctx.restore();

  // Itens transportados no bico
  if (o.carry === "pebble") {
    ctx.save();
    ctx.translate(100, -132);
    ell(ctx, 0, 0, 14, 10, 0.2);
    fillStroke(ctx, vgrad(ctx, -10, 10, [[0, "#b0b8c2"], [1, "#5a626c"]]), "rgba(0,0,0,0.4)", 2);
    ctx.restore();
  }
  if (o.carry === "cheese" && !caw) {
    ctx.save();
    ctx.translate(88, -136);
    drawCheese(ctx, 0.75);
    ctx.restore();
  }

  // Olho corvino inteligente, vigilante e profundo
  eye(ctx, 50, -146, 7.5, t, 0.4, "#241e1b");

  ctx.restore();
}

/* ------------------------------ queijo ------------------------------ */

export function drawCheese(ctx: Ctx, s = 1) {
  ctx.save();
  ctx.scale(s, s);

  // Fatia suíça tridimensional com casca dourada e textura
  ctx.beginPath();
  ctx.moveTo(-36, 10);
  ctx.lineTo(36, -12);
  ctx.lineTo(36, 22);
  ctx.lineTo(-36, 30);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -12, 30, [[0, "#ffcb3b"], [0.6, "#f5b722"], [1, "#d48e0a"]]), "rgba(100,60,0,0.5)", 2.5);

  // Face superior chanfrada iluminada
  ctx.beginPath();
  ctx.moveTo(-36, 10);
  ctx.lineTo(36, -12);
  ctx.lineTo(44, -5);
  ctx.lineTo(-28, 17);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -12, 17, [[0, "#fff094"], [1, "#fcd65b"]]), "rgba(100,60,0,0.35)", 1.8);

  // Olhos do queijo (buracos com sombra esférica realista)
  for (const [x, y, rx, ry] of [[-10, 19, 7, 5], [16, 9, 6, 4.5], [-24, 21, 5, 3.5], [22, 19, 4, 3]] as const) {
    ctx.fillStyle = "rgba(160, 95, 10, 0.55)";
    ell(ctx, x, y, rx, ry);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    circle(ctx, x + rx * 0.3, y - ry * 0.2, rx * 0.25);
    ctx.fill();
  }

  ctx.restore();
}

/* ------------------------------ formiga ------------------------------ */

export function drawAnt(ctx: Ctx, t: number, o: PoseOpts) {
  const walk = (o.anim ?? "walk") !== "idle";
  const ph = t * (o.speed ?? 9);
  const c = "#4d1d12";
  const cl = "#7a3120";

  ctx.save();
  ctx.translate(0, walk ? -Math.abs(Math.sin(ph)) * 2 : 0);

  // 6 patas articuladas com marcha trípode verdadeira dos insetos
  // Trípode 1 (patas 0, 2 esquerda + 1 direita) apoia enquanto trípode 2 avança!
  for (let i = 0; i < 3; i++) {
    const x = -8 + i * 22;
    const tripod = (i % 2 === 0 ? 1 : -1);
    const sw = walk ? Math.sin(ph) * 13 * tripod : 0;
    // Pata traseira/lateral com fêmur e tíbia articulados
    limb(ctx, x, -34, x + sw * 0.6, -16, 5, c, null);
    limb(ctx, x + sw * 0.6, -16, x + sw, 0, 4, c, null);
  }

  // Abdômen (gáster) com cutícula quitinosa reluzente
  ell(ctx, -52, -44, 52, 38, -0.1);
  fillStroke(ctx, vgrad(ctx, -88, -6, [[0, cl], [0.55, c], [1, "#260c07"]]), OUT, 2);

  // Cintura (pecíolo) delgada
  ell(ctx, -14, -46, 8, 10);
  fillStroke(ctx, "#36120b", null);

  // Tórax (mesossoma) musculoso
  ell(ctx, 10, -48, 28, 24);
  fillStroke(ctx, vgrad(ctx, -72, -24, [[0, cl], [1, c]]), OUT, 2);

  // Cabeça com mandíbulas afiadas
  circle(ctx, 58, -56, 28);
  fillStroke(ctx, vgrad(ctx, -84, -28, [[0, cl], [0.6, c], [1, "#260c07"]]), OUT, 2);

  // Olho composto com reflexo de cutícula
  eye(ctx, 68, -62, 7.5, t, 0.4, "#1a0805");

  // Antenas móveis sensíveis articuladas em cotovelo
  ctx.strokeStyle = c;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  for (const s of [-1, 1]) {
    const tap = Math.sin(t * 6 + s) * 5;
    ctx.beginPath();
    ctx.moveTo(72, -76);
    ctx.lineTo(88 + s * 6, -100 + tap * 0.5);
    ctx.lineTo(112 + s * 14, -92 + tap);
    ctx.stroke();
  }

  // Mandíbulas cortantes
  ctx.fillStyle = "#260c07";
  ctx.beginPath();
  ctx.moveTo(80, -48);
  ctx.lineTo(92, -42);
  ctx.lineTo(82, -36);
  ctx.closePath();
  ctx.fill();

  if (o.carry === "grain") {
    ctx.save();
    ctx.translate(16, -94);
    ell(ctx, 0, 0, 36, 22, -0.2);
    fillStroke(ctx, vgrad(ctx, -22, 22, [[0, "#ffe88a"], [0.6, "#f0cb46"], [1, "#c49814"]]), "rgba(100,70,0,0.5)", 2);
    ctx.restore();
  }

  ctx.restore();
}

/* ------------------------------ cigarra ------------------------------ */

export function drawCicada(ctx: Ctx, t: number, o: PoseOpts) {
  const sing = (o.anim ?? "sing") === "sing";
  const sleep = o.anim === "sleep";
  const vib = sing ? Math.sin(t * 42) * 0.08 : Math.sin(t * 2) * 0.02;
  const bounce = sing ? Math.abs(Math.sin(t * 4.5)) * 6.5 : 0;

  ctx.save();
  ctx.translate(0, -bounce);

  // Pernas de inseto articuladas
  limb(ctx, -10, -40, -12, 0, 6, "#3f5918", OUT);
  limb(ctx, 14, -40, 16, 0, 6, "#3f5918", OUT);

  // Asas vítreas transparentes com nervuras delicadas
  for (const [a, al] of [[-1.15 + vib, 0.65], [-0.85 - vib, 0.45]] as const) {
    ctx.save();
    ctx.translate(-4, -96);
    ctx.rotate(a);
    ell(ctx, -82, 0, 88, 26);
    ctx.fillStyle = `rgba(235, 252, 235, ${al})`;
    ctx.fill();
    ctx.strokeStyle = "rgba(70, 110, 50, 0.75)";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Nervuras da asa
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(-156, -5);
    ctx.moveTo(-44, 0);
    ctx.lineTo(-125, 14);
    ctx.moveTo(-70, -2);
    ctx.lineTo(-110, -16);
    ctx.stroke();
    ctx.restore();
  }

  // Abdômen com timbais vibratórios
  ell(ctx, 0, -66, 38, 58, 0.1);
  fillStroke(ctx, vgrad(ctx, -126, -8, [[0, "#a6db3a"], [0.6, "#78ad24"], [1, "#446914"]]), OUT, 2.2);

  // Segmentos quitinosos do abdômen
  ctx.fillStyle = "rgba(20,40,10,0.3)";
  for (let i = 0; i < 4; i++) {
    ell(ctx, 0, -48 + i * 10, 32 - i * 3, 3);
    ctx.fill();
  }

  // Cabeça verde robusta
  circle(ctx, 18, -128, 30);
  fillStroke(ctx, vgrad(ctx, -158, -98, [[0, "#b8e647"], [1, "#6ba11e"]]), OUT, 2);

  // Grandes olhos facetados avermelhados com brilho
  ctx.fillStyle = "#c92424";
  circle(ctx, 32, -136, 11);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  circle(ctx, 35, -139, 3);
  ctx.fill();

  // Boca cantando
  ctx.fillStyle = "#3a1212";
  ell(ctx, 36, -112, 8, sing ? 6 + Math.abs(Math.sin(t * 6)) * 6 : 3);
  ctx.fill();

  ctx.restore();
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

function drawRealisticHand(
  ctx: Ctx,
  x: number,
  y: number,
  rot: number,
  skinBase: string,
  skinShadow: string,
  pose: "relaxed" | "open" | "point" | "fist" | "hold" = "relaxed"
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // Palma da mão esculpida com volume
  ctx.fillStyle = skinBase;
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.roundRect(-6, -7, 12, 13, [3, 3, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // Eminência tênar e polegar anatômico articulado
  ctx.beginPath();
  ctx.moveTo(-5, -2);
  ctx.quadraticCurveTo(-11, 2, -10, 6);
  ctx.quadraticCurveTo(-6, 8, -3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dedos com falanges anatômicas individuais
  if (pose === "point") {
    // Dedo indicador apontado
    ctx.beginPath();
    ctx.roundRect(0, 5, 4.2, 15, 2);
    ctx.fill();
    ctx.stroke();
    // Dedos médios/anelar/mínimo recolhidos na palma
    ctx.beginPath();
    ctx.roundRect(-5, 4, 6, 6, 2);
    ctx.fill();
    ctx.stroke();
  } else if (pose === "open" || pose === "relaxed") {
    // 4 dedos com juntas e comprimentos escalonados
    const lengths = [10, 12, 11, 8.5];
    for (let i = 0; i < 4; i++) {
      const fx = -4.5 + i * 2.8;
      const fLen = pose === "open" ? lengths[i] : lengths[i] * 0.75;
      ctx.beginPath();
      ctx.roundRect(fx, 5, 2.5, fLen, 1.2);
      ctx.fill();
      ctx.stroke();
      // Dobra articular sutil
      ctx.strokeStyle = skinShadow;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(fx + 0.3, 5 + fLen * 0.5);
      ctx.lineTo(fx + 2.2, 5 + fLen * 0.5);
      ctx.stroke();
      ctx.strokeStyle = OUT;
      ctx.lineWidth = 1.5;
    }
  } else {
    // Mão em formato de concha/segurar firme
    ctx.beginPath();
    ctx.roundRect(-5, 4, 10, 8, 3);
    ctx.fill();
    ctx.stroke();
  }

  // Sombra suave sob a palma
  ctx.fillStyle = skinShadow;
  ctx.beginPath();
  ell(ctx, -1, -1, 3, 4, 0.3);
  ctx.fill();

  ctx.restore();
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
  const armSwing = walk ? Math.sin(ph) * 20 : 0;

  // Cinemática bípede realista com flexão de joelho e rolamento do pé
  const thighLen = 76;
  const shinLen = 72;

  // Perna da frente (fase ph)
  const thighAngleF = walk ? Math.sin(ph) * 0.38 : 0.04;
  const kneeFlexF = walk ? Math.max(0, -Math.sin(ph + 0.4)) * 0.55 : 0.02;
  const shinAngleF = thighAngleF - kneeFlexF;
  const footAngleF = walk ? Math.sin(ph - 0.4) * 0.26 : 0;

  const kxF = Math.sin(thighAngleF) * thighLen;
  const kyF = Math.cos(thighAngleF) * thighLen;
  const axF = kxF + Math.sin(shinAngleF) * shinLen;
  const ayF = kyF + Math.cos(shinAngleF) * shinLen;

  // Perna de trás (fase oposta ph + PI)
  const thighAngleB = walk ? Math.sin(ph + Math.PI) * 0.38 : -0.04;
  const kneeFlexB = walk ? Math.max(0, -Math.sin(ph + Math.PI + 0.4)) * 0.55 : 0.02;
  const shinAngleB = thighAngleB - kneeFlexB;
  const footAngleB = walk ? Math.sin(ph + Math.PI - 0.4) * 0.26 : 0;

  const kxB = Math.sin(thighAngleB) * thighLen;
  const kyB = Math.cos(thighAngleB) * thighLen;
  const axB = kxB + Math.sin(shinAngleB) * shinLen;
  const ayB = kyB + Math.cos(shinAngleB) * shinLen;

  ctx.save();
  ctx.translate(0, -bob);

  // 1. PERNA DE TRÁS
  ctx.save();
  ctx.translate(-10, -160);
  limb(ctx, 0, 0, kxB, kyB, 28, cfg.pantsShadow, OUT);
  limb(ctx, kxB, kyB, axB, ayB, 24, cfg.pantsShadow, OUT);
  // Sapato de trás com rolamento anatômico
  ctx.translate(axB, ayB);
  ctx.rotate(footAngleB);
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

  // 2. BRAÇO DE TRÁS COM MÃO ARTICULADA
  ctx.save();
  const backArmY = -280 + breathe;
  if (carryTank) {
    limb(ctx, -10, backArmY, 35, -220, 22, cfg.shirtShadow, OUT);
    limb(ctx, 35, -220, 70, -210, 18, cfg.skinShadow, OUT);
    drawRealisticHand(ctx, 70, -210, 0.4, cfg.skinShadow, cfg.skinShadow, "hold");
  } else if (work) {
    limb(ctx, -10, backArmY, 20, -220, 22, cfg.shirtShadow, OUT);
    limb(ctx, 20, -220, 45, -190, 18, cfg.skinShadow, OUT);
    drawRealisticHand(ctx, 45, -190, 0.8, cfg.skinShadow, cfg.skinShadow, "relaxed");
  } else {
    const swingB = walk ? -armSwing : sad ? 5 : 0;
    limb(ctx, -8, backArmY, -8 + swingB, -190, 22, cfg.shirtShadow, OUT);
    drawRealisticHand(ctx, -8 + swingB, -180, 0.1, cfg.skinShadow, cfg.skinShadow, "relaxed");
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

  // 4. PERNA DA FRENTE COM ARTICULAÇÃO REALISTA
  ctx.save();
  ctx.translate(10, -160);
  limb(ctx, 0, 0, kxF, kyF, 30, cfg.pantsColor, OUT);
  limb(ctx, kxF, kyF, axF, ayF, 26, cfg.pantsColor, OUT);

  // Sapato da frente
  ctx.translate(axF, ayF);
  ctx.rotate(footAngleF);
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

  // 5. BRAÇO DA FRENTE COM ARTICULAÇÃO DINÂMICA E MÃOS REALISTAS
  ctx.save();
  const armY = -282 + breathe;
  if (wave) {
    // Acenando alegremente
    const waveHand = Math.sin(t * 8) * 16;
    limb(ctx, 8, armY, 60, -350, 24, cfg.shirtColor, OUT);
    limb(ctx, 60, -350, 84 + waveHand, -420, 22, cfg.shirtColor, OUT);
    drawRealisticHand(ctx, 86 + waveHand, -430, -Math.PI * 0.5 + Math.sin(t * 8) * 0.3, cfg.skinBase, cfg.skinShadow, "open");
  } else if (point) {
    // Apontando confiantemente para a frente (Marcos mostrando o carro)
    limb(ctx, 8, armY, 75, -270, 24, cfg.shirtColor, OUT);
    limb(ctx, 75, -270, 140, -260, 22, cfg.skinBase, OUT);
    drawRealisticHand(ctx, 144, -260, 1.5, cfg.skinBase, cfg.skinShadow, "point");
  } else if (shock) {
    // Chocado, mãos próximas ao rosto / peito
    limb(ctx, 8, armY, 40, -330, 24, cfg.shirtColor, OUT);
    limb(ctx, 40, -330, 50, -370, 20, cfg.skinBase, OUT);
    drawRealisticHand(ctx, 52, -374, -0.6, cfg.skinBase, cfg.skinShadow, "open");
  } else if (talk) {
    // Gesticulando enquanto fala
    const gesture = Math.sin(t * 4) * 8;
    limb(ctx, 8, armY, 55, -270, 24, cfg.shirtColor, OUT);
    limb(ctx, 55, -270, 85 + gesture, -300, 20, cfg.skinBase, OUT);
    drawRealisticHand(ctx, 90 + gesture, -304, 0.6 + Math.sin(t * 4) * 0.2, cfg.skinBase, cfg.skinShadow, "relaxed");
  } else if (dropStone) {
    // Sabrina soltando a pedra com tristeza no aquário
    limb(ctx, 8, armY, 55, -280, 22, cfg.shirtColor, OUT);
    limb(ctx, 55, -280, 95, -260, 18, cfg.skinBase, OUT);
    drawRealisticHand(ctx, 98, -258, 0.4, cfg.skinBase, cfg.skinShadow, "relaxed");
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
    drawRealisticHand(ctx, 94, -224, 0.4, cfg.skinBase, cfg.skinShadow, "hold");
  } else if (work) {
    // Trabalhando/digitando
    limb(ctx, 8, armY, 35, -220, 24, cfg.shirtColor, OUT);
    limb(ctx, 35, -220, 65, -195, 20, cfg.skinBase, OUT);
    drawRealisticHand(ctx, 70, -195, 0.9, cfg.skinBase, cfg.skinShadow, "relaxed");
  } else if (sad) {
    // Triste / derrotado, braço caído
    limb(ctx, 8, armY, 14, -185, 24, cfg.shirtColor, OUT);
    drawRealisticHand(ctx, 16, -170, 0.1, cfg.skinBase, cfg.skinShadow, "relaxed");
  } else {
    // Idle / natural walk
    const swingF = walk ? armSwing : 0;
    limb(ctx, 8, armY, 8 + swingF * 0.7, -190, 24, cfg.shirtColor, OUT);
    drawRealisticHand(ctx, 8 + swingF * 0.7, -178, 0.1, cfg.skinBase, cfg.skinShadow, "relaxed");
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
  if (shock) {
    // Boca aberta em choque/surpresa
    ell(ctx, eyeX + 4, eyeY + 28, 6, 8);
    fillStroke(ctx, "#3b1616", "#260e0e", 1.5);
  } else if (sad) {
    // Cantos caídos com desilusão
    ctx.strokeStyle = "#6b332a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(eyeX - 2, eyeY + 29);
    ctx.quadraticCurveTo(eyeX + 4, eyeY + 26, eyeX + 10, eyeY + 30);
    ctx.stroke();
  } else if (talk) {
    // Articulação fonética realista com lábios, dentes e cavidade bucal
    const open = Math.abs(Math.sin(t * 7)) * 4.5;
    ctx.fillStyle = "#3d1313";
    ell(ctx, eyeX + 4, eyeY + 27, 7, 2 + open);
    ctx.fill();
    if (open > 2) {
      // Dentes superiores brancos
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(eyeX + 1, eyeY + 25, 6, 2);
    }
    // Lábio superior com arco do cupido
    ctx.strokeStyle = cfg.gender === "female" ? "#b84242" : "#7a372e";
    ctx.lineWidth = cfg.gender === "female" ? 2.5 : 2;
    ctx.beginPath();
    ctx.moveTo(eyeX - 3, eyeY + 25);
    ctx.quadraticCurveTo(eyeX + 1, eyeY + 23.5, eyeX + 4, eyeY + 25);
    ctx.quadraticCurveTo(eyeX + 7, eyeY + 23.5, eyeX + 11, eyeY + 25);
    ctx.stroke();
    // Lábio inferior
    ctx.beginPath();
    ctx.moveTo(eyeX - 2, eyeY + 27 + open * 0.5);
    ctx.quadraticCurveTo(eyeX + 4, eyeY + 29 + open * 0.7, eyeX + 10, eyeY + 27 + open * 0.5);
    ctx.stroke();
  } else {
    // Sorriso suave / calmo
    ctx.strokeStyle = cfg.gender === "female" ? "#b84242" : "#7a372e";
    ctx.lineWidth = cfg.gender === "female" ? 3.2 : 2.5;
    ctx.beginPath();
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

/* ------------------------------ leão ------------------------------ */

/* ------------------------------ leão ------------------------------ */

export function drawLion(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  const sleep = anim === "sleep";
  const roar = anim === "roar";
  const walk = anim === "walk";
  const ph = t * (o.speed ?? 4);
  const breathe = Math.sin(t * (sleep ? 1.4 : 2)) * (sleep ? 3 : 1.6);
  const tan = "#d99e3a";
  const tanD = "#a36d1b";
  const tanL = "#f2ba5c";
  const mane = "#7d3e12";
  const maneD = "#502408";
  const l = walk ? Math.sin(ph) * 24 : 0;

  ctx.save();

  if (sleep) {
    // Cauda relaxada com tufo
    ctx.save();
    ctx.translate(-152, -34);
    smoothPath(ctx, [[0, 0], [-52, -22], [-92, 10], [-72, 38]], false);
    ctx.lineWidth = 13;
    ctx.strokeStyle = tanD;
    ctx.stroke();
    ell(ctx, -68, 42, 18, 26, 0.4);
    fillStroke(ctx, mane, OUT, 1.8);
    ctx.restore();

    // Corpo deitado com respiração diafragmática profunda
    ell(ctx, 0, -52 + breathe * 0.25, 154, 56 + breathe);
    fillStroke(ctx, vgrad(ctx, -114, 0, [[0, tanL], [0.55, tan], [1, tanD]]), OUT, 2.2);

    // Juba deitada espalhada no chão
    circle(ctx, 132, -66, 80);
    fillStroke(ctx, vgrad(ctx, -145, 14, [[0, "#a86224"], [0.6, mane], [1, maneD]]), OUT, 2);

    // Cabeça pousada
    ell(ctx, 170, -50, 56, 48, 0.05);
    fillStroke(ctx, tan, OUT, 2);
    ell(ctx, 206, -40, 28, 20);
    fillStroke(ctx, "#f7e3b5", null);
    circle(ctx, 226, -48, 8.5);
    ctx.fillStyle = "#2d160b";
    ctx.fill();

    // Olho fechado em sono nobre
    ctx.strokeStyle = "#2a150a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(180, -62, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Pata dianteira estendida
    limb(ctx, 100, -22, 192, -6, 36, tan, OUT);
    ell(ctx, 198, -4, 26, 14);
    fillStroke(ctx, tanD, OUT, 2);

    ctx.restore();
    return;
  }

  // Cauda com movimentação fluida felina e tufo denso
  ctx.save();
  ctx.translate(-134, -152);
  const tailWave = Math.sin(t * 2) * 0.12;
  ctx.rotate(tailWave);
  smoothPath(ctx, [[0, 0], [-48, -32], [-88, -8], [-96, 52]], false);
  ctx.lineWidth = 14;
  ctx.strokeStyle = tanD;
  ctx.lineCap = "round";
  ctx.stroke();
  // Tufo escuro volumoso na ponta da cauda
  ell(ctx, -98, 64, 24, 36, 0.18);
  fillStroke(ctx, mane, OUT, 2);
  ctx.restore();

  // Patas musculosas com articulação pesada de grande felino e almofadas digitais
  for (const [x, s, c] of [[-86, 1, tanD], [-46, -1, tan], [66, -1, tanD], [106, 1, tan]] as const) {
    const footX = x + l * s;
    limb(ctx, x, -100, footX, -8, 38, c, OUT);
    // Pata arredondada com dedos e garras retráteis embainhadas
    ell(ctx, footX + 8, -6, 30, 16);
    fillStroke(ctx, c, OUT, 2.2);
    // Divisões dos dedos da pata
    ctx.strokeStyle = "rgba(40,20,5,0.4)";
    ctx.lineWidth = 2.2;
    for (let d = -1; d <= 1; d++) {
      ctx.beginPath();
      ctx.moveTo(footX + 8 + d * 9, -12);
      ctx.lineTo(footX + 8 + d * 9, 2);
      ctx.stroke();
    }
  }

  // Tronco poderoso com dorso musculoso e respiração peitoral
  ell(ctx, 0, -146 + breathe, 140, 76 + breathe);
  fillStroke(ctx, vgrad(ctx, -235, -68, [[0, tanL], [0.55, tan], [1, tanD]]), OUT, 2.2);

  // Ventre e peito com pelagem mais clara
  ell(ctx, 42, -114, 80, 38);
  ctx.fillStyle = "rgba(255, 242, 210, 0.42)";
  ctx.fill();

  // Juba monumental: várias camadas sobrepostas de fios espessos com gradiente áureo e sombra profunda
  ctx.save();
  ctx.translate(152, -214);
  const maneSway = Math.sin(t * 1.8) * 0.04;
  for (let i = 0; i < 20; i++) {
    ctx.save();
    ctx.rotate((i / 20) * TAU + maneSway + Math.sin(t * 2 + i) * 0.03);
    ctx.beginPath();
    ctx.moveTo(62, -24);
    ctx.lineTo(116 + (i % 2) * 16, 0);
    ctx.lineTo(62, 24);
    ctx.closePath();
    fillStroke(ctx, i % 2 ? mane : "#99551c", OUT, 2);
    ctx.restore();
  }
  // Volume central da juba com sombreamento esférico
  circle(ctx, 0, 0, 82);
  fillStroke(ctx, rgrad(ctx, -12, -12, 12, 95, [[0, "#be7428"], [0.65, mane], [1, maneD]]), OUT, 2.2);
  ctx.restore();

  // Cabeça soberana
  ctx.save();
  ctx.translate(160, -208);
  ell(ctx, 0, 0, 60, 58);
  fillStroke(ctx, vgrad(ctx, -58, 58, [[0, tanL], [0.6, tan], [1, tanD]]), OUT, 2);

  // Orelhas felinas arredondadas
  for (const x of [-32, 32]) {
    circle(ctx, x, -54, 19);
    fillStroke(ctx, tan, OUT, 2);
    circle(ctx, x, -54, 9);
    ctx.fillStyle = "#d4907a";
    ctx.fill();
  }

  // Focinho largo e almofadas de bigodes
  ell(ctx, 30, 22, 42, 32);
  fillStroke(ctx, "#f7e3b5", OUT, 2);

  // Trufa preta triangular com narinas
  ctx.beginPath();
  ctx.moveTo(14, 2);
  ctx.lineTo(50, 2);
  ctx.lineTo(32, 22);
  ctx.closePath();
  ctx.fillStyle = "#2d160b";
  ctx.fill();

  // Rugido com boca aberta e presas de marfim, ou mandíbula nobre
  if (roar) {
    const open = 14 + Math.abs(Math.sin(t * 6)) * 18;
    ctx.fillStyle = "#3d0e0e";
    ell(ctx, 32, 42 + open * 0.3, 26, open);
    ctx.fill();

    // Língua rosada
    ctx.fillStyle = "#c94d62";
    ell(ctx, 32, 44 + open * 0.4, 16, open * 0.4);
    ctx.fill();

    // Caninos afiados superiores e inferiores
    ctx.fillStyle = "#fffdf7";
    // Superiores
    ctx.beginPath();
    ctx.moveTo(14, 32);
    ctx.lineTo(20, 48);
    ctx.lineTo(26, 32);
    ctx.moveTo(34, 32);
    ctx.lineTo(40, 48);
    ctx.lineTo(46, 32);
    ctx.fill();
    // Inferiores
    ctx.beginPath();
    ctx.moveTo(18, 42 + open * 0.6);
    ctx.lineTo(22, 30 + open * 0.6);
    ctx.lineTo(26, 42 + open * 0.6);
    ctx.moveTo(38, 42 + open * 0.6);
    ctx.lineTo(42, 30 + open * 0.6);
    ctx.lineTo(46, 42 + open * 0.6);
    ctx.fill();
  } else {
    ctx.strokeStyle = "#2d160b";
    ctx.lineWidth = 3.8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(32, 22);
    ctx.lineTo(32, 34);
    ctx.moveTo(14, 36);
    ctx.quadraticCurveTo(32, 48, 50, 36);
    ctx.stroke();
  }

  // Olhos majestosos com íris âmbar dourada e olhar imperial
  eye(ctx, 18, -10, 8.5, t, 0.6, "#c47012");

  // Bigodes longos finos
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 1.6;
  for (const my of [-2, 4, 10]) {
    ctx.beginPath();
    ctx.moveTo(38, 22 + my);
    ctx.lineTo(76, 20 + my * 1.8);
    ctx.stroke();
  }

  // Sobrancelha musculosa
  ctx.strokeStyle = "#4d2e0f";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(4, -22);
  ctx.lineTo(30, -16);
  ctx.stroke();

  ctx.restore(); // fim da cabeça
  ctx.restore(); // fim do leão
}

/* ------------------------------ ratinho ------------------------------ */

export function drawMouse(ctx: Ctx, t: number, o: PoseOpts) {
  const anim = o.anim ?? "idle";
  const run = anim === "run";
  const gnaw = anim === "gnaw";
  const ph = t * (o.speed ?? 16);
  const hop = run ? Math.abs(Math.sin(ph)) * 6.5 : 0;
  const nib = gnaw ? Math.sin(t * 24) * 3.5 : 0;

  ctx.save();
  ctx.translate(0, -hop);

  // Cauda longa rosada articulada com anéis dérmicos
  ctx.strokeStyle = "#e8a8a4";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-34, -24);
  const tailWave = Math.sin(t * 3.5) * 8;
  ctx.bezierCurveTo(-82, -32 + tailWave, -94, -72, -130, -54 + tailWave);
  ctx.stroke();

  // Patinhas ágeis com dedinhos
  limb(ctx, -10, -14, -10 + (run ? Math.sin(ph) * 8 : 0), 0, 8, "#9ea4ae", OUT);
  limb(ctx, 22, -14, 22 - (run ? Math.sin(ph) * 8 : 0), 0, 8, "#b5bac2", OUT);

  // Corpo aveludado com gradiente cinza-castanho
  ell(ctx, 0, -28, 44, 30, -0.05);
  fillStroke(ctx, vgrad(ctx, -60, 0, [[0, "#cbd0d8"], [0.6, "#a2a8b2"], [1, "#7d838c"]]), OUT, 1.8);

  // Barriguinha clara
  ell(ctx, 8, -18, 28, 16);
  ctx.fillStyle = "#f8f5ee";
  ctx.fill();

  // Cabeça e focinho com queixo roedor
  ell(ctx, 48 + nib * 0.4, -34, 26, 21, 0.12);
  fillStroke(ctx, "#cbd0d8", OUT, 1.8);

  // Orelha grande translúcida com interior rosado
  circle(ctx, 38, -62, 20);
  fillStroke(ctx, "#b5bac4", OUT, 1.8);
  circle(ctx, 38, -62, 12);
  ctx.fillStyle = "#f5adad";
  ctx.fill();

  // Bico do focinho
  ctx.beginPath();
  ctx.moveTo(62, -42);
  ctx.lineTo(82 + nib, -30);
  ctx.lineTo(62, -22);
  ctx.closePath();
  fillStroke(ctx, "#cbd0d8", OUT, 1.8);

  // Narizinho rosa
  circle(ctx, 82 + nib, -31, 5.5);
  ctx.fillStyle = "#e57f92";
  ctx.fill();

  // Olho de pérola negra
  eye(ctx, 54, -42, 5.5, t, 1.4, "#0e0c0a");

  // Bigodes longos e trêmulos (vibração rápida dos roedores)
  const whiskerShake = Math.sin(t * 28) * 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 1.4;
  for (const dy of [-3, 3, 8]) {
    ctx.beginPath();
    ctx.moveTo(72, -32 + dy);
    ctx.lineTo(96, -36 + dy * 2 + whiskerShake);
    ctx.stroke();
  }

  ctx.restore();
}

/* ------------------------------ borboleta ------------------------------ */

export function drawButterfly(ctx: Ctx, t: number) {
  // Cinemática de vôo tridimensional realista: flexão de asas em perspectiva 3D
  const flap = Math.cos(t * 10);
  const flapScale = 0.2 + 0.8 * Math.abs(flap);
  const altitude = Math.sin(t * 3.5) * 16 - 70;

  ctx.save();
  ctx.translate(0, altitude);

  // Asas monarcas com padrões radiantes, borda preta e pontos brancos
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side, 1);
    ctx.rotate(-0.15);
    ctx.scale(flapScale, 1);

    // Asa anterior (grande superior)
    ell(ctx, 30, -24, 36, 32, -0.38);
    fillStroke(ctx, vgrad(ctx, -56, 8, [[0, "#ffcc33"], [0.5, "#ff881a"], [1, "#d94406"]]), "#111417", 2);

    // Nervuras da asa
    ctx.strokeStyle = "rgba(20, 15, 10, 0.65)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(58, -42);
    ctx.moveTo(12, -8);
    ctx.lineTo(52, -18);
    ctx.stroke();

    // Asa posterior (inferior)
    ell(ctx, 24, 18, 25, 22, 0.38);
    fillStroke(ctx, vgrad(ctx, -4, 40, [[0, "#ff9922"], [1, "#c93605"]]), "#111417", 2);

    // Margem preta com pontos brancos pontilhados
    circle(ctx, 32, -28, 7.5);
    ctx.fillStyle = "#16181c";
    ctx.fill();
    circle(ctx, 33, -29, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
  }

  // Corpo do inseto com cabeça e antenas delicadas
  limb(ctx, 0, -32, 0, 30, 8, "#26160c", null);
  circle(ctx, 0, -34, 6);
  ctx.fillStyle = "#1a0d06";
  ctx.fill();

  // Antenas finas curvas
  ctx.strokeStyle = "#1a0d06";
  ctx.lineWidth = 2;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.quadraticCurveTo(side * 14, -54, side * 22, -56);
    ctx.stroke();
    circle(ctx, side * 22, -56, 2);
    ctx.fill();
  }

  ctx.restore();
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
  lion: drawLion,
  mouse: drawMouse,
  butterfly: (ctx, t) => drawButterfly(ctx, t),
  car: (ctx, t, o) => drawCar(ctx, t, o as any),
};

