import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import MonetizationSettings from "@/models/MonetizationSettings";

// Valor mínimo de cobrança do Stripe em BRL (R$ 0,50).
const MIN_PACKAGE_PRICE_BRL = 0.5;

type RawPackage = {
  id?: unknown;
  name?: unknown;
  priceBRL?: unknown;
  minutes?: unknown;
  bonusStories?: unknown;
  isPopular?: unknown;
};

/** Valida os pacotes: o preço vira cobrança real no Stripe, então não aceitamos lixo. */
function sanitizePackages(input: unknown[]):
  | { ok: true; packages: { id: string; name: string; priceBRL: number; minutes: number; bonusStories: number; isPopular: boolean }[] }
  | { ok: false; error: string } {
  if (input.length === 0) return { ok: false, error: "Defina ao menos um pacote." };
  if (input.length > 12) return { ok: false, error: "Máximo de 12 pacotes." };

  const seen = new Set<string>();
  const packages = [];
  for (const raw of input as RawPackage[]) {
    const id = typeof raw?.id === "string" ? raw.id.trim() : "";
    const name = typeof raw?.name === "string" ? raw.name.trim() : "";
    const priceBRL = Number(raw?.priceBRL);
    const minutes = Number(raw?.minutes);
    const bonusStories = Number(raw?.bonusStories ?? 0);

    if (!id || !name) return { ok: false, error: "Todo pacote precisa de id e nome." };
    if (seen.has(id)) return { ok: false, error: `Id de pacote duplicado: ${id}.` };
    seen.add(id);
    if (!Number.isFinite(priceBRL) || priceBRL < MIN_PACKAGE_PRICE_BRL || priceBRL > 10000) {
      return { ok: false, error: `Preço inválido em "${name}": o mínimo do Stripe em BRL é R$ 0,50.` };
    }
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 100000) {
      return { ok: false, error: `Minutos inválidos em "${name}".` };
    }
    if (!Number.isFinite(bonusStories) || bonusStories < 0 || bonusStories > 1000) {
      return { ok: false, error: `Histórias bônus inválidas em "${name}".` };
    }

    packages.push({
      id,
      name,
      priceBRL: Math.round(priceBRL * 100) / 100,
      minutes: Math.round(minutes),
      bonusStories: Math.round(bonusStories),
      isPopular: Boolean(raw?.isPopular),
    });
  }
  return { ok: true, packages };
}

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
    if (Array.isArray(packages)) {
      const result = sanitizePackages(packages);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      updateData.packages = result.packages;
    }

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
