// Idioma ativo do aplicativo: "kreyol" (Crioulo Haitiano) ou "francais" (Francês).
// O idioma escolhido na tela de login fica no cookie `app_language` e é
// gravado também no usuário (preferredLanguage). Todo conteúdo (lições,
// postagens, vídeos, histórias) é filtrado por este idioma.
export type AppLanguage = "kreyol" | "francais";

export const LANGUAGE_COOKIE = "app_language";
export const DEFAULT_LANGUAGE: AppLanguage = "kreyol";

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === "kreyol" || value === "francais";
}

export const LANGUAGE_META: Record<
  AppLanguage,
  {
    label: string;
    flag: string;
    brand: string;
    greeting: string;
    tagline: string;
    lessonsTitle: string;
    videosTitle: string;
    storiesTitle: string;
    gameTitle: string;
  }
> = {
  kreyol: {
    label: "Kreyòl Ayisyen",
    flag: "🇭🇹",
    brand: "Kreyòl Ayisyen",
    greeting: "Bon jou",
    tagline: "Continue seu progresso em Kreyòl Ayisyen.",
    lessonsTitle: "Lições de Kreyòl Ayisyen",
    videosTitle: "Aulas em vídeo de Kreyòl",
    storiesTitle: "Histórias em Kreyòl",
    gameTitle: "Jogo das Imagens",
  },
  francais: {
    label: "Français",
    flag: "🇫🇷",
    brand: "Français",
    greeting: "Bonjour",
    tagline: "Continue seu progresso em Francês.",
    lessonsTitle: "Lições de Francês",
    videosTitle: "Aulas em vídeo de Francês",
    storiesTitle: "Histórias em Francês",
    gameTitle: "C'est quoi ?",
  },
};

/**
 * Filtro Mongo por idioma. Documentos antigos (criados antes da separação)
 * não têm o campo `language` e contam como Crioulo.
 */
export function languageFilter(language: AppLanguage): Record<string, unknown> {
  return language === "francais"
    ? { language: "francais" }
    : { language: { $in: ["kreyol", null] } };
}
