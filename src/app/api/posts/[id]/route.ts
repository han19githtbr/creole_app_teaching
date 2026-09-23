import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { requireAdmin } from "@/lib/apiAuth";

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
  const { title, content, isPermanent, expiresAt, isPublished } = body;

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Postagem não encontrada." }, { status: 404 });
  }

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (isPermanent !== undefined) post.isPermanent = isPermanent;
  if (expiresAt !== undefined) post.expiresAt = isPermanent ? null : expiresAt;
  if (isPublished !== undefined) post.isPublished = isPublished;

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

  return NextResponse.json({ success: true });
}
