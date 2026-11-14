import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BookOpenText } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getAppLanguage } from "@/lib/language";
import { TalesShelf } from "@/components/TalesShelf";
import { getVisibleTales } from "@/lib/taleAccess";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ContosPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const language = await getAppLanguage();
  const isFr = language === "francais";
  const isAdmin = session.user.role === "admin";
  const { tales, publishedSlugs } = await getVisibleTales(isAdmin);
  const drafts = new Set(tales.filter((tale) => !publishedSlugs.has(tale.slug)).map((tale) => tale.slug));

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            <BookOpenText className="h-4 w-4" /> {isFr ? "Contes illustrés en français" : "Contos ilustrados"}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">Contos ilustrados{isFr ? " em francês" : ""}</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Fábulas animadas, narradas e legendadas em francês. Ouça, leia a legenda e confira a tradução quando precisar.
          </p>
        </div>
        {isAdmin && (
          <Link href="/admin/contos">
            <Button variant="outline" size="sm">Gerenciar contos</Button>
          </Link>
        )}
      </header>
      {tales.length ? (
        <TalesShelf tales={tales} drafts={isAdmin ? drafts : undefined} heading={false} />
      ) : (
        <p className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--text-secondary)]">
          Ainda não há contos publicados. Volte em breve!
        </p>
      )}
    </main>
  );
}
