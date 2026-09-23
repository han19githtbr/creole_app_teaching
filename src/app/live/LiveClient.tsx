"use client";

import { useEffect, useState } from "react";
import { LiveRoom } from "@/components/LiveRoom";
import { LiveBadge } from "@/components/LiveBadge";
import { Radio } from "lucide-react";

interface LiveStatus {
  isLive: boolean;
  isRecording: boolean;
  title: string;
  livekitUrl: string | null;
  livekitConfigured: boolean;
  token: string | null;
}

export function LiveClient({ isAdmin }: { isAdmin: boolean }) {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const res = await fetch("/api/live");
      const data = await res.json();
      if (mounted) {
        setStatus(data);
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-[var(--text-muted)]">Carregando...</div>;
  }

  if (!status?.isLive) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <Radio className="mx-auto mb-4 h-10 w-10 text-[var(--text-muted)]" />
        <h2 className="text-lg font-semibold text-[var(--text)]">Nenhuma aula ao vivo agora</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Volte quando a professora iniciar a próxima aula. Avisos aparecem no seu painel.
        </p>
      </div>
    );
  }

  if (!status.livekitConfigured || !status.token || !status.livekitUrl) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          A aula está ao vivo, mas o servidor de vídeo (LiveKit) ainda não foi configurado.
          Configure as variáveis <code>LIVEKIT_API_KEY</code>, <code>LIVEKIT_API_SECRET</code> e{" "}
          <code>NEXT_PUBLIC_LIVEKIT_URL</code> — veja o README.md.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-bold text-[var(--text)]">
          {status.title}
          <LiveBadge isLive={status.isLive} />
        </h1>
        {status.isRecording && (
          <span className="text-xs font-medium text-[#dc2626]">● Gravando</span>
        )}
      </div>
      <LiveRoom token={status.token} serverUrl={status.livekitUrl} canPublish={isAdmin} />
    </div>
  );
}
