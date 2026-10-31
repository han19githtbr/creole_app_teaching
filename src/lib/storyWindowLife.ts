/**
 * Vida vista pelas JANELAS das cenas internas (cozinha, sala de aula, cinema, igreja...).
 *
 * Antes o diretor desistia de qualquer cena interna e ela ficava parada. Agora, onde há janela desenhada
 * (`storyWindows.json`, gerado por `scripts/ghibli/anchors/build-windows.py`), o que está lá fora ganha vida,
 * sempre recortado dentro do vidro e atrás dos objetos que ficam na frente dele:
 *   - de dia: céu com nuvens, pássaros atravessando, borboleta e — nas janelas à altura de uma pessoa — a cabeça
 *     de quem passa na rua;
 *   - de noite: lua, estrelas, morcegos, coruja piscando e vaga-lumes.
 * Tudo é função pura do tempo `t` (o mesmo desenho serve ao player e ao vídeo exportado) e cada bicho/pessoa
 * tem nome próprio (Kreyòl · Français · Português) ligado ao que está de fato desenhado.
 */
import windowsData from "./storyWindows.json";
import { G, bird, butterfly, circ, ell, f, hashStr, line, rngFrom, sin, clamp } from "@/lib/storySceneLife";
import { sceneIdFromSrc } from "@/lib/storySceneMap";
import type { LabelSpec, SoundCue, VignetteInst } from "@/lib/storyVignettes";

type Box = [number, number, number, number];
export interface WindowSpec { r: Box; p: 0 | 1; h: 0 | 1; o: Box[] }
export interface SceneWindows { fy: number; w: WindowSpec[] }

export function getSceneWindows(srcOrId: string): SceneWindows | null {
  const id = sceneIdFromSrc(srcOrId);
  return ((windowsData as unknown as Record<string, SceneWindows>)[id]) ?? null;
}

const SKINS = ["#f3c9a5", "#e0a67a", "#c68a5c", "#a86f45", "#7a4a2c", "#5a3520"];
const SHIRTS = ["#e8564a", "#3c7dd9", "#f2b632", "#4aa96c", "#9b59b6", "#ef8a3d"];
const HAIRS = ["#201510", "#3b2416", "#6b3f1d", "#111111", "#8a8a8a"];
const frac = (v: number) => v - Math.floor(v);

type Role = "birds" | "walker" | "butterfly" | "owl" | "bats" | "fireflies";

/** quem aparece em cada janela: variar de uma para outra evita três janelas iguais e poluição de nomes */
function rolesFor(index: number, count: number, night: boolean, lowSill: boolean): Role[] {
  const k = index % 3;
  if (count === 1) return night ? ["owl", "fireflies"] : ["birds", "butterfly"];
  if (night) return k === 0 ? ["bats"] : k === 1 ? (count > 2 ? ["fireflies"] : ["owl"]) : ["owl"];
  if (k === 0) return ["birds"];
  if (k === 1) return lowSill ? ["walker"] : ["butterfly"];
  return ["butterfly"];
}

export function buildWindowViews(sw: SceneWindows, o: { sceneId: string; night: boolean }): VignetteInst[] {
  const base = hashStr(o.sceneId);
  return sw.w.map((win, i) => buildOne(win, i, sw.w.length, sw, o.night, o.sceneId, base));
}

