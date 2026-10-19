import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { recordActiveHeartbeat } from "@/lib/monetization";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { feature, seconds = 30 } = body;

    if (feature !== "stories" && feature !== "cquoi") {
      return NextResponse.json({ error: "Funcionalidade inválida." }, { status: 400 });
    }

    const updatedStatus = await recordActiveHeartbeat(session.user.email, feature, seconds);
    if (!updatedStatus) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json(updatedStatus);
  } catch (err) {
    console.error("[heartbeat] Erro ao registrar tempo ativo:", err);
    return NextResponse.json({ error: "Falha interna no servidor." }, { status: 500 });
  }
}
