// Banco de imagens em estilo Studio Ghibli (ilustrações artísticas
// com elementos realistas e reconhecíveis, arquivos SVG em /public/ghibli).
import generatedImages from "../../scripts/ghibli/manifest.json";

export interface BankElement {
  kreyol: string;
  pt: string;
}

export interface StoryLabelLayout {
  top: number;
  left: number;
  width: number;
  align: "center" | "left" | "right";
  anchors: { left: number; top: number }[];
}

export interface BankImage {
  id: string;
  theme: string;
  title: string;
  src: string;
  /** Vocabulário principal em Kreyòl */
  kreyol: string;
  /** Legenda sugerida em português com vocabulário em Kreyòl */
  caption: string;
  /** Tema animado do estúdio (VIDEO_BACKGROUNDS) mais parecido */
  ambientTheme: string;
  isPrimary: boolean;
  /** Ajuste visual fino para posicionar os rótulos acima dos elementos visuais de cada cena. */
  labelLayout?: StoryLabelLayout;
  /** Elementos reconhecíveis na cena para o jogo e lições */
  elements: BankElement[];
}

const STORY_LABEL_LAYOUTS: Record<string, StoryLabelLayout> = {
  tecnologia: { top: 13, left: 49, width: 80, align: "center", anchors: [{ left: 28, top: 69 }, { left: 46, top: 69 }, { left: 57, top: 32 }, { left: 30, top: 50 }] },
  natureza: { top: 12, left: 52, width: 84, align: "center", anchors: [{ left: 50, top: 37 }, { left: 25, top: 82 }, { left: 75, top: 40 }, { left: 77, top: 24 }] },
  cultura: { top: 11, left: 50, width: 72, align: "center", anchors: [{ left: 25, top: 64 }, { left: 50, top: 28 }, { left: 78, top: 28 }, { left: 50, top: 68 }] },
  turismo: { top: 13, left: 51, width: 82, align: "center", anchors: [{ left: 48, top: 65 }, { left: 25, top: 62 }, { left: 76, top: 25 }, { left: 85, top: 48 }] },
  interior: { top: 10, left: 50, width: 86, align: "center", anchors: [{ left: 50, top: 58 }, { left: 22, top: 36 }, { left: 51, top: 78 }, { left: 80, top: 65 }] },
  danca: { top: 10, left: 47, width: 76, align: "center", anchors: [{ left: 48, top: 56 }, { left: 24, top: 24 }, { left: 76, top: 25 }, { left: 78, top: 78 }] },
  geografia: { top: 11, left: 53, width: 80, align: "center", anchors: [{ left: 26, top: 37 }, { left: 51, top: 68 }, { left: 76, top: 70 }, { left: 75, top: 25 }] },
  historia: { top: 12, left: 52, width: 78, align: "center", anchors: [{ left: 50, top: 35 }, { left: 76, top: 23 }, { left: 25, top: 68 }, { left: 77, top: 68 }] },
  cinema: { top: 11, left: 54, width: 76, align: "center", anchors: [{ left: 50, top: 38 }, { left: 27, top: 72 }, { left: 77, top: 20 }, { left: 20, top: 38 }] },
  musica: { top: 12, left: 48, width: 74, align: "center", anchors: [{ left: 26, top: 61 }, { left: 49, top: 67 }, { left: 74, top: 35 }, { left: 80, top: 68 }] },
  lazeres: { top: 11, left: 52, width: 82, align: "center", anchors: [{ left: 72, top: 22 }, { left: 50, top: 69 }, { left: 20, top: 36 }, { left: 50, top: 82 }] },
  estoicismo: { top: 12, left: 50, width: 74, align: "center", anchors: [{ left: 25, top: 47 }, { left: 50, top: 70 }, { left: 78, top: 37 }, { left: 78, top: 67 }] },
  religiao: { top: 12, left: 50, width: 78, align: "center", anchors: [{ left: 50, top: 40 }, { left: 28, top: 70 }, { left: 77, top: 27 }, { left: 51, top: 20 }] },
  gastronomia: { top: 12, left: 50, width: 80, align: "center", anchors: [{ left: 48, top: 61 }, { left: 25, top: 67 }, { left: 75, top: 45 }, { left: 78, top: 69 }] },
};

