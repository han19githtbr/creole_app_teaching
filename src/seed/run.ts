import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import Lesson from "../models/Lesson";
import { seedLessons } from "./lessons";

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

  console.log(`Semeando ${seedLessons.length} lições...`);
  let created = 0;
  const updated = 0;

  for (const lesson of seedLessons) {
    const result = await Lesson.findOneAndUpdate(
      { sectionNumber: lesson.sectionNumber },
      {
        $set: {
          title: lesson.title,
          category: lesson.category,
          content: lesson.content,
          order: lesson.order,
          isPublished: true,
        },
        $setOnInsert: { slug: lesson.slug },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result) {
      created += 1;
    }
  }

  console.log(`Concluído. ${created} lições criadas/atualizadas, ${updated} ignoradas.`);

  // Seed sample video lessons if collection is empty
  const VideoLesson = (await import("../models/VideoLesson")).default;
  const User = (await import("../models/User")).default;

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@kreyol.app").toLowerCase().trim();
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    adminUser = await User.create({
      name: "Professor Kreyòl",
      email: adminEmail,
      role: "admin",
    });
  }

  const existingVideosCount = await VideoLesson.countDocuments();
  if (existingVideosCount === 0) {
    console.log("Semeando vídeos de exemplo...");
    await VideoLesson.create([
      {
        title: "Pronúncia e Sons Únicos do Kreyòl Ayisyen 🇭🇹",
        description:
          "Nesta aula curta, exploramos a pronúncia das vogais nasais (an, en, on) e consoantes especiais do crioulo haitiano com exemplos práticos.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 240, // 4 mins
        author: adminUser._id,
        authorName: "Prof. Alex",
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
        comments: [
          {
            userId: adminUser._id,
            userName: "Aluno Pedro",
            userEmail: "pedro@exemplo.com",
            content: "Excelente explicação sobre as vogais nasais! Mèsi anpil!",
            createdAt: new Date(Date.now() - 3600000),
          },
        ],
        viewsCount: 15,
      },
      {
        title: "60 Frases Mais Importantes no Mercado de Porto Príncipe 🛒",
        description:
          "Aprenda como perguntar preços, negociar e cumprimentar os vendedores com naturalidade no comércio haitiano.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 380, // 6:20
        author: adminUser._id,
        authorName: "Profª. Marie",
        isPublished: true,
        publishAt: null,
        isLiveRecording: false,
        customization: {
          backgroundStyle: "caribbean_sunset",
          avatarType: "you_studio",
          frameStyle: "split",
          bannerText: "Vocabulário de Compras",
        },
        likes: [],
        comments: [],
        viewsCount: 8,
      },
    ]);
    console.log("Vídeos de exemplo semeados com sucesso.");
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao rodar o seed:", err);
  process.exit(1);
});
