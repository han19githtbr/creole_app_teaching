/**
 * Mapa espacial das cenas: diz, para cada célula de 25 px da imagem 1200x800, se ali há céu, fundo distante,
 * água, chão livre ou um objeto desenhado. É a base do "diretor de cena": cada elemento animado só é colocado
 * onde ele pertence (peixe na água, tambor no chão, avião no céu) e nunca por cima dos objetos da lição.
 *
 * - Imagens do banco: dados exatos em `storySceneMap.json` (gerado por `scripts/ghibli/scene-map/build-scene-map.mjs`).
 * - Imagens geradas por IA (raster): grade aproximada a partir da análise de pixels (`gridFromZones`).
 */
import sceneMapData from "./storySceneMap.json";

export const GRID_W = 48;
export const GRID_H = 32;
export const CELL = 25;

/** 0 céu · 1 fundo distante (montanhas) · 2 água · 3 chão livre · 4 objeto desenhado */
export const SKY = 0, FAR = 1, WATER = 2, GROUND = 3, SOLID = 4;
export type CellKind = typeof SKY | typeof FAR | typeof WATER | typeof GROUND | typeof SOLID;

export interface Rect { x0: number; y0: number; x1: number; y1: number }

export interface SceneGrid {
  indoor: boolean;
  /** céu noturno */
  night?: boolean;
  /** topo do chão/da água em px (1200x800) */
  groundTop: number;
  cells: Uint8Array;
  /** "map" = dados exatos do banco · "pixels" = estimativa para imagens raster */
  source: "map" | "pixels";
}

const CODE: Record<string, CellKind> = { S: SKY, B: FAR, W: WATER, G: GROUND, O: SOLID };

function decodeRow(row: string): number[] {
  const out: number[] = [];
  const re = /([SBWGO])(\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(row))) {
    const n = m[2] ? parseInt(m[2], 10) : 1;
    for (let i = 0; i < n; i++) out.push(CODE[m[1]]);
  }
  while (out.length < GRID_W) out.push(SOLID);
  return out.slice(0, GRID_W);
}

const cache = new Map<string, SceneGrid | null>();

/** id do banco ("natureza-06") a partir de um caminho/URL ("/ghibli/natureza-06.svg") */
export function sceneIdFromSrc(src: string): string {
  return (src.split("?")[0].split("/").pop() ?? "").replace(/\.(svg|png|webp|jpe?g)$/i, "");
}

export function getSceneGrid(srcOrId: string): SceneGrid | null {
  const id = sceneIdFromSrc(srcOrId);
  if (cache.has(id)) return cache.get(id) ?? null;
  const entry = (sceneMapData as unknown as Record<string, { i: number; n?: number; gt: number; rows: string[] }>)[id];
  let grid: SceneGrid | null = null;
  if (entry && entry.rows?.length === GRID_H) {
    const cells = new Uint8Array(GRID_W * GRID_H);
    entry.rows.forEach((row, y) => decodeRow(row).forEach((v, x) => { cells[y * GRID_W + x] = v; }));
    grid = { indoor: entry.i === 1, night: entry.n === 1, groundTop: entry.gt, cells, source: "map" };
  }
  cache.set(id, grid);
  return grid;
}

/**
 * Grade aproximada para imagens que não estão no banco (geradas por IA): céu acima do horizonte, água na faixa
 * detectada, chão abaixo. Objetos não são conhecidos, então só entra o que cabe com folga (ver `busy`).
 */
export function gridFromZones(zones: { water: { y0: number; y1: number } | null; groundTop: number } | null, busy?: Uint8Array | null): SceneGrid {
  const cells = new Uint8Array(GRID_W * GRID_H);
  const gt = zones?.groundTop ?? 560;
  const w = zones?.water ?? null;
  for (let gy = 0; gy < GRID_H; gy++) {
    const y = gy * CELL + CELL / 2;
    for (let gx = 0; gx < GRID_W; gx++) {
      let k: CellKind = SKY;
      if (w && y >= w.y0 && y <= w.y1) k = WATER;
      else if (y >= (w ? w.y1 : gt)) k = GROUND;
      if (busy && busy[gy * GRID_W + gx] && k !== SKY) k = SOLID;
      cells[gy * GRID_W + gx] = k;
    }
  }
  return { indoor: false, groundTop: w ? w.y1 : gt, cells, source: "pixels" };
}

export const cellAt = (g: SceneGrid, x: number, y: number): number => {
  const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
  if (gx < 0 || gy < 0 || gx >= GRID_W || gy >= GRID_H) return SOLID;
  return g.cells[gy * GRID_W + gx];
};

/** todas as células do retângulo (com folga `pad`, em px) são de um dos tipos permitidos? */
export function rectIs(g: SceneGrid, r: Rect, kinds: number[], pad = 0): boolean {
  const x0 = Math.floor((r.x0 - pad) / CELL), x1 = Math.floor((r.x1 + pad - 0.01) / CELL);
  const y0 = Math.floor((r.y0 - pad) / CELL), y1 = Math.floor((r.y1 + pad - 0.01) / CELL);
  for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) {
    if (gx < 0 || gy < 0 || gx >= GRID_W || gy >= GRID_H) return false;
    if (!kinds.includes(g.cells[gy * GRID_W + gx])) return false;
  }
  return true;
}

/** fração do retângulo coberta pelos tipos dados */
export function rectShare(g: SceneGrid, r: Rect, kinds: number[]): number {
  const x0 = Math.max(0, Math.floor(r.x0 / CELL)), x1 = Math.min(GRID_W - 1, Math.floor((r.x1 - 0.01) / CELL));
  const y0 = Math.max(0, Math.floor(r.y0 / CELL)), y1 = Math.min(GRID_H - 1, Math.floor((r.y1 - 0.01) / CELL));
  let n = 0, hit = 0;
  for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) { n++; if (kinds.includes(g.cells[gy * GRID_W + gx])) hit++; }
  return n ? hit / n : 0;
}

export const overlaps = (a: Rect, b: Rect, pad = 0): boolean =>
  a.x0 - pad < b.x1 && a.x1 + pad > b.x0 && a.y0 - pad < b.y1 && a.y1 + pad > b.y0;
