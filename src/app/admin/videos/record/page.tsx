import { StudioVideoRecorder } from "@/components/StudioVideoRecorder";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AdminRecordVideoPage() {
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
          Estúdio de Gravação de Vídeos
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Grave vídeos curtos de até 10 minutos diretamente pelo navegador. Escolha fundos temáticos, bonequinhos/avatares animados e agende a publicação para seus alunos.
        </p>
      </div>

      <StudioVideoRecorder />
    </div>
  );
}
