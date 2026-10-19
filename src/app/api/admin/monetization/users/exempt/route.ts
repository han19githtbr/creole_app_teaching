import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  try {
    const { userId, isExempt, reason = "Concedido pelo Administrador" } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "ID de usuário obrigatório." }, { status: 400 });
    }

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isExemptFromBilling: Boolean(isExempt),
          freeAccessReason: isExempt ? reason : "",
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: isExempt
        ? `Acesso gratuito concedido para ${updatedUser.name}!`
        : `Gratuidade removida para ${updatedUser.name}.`,
    });
  } catch (err) {
    console.error("[exempt] Erro ao alterar isenção:", err);
    return NextResponse.json({ error: "Erro ao processar isenção." }, { status: 500 });
  }
}
