/**
 * Modo AVALANCHE da Trilha do Aluno Curioso (nível de dificuldade extra, depois do "Nativo").
 *
 * Em vez do cronômetro por elemento, uma avalanche nasce ATRÁS do aluno e sobe a trilha seguindo-o
 * até alcançá-lo. A lógica é PURA (sem React, sem Math.random) e é usada tanto pelo jogo quanto
 * pelo gerador de vídeo, para os dois terem exatamente a mesma dinâmica e o mesmo visual.
 *
 * Calibragem ("nem rápida demais, nem lenta demais"):
 *  - A velocidade é definida pelo RITMO DE EQUILÍBRIO: responder cada objeto em ~`secondsPerElement`
 *    mantém a distância constante (12,5 s no nível 1 → 9,5 s no nível 7: bem mais folgado que os 6 s
 *    do Nativo, porque aqui a pressão se ACUMULA em vez de ser por pergunta).
 *  - O aluno começa com uma folga de 2,4 "espaços entre objetos" (≈ 25–30 s de leitura sobrando).
 *  - Acerto de 1ª tentativa empurra a avalanche de volta (recompensa o reflexo); erro a aproxima.
 *  - Durante a comemoração/caminhada pós-acerto ela desacelera (35%), para o aluno não ser punido
 *    pelas animações.
 *
 * Posição da avalanche = FRAÇÃO do comprimento total da trilha (0..1; pode ser negativa: ela nasce
 * antes do início do caminho).
 */
import { getTrailPointExtended, getTrailTangent, CURIOUS_TRAIL_LENGTH } from "@/lib/curiousTrailGeometry";

export const AVALANCHE_CONFIG = {
  /** folga inicial, em espaços entre objetos */
  startGap: 2.4,
  /** a avalanche alcança o aluno quando a distância cai abaixo disto (em espaços) */
  catchGap: 0.2,
  /** distância (em espaços) abaixo da qual o aviso vira "perigo" */
  warnGap: 1.3,
  dangerGap: 0.75,
  /** velocidade relativa enquanto o aluno comemora/caminha */
  calmFactor: 0.35,
  /** recuo da avalanche (em espaços) ao acertar de 1ª tentativa / na 2ª tentativa */
  recoilFirst: 0.45,
  recoilRetry: 0.2,
  /** avanço (em espaços) ao errar uma alternativa */
  wrongPenalty: 0.3,
} as const;

/** Segundos "de equilíbrio" por objeto em cada nível da trilha (1..7). */
export function avalancheSecondsPerElement(level: number): number {
  return 12.5 - (Math.min(7, Math.max(1, level)) - 1) * 0.5;
}

export interface AvalancheState {
  /** posição da frente da avalanche (fração da trilha; pode ser < 0) */
  front: number;
  caught: boolean;
}

export interface AvalancheTrack {
  /** espaço entre objetos, em fração da trilha */
  spacing: number;
  /** folga inicial (fração da trilha): 2,4 espaços, limitada para a avalanche aparecer na tela */
  startGapFrac: number;
  levelStart: number;
  levelEnd: number;
  level: number;
}

export function makeAvalancheTrack(levelStart: number, levelEnd: number, elementCount: number, level: number): AvalancheTrack {
  const spacing = (levelEnd - levelStart) / (elementCount + 1);
  const startGapFrac = Math.min(AVALANCHE_CONFIG.startGap * spacing, MAX_START_GAP_UNITS / CURIOUS_TRAIL_LENGTH);
  return { spacing, startGapFrac, levelStart, levelEnd, level };
}

/** Folga inicial máxima, em unidades do mundo (para a avalanche já aparecer atrás do aluno). */
const MAX_START_GAP_UNITS = 520;

export function initAvalanche(track: AvalancheTrack): AvalancheState {
  return { front: track.levelStart - track.startGapFrac, caught: false };
}

/** Posição lógica do aluno (fração da trilha) quando o objeto `index` (0-based) está em jogo. */
export function studentFractionAt(track: AvalancheTrack, index: number, levelFinished: boolean): number {
  return levelFinished ? track.levelEnd : track.levelStart + track.spacing * index;
}

/** Velocidade da avalanche em frações da trilha por segundo. */
export function avalancheSpeed(track: AvalancheTrack, calm: boolean): number {
  const base = track.spacing / avalancheSecondsPerElement(track.level);
  return calm ? base * AVALANCHE_CONFIG.calmFactor : base;
}

