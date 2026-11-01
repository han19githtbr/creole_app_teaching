/**
 * Vida selvagem da Trilha Curiosa.
 *
 * Os bichos passeiam pela encosta de forma natural, usando os mesmos desenhos e a mesma
 * lógica de movimento (SVG calculado a cada instante) da parte de criação de histórias:
 * coelho/raposa/cervo reaproveitados de storySceneLife, mais os bichos próprios da montanha.
 *
 *  - Os de chão andam entre os pontos da encosta com curva suave, aceleram/freiam, param para
 *    olhar, viram de lado com giro suave e (coelho, esquilo, sapo) avançam aos pulinhos.
 *  - Os voadores (borboleta, abelha, passarinho, águia) voam com batida de asas, altitude
 *    variável, sombra no chão e pousam nos pontos da encosta.
 *  - De tempos em tempos um bicho vai embora (anda/voa para fora do mapa) e outra espécie chega.
 */
import { G, ell, circ, line, limb, f, sin, cos, clamp, PI, rabbit, fox, deer } from "@/lib/storySceneLife";
import { TRAIL_ROAM_SPOTS, ROAMING_ANIMAL_POOL, type TrailAnimal } from "@/lib/curiousTrailData";

type Kind = "walk" | "fly";
interface Spec {
  kind: Kind;
  scale: number; // tamanho relativo do desenho
  speed: number; // px/s num cenário de 1000px de largura
  gait: number; // frequência do passo/pulo (rad/s do desenho)
  hop?: boolean; // avança aos pulinhos
  turn: number; // velocidade de curva (rad/s)
  idle: [number, number]; // tempo parado [min, extra]
}

const SPECIES: Record<string, Spec> = {
  squirrel: { kind: "walk", scale: 1.0, speed: 75, gait: 10, hop: true, turn: 6, idle: [1.2, 3] },
  rabbit: { kind: "walk", scale: 1.05, speed: 62, gait: 9, hop: true, turn: 5, idle: [2, 4] },
  frog: { kind: "walk", scale: 1.15, speed: 46, gait: 6, hop: true, turn: 5, idle: [2, 4] },
  snail: { kind: "walk", scale: 1.0, speed: 6, gait: 2, turn: 2, idle: [3, 5] },
  chamois: { kind: "walk", scale: 0.95, speed: 40, gait: 7, turn: 3, idle: [3, 5] },
  deer: { kind: "walk", scale: 0.62, speed: 36, gait: 5, turn: 2.5, idle: [3, 5] },
  fox: { kind: "walk", scale: 0.72, speed: 64, gait: 10, turn: 4, idle: [2, 3] },
  hedgehog: { kind: "walk", scale: 1.1, speed: 20, gait: 9, turn: 3, idle: [2, 4] },
  turtle: { kind: "walk", scale: 1.1, speed: 12, gait: 4, turn: 2, idle: [3, 5] },
  bird: { kind: "fly", scale: 1.5, speed: 90, gait: 16, turn: 5, idle: [3, 4] },
  eagle: { kind: "fly", scale: 0.95, speed: 60, gait: 1.6, turn: 1, idle: [0, 0] },
  butterfly: { kind: "fly", scale: 1.7, speed: 40, gait: 12, turn: 3.5, idle: [2, 3] },
  bee: { kind: "fly", scale: 1.5, speed: 75, gait: 40, turn: 7, idle: [0.8, 1.2] },
};
const FALLBACK: Spec = SPECIES.rabbit;
const specOf = (id: string): Spec => SPECIES[id] ?? FALLBACK;

export interface Critter {
  uid: number;
  animal: TrailAnimal;
  spec: Spec;
  x: number; // fração da largura (0..1)
  y: number; // fração da altura (0..1) — posição no chão
  z: number; // altitude em px (voadores)
  heading: number;
  face: number; // -1..1 (giro suave)
  v: number;
  vz: number;
  state: "idle" | "move" | "leaving";
  hasTarget: boolean;
  tx: number;
  ty: number;
  timer: number;
  clk: number; // relógio geral
  cm: number; // relógio do movimento (só avança andando)
  ph: number;
  spot: number;
  landed: boolean;
  pause: number;
  react: number;
  age: number;
  orbit: number;
  enter: number;
  cxOff: number;
  color: string;
}

