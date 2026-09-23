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
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao rodar o seed:", err);
  process.exit(1);
});
