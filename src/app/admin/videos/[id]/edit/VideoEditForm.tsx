"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Layers,
  Palette,
  Sparkles,
} from "lucide-react";

export interface VideoEditFormValues {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  isPublished: boolean;
  publishAt?: string | null;
  customization?: {
    backgroundStyle?: string;
    customBackgroundUrl?: string;
    avatarType?: string;
    customAvatarUrl?: string;
    frameStyle?: string;
    bannerText?: string;
  };
}

export function VideoEditForm({ initial }: { initial: VideoEditFormValues }) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [videoUrl, setVideoUrl] = useState(initial.videoUrl || "");
  const [durationMinutes, setDurationMinutes] = useState(
    String(Math.floor((initial.duration || 0) / 60))
  );
  const [durationSeconds, setDurationSeconds] = useState(
    String((initial.duration || 0) % 60)
  );

  // Customization
  const [backgroundStyle, setBackgroundStyle] = useState(
    initial.customization?.backgroundStyle || "haiti_flag"
  );
  const [avatarType, setAvatarType] = useState(
    initial.customization?.avatarType || "prof_alex"
  );
  const [frameStyle, setFrameStyle] = useState(
    initial.customization?.frameStyle || "rounded"
  );
  const [bannerText, setBannerText] = useState(
    initial.customization?.bannerText || ""
  );

  // Scheduling
  const [publishMode, setPublishMode] = useState<"immediate" | "scheduled" | "draft">(
    !initial.isPublished
      ? "draft"
      : initial.publishAt && new Date(initial.publishAt) > new Date()
      ? "scheduled"
      : "immediate"
  );

  const initialDate = initial.publishAt ? initial.publishAt.slice(0, 10) : "";
  const initialTime = initial.publishAt
    ? new Date(initial.publishAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "18:00";

  const [scheduledDate, setScheduledDate] = useState(initialDate);
  const [scheduledTime, setScheduledTime] = useState(initialTime);

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
      const totalSeconds =
        (parseInt(durationMinutes, 10) || 0) * 60 + (parseInt(durationSeconds, 10) || 0);

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

      const res = await fetch(`/api/videos/${initial._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl: videoUrl.trim(),
          duration: totalSeconds,
          isPublished,
          publishAt,
          customization: {
            backgroundStyle,
            customBackgroundUrl: initial.customization?.customBackgroundUrl || "",
            avatarType,
            frameStyle,
            bannerText,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao salvar alterações no vídeo.");
      }

      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar vídeo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[var(--text)]">
          Editar Detalhes do Vídeo
        </h2>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[var(--text)]">
            URL do Vídeo
          </label>
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="URL do arquivo ou link do vídeo"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[var(--text)]">
            Título *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da aula gravada"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[var(--text)]">
            Descrição e Notas
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

      {/* Visual Customization */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text)]">
          <Palette className="h-5 w-5 text-[var(--accent)]" /> Personalização Visual
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Tema de Fundo
            </label>
            <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
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
              placeholder="Ex: Alfabeto e Pronúncia em Kreyòl"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Publication / Scheduling */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[var(--text)]">
          Status de Publicação e Agendamento
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
            <span className="text-sm font-bold text-[var(--text)]">Publicado</span>
            <span className="text-xs text-[var(--text-secondary)]">Disponível para todos os alunos</span>
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
            <span className="text-sm font-bold text-[var(--text)]">Agendado</span>
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
            <span className="text-sm font-bold text-[var(--text)]">Rascunho</span>
            <span className="text-xs text-[var(--text-secondary)]">Visível apenas no admin</span>
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
          {saving ? "Salvando alterações..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
