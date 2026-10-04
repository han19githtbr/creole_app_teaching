import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { validateStory } from "@/lib/storyValidation";
import { sendContentPush } from "@/lib/pushNotifications";
import User from "@/models/User";
import VideoLesson from "@/models/VideoLesson";

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
  const validation = validateStory(body.story);
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });
  const story = validation.story;

  await connectDB();
  const author = await User.findOne({ email: session.user.email.toLowerCase().trim() });
  if (!author) return NextResponse.json({ error: "Usuário autor não encontrado." }, { status: 404 });

  const publishAt = body.publishAt ? new Date(body.publishAt) : null;
  const isPublished = Boolean(body.isPublished);
  const video = await VideoLesson.create({
    title: body.title.trim(),
    description: typeof body.description === "string" ? body.description.trim() : "",
    videoUrl: story.audioUrl,
    duration: Math.round(story.audioDuration ?? 0),
    author: author._id,
    authorName: author.name || "Professor(a)",
    isPublished,
    publishAt: publishAt && !isNaN(publishAt.getTime()) ? publishAt : null,
    announcedAt: isPublished ? publishAt && publishAt > new Date() ? publishAt : new Date() : null,
    isLiveRecording: false,
    story,
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
