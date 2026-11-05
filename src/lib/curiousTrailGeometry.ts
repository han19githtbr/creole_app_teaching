/**
 * Geometria da "Trilha do Aluno Curioso" sobre a ilustração da mata (public/trilha/mata-trilha.jpg).
 *
 * O mundo é RETRATO: 1000 x 2201 unidades (proporção da arte original 688 x 1514). O caminho foi
 * traçado sobre a trilha de terra da imagem, do início (embaixo) até a casinha no topo.
 * Tudo aqui é matemática pura, usada igualmente pelo jogo e pelo gerador de vídeo.
 */
export interface TrailPoint {
  x: number;
  y: number;
}

export const WORLD_W = 1000;
export const WORLD_H = 2201;
/** arte original (px) -> unidades do mundo */
const K = WORLD_W / 688;

/** Pontos do caminho, em pixels da arte original (688x1514), de baixo (início) para cima (casinha). */
const RAW_POINTS: [number, number][] = [
  [345, 1495], [345, 1440], [385, 1412], [480, 1393], [560, 1365], [583, 1320], [560, 1285], [490, 1272], [380, 1258],
  [260, 1238], [160, 1212], [112, 1172], [140, 1120], [240, 1092], [350, 1072], [460, 1052], [560, 1030], [585, 990],
  [530, 970], [440, 950], [330, 925], [230, 895], [160, 862], [165, 820], [230, 790], [300, 765], [400, 748],
  [520, 728], [590, 695], [520, 662], [400, 645], [300, 628], [245, 600], [236, 540], [230, 470], [240, 400],
  [248, 330], [256, 268], [295, 238], [350, 212], [392, 192], [382, 168], [410, 150], [421, 140],
];

const POINTS: TrailPoint[] = RAW_POINTS.map(([x, y]) => ({ x: x * K, y: y * K }));

interface TrailCurve {
  start: TrailPoint;
  control1: TrailPoint;
  control2: TrailPoint;
  end: TrailPoint;
}

/** Catmull-Rom -> Bézier cúbica, um segmento por par de pontos. */
const TRAIL_CURVES: TrailCurve[] = POINTS.slice(0, -1).map((p1, i) => {
  const p0 = POINTS[Math.max(0, i - 1)];
  const p2 = POINTS[i + 1];
  const p3 = POINTS[Math.min(POINTS.length - 1, i + 2)];
  return {
    start: p1,
    control1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
    control2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
    end: p2,
  };
});

export const CURIOUS_TRAIL_PATH = TRAIL_CURVES
  .map((curve, index) => {
    const prefix = index === 0 ? `M ${curve.start.x.toFixed(1)} ${curve.start.y.toFixed(1)}` : "";
    return `${prefix} C ${curve.control1.x.toFixed(1)} ${curve.control1.y.toFixed(1)} ${curve.control2.x.toFixed(1)} ${curve.control2.y.toFixed(1)} ${curve.end.x.toFixed(1)} ${curve.end.y.toFixed(1)}`;
  })
  .join(" ");

const CURVE_SAMPLES = 40;
const bez = (c: TrailCurve, t: number): TrailPoint => {
  const i = 1 - t;
  return {
    x: i ** 3 * c.start.x + 3 * i ** 2 * t * c.control1.x + 3 * i * t ** 2 * c.control2.x + t ** 3 * c.end.x,
    y: i ** 3 * c.start.y + 3 * i ** 2 * t * c.control1.y + 3 * i * t ** 2 * c.control2.y + t ** 3 * c.end.y,
  };
};
const CURVE_LENGTHS = TRAIL_CURVES.map((curve) => {
  let length = 0;
  let previous = curve.start;
  for (let i = 1; i <= CURVE_SAMPLES; i++) {
    const point = bez(curve, i / CURVE_SAMPLES);
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
});

const TOTAL_TRAIL_LENGTH = CURVE_LENGTHS.reduce((sum, length) => sum + length, 0);
/** Comprimento total da trilha (unidades do mundo). */
export const CURIOUS_TRAIL_LENGTH = TOTAL_TRAIL_LENGTH;

export function getTrailPositionAtFraction(fraction: number): TrailPoint {
  let remaining = Math.max(0, Math.min(1, fraction)) * TOTAL_TRAIL_LENGTH;
  const curveIndex = CURVE_LENGTHS.findIndex((length) => {
    if (remaining <= length) return true;
    remaining -= length;
    return false;
  });
  const idx = curveIndex < 0 ? TRAIL_CURVES.length - 1 : curveIndex;
  return bez(TRAIL_CURVES[idx], Math.max(0, Math.min(1, remaining / CURVE_LENGTHS[idx])));
}

/**
 * Como `getTrailPositionAtFraction`, mas aceita frações fora de 0..1: antes do início e depois do
 * fim a trilha é prolongada em linha reta (a avalanche nasce antes do ponto de partida).
 */
export function getTrailPointExtended(fraction: number): TrailPoint {
  if (fraction >= 0 && fraction <= 1) return getTrailPositionAtFraction(fraction);
  const edge = fraction < 0 ? 0 : 1;
  const a = getTrailPositionAtFraction(edge);
  const b = getTrailPositionAtFraction(edge === 0 ? 0.004 : 0.996);
  const dx = edge === 0 ? a.x - b.x : b.x - a.x;
  const dy = edge === 0 ? a.y - b.y : b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const extra = Math.abs(fraction - edge) * TOTAL_TRAIL_LENGTH;
  return { x: a.x + (dx / len) * extra, y: a.y + (dy / len) * extra };
}

/** Direção unitária (sentido da subida) da trilha na fração dada. */
export function getTrailTangent(fraction: number): TrailPoint {
  const d = 0.003;
  const a = getTrailPointExtended(fraction - d);
  const b = getTrailPointExtended(fraction + d);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

/**
 * Limites de cada nível ao longo da trilha (8 valores). O trecho de cada nível é proporcional à
 * quantidade de objetos (elementCount + 3 de folga): o nível 1 começa embaixo e o 7 termina na casinha.
 */
const LEVEL_ELEMENT_COUNTS = [1, 2, 3, 4, 5, 6, 7];
export const CAMP_FRACS: number[] = (() => {
  const weights = LEVEL_ELEMENT_COUNTS.map((n) => n + 3);
  const sum = weights.reduce((a, b) => a + b, 0);
  const out = [0];
  weights.forEach((w) => out.push(out[out.length - 1] + w / sum));
  out[out.length - 1] = 1;
  return out;
})();

/** Fração da trilha onde fica o marcador de cada nível (1..7): o início do trecho do nível. */
export const MARKER_FRACS: number[] = CAMP_FRACS.slice(0, 7);

/** Casinha do topo (porta), em unidades do mundo. */
export const HUT_DOOR: TrailPoint = { x: 421 * K, y: 134 * K };
export const HUT_POSITION: TrailPoint = { x: 420 * K, y: 128 * K };
