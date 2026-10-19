import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getMonetizationSettings, calculateUserMonetizationStatus } from "@/lib/monetization";
import { stripe } from "@/lib/stripe";

// Valor mínimo de cobrança do Stripe para BRL: R$ 0,50 (50 centavos).
const STRIPE_MIN_AMOUNT_BRL_CENTS = 50;

// Páginas para onde o aluno pode voltar depois do pagamento (lista fechada, nunca vem livre do cliente).
const RETURN_PATHS: Record<string, string> = {
  stories: "/dashboard/stories",
  game: "/dashboard/jogo",
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { packageId, method = "stripe", returnTo = "stories", simulateInstant = false } = body ?? {};

    if (typeof packageId !== "string" || !packageId) {
      return NextResponse.json({ error: "Pacote inválido." }, { status: 400 });
    }

    await connectDB();
    const settings = await getMonetizationSettings();
    const pkg = settings.packages.find((p) => p.id === packageId);

    if (!pkg) {
      return NextResponse.json({ error: "Pacote não encontrado." }, { status: 404 });
    }

    const email = session.user.email.toLowerCase().trim();

    // Checkout real com Stripe (preço e créditos SEMPRE vêm do servidor, nunca do cliente).
    if (method === "stripe") {
      if (!stripe) {
        return NextResponse.json(
          {
            error: "stripe_not_configured",
            message: "Stripe não configurado no servidor. Defina STRIPE_SECRET_KEY no seu arquivo .env.",
          },
          { status: 400 }
        );
      }

      const unitAmount = Math.round(pkg.priceBRL * 100);
      if (!Number.isFinite(unitAmount) || unitAmount < STRIPE_MIN_AMOUNT_BRL_CENTS) {
        console.error(`[checkout] Pacote ${pkg.id} com preço inválido para o Stripe (${pkg.priceBRL}).`);
        return NextResponse.json(
          { error: "invalid_package_price", message: "Este pacote está com preço inválido. Avise o administrador." },
          { status: 400 }
        );
      }

      const appUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/+$/, "");
      const returnPath = RETURN_PATHS[String(returnTo)] ?? RETURN_PATHS.stories;

      const stripeSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `${pkg.name} — ${pkg.minutes} Minutos`,
                description: `${pkg.minutes} minutos de aprendizado${
                  pkg.bonusStories ? ` + ${pkg.bonusStories} histórias bônus` : ""
                }`,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        locale: "pt-BR",
        customer_email: email,
        client_reference_id: email,
        metadata: {
          email,
          packageId: pkg.id,
          minutes: String(pkg.minutes),
          bonusStories: String(pkg.bonusStories || 0),
        },
        success_url: `${appUrl}${returnPath}?payment=success&pkg=${encodeURIComponent(pkg.id)}`,
        cancel_url: `${appUrl}${returnPath}?payment=canceled`,
      });

      if (!stripeSession.url) {
        return NextResponse.json({ error: "Não foi possível iniciar o checkout." }, { status: 502 });
      }

      return NextResponse.json({ success: true, stripeUrl: stripeSession.url });
    }

    // Liberação instantânea SEM pagamento: existe só para testar a interface localmente.
    // Nunca funciona em produção e exige administrador, para ninguém ganhar minutos de graça.
    if (simulateInstant && process.env.NODE_ENV !== "production") {
      if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
      }

      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          $inc: {
            availableMinutes: pkg.minutes,
            bonusStoriesBalance: pkg.bonusStories || 0,
          },
        },
        { new: true }
      );
      if (!updatedUser) {
        return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
      }

      const status = calculateUserMonetizationStatus(updatedUser, settings);
      return NextResponse.json({
        success: true,
        message: `[DEV] Pacote "${pkg.name}" liberado sem pagamento. +${pkg.minutes} minutos adicionados.`,
        status,
      });
    }

    return NextResponse.json({ error: "Método de pagamento inválido." }, { status: 400 });
  } catch (err) {
    console.error("[checkout] Erro no checkout de minutos:", err);
    return NextResponse.json({ error: "Erro ao processar checkout." }, { status: 500 });
  }
}
