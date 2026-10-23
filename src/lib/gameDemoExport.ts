/**
 * Exporta o vídeo demonstrativo do jogo em MP4 (H.264 + AAC) para Instagram e Facebook.
 *
 * Caminho principal: renderiza quadro a quadro (sem depender da velocidade do
 * computador, sem quadros perdidos) e codifica com WebCodecs em alto bitrate.
 * Se o navegador não tiver WebCodecs, grava em tempo real com MediaRecorder.
 */
import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import {
  DEMO_FORMATS,
  renderDemoFrame,
  synthDemoAudio,
  type DemoImages,
  type DemoPlan,
} from "@/lib/gameDemoVideo";
import { loadDemoPronunciations } from "@/lib/gameDemoAudio";

export type DemoQuality = "max" | "high";

export const DEMO_QUALITY: Record<DemoQuality, { label: string; bitrate: number }> = {
  max: { label: "Máxima · 16 Mbps (recomendada)", bitrate: 16_000_000 },
  high: { label: "Alta · 10 Mbps (arquivo menor)", bitrate: 10_000_000 },
};

export interface ExportParams {
  plan: DemoPlan;
  images: DemoImages;
  quality: DemoQuality;
  pronunciations?: Map<string, Float32Array>;
  onProgress: (percent: number) => void;
  signal?: AbortSignal;
}

export interface ExportResult {
  blob: Blob;
  extension: "mp4" | "webm";
  hasAudio: boolean;
  method: "offline" | "realtime";
  width: number;
  height: number;
}

const FPS = 30;
const SAMPLE_RATE = 48000;

function abortIfNeeded(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Exportação cancelada.", "AbortError");
}

function makeCanvas(plan: DemoPlan) {
  const spec = DEMO_FORMATS[plan.settings.format];
  const canvas = document.createElement("canvas");
  canvas.width = spec.w;
  canvas.height = spec.h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Não foi possível preparar o desenho do vídeo.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx, spec };
}

export async function exportDemoVideo(params: ExportParams): Promise<ExportResult> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* segue com as fontes disponíveis */
    }
  }
  if (params.plan.settings.sound && !params.pronunciations) {
    try {
      params.pronunciations = await loadDemoPronunciations(params.plan.rounds, SAMPLE_RATE, params.signal);
    } catch {
      /* segue com os efeitos sonoros se a rede falhar */
    }
  }
  const offline = await exportOffline(params);
  if (offline) return offline;
  return exportRealtime(params);
}

async function exportOffline(params: ExportParams): Promise<ExportResult | null> {
  const { plan, images, quality, onProgress, signal } = params;
  if (
    typeof VideoEncoder === "undefined" ||
    typeof VideoFrame === "undefined" ||
    typeof Muxer === "undefined"
  ) {
    return null;
  }

  const { canvas, ctx, spec } = makeCanvas(plan);

  let videoConfig: VideoEncoderConfig | null = null;
  for (const codec of ["avc1.64002A", "avc1.4D002A", "avc1.42002A"]) {
    const candidate: VideoEncoderConfig = {
      codec,
      width: spec.w,
      height: spec.h,
      bitrate: DEMO_QUALITY[quality].bitrate,
      framerate: FPS,
      latencyMode: "quality",
      avc: { format: "avc" },
    };
    try {
      if ((await VideoEncoder.isConfigSupported(candidate)).supported) {
        videoConfig = candidate;
        break;
      }
    } catch {
      /* tenta o próximo perfil */
    }
  }
  if (!videoConfig) return null;

  // Áudio é opcional: sem AAC o vídeo sai igual, só que mudo.
  let withAudio = false;
  if (
    plan.settings.sound &&
    typeof AudioEncoder !== "undefined" &&
    typeof AudioData !== "undefined"
  ) {
    try {
      withAudio = Boolean(
        (
          await AudioEncoder.isConfigSupported({
            codec: "mp4a.40.2",
            sampleRate: SAMPLE_RATE,
            numberOfChannels: 2,
            bitrate: 192_000,
          })
        ).supported
      );
    } catch {
      withAudio = false;
    }
  }

  const channelData = withAudio ? synthDemoAudio(plan, SAMPLE_RATE, params.pronunciations) : [];
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: { codec: "avc", width: spec.w, height: spec.h, frameRate: FPS },
    ...(withAudio ? { audio: { codec: "aac" as const, numberOfChannels: 2, sampleRate: SAMPLE_RATE } } : {}),
    fastStart: "in-memory",
  });

  let encoderError: Error | null = null;
  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (error) => {
      encoderError = error;
    },
  });
  const audioEncoder = withAudio
    ? new AudioEncoder({
        output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
        error: (error) => {
          encoderError = error;
        },
      })
    : null;

  try {
    videoEncoder.configure(videoConfig);
    audioEncoder?.configure({ codec: "mp4a.40.2", sampleRate: SAMPLE_RATE, numberOfChannels: 2, bitrate: 192_000 });

    let audioOffset = 0;
    const audioLength = channelData[0]?.length ?? 0;
    const feedAudioUntil = (seconds: number) => {
      if (!audioEncoder) return;
      const limit = Math.min(audioLength, Math.floor(seconds * SAMPLE_RATE));
      while (audioOffset < limit) {
        const frames = Math.min(4800, audioLength - audioOffset);
        const planar = new Float32Array(frames * 2);
        channelData.forEach((data, channel) => planar.set(data.subarray(audioOffset, audioOffset + frames), channel * frames));
        const chunk = new AudioData({
          format: "f32-planar",
          sampleRate: SAMPLE_RATE,
          numberOfFrames: frames,
          numberOfChannels: 2,
          timestamp: Math.round((audioOffset / SAMPLE_RATE) * 1e6),
          data: planar,
        });
        audioEncoder.encode(chunk);
        chunk.close();
        audioOffset += frames;
      }
    };

    const totalFrames = Math.max(1, Math.ceil(plan.total * FPS));
    for (let index = 0; index < totalFrames; index++) {
      abortIfNeeded(signal);
      if (encoderError) throw encoderError;
      const seconds = Math.min(index / FPS, plan.total - 0.001);
      renderDemoFrame(ctx, spec.w, spec.h, seconds, plan, { images });

      const frame = new VideoFrame(canvas, {
        timestamp: Math.round((index * 1e6) / FPS),
        duration: Math.round(1e6 / FPS),
      });
      videoEncoder.encode(frame, { keyFrame: index % (FPS * 2) === 0 });
      frame.close();
      feedAudioUntil(seconds + 0.5);

      while (videoEncoder.encodeQueueSize > 6) {
        await new Promise<void>((resolve) => videoEncoder.addEventListener("dequeue", () => resolve(), { once: true }));
        if (encoderError) throw encoderError;
      }
      if (index % 5 === 0) {
        onProgress(Math.min(99, Math.round((index / totalFrames) * 100)));
        // devolve o controle ao navegador para a barra de progresso atualizar
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }

    feedAudioUntil(Number.POSITIVE_INFINITY);
    await videoEncoder.flush();
    if (audioEncoder) await audioEncoder.flush();
    if (encoderError) throw encoderError;
    muxer.finalize();
    onProgress(100);
    return {
      blob: new Blob([target.buffer], { type: "video/mp4" }),
      extension: "mp4",
      hasAudio: withAudio,
      method: "offline",
      width: spec.w,
      height: spec.h,
    };
  } finally {
    if (videoEncoder.state !== "closed") videoEncoder.close();
    if (audioEncoder && audioEncoder.state !== "closed") audioEncoder.close();
  }
}

