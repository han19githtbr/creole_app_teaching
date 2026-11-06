/**
 * Desenho (canvas 2D) da fauna, dos retalhos de folhagem e da água animada da trilha.
 * Usado igualmente pelo jogo (canvas sobre o mapa) e pelo vídeo: tudo em unidades do mundo,
 * com o contexto já transformado pela câmera.
 */
import type { TrailWeather } from "@/lib/curiousTrailData";
import { FAUNA_IDS, type Critter, type Fauna, type Mood } from "@/lib/trailFauna";
import { FOLIAGE_PATCHES } from "@/lib/trailFaunaPatches";
import { FAUNA_RIGS, type RigPart } from "@/lib/trailFaunaRig";
import { gradeImage } from "@/lib/trailGrade";

export const FAUNA_BASE = "/trilha/fauna";
export const PATCH_BASE = "/trilha/patches";

export interface FaunaAssets {
  sprites: Record<string, HTMLImageElement>;
  /** atlas das partes (corpo, patas, rabo, cabeça) dos bichos que andam */
  rigs: Record<string, HTMLImageElement>;
  patches: HTMLImageElement[];
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
    img.src = src;
  });
}

/** Carrega os recortes dos bichos e os retalhos de folhagem. */
export async function loadFaunaAssets(): Promise<FaunaAssets> {
  const sprites: Record<string, HTMLImageElement> = {};
  await Promise.all(
    FAUNA_IDS.map(async (id) => {
      sprites[id] = await loadImg(`${FAUNA_BASE}/${id}.png`);
    })
  );
  const rigs: Record<string, HTMLImageElement> = {};
  await Promise.all(
    Object.keys(FAUNA_RIGS).map(async (id) => {
      rigs[id] = await loadImg(`${FAUNA_BASE}/rig/${id}.png`);
    })
  );
  const patches = await Promise.all(FOLIAGE_PATCHES.map((_, i) => loadImg(`${PATCH_BASE}/p${i}.png`)));
  return { sprites, rigs, patches };
}

const gradeCache = new Map<string, CanvasImageSource>();
function graded(key: string, img: HTMLImageElement, weather: TrailWeather): CanvasImageSource {
  const k = `${weather}:${key}`;
  let g = gradeCache.get(k);
  if (!g) {
    g = gradeImage(img, weather);
    gradeCache.set(k, g);
  }
  return g;
}

const RAD = Math.PI / 180;

