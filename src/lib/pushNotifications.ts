import webpush from "web-push";
import { connectDB } from "@/lib/mongodb";
import AppPushSubscription from "@/models/AppPushSubscription";
import Lesson from "@/models/Lesson";
import Post from "@/models/Post";
import User from "@/models/User";
import VideoLesson from "@/models/VideoLesson";
import { languageFilter, isAppLanguage, DEFAULT_LANGUAGE, type AppLanguage } from "@/lib/languageShared";

interface PushMessage {
  title: string;
  body: string;
  url: string;
  /** Se informado, só alunos que estudam este idioma recebem o aviso. */
  language?: AppLanguage;
}

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) return false;

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

async function getUnreadCount(user: {
  createdAt?: Date;
  lastSeenLessonsAt?: Date | null;
  lastSeenPostsAt?: Date | null;
  lastSeenVideosAt?: Date | null;
  preferredLanguage?: string;
}) {
  const langMatch = languageFilter(
    isAppLanguage(user.preferredLanguage) ? user.preferredLanguage : DEFAULT_LANGUAGE
  );
  const fallback = user.createdAt ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const [lessons, posts, videos] = await Promise.all([
    Lesson.countDocuments({
      ...langMatch,
      isPublished: true,
      announcedAt: { $ne: null },
      $or: [
        { announcedAt: { $gt: user.lastSeenLessonsAt ?? fallback } },
        { createdAt: { $gt: user.lastSeenLessonsAt ?? fallback } },
      ],
    }),
    Post.countDocuments({
      ...langMatch,
      isPublished: true,
      $and: [
        {
          $or: [
            { announcedAt: { $gt: user.lastSeenPostsAt ?? fallback } },
            { createdAt: { $gt: user.lastSeenPostsAt ?? fallback } },
          ],
        },
        { $or: [{ isPermanent: true }, { expiresAt: { $gte: now } }] },
      ],
    }),
    VideoLesson.countDocuments({
      ...langMatch,
      isPublished: true,
      $and: [
        {
          $or: [
            { announcedAt: { $gt: user.lastSeenVideosAt ?? fallback } },
            { createdAt: { $gt: user.lastSeenVideosAt ?? fallback } },
            { publishAt: { $gt: user.lastSeenVideosAt ?? fallback, $lte: now } },
          ],
        },
        { $or: [{ publishAt: null }, { publishAt: { $lte: now } }] },
      ],
    }),
  ]);

  return lessons + posts + videos;
}

export async function sendPendingContentPush(userId: string, endpoint: string): Promise<void> {
  try {
    if (!configureWebPush()) return;
    await connectDB();

    const [subscription, user] = await Promise.all([
      AppPushSubscription.findOne({ userId, endpoint }).lean(),
      User.findById(userId)
        .select("createdAt lastSeenLessonsAt lastSeenPostsAt lastSeenVideosAt preferredLanguage")
        .lean(),
    ]);
    if (!subscription || !user) return;

    const count = await getUnreadCount(user);
    if (count === 0) return;

    await webpush.sendNotification(
      { endpoint: subscription.endpoint, keys: subscription.keys },
      JSON.stringify({
        title: "Novidades não lidas",
        body: `Você tem ${count} ${count === 1 ? "novidade" : "novidades"} no Kreyòl Ayisyen.`,
        url: "/dashboard",
        count,
      })
    );
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 404 || statusCode === 410) {
      await AppPushSubscription.deleteOne({ userId, endpoint });
      return;
    }
    console.error("Falha ao enviar notificação push pendente:", error);
  }
}

export async function sendContentPush(message: PushMessage): Promise<void> {
  try {
    if (!configureWebPush()) return;
    await connectDB();

    const subscriptions = await AppPushSubscription.find().lean();
    if (subscriptions.length === 0) return;

    const userIds = [...new Set(subscriptions.map((subscription) => String(subscription.userId)))];
    const { language, ...payload } = message;
    const users = await User.find({
      _id: { $in: userIds },
      ...(language ? { preferredLanguage: language === "francais" ? "francais" : { $in: ["kreyol", null] } } : {}),
    })
      .select("createdAt lastSeenLessonsAt lastSeenPostsAt lastSeenVideosAt preferredLanguage")
      .lean();

    await Promise.all(
      users.map(async (user) => {
        const userSubscriptions = subscriptions.filter(
          (subscription) => String(subscription.userId) === String(user._id)
        );
        const count = await getUnreadCount(user);
        await Promise.all(
          userSubscriptions.map(async (subscription) => {
            try {
              await webpush.sendNotification(
                { endpoint: subscription.endpoint, keys: subscription.keys },
                JSON.stringify({ ...payload, count })
              );
            } catch (error) {
              const statusCode = (error as { statusCode?: number }).statusCode;
              if (statusCode === 404 || statusCode === 410) {
                await AppPushSubscription.deleteOne({ _id: subscription._id });
              }
            }
          })
        );
      })
    );
  } catch (error) {
    console.error("Falha ao enviar notificação push:", error);
  }
}
