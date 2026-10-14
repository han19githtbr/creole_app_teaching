import { Schema, models, model, type Document } from "mongoose";

// Propaganda salva no Estúdio de Propagandas (todos os slides, camadas, cores e legenda).
export interface IAdDesign extends Document {
  name: string;
  language: "kreyol" | "francais";
  format: string;
  slideCount: number;
  /** Miniatura (JPEG pequeno em data URL) para a lista de peças salvas. */
  thumbnail: string;
  /** Design completo (JSON do editor). */
  design: unknown;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdDesignSchema = new Schema<IAdDesign>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    language: { type: String, enum: ["kreyol", "francais"], default: "kreyol", index: true },
    format: { type: String, default: "feed45" },
    slideCount: { type: Number, default: 1 },
    thumbnail: { type: String, default: "" },
    design: { type: Schema.Types.Mixed, required: true },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.AdDesign || model<IAdDesign>("AdDesign", AdDesignSchema);
