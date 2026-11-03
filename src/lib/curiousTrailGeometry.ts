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
  // Caminho da trilha completa (viewBox 1000x2200): do pé da montanha até a casinha do topo.
  { start: { x: 515, y: 2180 }, control1: { x: 513, y: 2173 }, control2: { x: 498, y: 2160 }, end: { x: 505, y: 2140 } },
  { start: { x: 505, y: 2140 }, control1: { x: 512, y: 2120 }, control2: { x: 528, y: 2080 }, end: { x: 560, y: 2060 } },
  { start: { x: 560, y: 2060 }, control1: { x: 592, y: 2040 }, control2: { x: 662, y: 2037 }, end: { x: 700, y: 2020 } },
  { start: { x: 700, y: 2020 }, control1: { x: 738, y: 2003 }, control2: { x: 780, y: 1982 }, end: { x: 790, y: 1960 } },
  { start: { x: 790, y: 1960 }, control1: { x: 800, y: 1938 }, control2: { x: 792, y: 1910 }, end: { x: 760, y: 1890 } },
  { start: { x: 760, y: 1890 }, control1: { x: 728, y: 1870 }, control2: { x: 660, y: 1853 }, end: { x: 600, y: 1840 } },
  { start: { x: 600, y: 1840 }, control1: { x: 540, y: 1827 }, control2: { x: 457, y: 1822 }, end: { x: 400, y: 1810 } },
  { start: { x: 400, y: 1810 }, control1: { x: 343, y: 1798 }, control2: { x: 292, y: 1788 }, end: { x: 260, y: 1770 } },
  { start: { x: 260, y: 1770 }, control1: { x: 228, y: 1752 }, control2: { x: 207, y: 1723 }, end: { x: 205, y: 1700 } },
  { start: { x: 205, y: 1700 }, control1: { x: 203, y: 1677 }, control2: { x: 214, y: 1650 }, end: { x: 250, y: 1630 } },
  { start: { x: 250, y: 1630 }, control1: { x: 286, y: 1610 }, control2: { x: 355, y: 1594 }, end: { x: 420, y: 1580 } },
  { start: { x: 420, y: 1580 }, control1: { x: 485, y: 1566 }, control2: { x: 580, y: 1560 }, end: { x: 640, y: 1545 } },
  { start: { x: 640, y: 1545 }, control1: { x: 700, y: 1530 }, control2: { x: 753, y: 1511 }, end: { x: 780, y: 1490 } },
  { start: { x: 780, y: 1490 }, control1: { x: 807, y: 1469 }, control2: { x: 812, y: 1442 }, end: { x: 800, y: 1420 } },
  { start: { x: 800, y: 1420 }, control1: { x: 788, y: 1398 }, control2: { x: 757, y: 1375 }, end: { x: 710, y: 1360 } },
  { start: { x: 710, y: 1360 }, control1: { x: 663, y: 1345 }, control2: { x: 583, y: 1340 }, end: { x: 520, y: 1330 } },
  { start: { x: 520, y: 1330 }, control1: { x: 457, y: 1320 }, control2: { x: 378, y: 1314 }, end: { x: 330, y: 1300 } },
  { start: { x: 330, y: 1300 }, control1: { x: 282, y: 1286 }, control2: { x: 251, y: 1266 }, end: { x: 230, y: 1245 } },
  { start: { x: 230, y: 1245 }, control1: { x: 209, y: 1224 }, control2: { x: 198, y: 1197 }, end: { x: 205, y: 1175 } },
  { start: { x: 205, y: 1175 }, control1: { x: 212, y: 1153 }, control2: { x: 229, y: 1132 }, end: { x: 270, y: 1115 } },
  { start: { x: 270, y: 1115 }, control1: { x: 311, y: 1098 }, control2: { x: 387, y: 1087 }, end: { x: 450, y: 1075 } },
  { start: { x: 450, y: 1075 }, control1: { x: 513, y: 1063 }, control2: { x: 595, y: 1058 }, end: { x: 650, y: 1045 } },
  { start: { x: 650, y: 1045 }, control1: { x: 705, y: 1032 }, control2: { x: 757, y: 1015 }, end: { x: 780, y: 995 } },
  { start: { x: 780, y: 995 }, control1: { x: 803, y: 975 }, control2: { x: 805, y: 944 }, end: { x: 790, y: 925 } },
  { start: { x: 790, y: 925 }, control1: { x: 775, y: 906 }, control2: { x: 735, y: 891 }, end: { x: 690, y: 880 } },
  { start: { x: 690, y: 880 }, control1: { x: 645, y: 869 }, control2: { x: 572, y: 870 }, end: { x: 520, y: 860 } },
  { start: { x: 520, y: 860 }, control1: { x: 468, y: 850 }, control2: { x: 412, y: 837 }, end: { x: 380, y: 820 } },
  { start: { x: 380, y: 820 }, control1: { x: 348, y: 803 }, control2: { x: 340, y: 782 }, end: { x: 330, y: 760 } },
  { start: { x: 330, y: 760 }, control1: { x: 320, y: 738 }, control2: { x: 320, y: 713 }, end: { x: 318, y: 690 } },
  { start: { x: 318, y: 690 }, control1: { x: 316, y: 667 }, control2: { x: 318, y: 640 }, end: { x: 318, y: 620 } },
  { start: { x: 318, y: 620 }, control1: { x: 318, y: 600 }, control2: { x: 316, y: 584 }, end: { x: 318, y: 570 } },
  { start: { x: 318, y: 570 }, control1: { x: 320, y: 556 }, control2: { x: 326, y: 554 }, end: { x: 327, y: 535 } },
  { start: { x: 327, y: 535 }, control1: { x: 328, y: 516 }, control2: { x: 323, y: 484 }, end: { x: 325, y: 455 } },
  { start: { x: 325, y: 455 }, control1: { x: 327, y: 426 }, control2: { x: 329, y: 384 }, end: { x: 341, y: 364 } },
  { start: { x: 341, y: 364 }, control1: { x: 353, y: 344 }, control2: { x: 376, y: 344 }, end: { x: 398, y: 336 } },
  { start: { x: 398, y: 336 }, control1: { x: 420, y: 328 }, control2: { x: 448, y: 318 }, end: { x: 472, y: 314 } },
  { start: { x: 472, y: 314 }, control1: { x: 496, y: 310 }, control2: { x: 522, y: 315 }, end: { x: 540, y: 310 } },
  { start: { x: 540, y: 310 }, control1: { x: 558, y: 305 }, control2: { x: 573, y: 292 }, end: { x: 580, y: 285 } },
  { start: { x: 580, y: 285 }, control1: { x: 587, y: 278 }, control2: { x: 590, y: 273 }, end: { x: 583, y: 267 } },
  { start: { x: 583, y: 267 }, control1: { x: 576, y: 261 }, control2: { x: 552, y: 252 }, end: { x: 541, y: 248 } },
  { start: { x: 541, y: 248 }, control1: { x: 530, y: 244 }, control2: { x: 522, y: 248 }, end: { x: 520, y: 245 } },
  { start: { x: 520, y: 245 }, control1: { x: 518, y: 242 }, control2: { x: 516, y: 238 }, end: { x: 529, y: 233 } },
  { start: { x: 529, y: 233 }, control1: { x: 542, y: 228 }, control2: { x: 586, y: 218 }, end: { x: 598, y: 215 } },
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
