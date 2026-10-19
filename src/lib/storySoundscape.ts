// Sons característicos dos elementos e do ambiente de cada história.
//
// Nada é baixado: todos os sons são sintetizados com Web Audio (osciladores + ruído filtrado), então
// funcionam sem arquivos e sem direitos autorais. O mesmo plano de sons (`buildSoundPlan`) alimenta
//   - o player (agendado "ao vivo" junto com a narração) e
//   - a exportação do vídeo (renderizado em segmentos por OfflineAudioContext e somado à narração),
// por isso o vídeo baixado tem exatamente os sons que o aluno ouviu.

export type SoundKind =
  | "bird" | "gull" | "dove" | "wave" | "surf" | "wind" | "water" | "drum" | "plane" | "helicopter" | "boat"
  | "horn" | "bell" | "guitar" | "piano" | "flute" | "fire" | "chicken" | "goat" | "horse" | "duck"
  | "tractor" | "cannon" | "crowd" | "projector" | "shutter" | "popcorn" | "beep" | "typing" | "drone"
  | "ping" | "balloon" | "bubbles" | "clink" | "page" | "creak" | "cricket" | "chime" | "step" | "bounce";

export interface SoundEvent {
  /** Segundo da narração em que o som começa. */
  t: number;
  kind: SoundKind;
  /** Volume relativo (0–1). */
  gain: number;
}

/** Elemento (chave em Kreyòl) → som que o representa. */
const ELEMENT_SOUND: Record<string, SoundKind> = {
  "ansyen kay": "creak", "antèn": "beep", "asyèt": "clink", "avyon": "plane", "balanse": "creak", "balon": "balloon",
  "bato": "boat", "bisiklèt": "ping", "ble": "wind", "bouji": "fire", "boul": "bounce", "bousòl": "ping",
  "boutèy": "clink", "chemen": "step", "chodyè": "bubbles", "chwal": "horse", "chèz": "creak", "dansè": "drum",
  "dra": "wind", "drapo": "wind", "dròn": "drone", "ekran": "beep", "estati": "chime", "fa": "horn", "fan": "wind",
  "flanbo": "fire", "flè": "bird", "forè": "bird", "fouchèt": "clink", "fwi": "clink", "fèm": "chicken", "fò": "cannon",
  "gita": "guitar", "jaden": "wind", "kabrit": "goat", "kamera": "shutter", "kanna": "duck", "kanon": "cannon",
  "kap": "wind", "kas": "piano", "kaskad": "water", "kat": "page", "kay": "creak", "klavye": "piano", "kloti": "creak",
  "klòch": "bell", "kolòn": "chime", "kouto": "clink", "krich": "clink", "kwa": "bell", "laboratwa": "bubbles",
  "legim": "popcorn", "legliz": "bell", "limyè": "chime", "liv": "page", "machann": "crowd", "manje": "clink",
  "mask": "drum", "mikwofòn": "crowd", "mizik": "guitar", "moniman": "chime", "moulen van": "wind", "mòn": "wind",
  "moun saj": "chime", "nòt mizik": "flute", "opalè": "drum", "otèl": "chime", "palmis": "wind", "panno solè": "ping",
  "papiyon": "wind", "parapli": "wind", "pen": "popcorn", "pi": "water", "piano": "piano", "pijon": "dove",
  "piknik": "clink", "piman": "fire", "plaj": "wave", "pon": "step", "poul": "chicken", "projèktè": "projector",
  "pye oliv": "wind", "pyebwa": "bird", "pòp-kòn": "popcorn", "pòtay": "creak", "rad": "wind", "riban": "wind",
  "rivyè": "water", "robo": "beep", "satelit": "ping", "sinema": "projector", "sèn": "crowd", "tab": "clink",
  "tanbou": "drum", "telefòn": "beep", "tikè": "page", "traktè": "tractor", "tòti": "water", "valiz": "step",
  "vitral": "chime", "vòlkan": "cannon", "woulo": "page", "wòch": "step", "zetwal": "chime", "zile": "wave",
  "zwazo": "bird", "òdinatè": "typing", "lanmè": "wave", "lanp": "chime",
  // detalhes gerais da cena
  "sòlèy": "chime", "lalin": "cricket", "nyaj": "wind", "syèl": "bird", "zèb": "wind", "sab": "wave",
  "plancher": "step", "dlo": "water",
};

