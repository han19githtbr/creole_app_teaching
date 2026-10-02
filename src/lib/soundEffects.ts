// Motor de efeitos sonoros sintetizados via Web Audio API.
// Não depende de arquivos externos, funciona offline, com latência zero e suporte a mudo/volume.

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private volume: number = 0.7;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const savedMute = localStorage.getItem("kreyol:sound-muted");
        if (savedMute !== null) this.muted = savedMute === "true";
        const savedVol = localStorage.getItem("kreyol:sound-volume");
        if (savedVol !== null) this.volume = parseFloat(savedVol) || 0.7;
      } catch {
        // Ignora erros de localStorage restrito
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem("kreyol:sound-muted", String(muted));
    } catch {}
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /** Clique tátil e sutil ao selecionar uma palavra (pop suave) */
  public playTap(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  /** Som suave e sutil ao desmarcar uma palavra */
  public playUntap(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 * this.volume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  /** Acorde triunfante em arpejo estilo Ghibli/fantasia ao acertar a rodada */
  public playSuccess(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Arpejo luminoso: C5 (523Hz), E5 (659Hz), G5 (784Hz), B5 (987Hz), C6 (1046Hz), E6 (1318Hz)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
      const noteDelay = 0.08;

      notes.forEach((freq, idx) => {
        const start = now + idx * noteDelay;
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Onda principal suave e senoidal
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        // Harmônico com onda triangular para brilho acústico
        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(freq * 2, start);

        const duration = idx === notes.length - 1 ? 0.45 : 0.25;
        const noteVol = 0.14 * this.volume;

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(noteVol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        subOsc.start(start);
        osc.stop(start + duration + 0.02);
        subOsc.stop(start + duration + 0.02);
      });
    } catch {}
  }

  /** Som de erro suave e educado (sem ser áspero ou frustrante) */
  public playError(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Dois tons descendentes suaves
      const notes = [
        { freq: 330, start: now, dur: 0.12 },
        { freq: 247, start: now + 0.11, dur: 0.22 },
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.linearRampToValueAtTime(freq * 0.92, start + dur);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.12 * this.volume, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch {}
  }

  /** Fanfarra progressiva de sequência (Streak combo) */
  public playStreak(streak: number): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Frequência base sobe proporcionalmente à sequência
      const baseFreq = 440 + Math.min(streak * 40, 360);
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.875];

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.15 * this.volume, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {}
  }

  /** Fanfarra de conquista de nível ou badge desbloqueado */
  public playLevelUp(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Fanfarra triunfante maior: G4, C5, E5, G5, C6 sustenido
      const notes = [392, 523.25, 659.25, 783.99, 1046.5];
      const intervals = [0, 0.1, 0.2, 0.3, 0.44];

      notes.forEach((freq, idx) => {
        const start = now + intervals[idx];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === notes.length - 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, start);

        const dur = idx === notes.length - 1 ? 0.6 : 0.18;
        const vol = 0.18 * this.volume;

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch {}
  }

  /** Som de moedas e recompensa coletada */
  public playReward(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [987.77, 1318.51, 1567.98];

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.12 * this.volume, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.16);
      });
    } catch {}
  }
}

export const soundEffects = new SoundEffectsManager();
