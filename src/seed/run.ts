import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import Lesson from "../models/Lesson";
import Post from "../models/Post";
import VideoLesson from "../models/VideoLesson";
import User from "../models/User";
import { seedLessons } from "./lessons";
import { frenchSeedLessons } from "./frenchLessons";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "MONGODB_URI não definida. Configure .env.local antes de rodar o seed (veja README.md)."
    );
    process.exit(1);
  }

  console.log("Conectando ao MongoDB...");
  await mongoose.connect(uri);

  // 1. Assegurar que lições antigas sem language fiquem como "kreyol"
  await Lesson.updateMany({ language: { $exists: false } }, { $set: { language: "kreyol" } });
  await Post.updateMany({ language: { $exists: false } }, { $set: { language: "kreyol" } });
  await VideoLesson.updateMany({ language: { $exists: false } }, { $set: { language: "kreyol" } });

  // 2. Semeando lições de Crioulo Haitiano
  console.log(`Semeando ${seedLessons.length} lições de Crioulo...`);
  let kreyolCreated = 0;
  for (const lesson of seedLessons) {
    const result = await Lesson.findOneAndUpdate(
      { sectionNumber: lesson.sectionNumber, language: "kreyol" },
      {
        $set: {
          title: lesson.title,
          category: lesson.category,
          content: lesson.content,
          order: lesson.order,
          language: "kreyol",
          isPublished: true,
          announcedAt: new Date(),
        },
        $setOnInsert: { slug: lesson.slug },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result) kreyolCreated += 1;
  }
  console.log(`Concluído: ${kreyolCreated} lições de Crioulo criadas/atualizadas.`);

  // 3. Semeando lições de Francês do Manuel Complet
  console.log(`Semeando ${frenchSeedLessons.length} lições de Francês...`);
  let frenchCreated = 0;
  for (const lesson of frenchSeedLessons) {
    const result = await Lesson.findOneAndUpdate(
      { sectionNumber: lesson.sectionNumber, language: "francais" },
      {
        $set: {
          title: lesson.title,
          category: lesson.category,
          content: lesson.content,
          order: lesson.order,
          language: "francais",
          isPublished: true,
          announcedAt: new Date(),
        },
        $setOnInsert: { slug: lesson.slug },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result) frenchCreated += 1;
  }
  console.log(`Concluído: ${frenchCreated} lições de Francês criadas/atualizadas.`);

  // 4. Admin user
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@kreyol.app").toLowerCase().trim();
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    adminUser = await User.create({
      name: "Prof. Handy Claude",
      email: adminEmail,
      role: "admin",
      preferredLanguage: "kreyol",
    });
  }

  // 5. Postagens de exemplo em Francês se não houver nenhuma
  const frenchPostsCount = await Post.countDocuments({ language: "francais" });
  if (frenchPostsCount === 0) {
    console.log("Semeando postagens de exemplo em Francês...");
    await Post.create([
      {
        title: "Bienvenue dans l'espace Français FLE ! 🇫🇷",
        content: "Chers étudiants, bienvenue dans le cursus complet de français. Retrouvez vos leçons structurées tirées du Manuel Complet de Français, vos fiches de révision et le nouveau jeu d'identification d'objets 'C'est quoi ?'. N'hésitez pas à poser vos questions !",
        author: adminUser._id,
        language: "francais",
        isPermanent: true,
        isPublished: true,
        announcedAt: new Date(),
        acceptsAnswers: true,
      },
      {
        title: "Point grammaire : Ne confondez plus le Subjonctif et l'Indicatif !",
        content: "Rappel essentiel du chapitre 2 : 'Je pense qu'il vient' (certitude = indicatif), mais 'Je ne pense pas qu'il vienne' (doute = subjonctif). Retenez également que le verbe ESPÉRER ne prend JAMAIS le subjonctif : 'J'espère que tu viendras' !",
        author: adminUser._id,
        language: "francais",
        isPermanent: true,
        isPublished: true,
        announcedAt: new Date(),
        acceptsAnswers: true,
      },
    ]);
  }

  // 6. Vídeos de exemplo em Crioulo e Francês
  const existingVideosCount = await VideoLesson.countDocuments();
  if (existingVideosCount === 0) {
    console.log("Semeando vídeos de exemplo...");
    await VideoLesson.create([
      {
        title: "Pronúncia e Sons Únicos do Kreyòl Ayisyen 🇭🇹",
        description: "Nesta aula curta, exploramos a pronúncia das vogais nasais (an, en, on) e consoantes especiais do crioulo haitiano.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 240,
        author: adminUser._id,
        authorName: "Prof. Alex",
        language: "kreyol",
        isPublished: true,
        publishAt: null,
        isLiveRecording: false,
        customization: {
          backgroundStyle: "haiti_flag",
          avatarType: "you_sunset",
          frameStyle: "rounded",
          bannerText: "Fonética e Pronúncia",
        },
        likes: [adminEmail],
        comments: [],
        viewsCount: 15,
      },
      {
        title: "Le Subjonctif Français expliqué en 5 minutes 🇫🇷",
        description: "Guide condensé pour dompter le subjonctif présent, ses verbes irréguliers et ses règles d'or pour les examens DELF/DALF.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 300,
        author: adminUser._id,
        authorName: "Professeur de Français",
        language: "francais",
        isPublished: true,
        publishAt: null,
        isLiveRecording: false,
        customization: {
          backgroundStyle: "universidade",
          avatarType: "you_studio",
          frameStyle: "split",
          bannerText: "Grammaire Avancée",
        },
        likes: [adminEmail],
        comments: [],
        viewsCount: 12,
      },
    ]);
  }

  await mongoose.disconnect();
  console.log("Seed finalizado com sucesso!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao rodar o seed:", err);
  process.exit(1);
});