const IMAGE_THEMES_DATA: Omit<BankImage, "isPrimary" | "labelLayout">[] = [
  {
    id: "tecnologia",
    theme: "Tecnologia",
    title: "Oficina tecnológica no campo",
    src: "/ghibli/tecnologia.svg",
    kreyol: "Teknoloji",
    caption: "Teknoloji ede nou aprann pi vit. Você já usa tecnologia para estudar Kreyòl? Identifique o computador (òdinatè), robô (robo), drone (dròn) e o moinho (moulen van)!",
    ambientTheme: "tecnologia",
    elements: [
      { kreyol: "òdinatè", pt: "computador" },
      { kreyol: "robo", pt: "robô" },
      { kreyol: "dròn", pt: "drone" },
      { kreyol: "moulen van", pt: "moinho de vento" },
    ],
  },
  {
    id: "natureza",
    theme: "Natureza",
    title: "Árvore ancestral e prado florido",
    src: "/ghibli/natureza.svg",
    kreyol: "Lanati",
    caption: "Lanati (natureza) é linda em qualquer idioma! Veja a grande árvore (pyebwa), as flores (flè), as borboletas (papiyon) e o pássaro tropical (zwazo).",
    ambientTheme: "natureza",
    elements: [
      { kreyol: "pyebwa", pt: "árvore" },
      { kreyol: "flè", pt: "flores" },
      { kreyol: "papiyon", pt: "borboleta" },
      { kreyol: "zwazo", pt: "pássaro" },
    ],
  },
  {
    id: "cultura",
    theme: "Cultura",
    title: "Festa na praça com bandeirolas",
    src: "/ghibli/cultura.svg",
    kreyol: "Kilti",
    caption: "Kilti ayisyen (cultura haitiana) brilha com o tambor tradicional (tanbou), a bandeira (drapo), as lanternas acolhedoras (lanp) e as casas típicas (kay).",
    ambientTheme: "cultura",
    elements: [
      { kreyol: "tanbou", pt: "tambor" },
      { kreyol: "drapo", pt: "bandeira" },
      { kreyol: "lanp", pt: "lanterna/lâmpada" },
      { kreyol: "kay", pt: "casa" },
    ],
  },
  {
    id: "turismo",
    theme: "Turismo",
    title: "Vila costeira, farol e balão",
    src: "/ghibli/turismo.svg",
    kreyol: "Touris",
    caption: "Touris (turismo): explore o mar caribenho (lanmè), o barco a vela (bato), o farol na falésia (fa) e o balão de ar quente (balon).",
    ambientTheme: "turismo",
    elements: [
      { kreyol: "bato", pt: "barco" },
      { kreyol: "lanmè", pt: "mar" },
      { kreyol: "balon", pt: "balão" },
      { kreyol: "fa", pt: "farol" },
    ],
  },
  {
    id: "interior",
    theme: "Vida no interior",
    title: "Fazenda ao meio-dia",
    src: "/ghibli/interior.svg",
    kreyol: "Andeyò",
    caption: "Nan andeyò (no interior): sinta a tranquilidade da casa da fazenda (kay), árvores frutíferas (pyebwa), plantação/jardim (jaden) e cerca de madeira (kloti).",
    ambientTheme: "natureza",
    elements: [
      { kreyol: "kay", pt: "casa" },
      { kreyol: "pyebwa", pt: "árvore" },
      { kreyol: "jaden", pt: "jardim/plantação" },
      { kreyol: "kloti", pt: "cerca" },
    ],
  },
  {
    id: "danca",
    theme: "Dança",
    title: "Dança sob as lanternas",
    src: "/ghibli/danca.svg",
    kreyol: "Dans",
    caption: "Dans se lavi! Dançarinos festivos (dansè) giram sob o brilho das lanternas (lanp), com fitas coloridas (riban) e flores (flè).",
    ambientTheme: "festas",
    elements: [
      { kreyol: "dansè", pt: "dançarinos" },
      { kreyol: "lanp", pt: "lanternas" },
      { kreyol: "riban", pt: "fitas" },
      { kreyol: "flè", pt: "flores" },
    ],
  },
  {
    id: "geografia",
    theme: "Geografia",
    title: "Montanhas, rio e bússola",
    src: "/ghibli/geografia.svg",
    kreyol: "Jewografi",
    caption: "Jewografi: aprenda a se orientar com montanhas imponentes (mòn), o rio cristalino (rivyè), a bússola de latão (bousòl) e a bandeira no topo (drapo).",
    ambientTheme: "natureza",
    elements: [
      { kreyol: "mòn", pt: "montanhas" },
      { kreyol: "rivyè", pt: "rio" },
      { kreyol: "bousòl", pt: "bússola" },
      { kreyol: "drapo", pt: "bandeira" },
    ],
  },
  {
    id: "historia",
    theme: "História",
    title: "Fortaleza de pedra no alto do morro",
    src: "/ghibli/historia.svg",
    kreyol: "Istwa",
    caption: "Istwa (história) e resistência: a imponente fortaleza Citadelle (fò), a bandeira do Haiti (drapo), os canhões históricos (kanon) e a tocha de fogo (flanbo).",
    ambientTheme: "citadelle_gold",
    elements: [
      { kreyol: "fò", pt: "fortaleza" },
      { kreyol: "drapo", pt: "bandeira" },
      { kreyol: "kanon", pt: "canhão" },
      { kreyol: "flanbo", pt: "tocha" },
    ],
  },
  {
    id: "cinema",
    theme: "Cinema",
    title: "Cinema de bairro ao entardecer",
    src: "/ghibli/cinema.svg",
    kreyol: "Sinema",
    caption: "Sinema é maravilhoso para treinar o ouvido: a fachada do cinema iluminado (sinema), pipoca quentinha (pòp-kòn), estrelas no céu (zetwal) e árvores (pyebwa).",
    ambientTheme: "cinema",
    elements: [
      { kreyol: "sinema", pt: "cinema" },
      { kreyol: "pòp-kòn", pt: "pipoca" },
      { kreyol: "zetwal", pt: "estrelas" },
      { kreyol: "pyebwa", pt: "árvores" },
    ],
  },
  {
    id: "musica",
    theme: "Música",
    title: "Palco ao ar livre",
    src: "/ghibli/musica.svg",
    kreyol: "Mizik",
    caption: "Mizik ayisyen tem alma e ritmo: o violão acústico (gita), o tambor tradicional (tanbou), as notas musicais no ar (nòt mizik) e a caixa de som (opalè).",
    ambientTheme: "festas",
    elements: [
      { kreyol: "gita", pt: "violão" },
      { kreyol: "tanbou", pt: "tambor" },
      { kreyol: "nòt mizik", pt: "notas musicais" },
      { kreyol: "opalè", pt: "alto-falante" },
    ],
  },
  {
    id: "lazeres",
    theme: "Lazeres",
    title: "Tarde de piquenique e pipas",
    src: "/ghibli/lazeres.svg",
    kreyol: "Lwazi",
    caption: "Lwazi (lazer) num dia de sol: pipa colorida no céu (kap), bicicleta retrô (bisiklèt), sombra da grande árvore (pyebwa) e toalha na grama (dra).",
    ambientTheme: "natureza",
    elements: [
      { kreyol: "kap", pt: "pipa" },
      { kreyol: "bisiklèt", pt: "bicicleta" },
      { kreyol: "pyebwa", pt: "árvore" },
      { kreyol: "dra", pt: "toalha de piquenique" },
    ],
  },
  {
    id: "estoicismo",
    theme: "Estoicismo",
    title: "Pórtico de pedra e oliveiras",
    src: "/ghibli/estoicismo.svg",
    kreyol: "Sajès",
    caption: "Sajès (sabedoria): colunas clássicas (kolòn), livro aberto de reflexões (liv), oliveira centenária (pye oliv) e o sábio contemplando a vida (moun saj).",
    ambientTheme: "universidade",
    elements: [
      { kreyol: "kolòn", pt: "colunas" },
      { kreyol: "liv", pt: "livro" },
      { kreyol: "pye oliv", pt: "oliveira" },
      { kreyol: "moun saj", pt: "filósofo sábio" },
    ],
  },
  {
    id: "religiao",
    theme: "Religião",
    title: "Capela na colina e luz sagrada",
    src: "/ghibli/religiao.svg",
    kreyol: "Relijyon",
    caption: "Fé e esperança: a capela histórica (legliz), a cruz sagrada (kwa), velas acesas acolhedoras (bouji) e pombas brancas voando para a luz (pijon).",
    ambientTheme: "caribbean_sunset",
    elements: [
      { kreyol: "legliz", pt: "igreja/capela" },
      { kreyol: "bouji", pt: "velas" },
      { kreyol: "pijon", pt: "pombas" },
      { kreyol: "kwa", pt: "cruz" },
    ],
  },
  {
    id: "gastronomia",
    theme: "Gastronomia",
    title: "Cozinha aconchegante",
    src: "/ghibli/gastronomia.svg",
    kreyol: "Manje",
    caption: "Manje ayisyen saboroso: o caldeirão fumegante no fogão (chodyè), pão artesanal crocante (pen), frutas tropicais frescas (fwi) e pimentas aromáticas (piman).",
    ambientTheme: "gastronomia",
    elements: [
      { kreyol: "chodyè", pt: "panela/caldeirão" },
      { kreyol: "pen", pt: "pão" },
      { kreyol: "fwi", pt: "frutas" },
      { kreyol: "piman", pt: "pimentas" },
    ],
  },
];

