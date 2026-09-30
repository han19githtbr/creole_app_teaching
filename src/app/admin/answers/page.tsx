import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import PostAnswer from "@/models/PostAnswer";
import Post from "@/models/Post";
import User from "@/models/User";
import { AnswerReviewList, type ReviewItem } from "@/components/AnswerReviewList";
import { toAnswerDTO } from "@/lib/postAnswers";

export const dynamic = "force-dynamic";

export default async function AdminAnswersPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const { post: postFilter } = await searchParams;
  await connectDB();

  const filter = postFilter && mongoose.isValidObjectId(postFilter) ? { post: postFilter } : {};
  const answers = await PostAnswer.find(filter).sort({ updatedAt: -1 }).limit(300).lean();

  const postIds = [...new Set(answers.map((a) => String(a.post)))];
  const userIds = [...new Set(answers.map((a) => String(a.user)))];
  const [posts, users, filterPost] = await Promise.all([
    Post.find({ _id: { $in: postIds } }).select("title imageUrl").lean<{ _id: unknown; title: string; imageUrl?: string }[]>(),
    User.find({ _id: { $in: userIds } }).select("name image").lean<{ _id: unknown; name: string; image?: string }[]>(),
    "post" in filter ? Post.findById(postFilter).select("title").lean<{ title: string }>() : null,
  ]);
  const postMap = new Map(posts.map((p) => [String(p._id), p]));
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  // Em análise primeiro (mais antigas antes), depois o resto por data.
  const items: ReviewItem[] = answers
    .map((a) => {
      const p = postMap.get(String(a.post));
      const u = userMap.get(String(a.user));
      return {
        ...toAnswerDTO(a),
        postId: String(a.post),
        postTitle: p?.title ?? "Postagem removida",
        postImage: p?.imageUrl ?? "",
        userName: u?.name ?? "Aluno",
        userImage: u?.image ?? "",
      };
    })
    .sort((x, y) => {
      if (x.status === "pending" && y.status !== "pending") return -1;
      if (y.status === "pending" && x.status !== "pending") return 1;
      return x.status === "pending"
        ? new Date(x.updatedAt).getTime() - new Date(y.updatedAt).getTime()
        : new Date(y.updatedAt).getTime() - new Date(x.updatedAt).getTime();
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Respostas dos alunos</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Valide cada resposta como correta ✓ ou incorreta ✗ e, se quiser, deixe um texto com a resposta certa.
        </p>
      </div>
      <AnswerReviewList initialItems={items} filterPostTitle={filterPost?.title ?? null} />
    </div>
  );
}
