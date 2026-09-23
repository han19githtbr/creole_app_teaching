import { PostForm } from "../PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--text)]">Nova postagem</h1>
      <PostForm />
    </div>
  );
}
