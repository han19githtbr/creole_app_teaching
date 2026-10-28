// Ícone (emoji) que representa EXATAMENTE o elemento rotulado na cena.
// Antes, o ícone da pílula vinha da ação animada (folha, ✨, 🌊...) e não do objeto: o "tambor" aparecia com uma folha.
// A busca é feita pelo nome em português (normalizado, sem acento); se não achar, tenta o francês e o crioulo.
import { KREYOL_TO_PT, type BankElement } from "@/lib/imageBank";

const norm = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/** Nome normalizado em português → emoji do objeto. */
const ICONS: Record<string, string> = {
  // Tecnologia
  computador: "💻", robo: "🤖", drone: "🚁", "moinho de vento": "🌬️", satelite: "🛰️", "painel solar": "🔆",
  "celular/telefone": "📱", laboratorio: "🔬", "tela/monitor": "🖥️", antena: "📡",
  // Natureza e cenário
  arvore: "🌳", arvores: "🌳", flores: "🌸", borboleta: "🦋", passaro: "🐦", montanha: "⛰️", montanhas: "⛰️",
  "montanhas ao fundo": "⛰️", rio: "🏞️", cachoeira: "💦", mar: "🌊", agua: "💧", palmeira: "🌴", tartaruga: "🐢",
  sol: "☀️", lua: "🌙", nuvem: "☁️", ceu: "🌤️", grama: "🌱", areia: "🏖️", piso: "🟫", estrelas: "⭐",
  floresta: "🌲", ilha: "🏝️", praia: "🏖️", vulcao: "🌋", "pedra/rocha": "🪨", caminho: "🛤️", ponte: "🌉",
  trigo: "🌾", oliveira: "🫒", "jardim/plantacao": "🌱",
  // Cultura, casas e lugares
  tambor: "🥁", bandeira: "🚩", lanterna: "🏮", "lanterna/lampada": "🏮", lanternas: "🏮", casa: "🏠",
  "casa historica": "🏛️", mascara: "🎭", "comerciante/feira": "🛒", dancarinos: "💃", "comida tipica": "🍲",
  vestimentas: "👗", "guarda-sol/sombrinha": "⛱️", igreja: "⛪", "igreja/capela": "⛪", cruz: "✝️", sino: "🔔",
  vitral: "🪟", hotel: "🏨", fazenda: "🐄", portao: "🚪", cerca: "🚧", poco: "🪣", monumento: "🗿", estatua: "🗽",
  colunas: "🏛️", fortaleza: "🏰", canhao: "💣", tocha: "🔥", velas: "🕯️", pergaminho: "📜", livro: "📖",
  "filosofo sabio": "🧓", "sabio/filosofo": "🧓", familia: "👨‍👩‍👧", espectadores: "👥",
  // Turismo, lazer, viagem
  barco: "⛵", balao: "🎈", farol: "🗼", aviao: "✈️", bussola: "🧭", fitas: "🎀", mapa: "🗺️", "mala de viagem": "🧳",
  bicicleta: "🚲", pipa: "🪁", bola: "⚽", balanco: "🛝", "cesta de piquenique": "🧺", "toalha de piquenique": "🧺",
  // Idiomas
  dicionario: "📚", "globo terrestre": "🌍", "baloes de conversa": "💬", "letras do alfabeto": "🔤", caderno: "📓",
  lapis: "✏️", "quadro-negro": "🪧", professor: "🧑‍🏫", aluno: "🧑‍🎓",
  // Cinema, música, dança
  cinema: "🎬", pipoca: "🍿", projetor: "📽️", ingresso: "🎟️", camera: "📷", "luzes/holofotes": "🔦", palco: "🎪",
  violao: "🎸", "violao/guitarra": "🎸", piano: "🎹", "teclado musical": "🎹", microfone: "🎤", "alto-falante": "🔊",
  "fones de ouvido": "🎧", "notas musicais": "🎶", musica: "🎵", leque: "🪭",
  // Gastronomia e animais
  prato: "🍽️", mesa: "🍽️", cadeiras: "🪑", garfo: "🍴", faca: "🔪", garrafa: "🍾", "jarro/anfora": "🏺",
  legumes: "🥕", frutas: "🍎", pao: "🍞", "panela/caldeirao": "🍲", pimentas: "🌶️", peixe: "🐟", peixes: "🐟",
  tubarao: "🦈", pescador: "🎣", remador: "🚣", raposa: "🦊", coelho: "🐇", cavalo: "🐴", cabra: "🐐", galinha: "🐔",
  pato: "🦆", pomba: "🕊️", pombas: "🕊️", "pomba branca": "🕊️", trator: "🚜",
  // Cultura e Natureza (cenas diversificadas)
  "trompete de bambu": "🎺",
  "chapeu de palha": "👒",
  "cesta de vime": "🧺",
  "pote de barro": "🏺",
  "pintura": "🖼️",
  "colar de contas": "📿",
  "xale": "🧣",
  "cadeira de palha": "🪑",
  "tap-tap (onibus colorido)": "🚌",
  "burro": "🐴",
  "casa de palha": "🛖",
  "casa com varanda": "🏠",
  "fonte": "⛲",
  "coreto": "🎪",
  "rolos de tecido": "🧵",
  "penacho de plumas": "🪶",
  "fantasia de carnaval": "🎭",
  "estandarte": "🚩",
  "corneta de metal": "📯",
  "teatro de fantoches": "🎭",
  "fogueira": "🔥",
  "bolsa de palha": "👜",
  "lenco madras": "🧕",
  "contadora de historias": "👵",
  "crianca": "🧒",
  "pintor (artista)": "🧑‍🎨",
  "senhor idoso com bengala": "👴",
  "canoa de madeira": "🛶",
  "cana-de-acucar": "🎋",
  "saco de cafe": "☕",
  "forja com bigorna": "⚒️",
  "maraca": "🎶",
  "cabaca": "🥥",
  "pilao de madeira": "🪵",
  "escultura de metal": "🗿",
  "beija-flor": "🐦",
  "lagartixa": "🦎",
  "caranguejo": "🦀",
  "estrela-do-mar": "⭐",
  "concha do mar": "🐚",
  "golfinho": "🐬",
  "baleia": "🐋",
  "flamingo": "🦩",
  "pelicano": "🐦",
  "veado": "🦌",
  "esquilo": "🐿️",
  "vaga-lumes": "✨",
  "coruja": "🦉",
  "abelha": "🐝",
  "folhas grandes": "🌿",
  "cogumelos": "🍄",
  "samambaia": "🌿",
  "bambuzal": "🎋",
  "cacto": "🌵",
  "rochas": "🪨",
  "caverna": "🕳️",
  "arco-iris": "🌈",
  "ilhota": "🏝️",
  "penhasco": "⛰️",
  "duna de areia": "🏜️",
  "lagoa": "💧",
  "nenufares": "🌸",
  "bananeira": "🍌",
  "girassois": "🌻",
  "lirios brancos": "🌷",
  "pinheiro": "🌲",
  "gaviao": "🦅",
  "sapo": "🐸",
  "mangue (manguezal)": "🌳",
  "coral": "🐠",
  "ninho": "🥚",
  // Elementos diversificados dos temas
  "turbina eolica": "🌬️",
  "telefone": "📱",
  "tela": "🖥️",
  "torre de antena": "📡",
  "impressora 3d": "🧊",
  "bateria": "🔋",
  "braco robotico": "🦾",
  "teclado": "⌨️",
  "mouse de computador": "🖱️",
  "tablet": "📲",
  "microscopio": "🔬",
  "telescopio": "🔭",
  "radio": "📻",
  "lampada": "💡",
  "servidor": "🗄️",
  "carro eletrico": "🚗",
  "carregador de carro": "🔌",
  "oculos de realidade virtual": "🥽",
  "balao de ar quente": "🎈",
  "passaporte": "📘",
  "maquina fotografica": "📸",
  "mochila": "🎒",
  "barraca de camping": "⛺",
  "onibus de turismo": "🚌",
  "trem": "🚂",
  "guia turistico": "🧑‍🏫",
  "placa de direcao": "🪧",
  "binoculos": "🔭",
  "guarda-sol de praia": "⛱️",
  "cadeira de praia": "🪑",
  "coco com canudo": "🥥",
  "bilhete de viagem": "🎫",
  "torre de observacao": "🗼",
  "teleferico": "🚡",
  "scooter": "🛵",
  "galo": "🐓",
  "cerca de madeira": "🚧",
  "casa de fazenda": "🏡",
  "celeiro": "🏚️",
  "vaca": "🐄",
  "porco": "🐖",
  "ovelha": "🐑",
  "sacos de graos": "🛍️",
  "carroca": "🛒",
  "rastelo": "🧹",
  "enxada": "⚒️",
  "cesta de ovos": "🥚",
  "espantalho": "🧑‍🌾",
  "mangueira": "🥭",
  "horta": "🥕",
  "colmeia": "🐝",
  "fardo de feno": "🌾",
  "dancarina": "💃",
  "dancarino": "🕺",
  "bailarina de bale": "🩰",
  "sapatilhas de bale": "🩰",
  "fita de ginastica": "🎀",
  "vestido de flamenco": "👗",
  "saia rodada": "👗",
  "espelho de ensaio": "🪞",
  "barra de bale": "🏋️",
  "globo de espelhos": "🪩",
  "holofote": "🔦",
  "tapete de danca": "🟦",
  "castanholas": "🎶",
  "acordeao": "🪗",
  "violino": "🎻",
  "flauta": "🎼",
  "trompete": "🎺",
  "coroa de flores": "🌺",
  "mapa-mundi": "🗺️",
  "montanha com neve": "🏔️",
  "geleira": "🧊",
  "canion": "🏜️",
  "planalto": "🏞️",
  "termometro": "🌡️",
  "tornado": "🌪️",
  "nuvem de chuva": "🌧️",
  "raio de tempestade": "⚡",
  "cidade": "🏙️",
  "continente": "🌎",
  "caravela": "⛵",
  "espada": "🗡️",
  "elmo de cavaleiro": "⛑️",
  "escudo medieval": "🛡️",
  "piramide": "🔺",
  "bau de tesouro": "💰",
  "mapa antigo": "🗺️",
  "pena e tinteiro": "🪶",
  "lanca": "🔱",
  "coroa": "👑",
  "trono": "🪑",
  "anfora": "🏺",
  "lamparina a oleo": "🪔",
  "velas acesas": "🕯️",
  "muralha": "🧱",
  "coluna grega": "🏛️",
  "ancora": "⚓",
  "saxofone": "🎷",
  "partitura": "🎼",
  "metronomo": "⏱️",
  "xilofone": "🎶",
  "pandeiro": "🪘",
  "harpa": "🎼",
  "contrabaixo": "🎻",
  "clarinete": "🎶",
  "trombone": "🎺",
  "djembe": "🥁",
  "gramofone": "📻",
  "disco de vinil": "💿",
  "caixa de musica": "🎵",
  "cantora": "🧑‍🎤",
  "maestro": "🎼",
  "sintetizador": "🎹",
  "amplificador": "🔊",
};

