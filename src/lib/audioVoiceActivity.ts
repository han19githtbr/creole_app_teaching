// Sistema de Detecção de Atividade de Voz (VAD) e Sincronização Realista da Digitação de Legendas.
//
// Garante que a legenda em português seja digitada estritamente durante os intervalos
// de fala da narração em áudio. Quando o narrador faz uma pausa (para respirar, vírgula,
// silêncio entre frases ou palavras), NADA é digitado: o cursor congela e aguarda a voz
// voltar, criando uma cadência realista e natural para o usuário não-falante de crioulo.

import { useEffect, useState } from "react";
import type { IVideoStoryCaption } from "@/models/VideoLesson";

export interface SpeechInterval {
  start: number;
  end: number;
}

export interface WordToken {
  text: string;
  charStart: number;
  charEnd: number;
  weight: number;
}

export interface AlignedWord {
  word: string;
  charStart: number;
  charEnd: number;
  start: number;
  end: number;
}

export interface CaptionSpeechPlan {
  captionIndex: number;
  bursts: SpeechInterval[];
  alignedWords: AlignedWord[];
  totalSpeechDuration: number;
}

export interface AudioVoiceData {
  url: string;
  duration: number;
  isDecoded: boolean;
  allBursts: SpeechInterval[];
  plans: Map<number, CaptionSpeechPlan>;
}

export interface CaptionTypingSnapshot {
  progress: number;
  visibleCount: number;
  visiblePt: string;
  invisiblePt: string;
  isSpeaking: boolean;
  isTyping: boolean;
  currentWord?: string;
  kreyol: string;
  portuguese: string;
}

// Cache global por URL de áudio para evitar reprocessamento desnecessário
const voiceDataCache = new Map<string, AudioVoiceData>();

/**
 * Divide o texto em português em tokens de palavras preservando pontuações e espaços.
 * Garante que a contagem de caracteres bata perfeitamente com a string original.
 */
export function splitPortugueseWords(text: string): WordToken[] {
  if (!text) return [];
  const tokens: WordToken[] = [];
  const regex = /\S+\s*/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const letters = raw.replace(/[^a-zA-ZÀ-ÿ0-9]/g, "");
    const baseWeight = Math.max(2.2, letters.length);
    const hasPunctuation = /[,;:.!?—-]/.test(raw);
    const weight = baseWeight + (hasPunctuation ? 1.6 : 0);

    tokens.push({
      text: raw,
      charStart: match.index,
      charEnd: match.index + raw.length,
      weight,
    });
  }

  return tokens;
}

/**
 * Cria um plano de fala sintético baseado na pontuação e no tempo da legenda
 * caso o arquivo de áudio ainda esteja carregando ou não possa ser decodificado via Web Audio.
 */
export function createFallbackSpeechPlan(caption: IVideoStoryCaption, captionIndex: number): CaptionSpeechPlan {
  const capDuration = Math.max(0.4, caption.end - caption.start);
  const text = caption.portuguese || "";
  const tokens = splitPortugueseWords(text);

  // Se o texto for vazio, retorna vazio
  if (tokens.length === 0) {
    return {
      captionIndex,
      bursts: [{ start: caption.start, end: caption.end }],
      alignedWords: [],
      totalSpeechDuration: capDuration,
    };
  }

  // Identifica pausas naturais por pontuação no texto
  const pausePoints: number[] = [];
  tokens.forEach((t, i) => {
    if (i < tokens.length - 1 && /[,;:.!?—-]/.test(t.text)) {
      pausePoints.push(i);
    }
  });

  const bursts: SpeechInterval[] = [];
  const leadIn = Math.min(0.18, capDuration * 0.06);
  const leadOut = Math.min(0.35, capDuration * 0.12);
  const speechBudget = Math.max(0.2, capDuration - leadIn - leadOut);

  if (pausePoints.length === 0) {
    // Fala contínua sem pausas longas de pontuação
    const burstStart = caption.start + leadIn;
    const burstEnd = caption.start + leadIn + speechBudget;
    bursts.push({ start: burstStart, end: burstEnd });
  } else {
    // Divide em blocos respeitando as pontuações e inserindo pausas reais de silêncio
    const numBlocks = pausePoints.length + 1;
    const pauseDuration = Math.min(0.45, (capDuration * 0.25) / Math.max(1, pausePoints.length));
    const totalPauseTime = pauseDuration * pausePoints.length;
    const activeTime = Math.max(0.2, speechBudget - totalPauseTime);
    const blockTime = activeTime / numBlocks;

    let curTime = caption.start + leadIn;
    for (let b = 0; b < numBlocks; b++) {
      const bStart = curTime;
      const bEnd = curTime + blockTime;
      bursts.push({ start: bStart, end: bEnd });
      curTime = bEnd + pauseDuration;
    }
  }

  const alignedWords = alignTokensToBursts(tokens, bursts);
  const totalSpeechDuration = bursts.reduce((acc, b) => acc + (b.end - b.start), 0);

  return {
    captionIndex,
    bursts,
    alignedWords,
    totalSpeechDuration,
  };
}

