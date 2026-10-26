import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { getTaleStatuses } from "@/lib/taleAccess";

export const dynamic = "force-dynamic";

/** Situação de publicação de todos os contos. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }
  return NextResponse.json({ tales: await getTaleStatuses() });
}
