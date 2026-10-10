import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import User from "@/models/User";
import { LessonsGrid } from "./LessonsGrid";
import { getAppLanguage, languageFilter, LANGUAGE_META } from "@/lib/language";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { category } = await searchParams;

  await connectDB();
  const language = await getAppLanguage();

  const isAdmin = session.user.role === "admin";
  // Somente lições publicadas pelo admin aparecem aqui (vale também para o admin).
  const filter: Record<string, unknown> = {
    ...languageFilter(language),
    isPublished: true,
    announcedAt: { $ne: null },
  };

  if (category) filter.category = category;

  const currentUser = session.user.email
    ? await User.findOne({ email: session.user.email.toLowerCase().trim() })
        .select("completedLessons lastSeenLessonsAt createdAt")
        .lean<{
          completedLessons?: unknown[];
          lastSeenLessonsAt?: Date | null;
          createdAt?: Date;
        }>()
    : null;

  const previousLastSeen = currentUser?.lastSeenLessonsAt ?? currentUser?.createdAt ?? null;

  // Atualiza a data em que o aluno visualizou as lições pela última vez
  if (!isAdmin && session.user.email) {
    await User.updateOne(
      { email: session.user.email.toLowerCase().trim() },
      { $set: { lastSeenLessonsAt: new Date() } }
    );
  }

  const lessons = await Lesson.find(filter)
    .sort({ sectionNumber: 1, createdAt: 1 })
    .lean();

  const completedIds = new Set((currentUser?.completedLessons ?? []).map(String));

  const serialized = lessons.map((l) => {
    const isNew = Boolean(
      previousLastSeen &&
        ((l.announcedAt && new Date(l.announcedAt) > previousLastSeen) ||
          (l.createdAt && new Date(l.createdAt) > previousLastSeen))
    );
    return {
      completed: completedIds.has(String(l._id)),
      isNew,
      _id: String(l._id),
      slug: l.slug,
      title: l.title,
      sectionNumber: l.sectionNumber,
      category: l.category,
    };
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[var(--accent)]" /> {LANGUAGE_META[language].lessonsTitle}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Explore as seções organizadas por categoria gramatical, vocabulário e conversação.
          </p>
        </div>
      </div>

      <LessonsGrid lessons={serialized} initialCategory={category} />
    </div>
  );
}
