import mongoose, { Schema, models, model, type Document } from "mongoose";
import { STORY_AUDIO_MAX_SECONDS, STORY_TIME_TOLERANCE } from "../lib/storyAudio";

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
  /** Fundo virtual estilo Meet: none | blur | blur_light | theme:<id> | image:<id> */
  virtualBackground?: string;
  customBackgroundUrl?: string;
  avatarType: string;
  customAvatarUrl?: string;
  frameStyle: string;
  bannerText?: string;
}

export interface IVideoStoryCaption {
  start: number;
  end: number;
  kreyol: string;
  portuguese: string;
}

export interface IVideoStoryElementCue {
  kreyol: string;
  /** Segundo da narração em que o elemento da cena entra em destaque. */
  start: number;
}

export interface IVideoStory {
  imageSrc: string;
  theme: string;
  audioUrl: string;
  /** Duração real da narração, em segundos (histórias antigas não têm este campo). */
  audioDuration?: number;
  captions: IVideoStoryCaption[];
  elementCues?: IVideoStoryElementCue[];
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
  announcedAt?: Date | null;
  isLiveRecording: boolean;
  story?: IVideoStory;
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
    virtualBackground: { type: String, default: "" },
    customBackgroundUrl: { type: String, default: "" },
    avatarType: { type: String, default: "webcam" },
    customAvatarUrl: { type: String, default: "" },
    frameStyle: { type: String, default: "rounded" },
    bannerText: { type: String, default: "" },
  },
  { _id: false }
);

const VideoStoryCaptionSchema = new Schema<IVideoStoryCaption>(
  {
    start: { type: Number, required: true, min: 0, max: STORY_AUDIO_MAX_SECONDS + STORY_TIME_TOLERANCE },
    end: { type: Number, required: true, min: 0, max: STORY_AUDIO_MAX_SECONDS + STORY_TIME_TOLERANCE },
    kreyol: { type: String, required: true, trim: true },
    portuguese: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const VideoStoryElementCueSchema = new Schema<IVideoStoryElementCue>(
  {
    kreyol: { type: String, required: true, trim: true },
    start: { type: Number, required: true, min: 0, max: STORY_AUDIO_MAX_SECONDS + STORY_TIME_TOLERANCE },
  },
  { _id: false }
);

const VideoStorySchema = new Schema<IVideoStory>(
  {
    imageSrc: { type: String, required: true },
    theme: { type: String, required: true },
    audioUrl: { type: String, required: true },
    audioDuration: { type: Number, min: 0 },
    captions: { type: [VideoStoryCaptionSchema], default: [] },
    elementCues: { type: [VideoStoryElementCueSchema], default: [] },
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
    announcedAt: { type: Date, default: null },
    isLiveRecording: { type: Boolean, default: false },
    story: { type: VideoStorySchema, default: undefined },
    customization: { type: VideoCustomizationSchema, default: () => ({}) },
    likes: { type: [String], default: [] },
    comments: { type: [VideoCommentSchema], default: [] },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.VideoLesson || model<IVideoLesson>("VideoLesson", VideoLessonSchema);
