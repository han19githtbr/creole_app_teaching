// Regras e utilitários da narração das histórias.
// Sem APIs de navegador: é usado tanto no cliente quanto nas rotas da API.

/** Duração mínima da narração, em segundos. */
export const STORY_AUDIO_MIN_SECONDS = 5;
/** Duração máxima da narração, em segundos (10 minutos). */
export const STORY_AUDIO_MAX_SECONDS = 600;
/** Tamanho máximo do arquivo de narração enviado (30 MB). */
export const STORY_AUDIO_MAX_BYTES = 30 * 1024 * 1024;
/** Tamanho máximo do MP4 aceito pelo conversor (a conversão acontece no navegador). */
export const MP4_CONVERTER_MAX_BYTES = 250 * 1024 * 1024;
/** Tolerância, em segundos, entre o fim da última legenda e o fim do áudio. */
export const STORY_TIME_TOLERANCE = 0.5;

/** Tipos MIME aceitos no upload da narração (a mesma lista vale para a API). */
export const STORY_AUDIO_CONTENT_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/aac",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
] as const;

const EXTENSION_TO_TYPE: Record<string, (typeof STORY_AUDIO_CONTENT_TYPES)[number]> = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  webm: "audio/webm",
};

/**
 * Descobre o tipo MIME aceito para um arquivo de narração. Alguns navegadores
 * informam tipos como "audio/x-m4a" ou "audio/x-wav", que a API recusaria;
 * por isso o tipo é normalizado a partir do MIME e, se preciso, da extensão.
 */
export function resolveAudioContentType(file: { name: string; type: string }): string | null {
  const mime = file.type.split(";")[0].trim().toLowerCase();
  if ((STORY_AUDIO_CONTENT_TYPES as readonly string[]).includes(mime)) return mime;
  if (mime === "audio/x-m4a" || mime === "audio/m4a") return "audio/mp4";
  if (mime === "audio/x-wav" || mime === "audio/wave" || mime === "audio/vnd.wave") return "audio/wav";
  if (mime === "audio/mp3") return "audio/mpeg";
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TO_TYPE[extension] ?? null;
}

/** Arquivos MP4 (vídeo) precisam ser convertidos para MP3 antes de virar narração. */
export function isMp4Video(file: { name: string; type: string }): boolean {
  const mime = file.type.split(";")[0].trim().toLowerCase();
  if (mime === "video/mp4") return true;
  return !mime.startsWith("audio/") && /\.(mp4|m4v)$/i.test(file.name);
}

/** mm:ss — a mesma formatação em todas as telas das histórias. */
export function formatStoryTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

/** "2 min 05 s" / "45 s" para mensagens e rótulos. */
export function describeStoryDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  if (!minutes) return `${rest} s`;
  return `${minutes} min ${String(rest).padStart(2, "0")} s`;
}

export const roundTenth = (value: number) => Math.round(value * 10) / 10;

/** Quantos trechos de legenda sugerir para uma narração (≈ 1 trecho por minuto). */
export function suggestedCaptionCount(duration: number): number {
  return Math.min(12, Math.max(1, Math.round(duration / 60)));
}

/** Divide a duração em `count` faixas iguais, com o último fim exatamente no fim do áudio. */
export function evenCaptionSlots(count: number, duration: number): { start: number; end: number }[] {
  const safeCount = Math.max(1, count);
  const total = Math.floor(duration * 10) / 10;
  return Array.from({ length: safeCount }, (_, index) => ({
    start: roundTenth((total / safeCount) * index),
    end: index === safeCount - 1 ? total : roundTenth((total / safeCount) * (index + 1)),
  }));
}
