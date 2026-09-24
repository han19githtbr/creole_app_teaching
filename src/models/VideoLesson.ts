import mongoose, { Schema, models, model, type Document } from "mongoose";

export interface IVideoComment {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userImage?: string;
  userEmail: string;
  content: string;
  createdAt: Date;
}

export interface IVideoCustomization {
  backgroundStyle: string;
  customBackgroundUrl?: string;
  avatarType: string;
  customAvatarUrl?: string;
  frameStyle: string;
  bannerText?: string;
}

export interface IVideoLesson extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds (up to 600s / 10 min)
  author: mongoose.Types.ObjectId;
  authorName: string;
  isPublished: boolean;
  publishAt?: Date | null;
  isLiveRecording: boolean;
  customization: IVideoCustomization;
  likes: string[]; // array of user emails
  comments: IVideoComment[];
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoCommentSchema = new Schema<IVideoComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
    userEmail: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const VideoCustomizationSchema = new Schema<IVideoCustomization>(
  {
    backgroundStyle: { type: String, default: "haiti_flag" },
    customBackgroundUrl: { type: String, default: "" },
    avatarType: { type: String, default: "webcam" },
    customAvatarUrl: { type: String, default: "" },
    frameStyle: { type: String, default: "rounded" },
    bannerText: { type: String, default: "" },
  },
  { _id: false }
);

const VideoLessonSchema = new Schema<IVideoLesson>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, default: "Professor(a)" },
    isPublished: { type: Boolean, default: true },
    publishAt: { type: Date, default: null },
    isLiveRecording: { type: Boolean, default: false },
    customization: { type: VideoCustomizationSchema, default: () => ({}) },
    likes: { type: [String], default: [] },
    comments: { type: [VideoCommentSchema], default: [] },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.VideoLesson || model<IVideoLesson>("VideoLesson", VideoLessonSchema);
