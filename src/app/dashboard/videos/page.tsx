import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { VideosGrid } from "./VideosGrid";
import { Video, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardVideosPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  await connectDB();

  const isAdmin = session.user.role === "admin";
  const now = new Date();

  const filter = isAdmin
    ? {}
    : {
        isPublished: true,
        $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
      };

  const videos = await VideoLesson.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const serialized = videos.map((v) => ({
    _id: String(v._id),
    title: v.title,
    description: v.description,
    videoUrl: v.videoUrl,
    thumbnailUrl: v.thumbnailUrl,
    duration: v.duration || 0,
    authorName: v.authorName || "Professor(a)",
    isPublished: v.isPublished,
    publishAt: v.publishAt ? new Date(v.publishAt).toISOString() : null,
    isScheduled: Boolean(v.publishAt && new Date(v.publishAt) > now),
    isLiveRecording: Boolean(v.isLiveRecording),
    customization: v.customization || {
      backgroundStyle: "haiti_flag",
      avatarType: "webcam",
      frameStyle: "rounded",
    },
    likesCount: v.likes?.length || 0,
    commentsCount: v.comments?.length || 0,
    viewsCount: v.viewsCount || 0,
    createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm">
            <Video className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Aulas Gravadas e Vídeos
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Assista a explicações de gramática, diálogos do dia a dia, dicas culturais e gravações de aulas ao vivo.
            </p>
          </div>
        </div>
      </div>

      <VideosGrid videos={serialized} isAdmin={isAdmin} />
    </div>
  );
}
