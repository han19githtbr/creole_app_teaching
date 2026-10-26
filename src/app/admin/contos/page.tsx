import { TALES } from "@/lib/tales/tales";
import { planTale } from "@/lib/tales/timeline";
import { getTaleStatuses } from "@/lib/taleAccess";
import { TalesAdmin, type TaleRow } from "@/components/TalesAdmin";

export const dynamic = "force-dynamic";

function minutes(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

export default async function AdminContosPage() {
  const statuses = new Map((await getTaleStatuses()).map((status) => [status.slug, status]));
  const rows: TaleRow[] = TALES.map((tale) => ({
    tale,
    published: statuses.get(tale.slug)?.published ?? false,
    publishedAt: statuses.get(tale.slug)?.publishedAt ?? null,
    durationLabel: minutes(planTale(tale).total),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Contos ilustrados</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Publique os contos em francês para os alunos e baixe os vídeos (Stories, Reels e feed do Instagram e do Facebook).
        </p>
      </div>
      <TalesAdmin rows={rows} />
    </div>
  );
}
