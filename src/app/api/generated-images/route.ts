import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/apiAuth";
import { findGeneratedBankImage, listApprovedGenerated } from "@/lib/generatedImages";
import { isSection } from "@/lib/imageGen/config";

export const dynamic = "force-dynamic";

// Imagens geradas por IA já aprovadas, no mesmo formato do banco de imagens.
//   ?section=posts|stories → lista para o seletor de imagens
//   ?src=/gen/... → uma imagem (elementos e posições dos rótulos), usada pelo player de histórias
export async function GET(request: NextRequest) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Faça login." }, { status: 401 });
  const params = request.nextUrl.searchParams;

  const src = params.get("src");
  if (src) {
    const image = await findGeneratedBankImage(src, { includeUnapproved: session.user.role === "admin" });
    return image ? NextResponse.json({ image }) : NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  }

  const section = params.get("section");
  if (section && !isSection(section)) return NextResponse.json({ error: "Seção inválida." }, { status: 400 });
  const images = await listApprovedGenerated(section && isSection(section) ? section : undefined);
  return NextResponse.json({ images });
}
