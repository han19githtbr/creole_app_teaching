import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function AdminPostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const post = await Post.findById(id).lean();
  if (!post) notFound();

  const now = new Date();
  const expired = Boolean(
    !post.isPermanent && post.expiresAt && post.expiresAt.getTime() < now.getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/posts"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para postagens
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text)]">Detalhes da postagem</h1>
        </div>
        <Link href={`/admin/posts/${id}/edit`}>
          <Button size="sm">
            <Pencil className="h-4 w-4" /> Editar postagem
          </Button>
        </Link>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <PostCard
          title={post.title}
          content={post.content}
          imageUrl={post.imageUrl}
          imageAlt={post.imageAlt}
          createdAt={post.createdAt}
          isPermanent={post.isPermanent}
          expiresAt={post.expiresAt}
        />

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="mb-4 text-base font-bold text-[var(--text)]">Informações</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="mb-1 text-[var(--text-muted)]">Status</dt>
              <dd>
                {!post.isPublished ? (
                  <Badge variant="outline">Rascunho</Badge>
                ) : expired ? (
                  <Badge variant="warning">Expirada</Badge>
                ) : (
                  <Badge variant="success">Ativa</Badge>
                )}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-[var(--text-muted)]">Anúncio</dt>
              <dd className="text-[var(--text)]">
                {post.announcedAt
                  ? `Anunciada em ${new Date(post.announcedAt).toLocaleDateString("pt-BR")}`
                  : "Não anunciada"}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-[var(--text-muted)]">Respostas</dt>
              <dd className="text-[var(--text)]">
                {post.acceptsAnswers === false ? "Desativadas" : "Permitidas"}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-[var(--text-muted)]">Desafio de imagem</dt>
              <dd className="text-[var(--text)]">
                {post.imageQuiz?.options?.length ? "Configurado" : "Não configurado"}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-[var(--text-muted)]">Validade</dt>
              <dd className="text-[var(--text)]">
                {post.isPermanent
                  ? "Permanente"
                  : post.expiresAt
                    ? new Date(post.expiresAt).toLocaleDateString("pt-BR")
                    : "Sem data definida"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
