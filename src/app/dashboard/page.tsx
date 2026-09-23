import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Lesson, { LESSON_CATEGORIES } from "@/models/Lesson";
import LiveSession from "@/models/LiveSession";
import { LIVEKIT_ROOM_NAME } from "@/lib/livekit";
import { PostCard } from "@/components/PostCard";
import { LiveBadge } from "@/components/LiveBadge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Radio, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  await connectDB();

  const [posts, live, categoryCounts] = await Promise.all([
    Post.find({
      isPublished: true,
      $or: [{ isPermanent: true }, { expiresAt: { $gte: new Date() } }],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    LiveSession.findOne({ roomName: LIVEKIT_ROOM_NAME }).sort({ createdAt: -1 }).lean<{ isLive: boolean }>(),
    Lesson.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
  ]);

  const counts: Record<string, number> = {};
  for (const c of categoryCounts) counts[c._id] = c.count;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1917]">
            Bon jou, {session.user?.name?.split(" ")[0] ?? "aluno"}! 👋
          </h1>
          <p className="text-[#57534e]">Continue seu progresso em Kreyòl Ayisyen.</p>
        </div>
        {live?.isLive && (
          <Link
            href="/live"
            className="flex items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fee2e2]"
          >
            <Radio className="h-4 w-4" />
            Aula ao vivo agora <LiveBadge isLive />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#1c1917]">Avisos da professora</h2>
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center text-sm text-[#a8a29e]">
                Nenhuma postagem no momento.
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard
                key={String(post._id)}
                title={post.title}
                content={post.content}
                createdAt={post.createdAt}
                isPermanent={post.isPermanent}
                expiresAt={post.expiresAt}
              />
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1c1917]">Lições por categoria</h2>
          <Card>
            <CardContent className="space-y-1 p-3">
              {LESSON_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/dashboard/lessons?category=${encodeURIComponent(cat)}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-[#f5f5f4]"
                >
                  <span className="flex items-center gap-2 text-[#292524]">
                    <BookOpen className="h-4 w-4 text-[#a8a29e]" />
                    {cat}
                  </span>
                  <span className="text-xs font-medium text-[#a8a29e]">{counts[cat] ?? 0}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Link
            href="/dashboard/lessons"
            className="block rounded-lg bg-[#3730a3] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#2f2a8f]"
          >
            Ver todas as lições
          </Link>
        </div>
      </div>
    </div>
  );
}
