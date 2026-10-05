"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { Download, GripHorizontal, Languages, Pause, Play, Undo2, Volume2, VolumeX } from "lucide-react";
import type { IVideoStoryCaption } from "@/models/VideoLesson";
import { getBankImage, getStoryLabelLayout } from "@/lib/imageBank";
import { describeStoryDuration, formatStoryTime } from "@/lib/storyAudio";
import {
  buildElementTimeline,
  captionAt,
  elementVisual,
  sceneFrame,
  type ElementCue,
} from "@/lib/storyTimeline";

export interface StoryPlayerData {
  title: string;
  imageSrc: string;
  theme: string;
  audioUrl: string;
  /** Duração gravada junto com a história (histórias antigas não têm). */
  audioDuration?: number;
  captions: IVideoStoryCaption[];
  elementCues?: ElementCue[];
}

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;

function wrapLines(context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = Number.POSITIVE_INFINITY) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last.length > 1 && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
  kept[maxLines - 1] = `${last.trimEnd()}…`;
  return kept;
}

export function StoryPlayer({ story }: { story: StoryPlayerData }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerViewportRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const captionDragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [language, setLanguage] = useState<"both" | "pt" | "ht">("both");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  // Posição da legenda em % do quadro da cena (canto superior esquerdo). `null` = posição original (canto inferior direito).
  const [captionPosition, setCaptionPosition] = useState<{ left: number; top: number } | null>(null);
  const [draggingCaption, setDraggingCaption] = useState(false);

  // A duração que manda é a do áudio carregado no navegador. Se ele não a informar
  // (WebM gravado sem cabeçalho), vale a salva com a história e, por último, a última legenda.
  const lastCaptionEnd = story.captions.reduce((latest, caption) => Math.max(latest, caption.end), 0);
  const duration = mediaDuration || story.audioDuration || lastCaptionEnd || 0;

  const sceneElements = useMemo(() => getBankImage(story.imageSrc)?.elements ?? [], [story.imageSrc]);
  const sceneLayout = useMemo(() => getStoryLabelLayout(story.imageSrc), [story.imageSrc]);
  const timeline = useMemo(() => buildElementTimeline(sceneElements, story.elementCues, duration), [sceneElements, story.elementCues, duration]);

  const activeCaption = captionAt(story.captions, currentTime);
  const frame = sceneFrame(currentTime, duration);

  function setCaptionPositionFromPixels(left: number, top: number) {
    const viewport = playerViewportRef.current;
    const caption = captionRef.current;
    if (!viewport || !caption) return;
    const maxLeft = Math.max(0, viewport.clientWidth - caption.offsetWidth);
    const maxTop = Math.max(0, viewport.clientHeight - caption.offsetHeight);
    setCaptionPosition({
      left: (Math.max(0, Math.min(left, maxLeft)) / viewport.clientWidth) * 100,
      top: (Math.max(0, Math.min(top, maxTop)) / viewport.clientHeight) * 100,
    });
  }

  function startCaptionDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const caption = captionRef.current;
    const viewport = playerViewportRef.current;
    if (!caption || !viewport) return;
    const captionRect = caption.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    captionDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - captionRect.left,
      offsetY: event.clientY - captionRect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    setDraggingCaption(true);
    setCaptionPositionFromPixels(captionRect.left - viewportRect.left, captionRect.top - viewportRect.top);
  }

  function moveCaptionDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = captionDragRef.current;
    const viewport = playerViewportRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    setCaptionPositionFromPixels(event.clientX - viewportRect.left - drag.offsetX, event.clientY - viewportRect.top - drag.offsetY);
  }

  function endCaptionDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = captionDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    captionDragRef.current = null;
    setDraggingCaption(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function moveCaptionWithKeyboard(event: React.KeyboardEvent<HTMLDivElement>) {
    const directions: Record<string, [number, number]> = {
      ArrowUp: [0, -12],
      ArrowDown: [0, 12],
      ArrowLeft: [-12, 0],
      ArrowRight: [12, 0],
    };
    const direction = directions[event.key];
    const viewport = playerViewportRef.current;
    const caption = captionRef.current;
    if (!direction || !viewport || !caption) return;
    event.preventDefault();
    const captionRect = caption.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    setCaptionPositionFromPixels(
      captionRect.left - viewportRect.left + direction[0],
      captionRect.top - viewportRect.top + direction[1],
    );
  }

  // A legenda muda de tamanho a cada fala (e com o idioma escolhido) e o quadro muda de tamanho
  // ao girar/redimensionar a tela: reencaixa a posição escolhida para a legenda nunca sair do quadro.
  useEffect(() => {
    function keepCaptionInside() {
      const viewport = playerViewportRef.current;
      const caption = captionRef.current;
      if (!viewport || !caption || !viewport.clientWidth || !viewport.clientHeight) return;
      const maxLeft = Math.max(0, 100 - (caption.offsetWidth / viewport.clientWidth) * 100);
      const maxTop = Math.max(0, 100 - (caption.offsetHeight / viewport.clientHeight) * 100);
      setCaptionPosition((current) => {
        if (!current) return current;
        const left = Math.min(current.left, maxLeft);
        const top = Math.min(current.top, maxTop);
        return left === current.left && top === current.top ? current : { left, top };
      });
    }
    keepCaptionInside();
    window.addEventListener("resize", keepCaptionInside);
    return () => window.removeEventListener("resize", keepCaptionInside);
  }, [activeCaption, language, captionsEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const syncDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setMediaDuration(audio.duration);
    };
    const syncTime = () => setCurrentTime(audio.currentTime);
    const ended = () => { setPlaying(false); setCurrentTime(0); };
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("seeked", syncTime);
    audio.addEventListener("ended", ended);
    syncDuration();
    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("seeked", syncTime);
      audio.removeEventListener("ended", ended);
    };
  }, []);

  // O evento "timeupdate" dispara só ~4 vezes por segundo; enquanto toca, lemos o
  // relógio do áudio a cada quadro para a cena e os elementos acompanharem a voz de perto.
  useEffect(() => {
    if (!playing) return;
    let handle = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) setCurrentTime(audio.currentTime);
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [playing]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio || exporting) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      if (audio.ended || (duration > 0 && audio.currentTime >= duration)) audio.currentTime = 0;
      await audio.play();
      setPlaying(true);
    } catch {
      setExportError("Não foi possível reproduzir a narração. Verifique o áudio e tente novamente.");
    }
  }

  function drawElementPills(context: CanvasRenderingContext2D, scene: { x: number; y: number; width: number; height: number }, seconds: number) {
    for (const [index, element] of timeline.entries()) {
      const anchor = sceneLayout.anchors[index % sceneLayout.anchors.length];
      const fontSize = 22;
      context.font = `700 ${fontSize}px system-ui, sans-serif`;
      const kreyolWidth = context.measureText(element.kreyol).width;
      const separator = context.measureText("  ·  ").width;
      const ptWidth = context.measureText(element.pt).width;
      const width = kreyolWidth + separator + ptWidth + 32;
      const height = 44;
      const pill = {
        element,
        kreyolWidth,
        separator,
        width,
        height,
        x: scene.x + scene.width * (anchor.left / 100) - width / 2,
        y: scene.y + scene.height * (anchor.top / 100) - height / 2,
      };
      const visual = elementVisual(pill.element, seconds);
      if (visual.phase === "hidden" || visual.opacity <= 0.01) continue;
      const centerX = pill.x + pill.width / 2;
      const centerY = pill.y + pill.height / 2;
      context.save();
      context.globalAlpha = visual.opacity;
      context.translate(centerX, centerY);
      context.scale(visual.scale, visual.scale);
      context.translate(-centerX, -centerY);
      const active = visual.phase === "active";
      context.fillStyle = active ? "#f4c85b" : "rgba(21, 38, 31, .9)";
      context.beginPath();
      context.roundRect(pill.x, pill.y, pill.width, pill.height, 10);
      context.fill();
      context.strokeStyle = active ? "#f4c85b" : "rgba(255,255,255,.34)";
      context.lineWidth = 2;
      context.stroke();
      context.font = `700 ${fontSize}px system-ui, sans-serif`;
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillStyle = active ? "#18241d" : "#f4c85b";
      context.fillText(pill.element.kreyol, pill.x + 22, centerY + 1);
      context.fillStyle = active ? "#18241d" : "rgba(255,255,255,.55)";
      context.fillText("  ·  ", pill.x + 22 + pill.kreyolWidth, centerY + 1);
      context.fillStyle = active ? "#18241d" : "#ffffff";
      context.fillText(pill.element.pt, pill.x + 22 + pill.kreyolWidth + pill.separator, centerY + 1);
      context.restore();
    }
    context.textBaseline = "alphabetic";
  }

  function drawCaptionBox(context: CanvasRenderingContext2D, kreyol: string, portuguese: string) {
    const maxTextWidth = EXPORT_WIDTH - 160;
    const maxBoxHeight = 365;
    let size = 22;
    let kreyolLines: string[] = [];
    let portugueseLines: string[] = [];
    let boxHeight = 0;
    for (const candidate of [36, 32, 28, 25, 22]) {
      context.font = `500 ${candidate}px system-ui, sans-serif`;
      const k = wrapLines(context, kreyol, maxTextWidth);
      context.font = `500 ${candidate - 2}px system-ui, sans-serif`;
      const p = wrapLines(context, portuguese, maxTextWidth);
      const height = 32 + 38 + k.length * candidate * 1.28 + 18 + 38 + p.length * (candidate - 2) * 1.28 + 26;
      size = candidate;
      kreyolLines = k;
      portugueseLines = p;
      boxHeight = height;
      if (height <= maxBoxHeight) break;
    }
    if (boxHeight > maxBoxHeight) {
      // Texto muito longo mesmo na menor fonte: limita as linhas com reticências.
      context.font = `500 ${size}px system-ui, sans-serif`;
      kreyolLines = wrapLines(context, kreyol, maxTextWidth, 3);
      context.font = `500 ${size - 2}px system-ui, sans-serif`;
      portugueseLines = wrapLines(context, portuguese, maxTextWidth, 3);
      boxHeight = 32 + 38 + kreyolLines.length * size * 1.28 + 18 + 38 + portugueseLines.length * (size - 2) * 1.28 + 26;
    }
    const boxTop = EXPORT_HEIGHT - 130 - boxHeight;
    context.fillStyle = "rgba(9, 19, 16, .76)";
    context.beginPath();
    context.roundRect(54, boxTop, EXPORT_WIDTH - 108, boxHeight, 26);
    context.fill();
    context.textAlign = "center";
    let y = boxTop + 32 + 24;
    context.fillStyle = "#f4c85b";
    context.font = "700 27px system-ui, sans-serif";
    context.fillText("KREYÒL", EXPORT_WIDTH / 2, y);
    context.fillStyle = "#ffffff";
    context.font = `500 ${size}px system-ui, sans-serif`;
    y += 14;
    for (const line of kreyolLines) {
      y += size * 1.28;
      context.fillText(line, EXPORT_WIDTH / 2, y - size * 0.28);
    }
    y += 18 + 24;
    context.fillStyle = "#c8e7d4";
    context.font = "700 25px system-ui, sans-serif";
    context.fillText("PORTUGUÊS", EXPORT_WIDTH / 2, y);
    context.fillStyle = "#ffffff";
    context.font = `500 ${size - 2}px system-ui, sans-serif`;
    y += 14;
    for (const line of portugueseLines) {
      y += (size - 2) * 1.28;
      context.fillText(line, EXPORT_WIDTH / 2, y - (size - 2) * 0.28);
    }
  }

  // Desenha o quadro do vídeo exportado para o instante `seconds` do ÁUDIO.
  // Usa as mesmas funções de linha do tempo da pré-visualização (zoom/deriva da cena,
  // elementos, legenda e progresso) — por isso o vídeo sai igual ao que o player mostra.
  function drawExportFrame(context: CanvasRenderingContext2D, image: HTMLImageElement, seconds: number) {
    const scene = sceneFrame(seconds, duration);
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
    const baseScale = Math.min((EXPORT_WIDTH - 88) / image.width, 760 / image.height);
    const baseHeight = image.height * baseScale;
    const width = image.width * baseScale * scene.zoom;
    const height = baseHeight * scene.zoom;
    const sceneX = (EXPORT_WIDTH - width) / 2 + (scene.driftX / 100) * width;
    const sceneY = (EXPORT_HEIGHT - height) / 2 + (scene.driftY / 100) * height - 45;
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
    context.fillRect(64, 74, (EXPORT_WIDTH - 128) * scene.progress, 4);
    context.textAlign = "left";
    context.fillStyle = "#f4c85b";
    context.font = "700 25px system-ui, sans-serif";
    context.fillText(`${story.theme.toLocaleUpperCase()}  ·  KREYÒL STUDIO`, 70, 142);
    context.fillStyle = "#ffffff";
    context.font = "700 56px Georgia, serif";
    const words = story.title.split(" ");
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
    drawElementPills(context, { x: sceneX, y: sceneY, width, height }, seconds);
    const caption = captionAt(story.captions, seconds);
    if (caption) drawCaptionBox(context, caption.kreyol, caption.portuguese);
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
    if (!(duration > 0)) {
      setExportError("Aguarde o carregamento da narração e tente novamente.");
      return;
    }
    if (!window.MediaRecorder || !canvas.captureStream) {
      setExportError("Este navegador não permite exportar vídeo. Use uma versão atual do Chrome, Edge ou Firefox.");
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    setExporting(true);
    const wasMuted = audio.muted;
    let failure: Error | null = null;
    // Com a aba em segundo plano o navegador congela o desenho dos quadros, mas o áudio
    // continua: o vídeo sairia fora de sincronia. Nesse caso a exportação é cancelada.
    const onVisibility = () => {
      if (document.hidden) failure = new Error("A exportação foi cancelada porque a aba ficou em segundo plano. Mantenha esta aba aberta e visível até o fim.");
    };
    document.addEventListener("visibilitychange", onVisibility);
    try {
      const image = new Image();
      image.src = story.imageSrc;
      await image.decode();
      audio.pause();
      audio.currentTime = 0;
      // A captura do elemento <audio> grava o que ele reproduz; mudo, o vídeo sairia sem narração.
      audio.muted = false;
      drawExportFrame(context, image, 0);
      const canvasStream = canvas.captureStream(30);
      const captureAudio = audio as HTMLAudioElement & { captureStream?: () => MediaStream };
      let audioStream = captureAudio.captureStream?.();
      let playbackStarted = false;
      if (!audioStream?.getAudioTracks().length) {
        // Alguns navegadores só expõem a trilha de áudio depois que a reprodução começa.
        await audio.play();
        playbackStarted = true;
        audioStream = captureAudio.captureStream?.();
      }
      if (!audioStream?.getAudioTracks().length) throw new Error("Seu navegador não liberou a captura da narração. Use Chrome ou Edge para exportar.");
      const stream = new MediaStream([...canvasStream.getVideoTracks(), ...audioStream.getAudioTracks()]);
      const mp4Type = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
      const webmType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type));
      const mimeType = mp4Type || webmType;
      if (!mimeType) throw new Error("Este navegador não oferece codificação de vídeo compatível para exportação.");
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_000_000 });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => { failure = new Error("O navegador interrompeu a gravação do vídeo."); };
      const finished = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });
      recorder.start(1000);
      if (!playbackStarted) await audio.play();
      // Os quadros só começam a ser desenhados com o áudio já tocando, e seguem o relógio do
      // áudio (audio.currentTime) — nunca o relógio de parede.
      await new Promise<void>((resolve) => {
        const draw = () => {
          drawExportFrame(context, image, audio.currentTime);
          if (!failure && !audio.ended && !audio.paused) animationRef.current = requestAnimationFrame(draw);
          else resolve();
        };
        animationRef.current = requestAnimationFrame(draw);
      });
      const completed = audio.ended;
      if (completed) {
        drawExportFrame(context, image, duration);
        // Pequena folga para os últimos quadros e o fim do áudio chegarem ao gravador.
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      recorder.stop();
      const blob = await finished;
      stream.getTracks().forEach((track) => track.stop());
      if (failure) throw failure;
      if (!completed) throw new Error("A narração foi interrompida antes do fim; o vídeo não foi gerado. Tente exportar novamente.");
      const extension = mp4Type ? "mp4" : "webm";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${story.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "historia"}-vertical.${extension}`;
      link.click();
      URL.revokeObjectURL(url);
      if (!mp4Type) setExportError("Vídeo exportado em WebM; para o Instagram, converta o arquivo para MP4 antes de publicar.");
    } catch (error) {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      setExportError(error instanceof Error ? error.message : "Não foi possível exportar o vídeo.");
    } finally {
      document.removeEventListener("visibilitychange", onVisibility);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      audio.pause();
      audio.currentTime = 0;
      audio.muted = wasMuted;
      setCurrentTime(0);
      setPlaying(false);
      setExporting(false);
    }
  }

  const durationLabel = formatStoryTime(duration);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
      <section className="overflow-hidden rounded-xl border border-[#273a31] bg-[#101b17] text-white shadow-xl">
        <div ref={playerViewportRef} className="relative aspect-video overflow-hidden bg-[#172821]">
          <div className="absolute inset-0 will-change-transform" style={{ transform: `translate(${frame.driftX}%, ${frame.driftY}%) scale(${1.03 * frame.zoom})` }}>
            <NextImage src={story.imageSrc} alt={story.title} fill unoptimized className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35" />
          <div className="absolute left-5 top-5 flex items-center gap-2"><span className="rounded-sm bg-[#14251e]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5cf72]">{story.theme}</span><span className="rounded-sm border border-white/30 bg-black/30 px-2 py-1 text-[10px] text-white/85">KREYÒL · PT</span></div>
          {timeline.map((element, index) => {
            const visual = elementVisual(element, currentTime);
            const active = visual.phase === "active";
            const anchor = sceneLayout.anchors[index % sceneLayout.anchors.length];
            const imageScale = 1.03 * frame.zoom;
            const imageCrop = 16 / 9 / (1200 / 800);
            const left = 50 + (anchor.left - 50) * imageScale + frame.driftX;
            const top = 50 + (anchor.top - 50) * imageCrop * imageScale + frame.driftY;
            return (
              <span
                key={`${element.kreyol}-${index}`}
                className={`pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2 py-1 text-[8px] leading-none shadow-sm backdrop-blur-sm sm:text-[10px] ${active ? "border-[#f5cf72] bg-[#f5cf72] text-[#18241d]" : "border-white/35 bg-[#15261f]/90 text-white"}`}
                style={{ left: `${left}%`, top: `${top}%`, opacity: visual.opacity, transform: `translate(-50%, -50%) scale(${visual.scale})`, transformOrigin: "center center" }}
              >
                <span className={`font-semibold ${active ? "text-[#18241d]" : "text-[#f5cf72]"}`}>{element.kreyol}</span>
                <span className={`px-1 ${active ? "text-[#18241d]/60" : "text-white/60"}`}>·</span>
                {element.pt}
              </span>
            );
          })}
          <div className="pointer-events-none absolute bottom-5 left-5 z-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#f5cf72]">{story.title}</p>
          </div>
          {captionsEnabled && activeCaption && (
            <div
              ref={captionRef}
              role="group"
              tabIndex={0}
              aria-label="Legenda da história. Arraste para mover ou use as setas do teclado."
              title="Arraste para mover a legenda"
              onPointerDown={startCaptionDrag}
              onPointerMove={moveCaptionDrag}
              onPointerUp={endCaptionDrag}
              onPointerCancel={endCaptionDrag}
              onKeyDown={moveCaptionWithKeyboard}
              className={`absolute z-30 w-[min(40%,28rem)] max-w-[calc(100%-2rem)] touch-none select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#f5cf72] ${captionPosition ? "" : "bottom-4 right-4"} ${draggingCaption ? "cursor-grabbing" : "cursor-grab"}`}
              style={captionPosition ? { left: `${captionPosition.left}%`, top: `${captionPosition.top}%` } : undefined}
            >
              <div className={`rounded-xl border border-[#f5cf72]/50 bg-black/65 px-4 pb-3 pt-1.5 shadow-lg backdrop-blur-sm ${draggingCaption ? "ring-2 ring-[#f5cf72]/60" : ""}`}>
                <GripHorizontal className="mx-auto mb-1 h-3.5 w-3.5 text-[#f5cf72]/70" aria-hidden="true" />
                <p className="text-sm font-semibold leading-snug text-[#f8e7b3] sm:text-base">{language !== "pt" && activeCaption.kreyol}</p>
                {language === "both" && <div className="my-2 h-px w-10 bg-[#f5cf72]/65" />}
                {language !== "ht" && <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{activeCaption.portuguese}</p>}
              </div>
            </div>
          )}
          <span className="absolute right-5 top-5 rounded-sm bg-black/45 px-2 py-1 text-[10px] tabular-nums">{formatStoryTime(currentTime)} / {durationLabel}</span>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-[#f5cf72]" style={{ width: `${frame.progress * 100}%` }} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => void togglePlay()} disabled={exporting} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5cf72] text-[#18241d] transition-transform hover:scale-105 disabled:opacity-50" aria-label={playing ? "Pausar história" : "Reproduzir história"}>{playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
              </button>
              <span className="text-xs text-white/65">{playing ? "A aventura está acontecendo" : "Ouça a narração em Kreyòl"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" title={captionsEnabled ? "Ocultar legendas" : "Mostrar legendas"} onClick={() => setCaptionsEnabled((enabled) => !enabled)} className={`flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs ${captionsEnabled ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10"}`}><Languages className="h-4 w-4" /> Legendas
              </button>{captionPosition && 
              <button type="button" title="Voltar a legenda para a posição original" onClick={() => setCaptionPosition(null)} className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs text-white/70 hover:bg-white/10"><Undo2 className="h-4 w-4" /> Reposicionar
              </button>}
              <button type="button" title={muted ? "Ativar som" : "Silenciar"} disabled={exporting} onClick={() => { const next = !muted; setMuted(next); if (audioRef.current) audioRef.current.muted = next; }} className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 disabled:opacity-50" aria-label={muted ? "Ativar som" : "Silenciar"}>{muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>
      <aside className="flex flex-col gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">Ouvir e compreender</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">A história, na sua língua</h2><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">A narração é em Kreyòl. A tradução acompanha cada fala em português, sincronizada ao áudio.</p><div className="mt-4 grid grid-cols-3 gap-1 rounded-md bg-[var(--surface-2)] p-1">{([ ["both", "Ambas"], ["pt", "Português"], ["ht", "Kreyòl"] ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setLanguage(value)} className={`rounded px-2 py-1.5 text-[11px] font-semibold ${language === value ? "bg-[var(--surface)] text-[var(--text)] shadow-sm" : "text-[var(--text-muted)]"}`}>{label}</button>)}</div></div>
        <div className="rounded-xl border border-[#d6b45b]/40 bg-[#f5cf72]/10 p-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9d7622]">Leve a aventura</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">Pronto para compartilhar</h2><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Exporta um vídeo vertical{duration > 0 ? ` de ${describeStoryDuration(duration)}` : ""}, com a duração exata da narração, com elementos da cena e legendas incorporados, no formato disponível neste navegador.</p><button type="button" onClick={() => void exportVideo()} disabled={exporting || !(duration > 0)} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1d3028] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#29463a] disabled:cursor-wait disabled:opacity-60"><Download className="h-4 w-4" />{exporting ? "Preparando vídeo 9:16..." : "Baixar vídeo vertical"}</button>{exporting && <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">A exportação acontece em tempo real e leva cerca de {describeStoryDuration(duration)}. Mantenha esta aba aberta e visível; a narração toca durante o processo.</p>}{exportError && <p role="alert" className="mt-3 text-xs leading-relaxed text-[#a23c31]">{exportError}</p>}</div>
      </aside>
      <audio ref={audioRef} src={story.audioUrl} crossOrigin="anonymous" preload="metadata" className="hidden" />
      <canvas ref={canvasRef} width={EXPORT_WIDTH} height={EXPORT_HEIGHT} className="hidden" aria-hidden="true" />
    </div>
  );
}
