import { getAppLanguage } from "@/lib/language";
import { buildAdData } from "@/lib/adStudio/serverData";
import { AdStudio } from "@/components/AdStudio";

export const dynamic = "force-dynamic";

export default async function AdminAdStudioPage() {
  const language = await getAppLanguage();
  const data = await buildAdData(language);
  return <AdStudio initialData={data} />;
}
