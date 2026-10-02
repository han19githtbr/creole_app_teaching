import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import User from "@/models/User";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import { Markdown } from "@/components/Markdown";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { slug } = await params;
  await connectDB();

  const isAdmin = session.user.role === "admin";
  const lesson = await Lesson.findOne({
    slug,
    ...(isAdmin ? {} : { isPublished: true }),
  }).lean();

  if (!lesson) notFound();

  const siblingMatch = isAdmin
    ? {}
    : { isPublished: true };

  const [prev, next] = await Promise.all([
    Lesson.findOne({ order: { $lt: lesson.order }, ...siblingMatch })
      .sort({ order: -1 })
      .select("title slug")
      .lean(),
    Lesson.findOne({ order: { $gt: lesson.order }, ...siblingMatch })
      .sort({ order: 1 })
      .select("title slug")
      .lean(),
  ]);

  const me = session.user.email
    ? await User.findOne({ email: session.user.email.toLowerCase().trim() })
        .select("completedLessons")
        .lean<{ completedLessons?: unknown[] }>()
    : null;
  const completedIds = (me?.completedLessons ?? []).map(String);
  const [visibleTotal, visibleCompleted] = await Promise.all([
    Lesson.countDocuments(siblingMatch),
    completedIds.length ? Lesson.countDocuments({ ...siblingMatch, _id: { $in: completedIds } }) : 0,
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard/lessons"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"
      >
        <ChevronLeft className="h-4 w-4" /> Todas as lições
      </Link>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <span className="mb-2 inline-block rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
          {lesson.category} · Seção {lesson.sectionNumber}
        </span>
        <Markdown content={lesson.content} />
      </div>

      <LessonCompleteButton
        lessonId={String(lesson._id)}
        lessonTitle={lesson.title}
        initialCompleted={completedIds.includes(String(lesson._id))}
        initialCount={visibleCompleted}
        total={visibleTotal}
        userName={session.user?.name ?? "Aluno"}
      />

      <div className="mt-6 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/dashboard/lessons/${prev.slug}`}
            className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm hover:border-[var(--accent)]/30"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--text-muted)]" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/dashboard/lessons/${next.slug}`}
            className="flex flex-1 items-center justify-end gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-right text-sm hover:border-[var(--accent)]/30"
          >
            <span className="truncate">{next.title}</span>
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
