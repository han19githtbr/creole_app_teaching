// Motor de efeitos sonoros sintetizados de alta fidelidade via Web Audio API.
// Não depende de arquivos externos, funciona 100% offline, com latência zero,
// compressor de dinâmica master anti-distorção e suporte completo a volume e mudo.

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private muted: boolean = false;
  private volume: number = 0.75;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const savedMute = localStorage.getItem("kreyol:sound-muted");
        if (savedMute !== null) this.muted = savedMute === "true";
        const savedVol = localStorage.getItem("kreyol:sound-volume");
        if (savedVol !== null) this.volume = Math.max(0, Math.min(1, parseFloat(savedVol) || 0.75));
      } catch {
        // Ignora restrições de localStorage
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();

        // Compressor de dinâmica master para garantir som encorpado e sem clipagem
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      }

      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }

      return this.ctx;
    } catch {
      return null;
    }
  }

  private getMasterNode(): GainNode | null {
    this.getContext();
    return this.masterGain;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem("kreyol:sound-volume", String(this.volume));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem("kreyol:sound-muted", String(muted));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        muted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /** Toque tátil e orgânico tipo marimba caribenha com sutil variação harmônica */
  public playTap(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Variação micro-tonal sutil entre cliques para sensação viva
      const randomPitchOffset = (Math.random() - 0.5) * 35;
      const baseFreq = 540 + randomPitchOffset;

      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.04);

      subOsc.type = "triangle";
      subOsc.frequency.setValueAtTime(baseFreq * 2.2, now);
      subOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.035);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(master);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 0.07);
      subOsc.stop(now + 0.07);
    } catch {}
  }

  /** Som suave de gota d'água ao desmarcar opção */
  public playUntap(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(290, now + 0.04);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  /** Chime acolhedor de início de rodada */
  public playRoundStart(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Dupla nota em terça maior: E5 (659Hz) e G#5 (830Hz)
      [659.25, 830.61].forEach((freq, idx) => {
        const start = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.14, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

        osc.connect(gain);
        gain.connect(master);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {}
  }

  /** Acorde triunfante em arpejo estilo Ghibli / Caribe ao acertar a rodada */
  public playSuccess(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Acorde C maior com nona: C5 (523), E5 (659), G5 (784), B5 (987), D6 (1175), E6 (1318)
      const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51];
      const noteDelay = 0.075;

      notes.forEach((freq, idx) => {
        const start = now + idx * noteDelay;
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(freq * 2, start);

        const duration = idx === notes.length - 1 ? 0.6 : 0.3;
        const noteVol = 0.16;

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(noteVol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(master);

        osc.start(start);
        subOsc.start(start);
        osc.stop(start + duration + 0.03);
        subOsc.stop(start + duration + 0.03);
      });
    } catch {}
  }

  /** Fanfarra mágica para vitória perfeita (todas as vidas preservadas no 1º turno) */
  public playPerfectRound(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Arpejo estendido com brilho celestial
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((freq, idx) => {
        const start = now + idx * 0.065;
        const osc = ctx.createOscillator();
        const chime = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        chime.type = "triangle";
        chime.frequency.setValueAtTime(freq * 1.5, start);

        const dur = idx === notes.length - 1 ? 0.8 : 0.35;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        chime.connect(gain);
        gain.connect(master);

        osc.start(start);
        chime.start(start);
        osc.stop(start + dur + 0.03);
        chime.stop(start + dur + 0.03);
      });
    } catch {}
  }

  /** Som de erro suave e educativo (sem ruído áspero ou punitivo) */
  public playError(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 350, start: now, dur: 0.13 },
        { freq: 260, start: now + 0.12, dur: 0.22 },
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, start + dur);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.14, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(master);

        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch {}
  }

  /** Efeito sonoro tátil quando uma vida (coração) é perdida */
  public playHeartLost(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Batida abafada grave + estalo de vidro sutil
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      subOsc.connect(subGain);
      subGain.connect(master);
      subOsc.start(now);
      subOsc.stop(now + 0.24);

      // Ting de vidro quebrado suave
      const ping = ctx.createOscillator();
      const pingGain = ctx.createGain();
      ping.type = "triangle";
      ping.frequency.setValueAtTime(1180, now);
      ping.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      pingGain.gain.setValueAtTime(0.001, now);
      pingGain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      ping.connect(pingGain);
      pingGain.connect(master);
      ping.start(now);
      ping.stop(now + 0.12);
    } catch {}
  }

  /** Fanfarra progressiva de sequência (Streak combo crescente) */
  public playStreak(streak: number): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = 440 + Math.min(streak * 35, 400);
      const isHighCombo = streak >= 5;
      const notes = isHighCombo
        ? [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.75, baseFreq * 2]
        : [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.85];

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isHighCombo ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

        osc.connect(gain);
        gain.connect(master);

        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch {}
  }

  /** Fanfarra orquestral triunfante de subida de nível */
  public playLevelUp(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const notes = [392, 523.25, 659.25, 783.99, 1046.5];
      const intervals = [0, 0.09, 0.18, 0.28, 0.42];

      notes.forEach((freq, idx) => {
        const start = now + intervals[idx];
        const osc = ctx.createOscillator();
        const harmonic = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === notes.length - 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, start);

        harmonic.type = "sine";
        harmonic.frequency.setValueAtTime(freq * 1.5, start);

        const dur = idx === notes.length - 1 ? 0.75 : 0.2;
        const vol = 0.2;

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        harmonic.connect(gain);
        gain.connect(master);

        osc.start(start);
        harmonic.start(start);
        osc.stop(start + dur + 0.03);
        harmonic.stop(start + dur + 0.03);
      });
    } catch {}
  }

  /** Som alegre e metálico de moedas Goud caindo e tilintando */
  public playReward(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // 3 tilintadas de moedas em cascata rítmica
      const coinDrops = [
        { freq: 1760, time: now },
        { freq: 2093, time: now + 0.07 },
        { freq: 2489, time: now + 0.14 },
      ];

      coinDrops.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.16, time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

        osc.connect(gain);
        gain.connect(master);

        osc.start(time);
        osc.stop(time + 0.16);
      });
    } catch {}
  }

  /** Som suave de transição / zoom / abertura */
  public playWhoosh(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }
}

export const soundEffects = new SoundEffectsManager();