/**
 * Alinha os tokens de palavras aos intervalos de fala detectados no áudio.
 * Crucial: palavras não são quebradas no meio de uma pausa. A pausa do áudio
 * coincide com a transição entre palavras ou pontuações.
 */
export function alignTokensToBursts(tokens: WordToken[], bursts: SpeechInterval[]): AlignedWord[] {
  if (tokens.length === 0 || bursts.length === 0) return [];

  if (bursts.length === 1) {
    const burst = bursts[0];
    const totalW = tokens.reduce((acc, t) => acc + t.weight, 0);
    const bDuration = Math.max(0.08, burst.end - burst.start);
    let curTime = burst.start;

    return tokens.map((t) => {
      const dur = bDuration * (t.weight / totalW);
      const start = curTime;
      const end = curTime + dur;
      curTime = end;
      return { word: t.text, charStart: t.charStart, charEnd: t.charEnd, start, end };
    });
  }

  // Múltiplos blocos de fala: distribui as palavras entre eles respeitando pontuações e durações relativas
  const totalW = tokens.reduce((acc, t) => acc + t.weight, 0);
  const totalSpeech = bursts.reduce((acc, b) => acc + Math.max(0.04, b.end - b.start), 0);

  const partition: WordToken[][] = Array.from({ length: bursts.length }, () => []);
  let burstIdx = 0;
  let accumulatedWInBurst = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const remainingTokens = tokens.length - i;
    const remainingBursts = bursts.length - burstIdx;

    // Se o número de palavras restantes for igual aos blocos restantes, reserva ao menos uma por bloco
    if (remainingTokens <= remainingBursts && remainingBursts > 1) {
      if (partition[burstIdx].length > 0) {
        burstIdx++;
        accumulatedWInBurst = 0;
      }
      partition[burstIdx].push(token);
      burstIdx++;
      accumulatedWInBurst = 0;
      continue;
    }

    const currentBurst = bursts[burstIdx];
    const burstDuration = Math.max(0.04, currentBurst.end - currentBurst.start);
    const targetWForBurst = totalW * (burstDuration / totalSpeech);

    partition[burstIdx].push(token);
    accumulatedWInBurst += token.weight;

    const hasPunctuation = /[,;:.!?—-]/.test(token.text);
    const reachedTarget = accumulatedWInBurst >= targetWForBurst * 0.82;

    if (burstIdx < bursts.length - 1 && (accumulatedWInBurst >= targetWForBurst * 1.18 || (reachedTarget && hasPunctuation))) {
      burstIdx++;
      accumulatedWInBurst = 0;
    }
  }

  const aligned: AlignedWord[] = [];
  for (let b = 0; b < bursts.length; b++) {
    const burst = bursts[b];
    const bTokens = partition[b] || [];
    if (bTokens.length === 0) continue;

    const bTotalW = bTokens.reduce((acc, t) => acc + t.weight, 0);
    const bDuration = Math.max(0.08, burst.end - burst.start);
    let curTime = burst.start;

    for (const t of bTokens) {
      const dur = bDuration * (t.weight / bTotalW);
      const start = curTime;
      const end = curTime + dur;
      curTime = end;
      aligned.push({ word: t.text, charStart: t.charStart, charEnd: t.charEnd, start, end });
    }
  }

  return aligned;
}

