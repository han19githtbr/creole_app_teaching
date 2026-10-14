"use client";

import { useMemo, useState } from "react";
import { Copy, Upload } from "lucide-react";
import { COPY } from "@/lib/adStudio/content";
import { PALETTES, TOKEN_LABELS, TOKEN_ORDER } from "@/lib/adStudio/palettes";
import { templatesFor } from "@/lib/adStudio/templates";
import type { AdData, Background, Brand, LayerKind, LibImage, Palette, PaletteToken, PatternId, Picks, ScreenKind } from "@/lib/adStudio/types";
import type { AppLanguage } from "@/lib/languageShared";
import { cn } from "@/lib/utils";
import { ColorField, Field, NumberSlider, Section, Segmented, Select, TextArea, TextInput } from "./AdStudioControls";

const btn = "cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-left text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]";

// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------
export function TemplatesPanel(props: {
  language: AppLanguage;
  data: AdData;
  picks: Picks;
  setPicks: (p: Picks) => void;
  hasSource: boolean;
  loading: boolean;
  onLanguage: (l: AppLanguage) => void;
  onApply: (id: string, mode: "replace" | "append") => void;
  onReapply: () => void;
  onPickImage: (field: "heroImage" | "teacherImage") => void;
}) {
  const { language, data, picks, setPicks } = props;
  const list = templatesFor(language);
  const words = COPY[language].words;
  return (
    <div className="space-y-4 p-3">
      <Section title="Idioma da propaganda">
        <Segmented
          value={language}
          options={[
            { value: "kreyol", label: "🇭🇹 Crioulo" },
            { value: "francais", label: "🇫🇷 Francês" },
          ]}
          onChange={props.onLanguage}
        />
        <p className="text-[11px] text-[var(--text-muted)]">
          {props.loading ? "Carregando dados da plataforma…" : `Dados reais: ${data.counts.lessons} lições, ${data.counts.videos} vídeos, ${data.counts.stories} histórias, ${data.counts.images} imagens.`}
        </p>
      </Section>

      <Section title="Conteúdo usado nos modelos">
        <Select label="Lição em destaque" value={picks.lessonId ?? data.lessons[0]?.id ?? ""} options={data.lessons.length ? data.lessons.map((l) => ({ value: l.id, label: l.title })) : [{ value: "", label: "(sem lições publicadas)" }]} onChange={(v) => setPicks({ ...picks, lessonId: v })} />
        <Select label="Desafio (engajamento e jogo)" value={picks.challengeId ?? data.challenges[0]?.id ?? ""} options={data.challenges.map((c) => ({ value: c.id, label: c.label.slice(0, 60) }))} onChange={(v) => setPicks({ ...picks, challengeId: v })} />
        <Select label="Palavra do dia" value={String(picks.wordIndex ?? 0)} options={words.map((w, i) => ({ value: String(i), label: `${w.term} — ${w.pt}` }))} onChange={(v) => setPicks({ ...picks, wordIndex: Number(v) })} />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={btn} onClick={() => props.onPickImage("heroImage")}>🖼️ Imagem principal{picks.heroImage ? " ✓" : ""}</button>
          <button type="button" className={btn} onClick={() => props.onPickImage("teacherImage")}>👤 Foto do professor{picks.teacherImage ? " ✓" : ""}</button>
        </div>
        {(picks.heroImage || picks.teacherImage) && (
          <button type="button" className="text-xs font-semibold text-[var(--accent-soft)] underline" onClick={() => setPicks({ ...picks, heroImage: undefined, teacherImage: undefined })}>
            Voltar às imagens automáticas
          </button>
        )}
      </Section>

      {props.hasSource && (
        <button type="button" onClick={props.onReapply} className="w-full cursor-pointer rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-bold text-white hover:opacity-90">
          🔄 Refazer o layout do modelo atual (com estas escolhas)
        </button>
      )}

      <Section title="Escolha um modelo">
        <div className="space-y-2">
          {list.map((t) => (
            <div key={t.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
              <div className="flex items-start gap-2">
                <span className="text-2xl leading-none">{t.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--text)]">
                    {t.name} <span className="ml-1 rounded bg-[var(--surface-2)] px-1 text-[10px] font-semibold text-[var(--text-muted)]">{t.slides} slide{t.slides > 1 ? "s" : ""}</span>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{t.description}</p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <button type="button" onClick={() => props.onApply(t.id, "replace")} className="cursor-pointer rounded-md bg-[var(--accent-soft)] px-2 py-1.5 text-xs font-bold text-white hover:opacity-90">Usar este</button>
                <button type="button" onClick={() => props.onApply(t.id, "append")} className="cursor-pointer rounded-md border border-[var(--border)] px-2 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)]">+ Adicionar slides</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Elementos
// ---------------------------------------------------------------------------
const SCREEN_BUTTONS: { screen: ScreenKind; label: string }[] = [
  { screen: "lessons", label: "📚 Lições" },
  { screen: "game", label: "🎮 Jogo" },
  { screen: "ranking", label: "🥇 Ranking" },
  { screen: "video", label: "🎥 Vídeo" },
  { screen: "story", label: "✨ História" },
  { screen: "live", label: "📡 Ao vivo" },
  { screen: "achievements", label: "🏆 Conquistas" },
];

const EMOJIS = ["🇭🇹", "🇫🇷", "🇧🇷", "🔥", "⭐", "🎉", "🏆", "🚀", "📚", "🎥", "📡", "🎮", "💡", "❤️", "👉", "✅", "🆕", "🎁", "🗣️", "🌴"];

export function ElementsPanel({ onAdd, onAddEmoji }: { onAdd: (kind: LayerKind, extra?: { screen?: ScreenKind }) => void; onAddEmoji: (e: string) => void }) {
  return (
    <div className="space-y-4 p-3">
      <Section title="Básicos">
        <div className="grid grid-cols-2 gap-2">
          <button className={btn} onClick={() => onAdd("text")}>🔤 Texto</button>
          <button className={btn} onClick={() => onAdd("image")}>🖼️ Imagem</button>
          <button className={btn} onClick={() => onAdd("shape")}>🟦 Forma</button>
          <button className={btn} onClick={() => onAdd("button")}>🔘 Botão (CTA)</button>
          <button className={btn} onClick={() => onAdd("list")}>✅ Lista</button>
          <button className={btn} onClick={() => onAdd("stat")}>🔢 Número</button>
          <button className={btn} onClick={() => onAdd("card")}>🧩 Cartão</button>
        </div>
      </Section>
      <Section title="Celular com tela do app">
        <p className="text-[11px] text-[var(--text-muted)]">Mostra a funcionalidade real da plataforma. Edite os itens no painel da direita.</p>
        <div className="grid grid-cols-2 gap-2">
          {SCREEN_BUTTONS.map((b) => (
            <button key={b.screen} className={btn} onClick={() => onAdd("phone", { screen: b.screen })}>
              {b.label}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Selos e emojis">
        <div className="flex flex-wrap gap-1">
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => onAddEmoji(e)} className="cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xl hover:bg-[var(--surface-2)]">
              {e}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Imagens
// ---------------------------------------------------------------------------
export function ImagesPanel(props: {
  images: LibImage[];
  selectedLabel: string | null;
  onAdd: (img: LibImage) => void;
  onBackground: (img: LibImage) => void;
  onUseSelected: (img: LibImage) => void;
  onUpload: (file: File) => void;
  pickerFor: string | null;
  onCancelPicker: () => void;
}) {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(48);
  const groups = useMemo(() => Array.from(new Set(props.images.map((i) => i.group))), [props.images]);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return props.images.filter((i) => (group === "all" || i.group === group) && (!needle || i.title.toLowerCase().includes(needle) || i.group.toLowerCase().includes(needle)));
  }, [props.images, group, q]);
  return (
    <div className="space-y-3 p-3">
      {props.pickerFor && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs font-semibold text-amber-900">
          Clique numa imagem para usar como: {props.pickerFor}.{" "}
          <button className="underline" onClick={props.onCancelPicker}>cancelar</button>
        </div>
      )}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)]">
        <Upload className="h-4 w-4" /> Enviar imagem do computador
        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) props.onUpload(f); e.target.value = ""; }} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <TextInput value={q} onChange={(v) => { setQ(v); setLimit(48); }} placeholder="Buscar…" />
        <select className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text)]" value={group} onChange={(e) => { setGroup(e.target.value); setLimit(48); }}>
          <option value="all">Todas as pastas</option>
          {groups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <p className="text-[11px] text-[var(--text-muted)]">{filtered.length} imagens. Clique para adicionar à peça{props.selectedLabel ? `; “${props.selectedLabel}” selecionado` : ""}.</p>
      <div className="grid grid-cols-3 gap-2">
        {filtered.slice(0, limit).map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-2)]">
            <button type="button" title={img.title} onClick={() => props.onAdd(img)} className="block aspect-square w-full cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.title} loading="lazy" className="h-full w-full object-cover" />
            </button>
            {!props.pickerFor && (
              <div className="absolute inset-x-0 bottom-0 hidden gap-0.5 bg-black/70 p-0.5 group-hover:flex">
                <button type="button" onClick={() => props.onBackground(img)} className="flex-1 cursor-pointer rounded bg-white/90 px-1 py-0.5 text-[10px] font-bold text-black">Fundo</button>
                {props.selectedLabel && <button type="button" onClick={() => props.onUseSelected(img)} className="flex-1 cursor-pointer rounded bg-amber-300 px-1 py-0.5 text-[10px] font-bold text-black">Trocar</button>}
              </div>
            )}
          </div>
        ))}
      </div>
      {filtered.length > limit && (
        <button type="button" className={cn(btn, "w-full text-center")} onClick={() => setLimit(limit + 48)}>Mostrar mais</button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fundo e cores
// ---------------------------------------------------------------------------
const PATTERNS: { value: PatternId; label: string }[] = [
  { value: "none", label: "Nenhum" },
  { value: "dots", label: "Bolinhas" },
  { value: "rays", label: "Raios" },
  { value: "waves", label: "Ondas" },
  { value: "grid", label: "Grade" },
  { value: "confetti", label: "Confete" },
  { value: "diagonal", label: "Listras" },
];

export function BackgroundPanel(props: {
  bg: Background;
  palette: Palette;
  paletteId: string;
  custom: boolean;
  onBg: (patch: Partial<Background>, key?: string) => void;
  onPalette: (id: string) => void;
  onToken: (t: PaletteToken, hex: string) => void;
  onPickBgImage: () => void;
}) {
  const { bg, palette } = props;
  return (
    <div className="space-y-4 p-3">
      <Section title="Paleta de cores da peça">
        <div className="grid grid-cols-1 gap-1.5">
          {PALETTES.map((p) => (
            <button key={p.id} type="button" onClick={() => props.onPalette(p.id)} className={cn("flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-left text-sm", props.paletteId === p.id && !props.custom ? "border-[var(--accent-soft)] bg-[var(--surface-2)]" : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]")}>
              <span className="flex">
                {(["bg1", "bg2", "primary", "accent"] as PaletteToken[]).map((t) => (
                  <span key={t} className="-ml-1 h-5 w-5 rounded-full border border-white first:ml-0" style={{ background: p.colors[t] }} />
                ))}
              </span>
              <span className="font-semibold text-[var(--text)]">{p.name}</span>
            </button>
          ))}
        </div>
        <details className="rounded-md border border-[var(--border)] p-2">
          <summary className="cursor-pointer text-xs font-bold text-[var(--text-secondary)]">🎨 Personalizar cores da paleta{props.custom ? " (ativo)" : ""}</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {TOKEN_ORDER.map((t) => (
              <label key={t} className="flex items-center gap-2 text-xs text-[var(--text)]">
                <input type="color" value={palette.colors[t]} onChange={(e) => props.onToken(t, e.target.value)} className="h-7 w-9 cursor-pointer rounded border border-[var(--border)] p-0" />
                {TOKEN_LABELS[t]}
              </label>
            ))}
          </div>
        </details>
      </Section>

      <Section title="Fundo do slide">
        <Segmented value={bg.type} options={[{ value: "solid", label: "Cor" }, { value: "gradient", label: "Degradê" }, { value: "image", label: "Imagem" }]} onChange={(v) => props.onBg({ type: v })} />
        <ColorField label={bg.type === "gradient" ? "Cor inicial" : "Cor"} value={bg.color} palette={palette} onChange={(v) => props.onBg({ color: v })} />
        {bg.type === "gradient" && (
          <>
            <ColorField label="Cor final" value={bg.color2} palette={palette} onChange={(v) => props.onBg({ color2: v })} />
            <NumberSlider label="Ângulo" value={bg.angle} min={0} max={360} onChange={(v) => props.onBg({ angle: v }, "bg-angle")} suffix="°" />
          </>
        )}
        {bg.type === "image" && (
          <>
            <button type="button" className={cn(btn, "w-full text-center")} onClick={props.onPickBgImage}>🖼️ Escolher imagem de fundo</button>
            <NumberSlider label="Película escura" value={bg.overlay} min={0} max={0.9} step={0.02} onChange={(v) => props.onBg({ overlay: v }, "bg-ov")} />
            <ColorField label="Cor da película" value={bg.overlayColor} palette={palette} onChange={(v) => props.onBg({ overlayColor: v })} />
            <NumberSlider label="Desfoque" value={bg.blur} min={0} max={30} onChange={(v) => props.onBg({ blur: v }, "bg-blur")} suffix="px" />
          </>
        )}
      </Section>

      <Section title="Textura decorativa">
        <Select label="Padrão" value={bg.pattern} options={PATTERNS} onChange={(v) => props.onBg({ pattern: v })} />
        {bg.pattern !== "none" && (
          <>
            <NumberSlider label="Intensidade" value={bg.patternOpacity} min={0.02} max={0.5} step={0.01} onChange={(v) => props.onBg({ patternOpacity: v }, "bg-po")} />
            <ColorField label="Cor do padrão" value={bg.patternColor} palette={palette} onChange={(v) => props.onBg({ patternColor: v })} />
          </>
        )}
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marca, legenda e publicação
// ---------------------------------------------------------------------------
export function BrandPanel(props: {
  brand: Brand;
  setBrand: (b: Brand) => void;
  caption: string;
  setCaption: (c: string) => void;
  onGenerate: () => void;
  language: AppLanguage;
  onReapplyBrand: () => void;
}) {
  const { brand } = props;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sem permissão da área de transferência */
    }
  };
  return (
    <div className="space-y-4 p-3">
      <Section title="Sua marca (aparece nas peças)">
        <Field label="Nome do professor"><TextInput value={brand.name} onChange={(v) => props.setBrand({ ...brand, name: v })} /></Field>
        <Field label="Link da plataforma"><TextInput value={brand.url} onChange={(v) => props.setBrand({ ...brand, url: v })} placeholder="https://…" /></Field>
        <Field label="@ do Instagram/Facebook"><TextInput value={brand.handle} onChange={(v) => props.setBrand({ ...brand, handle: v })} placeholder="@seuperfil" /></Field>
        <Field label="Contato (WhatsApp, e-mail…)"><TextInput value={brand.contact} onChange={(v) => props.setBrand({ ...brand, contact: v })} placeholder="opcional" /></Field>
        <button type="button" className={cn(btn, "w-full text-center")} onClick={props.onReapplyBrand}>Aplicar estes dados na peça</button>
      </Section>
      <Section title="Legenda da publicação">
        <TextArea value={props.caption} rows={10} onChange={props.setCaption} />
        <p className="text-[11px] text-[var(--text-muted)]">{props.caption.length} / 2200 caracteres (limite do Instagram)</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={btn} onClick={props.onGenerate}>✨ Gerar legenda</button>
          <button type="button" className={btn} onClick={copy}><Copy className="mr-1 inline h-4 w-4" />{copied ? "Copiada!" : "Copiar"}</button>
        </div>
      </Section>
    </div>
  );
}
