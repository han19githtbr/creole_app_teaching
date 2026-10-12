// Leitura (servidor) das imagens geradas por IA, convertidas para o mesmo formato do banco de imagens estático.
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { IMAGE_BANK, getBankImage, type BankImage } from "@/lib/imageBank";
import { THEMES, type ImageSection } from "@/lib/imageGen/config";
import { GeneratedImage, type IGeneratedImage } from "@/models/ImageGen";
import type { CestQuoiItem } from "@/components/CestQuoiGame";

const FALLBACK_ANCHORS = [
  { left: 27, top: 64 },
  { left: 73, top: 64 },
  { left: 28, top: 28 },
  { left: 72, top: 30 },
];

export function toBankImage(doc: IGeneratedImage): BankImage {
  const theme = THEMES.find((item) => item.id === doc.themeId);
  const sameTheme = IMAGE_BANK.find((image) => image.isPrimary && image.theme === doc.theme);
  const anchors = doc.anchors?.length ? doc.anchors.map((a) => ({ left: a.left, top: a.top })) : FALLBACK_ANCHORS;
  return {
    id: `gen-${String(doc._id)}`,
    theme: doc.theme,
    title: doc.title,
    src: doc.src,
    kreyol: theme?.kreyol ?? doc.theme,
    caption: doc.caption,
    ambientTheme: sameTheme?.ambientTheme ?? "natureza",
    isPrimary: true,
    labelLayout: { top: 12, left: 50, width: 78, align: "center", anchors },
    elements: (doc.elements ?? []).map((element) => ({ kreyol: element.kreyol, pt: element.pt })),
    quiz: doc.quiz?.options?.length ? { options: [...doc.quiz.options], answers: [...(doc.quiz.answers ?? [])] } : undefined,
    generated: true,
  };
}

export async function listApprovedGenerated(section?: ImageSection): Promise<BankImage[]> {
  await connectDB();
  const filter: Record<string, unknown> = { status: "approved", section: section ?? { $in: ["posts", "stories"] } };
  const docs = (await GeneratedImage.find(filter).sort({ createdAt: -1 }).limit(400).lean()) as unknown as IGeneratedImage[];
  return docs.map(toBankImage);
}

/** Procura uma imagem gerada por id ("gen-<id>") ou por caminho ("/gen/...svg|webp"). */
export async function findGeneratedBankImage(
  idOrSrc: string | null | undefined,
  options: { includeUnapproved?: boolean } = {}
): Promise<BankImage | undefined> {
  if (!idOrSrc) return undefined;
  const filter: Record<string, unknown> = {};
  if (idOrSrc.startsWith("gen-") && isValidObjectId(idOrSrc.slice(4))) filter._id = idOrSrc.slice(4);
  else if (idOrSrc.startsWith("/gen/")) filter.src = idOrSrc;
  else return undefined;
  if (!options.includeUnapproved) filter.status = "approved";
  await connectDB();
  const doc = (await GeneratedImage.findOne(filter).lean()) as unknown as IGeneratedImage | null;
  return doc && doc.section !== "cquoi" ? toBankImage(doc) : undefined;
}

/** Banco estático primeiro; se não achar, procura nas imagens geradas. */
export async function findAnyBankImage(
  idOrSrc: string | null | undefined,
  options: { includeUnapproved?: boolean } = {}
): Promise<BankImage | undefined> {
  return getBankImage(idOrSrc) ?? (await findGeneratedBankImage(idOrSrc, options));
}

/** Itens do C'est quoi ? gerados e aprovados (mesmo formato de cquoiItems.json). */
export async function listApprovedCquoiItems(): Promise<CestQuoiItem[]> {
  await connectDB();
  const docs = (await GeneratedImage.find({ section: "cquoi", status: "approved" }).sort({ createdAt: 1 }).lean()) as unknown as IGeneratedImage[];
  return docs
    .filter((doc) => doc.cquoi)
    .map((doc) => ({
      id: `gen-${String(doc._id)}`,
      themeId: doc.themeId,
      theme: doc.theme,
      fr: doc.cquoi!.fr,
      article: doc.cquoi!.article,
      name: doc.cquoi!.name,
      speak: doc.cquoi!.speak,
      scene: doc.src,
      w: doc.cquoi!.w,
      h: doc.cquoi!.h,
      arrow: { x: doc.cquoi!.arrow.x, y: doc.cquoi!.arrow.y },
      ...(doc.cquoi!.hint?.d && doc.cquoi!.hint?.u ? { hint: { d: doc.cquoi!.hint.d, u: doc.cquoi!.hint.u, f: doc.cquoi!.hint.f || undefined } } : {}),
    }));
}
