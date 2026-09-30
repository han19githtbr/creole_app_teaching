import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import PostAnswer from "@/models/PostAnswer";
import { requireAdmin } from "@/lib/apiAuth";
import { isAllowedPostImageUrl } from "@/lib/imageBank";

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
  const { title, content, imageUrl, imageAlt, isPermanent, expiresAt, isPublished, acceptsAnswers } = body;

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Postagem não encontrada." }, { status: 404 });
  }

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (imageUrl !== undefined) {
    if (imageUrl && !isAllowedPostImageUrl(imageUrl)) {
      return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
    }
    post.imageUrl = imageUrl || "";
    if (!imageUrl) post.imageAlt = "";
  }
  if (imageAlt !== undefined && post.imageUrl) post.imageAlt = String(imageAlt).slice(0, 200);
  if (isPermanent !== undefined) post.isPermanent = isPermanent;
  if (expiresAt !== undefined) post.expiresAt = isPermanent ? null : expiresAt;
  if (isPublished !== undefined) post.isPublished = isPublished;
  if (acceptsAnswers !== undefined) post.acceptsAnswers = Boolean(acceptsAnswers);

  if (!String(post.content || "").trim() && !post.imageUrl) {
    return NextResponse.json(
      { error: "Escreva uma legenda/conteúdo ou escolha uma imagem." },
      { status: 400 }
    );
  }

  await post.save();

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
