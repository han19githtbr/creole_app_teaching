// Conteúdo e montagem das alternativas do "C'est quoi ?" (sem React, utilizável no servidor).
import hintsData from "@/lib/cquoiHints.json";

export interface CquoiHint {
  /** Dica em português: como o objeto é (sem dizer o nome). */
  d: string;
  /** Para que o objeto serve. */
  u: string;
  /** Frase em francês que descreve o objeto (nível Nativo · Frase). */
  f?: string;
  /** Vídeo opcional (MP4) com o uso do objeto. Ex.: /c-quoi/dicas/tecnologia-drone.mp4 */
  v?: string;
}

export interface CestQuoiItem {
  id: string;
  themeId: string;
  theme: string;
  fr: string; // "Un fouet"
  article: string;
  name: string;
  speak: string;
  scene: string;
  w: number;
  h: number;
  arrow: { x: number; y: number };
  /** Dica própria do item (imagens geradas por IA trazem a sua). */
  hint?: CquoiHint;
}

const HINTS = hintsData as Record<string, CquoiHint>;

export interface ResolvedHint extends CquoiHint {
  /** true quando o item não tem dica escrita e o texto é genérico. */
  generic: boolean;
}

export function getHint(item: CestQuoiItem): ResolvedHint {
  const own = item.hint ?? HINTS[item.id];
  if (own?.d && own.u) return { ...own, generic: false };
  return {
    d: `Este objeto faz parte do tema ${item.theme}. Observe a forma, as cores e o lugar onde ele aparece na cena: a seta vermelha mostra exatamente qual é.`,
    u: "Pense em como as pessoas usam esse objeto no dia a dia e em que situação ele costuma aparecer.",
    generic: true,
  };
}

/** Só entram no nível "Nativo · Frase" os itens que têm frase escrita. */
export function hasPhrase(item: CestQuoiItem): boolean {
  const hint = item.hint ?? HINTS[item.id];
  return Boolean(hint?.f);
}

export function phraseOf(item: CestQuoiItem): string {
  return (item.hint ?? HINTS[item.id])?.f ?? "";
}

/** "Un ordinateur portable" → "o••••••••• p••••••••" (nome sem artigo, só a 1ª letra de cada palavra). */
export function maskName(item: CestQuoiItem): string {
  return item.name
    .split(/\s+/)
    .map((word) => {
      const chars = [...word];
      return chars[0] + "•".repeat(Math.max(0, chars.length - 1));
    })
    .join("  ");
}

// ---------------------------------------------------------------------------
// Alternativas erradas "justas": nunca podem ser, também, uma resposta verdadeira
// ---------------------------------------------------------------------------
// Grupos de objetos parecidos. Dois itens do mesmo grupo nunca aparecem juntos nas alternativas.
const CONFUSABLE_GROUPS: string[][] = [
  ["estoicismo-cle", "estoicismo-cadenas", "tecnologia-cle-usb", "musica-cle-sol"],
  ["danca-chapeau", "cultura-chapeau-paille"],
  ["turismo-lunettes-soleil", "cinema-lunettes-3d"],
  ["cultura-tambour", "danca-tambourin", "musica-batterie"],
  ["cinema-projecteur", "cinema-spot", "cinema-ecran", "cinema-bobine"],
  ["religiao-bougie", "estoicismo-lampe-huile", "historia-torche", "cultura-lanterne", "tecnologia-ampoule"],
  ["lazeres-ballon", "lazeres-basket"],
  ["turismo-voilier", "estoicismo-ancre", "turismo-phare"],
  ["historia-epee", "historia-bouclier", "historia-casque", "historia-arc", "historia-canon"],
  ["natureza-arbre", "natureza-feuille"],
  ["natureza-fleur", "natureza-tournesol", "danca-rose", "religiao-lotus"],
  ["geografia-boussole", "geografia-rose-vents", "geografia-carte", "geografia-globe"],
  ["cinema-camera", "turismo-appareil-photo"],
  ["tecnologia-ordinateur", "tecnologia-tablette", "tecnologia-telephone", "tecnologia-clavier", "tecnologia-souris"],
  ["gastronomia-casserole", "gastronomia-poele"],
  ["gastronomia-louche", "gastronomia-spatule", "gastronomia-fouet"],
  ["estoicismo-sablier", "estoicismo-horloge", "musica-metronome"],
  ["turismo-sac-a-dos", "turismo-valise"],
  ["interior-seau", "interior-arrosoir", "interior-panier", "interior-puits"],
  ["interior-pelle", "interior-fourche", "interior-rateau"],
  ["historia-couronne", "estoicismo-laurier", "historia-sceptre", "historia-trone"],
  ["religiao-eglise", "religiao-cloche", "religiao-vitrail", "religiao-mosquee", "religiao-pagode"],
  ["musica-flute", "musica-trompette", "musica-saxophone", "musica-harmonica"],
  ["cultura-vase", "historia-amphore"],
  ["cultura-poupee", "cultura-marionnette"],
  ["historia-parchemin", "estoicismo-livre", "religiao-bible", "estoicismo-plume", "estoicismo-encrier"],
  ["lazeres-skate", "lazeres-patins", "lazeres-surf"],
  ["danca-chaussons", "danca-claquettes", "danca-talons", "danca-tutu"],
  ["musica-casque", "historia-casque"],
];

const STOP_WORDS = new Set(["un", "une", "des", "du", "de", "la", "le", "les", "et", "pour", "avec", "sur"]);

function nameWords(item: CestQuoiItem): Set<string> {
  return new Set(
    item.name
      .toLowerCase()
      .split(/[^a-zàâçéèêëîïôûùüÿœ]+/i)
      .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
  );
}

/** true se `other` pode ser confundido com `item` (mesmo grupo ou nome em comum) e, por isso, não serve de alternativa errada. */
export function isConfusable(item: CestQuoiItem, other: CestQuoiItem): boolean {
  if (item.id === other.id || item.fr === other.fr) return true;
  if (CONFUSABLE_GROUPS.some((group) => group.includes(item.id) && group.includes(other.id))) return true;
  const a = nameWords(item);
  for (const word of nameWords(other)) if (a.has(word)) return true;
  return false;
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(item: CestQuoiItem, pool: CestQuoiItem[], valueOf: (i: CestQuoiItem) => string, sameThemeCount: number): string[] {
  const others = pool.filter((o) => !isConfusable(item, o) && valueOf(o));
  const same = shuffle(others.filter((o) => o.themeId === item.themeId));
  const rest = shuffle(others.filter((o) => o.themeId !== item.themeId));
  const picked: string[] = [];
  for (const o of [...same.slice(0, sameThemeCount), ...rest, ...same.slice(sameThemeCount)]) {
    if (picked.length >= 3) break;
    const value = valueOf(o);
    if (!picked.includes(value)) picked.push(value);
  }
  return picked;
}

/** 4 alternativas de palavra. `hard` (Nativo) usa 3 objetos do mesmo tema, bem mais difíceis de separar. */
export function buildWordOptions(item: CestQuoiItem, pool: CestQuoiItem[], hard = false): string[] {
  return shuffle([item.fr, ...pickDistractors(item, pool, (o) => o.fr, hard ? 3 : 2)]);
}

/** 4 frases em francês: a que descreve a imagem + 3 que descrevem outros objetos. */
export function buildPhraseOptions(item: CestQuoiItem, pool: CestQuoiItem[]): string[] {
  return shuffle([phraseOf(item), ...pickDistractors(item, pool, phraseOf, 2)]);
}
