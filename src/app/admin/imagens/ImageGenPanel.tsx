"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, Loader2, Pause, Play, RotateCcw, Sparkles, Trash2, Undo2, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ENGINE_META,
  IMAGE_GEN_MAX_PER_JOB,
  SECTION_META,
  THEMES,
  type GeneratedStatus,
  type ImageEngine,
  type ImageSection,
} from "@/lib/imageGen/config";
import type { AppLanguage } from "@/lib/languageShared";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  section: ImageSection;
  themeId: string;
  engine: ImageEngine;
  total: number;
  remaining: number;
  produced: number;
  rejectedByReview: number;
  status: "active" | "paused" | "done" | "cancelled";
  lastError: string;
}
interface Img {
  id: string;
  section: ImageSection;
  theme: string;
  engine: ImageEngine;
  title: string;
  src: string;
  status: GeneratedStatus;
  elements: { kreyol: string; pt: string }[];
  cquoi: { fr: string } | null;
  qa: { checked: boolean; score: number; passed: boolean; issues: string[] };
}
interface State {
  config: { r2: boolean; gemini: boolean; dailyLimit: number; minScore: number; autoApproveScore: number; imageModel: string; textModel: string; cronConfigured: boolean };
  usage: { day: string; calls: number; limit: number; left: number };
  jobs: Job[];
  images: Img[];
  counts: { section: ImageSection; status: GeneratedStatus; count: number }[];
}

const field =
  "h-10 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none";
const card = "rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-4 shadow-sm";
const STATUS_LABEL: Record<GeneratedStatus, string> = { pending: "Para aprovar", approved: "Aprovadas", rejected: "Rejeitadas" };
const themeName = (id: string) => (id === "all" ? "Todos os temas" : THEMES.find((t) => t.id === id)?.label ?? id);

function scoreStyle(img: Img) {
  if (!img.qa.checked) return "bg-slate-600 text-white";
  if (img.qa.score >= 8.5) return "bg-emerald-700 text-white";
  if (img.qa.score >= 7) return "bg-amber-400 text-black";
  return "bg-red-700 text-white";
}

