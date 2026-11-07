import type { CestQuoiItem } from "@/lib/cquoiContent";
import type { AppLanguage } from "@/lib/languageShared";
import frenchVariants from "@/lib/trailObjectFrenchVariants.json";

export type TrailObjectImages = Map<string, HTMLImageElement>;
const FRENCH_TRAIL_OBJECT_IDS = new Set(frenchVariants as string[]);

export function getTrailObjectImageSrc(item: CestQuoiItem, language: AppLanguage = "francais"): string {
  if (!/^[a-z0-9-]+$/.test(item.id)) return item.scene;
  if (language === "francais" && FRENCH_TRAIL_OBJECT_IDS.has(item.id)) {
    return `/ghibli/fr/trail-objects/${item.id}.svg`;
  }
  return `/ghibli/trail-objects/${item.id}.svg`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = setTimeout(() => finish(new Error(`Tempo esgotado ao carregar a imagem: ${src}`)), 15000);
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve(image);
    };
    if (!src.startsWith("/")) image.crossOrigin = "anonymous";
    image.onload = () => finish();
    image.onerror = () => finish(new Error(`Não foi possível carregar a imagem: ${src}`));
    image.src = src;
  });
}

export async function loadTrailObjectImage(item: CestQuoiItem, language: AppLanguage = "francais"): Promise<HTMLImageElement> {
  const objectSrc = getTrailObjectImageSrc(item, language);
  if (objectSrc === item.scene) return loadImage(item.scene);

  try {
    return await loadImage(objectSrc);
  } catch {
    const baseObjectSrc = `/ghibli/trail-objects/${item.id}.svg`;
    if (objectSrc !== baseObjectSrc) {
      try { return await loadImage(baseObjectSrc); } catch { /* usa a arte completa abaixo */ }
    }
    return loadImage(item.scene);
  }
}

export async function loadTrailObjectImages(items: CestQuoiItem[], language: AppLanguage = "francais"): Promise<TrailObjectImages> {
  const uniqueItems = [...new Map(items.map((item) => [item.id, item])).values()];
  const entries = await Promise.all(
    uniqueItems.map(async (item) => [item.id, await loadTrailObjectImage(item, language)] as const)
  );
  return new Map(entries);
}

/** Carrega as cenas completas para que a seta aponte ao objeto dentro do contexto original. */
export async function loadTrailSceneImages(items: CestQuoiItem[]): Promise<TrailObjectImages> {
  const uniqueItems = [...new Map(items.map((item) => [item.id, item])).values()];
  const entries = await Promise.all(
    uniqueItems.map(async (item) => [item.id, await loadImage(item.scene)] as const)
  );
  return new Map(entries);
}
