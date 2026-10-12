import mongoose, { Schema, models, model, type Document } from "mongoose";
import type { GeneratedStatus, ImageEngine, ImageSection } from "@/lib/imageGen/config";

// ---------------------------------------------------------------------------
// Imagem gerada por IA (guardada no Cloudflare R2; aqui ficam só os metadados)
// ---------------------------------------------------------------------------
export interface IGeneratedImage extends Document {
  section: ImageSection;
  language: "kreyol" | "francais";
  themeId: string;
  theme: string;
  engine: ImageEngine;
  title: string;
  caption: string;
  prompt: string;
  /** Caminho no bucket (ex.: gen/natureza-ab12cd.webp). */
  storageKey: string;
  /** Caminho público no app (ex.: /gen/natureza-ab12cd.webp) — reescrito para o R2. */
  src: string;
  mime: string;
  width: number;
  height: number;
  /** Elementos da cena (postagens, histórias e jogo de identificar). */
  elements: { kreyol: string; pt: string }[];
  /** Posição (em %) de cada elemento, na mesma ordem de `elements`. */
  anchors: { left: number; top: number }[];
  quiz?: { options: string[]; answers: string[] };
  /** Dados do jogo C'est quoi ? */
  cquoi?: { fr: string; article: string; name: string; speak: string; w: number; h: number; arrow: { x: number; y: number }; hint?: { d: string; u: string; f?: string } };
  status: GeneratedStatus;
  qa: { checked: boolean; score: number; passed: boolean; issues: string[] };
  aiModel: string;
  jobId?: mongoose.Types.ObjectId;
  genDay: string;
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedImageSchema = new Schema<IGeneratedImage>(
  {
    section: { type: String, enum: ["posts", "stories", "cquoi"], required: true, index: true },
    language: { type: String, enum: ["kreyol", "francais"], required: true },
    themeId: { type: String, required: true },
    theme: { type: String, required: true },
    engine: { type: String, enum: ["image", "svg"], required: true },
    title: { type: String, required: true },
    caption: { type: String, default: "" },
    prompt: { type: String, default: "" },
    storageKey: { type: String, required: true },
    src: { type: String, required: true, unique: true },
    mime: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    elements: { type: [{ _id: false, kreyol: String, pt: String }], default: [] },
    anchors: { type: [{ _id: false, left: Number, top: Number }], default: [] },
    quiz: {
      options: { type: [String], default: undefined },
      answers: { type: [String], default: undefined },
    },
    cquoi: {
      fr: String,
      article: String,
      name: String,
      speak: String,
      w: Number,
      h: Number,
      arrow: { x: Number, y: Number },
      hint: { d: String, u: String, f: String },
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    qa: {
      checked: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      passed: { type: Boolean, default: false },
      issues: { type: [String], default: [] },
    },
    aiModel: { type: String, default: "" },
    jobId: { type: Schema.Types.ObjectId, ref: "ImageGenJob" },
    genDay: { type: String, required: true },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Pedido de geração: "gere N imagens para a parte X" — o robô entrega até 5 por dia.
// ---------------------------------------------------------------------------
export interface IImageGenJob extends Document {
  section: ImageSection;
  /** "all" = o robô alterna entre os temas. */
  themeId: string;
  engine: ImageEngine;
  total: number;
  remaining: number;
  produced: number;
  rejectedByReview: number;
  autoApprove: boolean;
  status: "active" | "paused" | "done" | "cancelled";
  lastError?: string;
  lastRunAt?: Date | null;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageGenJobSchema = new Schema<IImageGenJob>(
  {
    section: { type: String, enum: ["posts", "stories", "cquoi"], required: true },
    themeId: { type: String, default: "all" },
    engine: { type: String, enum: ["image", "svg"], default: "image" },
    total: { type: Number, required: true, min: 1 },
    remaining: { type: Number, required: true, min: 0 },
    produced: { type: Number, default: 0 },
    rejectedByReview: { type: Number, default: 0 },
    autoApprove: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "paused", "done", "cancelled"], default: "active", index: true },
    lastError: { type: String, default: "" },
    lastRunAt: { type: Date, default: null },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Contador diário de chamadas de geração (uma linha por dia; `day` é único).
// ---------------------------------------------------------------------------
export interface IImageGenUsage extends Document {
  day: string;
  calls: number;
}

const ImageGenUsageSchema = new Schema<IImageGenUsage>({
  day: { type: String, required: true, unique: true },
  calls: { type: Number, default: 0 },
});

export const GeneratedImage =
  (models.GeneratedImage as mongoose.Model<IGeneratedImage>) ||
  model<IGeneratedImage>("GeneratedImage", GeneratedImageSchema);
export const ImageGenJob =
  (models.ImageGenJob as mongoose.Model<IImageGenJob>) || model<IImageGenJob>("ImageGenJob", ImageGenJobSchema);
export const ImageGenUsage =
  (models.ImageGenUsage as mongoose.Model<IImageGenUsage>) ||
  model<IImageGenUsage>("ImageGenUsage", ImageGenUsageSchema);
