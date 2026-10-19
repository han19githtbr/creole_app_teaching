"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { MonetizationBar } from "@/components/MonetizationBar";
import { RechargeModal } from "@/components/RechargeModal";
import { Button } from "@/components/ui/button";
import { Lock, PlusCircle } from "lucide-react";
import Link from "next/link";

interface GameMonetizationWrapperProps {
  children: ReactNode;
}

export function GameMonetizationWrapper({ children }: GameMonetizationWrapperProps) {
  const { status, isActive, isBlocked, refreshStatus, consume } = useUsageTracker({
    feature: "cquoi",
    enabled: true,
  });

  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const consumedRef = useRef(false);

  // Quando o status carrega e o aluno tem acesso, registra o consumo da partida (1 unidade de jogo)
  useEffect(() => {
    if (!status || consumedRef.current) return;
    if (status.hasUnlimitedAccess || status.canAccessGame) {
      consumedRef.current = true;
      consume("game").catch((err) => console.warn("Falha ao registrar consumo de jogo:", err));
    }
  }, [status, consume]);

  return (
    <div className="space-y-4">
      {/* Barra de Status e Contagem de Tempo da Monetização */}
      <div className="mx-auto max-w-5xl px-2 sm:px-0">
        <MonetizationBar
          status={status}
          feature="cquoi"
          isActive={isActive}
          onRefresh={refreshStatus}
        />
      </div>

      {/* Se o aluno estiver bloqueado (sem saldo de minutos e sem degustação ativa) */}
      {isBlocked ? (
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-purple-500/40 bg-gradient-to-b from-purple-500/10 to-purple-500/5 p-8 text-center backdrop-blur-sm space-y-4 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/20 text-purple-500 shadow-inner">
            <Lock className="h-7 w-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-[var(--text)]">
              Tempo de Jogo Esgotado
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Seu período de degustação de 3 dias finalizou ou seus minutos para jogar acabaram.
              Recarregue seus minutos agora para continuar competindo na arena e se divertindo com o C&apos;est quoi ?!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => setRechargeModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 px-6 shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              Recarregar Minutos (a partir de R$ 15)
            </Button>

            <Link href="/dashboard">
              <Button variant="outline" className="text-xs">
                Voltar ao Painel
              </Button>
            </Link>
          </div>

          <RechargeModal
            isOpen={rechargeModalOpen}
            onClose={() => setRechargeModalOpen(false)}
            packages={status?.packages || []}
            returnTo="game"
            onSuccess={() => {
              refreshStatus();
            }}
          />
        </div>
      ) : (
        /* Jogo Ativo */
        children
      )}
    </div>
  );
}
