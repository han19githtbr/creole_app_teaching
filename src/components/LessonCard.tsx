import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LessonCategory } from "@/lib/lessonCategories";

const categoryColors: Record<LessonCategory, string> = {
  Gramática: "bg-[#eef2ff] text-[#3730a3]",
  Vocabulário: "bg-[#ecfdf5] text-[#047857]",
  Diálogos: "bg-[#fef3f2] text-[#c2410c]",
  Exercícios: "bg-[#fffbeb] text-[#b45309]",
  Cultura: "bg-[#f5f3ff] text-[#6d28d9]",
  Referência: "bg-[#f0f9ff] text-[#0369a1]",
};

export function LessonCard({
  slug,
  title,
  sectionNumber,
  category,
}: {
  slug: string;
  title: string;
  sectionNumber: number;
  category: LessonCategory;
}) {
  return (
    <Link
      href={`/dashboard/lessons/${slug}`}
      className="group flex items-center justify-between rounded-xl border border-[#e7e5e4] bg-white p-4 shadow-sm transition-all hover:border-[#3730a3]/30 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f4] text-sm font-semibold text-[#57534e]">
          {sectionNumber}
        </span>
        <div>
          <p className="font-medium text-[#1c1917]">{title}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[category]}`}
          >
            {category}
          </span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-[#a8a29e] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3730a3]" />
    </Link>
  );
}
