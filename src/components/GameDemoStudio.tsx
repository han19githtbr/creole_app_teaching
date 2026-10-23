"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LEVELS } from "@/lib/cquoiLevels";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import {
  DEFAULT_DEMO_SETTINGS,
  DEMO_FORMATS,
  DEMO_LEVELS,
  MAX_DEMO_ROUNDS,
  buildDemoRounds,
  loadDemoImages,
  planDemo,
  renderDemoFrame,
  type AttemptMode,
  type DemoFormat,
  type DemoImages,
  type DemoLevel,
} from "@/lib/gameDemoVideo";
import { DEMO_QUALITY, exportDemoVideo, type DemoQuality, type ExportResult } from "@/lib/gameDemoExport";
import { loadDemoPronunciations, DemoPreviewAudioPlayer } from "@/lib/gameDemoAudio";
import { SOCIAL_PLATFORMS, isSocialPlatform, sanitizeSocialHandle } from "@/lib/socialLinks";
import { Download, Loader2, Pause, Play, RotateCcw, Shuffle, Square, X, Volume2, VolumeX, Sparkles } from "lucide-react";

const PREVIEW_SCALE = 0.5;

function formatBytes(bytes: number) {
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
}

function pickRandom(items: CestQuoiItem[], count: number): string[] {
  const pool = [...items];
  const out: string[] = [];
  while (out.length < count && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0].id);
  }
  return out;
}

/** Começa com 1 objeto de 3 temas diferentes (sem sorteio, para o servidor e o navegador coincidirem). */
function startingSelection(items: CestQuoiItem[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (seen.has(item.themeId)) continue;
    seen.add(item.themeId);
    out.push(item.id);
    if (out.length === 3) break;
  }
  return out;
}

