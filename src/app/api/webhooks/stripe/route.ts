import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripe) {
    console.error("[stripe-webhook] Stripe não configurado (STRIPE_SECRET_KEY ausente).");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET não configurado.");
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[stripe-webhook] Falha na verificação de assinatura:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Evento de pagamento concluído no Stripe Checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const email = metadata.email || session.customer_details?.email || session.customer_email;
    const minutes = Number(metadata.minutes) || 0;
    const bonusStories = Number(metadata.bonusStories) || 0;

    if (email && minutes > 0) {
      await connectDB();
      const updatedUser = await User.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        {
          $inc: {
            availableMinutes: minutes,
            bonusStoriesBalance: bonusStories,
          },
        },
        { new: true }
      );

      console.log(
        `[stripe-webhook] Pagamento confirmado! +${minutes} min e +${bonusStories} histórias bônus para ${email}. Saldo atual: ${updatedUser?.availableMinutes}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
