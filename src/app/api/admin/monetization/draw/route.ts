import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { drawRandomStudents } from "@/lib/monetization";

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  try {
    const { count = 1, reason = "Sorteio da Plataforma Kreyòl" } = await req.json();

    const result = await drawRandomStudents(Number(count) || 1, reason);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[draw] Erro ao sortear alunos:", err);
    return NextResponse.json({ error: "Erro ao realizar sorteio." }, { status: 500 });
  }
}
