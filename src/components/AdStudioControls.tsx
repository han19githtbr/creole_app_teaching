"use client";

import { cn } from "@/lib/utils";
import { resolveColor, TOKEN_LABELS, TOKEN_ORDER } from "@/lib/adStudio/palettes";
import type { Palette, PaletteToken } from "@/lib/adStudio/types";

export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent-soft)]";

export function TextInput({ value, onChange, placeholder, ...rest }: { value: string; onChange: (v: string) => void; placeholder?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <input {...rest} className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function TextArea({ value, onChange, rows = 3, ...rest }: { value: string; onChange: (v: string) => void; rows?: number } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) {
  return <textarea {...rest} rows={rows} className={cn(inputCls, "resize-y")} value={value} onChange={(e) => onChange(e.target.value)} />;
}

export function NumberSlider({ label, value, min, max, step = 1, onChange, suffix = "" }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <Field label={`${label} · ${Math.round(value * 100) / 100}${suffix}`}>
      <input type="range" className="w-full accent-[var(--accent-soft)]" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </Field>
  );
}

export function NumberBox({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      <input type="number" className={inputCls} value={Math.round(value)} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </Field>
  );
}

export function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <Field label={label}>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex overflow-hidden rounded-md border border-[var(--border)]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn("flex-1 cursor-pointer px-2 py-1.5 text-xs font-semibold", value === o.value ? "bg-[var(--accent-soft)] text-white" : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text)]">
      <input type="checkbox" className="h-4 w-4 accent-[var(--accent-soft)]" checked={value} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

/** Seletor de cor: tokens da paleta (mudam junto com a paleta) + cor livre. */
export function ColorField({ label, value, palette, onChange, allowEmpty }: { label: string; value: string; palette: Palette; onChange: (v: string) => void; allowEmpty?: boolean }) {
  const resolved = resolveColor(value, palette);
  const hex = /^#[0-9a-f]{6}$/i.test(resolved) ? resolved : "#ffffff";
  return (
    <Field label={label}>
      <div className="flex flex-wrap items-center gap-1">
        {allowEmpty && (
          <button
            type="button"
            title="Sem cor"
            onClick={() => onChange("")}
            className={cn("h-6 w-6 cursor-pointer rounded-full border text-[10px] font-bold text-[var(--text-muted)]", !value ? "ring-2 ring-[var(--accent-soft)]" : "border-[var(--border)]")}
          >
            ∅
          </button>
        )}
        {TOKEN_ORDER.map((t: PaletteToken) => (
          <button
            key={t}
            type="button"
            title={TOKEN_LABELS[t]}
            onClick={() => onChange(`@${t}`)}
            style={{ background: palette.colors[t] }}
            className={cn("h-6 w-6 cursor-pointer rounded-full border border-[var(--border-strong)]", value === `@${t}` && "ring-2 ring-[var(--accent-soft)] ring-offset-1")}
          />
        ))}
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} className="h-6 w-8 cursor-pointer rounded border border-[var(--border)] bg-transparent p-0" title="Cor livre" />
      </div>
    </Field>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5 border-b border-[var(--border-soft)] pb-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{title}</h4>
      {children}
    </section>
  );
}
