import { NextResponse } from "next/server";

// Cache em memória para evitar chamadas repetidas e acelerar o estúdio e a exportação
const audioCache = new Map<string, { buffer: ArrayBuffer; contentType: string }>();

export const dynamic = "force-dynamic";

/**
 * Rota para obter o áudio nativo de pronúncia em francês de qualquer palavra ou frase do jogo.
 * - Cache em memória local + cabeçalhos HTTP de cache imutável (Cache-Control: public, max-age=31536000)
 * - Retorna MP3 com streaming adequado para decodificação Web Audio
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get("text") || "";
    const text = rawText.trim().slice(0, 120);

    if (!text) {
      return NextResponse.json({ error: "Texto para pronúncia não informado." }, { status: 400 });
    }

    const cacheKey = text.toLowerCase();
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return new NextResponse(cached.buffer, {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Audio-Cache": "HIT",
        },
      });
    }

    // Busca o áudio da pronúncia nativa em francês
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=fr-FR&client=tw-ob&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "audio/mpeg, audio/*;q=0.9, */*;q=0.1",
      },
      next: { revalidate: 86400 * 30 }, // cache Next.js por 30 dias
    });

    if (!res.ok) {
      console.warn(`[cquoi/pronounce] Erro upstream ao buscar áudio para "${text}": status ${res.status}`);
      return NextResponse.json(
        { error: `Falha ao obter áudio do serviço de voz (status ${res.status}).` },
        { status: 502 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "audio/mpeg";

    // Guarda no cache em memória
    if (audioCache.size > 500) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, { buffer: arrayBuffer, contentType });

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Audio-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("[cquoi/pronounce] Erro ao processar pronúncia:", err);
    return NextResponse.json({ error: "Erro interno ao sintetizar áudio." }, { status: 500 });
  }
}
