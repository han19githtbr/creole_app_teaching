/**
 * Compositor de cenas dos contos: céu, relevo em camadas com paralaxe, cenário,
 * personagens animados, partículas e câmera lenta (pan + zoom). Espaço de desenho 1080×1920.
 */
import {
  SKY, TAU, circle, clamp, drawCloud, drawGround, drawMoon, drawRidge, drawSky, drawSun, easeInOut, ell, lerp,
  rgrad, rng, vgrad, type Ctx, type Look,
} from "./artCore";
import { ACTORS, drawCheese } from "./artAnimals";
import { PROPS } from "./artProps";

export const STAGE_W = 1080;
export const STAGE_H = 1920;

export type Terrain = "meadow" | "mountains" | "farm" | "forest" | "plain" | "interior";
export type GroundKind = "grass" | "dirt" | "snow" | "sand" | "wood";

export interface PropDef {
  k: string;
  x: number;
  row?: number;
  y?: number;
  s?: number;
  v?: number;
  w?: number;
  seed?: number;
  flip?: boolean;
}

export interface ActorDef {
  k: string;
  x: number;
  row?: number;
  y?: number;
  s?: number;
  flip?: boolean;
  anim?: string;
  speed?: number;
  /** deslocamento horizontal total ao longo da cena (px) */
  dx?: number;
  dy?: number;
  variant?: number;
  carry?: string;
  /** aparece a partir deste progresso (0–1) */
  from?: number;
  /** some depois deste progresso */
  until?: number;
}

export interface FxDef {
  k: "dust" | "leaves" | "snow" | "rain" | "fireflies" | "petals" | "birds" | "notes" | "zzz" | "rays" | "sparkle" | "lightning";
  n?: number;
  x?: number;
  y?: number;
  color?: string;
}

export interface Cam {
  x0: number;
  y0: number;
  z0: number;
  x1: number;
  y1: number;
  z1: number;
}

export interface SceneDef {
  look: Look;
  terrain: Terrain;
  ground?: GroundKind;
  horizon?: number;
  sun?: [number, number] | null;
  moon?: [number, number] | null;
  clouds?: number;
  props: PropDef[];
  actors: ActorDef[];
  fx?: FxDef[];
  cam: Cam;
  seed?: number;
}

const DEFAULT_SUN: Partial<Record<Look, [number, number]>> = {
  day: [800, 360],
  dawn: [280, 880],
  sunset: [780, 900],
  autumn: [820, 380],
};

const rowY = (horizon: number, row: number) => horizon + 40 + row * 300;
const rowScale = (row: number) => 0.55 + 0.75 * row;

