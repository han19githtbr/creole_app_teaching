import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PostCard({
  title,
  content,
  imageUrl,
  imageAlt,
  createdAt,
  isPermanent,
  expiresAt,
}: {
  title: string;
  content: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  createdAt: string | Date;
  isPermanent: boolean;
  expiresAt?: string | Date | null;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt || title}
          loading="lazy"
          className="aspect-[3/2] w-full bg-[var(--surface-2)] object-cover"
        />
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
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR })}
        </p>
      </div>
    </article>
  );
}