const COLORS = ["#f08a2b", "#4aa8e8", "#e86aa6", "#f2d33a", "#9b6be0"];
const rnd = Math.random;
const approach = (v: number, to: number, d: number) => (v < to ? Math.min(to, v + d) : Math.max(to, v - d));
const wrap = (a: number) => {
  while (a > PI) a -= 2 * PI;
  while (a < -PI) a += 2 * PI;
  return a;
};

/* ------------------------------------------------------------------ desenhos próprios (origem no chão, de frente para +x) */

type D = { s: number; m: number; a: number; moving: boolean; ph: number };

function squirrel(o: D): string {
  const w = o.m * 10 + o.ph, k = o.moving ? sin(w) : 0;
  const tail = sin(o.a * 3 + o.ph) * 7 + (o.moving ? sin(w) * 8 : 0);
  const body =
    `<g transform="rotate(${f(tail)} -12 -14)">${ell(-22, -26, 8, 17, "#c0691f", ' transform="rotate(-22 -22 -26)"')}${ell(-26, -36, 5, 10, "#e08a3a", ' transform="rotate(-22 -26 -36)"')}</g>` +
    limb(-7, -9, 9, k * 0.8, 3.5, "#8a4a14") + limb(8, -9, 9, -k * 0.8, 3.5, "#8a4a14") +
    ell(0, -14, 13, 8, "#b9651f") + ell(4, -11, 7, 4.5, "#f0d9b0") + circ(13, -21, 6, "#b9651f") +
    `<path d="M10 -26 L11 -33 L15 -26 Z" fill="#8a4a14"/>` + ell(16, -18, 3, 2.2, "#f0d9b0") + circ(15, -22, 1.3, "#111") + circ(19, -20, 1.2, "#222");
  return G(0, -Math.abs(k) * 9 * o.s, 0, o.s, o.s, body) + ell(0, 1, 15 * o.s, 3.5 * o.s, "rgba(0,0,0,.18)");
}

function frog(o: D): string {
  const w = o.m * 6 + o.ph, j = o.moving ? Math.abs(sin(w)) : 0, th = 1 + sin(o.a * 3 + o.ph) * 0.12;
  const body =
    `<path d="M-9 -4 Q${f(-19 - j * 4)} ${f(-2 - j * 6)} ${f(-14 - j * 8)} 2 L-4 3 Z" fill="#2f8f3a"/>` +
    ell(0, -8, 12, 8 - j * 1.5, "#3fae49") + ell(3, -5, 9, 4, "#d6f3b0") + ell(10, -12, 8, 6, "#4cc25a") +
    ell(15, -8, 4, 2.2 * th, "#d6f3b0") + circ(10, -18, 3.4, "#8ee68e") + circ(15, -17, 3, "#8ee68e") + circ(11, -18, 1.4, "#111") + circ(16, -17, 1.2, "#111") +
    line(13, -10, 20, -10, 1.2, "#2a6a30");
  return G(0, -j * 16 * o.s, j * -10, o.s, o.s, body) + ell(0, 1, 13 * o.s * (1 - j * 0.25), 3 * o.s, "rgba(0,0,0,.18)");
}

function snail(o: D): string {
  const st = o.moving ? sin(o.a * 2.2) * 2.5 : 0, eye = sin(o.a * 1.5 + o.ph) * 2;
  const body =
    `<path d="M-18 0 Q-14 -7 ${f(0 + st)} -6 Q${f(14 + st)} -8 ${f(20 + st)} -6 Q${f(24 + st)} -2 ${f(20 + st)} 0 Z" fill="#d9c29a"/>` +
    line(18 + st, -7, 20 + st + eye, -16, 1.6, "#c4a97a") + line(21 + st, -6, 25 + st + eye, -14, 1.6, "#c4a97a") +
    circ(20 + st + eye, -17, 1.6, "#222") + circ(25 + st + eye, -15, 1.6, "#222") +
    circ(-3, -15, 11, "#b8742e") + circ(-3, -15, 8, "#d99a4a") + circ(-3, -15, 5, "#b8742e") + circ(-3, -15, 2.4, "#d99a4a");
  return G(0, 0, 0, o.s, o.s, body) + ell(0, 1, 20 * o.s, 2.5 * o.s, "rgba(0,0,0,.15)");
}

