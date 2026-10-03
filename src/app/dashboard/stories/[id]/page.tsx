import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { StoryPlayer } from "@/components/StoryPlayer";
import type { IVideoStoryCaption } from "@/models/VideoLesson";

export const dynamic = "force-dynamic";

export default async function WatchStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const { id } = await params;
  await connectDB();
  const record = await VideoLesson.findOne({ _id: id, story: { $exists: true } }).lean();
  if (!record?.story) notFound();
  const isAdmin = session.user.role === "admin";
  if (!isAdmin && (!record.isPublished || (record.publishAt && record.publishAt > new Date()))) notFound();
  const story = {
    title: record.title,
    imageSrc: record.story.imageSrc,
    theme: record.story.theme,
    audioUrl: record.story.audioUrl,
    captions: record.story.captions.map((caption: IVideoStoryCaption) => ({ ...caption })),
  };
  return <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-7 sm:px-6"><Link href="/dashboard/stories" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"><ChevronLeft className="h-4 w-4"/> Todas as histórias</Link><header className="border-b border-[var(--border)] pb-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{story.theme} · 05:00</p><h1 className="mt-1 text-2xl font-bold text-[var(--text)]">{record.title}</h1>{record.description && <p className="mt-1 max-w-3xl text-sm text-[var(--text-secondary)]">{record.description}</p>}</header><StoryPlayer story={story}/></main>;
}
