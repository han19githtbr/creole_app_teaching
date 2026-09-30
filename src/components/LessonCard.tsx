import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import type { LessonCategory } from "@/lib/lessonCategories";

const categoryColors: Record<LessonCategory, string> = {
  Gramática: "bg-[var(--accent-soft)] text-[var(--accent)]",
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
  completed = false,
}: {
  slug: string;
  title: string;
  sectionNumber: number;
  category: LessonCategory;
  completed?: boolean;
}) {
  return (
    <Link
      href={`/dashboard/lessons/${slug}`}
      className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
            completed
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-[var(--surface-2)] text-[var(--text-secondary)]"
          }`}
          title={completed ? "Lição concluída" : undefined}
        >
          {completed ? <CheckCircle2 className="h-5 w-5" /> : sectionNumber}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-[var(--text)]">{title}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[category]}`}
          >
            {category}
          </span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
    </Link>
  );
}
