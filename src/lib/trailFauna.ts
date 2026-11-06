/**
 * Fauna viva da mata da Trilha do Aluno Curioso.
 *
 * Os bichos são os 20 animais da ilustração de elenco (public/trilha/fauna/<id>.png). Eles vivem
 * DENTRO da mata, não numa camada solta por cima:
 *  - passeiam pelas clareiras da mata (os mesmos lugares onde os bichos pintados originais estavam) e,
 *    de vez em quando, ATRAVESSAM a trilha de terra para o outro lado;
 *  - passam ATRÁS de retalhos de folhagem (recortes da própria arte, ver trailFaunaPatches.ts) e
 *    podem se ESCONDER neles, espiando depois;
 *  - aves pousam nos galhos e voam entre poleiros; a preguiça se mantém no mesmo tronco e escala
 *    lentamente para cima e para baixo;
 *  - cada espécie tem um TEMPERAMENTO (amigável, assustadiço, cauteloso, defensivo, agressivo...)
 *    e reage ao aluno de acordo (nada machuca o aluno: é só comportamento e expressão);
 *  - cada CLIMA traz os bichos mais adaptados (sol, chuva, neve).
 *
 * O motor é puro (sem DOM): trabalha em unidades do mundo (1000 x 2201), é determinístico com
 * semente e é usado igualmente pelo jogo e pelo gerador de vídeo.
 */
import { ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";
import { WORLD_H, getTrailPositionAtFraction } from "@/lib/curiousTrailGeometry";
import { FOLIAGE_PATCHES } from "@/lib/trailFaunaPatches";
import { createSkyBirds, stepSkyBirds, type SkyBird } from "@/lib/trailSky";

const K = 1000 / 688; // pixels da arte original -> unidades do mundo
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const approach = (v: number, to: number, d: number) => (v < to ? Math.min(to, v + d) : Math.max(to, v - d));

export type Mood = "calm" | "alert" | "flee" | "curious" | "happy" | "curl" | "stalk" | "threat" | "lunge" | "retreat" | "hidden" | "forage";
type Temper = "friendly" | "skittish" | "wary" | "defensive" | "aggressive" | "peaceful" | "warning";

export interface FaunaSpec {
  id: string;
  kind: "ground" | "perch";
  /** altura do sprite em unidades do mundo */
  h: number;
  /** para onde o desenho original olha (+1 direita, -1 esquerda) */
  face: 1 | -1;
  speed: number;
  hop?: boolean;
  zigzag?: boolean;
  climbs?: boolean;
  gait: number;
  stride: number;
  temper: Temper;
  /** distância (unidades) em que reage ao aluno */
  sense: number;
  flee: number;
  water?: boolean;
  /** ponto de apoio no alto do desenho (preguiça pendurada) */
  hangs?: boolean;
  /** pica-pau: bica o tronco */
  pecks?: boolean;
  idle: [number, number];
}

export const FAUNA_SPECIES: Record<string, FaunaSpec> = {
  esquilo: { id: "esquilo", kind: "ground", h: 44, face: 1, speed: 80, hop: true, gait: 9, stride: 0, temper: "friendly", sense: 130, flee: 2, idle: [1.2, 3] },
  cervo: { id: "cervo", kind: "ground", h: 92, face: 1, speed: 42, gait: 0, stride: 70, temper: "wary", sense: 240, flee: 2.6, idle: [3, 5] },
  ourico: { id: "ourico", kind: "ground", h: 35, face: 1, speed: 24, gait: 0, stride: 22, temper: "defensive", sense: 120, flee: 1, idle: [2, 4] },
  gamba: { id: "gamba", kind: "ground", h: 44, face: -1, speed: 30, gait: 0, stride: 30, temper: "warning", sense: 170, flee: 1.4, idle: [2, 4] },
  picapau: { id: "picapau", kind: "perch", h: 50, face: 1, speed: 70, gait: 0, stride: 0, temper: "peaceful", sense: 0, flee: 1, pecks: true, idle: [3, 6] },
  javali: { id: "javali", kind: "ground", h: 58, face: 1, speed: 36, gait: 0, stride: 44, temper: "aggressive", sense: 260, flee: 1.8, idle: [2, 4] },
  onca: { id: "onca", kind: "ground", h: 58, face: -1, speed: 50, gait: 0, stride: 52, temper: "aggressive", sense: 300, flee: 1.6, idle: [3, 6] },
  coruja: { id: "coruja", kind: "perch", h: 50, face: 1, speed: 55, gait: 0, stride: 0, temper: "wary", sense: 220, flee: 1, idle: [5, 9] },
  tamandua: { id: "tamandua", kind: "ground", h: 46, face: -1, speed: 26, gait: 0, stride: 40, temper: "peaceful", sense: 0, flee: 1.5, idle: [3, 5] },
  tatu: { id: "tatu", kind: "ground", h: 38, face: -1, speed: 34, gait: 0, stride: 28, temper: "defensive", sense: 130, flee: 1.2, idle: [2, 4] },
  jacare: { id: "jacare", kind: "ground", h: 35, face: 1, speed: 14, gait: 0, stride: 40, temper: "aggressive", sense: 150, flee: 1, water: true, idle: [5, 9] },
  preguica: { id: "preguica", kind: "perch", h: 64, face: 1, speed: 12, gait: 0, stride: 0, temper: "peaceful", sense: 0, flee: 1, hangs: true, idle: [16, 25] },
  tucano: { id: "tucano", kind: "perch", h: 52, face: 1, speed: 72, gait: 0, stride: 0, temper: "friendly", sense: 240, flee: 1, idle: [3, 6] },
  lontra: { id: "lontra", kind: "ground", h: 40, face: 1, speed: 50, gait: 0, stride: 34, temper: "friendly", sense: 150, flee: 1.6, water: true, idle: [2, 4] },
  quati: { id: "quati", kind: "ground", h: 46, face: -1, speed: 56, gait: 0, stride: 36, temper: "friendly", sense: 140, flee: 1.8, idle: [1.5, 3] },
  guara: { id: "guara", kind: "ground", h: 75, face: 1, speed: 62, gait: 0, stride: 60, temper: "wary", sense: 230, flee: 2.2, idle: [2.5, 5] },
  paca: { id: "paca", kind: "ground", h: 44, face: 1, speed: 40, gait: 0, stride: 30, temper: "skittish", sense: 170, flee: 2.3, idle: [2, 4] },
  jabuti: { id: "jabuti", kind: "ground", h: 29, face: -1, speed: 12, gait: 0, stride: 20, temper: "defensive", sense: 100, flee: 1, idle: [3, 6] },
  sapo: { id: "sapo", kind: "ground", h: 26, face: -1, speed: 60, hop: true, gait: 7, stride: 0, temper: "skittish", sense: 110, flee: 1.8, water: true, idle: [2, 4] },
  cutia: { id: "cutia", kind: "ground", h: 35, face: -1, speed: 55, hop: true, gait: 8, stride: 0, temper: "skittish", sense: 170, flee: 2.2, idle: [2, 4] },
  coelho: { id: "coelho", kind: "ground", h: 44, face: 1, speed: 82, hop: true, gait: 4.1, stride: 0, temper: "skittish", sense: 190, flee: 2.8, zigzag: true, idle: [1.8, 3.8] },
  cobra: { id: "cobra", kind: "ground", h: 30, face: 1, speed: 24, gait: 0, stride: 0, temper: "wary", sense: 130, flee: 1.2, climbs: true, idle: [4, 8] },
  caracol: { id: "caracol", kind: "ground", h: 12, face: 1, speed: 4, gait: 0, stride: 0, temper: "peaceful", sense: 0, flee: 1, climbs: true, idle: [5, 12] },
  formiga: { id: "formiga", kind: "ground", h: 9, face: 1, speed: 16, gait: 0, stride: 0, temper: "peaceful", sense: 0, flee: 1, idle: [0.5, 1.5] },
  pacu: { id: "pacu", kind: "ground", h: 22, face: 1, speed: 22, gait: 0, stride: 0, temper: "wary", sense: 100, flee: 1.8, water: true, idle: [1, 2.5] },
};
export const FAUNA_IDS = Object.keys(FAUNA_SPECIES);
export const VECTOR_FAUNA_IDS = new Set(["coelho", "cobra", "caracol", "formiga", "pacu"]);

/**
 * Os dados do jogo (curiousTrailData.ts) identificam os bichos em inglês (squirrel, deer...). Os recortes e o
 * comportamento usam os ids em português abaixo. Este mapa liga os dois.
 */
export const DATA_TO_FAUNA_ID: Record<string, string> = {
  squirrel: "esquilo",
  deer: "cervo",
  hedgehog: "ourico",
  skunk: "gamba",
  woodpecker: "picapau",
  boar: "javali",
  jaguar: "onca",
  owl: "coruja",
  anteater: "tamandua",
  armadillo: "tatu",
  caiman: "jacare",
  sloth: "preguica",
  toucan: "tucano",
  otter: "lontra",
  coati: "quati",
  "maned-wolf": "guara",
  pacu: "pacu",
  tortoise: "jabuti",
  frog: "sapo",
  agouti: "cutia",
  rabbit: "coelho",
  snake: "cobra",
  snail: "caracol",
  ant: "formiga",
};
const faunaIdOf = (dataId: string) => DATA_TO_FAUNA_ID[dataId] ?? (FAUNA_SPECIES[dataId] ? dataId : undefined);


/** Fauna presente em cada trecho, de acordo com seus horários e habitats. */
export const FAUNA_BY_WEATHER: Record<TrailWeather, readonly string[]> = {
  sunny: ["esquilo", "cervo", "picapau", "tucano", "quati", "tamandua", "tatu", "paca", "cutia", "jabuti", "gamba", "preguica", "javali", "coelho", "formiga", "pacu"],
  night: ["coruja", "onca", "guara", "gamba", "sapo", "cobra", "coelho", "tatu", "tamandua", "formiga"],
  rain: ["sapo", "lontra", "jacare", "preguica", "tucano", "quati", "ourico", "jabuti", "paca", "cervo", "cobra", "caracol", "formiga", "coelho", "pacu"],
  snow: ["cervo", "javali", "coruja", "esquilo", "guara", "picapau"],
};
const HIGHLIGHTS: Record<TrailWeather, readonly string[]> = {
  sunny: ["esquilo", "cervo", "tucano"],
  night: ["coruja", "onca", "guara"],
  rain: ["sapo", "lontra", "tucano"],
  snow: ["cervo", "coruja"],
};
const TARGET: Record<TrailWeather, number> = { sunny: 8, night: 7, rain: 8, snow: 5 };
/** Quem adora/aguenta o tempo fica mais ativo; os demais, mais quietos. */
const WEATHER_LOVERS: Record<TrailWeather, readonly string[]> = {
  sunny: FAUNA_IDS,
  night: ["coruja", "onca", "guara", "gamba", "sapo", "cobra", "coelho", "tamandua"],
  rain: ["sapo", "lontra", "jacare", "tucano", "ourico", "preguica", "caracol"],
  snow: ["cervo", "javali", "coruja", "guara", "esquilo"],
};

/* ------------------------------------------------------------------ lugares da mata */

const P = (x: number, y: number) => ({ x: x * K, y: y * K });

/** Clareiras do chão da mata (os lugares onde os bichos pintados originais estavam). */
const HABITAT: { x: number; y: number }[] = [
  [40, 530], [130, 556], [381, 505], [100, 980], [432, 1160], [376, 1190], [498, 1205], [100, 1297], [633, 1290], [280, 1337],
  [288, 1397], [470, 1345], [608, 1405], [75, 837], [590, 815], [138, 700], [655, 728], [20, 1182], [417, 1498], [645, 367],
  [230, 1100], [520, 1090], [470, 1230], [180, 760], [560, 650], [300, 470], [520, 330], [150, 330], [400, 250], [60, 240],
].map(([x, y]) => P(x, y));

/** Pontos de apoio pintados na mata; as dez primeiras posições também definem troncos reais para a preguiça. */
const PERCHES: { x: number; y: number; patch: number }[] = [
  [52, 106], [142, 112], [40, 372], [604, 442], [672, 562], [25, 676], [42, 730], [612, 975], [626, 472], [80, 408],
].map(([x, y]) => ({ ...P(x, y), patch: -1 }));
// dentro das copas: o bicho fica ATRÁS do retalho de folhagem (some entre as folhas)
FOLIAGE_PATCHES.forEach((p, i) => PERCHES.push({ x: p.cx, y: p.cy - p.ry * 0.25, patch: i }));

/** Esconderijos: dentro da folhagem densa. */
const HIDES = FOLIAGE_PATCHES.map((p, i) => ({ x: p.cx, y: p.cy - p.ry * 0.2, patch: i }));

/** Beiras d'água (para sapo, lontra, jacaré). */
const WATER_EDGES: { x: number; y: number }[] = [
  [383, 1040], [350, 1036], [420, 1040], [323, 812], [300, 809], [560, 1096], [410, 917], [445, 952],
].map(([x, y]) => P(x, y));

/** Pontos da trilha usados para os bichos ATRAVESSAREM o caminho. */
const PATH_SAMPLES = (() => {
  const out: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let i = 0; i <= 80; i++) {
    const f = i / 80;
    const a = getTrailPositionAtFraction(Math.max(0, f - 0.004));
    const b = getTrailPositionAtFraction(Math.min(1, f + 0.004));
    const p = getTrailPositionAtFraction(f);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    out.push({ x: p.x, y: p.y, nx: -dy / len, ny: dx / len });
  }
  return out;
})();