export function renderSceneArt(ctx: Ctx, scene: SceneDef, t: number, p: number) {
  const W = STAGE_W;
  const H = STAGE_H;
  const horizon = scene.horizon ?? 1020;
  const pal = SKY[scene.look];
  const e = easeInOut(clamp(p));
  const cam = {
    x: lerp(scene.cam.x0, scene.cam.x1, e),
    y: lerp(scene.cam.y0, scene.cam.y1, e),
    z: lerp(scene.cam.z0, scene.cam.z1, e),
  };

  ctx.save();
  // câmera: zoom em torno do centro da ação e pan
  ctx.translate(W / 2, 1150);
  ctx.scale(cam.z, cam.z);
  ctx.translate(-W / 2, -1150);
  ctx.translate(0, -cam.y);

  const par = (depth: number, fn: () => void) => {
    ctx.save();
    ctx.translate(-cam.x * depth, 0);
    fn();
    ctx.restore();
  };

  par(0.02, () => drawSky(ctx, W, H, pal, t));

  // astros
  const sun = scene.sun === undefined ? DEFAULT_SUN[scene.look] : scene.sun;
  if (sun && !pal.stars) par(0.05, () => drawSun(ctx, sun[0], sun[1], 74, pal.sun ?? "#ffd45a", t));
  const moon = scene.moon === undefined ? (pal.stars ? ([760, 360] as [number, number]) : null) : scene.moon;
  if (moon) par(0.05, () => drawMoon(ctx, moon[0], moon[1], 78));

  // nuvens à deriva
  const cloudN = scene.clouds ?? (scene.look === "night" ? 1 : scene.look === "storm" ? 5 : 3);
  const cr = rng((scene.seed ?? 1) * 7);
  par(0.1, () => {
    for (let i = 0; i < cloudN; i++) {
      const cx = ((cr() * 1500 + t * (10 + cr() * 9)) % 1700) - 300;
      const cy = 160 + cr() * 520;
      const tint = scene.look === "storm" ? "#8a95a8" : scene.look === "night" ? "#3d4a78" : scene.look === "sunset" || scene.look === "dawn" ? "#ffe3d0" : "#ffffff";
      drawCloud(ctx, cx, cy, 1.1 + cr() * 0.9, tint, scene.look === "night" ? 0.55 : 0.95);
    }
  });

  if (scene.terrain === "interior") {
    drawInterior(ctx, W, horizon, t, cam.x);
  } else {
    // relevo distante e colinas
    const far = scene.terrain === "mountains" ? 430 : scene.terrain === "plain" ? 60 : scene.terrain === "farm" ? 120 : 190;
    const sd = scene.seed ?? 1;
    par(0.16, () => {
      drawRidge(ctx, W, horizon - 30, far, sd * 3, vgrad(ctx, horizon - far - 60, horizon, [[0, pal.far], [1, shade(pal.far, 0.82)]]), scene.terrain === "mountains" ? 1.4 : 0.5, 1);
      if (scene.terrain === "mountains") {
        drawRidge(ctx, W, horizon - 10, far * 0.62, sd * 5 + 2, vgrad(ctx, horizon - far, horizon, [[0, shade(pal.far, 0.88)], [1, shade(pal.near, 0.9)]]), 1.1, 1);
      }
    });
    if (scene.terrain === "forest") {
      par(0.24, () => {
        const fr = rng(sd + 9);
        for (let i = 0; i < 26; i++) {
          const x = -300 + i * 70 + fr() * 24;
          const h = 160 + fr() * 120;
          ctx.fillStyle = shade(pal.near, 0.62);
          ctx.beginPath();
          ctx.moveTo(x - 46, horizon + 6);
          ctx.lineTo(x, horizon - h);
          ctx.lineTo(x + 46, horizon + 6);
          ctx.fill();
        }
      });
    }
    par(0.3, () => drawRidge(ctx, W, horizon + 18, scene.terrain === "plain" ? 30 : 100, sd * 11 + 1, vgrad(ctx, horizon - 100, horizon + 80, [[0, pal.near], [1, shade(pal.near, 0.82)]]), 0.3, 1));
    par(0.9, () => drawGround(ctx, W, horizon, pal, scene.ground ?? (scene.look === "winter" ? "snow" : "grass"), cam.x));
  }

  // itens no chão, do fundo para a frente
  type Item = { y: number; draw: () => void };
  const items: Item[] = [];
  for (const prop of scene.props) {
    const row = prop.row ?? 0.5;
    const depth = 0.35 + 0.65 * row;
    const y = prop.y ?? rowY(horizon, row);
    const s = (prop.s ?? 1) * rowScale(row);
    const fn = PROPS[prop.k];
    if (!fn) continue;
    items.push({
      y,
      draw: () => {
        ctx.save();
        ctx.translate(prop.x - cam.x * depth, y);
        ctx.scale(prop.flip ? -s : s, s);
        fn(ctx, t, { variant: prop.v, w: prop.w, seed: prop.seed ?? prop.x * 0.01, p });
        ctx.restore();
      },
    });
  }
  for (const actor of scene.actors) {
    if (actor.from !== undefined && p < actor.from) continue;
    if (actor.until !== undefined && p > actor.until) continue;
    const row = actor.row ?? 0.6;
    const depth = 0.35 + 0.65 * row;
    const air = actor.y !== undefined;
    const ax = actor.x + (actor.dx ?? 0) * e;
    const baseY = air ? actor.y! + (actor.dy ?? 0) * e : rowY(horizon, row) + (actor.dy ?? 0) * e;
    const s = (actor.s ?? 1) * (air ? 1 : rowScale(row));
    const flip = actor.flip ?? ((actor.dx ?? 0) < 0);
    const fn = ACTORS[actor.k];
    if (!fn) continue;
    items.push({
      y: baseY + (air ? 400 : 0),
      draw: () => {
        ctx.save();
        ctx.translate(ax - cam.x * depth, baseY);
        // sombra no chão
        if (!air) {
          ctx.fillStyle = "rgba(20,30,10,0.26)";
          ell(ctx, 0, 6, 110 * s, 16 * s);
          ctx.fill();
        }
        ctx.scale(flip ? -s : s, s);
        fn(ctx, t + (actor.x % 7) * 0.31, { anim: actor.anim, speed: actor.speed, variant: actor.variant, carry: actor.carry, p });
        ctx.restore();
      },
    });
  }
  items.sort((a, b) => a.y - b.y).forEach((item) => item.draw());

  for (const fx of scene.fx ?? []) drawFx(ctx, fx, t, cam.x, scene);

  // luz quente/fria sobre tudo
  ctx.fillStyle = pal.light;
  ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.restore();

  // vinheta cinematográfica (fora da câmera, sempre na tela)
  ctx.fillStyle = rgrad(ctx, W / 2, 980, 520, 1250, [[0, "rgba(0,0,0,0)"], [1, "rgba(5,8,20,0.42)"]]);
  ctx.fillRect(-W, -H * 0.5, W * 3, H * 2);
}

