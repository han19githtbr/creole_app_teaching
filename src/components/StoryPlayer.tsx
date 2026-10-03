"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { Download, Languages, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { IVideoStoryCaption } from "@/models/VideoLesson";
import { getBankImage } from "@/lib/imageBank";

export interface StoryPlayerData {
  title: string;
  imageSrc: string;
  theme: string;
  audioUrl: string;
  captions: IVideoStoryCaption[];
}

const STORY_DURATION = 300;
const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

export function StoryPlayer({ story }: { story: StoryPlayerData }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [language, setLanguage] = useState<"both" | "pt" | "ht">("both");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const activeCaption = story.captions.find((caption) => currentTime >= caption.start && currentTime < caption.end);
  const sceneElements = getBankImage(story.imageSrc)?.elements ?? [];
  const progress = Math.min(100, (currentTime / STORY_DURATION) * 100);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.currentTime >= STORY_DURATION) {
        audio.pause();
        audio.currentTime = STORY_DURATION;
        setPlaying(false);
      }
      setCurrentTime(Math.min(audio.currentTime, STORY_DURATION));
    };
    const ended = () => { setPlaying(false); setCurrentTime(0); };
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
    };
  }, []);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      if (audio.currentTime >= STORY_DURATION) audio.currentTime = 0;
      await audio.play();
      setPlaying(true);
    } catch {
      setExportError("Não foi possível reproduzir a narração. Verifique o áudio e tente novamente.");
    }
  }

  function drawExportFrame(context: CanvasRenderingContext2D, image: HTMLImageElement, seconds: number) {
    context.clearRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    context.fillStyle = "#172821";
    context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    const backgroundScale = Math.max(EXPORT_WIDTH / image.width, EXPORT_HEIGHT / image.height);
    const backgroundWidth = image.width * backgroundScale;
    const backgroundHeight = image.height * backgroundScale;
    context.save();
    context.filter = "blur(28px) brightness(.42)";
    context.drawImage(image, (EXPORT_WIDTH - backgroundWidth) / 2, (EXPORT_HEIGHT - backgroundHeight) / 2, backgroundWidth, backgroundHeight);
    context.restore();
    const scale = Math.min((EXPORT_WIDTH - 88) / image.width, 760 / image.height) * (1.01 + (seconds % 300) / 300 * 0.035);
    const width = image.width * scale;
    const height = image.height * scale;
    const driftX = Math.sin(seconds * 0.12) * 9;
    const driftY = Math.cos(seconds * 0.1) * 12;
    const sceneX = (EXPORT_WIDTH - width) / 2 + driftX;
    const sceneY = (EXPORT_HEIGHT - height) / 2 + driftY - 45;
    context.save();
    context.beginPath();
    context.roundRect(sceneX, sceneY, width, height, 22);
    context.clip();
    context.drawImage(image, sceneX, sceneY, width, height);
    context.restore();
    context.strokeStyle = "rgba(255,255,255,.24)";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(sceneX, sceneY, width, height, 22);
    context.stroke();
    const shade = context.createLinearGradient(0, 0, 0, EXPORT_HEIGHT);
    shade.addColorStop(0, "rgba(12, 24, 20, .28)");
    shade.addColorStop(0.48, "rgba(12, 24, 20, .04)");
    shade.addColorStop(0.68, "rgba(12, 24, 20, .18)");
    shade.addColorStop(1, "rgba(12, 24, 20, .88)");
    context.fillStyle = shade;
    context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    context.fillStyle = "rgba(12, 24, 20, .72)";
    context.fillRect(64, 74, EXPORT_WIDTH - 128, 4);
    context.fillStyle = "#f4c85b";
    context.fillRect(64, 74, (EXPORT_WIDTH - 128) * (seconds / STORY_DURATION), 4);
    context.textAlign = "left";
    context.fillStyle = "#f4c85b";
    context.font = "700 25px system-ui, sans-serif";
    context.fillText(`${story.theme.toLocaleUpperCase()}  ·  KREYÒL STUDIO`, 70, 142);
    context.fillStyle = "#ffffff";
    context.font = "700 56px Georgia, serif";
    const title = story.title;
    const words = title.split(" ");
    let titleLine = "";
    let titleY = 220;
    for (const word of words) {
      const test = `${titleLine}${word} `;
      if (context.measureText(test).width > EXPORT_WIDTH - 140) {
        context.fillText(titleLine.trim(), 70, titleY);
        titleLine = `${word} `;
        titleY += 68;
      } else titleLine = test;
    }
    context.fillText(titleLine.trim(), 70, titleY);
    const caption = story.captions.find((item) => seconds >= item.start && seconds < item.end);
    if (caption) {
      const boxTop = EXPORT_HEIGHT - 450;
      context.fillStyle = "rgba(9, 19, 16, .76)";
      context.beginPath();
      context.roundRect(54, boxTop, EXPORT_WIDTH - 108, 320, 26);
      context.fill();
      context.textAlign = "center";
      context.fillStyle = "#f4c85b";
      context.font = "700 27px system-ui, sans-serif";
      context.fillText("KREYÒL", EXPORT_WIDTH / 2, boxTop + 66);
      context.fillStyle = "#ffffff";
      context.font = "500 36px system-ui, sans-serif";
      context.fillText(caption.kreyol.slice(0, 110), EXPORT_WIDTH / 2, boxTop + 122, EXPORT_WIDTH - 160);
      context.fillStyle = "#c8e7d4";
      context.font = "700 25px system-ui, sans-serif";
      context.fillText("PORTUGUÊS", EXPORT_WIDTH / 2, boxTop + 185);
      context.fillStyle = "#ffffff";
      context.font = "500 34px system-ui, sans-serif";
      context.fillText(caption.portuguese.slice(0, 110), EXPORT_WIDTH / 2, boxTop + 245, EXPORT_WIDTH - 160);
    }
    context.textAlign = "left";
    context.fillStyle = "rgba(255,255,255,.78)";
    context.font = "500 24px system-ui, sans-serif";
    context.fillText("Kreyòl Ayisyen", 70, EXPORT_HEIGHT - 68);
  }

  async function exportVideo() {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;
    setExportError(null);
    if (audio.duration < STORY_DURATION) {
      setExportError("A narração precisa ter pelo menos 5 minutos para exportar a história completa.");
      return;
    }
    const mediaRecorder = window.MediaRecorder;
    if (!mediaRecorder || !canvas.captureStream) {
      setExportError("Este navegador não permite exportar vídeo. Use uma versão atual do Chrome, Edge ou Firefox.");
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    setExporting(true);
    try {
      const image = new Image();
      image.src = story.imageSrc;
      await image.decode();
      audio.pause();
      audio.currentTime = 0;
      drawExportFrame(context, image, 0);
      const canvasStream = canvas.captureStream(30);
      const captureAudio = audio as HTMLAudioElement & { captureStream?: () => MediaStream };
      const audioStream = captureAudio.captureStream?.();
      if (!audioStream?.getAudioTracks().length) throw new Error("Seu navegador não liberou a captura da narração. Use Chrome ou Edge para exportar.");
      const stream = new MediaStream([...canvasStream.getVideoTracks(), ...audioStream.getAudioTracks()]);
      const mp4Type = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
      const webmType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type));
      const mimeType = mp4Type || webmType;
      if (!mimeType) throw new Error("Este navegador não oferece codificação de vídeo compatível para exportação.");
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_000_000 });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      const rendered = new Promise<void>((resolve, reject) => {
        const startedAt = performance.now();
        const draw = (now: number) => {
          const seconds = Math.min((now - startedAt) / 1000, STORY_DURATION);
          drawExportFrame(context, image, seconds);
          if (seconds < STORY_DURATION && recorder.state === "recording") animationRef.current = requestAnimationFrame(draw);
          else resolve();
        };
        animationRef.current = requestAnimationFrame(draw);
        recorder.onerror = () => reject(new Error("O navegador interrompeu a gravação do vídeo."));
      });
      const finished = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });
      audio.currentTime = 0;
      await audio.play();
      recorder.start(1000);
      await rendered;
      audio.pause();
      recorder.stop();
      const blob = await finished;
      stream.getTracks().forEach((track) => track.stop());
      const extension = mp4Type ? "mp4" : "webm";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${story.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "historia"}-vertical.${extension}`;
      link.click();
      URL.revokeObjectURL(url);
      setCurrentTime(0);
      if (!mp4Type) setExportError("Vídeo exportado em WebM; para o Instagram, converta o arquivo para MP4 antes de publicar.");
    } catch (error) {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      setExportError(error instanceof Error ? error.message : "Não foi possível exportar o vídeo.");
    } finally {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      setExporting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
      <section className="overflow-hidden rounded-xl border border-[#273a31] bg-[#101b17] text-white shadow-xl">
        <div className="relative aspect-video overflow-hidden bg-[#172821]">
          <NextImage src={story.imageSrc} alt={story.title} fill unoptimized className={`object-cover ${playing ? "story-scene-moving" : ""}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35" />
          <div className="absolute left-5 top-5 flex items-center gap-2"><span className="rounded-sm bg-[#14251e]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5cf72]">{story.theme}</span><span className="rounded-sm border border-white/30 bg-black/30 px-2 py-1 text-[10px] text-white/85">KREYÒL · PT</span></div>
          <div className="absolute right-4 top-14 flex max-w-[55%] flex-wrap justify-end gap-1.5 sm:right-5 sm:top-16">{sceneElements.map((element, index) => <span key={`${element.kreyol}-${index}`} className="story-element rounded-sm border border-white/30 bg-[#15261f]/70 px-2 py-1 text-[9px] leading-none text-white shadow-sm backdrop-blur-sm sm:text-[10px]" style={{ animationDelay: `${index * 0.35}s` }}><span className="font-semibold text-[#f5cf72]">{element.kreyol}</span><span className="px-1 text-white/50">·</span>{element.pt}</span>)}</div>
          <div className="absolute bottom-5 left-5 right-5"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#f5cf72]">{story.title}</p>{captionsEnabled && activeCaption && <div className="max-w-2xl rounded-md border-l-2 border-[#f5cf72] bg-black/60 px-4 py-3 backdrop-blur-sm"><p className="text-sm font-semibold leading-snug sm:text-base">{language !== "pt" && activeCaption.kreyol}</p>{language === "both" && <div className="my-2 h-px w-10 bg-[#f5cf72]/65" />}{language !== "ht" && <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{activeCaption.portuguese}</p>}</div>}</div>
          <span className="absolute right-5 top-5 rounded-sm bg-black/45 px-2 py-1 text-[10px] tabular-nums">{formatTime(currentTime)} / 05:00</span>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="h-1 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-[#f5cf72] transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button type="button" onClick={() => void togglePlay()} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5cf72] text-[#18241d] transition-transform hover:scale-105" aria-label={playing ? "Pausar história" : "Reproduzir história"}>{playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}</button><span className="text-xs text-white/65">{playing ? "A aventura está acontecendo" : "Ouça a narração em Kreyòl"}</span></div><div className="flex items-center gap-1.5"><button type="button" title={captionsEnabled ? "Ocultar legendas" : "Mostrar legendas"} onClick={() => setCaptionsEnabled((enabled) => !enabled)} className={`flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs ${captionsEnabled ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10"}`}><Languages className="h-4 w-4" /> Legendas</button><button type="button" title={muted ? "Ativar som" : "Silenciar"} onClick={() => { const next = !muted; setMuted(next); if (audioRef.current) audioRef.current.muted = next; }} className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10" aria-label={muted ? "Ativar som" : "Silenciar"}>{muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button></div></div>
        </div>
      </section>
      <aside className="flex flex-col gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">Ouvir e compreender</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">A história, na sua língua</h2><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">A narração é em Kreyòl. A tradução acompanha cada fala em português, sincronizada ao áudio.</p><div className="mt-4 grid grid-cols-3 gap-1 rounded-md bg-[var(--surface-2)] p-1">{([ ["both", "Ambas"], ["pt", "Português"], ["ht", "Kreyòl"] ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setLanguage(value)} className={`rounded px-2 py-1.5 text-[11px] font-semibold ${language === value ? "bg-[var(--surface)] text-[var(--text)] shadow-sm" : "text-[var(--text-muted)]"}`}>{label}</button>)}</div></div>
        <div className="rounded-xl border border-[#d6b45b]/40 bg-[#f5cf72]/10 p-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9d7622]">Leve a aventura</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">Pronto para compartilhar</h2><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Exporta um vídeo vertical de 5 minutos com narração e legendas incorporadas, no formato disponível neste navegador.</p><button type="button" onClick={() => void exportVideo()} disabled={exporting} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1d3028] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#29463a] disabled:cursor-wait disabled:opacity-60"><Download className="h-4 w-4" />{exporting ? "Preparando vídeo 9:16..." : "Baixar vídeo vertical"}</button>{exporting && <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">A exportação acontece em tempo real e leva cerca de 5 minutos.</p>}{exportError && <p role="alert" className="mt-3 text-xs leading-relaxed text-[#a23c31]">{exportError}</p>}</div>
      </aside>
      <audio ref={audioRef} src={story.audioUrl} crossOrigin="anonymous" preload="metadata" className="hidden" />
      <canvas ref={canvasRef} width={EXPORT_WIDTH} height={EXPORT_HEIGHT} className="hidden" aria-hidden="true" />
      <style jsx>{`@keyframes sceneDrift{0%{transform:scale(1.02) translate(0,0)}50%{transform:scale(1.09) translate(-1.4%,1%)}100%{transform:scale(1.02) translate(0,0)}}@keyframes elementFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}.story-scene-moving{animation:sceneDrift 24s ease-in-out infinite alternate}.story-element{animation:elementFloat 4s ease-in-out infinite}`}</style>
    </div>
  );
}
