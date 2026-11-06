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
}

const GRADES: Record<TrailWeather, Grade | null> = {
  sunny: null,
  // Mantém a arte e as cores do mapa vivas; o clima aparece nos efeitos, sem cobrir o cenário.
  rain: { desaturate: 0.08, darken: 0.04, lighten: 0, tint: "rgba(35, 55, 72, 0.07)" },
  snow: { desaturate: 0.18, darken: 0, lighten: 0.025, tint: "rgba(222, 234, 255, 0.08)" },
};

type Src = CanvasImageSource & { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number };

const sizeOf = (img: Src) => ({
  w: (img as HTMLImageElement).naturalWidth || (img.width as number),
  h: (img as HTMLImageElement).naturalHeight || (img.height as number),
});

/** Devolve a imagem com o clima aplicado (ou a própria imagem, no sol). O resultado preserva a transparência. */
export function gradeImage(img: Src, weather: TrailWeather): CanvasImageSource {
  const g = GRADES[weather];
  if (!g) return img;
  const { w, h } = sizeOf(img);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return img;
  ctx.drawImage(img, 0, 0);
  // dessatura
  ctx.save();
  ctx.globalCompositeOperation = "saturation";
  ctx.globalAlpha = g.desaturate;
  ctx.fillStyle = "hsl(0, 0%, 50%)";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  // restaura a transparência original (a mistura acima pintaria também as áreas vazias)
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(img, 0, 0);
  ctx.restore();
  // brilho + névoa/geada, só onde há pixels
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  if (g.darken > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${g.darken})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (g.lighten > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${g.lighten})`;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.fillStyle = g.tint;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  return c;
}