export function ImageGenPanel({ language }: { language: AppLanguage }) {
  const sections = (Object.keys(SECTION_META) as ImageSection[]).filter((s) => SECTION_META[s].language === language);
  const [state, setState] = useState<State | null>(null);
  const [status, setStatus] = useState<GeneratedStatus>("pending");
  const [section, setSection] = useState<ImageSection>(sections[0]);
  const [form, setForm] = useState({ section: sections[0], themeId: "all", total: 1, engine: "image" as ImageEngine, autoApprove: false });
  const [manualCount, setManualCount] = useState<number>(1);
  const [previewImg, setPreviewImg] = useState<Img | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);


  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/image-gen?status=${status}&section=${section}`);
    if (response.ok) setState(await response.json());
  }, [status, section]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carrega o estado do painel ao abrir/trocar filtro
    void load();
  }, [load]);

  async function call(url: string, init: RequestInit, okText?: string) {
    const response = await fetch(url, init);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage({ type: "error", text: data.error ?? "Não foi possível concluir." });
      return null;
    }
    if (okText) setMessage({ type: "ok", text: okText });
    await load();
    return data;
  }

  const post = (url: string, body: unknown) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const patch = (body: unknown) => ({ method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

  async function handleResetUsage() {
    setBusy("reset-usage");
    const data = await call("/api/admin/image-gen/usage", post("", { action: "reset" }), "Cota diária zerada com sucesso!");
    if (data?.usage) {
      setState((prev) => (prev ? { ...prev, usage: data.usage } : prev));
    }
    setBusy(null);
  }

  async function runNow(howMany?: number, targetJobId?: string, force = false) {
    setRunning(true);
    setMessage(null);
    let saved = 0;
    let rejected = 0;
    const quotaLeft = state?.usage.left ?? 0;
    if (quotaLeft <= 0 && !force) {
      setMessage({ type: "error", text: "A cota diária de geração já foi esgotada. Você pode zerar a cota de hoje para continuar." });
      setRunning(false);
      return;
    }

    const requested = howMany && howMany > 0 ? howMany : manualCount;
    const targetCount = force ? requested : Math.min(requested, quotaLeft);

    for (let i = 0; i < targetCount; i++) {
      const response = await fetch("/api/admin/image-gen/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 1, jobId: targetJobId, force }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage({ type: "error", text: data.error ?? "Falha ao gerar." });
        break;
      }
      saved += Number(data.saved) || 0;
      rejected += Number(data.rejected) || 0;
      await load();
      if (data.stopped === "config" || data.stopped === "error") {
        setMessage({ type: "error", text: data.message ?? "A geração foi interrompida." });
        break;
      }
      if (data.stopped === "limit" || data.stopped === "no-jobs") {
        setMessage({
          type: "ok",
          text: `${saved} nova(s) imagem(ns) gerada(s)${rejected ? `, ${rejected} reprovada(s) na revisão` : ""}. ${
            data.stopped === "limit" ? "A cota de hoje acabou." : "Pedidos concluídos."
          }`,
        });
        break;
      }
      if (saved + rejected >= targetCount) {
        setMessage({
          type: "ok",
          text: `Concluído: ${saved} imagem(ns) gerada(s)${rejected ? `, ${rejected} reprovada(s) na revisão` : ""} (exatamente as ${targetCount} solicitada(s)).`,
        });
        break;
      }
    }
    setRunning(false);
  }

  async function createJob(runImmediately = false) {
    setBusy(runImmediately ? "create-run" : "create");
    const count = Math.max(1, form.total);
    const data = await call(
      "/api/admin/image-gen",
      post("", form),
      runImmediately ? undefined : `Pedido criado: ${count} imagem(ns). O robô gera até ${state?.config.dailyLimit ?? 5} por dia.`
    );
    if (data?.id && runImmediately) {
      const forceRun = (state?.usage.left ?? 0) === 0;
      await runNow(count, data.id, forceRun);
    }
    setBusy(null);
  }

  if (!state) return <p className="text-sm text-[var(--text-secondary)]">Carregando…</p>;
  const { config, usage } = state;
  const hasActive = state.jobs.some((j) => j.status === "active" && j.remaining > 0);
  const count = (s: GeneratedStatus) => state.counts.filter((c) => c.status === s && c.section === section).reduce((n, c) => n + c.count, 0);

  return (
    <div className="space-y-5">
      {(!config.r2 || !config.gemini) && (
        <div role="alert" className="flex gap-3 rounded-xl border-2 border-amber-500 bg-amber-100 p-4 text-sm text-amber-950">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Falta configurar variáveis de ambiente no servidor:</p>
            <ul className="mt-1 list-disc pl-5">
              {!config.r2 && <li>Cloudflare R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, ASSETS_BASE_URL)</li>}
              {!config.gemini && <li>GEMINI_API_KEY</li>}
            </ul>
          </div>
        </div>
      )}

      {message && (
        <div role="status" className={cn("rounded-xl border-2 p-3 text-sm font-medium", message.type === "ok" ? "border-emerald-600 bg-emerald-100 text-emerald-950" : "border-red-600 bg-red-100 text-red-950")}>
          {message.text}
        </div>
      )}

      {/* Cota do dia */}
      <section className={cn(card, "flex flex-wrap items-center justify-between gap-4")}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">Cota de hoje</p>
          <p className="text-3xl font-extrabold text-[var(--text)]">
            {usage.calls}<span className="text-lg font-semibold text-[var(--text-secondary)]"> / {usage.limit} imagens</span>
          </p>
          <div className="mt-2 h-2.5 w-56 max-w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div className="h-full bg-[var(--accent-soft)]" style={{ width: `${Math.min(100, (usage.calls / usage.limit) * 100)}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-xs text-[var(--text-secondary)]">
              Disponíveis hoje: <span className="font-bold text-[var(--text)]">{usage.left} imagens</span>. Zera à meia-noite (Brasília). {config.cronConfigured ? "Geração automática diária ativa." : "Defina CRON_SECRET para a geração automática diária."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleResetUsage()}
              disabled={busy !== null || running}
              className="h-7 text-xs font-semibold gap-1.5"
            >
              {busy === "reset-usage" ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
              Zerar cota de hoje
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Quantidade a gerar:</span>
            <div className="flex rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] p-0.5">
              {[1, 2, Math.min(3, usage.left || 1), Math.max(1, usage.left)].filter((v, i, arr) => arr.indexOf(v) === i && v <= Math.max(1, usage.left)).map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setManualCount(qty)}
                  className={cn(
                    "cursor-pointer rounded-md px-2.5 py-1 text-xs font-bold transition-colors",
                    manualCount === qty ? "bg-[var(--accent)] text-white shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                  )}
                >
                  {qty === usage.left && qty > 2 ? `Restante (${qty})` : qty}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => void runNow(manualCount, undefined, usage.left === 0)}
            disabled={running || !hasActive || !config.r2 || !config.gemini}
            size="lg"
            className="shadow-sm"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {running
              ? `Gerando ${manualCount} imagem(ns)…`
              : `Gerar agora (${manualCount} ${manualCount === 1 ? "imagem" : "imagens"})${usage.left === 0 ? " (Forçar)" : ""}`}
          </Button>
        </div>
      </section>

      {/* Novo pedido */}
      <section className={card}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Novo pedido</h2>
          <span className="text-xs text-[var(--text-secondary)]">Defina quantas imagens gerar (ex.: 1 ou 2)</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--text)]">Parte do app
            <select className={cn(field, "mt-1")} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value as ImageSection })}>
              {sections.map((s) => <option key={s} value={s}>{SECTION_META[s].label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--text)]">Tema
            <select className={cn(field, "mt-1")} value={form.themeId} onChange={(e) => setForm({ ...form, themeId: e.target.value })}>
              <option value="all">Todos (alternando)</option>
              {THEMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <div>
            <label className="text-sm font-semibold text-[var(--text)]">Quantidade de imagens
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={IMAGE_GEN_MAX_PER_JOB}
                  className={cn(field, "w-28")}
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: Math.max(1, Number(e.target.value)) })}
                />
                <div className="flex gap-1">
                  {[1, 2, 3, 5].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setForm({ ...form, total: q })}
                      className={cn(
                        "h-10 px-3 rounded-lg border text-xs font-bold cursor-pointer transition-colors",
                        form.total === q
                          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                          : "border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border-soft)]"
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </label>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">Se escolher 1 ou 2, serão geradas exatamente 1 ou 2 imagens.</p>
          </div>
          <label className="text-sm font-semibold text-[var(--text)]">Motor
            <select className={cn(field, "mt-1")} value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value as ImageEngine })}>
              {(Object.keys(ENGINE_META) as ImageEngine[]).map((k) => <option key={k} value={k}>{ENGINE_META[k].label}</option>)}
            </select>
          </label>
        </div>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{SECTION_META[form.section].hint} {ENGINE_META[form.engine].hint}</p>
        <label className="mt-3 flex items-center gap-2 text-sm text-[var(--text)]">
          <input type="checkbox" checked={form.autoApprove} onChange={(e) => setForm({ ...form, autoApprove: e.target.checked })} className="h-4 w-4" />
          Aprovar sozinha as imagens com nota ≥ {config.autoApproveScore} (as outras esperam a sua aprovação)
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => void createJob(true)}
            disabled={busy !== null || running || !form.total || !config.r2 || !config.gemini}
            className="shadow-sm"
          >
            {busy === "create-run" || (running && busy === null) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Criar e gerar agora ({form.total} {form.total === 1 ? "imagem" : "imagens"}){usage.left === 0 && " (Forçar)"}
          </Button>

          <Button
            variant="outline"
            onClick={() => void createJob(false)}
            disabled={busy !== null || !form.total}
          >
            {busy === "create" && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar na fila diária (sem gerar agora)
          </Button>

          <span className="text-xs text-[var(--text-secondary)]">
            {form.total} imagens ≈ {Math.ceil(form.total / config.dailyLimit)} dia(s) com o limite diário de {config.dailyLimit}.
          </span>
        </div>
      </section>

      {/* Pedidos */}
      {state.jobs.length > 0 && (
        <section className={card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[var(--text)]">Pedidos</h2>
            <span className="text-xs text-[var(--text-secondary)]">Você pode disparar qualquer pedido específico abaixo</span>
          </div>
          <ul className="space-y-3">
            {state.jobs.map((job) => (
              <li key={job.id} className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-2)]/40 p-4 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--text)]">{SECTION_META[job.section].short} · {themeName(job.themeId)} · {job.engine === "svg" ? "SVG" : "Pintura"}</p>
                  <span className="rounded-full bg-[var(--surface)] border border-[var(--border-strong)] px-2.5 py-0.5 text-xs font-bold text-[var(--text)]">
                    {{ active: "Ativo", paused: "Pausado", done: "Concluído", cancelled: "Cancelado" }[job.status]}
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${(job.produced / job.total) * 100}%` }} />
                </div>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  <strong className="text-[var(--text)]">{job.produced} de {job.total} prontas</strong> · faltam {job.remaining}
                  {job.remaining > 0 && job.status === "active" ? ` (~${Math.ceil(job.remaining / config.dailyLimit)} dia(s))` : ""}
                  {job.rejectedByReview ? ` · ${job.rejectedByReview} reprovada(s) na revisão` : ""}
                </p>
                {job.lastError && <p className="mt-2 rounded-md bg-red-100 p-2 text-xs font-medium text-red-950">Último erro: {job.lastError}</p>}
                {(job.status === "active" || job.status === "paused") && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {job.status === "active" && job.remaining > 0 && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => void runNow(1, job.id, usage.left === 0)}
                          disabled={running}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                        >
                          <Sparkles className="h-3.5 w-3.5" /> Gerar 1 agora{usage.left === 0 ? " (Forçar)" : ""}
                        </Button>
                        {job.remaining > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void runNow(usage.left > 0 ? Math.min(job.remaining, usage.left) : 1, job.id, usage.left === 0)}
                            disabled={running}
                            className="font-semibold"
                          >
                            Gerar {usage.left > 0 ? Math.min(job.remaining, usage.left) : 1} agora{usage.left === 0 ? " (Forçar)" : ""}
                          </Button>
                        )}
                      </>
                    )}
                    {job.status === "active"
                      ? <Button size="sm" variant="outline" onClick={() => call(`/api/admin/image-gen/jobs/${job.id}`, patch({ action: "pause" }))}><Pause className="h-3.5 w-3.5" /> Pausar</Button>
                      : <Button size="sm" variant="outline" onClick={() => call(`/api/admin/image-gen/jobs/${job.id}`, patch({ action: "resume" }))}><Play className="h-3.5 w-3.5" /> Retomar</Button>}
                    <Button size="sm" variant="danger" onClick={() => call(`/api/admin/image-gen/jobs/${job.id}`, patch({ action: "cancel" }))}><X className="h-3.5 w-3.5" /> Cancelar</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Galeria */}
      <section className={card}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Galeria</h2>
          <div className="flex flex-wrap gap-2">
            {sections.length > 1 && sections.map((s) => (
              <button key={s} type="button" onClick={() => setSection(s)} className={cn("cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-semibold", section === s ? "border-[var(--accent-soft)] bg-[var(--accent-soft)] text-white" : "border-[var(--border-strong)] text-[var(--text)]")}>{SECTION_META[s].short}</button>
            ))}
          </div>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {(Object.keys(STATUS_LABEL) as GeneratedStatus[]).map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)} className={cn("cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-semibold", status === s ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]" : "border-[var(--border-strong)] text-[var(--text)]")}>
              {STATUS_LABEL[s]} ({count(s)})
            </button>
          ))}
          {status === "pending" && (
            <Button size="sm" variant="secondary" onClick={async () => { const d = await call("/api/admin/image-gen/bulk", post("", { section, minScore: config.autoApproveScore })); if (d) setMessage({ type: "ok", text: `${d.approved} imagem(ns) aprovada(s).` }); }}>
              <Check className="h-3.5 w-3.5" /> Aprovar todas com nota ≥ {config.autoApproveScore}
            </Button>
          )}
        </div>

        {state.images.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--text-secondary)]">Nenhuma imagem nesta aba ainda.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.images.map((img) => (
              <article key={img.id} className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-sm hover:shadow-md transition-shadow">
                <button
                  type="button"
                  onClick={() => setPreviewImg(img)}
                  className="group relative block aspect-[3/2] w-full bg-[var(--surface-2)] cursor-pointer text-left"
                  title="Clique para ampliar e ver detalhes"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/70 p-2 text-white">
                      <ZoomIn className="h-5 w-5" />
                    </span>
                  </div>
                  <span className={cn("absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-extrabold shadow", scoreStyle(img))}>
                    {img.qa.checked ? `Nota ${img.qa.score.toFixed(1)}` : "Sem revisão"}
                  </span>
                </button>
                <div className="space-y-2 p-3">
                  <p className="text-sm font-bold text-[var(--text)]">{img.cquoi?.fr ?? img.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{img.theme} · {img.engine === "svg" ? "SVG" : "Pintura"}</p>
                  {img.elements.length > 0 && (
                    <p className="text-xs text-[var(--text)]">{img.elements.map((e) => e.kreyol).join(" · ")}</p>
                  )}
                  {img.qa.issues.length > 0 && (
                    <ul className="list-disc rounded-md bg-amber-100 py-1.5 pl-6 pr-2 text-xs font-medium text-amber-950">
                      {img.qa.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {status !== "approved" && <Button size="sm" onClick={() => call(`/api/admin/image-gen/images/${img.id}`, patch({ action: "approve" }))}><Check className="h-3.5 w-3.5" /> Aprovar</Button>}
                    {status === "pending" && <Button size="sm" variant="outline" onClick={() => call(`/api/admin/image-gen/images/${img.id}`, patch({ action: "reject" }))}><X className="h-3.5 w-3.5" /> Rejeitar</Button>}
                    {status === "approved" && <Button size="sm" variant="outline" onClick={() => call(`/api/admin/image-gen/images/${img.id}`, patch({ action: "reject" }))}><Undo2 className="h-3.5 w-3.5" /> Retirar</Button>}
                    {status === "rejected" && (
                      <Button size="sm" variant="danger" onClick={() => call(`/api/admin/image-gen/images/${img.id}`, { method: "DELETE" }, "Imagem excluída.")}><Trash2 className="h-3.5 w-3.5" /> Excluir</Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal de visualização detalhada da imagem */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-kreyol-fade-in">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewImg(null)}
              className="absolute right-4 top-4 rounded-full bg-[var(--surface-2)] p-2 text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-hidden rounded-xl bg-black/40 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewImg.src} alt={previewImg.title} className="max-h-[58vh] max-w-full object-contain" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)]">{previewImg.cquoi?.fr ?? previewImg.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{previewImg.theme} · {previewImg.engine === "svg" ? "SVG Vetorial" : "Pintura Estilo Ghibli"}</p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold shadow", scoreStyle(previewImg))}>
                  {previewImg.qa.checked ? `Avaliação IA: Nota ${previewImg.qa.score.toFixed(1)}/10` : "Sem revisão"}
                </span>
              </div>
              {previewImg.elements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Elementos identificados na cena:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {previewImg.elements.map((e, idx) => (
                      <span key={idx} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]">
                        {e.kreyol} · {e.pt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {previewImg.qa.issues.length > 0 && (
                <div className="rounded-lg bg-amber-100 p-3 text-xs text-amber-950">
                  <p className="font-bold mb-1">Observações da revisão automática:</p>
                  <ul className="list-disc pl-5 space-y-0.5 font-medium">
                    {previewImg.qa.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-[var(--border-soft)]">
                {previewImg.status !== "approved" && (
                  <Button
                    size="sm"
                    onClick={async () => {
                      await call(`/api/admin/image-gen/images/${previewImg.id}`, patch({ action: "approve" }), "Imagem aprovada com sucesso!");
                      setPreviewImg(null);
                    }}
                  >
                    <Check className="h-3.5 w-3.5" /> Aprovar Imagem
                  </Button>
                )}
                {previewImg.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await call(`/api/admin/image-gen/images/${previewImg.id}`, patch({ action: "reject" }), "Imagem rejeitada.");
                      setPreviewImg(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5" /> Rejeitar
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setPreviewImg(null)}>Fechar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
