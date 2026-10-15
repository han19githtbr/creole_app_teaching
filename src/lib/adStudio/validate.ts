// Validação/sanitização de uma propaganda antes de gravar no banco.
import { FORMATS, type AdDesign } from "./types";

const MAX_BYTES = 4_000_000;
const MAX_SLIDES = 12;
const MAX_LAYERS = 90;
const SAFE_SRC = /^(\/[A-Za-z0-9_\-./%]+|data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+)$/;

function safeSrc(value: unknown): string {
  return typeof value === "string" && SAFE_SRC.test(value) ? value : "";
}

export function sanitizeDesign(input: unknown): { ok: true; design: AdDesign } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Peça inválida." };
  const raw = JSON.stringify(input);
  if (raw.length > MAX_BYTES) {
    return { ok: false, error: "A peça ficou pesada demais (mais de 4 MB). Remova imagens enviadas do computador e tente de novo." };
  }
  const d = JSON.parse(raw) as AdDesign;
  if (d.version !== 1 || !Array.isArray(d.slides) || d.slides.length === 0) return { ok: false, error: "Peça sem slides." };
  if (d.slides.length > MAX_SLIDES) return { ok: false, error: `No máximo ${MAX_SLIDES} slides por peça.` };
  if (!(d.format in FORMATS)) return { ok: false, error: "Formato inválido." };
  if (d.language !== "kreyol" && d.language !== "francais") return { ok: false, error: "Idioma inválido." };
  for (const slide of d.slides) {
    if (!Array.isArray(slide.layers) || slide.layers.length > MAX_LAYERS) return { ok: false, error: `No máximo ${MAX_LAYERS} camadas por slide.` };
    if (slide.bg) slide.bg.imageSrc = safeSrc(slide.bg.imageSrc);
    for (const layer of slide.layers) {
      if (layer.kind === "image") layer.src = safeSrc(layer.src);
      if (layer.kind === "phone") layer.imageSrc = safeSrc(layer.imageSrc);
    }
  }
  d.assets = Array.isArray(d.assets)
    ? d.assets.slice(0, 12).map((a) => ({ ...a, src: safeSrc(a.src) })).filter((a) => a.src)
    : undefined;
  d.caption = typeof d.caption === "string" ? d.caption.slice(0, 5000) : "";
  d.name = typeof d.name === "string" ? d.name.slice(0, 120) : "Propaganda";
  return { ok: true, design: d };
}

export function safeThumbnail(value: unknown): string {
  return typeof value === "string" && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value) && value.length < 120_000 ? value : "";
}
