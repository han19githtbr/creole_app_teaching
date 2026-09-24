"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LiveBadge } from "@/components/LiveBadge";
import { LiveRoom } from "@/components/LiveRoom";
import { Radio, Circle, Video, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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

  // Quick Live to Video Lesson publisher state
  const [liveTitle, setLiveTitle] = useState("Gravação da Aula ao Vivo de Kreyòl");
  const [recordingUrl, setRecordingUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

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

  async function handlePublishLiveRecording(e: React.FormEvent) {
    e.preventDefault();
    if (!recordingUrl.trim()) {
      setPublishError("Informe a URL ou link da gravação da aula.");
      return;
    }

    setPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: liveTitle.trim(),
          description: "Gravação oficial da transmissão ao vivo.",
          videoUrl: recordingUrl.trim(),
          isLiveRecording: true,
          isPublished: true,
          customization: {
            backgroundStyle: "haiti_flag",
            avatarType: "webcam",
            frameStyle: "rounded",
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao publicar gravação.");
      }

      setPublishSuccess(true);
      setRecordingUrl("");
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Erro ao publicar gravação.");
    } finally {
      setPublishing(false);
    }
  }

  if (!status) {
    return <div className="py-8 text-center text-[var(--text-muted)]">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Live Status Control */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-[var(--text)]">Status da aula</p>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                {status.isLive ? <LiveBadge isLive /> : "Offline"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={recording}
                disabled={status.isLive}
                onChange={(e) => setRecording(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border-strong)]"
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
        <p className="text-sm text-[#b45309] dark:text-amber-400">
          O servidor LiveKit ainda não está configurado — configure{" "}
          <code>LIVEKIT_API_KEY</code>, <code>LIVEKIT_API_SECRET</code> e{" "}
          <code>NEXT_PUBLIC_LIVEKIT_URL</code> para transmitir de verdade (veja o README.md).
          O controle de status acima funciona normalmente.
        </p>
      )}

      {status.isLive && status.livekitConfigured && status.token && status.livekitUrl && (
        <LiveRoom token={status.token} serverUrl={status.livekitUrl} canPublish />
      )}

      {/* Disseminate / Publish Recorded Live Card */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text)]">
              Disponibilizar Gravação de Aula para os Alunos
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Transforme a gravação de uma live ou aula externa em uma aula gravada disponível no catálogo.
            </p>
          </div>
        </div>

        <form onSubmit={handlePublishLiveRecording} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Título da Aula Gravada
              </label>
              <Input
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                placeholder="Ex: Aula Ao Vivo #1 - Pronúncia e Saudações"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                URL da Gravação (Link do vídeo, YouTube, S3, etc.)
              </label>
              <Input
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          </div>

          {publishSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Aula gravada publicada com sucesso! Ela já aparece na área dos alunos.
            </div>
          )}

          {publishError && (
            <p className="text-xs text-[#dc2626]">{publishError}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/admin/videos/record"
              className="text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              Prefere gravar no estúdio com bonequinhos? Clique aqui →
            </Link>

            <Button type="submit" size="sm" disabled={publishing}>
              {publishing ? "Publicando..." : "Publicar Aula Gravada"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
