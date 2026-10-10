import mongoose, { Schema, models, model, type Document } from "mongoose";
import type { ImageQuizConfig } from "@/lib/imageQuiz";

export interface IPost extends Document {
  title: string;
  content: string;
  /** Imagem da postagem: ilustração do banco (/ghibli/*.svg) ou upload (Vercel Blob). */
  imageUrl?: string;
  imageAlt?: string;
  imageQuiz?: ImageQuizConfig;
  author: mongoose.Types.ObjectId;
  isPermanent: boolean;
  expiresAt?: Date | null;
  isPublished: boolean;
  announcedAt?: Date | null;
  /** Alunos podem responder à legenda/pergunta (padrão: sim). */
  acceptsAnswers?: boolean;
  language: "kreyol" | "francais";
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
    imageQuiz: {
      options: { type: [String], default: undefined },
      answers: { type: [String], default: undefined },
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    language: { type: String, enum: ["kreyol", "francais"], default: "kreyol", required: true, index: true },
    isPermanent: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: true },
    announcedAt: { type: Date, default: null },
    acceptsAnswers: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Post || model<IPost>("Post", PostSchema);
