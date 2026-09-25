"use client";

import Link from "next/link";
import { Play, Heart, MessageSquare, Clock, Calendar, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VIDEO_BACKGROUNDS, VIDEO_AVATARS } from "@/lib/videoThemes";
import { formatDuration } from "@/lib/videoUtils";

export interface VideoCardProps {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  authorName?: string;
  isPublished?: boolean;
  publishAt?: string | null;
  isScheduled?: boolean;
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
  createdAt?: string;
  isAdmin?: boolean;
}


export function VideoCard({
  _id,
  title,
  description,
  duration = 0,
  authorName = "Professor(a)",
  isPublished = true,
  publishAt,
  isScheduled = false,
  isLiveRecording = false,
  customization,
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  isAdmin = false,
}: VideoCardProps) {
  const bgTheme = VIDEO_BACKGROUNDS[customization?.backgroundStyle || "haiti_flag"] || VIDEO_BACKGROUNDS.haiti_flag;
  const avatarTheme = VIDEO_AVATARS[customization?.avatarType || "webcam"] || VIDEO_AVATARS.webcam;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : "";

  const scheduledDate = publishAt
    ? new Date(publishAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Link
      href={`/dashboard/videos/${_id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-md"
    >
      {/* Thumbnail Area with Theme Styling */}
      <div
        className={`relative aspect-video w-full overflow-hidden bg-gradient-to-br ${bgTheme.gradient} flex items-center justify-center`}
      >
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

        {/* Center Mascot / Avatar or Play Icon */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 transition-transform duration-200 group-hover:scale-105">
          <span className="text-4xl filter drop-shadow-md">{avatarTheme.icon}</span>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all group-hover:bg-[var(--accent)] group-hover:scale-110">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        {duration > 0 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 rounded-md bg-black/75 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {formatDuration(duration)}
          </div>
        )}

        {/* Live or Theme Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
          {isLiveRecording && (
            <Badge variant="live" className="text-[11px] shadow-sm">
              <Radio className="h-3 w-3" /> Aula Gravada
            </Badge>
          )}
          <span className="rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {bgTheme.name.split(" ")[0]}
          </span>
        </div>

        {/* Status Badges for Admin */}
        {isAdmin && (
          <div className="absolute top-2.5 right-2.5 z-10">
            {!isPublished ? (
              <Badge variant="outline" className="bg-black/60 text-white border-white/20">
                Rascunho
              </Badge>
            ) : isScheduled ? (
              <Badge variant="warning" className="shadow-sm">
                Agendado ({scheduledDate})
              </Badge>
            ) : null}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h3>

        {description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-[var(--text-secondary)]">
            {description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--border-soft)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
            <span>{avatarTheme.name.split(" ")[0]} {authorName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 hover:text-[var(--text)]">
              <Heart className="h-3.5 w-3.5 text-[#f43f5e]" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1 hover:text-[var(--text)]">
              <MessageSquare className="h-3.5 w-3.5 text-[#38bdf8]" />
              {commentsCount}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
