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
  { start: { x: 120, y: 504 }, control1: { x: 160, y: 476 }, control2: { x: 210, y: 446 }, end: { x: 260, y: 420 } },
  { start: { x: 260, y: 420 }, control1: { x: 330, y: 390 }, control2: { x: 390, y: 358 }, end: { x: 440, y: 348 } },
  { start: { x: 440, y: 348 }, control1: { x: 390, y: 330 }, control2: { x: 345, y: 300 }, end: { x: 320, y: 264 } },
  { start: { x: 320, y: 264 }, control1: { x: 390, y: 225 }, control2: { x: 475, y: 212 }, end: { x: 560, y: 204 } },
  { start: { x: 560, y: 204 }, control1: { x: 630, y: 190 }, control2: { x: 690, y: 150 }, end: { x: 740, y: 132 } },
  { start: { x: 740, y: 132 }, control1: { x: 790, y: 115 }, control2: { x: 840, y: 70 }, end: { x: 880, y: 60 } },
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

const TOTAL_TRAIL_LENGTH = CURVE_LENGTHS.reduce((sum, length) => sum + length, 0);

export function getTrailPositionAtFraction(fraction: number): TrailPoint {
  let remaining = Math.max(0, Math.min(1, fraction)) * TOTAL_TRAIL_LENGTH;
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
