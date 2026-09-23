import { Schema, models, model, type Document } from "mongoose";
import { LESSON_CATEGORIES, type LessonCategory } from "@/lib/lessonCategories";

export { LESSON_CATEGORIES, type LessonCategory };

export interface ILesson extends Document {
  title: string;
  slug: string;
  sectionNumber: number;
  category: LessonCategory;
  content: string;
  order: number;
  isPublished: boolean;
  /**
   * When set, the lesson has been explicitly announced to students and
   * shows up in their dashboard/lessons list with a "new lesson" notice.
   * A published lesson with announcedAt = null is only visible to admins.
   */
  announcedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sectionNumber: { type: Number, required: true },
    category: { type: String, enum: LESSON_CATEGORIES, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: true },
    announcedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Lesson || model<ILesson>("Lesson", LessonSchema);
