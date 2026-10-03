import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { IMAGE_BANK } from "@/lib/imageBank";
import { sendContentPush } from "@/lib/pushNotifications";
import User from "@/models/User";
import VideoLesson from "@/models/VideoLesson";

const isAudioUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
};

function validateStory(story: unknown) {
  if (!story || typeof story !== "object") return "Defina a cena, o áudio e as legendas da história.";
  const value = story as Record<string, unknown>;
  if (typeof value.imageSrc !== "string" || !IMAGE_BANK.some((image) => image.src === value.imageSrc)) {
    return "Selecione uma imagem válida do banco Ghibli.";
  }
  if (!isAudioUrl(value.audioUrl)) return "Envie uma narração de áudio válida.";
  if (!Array.isArray(value.captions) || value.captions.length === 0) {
    return "Adicione pelo menos uma legenda em Kreyòl e português.";
  }
  let previousEnd = 0;
  for (const item of value.captions) {
    if (!item || typeof item !== "object") return "Revise os trechos de legenda.";
    const caption = item as Record<string, unknown>;
    const start = Number(caption.start);
    const end = Number(caption.end);
    if (
      !Number.isFinite(start) || !Number.isFinite(end) || start < previousEnd ||
      end <= start || end > 300 || typeof caption.kreyol !== "string" ||
      !caption.kreyol.trim() || typeof caption.portuguese !== "string" || !caption.portuguese.trim()
    ) return "As legendas precisam estar ordenadas, preenchidas e dentro dos 5 minutos.";
    previousEnd = end;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  await connectDB();
  const now = new Date();
  const filter = session.user.role === "admin" && request.nextUrl.searchParams.get("all") === "true"
    ? { story: { $exists: true } }
    : {
        story: { $exists: true },
        isPublished: true,
        $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
      };
  const stories = await VideoLesson.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(stories.map((story) => ({
    _id: String(story._id),
    title: story.title,
    description: story.description,
    duration: story.duration,
    story: story.story,
    isPublished: story.isPublished,
    publishAt: story.publishAt ? new Date(story.publishAt).toISOString() : null,
    createdAt: story.createdAt ? new Date(story.createdAt).toISOString() : new Date().toISOString(),
  })));
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session?.user?.email) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });

  const body = await request.json();
  if (typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  }
  const validationError = validateStory(body.story);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  await connectDB();
  const author = await User.findOne({ email: session.user.email.toLowerCase().trim() });
  if (!author) return NextResponse.json({ error: "Usuário autor não encontrado." }, { status: 404 });

  const publishAt = body.publishAt ? new Date(body.publishAt) : null;
  const isPublished = Boolean(body.isPublished);
  const video = await VideoLesson.create({
    title: body.title.trim(),
    description: typeof body.description === "string" ? body.description.trim() : "",
    videoUrl: body.story.audioUrl,
    duration: 300,
    author: author._id,
    authorName: author.name || "Professor(a)",
    isPublished,
    publishAt: publishAt && !isNaN(publishAt.getTime()) ? publishAt : null,
    announcedAt: isPublished ? publishAt && publishAt > new Date() ? publishAt : new Date() : null,
    isLiveRecording: false,
    story: body.story,
    customization: { backgroundStyle: "natureza", avatarType: "webcam", frameStyle: "rounded" },
    likes: [],
    comments: [],
    viewsCount: 0,
  });

  if (video.isPublished && (!video.publishAt || video.publishAt <= new Date())) {
    await sendContentPush({ title: "Nova história em Kreyòl", body: video.title, url: `/dashboard/stories/${video.id}` });
  }
  return NextResponse.json({ _id: String(video._id) }, { status: 201 });
}
