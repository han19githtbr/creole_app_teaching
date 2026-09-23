import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LiveSession from "@/models/LiveSession";
import { requireAdmin, requireUser } from "@/lib/apiAuth";
import { createLivekitToken, livekitConfigured, LIVEKIT_ROOM_NAME } from "@/lib/livekit";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();
  const live = await LiveSession.findOne({ roomName: LIVEKIT_ROOM_NAME })
    .sort({ createdAt: -1 })
    .lean<{ isLive: boolean; isRecording: boolean; title: string; startedAt: Date | null }>();

  const isAdmin = session.user.role === "admin";
  let token: string | null = null;
  let configured = livekitConfigured();

  if (configured && (live?.isLive || isAdmin)) {
    try {
      token = await createLivekitToken({
        identity: session.user.email ?? session.user.name ?? "aluno",
        name: session.user.name ?? "Aluno",
        room: LIVEKIT_ROOM_NAME,
        canPublish: isAdmin,
      });
    } catch {
      configured = false;
    }
  }

  return NextResponse.json({
    isLive: live?.isLive ?? false,
    isRecording: live?.isRecording ?? false,
    title: live?.title ?? "Aula ao vivo",
    startedAt: live?.startedAt ?? null,
    livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL ?? null,
    livekitConfigured: configured,
    token,
    roomName: LIVEKIT_ROOM_NAME,
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();
  const { action, isRecording, title } = body as {
    action: "start" | "stop";
    isRecording?: boolean;
    title?: string;
  };

  let live = await LiveSession.findOne({ roomName: LIVEKIT_ROOM_NAME }).sort({ createdAt: -1 });

  if (action === "start") {
    if (!live || !live.isLive) {
      live = await LiveSession.create({
        title: title || "Aula ao vivo",
        roomName: LIVEKIT_ROOM_NAME,
        isLive: true,
        isRecording: Boolean(isRecording),
        startedAt: new Date(),
        hostEmail: session.user.email,
      });
    } else {
      live.isLive = true;
      live.isRecording = Boolean(isRecording);
      live.startedAt = live.startedAt ?? new Date();
      await live.save();
    }
  } else if (action === "stop") {
    if (live) {
      live.isLive = false;
      live.endedAt = new Date();
      await live.save();
    }
  }

  return NextResponse.json({
    isLive: live?.isLive ?? false,
    isRecording: live?.isRecording ?? false,
  });
}
