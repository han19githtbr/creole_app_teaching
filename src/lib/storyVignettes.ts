/**
 * Vinhetas da camada de vida: pequenas cenas animadas (aeroporto, helicóptero, guitarrista, aula ao ar livre,
 * peixes, patos, tartaruga...) com NOMES próprios. Cada vinheta é uma função pura do tempo e declara onde pode
 * existir (chão, céu, água, faixa larga de chão); o diretor (`storySceneDirector.ts`) só a posiciona em células do
 * mapa da cena que combinam com ela — assim peixe fica na água, tambor fica no chão e nada cobre os objetos da lição.
 */
import { G, line, circ, ell, f, sin, cos, clamp, travel, person, bird, plane, balloon, type Rnd } from "@/lib/storySceneLife";

/* ------------------------------------------------------------------ nomes (Kreyòl · Français · Português) */

export interface Name { k: string; f: string; p: string }
export const NAMES: Record<string, Name> = {
  aviaoDecolando: { k: "avyon k ap dekole", f: "avion au décollage", p: "avião decolando" },
  aviaoPousando: { k: "avyon k ap ateri", f: "avion à l'atterrissage", p: "avião pousando" },
  aviao: { k: "avyon", f: "avion", p: "avião" },
  passageiros: { k: "pasajè", f: "passagers", p: "passageiros" },
  pista: { k: "pis avyon", f: "piste", p: "pista" },
  terminal: { k: "tèminal", f: "terminal", p: "terminal" },
  helicoptero: { k: "elikoptè", f: "hélicoptère", p: "helicóptero" },
  passaros: { k: "zwazo", f: "oiseaux", p: "pássaros" },
  balao: { k: "balon", f: "montgolfière", p: "balão" },
  guitarrista: { k: "gitaris", f: "guitariste", p: "guitarrista" },
  violao: { k: "gita", f: "guitare", p: "violão" },
  tamborileiro: { k: "tanbouyè", f: "tambourinaire", p: "tamborileiro" },
  tambor: { k: "tanbou", f: "tambour", p: "tambor" },
  professor: { k: "pwofesè", f: "professeur", p: "professor" },
  alunos: { k: "elèv", f: "élèves", p: "alunos" },
  quadro: { k: "tablo", f: "tableau", p: "quadro-negro" },
  piquenique: { k: "pikniks", f: "pique-nique", p: "piquenique" },
  cesta: { k: "panyen", f: "panier", p: "cesta" },
  vaca: { k: "vach", f: "vache", p: "vaca" },
  galinha: { k: "poul", f: "poule", p: "galinha" },
  gato: { k: "chat", f: "chat", p: "gato" },
  ciclista: { k: "bisiklis", f: "cycliste", p: "ciclista" },
  bicicleta: { k: "bisiklèt", f: "vélo", p: "bicicleta" },
  cavalo: { k: "chwal", f: "cheval", p: "cavalo" },
  cavaleiro: { k: "kavalye", f: "cavalier", p: "cavaleiro" },
  peixes: { k: "pwason", f: "poissons", p: "peixes" },
  golfinho: { k: "dofen", f: "dauphin", p: "golfinho" },
  patos: { k: "kanna", f: "canards", p: "patos" },
  veleiro: { k: "bato a vwal", f: "voilier", p: "veleiro" },
  tartaruga: { k: "tòti", f: "tortue", p: "tartaruga" },
  coelho: { k: "lapen", f: "lapin", p: "coelho" },
  raposa: { k: "rena", f: "renard", p: "raposa" },
  veado: { k: "sèf", f: "cerf", p: "veado" },
  cachorro: { k: "chen", f: "chien", p: "cachorro" },
  bola: { k: "boul", f: "ballon", p: "bola" },
  futebol: { k: "jwè foutbòl", f: "joueurs de football", p: "jogadores de futebol" },
  danca: { k: "dansè", f: "danseurs", p: "dançarinos" },
  robo: { k: "robo", f: "robot", p: "robô" },
  refeicao: { k: "repa", f: "repas", p: "refeição" },
  casal: { k: "koup", f: "couple", p: "casal" },
  conversa: { k: "moun k ap pale", f: "personnes qui parlent", p: "pessoas conversando" },
  borboletas: { k: "papiyon", f: "papillons", p: "borboletas" },
  // vida vista pela janela (cenas internas) e fauna da noite
  passante: { k: "moun k ap pase", f: "passant", p: "pessoa passando" },
  coruja: { k: "koukou", f: "chouette", p: "coruja" },
  morcegos: { k: "chòvsouri", f: "chauves-souris", p: "morcegos" },
  vagalumes: { k: "mouch limyè", f: "lucioles", p: "vaga-lumes" },
  passarosNoite: { k: "zwazo nwit", f: "oiseaux de nuit", p: "pássaros noturnos" },
  // chuva e interior da casa
  chuva: { k: "lapli", f: "pluie", p: "chuva" },
  guardaChuva: { k: "parapli", f: "parapluie", p: "guarda-chuva" },
  arcoIris: { k: "lakansyèl", f: "arc-en-ciel", p: "arco-íris" },
  casa: { k: "kay", f: "maison", p: "casa" },
  janela: { k: "fenèt", f: "fenêtre", p: "janela" },
  cama: { k: "kabann", f: "lit", p: "cama" },
  porta: { k: "pòt", f: "porte", p: "porta" },
  mesa: { k: "tab", f: "table", p: "mesa" },
  abajur: { k: "lanp", f: "lampe", p: "abajur" },
  // cabine do avião
  comissaria: { k: "hotès avyon", f: "hôtesse de l'air", p: "comissária de bordo" },
  poltrona: { k: "chèz avyon", f: "siège", p: "poltrona" },
  carrinhoBordo: { k: "charyo", f: "chariot de service", p: "carrinho de bordo" },
  janelinha: { k: "fenèt avyon", f: "hublot", p: "janelinha do avião" },
};

