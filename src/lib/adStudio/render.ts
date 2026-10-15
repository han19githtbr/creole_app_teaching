// Motor de desenho do Estúdio de Propagandas.
// Tudo é desenhado em <canvas> (preview e exportação PNG usam exatamente o mesmo código),
// em coordenadas de "pixels do formato" (ex.: 1080×1350) — o chamador aplica a escala.
import { FONT_STACKS, resolveColor } from "./palettes";
import type {
  Background,
  ButtonLayer,
  CardLayer,
  IconLayer,
  ImageLayer,
  Layer,
  ListLayer,
  Palette,
  PhoneLayer,
  ShapeLayer,
  Slide,
  StatLayer,
  TextLayer,
} from "./types";

export type ImageGetter = (src: string) => CanvasImageSource | undefined;

export interface RenderOptions {
  width: number;
  height: number;
  /** Fator de resolução da exportação (1 = tamanho do formato). */
  scale?: number;
  palette: Palette;
  getImage: ImageGetter;
}

const EMOJI_FONTS = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji'";

function fontString(font: keyof typeof FONT_STACKS, weight: number, size: number, italic = false) {
  return `${italic ? "italic " : ""}${weight} ${Math.round(size)}px ${FONT_STACKS[font]}, ${EMOJI_FONTS}`;
}

function imgSize(img: CanvasImageSource): { w: number; h: number } {
  const anyImg = img as unknown as { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number };
  const w = anyImg.naturalWidth || anyImg.width || 1200;
  const h = anyImg.naturalHeight || anyImg.height || 800;
  return { w, h };
}

export function collectImageSrcs(slide: Slide): string[] {
  const out = new Set<string>();
  if (slide.bg.type === "image" && slide.bg.imageSrc) out.add(slide.bg.imageSrc);
  for (const layer of slide.layers) {
    if (layer.kind === "image" && layer.src) out.add(layer.src);
    if (layer.kind === "phone" && layer.imageSrc) out.add(layer.imageSrc);
  }
  return [...out];
}

// ---------------------------------------------------------------------------
// Primitivas
// ---------------------------------------------------------------------------
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function linearGradient(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, angleDeg: number, c1: string, c2: string) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const half = (Math.abs(Math.cos(a)) * w + Math.abs(Math.sin(a)) * h) / 2;
  const g = ctx.createLinearGradient(cx - Math.cos(a) * half, cy - Math.sin(a) * half, cx + Math.cos(a) * half, cy + Math.sin(a) * half);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function setShadow(ctx: CanvasRenderingContext2D, on: boolean, scale: number, strength = 1) {
  if (on) {
    ctx.shadowColor = `rgba(0,0,0,${0.32 * strength})`;
    ctx.shadowBlur = 30 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12 * scale;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
}

function withAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        out.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

/** Procura o maior tamanho de fonte (≤ start) em que o texto cabe em maxW × maxH. */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: keyof typeof FONT_STACKS,
  weight: number,
  italic: boolean,
  start: number,
  maxW: number,
  maxH: number,
  lineHeight: number,
  autoFit: boolean
) {
  let size = start;
  for (;;) {
    ctx.font = fontString(font, weight, size, italic);
    const lines = wrapLines(ctx, text, maxW);
    const widest = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
    const height = lines.length * size * lineHeight;
    if (!autoFit || size <= 12 || (height <= maxH && widest <= maxW + 1)) return { size, lines, height, widest };
    size -= 2;
  }
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, px: number) {
  const target = ctx as unknown as { letterSpacing?: string };
  if ("letterSpacing" in target) target.letterSpacing = `${px}px`;
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number,
  focusX = 50,
  focusY = 50,
  zoom = 1,
  contain = false
) {
  const { w: iw, h: ih } = imgSize(img);
  const base = contain ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
  const s = base * Math.max(0.2, zoom);
  const dw = iw * s;
  const dh = ih * s;
  const ox = contain ? (w - dw) / 2 : -(dw - w) * (focusX / 100);
  const oy = contain ? (h - dh) / 2 : -(dh - h) * (focusY / 100);
  ctx.drawImage(img, x + ox, y + oy, dw, dh);
}

