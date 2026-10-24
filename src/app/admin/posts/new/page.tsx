import { PostForm } from "../PostForm";
import { getAppLanguage } from "@/lib/language";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const language = await getAppLanguage();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--text)]">Nova postagem</h1>
      <PostForm language={language} />
    </div>
  );
}
