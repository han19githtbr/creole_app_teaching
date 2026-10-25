import Link from "next/link";
import { BookOpenText, Clapperboard } from "lucide-react";
import { TALES } from "@/lib/tales/tales";
import { planTale } from "@/lib/tales/timeline";
import { TaleCover } from "@/components/TaleCover";

function minutes(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

/** Prateleira dos contos ilustrados (somente painel em francês). */
export function TalesShelf({ heading = true }: { heading?: boolean }) {
  return (
    <section className="space-y-4">
      {heading && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              <Clapperboard className="h-4 w-4" /> Contes illustrés
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--text)]">Contos ilustrados em francês</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Fábulas animadas, narradas e legendadas em francês. Ouça, leia a legenda e confira a tradução quando precisar.
            </p>
          </div>
          <Link href="/dashboard/contos" className="text-sm font-semibold text-[var(--accent)] hover:underline">
            Ver todos
          </Link>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {TALES.map((tale) => (
          <Link
            key={tale.slug}
            href={`/dashboard/contos/${tale.slug}`}
            className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]/60"
          >
            <div className="relative overflow-hidden bg-[var(--surface-2)]" style={{ aspectRatio: "9 / 16" }}>
              <TaleCover tale={tale} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute left-2 top-2 rounded-sm bg-[#14251e]/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f5cf72]">
                Niveau {tale.level}
              </span>
              <span className="absolute bottom-2 right-2 rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">≈ {minutes(planTale(tale).total)}</span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold leading-snug text-[var(--text)] group-hover:text-[var(--accent)]">{tale.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{tale.synopsisPt}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                <BookOpenText className="h-3 w-3" /> {tale.byline}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