function normTheme(theme: string): string {
  return theme.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Gerador pseudoaleatório determinístico: o mesmo plano sai igual no player e na exportação. */
function seeded(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface AmbientRule {
  kind: SoundKind;
  /** Intervalo médio entre sons, em segundos. */
  every: number;
  gain: number;
  /** Primeiro som (segundos). */
  first?: number;
}

function ambientRules(theme: string, hasWater: boolean): AmbientRule[] {
  const t = normTheme(theme);
  const rules: AmbientRule[] = [];
  if (t.includes("natureza")) rules.push({ kind: "bird", every: 3.2, gain: 0.16 }, { kind: "wind", every: 7, gain: 0.1 });
  else if (t.includes("turismo")) rules.push({ kind: "gull", every: 8, gain: 0.14 }, { kind: "plane", every: 26, gain: 0.12, first: 7 }, { kind: "helicopter", every: 34, gain: 0.12, first: 19 });
  else if (t.includes("cultura")) rules.push({ kind: "drum", every: 11, gain: 0.14, first: 1.5 }, { kind: "crowd", every: 19, gain: 0.07, first: 8 });
  else if (t.includes("danca")) rules.push({ kind: "drum", every: 6, gain: 0.15, first: 1 });
  else if (t.includes("musica")) rules.push({ kind: "guitar", every: 8, gain: 0.13, first: 1 }, { kind: "piano", every: 15, gain: 0.1, first: 5 });
  else if (t.includes("tecnologia")) rules.push({ kind: "beep", every: 5, gain: 0.1 }, { kind: "drone", every: 17, gain: 0.1, first: 8 });
  else if (t.includes("interior")) rules.push({ kind: "bird", every: 4, gain: 0.13 }, { kind: "chicken", every: 11, gain: 0.12, first: 4 }, { kind: "goat", every: 24, gain: 0.1, first: 12 }, { kind: "tractor", every: 31, gain: 0.08, first: 16 });
  else if (t.includes("lazeres")) rules.push({ kind: "bird", every: 4, gain: 0.13 }, { kind: "ping", every: 17, gain: 0.08, first: 9 }, { kind: "wind", every: 8, gain: 0.08 });
  else if (t.includes("geografia")) rules.push({ kind: "wind", every: 6, gain: 0.1 }, { kind: "bird", every: 6.5, gain: 0.1 });
  else if (t.includes("historia")) rules.push({ kind: "wind", every: 7, gain: 0.1 }, { kind: "bell", every: 22, gain: 0.08, first: 9 }, { kind: "horse", every: 27, gain: 0.08, first: 15 });
  else if (t.includes("cinema")) rules.push({ kind: "projector", every: 10, gain: 0.1, first: 1 }, { kind: "popcorn", every: 14, gain: 0.08, first: 6 }, { kind: "crowd", every: 25, gain: 0.06, first: 12 });
  else if (t.includes("estoicismo")) rules.push({ kind: "wind", every: 6, gain: 0.09 }, { kind: "bird", every: 8, gain: 0.08 }, { kind: "chime", every: 22, gain: 0.07, first: 10 });
  else if (t.includes("religiao")) rules.push({ kind: "bell", every: 18, gain: 0.1, first: 2 }, { kind: "dove", every: 10, gain: 0.1, first: 5 }, { kind: "wind", every: 9, gain: 0.07 });
  else if (t.includes("gastronomia")) rules.push({ kind: "bubbles", every: 6, gain: 0.12, first: 1 }, { kind: "clink", every: 9, gain: 0.09, first: 4 });
  else rules.push({ kind: "wind", every: 8, gain: 0.08 });
  if (hasWater) rules.push({ kind: "wave", every: 7, gain: 0.17, first: 0.5 });
  return rules;
}

/** Quando o surfista aparece na cena (precisa bater com a camada de vida: storySceneLife.surferProgress). */
export const SURF_FIRST_SECONDS = 4;
export const SURF_PERIOD_SECONDS = 18;
export const SURF_RIDE_SECONDS = 8;

export function buildSoundPlan(input: {
  theme: string;
  /** Elementos rotulados e o segundo em que cada um entra em destaque. */
  elements: { kreyol: string; start: number }[];
  duration: number;
  hasWater: boolean;
  seed: string;
}): SoundEvent[] {
  const { theme, elements, duration, hasWater, seed } = input;
  if (!(duration > 0)) return [];
  const rand = seeded(seed);
  const events: SoundEvent[] = [];

  for (const rule of ambientRules(theme, hasWater)) {
    let t = rule.first ?? rule.every * (0.3 + rand() * 0.6);
    while (t < duration) {
      events.push({ t, kind: rule.kind, gain: rule.gain });
      t += rule.every * (0.7 + rand() * 0.6);
    }
  }

  // Cada elemento tem o seu som no instante em que o rótulo dele aparece.
  for (const element of elements) {
    const kind = ELEMENT_SOUND[element.kreyol.toLowerCase()];
    if (!kind) continue;
    events.push({ t: Math.min(duration - 0.2, element.start + 0.18), kind, gain: 0.34 });
  }

  // De vez em quando surgem ondas grandes com surfistas.
  if (hasWater) {
    for (let t = SURF_FIRST_SECONDS; t < duration; t += SURF_PERIOD_SECONDS) {
      events.push({ t, kind: "surf", gain: 0.26 });
    }
  }
  return events.filter((event) => event.t >= 0 && event.t < duration).sort((a, b) => a.t - b.t);
}

// ───────────────────────────── síntese ─────────────────────────────

type Ctx = BaseAudioContext;
const noiseBuffers = new WeakMap<Ctx, AudioBuffer>();

function noiseBuffer(ctx: Ctx): AudioBuffer {
  let buffer = noiseBuffers.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.04 * white) / 1.04; // ruído "rosado": mais grave e natural que o branco
      data[i] = (white * 0.35 + last * 9) * 0.5;
    }
    noiseBuffers.set(ctx, buffer);
  }
  return buffer;
}

