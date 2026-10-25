/** Linha do tempo de um conto: quando cada frase é falada e quanto dura cada cena. */
import type { Tale } from "./tales";

export interface PlannedLine {
  text: string;
  start: number;
  dur: number;
}

export interface PlannedScene {
  index: number;
  start: number;
  end: number;
  dur: number;
  lines: PlannedLine[];
}

export interface TalePlan {
  tale: Tale;
  introDur: number;
  titleLine: PlannedLine;
  scenes: PlannedScene[];
  endStart: number;
  endDur: number;
  total: number;
}

/** Estimativa de fala quando o áudio ainda não carregou (≈ 14 caracteres por segundo). */
export const estimateSpeechSeconds = (text: string) => Math.max(1.4, text.length / 14);

export const CROSSFADE = 0.8;
const LEAD = 0.7;
const GAP = 0.45;
const TAIL = 1.0;
const MORAL_TAIL = 1.8;
const MIN_SCENE = 4.5;
const END_DUR = 5.2;

/** `durations` = segundos de voz por frase (do áudio já carregado); o que faltar é estimado. */
export function planTale(tale: Tale, durations?: Map<string, number>): TalePlan {
  const dur = (text: string) => durations?.get(text) ?? estimateSpeechSeconds(text);

  const titleDur = dur(tale.title);
  const introDur = Math.max(3.4, 0.7 + titleDur + 1.0);
  const titleLine: PlannedLine = { text: tale.title, start: 0.7, dur: titleDur };

  let cursor = introDur;
  const scenes = tale.scenes.map((scene, index): PlannedScene => {
    const start = cursor;
    let t = start + LEAD;
    const lines = scene.lines.map((text) => {
      const line: PlannedLine = { text, start: t, dur: dur(text) };
      t += line.dur + GAP;
      return line;
    });
    const speechEnd = t - GAP;
    const end = Math.max(start + MIN_SCENE, speechEnd + (scene.moral ? MORAL_TAIL : TAIL));
    cursor = end;
    return { index, start, end, dur: end - start, lines };
  });

  return { tale, introDur, titleLine, scenes, endStart: cursor, endDur: END_DUR, total: cursor + END_DUR };
}

/** Todas as frases, na ordem em que são faladas. */
export function allLines(plan: TalePlan): PlannedLine[] {
  return [plan.titleLine, ...plan.scenes.flatMap((scene) => scene.lines)];
}

export interface TalePart {
  t0: number;
  t1: number;
  /** Cena que abre a parte (entra sem transição suave); null na primeira parte. */
  hardCut: number | null;
}

/**
 * Divide o conto em partes de até `max` segundos, sempre no começo de uma cena
 * (Stories do Instagram e do Facebook aceitam até 60 s por parte).
 */
export function splitForStories(plan: TalePlan, max = 58): TalePart[] {
  const starts = plan.scenes.map((scene) => scene.start);
  const points = [...starts, plan.total];
  const parts: TalePart[] = [];
  let t0 = 0;
  let hardCut: number | null = null;
  for (let k = 1; k < points.length; k++) {
    if (points[k] - t0 > max && points[k - 1] > t0) {
      const end = points[k - 1];
      parts.push({ t0, t1: end, hardCut });
      t0 = end;
      hardCut = plan.scenes.findIndex((scene) => scene.start === end);
    }
  }
  parts.push({ t0, t1: plan.total, hardCut });
  return parts;
}
