/**
 * Áudio dos contos: narração em francês (a mesma voz usada na pronúncia do jogo),
 * música suave sintetizada e reprodução com pausa/retomada.
 */
import { loadWordPronunciationPcm } from "../gameDemoAudio";
import { taleNarrationTexts, type Tale } from "./tales";
import { allLines, type TalePlan } from "./timeline";

export const TALE_SAMPLE_RATE = 48000;

/** Texto da frase → áudio mono (Float32) em 48 kHz. Frases sem áudio ficam de fora. */
export type TaleNarration = Map<string, Float32Array>;

export async function loadTaleNarration(
  tale: Tale,
  onProgress?: (done: number, total: number) => void,
  signal?: AbortSignal
): Promise<TaleNarration> {
  const texts = [...new Set(taleNarrationTexts(tale))];
  const out: TaleNarration = new Map();
  let next = 0;
  let done = 0;
  const worker = async () => {
    while (next < texts.length && !signal?.aborted) {
      const text = texts[next++];
      const pcm = await loadWordPronunciationPcm(text, TALE_SAMPLE_RATE, signal);
      if (pcm && pcm.length) out.set(text, pcm);
      onProgress?.(++done, texts.length);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  return out;
}

export function narrationDurations(narration: TaleNarration): Map<string, number> {
  const map = new Map<string, number>();
  narration.forEach((pcm, text) => map.set(text, pcm.length / TALE_SAMPLE_RATE));
  return map;
}

/** Quantas frases do conto ficaram sem voz. */
export function missingNarration(tale: Tale, narration: TaleNarration): number {
  return [...new Set(taleNarrationTexts(tale))].filter((text) => !narration.has(text)).length;
}

/* ------------------------------ mixagem ------------------------------ */

const NOTE = (semi: number) => 220 * Math.pow(2, semi / 12);
// Lá menor pentatônica: suave e sem tensão
const SCALE = [0, 3, 5, 7, 10, 12, 15, 17];
const CHORDS = [
  [0, 7, 15],
  [-4, 3, 12],
  [-9, 0, 7],
  [-2, 5, 14],
];

/** Mistura narração + música (opcional) num buffer estéreo. */
export function mixTaleAudio(plan: TalePlan, narration: TaleNarration, opts: { music: boolean }): Float32Array[] {
  const sr = TALE_SAMPLE_RATE;
  const length = Math.ceil((plan.total + 0.4) * sr);
  const voice = new Float32Array(length);
  const lines = allLines(plan);

  for (const line of lines) {
    const pcm = narration.get(line.text);
    if (!pcm) continue;
    const from = Math.floor(line.start * sr);
    let peak = 0;
    for (let i = 0; i < pcm.length; i++) peak = Math.max(peak, Math.abs(pcm[i]));
    const gain = peak > 0 ? Math.min(3, 0.9 / peak) : 1;
    for (let i = 0; i < pcm.length && from + i < length; i++) voice[from + i] += pcm[i] * gain;
  }

  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) out[i] = voice[i];

  if (opts.music) {
    // "ducking": a música abaixa enquanto alguém fala
    const duck = new Float32Array(Math.ceil(plan.total * 50) + 50).fill(1);
    for (const line of lines) {
      if (!narration.has(line.text)) continue;
      for (let k = Math.floor((line.start - 0.15) * 50); k < Math.ceil((line.start + line.dur + 0.3) * 50); k++) if (k >= 0 && k < duck.length) duck[k] = 0.42;
    }
    for (let pass = 0; pass < 6; pass++) for (let k = 1; k < duck.length - 1; k++) duck[k] = (duck[k - 1] + duck[k] * 2 + duck[k + 1]) / 4;

    const music = new Float32Array(length);
    const addTone = (start: number, dur: number, freq: number, vol: number, attack: number, kind: "pad" | "pluck") => {
      const from = Math.floor(start * sr);
      const n = Math.floor(dur * sr);
      for (let i = 0; i < n && from + i < length; i++) {
        const x = i / sr;
        const env = kind === "pad" ? Math.min(1, x / attack) * Math.min(1, (dur - x) / attack) : Math.min(1, x / 0.006) * Math.exp(-x * 3.2);
        const ph = 2 * Math.PI * freq * x;
        music[from + i] += (Math.sin(ph) + 0.28 * Math.sin(2 * ph) + (kind === "pad" ? 0.12 * Math.sin(ph * 0.5) : 0)) * env * vol;
      }
    };
    plan.scenes.forEach((scene, si) => {
      const chord = CHORDS[si % CHORDS.length];
      for (const semi of chord) addTone(scene.start - 0.4, scene.dur + 0.9, NOTE(semi), 0.05, 1.2, "pad");
      let seed = si * 977 + 13;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let t = scene.start + 0.3; t < scene.end - 0.2; t += 0.55 + rnd() * 0.5) {
        addTone(t, 1.4, NOTE(SCALE[Math.floor(rnd() * SCALE.length)] + 12), 0.05, 0, "pluck");
      }
    });
    addTone(plan.endStart, plan.endDur, NOTE(0), 0.06, 1.0, "pad");
    addTone(plan.endStart, plan.endDur, NOTE(7), 0.05, 1.0, "pad");
    for (let i = 0; i < length; i++) {
      const t = i / sr;
      const fadeIn = Math.min(1, t / 1.5);
      const fadeOut = Math.min(1, Math.max(0, (plan.total - t) / 2));
      out[i] += music[i] * duck[Math.min(duck.length - 1, Math.floor(t * 50))] * fadeIn * fadeOut;
    }
  }

  for (let i = 0; i < length; i++) {
    const v = out[i];
    out[i] = Math.abs(v) < 0.8 ? v : Math.sign(v) * (0.8 + 0.2 * Math.tanh((Math.abs(v) - 0.8) / 0.2));
  }
  return [out, new Float32Array(out)];
}

/* ------------------------------ reprodução ------------------------------ */

/** Toca a trilha mixada e sabe em que ponto está (para sincronizar o desenho). */
export class TalePlayback {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private buffer: AudioBuffer | null = null;
  private startedAt = 0;
  private offset = 0;
  private muted = false;
  playing = false;

  setTrack(channels: Float32Array[]) {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx ??= new AudioCtx();
    const buffer = this.ctx.createBuffer(2, channels[0].length, TALE_SAMPLE_RATE);
    channels.forEach((data, c) => buffer.copyToChannel(new Float32Array(data), c));
    this.buffer = buffer;
    this.gain ??= this.ctx.createGain();
    this.gain.connect(this.ctx.destination);
    this.gain.gain.value = this.muted ? 0 : 1;
  }

  get ready() {
    return Boolean(this.ctx && this.buffer);
  }

  play(from: number) {
    this.stopSource();
    this.offset = from;
    this.playing = true;
    if (!this.ctx || !this.buffer || !this.gain) return;
    void this.ctx.resume();
    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.gain);
    source.start(0, Math.max(0, from));
    this.source = source;
    this.startedAt = this.ctx.currentTime;
  }

  pause(): number {
    const position = this.position();
    this.stopSource();
    this.offset = position;
    this.playing = false;
    return position;
  }

  position(): number {
    if (!this.playing || !this.ctx) return this.offset;
    return this.offset + (this.ctx.currentTime - this.startedAt);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.gain) this.gain.gain.value = muted ? 0 : 1;
  }

  dispose() {
    this.stopSource();
    void this.ctx?.close();
    this.ctx = null;
    this.buffer = null;
  }

  private stopSource() {
    try {
      this.source?.stop();
    } catch {
      /* já parado */
    }
    this.source?.disconnect();
    this.source = null;
  }
}