/* ------------------------------------------------------------------ estado */

export interface Critter {
  uid: number;
  animal: TrailAnimal;
  spec: FaunaSpec;
  x: number;
  y: number;
  /** altura do voo/pulo (unidades) */
  z: number;
  /** lado para o qual olha na tela (+1 direita, -1 esquerda) */
  look: number;
  state: "idle" | "move" | "fly" | "climb" | "leaving";
  mood: Mood;
  moodT: number;
  cool: number;
  hasTarget: boolean;
  tx: number;
  ty: number;
  timer: number;
  clk: number;
  /** fase da passada / do pulo */
  phase: number;
  /** direção vertical da escalada da preguiça */
  climbDir: -1 | 1;
  v: number;
  /** retalho de folhagem em que está escondido/pousado (-1 = nenhum) */
  patch: number;
  /** progresso do voo entre poleiros (0..1) */
  flyU: number;
  fx: number;
  fy: number;
  fdur: number;
  perch: number;
  react: number;
  age: number;
  seed: number;
  /** Presa que está sendo perseguida; a interação termina com a presa escapando. */
  huntTargetUid: number | null;
  fleePredatorUid: number | null;
  zigzagTimer: number;
  zigzagSide: number;
}

export interface DrawItem {
  key: number;
  critter?: Critter;
  patch?: number;
}

