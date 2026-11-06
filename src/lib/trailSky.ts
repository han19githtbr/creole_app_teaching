/** Recortes dos pássaros originais do mapa, em unidades do mundo (1000 × 2201). */
export const TRAIL_BIRDS = [
  { id: "flock", src: "/trilha/aves/birds-flock.png", x: 396, y: 58, width: 125, height: 89, driftX: 42, driftY: 8, speed: 0.28 },
  { id: "sky", src: "/trilha/aves/birds-sky.png", x: 870, y: 86, width: 74, height: 78, driftX: 34, driftY: 6, speed: 0.24 },
  { id: "eagle", src: "/trilha/aves/bird-eagle-right.png", x: 868, y: 263, width: 49, height: 44, driftX: 30, driftY: 6, speed: 0.2 },
] as const;

export function trailBirdPosition(bird: (typeof TRAIL_BIRDS)[number], seconds: number) {
  const phase = seconds * bird.speed;
  return {
    x: bird.x + Math.sin(phase) * bird.driftX,
    y: bird.y + Math.sin(phase * 1.65) * bird.driftY,
  };
}
