"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { IMAGE_BANK, IMAGE_THEMES, type BankImage } from "@/lib/imageBank";
import { cn } from "@/lib/utils";

/**
 * Banco de imagens (estilo aquarela de animação) organizado por tema.
 * Clique numa imagem para selecioná-la; clique de novo para desmarcar.
 */
export function ImageBankPicker({
  selectedSrc,
  onSelect,
}: {
  selectedSrc: string | null;
  onSelect: (image: BankImage | null) => void;
}) {
  const [theme, setTheme] = useState<string>("Todos");
  const items = theme === "Todos" ? IMAGE_BANK : IMAGE_BANK.filter((i) => i.theme === theme);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {["Todos", ...IMAGE_THEMES].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
              theme === t
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid max-h-[26rem] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
        {items.map((img) => {
          const selected = selectedSrc === img.src;
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelect(selected ? null : img)}
              aria-pressed={selected}
              className={cn(
                "group relative overflow-hidden rounded-xl border text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                selected
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/50"
                  : "border-[var(--border)] hover:border-[var(--accent)]/50"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.title}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="bg-[var(--surface)] px-2.5 py-1.5">
                <p className="text-xs font-semibold text-[var(--text)]">{img.theme}</p>
                <p className="truncate text-[10px] text-[var(--text-muted)]">{img.title}</p>
              </div>
              {selected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
