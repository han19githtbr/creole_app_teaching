import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <WifiOff className="mb-4 h-10 w-10 text-[var(--text-muted)]" />
      <h1 className="text-xl font-semibold text-[var(--text)]">Você está offline</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Não foi possível carregar esta página sem conexão. Verifique sua internet e tente
        novamente — páginas que você já visitou podem continuar disponíveis.
      </p>
    </div>
  );
}
