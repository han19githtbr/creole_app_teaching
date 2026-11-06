import type { TrailWeather } from "@/lib/curiousTrailData";
import { soundEffects } from "@/lib/soundEffects";

const TRACKS = {
  forest: "/trilha/audio/forest-ambience.ogg",
  stream: "/trilha/audio/small-stream.ogg",
  rain: "/trilha/audio/light-rain.ogg",
} as const;

/** Sons de campo gravados, mixados em volume baixo para manter a calma do jogo. */
class TrailNatureAudio {
  private context: AudioContext | null = null;
  private buffers: Partial<Record<keyof typeof TRACKS, AudioBuffer>> = {};
  private loading: Promise<void> | null = null;
  private sources: AudioBufferSourceNode[] = [];
  private gains: Partial<Record<keyof typeof TRACKS, GainNode>> = {};
  private master: GainNode | null = null;
  private weather: TrailWeather = "sunny";
  private active = false;

  private getContext() {
    if (typeof window === "undefined") return null;
    this.context ??= new window.AudioContext();
    return this.context;
  }

  private load() {
    if (this.loading) return this.loading;
    const context = this.getContext();
    if (!context) return Promise.resolve();
    this.loading = Promise.all(
      Object.entries(TRACKS).map(async ([key, url]) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Não foi possível carregar o som ambiente: ${key}`);
        this.buffers[key as keyof typeof TRACKS] = await context.decodeAudioData(await response.arrayBuffer());
      })
    ).then(() => undefined).catch((error) => {
      this.loading = null;
      console.warn("Áudio natural da trilha indisponível.", error);
    });
    return this.loading;
  }

  private applyMix() {
    const context = this.context;
    if (!context || !this.master) return;
    const now = context.currentTime;
    this.master.gain.setTargetAtTime(soundEffects.isMuted() ? 0 : soundEffects.getVolume() * 0.48, now, 0.12);
    this.gains.forest?.gain.setTargetAtTime(0.28, now, 0.5);
    this.gains.stream?.gain.setTargetAtTime(0.2, now, 0.5);
    this.gains.rain?.gain.setTargetAtTime(this.weather === "rain" ? 0.2 : 0, now, 0.6);
  }

  private async startSources() {
    const context = this.getContext();
    if (!context || this.sources.length) return;
    await this.load();
    if (!this.active || !this.buffers.forest || !this.buffers.stream || !this.buffers.rain) return;
    await context.resume();
    this.master = context.createGain();
    this.master.connect(context.destination);
    (Object.keys(TRACKS) as (keyof typeof TRACKS)[]).forEach((key) => {
      const buffer = this.buffers[key];
      if (!buffer) return;
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      gain.connect(this.master!);
      source.start();
      this.sources.push(source);
      this.gains[key] = gain;
    });
    this.applyMix();
  }

  /** Chamado no clique de início do nível para liberar o áudio nos navegadores. */
  start(weather: TrailWeather) {
    this.weather = weather;
    this.active = true;
    void this.startSources();
    this.applyMix();
  }

  setWeather(weather: TrailWeather) {
    this.weather = weather;
    this.applyMix();
  }

  setMuted(muted: boolean) {
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    this.master.gain.setTargetAtTime(muted ? 0 : soundEffects.getVolume() * 0.48, now, 0.08);
  }

  stop() {
    this.active = false;
    this.sources.forEach((source) => {
      try { source.stop(); } catch { /* já encerrado */ }
      source.disconnect();
    });
    this.sources = [];
    Object.values(this.gains).forEach((gain) => gain?.disconnect());
    this.gains = {};
    this.master?.disconnect();
    this.master = null;
  }
}

export const trailNatureAudio = new TrailNatureAudio();
