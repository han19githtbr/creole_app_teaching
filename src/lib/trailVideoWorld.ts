/**
 * Camada dinâmica do vídeo da Trilha: bichos da mata, folhagem, água e avalanche.
 *
 * Roda o MESMO motor de fauna do jogo (trailFauna.ts), o MESMO desenho de água/bichos/folhagem
 * (trailFaunaDraw.ts) e o MESMO desenho da avalanche (trailAvalanche.ts), em passos fixos de 1/30 s e
 * com semente fixa (o vídeo exportado é idêntico à prévia).
 */
import { createFauna, type Fauna } from "@/lib/trailFauna";
import type { TrailWeather } from "@/lib/curiousTrailData";
import { drawFauna, drawWater, drawSkyLight, drawHut, loadFaunaAssets, type FaunaAssets } from "@/lib/trailFaunaDraw";
import { gradeImage } from "@/lib/trailGrade";
import { drawAvalanche } from "@/lib/trailAvalanche";
import { WORLD_W, WORLD_H, getTrailPositionAtFraction } from "@/lib/curiousTrailGeometry";
import { computeTrailCamera, trailAvalancheAt, trailHouseCelebrate, trailLevelForTime, trailStudentFraction, type TrailDemoPlan } from "@/lib/curiousTrailDemoVideo";

const STEP = 1 / 30;

export const TRAIL_SCENE_URL = "/trilha/mata-trilha-animada.jpg";

export interface TrailVideoAssets {
  /** Uma versão da arte da mata para cada clima possível da escalada. */
  scenes: Record<TrailWeather, CanvasImageSource>;
  fauna: FaunaAssets;
}

/** Carrega a arte da mata e os recortes dos bichos/folhagem (mesmos arquivos do jogo). */
export async function loadTrailVideoAssets(): Promise<TrailVideoAssets> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Não foi possível carregar a arte da trilha."));
    i.src = TRAIL_SCENE_URL;
  });
  const fauna = await loadFaunaAssets();
  return {
    scenes: {
      sunny: gradeImage(img, "sunny"),
      night: gradeImage(img, "night"),
      rain: gradeImage(img, "rain"),
      snow: gradeImage(img, "snow"),
    },
    fauna,
  };
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
    const seed = 7000 + this.plan.levels.reduce((sum, level) => sum + level.level * 31, 0);
    const f = createFauna(this.plan.levelCfg.weather, seed);
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
    const weather = trailLevelForTime(this.plan, t).weather;
    this.fauna.setWeather(weather);
    drawWater(ctx, t, weather);
    drawHut(ctx, t, weather, trailHouseCelebrate(this.plan, t));
    drawFauna(ctx, this.fauna, this.assets, weather, t);
    drawSkyLight(ctx, t, weather);
  }

  /** Avalanche (a mesma do jogo), desenhada por cima do aluno quando ativa. O contexto já tem a câmera aplicada. */
  drawAvalancheLayer(ctx: CanvasRenderingContext2D, t: number) {
    const av = trailAvalancheAt(this.plan, t);
    if (!av || !av.active) return;
    drawAvalanche(ctx, av.front, t, av.danger);
  }

  /** Mantido por compatibilidade: a avalanche agora é desenhada direto no canvas (drawAvalancheLayer). */
  async avalancheImage(_t: number, _w: number, _h: number): Promise<HTMLImageElement | null> {
    return null;
  }
}
// (WORLD_W/WORLD_H são re-exportados pela geometria; mantidos aqui só para quem importa deste módulo)
export { WORLD_W, WORLD_H };
