// Banco de imagens em estilo Studio Ghibli (ilustrações artísticas
// com elementos realistas e reconhecíveis, arquivos SVG em /public/ghibli).
import generatedImages from "../../scripts/ghibli/manifest.json";
import measuredAnchors from "./storyElementAnchors.json";
import measuredExtras from "./storyElementExtras.json";
import themeElementDetails from "./themeElementDetails.json";
import type { AppLanguage } from "./languageShared";
import { KREYOL_TO_FR, kreyolToFrench, themeToFrench } from "./frenchVocabulary";

export interface BankElement {
  kreyol: string;
  pt: string;
  fr?: string;
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
  /** URL da versão em francês da imagem, quando existir texto localizado nela. */
  srcFr?: string;
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
  /**
   * Elementos que de fato aparecem desenhados na ilustração (subconjunto de `elements`, na mesma ordem).
   * Só estes recebem rótulo na história, e `labelLayout.anchors` está alinhado a esta lista.
   */
  storyElements?: BankElement[];
  /** Desafio do jogo de identificar elementos (imagens geradas por IA já trazem o seu). */
  quiz?: { options: string[]; answers: string[] };
  /** true = imagem gerada por IA (guardada no R2 e cadastrada no banco de dados). */
  generated?: boolean;
}

const STORY_LABEL_LAYOUTS: Record<string, StoryLabelLayout> = {
  tecnologia: { top: 13, left: 49, width: 80, align: "center", anchors: [{ left: 28, top: 69 }, { left: 46, top: 69 }, { left: 57, top: 32 }, { left: 30, top: 50 }] },
  natureza: { top: 12, left: 52, width: 84, align: "center", anchors: [{ left: 24, top: 35 }, { left: 34, top: 85 }, { left: 58, top: 52 }, { left: 31, top: 41 }] },
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
  idiomas: { top: 12, left: 50, width: 80, align: "center", anchors: [{ left: 39, top: 72 }, { left: 15, top: 63 }, { left: 83, top: 62 }, { left: 63, top: 69 }] },
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
    id: "turismo-icarai",
    theme: "Turismo",
    title: "Praia de Icarai e MAC Niteroi",
    src: "/ghibli/turismo-icarai.svg",
    kreyol: "Touris - Icarai / Niteroi",
    caption: "Touris Niteroi: Praia Icarai (plaj), museu MAC de Niemeyer (mize), mar da Baia de Guanabara (lame), barco a vela (bato), caiaque vermelho (kayak) e morro com vegetacao (mon).",
    ambientTheme: "turismo",
    elements: [
      { kreyol: "plaj", pt: "praia" },
      { kreyol: "mize", pt: "museu" },
      { kreyol: "lame", pt: "mar/baia" },
      { kreyol: "bato", pt: "barco" },
      { kreyol: "kayak", pt: "caiaque" },
      { kreyol: "mon", pt: "morro/montanha" },
      { kreyol: "pye bwa", pt: "arvore" },
      { kreyol: "golet", pt: "gaivota" },
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
  {
    id: "idiomas",
    theme: "Idiomas",
    title: "Sala de aula de idiomas",
    src: "/ghibli/idiomas.svg",
    kreyol: "Lang",
    caption: "Lang (idiomas) aproximam os povos! Na sala de aula de idiomas veja o livro aberto (liv), o globo terrestre (glòb), os balões de conversa (dyalòg) e as letras do alfabeto (lèt).",
    ambientTheme: "chalkboard",
    elements: [
      { kreyol: "liv", pt: "livro" },
      { kreyol: "glòb", pt: "globo terrestre" },
      { kreyol: "dyalòg", pt: "balões de conversa" },
      { kreyol: "lèt", pt: "letras do alfabeto" },
    ],
  },
];

import imageSceneVariants from "./imageSceneVariants.json";

export const KREYOL_TO_PT: Record<string, string> = {
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
  "mize": "museu",
  "lame": "mar/baia",
  "kayak": "caiaque",
  "golet": "gaivota",
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
  // Idiomas
  "diksyonè": "dicionário",
  "glòb": "globo terrestre",
  "dyalòg": "balões de conversa",
  "lèt": "letras do alfabeto",
  "kaye": "caderno",
  "kreyon": "lápis",
  "tablo": "quadro-negro",
  "pwofesè": "professor",
  "elèv": "aluno",
  // Cultura e Natureza (cenas diversificadas)
  "vaksin": "trompete de bambu",
  "tcha-tcha": "maracá",
  "chapo": "chapéu de palha",
  "panye": "cesta de vime",
  "kalbas": "cabaça",
  "mòtye": "pilão de madeira",
  "kannari": "pote de barro",
  "penti": "pintura",
  "eskilti": "escultura de metal",
  "kolye": "colar de contas",
  "chal": "xale",
  "evantay": "leque",
  "tap-tap": "tap-tap (ônibus colorido)",
  "bourik": "burro",
  "kay pay": "casa de palha",
  "balkon": "casa com varanda",
  "fontèn": "fonte",
  "kyòsk": "coreto",
  "twal": "rolos de tecido",
  "plim": "penacho de plumas",
  "kostim": "fantasia de carnaval",
  "banyè": "estandarte",
  "kòn": "corneta de metal",
  "teyat": "teatro de fantoches",
  "dife": "fogueira",
  "makout": "bolsa de palha",
  "foula": "lenço madras",
  "kontè": "contadora de histórias",
  "timoun": "criança",
  "atis": "pintor (artista)",
  "granmoun": "senhor idoso com bengala",
  "kanòt": "canoa de madeira",
  "kann": "cana-de-açúcar",
  "kafe": "saco de café",
  "fòj": "forja com bigorna",
  "kolibri": "beija-flor",
  "lèzar": "lagartixa",
  "krab": "caranguejo",
  "zetwal lanmè": "estrela-do-mar",
  "koki": "concha do mar",
  "pwason": "peixes",
  "dòfen": "golfinho",
  "balèn": "baleia",
  "flamen": "flamingo",
  "pelikan": "pelicano",
  "sèf": "veado",
  "lapen": "coelho",
  "ekirèy": "esquilo",
  "koukouy": "vaga-lumes",
  "chwèt": "coruja",
  "myèl": "abelha",
  "fèy": "folhas grandes",
  "chanpiyon": "cogumelos",
  "foujè": "samambaia",
  "bambou": "bambuzal",
  "kaktis": "cacto",
  "ròch": "rochas",
  "kavèn": "caverna",
  "lakansyèl": "arco-íris",
  "falèz": "penhasco",
  "din": "duna de areia",
  "letan": "lagoa",
  "nenifa": "nenúfares",
  "pye bannann": "bananeira",
  "tounesòl": "girassóis",
  "lis": "lírios brancos",
  "pen": "pinheiro",
  "malfini": "gavião",
  "krapo": "sapo",
  "manglye": "mangue (manguezal)",
  "koray": "coral",
  "nich": "ninho",
  // Elementos diversificados dos temas
  "enprimant 3D": "impressora 3D",
  "batri": "bateria",
  "bra robo": "braço robótico",
  "sourit": "mouse de computador",
  "tablèt": "tablet",
  "mikwoskòp": "microscópio",
  "telesko": "telescópio",
  "radyo": "rádio",
  "ampoul": "lâmpada",
  "sèvè": "servidor",
  "machin elektrik": "carro elétrico",
  "estasyon chaje": "carregador de carro",
  "kas VR": "óculos de realidade virtual",
  "pasp": "passaporte",
  "aparèy foto": "máquina fotográfica",
  "sak a do": "mochila",
  "tant": "barraca de camping",
  "bis touristik": "ônibus de turismo",
  "tren": "trem",
  "gid": "guia turístico",
  "siy": "placa de direção",
  "jumèl": "binóculos",
  "parasòl": "guarda-sol de praia",
  "chèz plaj": "cadeira de praia",
  "kokoye": "coco com canudo",
  "tou": "torre de observação",
  "teleferik": "teleférico",
  "skoutè": "scooter",
  "kòk": "galo",
  "moulen": "moinho de vento",
  "grenye": "celeiro",
  "bèf": "vaca",
  "kochon": "porco",
  "mouton": "ovelha",
  "sak ble": "sacos de grãos",
  "charèt": "carroça",
  "rato": "rastelo",
  "pyòch": "enxada",
  "panye ze": "cesta de ovos",
  "epouvantay": "espantalho",
  "pye mango": "mangueira",
  "ruch": "colmeia",
  "bòt pay": "fardo de feno",
  "dansè fi": "dançarina",
  "dansè gason": "dançarino",
  "balerin": "bailarina de balé",
  "soulye danse": "sapatilhas de balé",
  "rad flamenko": "vestido de flamenco",
  "jip woule": "saia rodada",
  "mirwa": "espelho de ensaio",
  "barè": "barra de balé",
  "boul diskò": "globo de espelhos",
  "pwojektè": "holofote",
  "tapi": "tapete de dança",
  "kastayèt": "castanholas",
  "akòdeyon": "acordeão",
  "vyolon": "violino",
  "flit": "flauta",
  "trompèt": "trompete",
  "kouwòn flè": "coroa de flores",
  "kat monn": "mapa-múndi",
  "mòn nèj": "montanha com neve",
  "glasye": "geleira",
  "kanyon": "cânion",
  "plato": "planalto",
  "tèmomèt": "termômetro",
  "tònad": "tornado",
  "nyaj lapli": "nuvem de chuva",
  "ekla": "raio de tempestade",
  "vil": "cidade",
  "kontinan": "continente",
  "lak": "lago",
  "karavèl": "caravela",
  "epe": "espada",
  "kask": "elmo de cavaleiro",
  "bouklye": "escudo medieval",
  "piramid": "pirâmide",
  "kòf trezò": "baú de tesouro",
  "kat ansyen": "mapa antigo",
  "parchemen": "pergaminho",
  "plim ak lank": "pena e tinteiro",
  "lans": "lança",
  "kouwòn": "coroa",
  "twòn": "trono",
  "anfò": "ânfora",
  "lanp lwil": "lamparina a óleo",
  "kloch": "sino",
  "chandèl": "velas acesas",
  "miray": "muralha",
  "ankre": "âncora",
  "pyano": "piano",
  "saksofòn": "saxofone",
  "mikwo": "microfone",
  "ekouteur": "fones de ouvido",
  "pàtisyon": "partitura",
  "metwonòm": "metrônomo",
  "silofòn": "xilofone",
  "tanbourin": "pandeiro",
  "ansanm tanbou": "bateria",
  "arp": "harpa",
  "kontrebas": "contrabaixo",
  "klarinèt": "clarinete",
  "trombòn": "trombone",
  "djembe": "djembê",
  "gramofòn": "gramofone",
  "vinil": "disco de vinil",
  "bwat mizik": "caixa de música",
  "chantè": "cantora",
  "dirijan": "maestro",
  "sentetizè": "sintetizador",
  "anplifikatè": "amplificador",
  "kamera sinema": "câmera de cinema",
  "pwojektè sinema": "projetor de cinema",
  "ekran sinema": "tela de cinema",
  "klakèt": "claquete",
  "pòpkòn": "pipoca",
  "bilyè sinema": "ingresso de cinema",
  "fotèy sinema": "poltrona de cinema",
  "megafòn": "megafone",
  "mikwo bom": "microfone de girafa",
  "bobin fim": "rolo de filme",
  "chèz direktè": "cadeira de diretor",
  "afich fim": "pôster de filme",
  "tapi wouj": "tapete vermelho",
  "twofe": "troféu dourado",
  "maske teyat": "máscaras de teatro",
  "lunèt 3D": "óculos 3D",
  "grèn kamera": "grua de câmera",
  "soda": "refrigerante",
  "bann fim": "tira de filme",
  "lanp studyo": "luz de estúdio",
  "ekran vèt": "tela verde",
  "boul foutbòl": "bola de futebol",
  "rakèt tenis": "raquete de tênis",
  "filè volebòl": "rede de vôlei",
  "panye piknik": "cesta de piquenique",
  "kann lapèch": "vara de pescar",
  "planch a woulèt": "skate",
  "balanswa": "balanço",
  "glisad": "escorregador",
  "pisin": "piscina",
  "hamak": "rede de descanso",
  "tablo echèk": "tabuleiro de xadrez",
  "kat jwe": "baralho",
  "domino": "dominó",
  "patin": "patins",
  "kòd sote": "corda de pular",
  "panye baskèt": "cesta de basquete",
  "kayak": "caiaque",
  "boukann": "churrasqueira",
  "tab pingpong": "mesa de pingue-pongue",
  "bist": "busto de filósofo",
  "sablye": "ampulheta",
  "balans": "balança da justiça",
  "oliv": "oliveira",
  "ban wòch": "banco de pedra",
  "tanp": "templo grego",
  "sandal": "sandálias de couro",
  "kouwòn lorye": "coroa de louros",
  "ròch ekilib": "pedras empilhadas",
  "mirwa men": "espelho de mão",
  "kle": "chave antiga",
  "chapèl": "capela",
  "bib": "bíblia",
  "vitraj": "vitral colorido",
  "òg": "órgão de igreja",
  "chaple": "terço",
  "kalis": "cálice",
  "kandelab": "candelabro",
  "zanj": "estátua de anjo",
  "kantik": "livro de cânticos",
  "branch palmis": "ramos de palmeira",
  "pen ak diven": "pão e vinho",
  "basen batèm": "pia batismal",
  "lakwa chemen": "cruzeiro de caminho",
  "klòchè": "campanário",
  "pòtay legliz": "portal de igreja",
  "banyè pwosesyon": "estandarte de procissão",
  "tab otèl": "altar",
  "marmit": "panela de ferro",
  "soup joumou": "sopa de abóbora",
  "diri ak pwa": "arroz com feijão",
  "bannann peze": "banana-da-terra frita",
  "griyo": "carne de porco frita",
  "pikliz": "conserva de repolho picante",
  "mango": "mangas",
  "fig": "cacho de bananas",
  "ananas": "abacaxi",
  "kouto ak fouchèt": "faca e garfo",
  "recho": "fogareiro a carvão",
  "ze": "ovos",
  "chokola": "chocolate quente",
  "labouyi": "mingau",
  "akra": "bolinhos fritos",
  "ji": "jarra de suco",
  "planch": "tábua de cortar",
  "kiyè bwa": "colher de pau",
  "liv ouvè": "livro aberto",
  "tablo nwa": "quadro-negro",
  "kib alfabè": "cubos do alfabeto",
  "etajè liv": "estante de livros",
  "kat vokabilè": "cartões de vocabulário",
  "pipit": "carteira escolar",
  "sak lekòl": "mochila escolar",
  "règ": "régua",
  "gonm": "borracha",
  "alfabè": "cartaz do alfabeto",
  "bul diskisyon": "balões de fala",
  "lanp biwo": "luminária de mesa",
  "revèy": "relógio de parede",
  "anvlòp": "carta em envelope",
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

/**
 * Detalhes gerais da cena que também ganham rótulo (até completar 8 por imagem): sol, nuvem, céu, chão...
 * A posição de cada um é medida na própria ilustração (storyElementExtras.json) e só entra se estiver visível.
 */
const EXTRA_DETAIL_NAMES: Record<string, BankElement> = {
  sol: { kreyol: "sòlèy", fr: "soleil", pt: "sol" },
  lua: { kreyol: "lalin", fr: "lune", pt: "lua" },
  nuvem: { kreyol: "nyaj", fr: "nuage", pt: "nuvem" },
  ceu: { kreyol: "syèl", fr: "ciel", pt: "céu" },
  montanhas: { kreyol: "mòn", fr: "montagnes", pt: "montanhas ao fundo" },
  grama: { kreyol: "zèb", fr: "herbe", pt: "grama" },
  areia: { kreyol: "sab", fr: "sable", pt: "areia" },
  piso: { kreyol: "plancher", fr: "sol", pt: "piso" },
  agua: { kreyol: "dlo", fr: "eau", pt: "água" },
};

/**
 * Posições MEDIDAS de cada elemento em cada ilustração (scripts/ghibli/measure-anchors.mjs + revisão visual).
 * Cada ponto cai dentro do objeto que o nome descreve (em % da imagem 1200x800); `null` = o elemento
 * não está desenhado nessa ilustração, então não recebe rótulo na história.
 */
function measuredStoryLayout(
  id: string,
  elements: BankElement[],
  base: StoryLabelLayout | undefined
): { storyElements?: BankElement[]; labelLayout?: StoryLabelLayout } {
  const measured = (measuredAnchors as unknown as Record<string, ([number, number] | null)[]>)[id];
  if (!measured || measured.length !== elements.length) return {};
  const storyElements: BankElement[] = [];
  const anchors: { left: number; top: number }[] = [];
  elements.forEach((element, index) => {
    const point = measured[index];
    if (!point) return;
    storyElements.push(element);
    // O palco 16:9 corta ~8% em cima/embaixo da imagem 3:2; mantém o ponto dentro da área visível.
    anchors.push({ left: Math.min(96, Math.max(4, point[0])), top: Math.min(90, Math.max(10, point[1])) });
  });
  // Detalhes extras da cena (sol, nuvem, céu, chão...) até somar 8 rótulos.
  const extras = (measuredExtras as unknown as Record<string, [string, number, number][]>)[id] ?? [];
  for (const [key, x, y] of extras) {
    const detail = EXTRA_DETAIL_NAMES[key];
    if (!detail || storyElements.length >= 8) continue;
    storyElements.push(detail);
    anchors.push({ left: Math.min(96, Math.max(4, x)), top: Math.min(90, Math.max(10, y)) });
  }
  return {
    storyElements,
    labelLayout: { top: base?.top ?? 12, left: base?.left ?? 50, width: base?.width ?? 78, align: base?.align ?? "center", anchors },
  };
}


export const FRENCH_IMAGE_IDS = new Set([
  "cinema",
  "gastronomia-02",
  "gastronomia-10",
  "gastronomia-15",
  "gastronomia-20",
  "idiomas-03",
  "idiomas-04",
  "idiomas-09",
  "idiomas-13",
  "idiomas-14",
  "idiomas-16",
  "idiomas-17",
  "idiomas-20",
  "tecnologia",
  "turismo-icarai",
]);

export function getLanguageImageSrc(src: string | null | undefined, language: AppLanguage = "kreyol"): string {
  if (!src) return "";
  if (language === "francais") {
    if (src.startsWith("/ghibli/fr/")) return src;
    if (src.startsWith("/ghibli/")) {
      const id = src.replace("/ghibli/", "").replace(/\.(svg|png|webp|jpe?g)$/i, "");
      if (FRENCH_IMAGE_IDS.has(id)) {
        return `/ghibli/fr/${id}.svg`;
      }
    }
    return src;
  }
  if (src.startsWith("/ghibli/fr/")) {
    return src.replace("/ghibli/fr/", "/ghibli/");
  }
  return src;
}

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
      const detailsMap = (themeElementDetails as Record<string, Record<string, BankElement>>)[image.theme];
      elements = variantScene.objects.map((obj) => {
        const detail = detailsMap?.[obj];
        const kreyol = detail?.kreyol ?? themeLabels[obj] ?? obj;
        const pt = detail?.pt ?? KREYOL_TO_PT[kreyol] ?? kreyol;
        const fr = detail?.fr ?? (kreyol === "lèt" && (pt.includes("leite") || !pt.includes("alfabeto")) ? "lait" : KREYOL_TO_FR[kreyol]);
        return {
          kreyol,
          pt,
          ...(fr ? { fr } : {}),
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
      srcFr: FRENCH_IMAGE_IDS.has(id) ? `/ghibli/fr/${id}.svg` : undefined,
      caption,
      isPrimary: variant === 1,
      labelLayout: STORY_LABEL_LAYOUTS[image.id] ?? { top: 12, left: 50, width: 78, align: "center" },
      elements,
      ...measuredStoryLayout(id, elements, STORY_LABEL_LAYOUTS[image.id]),
    };
  })
);

export const IMAGE_THEMES = IMAGE_THEMES_DATA.map((image) => image.theme);

export function getBankImage(idOrSrc: string | null | undefined, language?: AppLanguage): BankImage | undefined {
  if (!idOrSrc) return undefined;
  const clean = idOrSrc.split("?")[0];
  const normalizedSrc = clean.replace("/ghibli/fr/", "/ghibli/");
  const idFromSrc = clean.replace(/^\/ghibli\/(?:fr\/)?/, "").replace(/\.(svg|png|webp|jpe?g)$/i, "");
  const base = IMAGE_BANK.find((i) => i.id === clean || i.id === idFromSrc || i.src === clean || i.src === normalizedSrc);
  if (!base) return undefined;
  if (language === "francais" && base.srcFr) {
    return { ...base, src: base.srcFr };
  }
  return base;
};
}

