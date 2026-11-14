"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, Gamepad2, LayoutDashboard, Sparkles, Video } from "lucide-react";
import { useAppLanguage } from "@/hooks/useAppLanguage";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/lessons", label: "Lições", icon: BookOpen },
  { href: "/dashboard/jogo", label: "Jogos", icon: Gamepad2 },
  { href: "/dashboard/videos", label: "Vídeos", icon: Video },
  { href: "/dashboard/stories", label: "Histórias", icon: Sparkles },
];

export function BottomNav() {
  const { status } = useSession();
  const pathname = usePathname();
  const { language } = useAppLanguage();

  // Exibe apenas para usuários logados e fora da tela inicial de login
  if (status !== "authenticated" || pathname === "/" || pathname === "/offline") {
    return null;
  }

  // Não exibe em páginas de gravação ao vivo ou admin onde o espaço é crítico
  if (pathname?.startsWith("/live") || pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const getLabel = (href: string, defaultLabel: string) => {
    if (href === "/dashboard/jogo") {
      return language === "francais" ? "Jogos" : "Jogo";
    }
    return defaultLabel;
  };

  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-lg transition-transform md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.35)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          const itemLabel = getLabel(href, label);

          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
                active
                  ? "text-[var(--accent)] font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {/* Barra indicadora superior sutil no item ativo */}
              {active && (
                <span className="absolute -top-2.5 h-1 w-8 rounded-full bg-[var(--accent)] shadow-sm animate-in fade-in duration-200" />
              )}

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  active
                    ? "bg-[var(--accent-soft)]/15 scale-110 text-[var(--accent)]"
                    : "group-hover:bg-[var(--surface-2)]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    active ? "stroke-[2.5]" : "stroke-[1.75]"
                  }`}
                />
              </div>

              <span
                className={`mt-0.5 text-[10px] leading-tight transition-colors ${
                  active ? "font-bold text-[var(--accent)]" : "font-medium"
                }`}
              >
                {itemLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
