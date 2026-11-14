/**
 * Sistema de áudio sincronizado para o gerador de vídeos da Trilha do Aluno Curioso.
 * Combina:
 * 1. Camadas sonoras naturais da floresta, riacho e chuva (/public/trilha/audio/);
 * 2. Efeitos sonoros sintetizados (tiques 3-2-1, whoosh, erros, acertos com chimes, bônus, subida de nível e fanfarra do cume);
 * 3. Pronúncias nativas em francês para cada objeto da trilha (via /api/trilha/pronuncia).
 */

import { type TrailDemoPlan, synthTrailDemoSfx } from "@/lib/curiousTrailDemoVideo";

const AMBIENCE_URLS = {
  forest: "/trilha/audio/forest-ambience.ogg",
  stream: "/trilha/audio/small-stream.ogg",
  rain: "/trilha/audio/light-rain.ogg",
} as const;

// Cache global de áudios de pronúncia para não rebaixar
const pronunciationAudioCache = new Map<string, AudioBuffer>();

/**
 * Carrega em paralelo as pronúncias das palavras em francês de todas as rodadas do vídeo.
 */
export async function loadTrailDemoPronunciations(
  plan: TrailDemoPlan,
  audioContext: AudioContext | OfflineAudioContext,
  signal?: AbortSignal
): Promise<Map<string, AudioBuffer>> {
  const result = new Map<string, AudioBuffer>();
  const words = Array.from(new Set(plan.rounds.map((r) => r.item.speak.trim()).filter(Boolean)));

  await Promise.all(
    words.map(async (word) => {
      if (signal?.aborted) return;
      if (pronunciationAudioCache.has(word)) {
        result.set(word, pronunciationAudioCache.get(word)!);
        return;
      }
      try {
        const response = await fetch("/api/trilha/pronuncia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: word }),
          signal,
        });
        if (!response.ok) return;
        const arrayBuf = await response.arrayBuffer();
        if (signal?.aborted) return;
        const decoded = await audioContext.decodeAudioData(arrayBuf.slice(0));
        pronunciationAudioCache.set(word, decoded);
        result.set(word, decoded);
      } catch (err) {
        if (!signal?.aborted) {
          console.warn(`[trailDemoAudio] Falha ao carregar pronúncia de "${word}":`, err);
        }
      }
    })
  );

  return result;
}

/**
 * Reprodutor de áudio sincronizado para a prévia do estúdio de vídeos da Trilha.
 */
export class TrailDemoPreviewAudioPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceBuffers: Partial<Record<keyof typeof AMBIENCE_URLS, AudioBuffer>> = {};
  private voices: Map<string, AudioBuffer> = new Map();
  private plan: TrailDemoPlan | null = null;
  private isPlaying = false;
  private isMuted = false;
  private activeSources: { stop: () => void; disconnect: () => void }[] = [];
  private startOffset = 0;
  private startedAt = 0;
  private sampleRate = 48000;
  private ambienceLoaded = false;

  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate: this.sampleRate });
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.42;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public async preloadAmbience(): Promise<void> {
    if (this.ambienceLoaded) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      await Promise.all(
        Object.entries(AMBIENCE_URLS).map(async ([key, url]) => {
          const res = await fetch(url);
          if (!res.ok) return;
          const buf = await res.arrayBuffer();
          this.ambienceBuffers[key as keyof typeof AMBIENCE_URLS] = await ctx.decodeAudioData(buf);
        })
      );
      this.ambienceLoaded = true;
    } catch (err) {
      console.warn("[TrailDemoPreviewAudioPlayer] Falha ao carregar áudios de ambiência:", err);
    }
  }

  public updateData(plan: TrailDemoPlan, voices: Map<string, AudioBuffer>) {
    this.plan = plan;
    this.voices = voices;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.42, this.ctx.currentTime, 0.05);
    }
  }

  public play(offset = 0) {
    if (!this.plan || !this.plan.settings.sound || this.isMuted) {
      this.stop();
      return;
    }

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    this.stop();

    const boundedOffset = Math.max(0, Math.min(offset, this.plan.total || 0));
    const audioStartAt = ctx.currentTime + 0.04;
    this.startOffset = boundedOffset;
    this.startedAt = audioStartAt;
    this.isPlaying = true;

    // 1. Ambiência em loop (floresta, riacho, chuva)
    const addLoop = (buffer: AudioBuffer | undefined, defaultVol: number, weatherVolFn: (weather: string) => number) => {
      if (!buffer) return;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;

      // Inicia com o volume daquele instante
      const initialWeather = this.plan?.rounds.find((r) => r.start <= boundedOffset && r.end > boundedOffset)?.levelCfg.weather ?? this.plan?.levelCfg.weather ?? "sunny";
      gain.gain.setValueAtTime(weatherVolFn(initialWeather), audioStartAt);

      // Agenta variações de volume conforme os níveis mudam
      this.plan?.rounds.forEach((round) => {
        const tChange = audioStartAt + (round.start - boundedOffset);
        if (tChange >= audioStartAt) {
          gain.gain.setTargetAtTime(weatherVolFn(round.levelCfg.weather), tChange, 0.4);
        }
      });

      source.connect(gain);
      gain.connect(this.masterGain!);

      // Inicia com offset modular
      const loopOffset = boundedOffset % buffer.duration;
      source.start(audioStartAt, loopOffset);
      this.activeSources.push(source);
    };

    addLoop(this.ambienceBuffers.forest, 0.26, (wx) => (wx === "night" ? 0.2 : 0.26));
    addLoop(this.ambienceBuffers.stream, 0.16, (wx) => (wx === "night" ? 0.14 : 0.16));
    addLoop(this.ambienceBuffers.rain, 0.2, (wx) => (wx === "rain" ? 0.22 : 0));

    // 2. Efeitos Sonoros Sintetizados (Ticks, Chimes, Fanfarra)
    try {
      const sfxPcm = synthTrailDemoSfx(this.plan, this.sampleRate);
      const sfxBuffer = ctx.createBuffer(1, sfxPcm.length, this.sampleRate);
      sfxBuffer.getChannelData(0).set(sfxPcm);

      const sfxSource = ctx.createBufferSource();
      const sfxGain = ctx.createGain();
      sfxSource.buffer = sfxBuffer;
      sfxGain.gain.value = 0.85;
      sfxSource.connect(sfxGain);
      sfxGain.connect(this.masterGain);

      sfxSource.start(audioStartAt, boundedOffset);
      this.activeSources.push(sfxSource);
    } catch (err) {
      console.warn("[TrailDemoPreviewAudioPlayer] Falha ao tocar SFX:", err);
    }

    // 3. Pronúncias em Francês ao acertar
    this.plan.rounds.forEach((round) => {
      const voiceBuffer = this.voices.get(round.item.speak.trim());
      if (!voiceBuffer) return;

      const tTrigger = audioStartAt + (round.correctAt + 0.12 - boundedOffset);
      if (tTrigger >= audioStartAt) {
        const vSource = ctx.createBufferSource();
        const vGain = ctx.createGain();
        vSource.buffer = voiceBuffer;
        vGain.gain.value = 0.95;
        vSource.connect(vGain);
        vGain.connect(this.masterGain!);
        vSource.start(tTrigger);
        this.activeSources.push(vSource);
      }
    });
  }

  public pause(currentTime?: number) {
    if (currentTime !== undefined) {
      this.startOffset = currentTime;
    } else if (this.ctx && this.isPlaying) {
      this.startOffset = (this.startOffset + (this.ctx.currentTime - this.startedAt)) % (this.plan?.total || 1);
    }
    this.stop();
  }

  public stop() {
    this.activeSources.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {}
    });
    this.activeSources = [];
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
