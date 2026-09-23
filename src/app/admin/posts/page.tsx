import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { Button } from "@/components/ui/button";
import { PostTable } from "./PostTable";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  const now = Date.now(); // eslint-disable-line react-hooks/purity -- server component, fresh per request (force-dynamic)
  const rows = posts.map((p) => ({
    _id: String(p._id),
    title: p.title,
    isPermanent: p.isPermanent,
    expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
    isPublished: p.isPublished,
    createdAt: p.createdAt.toISOString(),
    expired: Boolean(!p.isPermanent && p.expiresAt && p.expiresAt.getTime() < now),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text)]">Postagens</h1>
        <Link href="/admin/posts/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nova postagem
          </Button>
        </Link>
      </div>
      <PostTable posts={rows} />
    </div>
  );
}
