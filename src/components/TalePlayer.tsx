"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTale } from "@/lib/tales/tales";
import { planTale, splitForStories } from "@/lib/tales/timeline";
import { TALE_FORMATS, renderTaleFrame, type TaleFormat } from "@/lib/tales/render";
import { TalePlayback, loadTaleNarration, mixTaleAudio, missingNarration, narrationDurations, type TaleNarration } from "@/lib/tales/audio";
import { TALE_QUALITY, exportTaleSet, type TaleExportResult, type TaleQuality } from "@/lib/tales/export";
import { Download, Languages, Loader2, Music, Pause, Play, RotateCcw, Square, Volume2, VolumeX } from "lucide-react";

const PREVIEW_W = 540;

function formatBytes(bytes: number) {
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
}

export function TalePlayer({ slug, canExport }: { slug: string; canExport: boolean }) {
  const tale = getTale(slug);
  const [narration, setNarration] = useState<TaleNarration | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [totalToLoad, setTotalToLoad] = useState(1);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showPt, setShowPt] = useState(false);
  const [music, setMusic] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playbackRef = useRef<TalePlayback | null>(null);
  const clockRef = useRef({ start: 0, offset: 0 });
  const timeRef = useRef(0);
  const trackKeyRef = useRef("");

  const [format, setFormat] = useState<TaleFormat>("story");
  const [splitStories, setSplitStories] = useState(false);
  const [quality, setQuality] = useState<TaleQuality>("max");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ url: string; info: TaleExportResult; name: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // baixa a narração (voz em francês) de todas as frases
  useEffect(() => {
    if (!tale) return;
    const controller = new AbortController();
    void loadTaleNarration(
      tale,
      (done, total) => {
        setLoaded(done);
        setTotalToLoad(total);
      },
      controller.signal
    ).then((map) => {
      if (!controller.signal.aborted) setNarration(map);
    });
    return () => controller.abort();
  }, [tale]);

  const plan = useMemo(() => (tale ? planTale(tale, narration ? narrationDurations(narration) : undefined) : null), [tale, narration]);
  const missing = tale && narration ? missingNarration(tale, narration) : 0;

  const planRef = useRef(plan);
  const showPtRef = useRef(showPt);
  const formatRef = useRef(format);
  useEffect(() => {
    planRef.current = plan;
    showPtRef.current = showPt;
    formatRef.current = format;
  }, [plan, showPt, format]);

  const currentTime = useCallback(() => {
    const pb = playbackRef.current;
    if (pb?.playing && pb.ready) return pb.position();
    if (pb?.playing) return clockRef.current.offset + (performance.now() - clockRef.current.start) / 1000;
    return timeRef.current;
  }, []);

  // trilha (voz + música) só é montada quando precisa e quando as opções mudam
  const ensureTrack = useCallback(() => {
    if (!plan || !narration) return;
    const key = `${music}|${narration.size}|${plan.total.toFixed(2)}`;
    if (trackKeyRef.current === key) return;
    trackKeyRef.current = key;
    playbackRef.current ??= new TalePlayback();
    playbackRef.current.setTrack(mixTaleAudio(plan, narration, { music }));
    playbackRef.current.setMuted(muted);
  }, [plan, narration, music, muted]);

  const play = useCallback(() => {
    if (!plan || !narration) return;
    ensureTrack();
    const pb = (playbackRef.current ??= new TalePlayback());
    const from = timeRef.current >= plan.total - 0.05 ? 0 : timeRef.current;
    clockRef.current = { start: performance.now(), offset: from };
    pb.play(from);
    setPlaying(true);
  }, [plan, narration, ensureTrack]);

  const pause = useCallback(() => {
    const pb = playbackRef.current;
    if (pb) {
      const position = pb.playing && pb.ready ? pb.pause() : currentTime();
      if (pb.playing) pb.pause();
      timeRef.current = position;
      pb.playing = false;
    }
    setPlaying(false);
  }, [currentTime]);

  useEffect(() => {
    playbackRef.current?.setMuted(muted);
  }, [muted]);

  // mudar a música com o conto tocando: remonta a trilha na posição atual
  useEffect(() => {
    if (!playing) return;
    const position = currentTime();
    timeRef.current = position;
    ensureTrack();
    playbackRef.current?.play(position);
    clockRef.current = { start: performance.now(), offset: position };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [music]);

  // laço de desenho
  useEffect(() => {
    let raf = 0;
    let lastUi = 0;
    const loop = (now: number) => {
      const p = planRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (p && canvas && ctx) {
        let t = currentTime();
        if (playbackRef.current?.playing && t >= p.total) {
          t = p.total - 0.001;
          timeRef.current = t;
          playbackRef.current.pause();
          setPlaying(false);
          setTime(p.total);
        }
        timeRef.current = playbackRef.current?.playing ? t : timeRef.current;
        renderTaleFrame(ctx, canvas.width, canvas.height, Math.min(t, p.total - 0.001), p, { showPt: showPtRef.current, format: formatRef.current });
        if (now - lastUi > 120) {
          lastUi = now;
          setTime(t);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [currentTime]);

  useEffect(
    () => () => {
      playbackRef.current?.dispose();
      abortRef.current?.abort();
    },
    []
  );

  function seek(t: number) {
    const wasPlaying = playing;
    timeRef.current = t;
    setTime(t);
    if (wasPlaying) {
      playbackRef.current?.play(t);
      clockRef.current = { start: performance.now(), offset: t };
    }
  }

  function replay() {
    timeRef.current = 0;
    setTime(0);
    play();
  }

  /* ---------- exportação ---------- */
  useEffect(() => () => results.forEach((r) => URL.revokeObjectURL(r.url)), [results]);

  async function generate() {
    if (!plan || !narration || exporting) return;
    pause();
    setError(null);
    setResults([]);
    setExporting(true);
    setProgress(0);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const infos = await exportTaleSet({
        plan,
        narration,
        music,
        showPt,
        quality,
        format,
        splitStories: format === "story" && splitStories,
        onProgress: setProgress,
        signal: controller.signal,
      });
      const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
      setResults(
        infos.map((info, i) => ({
          url: URL.createObjectURL(info.blob),
          info,
          name: `${slug}-${format}${infos.length > 1 ? `-parte${i + 1}de${infos.length}` : ""}-${stamp}.${info.extension}`,
        }))
      );
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) setError(err instanceof Error ? err.message : "Não foi possível gerar o vídeo.");
    } finally {
      setExporting(false);
      abortRef.current = null;
    }
  }

  if (!tale || !plan) return <p className="text-sm text-[var(--text-secondary)]">Conto não encontrado.</p>;

  const loading = !narration;
  const spec = TALE_FORMATS[canExport ? format : "story"];
  const partCount = format === "story" && splitStories ? splitForStories(plan).length : 1;
  const cardCls = "space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm";
  const toggleCls = "flex cursor-pointer items-center gap-2 text-sm text-[var(--text)]";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="mx-auto w-full max-w-[420px] space-y-3">
        {/* barras de progresso, como nos Stories */}
        <div className="flex gap-1">
          {plan.scenes.map((scene) => {
            const fill = Math.min(1, Math.max(0, (time - scene.start) / scene.dur));
            return (
              <div key={scene.index} className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div className="h-full bg-[var(--accent)]" style={{ width: `${fill * 100}%` }} />
              </div>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-black shadow-xl" style={{ aspectRatio: `${spec.w} / ${spec.h}` }}>
          <canvas
            ref={canvasRef}
            width={PREVIEW_W}
            height={Math.round((PREVIEW_W * spec.h) / spec.w)}
            className="h-full w-full"
            aria-label={tale.title}
          />
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center text-white">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-semibold">Preparando a narração em francês…</p>
              <p className="text-xs opacity-80">
                {loaded}/{totalToLoad} frases
              </p>
            </div>
          ) : (
            !playing && (
              <button
                type="button"
                onClick={time >= plan.total - 0.05 ? replay : play}
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/25 transition hover:bg-black/15"
                aria-label={time >= plan.total - 0.05 ? "Ver de novo" : "Reproduzir"}
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-xl">
                  {time >= plan.total - 0.05 ? <RotateCcw className="h-9 w-9 text-slate-800" /> : <Play className="ml-1 h-10 w-10 text-slate-800" />}
                </span>
              </button>
            )
          )}
          {playing && <button type="button" onClick={pause} className="absolute inset-0 cursor-pointer" aria-label="Pausar" />}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={playing ? pause : play} disabled={loading}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={replay} disabled={loading} aria-label="Recomeçar">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <input
            type="range"
            min={0}
            max={plan.total}
            step={0.05}
            value={Math.min(time, plan.total)}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={loading}
            className="min-w-0 flex-1 cursor-pointer accent-[var(--accent)]"
            aria-label="Posição do conto"
          />
          <span className="w-20 shrink-0 text-right text-xs tabular-nums text-[var(--text-secondary)]">
            {Math.floor(time)}/{Math.round(plan.total)}s
          </span>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <button type="button" onClick={() => setMuted((m) => !m)} className={toggleCls}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />} {muted ? "Som desligado" : "Som ligado"}
          </button>
          <label className={toggleCls}>
            <input type="checkbox" checked={music} onChange={(e) => setMusic(e.target.checked)} className="h-4 w-4 cursor-pointer accent-[var(--accent)]" />
            <Music className="h-4 w-4" /> Música suave
          </label>
          <label className={toggleCls}>
            <input type="checkbox" checked={showPt} onChange={(e) => setShowPt(e.target.checked)} className="h-4 w-4 cursor-pointer accent-[var(--accent)]" />
            <Languages className="h-4 w-4" /> Tradução em português
          </label>
        </div>
        {missing > 0 && (
          <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
            {missing} frase(s) ficaram sem voz (o serviço de áudio não respondeu). A legenda continua aparecendo normalmente.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <section className={cardCls}>
          <h2 className="text-lg font-bold text-[var(--text)]">{tale.title}</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {tale.byline} · Nível {tale.level} · {Math.round(plan.total)} s
          </p>
          <p className="text-sm text-[var(--text-secondary)]">{tale.synopsisPt}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Ouça a narração e acompanhe a legenda: a palavra que está sendo falada fica em amarelo. Ative a tradução se quiser conferir o sentido.
          </p>
        </section>

        {canExport && (
          <section className={cardCls}>
            <h2 className="text-sm font-bold text-[var(--text)]">Baixar vídeo para o Instagram e o Facebook</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Gera um MP4 (H.264 + áudio AAC, 30 quadros por segundo) com a narração, a legenda em francês e, no final, a logo e o nome do Instagram
              @frances_com_tres_nativos. A música e a tradução marcadas ao lado valem para o vídeo, e a pré-visualização mostra o enquadramento escolhido.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Formato</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as TaleFormat)}
                  disabled={exporting}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm text-[var(--text)]"
                >
                  {Object.values(TALE_FORMATS).map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{TALE_FORMATS[format].hint}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Qualidade do arquivo</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as TaleQuality)}
                  disabled={exporting}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm text-[var(--text)]"
                >
                  {Object.entries(TALE_QUALITY).map(([id, q]) => (
                    <option key={id} value={id}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {format === "story" && (
              <label className={toggleCls}>
                <input
                  type="checkbox"
                  checked={splitStories}
                  onChange={(e) => setSplitStories(e.target.checked)}
                  disabled={exporting}
                  className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
                />
                Dividir em partes de até 60 s para Stories{plan.total > 60 ? ` (${splitForStories(plan).length} vídeos)` : ""}
              </label>
            )}
            <div className="flex flex-wrap gap-2">
              {exporting ? (
                <Button type="button" variant="outline" className="cursor-pointer" onClick={() => abortRef.current?.abort()}>
                  <Square className="mr-2 h-4 w-4" /> Cancelar
                </Button>
              ) : (
                <Button type="button" className="cursor-pointer" onClick={generate} disabled={loading}>
                  <Download className="mr-2 h-4 w-4" /> Gerar {partCount > 1 ? `${partCount} vídeos` : "vídeo"} (MP4)
                </Button>
              )}
            </div>

            {exporting && (
              <div className="space-y-1">
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Gerando em {spec.w}×{spec.h}… {progress}%. Mantenha esta aba aberta.
                </p>
              </div>
            )}
            {error && <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

            {results.length > 0 && (
              <div className="space-y-3 rounded-xl border border-emerald-300/60 bg-emerald-50/50 p-3 dark:border-emerald-800/60 dark:bg-emerald-950/20">
                <p className="text-sm font-semibold text-[var(--text)]">
                  {results.length > 1 ? `${results.length} vídeos prontos` : "Vídeo pronto"} · {results[0].info.width}×{results[0].info.height}
                  {results[0].info.hasAudio ? " · com som" : " · sem som"}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {results.map((r, i) => (
                    <div key={r.name} className="w-full max-w-[260px] space-y-2">
                      <video src={r.url} controls playsInline className="w-full rounded-lg bg-black" />
                      <a
                        href={r.url}
                        download={r.name}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-bold text-white hover:brightness-110"
                      >
                        <Download className="h-4 w-4" /> {results.length > 1 ? `Parte ${i + 1}` : "Baixar"} · {r.info.extension.toUpperCase()} · {formatBytes(r.info.blob.size)}
                      </a>
                    </div>
                  ))}
                </div>
                {results[0].info.extension === "webm" && (
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Este navegador só gerou WebM, que o Instagram e o Facebook não aceitam bem. Gere no Google Chrome ou no Edge atualizados, no computador, para sair em MP4.
                  </p>
                )}
                {!results[0].info.hasAudio && (
                  <p className="text-xs text-[var(--text-secondary)]">Este navegador não codifica áudio AAC, então o vídeo saiu mudo. Gere no Chrome ou no Edge para sair com a narração.</p>
                )}
                {results[0].info.method === "realtime" && (
                  <p className="text-xs text-[var(--text-secondary)]">Gravado em tempo real (sem o codificador rápido). Para a melhor nitidez, use o Chrome ou o Edge no computador.</p>
                )}
              </div>
            )}
            {plan.total > 60 && format === "story" && !splitStories && (
              <p className="text-xs text-[var(--text-secondary)]">
                Este conto tem mais de 60 s: serve para Reels. Para Stories, marque &quot;Dividir em partes&quot; e você recebe vídeos de até 60 s, que terminam sempre no fim de uma cena.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
