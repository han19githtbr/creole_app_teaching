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
  | "read" | "pray" | "stir" | "sit-eat" | "sit-talk" | "row" | "cycle" | "ride" | "photo";

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
  const shadow = ell(o.x, o.y + 1, 22 * s, 5 * s, "rgba(0,0,0,.2)");
  const face = o.face ?? 1;
  return shadow + G(o.x, o.y + bob, 0, face * s * sx, s, legs + torso);
}

/* ------------------------------------------------------------------ robô */

function robot(t: number, o: { x: number; y: number; s?: number; face?: 1 | -1; mode: "wave" | "work" | "nod"; ph?: number }): string {
  const s = o.s ?? 0.85, w = t + (o.ph ?? 0);
  const arm = o.mode === "wave" ? -2.6 + sin(w * 7) * 0.4 : o.mode === "work" ? -1.2 + sin(w * 9) * 0.1 : -0.2;
  const blink = sin(w * 3) > 0 ? "#38f5a0" : "#1b8a5c";
  const [hx, hy] = end(14, -62, 26, arm);
  const body =
    `<rect x="-12" y="-30" width="9" height="30" rx="3" fill="#8a95a3"/><rect x="3" y="-30" width="9" height="30" rx="3" fill="#8a95a3"/>` +
    `<rect x="-17" y="-70" width="34" height="42" rx="8" fill="#c9d3de" stroke="#5c6b7a" stroke-width="2"/>` +
    circ(0, -50, 6, blink) + line(14, -62, hx, hy, 6, "#8a95a3") + circ(hx, hy, 5, "#5c6b7a") +
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

export function createSceneLife(input: LifeInput): LifeScene {
  const text = norm([input.title ?? "", ...(input.elements ?? []).flatMap((e) => [e.pt ?? "", e.kreyol ?? "", e.fr ?? ""])].join(" "));
  const themeNorm = norm(input.theme ?? "");
  const theme = THEME_KEYS.find(([re]) => re.test(themeNorm))?.[1] ?? THEME_KEYS.find(([re]) => re.test(norm(input.sceneId)))?.[1] ?? THEME_KEYS.find(([re]) => re.test(text))?.[1] ?? "natureza";
  const has = (re: RegExp) => re.test(text);
  const idBase = norm(input.sceneId).replace(/\.(svg|png|webp|jpg)$/g, "").split("/").pop() ?? "";
  if (NATIVE_LIFE_IDS.has(idBase)) return { actors: [], render: () => "" };

  const zones = input.zones ?? DEFAULT_ZONES;
  const wz = zones.water;
  const GT = zones.groundTop;
  const r = rngFrom(input.sceneId + theme);
  const actors: Actor[] = [];
  const names: string[] = [];
  const add = (name: string, z: number, draw: (t: number) => string) => { names.push(name); actors.push({ z, draw }); };
  const gy = (k: number) => GT + 34 + (735 - GT - 34) * clamp(k, 0, 1);
  const wantsSea = !!wz;
  const personStyle = () => ({ skin: pick(r, SKINS), shirt: pick(r, SHIRTS), pants: pick(r, PANTS), hair: pick(r, HAIRS) });

  /* --- mar / rio / lago: ondas, barcos com remadores, peixes e tubarões caçando --- */
  if (wantsSea && wz) {
    const mid = wz.y0 + (wz.y1 - wz.y0) * 0.5, lo = wz.y0 + (wz.y1 - wz.y0) * 0.78;
    add("ondas", 1, (t) => waves(t, wz.y0, wz.y1, input.sceneId) + shimmer(t, wz.y0, wz.y1, input.sceneId));
    if (wz.y1 - wz.y0 >= 100) add("surfista", mid, (t) => surfer(t, wz.y0, wz.y1));
    const dir = r() > 0.5 ? 1 : -1;
    const boatTheme = ["turismo", "geografia", "lazeres", "historia", "natureza", "religiao", "cultura"].includes(theme) || has(/barco|bato|veleiro|porto|canoa|pesc|mar|lanme|praia|rio|lago|ilha/);
    if (boatTheme) {
      const y1 = mid, ph = r();
      add("veleiro", y1, (t) => sailboat(t, { x: travel(t, 16, ph, 140, dir), y: y1, s: 0.95, face: dir as 1 | -1, hull: pick(rngFrom("h" + input.sceneId), ["#c8453a", "#2f6fb5", "#e0a030"]) }));
      const y2 = lo, ph2 = r();
      add("remadores", y2, (t) => rowboat(t, { x: travel(t, 9, ph2, 140, -dir), y: y2, s: 1.05, face: (-dir) as 1 | -1, ph: ph2 * 6 }));
    }
    const fishY = wz.y0 + (wz.y1 - wz.y0) * 0.62;
    // cardume fugindo de um tubarão (o tubarão aproxima, o cardume se espalha e tudo recomeça)
    add("tubarao-cacando-peixes", fishY, (t) => {
      const P = 16, u = (t % P) / P, x0 = -140 + u * (LIFE_W + 420);
      const gap = 330 - 270 * clamp(u / 0.8, 0, 1);
      const fishes = Array.from({ length: 7 }, (_, i) => {
        const scatter = u > 0.78 ? (u - 0.78) / 0.22 : 0, fx = x0 + (i % 3) * 22 + (i % 2) * 8, fy = fishY + sin(t * 2 + i) * 6 + (i - 3) * 6 + (i % 2 ? 1 : -1) * scatter * 40;
        const eaten = i === 6 && u > 0.8;
        return eaten ? "" : fish(t, { x: fx, y: fy, s: 0.95, ph: i, color: i % 2 ? "#f2a03c" : "#7fb6e8", alpha: 0.85 });
      }).join("");
      const sx = x0 - gap;
      const surface = u > 0.2 && u < 0.7 ? `<path d="M${f(sx + 10)} ${f(fishY - 24)} L${f(sx + 22)} ${f(fishY - 46)} L${f(sx + 34)} ${f(fishY - 24)} Z" fill="#566a7d"/><ellipse cx="${f(sx + 22)}" cy="${f(fishY - 22)}" rx="30" ry="3" fill="#fff" opacity=".6"/>` : "";
      return fishes + shark(t, { x: sx, y: fishY + 8, s: 1.1, ph: 1 }) + surface;
    });
    add("peixe-saltando", mid, (t) => jumpFish(t, wz.y0, wz.y1, input.sceneId));
    for (let i = 0; i < 2; i++) { const ph = r(), yy = wz.y0 - 70 - r() * 80; add("gaivotas", 0, (t) => bird(t, { x: travel(t, 30 + i * 9, ph, 80, i ? -1 : 1), y: yy, s: 1 + i * 0.2, ph: i * 2, face: i ? -1 : 1 })); }
    if (has(/pato|duck|marre/)) add("patos", mid, (t) => ell(travel(t, 8, 0.3, 80), mid + 4, 14, 8, "#fff", ` opacity=".95"`) + circ(travel(t, 8, 0.3, 80) + 12, mid - 6, 6, "#fff") + `<path d="M${f(travel(t, 8, 0.3, 80) + 17)} ${f(mid - 6)} l7 2 l-7 2z" fill="#f2a030"/>`);
  }

  /* --- terra: elenco por tema --- */
  const landMin = wz ? Math.max(GT, wz.y1 + 10) : GT;
  const gyL = (k: number) => clamp(landMin + 34 + (735 - landMin - 34) * k, 520, 735);
  const walker = (ph: number, y: number, dir: 1 | -1, speed: number, o?: Partial<PersonOpt>) =>
    add("pessoa-caminhando", y, (t) => person(t, { x: travel(t, speed, ph, 80, dir), y, s: 0.95 * depth(y, landMin) + 0.2, face: dir, pose: "walk", ph: ph * 9, ...personStyle0(ph), ...o }));
  function personStyle0(seedN: number) { const rr = rngFrom(input.sceneId + "p" + seedN); return { skin: pick(rr, SKINS), shirt: pick(rr, SHIRTS), pants: pick(rr, PANTS), hair: pick(rr, HAIRS) }; }
  const sc = (y: number) => 0.95 * depth(y, landMin) + 0.2;
  const at = (name: string, y: number, fn: (t: number) => string) => add(name, y, fn);

  switch (theme) {
    case "tecnologia": {
      const y = gyL(0.5), x = 250 + r() * 200;
      at("humano-e-robo", y, (t) => person(t, { x, y, s: sc(y), pose: "type", skin: SKINS[1], shirt: "#3c7dd9" }) + robot(t, { x: x + 80, y, s: sc(y), face: -1, mode: "wave" }) + sparkles(t, "tc", 6, y - 120, y - 40, "#7ff0c8"));
      const y2 = gyL(0.8), x2 = 760 + r() * 200;
      at("humano-robo-colaborando", y2, (t) => robot(t, { x: x2, y: y2, s: sc(y2), mode: "work", ph: 1 }) + person(t, { x: x2 + 84, y: y2, s: sc(y2), face: -1, pose: "point", shirt: "#f2b632", skin: SKINS[3] }));
      add("drone", 0, (t) => { const dx = travel(t, 40, r(), 100), dy = 150 + sin(t * 0.8) * 25; return G(dx, dy, sin(t * 1.4) * 6, 1, 1, ell(0, 0, 14, 6, "#f2b632") + [-22, 22].map((px) => `<ellipse cx="${px}" cy="-7" rx="${f(14 * Math.abs(cos(t * 40)))}" ry="2" fill="#dfe6ee" opacity=".8"/>`).join("") + circ(0, 6, 3, "#38f5a0")); });
      walker(0.2, gyL(0.65), 1, 22);
      break;
    }
    case "natureza": {
      const y = gyL(0.55);
      at("coelho-e-raposa", y, (t) => {
        const P = 15, u = (t % P) / P, rx = -80 + u * 1300, gap = 280 - 215 * clamp(u / 0.8, 0, 1), hide = u > 0.88 ? clamp((u - 0.88) / 0.08, 0, 1) : 0;
        const fxp = rx - gap + (u > 0.88 ? (u - 0.88) * 200 : 0);
        return rabbit(t, { x: rx, y, s: 1.2, mode: "run", ph: 1 }).replace(/<g /, `<g opacity="${f(1 - hide)}" `) + fox(t, { x: fxp, y: y + 4, s: 0.9, ph: 0 });
      });
      const y2 = gyL(0.9);
      at("cervos", y2, (t) => deer(t, { x: 300, y: y2, s: 1, ph: 0 }) + deer(t, { x: 380, y: y2 - 6, s: 0.7, face: -1, ph: 2 }));
      for (let i = 0; i < 3; i++) { const cx = 250 + i * 320, cy = GT - 20 - r() * 40, ph = r() * 6; add("borboletas", 0, (t) => butterfly(t, { cx, cy, ph, color: pick(rngFrom("b" + i), ["#f08a2b", "#3c9bd9", "#f2d22b"]) })); }
      for (let i = 0; i < 2; i++) { const ph = r(), yy = 110 + r() * 80; add("passaros", 0, (t) => bird(t, { x: travel(t, 34, ph, 80, i ? -1 : 1), y: yy, ph: i, face: i ? -1 : 1, color: "#fff" })); }
      break;
    }
    case "cultura": {
      const y = gyL(0.6);
      [0, 1, 2].forEach((i) => { const x = 360 + i * 120; at("dancarinos", y + i, (t) => person(t, { x, y: y + i, s: sc(y), pose: "dance", ph: i * 1.1, skin: SKINS[(i + 2) % 6], shirt: SHIRTS[(i * 3) % 9] })); });
      at("tamborista", y, (t) => ell(820, y - 26, 20, 26, "#a86a38") + ell(820, y - 50, 20, 6, "#f4e6c0") + person(t, { x: 780, y, s: sc(y), pose: "drum", shirt: "#e8564a", skin: SKINS[4] }));
      at("criancas", gyL(0.9), (t) => person(t, { x: 560, y: gyL(0.9), s: sc(gyL(0.9)) * 0.7, pose: "cheer", shirt: "#f2b632" }) + person(t, { x: 640, y: gyL(0.92), s: sc(gyL(0.9)) * 0.62, pose: "wave", shirt: "#4aa96c", ph: 2 }));
      walker(0.1, gyL(0.35), -1, 24);
      add("confete", 0, (t) => confetti(t, input.sceneId));
      break;
    }
    case "turismo": {
      const y = gyL(0.6);
      at("turistas", y, (t) => person(t, { x: 300, y, s: sc(y), pose: "point", shirt: "#e8564a", hat: "#f2d27a" }) + person(t, { x: 380, y: y + 2, s: sc(y), face: -1, pose: "photo", shirt: "#3c7dd9", skin: SKINS[3] }));
      walker(0.2, gyL(0.9), 1, 26, { hat: "#f2d27a" });
      add("aviao", 0, (t) => plane(t, { x: travel(t, 34, 0.1, 220, -1), y: 130 + sin(t * 0.3) * 10, s: 0.8, face: -1 }));
      add("balao", 0, (t) => balloon(t, { x: 920 + sin(t * 0.2) * 40, y: 300 - ((t * 5) % 160), s: 0.9, ph: 1 }));
      break;
    }
    case "interior": {
      const y = gyL(0.5), y2 = gyL(0.85);
      at("galinhas", y2, (t) => [0, 1, 2, 3].map((i) => chicken(t, { x: 230 + i * 46 + sin(t * 0.4 + i) * 22, y: y2 + (i % 2) * 8, s: 1 + (i % 2) * 0.1, ph: i * 1.7, face: i % 2 ? -1 : 1, color: i === 1 ? "#d9a06a" : "#f4ecd8" })).join(""));
      at("vaca", y, (t) => cow(t, { x: 820, y, s: 0.95, ph: 0 }) + cow(t, { x: 960, y: y + 12, s: 0.75, face: -1, ph: 2 }));
      at("cao", gyL(0.75), (t) => dog(t, { x: travel(t, 70, 0.3, 80), y: gyL(0.75), s: 1 }));
      walker(0.05, gyL(0.55), 1, 20, { hat: "#d9b45a" });
      at("fazendeiro-crianca", gyL(0.95), (t) => person(t, { x: 560, y: gyL(0.95), s: sc(gyL(0.95)) * 0.7, pose: "wave", shirt: "#f2b632" }));
      add("folhas", 0, (t) => leaves(t, input.sceneId, 6, ["#9bbf4a", "#c9d86a"]));
      break;
    }
    case "danca": {
      const y = gyL(0.6);
      [0, 1, 2, 3].forEach((i) => { const x = 280 + i * 220; at("dancarinos", y + (i % 2) * 18, (t) => person(t, { x, y: y + (i % 2) * 18, s: sc(y) * 1.1, pose: "dance", ph: i * 0.9, skin: SKINS[(i + 1) % 6], shirt: SHIRTS[(i * 2 + 1) % 9] })); });
      add("brilhos", 0, (t) => sparkles(t, input.sceneId, 22, 200, 700, "#ffe9a8") + confetti(t, input.sceneId, 14));
      break;
    }
    case "geografia": {
      const y = gyL(0.6);
      at("exploradores", y, (t) => person(t, { x: 340, y, s: sc(y), pose: "point", shirt: "#4aa96c", hat: "#d9b45a" }) + person(t, { x: 420, y: y + 3, s: sc(y), face: -1, pose: "read", shirt: "#e8564a", skin: SKINS[3] }));
      walker(0.3, gyL(0.9), -1, 22, { hat: "#d9b45a" });
      for (let i = 0; i < 2; i++) { const ph = r(); add("aguia", 0, (t) => bird(t, { x: travel(t, 20 + i * 8, ph, 100, i ? -1 : 1), y: 120 + i * 60, s: 1.7, face: i ? -1 : 1, color: "#3a2a1a", ph: i })); }
      add("nuvens-luz", 0, (t) => motes(t, input.sceneId, 8, 80, 260));
      break;
    }
    case "historia": {
      const y = gyL(0.55), ph = r();
      at("cavaleiro", y, (t) => { const x = travel(t, 52, ph, 120); return horse(t, { x, y, s: 1.1 * depth(y, landMin) + 0.1, ph: 0 }) + person(t, { x: x - 2, y: y - 40 * (1.1 * depth(y, landMin) + 0.1), s: 0.55, pose: "ride", shirt: "#8a2a2a", hat: "#555" }); });
      walker(0.1, gyL(0.85), 1, 18, { robe: true, shirt: "#8a6b3a" });
      walker(0.55, gyL(0.95), -1, 16, { shirt: "#3c5a9a" });
      at("tocha", gyL(0.4), (t) => line(150, gyL(0.4), 150, gyL(0.4) - 70, 5, "#5a3a22") + flame(t, 150, gyL(0.4) - 72, 1.4));
      add("folhas", 0, (t) => leaves(t, input.sceneId, 5));
      break;
    }
    case "cinema": {
      add("projetor", 0, (t) => projector(t));
      add("plateia", 700, (t) => audience(t, input.sceneId));
      walker(0.2, gyL(0.5), 1, 18, { shirt: "#e8564a" });
      add("brilho-tela", 0, (t) => `<rect x="0" y="0" width="${LIFE_W}" height="${LIFE_H}" fill="hsl(${f(210 + sin(t * 0.7) * 40)} 80% 70%)" opacity="${f(0.04 + 0.05 * (sin(t * 3.1) + 1) / 2)}"/>`);
      break;
    }
    case "musica": {
      const y = gyL(0.55);
      at("banda", y, (t) => person(t, { x: 380, y, s: sc(y), pose: "guitar", shirt: "#e8564a", skin: SKINS[2] }) + ell(560, y - 22, 22, 22, "#d6402f") + ell(560, y - 44, 22, 6, "#f4e6c0") + person(t, { x: 600, y, s: sc(y), face: -1, pose: "drum", shirt: "#3c7dd9" }) + person(t, { x: 760, y: y + 4, s: sc(y), pose: "cheer", shirt: "#e86aa6", skin: SKINS[3] }));
      at("plateia", gyL(0.92), (t) => [0, 1, 2, 3, 4].map((i) => person(t, { x: 200 + i * 190, y: gyL(0.92), s: sc(gyL(0.92)) * 0.85, pose: "cheer", ph: i * 0.8, shirt: SHIRTS[(i * 2) % 9], skin: SKINS[i % 6] })).join(""));
      add("notas", 0, (t) => notes(t, 560, 480, input.sceneId, 7) + sparkles(t, input.sceneId, 10, 150, 420, "#ffd27a"));
      break;
    }
    case "lazeres": {
      const y = gyL(0.5), y2 = gyL(0.85);
      at("pipas", y, (t) => { const hx = 300, hy = y - 48 * sc(y); return kite(t, { x: 360, y: 150, hx, hy, color: "#e8564a" }) + kite(t, { x: 520, y: 210, hx: 340, hy: hy, ph: 2, color: "#3c7dd9" }) + person(t, { x: 300, y, s: sc(y), pose: "point", shirt: "#f2b632" }) + person(t, { x: 340, y: y + 4, s: sc(y) * 0.7, pose: "cheer", shirt: "#4aa96c" }); });
      at("bola", y2, (t) => { const bx = 620 + sin(t * 0.9) * 90, by = y2 - 20 - Math.abs(sin(t * 3)) * 60; return person(t, { x: 520, y: y2, s: sc(y2), pose: "cheer", shirt: "#e86aa6" }) + person(t, { x: 760, y: y2, s: sc(y2), face: -1, pose: "cheer", ph: 1.4, shirt: "#3c7dd9" }) + circ(bx, by, 9, "#fff", ' stroke="#e8564a" stroke-width="3"'); });
      at("ciclista", gyL(0.7), (t) => bicycle(t, { x: travel(t, 70, 0.4, 100, -1), y: gyL(0.7), face: -1 }));
      for (let i = 0; i < 2; i++) { const ph = r(), yy = 100 + r() * 100; add("passaros", 0, (t) => bird(t, { x: travel(t, 30, ph, 80, 1), y: yy, ph: i })); }
      break;
    }
    case "estoicismo": {
      const y = gyL(0.6);
      at("filosofos", y, (t) => person(t, { x: 420, y, s: sc(y), pose: "talk", robe: true, shirt: "#e8e2d0", skin: SKINS[1], hair: "#8a8a8a" }) + person(t, { x: 520, y: y + 2, s: sc(y), face: -1, pose: "talk", ph: 1.5, robe: true, shirt: "#b5894a", skin: SKINS[2], hair: "#6b4a2a" }));
      at("leitor", gyL(0.9), (t) => person(t, { x: 800, y: gyL(0.9), s: sc(gyL(0.9)), pose: "read", robe: true, shirt: "#dbe4ec", skin: SKINS[0] }));
      add("folhas", 0, (t) => leaves(t, input.sceneId, 8, ["#9bbf4a", "#d9b45a"]));
      for (let i = 0; i < 2; i++) { const ph = r(); add("passaros", 0, (t) => bird(t, { x: travel(t, 24, ph, 80, 1), y: 120 + i * 50, ph: i })); }
      add("luz", 0, (t) => motes(t, input.sceneId, 14, 150, 600));
      break;
    }
    case "religiao": {
      const y = gyL(0.55);
      walker(0.1, y, 1, 18, { shirt: "#f4f1e6" });
      walker(0.18, y + 8, 1, 18, { shirt: "#9b59b6" });
      at("oracao", gyL(0.9), (t) => person(t, { x: 520, y: gyL(0.9), s: sc(gyL(0.9)), pose: "pray", shirt: "#f4f1e6" }) + person(t, { x: 600, y: gyL(0.92), s: sc(gyL(0.9)) * 0.8, pose: "pray", ph: 1, shirt: "#3c7dd9" }));
      for (let i = 0; i < 3; i++) { const ph = r(); add("pombas", 0, (t) => bird(t, { x: travel(t, 26 + i * 4, ph, 80, i % 2 ? -1 : 1), y: 110 + i * 55, ph: i, color: "#fff" })); }
      at("velas", gyL(0.3), (t) => [0, 1, 2].map((i) => `<rect x="${860 + i * 24}" y="${f(gyL(0.3) - 20)}" width="8" height="20" fill="#f6efe0"/>` + flame(t + i, 864 + i * 24, gyL(0.3) - 21, 0.8)).join(""));
      add("luz", 0, (t) => motes(t, input.sceneId, 12, 150, 600));
      break;
    }
    case "gastronomia": {
      const y = gyL(0.5), x = 600 + (r() - 0.5) * 160, dph = r() * 3;
      at("familia-jantando", y, (t) => diningSet(t, { x, y, s: 1.35 * depth(y, landMin), ph: dph }));
      walker(0.3, gyL(0.95), -1, 22, { shirt: "#fff" });
      add("brilho", 0, (t) => sparkles(t, input.sceneId, 8, 200, 600));
      break;
    }
  }

  // elementos específicos citados no texto da cena, quando a cena não é "do mar" mas fala de algo vivo
  if (!wz && has(/robo|robot|laborat/) && theme !== "tecnologia") {
    const y = gyL(0.7);
    add("humano-e-robo", y, (t) => person(t, { x: 900, y, s: sc(y), pose: "talk", shirt: "#3c7dd9" }) + robot(t, { x: 980, y, s: sc(y), face: -1, mode: "wave" }));
  }
  if (!wz && has(/passaro|oiseau|zwazo|ave\b/)) { const ph = r(); add("passaros", 0, (t) => bird(t, { x: travel(t, 30, ph, 80, 1), y: 130, ph: 1 })); }

  // Cena limpa: só ficam animações ambientes discretas (ondas na água, poucas aves e uma borboleta).
  // Pessoas, animais, barcos, tubarões, confete e brilhos sobrepostos cobriam os objetos rotulados
  // e deixavam difícil identificar cada elemento no vídeo.
  const keep: number[] = [];
  let birds = 0;
  let butterflies = 0;
  names.forEach((name, i) => {
    if (name === "ondas" || name === "surfista") keep.push(i);
    else if (AMBIENT_BIRDS.has(name) && birds++ < 2) keep.push(i);
    else if (name === "borboletas" && butterflies++ < 1) keep.push(i);
  });
  const visibleActors = keep.map((i) => actors[i]);
  const visibleNames = keep.map((i) => names[i]);
  visibleActors.sort((a, b) => a.z - b.z);
  return {
    actors: Array.from(new Set(visibleNames)),
    render: (t: number) => {
      let out = "";
      for (const a of visibleActors) {
        try { out += a.draw(t); } catch { /* um ator com falha não derruba a cena */ }
      }
      return out;
    },
  };
}

/** Documento SVG completo da camada de vida no instante t (para desenhar no canvas / injetar no player). */
export function lifeSvgDocument(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LIFE_W} ${LIFE_H}" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}
