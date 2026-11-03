export interface TrailPoint {
  x: number;
  y: number;
}

interface TrailCurve {
  start: TrailPoint;
  control1: TrailPoint;
  control2: TrailPoint;
  end: TrailPoint;
}

const TRAIL_CURVES: TrailCurve[] = [
  // Caminho verde da ilustração: entra pelo pé da encosta e serpenteia até a cabana.
  { start: { x: 325, y: 592 }, control1: { x: 325, y: 535 }, control2: { x: 318, y: 485 }, end: { x: 324, y: 456 } },
  { start: { x: 324, y: 456 }, control1: { x: 327, y: 414 }, control2: { x: 337, y: 393 }, end: { x: 358, y: 373 } },
  { start: { x: 358, y: 373 }, control1: { x: 397, y: 345 }, control2: { x: 449, y: 347 }, end: { x: 493, y: 345 } },
  { start: { x: 493, y: 345 }, control1: { x: 535, y: 343 }, control2: { x: 568, y: 330 }, end: { x: 589, y: 309 } },
  { start: { x: 589, y: 309 }, control1: { x: 611, y: 286 }, control2: { x: 590, y: 270 }, end: { x: 558, y: 265 } },
  { start: { x: 558, y: 265 }, control1: { x: 535, y: 260 }, control2: { x: 520, y: 251 }, end: { x: 535, y: 240 } },
  { start: { x: 535, y: 240 }, control1: { x: 552, y: 226 }, control2: { x: 579, y: 225 }, end: { x: 604, y: 222 } },
];

export const CURIOUS_TRAIL_PATH = TRAIL_CURVES
  .map((curve, index) => {
    const prefix = index === 0 ? `M ${curve.start.x} ${curve.start.y}` : "";
    return `${prefix} C ${curve.control1.x} ${curve.control1.y} ${curve.control2.x} ${curve.control2.y} ${curve.end.x} ${curve.end.y}`;
  })
  .join(" ");

const CURVE_SAMPLES = 40;
const CURVE_LENGTHS = TRAIL_CURVES.map((curve) => {
  let length = 0;
  let previous = curve.start;
  for (let i = 1; i <= CURVE_SAMPLES; i++) {
    const t = i / CURVE_SAMPLES;
    const inverse = 1 - t;
    const point = {
      x:
        inverse ** 3 * curve.start.x +
        3 * inverse ** 2 * t * curve.control1.x +
        3 * inverse * t ** 2 * curve.control2.x +
        t ** 3 * curve.end.x,
      y:
        inverse ** 3 * curve.start.y +
        3 * inverse ** 2 * t * curve.control1.y +
        3 * inverse * t ** 2 * curve.control2.y +
        t ** 3 * curve.end.y,
    };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
});

export const CURIOUS_TRAIL_LENGTH = CURVE_LENGTHS.reduce((sum, length) => sum + length, 0);

export function getTrailPositionAtFraction(fraction: number): TrailPoint {
  let remaining = Math.max(0, Math.min(1, fraction)) * CURIOUS_TRAIL_LENGTH;
  const curveIndex = CURVE_LENGTHS.findIndex((length) => {
    if (remaining <= length) return true;
    remaining -= length;
    return false;
  });
  const selectedIndex = curveIndex < 0 ? TRAIL_CURVES.length - 1 : curveIndex;
  const curve = TRAIL_CURVES[selectedIndex];
  const length = CURVE_LENGTHS[selectedIndex];
  const t = Math.max(0, Math.min(1, remaining / length));
  const inverse = 1 - t;
  return {
    x:
      inverse ** 3 * curve.start.x +
      3 * inverse ** 2 * t * curve.control1.x +
      3 * inverse * t ** 2 * curve.control2.x +
      t ** 3 * curve.end.x,
    y:
      inverse ** 3 * curve.start.y +
      3 * inverse ** 2 * t * curve.control1.y +
      3 * inverse * t ** 2 * curve.control2.y +
      t ** 3 * curve.end.y,
  };
}
