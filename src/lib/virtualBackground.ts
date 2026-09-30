// Motor de "fundo virtual" (estilo Google Meet), compartilhado pelo Estúdio de
// gravação e pela Aula ao vivo (LiveKit).
//
// Como funciona: o modelo MediaPipe Selfie Segmentation separa a pessoa do
// fundo real da câmera; depois desenhamos o fundo escolhido (desfoque, tema
// animado do estúdio ou ilustração do banco de imagens) e colocamos a pessoa
// recortada por cima.

import type { SelfieSegmentation as SelfieSegmentationClass, Results } from "@mediapipe/selfie_segmentation";
import { VIDEO_BACKGROUNDS, drawThemeParticles } from "@/lib/videoThemes";
import { IMAGE_BANK, getBankImage } from "@/lib/imageBank";

/* ------------------------------------------------------------------ */
/* Catálogo de fundos                                                  */
/* ------------------------------------------------------------------ */

export type VirtualBgKind = "none" | "blur" | "blur_light" | "theme" | "image";

export interface ParsedVirtualBg {
  kind: VirtualBgKind;
  /** id do tema (kind=theme) ou da imagem do banco (kind=image) */
  ref?: string;
}

/** Ids: "none" | "blur" | "blur_light" | "theme:<id>" | "image:<id>" */
export function parseVirtualBg(id: string | null | undefined): ParsedVirtualBg {
  if (!id || id === "none") return { kind: "none" };
  if (id === "blur") return { kind: "blur" };
  if (id === "blur_light") return { kind: "blur_light" };
  if (id.startsWith("theme:")) return { kind: "theme", ref: id.slice(6) };
  if (id.startsWith("image:")) return { kind: "image", ref: id.slice(6) };
  return { kind: "none" };
}

export const VIRTUAL_BG_STORAGE_KEY = "kreyol:virtual-bg";

/* ------------------------------------------------------------------ */
/* Segmentação da pessoa                                               */
/* ------------------------------------------------------------------ */

type MaskImage = HTMLCanvasElement | HTMLImageElement | ImageBitmap;

export class PersonSegmenter {
  private seg: SelfieSegmentationClass | null = null;
  private busy = false;
  private closed = false;
  mask: MaskImage | null = null;
  ready = false;

