import Link from "next/link";
import { ArrowLeft, ArrowRight, Gamepad2, MountainSnow } from "lucide-react";

const GAMES = [
  {
    href: "/dashboard/jogo?module=cquoi",
    title: "C'est quoi ?",
    description: "Observe a cena e adivinhe o nome dos objetos em francês.",
    detail: "Desafios rápidos de vocabulário",
    icon: Gamepad2,
    styles: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60 hover:bg-blue-500/10",
    iconStyles: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/dashboard/jogo?module=trilha",
    title: "Trilha do Aluno Curioso",
    description: "Suba a montanha identificando objetos e avance por sete níveis.",
    detail: "Uma aventura de exploração",
    icon: MountainSnow,
    styles: "border-amber-500/35 bg-amber-500/5 hover:border-amber-500/60 hover:bg-amber-500/10",
    iconStyles: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
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

      <div className="grid gap-4 sm:grid-cols-2">
        {GAMES.map(({ href, title, description, detail, icon: Icon, styles, iconStyles }) => (
          <Link
            key={title}
            href={href}
            className={`group flex min-h-56 flex-col rounded-2xl border-2 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${styles}`}
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconStyles}`}>
              <Icon className="h-6 w-6" />
            </span>
            <span className="mt-4 text-lg font-black text-[var(--text)]">{title}</span>
            <span className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</span>
            <span className="mt-auto flex items-center justify-between gap-2 pt-5">
              <span className="text-xs font-semibold text-[var(--text-muted)]">{detail}</span>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--text)]">
                Jogar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
