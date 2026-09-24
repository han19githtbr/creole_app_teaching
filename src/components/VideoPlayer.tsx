"use client";

import { useRef } from "react";
import { VIDEO_BACKGROUNDS, VIDEO_AVATARS } from "@/lib/videoThemes";
import { Sparkles } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  customization?: {
    backgroundStyle?: string;
    customBackgroundUrl?: string;
    avatarType?: string;
    customAvatarUrl?: string;
    frameStyle?: string;
    bannerText?: string;
  };
}

export function VideoPlayer({
  videoUrl,
  title,
  thumbnailUrl,
  customization,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bgStyle = customization?.backgroundStyle || "haiti_flag";
  const bgTheme = VIDEO_BACKGROUNDS[bgStyle] || VIDEO_BACKGROUNDS.haiti_flag;
  const avatarStyle = customization?.avatarType || "webcam";
  const avatarTheme = VIDEO_AVATARS[avatarStyle] || VIDEO_AVATARS.webcam;
  const frameStyle = customization?.frameStyle || "rounded";
  const bannerText = customization?.bannerText || "";

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");

  function getYouTubeEmbed(url: string) {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  }


  function getVimeoEmbed(url: string) {
    if (url.includes("player.vimeo.com")) return url;
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const videoId = match ? match[1] : "";
    return `https://player.vimeo.com/video/${videoId}`;
  }


  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl border border-[var(--border)] p-2 sm:p-4 shadow-xl transition-all ${
        frameStyle === "glow" ? "ring-4 ring-[var(--accent)]/30 shadow-indigo-500/20" : ""
      }`}
      style={{
        background: customization?.customBackgroundUrl
          ? `url(${customization.customBackgroundUrl}) center/cover no-repeat`
          : undefined,
      }}
    >
      {/* Background theme ambient gradient */}
      {!customization?.customBackgroundUrl && (
        <div className={`absolute inset-0 bg-gradient-to-br ${bgTheme.gradient} opacity-95`} />
      )}

      {/* Decorative Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      {/* Top Ambient Header with Theme & Avatar info */}
      <div className="relative z-10 mb-2 sm:mb-3 flex items-center justify-between px-2 text-white">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-lg backdrop-blur-md">
            {avatarTheme.icon}
          </span>
          <div>
            <p className="text-xs font-semibold drop-shadow">{avatarTheme.name}</p>
            <p className="text-[10px] text-white/70">{bgTheme.name}</p>
          </div>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-yellow-400" /> Kreyòl Studio
        </span>
      </div>

      {/* Video Viewport */}
      <div className="relative z-10 aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbed(videoUrl)}
            title={title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVimeo ? (
          <iframe
            src={getVimeoEmbed(videoUrl)}
            title={title}
            className="h-full w-full border-0"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnailUrl}
            controls
            playsInline
            className="h-full w-full object-contain"
          />
        )}

        {/* Optional Subtitle / Banner Overlay */}
        {bannerText && (
          <div className="pointer-events-none absolute bottom-12 left-4 right-4 z-20 flex justify-center">
            <div className="rounded-xl bg-black/80 px-4 py-1.5 text-center text-sm font-semibold text-white backdrop-blur-md shadow-lg border border-white/10">
              {bannerText}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Studio Badge */}
      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-between px-2 text-xs text-white/80">
        <span className="truncate max-w-md font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] opacity-80">Estilo: {frameStyle}</span>
        </div>
      </div>
    </div>
  );
}