/**
 * Analisa as amostras do áudio decodificado (Float32Array) usando janelamento RMS e limiares adaptativos
 * para extrair com alta precisão os intervalos de voz real (Speech Activity Detection).
 */
export function detectAudioSpeechIntervals(audioBuffer: AudioBuffer): SpeechInterval[] {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;

  if (length === 0 || sampleRate === 0) return [];

  // Obter amostras (converte para mono se for estéreo)
  const channel0 = audioBuffer.getChannelData(0);
  const channel1 = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

  // Janela de 20ms com passo de 10ms (100 quadros por segundo)
  const frameSamples = Math.max(64, Math.round(sampleRate * 0.02));
  const hopSamples = Math.max(32, Math.round(sampleRate * 0.01));
  const numFrames = Math.floor((length - frameSamples) / hopSamples);

  if (numFrames <= 0) {
    return [{ start: 0, end: audioBuffer.duration }];
  }

  const rmsList = new Float32Array(numFrames);
  let maxRms = 0;

  for (let f = 0; f < numFrames; f++) {
    const startSample = f * hopSamples;
    let sumSquares = 0;

    for (let i = 0; i < frameSamples; i++) {
      const idx = startSample + i;
      let val = channel0[idx] || 0;
      if (channel1) {
        val = (val + (channel1[idx] || 0)) * 0.5;
      }
      sumSquares += val * val;
    }

    const rms = Math.sqrt(sumSquares / frameSamples);
    rmsList[f] = rms;
    if (rms > maxRms) maxRms = rms;
  }

  // Se o áudio for praticamente silêncio absoluto
  if (maxRms < 0.002) {
    return [{ start: 0, end: audioBuffer.duration }];
  }

  // Encontra o piso de ruído e a média de intensidade de voz
  // Faz uma amostragem ordenada de percentis
  const sorted = Float32Array.from(rmsList).sort();
  const p15 = sorted[Math.floor(numFrames * 0.15)] || 0;
  const p75 = sorted[Math.floor(numFrames * 0.75)] || maxRms * 0.5;

  // Limiar adaptativo com histerese para evitar oscilações em microparadas
  const speechRange = Math.max(0.01, p75 - p15);
  const thresholdOn = Math.max(0.012, p15 + speechRange * 0.26);
  const thresholdOff = Math.max(0.007, p15 + speechRange * 0.14);

  const rawBursts: SpeechInterval[] = [];
  let isSpeaking = false;
  let burstStart = 0;
  let silenceFramesCount = 0;
  const hangoverFrames = 10; // ~100ms de cauda para preservar finais suaves de vogais e fricativas

  for (let f = 0; f < numFrames; f++) {
    const rms = rmsList[f];
    const frameTime = (f * hopSamples) / sampleRate;

    if (!isSpeaking) {
      if (rms >= thresholdOn) {
        isSpeaking = true;
        burstStart = Math.max(0, frameTime - 0.02);
        silenceFramesCount = 0;
      }
    } else {
      if (rms < thresholdOff) {
        silenceFramesCount++;
        if (silenceFramesCount >= hangoverFrames) {
          isSpeaking = false;
          const burstEnd = frameTime;
          if (burstEnd - burstStart >= 0.06) {
            rawBursts.push({ start: burstStart, end: burstEnd });
          }
        }
      } else {
        silenceFramesCount = 0;
      }
    }
  }

  if (isSpeaking) {
    rawBursts.push({ start: burstStart, end: audioBuffer.duration });
  }

  if (rawBursts.length === 0) {
    return [{ start: 0, end: audioBuffer.duration }];
  }

  // Mescla pausas muito curtas (< 130ms) que correspondem a oclusivas fonéticas dentro de palavras
  // Pausas maiores que 130ms são mantidas como pausas reais de fala.
  const merged: SpeechInterval[] = [rawBursts[0]];
  for (let i = 1; i < rawBursts.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = rawBursts[i];
    const gap = curr.start - prev.end;

    if (gap < 0.13) {
      prev.end = curr.end;
    } else {
      merged.push(curr);
    }
  }

  return merged;
}

