import { getAppLanguage, LANGUAGE_META } from "@/lib/language";
import { ImageGenPanel } from "./ImageGenPanel";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  const language = await getAppLanguage();
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--text)]">
        Imagens com IA · {LANGUAGE_META[language].flag} {LANGUAGE_META[language].label}
      </h1>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        Peça novas imagens para uma parte do app. A IA gera poucas por dia (limite diário), uma revisão automática confere
        os elementos e a qualidade, e você aprova antes de os alunos verem.
      </p>
      <ImageGenPanel language={language} />
    </div>
  );
}
