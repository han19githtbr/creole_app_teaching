"use client";

import { useEffect, useRef, useState } from "react";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { MonetizationBar } from "@/components/MonetizationBar";
import { RechargeModal } from "@/components/RechargeModal";
import { StoryPlayer, type StoryPlayerData } from "@/components/StoryPlayer";
import { Button } from "@/components/ui/button";
import { Lock, PlusCircle } from "lucide-react";
import Link from "next/link";

interface StoryMonetizationWrapperProps {
  story: StoryPlayerData;
}

export function StoryMonetizationWrapper({ story }: StoryMonetizationWrapperProps) {
  const { status, isActive, isBlocked, refreshStatus, consume } = useUsageTracker({
    feature: "stories",
    enabled: true,
  });

  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const consumedRef = useRef(false);

  // Quando o status carrega e o aluno tem acesso, registra o consumo da história (1 unidade)
  useEffect(() => {
    if (!status || consumedRef.current) return;
    if (status.hasUnlimitedAccess || status.canAccessStories) {
      consumedRef.current = true;
      consume("story").catch((err) => console.warn("Falha ao registrar consumo de história:", err));
    }
  }, [status, consume]);

  return (
    <div className="space-y-4">
      {/* Barra de Status e Contagem de Tempo da Monetização */}
      <MonetizationBar
        status={status}
        feature="stories"
        isActive={isActive}
        onRefresh={refreshStatus}
      />

      {/* Se o aluno estiver bloqueado (sem saldo de minutos e sem degustação ativa) */}
      {isBlocked ? (
        <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-amber-500/5 p-8 text-center backdrop-blur-sm space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 shadow-inner">
            <Lock className="h-7 w-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-[var(--text)]">
              Cota de Histórias Encerrada
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Seu período de degustação de 3 dias finalizou ou seus minutos de histórias acabaram.
              Recarregue seus minutos agora para continuar ouvindo e aprendendo com as histórias vivas!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => setRechargeModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 px-6 shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              Recarregar Minutos (a partir de R$ 15)
            </Button>

            <Link href="/dashboard/stories">
              <Button variant="outline" className="text-xs">
                Voltar às Histórias
              </Button>
            </Link>
          </div>

          <RechargeModal
            isOpen={rechargeModalOpen}
            onClose={() => setRechargeModalOpen(false)}
            packages={status?.packages || []}
            onSuccess={() => {
              refreshStatus();
            }}
          />
        </div>
      ) : (
        /* Player da História com Acesso Liberado */
        <StoryPlayer story={story} />
      )}
    </div>
  );
}
