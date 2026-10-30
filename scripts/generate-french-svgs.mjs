// Gera as versões em francês (public/ghibli/fr/*.svg) das ilustrações do banco.
//
// Os SVGs originais trazem rótulos em Kreyòl dentro da própria imagem (ex.: "LÈT" na garrafa
// de leite). No painel em francês esses textos precisam aparecer em francês ("LAIT").
//
// Em vez de uma lista fixa de IDs, o script VARRE todos os SVGs de public/ghibli, aplica a
// tabela de tradução abaixo aos conteúdos de <text> e aos sufixos de <title>, e só grava em
// /fr os arquivos que realmente mudaram. Também escreve src/lib/frenchImageIds.json, que o app
// usa para saber quais imagens têm versão francesa. Rode: node scripts/generate-french-svgs.mjs
//
// Para cobrir um novo rótulo em Kreyòl, basta acrescentar uma linha em TEXT_RULES.
import fs from "fs";
import path from "path";

const inDir = "public/ghibli";
const outDir = "public/ghibli/fr";
const idsFile = "src/lib/frenchImageIds.json";

/**
 * Regras de <text>. `from` é o conteúdo exato do elemento (sem espaços nas pontas).
 * `attrs` (opcional) ajusta atributos do <text> quando o texto francês é mais longo.
 */
const TEXT_RULES = [
  // Gastronomia
  { from: "LÈT", to: "LAIT" },
  // Idiomas
  { from: "Kaye", to: "Cahier" },
  {
    from: "DIKSYONÈ",
    to: "DICTIONNAIRE",
    // 12 letras na capa de 100px: fonte menor e menos espaçamento entre letras.
    attrs: (a) => a.replace(/font-size="15"/, 'font-size="11"').replace(/letter-spacing="2"/, 'letter-spacing="0.2"'),
  },
  { from: "kay", to: "maison" },
  { from: "flè", to: "fleur" },
  { from: "Alo!", to: "Allô !" },
  { from: "Bonjou  Bonjour", to: "Bonjour  Olá" },
  { from: "Olá  Hello", to: "Hello  Salut" },
  { from: "Bonjou", to: "Salut" },
  // Tecnologia
  { from: "KREYÒL v2.0", to: "FRANÇAIS v2.0" },
  { from: "Teknoloji...", to: "Technologie..." },
  { from: "Aprann pi vit!", to: "Apprendre plus vite !" },
  // Cinema
  { from: "SINEMA", to: "CINÉMA" },
  { from: "SAL SINEMA KREYÒL", to: "SALLE DE CINÉMA" },
  // Turismo (Icaraí)
  { from: "Touris — Niterói", to: "Tourisme — Niterói" },
  { from: "Icaraí / Mize Nimeye (MAC)", to: "Icaraí / Musée Niemeyer (MAC)" },
  { from: "lame", to: "mer" },
  { from: "bato", to: "bateau" },
  { from: "mize", to: "musée" },
  { from: "plaj", to: "plage" },
  { from: "mòn", to: "montagne" },
  { from: "pye bwa", to: "arbre" },
  { from: "gòlèt", to: "mouette" },
];

/** Sufixo do <title> ("Vila costeira, farol e balão - Touris") → tema em francês. */
const TITLE_SUFFIX = {
  Touris: "Tourisme",
  Sinema: "Cinéma",
  Mizik: "Musique",
  Lang: "Langues",
  Lanati: "Nature",
  Manje: "Gastronomie",
  Relijyon: "Religion",
  Dans: "Danse",
  Teknoloji: "Technologie",
  Istwa: "Histoire",
  "Andeyò": "Campagne",
  Jewografi: "Géographie",
  Lwazi: "Loisirs",
  Kilti: "Culture",
  "Sajès": "Stoïcisme",
};

const textRuleByFrom = new Map(TEXT_RULES.map((r) => [r.from, r]));

function translateSvg(src) {
  let out = src.replace(/<text([^>]*)>([^<]*)<\/text>/g, (whole, attrs, content) => {
    const rule = textRuleByFrom.get(content.trim().replace(/^>\s*/, ""));
    if (!rule) return whole;
    const lead = content.match(/^\s*/)[0];
    const trail = content.match(/\s*$/)[0];
    return `<text${rule.attrs ? rule.attrs(attrs) : attrs}>${lead}${rule.to}${trail}</text>`;
  });
  out = out.replace(/<title>([^<]*) - ([^<-]+)<\/title>/, (whole, head, suffix) =>
    TITLE_SUFFIX[suffix.trim()] ? `<title>${head} - ${TITLE_SUFFIX[suffix.trim()]}</title>` : whole
  );
  return out;
}

fs.mkdirSync(outDir, { recursive: true });
// Recria /fr do zero: nenhum arquivo antigo ou obsoleto fica para trás.
for (const f of fs.readdirSync(outDir)) if (f.endsWith(".svg")) fs.rmSync(path.join(outDir, f));

const ids = [];
for (const file of fs.readdirSync(inDir).filter((f) => f.endsWith(".svg")).sort()) {
  const original = fs.readFileSync(path.join(inDir, file), "utf8");
  const translated = translateSvg(original);
  if (translated === original) continue;
  fs.writeFileSync(path.join(outDir, file), translated, "utf8");
  ids.push(file.replace(/\.svg$/, ""));
}
fs.writeFileSync(idsFile, JSON.stringify(ids, null, 2) + "\n", "utf8");

console.log(`${ids.length} SVGs em francês gerados em ${outDir}`);
console.log(`Lista de IDs gravada em ${idsFile}`);
