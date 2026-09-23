"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LiveBadge } from "@/components/LiveBadge";
import { LiveRoom } from "@/components/LiveRoom";
import { Radio, Circle } from "lucide-react";

interface LiveStatus {
  isLive: boolean;
  isRecording: boolean;
  title: string;
  livekitUrl: string | null;
  livekitConfigured: boolean;
  token: string | null;
}

export function AdminLiveControl() {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/live");
    return res.json();
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await refresh();
      if (mounted) {
        setStatus(data);
        setRecording(data.isRecording);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function toggleLive() {
    setBusy(true);
    try {
      await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: status?.isLive ? "stop" : "start",
          isRecording: recording,
          title: "Aula ao vivo",
        }),
      });
      const data = await refresh();
      setStatus(data);
      setRecording(data.isRecording);
    } finally {
      setBusy(false);
    }
  }

  if (!status) {
    return <div className="py-8 text-center text-[#a8a29e]">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef2ff] text-[#3730a3]">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-[#1c1917]">Status da aula</p>
              <div className="flex items-center gap-2 text-sm text-[#78716c]">
                {status.isLive ? <LiveBadge isLive /> : "Offline"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#44403c]">
              <input
                type="checkbox"
                checked={recording}
                disabled={status.isLive}
                onChange={(e) => setRecording(e.target.checked)}
                className="h-4 w-4 rounded border-[#d6d3d1]"
              />
              <Circle className="h-3 w-3 text-[#dc2626]" /> Gravar esta aula
            </label>
            <Button
              variant={status.isLive ? "danger" : "primary"}
              onClick={toggleLive}
              disabled={busy}
            >
              {status.isLive ? "Encerrar Live" : "Ficar Online"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!status.livekitConfigured && (
        <p className="text-sm text-[#b45309]">
          O servidor LiveKit ainda não está configurado — configure{" "}
          <code>LIVEKIT_API_KEY</code>, <code>LIVEKIT_API_SECRET</code> e{" "}
          <code>NEXT_PUBLIC_LIVEKIT_URL</code> para transmitir de verdade (veja o README.md).
          O controle de status acima funciona normalmente.
        </p>
      )}

      {status.isLive && status.livekitConfigured && status.token && status.livekitUrl && (
        <LiveRoom token={status.token} serverUrl={status.livekitUrl} canPublish />
      )}
    </div>
  );
}
