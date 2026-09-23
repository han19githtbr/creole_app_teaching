"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Bell, BellOff } from "lucide-react";
import type { LessonCategory } from "@/lib/lessonCategories";

interface LessonRow {
  _id: string;
  title: string;
  sectionNumber: number;
  category: LessonCategory;
  isPublished: boolean;
  announcedAt: string | null;
}

export function LessonTable({ lessons }: { lessons: LessonRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [announcingId, setAnnouncingId] = useState<string | null>(null);

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

  async function handleToggleAnnounce(id: string, announced: boolean) {
    setAnnouncingId(id);
    try {
      const res = await fetch(`/api/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announce: !announced }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar o anúncio.");
      router.refresh();
    } catch {
      alert("Não foi possível atualizar o anúncio da lição.");
    } finally {
      setAnnouncingId(null);
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
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Para alunos</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => {
            const announced = Boolean(lesson.announcedAt);
            return (
              <tr key={lesson._id} className="border-b border-[var(--border-soft)] last:border-0">
                <td className="px-4 py-3 text-[var(--text-muted)]">{lesson.sectionNumber}</td>
                <td className="px-4 py-3 font-medium text-[var(--text)]">{lesson.title}</td>
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
                  {announced ? (
                    <Badge variant="default">
                      <Bell className="h-3 w-3" /> Anunciada
                    </Badge>
                  ) : (
                    <Badge variant="outline">Não anunciada</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      title={announced ? "Retirar dos alunos" : "Anunciar aos alunos"}
                      disabled={announcingId === lesson._id}
                      onClick={() => handleToggleAnnounce(lesson._id, announced)}
                    >
                      {announced ? (
                        <BellOff className="h-3.5 w-3.5" />
                      ) : (
                        <Bell className="h-3.5 w-3.5" />
                      )}
                    </Button>
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
