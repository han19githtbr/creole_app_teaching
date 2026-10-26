/**
 * Camada de VIDA das cenas (história em vídeo).
 *
 * Desenha, por cima de QUALQUER imagem (as 280 cenas do banco e as imagens geradas por IA, vetoriais ou
 * rasterizadas), pequenos "filmes" animados que imitam o mundo real: mar com ondas, barcos, remadores,
 * peixes e tubarões caçando, animais brincando, famílias jantando, pessoas viajando, plateia no cinema,
 * humanos interagindo com robôs, etc.
 *
 * Tudo é uma FUNÇÃO PURA DO TEMPO: render(t) devolve o SVG do instante t (em segundos). O player usa
 * t = tempo do áudio e o exportador usa o t de cada quadro — por isso o vídeo baixado é idêntico ao que se
 * assiste na plataforma. Sem CSS animado, sem aleatoriedade em tempo de execução (tudo parte de uma semente).
 */

import { SURF_FIRST_SECONDS, SURF_PERIOD_SECONDS, SURF_RIDE_SECONDS } from "@/lib/storySoundscape";

export const LIFE_W = 1200;
export const LIFE_H = 800;

export interface SceneZones {
  /** faixa de água detectada na imagem (coordenadas 1200x800) */
  water: { y0: number; y1: number } | null;
  /** onde começa o chão onde as pessoas/animais pisam */
  groundTop: number;
}

export interface LifeInput {
  sceneId: string;
  theme: string;
  title?: string;
  elements?: Array<{ pt?: string; kreyol?: string; fr?: string }>;
  zones?: SceneZones | null;
}

export interface LifeScene {
  actors: string[];
  render: (t: number) => string;
}

/** Cenas principais que JÁ trazem seus personagens animados dentro do próprio SVG (não duplicar). */
const AMBIENT_BIRDS = new Set(["passaros", "gaivotas", "pombas", "aguia"]);
const NATIVE_LIFE_IDS = new Set(["tecnologia", "natureza", "turismo", "gastronomia"]);

/* ------------------------------------------------------------------ utilidades */

const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const f = (n: number) => Math.round(n * 10) / 10;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rngFrom(seed: string) {
  let a = hashStr(seed) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rnd = () => number;
const pick = <T,>(r: Rnd, arr: T[]): T => arr[Math.floor(r() * arr.length) % arr.length];

/** grupo com transformação */
function G(x: number, y: number, rot: number, sx: number, sy: number, inner: string, extra = ""): string {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(sx)} ${f(sy)})"${extra}>${inner}</g>`;
}
function line(x1: number, y1: number, x2: number, y2: number, w: number, col: string): string {
  return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
}
/** membro: sai de (x,y) com comprimento len e ângulo ang (0 = para baixo, + = para frente) */
function limb(x: number, y: number, len: number, ang: number, w: number, col: string): string {
  return line(x, y, x + sin(ang) * len, y + cos(ang) * len, w, col);
}
const end = (x: number, y: number, len: number, ang: number): [number, number] => [x + sin(ang) * len, y + cos(ang) * len];
const circ = (x: number, y: number, r: number, fill: string, extra = "") =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"${extra}/>`;
const ell = (x: number, y: number, rx: number, ry: number, fill: string, extra = "") =>
  `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${extra}/>`;

/** posição que atravessa a tela (com margem) e dá a volta */
function travel(t: number, speed: number, ph: number, margin = 160, dir = 1): number {
  const span = LIFE_W + margin * 2;
  const u = (((t * speed + ph * span) % span) + span) % span;
  return dir >= 0 ? -margin + u : LIFE_W + margin - u;
}
const depth = (y: number, gt: number) => 0.6 + 0.5 * clamp((y - gt) / Math.max(40, 740 - gt), 0, 1);

/* ------------------------------------------------------------------ pessoas */

const SKINS = ["#f3c9a5", "#e0a67a", "#c68a5c", "#a86f45", "#7a4a2c", "#5a3520"];
const SHIRTS = ["#e8564a", "#3c7dd9", "#f2b632", "#4aa96c", "#9b59b6", "#ef8a3d", "#2fb5b0", "#e86aa6", "#f4f1e6"];
const PANTS = ["#2f3e5c", "#4a3a2e", "#3a4a3a", "#5c3a5c", "#24313f", "#6b5a43"];
const HAIRS = ["#201510", "#3b2416", "#6b3f1d", "#111111", "#8a8a8a", "#b0501f"];

export type Pose =
  | "walk" | "talk" | "wave" | "point" | "cheer" | "dance" | "type" | "guitar" | "drum"
  | "read" | "pray" | "stir" | "sit-eat" | "sit-talk" | "row" | "cycle" | "ride" | "photo"
  | "phone" | "kick" | "hold-hand";

export interface PersonOpt {
  x: number; y: number; s?: number; face?: 1 | -1; pose: Pose; ph?: number; speed?: number;
  skin?: string; shirt?: string; pants?: string; hair?: string; hat?: string; robe?: boolean;
}

export function person(t: number, o: PersonOpt): string {
  const s = o.s ?? 0.85;
  const w = t * (o.speed ?? 1) + (o.ph ?? 0);
  const skin = o.skin ?? SKINS[1], shirt = o.shirt ?? SHIRTS[0], pants = o.pants ?? PANTS[0], hair = o.hair ?? HAIRS[0];
  const seated = o.pose === "sit-eat" || o.pose === "sit-talk" || o.pose === "row" || o.pose === "ride";
  let lL = 0, lR = 0, aL = 0.1, aR = 0.1, bob = 0, lean = 0, nod = 0, sx = 1;
  switch (o.pose) {
    case "walk": { const k = sin(w * 6); lL = k * 0.55; lR = -k * 0.55; aL = -k * 0.5; aR = k * 0.5; bob = -Math.abs(cos(w * 6)) * 2.5; break; }
    case "talk": aR = -1.0 + sin(w * 2.4) * 0.45; aL = 0.1 + sin(w * 1.7) * 0.15; nod = sin(w * 3) * 2; break;
    case "wave": aR = -2.7 + sin(w * 7) * 0.4; break;
    case "point": aR = -1.45 + sin(w * 1.5) * 0.08; aL = 0.15; nod = sin(w * 1.2) * 1.5; break;
    case "photo": aR = -2.0; aL = -2.0; nod = sin(w * 0.8) * 1.5; break;
    case "cheer": aL = -2.7 + sin(w * 6) * 0.3; aR = -2.7 + sin(w * 6 + 1) * 0.3; bob = -Math.abs(sin(w * 5)) * 5; break;
    case "dance": {
      const k = sin(w * 4); bob = -Math.abs(k) * 7; lL = k * 0.5; lR = -k * 0.5; aL = -2.2 - k * 0.5; aR = -2.4 + sin(w * 4 + 1) * 0.5; lean = sin(w * 2) * 10;
      sx = 0.35 + 0.65 * Math.abs(cos(w * 1.3)); break;
    }
    case "type": aL = -1.3 + sin(w * 12) * 0.08; aR = -1.3 + sin(w * 12 + 2) * 0.08; nod = sin(w * 2) * 2; break;
    case "guitar": aL = -1.25; aR = -0.9 + sin(w * 11) * 0.3; lean = sin(w * 2) * 3; break;
    case "drum": aL = -0.9 + Math.max(0, sin(w * 9)) * 0.7; aR = -0.9 + Math.max(0, sin(w * 9 + 3)) * 0.7; nod = sin(w * 4.5) * 2; break;
    case "read": aL = -1.2; aR = -1.2; nod = 4 + sin(w * 0.8) * 2; break;
    case "pray": aL = -1.9; aR = -1.9; nod = 7; break;
    case "stir": aR = -1.2 + sin(w * 5) * 0.25; aL = -0.7; lean = 4; break;
    case "cycle": { const k = sin(w * 7); lL = 0.9 + k * 0.5; lR = 0.9 - k * 0.5; aL = -1.1; aR = -1.1; lean = 8; break; }
    case "sit-eat": { const m = Math.max(0, sin(w * 1.6)); aR = -0.3 - 2.0 * m; aL = -0.4; nod = m * 3; break; }
    case "sit-talk": aR = -0.9 + sin(w * 2.2) * 0.4; aL = -0.3; nod = sin(w * 2.6) * 2; break;
    case "row": aL = -1.3 + sin(w * 2.2) * 0.7; aR = aL; lean = sin(w * 2.2) * 7; break;
    case "ride": aL = -1.0; aR = -1.0; break;
    case "phone": {
      aR = -2.35 + sin(w * 1.1) * 0.12;
      aL = 0.2 + sin(w * 2.1) * 0.35;
      nod = sin(w * 2.8) * 2.8;
      lean = sin(w * 1.4) * 2;
      const k = sin(w * 4.5);
      lL = k * 0.35;
      lR = -k * 0.35;
      bob = -Math.abs(cos(w * 4.5)) * 1.8;
      break;
    }
    case "kick": {
      const k = sin(w * 5.5);
      lL = k > 0 ? -k * 0.85 : 0.15;
      lR = k < 0 ? k * 0.95 : 0.15;
      aL = -1.25 + sin(w * 5.5) * 0.3;
      aR = 0.75 - sin(w * 5.5) * 0.4;
      lean = -k * 11;
      bob = -Math.abs(sin(w * 5.5)) * 4;
      break;
    }
    case "hold-hand": {
      const k = sin(w * 4.8);
      lL = k * 0.48;
      lR = -k * 0.48;
      aL = -k * 0.35;
      aR = -0.32 + sin(w * 2.4) * 0.08;
      bob = -Math.abs(cos(w * 4.8)) * 2;
      lean = sin(w * 1.2) * 1.8;
      nod = sin(w * 1.6) * 1.5;
      break;
    }
  }
  const hipY = seated ? -30 : -40;
  const shY = hipY - 34;
  let legs = "";
  if (seated) {
    const th = o.pose === "ride" ? 1.2 : 1.55;
    legs = limb(0, hipY, 26, th, 9, pants) + limb(26 * sin(th), hipY + 26 * cos(th), 28, 0.05, 8, pants) + circ(28, -4, 5, "#2a1c14");
  } else {
    const [lx, ly] = end(0, hipY, 40, lL);
    const [rx, ry] = end(0, hipY, 40, lR);
    legs = limb(0, hipY, 40, lR, 9, pants) + ell(rx + 3, ry, 6, 3.4, "#2a1c14") + limb(0, hipY, 40, lL, 9, pants) + ell(lx + 3, ly, 6, 3.4, "#2a1c14");
  }
  const torso = `<g transform="rotate(${f(lean)} 0 ${hipY})">` +
    limb(0, shY + 4, 28, aL, 7, shirt) + circ(...end(0, shY + 4, 28, aL), 4, skin) +
    `<rect x="-10" y="${shY - 2}" width="20" height="40" rx="9" fill="${shirt}"/>` +
    (o.robe ? `<path d="M-11 ${shY + 8} L-14 ${hipY + 44} L14 ${hipY + 44} L11 ${shY + 8} Z" fill="${shirt}"/>` : "") +
    `<g transform="rotate(${f(nod)} 0 ${shY})">${circ(2, shY - 15, 12, skin)}<path d="M-10 ${shY - 18} Q2 ${shY - 34} 14 ${shY - 18} Q4 ${shY - 24} -10 ${shY - 18} Z" fill="${hair}"/>` +
    (o.hat ? `<ellipse cx="2" cy="${shY - 26}" rx="15" ry="4" fill="${o.hat}"/><rect x="-8" y="${shY - 36}" width="20" height="11" rx="5" fill="${o.hat}"/>` : "") +
    circ(7, shY - 14, 1.6, "#2a1c14") + `</g>` +
    limb(0, shY + 4, 28, aR, 7, shirt) + circ(...end(0, shY + 4, 28, aR), 4, skin) + `</g>`;
  let prop = "";
  if (o.pose === "guitar") { const [hx, hy] = end(0, shY + 4, 28, aL); prop = line(-12, shY + 30, hx + 6, hy - 4, 4, "#7a4a22") + ell(-8, shY + 32, 11, 8, "#c0792f"); }
  if (o.pose === "read") { const [hx, hy] = end(0, shY + 4, 28, aL); prop = `<rect x="${f(hx - 2)}" y="${f(hy - 8)}" width="14" height="12" rx="1" fill="#f6efe0" stroke="#8a6b3a" stroke-width="1.5"/>`; }
  if (o.pose === "photo") { const [hx, hy] = end(0, shY + 4, 28, aR); prop = `<rect x="${f(hx - 4)}" y="${f(hy - 5)}" width="11" height="8" rx="2" fill="#222"/>` + (sin(w * 0.9) > 0.92 ? circ(hx + 12, hy - 2, 7, "#fff", ' opacity="0.8"') : ""); }
  if (o.pose === "phone") { const [hx, hy] = end(0, shY + 4, 28, aR); prop = `<rect x="${f(hx - 3)}" y="${f(hy - 8)}" width="7" height="13" rx="2" fill="#1b242e"/><rect x="${f(hx - 2)}" y="${f(hy - 6)}" width="5" height="9" rx="1" fill="#60a5fa" opacity="0.85"/>`; }
  const shadow = ell(o.x, o.y + 1, 22 * s, 5 * s, "rgba(0,0,0,.2)");
  const face = o.face ?? 1;
  return shadow + G(o.x, o.y + bob, 0, face * s * sx, s, legs + torso + prop);
}