function shade(hex: string, k: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.round(((n >> 16) & 255) * k);
  const g = Math.round(((n >> 8) & 255) * k);
  const b = Math.round((n & 255) * k);
  return `rgb(${r},${g},${b})`;
}

function drawInterior(ctx: Ctx, W: number, horizon: number, t: number, camX: number) {
  ctx.save();
  ctx.translate(-camX * 0.3, 0);
  ctx.fillStyle = vgrad(ctx, 0, horizon + 60, [[0, "#3a281a"], [1, "#6e4b2d"]]);
  ctx.fillRect(-W, -400, W * 3, horizon + 460);
  ctx.strokeStyle = "rgba(20,10,4,0.5)";
  ctx.lineWidth = 4;
  for (let x = -W; x < W * 2; x += 92) {
    ctx.beginPath();
    ctx.moveTo(x, -400);
    ctx.lineTo(x, horizon + 60);
    ctx.stroke();
  }
  // janela com feixe de luz
  ctx.fillStyle = "#cfe9ff";
  ctx.fillRect(560, 380, 300, 360);
  ctx.strokeStyle = "#5a3a22";
  ctx.lineWidth = 16;
  ctx.strokeRect(560, 380, 300, 360);
  ctx.beginPath();
  ctx.moveTo(710, 380);
  ctx.lineTo(710, 740);
  ctx.moveTo(560, 560);
  ctx.lineTo(860, 560);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,236,170,0.2)";
  ctx.beginPath();
  ctx.moveTo(560, 400);
  ctx.lineTo(860, 400);
  ctx.lineTo(560 - 360, horizon + 40);
  ctx.lineTo(560 - 760, horizon + 40);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(-camX * 0.9, 0);
  ctx.fillStyle = vgrad(ctx, horizon, horizon + 700, [[0, "#c79a55"], [1, "#8a6a34"]]);
  ctx.fillRect(-W, horizon, W * 3, 1100);
  ctx.strokeStyle = "rgba(120,80,30,0.4)";
  ctx.lineWidth = 3;
  const r = rng(21);
  for (let i = 0; i < 90; i++) {
    const x = -W + r() * W * 3;
    const y = horizon + 14 + r() * 640;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 30 + r() * 20, y - 6);
    ctx.stroke();
  }
  ctx.restore();
  void t;
}

