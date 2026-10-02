import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Lesson from "@/models/Lesson";
import { requireUser } from "@/lib/apiAuth";

function visibleLessons(isAdmin: boolean) {
  return isAdmin ? {} : { isPublished: true, announcedAt: { $ne: null } };
}

async function summary(userEmail: string, isAdmin: boolean) {
  const user = await User.findOne({ email: userEmail.toLowerCase().trim() })
    .select("completedLessons")
    .lean<{ completedLessons?: mongoose.Types.ObjectId[] }>();
  const ids = (user?.completedLessons ?? []).map(String);
  const [total, completed] = await Promise.all([
    Lesson.countDocuments(visibleLessons(isAdmin)),
    ids.length
      ? Lesson.countDocuments({ ...visibleLessons(isAdmin), _id: { $in: ids } })
      : Promise.resolve(0),
  ]);
  return { completedLessonIds: ids, completed, total };
}

export async function GET() {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  await connectDB();
  return NextResponse.json(await summary(session.user.email, session.user.role === "admin"));
}

// Marca/desmarca uma lição como concluída.
export async function POST(req: NextRequest) {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const isAdmin = session.user.role === "admin";

  const { lessonId, completed = true } = (await req.json().catch(() => ({}))) as {
    lessonId?: string;
    completed?: boolean;
  };
  if (!lessonId || !mongoose.isValidObjectId(lessonId)) {
    return NextResponse.json({ error: "Lição inválida." }, { status: 400 });
  }

  await connectDB();
  const lesson = await Lesson.exists({ _id: lessonId, ...visibleLessons(isAdmin) });
  if (!lesson) {
    return NextResponse.json({ error: "Lição não encontrada." }, { status: 404 });
  }

  const email = session.user.email.toLowerCase().trim();
  await User.updateOne(
    { email },
    completed ? { $addToSet: { completedLessons: lessonId } } : { $pull: { completedLessons: lessonId } }
  );

  return NextResponse.json(await summary(email, isAdmin));
}
