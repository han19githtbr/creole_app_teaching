/**
 * Detalhes extras das cenas das Histórias (elementos com vida + rótulo).
 *
 * Cada detalhe é um pequeno objeto desenhado POR CIMA da ilustração (flor, árvore, casa, bandeira, lanterna,
 * pássaro, gato, moinho, robô, tambor, sino, livro) com movimento natural e uma posição fixa. A MESMA posição
 * é usada para o rótulo (seta apontando para o objeto), então o nome sempre cai sobre o desenho.
 *
 * - `planSceneDetails` é determinístico (mesma cena => mesmos detalhes) e evita sobrepor os elementos já rotulados.
 * - `drawSceneDetail` é função pura do tempo `t` (segundos), como o resto da camada de vida: o player e a
 *   exportação em vídeo produzem exatamente o mesmo quadro.
 */

export type DetailKind =
  | "fleur" | "arbre" | "maison" | "drapeau" | "lanterne" | "oiseau"
  | "chat" | "moulin" | "robot" | "tambour" | "cloche" | "livre";

export interface SceneDetail {
  kind: DetailKind;
  /** base do objeto no chão (coordenadas da ilustração 1200x800) */
  x: number;
  y: number;
  s: number;
  ph: number;
  /** ponto (em %) onde o rótulo aponta: centro do objeto */
  anchor: { left: number; top: number };
}

const W = 1200;
const H = 800;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const f = (n: number) => Math.round(n * 10) / 10;
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Tamanho visual (altura aproximada, em px da ilustração) de cada objeto na escala 1: usado para o ponto do rótulo. */
const KIND_HEIGHT: Record<DetailKind, number> = {
  fleur: 56, arbre: 120, maison: 90, drapeau: 110, lanterne: 80, oiseau: 70,
  chat: 50, moulin: 130, robot: 78, tambour: 52, cloche: 84, livre: 50,
};

const THEME_KINDS: Array<[RegExp, DetailKind[]]> = [
  [/tecnolog/, ["robot", "lanterne", "fleur"]],
  [/natureza/, ["fleur", "arbre", "oiseau"]],
  [/turismo/, ["drapeau", "lanterne", "fleur"]],
  [/gastronom/, ["fleur", "lanterne", "chat"]],
  [/cultura|danca/, ["tambour", "drapeau", "lanterne"]],
  [/musica/, ["tambour", "lanterne", "oiseau"]],
  [/histor/, ["drapeau", "cloche", "lanterne"]],
  [/religi/, ["cloche", "lanterne", "fleur"]],
  [/interior/, ["maison", "chat", "arbre"]],
  [/lazer/, ["moulin", "fleur", "oiseau"]],
  [/geograf/, ["moulin", "drapeau", "arbre"]],
  [/cinema/, ["lanterne", "livre", "chat"]],
  [/estoic/, ["livre", "lanterne", "arbre"]],
];
const DEFAULT_KINDS: DetailKind[] = ["fleur", "lanterne", "oiseau"];

/** Faixas livres: as pistas dos atores (x 360-500 e 760-940) ficam de fora para não haver sobreposição. */
const SLOT_X = [90, 170, 250, 560, 640, 720, 1020, 1100, 1160];
const SLOT_Y = [694, 716];

