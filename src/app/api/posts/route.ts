import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { requireAdmin, requireUser } from "@/lib/apiAuth";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();
  const isAdmin = session.user.role === "admin";

  const query: Record<string, unknown> = isAdmin
    ? {}
    : {
        isPublished: true,
        $or: [{ isPermanent: true }, { expiresAt: { $gte: new Date() } }],
      };

  const posts = await Post.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();
  const { title, content, isPermanent = true, expiresAt = null, isPublished = true } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Título e conteúdo são obrigatórios." }, { status: 400 });
  }

  const author = await User.findOne({ email: session.user.email.toLowerCase() });
  if (!author) {
    return NextResponse.json({ error: "Usuário administrador não encontrado." }, { status: 404 });
  }

  const post = await Post.create({
    title,
    content,
    author: author._id,
    isPermanent,
    expiresAt: isPermanent ? null : expiresAt,
    isPublished,
  });

  return NextResponse.json({ post }, { status: 201 });
}
