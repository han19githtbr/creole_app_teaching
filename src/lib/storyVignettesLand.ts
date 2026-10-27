/**
 * Vinhetas de CHÃO e de ÁGUA. Cada uma declara onde pode existir (`need`) e se comporta como na vida real:
 * peixes e patos ficam na água, o tambor fica apoiado no chão, a tartaruga rasteja devagar, o ciclista vai e volta
 * pelo caminho livre, o aluno levanta a mão na aula...
 */
import {
  G, line, circ, ell, f, sin, cos, PI, clamp, person, butterfly, fish, sailboat, bicycle, horse, cow, chicken,
  rabbit, fox, deer, notes, soccerMatch, culturalParty, taskRobots, diningSet, playingAnimals, beachCouple,
  conversationDuo,
} from "@/lib/storySceneLife";
import { ease, tri, type VignetteDef, type LabelSpec } from "@/lib/storyVignettes";

const SHIRTS = ["#e8564a", "#3c7dd9", "#f2b632", "#4aa96c", "#9b59b6", "#ef8a3d", "#2fb5b0", "#e86aa6"];
const shadow = (x: number, y: number, rx: number) => ell(x, y + 1, rx, rx * 0.16, "rgba(0,0,0,.2)");
/** vai-e-volta suave entre a e b: devolve posição e sentido */
const pingpong = (t: number, a: number, b: number, speed: number, ph: number) => {
  const span = Math.max(1, b - a), u = (t * speed) / (2 * span) * 2 + ph, k = tri(u), dir = Math.floor(u) % 2 === 0 ? 1 : -1;
  return { x: a + span * ease(clamp(k, 0, 1)), dir: dir as 1 | -1, still: k < 0.05 || k > 0.95 };
};

/* ------------------------------------------------------------------ bichos desenhados aqui */

