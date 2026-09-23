import { Schema, models, model, type Document } from "mongoose";

export interface ILiveSession extends Document {
  title: string;
  roomName: string;
  isLive: boolean;
  isRecording: boolean;
  startedAt?: Date | null;
  endedAt?: Date | null;
  recordingUrl?: string | null;
  hostEmail: string;
  createdAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    title: { type: String, required: true, default: "Aula ao vivo" },
    roomName: { type: String, required: true },
    isLive: { type: Boolean, default: false },
    isRecording: { type: Boolean, default: false },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    recordingUrl: { type: String, default: null },
    hostEmail: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.LiveSession ||
  model<ILiveSession>("LiveSession", LiveSessionSchema);
