"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Radio, GraduationCap } from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-[#1c1917]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/40 via-transparent to-[#dc2626]/20" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-4 text-5xl">🇭🇹</span>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Aprenda Kreyòl Ayisyen
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--border-strong)]">
            Curso completo de crioulo haitiano: comunicação, gramática, turismo,
            cultura e linguagem cristã — com lições estruturadas, postagens da
            professora e aulas ao vivo.
          </p>
          <Button
            size="lg"
            className="mt-8"
            onClick={() => signIn("google")}
          >
            Começar a Aprender
          </Button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-3">
        <Feature
          icon={<BookOpen className="h-6 w-6" />}
          title="26 lições completas"
          description="Gramática, vocabulário, diálogos, cultura e referência — todo o conteúdo da apostila, organizado por categoria."
        />
        <Feature
          icon={<Radio className="h-6 w-6" />}
          title="Aulas ao vivo"
          description="Participe de aulas em tempo real com a professora, com chat e controle de câmera/microfone."
        />
        <Feature
          icon={<GraduationCap className="h-6 w-6" />}
          title="Exercícios e gabarito"
          description="Banco de exercícios em 8 estilos diferentes, com gabarito comentado para praticar no seu ritmo."
        />
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-20 text-center">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <Users className="mx-auto h-8 w-8 text-[var(--accent)]" />
          <h2 className="mt-3 text-xl font-semibold text-[var(--text)]">
            Feito para sala de aula e autoestudo
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            Entre com sua conta Google para acessar seu painel, acompanhar as
            lições e receber avisos da professora em tempo real.
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
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
