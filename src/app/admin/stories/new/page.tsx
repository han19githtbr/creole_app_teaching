import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StoryForm } from "../StoryForm";

export default function NewStoryPage() {
  return <div className="space-y-5"><Link href="/admin/stories" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)]"><ChevronLeft className="h-4 w-4" /> Histórias</Link><header><h1 className="text-2xl font-bold text-[var(--text)]">Criar história</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Escolha uma cena, adicione narração e sincronize a tradução.</p></header><StoryForm /></div>;
}