/** URLs de imagem aceitas em postagens: banco Ghibli (/ghibli/*), imagens geradas por IA (/gen/*) ou upload Vercel Blob. */
export function isAllowedPostImageUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url) return false;
  if (/^\/(ghibli(\/fr)?|images|gen)\/[a-z0-9_-]+\.(svg|png|webp|jpg|jpeg)$/i.test(url)) return true;
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

export const PT_TO_FR: Record<string, string> = {
  "garrafa de leite": "bouteille de lait",
  "leite": "lait",
  "colher de pau": "cuillère en bois",
  "tábua de cortar": "planche à découper",
  "ovos": "œufs",
  "teclado": "clavier",
  "computador": "ordinateur",
  "robô": "robot",
  "drone": "drone",
  "moinho de vento": "moulin à vent",
  "satélite": "satellite",
  "painel solar": "panneau solaire",
  "celular/telefone": "téléphone portable",
  "laboratório": "laboratoire",
  "tela/monitor": "écran",
  "antena": "antenne",
  "árvore": "arbre",
  "árvores": "arbres",
  "flores": "fleurs",
  "borboleta": "papillon",
  "pássaro": "oiseau",
  "montanha": "montagne",
  "montanhas": "montagnes",
  "rio": "rivière",
  "cachoeira": "cascade",
  "mar": "mer",
  "palmeira": "palmier",
  "tartaruga": "tortue",
  "tambor": "tambour",
  "bandeira": "drapeau",
  "lanterna": "lanterne",
  "lanterna/lâmpada": "lanterne",
  "lanternas": "lanternes",
  "casa": "maison",
  "máscara": "masque",
  "comerciante/feira": "marchand/marché",
  "dançarinos": "danseurs",
  "comida típica": "plat typique",
  "vestimentas": "vêtements",
  "guarda-sol/sombrinha": "parasol",
  "barco": "bateau",
  "balão": "montgolfière",
  "farol": "phare",
  "avião": "avion",
  "jardim/plantação": "jardin/plantation",
  "cerca": "clôture",
  "fitas": "rubans",
  "bússola": "boussole",
  "fortaleza": "forteresse",
  "canhão": "canon",
  "tocha": "torche",
  "cinema": "cinéma",
  "pipoca": "pop-corn",
  "estrelas": "étoiles",
  "violão": "guitare",
  "notas musicais": "notes de musique",
  "alto-falante": "haut-parleur",
  "pipa": "cerf-volant",
  "bicicleta": "vélo",
  "toalha de piquenique": "nappe de pique-nique",
  "colunas": "colonnes",
  "livro": "livre",
  "oliveira": "olivier",
  "filósofo sábio": "sage philosophe",
  "igreja/capela": "église/chapelle",
  "velas": "bougies",
  "pombas": "colombes",
  "cruz": "croix",
  "panela/caldeirão": "casserole/chaudron",
  "pão": "pain",
  "frutas": "fruits",
  "pimentas": "piments",
  "peixe": "poisson",
  "peixes": "poissons",
  "tubarão": "requin",
  "remador": "rameur",
  "pescador": "pêcheur",
  "coelho": "lapin",
  "raposa": "renard",
  "família": "famille",
  "espectadores": "spectateurs",
  "sino": "cloche",
  "dicionário": "dictionnaire",
  "globo terrestre": "globe terrestre",
  "balões de conversa": "bulles de dialogue",
  "letras do alfabeto": "lettres de l'alphabet",
  "caderno": "cahier",
  "lápis": "crayon",
  "quadro-negro": "tableau noir",
  "professor": "professeur",
  "aluno": "élève",
  "mapa": "carte",
  "microfone": "microphone",
  "fones de ouvido": "casque audio",
};

