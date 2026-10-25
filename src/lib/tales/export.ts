/**
 * Exporta um conto em MP4 vertical 1080×1920 (H.264 + AAC) para Reels, Stories e Facebook.
 * Principal: quadro a quadro com WebCodecs. Plano B: gravação em tempo real (MediaRecorder).
 */
import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import { STAGE_H, STAGE_W } from "./scene";
import { renderTaleFrame } from "./render";
import { TALE_SAMPLE_RATE, mixTaleAudio, type TaleNarration } from "./audio";
import type { TalePlan } from "./timeline";

export type TaleQuality = "max" | "high";

export const TALE_QUALITY: Record<TaleQuality, { label: string; bitrate: number }> = {
  max: { label: "Máxima · 16 Mbps (recomendada)", bitrate: 16_000_000 },
  high: { label: "Alta · 10 Mbps (arquivo menor)", bitrate: 10_000_000 },
};

export interface TaleExportParams {
  plan: TalePlan;
  narration: TaleNarration;
  music: boolean;
  showPt: boolean;
  quality: TaleQuality;
  onProgress: (percent: number) => void;
  signal?: AbortSignal;
}

export interface TaleExportResult {
  blob: Blob;
  extension: "mp4" | "webm";
  hasAudio: boolean;
  method: "offline" | "realtime";
  width: number;
  height: number;
}

const FPS = 30;

function abortIfNeeded(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Exportação cancelada.", "AbortError");
}

function makeCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = STAGE_W;
  canvas.height = STAGE_H;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Não foi possível preparar o desenho do vídeo.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

export async function exportTale(params: TaleExportParams): Promise<TaleExportResult> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* segue */
    }
  }
  return (await exportOffline(params)) ?? exportRealtime(params);
}

