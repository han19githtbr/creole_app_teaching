/**
 * Desenho de cada quadro de um conto: cena animada, transição, legendas em francês
 * (com a palavra falada em destaque), cartão da moral, abertura e encerramento com o Instagram.
 */
import { clamp, easeOutCubic, rgrad, type Ctx } from "./artCore";
import { renderSceneArt, STAGE_H, STAGE_W } from "./scene";
import { drawSocialIcon } from "../talkingAvatar";
import { CROSSFADE, type PlannedLine, type PlannedScene, type TalePlan } from "./timeline";

export const TALE_INSTAGRAM_HANDLE = "frances_com_tres_nativos";

export interface TaleRenderOptions {
  /** Mostra a tradução em português, pequena, abaixo da legenda. */
  showPt: boolean;
}

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const SUB_BOTTOM = 1560; // legendas acima da faixa que o Instagram cobre

function wrap(ctx: Ctx, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export function renderTaleFrame(ctx: Ctx, W: number, H: number, t: number, plan: TalePlan, opts: TaleRenderOptions) {
  const s = W / STAGE_W;
  ctx.save();
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  const scenes = plan.scenes;
  const art = (scene: PlannedScene, time: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, STAGE_W, STAGE_H);
    ctx.clip();
    const local = time - scene.start;
    renderSceneArt(ctx, plan.tale.scenes[scene.index].art, local + scene.index * 3.1, clamp(local / scene.dur));
    ctx.restore();
  };

  if (t < plan.introDur) {
    art(scenes[0], scenes[0].start + (t / plan.introDur) * 1.2);
    drawIntro(ctx, plan, t);
  } else if (t >= plan.endStart) {
    const last = scenes[scenes.length - 1];
    art(last, last.end + (t - plan.endStart) * 0.3);
    drawEnd(ctx, plan, t - plan.endStart);
  } else {
    let i = scenes.findIndex((sc) => t >= sc.start && t < sc.end);
    if (i < 0) i = scenes.length - 1;
    const scene = scenes[i];
    if (i > 0 && t - scene.start < CROSSFADE) {
      art(scenes[i - 1], t);
      const a = easeOutCubic((t - scene.start) / CROSSFADE);
      ctx.globalAlpha = a;
      art(scene, t);
      ctx.globalAlpha = 1;
    } else if (i === 0 && t - scene.start < 0.6) {
      art(scene, t);
      ctx.fillStyle = `rgba(0,0,0,${0.55 * (1 - (t - scene.start) / 0.6)})`;
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    } else {
      art(scene, t);
    }
    drawSubtitle(ctx, plan, scene, t, opts);
  }
  ctx.restore();
  void H;
}

function activeLine(scene: PlannedScene, t: number): PlannedLine | null {
  let current: PlannedLine | null = null;
  for (const line of scene.lines) if (t >= line.start - 0.05) current = line;
  if (!current) return null;
  const last = scene.lines[scene.lines.length - 1];
  if (current === last && t > current.start + current.dur + 1.1) return null;
  return current;
}

function drawSubtitle(ctx: Ctx, plan: TalePlan, scene: PlannedScene, t: number, opts: TaleRenderOptions) {
  const line = activeLine(scene, t);
  if (!line) return;
  const def = plan.tale.scenes[scene.index];
  const appear = easeOutCubic((t - line.start + 0.05) / 0.3);
  const progress = clamp((t - line.start) / Math.max(0.5, line.dur));

  if (def.moral) {
    drawMoral(ctx, line.text, appear, def.pt, opts.showPt);
    return;
  }

  const maxW = 900;
  ctx.font = `800 58px ${SANS}`;
  const rows = wrap(ctx, line.text, maxW);
  const rowH = 80;
  const ptRows = opts.showPt ? (ctx.font = `italic 600 36px ${SANS}`, wrap(ctx, ptLineFor(def.pt, scene, line), maxW)) : [];
  const boxH = rows.length * rowH + (ptRows.length ? ptRows.length * 48 + 14 : 0) + 52;
  const boxY = SUB_BOTTOM - boxH;

  ctx.save();
  ctx.globalAlpha = appear;
  ctx.translate(0, (1 - appear) * 24);
  ctx.beginPath();
  ctx.roundRect(70, boxY, STAGE_W - 140, boxH, 44);
  ctx.fillStyle = "rgba(8,12,28,0.62)";
  ctx.fill();

  // palavras já faladas em amarelo (proporcional ao tempo da frase)
  const total = rows.join(" ").length;
  const spoken = Math.floor(progress * total * 1.04);
  let consumed = 0;
  ctx.font = `800 58px ${SANS}`;
  ctx.textBaseline = "middle";
  rows.forEach((row, ri) => {
    const rowW = ctx.measureText(row).width;
    let x = STAGE_W / 2 - rowW / 2;
    const y = boxY + 26 + ri * rowH + rowH / 2;
    for (const word of row.split(" ")) {
      const color = consumed + word.length / 2 <= spoken ? "#ffd54a" : "#ffffff";
      ctx.lineJoin = "round";
      ctx.lineWidth = 9;
      ctx.strokeStyle = "rgba(10,14,30,0.85)";
      ctx.strokeText(word, x, y);
      ctx.fillStyle = color;
      ctx.fillText(word, x, y);
      x += ctx.measureText(`${word} `).width;
      consumed += word.length + 1;
    }
  });

  if (ptRows.length) {
    ctx.font = `italic 600 36px ${SANS}`;
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.textAlign = "center";
    ptRows.forEach((row, i) => ctx.fillText(row, STAGE_W / 2, boxY + 26 + rows.length * rowH + 30 + i * 48));
  }
  ctx.restore();
}

