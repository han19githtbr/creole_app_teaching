import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import User from "@/models/User";
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
  const isAdmin = session.user.role === "admin";

  await connectDB();

  // Students only ever see lessons the admin has explicitly announced;
  // admins can browse everything they've published to check it before announcing.
  const query = isAdmin
    ? { isPublished: true }
    : { isPublished: true, announcedAt: { $ne: null } };

  const lessons = await Lesson.find(query)
    .sort({ order: 1, sectionNumber: 1 })
    .select("title slug sectionNumber category")
    .lean();

  // Mark the "new lesson" notification as seen now that the student opened the list.
  if (!isAdmin && session.user.email) {
    await User.findOneAndUpdate(
      { email: session.user.email.toLowerCase().trim() },
      { $set: { lastSeenLessonsAt: new Date() } }
    );
  }

  const serialized = lessons.map((l) => ({
    _id: String(l._id),
    slug: l.slug,
    title: l.title,
    sectionNumber: l.sectionNumber,
    category: l.category,
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--text)]">Lições</h1>
      <LessonsGrid lessons={serialized} initialCategory={category} />
    </div>
  );
}
