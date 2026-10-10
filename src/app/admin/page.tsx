import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import Post from "@/models/Post";
import User from "@/models/User";
import VideoLesson from "@/models/VideoLesson";
import PostAnswer from "@/models/PostAnswer";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, MessageSquare, Users, Plus, Radio, Video, Camera } from "lucide-react";
import { getAppLanguage, languageFilter, LANGUAGE_META } from "@/lib/language";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await connectDB();
  const language = await getAppLanguage();
  const langMatch = languageFilter(language);
  const [totalLessons, totalVideos, activePosts, totalUsers, pendingAnswers] = await Promise.all([
    Lesson.countDocuments(langMatch),
    VideoLesson.countDocuments(langMatch),
    Post.countDocuments({
      ...langMatch,
      isPublished: true,
      $or: [{ isPermanent: true }, { expiresAt: { $gte: new Date() } }],
    }),
    User.countDocuments(),
    PostAnswer.countDocuments({ status: "pending" }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">
          Painel do Administrador · {LANGUAGE_META[language].flag} {LANGUAGE_META[language].label}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Visão geral do conteúdo, aulas gravadas, lições e estatísticas da plataforma.
        </p>
      </div>

      {pendingAnswers > 0 && (
        <Link
          href="/admin/answers"
          className="flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30"
        >
          <span className="font-medium text-amber-900 dark:text-amber-200">
            ⏳ {pendingAnswers} {pendingAnswers === 1 ? "resposta aguardando" : "respostas aguardando"} sua correção
          </span>
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Corrigir agora →</span>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<BookOpen className="h-5 w-5" />} label="Lições" value={totalLessons} />
        <Stat icon={<Video className="h-5 w-5" />} label="Vídeos gravados" value={totalVideos} />
        <Stat icon={<MessageSquare className="h-5 w-5" />} label="Postagens ativas" value={activePosts} />
        <Stat icon={<Users className="h-5 w-5" />} label="Usuários cadastrados" value={totalUsers} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Ações rápidas</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/admin/videos/record"
            icon={<Camera className="h-4 w-4" />}
            label="Gravar novo vídeo"
            highlight
          />
          <QuickAction href="/admin/lessons/new" icon={<Plus className="h-4 w-4" />} label="Nova lição" />
          <QuickAction href="/admin/posts/new" icon={<Plus className="h-4 w-4" />} label="Nova postagem" />
          <QuickAction href="/admin/live" icon={<Radio className="h-4 w-4" />} label="Iniciar aula ao vivo" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-white shadow-sm [&_svg]:stroke-[2.5]">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
          <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon,
  label,
  highlight = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-red-300 bg-gradient-to-br from-red-50 to-[var(--surface)] text-red-700 dark:border-red-900/40 dark:from-red-950/20 dark:text-red-400"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]/40"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm ${
          highlight ? "bg-[#dc2626]" : "bg-[var(--accent)]"
        }`}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}