/* ------------------------------------------------------------------ robô */

function robot(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1; mode: "wave" | "work" | "nod" | "carry" | "clean" | "scan"; ph?: number }): string {
  const s = o.s ?? 0.85, w = t + (o.ph ?? 0);
  let arm = -0.2;
  if (o.mode === "wave") arm = -2.6 + sin(w * 7) * 0.4;
  else if (o.mode === "work") arm = -1.2 + sin(w * 9) * 0.1;
  else if (o.mode === "carry") arm = -1.4 + sin(w * 3) * 0.08;
  else if (o.mode === "clean") arm = -1.1 + sin(w * 6) * 0.35;
  else if (o.mode === "scan") arm = -0.7 + sin(w * 2) * 0.15;

  const blink = sin(w * 3) > 0 ? "#38f5a0" : "#1b8a5c";
  const [hx, hy] = end(14, -62, 26, arm);
  const [h2x, h2y] = end(-14, -62, 26, o.mode === "carry" ? arm : -0.2);

  let taskProp = "";
  if (o.mode === "carry") {
    taskProp = `<rect x="6" y="-72" width="24" height="20" rx="3" fill="#e0a030" stroke="#8a5a1c" stroke-width="1.5"/><circle cx="18" cy="-62" r="3" fill="${sin(w * 5) > 0 ? "#38f5a0" : "#ff5a4a"}"/>`;
  } else if (o.mode === "clean") {
    const sweepX = hx + 14 + sin(w * 6) * 12;
    taskProp = line(hx, hy, sweepX, -2, 3, "#5c6b7a") + `<path d="M${f(sweepX - 10)} -2 L${f(sweepX + 10)} -2" stroke="#38f5a0" stroke-width="4" stroke-linecap="round"/>`;
  } else if (o.mode === "scan") {
    taskProp = `<path d="M0 -96 L-35 0 L35 0 Z" fill="#2c9bf0" opacity="${f(0.18 + 0.12 * Math.abs(sin(w * 3)))}"/><line x1="-35" y1="0" x2="35" y2="0" stroke="#2c9bf0" stroke-width="2" opacity="0.6"/>`;
  }

  const body =
    `<rect x="-12" y="-30" width="9" height="30" rx="3" fill="#8a95a3"/><rect x="3" y="-30" width="9" height="30" rx="3" fill="#8a95a3"/>` +
    `<rect x="-17" y="-70" width="34" height="42" rx="8" fill="#c9d3de" stroke="#5c6b7a" stroke-width="2"/>` +
    circ(0, -50, 6, blink) + line(14, -62, hx, hy, 6, "#8a95a3") + circ(hx, hy, 5, "#5c6b7a") +
    (o.mode === "carry" ? line(-14, -62, h2x, h2y, 6, "#8a95a3") + circ(h2x, h2y, 5, "#5c6b7a") : "") +
    taskProp +
    `<g transform="rotate(${f(o.mode === "nod" ? sin(w * 3) * 6 : sin(w * 1.5) * 3)} 0 -72)"><rect x="-14" y="-96" width="28" height="24" rx="7" fill="#dfe6ee" stroke="#5c6b7a" stroke-width="2"/>` +
    circ(-5, -85, 3.2, "#2c9bf0") + circ(6, -85, 3.2, "#2c9bf0") + line(0, -96, 0, -106, 2, "#5c6b7a") + circ(0, -108, 3.5, sin(w * 4) > 0 ? "#ff5a4a" : "#8a2a22") + `</g>`;

  return ell(o.x, o.y + 1, 22 * s, 5 * s, "rgba(0,0,0,.2)") + G(o.x, o.y + (o.mode === "work" ? 0 : -Math.abs(sin(w * 2)) * 1.5), 0, (o.face ?? 1) * s, s, body);
}

/* ------------------------------------------------------------------ animais */

type AnimalOpt = { x: number; y: number; s?: number; face?: 1 | -1; ph?: number; mode?: "run" | "idle" | "graze" };

