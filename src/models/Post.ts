import mongoose, { Schema, models, model, type Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  isPermanent: boolean;
  expiresAt?: Date | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPermanent: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Post || model<IPost>("Post", PostSchema);
