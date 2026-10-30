"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import NextImage from "next/image";
import { Check, Copy, Download, ExternalLink, Film, GripHorizontal, Languages, MessageCircle, Pause, Play, RotateCcw, Share2, Sparkles, Undo2, Volume2, VolumeX } from "lucide-react";
import type { IVideoStoryCaption } from "@/models/VideoLesson";
import { getStoryLabelLayout, getElementLabel, getLanguageImageSrc } from "@/lib/imageBank";
import { useBankImage } from "@/hooks/useBankImage";
import { useAppLanguage } from "@/hooks/useAppLanguage";
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
  measureLivingPill,
} from "@/lib/storyLifeEngine";
import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import { getElementIcon } from "@/lib/storyElementIcon";
import { buildSvgLayerKit, loadSvgImage, rasterizeLayer, releaseSvgImage } from "@/lib/storySvgLayers";
import { analyzeSceneZones, lifeSvgDocument, type SceneZones } from "@/lib/storySceneLife";
import { createSceneLife } from "@/lib/storySceneDirector";
import { WATER, getSceneGrid } from "@/lib/storySceneMap";
import { useAudioVoiceActivity, computeCaptionTyping } from "@/lib/audioVoiceActivity";
import { buildSoundPlan, createLiveSoundscape, mixSoundPlanInto } from "@/lib/storySoundscape";


export interface StoryPlayerData {
  title: string;
  imageSrc: string;
  theme: string;
  audioUrl: string;
  language?: "kreyol" | "francais";
  /** Duração gravada junto com a história (histórias antigas não têm). */
  audioDuration?: number;
  captions: IVideoStoryCaption[];
  elementCues?: ElementCue[];
}

export type ExportFormat = "stories" | "feed";

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;
/** Janela da cena no vídeo vertical (entre o título e a caixa de legenda). */
const STORY_WINDOW_TOP = 296;
const STORY_WINDOW_HEIGHT = 1120;

const RECORDER_CANDIDATES = [
  "video/mp4;codecs=avc1.640028,mp4a.40.2",
  "video/mp4;codecs=avc1.4D4028,mp4a.40.2",
  "video/mp4;codecs=avc1.42E028,mp4a.40.2",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

// Testa cada codec com o stream real (vídeo + áudio) antes de gravar de verdade.
async function pickRecorderMime(stream: MediaStream): Promise<string | undefined> {
  for (const type of RECORDER_CANDIDATES) {
    if (!MediaRecorder.isTypeSupported(type)) continue;
    try {
      const probe = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 4_000_000, audioBitsPerSecond: 128_000 });
      let failed = false;
      probe.onerror = () => { failed = true; };
      probe.start(100);
      for (const track of stream.getVideoTracks()) {
        (track as CanvasCaptureMediaStreamTrack).requestFrame?.();
      }
      await new Promise((resolve) => setTimeout(resolve, 700));
      const ok = !failed && probe.state === "recording";
      if (probe.state !== "inactive") probe.stop();
      if (ok) return type;
    } catch {
      /* tenta o próximo codec */
    }
  }
  return undefined;
}

// Captura estável do áudio via Web Audio (audio.captureStream() troca/remove trilhas
// durante a gravação e isso faz o MediaRecorder disparar erro).
const audioGraphs = new WeakMap<HTMLAudioElement, { ctx: AudioContext; dest: MediaStreamAudioDestinationNode }>();

function getAudioCapture(audio: HTMLAudioElement) {
  let graph = audioGraphs.get(audio);
  if (!graph) {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtor();
    const source = ctx.createMediaElementSource(audio);
    const dest = ctx.createMediaStreamDestination();
    source.connect(ctx.destination);
    source.connect(dest);
    graph = { ctx, dest };
    audioGraphs.set(audio, graph);
  }
  return graph;
}

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

/** Triângulo da ponta da seta: a ponta fica exatamente no ponto (ax, ay) do objeto, vindo do rótulo (fx, fy). */
function arrowHeadPoints(ax: number, ay: number, fx: number, fy: number, size: number): [number, number][] {
  const dx = ax - fx;
  const dy = ay - fy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = ax - ux * size;
  const by = ay - uy * size;
  const px = -uy * size * 0.58;
  const py = ux * size * 0.58;
  return [[ax, ay], [bx + px, by + py], [bx - px, by - py]];
}