/** Avança a avalanche `dt` segundos. Devolve true se ela alcançou o aluno. */
export function stepAvalanche(state: AvalancheState, dt: number, track: AvalancheTrack, studentFraction: number, calm: boolean): boolean {
  if (state.caught) return true;
  state.front += avalancheSpeed(track, calm) * dt;
  if (studentFraction - state.front <= AVALANCHE_CONFIG.catchGap * track.spacing) {
    state.caught = true;
    state.front = studentFraction - AVALANCHE_CONFIG.catchGap * track.spacing * 0.5;
  }
  return state.caught;
}

export type AnswerKind = "first" | "retry" | "wrong";

/** Reação da avalanche à resposta do aluno. */
export function applyAnswerToAvalanche(state: AvalancheState, track: AvalancheTrack, kind: AnswerKind) {
  const sp = track.spacing;
  if (kind === "first") state.front -= AVALANCHE_CONFIG.recoilFirst * sp;
  else if (kind === "retry") state.front -= AVALANCHE_CONFIG.recoilRetry * sp;
  else state.front += AVALANCHE_CONFIG.wrongPenalty * sp;
  // nunca fica mais longe do que a folga inicial (evita acumular "crédito" infinito)
}

/** Limita a folga máxima à inicial (chamado depois de aplicar recuos). */
export function clampAvalancheGap(state: AvalancheState, track: AvalancheTrack, studentFraction: number) {
  const maxGap = track.startGapFrac;
  if (studentFraction - state.front > maxGap) state.front = studentFraction - maxGap;
}

/** 0 = tranquilo, 1 = prestes a ser engolido. */
export function avalancheDanger(state: AvalancheState, track: AvalancheTrack, studentFraction: number): number {
  const sp = track.spacing;
  const gap = studentFraction - state.front;
  const lo = AVALANCHE_CONFIG.catchGap * sp;
  const hi = Math.max(track.startGapFrac, lo * 2);
  return Math.min(1, Math.max(0, 1 - (gap - lo) / (hi - lo)));
}

export type AvalancheLevel = "calm" | "warn" | "danger";
export function avalancheAlert(state: AvalancheState, track: AvalancheTrack, studentFraction: number): AvalancheLevel {
  const gapEl = (studentFraction - state.front) / track.spacing;
  if (gapEl <= AVALANCHE_CONFIG.dangerGap) return "danger";
  if (gapEl <= AVALANCHE_CONFIG.warnGap) return "warn";
  return "calm";
}

/** Distância aproximada, em metros de "altitude", só para o HUD (1 unidade do mundo ≈ 0,8 m). */
export function avalancheDistanceMeters(state: AvalancheState, studentFraction: number): number {
  return Math.max(0, Math.round((studentFraction - state.front) * CURIOUS_TRAIL_LENGTH * 0.8));
}

/** Tremor de câmera (px) proporcional ao perigo. */
export function avalancheShake(t: number, danger: number): { dx: number; dy: number } {
  const k = danger * danger * 3.2;
  return { dx: Math.sin(t * 61) * k, dy: Math.cos(t * 53) * k * 0.8 };
}

/* ------------------------------------------------------------------ desenho (SVG, viewBox 1000x600) */

const f1 = (n: number) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------ desenho (canvas, unidades do mundo) */

const hash = (a: number, b = 0) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** ruído suave 1D (valor interpolado) */
const vnoise = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u;
};

let puffSprite: HTMLCanvasElement | null = null;
let puffShade: HTMLCanvasElement | null = null;
function makePuff(inner: string, mid: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 96;
  const g = c.getContext("2d");
  if (g) {
    const gr = g.createRadialGradient(48, 48, 2, 48, 48, 48);
    gr.addColorStop(0, inner);
    gr.addColorStop(0.45, mid);
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 96, 96);
  }
  return c;
}

/**
 * AVALANCHE de neve (canvas, unidades do mundo; o contexto já tem a câmera aplicada).
 *
 * Em vez de uma "nuvem de fumaça", é uma avalanche mista como as reais:
 *  - uma MASSA DE NEVE densa escoando pelo caminho, com bordas irregulares, línguas de neve na frente,
 *    sulcos de fluxo e sombreado azulado (mesmo traço pintado da arte);
 *  - BLOCOS e bolas de neve angulosos rolando e capotando;
 *  - uma NUVEM DE PÓ turbulenta, mais alta na frente (a "parede" de poeira de neve) e se dissipando atrás;
 *  - detritos (pedras e gelo) arremessados, rajadas de neve e faixas de vento à frente;
 *  - sombra no chão e rastro de neve deixado para trás.
 */