  async init() {
    // O pacote do MediaPipe só define window.SelfieSegmentation como efeito
    // colateral (não tem export ES de verdade) — por isso o import dinâmico.
    await import("@mediapipe/selfie_segmentation");
    if (this.closed) return;
    const Ctor = (
      window as typeof window & {
        SelfieSegmentation?: new (config?: {
          locateFile?: (file: string, prefix?: string) => string;
        }) => SelfieSegmentationClass;
      }
    ).SelfieSegmentation;
    if (!Ctor) throw new Error("SelfieSegmentation não carregou.");

    const seg = new Ctor({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
    // selfieMode=false: a máscara sai alinhada com a imagem ORIGINAL da câmera
    // (com selfieMode=true ela viria espelhada e o recorte ficaria trocado).
    seg.setOptions({ modelSelection: 1, selfieMode: false });
    seg.onResults((res: Results) => {
      this.mask = res.segmentationMask as MaskImage;
      this.ready = true;
    });
    this.seg = seg;
  }

  /** Envia um quadro para o modelo (ignora se o anterior ainda está processando). */
  async update(video: HTMLVideoElement) {
    if (!this.seg || this.busy || this.closed || video.readyState < 2) return;
    this.busy = true;
    try {
      await this.seg.send({ image: video });
    } catch {
      // Falhas transitórias enquanto o grafo do modelo inicializa.
    } finally {
      this.busy = false;
    }
  }

  close() {
    this.closed = true;
    this.mask = null;
    this.ready = false;
    const s = this.seg;
    this.seg = null;
    s?.close().catch(() => {});
  }
}

/* ------------------------------------------------------------------ */
/* Renderização                                                        */
/* ------------------------------------------------------------------ */

const imageCache = new Map<string, HTMLImageElement>();

/** Carrega (uma vez) a ilustração do banco usada como fundo. */
export function loadBankImage(id: string): HTMLImageElement | null {
  const bank = getBankImage(id);
  if (!bank || typeof window === "undefined") return null;
  let img = imageCache.get(bank.src);
  if (!img) {
    img = new Image();
    img.decoding = "async";
    img.src = bank.src;
    imageCache.set(bank.src, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

export function preloadBankImages() {
  IMAGE_BANK.forEach((i) => loadBankImage(i.id));
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  zoom = 1,
  panX = 0,
  panY = 0
) {
  const scale = Math.max(dw / sw, dh / sh) * zoom;
  const w = sw * scale;
  const h = sh * scale;
  const x = dx + (dw - w) / 2 + panX;
  const y = dy + (dh - h) / 2 + panY;
  ctx.drawImage(src, x, y, w, h);
}

export interface VirtualBgScratch {
  person: HTMLCanvasElement;
  small: HTMLCanvasElement;
}

export function createScratch(): VirtualBgScratch {
  return { person: document.createElement("canvas"), small: document.createElement("canvas") };
}

function videoSize(video: HTMLVideoElement, w: number, h: number) {
  return { vw: video.videoWidth || w, vh: video.videoHeight || h };
}

/** Desfoque barato e compatível com Safari: reduz e amplia com suavização. */
function drawBlurredVideo(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  scratch: VirtualBgScratch,
  w: number,
  h: number,
  strength: number
) {
  const { vw, vh } = videoSize(video, w, h);
  const f = strength; // 1/f do tamanho
  const sw = Math.max(16, Math.round(w / f));
  const sh = Math.max(16, Math.round(h / f));
  const small = scratch.small;
  if (small.width !== sw || small.height !== sh) {
    small.width = sw;
    small.height = sh;
  }
  const sctx = small.getContext("2d");
  if (!sctx) return;
  sctx.imageSmoothingEnabled = true;
  sctx.clearRect(0, 0, sw, sh);
  drawCover(sctx, video, vw, vh, 0, 0, sw, sh);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(small, 0, 0, w, h);
}

/**
 * Desenha só a camada de fundo (sem a pessoa). `video` é usado apenas pelos
 * desfoques; temas e ilustrações não dependem da câmera.
 */
export function drawBackgroundLayer(
  ctx: CanvasRenderingContext2D,
  bg: ParsedVirtualBg,
  video: HTMLVideoElement | null,
  scratch: VirtualBgScratch,
  w: number,
  h: number,
  now: number
) {
  if ((bg.kind === "blur" || bg.kind === "blur_light") && video) {
    drawBlurredVideo(ctx, video, scratch, w, h, bg.kind === "blur" ? 16 : 7);
  } else if (bg.kind === "image") {
    const img = loadBankImage(bg.ref || "");
    if (img) {
      // Movimento suave de "câmera" (zoom + pan lento) por cima da ilustração.
      const t = now / 1000;
      const zoom = 1.06 + Math.sin(t / 5) * 0.025;
      drawCover(ctx, img, img.naturalWidth || 1200, img.naturalHeight || 800, 0, 0, w, h, zoom, Math.sin(t / 7) * w * 0.012, Math.cos(t / 9) * h * 0.01);
      // Brilhos flutuantes para dar vida (mesmo motor de partículas dos temas).
      drawThemeParticles(ctx, w, h, now, { kind: "fireflies", count: 22, colors: ["#fff6c2", "#ffe9a8", "#ffffff"] });
    } else {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, w, h);
    }
  } else {
    // "theme" — e também o padrão para none/blur quando não há câmera (mascotes).
    const themeId = bg.kind === "theme" ? bg.ref || "" : "haiti_flag";
    const theme = VIDEO_BACKGROUNDS[themeId] || VIDEO_BACKGROUNDS.haiti_flag;
    theme.canvasBg(ctx, w, h, now);
    drawThemeParticles(ctx, w, h, now, theme.particles);
  }
}

/**
 * Desenha o quadro completo (fundo virtual + pessoa recortada) em `ctx`.
 * `mask` pode ser nulo enquanto o modelo ainda carrega: nesse caso mostramos
 * a câmera crua (sem trocar o fundo) em vez de esconder a imagem.
 */
export function drawVirtualBackground(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  mask: MaskImage | null,
  bgId: string,
  scratch: VirtualBgScratch,
  w: number,
  h: number,
  now: number
) {
  const bg = parseVirtualBg(bgId);
  const { vw, vh } = videoSize(video, w, h);

  if (bg.kind === "none" || !mask) {
    ctx.clearRect(0, 0, w, h);
    drawCover(ctx, video, vw, vh, 0, 0, w, h);
    return;
  }

  // 1. Fundo
  ctx.clearRect(0, 0, w, h);
  drawBackgroundLayer(ctx, bg, video, scratch, w, h, now);

  // 2. Pessoa recortada pela máscara
  const pc = scratch.person;
  if (pc.width !== w || pc.height !== h) {
    pc.width = w;
    pc.height = h;
  }
  const pctx = pc.getContext("2d");
  if (!pctx) return;
  pctx.save();
  pctx.clearRect(0, 0, w, h);
  pctx.globalCompositeOperation = "source-over";
  // Leve suavização da borda da máscara (onde o navegador suporta ctx.filter).
  const supportsFilter = "filter" in pctx;
  if (supportsFilter) pctx.filter = "blur(2px)";
  drawCover(pctx, mask as CanvasImageSource, mask.width || vw, mask.height || vh, 0, 0, w, h);
  if (supportsFilter) pctx.filter = "none";
  pctx.globalCompositeOperation = "source-in";
  drawCover(pctx, video, vw, vh, 0, 0, w, h);
  pctx.restore();

  ctx.drawImage(pc, 0, 0, w, h);
}
