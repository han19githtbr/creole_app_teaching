/**
 * Clima aplicado sobre imagens (a arte da mata, os recortes de folhagem e os bichos), com a MESMA
 * receita em todo lugar (jogo e vídeo): dessaturar + escurecer/clarear + tom de névoa/geada.
 */
import type { TrailWeather } from "@/lib/curiousTrailData";

interface Grade {
  desaturate: number;
  darken: number;
  lighten: number;
  tint: string;
  /** segunda camada uniforme (ex.: a escuridão da noite), aplicada igualmente na arte, nos retalhos e nos bichos */
  overlay?: string;
}

const GRADES: Record<TrailWeather, Grade | null> = {
  sunny: null,
  night: { desaturate: 0.12, darken: 0.18, lighten: 0.035, tint: "rgba(34, 48, 96, 0.12)", overlay: "rgba(16, 26, 58, 0.27)" },
  // Mantém a arte e as cores do mapa vivas; o clima aparece nos efeitos, sem cobrir o cenário.
  rain: { desaturate: 0.08, darken: 0.04, lighten: 0, tint: "rgba(35, 55, 72, 0.07)" },
  snow: { desaturate: 0.18, darken: 0, lighten: 0.025, tint: "rgba(222, 234, 255, 0.08)" },
};

type Src = CanvasImageSource & { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number };

const sizeOf = (img: Src) => ({
  w: (img as HTMLImageElement).naturalWidth || (img.width as number),
  h: (img as HTMLImageElement).naturalHeight || (img.height as number),
});

const parseRgba = (css: string): [number, number, number, number] => {
  const m = css.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])] : [0, 0, 0, 0];
};

/**
 * Devolve a imagem com o clima aplicado (ou a própria imagem, no sol).
 *
 * O ajuste é feito PIXEL A PIXEL e só nos canais de cor: o canal alfa (transparência) nunca é tocado.
 * (Misturar com operações de composição do canvas deixava um retângulo esbranquiçado ao redor dos bichos e
 * dos retalhos de folhagem, que têm fundo transparente.)
 */
export function gradeImage(img: Src, weather: TrailWeather): CanvasImageSource {
  const g = GRADES[weather];
  if (!g) return img;
  const { w, h } = sizeOf(img);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D | null;
  if (!ctx) return img;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  const [tr, tg, tb, ta] = parseRgba(g.tint);
  const [or, og, ob, oa] = g.overlay ? parseRgba(g.overlay) : [0, 0, 0, 0];
  const dark = 1 - g.darken;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue;
    let r = px[i];
    let gg = px[i + 1];
    let b = px[i + 2];
    const gray = 0.299 * r + 0.587 * gg + 0.114 * b;
    r += (gray - r) * g.desaturate;
    gg += (gray - gg) * g.desaturate;
    b += (gray - b) * g.desaturate;
    r *= dark;
    gg *= dark;
    b *= dark;
    if (g.lighten > 0) {
      r += (255 - r) * g.lighten;
      gg += (255 - gg) * g.lighten;
      b += (255 - b) * g.lighten;
    }
    px[i] = r * (1 - ta) + tr * ta;
    px[i + 1] = gg * (1 - ta) + tg * ta;
    px[i + 2] = b * (1 - ta) + tb * ta;
    if (oa > 0) {
      px[i] = px[i] * (1 - oa) + or * oa;
      px[i + 1] = px[i + 1] * (1 - oa) + og * oa;
      px[i + 2] = px[i + 2] * (1 - oa) + ob * oa;
    }
  }
  ctx.putImageData(data, 0, 0);
  return c;
}
