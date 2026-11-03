/**
 * Vida selvagem ultra-realista da Trilha Curiosa.
 *
 * Animais com anatomia fidedigna, sombreamento volumétrico, pelagens e plumagens detalhadas,
 * proporções naturais e movimentos orgânicos próprios de cada espécie alpina:
 *
 *  - Chamois (Camurça dos Alpes): chifres em gancho característicos, máscara facial preta e branca,
 *    peito musculoso, patas ágeis sobre as rochas e respiração de vapor na neve.
 *  - Águia Real (L'Aigle royal): grande envergadura, asas com pontas recortadas em penas digitadas,
 *    nuca dourada, bico adunco âmbar e voo planado majestoso.
 *  - Cervo Nobre (Le Cerf): galhada ramificada imponente, postura nobre e pastagem elegante.
 *  - Raposa Vermelha (Le Renard roux): focinho fino, orelhas alertas com verso preto, cauda espessa com ponta branca.
 *  - Esquilo dos Bosques (L'Écureuil): cauda felpuda em curva S, orelhas com tufos de pelo alpino e patinhas atentas.
 *  - Lebre/Coelho Alpino: orelhas longas com pontas pretas, pelagem fofa e pulos ágeis.
 *  - Sapo da Chuva: pele brilhante verde-oliva com manchas, olho dourado e saco vocal inflando ritmadamente.
 *  - Ouriço, Tartaruga, Pássaro Cantor, Borboleta Apolo dos Alpes e Abelha Silvestre.
 */
import { G, ell, circ, line, limb, f, sin, cos, clamp, PI } from "@/lib/storySceneLife";
import { TRAIL_ROAM_SPOTS, ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";

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
  squirrel: { kind: "walk", scale: 1.05, speed: 78, gait: 10, hop: true, turn: 6, idle: [1.2, 3] },
  rabbit: { kind: "walk", scale: 1.1, speed: 65, gait: 9, hop: true, turn: 5, idle: [2, 4] },
  frog: { kind: "walk", scale: 1.15, speed: 46, gait: 6, hop: true, turn: 5, idle: [2, 4] },
  snail: { kind: "walk", scale: 1.0, speed: 6, gait: 2, turn: 2, idle: [3, 5] },
  chamois: { kind: "walk", scale: 1.1, speed: 42, gait: 7, turn: 3, idle: [3, 5] },
  deer: { kind: "walk", scale: 0.9, speed: 38, gait: 5, turn: 2.5, idle: [3, 5] },
  fox: { kind: "walk", scale: 0.92, speed: 68, gait: 10, turn: 4, idle: [2, 3] },
  hedgehog: { kind: "walk", scale: 1.1, speed: 22, gait: 9, turn: 3, idle: [2, 4] },
  turtle: { kind: "walk", scale: 1.1, speed: 12, gait: 4, turn: 2, idle: [3, 5] },
  bird: { kind: "fly", scale: 1.5, speed: 90, gait: 16, turn: 5, idle: [3, 4] },
  eagle: { kind: "fly", scale: 1.25, speed: 65, gait: 1.8, turn: 1, idle: [0, 0] },
  butterfly: { kind: "fly", scale: 1.7, speed: 42, gait: 12, turn: 3.5, idle: [2, 3] },
  bee: { kind: "fly", scale: 1.5, speed: 75, gait: 40, turn: 7, idle: [0.8, 1.2] },
};
const FALLBACK: Spec = SPECIES.rabbit;
const specOf = (id: string): Spec => SPECIES[id] ?? FALLBACK;

const WEATHER_ANIMAL_IDS: Record<TrailWeather, readonly string[]> = {
  sunny: ["squirrel", "rabbit", "bird", "deer", "fox", "chamois", "eagle", "butterfly", "bee"],
  rain: ["frog", "snail", "bird", "deer", "fox", "squirrel", "rabbit"],
  snow: ["chamois", "eagle", "fox", "rabbit", "deer", "squirrel", "bird"],
};

const WEATHER_HIGHLIGHTS: Record<TrailWeather, readonly string[]> = {
  sunny: ["butterfly", "bee"],
  rain: ["frog", "snail"],
  snow: ["chamois", "fox"],
};