export function drawAvalanche(ctx: CanvasRenderingContext2D, front: number, t: number, danger: number) {
  if (!puffSprite) puffSprite = makePuff("rgba(255,255,255,0.95)", "rgba(244,249,255,0.55)");
  if (!puffShade) puffShade = makePuff("rgba(196,212,235,0.9)", "rgba(170,192,222,0.5)");
  const L = 330 + danger * 90;
  const lenFrac = L / CURIOUS_TRAIL_LENGTH;
  const N = 34;
  const wBase = 60 + danger * 16;

  type Seg = { x: number; y: number; tx: number; ty: number; nx: number; ny: number; w: number; s: number };
  const segs: Seg[] = [];
  for (let k = 0; k <= N; k++) {
    const s = k / N; // 0 = frente, 1 = cauda
    const fk = front - s * lenFrac;
    const c = getTrailPointExtended(fk);
    const tg = getTrailTangent(fk);
    // largura: estreita na ponta, mais larga um pouco atrás, afinando na cauda; borda irregular que "respira"
    const prof = Math.sin(Math.min(1, s * 1.35 + 0.12) * Math.PI * 0.62 + 0.35) * (1 - s * 0.45);
    const w = wBase * (0.42 + 0.8 * prof) * (0.88 + 0.3 * vnoise(k * 0.7 + t * 1.6, 3));
    segs.push({ x: c.x, y: c.y, tx: tg.x, ty: tg.y, nx: -tg.y, ny: tg.x, w, s });
  }
  const side = (sg: Seg, sign: number, shift = 0) => ({
    x: sg.x + sg.nx * sg.w * sign + sg.tx * shift,
    y: sg.y + sg.ny * sg.w * sign + sg.ty * shift,
  });

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // 1) sombra no chão (a neve pesada escurece o terreno) e rastro claro na cauda
  ctx.fillStyle = `rgba(20, 30, 50, ${0.2 + danger * 0.08})`;
  ctx.beginPath();
  segs.forEach((sg, i) => {
    const q = side(sg, 1, 0);
    i ? ctx.lineTo(q.x + 5, q.y + 12) : ctx.moveTo(q.x + 5, q.y + 12);
  });
  for (let i = segs.length - 1; i >= 0; i--) {
    const q = side(segs[i], -1, 0);
    ctx.lineTo(q.x + 5, q.y + 12);
  }
  ctx.closePath();
  ctx.fill();

  // 2) nuvem de pó ao fundo (atrás da massa): turbulenta, mais alta na frente
  const powder = (pass: number) => {
    const count = pass === 0 ? 46 : 34;
    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count; // 0 frente .. 1 cauda
      const sg = segs[Math.min(N, Math.round(u * N * 0.9))];
      const wob = vnoise(i * 0.9 + t * (pass === 0 ? 0.9 : 1.4), 9 + pass);
      const wob2 = vnoise(i * 1.3 + t * 1.1, 21 + pass);
      const lat = (wob - 0.5) * 2 * sg.w * 1.35;
      const rise = (pass === 0 ? 20 : 8) + (1 - u) * (70 + danger * 40) * (0.55 + 0.6 * wob2);
      const r = (26 + (1 - u) * 34 + wob * 16) * (pass === 0 ? 1.15 : 0.8) * (1 + danger * 0.25);
      const x = sg.x + sg.nx * lat + sg.tx * (pass === 0 ? -6 : 14) + Math.sin(t * 1.3 + i) * 5;
      const y = sg.y + sg.ny * lat - rise - Math.abs(Math.sin(t * 2.2 + i * 1.7)) * 8;
      ctx.globalAlpha = (pass === 0 ? 0.42 : 0.55) * (1 - u * 0.55);
      const spr = pass === 0 || u > 0.55 ? puffShade! : puffSprite!;
      ctx.drawImage(spr, x - r, y - r * 0.85, r * 2, r * 1.7);
    }
    ctx.globalAlpha = 1;
  };

  // 3) FLUXO DE NEVE no chão: lâmina densa e baixa de neve escoando (borda irregular, sombreada, com contorno)
  const ground = () => {
    ctx.beginPath();
    segs.forEach((sg, i) => {
      const q = side(sg, 1, (vnoise(i * 1.1 + t * 2, 5) - 0.5) * 14);
      i ? ctx.lineTo(q.x, q.y - 1) : ctx.moveTo(q.x, q.y - 1);
    });
    for (let i = segs.length - 1; i >= 0; i--) {
      const q = side(segs[i], -1, (vnoise(i * 1.1 + 40 + t * 2, 6) - 0.5) * 14);
      ctx.lineTo(q.x, q.y - 1);
    }
    ctx.closePath();
  };
  ground();
  ctx.fillStyle = "#aebfdb";
  ctx.fill();
  ctx.strokeStyle = "#4a638f";
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.save();
  ctx.translate(-1.5, -5);
  ground();
  ctx.fillStyle = "#e7eff9";
  ctx.fill();
  ctx.restore();
  // pequenos montes de neve na borda de ataque
  for (let i = 0; i < 16; i++) {
    const sg = segs[Math.min(N, Math.floor(hash(i, 50) * 9))];
    const lane = (hash(i, 51) - 0.5) * 1.9;
    const r = 6 + hash(i, 52) * 8;
    const x = sg.x + sg.nx * sg.w * lane + sg.tx * (hash(i, 53) * 14 - 4);
    const y = sg.y + sg.ny * sg.w * lane - 3;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.3, r * 0.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#f4f8fd";
    ctx.fill();
    ctx.strokeStyle = "rgba(80,108,160,.8)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  // sulcos de fluxo (linhas ao longo do movimento) e rugas na superfície
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 16; i++) {
    const lane = ((i + 0.5) / 16 - 0.5) * 1.7;
    const phase = (t * (0.9 + (i % 4) * 0.3) + i * 0.37) % 1;
    const s0 = Math.max(0, phase * 0.7);
    const s1 = Math.min(1, s0 + 0.2);
    ctx.strokeStyle = `rgba(112, 140, 186, ${0.45 * Math.sin(phase * Math.PI)})`;
    ctx.beginPath();
    for (let k = Math.floor(s0 * N); k <= Math.floor(s1 * N); k++) {
      const sg = segs[Math.min(N, k)];
      const q = { x: sg.x + sg.nx * sg.w * lane * 0.8, y: sg.y + sg.ny * sg.w * lane * 0.8 - 5 };
      k === Math.floor(s0 * N) ? ctx.moveTo(q.x, q.y) : ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();
  }

  // 4) blocos de neve angulosos e bolas de neve rolando e capotando na superfície
  const blocks = 26;
  for (let i = 0; i < blocks; i++) {
    const u = hash(i, 1) * 0.78 + 0.02;
    const sg = segs[Math.min(N, Math.round(u * N))];
    const lane = (hash(i, 2) - 0.5) * 1.5;
    const bounce = Math.abs(Math.sin(t * (4.5 + hash(i, 3) * 3) + i * 2)) * (7 + hash(i, 4) * 9);
    const x = sg.x + sg.nx * sg.w * lane * 0.85 + sg.tx * Math.sin(t * 1.5 + i) * 6;
    const y = sg.y + sg.ny * sg.w * lane * 0.85 - 6 - bounce;
    const size = 5 + hash(i, 5) * 9;
    const rot = t * (90 + hash(i, 6) * 220) * (i % 2 ? 1 : -1) * (Math.PI / 180);
    const round = i % 4 === 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = "rgba(25,35,60,0.18)";
    ctx.beginPath();
    ctx.ellipse(0, size * 0.9 + bounce * 0.4, size * 1.1, size * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    if (round) ctx.arc(0, 0, size * 0.95, 0, Math.PI * 2);
    else {
      const verts = 6;
      for (let v = 0; v < verts; v++) {
        const ang = (v / verts) * Math.PI * 2 + hash(i, v) * 0.7;
        const rr = size * (0.7 + hash(i, 10 + v) * 0.45);
        v ? ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr) : ctx.moveTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
      }
      ctx.closePath();
    }
    ctx.fillStyle = i % 5 === 0 ? "#cfe3fb" : "#f2f7fd";
    ctx.fill();
    ctx.strokeStyle = "#556f9b";
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.ellipse(-size * 0.25, -size * 0.3, size * 0.4, size * 0.22, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 5) detritos arremessados: pedras escuras e lascas de gelo, voando para fora e à frente
  for (let i = 0; i < 12 + Math.round(danger * 6); i++) {
    const ph = (t * (0.7 + hash(i, 20) * 0.6) + hash(i, 21)) % 1;
    const sg = segs[Math.min(N, Math.floor(hash(i, 22) * 8))];
    const lat = (hash(i, 23) - 0.5) * 2 * (sg.w + 26 * ph);
    const ahead = ph * 60;
    const arc = Math.sin(ph * Math.PI) * (34 + hash(i, 24) * 30);
    const x = sg.x + sg.nx * lat + sg.tx * ahead;
    const y = sg.y + sg.ny * lat + sg.ty * ahead - 12 - arc;
    const rock = i % 3 !== 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 5 + i);
    ctx.globalAlpha = 1 - ph * 0.6;
    ctx.fillStyle = rock ? "#6b7280" : "#cfe6ff";
    ctx.strokeStyle = rock ? "#1f2937" : "#4a6fa5";
    ctx.lineWidth = 1.3;
    const sz = 3.2 + hash(i, 25) * 4.2;
    ctx.beginPath();
    ctx.moveTo(-sz, -sz * 0.3);
    ctx.lineTo(-sz * 0.2, -sz);
    ctx.lineTo(sz, -sz * 0.2);
    ctx.lineTo(sz * 0.5, sz);
    ctx.lineTo(-sz * 0.7, sz * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 6) PAREDE DE NEVE: cúmulos de neve sólidos (como as nuvens pintadas da arte), com topo branco, base
  //    azulada, contorno e altura crescente na frente: a crista da avalanche
  type Billow = { x: number; y: number; r: number; k: number };
  const billows: Billow[] = [];
  const COUNT = 54;
  for (let i = 0; i < COUNT; i++) {
    const u = Math.pow(hash(i, 60), 1.25) * 0.9; // 0 frente .. 1 cauda
    const sg = segs[Math.min(N, Math.round(u * N))];
    const lane = (hash(i, 61) - 0.5) * 1.6;
    const row = hash(i, 62);
    const height = (10 + (1 - u) * (92 + danger * 40)) * (0.35 + 0.75 * row) * (0.85 + 0.3 * vnoise(i + t * 1.2, 7));
    const r = (15 + (1 - u) * 20 + hash(i, 63) * 12) * (1 + danger * 0.2) * (0.6 + 0.5 * (height / 110 + 0.4));
    const x = sg.x + sg.nx * sg.w * lane * 0.85 + sg.tx * (6 - u * 10) + Math.sin(t * 2.1 + i * 1.7) * 3;
    const y = sg.y + sg.ny * sg.w * lane * 0.85 - height + Math.cos(t * 2.6 + i * 1.3) * 3.5;
    billows.push({ x, y, r, k: i });
  }
  billows.sort((p, q) => p.y - q.y);
  // contorno único da massa (círculos maiores em tinta por baixo) e depois as cores
  ctx.fillStyle = "#47608c";
  for (const b of billows) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r + 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const b of billows) {
    const g = ctx.createLinearGradient(b.x, b.y - b.r, b.x, b.y + b.r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.5, "#e9f1fb");
    g.addColorStop(1, "#a9bcdb");
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
  for (const b of billows) {
    // luz do alto/esquerda e uma dobra de sombra: dá volume de "couve-flor" aos cúmulos
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.22, b.y - b.r * 0.3, b.r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
    ctx.strokeStyle = "rgba(96,124,176,0.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(b.x + b.r * 0.1, b.y + b.r * 0.15, b.r * 0.72, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  // poeira fina no topo, translúcida (a parte realmente "fumaça" fica só como acabamento leve)
  for (let i = 0; i < 18; i++) {
    const sg = segs[Math.min(N, Math.floor(hash(i, 70) * 14))];
    const rise = 70 + (1 - sg.s) * 70 + hash(i, 71) * 40;
    const r = 18 + hash(i, 72) * 24;
    ctx.globalAlpha = 0.28;
    ctx.drawImage(puffSprite!, sg.x + (hash(i, 73) - 0.5) * sg.w * 2 - r, sg.y - rise + Math.sin(t * 1.3 + i) * 4 - r * 0.8, r * 2, r * 1.6);
  }
  ctx.globalAlpha = 1;

  // 7) rajadas de neve e faixas de vento adiante da frente
  const f0 = segs[0];
  for (let i = 0; i < 26 + Math.round(danger * 12); i++) {
    const ph = (t * (1.2 + (i % 5) * 0.3) + i * 0.19) % 1;
    const ahead = 10 + ph * (70 + danger * 30);
    const lat = (hash(i, 31) - 0.5) * 2 * (f0.w + 30);
    const x = f0.x + f0.nx * lat + f0.tx * ahead;
    const y = f0.y + f0.ny * lat + f0.ty * ahead - 10 - ph * 28;
    ctx.strokeStyle = `rgba(255,255,255,${(1 - ph) * 0.9})`;
    ctx.lineWidth = 1.8 + hash(i, 32) * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + f0.tx * 14, y + f0.ty * 14 + 2);
    ctx.stroke();
  }
  ctx.restore();
}
