import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PostCard({
  title,
  content,
  createdAt,
  isPermanent,
  expiresAt,
}: {
  title: string;
  content: string;
  createdAt: string | Date;
  isPermanent: boolean;
  expiresAt?: string | Date | null;
}) {
  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[#1c1917]">{title}</h3>
        {!isPermanent && expiresAt && (
          <Badge variant="warning">Expira em {new Date(expiresAt).toLocaleDateString("pt-BR")}</Badge>
        )}
      </div>
      <Markdown content={content} />
      <p className="mt-3 text-xs text-[#a8a29e]">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR })}
      </p>
    </div>
  );
}
