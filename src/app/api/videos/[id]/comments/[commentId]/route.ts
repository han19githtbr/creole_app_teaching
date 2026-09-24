import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import { requireUser } from "@/lib/apiAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, commentId } = await params;
  await connectDB();

  const userEmail = session.user.email.toLowerCase().trim();
  const isAdmin = session.user.role === "admin";

  const video = await VideoLesson.findById(id);
  if (!video) {
    return NextResponse.json({ error: "Vídeo não encontrado." }, { status: 404 });
  }

  const comment = video.comments.find(
    (c: { _id?: unknown; userEmail?: string }) => String(c._id) === commentId
  );

  if (!comment) {
    return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
  }

  if (!isAdmin && comment.userEmail !== userEmail) {
    return NextResponse.json(
      { error: "Você só pode excluir seus próprios comentários." },
      { status: 403 }
    );
  }

  video.comments = video.comments.filter(
    (c: { _id?: unknown }) => String(c._id) !== commentId
  );
  await video.save();

  return NextResponse.json({ success: true });
}