function weatherAdjustedSpec(id: string, weather: TrailWeather): Spec {
  const spec = specOf(id);
  let speedFactor = 1;
  let restFactor = 1;

  if (weather === "rain") {
    if (id === "frog" || id === "snail") {
      speedFactor = id === "frog" ? 1.1 : 1;
      restFactor = 0.8;
    } else {
      speedFactor = 0.65;
      restFactor = 1.5;
    }
  } else if (weather === "snow") {
    if (id === "chamois" || id === "fox") {
      speedFactor = 0.9;
      restFactor = 1.1;
    } else if (id === "rabbit") {
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
   DESENHOS REALISTAS DOS ANIMAIS ALPINOS (SVG detalhado)
   ================================================================== */

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

/** CAMURÇA DOS ALPES (Rupicapra rupicapra / Chamois) */
function chamois(o: D): string {
  const w = o.m * 7 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const neckAlert = o.moving ? 0 : sin(o.a * 1.5 + o.ph) * 4;

  // Pernas fortes com cascos fendidos
  const legs = [
    [-18, k],
    [-10, -k],
    [12, -k],
    [20, k],
  ]
    .map(([lx, a], i) => {
      const col = i % 2 === 0 ? "#78350f" : "#54280b";
      return (
        limb(lx, -28, 29, (a as number) * 0.65, 4.5, col) +
        `<rect x="${f(lx - 2)}" y="-2" width="4.5" height="3.5" rx="1" fill="#18181b" />`
      );
    })
    .join("");

  // Cabeça e chifres em gancho característicos da camurça
  const head = `
    <g transform="rotate(${f(neckAlert)} 20 -48)">
      <!-- Pescoço atlético -->
      <line x1="16" y1="-42" x2="30" y2="-62" stroke="#78350f" stroke-width="11" stroke-linecap="round" />
      <line x1="20" y1="-44" x2="32" y2="-62" stroke="#d97706" stroke-width="6" stroke-linecap="round" opacity="0.6" />
      <!-- Cabeça com máscara facial preta e branca -->
      <ellipse cx="36" cy="-65" rx="10" ry="6.5" fill="#fef3c7" transform="rotate(-18 36 -65)" stroke="#78350f" stroke-width="1" />
      <!-- Faixa escura da máscara facial característica do Chamois -->
      <path d="M28 -68 L42 -62" stroke="#291103" stroke-width="3.5" stroke-linecap="round" />
      <!-- Focinho e narinas -->
      <ellipse cx="44" cy="-62" rx="3.2" ry="2.4" fill="#291103" />
      <!-- Olho escuro alerta -->
      <circle cx="37" cy="-67" r="1.8" fill="#18181b" />
      <circle cx="37.5" cy="-67.5" r="0.6" fill="#ffffff" />
      <!-- Chifres pretos recurvados em gancho no topo -->
      <path d="M30 -70 Q28 -86 35 -87 Q38 -87 37 -82" stroke="#18181b" stroke-width="2.6" fill="none" stroke-linecap="round" />
      <path d="M34 -71 Q32 -85 39 -85 Q42 -85 41 -80" stroke="#291103" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <!-- Orelha alerta -->
      <polygon points="27,-70 23,-78 29,-74" fill="#78350f" stroke="#291103" stroke-width="0.8" />
      <!-- Vapor da respiração no ar frio -->
      <circle cx="48" cy="-60" r="2.5" fill="#ffffff" opacity="0.6" />
      <circle cx="53" cy="-58" r="3.5" fill="#f1f5f9" opacity="0.4" />
    </g>
  `;

  // Corpo musculoso castanho com dorso sombreado
  const body = `
    ${legs}
    <ellipse cx="0" cy="-39" rx="26" ry="12" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
    <path d="M-22 -44 Q0 -48 22 -42" stroke="#451a03" stroke-width="4" fill="none" opacity="0.75" />
    <ellipse cx="-4" cy="-41" rx="16" ry="7" fill="#92400e" />
    ${head}
    <!-- Cauda curta preta -->
    <ellipse cx="-25" cy="-43" rx="4.5" ry="3" fill="#18181b" transform="rotate(25 -25 -43)" />
  `;

  return G(0, -Math.abs(k) * 2.2, 0, o.s, o.s, body) + ell(0, 1, 28 * o.s, 5 * o.s, "rgba(0,0,0,.22)");
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

/** SAPO DA CHUVA (Rana temporaria alpina) */
function frog(o: D): string {
  const w = o.m * 6 + o.ph;
  const j = o.moving ? Math.abs(sin(w)) : 0;
  // Saco vocal inflando e desinflando ao coaxar na chuva
  const croak = (sin(o.a * 4 + o.ph) + 1) / 2;

  const body = `
    <!-- Pernas traseiras dobradas em Z com membranas -->
    <path d="M-10 -4 Q${f(-22 - j * 5)} ${f(-4 - j * 7)} ${f(-16 - j * 9)} 2 L-5 3 Z" fill="#15803d" stroke="#14532d" stroke-width="1" />
    <!-- Corpo verde-oliva brilhante com manchas escuras -->
    <ellipse cx="0" cy="-9" rx="14" ry="${f(9 - j * 1.5)}" fill="#16a34a" stroke="#15803d" stroke-width="1.2" />
    <circle cx="-3" cy="-11" r="2.2" fill="#14532d" opacity="0.6" />
    <circle cx="4" cy="-12" r="2" fill="#14532d" opacity="0.6" />
    <!-- Barriga amarelada -->
    <ellipse cx="3" cy="-6" rx="10" ry="4.5" fill="#fef08a" opacity="0.9" />
    <!-- Cabeça com boca larga -->
    <ellipse cx="12" cy="-13" rx="9" ry="7" fill="#22c55e" stroke="#15803d" stroke-width="1" />
    <!-- Saco vocal inflando sob o queixo -->
    <ellipse cx="17" cy="-9" rx="${f(3.5 + croak * 3.5)}" ry="${f(2.5 + croak * 3)}" fill="#fef9c3" opacity="0.85" />
    <line x1="13" y1="-11" x2="22" y2="-11" stroke="#14532d" stroke-width="1.4" stroke-linecap="round" />
    <!-- Olhos saltados dourados com pupila horizontal -->
    <circle cx="12" cy="-19" r="4" fill="#facc15" stroke="#ca8a04" stroke-width="1" />
    <ellipse cx="12" cy="-19" rx="2.5" ry="1.2" fill="#18181b" />
    <circle cx="17" cy="-18" r="3.5" fill="#facc15" stroke="#ca8a04" stroke-width="1" />
    <ellipse cx="17" cy="-18" rx="2.2" ry="1.1" fill="#18181b" />
  `;

  return G(0, -j * 17 * o.s, j * -10, o.s, o.s, body) + ell(0, 1, 15 * o.s * (1 - j * 0.25), 3.5 * o.s, "rgba(0,0,0,.2)");
}

/** CARACOL DA CHUVA (Helix pomatia) */
function snail(o: D): string {
  const st = o.moving ? sin(o.a * 2.2) * 2.5 : 0;
  const eye = sin(o.a * 1.5 + o.ph) * 2;

  const body = `
    <!-- Corpo rastejante com pé musculoso -->
    <path
      d="M-20 0 Q-15 -7 ${f(0 + st)} -6 Q${f(15 + st)} -8 ${f(22 + st)} -6 Q${f(26 + st)} -2 ${f(22 + st)} 0 Z"
      fill="#d4d4d8"
      stroke="#a1a1aa"
      stroke-width="1"
    />
    <!-- Tentáculos ópticos com olhos na ponta -->
    <line x1="${f(20 + st)}" y1="-7" x2="${f(22 + st + eye)}" y2="-18" stroke="#a1a1aa" stroke-width="1.8" stroke-linecap="round" />
    <line x1="${f(23 + st)}" y1="-6" x2="${f(27 + st + eye)}" y2="-15" stroke="#a1a1aa" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="${f(22 + st + eye)}" cy="-19" r="1.8" fill="#18181b" />
    <circle cx="${f(27 + st + eye)}" cy="-16" r="1.8" fill="#18181b" />
    <!-- Concha espiral detalhada com estrias de crescimento -->
    <circle cx="-3" cy="-16" r="13" fill="#b45309" stroke="#78350f" stroke-width="1.5" />
    <circle cx="-3" cy="-16" r="9.5" fill="#d97706" stroke="#92400e" stroke-width="1" />
    <circle cx="-3" cy="-16" r="6" fill="#f59e0b" stroke="#b45309" stroke-width="1" />
    <circle cx="-3" cy="-16" r="3" fill="#fef3c7" />
  `;

  return G(0, 0, 0, o.s, o.s, body) + ell(0, 1, 22 * o.s, 3 * o.s, "rgba(0,0,0,.18)");
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

/** TARTARUGA (Testudo hermanni) */
function turtle(o: D): string {
  const w = o.m * 4 + o.ph;
  const k = o.moving ? sin(w) : 0;
  const neck = sin(o.a * 1.6 + o.ph) * 1.8;

  const body = `
    <!-- Patas escamosas com unhas -->
    <ellipse cx="${f(-15 + k * 2)}" cy="-3" rx="5" ry="3.5" fill="#65a30d" stroke="#4d7c0f" stroke-width="0.8" />
    <ellipse cx="${f(11 - k * 2)}" cy="-3" rx="5" ry="3.5" fill="#65a30d" stroke="#4d7c0f" stroke-width="0.8" />
    <!-- Cauda curta -->
    <polygon points="-18,-8 -26,-6 -18,-4" fill="#65a30d" />
    <!-- Carapaça convexa com placas hexagonais -->
    <ellipse cx="0" cy="-12" rx="19" ry="11" fill="#4d7c0f" stroke="#365314" stroke-width="1.5" />
    <ellipse cx="0" cy="-13" rx="13" ry="7.5" fill="#84cc16" opacity="0.85" />
    <!-- Linhas das placas da carapaça -->
    <line x1="-5" y1="-19" x2="-5" y2="-7" stroke="#365314" stroke-width="1.5" />
    <line x1="5" y1="-19" x2="5" y2="-7" stroke="#365314" stroke-width="1.5" />
    <line x1="-12" y1="-13" x2="12" y2="-13" stroke="#365314" stroke-width="1.5" />
    <!-- Cabeça com bico córneo e olho -->
    <ellipse cx="${f(22 + neck)}" cy="-10" rx="7" ry="5" fill="#65a30d" stroke="#4d7c0f" stroke-width="1" />
    <circle cx="${f(25 + neck)}" cy="-11.5" r="1.4" fill="#18181b" />
    <circle cx="${f(25.4 + neck)}" cy="-11.9" r="0.5" fill="#ffffff" />
  `;

  return G(0, 0, 0, o.s, o.s, body) + ell(0, 1, 21 * o.s, 3.5 * o.s, "rgba(0,0,0,.18)");
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

/** BORBOLETA APOLO DOS ALPES (Parnassius apollo) */
function flutter(o: D & { landed: boolean }, col: string): string {
  const fl = o.landed
    ? 0.35 + 0.65 * Math.abs(sin(o.a * 2.2 + o.ph))
    : 0.2 + 0.8 * Math.abs(sin(o.a * (12 + 4 * sin(o.a * 0.5)) + o.ph));

  const body = `
    <!-- Asas brancas translúcidas da borboleta alpina Apolo -->
    <ellipse cx="${f(-6 * fl)}" cy="-4" rx="${f(7.5 * fl)}" ry="9" fill="#f8fafc" stroke="#334155" stroke-width="1" />
    <ellipse cx="${f(6 * fl)}" cy="-4" rx="${f(7.5 * fl)}" ry="9" fill="#f8fafc" stroke="#334155" stroke-width="1" />
    <!-- Ocelos vermelhos característicos da Parnassius Apollo -->
    <circle cx="${f(-6 * fl)}" cy="-4" r="${f(2.4 * fl)}" fill="#dc2626" stroke="#18181b" stroke-width="0.8" />
    <circle cx="${f(-6 * fl)}" cy="-4" r="${f(0.8 * fl)}" fill="#ffffff" />
    <circle cx="${f(6 * fl)}" cy="-4" r="${f(2.4 * fl)}" fill="#dc2626" stroke="#18181b" stroke-width="0.8" />
    <circle cx="${f(6 * fl)}" cy="-4" r="${f(0.8 * fl)}" fill="#ffffff" />
    <!-- Asas inferiores menores -->
    <ellipse cx="${f(-4.5 * fl)}" cy="6" rx="${f(5.5 * fl)}" ry="6.5" fill="#f1f5f9" opacity="0.9" stroke="#475569" stroke-width="0.8" />
    <ellipse cx="${f(4.5 * fl)}" cy="6" rx="${f(5.5 * fl)}" ry="6.5" fill="#f1f5f9" opacity="0.9" stroke="#475569" stroke-width="0.8" />
    <!-- Corpo e antenas -->
    <ellipse cx="0" cy="0" rx="1.8" ry="7.5" fill="#1e293b" />
    <line x1="0" y1="-7" x2="-3.5" y2="-13" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round" />
    <line x1="0" y1="-7" x2="3.5" y2="-13" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round" />
  `;

  return G(0, 0, 0, o.s, o.s, body);
}

/** ABELHA SILVESTRE (Apis mellifera) */
function bee(o: D): string {
  const wf = 0.35 + 0.65 * Math.abs(sin(o.a * 60 + o.ph));

  const body = `
    <!-- Asas transparentes vibrando em alta frequência -->
    <ellipse cx="-2.5" cy="-7" rx="5" ry="${f(8.5 * wf)}" fill="rgba(224,242,254,0.75)" stroke="rgba(56,189,248,0.5)" stroke-width="0.8" transform="rotate(-24 -2.5 -7)" />
    <ellipse cx="2.5" cy="-7" rx="5" ry="${f(8.5 * wf)}" fill="rgba(224,242,254,0.6)" stroke="rgba(56,189,248,0.5)" stroke-width="0.8" transform="rotate(-8 2.5 -7)" />
    <!-- Abdômen aveludado listrado preto e amarelo-ouro -->
    <ellipse cx="0" cy="0" rx="9" ry="6" fill="#f59e0b" stroke="#78350f" stroke-width="1" />
    <line x1="-3" y1="-5.5" x2="-3" y2="5.5" stroke="#18181b" stroke-width="2.5" />
    <line x1="3" y1="-5.5" x2="3" y2="5.5" stroke="#18181b" stroke-width="2.5" />
    <!-- Ferrão -->
    <polygon points="-9,0 -13,0.5 -9,1 Z" fill="#18181b" />
    <!-- Cabeça com olhos compostos -->
    <circle cx="9" cy="-0.5" r="4.2" fill="#18181b" />
    <circle cx="10.5" cy="-1.5" r="1.1" fill="#fef08a" />
  `;

  return G(0, 0, 0, o.s, o.s, body);
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
}

const TARGET_COUNT = 6;
const REGION = { x0: 0.42, x1: 0.97, y0: 0.36, y1: 0.92 };

export function createWildlife(initialWeather: TrailWeather = "sunny"): Wildlife {
  const critters: Critter[] = [];
  const pending: { delay: number; kind?: Kind }[] = [];
  let weather = initialWeather;
  let uid = 0,
    swapTimer = 9;

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

  const freeSpots = () => TRAIL_ROAM_SPOTS.map((_, i) => i).filter((i) => !critters.some((c) => c.spot === i));
  const pickFree = (): number => {
    const fr = freeSpots();
    return fr.length ? fr[Math.floor(rnd() * fr.length)] : -1;
  };
  const randRegion = () => ({
    x: REGION.x0 + rnd() * (REGION.x1 - REGION.x0),
    y: REGION.y0 + rnd() * (REGION.y1 - REGION.y0),
  });

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
      const sp = pickFree();
      if (sp < 0) return;
      c.spot = sp;
      const P = TRAIL_ROAM_SPOTS[sp];
      if (initial) {
        c.x = P.x / 100;
        c.y = P.y / 100;
        c.timer = rnd() * 3;
        c.state = "idle";
      } else {
        const fromBottom = P.y > 60;
        c.x = fromBottom ? clamp(P.x / 100 + (rnd() - 0.5) * 0.2, 0.05, 1) : 1.08;
        c.y = fromBottom ? 1.08 : P.y / 100;
        c.state = "move";
        c.hasTarget = true;
        c.tx = P.x / 100;
        c.ty = P.y / 100;
        c.heading = Math.atan2(c.ty - c.y, c.tx - c.x);
      }
    } else if (c.animal.id === "eagle") {
      c.enter = initial ? 1 : 0;
    } else {
      const R = randRegion();
      if (initial) {
        c.x = R.x;
        c.y = R.y;
        c.z = 30;
        if (c.animal.id === "bird") {
          const sp = pickFree();
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
        c.y = REGION.y0 + rnd() * 0.4;
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
    while (critters.length < TARGET_COUNT) spawn(undefined, true);
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

  function sendAway(c: Critter) {
    c.state = "leaving";
    c.spot = -1;
    c.hasTarget = true;
    c.landed = false;
    if (c.spec.kind === "walk") {
      const goBottom = c.y > 0.65;
      c.tx = c.x + (rnd() - 0.5) * 0.4;
      c.ty = goBottom ? 1.15 : c.y + 0.1;
      if (!goBottom) c.tx = 1.15;
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
        const sp = pickFree();
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

    // Curva suave em direção ao alvo com aceleração orgânica
    const targetHeading = Math.atan2(dy, dx);
    c.heading += wrap(targetHeading - c.heading) * Math.min(1, c.spec.turn * dt);
    
    // Desaceleração suave ao se aproximar do ponto de parada
    const distFactor = Math.min(1, dist / 40);
    const baseSpeed = c.spec.speed * (W / 1000) * (0.35 + 0.65 * distFactor);

    // Animais que pulam (coelho, esquilo, sapo): propulsão em saltos e pausas breves de apoio
    let currentSpeed = baseSpeed;
    if (c.spec.hop) {
      const hopCycle = Math.max(0, sin(c.clk * c.spec.gait * 0.9 + c.ph));
      currentSpeed = baseSpeed * (0.15 + 1.65 * (hopCycle ** 2));
    }

    c.v = approach(c.v, currentSpeed, 240 * dt);
    c.cm += (c.v / (baseSpeed || 1)) * dt;
    c.x += (cos(c.heading) * c.v * dt) / W;
    c.y += (sin(c.heading) * c.v * dt) / H;

    // Transição suave de orientação (não inverte bruscamente no zero)
    const faceDir = cos(c.heading) >= 0 ? 1 : -1;
    c.face = approach(c.face, faceDir, 4.5 * dt);
  }

  function updateFlyer(c: Critter, dt: number, W: number, H: number) {
    c.clk += dt;
    if (c.animal.id === "eagle") {
      // Águia real planando majestosa em correntes térmicas ascendentes
      c.orbit += dt * 0.28;
      c.enter = approach(c.enter, 1, 0.2 * dt);
      const cx = 0.65 + sin(c.orbit) * 0.25;
      const cy = 0.22 + cos(c.orbit * 0.75) * 0.09;
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
        const R = randRegion();
        c.tx = R.x;
        c.ty = R.y;
        c.timer = 4 + rnd() * 5;
      }
    } else {
      c.timer -= dt;
      if (c.timer <= 0) {
        if (c.animal.id === "bird" && rnd() < 0.45) {
          const sp = pickFree();
          if (sp >= 0) {
            c.spot = sp;
            c.tx = TRAIL_ROAM_SPOTS[sp].x / 100;
            c.ty = TRAIL_ROAM_SPOTS[sp].y / 100;
            c.timer = 8;
          }
        } else {
          const R = randRegion();
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
        // Ondulação suave do vento alpino
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
          case "squirrel":
            inner = squirrel(d);
            break;
          case "frog":
            inner = frog(d);
            break;
          case "snail":
            inner = snail(d);
            break;
          case "chamois":
            inner = chamois(d);
            break;
          case "hedgehog":
            inner = hedgehog(d);
            break;
          case "turtle":
            inner = turtle(d);
            break;
          case "deer":
            inner = realDeer(d);
            break;
          case "fox":
            inner = realFox(d);
            break;
          default:
            inner = realRabbit(d);
        }
        out += G(X, Y - ro, 0, c.face, br, inner);
      } else {
        const flying = !c.landed;
        const alt = c.z;
        if (id === "eagle") {
          out += G(X, Y, c.face * 0 + 0, c.face, 1, G(0, 0, clamp(sin(c.orbit) * 6, -8, 8), 1, 1, eagle(d)));
          continue;
        }
        const sh = clamp(1 - alt / (140 * S), 0.25, 1);
        out += ell(X, Y + 1, 9 * s * sh, 2.4 * s * sh, `rgba(0,0,0,${f(0.2 * sh)})`);

        switch (id) {
          case "butterfly":
            inner = flutter({ ...d, landed: !flying }, c.color);
            break;
          case "bee":
            inner = bee(d);
            break;
          default:
            inner = songbird({ ...d, flying }, c.color);
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

  return { critters, step, render, hit, poke, find, position, setWeather };
}