/* ------------------------------------------------------------------ tipos */

export interface LabelSpec {
  key: keyof typeof NAMES | string;
  /** ponto do objeto nomeado (1200x800) — o rótulo fica acima/ao lado e uma linha o liga ao ponto */
  x: number; y: number;
  /** 0..1: se o objeto some (ex.: avião fora de cena) o rótulo some junto */
  alpha?: number;
}
export interface SoundCue { t: number; kind: string; gain: number }
export interface VignetteInst {
  id: string;
  z: number;
  draw: (t: number) => string;
  labels: (t: number) => LabelSpec[];
  /** sons que acompanham a vinheta (segundos da narração); o mesmo cálculo do desenho garante sincronia */
  cues?: (duration: number) => SoundCue[];
  /** 0..1: quanto a vinheta cobre a imagem da lição (o player esmaece os rótulos da lição enquanto > 0) */
  cover?: (t: number) => number;
}
export interface Placement { x: number; y: number; s: number; w: number; h: number; dir: 1 | -1; seed: string; night: boolean; gt: number }
export interface VignetteDef {
  id: string;
  /** onde pode existir */
  need: "ground" | "sky" | "water" | "strip";
  /** tamanho da área que ocupa, em px na escala 1 (a largura para movimento inclui o percurso todo) */
  w: number; h: number;
  /** vinhetas de chão: escala mínima/máxima permitida */
  build: (p: Placement, r: Rnd) => VignetteInst;
}

