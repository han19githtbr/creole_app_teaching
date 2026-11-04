/**
 * Vida selvagem tropical da Trilha do Aluno Curioso.
 *
 * Animais com anatomia fiel à fauna brasileira, plumagens vibrantes e
 * movimentos orgânicos característicos de cada espécie tropical:
 *
 *  - Tucano (Ramphastos toco): bico imenso laranja-amarelo, corpo preto com peito branco.
 *  - Arara Vermelha (Ara macao): plumagem vermelha, azul e amarela, longa cauda pontiaguda.
 *  - Águia (Harpia harpyja): grande envergadura, planada majestosa em correntes quentes.
 *  - Cervo / Veado-mateiro (Mazama americana): pelagem marrom-avermelhada, sem galhada.
 *  - Macaco-prego (Sapajus apella): corpo castanho, face clara, cauda preênsil enrolada.
 *  - Coelho (Sylvilagus brasiliensis): pelagem marrom-acinzentada, orelhas médias.
 *  - Esquilo (Sciurus aestuans): esquilo tropical cinza-pardo, cauda felpuda.
 *  - Pássaro Azul / Cotinga (Cotinga cayana): azul elétrico vibrante, pequeno e vivaz.
 */
import { G, ell, circ, line, limb, f, sin, cos, clamp, PI } from "@/lib/storySceneLife";
import { TRAIL_ROAM_SPOTS, ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailHabitat, type TrailWeather } from "@/lib/curiousTrailData";

type Kind = "walk" | "fly";
interface Spec {
  kind: Kind;
  scale: number;
  speed: number;
  gait: number;
  hop?: boolean;
  turn: number;
  idle: [number, number];
}

const SPECIES: Record<string, Spec> = {
  esquilo:       { kind: "walk", scale: 1.05, speed: 78, gait: 10, hop: true,  turn: 6,   idle: [1.2, 3] },
  coelho:        { kind: "walk", scale: 1.1,  speed: 60, gait: 9,  hop: true,  turn: 5,   idle: [2, 4]   },
  cervo:         { kind: "walk", scale: 0.9,  speed: 38, gait: 5,               turn: 2.5, idle: [4, 6]   },
  macaco:        { kind: "walk", scale: 1.0,  speed: 55, gait: 8,  hop: true,  turn: 4,   idle: [2, 4]   },
  tucano:        { kind: "walk", scale: 1.2,  speed: 35, gait: 6,  hop: true,  turn: 3,   idle: [3, 5]   },
  aguia:         { kind: "fly",  scale: 1.25, speed: 65, gait: 1.8,            turn: 1,   idle: [0, 0]   },
  araraVermelha: { kind: "fly",  scale: 1.4,  speed: 75, gait: 7,              turn: 2.5, idle: [2, 4]   },
  passaroAzul:   { kind: "fly",  scale: 1.1,  speed: 80, gait: 14,             turn: 4,   idle: [1.5, 3] },
};
const FALLBACK: Spec = SPECIES.coelho;
const specOf = (id: string): Spec => SPECIES[id] ?? FALLBACK;

const WEATHER_ANIMAL_IDS: Record<TrailWeather, readonly string[]> = {
  sunny: ["cervo", "coelho", "esquilo", "tucano", "araraVermelha", "passaroAzul"],
  rain:  ["macaco", "tucano", "passaroAzul", "coelho"],
  snow:  ["aguia", "cervo", "coelho"],
};

const WEATHER_HIGHLIGHTS: Record<TrailWeather, readonly string[]> = {
  sunny: ["tucano", "araraVermelha"],
  rain:  ["macaco"],
  snow:  ["aguia"],
};

