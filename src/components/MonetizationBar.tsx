"use client";

import { useState } from "react";
import type { UserMonetizationStatus } from "@/lib/monetization";
import { RechargeModal } from "@/components/RechargeModal";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Gift, Clock, PlusCircle } from "lucide-react";

interface MonetizationBarProps {
  status: UserMonetizationStatus | null;
  feature: "stories" | "cquoi";
  isActive?: boolean;
  onRefresh?: () => void;
}

export function MonetizationBar({
  status,
  feature,
  isActive = true,
  onRefresh,
}: MonetizationBarProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!status) return null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/90 px-3 py-2 text-xs backdrop-blur-sm shadow-sm transition-all">
        {/* Lado Esquerdo: Identificação do Status */}
        <div className="flex items-center gap-2">
          {status.isAdmin ? (
            <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin · Acesso Total Ilimitado</span>
            </div>
          ) : status.isExempt ? (
            <div className="flex items-center gap-1.5 font-semibold text-purple-600 dark:text-purple-400">
              <Gift className="h-4 w-4" />
              <span>Acesso Gratuito VIP {status.freeAccessReason ? `(${status.freeAccessReason})` : ""}</span>
            </div>
          ) : status.inTrial ? (
            <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
              <span>
                Degustação: {status.trialDaysLeft} {status.trialDaysLeft === 1 ? "dia restante" : "dias restantes"} ·{" "}
                {feature === "stories"
                  ? `${status.trialStoriesLeft} histórias livres`
                  : `${status.trialGamesLeft} jogos livres`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>
                Saldo: <strong className="text-amber-500">{Math.floor(status.availableMinutes)} min</strong> disponíveis
                {status.bonusStoriesBalance > 0 && feature === "stories" && (
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                    · +{status.bonusStoriesBalance} bônus
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Indicador de Tempo Ativo (pulsa quando o usuário está interagindo na tela) */}
          {!status.hasUnlimitedAccess && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-neutral-500/10 text-neutral-500"
              }`}
              title={
                isActive
                  ? "Tempo ativo sendo contabilizado"
                  : "Cronômetro pausado (aba inativa ou em pausa)"
              }
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                }`}
              />
              {isActive ? "Tempo Ativo" : "Pausado"}
            </span>
          )}
        </div>

        {/* Lado Direito: Botão de Recarga */}
        {!status.hasUnlimitedAccess && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setModalOpen(true)}
            className="h-7 gap-1 border-amber-500/60 text-xs font-semibold text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Recarregar Minutos
          </Button>
        )}
      </div>

      <RechargeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packages={status.packages}
        onSuccess={() => {
          onRefresh?.();
        }}
      />
    </>
  );
}