/**
 * Cria os planos de alinhamento para todas as legendas a partir dos intervalos globais de fala.
 */
export function buildCaptionPlans(
  captions: IVideoStoryCaption[],
  speechIntervals: SpeechInterval[]
): Map<number, CaptionSpeechPlan> {
  const plans = new Map<number, CaptionSpeechPlan>();

  captions.forEach((caption, index) => {
    // Interseção dos intervalos com a janela desta legenda
    const relevantBursts = speechIntervals
      .filter((b) => b.end > caption.start && b.start < caption.end)
      .map((b) => ({
        start: Math.max(caption.start, b.start),
        end: Math.min(caption.end, b.end),
      }))
      .filter((b) => b.end - b.start >= 0.05);

    if (relevantBursts.length === 0) {
      // Se a análise do áudio não capturou fala neste trecho específico, usa fallback inteligente
      plans.set(index, createFallbackSpeechPlan(caption, index));
    } else {
      const tokens = splitPortugueseWords(caption.portuguese || "");
      const alignedWords = alignTokensToBursts(tokens, relevantBursts);
      const totalSpeechDuration = relevantBursts.reduce((acc, b) => acc + (b.end - b.start), 0);

      plans.set(index, {
        captionIndex: index,
        bursts: relevantBursts,
        alignedWords,
        totalSpeechDuration,
      });
    }
  });

  return plans;
}

/**
 * Baixa e decodifica a faixa de áudio no navegador em segundo plano,
 * calculando os intervalos exatos de atividade de voz e alimentando o cache.
 */
export async function loadAudioVoiceActivity(
  audioUrl: string,
  captions: IVideoStoryCaption[]
): Promise<AudioVoiceData> {
  if (!audioUrl) {
    const plans = buildCaptionPlans(captions, []);
    return { url: "", duration: 0, isDecoded: false, allBursts: [], plans };
  }

  const cached = voiceDataCache.get(audioUrl);
  if (cached && cached.isDecoded) {
    return cached;
  }

  try {
    const response = await fetch(audioUrl, { mode: "cors" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();

    const globalScope = typeof window !== "undefined"
      ? (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
      : null;
    const AudioCtx = globalScope?.AudioContext || globalScope?.webkitAudioContext;

    if (!AudioCtx) throw new Error("AudioContext not supported");

    let context: AudioContext;
    try {
      context = new AudioCtx({ sampleRate: 32000 });
    } catch {
      context = new AudioCtx();
    }

    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
        const promise = context.decodeAudioData(arrayBuffer, resolve, reject);
        if (promise && typeof promise.then === "function") {
          promise.then(resolve, reject);
        }
      });
    } finally {
      void context.close().catch(() => undefined);
    }

    const allBursts = detectAudioSpeechIntervals(audioBuffer);
    const plans = buildCaptionPlans(captions, allBursts);

    const voiceData: AudioVoiceData = {
      url: audioUrl,
      duration: audioBuffer.duration,
      isDecoded: true,
      allBursts,
      plans,
    };

    voiceDataCache.set(audioUrl, voiceData);
    return voiceData;
  } catch {
    // Em caso de erro de rede ou CORS, utiliza o plano de fallback baseado na pontuação
    const plans = buildCaptionPlans(captions, []);
    const fallbackData: AudioVoiceData = {
      url: audioUrl,
      duration: 0,
      isDecoded: false,
      allBursts: [],
      plans,
    };
    return fallbackData;
  }
}

/**
 * Calcula o estado da digitação da legenda para o instante `time` (em segundos do áudio).
 * Garante que durante pausas de áudio absolutamente nenhuma letra seja digitada.
 */
