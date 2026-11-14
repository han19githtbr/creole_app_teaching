// Motor de áudio procedural para a Avalanche da Trilha do Aluno Curioso.
// Gera um som visceral, realista e cinematográfico de avalanche em tempo real usando Web Audio API:
// 1. Estrondo sísmico subterrâneo (sub-bass 50-180 Hz com vibração de terra audível em qualquer falante);
// 2. Rugido pesado de massa de neve compactada moendo contra a rocha (ruído estéreo com saturação não-linear/waveshaper);
// 3. Vento cortante de deslocamento de ar (powder blast uivante de 800-3200 Hz);
// 4. Cascata granular de impactos: blocos de gelo estalando e pedras colidindo na encosta;
// 5. Compressor master de dinâmica para máxima presença e impacto sem distorção digital;
// 6. Desbloqueio e retomada automáticos e imediatos com proteção contra autoplay policies de navegadores;
// 7. Reações dinâmicas a respostas (surto violento no erro, recuo no acerto, soterramento cataclísmico).

import { soundEffects } from "@/lib/soundEffects";

class TrailAvalancheAudio {
  private ctx: AudioContext | null = null;
  private ownCtx: AudioContext | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;

  // Camadas de som
  private rumbleGain: GainNode | null = null;
  private roarGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private subGain: GainNode | null = null;

  // Filtros dinâmicos
  private filterRumble: BiquadFilterNode | null = null;
  private filterRoarLP: BiquadFilterNode | null = null;
  private filterRoarBP: BiquadFilterNode | null = null;
  private filterWindHP: BiquadFilterNode | null = null;
  private filterWindBP: BiquadFilterNode | null = null;

  // Fontes de áudio contínuas
  private noiseSourceRoar: AudioBufferSourceNode | null = null;
  private noiseSourceWind: AudioBufferSourceNode | null = null;
  private subOsc1: OscillatorNode | null = null;
  private subOsc2: OscillatorNode | null = null;

  // LFOs para modular tremor de terra e rajadas de vento
  private subLfo: OscillatorNode | null = null;
  private subLfoGain: GainNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private windLfoGain: GainNode | null = null;

