"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { LESSON_CATEGORIES, type LessonCategory } from "@/lib/lessonCategories";

interface LessonFormValues {
  _id?: string;
  title: string;
  sectionNumber: number;
  category: LessonCategory;
  content: string;
  isPublished: boolean;
}

export function LessonForm({ initial }: { initial?: LessonFormValues }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [sectionNumber, setSectionNumber] = useState(initial?.sectionNumber ?? 0);
  const [category, setCategory] = useState<LessonCategory>(initial?.category ?? "Gramática");
  const [content, setContent] = useState(initial?.content ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial?._id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        isEdit ? `/api/lessons/${initial!._id}` : "/api/lessons",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, sectionNumber, category, content, isPublished }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao salvar a lição.");
      }

      router.push("/admin/lessons");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar a lição.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Título</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Nº da seção</label>
          <Input
            type="number"
            value={sectionNumber}
            onChange={(e) => setSectionNumber(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Categoria</label>
          <Select value={category} onChange={(e) => setCategory(e.target.value as LessonCategory)}>
            {LESSON_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border-strong)]"
            />
            Publicada
          </label>
        </div>
      </div>

      {!isEdit && (
        <p className="text-xs text-[var(--text-muted)]">
          Salvar aqui não notifica os alunos. Depois de criada, use o botão de sino
          “Anunciar” na lista de lições para publicá-la no painel dos alunos.
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Conteúdo (Markdown)</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      {error && <p className="text-sm text-[#dc2626]">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar lição"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
