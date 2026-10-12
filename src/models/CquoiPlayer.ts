import mongoose, { Schema, models, model, type Document } from "mongoose";
import type { Level } from "@/lib/cquoiLevels";

/**
 * Jogador do "C'est quoi ?": presença online (batimento a cada ~15 s) e placar do ranking.
 * Uma linha por usuário.
 */
export interface ICquoiPlayer extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  image?: string;
  /** Aparece na lista de jogadores online e pode receber desafios. */
  visible: boolean;
  /** Último batimento: online = batimento nos últimos 45 s. */
  lastSeenAt: Date;
  status: "lobby" | "playing";
  level?: Level;
  liveScore: number;
  liveRound: number;
  liveTotal: number;
  /** Semana do ranking semanal (ex.: 2026-W41, fuso de Brasília). */
  weekKey: string;
  weekPoints: number;
  totalPoints: number;
  gamesPlayed: number;
  /** Melhor pontuação em uma partida, por nível. */
  best: Partial<Record<Level, number>>;
  duelWins: number;
  duelLosses: number;
  lastScoreAt?: Date;
}

const CquoiPlayerSchema = new Schema<ICquoiPlayer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    visible: { type: Boolean, default: true },
    lastSeenAt: { type: Date, default: () => new Date(0), index: true },
    status: { type: String, enum: ["lobby", "playing"], default: "lobby" },
    level: { type: String },
    liveScore: { type: Number, default: 0 },
    liveRound: { type: Number, default: 0 },
    liveTotal: { type: Number, default: 0 },
    weekKey: { type: String, default: "" },
    weekPoints: { type: Number, default: 0, index: true },
    totalPoints: { type: Number, default: 0, index: true },
    gamesPlayed: { type: Number, default: 0 },
    best: { type: Schema.Types.Mixed, default: {} },
    duelWins: { type: Number, default: 0 },
    duelLosses: { type: Number, default: 0 },
    lastScoreAt: { type: Date },
  },
  { timestamps: true, minimize: false }
);

export default models.CquoiPlayer || model<ICquoiPlayer>("CquoiPlayer", CquoiPlayerSchema);
