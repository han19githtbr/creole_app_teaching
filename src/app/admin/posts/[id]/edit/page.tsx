import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { PostForm } from "../../PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const post = await Post.findById(id).lean();
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1c1917]">Editar postagem</h1>
      <PostForm
        initial={{
          _id: String(post._id),
          title: post.title,
          content: post.content,
          isPermanent: post.isPermanent,
          expiresAt: post.expiresAt ? post.expiresAt.toISOString() : null,
          isPublished: post.isPublished,
        }}
      />
    </div>
  );
}
