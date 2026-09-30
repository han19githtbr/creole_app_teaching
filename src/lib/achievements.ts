// Marcos de progresso (conquistas) e textos de compartilhamento.

export interface Milestone {
  at: number;
  title: string;
  kreyol: string;
  emoji: string;
}

const MILESTONES: Milestone[] = [
  { at: 1, title: "Primeiro passo", kreyol: "Felisitasyon!", emoji: "🌱" },
  { at: 5, title: "Aprendiz dedicado(a)", kreyol: "Bon travay!", emoji: "📘" },
  { at: 10, title: "Ritmo de estudo", kreyol: "Kontinye konsa!", emoji: "🔥" },
  { at: 15, title: "Quase lá", kreyol: "Ou sou bon wout!", emoji: "🚀" },
  { at: 20, title: "Reta final", kreyol: "Bravo!", emoji: "🏅" },
];

export function currentMilestone(completed: number, total: number): Milestone | null {
  if (completed <= 0) return null;
  if (total > 0 && completed >= total) {
    return { at: total, title: "Curso completo!", kreyol: "Felisitasyon!", emoji: "🏆" };
  }
  let found: Milestone | null = null;
  for (const m of MILESTONES) if (completed >= m.at) found = m;
  return found;
}

export function nextMilestoneAt(completed: number, total: number): number | null {
  if (total > 0 && completed >= total) return null;
  const next = MILESTONES.find((m) => m.at > completed && m.at < total);
  return next ? next.at : total || null;
}

export function shareCaption(completed: number, total: number, appUrl?: string) {
  const done = total > 0 && completed >= total;
  const base = done
    ? `🏆 Felisitasyon! Concluí TODAS as ${total} lições de Kreyòl Ayisyen (crioulo haitiano)!`
    : `🎉 Felisitasyon! Já concluí ${completed} de ${total} lições de Kreyòl Ayisyen (crioulo haitiano)! 🇭🇹`;
  return `${base} Vem aprender comigo${appUrl ? `: ${appUrl}` : "."}\n\n#kreyolayisyen #crioulohaitiano #aprendendoidiomas #haiti`;
}