const MIME_CANDIDATES: { mime: string; ext: "mp4" | "webm" }[] = [
  { mime: "video/mp4;codecs=avc1.640028,mp4a.40.2", ext: "mp4" },
  { mime: "video/mp4;codecs=avc1.4D4028,mp4a.40.2", ext: "mp4" },
  { mime: "video/mp4", ext: "mp4" },
  { mime: "video/webm;codecs=vp9,opus", ext: "webm" },
  { mime: "video/webm", ext: "webm" },
];

/** Plano B: grava o canvas em tempo real (precisa deixar a aba aberta até o fim). */
async function exportRealtime(params: ExportParams): Promise<ExportResult> {
  const { plan, images, quality, onProgress, signal } = params;
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Este navegador não consegue gravar vídeo. Use o Google Chrome ou o Edge no computador.");
  }
  const { canvas, ctx, spec } = makeCanvas(plan);
  const choice = MIME_CANDIDATES.find((c) => MediaRecorder.isTypeSupported(c.mime));
  const stream = canvas.captureStream(FPS);

  let audioCtx: AudioContext | null = null;
  let source: AudioBufferSourceNode | null = null;
  let hasAudio = false;
  if (plan.settings.sound && typeof AudioContext !== "undefined") {
    try {
      audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
      const pcm = synthDemoAudio(plan, SAMPLE_RATE, params.pronunciations);
      const buffer = audioCtx.createBuffer(2, pcm[0].length, SAMPLE_RATE);
      pcm.forEach((data, channel) => buffer.copyToChannel(new Float32Array(data), channel));
      const destination = audioCtx.createMediaStreamDestination();
      source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(destination);
      destination.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
      hasAudio = true;
    } catch {
      hasAudio = false;
    }
  }

  const recorder = new MediaRecorder(stream, {
    ...(choice ? { mimeType: choice.mime } : {}),
    videoBitsPerSecond: DEMO_QUALITY[quality].bitrate,
    audioBitsPerSecond: 192_000,
  });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  renderDemoFrame(ctx, spec.w, spec.h, 0, plan, { images });
  recorder.start(250);
  source?.start();
  const startedAt = performance.now();

  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = (performance.now() - startedAt) / 1000;
      if (signal?.aborted || t >= plan.total) {
        renderDemoFrame(ctx, spec.w, spec.h, Math.min(t, plan.total - 0.001), plan, { images });
        resolve();
        return;
      }
      renderDemoFrame(ctx, spec.w, spec.h, t, plan, { images });
      onProgress(Math.min(99, Math.round((t / plan.total) * 100)));
      requestAnimationFrame(tick);
    };
    tick();
  });

  recorder.stop();
  await stopped;
  stream.getTracks().forEach((track) => track.stop());
  void audioCtx?.close();
  abortIfNeeded(signal);
  onProgress(100);

  const type = recorder.mimeType || choice?.mime || "video/webm";
  return {
    blob: new Blob(chunks, { type }),
    extension: type.includes("mp4") ? "mp4" : "webm",
    hasAudio,
    method: "realtime",
    width: spec.w,
    height: spec.h,
  };
}
