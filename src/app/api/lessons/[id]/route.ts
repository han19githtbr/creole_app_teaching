import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { slugify } from "@/lib/utils";
import mongoose from "mongoose";

async function findLesson(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const bySlugOrId = await Lesson.findOne({
      $or: [{ _id: id }, { slug: id }],
    });
    return bySlugOrId;
  }
  return Lesson.findOne({ slug: id });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const lesson = await findLesson(id);
  const isAdmin = session.user.role === "admin";
  const hiddenFromUser = !lesson?.isPublished;

  if (!lesson || (hiddenFromUser && !isAdmin)) {
    return NextResponse.json({ error: "Lição não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ lesson });
}

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
  const { title, sectionNumber, category, content, isPublished, order, announce } = body;

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lição não encontrada." }, { status: 404 });
  }

  const wasPublished = lesson.isPublished;
  const previousAnnouncedAt = lesson.announcedAt?.getTime() ?? null;

  if (title && title !== lesson.title) {
    lesson.title = title;
    const newSlug = slugify(title);
    if (newSlug !== lesson.slug) {
      const clash = await Lesson.findOne({ slug: newSlug, _id: { $ne: lesson._id } });
      lesson.slug = clash ? `${newSlug}-${Date.now().toString(36)}` : newSlug;
    }
  }
  if (sectionNumber !== undefined) lesson.sectionNumber = sectionNumber;
  if (category) lesson.category = category;
  if (content !== undefined) lesson.content = content;
  if (isPublished !== undefined) lesson.isPublished = Boolean(isPublished);
  if (order !== undefined) lesson.order = order;

  if (announce === true) {
    lesson.announcedAt = new Date();
  } else if (announce === false) {
    lesson.announcedAt = null;
  } else if (isPublished === true && !wasPublished) {
    lesson.announcedAt = new Date();
  }

  await lesson.save();

  if (
    lesson.isPublished &&
    lesson.announcedAt &&
    lesson.announcedAt.getTime() !== previousAnnouncedAt
  ) {
    const { sendContentPush } = await import("@/lib/pushNotifications");
    await sendContentPush({
      title: "Nova lição disponível",
      body: lesson.title,
      url: `/dashboard/lessons/${lesson.slug}`,
    });
  }

  return NextResponse.json({ lesson });
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
  const deleted = await Lesson.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Lição não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
