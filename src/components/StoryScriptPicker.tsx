"use client";

import { useMemo, useState } from "react";
import { BookText, Check, ChevronDown, ChevronUp, Clock, Copy, Search, Sparkles, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORY_CONTENT_BANK, STORY_CONTENT_THEMES, type StoryScriptItem } from "@/lib/storyContentBank";
import { describeStoryDuration } from "@/lib/storyAudio";
import type { AppLanguage } from "@/lib/languageShared";
import { cn } from "@/lib/utils";

interface StoryScriptPickerProps {
  language: AppLanguage;
  activeTheme?: string;
  onApplyMetadata: (script: StoryScriptItem, lang: AppLanguage) => void;
}

type ReadingLang = "francais" | "kreyol" | "pt";

export function StoryScriptPicker({ language, activeTheme, onApplyMetadata }: StoryScriptPickerProps) {
  const [open, setOpen] = useState(false);
  const defaultTheme = activeTheme && STORY_CONTENT_THEMES.includes(activeTheme) ? activeTheme : "Todos";
  const [themeOverride, setThemeOverride] = useState<{ base: string; value: string } | null>(null);
  const themeFilter = themeOverride?.base === defaultTheme ? themeOverride.value : defaultTheme;
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(STORY_CONTENT_BANK[0]?.id ?? "");
  const [readingLangOverride, setReadingLangOverride] = useState<{ base: AppLanguage; value: ReadingLang } | null>(null);
  const readingLang: ReadingLang = readingLangOverride?.base === language ? readingLangOverride.value : language;
  const [showPtSupport, setShowPtSupport] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const setThemeFilter = (nextTheme: string) => setThemeOverride({ base: defaultTheme, value: nextTheme });
  const setReadingLang = (nextLang: ReadingLang) => setReadingLangOverride({ base: language, value: nextLang });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STORY_CONTENT_BANK.filter((item) => {
      if (themeFilter !== "Todos" && item.theme !== themeFilter) return false;
      if (!q) return true;
      return (
        item.title.fr.toLowerCase().includes(q) ||
        item.title.kreyol.toLowerCase().includes(q) ||
        item.title.pt.toLowerCase().includes(q) ||
        item.theme.toLowerCase().includes(q) ||
        item.elementsCited.some((el) => el.toLowerCase().includes(q)) ||
        item.fr.toLowerCase().includes(q) ||
        item.kreyol.toLowerCase().includes(q) ||
        item.pt.toLowerCase().includes(q)
      );
    });
  }, [themeFilter, search]);

  const selected = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId]
  );

  const activeText = selected
    ? readingLang === "francais"
      ? selected.fr
      : readingLang === "kreyol"
        ? selected.kreyol
        : selected.pt
    : "";

  const activeTitle = selected
    ? readingLang === "francais"
      ? selected.title.fr
      : readingLang === "kreyol"
        ? selected.title.kreyol
        : selected.title.pt
    : "";

  async function copyScriptText() {
    if (!activeText || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(`${activeTitle}\n\n${activeText}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  function handleApply() {
    if (!selected) return;
    const applyLang: AppLanguage = readingLang === "francais" ? "francais" : readingLang === "kreyol" ? "kreyol" : language;
    onApplyMetadata(selected, applyLang);
    setAppliedId(selected.id);
    window.setTimeout(() => setAppliedId(null), 2500);
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <BookText className="h-4 w-4 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              Banco de roteiros prontos para gravar ({STORY_CONTENT_BANK.length} conteúdos)
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              10 curiosidades por tema em Francês e Kreyòl (com apoio em Português), dimensionadas para até 2 minutos de áudio.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] shrink-0">
          {open ? (
            <>
              Recolher <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Abrir roteiros <ChevronDown className="h-4 w-4" />
            </>
          )}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-[var(--border)] p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por tema, palavra-chave ou elemento (ex.: tambor, farol, robô)..."
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-8 pr-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <span className="text-xs font-medium text-[var(--text-muted)] shrink-0">
              {filtered.length} roteiro{filtered.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["Todos", ...STORY_CONTENT_THEMES].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setThemeFilter(t)}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer",
                  themeFilter === t
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--text-muted)]">
                  Nenhum roteiro encontrado para este filtro.
                </p>
              ) : (
                filtered.map((item) => {
                  const active = selected?.id === item.id;
                  const localizedTitle =
                    readingLang === "francais"
                      ? item.title.fr
                      : readingLang === "kreyol"
                        ? item.title.kreyol
                        : item.title.pt;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "w-full rounded-lg border p-2.5 text-left transition-colors",
                        active
                          ? "border-[var(--accent)] bg-[var(--surface)] ring-1 ring-[var(--accent)]/40"
                          : "border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--accent)]/50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                        <span className="text-[var(--accent)]">{item.theme}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> ~{describeStoryDuration(item.estimatedSeconds)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-[var(--text)] line-clamp-2">{localizedTitle}</p>
                      <p className="mt-0.5 text-[11px] text-[var(--text-muted)] line-clamp-1">{item.title.pt}</p>
                    </button>
                  );
                })
              )}
            </div>

            {selected && (
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-[11px] font-medium">
                      {(
                        [
                          ["francais", "🇫🇷 Francês"],
                          ["kreyol", "🇭🇹 Kreyòl"],
                          ["pt", "🇧🇷 Português"],
                        ] as const
                      ).map(([langKey, label]) => (
                        <button
                          key={langKey}
                          type="button"
                          onClick={() => setReadingLang(langKey)}
                          className={cn(
                            "rounded-md px-2.5 py-1 transition-colors",
                            readingLang === langKey
                              ? "bg-[var(--accent)] text-white shadow-sm"
                              : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {readingLang !== "pt" && (
                        <button
                          type="button"
                          onClick={() => setShowPtSupport((v) => !v)}
                          className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent)]"
                        >
                          {showPtSupport ? "Ocultar PT" : "Ver apoio PT"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setLargeText((v) => !v)}
                        title="Alternar tamanho da fonte para leitura ao gravar"
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent)]"
                      >
                        <Type className="h-3 w-3" /> {largeText ? "Fonte normal" : "Fonte maior"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                      {selected.theme} · Cena sugerida: {selected.suggestedSceneId} · ~{describeStoryDuration(selected.estimatedSeconds)}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-[var(--text)]">{activeTitle}</h3>
                  </div>

                  <div
                    className={cn(
                      "max-h-60 overflow-y-auto whitespace-pre-line rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)]/40 p-3.5 leading-relaxed text-[var(--text)]",
                      largeText ? "text-base" : "text-sm"
                    )}
                  >
                    {activeText}
                  </div>

                  {readingLang !== "pt" && showPtSupport && (
                    <div className="max-h-40 overflow-y-auto whitespace-pre-line rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-2)]/20 p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                      <span className="mb-1 block font-bold uppercase tracking-wider text-[10px] text-[var(--text-muted)]">
                        Apoio em Português · {selected.title.pt}
                      </span>
                      {selected.pt}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="font-semibold text-[var(--text-muted)]">Elementos da cena citados:</span>
                    {selected.elementsCited.map((el) => (
                      <span
                        key={el}
                        className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]"
                      >
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-soft)] pt-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => void copyScriptText()}>
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Texto copiado!" : "Copiar roteiro"}
                  </Button>
                  <Button type="button" size="sm" onClick={handleApply}>
                    {appliedId === selected.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Título, tema e cena aplicados!
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" /> Usar título, tema e cena sugerida
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
