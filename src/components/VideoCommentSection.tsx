"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Trash2, User } from "lucide-react";

export interface CommentItem {
  _id: string;
  userId?: string;
  userName: string;
  userImage?: string;
  userEmail: string;
  content: string;
  createdAt: string;
  canDelete?: boolean;
}

interface VideoCommentSectionProps {
  videoId: string;
  initialComments: CommentItem[];
  isAdmin?: boolean;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "agora mesmo";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

export function VideoCommentSection({
  videoId,
  initialComments,
  isAdmin = false,
}: VideoCommentSectionProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Falha ao enviar comentário.");
      }

      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar comentário.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("Excluir este comentário?")) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/videos/${videoId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir comentário.");
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert("Não foi possível excluir o comentário.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
        <MessageSquare className="h-5 w-5 text-[var(--accent)]" />
        <h3 className="text-lg font-bold text-[var(--text)]">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {status === "authenticated" ? (
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex gap-3">
            {session.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? "Avatar"}
                className="h-10 w-10 shrink-0 rounded-full border border-[var(--border)] object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)]">
                <User className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Deixe sua dúvida, elogio ou comentário em Kreyòl / Português..."
                rows={3}
                className="resize-none font-sans"
              />
              {error && <p className="text-xs text-[#dc2626]">{error}</p>}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting || !newComment.trim()}
                  className="gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Publicando..." : "Comentar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Faça login com sua conta para participar da conversa e comentar neste vídeo.
          </p>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => signIn("google")}
          >
            Entrar com Google
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => {
            const userEmail = session?.user?.email?.toLowerCase().trim();
            const canDelete =
              isAdmin ||
              comment.canDelete ||
              (userEmail && comment.userEmail?.toLowerCase().trim() === userEmail);

            return (
              <div
                key={comment._id}
                className="group relative flex gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-3.5 shadow-sm transition-colors hover:border-[var(--border)]"
              >
                {comment.userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comment.userImage}
                    alt={comment.userName}
                    className="h-9 w-9 shrink-0 rounded-full border border-[var(--border)] object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)]">
                    <User className="h-4 w-4" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deletingId === comment._id}
                        title="Excluir comentário"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--text-muted)] hover:text-[#dc2626] cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-[var(--text-secondary)] whitespace-pre-line break-words leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
