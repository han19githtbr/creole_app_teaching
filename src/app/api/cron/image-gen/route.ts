import { NextRequest, NextResponse } from "next/server";
import { runImageGenBatch } from "@/lib/imageGen/pipeline";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Chamado uma vez por dia pelo Vercel Cron (vercel.json). Gera até o limite diário dos pedidos ativos.
// O Vercel envia "Authorization: Bearer <CRON_SECRET>" quando a variável CRON_SECRET existe.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET não configurado." }, { status: 500 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const result = await runImageGenBatch({ deadlineMs: 270_000 });
  return NextResponse.json(result);
}
