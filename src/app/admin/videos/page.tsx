import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { VideoTable } from "./VideoTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  await connectDB();

  const videos = await VideoLesson.find().sort({ createdAt: -1 }).lean();
  const now = new Date();

  const serialized = videos.map((v) => ({
    _id: String(v._id),
    title: v.title,
    description: v.description,
    videoUrl: v.videoUrl,
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Vídeos e Aulas Gravadas
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Grave aulas de até 10 minutos com bonequinhos/avatares ou gerencie publicações e agendamentos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/videos/new">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Upload / Link
            </Button>
          </Link>
          <Link href="/admin/videos/record">
            <Button variant="danger" size="sm" className="gap-2 bg-[#dc2626] hover:bg-[#b91c1c] shadow-md">
              <Video className="h-4 w-4" /> Gravar Novo Vídeo
            </Button>
          </Link>
        </div>
      </div>

      <VideoTable videos={serialized} />
    </div>
  );
}
