"use client";

import { useState } from "react";
import { Cloud, HardDrive, RefreshCw, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import type { R2StorageStats } from "@/lib/r2";

export function CloudflareStorageWidget({ initialStats }: { initialStats: R2StorageStats }) {
  const [stats, setStats] = useState<R2StorageStats>(initialStats);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleRefresh() {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/storage", { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao consultar armazenamento.");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
        setFeedback("Atualizado com sucesso!");
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("Erro ao atualizar em tempo real.");
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setLoading(false);
    }
  }

  const percent = stats.percentUsed ?? 0;
  const isHealthy = percent < 80;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            <Cloud className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text)]">Armazenamento Cloudflare R2</h3>
              {stats.configured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Tempo Real
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  Não configurado
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Monitoramento da memória consumida e saldo restante do plano gratuito (10 GB)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {feedback && (
            <span className="text-xs font-medium text-[var(--text-secondary)] animate-fade-in">
              {feedback}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || !stats.configured}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition-all hover:bg-[var(--accent-soft)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Recarregar dados do Cloudflare em tempo real"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[var(--accent)]" : ""}`} />
            {loading ? "Calculando..." : "Atualizar agora"}
          </button>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Consumido */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
            <span>Memória consumida</span>
            <HardDrive className="h-4 w-4 text-orange-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[var(--text)]">
            {stats.totalFormatted}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            {percent}% dos 10 GB gratuitos
          </p>
        </div>

        {/* Sobra no plano gratuito */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
            <span>Sobra no plano gratuito</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.remainingFormatted}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Disponível de 10.00 GB livres
          </p>
        </div>

        {/* Quantidade de Arquivos */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
            <span>Arquivos guardados</span>
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[var(--text)]">
            {stats.objectCount.toLocaleString("pt-BR")}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Imagens e ativos salvos
          </p>
        </div>

        {/* Bucket */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
            <span>Bucket ativo</span>
            <Cloud className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-base font-bold truncate text-[var(--text)]" title={stats.bucket ?? "Não configurado"}>
            {stats.bucket ?? "Não configurado"}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Cloudflare R2 Storage
          </p>
        </div>
      </div>

      {/* Barra de Progresso do Armazenamento */}
      <div className="mt-5 rounded-xl bg-[var(--surface-2)]/40 p-3.5 border border-[var(--border)]">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)] mb-2">
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isHealthy ? "bg-emerald-500" : "bg-amber-500"}`} />
            Uso da cota gratuita ({percent}%)
          </span>
          <span className="text-[var(--text-secondary)] font-normal text-[11px]">
            {stats.totalFormatted} usados de 10.00 GB
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isHealthy
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-amber-500 to-red-500"
            }`}
            style={{ width: `${Math.max(percent > 0 ? 1 : 0, Math.min(100, percent))}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>0 GB</span>
          <span>5 GB (50%)</span>
          <span>10 GB (Limite do plano gratuito)</span>
        </div>
      </div>
    </div>
  );
}
