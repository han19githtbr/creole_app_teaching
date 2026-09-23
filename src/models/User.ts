import { Schema, models, model, type Document } from "mongoose";

export type UserRole = "admin" | "user";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  /** Last time this user viewed the lessons list — used to detect new announced lessons. */
  lastSeenLessonsAt?: Date | null;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    lastSeenLessonsAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.User || model<IUser>("User", UserSchema);