function cat(t: number, o: { x: number; y: number; s: number; face: 1 | -1; color?: string; ph?: number }): string {
  const c = o.color ?? "#d9893a", w = t * 1.6 + (o.ph ?? 0);
  const blink = sin(t * 0.9 + (o.ph ?? 0) * 3) > 0.96;
  const tail = `<path d="M-13 -6 Q${f(-30 + sin(w) * 6)} ${f(-8 + cos(w) * 4)} ${f(-26 + sin(w * 1.3) * 9)} ${f(-34 + sin(w) * 4)}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  const body = ell(0, -12, 14, 12, c) + ell(-4, -4, 9, 5, c) + circ(10, -29 + sin(w * 0.8) * 0.8, 9, c) +
    `<path d="M3 -35 L5 -46 L10 -37 Z M12 -37 L17 -46 L18 -34 Z" fill="${c}"/>` +
    (blink ? line(8, -30, 11, -30, 1.6, "#2a2a2a") + line(13, -30, 16, -30, 1.6, "#2a2a2a") : circ(9.5, -30, 1.7, "#2a2a2a") + circ(15, -30, 1.7, "#2a2a2a")) +
    circ(18, -26, 1.3, "#f0a0a0") + line(16, -26, 26, -29, 0.9, "#fff") + line(16, -25, 26, -24, 0.9, "#fff") +
    `<path d="M-6 -20 Q0 -14 -6 -6" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="3"/>`;
  return shadow(o.x, o.y, 17 * o.s) + G(o.x, o.y, 0, o.face * o.s, o.s, tail + body);
}
function duck(t: number, o: { x: number; y: number; s: number; face: 1 | -1; ph: number }): string {
  const b = sin(t * 1.5 + o.ph) * 1.6, nod = sin(t * 0.7 + o.ph * 2) > 0.8 ? 7 : 0; // de vez em quando mergulha o bico
  const body = `<path d="M-14 -8 Q-4 -16 12 -9 Q16 -4 8 0 L-12 0 Q-18 -4 -14 -8Z" fill="#f2f2ea"/><path d="M-14 -8 L-20 -14 L-10 -9Z" fill="#d9d9cf"/>` +
    `<path d="M-6 -7 Q2 -12 8 -6" fill="none" stroke="#c9c9bd" stroke-width="2"/>` + G(11, -12 + nod, nod * 3, 1, 1, circ(0, 0, 6, "#2f7a4a") + `<path d="M5 0 L13 2 L5 4Z" fill="#f0a020"/>` + circ(2, -1.5, 1.2, "#111"));
  const rip = [0, 1].map((i) => ell(o.x, o.y + 1, (22 + ((t * 8 + i * 12 + o.ph * 5) % 24)) * o.s, 3 * o.s, "none", ` stroke="rgba(255,255,255,${f(0.55 - ((t * 8 + i * 12 + o.ph * 5) % 24) / 50)})" stroke-width="1.4"`)).join("");
  return rip + G(o.x, o.y + b, 0, o.face * o.s, o.s, body);
}
function turtle(t: number, o: { x: number; y: number; s: number; face: 1 | -1; swim?: boolean; ph?: number }): string {
  const w = t * (o.swim ? 1.5 : 1.7) + (o.ph ?? 0);
  const shell = `<path d="M-18 0 Q-16 -18 0 -19 Q16 -18 18 0 Z" fill="#5b8a3a" stroke="#3d6226" stroke-width="1.5"/>` +
    `<path d="M-8 -17 L-4 -4 M2 -19 L2 -3 M11 -15 L7 -4" stroke="#3d6226" stroke-width="1.3" fill="none"/>` + `<path d="M-18 0 L18 0" stroke="#d8c98a" stroke-width="3"/>`;
  const head = G(18, -6 + sin(w * 0.5) * 1.2, sin(w * 0.5) * 5, 1, 1, ell(5, 0, 7, 5, "#8aa65a") + circ(8, -1.5, 1.2, "#111"));
  const legs = o.swim
    ? G(6, -3, sin(w) * 28 - 20, 1, 1, ell(7, 0, 9, 3, "#8aa65a")) + G(-8, -3, -sin(w + 1) * 28 - 20, 1, 1, ell(-6, 0, 9, 3, "#8aa65a"))
    : [[-10, 0], [8, 0]].map(([lx], i) => G(lx, 0, sin(w + i * PI) * 20, 1, 1, ell(0, 3, 4, 5, "#8aa65a"))).join("");
  const tail = `<path d="M-18 -2 L-26 0 L-18 2Z" fill="#8aa65a"/>`;
  const y = o.y + (o.swim ? sin(t * 0.8 + (o.ph ?? 0)) * 3 : 0);
  return (o.swim ? "" : shadow(o.x, o.y, 20 * o.s)) + G(o.x, y, o.swim ? sin(t * 0.8) * 4 : 0, o.face * o.s, o.s, legs + tail + shell + head);
}
function dolphin(x: number, y: number, ang: number, s: number, face: 1 | -1): string {
  const b = `<path d="M-46 4 Q-30 -14 4 -14 Q36 -14 54 -2 L62 -6 L58 4 L62 12 L54 6 Q30 14 -6 12 Q-34 12 -46 4Z" fill="#6f8fa6"/><path d="M-6 12 Q4 22 12 20 Q6 14 4 12Z" fill="#5a7a90"/><path d="M-4 -14 L-12 -28 L8 -14Z" fill="#5a7a90"/><path d="M-46 4 L-58 -8 L-60 4 L-58 14Z" fill="#5a7a90"/><path d="M-30 6 Q4 12 44 4 Q4 16 -30 6Z" fill="#dfe9ef"/>` + circ(38, -4, 1.8, "#111");
  return G(x, y, ang, face * s, s, b);
}

/* ------------------------------------------------------------------ chão */

const guitarist: VignetteDef = {
  id: "guitarist", need: "ground", w: 150, h: 110,
  build: (p, r) => {
    const shirt = SHIRTS[Math.floor(r() * SHIRTS.length)];
    return {
      id: "guitarrista", z: p.y,
      draw: (t) => person(t, { x: p.x, y: p.y, s: p.s, face: p.dir, pose: "guitar", shirt, hat: "#c98a3a" }) + notes(t, p.x + p.dir * 14 * p.s, p.y - 92 * p.s, p.seed + "g", 4),
      labels: () => [{ key: "guitarrista", x: p.x, y: p.y - 100 * p.s }, { key: "violao", x: p.x + p.dir * 22 * p.s, y: p.y - 42 * p.s }],
    };
  },
};

const drummer: VignetteDef = {
  id: "drummer", need: "ground", w: 150, h: 100,
  build: (p, r) => {
    const shirt = SHIRTS[Math.floor(r() * SHIRTS.length)];
    const dx = p.dir * 22 * p.s;
    const drum = (t: number) => {
      const hit = Math.max(0, sin(t * 8.2)), ring = ell(p.x + dx, p.y - 40 * p.s, (18 + hit * 7) * p.s, 5 * p.s, "none", ` stroke="rgba(255,235,170,${f(hit * 0.7)})" stroke-width="2"`);
      return shadow(p.x + dx, p.y, 22 * p.s) + G(p.x + dx, p.y, 0, p.s, p.s,
        `<path d="M-17 -44 L-13 0 L13 0 L17 -44 Z" fill="#8a4b24"/><path d="M-15 -34 L15 -34 M-14 -22 L14 -22 M-13 -10 L13 -10" stroke="#e8c37a" stroke-width="2"/>` +
        `<path d="M-14 -40 L-6 -4 M0 -42 L0 -2 M14 -40 L6 -4" stroke="#d9b36a" stroke-width="1.4"/>` + ell(0, -44, 17, 5.5, "#f3dfb2", ` stroke="#a8723a" stroke-width="2"`)) + ring;
    };
    return {
      id: "tamborileiro", z: p.y,
      draw: (t) => drum(t) + person(t, { x: p.x - p.dir * 8 * p.s, y: p.y, s: p.s, face: p.dir, pose: "drum", shirt, skin: "#a86f45" }) + notes(t, p.x + dx, p.y - 100 * p.s, p.seed + "d", 3),
      labels: () => [{ key: "tamborileiro", x: p.x - p.dir * 8 * p.s, y: p.y - 100 * p.s }, { key: "tambor", x: p.x + dx, y: p.y - 40 * p.s }],
    };
  },
};

const classroom: VignetteDef = {
  id: "classroom", need: "ground", w: 340, h: 110,
  build: (p, r) => {
    const s = p.s, d = p.dir;
    const bx = p.x - d * 120 * s, tx = p.x - d * 56 * s, sx = (i: number) => p.x + d * (30 + i * 52) * s;
    const raise = (t: number, i: number) => sin(t * 0.55 + i * 2.1 + r() * 0) > 0.62; // um aluno levanta a mão de vez em quando
    const board = (t: number) => {
      const chalk = sin(t * 0.4) > 0.5 ? line(-16, -64 + sin(t * 6) * 2, -6, -62, 2, "#fff") : "";
      return shadow(bx, p.y, 30 * s) + G(bx, p.y, 0, s, s, line(-22, 0, -14, -52, 3, "#8a5a2c") + line(22, 0, 14, -52, 3, "#8a5a2c") + `<rect x="-34" y="-96" width="68" height="46" rx="3" fill="#2f5d4a" stroke="#8a5a2c" stroke-width="4"/>` +
        `<path d="M-24 -84 h20 M-24 -74 h30 M8 -84 h16 M-24 -64 h14" stroke="#f1f1e6" stroke-width="2.2" stroke-linecap="round" fill="none"/>` + circ(20, -66, 4, "none", ` stroke="#f1f1e6" stroke-width="2"`) + chalk);
    };
    return {
      id: "aula", z: p.y,
      draw: (t) => {
        let out = board(t) + person(t, { x: tx, y: p.y, s, face: (-d) as 1 | -1, pose: sin(t * 0.35) > 0 ? "point" : "talk", shirt: "#f4f1e6", pants: "#24313f", hair: "#8a8a8a" });
        out += `<rect x="${f(Math.min(sx(0), sx(2)) - 30 * s)}" y="${f(p.y - 20 * s)}" width="${f(Math.abs(sx(2) - sx(0)) + 60 * s)}" height="${f(7 * s)}" rx="2" fill="#8a5a2c"/>` +
          [0, 1, 2].map((i) => line(sx(i) - 14 * s, p.y - 14 * s, sx(i) - 14 * s, p.y, 3 * s, "#6b4423")).join("");
        for (let i = 0; i < 3; i++) {
          const hand = raise(t, i);
          out += person(t, { x: sx(i), y: p.y - 18 * s, s, face: (-d) as 1 | -1, pose: hand ? "wave" : i === 1 ? "read" : "sit-talk", shirt: SHIRTS[(i * 3 + 1) % SHIRTS.length], skin: ["#e0a67a", "#7a4a2c", "#c68a5c"][i], ph: i * 1.7 });
        }
        return out;
      },
      labels: () => [
        { key: "professor", x: tx, y: p.y - 96 * s }, { key: "quadro", x: bx, y: p.y - 96 * s },
        { key: "alunos", x: sx(1), y: p.y - 100 * s },
      ],
    };
  },
};

const picnic: VignetteDef = {
  id: "picnic", need: "ground", w: 210, h: 90,
  build: (p) => {
    const s = p.s;
    return {
      id: "piquenique", z: p.y,
      draw: (t) => {
        const cloth = `<path d="M${f(p.x - 100 * s)} ${f(p.y + 4)} L${f(p.x + 100 * s)} ${f(p.y + 4)} L${f(p.x + 84 * s)} ${f(p.y - 26 * s)} L${f(p.x - 84 * s)} ${f(p.y - 26 * s)} Z" fill="#e85a5a"/>` +
          Array.from({ length: 7 }, (_, i) => `<path d="M${f(p.x - 84 * s + i * 28 * s)} ${f(p.y - 26 * s)} L${f(p.x - 100 * s + i * 33 * s)} ${f(p.y + 4)}" stroke="#fff" stroke-width="${f(5 * s)}" opacity=".55"/>`).join("");
        const basket = G(p.x + 2 * s, p.y - 8 * s, 0, s, s, `<path d="M-16 -14 Q0 -34 16 -14" fill="none" stroke="#8a5a2c" stroke-width="3"/><rect x="-18" y="-14" width="36" height="22" rx="4" fill="#c58a4a"/><path d="M-18 -6 h36 M-18 2 h36" stroke="#9a6430" stroke-width="1.5"/>` + circ(-6, -16, 5, "#e84a3a") + circ(6, -17, 5, "#f2b632"));
        return cloth + basket +
          person(t, { x: p.x - 52 * s, y: p.y - 8 * s, s: s * 0.95, face: 1, pose: "sit-eat", shirt: "#3c7dd9", ph: 0.4 }) +
          person(t, { x: p.x + 58 * s, y: p.y - 8 * s, s: s * 0.95, face: -1, pose: "sit-talk", shirt: "#e86aa6", skin: "#c68a5c", ph: 1.3 }) +
          butterfly(t, { cx: p.x + 20, cy: p.y - 90 * s, r: 60, ph: p.x * 0.01, color: "#f5d04a" });
      },
      labels: () => [{ key: "piquenique", x: p.x, y: p.y - 70 * s }, { key: "cesta", x: p.x + 2 * s, y: p.y - 34 * s }],
    };
  },
};

const farm: VignetteDef = {
  id: "farm", need: "ground", w: 300, h: 80,
  build: (p) => {
    const s = p.s, d = p.dir;
    const hens = [[96, 0.3], [140, 1.4], [-120, 2.2]] as const;
    return {
      id: "fazenda", z: p.y,
      draw: (t) => cow(t, { x: p.x - d * 30 * s, y: p.y, s: s * 1.05, face: d, mode: "idle", ph: 0 } as never) +
        hens.map(([dx, ph], i) => chicken(t, { x: p.x + (i < 2 ? d * dx * s : -d * 100 * s), y: p.y + (i === 1 ? 10 : 0), s: s * 0.8, face: (i % 2 ? -d : d) as 1 | -1, mode: "idle", ph } as never)).join(""),
      labels: () => [{ key: "vaca", x: p.x - d * 30 * s, y: p.y - 70 * s }, { key: "galinha", x: p.x + d * 96 * s, y: p.y - 40 * s }],
    };
  },
};

const catSit: VignetteDef = {
  id: "cat", need: "ground", w: 90, h: 60,
  build: (p, r) => ({
    id: "gato", z: p.y,
    draw: (t) => cat(t, { x: p.x, y: p.y, s: p.s * 1.15, face: p.dir, ph: r() * 3 }),
    labels: () => [{ key: "gato", x: p.x, y: p.y - 56 * p.s }],
  }),
};

const cyclist: VignetteDef = {
  id: "cyclist", need: "ground", w: 520, h: 80,
  build: (p, r) => {
    const a = p.x - p.w / 2 + 40, b = p.x + p.w / 2 - 40, ph = r();
    return {
      id: "ciclista", z: p.y,
      draw: (t) => { const q = pingpong(t, a, b, 30, ph); return bicycle(t, { x: q.x, y: p.y, s: 1.0 * p.s, face: q.dir }); },
      labels: (t) => { const q = pingpong(t, a, b, 30, ph); return [{ key: "ciclista", x: q.x, y: p.y - 80 * p.s }]; },
    };
  },
};

const rider: VignetteDef = {
  id: "rider", need: "ground", w: 520, h: 100,
  build: (p, r) => {
    const a = p.x - p.w / 2 + 60, b = p.x + p.w / 2 - 60, ph = r(), s = p.s * 1.05;
    const at = (t: number) => pingpong(t, a, b, 36, ph);
    return {
      id: "cavaleiro", z: p.y,
      draw: (t) => { const q = at(t); return horse(t, { x: q.x, y: p.y, s, face: q.dir, ph: 0, mode: q.still ? "idle" : "walk" } as never) + person(t, { x: q.x - q.dir * 4, y: p.y - 42 * s, s: 0.72 * s, face: q.dir, pose: "ride", shirt: "#8a2a2a", hat: "#555" }); },
      labels: (t) => { const q = at(t); return [{ key: "cavalo", x: q.x + q.dir * 24 * s, y: p.y - 50 * s }, { key: "cavaleiro", x: q.x, y: p.y - 100 * s }]; },
    };
  },
};

const critters: VignetteDef = {
  id: "critters", need: "ground", w: 300, h: 70,
  build: (p, r) => {
    const s = p.s, d = p.dir, pickFox = r() > 0.5;
    return {
      id: "bichos", z: p.y,
      draw: (t) => rabbit(t, { x: p.x - d * 70 * s, y: p.y, s: s * 0.95, face: d, mode: sin(t * 0.5) > 0.4 ? "run" : "idle", ph: 0 } as never) +
        (pickFox ? fox(t, { x: p.x + d * 70 * s, y: p.y + 4, s: s * 0.95, face: (-d) as 1 | -1, mode: "idle", ph: 1 } as never) : deer(t, { x: p.x + d * 80 * s, y: p.y + 4, s: s * 0.8, face: (-d) as 1 | -1, mode: "idle", ph: 1 } as never)),
      labels: () => [{ key: "coelho", x: p.x - d * 70 * s, y: p.y - 48 * s }, { key: pickFox ? "raposa" : "veado", x: p.x + d * 70 * s, y: p.y - (pickFox ? 50 : 90) * s }],
    };
  },
};

const turtleLand: VignetteDef = {
  id: "turtleLand", need: "ground", w: 300, h: 50,
  build: (p, r) => {
    const a = p.x - p.w / 2 + 30, b = p.x + p.w / 2 - 30, ph = r();
    const at = (t: number) => pingpong(t, a, b, 7, ph);
    return {
      id: "tartaruga-na-terra", z: p.y,
      draw: (t) => { const q = at(t); return turtle(t, { x: q.x, y: p.y, s: p.s * 1.7, face: q.dir }); },
      labels: (t) => { const q = at(t); return [{ key: "tartaruga", x: q.x, y: p.y - 30 * p.s }]; },
    };
  },
};

/* aproveitamento das cenas antigas (agora com nomes) */
const soccer: VignetteDef = {
  id: "soccer", need: "ground", w: 360, h: 100,
  build: (p) => ({ id: "futebol", z: p.y, draw: (t) => soccerMatch(t, { x: p.x, y: p.y, s: p.s }), labels: () => [{ key: "futebol", x: p.x, y: p.y - 100 * p.s }] }),
};
const dancers: VignetteDef = {
  id: "dancers", need: "ground", w: 280, h: 110,
  build: (p) => ({ id: "danca", z: p.y, draw: (t) => culturalParty(t, { x: p.x, y: p.y, s: p.s }), labels: () => [{ key: "danca", x: p.x, y: p.y - 104 * p.s }] }),
};
const robots: VignetteDef = {
  id: "robots", need: "ground", w: 280, h: 100,
  build: (p) => ({ id: "robos", z: p.y, draw: (t) => taskRobots(t, { x: p.x, y: p.y, s: p.s }), labels: () => [{ key: "robo", x: p.x, y: p.y - 100 * p.s }] }),
};
const dining: VignetteDef = {
  id: "dining", need: "ground", w: 300, h: 110,
  build: (p) => ({ id: "refeicao", z: p.y, draw: (t) => diningSet(t, { x: p.x, y: p.y, s: 1.1 * p.s }), labels: () => [{ key: "refeicao", x: p.x, y: p.y - 100 * p.s }] }),
};
const petsPlay: VignetteDef = {
  id: "petsPlay", need: "ground", w: 300, h: 70,
  build: (p) => ({ id: "animais", z: p.y, draw: (t) => playingAnimals(t, { x: p.x, y: p.y, s: p.s }), labels: () => [{ key: "cachorro", x: p.x, y: p.y - 60 * p.s }] }),
};
const couple: VignetteDef = {
  id: "couple", need: "ground", w: 420, h: 100,
  build: (p, r) => {
    const a = p.x - p.w / 2 + 50, b = p.x + p.w / 2 - 50, ph = r();
    return {
      id: "casal", z: p.y,
      draw: (t) => { const q = pingpong(t, a, b, 22, ph); return beachCouple(t, { x: q.x, y: p.y, s: p.s, dir: q.dir }); },
      labels: (t) => { const q = pingpong(t, a, b, 22, ph); return [{ key: "casal", x: q.x, y: p.y - 100 * p.s }]; },
    };
  },
};
const talkers: VignetteDef = {
  id: "talkers", need: "ground", w: 200, h: 100,
  build: (p) => ({ id: "conversa", z: p.y, draw: (t) => conversationDuo(t, { x: p.x, y: p.y, s: p.s }), labels: () => [{ key: "conversa", x: p.x, y: p.y - 100 * p.s }] }),
};

export const GROUND_DEFS: VignetteDef[] = [guitarist, drummer, classroom, picnic, farm, catSit, cyclist, rider, critters, turtleLand, soccer, dancers, robots, dining, petsPlay, couple, talkers];

/* ------------------------------------------------------------------ água */

const fishSchool: VignetteDef = {
  id: "fishSchool", need: "water", w: 240, h: 70,
  build: (p, r) => {
    const cols = ["#f2994a", "#f2c94c", "#56b6e8", "#ef6f6c"];
    const n = 5, c = cols[Math.floor(r() * cols.length)], dir = p.dir;
    const pos = (t: number, i: number) => ({ x: p.x + sin(t * 0.32 + i * 0.4) * (p.w / 2 - 40) + (i % 3) * 14 - 14, y: p.y + sin(t * 0.9 + i * 1.7) * (p.h / 2 - 16) + ((i % 2) - 0.5) * 14 });
    const face = (t: number) => (cos(t * 0.32) >= 0 ? 1 : -1) as 1 | -1;
    return {
      id: "peixes", z: p.y,
      draw: (t) => Array.from({ length: n }, (_, i) => fish(t, { ...pos(t, i), s: 0.9 + (i % 2) * 0.15, face: face(t) * dir as 1 | -1, ph: i * 0.8, color: c, alpha: 0.95 })).join(""),
      labels: (t) => { const q = pos(t, 0); return [{ key: "peixes", x: q.x, y: q.y - 14 }]; },
    };
  },
};

const dolphinLeap: VignetteDef = {
  id: "dolphin", need: "water", w: 340, h: 120,
  build: (p, r) => {
    const per = 7, ph = r() * per, dir = p.dir, W = 260, H = 70;
    const at = (t: number) => {
      const u = (((t + ph) % per) + per) % per, k = u / 3.2; // salto dura 3,2 s
      if (k > 1) return null;
      const x = p.x - dir * W / 2 + dir * W * k, y = p.y + 22 - 4 * H * k * (1 - k);
      return { x, y, ang: dir === 1 ? -(Math.atan2(4 * H * (1 - 2 * k), W) * 180) / PI : (Math.atan2(4 * H * (1 - 2 * k), W) * 180) / PI, k, hide: y > p.y + 22 - 2 };
    };
    return {
      id: "golfinho", z: p.y,
      draw: (t) => {
        const q = at(t); if (!q) return "";
        const splash = (xx: number, a: number) => Array.from({ length: 5 }, (_, i) => circ(xx + (i - 2) * 9 * (1 + a), p.y + 22 - Math.abs(i - 2) * 3 - a * 18 * (1 - Math.abs(i - 2) / 3), 3 * (1 - a), "#fff", ` opacity="${f(0.9 * (1 - a))}"`)).join("");
        const k = q.k, sx0 = p.x - dir * W / 2, sx1 = p.x + dir * W / 2;
        return (k < 0.18 ? splash(sx0, k / 0.18) : "") + (k > 0.82 ? splash(sx1, (k - 0.82) / 0.18) : "") +
          (q.y < p.y + 20 ? `<g clip-path="none">${dolphin(q.x, q.y, q.ang, 0.62, dir)}</g>` : "");
      },
      labels: (t) => { const q = at(t); return q && q.k > 0.2 && q.k < 0.8 ? [{ key: "golfinho", x: q.x, y: q.y - 34 }] : []; },
    };
  },
};

const ducks: VignetteDef = {
  id: "ducks", need: "water", w: 200, h: 54,
  build: (p, r) => {
    const ph = r() * 6;
    const pos = (t: number, i: number) => ({ x: p.x + sin(t * 0.12 + ph) * 36 + (i - 1) * 46 + sin(t * 0.5 + i) * 3, y: p.y + (i === 1 ? -6 : 4) + sin(t * 0.3 + i) * 2 });
    const face = (t: number) => (cos(t * 0.12 + ph) >= 0 ? 1 : -1) as 1 | -1;
    return {
      id: "patos", z: p.y,
      draw: (t) => [0, 1, 2].map((i) => duck(t, { ...pos(t, i), s: i === 1 ? 0.8 : 1, face: i === 1 ? face(t) : face(t), ph: i * 1.3 })).join(""),
      labels: (t) => { const q = pos(t, 0); return [{ key: "patos", x: q.x, y: q.y - 26 }]; },
    };
  },
};

const sailing: VignetteDef = {
  id: "sailing", need: "water", w: 460, h: 90,
  build: (p, r) => {
    const a = p.x - p.w / 2 + 50, b = p.x + p.w / 2 - 50, ph = r();
    const at = (t: number) => pingpong(t, a, b, 14, ph);
    return {
      id: "veleiro", z: p.y,
      draw: (t) => { const q = at(t); return sailboat(t, { x: q.x, y: p.y, s: 0.9, face: q.dir }); },
      labels: (t) => { const q = at(t); return [{ key: "veleiro", x: q.x, y: p.y - 70 }]; },
    };
  },
};

const turtleSwim: VignetteDef = {
  id: "turtleSwim", need: "water", w: 260, h: 60,
  build: (p, r) => {
    const a = p.x - p.w / 2 + 30, b = p.x + p.w / 2 - 30, ph = r();
    const at = (t: number) => pingpong(t, a, b, 12, ph);
    return {
      id: "tartaruga-nadando", z: p.y,
      draw: (t) => { const q = at(t); return turtle(t, { x: q.x, y: p.y, s: 1.1, face: q.dir, swim: true, ph: 1 }); },
      labels: (t) => { const q = at(t); return [{ key: "tartaruga", x: q.x, y: p.y - 28 }]; },
    };
  },
};

export const WATER_DEFS: VignetteDef[] = [fishSchool, dolphinLeap, ducks, sailing, turtleSwim];
export type { LabelSpec };
