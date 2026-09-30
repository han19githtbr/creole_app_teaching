// Processador de vídeo para o LiveKit: aplica o fundo virtual (estilo Meet)
// na câmera do professor ANTES de publicar, então todos os alunos veem o fundo
// escolhido. Implementa a interface TrackProcessor do livekit-client.

import type { Room, Track, TrackProcessor, VideoProcessorOptions } from "livekit-client";
import {
  PersonSegmenter,
  createScratch,
  drawVirtualBackground,
  preloadBankImages,
  type VirtualBgScratch,
} from "@/lib/virtualBackground";

export class LiveBackgroundProcessor implements TrackProcessor<Track.Kind.Video, VideoProcessorOptions> {
  name = "kreyol-virtual-background";
  processedTrack?: MediaStreamTrack;

  private bgId: string;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private scratch: VirtualBgScratch | null = null;
  private segmenter: PersonSegmenter | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(initialBg: string) {
    this.bgId = initialBg;
  }

  setBackground(id: string) {
    this.bgId = id;
  }

  async init(opts: VideoProcessorOptions) {
    await this.start(opts.track);
  }

  async restart(opts: VideoProcessorOptions) {
    await this.teardown();
    await this.start(opts.track);
  }

  async destroy() {
    await this.teardown();
  }

  async onPublish(_room: Room) {
    // Sem ações extras ao publicar.
    void _room;
  }

  async onUnpublish() {}

  private async start(track: MediaStreamTrack) {
    preloadBankImages();
    const settings = track.getSettings();
    const width = settings.width || 1280;
    const height = settings.height || 720;

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.srcObject = new MediaStream([track]);
    await video.play().catch(() => {});
    this.video = video;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scratch = createScratch();

    const segmenter = new PersonSegmenter();
    this.segmenter = segmenter;
    segmenter.init().catch((e) => {
      // Sem o modelo o vídeo segue normal (câmera crua) em vez de travar a aula.
      console.warn("Fundo virtual indisponível:", e);
    });

    this.processedTrack = canvas.captureStream(30).getVideoTracks()[0];
    this.running = true;
    // setInterval (e não requestAnimationFrame) para continuar publicando
    // quando a aba do professor não está em primeiro plano.
    this.timer = setInterval(() => this.tick(), 1000 / 30);
  }

  private async tick() {
    if (!this.running || !this.ctx || !this.canvas || !this.video || !this.scratch) return;
    const seg = this.segmenter;
    if (seg) void seg.update(this.video);
    drawVirtualBackground(
      this.ctx,
      this.video,
      seg?.ready ? seg.mask : null,
      this.bgId,
      this.scratch,
      this.canvas.width,
      this.canvas.height,
      Date.now()
    );
  }

  private async teardown() {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.segmenter?.close();
    this.segmenter = null;
    this.processedTrack?.stop();
    this.processedTrack = undefined;
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
    }
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.scratch = null;
  }
}
