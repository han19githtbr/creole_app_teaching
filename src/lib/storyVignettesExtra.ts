/**
 * Vinhetas extras da camada de vida:
 *   - NOITE (cenas externas): morcegos em zigue-zague, coruja planando, vaga-lumes no chão e grilos;
 *   - CABINE DO AVIÃO (turismo/geografia): uma "lupa" mostra o interior — passageiros lendo, cochilando e olhando
 *     pela janelinha, e a comissária empurrando o carrinho pelo corredor.
 * Funções puras do tempo, com nomes (Kreyòl · Français · Português) ligados ao que está desenhado.
 */
import { G, circ, ell, f, hashStr, person, sin, cos, travel } from "@/lib/storySceneLife";
import type { VignetteDef, LabelSpec, SoundCue } from "@/lib/storyVignettes";

/* ------------------------------------------------------------------ noite */

const bats: VignetteDef = {
  id: "bats", need: "sky", w: 1200, h: 110,
  build: (p, r) => {
    const dir = (r() > 0.5 ? 1 : -1) as 1 | -1, ph = r(), n = 3;
    const X = (t: number, k: number) => travel(t, 55, ph + k * 0.035, 120, dir);
    const Y = (t: number, k: number) => p.y + sin(t * 2.3 + k * 2.1) * 34 + sin(t * 0.8 + k) * 16 + k * 14;
    const bat = (t: number, k: number) => {
      const flap = sin(t * 16 + k * 2), x = X(t, k), y = Y(t, k);
      const wing = (sg: number) => `<path d="M0 0 Q${f(sg * 16)} ${f(-11 - flap * 10)} ${f(sg * 30)} ${f(-3 + flap * 7)} Q${f(sg * 20)} ${f(4 - flap * 2)} ${f(sg * 12)} 5 Q${f(sg * 6)} 1 0 6 Z" fill="#0a0d16" stroke="#9fb0d6" stroke-width="1" stroke-opacity=".5"/>`;
      return G(x, y, sin(t * 2.3 + k * 2.1) * 12, 1.25 * p.s, 1.25 * p.s, wing(1) + wing(-1) + ell(0, 3, 4.5, 7, "#0a0d16") + circ(-2, 0, 1.1, "#ffcf5a") + circ(2, 0, 1.1, "#ffcf5a"));
    };
    return {
      id: "morcegos", z: 0,
      draw: (t) => Array.from({ length: n }, (_, k) => bat(t, k)).join(""),
      labels: (t): LabelSpec[] => { const x = X(t, 0); return [{ key: "morcegos", x, y: Y(t, 0) - 24, alpha: x > 90 && x < 1110 ? 1 : 0 }]; },
      cues: (duration): SoundCue[] => {
        const span = 1200 + 240, period = span / 55, out: SoundCue[] = [];
        for (let c = 0; ; c++) { const t = (c + 0.5) * period - ph * period; if (t >= duration) break; if (t > 0) out.push({ t, kind: "bat", gain: 0.5 }); }
        return out;
      },
    };
  },
};

const owlFly: VignetteDef = {
  id: "owlFly", need: "sky", w: 1200, h: 130,
  build: (p, r) => {
    const dir = (r() > 0.5 ? 1 : -1) as 1 | -1, ph = r();
    const X = (t: number) => travel(t, 24, ph, 200, dir);
    const Y = (t: number) => p.y + 18 + sin(t * 0.7) * 22;
    return {
      id: "coruja", z: 0,
      draw: (t) => {
        const x = X(t), y = Y(t), flap = sin(t * 4.2), s = 1.15 * p.s;
        const wing = (sg: number) => `<path d="M0 -4 Q${f(sg * 26)} ${f(-20 - flap * 14)} ${f(sg * 58)} ${f(-6 + flap * 12)} Q${f(sg * 38)} ${f(8)} ${f(sg * 10)} 10 Z" fill="#cfc3a8" stroke="#6b5b4b" stroke-width="2"/>`;
        const body = wing(1) + wing(-1) + ell(0, 4, 13, 20, "#cfc3a8") + circ(0, -14, 11, "#d9cdb2") + circ(-4.5, -15, 4, "#ffe08a") + circ(4.5, -15, 4, "#ffe08a") + circ(-4.5, -15, 1.7, "#15110d") + circ(4.5, -15, 1.7, "#15110d") + `<path d="M-2 -10 L0 -6 L2 -10 Z" fill="#e0a030"/>`;
        return G(x, y, dir * 4, s, s, body);
      },
      labels: (t) => { const x = X(t); return [{ key: "coruja", x, y: Y(t) - 40 * p.s, alpha: x > 90 && x < 1110 ? 1 : 0 }]; },
      cues: (duration) => {
        const span = 1200 + 400, period = span / 24, out: SoundCue[] = [];
        for (let c = 0; ; c++) { const t = (c + 0.5) * period - ph * period; if (t >= duration) break; if (t > 0) out.push({ t, kind: "owl", gain: 0.5 }); }
        return out;
      },
    };
  },
};