async function exportOffline(params: TaleExportParams): Promise<TaleExportResult | null> {
  const { plan, narration, music, showPt, quality, onProgress, signal } = params;
  if (typeof VideoEncoder === "undefined" || typeof VideoFrame === "undefined") return null;

  let videoConfig: VideoEncoderConfig | null = null;
  for (const codec of ["avc1.64002A", "avc1.4D002A", "avc1.42002A"]) {
    const candidate: VideoEncoderConfig = {
      codec,
      width: STAGE_W,
      height: STAGE_H,
      bitrate: TALE_QUALITY[quality].bitrate,
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
      /* próximo perfil */
    }
  }
  if (!videoConfig) return null;

  const wantsAudio = narration.size > 0 || music;
  let withAudio = false;
  if (wantsAudio && typeof AudioEncoder !== "undefined" && typeof AudioData !== "undefined") {
    try {
      withAudio = Boolean(
        (await AudioEncoder.isConfigSupported({ codec: "mp4a.40.2", sampleRate: TALE_SAMPLE_RATE, numberOfChannels: 2, bitrate: 192_000 })).supported
      );
    } catch {
      withAudio = false;
    }
  }

  const { canvas, ctx } = makeCanvas();
  const channels = withAudio ? mixTaleAudio(plan, narration, { music }) : [];
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: { codec: "avc", width: STAGE_W, height: STAGE_H, frameRate: FPS },
    ...(withAudio ? { audio: { codec: "aac" as const, numberOfChannels: 2, sampleRate: TALE_SAMPLE_RATE } } : {}),
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
    audioEncoder?.configure({ codec: "mp4a.40.2", sampleRate: TALE_SAMPLE_RATE, numberOfChannels: 2, bitrate: 192_000 });

    let audioOffset = 0;
    const audioLength = channels[0]?.length ?? 0;
    const feedAudioUntil = (seconds: number) => {
      if (!audioEncoder) return;
      const limit = Math.min(audioLength, Math.floor(seconds * TALE_SAMPLE_RATE));
      while (audioOffset < limit) {
        const frames = Math.min(4800, audioLength - audioOffset);
        const planar = new Float32Array(frames * 2);
        channels.forEach((data, c) => planar.set(data.subarray(audioOffset, audioOffset + frames), c * frames));
        const chunk = new AudioData({
          format: "f32-planar",
          sampleRate: TALE_SAMPLE_RATE,
          numberOfFrames: frames,
          numberOfChannels: 2,
          timestamp: Math.round((audioOffset / TALE_SAMPLE_RATE) * 1e6),
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
      renderTaleFrame(ctx, STAGE_W, STAGE_H, seconds, plan, { showPt });
      const frame = new VideoFrame(canvas, { timestamp: Math.round((index * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      videoEncoder.encode(frame, { keyFrame: index % (FPS * 2) === 0 });
      frame.close();
      feedAudioUntil(seconds + 0.5);

      while (videoEncoder.encodeQueueSize > 6) {
        await new Promise<void>((resolve) => videoEncoder.addEventListener("dequeue", () => resolve(), { once: true }));
        if (encoderError) throw encoderError;
      }
      if (index % 5 === 0) {
        onProgress(Math.min(99, Math.round((index / totalFrames) * 100)));
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }

    feedAudioUntil(Number.POSITIVE_INFINITY);
    await videoEncoder.flush();
    if (audioEncoder) await audioEncoder.flush();
    if (encoderError) throw encoderError;
    muxer.finalize();
    onProgress(100);
    return { blob: new Blob([target.buffer], { type: "video/mp4" }), extension: "mp4", hasAudio: withAudio, method: "offline", width: STAGE_W, height: STAGE_H };
  } finally {
    if (videoEncoder.state !== "closed") videoEncoder.close();
    if (audioEncoder && audioEncoder.state !== "closed") audioEncoder.close();
  }
}

const MIME_CANDIDATES: { mime: string; ext: "mp4" | "webm" }[] = [
  { mime: "video/mp4;codecs=avc1.640028,mp4a.40.2", ext: "mp4" },
  { mime: "video/mp4", ext: "mp4" },
  { mime: "video/webm;codecs=vp9,opus", ext: "webm" },
  { mime: "video/webm", ext: "webm" },
];

async function exportRealtime(params: TaleExportParams): Promise<TaleExportResult> {
  const { plan, narration, music, showPt, quality, onProgress, signal } = params;
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Este navegador não consegue gravar vídeo. Use o Google Chrome ou o Edge no computador.");
  }
  const { canvas, ctx } = makeCanvas();
  const choice = MIME_CANDIDATES.find((c) => MediaRecorder.isTypeSupported(c.mime));
  const stream = canvas.captureStream(FPS);

  let audioCtx: AudioContext | null = null;
  let source: AudioBufferSourceNode | null = null;
  let hasAudio = false;
  if ((narration.size > 0 || music) && typeof AudioContext !== "undefined") {
    try {
      audioCtx = new AudioContext({ sampleRate: TALE_SAMPLE_RATE });
      const pcm = mixTaleAudio(plan, narration, { music });
      const buffer = audioCtx.createBuffer(2, pcm[0].length, TALE_SAMPLE_RATE);
      pcm.forEach((data, c) => buffer.copyToChannel(new Float32Array(data), c));
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
    videoBitsPerSecond: TALE_QUALITY[quality].bitrate,
    audioBitsPerSecond: 192_000,
  });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  renderTaleFrame(ctx, STAGE_W, STAGE_H, 0, plan, { showPt });
  recorder.start(250);
  source?.start();
  const startedAt = performance.now();
  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = (performance.now() - startedAt) / 1000;
      if (signal?.aborted || t >= plan.total) {
        renderTaleFrame(ctx, STAGE_W, STAGE_H, Math.min(t, plan.total - 0.001), plan, { showPt });
        resolve();
        return;
      }
      renderTaleFrame(ctx, STAGE_W, STAGE_H, t, plan, { showPt });
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
  return { blob: new Blob(chunks, { type }), extension: type.includes("mp4") ? "mp4" : "webm", hasAudio, method: "realtime", width: STAGE_W, height: STAGE_H };
}