import imageSceneVariants from "./imageSceneVariants.json";

const KREYOL_TO_PT: Record<string, string> = {
  // Tecnologia
  "òdinatè": "computador",
  "robo": "robô",
  "dròn": "drone",
  "moulen van": "moinho de vento",
  "satelit": "satélite",
  "panno solè": "painel solar",
  "telefòn": "celular/telefone",
  "laboratwa": "laboratório",
  "ekran": "tela/monitor",
  "antèn": "antena",
  // Natureza
  "pyebwa": "árvore",
  "flè": "flores",
  "papiyon": "borboleta",
  "zwazo": "pássaro",
  "mòn": "montanha",
  "rivyè": "rio",
  "kaskad": "cachoeira",
  "lanmè": "mar",
  "palmis": "palmeira",
  "tòti": "tartaruga",
  // Cultura
  "tanbou": "tambor",
  "drapo": "bandeira",
  "lanp": "lanterna",
  "kay": "casa",
  "mask": "máscara",
  "machann": "comerciante/feira",
  "dansè": "dançarinos",
  "manje": "comida típica",
  "rad": "vestimentas",
  "parapli": "guarda-sol/sombrinha",
  // Turismo
  "bato": "barco",
  "balon": "balão",
  "fa": "farol",
  "avyon": "avião",
  "valiz": "mala de viagem",
  "kat": "mapa",
  "otèl": "hotel",
  "plaj": "praia",
  // Vida no interior
  "jaden": "jardim/plantação",
  "kloti": "cerca",
  "fèm": "fazenda",
  "ble": "trigo",
  "kabrit": "cabra",
  "pi": "poço",
  "poul": "galinha",
  "traktè": "trator",
  // Dança
  "riban": "fitas",
  "mizik": "música",
  "fan": "leque",
  "sèn": "palco",
  // Geografia
  "bousòl": "bússola",
  "zile": "ilha",
  "vòlkan": "vulcão",
  "pon": "ponte",
  "forè": "floresta",
  // História
  "fò": "fortaleza",
  "kanon": "canhão",
  "flanbo": "tocha",
  "wòch": "pedra/rocha",
  "chwal": "cavalo",
  "liv": "livro",
  "ansyen kay": "casa histórica",
  "moniman": "monumento",
  // Cinema
  "sinema": "cinema",
  "pòp-kòn": "pipoca",
  "zetwal": "estrelas",
  "kamera": "câmera",
  "projèktè": "projetor",
  "tikè": "ingresso",
  "chèz": "cadeiras",
  // Música
  "gita": "violão/guitarra",
  "nòt mizik": "notas musicais",
  "opalè": "alto-falante",
  "mikwofòn": "microfone",
  "piano": "piano",
  "klavye": "teclado musical",
  "kas": "fones de ouvido",
  "limyè": "luzes/holofotes",
  // Lazeres
  "kap": "pipa",
  "bisiklèt": "bicicleta",
  "dra": "toalha de piquenique",
  "boul": "bola",
  "balanse": "balanço",
  "piknik": "cesta de piquenique",
  "kanna": "pato",
  // Estoicismo
  "kolòn": "colunas",
  "pye oliv": "oliveira",
  "moun saj": "sábio/filósofo",
  "pòtay": "portão",
  "chemen": "caminho",
  "estati": "estátua",
  "krich": "jarro/ânfora",
  "woulo": "pergaminho",
  // Religião
  "legliz": "igreja",
  "bouji": "velas",
  "pijon": "pomba branca",
  "kwa": "cruz",
  "vitral": "vitral",
  "klòch": "sino",
  // Gastronomia
  "legim": "legumes",
  "tab": "mesa",
  "asyèt": "prato",
  "kouto": "faca",
  "fouchèt": "garfo",
  "boutèy": "garrafa",
};

