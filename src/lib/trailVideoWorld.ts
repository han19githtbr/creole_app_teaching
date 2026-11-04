/**
 * Camada dinâmica do vídeo da Trilha: bichos da mata + avalanche.
 *
 * Roda o MESMO motor de fauna do jogo (trailWildlife.ts) e o MESMO desenho da avalanche
 * (trailAvalanche.ts), em passos fixos de 1/30 s e com semente fixa (o vídeo exportado é idêntico
 * à prévia). O resultado de cada quadro é um SVG do trecho visível do mundo, rasterizado em imagem
 * no tamanho do canvas, para o renderizador do vídeo apenas desenhar por cima da arte.
 */
import { createWildlife, type Wildlife } from "@/lib/trailWildlife";
import { renderAvalancheSvg } from "@/lib/trailAvalanche";
import { WORLD_W, WORLD_H, getTrailPositionAtFraction } from "@/lib/curiousTrailGeometry";
import {
  computeTrailCamera,
  trailAvalancheAt,
  trailStudentFraction,
  type TrailDemoPlan,
} from "@/lib/curiousTrailDemoVideo";

const STEP = 1 / 30;

export const TRAIL_SCENE_URL = "/trilha/mata-trilha.jpg";

/** Carrega a arte da mata (mesma imagem do jogo). */
export function loadTrailScene(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a arte da trilha."));
    img.src = TRAIL_SCENE_URL;
  });
}

export class TrailVideoWorld {
  private wild: Wildlife;
  private t = 0;

  constructor(private plan: TrailDemoPlan) {
    this.wild = this.fresh();
  }

  private studentAt(t: number) {
    const p = getTrailPositionAtFraction(trailStudentFraction(this.plan, t));
    return { x: p.x / WORLD_W, y: p.y / WORLD_H };
  }

  private fresh(): Wildlife {
    const w = createWildlife(this.plan.levelCfg.weather, 7000 + this.plan.settings.level * 31);
    w.step(0.001, WORLD_W, WORLD_H, this.studentAt(0));
    this.t = 0;
    return w;
  }

  /** Avança a simulação até o instante `t` (volta ao início se `t` recuar, ex.: o vídeo recomeça). */
  advanceTo(t: number) {
    if (t < this.t - 1e-6) this.wild = this.fresh();
    while (this.t + STEP <= t) {
      this.t += STEP;
      this.wild.step(STEP, WORLD_W, WORLD_H, this.studentAt(this.t));
    }
  }

  /** SVG (no tamanho do canvas) com bichos e avalanche do trecho visível no instante `t`. */
  frameSvg(t: number, w: number, h: number): string {
    this.advanceTo(t);
    const cam = computeTrailCamera(this.plan, t, w, h);
    const vx = -cam.tx / cam.s;
    const vy = -cam.ty / cam.s;
    const vw = w / cam.s;
    const vh = h / cam.s;
    let inner = this.wild.render(WORLD_W, WORLD_H);
    const av = trailAvalancheAt(this.plan, t);
    if (av && av.active) inner += renderAvalancheSvg(av.front, t, av.danger);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(2)} ${vy.toFixed(2)} ${vw.toFixed(2)} ${vh.toFixed(2)}" width="${w}" height="${h}">${inner}</svg>`;
  }

  /** Rasteriza o quadro (assíncrono: espera a imagem decodificar). */
  async frameImage(t: number, w: number, h: number): Promise<HTMLImageElement> {
    const svg = this.frameSvg(t, w, h);
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await img.decode();
    return img;
  }
}
