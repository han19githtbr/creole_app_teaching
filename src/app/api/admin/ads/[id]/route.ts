import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/apiAuth";
import AdDesign from "@/models/AdDesign";
import { safeThumbnail, sanitizeDesign } from "@/lib/adStudio/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Peça não encontrada." }, { status: 404 });
  await connectDB();
  const doc = await AdDesign.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Peça não encontrada." }, { status: 404 });
  return NextResponse.json({ _id: String(doc._id), design: doc.design });
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Peça não encontrada." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const checked = sanitizeDesign(body?.design);
  if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });
  await connectDB();
  const d = checked.design;
  const doc = await AdDesign.findByIdAndUpdate(
    id,
    { name: d.name, language: d.language, format: d.format, slideCount: d.slides.length, thumbnail: safeThumbnail(body?.thumbnail), design: d },
    { new: true }
  );
  if (!doc) return NextResponse.json({ error: "Peça não encontrada." }, { status: 404 });
  return NextResponse.json({ _id: String(doc._id) });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Peça não encontrada." }, { status: 404 });
  await connectDB();
  await AdDesign.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
