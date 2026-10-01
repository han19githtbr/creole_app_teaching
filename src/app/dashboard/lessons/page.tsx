import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Lesson, { LESSON_CATEGORIES } from "@/models/Lesson";
import User from "@/models/User";
import LiveSession from "@/models/LiveSession";
import VideoLesson from "@/models/VideoLesson";
import { LIVEKIT_ROOM_NAME } from "@/lib/livekit";
import { PostCard } from "@/components/PostCard";
import { PostAnswerBox } from "@/components/PostAnswerBox";
import PostAnswer from "@/models/PostAnswer";
import { toAnswerDTO } from "@/lib/postAnswers";
import { LiveBadge } from "@/components/LiveBadge";
import { VideoCard } from "@/components/VideoCard";
import { ProgressCard } from "@/components/ProgressCard";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Radio, BookOpen, Bell, Video, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  await connectDB();

  const isAdmin = session.user.role === "admin";
  const now = new Date();

  // Admins see every lesson they've written, published or not. Students only
  // ever see lessons that have been explicitly announced to them.
  const lessonMatch = isAdmin
    ? { isPublished: true }
    : { isPublished: true, announcedAt: { $ne: null } };

  const videoMatch = isAdmin
    ? {}
    : {
        isPublished: true,
        $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
      };

  const [posts, live, categoryCounts, currentUser, recentVideos] = await Promise.all([
    Post.find({
      isPublished: true,
      $or: [{ isPermanent: true }, { expiresAt: { $gte: now } }],
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    LiveSession.findOne({ roomName: LIVEKIT_ROOM_NAME }).sort({ createdAt: -1 }).lean<{ isLive: boolean }>(),
    Lesson.aggregate([
      { $match: lessonMatch },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
    isAdmin || !session.user.email
      ? null
      : User.findOne({ email: session.user.email.toLowerCase().trim() })
          .select("lastSeenLessonsAt completedLessons")
          .lean<{ _id: unknown; lastSeenLessonsAt: Date | null; completedLessons?: unknown[] }>(),
    VideoLesson.find(videoMatch)
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  const counts: Record<string, number> = {};
  for (const c of categoryCounts) counts[c._id] = c.count;

  const totalLessons = Object.values(counts).reduce((a, b) => a + b, 0);
  const completedIds = (currentUser?.completedLessons ?? []).map(String);
  // Lições concluídas ainda visíveis; a última do array é a mais recente.
  const doneLessons =
    !isAdmin && completedIds.length
      ? await Lesson.find({ ...lessonMatch, _id: { $in: completedIds } })
          .select("title")
          .lean<{ _id: unknown; title: string }[]>()
      : [];
  const completedCount = doneLessons.length;
  const titleById = new Map(doneLessons.map((l) => [String(l._id), l.title]));
  const lastLessonTitle = [...completedIds].reverse().map((id) => titleById.get(id)).find(Boolean);

  // Respostas às postagens: o aluno vê as suas; o professor vê contagens.
  const postIds = posts.map((p) => p._id);
  const myAnswers = new Map<string, ReturnType<typeof toAnswerDTO>>();
  const answerCounts = new Map<string, { total: number; pending: number }>();
  if (postIds.length) {
    if (!isAdmin && currentUser) {
      const mine = await PostAnswer.find({ user: currentUser._id, post: { $in: postIds } }).lean();
      for (const a of mine) myAnswers.set(String(a.post), toAnswerDTO(a));
    } else if (isAdmin) {
      const grouped = await PostAnswer.aggregate([
        { $match: { post: { $in: postIds } } },
        { $group: { _id: "$post", total: { $sum: 1 }, pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } } } },
      ]);
      for (const g of grouped) answerCounts.set(String(g._id), { total: g.total, pending: g.pending });
    }
  }

  let hasNewLesson = false;
  if (!isAdmin) {
    const lastSeen = currentUser?.lastSeenLessonsAt ?? null;
    hasNewLesson = await Lesson.exists({
      isPublished: true,
      announcedAt: lastSeen ? { $ne: null, $gt: lastSeen } : { $ne: null },
    }).then(Boolean);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Welcome & Live Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Bon jou, {session.user?.name?.split(" ")[0] ?? "aluno"}! 👋
          </h1>
          <p className="text-[var(--text-secondary)]">Continue seu progresso em Kreyòl Ayisyen.</p>
        </div>
        {live?.isLive && (
          <Link
            href="/live"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
          >
            <Radio className="h-4 w-4" />
            Aula ao vivo agora <LiveBadge isLive />
          </Link>
        )}
      </div>

      {/* Progresso e conquistas (alunos) */}
      {!isAdmin && totalLessons > 0 && (
        <ProgressCard
          completed={completedCount}
          total={totalLessons}
          name={session.user?.name ?? "Aluno"}
          lastLessonTitle={lastLessonTitle}
        />
      )}

      {/* Featured Section: Aulas Gravadas e Vídeos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text)]">
            <Video className="h-5 w-5 text-[var(--accent)]" /> Aulas Gravadas e Dicas em Vídeo
          </h2>
          <Link
            href="/dashboard/videos"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Ver todas as aulas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentVideos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-[var(--text-muted)]">
              Nenhuma aula gravada disponível no momento. O professor publicará vídeos em breve!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentVideos.map((video) => (
              <VideoCard
                key={String(video._id)}
                _id={String(video._id)}
                title={video.title}
                description={video.description}
                videoUrl={video.videoUrl}
                duration={video.duration}
                authorName={video.authorName}
                isPublished={video.isPublished}
                publishAt={video.publishAt?.toISOString()}
                isLiveRecording={video.isLiveRecording}
                customization={video.customization}
                likesCount={video.likes?.length || 0}
                commentsCount={video.comments?.length || 0}
                createdAt={video.createdAt?.toISOString()}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Posts and Categories */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[var(--text)]">Postagens do professor</h2>
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center text-sm text-[var(--text-muted)]">
                Nenhuma postagem no momento.
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard
                key={String(post._id)}
                title={post.title}
                content={post.content}
                imageUrl={post.imageUrl}
                imageAlt={post.imageAlt}
                createdAt={post.createdAt}
                isPermanent={post.isPermanent}
                expiresAt={post.expiresAt}
                footer={
                  post.acceptsAnswers === false ? undefined : isAdmin ? (
                    <Link
                      href={`/admin/answers?post=${String(post._id)}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                      💬 {answerCounts.get(String(post._id))?.total ?? 0} respostas
                      {(answerCounts.get(String(post._id))?.pending ?? 0) > 0 && (
                        <span className="rounded-full bg-amber-400 px-2 text-xs font-bold text-amber-950">
                          {answerCounts.get(String(post._id))?.pending} em análise
                        </span>
                      )}
                    </Link>
                  ) : (
                    <PostAnswerBox
                      postId={String(post._id)}
                      initialAnswer={myAnswers.get(String(post._id)) ?? null}
                    />
                  )
                }
              />
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--text)]">Lições por categoria</h2>
            {hasNewLesson && (
              <Link
                href="/dashboard/lessons"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]"
              >
                <Bell className="h-3 w-3" /> Nova lição disponível
              </Link>
            )}
          </div>
          <Card>
            <CardContent className="space-y-1 p-3">
              {LESSON_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/dashboard/lessons?category=${encodeURIComponent(cat)}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[var(--text-secondary)]" />
                    {cat}
                  </span>
                  <span className="text-xs font-medium text-[var(--text-muted)]">{counts[cat] ?? 0}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Link
            href="/dashboard/lessons"
            className="block rounded-lg bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            Ver todas as lições
          </Link>
        </div>
      </div>
    </div>
  );
}