const sceneVariantsTyped = imageSceneVariants as Record<
  string,
  {
    options: string[];
    labels: Record<string, string>;
    scenes: { title: string; setting: string; palette: string; objects: string[] }[];
  }
>;

const generatedTitles = new Map(generatedImages.map((image) => [image.id, image.title]));

export const IMAGE_BANK: BankImage[] = IMAGE_THEMES_DATA.flatMap((image) =>
  Array.from({ length: 20 }, (_, variantIndex) => {
    const variant = variantIndex + 1;
    const id = variant === 1 ? image.id : `${image.id}-${String(variant).padStart(2, "0")}`;
    const variantScene = variant > 1 ? sceneVariantsTyped[image.theme]?.scenes[variant - 2] : undefined;
    const title =
      variant === 1
        ? image.title
        : generatedTitles.get(id) ?? variantScene?.title ?? `${image.title} — Cena ${variant}`;

    let elements = image.elements;
    let caption = image.caption;

    if (variantScene && sceneVariantsTyped[image.theme]) {
      const themeLabels = sceneVariantsTyped[image.theme].labels;
      elements = variantScene.objects.map((obj) => {
        const kreyol = themeLabels[obj] ?? obj;
        return {
          kreyol,
          pt: KREYOL_TO_PT[kreyol] ?? kreyol,
        };
      });
      caption = `${title} (${image.theme}): identifique na cena ${elements
        .map((e) => `${e.pt} (${e.kreyol})`)
        .join(", ")}.`;
    }

    return {
      ...image,
      id,
      title,
      src: `/ghibli/${id}.svg`,
      caption,
      isPrimary: variant === 1,
      labelLayout: STORY_LABEL_LAYOUTS[image.id] ?? { top: 12, left: 50, width: 78, align: "center" },
      elements,
    };
  })
);

