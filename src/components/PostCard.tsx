import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

import { getBankImage } from "@/lib/imageBank";

export function PostCard({
  title,
  content,
  imageUrl,
  imageAlt,
  createdAt,
  isPermanent,
  expiresAt,
  footer,
  gamePostId,
}: {
  title: string;
  content: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  createdAt: string | Date;
  isPermanent: boolean;
  expiresAt?: string | Date | null;
  /** Área extra abaixo do texto (ex.: caixa de resposta do aluno). */
  footer?: React.ReactNode;
  gamePostId?: string;
}) {
  const bankImg = getBankImage(imageUrl);

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      {imageUrl && (
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--surface-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt || title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
          {bankImg && (
            <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-sm shadow">
              {bankImg.theme} • {bankImg.kreyol}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className="min-w-0 break-words font-semibold text-[var(--text)]">{title}</h3>
          {!isPermanent && expiresAt && (
            <Badge variant="warning" className="shrink-0">
              Expira em {new Date(expiresAt).toLocaleDateString("pt-BR")}
            </Badge>
          )}
        </div>
        {content.trim() && <Markdown content={content} />}
        {gamePostId && (
          <Link href={`/dashboard/jogo?post=${encodeURIComponent(gamePostId)}`} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-soft)] px-3.5 py-2.5 text-sm font-semibold text-[var(--accent)] transition hover:brightness-95">
            <Gamepad2 className="h-4 w-4" /> Jogar: encontre as palavras em Kreyòl
          </Link>
        )}
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR })}
        </p>
        {footer && <div className="mt-4 border-t border-[var(--border-soft)] pt-4">{footer}</div>}
      </div>
    </article>
  );
}
