import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VideoLesson from "@/models/VideoLesson";
import User from "@/models/User";
import { requireUser } from "@/lib/apiAuth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Faça login para comentar." }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const body = await req.json();
  const content = body.content?.trim();

  if (!content) {
    return NextResponse.json({ error: "O comentário não pode ser vazio." }, { status: 400 });
  }

  const userEmail = session.user.email.toLowerCase().trim();
  const dbUser = await User.findOne({ email: userEmail });

  if (!dbUser) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const newComment = {
    userId: dbUser._id,
    userName: session.user.name || "Aluno(a)",
    userImage: session.user.image || dbUser.image || "",
    userEmail,
    content,
    createdAt: new Date(),
  };

  const video = await VideoLesson.findByIdAndUpdate(
    id,
    { $push: { comments: newComment } },
    { new: true }
  );

  if (!video) {
    return NextResponse.json({ error: "Vídeo não encontrado." }, { status: 404 });
  }

  const createdComment = video.comments[video.comments.length - 1];

  return NextResponse.json(
    {
      _id: String(createdComment._id),
      userId: String(createdComment.userId),
      userName: createdComment.userName,
      userImage: createdComment.userImage,
      userEmail: createdComment.userEmail,
      content: createdComment.content,
      createdAt: createdComment.createdAt.toISOString(),
      canDelete: true,
    },
    { status: 201 }
  );
}
