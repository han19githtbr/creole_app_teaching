// Monta (no servidor) os dados REAIS da plataforma usados pelo Estúdio de Propagandas.
import { connectDB } from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import Post from "@/models/Post";
import VideoLesson from "@/models/VideoLesson";
import { IMAGE_BANK } from "@/lib/imageBank";
import { listApprovedGenerated } from "@/lib/generatedImages";
import cquoiItems from "@/lib/cquoiItems.json";
import { BADGES, BADGES_FR, LEVELS, LEVELS_FR } from "@/lib/gamification";
import { LEVELS as CQUOI_LEVELS, LEVEL_ORDER } from "@/lib/cquoiLevels";
import { LANGUAGE_META, languageFilter, type AppLanguage } from "@/lib/languageShared";
import type { AdChallenge, AdData, LibImage } from "./types";

const TEACHERS: LibImage[] = [
  { id: "teacher-studio", src: "/avatars/you-studio.png", title: "Professor · estúdio", group: "Professor", kind: "teacher", portrait: true },
  { id: "teacher-headphones", src: "/avatars/you-headphones.png", title: "Professor · fone de ouvido", group: "Professor", kind: "teacher", portrait: true },
  { id: "teacher-sunset", src: "/avatars/you-sunset.png", title: "Professor · pôr do sol", group: "Professor", kind: "teacher", portrait: true },
  { id: "teacher-night", src: "/avatars/you-night.png", title: "Professor · noite", group: "Professor", kind: "teacher", portrait: true },
  { id: "teacher-thinking", src: "/avatars/you-thinking.png", title: "Professor · pensando", group: "Professor", kind: "teacher", portrait: true },
  { id: "teacher-trail", src: "/avatars/you-trail.png", title: "Professor · trilha", group: "Professor", kind: "teacher", portrait: true },
];

interface CquoiItem {
  id: string;
  theme: string;
  fr: string;
  scene: string;
  question: string;
  answer: string;
}

/** Embaralhamento determinístico (a mesma entrada gera sempre a mesma ordem). */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: T[], seed: number): T[] {
  const rnd = seeded(seed);
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function kreyolChallenges(): AdChallenge[] {
  const pool = IMAGE_BANK.filter((img) => img.elements.length >= 2);
  const allWords = Array.from(new Set(pool.flatMap((img) => img.elements.map((e) => e.kreyol))));
  const chosen = pool.filter((img) => img.isPrimary || /-(02|07|12|17)$/.test(img.id));
  return chosen.map((img, index) => {
    const el = img.elements[index % img.elements.length];
    const own = new Set(img.elements.map((e) => e.kreyol));
    const wrong = shuffle(
      allWords.filter((w) => !own.has(w)),
      index + 11
    ).slice(0, 3);
    return {
      id: `kr-${img.id}`,
      label: `${img.theme} · ${img.title}`,
      image: img.src,
      question: "Qual destas palavras em Kreyòl aparece na imagem?",
      options: shuffle([el.kreyol, ...wrong], index + 3),
      correct: el.kreyol,
      explain: `${el.kreyol} = ${el.pt}`,
    };
  });
}

function frenchChallenges(): AdChallenge[] {
  const items = cquoiItems as unknown as CquoiItem[];
  const chosen = items.filter((_, i) => i % 3 === 0);
  return chosen.map((item, index) => {
    const wrong = shuffle(
      items.filter((o) => o.theme !== item.theme),
      index + 5
    )
      .slice(0, 2)
      .map((o) => o.fr);
    return {
      id: `fr-${item.id}`,
      label: item.fr,
      image: item.question,
      answerImage: item.answer,
      question: "C'est quoi ?",
      options: shuffle([item.fr, ...wrong], index + 7),
      correct: item.fr,
      explain: `${item.fr}.`,
    };
  });
}

export async function buildAdData(language: AppLanguage): Promise<AdData> {
  await connectDB();
  const langMatch = languageFilter(language);
  const now = new Date();

  const [lessonDocs, lessonCount, videoCount, storyCount, postCount, generated] = await Promise.all([
    Lesson.find({ ...langMatch, isPublished: true }).sort({ order: 1, sectionNumber: 1 }).limit(40).select("title category order").lean(),
    Lesson.countDocuments({ ...langMatch, isPublished: true }),
    VideoLesson.countDocuments({ ...langMatch, isPublished: true, story: { $exists: false } }),
    VideoLesson.countDocuments({ ...langMatch, isPublished: true, story: { $exists: true } }),
    Post.countDocuments({ ...langMatch, isPublished: true, $or: [{ isPermanent: true }, { expiresAt: { $gte: now } }] }),
    listApprovedGenerated("posts").catch(() => []),
  ]);

  const images: LibImage[] = [
    ...TEACHERS,
    ...IMAGE_BANK.map<LibImage>((img) => ({
      id: img.id,
      src: img.src,
      title: img.title,
      group: img.theme,
      kind: "ghibli",
      elements: img.elements.map((e) => e.kreyol),
    })),
    ...generated.slice(0, 80).map<LibImage>((img) => ({
      id: img.id,
      src: img.src,
      title: img.title,
      group: `${img.theme} · IA`,
      kind: "generated",
      elements: img.elements.map((e) => e.kreyol),
    })),
  ];

  if (language === "francais") {
    for (const item of cquoiItems as unknown as CquoiItem[]) {
      images.push(
        { id: `${item.id}-q`, src: item.question, title: `${item.fr} · pergunta`, group: `C'est quoi · ${item.theme}`, kind: "cquoi", portrait: true },
        { id: `${item.id}-a`, src: item.answer, title: `${item.fr} · resposta`, group: `C'est quoi · ${item.theme}`, kind: "cquoi", portrait: true },
        { id: `${item.id}-s`, src: item.scene, title: `${item.fr} · cena`, group: `C'est quoi · ${item.theme}`, kind: "cquoi" }
      );
    }
  }

  const levels = (language === "francais" ? LEVELS_FR : LEVELS).map((l) => ({ native: l.native, title: l.title, emoji: l.badgeEmoji }));
  const badges = (language === "francais" ? BADGES_FR : BADGES).map((b) => ({ native: b.native, title: b.title, emoji: b.emoji }));

  return {
    language,
    counts: { lessons: lessonCount, videos: videoCount, stories: storyCount, posts: postCount, images: images.length },
    lessons: lessonDocs.map((l) => ({ id: String(l._id), title: l.title, category: l.category, order: l.order ?? 0 })),
    categories: Array.from(new Set(lessonDocs.map((l) => String(l.category)))),
    images,
    challenges: language === "francais" ? frenchChallenges() : kreyolChallenges(),
    levels,
    badges,
    gameName: LANGUAGE_META[language].gameTitle,
    gameLevels: language === "francais" ? LEVEL_ORDER.map((id) => ({ label: CQUOI_LEVELS[id].label, emoji: CQUOI_LEVELS[id].emoji, seconds: CQUOI_LEVELS[id].seconds })) : [],
    appUrl: (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "").replace(/\/+$/, ""),
  };
}
