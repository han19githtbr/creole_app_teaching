import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Sparkles } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { Button } from "@/components/ui/button";
import { formatStoryTime } from "@/lib/storyAudio";

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  await connectDB();
  const now = new Date();
  const stories = await VideoLesson.find({
    story: { $exists: true },
    ...(session.user.role === "admin" ? {} : { isPublished: true, $or: [{ publishAt: null }, { publishAt: { $lte: now } }] }),
  }).sort({ createdAt: -1 }).lean();

  return <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]"><Sparkles className="h-4 w-4" /> Istwa an kreyòl</p><h1 className="mt-1 text-2xl font-bold text-[var(--text)]">Histórias em Kreyòl</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Cenas que ganham vida, narradas em crioulo e traduzidas para português.</p></div>{session.user.role === "admin" && <Link href="/admin/stories"><Button variant="outline" size="sm">Gerenciar histórias</Button></Link>}</header>
    {stories.length === 0 ? <div className="border-b border-[var(--border)] py-16 text-center"><Sparkles className="mx-auto h-8 w-8 text-[var(--text-muted)]"/><p className="mt-3 font-semibold text-[var(--text)]">A próxima história está sendo preparada</p><p className="mt-1 text-sm text-[var(--text-muted)]">Volte em breve para explorar uma nova aventura em Kreyòl.</p></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{stories.map((story) => <Link key={String(story._id)} href={`/dashboard/stories/${story._id}`} className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]/60"><div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-2)]"><Image src={story.story!.imageSrc} alt={story.title} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105"/><span className="absolute left-3 top-3 rounded-sm bg-[#14251e]/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f5cf72]">{story.story!.theme}</span><span className="absolute bottom-3 right-3 rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">{formatStoryTime(story.story!.audioDuration ?? story.duration ?? 0)}</span></div><div className="p-4"><h2 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">{story.title}</h2><p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">{story.description || "Uma aventura narrada em Kreyòl, com legendas em português."}</p><div className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]"><span className="h-1.5 w-1.5 rounded-full bg-[#d9a843]"/>Áudio em Kreyòl<span>·</span>Legenda em português</div></div></Link>)}</div>}
    <p className="text-center text-[10px] uppercase tracking-[0.13em] text-[var(--text-muted)]">Kreyòl Ayisyen <span className="px-1 text-[#d4aa4c]">·</span> Aprender pelo encantamento</p>
  </main>;
}
