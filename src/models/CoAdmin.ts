import mongoose, { Schema, models, model, type Document } from "mongoose";

/**
 * Administrador adicional, autorizado pelo administrador principal
 * (conta definida em ADMIN_EMAIL). Guardamos só o e-mail: assim o acesso
 * já vale no primeiro login da pessoa, sem precisar de cadastro prévio.
 */
export interface ICoAdmin extends Document {
  email: string;
  addedByEmail: string;
  createdAt: Date;
}

const CoAdminSchema = new Schema<ICoAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    addedByEmail: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default (models.CoAdmin as mongoose.Model<ICoAdmin>) ||
  model<ICoAdmin>("CoAdmin", CoAdminSchema);