export function computeCaptionTyping(
  caption: IVideoStoryCaption,
  time: number,
  captionIndex: number,
  voiceData: AudioVoiceData | null
): CaptionTypingSnapshot {
  const ptText = caption.portuguese || "";
  const ptLength = ptText.length;

  if (ptLength === 0) {
    return {
      progress: 1,
      visibleCount: 0,
      visiblePt: "",
      invisiblePt: "",
      isSpeaking: false,
      isTyping: false,
      kreyol: caption.kreyol,
      portuguese: ptText,
    };
  }

  // Obtém o plano da legenda (do áudio decodificado ou fallback)
  let plan = voiceData?.plans.get(captionIndex);
  if (!plan) {
    plan = createFallbackSpeechPlan(caption, captionIndex);
  }

  const { bursts, alignedWords } = plan;

  // Verifica se o áudio está ativamente falando neste instante
  let isSpeaking = false;
  for (const b of bursts) {
    if (time >= b.start && time < b.end) {
      isSpeaking = true;
      break;
    }
  }

  // Verifica a posição do tempo em relação às palavras
  let visibleCount = 0;
  let isTyping = false;
  let currentWord: string | undefined;

  for (let i = 0; i < alignedWords.length; i++) {
    const w = alignedWords[i];

    if (time >= w.end) {
      // Palavra já foi dita por completo
      visibleCount = Math.max(visibleCount, w.charEnd);
    } else if (time >= w.start && time < w.end) {
      // Palavra está sendo ativamente pronunciada neste instante
      const wordProg = Math.max(0, Math.min(1, (time - w.start) / Math.max(0.01, w.end - w.start)));
      const charsInWord = Math.round(w.word.length * wordProg);
      visibleCount = Math.max(visibleCount, w.charStart + charsInWord);
      isTyping = true;
      currentWord = w.word.trim();
      break;
    } else {
      // Palavras futuras ainda não começaram
      break;
    }
  }

  // Se o tempo já passou do último bloco de fala desta legenda, mostra o texto completo
  const lastBurst = bursts[bursts.length - 1];
  if (lastBurst && time >= lastBurst.end) {
    visibleCount = ptLength;
    isSpeaking = false;
    isTyping = false;
  }

  // Se o tempo estiver antes do primeiro bloco de fala, nenhuma letra é digitada ainda
  const firstBurst = bursts[0];
  if (firstBurst && time < firstBurst.start) {
    visibleCount = 0;
    isSpeaking = false;
    isTyping = false;
  }

  visibleCount = Math.max(0, Math.min(ptLength, visibleCount));
  const progress = ptLength > 0 ? visibleCount / ptLength : 1;
  const visiblePt = ptText.slice(0, visibleCount);
  const invisiblePt = ptText.slice(visibleCount);

  return {
    progress,
    visibleCount,
    visiblePt,
    invisiblePt,
    isSpeaking,
    isTyping: isTyping && isSpeaking,
    currentWord,
    kreyol: caption.kreyol,
    portuguese: ptText,
  };
}

/**
 * Hook do React para carregar e gerenciar a atividade de voz do áudio em segundo plano.
 * Atualiza o componente assim que a análise acústica da faixa estiver concluída.
 */
export function useAudioVoiceActivity(
  audioUrl: string | undefined,
  captions: IVideoStoryCaption[]
): AudioVoiceData | null {
  const [voiceData, setVoiceData] = useState<AudioVoiceData | null>(() => {
    if (!audioUrl) return null;
    return voiceDataCache.get(audioUrl) || null;
  });

  useEffect(() => {
    if (!audioUrl) {
      setVoiceData(null);
      return;
    }

    let isMounted = true;
    loadAudioVoiceActivity(audioUrl, captions)
      .then((data) => {
        if (isMounted) {
          setVoiceData(data);
        }
      })
      .catch(() => {
        // Fallback já tratado dentro de loadAudioVoiceActivity
      });

    return () => {
      isMounted = false;
    };
  }, [audioUrl, captions]);

  return voiceData;
}

