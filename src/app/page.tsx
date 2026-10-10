"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Radio, GraduationCap, Gamepad2, Check } from "lucide-react";
import { saveAppLanguage, readLanguageCookie } from "@/hooks/useAppLanguage";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_META,
  isAppLanguage,
  type AppLanguage,
} from "@/lib/languageShared";

const COPY: Record<
  AppLanguage,
  { title: string; text: string; features: { title: string; description: string; icon: "book" | "radio" | "grad" | "game" }[] }
> = {
  kreyol: {
    title: "Aprenda Crioulo Haitiano",
    text: "Curso de crioulo ao redor de temas como : comunicação, gramática, turismo, cultura, religião e vários outros — com lições estruturadas, postagens do professor e aulas ao vivo.",
    features: [
      { icon: "book", title: "26 lições completas", description: "Gramática, vocabulário, diálogos, cultura e referência ." },
      { icon: "radio", title: "Aulas ao vivo", description: "Participe de aulas em tempo real com o professor e chat ao vivo." },
      { icon: "grad", title: "Exercícios e gabarito", description: "Banco de exercícios em estilos diferentes, com gabarito comentado para praticar no seu ritmo." },
    ],
  },
  francais: {
    title: "Aprenda Francês (FLE)",
    text: "Curso de francês avançado (B2 → C2) baseado no Manuel Complet de Français: subjuntivo, concordância, falsos amigos, registro formal, homófonos, expressões idiomáticas e preparação para DELF/DALF — com postagens do professor, aulas ao vivo e o jogo C'est quoi ?.",
    features: [
      { icon: "book", title: "Lições do Manuel Complet", description: "Gramática avançada, vocabulário, diálogos, exercícios e referência para os exames oficiais." },
      { icon: "game", title: "Jogo C'est quoi ?", description: "Adivinhe o nome dos objetos em 5 segundos, com áudio da pronúncia e o bonequinho de boina." },
      { icon: "radio", title: "Aulas ao vivo", description: "Participe de aulas em tempo real com o professor e chat ao vivo." },
    ],
  },
};

const ICONS = {
  book: <BookOpen className="h-6 w-6" />,
  radio: <Radio className="h-6 w-6" />,
  grad: <GraduationCap className="h-6 w-6" />,
  game: <Gamepad2 className="h-6 w-6" />,
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [picked, setPicked] = useState<AppLanguage | null>(null);
  const savedLanguage = useSyncExternalStore(() => () => {}, readLanguageCookie, () => null);
  const language: AppLanguage = picked ?? savedLanguage ?? DEFAULT_LANGUAGE;

  useEffect(() => {
    if (status === "authenticated") {
      // Garante que o idioma escolhido fique gravado no usuário antes de abrir o painel.
      const preferred = session?.user?.preferredLanguage;
      saveAppLanguage(
        readLanguageCookie() ?? (isAppLanguage(preferred) ? preferred : DEFAULT_LANGUAGE)
      ).finally(() => router.replace("/dashboard"));
    }
  }, [status, session?.user?.preferredLanguage, router]);

  async function chooseLanguage(next: AppLanguage) {
    setPicked(next);
    await saveAppLanguage(next); // grava o cookie já antes do login com o Google
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--text-secondary)]">
        Abrindo seu painel...
      </div>
    );
  }

  const copy = COPY[language];
  const meta = LANGUAGE_META[language];

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-[#040404]">
        <div
          className={`absolute inset-0 bg-gradient-to-br from-[var(--accent)]/40 via-transparent ${
            language === "francais" ? "to-[#1d4ed8]/25" : "to-[#dc2626]/20"
          }`}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--border-strong)]">
            O que você quer aprender?
          </p>

          <div role="radiogroup" aria-label="Escolha o idioma" className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            {(["kreyol", "francais"] as AppLanguage[]).map((lang) => {
              const m = LANGUAGE_META[lang];
              const active = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => chooseLanguage(lang)}
                  className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                    active
                      ? "border-[var(--accent)] bg-white/15 shadow-lg shadow-[var(--accent)]/20"
                      : "border-white/15 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <span className="text-4xl">{m.flag}</span>
                  <span>
                    <span className="block text-lg font-bold text-white">{lang === "kreyol" ? "Crioulo" : "Francês"}</span>
                    <span className="block text-xs text-[var(--border-strong)]">{m.label}</span>
                  </span>
                  {active && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="mb-2 mt-10 text-5xl">{meta.flag}</span>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--border-strong)]">{copy.text}</p>
          <Button
            size="lg"
            className="mt-8"
            onClick={async () => {
              await saveAppLanguage(language);
              signIn("google", { callbackUrl: "/dashboard" });
            }}
          >
            Começar a Aprender {language === "francais" ? "Francês" : "Crioulo"}
          </Button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-3">
        {copy.features.map((f) => (
          <Feature key={f.title} icon={ICONS[f.icon]} title={f.title} description={f.description} />
        ))}
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-20 text-center">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <Users className="mx-auto h-8 w-8 text-[var(--accent)]" />
          <h2 className="mt-3 text-xl font-semibold text-[var(--text)]">
            Feito para sala de aula e autoestudo
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            Entre com sua conta Google para acessar seu painel, acompanhar as
            lições e receber avisos do professor em tempo real. Você pode trocar
            entre Crioulo e Francês quando quiser, pelo botão no topo da página.
          </p>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-white">
        {icon}
      </div>
      <h3 className="font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
