// Banco de imagens em estilo aquarela de animação (ilustrações ORIGINAIS geradas
// por scripts/ghibli/build.mjs — arquivos SVG em /public/ghibli, com animação
// embutida: nuvens, folhas, chamas, ondas, notas musicais etc.).
import generatedImages from "../../scripts/ghibli/manifest.json";

export interface BankImage {
  id: string;
  theme: string;
  title: string;
  src: string;
  /** Vocabulário em Kreyòl para inspirar a legenda (edite à vontade). */
  kreyol: string;
  /** Legenda sugerida em português. */
  caption: string;
  /** Tema animado do estúdio (VIDEO_BACKGROUNDS) mais parecido — usado como fundo ambiente. */
  ambientTheme: string;
  isPrimary: boolean;
}

const IMAGE_THEMES_DATA: Omit<BankImage, "isPrimary">[] = [
  { id: "tecnologia", theme: "Tecnologia", title: "Oficina tecnológica no campo", src: "/ghibli/tecnologia.svg", kreyol: "Teknoloji", caption: "Teknoloji ede nou aprann pi vit. Você já usa tecnologia para estudar Kreyòl?", ambientTheme: "tecnologia" },
  { id: "natureza", theme: "Natureza", title: "Árvore ancestral e prado florido", src: "/ghibli/natureza.svg", kreyol: "Lanati", caption: "Lanati (natureza) é linda em qualquer idioma. Que palavras você já sabe sobre ela?", ambientTheme: "natureza" },
  { id: "cultura", theme: "Cultura", title: "Festa na praça com bandeirolas", src: "/ghibli/cultura.svg", kreyol: "Kilti", caption: "Kilti ayisyen (cultura haitiana) vive nas festas, na música e nas cores da praça.", ambientTheme: "cultura" },
  { id: "turismo", theme: "Turismo", title: "Vila costeira, farol e balão", src: "/ghibli/turismo.svg", kreyol: "Touris", caption: "Vai viajar? Aprenda o essencial de Kreyòl para se virar como touris.", ambientTheme: "turismo" },
  { id: "interior", theme: "Vida no interior", title: "Fazenda ao meio-dia", src: "/ghibli/interior.svg", kreyol: "Andeyò", caption: "A vida nan andeyò (no interior) tem outro ritmo — e muito vocabulário novo.", ambientTheme: "natureza" },
  { id: "danca", theme: "Dança", title: "Dança sob as lanternas", src: "/ghibli/danca.svg", kreyol: "Dans", caption: "Dans é alegria! Que tal aprender os verbos de movimento em Kreyòl?", ambientTheme: "festas" },
  { id: "geografia", theme: "Geografia", title: "Montanhas, rio e bússola", src: "/ghibli/geografia.svg", kreyol: "Jewografi", caption: "Jewografi: montanhas, rios e pontos cardeais — vocabulário para se orientar.", ambientTheme: "natureza" },
  { id: "historia", theme: "História", title: "Fortaleza de pedra no alto do morro", src: "/ghibli/historia.svg", kreyol: "Istwa", caption: "Istwa (história) explica quem somos. Um pedacinho da história do Haiti para hoje.", ambientTheme: "citadelle_gold" },
  { id: "cinema", theme: "Cinema", title: "Cinema de bairro ao entardecer", src: "/ghibli/cinema.svg", kreyol: "Sinema", caption: "Sinema é ótimo para treinar o ouvido. Vamos assistir e aprender juntos?", ambientTheme: "cinema" },
  { id: "musica", theme: "Música", title: "Palco ao ar livre", src: "/ghibli/musica.svg", kreyol: "Mizik", caption: "Mizik ayisyen: ritmo, tambor e vocabulário novo a cada refrão.", ambientTheme: "festas" },
  { id: "lazeres", theme: "Lazeres", title: "Tarde de piquenique e pipas", src: "/ghibli/lazeres.svg", kreyol: "Lwazi", caption: "Lwazi (lazer) também é hora de praticar: descreva seu fim de semana em Kreyòl!", ambientTheme: "natureza" },
  { id: "estoicismo", theme: "Estoicismo", title: "Pórtico de pedra e oliveiras", src: "/ghibli/estoicismo.svg", kreyol: "Sajès", caption: "Sajès (sabedoria): o que está sob nosso controle? Uma reflexão para o dia.", ambientTheme: "universidade" },
  { id: "religiao", theme: "Religião", title: "Capela na colina e luz sagrada", src: "/ghibli/religiao.svg", kreyol: "Relijyon", caption: "Relijyon e fé fazem parte do dia a dia — e do vocabulário — no Haiti.", ambientTheme: "caribbean_sunset" },
  { id: "gastronomia", theme: "Gastronomia", title: "Cozinha aconchegante", src: "/ghibli/gastronomia.svg", kreyol: "Manje", caption: "Manje ayisyen (comida haitiana): que prato você quer aprender a pedir em Kreyòl?", ambientTheme: "gastronomia" },
];

const generatedTitles = new Map(generatedImages.map((image) => [image.id, image.title]));

export const IMAGE_BANK: BankImage[] = IMAGE_THEMES_DATA.flatMap((image) =>
  Array.from({ length: 10 }, (_, variantIndex) => {
    const variant = variantIndex + 1;
    const id = variant === 1 ? image.id : `${image.id}-${String(variant).padStart(2, "0")}`;
    return {
      ...image,
      id,
      title: variant === 1 ? image.title : generatedTitles.get(id) ?? `${image.title} — Cena ${variant}`,
      src: `/ghibli/${id}.svg`,
      isPrimary: variant === 1,
    };
  })
);

export const IMAGE_THEMES = IMAGE_THEMES_DATA.map((image) => image.theme);

export function getBankImage(idOrSrc: string | null | undefined): BankImage | undefined {
  if (!idOrSrc) return undefined;
  return IMAGE_BANK.find((i) => i.id === idOrSrc || i.src === idOrSrc);
}

/** URLs de imagem aceitas em postagens: banco interno ou upload no Vercel Blob. */
export function isAllowedPostImageUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url) return false;
  if (/^\/ghibli\/[a-z0-9_-]+\.svg$/.test(url)) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}
