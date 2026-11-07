import { ArrayBufferTarget, Muxer } from "mp4-muxer";
import type { TrailDemoPlan } from "@/lib/curiousTrailDemoVideo";
import type { TrailObjectImages } from "@/lib/curiousTrailObjectImages";
import { trailLevelForTime, trailMapHeight, renderTrailDemoFrame } from "@/lib/curiousTrailDemoVideo";
import { TrailVideoWorld, type TrailVideoAssets } from "@/lib/trailVideoWorld";

const SAMPLE_RATE = 48_000;

export interface TrailDemoSoundBuffers {
  forest: AudioBuffer;
  stream: AudioBuffer;
  rain: AudioBuffer;
  voices: Map<string, AudioBuffer>;
}

export interface TrailOfflineExport {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Renderiza os quadros com tempos fixos e os codifica em H.264/AAC. O vídeo final não depende da
 * velocidade de desenho do aparelho, evitando quadros repetidos ou perdidos em sequências longas.
 */
export async function exportTrailDemoOffline(params: {
  plan: TrailDemoPlan;
  images: TrailObjectImages;
  sceneImages: TrailObjectImages;
  assets: TrailVideoAssets;
  sounds: TrailDemoSoundBuffers;
  width: number;
  height: number;
  scale: number;
  fps: number;
  bitrate: number;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
}): Promise<TrailOfflineExport | null> {
  if (
    typeof VideoEncoder === "undefined" ||
    typeof VideoFrame === "undefined" ||
    typeof AudioEncoder === "undefined" ||
    typeof AudioData === "undefined" ||
    typeof OfflineAudioContext === "undefined"
  ) return null;

  const videoConfig: VideoEncoderConfig = {
    codec: "avc1.42E028",
    width: params.width,
    height: params.height,
    bitrate: params.bitrate,
    framerate: params.fps,
    latencyMode: "quality",
    avc: { format: "avc" },
  };
  try {
    if (!(await VideoEncoder.isConfigSupported(videoConfig)).supported) return null;
    if (!(await AudioEncoder.isConfigSupported({ codec: "mp4a.40.2", sampleRate: SAMPLE_RATE, numberOfChannels: 2, bitrate: 128_000 })).supported) return null;
  } catch {
    return null;
  }

  if (params.signal.aborted) throw new DOMException("Exportação cancelada.", "AbortError");

  const spec = { w: Math.round(params.width / params.scale), h: Math.round(params.height / params.scale) };
  const canvas = document.createElement("canvas");
  canvas.width = params.width;
  canvas.height = params.height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Não foi possível preparar os quadros do vídeo.");
  if (params.scale < 1) ctx.setTransform(params.scale, 0, 0, params.scale, 0, 0);

  const audioLength = Math.ceil(params.plan.total * SAMPLE_RATE);
  const offlineAudio = new OfflineAudioContext(2, audioLength, SAMPLE_RATE);
  const master = offlineAudio.createGain();
  master.gain.value = 0.38;
  master.connect(offlineAudio.destination);
  const addLoop = (buffer: AudioBuffer, volume: number) => {
    const source = offlineAudio.createBufferSource();
    const gain = offlineAudio.createGain();
    source.buffer = buffer;
    source.loop = true;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(master);
    source.start(0);
    source.stop(params.plan.total);
    return gain;
  };
  const forestGain = addLoop(params.sounds.forest, 0.26);
  const streamGain = addLoop(params.sounds.stream, 0.16);
  const rainGain = addLoop(params.sounds.rain, 0);
  for (const round of params.plan.rounds) {
    const at = round.start;
    rainGain.gain.setTargetAtTime(round.levelCfg.weather === "rain" ? 0.2 : 0, at, 0.45);
    forestGain.gain.setTargetAtTime(round.levelCfg.weather === "night" ? 0.2 : 0.26, at, 0.55);
    streamGain.gain.setTargetAtTime(round.levelCfg.weather === "night" ? 0.14 : 0.16, at, 0.55);
    const voice = params.sounds.voices.get(round.item.speak.trim());
    if (voice) {
      const source = offlineAudio.createBufferSource();
      const gain = offlineAudio.createGain();
      source.buffer = voice;
      gain.gain.value = 0.9;
      source.connect(gain);
      gain.connect(master);
      source.start(round.correctAt);
    }
  }
  const mixedAudio = await offlineAudio.startRendering();
  const channelData = [mixedAudio.getChannelData(0), mixedAudio.getChannelData(1)];

  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: { codec: "avc", width: params.width, height: params.height, frameRate: params.fps },
    audio: { codec: "aac", numberOfChannels: 2, sampleRate: SAMPLE_RATE },
    fastStart: "in-memory",
  });
  let encoderError: Error | null = null;
  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (error) => { encoderError = error; },
  });
  const audioEncoder = new AudioEncoder({
    output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
    error: (error) => { encoderError = error; },
  });
  const world = new TrailVideoWorld(params.plan, params.assets.fauna);
  let audioOffset = 0;
  const feedAudioUntil = (seconds: number) => {
    const limit = Math.min(audioLength, Math.floor(seconds * SAMPLE_RATE));
    while (audioOffset < limit) {
      const frames = Math.min(4_800, audioLength - audioOffset);
      const planar = new Float32Array(frames * 2);
      planar.set(channelData[0].subarray(audioOffset, audioOffset + frames), 0);
      planar.set(channelData[1].subarray(audioOffset, audioOffset + frames), frames);
      const audioData = new AudioData({
        format: "f32-planar",
        sampleRate: SAMPLE_RATE,
        numberOfFrames: frames,
        numberOfChannels: 2,
        timestamp: Math.round((audioOffset / SAMPLE_RATE) * 1e6),
        data: planar,
      });
      audioEncoder.encode(audioData);
      audioData.close();
      audioOffset += frames;
    }
  };

  try {
    videoEncoder.configure(videoConfig);
    audioEncoder.configure({ codec: "mp4a.40.2", sampleRate: SAMPLE_RATE, numberOfChannels: 2, bitrate: 128_000 });
    const totalFrames = Math.max(1, Math.ceil(params.plan.total * params.fps));
    for (let index = 0; index < totalFrames; index++) {
      if (params.signal.aborted) throw new DOMException("Exportação cancelada.", "AbortError");
      if (encoderError) throw encoderError;
      const time = Math.min(index / params.fps, params.plan.total - 0.001);
      const dyn = await world.avalancheImage(time, spec.w, trailMapHeight(spec.h));
      renderTrailDemoFrame(ctx, spec.w, spec.h, time, params.plan, {
        images: params.images,
        sceneImages: params.sceneImages,
        scene: params.assets.scenes[trailLevelForTime(params.plan, time).weather],
        world,
        dyn,
      });
      const frame = new VideoFrame(canvas, {
        timestamp: Math.round((index * 1e6) / params.fps),
        duration: Math.round(1e6 / params.fps),
      });
      videoEncoder.encode(frame, { keyFrame: index % (params.fps * 2) === 0 });
      frame.close();
      feedAudioUntil(time + 0.5);

      while (videoEncoder.encodeQueueSize > 6 || audioEncoder.encodeQueueSize > 12) {
        await new Promise<void>((resolve) => {
          const encoder = videoEncoder.encodeQueueSize > 6 ? videoEncoder : audioEncoder;
          encoder.addEventListener("dequeue", () => resolve(), { once: true });
          // A small timer avoids waiting forever if the queue drains just before the listener attaches.
          setTimeout(resolve, 40);
        });
        if (encoderError) throw encoderError;
      }
      if (index % 5 === 0) {
        params.onProgress(Math.min(99, Math.round((index / totalFrames) * 100)));
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }
    feedAudioUntil(Number.POSITIVE_INFINITY);
    await videoEncoder.flush();
    await audioEncoder.flush();
    if (encoderError) throw encoderError;
    muxer.finalize();
    params.onProgress(100);
    return { blob: new Blob([target.buffer], { type: "video/mp4" }), width: params.width, height: params.height };
  } finally {
    if (videoEncoder.state !== "closed") videoEncoder.close();
    if (audioEncoder.state !== "closed") audioEncoder.close();
  }
}
