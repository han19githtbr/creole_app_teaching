import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Megaphone, Radio } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import PostAnswer from "@/models/PostAnswer";
import { toAnswerDTO } from "@/lib/postAnswers";
import { PostCard } from "@/components/PostCard";
import { PostAnswerBox } from "@/components/PostAnswerBox";
import { Card, CardContent } from "@/components/ui/card";
import { getBankImage } from "@/lib/imageBank";
import { getAppLanguage, languageFilter } from "@/lib/language";

export const dynamic = "force-dynamic";

export default async function DashboardPostsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  await connectDB();
  const language = await getAppLanguage();
  const isAdmin = session.user.role === "admin";
  const now = new Date();

  // Mostra somente o que o administrador publicou (rascunhos ficam em /admin/posts).
  const posts = await Post.find({
    ...languageFilter(language),
    isPublished: true,
    $or: [{ isPermanent: true }, { expiresAt: { $gte: now } }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const postIds = posts.map((p) => p._id);
  const myAnswers = new Map<string, ReturnType<typeof toAnswerDTO>>();
  if (postIds.length && !isAdmin && session.user.email) {
    const currentUser = await User.findOne({ email: session.user.email.toLowerCase().trim() })
      .select("_id")
      .lean<{ _id: unknown }>();
    if (currentUser) {
      const mine = await PostAnswer.find({ user: currentUser._id, post: { $in: postIds } }).lean();
      for (const a of mine) myAnswers.set(String(a.post), toAnswerDTO(a));
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--text)]">
          <Megaphone className="h-6 w-6 text-[var(--accent)]" /> Postagens do Professor
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Avisos, imagens e atividades publicados pelo administrador.
        </p>
      </header>

      {posts.length === 0 ? (
        <Card className="border-dashed border-[var(--border)] bg-[var(--surface)]/60">
          <CardContent className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--text-muted)]">
              <Radio className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold text-[var(--text)]">Nenhuma postagem por enquanto</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Quando o professor publicar algo, aparecerá aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <PostCard
            language={language}
            id={`post-${String(post._id)}`}
            key={String(post._id)}
            title={post.title}
            content={post.content}
            imageUrl={post.imageUrl}
            imageAlt={post.imageAlt}
            createdAt={post.createdAt}
            isPermanent={post.isPermanent}
            expiresAt={post.expiresAt}
            gamePostId={
              post.imageUrl && (post.imageQuiz?.options?.length || getBankImage(post.imageUrl))
                ? String(post._id)
                : undefined
            }
            footer={
              post.acceptsAnswers === false ? undefined : isAdmin ? (
                <Link
                  href={`/admin/answers?post=${String(post._id)}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  💬 Ver respostas
                </Link>
              ) : (
                <PostAnswerBox postId={String(post._id)} initialAnswer={myAnswers.get(String(post._id)) ?? null} />
              )
            }
          />
        ))
      )}
    </div>
  );
}
