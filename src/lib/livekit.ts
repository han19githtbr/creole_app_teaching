import { AccessToken } from "livekit-server-sdk";

export const LIVEKIT_ROOM_NAME = "aula-kreyol-principal";

export function livekitConfigured() {
  return Boolean(
    process.env.LIVEKIT_API_KEY &&
      process.env.LIVEKIT_API_SECRET &&
      process.env.NEXT_PUBLIC_LIVEKIT_URL
  );
}

export async function createLivekitToken({
  identity,
  name,
  room,
  canPublish,
}: {
  identity: string;
  name: string;
  room: string;
  canPublish: boolean;
}) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "LIVEKIT_API_KEY e LIVEKIT_API_SECRET não configurados. Veja o README.md."
    );
  }

  const token = new AccessToken(apiKey, apiSecret, { identity, name });
  token.addGrant({
    room,
    roomJoin: true,
    canPublish,
    canSubscribe: true,
    canPublishData: true,
  });

  return token.toJwt();
}