const fireflies: VignetteDef = {
  id: "fireflies", need: "ground", w: 300, h: 120,
  build: (p, r) => {
    const n = 8, ph = r() * 10, cueStart = 1 + r() * 2;
    const at = (t: number, k: number) => ({
      x: p.x + sin(t * 0.33 + k * 1.7 + ph) * p.w * 0.45 + sin(t * 1.2 + k) * 6,
      y: p.y - 28 - (0.5 + 0.5 * sin(t * 0.27 + k * 2.4)) * p.h * 0.7 * p.s + sin(t * 0.9 + k * 3) * 5,
      glow: 0.3 + 0.7 * (0.5 + 0.5 * sin(t * 2.2 + k * 2.9)),
    });
    return {
      id: "vagalumes", z: p.y,
      draw: (t) => Array.from({ length: n }, (_, k) => { const q = at(t, k); return circ(q.x, q.y, 11, "#ffe97a", ` opacity="${f(0.18 * q.glow)}"`) + circ(q.x, q.y, 2.8, "#fff6a8", ` opacity="${f(0.45 + 0.55 * q.glow)}"`); }).join(""),
      labels: (t) => { const q = at(t, 0); return [{ key: "vagalumes", x: q.x, y: q.y - 8 }]; },
      cues: (duration) => { const out: SoundCue[] = []; for (let t = cueStart; t < duration; t += 5.5) out.push({ t, kind: "cricket", gain: 0.3 }); return out; },
    };
  },
};

/* ------------------------------------------------------------------ cabine do avião */

