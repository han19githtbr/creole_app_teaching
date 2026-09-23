"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, MessageSquare, Radio } from "lucide-react";

const items = [
  { href: "/admin", label: "Painel geral", icon: LayoutDashboard },
  { href: "/admin/lessons", label: "Lições", icon: BookOpen },
  { href: "/admin/posts", label: "Postagens", icon: MessageSquare },
  { href: "/admin/live", label: "Ao vivo", icon: Radio },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 sm:w-56">
      <nav className="flex gap-2 overflow-x-auto sm:flex-col sm:gap-1 sm:overflow-visible">
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
                  ? "bg-[#eef2ff] text-[#3730a3]"
                  : "text-[#57534e] hover:bg-[#f5f5f4]"
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
