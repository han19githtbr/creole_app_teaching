import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { PostForm } from "../../PostForm";
import { isAppLanguage } from "@/lib/languageShared";
import { getAppLanguage } from "@/lib/language";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const post = await Post.findById(id).lean();
  if (!post) notFound();
  // a postagem manda no idioma das palavras; sem ele, vale o idioma do painel
  const language = isAppLanguage(post.language) ? post.language : await getAppLanguage();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--text)]">Editar postagem</h1>
      <PostForm
        language={language}
        initial={{
          _id: String(post._id),
          title: post.title,
          content: post.content,
          acceptsAnswers: post.acceptsAnswers !== false,
          imageUrl: post.imageUrl ?? "",
          imageAlt: post.imageAlt ?? "",
          imageQuiz: post.imageQuiz,
          isPermanent: post.isPermanent,
          expiresAt: post.expiresAt ? post.expiresAt.toISOString() : null,
          isPublished: post.isPublished,
        }}
      />
    </div>
  );
}
