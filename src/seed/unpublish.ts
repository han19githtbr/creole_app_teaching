import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import Lesson from "../models/Lesson";
import Post from "../models/Post";
import VideoLesson from "../models/VideoLesson";
import { seedLessons } from "./lessons";
import { frenchSeedLessons } from "./frenchLessons";

/**
 * Remove do painel dos alunos o conteúdo que foi publicado automaticamente pelo seed.
 *
 *   npx tsx src/seed/unpublish.ts          -> despublica só o conteúdo de exemplo do seed
 *   npx tsx src/seed/unpublish.ts --all    -> despublica TUDO (lições, postagens, vídeos e histórias)
 *
 * Depois disso, o admin publica manualmente, em /admin, o que quiser mostrar aos alunos.
 */
const SEED_POST_TITLES = [
  "Bienvenue dans l'espace Français FLE ! 🇫🇷",
  "Point grammaire : Ne confondez plus le Subjonctif et l'Indicatif !",
];
const SEED_VIDEO_TITLES = [
  "Pronúncia e Sons Únicos do Kreyòl Ayisyen 🇭🇹",
  "Le Subjonctif Français expliqué en 5 minutes 🇫🇷",
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI não definida. Configure o .env.local.");
    process.exit(1);
  }
  const all = process.argv.includes("--all");
  await mongoose.connect(uri);

  const hide = { $set: { isPublished: false, announcedAt: null } };

  const lessonFilter = all
    ? {}
    : { slug: { $in: [...seedLessons, ...frenchSeedLessons].map((l) => l.slug) } };
  const postFilter = all ? {} : { title: { $in: SEED_POST_TITLES } };
  const videoFilter = all ? {} : { title: { $in: SEED_VIDEO_TITLES } };

  const [lessons, posts, videos] = await Promise.all([
    Lesson.updateMany(lessonFilter, hide),
    Post.updateMany(postFilter, hide),
    VideoLesson.updateMany(videoFilter, hide),
  ]);

  console.log(`Lições despublicadas: ${lessons.modifiedCount}`);
  console.log(`Postagens despublicadas: ${posts.modifiedCount}`);
  console.log(`Vídeos/histórias despublicados: ${videos.modifiedCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});
