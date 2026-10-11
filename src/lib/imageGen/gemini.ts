// Cliente mínimo da API do Gemini (REST, sem SDK). Só servidor.
// Usa a Interactions API, o formato atual da documentação para os modelos "Nano Banana".
// Os nomes dos modelos vêm do ambiente para poderem ser trocados sem alterar o código.

const API_BASE = (process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/, "");

export const imageModel = () => process.env.GEMINI_IMAGE_MODEL || "gemini-nano-banana-2.1";
export const textModel = () => process.env.GEMINI_TEXT_MODEL || "gemini-3.8-flash";
/** Modelo leve para tarefas curtas (revisão da imagem e escolha do objeto do C'est quoi ?). Sem valor, usa o de texto. */
export const reviewModel = () => process.env.GEMINI_REVIEW_MODEL || textModel();

export type GeminiErrorKind = "quota" | "auth" | "model" | "safety" | "network" | "format" | "other";

export class GeminiError extends Error {
  constructor(
    message: string,
    public kind: GeminiErrorKind,
    public status = 0
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

export const isGeminiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

function classify(status: number, json: unknown, raw: string): GeminiError {
  const apiMessage =
    (json as { error?: { message?: string } } | null)?.error?.message?.slice(0, 280) ?? raw.slice(0, 280);
  if (status === 429) {
    return new GeminiError(
      `Cota da IA esgotada (429). Se a mensagem diz "limit: 0", a sua chave não tem cota gratuita para este modelo — confira no Google AI Studio ou use o motor SVG. Detalhe: ${apiMessage}`,
      "quota",
      status
    );
  }
  if (status === 401 || status === 403) {
    return new GeminiError(`Chave da IA recusada (${status}). Confira GEMINI_API_KEY. Detalhe: ${apiMessage}`, "auth", status);
  }
  if (status === 404 || (status === 400 && /model/i.test(apiMessage))) {
    return new GeminiError(
      `Modelo indisponível para esta chave. Ajuste GEMINI_IMAGE_MODEL / GEMINI_TEXT_MODEL. Detalhe: ${apiMessage}`,
      "model",
      status
    );
  }
  return new GeminiError(`Erro da IA (${status}): ${apiMessage}`, "other", status);
}

async function postInteraction(body: Record<string, unknown>, timeoutMs: number): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError("GEMINI_API_KEY não está configurada.", "auth");
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/interactions`, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new GeminiError(
      `Falha de rede ao chamar a IA: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      "network"
    );
  }
  const raw = await response.text();
  let json: unknown = null;
  try {
    json = JSON.parse(raw);
  } catch {
    /* resposta não-JSON */
  }
  if (!response.ok) throw classify(response.status, json, raw);
  return json;
}

// A resposta pode trazer "passos" de raciocínio (thought) com imagens intermediárias: são ignorados.
function walk(node: unknown, visit: (item: Record<string, unknown>) => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  if (!node || typeof node !== "object") return;
  const item = node as Record<string, unknown>;
  if (item.type === "thought") return;
  visit(item);
  Object.values(item).forEach((child) => walk(child, visit));
}

export function extractImage(json: unknown): { data: string; mime: string } | null {
  let found: { data: string; mime: string } | null = null;
  const root = json as { output_image?: { data?: unknown; mime_type?: unknown } } | null;
  if (typeof root?.output_image?.data === "string") {
    found = { data: root.output_image.data, mime: String(root.output_image.mime_type ?? "image/png") };
  }
  walk(json, (item) => {
    if (item.type === "image" && typeof item.data === "string" && item.data.length > 100) {
      found = { data: item.data, mime: String(item.mime_type ?? "image/png") };
    }
    const inline = (item.inlineData ?? item.inline_data) as { data?: unknown; mimeType?: unknown; mime_type?: unknown } | undefined;
    if (inline && typeof inline.data === "string" && inline.data.length > 100) {
      found = { data: inline.data, mime: String(inline.mimeType ?? inline.mime_type ?? "image/png") };
    }
  });
  return found;
}

export function extractText(json: unknown): string {
  const root = json as { output_text?: unknown } | null;
  if (typeof root?.output_text === "string" && root.output_text.trim()) return root.output_text;
  const parts: string[] = [];
  walk(json, (item) => {
    if (typeof item.text === "string" && (item.type === undefined || item.type === "text")) parts.push(item.text);
  });
  return parts.join("\n").trim();
}

/** Gera uma imagem (PNG/JPEG em Buffer). */
export async function generateRaster(
  prompt: string,
  aspectRatio = "3:2",
  references: { buffer: Buffer; mime: string }[] = []
): Promise<Buffer> {
  const input: Record<string, unknown>[] = [{ type: "text", text: prompt }];
  for (const reference of references) {
    input.push({ type: "image", mime_type: reference.mime, data: reference.buffer.toString("base64") });
  }
  const json = await postInteraction(
    {
      model: imageModel(),
      input,
      response_format: { type: "image", aspect_ratio: aspectRatio, image_size: "1K" },
    },
    170_000
  );
  const image = extractImage(json);
  if (!image) {
    const note = extractText(json);
    throw new GeminiError(
      `A IA não devolveu imagem${note ? `: ${note.slice(0, 200)}` : ""}. O pedido pode ter sido bloqueado pelos filtros de segurança.`,
      "safety"
    );
  }
  return Buffer.from(image.data, "base64");
}

/** Chamada de texto (opcionalmente com uma imagem anexada para revisão). */
export async function generateText(
  prompt: string,
  image?: { buffer: Buffer; mime: string },
  model: string = textModel()
): Promise<string> {
  const input: Record<string, unknown>[] = [{ type: "text", text: prompt }];
  if (image) input.push({ type: "image", mime_type: image.mime, data: image.buffer.toString("base64") });
  const json = await postInteraction({ model, input }, 120_000);
  const text = extractText(json);
  if (!text) throw new GeminiError("A IA devolveu uma resposta vazia.", "format");
  return text;
}

/** Extrai o primeiro objeto JSON de uma resposta de texto (tolera ```json e texto extra). */
export function parseJsonLoose<T>(text: string): T {
  const cleaned = text.replace(/```(?:json)?/gi, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new GeminiError("A IA não devolveu JSON válido.", "format");
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    throw new GeminiError("A IA devolveu um JSON malformado.", "format");
  }
}
