import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { STORY_AUDIO_CONTENT_TYPES, STORY_AUDIO_MAX_BYTES } from "@/lib/storyAudio";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await requireAdmin();
        if (!session) throw new Error("Acesso restrito ao administrador.");
        return {
          allowedContentTypes: [...STORY_AUDIO_CONTENT_TYPES],
          addRandomSuffix: true,
          maximumSizeInBytes: STORY_AUDIO_MAX_BYTES,
        };
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro no upload do áudio." }, { status: 400 });
  }
}
