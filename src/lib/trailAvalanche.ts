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
  const LAYERS = 9;
  const bodyLen = 300 + danger * 70; // unidades do mapa atrás da frente
  const lenFrac = bodyLen / CURIOUS_TRAIL_LENGTH;
  const grow = 1 + danger * 0.3;
  const ink = "#42608f";
  const puffs: string[] = [];

  for (let k = LAYERS - 1; k >= 0; k--) {
    const u = k / (LAYERS - 1);
    const fk = front - u * lenFrac;
    const c = getTrailPointExtended(fk);
    const tg = getTrailTangent(fk);
    const nx = -tg.y;
    const ny = tg.x;
    const baseR = (32 + 18 * (1 - u)) * grow;
    const alpha = 1 - u * 0.5;
    const tone = u < 0.35 ? "#ffffff" : u < 0.65 ? "#eef3fb" : "#d4e0f1";
    const shade = u < 0.5 ? "#a9bfdc" : "#93aacd";
    const lateral = [-2, -1, 0, 1, 2];
    let ring = "";
    let fill = "";
    let hi = "";
    for (const m of lateral) {
      const bob = Math.sin(t * 3.1 + k * 1.9 + m * 1.3);
      const lat = m * 38 + Math.sin(t * 1.7 + k * 2.1 + m) * 5;
      const rise = 10 + 7 * bob + (1 - u) * 6;
      const x = c.x + nx * lat - tg.x * 4;
      const y = c.y + ny * lat - rise;
      const r = baseR * (0.82 + 0.18 * Math.sin(t * 2.6 + k + m * 2.2)) * (m === 0 ? 1.12 : 1 - Math.abs(m) * 0.1);
      ring += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 0.9)}"/>`;
      fill += `<circle cx="${f1(x)}" cy="${f1(y + r * 0.1)}" r="${f1(r - 0.9)}"/>`;
      hi += `<circle cx="${f1(x - r * 0.22)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.62)}"/>`;
    }
    puffs.push(
      `<g opacity="${f1(alpha)}"><g fill="${ink}">${ring}</g><g fill="${shade}">${fill}</g><g fill="${tone}">${hi}</g></g>`
    );
  }
  const under = puffs.join("");

  // base escura/ombra no chão sob a massa de neve
  const fMid = front - lenFrac * 0.4;
  const mid = getTrailPointExtended(fMid);
  const shadow = `<ellipse cx="${f1(mid.x)}" cy="${f1(mid.y + 8)}" rx="${f1(bodyLen * 0.5)}" ry="${f1(24 + danger * 8)}" fill="#1e293b" opacity="0.22" transform="rotate(${f1((Math.atan2(getTrailTangent(fMid).y, getTrailTangent(fMid).x) * 180) / Math.PI)} ${f1(mid.x)} ${f1(mid.y + 8)})"/>`;

  // pedras e blocos de gelo rolando
  let debris = "";
  for (let i = 0; i < 9; i++) {
    const u = 0.04 + (i / 9) * 0.8;
    const fk = front - u * lenFrac + Math.sin(t * 2 + i) * 0.003;
    const c = getTrailPointExtended(fk);
    const tg = getTrailTangent(fk);
    const side = i % 2 ? 1 : -1;
    const lat = side * (28 + ((i * 17) % 31));
    const x = c.x - tg.y * lat;
    const y = c.y + tg.x * lat - 8 - Math.abs(Math.sin(t * 5 + i * 1.7)) * 9;
    const rot = t * (140 + i * 37) * (i % 2 ? 1 : -1);
    const sz = 3 + (i % 3) * 1.3;
    const ice = i % 3 === 0;
    debris += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><polygon points="${f1(-sz)},${f1(-sz * 0.2)} ${f1(-sz * 0.3)},${f1(-sz)} ${f1(sz)},${f1(-sz * 0.4)} ${f1(sz * 0.6)},${f1(sz)} ${f1(-sz * 0.7)},${f1(sz * 0.7)}" fill="${ice ? "#cfe8ff" : "#6b6f7a"}" stroke="#2b3550" stroke-width="0.9"/></g>`;
  }

  // rajadas de neve à frente da onda
  const fc = getTrailPointExtended(front);
  const ft = getTrailTangent(front);
  let spray = "";
  for (let i = 0; i < 12; i++) {
    const ph = (t * (0.9 + (i % 4) * 0.25) + i * 0.37) % 1;
    const ahead = 6 + ph * 40;
    const lat = ((i * 29) % 70) - 35;
    const x = fc.x + ft.x * ahead - ft.y * lat;
    const y = fc.y + ft.y * ahead + ft.x * lat - 14 - ph * 16;
    spray += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.6 + (1 - ph) * 2.6)}" fill="#ffffff" opacity="${f1((1 - ph) * 0.9)}"/>`;
  }

  return `<g class="trail-avalanche">${shadow}${under}${debris}${spray}</g>`;
}
