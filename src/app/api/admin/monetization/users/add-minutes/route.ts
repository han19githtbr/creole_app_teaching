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
    const { userId, minutes = 0, bonusStories = 0 } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "ID de usuário obrigatório." }, { status: 400 });
    }

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          availableMinutes: Number(minutes) || 0,
          bonusStoriesBalance: Number(bonusStories) || 0,
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
      message: `Adicionados ${minutes} min e ${bonusStories} histórias bônus para ${updatedUser.name}!`,
    });
  } catch (err) {
    console.error("[add-minutes] Erro ao adicionar minutos:", err);
    return NextResponse.json({ error: "Erro ao adicionar minutos." }, { status: 500 });
  }
}