export interface Fauna {
  critters: Critter[];
  skyBirds: SkyBird[];
  step: (dt: number, student?: { x: number; y: number } | null) => void;
  /** Bichos e retalhos de folhagem em ordem de profundidade (de trás para frente). */
  drawList: () => DrawItem[];
  hit: (x: number, y: number) => Critter | null;
  poke: (c: Critter) => void;
  find: (id: string) => Critter | undefined;
  /** Ponto logo acima da cabeça (para o balão de fala). */
  headPos: (c: Critter) => { x: number; y: number };
  setWeather: (w: TrailWeather) => void;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NEAR = 420; // janela vertical em volta do aluno onde os bichos vivem
const SPAWN_RING: [number, number] = [330, 520]; // chegam de fora da tela
const FAR = 650; // além disso o bicho é reciclado

export function createFauna(initialWeather: TrailWeather = "sunny", seed?: number): Fauna {
  const rnd = seed === undefined ? Math.random : mulberry32(seed);
  const critters: Critter[] = [];
  const skyBirds = createSkyBirds(seed ?? 8041);
  const pending: { delay: number; id?: string }[] = [];
  let weather = initialWeather;
  let uid = 0;
  let populated = false;
  let swapTimer = 9;
  let stu = { x: 500, y: WORLD_H - 200 };

  const speciesPool = () => {
    const allowed = new Set(FAUNA_BY_WEATHER[weather]);
    return ROAMING_ANIMAL_POOL.filter((a) => {
      const f = faunaIdOf(a.id);
      if (!f || !allowed.has(f)) return false;
      // Caracóis e formigas são observações ocasionais, nunca uma parte dominante do cenário.
      if (f === "caracol") return weather === "rain" && rnd() < 0.13;
      if (f === "formiga") return rnd() < 0.22;
      return true;
    });
  };

  const mk = (animal: TrailAnimal): Critter => {
    const spec = FAUNA_SPECIES[faunaIdOf(animal.id) as string];
    return {
      uid: uid++,
      animal,
      spec,
      x: 500,
      y: 1000,
      z: 0,
      look: rnd() > 0.5 ? 1 : -1,
      state: "idle",
      mood: "calm",
      moodT: 0,
      cool: rnd() * 4,
      hasTarget: false,
      tx: 0,
      ty: 0,
      timer: 1 + rnd() * 2,
      clk: rnd() * 10,
      phase: rnd() * 6.28,
      climbDir: rnd() > 0.5 ? 1 : -1,
      v: 0,
      patch: -1,
      flyU: 0,
      fx: -1,
      fy: 0,
      fdur: 1,
      perch: -1,
      react: 0,
      age: 0,
      seed: rnd() * 1000,
      huntTargetUid: null,
      fleePredatorUid: null,
      zigzagTimer: 0,
      zigzagSide: rnd() > 0.5 ? 1 : -1,
    };
  };

  const near = (y: number, lo: number, hi: number) => {
    const d = Math.abs(y - stu.y);
    return d >= lo && d <= hi;
  };
  const crowded = (x: number, y: number, self?: Critter) => critters.some((c) => c !== self && Math.hypot(c.x - x, c.y - y) < (self && self.spec.h < 15 ? 11 : 46));
  const perchTaken = (i: number) => critters.some((c) => c.perch === i);

  function pickGroundSpot(c: Critter, lo: number, hi: number): { x: number; y: number; patch: number } | null {
    const list: { x: number; y: number; patch: number }[] = [];
    if (c.spec.water) WATER_EDGES.forEach((p) => near(p.y, lo, hi) && list.push({ ...p, patch: -1 }));
    else if (c.spec.climbs) {
      PERCHES.slice(0, 10).forEach((p) => near(p.y, lo, hi) && list.push({ x: p.x, y: p.y, patch: -1 }));
    } else {
      HABITAT.forEach((p) => near(p.y, lo, hi) && list.push({ ...p, patch: -1 }));
      HIDES.forEach((p) => near(p.y, lo, hi) && list.push({ x: p.x, y: p.y, patch: p.patch }));
    }
    const ok = list.filter((s) => !crowded(s.x, s.y, c));
    const pool = ok.length ? ok : list;
    return pool.length ? pool[Math.floor(rnd() * pool.length)] : null;
  }
  function pickPerch(c: Critter, lo: number, hi: number, excludeCurrent = true): number {
    const ok: number[] = [];
    PERCHES.forEach((p, i) => {
      // A preguiça usa somente os pontos de tronco/galho pintados na mata, nunca centros de folhagem.
      if (c.spec.hangs && i >= 10) return;
      if (!near(p.y, lo, hi)) return;
      if (excludeCurrent && i === c.perch) return;
      if (perchTaken(i)) return;
      // pica-pau e esquilo gostam de tronco; preguiça e coruja de galho/copa
      ok.push(i);
    });
    return ok.length ? ok[Math.floor(rnd() * ok.length)] : -1;
  }

  function spawn(initial: boolean, preferredId?: string) {
    const present = new Set(critters.map((c) => c.spec.id));
    const pool = speciesPool();
    let cand = pool.filter((a) => !present.has(faunaIdOf(a.id) as string) && (!preferredId || faunaIdOf(a.id) === preferredId));
    if (!cand.length && !preferredId) cand = pool.filter((a) => !present.has(faunaIdOf(a.id) as string));
    if (!cand.length) return;
    const c = mk(cand[Math.floor(rnd() * cand.length)]);
    if (c.spec.kind === "ground") {
      const sp = initial ? pickGroundSpot(c, 0, NEAR) : pickGroundSpot(c, SPAWN_RING[0], SPAWN_RING[1]);
      if (!sp) return;
      c.x = sp.x;
      c.y = sp.y;
      c.patch = -1;
      c.timer = initial ? rnd() * 3 : 0.3;
    } else {
      const pi = pickPerch(c, 0, initial ? NEAR + 60 : SPAWN_RING[1], false);
      if (pi < 0) return;
      c.perch = pi;
      c.x = PERCHES[pi].x;
      c.y = PERCHES[pi].y;
      c.patch = PERCHES[pi].patch;
      c.timer = rnd() * 4;
    }
    critters.push(c);
  }

  function populate() {
    for (const id of HIGHLIGHTS[weather]) spawn(true, id);
    let guard = 0;
    while (critters.length < TARGET[weather] && guard++ < 12) spawn(true);
  }

  function setWeather(next: TrailWeather) {
    if (weather === next) return;
    weather = next;
    pending.length = 0;
    const allowed = new Set(FAUNA_BY_WEATHER[weather]);
    for (let i = critters.length - 1; i >= 0; i--) if (!allowed.has(critters[i].spec.id)) critters.splice(i, 1);
    if (populated) populate();
  }

  /* ---------- movimentos ---------- */
  const stop = (c: Critter, t = 0.6) => {
    c.state = "idle";
    c.hasTarget = false;
    c.v = 0;
    c.timer = t;
  };
  const goTo = (c: Critter, x: number, y: number, patch = -1) => {
    c.tx = x;
    c.ty = clamp(y, 20, WORLD_H - 10);
    c.state = "move";
    c.hasTarget = true;
    c.patch = c.patch >= 0 && patch < 0 ? c.patch : patch; // mantém o retalho até sair dele (atrás da folha)
    c.fx = patch; // retalho de destino
  };
  const goAway = (c: Critter, dist: number) => {
    const ax = c.x - stu.x;
    const ay = c.y - stu.y;
    const len = Math.hypot(ax, ay) || 1;
    goTo(c, clamp(c.x + (ax / len) * dist, 20, 980), c.y + (ay / len) * dist * 0.6);
  };
  const preyByPredator: Record<string, readonly string[]> = {
    onca: ["coelho", "paca", "cutia", "quati", "tatu", "cervo", "cobra", "jacare"],
    jacare: ["sapo", "pacu"],
    coruja: ["esquilo", "sapo", "cobra", "caracol", "formiga", "coelho", "gamba"],
    guara: ["coelho", "paca", "cutia", "sapo", "cobra", "caracol", "formiga"],
    cobra: ["sapo", "formiga", "caracol", "esquilo"],
    gamba: ["caracol", "formiga", "sapo"],
    tamandua: ["formiga"],
    lontra: ["pacu"],
  };
  const foragers = new Set(["esquilo", "cervo", "javali", "tamandua", "paca", "jabuti", "cutia", "coelho", "cobra", "caracol", "formiga"]);

  function fleeFromPredator(prey: Critter, predator: Critter) {
    prey.fleePredatorUid = predator.uid;
    prey.zigzagTimer = 0.45;
    const cover = prey.spec.zigzag ? undefined : HIDES
      .filter((h) => !prey.spec.water)
      .map((h) => ({ ...h, dist: Math.hypot(h.x - prey.x, h.y - prey.y) }))
      .filter((h) => h.dist < 250 && Math.hypot(h.x - predator.x, h.y - predator.y) > Math.hypot(prey.x - predator.x, prey.y - predator.y))
      .sort((a, b) => a.dist - b.dist)[0];
    prey.mood = "flee";
    prey.moodT = 2.4;
    if (cover) goTo(prey, cover.x, cover.y, cover.patch);
    else {
      const dx = prey.x - predator.x;
      const dy = prey.y - predator.y;
      const len = Math.hypot(dx, dy) || 1;
      const side = prey.spec.zigzag ? prey.zigzagSide * 120 : 0;
      goTo(prey, clamp(prey.x + dx / len * 240 - (dy / len) * side, 20, 980), prey.y + dy / len * 150 + (dx / len) * side);
    }
  }

  function findPrey(c: Critter): Critter | undefined {
    const allowed = preyByPredator[c.spec.id];
    if (!allowed) return undefined;
    return critters
      .filter((other) => other !== c && allowed.includes(other.spec.id) && other.mood !== "hidden" && other.state !== "leaving")
      .map((other) => ({ other, d: Math.hypot(other.x - c.x, other.y - c.y) }))
      .filter(({ other, d }) => d < 340 && d > (other.spec.h < 15 ? 8 : 70) && (c.spec.id !== "jacare" || other.spec.water))
      .sort((a, b) => a.d - b.d)[0]?.other;
  }
  /** Foge para a folhagem mais próxima (se houver), senão para longe do aluno. */
  function fleeToCover(c: Critter, dist: number) {
    let best = -1;
    let bd = 260;
    HIDES.forEach((h, i) => {
      const d = Math.hypot(h.x - c.x, h.y - c.y);
      const away = Math.hypot(h.x - stu.x, h.y - stu.y) > Math.hypot(c.x - stu.x, c.y - stu.y);
      if (d < bd && away) {
        bd = d;
        best = i;
      }
    });
    if (best >= 0 && c.spec.kind === "ground" && !c.spec.water) goTo(c, HIDES[best].x, HIDES[best].y, HIDES[best].patch);
    else goAway(c, dist);
  }
  function crossPath(c: Critter) {
    let bi = 0;
    let bd = Infinity;
    PATH_SAMPLES.forEach((p, i) => {
      if (!near(p.y, 0, NEAR)) return;
      const d = Math.hypot(p.x - c.x, p.y - c.y);
      if (d < bd) {
        bd = d;
        bi = i;
      }
    });
    const p = PATH_SAMPLES[bi];
    const side = (c.x - p.x) * p.nx + (c.y - p.y) * p.ny >= 0 ? -1 : 1; // para o lado oposto
    goTo(c, clamp(p.x + p.nx * 95 * side, 30, 970), p.y + p.ny * 95 * side);
    c.mood = "calm";
  }

  function startFlee(c: Critter, dur: number, dist: number) {
    c.mood = "flee";
    c.moodT = dur;
    fleeToCover(c, dist);
  }

  /** Reação ao aluno conforme o temperamento. */
  function react(c: Critter, ds: number) {
    const sp = c.spec;
    const R = sp.sense;

    if (c.mood === "flee" && (c.moodT <= 0 || c.state === "idle")) {
      if (sp.temper === "skittish" || sp.temper === "wary") {
        c.mood = "alert";
        c.moodT = 1.1;
        stop(c, 1.1);
      } else {
        c.mood = "calm";
        c.cool = Math.max(c.cool, 6);
      }
    }
    if ((c.mood === "happy" || c.mood === "alert" || c.mood === "retreat") && c.moodT <= 0) {
      if (c.mood === "happy") c.cool = 14;
      c.mood = "calm";
    }

    switch (sp.temper) {
      case "skittish":
        if (c.mood !== "flee" && c.mood !== "alert" && c.mood !== "hidden" && ds < R) startFlee(c, 1.6 + rnd() * 0.8, 260);
        break;
      case "wary":
        if (c.mood === "calm" && ds < R) {
          c.mood = "alert";
          c.moodT = 1.0;
          if (sp.kind === "ground") stop(c, 1.0);
        } else if (c.mood === "alert" && c.moodT <= 0.02 && ds < R * 0.85 && sp.kind === "ground") startFlee(c, 1.8, 240);
        break;
      case "friendly":
        if (sp.kind !== "ground") break;
        if (c.mood === "calm" && c.cool <= 0 && ds < R * 2.6 && ds > R * 0.75) {
          const ax = c.x - stu.x;
          const ay = c.y - stu.y;
          const len = Math.hypot(ax, ay) || 1;
          c.mood = "curious";
          c.moodT = 5;
          goTo(c, stu.x + (ax / len) * R * 0.7, stu.y + (ay / len) * R * 0.7);
        } else if (c.mood === "curious") {
          if (ds < R * 0.85) {
            c.mood = "happy";
            c.moodT = 3.4;
            stop(c, 3.4);
          } else if (c.moodT <= 0 || c.state === "idle") {
            c.mood = "calm";
            c.cool = 6;
          }
        }
        if (ds < R * 0.3 && c.mood !== "flee") startFlee(c, 0.9, 110);
        break;
      case "defensive":
        if (ds < R) {
          c.mood = "curl";
          c.moodT = 2.2;
          stop(c, 2.2);
        } else if (c.mood === "curl" && c.moodT <= 0) c.mood = "calm";
        break;
      case "warning": // gambá: planta os pés e faz pose de aviso
        if (c.mood === "calm" && c.cool <= 0 && ds < R) {
          c.mood = "threat";
          c.moodT = 2.4;
          stop(c, 2.4);
        } else if (c.mood === "threat" && c.moodT <= 0) {
          c.mood = "calm";
          c.cool = 10;
        }
        break;
      case "aggressive":
        // Predadores observam o aluno com cautela; a perseguição fica reservada
        // às presas naturais da espécie, sem ataques ao jogador.
        if (c.mood === "calm" && ds < R) {
          c.mood = "alert";
          c.moodT = 1.8;
          stop(c, 1.8);
        }
        break;
      default:
        break;
    }
  }

  const MOOD_SPEED: Partial<Record<Mood, number>> = { stalk: 0.6, lunge: 3.4, retreat: 1.5, curious: 1.15 };

  function updateGround(c: Critter, dt: number) {
    const sp = c.spec;
    c.clk += dt;
    c.moodT = Math.max(0, c.moodT - dt);
    c.cool = Math.max(0, c.cool - dt);
    if (c.spec.zigzag && c.fleePredatorUid != null && c.mood === "flee") {
      c.zigzagTimer -= dt;
      if (c.zigzagTimer <= 0) {
        const threat = critters.find((other) => other.uid === c.fleePredatorUid);
        if (threat) {
          const dx = c.x - threat.x;
          const dy = c.y - threat.y;
          const len = Math.hypot(dx, dy) || 1;
          const side = c.zigzagSide * 125;
          goTo(c, clamp(c.x + dx / len * 165 - dy / len * side, 22, 978), c.y + dy / len * 100 + dx / len * side);
          c.zigzagSide *= -1;
        }
        c.zigzagTimer = 0.48;
      }
    } else if (c.mood !== "flee") c.fleePredatorUid = null;
    const ds = Math.hypot(stu.x - c.x, stu.y - c.y);
    if (c.huntTargetUid != null) {
      const prey = critters.find((other) => other.uid === c.huntTargetUid);
      if (!prey || prey.mood === "hidden" || prey.state === "leaving" || Math.hypot(prey.x - c.x, prey.y - c.y) > 380) {
        c.huntTargetUid = null;
        c.mood = "calm";
        c.cool = 9;
        stop(c, 1.5);
      } else {
        const d = Math.hypot(prey.x - c.x, prey.y - c.y);
        const protectedPrey = prey.spec.temper === "defensive" || prey.spec.temper === "warning" || prey.mood === "curl" || prey.mood === "threat";
        if (d < 92 && protectedPrey) {
          prey.mood = prey.spec.id === "cobra" || prey.spec.id === "gamba" ? "threat" : "curl";
          stop(prey, 2.8);
          c.huntTargetUid = null;
          c.mood = "retreat";
          c.moodT = 1.3;
          c.cool = 15;
          const dx = c.x - prey.x;
          const dy = c.y - prey.y;
          const len = Math.hypot(dx, dy) || 1;
          goTo(c, clamp(c.x + dx / len * 150, 20, 980), c.y + dy / len * 110);
        } else if (d < 44 && prey.mood === "flee" && rnd() < 0.22) {
          // Capturas breves e sem violência gráfica: a presa some na vegetação enquanto o predador se alimenta.
          prey.mood = "hidden";
          prey.fleePredatorUid = null;
          stop(prey, 4 + rnd() * 2);
          c.huntTargetUid = null;
          c.mood = "forage";
          c.moodT = 3.2;
          c.cool = 18;
          stop(c, 3.2);
        } else if (d < 92 && prey.mood !== "flee") {
          fleeFromPredator(prey, c);
          c.mood = "lunge";
          c.moodT = 1.5;
          goTo(c, prey.x, prey.y);
        } else if (d > 210 && prey.mood === "flee") {
          c.huntTargetUid = null;
          c.mood = "calm";
          c.cool = 13;
          stop(c, 1.8);
        } else {
          c.moodT = Math.max(0, c.moodT - dt);
          if (c.mood === "stalk" && c.moodT === 0) {
            c.mood = "lunge";
            c.moodT = 3.5;
          } else if (c.mood === "lunge" && c.moodT === 0) {
            c.huntTargetUid = null;
            c.mood = "calm";
            c.cool = 12;
            stop(c, 1.8);
          }
          if (c.huntTargetUid != null) goTo(c, prey.x, prey.y);
        }
      }
      if (c.huntTargetUid == null) return;
    } else if (c.state === "idle" && c.cool <= 0 && c.mood === "calm" && preyByPredator[sp.id] && rnd() < dt * 0.08) {
      const prey = findPrey(c);
      if (prey) {
        c.huntTargetUid = prey.uid;
        c.mood = "stalk";
        c.moodT = 2.2;
        c.cool = 12;
        goTo(c, prey.x, prey.y);
        return;
      }
    }
    if (c.state !== "leaving") react(c, ds);

    if (c.state === "idle") {
      c.v = approach(c.v, 0, 240 * dt);
      if (c.mood === "alert" || c.mood === "threat" || c.mood === "curl" || c.mood === "happy" || c.mood === "curious" || c.mood === "lunge") {
        c.look = approach(c.look, stu.x >= c.x ? 1 : -1, 7 * dt);
      }
      // escondido atrás da folhagem: espia de vez em quando
      if (c.mood === "hidden") {
        c.moodT -= 0;
        if (c.timer <= 0) {
          c.mood = "calm";
          c.cool = 5;
        }
      }
      c.timer -= dt;
      if (c.mood === "forage") {
        if (c.moodT <= 0) c.mood = "calm";
        else return;
      }
      if (c.timer <= 0 && c.mood !== "curl" && c.mood !== "threat" && c.mood !== "happy" && c.mood !== "lunge") {
        if (c.mood === "hidden") c.mood = "calm";
        const roll = rnd();
        if (foragers.has(sp.id) && roll < 0.26) {
          c.mood = "forage";
          c.moodT = 1.8 + rnd() * 2.8;
          c.timer = c.moodT;
          return;
        }
        const stayedHidden = c.patch >= 0;
        if (!stayedHidden && roll < 0.18 && !sp.water && HIDES.length) {
          // vai se esconder na folhagem
          const hs = HIDES.filter((h) => near(h.y, 0, NEAR) && Math.hypot(h.x - c.x, h.y - c.y) < 420);
          if (hs.length) {
            const h = hs[Math.floor(rnd() * hs.length)];
            goTo(c, h.x, h.y, h.patch);
            return;
          }
        }
        if (roll < 0.3 && !sp.water && sp.id !== "jacare") {
          crossPath(c);
          return;
        }
        const spot = pickGroundSpot(c, 0, NEAR);
        if (spot) goTo(c, spot.x, spot.y, spot.patch);
        else c.timer = 1.5 + rnd() * 2;
      }
      return;
    }

    const dx = c.tx - c.x;
    const dy = c.ty - c.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 8) {
      if (c.state === "leaving") return;
      if (c.mood === "stalk") {
        c.mood = "threat";
        c.moodT = 1.4;
        stop(c, 1.4);
        return;
      }
      c.patch = c.fx >= 0 ? c.fx : -1;
      if (c.patch >= 0) {
        // chegou ao esconderijo: fica escondido um tempo
        c.mood = "hidden";
        stop(c, 3 + rnd() * 4);
        return;
      }
      stop(c, sp.idle[0] + rnd() * sp.idle[1]);
      return;
    }
    // saiu do esconderijo: volta a ficar à frente das folhas quando se afasta
    if (c.patch >= 0 && c.fx < 0) {
      const p = FOLIAGE_PATCHES[c.patch];
      if (Math.hypot(c.x - p.cx, c.y - p.cy) > Math.max(p.rx, p.ry) * 1.1) c.patch = -1;
    }
    const mult = c.mood === "flee" ? sp.flee : MOOD_SPEED[c.mood] ?? 1;
    const fast = mult > 1.4;
    const ease = fast ? 1 : Math.min(1, dist / 40);
    let speed = sp.speed * mult * (0.35 + 0.65 * ease);
    if (sp.hop) {
      c.phase += dt * sp.gait * (fast ? 1.3 : 1);
      const cyc = Math.max(0, Math.sin(c.phase));
      speed *= cyc > 0.12 ? 1.7 * cyc * cyc : 0;
    }
    c.v = approach(c.v, speed, (speed === 0 ? 480 : 300) * dt);
    if (!sp.hop && sp.stride > 0) c.phase += ((c.v * dt) / sp.stride) * Math.PI * 2;
    c.x += (dx / dist) * c.v * dt;
    c.y += (dy / dist) * c.v * dt;
    if (Math.abs(dx) > 1) c.look = approach(c.look, dx >= 0 ? 1 : -1, 5 * dt);
  }

