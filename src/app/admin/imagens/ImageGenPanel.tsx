"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, Loader2, Pause, Play, Sparkles, Trash2, Undo2, X } from "lucide-react";
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
  const [form, setForm] = useState({ section: sections[0], themeId: "all", total: 10, engine: "image" as ImageEngine, autoApprove: false });
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

  async function createJob() {
    setBusy("create");
    await call("/api/admin/image-gen", post("", form), `Pedido criado: ${form.total} imagens. O robô gera até ${state?.config.dailyLimit ?? 5} por dia.`);
    setBusy(null);
  }

  async function runNow() {
    setRunning(true);
    setMessage(null);
    let saved = 0;
    let rejected = 0;
    // Uma imagem por requisição: repete até acabar a cota do dia ou os pedidos.
    for (let i = 0; i < 20; i++) {
      const response = await fetch("/api/admin/image-gen/run", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage({ type: "error", text: data.error ?? "Falha ao gerar." });
        break;
      }
      saved += data.saved;
      rejected += data.rejected;
      await load();
      if (data.stopped === "config" || data.stopped === "error") {
        setMessage({ type: "error", text: data.message ?? "A geração foi interrompida." });
        break;
      }
      if (data.stopped === "limit" || data.stopped === "no-jobs") {
        setMessage({
          type: "ok",
          text: `${saved} nova(s) imagem(ns) para revisar${rejected ? `, ${rejected} reprovada(s) pela revisão automática` : ""}. ${
            data.stopped === "limit" ? "A cota de hoje acabou." : "Não há pedidos ativos."
          }`,
        });
        break;
      }
    }
    setRunning(false);
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
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Zera à meia-noite (Brasília). {config.cronConfigured ? "Geração automática diária ativa." : "Defina CRON_SECRET para a geração automática diária."}
          </p>
        </div>
        <Button onClick={runNow} disabled={running || !hasActive || usage.left === 0 || !config.r2 || !config.gemini} size="lg">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {running ? "Gerando… (pode levar 1 min por imagem)" : "Gerar agora (usa a cota de hoje)"}
        </Button>
      </section>

      {/* Novo pedido */}
      <section className={card}>
        <h2 className="mb-3 text-lg font-bold text-[var(--text)]">Novo pedido</h2>
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
          <label className="text-sm font-semibold text-[var(--text)]">Quantidade de imagens
            <input type="number" min={1} max={IMAGE_GEN_MAX_PER_JOB} className={cn(field, "mt-1")} value={form.total} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} />
          </label>
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
          <Button onClick={createJob} disabled={busy === "create" || !form.total}>
            {busy === "create" && <Loader2 className="h-4 w-4 animate-spin" />} Ativar geração
          </Button>
          <span className="text-xs text-[var(--text-secondary)]">
            {form.total} imagens ≈ {Math.ceil(form.total / config.dailyLimit)} dia(s) com o limite de {config.dailyLimit} por dia.
          </span>
        </div>
      </section>

      {/* Pedidos */}
      {state.jobs.length > 0 && (
        <section className={card}>
          <h2 className="mb-3 text-lg font-bold text-[var(--text)]">Pedidos</h2>
          <ul className="space-y-3">
            {state.jobs.map((job) => (
              <li key={job.id} className="rounded-lg border border-[var(--border-strong)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--text)]">{SECTION_META[job.section].short} · {themeName(job.themeId)} · {job.engine === "svg" ? "SVG" : "Pintura"}</p>
                  <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs font-bold text-[var(--text)]">
                    {{ active: "Ativo", paused: "Pausado", done: "Concluído", cancelled: "Cancelado" }[job.status]}
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div className="h-full bg-emerald-600" style={{ width: `${(job.produced / job.total) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {job.produced} de {job.total} prontas · faltam {job.remaining}
                  {job.remaining > 0 && job.status === "active" ? ` (~${Math.ceil(job.remaining / config.dailyLimit)} dia(s))` : ""}
                  {job.rejectedByReview ? ` · ${job.rejectedByReview} reprovada(s) na revisão` : ""}
                </p>
                {job.lastError && <p className="mt-2 rounded-md bg-red-100 p-2 text-xs font-medium text-red-950">Último erro: {job.lastError}</p>}
                {(job.status === "active" || job.status === "paused") && (
                  <div className="mt-2 flex gap-2">
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
              <article key={img.id} className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)]">
                <div className="relative aspect-[3/2] bg-[var(--surface-2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.title} loading="lazy" className="h-full w-full object-cover" />
                  <span className={cn("absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-extrabold shadow", scoreStyle(img))}>
                    {img.qa.checked ? `Nota ${img.qa.score.toFixed(1)}` : "Sem revisão"}
                  </span>
                </div>
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
    </div>
  );
}
