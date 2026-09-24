"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, MessageSquare, Radio, Video } from "lucide-react";

const items = [
  { href: "/admin", label: "Painel geral", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Vídeos e Gravações", icon: Video },
  { href: "/admin/lessons", label: "Lições", icon: BookOpen },
  { href: "/admin/posts", label: "Postagens", icon: MessageSquare },
  { href: "/admin/live", label: "Ao vivo", icon: Radio },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 sm:w-56">
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
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
