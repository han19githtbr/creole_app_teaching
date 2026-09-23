import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import Post from "@/models/Post";
import User from "@/models/User";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, MessageSquare, Users, Plus, Radio } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await connectDB();
  const [totalLessons, activePosts, totalUsers] = await Promise.all([
    Lesson.countDocuments(),
    Post.countDocuments({
      isPublished: true,
      $or: [{ isPermanent: true }, { expiresAt: { $gte: new Date() } }],
    }),
    User.countDocuments(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--text)]">Painel do administrador</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat icon={<BookOpen className="h-5 w-5" />} label="Lições" value={totalLessons} />
        <Stat icon={<MessageSquare className="h-5 w-5" />} label="Postagens ativas" value={activePosts} />
        <Stat icon={<Users className="h-5 w-5" />} label="Usuários cadastrados" value={totalUsers} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-[var(--text)]">Ações rápidas</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickAction href="/admin/lessons/new" icon={<Plus className="h-4 w-4" />} label="Nova lição" />
        <QuickAction href="/admin/posts/new" icon={<Plus className="h-4 w-4" />} label="Nova postagem" />
        <QuickAction href="/admin/live" icon={<Radio className="h-4 w-4" />} label="Iniciar aula ao vivo" />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
          <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-medium text-[var(--text)] shadow-sm hover:border-[var(--accent)]/30"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
        {icon}
      </span>
      {label}
    </Link>
  );
}
