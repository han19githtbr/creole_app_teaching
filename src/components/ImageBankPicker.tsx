"use client";

import { useMemo, useState } from "react";
import { Check, Eye, Search, Sparkles, X } from "lucide-react";
import { IMAGE_BANK, IMAGE_THEMES, type BankImage } from "@/lib/imageBank";
import { cn } from "@/lib/utils";

/**
 * Seletor de imagens em estilo Studio Ghibli organizado por temas e elementos.
 * Permite buscar por vocabulário em Kreyòl ou Português e inspecionar detalhes da cena.
 */
export function ImageBankPicker({
  selectedSrc,
  onSelect,
}: {
  selectedSrc: string | null;
  onSelect: (image: BankImage | null) => void;
}) {
  const [theme, setTheme] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");
  const [onlyPrimary, setOnlyPrimary] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<BankImage | null>(null);

  const filteredItems = useMemo(() => {
    return IMAGE_BANK.filter((img) => {
      if (onlyPrimary && !img.isPrimary) return false;
      if (theme !== "Todos" && img.theme !== theme) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = img.title.toLowerCase().includes(q);
        const matchesTheme = img.theme.toLowerCase().includes(q);
        const matchesKreyol = img.kreyol.toLowerCase().includes(q);
        const matchesElements = img.elements?.some(
          (el) => el.kreyol.toLowerCase().includes(q) || el.pt.toLowerCase().includes(q)
        );
        return matchesTitle || matchesTheme || matchesKreyol || matchesElements;
      }
      return true;
    });
  }, [theme, search, onlyPrimary]);

  return (
    <div className="space-y-3.5">
      {/* Search and Primary/All toggle */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por tema ou elemento (ex.: robo, computador, pipa, mar, tanbou)..."
            className="h-8.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-8 pr-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-1 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setOnlyPrimary(true)}
            className={cn(
              "flex items-center gap-1 rounded px-2.5 py-1 transition-colors cursor-pointer",
              onlyPrimary
                ? "bg-[var(--surface)] text-[var(--text)] shadow-sm font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            )}
          >
            <Sparkles className="h-3 w-3 text-amber-500" /> Cenas Principais (14)
          </button>
          <button
            type="button"
            onClick={() => setOnlyPrimary(false)}
            className={cn(
              "rounded px-2.5 py-1 transition-colors cursor-pointer",
              !onlyPrimary
                ? "bg-[var(--surface)] text-[var(--text)] shadow-sm font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            )}
          >
            Todas as Cenas ({IMAGE_BANK.length})
          </button>
        </div>
      </div>

      {/* Theme pills */}
      <div className="flex flex-wrap gap-1.5">
        {["Todos", ...IMAGE_THEMES].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer",
              theme === t
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid of Ghibli scenes */}
      <div className="grid max-h-[28rem] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 md:grid-cols-3">
        {filteredItems.map((img) => {
          const selected = selectedSrc === img.src;
          return (
            <div
              key={img.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all",
                selected
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/50 bg-[var(--accent)]/5"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:shadow-md"
              )}
            >
              {/* Image Preview with overlay actions */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--surface-2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Ghibli style badge */}
                <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 backdrop-blur-sm">
                  Ghibli Art
                </span>

                {/* Inspect Preview button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(img);
                  }}
                  title="Ver imagem em tamanho grande e detalhes dos elementos"
                  className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/80"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>

                {/* Selected Check Badge */}
                {selected && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Card Details & Select trigger */}
              <div
                onClick={() => onSelect(selected ? null : img)}
                className="flex flex-1 flex-col justify-between p-2.5 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-[var(--text)]">{img.theme}</span>
                    <span className="rounded bg-[var(--surface-2)] px-1.5 py-0.2 text-[10px] font-medium text-[var(--accent)]">
                      {img.kreyol}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--text-muted)] font-medium">
                    {img.title}
                  </p>
                </div>

                {/* Recognized elements pills */}
                {img.elements && img.elements.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 border-t border-[var(--border-soft)] pt-1.5">
                    {img.elements.slice(0, 4).map((el) => (
                      <span
                        key={el.kreyol}
                        className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[9px] text-[var(--text-secondary)] font-medium"
                        title={el.pt}
                      >
                        {el.kreyol}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-xs text-[var(--text-muted)]">
          Nenhuma imagem encontrada com os filtros informados.
        </div>
      )}

      {/* Inspect Scene Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Estilo Studio Ghibli • {previewImage.theme} ({previewImage.kreyol})
                </span>
                <h3 className="text-lg font-bold text-[var(--text)]">{previewImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Large Image View */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.src}
                alt={previewImage.title}
                className="aspect-[3/2] w-full object-cover"
              />
            </div>

            {/* Recognized Elements Legend */}
            <div className="mt-3.5 space-y-2">
              <p className="text-xs font-semibold text-[var(--text)]">
                Elementos identificáveis na cena (Kreyòl / Português):
              </p>
              <div className="flex flex-wrap gap-2">
                {previewImage.elements?.map((el) => (
                  <span
                    key={el.kreyol}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs"
                  >
                    <span className="font-bold text-[var(--accent)]">{el.kreyol}</span>
                    <span className="text-[var(--text-muted)]">({el.pt})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex justify-end gap-2 border-t border-[var(--border-soft)] pt-3">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)] cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelect(previewImage);
                  setPreviewImage(null);
                }}
                className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:brightness-105 cursor-pointer"
              >
                {selectedSrc === previewImage.src ? "Imagem já selecionada" : "Selecionar esta imagem"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

