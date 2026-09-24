import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VideoEditForm } from "./VideoEditForm";

export const dynamic = "force-dynamic";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const video = await VideoLesson.findById(id).lean();
  if (!video) notFound();

  const serialized = {
    _id: String(video._id),
    title: video.title,
    description: video.description || "",
    videoUrl: video.videoUrl,
    duration: video.duration || 0,
    isPublished: video.isPublished,
    publishAt: video.publishAt ? new Date(video.publishAt).toISOString() : null,
    customization: video.customization || {
      backgroundStyle: "haiti_flag",
      avatarType: "prof_alex",
      frameStyle: "rounded",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/videos"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar aos vídeos
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">
          Editar Vídeo: {video.title}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Modifique título, descrição, personalizações visuais ou reagende a liberação deste vídeo.
        </p>
      </div>

      <VideoEditForm initial={serialized} />
    </div>
  );
}
