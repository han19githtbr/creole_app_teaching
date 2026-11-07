"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import {
  DEFAULT_TRAIL_DEMO_SETTINGS,
  buildTrailDemoPlan,
  renderTrailDemoFrame,
  trailLevelForTime,
  trailMapHeight,
  type TrailDemoPlan,
  type TrailDemoSettings,
} from "@/lib/curiousTrailDemoVideo";
import {
  DEMO_FORMATS,
  type DemoFormat,
} from "@/lib/gameDemoVideo";
import {
  loadTrailObjectImages,
  loadTrailSceneImages,
  type TrailObjectImages,
} from "@/lib/curiousTrailObjectImages";
import type { ExportResult } from "@/lib/gameDemoExport";
import { TrailVideoWorld, loadTrailVideoAssets, type TrailVideoAssets } from "@/lib/trailVideoWorld";
import { exportTrailDemoOffline } from "@/lib/trailDemoOfflineExport";
import { TRAIL_LEVELS, TRAIL_THEMES } from "@/lib/curiousTrailData";
import { SOCIAL_PLATFORMS, sanitizeSocialHandle, type SocialPlatform } from "@/lib/socialLinks";
import { Download, Loader2, Pause, Play, Sparkles } from "lucide-react";

const EMPTY_DEMO_IMAGES: TrailObjectImages = new Map();

