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

/**
 * Tremor de câmera sísmico e realista (px):
 * Combina vibração contínua do chão montanhoso + solavancos de impactos de placas de neve.
 */
export function avalancheShake(t: number, danger: number): { dx: number; dy: number } {
  if (danger <= 0.02) return { dx: 0, dy: 0 };
  const dClamped = Math.min(1, Math.max(0, danger));
  const baseAmp = dClamped * 1.5 + Math.pow(dClamped, 2.2) * 4.8;
  const rumbleX = Math.sin(t * 54) * 0.6 + Math.sin(t * 29) * 0.4;
  const rumbleY = Math.cos(t * 63) * 0.5 + Math.cos(t * 23) * 0.5;
  const jolt = Math.pow(Math.max(0, Math.sin(t * 10.5)), 9) * dClamped * 3.2;
  return {
    dx: (rumbleX * baseAmp + (Math.sin(t * 17) > 0 ? jolt : -jolt)),
    dy: (rumbleY * baseAmp * 0.85 + jolt * 1.2),
  };
}

/* ------------------------------------------------------------------ desenho (canvas, unidades do mundo) */

const hash = (a: number, b = 0) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Ruído suave 1D (valor interpolado) */
const vnoise = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u;
};

// Sprites de nuvem volumétrica pré-renderizados com iluminação e gradientes realistas
let puffSunlit: HTMLCanvasElement | null = null;
let puffIce: HTMLCanvasElement | null = null;
let puffShadow: HTMLCanvasElement | null = null;
let puffSpindrift: HTMLCanvasElement | null = null;

function makeVolumetricPuff(inner: string, mid: string, outer: string, rimLight = false): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 112;
  const g = c.getContext("2d");
  if (g) {
    // Gradiente radial volumétrico com deslocamento de luz solar
    const cx = rimLight ? 46 : 56;
    const cy = rimLight ? 44 : 56;
    const gr = g.createRadialGradient(cx, cy, 2, 56, 56, 54);
    gr.addColorStop(0, inner);
    gr.addColorStop(0.38, mid);
    gr.addColorStop(0.78, outer);
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 112, 112);

    if (rimLight) {
      // Borda iluminada superior direita
      const rim = g.createRadialGradient(42, 38, 1, 42, 38, 30);
      rim.addColorStop(0, "rgba(255,255,255,0.7)");
      rim.addColorStop(0.5, "rgba(255,255,255,0.15)");
      rim.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = rim;
      g.fillRect(0, 0, 112, 112);
    }
  }
  return c;
}

function initPuffSprites() {
  if (typeof document === "undefined") return;
  if (!puffSunlit) {
    puffSunlit = makeVolumetricPuff(
      "rgba(255, 255, 255, 0.98)",
      "rgba(242, 248, 255, 0.72)",
      "rgba(205, 226, 252, 0.28)",
      true
    );
  }
  if (!puffIce) {
    puffIce = makeVolumetricPuff(
      "rgba(218, 236, 255, 0.95)",
      "rgba(182, 212, 248, 0.65)",
      "rgba(142, 182, 235, 0.22)",
      false
    );
  }
  if (!puffShadow) {
    puffShadow = makeVolumetricPuff(
      "rgba(95, 126, 172, 0.88)",
      "rgba(62, 88, 130, 0.58)",
      "rgba(40, 60, 95, 0.18)",
      false
    );
  }
  if (!puffSpindrift) {
    puffSpindrift = makeVolumetricPuff(
      "rgba(255, 255, 255, 0.65)",
      "rgba(240, 248, 255, 0.32)",
      "rgba(215, 235, 255, 0.08)",
      false
    );
  }
}

