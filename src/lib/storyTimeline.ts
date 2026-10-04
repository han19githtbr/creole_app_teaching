// Linha do tempo única da história.
//
// Tudo o que se move na cena (zoom/deriva da imagem, aparição e destaque dos
// elementos, legenda ativa, barra de progresso) é função apenas de duas
// coisas: o tempo atual do ÁUDIO e a duração REAL da narração. O player
// (pré-visualização) e o exportador de vídeo usam exatamente estas funções,
// então o vídeo exportado se comporta como o que foi visto no player.
import type { BankElement } from "@/lib/imageBank";
import { evenCaptionSlots } from "@/lib/storyAudio";

export interface ElementCue {
  kreyol: string;
  /** Segundo da narração em que o elemento entra em destaque. */
  start: number;
}

export interface TimelineElement extends BankElement {
  start: number;
  /** Fim do destaque: início do próximo elemento ou fim da narração. */
  end: number;
}

export type ElementPhase = "hidden" | "active" | "done";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Duração da animação de entrada de cada elemento, em segundos. */
export const ELEMENT_ENTER_SECONDS = 0.6;

/** Momentos padrão (sem marcação manual): os elementos se dividem igualmente na narração. */
export function defaultElementStarts(count: number, duration: number): number[] {
  if (count <= 0 || !(duration > 0)) return Array.from({ length: Math.max(0, count) }, () => 0);
  return evenCaptionSlots(count, duration).map((slot) => slot.start);
}

/**
 * Monta a linha do tempo dos elementos. Se a história tem marcações salvas,
 * elas valem; elemento sem marcação cai no momento padrão dele.
 */
export function buildElementTimeline(
  elements: BankElement[],
  cues: ElementCue[] | undefined,
  duration: number
): TimelineElement[] {
  const fallback = defaultElementStarts(elements.length, duration);
  const limit = duration > 0 ? duration : Number.POSITIVE_INFINITY;
  const starts = elements.map((element, index) => {
    const cue = cues?.find((item) => item.kreyol === element.kreyol);
    return clamp(cue ? cue.start : fallback[index], 0, limit);
  });
  const order = elements.map((_, index) => index).sort((a, b) => starts[a] - starts[b] || a - b);
  const ends = new Map<number, number>();
  order.forEach((elementIndex, position) => {
    const next = order[position + 1];
    ends.set(elementIndex, next === undefined ? (duration > 0 ? duration : starts[elementIndex]) : starts[next]);
  });
  // A ordem original (a do banco de imagens) é mantida para o layout não "pular".
  return elements.map((element, index) => ({
    ...element,
    start: starts[index],
    end: Math.max(starts[index], ends.get(index) ?? starts[index]),
  }));
}

export function elementPhase(element: TimelineElement, time: number): ElementPhase {
  if (time < element.start) return "hidden";
  if (time < element.end) return "active";
  return "done";
}

export interface ElementVisual {
  phase: ElementPhase;
  opacity: number;
  scale: number;
}

/** Aparência do elemento no instante `time`: entra com fade/zoom e fica em destaque durante a fala. */
export function elementVisual(element: TimelineElement, time: number): ElementVisual {
  const phase = elementPhase(element, time);
  if (phase === "hidden") return { phase, opacity: 0, scale: 0.85 };
  const enter = easeInOut(clamp((time - element.start) / ELEMENT_ENTER_SECONDS, 0, 1));
  const base = 0.85 + 0.15 * enter;
  return {
    phase,
    opacity: phase === "done" ? Math.max(0.78, enter * 0.78) : enter,
    scale: phase === "active" ? base + 0.07 * enter : base,
  };
}

export interface SceneFrame {
  /** 1 → 1,05 ao longo de TODA a narração, qualquer que seja a duração. */
  zoom: number;
  /** Deriva horizontal/vertical, em % do tamanho da cena. */
  driftX: number;
  driftY: number;
  /** 0 → 1 */
  progress: number;
}

export function sceneFrame(time: number, duration: number): SceneFrame {
  const progress = duration > 0 ? clamp(time / duration, 0, 1) : 0;
  return {
    zoom: 1 + 0.05 * easeInOut(progress),
    driftX: Math.sin(time * 0.12) * 1.2,
    driftY: Math.cos(time * 0.1) * 1,
    progress,
  };
}

export interface TimedCaption {
  start: number;
  end: number;
}

export function captionAt<T extends TimedCaption>(captions: T[], time: number): T | undefined {
  return captions.find((caption) => time >= caption.start && time < caption.end);
}
