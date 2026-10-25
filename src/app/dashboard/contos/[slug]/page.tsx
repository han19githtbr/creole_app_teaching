import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getAppLanguage } from "@/lib/language";
import { getTale } from "@/lib/tales/tales";
import { TalePlayer } from "@/components/TalePlayer";

export const dynamic = "force-dynamic";

export default async function ContoPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if ((await getAppLanguage()) !== "francais") redirect("/dashboard/stories");

  const { slug } = await params;
  const tale = getTale(slug);
  if (!tale) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <Link href="/dashboard/contos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)]">
        <ArrowLeft className="h-4 w-4" /> Contos ilustrados
      </Link>
      <TalePlayer slug={tale.slug} canExport={session.user.role === "admin"} />
    </main>
  );
}