  // Controle de estalos e blocos de gelo
  private impactTimer: number | null = null;
  private isRunning = false;
  private currentDanger = 0;
  private isPreviewing = false;
  private previewTimeout: number | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const unlock = () => this.resumeIfSuspended();
      window.addEventListener("pointerdown", unlock, { passive: true, once: false });
      window.addEventListener("keydown", unlock, { passive: true, once: false });
      window.addEventListener("touchstart", unlock, { passive: true, once: false });
    }
  }

  /**
   * Obtém o AudioContext compartilhado com o soundEffects (já desbloqueado em cliques)
   * ou inicializa seu próprio contexto com recuperação automática.
   */
  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      // 1) Tenta usar o AudioContext do soundEffects que já é mantido ativo pelos cliques do jogo
      const shared = soundEffects.getAudioContext();
      if (shared && shared.state !== "closed") {
        this.ctx = shared;
      } else if (!this.ownCtx || this.ownCtx.state === "closed") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ownCtx = new AudioCtx();
          this.ctx = this.ownCtx;
        }
      } else {
        this.ctx = this.ownCtx;
      }

      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /** Retoma o contexto se suspenso pelo navegador. */
  public resumeIfSuspended(): void {
    if (!this.ctx) this.getContext();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /** Inicialização síncrona chamada no gesto do usuário (ex: ao clicar em Iniciar Nível). */
  public prime(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  }

  /** Cria curva de saturação suave (waveshaping) para dar textura de neve esmagada e rocha. */
  private makeDistortionCurve(k = 25): Float32Array {
    const n_samples = 2048;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  /** Cria buffer estéreo de ruído de 6 segundos com canais independentes (campo sonoro imersivo e amplo). */
  private createStereoNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 6;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    // Canal Esquerdo: Brown Noise denso com ressonância profunda
    const leftData = buffer.getChannelData(0);
    let lastOutL = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOutL = (lastOutL + 0.032 * white) / 1.032;
      leftData[i] = lastOutL * 3.8;
    }

    // Canal Direito: Pink Noise enriquecido para textura granular
    const rightData = buffer.getChannelData(1);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555;
      b1 = 0.99332 * b1 + white * 0.0750;
      b2 = 0.96900 * b2 + white * 0.1538;
      b3 = 0.86650 * b3 + white * 0.3105;
      b4 = 0.55000 * b4 + white * 0.5330;
      b5 = -0.7616 * b5 - white * 0.0169;
      rightData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.536) * 0.14;
      b6 = white * 0.1159;
    }

    return buffer;
  }

  /** Inicia a síntese contínua da avalanche com áudio realista e audível. */
  public start(initialDanger = 0): void {
    if (this.isPreviewing) {
      this.stopPreview();
    }

    const ctx = this.getContext();
    if (!ctx) return;
    this.resumeIfSuspended();

    if (this.isRunning) {
      this.update(initialDanger);
      return;
    }

    this.isRunning = true;
    this.currentDanger = Math.max(0, Math.min(1, initialDanger));
    const now = ctx.currentTime;

    // 1) Master Stage: Compressor dedicado + Master Gain
    this.masterCompressor = ctx.createDynamicsCompressor();
    this.masterCompressor.threshold.setValueAtTime(-14, now);
    this.masterCompressor.knee.setValueAtTime(10, now);
    this.masterCompressor.ratio.setValueAtTime(7, now);
    this.masterCompressor.attack.setValueAtTime(0.005, now);
    this.masterCompressor.release.setValueAtTime(0.14, now);

    this.masterGain = ctx.createGain();
    const vol = soundEffects.isMuted() ? 0 : soundEffects.getVolume();
    // Inicia audível de forma nítida (0.42 de base + perigo), dando a presença assustadora da avalanche
    const targetVol = vol * (0.45 + this.currentDanger * 0.55);
    this.masterGain.gain.setValueAtTime(0.01, now);
    this.masterGain.gain.linearRampToValueAtTime(targetVol, now + 0.45);

    this.masterCompressor.connect(ctx.destination);
    this.masterGain.connect(this.masterCompressor);

    // 2) Camada 1: Estrondo Sísmico e Tremor de Terra (52 Hz e 68 Hz audíveis)
    this.subGain = ctx.createGain();
    this.subGain.gain.setValueAtTime(0.42 + this.currentDanger * 0.45, now);

    this.subOsc1 = ctx.createOscillator();
    this.subOsc1.type = "triangle"; // Forma de onda com harmônicos audíveis em qualquer alto-falante
    this.subOsc1.frequency.setValueAtTime(54, now);

    this.subOsc2 = ctx.createOscillator();
    this.subOsc2.type = "sine";
    this.subOsc2.frequency.setValueAtTime(68, now);

    // LFO para pulsar o tremor de terra conforme as ondas de neve descem a montanha
    this.subLfo = ctx.createOscillator();
    this.subLfo.type = "sine";
    this.subLfo.frequency.setValueAtTime(1.8 + this.currentDanger * 2.4, now);

    this.subLfoGain = ctx.createGain();
    this.subLfoGain.gain.setValueAtTime(0.25, now);
    this.subLfo.connect(this.subLfoGain);

    this.filterRumble = ctx.createBiquadFilter();
    this.filterRumble.type = "lowpass";
    this.filterRumble.frequency.setValueAtTime(85 + this.currentDanger * 140, now);
    this.filterRumble.Q.setValueAtTime(2.2, now);

    this.subOsc1.connect(this.filterRumble);
    this.subOsc2.connect(this.filterRumble);
    this.filterRumble.connect(this.subGain);
    this.subLfoGain.connect(this.subGain.gain);
    this.subGain.connect(this.masterGain);

    this.subOsc1.start();
    this.subOsc2.start();
    this.subLfo.start();

    // 3) Camada 2: Rugido Pesado de Massa de Neve com Saturação (Waveshaper)
    const stereoNoise = this.createStereoNoiseBuffer(ctx);
    this.noiseSourceRoar = ctx.createBufferSource();
    this.noiseSourceRoar.buffer = stereoNoise;
    this.noiseSourceRoar.loop = true;

    this.filterRoarLP = ctx.createBiquadFilter();
    this.filterRoarLP.type = "lowpass";
    this.filterRoarLP.frequency.setValueAtTime(220 + this.currentDanger * 380, now);
    this.filterRoarLP.Q.setValueAtTime(1.8, now);

    this.filterRoarBP = ctx.createBiquadFilter();
    this.filterRoarBP.type = "peaking";
    this.filterRoarBP.frequency.setValueAtTime(320 + this.currentDanger * 420, now);
    this.filterRoarBP.Q.setValueAtTime(2.2, now);
    this.filterRoarBP.gain.setValueAtTime(6.0, now);

    const shaper = ctx.createWaveShaper();
    shaper.curve = this.makeDistortionCurve(18) as unknown as Float32Array<ArrayBuffer>;
    shaper.oversample = "2x";

    this.roarGain = ctx.createGain();
    this.roarGain.gain.setValueAtTime(0.55 + this.currentDanger * 0.45, now);

    this.noiseSourceRoar.connect(this.filterRoarLP);
    this.filterRoarLP.connect(this.filterRoarBP);
    this.filterRoarBP.connect(shaper);
    shaper.connect(this.roarGain);
    this.roarGain.connect(this.masterGain);
    this.noiseSourceRoar.start();

    // 4) Camada 3: Vento Cortante / Powder Blast (deslocamento de ar uivante)
    this.noiseSourceWind = ctx.createBufferSource();
    this.noiseSourceWind.buffer = stereoNoise;
    this.noiseSourceWind.loop = true;

    this.filterWindHP = ctx.createBiquadFilter();
    this.filterWindHP.type = "highpass";
    this.filterWindHP.frequency.setValueAtTime(700, now);
    this.filterWindHP.Q.setValueAtTime(1.0, now);

    this.filterWindBP = ctx.createBiquadFilter();
    this.filterWindBP.type = "bandpass";
    this.filterWindBP.frequency.setValueAtTime(1100 + this.currentDanger * 1600, now);
    this.filterWindBP.Q.setValueAtTime(2.5, now);

    this.windLfo = ctx.createOscillator();
    this.windLfo.type = "sine";
    this.windLfo.frequency.setValueAtTime(0.9 + this.currentDanger * 1.5, now);

    this.windLfoGain = ctx.createGain();
    this.windLfoGain.gain.setValueAtTime(0.18, now);
    this.windLfo.connect(this.windLfoGain);

    this.windGain = ctx.createGain();
    this.windGain.gain.setValueAtTime(0.28 + this.currentDanger * 0.65, now);

    this.noiseSourceWind.connect(this.filterWindHP);
    this.filterWindHP.connect(this.filterWindBP);
    this.filterWindBP.connect(this.windGain);
    this.windLfoGain.connect(this.windGain.gain);
    this.windGain.connect(this.masterGain);

    this.windLfo.start();
    this.noiseSourceWind.start();

    // 5) Gerador orgânico de impactos e estalos de blocos de gelo/pedras
    this.startImpactCascades();
  }

  /** Atualiza dinamicamente as características do áudio conforme a avalanche se aproxima (danger 0..1). */
  public update(danger: number): void {
    if (!this.isRunning || !this.ctx) return;
    this.resumeIfSuspended();
    this.currentDanger = Math.max(0, Math.min(1, danger));
    const now = this.ctx.currentTime;
    const vol = soundEffects.isMuted() ? 0 : soundEffects.getVolume();

    // Volume master escala de 0.45 (distante, mas claro) até 1.0 (muito perto)
    const targetMaster = vol * (0.45 + Math.pow(this.currentDanger, 1.1) * 0.55);
    this.masterGain?.gain.setTargetAtTime(targetMaster, now, 0.08);

    // Estrondo subterrâneo ganha amplitude e abre a frequência para encher a sala
    if (this.filterRumble) {
      const rumbleFreq = 85 + this.currentDanger * 160;
      this.filterRumble.frequency.setTargetAtTime(rumbleFreq, now, 0.1);
    }
    this.subGain?.gain.setTargetAtTime(0.42 + this.currentDanger * 0.58, now, 0.08);

    // Rugido da massa de neve abre o filtro de baixas e médias
    if (this.filterRoarLP) {
      const roarFreq = 220 + Math.pow(this.currentDanger, 1.3) * 480;
      this.filterRoarLP.frequency.setTargetAtTime(roarFreq, now, 0.1);
    }
    if (this.filterRoarBP) {
      const bpFreq = 320 + Math.pow(this.currentDanger, 1.2) * 520;
      this.filterRoarBP.frequency.setTargetAtTime(bpFreq, now, 0.1);
    }
    this.roarGain?.gain.setTargetAtTime(0.55 + this.currentDanger * 0.45, now, 0.08);

    // Vento cortante uivante sobe de tom e ganha intensidade
    if (this.filterWindBP) {
      const windFreq = 1100 + Math.pow(this.currentDanger, 1.4) * 1900;
      this.filterWindBP.frequency.setTargetAtTime(windFreq, now, 0.1);
    }
    this.windGain?.gain.setTargetAtTime(0.28 + Math.pow(this.currentDanger, 1.2) * 0.72, now, 0.08);

    // Frequência do tremor e do vento acelera com o perigo
    if (this.subLfo) {
      this.subLfo.frequency.setTargetAtTime(1.8 + this.currentDanger * 3.2, now, 0.15);
    }
    if (this.windLfo) {
      this.windLfo.frequency.setTargetAtTime(0.9 + this.currentDanger * 2.1, now, 0.15);
    }
  }

  /** Cascata de impactos de blocos de gelo e pedras rolando na encosta. */
  private startImpactCascades(): void {
    if (this.impactTimer !== null) return;

    const scheduleNext = () => {
      if (!this.isRunning) return;
      const delay = Math.max(120, 480 - this.currentDanger * 320 + (Math.random() - 0.5) * 180);
      this.impactTimer = window.setTimeout(() => {
        if (!this.isRunning) return;
        this.triggerIceOrRockImpact();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
  }

  /** Dispara impacto orgânico de bloco de gelo ou pedra rolando. */
  private triggerIceOrRockImpact(): void {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain || soundEffects.isMuted()) return;
    const now = ctx.currentTime;
    const isIce = Math.random() > 0.45;

    if (isIce) {
      // Estalo agudo de bloco de gelo quebrando (crack)
      const duration = 0.06 + Math.random() * 0.09;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.018));
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400 + Math.random() * 2200, now);
      filter.Q.setValueAtTime(2.6, now);

      const gain = ctx.createGain();
      const vol = (0.16 + this.currentDanger * 0.38) * soundEffects.getVolume();
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start(now);
      src.stop(now + duration);
    } else {
      // Baque grave de pedra/bloco maciço de neve batendo no chão (thump)
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      const startF = 120 + Math.random() * 50;
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.16);

      const vol = (0.22 + this.currentDanger * 0.42) * soundEffects.getVolume();
      g.gain.setValueAtTime(vol, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(g);
      g.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  /** Efeito de Surto (Surge): quando o aluno erra uma alternativa e a avalanche avança violentamente. */
  public playSurge(): void {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    this.resumeIfSuspended();
    const now = ctx.currentTime;
    const vol = soundEffects.isMuted() ? 0 : soundEffects.getVolume();

    // Abertura abrupta de frequência e amplitude do rugido
    this.filterRoarLP?.frequency.setValueAtTime(750, now);
    this.filterRoarLP?.frequency.exponentialRampToValueAtTime(260, now + 1.2);

    this.filterWindBP?.frequency.setValueAtTime(3200, now);
    this.filterWindBP?.frequency.exponentialRampToValueAtTime(1400, now + 1.1);

    // Impacto sísmico de trovão de neve caindo
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.95);

    g.gain.setValueAtTime(vol * 0.85, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.0);

    // 2 estalos simultâneos de gelo quebrando
    this.triggerIceOrRockImpact();
    setTimeout(() => this.triggerIceOrRockImpact(), 90);
  }

  /** Efeito de Recuo (Recoil): quando o aluno acerta e a avalanche é empurrada para trás. */
  public playRecoil(): void {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    this.resumeIfSuspended();
    const now = ctx.currentTime;
    const vol = soundEffects.isMuted() ? 0 : soundEffects.getVolume();

    // Redução rápida e abafamento momentâneo (sensação de ar aliviado e distância ganha)
    this.filterRoarLP?.frequency.setTargetAtTime(170, now, 0.08);
    this.masterGain.gain.setTargetAtTime(vol * (0.35 + this.currentDanger * 0.35), now, 0.08);
  }

  /** Efeito de Soterramento (Crash): quando a avalanche engole o aluno. */
  public playCrash(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    this.resumeIfSuspended();
    const now = ctx.currentTime;
    const vol = soundEffects.isMuted() ? 0 : soundEffects.getVolume();

    // Explosão cataclísmica de neve e rocha
    const crashOsc = ctx.createOscillator();
    const crashGain = ctx.createGain();
    crashOsc.type = "sawtooth";
    crashOsc.frequency.setValueAtTime(110, now);
    crashOsc.frequency.exponentialRampToValueAtTime(18, now + 2.2);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 2.0);

    crashGain.gain.setValueAtTime(vol * 0.95, now);
    crashGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    crashOsc.connect(filter);
    filter.connect(crashGain);
    crashGain.connect(ctx.destination);
    crashOsc.start(now);
    crashOsc.stop(now + 2.3);

    // Desliga a síntese contínua após o impacto
    setTimeout(() => this.stop(), 900);
  }

  /** Toca uma demonstração rápida de 3.5 segundos da avalanche para teste no lobby. */
  public previewSound(): void {
    this.stop();
    this.stopPreview();

    const ctx = this.getContext();
    if (!ctx) return;
    this.resumeIfSuspended();

    this.isPreviewing = true;
    this.start(0.5);

    // Efeito de surto após 1.2 segundos para demonstrar toda a força da avalanche
    setTimeout(() => {
      if (this.isPreviewing) {
        this.update(0.85);
        this.playSurge();
      }
    }, 1200);

    this.previewTimeout = window.setTimeout(() => {
      this.stopPreview();
    }, 3800);
  }

  private stopPreview(): void {
    this.isPreviewing = false;
    if (this.previewTimeout !== null) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }
    this.stop();
  }

  /** Atualiza o estado de mudo. */
  public setMuted(muted: boolean): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const vol = muted ? 0 : soundEffects.getVolume() * (0.45 + this.currentDanger * 0.55);
    this.masterGain.gain.setTargetAtTime(vol, now, 0.08);
  }

  /** Interrompe todos os sons e libera nós de áudio. */
  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.impactTimer !== null) {
      clearTimeout(this.impactTimer);
      this.impactTimer = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(0, now, 0.12);
    }

    setTimeout(() => {
      try { this.noiseSourceRoar?.stop(); } catch {}
      try { this.noiseSourceWind?.stop(); } catch {}
      try { this.subOsc1?.stop(); } catch {}
      try { this.subOsc2?.stop(); } catch {}
      try { this.subLfo?.stop(); } catch {}
      try { this.windLfo?.stop(); } catch {}

      this.noiseSourceRoar?.disconnect();
      this.noiseSourceWind?.disconnect();
      this.subOsc1?.disconnect();
      this.subOsc2?.disconnect();
      this.subLfo?.disconnect();
      this.windLfo?.disconnect();
      this.masterGain?.disconnect();
      this.masterCompressor?.disconnect();

      this.noiseSourceRoar = null;
      this.noiseSourceWind = null;
      this.subOsc1 = null;
      this.subOsc2 = null;
      this.subLfo = null;
      this.windLfo = null;
      this.masterGain = null;
      this.masterCompressor = null;
    }, 150);
  }
}

export const trailAvalancheAudio = new TrailAvalancheAudio();
