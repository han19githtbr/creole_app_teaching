"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface PostRow {
  _id: string;
  title: string;
  isPermanent: boolean;
  expiresAt?: string | null;
  isPublished: boolean;
  createdAt: string;
  expired: boolean;
}

export function PostTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir a postagem "${title}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir.");
      router.refresh();
    } catch {
      alert("Não foi possível excluir a postagem.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#e7e5e4] bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-[#e7e5e4] bg-[#f5f5f4] text-left text-xs uppercase text-[#78716c]">
          <tr>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Expiração</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const expired = post.expired;
            return (
              <tr key={post._id} className="border-b border-[#f0efed] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1c1917]">{post.title}</td>
                <td className="px-4 py-3">
                  {!post.isPublished ? (
                    <Badge variant="outline">Rascunho</Badge>
                  ) : expired ? (
                    <Badge variant="warning">Expirada</Badge>
                  ) : (
                    <Badge variant="success">Ativa</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-[#78716c]">
                  {post.isPermanent
                    ? "Permanente"
                    : post.expiresAt
                    ? new Date(post.expiresAt).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/posts/${post._id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={deletingId === post._id}
                      onClick={() => handleDelete(post._id, post.title)}
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