/* ------------------------------ partículas ------------------------------ */

function drawFx(ctx: Ctx, fx: FxDef, t: number, camX: number, scene: SceneDef) {
  const W = STAGE_W;
  const H = STAGE_H;
  const r = rng((scene.seed ?? 1) * 13 + fx.k.length);
  const n = fx.n ?? 40;
  switch (fx.k) {
    case "dust": {
      for (let i = 0; i < n; i++) {
        const x = (r() * W * 1.4 + t * (8 + r() * 12)) % (W * 1.4) - 100;
        const y = 300 + r() * 1200 - Math.sin(t * 0.6 + i) * 24;
        const a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.3 + i));
        ctx.fillStyle = `rgba(255,240,190,${a * 0.6})`;
        circle(ctx, x - camX * 0.5, y, 2 + r() * 3.4);
        ctx.fill();
      }
      break;
    }
    case "leaves": {
      for (let i = 0; i < n; i++) {
        const sp = 70 + r() * 90;
        const x = (r() * W * 1.3 + Math.sin(t * 0.8 + i) * 60 + t * 20) % (W * 1.3) - 80;
        const y = ((r() * H + t * sp) % (H + 160)) - 80;
        ctx.save();
        ctx.translate(x - camX * 0.6, y);
        ctx.rotate(t * (1 + r() * 2) + i);
        ctx.fillStyle = ["#d9852b", "#c9601f", "#e8a63a", "#b8461c"][i % 4];
        ell(ctx, 0, 0, 16, 8);
        ctx.fill();
        ctx.restore();
      }
      break;
    }
    case "snow": {
      for (let i = 0; i < n; i++) {
        const sp = 90 + r() * 120;
        const x = (r() * W + Math.sin(t * 0.9 + i * 1.7) * 36) % W;
        const y = ((r() * H + t * sp) % (H + 60)) - 30;
        ctx.fillStyle = `rgba(255,255,255,${0.55 + r() * 0.4})`;
        circle(ctx, x, y, 2.5 + r() * 4.5);
        ctx.fill();
      }
      break;
    }
    case "rain": {
      ctx.strokeStyle = "rgba(200,220,255,0.55)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      for (let i = 0; i < n; i++) {
        const sp = 1300 + r() * 600;
        const x = (r() * (W + 400) - 100 - ((t * sp) % 2) * 0) % (W + 400);
        const y = ((r() * H + t * sp) % (H + 120)) - 60;
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x - 44, y + 56);
        ctx.stroke();
      }
      break;
    }
    case "fireflies": {
      for (let i = 0; i < n; i++) {
        const x = r() * W + Math.sin(t * 0.7 + i * 2) * 60;
        const y = 800 + r() * 560 + Math.cos(t * 0.5 + i) * 40;
        const a = 0.2 + 0.8 * Math.pow(0.5 + 0.5 * Math.sin(t * 2 + i * 3), 2);
        ctx.fillStyle = rgrad(ctx, x - camX * 0.7, y, 0, 26, [[0, `rgba(255,250,150,${a})`], [1, "rgba(255,250,150,0)"]]);
        ctx.fillRect(x - camX * 0.7 - 26, y - 26, 52, 52);
      }
      break;
    }
    case "petals": {
      for (let i = 0; i < n; i++) {
        const x = (r() * W * 1.2 + t * (40 + r() * 40)) % (W * 1.2) - 60;
        const y = ((r() * H + t * (50 + r() * 50)) % (H + 80)) - 40;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 1.5 + i);
        ctx.fillStyle = i % 2 ? "#ffc1d3" : "#fff0f4";
        ell(ctx, 0, 0, 9, 5);
        ctx.fill();
        ctx.restore();
      }
      break;
    }
    case "birds": {
      for (let i = 0; i < n; i++) {
        const sp = 60 + r() * 40;
        const x = ((r() * 1800 + t * sp) % 1800) - 360;
        const y = 220 + r() * 480 + Math.sin(t * 0.8 + i) * 18;
        const flap = Math.sin(t * 9 + i * 2) * 10;
        ctx.strokeStyle = fx.color ?? "#ffffff";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - 26, y + flap);
        ctx.quadraticCurveTo(x - 10, y - 12, x, y);
        ctx.quadraticCurveTo(x + 10, y - 12, x + 26, y + flap);
        ctx.stroke();
      }
      break;
    }
    case "notes": {
      const ox = (fx.x ?? 540) - camX * 0.9;
      const oy = fx.y ?? 1000;
      for (let i = 0; i < (fx.n ?? 6); i++) {
        const ph = ((t * 0.5 + i / (fx.n ?? 6)) % 1);
        const x = ox + Math.sin(ph * 6 + i) * 40 + ph * 90;
        const y = oy - ph * 360;
        ctx.save();
        ctx.globalAlpha = Math.sin(ph * Math.PI);
        ctx.fillStyle = fx.color ?? "#ffffff";
        ctx.translate(x, y);
        ctx.rotate(-0.3);
        ell(ctx, 0, 0, 13, 9);
        ctx.fill();
        ctx.fillRect(10, -48, 4, 48);
        ctx.fillRect(10, -48, 22, 7);
        ctx.restore();
      }
      break;
    }
    case "zzz": {
      const ox = (fx.x ?? 540) - camX * 0.9;
      const oy = fx.y ?? 1000;
      for (let i = 0; i < 3; i++) {
        const ph = ((t * 0.4 + i / 3) % 1);
        ctx.save();
        ctx.globalAlpha = Math.sin(ph * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.font = `900 ${40 + ph * 34}px Arial, sans-serif`;
        ctx.strokeStyle = "rgba(20,30,70,0.5)";
        ctx.lineWidth = 5;
        const x = ox + ph * 70;
        const y = oy - ph * 220;
        ctx.strokeText("Z", x, y);
        ctx.fillText("Z", x, y);
        ctx.restore();
      }
      break;
    }
    case "rays": {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 5; i++) {
        const x = 200 + i * 190 + Math.sin(t * 0.3 + i) * 30;
        ctx.fillStyle = `rgba(255,236,170,${0.08 + 0.04 * Math.sin(t * 0.5 + i)})`;
        ctx.beginPath();
        ctx.moveTo(x, -50);
        ctx.lineTo(x + 70, -50);
        ctx.lineTo(x - 260, 1500);
        ctx.lineTo(x - 420, 1500);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case "sparkle": {
      const ox = (fx.x ?? 540) - camX * 0.9;
      const oy = fx.y ?? 900;
      for (let i = 0; i < n; i++) {
        const a = r() * TAU;
        const d = 60 + r() * 220;
        const tw = Math.pow(0.5 + 0.5 * Math.sin(t * 3 + i * 1.9), 2);
        ctx.save();
        ctx.translate(ox + Math.cos(a) * d, oy + Math.sin(a) * d * 0.8);
        ctx.fillStyle = `rgba(255,248,200,${0.2 + 0.8 * tw})`;
        const s = 5 + tw * 12;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.lineTo(s * 0.5, -s * 0.5);
        ctx.lineTo(s * 2, 0);
        ctx.lineTo(s * 0.5, s * 0.5);
        ctx.lineTo(0, s * 2);
        ctx.lineTo(-s * 0.5, s * 0.5);
        ctx.lineTo(-s * 2, 0);
        ctx.lineTo(-s * 0.5, -s * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      break;
    }
    case "lightning": {
      const cyc = (t * 0.35) % 1;
      if (cyc > 0.92 || (cyc > 0.86 && cyc < 0.88)) {
        ctx.fillStyle = "rgba(230,240,255,0.55)";
        ctx.fillRect(-W, -H, W * 3, H * 3);
      }
      break;
    }
  }
}

export { drawCheese, vgrad };
