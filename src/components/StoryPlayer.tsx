"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import NextImage from "next/image";
import { Download, GripHorizontal, Languages, Pause, Play, RotateCcw, Sparkles, Undo2, Volume2, VolumeX } from "lucide-react";
import type { IVideoStoryCaption } from "@/models/VideoLesson";
import { getStoryLabelLayout } from "@/lib/imageBank";
import { useBankImage } from "@/hooks/useBankImage";
import { describeStoryDuration, formatStoryTime } from "@/lib/storyAudio";
import {
  buildElementTimeline,
  captionAt,
  elementVisual,
  sceneFrame,
  type ElementCue,
} from "@/lib/storyTimeline";
import {
  calculateLivingElementState,
  drawLivingElementOnCanvas,
} from "@/lib/storyLifeEngine";
import { useAudioVoiceActivity, computeCaptionTyping } from "@/lib/audioVoiceActivity";


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
  // Posição da legenda em % do quadro da cena (canto superior esquerdo). `null` = posição original (centralizada na parte inferior).
  const [captionPosition, setCaptionPosition] = useState<{ left: number; top: number } | null>(null);
  const [draggingCaption, setDraggingCaption] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (story.imageSrc && (story.imageSrc.endsWith(".svg") || story.imageSrc.includes(".svg?"))) {
      fetch(story.imageSrc)
        .then((res) => (res.ok ? res.text() : null))
        .then((text) => {
          if (isMounted && text) {
            setSvgContent(text);
          }
        })
        .catch(() => {
          if (isMounted) setSvgContent(null);
        });
    } else {
      setSvgContent(null);
    }
    return () => {
      isMounted = false;
    };
  }, [story.imageSrc]);

  // A duração que manda é a do áudio carregado no navegador. Se ele não a informar
  // (WebM gravado sem cabeçalho), vale a salva com a história e, por último, a última legenda.
  const lastCaptionEnd = story.captions.reduce((latest, caption) => Math.max(latest, caption.end), 0);
  const duration = mediaDuration || story.audioDuration || lastCaptionEnd || 0;

  const bankImage = useBankImage(story.imageSrc);
  const sceneElements = useMemo(() => bankImage?.elements ?? [], [bankImage]);
  const sceneLayout = useMemo(() => bankImage?.labelLayout ?? getStoryLabelLayout(story.imageSrc), [bankImage, story.imageSrc]);
  const timeline = useMemo(() => buildElementTimeline(sceneElements, story.elementCues, duration), [sceneElements, story.elementCues, duration]);

  const voiceData = useAudioVoiceActivity(story.audioUrl, story.captions);

  const activeCaptionIndex = story.captions.findIndex((c) => currentTime >= c.start && currentTime < c.end);
  const activeCaption = activeCaptionIndex >= 0 ? story.captions[activeCaptionIndex] : undefined;
  const frame = sceneFrame(currentTime, duration);

  const isAudioEnded = Boolean(audioRef.current?.ended);
  const isTimeNearEnd = duration > 0 && currentTime >= Math.max(0, duration - 0.25);
  const isPastLastCaption = lastCaptionEnd > 0 && currentTime >= lastCaptionEnd;
  const isVideoFinished = isEnded || isAudioEnded || isTimeNearEnd || (isPastLastCaption && !playing);
  const shouldShowCaption = captionsEnabled && Boolean(activeCaption) && !isVideoFinished;

  // Cálculo da digitação em tempo real em estrita sincronia com a voz do áudio.
  // Durante pausas no áudio (silêncio, respiração, vírgula), nada é digitado.
  const typingData = useMemo(() => {
    if (!activeCaption || activeCaptionIndex < 0) return null;
    return computeCaptionTyping(activeCaption, currentTime, activeCaptionIndex, voiceData);
  }, [activeCaption, activeCaptionIndex, currentTime, voiceData]);

  // Mantém a última legenda durante a transição suave de desaparecimento
  const lastTypingDataRef = useRef(typingData);
  if (typingData) {
    lastTypingDataRef.current = typingData;
  }
  const displayedTypingData = typingData || lastTypingDataRef.current;

  function seekTo(targetSeconds: number) {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(targetSeconds, duration));
    if (audio) audio.currentTime = clamped;
    setCurrentTime(clamped);
    if (clamped < (duration || lastCaptionEnd) - 0.3) {
      setIsEnded(false);
    } else {
      setIsEnded(true);
      setPlaying(false);
    }
  }

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
    const syncTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        if (audio.ended || (duration > 0 && audio.currentTime >= duration - 0.25)) {
          setIsEnded(true);
          setPlaying(false);
        } else if (audio.currentTime < duration - 0.4) {
          setIsEnded(false);
        }
      }
    };
    const ended = () => {
      setPlaying(false);
      setIsEnded(true);
    };
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
  }, [duration]);

  // O evento "timeupdate" dispara só ~4 vezes por segundo; enquanto toca, lemos o
  // relógio do áudio a cada quadro para a cena e os elementos acompanharem a voz de perto.
  useEffect(() => {
    if (!playing) return;
    let handle = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        setCurrentTime(audio.currentTime);
        if (audio.ended || (duration > 0 && audio.currentTime >= duration - 0.25)) {
          setIsEnded(true);
          setPlaying(false);
        }
      }
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [playing, duration]);

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
      if (audio.ended || isEnded || (duration > 0 && audio.currentTime >= duration - 0.25)) {
        audio.currentTime = 0;
        setCurrentTime(0);
        setIsEnded(false);
      }
      await audio.play();
      setPlaying(true);
      setIsEnded(false);
    } catch {
      setExportError("Não foi possível reproduzir a narração. Verifique o áudio e tente novamente.");
    }
  }

  function drawElementPills(context: CanvasRenderingContext2D, scene: { x: number; y: number; width: number; height: number }, seconds: number) {
    const activeCap = captionAt(story.captions, seconds);
    const captionText = activeCap ? `${activeCap.portuguese} ${activeCap.kreyol}` : "";

    for (const [index, element] of timeline.entries()) {
      const anchor = sceneLayout.anchors[index % sceneLayout.anchors.length];
      const visual = elementVisual(element, seconds);
      if (visual.phase === "hidden" || visual.opacity <= 0.01) continue;

      const centerX = scene.x + scene.width * (anchor.left / 100);
      const centerY = scene.y + scene.height * (anchor.top / 100);
      const isActive = visual.phase === "active";

      const livingState = calculateLivingElementState(
        element.pt,
        element.kreyol,
        seconds,
        captionText,
        isActive
      );

      drawLivingElementOnCanvas(context, {
        centerX,
        centerY,
        kreyol: element.kreyol,
        portuguese: element.pt,
        state: livingState,
        visualOpacity: visual.opacity,
        visualScale: visual.scale,
        isActive,
      });
    }
  }


  function drawCaptionBox(context: CanvasRenderingContext2D, kreyol: string, portuguese: string, isTyping = false) {
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
    context.fillStyle = "rgba(9, 19, 16, .84)";
    context.beginPath();
    context.roundRect(54, boxTop, EXPORT_WIDTH - 108, boxHeight, 26);
    context.fill();
    context.strokeStyle = "rgba(245, 207, 114, .38)";
    context.lineWidth = 2;
    context.stroke();

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
    context.fillStyle = "#4ade80";
    context.font = "700 25px system-ui, sans-serif";
    context.fillText("PORTUGUÊS (AO VIVO)", EXPORT_WIDTH / 2, y);
    context.fillStyle = "#ffffff";
    context.font = `500 ${size - 2}px system-ui, sans-serif`;
    y += 14;
    for (let i = 0; i < portugueseLines.length; i++) {
      const line = portugueseLines[i];
      const isLast = i === portugueseLines.length - 1;
      const lineText = isTyping && isLast ? `${line} ▍` : line;
      y += (size - 2) * 1.28;
      context.fillText(lineText, EXPORT_WIDTH / 2, y - (size - 2) * 0.28);
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
    const captionIndex = story.captions.findIndex((c) => seconds >= c.start && seconds < c.end);
    const caption = captionIndex >= 0 ? story.captions[captionIndex] : undefined;
    if (caption && (!duration || seconds < duration - 0.1)) {
      const snapshot = computeCaptionTyping(caption, seconds, captionIndex, voiceData);
      drawCaptionBox(context, caption.kreyol, snapshot.visiblePt, snapshot.isTyping);
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
            {svgContent ? (
              <div
                className={`h-full w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:object-cover ${
                  playing ? "" : "[&_*]:[animation-play-state:paused!important]"
                }`}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <NextImage src={story.imageSrc} alt={story.title} fill unoptimized className="object-cover" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35 pointer-events-none" />
          <div className="absolute left-4 top-4 sm:left-5 sm:top-5 flex flex-wrap items-center gap-2 z-20">
            <span className="rounded-md bg-[#14251e]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5cf72] border border-[#f5cf72]/30 shadow-sm">{story.theme}</span>
            <span className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[10px] text-white/90 font-medium">KREYÒL · PT</span>
            <span className="hidden sm:flex items-center gap-1 rounded-md border border-[#f5cf72]/40 bg-[#f5cf72]/20 px-2 py-1 text-[10px] font-semibold text-[#f5cf72]">
              <Sparkles className="h-2.5 w-2.5 animate-pulse text-[#f5cf72]" /> Elementos Vivos
            </span>
            <span className="hidden md:inline-block text-[11px] font-semibold tracking-wide text-white/80 max-w-[220px] truncate drop-shadow">
              {story.title}
            </span>
          </div>
          {timeline.map((element, index) => {
            const visual = elementVisual(element, currentTime);
            const active = visual.phase === "active";
            const anchor = sceneLayout.anchors[index % sceneLayout.anchors.length];
            const imageScale = 1.03 * frame.zoom;
            const imageCrop = 16 / 9 / (1200 / 800);

            const captionText = activeCaption ? `${activeCaption.portuguese} ${activeCaption.kreyol}` : "";
            const living = calculateLivingElementState(element.pt, element.kreyol, currentTime, captionText, active);

            // Posição de ancoragem estável: o título identifica o elemento da imagem sem se debater
            const left = 50 + (anchor.left - 50) * imageScale + frame.driftX;
            const top = 50 + (anchor.top - 50) * imageCrop * imageScale + frame.driftY;

            return (
              <div
                key={`${element.kreyol}-${index}`}
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none transition-all duration-300 will-change-transform"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  opacity: visual.opacity,
                  transform: `translate(-50%, -50%) scale(${visual.scale * (active ? 1.06 : 1)})`,
                  transformOrigin: "center center",
                }}
              >
                {/* Destaque sutil com aura luminosa quando o elemento está ativo na narração */}
                {active && (
                  <div
                    className="absolute inset-0 -m-2 rounded-full bg-[#f5cf72]/30 blur-md pointer-events-none transition-opacity"
                    style={{ opacity: 0.5 + living.pulse * 0.5 }}
                  />
                )}

                {/* Pílula identificadora estável do elemento */}
                <div
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[8px] sm:text-[10px] leading-none shadow-lg backdrop-blur-md transition-all duration-300 ${
                    active
                      ? "border-[#f5cf72] bg-[#f5cf72] text-[#18241d] font-bold ring-2 ring-[#f5cf72]/60 shadow-[0_0_18px_rgba(245,207,114,0.5)]"
                      : "border-white/35 bg-[#12221b]/92 text-white/95"
                  }`}
                >
                  <span className="text-xs sm:text-sm">{living.badgeEmoji}</span>
                  <span className={`font-bold ${active ? "text-[#18241d]" : "text-[#f5cf72]"}`}>{element.kreyol}</span>
                  <span className={`px-0.5 ${active ? "text-[#18241d]/60" : "text-white/60"}`}>·</span>
                  <span className={active ? "text-[#18241d]" : "text-white"}>{element.pt}</span>
                </div>
              </div>
            );
          })}

          {displayedTypingData && (
            <div
              ref={captionRef}
              role="group"
              tabIndex={0}
              aria-label="Legenda sincronizada da história"
              title="Legenda sincronizada (arraste para mover se desejar)"
              onPointerDown={startCaptionDrag}
              onPointerMove={moveCaptionDrag}
              onPointerUp={endCaptionDrag}
              onPointerCancel={endCaptionDrag}
              onKeyDown={moveCaptionWithKeyboard}
              className={`absolute z-30 w-[min(94%,36rem)] max-w-[calc(100%-1.25rem)] touch-none select-none outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#f5cf72] ${
                captionPosition ? "" : "bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2"
              } ${draggingCaption ? "cursor-grabbing" : "cursor-grab"} ${
                shouldShowCaption
                  ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 translate-y-2 scale-95 pointer-events-none"
              }`}
              style={captionPosition ? { left: `${captionPosition.left}%`, top: `${captionPosition.top}%` } : undefined}
            >
              <div
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#f5cf72]/35 bg-[#0a1510]/92 sm:bg-black/85 px-3.5 py-2 sm:px-4.5 sm:py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_2px_8px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all ${
                  draggingCaption ? "ring-2 ring-[#f5cf72]/70 shadow-[0_0_25px_rgba(245,207,114,0.35)]" : ""
                }`}
              >
                {/* Linha de brilho superior sutil para acabamento premium */}
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#f5cf72]/45 to-transparent" />

                {/* Alça sutil de reposicionamento (discreta no canto superior direito para não poluir nem ocupar espaço vertical) */}
                <div
                  className="absolute right-2 top-2 flex items-center gap-1 text-white/35 opacity-40 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                  title="Arraste para mover a legenda"
                  aria-hidden="true"
                >
                  <GripHorizontal className="h-3 w-3" />
                </div>

                {/* Conteúdo em Kreyòl (áudio original falado) */}
                {language !== "pt" && (
                  <div className="flex items-center gap-1.5 pr-5 mb-1">
                    <span className="shrink-0 rounded bg-[#f5cf72]/20 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#f5cf72] border border-[#f5cf72]/30">
                      Kreyòl
                    </span>
                    <p className="text-xs sm:text-[13px] font-medium leading-tight text-[#fde68a]/90 drop-shadow-sm truncate">
                      {displayedTypingData.kreyol}
                    </p>
                  </div>
                )}

                {/* Conteúdo em Português com efeito de digitação sincronizado para o usuário não-falante */}
                {language !== "ht" && (
                  <div className="flex items-start gap-1.5 pr-4">
                    {language === "both" && (
                      <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-400/30 mt-0.5">
                        PT
                      </span>
                    )}
                    <div className={`flex-1 text-xs sm:text-sm md:text-[15px] font-semibold leading-snug text-white ${language === "pt" ? "text-center" : ""}`}>
                      <span className="relative inline">
                        <span className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                          {displayedTypingData.visiblePt}
                        </span>
                        {displayedTypingData.progress > 0 && displayedTypingData.progress < 1 && playing && (
                          <span
                            className={`inline-block w-[2.5px] h-[1.15em] ml-0.5 align-middle rounded-full transition-all duration-150 ${
                              displayedTypingData.isTyping
                                ? "bg-[#f5cf72] shadow-[0_0_8px_#f5cf72] animate-pulse opacity-100"
                                : "bg-[#f5cf72]/70 opacity-40 scale-90"
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">
                          {displayedTypingData.invisiblePt}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <span className="absolute right-5 top-5 rounded-sm bg-black/45 px-2 py-1 text-[10px] tabular-nums">{formatStoryTime(currentTime)} / {durationLabel}</span>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div
            role="slider"
            tabIndex={0}
            aria-label="Controle de reprodução da história"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            onClick={(e) => {
              if (!duration || exporting) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              seekTo(ratio * duration);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                seekTo(Math.max(0, currentTime - 5));
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                seekTo(Math.min(duration, currentTime + 5));
              }
            }}
            className="group relative flex h-3 w-full cursor-pointer items-center select-none"
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15 transition-all group-hover:h-2">
              <div
                className="h-full bg-gradient-to-r from-[#f5cf72] to-[#fde68a] transition-all"
                style={{ width: `${frame.progress * 100}%` }}
              />
            </div>
            <div
              className="absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#f5cf72] opacity-0 shadow-md transition-opacity group-hover:opacity-100 ring-2 ring-black/50"
              style={{ left: `${frame.progress * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void togglePlay()}
                disabled={exporting}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5cf72] text-[#18241d] transition-transform hover:scale-105 disabled:opacity-50 shadow-md"
                aria-label={playing ? "Pausar história" : isVideoFinished ? "Assistir novamente" : "Reproduzir história"}
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : isVideoFinished ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" />
                )}
              </button>
              <span className="text-xs text-white/70">
                {playing
                  ? "A aventura está acontecendo…"
                  : isVideoFinished
                  ? "História concluída! Clique para assistir novamente"
                  : "Ouça a narração em Kreyòl com tradução sincronizada"}
              </span>
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
        <div className="rounded-xl border border-[#d6b45b]/40 bg-[#f5cf72]/10 p-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9d7622]">Leve a aventura</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">Pronto para compartilhar</h2><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Exporta um vídeo vertical{duration > 0 ? ` de ${describeStoryDuration(duration)}` : ""}, com a duração exata da narração, com elementos da cena e legendas incorporados, no formato disponível neste navegador.</p><button type="button" onClick={() => void exportVideo()} disabled={exporting || !(duration > 0)} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1d3028] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#29463a] disabled:cursor-wait disabled:opacity-60"><Download className="h-4 w-4" />{exporting ? "Preparando vídeo 9:16..." : "Baixar vídeo vertical"}</button>{exporting && <LoadingSpinner layout="inline" size="sm" label="Gravando o vídeo vertical…" progress={duration > 0 ? (currentTime / duration) * 100 : undefined} className="mt-3" />}{exporting && <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">A exportação acontece em tempo real e leva cerca de {describeStoryDuration(duration)}. Mantenha esta aba aberta e visível; a narração toca durante o processo.</p>}{exportError && <p role="alert" className="mt-3 text-xs leading-relaxed text-[#a23c31]">{exportError}</p>}</div>
      </aside>
      <audio ref={audioRef} src={story.audioUrl} crossOrigin="anonymous" preload="metadata" className="hidden" />
      <canvas ref={canvasRef} width={EXPORT_WIDTH} height={EXPORT_HEIGHT} className="hidden" aria-hidden="true" />
    </div>
  );
}