export function getElementLabel(element: BankElement, language: "kreyol" | "francais" = "kreyol"): string {
  if (language === "francais") {
    if (element.fr) return element.fr;
    if (KREYOL_TO_FR[element.kreyol] ?? KREYOL_TO_FR[element.kreyol.toLowerCase()]) return kreyolToFrench(element.kreyol);
    const lowerPt = element.pt.toLowerCase().trim();
    if (PT_TO_FR[lowerPt]) return PT_TO_FR[lowerPt];
    for (const [ptKey, frVal] of Object.entries(PT_TO_FR)) {
      if (lowerPt.includes(ptKey) || ptKey.includes(lowerPt)) return frVal;
    }
    return element.pt;
  }
  return element.kreyol;
}

/**
 * Legenda sugerida da imagem no idioma do painel. Em Kreyòl é a legenda do banco; em
 * francês refaz a frase com os nomes dos elementos em francês (português + francês).
 */
export function getImageCaption(image: BankImage, language: "kreyol" | "francais" = "kreyol"): string {
  if (language !== "francais" || !image.elements.length) return image.caption;
  const words = image.elements.map((element) => `${element.pt} (${getElementLabel(element, "francais")})`);
  return `${image.title} (${image.theme}): identifique na cena ${words.join(", ")}.`;
}

/** Vocabulário principal do tema (mostrado ao lado do nome do tema) no idioma do painel. */
export function getThemeVocab(image: Pick<BankImage, "theme" | "kreyol">, language: "kreyol" | "francais" = "kreyol"): string {
  return language === "francais" ? themeToFrench(image.theme) : image.kreyol;
}
