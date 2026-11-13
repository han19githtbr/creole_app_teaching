/**
 * Desenho (canvas 2D) da fauna, dos retalhos de folhagem e da água animada da trilha.
 * Usado igualmente pelo jogo (canvas sobre o mapa) e pelo vídeo: tudo em unidades do mundo,
 * com o contexto já transformado pela câmera.
 */
import type { TrailWeather } from "@/lib/curiousTrailData";
import { FAUNA_IDS, VECTOR_FAUNA_IDS, type Critter, type Fauna, type Mood } from "@/lib/trailFauna";
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
    FAUNA_IDS.filter((id) => !VECTOR_FAUNA_IDS.has(id)).map(async (id) => {
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

// Todas as espécies quadrúpedes possuem as 4 patas (2 traseiras e 2 dianteiras)
// configuradas com articulação diagonal e grupos A e B em FAUNA_RIGS.
function rigPartsWithCompleteLegs(_id: string, parts: RigPart[]): RigPart[] {
  return parts;
}

/** Silhueta de ave (pequena ou de rapina) com asas que batem individualmente. Origem = centro do corpo. */
function drawBirdShape(
  ctx: CanvasRenderingContext2D,
  { size, isRaptor, flap, wingAngle, flapping, foraging }: { size: number; isRaptor: boolean; flap: number; wingAngle: number; flapping: boolean; foraging: boolean }
) {
    const bodyColor = isRaptor ? "#604a37" : "#46504a";
    const wingColor = isRaptor ? "#4e3d31" : "#343d39";
    const bellyColor = isRaptor ? "#c3b79f" : "#a7a18f";
    const wingW = isRaptor ? size * 0.9 : size * 0.63;
    const wingH = isRaptor ? size * 0.34 : size * 0.27;

    // As asas são desenhadas individualmente e batem em oposição natural, em vez de deformar o bando como uma imagem única.
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * (isRaptor ? size * 0.2 : size * 0.13), -size * 0.16);
      ctx.rotate(side * wingAngle);
      ctx.fillStyle = wingColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(side * wingW * 0.28, -wingH * 0.78, side * wingW, -wingH * (0.35 + Math.max(0, flap) * 0.28));
      ctx.quadraticCurveTo(side * wingW * 0.65, wingH * 0.42, side * size * 0.2, wingH * 0.24);
      ctx.closePath();
      ctx.fill();
      if (isRaptor) {
        ctx.strokeStyle = "rgba(224, 211, 188, .52)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let feather = 1; feather <= 3; feather++) {
          ctx.moveTo(side * wingW * (0.38 + feather * 0.13), -wingH * (0.16 + feather * 0.04));
          ctx.lineTo(side * wingW * (0.66 + feather * 0.09), wingH * (0.19 + feather * 0.04));
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(-size * 0.02, -size * 0.08 + (foraging ? size * 0.12 : 0), size * (isRaptor ? 0.4 : 0.36), size * 0.19, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(size * 0.06, -size * 0.015 + (foraging ? size * 0.12 : 0), size * 0.21, size * 0.095, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(size * 0.29, -size * 0.19 + (foraging ? size * 0.12 : 0), size * (isRaptor ? 0.19 : 0.16), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d9a84f";
    ctx.beginPath();
    ctx.moveTo(size * 0.4, -size * 0.2 + (foraging ? size * 0.12 : 0));
    ctx.lineTo(size * (isRaptor ? 0.61 : 0.56), -size * 0.16 + (foraging ? size * 0.12 : 0));
    ctx.lineTo(size * 0.4, -size * 0.12 + (foraging ? size * 0.12 : 0));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#172019";
    ctx.beginPath(); ctx.arc(size * 0.33, -size * 0.22 + (foraging ? size * 0.12 : 0), isRaptor ? 1.4 : 0.8, 0, Math.PI * 2); ctx.fill();

    if (!flapping) {
      ctx.strokeStyle = isRaptor ? "#8d6b43" : "#4e4635";
      ctx.lineWidth = isRaptor ? 1.3 : 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.01); ctx.lineTo(size * 0.04, size * 0.11);
      ctx.moveTo(size * 0.14, -size * 0.01); ctx.lineTo(size * 0.16, size * 0.11);
      ctx.stroke();
      if (foraging) {
        ctx.strokeStyle = "rgba(245, 208, 95, .82)";
        ctx.beginPath(); ctx.moveTo(size * 0.6, -size * 0.02); ctx.lineTo(size * 0.88, size * 0.05); ctx.stroke();
      }
    }
}

/** Vaga-lumes (piscam), morcegos (batem asas e caçam insetos) e borboletas (voo ondulado e pousos). */
function drawAmbient(ctx: CanvasRenderingContext2D, fauna: Fauna, t: number) {
  const list = fauna.ambient;
  if (!list.length) return;
  // brilho dos vaga-lumes (aditivo) por baixo das silhuetas
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const m of list) {
    if (m.kind !== "firefly" || m.state === "gone" || m.glow <= 0.02) continue;
    const r = 7 + m.glow * 16;
    const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r);
    g.addColorStop(0, `rgba(235, 255, 150, ${0.95 * m.glow})`);
    g.addColorStop(0.35, `rgba(190, 245, 90, ${0.42 * m.glow})`);
    g.addColorStop(1, "rgba(160, 230, 70, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
    ctx.fill();
    // o clarão acende de leve a folhagem em volta
    const g2 = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r * 3.2);
    g2.addColorStop(0, `rgba(200, 255, 120, ${0.09 * m.glow})`);
    g2.addColorStop(1, "rgba(200, 255, 120, 0)");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(m.x, m.y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  for (const m of list) {
    if (m.state === "gone") continue;
    if (m.kind === "firefly") {
      // corpinho escuro com a "lanterna" na ponta do abdome
      ctx.fillStyle = "#1c1f14";
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, 2.2, 1.3, m.a, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(230, 255, 140, ${0.25 + m.glow * 0.75})`;
      ctx.beginPath();
      ctx.arc(m.x - Math.cos(m.a) * 1.8, m.y - Math.sin(m.a) * 1.8, 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (m.kind === "bat") {
      const face = Math.cos(m.a) >= 0 ? 1 : -1;
      const flap = Math.sin(m.phase * 22 + m.seed);
      const hunting = m.state === "hunt";
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.scale(face, 1);
      ctx.rotate(Math.sin(m.a) * (face > 0 ? 0.5 : -0.5) + (hunting ? 0.25 : 0));
      ctx.fillStyle = "#17141f";
      ctx.strokeStyle = "#0d0b12";
      ctx.lineWidth = 0.8;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(0, -1);
        ctx.rotate(side * (0.15 + flap * 0.85) * 0.9 - 0.2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(side * 6, -9, side * 17, -4);
        ctx.quadraticCurveTo(side * 14, -1, side * 13, 1);
        ctx.quadraticCurveTo(side * 9, -1, side * 8, 3);
        ctx.quadraticCurveTo(side * 4, 0, 0, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.ellipse(0, 1, 4.2, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4.4, -0.8, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(3.2, -2.6); ctx.lineTo(3.8, -5.4); ctx.lineTo(5.2, -2.8);
      ctx.moveTo(5.2, -2.4); ctx.lineTo(6.6, -5); ctx.lineTo(6.6, -1.8);
      ctx.fill();
      ctx.restore();
    } else {
      const hues = ["#f59e0b", "#3b82f6", "#f4d03f", "#e8f0ff"];
      const col = hues[Math.floor(m.seed) % hues.length];
      const open = m.state === "rest" ? 0.35 + 0.35 * Math.sin(t * 1.3 + m.seed) : Math.abs(Math.sin(m.phase * 9 + m.seed));
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(Math.sin(m.a) * 0.3);
      for (const side of [-1, 1]) {
        ctx.fillStyle = col;
        ctx.strokeStyle = "rgba(40,25,15,.7)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.ellipse(side * 3.2 * open, -2, 3.6 * open + 0.4, 4.4, side * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.45)";
        ctx.beginPath();
        ctx.ellipse(side * 3.8 * open, 1.8, 2.4 * open + 0.3, 2.8, -side * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#2a1f18";
      ctx.fillRect(-0.5, -4, 1, 7);
      ctx.restore();
    }
  }
}

function drawSkyBirds(ctx: CanvasRenderingContext2D, fauna: Fauna) {
  for (const bird of fauna.skyBirds) {
    const isRaptor = bird.kind === "raptor";
    const size = isRaptor ? 48 : 13 + Math.abs(Math.sin(bird.seed)) * 6;
    const flap = Math.sin(bird.phase);
    const flapping = bird.state === "fly" || bird.state === "hunt" || bird.state === "flee";
    const wingAngle = flapping ? flap * (isRaptor ? 0.75 : 0.95) : -0.1;
    const foraging = bird.state === "forage";
    ctx.save();
    ctx.translate(bird.x, bird.y - bird.z);
    ctx.scale(bird.facing, 1);

    // Sombra sutil sólo cuando la ave pasa baja junto a la copa.
    if (bird.z > 8) {
      ctx.fillStyle = `rgba(12, 25, 20, ${Math.max(0.04, 0.12 - bird.z / 900)})`;
      ctx.beginPath(); ctx.ellipse(0, bird.z + 12, size * 0.7, size * 0.12, 0, 0, Math.PI * 2); ctx.fill();
    }

    drawBirdShape(ctx, { size, isRaptor, flap, wingAngle, flapping, foraging });
    ctx.restore();
  }
}

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
  const effort = Math.min(1.35, c.v / Math.max(1, c.spec.speed));
  const run = (c.mood === "flee" || c.mood === "lunge" ? 1.18 : 0.92) * Math.max(0.45, effort);
  const bodyBob = moving && !hopping
    ? Math.abs(Math.sin(c.phase * 2)) * rig.ih * 0.012 * Math.max(0.5, effort)
    : Math.sin(t * 2.1 + c.seed) * 0.65;
  const bodyPitch = moving
    ? Math.sin(c.phase * 2 + 0.45) * 2.2 * Math.max(0.45, effort)
    : Math.sin(t * 1.25 + c.seed) * 0.45;
  const bodyPart = rig.parts.find((p) => p.kind === "body");
  const parts = rigPartsWithCompleteLegs(id, rig.parts);
  const angleOf = (p: RigPart): { a: number; dy: number } => {
    if (p.kind === "leg") {
      if (hopping) {
        // As patas recolhem durante o voo e se estendem na aterrissagem.
        const airborne = Math.max(0, Math.sin(c.phase));
        const foreleg = (p.x - rig.iw / 2) * nativeFace > 0;
        const tuck = foreleg ? -17 : 23;
        const land = foreleg ? 15 : -12;
        return { a: moving ? nativeFace * (tuck * airborne + land * (1 - airborne)) : 0, dy: 0 };
      }
      if (!moving) return { a: 0, dy: 0 };
      const ph = c.phase + (p.group === "B" ? Math.PI : 0);
      const foreleg = (p.x - rig.iw / 2) * nativeFace > 0;
      const swing = -nativeFace * (foreleg ? 19 : 23) * run * Math.sin(ph);
      // Levanta o casco/pata ao avançar e mantém o apoio próximo ao chão no recuo.
      const lift = Math.max(0, Math.cos(ph)) * p.h * 0.11 * run;
      return { a: swing, dy: -lift };
    }
    if (p.kind === "tail") {
      const sp = moving ? 1.8 : 1;
      return { a: Math.sin(t * 3.2 * sp + c.seed) * (moving ? 11 : 6) * (c.mood === "threat" ? 2 : 1), dy: 0 };
    }
    if (p.kind === "head") {
      if (c.mood === "forage") return { a: nativeFace * (17 + Math.sin(t * 3 + c.seed) * 2), dy: 0 };
      const sniff = c.mood === "alert" ? -nativeFace * -6 : 0;
      return { a: (moving ? Math.sin(c.phase * 2 + 1) * 3 : Math.sin(t * 1.3 + c.seed) * 2.2) + sniff, dy: 0 };
    }
    return { a: 0, dy: 0 };
  };
  ctx.save();
  // O corpo acompanha o compasso dos apoios, em vez de deslizar rígido sobre as patas.
  ctx.translate(0, -bodyBob);
  ctx.rotate(bodyPitch * RAD);
  ctx.scale(k, k);
  ctx.translate(-rig.iw / 2, -rig.ih);
  const draw = (p: RigPart) => {
    const { a, dy } = angleOf(p);
    ctx.save();
    ctx.translate(p.px, p.py + dy);
    ctx.rotate((a * Math.PI) / 180);
    if (p.kind === "leg") ctx.scale(1.015, 1.035);
    ctx.translate(-p.px, -p.py);
    const trimTop = p.trimTop ?? 0;
    ctx.drawImage(atlas, p.sx, p.sy + trimTop, p.w, p.h - trimTop, p.x, p.y, p.w, p.h);
    // Membros distantes (Group B ou atrás do tronco) recebem sombreamento volumétrico sob o ventre
    if (p.kind === "leg" && (p.group === "B" || p.behindBody)) {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgba(10, 22, 16, 0.36)";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.restore();
    }
    ctx.restore();
  };
  // Mantém as patas distantes atrás do corpo; depois desenha o corpo e as patas próximas à frente.
  // Desenhar os dois grupos antes do corpo escondia parte das patas dianteiras e fazia alguns bichos
  // parecerem ter apenas três patas.
  for (const p of parts) if ((p.kind === "leg" && (p.group === "B" || p.behindBody)) || p.kind === "tail") draw(p);
  if (bodyPart) draw(bodyPart);
  for (const p of parts) if (p.kind === "leg" && p.group === "A" && !p.behindBody) draw(p);
  for (const p of parts) if (p.kind === "head") draw(p);
  ctx.restore();
}

/**
 * Desenha pássaros em voo real com batimento de asas fluido, corpo aerodinâmico e garras recolhidas
 * (sem nenhum galho preso às patas, corrigindo o efeito de pássaro pausado).
 */
function drawFlyingBird(
  ctx: CanvasRenderingContext2D,
  c: Critter,
  spId: string,
  h: number,
  w: number,
  weather: TrailWeather,
  t: number
) {
  const flap = Math.sin(c.phase);
  const flapWing = flap * 0.72;
  const tipFlex = Math.cos(c.phase) * 0.22;
  const bob = -Math.abs(flap) * (h * 0.06);

  ctx.save();
  ctx.translate(0, bob);

  let bodyColor = "#111827";
  let wingFarColor = "#0f172a";
  let wingNearColor = "#1e293b";
  let featherTone = "#334155";
  let beakColor = "#f59e0b";
  let accentColor = "#ef4444";
  let chestColor = "#f8fafc";

  if (spId === "tucano") {
    bodyColor = "#090d16";
    wingFarColor = "#0b1220";
    wingNearColor = "#1e293b";
    featherTone = "#3b82f6";
    beakColor = "#f59e0b";
    accentColor = "#dc2626";
    chestColor = "#fef08a";
  } else if (spId === "coruja") {
    bodyColor = "#78350f";
    wingFarColor = "#572407";
    wingNearColor = "#92400e";
    featherTone = "#b45309";
    beakColor = "#d97706";
    accentColor = "#fef3c7";
    chestColor = "#fef3c7";
  } else if (spId === "picapau") {
    bodyColor = "#18181b";
    wingFarColor = "#09090b";
    wingNearColor = "#27272a";
    featherTone = "#e4e4e7";
    beakColor = "#71717a";
    accentColor = "#dc2626";
    chestColor = "#f4f4f5";
  }

  // 1. Asa traseira (por trás do corpo)
  ctx.save();
  ctx.translate(-w * 0.08, -h * 0.52);
  ctx.rotate(-flapWing * 0.85 - 0.2);
  ctx.fillStyle = wingFarColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-w * 0.45, -h * (0.65 - tipFlex), -w * 0.75, -h * (0.5 + flapWing * 0.3));
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.1, -w * 0.15, -h * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Cauda aerodinâmica
  ctx.save();
  ctx.translate(-w * 0.36, -h * 0.38);
  ctx.rotate(0.12 - flap * 0.05);
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.08);
  ctx.lineTo(-w * 0.35, -h * 0.14);
  ctx.lineTo(-w * 0.38, h * 0.04);
  ctx.lineTo(0, h * 0.04);
  ctx.closePath();
  ctx.fill();
  if (spId === "tucano") {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(-w * 0.04, 0, h * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Corpo e cabeça horizontais / aerodinâmicos
  ctx.save();
  ctx.translate(0, -h * 0.46);

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.32, h * 0.24, 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = chestColor;
  ctx.beginPath();
  ctx.ellipse(w * 0.14, -h * 0.02, w * 0.15, h * 0.18, 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Patas recolhidas (sem galho!)
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.ellipse(-w * 0.04, h * 0.18, w * 0.06, h * 0.04, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Olho
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(w * 0.22, -h * 0.09, h * 0.048, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(w * 0.23, -h * 0.09, h * 0.024, 0, Math.PI * 2);
  ctx.fill();

  // Crista (pica-pau)
  if (spId === "picapau") {
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(w * 0.15, -h * 0.16);
    ctx.lineTo(w * 0.05, -h * 0.32);
    ctx.lineTo(w * 0.25, -h * 0.15);
    ctx.closePath();
    ctx.fill();
  }

  // Bico característico projetado à frente
  if (spId === "tucano") {
    ctx.fillStyle = beakColor;
    ctx.beginPath();
    ctx.moveTo(w * 0.26, -h * 0.14);
    ctx.quadraticCurveTo(w * 0.52, -h * 0.2, w * 0.68, -h * 0.02);
    ctx.quadraticCurveTo(w * 0.48, h * 0.05, w * 0.26, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(w * 0.54, -h * 0.14);
    ctx.quadraticCurveTo(w * 0.64, -h * 0.12, w * 0.68, -h * 0.02);
    ctx.quadraticCurveTo(w * 0.58, 0, w * 0.54, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#090d16";
    ctx.beginPath();
    ctx.arc(w * 0.66, -h * 0.02, h * 0.028, 0, Math.PI * 2);
    ctx.fill();
  } else if (spId === "coruja") {
    ctx.fillStyle = beakColor;
    ctx.beginPath();
    ctx.moveTo(w * 0.26, -h * 0.07);
    ctx.lineTo(w * 0.35, -h * 0.03);
    ctx.lineTo(w * 0.26, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = beakColor;
    ctx.beginPath();
    ctx.moveTo(w * 0.26, -h * 0.08);
    ctx.lineTo(w * 0.52, -h * 0.05);
    ctx.lineTo(w * 0.26, -h * 0.02);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();

  // 4. Asa dianteira com batimento de asas
  ctx.save();
  ctx.translate(w * 0.02, -h * 0.48);
  ctx.rotate(flapWing + 0.1);
  ctx.fillStyle = wingNearColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(w * 0.25, -h * (0.6 + tipFlex), -w * 0.42, -h * (0.68 + flapWing * 0.2));
  ctx.quadraticCurveTo(-w * 0.28, -h * 0.1, -w * 0.08, 0);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = featherTone;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-w * 0.1, -h * 0.3);
  ctx.lineTo(-w * 0.36, -h * (0.62 + flapWing * 0.18));
  ctx.moveTo(-w * 0.05, -h * 0.22);
  ctx.lineTo(-w * 0.28, -h * (0.55 + flapWing * 0.15));
  ctx.stroke();
  ctx.restore();

  // 5. Linhas de ar sutis na ponta das asas
  if (Math.abs(flap) > 0.4) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-w * 0.45, -h * 0.8 + flapWing * h * 0.2);
    ctx.lineTo(-w * 0.7, -h * 0.75 + flapWing * h * 0.2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawVectorAnimal(ctx: CanvasRenderingContext2D, id: string, w: number, h: number, c: Critter, t: number, moving: boolean) {
  if (id === "coelho") {
    const crouch = c.mood === "alert" ? 0.92 : 1;
    const stride = moving ? Math.sin(c.phase) : 0;
    const airborne = moving ? Math.max(0, Math.sin(c.phase)) : 0;
    const farLeg = (hind: boolean) => {
      const hipX = hind ? -w * 0.2 : w * 0.13;
      const hipY = hind ? -h * 0.23 : -h * 0.2;
      const swing = stride * (hind ? -w * 0.09 : w * 0.08);
      const tuck = airborne * (hind ? -w * 0.08 : -w * 0.035);
      ctx.strokeStyle = "#755c48";
      ctx.lineWidth = Math.max(1.6, h * 0.075);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.quadraticCurveTo(hipX + swing * 0.45, hipY + h * 0.12, hipX + swing + tuck, -h * 0.03 + airborne * h * 0.12);
      ctx.stroke();
    };
    const nearLeg = (hind: boolean) => {
      const hipX = hind ? -w * 0.18 : w * 0.16;
      const hipY = hind ? -h * 0.23 : -h * 0.2;
      const swing = stride * (hind ? -w * 0.1 : w * 0.09);
      const tuck = airborne * (hind ? -w * 0.09 : -w * 0.03);
      ctx.strokeStyle = "#755940";
      ctx.lineWidth = Math.max(2, h * 0.09);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.quadraticCurveTo(hipX + swing * 0.45, hipY + h * 0.12, hipX + swing + tuck, -h * 0.015 + airborne * h * 0.12);
      ctx.stroke();
    };
    // O par distante fica sob o corpo; o próximo aparece à frente, como em uma passada real.
    farLeg(true);
    farLeg(false);
    ctx.fillStyle = "#8c6b51";
    ctx.beginPath(); ctx.ellipse(-w * 0.22, -h * 0.18, w * 0.2, h * 0.16, stride * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#cbb79c";
    ctx.beginPath(); ctx.ellipse(-w * 0.04, -h * 0.42 * crouch, w * 0.38, h * 0.3, -0.06, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w * 0.28, -h * 0.67 * crouch, w * 0.2, h * 0.21, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#a98b72";
    ctx.beginPath(); ctx.ellipse(w * 0.22, -h * 1.02 * crouch, w * 0.075, h * 0.28, -0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w * 0.38, -h * 0.99 * crouch, w * 0.07, h * 0.26, 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e7a5a0";
    ctx.beginPath(); ctx.ellipse(w * 0.22, -h * 1.02 * crouch, w * 0.032, h * 0.19, -0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w * 0.38, -h * 0.99 * crouch, w * 0.03, h * 0.17, 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#241914";
    ctx.beginPath(); ctx.arc(w * 0.36, -h * 0.72 * crouch, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f4ede2";
    ctx.beginPath(); ctx.ellipse(-w * 0.4, -h * 0.47, h * 0.075, h * 0.075, 0, 0, Math.PI * 2); ctx.fill();
    nearLeg(true);
    nearLeg(false);
    return;
  }
  if (id === "cobra") {
    const crawl = moving ? 2.7 + Math.min(2.8, c.v * 0.055) : 0.9;
    const wavePhase = c.clk * crawl + c.seed;
    const points = Array.from({ length: 7 }, (_, i) => {
      const u = i / 6;
      return {
        x: -w * 0.48 + w * 0.77 * u,
        y: -h * (0.08 + 0.4 * u) + Math.sin(wavePhase - u * Math.PI * 3.2) * h * (0.1 - u * 0.035),
      };
    });
    const strokeBody = () => {
      ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        ctx.quadraticCurveTo(points[i].x, points[i].y, (points[i].x + points[i + 1].x) / 2, (points[i].y + points[i + 1].y) / 2);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y); ctx.stroke();
    };
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "#263f29"; ctx.lineWidth = h * 0.5;
    strokeBody();
    ctx.strokeStyle = c.mood === "threat" ? "#9e6b35" : "#66864a"; ctx.lineWidth = h * 0.33;
    strokeBody();
    ctx.fillStyle = c.mood === "threat" ? "#9e6b35" : "#789655";
    const head = points[points.length - 1];
    ctx.beginPath(); ctx.ellipse(head.x + w * 0.035, head.y - h * 0.025, w * 0.14, h * 0.18, -0.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f8e9b0"; ctx.beginPath(); ctx.arc(head.x + w * 0.09, head.y - h * 0.075, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#161b13"; ctx.beginPath(); ctx.arc(head.x + w * 0.095, head.y - h * 0.075, 0.8, 0, Math.PI * 2); ctx.fill();
    if (c.mood === "threat" || Math.sin(c.clk * 7 + c.seed) > 0.96) {
      ctx.strokeStyle = "#d15b55"; ctx.lineWidth = 1.3; ctx.beginPath();
      ctx.moveTo(head.x + w * 0.13, head.y + h * 0.015); ctx.lineTo(head.x + w * 0.24, head.y + h * 0.03); ctx.lineTo(head.x + w * 0.15, head.y + h * 0.05); ctx.stroke();
    }
    return;
  }
  if (id === "caracol") {
    const creep = c.clk * (moving ? 1.2 : 0.42) + c.seed;
    const footPulse = moving ? Math.sin(creep * 2) * h * 0.035 : Math.sin(creep) * h * 0.012;
    ctx.fillStyle = "#d7c49a"; ctx.beginPath(); ctx.ellipse(0, -h * 0.12 + footPulse, w * 0.48, h * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#88623c"; ctx.beginPath(); ctx.arc(-w * 0.05, -h * 0.65, h * 0.44, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d9b878"; ctx.beginPath(); ctx.arc(-w * 0.05, -h * 0.65, h * 0.33, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#8a6037"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(-w * 0.05, -h * 0.65, h * 0.23, 0, Math.PI * 1.75); ctx.stroke();
    const feelerA = Math.sin(creep * 1.4) * h * 0.045;
    const feelerB = Math.sin(creep * 1.1 + 1.5) * h * 0.04;
    ctx.strokeStyle = "#c6ad7f"; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(w * 0.25, -h * 0.21); ctx.quadraticCurveTo(w * 0.28, -h * 0.58, w * 0.34 + feelerA, -h * 0.84);
    ctx.moveTo(w * 0.42, -h * 0.18); ctx.quadraticCurveTo(w * 0.43, -h * 0.48, w * 0.47 + feelerB, -h * 0.7); ctx.stroke();
    ctx.fillStyle = "#242017"; ctx.beginPath(); ctx.arc(w * 0.34 + feelerA, -h * 0.86, 1, 0, Math.PI * 2); ctx.arc(w * 0.47 + feelerB, -h * 0.72, 1, 0, Math.PI * 2); ctx.fill();
    if (moving && Math.floor(c.clk * 0.8) % 2 === 0) {
      ctx.strokeStyle = "rgba(205, 220, 192, .48)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(-w * 0.42, h * 0.035); ctx.quadraticCurveTo(-w * 0.58, h * 0.07, -w * 0.72, h * 0.025); ctx.stroke();
    }
    return;
  }
  if (id === "formiga") {
    for (let i = 0; i < 3; i++) {
      const ax = (i - 1) * w * 0.38;
      const stride = moving ? c.clk * 11 + i * 1.4 : Math.sin(t * 1.8 + c.seed + i) * 0.25;
      const bob = moving ? Math.abs(Math.sin(stride * 2)) * h * 0.035 : Math.sin(t * 2 + c.seed + i) * h * 0.015;
      ctx.strokeStyle = "#30251c"; ctx.lineWidth = 0.75; ctx.lineCap = "round";
      for (let leg = 0; leg < 3; leg++) {
        const lx = ax + (leg - 1) * w * 0.055;
        const swing = Math.sin(stride + (leg % 2 ? Math.PI : 0)) * w * 0.045;
        ctx.beginPath();
        ctx.moveTo(lx, -h * 0.37 + bob); ctx.lineTo(lx + swing, -h * 0.19); ctx.lineTo(lx + swing * 1.4, -h * 0.015);
        ctx.moveTo(lx, -h * 0.37 + bob); ctx.lineTo(lx - swing, -h * 0.19); ctx.lineTo(lx - swing * 1.4, -h * 0.015);
        ctx.stroke();
      }
      ctx.fillStyle = "#332319";
      ctx.beginPath();
      ctx.arc(ax - w * 0.11, -h * 0.38 + bob, h * 0.16, 0, Math.PI * 2);
      ctx.arc(ax, -h * 0.39 + bob, h * 0.11, 0, Math.PI * 2);
      ctx.arc(ax + w * 0.13, -h * 0.39 + bob, h * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#332319"; ctx.lineWidth = 0.55;
      ctx.beginPath(); ctx.moveTo(ax + w * 0.19, -h * 0.44 + bob); ctx.quadraticCurveTo(ax + w * 0.24, -h * 0.55, ax + w * 0.28, -h * 0.48 + Math.sin(stride) * h * 0.025);
      ctx.moveTo(ax + w * 0.17, -h * 0.43 + bob); ctx.quadraticCurveTo(ax + w * 0.19, -h * 0.53, ax + w * 0.23, -h * 0.5);
      ctx.stroke();
    }
    return;
  }
  if (id === "pacu") {
    const swimPhase = moving ? c.clk * (3.5 + c.v * 0.08) + c.seed : t * 1.15 + c.seed;
    const tailBeat = Math.sin(swimPhase * 2) * w * (moving ? 0.065 : 0.025);
    ctx.fillStyle = "#356d68";
    ctx.beginPath(); ctx.moveTo(-w * 0.4, -h * 0.5); ctx.lineTo(-w * 0.68, -h * 0.84 + tailBeat); ctx.lineTo(-w * 0.65, -h * 0.16 + tailBeat); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#4a9d8b";
    ctx.beginPath(); ctx.ellipse(0, -h * 0.5, w * 0.48, h * (0.38 + Math.sin(swimPhase * 2) * 0.012), Math.sin(swimPhase) * 0.025, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#77b6a0";
    ctx.beginPath(); ctx.moveTo(-w * 0.05, -h * 0.74); ctx.lineTo(w * 0.12, -h * (1.02 + Math.sin(swimPhase * 2) * 0.045)); ctx.lineTo(w * 0.28, -h * 0.69); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#b7d8b8";
    ctx.beginPath(); ctx.moveTo(-w * 0.05, -h * 0.28); ctx.lineTo(w * 0.16, -h * 0.03); ctx.lineTo(w * 0.3, -h * 0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#12231d"; ctx.beginPath(); ctx.arc(w * 0.31, -h * 0.59, 1.5, 0, Math.PI * 2); ctx.fill();
  }
}

function drawRealisticGroundShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  lift: number,
  weather: TrailWeather,
  facing: number
) {
  const airScale = Math.max(0.18, 1 - Math.max(0, lift) / 130);
  const blurFactor = 1 + Math.max(0, lift) * 0.04;

  ctx.save();
  // 1. Sombra de oclusão de contato profunda (Ambient Occlusion) sob as patas e ventre
  // Fixa o animal com firmeza no solo da mata, eliminando o efeito de adesivo/recorte solto
  const aoAlpha = (weather === "night" ? 0.42 : 0.48) * airScale;
  ctx.fillStyle = `rgba(10, 20, 14, ${aoAlpha})`;
  ctx.beginPath();
  ctx.ellipse(x, y + 1, w * 0.28 * airScale, h * 0.055 * airScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Sombra projetada direcional que responde à iluminação do clima (Sol ou Lua)
  // UMA fonte de luz coerente: o sol (dia) e a lua (noite) ficam no alto à direita do mapa, como na arte.
  // Por isso todas as sombras caem para a esquerda/baixo e NÃO dependem do lado para onde o bicho olha.
  const sunDx = Math.max(-1, Math.min(1, (x - 820) / 700));
  let shadowDx = sunDx * w * 0.2 - w * 0.06;
  let shadowDy = h * 0.045;
  let castAlpha = 0.24 * airScale;
  let shadowTint = "rgba(10, 20, 14, ";

  if (weather === "night") {
    // Luar vindo do alto à direita (x: 780, y: 108)
    shadowDx = sunDx * w * 0.14 - w * 0.03;
    shadowDy = h * 0.055;
    shadowTint = "rgba(6, 12, 28, ";
    castAlpha = 0.2 * airScale;
  } else if (weather === "rain") {
    // Solo úmido encharcado: sombra mais difusa e espalhada
    castAlpha = 0.3 * airScale;
    shadowDy = h * 0.025;
    shadowTint = "rgba(16, 26, 22, ";
  } else if (weather === "snow") {
    castAlpha = 0.25 * airScale;
    shadowTint = "rgba(28, 42, 58, ";
  }

  ctx.fillStyle = `${shadowTint}${castAlpha})`;
  ctx.beginPath();
  ctx.ellipse(
    x + shadowDx,
    y + shadowDy,
    w * 0.36 * airScale * blurFactor,
    h * 0.08 * airScale * blurFactor,
    sunDx * 0.12,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}

function drawGroundFoliageContact(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  weather: TrailWeather,
  seed: number
) {
  // Desenha micro-tufos de grama/folhas do solo cobrindo levemente as patas (2-3px)
  // Isso quebra a borda dura do sprite contra o fundo e ancora o animal à mata viva
  ctx.save();
  ctx.translate(x, y);
  const colorA = weather === "snow" ? "rgba(195, 218, 235, 0.78)" : weather === "night" ? "rgba(20, 38, 28, 0.75)" : "rgba(42, 74, 32, 0.85)";
  const colorB = weather === "snow" ? "rgba(225, 240, 252, 0.85)" : weather === "night" ? "rgba(32, 54, 38, 0.7)" : "rgba(68, 108, 42, 0.8)";
  const spread = w * 0.3;
  const blades = 4;
  for (let i = 0; i < blades; i++) {
    const u = i / (blades - 1) - 0.5;
    const bx = u * spread + Math.sin(seed + i * 2.3) * (spread * 0.15);
    const bh = 3.2 + Math.abs(Math.sin(seed * 3 + i)) * 3.2;
    const bend = Math.sin(seed + i * 1.7) * 2.6;
    ctx.strokeStyle = i % 2 === 0 ? colorA : colorB;
    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(bx, 1);
    ctx.quadraticCurveTo(bx + bend * 0.5, -bh * 0.6, bx + bend, -bh);
    ctx.stroke();
  }
  ctx.restore();
}

function applyEnvironmentalRimLighting(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  weather: TrailWeather,
  /** lado (no desenho do bicho) que fica voltado para a luz: +1 direita, -1 esquerda */
  litSide = 1
) {
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  if (weather === "night") {
    // Luar prateado na silhueta superior e sombra noturna azulada no ventre
    const grad = ctx.createLinearGradient(0, -h, 0, 0);
    grad.addColorStop(0, "rgba(215, 235, 255, 0.32)");
    grad.addColorStop(0.32, "rgba(140, 185, 240, 0.1)");
    grad.addColorStop(1, "rgba(8, 16, 36, 0.28)");
    ctx.fillStyle = grad;
    ctx.fillRect(-w * 1.2, -h * 1.3, w * 2.4, h * 1.6);
  } else if (weather === "sunny") {
    // Luz solar filtrada pelas copas nas costas e reflexo quente da vegetação por baixo
    const grad = ctx.createLinearGradient(0, -h, 0, 0);
    grad.addColorStop(0, "rgba(255, 248, 210, 0.25)");
    grad.addColorStop(0.35, "rgba(255, 235, 170, 0.06)");
    grad.addColorStop(1, "rgba(25, 48, 18, 0.18)");
    ctx.fillStyle = grad;
    ctx.fillRect(-w * 1.2, -h * 1.3, w * 2.4, h * 1.6);
  } else if (weather === "rain") {
    // Brilho úmido (wet sheen) nas superfícies superiores e sombra densa difusa
    const grad = ctx.createLinearGradient(0, -h, 0, 0);
    grad.addColorStop(0, "rgba(225, 245, 255, 0.24)");
    grad.addColorStop(0.28, "rgba(190, 220, 240, 0.05)");
    grad.addColorStop(1, "rgba(14, 26, 30, 0.22)");
    ctx.fillStyle = grad;
    ctx.fillRect(-w * 1.2, -h * 1.3, w * 2.4, h * 1.6);
  } else if (weather === "snow") {
    // Geada alpina e pó de neve nas costas
    const grad = ctx.createLinearGradient(0, -h, 0, 0);
    grad.addColorStop(0, "rgba(245, 250, 255, 0.38)");
    grad.addColorStop(0.25, "rgba(215, 235, 255, 0.1)");
    grad.addColorStop(1, "rgba(14, 24, 38, 0.16)");
    ctx.fillStyle = grad;
    ctx.fillRect(-w * 1.2, -h * 1.3, w * 2.4, h * 1.6);
  }
  // luz lateral: o lado voltado para o sol/lua (alto à direita) recebe um fio de luz; o oposto, penumbra
  if (weather === "sunny" || weather === "night") {
    const lg = ctx.createLinearGradient(w * 0.5 * litSide, 0, -w * 0.5 * litSide, 0);
    if (weather === "sunny") {
      lg.addColorStop(0, "rgba(255, 240, 190, 0.24)");
      lg.addColorStop(0.5, "rgba(255, 240, 190, 0)");
      lg.addColorStop(1, "rgba(20, 40, 20, 0.14)");
    } else {
      lg.addColorStop(0, "rgba(190, 220, 255, 0.3)");
      lg.addColorStop(0.5, "rgba(190, 220, 255, 0)");
      lg.addColorStop(1, "rgba(6, 12, 30, 0.22)");
    }
    ctx.fillStyle = lg;
    ctx.fillRect(-w * 1.2, -h * 1.3, w * 2.4, h * 1.6);
  }
  ctx.restore();
}

/** Camada transparente reutilizada para desenhar cada bicho isoladamente. */
let critterLayer: HTMLCanvasElement | null = null;

function drawCritter(ctx: CanvasRenderingContext2D, c: Critter, assets: FaunaAssets, weather: TrailWeather, t: number) {
  const sp = c.spec;
  if (sp.id === "gaviao") {
    // Gavião-carijó: ave de rapina diurna, pousada ou em voo/mergulho com as asas batendo
    const flying = c.state === "fly";
    const diving = c.mood === "lunge";
    ctx.save();
    ctx.translate(c.x, c.y - c.z - sp.h * 0.2);
    ctx.scale(c.look < 0 ? -1 : 1, 1);
    if (diving) ctx.rotate(0.5);
    drawBirdShape(ctx, { size: 56, isRaptor: true, flap: Math.sin(c.phase), wingAngle: flying ? Math.sin(c.phase) * 0.75 : -0.1, flapping: flying, foraging: c.mood === "forage" });
    ctx.restore();
    if (c.mood !== "hidden") drawMoodIcon(ctx, c.mood, c.x, c.y - c.z - sp.h - 12, t);
    return;
  }
  const base = assets.sprites[sp.id];
  const vector = VECTOR_FAUNA_IDS.has(sp.id);
  if (!base && !vector) return;

  if (c.mood === "hidden") {
    // Oculto dentro da vegetação densa: não surge como recorte flutuando no meio do cenário
    const peek = Math.sin(c.clk * 1.5 + c.seed);
    if (peek < 0.65) return;
    ctx.save();
    ctx.globalAlpha = 0.35 + (peek - 0.65) * 1.4;
  }

  const img = base ? graded(sp.id, base, weather) : null;
  const iw = base?.naturalWidth || (sp.id === "coelho" ? 1.42 : sp.id === "cobra" ? 2.3 : sp.id === "caracol" ? 1.5 : sp.id === "pacu" ? 2.2 : 2.1);
  const ih = base?.naturalHeight || 1;

  // Escala de altitude na montanha: animais no topo (y menor) são sutilmente menores em perspectiva
  const altitudeScale = 0.88 + (c.y / 2201) * 0.16;
  const h = sp.h * altitudeScale;
  const w = ((sp.h * iw) / ih) * altitudeScale;

  const moving = c.state === "move" && (sp.hop ? c.hopState >= 1 && c.hopState <= 3 : c.v > 2);
  const riggedGround = sp.kind === "ground" && Boolean(assets.rigs[sp.id] && FAUNA_RIGS[sp.id]);
  const moveDx = c.tx - c.x;
  const moveDy = c.ty - c.y;
  const facing = moving && Math.abs(moveDx) > 0.1 ? (moveDx < 0 ? -1 : 1) : (c.look < 0 ? -1 : 1);

  // Inclinação corporal realista em relevo (no máximo 6-8 graus), eliminando o efeito de recorte tombado
  const slopeAngle = moving ? (Math.atan2(moveDy * 0.22, Math.max(20, Math.abs(moveDx))) * (moveDx < 0 ? -1 : 1)) / RAD : 0;
  const heading = Math.max(-7, Math.min(7, slopeAngle));

  let lift = c.z;
  let sx = 1;
  let sy = 1;
  let rot = 0;
  let jx = 0;

  // Foreshortening em perspectiva 2.5D durante deslocamento
  if (moving) {
    if (moveDy < -6) {
      sy *= 0.94; // subindo para o fundo
      sx *= 0.98;
    } else if (moveDy > 6) {
      sy *= 1.03; // descendo para a frente
      sx *= 1.01;
    }
  }

  if (sp.kind === "ground") {
    if (sp.hop) {
      // ciclo real de pulo: agacha (carrega) -> estica no impulso -> corpo inclina no ar -> amortece ao pousar
      const u = Math.min(1, c.hopU);
      if (c.state === "move" && c.hopState === 1) {
        sy *= 0.82;
        sx *= 1.12;
        rot += 3;
      } else if (c.hopState === 2) {
        const stretch = u < 0.28 ? 1.14 : u > 0.78 ? 0.97 : 1.04;
        sy *= stretch;
        sx *= 2 - stretch;
        rot += (u - 0.5) * (sp.id === "sapo" ? 26 : 20);
      } else if (c.hopState === 3) {
        sy *= 0.86;
        sx *= 1.1;
      } else if (c.hopState === 4) {
        // sentado: o sapo infla e esvazia a garganta; o coelho fica ereto e atento
        sy *= 1 + Math.sin(t * (sp.id === "sapo" ? 5.5 : 3) + c.seed) * (sp.id === "sapo" ? 0.035 : 0.012);
        if (sp.id === "coelho") sy *= 1.05;
      }
    } else if (moving) {
      lift += Math.abs(Math.sin(c.phase)) * h * (riggedGround ? 0.009 : 0.026);
      rot += Math.sin(c.phase * 2) * (riggedGround ? 0.7 : 1.8);
      if (!riggedGround) {
        sx *= 1 + Math.sin(c.phase * 2) * 0.018;
        sy *= 1 - Math.sin(c.phase * 2) * 0.018;
      }
    }
    if (!moving) {
      sy *= 1 + Math.sin(c.clk * 1.5 + c.seed) * 0.012;
      if (c.mood === "forage" && !FAUNA_RIGS[sp.id]) rot += Math.sin(t * 3 + c.seed) * 2.5;
    }
  } else if (c.state === "fly") {
    const f = Math.sin(c.phase);
    if (!sp.hangs) {
      sx *= 1 + f * 0.1;
      sy *= 1 - f * 0.1;
      rot += 9;
    }
  } else if (sp.pecks && c.mood === "calm") {
    const burst = Math.max(0, Math.sin(c.clk * 0.7 + c.seed));
    rot += Math.sin(c.clk * 6.5 + c.seed) * 2.6 * burst;
  } else if (sp.hangs) {
    rot += Math.sin(c.clk * 0.35 + c.seed) * 2.2;
    lift += Math.sin(c.clk * 0.7 + c.seed) * h * 0.012;
  } else {
    sy *= 1 + Math.sin(c.clk * 1.2 + c.seed) * 0.012;
    if (sp.kind === "perch") {
      lift += Math.max(0, Math.sin(c.clk * 1.7 + c.seed)) * h * 0.012;
      rot += Math.sin(c.clk * 0.9 + c.seed) * 0.9;
    }
  }

  switch (c.mood) {
    case "flee":
    case "lunge":
      rot += Math.sin(c.phase * 2) * 2.2 + 2;
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
      jx = Math.sin(c.clk * 5 + c.seed) * 0.55;
      rot += Math.sin(c.clk * 3.2 + c.seed) * 0.9 - 2;
      break;
    default:
      break;
  }
  if (c.react > 0) lift += Math.sin((c.react / 0.7) * Math.PI) * 12;

  // Sombra no chão realista: oclusão profunda sob as patas + sombra direcional suave
  if (!(sp.kind === "perch" && c.state !== "fly")) {
    drawRealisticGroundShadow(ctx, c.x, c.y, w, h, lift, weather, facing);
  }

  // O bicho é desenhado numa CAMADA TRANSPARENTE ISOLADA: assim a luz (luar, sol, umidade) só afeta os
  // pixels do animal. Aplicada direto no mapa, a mistura "source-atop" pintaria um retângulo em volta dele.
  const mainCtx = ctx;
  let layerOut: { cv: HTMLCanvasElement; E: number } | null = null;
  {
    const M = mainCtx.getTransform();
    const sc = Math.hypot(M.a, M.b) || 1;
    const E = Math.max(h * 1.6, w * 1.5) + 34 + Math.max(0, lift);
    const px = Math.ceil(2 * E * sc);
    if (px >= 8 && px <= 1500 && typeof document !== "undefined") {
      if (!critterLayer) critterLayer = document.createElement("canvas");
      const lcv = critterLayer;
      if (lcv.width < px || lcv.height < px) {
        lcv.width = px;
        lcv.height = px;
      }
      const lctx = lcv.getContext("2d");
      if (lctx) {
        lctx.setTransform(1, 0, 0, 1, 0, 0);
        lctx.globalAlpha = 1;
        lctx.globalCompositeOperation = "source-over";
        lctx.clearRect(0, 0, lcv.width, lcv.height);
        lctx.setTransform(sc, 0, 0, sc, (E - c.x) * sc, (E - c.y) * sc);
        ctx = lctx;
        layerOut = { cv: lcv, E };
      }
    }
  }

  ctx.save();
  ctx.translate(c.x + jx, c.y - lift);
  // O corpo acompanha a inclinação suave do terreno
  ctx.rotate((heading + rot * facing) * RAD);
  ctx.scale(facing * sp.face * sx, sy);
  const rigAtlas = assets.rigs[sp.id];
  if (c.state === "fly" && sp.kind === "perch" && !sp.hangs) {
    drawFlyingBird(ctx, c, sp.id, h, w, weather, t);
  } else if (vector) {
    drawVectorAnimal(ctx, sp.id, w, h, c, t, moving);
  } else if (rigAtlas && FAUNA_RIGS[sp.id] && sp.kind === "ground") {
    drawRigged(ctx, graded(`rig:${sp.id}`, rigAtlas, weather), sp.id, h, sp.face, c, t, moving, Boolean(sp.hop));
  } else if (sp.hangs) {
    if (img) ctx.drawImage(img, -w / 2, -h * 0.05, w, h);
  } else {
    if (img) ctx.drawImage(img, -w / 2, -h, w, h);
  }
  // Aplica iluminação de borda e sombra ambiental para harmonizar o bicho com a mata
  applyEnvironmentalRimLighting(ctx, w, h, weather, (c.look * sp.face) >= 0 ? 1 : -1);
  ctx.restore();
  if (layerOut) {
    // leva a camada (com a luz já aplicada só no animal) para o mapa, em escala 1:1 com a tela
    ctx = mainCtx;
    const px = Math.ceil(2 * layerOut.E * (Math.hypot(mainCtx.getTransform().a, mainCtx.getTransform().b) || 1));
    mainCtx.drawImage(layerOut.cv, 0, 0, px, px, c.x - layerOut.E, c.y - layerOut.E, 2 * layerOut.E, 2 * layerOut.E);
  }

  // Integração com o solo: micro-vegetação cobrindo levemente a base das patas no chão
  if (sp.kind === "ground" && lift <= 2) {
    drawGroundFoliageContact(ctx, c.x, c.y, w, weather, c.seed);
  }

  if (c.mood === "hidden") {
    ctx.restore();
  }

  if (c.mood !== "hidden") {
    const topY = sp.hangs ? c.y + h * 0.9 : c.y - lift - h * sy - 10;
    drawMoodIcon(ctx, c.mood, c.x, topY - (sp.hangs ? h : 0), t);
  }
}

/** Efeitos visuais e atmosfera viva da mata: raios de sol, luar, vagalumes, névoas e esporos. */
function drawForestAtmosphere(
  ctx: CanvasRenderingContext2D,
  weather: TrailWeather,
  t: number
) {
  ctx.save();

  if (weather === "sunny") {
    // 1. Raios de Sol Volumétricos (God Rays) filtrando pelas frestas das copas
    const beams = [
      { x1: 220, y1: 60, x2: 380, y2: 720, w: 90, ph: 0 },
      { x1: 520, y1: 100, x2: 670, y2: 840, w: 110, ph: 1.8 },
      { x1: 710, y1: 140, x2: 880, y2: 980, w: 100, ph: 3.5 },
    ];
    for (const b of beams) {
      const shimmer = 0.035 + 0.02 * Math.sin(t * 0.75 + b.ph);
      const grad = ctx.createLinearGradient(b.x1, b.y1, b.x2, b.y2);
      grad.addColorStop(0, `rgba(255, 246, 215, ${shimmer * 1.3})`);
      grad.addColorStop(0.5, `rgba(255, 242, 195, ${shimmer})`);
      grad.addColorStop(1, "rgba(255, 240, 185, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(b.x1 - b.w * 0.3, b.y1);
      ctx.lineTo(b.x1 + b.w * 0.3, b.y1);
      ctx.lineTo(b.x2 + b.w * 0.85, b.y2);
      ctx.lineTo(b.x2 - b.w * 0.85, b.y2);
      ctx.closePath();
      ctx.fill();
    }
    // 2. Esporos dourados / poeira vegetal flutuando na luz do sol
    for (let i = 0; i < 18; i++) {
      const px = ((i * 59 + t * 9 + Math.sin(t * 0.6 + i) * 22) % 960) + 20;
      const py = ((340 + i * 95 + Math.cos(t * 0.5 + i * 1.3) * 35) % 1800) + 150;
      const tw = Math.max(0, Math.sin(t * 1.8 + i * 2.1));
      ctx.fillStyle = `rgba(255, 245, 185, ${tw * 0.55})`;
      ctx.beginPath();
      ctx.arc(px, py, 1.2 + tw * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (weather === "night") {
    // 1. Vagalumes (Fireflies) bioluminescentes flutuando suavemente pelo sub-bosque da mata
    for (let i = 0; i < 22; i++) {
      const baseX = 80 + (i * 44) % 840;
      const baseY = 420 + (i * 78) % 1450;
      const driftX = baseX + Math.sin(t * 0.85 + i * 1.7) * 45;
      const driftY = baseY + Math.cos(t * 0.65 + i * 2.2) * 32;
      const glow = Math.max(0, Math.sin(t * 2.2 + i * 1.9)) ** 3;
      if (glow > 0.05) {
        // Halo suave verde-dourado
        ctx.fillStyle = `rgba(163, 230, 53, ${glow * 0.32})`;
        ctx.beginPath();
        ctx.arc(driftX, driftY, 5 + glow * 4, 0, Math.PI * 2);
        ctx.fill();
        // Núcleo luminoso
        ctx.fillStyle = `rgba(254, 240, 138, ${glow * 0.95})`;
        ctx.beginPath();
        ctx.arc(driftX, driftY, 1.3 + glow * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // 2. Fachos translúcidos de luar filtrados pela copa alta
    const moonShafts = [
      { x1: 780, y1: 110, x2: 450, y2: 1200, w: 160 },
      { x1: 780, y1: 110, x2: 240, y2: 1400, w: 190 },
    ];
    for (const ms of moonShafts) {
      const shimmer = 0.025 + 0.015 * Math.sin(t * 0.6 + ms.w);
      const grad = ctx.createLinearGradient(ms.x1, ms.y1, ms.x2, ms.y2);
      grad.addColorStop(0, `rgba(220, 238, 255, ${shimmer * 1.4})`);
      grad.addColorStop(0.6, `rgba(175, 215, 255, ${shimmer})`);
      grad.addColorStop(1, "rgba(20, 35, 70, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(ms.x1 - 25, ms.y1);
      ctx.lineTo(ms.x1 + 25, ms.y1);
      ctx.lineTo(ms.x2 + ms.w, ms.y2);
      ctx.lineTo(ms.x2 - ms.w, ms.y2);
      ctx.closePath();
      ctx.fill();
    }
  } else if (weather === "rain") {
    // Brumas úmidas e névoa da serra deslizando suavemente pelas curvas da montanha
    for (let i = 0; i < 4; i++) {
      const my = 480 + i * 360 + Math.sin(t * 0.4 + i) * 20;
      const mx = ((t * 22 + i * 280) % 1300) - 150;
      const grad = ctx.createRadialGradient(mx, my, 20, mx, my, 220);
      grad.addColorStop(0, "rgba(220, 238, 248, 0.075)");
      grad.addColorStop(0.6, "rgba(205, 225, 240, 0.035)");
      grad.addColorStop(1, "rgba(200, 220, 235, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(mx, my, 240, 55, 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Desenha bichos e retalhos de folhagem (os bichos passam ATRÁS dos retalhos quando estão mais ao fundo). */
/* ------------------------------------------------------------------ casinha do cume (desenhada por código) */

const HUT_ORIGIN = { x: 536, y: 128 };
const HUT_SPRITE_W = 220;
const HUT_SPRITE_H = 150;
const HUT_PX = 4; // pixels do sprite por unidade do mundo
const hutCache = new Map<string, CanvasImageSource>();

const rnd01 = (a: number, b = 0) => {
  const x = Math.sin(a * 91.7 + b * 17.3) * 43758.5453;
  return x - Math.floor(x);
};

/** Parte estática da casinha (morrinho de grama, paredes de pedra, telhado de sapê, porta, janela), com o clima já aplicado. */
function buildHutSprite(weather: TrailWeather): CanvasImageSource | null {
  if (typeof document === "undefined") return null;
  const key = weather;
  const hit = hutCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = HUT_SPRITE_W * HUT_PX;
  c.height = HUT_SPRITE_H * HUT_PX;
  const g = c.getContext("2d");
  if (!g) return null;
  g.scale(HUT_PX, HUT_PX);
  g.translate(-HUT_ORIGIN.x, -HUT_ORIGIN.y);
  const ink = "#43301f";
  g.lineJoin = "round";
  g.lineCap = "round";

  // morrinho de grama que cobre o chão do cume (e a emenda da arte atrás)
  const mound = g.createLinearGradient(0, 190, 0, 262);
  mound.addColorStop(0, "#c4e35e");
  mound.addColorStop(0.55, "#9ccc46");
  mound.addColorStop(1, "#78ad38");
  g.fillStyle = "rgba(30,50,20,0.22)";
  g.beginPath();
  g.ellipse(628, 240, 98, 30, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = mound;
  g.strokeStyle = "#3f5f24";
  g.lineWidth = 2.2;
  g.beginPath();
  g.ellipse(622, 226, 94, 34, 0, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = "rgba(255,255,200,0.28)";
  g.beginPath();
  g.ellipse(608, 216, 56, 12, -0.08, 0, Math.PI * 2);
  g.fill();
  // tufos e florzinhas
  g.strokeStyle = "#4f8a2c";
  g.lineWidth = 1.2;
  for (let i = 0; i < 26; i++) {
    const x = 540 + rnd01(i, 1) * 168;
    const y = 214 + rnd01(i, 2) * 36;
    if (((x - 622) / 94) ** 2 + ((y - 226) / 34) ** 2 > 0.86) continue;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - 2, y - 6);
    g.moveTo(x, y);
    g.lineTo(x + 2.5, y - 5);
    g.stroke();
    if (i % 4 === 0) {
      g.fillStyle = ["#ffd83a", "#ffffff", "#ff7a4a"][i % 3];
      g.beginPath();
      g.arc(x + 4, y - 3, 1.6, 0, Math.PI * 2);
      g.fill();
    }
  }

  if (weather === "snow") {
    g.save();
    g.beginPath();
    g.ellipse(622, 226, 94, 34, 0, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = "rgba(255,255,255,0.66)";
    g.fillRect(520, 190, 220, 90);
    g.restore();
  }

  // paredes de pedra
  const wall = g.createLinearGradient(580, 176, 580, 216);
  wall.addColorStop(0, "#dcc59b");
  wall.addColorStop(1, "#c4a577");
  g.fillStyle = wall;
  g.strokeStyle = ink;
  g.lineWidth = 2.6;
  g.beginPath();
  g.rect(581, 176, 68, 40);
  g.fill();
  g.stroke();
  g.strokeStyle = "rgba(90,64,38,0.55)";
  g.lineWidth = 1;
  for (let r = 0; r < 4; r++) {
    for (let k = 0; k < 6; k++) {
      const x = 583 + k * 11 + (r % 2) * 5;
      const y = 180 + r * 9.5;
      g.strokeRect(x, y, 9.6, 8);
    }
  }
  g.fillStyle = "rgba(60,40,22,0.2)"; // lado na sombra (luz vem do alto à direita)
  g.fillRect(581, 176, 16, 40);

  // porta em arco
  g.fillStyle = "#7d4b2a";
  g.strokeStyle = ink;
  g.lineWidth = 2.2;
  g.beginPath();
  g.moveTo(604, 216);
  g.lineTo(604, 198);
  g.quadraticCurveTo(612, 186, 620, 198);
  g.lineTo(620, 216);
  g.closePath();
  g.fill();
  g.stroke();
  g.strokeStyle = "rgba(40,22,10,0.6)";
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(612, 189);
  g.lineTo(612, 216);
  g.stroke();
  g.fillStyle = "#f2c04a";
  g.beginPath();
  g.arc(616.5, 208, 1.4, 0, Math.PI * 2);
  g.fill();
  // degrau de pedra
  g.fillStyle = "#bdb7a6";
  g.strokeStyle = ink;
  g.lineWidth = 1.6;
  g.beginPath();
  g.roundRect(601, 214.5, 22, 5, 2);
  g.fill();
  g.stroke();

  // janela
  g.fillStyle = weather === "night" ? "#ffe29a" : "#a9d6ee";
  g.strokeStyle = ink;
  g.lineWidth = 2;
  g.beginPath();
  g.rect(630, 188, 12, 12);
  g.fill();
  g.stroke();
  g.lineWidth = 1.2;
  g.beginPath();
  g.moveTo(636, 188);
  g.lineTo(636, 200);
  g.moveTo(630, 194);
  g.lineTo(642, 194);
  g.stroke();

  // chaminé de pedra
  g.fillStyle = "#98958c";
  g.strokeStyle = ink;
  g.lineWidth = 2.2;
  g.beginPath();
  g.rect(641, 148, 12, 28);
  g.fill();
  g.stroke();
  g.strokeStyle = "rgba(60,55,50,0.5)";
  g.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    g.beginPath();
    g.moveTo(641, 154 + i * 8);
    g.lineTo(653, 154 + i * 8);
    g.stroke();
  }

  // telhado de sapê
  const roof = g.createLinearGradient(560, 146, 660, 196);
  roof.addColorStop(0, "#e9c27c");
  roof.addColorStop(0.5, "#d8a24f");
  roof.addColorStop(1, "#b97f35");
  g.fillStyle = roof;
  g.strokeStyle = ink;
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(556, 190);
  g.quadraticCurveTo(580, 170, 612, 142);
  g.quadraticCurveTo(646, 168, 672, 190);
  for (let i = 0; i <= 12; i++) {
    const x = 672 - i * (116 / 12);
    g.lineTo(x, 190 + (i % 2 ? 7 : 3.5));
  }
  g.closePath();
  g.fill();
  g.stroke();
  // feixes de palha
  g.strokeStyle = "rgba(120,78,30,0.55)";
  g.lineWidth = 1.3;
  for (let i = 0; i < 16; i++) {
    const a = 566 + i * 6.8;
    g.beginPath();
    g.moveTo(612 + (a - 612) * 0.18, 150 + Math.abs(a - 612) * 0.12);
    g.quadraticCurveTo(a - 2, 172, a, 190 + (i % 2 ? 6 : 3));
    g.stroke();
  }
  g.fillStyle = "rgba(255,236,170,0.32)"; // luz do alto no lado direito do telhado
  g.beginPath();
  g.moveTo(612, 144);
  g.quadraticCurveTo(646, 168, 668, 188);
  g.lineTo(640, 190);
  g.quadraticCurveTo(630, 170, 612, 150);
  g.closePath();
  g.fill();
  g.fillStyle = "#c58b3e";
  g.strokeStyle = ink;
  g.lineWidth = 2;
  g.beginPath();
  g.ellipse(612, 143, 7, 3.6, 0, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  if (weather === "snow") {
    // neve acumulada no alto do telhado (recortada no desenho do telhado) e no morrinho
    g.save();
    g.beginPath();
    g.moveTo(556, 190);
    g.quadraticCurveTo(580, 170, 612, 142);
    g.quadraticCurveTo(646, 168, 672, 190);
    g.lineTo(556, 190);
    g.closePath();
    g.clip();
    g.fillStyle = "#ffffff";
    g.strokeStyle = "#5a6f9a";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(540, 120);
    g.lineTo(690, 120);
    g.lineTo(690, 183);
    for (let i = 0; i <= 10; i++) g.lineTo(690 - i * 15, 176 + (i % 2 ? 7 : 1) + Math.sin(i * 1.7) * 2);
    g.closePath();
    g.fill();
    g.beginPath();
    for (let i = 0; i <= 10; i++) {
      const x = 690 - i * 15;
      const y = 176 + (i % 2 ? 7 : 1) + Math.sin(i * 1.7) * 2;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
    g.restore();
  }
  const out = gradeImage(c, weather);
  hutCache.set(key, out);
  return out;
}

/**
 * Casinha do cume (destino da trilha). `celebrate` (0..1) acende a porta e solta estrelinhas quando o aluno
 * entra e comemora. A fumaça sobe da chaminé; à noite a janela e a porta emitem luz quente.
 */
export function drawHut(ctx: CanvasRenderingContext2D, t: number, weather: TrailWeather, celebrate = 0) {
  const sprite = buildHutSprite(weather);
  if (!sprite) return;
  ctx.save();
  const bounce = celebrate > 0 ? Math.abs(Math.sin(t * 6)) * 1.6 * celebrate : 0;
  ctx.translate(0, -bounce);
  ctx.drawImage(sprite, HUT_ORIGIN.x, HUT_ORIGIN.y, HUT_SPRITE_W, HUT_SPRITE_H);
  ctx.restore();

  // luz quente da janela e da porta
  const warm = weather === "night" ? 1 : weather === "rain" ? 0.55 : weather === "snow" ? 0.5 : 0.15;
  const lit = Math.min(1.2, warm + celebrate);
  if (lit > 0.1) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const [x, y, r] of [[636, 194, 34], [612, 204, 38]] as const) {
      const gr = ctx.createRadialGradient(x, y, 1, x, y, r);
      gr.addColorStop(0, `rgba(255, 214, 120, ${0.5 * lit})`);
      gr.addColorStop(1, "rgba(255, 190, 90, 0)");
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // fumaça da chaminé (some mais devagar na chuva/neve)
  ctx.save();
  for (let i = 0; i < 6; i++) {
    const ph = (t * 0.32 + i / 6) % 1;
    const x = 647 + Math.sin(ph * 5 + i) * 5 + ph * 12;
    const y = 146 - ph * 52;
    const r = 3.2 + ph * 9;
    ctx.fillStyle = weather === "night" ? `rgba(190,200,220,${0.42 * (1 - ph)})` : `rgba(240,240,240,${0.55 * (1 - ph)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // estrelinhas de festa quando o aluno comemora dentro/na porta
  if (celebrate > 0) {
    ctx.save();
    for (let i = 0; i < 14; i++) {
      const ph = (t * 0.9 + i * 0.19) % 1;
      const a = i * 2.4;
      const x = 612 + Math.cos(a) * (18 + ph * 54);
      const y = 190 + Math.sin(a) * (10 + ph * 40) - ph * 26;
      ctx.globalAlpha = (1 - ph) * celebrate;
      ctx.fillStyle = ["#fde047", "#f472b6", "#60a5fa", "#4ade80"][i % 4];
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const ang = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
        const ang2 = ang + Math.PI / 5;
        ctx.lineTo(x + Math.cos(ang) * 4.2, y + Math.sin(ang) * 4.2);
        ctx.lineTo(x + Math.cos(ang2) * 1.8, y + Math.sin(ang2) * 1.8);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

/** Estrelas (só na área de céu do mapa, nunca sobre a mata): x, y em unidades do mundo, raio. */
const NIGHT_STARS: [number, number, number][] = [
  [362, 24, 2.6], [405, 78, 2], [452, 40, 2.8], [498, 112, 2], [545, 18, 2.2], [588, 66, 3], [640, 30, 2.2], [690, 96, 2],
  [725, 44, 2.6], [838, 28, 2.2], [878, 84, 2.8], [925, 40, 2], [958, 112, 2.4], [980, 18, 2], [880, 150, 2], [790, 176, 2],
  [345, 128, 2], [420, 150, 1.8], [610, 150, 2.2], [940, 190, 1.8],
];

/**
 * Luz do céu sobre o mapa, desenhada POR CIMA de tudo (bichos e folhagem) com mistura aditiva, para não criar
 * emendas: noite = luar + lua + estrelas cintilando; dia = brilho e feixes de sol vindo do alto à direita.
 * A escuridão uniforme da noite fica no ajuste de cor (trailGrade.ts), igual na arte, nos retalhos e nos bichos.
 */
export function drawSkyLight(ctx: CanvasRenderingContext2D, t: number, weather: TrailWeather) {
  if (weather !== "night" && weather !== "sunny") return;
  ctx.save();
  if (weather === "night") {
    ctx.globalCompositeOperation = "lighter";
    ctx.save();
    ctx.translate(780, 150);
    ctx.scale(520, 420);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, "rgba(120, 150, 205, 0.2)");
    g.addColorStop(0.4, "rgba(80, 110, 170, 0.1)");
    g.addColorStop(1, "rgba(40, 60, 110, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalCompositeOperation = "source-over";
    // lua
    const corona = ctx.createRadialGradient(780, 108, 20, 780, 108, 62);
    corona.addColorStop(0, "rgba(255,255,255,0.85)");
    corona.addColorStop(0.6, "rgba(224,236,255,0.32)");
    corona.addColorStop(1, "rgba(175,201,239,0)");
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(780, 108, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(780, 108, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(148,163,184,0.3)";
    for (const [cx, cy, r] of [[770, 98, 7.5], [792, 114, 9], [776, 122, 5.5], [764, 112, 4]] as const) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // estrelas cintilantes
    NIGHT_STARS.forEach(([x, y, r], i) => {
      const tw = 0.55 + 0.45 * Math.sin(t * 1.7 + i * 1.3);
      ctx.fillStyle = `rgba(255, 248, 214, ${0.45 + 0.55 * tw})`;
      ctx.beginPath();
      ctx.arc(x, y, r * (0.8 + 0.3 * tw), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 248, 214, ${0.35 * tw})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - r * 2.4, y);
      ctx.lineTo(x + r * 2.4, y);
      ctx.moveTo(x, y - r * 2.4);
      ctx.lineTo(x, y + r * 2.4);
      ctx.stroke();
    });
  } else {
    // sol: brilho quente no alto à direita e feixes de luz atravessando a mata (mesma direção da sombra dos bichos)
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(840, 30, 10, 840, 30, 460);
    glow.addColorStop(0, "rgba(255, 238, 190, 0.2)");
    glow.addColorStop(0.5, "rgba(255, 226, 160, 0.07)");
    glow.addColorStop(1, "rgba(255, 220, 150, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(840, 30, 460, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const sway = 0.75 + 0.25 * Math.sin(t * 0.35 + i * 1.9);
      const x0 = 960 + i * 70;
      const g = ctx.createLinearGradient(x0, 0, x0 - 520, 760);
      g.addColorStop(0, `rgba(255, 240, 190, ${0.09 * sway})`);
      g.addColorStop(1, "rgba(255, 240, 190, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x0, -20);
      ctx.lineTo(x0 + 60, -20);
      ctx.lineTo(x0 - 460, 760);
      ctx.lineTo(x0 - 610, 760);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawFauna(ctx: CanvasRenderingContext2D, fauna: Fauna, assets: FaunaAssets, weather: TrailWeather, t: number) {
  for (const it of fauna.drawList()) {
    if (it.patch !== undefined) {
      const p = FOLIAGE_PATCHES[it.patch];
      const img = assets.patches[it.patch];
      if (!img) continue;

      const sourceY = Math.round((Math.max(0, Math.min(p.h, p.base - p.y)) / p.h) * img.naturalHeight);
      if (sourceY < img.naturalHeight) {
        ctx.drawImage(
          graded(`patch${it.patch}`, img, weather),
          0,
          sourceY,
          img.naturalWidth,
          img.naturalHeight - sourceY,
          p.x,
          p.base,
          p.w,
          p.y + p.h - p.base
        );
      }

      if (sourceY > 0) {
        ctx.drawImage(
          graded(`patch${it.patch}`, img, weather),
          0,
          0,
          img.naturalWidth,
          sourceY,
          p.x,
          p.y,
          p.w,
          p.base - p.y
        );
      }
    } else if (it.critter) {
      drawCritter(ctx, it.critter, assets, weather, t);
    }
  }

  drawSkyBirds(ctx, fauna);
  drawForestAtmosphere(ctx, weather, t);
  drawAmbient(ctx, fauna, t);

  // Rajadas curtas e regulares: a paisagem fica fixa e só folhas soltas cruzam a copa.
  // O mesmo ciclo guia as folhas e as linhas de vento, evitando movimentos desencontrados.
  const cycle = weather === "sunny" ? 12 : weather === "rain" ? 8 : 7;
  const phase = ((t % cycle) + cycle) % cycle;
  const gust = phase < 2.4 ? Math.sin((phase / 2.4) * Math.PI) : 0;
  if (gust > 0.08) {
    const direction = weather === "snow" ? -1 : 1;
    const canopySway = Math.sin(t * 2.2) * gust * 2.5;
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(224, 242, 254, ${0.08 + gust * 0.12})`;
    ctx.lineWidth = weather === "snow" ? 2.2 : 1.6;
    for (let i = 0; i < 5; i++) {
      const y = 280 + i * 370 + Math.sin(t * 1.7 + i) * 12;
      const travel = (phase * 170 + i * 190) % 1180 - 90;
      const x = direction > 0 ? travel : 1090 - travel;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + direction * 34, y - 10, x + direction * 72, y + 10, x + direction * 108, y - 2);
      ctx.stroke();
    }

    for (let i = 0; i < FOLIAGE_PATCHES.length; i++) {
      const p = FOLIAGE_PATCHES[i];
      // Pontas da copa acompanham a mesma rajada, em amplitude mínima.
      for (const side of [-1, 1]) {
        const tipX = p.cx + side * p.rx * 0.42 + canopySway;
        const tipY = p.cy + p.ry * 0.28 + Math.abs(canopySway) * 0.2;
        ctx.save();
        ctx.translate(tipX, tipY);
        ctx.rotate(side * 0.35 + canopySway * 0.025);
        ctx.fillStyle = weather === "snow" ? "rgba(220, 238, 255, 0.9)" : "rgba(150, 190, 78, 0.88)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const leafPhase = (phase * 0.55 + i * 0.173) % 1;
      const x = p.cx + direction * (leafPhase * 70 - 24);
      const y = p.cy + Math.sin(t * 3 + i) * p.ry * 0.24 + leafPhase * p.ry * 0.48;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(direction * (0.4 + leafPhase * 0.8));
      ctx.fillStyle = weather === "snow" ? `rgba(255,255,255,${0.65 + gust * 0.25})` : `rgba(132, 170, 64, ${0.6 + gust * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 5.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
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
