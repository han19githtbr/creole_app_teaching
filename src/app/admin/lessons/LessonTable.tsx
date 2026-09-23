"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { LessonCategory } from "@/lib/lessonCategories";

interface LessonRow {
  _id: string;
  title: string;
  sectionNumber: number;
  category: LessonCategory;
  isPublished: boolean;
}

export function LessonTable({ lessons }: { lessons: LessonRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <div className="overflow-x-auto rounded-xl border border-[#e7e5e4] bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-[#e7e5e4] bg-[#f5f5f4] text-left text-xs uppercase text-[#78716c]">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson._id} className="border-b border-[#f0efed] last:border-0">
              <td className="px-4 py-3 text-[#a8a29e]">{lesson.sectionNumber}</td>
              <td className="px-4 py-3 font-medium text-[#1c1917]">{lesson.title}</td>
              <td className="px-4 py-3">
                <Badge>{lesson.category}</Badge>
              </td>
              <td className="px-4 py-3">
                {lesson.isPublished ? (
                  <Badge variant="success">Publicada</Badge>
                ) : (
                  <Badge variant="outline">Rascunho</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
