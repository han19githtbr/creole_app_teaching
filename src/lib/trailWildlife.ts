/**
 * Fauna da Trilha do Aluno Curioso (mata).
 *
 * Os bichos que circulam pela mata são os da ilustração: veado (com filhote pintado), raposa,
 * coelho, esquilo, ouriço, capivara, macaco, tucano, arara, passarinho azul e águia.
 *
 * COMPORTAMENTO natural por espécie (cada uma tem um "temperamento"):
 *  - amigáveis  (esquilo, passarinho, tucano, arara): aproximam-se curiosos do aluno e ficam por perto
 *  - assustadiços (coelho/lebre): congelam e disparam em zigue-zague quando o aluno chega perto
 *  - cautelosos (veado, raposa): erguem a cabeça, observam e se afastam com elegância/pulos
 *  - defensivos (ouriço): enrola-se numa bola de espinhos
 *  - pacíficos  (capivara): ignoram o aluno, andam devagar e adoram a chuva
 *  - agressivos (macaco territorial, águia): macaco faz ameaça e investida de mentirinha; a águia
 *    faz voos rasantes. Nada machuca o aluno: é só comportamento e expressão.
 *
 * CLIMA: cada tempo traz os bichos mais adaptados (sol: todos; chuva: capivara, tucano, arara, ouriço...;
 * neve: raposa-do-ártico, lebre-da-neve, veado, raposa, águia).
 *
 * O mundo é retrato (1000 x ~2200): os bichos nascem/são reciclados perto do aluno.
 */