export function TrailDemoStudio({ items }: { items: CestQuoiItem[] }) {
  const [settings, setSettings] = useState<TrailDemoSettings>(DEFAULT_TRAIL_DEMO_SETTINGS);
  const [imageResult, setImageResult] = useState<{ plan: TrailDemoPlan; images: TrailObjectImages; sceneImages: TrailObjectImages } | null>(null);
  const [imageError, setImageError] = useState<{ plan: TrailDemoPlan; message: string } | null>(null);
  const [imageLoadAttempt, setImageLoadAttempt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; info: ExportResult; name: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clockRef = useRef({ start: 0, offset: 0 });
  const abortRef = useRef<AbortController | null>(null);

  const cleanSettings = useMemo(
    () => ({
      ...settings,
      handle: sanitizeSocialHandle(settings.handle) || "frances_com_tres_nativos",
    }),
    [settings]
  );

  const plan = useMemo(
    () => buildTrailDemoPlan(items, cleanSettings),
    [items, cleanSettings]
  );
  const images = imageResult?.plan === plan ? imageResult.images : EMPTY_DEMO_IMAGES;
  const sceneImages = imageResult?.plan === plan ? imageResult.sceneImages : EMPTY_DEMO_IMAGES;
  const imagesError = imageError?.plan === plan ? imageError.message : null;
  const imagesLoading = !imagesError && imageResult?.plan !== plan;
  const allPlanImagesLoaded =
    plan.rounds.length > 0 && plan.rounds.every((round) => images.has(round.item.id));

  // Carrega imagens usadas na trilha
  useEffect(() => {
    let cancelled = false;
    const roundItems = [...new Map(plan.rounds.map((round) => [round.item.id, round.item])).values()];
    void Promise.all([loadTrailObjectImages(roundItems), loadTrailSceneImages(roundItems)])
      .then(([map, sceneMap]) => {
        if (cancelled) return;
        const missing = roundItems.filter((item) => !map.has(item.id) || !sceneMap.has(item.id));
        if (missing.length) {
          setImageError({
            plan,
            message: `Não foi possível carregar ${missing.length} imagem(ns) deste nível. Tente carregar novamente.`,
          });
          return;
        }
        setImageResult({ plan, images: map, sceneImages: sceneMap });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Erro ao carregar imagens do vídeo da Trilha.", error);
        setImageError({
          plan,
          message: "Não foi possível carregar as imagens do vídeo. Tente novamente.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [plan, imageLoadAttempt]);

  // Arte da mata em cada clima, além da fauna e da água compartilhadas com o jogo.
  const vAssetsRef = useRef<TrailVideoAssets | null>(null);
  const [loadedWeather, setLoadedWeather] = useState<string | null>(null);
  const weatherKey = "all";
  const sceneReady = loadedWeather === weatherKey;
  useEffect(() => {
    let cancelled = false;
    loadTrailVideoAssets()
      .then((a) => {
        if (cancelled) return;
        vAssetsRef.current = a;
        setLoadedWeather(weatherKey);
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
  }, [weatherKey]);
  const worldRef = useRef<TrailVideoWorld | null>(null);
  const dynRef = useRef<{ img: HTMLImageElement | null; busy: boolean }>({ img: null, busy: false });
  useEffect(() => {
    worldRef.current = sceneReady && vAssetsRef.current ? new TrailVideoWorld(plan, vAssetsRef.current.fauna) : null;
    dynRef.current = { img: null, busy: false };
  }, [plan, sceneReady]);

  const planRef = useRef(plan);
  const imagesRef = useRef(images);
  const sceneImagesRef = useRef(sceneImages);
  useEffect(() => {
    planRef.current = plan;
    imagesRef.current = images;
    sceneImagesRef.current = sceneImages;
  }, [plan, images, sceneImages]);

  useEffect(() => {
    clockRef.current = { start: performance.now(), offset: 0 };
  }, [plan]);

  // Loop de animação no Canvas de pré-visualização
  useEffect(() => {
    let raf = 0;
    const draw = (t: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      // avalanche: pede o quadro (assíncrono) e usa o último pronto
      const d = dynRef.current;
      const wld = worldRef.current;
      if (wld && !d.busy) {
        d.busy = true;
        void wld
          .avalancheImage(t, canvas.width, trailMapHeight(canvas.height))
          .then((img) => {
            if (worldRef.current === wld) d.img = img;
          })
          .catch(() => undefined)
          .finally(() => {
            d.busy = false;
          });
      }
      renderTrailDemoFrame(ctx, canvas.width, canvas.height, t, planRef.current, {
        images: imagesRef.current,
        sceneImages: sceneImagesRef.current,
        scene: vAssetsRef.current?.scenes[trailLevelForTime(planRef.current, t).weather] ?? null,
        world: wld,
        dyn: d.img,
      });
    };

    const loop = (now: number) => {
      const total = planRef.current.total || 1;
      if (playing) {
        const elapsed = (now - clockRef.current.start) / 1000;
        let t = clockRef.current.offset + elapsed;
        if (t >= total) {
          clockRef.current = { start: now, offset: 0 };
          t = 0;
        }
        draw(t);
        setTime(t);
      } else {
        draw(clockRef.current.offset);
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  function togglePlay() {
    if (playing) {
      const current =
        (clockRef.current.offset + (performance.now() - clockRef.current.start) / 1000) %
        (plan.total || 1);
      clockRef.current.offset = current;
      setPlaying(false);
    } else {
      clockRef.current.start = performance.now();
      setPlaying(true);
    }
  }

  // Exportação em MP4 para redes sociais
  async function handleExport() {
    if (imagesLoading || imagesError || !allPlanImagesLoaded || !sceneReady) return;
    setExporting(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    abortRef.current = controller;
    let exportAudioContext: AudioContext | null = null;
    let exportStream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;

    try {
      // Mock plan compatível para exportador
      const spec = DEMO_FORMATS[plan.settings.format];
      // Em celulares, limitar o quadro a 720p reduz bastante o uso de memória e o esforço do codificador.
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const mobile = window.matchMedia("(max-width: 767px)").matches || (deviceMemory !== undefined && deviceMemory <= 4);
      const outputScale = mobile ? Math.min(1, 720 / spec.w) : 1;
      const outputWidth = Math.floor((spec.w * outputScale) / 2) * 2;
      const outputHeight = Math.floor((spec.h * outputScale) / 2) * 2;
      const fps = mobile ? 24 : 30;
      const videoBitrate = mobile ? 4_500_000 : 8_000_000;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = outputWidth;
      exportCanvas.height = outputHeight;
      const ctx = exportCanvas.getContext("2d", { alpha: false });
      if (!ctx) throw new Error("Erro ao inicializar contexto 2D");
      if (outputScale < 1) ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

      // Usamos codecs compatíveis com players móveis e dividimos a gravação em blocos curtos.
      exportStream = exportCanvas.captureStream(fps);
      exportAudioContext = new AudioContext();
      await exportAudioContext.resume();
      const audioDestination = exportAudioContext.createMediaStreamDestination();
      const audioMaster = exportAudioContext.createGain();
      audioMaster.gain.value = 0.38;
      audioMaster.connect(audioDestination);

      const loadAudio = async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Não foi possível carregar o áudio ${url}`);
        return exportAudioContext!.decodeAudioData(await response.arrayBuffer());
      };
      const [forestBuffer, streamBuffer, rainBuffer] = await Promise.all([
        loadAudio("/trilha/audio/forest-ambience.ogg"),
        loadAudio("/trilha/audio/small-stream.ogg"),
        loadAudio("/trilha/audio/light-rain.ogg"),
      ]);
      // O jogo pronuncia o nome do objeto quando revela a resposta; usa o mesmo texto francês no vídeo.
      const uniqueWords = [...new Set(plan.rounds.map((round) => round.item.speak.trim()))];
      const spokenWords = await Promise.all(uniqueWords.map(async (word) => {
        const response = await fetch("/api/trilha/pronuncia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: word }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Não foi possível preparar a pronúncia de “${word}”.`);
        return [word, await exportAudioContext!.decodeAudioData(await response.arrayBuffer())] as const;
      }));
      const wordsByText = new Map(spokenWords);
      const videoAssets = vAssetsRef.current;
      if (!videoAssets) throw new Error("A arte da trilha ainda não carregou.");
      const offlineResult = await exportTrailDemoOffline({
        plan,
        images,
        sceneImages,
        assets: videoAssets,
        sounds: { forest: forestBuffer, stream: streamBuffer, rain: rainBuffer, voices: wordsByText },
        width: outputWidth,
        height: outputHeight,
        scale: outputScale,
        fps,
        bitrate: videoBitrate,
        signal: controller.signal,
        onProgress: setProgress,
      });
      if (offlineResult) {
        const url = URL.createObjectURL(offlineResult.blob);
        const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
        const name = `trilha-curiosa-v3-${plan.theme.id}-niveis${plan.levels.map((level) => level.level).join("-")}-${stamp}.mp4`;
        setResult({
          url,
          info: {
            blob: offlineResult.blob,
            extension: "mp4",
            hasAudio: true,
            method: "offline",
            width: offlineResult.width,
            height: offlineResult.height,
          },
          name,
        });
        setProgress(100);
        return;
      }
      // Só inicia os relógios de áudio depois que todos os clipes estiverem prontos.
      const audioStartAt = exportAudioContext.currentTime + 0.25;
      const addLoop = (buffer: AudioBuffer, volume: number) => {
        const source = exportAudioContext!.createBufferSource();
        const gain = exportAudioContext!.createGain();
        source.buffer = buffer;
        source.loop = true;
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(audioMaster);
        source.start(audioStartAt);
        return { source, gain };
      };
      const forestBed = addLoop(forestBuffer, 0.26);
      const streamBed = addLoop(streamBuffer, 0.16);
      const rainBed = addLoop(rainBuffer, 0);
      plan.rounds.forEach((round) => {
        rainBed.gain.gain.setTargetAtTime(round.levelCfg.weather === "rain" ? 0.2 : 0, audioStartAt + round.start, 0.45);
        forestBed.gain.gain.setTargetAtTime(round.levelCfg.weather === "night" ? 0.2 : 0.26, audioStartAt + round.start, 0.55);
        streamBed.gain.gain.setTargetAtTime(round.levelCfg.weather === "night" ? 0.14 : 0.16, audioStartAt + round.start, 0.55);
      });
      plan.rounds.forEach((round) => {
        const buffer = wordsByText.get(round.item.speak.trim());
        if (!buffer) return;
        const voice = exportAudioContext!.createBufferSource();
        const voiceGain = exportAudioContext!.createGain();
        voice.buffer = buffer;
        voiceGain.gain.value = 0.9;
        voice.connect(voiceGain);
        voiceGain.connect(audioMaster);
        voice.start(audioStartAt + round.correctAt);
      });
      exportStream.addTrack(audioDestination.stream.getAudioTracks()[0]);
      const mimeCandidates = [
        "video/mp4;codecs=avc1.42E028,mp4a.40.2",
        "video/mp4;codecs=avc1.4D4028,mp4a.40.2",
        "video/mp4;codecs=avc1,mp4a.40.2",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9,opus",
      ];
      const mime = mimeCandidates.find((candidate) => MediaRecorder.isTypeSupported(candidate));
      if (!mime) throw new Error("Este navegador não oferece um formato de vídeo com áudio compatível. Atualize o navegador e tente novamente.");
      const activeRecorder = new MediaRecorder(exportStream, {
        mimeType: mime,
        videoBitsPerSecond: videoBitrate,
        audioBitsPerSecond: 128_000,
      });
      recorder = activeRecorder;
      const chunks: Blob[] = [];

      activeRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const finishPromise = new Promise<Blob>((resolve, reject) => {
        activeRecorder.onstop = () => {
          const actualMime = activeRecorder.mimeType || mime;
          resolve(new Blob(chunks, { type: actualMime }));
        };
        activeRecorder.onerror = (event) => reject((event as Event & { error?: DOMException }).error ?? new Error("Falha ao gravar o vídeo."));
      });
      void finishPromise.catch(() => undefined);

      await new Promise<void>((resolve) => {
        const waitMs = Math.max(0, (audioStartAt - exportAudioContext!.currentTime) * 1000);
        setTimeout(resolve, waitMs);
      });
      activeRecorder.start(1000);
      const exportWorld = new TrailVideoWorld(plan, videoAssets.fauna);

      const videoStartAt = performance.now();
      let lastProgress = -1;
      while ((performance.now() - videoStartAt) / 1000 < plan.total) {
        if (controller.signal.aborted) throw new Error("Cancelado");
        const frameStart = performance.now();
        const tFrame = (frameStart - videoStartAt) / 1000;
        // exportação quadro a quadro, com o mundo recomeçando do zero (mesma simulação da prévia)
        const dyn = await exportWorld.avalancheImage(tFrame, spec.w, trailMapHeight(spec.h));
        renderTrailDemoFrame(ctx, spec.w, spec.h, tFrame, plan, { images, sceneImages, scene: videoAssets.scenes[trailLevelForTime(plan, tFrame).weather], world: exportWorld, dyn });
        const nextProgress = Math.min(99, Math.round((tFrame / plan.total) * 100));
        if (nextProgress !== lastProgress) {
          lastProgress = nextProgress;
          setProgress(nextProgress);
        }
        const delay = Math.max(0, 1000 / fps - (performance.now() - frameStart));
        if (delay) await new Promise((r) => setTimeout(r, delay));
      }

      setProgress(100);
      recorder.stop();
      const blob = await finishPromise;
      const url = URL.createObjectURL(blob);
      const ext = blob.type.includes("mp4") ? "mp4" : "webm";
      const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
      const name = `trilha-curiosa-v3-${plan.theme.id}-niveis${plan.levels.map((level) => level.level).join("-")}-${stamp}.${ext}`;

      setResult({
        url,
        info: {
          blob,
          extension: ext as "mp4" | "webm",
          hasAudio: true,
          method: "realtime",
          width: outputWidth,
          height: outputHeight,
        },
        name,
      });
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        setError((err as Error)?.message || "Falha na exportação do vídeo.");
      }
    } finally {
      if (recorder && recorder.state !== "inactive") {
        try { recorder.stop(); } catch { /* já estava encerrado */ }
      }
      exportStream?.getTracks().forEach((track) => track.stop());
      if (exportAudioContext && exportAudioContext.state !== "closed") await exportAudioContext.close();
      setExporting(false);
      abortRef.current = null;
    }
  }

  const spec = DEMO_FORMATS[settings.format];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ---------------- PAINEL DE CONFIGURAÇÃO (ESQUERDA) ---------------- */}
      <div className="lg:col-span-6 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <span className="text-xl">🏔️</span>
          <div>
            <h2 className="text-base font-bold text-[var(--text)]">Configurar Vídeo da Trilha</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Personalize tema, nível (com chuva ou neve), formato e perfil para os Stories e Feed
            </p>
          </div>
        </div>
        <p className="rounded-xl bg-[var(--surface-2)] px-3 py-2 text-[11px] leading-relaxed text-[var(--text-secondary)]">
          🎧 O vídeo exportado inclui a pronúncia francesa dos objetos e sons gravados de floresta, riacho e chuva, mixados suavemente.
        </p>

        {/* TÍTULO */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-secondary)]">Título do Vídeo</label>
          <Input
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            className="text-xs"
            placeholder="Ex: Trilha do Aluno Curioso..."
          />
        </div>

        {/* TEMA */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-secondary)]">Tema da Trilha</label>
          <select
            value={settings.themeId}
            onChange={(e) => setSettings({ ...settings, themeId: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-xs font-bold text-[var(--text)]"
          >
            {TRAIL_THEMES.map((thm) => (
              <option key={thm.id} value={thm.id}>
                {thm.emoji} {thm.label} ({thm.fr})
              </option>
            ))}
          </select>
        </div>

        {/* NÍVEIS A DEMONSTRAR */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-secondary)]">
            Níveis da montanha a incluir
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {TRAIL_LEVELS.map((lvl) => (
              <button
                key={lvl.level}
                type="button"
                aria-pressed={settings.levels.includes(lvl.level)}
                onClick={() => setSettings((prev) => {
                  const selected = prev.levels.includes(lvl.level)
                    ? prev.levels.filter((level) => level !== lvl.level)
                    : [...prev.levels, lvl.level];
                  return { ...prev, levels: selected.length ? selected.sort((a, b) => a - b) : prev.levels };
                })}
                className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                  settings.levels.includes(lvl.level)
                    ? "border-amber-500 bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                }`}
              >
                <span className="block text-sm">{lvl.badgeEmoji}</span>
                Nível {lvl.level}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, levels: TRAIL_LEVELS.map((level) => level.level) }))}
              className="cursor-pointer text-[11px] font-bold text-[var(--accent)] hover:underline"
            >
              Selecionar todos
            </button>
          </div>
          <p className="text-[11px] text-amber-500 font-semibold pt-1">
            {settings.levels.length} {settings.levels.length === 1 ? "nível selecionado" : "níveis selecionados"} · {plan.rounds.length} perguntas no vídeo
          </p>
        </div>

        {/* DIFICULDADE */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-secondary)]">Dificuldade da partida</label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
            {([
              ["easy", "Fácil", "20s"],
              ["intermediate", "Intermediário", "15s"],
              ["master", "Master", "10s"],
              ["native", "Nativo", "6s"],
              ["avalanche", "Avalanche 🏔️", "sem tempo"],
            ] as const).map(([difficulty, label, seconds]) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => setSettings({ ...settings, difficulty })}
                className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                  settings.difficulty === difficulty
                    ? "border-amber-500 bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                }`}
              >
                <span className="block">{label}</span>
                <span className="block text-[10px] opacity-70">{difficulty === "avalanche" ? "avalanche no lugar do tempo" : `${seconds} por objeto`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FORMATO (9:16 STORIES, 4:5 FEED, 1:1) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-secondary)]">Formato do Vídeo</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DEMO_FORMATS) as DemoFormat[]).map((fmtKey) => {
              const f = DEMO_FORMATS[fmtKey];
              const isSel = settings.format === fmtKey;
              return (
                <button
                  key={fmtKey}
                  type="button"
                  onClick={() => setSettings({ ...settings, format: fmtKey })}
                  className={`rounded-xl border-2 p-2.5 text-center transition-all ${
                    isSel
                      ? "border-amber-500 bg-amber-500/15 font-black text-amber-600 dark:text-amber-400"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-secondary)]"
                  }`}
                >
                  <span className="block text-xs font-bold">{f.label.split(" (")[0]}</span>
                  <span className="block text-[10px] text-[var(--text-muted)]">
                    {f.w}×{f.h}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* REDE SOCIAL E PERFIL */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-secondary)]">Rede Social</label>
            <select
              value={settings.platform}
              onChange={(e) => setSettings({ ...settings, platform: e.target.value as SocialPlatform })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-xs font-bold"
            >
              {(Object.keys(SOCIAL_PLATFORMS) as (keyof typeof SOCIAL_PLATFORMS)[]).map((p) => (
                <option key={p} value={p}>
                  {SOCIAL_PLATFORMS[p].label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-secondary)]">Perfil</label>
            <Input
              value={settings.handle}
              onChange={(e) => setSettings({ ...settings, handle: e.target.value })}
              className="text-xs"
              placeholder="@seu_perfil"
            />
          </div>
        </div>

        {/* BOTÃO GERAR VÍDEO MP4 */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={handleExport}
            disabled={exporting || imagesLoading || Boolean(imagesError) || !allPlanImagesLoaded || !sceneReady}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-black text-white shadow-lg hover:opacity-95"
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando Vídeo MP4 ({progress}%)...
              </>
            ) : (
              imagesLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando imagens...
                </>
              ) : (
                <>
                <Sparkles className="mr-2 h-4 w-4" /> Gerar Vídeo da Trilha (MP4)
                </>
              )
            )}
          </Button>
          {imagesError && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-center">
              <p className="text-xs font-bold text-red-500">{imagesError}</p>
              <button
                type="button"
                onClick={() => setImageLoadAttempt((attempt) => attempt + 1)}
                className="text-xs font-bold text-[var(--accent)] underline"
              >
                Tentar novamente
              </button>
            </div>
          )}
          {error && <p className="mt-2 text-xs text-red-500 font-bold text-center">{error}</p>}
        </div>

        {/* DOWNLOAD QUANDO PRONTO */}
        {result && (
          <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-center space-y-2 animate-in fade-in">
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              🎉 Vídeo gerado com sucesso! Pronto para postar no Instagram e Facebook.
            </p>
            <video
              key={result.url}
              src={result.url}
              controls
              playsInline
              className="mx-auto max-h-96 w-full rounded-xl bg-black"
            >
              Seu navegador não consegue reproduzir este vídeo.
            </video>
            <p className="break-all text-[10px] text-[var(--text-muted)]">{result.name}</p>
            <a
              href={result.url}
              download={result.name}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" /> Baixar Vídeo ({result.info.extension.toUpperCase()})
            </a>
          </div>
        )}
      </div>

      {/* ---------------- PRÉ-VISUALIZAÇÃO AO VIVO (DIREITA) ---------------- */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
            Prévia dos níveis {plan.levels.map((level) => level.level).join(", ")} · {plan.rounds.length} perguntas ({spec.w}×{spec.h})
          </span>
          <button
            type="button"
            onClick={togglePlay}
            className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text)]"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pausar" : "Tocar"}
          </button>
        </div>
        <p className="px-1 text-xs text-[var(--text-secondary)]">
          A prévia simula uma sequência de acertos: o aluno identifica o objeto, responde, recebe pontos e caminha pela mesma trilha do jogo. O cronômetro e a pontuação seguem a dificuldade escolhida.
        </p>

        <div className="relative mx-auto max-h-[640px] max-w-sm overflow-hidden rounded-3xl border-2 border-[var(--border)] bg-slate-950 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={spec.w}
            height={spec.h}
            className="w-full h-auto block"
          />
        </div>

        <p className="text-center text-[11px] text-[var(--text-muted)] font-semibold">
          Tempo: {time.toFixed(1)}s / {plan.total.toFixed(1)}s
        </p>
      </div>
    </div>
  );
}