function buildOne(win: WindowSpec, i: number, count: number, sw: SceneWindows, night: boolean, sceneId: string, base: number): VignetteInst {
  const [x0, y0, x1, y1] = win.r;
  const W = x1 - x0, H = y1 - y0, cx = (x0 + x1) / 2;
  const r = rngFrom(`${sceneId}|janela|${i}`);
  const uid = `wv${base % 100000}x${i}`;
  const roles = rolesFor(i, count, night, win.h === 1);
  const ph = r() * 20;
  const dirv = (i % 2 === 0 ? 1 : -1) as 1 | -1;
  const skin = SKINS[Math.floor(r() * SKINS.length)], shirt = SHIRTS[Math.floor(r() * SHIRTS.length)], hair = HAIRS[Math.floor(r() * HAIRS.length)];
  const hasHat = r() < 0.4;
  const bs = clamp(W / 120, 0.9, 1.7); // bichos proporcionais ao tamanho da janela
  const butterflyColor = ["#f08a2b", "#e86aa6", "#f2d23a", "#8e6bd6"][Math.floor(r() * 4)];

  // buraco no recorte onde há objeto na frente do vidro: a vida passa ATRÁS dele
  const hole = (b: Box) => `M${b[0]} ${b[1]}H${b[2]}V${b[3]}H${b[0]}Z`;
  const clip = `<clipPath id="${uid}c"><path clip-rule="evenodd" d="${hole(win.r)}${win.o.map(hole).join("")}"/></clipPath>`;

  /* ---- cada papel: período do ciclo, posição, desenho, nome ---- */
  const birdsPeriod = 12 + (i % 3) * 3;
  const birdsU = (t: number) => clamp(((t + ph) % birdsPeriod) / 6.5, 0, 1.0001);
  const birdsPos = (t: number) => {
    const u = birdsU(t);
    const x = dirv > 0 ? x0 - 50 + (W + 100) * u : x1 + 50 - (W + 100) * u;
    return { x, y: y0 + H * (0.2 + 0.08 * (i % 2)) + sin(t * 0.9) * 6, vis: u > 0 && u < 1 };
  };

  const walkerPeriod = 17 + (i % 2) * 4;
  const walkU = (t: number) => clamp(((t + ph) % walkerPeriod) / 7, 0, 1.0001);
  const walkPos = (t: number) => {
    const u = walkU(t);
    const x = dirv > 0 ? x0 - 45 + (W + 90) * u : x1 + 45 - (W + 90) * u;
    return { x, y: y0 + H * 0.52 + Math.abs(sin(t * 5.2)) * -3 + sin(t * 2.6) * 1.4, vis: u > 0 && u < 1 };
  };

  const fireflyAt = (t: number, k: number) => ({
    x: cx + sin(t * 0.37 + k * 1.9) * W * 0.36 + sin(t * 1.1 + k) * 4,
    y: y0 + H * (0.62 + 0.18 * sin(t * 0.29 + k * 2.3)) + sin(t * 0.9 + k * 3) * 5,
    glow: 0.35 + 0.65 * (0.5 + 0.5 * sin(t * 2.1 + k * 2.7)),
  });

  const batsPeriod = 10 + (i % 3) * 2;
  const batsPos = (t: number, k: number) => {
    const u = clamp(((t + ph + k * 0.9) % batsPeriod) / 5.5, 0, 1.0001);
    const x = dirv > 0 ? x0 - 30 + (W + 60) * u : x1 + 30 - (W + 60) * u;
    return { x, y: y0 + H * (0.3 + 0.1 * k) + sin(t * 3.1 + k * 2) * 18 + sin(t * 1.3) * 10, vis: u > 0 && u < 1 };
  };

  /* ---- desenhos ---- */
  const sky = (t: number): string => {
    if (!win.p) return "";
    const top = night ? "#0b1630" : "#6fc0ee", bottom = night ? "#2b457f" : "#dff3fb";
    let g = `<linearGradient id="${uid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>` +
      `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="url(#${uid}s)"/>`;
    if (night) {
      for (let k = 0; k < 9; k++) {
        const sx = x0 + 10 + ((k * 61 + base) % Math.max(20, W - 20)), sy = y0 + 12 + ((k * 47 + base) % Math.max(20, H * 0.45));
        g += circ(sx, sy, 1.3 + (k % 3) * 0.5, "#fff9d6", ` opacity="${f(0.35 + 0.5 * Math.abs(sin(t * 1.4 + k * 1.3)))}"`);
      }
      // lua crescente com brilho suave
      const mx = x0 + W * (i % 2 === 0 ? 0.72 : 0.28), my = y0 + H * 0.2;
      g += circ(mx, my, 34, "#fff3b0", ` opacity=".16"`) + circ(mx, my, 20, "#fdf3c4") + circ(mx + 8, my - 5, 18, "#1b2f5e");
    } else {
      // nuvens à deriva
      for (let k = 0; k < 2; k++) {
        const sp = 5 + k * 3, span = W + 160;
        const px = x0 - 80 + ((t * sp + k * span * 0.5 + ph * 7) % span), py = y0 + H * (0.16 + 0.2 * k);
        g += `<g opacity=".92">${ell(px, py, 38, 11, "#ffffff")}${ell(px - 18, py + 3, 22, 9, "#ffffff")}${ell(px + 20, py + 2, 24, 10, "#f4fbff")}</g>`;
      }
    }
    // colinas ao fundo
    const hy = y0 + H * 0.78;
    g += `<path d="M${x0} ${f(hy + 6)} Q${f(x0 + W * 0.3)} ${f(hy - 26)} ${f(x0 + W * 0.58)} ${f(hy - 4)} T${x1} ${f(hy - 12)} V${y1} H${x0}Z" fill="${night ? "#16264a" : "#8cc77a"}"/>` +
      `<path d="M${x0} ${f(hy + 24)} Q${f(x0 + W * 0.45)} ${f(hy - 6)} ${x1} ${f(hy + 18)} V${y1} H${x0}Z" fill="${night ? "#0e1a36" : "#6aae60"}"/>`;
    return g;
  };

  const drawBirds = (t: number): string => {
    const q = birdsPos(t);
    if (!q.vis) return "";
    const spots: Array<[number, number]> = [[0, 0], [-26 * bs, 11 * bs], [-26 * bs, -11 * bs]];
    return spots.map(([dx, dy], k) => bird(t, { x: q.x + dirv * dx, y: q.y + dy + sin(t * 1.5 + k) * 3, s: bs, ph: k * 0.9, face: dirv, color: win.p ? "#2f3b4a" : "#2f3b4a" })).join("");
  };

  const drawWalker = (t: number): string => {
    const q = walkPos(t);
    if (!q.vis) return "";
    const R = Math.min(24, W * 0.16);
    const nose = dirv * R;
    const head =
      `<path d="M${f(q.x - R * 2.2)} ${f(y1 + 8)} V${f(q.y + R + 36)} Q${f(q.x - R * 2.2)} ${f(q.y + R + 14)} ${f(q.x - R * 1.1)} ${f(q.y + R + 10)} H${f(q.x + R * 1.1)} Q${f(q.x + R * 2.2)} ${f(q.y + R + 14)} ${f(q.x + R * 2.2)} ${f(q.y + R + 36)} V${f(y1 + 8)} Z" fill="${night ? "#3a4258" : shirt}"/>` +
      `<rect x="${f(q.x - 7)}" y="${f(q.y + R - 4)}" width="14" height="16" rx="5" fill="${skin}"/>` +
      circ(q.x, q.y, R, skin) +
      `<path d="M${f(q.x - R)} ${f(q.y - 2)} Q${f(q.x - R)} ${f(q.y - R - 9)} ${f(q.x)} ${f(q.y - R - 6)} Q${f(q.x + R)} ${f(q.y - R - 9)} ${f(q.x + R)} ${f(q.y - 2)} Q${f(q.x + 6)} ${f(q.y - R + 4)} ${f(q.x - R)} ${f(q.y - 2)} Z" fill="${hair}"/>` +
      (hasHat ? `<rect x="${f(q.x - R - 5)}" y="${f(q.y - R - 2)}" width="${f(2 * R + 10)}" height="5" rx="2" fill="#c9a24d"/><path d="M${f(q.x - R + 4)} ${f(q.y - R - 2)} Q${f(q.x)} ${f(q.y - R - 20)} ${f(q.x + R - 4)} ${f(q.y - R - 2)} Z" fill="#d9b25c"/>` : "") +
      circ(q.x + nose * 0.42, q.y - 1, 2.2, "#1b1209") + circ(q.x + nose * 1.02, q.y + 4, 3.4, skin) +
      `<path d="M${f(q.x + nose * 0.2)} ${f(q.y + 10)} Q${f(q.x + nose * 0.55)} ${f(q.y + 14)} ${f(q.x + nose * 0.8)} ${f(q.y + 10)}" stroke="#6b3a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    return head;
  };

  const drawOwl = (t: number): string => {
    const ox = x0 + W * (i % 2 === 0 ? 0.64 : 0.36), oy = y0 + H * 0.8;
    const blink = frac((t + ph) / 6) < 0.035;
    const look = sin(t * 0.55 + ph) * 14;
    const eye = (dx: number) => circ(dx, 0, 7, "#ffd54a") + (blink ? `<rect x="${dx - 7.5}" y="-8" width="15" height="9" fill="#7a6a58"/>` : circ(dx + look * 0.14, 0, 3.2, "#15110d"));
    const headG = G(0, -26, look, 1, 1, ell(0, 0, 20, 16, "#7a6a58") + `<path d="M-15 -8 L-20 -22 L-8 -14 Z M15 -8 L20 -22 L8 -14 Z" fill="#5b4c3d"/>` + eye(-8) + eye(8) + `<path d="M-3 6 L0 13 L3 6 Z" fill="#e0a030"/>`);
    const bodyG = ell(0, 0, 21, 27, "#6b5b4b") + ell(0, 7, 13, 18, "#cdbba0");
    return line(x0 + 6, oy + 26, x1 - 6, oy + 22, 7, "#4a3626") + G(ox, oy, 0, 1, 1, bodyG + headG);
  };

  const drawBats = (t: number): string => [0, 1].map((k) => {
    const q = batsPos(t, k);
    if (!q.vis) return "";
    const flap = sin(t * 15 + k * 2);
    const wing = (sgn: number) => `<path d="M0 0 Q${f(sgn * 14)} ${f(-10 - flap * 9)} ${f(sgn * 26)} ${f(-3 + flap * 6)} Q${f(sgn * 18)} ${f(3 - flap * 2)} ${f(sgn * 11)} 4 Q${f(sgn * 6)} ${f(1)} 0 5 Z" fill="#03050c"/>`;
    return G(q.x, q.y, 0, 1.5, 1.5, wing(1) + wing(-1) + ell(0, 3, 4, 6, "#03050c") + circ(-2, 0, 1, "#ffcf5a") + circ(2, 0, 1, "#ffcf5a"));
  }).join("");

  const drawFireflies = (t: number): string => Array.from({ length: 6 }, (_, k) => {
    const q = fireflyAt(t, k);
    return circ(q.x, q.y, 9, "#ffe97a", ` opacity="${f(0.2 * q.glow)}"`) + circ(q.x, q.y, 2.6, "#fff6a8", ` opacity="${f(0.45 + 0.55 * q.glow)}"`);
  }).join("");

  const drawButterfly = (t: number): string => butterfly(t, { cx: cx, cy: y0 + H * 0.58, r: W * 0.26, ph: i * 2.1, color: butterflyColor, s: clamp(bs * 1.2, 1.2, 2) });

  const drawers: Record<Role, (t: number) => string> = { birds: drawBirds, walker: drawWalker, butterfly: drawButterfly, owl: drawOwl, bats: drawBats, fireflies: drawFireflies };

  /* ---- rótulos (um por papel, só quando o bicho/pessoa está mesmo à vista) ---- */
  const labelOf = (role: Role, t: number): LabelSpec | null => {
    switch (role) {
      case "birds": { const q = birdsPos(t); return q.vis ? { key: "passaros", x: clamp(q.x, x0 + 18, x1 - 18), y: q.y - 6 } : null; }
      case "walker": { const q = walkPos(t); return q.vis && q.x > x0 + 24 && q.x < x1 - 24 ? { key: "passante", x: q.x, y: q.y - 26 } : null; }
      case "butterfly": { const bw = t * 0.6 + i * 2.1, R = W * 0.26; return { key: "borboletas", x: cx + sin(bw * 1.7) * R + sin(bw * 4.3 + 2) * R * 0.14, y: y0 + H * 0.58 + sin(bw * 2.3 + 1) * 40 + sin(bw * 5.9) * 9 - 10 }; }
      case "owl": return { key: "coruja", x: x0 + W * (i % 2 === 0 ? 0.64 : 0.36), y: y0 + H * 0.8 - 56 };
      case "bats": { const q = batsPos(t, 0); return q.vis ? { key: "morcegos", x: clamp(q.x, x0 + 18, x1 - 18), y: q.y - 12 } : null; }
      case "fireflies": { const q = fireflyAt(t, 0); return { key: "vagalumes", x: q.x, y: q.y - 10 }; }
    }
  };

  /* ---- sons: no mesmo instante em que a coisa acontece ---- */
  const cues = (duration: number): SoundCue[] => {
    const out: SoundCue[] = [];
    for (const role of roles) {
      if (role === "birds") for (let c = 0; ; c++) { const t = c * birdsPeriod - ph + 1.2; if (t >= duration) break; if (t > 0) out.push({ t, kind: "bird", gain: 0.2 }); }
      if (role === "bats") for (let c = 0; ; c++) { const t = c * batsPeriod - ph + 1.4; if (t >= duration) break; if (t > 0) out.push({ t, kind: "bat", gain: 0.5 }); }
      if (role === "owl") for (let c = 0; ; c++) { const t = c * 11 - ph * 0.5 + 3; if (t >= duration) break; if (t > 0) out.push({ t, kind: "owl", gain: 0.45 }); }
      if (role === "fireflies") for (let c = 0; ; c++) { const t = c * 6 + 1.5; if (t >= duration) break; out.push({ t, kind: "cricket", gain: 0.3 }); }
      if (role === "walker") for (let c = 0; ; c++) { const t = c * walkerPeriod - ph + 2.5; if (t >= duration) break; if (t > 0) out.push({ t, kind: "step", gain: 0.2 }); }
    }
    return out;
  };

  return {
    id: `janela${i + 1}`,
    z: 0,
    draw: (t) => `<defs>${clip}</defs><g clip-path="url(#${uid}c)">${sky(t)}${roles.map((role) => drawers[role](t)).join("")}</g>` +
      (win.p ? `<g clip-path="url(#${uid}c)">${line(cx, y0, cx, y1, 5, "#d8cdb4")}${line(x0, y0 + H * 0.48, x1, y0 + H * 0.48, 5, "#d8cdb4")}<path d="M${x0} ${f(y0 + H * 0.5)} L${f(x0 + W * 0.55)} ${y0} H${f(x0 + W * 0.8)} L${x0} ${f(y0 + H * 0.78)} Z" fill="#fff" opacity=".1"/></g>` : ""),
    labels: (t) => roles.map((role) => labelOf(role, t)).filter((l): l is LabelSpec => l !== null),
    cues,
  };
}

/** Mesmas janelas para todo o cálculo de cobertura de rótulos (o diretor usa para não pôr nomes por cima). */
export function windowRects(sw: SceneWindows): Array<{ x0: number; y0: number; x1: number; y1: number }> {
  return sw.w.map((w) => ({ x0: w.r[0], y0: w.r[1], x1: w.r[2], y1: w.r[3] }));
}

