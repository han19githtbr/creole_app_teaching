import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import PostAnswer from "@/models/PostAnswer";
import { requireUser } from "@/lib/apiAuth";
import { ANSWER_MAX_LENGTH, toAnswerDTO } from "@/lib/postAnswers";

async function getMe(email: string) {
  return User.findOne({ email: email.toLowerCase().trim() }).select("_id").lean<{ _id: mongoose.Types.ObjectId }>();
}

// Resposta do aluno logado a esta postagem (usada também para atualizar o status).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireUser();
  if (!session?.user?.email) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Postagem inválida." }, { status: 400 });

  await connectDB();
  const me = await getMe(session.user.email);
  if (!me) return NextResponse.json({ answer: null });
  const answer = await PostAnswer.findOne({ post: id, user: me._id }).lean();
  return NextResponse.json({ answer: answer ? toAnswerDTO(answer) : null });
}

// Envia (ou edita/refaz) a resposta do aluno. Vai para "Em análise".
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireUser();
  if (!session?.user?.email) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  if (session.user.role === "admin") {
    return NextResponse.json({ error: "O professor não responde às próprias postagens." }, { status: 403 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Postagem inválida." }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = String(body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "Escreva sua resposta antes de enviar." }, { status: 400 });
  if (text.length > ANSWER_MAX_LENGTH) {
    return NextResponse.json({ error: `A resposta pode ter no máximo ${ANSWER_MAX_LENGTH} caracteres.` }, { status: 400 });
  }

  await connectDB();
  const now = new Date();
  const post = await Post.findOne({
    _id: id,
    isPublished: true,
    $or: [{ isPermanent: true }, { expiresAt: { $gte: now } }],
  })
    .select("acceptsAnswers")
    .lean<{ acceptsAnswers?: boolean }>();
  if (!post) return NextResponse.json({ error: "Postagem não encontrada." }, { status: 404 });
  if (post.acceptsAnswers === false) {
    return NextResponse.json({ error: "Esta postagem não aceita respostas." }, { status: 403 });
  }

  const me = await getMe(session.user.email);
  if (!me) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  const existing = await PostAnswer.findOne({ post: id, user: me._id });
  if (existing) {
    if (existing.status === "correct") {
      return NextResponse.json({ error: "Sua resposta já foi validada como correta. Parabéns!" }, { status: 409 });
    }
    // Editar enquanto está em análise não conta como nova tentativa;
    // refazer depois de "incorreta" conta.
    if (existing.status === "incorrect") existing.attempts = (existing.attempts ?? 1) + 1;
    existing.text = text;
    existing.status = "pending";
    existing.feedback = "";
    existing.reviewedAt = null;
    await existing.save();
    return NextResponse.json({ answer: toAnswerDTO(existing) });
  }

  const created = await PostAnswer.create({ post: id, user: me._id, text });
  return NextResponse.json({ answer: toAnswerDTO(created) }, { status: 201 });
}
