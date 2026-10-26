import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { getR2StorageStats } from "@/lib/r2";

export const dynamic = "force-dynamic";

/** Consulta o armazenamento do Cloudflare R2 em tempo real. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  const stats = await getR2StorageStats();
  return NextResponse.json({ stats });
}
