/**
 * Camada dinâmica do vídeo da Trilha: bichos da mata, folhagem, água e avalanche.
 *
 * Roda o MESMO motor de fauna do jogo (trailFauna.ts), o MESMO desenho de água/bichos/folhagem
 * (trailFaunaDraw.ts) e o MESMO desenho da avalanche (trailAvalanche.ts), em passos fixos de 1/30 s e
 * com semente fixa (o vídeo exportado é idêntico à prévia).
 */
import { createFauna, type Fauna } from "@/lib/trailFauna";
import { drawFauna, drawWater, loadFaunaAssets, type FaunaAssets } from "@/lib/trailFaunaDraw";
import { gradeImage } from "@/lib/trailGrade";
import { renderAvalancheSvg } from "@/lib/trailAvalanche";
import { WORLD_W, WORLD_H, getTrailPositionAtFraction } from "@/lib/curiousTrailGeometry";
import { computeTrailCamera, trailAvalancheAt, trailStudentFraction, type TrailDemoPlan } from "@/lib/curiousTrailDemoVideo";

const STEP = 1 / 30;

export const TRAIL_SCENE_URL = "/trilha/mata-trilha.jpg";

export interface TrailVideoAssets {
  /** arte da mata já com o clima do nível aplicado */
  scene: CanvasImageSource;
  fauna: FaunaAssets;
}

/** Carrega a arte da mata e os recortes dos bichos/folhagem (mesmos arquivos do jogo). */
export async function loadTrailVideoAssets(weather: TrailDemoPlan["levelCfg"]["weather"]): Promise<TrailVideoAssets> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Não foi possível carregar a arte da trilha."));
    i.src = TRAIL_SCENE_URL;
  });
  const fauna = await loadFaunaAssets();
  return { scene: gradeImage(img, weather), fauna };
}

export class TrailVideoWorld {
  private fauna: Fauna;
  private t = 0;

  constructor(private plan: TrailDemoPlan, private assets: FaunaAssets) {
    this.fauna = this.fresh();
  }

  private studentAt(t: number) {
    return getTrailPositionAtFraction(trailStudentFraction(this.plan, t));
  }

  private fresh(): Fauna {
    const f = createFauna(this.plan.levelCfg.weather, 7000 + this.plan.settings.level * 31);
    f.step(0.001, this.studentAt(0));
    this.t = 0;
    return f;
  }

  /** Avança a simulação até o instante `t` (volta ao início se `t` recuar, ex.: o vídeo recomeça). */
  advanceTo(t: number) {
    if (t < this.t - 1e-6) this.fauna = this.fresh();
    while (this.t + STEP <= t) {
      this.t += STEP;
      this.fauna.step(STEP, this.studentAt(this.t));
    }
  }

  /** Água, folhagem e bichos, em unidades do mundo (o contexto já está com a câmera aplicada). */
  drawWorld(ctx: CanvasRenderingContext2D, t: number) {
    this.advanceTo(t);
    const weather = this.plan.levelCfg.weather;
    drawWater(ctx, t, weather);
    drawFauna(ctx, this.fauna, this.assets, weather, t);
  }

  /** Quadro da avalanche (SVG rasterizado no tamanho do canvas) ou null se não há avalanche agora. */
  async avalancheImage(t: number, w: number, h: number): Promise<HTMLImageElement | null> {
    const av = trailAvalancheAt(this.plan, t);
    if (!av || !av.active) return null;
    const cam = computeTrailCamera(this.plan, t, w, h);
    const vx = -cam.tx / cam.s;
    const vy = -cam.ty / cam.s;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(2)} ${vy.toFixed(2)} ${(w / cam.s).toFixed(2)} ${(h / cam.s).toFixed(2)}" width="${w}" height="${h}">${renderAvalancheSvg(av.front, t, av.danger)}</svg>`;
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await img.decode();
    return img;
  }
}
// (WORLD_W/WORLD_H são re-exportados pela geometria; mantidos aqui só para quem importa deste módulo)
export { WORLD_W, WORLD_H };
