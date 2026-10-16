import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { runImageGenBatch } from "@/lib/imageGen/pipeline";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Botão "Gerar agora": produz UMA imagem por chamada por padrão, ou a quantidade solicitada (respeitando a cota).
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  
  const body = await request.json().catch(() => ({}));
  const jobId = typeof body?.jobId === "string" && body.jobId.trim() ? body.jobId.trim() : undefined;
  const count = typeof body?.count === "number" && Number.isInteger(body.count) && body.count > 0
    ? Math.min(body.count, 5)
    : 1;

  const result = await runImageGenBatch({ maxItems: count, deadlineMs: 200_000, jobId });
  return NextResponse.json(result);
}