// ---------------------------------------------------------------------------
// Fundo
// ---------------------------------------------------------------------------
function drawPattern(ctx: CanvasRenderingContext2D, bg: Background, W: number, H: number, color: string) {
  if (bg.pattern === "none" || bg.patternOpacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, bg.patternOpacity);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  switch (bg.pattern) {
    case "dots": {
      const step = 60;
      for (let y = step / 2; y < H; y += step) {
        for (let x = ((y / step) % 2 ? step : step / 2); x < W + step; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case "grid": {
      ctx.lineWidth = 2;
      for (let x = 0; x <= W; x += 72) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 72) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      break;
    }
    case "rays": {
      const cx = W / 2;
      const cy = H * 0.34;
      const n = 22;
      const R = Math.hypot(W, H);
      for (let i = 0; i < n; i += 2) {
        const a1 = (i / n) * Math.PI * 2;
        const a2 = ((i + 1) / n) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R);
        ctx.lineTo(cx + Math.cos(a2) * R, cy + Math.sin(a2) * R);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case "waves": {
      for (let k = 0; k < 4; k++) {
        const base = H - 120 - k * 70;
        ctx.globalAlpha = Math.min(1, bg.patternOpacity) * (1 - k * 0.2);
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(0, base);
        for (let x = 0; x <= W; x += 20) ctx.lineTo(x, base + Math.sin(x / 120 + k * 1.3) * 26);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case "diagonal": {
      ctx.lineWidth = 26;
      for (let d = -H; d < W + H; d += 90) {
        ctx.beginPath();
        ctx.moveTo(d, 0);
        ctx.lineTo(d + H, H);
        ctx.stroke();
      }
      break;
    }
    case "confetti": {
      const rnd = mulberry32(W * 31 + H);
      const count = Math.round((W * H) / 11000);
      for (let i = 0; i < count; i++) {
        const x = rnd() * W;
        const y = rnd() * H;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rnd() * Math.PI);
        if (rnd() > 0.5) ctx.fillRect(-9, -4, 18, 8);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      break;
    }
  }
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, bg: Background, o: RenderOptions) {
  const { width: W, height: H, palette } = o;
  const c1 = resolveColor(bg.color, palette) || "#1e3fd1";
  const c2 = resolveColor(bg.color2, palette) || c1;
  if (bg.type === "gradient") {
    ctx.fillStyle = linearGradient(ctx, 0, 0, W, H, bg.angle, c1, c2);
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, W, H);
  }
  if (bg.type === "image" && bg.imageSrc) {
    const img = o.getImage(bg.imageSrc);
    if (img) {
      ctx.save();
      if (bg.blur > 0) (ctx as unknown as { filter: string }).filter = `blur(${bg.blur * (o.scale ?? 1)}px)`;
      const pad = bg.blur * 2;
      drawImageCover(ctx, img, -pad, -pad, W + pad * 2, H + pad * 2);
      ctx.restore();
    }
  }
  if (bg.type === "image" && bg.overlay > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.92, bg.overlay);
    ctx.fillStyle = resolveColor(bg.overlayColor, palette) || "#000000";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  drawPattern(ctx, bg, W, H, resolveColor(bg.patternColor, palette) || "#ffffff");
}

// ---------------------------------------------------------------------------
// Camadas simples
// ---------------------------------------------------------------------------
function drawText(ctx: CanvasRenderingContext2D, L: TextLayer, o: RenderOptions) {
  const color = resolveColor(L.color, o.palette);
  const text = L.uppercase ? L.text.toUpperCase() : L.text;
  const pad = L.bgColor ? L.bgPadding : 0;
  const maxW = Math.max(10, L.w - pad * 2);
  const maxH = Math.max(10, L.h - pad * 2);
  setLetterSpacing(ctx, L.letterSpacing);
  const fit = fitText(ctx, text, L.font, L.weight, L.italic, L.size, maxW, maxH, L.lineHeight, L.autoFit);
  ctx.font = fontString(L.font, L.weight, fit.size, L.italic);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const lh = fit.size * L.lineHeight;
  const blockH = fit.lines.length * lh;
  let top = pad;
  if (L.valign === "middle") top = (L.h - blockH) / 2;
  else if (L.valign === "bottom") top = L.h - pad - blockH;

  const anchorX = L.align === "left" ? pad : L.align === "right" ? L.w - pad : L.w / 2;

  if (L.bgColor) {
    const bw = Math.min(L.w, fit.widest + pad * 2);
    const bx = L.align === "left" ? 0 : L.align === "right" ? L.w - bw : (L.w - bw) / 2;
    roundRectPath(ctx, bx, top - pad, bw, blockH + pad * 2, L.bgRadius);
    ctx.fillStyle = resolveColor(L.bgColor, o.palette);
    setShadow(ctx, !!L.shadow, o.scale ?? 1, 0.6);
    ctx.fill();
    setShadow(ctx, false, 1);
  }

  fit.lines.forEach((line, i) => {
    const w = ctx.measureText(line).width;
    const x = L.align === "left" ? anchorX : L.align === "right" ? anchorX - w : anchorX - w / 2;
    const y = top + i * lh + lh / 2;
    if (L.strokeWidth > 0) {
      ctx.lineJoin = "round";
      ctx.lineWidth = L.strokeWidth;
      ctx.strokeStyle = resolveColor(L.strokeColor, o.palette) || "#000";
      ctx.strokeText(line, x, y);
    }
    if (L.shadow && !L.bgColor) {
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 14 * (o.scale ?? 1);
      ctx.shadowOffsetY = 4 * (o.scale ?? 1);
    }
    ctx.fillStyle = color;
    ctx.fillText(line, x, y);
    setShadow(ctx, false, 1);
  });
  setLetterSpacing(ctx, 0);
}

function drawImageLayer(ctx: CanvasRenderingContext2D, L: ImageLayer, o: RenderOptions) {
  const img = L.src ? o.getImage(L.src) : undefined;
  if (L.shadow) {
    ctx.save();
    setShadow(ctx, true, o.scale ?? 1);
    roundRectPath(ctx, 0, 0, L.w, L.h, L.radius);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  roundRectPath(ctx, 0, 0, L.w, L.h, L.radius);
  ctx.clip();
  if (img) {
    if (L.fit === "contain") {
      ctx.fillStyle = "rgba(255,255,255,0.0)";
    }
    drawImageCover(ctx, img, 0, 0, L.w, L.h, L.focusX, L.focusY, L.zoom, L.fit === "contain");
  } else {
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 0, L.w, L.h);
    ctx.fillStyle = "#64748b";
    ctx.font = fontString("sans", 700, Math.min(L.w, L.h) * 0.12);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(L.src ? "carregando…" : "escolha uma imagem", L.w / 2, L.h / 2);
  }
  ctx.restore();
  if (L.borderWidth > 0) {
    roundRectPath(ctx, L.borderWidth / 2, L.borderWidth / 2, L.w - L.borderWidth, L.h - L.borderWidth, Math.max(0, L.radius - L.borderWidth / 2));
    ctx.lineWidth = L.borderWidth;
    ctx.strokeStyle = resolveColor(L.borderColor, o.palette);
    ctx.stroke();
  }
}

function drawShape(ctx: CanvasRenderingContext2D, L: ShapeLayer, o: RenderOptions) {
  const c1 = resolveColor(L.fill, o.palette);
  const c2 = L.fill2 ? resolveColor(L.fill2, o.palette) : "";
  ctx.save();
  setShadow(ctx, !!L.shadow, o.scale ?? 1);
  if (L.shape === "circle") {
    ctx.beginPath();
    ctx.ellipse(L.w / 2, L.h / 2, L.w / 2, L.h / 2, 0, 0, Math.PI * 2);
  } else {
    roundRectPath(ctx, 0, 0, L.w, L.h, L.radius);
  }
  ctx.fillStyle = c2 ? linearGradient(ctx, 0, 0, L.w, L.h, L.angle, c1, c2) : c1 || "transparent";
  if (c1 || c2) ctx.fill();
  setShadow(ctx, false, 1);
  if (L.strokeWidth > 0) {
    ctx.lineWidth = L.strokeWidth;
    ctx.strokeStyle = resolveColor(L.strokeColor, o.palette);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCard(ctx: CanvasRenderingContext2D, L: CardLayer, o: RenderOptions) {
  const fill = resolveColor(L.fill, o.palette);
  const text = resolveColor(L.textColor, o.palette);
  const accent = resolveColor(L.accentColor, o.palette);
  ctx.save();
  setShadow(ctx, !!L.shadow, o.scale ?? 1, 0.7);
  roundRectPath(ctx, 0, 0, L.w, L.h, L.radius);
  ctx.fillStyle = fill;
  ctx.fill();
  setShadow(ctx, false, 1);
  ctx.restore();

  const pad = Math.min(L.w, L.h) * 0.1;
  if (L.layout === "row") {
    const d = Math.min(L.h - pad * 2, L.w * 0.3);
    ctx.beginPath();
    ctx.arc(pad + d / 2, L.h / 2, d / 2, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.font = fontString("sans", 400, d * 0.52);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(L.icon, pad + d / 2, L.h / 2 + d * 0.04);
    const tx = pad * 1.6 + d;
    const tw = L.w - tx - pad;
    const titleSize = Math.max(20, Math.min(46, L.h * 0.2));
    const ft = fitText(ctx, L.title, "sans", 800, false, titleSize, tw, L.h * 0.4, 1.12, true);
    const fd = fitText(ctx, L.desc, "sans", 500, false, ft.size * 0.74, tw, L.h - pad * 2 - ft.height - 6, 1.22, true);
    const total = ft.height + 6 + fd.height;
    let y = (L.h - total) / 2;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = fontString("sans", 800, ft.size);
    ctx.fillStyle = text;
    ft.lines.forEach((ln, i) => ctx.fillText(ln, tx, y + (i + 0.5) * ft.size * 1.12));
    y += ft.height + 6;
    ctx.font = fontString("sans", 500, fd.size);
    ctx.globalAlpha = 0.82;
    fd.lines.forEach((ln, i) => ctx.fillText(ln, tx, y + (i + 0.5) * fd.size * 1.22));
    ctx.globalAlpha = 1;
  } else {
    const d = Math.min(L.w * 0.34, L.h * 0.36);
    ctx.beginPath();
    ctx.arc(L.w / 2, pad + d / 2, d / 2, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.font = fontString("sans", 400, d * 0.52);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(L.icon, L.w / 2, pad + d / 2 + d * 0.04);
    const top = pad * 1.5 + d;
    const tw = L.w - pad * 2;
    const ft = fitText(ctx, L.title, "sans", 800, false, Math.max(20, L.h * 0.12), tw, L.h * 0.26, 1.12, true);
    const fd = fitText(ctx, L.desc, "sans", 500, false, ft.size * 0.74, tw, L.h - top - pad - ft.height - 6, 1.22, true);
    ctx.fillStyle = text;
    ctx.font = fontString("sans", 800, ft.size);
    ft.lines.forEach((ln, i) => ctx.fillText(ln, L.w / 2, top + (i + 0.5) * ft.size * 1.12));
    ctx.font = fontString("sans", 500, fd.size);
    ctx.globalAlpha = 0.82;
    fd.lines.forEach((ln, i) => ctx.fillText(ln, L.w / 2, top + ft.height + 6 + (i + 0.5) * fd.size * 1.22));
    ctx.globalAlpha = 1;
  }
}

function drawStat(ctx: CanvasRenderingContext2D, L: StatLayer, o: RenderOptions) {
  ctx.save();
  setShadow(ctx, !!L.shadow, o.scale ?? 1, 0.7);
  roundRectPath(ctx, 0, 0, L.w, L.h, L.radius);
  ctx.fillStyle = resolveColor(L.fill, o.palette);
  ctx.fill();
  setShadow(ctx, false, 1);
  ctx.restore();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const v = fitText(ctx, L.value, "display", 900, false, L.h * 0.5, L.w * 0.86, L.h * 0.55, 1, true);
  ctx.font = fontString("display", 900, v.size);
  ctx.fillStyle = resolveColor(L.valueColor, o.palette);
  ctx.fillText(L.value, L.w / 2, L.h * 0.4);
  const l = fitText(ctx, L.label, "sans", 700, false, L.h * 0.19, L.w * 0.9, L.h * 0.32, 1.1, true);
  ctx.font = fontString("sans", 700, l.size);
  ctx.fillStyle = resolveColor(L.labelColor, o.palette);
  l.lines.forEach((ln, i) => ctx.fillText(ln, L.w / 2, L.h * 0.74 + (i - (l.lines.length - 1) / 2) * l.size * 1.1));
}

function drawList(ctx: CanvasRenderingContext2D, L: ListLayer, o: RenderOptions) {
  const color = resolveColor(L.color, o.palette);
  const bullet = resolveColor(L.bulletColor, o.palette);
  const items = L.items.filter((s) => s.trim());
  let size = L.size;
  let blocks: { lines: string[]; h: number }[] = [];
  for (;;) {
    ctx.font = fontString(L.font, L.weight, size);
    const indent = size * 1.5;
    blocks = items.map((it) => {
      const lines = wrapLines(ctx, it, L.w - indent);
      return { lines, h: lines.length * size * 1.22 };
    });
    const total = blocks.reduce((s, b) => s + b.h, 0) + Math.max(0, blocks.length - 1) * L.gap;
    if (total <= L.h || size <= 14) break;
    size -= 2;
  }
  const indent = size * 1.5;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  let y = 0;
  blocks.forEach((b) => {
    const cy = y + (size * 1.22) / 2;
    if (!L.bullet || L.bullet === "✔") {
      // marcador vetorial (o ✔ do sistema vira emoji cinza em alguns aparelhos)
      const r = size * 0.5;
      ctx.beginPath();
      ctx.arc(r, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = bullet;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(r * 0.5, cy + r * 0.02);
      ctx.lineTo(r * 0.88, cy + r * 0.4);
      ctx.lineTo(r * 1.52, cy - r * 0.38);
      ctx.lineWidth = Math.max(3, size * 0.11);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = resolveColor("@dark", o.palette);
      ctx.stroke();
    } else {
      ctx.font = fontString("sans", 800, size);
      ctx.fillStyle = bullet;
      ctx.fillText(L.bullet, 0, cy);
    }
    ctx.font = fontString(L.font, L.weight, size);
    ctx.fillStyle = color;
    b.lines.forEach((ln, i) => ctx.fillText(ln, indent, y + (i + 0.5) * size * 1.22));
    y += b.h + L.gap;
  });
}

function drawButton(ctx: CanvasRenderingContext2D, L: ButtonLayer, o: RenderOptions) {
  const c1 = resolveColor(L.fill, o.palette);
  const c2 = L.fill2 ? resolveColor(L.fill2, o.palette) : c1;
  ctx.save();
  setShadow(ctx, L.shadow !== false, o.scale ?? 1);
  roundRectPath(ctx, 0, 0, L.w, L.h, L.radius);
  ctx.fillStyle = linearGradient(ctx, 0, 0, L.w, L.h, 90, c1, c2);
  ctx.fill();
  setShadow(ctx, false, 1);
  ctx.restore();
  const label = `${L.icon ? `${L.icon}  ` : ""}${L.text}${L.arrow ? "  →" : ""}`;
  const fit = fitText(ctx, label, "sans", 800, false, L.size, L.w - L.h * 0.6, L.h * 0.8, 1.05, true);
  ctx.font = fontString("sans", 800, fit.size);
  ctx.fillStyle = resolveColor(L.color, o.palette);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, L.w / 2, L.h / 2 + fit.size * 0.03);
}

function drawIcon(ctx: CanvasRenderingContext2D, L: IconLayer, o: RenderOptions) {
  const s = Math.min(L.w, L.h);
  ctx.save();
  ctx.translate((L.w - s) / 2, (L.h - s) / 2);
  const solid = L.style === "solid";
  const fg = solid ? resolveColor(L.color, o.palette) : "#ffffff";
  if (!solid) {
    ctx.save();
    setShadow(ctx, !!L.shadow, o.scale ?? 1, 0.6);
    roundRectPath(ctx, 0, 0, s, s, s * (L.icon === "instagram" ? 0.28 : 0.22));
    if (L.icon === "instagram") {
      const g = ctx.createLinearGradient(0, s, s, 0);
      g.addColorStop(0, "#feda75");
      g.addColorStop(0.28, "#fa7e1e");
      g.addColorStop(0.55, "#d62976");
      g.addColorStop(0.8, "#962fbf");
      g.addColorStop(1, "#4f5bd5");
      ctx.fillStyle = g;
    } else ctx.fillStyle = "#1877f2";
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = fg;
  ctx.fillStyle = fg;
  if (L.icon === "instagram") {
    ctx.lineWidth = s * 0.075;
    roundRectPath(ctx, s * 0.2, s * 0.2, s * 0.6, s * 0.6, s * 0.17);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.68, s * 0.32, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.font = fontString("sans", 900, s * 0.78);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("f", s * 0.56, s * 0.9);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Celular (mockup do app)
// ---------------------------------------------------------------------------
interface Screen {
  x: number;
  y: number;
  w: number;
  h: number;
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function drawPhone(ctx: CanvasRenderingContext2D, L: PhoneLayer, o: RenderOptions) {
  const frame = resolveColor(L.frameColor, o.palette) || "#0b0b12";
  const screenBg = resolveColor(L.screenColor, o.palette) || "#f6f7fb";
  const accent = resolveColor(L.accentColor, o.palette) || "#3a1df4";
  const dark = resolveColor("@dark", o.palette);

  ctx.save();
  setShadow(ctx, L.shadow !== false, o.scale ?? 1, 1.2);
  roundRectPath(ctx, 0, 0, L.w, L.h, L.w * 0.14);
  ctx.fillStyle = frame;
  ctx.fill();
  setShadow(ctx, false, 1);
  ctx.restore();
  // brilho sutil na borda
  roundRectPath(ctx, 1.5, 1.5, L.w - 3, L.h - 3, L.w * 0.14);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.stroke();

  const bez = L.w * 0.034;
  const S: Screen = { x: bez, y: bez, w: L.w - bez * 2, h: L.h - bez * 2 };
  ctx.save();
  roundRectPath(ctx, S.x, S.y, S.w, S.h, L.w * 0.115);
  ctx.clip();
  ctx.fillStyle = screenBg;
  ctx.fillRect(S.x, S.y, S.w, S.h);
  ctx.translate(S.x, S.y);
  const u = S.w / 100;
  switch (L.screen) {
    case "lessons":
      screenLessons(ctx, L, S, u, accent, o);
      break;
    case "game":
      screenGame(ctx, L, S, u, accent, o);
      break;
    case "ranking":
      screenRanking(ctx, L, S, u, accent, o);
      break;
    case "video":
      screenVideo(ctx, L, S, u, accent, o);
      break;
    case "story":
      screenStory(ctx, L, S, u, accent, o);
      break;
    case "live":
      screenLive(ctx, L, S, u, accent, o);
      break;
    case "achievements":
      screenAchievements(ctx, L, S, u, accent, o, dark);
      break;
  }
  ctx.restore();
  // ilha/notch
  roundRectPath(ctx, L.w / 2 - L.w * 0.14, bez + L.w * 0.022, L.w * 0.28, L.w * 0.055, L.w * 0.03);
  ctx.fillStyle = "#05050a";
  ctx.fill();
}

function parts(item: string): [string, string] {
  const i = item.indexOf("|");
  return i < 0 ? [item, ""] : [item.slice(0, i).trim(), item.slice(i + 1).trim()];
}

function screenHeader(ctx: CanvasRenderingContext2D, S: Screen, u: number, accent: string, title: string, sub: string, o: RenderOptions, h = 30) {
  const g = ctx.createLinearGradient(0, 0, S.w, h * u);
  g.addColorStop(0, accent);
  g.addColorStop(1, resolveColor("@bg1", o.palette));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S.w, h * u);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.font = fontString("sans", 800, 7.4 * u);
  ctx.fillText(ellipsize(ctx, title, S.w - 12 * u), 6 * u, (h - 8) * u);
  if (sub) {
    ctx.globalAlpha = 0.85;
    ctx.font = fontString("sans", 600, 4.2 * u);
    ctx.fillText(ellipsize(ctx, sub, S.w - 12 * u), 6 * u, (h - 3) * u);
    ctx.globalAlpha = 1;
  }
}

function screenLessons(ctx: CanvasRenderingContext2D, L: PhoneLayer, S: Screen, u: number, accent: string, o: RenderOptions) {
  screenHeader(ctx, S, u, accent, L.title || "Lições", `${L.items.length} lições disponíveis`, o, 34);
  const rowH = 17 * u;
  L.items.slice(0, 7).forEach((item, i) => {
    const [title, cat] = parts(item);
    const y = 38 * u + i * (rowH + 3.2 * u);
    if (y + rowH > S.h - 4 * u) return;
    ctx.save();
    ctx.shadowColor = "rgba(15,23,42,0.12)";
    ctx.shadowBlur = 4 * u;
    ctx.shadowOffsetY = 1.2 * u;
    roundRectPath(ctx, 4 * u, y, S.w - 8 * u, rowH, 4 * u);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
    // círculo de número/ok
    ctx.beginPath();
    ctx.arc(12 * u, y + rowH / 2, 5 * u, 0, Math.PI * 2);
    ctx.fillStyle = i < 2 ? "#22c55e" : withAlpha(accent, 0.14);
    ctx.fill();
    ctx.fillStyle = i < 2 ? "#fff" : accent;
    ctx.font = fontString("sans", 800, 4.6 * u);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (i < 2) {
      ctx.beginPath();
      ctx.moveTo(12 * u - 2.2 * u, y + rowH / 2);
      ctx.lineTo(12 * u - 0.6 * u, y + rowH / 2 + 1.8 * u);
      ctx.lineTo(12 * u + 2.4 * u, y + rowH / 2 - 2 * u);
      ctx.lineWidth = 1.1 * u;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    } else {
      ctx.fillText(String(i + 1), 12 * u, y + rowH / 2 + 0.3 * u);
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "#0f172a";
    ctx.font = fontString("sans", 700, 4.5 * u);
    ctx.fillText(ellipsize(ctx, title, S.w - 34 * u), 20 * u, y + rowH * (cat ? 0.36 : 0.5));
    if (cat) {
      ctx.fillStyle = accent;
      ctx.font = fontString("sans", 600, 3.5 * u);
      ctx.fillText(ellipsize(ctx, cat, S.w - 34 * u), 20 * u, y + rowH * 0.7);
    }
    if (i === 2) {
      roundRectPath(ctx, 20 * u, y + rowH - 3.6 * u, S.w - 40 * u, 1.6 * u, u);
      ctx.fillStyle = "#e2e8f0";
      ctx.fill();
      roundRectPath(ctx, 20 * u, y + rowH - 3.6 * u, (S.w - 40 * u) * 0.55, 1.6 * u, u);
      ctx.fillStyle = accent;
      ctx.fill();
    }
  });
}

function screenGame(ctx: CanvasRenderingContext2D, L: PhoneLayer, S: Screen, u: number, accent: string, o: RenderOptions) {
  // topo: nível + tempo
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, S.w, 22 * u);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  ctx.font = fontString("sans", 800, 4.6 * u);
  ctx.fillText(ellipsize(ctx, L.title || "Jogo", S.w - 40 * u), 5 * u, 14 * u);
  roundRectPath(ctx, S.w - 31 * u, 9.5 * u, 26 * u, 9 * u, 4.5 * u);
  ctx.fillStyle = resolveColor("@primary", o.palette);
  ctx.fill();
  ctx.fillStyle = "#1c1917";
  ctx.font = fontString("sans", 800, 4 * u);
  ctx.textAlign = "center";
  ctx.fillText("⏱ 0:08", S.w - 18 * u, 14.3 * u);
  // barra de tempo
  roundRectPath(ctx, 5 * u, 19 * u, S.w - 10 * u, 1.6 * u, u);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fill();
  roundRectPath(ctx, 5 * u, 19 * u, (S.w - 10 * u) * 0.62, 1.6 * u, u);
  ctx.fillStyle = "#34d399";
  ctx.fill();
  // imagem
  const ix = 4 * u;
  const iy = 25 * u;
  const iw = S.w - 8 * u;
  const ih = Math.min(iw * 0.92, S.h * 0.45);
  ctx.save();
  roundRectPath(ctx, ix, iy, iw, ih, 5 * u);
  ctx.clip();
  const img = L.imageSrc ? o.getImage(L.imageSrc) : undefined;
  if (img) drawImageCover(ctx, img, ix, iy, iw, ih);
  else {
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(ix, iy, iw, ih);
  }
  ctx.restore();
  roundRectPath(ctx, ix, iy, iw, ih, 5 * u);
  ctx.lineWidth = 0.9 * u;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  // pergunta
  const qy = iy + ih + 6 * u;
  ctx.fillStyle = "#0f172a";
  ctx.font = fontString("sans", 800, 4.4 * u);
  ctx.textAlign = "center";
  ctx.fillText("Toque nas palavras certas", S.w / 2, qy);
  // opções
  const opts = L.items.slice(0, 6);
  const cols = 2;
  const cw = (S.w - 8 * u - 3 * u) / cols;
  const chH = 11.5 * u;
  opts.forEach((txt, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = 4 * u + c * (cw + 3 * u);
    const y = qy + 5 * u + r * (chH + 2.6 * u);
    if (y + chH > S.h - 12 * u) return;
    const picked = txt.startsWith("✓");
    const label = txt.replace(/^✓\s*/, "");
    ctx.save();
    ctx.shadowColor = "rgba(15,23,42,0.18)";
    ctx.shadowBlur = 3 * u;
    ctx.shadowOffsetY = 1.4 * u;
    roundRectPath(ctx, x, y, cw, chH, 5 * u);
    ctx.fillStyle = picked ? "#22c55e" : "#ffffff";
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = picked ? "#fff" : "#0f172a";
    ctx.font = fontString("sans", 800, 4.3 * u);
    ctx.textAlign = "center";
    const shown = ellipsize(ctx, label, cw - (picked ? 12 : 4) * u);
    const tw = ctx.measureText(shown).width;
    const off = picked ? 2.6 * u : 0;
    ctx.fillText(shown, x + cw / 2 + off, y + chH / 2 + 0.2 * u);
    if (picked) {
      const cx = x + cw / 2 + off - tw / 2 - 3.2 * u;
      const cy = y + chH / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 1.6 * u, cy);
      ctx.lineTo(cx - 0.4 * u, cy + 1.4 * u);
      ctx.lineTo(cx + 1.8 * u, cy - 1.5 * u);
      ctx.lineWidth = 0.9 * u;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }
  });
  // botão dica
  roundRectPath(ctx, 4 * u, S.h - 11 * u, S.w - 8 * u, 8 * u, 4 * u);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = fontString("sans", 800, 4.2 * u);
  ctx.fillText("💡 Dica   ·   Verificar", S.w / 2, S.h - 7 * u);
}

function screenRanking(ctx: CanvasRenderingContext2D, L: PhoneLayer, S: Screen, u: number, accent: string, o: RenderOptions) {
  screenHeader(ctx, S, u, accent, `🏆 ${L.title || "Ranking"}`, "Jogadores online agora", o, 34);
  const medals = ["🥇", "🥈", "🥉"];
  L.items.slice(0, 6).forEach((item, i) => {
    const [name, pts] = parts(item);
    const rowH = 14.5 * u;
    const y = 38 * u + i * (rowH + 2.8 * u);
    if (y + rowH > S.h - 4 * u) return;
    const me = i === 1;
    ctx.save();
    ctx.shadowColor = "rgba(15,23,42,0.12)";
    ctx.shadowBlur = 4 * u;
    ctx.shadowOffsetY = 1.2 * u;
    roundRectPath(ctx, 4 * u, y, S.w - 8 * u, rowH, 4 * u);
    ctx.fillStyle = me ? withAlpha(accent, 0.12) : "#fff";
    ctx.fill();
    ctx.restore();
    if (me) {
      roundRectPath(ctx, 4 * u, y, S.w - 8 * u, rowH, 4 * u);
      ctx.lineWidth = 0.9 * u;
      ctx.strokeStyle = accent;
      ctx.stroke();
    }
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = fontString("sans", 700, 6.4 * u);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(medals[i] ?? String(i + 1), 11 * u, y + rowH / 2);
    ctx.beginPath();
    ctx.arc(24 * u, y + rowH / 2, 4.6 * u, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(accent, 0.2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = fontString("sans", 800, 4.6 * u);
    ctx.fillText((name[0] ?? "?").toUpperCase(), 24 * u, y + rowH / 2 + 0.3 * u);
    ctx.textAlign = "left";
    ctx.fillStyle = "#0f172a";
    ctx.font = fontString("sans", 700, 4.4 * u);
    ctx.fillText(ellipsize(ctx, name, S.w - 58 * u), 31 * u, y + rowH / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = accent;
    ctx.font = fontString("sans", 800, 4.4 * u);
    ctx.fillText(pts, S.w - 8 * u, y + rowH / 2);
  });
}

function screenVideo(ctx: CanvasRenderingContext2D, L: PhoneLayer, S: Screen, u: number, accent: string, o: RenderOptions) {
  const vh = S.w * 0.62 + 12 * u;
  const img = L.imageSrc ? o.getImage(L.imageSrc) : undefined;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, S.w, vh);
  ctx.clip();
  if (img) drawImageCover(ctx, img, 0, 0, S.w, vh, 50, 25);
  else {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, S.w, vh);
  }
  const g = ctx.createLinearGradient(0, vh * 0.5, 0, vh);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S.w, vh);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(S.w / 2, vh / 2, 11 * u, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(S.w / 2 - 3.6 * u, vh / 2 - 5.4 * u);
  ctx.lineTo(S.w / 2 - 3.6 * u, vh / 2 + 5.4 * u);
  ctx.lineTo(S.w / 2 + 6 * u, vh / 2);
  ctx.closePath();
  ctx.fillStyle = accent;
  ctx.fill();
  // barra de progresso do vídeo
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(4 * u, vh - 5 * u, S.w - 8 * u, 1.2 * u);
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(4 * u, vh - 5 * u, (S.w - 8 * u) * 0.38, 1.2 * u);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = fontString("sans", 800, 5 * u);
  const [first, ...rest] = L.items;
  ctx.fillText(ellipsize(ctx, L.title || "Aula em vídeo", S.w - 10 * u), 5 * u, vh + 8 * u);
  ctx.fillStyle = "#64748b";
  ctx.font = fontString("sans", 600, 3.8 * u);
  ctx.fillText(ellipsize(ctx, first || "Aula gravada · assista quando quiser", S.w - 10 * u), 5 * u, vh + 14 * u);
  ctx.font = fontString("sans", 700, 4 * u);
  ctx.fillStyle = accent;
  ctx.fillText("♥ 128     💬 24     ⬇ salvar", 5 * u, vh + 21 * u);
  rest.slice(0, 3).forEach((item, i) => {
    const y = vh + 28 * u + i * 13 * u;
    if (y + 11 * u > S.h) return;
    roundRectPath(ctx, 5 * u, y, 22 * u, 11 * u, 2.5 * u);
    ctx.fillStyle = withAlpha(accent, 0.2 + i * 0.1);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.font = fontString("sans", 700, 3.9 * u);
    ctx.textAlign = "left";
    ctx.fillText(ellipsize(ctx, item, S.w - 38 * u), 31 * u, y + 5.5 * u);
  });
}

function screenStory(ctx: CanvasRenderingContext2D, L: PhoneLayer, S: Screen, u: number, accent: string, o: RenderOptions) {
  const img = L.imageSrc ? o.getImage(L.imageSrc) : undefined;
  if (img) drawImageCover(ctx, img, 0, 0, S.w, S.h);
  else {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, S.w, S.h);
  }
  const g = ctx.createLinearGradient(0, 0, 0, S.h);
  g.addColorStop(0, "rgba(0,0,0,0.35)");
  g.addColorStop(0.25, "rgba(0,0,0,0)");
  g.addColorStop(0.7, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.65)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S.w, S.h);
  // segmentos de progresso
  for (let i = 0; i < 4; i++) {
    roundRectPath(ctx, 4 * u + i * ((S.w - 8 * u) / 4), 12 * u, (S.w - 8 * u) / 4 - 1.6 * u, 1.3 * u, u);
    ctx.fillStyle = i < 2 ? "#fff" : "rgba(255,255,255,0.4)";
    ctx.fill();
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.font = fontString("sans", 800, 4.2 * u);
  ctx.fillText("✨ História animada", 5 * u, 19 * u);
  // rótulos dos elementos
  const anchors = [
    { x: 26, y: 42 },
    { x: 68, y: 36 },
    { x: 34, y: 62 },
    { x: 70, y: 58 },
  ];
  L.items.slice(0, 4).forEach((label, i) => {
    const a = anchors[i];
    ctx.font = fontString("sans", 800, 4.6 * u);
    const w = ctx.measureText(label).width + 8 * u;
    const h = 8.6 * u;
    const x = Math.min(S.w - w - 2 * u, Math.max(2 * u, a.x * u - w / 2));
    const y = (a.y * S.h) / 100 - h / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 4 * u;
    roundRectPath(ctx, x, y, w, h, h / 2);
    ctx.fillStyle = i % 2 ? resolveColor("@primary", o.palette) : "#ffffff";
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#1c1917";
    ctx.textAlign = "center";
    ctx.fillText(label, x + w / 2, y + h / 2 + 0.3 * u);
  });
  // legenda
  const sub = L.title || "";
  if (sub) {
    ctx.font = fontString("sans", 700, 4.2 * u);
    const lines = wrapLines(ctx, sub, S.w - 18 * u).slice(0, 3);
    const bh = lines.length * 5.6 * u + 6 * u;
    const by = S.h - bh - 10 * u;
    roundRectPath(ctx, 5 * u, by, S.w - 10 * u, bh, 4 * u);
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    lines.forEach((ln, i) => ctx.fillText(ln, S.w / 2, by + 3 * u + (i + 0.5) * 5.6 * u));
  }
}

function screenLive(ctx: CanvasRenderingContext2D, L: PhoneLayer, S: Screen, u: number, accent: string, o: RenderOptions) {
  const img = L.imageSrc ? o.getImage(L.imageSrc) : undefined;
  if (img) drawImageCover(ctx, img, 0, 0, S.w, S.h, 50, 30);
  else {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, S.w, S.h);
  }
  const g = ctx.createLinearGradient(0, S.h * 0.45, 0, S.h);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.78)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S.w, S.h);
  roundRectPath(ctx, 5 * u, 12 * u, 22 * u, 8 * u, 4 * u);
  ctx.fillStyle = "#ef4444";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = fontString("sans", 800, 4 * u);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("● AO VIVO", 16 * u, 16.2 * u);
  const [viewers, ...chat] = L.items;
  roundRectPath(ctx, S.w - 27 * u, 12 * u, 22 * u, 8 * u, 4 * u);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillText(viewers || "👁 24", S.w - 16 * u, 16.2 * u);
  const msgs = chat.slice(0, 4);
  msgs.forEach((m, i) => {
    const [who, text] = parts(m);
    ctx.font = fontString("sans", 700, 3.9 * u);
    const label = text ? `${who}: ${text}` : who;
    const w = Math.min(S.w - 12 * u, ctx.measureText(label).width + 8 * u);
    const h = 8 * u;
    const y = S.h - 24 * u - (msgs.length - 1 - i) * (h + 2 * u);
    roundRectPath(ctx, 5 * u, y, w, h, 4 * u);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "left";
    ctx.fillText(ellipsize(ctx, label, w - 6 * u), 8 * u, y + h / 2 + 0.2 * u);
  });
  roundRectPath(ctx, 5 * u, S.h - 13 * u, S.w - 10 * u, 8.5 * u, 4.25 * u);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 0.7 * u;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "left";
  ctx.font = fontString("sans", 600, 3.9 * u);
  ctx.fillText(L.title || "Pergunte ao professor…", 9 * u, S.h - 8.7 * u);
}

function screenAchievements(ctx: CanvasRenderingContext2D, L: PhoneLayer, S: Screen, u: number, accent: string, o: RenderOptions, dark: string) {
  const g = ctx.createLinearGradient(0, 0, 0, 52 * u);
  g.addColorStop(0, accent);
  g.addColorStop(1, dark || "#0c0540");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S.w, 54 * u);
  const [lvlEmoji, lvlName] = parts(L.title || "👑|Nível");
  ctx.beginPath();
  ctx.arc(S.w / 2, 27 * u, 13 * u, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = fontString("sans", 400, 15 * u);
  ctx.fillText(lvlEmoji || "👑", S.w / 2, 28 * u);
  ctx.font = fontString("sans", 800, 5.6 * u);
  ctx.fillText(ellipsize(ctx, lvlName, S.w - 10 * u), S.w / 2, 46 * u);
  // XP
  roundRectPath(ctx, 8 * u, 56 * u, S.w - 16 * u, 3.4 * u, 1.7 * u);
  ctx.fillStyle = "#e2e8f0";
  ctx.fill();
  roundRectPath(ctx, 8 * u, 56 * u, (S.w - 16 * u) * 0.66, 3.4 * u, 1.7 * u);
  ctx.fillStyle = resolveColor("@primary", o.palette);
  ctx.fill();
  ctx.fillStyle = "#475569";
  ctx.font = fontString("sans", 700, 3.5 * u);
  ctx.fillText("XP até o próximo nível", S.w / 2, 64 * u);
  const cols = 3;
  const cw = (S.w - 8 * u - 2 * 3 * u) / cols;
  const ch = 24 * u;
  L.items.slice(0, 9).forEach((item, i) => {
    const [emoji, name] = parts(item);
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = 4 * u + c * (cw + 3 * u);
    const y = 70 * u + r * (ch + 3 * u);
    if (y + ch > S.h - 3 * u) return;
    ctx.save();
    ctx.shadowColor = "rgba(15,23,42,0.14)";
    ctx.shadowBlur = 4 * u;
    ctx.shadowOffsetY = 1.2 * u;
    roundRectPath(ctx, x, y, cw, ch, 4 * u);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
    ctx.font = fontString("sans", 400, 10 * u);
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(emoji || "🏅", x + cw / 2, y + 9.5 * u);
    ctx.font = fontString("sans", 800, 3.4 * u);
    ctx.fillStyle = "#0f172a";
    const lines = wrapLines(ctx, name, cw - 3 * u).slice(0, 2);
    lines.forEach((ln, k) => ctx.fillText(ln, x + cw / 2, y + 17.5 * u + k * 3.8 * u));
  });
}

// ---------------------------------------------------------------------------
// Slide completo
// ---------------------------------------------------------------------------
function drawLayer(ctx: CanvasRenderingContext2D, layer: Layer, o: RenderOptions) {
  if (layer.hidden) return;
  ctx.save();
  ctx.translate(layer.x + layer.w / 2, layer.y + layer.h / 2);
  if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180);
  ctx.translate(-layer.w / 2, -layer.h / 2);
  ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
  switch (layer.kind) {
    case "text":
      drawText(ctx, layer, o);
      break;
    case "image":
      drawImageLayer(ctx, layer, o);
      break;
    case "shape":
      drawShape(ctx, layer, o);
      break;
    case "phone":
      drawPhone(ctx, layer, o);
      break;
    case "card":
      drawCard(ctx, layer, o);
      break;
    case "stat":
      drawStat(ctx, layer, o);
      break;
    case "list":
      drawList(ctx, layer, o);
      break;
    case "button":
      drawButton(ctx, layer, o);
      break;
    case "icon":
      drawIcon(ctx, layer, o);
      break;
  }
  ctx.restore();
}

/** Desenha o slide inteiro. O canvas deve ter (width × scale) por (height × scale) pixels. */
export function renderSlide(ctx: CanvasRenderingContext2D, slide: Slide, o: RenderOptions) {
  const scale = o.scale ?? 1;
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, o.width, o.height);
  drawBackground(ctx, slide.bg, o);
  for (const layer of slide.layers) drawLayer(ctx, layer, o);
  ctx.restore();
}
