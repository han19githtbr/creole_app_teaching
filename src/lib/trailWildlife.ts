/**
 * Fauna da Trilha do Aluno Curioso (mata).
 *
 * Os bichos que circulam pela mata são as vinte espécies da nova ilustração da fauna brasileira.
 *
 * A fauna passeia pela vegetação, cruza a trilha ocasionalmente, e aves alternam entre voo e pouso.
 * Animais aquáticos permanecem nos riachos; aproximações do aluno geram reações tranquilas.
 *
 * O mundo é retrato (1000 x ~2200): os bichos nascem/são reciclados perto do aluno.
 */
import { G, ell, circ, line, limb, f, sin, cos, clamp, PI } from "@/lib/storySceneLife";
import { ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";
import { WORLD_H, getTrailPositionAtFraction } from "@/lib/curiousTrailGeometry";

type Kind = "walk" | "fly" | "swim";
type Habitat = "forest" | "canopy" | "water";
type Temper = "friendly" | "skittish" | "wary" | "defensive" | "aggressive" | "peaceful";
export type Mood = "calm" | "alert" | "flee" | "curious" | "happy" | "curl" | "stalk" | "threat" | "lunge" | "retreat" | "dive";

interface Spec {
  kind: Kind;
  habitat: Habitat;
  scale: number;
  speed: number;
  gait: number;
  hop?: boolean;
  turn: number;
  idle: [number, number];
  temper: Temper;
  /** distância (unidades do mundo) em que reage ao aluno */
  sense: number;
  /** multiplicador de velocidade ao fugir */
  flee: number;
  /** constante de fase usada pelo desenho (w = m * K) */
  K: number;
  /** distância (unidades) percorrida por ciclo de passada (0 = não usa) */
  stride: number;
  /** altura do desenho (para posicionar o ícone de humor) */
  h: number;
}

const SPECIES: Record<string, Spec> = {
  squirrel: { kind: "walk", habitat: "forest", scale: 1.05, speed: 58, gait: 10, hop: true, turn: 6, idle: [1.2, 3], temper: "friendly", sense: 130, flee: 2.0, K: 10, stride: 0, h: 46 },
  deer: { kind: "walk", habitat: "forest", scale: 0.9, speed: 38, gait: 5, turn: 2.5, idle: [3, 5], temper: "wary", sense: 230, flee: 2.5, K: 5, stride: 72, h: 112 },
  hedgehog: { kind: "walk", habitat: "forest", scale: 1.1, speed: 22, gait: 9, turn: 3, idle: [2, 4], temper: "defensive", sense: 130, flee: 1, K: 9, stride: 20, h: 30 },
  skunk: { kind: "walk", habitat: "forest", scale: 0.98, speed: 36, gait: 5, turn: 3, idle: [3, 5], temper: "wary", sense: 145, flee: 1.8, K: 5, stride: 42, h: 44 },
  woodpecker: { kind: "fly", habitat: "forest", scale: 1.4, speed: 60, gait: 13, turn: 4, idle: [3, 5], temper: "friendly", sense: 220, flee: 1, K: 1, stride: 0, h: 28 },
  boar: { kind: "walk", habitat: "forest", scale: 1.12, speed: 36, gait: 5, turn: 2.8, idle: [2, 4], temper: "skittish", sense: 190, flee: 2.1, K: 5, stride: 44, h: 48 },
  jaguar: { kind: "walk", habitat: "forest", scale: 1.08, speed: 42, gait: 5, turn: 3.2, idle: [3, 5], temper: "wary", sense: 220, flee: 1.9, K: 5, stride: 52, h: 52 },
  owl: { kind: "fly", habitat: "forest", scale: 1.35, speed: 46, gait: 7, turn: 2.8, idle: [4, 6], temper: "wary", sense: 200, flee: 1, K: 1, stride: 0, h: 36 },
  anteater: { kind: "walk", habitat: "forest", scale: 1.08, speed: 24, gait: 4, turn: 2, idle: [4, 7], temper: "peaceful", sense: 0, flee: 1, K: 4, stride: 54, h: 40 },
  armadillo: { kind: "walk", habitat: "forest", scale: 0.98, speed: 18, gait: 4, turn: 2.4, idle: [3, 5], temper: "defensive", sense: 110, flee: 1, K: 4, stride: 28, h: 32 },
  caiman: { kind: "swim", habitat: "water", scale: 1.08, speed: 22, gait: 4, turn: 1.8, idle: [3, 5], temper: "wary", sense: 180, flee: 1.4, K: 4, stride: 40, h: 26 },
  sloth: { kind: "walk", habitat: "canopy", scale: 1.0, speed: 9, gait: 2, turn: 1.4, idle: [6, 9], temper: "peaceful", sense: 0, flee: 1, K: 2, stride: 64, h: 42 },
  toucan: { kind: "fly", habitat: "forest", scale: 1.55, speed: 54, gait: 10, turn: 3.5, idle: [3, 5], temper: "friendly", sense: 230, flee: 1, K: 1, stride: 0, h: 30 },
  otter: { kind: "swim", habitat: "water", scale: 1.0, speed: 38, gait: 7, turn: 3, idle: [2, 4], temper: "friendly", sense: 150, flee: 1.4, K: 7, stride: 38, h: 26 },
  coati: { kind: "walk", habitat: "forest", scale: 1.0, speed: 50, gait: 7, turn: 4, idle: [2, 4], temper: "friendly", sense: 150, flee: 1.8, K: 7, stride: 42, h: 48 },
  "maned-wolf": { kind: "walk", habitat: "forest", scale: 1.05, speed: 40, gait: 5, turn: 2.7, idle: [3, 5], temper: "wary", sense: 200, flee: 2, K: 5, stride: 62, h: 70 },
  pacu: { kind: "swim", habitat: "water", scale: 0.8, speed: 28, gait: 7, turn: 2.5, idle: [2, 4], temper: "peaceful", sense: 0, flee: 1, K: 7, stride: 0, h: 16 },
  tortoise: { kind: "walk", habitat: "forest", scale: 0.98, speed: 12, gait: 3, turn: 1.8, idle: [5, 8], temper: "peaceful", sense: 0, flee: 1, K: 3, stride: 40, h: 28 },
  frog: { kind: "swim", habitat: "water", scale: 0.75, speed: 34, gait: 9, hop: true, turn: 4, idle: [2, 4], temper: "skittish", sense: 110, flee: 2, K: 9, stride: 0, h: 24 },
  agouti: { kind: "walk", habitat: "forest", scale: 0.9, speed: 46, gait: 8, hop: true, turn: 4.5, idle: [2, 4], temper: "skittish", sense: 130, flee: 2.2, K: 8, stride: 0, h: 36 },
};
const FALLBACK: Spec = SPECIES.squirrel;
const specOf = (id: string): Spec => SPECIES[id] ?? FALLBACK;

/** A chuva realça os animais do riacho; os demais continuam vivendo na mata. */
const WEATHER_HIGHLIGHTS: Record<TrailWeather, readonly string[]> = {
  sunny: ["squirrel", "deer"],
  rain: ["otter", "toucan"],
  snow: ["owl", "jaguar"],
};
const WEATHER_TARGET: Record<TrailWeather, number> = { sunny: 7, rain: 6, snow: 6 };

function weatherAdjustedSpec(id: string, weather: TrailWeather): Spec {
  const spec = specOf(id);
  let speedFactor = 1;
  let restFactor = 1;
  if (weather === "rain") {
    if (spec.habitat === "water" || id === "toucan" || id === "frog") {
      speedFactor = 1.1; // adoram a chuva: mais ativos
      restFactor = 0.8;
    } else {
      speedFactor = 0.7;
      restFactor = 1.4;
    }
  } else if (weather === "snow") {
    speedFactor = 0.8;
    restFactor = 1.2;
  }
  return { ...spec, speed: spec.speed * speedFactor, idle: [spec.idle[0] * restFactor, spec.idle[1] * restFactor] };
}

export interface Critter {
  uid: number;
  animal: TrailAnimal;
  spec: Spec;
  x: number;
  y: number;
  z: number;
  heading: number;
  face: number;
  v: number;
  vz: number;
  state: "idle" | "move" | "leaving";
  mood: Mood;
  moodT: number;
  cool: number;
  hp: number;
  dive: number;
  hasTarget: boolean;
  tx: number;
  ty: number;
  timer: number;
  clk: number;
  cm: number;
  ph: number;
  spot: number;
  landed: boolean;
  react: number;
  age: number;
  orbit: number;
}

const approach = (v: number, to: number, d: number) => (v < to ? Math.min(to, v + d) : Math.max(to, v - d));
const wrap = (a: number) => {
  while (a > PI) a -= 2 * PI;
  while (a < -PI) a += 2 * PI;
  return a;
};
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type D = { s: number; m: number; a: number; moving: boolean; ph: number; mood?: Mood };

/** ESQUILO DOS BOSQUES (Sciurus vulgaris alpinus) */
function squirrel(o: D): string {
  const w = o.m * 10 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const tailSway = sin(o.a * 3.2 + o.ph) * 9 + (o.moving ? sin(w) * 11 : 0);
  const breath = sin(o.a * 2.5 + o.ph) * 0.8;

  // Cauda volumosa e felpuda em curva de S com camadas de pelo
  const tail = `
    <g transform="rotate(${f(tailSway)} -14 -16)">
      <path d="M-10 -12 C-26 -18 -36 -38 -24 -52 C-14 -64 -2 -60 -4 -48 C-6 -38 -18 -28 -10 -12 Z" fill="#b45309" stroke="#78350f" stroke-width="1.2" />
      <path d="M-12 -16 C-24 -24 -32 -40 -22 -50 C-14 -58 -6 -56 -8 -46 C-10 -38 -18 -30 -12 -16 Z" fill="#d97706" opacity="0.85" />
      <path d="M-14 -22 C-22 -28 -28 -40 -20 -46" stroke="#fef3c7" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round" />
    </g>
  `;

  // Pernas com garras
  const backLeg = limb(-8, -8, 11, k * 0.8, 4.2, "#92400e");
  const frontLeg = limb(9, -8, 10, -k * 0.8, 3.8, "#92400e");

  // Corpo com barriga bege clara
  const body = `
    ${tail}
    ${backLeg}
    ${frontLeg}
    <ellipse cx="0" cy="${f(-15 + breath)}" rx="15" ry="9.5" fill="#b45309" stroke="#78350f" stroke-width="1" />
    <ellipse cx="5" cy="${f(-12 + breath)}" rx="8.5" ry="5.5" fill="#fef3c7" />
    <!-- Cabeça com orelhas pontiagudas e tufos alpinos -->
    <circle cx="15" cy="${f(-22 + breath)}" r="7" fill="#b45309" stroke="#78350f" stroke-width="1" />
    <ellipse cx="18" cy="${f(-19 + breath)}" rx="4.5" ry="3.5" fill="#fde68a" />
    <!-- Focinho e nariz -->
    <circle cx="21.5" cy="${f(-20 + breath)}" r="1.3" fill="#18181b" />
    <!-- Olho preto brilhante com ponto de luz -->
    <circle cx="17" cy="${f(-24 + breath)}" r="1.8" fill="#18181b" />
    <circle cx="17.6" cy="${f(-24.6 + breath)}" r="0.6" fill="#ffffff" />
    <!-- Orelhas com tufos de pelo -->
    <polygon points="12,-28 14,-36 17,-28" fill="#92400e" stroke="#78350f" stroke-width="0.8" />
    <line x1="14" y1="-36" x2="14" y2="-40" stroke="#78350f" stroke-width="1.2" stroke-linecap="round" />
    <polygon points="17,-27 19,-35 21,-27" fill="#b45309" />
    <!-- Patinhas dianteiras segurando semente -->
    <circle cx="17" cy="${f(-13 + breath)}" r="2.2" fill="#92400e" />
    <circle cx="19" cy="${f(-14 + breath)}" r="2.2" fill="#78350f" />
    <!-- Noz de pinheiro -->
    <ellipse cx="18.5" cy="${f(-13.5 + breath)}" rx="2" ry="3" fill="#451a03" />
  `;

  return G(0, -Math.abs(k) * 10 * o.s, 0, o.s, o.s, body) + ell(0, 1, 16 * o.s, 4 * o.s, "rgba(0,0,0,.22)");
}


/** CERVO NOBRE (Cervus elaphus) */
function realDeer(o: D): string {
  const w = o.m * 5 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const graze = o.moving ? 0 : (sin(o.a * 0.9 + o.ph) + 1) / 2;

  // Pernas longas e elegantes
  const legs = [-22, -14, 16, 24]
    .map((lx, i) => {
      const col = i % 2 === 0 ? "#92400e" : "#78350f";
      return limb(lx, -36, 38, sin(w * 0.5 + i) * 0.05 + k * 0.4, 4.8, col);
    })
    .join("");

  // Cabeça e galhada ramificada
  const head = `
    <g transform="rotate(${f(-6 + graze * 46)} 26 -54)">
      <!-- Pescoço gracioso -->
      <line x1="24" y1="-52" x2="42" y2="-82" stroke="#b45309" stroke-width="10" stroke-linecap="round" />
      <ellipse cx="48" cy="-86" rx="12" ry="7.5" fill="#b45309" transform="rotate(-20 48 -86)" stroke="#78350f" stroke-width="1" />
      <!-- Olho grande e meigo com brilho -->
      <circle cx="51" cy="-88" r="2.2" fill="#18181b" />
      <circle cx="51.7" cy="-88.6" r="0.7" fill="#ffffff" />
      <!-- Focinho com boca e narinas -->
      <ellipse cx="58" cy="-83" rx="3.5" ry="2.6" fill="#291103" />
      <!-- Orelha elegante -->
      <ellipse cx="43" cy="-94" rx="3" ry="6" fill="#92400e" transform="rotate(-30 43 -94)" />
      <!-- Galhada ramificada imponente de cervo real -->
      <path
        d="M44 -92 L42 -110 M42 -104 L34 -112 M42 -98 L48 -112 M44 -90 L52 -110 M52 -104 L58 -112 M52 -98 L48 -108"
        stroke="#54280b"
        stroke-width="2.6"
        fill="none"
        stroke-linecap="round"
      />
    </g>
  `;

  // Corpo avermelhado com peito bege
  const body = `
    ${legs}
    <ellipse cx="0" cy="-48" rx="33" ry="15" fill="#b45309" stroke="#78350f" stroke-width="1.2" />
    <ellipse cx="8" cy="-43" rx="20" ry="10" fill="#d97706" opacity="0.8" />
    <ellipse cx="-20" cy="-48" rx="8" ry="6" fill="#fef3c7" opacity="0.85" />
    <!-- Pintas brancas sutis na pelagem de verão -->
    <circle cx="-8" cy="-52" r="1.8" fill="#fef3c7" opacity="0.6" />
    <circle cx="4" cy="-46" r="1.8" fill="#fef3c7" opacity="0.6" />
    <circle cx="16" cy="-48" r="1.8" fill="#fef3c7" opacity="0.6" />
    ${head}
    <!-- Cauda curta com mancha bege -->
    <ellipse cx="-33" cy="-54" rx="5.5" ry="3.5" fill="#fef3c7" transform="rotate(-30 -33 -54)" stroke="#b45309" stroke-width="1" />
  `;

  return G(0, -Math.abs(k) * 1.5, 0, o.s, o.s, body) + ell(0, 1, 36 * o.s, 6 * o.s, "rgba(0,0,0,.22)");
}


/** OURIÇO (Erinaceus europaeus) */
function hedgehog(o: D): string {
  const w = o.m * 9 + o.ph;
  const k = o.moving ? sin(w) : 0;

  // Espinhos com pontas afiadas graduadas
  let spikes = "";
  for (let i = 0; i < 15; i++) {
    const a = PI * (0.92 + (i / 14) * 1.08);
    const x1 = cos(a) * 13 - 2;
    const y1 = -10 + sin(a) * 9;
    const x2 = cos(a) * 22 - 3;
    const y2 = -10 + sin(a) * 17;
    spikes += line(x1, y1, x2, y2, 2.5, i % 2 ? "#451a03" : "#78350f");
    spikes += line(x2 - cos(a) * 3, y2 - sin(a) * 3, x2, y2, 1.8, "#fef3c7");
  }

  const body = `
    ${limb(-7, -4, 6, k * 0.7, 3.5, "#d97706")}
    ${limb(9, -4, 6, -k * 0.7, 3.5, "#d97706")}
    ${spikes}
    <ellipse cx="0" cy="-10" rx="15" ry="10" fill="#78350f" stroke="#451a03" stroke-width="1" />
    <!-- Focinho pontiagudo bege -->
    <ellipse cx="15" cy="-8" rx="9" ry="6" fill="#fef3c7" stroke="#d97706" stroke-width="1" />
    <circle cx="23" cy="-8" r="2" fill="#18181b" />
    <!-- Olho preto brilhante -->
    <circle cx="17" cy="-11" r="1.6" fill="#18181b" />
    <circle cx="17.5" cy="-11.5" r="0.6" fill="#ffffff" />
  `;

  return G(0, -Math.abs(k) * 1, 0, o.s, o.s, body) + ell(0, 1, 18 * o.s, 3.5 * o.s, "rgba(0,0,0,.2)");
}


/** PÁSSARO CANTOR ALPINO (Monticola / Melro das rochas) */
function songbird(o: D & { flying: boolean }, col: string): string {
  if (o.flying) {
    const w = o.a * 16 + o.ph;
    const k = sin(w);
    const wing = (dir: number, c: string) => `
      <path
        d="M-2 -1 Q-8 ${f(dir * (-16 - k * 9))} 8 ${f(dir * (-14 - k * 9) - 1)} Q4 -6 -2 -1 Z"
        fill="${c}"
        stroke="#1e293b"
        stroke-width="0.8"
      />
    `;
    return (
      G(
        0,
        0,
        0,
        o.s,
        o.s,
        wing(1, "#dc2626") +
          `<path d="M-10 1 L-22 ${f(3 + k * 2)} L-10 5 Z" fill="#991b1b" />` +
          ell(0, 0, 10, 6, col) +
          ell(4, 2, 6, 3.5, "#fef3c7") +
          circ(10, -2, 4.5, col) +
          `<path d="M14 -2 L21 -1 L14 0 Z" fill="#f59e0b" />` +
          circ(11, -3, 1.2, "#18181b") +
          wing(-1, "#b91c1c")
      )
    );
  }

  const peck = Math.max(0, sin(o.a * 2.6 + o.ph)) ** 3;
  const hop = Math.max(0, sin(o.a * 5 + o.ph)) ** 6 * 3;

  const body = `
    ${line(-2, -8, -2, 0, 1.8, "#54280b")}
    ${line(4, -8, 4, 0, 1.8, "#54280b")}
    <path d="M-9 -12 L-22 -8 L-10 -8 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="0.8" />
    <ellipse cx="0" cy="-13" rx="11" ry="8" fill="${col}" stroke="#1e293b" stroke-width="1" />
    <ellipse cx="4" cy="-10" rx="7" ry="4.5" fill="#fef3c7" />
    <g transform="rotate(${f(peck * 40)} 7 -17)">
      <circle cx="10" cy="-20" r="5.8" fill="${col}" stroke="#1e293b" stroke-width="1" />
      <path d="M15 -20 L22 -19 L15 -18 Z" fill="#f59e0b" stroke="#b45309" stroke-width="0.8" />
      <circle cx="11.5" cy="-21.5" r="1.3" fill="#18181b" />
      <circle cx="12" cy="-22" r="0.5" fill="#ffffff" />
    </g>
  `;

  return G(0, -hop, 0, o.s, o.s, body) + ell(0, 1, 10 * o.s, 3 * o.s, "rgba(0,0,0,.2)");
}


/* ==================================================================
   NOVOS DESENHOS (capivara, macaco, tucano, arara, ouriço enrolado, ícones de humor)
   ================================================================== */

/** CAPIVARA (Hydrochoerus hydrochaeris): corpo de barril, focinho quadrado, anda devagar, adora chuva. */
function capybara(o: D): string {
  const w = o.m * 6 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const breath = sin(o.a * 2 + o.ph) * 0.7;
  const earTw = sin(o.a * 3 + o.ph) * 8;
  const legs = [
    [-15, k],
    [-8, -k],
    [12, -k],
    [19, k],
  ]
    .map(([lx, a], i) => limb(lx as number, -12, 13, (a as number) * 0.6, 6, i % 2 ? "#7a512c" : "#8f6035") + `<ellipse cx="${f((lx as number) + sin((a as number) * 0.6) * 13)}" cy="-0.5" rx="3.6" ry="2" fill="#4a2f17"/>`)
    .join("");
  const body = `
    ${legs}
    <ellipse cx="-2" cy="${f(-24 + breath)}" rx="27" ry="14" fill="#a8743f" stroke="#5b3a1e" stroke-width="1.6"/>
    <ellipse cx="0" cy="${f(-19 + breath)}" rx="20" ry="8" fill="#c89358" opacity="0.8"/>
    <path d="M-22 -30 Q0 -39 20 -31" stroke="#6b4423" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round"/>
    <ellipse cx="25" cy="${f(-27 + breath)}" rx="13" ry="11.5" fill="#b27a44" stroke="#5b3a1e" stroke-width="1.6"/>
    <rect x="31" y="${f(-30 + breath)}" width="11" height="13" rx="5" fill="#9a6838" stroke="#5b3a1e" stroke-width="1.4"/>
    <ellipse cx="39" cy="${f(-28 + breath)}" rx="1.7" ry="2.4" fill="#2b1a0d"/>
    <circle cx="27" cy="${f(-33 + breath)}" r="2" fill="#18181b"/><circle cx="27.7" cy="${f(-33.7 + breath)}" r="0.7" fill="#fff"/>
    <ellipse cx="17" cy="${f(-38 + breath)}" rx="3.3" ry="2.4" fill="#8f6035" stroke="#5b3a1e" stroke-width="1.1" transform="rotate(${f(earTw - 20)} 17 ${f(-38 + breath)})"/>
    <path d="M36 -23 q4 4 0 8" stroke="#5b3a1e" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  `;
  return G(0, 0, 0, o.s, o.s, body) + ell(0, 1, 30 * o.s, 4.5 * o.s, "rgba(0,0,0,.22)");
}

/** MACACO (sagui-prego): corpo pequeno, cauda longa enrolada, rosto claro; anda a 4 patas e "balança". */
function monkey(o: D & { mood?: Mood }): string {
  const w = o.m * 8 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const threat = o.mood === "threat" || o.mood === "lunge";
  const sway = sin(o.a * 3 + o.ph);
  const tail = `<path d="M-14 -22 C-34 -22 -38 -46 -22 -50 C-12 -52 -10 -42 -17 -40" stroke="#5a3b22" stroke-width="5" fill="none" stroke-linecap="round" transform="rotate(${f(sway * 6 + k * 6)} -14 -22)"/>
    <path d="M-14 -22 C-34 -22 -38 -46 -22 -50 C-12 -52 -10 -42 -17 -40" stroke="#7a5230" stroke-width="2" fill="none" stroke-linecap="round" transform="rotate(${f(sway * 6 + k * 6)} -14 -22)"/>`;
  const legs = [
    [-9, k],
    [-3, -k],
    [9, -k],
    [15, k],
  ]
    .map(([lx, a]) => limb(lx as number, -15, 16, (a as number) * 0.9, 4.4, "#6b4527") + circ((lx as number) + sin((a as number) * 0.9) * 16, -15 + cos((a as number) * 0.9) * 16, 2.3, "#3d2714"))
    .join("");
  const headTilt = threat ? 10 : sin(o.a * 1.7 + o.ph) * 3;
  const body = `
    ${tail}${legs}
    <ellipse cx="0" cy="-26" rx="16" ry="10" fill="#7a5230" stroke="#3d2714" stroke-width="1.3"/>
    <ellipse cx="2" cy="-23" rx="10" ry="6" fill="#b08a5e" opacity="0.8"/>
    <g transform="rotate(${f(headTilt)} 17 -34)">
      <circle cx="19" cy="-36" r="9.5" fill="#7a5230" stroke="#3d2714" stroke-width="1.3"/>
      <ellipse cx="22" cy="-34" rx="6.4" ry="5.6" fill="#e8c9a0" stroke="#3d2714" stroke-width="0.9"/>
      <circle cx="14" cy="-41" r="4" fill="#e8c9a0" stroke="#3d2714" stroke-width="0.9"/>
      <circle cx="24" cy="-41" r="3.6" fill="#e8c9a0" stroke="#3d2714" stroke-width="0.9"/>
      <circle cx="21" cy="-37" r="1.5" fill="#18181b"/><circle cx="26" cy="-36.5" r="1.4" fill="#18181b"/>
      ${threat ? `<path d="M19 -31 q4 3 8 0 M20 -30 l1 3 M23 -30 l1 3 M26 -30 l1 3" stroke="#fff" stroke-width="1.2" fill="#7f1d1d"/><path d="M18 -40 l5 2 M27 -40 l-4 2" stroke="#18181b" stroke-width="1.6"/>` : `<path d="M21 -31.5 q3 2 6 0" stroke="#3d2714" stroke-width="1.2" fill="none" stroke-linecap="round"/>`}
    </g>
  `;
  return G(0, -Math.abs(k) * 2, 0, o.s, o.s, body) + ell(0, 1, 22 * o.s, 4 * o.s, "rgba(0,0,0,.22)");
}

/** TUCANO: corpo preto, peito branco e bico enorme laranja-amarelo. */
function toucan(o: D & { flying: boolean }): string {
  const k = sin(o.a * 12 + o.ph);
  const bill = `<path d="M9 -3 C20 -9 34 -5 38 2 C30 6 18 5 9 3 Z" fill="#fb923c" stroke="#7c2d12" stroke-width="1"/>
    <path d="M9 -2 C20 -7 33 -4 37 1.5 C30 -1 18 -1 9 -1 Z" fill="#fde047"/>
    <path d="M30 -4 C34 -3 37 0 38 2 C35 4 31 4 29 2 Z" fill="#18181b"/>`;
  if (o.flying) {
    const wing = (dir: number, c: string) => `<path d="M-2 -1 Q-10 ${f(dir * (-18 - k * 10))} 9 ${f(dir * (-15 - k * 10) - 1)} Q4 -6 -2 -1 Z" fill="${c}" stroke="#0f0f14" stroke-width="0.9"/>`;
    return G(0, 0, 0, o.s, o.s, wing(1, "#1f2937") + `<path d="M-10 1 L-24 ${f(3 + k * 2)} L-10 5 Z" fill="#111827"/>` + ell(0, 0, 11, 6.5, "#111827") + ell(5, 2, 6, 4, "#ffffff") + circ(10, -2, 5, "#111827") + circ(11.5, -3.5, 2.2, "#38bdf8") + circ(12, -3.5, 1, "#0f172a") + bill + wing(-1, "#374151"));
  }
  return G(0, 0, 0, o.s, o.s, `<path d="M-8 -6 L-20 6 L-6 3 Z" fill="#111827"/>` + ell(0, -12, 9, 13, "#111827") + ell(4, -9, 5, 8, "#ffffff") + ell(0, -2, 3, 1.5, "#ef4444") + circ(6, -22, 6, "#111827") + circ(8, -23, 2.4, "#38bdf8") + circ(8.4, -23, 1, "#0f172a") + G(10, -20, 0, 1, 1, bill) + `<line x1="-2" y1="-1" x2="-2" y2="3" stroke="#475569" stroke-width="2"/><line x1="3" y1="-1" x2="3" y2="3" stroke="#475569" stroke-width="2"/>`);
}

/** ARARA-VERMELHA: corpo escarlate, asas azuis e amarelas, cauda longa. */
function macaw(o: D & { flying: boolean }): string {
  const k = sin(o.a * 11 + o.ph);
  const head = (x: number, y: number) =>
    circ(x, y, 6.2, "#dc2626") + `<path d="M${x + 3} ${y - 1} q7 -1 6 6 q-2 -2 -5 0 Z" fill="#f5f5f4" stroke="#44403c" stroke-width="0.9"/>` + circ(x + 2, y - 1.5, 2, "#fff") + circ(x + 2.5, y - 1.5, 1, "#0f0f14");
  if (o.flying) {
    const wing = (dir: number, c: string, c2: string) => `<path d="M-2 -1 Q-12 ${f(dir * (-18 - k * 10))} 10 ${f(dir * (-15 - k * 10) - 1)} Q4 -6 -2 -1 Z" fill="${c}" stroke="#450a0a" stroke-width="0.9"/><path d="M0 ${f(dir * (-6 - k * 4))} Q-4 ${f(dir * (-12 - k * 6))} 6 ${f(dir * (-11 - k * 6))}" stroke="${c2}" stroke-width="3" fill="none"/>`;
    return G(0, 0, 0, o.s, o.s, wing(1, "#2563eb", "#facc15") + `<path d="M-10 1 L-34 ${f(5 + k * 2)} L-10 6 Z" fill="#b91c1c" stroke="#450a0a" stroke-width="0.8"/><path d="M-12 3 L-30 ${f(5 + k * 2)}" stroke="#2563eb" stroke-width="2"/>` + ell(0, 0, 11, 6.5, "#dc2626") + head(10, -2) + wing(-1, "#3b82f6", "#fde047"));
  }
  return G(0, 0, 0, o.s, o.s, `<path d="M-6 -4 L-26 12 L-10 6 Z" fill="#b91c1c" stroke="#450a0a" stroke-width="0.8"/>` + ell(0, -12, 8.5, 13, "#dc2626") + `<path d="M-3 -16 Q-12 -8 -4 2 Q2 -6 -3 -16 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="0.8"/>` + `<path d="M-6 -10 q-3 4 0 8" stroke="#facc15" stroke-width="2.2" fill="none"/>` + head(5, -24) + `<line x1="-2" y1="-1" x2="-2" y2="3" stroke="#57534e" stroke-width="2"/><line x1="3" y1="-1" x2="3" y2="3" stroke="#57534e" stroke-width="2"/>`);
}

function regionalMammal(o: D, id: string): string {
  const palettes: Record<string, { coat: string; shade: string; light: string }> = {
    skunk: { coat: "#29251f", shade: "#171717", light: "#f5f0df" },
    boar: { coat: "#70452f", shade: "#493021", light: "#c89d71" },
    jaguar: { coat: "#d59a3d", shade: "#985b24", light: "#f6d58a" },
    anteater: { coat: "#594432", shade: "#35291f", light: "#c5a77d" },
    armadillo: { coat: "#90785d", shade: "#5c4a39", light: "#d7c3a2" },
    sloth: { coat: "#806743", shade: "#59452f", light: "#d0b886" },
    coati: { coat: "#a76c36", shade: "#704020", light: "#e5c28a" },
    "maned-wolf": { coat: "#c45b25", shade: "#34251d", light: "#edc79b" },
    agouti: { coat: "#9b5b32", shade: "#603820", light: "#d9b17c" },
  };
  const colors = palettes[id] ?? palettes.agouti;
  const w = o.m * 5 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const bob = sin(o.a * 2.2 + o.ph) * 0.6;
  const legLength = id === "maned-wolf" ? 27 : id === "anteater" ? 17 : 14;
  const legs = ([-18, -9, 12, 21] as const)
    .map((x, i) => limb(x, -8, legLength, k * (i % 2 ? -0.55 : 0.55), 4.5, i % 2 ? colors.shade : colors.coat))
    .join("");
  const tail = id === "skunk"
    ? `<path d="M-23 -24 C-45 -38 -39 -57 -23 -51 C-15 -47 -20 -37 -30 -40" fill="none" stroke="${colors.coat}" stroke-width="11" stroke-linecap="round"/><path d="M-37 -46 Q-29 -48 -23 -41" fill="none" stroke="${colors.light}" stroke-width="3"/>`
    : id === "coati"
      ? `<path d="M-24 -22 Q-50 -40 -38 -55 Q-28 -65 -25 -52 Q-23 -43 -37 -43" fill="none" stroke="${colors.coat}" stroke-width="7" stroke-linecap="round"/><path d="M-43 -51 l9 4 M-39 -44 l8 3" stroke="${colors.light}" stroke-width="3"/>`
      : id === "anteater"
        ? `<path d="M-22 -22 Q-52 -30 -54 -14 Q-45 -7 -28 -15" fill="${colors.shade}" stroke="#34291f" stroke-width="1"/>`
        : id === "maned-wolf"
          ? `<path d="M-22 -23 Q-39 -39 -35 -50" fill="none" stroke="${colors.shade}" stroke-width="5" stroke-linecap="round"/>`
          : "";
  const body = `
    ${tail}${legs}
    <ellipse cx="-2" cy="${-19 + bob}" rx="${id === "boar" ? 31 : id === "anteater" ? 32 : 25}" ry="${id === "sloth" ? 12 : 14}" fill="${colors.coat}" stroke="${colors.shade}" stroke-width="1.5"/>
    <ellipse cx="1" cy="${-14 + bob}" rx="15" ry="7" fill="${colors.light}" opacity=".72"/>
    ${id === "skunk" ? `<path d="M-19 -31 Q-7 -40 6 -29 L17 -18 Q5 -26 -4 -21 L-16 -23 Z" fill="${colors.light}" stroke="${colors.light}" stroke-width="1"/>` : ""}
    ${id === "jaguar" ? Array.from({ length: 8 }, (_, i) => `<circle cx="${-16 + (i % 4) * 10}" cy="${-27 + Math.floor(i / 4) * 11}" r="2" fill="${colors.shade}"/>`).join("") : ""}
    ${id === "armadillo" ? `<path d="M-19 -30 Q-3 -42 14 -29 L18 -16 Q0 -10 -19 -17 Z" fill="${colors.light}" stroke="${colors.shade}" stroke-width="1.2"/><path d="M-11 -33 L-10 -16 M-2 -37 L0 -14 M7 -35 L9 -15" stroke="${colors.shade}" stroke-width="1"/>` : ""}
    ${id === "anteater" ? `<path d="M-5 -29 Q-26 -45 -33 -35 L-25 -20 Q-14 -18 -3 -16" fill="${colors.shade}" opacity=".85"/>` : ""}
    ${id === "sloth" ? `<path d="M-9 -29 Q0 -37 11 -29 M-16 -13 q-7 9 -3 13 M12 -13 q7 9 3 13" fill="none" stroke="${colors.light}" stroke-width="2.5" stroke-linecap="round"/>` : ""}
    ${id === "boar" ? `<path d="M20 -25 Q34 -31 41 -23 L39 -14 Q29 -10 19 -16 Z" fill="${colors.light}" stroke="${colors.shade}" stroke-width="1.3"/><path d="M28 -16 Q30 -8 34 -15 M39 -17 Q42 -9 43 -17" fill="#f3e5c8" stroke="${colors.shade}" stroke-width="1"/>` : ""}
    ${id === "maned-wolf" ? `<path d="M-2 -30 Q11 -44 21 -34 L29 -18 L16 -15 L7 -24 Z" fill="${colors.shade}" opacity=".9"/>` : ""}
    <ellipse cx="20" cy="-29" rx="${id === "boar" ? 12 : 9}" ry="8" fill="${colors.coat}" stroke="${colors.shade}" stroke-width="1.4"/>
    ${id === "coati" || id === "anteater" ? `<path d="M24 -26 Q39 -22 45 -19 Q36 -15 24 -19 Z" fill="${colors.light}" stroke="${colors.shade}" stroke-width="1"/>` : ""}
    ${id === "skunk" ? `<ellipse cx="15" cy="-37" rx="3" ry="5" fill="${colors.shade}"/>` : ""}
    <ellipse cx="25" cy="-26" rx="5" ry="3.5" fill="${colors.light}"/>
    <circle cx="23" cy="-31" r="1.6" fill="#171717"/><circle cx="23.5" cy="-31.5" r=".55" fill="#fff"/>
    <path d="M29 -23 q3 2 5 0" fill="none" stroke="${colors.shade}" stroke-width="1.2" stroke-linecap="round"/>
    ${id === "coati" ? `<path d="M15 -35 L12 -42 L20 -37 M23 -36 L27 -42 L28 -34" fill="${colors.coat}" stroke="${colors.shade}" stroke-width="1"/>` : ""}
    ${id === "jaguar" ? `<path d="M14 -35 L17 -39 L20 -35 M26 -35 L29 -39 L32 -34" fill="${colors.coat}" stroke="${colors.shade}" stroke-width="1"/>` : ""}
  `;
  return G(0, -Math.abs(k) * 2.5, 0, o.s, o.s, body) + ell(0, 1, 31 * o.s, 5 * o.s, "rgba(0,0,0,.2)");
}

function sloth(o: D): string {
  const sway = sin(o.a * 1.2 + o.ph) * 3;
  const body = `
    <path d="M-46 -43 Q-5 -49 42 -42" fill="none" stroke="#4d3928" stroke-width="8" stroke-linecap="round"/>
    <path d="M-46 -43 Q-5 -49 42 -42" fill="none" stroke="#8b6842" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="0" cy="-23" rx="13" ry="19" fill="#806746" stroke="#4d3928" stroke-width="1.5"/>
    <ellipse cx="5" cy="-8" rx="11" ry="11" fill="#9a7a50" stroke="#4d3928" stroke-width="1.4"/>
    <ellipse cx="7" cy="-9" rx="7" ry="7" fill="#e1cfaa"/>
    <circle cx="4" cy="-11" r="1.3" fill="#211a14"/><circle cx="10" cy="-11" r="1.3" fill="#211a14"/>
    <path d="M4 -5 Q7 -3 10 -5" fill="none" stroke="#4d3928" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M-8 -36 Q-15 -41 -23 -40 M8 -36 Q15 -42 23 -39" fill="none" stroke="#806746" stroke-width="6" stroke-linecap="round"/>
    <path d="M-23 -40 l-3 -5 M-20 -40 l-2 -5 M23 -39 l3 -5 M20 -39 l2 -5" stroke="#e5d1a9" stroke-width="1.5" stroke-linecap="round"/>
  `;
  return G(sway, 0, 0, o.s, o.s, body);
}

function regionalBird(o: D & { flying: boolean }, id: "woodpecker" | "owl"): string {
  const flap = sin(o.a * 12 + o.ph);
  if (o.flying) {
    const wings = `<path d="M-2 0 Q-18 ${f(-12 - flap * 10)} -33 ${f(-3 - flap * 5)} Q-20 8 -2 5 Z" fill="${id === "owl" ? "#785438" : "#b83220"}" stroke="#35271f" stroke-width="1"/><path d="M2 0 Q18 ${f(-12 + flap * 10)} 33 ${f(-3 + flap * 5)} Q20 8 2 5 Z" fill="${id === "owl" ? "#9b714c" : "#c9472f"}" stroke="#35271f" stroke-width="1"/>`;
    const head = id === "owl"
      ? `<circle cx="10" cy="-6" r="7" fill="#e7d5ad"/><circle cx="10" cy="-6" r="3" fill="#f4c34c"/><circle cx="10" cy="-6" r="1.3" fill="#201914"/><path d="M15 -6 l6 2 -6 2" fill="#db9a37"/>`
      : `<circle cx="9" cy="-6" r="5" fill="#c52d20"/><path d="M13 -6 L23 -4 L13 -2 Z" fill="#e4b54a"/><circle cx="10" cy="-7" r="1.2" fill="#211915"/>`;
    return G(0, 0, 0, o.s, o.s, wings + `<ellipse cx="0" cy="1" rx="12" ry="7" fill="${id === "owl" ? "#765339" : "#273944"}"/>` + head);
  }
  if (id === "owl") {
    const body = `<path d="M-12 -23 L-17 -38 L-5 -31 M8 -31 L18 -38 L14 -22" fill="#765238" stroke="#3d2c20" stroke-width="1.5"/><ellipse cx="0" cy="-18" rx="18" ry="23" fill="#8f6748" stroke="#4b3525" stroke-width="1.5"/><ellipse cx="0" cy="-13" rx="11" ry="15" fill="#ead9b5"/>${[-8, 8].map((x) => `<circle cx="${x}" cy="-25" r="8" fill="#f1e4c5"/><circle cx="${x}" cy="-25" r="3.6" fill="#e3a93f"/><circle cx="${x}" cy="-25" r="1.5" fill="#171717"/>`).join("")}<path d="M-2 -19 L2 -19 L0 -14 Z" fill="#d58a32"/><path d="M-6 -7 l3 -4 3 4 3 -4 3 4" fill="none" stroke="#a27a4d" stroke-width="1.6"/><path d="M-3 4 l-2 4 M4 4 l2 4" stroke="#d58a32" stroke-width="2"/>`;
    return G(0, 0, 0, o.s, o.s, body) + ell(0, 1, 13 * o.s, 3 * o.s, "rgba(0,0,0,.2)");
  }
  const body = `<path d="M-8 -10 L-22 -4 L-8 -5 Z" fill="#26353b"/><ellipse cx="0" cy="-13" rx="12" ry="9" fill="#26353b" stroke="#182329" stroke-width="1"/><path d="M-2 -20 Q3 -32 10 -24 L11 -17" fill="#d64030" stroke="#8f241d" stroke-width="1"/><circle cx="9" cy="-21" r="6.5" fill="#d83b2c"/><ellipse cx="6" cy="-18" rx="4" ry="3" fill="#fff3dc"/><path d="M15 -21 L25 -19 L15 -18 Z" fill="#d6b04b"/><circle cx="10" cy="-22" r="1.4" fill="#171717"/><path d="M-4 -16 l-4 3 M1 -15 l-4 3 M7 -14 l-4 3" stroke="#f0e2c5" stroke-width="1.5"/><path d="M-2 -4 l-2 5 M5 -4 l2 5" stroke="#806044" stroke-width="1.6"/>`;
  return G(0, -Math.max(0, flap) * 1.5, 0, o.s, o.s, body) + ell(0, 1, 11 * o.s, 3 * o.s, "rgba(0,0,0,.2)");
}

function swimmer(o: D, id: string): string {
  const ripple = sin(o.a * 2 + o.ph) * 1.4;
  let body: string;
  if (id === "caiman") {
    body = `<path d="M-39 -11 Q-52 -17 -61 -10 Q-51 -6 -40 -6" fill="#607b39" stroke="#34462a" stroke-width="1.5"/><ellipse cx="-7" cy="-11" rx="31" ry="10" fill="#718b42" stroke="#34462a" stroke-width="1.5"/><path d="M-22 -18 Q-9 -25 6 -17 L15 -10 L3 -5 L-18 -7 Z" fill="#83974f" stroke="#34462a" stroke-width="1"/>${[-23,-13,-3,7].map((x)=>`<path d="M${x} -19 l4 -5 4 5" fill="#9eaa5e" stroke="#43522f" stroke-width="1"/>`).join("")}<path d="M14 -16 Q29 -24 42 -16 L56 -12 L42 -7 L19 -8 Z" fill="#718b42" stroke="#34462a" stroke-width="1.5"/><path d="M36 -12 l5 2 M43 -12 l5 2" stroke="#f4e3b1" stroke-width="1.8"/><circle cx="36" cy="-17" r="2.5" fill="#e1bd54"/><circle cx="37" cy="-17" r="1.2" fill="#171717"/>`;
  } else if (id === "otter") {
    body = `<path d="M-33 -8 Q-48 -4 -57 1 Q-43 4 -29 -2" fill="#805435" stroke="#4b3425" stroke-width="1.5"/><ellipse cx="-4" cy="-11" rx="30" ry="11" fill="#926442" stroke="#4b3425" stroke-width="1.5"/><ellipse cx="1" cy="-7" rx="19" ry="5" fill="#d7bb8d"/><circle cx="27" cy="-17" r="9" fill="#926442" stroke="#4b3425" stroke-width="1.5"/><ellipse cx="33" cy="-14" rx="5" ry="4" fill="#d7bb8d"/><circle cx="28" cy="-19" r="1.5" fill="#171717"/><circle cx="35" cy="-14" r="1.5" fill="#2b2119"/><path d="M-12 -4 q8 6 14 0 M10 -4 q7 6 12 0" stroke="#805435" stroke-width="3" stroke-linecap="round"/>`;
  } else if (id === "pacu") {
    body = `<path d="M-18 -12 L-34 -21 L-32 -2 Z" fill="#c18a37" stroke="#64441f" stroke-width="1.2"/><ellipse cx="1" cy="-12" rx="22" ry="13" fill="#c99445" stroke="#64441f" stroke-width="1.4"/><path d="M-2 -23 L8 -31 L13 -21 M-4 -1 L8 6 L14 -4" fill="#d7aa5c" stroke="#64441f" stroke-width="1"/><path d="M-5 -22 Q1 -12 -5 -2 M3 -24 Q9 -12 3 0 M11 -22 Q17 -12 11 -2" fill="none" stroke="#8b602c" stroke-width="1.2"/><circle cx="15" cy="-16" r="2" fill="#171717"/><path d="M20 -10 q4 2 0 4" fill="none" stroke="#64441f" stroke-width="1.2"/>`;
  } else {
    body = `<ellipse cx="0" cy="-10" rx="14" ry="10" fill="#78a94a" stroke="#3f622f" stroke-width="1.4"/><circle cx="-8" cy="-18" r="6" fill="#88b94f" stroke="#3f622f" stroke-width="1.2"/><circle cx="8" cy="-18" r="6" fill="#88b94f" stroke="#3f622f" stroke-width="1.2"/><circle cx="-8" cy="-19" r="2" fill="#f3d54e"/><circle cx="8" cy="-19" r="2" fill="#f3d54e"/><circle cx="-8" cy="-19" r="1" fill="#171717"/><circle cx="8" cy="-19" r="1" fill="#171717"/><path d="M-10 -3 Q-19 2 -25 -1 M10 -3 Q19 2 25 -1 M-3 -2 L-9 3 M3 -2 L9 3" fill="none" stroke="#4f7736" stroke-width="3" stroke-linecap="round"/><path d="M-4 -8 q4 3 8 0" fill="none" stroke="#36532b" stroke-width="1"/>`;
  }
  return G(0, -Math.abs(ripple) * 0.35, 0, o.s, o.s, body) + ell(0, 1, 31 * o.s, 4 * o.s, "rgba(0,0,0,.18)");
}

function foliageVeil(x: number, y: number, scale: number, time: number, phase: number): string {
  const sway = sin(time * 1.3 + phase) * 2;
  return G(x + 8 * scale, y - 5 * scale, sway, scale, scale, `
    <path d="M-22 5 Q-19 -12 -7 -13 Q-5 -1 -22 5 M-7 4 Q-4 -13 9 -16 Q12 -3 -7 4 M7 5 Q13 -10 26 -9 Q24 3 7 5" fill="#35552b" stroke="#294321" stroke-width="1.1" opacity=".8"/>
    <path d="M-19 3 L-8 -9 M-4 3 L8 -12 M10 3 L23 -6" stroke="#78934c" stroke-width=".8" opacity=".65"/>
  `);
}

/** OURIÇO ENROLADO (reação defensiva). */
function hedgehogBall(o: D): string {
  let spikes = "";
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * PI * 2;
    const r0 = 11;
    const r1 = 17 + (i % 3);
    spikes += `<line x1="${f(cos(a) * r0)}" y1="${f(-13 + sin(a) * r0)}" x2="${f(cos(a) * r1)}" y2="${f(-13 + sin(a) * r1)}" stroke="${i % 2 ? "#3f2a1a" : "#7c5a3a"}" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  const tremble = sin(o.a * 30) * 0.6;
  return G(tremble, 0, 0, o.s, o.s, `${spikes}<circle cx="0" cy="-13" r="12" fill="#5b3f27" stroke="#2b1a0d" stroke-width="1.2"/><circle cx="0" cy="-13" r="6" fill="#8a6a45" opacity="0.7"/><circle cx="-3" cy="-15" r="1.2" fill="#18181b"/>`) + ell(0, 1, 18 * o.s, 3.5 * o.s, "rgba(0,0,0,.22)");
}

/** Ícone de humor sobre a cabeça (coração, alerta, raiva). Origem = ponto acima da cabeça. */
function moodIcon(mood: Mood, t: number, S: number): string {
  const bob = sin(t * 6) * 1.5;
  if (mood === "happy" || mood === "curious")
    return G(0, bob, 0, S, S, `<path d="M0 6 C-12 -3 -7 -12 0 -6 C7 -12 12 -3 0 6 Z" fill="#ef4444" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>`);
  if (mood === "alert" || mood === "flee")
    return G(0, bob, 0, S, S, `<rect x="-3" y="-14" width="6" height="11" rx="3" fill="#f59e0b" stroke="#fff" stroke-width="1.8"/><circle cx="0" cy="2" r="3.1" fill="#f59e0b" stroke="#fff" stroke-width="1.8"/>`);
  if (mood === "threat" || mood === "lunge" || mood === "stalk" || mood === "dive")
    return G(0, bob, 0, S, S, `<g stroke="#dc2626" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-9 -4 q5 -2 5 -9"/><path d="M9 -4 q-5 -2 -5 -9"/><path d="M-9 4 q5 2 5 9"/><path d="M9 4 q-5 2 -5 9"/></g>`);
  return "";
}

/* ==================================================================
   MUNDO E COMPORTAMENTO DA FAUNA
   ================================================================== */

export interface WildStudent {
  /** posição do aluno em frações do mundo (0..1) */
  x: number;
  y: number;
}

export interface Wildlife {
  critters: Critter[];
  step: (dt: number, W: number, H: number, student?: WildStudent | null) => void;
  render: (W: number, H: number) => string;
  hit: (px: number, py: number, W: number, H: number) => Critter | null;
  poke: (c: Critter) => void;
  find: (animalId: string) => Critter | undefined;
  position: (c: Critter, W: number, H: number) => { x: number; y: number };
  setWeather: (weather: TrailWeather) => void;
  /** Posição (0..1) do aluno no cenário: a vida selvagem acontece em volta dele, na mata. */
  setFocus: (x: number, y: number) => void;
}

interface HabitatSpot {
  x: number;
  y: number;
  habitat: Habitat;
  crossing?: boolean;
}

/** Clareiras mais fundas na vegetação; alguns destinos raros cruzam a trilha. */
const FOREST_SPOTS: HabitatSpot[] = (() => {
  const out: HabitatSpot[] = [];
  for (let i = 0; i <= 32; i++) {
    const fr = 0.02 + (i / 32) * 0.95;
    const a = getTrailPositionAtFraction(Math.max(0, fr - 0.004));
    const b = getTrailPositionAtFraction(Math.min(1, fr + 0.004));
    const p = getTrailPositionAtFraction(fr);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    for (const side of [-1, 1]) {
      const off = 165 + ((i + (side > 0 ? 1 : 0)) % 4) * 42;
      const x = clamp((p.x + nx * off * side) / 1000, 0.07, 0.93);
      const y = clamp((p.y + ny * off * side) / WORLD_H, 0.02, 0.985);
      out.push({ x, y, habitat: "forest" });
    }
  }
  return out;
})();

const TRAIL_CROSSINGS: HabitatSpot[] = Array.from({ length: 9 }, (_, i) => {
  const p = getTrailPositionAtFraction(0.06 + i * 0.11);
  return { x: p.x / 1000, y: p.y / WORLD_H, habitat: "forest", crossing: true };
});

/** Poças e trechos de riacho pintados na própria ilustração da mata. */
const WATER_SPOTS: HabitatSpot[] = [
  { x: 0.47, y: 0.27, habitat: "water" },
  { x: 0.49, y: 0.275, habitat: "water" },
  { x: 0.51, y: 0.28, habitat: "water" },
  { x: 0.79, y: 0.71, habitat: "water" },
  { x: 0.81, y: 0.715, habitat: "water" },
  { x: 0.83, y: 0.72, habitat: "water" },
  { x: 0.31, y: 0.955, habitat: "water" },
  { x: 0.33, y: 0.96, habitat: "water" },
  { x: 0.35, y: 0.965, habitat: "water" },
];
const TREE_PERCH_SPOTS = [
  { x: 0.14, y: 0.12 }, { x: 0.82, y: 0.2 }, { x: 0.2, y: 0.34 },
  { x: 0.76, y: 0.43 }, { x: 0.17, y: 0.59 }, { x: 0.84, y: 0.69 },
  { x: 0.14, y: 0.82 }, { x: 0.76, y: 0.9 },
];
const CANOPY_SPOTS: HabitatSpot[] = TREE_PERCH_SPOTS.map((spot) => ({ ...spot, habitat: "canopy" }));
const HABITAT_SPOTS = [...FOREST_SPOTS, ...TRAIL_CROSSINGS, ...CANOPY_SPOTS, ...WATER_SPOTS];

const NEAR = 0.13; // janela vertical (fração do mundo) em volta do aluno onde os bichos vivem
const FAR = 0.24; // além disso o bicho é reciclado

export function createWildlife(initialWeather: TrailWeather = "sunny", seed?: number): Wildlife {
  const rnd = seed === undefined ? Math.random : mulberry32(seed);
  const critters: Critter[] = [];
  const pending: { delay: number; kind?: Kind; id?: string }[] = [];
  let weather = initialWeather;
  let uid = 0;
  let swapTimer = 10;
  let populated = false;
  let stu: WildStudent = { x: 0.5, y: 0.95 };

  const mk = (animal: TrailAnimal): Critter => ({
    uid: uid++,
    animal,
    spec: weatherAdjustedSpec(animal.id, weather),
    x: 0.5,
    y: 0.7,
    z: 0,
    heading: 0,
    face: rnd() > 0.5 ? 1 : -1,
    v: 0,
    vz: 0,
    state: "idle",
    mood: "calm",
    moodT: 0,
    cool: rnd() * 4,
    hp: rnd() * 6,
    dive: 0,
    hasTarget: false,
    tx: 0,
    ty: 0,
    timer: 1,
    clk: rnd() * 10,
    cm: rnd() * 10,
    ph: rnd() * 6.28,
    spot: -1,
    landed: false,
    react: 0,
    age: 0,
    orbit: rnd() * 6.28,
  });

  const spotFree = (i: number) => !critters.some((c) => c.spot === i);
  const pickTreePerch = () => {
    const nearby = TREE_PERCH_SPOTS.filter((spot) => Math.abs(spot.y - stu.y) <= NEAR * 1.6);
    const pool = nearby.length ? nearby : TREE_PERCH_SPOTS;
    return pool[Math.floor(rnd() * pool.length)];
  };
  const pickSpot = (minDy: number, maxDy: number, habitat: Habitat, crossingChance = 0): number => {
    const crossing = habitat === "forest" && rnd() < crossingChance;
    const ok: number[] = [];
    HABITAT_SPOTS.forEach((s, i) => {
      if (s.habitat !== habitat || (s.crossing ?? false) !== crossing) return;
      const dy = Math.abs(s.y - stu.y);
      if (dy >= minDy && dy <= maxDy && spotFree(i)) ok.push(i);
    });
    return ok.length ? ok[Math.floor(rnd() * ok.length)] : -1;
  };
  const randRegion = () => ({
    x: 0.1 + rnd() * 0.8,
    y: clamp(stu.y - 0.15 + rnd() * 0.2, 0.03, 0.98),
  });
  const weatherPool = () => ROAMING_ANIMAL_POOL;

  function spawn(kind?: Kind, initial = false, preferredId?: string) {
    const visible = new Set(critters.map((c) => c.animal.id));
    const pool = weatherPool();
    let cand = pool.filter((a) => !visible.has(a.id) && (!kind || specOf(a.id).kind === kind) && (!preferredId || a.id === preferredId));
    if (cand.length === 0 && !preferredId) cand = pool.filter((a) => !visible.has(a.id));
    if (cand.length === 0) return;
    const c = mk(cand[Math.floor(rnd() * cand.length)]);
    if (c.spec.kind !== "fly") {
      const sp = pickSpot(initial ? 0 : 0.09, initial ? NEAR : 0.16, c.spec.habitat);
      if (sp < 0) return;
      c.spot = sp;
      c.x = HABITAT_SPOTS[sp].x;
      c.y = HABITAT_SPOTS[sp].y;
      c.state = "idle";
      c.timer = initial ? rnd() * 3 : 0.2;
    } else {
      const R = randRegion();
      if (initial) {
        const perch = pickTreePerch();
        c.x = perch.x;
        c.y = perch.y;
        c.z = 0;
        c.landed = true;
        c.timer = 2 + rnd() * 4;
      } else {
        const left = rnd() > 0.5;
        c.x = left ? -0.08 : 1.08;
        c.y = R.y;
        c.z = 40;
        c.state = "move";
        c.hasTarget = true;
        c.tx = R.x;
        c.ty = R.y;
        c.heading = left ? 0 : PI;
      }
    }
    critters.push(c);
  }

  function populate() {
    for (const id of WEATHER_HIGHLIGHTS[weather]) spawn(undefined, true, id);
    while (critters.length < WEATHER_TARGET[weather]) {
      const before = critters.length;
      spawn(undefined, true);
      if (critters.length === before) break;
    }
  }

  function setWeather(next: TrailWeather) {
    if (weather === next) return;
    weather = next;
    pending.length = 0;
    for (let i = critters.length - 1; i >= 0; i--) {
      critters[i].spec = weatherAdjustedSpec(critters[i].animal.id, weather);
    }
    if (populated) populate();
  }

  function setFocus(x: number, y: number) {
    stu = { x, y };
  }

  /* ---------- ações de movimento ---------- */
  const clampT = (c: Critter) => {
    c.tx = clamp(c.tx, 0.04, 0.96);
    c.ty = clamp(c.ty, Math.max(0.02, stu.y - 0.2), Math.min(0.99, stu.y + 0.2));
  };
  function stop(c: Critter, t = 0.6) {
    c.state = "idle";
    c.hasTarget = false;
    c.v = 0;
    c.timer = t;
  }
  function goToward(c: Critter, tx: number, ty: number) {
    c.tx = tx;
    c.ty = ty;
    clampT(c);
    c.state = "move";
    c.hasTarget = true;
    c.spot = -1;
  }
  function goAway(c: Critter, sx: number, sy: number, W: number, H: number, dist: number) {
    const ax = c.x * W - sx;
    const ay = c.y * H - sy;
    const len = Math.hypot(ax, ay) || 1;
    goToward(c, c.x + (ax / len) * dist, c.y + ((ay / len) * dist * W) / H);
  }
  function startFlee(c: Critter, sx: number, sy: number, W: number, H: number, dist: number, dur: number) {
    c.mood = "flee";
    c.moodT = dur;
    goAway(c, sx, sy, W, H, dist);
  }

  /** Reação do bicho ao aluno, de acordo com o temperamento. */
  function react(c: Critter, ds: number, sx: number, sy: number, W: number, H: number, S: number) {
    const sp = c.spec;
    const R = sp.sense * S;

    // expirações gerais de humor
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
        if (c.mood !== "flee" && c.mood !== "alert" && ds < R) startFlee(c, sx, sy, W, H, 0.3, 1.5 + rnd() * 0.8);
        break;
      case "wary":
        if (c.mood === "calm" && ds < R) {
          c.mood = "alert";
          c.moodT = 1.0;
          stop(c, 1.0);
        } else if (c.mood === "alert" && c.moodT <= 0.02 && ds < R * 0.85) {
          startFlee(c, sx, sy, W, H, 0.26, 1.7);
        }
        break;
      case "friendly":
        if (c.mood === "calm" && c.cool <= 0 && ds < R * 2.6 && ds > R * 0.75) {
          const ax = c.x * W - sx;
          const ay = c.y * H - sy;
          const len = Math.hypot(ax, ay) || 1;
          c.mood = "curious";
          c.moodT = 5;
          goToward(c, (sx + (ax / len) * R * 0.7) / W, (sy + (ay / len) * R * 0.7) / H);
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
        if (ds < R * 0.3 && c.mood !== "flee") startFlee(c, sx, sy, W, H, 0.12, 0.9);
        break;
      case "defensive":
        if (ds < R) {
          c.mood = "curl";
          c.moodT = 2.2;
          stop(c, 2.2);
        } else if (c.mood === "curl" && c.moodT <= 0) c.mood = "calm";
        break;
      case "aggressive":
        if (c.mood === "calm" && c.cool <= 0 && ds < R) {
          c.mood = "stalk";
          c.moodT = 7;
        }
        if (c.mood === "stalk") {
          goToward(c, sx / W, sy / H);
          if (ds < R * 0.42) {
            c.mood = "threat";
            c.moodT = 1.4;
            stop(c, 1.4);
          } else if (c.moodT <= 0 || ds > R * 1.4) {
            c.mood = "calm";
            c.cool = 7;
          }
        } else if (c.mood === "threat") {
          stop(c, 0.3);
          if (c.moodT <= 0) {
            c.mood = "lunge";
            c.moodT = 0.55;
          }
        } else if (c.mood === "lunge") {
          goToward(c, sx / W, sy / H);
          if (c.moodT <= 0 || ds < R * 0.2) {
            c.mood = "retreat";
            c.moodT = 3.5;
            c.cool = 14;
            goAway(c, sx, sy, W, H, 0.2);
          }
        }
        break;
      default:
        break;
    }
  }

  const MOOD_SPEED: Partial<Record<Mood, number>> = { stalk: 0.6, lunge: 3.4, retreat: 1.5, curious: 1.15 };

  function updateWalker(c: Critter, dt: number, W: number, H: number) {
    c.clk += dt;
    const S = W / 1000;
    const sp = c.spec;
    c.moodT = Math.max(0, c.moodT - dt);
    c.cool = Math.max(0, c.cool - dt);
    const sx = stu.x * W;
    const sy = stu.y * H;
    const ds = Math.hypot(sx - c.x * W, sy - c.y * H);
    if (c.state !== "leaving") react(c, ds, sx, sy, W, H, S);

    if (c.state === "idle") {
      c.v = approach(c.v, 0, 220 * dt);
      if (c.mood === "alert" || c.mood === "threat" || c.mood === "curl" || c.mood === "happy" || c.mood === "curious") {
        c.face = approach(c.face, sx >= c.x * W ? 1 : -1, 6 * dt);
      }
      c.timer -= dt;
      if (c.timer <= 0 && c.mood !== "curl" && c.mood !== "threat" && c.mood !== "happy") {
        const sp2 = pickSpot(0, NEAR, c.spec.habitat, c.spec.habitat === "forest" ? 0.1 : 0);
        if (sp2 >= 0) {
          c.spot = sp2;
          goToward(c, HABITAT_SPOTS[sp2].x, HABITAT_SPOTS[sp2].y);
        } else c.timer = 1.5 + rnd() * 2;
      }
      return;
    }

    const dx = c.tx * W - c.x * W;
    const dy = c.ty * H - c.y * H;
    const dist = Math.hypot(dx, dy);
    if (dist < 12 * S + 2) {
      if (c.state === "leaving") return;
      if (c.mood === "stalk") {
        c.mood = "threat";
        c.moodT = 1.4;
        stop(c, 1.4);
        return;
      }
      stop(c, sp.idle[0] + rnd() * sp.idle[1]);
      return;
    }

    const mult = c.mood === "flee" ? sp.flee : MOOD_SPEED[c.mood] ?? 1;
    const fast = mult > 1.4;
    const targetHeading = Math.atan2(dy, dx);
    c.heading += wrap(targetHeading - c.heading) * Math.min(1, sp.turn * (fast ? 1.6 : 1) * dt);
    // zigue-zague de quem foge (coelho/esquilo)
    if (c.mood === "flee" && sp.hop) c.heading += sin(c.clk * 9 + c.ph) * 0.05;

    const distFactor = fast ? 1 : Math.min(1, dist / (40 * S));
    const baseSpeed = sp.speed * S * mult * (0.35 + 0.65 * distFactor);
    let speed = baseSpeed;
    if (sp.hop) {
      c.hp += dt * sp.gait * 0.9 * (fast ? 1.3 : 1);
      const cyc = Math.max(0, sin(c.hp + c.ph));
      speed = baseSpeed * (0.1 + 1.7 * cyc * cyc);
      c.cm = c.hp / sp.K;
    }
    c.v = approach(c.v, speed, 260 * dt);
    if (!sp.hop) {
      // cadência da passada acompanha a distância percorrida (sem "patinar")
      c.cm += sp.stride > 0 ? (((c.v * dt) / S / sp.stride) * 2 * PI) / sp.K : c.v * dt * 0.05;
    }
    c.x += (cos(c.heading) * c.v * dt) / W;
    c.y += (sin(c.heading) * c.v * dt) / H;
    c.face = approach(c.face, cos(c.heading) >= 0 ? 1 : -1, 4.5 * dt);
  }

  function updateFlyer(c: Critter, dt: number, W: number, H: number) {
    c.clk += dt;
    const S = W / 1000;
    const sp = c.spec;
    c.moodT = Math.max(0, c.moodT - dt);
    c.cool = Math.max(0, c.cool - dt);
    const sx = stu.x * W;
    const sy = stu.y * H;

    let X = c.x * W;
    let Y = c.y * H;
    let cx = 0;
    const ds = Math.hypot(sx - X, sy - Y);

    // amigáveis: vêm ver o aluno e pousam por perto
    if (c.state !== "leaving" && sp.temper === "friendly") {
      if (c.mood === "calm" && c.cool <= 0 && ds < sp.sense * S * 2.4 && ds > sp.sense * S * 0.5) {
        const side = rnd() > 0.5 ? 1 : -1;
        c.tx = clamp((sx + side * 70 * S) / W, 0.05, 0.95);
        c.ty = clamp((sy + 6 * S) / H, 0.02, 0.99);
        c.mood = "curious";
        c.moodT = 9;
        c.landed = false;
        c.timer = 9;
      }
      if (c.mood === "curious") {
        const dd = Math.hypot(c.tx * W - X, c.ty * H - Y);
        if (dd < 16 * S) {
          c.mood = "happy";
          c.moodT = 4.2;
          c.landed = true;
        } else if (c.moodT <= 0) {
          c.mood = "calm";
          c.cool = 10;
        }
      }
      if (c.mood === "happy" && c.moodT <= 0) {
        c.mood = "calm";
        c.cool = 14;
        c.landed = false;
        c.timer = 0;
      }
    }

    if (c.state === "leaving") {
      c.landed = false;
      const dx = c.tx * W - X;
      const dy = c.ty * H - Y;
      c.heading += wrap(Math.atan2(dy, dx) - c.heading) * Math.min(1, 2.5 * dt);
      X += cos(c.heading) * sp.speed * S * dt;
      Y += sin(c.heading) * sp.speed * S * dt;
      c.z = approach(c.z, 75, 22 * dt);
      cx = cos(c.heading);
    } else if (c.landed) {
      c.v = 0;
      c.z = approach(c.z, 0, 90 * dt);
      c.face = approach(c.face, sx >= X ? 1 : -1, 5 * dt);
      c.timer -= dt;
      if (c.timer <= 0) {
        c.landed = false;
        const perch = pickTreePerch();
        c.tx = perch.x;
        c.ty = perch.y;
        c.timer = 7 + rnd() * 5;
      }
    } else {
      c.timer -= dt;
      if (c.timer <= 0 && c.mood !== "curious") {
        if (rnd() < 0.65) {
          const perch = pickTreePerch();
          c.tx = perch.x;
          c.ty = perch.y;
          c.timer = 7 + rnd() * 5;
        } else {
          const R = randRegion();
          c.tx = R.x;
          c.ty = R.y;
          c.timer = 4 + rnd() * 3;
        }
      }
      const dx = c.tx * W - X;
      const dy = c.ty * H - Y;
      c.heading += wrap(Math.atan2(dy, dx) - c.heading) * Math.min(1, sp.turn * dt);
      const wander = sin(c.clk * 1.8 + c.ph) * 0.28;
      const spd = sp.speed * S * (c.mood === "curious" ? 1.25 : 1);
      cx = cos(c.heading + wander) * spd;
      X += cx * dt;
      Y += sin(c.heading + wander) * spd * dt;
      c.z = approach(c.z, c.mood === "curious" ? 14 : 28 + sin(c.clk * 1.6 + c.ph) * 10, 35 * dt);
      if (c.mood !== "curious" && Math.hypot(c.tx * W - X, c.ty * H - Y) < 14 * S) {
        c.landed = true;
        c.timer = 2.5 + rnd() * 4;
      }
    }
    if (!c.landed && Math.abs(cx) > 0.1) c.face = approach(c.face, Math.sign(cx), 6 * dt);
    c.x = X / W;
    c.y = Y / H;
  }

  function step(dt: number, W: number, H: number, student?: WildStudent | null) {
    if (!(W > 0 && H > 0)) return;
    dt = Math.min(dt, 0.05);
    if (student) stu = student;
    if (!populated) {
      populated = true;
      populate();
    }
    for (const c of critters) {
      c.age += dt;
      if (c.react > 0) c.react = Math.max(0, c.react - dt);
      if (c.spec.kind === "fly") updateFlyer(c, dt, W, H);
      else updateWalker(c, dt, W, H);
    }
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      const gone = c.state === "leaving" && (c.x < -0.12 || c.x > 1.12);
      const far = Math.abs(c.y - stu.y) > FAR;
      if (gone || far) {
        critters.splice(i, 1);
        if (far) pending.push({ delay: 0.4 + rnd() });
      }
    }
    swapTimer -= dt;
    if (swapTimer <= 0) {
      swapTimer = 9 + rnd() * 6;
      const ok = critters.filter((c) => c.state !== "leaving" && c.age > 8 && c.mood === "calm");
      if (ok.length >= WEATHER_TARGET[weather] - 1) {
        const v = ok[Math.floor(rnd() * ok.length)];
        v.state = "leaving";
        v.spot = -1;
        v.hasTarget = true;
        v.landed = false;
        v.tx = v.x < 0.5 ? -0.15 : 1.15;
        v.ty = v.y + (v.spec.kind === "walk" ? 0 : (rnd() - 0.5) * 0.1);
        pending.push({ delay: 1.5 + rnd() * 2, kind: rnd() < 0.6 ? v.spec.kind : undefined });
      }
    }
    for (let i = pending.length - 1; i >= 0; i--) {
      pending[i].delay -= dt;
      if (pending[i].delay <= 0) {
        spawn(pending[i].kind, false, pending[i].id);
        pending.splice(i, 1);
      }
    }
    if (critters.filter((c) => c.state !== "leaving").length + pending.length < WEATHER_TARGET[weather]) pending.push({ delay: 1.2 });
  }

  function drawWalker(c: Critter, d: D, id: string): string {
    switch (id) {
      case "squirrel":
        return squirrel(d);
      case "deer":
        return realDeer(d);
      case "hedgehog":
        return c.mood === "curl" ? hedgehogBall(d) : hedgehog(d);
      case "sloth":
        return sloth(d);
      default:
        return regionalMammal(d, id);
    }
  }

  function render(W: number, H: number): string {
    const S = W / 1000;
    const order = [...critters].sort((a, b) => a.y - b.y);
    let out = "";
    for (const c of order) {
      const depth = 0.78 + 0.45 * clamp(c.y, 0, 1.1);
      const s = S * c.spec.scale * depth * 0.95;
      const X = c.x * W;
      const Y = c.y * H;
      const id = c.animal.id;
      const moving = c.state !== "idle" && c.v > 1;
      const d: D = { s, m: c.cm, a: c.clk, moving, ph: c.ph, mood: c.mood };
      const ro = c.react > 0 ? sin((c.react / 0.7) * PI) * 14 * S : 0;
      const br = 1 + sin(c.clk * 2.2 + c.ph) * 0.012;
      const icon = moodIcon(c.mood, c.clk, S * 1.1);
      const trail = getTrailPositionAtFraction(clamp(1 - c.y, 0, 1));
      const inCanopy = c.spec.habitat === "canopy" || (c.spec.habitat === "forest" && Math.abs(c.x * 1000 - trail.x) > 115);
      if (c.spec.kind === "walk") {
        const lean = (c.mood === "flee" || c.mood === "lunge" ? 8 : c.mood === "stalk" ? 5 : c.mood === "alert" ? -3 : 0) * c.face;
        const lift = c.mood === "flee" && id === "deer" ? Math.abs(sin(c.clk * 7)) * 12 * S : 0;
        out += G(X, Y - ro - lift, lean, c.face, br, drawWalker(c, d, id));
        if (icon) out += G(X, Y - ro - lift - (c.spec.h * s + 14 * S), 0, 1, 1, icon);
        if (inCanopy) out += foliageVeil(X, Y, S * depth, c.clk, c.ph);
      } else if (c.spec.kind === "fly") {
        const flying = !c.landed;
        const alt = c.z;
        const sh = clamp(1 - alt / (140 * S), 0.25, 1);
        out += ell(X, Y + 1, 9 * s * sh, 2.4 * s * sh, `rgba(0,0,0,${f(0.2 * sh)})`);
        let inner: string;
        if (id === "toucan") inner = toucan({ ...d, flying });
        else if (id === "woodpecker" || id === "owl") inner = regionalBird({ ...d, flying }, id);
        else
          inner = regionalBird({ ...d, flying }, "woodpecker");
        out += G(X, Y - alt * S - ro, 0, c.face, 1, inner);
        if (icon) out += G(X, Y - alt * S - (c.spec.h * s + 12 * S), 0, 1, 1, icon);
        if (inCanopy && c.landed) out += foliageVeil(X, Y, S * depth, c.clk, c.ph);
      } else {
        out += G(X, Y - ro, 0, c.face, br, swimmer(d, id));
        if (icon) out += G(X, Y - (c.spec.h * s + 12 * S), 0, 1, 1, icon);
      }
    }
    return out;
  }

  function hit(px: number, py: number, W: number, H: number): Critter | null {
    const S = W / 1000;
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      const cx = c.x * W;
      const cy = c.y * H - (c.spec.kind === "fly" ? c.z * S : c.spec.h * 0.3 * S);
      if (Math.hypot(px - cx, py - cy) <= 44 * S * c.spec.scale) return c;
    }
    return null;
  }

  /** Toque no bicho: cada espécie reage do seu jeito. */
  function poke(c: Critter) {
    c.react = 0.7;
    switch (c.spec.temper) {
      case "friendly":
      case "peaceful":
        c.mood = "happy";
        c.moodT = 2.6;
        if (c.spec.kind === "walk") stop(c, 2.6);
        break;
      case "skittish":
        c.mood = "flee";
        c.moodT = 1.6;
        goToward(c, c.x + (rnd() - 0.5) * 0.3, c.y + (rnd() - 0.5) * 0.1);
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
      case "aggressive":
        c.mood = c.spec.kind === "walk" ? "threat" : "calm";
        c.moodT = 1.2;
        if (c.spec.kind === "walk") stop(c, 1.2);
        break;
    }
    if (c.landed) {
      c.landed = false;
      c.timer = 0;
    }
  }

  const find = (animalId: string) => critters.find((c) => c.animal.id === animalId && c.state !== "leaving");
  const position = (c: Critter, W: number, H: number) => {
    const S = W / 1000;
    return { x: c.x * W, y: c.y * H - (c.spec.kind === "fly" ? c.z * S : c.spec.h * 0.8 * S) };
  };

  return { critters, step, render, hit, poke, find, position, setWeather, setFocus };
}
