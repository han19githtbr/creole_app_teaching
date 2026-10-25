import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getAppLanguage } from "@/lib/language";
import { getTale } from "@/lib/tales/tales";
import { TalePlayer } from "@/components/TalePlayer";
import { isTalePublished } from "@/lib/taleAccess";

export const dynamic = "force-dynamic";

export default async function ContoPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if ((await getAppLanguage()) !== "francais") redirect("/dashboard/stories");

  const { slug } = await params;
  const tale = getTale(slug);
  if (!tale) notFound();
  const isAdmin = session.user.role === "admin";
  const published = await isTalePublished(tale.slug);
  // rascunho: só os administradores abrem
  if (!published && !isAdmin) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <Link href="/dashboard/contos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)]">
        <ArrowLeft className="h-4 w-4" /> Contos ilustrados
      </Link>
      {!published && (
        <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          Rascunho: só os administradores veem este conto. Publique em Admin → Contos ilustrados.
        </p>
      )}
      <TalePlayer slug={tale.slug} canExport={isAdmin} />
    </main>
  );
}
