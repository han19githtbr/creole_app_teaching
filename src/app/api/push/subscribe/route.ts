import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/apiAuth";
import AppPushSubscription from "@/models/AppPushSubscription";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const endpoint = body?.endpoint;
  const p256dh = body?.keys?.p256dh;
  const auth = body?.keys?.auth;
  if (
    typeof endpoint !== "string" ||
    endpoint.length > 2048 ||
    typeof p256dh !== "string" ||
    p256dh.length > 256 ||
    typeof auth !== "string" ||
    auth.length > 256
  ) {
    return NextResponse.json({ error: "Assinatura push inválida." }, { status: 400 });
  }

  const allowedHosts = [
    "fcm.googleapis.com",
    "updates.push.services.mozilla.com",
    "web.push.apple.com",
  ];
  let endpointUrl: URL;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    return NextResponse.json({ error: "Assinatura push inválida." }, { status: 400 });
  }
  const endpointHost = endpointUrl.hostname.toLowerCase();
  const isAllowedHost =
    allowedHosts.includes(endpointHost) ||
    endpointHost.endsWith(".notify.windows.com") ||
    endpointHost.endsWith(".push.services.mozilla.com");
  if (
    endpointUrl.protocol !== "https:" ||
    endpointUrl.username ||
    endpointUrl.password ||
    !isAllowedHost
  ) {
    return NextResponse.json({ error: "Assinatura push inválida." }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email.toLowerCase().trim() }).select("_id");
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  await AppPushSubscription.findOneAndUpdate(
    { endpoint },
    { $set: { userId: user._id, endpoint, keys: { p256dh, auth } } },
    { upsert: true, runValidators: true }
  );

  const { sendPendingContentPush } = await import("@/lib/pushNotifications");
  await sendPendingContentPush(String(user._id), endpoint);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await requireUser();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (typeof body.endpoint !== "string") {
    return NextResponse.json({ error: "Endpoint inválido." }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email.toLowerCase().trim() }).select("_id");
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  await AppPushSubscription.deleteOne({ endpoint: body.endpoint, userId: user._id });
  return NextResponse.json({ success: true });
}
