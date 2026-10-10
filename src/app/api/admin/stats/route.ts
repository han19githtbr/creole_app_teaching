import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import Post from "@/models/Post";
import User from "@/models/User";
import VideoLesson from "@/models/VideoLesson";
import { requireAdmin } from "@/lib/apiAuth";
import { getAppLanguage, languageFilter, LANGUAGE_META } from "@/lib/language";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const langMatch = languageFilter(await getAppLanguage());

  const [totalLessons, activePosts, totalUsers, totalVideos] = await Promise.all([
    Lesson.countDocuments(langMatch),
    Post.countDocuments({
      ...langMatch,
      isPublished: true,
      $or: [{ isPermanent: true }, { expiresAt: { $gte: new Date() } }],
    }),
    User.countDocuments(),
    VideoLesson.countDocuments(langMatch),
  ]);

  return NextResponse.json({ totalLessons, activePosts, totalUsers, totalVideos });
}
