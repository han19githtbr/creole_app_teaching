import { Schema, models, model, type Document } from "mongoose";

export type StripePaymentStatus = "credited" | "user_not_found";

/**
 * Registro de cada Checkout Session do Stripe já processada pelo webhook.
 * O índice único em `sessionId` garante idempotência: o Stripe pode reenviar o mesmo
 * evento (ou enviar `completed` e `async_payment_succeeded` para a mesma sessão), e os
 * minutos só podem ser creditados uma vez por sessão.
 */
export interface IStripePayment extends Document {
  sessionId: string;
  paymentIntentId?: string;
  email: string;
  packageId?: string;
  minutes: number;
  bonusStories: number;
  amountTotal: number; // em centavos
  currency: string;
  status: StripePaymentStatus;
  createdAt: Date;
}

const StripePaymentSchema = new Schema<IStripePayment>(
  {
    sessionId: { type: String, required: true, unique: true },
    paymentIntentId: { type: String },
    email: { type: String, required: true, index: true },
    packageId: { type: String },
    minutes: { type: Number, required: true },
    bonusStories: { type: Number, default: 0 },
    amountTotal: { type: Number, default: 0 },
    currency: { type: String, default: "brl" },
    status: { type: String, enum: ["credited", "user_not_found"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.StripePayment ||
  model<IStripePayment>("StripePayment", StripePaymentSchema);
