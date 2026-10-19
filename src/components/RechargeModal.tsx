"use client";

import { useState } from "react";
import { type IMonetizationPackage } from "@/models/MonetizationSettings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Clock, Check, X, QrCode, Copy, ShieldCheck, CreditCard, AlertCircle } from "lucide-react";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: IMonetizationPackage[];
  onSuccess: () => void;
}

export function RechargeModal({
  isOpen,
  onClose,
  packages,
  onSuccess,
}: RechargeModalProps) {
  const [selectedPkg, setSelectedPkg] = useState<IMonetizationPackage | null>(
    packages.find((p) => p.isPopular) || packages[0] || null
  );
  const [loading, setLoading] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{ pixCode: string; qrCodeUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectPackage = (pkg: IMonetizationPackage) => {
    setSelectedPkg(pkg);
    setPixData(null);
    setStripeError(null);
  };

  const handleStripeCheckout = async () => {
    if (!selectedPkg) return;
    setLoadingStripe(true);
    setStripeError(null);
    try {
      const res = await fetch("/api/user/monetization/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPkg.id, method: "stripe" }),
      });
      const data = await res.json();
      if (res.ok && data.stripeUrl) {
        window.location.href = data.stripeUrl;
      } else {
        setStripeError(data.message || data.error || "Não foi possível iniciar o checkout Stripe.");
      }
    } catch (err) {
      console.error("Erro no Stripe Checkout:", err);
      setStripeError("Erro ao comunicar com o servidor.");
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleGeneratePix = async () => {
    if (!selectedPkg) return;
    setLoading(true);
    setStripeError(null);
    try {
      const res = await fetch("/api/user/monetization/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPkg.id, method: "pix", simulateInstant: false }),
      });
      const data = await res.json();
      if (data.success) {
        setPixData({ pixCode: data.pixCode, qrCodeUrl: data.qrCodeUrl });
      }
    } catch (err) {
      console.error("Erro ao gerar PIX:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantConfirm = async () => {
    if (!selectedPkg) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/monetization/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPkg.id, simulateInstant: true }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Erro ao confirmar recarga:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixData?.pixCode) return;
    navigator.clipboard.writeText(pixData.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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

        {/* Alerta de Erro do Stripe */}
        {stripeError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{stripeError}</span>
          </div>
        )}

        {/* Seleção de Pacotes */}
        {!pixData ? (
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

            {/* Ações de Pagamento: Stripe (Cartão Real), PIX e Simulação */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleStripeCheckout}
                disabled={loadingStripe || !selectedPkg}
                className="w-full bg-[#635bff] hover:bg-[#534be0] text-white font-bold h-10 shadow-sm"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loadingStripe ? "Conectando ao Stripe..." : "Pagar com Stripe (Cartão de Crédito)"}
              </Button>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleGeneratePix}
                  disabled={loading || !selectedPkg}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <QrCode className="h-4 w-4 mr-1.5" />
                  Pagar com PIX
                </Button>
                <Button
                  variant="outline"
                  onClick={handleInstantConfirm}
                  disabled={loading || !selectedPkg}
                  className="border-amber-500 text-amber-600 hover:bg-amber-500/10 font-semibold"
                  title="Simula a confirmação imediata da recarga no ambiente de teste"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Liberar Imediato (Teste)
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Tela de QR Code do PIX */
          <div className="mt-5 space-y-4 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Escaneie o QR Code abaixo no app do seu banco ou use a chave Copia-e-Cola:
            </p>

            <div className="flex justify-center p-3 bg-white rounded-xl shadow-inner inline-block mx-auto border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pixData.qrCodeUrl}
                alt="QR Code PIX"
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="flex items-center gap-2 max-w-md mx-auto">
              <input
                readOnly
                value={pixData.pixCode}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-mono text-[var(--text)] truncate"
              />
              <Button size="sm" onClick={handleCopyPix} className="gap-1 bg-amber-500 hover:bg-amber-600">
                {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleInstantConfirm}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                Já realizei o pagamento (Liberar Acesso)
              </Button>
              <Button variant="ghost" onClick={() => setPixData(null)}>
                Voltar aos pacotes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
