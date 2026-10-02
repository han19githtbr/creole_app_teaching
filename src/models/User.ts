import mongoose, { Schema, models, model, type Document } from "mongoose";

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
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    lastSeenLessonsAt: { type: Date, default: null },
    lastSeenPostsAt: { type: Date, default: null },
    lastSeenVideosAt: { type: Date, default: null },
    completedLessons: { type: [Schema.Types.ObjectId], ref: "Lesson", default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.User || model<IUser>("User", UserSchema);
