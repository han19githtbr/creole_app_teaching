import mongoose, { Schema, models, model, type Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  /** Imagem da postagem: ilustração do banco (/ghibli/*.svg) ou upload (Vercel Blob). */
  imageUrl?: string;
  imageAlt?: string;
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
    // Postagens só com imagem podem ter legenda vazia; a API valida "legenda ou imagem".
    content: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPermanent: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Post || model<IPost>("Post", PostSchema);
