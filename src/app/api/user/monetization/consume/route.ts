import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { consumeContentUnit } from "@/lib/monetization";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { feature } = body;

    if (feature !== "story" && feature !== "game") {
      return NextResponse.json({ error: "Tipo de conteúdo inválido." }, { status: 400 });
    }

    const result = await consumeContentUnit(session.user.email, feature);
    if (!result.success) {
      return NextResponse.json(result, { status: 402 }); // 402 Payment Required
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[consume] Erro ao consumir conteúdo:", err);
    return NextResponse.json({ error: "Falha interna no servidor." }, { status: 500 });
  }
}
