"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  VIDEO_BACKGROUNDS,
  VIDEO_AVATARS,
  VIDEO_FRAME_STYLES,
} from "@/lib/videoThemes";
import {
  Calendar,
  Camera,
  FileVideo,
  Layers,
  Link2,
  Palette,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";

export function VideoUploadForm() {
  const router = useRouter();

  const [sourceType, setSourceType] = useState<"upload" | "url">("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("5");
  const [durationSeconds, setDurationSeconds] = useState("0");

  // Customization
  const [backgroundStyle, setBackgroundStyle] = useState("haiti_flag");
  const [avatarType, setAvatarType] = useState("prof_alex");
  const [frameStyle, setFrameStyle] = useState("rounded");
  const [bannerText, setBannerText] = useState("");

  // Scheduling
  const [publishMode, setPublishMode] = useState<"immediate" | "scheduled" | "draft">("immediate");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("18:00");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("O título do vídeo é obrigatório.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let finalVideoUrl = videoUrl.trim();

      // If uploading a file, first send to upload API
      if (sourceType === "upload") {
        if (!videoFile) {
          throw new Error("Selecione um arquivo de vídeo para enviar.");
        }
        const blob = await upload(videoFile.name, videoFile, {
          access: "public",
          handleUploadUrl: "/api/videos/upload",
          contentType: (videoFile.type || "video/mp4").split(";")[0],
        });

        finalVideoUrl = blob.url;
      } else {
        if (!finalVideoUrl) {
          throw new Error("Informe o link do vídeo (YouTube, Vimeo ou URL direto).");
        }
      }

      // Calculate total duration in seconds
      const totalSeconds =
        (parseInt(durationMinutes, 10) || 0) * 60 + (parseInt(durationSeconds, 10) || 0);

      // Publish At logic
      let publishAt: string | null = null;
      let isPublished = true;

      if (publishMode === "draft") {
        isPublished = false;
      } else if (publishMode === "scheduled") {
        if (!scheduledDate) {
          throw new Error("Selecione a data de agendamento.");
        }
        publishAt = new Date(`${scheduledDate}T${scheduledTime || "18:00"}:00`).toISOString();
      }

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl: finalVideoUrl,
          duration: totalSeconds,
          isPublished,
          publishAt,
          customization: {
            backgroundStyle,
            avatarType,
            frameStyle,
            bannerText,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao registrar o vídeo.");
      }

      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar vídeo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Studio Recorder Callout Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent-soft)] via-[var(--surface)] to-[var(--accent-soft)] p-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-md">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text)]">
              Quer gravar um vídeo agora mesmo com a câmera ou bonequinhos?
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Use o Estúdio de Gravação integrado para capturar até 10 minutos com efeitos e animações.
            </p>
          </div>
        </div>
        <Link href="/admin/videos/record">
          <Button variant="danger" size="md" className="gap-2 bg-[#dc2626] hover:bg-[#b91c1c]">
            <Video className="h-4 w-4" /> Abrir Estúdio de Gravação
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[var(--text)]">
            Informações do Vídeo
          </h2>

          {/* Source Selection: Upload vs URL */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Origem do Vídeo
            </label>
            <div className="grid grid-cols-2 gap-3 sm:max-w-md">
              <button
                type="button"
                onClick={() => setSourceType("upload")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all cursor-pointer ${
                  sourceType === "upload"
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)]"
                }`}
              >
                <Upload className="h-4 w-4" /> Enviar Arquivo
              </button>
              <button
                type="button"
                onClick={() => setSourceType("url")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all cursor-pointer ${
                  sourceType === "url"
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)]"
                }`}
              >
                <Link2 className="h-4 w-4" /> Link Externo
              </button>
            </div>

            {sourceType === "upload" ? (
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-strong)] p-6 text-center hover:border-[var(--accent)] transition-colors cursor-pointer bg-[var(--surface-2)]">
                  <FileVideo className="h-8 w-8 text-[var(--accent)] mb-2" />
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {videoFile ? videoFile.name : "Clique para selecionar o vídeo (MP4 ou WebM)"}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] mt-1">
                    {videoFile ? `${(videoFile.size / 1024 / 1024).toFixed(2)} MB` : "Máximo sugerido: 10 minutos"}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... ou link direto .mp4"
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text)]">
              Título do Vídeo *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Alfabeto e Sons em Crioulo Haitiano"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text)]">
              Descrição e Notas da Aula
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas, vocabulário e exercícios relacionados ao vídeo..."
              rows={4}
              className="font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:max-w-xs">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Minutos
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Segundos
              </label>
              <Input
                type="number"
                min="0"
                max="59"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Customization Section */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text)]">
            <Palette className="h-5 w-5 text-[var(--accent)]" /> Personalização Visual
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Tema de Fundo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(VIDEO_BACKGROUNDS).map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBackgroundStyle(bg.id)}
                    className={`rounded-xl border p-2 text-left transition-all cursor-pointer ${
                      backgroundStyle === bg.id
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                        : "border-[var(--border)] hover:border-[var(--accent)]/30"
                    }`}
                  >
                    <div className={`h-6 w-full rounded-md bg-gradient-to-r ${bg.gradient} mb-1`} />
                    <span className="text-xs font-medium text-[var(--text)] line-clamp-1">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Personagem / Apresentador
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(VIDEO_AVATARS).map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarType(av.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                      avatarType === av.id
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)] bg-[var(--surface-2)]"
                    }`}
                  >
                    <span className="text-xl">{av.icon}</span>
                    <span className="text-xs font-medium text-[var(--text)]">{av.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[var(--border-soft)]">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Estilo de Enquadramento
              </label>
              <select
                value={frameStyle}
                onChange={(e) => setFrameStyle(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-2 text-xs text-[var(--text)]"
              >
                {VIDEO_FRAME_STYLES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Faixa com Título do Tópico
              </label>
              <Input
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Ex: Diálogo no Restaurante"
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* Publication & Scheduling Section */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[var(--text)]">
            Opções de Publicação e Agendamento
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setPublishMode("immediate")}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                publishMode === "immediate"
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface-2)]"
              }`}
            >
              <Sparkles className="h-5 w-5 text-[var(--accent)] mb-2" />
              <span className="text-sm font-bold text-[var(--text)]">Publicar Imediatamente</span>
              <span className="text-xs text-[var(--text-secondary)]">Disponível para os alunos</span>
            </button>

            <button
              type="button"
              onClick={() => setPublishMode("scheduled")}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                publishMode === "scheduled"
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface-2)]"
              }`}
            >
              <Calendar className="h-5 w-5 text-amber-500 mb-2" />
              <span className="text-sm font-bold text-[var(--text)]">Agendar Publicação</span>
              <span className="text-xs text-[var(--text-secondary)]">Liberar em data futura</span>
            </button>

            <button
              type="button"
              onClick={() => setPublishMode("draft")}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                publishMode === "draft"
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface-2)]"
              }`}
            >
              <Layers className="h-5 w-5 text-[var(--text-muted)] mb-2" />
              <span className="text-sm font-bold text-[var(--text)]">Salvar como Rascunho</span>
              <span className="text-xs text-[var(--text-secondary)]">Apenas no painel admin</span>
            </button>
          </div>

          {publishMode === "scheduled" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-amber-300/40 bg-amber-50/50 p-4 dark:bg-amber-950/20">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--text)]">
                  Data da Publicação
                </label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--text)]">
                  Horário da Publicação
                </label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-[#dc2626] dark:bg-red-950/30">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Salvando..." : "Salvar Vídeo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
