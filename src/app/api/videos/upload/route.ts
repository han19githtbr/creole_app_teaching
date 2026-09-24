import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const ext = file.name.endsWith(".mp4") ? "mp4" : "webm";
    const filename = `video_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
      await mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      return NextResponse.json({
        url: `/uploads/videos/${filename}`,
        size: buffer.length,
        type: file.type,
      });
    } catch (fsError) {
      // In read-only serverless environment (e.g. Vercel ephemeral), fall back to base64 data URI
      console.warn("Filesystem write error, falling back to data URI:", fsError);
      const base64 = buffer.toString("base64");
      const mime = file.type || (ext === "mp4" ? "video/mp4" : "video/webm");
      const dataUri = `data:${mime};base64,${base64}`;

      return NextResponse.json({
        url: dataUri,
        size: buffer.length,
        type: mime,
      });
    }
  } catch (error) {
    console.error("Erro no upload de vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao processar o upload do vídeo." },
      { status: 500 }
    );
  }
}
