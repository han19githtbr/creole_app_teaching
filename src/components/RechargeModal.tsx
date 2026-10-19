"use client";

import { useState } from "react";
import { type IMonetizationPackage } from "@/models/MonetizationSettings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Clock, Check, X, CreditCard, AlertCircle, ShieldCheck } from "lucide-react";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: IMonetizationPackage[];
  onSuccess: () => void;
  /** Para onde o aluno volta depois do pagamento no Stripe. */
  returnTo?: "stories" | "game";
}

// A liberação sem pagamento só existe em desenvolvimento (e o servidor ainda exige administrador).
const SHOW_DEV_INSTANT_UNLOCK = process.env.NODE_ENV !== "production";

export function RechargeModal({
  isOpen,
  onClose,
  packages,
  onSuccess,
  returnTo = "stories",
}: RechargeModalProps) {
  const [selectedPkg, setSelectedPkg] = useState<IMonetizationPackage | null>(
    packages.find((p) => p.isPopular) || packages[0] || null
  );
  const [loading, setLoading] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPackage = (pkg: IMonetizationPackage) => {
    setSelectedPkg(pkg);
    setError(null);
  };

  const handleStripeCheckout = async () => {
    if (!selectedPkg) return;
    setLoadingStripe(true);
    setError(null);
    try {
      const res = await fetch("/api/user/monetization/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPkg.id, method: "stripe", returnTo }),
      });
      const data = await res.json();
      if (res.ok && data.stripeUrl) {
        window.location.href = data.stripeUrl;
      } else {
        setError(data.message || data.error || "Não foi possível iniciar o checkout Stripe.");
      }
    } catch (err) {
      console.error("Erro no Stripe Checkout:", err);
      setError("Erro ao comunicar com o servidor.");
    } finally {
      setLoadingStripe(false);
    }
  };

  // Somente desenvolvimento: o botão não aparece em produção e o servidor também recusa.
  const handleDevInstantUnlock = async () => {
    if (!selectedPkg) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/monetization/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPkg.id, method: "dev", simulateInstant: true }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || data.error || "Não foi possível liberar o pacote.");
      }
    } catch (err) {
      console.error("Erro ao liberar pacote (dev):", err);
      setError("Erro ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Recarregar Minutos de Aprendizado
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Acesso exclusivo às Histórias Vivas e ao Jogo C&apos;est quoi ? com liberdade total.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-2)] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerta de erro */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Seleção de Pacotes */}
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {packages.map((pkg) => {
              const isSelected = selectedPkg?.id === pkg.id;
              return (
                <Card
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`cursor-pointer transition-all border-2 p-4 text-center relative ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 shadow-md scale-[1.02]"
                      : "border-[var(--border)] hover:border-amber-400/50 bg-[var(--surface)]"
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                      Mais Popular
                    </span>
                  )}
                  <h3 className="font-bold text-sm text-[var(--text)]">{pkg.name}</h3>
                  <div className="mt-2 text-2xl font-black text-amber-500">
                    R$ {pkg.priceBRL.toFixed(2).replace(".", ",")}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[var(--text)] flex items-center justify-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    {pkg.minutes} minutos
                  </div>
                  {pkg.bonusStories > 0 && (
                    <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-md py-1">
                      + {pkg.bonusStories} Histórias bônus
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {selectedPkg && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs text-[var(--text-secondary)] space-y-1.5">
              <div className="flex justify-between font-semibold text-[var(--text)]">
                <span>Pacote Escolhido:</span>
                <span>{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Tempo de aprendizado:</span>
                <span className="font-bold text-amber-500">{selectedPkg.minutes} minutos ativos</span>
              </div>
              {selectedPkg.bonusStories > 0 && (
                <div className="flex justify-between">
                  <span>Bônus especial:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedPkg.bonusStories} histórias livres da cota
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-sm text-[var(--text)]">
                <span>Total a pagar:</span>
                <span>R$ {selectedPkg.priceBRL.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          )}

          {/* Pagamento real (Stripe Checkout). O saldo é creditado pelo webhook após a confirmação. */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleStripeCheckout}
              disabled={loadingStripe || !selectedPkg}
              className="w-full bg-[#635bff] hover:bg-[#534be0] text-white font-bold h-10 shadow-sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {loadingStripe ? "Conectando ao Stripe..." : "Pagar com Stripe (Cartão de Crédito)"}
            </Button>
            <p className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)]">
              <ShieldCheck className="h-3 w-3" />
              Pagamento seguro processado pelo Stripe. Seus dados de cartão não passam pelo nosso servidor.
            </p>

            {SHOW_DEV_INSTANT_UNLOCK && (
              <Button
                variant="outline"
                onClick={handleDevInstantUnlock}
                disabled={loading || !selectedPkg}
                className="w-full border-amber-500 text-amber-600 hover:bg-amber-500/10 font-semibold"
                title="Somente em desenvolvimento e só para administrador: libera o pacote sem cobrar"
              >
                <Check className="h-4 w-4 mr-1" />
                Liberar sem pagar (somente dev/admin)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
