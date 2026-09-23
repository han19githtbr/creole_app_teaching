"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookOpen, LayoutDashboard, Radio, ShieldCheck } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  const linkClass = (href: string) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
      pathname === href || pathname?.startsWith(href + "/")
        ? "text-[var(--accent)]"
        : "text-[var(--text-secondary)] hover:text-[var(--text)]"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-[var(--text)]">
          <span className="text-xl">🇭🇹</span>
          <span>Kreyòl Ayisyen</span>
        </Link>

        {status === "authenticated" && (
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <LayoutDashboard className="h-4 w-4" /> Painel
            </Link>
            <Link href="/dashboard/lessons" className={linkClass("/dashboard/lessons")}>
              <BookOpen className="h-4 w-4" /> Lições
            </Link>
            <Link href="/live" className={linkClass("/live")}>
              <Radio className="h-4 w-4" /> Ao vivo
            </Link>
            {role === "admin" && (
              <Link href="/admin" className={linkClass("/admin")}>
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {status === "authenticated" ? (
            <>
              {session.user?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Avatar"}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sair
              </Button>
            </>
          ) : status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--border-soft)]" />
          ) : (
            <Button size="sm" onClick={() => signIn("google")}>
              Entrar com Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
