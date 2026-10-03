import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { IMAGE_BANK } from "@/lib/imageBank";
import VideoLesson from "@/models/VideoLesson";
import { sendContentPush } from "@/lib/pushNotifications";

function validateStory(story: unknown) {
  if (!story || typeof story !== "object") return "Defina a cena, o áudio e as legendas da história.";
  const value = story as Record<string, unknown>;
  if (typeof value.imageSrc !== "string" || !IMAGE_BANK.some((image) => image.src === value.imageSrc)) return "Selecione uma imagem válida do banco Ghibli.";
  if (typeof value.audioUrl !== "string") return "Envie uma narração de áudio válida.";
  try {
    const audioUrl = new URL(value.audioUrl);
    if (audioUrl.protocol !== "https:" || !audioUrl.hostname.endsWith(".public.blob.vercel-storage.com")) return "Envie uma narração de áudio válida.";
  } catch {
    return "Envie uma narração de áudio válida.";
  }
  if (!Array.isArray(value.captions) || !value.captions.length) return "Adicione pelo menos uma legenda em Kreyòl e português.";
  let previousEnd = 0;
  for (const item of value.captions) {
    const caption = item as Record<string, unknown>;
    const start = Number(caption?.start);
    const end = Number(caption?.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < previousEnd || end <= start || end > 300 || typeof caption?.kreyol !== "string" || !caption.kreyol.trim() || typeof caption?.portuguese !== "string" || !caption.portuguese.trim()) return "As legendas precisam estar ordenadas, preenchidas e dentro dos 5 minutos.";
    previousEnd = end;
  }
  return null;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const { id } = await params;
  const body = await request.json();
  if (typeof body.title !== "string" || !body.title.trim()) return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  const validationError = validateStory(body.story);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  await connectDB();
  const video = await VideoLesson.findOne({ _id: id, story: { $exists: true } });
  if (!video) return NextResponse.json({ error: "História não encontrada." }, { status: 404 });
  const wasAvailable = video.isPublished && (!video.publishAt || video.publishAt <= new Date());
  const publishAt = body.publishAt ? new Date(body.publishAt) : null;
  video.title = body.title.trim();
  video.description = typeof body.description === "string" ? body.description.trim() : "";
  video.videoUrl = body.story.audioUrl;
  video.story = body.story;
  video.isPublished = Boolean(body.isPublished);
  video.publishAt = publishAt && !isNaN(publishAt.getTime()) ? publishAt : null;
  const isAvailable = video.isPublished && (!video.publishAt || video.publishAt <= new Date());
  if (isAvailable && !wasAvailable) {
    video.announcedAt = new Date();
    await sendContentPush({ title: "Nova história em Kreyòl", body: video.title, url: `/dashboard/stories/${video.id}` });
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
