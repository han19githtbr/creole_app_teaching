import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import User from "@/models/User";
import { requireAdmin, requireUser } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get("all") === "true";
  const search = searchParams.get("q")?.trim();
  const isAdmin = session.user.role === "admin";

  const now = new Date();
  const filter: Record<string, unknown> = {};

  if (!isAdmin || !showAll) {
    filter.isPublished = true;
    filter.$or = [{ publishAt: null }, { publishAt: { $lte: now } }];
  }

  if (search) {
    filter.$and = [
      ...(filter.$or ? [{ $or: filter.$or }] : []),
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    ];
    delete filter.$or;
  }

  const videos = await VideoLesson.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const userEmail = session.user.email?.toLowerCase().trim();

  const serialized = videos.map((v) => ({
    _id: String(v._id),
    title: v.title,
    description: v.description,
    videoUrl: v.videoUrl,
    thumbnailUrl: v.thumbnailUrl,
    duration: v.duration || 0,
    authorName: v.authorName || "Professor(a)",
    isPublished: v.isPublished,
    publishAt: v.publishAt ? new Date(v.publishAt).toISOString() : null,
    isScheduled: Boolean(v.publishAt && new Date(v.publishAt) > now),
    isLiveRecording: Boolean(v.isLiveRecording),
    customization: v.customization || {
      backgroundStyle: "haiti_flag",
      avatarType: "webcam",
      frameStyle: "rounded",
    },
    likesCount: v.likes?.length || 0,
    hasLiked: Boolean(userEmail && v.likes?.includes(userEmail)),
    commentsCount: v.comments?.length || 0,
    viewsCount: v.viewsCount || 0,
    createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
  }));

  return NextResponse.json(serialized);
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
    description,
    videoUrl,
    thumbnailUrl,
    duration,
    isPublished = true,
    publishAt,
    isLiveRecording = false,
    customization,
  } = body;

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "O título é obrigatório." }, { status: 400 });
  }

  if (!videoUrl || !videoUrl.trim()) {
    return NextResponse.json({ error: "O vídeo é obrigatório." }, { status: 400 });
  }

  const authorUser = await User.findOne({
    email: session.user.email.toLowerCase().trim(),
  });

  if (!authorUser) {
    return NextResponse.json({ error: "Usuário autor não encontrado." }, { status: 404 });
  }

  const parsedPublishAt = publishAt ? new Date(publishAt) : null;

  const video = await VideoLesson.create({
    title: title.trim(),
    description: description?.trim() || "",
    videoUrl: videoUrl.trim(),
    thumbnailUrl: thumbnailUrl?.trim() || "",
    duration: Math.min(Math.max(Number(duration) || 0, 0), 600), // Max 10 minutes (600s)
    author: authorUser._id,
    authorName: authorUser.name || "Professor(a)",
    isPublished: Boolean(isPublished),
    publishAt: parsedPublishAt && !isNaN(parsedPublishAt.getTime()) ? parsedPublishAt : null,
    isLiveRecording: Boolean(isLiveRecording),
    customization: customization || {
      backgroundStyle: "haiti_flag",
      avatarType: "webcam",
      frameStyle: "rounded",
      bannerText: "",
    },
    likes: [],
    comments: [],
    viewsCount: 0,
  });

  return NextResponse.json(video, { status: 201 });
}