function rabbit(t: number, o: AnimalOpt & { color?: string }): string {
  const s = o.s ?? 1, w = t * (o.mode === "run" ? 9 : 2.4) + (o.ph ?? 0), c = o.color ?? "#f1ece2";
  const hop = o.mode === "idle" ? 0 : Math.abs(sin(w)) * (o.mode === "run" ? 22 : 9);
  const body = ell(0, -14, 15, 9.5, c) + ell(15, -20, 7.5, 6.5, c) + ell(13, -33, 3, 9, c, ` transform="rotate(${f(-8 + sin(w * 2) * 5)} 13 -28)"`) +
    ell(19, -32, 3, 8.5, c, ` transform="rotate(${f(12 + sin(w * 2) * 5)} 19 -28)"`) + circ(-15, -16, 4.5, "#fff") + circ(19, -22, 1.4, "#222") +
    ell(8, -3, 6, 2.6, c) + ell(-10, -3, 7, 2.8, c);
  return ell(o.x, o.y + 1, 15 * s, 4 * s, "rgba(0,0,0,.18)", "") + G(o.x, o.y - hop, 0, (o.face ?? 1) * s, s, body);
}
function fox(t: number, o: AnimalOpt): string {
  const s = o.s ?? 1, w = t * 10 + (o.ph ?? 0), k = sin(w);
  const legs = [[-16, k], [-8, -k], [12, -k], [20, k]].map(([lx, a]) => limb(lx, -16, 17, (a as number) * 0.8, 5, "#c4601f")).join("");
  const tail = `<g transform="rotate(${f(sin(w * 0.9) * 12)} -26 -26)">${ell(-40, -28, 17, 7, "#e77a2b", ' transform="rotate(-12 -40 -28)"')}${ell(-54, -31, 6, 5, "#fff6e6")}</g>`;
  const body = legs + ell(0, -26, 27, 11, "#e77a2b") + ell(14, -22, 14, 7, "#fff0d8") + ell(30, -33, 11, 9, "#e77a2b") + `<path d="M38 -34 L52 -30 L38 -26 Z" fill="#f0a15a"/>` +
    `<path d="M26 -40 L28 -52 L35 -41 Z" fill="#c4601f"/><path d="M33 -41 L38 -51 L41 -39 Z" fill="#c4601f"/>` + circ(48, -31, 2, "#111") + circ(34, -34, 1.7, "#111") + tail;
  return ell(o.x, o.y + 1, 30 * (o.s ?? 1), 5 * (o.s ?? 1), "rgba(0,0,0,.18)") + G(o.x, o.y - Math.abs(k) * 3, 0, (o.face ?? 1) * s, s, body);
}
function deer(t: number, o: AnimalOpt): string {
  const s = o.s ?? 1, w = t * 0.9 + (o.ph ?? 0), down = (sin(w) + 1) / 2;
  const legs = [-20, -12, 14, 22].map((lx, i) => limb(lx, -34, 36, sin(w * 0.5 + i) * 0.04, 5, "#8a5a2c")).join("");
  const neck = `<g transform="rotate(${f(-8 + down * 50)} 24 -50)">${line(24, -50, 40, -78, 9, "#b87a3c")}${ell(46, -82, 11, 7, "#b87a3c", ' transform="rotate(-20 46 -82)"')}` +
    `<path d="M42 -88 L40 -104 M40 -98 L34 -106 M42 -92 L50 -106" stroke="#6a4a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + circ(50, -84, 1.6, "#111") + `</g>`;
  const body = legs + ell(0, -46, 30, 14, "#b87a3c") + circ(-8, -50, 2.4, "#f3dcae") + circ(6, -42, 2.4, "#f3dcae") + circ(-16, -42, 2.4, "#f3dcae") + neck +
    ell(-31, -52, 5, 3, "#f3e6c8", ' transform="rotate(-30 -31 -52)"');
  return ell(o.x, o.y + 1, 34 * s, 5 * s, "rgba(0,0,0,.18)") + G(o.x, o.y, 0, (o.face ?? 1) * s, s, body);
}
function dog(t: number, o: AnimalOpt & { color?: string }): string {
  const s = o.s ?? 1, w = t * 11 + (o.ph ?? 0), k = sin(w), c = o.color ?? "#8a5a30";
  const legs = [[-14, k], [-7, -k], [10, -k], [17, k]].map(([lx, a]) => limb(lx, -14, 15, (a as number) * 0.9, 4.5, c)).join("");
  const body = legs + ell(0, -22, 21, 9, c) + ell(23, -29, 9, 8, c) + ell(33, -27, 6, 4, "#d9b184") + ell(20, -34, 3.5, 7, "#4a2c14", ' transform="rotate(20 20 -34)"') + circ(27, -31, 1.6, "#111") +
    line(-20, -26, -30, -34 + sin(w * 1.6) * 6, 4, c);
  return ell(o.x, o.y + 1, 22 * s, 4 * s, "rgba(0,0,0,.18)") + G(o.x, o.y - Math.abs(k) * 3, 0, (o.face ?? 1) * s, s, body);
}
function chicken(t: number, o: AnimalOpt & { color?: string }): string {
  const s = o.s ?? 1, w = t * 3.2 + (o.ph ?? 0), peck = Math.max(0, sin(w)) ** 3, c = o.color ?? "#f4ecd8";
  const body = line(-2, -10, -3, 0, 2, "#e0a030") + line(4, -10, 5, 0, 2, "#e0a030") + ell(0, -16, 12, 9, c) + `<path d="M-10 -18 L-18 -26 L-8 -22 Z" fill="${c}"/>` +
    `<g transform="rotate(${f(peck * 55)} 9 -22)">${circ(12, -28, 5.5, c)}<path d="M16 -29 L22 -27 L16 -26 Z" fill="#f0a030"/>${circ(13, -30, 1.2, "#111")}<path d="M10 -34 Q12 -39 14 -34 Z" fill="#d63a3a"/></g>`;
  return ell(o.x, o.y + 1, 11 * s, 3 * s, "rgba(0,0,0,.18)") + G(o.x, o.y, 0, (o.face ?? 1) * s, s, body);
}
function cow(t: number, o: AnimalOpt): string {
  const s = o.s ?? 1, w = t * 0.8 + (o.ph ?? 0), down = (sin(w) + 1) / 2;
  const legs = [-24, -14, 16, 26].map((lx) => limb(lx, -30, 30, 0, 7, "#efe9dc")).join("");
  const head = `<g transform="rotate(${f(down * 42)} 34 -52)">${ell(46, -48, 14, 10, "#efe9dc", ' transform="rotate(25 46 -48)"')}${ell(54, -42, 7, 5, "#e8b4a8")}${circ(46, -54, 1.8, "#111")}<path d="M38 -60 L36 -68 M44 -62 L46 -70" stroke="#d9cfae" stroke-width="3" stroke-linecap="round"/></g>`;
  const body = legs + ell(0, -48, 36, 20, "#efe9dc") + ell(-10, -52, 11, 8, "#2b2b2b") + ell(14, -42, 8, 7, "#2b2b2b") + head +
    line(-36, -56, -42, -30 + sin(w * 3) * 4, 3, "#efe9dc") + ell(-6, -30, 8, 4, "#e8b4a8");
  return ell(o.x, o.y + 1, 40 * s, 6 * s, "rgba(0,0,0,.18)") + G(o.x, o.y, 0, (o.face ?? 1) * s, s, body);
}
function horse(t: number, o: AnimalOpt & { color?: string }): string {
  const s = o.s ?? 1, w = t * 8 + (o.ph ?? 0), k = sin(w), c = o.color ?? "#7a4a26";
  const legs = [[-24, k], [-14, -k], [18, -k], [28, k]].map(([lx, a]) => limb(lx, -42, 42, (a as number) * 0.6, 6, c)).join("");
  const body = legs + ell(0, -56, 38, 17, c) + line(24, -64, 46, -96, 13, c) + ell(54, -100, 15, 8, c, ' transform="rotate(30 54 -100)"') + circ(56, -103, 1.8, "#111") +
    `<path d="M26 -72 Q38 -90 46 -100 L40 -78 Z" fill="#2a1a10"/>` + `<path d="M-36 -62 Q-56 -50 -50 -26 Q-44 -50 -34 -56 Z" fill="#2a1a10" transform="rotate(${f(sin(w * 0.7) * 6)} -36 -62)"/>`;
  return ell(o.x, o.y + 1, 44 * s, 6 * s, "rgba(0,0,0,.18)") + G(o.x, o.y - Math.abs(k) * 3, 0, (o.face ?? 1) * s, s, body);
}
function bird(t: number, o: { x: number; y: number; s?: number; ph?: number; color?: string; face?: 1 | -1 }): string {
  const s = o.s ?? 1, k = sin(t * 8 + (o.ph ?? 0)), c = o.color ?? "#ffffff";
  const d = `M-18 ${f(-4 + k * 9)} Q-9 ${f(-9 + k * 8)} 0 0 Q9 ${f(-9 + k * 8)} 18 ${f(-4 + k * 9)}`;
  return G(o.x, o.y + sin(t * 1.3 + (o.ph ?? 0)) * 4, 0, (o.face ?? 1) * s, s, `<path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` + circ(0, 1, 2.6, c));
}
function butterfly(t: number, o: { cx: number; cy: number; r?: number; ph?: number; color?: string }): string {
  const w = t * 0.6 + (o.ph ?? 0), x = o.cx + sin(w * 1.7) * (o.r ?? 120), y = o.cy + sin(w * 2.3 + 1) * 40, fl = 0.25 + 0.75 * Math.abs(sin(t * 14 + (o.ph ?? 0)));
  const c = o.color ?? "#f08a2b";
  return G(x, y, sin(w * 1.7) * 14, 1, 1, `<ellipse cx="-5" cy="0" rx="${f(6 * fl)}" ry="7" fill="${c}"/><ellipse cx="5" cy="0" rx="${f(6 * fl)}" ry="7" fill="${c}"/>` + line(0, -4, 0, 5, 2, "#3a2414"));
}
function fish(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1; ph?: number; color?: string; alpha?: number }): string {
  const s = o.s ?? 1, k = sin(t * 9 + (o.ph ?? 0)), c = o.color ?? "#f08a3c";
  const body = ell(0, 0, 13, 6, c) + `<path d="M-11 0 L-22 ${f(-6 + k * 4)} L-22 ${f(6 + k * 4)} Z" fill="${c}"/>` + circ(7, -1.5, 1.4, "#111") + `<path d="M-2 -5 Q2 -10 6 -5 Z" fill="${c}" opacity=".8"/>`;
  return G(o.x, o.y, k * 3, (o.face ?? 1) * s, s, body, ` opacity="${o.alpha ?? 0.9}"`);
}
function shark(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1; ph?: number }): string {
  const s = o.s ?? 1, k = sin(t * 3.2 + (o.ph ?? 0));
  const body = `<path d="M-60 0 Q-20 -20 40 -8 Q62 -2 70 4 Q40 16 -10 14 Q-42 12 -60 0 Z" fill="#6b7f92"/><path d="M-6 6 Q30 14 66 5 Q40 14 -6 14 Z" fill="#dbe4ec"/>` +
    `<path d="M-2 -13 L12 -36 L24 -10 Z" fill="#566a7d"/><path d="M-60 0 L-84 ${f(-16 + k * 8)} L-72 ${f(2 + k * 4)} L-86 ${f(20 + k * 8)} Z" fill="#566a7d"/>` +
    circ(50, -2, 2.2, "#111") + `<path d="M62 4 Q70 6 74 4" stroke="#2a3744" stroke-width="2" fill="none"/>`;
  return G(o.x, o.y, k * 3, (o.face ?? 1) * s, s, body, ' opacity=".92"');
}

/* ------------------------------------------------------------------ barcos, aviões, balões, pipas, bicicleta */

function waveY(x: number, t: number): number {
  return sin(x * 0.012 + t * 1.3) * 3.2 + sin(x * 0.03 - t * 0.9) * 1.6;
}

function sailboat(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1; sail?: string; hull?: string }): string {
  const s = o.s ?? 1, sail = o.sail ?? "#fdfbf4", hull = o.hull ?? "#c8453a", b = sin(t * 1.4 + o.x * 0.01) * 5, bil = sin(t * 2.2) * 5;
  const wake = [0, 1, 2].map((i) => `<ellipse cx="${f(-62 - i * 26 + sin(t * 2 + i) * 4)}" cy="${f(14 + i * 1.5)}" rx="${f(26 - i * 4)}" ry="${f(3 - i * 0.5)}" fill="#fff" opacity="${f(0.55 - i * 0.15)}"/>`).join("");
  const body = wake + `<path d="M-44 6 L48 6 L34 26 L-30 26 Z" fill="${hull}"/><path d="M-44 6 L48 6 L46 11 L-42 11 Z" fill="#f1e9d6"/>` + line(2, 6, 2, -78, 3, "#5a3a22") +
    `<path d="M5 -74 Q${f(36 + bil)} -36 ${f(40 + bil)} 0 L5 0 Z" fill="${sail}" stroke="#d7cdb5" stroke-width="1.5"/><path d="M-1 -66 Q${f(-24 - bil * 0.6)} -30 -30 0 L-1 0 Z" fill="${sail}" stroke="#d7cdb5" stroke-width="1.5"/>` +
    `<path d="M2 -78 L${f(16 + bil)} -73 L2 -68 Z" fill="#e8564a"/>`;
  return G(o.x, o.y + waveY(o.x, t) * 1.3, b * 0.6, (o.face ?? 1) * s, s, body);
}
function rowboat(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1; ph?: number }): string {
  const s = o.s ?? 1, w = t * 2.2 + (o.ph ?? 0), b = sin(t * 1.5 + (o.ph ?? 0)) * 3;
  const ripples = [0, 1, 2].map((i) => `<ellipse cx="${f(-52 - i * 22)}" cy="${f(12 + i)}" rx="${f(20 - i * 3)}" ry="2.6" fill="#fff" opacity="${f(0.5 - i * 0.14)}"/>`).join("");
  const oar = (ox: number, ph: number) => {
    const a = 0.9 + sin(w + ph) * 0.45;
    return line(ox, -8, ox + sin(a) * 52, -8 + cos(a) * 40, 3, "#7a5530") + ell(ox + sin(a) * 52, -8 + cos(a) * 40, 7, 2.5, "#7a5530");
  };
  const hull = `<path d="M-52 2 Q0 8 56 -6 L46 16 Q0 24 -40 16 Z" fill="#a86a38"/><path d="M-52 2 Q0 8 56 -6" stroke="#6a3f1c" stroke-width="3" fill="none"/>`;
  const p1 = person(t, { x: -14, y: 4, s: 0.62, pose: "row", ph: o.ph ?? 0, speed: 1, shirt: "#e86a4a", skin: SKINS[2], hat: "#f2d27a" });
  const p2 = person(t, { x: 20, y: 5, s: 0.62, pose: "row", ph: (o.ph ?? 0), speed: 1, shirt: "#3c7dd9", skin: SKINS[1] });
  return G(o.x, o.y + waveY(o.x, t), b, (o.face ?? 1) * s, s, ripples + hull + p1.replace(/<ellipse[^>]*rgba\(0,0,0,\.2\)"\/>/, "") + p2.replace(/<ellipse[^>]*rgba\(0,0,0,\.2\)"\/>/, "") + oar(-4, 0) + oar(30, 0.4));
}
function plane(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1; rot?: number }): string {
  const s = o.s ?? 1;
  const body = line(-90, 0, -170, -3, 3, "rgba(255,255,255,.55)") + line(-90, 6, -150, 8, 2, "rgba(255,255,255,.4)") +
    `<path d="M-60 -9 Q0 -16 60 -6 Q74 0 60 6 Q0 12 -60 8 Z" fill="#fafafa" stroke="#c7ced6" stroke-width="1.5"/>` +
    `<path d="M-6 4 L-30 30 L-18 30 L16 4 Z" fill="#dfe5ec"/><path d="M-6 -4 L-24 -26 L-14 -26 L14 -4 Z" fill="#eef1f5"/><path d="M-56 -8 L-68 -28 L-58 -28 L-42 -8 Z" fill="#e8564a"/>` +
    [-30, -18, -6, 6, 18, 30].map((x) => circ(x, -3, 2.1, "#4a7fbf")).join("") + `<path d="M46 -6 Q60 -6 62 0 L46 0 Z" fill="#4a7fbf"/>`;
  return G(o.x, o.y + sin(t * 0.8) * 3, o.rot ?? sin(t * 0.6) * 1.5, (o.face ?? 1) * s, s, body);
}
function balloon(t: number, o: { x: number; y: number; s?: number; ph?: number }): string {
  const s = o.s ?? 1, sw = sin(t * 0.7 + (o.ph ?? 0)) * 4;
  const cols = ["#e8564a", "#f2b632", "#3c7dd9", "#4aa96c"];
  const env = cols.map((c, i) => `<path d="M0 -70 Q${-40 + i * 20} -50 ${-30 + i * 20} 0 L${-10 + i * 20} 0 Q${-20 + i * 20} -50 0 -70 Z" fill="${c}"/>`).join("") + `<ellipse cx="0" cy="-34" rx="34" ry="38" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`;
  const p = G(0, 40, 0, 0.5, 0.5, person(t, { x: 0, y: 0, pose: "wave", ph: o.ph ?? 0, shirt: "#e86aa6" }).replace(/<ellipse[^>]*rgba\(0,0,0,\.2\)"\/>/, ""));
  return G(o.x, o.y, sw, s, s, env + line(-14, 2, -10, 22, 2, "#5a3a22") + line(14, 2, 10, 22, 2, "#5a3a22") + `<rect x="-14" y="22" width="28" height="18" rx="3" fill="#a86a38"/>` + p);
}
function kite(t: number, o: { x: number; y: number; hx: number; hy: number; ph?: number; color?: string }): string {
  const w = t * 1.1 + (o.ph ?? 0), kx = o.x + sin(w) * 40, ky = o.y + sin(w * 1.4) * 22, ang = sin(w) * 16, c = o.color ?? "#e8564a";
  const tail = Array.from({ length: 7 }, (_, i) => circ(0 + sin(w * 3 + i) * 8, 24 + i * 11, 3.2, i % 2 ? "#f2b632" : "#3c7dd9")).join("");
  return `<path d="M${f(o.hx)} ${f(o.hy)} Q${f((o.hx + kx) / 2 + 20)} ${f((o.hy + ky) / 2 + 50)} ${f(kx)} ${f(ky)}" stroke="#fff" stroke-opacity=".8" stroke-width="1.4" fill="none"/>` +
    G(kx, ky, ang, 1, 1, `<path d="M0 -26 L18 0 L0 26 L-18 0 Z" fill="${c}" stroke="#fff" stroke-width="1.5"/>${line(0, -26, 0, 26, 1.5, "rgba(255,255,255,.6)")}${line(-18, 0, 18, 0, 1.5, "rgba(255,255,255,.6)")}${tail}`);
}
function bicycle(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1 }): string {
  const s = o.s ?? 0.9, r = t * 260;
  const wheel = (cx: number) => `<circle cx="${cx}" cy="-17" r="17" fill="none" stroke="#2a2a2a" stroke-width="3"/>` + [0, 60, 120].map((a) => line(cx - cos(((a + r) * PI) / 180) * 16, -17 - sin(((a + r) * PI) / 180) * 16, cx + cos(((a + r) * PI) / 180) * 16, -17 + sin(((a + r) * PI) / 180) * 16, 1, "#777")).join("");
  const frame = line(-26, -17, -4, -17, 3, "#d6402f") + line(-4, -17, 6, -40, 3, "#d6402f") + line(6, -40, 26, -17, 3, "#d6402f") + line(-26, -17, 6, -40, 3, "#d6402f") + line(6, -40, 12, -48, 3, "#444");
  const rider = person(t, { x: 0, y: 4, s: 0.7, pose: "cycle", speed: 1.0, shirt: "#3c7dd9" }).replace(/<ellipse[^>]*rgba\(0,0,0,\.2\)"\/>/, "");
  return ell(o.x, o.y + 1, 34 * s, 5 * s, "rgba(0,0,0,.2)") + G(o.x, o.y, 0, (o.face ?? 1) * s, s, wheel(-26) + wheel(26) + frame + G(-2, -20, 0, 1, 1, rider));
}

/* ------------------------------------------------------------------ efeitos */

function waves(t: number, y0: number, y1: number, seed: string): string {
  const rows = 7, r = rngFrom(seed + "w"), out: string[] = [];
  for (let i = 0; i < rows; i++) {
    const y = y0 + ((y1 - y0) * (i + 0.6)) / (rows + 0.4), amp = 2.5 + i * 0.9, ph = r() * 6, sp = (0.5 + i * 0.12) * (i % 2 ? 1 : -1);
    let d = "";
    for (let x = -20; x <= LIFE_W + 20; x += 40) d += (x === -20 ? "M" : "L") + `${x} ${f(y + sin(x * 0.02 + t * sp + ph) * amp)}`;
    out.push(`<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${f(0.22 + i * 0.03)}" stroke-width="${f(1.6 + i * 0.25)}" stroke-linecap="round" stroke-dasharray="${60 + i * 14} ${44 + i * 10}" stroke-dashoffset="${f(-t * (14 + i * 4) * (i % 2 ? 1 : -1))}"/>`);
  }
  return out.join("");
}
function shimmer(t: number, y0: number, y1: number, seed: string, n = 16): string {
  const r = rngFrom(seed + "s");
  return Array.from({ length: n }, (_, i) => {
    const x = r() * LIFE_W, y = y0 + r() * (y1 - y0), ph = r() * 6, a = Math.max(0, sin(t * 1.8 + ph));
    return `<path d="M${f(x - 7 * a)} ${f(y)} L${f(x + 7 * a)} ${f(y)}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${f(a * 0.75)}"/>`;
  }).join("");
}
function steam(t: number, x: number, y: number, s = 1, n = 4): string {
  return Array.from({ length: n }, (_, i) => {
    const u = (t * 0.45 + i / n) % 1;
    return circ(x + sin(u * 7 + i) * 6 * s, y - u * 46 * s, (3 + u * 6) * s, "#fff", ` opacity="${f((1 - u) * 0.5)}"`);
  }).join("");
}
function notes(t: number, x: number, y: number, seed: string, n = 5): string {
  const r = rngFrom(seed + "n"), cols = ["#f2b632", "#ffffff", "#e86aa6", "#4ad0c4"];
  return Array.from({ length: n }, (_, i) => {
    const u = (t * 0.32 + i / n + r()) % 1, nx = x + (i - n / 2) * 18 + sin(u * 6 + i) * 14, ny = y - u * 130;
    const c = cols[i % cols.length];
    return `<g opacity="${f(Math.sin(u * PI))}" transform="translate(${f(nx)} ${f(ny)}) rotate(${f(sin(u * 5) * 12)})">${ell(0, 0, 5.5, 4, c, ' transform="rotate(-20)"')}${line(5, -1, 5, -20, 2, c)}<path d="M5 -20 Q12 -17 11 -10" stroke="${c}" stroke-width="2" fill="none"/></g>`;
  }).join("");
}
function motes(t: number, seed: string, n: number, y0: number, y1: number, col = "#fff6d8", big = 3): string {
  const r = rngFrom(seed + "m");
  return Array.from({ length: n }, () => {
    const bx = r() * LIFE_W, by = y0 + r() * (y1 - y0), ph = r() * 6, sp = 0.2 + r() * 0.5;
    const x = bx + sin(t * sp + ph) * 30, y = by + sin(t * sp * 1.3 + ph * 2) * 14, a = 0.25 + 0.55 * ((sin(t * 1.4 + ph) + 1) / 2);
    return circ(x, y, 1 + r() * big, col, ` opacity="${f(a)}"`);
  }).join("");
}
function leaves(t: number, seed: string, n = 10, cols = ["#e0a030", "#d9622b", "#9bbf4a"]): string {
  const r = rngFrom(seed + "l");
  return Array.from({ length: n }, (_, i) => {
    const sp = 14 + r() * 16, ph = r(), x0 = r() * LIFE_W, y = ((t * sp + ph * 900) % 900) - 60, x = x0 + sin(t * 0.8 + i) * 40 + y * 0.12;
    return G(x, y, sin(t * 2 + i) * 60, 1, 1, ell(0, 0, 6, 2.8, cols[i % cols.length]), ` opacity=".85"`);
  }).join("");
}
function confetti(t: number, seed: string, n = 26): string {
  const r = rngFrom(seed + "c"), cols = ["#e8564a", "#f2b632", "#3c7dd9", "#4aa96c", "#e86aa6"];
  return Array.from({ length: n }, (_, i) => {
    const sp = 40 + r() * 40, ph = r(), x0 = r() * LIFE_W, y = ((t * sp + ph * 700) % 700) - 40;
    return G(x0 + sin(t * 1.5 + i) * 22, y, t * 140 + i * 40, 1, Math.abs(sin(t * 5 + i)), `<rect x="-3" y="-2" width="6" height="4" fill="${cols[i % 5]}"/>`);
  }).join("");
}
function sparkles(t: number, seed: string, n: number, y0: number, y1: number, col = "#ffe9a8"): string {
  const r = rngFrom(seed + "sp");
  return Array.from({ length: n }, () => {
    const x = r() * LIFE_W, y = y0 + r() * (y1 - y0), ph = r() * 6, a = Math.max(0, sin(t * 2.2 + ph)), k = 6 * a;
    return `<path d="M${f(x)} ${f(y - k)} L${f(x + k * 0.3)} ${f(y - k * 0.3)} L${f(x + k)} ${f(y)} L${f(x + k * 0.3)} ${f(y + k * 0.3)} L${f(x)} ${f(y + k)} L${f(x - k * 0.3)} ${f(y + k * 0.3)} L${f(x - k)} ${f(y)} L${f(x - k * 0.3)} ${f(y - k * 0.3)} Z" fill="${col}" opacity="${f(a)}"/>`;
  }).join("");
}
function jumpFish(t: number, wy0: number, wy1: number, seed: string): string {
  const P = 9, r = rngFrom(seed + "j"), x0 = 200 + r() * 800, ph = r() * P;
  const u = ((t + ph) % P) / P;
  if (u > 0.2) return "";
  const k = u / 0.2, x = x0 + k * 120, y = (wy0 + wy1) / 2 - sin(k * PI) * 70;
  const ang = (k - 0.5) * 110;
  const splash = k < 0.15 || k > 0.85 ? `<ellipse cx="${f(k < 0.5 ? x0 : x0 + 120)}" cy="${f((wy0 + wy1) / 2)}" rx="${f(8 + sin(k * 12) * 6)}" ry="3" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>` : "";
  return splash + G(x, y, ang, 1.1, 1.1, ell(0, 0, 13, 6, "#7fb6e8") + `<path d="M-11 0 L-21 -6 L-21 6 Z" fill="#7fb6e8"/>` + circ(7, -1.5, 1.4, "#111"));
}
function flame(t: number, x: number, y: number, s = 1): string {
  const k = sin(t * 14 + x) * 1.4, h = 14 + sin(t * 9 + x * 2) * 3;
  return `<ellipse cx="${f(x)}" cy="${f(y - 8 * s)}" rx="${f(14 * s)}" ry="${f(18 * s)}" fill="#ffd27a" opacity=".25"/>` +
    `<path d="M${f(x)} ${f(y - h * s - 4)} Q${f(x + 6 * s + k)} ${f(y - 4 * s)} ${f(x)} ${f(y)} Q${f(x - 6 * s + k)} ${f(y - 4 * s)} ${f(x)} ${f(y - h * s - 4)} Z" fill="#ffb020"/>` + `<ellipse cx="${f(x)}" cy="${f(y - 3 * s)}" rx="${f(2.2 * s)}" ry="${f(4 * s)}" fill="#fff3b0"/>`;
}

