import type { AnswerStatus } from "@/models/PostAnswer";

export const ANSWER_MAX_LENGTH = 1000;

export interface AnswerDTO {
  id: string;
  text: string;
  status: AnswerStatus;
  feedback: string;
  reviewedAt: string | null;
  updatedAt: string;
  attempts: number;
}

export const STATUS_LABEL: Record<AnswerStatus, string> = {
  pending: "Em análise",
  correct: "Correta",
  incorrect: "Incorreta",
};

interface AnswerLike {
  _id: unknown;
  text: string;
  status: AnswerStatus;
  feedback?: string;
  reviewedAt?: Date | string | null;
  updatedAt: Date | string;
  attempts?: number;
}

export function toAnswerDTO(a: AnswerLike): AnswerDTO {
  return {
    id: String(a._id),
    text: a.text,
    status: a.status,
    feedback: a.feedback ?? "",
    reviewedAt: a.reviewedAt ? new Date(a.reviewedAt).toISOString() : null,
    updatedAt: new Date(a.updatedAt).toISOString(),
    attempts: a.attempts ?? 1,
  };
}
