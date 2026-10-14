import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/apiAuth";
import AdDesign from "@/models/AdDesign";
import { safeThumbnail, sanitizeDesign } from "@/lib/adStudio/validate";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  await connectDB();
  const docs = await AdDesign.find({}).sort({ updatedAt: -1 }).limit(100).select("name language format slideCount thumbnail updatedAt").lean();
  return NextResponse.json(
    docs.map((d) => ({
      _id: String(d._id),
      name: d.name,
      language: d.language,
      format: d.format,
      slideCount: d.slideCount,
      thumbnail: d.thumbnail,
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const checked = sanitizeDesign(body?.design);
  if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });
  await connectDB();
  const d = checked.design;
  const doc = await AdDesign.create({
    name: d.name,
    language: d.language,
    format: d.format,
    slideCount: d.slides.length,
    thumbnail: safeThumbnail(body?.thumbnail),
    design: d,
    createdBy: session.user.email ?? "",
  });
  return NextResponse.json({ _id: String(doc._id) }, { status: 201 });
}
