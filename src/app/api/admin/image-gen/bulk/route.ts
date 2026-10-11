import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import { GeneratedImage } from "@/models/ImageGen";
import { IMAGE_GEN_AUTO_APPROVE_SCORE, isSection } from "@/lib/imageGen/config";

// "Aprovar todas com nota alta": só imagens pendentes que passaram pela revisão automática.
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const minScore = Math.min(10, Math.max(0, Number(body?.minScore) || IMAGE_GEN_AUTO_APPROVE_SCORE));
  const filter: Record<string, unknown> = { status: "pending", "qa.checked": true, "qa.passed": true, "qa.score": { $gte: minScore } };
  if (isSection(body?.section)) filter.section = body.section;
  await connectDB();
  const result = await GeneratedImage.updateMany(filter, { $set: { status: "approved" } });
  return NextResponse.json({ approved: result.modifiedCount });
}
