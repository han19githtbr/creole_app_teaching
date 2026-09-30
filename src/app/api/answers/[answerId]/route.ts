import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import PostAnswer from "@/models/PostAnswer";
import { requireAdmin } from "@/lib/apiAuth";
import { ANSWER_MAX_LENGTH, toAnswerDTO } from "@/lib/postAnswers";

// O professor valida a resposta: correta ✓ / incorreta ✗ (+ texto opcional) ou volta para análise.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ answerId: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });

  const { answerId } = await params;
  if (!mongoose.isValidObjectId(answerId)) return NextResponse.json({ error: "Resposta inválida." }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { status?: string; feedback?: string };
  if (!body.status || !["correct", "incorrect", "pending"].includes(body.status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }
  const feedback = String(body.feedback ?? "").trim();
  if (feedback.length > ANSWER_MAX_LENGTH) {
    return NextResponse.json({ error: `O texto pode ter no máximo ${ANSWER_MAX_LENGTH} caracteres.` }, { status: 400 });
  }

  await connectDB();
  const answer = await PostAnswer.findById(answerId);
  if (!answer) return NextResponse.json({ error: "Resposta não encontrada." }, { status: 404 });

  answer.status = body.status as "correct" | "incorrect" | "pending";
  answer.feedback = body.status === "pending" ? "" : feedback;
  answer.reviewedAt = body.status === "pending" ? null : new Date();
  await answer.save();

  return NextResponse.json({ answer: toAnswerDTO(answer) });
}
