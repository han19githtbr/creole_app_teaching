import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { requireUser } from "@/lib/apiAuth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Faça login para curtir o vídeo." }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const userEmail = session.user.email.toLowerCase().trim();
  const video = await VideoLesson.findById(id);

  if (!video) {
    return NextResponse.json({ error: "Vídeo não encontrado." }, { status: 404 });
  }

  const hasLiked = video.likes?.includes(userEmail);

  if (hasLiked) {
    video.likes = video.likes.filter((email: string) => email !== userEmail);
  } else {
    if (!video.likes) video.likes = [];
    video.likes.push(userEmail);
  }

  await video.save();

  return NextResponse.json({
    liked: !hasLiked,
    likesCount: video.likes.length,
  });
}
