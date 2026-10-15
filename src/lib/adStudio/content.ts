// Textos de marketing por idioma (em português do Brasil, com toques do idioma ensinado).
import type { AppLanguage } from "@/lib/languageShared";
import type { Brand } from "./types";

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export interface WordOfDay {
  term: string;
  pt: string;
  example: string;
  examplePt: string;
}

export interface LangCopy {
  flag: string;
  name: string;
  /** Nome do idioma em português, para frases corridas. */
  ptName: string;
  hello: string;
  features: Feature[];
  words: WordOfDay[];
  hashtags: string[];
  chat: string[];
}

export const COPY: Record<AppLanguage, LangCopy> = {
  kreyol: {
    flag: "🇭🇹",
    name: "Kreyòl Ayisyen",
    ptName: "crioulo haitiano",
    hello: "Bon jou!",
    features: [
      { icon: "📚", title: "Lições completas", desc: "Gramática, vocabulário, diálogos e cultura, passo a passo." },
      { icon: "🎥", title: "Aulas em vídeo", desc: "Assista quando quiser, no seu ritmo, direto do celular." },
      { icon: "📡", title: "Aulas ao vivo", desc: "Tire dúvidas em tempo real com o professor." },
      { icon: "🖼️", title: "Jogo das imagens", desc: "Descubra os elementos de cenas ilustradas e ganhe pontos." },
      { icon: "✨", title: "Histórias animadas", desc: "Narração em Kreyòl com legendas em português." },
      { icon: "🏆", title: "Conquistas e níveis", desc: "Suba de nível, ganhe selos e compartilhe suas vitórias." },
    ],
    words: [
      { term: "Bonjou", pt: "Bom dia", example: "Bonjou, kijan ou ye?", examplePt: "Bom dia, como você está?" },
      { term: "Mèsi", pt: "Obrigado(a)", example: "Mèsi anpil!", examplePt: "Muito obrigado(a)!" },
      { term: "Kontan", pt: "Feliz / contente", example: "Mwen kontan wè w.", examplePt: "Estou feliz em ver você." },
      { term: "Pa gen pwoblèm", pt: "Sem problema", example: "Pa gen pwoblèm, nou la.", examplePt: "Sem problema, estamos aqui." },
      { term: "Bon apeti", pt: "Bom apetite", example: "Bon apeti tout moun!", examplePt: "Bom apetite a todos!" },
      { term: "Ak plezi", pt: "Com prazer", example: "M ap ede w ak plezi.", examplePt: "Eu ajudo você com prazer." },
    ],
    hashtags: ["#kreyolayisyen", "#crioulohaitiano", "#aprenderidiomas", "#haiti", "#idiomas", "#aulasonline"],
    chat: ["Ana|Bonjou, pwofesè!", "Léo|Mèsi anpil!", "Bia|Mwen konprann!"],
  },
  francais: {
    flag: "🇫🇷",
    name: "Français",
    ptName: "francês",
    hello: "Bonjour !",
    features: [
      { icon: "📚", title: "Lições de francês", desc: "Gramática, vocabulário e preparação para o DELF." },
      { icon: "🎥", title: "Aulas em vídeo", desc: "Assista quando quiser, no seu ritmo, direto do celular." },
      { icon: "📡", title: "Aulas ao vivo", desc: "Pratique e tire dúvidas em tempo real com o professor." },
      { icon: "🎮", title: "C'est quoi ?", desc: "Jogo de vocabulário com imagens, dicas e vários níveis." },
      { icon: "🥇", title: "Ranking online", desc: "Jogue contra outros alunos e suba no ranking." },
      { icon: "🏆", title: "Conquistas e níveis", desc: "Ganhe selos, suba de nível e compartilhe suas vitórias." },
    ],
    words: [
      { term: "Bonjour", pt: "Bom dia / olá", example: "Bonjour, comment allez-vous ?", examplePt: "Bom dia, como vai o senhor / a senhora?" },
      { term: "Merci", pt: "Obrigado(a)", example: "Merci beaucoup pour votre aide.", examplePt: "Muito obrigado(a) pela sua ajuda." },
      { term: "Enchanté(e)", pt: "Prazer em conhecer", example: "Enchanté de faire votre connaissance.", examplePt: "Prazer em conhecê-lo(a)." },
      { term: "À bientôt", pt: "Até logo", example: "À bientôt, à demain !", examplePt: "Até logo, até amanhã!" },
      { term: "Avec plaisir", pt: "Com prazer", example: "Je vous aide avec plaisir.", examplePt: "Eu ajudo você com prazer." },
      { term: "Bon appétit", pt: "Bom apetite", example: "Bon appétit à tous !", examplePt: "Bom apetite a todos!" },
    ],
    hashtags: ["#francais", "#aprenderfrances", "#fle", "#delf", "#frances", "#idiomas", "#aulasonline"],
    chat: ["Ana|Bonjour, professeur !", "Léo|Merci beaucoup !", "Bia|Je comprends !"],
  },
};

export function cleanUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

/** Legenda pronta para colar no Instagram/Facebook. */
export function buildCaption(language: AppLanguage, brand: Brand, topic: string): string {
  const c = COPY[language];
  const lines: string[] = [];
  lines.push(`${c.flag} ${c.hello} ${topic}`.trim());
  lines.push("");
  lines.push(
    language === "kreyol"
      ? `Venha aprender ${c.ptName} com a gente${brand.name ? ` (@${brand.name.replace(/^@/, "")})` : ""}: lições, aulas em vídeo, aulas ao vivo, jogos e histórias animadas em um só lugar.`
      : `Venha aprender ${c.ptName} com a gente${brand.name ? ` (@${brand.name.replace(/^@/, "")})` : ""}: lições, aulas em vídeo, aulas ao vivo, o jogo C'est quoi ? e ranking com outros alunos.`
  );
  lines.push("");
  if (brand.url) lines.push(`👉 Acesse: ${brand.url}`);
  if (brand.contact) lines.push(`💬 Fale comigo: ${brand.contact}`);
  const handle = brand.handle || brand.name;
  if (handle) lines.push(`📲 Siga @${handle.replace(/^@/, "")}`);
  lines.push("");
  lines.push(c.hashtags.join(" "));
  return lines.join("\n");
}
