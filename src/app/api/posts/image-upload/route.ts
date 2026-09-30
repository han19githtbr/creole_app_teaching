import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";

// Upload direto (do navegador para o Vercel Blob) de imagens próprias do
// professor para usar em postagens. Só administradores.
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
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          addRandomSuffix: true,
          maximumSizeInBytes: 8 * 1024 * 1024, // 8 MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Imagem de postagem enviada:", blob.url);
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
