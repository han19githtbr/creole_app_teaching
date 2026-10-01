import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/apiAuth";
import { getBankImage } from "@/lib/imageBank";
import { getDefaultImageQuiz } from "@/lib/imageQuiz";
import Post from "@/models/Post";

async function getQuiz(postId?: string, imageId?: string, isAdmin = false) {
  if (postId) {
    await connectDB();
    const post = await Post.findById(postId).lean();
    if (!post?.imageUrl) return null;
    if (!isAdmin && (!post.isPublished || (!post.isPermanent && post.expiresAt && post.expiresAt < new Date()))) return null;
    const image = getBankImage(post.imageUrl);
    const quiz = post.imageQuiz ?? (image ? getDefaultImageQuiz(image.theme, image.id) : undefined);
    if (!quiz) return null;
    return {
      id: String(post._id),
      postId: String(post._id),
      theme: image?.theme ?? "Desafio da postagem",
      title: post.title,
      src: post.imageUrl,
      alt: post.imageAlt || post.title,
      options: quiz.options,
      answerCount: quiz.answers.length,
    };
  }

  const image = getBankImage(imageId);
  if (!image) return null;
  const quiz = getDefaultImageQuiz(image.theme, image.id);
  if (!quiz) return null;
  return {
    id: image.id,
    theme: image.theme,
    title: image.title,
    src: image.src,
    alt: image.title,
    options: quiz.options,
    answerCount: quiz.answers.length,
  };
}

export async function GET(req: NextRequest) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Faça login para jogar." }, { status: 401 });
  const params = req.nextUrl.searchParams;
  const challenge = await getQuiz(params.get("post") ?? undefined, params.get("image") ?? undefined, session.user.role === "admin");
  if (!challenge) return NextResponse.json({ error: "Desafio não encontrado." }, { status: 404 });
  return NextResponse.json({ challenge });
}

export async function POST(req: NextRequest) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Faça login para jogar." }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.selected) || body.selected.some((word: unknown) => typeof word !== "string")) {
    return NextResponse.json({ error: "Seleção inválida." }, { status: 400 });
  }

  if (body.postId) {
    await connectDB();
    const post = await Post.findById(body.postId).lean();
    if (!post || !post.imageUrl) return NextResponse.json({ error: "Desafio não encontrado." }, { status: 404 });
    if (session.user.role !== "admin" && (!post.isPublished || (!post.isPermanent && post.expiresAt && post.expiresAt < new Date()))) {
      return NextResponse.json({ error: "Desafio não encontrado." }, { status: 404 });
    }
    const image = getBankImage(post.imageUrl);
    const quiz = post.imageQuiz ?? (image ? getDefaultImageQuiz(image.theme, image.id) : undefined);
    if (!quiz) return NextResponse.json({ error: "Este desafio ainda não foi configurado." }, { status: 404 });
    const expected = new Set<string>((quiz.answers as string[]).map((word) => word.toLocaleLowerCase()));
    const selectedWords = body.selected as string[];
    const selected = new Set<string>(selectedWords.map((word) => word.toLocaleLowerCase()));
    return NextResponse.json({ correct: expected.size === selected.size && [...expected].every((word) => selected.has(word)) });
  }

  const image = getBankImage(body.imageId);
  const quiz = image ? getDefaultImageQuiz(image.theme, image.id) : undefined;
  if (!quiz) return NextResponse.json({ error: "Desafio não encontrado." }, { status: 404 });
  const expected = new Set(quiz.answers.map((word) => word.toLocaleLowerCase()));
  const selected = new Set((body.selected as string[]).map((word) => word.toLocaleLowerCase()));
  return NextResponse.json({ correct: expected.size === selected.size && [...expected].every((word) => selected.has(word)) });
}
