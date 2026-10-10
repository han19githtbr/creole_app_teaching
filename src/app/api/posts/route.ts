import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { isAllowedPostImageUrl } from "@/lib/imageBank";
import { isValidImageQuiz, normalizeImageQuiz } from "@/lib/imageQuiz";
import { sendContentPush } from "@/lib/pushNotifications";
import { getAppLanguage, languageFilter } from "@/lib/language";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();
  const isAdmin = session.user.role === "admin";

  const language = await getAppLanguage();
  const query: Record<string, unknown> = isAdmin
    ? { ...languageFilter(language) }
    : {
        ...languageFilter(language),
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
    imageQuiz,
    isPermanent = true,
    expiresAt = null,
    isPublished = true,
    acceptsAnswers = true,
  } = body;

  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  }
  if (imageUrl && !isAllowedPostImageUrl(imageUrl)) {
    return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
  }
  if (imageQuiz != null && !isValidImageQuiz(imageQuiz)) {
    return NextResponse.json({ error: "Informe de duas a vinte palavras únicas e marque ao menos uma resposta correta para a imagem." }, { status: 400 });
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

  const language = await getAppLanguage();
  const post = await Post.create({
    language,
    title,
    content,
    imageUrl: imageUrl || "",
    imageAlt: imageUrl ? String(imageAlt).slice(0, 200) : "",
    imageQuiz: imageUrl && imageQuiz ? normalizeImageQuiz(imageQuiz) : undefined,
    author: author._id,
    isPermanent: Boolean(isPermanent),
    expiresAt: isPermanent ? null : parseExpirationDate(expiresAt),
    isPublished: Boolean(isPublished),
    announcedAt: isPublished ? new Date() : null,
    acceptsAnswers: Boolean(acceptsAnswers),
  });

  if (post.isPublished) {
    await sendContentPush({ title: "Novo aviso do professor", body: post.title, url: `/dashboard#post-${post.id}`, language });
  }

  return NextResponse.json({ post }, { status: 201 });
}