function gainEnv(ctx: Ctx, dest: AudioNode, when: number, attack: number, hold: number, release: number, peak: number): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), when + Math.max(0.005, attack));
  gain.gain.setValueAtTime(Math.max(0.0002, peak), when + attack + hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + attack + hold + release);
  gain.connect(dest);
  return gain;
}

function tone(ctx: Ctx, dest: AudioNode, type: OscillatorType, f0: number, f1: number, when: number, dur: number, peak: number, attack = 0.01) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, when);
  if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), when + dur);
  const gain = gainEnv(ctx, dest, when, attack, 0, dur, peak);
  osc.connect(gain);
  osc.start(when);
  osc.stop(when + attack + dur + 0.05);
  return osc;
}

function noiseBurst(
  ctx: Ctx, dest: AudioNode, when: number, dur: number, peak: number,
  filter: BiquadFilterType, f0: number, f1: number, q = 1, attack = 0.01, hold = 0
) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  src.loop = true;
  const biquad = ctx.createBiquadFilter();
  biquad.type = filter;
  biquad.Q.value = q;
  biquad.frequency.setValueAtTime(f0, when);
  if (f1 !== f0) biquad.frequency.exponentialRampToValueAtTime(Math.max(20, f1), when + attack + hold + dur);
  const gain = gainEnv(ctx, dest, when, attack, hold, dur, peak);
  src.connect(biquad);
  biquad.connect(gain);
  src.start(when, Math.random() * 1.5);
  src.stop(when + attack + hold + dur + 0.05);
}

