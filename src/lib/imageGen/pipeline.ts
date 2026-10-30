// Pipeline de geração: planeja → desenha (IA) → revisa (IA com visão) → guarda no R2 → cadastra no banco.
// Regra de ouro: no máximo IMAGE_GEN_DAILY_LIMIT chamadas de geração por dia (padrão 5), somando cron e botão manual.
import crypto from "node:crypto";
import sharp from "sharp";
import { connectDB } from "@/lib/mongodb";
import { isR2Configured, r2Delete, r2Put } from "@/lib/r2";
import cquoiItems from "@/lib/cquoiItems.json";
import { GeneratedImage, ImageGenJob, ImageGenUsage, type IImageGenJob } from "@/models/ImageGen";
import {
  IMAGE_GEN_AUTO_APPROVE_SCORE,
  IMAGE_GEN_DAILY_LIMIT,
  IMAGE_GEN_MIN_SCORE,
  IMAGE_GEN_MIN_THEME_FIT,
  THEMES,
  getTheme,
  saoPauloDay,
  type ImageEngine,
} from "@/lib/imageGen/config";
import {
  GeminiError,
  generateRaster,
  generateText,
  imageModel,
  isGeminiConfigured,
  parseJsonLoose,
  reviewModel,
  textModel,
} from "@/lib/imageGen/gemini";
import {
  REFERENCE_NOTE,
  SLOTS,
  cquoiPrompt,
  cquoiProposalPrompt,
  cquoiSvgPrompt,
  pick,
  planScene,
  shuffle,
  reviewPrompt,
  scenePrompt,
  svgScenePrompt,
  type CquoiProposal,
} from "@/lib/imageGen/prompts";
import { extractSvg, fetchReferenceSvg, loadReferenceImages, sanitizeSvg } from "@/lib/imageGen/svg";
import { IMAGE_BANK, getElementLabel } from "@/lib/imageBank";

// ---------------------------------------------------------------------------
// Cota diária
// ---------------------------------------------------------------------------
async function reserveCall(day: string, force = false): Promise<boolean> {
  try {
    const filter = force ? { day } : { day, calls: { $lt: IMAGE_GEN_DAILY_LIMIT } };
    const doc = await ImageGenUsage.findOneAndUpdate(
      filter,
      { $inc: { calls: 1 } },
      { upsert: true, returnDocument: "after" }
    );
    return Boolean(doc);
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      if (force) {
        const doc = await ImageGenUsage.findOneAndUpdate(
          { day },
          { $inc: { calls: 1 } },
          { returnDocument: "after" }
        );
        return Boolean(doc);
      }
      return false;
    }
    throw error;
  }
}

async function refundCall(day: string): Promise<void> {
  await ImageGenUsage.updateOne({ day, calls: { $gt: 0 } }, { $inc: { calls: -1 } });
}

export async function resetUsage(day = saoPauloDay()): Promise<void> {
  await ImageGenUsage.updateOne({ day }, { $set: { calls: 0 } }, { upsert: true });
}

export async function getUsage() {
  const day = saoPauloDay();
  const doc = await ImageGenUsage.findOne({ day }).lean();
  const calls = doc?.calls ?? 0;
  return { day, calls, limit: IMAGE_GEN_DAILY_LIMIT, left: Math.max(0, IMAGE_GEN_DAILY_LIMIT - calls) };
}

// ---------------------------------------------------------------------------
// Desenho
// ---------------------------------------------------------------------------
interface Drawn {
  stored: Buffer;
  mime: string;
  ext: string;
  preview: Buffer;
  width: number;
  height: number;
}

async function drawRaster(prompt: string, width: number, height: number, referencePaths: string[] = []): Promise<Drawn> {
  const references = await loadReferenceImages(referencePaths, 2);
  const finalPrompt = references.length ? `${prompt}\n${REFERENCE_NOTE}` : prompt;
  const raw = await generateRaster(finalPrompt, "3:2", references);
  const stored = await sharp(raw).resize(width, height, { fit: "cover", position: "centre" }).webp({ quality: 84 }).toBuffer();
  const preview = await sharp(stored).png().toBuffer();
  return { stored, mime: "image/webp", ext: "webp", preview, width, height };
}

async function drawSvg(prompt: string, width: number, height: number): Promise<Drawn> {
  const text = await generateText(prompt);
  const raw = extractSvg(text);
  if (!raw) throw new GeminiError("O modelo não devolveu um SVG completo (a resposta pode ter sido cortada).", "format");
  let clean: string;
  try {
    clean = sanitizeSvg(raw, width, height);
  } catch (error) {
    throw new GeminiError(error instanceof Error ? error.message : "SVG inválido.", "format");
  }
  let preview: Buffer;
  try {
    preview = await sharp(Buffer.from(clean), { density: 96 }).resize(width, height).png().toBuffer();
  } catch {
    throw new GeminiError("O SVG gerado não pôde ser renderizado.", "format");
  }
  return { stored: Buffer.from(clean), mime: "image/svg+xml", ext: "svg", preview, width, height };
}

