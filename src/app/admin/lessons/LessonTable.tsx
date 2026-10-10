"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Send, EyeOff, Eye } from "lucide-react";
import type { LessonCategory } from "@/lib/lessonCategories";

interface LessonRow {
  _id: string;
  title: string;
  slug: string;
  sectionNumber: number;
  category: LessonCategory;
  isPublished: boolean;
  announcedAt: string | null;
}

export function LessonTable({ lessons }: { lessons: LessonRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir a lição "${title}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir.");
      router.refresh();
    } catch {
      alert("Não foi possível excluir a lição.");
    } finally {
      setDeletingId(null);
    }
  }

  // Publica (aparece no painel dos alunos) ou retira (volta a ser rascunho).
  async function handleTogglePublish(id: string, visible: boolean) {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !visible }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar a publicação.");
      router.refresh();
    } catch {
      alert("Não foi possível atualizar a publicação da lição.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-left text-xs uppercase text-[var(--text-muted)]">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Painel dos alunos</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => {
            // Só é visível ao aluno o que está publicado E anunciado.
            const visible = lesson.isPublished && Boolean(lesson.announcedAt);
            return (
              <tr key={lesson._id} className="border-b border-[var(--border-soft)] last:border-0">
                <td className="px-4 py-3 text-[var(--text-muted)]">{lesson.sectionNumber}</td>
                <td className="px-4 py-3 font-medium text-[var(--text)]">{lesson.title}</td>
                <td className="px-4 py-3">
                  <Badge>{lesson.category}</Badge>
                </td>
                <td className="px-4 py-3">
                  {visible ? (
                    <Badge variant="success" className="whitespace-nowrap">Publicada</Badge>
                  ) : (
                    <Badge variant="outline" className="whitespace-nowrap">Rascunho (oculta)</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant={visible ? "outline" : "primary"}
                      title={visible ? "Retirar do painel dos alunos" : "Publicar para os alunos"}
                      disabled={togglingId === lesson._id}
                      onClick={() => handleTogglePublish(lesson._id, visible)}
                    >
                      {visible ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Retirar
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Publicar
                        </>
                      )}
                    </Button>
                    <Link href={`/dashboard/lessons/${lesson.slug}`} title="Pré-visualizar">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/admin/lessons/${lesson._id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={deletingId === lesson._id}
                      onClick={() => handleDelete(lesson._id, lesson.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
