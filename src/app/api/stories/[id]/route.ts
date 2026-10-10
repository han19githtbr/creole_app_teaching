import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { validateStory } from "@/lib/storyValidation";
import VideoLesson from "@/models/VideoLesson";
import { sendContentPush } from "@/lib/pushNotifications";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  const body = await request.json();
  if (typeof body.title !== "string" || !body.title.trim()) return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  const validation = validateStory(body.story);
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });
  const story = validation.story;

  await connectDB();
  const video = await VideoLesson.findOne({ _id: id, story: { $exists: true } });
  if (!video) return NextResponse.json({ error: "História não encontrada." }, { status: 404 });
  const wasAvailable = video.isPublished && (!video.publishAt || video.publishAt <= new Date());
  const publishAt = body.publishAt ? new Date(body.publishAt) : null;
  video.title = body.title.trim();
  video.description = typeof body.description === "string" ? body.description.trim() : "";
  video.videoUrl = story.audioUrl;
  video.duration = Math.round(story.audioDuration ?? 0);
  video.story = story;
  video.isPublished = Boolean(body.isPublished);
  video.publishAt = publishAt && !isNaN(publishAt.getTime()) ? publishAt : null;
  const isAvailable = video.isPublished && (!video.publishAt || video.publishAt <= new Date());
  if (isAvailable && !wasAvailable) {
    video.announcedAt = new Date();
    await sendContentPush({ title: "Nova história em Kreyòl", body: video.title, url: `/dashboard/stories/${video.id}`, language: video.language });
  }
  await video.save();
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  await connectDB();
  const deleted = await VideoLesson.findOneAndDelete({ _id: id, story: { $exists: true } });
  if (!deleted) return NextResponse.json({ error: "História não encontrada." }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { id } = await params;
  await connectDB();
  const story = await VideoLesson.findOne({ _id: id, story: { $exists: true } }).lean();
  if (!story) return NextResponse.json({ error: "História não encontrada." }, { status: 404 });
  if (session.user.role !== "admin" && (!story.isPublished || (story.publishAt && story.publishAt > new Date()))) {
    return NextResponse.json({ error: "História não disponível." }, { status: 404 });
  }
  return NextResponse.json({
    _id: String(story._id), title: story.title, description: story.description,
    isPublished: story.isPublished, story: story.story,
  });
}