function drawMoodIcon(ctx: CanvasRenderingContext2D, mood: Mood, x: number, y: number, t: number) {
  if (mood !== "happy" && mood !== "curious" && mood !== "alert" && mood !== "flee" && mood !== "threat" && mood !== "lunge" && mood !== "stalk") return;
  const bob = Math.sin(t * 6) * 1.6;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (mood === "happy" || mood === "curious") {
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, 7);
    ctx.bezierCurveTo(-15, -4, -9, -15, 0, -8);
    ctx.bezierCurveTo(9, -15, 15, -4, 0, 7);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  } else if (mood === "alert" || mood === "flee") {
    ctx.fillStyle = "#f59e0b";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-3.6, -17, 7.2, 13, 3.6);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 2, 3.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  } else {
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 3.4;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.beginPath();
      ctx.moveTo(sx * 11, sy * 5);
      ctx.quadraticCurveTo(sx * 6, sy * 2.5, sx * 6, sy * 12);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/**
 * Desenha um bicho "articulado": patas em passada alternada (trote diagonal), rabo abanando e cabeça
 * balançando. As partes giram em torno das suas articulações (quadril, base do rabo, pescoço).
 * `stride` = fase da passada; `moving` = está andando; `hopping` = anda aos pulos (sapo, cutia).
 */
function drawRigged(
  ctx: CanvasRenderingContext2D,
  atlas: CanvasImageSource,
  id: string,
  h: number,
  nativeFace: 1 | -1,
  c: Critter,
  t: number,
  moving: boolean,
  hopping: boolean
) {
  const rig = FAUNA_RIGS[id];
  const k = h / rig.ih;
  const run = c.mood === "flee" || c.mood === "lunge" ? 1.45 : 1;
  const hop = hopping ? Math.abs(Math.sin(c.phase)) : 0;
  const bodyPart = rig.parts.find((p) => p.kind === "body");
  const angleOf = (p: RigPart): { a: number; dy: number } => {
    if (p.kind === "leg") {
      if (hopping) {
        // pulo: as patas se esticam para trás na decolagem e se recolhem no ar
        const back = nativeFace * 30 * hop;
        const tuck = nativeFace * -8 * (1 - hop);
        return { a: moving ? back + tuck : 0, dy: 0 };
      }
      if (!moving) return { a: 0, dy: 0 };
      const ph = c.phase + (p.group === "B" ? Math.PI : 0);
      const swing = -nativeFace * 21 * run * Math.sin(ph);
      // a pata que avança sai do chão
      const lift = Math.max(0, Math.cos(ph)) * p.h * 0.09 * run;
      return { a: swing, dy: -lift };
    }
    if (p.kind === "tail") {
      const sp = moving ? 1.8 : 1;
      return { a: Math.sin(t * 3.2 * sp + c.seed) * (moving ? 11 : 6) * (c.mood === "threat" ? 2 : 1), dy: 0 };
    }
    if (p.kind === "head") {
      const sniff = c.mood === "alert" ? -nativeFace * -6 : 0;
      return { a: (moving ? Math.sin(c.phase * 2 + 1) * 3 : Math.sin(t * 1.3 + c.seed) * 2.2) + sniff, dy: 0 };
    }
    return { a: 0, dy: 0 };
  };
  ctx.save();
  ctx.scale(k, k);
  ctx.translate(-rig.iw / 2, -rig.ih);
  const draw = (p: RigPart) => {
    const { a, dy } = angleOf(p);
    ctx.save();
    ctx.translate(p.px, p.py + dy);
    ctx.rotate((a * Math.PI) / 180);
    ctx.translate(-p.px, -p.py);
    ctx.drawImage(atlas, p.sx, p.sy, p.w, p.h, p.x, p.y, p.w, p.h);
    ctx.restore();
  };
  // por trás do corpo: pata/rabo do grupo B primeiro, depois o corpo, depois as patas A e a cabeça
  for (const p of rig.parts) if ((p.kind === "leg" && p.group === "B") || p.kind === "tail") draw(p);
  for (const p of rig.parts) if (p.kind === "leg" && p.group === "A") draw(p);
  if (bodyPart) draw(bodyPart);
  for (const p of rig.parts) if (p.kind === "head") draw(p);
  ctx.restore();
}

function drawCritter(ctx: CanvasRenderingContext2D, c: Critter, assets: FaunaAssets, weather: TrailWeather, t: number) {
  const sp = c.spec;
  const base = assets.sprites[sp.id];
  if (!base) return;
  const img = graded(sp.id, base, weather);
  const iw = base.naturalWidth;
  const ih = base.naturalHeight;
  const h = sp.h;
  const w = (h * iw) / ih;
  const moving = c.state === "move" && c.v > 2;
  let lift = c.z;
  let sx = 1;
  let sy = 1;
  let rot = 0;
  let jx = 0;
  const look = c.look;

  if (sp.kind === "ground") {
    if (sp.hop) {
      if (moving) {
        const s = Math.abs(Math.sin(c.phase));
        lift += s * h * 0.38;
        sy *= 1 - 0.1 * (1 - s);
        sx *= 1 + 0.06 * (1 - s);
      }
    } else if (moving) {
      lift += Math.abs(Math.sin(c.phase)) * h * 0.018;
      rot += Math.sin(c.phase * 2) * 1.2;
    }
    if (!moving) sy *= 1 + Math.sin(t * 2.2 + c.seed) * 0.012;
  } else if (c.state === "fly") {
    const f = Math.sin(c.phase);
    if (!sp.hangs) {
      sx *= 1 + f * 0.1;
      sy *= 1 - f * 0.1;
      rot += 9;
    }
  } else if (sp.pecks && c.mood === "calm") {
    const burst = Math.max(0, Math.sin(t * 0.9 + c.seed));
    rot += Math.sin(t * 22) * 5 * burst;
  } else if (sp.hangs) {
    rot += Math.sin(t * 0.8 + c.seed) * 3;
  } else {
    sy *= 1 + Math.sin(t * 2 + c.seed) * 0.012;
  }

  switch (c.mood) {
    case "flee":
    case "lunge":
      rot += 7;
      break;
    case "stalk":
      rot += 4;
      sy *= 0.96;
      break;
    case "alert":
      sy *= 1.05;
      rot -= 2;
      break;
    case "curl":
      sy *= 0.82;
      sx *= 1.08;
      break;
    case "threat":
      jx = Math.sin(t * 45) * 1.4;
      rot += Math.sin(t * 38) * 2 - 3;
      break;
    default:
      break;
  }
  if (c.react > 0) lift += Math.sin((c.react / 0.7) * Math.PI) * 12;

  // sombra no chão
  if (!(sp.kind === "perch" && c.state !== "fly")) {
    const sh = Math.max(0.3, 1 - c.z / 140);
    ctx.fillStyle = `rgba(0,0,0,${0.22 * sh})`;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y + 1, w * 0.36 * sh, h * 0.07 * sh, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(c.x + jx, c.y - lift);
  ctx.rotate(rot * RAD * look);
  ctx.scale(look * sp.face * sx, sy);
  const rigAtlas = assets.rigs[sp.id];
  if (rigAtlas && FAUNA_RIGS[sp.id] && sp.kind === "ground") {
    drawRigged(ctx, graded(`rig:${sp.id}`, rigAtlas, weather), sp.id, h, sp.face, c, t, moving, Boolean(sp.hop));
  } else if (sp.hangs) ctx.drawImage(img, -w / 2, -h * 0.12, w, h);
  else ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();

  if (c.mood !== "hidden") {
    const topY = sp.hangs ? c.y + h * 0.9 : c.y - lift - h * sy - 10;
    drawMoodIcon(ctx, c.mood, c.x, topY - (sp.hangs ? h : 0), t);
  }
}

/** Desenha bichos e retalhos de folhagem (os bichos passam ATRÁS dos retalhos quando estão mais ao fundo). */
export function drawFauna(ctx: CanvasRenderingContext2D, fauna: Fauna, assets: FaunaAssets, weather: TrailWeather, t: number) {
  for (const it of fauna.drawList()) {
    if (it.patch !== undefined) {
      const p = FOLIAGE_PATCHES[it.patch];
      const img = assets.patches[it.patch];
      if (img) ctx.drawImage(graded(`patch${it.patch}`, img, weather), p.x, p.y, p.w, p.h);
    } else if (it.critter) {
      drawCritter(ctx, it.critter, assets, weather, t);
    }
  }
}

/* ------------------------------------------------------------------ água animada */

const K = 1000 / 688;
const PONDS = [
  { cx: 383, cy: 1025, rx: 48, ry: 17, sparkle: 7 },
  { cx: 323, cy: 797, rx: 38, ry: 9, sparkle: 4 },
  { cx: 560, cy: 1085, rx: 14, ry: 6, sparkle: 2 },
];
const FALLS = [
  { pts: [[387, 860], [474, 860], [474, 904], [393, 906]] as [number, number][], dx: -0.9, dy: 0.42, streaks: 16 },
  { pts: [[421, 925], [463, 925], [463, 949], [424, 949]] as [number, number][], dx: -0.9, dy: 0.4, streaks: 8 },
];

/** Água viva: lagoas com reflexos que brilham (e ondas na chuva) e cachoeiras correndo. Coordenadas do mundo. */
export function drawWater(ctx: CanvasRenderingContext2D, t: number, weather: TrailWeather) {
  ctx.save();
  // lagoas
  for (const [pi, p] of PONDS.entries()) {
    const cx = p.cx * K;
    const cy = p.cy * K;
    const rx = p.rx * K;
    const ry = p.ry * K;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      const ph = (t * 0.22 + i / 7 + pi * 0.31) % 1;
      const y = cy - ry + ph * ry * 2;
      const wob = Math.sin(t * 1.4 + i * 1.9 + pi) * rx * 0.25;
      const len = rx * (0.4 + 0.3 * Math.sin(i * 2.3 + pi));
      ctx.strokeStyle = `rgba(255,255,255,${0.16 + 0.22 * Math.abs(Math.sin(t * 1.1 + i))})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - len + wob, y);
      ctx.quadraticCurveTo(cx + wob, y - 1.5, cx + len + wob, y);
      ctx.stroke();
    }
    // reflexos brilhando
    for (let i = 0; i < p.sparkle; i++) {
      const a = (i * 2.399 + pi) % (Math.PI * 2);
      const r = 0.75 * ((i * 0.37 + 0.2) % 1);
      const tw = Math.max(0, Math.sin(t * 2.4 + i * 1.7 + pi));
      ctx.fillStyle = `rgba(255,255,255,${tw * 0.9})`;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, 1 + tw * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    // chuva: ondinhas se abrindo na superfície
    if (weather === "rain") {
      for (let i = 0; i < 4; i++) {
        const ph = (t * 0.9 + i * 0.27 + pi * 0.13) % 1;
        const a = i * 2.1 + pi;
        const x = cx + Math.cos(a) * rx * 0.55;
        const y = cy + Math.sin(a) * ry * 0.5;
        ctx.strokeStyle = `rgba(255,255,255,${(1 - ph) * 0.8})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(x, y, 2 + ph * rx * 0.32, (2 + ph * rx * 0.32) * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  // cachoeiras
  for (const f of FALLS) {
    ctx.save();
    ctx.beginPath();
    f.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * K, y * K) : ctx.moveTo(x * K, y * K)));
    ctx.closePath();
    ctx.clip();
    const xs = f.pts.map((p) => p[0] * K);
    const ys = f.pts.map((p) => p[1] * K);
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);
    const span = Math.hypot(x1 - x0, y1 - y0);
    ctx.lineCap = "round";
    for (let i = 0; i < f.streaks; i++) {
      const lane = (i + 0.5) / f.streaks;
      const ph = (t * (0.55 + (i % 3) * 0.12) + i * 0.173) % 1;
      // percorre a diagonal da cachoeira no sentido da correnteza
      const sx = x1 - (x1 - x0) * ph + (lane - 0.5) * 10;
      const sy = y0 + (y1 - y0) * ph * 0.95 + (lane - 0.5) * (y1 - y0) * 0.9;
      const len = span * 0.12;
      ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.5 * Math.sin(ph * Math.PI)})`;
      ctx.lineWidth = 2.2 + (i % 3) * 0.8;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + f.dx * len, sy + f.dy * len);
      ctx.stroke();
    }
    // espuma no pé da cachoeira
    for (let i = 0; i < 6; i++) {
      const tw = 0.5 + 0.5 * Math.sin(t * 5 + i * 1.7);
      ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.4 * tw})`;
      ctx.beginPath();
      ctx.arc(x0 + (x1 - x0) * (0.05 + 0.12 * i) * 0.9, y1 - 3 - tw * 3, 2 + tw * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
}
