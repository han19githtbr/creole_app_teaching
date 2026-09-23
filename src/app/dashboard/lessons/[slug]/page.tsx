import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
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

  const [prev, next] = await Promise.all([
    Lesson.findOne({ order: { $lt: lesson.order }, isPublished: true })
      .sort({ order: -1 })
      .select("title slug")
      .lean(),
    Lesson.findOne({ order: { $gt: lesson.order }, isPublished: true })
      .sort({ order: 1 })
      .select("title slug")
      .lean(),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard/lessons"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[#57534e] hover:text-[#1c1917]"
      >
        <ChevronLeft className="h-4 w-4" /> Todas as lições
      </Link>

      <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 shadow-sm sm:p-8">
        <span className="mb-2 inline-block rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-medium text-[#3730a3]">
          {lesson.category} · Seção {lesson.sectionNumber}
        </span>
        <Markdown content={lesson.content} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/dashboard/lessons/${prev.slug}`}
            className="flex flex-1 items-center gap-2 rounded-lg border border-[#e7e5e4] bg-white px-4 py-3 text-sm hover:border-[#3730a3]/30"
          >
            <ArrowLeft className="h-4 w-4 text-[#a8a29e]" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/dashboard/lessons/${next.slug}`}
            className="flex flex-1 items-center justify-end gap-2 rounded-lg border border-[#e7e5e4] bg-white px-4 py-3 text-right text-sm hover:border-[#3730a3]/30"
          >
            <span className="truncate">{next.title}</span>
            <ArrowRight className="h-4 w-4 text-[#a8a29e]" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