/** Alguns elementos do banco trazem o nome em Kreyòl no campo `pt`; mapeamos esses nomes também. */
const KREYOL_ICONS: Record<string, string> = {
  fwi: "🍎", piman: "🌶️", chodyè: "🍲", pen: "🍞", tanbou: "🥁", drapo: "🚩", kay: "🏠", nyaj: "☁️", syèl: "🌤️",
  sòlèy: "☀️", lalin: "🌙", pyebwa: "🌳", flè: "🌸", bato: "⛵", pwason: "🐟", zwazo: "🐦", liv: "📖", legliz: "⛪",
  klòch: "🔔", zetwal: "⭐", lanmè: "🌊", dlo: "💧", zèb: "🌱", sab: "🏖️", mòn: "⛰️", rivyè: "🏞️", lanp: "🏮",
};

/** Palavras-chave para nomes compostos que não estão na lista exata (ex.: "casa de pedra", "barco de pesca"). */
const KEYWORDS: [string, string][] = [
  ["tambor", "🥁"], ["bandeira", "🚩"], ["lanterna", "🏮"], ["casa", "🏠"], ["montanha", "⛰️"], ["nuvem", "☁️"],
  ["arvore", "🌳"], ["flor", "🌸"], ["barco", "⛵"], ["peixe", "🐟"], ["passaro", "🐦"], ["livro", "📖"],
  ["igreja", "⛪"], ["sino", "🔔"], ["estrela", "⭐"], ["pomba", "🕊️"], ["mar", "🌊"], ["rio", "🏞️"],
  ["sol", "☀️"], ["lua", "🌙"], ["ceu", "🌤️"], ["agua", "💧"], ["musica", "🎶"], ["danca", "💃"],
];

