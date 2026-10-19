import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getMonetizationSettings, calculateUserMonetizationStatus } from "@/lib/monetization";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { packageId, method = "pix", simulateInstant = false } = body;

    await connectDB();
    const settings = await getMonetizationSettings();
    const pkg = settings.packages.find((p) => p.id === packageId);

    if (!pkg) {
      return NextResponse.json({ error: "Pacote não encontrado." }, { status: 404 });
    }

    // Se for checkout com Stripe (Cartão de Crédito / Pagamento Real):
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

      const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
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
              unit_amount: Math.round(pkg.priceBRL * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: session.user.email,
        metadata: {
          email: session.user.email,
          packageId: pkg.id,
          minutes: String(pkg.minutes),
          bonusStories: String(pkg.bonusStories || 0),
        },
        success_url: `${appUrl}/dashboard/stories?payment=success&pkg=${pkg.id}`,
        cancel_url: `${appUrl}/dashboard/stories?payment=canceled`,
      });

      return NextResponse.json({
        success: true,
        stripeUrl: stripeSession.url,
      });
    }

    // Se for simulação ou confirmação instantânea em ambiente de teste:
    if (simulateInstant) {
      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        {
          $inc: {
            availableMinutes: pkg.minutes,
            bonusStoriesBalance: pkg.bonusStories || 0,
          },
        },
        { new: true }
      );

      const status = calculateUserMonetizationStatus(updatedUser, settings);
      return NextResponse.json({
        success: true,
        message: `Pacote "${pkg.name}" ativado com sucesso! +${pkg.minutes} minutos adicionados.`,
        status,
      });
    }

    // Geração do código PIX Copia-e-Cola (formato padrão EMV/PIX formatado)
    const pixCode = `00020126580014br.gov.bcb.pix0136kreyol-ayisyen-${packageId}-${Date.now()}520400005303986540${pkg.priceBRL.toFixed(
      2
    )}5802BR5915KREYOL PLATAFORMA6009SAO PAULO62070503***6304`;

    return NextResponse.json({
      success: true,
      package: pkg,
      pixCode,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`,
    });
  } catch (err) {
    console.error("[checkout] Erro no checkout de minutos:", err);
    return NextResponse.json({ error: "Erro ao processar checkout." }, { status: 500 });
  }
}
