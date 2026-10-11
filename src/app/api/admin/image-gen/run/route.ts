import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { runImageGenBatch } from "@/lib/imageGen/pipeline";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Botão "Gerar agora": produz UMA imagem por chamada (o painel repete até a cota do dia acabar).
// Assim cada requisição fica curta e o limite diário continua valendo para cron + botão juntos.
export async function POST() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const result = await runImageGenBatch({ maxItems: 1, deadlineMs: 200_000 });
  return NextResponse.json(result);
}
