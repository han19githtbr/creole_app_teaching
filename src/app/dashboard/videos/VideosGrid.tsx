"use client";

import { useMemo, useState } from "react";
import { VideoCard, type VideoCardProps } from "@/components/VideoCard";
import { Input } from "@/components/ui/input";
import { Search, PlayCircle } from "lucide-react";

export function VideosGrid({
  videos,
  isAdmin = false,
}: {
  videos: VideoCardProps[];
  isAdmin?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "shorts" | "lessons" | "liked" | "popular">("all");

  const filtered = useMemo(() => {
    return videos
      .filter((v) => {
        const matchesSearch =
          v.title.toLowerCase().includes(search.toLowerCase()) ||
          (v.description && v.description.toLowerCase().includes(search.toLowerCase()));

        if (!matchesSearch) return false;

        if (filter === "shorts") return (v.duration || 0) <= 300; // <= 5 min
        if (filter === "lessons") return (v.duration || 0) > 300 || v.isLiveRecording;
        return true;
      })
      .sort((a, b) => {
        if (filter === "liked") {
          return (b.likesCount || 0) - (a.likesCount || 0);
        }
        if (filter === "popular") {
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        }
        return 0; // Default creation order
      });
  }, [videos, search, filter]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar vídeos e aulas..."
            className="pl-9"
          />
        </div>

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
            onClick={() => setFilter("shorts")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filter === "shorts"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            }`}
          >
            Dicas Rápidas (≤ 5 min)
          </button>
          <button
            type="button"
            onClick={() => setFilter("lessons")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filter === "lessons"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            }`}
          >
            Aulas Completas
          </button>
          <button
            type="button"
            onClick={() => setFilter("liked")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filter === "liked"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            }`}
          >
            Mais Curtidos ❤️
          </button>
        </div>
      </div>

      {/* Grid of Video Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border-strong)] p-12 text-center">
          <PlayCircle className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-3" />
          <h3 className="text-base font-bold text-[var(--text)]">
            Nenhum vídeo encontrado
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Tente buscar por outros termos ou remover os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard key={video._id} {...video} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
