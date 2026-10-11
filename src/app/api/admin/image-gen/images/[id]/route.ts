import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import { r2Delete } from "@/lib/r2";
import { GeneratedImage } from "@/models/ImageGen";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
  const body = await request.json().catch(() => null);
  const status = { approve: "approved", reject: "rejected", restore: "pending" }[String(body?.action)];
  if (!status) return NextResponse.json({ error: "Ação inválida." }, { status: 400 });

  await connectDB();
  const image = await GeneratedImage.findByIdAndUpdate(id, { $set: { status } }, { returnDocument: "after" });
  if (!image) return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  return NextResponse.json({ ok: true, status: image.status });
}

// Exclui de vez: remove do bucket e do banco. (Posts/histórias que já usam a imagem deixariam de exibi-la.)
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
  await connectDB();
  const image = await GeneratedImage.findById(id);
  if (!image) return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  if (image.status === "approved") {
    return NextResponse.json({ error: "Rejeite a imagem antes de excluir: ela pode estar em uso em postagens ou histórias." }, { status: 409 });
  }
  await r2Delete(image.storageKey).catch(() => undefined);
  await image.deleteOne();
  return NextResponse.json({ ok: true });
}
