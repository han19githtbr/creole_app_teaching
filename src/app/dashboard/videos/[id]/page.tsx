import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoLikeButton } from "@/components/VideoLikeButton";
import { VideoCommentSection } from "@/components/VideoCommentSection";
import { Markdown } from "@/components/Markdown";
import { VideoCard } from "@/components/VideoCard";
import {
  ChevronLeft,
  Eye,
  Calendar,
  Clock,
  Radio,
  Sparkles,
} from "lucide-react";
import { formatDuration } from "@/components/VideoCard";
import { VIDEO_AVATARS } from "@/lib/videoThemes";

export const dynamic = "force-dynamic";

export default async function VideoWatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { id } = await params;
  await connectDB();

  const video = await VideoLesson.findById(id).lean();
  if (!video) notFound();

  const isAdmin = session.user.role === "admin";
  const now = new Date();

  // Validate visibility for students
  if (!isAdmin) {
    if (!video.isPublished) notFound();
    if (video.publishAt && new Date(video.publishAt) > now) notFound();
  }

  // Increment views count
  await VideoLesson.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });

  // Fetch related/suggested videos
  const relatedVideos = await VideoLesson.find({
    _id: { $ne: video._id },
    ...(isAdmin
      ? {}
      : {
          isPublished: true,
          $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
        }),
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const userEmail = session.user.email?.toLowerCase().trim();
  const hasLiked = Boolean(userEmail && video.likes?.includes(userEmail));
  const likesCount = video.likes?.length || 0;

  const comments = (video.comments || []).map((c: {
    _id?: unknown;
    userId?: unknown;
    userName: string;
    userImage?: string;
    userEmail: string;
    content: string;
    createdAt: Date;
  }) => ({
    _id: String(c._id),
    userId: String(c.userId),
    userName: c.userName,
    userImage: c.userImage,
    userEmail: c.userEmail,
    content: c.content,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    canDelete: Boolean(isAdmin || (userEmail && c.userEmail === userEmail)),
  }));

  const avatarPreset = VIDEO_AVATARS[video.customization?.avatarType || "webcam"] || VIDEO_AVATARS.webcam;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/videos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Todas as aulas gravadas
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Video & Comments Column */}
        <div className="space-y-8 lg:col-span-8">
          {/* Custom Themed Video Player */}
          <VideoPlayer
            videoUrl={video.videoUrl}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
            customization={video.customization}
          />

          {/* Video Metadata & Actions Bar */}
          <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {video.isLiveRecording && (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                      <Radio className="h-3 w-3" /> Aula ao vivo gravada
                    </span>
                  )}
                  <span className="flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                    {avatarPreset.icon} {avatarPreset.name}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
                  {video.title}
                </h1>
              </div>

              {/* Like Button */}
              <div className="flex items-center gap-2 shrink-0">
                <VideoLikeButton
                  videoId={String(video._id)}
                  initialLikesCount={likesCount}
                  initialHasLiked={hasLiked}
                />
              </div>
            </div>

            {/* Author, Views, Duration & Date stats */}
            <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border-soft)] pt-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                <span>Por {video.authorName || "Professor(a)"}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(video.duration || 0)}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {(video.viewsCount || 0) + 1} visualizações
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(video.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Description / Lesson Notes */}
            {video.description && (
              <div className="border-t border-[var(--border-soft)] pt-4">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Sobre esta aula
                </h3>
                <div className="text-sm text-[var(--text-secondary)]">
                  <Markdown content={video.description} />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Comments Section */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <VideoCommentSection
              videoId={String(video._id)}
              initialComments={comments}
              isAdmin={isAdmin}
            />
          </div>
        </div>

        {/* Sidebar: Next / Suggested Videos */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-[var(--text)]">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" /> Mais aulas gravadas
            </h3>

            {relatedVideos.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">
                Nenhuma outra aula gravada no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {relatedVideos.map((r) => (
                  <VideoCard
                    key={String(r._id)}
                    _id={String(r._id)}
                    title={r.title}
                    description={r.description}
                    videoUrl={r.videoUrl}
                    duration={r.duration}
                    authorName={r.authorName}
                    isPublished={r.isPublished}
                    isLiveRecording={r.isLiveRecording}
                    customization={r.customization}
                    likesCount={r.likes?.length || 0}
                    commentsCount={r.comments?.length || 0}
                    createdAt={r.createdAt?.toISOString()}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}

            <Link
              href="/dashboard/videos"
              className="block rounded-xl bg-[var(--surface-2)] p-2.5 text-center text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
            >
              Ver catálogo completo de vídeos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
