import mongoose, { Schema, models, model, type Document } from "mongoose";

/**
 * Situação de publicação de um conto ilustrado. Os contos em si vivem no código
 * (src/lib/tales/tales.ts); aqui só guardamos se o administrador publicou ou escondeu cada um.
 */
export interface ITaleSetting extends Document {
  slug: string;
  isPublished: boolean;
  publishedAt: Date | null;
  updatedByEmail: string;
  updatedAt: Date;
}

const TaleSettingSchema = new Schema<ITaleSetting>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    isPublished: { type: Boolean, required: true, default: false },
    publishedAt: { type: Date, default: null },
    updatedByEmail: { type: String, default: "", lowercase: true, trim: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default (models.TaleSetting as mongoose.Model<ITaleSetting>) ||
  model<ITaleSetting>("TaleSetting", TaleSettingSchema);
