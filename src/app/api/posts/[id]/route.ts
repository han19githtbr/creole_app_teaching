import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import PostAnswer from "@/models/PostAnswer";
import { requireAdmin } from "@/lib/apiAuth";
import { isAllowedPostImageUrl } from "@/lib/imageBank";
import { isValidImageQuiz, normalizeImageQuiz } from "@/lib/imageQuiz";
import { sendContentPush } from "@/lib/pushNotifications";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const { title, content, imageUrl, imageAlt, imageQuiz, isPermanent, expiresAt, isPublished, acceptsAnswers } = body;

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Postagem não encontrada." }, { status: 404 });
  }
  const wasPublished = post.isPublished;
  const imageChanged = imageUrl !== undefined && imageUrl !== post.imageUrl;

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (imageUrl !== undefined) {
    if (imageUrl && !isAllowedPostImageUrl(imageUrl)) {
      return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
    }
    post.imageUrl = imageUrl || "";
    if (!imageUrl) {
      post.imageAlt = "";
      post.imageQuiz = undefined;
    } else if (imageChanged) {
      post.imageQuiz = undefined;
    }
  }
  if (imageAlt !== undefined && post.imageUrl) post.imageAlt = String(imageAlt).slice(0, 200);
  if (imageQuiz !== undefined) {
    if (imageQuiz === null) {
      post.imageQuiz = undefined;
    } else if (post.imageUrl && !isValidImageQuiz(imageQuiz)) {
      return NextResponse.json({ error: "Configure dez opções e marque ao menos uma resposta correta para a imagem." }, { status: 400 });
    } else if (post.imageUrl) {
      post.imageQuiz = normalizeImageQuiz(imageQuiz);
    }
  }
  function parseExpirationDate(val: unknown): Date | null {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const d = new Date(`${val}T23:59:59.999Z`);
        return isNaN(d.getTime()) ? null : d;
      }
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  if (isPermanent !== undefined) post.isPermanent = Boolean(isPermanent);
  if (expiresAt !== undefined) post.expiresAt = post.isPermanent ? null : parseExpirationDate(expiresAt);
  if (isPublished !== undefined) post.isPublished = Boolean(isPublished);
  const newlyPublished = !wasPublished && post.isPublished;
  if (newlyPublished) post.announcedAt = new Date();
  if (acceptsAnswers !== undefined) post.acceptsAnswers = Boolean(acceptsAnswers);

  if (!String(post.content || "").trim() && !post.imageUrl) {
    return NextResponse.json(
      { error: "Escreva uma legenda/conteúdo ou escolha uma imagem." },
      { status: 400 }
    );
  }

  await post.save();

  if (newlyPublished) {
    await sendContentPush({ title: "Novo aviso do professor", body: post.title, url: `/dashboard#post-${post.id}` });
  }

  return NextResponse.json({ post });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const { id } = await params;
  const deleted = await Post.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Postagem não encontrada." }, { status: 404 });
  }

  await PostAnswer.deleteMany({ post: id });

  return NextResponse.json({ success: true });
}