// ---------------------------------------------------------------------------
// Revisão automática (visão): confere objetos/estilo e descobre onde cada objeto está
// ---------------------------------------------------------------------------
interface ReviewJson {
  score?: number;
  theme_fit?: number;
  off_theme_items?: string[];
  has_text_or_watermark?: boolean;
  objects?: { name?: string; visible?: boolean; box_2d?: number[] | null }[];
  issues?: string[];
}

interface Review {
  checked: boolean;
  score: number;
  passed: boolean;
  issues: string[];
  /** Centro de cada objeto esperado, em % da imagem (null = não localizado). */
  points: ({ left: number; top: number } | null)[];
}

async function reviewImage(preview: Buffer, expected: string[], engine: ImageEngine = "image", themeLabel?: string): Promise<Review> {
  try {
    const jpeg = await sharp(preview)
      .flatten({ background: "#ffffff" })
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    const text = await generateText(reviewPrompt(expected, engine, themeLabel), { buffer: jpeg, mime: "image/jpeg" }, reviewModel());
    const data = parseJsonLoose<ReviewJson>(text);
    const listed = Array.isArray(data.objects) ? data.objects : [];
    const issues = Array.isArray(data.issues) ? data.issues.filter((item): item is string => typeof item === "string").slice(0, 8) : [];
    let allVisible = true;
    const points = expected.map((name, index) => {
      const entry =
        listed.find((item) => {
          const iname = item.name?.toLowerCase().trim();
          const ename = name.toLowerCase().trim();
          return iname && (iname === ename || iname.includes(ename) || ename.includes(iname));
        }) ?? listed[index];
      const box = entry?.box_2d;
      if (!entry || entry.visible === false || !Array.isArray(box) || box.length !== 4 || box.some((n) => typeof n !== "number")) {
        allVisible = false;
        return null;
      }
      const [ymin, xmin, ymax, xmax] = box;
      const clamp = (value: number) => Math.min(92, Math.max(8, Math.round(value)));
      return { left: clamp((xmin + xmax) / 20), top: clamp((ymin + ymax) / 20) };
    });
    const score = Math.min(10, Math.max(0, Number(data.score) || 0));
    if (!allVisible) issues.push("Algum elemento obrigatório não ficou claramente visível.");
    if (data.has_text_or_watermark) issues.push("A imagem contém texto, letras ou marca d'água.");
    // Aderência ao tema: a cena inteira precisa ser do tema (nota mínima 7) e não pode ter itens claramente fora dele
    const themeFit = typeof data.theme_fit === "number" ? Math.min(10, Math.max(0, data.theme_fit)) : null;
    const offTheme = Array.isArray(data.off_theme_items) ? data.off_theme_items.filter((item): item is string => typeof item === "string").slice(0, 4) : [];
    const themeOk = themeLabel ? themeFit === null || (themeFit >= IMAGE_GEN_MIN_THEME_FIT && offTheme.length <= 1) : true;
    if (themeLabel && !themeOk) issues.push(`Fora do tema ${themeLabel}${offTheme.length ? `: ${offTheme.join(", ")}` : ""}.`);
    const minScore = engine === "svg" ? 6 : IMAGE_GEN_MIN_SCORE;
    return {
      checked: true,
      score,
      passed: score >= minScore && !data.has_text_or_watermark && themeOk,
      issues,
      points,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "erro desconhecido";
    return {
      checked: false,
      score: 0,
      passed: false,
      issues: [`Revisão automática indisponível (${reason.slice(0, 160)}). Confira a imagem manualmente.`],
      points: expected.map(() => null),
    };
  }
}

// ---------------------------------------------------------------------------
// Produção de UMA imagem para um pedido
// ---------------------------------------------------------------------------
type Outcome =
  | { outcome: "saved" | "rejected" }
  | { outcome: "failed"; error: string; fatal: boolean };

async function produceOne(job: IImageGenJob, day: string): Promise<Outcome> {
  const stored: { key?: string } = {};
  try {
    const themeId = job.themeId === "all" ? pick(THEMES).id : job.themeId;
    const theme = getTheme(themeId);
    if (!theme) throw new GeminiError("Tema inválido no pedido.", "format");
    const isCquoi = job.section === "cquoi";

    let drawn: Drawn;
    let prompt: string;
    let title: string;
    let caption = "";
    let expected: string[];
    let elements: { kreyol: string; pt: string }[] = [];
    let quiz: { options: string[]; answers: string[] } | undefined;
    let cquoi: { fr: string; article: string; name: string; speak: string; w: number; h: number; arrow: { x: number; y: number }; hint?: { d: string; u: string; f?: string } } | undefined;
    let fallbackPoints: { left: number; top: number }[] = [];

    if (isCquoi) {
      const taken = [
        ...(cquoiItems as { themeId: string; name: string }[]).filter((item) => item.themeId === theme.id).map((item) => item.name),
        ...(await GeneratedImage.find({ section: "cquoi", themeId: theme.id }).select("cquoi.name").lean()).map((item) => item.cquoi?.name ?? ""),
      ].filter(Boolean);
      const proposal = parseJsonLoose<CquoiProposal>(
        await generateText(cquoiProposalPrompt(theme.label, taken), undefined, reviewModel())
      );
      const article = typeof proposal.article === "string" ? proposal.article.trim() : "";
      const name = typeof proposal.name === "string" ? proposal.name.trim().replace(/\s+/g, " ") : "";
      if (!["Un", "Une", "Des", "Du"].includes(article) || name.length < 2 || name.length > 60 || !proposal.english || !proposal.context) {
        throw new GeminiError("A IA propôs um objeto fora do formato esperado.", "format");
      }
      if (taken.some((item) => item.toLowerCase() === name.toLowerCase())) {
        throw new GeminiError(`A IA repetiu um objeto que já existe no jogo (${name}).`, "format");
      }
      if (job.engine === "svg") {
        const sample = (cquoiItems as { themeId: string; scene: string }[]).find((item) => item.themeId === theme.id)?.scene;
        prompt = cquoiSvgPrompt(theme.label, proposal, await fetchReferenceSvg(sample));
        drawn = await drawSvg(prompt, 490, 350);
      } else {
        prompt = cquoiPrompt(theme.label, proposal);
        const samples = shuffle(
          (cquoiItems as { themeId: string; scene: string }[]).filter((item) => item.themeId === theme.id).map((item) => item.scene)
        );
        drawn = await drawRaster(prompt, 980, 700, samples);
      }
      expected = [proposal.english];
      const fr = `${article} ${name}`;
      title = fr;
      // dica (PT), uso (PT) e frase (FR) do jogo; se a IA não entregar, o jogo usa uma dica genérica
      const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "");
      const dica = clean(proposal.dica, 300);
      const uso = clean(proposal.uso, 200);
      const frase = clean(proposal.frase, 160);
      const phraseOk = frase.length >= 15 && !frase.toLowerCase().includes(name.toLowerCase());
      const hint = dica && uso ? { d: dica, u: uso, ...(phraseOk ? { f: frase } : {}) } : undefined;
      cquoi = { fr, article, name, speak: fr.toLowerCase(), w: 490, h: 350, arrow: { x: 245, y: 175 }, ...(hint ? { hint } : {}) };
      fallbackPoints = [{ left: 50, top: 50 }];
    } else {
      const plan = planScene(theme.id, job.language || "kreyol");
      const forStory = job.section === "stories";
      if (job.engine === "svg") {
        prompt = svgScenePrompt(plan, await fetchReferenceSvg(`/ghibli/${plan.themeId}.svg`), forStory);
        drawn = await drawSvg(prompt, 1200, 800);
      } else {
        prompt = scenePrompt(plan, forStory);
        const samples = shuffle(IMAGE_BANK.filter((image) => image.theme === plan.themeLabel).map((image) => image.src));
        drawn = await drawRaster(prompt, 1200, 800, samples);
      }
      expected = plan.objects.map((object) => object.en);
      title = plan.title;
      caption = plan.caption;
      elements = plan.objects.map((object) => ({
        kreyol: object.kreyol,
        pt: object.pt,
        fr: object.fr || getElementLabel({ kreyol: object.kreyol, pt: object.pt }, "francais"),
      }));
      quiz = plan.quiz;
      fallbackPoints = SLOTS.map((slot) => slot.anchor);
    }

    const review = await reviewImage(drawn.preview, expected, job.engine, theme.label);
    const points = expected.map((_, index) => review.points[index] ?? fallbackPoints[index] ?? { left: 50, top: 50 });
    if (cquoi) cquoi.arrow = { x: Math.round((points[0].left / 100) * 490), y: Math.round((points[0].top / 100) * 350) };

    // Reprovada pela revisão automática → fica guardada como "rejeitada" (o admin pode reverter).
    const rejected = review.checked && !review.passed;
    const status = rejected
      ? "rejected"
      : job.autoApprove && review.checked && review.score >= IMAGE_GEN_AUTO_APPROVE_SCORE
      ? "approved"
      : "pending";

    const key = `gen/${theme.id}-${crypto.randomBytes(5).toString("hex")}.${drawn.ext}`;
    await r2Put(key, drawn.stored, drawn.mime);
    stored.key = key;

    await GeneratedImage.create({
      section: job.section,
      language: isCquoi ? "francais" : (job.language || "kreyol"),
      themeId: theme.id,
      theme: theme.label,
      engine: job.engine,
      title,
      caption,
      prompt,
      storageKey: key,
      src: `/${key}`,
      mime: drawn.mime,
      width: drawn.width,
      height: drawn.height,
      elements,
      anchors: isCquoi ? [] : points,
      quiz,
      cquoi,
      status,
      qa: { checked: review.checked, score: review.score, passed: review.passed, issues: review.issues },
      aiModel: job.engine === "svg" ? textModel() : imageModel(),
      jobId: job._id,
      genDay: day,
    });
    return { outcome: rejected ? "rejected" : "saved" };
  } catch (error) {
    if (stored.key) await r2Delete(stored.key).catch(() => undefined);
    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    const fatal = error instanceof GeminiError ? ["quota", "auth", "model", "network"].includes(error.kind) : !(error instanceof Error && error.name === "ValidationError");
    return { outcome: "failed", error: message, fatal };
  }
}

