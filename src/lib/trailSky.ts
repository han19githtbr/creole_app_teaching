const K = 1000 / 688;
const point = (x: number, y: number) => ({ x: x * K, y: y * K });

/** Poleiros usados pelas aves pequenas, em copas e galhos visíveis na própria arte. */
export const SKY_BIRD_PERCHES = [
  point(52, 106), point(142, 112), point(40, 372), point(80, 408),
  point(604, 442), point(626, 472), point(672, 562), point(645, 367),
];

export interface SkyBird {
  id: string;
  kind: "small" | "raptor";
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  tx: number;
  ty: number;
  z: number;
  state: "fly" | "perch" | "forage" | "hunt" | "flee" | "hidden";
  phase: number;
  timer: number;
  flightTime: number;
  flightDuration: number;
  perchIndex: number;
  facing: 1 | -1;
  seed: number;
  targetId: string | null;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function setFlight(bird: SkyBird, x: number, y: number, duration: number, state: SkyBird["state"], targetId: string | null = null) {
  bird.fromX = bird.x;
  bird.fromY = bird.y;
  bird.tx = x;
  bird.ty = y;
  bird.flightTime = 0;
  bird.flightDuration = duration;
  bird.state = state;
  bird.targetId = targetId;
  bird.facing = x >= bird.x ? 1 : -1;
}

export function createSkyBirds(seed: number): SkyBird[] {
  const small = [
    { x: 395, y: 134 }, { x: 425, y: 112 }, { x: 458, y: 150 },
    { x: 487, y: 128 }, { x: 445, y: 177 }, { x: 514, y: 165 },
  ];
  const birds: SkyBird[] = small.map((p, index) => ({
    id: `canopy-bird-${index}`,
    kind: "small",
    x: p.x, y: p.y, fromX: p.x, fromY: p.y,
    tx: p.x, ty: p.y, z: 0,
    state: "fly",
    phase: index * 1.8,
    timer: 2 + ((index * 7 + seed) % 26) / 10,
    flightTime: 0,
    flightDuration: 1.2 + Math.abs(SKY_BIRD_PERCHES[index % SKY_BIRD_PERCHES.length].x - p.x) / 220,
    perchIndex: index % SKY_BIRD_PERCHES.length,
    facing: index % 2 ? 1 : -1,
    seed: seed + index * 13.7,
    targetId: null,
  }));
  birds.forEach((bird) => {
    const perch = SKY_BIRD_PERCHES[bird.perchIndex];
    bird.tx = perch.x;
    bird.ty = perch.y - 8;
  });
  const eagle: SkyBird = {
    id: "sky-raptor", kind: "raptor", x: 876, y: 270, fromX: 876, fromY: 270,
    tx: 718, ty: 298, z: 0, state: "fly", phase: seed * 0.01,
    timer: 5, flightTime: 0, flightDuration: 2.2, perchIndex: -1,
    facing: -1, seed: seed + 211, targetId: null,
  };
  birds.push(eagle);
  return birds;
}

function launchToPerch(bird: SkyBird, index: number, state: SkyBird["state"] = "fly", targetId: string | null = null) {
  const perch = SKY_BIRD_PERCHES[index % SKY_BIRD_PERCHES.length];
  bird.perchIndex = index % SKY_BIRD_PERCHES.length;
  setFlight(bird, perch.x, perch.y - (bird.kind === "small" ? 8 : 0), bird.kind === "small" ? 1.1 + Math.abs(perch.x - bird.x) / 200 : 1.7, state, targetId);
}

export function stepSkyBirds(birds: SkyBird[], dt: number) {
  const smallBirds = birds.filter((bird) => bird.kind === "small");
  for (const bird of birds) {
    bird.phase += dt * (bird.kind === "small" ? 15 : 7.5);
    if (bird.state === "fly" || bird.state === "hunt" || bird.state === "flee") {
      bird.flightTime = Math.min(bird.flightDuration, bird.flightTime + dt);
      const u = clamp(bird.flightTime / Math.max(0.01, bird.flightDuration), 0, 1);
      const eased = u * u * (3 - 2 * u);
      bird.x = bird.fromX + (bird.tx - bird.fromX) * eased;
      bird.y = bird.fromY + (bird.ty - bird.fromY) * eased;
      bird.z = Math.sin(u * Math.PI) * (bird.kind === "raptor" ? 54 : 22);
      if (u >= 1) {
        bird.x = bird.tx;
        bird.y = bird.ty;
        bird.z = 0;
        if (bird.state === "flee") {
          bird.state = "fly";
          bird.targetId = null;
          bird.timer = 1.5;
        } else if (bird.state === "hunt") {
          const prey = smallBirds.find((item) => item.id === bird.targetId);
          if (prey && Math.hypot(prey.x - bird.x, prey.y - bird.y) < 105 && Math.abs(Math.sin(prey.seed + bird.phase)) < 0.38) {
            // A investida termina com a ave pequena escondida na copa; a cena evita violência gráfica.
            prey.state = "hidden";
            prey.timer = 7;
            prey.targetId = null;
            const feedPerch = Math.floor(Math.abs(Math.sin(bird.seed + bird.phase)) * SKY_BIRD_PERCHES.length);
            const perch = SKY_BIRD_PERCHES[feedPerch];
            bird.x = perch.x;
            bird.y = perch.y - 8;
            bird.perchIndex = feedPerch;
            bird.state = "forage";
            bird.timer = 2.6;
          }
          if (bird.state === "hunt") {
            bird.state = "fly";
            bird.targetId = null;
            bird.timer = 7;
          }
        } else {
          bird.state = "perch";
          bird.perchIndex = SKY_BIRD_PERCHES.findIndex((p) => Math.hypot(p.x - bird.x, p.y - bird.y) < 2);
          bird.timer = bird.kind === "small" ? 2.2 + (Math.abs(Math.sin(bird.seed)) * 4) : 4 + Math.abs(Math.sin(bird.seed)) * 7;
        }
      }
      continue;
    }

    bird.timer -= dt;
    if (bird.state === "hidden") {
      if (bird.timer <= 0) {
        const perch = SKY_BIRD_PERCHES[bird.perchIndex >= 0 ? bird.perchIndex : 0];
        bird.x = perch.x;
        bird.y = perch.y - 8;
        bird.state = "perch";
        bird.timer = 3 + Math.abs(Math.sin(bird.seed)) * 3;
      }
      continue;
    }
    if (bird.kind === "raptor") {
      if (bird.timer <= 0) {
        const prey = smallBirds
          .filter((item) => item.state === "perch" || item.state === "forage")
          .map((item) => ({ item, d: Math.hypot(item.x - bird.x, item.y - bird.y) }))
          .filter(({ d }) => d < 260)
          .sort((a, b) => a.d - b.d)[0]?.item;
        if (prey && Math.abs(Math.sin(bird.seed + bird.phase)) > 0.25) {
          for (const flockMate of smallBirds) {
            if (Math.hypot(flockMate.x - prey.x, flockMate.y - prey.y) < 150 && (flockMate.state === "perch" || flockMate.state === "forage")) {
              setFlight(flockMate, clamp(flockMate.x + (flockMate.x - bird.x) * 0.7 + Math.sin(flockMate.seed) * 65, 30, 970), clamp(flockMate.y - 75 - Math.abs(Math.sin(flockMate.seed)) * 50, 40, 430), 0.8 + Math.abs(Math.sin(flockMate.seed)), "flee");
            }
          }
          setFlight(bird, prey.x, prey.y - 24, 1.1, "hunt", prey.id);
        } else {
          launchToPerch(bird, Math.floor(Math.abs(Math.sin(bird.seed + bird.phase)) * SKY_BIRD_PERCHES.length));
        }
      }
      continue;
    }

    if (bird.timer <= 0) {
      if (bird.state === "perch" && Math.abs(Math.sin(bird.seed + bird.phase * 0.08)) < 0.48) {
        bird.state = "forage";
        bird.timer = 1.2 + Math.abs(Math.sin(bird.seed * 0.3)) * 2;
        continue;
      }
      const next = Math.floor(Math.abs(Math.sin(bird.seed + bird.phase)) * SKY_BIRD_PERCHES.length);
      launchToPerch(bird, next);
    }
  }
}
