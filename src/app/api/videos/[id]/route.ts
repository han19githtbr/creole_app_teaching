import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { requireAdmin, requireUser } from "@/lib/apiAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const video = await VideoLesson.findById(id);
  if (!video) {
    return NextResponse.json({ error: "Vídeo não encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const now = new Date();

  // If student, check if published and available
  if (!isAdmin) {
    if (!video.isPublished) {
      return NextResponse.json({ error: "Vídeo não disponível." }, { status: 403 });
    }
    if (video.publishAt && new Date(video.publishAt) > now) {
      return NextResponse.json(
        { error: "Este vídeo está agendado e ainda não foi liberado." },
        { status: 403 }
      );
    }
  }

  // Increment views count (non-blocking)
  await VideoLesson.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });

  const userEmail = session.user.email?.toLowerCase().trim();

  const serialized = {
    _id: String(video._id),
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration || 0,
    authorName: video.authorName,
    isPublished: video.isPublished,
    publishAt: video.publishAt ? new Date(video.publishAt).toISOString() : null,
    isScheduled: Boolean(video.publishAt && new Date(video.publishAt) > now),
    isLiveRecording: Boolean(video.isLiveRecording),
    customization: video.customization || {
      backgroundStyle: "haiti_flag",
      avatarType: "webcam",
      frameStyle: "rounded",
    },
    likesCount: video.likes?.length || 0,
    hasLiked: Boolean(userEmail && video.likes?.includes(userEmail)),
    comments: (video.comments || []).map((c: {
      _id?: unknown;
      userId?: unknown;
      userName: string;
      userImage?: string;
      userEmail: string;
      content: string;
      createdAt: Date;
    }) => ({
      _id: String(c._id),
      userId: String(c.userId),
      userName: c.userName,
      userImage: c.userImage,
      userEmail: c.userEmail,
      content: c.content,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
      canDelete: Boolean(isAdmin || (userEmail && c.userEmail === userEmail)),
    })),
    viewsCount: (video.viewsCount || 0) + 1,
    createdAt: video.createdAt ? new Date(video.createdAt).toISOString() : new Date().toISOString(),
  };

  return NextResponse.json(serialized);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const body = await req.json();
  const {
    title,
    description,
    videoUrl,
    thumbnailUrl,
    duration,
    isPublished,
    publishAt,
    isLiveRecording,
    customization,
  } = body;

  const updateData: Record<string, unknown> = {};

  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl.trim();
  if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl?.trim() || "";
  if (duration !== undefined) updateData.duration = Math.min(Math.max(Number(duration) || 0, 0), 600);
  if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);
  if (publishAt !== undefined) {
    const parsed = publishAt ? new Date(publishAt) : null;
    updateData.publishAt = parsed && !isNaN(parsed.getTime()) ? parsed : null;
  }
  if (isLiveRecording !== undefined) updateData.isLiveRecording = Boolean(isLiveRecording);
  if (customization !== undefined) updateData.customization = customization;

  const updated = await VideoLesson.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  if (!updated) {
    return NextResponse.json({ error: "Vídeo não encontrado." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const deleted = await VideoLesson.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Vídeo não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
