import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import { LessonForm } from "../../LessonForm";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const lesson = await Lesson.findById(id).lean();
  if (!lesson) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1c1917]">Editar lição</h1>
      <LessonForm
        initial={{
          _id: String(lesson._id),
          title: lesson.title,
          sectionNumber: lesson.sectionNumber,
          category: lesson.category,
          content: lesson.content,
          isPublished: lesson.isPublished,
        }}
      />
    </div>
  );
}
