"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VIDEO_BACKGROUNDS, VIDEO_AVATARS, ParticleKind } from "@/lib/videoThemes";
import { Sparkles, VolumeX } from "lucide-react";

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

// Gera posições/atrasos determinísticos por partícula (mesmo efeito visual
// em toda renderização, sem "pular" a cada re-render do React).
function seeded(i: number, salt = 0) {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const AMBIENT_PARTICLE_COUNT: Partial<Record<ParticleKind, number>> = {
  rain: 26,
  snow: 22,
  leaves: 12,
  confetti: 18,
  fireflies: 14,
  bubbles: 12,
  steam: 8,
  sparks: 16,
  clouds: 5,
};

/**
 * Camada ambiente de partículas em CSS puro (leve, sem canvas) atrás do
 * player, para que o tema escolhido continue "vivo" mesmo fora da área do
 * vídeo em si — chuva caindo, neve, confete, vaga-lumes, etc., de acordo
 * com o tema selecionado no Estúdio.
 */
function AmbientParticles({ kind, color }: { kind: ParticleKind; color: string }) {
  const count = AMBIENT_PARTICLE_COUNT[kind] ?? 0;
  const items = useMemo(() => {
    if (!count) return [];
    return Array.from({ length: count }, (_, i) => ({
      left: seeded(i, 1) * 100,
      top: seeded(i, 2) * 100,
      delay: seeded(i, 3) * 6,
      duration: 4 + seeded(i, 4) * 6,
      size: 3 + seeded(i, 5) * 5,
    }));
  }, [count]);

  if (!count || kind === "none") return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className={`absolute rounded-full opacity-70 ambient-particle ambient-${kind}`}
          style={{
            left: `${p.left}%`,
            top: kind === "steam" || kind === "bubbles" || kind === "sparks" ? undefined : `${p.top}%`,
            bottom: kind === "steam" || kind === "bubbles" || kind === "sparks" ? "-10%" : undefined,
            width: kind === "confetti" ? `${p.size * 0.6}px` : `${p.size}px`,
            height: kind === "rain" ? `${p.size * 4}px` : kind === "confetti" ? `${p.size}px` : `${p.size}px`,
            background: kind === "rain" || kind === "confetti" ? color : color,
            borderRadius: kind === "confetti" ? "1px" : "9999px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function VideoPlayer({
  videoUrl,
  title,
  thumbnailUrl,
  customization,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [audioMissing, setAudioMissing] = useState(false);

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

  // Guarda contra qualquer estado de "mudo" herdado (preferência salva pelo
  // navegador para o domínio, ou volume zerado de uma sessão anterior) e
  // detecta, de forma visível, quando o próprio arquivo não tem faixa de
  // áudio — em vez de deixar o usuário achando que é só um bug de UI.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube || isVimeo) return;

    function ensureUnmuted() {
      if (!video) return;
      video.muted = false;
      if (video.volume === 0) video.volume = 1;
    }

    function checkAudioTrack() {
      if (!video) return;
      type MaybeAudioTracks = HTMLVideoElement & {
        webkitAudioDecodedByteCount?: number;
        audioTracks?: { length: number };
        mozHasAudio?: boolean;
      };
      const v = video as MaybeAudioTracks;
      const hasAudio =
        v.mozHasAudio ??
        (v.audioTracks ? v.audioTracks.length > 0 : undefined) ??
        (typeof v.webkitAudioDecodedByteCount === "number" ? v.webkitAudioDecodedByteCount > 0 : undefined);
      if (hasAudio === false) setAudioMissing(true);
    }

    video.addEventListener("loadedmetadata", ensureUnmuted);
    video.addEventListener("loadeddata", checkAudioTrack);
    video.addEventListener("play", ensureUnmuted);

    return () => {
      video.removeEventListener("loadedmetadata", ensureUnmuted);
      video.removeEventListener("loadeddata", checkAudioTrack);
      video.removeEventListener("play", ensureUnmuted);
    };
  }, [isYouTube, isVimeo, videoUrl]);

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
      {/* Background theme ambient gradient — agora com um lento "respirar"
          de posição via CSS e uma camada de partículas do tema por cima. */}
      {!customization?.customBackgroundUrl && (
        <>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${bgTheme.gradient} opacity-95 ambient-gradient-pan`}
          />
          <AmbientParticles kind={bgTheme.particles?.kind ?? "none"} color={bgTheme.textColor} />
        </>
      )}

      {/* Decorative Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      {/* Top Ambient Header with Theme & Avatar info */}
      <div className="relative z-10 mb-2 sm:mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-lg backdrop-blur-md">
            {avatarTheme.icon}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold drop-shadow">{avatarTheme.name}</p>
            <p className="truncate text-[10px] text-white/70">{bgTheme.name}</p>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
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
            muted={false}
            playsInline
            className="h-full w-full object-contain"
          />
        )}

        {/* Aviso visível quando o próprio arquivo não tem trilha de áudio —
            em vez do usuário achar que é um bug ao clicar no play sem som. */}
        {audioMissing && (
          <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-medium text-amber-300 backdrop-blur-md">
            <VolumeX className="h-3 w-3" /> Este vídeo foi gravado sem áudio
          </div>
        )}

        {/* Optional Subtitle / Banner Overlay */}
        {bannerText && (
          <div className="pointer-events-none absolute bottom-12 left-2 right-2 sm:left-4 sm:right-4 z-20 flex justify-center">
            <div className="max-w-full rounded-xl bg-black/80 px-3 sm:px-4 py-1.5 text-center text-xs sm:text-sm font-semibold text-white backdrop-blur-md shadow-lg border border-white/10 line-clamp-2">
              {bannerText}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Studio Badge */}
      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2 text-xs text-white/80">
        <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[11px] opacity-80">Estilo: {frameStyle}</span>
        </div>
      </div>

      <style jsx>{`
        .ambient-gradient-pan {
          background-size: 160% 160%;
          animation: ambientPan 18s ease-in-out infinite;
        }
        @keyframes ambientPan {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        .ambient-particle {
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .ambient-rain {
          animation-name: ambientFall;
          opacity: 0.45;
        }
        .ambient-snow {
          animation-name: ambientDrift;
        }
        .ambient-leaves {
          animation-name: ambientDrift;
        }
        .ambient-confetti {
          animation-name: ambientDrift;
        }
        .ambient-fireflies {
          animation-name: ambientTwinkle;
          animation-timing-function: ease-in-out;
        }
        .ambient-bubbles {
          animation-name: ambientRise;
        }
        .ambient-steam {
          animation-name: ambientRise;
        }
        .ambient-sparks {
          animation-name: ambientRise;
        }
        .ambient-clouds {
          animation-name: ambientSideways;
          animation-timing-function: ease-in-out;
        }
        @keyframes ambientFall {
          0% {
            transform: translateY(-10%);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(120%);
            opacity: 0;
          }
        }
        @keyframes ambientDrift {
          0% {
            transform: translate(0, -10%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          100% {
            transform: translate(20px, 120%) rotate(180deg);
            opacity: 0;
          }
        }
        @keyframes ambientRise {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120%);
            opacity: 0;
          }
        }
        @keyframes ambientTwinkle {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.2);
          }
        }
        @keyframes ambientSideways {
          0% {
            transform: translateX(-10%);
          }
          100% {
            transform: translateX(10%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-gradient-pan,
          .ambient-particle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
