import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import MonetizationSettings from "@/models/MonetizationSettings";

export async function PUT(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      storyCreditsCost,
      minutesPerCredit,
      gameCreditsCost,
      newStudentTrialDays,
      newStudentTrialStories,
      newStudentTrialGames,
      packages,
    } = body;

    await connectDB();

    const updateData: Record<string, unknown> = {};

    if (typeof storyCreditsCost === "number") updateData.storyCreditsCost = Math.max(1, storyCreditsCost);
    if (typeof minutesPerCredit === "number") updateData.minutesPerCredit = Math.max(1, minutesPerCredit);
    if (typeof gameCreditsCost === "number") updateData.gameCreditsCost = Math.max(1, gameCreditsCost);
    if (typeof newStudentTrialDays === "number") updateData.newStudentTrialDays = Math.max(1, newStudentTrialDays);
    if (typeof newStudentTrialStories === "number") updateData.newStudentTrialStories = Math.max(1, newStudentTrialStories);
    if (typeof newStudentTrialGames === "number") updateData.newStudentTrialGames = Math.max(1, newStudentTrialGames);
    if (Array.isArray(packages)) updateData.packages = packages;

    const updatedSettings = await MonetizationSettings.findOneAndUpdate(
      { key: "default" },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Configurações de monetização atualizadas com sucesso!",
      settings: updatedSettings,
    });
  } catch (err) {
    console.error("[settings] Erro ao atualizar configurações:", err);
    return NextResponse.json({ error: "Erro ao salvar configurações." }, { status: 500 });
  }
}
