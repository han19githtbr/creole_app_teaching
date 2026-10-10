import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import { Button } from "@/components/ui/button";
import { LessonTable } from "./LessonTable";
import { Plus } from "lucide-react";
import { getAppLanguage, languageFilter, LANGUAGE_META } from "@/lib/language";

export const dynamic = "force-dynamic";

export default async function AdminLessonsPage() {
  await connectDB();
  const language = await getAppLanguage();
  const lessons = await Lesson.find(languageFilter(language))
    .sort({ order: 1, sectionNumber: 1 })
    .select("title sectionNumber category isPublished announcedAt")
    .lean();

  const rows = lessons.map((l) => ({
    _id: String(l._id),
    title: l.title,
    sectionNumber: l.sectionNumber,
    category: l.category,
    isPublished: l.isPublished,
    announcedAt: l.announcedAt ? l.announcedAt.toISOString() : null,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text)]">Lições · {LANGUAGE_META[language].flag} {LANGUAGE_META[language].label}</h1>
        <Link href="/admin/lessons/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nova lição
          </Button>
        </Link>
      </div>
      <LessonTable lessons={rows} />
    </div>
  );
}
