import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getMonetizationSettings } from "@/lib/monetization";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const settings = await getMonetizationSettings();

  const now = new Date();
  const [
    totalUsers,
    exemptUsersCount,
    activeTrialUsersCount,
    paidBalanceUsersCount,
    usersAgg,
    allUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ $or: [{ isExemptFromBilling: true }, { role: "admin" }] }),
    User.countDocuments({
      role: "user",
      isExemptFromBilling: { $ne: true },
      trialExpiresAt: { $gt: now },
    }),
    User.countDocuments({ availableMinutes: { $gt: 0 } }),
    User.aggregate([
      {
        $group: {
          _id: null,
          totalStoriesSeconds: { $sum: { $ifNull: ["$totalStoriesTimeSeconds", 0] } },
          totalCquoiSeconds: { $sum: { $ifNull: ["$totalCquoiTimeSeconds", 0] } },
          totalStoriesWatched: { $sum: { $ifNull: ["$totalStoriesWatched", 0] } },
          totalCquoiGamesPlayed: { $sum: { $ifNull: ["$totalCquoiGamesPlayed", 0] } },
        },
      },
    ]),
    User.find()
      .select(
        "_id name email image role isExemptFromBilling freeAccessReason availableMinutes bonusStoriesBalance bonusGamesBalance trialExpiresAt trialStoriesUsed trialGamesUsed totalStoriesTimeSeconds totalCquoiTimeSeconds totalStoriesWatched totalCquoiGamesPlayed lastActiveAt createdAt"
      )
      .sort({ lastActiveAt: -1, createdAt: -1 })
      .limit(100)
      .lean(),
  ]);

  const agg = usersAgg[0] || {
    totalStoriesSeconds: 0,
    totalCquoiSeconds: 0,
    totalStoriesWatched: 0,
    totalCquoiGamesPlayed: 0,
  };

  return NextResponse.json({
    stats: {
      totalUsers,
      exemptUsersCount,
      activeTrialUsersCount,
      paidBalanceUsersCount,
      totalStoriesHours: (agg.totalStoriesSeconds / 3600).toFixed(1),
      totalCquoiHours: (agg.totalCquoiSeconds / 3600).toFixed(1),
      totalStoriesWatched: agg.totalStoriesWatched,
      totalCquoiGamesPlayed: agg.totalCquoiGamesPlayed,
    },
    users: allUsers,
    settings,
    serverTime: now.getTime(),
  });
}
