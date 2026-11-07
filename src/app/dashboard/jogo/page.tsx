import { randomInt } from "node:crypto";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { IMAGE_BANK } from "@/lib/imageBank";
import { findAnyBankImage, listApprovedCquoiItems, listApprovedGenerated } from "@/lib/generatedImages";
import { getQuizForImage, isValidImageQuiz } from "@/lib/imageQuiz";
import Post from "@/models/Post";
import { ImageQuizGame, type ImageQuizChallenge } from "@/components/ImageQuizGame";
import { CestQuoiGame, type CestQuoiItem } from "@/components/CestQuoiGame";
import { GamesPicker } from "@/components/GamesPicker";
import { GameMonetizationWrapper } from "@/components/GameMonetizationWrapper";
import { getAppLanguage } from "@/lib/language";
import cquoiItems from "@/lib/cquoiItems.json";

export const dynamic = "force-dynamic";

export default async function ImageQuizPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string; image?: string; theme?: string; module?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const language = await getAppLanguage();

  const { post: postId, image: imageId, theme, module: initialModule } = await searchParams;

  // Quando um módulo ou tema de jogo é requisitado (ex: cquoi ou trilha), ou na aba Jogos do painel em francês:
  // Abre o seletor ou o jogo interativo diretamente.
  if ((initialModule || theme || language === "francais") && !postId) {
    if (!initialModule && !theme) return <GamesPicker />;

    return (
      <GameMonetizationWrapper>
        <CestQuoiGame
          items={[...(cquoiItems as CestQuoiItem[]), ...(await listApprovedCquoiItems(language))]}
          initialTheme={theme}
          initialModule={initialModule}
          language={language}
        />
      </GameMonetizationWrapper>
    );
  }
  const requestedImage = imageId ? await findAnyBankImage(imageId) : undefined;
  if (imageId && !requestedImage) notFound();
  const pool = requestedImage ? [] : [...IMAGE_BANK, ...(await listApprovedGenerated("posts"))];
  const randomImage = requestedImage ?? pool[randomInt(pool.length)];
  const randomQuiz = getQuizForImage(randomImage, language)!;
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

    const image = await findAnyBankImage(post.imageUrl, { includeUnapproved: session.user.role === "admin" });
    const hasCustomQuiz = Boolean(post.imageQuiz && isValidImageQuiz(post.imageQuiz));
    const quiz = hasCustomQuiz
      ? post.imageQuiz
      : image
      ? getQuizForImage(image, language)
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

  return (
    <GameMonetizationWrapper>
      <ImageQuizGame initialChallenge={challenge} language={language} />
    </GameMonetizationWrapper>
  );
}
