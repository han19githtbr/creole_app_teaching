import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { isAllowedPostImageUrl } from "@/lib/imageBank";

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
  const {
    title,
    content = "",
    imageUrl = "",
    imageAlt = "",
    isPermanent = true,
    expiresAt = null,
    isPublished = true,
  } = body;

  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  }
  if (imageUrl && !isAllowedPostImageUrl(imageUrl)) {
    return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
  }
  if (!String(content).trim() && !imageUrl) {
    return NextResponse.json(
      { error: "Escreva uma legenda/conteúdo ou escolha uma imagem." },
      { status: 400 }
    );
  }

  const author = await User.findOne({ email: session.user.email.toLowerCase() });
  if (!author) {
    return NextResponse.json({ error: "Usuário administrador não encontrado." }, { status: 404 });
  }

  const post = await Post.create({
    title,
    content,
    imageUrl: imageUrl || "",
    imageAlt: imageUrl ? String(imageAlt).slice(0, 200) : "",
    author: author._id,
    isPermanent,
    expiresAt: isPermanent ? null : expiresAt,
    isPublished,
  });

  return NextResponse.json({ post }, { status: 201 });
}