const r = (a: number, b: number) => a + Math.random() * (b - a);

const SYNTH: Record<SoundKind, (ctx: Ctx, d: AudioNode, t: number, g: number) => void> = {
  bird(ctx, d, t, g) {
    const n = 3 + Math.floor(Math.random() * 4);
    const base = r(2300, 3800);
    for (let i = 0; i < n; i++) tone(ctx, d, "sine", base * r(0.9, 1.15), base * r(1.25, 1.7), t + i * 0.11, 0.08, g * 0.5, 0.008);
  },
  gull(ctx, d, t, g) {
    for (let i = 0; i < 2; i++) tone(ctx, d, "sawtooth", r(1500, 1800), r(750, 950), t + i * 0.55, 0.45, g * 0.18, 0.05);
  },
  dove(ctx, d, t, g) {
    for (let i = 0; i < 3; i++) tone(ctx, d, "sine", 420, 360, t + i * 0.38, 0.3, g * 0.55, 0.06);
  },
  wave(ctx, d, t, g) {
    noiseBurst(ctx, d, t, 2.8, g * 0.9, "lowpass", 500, 1700, 0.7, 1.7, 0.2);
  },
  surf(ctx, d, t, g) {
    // Onda grande: sobe, quebra em espuma e volta ao mar.
    noiseBurst(ctx, d, t, 3.4, g, "lowpass", 400, 2600, 0.8, 2.4, 0.5);
    noiseBurst(ctx, d, t + 2.1, 3, g * 0.5, "highpass", 1800, 900, 0.6, 0.15, 0.3);
  },
  wind(ctx, d, t, g) {
    noiseBurst(ctx, d, t, 3, g * 0.6, "bandpass", r(350, 600), r(700, 1100), 0.9, 1.4, 0.5);
  },
  water(ctx, d, t, g) {
    noiseBurst(ctx, d, t, 2.2, g * 0.5, "bandpass", 2200, 3000, 0.5, 0.4, 0.8);
    for (let i = 0; i < 5; i++) tone(ctx, d, "sine", r(700, 1400), r(1500, 2400), t + r(0, 2), 0.06, g * 0.18);
  },
  drum(ctx, d, t, g) {
    const pattern = [0, 0.32, 0.64, 0.8, 1.28, 1.6];
    pattern.forEach((offset, i) => {
      const accent = i % 3 === 0 ? 1 : 0.65;
      tone(ctx, d, "sine", 190, 70, t + offset, 0.28, g * accent, 0.004);
      noiseBurst(ctx, d, t + offset, 0.05, g * 0.35 * accent, "highpass", 1800, 1800, 0.5, 0.002);
    });
  },
  plane(ctx, d, t, g) {
    noiseBurst(ctx, d, t, 3.6, g * 0.8, "bandpass", 350, 1500, 1.2, 1.6, 0.4);
    tone(ctx, d, "sawtooth", 90, 150, t, 3.4, g * 0.25, 1.4);
  },
  helicopter(ctx, d, t, g) {
    for (let i = 0; i < 28; i++) noiseBurst(ctx, d, t + i * 0.095, 0.07, g * 0.7, "lowpass", 380, 380, 0.7, 0.01);
    tone(ctx, d, "sawtooth", 140, 160, t, 2.8, g * 0.07, 0.6);
  },
  boat(ctx, d, t, g) {
    tone(ctx, d, "sawtooth", 130, 126, t, 1.1, g * 0.35, 0.05);
    tone(ctx, d, "sawtooth", 165, 160, t, 1.1, g * 0.3, 0.05);
    noiseBurst(ctx, d, t + 0.4, 1.8, g * 0.35, "lowpass", 600, 900, 0.7, 0.5, 0.2);
  },
  horn(ctx, d, t, g) {
    tone(ctx, d, "sawtooth", 98, 96, t, 1.8, g * 0.5, 0.15);
    tone(ctx, d, "square", 147, 144, t, 1.8, g * 0.18, 0.15);
  },
  bell(ctx, d, t, g) {
    [[523, 1], [1177, 0.5], [1840, 0.3]].forEach(([f, a]) => tone(ctx, d, "sine", f, f, t, 2.6, g * 0.5 * a, 0.004));
  },
  guitar(ctx, d, t, g) {
    [196, 247, 294, 392, 294, 247].forEach((f, i) => {
      tone(ctx, d, "triangle", f, f * 0.995, t + i * 0.22, 0.9, g * 0.55, 0.004);
      tone(ctx, d, "sine", f * 2, f * 2, t + i * 0.22, 0.4, g * 0.18, 0.004);
    });
  },
  piano(ctx, d, t, g) {
    [262, 330, 392, 523].forEach((f, i) => {
      tone(ctx, d, "sine", f, f, t + i * 0.18, 1.3, g * 0.5, 0.006);
      tone(ctx, d, "sine", f * 2, f * 2, t + i * 0.18, 0.7, g * 0.14, 0.006);
    });
  },
  flute(ctx, d, t, g) {
    [523, 587, 659, 784].forEach((f, i) => {
      const osc = tone(ctx, d, "sine", f, f, t + i * 0.3, 0.45, g * 0.4, 0.06);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.5;
      lfoGain.gain.value = 5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t + i * 0.3);
      lfo.stop(t + i * 0.3 + 0.6);
    });
  },
  fire(ctx, d, t, g) {
    for (let i = 0; i < 14; i++) noiseBurst(ctx, d, t + r(0, 2), r(0.02, 0.07), g * r(0.25, 0.7), "highpass", r(1500, 3500), 2000, 0.8, 0.002);
    noiseBurst(ctx, d, t, 2.2, g * 0.18, "lowpass", 700, 500, 0.6, 0.3, 1.2);
  },
  chicken(ctx, d, t, g) {
    for (let i = 0; i < 4; i++) tone(ctx, d, "square", r(480, 560), r(300, 380), t + i * 0.16, 0.1, g * 0.28, 0.01);
  },
  goat(ctx, d, t, g) {
    const osc = tone(ctx, d, "sawtooth", 360, 300, t, 1.0, g * 0.35, 0.05);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 28;
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + 1.1);
  },
  horse(ctx, d, t, g) {
    const osc = tone(ctx, d, "sawtooth", 600, 1300, t, 0.5, g * 0.35, 0.04);
    osc.frequency.exponentialRampToValueAtTime(420, t + 1.1);
    tone(ctx, d, "sawtooth", 1300, 420, t + 0.5, 0.7, g * 0.3, 0.02);
  },
  duck(ctx, d, t, g) {
    for (let i = 0; i < 2; i++) tone(ctx, d, "square", 360, 280, t + i * 0.3, 0.16, g * 0.3, 0.01);
  },
  tractor(ctx, d, t, g) {
    for (let i = 0; i < 16; i++) tone(ctx, d, "square", 62, 50, t + i * 0.13, 0.1, g * 0.4, 0.005);
  },
  cannon(ctx, d, t, g) {
    tone(ctx, d, "sine", 120, 35, t, 1.1, g * 1.1, 0.003);
    noiseBurst(ctx, d, t, 1.2, g * 0.9, "lowpass", 900, 150, 0.7, 0.003);
  },
  crowd(ctx, d, t, g) {
    noiseBurst(ctx, d, t, 2.6, g * 0.6, "bandpass", 1100, 1500, 0.6, 0.6, 0.6);
    for (let i = 0; i < 12; i++) noiseBurst(ctx, d, t + r(0, 2.4), 0.05, g * 0.35, "highpass", 2200, 2200, 0.7, 0.002);
  },
  projector(ctx, d, t, g) {
    for (let i = 0; i < 30; i++) noiseBurst(ctx, d, t + i * 0.07, 0.03, g * 0.5, "bandpass", 1800, 1800, 3, 0.002);
  },
  shutter(ctx, d, t, g) {
    noiseBurst(ctx, d, t, 0.04, g * 0.9, "highpass", 2500, 2500, 0.8, 0.001);
    noiseBurst(ctx, d, t + 0.09, 0.05, g * 0.7, "bandpass", 1200, 1200, 1.5, 0.001);
  },
  popcorn(ctx, d, t, g) {
    for (let i = 0; i < 16; i++) noiseBurst(ctx, d, t + r(0, 2), 0.035, g * r(0.4, 0.9), "bandpass", r(900, 2000), 1200, 1.2, 0.001);
  },
  beep(ctx, d, t, g) {
    [880, 1320, 1100].forEach((f, i) => tone(ctx, d, "square", f, f, t + i * 0.13, 0.08, g * 0.13, 0.005));
  },
  typing(ctx, d, t, g) {
    for (let i = 0; i < 14; i++) noiseBurst(ctx, d, t + i * r(0.07, 0.13), 0.025, g * 0.55, "bandpass", r(2200, 3200), 2500, 2, 0.001);
  },
  drone(ctx, d, t, g) {
    const osc = tone(ctx, d, "sawtooth", 210, 250, t, 2.6, g * 0.14, 0.5);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 38;
    lfoGain.gain.value = 18;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + 3);
  },
  ping(ctx, d, t, g) {
    tone(ctx, d, "sine", 2300, 2300, t, 0.5, g * 0.3, 0.003);
    tone(ctx, d, "sine", 2300, 2300, t + 0.16, 0.5, g * 0.3, 0.003);
  },
  balloon(ctx, d, t, g) {
    for (let i = 0; i < 3; i++) noiseBurst(ctx, d, t + i * 0.7, 0.55, g * 0.55, "bandpass", 500, 800, 0.8, 0.1, 0.2);
  },
  bubbles(ctx, d, t, g) {
    for (let i = 0; i < 9; i++) tone(ctx, d, "sine", r(300, 600), r(700, 1300), t + r(0, 2.2), 0.09, g * 0.4, 0.005);
  },
  clink(ctx, d, t, g) {
    [0, 0.22, 0.4].forEach((o) => tone(ctx, d, "sine", r(2600, 3600), r(2600, 3600), t + o, 0.25, g * 0.3, 0.002));
  },
  page(ctx, d, t, g) {
    noiseBurst(ctx, d, t, 0.28, g * 0.5, "bandpass", 2500, 4200, 0.8, 0.05);
  },
  creak(ctx, d, t, g) {
    tone(ctx, d, "sawtooth", 180, 260, t, 0.9, g * 0.2, 0.1);
  },
  cricket(ctx, d, t, g) {
    for (let i = 0; i < 10; i++) tone(ctx, d, "sine", 4300, 4300, t + i * 0.09, 0.05, g * 0.3, 0.005);
  },
  chime(ctx, d, t, g) {
    [784, 1175, 1568].forEach((f, i) => tone(ctx, d, "sine", f, f, t + i * 0.12, 1.5, g * 0.3, 0.004));
  },
  step(ctx, d, t, g) {
    for (let i = 0; i < 4; i++) tone(ctx, d, "sine", 110, 60, t + i * 0.32, 0.12, g * 0.55, 0.004);
  },
  bounce(ctx, d, t, g) {
    [0, 0.34, 0.6, 0.8].forEach((o, i) => tone(ctx, d, "sine", 240, 90, t + o, 0.14, g * 0.55 * (1 - i * 0.18), 0.004));
  },
};

