"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/components/VideoCard";
import { VIDEO_BACKGROUNDS, VIDEO_AVATARS } from "@/lib/videoThemes";
import {
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Pencil,
  Trash2,
  Calendar,
  ExternalLink,
} from "lucide-react";

export interface VideoTableRow {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: number;
  authorName?: string;
  isPublished: boolean;
  publishAt?: string | null;
  isScheduled: boolean;
  isLiveRecording?: boolean;
  customization?: {
    backgroundStyle?: string;
    avatarType?: string;
    frameStyle?: string;
    bannerText?: string;
  };
  likesCount?: number;
  commentsCount?: number;
  viewsCount?: number;
  createdAt: string;
}

export function VideoTable({ videos }: { videos: VideoTableRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "published" | "scheduled" | "draft">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredVideos = videos.filter((v) => {
    if (filter === "published") return v.isPublished && !v.isScheduled;
    if (filter === "scheduled") return v.isPublished && v.isScheduled;
    if (filter === "draft") return !v.isPublished;
    return true;
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir permanentemente o vídeo "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir vídeo.");
      router.refresh();
    } catch {
      alert("Não foi possível excluir o vídeo.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            filter === "all"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
          }`}
        >
          Todos ({videos.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("published")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            filter === "published"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
          }`}
        >
          Publicados ({videos.filter((v) => v.isPublished && !v.isScheduled).length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("scheduled")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            filter === "scheduled"
              ? "bg-amber-600 text-white"
              : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
          }`}
        >
          Agendados ({videos.filter((v) => v.isPublished && v.isScheduled).length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("draft")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            filter === "draft"
              ? "bg-stone-700 text-white"
              : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
          }`}
        >
          Rascunhos ({videos.filter((v) => !v.isPublished).length})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-xs uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Vídeo & Tema</th>
              <th className="px-4 py-3">Duração</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Métricas</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-[var(--text-muted)]">
                  Nenhum vídeo encontrado nesta categoria.
                </td>
              </tr>
            ) : (
              filteredVideos.map((video) => {
                const bgTheme =
                  VIDEO_BACKGROUNDS[video.customization?.backgroundStyle || "haiti_flag"] ||
                  VIDEO_BACKGROUNDS.haiti_flag;
                const avatarPreset =
                  VIDEO_AVATARS[video.customization?.avatarType || "webcam"] ||
                  VIDEO_AVATARS.webcam;

                return (
                  <tr
                    key={video._id}
                    className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--surface-2)]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Mini thumbnail */}
                        <div
                          className={`flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${bgTheme.gradient} text-white shadow-inner text-lg`}
                        >
                          {avatarPreset.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--text)] line-clamp-1">
                            {video.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                            <span>{avatarPreset.name.split(" ")[0]}</span>
                            <span>•</span>
                            <span>{bgTheme.name.split(" ")[0]}</span>
                            {video.isLiveRecording && (
                              <span className="text-red-500 font-medium">• Live</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        {formatDuration(video.duration || 0)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {!video.isPublished ? (
                        <Badge variant="outline">Rascunho</Badge>
                      ) : video.isScheduled ? (
                        <Badge variant="warning" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          Agendado ({new Date(video.publishAt!).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })})
                        </Badge>
                      ) : (
                        <Badge variant="success">Publicado</Badge>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1" title="Visualizações">
                          <Eye className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                          {video.viewsCount || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Curtidas">
                          <Heart className="h-3.5 w-3.5 text-[#f43f5e]" />
                          {video.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Comentários">
                          <MessageSquare className="h-3.5 w-3.5 text-[#38bdf8]" />
                          {video.commentsCount || 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                      {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/dashboard/videos/${video._id}`} target="_blank">
                          <Button size="sm" variant="ghost" title="Visualizar vídeo">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/admin/videos/${video._id}/edit`}>
                          <Button size="sm" variant="outline" title="Editar vídeo">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          title="Excluir vídeo"
                          disabled={deletingId === video._id}
                          onClick={() => handleDelete(video._id, video.title)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