export const IMAGE_THEMES = IMAGE_THEMES_DATA.map((image) => image.theme);

export function getBankImage(idOrSrc: string | null | undefined): BankImage | undefined {
  if (!idOrSrc) return undefined;
  return IMAGE_BANK.find((i) => i.id === idOrSrc || i.src === idOrSrc);
}

export function getStoryLabelLayout(idOrSrc: string | null | undefined): StoryLabelLayout {
  const bankImage = getBankImage(idOrSrc);
  return bankImage?.labelLayout ?? {
    top: 12,
    left: 50,
    width: 78,
    align: "center",
    anchors: [{ left: 25, top: 30 }, { left: 75, top: 30 }, { left: 25, top: 70 }, { left: 75, top: 70 }],
  };
}

/** URLs de imagem aceitas em postagens: banco Ghibli (/ghibli/* em svg, png, webp, jpg) ou upload Vercel Blob. */
export function isAllowedPostImageUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url) return false;
  if (/^\/(ghibli|images)\/[a-z0-9_-]+\.(svg|png|webp|jpg|jpeg)$/i.test(url)) return true;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (u.hostname.endsWith(".public.blob.vercel-storage.com") ||
        u.hostname.endsWith(".vercel-storage.com"))
    );
  } catch {
    return false;
  }
}

