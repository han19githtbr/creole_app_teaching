import type { CestQuoiItem } from "@/lib/cquoiContent";

export type TrailObjectImages = Map<string, HTMLImageElement>;

export function getTrailObjectImageSrc(item: CestQuoiItem): string {
  return /^[a-z0-9-]+$/.test(item.id) ? `/ghibli/trail-objects/${item.id}.svg` : item.scene;
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

export async function loadTrailObjectImage(item: CestQuoiItem): Promise<HTMLImageElement> {
  const objectSrc = getTrailObjectImageSrc(item);
  if (objectSrc === item.scene) return loadImage(item.scene);

  try {
    return await loadImage(objectSrc);
  } catch {
    return loadImage(item.scene);
  }
}

export async function loadTrailObjectImages(items: CestQuoiItem[]): Promise<TrailObjectImages> {
  const uniqueItems = [...new Map(items.map((item) => [item.id, item])).values()];
  const entries = await Promise.all(
    uniqueItems.map(async (item) => [item.id, await loadTrailObjectImage(item)] as const)
  );
  return new Map(entries);
}
