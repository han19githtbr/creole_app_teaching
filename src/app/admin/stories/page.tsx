import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { StoryTable } from "./StoryTable";

export const dynamic = "force-dynamic";

export default async function AdminStoriesPage() {
  await connectDB();
  const records = await VideoLesson.find({ story: { $exists: true } }).sort({ createdAt: -1 }).lean();
  const stories = records.map((story) => ({
    _id: String(story._id),
    title: story.title,
    description: story.description || "",
    story: { imageSrc: story.story!.imageSrc, theme: story.story!.theme },
    duration: story.story!.audioDuration ?? story.duration ?? 0,
    isPublished: story.isPublished,
    publishAt: story.publishAt ? new Date(story.publishAt).toISOString() : null,
    createdAt: story.createdAt ? new Date(story.createdAt).toISOString() : new Date().toISOString(),
  }));

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]"><Sparkles className="h-4 w-4" /> Estúdio de histórias</p><h1 className="mt-1 text-2xl font-bold text-[var(--text)]">Histórias em Kreyòl</h1><p className="mt-1 max-w-xl text-sm text-[var(--text-secondary)]">Crie vídeos narrados a partir das cenas temáticas, com legendas sincronizadas em português.</p></div><Link href="/admin/stories/new"><Button><Plus className="h-4 w-4" /> Nova história</Button></Link></header>
    <StoryTable stories={stories} />
  </div>;
}
