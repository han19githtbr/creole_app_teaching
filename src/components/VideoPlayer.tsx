"use client";

import { useMemo, useRef } from "react";
import { VIDEO_BACKGROUNDS, VIDEO_AVATARS, ParticleKind, personalizeAvatarName } from "@/lib/videoThemes";
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
  /** Nome do usuário logado, para exibir no lugar de "Você (...)" no cabeçalho. */
  viewerName?: string | null;
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
  viewerName,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bgStyle = customization?.backgroundStyle || "haiti_flag";
  const bgTheme = VIDEO_BACKGROUNDS[bgStyle] || VIDEO_BACKGROUNDS.haiti_flag;
  const avatarStyle = customization?.avatarType || "webcam";
  const avatarTheme = VIDEO_AVATARS[avatarStyle] || VIDEO_AVATARS.webcam;
  const frameStyle = customization?.frameStyle || "rounded";

  // Nome exibido no cabeçalho do player: para avatares "Você (...)",
  // mostramos o nome de quem está logado, em vez do rótulo técnico do
  // avatar (ex.: "Você (Noite)").
  const displayName = personalizeAvatarName(avatarTheme.name, viewerName);

  // Apenas o emoji da bandeira do tema de fundo (ex.: 🇭🇹), sem o texto
  // "Bandeira do Haiti" etc.
  const bgFlag = bgTheme.name.split(" ").pop();

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
            <p className="truncate text-xs font-semibold drop-shadow">{displayName}</p>
            <p className="truncate text-[10px] text-white/70">{bgFlag}</p>
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
      </div>

      {/* Floating Bottom Studio Badge */}
      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2 text-xs text-white/80">
        <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
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
