import { NextResponse } from "next/server";
import { requireUser } from "@/lib/apiAuth";

/** Áudio curto em francês para a exportação de vídeos da Trilha. */
export async function POST(request: Request) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return NextResponse.json({ error: "Texto inválido." }, { status: 400 });
  }
  if (typeof text !== "string" || !text.trim() || text.length > 120) {
    return NextResponse.json({ error: "A pronúncia deve ter até 120 caracteres." }, { status: 400 });
  }

  const url = new URL("https://translate.google.com/translate_tts");
  url.searchParams.set("ie", "UTF-8");
  url.searchParams.set("client", "tw-ob");
  url.searchParams.set("tl", "fr");
  url.searchParams.set("q", text.trim());

  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: "Não foi possível gerar a pronúncia francesa." }, { status: 502 });
    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "O serviço de pronúncia está indisponível no momento." }, { status: 502 });
  }
}
