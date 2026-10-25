import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import { getUsage, resetUsage } from "@/lib/imageGen/pipeline";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  await connectDB();
  const body = await request.json().catch(() => ({}));
  if (body?.action === "reset") {
    await resetUsage();
    const usage = await getUsage();
    return NextResponse.json({ ok: true, usage });
  }
  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}
