import { randomInt } from "node:crypto";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getBankImage, IMAGE_BANK } from "@/lib/imageBank";
import { getDefaultImageQuiz, isValidImageQuiz } from "@/lib/imageQuiz";
import Post from "@/models/Post";
import { ImageQuizGame, type ImageQuizChallenge } from "@/components/ImageQuizGame";
import { CestQuoiGame, type CestQuoiItem } from "@/components/CestQuoiGame";
import { getAppLanguage } from "@/lib/language";
import cquoiItems from "@/lib/cquoiItems.json";

export const dynamic = "force-dynamic";

export default async function ImageQuizPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string; image?: string; theme?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  // Painel em francês: jogo "C'est quoi ?" (objetos da pasta c-quoi + coleção por temas)
  if ((await getAppLanguage()) === "francais") {
    const { theme } = await searchParams;
    return <CestQuoiGame items={cquoiItems as CestQuoiItem[]} initialTheme={theme} />;
  }

  const { post: postId, image: imageId } = await searchParams;
  const requestedImage = imageId ? getBankImage(imageId) : undefined;
  if (imageId && !requestedImage) notFound();
  const randomImage = requestedImage ?? IMAGE_BANK[randomInt(IMAGE_BANK.length)];
  const randomQuiz = getDefaultImageQuiz(randomImage.theme, randomImage.id)!;
  let challenge: ImageQuizChallenge = {
    id: randomImage.id,
    theme: randomImage.theme,
    title: randomImage.title,
    src: randomImage.src,
    alt: randomImage.title,
    options: randomQuiz.options,
    answerCount: randomQuiz.answers.length,
  };

  if (postId) {
    await connectDB();
    const post = await Post.findById(postId).lean();
    if (!post) notFound();
    if (session.user.role !== "admin" && (!post.isPublished || (!post.isPermanent && post.expiresAt && post.expiresAt < new Date()))) notFound();
    if (!post.imageUrl) notFound();

    const image = getBankImage(post.imageUrl);
    const hasCustomQuiz = Boolean(post.imageQuiz && isValidImageQuiz(post.imageQuiz));
    const quiz = hasCustomQuiz
      ? post.imageQuiz
      : image
      ? getDefaultImageQuiz(image.theme, image.id)
      : undefined;
    if (!quiz || !isValidImageQuiz(quiz)) notFound();
    challenge = {
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

  return <ImageQuizGame initialChallenge={challenge} />;
}