/** Toca um som no instante `when` (relógio do contexto de áudio). */
export function playSound(ctx: Ctx, dest: AudioNode, kind: SoundKind, when: number, gain: number) {
  SYNTH[kind](ctx, dest, when, gain);
}

// ───────────────────────── agendamento ao vivo ─────────────────────────

export interface LiveSoundscape {
  /** Agenda os sons que caem entre `fromTime` e `fromTime + lookahead` (segundos da narração). */
  tick(audioTime: number): void;
  /** Descarta o que estava agendado (pausa ou "pular" no tempo). */
  stop(): void;
  dispose(): void;
}

export function createLiveSoundscape(plan: SoundEvent[], masterVolume = 0.9): LiveSoundscape | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  let master = ctx.createGain();
  master.gain.value = masterVolume;
  master.connect(ctx.destination);
  let scheduledUntil = -1;
  let lastAudioTime = -1;
  const LOOKAHEAD = 1.2;

  return {
    tick(audioTime) {
      if (ctx.state === "suspended") void ctx.resume();
      // Se o tempo pulou (arrastar a barra), recomeça a partir do novo ponto.
      if (lastAudioTime < 0 || audioTime < lastAudioTime - 0.05 || audioTime - lastAudioTime > 1.5) {
        scheduledUntil = audioTime;
        this.stop();
      }
      lastAudioTime = audioTime;
      const to = audioTime + LOOKAHEAD;
      for (const event of plan) {
        if (event.t < scheduledUntil || event.t >= to) continue;
        playSound(ctx, master, event.kind, ctx.currentTime + Math.max(0, event.t - audioTime), event.gain);
      }
      scheduledUntil = Math.max(scheduledUntil, to);
    },
    stop() {
      const old = master;
      old.gain.cancelScheduledValues(ctx.currentTime);
      old.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
      window.setTimeout(() => old.disconnect(), 400);
      master = ctx.createGain();
      master.gain.value = masterVolume;
      master.connect(ctx.destination);
      scheduledUntil = -1;
      lastAudioTime = -1;
    },
    dispose() {
      void ctx.close().catch(() => undefined);
    },
  };
}

