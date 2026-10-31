import cquoiItems from "@/lib/cquoiItems.json";
import { listApprovedCquoiItems } from "@/lib/generatedImages";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import { AdminJogoVideosTabs } from "@/components/AdminJogoVideosTabs";

export const dynamic = "force-dynamic";

export default async function JogoVideosPage() {
  // mesmos objetos do jogo: coleção por temas + imagens de IA aprovadas
  const approved = await listApprovedCquoiItems().catch(() => [] as CestQuoiItem[]);
  const items = [...(cquoiItems as unknown as CestQuoiItem[]), ...approved];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Vídeos do Jogo &amp; Trilha</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Crie vídeos demonstrativos do jogo &quot;C&apos;est quoi ?&quot; e do novo módulo &quot;Trilha do Aluno Curioso&quot; (com montanha, chuva, neve e bandeira no topo), para postar nos
          Stories, Reels e no feed do Instagram e do Facebook.
        </p>
      </div>
      <AdminJogoVideosTabs items={items} />
    </div>
  );
}