export function StoryPlayer({ story }: { story: StoryPlayerData }) {
  const { language: currentAppLanguage } = useAppLanguage();
  const storyLang = story.language || currentAppLanguage;
  const isFr = storyLang === "francais";
  // A história guarda o caminho original da imagem; o que é exibido depende do idioma (rótulos do SVG em francês).
  const displaySrc = getLanguageImageSrc(story.imageSrc, storyLang);
  const targetLangLabel = isFr ? "Français" : "Kreyòl";
  const targetLangUpper = isFr ? "FRANÇAIS" : "KREYÒL";

  const audioRef = useRef<HTMLAudioElement>(null);
  // Camadas do SVG animado usadas só durante a exportação (below/above estáticas, mid animada) e fundo desfocado em cache.
  // Quadro atual da camada de vida (pessoas, animais, barcos...) durante a exportação do vídeo.
  const lifeImageRef = useRef<HTMLImageElement | null>(null);
  const exportLayersRef = useRef<{ below: CanvasImageSource | null; mid: HTMLImageElement | null; above: CanvasImageSource | null } | null>(null);
  const exportBgRef = useRef<HTMLCanvasElement | null>(null);
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
  const [exportFormat, setExportFormat] = useState<ExportFormat>("stories");
  const [exporting, setExporting] = useState(false);
  // Progresso (0-100) e modo da exportação: "offline" = quadro a quadro (não depende do tempo real); "realtime" = gravação ao vivo.
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [exportMode, setExportMode] = useState<"offline" | "realtime" | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [muted, setMuted] = useState(false);
  /** Sons característicos dos elementos e do ambiente (pássaros, ondas, tambores...). */
  const [soundFx, setSoundFx] = useState(true);
  // Posição da legenda em % do quadro da cena (canto superior esquerdo). `null` = posição original (centralizada na parte inferior).
  const [captionPosition, setCaptionPosition] = useState<{ left: number; top: number } | null>(null);
  const [draggingCaption, setDraggingCaption] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [audioCors, setAudioCors] = useState<"anonymous" | undefined>("anonymous");
  const [audioLoadError, setAudioLoadError] = useState<string | null>(null);

  const handleAudioError = () => {
    if (audioCors === "anonymous") {
      setAudioCors(undefined);
    } else {
      console.warn("Falha no carregamento do áudio da história.");
      setAudioLoadError("Falha na reprodução do áudio. Clique para tentar novamente.");
    }
  };

  const retryAudio = () => {
    setAudioLoadError(null);
    setAudioCors(undefined);
    if (audioRef.current) {
      audioRef.current.load();
      void audioRef.current.play().catch(() => undefined);
      setPlaying(true);
    }
  };

  const socialCaption = useMemo(() => {
    const flag = isFr ? "🇫🇷" : "🇭🇹";
    const firstCap = story.captions[0];
    const quote = firstCap ? `"${firstCap.kreyol}" (${firstCap.portuguese})` : "";
    const tags = isFr ? "#frances #aprenderfrances #français #cultura" : "#kreyol #haiti #idiomas #cultura";
    return `✨ ${story.title} ${flag} 🇧🇷\nTema: ${story.theme}\n\n${quote}\n\n📖 Aprenda ${targetLangLabel} com histórias animadas e tradução sincronizada em português!\n${tags} #educacao #estudo`;
  }, [story.title, story.theme, isFr, targetLangLabel, story.captions]);

  function copySocialCaption() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(socialCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (displaySrc && (displaySrc.endsWith(".svg") || displaySrc.includes(".svg?"))) {
      fetch(displaySrc)
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
  }, [displaySrc]);

  // Divide o SVG em camadas: o fundo vira imagem estática (rasterizada uma vez) e só os elementos animados são redesenhados.
  const layerKit = useMemo(() => (svgContent ? buildSvgLayerKit(svgContent) : null), [svgContent]);
  const [layerUrls, setLayerUrls] = useState<{ kit: typeof layerKit; below: string | null; above: string | null }>({ kit: null, below: null, above: null });
  useEffect(() => {
    if (!layerKit) {
      setLayerUrls({ kit: null, below: null, above: null });
      return;
    }
    const toUrl = (markup: string | null) => (markup ? URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" })) : null);
    const urls = { kit: layerKit, below: toUrl(layerKit.below), above: toUrl(layerKit.above) };
    setLayerUrls(urls);
    return () => {
      if (urls.below) URL.revokeObjectURL(urls.below);
      if (urls.above) URL.revokeObjectURL(urls.above);
    };
  }, [layerKit]);

  // A duração que manda é a do áudio carregado no navegador. Se ele não a informar
  // (WebM gravado sem cabeçalho), vale a salva com a história e, por último, a última legenda.
  const lastCaptionEnd = story.captions.reduce((latest, caption) => Math.max(latest, caption.end), 0);
  const duration = mediaDuration || story.audioDuration || lastCaptionEnd || 0;

  // Tamanho real do palco: usado para o tamanho do texto dos rótulos e para afastar rótulos que se sobreporiam.
  const [stageSize, setStageSize] = useState({ w: 720, h: 405 });
  useEffect(() => {
    const element = playerViewportRef.current;
    if (!element) return;
    const update = () => setStageSize({ w: element.clientWidth || 720, h: element.clientHeight || 405 });
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const pillFontPx = Math.max(8, Math.min(12, stageSize.w * 0.0125));
  const bankImage = useBankImage(story.imageSrc);
  const sceneElements = useMemo(() => bankImage?.storyElements ?? bankImage?.elements ?? [], [bankImage]);
  const sceneLayout = useMemo(() => bankImage?.labelLayout ?? getStoryLabelLayout(story.imageSrc), [bankImage, story.imageSrc]);

  // Camada de VIDA: descobre onde há água/chão na imagem (qualquer imagem: banco, SVG ou gerada por IA)
  // e cria o "elenco" animado da cena. O mesmo render(t) alimenta o player e o vídeo exportado.
  const [sceneZones, setSceneZones] = useState<SceneZones | null>(null);
  useEffect(() => {
    let alive = true;
    let blobUrl: string | null = null;
    setSceneZones(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (alive) setSceneZones(analyzeSceneZones(img, img.naturalWidth || 1200, img.naturalHeight || 800));
    };
    img.onerror = () => undefined;
    if (svgContent) {
      blobUrl = URL.createObjectURL(new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" }));
      img.src = blobUrl;
    } else {
      img.src = displaySrc;
    }
    return () => {
      alive = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [displaySrc, svgContent]);
  // Pontos dos objetos que já têm rótulo (em px de 1200x800): os elementos novos nunca são colocados sobre os nomes existentes.
  const lifeAnchors = useMemo(
    () => (sceneLayout?.anchors ?? []).map((anchor) => ({ x: (anchor.left / 100) * 1200, y: (anchor.top / 100) * 800 })),
    [sceneLayout],
  );
  const lifeScene = useMemo(
    () => createSceneLife({
      sceneId: story.imageSrc, theme: story.theme, title: story.title, elements: sceneElements, zones: sceneZones,
      lang: isFr ? "fr" : "kreyol", anchors: lifeAnchors,
    }),
    [story.imageSrc, story.theme, story.title, sceneElements, sceneZones, isFr, lifeAnchors],
  );
  const lifeTick = Math.floor(currentTime * 30) / 30;
  // tamanho do texto dos nomes dos elementos animados: ~mesma altura aparente das pílulas dos rótulos, em qualquer tela
  const lifeLabelPx = Math.round(Math.max(22, Math.min(46, (pillFontPx * 1.3) / Math.max(0.2, Math.max(stageSize.w / 1200, stageSize.h / 800)))));
  const lifeMarkup = useMemo(() => {
    if (!lifeScene.actors.length) return "";
    try {
      return lifeScene.render(lifeTick, { labelPx: lifeLabelPx });
    } catch {
      return "";
    }
  }, [lifeScene, lifeTick, lifeLabelPx]);
  const timeline = useMemo(() => buildElementTimeline(sceneElements, story.elementCues, duration), [sceneElements, story.elementCues, duration]);

  // Há água na cena? Nas imagens do banco vale o mapa exato; nas geradas por IA, a análise de pixels.
  const sceneHasWater = useMemo(() => {
    const grid = getSceneGrid(story.imageSrc);
    if (grid) return grid.cells.reduce((n, c) => n + (c === WATER ? 1 : 0), 0) >= 40;
    return Boolean(sceneZones?.water);
  }, [story.imageSrc, sceneZones]);

  // Plano de sons da história: ambiente do tema + o som de cada elemento no instante em que o rótulo dele entra.
  const soundPlan = useMemo(
    () =>
      buildSoundPlan({
        theme: bankImage?.theme ?? story.theme,
        elements: timeline.map((element) => ({ kreyol: element.kreyol, start: element.start })),
        duration,
        hasWater: sceneHasWater,
        seed: `${story.imageSrc}|${story.title}`,
      }),
    [bankImage?.theme, story.theme, story.imageSrc, story.title, timeline, duration, sceneHasWater]
  );

  // Toca os sons enquanto a narração toca (agendados com 1 s de antecedência, acompanhando o áudio).
  useEffect(() => {
    if (!playing || !soundFx || muted || exporting || soundPlan.length === 0) return;
    const live = createLiveSoundscape(soundPlan);
    if (!live) return;
    const tick = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) live.tick(audio.currentTime);
    };
    tick();
    const timer = window.setInterval(tick, 250);
    return () => {
      window.clearInterval(timer);
      live.stop();
      live.dispose();
    };
  }, [playing, soundFx, muted, exporting, soundPlan]);

  const voiceData = useAudioVoiceActivity(story.audioUrl, story.captions);

  const activeCaptionIndex = story.captions.findIndex((c) => currentTime >= c.start && currentTime < c.end);
  const activeCaption = activeCaptionIndex >= 0 ? story.captions[activeCaptionIndex] : undefined;
  const frame = sceneFrame(currentTime, duration);

  const effectiveDuration = (audioRef.current && Number.isFinite(audioRef.current.duration) && audioRef.current.duration > 0)
    ? audioRef.current.duration
    : duration;
  const isAudioEnded = Boolean(audioRef.current?.ended);
  const isTimeNearEnd = effectiveDuration > 0 && currentTime >= Math.max(0, effectiveDuration - 0.08);
  const isVideoFinished = isEnded || isAudioEnded || (isTimeNearEnd && !playing);
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
        const effectiveDur = (Number.isFinite(audio.duration) && audio.duration > 0)
          ? audio.duration
          : duration;
        if (audio.ended || (effectiveDur > 0 && audio.currentTime >= effectiveDur - 0.08)) {
          setIsEnded(true);
          setPlaying(false);
        } else if (effectiveDur > 0 && audio.currentTime < effectiveDur - 0.3) {
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
        const effectiveDur = (Number.isFinite(audio.duration) && audio.duration > 0)
          ? audio.duration
          : duration;
        if (audio.ended || (effectiveDur > 0 && audio.currentTime >= effectiveDur - 0.08)) {
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
      const effectiveDur = (Number.isFinite(audio.duration) && audio.duration > 0)
        ? audio.duration
        : duration;
      if (audio.ended || isEnded || (effectiveDur > 0 && audio.currentTime >= effectiveDur - 0.08)) {
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

  function drawElementPills(
    context: CanvasRenderingContext2D,
    scene: { x: number; y: number; width: number; height: number },
    seconds: number,
    view: { x: number; y: number; w: number; h: number } = { x: scene.x, y: scene.y, w: scene.width, h: scene.height }
  ) {
    const activeCap = captionAt(story.captions, seconds);
    const captionText = activeCap ? `${activeCap.portuguese} ${activeCap.kreyol}` : "";
    // Rótulos discretos: pequenos, e o do elemento em destaque só um pouco maior.
    const isSquare = context.canvas.width === context.canvas.height;
    const activeFont = isSquare ? 20 : 31;
    const idleFont = Math.round(activeFont * 0.82);
    // O rótulo fica ACIMA do objeto (nunca em cima dele), ligado por um fio fino até o ponto do objeto.
    const lift = scene.height * 0.075;

    const rawAnchors = sceneLayout?.anchors;
    const anchors = rawAnchors && rawAnchors.length > 0
      ? rawAnchors
      : [{ left: 25, top: 30 }, { left: 75, top: 30 }, { left: 25, top: 70 }, { left: 75, top: 70 }];

    const items = timeline.map((element, index) => {
      const anchor = anchors[index % anchors.length];
      const label = getElementLabel(element, storyLang);
      const size = measureLivingPill(context, label, element.pt, activeFont);
      const ax = scene.x + scene.width * (anchor.left / 100);
      const ay = scene.y + scene.height * (anchor.top / 100);
      return { element, label, ax, ay, cx: ax, cy: ay - lift - size.height / 2, w: size.width * 1.06, h: size.height * 1.06 };
    });
    for (const item of items) {
      const visual = elementVisual(item.element, seconds);
      // Um rótulo por vez: os que ainda não entraram ou já saíram não são desenhados.
      if (visual.phase === "hidden" || visual.opacity <= 0.01) continue;
      // Fora da janela do vídeo (a câmera está em outro ponto da cena): não desenha.
      if (item.ax < view.x + 8 || item.ax > view.x + view.w - 8 || item.ay < view.y + 8 || item.ay > view.y + view.h - 8) continue;
      const isActive = visual.phase === "active";

      // Mantém a pílula INTEIRA dentro do quadro (nada cortado nas bordas).
      const fontSize = isActive ? activeFont : idleFont;
      const pill = measureLivingPill(context, item.label, item.element.pt, fontSize);
      const halfW = (pill.width * visual.scale * (isActive ? 1.05 : 1)) / 2 + 8;
      const halfH = (pill.height * visual.scale * (isActive ? 1.05 : 1)) / 2 + 8;
      const edge = Math.max(12, view.h * 0.03);
      const clampTo = (value: number, min: number, max: number) => (min > max ? (min + max) / 2 : Math.min(max, Math.max(min, value)));
      const centerX = clampTo(item.cx, view.x + edge + halfW, view.x + view.w - edge - halfW);
      const centerY = clampTo(item.cy, view.y + edge + halfH, view.y + view.h - edge - halfH);

      const livingState = calculateLivingElementState(
        item.element.pt,
        item.element.kreyol,
        seconds,
        captionText,
        isActive,
        item.label
      );

      // Fio fino do rótulo até o objeto (o ponto fica no objeto, o texto fica acima).
      context.save();
      context.globalAlpha = visual.opacity * (isActive ? 0.95 : 0.7);
      // Seta: fio com contorno escuro (legível sobre qualquer cenário) e ponta exatamente sobre o objeto.
      const headSize = (isActive ? 17 : 14) * (isSquare ? 1 : 1.35);
      const tip = arrowHeadPoints(item.ax, item.ay, centerX, centerY, headSize);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "rgba(18, 32, 26, .85)";
      context.lineWidth = isActive ? 6 : 5;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo((tip[1][0] + tip[2][0]) / 2, (tip[1][1] + tip[2][1]) / 2);
      context.stroke();
      context.strokeStyle = "#f5cf72";
      context.lineWidth = isActive ? 3 : 2.4;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo((tip[1][0] + tip[2][0]) / 2, (tip[1][1] + tip[2][1]) / 2);
      context.stroke();
      context.fillStyle = "#f5cf72";
      context.strokeStyle = "rgba(18, 32, 26, .9)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(tip[0][0], tip[0][1]);
      context.lineTo(tip[1][0], tip[1][1]);
      context.lineTo(tip[2][0], tip[2][1]);
      context.closePath();
      context.stroke();
      context.fill();
      context.restore();

      drawLivingElementOnCanvas(context, {
        centerX,
        centerY,
        kreyol: item.label,
        portuguese: item.element.pt,
        state: livingState,
        visualOpacity: visual.opacity * (isActive ? 1 : 0.88),
        visualScale: visual.scale,
        isActive,
        fontSize,
        icon: getElementIcon(item.element),
      });
    }
  }

  function drawCaptionBox(
    context: CanvasRenderingContext2D,
    targetText: string,
    portuguese: string,
    isTyping = false,
    exportW = EXPORT_WIDTH,
    exportH = EXPORT_HEIGHT
  ) {
    const isSquare = exportH === exportW;
    const maxTextWidth = exportW - 160;
    const maxBoxHeight = isSquare ? 230 : 365;
    let size = isSquare ? 20 : 22;
    let targetLines: string[] = [];
    let portugueseLines: string[] = [];
    let boxHeight = 0;
    const candidateSizes = isSquare ? [26, 23, 20, 18, 16] : [36, 32, 28, 25, 22];
    for (const candidate of candidateSizes) {
      context.font = `500 ${candidate}px system-ui, sans-serif`;
      const k = wrapLines(context, targetText, maxTextWidth);
      context.font = `500 ${candidate - 2}px system-ui, sans-serif`;
      const p = wrapLines(context, portuguese, maxTextWidth);
      const height = (isSquare ? 20 : 32) + (isSquare ? 26 : 38) + k.length * candidate * 1.25 + (isSquare ? 12 : 18) + (isSquare ? 26 : 38) + p.length * (candidate - 2) * 1.25 + (isSquare ? 18 : 26);
      size = candidate;
      targetLines = k;
      portugueseLines = p;
      boxHeight = height;
      if (height <= maxBoxHeight) break;
    }
    if (boxHeight > maxBoxHeight) {
      context.font = `500 ${size}px system-ui, sans-serif`;
      targetLines = wrapLines(context, targetText, maxTextWidth, 2);
      context.font = `500 ${size - 2}px system-ui, sans-serif`;
      portugueseLines = wrapLines(context, portuguese, maxTextWidth, 2);
      boxHeight = (isSquare ? 20 : 32) + (isSquare ? 26 : 38) + targetLines.length * size * 1.25 + (isSquare ? 12 : 18) + (isSquare ? 26 : 38) + portugueseLines.length * (size - 2) * 1.25 + (isSquare ? 18 : 26);
    }
    const boxBottomPadding = isSquare ? 45 : 130;
    const boxTop = exportH - boxBottomPadding - boxHeight;
    context.fillStyle = "rgba(9, 19, 16, .88)";
    context.beginPath();
    context.roundRect(54, boxTop, exportW - 108, boxHeight, isSquare ? 18 : 26);
    context.fill();
    context.strokeStyle = "rgba(245, 207, 114, .45)";
    context.lineWidth = 2;
    context.stroke();

    context.textAlign = "center";
    let y = boxTop + (isSquare ? 20 : 32) + (isSquare ? 18 : 24);
    context.fillStyle = "#f4c85b";
    context.font = `700 ${isSquare ? 20 : 27}px system-ui, sans-serif`;
    context.fillText(targetLangUpper, exportW / 2, y);
    context.fillStyle = "#ffffff";
    context.font = `500 ${size}px system-ui, sans-serif`;
    y += isSquare ? 10 : 14;
    for (const line of targetLines) {
      y += size * 1.25;
      context.fillText(line, exportW / 2, y - size * 0.25);
    }
    y += (isSquare ? 12 : 18) + (isSquare ? 18 : 24);
    context.fillStyle = "#4ade80";
    context.font = `700 ${isSquare ? 18 : 25}px system-ui, sans-serif`;
    context.fillText("PORTUGUÊS (AO VIVO)", exportW / 2, y);
    context.fillStyle = "#ffffff";
    context.font = `500 ${size - 2}px system-ui, sans-serif`;
    y += isSquare ? 10 : 14;
    for (let i = 0; i < portugueseLines.length; i++) {
      const line = portugueseLines[i];
      const isLast = i === portugueseLines.length - 1;
      const lineText = isTyping && isLast ? `${line} ▍` : line;
      y += (size - 2) * 1.25;
      context.fillText(lineText, exportW / 2, y - (size - 2) * 0.25);
    }
  }

  /** Onde a "câmera" do vídeo vertical está olhando (0–1, fração da largura da cena): desliza até o elemento em destaque. */
  function focusAt(seconds: number): number {
    const anchors = sceneLayout?.anchors ?? [];
    if (anchors.length === 0 || timeline.length === 0) return 0.5;
    const order = timeline
      .map((element, index) => ({ start: element.start, x: anchors[index % anchors.length].left / 100 }))
      .sort((a, b) => a.start - b.start);
    let current = -1;
    for (let i = 0; i < order.length; i++) if (order[i].start <= seconds) current = i;
    if (current < 0) return 0.5;
    const previousX = current > 0 ? order[current - 1].x : 0.5;
    const target = order[current];
    const slot = (order[current + 1]?.start ?? duration) - target.start;
    const travel = Math.max(0.25, Math.min(0.9, slot * 0.6));
    const p = Math.min(1, Math.max(0, (seconds - target.start) / travel));
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    return previousX + (target.x - previousX) * eased;
  }

  // Desenha o quadro do vídeo exportado para o instante `seconds` do ÁUDIO.
  function drawExportFrame(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    seconds: number,
    exportW = EXPORT_WIDTH,
    exportH = EXPORT_HEIGHT
  ) {
    const isSquare = exportH === exportW;
    const scene = sceneFrame(seconds, duration);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    const cachedBackground = exportBgRef.current;
    if (cachedBackground && cachedBackground.width === exportW && cachedBackground.height === exportH) {
      context.drawImage(cachedBackground, 0, 0);
    } else {
      context.clearRect(0, 0, exportW, exportH);
      context.fillStyle = "#172821";
      context.fillRect(0, 0, exportW, exportH);
      const backgroundScale = Math.max(exportW / image.width, exportH / image.height);
      const backgroundWidth = image.width * backgroundScale;
      const backgroundHeight = image.height * backgroundScale;
      context.save();
      context.filter = "blur(28px) brightness(.42)";
      context.drawImage(image, (exportW - backgroundWidth) / 2, (exportH - backgroundHeight) / 2, backgroundWidth, backgroundHeight);
      context.restore();
    }

    // Sombreado só no fundo e nas faixas de texto: a cena em si NÃO é escurecida (ficava sem nitidez).
    const shade = context.createLinearGradient(0, 0, 0, exportH);
    shade.addColorStop(0, "rgba(12, 24, 20, .32)");
    shade.addColorStop(0.48, "rgba(12, 24, 20, .04)");
    shade.addColorStop(0.72, "rgba(12, 24, 20, .22)");
    shade.addColorStop(1, "rgba(12, 24, 20, .92)");
    context.fillStyle = shade;
    context.fillRect(0, 0, exportW, exportH);

    // Stories (vertical): a cena ocupa a largura inteira, bem mais alta, e "acompanha" o elemento em destaque
    // (câmera que desliza até o objeto). Feed (quadrado): cena inteira como antes.
    let sceneX: number;
    let sceneY: number;
    let width: number;
    let height: number;
    let windowRect: { x: number; y: number; w: number; h: number };
    if (isSquare) {
      const baseScale = Math.min((exportW - 64) / image.width, 520 / image.height);
      width = image.width * baseScale * scene.zoom;
      height = image.height * baseScale * scene.zoom;
      sceneX = (exportW - width) / 2 + (scene.driftX / 100) * width;
      sceneY = 152 + (scene.driftY / 100) * height;
      windowRect = { x: sceneX, y: sceneY, w: width, h: height };
    } else {
      const winH = STORY_WINDOW_HEIGHT;
      windowRect = { x: 0, y: STORY_WINDOW_TOP, w: exportW, h: winH };
      height = winH * Math.max(1, scene.zoom);
      width = height * (image.width / image.height);
      const focus = focusAt(seconds);
      sceneX = Math.min(0, Math.max(exportW - width, exportW / 2 - focus * width));
      sceneY = windowRect.y + (winH - height) / 2 + (scene.driftY / 100) * height * 0.5;
    }

    context.save();
    context.beginPath();
    context.roundRect(windowRect.x, windowRect.y, windowRect.w, windowRect.h, isSquare ? 18 : 0);
    context.clip();
    const layers = exportLayersRef.current;
    if (layers) {
      if (layers.below) context.drawImage(layers.below, sceneX, sceneY, width, height);
      if (layers.mid) context.drawImage(layers.mid, sceneX, sceneY, width, height);
      if (layers.above) context.drawImage(layers.above, sceneX, sceneY, width, height);
    } else {
      context.drawImage(image, sceneX, sceneY, width, height);
    }
    // Camada de vida do instante atual (mesmo desenho que o player mostra).
    if (lifeImageRef.current) context.drawImage(lifeImageRef.current, sceneX, sceneY, width, height);
    context.restore();

    context.strokeStyle = "rgba(255,255,255,.24)";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(windowRect.x, windowRect.y, windowRect.w, windowRect.h, isSquare ? 18 : 0);
    context.stroke();

    const barY = isSquare ? 42 : 74;
    context.fillStyle = "rgba(12, 24, 20, .72)";
    context.fillRect(54, barY, exportW - 108, 4);
    context.fillStyle = "#f4c85b";
    context.fillRect(54, barY, (exportW - 108) * scene.progress, 4);

    context.textAlign = "left";
    context.fillStyle = "#f4c85b";
    context.font = `700 ${isSquare ? 20 : 25}px system-ui, sans-serif`;
    const studioBadge = isFr ? "FRANÇAIS STUDIO" : "KREYÒL STUDIO";
    context.fillText(`${story.theme.toLocaleUpperCase()}  ·  ${studioBadge}`, 56, isSquare ? 80 : 142);

    context.fillStyle = "#ffffff";
    context.font = isSquare ? "700 36px Georgia, serif" : "700 56px Georgia, serif";
    const words = story.title.split(" ");
    let titleLine = "";
    let titleY = isSquare ? 122 : 220;
    const titleLineHeight = isSquare ? 42 : 68;
    const maxTitleLines = isSquare ? 1 : 2;
    let linesDrawn = 0;
    for (const word of words) {
      const test = `${titleLine}${word} `;
      if (context.measureText(test).width > exportW - 140) {
        if (linesDrawn < maxTitleLines) {
          context.fillText(titleLine.trim(), 56, titleY);
          titleLine = `${word} `;
          titleY += titleLineHeight;
          linesDrawn++;
        }
      } else titleLine = test;
    }
    if (linesDrawn < maxTitleLines && titleLine.trim()) {
      context.fillText(titleLine.trim(), 56, titleY);
    }

    drawElementPills(context, { x: sceneX, y: sceneY, width, height }, seconds, windowRect);

    const captionIndex = story.captions.findIndex((c) => seconds >= c.start && seconds < c.end);
    const caption = captionIndex >= 0 ? story.captions[captionIndex] : undefined;
    if (caption && (!duration || seconds < duration - 0.1)) {
      const snapshot = computeCaptionTyping(caption, seconds, captionIndex, voiceData);
      drawCaptionBox(context, caption.kreyol, snapshot.visiblePt, snapshot.isTyping, exportW, exportH);
    }

    context.textAlign = "left";
    context.fillStyle = "rgba(255,255,255,.78)";
    context.font = `500 ${isSquare ? 18 : 24}px system-ui, sans-serif`;
    context.fillText(isFr ? "Français Interactif" : "Kreyòl Ayisyen", 56, exportH - (isSquare ? 20 : 68));
  }

  async function deliverExport(
    blob: Blob,
    isMp4: boolean,
    isStories: boolean,
    destination: "download" | "whatsapp" | "instagram" | "facebook"
  ) {
    const extension = isMp4 ? "mp4" : "webm";
    const cleanTitle = story.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "historia";
    const filename = `${cleanTitle}-${isStories ? "stories-9x16" : "feed-1x1"}.${extension}`;

    const file = new File([blob], filename, { type: blob.type });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    if (destination === "whatsapp") {
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: story.title,
            text: socialCaption,
          });
          setExportNotice("Compartilhado com sucesso no WhatsApp!");
        } catch (err: any) {
          if (err?.name !== "AbortError") {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(socialCaption)}`, "_blank");
            setExportNotice("Vídeo baixado! Abrindo WhatsApp com a legenda pronta.");
          }
        }
      } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(socialCaption)}`, "_blank");
        setExportNotice("Vídeo baixado! WhatsApp aberto com a legenda pronta para colar e anexar.");
      }
    } else if (destination === "instagram") {
      copySocialCaption();
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: story.title,
            text: socialCaption,
          });
          setExportNotice("Compartilhado com sucesso para o Instagram!");
        } catch (err: any) {
          if (err?.name !== "AbortError") {
            window.open("https://www.instagram.com/", "_blank");
            setExportNotice("Vídeo baixado e legenda copiada! Abra o Instagram e cole a legenda.");
          }
        }
      } else {
        window.open("https://www.instagram.com/", "_blank");
        setExportNotice("Vídeo baixado e legenda copiada! Cole no Instagram ao publicar.");
      }
    } else if (destination === "facebook") {
      copySocialCaption();
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: story.title,
            text: socialCaption,
          });
          setExportNotice("Compartilhado com sucesso para o Facebook!");
        } catch (err: any) {
          if (err?.name !== "AbortError") {
            window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(socialCaption)}`, "_blank");
            setExportNotice("Vídeo baixado e legenda copiada! Publicando no Facebook.");
          }
        }
      } else {
        window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(socialCaption)}`, "_blank");
        setExportNotice("Vídeo baixado e legenda copiada! Abra o Facebook para publicar.");
      }
    } else {
      setExportNotice(`Vídeo ${isStories ? "Stories (9:16)" : "Feed (1:1)"} baixado com sucesso!`);
    }

    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  /**
   * Exportação quadro a quadro (WebCodecs): cada quadro é desenhado no instante exato (i/30 s), codificado e
   * gravado no MP4, sem depender do tempo real. Se o computador demorar mais para desenhar um quadro, o vídeo
   * continua perfeito (só leva mais tempo para ficar pronto) — nada de quadros perdidos nem vídeo congelado.
   * Devolve null se o navegador não oferecer H.264 + AAC via WebCodecs (aí usa-se a gravação em tempo real).
   */
  async function renderOfflineMp4(params: {
    context: CanvasRenderingContext2D;
    image: HTMLImageElement;
    exportW: number;
    exportH: number;
    isStories: boolean;
  }): Promise<Blob | null> {
    const { context, image, exportW, exportH, isStories } = params;
    if (
      typeof VideoEncoder === "undefined" ||
      typeof AudioEncoder === "undefined" ||
      typeof VideoFrame === "undefined" ||
      typeof AudioData === "undefined" ||
      typeof OfflineAudioContext === "undefined" ||
      !story.audioUrl
    ) {
      return null;
    }

    const fps = 30;
    const sampleRate = 48000;

    let videoConfig: VideoEncoderConfig | null = null;
    for (const codec of ["avc1.64002A", "avc1.4D002A", "avc1.42002A"]) {
      const candidate: VideoEncoderConfig = {
        codec,
        width: exportW,
        height: exportH,
        bitrate: isStories ? 16_000_000 : 12_000_000,
        framerate: fps,
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

    const audioSupported = async (channels: number) => {
      try {
        return Boolean((await AudioEncoder.isConfigSupported({ codec: "mp4a.40.2", sampleRate, numberOfChannels: channels, bitrate: 192_000 })).supported);
      } catch {
        return false;
      }
    };
    if (!(await audioSupported(2))) return null;

    // Áudio: decodifica a narração inteira e reamostra para 48 kHz.
    const response = await fetch(story.audioUrl, { mode: "cors" });
    if (!response.ok) throw new Error("Não foi possível carregar a narração para exportar.");
    const audioBuffer = await new OfflineAudioContext(2, sampleRate, sampleRate).decodeAudioData(await response.arrayBuffer());
    const channels = Math.min(2, audioBuffer.numberOfChannels);
    const channelData = Array.from({ length: channels }, (_, channel) => audioBuffer.getChannelData(channel));
    // Sons característicos dos elementos e do ambiente entram no áudio do vídeo exportado.
    if (soundFx) await mixSoundPlanInto(channelData, sampleRate, soundPlan);

    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
      target,
      video: { codec: "avc", width: exportW, height: exportH, frameRate: fps },
      audio: { codec: "aac", numberOfChannels: channels, sampleRate },
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

    try {
      videoEncoder.configure(videoConfig);
      audioEncoder.configure({ codec: "mp4a.40.2", sampleRate, numberOfChannels: channels, bitrate: 192_000 });

      // Entrega o áudio aos poucos, acompanhando o vídeo, para o MP4 ficar bem intercalado.
      let audioOffset = 0;
      const feedAudioUntil = (seconds: number) => {
        const limit = Math.min(audioBuffer.length, Math.floor(seconds * sampleRate));
        while (audioOffset < limit) {
          const frames = Math.min(4800, audioBuffer.length - audioOffset);
          const planar = new Float32Array(frames * channels);
          channelData.forEach((data, channel) => planar.set(data.subarray(audioOffset, audioOffset + frames), channel * frames));
          const chunk = new AudioData({
            format: "f32-planar",
            sampleRate,
            numberOfFrames: frames,
            numberOfChannels: channels,
            timestamp: Math.round((audioOffset / sampleRate) * 1e6),
            data: planar,
          });
          audioEncoder.encode(chunk);
          chunk.close();
          audioOffset += frames;
        }
      };

      const totalFrames = Math.max(1, Math.ceil((audioBuffer.duration + 0.4) * fps));
      const layers = exportLayersRef.current;
      const secondsAt = (index: number) => Math.min(index / fps, duration || audioBuffer.duration);
      let nextMid = layers && layerKit ? loadSvgImage(layerKit.frozen(0), 8000) : null;
      const life = lifeScene.actors.length ? lifeScene : null;
      let nextLife = life ? loadSvgImage(lifeSvgDocument(life.render(secondsAt(0))), 8000) : null;

      for (let index = 0; index < totalFrames; index++) {
        if (encoderError) throw encoderError;
        const seconds = secondsAt(index);

        if (layers && layerKit && nextMid) {
          const midImage = await nextMid;
          nextMid = index + 1 < totalFrames ? loadSvgImage(layerKit.frozen(secondsAt(index + 1)), 8000) : null;
          if (midImage) {
            const previous = layers.mid;
            layers.mid = midImage;
            releaseSvgImage(previous);
          }
        }

        if (life && nextLife) {
          const lifeImage = await nextLife;
          nextLife = index + 1 < totalFrames ? loadSvgImage(lifeSvgDocument(life.render(secondsAt(index + 1))), 8000) : null;
          if (lifeImage) {
            const previousLife = lifeImageRef.current;
            lifeImageRef.current = lifeImage;
            releaseSvgImage(previousLife);
          }
        }

        drawExportFrame(context, image, seconds, exportW, exportH);

        const frame = new VideoFrame(context.canvas as HTMLCanvasElement, {
          timestamp: Math.round((index * 1e6) / fps),
          duration: Math.round(1e6 / fps),
        });
        videoEncoder.encode(frame, { keyFrame: index % (fps * 2) === 0 });
        frame.close();
        feedAudioUntil(seconds + 0.5);

        while (videoEncoder.encodeQueueSize > 6) {
          await new Promise<void>((resolve) => videoEncoder.addEventListener("dequeue", () => resolve(), { once: true }));
          if (encoderError) throw encoderError;
        }
        if (index % 5 === 0) setExportProgress(Math.min(99, Math.round((index / totalFrames) * 100)));
      }

      feedAudioUntil(Number.POSITIVE_INFINITY);
      await videoEncoder.flush();
      await audioEncoder.flush();
      if (encoderError) throw encoderError;
      muxer.finalize();
      return new Blob([target.buffer], { type: "video/mp4" });
    } finally {
      if (videoEncoder.state !== "closed") videoEncoder.close();
      if (audioEncoder.state !== "closed") audioEncoder.close();
    }
  }

  async function exportVideo(
    targetFormat: ExportFormat = exportFormat,
    destination: "download" | "whatsapp" | "instagram" | "facebook" = "download"
  ) {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;
    setExportError(null);
    setExportNotice(null);

    const isStories = targetFormat === "stories";
    const exportW = 1080;
    const exportH = isStories ? 1920 : 1080;
    canvas.width = exportW;
    canvas.height = exportH;

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
    let producing = false;

    const onVisibility = () => {
      if (document.hidden) {
        failure = new Error("A exportação foi cancelada porque a aba ficou em segundo plano. Mantenha esta aba aberta e visível até o fim.");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    try {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = displaySrc;
      await image.decode();

      // Fundo desfocado: calculado uma única vez (aplicar o blur a cada quadro era a parte mais pesada da exportação).
      const background = document.createElement("canvas");
      background.width = exportW;
      background.height = exportH;
      const backgroundContext = background.getContext("2d");
      if (backgroundContext) {
        backgroundContext.fillStyle = "#172821";
        backgroundContext.fillRect(0, 0, exportW, exportH);
        const backgroundScale = Math.max(exportW / image.width, exportH / image.height);
        const backgroundWidth = image.width * backgroundScale;
        const backgroundHeight = image.height * backgroundScale;
        backgroundContext.filter = "blur(28px) brightness(.42)";
        backgroundContext.drawImage(image, (exportW - backgroundWidth) / 2, (exportH - backgroundHeight) / 2, backgroundWidth, backgroundHeight);
        exportBgRef.current = background;
      }

      // Cena em camadas: fundo e primeiro plano rasterizados uma vez; só os elementos animados (drone, moinho,
      // robô, pássaros...) são redesenhados, congelados no instante exato do áudio.
      exportLayersRef.current = null;
      if (layerKit) {
        try {
          const rasterWidth = Math.round(exportW * 1.5);
          const rasterHeight = Math.round((rasterWidth * image.naturalHeight) / Math.max(1, image.naturalWidth));
          const [belowImage, aboveImage, firstFrame] = await Promise.all([
            layerKit.below ? loadSvgImage(layerKit.below, 8000) : Promise.resolve(null),
            layerKit.above ? loadSvgImage(layerKit.above, 8000) : Promise.resolve(null),
            loadSvgImage(layerKit.frozen(0), 8000),
          ]);
          const complete = firstFrame && (!layerKit.below || belowImage) && (!layerKit.above || aboveImage);
          if (complete) {
            exportLayersRef.current = {
              below: belowImage ? rasterizeLayer(belowImage, rasterWidth, rasterHeight) : null,
              mid: firstFrame,
              above: aboveImage ? rasterizeLayer(aboveImage, rasterWidth, rasterHeight) : null,
            };
            producing = true;
          } else {
            releaseSvgImage(firstFrame);
          }
          releaseSvgImage(belowImage);
          releaseSvgImage(aboveImage);
        } catch {
          exportLayersRef.current = null;
          producing = false;
        }
      }
      // Caminho principal: renderização quadro a quadro (não trava, não perde quadros).
      try {
        setExportMode("offline");
        setExportProgress(0);
        const offlineBlob = await renderOfflineMp4({ context, image, exportW, exportH, isStories });
        if (offlineBlob) {
          setExportProgress(100);
          await deliverExport(offlineBlob, true, isStories, destination);
          return;
        }
      } catch (offlineError) {
        console.warn("Exportação quadro a quadro falhou ou não é suportada neste navegador, recorrendo à gravação em tempo real:", offlineError);
      }
      setExportMode("realtime");
      setExportProgress(null);

      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      drawExportFrame(context, image, 0, exportW, exportH);
      const canvasStream = canvas.captureStream(30);
      const { ctx: audioCtx, dest } = getAudioCapture(audio);
      if (audioCtx.state === "suspended") await audioCtx.resume();
      const stream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
      const mimeType = await pickRecorderMime(stream);
      if (!mimeType) throw new Error("Este navegador não oferece codificação de vídeo compatível para exportação.");
      const mp4Type = mimeType.startsWith("video/mp4") ? mimeType : undefined;
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: isStories ? 14_000_000 : 10_000_000, audioBitsPerSecond: 192_000 });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = (event) => {
        const detail = (event as unknown as { error?: DOMException }).error;
        console.error("MediaRecorder error:", detail?.name, detail?.message, "mimeType:", mimeType);
        failure = new Error(`O navegador interrompeu a gravação do vídeo${detail?.name ? ` (${detail.name})` : ""}.`);
      };
      const finished = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });
      recorder.start(1000);
      await audio.play();

      if (producing && layerKit) {
        const kit = layerKit;
        void (async () => {
          const interval = 1000 / 30;
          while (producing) {
            const started = performance.now();
            // loadSvgImage nunca fica pendurada (tem tempo limite): se um quadro falhar, o loop segue para o próximo.
            const frame = await loadSvgImage(kit.frozen(audio.currentTime + 0.03), 1200);
            const layers = exportLayersRef.current;
            if (frame && producing && layers) {
              const previous = layers.mid;
              layers.mid = frame;
              releaseSvgImage(previous);
            } else {
              releaseSvgImage(frame);
            }
            await new Promise((resolve) => setTimeout(resolve, Math.max(0, interval - (performance.now() - started))));
          }
        })();
      }

      if (producing && lifeScene.actors.length) {
        const lifeSource = lifeScene;
        void (async () => {
          const interval = 1000 / 30;
          while (producing) {
            const started = performance.now();
            const lifeImage = await loadSvgImage(lifeSvgDocument(lifeSource.render(audio.currentTime + 0.03)), 1200);
            if (lifeImage && producing) {
              const previousLife = lifeImageRef.current;
              lifeImageRef.current = lifeImage;
              releaseSvgImage(previousLife);
            } else {
              releaseSvgImage(lifeImage);
            }
            await new Promise((resolve) => setTimeout(resolve, Math.max(0, interval - (performance.now() - started))));
          }
        })();
      }

      await new Promise<void>((resolve) => {
        let lastDraw = 0;
        const draw = (now: number) => {
          // ~30 quadros/s estáveis: desenhar a 60 quadros/s só sobrecarrega o navegador sem ganho no vídeo.
          if (now - lastDraw >= 30) {
            lastDraw = now;
            drawExportFrame(context, image, audio.currentTime, exportW, exportH);
          }
          if (!failure && !audio.ended && !audio.paused) animationRef.current = requestAnimationFrame(draw);
          else resolve();
        };
        animationRef.current = requestAnimationFrame(draw);
      });
      const completed = audio.ended;
      producing = false;
      if (completed) {
        drawExportFrame(context, image, duration, exportW, exportH);
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      if (recorder.state !== "inactive") recorder.stop();
      const blob = await finished;
      canvasStream.getTracks().forEach((track) => track.stop()); // não parar a trilha de áudio: ela é reutilizada nas próximas exportações
      if (failure) throw failure;
      if (!completed) throw new Error("A narração foi interrompida antes do fim; o vídeo não foi gerado. Tente exportar novamente.");

      await deliverExport(blob, Boolean(mp4Type), isStories, destination);
      if (!mp4Type) setExportError("Vídeo exportado em WebM. Recomendamos converter para MP4 se publicar diretamente no Instagram.");
    } catch (error) {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      setExportError(error instanceof Error ? error.message : "Não foi possível exportar o vídeo.");
    } finally {
      document.removeEventListener("visibilitychange", onVisibility);
      producing = false;
      releaseSvgImage(exportLayersRef.current?.mid);
      exportLayersRef.current = null;
      releaseSvgImage(lifeImageRef.current);
      lifeImageRef.current = null;
      exportBgRef.current = null;
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      audio.pause();
      audio.currentTime = 0;
      audio.muted = wasMuted;
      setCurrentTime(0);
      setPlaying(false);
      setExporting(false);
      setExportMode(null);
      setExportProgress(null);
    }
  }

  // Os rótulos aparecem um por vez, então não há o que afastar: cada um fica logo ACIMA do seu objeto.
  // O limite de borda (nada cortado) é aplicado na hora de desenhar, com o tamanho real da pílula.
  const labelLift = useMemo(
    () => 7.5 + ((pillFontPx * 2.3) / 2 / Math.max(1, stageSize.h)) * 100,
    [pillFontPx, stageSize.h]
  );

  // Tamanho real (px) de cada pílula, medido no DOM; serve para mantê-la inteira dentro do palco.
  const [labelSizes, setLabelSizes] = useState<Record<number, { w: number; h: number }>>({});
  const measureLabel = (index: number, el: HTMLDivElement | null) => {
    if (!el) return;
    const next = { w: el.offsetWidth, h: el.offsetHeight };
    setLabelSizes((prev) => {
      const old = prev[index];
      if (old && Math.abs(old.w - next.w) <= 1 && Math.abs(old.h - next.h) <= 1) return prev;
      return { ...prev, [index]: next };
    });
  };

  const durationLabel = formatStoryTime(duration);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
      <section className="overflow-hidden rounded-xl border border-[#273a31] bg-[#101b17] text-white shadow-xl">
        <div ref={playerViewportRef} className="relative aspect-video overflow-hidden bg-[#172821]">
          <div className="absolute inset-0 will-change-transform" style={{ transform: `translate(${frame.driftX}%, ${frame.driftY}%) scale(${1.03 * frame.zoom})` }}>
            {svgContent && layerKit && layerUrls.kit === layerKit ? (
              <div className="relative h-full w-full">
                {layerUrls.below && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={layerUrls.below} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" />
                )}
                <div
                  className={`absolute inset-0 [&>svg]:h-full [&>svg]:w-full ${
                    playing ? "" : "[&_*]:[animation-play-state:paused!important]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: layerKit.live }}
                />
                {layerUrls.above && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={layerUrls.above} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" />
                )}
              </div>
            ) : svgContent ? (
              <div
                className={`h-full w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:object-cover ${
                  playing ? "" : "[&_*]:[animation-play-state:paused!important]"
                }`}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <NextImage src={displaySrc} alt={story.title} fill unoptimized className="object-cover" />
            )}
          </div>
          {lifeMarkup && (
            <svg
              aria-hidden="true"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ transform: `translate(${frame.driftX}%, ${frame.driftY}%) scale(${1.03 * frame.zoom})` }}
              dangerouslySetInnerHTML={{ __html: lifeMarkup }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35 pointer-events-none" />
          <div className="absolute left-4 top-4 sm:left-5 sm:top-5 flex flex-wrap items-center gap-2 z-20">
            <span className="rounded-md bg-[#14251e]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5cf72] border border-[#f5cf72]/30 shadow-sm">{story.theme}</span>
            <span className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[10px] text-white/90 font-medium">
              {targetLangUpper} · PT
            </span>
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
            const rawAnchors = sceneLayout?.anchors;
            const anchors = rawAnchors && rawAnchors.length > 0
              ? rawAnchors
              : [{ left: 25, top: 30 }, { left: 75, top: 30 }, { left: 25, top: 70 }, { left: 75, top: 70 }];
            const anchor = anchors[index % anchors.length];
            const imageScale = 1.03 * frame.zoom;
            const imageCrop = 16 / 9 / (1200 / 800);

            const elementTargetLabel = getElementLabel(element, storyLang);
            // Rótulo ESTÁVEL (igual ao vídeo baixado): o texto não balança, não gira e não pula; só a câmera da cena o move.
            const rawLeft = 50 + (anchor.left - 50) * imageScale + frame.driftX;
            const rawTop = 50 + (anchor.top - 50) * imageCrop * imageScale + frame.driftY - labelLift;

            // Mantém a pílula INTEIRA dentro do palco (nada cortado nas bordas) e abaixo da faixa de títulos do topo.
            const labelScale = visual.scale * (active ? 1.05 : 1);
            const measured = labelSizes[index];
            const labelChars = elementTargetLabel.length + element.pt.length + 3;
            const labelW = (measured?.w ?? pillFontPx * (0.62 * labelChars + 4.5)) * labelScale + 8;
            const labelH = (measured?.h ?? pillFontPx * 2.3) * labelScale + 8;
            const edgePad = 6;
            const topSafe = stageSize.h >= 300 ? 52 : 38;
            const clampPx = (value: number, min: number, max: number) => (min > max ? (min + max) / 2 : Math.min(max, Math.max(min, value)));
            const leftPx = clampPx((rawLeft / 100) * stageSize.w, edgePad + labelW / 2, stageSize.w - edgePad - labelW / 2);
            const topPx = clampPx((rawTop / 100) * stageSize.h, topSafe + labelH / 2, stageSize.h - edgePad - labelH / 2);
            const left = (leftPx / stageSize.w) * 100;
            const top = (topPx / stageSize.h) * 100;

            const anchorLeftPct = 50 + (anchor.left - 50) * imageScale + frame.driftX;
            const anchorTopPct = 50 + (anchor.top - 50) * imageCrop * imageScale + frame.driftY;

            return (
              <Fragment key={`${element.kreyol}-${index}`}>
              {visual.opacity > 0.01 && (
                <svg
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                  viewBox={`0 0 ${stageSize.w} ${stageSize.h}`}
                  aria-hidden="true"
                  style={{ opacity: visual.opacity * (active ? 0.95 : 0.7) }}
                >
                  {(() => {
                    const ax = (anchorLeftPct / 100) * stageSize.w;
                    const ay = (anchorTopPct / 100) * stageSize.h;
                    const lx = (left / 100) * stageSize.w;
                    const ly = (top / 100) * stageSize.h;
                    const head = arrowHeadPoints(ax, ay, lx, ly, active ? 9 : 7.5);
                    const bx = (head[1][0] + head[2][0]) / 2;
                    const by = (head[1][1] + head[2][1]) / 2;
                    const pts = head.map((p) => p.join(",")).join(" ");
                    return (
                      <>
                        <line x1={lx} y1={ly} x2={bx} y2={by} stroke="rgba(18,32,26,.85)" strokeWidth={active ? 4.4 : 3.8} strokeLinecap="round" />
                        <line x1={lx} y1={ly} x2={bx} y2={by} stroke="#f5cf72" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" />
                        <polygon points={pts} fill="#f5cf72" stroke="rgba(18,32,26,.9)" strokeWidth={1.4} strokeLinejoin="round" />
                      </>
                    );
                  })()}
                </svg>
              )}
              <div
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none transition-opacity duration-300 will-change-transform"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  opacity: visual.opacity,
                  transform: `translate(-50%, -50%) scale(${labelScale})`,
                  transformOrigin: "center center",
                }}
              >
                {active && (
                  <div
                    className="absolute inset-0 -m-2 rounded-full bg-[#f5cf72]/30 blur-md pointer-events-none"
                    style={{ opacity: 0.7 }}
                  />
                )}

                <div
                  ref={(el) => measureLabel(index, el)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-[0.9em] py-[0.55em] leading-none shadow-lg backdrop-blur-md transition-colors duration-300 ${
                    active
                      ? "border-[#f5cf72] bg-[#f5cf72] text-[#18241d] font-bold ring-2 ring-[#f5cf72]/60 shadow-[0_0_18px_rgba(245,207,114,0.5)]"
                      : "border-white/35 bg-[#12221b]/92 text-white/95"
                  }`}
                  style={{ fontSize: `${pillFontPx}px` }}
                >
                  <span style={{ fontSize: "1.15em" }} aria-hidden="true">{getElementIcon(element)}</span>
                  <span className={`font-bold ${active ? "text-[#18241d]" : "text-[#f5cf72]"}`}>
                    {elementTargetLabel}
                  </span>
                  <span className={`px-0.5 ${active ? "text-[#18241d]/60" : "text-white/60"}`}>·</span>
                  <span className={active ? "text-[#18241d]" : "text-white"}>{element.pt}</span>
                </div>
              </div>
              </Fragment>
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
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#f5cf72]/45 to-transparent" />

                <div
                  className="absolute right-2 top-2 flex items-center gap-1 text-white/35 opacity-40 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                  title="Arraste para mover a legenda"
                  aria-hidden="true"
                >
                  <GripHorizontal className="h-3 w-3" />
                </div>

                {language !== "pt" && (
                  <div className="flex items-center gap-1.5 pr-5 mb-1">
                    <span className="shrink-0 rounded bg-[#f5cf72]/20 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#f5cf72] border border-[#f5cf72]/30">
                      {targetLangLabel}
                    </span>
                    <p className="text-xs sm:text-[13px] font-medium leading-tight text-[#fde68a]/90 drop-shadow-sm truncate">
                      {displayedTypingData.kreyol}
                    </p>
                  </div>
                )}

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
                  : `Ouça a narração em ${targetLangLabel} com tradução sincronizada`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" title={captionsEnabled ? "Ocultar legendas" : "Mostrar legendas"} onClick={() => setCaptionsEnabled((enabled) => !enabled)} className={`flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs ${captionsEnabled ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10"}`}><Languages className="h-4 w-4" /> Legendas
              </button>{captionPosition && 
              <button type="button" title="Voltar a legenda para a posição original" onClick={() => setCaptionPosition(null)} className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs text-white/70 hover:bg-white/10"><Undo2 className="h-4 w-4" /> Reposicionar
              </button>}
              <button type="button" title={soundFx ? "Desligar os sons da cena" : "Ligar os sons da cena (pássaros, ondas, tambores...)"} onClick={() => setSoundFx((enabled) => !enabled)} className={`flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs ${soundFx ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10"}`} aria-pressed={soundFx}><Sparkles className="h-4 w-4" /> Sons da cena
              </button>
              <button type="button" title={muted ? "Ativar som" : "Silenciar"} disabled={exporting} onClick={() => { const next = !muted; setMuted(next); if (audioRef.current) audioRef.current.muted = next; }} className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 disabled:opacity-50" aria-label={muted ? "Ativar som" : "Silenciar"}>{muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {audioLoadError && (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-red-950/70 border border-red-500/40 p-2.5 text-xs text-red-200">
              <span>{audioLoadError}</span>
              <button
                type="button"
                onClick={retryAudio}
                className="shrink-0 rounded bg-red-800/80 hover:bg-red-700 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </section>
      <aside className="flex flex-col gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">
            Ouvir e compreender
          </p>
          <h2 className="mt-1 text-lg font-bold text-[var(--text)]">
            A história, na sua língua
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            A narração é em {targetLangLabel}. A tradução acompanha cada fala em português, sincronizada ao áudio.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-1 rounded-md bg-[var(--surface-2)] p-1">
            {([
              ["both", "Ambas"],
              ["pt", "Português"],
              ["ht", targetLangLabel],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setLanguage(value)}
                className={`rounded px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                  language === value
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Publicar e Baixar nas Redes Sociais */}
        <div className="rounded-xl border border-[#d6b45b]/40 bg-[#f5cf72]/10 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9d7622]">
              Leve a aventura
            </p>
            <span className="flex items-center gap-1 rounded-full bg-[#f5cf72]/20 px-2 py-0.5 text-[10px] font-semibold text-[#8a6316]">
              <Share2 className="h-3 w-3" /> Redes Sociais
            </span>
          </div>

          <h2 className="mt-1 text-lg font-bold text-[var(--text)]">
            Publicar e Baixar
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Exporte o vídeo com legendas e animações sincronizadas no formato ideal para Feed ou Stories e publique no Instagram, WhatsApp ou Facebook.
          </p>

          {/* Seletor de Formato: Stories (9:16) ou Feed (1:1) */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setExportFormat("stories")}
              disabled={exporting}
              className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-semibold transition-all ${
                exportFormat === "stories"
                  ? "border-[#f5cf72] bg-[#1d3028] text-[#f5cf72] shadow-sm"
                  : "border-black/10 bg-white/40 text-[var(--text-muted)] hover:bg-white/70 dark:bg-black/20"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>📱 Stories (9:16)</span>
            </button>
            <button
              type="button"
              onClick={() => setExportFormat("feed")}
              disabled={exporting}
              className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-semibold transition-all ${
                exportFormat === "feed"
                  ? "border-[#f5cf72] bg-[#1d3028] text-[#f5cf72] shadow-sm"
                  : "border-black/10 bg-white/40 text-[var(--text-muted)] hover:bg-white/70 dark:bg-black/20"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>🖼️ Feed (1:1)</span>
            </button>
          </div>

          {/* Botão Baixar Vídeo */}
          <button
            type="button"
            onClick={() => void exportVideo(exportFormat, "download")}
            disabled={exporting || !(duration > 0)}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1d3028] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#29463a] disabled:cursor-wait disabled:opacity-60 shadow-sm"
          >
            <Download className="h-4 w-4" />
            {exporting
              ? exportMode === "offline" && exportProgress !== null
                ? `Renderizando ${exportProgress}%…`
                : `Gravando ${exportFormat === "stories" ? "Stories (9:16)" : "Feed (1:1)"}…`
              : `Baixar Vídeo (${exportFormat === "stories" ? "Stories 9:16" : "Feed 1:1"})`}
          </button>

          {/* Botões de Redes Sociais */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              title="Publicar no WhatsApp (Status e Grupos)"
              onClick={() => void exportVideo(exportFormat, "whatsapp")}
              disabled={exporting || !(duration > 0)}
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-600/10 hover:bg-emerald-600/20 py-2 px-1 text-emerald-800 dark:text-emerald-300 transition-colors disabled:opacity-50"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </button>

            <button
              type="button"
              title="Publicar no Instagram (Stories e Feed)"
              onClick={() => void exportVideo(exportFormat, "instagram")}
              disabled={exporting || !(duration > 0)}
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 py-2 px-1 text-pink-900 dark:text-pink-300 transition-colors disabled:opacity-50"
            >
              <Share2 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              <span className="text-[10px] font-bold">Instagram</span>
            </button>

            <button
              type="button"
              title="Publicar no Facebook (Feed e Stories)"
              onClick={() => void exportVideo(exportFormat, "facebook")}
              disabled={exporting || !(duration > 0)}
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20 py-2 px-1 text-blue-800 dark:text-blue-300 transition-colors disabled:opacity-50"
            >
              <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold">Facebook</span>
            </button>
          </div>

          {/* Copiar Legenda Formatada */}
          <button
            type="button"
            onClick={copySocialCaption}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-[#d6b45b]/50 bg-white/60 dark:bg-black/20 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-white transition-colors"
          >
            {copiedCaption ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedCaption ? "Legenda copiada!" : "Copiar texto da postagem (hashtags e tradução)"}</span>
          </button>

          {exporting && (
            <LoadingSpinner
              layout="inline"
              size="sm"
              label={`${exportMode === "offline" ? "Renderizando" : "Gravando"} o vídeo ${exportFormat === "stories" ? "Stories (9:16)" : "Feed (1:1)"}…`}
              progress={exportMode === "offline" && exportProgress !== null ? exportProgress : duration > 0 ? (currentTime / duration) * 100 : undefined}
              className="mt-3"
            />
          )}

          {exporting && (
            <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">
              {exportMode === "offline"
                ? "O vídeo é renderizado quadro a quadro, com qualidade total. Pode levar um ou dois minutos: mantenha esta aba aberta."
                : `A gravação acontece em tempo real acompanhando o áudio (${describeStoryDuration(duration)}). Mantenha a aba aberta.`}
            </p>
          )}

          {exportNotice && (
            <p role="status" className="mt-2 rounded-md bg-emerald-500/15 border border-emerald-500/30 p-2 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              {exportNotice}
            </p>
          )}

          {exportError && (
            <p role="alert" className="mt-3 text-xs leading-relaxed text-[#a23c31]">
              {exportError}
            </p>
          )}
        </div>
      </aside>
      <audio ref={audioRef} src={story.audioUrl} crossOrigin={audioCors} onError={handleAudioError} preload="auto" className="hidden" />
      <canvas ref={canvasRef} width={EXPORT_WIDTH} height={EXPORT_HEIGHT} className="hidden" aria-hidden="true" />
    </div>
  );
}
