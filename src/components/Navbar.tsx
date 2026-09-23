"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, Menu, Radio, ShieldCheck, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/lessons", label: "Lições", icon: BookOpen },
  { href: "/live", label: "Ao vivo", icon: Radio },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const linkClass = (href: string) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
      isActive(href) ? "text-[#3730a3]" : "text-[#57534e] hover:text-[#1c1917]"
    }`;

  const mobileLinkClass = (href: string) =>
    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive(href) ? "bg-[#eef2ff] text-[#3730a3]" : "text-[#57534e] hover:bg-[#f5f5f4]"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7e5e4] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#1c1917]">
          <span className="text-xl">🇭🇹</span>
          <span>Kreyòl Ayisyen</span>
        </Link>

        {status === "authenticated" && (
          <nav className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
            {role === "admin" && (
              <Link href="/admin" className={linkClass("/admin")}>
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
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
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => signOut()}
              >
                Sair
              </Button>
              <button
                type="button"
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setMobileOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e5e4] text-[#1c1917] sm:hidden"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[#f0efed]" />
          ) : (
            <Button size="sm" onClick={() => signIn("google")}>
              Entrar com Google
            </Button>
          )}
        </div>
      </div>

      {status === "authenticated" && mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-[#e7e5e4] bg-white p-3 sm:hidden">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={mobileLinkClass(href)}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
          {role === "admin" && (
            <Link
              href="/admin"
              className={mobileLinkClass("/admin")}
              onClick={() => setMobileOpen(false)}
            >
              <ShieldCheck className="h-4 w-4" /> Admin
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              signOut();
            }}
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#57534e] hover:bg-[#f5f5f4]"
          >
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
