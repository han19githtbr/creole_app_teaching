"use client";

import { useEffect } from "react";

/** Tela de erro amigável: qualquer falha de renderização/dados cai aqui em vez da página genérica do Next. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app] erro de página:", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <h1 className="text-xl font-bold text-[var(--text)]">Não foi possível carregar esta página</h1>
      <p className="text-sm text-[var(--text-secondary)]">
        Pode ser uma oscilação momentânea da conexão com o banco de dados. Tente novamente em instantes.
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => reset()} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white">
          Tentar de novo
        </button>
        <button type="button" onClick={() => window.history.back()} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">
          Voltar
        </button>
      </div>
    </div>
  );
}