/** Emoji neutro (só marca o ponto) quando o objeto não tem um ícone próprio. */
export const GENERIC_ELEMENT_ICON = "📍";

function lookup(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const key = norm(name);
  if (!key) return undefined;
  if (ICONS[key]) return ICONS[key];
  // "celular/telefone": tenta cada parte separada por "/"
  for (const part of key.split("/")) {
    const trimmed = part.trim();
    if (ICONS[trimmed]) return ICONS[trimmed];
  }
  // Palavras soltas do nome (ex.: "lanterna de papel")
  const words = key.split(/[\s/,-]+/).filter(Boolean);
  for (const word of words) {
    const singular = word.endsWith("s") ? word.slice(0, -1) : word;
    for (const [keyword, icon] of KEYWORDS) {
      if (word === keyword || singular === keyword) return icon;
    }
  }
  return undefined;
}

// Francês → português (só o necessário para achar o ícone quando o nome em português não bate).
const FR_TO_ICON: Record<string, string> = {
  tambour: "🥁", drapeau: "🚩", lanterne: "🏮", lanternes: "🏮", maison: "🏠", montagne: "⛰️", montagnes: "⛰️",
  nuage: "☁️", ciel: "🌤️", soleil: "☀️", lune: "🌙", arbre: "🌳", arbres: "🌳", fleurs: "🌸", bateau: "⛵",
  poisson: "🐟", oiseau: "🐦", livre: "📖", eglise: "⛪", cloche: "🔔", etoiles: "⭐", mer: "🌊", eau: "💧",
  herbe: "🌱", sable: "🏖️", masque: "🎭", phare: "🗼", avion: "✈️", cinema: "🎬", violon: "🎻",
};

/** Ícone do elemento rotulado: sempre derivado do próprio objeto, nunca da animação. */
export function getElementIcon(element: Pick<BankElement, "pt" | "kreyol" | "fr">): string {
  return (
    lookup(element.pt) ??
    (element.fr ? FR_TO_ICON[norm(element.fr)] ?? lookup(element.fr) : undefined) ??
    lookup(KREYOL_TO_PT[element.kreyol]) ??
    KREYOL_ICONS[element.kreyol.toLowerCase().trim()] ??
    KREYOL_ICONS[element.pt.toLowerCase().trim()] ??
    GENERIC_ELEMENT_ICON
  );
}
