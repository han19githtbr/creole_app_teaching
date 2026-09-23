"use client";

import { useMemo, useState } from "react";
import { LessonCard } from "@/components/LessonCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { LESSON_CATEGORIES, type LessonCategory } from "@/lib/lessonCategories";

interface LessonItem {
  _id: string;
  slug: string;
  title: string;
  sectionNumber: number;
  category: LessonCategory;
}

export function LessonsGrid({
  lessons,
  initialCategory,
}: {
  lessons: LessonItem[];
  initialCategory?: string | null;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(
    initialCategory && LESSON_CATEGORIES.includes(initialCategory as LessonCategory)
      ? initialCategory
      : "Todas"
  );

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const matchesCategory = category === "Todas" || l.category === category;
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [lessons, search, category]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8a29e]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar lição..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["Todas", ...LESSON_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                category === cat
                  ? "bg-[#3730a3] text-white"
                  : "bg-[#f5f5f4] text-[#57534e] hover:bg-[#e7e5e4]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#a8a29e]">
          Nenhuma lição encontrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((lesson) => (
            <LessonCard
              key={lesson._id}
              slug={lesson.slug}
              title={lesson.title}
              sectionNumber={lesson.sectionNumber}
              category={lesson.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