/**
 * AVALANCHE REALISTA (canvas, unidades do mundo; o contexto já tem a câmera aplicada).
 *
 * Reproduz com fidelidade física a anatomia de uma grande avalanche alpina:
 *  1. Rastro e sulcos de neve compactada no solo deixados pelo avanço da massa;
 *  2. Camada densa de neve e gelo triturado no chão (granular flow) com cristas de pressão;
 *  3. Parede monumental de nuvem de pó (aerosol powder cloud) com vórtices ondulantes e 3 passes de sombreamento;
 *  4. Dezenas de blocos de gelo 3D facetados, placas de neve e pedras rolando e capotando com arcos parabólicos;
 *  5. Jatos frontais de vento e spindrift cortando o ar à frente da massa de neve;
 *  6. Tempestade de cristais de gelo velozes e faixas de vento em alta velocidade;
 *  7. Erupções laterais de neve onde a avalanche atrita e rasga as margens da montanha;
 *  8. Aura de névoa branca que antecede a parede de neve, aumentando com o perigo.
 */
export function drawAvalanche(ctx: CanvasRenderingContext2D, front: number, t: number, danger: number) {
  initPuffSprites();

  const dClamped = Math.min(1, Math.max(0, danger));
  const L = 360 + dClamped * 120;
  const lenFrac = L / CURIOUS_TRAIL_LENGTH;
  const N = 36;
  const wBase = 68 + dClamped * 22;

  type Seg = { x: number; y: number; tx: number; ty: number; nx: number; ny: number; w: number; s: number };
  const segs: Seg[] = [];
  for (let k = 0; k <= N; k++) {
    const s = k / N; // 0 = frente, 1 = cauda
    const fk = front - s * lenFrac;
    const c = getTrailPointExtended(fk);
    const tg = getTrailTangent(fk);
    // Perfil volumétrico: frente compacta e imponente, barriga espessa com vórtices, afinando na cauda
    const prof = Math.sin(Math.min(1, s * 1.4 + 0.15) * Math.PI * 0.65 + 0.32) * (1 - s * 0.42);
    const turbulence = vnoise(k * 0.65 + t * 1.9, 4);
    const w = wBase * (0.46 + 0.85 * prof) * (0.86 + 0.32 * turbulence);
    segs.push({ x: c.x, y: c.y, tx: tg.x, ty: tg.y, nx: -tg.y, ny: tg.x, w, s });
  }

  const side = (sg: Seg, sign: number, shift = 0) => ({
    x: sg.x + sg.nx * sg.w * sign + sg.tx * shift,
    y: sg.y + sg.ny * sg.w * sign + sg.ty * shift,
  });

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const f0 = segs[0];

  // ================= 1) AURA BRANCA DE WHITEOUT (precede a parede de neve) =================
  const whiteoutRad = 90 + dClamped * 80;
  const whiteoutGrad = ctx.createRadialGradient(f0.x + f0.tx * 25, f0.y + f0.ty * 25 - 20, 10, f0.x, f0.y, whiteoutRad);
  whiteoutGrad.addColorStop(0, `rgba(240, 248, 255, ${0.18 + dClamped * 0.24})`);
  whiteoutGrad.addColorStop(0.6, `rgba(220, 238, 255, ${0.08 + dClamped * 0.12})`);
  whiteoutGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = whiteoutGrad;
  ctx.beginPath();
  ctx.arc(f0.x + f0.tx * 20, f0.y + f0.ty * 20 - 15, whiteoutRad, 0, Math.PI * 2);
  ctx.fill();

  // ================= 2) RASTRO DE NEVE DEPOSITADA E SOMBRA NO SOLO =================
  // Rastro esbranquiçado de neve densa no chão deixado para trás
  ctx.fillStyle = "rgba(235, 244, 255, 0.42)";
  ctx.beginPath();
  segs.forEach((sg, i) => {
    const q = side(sg, 0.85, 0);
    i ? ctx.lineTo(q.x, q.y + 2) : ctx.moveTo(q.x, q.y + 2);
  });
  for (let i = segs.length - 1; i >= 0; i--) {
    const q = side(segs[i], -0.85, 0);
    ctx.lineTo(q.x, q.y + 2);
  }
  ctx.closePath();
  ctx.fill();

  // Sombra profunda projetada pela massa de neve no relevo da montanha
  ctx.fillStyle = `rgba(18, 28, 48, ${0.28 + dClamped * 0.14})`;
  ctx.beginPath();
  segs.forEach((sg, i) => {
    const q = side(sg, 1.05, 0);
    i ? ctx.lineTo(q.x + 6, q.y + 14) : ctx.moveTo(q.x + 6, q.y + 14);
  });
  for (let i = segs.length - 1; i >= 0; i--) {
    const q = side(segs[i], -1.05, 0);
    ctx.lineTo(q.x + 6, q.y + 14);
  }
  ctx.closePath();
  ctx.fill();

  // ================= 3) NUVEM DE PÓ VOLUMÉTRICA DE FUNDO (Deep Shadow Pass) =================
  if (puffShadow) {
    const shadowCount = 38;
    for (let i = 0; i < shadowCount; i++) {
      const u = (i + 0.5) / shadowCount;
      const sg = segs[Math.min(N, Math.round(u * N))];
      const wob = vnoise(i * 1.1 + t * 0.85, 12);
      const lat = (wob - 0.5) * 2 * sg.w * 1.25;
      const rise = 18 + (1 - u) * (75 + dClamped * 55) * (0.6 + 0.5 * wob);
      const r = (32 + (1 - u) * 38 + wob * 18) * (1 + dClamped * 0.22);
      const px = sg.x + sg.nx * lat - sg.tx * 10;
      const py = sg.y + sg.ny * lat - rise;

      ctx.globalAlpha = 0.55 * (1 - u * 0.45);
      ctx.drawImage(puffShadow, px - r, py - r * 0.85, r * 2, r * 1.7);
    }
    ctx.globalAlpha = 1;
  }

  // ================= 4) FLUXO DENSO DE NEVE NO SOLO (Granular Avalanche Bed) =================
  // Contorno irregular da lâmina pesada de neve escoando
  const drawSnowBed = (offsetT: number) => {
    ctx.beginPath();
    segs.forEach((sg, i) => {
      const wav = (vnoise(i * 1.2 + t * 2.2 + offsetT, 7) - 0.5) * 16;
      const q = side(sg, 1, wav);
      i ? ctx.lineTo(q.x, q.y - 2) : ctx.moveTo(q.x, q.y - 2);
    });
    for (let i = segs.length - 1; i >= 0; i--) {
      const wav = (vnoise(i * 1.2 + 50 + t * 2.2 + offsetT, 8) - 0.5) * 16;
      const q = side(segs[i], -1, wav);
      ctx.lineTo(q.x, q.y - 2);
    }
    ctx.closePath();
  };

  // Base azulada escura de gelo compactado
  drawSnowBed(0);
  ctx.fillStyle = "#8ba2c8";
  ctx.fill();
  ctx.strokeStyle = "#415982";
  ctx.lineWidth = 2.6;
  ctx.stroke();

  // Camada superior esbranquiçada e brilhante com relevo de 6px
  ctx.save();
  ctx.translate(-2, -6);
  drawSnowBed(0.3);
  const bedGrad = ctx.createLinearGradient(f0.x, f0.y - 40, segs[N].x, segs[N].y);
  bedGrad.addColorStop(0, "#ffffff");
  bedGrad.addColorStop(0.35, "#eef5fc");
  bedGrad.addColorStop(1, "#c5daf2");
  ctx.fillStyle = bedGrad;
  ctx.fill();
  ctx.restore();

  // Línguas de neve que avançam à frente (fingers of snow)
  for (let i = 0; i < 20; i++) {
    const sg = segs[Math.min(N, Math.floor(hash(i, 41) * 8))];
    const lane = (hash(i, 42) - 0.5) * 1.95;
    const r = 7 + hash(i, 43) * 11;
    const px = sg.x + sg.nx * sg.w * lane + sg.tx * (hash(i, 44) * 18 - 2);
    const py = sg.y + sg.ny * sg.w * lane - 4;
    ctx.beginPath();
    ctx.ellipse(px, py, r * 1.35, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f9fe";
    ctx.fill();
    ctx.strokeStyle = "rgba(72, 98, 145, 0.75)";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }

  // Sulcos de fluxo e rugas de velocidade ao longo do trajeto
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 20; i++) {
    const lane = ((i + 0.5) / 20 - 0.5) * 1.75;
    const phase = (t * (1.1 + (i % 5) * 0.25) + i * 0.31) % 1;
    const s0 = Math.max(0, phase * 0.72);
    const s1 = Math.min(1, s0 + 0.22);
    ctx.strokeStyle = `rgba(102, 134, 182, ${0.52 * Math.sin(phase * Math.PI)})`;
    ctx.beginPath();
    for (let k = Math.floor(s0 * N); k <= Math.floor(s1 * N); k++) {
      const sg = segs[Math.min(N, k)];
      const qx = sg.x + sg.nx * sg.w * lane * 0.85;
      const qy = sg.y + sg.ny * sg.w * lane * 0.85 - 6;
      k === Math.floor(s0 * N) ? ctx.moveTo(qx, qy) : ctx.lineTo(qx, qy);
    }
    ctx.stroke();
  }

  // ================= 5) BLOCOS DE GELO 3D E ROCHAS ROLANDO (Physics Bouncing) =================
  const blockCount = 32;
  for (let i = 0; i < blockCount; i++) {
    const u = hash(i, 1) * 0.82 + 0.02;
    const sg = segs[Math.min(N, Math.round(u * N))];
    const lane = (hash(i, 2) - 0.5) * 1.65;
    // Pulo parabólico com gravidade simulada
    const bounceFreq = 4.2 + hash(i, 3) * 3.5;
    const bounceHeight = 8 + hash(i, 4) * 12;
    const bounce = Math.abs(Math.sin(t * bounceFreq + i * 1.8)) * bounceHeight;

    const bx = sg.x + sg.nx * sg.w * lane * 0.85 + sg.tx * Math.sin(t * 1.6 + i) * 8;
    const by = sg.y + sg.ny * sg.w * lane * 0.85 - 8 - bounce;
    const size = 6 + hash(i, 5) * 11;
    const rot = t * (110 + hash(i, 6) * 260) * (i % 2 ? 1 : -1) * (Math.PI / 180);
    const isRock = i % 5 === 0;
    const isGlacierIce = i % 3 === 0;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(rot);

    // Sombra de contato projetada no leito de neve
    ctx.fillStyle = "rgba(22, 34, 58, 0.24)";
    ctx.beginPath();
    ctx.ellipse(0, size * 0.95 + bounce * 0.45, size * 1.15, size * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polígono 3D facetado do bloco
    const verts = 7;
    const poly: { x: number; y: number }[] = [];
    for (let v = 0; v < verts; v++) {
      const ang = (v / verts) * Math.PI * 2 + hash(i, 10 + v) * 0.45;
      const rr = size * (0.72 + hash(i, 20 + v) * 0.45);
      poly.push({ x: Math.cos(ang) * rr, y: Math.sin(ang) * rr });
    }

    // Face escura/sombra
    ctx.beginPath();
    poly.forEach((pt, idx) => (idx ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
    ctx.closePath();
    ctx.fillStyle = isRock ? "#4b5563" : isGlacierIce ? "#8abce8" : "#d8e9fa";
    ctx.fill();
    ctx.strokeStyle = isRock ? "#1f2937" : "#3e5b88";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Faceta superior iluminada pelo sol
    ctx.beginPath();
    ctx.moveTo(poly[0].x * 0.85, poly[0].y * 0.85);
    ctx.lineTo(poly[1].x * 0.85, poly[1].y * 0.85);
    ctx.lineTo(poly[2].x * 0.85, poly[2].y * 0.85);
    ctx.lineTo(0, -size * 0.2);
    ctx.closePath();
    ctx.fillStyle = isRock ? "#9ca3af" : "#ffffff";
    ctx.fill();

    ctx.restore();
  }

  // ================= 6) DETRITOS ARREMESSADOS (Pedras e Estilhaços de Gelo) =================
  const debrisCount = 16 + Math.round(dClamped * 10);
  for (let i = 0; i < debrisCount; i++) {
    const ph = (t * (0.8 + hash(i, 30) * 0.7) + hash(i, 31)) % 1;
    const sg = segs[Math.min(N, Math.floor(hash(i, 32) * 9))];
    const lat = (hash(i, 33) - 0.5) * 2 * (sg.w + 32 * ph);
    const ahead = ph * 72;
    const arc = Math.sin(ph * Math.PI) * (38 + hash(i, 34) * 35);
    const dx = sg.x + sg.nx * lat + sg.tx * ahead;
    const dy = sg.y + sg.ny * lat + sg.ty * ahead - 14 - arc;
    const isDarkRock = i % 3 !== 0;

    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(t * 6 + i);
    ctx.globalAlpha = 1 - ph * 0.65;
    ctx.fillStyle = isDarkRock ? "#4b5563" : "#cfe6ff";
    ctx.strokeStyle = isDarkRock ? "#111827" : "#43689c";
    ctx.lineWidth = 1.4;

    const sz = 3.6 + hash(i, 35) * 4.6;
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

  // ================= 7) MONUMENTAL PAREDE DE NUVEM DE PÓ (Volumetric Cauliflower Billows) =================
  type Billow = { x: number; y: number; r: number; k: number; depth: number };
  const billows: Billow[] = [];
  const BILLOW_COUNT = 64;

  for (let i = 0; i < BILLOW_COUNT; i++) {
    const u = Math.pow(hash(i, 60), 1.22) * 0.92; // 0 frente .. 1 cauda
    const sg = segs[Math.min(N, Math.round(u * N))];
    const lane = (hash(i, 61) - 0.5) * 1.68;
    const row = hash(i, 62);
    // Vórtice ondulante frontal
    const curl = Math.sin(t * 3.2 + i * 1.4) * 4.5;
    const height = (14 + (1 - u) * (105 + dClamped * 52)) * (0.36 + 0.78 * row) * (0.86 + 0.3 * vnoise(i + t * 1.4, 9));
    const r = (18 + (1 - u) * 24 + hash(i, 63) * 14) * (1 + dClamped * 0.24) * (0.62 + 0.48 * (height / 125 + 0.4));
    const bx = sg.x + sg.nx * sg.w * lane * 0.85 + sg.tx * (8 - u * 12) + curl;
    const by = sg.y + sg.ny * sg.w * lane * 0.85 - height + Math.cos(t * 2.8 + i * 1.2) * 4;

    billows.push({ x: bx, y: by, r, k: i, depth: by });
  }

  // Ordena por profundidade (de trás para a frente)
  billows.sort((a, b) => a.depth - b.depth);

  // 1) Contorno profundo de sombra única em tinta
  ctx.fillStyle = "#384e72";
  for (const b of billows) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r + 2.0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2) Preenchimento volumétrico com gradiente de luz e sombra
  for (const b of billows) {
    const g = ctx.createLinearGradient(b.x, b.y - b.r, b.x, b.y + b.r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.42, "#f0f6fd");
    g.addColorStop(0.75, "#c4daf3");
    g.addColorStop(1, "#8ea9cf");
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  // 3) Dobras anatômicas e iluminação de aresta (volume de couve-flor de nuvem)
  for (const b of billows) {
    // Brilho solar no topo
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.22, b.y - b.r * 0.32, b.r * 0.58, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.fill();

    // Sombra curva que esculpe os lóbulos da nuvem
    ctx.strokeStyle = "rgba(82, 110, 158, 0.55)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(b.x + b.r * 0.1, b.y + b.r * 0.16, b.r * 0.72, 0.12 * Math.PI, 0.88 * Math.PI);
    ctx.stroke();
  }

  // ================= 8) NUVEM DE PÓ FRONTAL DINÂMICA (Puff Sprites Pass) =================
  if (puffSunlit && puffIce) {
    const puffCount = 36;
    for (let i = 0; i < puffCount; i++) {
      const u = (i + 0.5) / puffCount;
      const sg = segs[Math.min(N, Math.round(u * N * 0.85))];
      const wob = vnoise(i * 1.2 + t * 1.5, 24);
      const lat = (wob - 0.5) * 2 * sg.w * 1.3;
      const rise = 12 + (1 - u) * (85 + dClamped * 45) * (0.55 + 0.55 * wob);
      const r = (28 + (1 - u) * 36 + wob * 18) * (1 + dClamped * 0.25);
      const px = sg.x + sg.nx * lat + sg.tx * 14 + Math.sin(t * 1.4 + i) * 6;
      const py = sg.y + sg.ny * lat - rise - Math.abs(Math.sin(t * 2.4 + i * 1.8)) * 9;

      ctx.globalAlpha = 0.58 * (1 - u * 0.5);
      const spr = u > 0.45 ? puffIce : puffSunlit;
      ctx.drawImage(spr, px - r, py - r * 0.85, r * 2, r * 1.7);
    }
    ctx.globalAlpha = 1;
  }

  // ================= 9) RAJADAS DE VENTO E AGULHAS DE SPINDRIFT À FRENTE =================
  const windCount = 36 + Math.round(dClamped * 22);
  for (let i = 0; i < windCount; i++) {
    const ph = (t * (1.3 + (i % 6) * 0.28) + i * 0.17) % 1;
    const ahead = 12 + ph * (85 + dClamped * 55);
    const lat = (hash(i, 51) - 0.5) * 2 * (f0.w + 42);
    const wx = f0.x + f0.nx * lat + f0.tx * ahead;
    const wy = f0.y + f0.ny * lat + f0.ty * ahead - 12 - ph * 32;

    ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - ph) * 0.95})`;
    ctx.lineWidth = 2.0 + hash(i, 52) * 1.8;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + f0.tx * (16 + ph * 12), wy + f0.ty * (16 + ph * 12) + 2);
    ctx.stroke();
  }

  // ================= 10) TEMPESTADE DE CRISTAIS DE GELO E SPRAY VELOZ =================
  const sprayCount = 52 + Math.round(dClamped * 55);
  for (let i = 0; i < sprayCount; i++) {
    const ph = (t * (2.1 + hash(i, 80) * 1.6) + hash(i, 81)) % 1;
    const forwardDist = ph * (110 + dClamped * 85);
    const lat = (hash(i, 82) - 0.5) * 2 * (f0.w * 1.35 + 45 * ph);
    const lift = Math.sin(ph * Math.PI) * (20 + hash(i, 83) * 42);
    const px = f0.x + f0.nx * lat + f0.tx * forwardDist;
    const py = f0.y + f0.ny * lat + f0.ty * forwardDist - 10 - lift;
    const size = 1.4 + hash(i, 84) * 3.2;
    const alpha = (1 - ph) * (0.55 + hash(i, 85) * 0.45);

    ctx.fillStyle = i % 4 === 0 ? `rgba(180, 220, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();

    // Brilho especular cintilante em cristais selecionados
    if (i % 7 === 0 && size > 2.5) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
      ctx.fillRect(px - size * 1.4, py - 0.5, size * 2.8, 1);
      ctx.fillRect(px - 0.5, py - size * 1.4, 1, size * 2.8);
    }
  }

  // ================= 11) ERUPÇÕES LATERAIS DE NEVE (Margens da Montanha) =================
  for (let i = 0; i < 24; i++) {
    const sg = segs[Math.min(N, Math.floor(hash(i, 90) * 18))];
    const sideSign = i % 2 === 0 ? 1 : -1;
    const ph = (t * 2.4 + hash(i, 91)) % 1;
    const burstX = sg.x + sg.nx * (sg.w * sideSign + sideSign * ph * 36) + sg.tx * (ph * 18);
    const burstY = sg.y + sg.ny * (sg.w * sideSign + sideSign * ph * 36) - 12 - Math.sin(ph * Math.PI) * 32;

    ctx.fillStyle = `rgba(242, 250, 255, ${(1 - ph) * 0.72})`;
    ctx.beginPath();
    ctx.arc(burstX, burstY, 3.5 + (1 - ph) * 7.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
