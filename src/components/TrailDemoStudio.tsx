"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import {
  DEFAULT_TRAIL_DEMO_SETTINGS,
  buildTrailDemoPlan,
  renderTrailDemoFrame,
  type TrailDemoPlan,
  type TrailDemoSettings,
} from "@/lib/curiousTrailDemoVideo";
import {
  DEMO_FORMATS,
  loadDemoImages,
  synthDemoAudio,
  type DemoFormat,
  type DemoImages,
} from "@/lib/gameDemoVideo";
import { DEMO_QUALITY, exportDemoVideo, type DemoQuality, type ExportResult } from "@/lib/gameDemoExport";
import { loadDemoPronunciations, DemoPreviewAudioPlayer } from "@/lib/gameDemoAudio";
import { TRAIL_LEVELS, TRAIL_THEMES } from "@/lib/curiousTrailData";
import { SOCIAL_PLATFORMS, sanitizeSocialHandle } from "@/lib/socialLinks";
import { Download, Loader2, Pause, Play, RotateCcw, Sparkles } from "lucide-react";

export function TrailDemoStudio({ items }: { items: CestQuoiItem[] }) {
  const [settings, setSettings] = useState<TrailDemoSettings>(DEFAULT_TRAIL_DEMO_SETTINGS);
  const [images, setImages] = useState<DemoImages>(new Map());
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [quality, setQuality] = useState<DemoQuality>("max");
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

  // Carrega imagens usadas na trilha
  useEffect(() => {
    let cancelled = false;
    const roundItems = plan.rounds.map((r) => r.item);
    void loadDemoImages(roundItems).then((map) => {
      if (cancelled) return;
      setImages(map);
    });
    return () => {
      cancelled = true;
    };
  }, [plan]);

  const planRef = useRef(plan);
  const imagesRef = useRef(images);
  useEffect(() => {
    planRef.current = plan;
    imagesRef.current = images;
  }, [plan, images]);

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
      renderTrailDemoFrame(ctx, canvas.width, canvas.height, t, planRef.current, {
        images: imagesRef.current,
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
    setExporting(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Mock plan compatível para exportador
      const exportCanvas = document.createElement("canvas");
      const spec = DEMO_FORMATS[plan.settings.format];
      exportCanvas.width = spec.w;
      exportCanvas.height = spec.h;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) throw new Error("Erro ao inicializar contexto 2D");

      // Usamos MediaRecorder / WebCodecs padrão
      const stream = exportCanvas.captureStream(30);
      const mime = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
        ? "video/mp4;codecs=avc1"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12_000_000 });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const finishPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: mime }));
        };
      });

      recorder.start();

      const fps = 30;
      const totalFrames = Math.ceil(plan.total * fps);
      for (let f = 0; f < totalFrames; f++) {
        if (controller.signal.aborted) throw new Error("Cancelado");
        const tFrame = f / fps;
        renderTrailDemoFrame(ctx, spec.w, spec.h, tFrame, plan, { images });
        setProgress(Math.round((f / totalFrames) * 100));
        await new Promise((r) => setTimeout(r, 16));
      }

      recorder.stop();
      const blob = await finishPromise;
      const url = URL.createObjectURL(blob);
      const ext = mime.includes("mp4") ? "mp4" : "webm";
      const name = `trilha-curiosa-${plan.theme.id}-nivel${plan.settings.level}.${ext}`;

      setResult({
        url,
        info: {
          blob,
          extension: ext as "mp4" | "webm",
          hasAudio: false,
          method: "realtime",
          width: spec.w,
          height: spec.h,
        },
        name,
      });
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        setError((err as Error)?.message || "Falha na exportação do vídeo.");
      }
    } finally {
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

        {/* NÍVEL A DEMONSTRAR */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-secondary)]">
            Nível da Montanha a Demonstrar
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {TRAIL_LEVELS.map((lvl) => (
              <button
                key={lvl.level}
                type="button"
                onClick={() => setSettings({ ...settings, level: lvl.level })}
                className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                  settings.level === lvl.level
                    ? "border-amber-500 bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                }`}
              >
                <span className="block text-sm">{lvl.badgeEmoji}</span>
                Nível {lvl.level}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-amber-500 font-semibold pt-1">
            {settings.level <= 3 && "☀️ Níveis 1-3: Céu aberto, sol suave e esquilos"}
            {(settings.level === 4 || settings.level === 5) && "🌧️ Níveis 4-5: Chuva caindo e guarda-chuva aberto!"}
            {settings.level >= 6 && "❄️ Níveis 6-7: Neve caindo e bandeira da vitória no cume!"}
          </p>
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
              onChange={(e) => setSettings({ ...settings, platform: e.target.value as any })}
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
            disabled={exporting}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-black text-white shadow-lg hover:opacity-95"
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando Vídeo MP4 ({progress}%)...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Gerar Vídeo da Trilha (MP4)
              </>
            )}
          </Button>
          {error && <p className="mt-2 text-xs text-red-500 font-bold text-center">{error}</p>}
        </div>

        {/* DOWNLOAD QUANDO PRONTO */}
        {result && (
          <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-center space-y-2 animate-in fade-in">
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              🎉 Vídeo gerado com sucesso! Pronto para postar no Instagram e Facebook.
            </p>
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
            Pré-visualização do Vídeo ({spec.w}×{spec.h})
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
