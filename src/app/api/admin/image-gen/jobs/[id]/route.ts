import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import { ImageGenJob } from "@/models/ImageGen";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  const body = await request.json().catch(() => null);
  const next = { pause: "paused", resume: "active", cancel: "cancelled" }[String(body?.action)];
  if (!next) return NextResponse.json({ error: "Ação inválida." }, { status: 400 });

  await connectDB();
  const job = await ImageGenJob.findById(id);
  if (!job) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  if (job.status === "done" || job.status === "cancelled") {
    return NextResponse.json({ error: "Este pedido já foi encerrado." }, { status: 409 });
  }
  job.status = next as "paused" | "active" | "cancelled";
  if (next === "active") job.lastError = "";
  await job.save();
  return NextResponse.json({ ok: true });
}