// ───────────────────────── mixagem no vídeo exportado ─────────────────────────

/**
 * Renderiza o plano de sons e SOMA no áudio da narração (alterado no lugar). Processa em trechos de 30 s para
 * não gastar memória com narrações longas.
 */
export async function mixSoundPlanInto(channels: Float32Array[], sampleRate: number, plan: SoundEvent[], masterVolume = 0.9) {
  if (typeof OfflineAudioContext === "undefined" || plan.length === 0 || channels.length === 0) return;
  const total = channels[0].length;
  const SEGMENT = 30;
  const HEAD = 4;
  const totalSeconds = total / sampleRate;
  for (let start = 0; start < totalSeconds; start += SEGMENT) {
    const segLen = Math.min(SEGMENT, totalSeconds - start);
    const windowStart = start - HEAD;
    const events = plan.filter((event) => event.t >= windowStart && event.t < start + segLen);
    if (events.length === 0) continue;
    const frames = Math.ceil((segLen + HEAD) * sampleRate);
    const ctx = new OfflineAudioContext(2, frames, sampleRate);
    const master = ctx.createGain();
    master.gain.value = masterVolume;
    master.connect(ctx.destination);
    for (const event of events) {
      const when = event.t - windowStart;
      if (when < 0) continue;
      playSound(ctx, master, event.kind, when, event.gain);
    }
    const rendered = await ctx.startRendering();
    const offset = Math.floor(start * sampleRate);
    const skip = Math.floor(HEAD * sampleRate);
    for (let channel = 0; channel < channels.length; channel++) {
      const source = rendered.getChannelData(Math.min(channel, rendered.numberOfChannels - 1));
      const target = channels[channel];
      for (let i = skip; i < source.length && offset + (i - skip) < target.length; i++) {
        const mixed = target[offset + (i - skip)] + source[i];
        target[offset + (i - skip)] = mixed > 1 ? 1 : mixed < -1 ? -1 : mixed;
      }
    }
  }
}
