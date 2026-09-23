import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import { LessonsGrid } from "./LessonsGrid";

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
  const lessons = await Lesson.find({ isPublished: true })
    .sort({ order: 1, sectionNumber: 1 })
    .select("title slug sectionNumber category")
    .lean();

  const serialized = lessons.map((l) => ({
    _id: String(l._id),
    slug: l.slug,
    title: l.title,
    sectionNumber: l.sectionNumber,
    category: l.category,
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-[#1c1917]">Lições</h1>
      <LessonsGrid lessons={serialized} initialCategory={category} />
    </div>
  );
}
