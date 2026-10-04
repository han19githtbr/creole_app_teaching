"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Play, Trash2 } from "lucide-react";
import { formatStoryTime } from "@/lib/storyAudio";

export interface StoryRow {
  _id: string;
  title: string;
  description: string;
  story: { imageSrc: string; theme: string };
  /** Duração da narração, em segundos. */
  duration: number;
  isPublished: boolean;
  publishAt: string | null;
  createdAt: string;
}

export function StoryTable({ stories }: { stories: StoryRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function deleteStory(story: StoryRow) {
    if (!confirm(`Excluir a história “${story.title}”? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(story._id);
    try {
      const response = await fetch(`/api/stories/${story._id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir história.");
      router.refresh();
    } catch {
      alert("Não foi possível excluir a história.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {stories.length === 0 ? <div className="p-12 text-center"><p className="font-semibold text-[var(--text)]">Ainda não há histórias</p><p className="mt-1 text-sm text-[var(--text-muted)]">Crie uma aventura com as cenas do banco Ghibli.</p></div> : <div className="divide-y divide-[var(--border-soft)]">
        {stories.map((story) => {
          const scheduled = story.isPublished && story.publishAt && new Date(story.publishAt) > new Date();
          return <article key={story._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <Image src={story.story.imageSrc} alt="" width={256} height={160} unoptimized className="h-20 w-32 shrink-0 rounded-md object-cover" />
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-semibold text-[var(--text)]">{story.title}</h2>{!story.isPublished ? <Badge variant="outline">Rascunho</Badge> : scheduled ? <Badge variant="warning"><Calendar className="mr-1 h-3 w-3" /> Agendada</Badge> : <Badge variant="success">Publicada</Badge>}</div><p className="mt-1 text-xs text-[var(--text-muted)]">{story.story.theme} · {story.duration > 0 ? formatStoryTime(story.duration) : "--:--"} · {new Date(story.createdAt).toLocaleDateString("pt-BR")}</p><p className="mt-1 line-clamp-1 text-sm text-[var(--text-secondary)]">{story.description}</p></div>
            <div className="flex shrink-0 gap-2"><Link href={`/dashboard/stories/${story._id}`} target="_blank" title="Pré-visualizar"><Button type="button" variant="outline" size="sm" aria-label="Pré-visualizar"><Play className="h-4 w-4" /></Button></Link><Link href={`/admin/stories/${story._id}/edit`} title="Editar"><Button type="button" variant="outline" size="sm" aria-label="Editar"><Pencil className="h-4 w-4" /></Button></Link><Button type="button" variant="ghost" size="sm" title="Excluir" aria-label="Excluir" disabled={deletingId === story._id} onClick={() => void deleteStory(story)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button></div>
          </article>;
        })}
      </div>}
    </div>
  );
}
