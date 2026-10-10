"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/useAppLanguage";
import { LANGUAGE_META, type AppLanguage } from "@/lib/languageShared";
import { LayoutDashboard, BookOpen, MessageSquare, MessageCircleQuestion, Radio, Video, Sparkles } from "lucide-react";

const items = [
  { href: "/admin", label: "Painel geral", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Vídeos e Gravações", icon: Video },
  { href: "/admin/stories", label: "Histórias", icon: Sparkles },
  { href: "/admin/lessons", label: "Lições", icon: BookOpen },
  { href: "/admin/posts", label: "Postagens", icon: MessageSquare },
  { href: "/admin/answers", label: "Respostas", icon: MessageCircleQuestion },
  { href: "/admin/live", label: "Ao vivo", icon: Radio },
];

export function AdminSidebar({ pendingAnswers = 0 }: { pendingAnswers?: number }) {
  const pathname = usePathname();
  const { language, switchLanguage } = useAppLanguage();

  return (
    <aside className="w-full shrink-0 sm:w-56">
      <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5">
        <p className="px-2 pb-1 pt-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Editando conteúdo de
        </p>
        <div className="grid grid-cols-2 gap-1">
          {(["kreyol", "francais"] as AppLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => switchLanguage(lang, "/admin")}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors",
                language === lang
                  ? "bg-[var(--accent-soft)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
              )}
            >
              {LANGUAGE_META[lang].flag} {lang === "kreyol" ? "Crioulo" : "Francês"}
            </button>
          ))}
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto sm:flex-col sm:gap-1 sm:overflow-visible pb-2 sm:pb-0">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--accent-soft)] text-white font-bold [&_svg]:stroke-[2.5]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
              {label}
              {href === "/admin/answers" && pendingAnswers > 0 && (
                <span className="ml-auto rounded-full bg-amber-400 px-1.5 text-[11px] font-bold leading-5 text-amber-950">
                  {pendingAnswers > 99 ? "99+" : pendingAnswers}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
