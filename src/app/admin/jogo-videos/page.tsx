import cquoiItems from "@/lib/cquoiItems.json";
import { listApprovedCquoiItems } from "@/lib/generatedImages";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import { GameDemoStudio } from "@/components/GameDemoStudio";

export const dynamic = "force-dynamic";

export default async function JogoVideosPage() {
  // mesmos objetos do jogo: coleção por temas + imagens de IA aprovadas
  const approved = await listApprovedCquoiItems().catch(() => [] as CestQuoiItem[]);
  const items = [...(cquoiItems as unknown as CestQuoiItem[]), ...approved];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Vídeos do Jogo</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Crie vídeos que mostram como o jogo &quot;C&apos;est quoi ?&quot; funciona, com as alternativas, erros e acertos, para postar nos
          Stories, Reels e no feed do Instagram e do Facebook.
        </p>
      </div>
      <GameDemoStudio items={items} />
    </div>
  );
}
