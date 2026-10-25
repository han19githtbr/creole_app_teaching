import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { connectDB } from "@/lib/mongodb";
import { isR2Configured } from "@/lib/r2";
import { GeneratedImage, ImageGenJob } from "@/models/ImageGen";
import {
  IMAGE_GEN_AUTO_APPROVE_SCORE,
  IMAGE_GEN_DAILY_LIMIT,
  IMAGE_GEN_MAX_PER_JOB,
  IMAGE_GEN_MIN_SCORE,
  getTheme,
  isEngine,
  isSection,
} from "@/lib/imageGen/config";
import { isAppLanguage, languageFilter } from "@/lib/languageShared";
import { getAppLanguage } from "@/lib/language";
import { getElementLabel } from "@/lib/imageBank";
import { imageModel, isGeminiConfigured, reviewModel, textModel } from "@/lib/imageGen/gemini";
import { getUsage } from "@/lib/imageGen/pipeline";

export const dynamic = "force-dynamic";

// Painel do administrador: estado geral (cota do dia, pedidos, galeria para aprovar).
export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  await connectDB();

  const params = request.nextUrl.searchParams;
  const status = params.get("status") ?? "pending";
  const section = params.get("section");
  const langParam = params.get("language");
  const lang = isAppLanguage(langParam) ? langParam : undefined;

  const filter: Record<string, unknown> = {};
  if (["pending", "approved", "rejected"].includes(status)) filter.status = status;
  if (isSection(section)) filter.section = section;
  if (lang) Object.assign(filter, languageFilter(lang));

  const jobFilter: Record<string, unknown> = { status: { $in: ["active", "paused"] } };
  const recentJobFilter: Record<string, unknown> = { status: { $in: ["done", "cancelled"] } };
  if (lang) {
    Object.assign(jobFilter, languageFilter(lang));
    Object.assign(recentJobFilter, languageFilter(lang));
  }
  const countMatch: Record<string, unknown> = lang ? languageFilter(lang) : {};

  const [usage, jobs, images, grouped] = await Promise.all([
    getUsage(),
    ImageGenJob.find(jobFilter).sort({ createdAt: 1 }).lean(),
    GeneratedImage.find(filter).sort({ createdAt: -1 }).limit(60).lean(),
    GeneratedImage.aggregate([
      ...(Object.keys(countMatch).length ? [{ $match: countMatch }] : []),
      { $group: { _id: { section: "$section", status: "$status" }, count: { $sum: 1 } } },
    ]),
  ]);
  const recentJobs = await ImageGenJob.find(recentJobFilter).sort({ updatedAt: -1 }).limit(5).lean();

  return NextResponse.json({
    config: {
      r2: isR2Configured(),
      gemini: isGeminiConfigured(),
      dailyLimit: IMAGE_GEN_DAILY_LIMIT,
      minScore: IMAGE_GEN_MIN_SCORE,
      autoApproveScore: IMAGE_GEN_AUTO_APPROVE_SCORE,
      imageModel: imageModel(),
      textModel: textModel(),
      reviewModel: reviewModel(),
      cronConfigured: Boolean(process.env.CRON_SECRET),
    },
    usage,
    jobs: [...jobs, ...recentJobs].map((job) => ({
      id: String(job._id),
      section: job.section,
      themeId: job.themeId,
      engine: job.engine,
      total: job.total,
      remaining: job.remaining,
      produced: job.produced,
      rejectedByReview: job.rejectedByReview,
      autoApprove: job.autoApprove,
      status: job.status,
      lastError: job.lastError || "",
      lastRunAt: job.lastRunAt ? job.lastRunAt.toISOString() : null,
    })),
    images: images.map((image) => ({
      id: String(image._id),
      section: image.section,
      theme: image.theme,
      engine: image.engine,
      title: image.title,
      src: image.src,
      status: image.status,
      elements: (image.elements ?? []).map((e: { kreyol: string; pt: string; fr?: string }) => ({
        kreyol: e.kreyol,
        pt: e.pt,
        fr: e.fr || getElementLabel(e, "francais"),
      })),
      cquoi: image.cquoi ? { fr: image.cquoi.fr } : null,
      qa: image.qa,
      createdAt: image.createdAt.toISOString(),
    })),
    counts: grouped.map((row: { _id: { section: string; status: string }; count: number }) => ({
      section: row._id.section,
      status: row._id.status,
      count: row.count,
    })),
  });
}

// Cria um pedido: "gere N imagens para a parte X". O robô entrega até IMAGE_GEN_DAILY_LIMIT por dia.
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const body = await request.json().catch(() => null);

  if (!isSection(body?.section)) return NextResponse.json({ error: "Escolha a parte do app." }, { status: 400 });
  const themeId = body?.themeId === "all" || !body?.themeId ? "all" : getTheme(body.themeId)?.id;
  if (!themeId) return NextResponse.json({ error: "Tema inválido." }, { status: 400 });
  const engine = isEngine(body?.engine) ? body.engine : "image";
  const total = Number(body?.total);
  if (!Number.isInteger(total) || total < 1 || total > IMAGE_GEN_MAX_PER_JOB) {
    return NextResponse.json({ error: `A quantidade deve ficar entre 1 e ${IMAGE_GEN_MAX_PER_JOB}.` }, { status: 400 });
  }

  const jobLanguage = isAppLanguage(body?.language) ? body.language : (await getAppLanguage());

  await connectDB();
  const job = await ImageGenJob.create({
    section: body.section,
    language: jobLanguage,
    themeId,
    engine,
    total,
    remaining: total,
    autoApprove: Boolean(body?.autoApprove),
    createdBy: session.user.email ?? "",
  });
  return NextResponse.json({ id: String(job._id) }, { status: 201 });
}
