import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { getAppLanguage, isAppLanguage } from "@/lib/language";
import { buildAdData } from "@/lib/adStudio/serverData";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const asked = request.nextUrl.searchParams.get("language");
  const language = isAppLanguage(asked) ? asked : await getAppLanguage();
  return NextResponse.json(await buildAdData(language));
}
