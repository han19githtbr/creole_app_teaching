import mongoose, { Schema, models, model, type Document } from "mongoose";
import type { Level } from "@/lib/cquoiLevels";

/**
 * Duelo entre dois jogadores: os dois jogam exatamente as mesmas imagens (`itemIds`)
 * e vence quem fizer mais pontos.
 */
export interface ICquoiChallenge extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  level: Level;
  themeId: string;
  itemIds: string[];
  status: "pending" | "accepted" | "declined" | "finished";
  fromScore?: number;
  toScore?: number;
  /** Id do vencedor; null em caso de empate ou enquanto o duelo não termina. */
  winner?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CquoiChallengeSchema = new Schema<ICquoiChallenge>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    level: { type: String, required: true },
    themeId: { type: String, default: "all" },
    itemIds: { type: [String], required: true },
    status: { type: String, enum: ["pending", "accepted", "declined", "finished"], default: "pending", index: true },
    fromScore: { type: Number },
    toScore: { type: Number },
    winner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  // duelos antigos somem sozinhos depois de 14 dias
  { timestamps: true }
);
CquoiChallengeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 14 * 24 * 3600 });

export default models.CquoiChallenge || model<ICquoiChallenge>("CquoiChallenge", CquoiChallengeSchema);