  function updatePerch(c: Critter, dt: number) {
    const sp = c.spec;
    c.clk += dt;
    c.moodT = Math.max(0, c.moodT - dt);
    c.cool = Math.max(0, c.cool - dt);
    const ds = Math.hypot(stu.x - c.x, stu.y - c.y);

    // A preguiça não voa de copa em copa: mantém o mesmo apoio e sobe/desce pelo tronco.
    if (sp.hangs) {
      if (c.state === "climb") {
        c.flyU = Math.min(1, c.flyU + dt / c.fdur);
        const eased = c.flyU * c.flyU * (3 - 2 * c.flyU);
        c.x = c.fx;
        c.y = c.fy + (c.ty - c.fy) * eased;
        c.phase += dt * 5;
        if (c.flyU >= 1) {
          c.state = "idle";
          c.y = c.ty;
          c.climbDir = c.y >= PERCHES[c.perch].y ? -1 : 1;
          c.timer = 2.5 + rnd() * 4;
        }
        return;
      }

      c.phase += dt * 0.8;
      c.timer -= dt;
      if (c.timer <= 0 && c.perch >= 0) {
        const trunk = PERCHES[c.perch];
        const minY = trunk.y - 54;
        const maxY = trunk.y + 54;
        let targetY = c.y + c.climbDir * (36 + rnd() * 14);
        if (targetY < minY || targetY > maxY) {
          c.climbDir = c.climbDir === 1 ? -1 : 1;
          targetY = clamp(c.y + c.climbDir * (36 + rnd() * 14), minY, maxY);
        }
        c.fx = c.x;
        c.fy = c.y;
        c.tx = c.x;
        c.ty = targetY;
        c.flyU = 0;
        c.fdur = 3.8 + rnd() * 2.2;
        c.state = "climb";
      }
      return;
    }

    if (c.state === "fly") {
      c.flyU = Math.min(1, c.flyU + dt / c.fdur);
      const u = c.flyU;
      const e = u * u * (3 - 2 * u);
      const dx = c.tx - c.fx;
      c.x = c.fx + dx * e;
      c.y = c.fy + (c.ty - c.fy) * e;
      c.z = sp.hangs ? 0 : Math.sin(u * Math.PI) * (40 + Math.abs(dx) * 0.12);
      c.look = approach(c.look, dx >= 0 ? 1 : -1, 8 * dt);
      c.phase += dt * (sp.id === "coruja" ? 9 : sp.id === "tucano" ? 13 : 20);
      if (u >= 1) {
        c.state = "idle";
        c.z = 0;
        c.perch = c.fdur > 0 ? c.perch : -1;
        c.patch = PERCHES[c.perch]?.patch ?? -1;
        c.timer = sp.idle[0] + rnd() * sp.idle[1];
        if (c.mood === "curious") {
          c.mood = "happy";
          c.moodT = 4;
        }
      }
      return;
    }

    // pousado
    c.look = approach(c.look, c.mood === "alert" || c.mood === "happy" ? (stu.x >= c.x ? 1 : -1) : c.look, 4 * dt);
    if (c.mood === "alert" && c.moodT <= 0) c.mood = "calm";
    if (c.mood === "happy" && c.moodT <= 0) {
      c.mood = "calm";
      c.cool = 14;
    }
    if (c.mood === "lunge" && c.moodT <= 0) {
      c.mood = "calm";
      c.cool = 14;
    }
    // coruja: observa; se o aluno chega muito perto, troca de poleiro
    if (sp.id === "coruja" && ds < sp.sense) {
      if (c.mood === "calm") {
        c.mood = "alert";
        c.moodT = 3;
      }
    }
    const flyTo = (pi: number, dur: number) => {
      if (pi < 0) return;
      c.fx = c.x;
      c.fy = c.y;
      c.tx = PERCHES[pi].x;
      c.ty = PERCHES[pi].y;
      c.flyU = 0;
      c.fdur = dur;
      c.state = "fly";
      c.perch = pi;
      c.patch = -1; // em voo: à frente de tudo
    };
    // A coruja caça ao anoitecer: algumas investidas falham e outras terminam com a presa escondida.
    if (sp.id === "coruja" && c.mood === "calm" && c.cool <= 0 && rnd() < dt * 0.06) {
      const prey = findPrey(c);
      if (prey) {
        const preyDistance = Math.hypot(prey.x - c.x, prey.y - c.y);
        let perch = -1;
        let best = Infinity;
        PERCHES.forEach((p, i) => {
          if (perchTaken(i) || i === c.perch) return;
          const d = Math.hypot(p.x - prey.x, p.y - prey.y);
          if (d < best && d < 220) { best = d; perch = i; }
        });
        if (perch >= 0) {
          if ((prey.spec.temper === "defensive" || prey.spec.temper === "warning") && preyDistance < 110) {
            prey.mood = prey.spec.temper === "warning" ? "threat" : "curl";
            stop(prey, 2.5);
            c.mood = "retreat";
          } else if (preyDistance < 105 && prey.spec.h < 48 && rnd() < 0.2) {
            prey.mood = "hidden";
            stop(prey, 4 + rnd() * 2);
            c.mood = "forage";
            c.moodT = 3;
          } else {
            fleeFromPredator(prey, c);
            c.mood = "lunge";
            c.moodT = 2;
          }
          c.cool = 14;
          flyTo(perch, 1.4 + best / 180);
          return;
        }
      }
    }
    // amigáveis (tucano): vêm ver o aluno
    if (sp.temper === "friendly" && c.mood === "calm" && c.cool <= 0 && ds < sp.sense * 2.6 && ds > sp.sense * 0.5) {
      let best = -1;
      let bd = Infinity;
      PERCHES.forEach((p, i) => {
        if (perchTaken(i) || i === c.perch) return;
        const d = Math.hypot(p.x - stu.x, p.y - stu.y);
        if (d < bd && d < 320) {
          bd = d;
          best = i;
        }
      });
      if (best >= 0) {
        c.mood = "curious";
        flyTo(best, 1.8 + bd * 0.002);
        return;
      }
      c.cool = 8;
    }
    if (sp.id === "coruja" && c.mood === "alert" && ds < sp.sense * 0.5) {
      flyTo(pickPerch(c, 0, NEAR + 120), 2.2);
      c.mood = "calm";
      c.cool = 10;
      return;
    }
    c.timer -= dt;
    if (c.timer <= 0) {
      const pi = pickPerch(c, 0, NEAR + 120);
      if (pi >= 0) {
        const d = Math.hypot(PERCHES[pi].x - c.x, PERCHES[pi].y - c.y);
        flyTo(pi, sp.hangs ? Math.max(5, d / sp.speed) : 1.4 + d / sp.speed);
      } else c.timer = 2 + rnd() * 3;
    }
  }