import { G, ell, circ, line, limb, f, sin, cos, clamp, PI } from "@/lib/storySceneLife";
import { ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";
import { WORLD_H, getTrailPositionAtFraction } from "@/lib/curiousTrailGeometry";

type Kind = "walk" | "fly";
type Temper = "friendly" | "skittish" | "wary" | "defensive" | "aggressive" | "peaceful";
export type Mood = "calm" | "alert" | "flee" | "curious" | "happy" | "curl" | "stalk" | "threat" | "lunge" | "retreat" | "dive";

interface Spec {
  kind: Kind;
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
  squirrel: { kind: "walk", scale: 1.05, speed: 78, gait: 10, hop: true, turn: 6, idle: [1.2, 3], temper: "friendly", sense: 130, flee: 2.0, K: 10, stride: 0, h: 46 },
  rabbit: { kind: "walk", scale: 1.1, speed: 65, gait: 9, hop: true, turn: 5, idle: [2, 4], temper: "skittish", sense: 170, flee: 2.6, K: 9, stride: 0, h: 50 },
  snowhare: { kind: "walk", scale: 1.1, speed: 70, gait: 9, hop: true, turn: 5, idle: [2, 4], temper: "skittish", sense: 180, flee: 2.7, K: 9, stride: 0, h: 50 },
  deer: { kind: "walk", scale: 0.9, speed: 38, gait: 5, turn: 2.5, idle: [3, 5], temper: "wary", sense: 230, flee: 2.5, K: 5, stride: 72, h: 112 },
  fox: { kind: "walk", scale: 0.92, speed: 68, gait: 10, turn: 4, idle: [2, 3], temper: "wary", sense: 190, flee: 2.3, K: 10, stride: 46, h: 52 },
  arcticfox: { kind: "walk", scale: 0.92, speed: 66, gait: 10, turn: 4, idle: [2, 3], temper: "wary", sense: 190, flee: 2.3, K: 10, stride: 46, h: 52 },
  hedgehog: { kind: "walk", scale: 1.1, speed: 22, gait: 9, turn: 3, idle: [2, 4], temper: "defensive", sense: 130, flee: 1, K: 9, stride: 20, h: 30 },
  capybara: { kind: "walk", scale: 1.0, speed: 24, gait: 6, turn: 2.5, idle: [4, 7], temper: "peaceful", sense: 0, flee: 1.6, K: 6, stride: 34, h: 44 },
  monkey: { kind: "walk", scale: 1.0, speed: 72, gait: 8, turn: 5, idle: [1, 2.5], temper: "aggressive", sense: 250, flee: 1.6, K: 8, stride: 36, h: 62 },
  bird: { kind: "fly", scale: 1.5, speed: 90, gait: 16, turn: 5, idle: [3, 4], temper: "friendly", sense: 230, flee: 1, K: 1, stride: 0, h: 22 },
  toucan: { kind: "fly", scale: 1.7, speed: 70, gait: 12, turn: 4, idle: [3, 4], temper: "friendly", sense: 240, flee: 1, K: 1, stride: 0, h: 30 },
  macaw: { kind: "fly", scale: 1.8, speed: 78, gait: 13, turn: 4, idle: [3, 4], temper: "friendly", sense: 240, flee: 1, K: 1, stride: 0, h: 34 },
  eagle: { kind: "fly", scale: 1.3, speed: 65, gait: 1.8, turn: 1, idle: [0, 0], temper: "aggressive", sense: 420, flee: 1, K: 1, stride: 0, h: 20 },
};
const FALLBACK: Spec = SPECIES.rabbit;
const specOf = (id: string): Spec => SPECIES[id] ?? FALLBACK;

/** Bichos de cada clima: os mais adaptados (sol: todos; chuva: gostam de umidade; neve: gostam do frio). */
const WEATHER_ANIMAL_IDS: Record<TrailWeather, readonly string[]> = {
  sunny: ["squirrel", "rabbit", "deer", "fox", "hedgehog", "monkey", "bird", "toucan", "macaw", "eagle"],
  rain: ["capybara", "toucan", "macaw", "hedgehog", "deer", "bird"],
  snow: ["arcticfox", "snowhare", "deer", "fox", "eagle"],
};
const WEATHER_HIGHLIGHTS: Record<TrailWeather, readonly string[]> = {
  sunny: ["squirrel", "deer"],
  rain: ["capybara", "toucan"],
  snow: ["snowhare", "arcticfox"],
};
const WEATHER_TARGET: Record<TrailWeather, number> = { sunny: 7, rain: 5, snow: 5 };

function weatherAdjustedSpec(id: string, weather: TrailWeather): Spec {
  const spec = specOf(id);
  let speedFactor = 1;
  let restFactor = 1;
  if (weather === "rain") {
    if (id === "capybara" || id === "toucan" || id === "macaw" || id === "hedgehog") {
      speedFactor = 1.1; // adoram a chuva: mais ativos
      restFactor = 0.8;
    } else {
      speedFactor = 0.7;
      restFactor = 1.4;
    }
  } else if (weather === "snow") {
    if (id === "arcticfox" || id === "snowhare" || id === "fox" || id === "eagle") {
      speedFactor = 1.05;
      restFactor = 0.9;
    } else {
      speedFactor = 0.75;
      restFactor = 1.35;
    }
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
/** Troca cores hexadecimais de um desenho (variações de espécie: raposa-do-ártico, coelho marrom...). */
function recolor(svg: string, map: Record<string, string>): string {
  return svg.replace(/#[0-9a-fA-F]{6}/g, (m) => map[m.toLowerCase()] ?? m);
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


/** ÁGUIA REAL (Aquila chrysaetos) */
function eagle(o: D): string {
  const k = sin(o.a * 1.8 + o.ph) * 0.35 + sin(o.a * 0.6) * 0.12;

  // Asas majestosas com penas primárias abertas e digitadas
  const wing = (dir: number, c: string, stroke: string) => `
    <path
      d="M-6 -2
         Q-32 ${f(dir * (-16 + k * 28))} -64 ${f(dir * (-8 + k * 32))}
         Q-62 ${f(dir * (-3 + k * 24))} -54 ${f(dir * (-1 + k * 20))}
         Q-48 ${f(dir * (1 + k * 16))} -42 ${f(dir * (3 + k * 14))}
         Q-28 ${f(dir * (0 + k * 9))} -6 6 Z"
      fill="${c}"
      stroke="${stroke}"
      stroke-width="1.2"
    />
  `;

  const body = `
    ${wing(-1, "#54280b", "#3b1a06")}
    <!-- Cauda em leque com faixas brancas e ponta escura -->
    <path d="M-16 0 L-36 ${f(-4 + k * 2)} L-38 6 L-16 5 Z" fill="#291103" />
    <path d="M-20 0 L-30 ${f(-3 + k * 2)} L-31 4 L-20 3 Z" fill="#fef3c7" opacity="0.8" />
    <!-- Corpo forte castanho-escuro -->
    <ellipse cx="0" cy="0" rx="20" ry="6.5" fill="#451a03" stroke="#291103" stroke-width="1" />
    <!-- Cabeça com plumagem dourada na nuca -->
    <circle cx="20" cy="-1.5" r="6" fill="#78350f" />
    <path d="M15 -5 Q21 -7 25 -3" stroke="#f59e0b" stroke-width="3" fill="none" />
    <!-- Bico amarelo adunco forte -->
    <path d="M24 -2 L33 0 L25 4 Z" fill="#f59e0b" stroke="#b45309" stroke-width="0.8" />
    <path d="M30 0 Q33 2 32 4" stroke="#78350f" stroke-width="1" fill="none" />
    <!-- Olho amarelo penetrante com pupila preta -->
    <circle cx="22" cy="-2.5" r="1.6" fill="#facc15" />
    <circle cx="22" cy="-2.5" r="0.9" fill="#18181b" />
    <!-- Garras amarelas curvas recolhidas -->
    <path d="M2 5 L4 9 M6 5 L8 9" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round" />
    ${wing(1, "#3b1a06", "#1c0d03")}
  `;

  return G(0, 0, 0, o.s, o.s, body);
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


/** RAPOSA VERMELHA (Vulpes vulpes) */
function realFox(o: D): string {
  const w = o.m * 10 + o.ph;
  const k = o.moving ? sin(w) : 0;

  // Pernas com meias pretas na parte inferior
  const legs = [
    [-17, k],
    [-9, -k],
    [13, -k],
    [21, k],
  ]
    .map(([lx, a]) => {
      return (
        limb(lx, -17, 18, (a as number) * 0.8, 5, "#c2410c") +
        limb(lx + sin((a as number) * 0.8) * 10, -17 + cos((a as number) * 0.8) * 10, 8, (a as number) * 0.8, 4.5, "#18181b")
      );
    })
    .join("");

  // Cauda espessa com ponta branca ondulando ao correr
  const tail = `
    <g transform="rotate(${f(sin(w * 0.85) * 14)} -28 -28)">
      <path d="M-26 -26 C-42 -32 -54 -24 -48 -16 C-42 -10 -30 -16 -24 -24 Z" fill="#ea580c" />
      <ellipse cx="-44" cy="-28" rx="18" ry="7.5" fill="#ea580c" transform="rotate(-15 -44 -28)" stroke="#9a3412" stroke-width="1" />
      <!-- Ponta da cauda branca como algodão -->
      <ellipse cx="-58" cy="-32" rx="7" ry="5.5" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" />
    </g>
  `;

  // Cabeça triangular, focinho fino e bochechas brancas
  const head = `
    <ellipse cx="32" cy="-35" rx="12" ry="9.5" fill="#ea580c" stroke="#9a3412" stroke-width="1" />
    <!-- Bochechas brancas volumosas -->
    <ellipse cx="28" cy="-31" rx="8" ry="6" fill="#ffffff" />
    <!-- Focinho afilado com nariz preto -->
    <polygon points="38,-36 54,-32 38,-28" fill="#f97316" stroke="#c2410c" stroke-width="0.8" />
    <circle cx="53" cy="-32" r="1.8" fill="#18181b" />
    <!-- Olho amendoado oblíquo com pupila fina -->
    <path d="M34 -37 Q37 -40 40 -37 Q37 -34 34 -37 Z" fill="#fef08a" stroke="#18181b" stroke-width="1" />
    <circle cx="37" cy="-37" r="1.2" fill="#18181b" />
    <!-- Orelhas pontiagudas com costas pretas e interior branco -->
    <polygon points="26,-42 28,-56 36,-44" fill="#18181b" />
    <polygon points="28,-44 30,-53 35,-45" fill="#ffffff" />
    <polygon points="34,-43 40,-55 43,-42" fill="#18181b" />
    <polygon points="36,-44 40,-52 42,-44" fill="#ffffff" />
  `;

  const body = `
    ${legs}
    <ellipse cx="0" cy="-28" rx="28" ry="12" fill="#ea580c" stroke="#9a3412" stroke-width="1.2" />
    <!-- Peito e garganta brancos -->
    <ellipse cx="16" cy="-25" rx="15" ry="8" fill="#ffffff" />
    ${head}
    ${tail}
  `;

  return G(0, -Math.abs(k) * 3.5, 0, o.s, o.s, body) + ell(0, 1, 32 * o.s, 5.5 * o.s, "rgba(0,0,0,.22)");
}


/** COELHO / LEBRE ALPINA (Lepus timidus) */
function realRabbit(o: D): string {
  const w = o.m * 9 + o.ph;
  const hop = o.moving ? Math.abs(sin(w)) * 18 : 0;
  const breath = sin(o.a * 3 + o.ph) * 0.6;

  // Orelhas longas com pontas pretas (típica lebre da neve)
  const ears = `
    <g transform="rotate(${f(-8 + sin(w * 1.5) * 6)} 14 -28)">
      <ellipse cx="14" cy="-35" rx="3.2" ry="11" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
      <ellipse cx="14" cy="-34" rx="1.8" ry="8" fill="#fbcfe8" opacity="0.6" />
      <!-- Ponta preta característica da lebre alpina -->
      <polygon points="12,-44 14,-46 16,-44" fill="#18181b" />
    </g>
    <g transform="rotate(${f(10 + sin(w * 1.5) * 6)} 20 -28)">
      <ellipse cx="20" cy="-34" rx="3" ry="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
      <ellipse cx="20" cy="-33" rx="1.6" ry="7" fill="#fbcfe8" opacity="0.6" />
      <polygon points="18,-42 20,-44 22,-42" fill="#18181b" />
    </g>
  `;

  const body = `
    <!-- Corpo volumoso fofo -->
    <ellipse cx="0" cy="${f(-15 + breath)}" rx="17" ry="11" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
    <!-- Cabeça com focinho trêmulo -->
    <circle cx="16" cy="${f(-22 + breath)}" r="8.5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
    <!-- Bochecha e focinho -->
    <ellipse cx="21" cy="${f(-20 + breath)}" rx="3.5" ry="3" fill="#fef2f2" />
    <circle cx="23.5" cy="${f(-21 + breath)}" r="1.3" fill="#f43f5e" />
    <!-- Olho rosado brilhante de coelho alpino -->
    <circle cx="17.5" cy="${f(-24 + breath)}" r="2" fill="#991b1b" />
    <circle cx="18" cy="${f(-24.5 + breath)}" r="0.7" fill="#ffffff" />
    ${ears}
    <!-- Rabo felpudo de pompom -->
    <circle cx="-16" cy="${f(-17 + breath)}" r="5.5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <!-- Patas traseiras musculosas de salto -->
    <ellipse cx="-8" cy="-5" rx="8" ry="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
    <ellipse cx="10" cy="-4" rx="6" ry="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
  `;

  return G(0, -hop, 0, o.s, o.s, body) + ell(0, 1, 18 * o.s, 4.5 * o.s, "rgba(0,0,0,.22)");
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

/** Clareiras ao lado do caminho (frações do mundo) onde os bichos passeiam. */
const ROAM_SPOTS: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
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
      const off = 95 + ((i + (side > 0 ? 1 : 0)) % 3) * 35;
      const x = clamp((p.x + nx * off * side) / 1000, 0.07, 0.93);
      const y = clamp((p.y + ny * off * side) / WORLD_H, 0.02, 0.985);
      out.push({ x, y });
    }
  }
  return out;
})();

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
  const pickSpot = (minDy: number, maxDy: number): number => {
    const ok: number[] = [];
    ROAM_SPOTS.forEach((s, i) => {
      const dy = Math.abs(s.y - stu.y);
      if (dy >= minDy && dy <= maxDy && spotFree(i)) ok.push(i);
    });
    return ok.length ? ok[Math.floor(rnd() * ok.length)] : -1;
  };
  const randRegion = () => ({
    x: 0.1 + rnd() * 0.8,
    y: clamp(stu.y - 0.15 + rnd() * 0.2, 0.03, 0.98),
  });
  const weatherPool = () => {
    const allowed = new Set(WEATHER_ANIMAL_IDS[weather]);
    return ROAMING_ANIMAL_POOL.filter((a) => allowed.has(a.id));
  };

  function spawn(kind?: Kind, initial = false, preferredId?: string) {
    const visible = new Set(critters.map((c) => c.animal.id));
    const pool = weatherPool();
    let cand = pool.filter((a) => !visible.has(a.id) && (!kind || specOf(a.id).kind === kind) && (!preferredId || a.id === preferredId));
    if (cand.length === 0 && !preferredId) cand = pool.filter((a) => !visible.has(a.id));
    if (cand.length === 0) return;
    const c = mk(cand[Math.floor(rnd() * cand.length)]);
    if (c.spec.kind === "walk") {
      const sp = initial ? pickSpot(0, NEAR) : pickSpot(0.09, 0.16);
      if (sp < 0) return;
      c.spot = sp;
      c.x = ROAM_SPOTS[sp].x;
      c.y = ROAM_SPOTS[sp].y;
      c.state = "idle";
      c.timer = initial ? rnd() * 3 : 0.2;
    } else {
      const R = randRegion(c.animal.id);
      if (initial) {
        c.x = R.x;
        c.y = R.y;
        c.z = 30;
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
    const allowed = new Set(WEATHER_ANIMAL_IDS[weather]);
    for (let i = critters.length - 1; i >= 0; i--) {
      if (!allowed.has(critters[i].animal.id)) critters.splice(i, 1);
      else critters[i].spec = weatherAdjustedSpec(critters[i].animal.id, weather);
    }
    if (populated) populate();
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
        const sp2 = pickSpot(0, NEAR);
        if (sp2 >= 0) {
          c.spot = sp2;
          goToward(c, ROAM_SPOTS[sp2].x, ROAM_SPOTS[sp2].y);
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

    if (c.animal.id === "eagle") {
      // águia: plana em círculos acima do aluno e, de vez em quando, faz um voo rasante curioso/agressivo
      c.orbit += dt * 0.3;
      const ox = 0.55 + sin(c.orbit) * 0.28;
      const oy = clamp(stu.y - 0.13 + cos(c.orbit * 0.75) * 0.04, 0.03, 0.97);
      const ds = Math.hypot(sx - ox * W, sy - oy * H);
      if (c.mood === "calm" && c.cool <= 0 && ds < sp.sense * S * 1.6) {
        c.mood = "dive";
        c.moodT = 3.4;
        c.cool = 20;
      }
      if (c.mood === "dive") {
        const u = 1 - c.moodT / 3.4;
        c.dive = sin(clamp(u, 0, 1) * PI);
        const side = sx > ox * W ? -1 : 1;
        const px = (sx + side * 150 * S) / W;
        const py = (sy - 60 * S) / H;
        c.x = ox + (px - ox) * c.dive;
        c.y = oy + (py - oy) * c.dive;
        c.face = px > ox ? 1 : -1;
        if (c.moodT <= 0) {
          c.mood = "calm";
          c.dive = 0;
        }
      } else {
        c.x = ox;
        c.y = oy;
        c.face = cos(c.orbit) > 0 ? 1 : -1;
      }
      c.z = 85 + sin(c.orbit * 1.8) * 15 - c.dive * 55;
      return;
    }

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
    } else {
      c.timer -= dt;
      if (c.timer <= 0 && c.mood !== "curious") {
        const R = randRegion();
        c.tx = R.x;
        c.ty = R.y;
        c.timer = 3 + rnd() * 4;
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
      if (c.spec.kind === "walk") updateWalker(c, dt, W, H);
      else updateFlyer(c, dt, W, H);
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
      case "rabbit":
        return recolor(realRabbit(d), { "#f8fafc": "#a97c50", "#cbd5e1": "#6b4a2b", "#f1f5f9": "#bf9466", "#ffffff": "#f1dfc4", "#e2e8f0": "#d4b48a", "#fef2f2": "#e8c9a0", "#fbcfe8": "#d9a98a" });
      case "snowhare":
        return realRabbit(d);
      case "deer":
        return realDeer(d);
      case "fox":
        return realFox(d);
      case "arcticfox":
        return recolor(realFox(d), { "#ea580c": "#eef3f9", "#c2410c": "#bcc8da", "#9a3412": "#8d9bb5", "#f97316": "#ffffff" });
      case "hedgehog":
        return c.mood === "curl" ? hedgehogBall(d) : hedgehog(d);
      case "capybara":
        return capybara(d);
      case "monkey":
        return monkey(d);
      default:
        return realRabbit(d);
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
      if (c.spec.kind === "walk") {
        const lean = (c.mood === "flee" || c.mood === "lunge" ? 8 : c.mood === "stalk" ? 5 : c.mood === "alert" ? -3 : 0) * c.face;
        const lift = c.mood === "flee" && id === "deer" ? Math.abs(sin(c.clk * 7)) * 12 * S : 0;
        out += G(X, Y - ro - lift, lean, c.face, br, drawWalker(c, d, id));
        if (icon) out += G(X, Y - ro - lift - (c.spec.h * s + 14 * S), 0, 1, 1, icon);
      } else {
        const flying = !c.landed;
        if (id === "eagle") {
          out += G(X, Y, 0, c.face, 1, G(0, 0, clamp(sin(c.orbit) * 6, -8, 8) + c.dive * 14, 1, 1, eagle(d)));
          if (icon) out += G(X, Y - 40 * S, 0, 1, 1, icon);
          continue;
        }
        const alt = c.z;
        const sh = clamp(1 - alt / (140 * S), 0.25, 1);
        out += ell(X, Y + 1, 9 * s * sh, 2.4 * s * sh, `rgba(0,0,0,${f(0.2 * sh)})`);
        let inner: string;
        if (id === "toucan") inner = toucan({ ...d, flying });
        else if (id === "macaw") inner = macaw({ ...d, flying });
        else
          inner = recolor(songbird({ ...d, flying }, "#3b82f6"), { "#dc2626": "#2563eb", "#991b1b": "#1e3a8a", "#b91c1c": "#1d4ed8" });
        out += G(X, Y - alt * S - ro, 0, c.face, 1, inner);
        if (icon) out += G(X, Y - alt * S - (c.spec.h * s + 12 * S), 0, 1, 1, icon);
      }
    }
    return out;
  }

  function hit(px: number, py: number, W: number, H: number): Critter | null {
    const S = W / 1000;
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      const cx = c.x * W;
      const cy = c.y * H - (c.spec.kind === "fly" ? c.z * S : 0) - (c.spec.kind === "walk" ? c.spec.h * 0.3 * S : 0);
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
