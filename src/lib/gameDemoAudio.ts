/**
 * Gerenciamento de áudio com pronúncia em francês e efeitos sonoros para os vídeos demonstrativos.
 * Carrega a pronúncia de cada palavra via API e decodifica em buffers PCM (Float32Array)
 * a 48000 Hz, prontos para mixagem no WebCodecs (MP4 offline) e no MediaRecorder (tempo real).
 */
import type { DemoPlan, DemoRound } from "@/lib/gameDemoVideo";
import { synthDemoAudio } from "@/lib/gameDemoVideo";

// Cache de buffers decodificados por texto para não baixar nem decodificar duas vezes
const pcmCache = new Map<string, Float32Array>();

/**
 * Baixa e decodifica o áudio de pronúncia de um texto em francês na taxa de amostragem especificada.
 */
export async function loadWordPronunciationPcm(
  text: string,
  sampleRate = 48000,
  signal?: AbortSignal
): Promise<Float32Array | null> {
  const clean = text.trim();
  if (!clean) return null;

  const key = `${clean.toLowerCase()}@${sampleRate}`;
  if (pcmCache.has(key)) {
    return pcmCache.get(key)!;
  }

  try {
    const res = await fetch(`/api/cquoi/pronounce?text=${encodeURIComponent(clean)}`, {
      signal,
    });
    if (!res.ok) {
      console.warn(`[gameDemoAudio] Não foi possível carregar áudio para "${clean}": status ${res.status}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    if (signal?.aborted) return null;

    // Decodifica usando AudioContext ou OfflineAudioContext
    const AudioCtx =
      typeof window !== "undefined"
        ? window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        : null;

    if (!AudioCtx) return null;

    const ctx = new AudioCtx({ sampleRate });
    try {
      // slice(0) para não transferir o buffer original
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const rawData = audioBuffer.getChannelData(0);

      // Se a taxa do buffer coincidir com a desejada, usa direto
      if (audioBuffer.sampleRate === sampleRate) {
        const copy = new Float32Array(rawData);
        pcmCache.set(key, copy);
        return copy;
      }

      // Reamostragem linear de alta qualidade para coincidir com a taxa alvo
      const ratio = audioBuffer.sampleRate / sampleRate;
      const targetLength = Math.round(rawData.length / ratio);
      const resampled = new Float32Array(targetLength);

      for (let i = 0; i < targetLength; i++) {
        const sourceIndex = i * ratio;
        const i0 = Math.floor(sourceIndex);
        const i1 = Math.min(i0 + 1, rawData.length - 1);
        const frac = sourceIndex - i0;
        resampled[i] = rawData[i0] * (1 - frac) + rawData[i1] * frac;
      }

      pcmCache.set(key, resampled);
      return resampled;
    } finally {
      void ctx.close();
    }
  } catch (err) {
    if (signal?.aborted) return null;
    console.warn(`[gameDemoAudio] Falha ao sintetizar/decodificar áudio para "${clean}":`, err);
    return null;
  }
}

/**
 * Carrega em paralelo a pronúncia de todas as rodadas selecionadas para o vídeo.
 */
export async function loadDemoPronunciations(
  rounds: DemoRound[],
  sampleRate = 48000,
  signal?: AbortSignal
): Promise<Map<string, Float32Array>> {
  const map = new Map<string, Float32Array>();
  const wordsToLoad = Array.from(
    new Set(rounds.map((r) => r.item.speak || r.item.fr).filter(Boolean))
  );

  await Promise.all(
    wordsToLoad.map(async (word) => {
      if (signal?.aborted) return;
      const pcm = await loadWordPronunciationPcm(word, sampleRate, signal);
      if (pcm) {
        map.set(word, pcm);
        // Também associa pela grafia de texto
        const round = rounds.find((r) => (r.item.speak || r.item.fr) === word);
        if (round?.item.fr) map.set(round.item.fr, pcm);
      }
    })
  );

  return map;
}

/**
 * Reprodutor de áudio sincronizado para a pré-visualização ao vivo no estúdio.
 * Conecta com o AudioContext do navegador para tocar com latência zero e sincronia perfeita.
 */
export class DemoPreviewAudioPlayer {
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private currentPlan: DemoPlan | null = null;
  private pronunciations: Map<string, Float32Array> = new Map();
  private sampleRate = 48000;
  private isPlaying = false;
  private startOffset = 0;
  private startTime = 0;

  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate: this.sampleRate });
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public updateData(plan: DemoPlan, pronunciations: Map<string, Float32Array>) {
    this.currentPlan = plan;
    this.pronunciations = pronunciations;
  }

  public play(offset = 0) {
    if (!this.currentPlan || !this.currentPlan.settings.sound) {
      this.stop();
      return;
    }

    const ctx = this.initContext();
    if (!ctx) return;

    this.stop();

    try {
      const pcm = synthDemoAudio(this.currentPlan, this.sampleRate, this.pronunciations);
      const buffer = ctx.createBuffer(2, pcm[0].length, this.sampleRate);
      buffer.copyToChannel(new Float32Array(pcm[0]), 0);
      buffer.copyToChannel(new Float32Array(pcm[1]), 1);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const boundedOffset = Math.max(0, Math.min(offset, this.currentPlan.total || 0));
      source.start(0, boundedOffset);

      this.source = source;
      this.isPlaying = true;
      this.startOffset = boundedOffset;
      this.startTime = ctx.currentTime;
    } catch (err) {
      console.warn("[DemoPreviewAudioPlayer] Erro ao tocar áudio sincronizado:", err);
    }
  }

  public pause(currentTime?: number) {
    if (currentTime !== undefined) {
      this.startOffset = currentTime;
    } else if (this.ctx && this.isPlaying) {
      this.startOffset = (this.startOffset + (this.ctx.currentTime - this.startTime)) % (this.currentPlan?.total || 1);
    }
    this.stop();
  }

  public stop() {
    if (this.source) {
      try {
        this.source.stop();
        this.source.disconnect();
      } catch {}
      this.source = null;
    }
    this.isPlaying = false;
  }

  public seek(offset: number) {
    this.startOffset = offset;
    if (this.isPlaying) {
      this.play(offset);
    }
  }

  public destroy() {
    this.stop();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
