import { VideoUploadForm } from "./VideoUploadForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewVideoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/videos"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar aos vídeos
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">
          Adicionar Vídeo Gravado
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Envie um arquivo de vídeo (MP4/WebM), informe um link externo ou abra o estúdio de gravação.
        </p>
      </div>

      <VideoUploadForm />
    </div>
  );
}