function chamois(o: D): string {
  const w = o.m * 7 + o.ph, k = o.moving ? sin(w) : 0, down = o.moving ? 0 : (sin(o.a * 0.8 + o.ph) + 1) / 2;
  const legs = [[-16, k], [-9, -k], [10, -k], [17, k]].map(([lx, a], i) => limb(lx, -26, 27, (a as number) * 0.6, 4, i % 2 ? "#cfc4ae" : "#bfb39a")).join("");
  const head =
    `<g transform="rotate(${f(down * 55)} 17 -44)">${line(15, -40, 28, -56, 9, "#e8e0d0")}${ell(33, -58, 8, 5, "#efe8da", ' transform="rotate(-18 33 -58)"')}` +
    `<path d="M29 -62 Q26 -74 33 -76 M32 -63 Q31 -73 37 -73" stroke="#2a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
    `<path d="M36 -63 L41 -57" stroke="#2a2a2a" stroke-width="2" stroke-linecap="round"/>` + circ(35, -60, 1.5, "#111") + ell(40, -55, 2.4, 1.8, "#3a2a1a") + `</g>`;
  const body = legs + ell(0, -36, 23, 10.5, "#e2d8c4") + ell(-4, -38, 14, 6, "#d1c5ac") + head + ell(-23, -40, 4, 2.5, "#2a2a2a");
  return G(0, -Math.abs(k) * 1.6, 0, o.s, o.s, body) + ell(0, 1, 26 * o.s, 4 * o.s, "rgba(0,0,0,.18)");
}

function hedgehog(o: D): string {
  const w = o.m * 9 + o.ph, k = o.moving ? sin(w) : 0;
  let spikes = "";
  for (let i = 0; i < 13; i++) {
    const a = PI * (0.95 + (i / 12) * 1.05), x1 = cos(a) * 12 - 2, y1 = -9 + sin(a) * 8, x2 = cos(a) * 19 - 3, y2 = -9 + sin(a) * 15;
    spikes += line(x1, y1, x2, y2, 2.4, i % 2 ? "#4a3220" : "#6b4a2e");
  }
  const body = limb(-6, -4, 5, k * 0.7, 3, "#c9a77a") + limb(8, -4, 5, -k * 0.7, 3, "#c9a77a") + spikes + ell(0, -9, 14, 9, "#6b4a2e") + ell(14, -7, 8, 5.5, "#e0c29a") + circ(21, -7, 1.9, "#222") + circ(16, -10, 1.3, "#111");
  return G(0, -Math.abs(k) * 0.8, 0, o.s, o.s, body) + ell(0, 1, 16 * o.s, 3 * o.s, "rgba(0,0,0,.18)");
}

function turtle(o: D): string {
  const w = o.m * 4 + o.ph, k = o.moving ? sin(w) : 0, neck = sin(o.a * 1.6 + o.ph) * 1.6;
  const body =
    ell(-14 + k * 2, -3, 4, 3, "#a8c26a") + ell(10 - k * 2, -3, 4, 3, "#a8c26a") + `<path d="M-17 -8 L-24 -6 L-17 -4 Z" fill="#a8c26a"/>` +
    ell(0, -11, 17, 10, "#5b8c3a") + ell(0, -12, 11, 6.5, "#6fa347") + line(-4, -17, -4, -7, 1.3, "#3d6a26") + line(4, -17, 4, -7, 1.3, "#3d6a26") + line(-10, -12, 10, -12, 1.3, "#3d6a26") +
    ell(20 + neck, -9, 6, 4.5, "#a8c26a") + circ(23 + neck, -10, 1.2, "#111");
  return G(0, 0, 0, o.s, o.s, body) + ell(0, 1, 19 * o.s, 3 * o.s, "rgba(0,0,0,.15)");
}

function songbird(o: D & { flying: boolean }, col: string): string {
  if (o.flying) {
    const w = o.a * 16 + o.ph, k = sin(w);
    const wing = (dir: number, c: string) => `<path d="M-2 -1 Q${f(-6)} ${f(dir * (-14 - k * 8))} ${f(7)} ${f(dir * (-12 - k * 8) - 1)} Q3 -5 -2 -1 Z" fill="${c}"/>`;
    return G(0, 0, 0, o.s, o.s, wing(1, "#a82f27") + `<path d="M-9 1 L-19 ${f(3 + k * 2)} L-9 4 Z" fill="#8a2a22"/>` + ell(0, 0, 9, 5.5, col) + ell(4, 2, 5, 3, "#f3d9c0") + circ(9, -2, 4, col) + `<path d="M12 -2 L18 -1 L12 0 Z" fill="#f0a030"/>` + circ(10, -3, 1, "#111") + wing(-1, "#d9473a"));
  }
  const peck = Math.max(0, sin(o.a * 2.6 + o.ph)) ** 3, hop = Math.max(0, sin(o.a * 5 + o.ph)) ** 6 * 3;
  const body =
    line(-2, -7, -2, 0, 1.6, "#6b4a2e") + line(3, -7, 3, 0, 1.6, "#6b4a2e") + `<path d="M-8 -11 L-19 -7 L-9 -7 Z" fill="#8a2a22"/>` +
    ell(0, -12, 10, 7, col) + ell(3, -9, 6, 4, "#f3d9c0") + ell(-2, -12, 6.5, 4, "#a82f27") +
    `<g transform="rotate(${f(peck * 38)} 6 -16)">${circ(9, -19, 5.2, col)}<path d="M13 -19 L19 -18 L13 -17 Z" fill="#f0a030"/>${circ(10, -20, 1.1, "#111")}</g>`;
  return G(0, -hop, 0, o.s, o.s, body) + ell(0, 1, 9 * o.s, 2.5 * o.s, "rgba(0,0,0,.16)");
}

function eagle(o: D): string {
  const k = sin(o.a * 1.6 + o.ph) * 0.35 + sin(o.a * 0.5) * 0.1;
  const wing = (dir: number, c: string) =>
    `<path d="M-4 -2 Q-26 ${f(dir * (-14 + k * 26))} -54 ${f(dir * (-6 + k * 30))} Q-52 ${f(dir * (-2 + k * 20))} -44 ${f(dir * (-1 + k * 16))} Q-24 ${f(dir * (-3 + k * 8))} -4 5 Z" fill="${c}"/>`;
  const body = wing(-1, "#5a4028") + `<path d="M-14 0 L-30 ${f(-3 + k * 2)} L-32 5 L-14 4 Z" fill="#3a2614"/>` + ell(0, 0, 17, 5.5, "#4a3320") + circ(17, -1.5, 5, "#f4f0e6") + `<path d="M21 -1 L28 1 L21 3 Z" fill="#f2b632"/>` + circ(19, -2.5, 1.1, "#111") + wing(1, "#3a2614");
  return G(0, 0, 0, o.s, o.s, body);
}

function flutter(o: D & { landed: boolean }, col: string): string {
  const fl = o.landed ? 0.35 + 0.65 * Math.abs(sin(o.a * 2.2 + o.ph)) : 0.2 + 0.8 * Math.abs(sin(o.a * (12 + 4 * sin(o.a * 0.5)) + o.ph));
  const body =
    ell(-5.5, -3, 6.5 * fl, 8, col) + ell(5.5, -3, 6.5 * fl, 8, col) + ell(-4, 5, 4.5 * fl, 5.5, col, ' opacity=".85"') + ell(4, 5, 4.5 * fl, 5.5, col, ' opacity=".85"') +
    circ(-5.5 * fl, -4, 1.6, "rgba(255,255,255,.7)") + circ(5.5 * fl, -4, 1.6, "rgba(255,255,255,.7)") +
    ell(0, 0, 1.6, 6.5, "#3a2414") + line(0, -6, -3, -11, 1, "#3a2414") + line(0, -6, 3, -11, 1, "#3a2414");
  return G(0, 0, 0, o.s, o.s, body);
}

function bee(o: D): string {
  const wf = 0.35 + 0.65 * Math.abs(sin(o.a * 60 + o.ph));
  const body =
    ell(-2, -6, 4.5, 7.5 * wf, "rgba(255,255,255,.75)", ' transform="rotate(-24 -2 -6)"') + ell(2, -6, 4.5, 7.5 * wf, "rgba(255,255,255,.6)", ' transform="rotate(-8 2 -6)"') +
    ell(0, 0, 8, 5.5, "#f2c02b") + line(-2, -5, -2, 5, 2, "#2a2a2a") + line(3, -5, 3, 5, 2, "#2a2a2a") + `<path d="M-8 0 L-12 0.5 L-8 1.5 Z" fill="#2a2a2a"/>` + circ(8, -0.5, 3.8, "#2a2a2a") + circ(9.5, -1.5, 0.9, "#fff");
  return G(0, 0, 0, o.s, o.s, body);
}

/* ------------------------------------------------------------------ mundo */

export interface Wildlife {
  critters: Critter[];
  step: (dt: number, W: number, H: number) => void;
  render: (W: number, H: number) => string;
  hit: (px: number, py: number, W: number, H: number) => Critter | null;
  poke: (c: Critter) => void;
  find: (animalId: string) => Critter | undefined;
  position: (c: Critter, W: number, H: number) => { x: number; y: number };
}

const TARGET_COUNT = 6;
const REGION = { x0: 0.42, x1: 0.97, y0: 0.36, y1: 0.92 };

export function createWildlife(): Wildlife {
  const critters: Critter[] = [];
  const pending: { delay: number; kind?: Kind }[] = [];
  let uid = 0, swapTimer = 9;

  const mk = (animal: TrailAnimal): Critter => ({
    uid: uid++, animal, spec: specOf(animal.id), x: 0.5, y: 0.7, z: 0, heading: 0, face: rnd() > 0.5 ? 1 : -1, v: 0, vz: 0,
    state: "idle", hasTarget: false, tx: 0, ty: 0, timer: 1, clk: rnd() * 10, cm: rnd() * 10, ph: rnd() * 6.28, spot: -1,
    landed: false, pause: 3, react: 0, age: 0, orbit: rnd() * 6.28, enter: 0, cxOff: 0, color: COLORS[uid % COLORS.length],
  });

  const freeSpots = () => TRAIL_ROAM_SPOTS.map((_, i) => i).filter((i) => !critters.some((c) => c.spot === i));
  const pickFree = (): number => {
    const fr = freeSpots();
    return fr.length ? fr[Math.floor(rnd() * fr.length)] : -1;
  };
  const randRegion = () => ({ x: REGION.x0 + rnd() * (REGION.x1 - REGION.x0), y: REGION.y0 + rnd() * (REGION.y1 - REGION.y0) });

  function spawn(kind?: Kind, initial = false) {
    const visible = new Set(critters.map((c) => c.animal.id));
    let cand = ROAMING_ANIMAL_POOL.filter((a) => !visible.has(a.id) && (!kind || specOf(a.id).kind === kind));
    if (cand.length === 0) cand = ROAMING_ANIMAL_POOL.filter((a) => !visible.has(a.id));
    if (cand.length === 0) return;
    const c = mk(cand[Math.floor(rnd() * cand.length)]);
    if (c.spec.kind === "walk") {
      const sp = pickFree();
      if (sp < 0) return;
      c.spot = sp;
      const P = TRAIL_ROAM_SPOTS[sp];
      if (initial) {
        c.x = P.x / 100; c.y = P.y / 100; c.timer = rnd() * 3; c.state = "idle";
      } else {
        const fromBottom = P.y > 60;
        c.x = fromBottom ? clamp(P.x / 100 + (rnd() - 0.5) * 0.2, 0.05, 1) : 1.08;
        c.y = fromBottom ? 1.08 : P.y / 100;
        c.state = "move"; c.hasTarget = true; c.tx = P.x / 100; c.ty = P.y / 100;
        c.heading = Math.atan2(c.ty - c.y, c.tx - c.x);
      }
    } else if (c.animal.id === "eagle") {
      c.enter = initial ? 1 : 0;
    } else {
      const R = randRegion();
      if (initial) {
        c.x = R.x; c.y = R.y; c.z = 30;
        if (c.animal.id === "bird") {
          const sp = pickFree();
          if (sp >= 0) { c.spot = sp; c.x = TRAIL_ROAM_SPOTS[sp].x / 100; c.y = TRAIL_ROAM_SPOTS[sp].y / 100; c.z = 0; c.landed = true; c.state = "idle"; c.timer = 2 + rnd() * 3; }
        }
      } else {
        const left = rnd() > 0.5;
        c.x = left ? -0.08 : 1.08; c.y = REGION.y0 + rnd() * 0.4; c.z = 40;
        c.state = "move"; c.hasTarget = true; c.tx = R.x; c.ty = R.y; c.heading = left ? 0 : PI;
      }
    }
    critters.push(c);
  }

  // população inicial: 2 voadores + 4 de chão
  spawn("fly", true); spawn("fly", true);
  for (let i = 0; i < TARGET_COUNT - 2; i++) spawn("walk", true);

  function sendAway(c: Critter) {
    c.state = "leaving"; c.hasTarget = true; c.spot = -1; c.landed = false; c.react = 0;
    if (c.spec.kind === "walk") {
      if (c.y > 0.62) { c.tx = c.x + (rnd() - 0.5) * 0.15; c.ty = 1.2; } else { c.tx = 1.2; c.ty = c.y; }
    } else {
      const right = c.x > 0.5;
      c.tx = right ? 1.2 : -0.2; c.ty = c.y - 0.15;
    }
  }

  function chooseWalkTarget(c: Critter, W: number, H: number) {
    const sp = pickFree();
    if (sp < 0) { c.timer = 1.5; return; }
    c.spot = sp;
    const P = TRAIL_ROAM_SPOTS[sp];
    c.tx = P.x / 100 + (rnd() - 0.5) * (14 / W) * 2; c.ty = P.y / 100 + (rnd() - 0.5) * (10 / H) * 2;
    c.hasTarget = true; c.state = "move";
  }

  function updateWalker(c: Critter, dt: number, W: number, H: number) {
    const sp = c.spec, S = W / 1000;
    let X = c.x * W, Y = c.y * H;
    if (c.state === "idle") {
      c.v = approach(c.v, 0, 400 * dt);
      c.clk += dt * (c.animal.id === "deer" || c.animal.id === "chamois" ? 1 : 0.5);
      c.timer -= dt;
      if (c.timer <= 0) {
        if (c.hasTarget) c.state = "move";
        else chooseWalkTarget(c, W, H);
      }
    } else {
      const dx = c.tx * W - X, dy = c.ty * H - Y, dist = Math.hypot(dx, dy);
      let want = Math.atan2(dy, dx);
      want += sin(c.clk * 0.7 + c.ph) * 0.35 * clamp(dist / (120 * S), 0, 1); // caminho levemente curvo
      c.heading += clamp(wrap(want - c.heading), -sp.turn * dt, sp.turn * dt);
      const cruise = sp.speed * S * (c.state === "leaving" ? 1.25 : 1);
      const target = cruise * (dist < 40 * S ? clamp(dist / (40 * S), 0.3, 1) : 1);
      c.v = approach(c.v, target, cruise * 2.5 * dt);
      const gate = sp.hop ? 1.6 * Math.abs(sin(c.cm * sp.gait + c.ph)) : 1;
      X += cos(c.heading) * c.v * gate * dt; Y += sin(c.heading) * c.v * gate * dt;
      const rate = clamp(c.v / (cruise || 1), 0, 1.2);
      c.cm += dt * rate; c.clk += dt;
      c.pause -= dt;
      if (c.state === "move" && dist > 110 * S && c.pause <= 0 && rnd() < dt * 0.12) { c.state = "idle"; c.timer = 0.8 + rnd() * 1.6; c.pause = 5; }
      if (dist < 5 * S && c.state === "move") { c.hasTarget = false; c.state = "idle"; c.timer = sp.idle[0] + rnd() * sp.idle[1]; }
    }
    const cx = cos(c.heading);
    const wantFace = c.state === "idle" ? c.face : Math.abs(cx) > 0.12 ? Math.sign(cx) : c.face;
    c.face = approach(c.face, wantFace, 7 * dt);
    c.x = X / W; c.y = Y / H;
  }

  function updateFlyer(c: Critter, dt: number, W: number, H: number) {
    const sp = c.spec, S = W / 1000, id = c.animal.id;
    let X = c.x * W, Y = c.y * H;
    c.clk += dt;

    if (id === "eagle") {
      c.enter = Math.min(1, c.enter + dt / 7);
      if (c.state === "leaving") c.cxOff += dt * 0.14; else c.cxOff = (1 - c.enter) * 0.75;
      c.orbit += dt * 0.3;
      const cxp = 0.6 + c.cxOff, cyp = 0.2;
      const nx = (cxp + cos(c.orbit) * 0.2) * W, ny = (cyp + sin(c.orbit) * 0.07 + sin(c.orbit * 0.4) * 0.03) * H;
      c.heading = Math.atan2(ny - Y, nx - X);
      const vx = nx - X;
      X = nx; Y = ny; c.z = 0;
      if (Math.abs(vx) > 0.05) c.face = approach(c.face, Math.sign(vx), 2.2 * dt);
      c.x = X / W; c.y = Y / H;
      return;
    }

    const leaving = c.state === "leaving";
    const dx = c.tx * W - X, dy = c.ty * H - Y, dist = Math.hypot(dx, dy);

    if (c.landed || (c.state === "idle" && !c.hasTarget)) {
      c.v = approach(c.v, 0, 600 * dt);
      c.z = approach(c.z, c.landed ? 0 : c.z, 80 * dt);
      c.timer -= dt;
      if (id === "bee") c.z += sin(c.clk * 9) * 0.4; // pairando
      if (c.timer <= 0) {
        c.landed = false; c.state = "move";
        if (id === "bird") {
          const spn = pickFree();
          if (spn >= 0) { c.spot = spn; c.tx = TRAIL_ROAM_SPOTS[spn].x / 100; c.ty = TRAIL_ROAM_SPOTS[spn].y / 100; } else { const R = randRegion(); c.tx = R.x; c.ty = R.y; c.spot = -1; }
        } else { const R = randRegion(); c.tx = R.x; c.ty = R.y; }
        c.hasTarget = true;
      }
    } else {
      // voo: curva suave, ziguezague, altitude variando
      const base = id === "bee" ? 55 : id === "bird" ? 70 : 42;
      let want = Math.atan2(dy, dx);
      want += sin(c.clk * (id === "bee" ? 3.2 : 1.7) + c.ph) * (id === "butterfly" ? 0.9 : id === "bee" ? 0.7 : 0.25) * clamp(dist / (90 * S), 0.2, 1);
      c.heading += clamp(wrap(want - c.heading), -sp.turn * dt, sp.turn * dt);
      const cruise = sp.speed * S * (id === "butterfly" ? 0.55 + 0.45 * Math.abs(sin(c.clk * 1.1 + c.ph)) : 1) * (leaving ? 1.3 : 1);
      c.v = approach(c.v, cruise, cruise * 3 * dt);
      X += cos(c.heading) * c.v * dt; Y += sin(c.heading) * c.v * dt;
      // flutter lateral e altitude
      const perp = c.heading + PI / 2, fl = id === "butterfly" ? sin(c.clk * 6.3 + c.ph) * 22 + sin(c.clk * 3.1) * 12 : id === "bee" ? sin(c.clk * 11 + c.ph) * 16 : 0;
      X += cos(perp) * fl * S * dt; Y += sin(perp) * fl * S * dt * 0.5;
      const zWant = (base + sin(c.clk * 2.1 + c.ph) * 20 + sin(c.clk * 5.3 + c.ph) * 6) * S;
      const zNew = approach(c.z, zWant, 55 * S * dt);
      c.vz = (zNew - c.z) / Math.max(dt, 0.001);
      c.z = zNew;
      if (dist < (id === "bird" ? 8 : 16) * S && !leaving) {
        c.hasTarget = false;
        if (id === "bird") { c.landed = true; c.state = "idle"; c.timer = sp.idle[0] + rnd() * sp.idle[1]; }
        else if (id === "butterfly" && rnd() < 0.45) { c.landed = true; c.state = "idle"; c.timer = sp.idle[0] + rnd() * sp.idle[1]; }
        else if (id === "bee" && rnd() < 0.5) { c.state = "idle"; c.timer = sp.idle[0] + rnd() * sp.idle[1]; }
        else { const R = randRegion(); c.tx = R.x; c.ty = R.y; c.hasTarget = true; }
      }
      if (c.state === "idle" && c.hasTarget === false && !c.landed) { /* pairando (abelha) */ }
    }
    if (c.state === "idle" && !c.landed && !c.hasTarget && id === "bee" && c.timer <= 0) { c.state = "move"; }
    const cx = cos(c.heading);
    if (!c.landed && Math.abs(cx) > 0.1) c.face = approach(c.face, Math.sign(cx), 8 * dt);
    c.x = X / W; c.y = Y / H;
  }

  function step(dt: number, W: number, H: number) {
    if (!(W > 0 && H > 0)) return;
    dt = Math.min(dt, 0.05);
    for (const c of critters) {
      c.age += dt;
      if (c.react > 0) c.react = Math.max(0, c.react - dt);
      if (c.spec.kind === "walk") updateWalker(c, dt, W, H); else updateFlyer(c, dt, W, H);
      // bichos que saíram do mapa somem
    }
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      if (c.state === "leaving" && (c.x < -0.12 || c.x > 1.12 || c.y > 1.12 || c.y < -0.12)) critters.splice(i, 1);
    }
    swapTimer -= dt;
    if (swapTimer <= 0) {
      swapTimer = 8 + rnd() * 6;
      const ok = critters.filter((c) => c.state !== "leaving" && c.age > 6);
      if (ok.length >= TARGET_COUNT - 1) {
        const v = ok[Math.floor(rnd() * ok.length)];
        sendAway(v);
        pending.push({ delay: 1.5 + rnd() * 2, kind: rnd() < 0.6 ? v.spec.kind : undefined });
      }
    }
    for (let i = pending.length - 1; i >= 0; i--) {
      pending[i].delay -= dt;
      if (pending[i].delay <= 0) { spawn(pending[i].kind); pending.splice(i, 1); }
    }
    // garante população mínima
    if (critters.filter((c) => c.state !== "leaving").length + pending.length < TARGET_COUNT) pending.push({ delay: 1 });
  }

  function render(W: number, H: number): string {
    const S = W / 1000;
    const order = [...critters].sort((a, b) => a.y - b.y);
    let out = "";
    for (const c of order) {
      const depth = 0.75 + 0.5 * clamp(c.y, 0, 1.1);
      const s = S * c.spec.scale * depth;
      const X = c.x * W, Y = c.y * H, id = c.animal.id;
      const moving = c.state !== "idle" && c.v > 1;
      const d: D = { s, m: c.cm, a: c.clk, moving, ph: c.ph };
      const ro = c.react > 0 ? sin((c.react / 0.7) * PI) * 14 * S : 0;
      const br = 1 + sin(c.clk * 2.2 + c.ph) * 0.012;
      let inner = "";
      if (c.spec.kind === "walk") {
        switch (id) {
          case "squirrel": inner = squirrel(d); break;
          case "frog": inner = frog(d); break;
          case "snail": inner = snail(d); break;
          case "chamois": inner = chamois(d); break;
          case "hedgehog": inner = hedgehog(d); break;
          case "turtle": inner = turtle(d); break;
          case "deer": inner = deer(c.clk, { x: 0, y: 0, s, ph: c.ph }); break;
          case "fox": inner = fox(moving ? c.cm : 0.15, { x: 0, y: 0, s, ph: c.ph }); break;
          default: inner = rabbit(c.cm, { x: 0, y: 0, s, ph: c.ph, mode: moving ? "run" : "idle" });
        }
        out += G(X, Y - ro, 0, c.face, br, inner);
      } else {
        const flying = !c.landed;
        const alt = c.z;
        if (id === "eagle") {
          out += G(X, Y, c.face * 0 + 0, c.face, 1, G(0, 0, clamp(sin(c.orbit) * 6, -8, 8), 1, 1, eagle(d)));
          continue;
        }
        // sombra no chão
        const sh = clamp(1 - alt / (140 * S), 0.25, 1);
        out += ell(X, Y + 1, 9 * s * sh, 2.4 * s * sh, `rgba(0,0,0,${f(0.2 * sh)})`);
        const tilt = clamp(-c.vz / (40 * S + 1), -1, 1) * 18;
        let body = "";
        if (id === "bird") body = songbird({ ...d, flying }, "#d9473a");
        else if (id === "bee") body = bee(d);
        else body = flutter({ ...d, landed: c.landed }, c.color);
        out += G(X, Y - alt - ro, 0, c.face, 1, G(0, 0, tilt, 1, 1, body));
      }
    }
    return out;
  }

  function position(c: Critter, W: number, H: number) {
    const S = W / 1000, s = S * c.spec.scale * (0.75 + 0.5 * clamp(c.y, 0, 1.1));
    const top = c.animal.id === "eagle" ? 28 * S : c.spec.kind === "fly" ? c.z + 22 * s : 52 * s;
    return { x: c.x * W, y: c.y * H - top };
  }

  function hit(px: number, py: number, W: number, H: number): Critter | null {
    let best: Critter | null = null, bd = Infinity;
    const S = W / 1000;
    for (const c of critters) {
      if (c.state === "leaving") continue;
      const s = S * c.spec.scale * (0.75 + 0.5 * clamp(c.y, 0, 1.1));
      const cy = c.animal.id === "eagle" ? c.y * H : c.y * H - (c.spec.kind === "fly" ? c.z : 14 * s);
      const d = Math.hypot(px - c.x * W, py - cy);
      const r = Math.max(26, 22 * s * 1.6);
      if (d < r && d < bd) { best = c; bd = d; }
    }
    return best;
  }

  return {
    critters,
    step,
    render,
    hit,
    position,
    poke: (c) => { c.react = 0.7; },
    find: (id) => critters.find((c) => c.animal.id === id && c.state !== "leaving"),
  };
}