  function step(dt: number, student?: { x: number; y: number } | null) {
    dt = Math.min(dt, 0.05);
    if (student) stu = student;
    if (!populated) {
      populated = true;
      populate();
    }
    for (const c of critters) {
      c.age += dt;
      if (c.react > 0) c.react = Math.max(0, c.react - dt);
      if (c.spec.kind === "ground") updateGround(c, dt);
      else updatePerch(c, dt);
    }
    stepSkyBirds(skyBirds, dt);
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      if (Math.abs(c.y - stu.y) > FAR && c.state !== "fly") {
        critters.splice(i, 1);
        pending.push({ delay: 0.5 + rnd() });
      }
    }
    swapTimer -= dt;
    if (swapTimer <= 0) {
      swapTimer = 10 + rnd() * 6;
      const ok = critters.filter((c) => c.state === "idle" && c.age > 10 && c.mood === "calm");
      if (ok.length >= TARGET[weather] - 1) {
        const v = ok[Math.floor(rnd() * ok.length)];
        critters.splice(critters.indexOf(v), 1);
        pending.push({ delay: 1.5 + rnd() * 2 });
      }
    }
    for (let i = pending.length - 1; i >= 0; i--) {
      pending[i].delay -= dt;
      if (pending[i].delay <= 0) {
        spawn(false, pending[i].id);
        pending.splice(i, 1);
      }
    }
    if (critters.length + pending.length < TARGET[weather]) pending.push({ delay: 1.2 });
  }

  function drawList(): DrawItem[] {
    const items: DrawItem[] = [];
    FOLIAGE_PATCHES.forEach((p, i) => {
      if (Math.abs(p.cy - stu.y) < 900) items.push({ key: p.base, patch: i });
    });
    for (const c of critters) {
      let key = c.y;
      if (c.state === "fly") key = 1e9;
      else if (c.patch >= 0 && c.mood === "hidden") key = FOLIAGE_PATCHES[c.patch].base - 1;
      else if (c.spec.kind === "perch" && c.patch >= 0) key = FOLIAGE_PATCHES[c.patch].base - 1;
      else if (c.patch >= 0) key = Math.min(c.y, FOLIAGE_PATCHES[c.patch].base - 1);
      items.push({ key, critter: c });
    }
    return items.sort((a, b) => a.key - b.key);
  }

  function hit(x: number, y: number): Critter | null {
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      if (c.mood === "hidden") continue;
      const top = c.spec.hangs ? c.y : c.y - c.z - c.spec.h * 0.5;
      if (Math.hypot(x - c.x, y - (top + (c.spec.hangs ? c.spec.h * 0.4 : 0))) <= Math.max(36, c.spec.h * 0.55)) return c;
    }
    return null;
  }

  function poke(c: Critter) {
    c.react = 0.7;
    if (c.spec.kind === "perch") {
      c.mood = "happy";
      c.moodT = 2.4;
      return;
    }
    switch (c.spec.temper) {
      case "friendly":
      case "peaceful":
        c.mood = "happy";
        c.moodT = 2.6;
        stop(c, 2.6);
        break;
      case "skittish":
        startFlee(c, 1.6, 200);
        break;
      case "wary":
        c.mood = "alert";
        c.moodT = 1.2;
        stop(c, 1.2);
        break;
      case "defensive":
        c.mood = "curl";
        c.moodT = 2.4;
        stop(c, 2.4);
        break;
      case "warning":
      case "aggressive":
        c.mood = "threat";
        c.moodT = 1.2;
        stop(c, 1.2);
        break;
    }
  }

  const find = (id: string) => critters.find((c) => c.animal.id === id && c.mood !== "hidden");
  const headPos = (c: Critter) => ({ x: c.x, y: c.spec.hangs ? c.y + c.spec.h * 0.1 : c.y - c.z - c.spec.h - 8 });

  return { critters, skyBirds, step, drawList, hit, poke, find, headPos, setWeather };
}

/** Quais bichos esse clima favorece (para legendas/ajuda). */
export function faunaForWeather(weather: TrailWeather): readonly string[] {
  return FAUNA_BY_WEATHER[weather];
}
export function isWeatherLover(id: string, weather: TrailWeather): boolean {
  return WEATHER_LOVERS[weather].includes(id);
}
