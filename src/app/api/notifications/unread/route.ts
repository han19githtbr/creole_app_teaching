import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/apiAuth";
import User from "@/models/User";
import Lesson from "@/models/Lesson";
import Post from "@/models/Post";
import VideoLesson from "@/models/VideoLesson";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email.toLowerCase().trim() })
    .select("lastSeenLessonsAt lastSeenPostsAt lastSeenVideosAt createdAt")
    .lean<{
      lastSeenLessonsAt?: Date | null;
      lastSeenPostsAt?: Date | null;
      lastSeenVideosAt?: Date | null;
      createdAt?: Date;
    }>();

  const now = new Date();
  const defaultFallbackDate = user?.createdAt
    ? new Date(user.createdAt)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const lessonsThreshold = user?.lastSeenLessonsAt ?? defaultFallbackDate;
  const postsThreshold = user?.lastSeenPostsAt ?? defaultFallbackDate;
  const videosThreshold = user?.lastSeenVideosAt ?? defaultFallbackDate;

  const lessonFilter = {
      isPublished: true,
      announcedAt: { $ne: null },
      $or: [
        { announcedAt: { $gt: lessonsThreshold } },
        { createdAt: { $gt: lessonsThreshold } },
      ],
    };
  const postFilter = {
    isPublished: true,
    $and: [
      {
        $or: [
          { announcedAt: { $gt: postsThreshold } },
          { createdAt: { $gt: postsThreshold } },
        ],
      },
      { $or: [{ isPermanent: true }, { expiresAt: { $gte: now } }] },
    ],
  };
  const videoFilter = {
    story: { $exists: false },
    isPublished: true,
    $and: [
      {
        $or: [
          { announcedAt: { $gt: videosThreshold } },
          { createdAt: { $gt: videosThreshold } },
          { publishAt: { $gt: videosThreshold, $lte: now } },
        ],
      },
      { $or: [{ publishAt: null }, { publishAt: { $lte: now } }] },
    ],
  };

  const [unreadLessons, unreadPosts, unreadVideos, lessonCount, postCount, videoCount] = await Promise.all([
    Lesson.find(lessonFilter)
      .sort({ announcedAt: -1, createdAt: -1 })
      .limit(10)
      .select("title slug sectionNumber category createdAt announcedAt")
      .lean(),
    Post.find(postFilter)
      .sort({ announcedAt: -1, createdAt: -1 })
      .limit(10)
      .select("title imageUrl createdAt announcedAt isPermanent expiresAt")
      .lean(),

    VideoLesson.find(videoFilter)
      .sort({ announcedAt: -1, publishAt: -1, createdAt: -1 })
      .limit(10)
      .select("title duration createdAt announcedAt authorName")
      .lean(),
      Lesson.countDocuments(lessonFilter),
      Post.countDocuments(postFilter),
      VideoLesson.countDocuments(videoFilter),
  ]);

      const count = lessonCount + postCount + videoCount;

  return NextResponse.json({
    count,
    lessons: unreadLessons.map((l) => ({
      id: String(l._id),
      title: l.title,
      slug: l.slug,
      sectionNumber: l.sectionNumber,
      category: l.category,
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : null,
      announcedAt: l.announcedAt ? new Date(l.announcedAt).toISOString() : null,
    })),
    posts: unreadPosts.map((p) => ({
      id: String(p._id),
      title: p.title,
      imageUrl: p.imageUrl || null,
      createdAt: p.announcedAt
        ? new Date(p.announcedAt).toISOString()
        : p.createdAt
          ? new Date(p.createdAt).toISOString()
          : null,
    })),
    videos: unreadVideos.map((v) => ({
      id: String(v._id),
      title: v.title,
      duration: v.duration || 0,
      authorName: v.authorName || "Professor",
      createdAt: v.announcedAt
        ? new Date(v.announcedAt).toISOString()
        : v.publishAt && new Date(v.publishAt) > videosThreshold
          ? new Date(v.publishAt).toISOString()
          : v.createdAt
            ? new Date(v.createdAt).toISOString()
            : null,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();
  const body = (await req.json().catch(() => ({}))) as {
    type?: "all" | "lessons" | "posts" | "videos";
  };
  const type = body.type || "all";
  if (!["all", "lessons", "posts", "videos"].includes(type)) {
    return NextResponse.json({ error: "Tipo de notificação inválido." }, { status: 400 });
  }
  const now = new Date();
  const email = session.user.email.toLowerCase().trim();

  const updateFields: Record<string, Date> = {};
  if (type === "all" || type === "lessons") {
    updateFields.lastSeenLessonsAt = now;
  }
  if (type === "all" || type === "posts") {
    updateFields.lastSeenPostsAt = now;
  }
  if (type === "all" || type === "videos") {
    updateFields.lastSeenVideosAt = now;
  }

  await User.updateOne({ email }, { $set: updateFields });

  return NextResponse.json({ success: true, updated: Object.keys(updateFields) });
}
