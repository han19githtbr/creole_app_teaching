import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Motor "SVG": o modelo de TEXTO escreve a cena em SVG (mesmo formato dos arquivos atuais do app).
// O SVG recebido é sempre sanitizado: ele é servido na mesma origem do app, então não pode conter scripts.

export function extractSvg(text: string): string | null {
  const match = text.match(/<svg[\s\S]*<\/svg>/i);
  return match ? match[0] : null;
}

export function sanitizeSvg(input: string, width: number, height: number): string {
  let svg = input
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<(image|iframe|embed|object|audio|video|animate|animateTransform|animateMotion|set|text|tspan)\b[^>]*?(\/>|>[\s\S]*?<\/\1>)/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(?:xlink:)?href\s*=\s*(?:"(?!#)[^"]*"|'(?!#)[^']*')/gi, "")
    .replace(/@import[^;]*;?/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/url\(\s*['"]?\s*(?!#)[^)]*\)/gi, "none");

  svg = svg.replace(/^\s*<svg[^>]*>/i, "");
  svg = svg.replace(/<\/svg>\s*$/i, "");

  const shapes = (svg.match(/<(path|rect|circle|ellipse|polygon|polyline|line)\b/gi) ?? []).length;
  if (shapes < 15) throw new Error("O SVG veio simples demais (poucos elementos).");

  const clean = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${svg}</svg>`;
  if (clean.length > 150_000) throw new Error("O SVG ficou grande demais.");
  return clean;
}

const referenceCache = new Map<string, string>();

/**
 * Referências VISUAIS: ilustrações que o app já usa, convertidas em PNG para acompanhar o prompt de imagem.
 * Lê de public/ quando o arquivo ainda existe (desenvolvimento / antes da migração) e, senão, do bucket.
 */
export async function loadReferenceImages(
  paths: string[],
  limit = 2
): Promise<{ buffer: Buffer; mime: string }[]> {
  const base = (process.env.ASSETS_BASE_URL ?? "").replace(/\/+$/, "");
  const result: { buffer: Buffer; mime: string }[] = [];
  for (const assetPath of paths) {
    if (result.length >= limit) break;
    try {
      let raw: Buffer | null = null;
      try {
        raw = await fs.readFile(path.join(process.cwd(), "public", assetPath));
      } catch {
        if (base) {
          const response = await fetch(`${base}${assetPath}`, { signal: AbortSignal.timeout(15_000) });
          if (response.ok) raw = Buffer.from(await response.arrayBuffer());
        }
      }
      if (!raw) continue;
      const buffer = await sharp(raw, { density: 96 }).resize({ width: 768, withoutEnlargement: false }).png().toBuffer();
      result.push({ buffer, mime: "image/png" });
    } catch {
      /* referência indisponível: segue sem ela */
    }
  }
  return result;
}

/** Baixa um SVG existente do bucket para servir de referência de estilo ao modelo. */
export async function fetchReferenceSvg(path: string | undefined): Promise<string | null> {
  const base = (process.env.ASSETS_BASE_URL ?? "").replace(/\/+$/, "");
  if (!base || !path) return null;
  if (referenceCache.has(path)) return referenceCache.get(path) ?? null;
  try {
    const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) return null;
    const text = await response.text();
    if (text.length > 24_000) return null;
    referenceCache.set(path, text);
    return text;
  } catch {
    return null;
  }
}