/* ------------------------------------------------------------------ conjuntos (cenas completas) */

type Actor = { z: number; draw: (t: number) => string };

function diningSet(t: number, o: { x: number; y: number; s?: number; ph?: number }): string {
  const s = o.s ?? 1, ph = o.ph ?? 0;
  const seat = (x: number, face: 1 | -1, shirt: string, skin: string, pose: Pose, p: number, sc = 0.82) =>
    person(t, { x, y: 0, s: sc, face, pose, ph: p, shirt, skin, hair: p > 2 ? "#8a8a8a" : HAIRS[0] }).replace(/<ellipse[^>]*rgba\(0,0,0,\.2\)"\/>/, "");
  const people = seat(-86, 1, "#e8564a", SKINS[1], "sit-eat", ph) + seat(-34, 1, "#f2b632", SKINS[3], "sit-talk", ph + 1.3, 0.62) + seat(34, -1, "#3c7dd9", SKINS[0], "sit-talk", ph + 2.1) + seat(88, -1, "#9b59b6", SKINS[2], "sit-eat", ph + 3.4);
  const cloth = `<path d="M-130 -46 L130 -46 L140 8 L-140 8 Z" fill="#f4ead2" stroke="#d9c9a0" stroke-width="2"/><rect x="-136" y="-52" width="272" height="9" rx="4" fill="#fffaf0"/>` +
    ell(-60, -56, 22, 5, "#e8d9b0") + ell(0, -56, 22, 5, "#e8d9b0") + ell(60, -56, 22, 5, "#e8d9b0") +
    ell(-60, -59, 16, 3.5, "#cf7a3a") + ell(60, -59, 16, 3.5, "#6fa84a") + `<rect x="-8" y="-72" width="16" height="16" rx="3" fill="#7ab0d8"/>` + circ(0, -78, 7, "#e86a4a");
  return ell(0, 12, 150, 9, "rgba(0,0,0,.18)").replace("<ellipse", "<ellipse") + G(o.x, o.y, 0, s, s, ell(0, 12, 150, 9, "rgba(0,0,0,.14)") + people + cloth + steam(t, -60, -60, 1.1, 3) + steam(t, 60, -60, 1.1, 3));
}

function audience(t: number, seed: string): string {
  const r = rngFrom(seed + "aud"), out: string[] = [];
  const glow = (sin(t * 3.1) + sin(t * 7.3) * 0.6 + 2) / 4; // tremeluzir da tela
  const tint = `hsl(${f(205 + sin(t * 0.7) * 35)} 80% 70%)`;
  for (let row = 0; row < 3; row++) {
    const y = 640 + row * 38, sc = 0.9 + row * 0.18, n = 9 - row;
    for (let i = 0; i < n; i++) {
      const x = 90 + (i + (row % 2 ? 0.5 : 0)) * ((LIFE_W - 180) / (n - 0.5 + (row % 2 ? 0 : 0))) + 0;
      const ph = r() * 6, lean = sin(t * 0.8 + ph) * 3 + (sin(t * 0.3 + ph) > 0.9 ? 6 : 0);
      const hc = pick(r, HAIRS), sh = pick(r, SHIRTS);
      const popcorn = (i + row) % 4 === 0 && sin(t * 1.6 + ph) > 0.5 ? circ(14 * sc, -20 * sc, 3, "#fff3b0") : "";
      out.push(G(x, y, lean, sc, sc, `<path d="M-30 22 Q-30 -4 0 -6 Q30 -4 30 22 Z" fill="#2c2438"/><path d="M-30 22 Q-30 -4 0 -6 Q30 -4 30 22" fill="none" stroke="${tint}" stroke-opacity="${f(0.15 + glow * 0.35)}" stroke-width="3"/>` +
        circ(0, -22, 15, hc) + `<path d="M-15 -24 Q0 -41 15 -24" stroke="${tint}" stroke-opacity="${f(0.2 + glow * 0.5)}" stroke-width="2.5" fill="none"/>` + popcorn + `<rect x="-30" y="22" width="60" height="30" fill="#2c2438" opacity="0" />` + `<circle cx="0" cy="0" r="0" fill="${sh}"/>`));
    }
  }
  return out.join("");
}
function projector(t: number): string {
  const a = 0.1 + ((sin(t * 3.1) + sin(t * 7.3) * 0.6 + 2) / 4) * 0.16;
  const beam = `<path d="M600 760 L330 120 L870 120 Z" fill="#cfe8ff" opacity="${f(a)}"/>`;
  const dust = Array.from({ length: 16 }, (_, i) => {
    const u = (t * 0.07 + i / 16) % 1, x = 600 + (i % 2 ? 1 : -1) * (u * 230) * (0.2 + (i % 5) / 6), y = 760 - u * 560;
    return circ(x, y, 1.6, "#fff", ` opacity="${f(0.7 - u * 0.4)}"`);
  }).join("");
  return beam + dust;
}

function conversationDuo(t: number, o: { x: number; y: number; s?: number; p1Style?: Partial<PersonOpt>; p2Style?: Partial<PersonOpt> }): string {
  const s = o.s ?? 0.88;
  const P = 7.0;
  const u = (t % P) / P;
  const p1Talking = u < 0.48;
  const p2Talking = u >= 0.52;

  const p1 = person(t, {
    x: o.x - 32 * s,
    y: o.y,
    s,
    face: 1,
    pose: p1Talking ? "talk" : "read",
    ph: 0,
    shirt: "#e8564a",
    skin: SKINS[1],
    ...o.p1Style,
  });

  const p2 = person(t, {
    x: o.x + 32 * s,
    y: o.y,
    s,
    face: -1,
    pose: p2Talking ? "talk" : "read",
    ph: 2.5,
    shirt: "#3c7dd9",
    skin: SKINS[3],
    ...o.p2Style,
  });

  const waveX = p1Talking ? o.x - 10 * s : o.x + 10 * s;
  const waveAlpha = (p1Talking || p2Talking) ? 0.35 + 0.35 * Math.abs(sin(t * 6)) : 0;
  const dialogPulse = `<circle cx="${f(waveX)}" cy="${f(o.y - 68 * s)}" r="${f(3.5 * s)}" fill="#f5cf72" opacity="${f(waveAlpha)}"/>`;

  return p1 + p2 + dialogPulse;
}

function beachCouple(t: number, o: { x: number; y: number; s?: number; dir?: 1 | -1; ph?: number; speed?: number }): string {
  const s = o.s ?? 0.85;
  const dir = o.dir ?? 1;
  const sp = o.speed ?? 18;
  const cx = travel(t, sp, o.ph ?? 0.3, 140, dir);
  const w = t * 5 + (o.ph ?? 0);
  const bob = -Math.abs(cos(w)) * 2;

  const p1 = person(t, {
    x: cx - 18 * s * dir,
    y: o.y,
    s,
    face: dir,
    pose: "hold-hand",
    ph: (o.ph ?? 0),
    shirt: "#2fb5b0",
    pants: "#24313f",
    skin: SKINS[2],
  });

  const p2 = person(t, {
    x: cx + 18 * s * dir,
    y: o.y,
    s: s * 0.94,
    face: dir,
    pose: "hold-hand",
    ph: (o.ph ?? 0),
    shirt: "#e86aa6",
    pants: "#f4f1e6",
    robe: true,
    skin: SKINS[0],
    hair: HAIRS[1],
  });

  const handJoin = circ(cx, o.y - 38 * s + bob, 3.5 * s, SKINS[1]);
  const footStep = `<ellipse cx="${f(cx - 38 * s * dir)}" cy="${f(o.y + 2)}" rx="${f(6 * s)}" ry="${f(2 * s)}" fill="#a89078" opacity="${f(0.25 * Math.abs(sin(w)))}"/>`;

  return footStep + p1 + p2 + handJoin;
}

function soccerMatch(t: number, o: { x: number; y: number; s?: number }): string {
  const s = o.s ?? 0.85;
  const P = 4.2;
  const u = (t % P) / P;

  const p1X = o.x - 90 * s;
  const p2X = o.x + 90 * s;
  const groundY = o.y;

  let bx = p1X;
  let by = groundY - 6 * s;
  let ballAlt = 0;
  let p1Pose: Pose = "walk";
  let p2Pose: Pose = "walk";

  if (u < 0.5) {
    const passK = clamp((u - 0.12) / 0.32, 0, 1);
    p1Pose = u < 0.18 ? "kick" : "cheer";
    p2Pose = passK > 0.7 ? "kick" : "walk";
    bx = p1X + passK * (p2X - p1X);
    ballAlt = sin(passK * PI) * 55 * s;
    by = groundY - 8 * s - ballAlt;
  } else {
    const passK = clamp((u - 0.62) / 0.32, 0, 1);
    p2Pose = u < 0.68 ? "kick" : "cheer";
    p1Pose = passK > 0.7 ? "kick" : "walk";
    bx = p2X - passK * (p2X - p1X);
    ballAlt = sin(passK * PI) * 65 * s;
    by = groundY - 8 * s - ballAlt;
  }

  const p1 = person(t, {
    x: p1X,
    y: groundY,
    s,
    face: 1,
    pose: p1Pose,
    shirt: "#3c7dd9",
    pants: "#ffffff",
    skin: SKINS[3],
    speed: 1.4,
  });

  const p2 = person(t, {
    x: p2X,
    y: groundY,
    s,
    face: -1,
    pose: p2Pose,
    shirt: "#e8564a",
    pants: "#24313f",
    skin: SKINS[1],
    speed: 1.4,
  });

  const shadowR = Math.max(3, (9 - ballAlt * 0.08) * s);
  const shadowAlpha = clamp(0.4 - ballAlt * 0.005, 0.1, 0.45);
  const ballShadow = ell(bx, groundY + 1, shadowR * 1.5, shadowR * 0.5, `rgba(0,0,0,${f(shadowAlpha)})`);

  const ballRot = t * 380;
  const ball = G(
    bx,
    by,
    ballRot,
    s,
    s,
    `<circle cx="0" cy="0" r="8" fill="#ffffff" stroke="#222" stroke-width="1.2"/>` +
      `<path d="M-3 -4 L3 -4 L5 2 L-1 6 L-5 1 Z" fill="#222"/>` +
      `<circle cx="0" cy="0" r="1.5" fill="#ffffff"/>`
  );

  const pitchLine = `<line x1="${f(p1X - 30 * s)}" y1="${f(groundY + 2)}" x2="${f(p2X + 30 * s)}" y2="${f(groundY + 2)}" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="14 10"/>`;

  return pitchLine + ballShadow + p1 + p2 + ball;
}

function playingAnimals(t: number, o: { x: number; y: number; s?: number; ph?: number }): string {
  const s = o.s ?? 0.9;
  const P = 6.0;
  const u = ((t + (o.ph ?? 0)) % P) / P;

  const d1X = o.x - 50 * s + sin(t * 2.2) * 35 * s;
  const d2X = o.x + 35 * s + sin(t * 2.2 + 0.6) * 35 * s;
  const chasing = u < 0.5;

  const ballX = chasing ? d1X + 18 * s : d2X - 18 * s;
  const ballHop = Math.abs(sin(t * 8)) * 14 * s;
  const ball = circ(ballX, o.y - 6 * s - ballHop, 5 * s, "#e8564a", ' stroke="#fff" stroke-width="1"');
  const ballShadow = ell(ballX, o.y + 1, 6 * s, 2 * s, "rgba(0,0,0,0.18)");

  const d1 = dog(t, {
    x: d1X,
    y: o.y,
    s,
    face: (d2X > d1X ? 1 : -1),
    color: "#c4793a",
    ph: (o.ph ?? 0),
  });

  const d2 = dog(t, {
    x: d2X,
    y: o.y,
    s: s * 0.85,
    face: (d1X > d2X ? 1 : -1),
    color: "#2b2b2b",
    ph: (o.ph ?? 0) + 1.2,
  });

  return ballShadow + ball + d1 + d2;
}

function sharkHunt(t: number, wy0: number, wy1: number, seed: string): string {
  const P = 14;
  const u = (t % P) / P;
  const fishY = wy0 + (wy1 - wy0) * 0.62;
  const x0 = -120 + u * (LIFE_W + 360);

  const gap = 310 - 275 * clamp(u / 0.75, 0, 1);
  const sx = x0 - gap;
  const strike = u > 0.74 && u < 0.88;

  const fishes = Array.from({ length: 7 }, (_, i) => {
    const eaten = i === 6 && u > 0.8;
    if (eaten) return "";
    const scatterAngle = (i - 3) * 0.35;
    const scatterDist = u > 0.72 ? (u - 0.72) * 160 : 0;
    const fx = x0 + (i % 3) * 24 + cos(scatterAngle) * scatterDist;
    const fy = fishY + (i - 3) * 8 + sin(scatterAngle) * scatterDist + sin(t * 3 + i) * 5;
    const color = i % 2 ? "#f2a03c" : "#7fb6e8";
    return fish(t, { x: fx, y: fy, s: 0.95, ph: i, color, alpha: 0.88 });
  }).join("");

  const finSurface = u > 0.25 && u < 0.72
    ? `<path d="M${f(sx + 10)} ${f(fishY - 22)} L${f(sx + 24)} ${f(fishY - 48)} L${f(sx + 36)} ${f(fishY - 22)} Z" fill="#4a5c6e"/><ellipse cx="${f(sx + 24)}" cy="${f(fishY - 20)}" rx="28" ry="3.5" fill="#ffffff" opacity=".65"/>`
    : "";

  const splash = strike
    ? `<ellipse cx="${f(sx + 50)}" cy="${f(fishY - 8)}" rx="${f(24 + sin(t * 12) * 8)}" ry="6" fill="none" stroke="#ffffff" stroke-width="2.5" opacity=".85"/>` +
      `<circle cx="${f(sx + 40)}" cy="${f(fishY - 24)}" r="3" fill="#ffffff" opacity=".8"/>` +
      `<circle cx="${f(sx + 62)}" cy="${f(fishY - 28)}" r="2.5" fill="#ffffff" opacity=".7"/>`
    : "";

  const sharkActor = shark(t, { x: sx, y: fishY + 8, s: 1.15, ph: 1 });

  return fishes + finSurface + sharkActor + splash;
}

function phoneWalker(t: number, o: { x: number; y: number; s?: number; dir?: 1 | -1; speed?: number; ph?: number; shirt?: string }): string {
  const dir = o.dir ?? 1;
  const sp = o.speed ?? 19;
  const x = travel(t, sp, o.ph ?? 0.2, 120, dir);
  return person(t, {
    x,
    y: o.y,
    s: o.s ?? 0.9,
    face: dir,
    pose: "phone",
    ph: (o.ph ?? 0) * 6,
    speed: 1,
    shirt: o.shirt ?? "#3c7dd9",
    pants: "#2f3e5c",
    skin: SKINS[2],
  });
}

function culturalParty(t: number, o: { x: number; y: number; s?: number }): string {
  const s = o.s ?? 0.9;
  const y = o.y;

  const dancers = [0, 1].map((i) => {
    const dx = o.x - 70 * s + i * 45 * s;
    return person(t, {
      x: dx,
      y: y + (i % 2) * 10 * s,
      s: s * 0.95,
      pose: "dance",
      ph: i * 1.4,
      skin: SKINS[(i + 1) % 6],
      shirt: i === 0 ? "#e8564a" : "#f2b632",
    });
  }).join("");

  const drummer = ell(o.x + 20 * s, y - 24 * s, 18 * s, 22 * s, "#a86a38") +
    ell(o.x + 20 * s, y - 44 * s, 18 * s, 5 * s, "#f4e6c0") +
    person(t, { x: o.x - 14 * s, y, s: s * 0.9, pose: "drum", shirt: "#4aa96c", skin: SKINS[4] });

  const talkers = person(t, { x: o.x + 85 * s, y, s: s * 0.9, face: 1, pose: "talk", shirt: "#9b59b6", skin: SKINS[2] }) +
    person(t, { x: o.x + 130 * s, y: y + 2, s: s * 0.9, face: -1, pose: "cheer", shirt: "#ef8a3d", skin: SKINS[0] });

  const festiveNotes = notes(t, o.x + 20 * s, y - 80 * s, "cp", 4);

  return dancers + drummer + talkers + festiveNotes;
}

function taskRobots(t: number, o: { x: number; y: number; s?: number }): string {
  const s = o.s ?? 0.88;
  const r1 = robot(t, { x: o.x - 55 * s, y: o.y, s, mode: "carry", ph: 0.5 });
  const r2 = robot(t, { x: o.x + 45 * s, y: o.y, s, mode: "clean", ph: 1.8, face: -1 });
  const tech = person(t, { x: o.x + 115 * s, y: o.y, s, face: -1, pose: "type", shirt: "#3c7dd9", skin: SKINS[1] });
  return r1 + r2 + tech;
}

/* ------------------------------------------------------------------ zonas (análise da imagem) */

const DEFAULT_ZONES: SceneZones = { water: null, groundTop: 560 };

/** Analisa a imagem (transparência + cor) e descobre onde há água e onde fica o chão. Roda no navegador. */
export function analyzeSceneZones(img: CanvasImageSource, iw: number, ih: number): SceneZones | null {
  try {
    if (typeof document === "undefined" || !iw || !ih) return null;
    const W = 60, H = 40, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    const sc = Math.max(W / iw, H / ih);
    ctx.drawImage(img, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
    const d = ctx.getImageData(0, 0, W, H).data;
    const waterRow: number[] = [], opaqueRow: number[] = [];
    for (let y = 0; y < H; y++) {
      let wc = 0, oc = 0;
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4, a = d[i + 3];
        if (a < 140) continue;
        oc++;
        const r = d[i], g = d[i + 1], b = d[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        if (mx - mn > 55 && b >= r + 30 && g >= r + 20 && (r + g + b) / 3 > 105) wc++;
      }
      waterRow.push(wc / W); opaqueRow.push(oc / W);
    }
    let y0 = -1, y1 = -1;
    for (let y = Math.floor(H * 0.28); y < H; y++) {
      if (waterRow[y] >= 0.35) { if (y0 < 0) y0 = y; y1 = y; }
      else if (y0 >= 0 && y - y1 > 2) break;
    }
    const water = y0 >= 0 && y1 - y0 >= 3 ? { y0: (y0 / H) * LIFE_H, y1: ((y1 + 1) / H) * LIFE_H } : null;
    let gt: number;
    if (water) gt = water.y1 + 6;
    else {
      let first = Math.floor(H * 0.5);
      for (let y = Math.floor(H * 0.4); y < H; y++) if (opaqueRow[y] > 0.85) { first = y; break; }
      gt = (first / H) * LIFE_H;
    }
    return { water, groundTop: clamp(gt, 500, 640) };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ direção da cena */

const THEME_KEYS: Array<[RegExp, string]> = [
  [/tecnolog/, "tecnologia"], [/natur/, "natureza"], [/cultur/, "cultura"], [/turism/, "turismo"], [/interior/, "interior"],
  [/danc/, "danca"], [/geograf/, "geografia"], [/histor/, "historia"], [/cinem/, "cinema"], [/music|musica/, "musica"],
  [/lazer/, "lazeres"], [/estoic/, "estoicismo"], [/relig/, "religiao"], [/gastron/, "gastronomia"],
  [/idioma/, "idiomas"],
];

/** Surfista que cruza o mar de vez em quando (mesma agenda do som "surf" em storySoundscape). */
function surfer(t: number, y0: number, y1: number): string {
  if (t < SURF_FIRST_SECONDS) return "";
  const local = (t - SURF_FIRST_SECONDS) % SURF_PERIOD_SECONDS;
  if (local > SURF_RIDE_SECONDS) return "";
  const p = local / SURF_RIDE_SECONDS;
  const x = -90 + p * 1380;
  const y = y0 + (y1 - y0) * 0.5 + Math.sin(t * 2.4) * 4;
  const fade = Math.min(1, p / 0.08, (1 - p) / 0.08);
  const lean = Math.sin(t * 2.4) * 4 - 6;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})" opacity="${fade.toFixed(2)}">
    <path d="M-86,20 Q-52,-34 -4,-8 Q30,-26 84,20 Z" fill="#e8f9ff" opacity=".92"/>
    <path d="M-96,22 Q0,-6 98,22 L98,34 L-96,34 Z" fill="#5cc8e8" opacity=".85"/>
    <g transform="rotate(${lean.toFixed(1)} 0 6)">
      <ellipse cx="0" cy="4" rx="34" ry="4.5" fill="#ffd166" stroke="#c77d0a" stroke-width="1.4"/>
      <path d="M-6,2 L-8,-20 M8,2 L6,-20" stroke="#25303b" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,-20 L2,-42" stroke="#e63946" stroke-width="9" stroke-linecap="round"/>
      <path d="M2,-36 L-20,-28 M2,-36 L22,-30" stroke="#f1c27d" stroke-width="4" stroke-linecap="round"/>
      <circle cx="3" cy="-50" r="7" fill="#f1c27d"/>
      <path d="M-3,-54 Q3,-62 10,-54" fill="#3b2a20"/>
    </g>
  </g>`;
}

function driftingCloud(t: number, y: number, s = 1, sp = 10, seed = "c"): string {
  const r = rngFrom(seed + "dc");
  const x = travel(t, sp, r(), 220, 1);
  return G(x, y, sin(t * 0.3) * 1.5, s, s,
    `<ellipse cx="0" cy="0" rx="60" ry="18" fill="#ffffff" opacity="0.45"/>` +
    `<ellipse cx="-20" cy="-6" rx="35" ry="22" fill="#ffffff" opacity="0.55"/>` +
    `<ellipse cx="22" cy="-4" rx="38" ry="20" fill="#ffffff" opacity="0.52"/>` +
    `<ellipse cx="0" cy="-12" rx="26" ry="16" fill="#ffffff" opacity="0.6"/>`
  );
}

function birdPair(t: number, y0 = 90, seed = "bp"): string {
  const r = rngFrom(seed);
  const x = travel(t, 26, r(), 120, 1);
  const y = y0 + sin(t * 1.1) * 12;
  const b1 = bird(t, { x: 0, y: 0, s: 1.0, ph: 0, face: 1 });
  const b2 = bird(t, { x: -38, y: 14 + sin(t * 1.4) * 6, s: 0.85, ph: 0.45, face: 1 });
  return G(x, y, sin(t * 0.6) * 3, 1, 1, b1 + b2);
}

export function createSceneLife(input: LifeInput): LifeScene {
  const text = norm([input.title ?? "", ...(input.elements ?? []).flatMap((e) => [e.pt ?? "", e.kreyol ?? "", e.fr ?? ""])].join(" "));
  const themeNorm = norm(input.theme ?? "");
  const theme = THEME_KEYS.find(([re]) => re.test(themeNorm))?.[1] ?? THEME_KEYS.find(([re]) => re.test(norm(input.sceneId)))?.[1] ?? THEME_KEYS.find(([re]) => re.test(text))?.[1] ?? "natureza";
  const has = (re: RegExp) => re.test(text);
  const idBase = norm(input.sceneId).replace(/\.(svg|png|webp|jpg)$/g, "").split("/").pop() ?? "";
  // As cenas de Idiomas já trazem professor/alunos e balões de conversa desenhados e uma mesa em primeiro plano:
  // atores extras andando por cima cobririam os objetos rotulados (cenário limpo).
  if (NATIVE_LIFE_IDS.has(idBase) || theme === "idiomas" || idBase.startsWith("idiomas")) return { actors: [], render: () => "" };

  const zones = input.zones ?? DEFAULT_ZONES;
  const wz = zones.water;
  const GT = zones.groundTop;
  const r = rngFrom(input.sceneId + theme);
  const actors: Actor[] = [];
  const names: string[] = [];
  const add = (name: string, z: number, draw: (t: number) => string) => { names.push(name); actors.push({ z, draw }); };

  const wantsSea = !!wz;
  const landMin = wz ? Math.max(GT, wz.y1 + 10) : GT;
  const gyL = (k: number) => clamp(landMin + 30 + (735 - landMin - 30) * k, 520, 735);
  const sc = (y: number) => 0.85 * depth(y, landMin) + 0.15;

  /* --- 1. ZONA AQUÁTICA (se houver água detectada na cena) --- */
  if (wantsSea && wz) {
    const mid = wz.y0 + (wz.y1 - wz.y0) * 0.5;
    const lo = wz.y0 + (wz.y1 - wz.y0) * 0.78;
    add("ondas", 1, (t) => waves(t, wz.y0, wz.y1, input.sceneId) + shimmer(t, wz.y0, wz.y1, input.sceneId));
    if (wz.y1 - wz.y0 >= 95) {
      add("surfista", mid, (t) => surfer(t, wz.y0, wz.y1));
    }

    // Ação aquática principal: caça de tubarão, casal na praia, ou veleiro/remadores
    if (has(/barco|bato|veleiro|porto|canoa|chaloup|bateau/)) {
      const dir = r() > 0.5 ? 1 : -1;
      add("veleiro", mid, (t) => sailboat(t, { x: travel(t, 16, 0.2, 140, dir), y: mid, s: 0.95, face: dir as 1 | -1 }));
      add("remadores", lo, (t) => rowboat(t, { x: travel(t, 9, 0.7, 140, -dir), y: lo, s: 1.05, face: (-dir) as 1 | -1, ph: 2 }));
    } else if (has(/praia|plaj|plage|areia|sand|costa|beira/) || theme === "turismo") {
      const shoreY = clamp(wz.y1 + 16, 540, 730);
      add("casal-passeando-na-praia", shoreY, (t) => beachCouple(t, { x: 480, y: shoreY, s: sc(shoreY) * 1.05, dir: 1 }));
      add("peixe-saltando", mid, (t) => jumpFish(t, wz.y0, wz.y1, input.sceneId));
    } else {
      // Padrão aquático dinâmico e realista: tubarão caçando e comendo peixes
      add("tubarao-cacando-peixes", mid + 12, (t) => sharkHunt(t, wz.y0, wz.y1, input.sceneId));
      add("peixe-saltando", mid, (t) => jumpFish(t, wz.y0, wz.y1, input.sceneId));
    }

    // Aves marinhas discretas no alto
    add("gaivotas", 0, (t) => bird(t, { x: travel(t, 28, 0.2, 80, 1), y: Math.min(150, wz.y0 - 50), s: 1.1, ph: 0, face: 1 }));
  }

  /* --- 2. ZONA TERRESTRE (Cenário limpo, bem organizado e perfeitamente visível) --- */
  // O chão é organizado em duas pistas espaciais equilibradas e não-conflitantes:
  // - Pista Principal A (centro-esquerda x: 380-480): Ação focal da narrativa da história
  // - Pista Secundária B (lateral-direita x: 780-920): Ator complementar suave (celular, casal ou caminhante)
  const yFocal = gyL(0.55);
  const ySec = gyL(0.85);

  // --- Ação Focal Principal ---
  if (has(/futebol|bola|estadio|quadra|gol|foot|ballon|jogo\b|jogadores/) || (theme === "lazeres" && has(/bola|jogo/))) {
    add("jogo-de-futebol", yFocal, (t) => soccerMatch(t, { x: 420, y: yFocal, s: sc(yFocal) }));
  } else if (theme === "gastronomia" || has(/almoco|jantar|refeicao|restaurante|comer|comida|ceia|table|diner|repas/)) {
    add("pessoas-conversando-no-almoco", yFocal, (t) => diningSet(t, { x: 460, y: yFocal, s: 1.25 * depth(yFocal, landMin) }));
  } else if (theme === "tecnologia" || has(/robo|robot|tarefa|laborat|computad|tecnolog|maquina/)) {
    add("robos-fazendo-tarefas", yFocal, (t) => taskRobots(t, { x: 420, y: yFocal, s: sc(yFocal) }));
  } else if (theme === "cultura" || theme === "danca" || has(/festa|cultura|danca|carnaval|tambor|fete|danse/)) {
    add("festa-cultural", yFocal, (t) => culturalParty(t, { x: 430, y: yFocal, s: sc(yFocal) }));
  } else if (theme === "natureza" || theme === "interior" || has(/animal|animais|cachorro|cao|brinc|briga|chen|chien|pet\b/)) {
    add("animais-brincando-e-brigando", yFocal, (t) => playingAnimals(t, { x: 420, y: yFocal, s: sc(yFocal) }));
  } else if (theme === "cinema" || has(/cinema|filme|tela/)) {
    add("plateia-cinema", 700, (t) => audience(t, input.sceneId));
    add("projetor", 0, (t) => projector(t));
  } else if (theme === "musica" || has(/musica|banda|violao|guitarra/)) {
    add("banda-musical", yFocal, (t) =>
      person(t, { x: 380, y: yFocal, s: sc(yFocal), pose: "guitar", shirt: "#e8564a", skin: SKINS[2] }) +
      person(t, { x: 490, y: yFocal, s: sc(yFocal), face: -1, pose: "drum", shirt: "#3c7dd9" }) +
      notes(t, 435, yFocal - 75 * sc(yFocal), input.sceneId, 4)
    );
  } else if (theme === "historia") {
    add("cavaleiro-historico", yFocal, (t) => {
      const hx = travel(t, 46, 0.4, 120);
      return horse(t, { x: hx, y: yFocal, s: 1.05 * depth(yFocal, landMin) + 0.1, ph: 0 }) +
        person(t, { x: hx - 2, y: yFocal - 38 * (1.05 * depth(yFocal, landMin) + 0.1), s: 0.55, pose: "ride", shirt: "#8a2a2a", hat: "#555" });
    });
  } else {
    // Pessoas conversando naturalmente com gestos de diálogo
    add("pessoas-conversando", yFocal, (t) => conversationDuo(t, { x: 420, y: yFocal, s: sc(yFocal) }));
  }

  // --- Ator Secundário Complementar (lateral direita, espaço limpo) ---
  if (!wantsSea || wz.y1 < 600) {
    if (has(/celular|telefone|telefon|phone|smartphone|chamada/) || r() > 0.4) {
      add("pessoa-falando-no-celular", ySec, (t) => phoneWalker(t, { x: 820, y: ySec, s: sc(ySec) * 1.05, dir: -1, shirt: pick(r, SHIRTS) }));
    } else if (has(/casal|namorados|passeio/) || theme === "turismo") {
      add("casal-passeando", ySec, (t) => beachCouple(t, { x: 800, y: ySec, s: sc(ySec) * 1.02, dir: 1 }));
    } else {
      add("pessoas-conversando-2", ySec, (t) => conversationDuo(t, { x: 820, y: ySec, s: sc(ySec) * 0.95, p1Style: { shirt: "#2fb5b0" }, p2Style: { shirt: "#e86aa6" } }));
    }
  }

  /* --- 3. AMBIENTE DISCRETO NO CÉU E NA NATUREZA (Rico em detalhes, poético e imersivo) --- */
  // Nuvem suave e realista à deriva no céu superior
  add("nuvens-ao-vento", 0, (t) => driftingCloud(t, 85, 0.95, 12, input.sceneId));

  if (!wantsSea) {
    if (theme === "turismo" || has(/aviao|voo|aeroporto/)) {
      add("aviao", 0, (t) => plane(t, { x: travel(t, 32, 0.15, 200, -1), y: 125 + sin(t * 0.3) * 8, s: 0.75, face: -1 }));
      add("aves-no-horizonte", 0, (t) => birdPair(t, 160, input.sceneId));
    } else {
      add("par-de-aves", 0, (t) => birdPair(t, 105, input.sceneId));
      add("borboletas", 0, (t) => butterfly(t, { cx: 280, cy: GT - 35, ph: 1.5, color: "#f08a2b" }) + butterfly(t, { cx: 340, cy: GT - 20, ph: 3.2, color: "#4ad0c4" }));
      add("particulas-de-luz", 0, (t) => motes(t, input.sceneId, 12, 120, 680, "#fff5d0", 2.5));
    }
    // Efeito suave de brisa natural (folhas ou pétalas de acordo com o tema)
    if (theme === "natureza" || theme === "interior" || theme === "lazeres") {
      add("folhas-ao-vento", 1, (t) => leaves(t, input.sceneId, 8, ["#e0a030", "#d9622b", "#88b04b"]));
    }
  } else {
    // Na zona marítima, adiciona gaivotas em pares e reflexos solares na água
    add("par-de-gaivotas", 0, (t) => birdPair(t, Math.min(140, wz.y0 - 45), input.sceneId));
    add("brilho-solar-maritimo", 0, (t) => motes(t, input.sceneId, 8, 80, wz.y0, "#fff8e0", 2));
  }

  // Ordenação por profundidade z para composição impecável
  actors.sort((a, b) => a.z - b.z);
  return {
    actors: Array.from(new Set(names)),
    render: (t: number) => {
      let out = "";
      for (const a of actors) {
        try { out += a.draw(t); } catch { /* ator com falha não derruba a cena */ }
      }
      return out;
    },
  };
}

/** Documento SVG completo da camada de vida no instante t (para desenhar no canvas / injetar no player). */
export function lifeSvgDocument(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LIFE_W} ${LIFE_H}" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}
