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

/**
 * Onda de neve rolando pela trilha: nuvem de poeira branca com contorno azulado (mesmo traço do cenário
 * Ghibli), pedras e gelo rolando e rajadas de neve na frente. Devolve só a marcação interna de um
 * <svg viewBox="0 0 1000 600">.
 */
export function renderAvalancheSvg(front: number, t: number, danger: number): string {
  const LAYERS = 12;
  const bodyLen = 340 + danger * 100;
  const lenFrac = bodyLen / CURIOUS_TRAIL_LENGTH;
  const grow = 1.15 + danger * 0.45;
  const puffs: string[] = [];

  // Gradientes e filtros de iluminação volumétrica para realismo visual
  const defs = `<defs>
    <radialGradient id="avCloudGrad" cx="38%" cy="32%" r="68%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="42%" stop-color="#f1f5f9"/>
      <stop offset="78%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </radialGradient>
    <radialGradient id="avMistGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="50%" stop-color="#e2e8f0" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="avIceGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="45%" stop-color="#bfdbfe"/>
      <stop offset="85%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </radialGradient>
    <linearGradient id="avWindStreak" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#e0f2fe" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#bae6fd" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

  // 1. Massa volumétrica de neve em camadas (de trás para a frente)
  for (let k = LAYERS - 1; k >= 0; k--) {
    const u = k / (LAYERS - 1);
    const fk = front - u * lenFrac;
    const c = getTrailPointExtended(fk);
    const tg = getTrailTangent(fk);
    const nx = -tg.y;
    const ny = tg.x;
    const baseR = (38 + 24 * (1 - u)) * grow;
    const alpha = (0.75 + (1 - u) * 0.25) * (1 - u * 0.35);

    // Múltiplos núcleos laterais para formar a crista larga da montanha
    const lateral = [-3, -2, -1, 0, 1, 2, 3];
    let layerBlobs = "";
    for (const m of lateral) {
      const bob = Math.sin(t * 3.6 + k * 1.7 + m * 1.1);
      const churn = Math.cos(t * 2.8 + k * 2.3 + m * 1.4);
      const lat = m * 32 + churn * 7;
      const rise = 14 + 10 * bob + (1 - u) * 9;
      const x = c.x + nx * lat - tg.x * 5;
      const y = c.y + ny * lat - rise;
      const r = baseR * (0.85 + 0.18 * Math.sin(t * 2.9 + k + m * 1.8)) * (m === 0 ? 1.18 : 1 - Math.abs(m) * 0.08);

      // Sombra profunda na base da onda de neve
      layerBlobs += `<circle cx="${f1(x + 2)}" cy="${f1(y + r * 0.22)}" r="${f1(r * 1.04)}" fill="#475569" opacity="0.35"/>`;
      // Corpo volumétrico da nuvem de neve
      layerBlobs += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#avCloudGrad)"/>`;
      // Crista de espuma e pó iluminado pelo sol
      layerBlobs += `<circle cx="${f1(x - r * 0.24)}" cy="${f1(y - r * 0.28)}" r="${f1(r * 0.58)}" fill="#ffffff" opacity="${f1(0.7 + (1 - u) * 0.3)}"/>`;
    }

    puffs.push(`<g opacity="${f1(alpha)}">${layerBlobs}</g>`);
  }
  const snowBody = puffs.join("");

  // 2. Nuvem de pó aerossol (nuvem de poeira branca que envolve e precede a onda)
  let powderMist = "";
  for (let i = 0; i < 10; i++) {
    const u = (i / 10) * 0.75;
    const fk = front - u * lenFrac + Math.sin(t * 1.8 + i) * 0.005;
    const c = getTrailPointExtended(fk);
    const tg = getTrailTangent(fk);
    const lat = Math.sin(t * 2.1 + i * 1.9) * (45 + i * 5);
    const mx = c.x - tg.y * lat + tg.x * (10 + i * 4);
    const my = c.y + tg.x * lat - 22 - (1 - u) * 20 - Math.sin(t * 3.2 + i) * 8;
    const mr = (45 + i * 6) * grow;
    powderMist += `<circle cx="${f1(mx)}" cy="${f1(my)}" r="${f1(mr)}" fill="url(#avMistGrad)"/>`;
  }

  // 3. Sombra dinâmica no chão da montanha sob o peso da avalanche
  const fMid = front - lenFrac * 0.42;
  const mid = getTrailPointExtended(fMid);
  const rotShadow = (Math.atan2(getTrailTangent(fMid).y, getTrailTangent(fMid).x) * 180) / Math.PI;
  const shadow = `<ellipse cx="${f1(mid.x)}" cy="${f1(mid.y + 10)}" rx="${f1(bodyLen * 0.52)}" ry="${f1(32 + danger * 12)}" fill="#0f172a" opacity="0.32" transform="rotate(${f1(rotShadow)} ${f1(mid.x)} ${f1(mid.y + 10)})"/>`;

  // 4. Blocos de gelo facetados e rochas de neve rolando e capotando com sombras 3D
  let debris = "";
  const debrisCount = 16 + Math.round(danger * 8);
  for (let i = 0; i < debrisCount; i++) {
    const u = 0.02 + (i / debrisCount) * 0.85;
    const fk = front - u * lenFrac + Math.sin(t * 2.2 + i) * 0.004;
    const c = getTrailPointExtended(fk);
    const tg = getTrailTangent(fk);
    const side = i % 2 ? 1 : -1;
    const lat = side * (16 + ((i * 19) % 52));
    const bounce = Math.abs(Math.sin(t * 6.5 + i * 2.1)) * 14;
    const x = c.x - tg.y * lat;
    const y = c.y + tg.x * lat - 8 - bounce;
    const rot = t * (190 + i * 45) * (i % 2 ? 1 : -1);
    const sz = 4.2 + (i % 4) * 2.2;
    const isIce = i % 2 === 0;

    debris += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})">
      <ellipse cx="0" cy="${f1(sz * 0.9)}" rx="${f1(sz * 1.1)}" ry="${f1(sz * 0.45)}" fill="#0f172a" opacity="0.25"/>
      <polygon points="${f1(-sz)},${f1(-sz * 0.3)} ${f1(-sz * 0.2)},${f1(-sz)} ${f1(sz * 0.9)},${f1(-sz * 0.4)} ${f1(sz * 0.7)},${f1(sz * 0.9)} ${f1(-sz * 0.6)},${f1(sz * 0.8)}" fill="${isIce ? "url(#avIceGrad)" : "#e2e8f0"}" stroke="${isIce ? "#3b82f6" : "#64748b"}" stroke-width="1.2"/>
      <line x1="${f1(-sz * 0.2)}" y1="${f1(-sz * 0.8)}" x2="${f1(sz * 0.4)}" y2="${f1(sz * 0.2)}" stroke="#ffffff" stroke-width="1.4" opacity="0.8"/>
    </g>`;
  }

  // 5. Rajadas de vento frontal, esteiras de velocidade e jato de neve à frente da onda
  const fc = getTrailPointExtended(front);
  const ft = getTrailTangent(front);
  let spray = "";
  const sprayCount = 20 + Math.round(danger * 12);
  for (let i = 0; i < sprayCount; i++) {
    const ph = (t * (1.1 + (i % 5) * 0.35) + i * 0.21) % 1;
    const ahead = 8 + ph * (55 + danger * 25);
    const lat = ((i * 31) % 90) - 45;
    const x = fc.x + ft.x * ahead - ft.y * lat;
    const y = fc.y + ft.y * ahead + ft.x * lat - 12 - ph * 22;
    const r = (2.2 + (1 - ph) * 3.8);
    spray += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#ffffff" opacity="${f1((1 - ph) * 0.95)}"/>`;
  }

  // Linhas de vento rasante ao longo do solo
  let windStreaks = "";
  for (let i = 0; i < 6; i++) {
    const ph = (t * 2.2 + i * 0.38) % 1;
    const ahead = ph * 75;
    const lat = (i - 2.5) * 18;
    const sx = fc.x + ft.x * ahead - ft.y * lat;
    const sy = fc.y + ft.y * ahead + ft.x * lat - 6;
    const ex = sx + ft.x * 28;
    const ey = sy + ft.y * 28;
    windStreaks += `<line x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(ex)}" y2="${f1(ey)}" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="${f1((1 - ph) * 0.75)}"/>`;
  }

  return `<g class="trail-avalanche">${defs}${shadow}${powderMist}${snowBody}${debris}${windStreaks}${spray}</g>`;
}