export function planSceneDetails(
  sceneId: string,
  theme: string,
  /** pontos já ocupados por rótulos (em % da imagem) */
  occupied: Array<{ left: number; top: number }>,
  /** nomes (kind) que já existem como elemento rotulado: não duplicar */
  skipKinds: Set<string>,
  max = 3,
): SceneDetail[] {
  const t = norm(theme);
  const kinds = (THEME_KINDS.find(([re]) => re.test(t))?.[1] ?? DEFAULT_KINDS).filter((k) => !skipKinds.has(k));
  const seed = hashStr(sceneId);
  const taken = occupied.map((o) => ({ x: (o.left / 100) * W, y: (o.top / 100) * H }));
  const out: SceneDetail[] = [];
  const order = SLOT_X.map((_, i) => (i + (seed % SLOT_X.length)) % SLOT_X.length);
  let n = 0;
  for (const kind of kinds) {
    if (out.length >= max) break;
    let placed: SceneDetail | null = null;
    for (let tries = 0; tries < order.length * SLOT_Y.length && !placed; tries++) {
      const x = SLOT_X[order[(tries + n) % order.length]];
      const y = SLOT_Y[(seed + tries) % SLOT_Y.length];
      const s = 0.9 + ((seed >>> (n * 3)) % 5) * 0.05;
      const cy = y - (KIND_HEIGHT[kind] * s) / 2;
      const clash = taken.some((p) => Math.hypot((p.x - x) * 0.8, p.y - cy) < 120);
      if (clash) continue;
      placed = {
        kind, x, y, s, ph: ((seed >>> (n + 2)) % 628) / 100,
        anchor: { left: Math.round((x / W) * 1000) / 10, top: Math.round((cy / H) * 1000) / 10 },
      };
    }
    n++;
    if (placed) {
      out.push(placed);
      taken.push({ x: placed.x, y: (placed.anchor.top / 100) * H });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ movimento natural */

/** vento em camadas: brisa lenta + oscilação média + tremor leve, modulados por rajadas */
function wind(t: number, x: number): number {
  const gust = 0.55 + 0.45 * sin(t * 0.23 + x * 0.005);
  return (0.62 * sin(t * 0.9 + x * 0.013) + 0.28 * sin(t * 2.1 + x * 0.031 + 1.3) + 0.1 * sin(t * 5.3 + x * 0.07)) * gust;
}
/** pulso periódico suave: 0 fora da janela, sobe e desce com seno dentro dela */
function burst(t: number, period: number, width: number, ph = 0): number {
  const u = (((t + ph) % period) + period) % period;
  return u < width ? sin((u / width) * PI) : 0;
}
const shadow = (w: number) => `<ellipse cx="0" cy="2" rx="${f(w)}" ry="${f(w * 0.22)}" fill="#1c1c1c" opacity=".22"/>`;
const grp = (x: number, y: number, s: number, inner: string, rot = 0) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})">${inner}</g>`;

/* ------------------------------------------------------------------ desenhos */

function fleur(t: number, d: SceneDetail): string {
  const heads = [
    { dx: -14, h: 34, col: "#e8564a", r: 8, p: 0 },
    { dx: 2, h: 48, col: "#f2b632", r: 9, p: 1.1 },
    { dx: 17, h: 30, col: "#c06ad9", r: 7.5, p: 2.3 },
  ];
  let inner = shadow(26);
  for (const hd of heads) {
    const sway = wind(t, d.x + hd.dx + d.ph * 40) * 9 + sin(t * 1.7 + hd.p + d.ph) * 1.6;
    const tx = hd.dx + sway, ty = -hd.h;
    inner += `<path d="M${hd.dx} 0 Q${f(hd.dx + sway * 0.25)} ${f(-hd.h * 0.55)} ${f(tx)} ${f(ty)}" stroke="#3f8a3f" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    inner += `<ellipse cx="${f(hd.dx + sway * 0.18 + (hd.dx < 0 ? -6 : 6))}" cy="${f(-hd.h * 0.4)}" rx="7" ry="3" fill="#4fa04f" transform="rotate(${f(hd.dx < 0 ? -28 : 28 + sway)} ${f(hd.dx)} ${f(-hd.h * 0.4)})"/>`;
    let petals = "";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2 + sway * 0.03;
      petals += `<circle cx="${f(tx + cos(a) * hd.r)}" cy="${f(ty + sin(a) * hd.r)}" r="${f(hd.r * 0.62)}" fill="${hd.col}"/>`;
    }
    inner += petals + `<circle cx="${f(tx)}" cy="${f(ty)}" r="${f(hd.r * 0.5)}" fill="#fff0a8"/>`;
  }
  return grp(d.x, d.y, d.s, inner);
}

function arbre(t: number, d: SceneDetail): string {
  const w = wind(t, d.x);
  const crown = (cx: number, cy: number, r: number, col: string, p: number) =>
    `<circle cx="${f(cx + w * (4 + p) + sin(t * 1.9 + p + d.ph) * 1.4)}" cy="${f(cy + sin(t * 1.3 + p) * 1.2)}" r="${r}" fill="${col}"/>`;
  let leaves = "";
  for (let i = 0; i < 5; i++) {
    const lx = -26 + i * 13 + w * 8;
    leaves += `<circle cx="${f(lx + sin(t * 2.4 + i) * 3)}" cy="${f(-92 + sin(t * 1.8 + i * 1.7) * 5 + (i % 2) * 14)}" r="2.2" fill="#a8d96a" opacity=".85"/>`;
  }
  const inner = shadow(34) +
    `<path d="M-6 0 L-4 -48 L4 -48 L6 0 Z" fill="#7a5233"/>` +
    `<path d="M0 -40 L${f(-14 + w * 2)} -58" stroke="#7a5233" stroke-width="3" stroke-linecap="round"/>` +
    crown(-20, -62, 24, "#3f8f45", 0) + crown(20, -64, 24, "#43984a", 1) + crown(0, -86, 28, "#4cae52", 2) + crown(-4, -66, 22, "#56b85c", 3) + leaves;
  return grp(d.x, d.y, d.s, inner);
}

function maison(t: number, d: SceneDetail): string {
  const flick = 0.78 + 0.22 * sin(t * 7 + d.ph) * sin(t * 3.1 + 1);
  let smoke = "";
  for (let i = 0; i < 5; i++) {
    const u = ((t * 0.35 + i / 5 + d.ph) % 1 + 1) % 1;
    smoke += `<circle cx="${f(22 + wind(t, d.x) * 10 * u + sin(u * 6 + i) * 3 * u)}" cy="${f(-78 - u * 52)}" r="${f(4 + u * 9)}" fill="#e8e8e8" opacity="${f((1 - u) * 0.55)}"/>`;
  }
  const inner = shadow(46) +
    `<rect x="-38" y="-52" width="76" height="52" fill="#f1d9b0" stroke="#8a6a3d" stroke-width="2"/>` +
    `<rect x="14" y="-80" width="12" height="26" fill="#a2523a"/>` +
    `<path d="M-46 -50 L0 -86 L46 -50 Z" fill="#c4553b" stroke="#8a3a28" stroke-width="2"/>` +
    `<rect x="-8" y="-30" width="18" height="30" rx="2" fill="#7a4a2c"/><circle cx="6" cy="-14" r="1.6" fill="#f2c94c"/>` +
    `<rect x="-32" y="-42" width="18" height="16" fill="#ffe08a" opacity="${f(flick)}" stroke="#8a6a3d" stroke-width="2"/>` +
    `<path d="M-23 -42 V-26 M-32 -34 H-14" stroke="#8a6a3d" stroke-width="1.5"/>` + smoke;
  return grp(d.x, d.y, d.s, inner);
}

function drapeau(t: number, d: SceneDetail): string {
  const amp = 5 + 4 * (0.5 + 0.5 * sin(t * 0.3 + d.ph));
  const top: string[] = [], bot: string[] = [];
  const N = 8;
  for (let k = 0; k <= N; k++) {
    const x = 3 + k * 7.2;
    const dy = sin(k * 0.95 - t * 4.2 + d.ph) * amp * (k / N) + wind(t, d.x) * 2 * k;
    top.push(`${f(x)} ${f(-104 + dy)}`);
    bot.unshift(`${f(x)} ${f(-76 + dy)}`);
  }
  const shade = sin(t * 4.2 - d.ph) * 0.12;
  const inner = shadow(14) +
    `<rect x="-2" y="-112" width="5" height="112" rx="2" fill="#6b5a43"/><circle cx="0.5" cy="-114" r="4" fill="#f2c94c"/>` +
    `<polygon points="${top.join(" ")} ${bot.join(" ")}" fill="#e8564a" stroke="#a63a30" stroke-width="1.5"/>` +
    `<polygon points="${top.slice(3, 6).join(" ")} ${bot.slice(3, 6).join(" ")}" fill="#fff" opacity="${f(0.55 + shade)}"/>`;
  return grp(d.x, d.y, d.s, inner);
}

function lanterne(t: number, d: SceneDetail): string {
  const swing = (sin(t * 1.35 + d.ph) * 4.5 + wind(t, d.x) * 5) * (0.8 + 0.2 * sin(t * 0.4));
  const fl = 0.8 + 0.2 * sin(t * 11 + d.ph) * sin(t * 4.3);
  const lamp =
    `<line x1="0" y1="0" x2="0" y2="14" stroke="#3a2a1c" stroke-width="2"/>` +
    `<ellipse cx="0" cy="40" rx="${f(34 * fl)}" ry="${f(34 * fl)}" fill="#ffd27a" opacity="${f(0.16 * fl)}"/>` +
    `<rect x="-11" y="14" width="22" height="5" rx="2" fill="#3a2a1c"/>` +
    `<path d="M-11 19 L-13 52 L13 52 L11 19 Z" fill="#ffb020" opacity="${f(0.7 + 0.25 * fl)}" stroke="#3a2a1c" stroke-width="2"/>` +
    `<ellipse cx="0" cy="38" rx="3.5" ry="${f(8 * fl)}" fill="#fff3b0"/>` +
    `<rect x="-13" y="52" width="26" height="5" rx="2" fill="#3a2a1c"/>`;
  const inner = shadow(14) +
    `<rect x="-2.5" y="-80" width="5" height="80" rx="2" fill="#4a3a2e"/>` +
    `<path d="M0 -80 Q22 -84 30 -70" stroke="#4a3a2e" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    grp(30, -70, 1, lamp, swing);
  return grp(d.x, d.y, d.s * 0.95, inner);
}

function oiseau(t: number, d: SceneDetail): string {
  const look = burst(t, 3.4, 0.9, d.ph) * 14 - burst(t, 5.1, 1.1, d.ph + 1.7) * 10;
  const hop = burst(t, 6.3, 0.35, d.ph * 2) * 5;
  const flutter = burst(t, 7.7, 1.0, d.ph + 2) * 0.9;
  const tail = sin(t * 1.4 + d.ph) * 3 + burst(t, 4.2, 0.5, d.ph) * 9;
  const blink = burst(t, 3.1, 0.14, d.ph) > 0.4;
  const wing = `<path d="M-6 -4 Q${f(-16 - flutter * 8)} ${f(-6 - flutter * 14)} ${f(-20 - flutter * 6)} ${f(-1 - flutter * 6)} Q-12 4 -4 3 Z" fill="#2f7fbf"/>`;
  const inner = shadow(22) +
    `<rect x="-3" y="-28" width="6" height="28" rx="2" fill="#6b5a43"/>` +
    grp(0, -34 - hop, 1,
      `<path d="M-12 0 L${f(-30)} ${f(-2 + tail * 0.5)} L${f(-28)} ${f(5 + tail * 0.5)} Z" fill="#245f8f"/>` +
      `<ellipse cx="0" cy="0" rx="15" ry="11" fill="#3e9ae0"/><ellipse cx="2" cy="4" rx="9" ry="6" fill="#f5e6c8"/>` + wing +
      grp(10, -8, 1, `<circle r="7.5" fill="#3e9ae0"/><path d="M6 -1 L14 1 L6 3 Z" fill="#f2a82c"/><circle cx="2" cy="-2" r="${blink ? 0.6 : 1.7}" fill="#111"/>`, look)) +
    "";
  return grp(d.x, d.y, d.s, inner);
}

function chat(t: number, d: SceneDetail): string {
  const breathe = 1 + sin(t * 1.9 + d.ph) * 0.018;
  const tail = sin(t * 1.5 + d.ph) * 22 + sin(t * 3.1) * 6;
  const ear = burst(t, 4.7, 0.25, d.ph) * 10;
  const blink = burst(t, 3.8, 0.16, d.ph) > 0.4;
  const inner = shadow(26) +
    `<path d="M16 -6 Q${f(34 + tail * 0.4)} ${f(-8 + tail * 0.2)} ${f(34 + tail * 0.8)} ${f(-34 + tail * 0.3)}" stroke="#e08a3a" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    grp(0, 0, 1, `<ellipse cx="0" cy="-16" rx="18" ry="16" fill="#f0a04a" transform="scale(1 ${f(breathe)})"/><ellipse cx="-4" cy="-4" rx="9" ry="5" fill="#fff0d8"/>`) +
    `<circle cx="-10" cy="-40" r="12" fill="#f0a04a"/>` +
    `<path d="M-20 -48 L-18 -62 L-10 -52 Z" fill="#f0a04a" transform="rotate(${f(-ear)} -18 -52)"/><path d="M-1 -50 L1 -62 L-8 -52 Z" fill="#f0a04a"/>` +
    (blink
      ? `<path d="M-16 -42 H-11 M-8 -42 H-3" stroke="#222" stroke-width="1.6"/>`
      : `<ellipse cx="-14" cy="-42" rx="2" ry="3" fill="#3b8a3b"/><ellipse cx="-6" cy="-42" rx="2" ry="3" fill="#3b8a3b"/>`) +
    `<path d="M-11 -37 l-1.5 2 h3 z" fill="#d46a6a"/>` +
    `<path d="M-18 -36 l-9 -2 M-18 -34 l-9 2 M-3 -36 l9 -2 M-3 -34 l9 2" stroke="#fff" stroke-width="0.9" opacity=".8"/>`;
  return grp(d.x, d.y, d.s, inner);
}

function moulin(t: number, d: SceneDetail): string {
  const speed = 0.55 + 0.45 * (0.5 + 0.5 * wind(t, d.x) + 0.2);
  const ang = (t * speed * 1.6 + d.ph) * (180 / PI) * 0.5;
  let blades = "";
  for (let i = 0; i < 4; i++) {
    blades += `<g transform="rotate(${f(i * 90)})"><rect x="-3" y="-62" width="6" height="62" fill="#8a6a3d"/><path d="M3 -60 L26 -58 L26 -22 L3 -24 Z" fill="#f4ecd8" stroke="#8a6a3d" stroke-width="1.5"/></g>`;
  }
  const inner = shadow(30) +
    `<path d="M-20 0 L-12 -92 L12 -92 L20 0 Z" fill="#e6d3ae" stroke="#8a6a3d" stroke-width="2"/>` +
    `<path d="M-12 -92 L0 -112 L12 -92 Z" fill="#a2523a"/>` +
    `<rect x="-5" y="-20" width="10" height="20" rx="2" fill="#7a4a2c"/>` +
    grp(0, -92, 1, blades, ang) + `<circle cx="0" cy="-92" r="5" fill="#6b5a43"/>`;
  return grp(d.x, d.y, d.s * 0.9, inner);
}

function robot(t: number, d: SceneDetail): string {
  const wave = burst(t, 5.2, 2.2, d.ph);
  const armR = -70 - wave * 40 + sin(t * 9) * wave * 14;
  const blink = burst(t, 3.3, 0.14, d.ph) > 0.4;
  const pulse = 0.5 + 0.5 * sin(t * 3 + d.ph);
  const bob = sin(t * 2.1 + d.ph) * 1.6;
  const inner = shadow(22) +
    `<rect x="-14" y="-18" width="9" height="18" rx="3" fill="#6f7f95"/><rect x="5" y="-18" width="9" height="18" rx="3" fill="#6f7f95"/>` +
    grp(0, bob, 1,
      `<rect x="-18" y="-58" width="36" height="42" rx="7" fill="#9fb4cc" stroke="#5d7189" stroke-width="2"/>` +
      `<circle cx="0" cy="-38" r="6" fill="#4ad0c4" opacity="${f(0.55 + pulse * 0.4)}"/>` +
      `<rect x="-14" y="-24" width="28" height="4" rx="2" fill="#5d7189"/>` +
      `<g transform="rotate(${f(-8 + sin(t * 1.4) * 4)} -18 -52)"><rect x="-30" y="-52" width="12" height="7" rx="3.5" fill="#6f7f95"/></g>` +
      `<g transform="rotate(${f(armR)} 18 -52)"><rect x="18" y="-56" width="22" height="7" rx="3.5" fill="#6f7f95"/><circle cx="41" cy="-52" r="5" fill="#9fb4cc"/></g>` +
      `<rect x="-14" y="-82" width="28" height="22" rx="6" fill="#b9cbe0" stroke="#5d7189" stroke-width="2"/>` +
      (blink
        ? `<path d="M-8 -71 H-3 M3 -71 H8" stroke="#143" stroke-width="2"/>`
        : `<circle cx="-5.5" cy="-71" r="3.2" fill="#2fd6ff"/><circle cx="5.5" cy="-71" r="3.2" fill="#2fd6ff"/>`) +
      `<line x1="0" y1="-82" x2="0" y2="-92" stroke="#5d7189" stroke-width="2"/><circle cx="0" cy="-94" r="3.4" fill="#ff5a5a" opacity="${f(0.4 + pulse * 0.6)}"/>`);
  return grp(d.x, d.y, d.s, inner);
}

function tambour(t: number, d: SceneDetail): string {
  const hitL = burst(t, 1.1, 0.22, 0), hitR = burst(t, 1.1, 0.22, 0.55);
  const hit = Math.max(hitL, hitR);
  const ripple = 1 + hit * 0.06;
  const stick = (x: number, h: number, sgn: number) =>
    `<line x1="${x + sgn * 18}" y1="${f(-86 + h * 18)}" x2="${x}" y2="${f(-37 - (1 - h) * 12)}" stroke="#d9b27a" stroke-width="3.5" stroke-linecap="round"/>`;
  const inner = shadow(32) +
    `<path d="M-26 -34 L-22 0 L22 0 L26 -34 Z" fill="#b5532f" stroke="#7a3820" stroke-width="2"/>` +
    `<path d="M-22 -30 L-8 -2 M-4 -32 L-2 -1 M12 -31 L16 -2 M24 -32 L8 -1" stroke="#f2d9a8" stroke-width="2" opacity=".85"/>` +
    `<ellipse cx="0" cy="-34" rx="${f(26 * ripple)}" ry="${f(8 * ripple)}" fill="#f2e2c0" stroke="#7a3820" stroke-width="2"/>` +
    `<ellipse cx="0" cy="-34" rx="${f(18 * hit)}" ry="${f(5 * hit)}" fill="none" stroke="#b5532f" stroke-width="1.5" opacity="${f(hit * 0.7)}"/>` +
    stick(-10, hitL, -1) + stick(10, hitR, 1);
  return grp(d.x, d.y, d.s * 1.05, inner);
}

function cloche(t: number, d: SceneDetail): string {
  const ring = burst(t, 5.5, 2.4, d.ph);
  const decay = ring;
  const ang = sin(t * 5.2 + d.ph) * 20 * decay + wind(t, d.x) * 1.2;
  const clap = -sin(t * 5.2 + d.ph - 0.6) * 9 * decay;
  const bell =
    `<path d="M-18 24 Q-17 -6 0 -10 Q17 -6 18 24 Z" fill="#e2b13c" stroke="#8a6a1d" stroke-width="2"/>` +
    `<rect x="-20" y="22" width="40" height="5" rx="2.5" fill="#c99a2a"/>` +
    `<circle cx="${f(clap)}" cy="31" r="4.4" fill="#6b5a1d"/><circle cx="0" cy="-12" r="3.2" fill="#8a6a1d"/>`;
  const waves = ring > 0.2 ? `<path d="M30 -2 q8 10 0 20 M38 -6 q12 14 0 28" stroke="#e2b13c" stroke-width="2" fill="none" opacity="${f(ring * 0.55)}"/>` : "";
  const inner = shadow(30) +
    `<rect x="-30" y="-74" width="6" height="74" fill="#6b5a43"/><rect x="24" y="-74" width="6" height="74" fill="#6b5a43"/>` +
    `<rect x="-34" y="-80" width="68" height="8" rx="3" fill="#7a5233"/>` +
    grp(0, -70, 1, bell, ang) + waves;
  return grp(d.x, d.y, d.s, inner);
}

function livre(t: number, d: SceneDetail): string {
  const turn = burst(t, 4.6, 1.3, d.ph);
  const flip = cos(turn * PI);
  const glow = 0.5 + 0.5 * sin(t * 2 + d.ph);
  let spark = "";
  for (let i = 0; i < 3; i++) {
    const u = ((t * 0.4 + i / 3 + d.ph) % 1 + 1) % 1;
    spark += `<circle cx="${f(-14 + i * 14 + sin(u * 7) * 4)}" cy="${f(-42 - u * 26)}" r="${f(2 * (1 - u))}" fill="#ffe9a8" opacity="${f((1 - u) * 0.9)}"/>`;
  }
  const inner = shadow(30) +
    `<path d="M-6 0 L6 0 L10 -16 L-10 -16 Z" fill="#6b5a43"/>` +
    `<path d="M-32 -18 Q-16 -26 0 -20 L0 -40 Q-16 -46 -32 -38 Z" fill="#f7f1e1" stroke="#8a6a3d" stroke-width="1.8"/>` +
    `<path d="M32 -18 Q16 -26 0 -20 L0 -40 Q16 -46 32 -38 Z" fill="#fffaf0" stroke="#8a6a3d" stroke-width="1.8"/>` +
    `<path d="M-26 -30 H-8 M-26 -35 H-8 M8 -30 H26 M8 -35 H26" stroke="#b9a98a" stroke-width="1.4"/>` +
    `<g transform="translate(0 0) scale(${f(flip)} 1)"><path d="M0 -20 Q16 -26 32 -18 L32 -38 Q16 -46 0 -40 Z" fill="#fffdf6" stroke="#8a6a3d" stroke-width="1.5" opacity="${f(turn > 0.02 ? 0.95 : 0)}"/></g>` +
    `<ellipse cx="0" cy="-30" rx="40" ry="20" fill="#ffe9a8" opacity="${f(0.1 + glow * 0.08)}"/>` + spark;
  return grp(d.x, d.y, d.s * 1.05, inner);
}

const DRAW: Record<DetailKind, (t: number, d: SceneDetail) => string> = {
  fleur, arbre, maison, drapeau, lanterne, oiseau, chat, moulin, robot, tambour, cloche, livre,
};

export function drawSceneDetail(t: number, d: SceneDetail): string {
  try {
    return DRAW[d.kind](t, d);
  } catch {
    return "";
  }
}

export const DETAIL_CANVAS = { W, H };
