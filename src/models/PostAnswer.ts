import mongoose, { Schema, models, model, type Document } from "mongoose";

export type AnswerStatus = "pending" | "correct" | "incorrect";

export interface IPostAnswer extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  /** Resposta do aluno à legenda/pergunta da postagem. */
  text: string;
  /** pending = em análise · correct = certa · incorrect = errada */
  status: AnswerStatus;
  /** Texto do professor (resposta correta, explicação, elogio...). */
  feedback: string;
  reviewedAt?: Date | null;
  /** Quantas vezes o aluno enviou uma resposta nova (tentativas após "incorreta"). */
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostAnswerSchema = new Schema<IPostAnswer>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ["pending", "correct", "incorrect"], default: "pending", index: true },
    feedback: { type: String, default: "", maxlength: 1000 },
    reviewedAt: { type: Date, default: null },
    attempts: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Uma resposta (a mais recente) por aluno em cada postagem.
PostAnswerSchema.index({ post: 1, user: 1 }, { unique: true });

export default models.PostAnswer || model<IPostAnswer>("PostAnswer", PostAnswerSchema);
