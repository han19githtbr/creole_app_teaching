import { connectDB } from "@/lib/mongodb";
import TaleSetting from "@/models/TaleSetting";
import { TALES, type Tale } from "@/lib/tales/tales";

export interface TaleStatus {
  slug: string;
  published: boolean;
  publishedAt: string | null;
}

/** Situação de cada conto: o que o administrador definiu ou, na falta disso, o padrão do conto. */
export async function getTaleStatuses(): Promise<TaleStatus[]> {
  let settings: { slug: string; isPublished: boolean; publishedAt: Date | null }[] = [];
  try {
    await connectDB();
    settings = await TaleSetting.find().select("slug isPublished publishedAt").lean();
  } catch (error) {
    console.warn("[taleAccess] Falha ao ler a publicação dos contos:", error);
  }
  const bySlug = new Map(settings.map((setting) => [setting.slug, setting]));
  return TALES.map((tale) => {
    const setting = bySlug.get(tale.slug);
    return {
      slug: tale.slug,
      published: setting ? setting.isPublished : Boolean(tale.publishedByDefault),
      publishedAt: setting?.publishedAt ? new Date(setting.publishedAt).toISOString() : null,
    };
  });
}

/** Contos que o usuário pode ver: os publicados (o administrador vê todos). */
export async function getVisibleTales(isAdmin: boolean): Promise<{ tales: Tale[]; publishedSlugs: Set<string> }> {
  const statuses = await getTaleStatuses();
  const publishedSlugs = new Set(statuses.filter((s) => s.published).map((s) => s.slug));
  return { tales: TALES.filter((tale) => isAdmin || publishedSlugs.has(tale.slug)), publishedSlugs };
}

export async function isTalePublished(slug: string): Promise<boolean> {
  return (await getTaleStatuses()).some((status) => status.slug === slug && status.published);
}
