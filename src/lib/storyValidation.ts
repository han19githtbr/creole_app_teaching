// Validação única do conteúdo de uma história, usada pelas rotas POST e PUT.
import { getBankImage } from "@/lib/imageBank";
import {
  STORY_AUDIO_MAX_SECONDS,
  STORY_AUDIO_MIN_SECONDS,
  STORY_TIME_TOLERANCE,
  describeStoryDuration,
} from "@/lib/storyAudio";
import type { IVideoStory } from "@/models/VideoLesson";

type Result = { ok: false; error: string } | { ok: true; story: IVideoStory };

const isAudioUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
};

export function validateStory(input: unknown): Result {
  if (!input || typeof input !== "object") return { ok: false, error: "Defina a cena, o áudio e as legendas da história." };
  const value = input as Record<string, unknown>;

  const image = typeof value.imageSrc === "string" ? getBankImage(value.imageSrc) : undefined;
  if (!image || image.src !== value.imageSrc) return { ok: false, error: "Selecione uma imagem válida do banco Ghibli." };
  if (!isAudioUrl(value.audioUrl)) return { ok: false, error: "Envie uma narração de áudio válida." };

  const audioDuration = Number(value.audioDuration);
  if (!Number.isFinite(audioDuration) || audioDuration < STORY_AUDIO_MIN_SECONDS - STORY_TIME_TOLERANCE || audioDuration > STORY_AUDIO_MAX_SECONDS + STORY_TIME_TOLERANCE) {
    return { ok: false, error: `A narração precisa ter entre ${describeStoryDuration(STORY_AUDIO_MIN_SECONDS)} e ${describeStoryDuration(STORY_AUDIO_MAX_SECONDS)}.` };
  }

  if (!Array.isArray(value.captions) || value.captions.length === 0) {
    return { ok: false, error: "Adicione pelo menos uma legenda em Kreyòl e português." };
  }
  const captions: IVideoStory["captions"] = [];
  let previousEnd = 0;
  for (const item of value.captions) {
    if (!item || typeof item !== "object") return { ok: false, error: "Revise os trechos de legenda." };
    const caption = item as Record<string, unknown>;
    const start = Number(caption.start);
    const end = Number(caption.end);
    if (
      !Number.isFinite(start) || !Number.isFinite(end) || start < previousEnd || end <= start ||
      end > audioDuration + STORY_TIME_TOLERANCE ||
      typeof caption.kreyol !== "string" || !caption.kreyol.trim() ||
      typeof caption.portuguese !== "string" || !caption.portuguese.trim()
    ) {
      return { ok: false, error: "As legendas precisam estar em ordem, preenchidas e dentro da duração da narração." };
    }
    captions.push({ start, end, kreyol: caption.kreyol.trim(), portuguese: caption.portuguese.trim() });
    previousEnd = end;
  }

  const elementCues: NonNullable<IVideoStory["elementCues"]> = [];
  if (value.elementCues !== undefined && value.elementCues !== null) {
    if (!Array.isArray(value.elementCues) || value.elementCues.length > image.elements.length) {
      return { ok: false, error: "Revise os momentos dos elementos da cena." };
    }
    for (const item of value.elementCues) {
      const cue = (item ?? {}) as Record<string, unknown>;
      const start = Number(cue.start);
      const known = typeof cue.kreyol === "string" && image.elements.some((element) => element.kreyol === cue.kreyol);
      if (!known || !Number.isFinite(start) || start < 0 || start > audioDuration + STORY_TIME_TOLERANCE) {
        return { ok: false, error: "Cada elemento da cena precisa entrar dentro da duração da narração." };
      }
      elementCues.push({ kreyol: cue.kreyol as string, start });
    }
  }

  return {
    ok: true,
    story: {
      imageSrc: image.src,
      theme: image.theme,
      audioUrl: value.audioUrl,
      audioDuration,
      captions,
      elementCues,
    },
  };
}