/** Tradução da cena inteira (a frase a frase não existe), curta o bastante para 2 linhas. */
function ptLineFor(pt: string, scene: PlannedScene, line: PlannedLine): string {
  const sentences = pt.match(/[^.!?”]+[.!?”]+\s*/g)?.map((x) => x.trim()) ?? [pt];
  const idx = scene.lines.indexOf(line);
  return sentences.length === scene.lines.length ? sentences[idx] ?? pt : pt;
}

function drawMoral(ctx: Ctx, text: string, appear: number, pt: string, showPt: boolean) {
  const stripped = text.replace(/^Morale\s*:\s*/i, "");
  const body = stripped.charAt(0).toUpperCase() + stripped.slice(1);
  ctx.save();
  ctx.globalAlpha = appear;
  ctx.translate(0, (1 - appear) * 30);
  ctx.font = `italic 700 62px ${SERIF}`;
  const rows = wrap(ctx, body, 820);
  const rowH = 82;
  const boxH = rows.length * rowH + 190 + (showPt ? 70 : 0);
  const y = SUB_BOTTOM - boxH;
  ctx.beginPath();
  ctx.roundRect(60, y, STAGE_W - 120, boxH, 52);
  ctx.fillStyle = "rgba(20,14,40,0.72)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,213,74,0.8)";
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffd54a";
  ctx.font = `800 40px ${SANS}`;
  ctx.fillText("MORALE", STAGE_W / 2, y + 78);
  ctx.fillRect(STAGE_W / 2 - 60, y + 100, 120, 4);
  ctx.fillStyle = "#ffffff";
  ctx.font = `italic 700 62px ${SERIF}`;
  rows.forEach((row, i) => ctx.fillText(row, STAGE_W / 2, y + 190 + i * rowH));
  if (showPt) {
    ctx.font = `italic 600 36px ${SANS}`;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(pt, STAGE_W / 2, y + boxH - 40);
  }
  ctx.restore();
}

function drawIntro(ctx: Ctx, plan: TalePlan, t: number) {
  const fadeIn = clamp(t / 0.6);
  const fadeOut = 1 - clamp((t - (plan.introDur - 0.7)) / 0.7);
  ctx.fillStyle = `rgba(8,12,30,${0.5 * fadeOut + 0.12})`;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.save();
  ctx.globalAlpha = fadeIn * fadeOut;
  ctx.translate(0, (1 - easeOutCubic(t / 0.9)) * 40);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffd54a";
  ctx.font = `800 42px ${SANS}`;
  ctx.fillText("CONTE EN FRANÇAIS", STAGE_W / 2, 640);
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 24;
  ctx.font = `italic 800 112px ${SERIF}`;
  const rows = wrap(ctx, plan.tale.title, 880);
  rows.forEach((row, i) => ctx.fillText(row, STAGE_W / 2, 790 + i * 130));
  ctx.shadowColor = "transparent";
  const y = 790 + rows.length * 130 + 30;
  ctx.font = `600 44px ${SANS}`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(plan.tale.byline, STAGE_W / 2, y + 40);
  const label = `NIVEAU ${plan.tale.level}`;
  ctx.font = `800 34px ${SANS}`;
  const w = ctx.measureText(label).width + 64;
  ctx.beginPath();
  ctx.roundRect(STAGE_W / 2 - w / 2, y + 88, w, 62, 31);
  ctx.fillStyle = "rgba(255,213,74,0.95)";
  ctx.fill();
  ctx.fillStyle = "#2a1a05";
  ctx.textBaseline = "middle";
  ctx.fillText(label, STAGE_W / 2, y + 120);
  ctx.restore();
}

function drawEnd(ctx: Ctx, plan: TalePlan, lt: number) {
  const dark = clamp(lt / 0.9) * 0.78;
  ctx.fillStyle = `rgba(8,10,28,${dark})`;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  const pop = easeOutCubic((lt - 0.3) / 0.7);
  const fade = clamp((lt - 0.2) / 0.5);
  const cx = STAGE_W / 2;
  const cy = 940;

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;
  ctx.font = `italic 800 150px ${SERIF}`;
  ctx.fillText("Fin", cx, cy - 330);
  ctx.shadowColor = "transparent";
  ctx.font = `700 46px ${SANS}`;
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText("Suis-nous sur Instagram", cx, cy - 150);

  // logo do Instagram com anéis pulsando
  ctx.save();
  ctx.translate(cx, cy + 10);
  for (let k = 0; k < 2; k++) {
    const ph = (lt * 0.8 + k * 0.5) % 1;
    ctx.beginPath();
    ctx.arc(0, 0, 140 + ph * 90, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - ph)})`;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  const sc = 0.6 + 0.4 * pop + Math.sin(lt * 3) * 0.012;
  ctx.scale(sc, sc);
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 30;
  drawSocialIcon(ctx, "instagram", 0, 0, 250);
  ctx.restore();

  // nome do perfil, ajustado à largura
  const handle = `@${TALE_INSTAGRAM_HANDLE}`;
  let px = 78;
  ctx.font = `800 ${px}px ${SANS}`;
  while (px > 40 && ctx.measureText(handle).width > 920) {
    px -= 2;
    ctx.font = `800 ${px}px ${SANS}`;
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillText(handle, cx, cy + 270);
  ctx.font = `600 40px ${SANS}`;
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillText("Le français avec trois natifs", cx, cy + 340);
  ctx.restore();
  void plan;
  void rgrad;
}
