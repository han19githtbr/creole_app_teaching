import { randomInt } from "node:crypto";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getBankImage, IMAGE_BANK } from "@/lib/imageBank";
import { getDefaultImageQuiz } from "@/lib/imageQuiz";
import Post from "@/models/Post";
import { ImageQuizGame, type ImageQuizChallenge } from "@/components/ImageQuizGame";

export const dynamic = "force-dynamic";

export default async function ImageQuizPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string; image?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

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
    const hasCustomQuiz = Boolean(
      post.imageQuiz &&
        Array.isArray(post.imageQuiz.options) &&
        post.imageQuiz.options.length === 10 &&
        Array.isArray(post.imageQuiz.answers) &&
        post.imageQuiz.answers.length > 0
    );
    const quiz = hasCustomQuiz
      ? post.imageQuiz
      : image
      ? getDefaultImageQuiz(image.theme, image.id)
      : undefined;
    if (!quiz || !quiz.options || quiz.options.length !== 10 || !quiz.answers?.length) notFound();
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