export function GameDemoStudio({ items }: { items: CestQuoiItem[] }) {
  const [settings, setSettings] = useState(DEFAULT_DEMO_SETTINGS);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => startingSelection(items));
  const [theme, setTheme] = useState("all");
  const [query, setQuery] = useState("");
  const [seed, setSeed] = useState(0);
  const [images, setImages] = useState<DemoImages>(new Map());
  const [imagesFor, setImagesFor] = useState("");

  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [pronunciations, setPronunciations] = useState<Map<string, Float32Array>>(new Map());
  const [audioReady, setAudioReady] = useState(false);
  const [previewMuted, setPreviewMuted] = useState(false);
  const audioPlayerRef = useRef<DemoPreviewAudioPlayer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clockRef = useRef({ start: 0, offset: 0 });

  const [quality, setQuality] = useState<DemoQuality>("max");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; info: ExportResult; name: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const themes = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((i) => map.set(i.themeId, i.theme));
    return [...map.entries()].map(([id, label]) => ({ id, label }));
  }, [items]);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const selectedItems = useMemo(
    () => selectedIds.map((id) => byId.get(id)).filter((i): i is CestQuoiItem => Boolean(i)),
    [selectedIds, byId]
  );
  const selectionKey = selectedIds.join("|");

  // carrega as imagens das perguntas escolhidas
  useEffect(() => {
    let cancelled = false;
    void loadDemoImages(selectedItems).then((map) => {
      if (cancelled) return;
      setImages(map);
      setImagesFor(selectionKey);
    });
    return () => {
      cancelled = true;
    };
    // selectedItems muda junto com selectionKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionKey]);

  const imagesReady = imagesFor === selectionKey;
  const playable = useMemo(
    () => (imagesReady ? selectedItems.filter((i) => images.has(i.scene)) : []),
    [imagesReady, selectedItems, images]
  );
  const skipped = imagesReady ? selectedItems.length - playable.length : 0;

  const cleanSettings = useMemo(
    () => ({ ...settings, handle: sanitizeSocialHandle(settings.handle) || "frances_com_tres_nativos" }),
    [settings]
  );

  const rounds = useMemo(
    () => buildDemoRounds(playable, items, { level: settings.level, attempts: settings.attempts }),
    // seed força novas alternativas embaralhadas
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playable, items, settings.level, settings.attempts, seed]
  );
  const plan = useMemo(() => planDemo(rounds, cleanSettings), [rounds, cleanSettings]);
  const spec = DEMO_FORMATS[settings.format];

  // Carrega e decodifica a pronúncia em francês de cada palavra para o vídeo
  useEffect(() => {
    let cancelled = false;
    if (!rounds.length) {
      setPronunciations(new Map());
      setAudioReady(false);
      return;
    }
    setAudioReady(false);
    void loadDemoPronunciations(rounds, 48000).then((map) => {
      if (cancelled) return;
      setPronunciations(map);
      setAudioReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [rounds]);

  // Reprodutor de áudio sincronizado para a pré-visualização ao vivo
  useEffect(() => {
    audioPlayerRef.current = new DemoPreviewAudioPlayer(48000);
    return () => {
      audioPlayerRef.current?.destroy();
      audioPlayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!previewMuted && settings.sound) {
      audioPlayerRef.current?.updateData(plan, pronunciations);
    } else {
      audioPlayerRef.current?.updateData({ ...plan, settings: { ...plan.settings, sound: false } }, pronunciations);
    }
  }, [plan, pronunciations, previewMuted, settings.sound]);

  /* ---------- pré-visualização ---------- */
  const planRef = useRef(plan);
  const imagesRef = useRef(images);
  useEffect(() => {
    planRef.current = plan;
    imagesRef.current = images;
  }, [plan, images]);

  useEffect(() => {
    clockRef.current = { start: performance.now(), offset: 0 };
  }, [plan]);

  useEffect(() => {
    let raf = 0;
    let lastUi = 0;
    const draw = (t: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !planRef.current.rounds.length) return;
      renderDemoFrame(ctx, canvas.width, canvas.height, t, planRef.current, { images: imagesRef.current });
    };
    const loop = (now: number) => {
      const total = planRef.current.total || 1;
      if (playing) {
        const elapsed = (now - clockRef.current.start) / 1000;
        let t = clockRef.current.offset + elapsed;
        if (t >= total) {
          clockRef.current = { start: now, offset: 0 };
          t = 0;
          if (!previewMuted && settings.sound) {
            audioPlayerRef.current?.play(0);
          }
        }
        draw(t);
        if (now - lastUi > 100) {
          lastUi = now;
          setTime(t);
        }
      } else {
        draw(clockRef.current.offset);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, plan]);

  function seek(t: number) {
    clockRef.current = { start: performance.now(), offset: t };
    setTime(t);
    if (playing && !previewMuted && settings.sound) {
      audioPlayerRef.current?.seek(t);
    } else {
      audioPlayerRef.current?.pause(t);
    }
  }
  function togglePlay() {
    if (playing) {
      const current = (clockRef.current.offset + (performance.now() - clockRef.current.start) / 1000) % (plan.total || 1);
      clockRef.current.offset = current;
      audioPlayerRef.current?.pause(current);
      setPlaying(false);
    audioPlayerRef.current?.stop();
    } else {
      clockRef.current.start = performance.now();
      if (!previewMuted && settings.sound) {
        audioPlayerRef.current?.play(clockRef.current.offset);
      }
      setPlaying(true);
    }
  }

  /* ---------- seleção das perguntas ---------- */
  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => (theme === "all" || i.themeId === theme) && (!q || i.fr.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)))
      .slice(0, 80);
  }, [items, theme, query]);

  function toggleItem(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      if (current.length >= MAX_DEMO_ROUNDS) return current;
      return [...current, id];
    });
  }

  function patch<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  /* ---------- exportação ---------- */
  const clearResult = useCallback(() => {
    setResult((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url);
    },
    [result]
  );

  async function generate() {
    if (!plan.rounds.length || exporting) return;
    setError(null);
    clearResult();
    setExporting(true);
    setProgress(0);
    setPlaying(false);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const info = await exportDemoVideo({
        plan,
        images,
        quality,
        pronunciations,
        onProgress: setProgress,
        signal: controller.signal,
      });
      const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
      const name = `cest-quoi-${settings.format}-${stamp}.${info.extension}`;
      setResult({ url: URL.createObjectURL(info.blob), info, name });
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(err instanceof Error ? err.message : "Não foi possível gerar o vídeo.");
      }
    } finally {
      setExporting(false);
      abortRef.current = null;
      setPlaying(true);
      clockRef.current = { start: performance.now(), offset: 0 };
    }
  }

  const selectCls =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm text-[var(--text)]";
  const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]";
  const cardCls = "space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        {/* perguntas */}
        <section className={cardCls}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-[var(--text)]">
              1. Perguntas do vídeo{" "}
              <span className="font-normal text-[var(--text-secondary)]">
                ({selectedIds.length}/{MAX_DEMO_ROUNDS})
              </span>
            </h2>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => setSelectedIds(pickRandom(items, 3))}>
                <Shuffle className="mr-1.5 h-3.5 w-3.5" /> Sortear 3
              </Button>
              <Button type="button" variant="ghost" size="sm" className="cursor-pointer" onClick={() => setSelectedIds([])}>
                Limpar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item, i) => (
              <span key={item.id} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] py-1 pl-3 pr-1.5 text-xs font-semibold text-white">
                {i + 1}. {item.fr}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white/25 hover:bg-white/40"
                  aria-label={`Remover ${item.fr}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {!selectedItems.length && <p className="text-xs text-[var(--text-secondary)]">Escolha de 1 a {MAX_DEMO_ROUNDS} objetos abaixo.</p>}
          </div>

          <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className={selectCls}>
              <option value="all">Todos os temas</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar objeto (ex.: ordinateur, panier…)" />
          </div>
          <ul className="grid max-h-60 gap-1 overflow-y-auto rounded-xl border border-[var(--border)] p-2 sm:grid-cols-2">
            {visibleItems.map((item) => {
              const on = selectedIds.includes(item.id);
              const full = !on && selectedIds.length >= MAX_DEMO_ROUNDS;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={full}
                    onClick={() => toggleItem(item.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      on ? "bg-[var(--accent)]/15 font-bold text-[var(--accent)]" : "hover:bg-[var(--surface-2)] text-[var(--text)]"
                    }`}
                  >
                    <span className="truncate">{item.fr}</span>
                    <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{item.theme}</span>
                  </button>
                </li>
              );
            })}
            {!visibleItems.length && <li className="p-2 text-xs text-[var(--text-secondary)]">Nada encontrado.</li>}
          </ul>
          {skipped > 0 && (
            <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              {skipped} imagem(ns) não carregaram e ficaram de fora do vídeo.
            </p>
          )}
        </section>

        {/* estilo */}
        <section className={cardCls}>
          <h2 className="text-sm font-bold text-[var(--text)]">2. Estilo do vídeo</h2>

          <div>
            <label className={labelCls}>Nível do jogo (muda o tempo e os pontos)</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DEMO_LEVELS.map((lv: DemoLevel) => {
                const cfg = LEVELS[lv];
                const on = settings.level === lv;
                return (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => patch("level", lv)}
                    className={`cursor-pointer rounded-xl border-2 px-2 py-2 text-xs font-bold transition ${
                      on ? "border-transparent text-white" : "border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]"
                    }`}
                    style={on ? { background: `linear-gradient(135deg, ${cfg.c1}, ${cfg.c2})` } : undefined}
                  >
                    {cfg.label}
                    <span className="block text-[10px] font-medium opacity-80">
                      {cfg.seconds}s · ×{cfg.multiplier}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Formato</label>
              <select value={settings.format} onChange={(e) => patch("format", e.target.value as DemoFormat)} className={selectCls}>
                {Object.values(DEMO_FORMATS).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{spec.hint}</p>
            </div>
            <div>
              <label className={labelCls}>Erros e acertos</label>
              <select value={settings.attempts} onChange={(e) => patch("attempts", e.target.value as AttemptMode)} className={selectCls}>
                <option value="mixed">Misturado (erra em umas, acerta de primeira em outras)</option>
                <option value="always">Sempre mostra uma tentativa errada antes</option>
                <option value="never">Só acertos</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Título da abertura</label>
            <Textarea value={settings.title} onChange={(e) => patch("title", e.target.value)} rows={2} maxLength={90} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Chamada final</label>
              <Input value={settings.cta} onChange={(e) => patch("cta", e.target.value)} maxLength={70} />
            </div>
            <div>
              <label className={labelCls}>Rede social do encerramento</label>
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <select
                  value={settings.platform}
                  onChange={(e) => {
                    if (isSocialPlatform(e.target.value)) patch("platform", e.target.value);
                  }}
                  className={selectCls}
                >
                  {Object.values(SOCIAL_PLATFORMS).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <Input value={settings.handle} onChange={(e) => patch("handle", e.target.value)} placeholder="perfil (sem @)" maxLength={60} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text)]">
            {(
              [
                ["showIntro", "Abertura com título"],
                ["showOutro", "Encerramento com a rede social"],
                ["sound", "Áudio (efeitos sonoros e pronúncia em francês)"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={settings[key]} onChange={(e) => patch(key, e.target.checked)} className="h-4 w-4 cursor-pointer accent-[var(--accent)]" />
                {label}
              </label>
            ))}
          </div>

          {settings.sound && (
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-[var(--text)]">Áudio e pronúncia em francês</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  audioReady && pronunciations.size > 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    audioReady && pronunciations.size > 0 ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`}
                />
                {audioReady && pronunciations.size > 0
                  ? `${pronunciations.size} pronúncias sincronizadas`
                  : "Carregando pronúncia..."}
              </span>
            </div>
          )}
        </section>

        {/* exportação */}
        <section className={cardCls}>
          <h2 className="text-sm font-bold text-[var(--text)]">3. Gerar e baixar</h2>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className={labelCls}>Qualidade do arquivo</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value as DemoQuality)} className={selectCls} disabled={exporting}>
                {Object.entries(DEMO_QUALITY).map(([id, q]) => (
                  <option key={id} value={id}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
            {exporting ? (
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => abortRef.current?.abort()}>
                <Square className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            ) : (
              <Button type="button" className="cursor-pointer" onClick={generate} disabled={!plan.rounds.length}>
                <Download className="mr-2 h-4 w-4" /> Gerar vídeo (MP4)
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

          {result && (
            <div className="space-y-3 rounded-xl border border-emerald-300/60 bg-emerald-50/50 p-3 dark:border-emerald-800/60 dark:bg-emerald-950/20">
              <p className="text-sm font-semibold text-[var(--text)]">
                Vídeo pronto · {result.info.width}×{result.info.height} · {formatBytes(result.info.blob.size)} · {result.info.extension.toUpperCase()}
                {result.info.hasAudio ? " com som" : " sem som"}
              </p>
              <video src={result.url} controls playsInline className="mx-auto max-h-[420px] rounded-lg bg-black" />
              <a
                href={result.url}
                download={result.name}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
              >
                <Download className="h-4 w-4" /> Baixar {result.name}
              </a>
              {result.info.extension === "webm" && (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Este navegador só gerou WebM, que o Instagram e o Facebook não aceitam bem. Para sair em MP4, gere o vídeo no Google Chrome ou no Edge atualizados, no computador.
                </p>
              )}
              {result.info.method === "realtime" && (
                <p className="text-xs text-[var(--text-secondary)]">Gravado em tempo real (este navegador não tem o codificador rápido). Para a melhor nitidez, use o Chrome ou o Edge no computador.</p>
              )}
              {!result.info.hasAudio && settings.sound && (
                <p className="text-xs text-[var(--text-secondary)]">Este navegador não codifica áudio AAC, então o vídeo saiu mudo. Funciona normalmente nos Stories.</p>
              )}
            </div>
          )}

          <ul className="list-disc space-y-1 pl-5 text-xs text-[var(--text-secondary)]">
            <li>Stories e Reels: escolha 9:16. O título e os botões ficam longe das bordas que o Instagram cobre com a interface.</li>
            <li>Feed: 4:5 ocupa mais tela que o quadrado. Facebook aceita os três formatos.</li>
            <li>Os vídeos saem em 1080 px de largura, 30 quadros por segundo e H.264, o padrão que as duas redes pedem.</li>
          </ul>
        </section>
      </div>

      {/* pré-visualização */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className={cardCls}>
          <h2 className="text-sm font-bold text-[var(--text)]">Pré-visualização</h2>
          <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-xl bg-black shadow-lg" style={{ aspectRatio: `${spec.w} / ${spec.h}` }}>
            {plan.rounds.length ? (
              <canvas
                ref={canvasRef}
                width={Math.round(spec.w * PREVIEW_SCALE)}
                height={Math.round(spec.h * PREVIEW_SCALE)}
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center text-xs text-white/70">
                {imagesReady ? "Escolha pelo menos uma pergunta." : <Loader2 className="h-5 w-5 animate-spin" />}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={togglePlay} disabled={!plan.rounds.length}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => seek(0)} disabled={!plan.rounds.length}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                const next = !previewMuted;
                setPreviewMuted(next);
                if (next) {
                  audioPlayerRef.current?.stop();
                } else if (playing && settings.sound) {
                  audioPlayerRef.current?.play(time);
                }
              }}
              title={previewMuted ? "Ativar áudio da prévia" : "Silenciar áudio da prévia"}
              disabled={!plan.rounds.length || !settings.sound}
            >
              {previewMuted || !settings.sound ? (
                <VolumeX className="h-4 w-4 text-[var(--text-secondary)]" />
              ) : (
                <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </Button>
            <input
              type="range"
              min={0}
              max={Math.max(0.1, plan.total)}
              step={0.05}
              value={Math.min(time, plan.total)}
              onChange={(e) => seek(Number(e.target.value))}
              className="min-w-0 flex-1 cursor-pointer accent-[var(--accent)]"
              aria-label="Posição do vídeo"
              disabled={!plan.rounds.length}
            />
            <span className="w-16 shrink-0 text-right text-xs tabular-nums text-[var(--text-secondary)]">
              {time.toFixed(1)}/{plan.total.toFixed(1)}s
            </span>
          </div>
          <Button type="button" variant="outline" size="sm" className="w-full cursor-pointer" onClick={() => setSeed((s) => s + 1)} disabled={!plan.rounds.length}>
            <Shuffle className="mr-2 h-3.5 w-3.5" /> Embaralhar alternativas
          </Button>
          {plan.rounds.length > 0 && (
            <ol className="space-y-1 text-[11px] text-[var(--text-secondary)]">
              {plan.rounds.map((round, i) => (
                <li key={round.item.id + i} className="flex justify-between gap-2">
                  <span className="truncate">
                    {i + 1}. {round.item.fr}
                  </span>
                  <span className="shrink-0">{round.wrongIndex !== null ? "erra e acerta" : "acerta"} · +{plan.timings[i].points}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}
