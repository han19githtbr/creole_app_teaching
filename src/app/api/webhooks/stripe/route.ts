import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import StripePayment from "@/models/StripePayment";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

/**
 * Credita os minutos de uma Checkout Session paga.
 * - Só credita se `payment_status === "paid"` (boleto/métodos assíncronos chegam como "unpaid").
 * - Idempotente: o `session.id` é gravado com índice único antes de creditar; reenvios do Stripe
 *   (ou os eventos `completed` + `async_payment_succeeded` da mesma sessão) não duplicam o saldo.
 * - Se o crédito falhar depois do registro, o registro é removido e o erro propaga (500),
 *   para o Stripe reenviar o evento.
 */
async function creditCheckoutSession(session: Stripe.Checkout.Session): Promise<void> {
  if (session.mode !== "payment") return;

  if (session.payment_status !== "paid") {
    console.log(
      `[stripe-webhook] Sessão ${session.id} ainda não paga (payment_status=${session.payment_status}). Aguardando async_payment_succeeded.`
    );
    return;
  }

  const metadata = session.metadata || {};
  const rawEmail = metadata.email || session.customer_details?.email || session.customer_email;
  const email = rawEmail?.toLowerCase().trim();
  const minutes = Number(metadata.minutes) || 0;
  const bonusStories = Number(metadata.bonusStories) || 0;

  if (!email || minutes <= 0) {
    // Sessão que não veio do nosso checkout (sem metadata do pacote): nada a creditar.
    console.warn(`[stripe-webhook] Sessão ${session.id} sem e-mail/minutos no metadata. Ignorada.`);
    return;
  }

  await connectDB();

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  // 1) Reserva a sessão (índice único = idempotência).
  const reservation = await StripePayment.findOneAndUpdate(
    { sessionId: session.id },
    {
      $setOnInsert: {
        sessionId: session.id,
        paymentIntentId,
        email,
        packageId: metadata.packageId,
        minutes,
        bonusStories,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? "brl",
        status: "credited",
      },
    },
    { upsert: true, new: false } // new:false => retorna null se acabou de inserir
  ).catch((err: { code?: number }) => {
    // Corrida entre duas entregas simultâneas: a outra venceu o índice único.
    if (err?.code === 11000) return "duplicate" as const;
    throw err;
  });

  if (reservation) {
    console.log(`[stripe-webhook] Sessão ${session.id} já processada. Ignorando repetição.`);
    return;
  }

  // 2) Credita o saldo. Se falhar, libera a reserva para o Stripe poder reenviar.
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $inc: { availableMinutes: minutes, bonusStoriesBalance: bonusStories } },
      { new: true }
    );

    if (!updatedUser) {
      // Usuário inexistente não se resolve com retry: marca para conciliação manual.
      await StripePayment.updateOne({ sessionId: session.id }, { $set: { status: "user_not_found" } });
      console.error(
        `[stripe-webhook] ATENÇÃO: pagamento ${session.id} (${paymentIntentId}) de ${email} sem usuário correspondente. Conciliar/estornar manualmente.`
      );
      return;
    }

    console.log(
      `[stripe-webhook] Pagamento confirmado! +${minutes} min e +${bonusStories} histórias bônus para ${email}. Saldo atual: ${updatedUser.availableMinutes}`
    );
  } catch (err) {
    await StripePayment.deleteOne({ sessionId: session.id }).catch(() => {});
    throw err;
  }
}

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

  try {
    switch (event.type) {
      // Cartão: chega já com payment_status "paid". Métodos assíncronos: chega "unpaid" e é ignorado aqui.
      case "checkout.session.completed":
      // Métodos assíncronos (ex.: boleto): o dinheiro só foi confirmado agora.
      case "checkout.session.async_payment_succeeded":
        await creditCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.async_payment_failed": {
        const failed = event.data.object as Stripe.Checkout.Session;
        console.warn(`[stripe-webhook] Pagamento assíncrono falhou na sessão ${failed.id}. Nenhum crédito feito.`);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] Erro ao processar evento", event.id, err);
    // 500 => o Stripe reenvia o evento automaticamente.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
