import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import VideoLesson, { type IVideoStoryCaption } from "@/models/VideoLesson";
import { StoryForm } from "../../StoryForm";

export const dynamic = "force-dynamic";

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const video = await VideoLesson.findOne({ _id: id, story: { $exists: true } }).lean();
  if (!video?.story) notFound();
  const initial = {
    _id: String(video._id), title: video.title, description: video.description || "",
    isPublished: video.isPublished,
    publishAt: video.publishAt ? new Date(video.publishAt).toISOString() : null,
    story: {
      imageSrc: video.story.imageSrc, theme: video.story.theme, audioUrl: video.story.audioUrl,
      captions: video.story.captions.map((caption: IVideoStoryCaption) => ({ start: caption.start, end: caption.end, kreyol: caption.kreyol, portuguese: caption.portuguese })),
    },
  };
  return <div className="space-y-5"><Link href="/admin/stories" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)]"><ChevronLeft className="h-4 w-4" /> Histórias</Link><header><h1 className="text-2xl font-bold text-[var(--text)]">Editar história</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Atualize a cena, narração, roteiro ou publicação.</p></header><StoryForm initial={initial} /></div>;
}
