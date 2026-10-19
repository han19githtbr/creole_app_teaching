import mongoose, { Schema, models, model, type Document } from "mongoose";
import type { GamificationState } from "@/lib/gamification";

export type UserRole = "admin" | "user";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  /** Last time this user viewed the lessons list — used to detect new announced lessons. */
  lastSeenLessonsAt?: Date | null;
  /** Last time this user viewed the posts feed — used to detect new published posts. */
  lastSeenPostsAt?: Date | null;
  /** Last time this user viewed the video lessons — used to detect new videos. */
  lastSeenVideosAt?: Date | null;
  /** Lições concluídas pelo aluno (ids de Lesson) — base das conquistas. */
  completedLessons: mongoose.Types.ObjectId[];
  preferredLanguage?: "kreyol" | "francais";
  gamificationState?: GamificationState;
  gamificationRevision?: number;
  /** Progresso de gamificação do painel em Français (o Kreyòl usa gamificationState). */
  gamificationStateFrancais?: GamificationState;
  gamificationRevisionFrancais?: number;

  /** Monetização e Controle de Tempo Ativo */
  isExemptFromBilling?: boolean;
  freeAccessReason?: string;
  availableMinutes?: number;
  bonusStoriesBalance?: number;
  bonusGamesBalance?: number;
  trialStartedAt?: Date;
  trialExpiresAt?: Date;
  trialStoriesUsed?: number;
  trialGamesUsed?: number;
  totalStoriesTimeSeconds?: number;
  totalCquoiTimeSeconds?: number;
  totalStoriesWatched?: number;
  totalCquoiGamesPlayed?: number;
  lastActiveAt?: Date;

  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    preferredLanguage: { type: String, enum: ["kreyol", "francais"], default: "kreyol" },
    lastSeenLessonsAt: { type: Date, default: null },
    lastSeenPostsAt: { type: Date, default: null },
    lastSeenVideosAt: { type: Date, default: null },
    completedLessons: { type: [Schema.Types.ObjectId], ref: "Lesson", default: [] },
    gamificationState: { type: Schema.Types.Mixed, default: undefined },
    gamificationRevision: { type: Number, default: 0 },
    gamificationStateFrancais: { type: Schema.Types.Mixed, default: undefined },
    gamificationRevisionFrancais: { type: Number, default: 0 },

    // Monetização
    isExemptFromBilling: { type: Boolean, default: false },
    freeAccessReason: { type: String, default: "" },
    availableMinutes: { type: Number, default: 0 },
    bonusStoriesBalance: { type: Number, default: 0 },
    bonusGamesBalance: { type: Number, default: 0 },
    trialStartedAt: { type: Date, default: Date.now },
    trialExpiresAt: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    trialStoriesUsed: { type: Number, default: 0 },
    trialGamesUsed: { type: Number, default: 0 },
    totalStoriesTimeSeconds: { type: Number, default: 0 },
    totalCquoiTimeSeconds: { type: Number, default: 0 },
    totalStoriesWatched: { type: Number, default: 0 },
    totalCquoiGamesPlayed: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.User || model<IUser>("User", UserSchema);