function weatherAdjustedSpec(id: string, weather: TrailWeather): Spec {
  const spec = specOf(id);
  let speedFactor = 1;
  let restFactor = 1;

  if (weather === "rain") {
    if (id === "macaco" || id === "tucano") {
      speedFactor = 0.85;
      restFactor = 1.2;
    } else {
      speedFactor = 0.65;
      restFactor = 1.5;
    }
  } else if (weather === "snow") {
    if (id === "aguia") {
      speedFactor = 0.9;
      restFactor = 1.1;
    } else if (id === "cervo") {
      speedFactor = 0.8;
      restFactor = 1.25;
    } else {
      speedFactor = 0.7;
      restFactor = 1.4;
    }
  }

  return {
    ...spec,
    speed: spec.speed * speedFactor,
    idle: [spec.idle[0] * restFactor, spec.idle[1] * restFactor],
  };
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
  hasTarget: boolean;
  tx: number;
  ty: number;
  timer: number;
  clk: number;
  cm: number;
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

type D = { s: number; m: number; a: number; moving: boolean; ph: number };

/* ==================================================================
   DESENHOS REALISTAS DOS ANIMAIS TROPICAIS (SVG detalhado)
   ================================================================== */

/** TUCANO (Ramphastos toco) — Pássaro icônico do Brasil */
function tucano(o: D): string {
  const w = o.m * 6 + o.ph;
  const hop = o.moving ? Math.abs(sin(w)) * 12 : 0;
  const headBob = o.moving ? sin(w) * 5 : sin(o.a * 1.8 + o.ph) * 2;
  const breath = sin(o.a * 2.2 + o.ph) * 0.7;

  // Pernas finas com garras de tucano
  const legL = line(-6, -6, -6, 0, 2.5, "#451a03");
  const legR = line(4, -6, 4, 0, 2.5, "#451a03");
  const clawL = `<path d="M-9,0 L-6,0 M-6,0 L-4,2 M-6,0 L-7,2" stroke="#451a03" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  const clawR = `<path d="M1,0 L4,0 M4,0 L6,2 M4,0 L3,2" stroke="#451a03" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;

  // Cauda curta vermelha
  const tail = `<path d="M-18 -10 L-28 -8 L-26 -4 L-16 -6 Z" fill="#dc2626" stroke="#991b1b" stroke-width="0.8"/>`;

  // Corpo preto
  const body = `<ellipse cx="0" cy="${f(-13 + breath)}" rx="20" ry="12" fill="#1a1a1a" stroke="#000" stroke-width="1"/>`;

  // Peito e garganta brancos
  const chest = `<ellipse cx="8" cy="${f(-10 + breath)}" rx="14" ry="9" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.8"/>`;

  // Cabeça preta com anel vermelho ao redor do olho
  const head = `<circle cx="20" cy="${f(-22 + headBob + breath)}" r="9" fill="#1a1a1a" stroke="#000" stroke-width="0.8"/>`;

  // Anel vermelho ao redor do olho
  const eyeRing = `<circle cx="23" cy="${f(-25 + headBob + breath)}" r="3.8" fill="#dc2626"/>`;

  // Olho amarelo com pupila preta
  const eye = `<circle cx="23" cy="${f(-25 + headBob + breath)}" r="2.6" fill="#facc15"/>` +
              `<circle cx="23" cy="${f(-25 + headBob + breath)}" r="1.4" fill="#18181b"/>` +
              `<circle cx="23.6" cy="${f(-25.6 + headBob + breath)}" r="0.6" fill="#ffffff"/>`;

  // Bico imenso curvo laranja/amarelo — a característica do tucano
  const beak = `
    <path d="M20 ${f(-22 + headBob + breath)} Q32 ${f(-28 + headBob + breath)} 42 ${f(-24 + headBob + breath)} Q44 ${f(-18 + headBob + breath)} 36 ${f(-16 + headBob + breath)} Q28 ${f(-14 + headBob + breath)} 20 ${f(-18 + headBob + breath)} Z"
      fill="#f97316" stroke="#c2410c" stroke-width="1"/>
    <path d="M20 ${f(-22 + headBob + breath)} Q32 ${f(-28 + headBob + breath)} 42 ${f(-24 + headBob + breath)} Q32 ${f(-22 + headBob + breath)} 20 ${f(-18 + headBob + breath)} Z"
      fill="#fbbf24" opacity="0.7"/>
  `;

  const bodyStr = `
    ${tail}
    ${legL}${legR}${clawL}${clawR}
    ${body}
    ${chest}
    ${head}
    ${eyeRing}
    ${beak}
    ${eye}
  `;

  return G(0, -hop, 0, o.s, o.s, bodyStr) + ell(0, 1, 18 * o.s, 4 * o.s, "rgba(0,0,0,.2)");
}

/** ÁGUIA (Harpia harpyja) — Harpia real, planada majestosa */
function aguia(o: D): string {
  const k = sin(o.a * 1.8 + o.ph) * 0.35 + sin(o.a * 0.6) * 0.12;

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
    <!-- Cauda em leque com faixas claras -->
    <path d="M-16 0 L-36 ${f(-4 + k * 2)} L-38 6 L-16 5 Z" fill="#291103"/>
    <path d="M-20 0 L-30 ${f(-3 + k * 2)} L-31 4 L-20 3 Z" fill="#fef3c7" opacity="0.8"/>
    <!-- Corpo castanho-escuro -->
    <ellipse cx="0" cy="0" rx="20" ry="6.5" fill="#451a03" stroke="#291103" stroke-width="1"/>
    <!-- Cabeça com topete cinza característico da harpia -->
    <circle cx="20" cy="-1.5" r="6" fill="#78350f"/>
    <path d="M15 -5 Q21 -8 25 -3" stroke="#94a3b8" stroke-width="2.5" fill="none"/>
    <!-- Bico amarelo adunco forte -->
    <path d="M24 -2 L33 0 L25 4 Z" fill="#f59e0b" stroke="#b45309" stroke-width="0.8"/>
    <path d="M30 0 Q33 2 32 4" stroke="#78350f" stroke-width="1" fill="none"/>
    <!-- Olho amarelo penetrante -->
    <circle cx="22" cy="-2.5" r="1.6" fill="#facc15"/>
    <circle cx="22" cy="-2.5" r="0.9" fill="#18181b"/>
    <!-- Garras amarelas -->
    <path d="M2 5 L4 9 M6 5 L8 9" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round"/>
    ${wing(1, "#3b1a06", "#1c0d03")}
  `;

  return G(0, 0, 0, o.s, o.s, body);
}

/** CERVO / VEADO-MATEIRO (Mazama americana) — Sem galhada, pelagem marrom-avermelhada */
function realCervo(o: D): string {
  const w = o.m * 5 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const graze = o.moving ? 0 : (sin(o.a * 0.9 + o.ph) + 1) / 2;

  const legs = [-20, -12, 14, 22]
    .map((lx, i) => {
      const col = i % 2 === 0 ? "#92400e" : "#78350f";
      return limb(lx, -34, 36, sin(w * 0.5 + i) * 0.05 + k * 0.4, 4.5, col);
    })
    .join("");

  const head = `
    <g transform="rotate(${f(-6 + graze * 42)} 24 -50)">
      <!-- Pescoço gracioso marrom-avermelhado -->
      <line x1="22" y1="a-48" x2="38" y2="-76" stroke="#b45309" stroke-width="9" stroke-linecap="round"/>
      <line x1="22" y1="-48" x2="38" y2="-76" stroke="#b45309" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="44" cy="-80" rx="11" ry="7" fill="#b45309" transform="rotate(-18 44 -80)" stroke="#78350f" stroke-width="1"/>
      <!-- Olho grande e meigo -->
      <circle cx="47" cy="-82" r="2" fill="#18181b"/>
      <circle cx="47.6" cy="-82.6" r="0.7" fill="#ffffff"/>
      <!-- Focinho com narinas -->
      <ellipse cx="53" cy="-77" rx="3.2" ry="2.4" fill="#291103"/>
      <!-- Orelha alerta tropical -->
      <ellipse cx="40" cy="-88" rx="2.8" ry="5.5" fill="#92400e" transform="rotate(-25 40 -88)"/>
      <ellipse cx="40" cy="-88" rx="1.5" ry="3.5" fill="#fde68a" opacity="0.7" transform="rotate(-25 40 -88)"/>
      <!-- Sem galhada — veado fêmea brasileiro -->
    </g>
  `;

  // Manchas juvenis sutis
  const body = `
    ${legs}
    <ellipse cx="0" cy="-45" rx="30" ry="14" fill="#b45309" stroke="#78350f" stroke-width="1.2"/>
    <ellipse cx="6" cy="-40" rx="18" ry="9" fill="#d97706" opacity="0.75"/>
    <!-- Manchas brancas sutis -->
    <circle cx="-6" cy="-49" r="1.6" fill="#fef3c7" opacity="0.55"/>
    <circle cx="4" cy="-43" r="1.6" fill="#fef3c7" opacity="0.55"/>
    <circle cx="14" cy="-46" r="1.5" fill="#fef3c7" opacity="0.55"/>
    ${head}
    <!-- Cauda curta com mancha bege -->
    <ellipse cx="-30" cy="-51" rx="5" ry="3" fill="#fef3c7" transform="rotate(-28 -30 -51)" stroke="#b45309" stroke-width="0.8"/>
  `;

  return G(0, -Math.abs(k) * 1.5, 0, o.s, o.s, body) + ell(0, 1, 34 * o.s, 6 * o.s, "rgba(0,0,0,.22)");
}

/** MACACO-PREGO (Sapajus apella) — Corpo castanho, face clara, cauda preênsil */
function macaco(o: D): string {
  const w = o.m * 8 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const groom = !o.moving ? Math.max(0, sin(o.a * 1.8 + o.ph)) : 0; // animação de cuidado

  // Cauda preênsil enrolada característica
  const tail = `
    <path d="M-14 -16 C-26 -10 -34 -2 -30 10 C-26 20 -18 20 -18 12 C-18 6 -24 6 -22 2"
      stroke="#78350f" stroke-width="5.5" fill="none" stroke-linecap="round"/>
    <path d="M-14 -16 C-26 -10 -34 -2 -30 10 C-26 20 -18 20 -18 12 C-18 6 -24 6 -22 2"
      stroke="#92400e" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
  `;

  // Braços longos — primata
  const armL = limb(-12, -20, 18, -k * 0.9 - groom * 0.8, 4, "#78350f");
  const armR = limb(10, -20, 18, k * 0.9 + groom * 0.6, 4, "#78350f");

  // Pernas curtas
  const legL = limb(-8, -10, 14, k * 0.6, 4.5, "#78350f");
  const legR = limb(6, -10, 14, -k * 0.6, 4.5, "#78350f");

  const body = `
    ${tail}
    ${legL}${legR}
    <!-- Corpo castanho robusto -->
    <ellipse cx="0" cy="-18" rx="16" ry="12" fill="#78350f" stroke="#451a03" stroke-width="1"/>
    <!-- Peito mais claro -->
    <ellipse cx="4" cy="-14" rx="10" ry="7.5" fill="#92400e" opacity="0.8"/>
    ${armL}${armR}
    <!-- Cabeça com face creme característica do macaco-prego -->
    <circle cx="12" cy="-30" r="10" fill="#78350f" stroke="#451a03" stroke-width="1"/>
    <!-- Calota escura (capuz) -->
    <ellipse cx="10" cy="-37" rx="8.5" ry="5.5" fill="#451a03"/>
    <!-- Face creme -->
    <ellipse cx="14" cy="-28" rx="6.5" ry="6" fill="#fef3c7"/>
    <!-- Olhos -->
    <circle cx="12" cy="-31" r="1.8" fill="#18181b"/>
    <circle cx="12.5" cy="-31.5" r="0.6" fill="#ffffff"/>
    <!-- Nariz e boca -->
    <ellipse cx="16" cy="-27" rx="2.5" ry="1.8" fill="#78350f"/>
    <path d="M13 -24 Q16 -22 19 -24" stroke="#451a03" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  `;

  return G(0, -Math.abs(k) * 6 * o.s, 0, o.s, o.s, body) + ell(0, 1, 18 * o.s, 4 * o.s, "rgba(0,0,0,.22)");
}

/** ESQUILO TROPICAL (Sciurus aestuans) — Esquilo cinza-pardo com cauda felpuda */
function realEsquilo(o: D): string {
  const w = o.m * 10 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const tailSway = sin(o.a * 3.2 + o.ph) * 9 + (o.moving ? sin(w) * 11 : 0);
  const breath = sin(o.a * 2.5 + o.ph) * 0.8;

  // Cauda volumosa tropical — cinza-parda
  const tail = `
    <g transform="rotate(${f(tailSway)} -14 -16)">
      <path d="M-10 -12 C-26 -18 -36 -38 -24 -52 C-14 -64 -2 -60 -4 -48 C-6 -38 -18 -28 -10 -12 Z" fill="#78716c" stroke="#57534e" stroke-width="1.2"/>
      <path d="M-12 -16 C-24 -24 -32 -40 -22 -50 C-14 -58 -6 -56 -8 -46 C-10 -38 -18 -30 -12 -16 Z" fill="#a8a29e" opacity="0.75"/>
      <path d="M-14 -22 C-22 -28 -28 -40 -20 -46" stroke="#fafaf9" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
    </g>
  `;

  const backLeg = limb(-8, -8, 11, k * 0.8, 4.2, "#57534e");
  const frontLeg = limb(9, -8, 10, -k * 0.8, 3.8, "#57534e");

  const body = `
    ${tail}
    ${backLeg}
    ${frontLeg}
    <ellipse cx="0" cy="${f(-15 + breath)}" rx="15" ry="9.5" fill="#78716c" stroke="#57534e" stroke-width="1"/>
    <!-- Barriga mais clara -->
    <ellipse cx="5" cy="${f(-12 + breath)}" rx="8.5" ry="5.5" fill="#d6d3d1"/>
    <!-- Cabeça -->
    <circle cx="15" cy="${f(-22 + breath)}" r="7" fill="#78716c" stroke="#57534e" stroke-width="1"/>
    <ellipse cx="18" cy="${f(-19 + breath)}" rx="4.5" ry="3.5" fill="#e7e5e4"/>
    <!-- Nariz -->
    <circle cx="21.5" cy="${f(-20 + breath)}" r="1.3" fill="#18181b"/>
    <!-- Olho preto brilhante -->
    <circle cx="17" cy="${f(-24 + breath)}" r="1.8" fill="#18181b"/>
    <circle cx="17.6" cy="${f(-24.6 + breath)}" r="0.6" fill="#ffffff"/>
    <!-- Orelhas pequenas sem tufos (tropical) -->
    <polygon points="12,-28 14,-35 17,-28" fill="#57534e"/>
    <polygon points="17,-27 19,-34 21,-27" fill="#78716c"/>
    <!-- Patinhas -->
    <circle cx="17" cy="${f(-13 + breath)}" r="2.2" fill="#57534e"/>
    <circle cx="19" cy="${f(-14 + breath)}" r="2.2" fill="#44403c"/>
  `;

  return G(0, -Math.abs(k) * 10 * o.s, 0, o.s, o.s, body) + ell(0, 1, 16 * o.s, 4 * o.s, "rgba(0,0,0,.22)");
}

/** COELHO TROPICAL (Sylvilagus brasiliensis) — Pelagem marrom-acinzentada */
function realCoelho(o: D): string {
  const w = o.m * 9 + o.ph;
  const hop = o.moving ? Math.abs(sin(w)) * 18 : 0;
  const breath = sin(o.a * 3 + o.ph) * 0.6;

  // Orelhas médias (menores que o coelho europeu)
  const ears = `
    <g transform="rotate(${f(-8 + sin(w * 1.5) * 6)} 14 -28)">
      <ellipse cx="14" cy="-34" rx="3.2" ry="10" fill="#a3a3a3" stroke="#737373" stroke-width="1"/>
      <ellipse cx="14" cy="-33" rx="1.8" ry="7" fill="#fbcfe8" opacity="0.6"/>
    </g>
    <g transform="rotate(${f(10 + sin(w * 1.5) * 6)} 20 -28)">
      <ellipse cx="20" cy="-33" rx="3" ry="9" fill="#a3a3a3" stroke="#737373" stroke-width="1"/>
      <ellipse cx="20" cy="-32" rx="1.6" ry="6.5" fill="#fbcfe8" opacity="0.6"/>
    </g>
  `;

  const body = `
    <!-- Corpo fofo marrom-acinzentado -->
    <ellipse cx="0" cy="${f(-15 + breath)}" rx="17" ry="11" fill="#a3a3a3" stroke="#737373" stroke-width="1.2"/>
    <!-- Cabeça -->
    <circle cx="16" cy="${f(-22 + breath)}" r="8.5" fill="#a3a3a3" stroke="#737373" stroke-width="1"/>
    <!-- Bochecha e focinho -->
    <ellipse cx="21" cy="${f(-20 + breath)}" rx="3.5" ry="3" fill="#d4d4d4"/>
    <circle cx="23.5" cy="${f(-21 + breath)}" r="1.3" fill="#f43f5e"/>
    <!-- Olho escuro de coelho -->
    <circle cx="17.5" cy="${f(-24 + breath)}" r="2" fill="#18181b"/>
    <circle cx="18" cy="${f(-24.5 + breath)}" r="0.7" fill="#ffffff"/>
    ${ears}
    <!-- Rabo felpudo branco -->
    <circle cx="-16" cy="${f(-17 + breath)}" r="5.5" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="1"/>
    <!-- Patas traseiras musculosas -->
    <ellipse cx="-8" cy="-5" rx="8" ry="4" fill="#d4d4d4" stroke="#a3a3a3" stroke-width="1"/>
    <ellipse cx="10" cy="-4" rx="6" ry="3" fill="#d4d4d4" stroke="#a3a3a3" stroke-width="1"/>
  `;

  return G(0, -hop, 0, o.s, o.s, body) + ell(0, 1, 18 * o.s, 4.5 * o.s, "rgba(0,0,0,.22)");
}

/** ARARA VERMELHA (Ara macao) — Plumagem vermelha, azul e amarela, longa cauda */
function araraVermelha(o: D & { flying: boolean }, _col: string): string {
  if (o.flying) {
    const w = o.a * 7 + o.ph;
    const k = sin(w) * 0.8;

    // Asas grandes com batidas dramáticas
    const wingUp = (dir: number) => `
      <path
        d="M-4 -1
           Q-20 ${f(dir * (-22 + k * 32))} -48 ${f(dir * (-12 + k * 36))}
           Q-46 ${f(dir * (-5 + k * 26))} -38 ${f(dir * (0 + k * 20))}
           Q-24 ${f(dir * (2 + k * 12))} -4 6 Z"
        fill="#dc2626"
        stroke="#991b1b"
        stroke-width="1"
      />
    `;
    // Faixas azul e amarela nas asas
    const wingDetail = (dir: number) => `
      <path
        d="M-16 ${f(dir * (-14 + k * 22))} Q-32 ${f(dir * (-16 + k * 26))} -44 ${f(dir * (-10 + k * 28))}"
        stroke="#3b82f6" stroke-width="4" fill="none" stroke-linecap="round"
      />
      <path
        d="M-20 ${f(dir * (-10 + k * 18))} Q-34 ${f(dir * (-12 + k * 22))} -44 ${f(dir * (-6 + k * 24))}"
        stroke="#fbbf24" stroke-width="3.5" fill="none" stroke-linecap="round"
      />
    `;

    return G(0, 0, 0, o.s, o.s,
      wingUp(1) + wingDetail(1) +
      `<path d="M-20 0 L-42 ${f(4 + k * 3)} L-20 7 Z" fill="#b91c1c"/>` +
      ell(0, 0, 11, 6, "#dc2626") +
      ell(4, 2, 7, 4, "#fef3c7") +
      circ(11, -2, 5, "#dc2626") +
      `<path d="M15 -2 L24 -1 L15 1 Z" fill="#18181b"/>` +
      circ(12, -3, 1.5, "#18181b") +
      wingUp(-1) + wingDetail(-1)
    );
  }

  // Pousada: arara com longa cauda pendente
  const peck = Math.max(0, sin(o.a * 2.2 + o.ph)) ** 2;
  const bob = Math.max(0, sin(o.a * 4.5 + o.ph)) ** 4 * 4;

  const body = `
    ${line(-2, -8, -2, 0, 2.5, "#7f1d1d")}
    ${line(4, -8, 4, 0, 2.5, "#7f1d1d")}
    <!-- Cauda longa da arara pendente -->
    <path d="M-10 -11 L-30 -5 L-28 -1 L-8 -7 Z" fill="#b91c1c" stroke="#991b1b" stroke-width="0.8"/>
    <path d="M-14 -10 L-38 -2 L-36 2 L-10 -6 Z" fill="#dc2626" stroke="#b91c1c" stroke-width="0.8"/>
    <!-- Faixas azul e amarela na asa dobrada -->
    <path d="M-6 -16 L-22 -12 L-20 -8 L-4 -12 Z" fill="#3b82f6" opacity="0.9"/>
    <path d="M-6 -12 L-18 -9 L-17 -6 L-5 -8 Z" fill="#fbbf24" opacity="0.9"/>
    <!-- Corpo vermelho -->
    <ellipse cx="0" cy="-15" rx="12" ry="9" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
    <ellipse cx="4" cy="-12" rx="8" ry="5" fill="#fef3c7" opacity="0.9"/>
    <g transform="rotate(${f(peck * 35)} 8 -20)">
      <circle cx="10" cy="-23" r="7" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
      <!-- Rosto branco característico da arara -->
      <ellipse cx="12" cy="-22" rx="4.5" ry="4" fill="#fef9f0"/>
      <!-- Bico curvo robusto -->
      <path d="M15 -23 L24 -20 L14 -17 Z" fill="#18181b" stroke="#000" stroke-width="0.8"/>
      <path d="M15 -20 Q20 -19 22 -20" stroke="#333" stroke-width="1" fill="none"/>
      <circle cx="11" cy="-24" r="1.4" fill="#18181b"/>
      <circle cx="11.5" cy="-24.5" r="0.5" fill="#ffffff"/>
    </g>
  `;

  return G(0, -bob, 0, o.s, o.s, body) + ell(0, 1, 11 * o.s, 3 * o.s, "rgba(0,0,0,.2)");
}

/** PÁSSARO AZUL / COTINGA (Cotinga cayana) — Azul elétrico, pequeno e vivaz */
function passaroAzul(o: D & { flying: boolean }, _col: string): string {
  if (o.flying) {
    const w = o.a * 14 + o.ph;
    const k = sin(w);

    const wing = (dir: number) => `
      <path
        d="M-2 -1 Q-9 ${f(dir * (-18 - k * 10))} 8 ${f(dir * (-16 - k * 10) - 1)} Q4 -6 -2 -1 Z"
        fill="#2563eb"
        stroke="#1d4ed8"
        stroke-width="0.8"
      />
    `;

    return G(0, 0, 0, o.s, o.s,
      wing(1) +
      `<path d="M-9 1 L-20 ${f(3 + k * 2)} L-9 5 Z" fill="#1d4ed8"/>` +
      ell(0, 0, 9, 5.5, "#3b82f6") +
      circ(9, -2, 4, "#2563eb") +
      `<path d="M13 -2 L19 -1 L13 0 Z" fill="#1e3a5f"/>` +
      circ(10, -3, 1.1, "#18181b") +
      wing(-1)
    );
  }

  // Pousado: exibindo plumagem azul
  const peck = Math.max(0, sin(o.a * 2.6 + o.ph)) ** 3;
  const hop = Math.max(0, sin(o.a * 5 + o.ph)) ** 6 * 3;

  const body = `
    ${line(-2, -8, -2, 0, 1.8, "#1d4ed8")}
    ${line(4, -8, 4, 0, 1.8, "#1d4ed8")}
    <path d="M-9 -12 L-20 -8 L-9 -8 Z" fill="#1d4ed8" stroke="#1e40af" stroke-width="0.8"/>
    <ellipse cx="0" cy="-13" rx="10" ry="7.5" fill="#3b82f6" stroke="#2563eb" stroke-width="1"/>
    <!-- Barriga mais clara — cor púrpura do cotinga macho -->
    <ellipse cx="3" cy="-10" rx="6" ry="4" fill="#6366f1" opacity="0.8"/>
    <g transform="rotate(${f(peck * 40)} 7 -17)">
      <circle cx="10" cy="-20" r="5.5" fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
      <path d="M15 -20 L21 -19 L15 -18 Z" fill="#374151"/>
      <circle cx="11.5" cy="-21.5" r="1.2" fill="#18181b"/>
      <circle cx="12" cy="-22" r="0.5" fill="#ffffff"/>
    </g>
  `;

  return G(0, -hop, 0, o.s, o.s, body) + ell(0, 1, 9 * o.s, 3 * o.s, "rgba(0,0,0,.2)");
}

/* ==================================================================
   MUNDO E COMPORTAMENTO DA FAUNA
   ================================================================== */

export interface Wildlife {
  critters: Critter[];
  step: (dt: number, W: number, H: number) => void;
  render: (W: number, H: number) => string;
  hit: (px: number, py: number, W: number, H: number) => Critter | null;
  poke: (c: Critter) => void;
  find: (animalId: string) => Critter | undefined;
  position: (c: Critter, W: number, H: number) => { x: number; y: number };
  setWeather: (weather: TrailWeather) => void;
  /** Posição (0..1) do aluno no cenário: a vida selvagem acontece em volta dele, na mata. */
  setFocus: (x: number, y: number) => void;
}

const TARGET_COUNT = 8;
/** O cenário é uma trilha alta (1000x2200): só há vida em uma faixa vertical em torno do aluno. */
const WINDOW_HALF = 0.14;
const FAR_LIMIT = WINDOW_HALF + 0.08;

function habitatFor(animalId: string): TrailHabitat {
  return animalId === "esquilo" || animalId === "tucano" || animalId === "passaroAzul" || animalId === "araraVermelha" ? "tree" : "grass";
}

export function createWildlife(initialWeather: TrailWeather = "sunny"): Wildlife {
  const critters: Critter[] = [];
  const pending: { delay: number; kind?: Kind }[] = [];
  let weather = initialWeather;
  let uid = 0,
    swapTimer = 9;
  let focusX = 0.5,
    focusY = 0.9;

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
    hasTarget: false,
    tx: 0,
    ty: 0,
    timer: 1,
    clk: rnd() * 10,
    cm: rnd() * 10,
    ph: rnd() * 6.28,
    spot: -1,
    landed: false,
    pause: 3,
    react: 0,
    age: 0,
    orbit: rnd() * 6.28,
    enter: 0,
    cxOff: 0,
    color: COLORS[uid % COLORS.length],
  });

  const inWindow = (i: number) => Math.abs(TRAIL_ROAM_SPOTS[i].y / 100 - focusY) <= WINDOW_HALF;
  const freeSpots = (animalId?: string) => TRAIL_ROAM_SPOTS
    .map((_, i) => i)
    .filter(inWindow)
    .filter((i) => !critters.some((c) => c.spot === i))
    .filter((i) => !animalId || TRAIL_ROAM_SPOTS[i].habitat === habitatFor(animalId));
  /** Escolhe um ponto livre da mata; com `from`, prefere os mais próximos (o bicho passeia, não teleporta). */
  const pickFree = (animalId?: string, from?: { x: number; y: number }): number => {
    let fr = freeSpots(animalId);
    if (fr.length === 0 && animalId && animalId !== "esquilo") fr = freeSpots();
    if (fr.length === 0) return -1;
    if (from) {
      const dist = (i: number) => Math.hypot((TRAIL_ROAM_SPOTS[i].x / 100 - from.x) * 1000, (TRAIL_ROAM_SPOTS[i].y / 100 - from.y) * 2200);
      const sorted = fr.filter((i) => dist(i) > 40).sort((a, b) => dist(a) - dist(b));
      if (sorted.length) return sorted[Math.floor(rnd() * Math.min(5, sorted.length))];
    }
    return fr[Math.floor(rnd() * fr.length)];
  };
  /** Pássaros cruzam o ar sobre a mata inteira; a águia plana em amplos círculos. */
  const randRegion = (animalId?: string) => {
    if (animalId === "aguia") return { x: 0.05 + rnd() * 0.9, y: clamp(focusY + (rnd() - 0.6) * 0.14, 0.02, 0.97) };
    const near = freeSpots();
    const sp = near.length ? TRAIL_ROAM_SPOTS[near[Math.floor(rnd() * near.length)]] : { x: focusX * 100, y: focusY * 100 };
    return { x: clamp(sp.x / 100 + (rnd() - 0.5) * 0.04, 0.03, 0.97), y: clamp(sp.y / 100 + (rnd() - 0.5) * 0.02, 0.02, 0.98) };
  };

  function weatherPool() {
    const allowed = new Set(WEATHER_ANIMAL_IDS[weather]);
    return ROAMING_ANIMAL_POOL.filter((animal) => allowed.has(animal.id));
  }

  function spawn(kind?: Kind, initial = false, preferredId?: string) {
    const visible = new Set(critters.map((c) => c.animal.id));
    const pool = weatherPool();
    let cand = pool.filter((a) => !visible.has(a.id) && (!kind || specOf(a.id).kind === kind) && (!preferredId || a.id === preferredId));
    if (cand.length === 0 && !preferredId) cand = pool.filter((a) => !visible.has(a.id));
    if (cand.length === 0) return;
    const c = mk(cand[Math.floor(rnd() * cand.length)]);
    if (c.spec.kind === "walk") {
      const sp = pickFree(c.animal.id);
      if (sp < 0) return;
      c.spot = sp;
      const P = TRAIL_ROAM_SPOTS[sp];
      if (initial) {
        c.x = P.x / 100;
        c.y = P.y / 100;
        c.timer = rnd() * 3;
        c.state = "idle";
      } else {
        c.x = rnd() > 0.5 ? -0.05 : 1.05;
        c.y = P.y / 100;
        c.state = "move";
        c.hasTarget = true;
        c.tx = P.x / 100;
        c.ty = P.y / 100;
        c.heading = Math.atan2(c.ty - c.y, c.tx - c.x);
      }
    } else if (c.animal.id === "aguia") {
      c.enter = initial ? 1 : 0;
    } else {
      const R = randRegion(c.animal.id);
      if (initial) {
        c.x = R.x;
        c.y = R.y;
        c.z = 30;
        // Tucano e araraVermelha podem pousar em galhos
        if (c.animal.id === "tucano" || c.animal.id === "araraVermelha") {
          const sp = pickFree(c.animal.id);
          if (sp >= 0) {
            c.spot = sp;
            c.x = TRAIL_ROAM_SPOTS[sp].x / 100;
            c.y = TRAIL_ROAM_SPOTS[sp].y / 100;
            c.z = 0;
            c.landed = true;
            c.state = "idle";
            c.timer = 2 + rnd() * 3;
          }
        }
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
    while (critters.length < Math.min(TARGET_COUNT, weatherPool().length)) spawn(undefined, true);
  }

  populate();

  function setWeather(nextWeather: TrailWeather) {
    if (weather === nextWeather) return;
    weather = nextWeather;
    pending.length = 0;
    const allowed = new Set(WEATHER_ANIMAL_IDS[weather]);
    for (let i = critters.length - 1; i >= 0; i--) {
      if (!allowed.has(critters[i].animal.id)) critters.splice(i, 1);
      else critters[i].spec = weatherAdjustedSpec(critters[i].animal.id, weather);
    }
    populate();
  }

  function setFocus(x: number, y: number) {
    const jumped = Math.abs(y - focusY) > WINDOW_HALF * 0.9;
    focusX = x;
    focusY = y;
    if (jumped) {
      critters.length = 0;
      pending.length = 0;
      populate();
    }
  }

  function sendAway(c: Critter) {
    c.state = "leaving";
    c.spot = -1;
    c.hasTarget = true;
    c.landed = false;
    if (c.spec.kind === "walk") {
      c.tx = c.x < 0.5 ? -0.15 : 1.15;
      c.ty = c.y + (rnd() - 0.5) * 0.03;
    } else {
      const left = c.x < 0.5;
      c.tx = left ? -0.15 : 1.15;
      c.ty = c.y + (rnd() - 0.5) * 0.3;
      c.vz = 20;
    }
  }

  function updateWalker(c: Critter, dt: number, W: number, H: number) {
    c.clk += dt;
    if (c.state === "idle") {
      c.v = approach(c.v, 0, 180 * dt);
      c.timer -= dt;
      if (c.timer <= 0) {
        const sp = pickFree(c.animal.id, c);
        if (sp >= 0) {
          c.spot = sp;
          c.tx = TRAIL_ROAM_SPOTS[sp].x / 100;
          c.ty = TRAIL_ROAM_SPOTS[sp].y / 100;
          c.hasTarget = true;
          c.state = "move";
        } else {
          c.timer = 1.5 + rnd() * 2;
        }
      }
      return;
    }

    const tx = c.tx * W,
      ty = c.ty * H;
    const curX = c.x * W,
      curY = c.y * H;
    const dx = tx - curX,
      dy = ty - curY;
    const dist = Math.hypot(dx, dy);

    if (dist < 12) {
      if (c.state === "leaving") return;
      c.state = "idle";
      c.hasTarget = false;
      c.timer = c.spec.idle[0] + rnd() * c.spec.idle[1];
      c.v = 0;
      return;
    }

    const targetHeading = Math.atan2(dy, dx);
    c.heading += wrap(targetHeading - c.heading) * Math.min(1, c.spec.turn * dt);

    const distFactor = Math.min(1, dist / 40);
    const baseSpeed = c.spec.speed * (W / 1000) * (0.35 + 0.65 * distFactor);

    let currentSpeed = baseSpeed;
    if (c.spec.hop) {
      const hopCycle = Math.max(0, sin(c.clk * c.spec.gait * 0.9 + c.ph));
      currentSpeed = baseSpeed * (0.15 + 1.65 * (hopCycle ** 2));
    }

    c.v = approach(c.v, currentSpeed, 240 * dt);
    c.cm += (c.v / (baseSpeed || 1)) * dt;
    c.x += (cos(c.heading) * c.v * dt) / W;
    c.y += (sin(c.heading) * c.v * dt) / H;

    const faceDir = cos(c.heading) >= 0 ? 1 : -1;
    c.face = approach(c.face, faceDir, 4.5 * dt);
  }

  function updateFlyer(c: Critter, dt: number, W: number, H: number) {
    c.clk += dt;
    if (c.animal.id === "aguia") {
      // Águia planando majestosa em correntes térmicas
      c.orbit += dt * 0.28;
      c.enter = approach(c.enter, 1, 0.2 * dt);
      const cx = 0.5 + sin(c.orbit) * 0.34;
      const cy = clamp(focusY - 0.05 + cos(c.orbit * 0.75) * 0.05, 0.02, 0.97);
      c.x = cx;
      c.y = cy;
      c.z = 85 + sin(c.orbit * 1.8) * 15;
      c.face = cos(c.orbit) > 0 ? 1 : -1;
      return;
    }

    let X = c.x * W,
      Y = c.y * H;
    const S = W / 1000;
    let cx = 0,
      cy = 0;

    if (c.state === "leaving") {
      c.landed = false;
      const tx = c.tx * W,
        ty = c.ty * H;
      const dx = tx - X,
        dy = ty - Y;
      const h = Math.atan2(dy, dx);
      c.heading += wrap(h - c.heading) * Math.min(1, 2.5 * dt);
      const sp = c.spec.speed * S;
      X += cos(c.heading) * sp * dt;
      Y += sin(c.heading) * sp * dt;
      c.z = approach(c.z, 75, 22 * dt);
      cx = cos(c.heading);
    } else if (c.landed) {
      c.v = 0;
      c.z = 0;
      c.timer -= dt;
      if (c.timer <= 0) {
        c.landed = false;
        c.spot = -1;
        const R = randRegion(c.animal.id);
        c.tx = R.x;
        c.ty = R.y;
        c.timer = 4 + rnd() * 5;
      }
    } else {
      c.timer -= dt;
      if (c.timer <= 0) {
        // Tucano e araraVermelha pousam com mais frequência
        const landChance = (c.animal.id === "tucano" || c.animal.id === "araraVermelha") ? 0.5 : 0.3;
        if (rnd() < landChance) {
          const sp = pickFree(c.animal.id);
          if (sp >= 0) {
            c.spot = sp;
            c.tx = TRAIL_ROAM_SPOTS[sp].x / 100;
            c.ty = TRAIL_ROAM_SPOTS[sp].y / 100;
            c.timer = 8;
          }
        } else {
          const R = randRegion(c.animal.id);
          c.tx = R.x;
          c.ty = R.y;
          c.timer = 3 + rnd() * 4;
        }
      }

      const tx = c.tx * W,
        ty = c.ty * H;
      const dx = tx - X,
        dy = ty - Y;
      const dist = Math.hypot(dx, dy);

      if (c.spot >= 0 && dist < 14 * S) {
        c.landed = true;
        c.z = 0;
        c.timer = 2.5 + rnd() * 4;
      } else {
        const th = Math.atan2(dy, dx);
        c.heading += wrap(th - c.heading) * Math.min(1, c.spec.turn * dt);
        const wander = sin(c.clk * 1.8 + c.ph) * 0.28;
        const sp = c.spec.speed * S;
        cx = cos(c.heading + wander) * sp;
        cy = sin(c.heading + wander) * sp;
        X += cx * dt;
        Y += cy * dt;
        const targetZ = c.spot >= 0 && dist < 120 * S ? 4 : 28 + sin(c.clk * 1.6 + c.ph) * 10;
        c.z = approach(c.z, targetZ, 35 * dt);
      }
    }

    if (!c.landed && Math.abs(cx) > 0.1) c.face = approach(c.face, Math.sign(cx), 6 * dt);
    c.x = X / W;
    c.y = Y / H;
  }

  function step(dt: number, W: number, H: number) {
    if (!(W > 0 && H > 0)) return;
    dt = Math.min(dt, 0.05);
    for (const c of critters) {
      c.age += dt;
      if (c.react > 0) c.react = Math.max(0, c.react - dt);
      if (c.spec.kind === "walk") updateWalker(c, dt, W, H);
      else updateFlyer(c, dt, W, H);
    }
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      if (c.age > 2 && c.animal.id !== "aguia" && Math.abs(c.y - focusY) > FAR_LIMIT) {
        critters.splice(i, 1);
        continue;
      }
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
      if (pending[i].delay <= 0) {
        spawn(pending[i].kind);
        pending.splice(i, 1);
      }
    }
    if (critters.filter((c) => c.state !== "leaving").length + pending.length < TARGET_COUNT) pending.push({ delay: 1 });
  }

  function render(W: number, H: number): string {
    const S = W / 1000;
    const order = [...critters].sort((a, b) => a.y - b.y);
    let out = "";
    for (const c of order) {
      const depth = 0.75 + 0.5 * clamp(c.y, 0, 1.1);
      const s = S * c.spec.scale * depth;
      const X = c.x * W,
        Y = c.y * H,
        id = c.animal.id;
      const moving = c.state !== "idle" && c.v > 1;
      const d: D = { s, m: c.cm, a: c.clk, moving, ph: c.ph };
      const ro = c.react > 0 ? sin((c.react / 0.7) * PI) * 14 * S : 0;
      const br = 1 + sin(c.clk * 2.2 + c.ph) * 0.012;
      let inner = "";

      if (c.spec.kind === "walk") {
        switch (id) {
          case "esquilo":
            inner = realEsquilo(d);
            break;
          case "coelho":
            inner = realCoelho(d);
            break;
          case "macaco":
            inner = macaco(d);
            break;
          case "cervo":
            inner = realCervo(d);
            break;
          case "tucano":
            inner = tucano(d);
            break;
          default:
            inner = realCoelho(d);
        }
        out += G(X, Y - ro, 0, c.face, br, inner);
      } else {
        const flying = !c.landed;
        const alt = c.z;
        if (id === "aguia") {
          out += G(X, Y, c.face * 0 + 0, c.face, 1, G(0, 0, clamp(sin(c.orbit) * 6, -8, 8), 1, 1, aguia(d)));
          continue;
        }
        const sh = clamp(1 - alt / (140 * S), 0.25, 1);
        out += ell(X, Y + 1, 9 * s * sh, 2.4 * s * sh, `rgba(0,0,0,${f(0.2 * sh)})`);

        if (id === "araraVermelha") {
          inner = araraVermelha({ ...d, flying }, c.color);
        } else {
          inner = passaroAzul({ ...d, flying }, c.color);
        }
        out += G(X, Y - alt * S - ro, 0, c.face, 1, inner);
      }
    }
    return out;
  }

  function hit(px: number, py: number, W: number, H: number): Critter | null {
    const S = W / 1000;
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i];
      const cx = c.x * W,
        cy = c.y * H - (c.spec.kind === "fly" ? c.z * S : 0);
      const rad = 28 * S * c.spec.scale;
      if (Math.hypot(px - cx, py - cy) <= rad) return c;
    }
    return null;
  }

  function poke(c: Critter) {
    c.react = 0.7;
    if (c.animal.id === "esquilo") {
      const branch = pickFree("esquilo");
      if (branch >= 0) {
        c.spot = branch;
        c.tx = TRAIL_ROAM_SPOTS[branch].x / 100;
        c.ty = TRAIL_ROAM_SPOTS[branch].y / 100;
        c.state = "move";
        c.hasTarget = true;
        return;
      }
    }
    if (["cervo", "coelho", "esquilo", "aguia"].includes(c.animal.id)) {
      sendAway(c);
      return;
    }
    if (c.landed) {
      c.landed = false;
      c.timer = 0;
    }
  }

  function find(animalId: string): Critter | undefined {
    return critters.find((c) => c.animal.id === animalId && c.state !== "leaving");
  }

  function position(c: Critter, W: number, H: number): { x: number; y: number } {
    const S = W / 1000;
    const yOff = c.spec.kind === "fly" ? c.z * S : 0;
    return { x: c.x * W, y: c.y * H - yOff };
  }

  return { critters, step, render, hit, poke, find, position, setWeather, setFocus };
}