const cabin: VignetteDef = {
  id: "cabin", need: "sky", w: 300, h: 290,
  build: (p, r) => {
    const R = 112, K = 1.18, cx = 0, cy = 0, X0 = p.x, Y0 = p.y; // desenha em coordenadas locais e amplia por K
    const uid = `cb${hashStr(p.seed) % 100000}`;
    const skins = ["#f3c9a5", "#c68a5c", "#7a4a2c", "#e0a67a"], hairs = ["#201510", "#3b2416", "#8a8a8a", "#6b3f1d"];
    const sk = skins.map(() => skins[Math.floor(r() * skins.length)]);
    const hr = hairs.map(() => hairs[Math.floor(r() * hairs.length)]);
    const ph = r() * 6;
    const seatX = [-62, 0, 62];
    const attendantX = (t: number) => cx + sin(t * 0.42 + ph) * 62;
    const attendantDir = (t: number) => (cos(t * 0.42 + ph) >= 0 ? 1 : -1) as 1 | -1;

    const passenger = (t: number, k: number): string => {
      const x = cx + seatX[k], baseY = cy + 12;
      const mode = k % 3; // 0 lê · 1 olha pela janelinha · 2 cochila
      const nod = mode === 2 ? sin(t * 0.9 + k) * 4 : mode === 0 ? sin(t * 1.6 + k) * 1.5 : 0;
      const turn = mode === 1 ? sin(t * 0.5 + k) * 7 : 0;
      const head = G(x + turn * 0.4, baseY - 30 + (mode === 2 ? 3 : 0), nod * 1.6, 1, 1, circ(0, 0, 11, sk[k]) + `<path d="M-11 -2 Q-11 -14 0 -13 Q11 -14 11 -2 Q5 -8 -11 -2 Z" fill="${hr[k]}"/>` + circ(2 + turn * 0.3, 0, 1.3, "#1b1209"));
      const book = mode === 0 ? `<rect x="${f(x - 9)}" y="${f(baseY - 8)}" width="18" height="12" rx="1.5" fill="#f4f1e6" stroke="#8a4b2a" stroke-width="1.2"/>` : "";
      return `<path d="M${f(x - 20)} ${f(baseY + 24)} V${f(baseY - 6)} Q${f(x - 20)} ${f(baseY - 16)} ${f(x)} ${f(baseY - 16)} Q${f(x + 20)} ${f(baseY - 16)} ${f(x + 20)} ${f(baseY - 6)} V${f(baseY + 24)} Z" fill="${["#e8564a", "#3c7dd9", "#f2b632"][k]}"/>` + head + book;
    };
    const seatBack = (k: number) => `<rect x="${f(cx + seatX[k] - 27)}" y="${f(cy - 24)}" width="54" height="${f(66)}" rx="14" fill="#1f3a63" opacity=".95"/>`;
    const porthole = (k: number, t: number) => `<ellipse cx="${f(cx + seatX[k])}" cy="${f(cy - 62)}" rx="16" ry="20" fill="#9fd4f2" stroke="#d9d4c7" stroke-width="4"/>` + ell(cx + seatX[k] - 4 + sin(t * 0.3 + k) * 3, cy - 58, 9, 4, "#fff", ` opacity=".9"`);

    const draw = (t: number): string => {
      const ax = attendantX(t), ad = attendantDir(t);
      let g = `<clipPath id="${uid}"><circle cx="${cx}" cy="${cy}" r="${R - 4}"/></clipPath>` +
        `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#f4eee0" stroke="#f5cf72" stroke-width="5"/><g clip-path="url(#${uid})">` +
        `<rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${R - 12}" fill="#e9dfc8"/><rect x="${cx - R}" y="${cy + 46}" width="${2 * R}" height="${R}" fill="#6b7280"/>` +
        `<rect x="${cx - R}" y="${cy + 40}" width="${2 * R}" height="8" fill="#9aa3b2"/>` +
        [0, 1, 2].map((k) => porthole(k, t)).join("") + [0, 1, 2].map(seatBack).join("") + [0, 1, 2].map((k) => passenger(t, k)).join("");
      // comissária empurrando o carrinho pelo corredor
      const py = cy + 78, s = 0.62;
      g += person(t, { x: ax, y: py, s, face: ad, pose: "walk", speed: 0.9, shirt: "#c0392b", pants: "#2f3e5c", skin: "#c68a5c", hat: "#c0392b" }) +
        `<rect x="${f(ax + ad * 20)}" y="${f(py - 28)}" width="28" height="26" rx="3" fill="#cfd5de" stroke="#8a929c" stroke-width="1.5"/>` + circ(ax + ad * 26, py - 1, 3, "#333") + circ(ax + ad * 42, py - 1, 3, "#333") +
        `<rect x="${f(ax + ad * 24)}" y="${f(py - 36)}" width="6" height="8" fill="#e8564a"/>`;
      return G(X0, Y0, 0, K, K, g + `</g>`);
    };
    const attendantLabel = (t: number) => ({ x: attendantX(t), y: cy + 78 - 76 * 0.62 });
    return {
      id: "cabine", z: 1,
      draw,
      labels: (t): LabelSpec[] => {
        const a = attendantLabel(t);
        return [
          { key: "passageiros", x: X0 + (cx + seatX[1]) * K, y: Y0 + (cy - 30) * K },
          { key: "comissaria", x: X0 + a.x * K, y: Y0 + a.y * K },
        ];
      },
      cues: (duration) => { const out: SoundCue[] = []; for (let t = 4 + ph; t < duration; t += 13) out.push({ t, kind: "ping", gain: 0.3 }); return out; },
    };
  },
};

export const NIGHT_SKY_DEFS: VignetteDef[] = [bats, owlFly];
export const NIGHT_GROUND_DEFS: VignetteDef[] = [fireflies];
export const CABIN_DEFS: VignetteDef[] = [cabin];
