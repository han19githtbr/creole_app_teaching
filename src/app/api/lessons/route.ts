import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lesson, { LESSON_CATEGORIES } from "@/models/Lesson";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { slugify } from "@/lib/utils";
import { getAppLanguage, languageFilter } from "@/lib/language";

export async function GET(req: NextRequest) {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();
  const category = req.nextUrl.searchParams.get("category");
  const isAdmin = session.user.role === "admin";

  const language = await getAppLanguage();
  const query: Record<string, unknown> = { ...languageFilter(language) };
  if (category && LESSON_CATEGORIES.includes(category as never)) {
    query.category = category;
  }
  if (!isAdmin) {
    query.isPublished = true;
    query.announcedAt = { $ne: null };
  }

  const lessons = await Lesson.find(query)
    .sort({ order: 1, sectionNumber: 1 })
    .select("title slug sectionNumber category isPublished announcedAt order")
    .lean();

  return NextResponse.json({ lessons });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();
  const { title, sectionNumber, category, content, isPublished = false } = body;

  if (!title || !category || !content) {
    return NextResponse.json({ error: "Título, categoria e conteúdo são obrigatórios." }, { status: 400 });
  }

  let slug = slugify(title);
  const existing = await Lesson.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const language = await getAppLanguage();
  const maxOrder = await Lesson.findOne(languageFilter(language)).sort({ order: -1 }).select("order").lean<{ order: number }>();

  const lesson = await Lesson.create({
    title,
    slug,
    sectionNumber: sectionNumber ?? 0,
    category,
    content,
    language,
    isPublished: Boolean(isPublished),
    // Publicar = ficar visível aos alunos (e notificar). Rascunho nunca é anunciado.
    announcedAt: isPublished ? new Date() : null,
    order: (maxOrder?.order ?? 0) + 1,
  });

  if (lesson.isPublished && lesson.announcedAt) {
    const { sendContentPush } = await import("@/lib/pushNotifications");
    await sendContentPush({
      title: language === "francais" ? "Nouvelle leçon disponible" : "Nova lição disponível",
      body: lesson.title,
      url: `/dashboard/lessons/${lesson.slug}`,
      language,
    });
  }

  return NextResponse.json({ lesson }, { status: 201 });
}