const NOCOL = (svg: string) => svg.replace(/<ellipse[^>]*rgba\(0,0,0,\.2\)"\/>/, "");
const ease = (u: number) => u * u * (3 - 2 * u);
const tri = (u: number) => { const k = ((u % 2) + 2) % 2; return k < 1 ? k : 2 - k; }; // 0→1→0
const sm = (a: number, b: number, x: number) => ease(clamp((x - a) / (b - a), 0, 1));
const fade = (alpha: number, svg: string) => (alpha >= 0.99 ? svg : alpha <= 0.01 ? "" : `<g opacity="${f(alpha)}">${svg}</g>`);

/* ------------------------------------------------------------------ céu */

function heliSvg(t: number, x: number, y: number, s: number, face: 1 | -1, tilt: number, night: boolean): string {
  const blur = 0.55 + 0.35 * Math.abs(cos(t * 31));
  const tail = t * 40;
  const body =
    `<path d="M-44 -4 L-92 -14 L-96 -8 L-48 6 Z" fill="#c0392b"/>` + // cauda
    `<path d="M-96 -14 L-100 -28 L-92 -28 L-88 -14 Z" fill="#a82f23"/>` +
    ell(0, 0, 44, 25, "#e0493a") + `<path d="M12 -20 Q42 -18 46 2 L12 2 Z" fill="#bfe3f2" stroke="#8fb9cc" stroke-width="1.5"/>` +
    `<path d="M-30 -8 L8 -8 L8 8 L-30 8 Z" fill="#c0392b" opacity=".35"/>` +
    line(-34, 30, 40, 30, 3, "#3a3f46") + line(-20, 22, -22, 30, 3, "#3a3f46") + line(22, 22, 24, 30, 3, "#3a3f46") +
    line(0, -24, 0, -34, 4, "#3a3f46");
  const rotor = ell(0, -35, 66 * blur, 3.2, "#2b2f36", ` opacity=".85"`) + ell(0, -35, 78, 6, "#ffffff", ` opacity=".16"`);
  const tailRotor = `<g transform="translate(-95 -21)">${line(0, -12 * cos(tail), 0, 12 * cos(tail), 2.6, "#2b2f36")}${line(-12 * sin(tail), 0, 12 * sin(tail), 0, 2.6, "#2b2f36")}</g>`;
  const lights = night ? circ(-98, -30, 3.5, sin(t * 5) > 0.3 ? "#ff4d4d" : "#5a1c1c") + circ(0, 26, 3, sin(t * 5 + 2) > 0.3 ? "#ffffff" : "#777") : "";
  return G(x, y, tilt, face * s, s, body + rotor + tailRotor + lights);
}

const helicopter: VignetteDef = {
  id: "helicopter", need: "sky", w: 1200, h: 130,
  build: (p, r) => {
    const span = 1500, ph = r(), speed = 62;
    // vai e volta: desacelera nas pontas, vira o nariz e paira um instante (como um helicóptero de verdade)
    const pos = (t: number) => {
      const u = (t * speed / span + ph) * 1; const k = tri(u);
      const dirv = Math.floor(u) % 2 === 0 ? 1 : -1;
      return { x: -150 + span * ease(k), dir: dirv as 1 | -1, moving: Math.abs(0.5 - k) < 0.46 };
    };
    return {
      id: "helicoptero", z: 0,
      draw: (t) => {
        const q = pos(t);
        return heliSvg(t, q.x, p.y + sin(t * 1.7) * 6 + sin(t * 0.6) * 4, p.s, q.dir, q.dir * (q.moving ? 5 : 1.5) + sin(t * 1.1) * 1.2, p.night);
      },
      labels: (t) => { const q = pos(t); return [{ key: "helicoptero", x: q.x, y: p.y - 40 * p.s, alpha: q.x > 80 && q.x < 1120 ? 1 : 0 }]; },
    };
  },
};

const airplane: VignetteDef = {
  id: "airplane", need: "sky", w: 1200, h: 90,
  build: (p, r) => {
    const dir = (r() > 0.5 ? 1 : -1) as 1 | -1, ph = r();
    const X = (t: number) => travel(t, 38, ph, 220, dir);
    return {
      id: "aviao", z: 0,
      draw: (t) => {
        const x = X(t), y = p.y + sin(t * 0.25) * 10;
        const trail = Array.from({ length: 5 }, (_, i) => ell(x - dir * (150 + i * 52) * p.s, y + 4 + i * 1.5, (34 + i * 10) * p.s, (3.4 + i * 1.2) * p.s, "#fff", ` opacity="${f(0.3 - i * 0.05)}"`)).join("");
        return trail + plane(t, { x, y, s: 0.7 * p.s, face: dir }) + (p.night ? circ(x + dir * 20 * p.s, y - 8 * p.s, 3, sin(t * 5) > 0.2 ? "#ff5050" : "#611") : "");
      },
      labels: (t) => { const x = X(t); return [{ key: "aviao", x, y: p.y - 30 * p.s, alpha: x > 90 && x < 1110 ? 1 : 0 }]; },
    };
  },
};

const flock: VignetteDef = {
  id: "flock", need: "sky", w: 1200, h: 90,
  build: (p, r) => {
    const dir = (r() > 0.5 ? 1 : -1) as 1 | -1, ph = r();
    const X = (t: number) => travel(t, 34, ph, 140, dir);
    const spots = [[0, 0], [-34, 14], [-34, -14], [-68, 28], [-68, -28], [-102, 42]];
    return {
      id: "passaros", z: 0,
      draw: (t) => {
        const x = X(t), y = p.y + sin(t * 0.45) * 12;
        return spots.map(([dx, dy], i) => bird(t, { x: x + dir * dx * p.s, y: y + dy * p.s + sin(t * 1.4 + i) * 3, s: 1.15 * p.s, ph: i * 0.9, face: dir, color: "#f7f9fb" })).join("");
      },
      labels: (t) => { const x = X(t); return [{ key: "passaros", x, y: p.y - 22, alpha: x > 90 && x < 1110 ? 1 : 0 }]; },
    };
  },
};

const hotAir: VignetteDef = {
  id: "balloon", need: "sky", w: 240, h: 230,
  build: (p, r) => {
    const ph = r() * 6;
    const pos = (t: number) => ({ x: p.x + sin(t * 0.18 + ph) * 90, y: p.y + sin(t * 0.5 + ph) * 12 });
    return {
      id: "balao", z: 0,
      draw: (t) => { const q = pos(t); return balloon(t, { x: q.x, y: q.y, s: 1.15 * p.s, ph }); },
      labels: (t) => { const q = pos(t); return [{ key: "balao", x: q.x, y: q.y - 80 * p.s }]; },
    };
  },
};

/* ------------------------------------------------------------------ aeroporto (pista larga no chão) */

/** rodas do avião que roda na pista (recolhem quando ele sobe) */
function wheels(x: number, y: number, s: number, dir: 1 | -1, up: number): string {
  if (up >= 1) return "";
  return [-30, 28].map((dx) => circ(x + dir * dx * s, y + (13 - up * 10) * s, 3.4 * s, "#222", ` opacity="${f(1 - up)}"`)).join("");
}

const airport: VignetteDef = {
  id: "airport", need: "strip", w: 820, h: 100,
  build: (p) => {
    const x0 = p.x - p.w / 2, x1 = p.x + p.w / 2, yb = p.y; // yb = linha do chão
    const L = (x1 - x0) * 0.66, rx1 = x0 + L; // pista da esquerda até rx1; pátio com terminal à direita
    const S = 0.68;
    const PER = 36;
    const takeoff = (t: number) => {
      const u = ((t + 4) % PER + PER) % PER; // 0..PER
      if (u > 22) return null;
      const v = 0.55 * L * 2 / 9;
      let x: number, y: number, rot = 0, up = 0;
      if (u <= 9) { x = x0 + 30 + 0.55 * L * (u / 9) ** 2; y = yb - 15 * S; }
      else { const w = u - 9; x = x0 + 30 + 0.55 * L + v * w * 1.05; y = yb - 15 * S - 11 * w ** 1.75; rot = -Math.min(16, w * 5.5); up = clamp(w / 2, 0, 1); }
      return { x, y, rot, up, alpha: clamp(u / 0.8, 0, 1) * (u < 21 ? 1 : clamp((22 - u) / 1, 0, 1)) };
    };
    const landing = (t: number) => {
      const u = ((t + 22.5) % PER + PER) % PER;
      if (u > 22.2) return null;
      const stop = x0 + 60 + L * 0.5;
      let x: number, y: number, rot = 0, up = 0;
      if (u <= 10) { const k = u / 10; x = x0 - 330 + (x0 + 60 - (x0 - 330)) * k; y = yb - 15 * S - 270 * (1 - k) ** 1.5; rot = (1 - k) * 4 - (k > 0.85 ? 3 : 0); up = 1 - k > 0.1 ? 1 : (1 - k) * 10; }
      else if (u <= 18) { const w = (u - 10) / 8; x = x0 + 60 + (stop - x0 - 60) * (1 - (1 - w) ** 2); y = yb - 15 * S; }
      else { x = stop; y = yb - 15 * S; }
      return { x, y, rot, up, alpha: u > 20.7 ? clamp((22.2 - u) / 1.5, 0, 1) : 1 };
    };
    // avião estacionado no pátio e passageiros descendo a escada rumo ao terminal
    const px = x1 - 175, termX = x1 - 28;
    const pax = [0, 1, 2, 3].map((i) => i);
    const paxPos = (t: number, i: number) => {
      const per = 14, u = (((t + i * 3.4) % per) + per) % per / per; // 0..1
      const top = { x: px + 52 * S * 1.3, y: yb - 58 * S * 1.3 }, foot = { x: px + 70 * S * 1.3 + 22, y: yb - 2 };
      if (u < 0.45) { const k = u / 0.45; return { x: top.x + (foot.x - top.x) * k, y: top.y + (foot.y - top.y) * k, a: clamp(u / 0.06, 0, 1), walk: 1 }; }
      const k = (u - 0.45) / 0.55; return { x: foot.x + (termX - foot.x) * k, y: foot.y, a: k > 0.9 ? clamp((1 - k) * 10, 0, 1) : 1, walk: 1 };
    };
    const shirts = ["#e8564a", "#3c7dd9", "#f2b632", "#4aa96c"];
    return {
      id: "aeroporto", z: yb,
      draw: (t) => {
        let out = "";
        // pista
        out += `<rect x="${f(x0)}" y="${f(yb - 6)}" width="${f(L + 40)}" height="24" rx="4" fill="#59606a"/><rect x="${f(x0)}" y="${f(yb - 6)}" width="${f(L + 40)}" height="3" fill="#8a929c"/>`;
        for (let x = x0 + 14; x < x0 + L + 30; x += 46) out += `<rect x="${f(x)}" y="${f(yb + 5)}" width="24" height="3.5" fill="#f4f1e6"/>`;
        // pátio (concreto claro)
        out += `<rect x="${f(rx1 + 30)}" y="${f(yb - 6)}" width="${f(x1 - rx1 - 30 + 20)}" height="24" rx="4" fill="#767d86"/>`;
        // manga de vento
        const wx = x0 + L * 0.3, wa = 0.6 + 0.3 * sin(t * 1.3);
        out += line(wx, yb - 6, wx, yb - 46, 3, "#c9ced6") + `<path d="M${f(wx)} ${f(yb - 46)} l${f(26 * wa + 6)} ${f(3)} l${f(-2)} 11 l${f(-26 * wa - 4)} -3 Z" fill="#ff7a1a"/>`;
        // terminal
        out += `<rect x="${f(termX - 22)}" y="${f(yb - 62)}" width="74" height="60" rx="3" fill="#eadfc9" stroke="#bdb095"/><rect x="${f(termX - 22)}" y="${f(yb - 70)}" width="74" height="10" fill="#c0392b"/>` +
          [0, 1, 2].map((i) => `<rect x="${f(termX - 14 + i * 22)}" y="${f(yb - 52)}" width="14" height="12" fill="#a9d7ef"/>`).join("") + `<rect x="${f(termX + 4)}" y="${f(yb - 28)}" width="16" height="26" fill="#6b4a2c"/>` +
          line(termX + 15, yb - 70, termX + 15, yb - 90, 2, "#444") + `<rect x="${f(termX + 8)}" y="${f(yb - 100)}" width="16" height="10" rx="2" fill="#8ec9e6"/>`;
        // avião estacionado + escada
        out += plane(t * 0, { x: px, y: yb - 20 * S * 1.3, s: S * 1.3, face: 1, rot: 0 }) + wheels(px, yb - 20 * S * 1.3, S * 1.3, 1, 0);
        out += `<path d="M${f(px + 52 * S * 1.3)} ${f(yb - 58 * S * 1.3)} L${f(px + 70 * S * 1.3 + 22)} ${f(yb)}" stroke="#7b8794" stroke-width="3"/>` + line(px + 52 * S * 1.3, yb - 58 * S * 1.3 + 8, px + 70 * S * 1.3 + 22, yb + 8, 3, "#7b8794");
        for (const i of pax) {
          const q = paxPos(t, i);
          out += fade(q.a, person(t, { x: q.x, y: q.y, s: 0.3, pose: "walk", speed: 1.3, shirt: shirts[i % 4], pants: "#2f3e5c" }));
          if (i === 1) out += fade(q.a, `<rect x="${f(q.x + 5)}" y="${f(q.y - 13)}" width="8" height="11" rx="1.5" fill="#8a4b2a"/>`);
        }
        // aviões em movimento
        const lnd = landing(t), tko = takeoff(t);
        if (lnd) out += fade(lnd.alpha, plane(t, { x: lnd.x, y: lnd.y, s: S, face: 1, rot: lnd.rot }) + wheels(lnd.x, lnd.y, S, 1, lnd.up));
        if (tko) out += fade(tko.alpha, plane(t, { x: tko.x, y: tko.y, s: S, face: 1, rot: tko.rot }) + wheels(tko.x, tko.y, S, 1, tko.up));
        return out;
      },
      labels: (t) => {
        const L2: LabelSpec[] = [];
        const tko = takeoff(t), lnd = landing(t);
        if (tko) L2.push({ key: "aviaoDecolando", x: tko.x, y: tko.y - 28 * S, alpha: tko.alpha * (tko.x < 1130 && tko.y > 120 ? 1 : 0) });
        if (lnd) L2.push({ key: "aviaoPousando", x: lnd.x, y: lnd.y - 28 * S, alpha: lnd.alpha * (lnd.x > 70 ? 1 : 0) });
        const q = paxPos(t, 1); L2.push({ key: "passageiros", x: q.x, y: q.y - 36 * 0.3 * 2, alpha: q.a });
        L2.push({ key: "pista", x: x0 + L * 0.62, y: yb + 6, alpha: 1 });
        L2.push({ key: "terminal", x: termX + 15, y: yb - 100, alpha: 1 });
        return L2;
      },
    };
  },
};

export const SKY_DEFS: VignetteDef[] = [helicopter, airplane, flock, hotAir];
export const STRIP_DEFS: VignetteDef[] = [airport];

export { ease, tri, sm, fade, NOCOL };