// ---------------------------------------------------------------------------
// Lote: processa pedidos ativos respeitando a cota do dia
// ---------------------------------------------------------------------------
export interface BatchResult {
  saved: number;
  rejected: number;
  failed: number;
  usage: { day: string; calls: number; limit: number; left: number };
  stopped: "limit" | "no-jobs" | "error" | "time" | "config" | "max";
  message?: string;
}

export function generationConfigProblem(): string | null {
  if (!isGeminiConfigured()) return "GEMINI_API_KEY não está configurada no servidor.";
  if (!isR2Configured()) return "O armazenamento R2 não está configurado (veja o .env.example).";
  return null;
}

export async function runImageGenBatch(options: { maxItems?: number; deadlineMs?: number; jobId?: string; force?: boolean } = {}): Promise<BatchResult> {
  const { maxItems = IMAGE_GEN_DAILY_LIMIT, deadlineMs = 240_000, jobId, force = false } = options;
  await connectDB();
  const result: BatchResult = { saved: 0, rejected: 0, failed: 0, usage: await getUsage(), stopped: "max" };
  const problem = generationConfigProblem();
  if (problem) return { ...result, stopped: "config", message: problem };

  const started = Date.now();
  const day = saoPauloDay();
  let attempts = 0;
  let consecutiveFailures = 0;

  while (attempts < maxItems) {
    if (Date.now() - started > deadlineMs) {
      result.stopped = "time";
      break;
    }
    const query: Record<string, unknown> = { status: "active", remaining: { $gt: 0 } };
    if (jobId) query._id = jobId;
    const job = await ImageGenJob.findOne(query).sort({ createdAt: 1 });
    if (!job) {
      result.stopped = "no-jobs";
      break;
    }
    if (!(await reserveCall(day, force))) {
      result.stopped = "limit";
      break;
    }
    attempts++;
    const outcome = await produceOne(job, day);

    if (outcome.outcome === "failed") {
      result.failed++;
      consecutiveFailures++;
      result.message = outcome.error;
      await ImageGenJob.updateOne({ _id: job._id }, { $set: { lastError: outcome.error.slice(0, 400), lastRunAt: new Date() } });
      if (outcome.fatal) await refundCall(day); // a IA nem chegou a gerar: não gasta a cota do dia
      if (outcome.fatal || consecutiveFailures >= 2) {
        result.stopped = "error";
        break;
      }
      continue;
    }

    consecutiveFailures = 0;
    if (outcome.outcome === "saved") {
      result.saved++;
      const updated = await ImageGenJob.findOneAndUpdate(
        { _id: job._id },
        { $inc: { remaining: -1, produced: 1 }, $set: { lastError: "", lastRunAt: new Date() } },
        { returnDocument: "after" }
      );
      if (updated && updated.remaining <= 0) await ImageGenJob.updateOne({ _id: job._id }, { $set: { status: "done" } });
    } else {
      result.rejected++;
      const updated = await ImageGenJob.findOneAndUpdate(
        { _id: job._id },
        {
          $inc: { rejectedByReview: 1 },
          $set: {
            lastError: "Imagem reprovada na revisão automática (disponível na aba Rejeitadas).",
            lastRunAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );
      if (updated && updated.rejectedByReview >= 3 && updated.produced === 0) {
        await ImageGenJob.updateOne(
          { _id: job._id },
          {
            $set: {
              status: "paused",
              lastError: "Pausado automaticamente após 3 reprovações. Você pode aprovar as imagens na aba 'Rejeitadas' ou retomar o pedido.",
            },
          }
        );
      }
    }
  }

  result.usage = await getUsage();
  if (result.stopped === "max" && result.usage.left === 0) result.stopped = "limit";
  return result;
}
