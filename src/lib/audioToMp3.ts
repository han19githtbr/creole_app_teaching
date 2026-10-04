// Conversão de áudio/vídeo para MP3 inteiramente no navegador.
//
// O arquivo é decodificado pelo Web Audio (a trilha de áudio de um MP4, uma
// gravação do microfone, WebM, WAV etc.), convertido para mono e codificado em
// MP3 CBR. Nada é enviado ao servidor durante a conversão. Como o MP3 CBR tem
// duração confiável, ele também resolve o problema das gravações do
// MediaRecorder, que saem sem duração no cabeçalho.

export type Mp3Stage = "reading" | "decoding" | "encoding";

export interface ConvertToMp3Options {
  /** 0–1 dentro de cada etapa. */
  onProgress?: (stage: Mp3Stage, fraction: number) => void;
  /** Taxa de bits do MP3 (padrão 128 kbps, ≈ 1 MB por minuto). */
  bitrateKbps?: number;
}

export interface Mp3Result {
  blob: Blob;
  /** Duração real, calculada a partir das amostras codificadas. */
  duration: number;
  sampleRate: number;
}

// Taxas de amostragem que o codificador MPEG-1 aceita.
const SUPPORTED_RATES = [32000, 44100, 48000];
const BLOCK_SAMPLES = 1152 * 8;

type AudioContextConstructor = typeof AudioContext;

function getAudioContextConstructor(): AudioContextConstructor {
  const globalScope = window as unknown as { AudioContext?: AudioContextConstructor; webkitAudioContext?: AudioContextConstructor };
  const Constructor = globalScope.AudioContext ?? globalScope.webkitAudioContext;
  if (!Constructor) throw new Error("Este navegador não consegue decodificar áudio. Use uma versão atual do Chrome, Edge, Firefox ou Safari.");
  return Constructor;
}

const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function decode(context: AudioContext, data: ArrayBuffer): Promise<AudioBuffer> {
  // Safari antigo só aceita a versão com callbacks.
  return new Promise((resolve, reject) => {
    const result = context.decodeAudioData(data, resolve, reject);
    if (result && typeof result.then === "function") result.then(resolve, reject);
  });
}

/** Decodifica qualquer arquivo de áudio/vídeo que o navegador entenda. */
export async function decodeAudioFile(source: Blob): Promise<AudioBuffer> {
  const Constructor = getAudioContextConstructor();
  // 32 kHz basta para voz e reduz pela metade o uso de memória em relação a 48 kHz.
  let context: AudioContext;
  try {
    context = new Constructor({ sampleRate: 32000 });
  } catch {
    context = new Constructor();
  }
  try {
    const data = await source.arrayBuffer();
    return await decode(context, data);
  } catch (error) {
    if (error instanceof RangeError) throw new Error("O arquivo é grande demais para ser convertido neste navegador.");
    throw new Error("Não foi possível ler o áudio deste arquivo. Se for um MP4, confirme que ele tem trilha de áudio e tente no Chrome ou no Edge.");
  } finally {
    void context.close().catch(() => undefined);
  }
}

async function resampleTo(buffer: AudioBuffer, targetRate: number): Promise<AudioBuffer> {
  const length = Math.ceil(buffer.duration * targetRate);
  const offline = new OfflineAudioContext(buffer.numberOfChannels, length, targetRate);
  const node = offline.createBufferSource();
  node.buffer = buffer;
  node.connect(offline.destination);
  node.start();
  return offline.startRendering();
}

function toMonoInt16(buffer: AudioBuffer): Int16Array {
  const { numberOfChannels, length } = buffer;
  const channels = Array.from({ length: numberOfChannels }, (_, index) => buffer.getChannelData(index));
  const output = new Int16Array(length);
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let c = 0; c < numberOfChannels; c++) sum += channels[c][i];
    const sample = Math.max(-1, Math.min(1, sum / numberOfChannels));
    output[i] = sample < 0 ? Math.round(sample * 32768) : Math.round(sample * 32767);
  }
  return output;
}

/** Converte áudio ou vídeo (MP4, M4A, WebM, WAV, OGG...) em MP3 mono. */
export async function convertToMp3(source: Blob, options: ConvertToMp3Options = {}): Promise<Mp3Result> {
  const { onProgress, bitrateKbps = 128 } = options;
  onProgress?.("decoding", 0);
  let buffer = await decodeAudioFile(source);
  onProgress?.("decoding", 1);

  if (!SUPPORTED_RATES.includes(buffer.sampleRate)) buffer = await resampleTo(buffer, 44100);
  const sampleRate = buffer.sampleRate;
  const samples = toMonoInt16(buffer);
  if (!samples.length) throw new Error("O arquivo não contém áudio.");

  const { Mp3Encoder } = await import("@breezystack/lamejs");
  const encoder = new Mp3Encoder(1, sampleRate, bitrateKbps);
  const parts: Uint8Array<ArrayBuffer>[] = [];
  for (let offset = 0; offset < samples.length; offset += BLOCK_SAMPLES) {
    const encoded = encoder.encodeBuffer(samples.subarray(offset, offset + BLOCK_SAMPLES));
    if (encoded.length) parts.push(new Uint8Array(encoded));
    // Devolve o controle ao navegador de tempos em tempos para a tela não congelar.
    if ((offset / BLOCK_SAMPLES) % 40 === 0) {
      onProgress?.("encoding", offset / samples.length);
      await nextTick();
    }
  }
  const tail = encoder.flush();
  if (tail.length) parts.push(new Uint8Array(tail));
  onProgress?.("encoding", 1);

  return {
    blob: new Blob(parts, { type: "audio/mpeg" }),
    duration: samples.length / sampleRate,
    sampleRate,
  };
}

/**
 * Duração de um arquivo de áudio. Arquivos gravados por MediaRecorder (WebM)
 * chegam com duração "Infinity"; nesse caso a duração vem da decodificação.
 */
export async function readAudioDuration(source: Blob): Promise<number> {
  const fromMetadata = await new Promise<number>((resolve) => {
    const url = URL.createObjectURL(source);
    const audio = new Audio();
    const finish = (value: number) => {
      audio.removeAttribute("src");
      URL.revokeObjectURL(url);
      resolve(value);
    };
    audio.preload = "metadata";
    audio.onloadedmetadata = () => finish(audio.duration);
    audio.onerror = () => finish(Number.NaN);
    audio.src = url;
  });
  if (Number.isFinite(fromMetadata) && fromMetadata > 0) return fromMetadata;
  return (await decodeAudioFile(source)).duration;
}

/** Duração de um vídeo/áudio lida só dos metadados (rápido, sem decodificar). Devolve NaN se indisponível. */
export function readMediaMetadataDuration(source: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(source);
    const media = document.createElement("video");
    const finish = (value: number) => {
      media.removeAttribute("src");
      URL.revokeObjectURL(url);
      resolve(value);
    };
    media.preload = "metadata";
    media.onloadedmetadata = () => finish(media.duration);
    media.onerror = () => finish(Number.NaN);
    media.src = url;
  });
}
