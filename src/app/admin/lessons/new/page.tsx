import { LessonForm } from "../LessonForm";

export default function NewLessonPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--text)]">Nova lição</h1>
      <LessonForm />
    </div>
  );
}
