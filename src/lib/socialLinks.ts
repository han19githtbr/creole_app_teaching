/**
 * Rede social "anotada" no vídeo. O avatar aponta para o ícone dela durante a
 * gravação, e a página do vídeo mostra um botão clicável com o mesmo link.
 */

export type SocialPlatform = "instagram" | "facebook" | "youtube";

export const SOCIAL_PLATFORMS: Record<
  SocialPlatform,
  { id: SocialPlatform; label: string; cta: string; baseUrl: string }
> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    cta: "Siga no Instagram",
    baseUrl: "https://www.instagram.com/",
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    cta: "Siga no Facebook",
    baseUrl: "https://www.facebook.com/",
  },
  youtube: {
    id: "youtube",
    label: "YouTube",
    cta: "Inscreva-se no YouTube",
    baseUrl: "https://www.youtube.com/@",
  },
};

/** Perfil do projeto, usado como valor inicial no gravador. */
export const DEFAULT_SOCIAL_PLATFORM: SocialPlatform = "instagram";
export const DEFAULT_SOCIAL_HANDLE = "frances_com_tres_nativos";

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return typeof value === "string" && value in SOCIAL_PLATFORMS;
}

/**
 * Aceita "@perfil", "perfil" ou uma URL colada e devolve só o nome do perfil,
 * com os caracteres permitidos (letras, números, ponto e sublinhado).
 * O resultado é seguro para montar o link.
 */
export function sanitizeSocialHandle(raw: unknown): string {
  if (typeof raw !== "string") return "";
  let value = raw.trim();
  value = value.replace(/^https?:\/\/(www\.)?[^/]+\//i, "");
  value = value.replace(/^@+/, "");
  value = value.split(/[/?#]/)[0] ?? "";
  value = value.replace(/[^A-Za-z0-9._]/g, "");
  return value.slice(0, 30);
}

export function buildSocialUrl(platform: unknown, handle: unknown): string | null {
  if (!isSocialPlatform(platform)) return null;
  const clean = sanitizeSocialHandle(handle);
  if (!clean) return null;
  return `${SOCIAL_PLATFORMS[platform].baseUrl}${clean}`;
}
