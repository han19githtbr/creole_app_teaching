import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await requireAdmin();
        if (!session) {
          throw new Error("Acesso restrito ao administrador.");
        }

        return {
          // Wildcard: o MediaRecorder do navegador manda o tipo completo
          // (ex: "video/webm;codecs=vp9,opus"), e o Vercel Blob exige
          // correspondência exata em allowedContentTypes — então usamos
          // "video/*" em vez de listar cada combinação de codec.
          allowedContentTypes: ["video/*"],
          addRandomSuffix: true,
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload concluído:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro no upload." },
      { status: 400 }
    );
  }
}
