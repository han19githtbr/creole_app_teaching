import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import { Button } from "@/components/ui/button";
import { LessonTable } from "./LessonTable";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLessonsPage() {
  await connectDB();
  const lessons = await Lesson.find()
    .sort({ order: 1, sectionNumber: 1 })
    .select("title sectionNumber category isPublished")
    .lean();

  const rows = lessons.map((l) => ({
    _id: String(l._id),
    title: l.title,
    sectionNumber: l.sectionNumber,
    category: l.category,
    isPublished: l.isPublished,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1917]">Lições</h1>
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
