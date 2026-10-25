import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAppLanguage } from "@/lib/language";
import { TalesShelf } from "@/components/TalesShelf";

export const dynamic = "force-dynamic";

export default async function ContosPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  // os contos ilustrados são em francês
  if ((await getAppLanguage()) !== "francais") redirect("/dashboard/stories");

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="border-b border-[var(--border)] pb-5">
        <h1 className="text-2xl font-bold text-[var(--text)]">Contos ilustrados</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Escolha um conto, aperte play e acompanhe a história em francês: narração, legenda palavra por palavra e tradução opcional em português.
        </p>
      </header>
      <TalesShelf heading={false} />
    </main>
  );
}
