import Link from "next/link";
import { ArrowLeft, ArrowRight, Gamepad2, MountainSnow } from "lucide-react";

const GAMES = [
  {
    href: "/dashboard/jogo?module=cquoi",
    title: "C'est quoi ?",
    description: "Observe a cena ilustrada e adivinhe o nome dos objetos em francês em até 5 segundos com áudio nativo.",
    detail: "Vocabulário dinâmico & Arena",
    badge: "⚡ 5 Segundos",
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    icon: Gamepad2,
    styles: "border-blue-500/30 bg-gradient-to-b from-blue-500/[0.07] to-transparent hover:border-blue-500/60 hover:shadow-blue-500/10",
    iconStyles: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/dashboard/jogo?module=trilha",
    title: "Trilha do Aluno Curioso",
    description: "Suba a montanha identificando objetos ocultos, enfrente o modo avalanche e explore a fauna em 7 níveis.",
    detail: "Aventura 2.5D & Exploração",
    badge: "🏔️ 7 Níveis",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    icon: MountainSnow,
    styles: "border-amber-500/35 bg-gradient-to-b from-amber-500/[0.08] to-transparent hover:border-amber-500/60 hover:shadow-amber-500/10",
    iconStyles: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  },
];

export function GamesPicker() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Painel
      </Link>

      <header className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
          Espaço de jogos
        </p>
        <h1 className="mt-1 text-3xl font-black text-[var(--text)]">Escolha um jogo</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          São duas experiências diferentes. Escolha por onde quer começar.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {GAMES.map(({ href, title, description, detail, badge, badgeColor, icon: Icon, styles, iconStyles }) => (
          <Link
            key={title}
            href={href}
            className={`group flex min-h-60 flex-col rounded-2xl border-2 p-5 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${styles}`}
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${iconStyles}`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${badgeColor}`}>
                {badge}
              </span>
            </div>
            <span className="mt-4 text-xl font-black text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              {title}
            </span>
            <span className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              {description}
            </span>
            <span className="mt-auto flex items-center justify-between gap-2 pt-6 border-t border-[var(--border)]/60">
              <span className="text-xs font-semibold text-[var(--text-muted)]">{detail}</span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Jogar agora <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
