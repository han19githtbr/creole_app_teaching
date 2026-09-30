"use client";

import "@livekit/components-styles";
import { useEffect, useRef, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useLocalParticipant,
} from "@livekit/components-react";
import { LocalVideoTrack } from "livekit-client";
import { Sparkles, X } from "lucide-react";
import { VirtualBackgroundPicker } from "@/components/VirtualBackgroundPicker";
import { LiveBackgroundProcessor } from "@/lib/liveBackgroundProcessor";
import { VIRTUAL_BG_STORAGE_KEY } from "@/lib/virtualBackground";

/**
 * Painel de fundo virtual (estilo Google Meet) — só aparece para quem transmite.
 * Aplica o processador na faixa da câmera e troca o fundo sem reconectar.
 */
function LiveBackgroundControl() {
  const { cameraTrack } = useLocalParticipant();
  const [open, setOpen] = useState(false);
  const [bgId, setBgId] = useState<string>("none");
  const [loaded, setLoaded] = useState(false);
  const processorRef = useRef<LiveBackgroundProcessor | null>(null);
  const appliedTrackRef = useRef<unknown>(null);

  // Lembra o último fundo escolhido neste navegador.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIRTUAL_BG_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setBgId(saved);
    } catch {
      /* localStorage indisponível */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(VIRTUAL_BG_STORAGE_KEY, bgId);
    } catch {
      /* ignora */
    }
  }, [bgId, loaded]);

  const rawTrack = cameraTrack?.videoTrack;
  const track = rawTrack instanceof LocalVideoTrack ? rawTrack : undefined;

  useEffect(() => {
    if (!loaded || !track) return;
    let cancelled = false;

    async function apply() {
      if (!track) return;
      if (bgId === "none") {
        if (processorRef.current) {
          await track.stopProcessor().catch(() => {});
          processorRef.current = null;
          appliedTrackRef.current = null;
        }
        return;
      }
      if (processorRef.current && appliedTrackRef.current === track) {
        processorRef.current.setBackground(bgId);
        return;
      }
      const proc = new LiveBackgroundProcessor(bgId);
      try {
        await track.setProcessor(proc);
        if (cancelled) {
          await track.stopProcessor().catch(() => {});
          return;
        }
        processorRef.current = proc;
        appliedTrackRef.current = track;
      } catch (e) {
        console.warn("Não foi possível aplicar o fundo virtual:", e);
      }
    }

    apply();
    return () => {
      cancelled = true;
    };
  }, [bgId, track, loaded]);

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/85 cursor-pointer"
      >
        <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
        Fundo virtual
      </button>

      {open && (
        <div className="pointer-events-auto w-[min(22rem,100%)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text)] shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold">Fundo da câmera</p>
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-2)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <VirtualBackgroundPicker value={bgId} onChange={setBgId} compact maxHeightClass="max-h-[45vh]" />
          <p className="mt-2 text-[10px] leading-snug text-[var(--text-muted)]">
            O fundo é aplicado na sua câmera antes de transmitir — os alunos veem exatamente o que você escolher.
          </p>
        </div>
      )}
    </div>
  );
}

export function LiveRoom({
  token,
  serverUrl,
  canPublish,
}: {
  token: string;
  serverUrl: string;
  canPublish: boolean;
}) {
  return (
    <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-xl border border-[var(--border)] bg-black">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        video={canPublish}
        audio={canPublish}
        data-lk-theme="default"
        style={{ height: "100%" }}
      >
        <VideoConference chatMessageFormatter={undefined} />
        <RoomAudioRenderer />
        {canPublish && <LiveBackgroundControl />}
      </LiveKitRoom>
    </div>
  );
}
