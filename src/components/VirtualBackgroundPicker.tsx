"use client";

import { Ban, Droplet, Droplets, Check } from "lucide-react";
import { VIDEO_BACKGROUNDS, THEME_CATEGORIES } from "@/lib/videoThemes";
import { IMAGE_BANK } from "@/lib/imageBank";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (id: string) => void;
  /** Altura máxima da área rolável (classe Tailwind). */
  maxHeightClass?: string;
  /** Layout mais compacto (usado sobre o vídeo da aula ao vivo). */
  compact?: boolean;
}

function Tile({
  selected,
  onClick,
  label,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      title={label}
      className={cn(
        "group relative overflow-hidden rounded-xl border text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        selected
          ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/50 shadow-sm"
          : "border-[var(--border)] hover:border-[var(--accent)]/50"
      )}
    >
      <div className="relative aspect-video w-full">{children}</div>
      <span className="block truncate bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--text)]">
        {label}
      </span>
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
      {children}
    </p>
  );
}

/**
 * Seletor de fundo virtual no estilo do Google Meet: "Sem efeito", "Desfocar",
 * temas animados e ilustrações do banco de imagens.
 */
export function VirtualBackgroundPicker({ value, onChange, maxHeightClass = "max-h-80", compact }: Props) {
  const grid = compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-2";

  return (
    <div className={cn("space-y-4 overflow-y-auto pr-1", maxHeightClass)}>
      <div>
        <SectionTitle>Efeitos</SectionTitle>
        <div className={cn("grid gap-2", grid)}>
          <Tile selected={value === "none"} onClick={() => onChange("none")} label="Sem efeito">
            <div className="flex h-full w-full items-center justify-center bg-[var(--surface-2)] text-[var(--text-secondary)]">
              <Ban className="h-5 w-5" />
            </div>
          </Tile>
          <Tile selected={value === "blur_light"} onClick={() => onChange("blur_light")} label="Desfoque leve">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-300 to-slate-500 text-white">
              <Droplet className="h-5 w-5" />
            </div>
          </Tile>
          <Tile selected={value === "blur"} onClick={() => onChange("blur")} label="Desfocar">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-500 to-slate-800 text-white">
              <Droplets className="h-5 w-5" />
            </div>
          </Tile>
        </div>
      </div>

      <div>
        <SectionTitle>Ilustrações animadas (estilo aquarela)</SectionTitle>
        <div className={cn("grid gap-2", grid)}>
          {IMAGE_BANK.map((img) => (
            <Tile
              key={img.id}
              selected={value === `image:${img.id}`}
              onClick={() => onChange(`image:${img.id}`)}
              label={img.theme}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.title} loading="lazy" className="h-full w-full object-cover" />
            </Tile>
          ))}
        </div>
      </div>

      {THEME_CATEGORIES.map((cat) => {
        const themes = Object.values(VIDEO_BACKGROUNDS).filter((bg) => bg.category === cat.id);
        if (!themes.length) return null;
        return (
          <div key={cat.id}>
            <SectionTitle>{cat.label}</SectionTitle>
            <div className={cn("grid gap-2", grid)}>
              {themes.map((bg) => (
                <Tile
                  key={bg.id}
                  selected={value === `theme:${bg.id}`}
                  onClick={() => onChange(`theme:${bg.id}`)}
                  label={bg.name}
                >
                  <div className={`h-full w-full bg-gradient-to-r ${bg.gradient}`} />
                </Tile>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
