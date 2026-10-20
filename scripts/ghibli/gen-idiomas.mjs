// Gera os DADOS do tema "Idiomas" a partir das cenas de idiomas-lib.mjs:
//  - src/lib/imageSceneVariants.json  → entrada "Idiomas" (vocabulário em Kreyòl + 19 cenas variantes)
//  - src/lib/storyElementAnchors.json → posição exata (% da imagem 1200x800) de cada elemento rotulado
//  - src/lib/storyElementExtras.json  → detalhes extras da cena (sol/lua, nuvem, céu) com posição
// Rode da raiz do projeto: node scripts/ghibli/gen-idiomas.mjs   (depois: node scripts/ghibli/build-master.mjs)
import fs from "node:fs";
import path from "node:path";
import { buildScene, SCENES } from "./idiomas-lib.mjs";

const THEME = "Idiomas";

// Vocabulário do tema: id do objeto → Kreyòl.
const LABELS = {
  book: "liv",
  dictionary: "diksyonè",
  globe: "glòb",
  speech: "dyalòg",
  letters: "lèt",
  flag: "drapo",
  headphones: "kas",
  notebook: "kaye",
  pencil: "kreyon",
  blackboard: "tablo",
  teacher: "pwofesè",
  student: "elèv",
  mic: "mikwofòn",
  computer: "òdinatè",
  map: "kat",
};

const PALETTE = { dia: "dia", sunset: "entardecer", night: "night" };
const round1 = (n) => Math.round(n * 10) / 10;
const pct = ([x, y]) => [round1((x / 1200) * 100), round1((y / 800) * 100)];

const readJson = (p) => JSON.parse(fs.readFileSync(path.resolve(p), "utf8"));

// 1) imageSceneVariants.json
const variantsPath = "./src/lib/imageSceneVariants.json";
const variants = readJson(variantsPath);
variants[THEME] = {
  options: Object.values(LABELS),
  labels: LABELS,
  scenes: SCENES.slice(1).map((scene) => ({
    title: scene.title,
    setting: scene.setting,
    palette: PALETTE[scene.palette] ?? scene.palette,
    objects: scene.labelIds,
  })),
};
fs.writeFileSync(path.resolve(variantsPath), JSON.stringify(variants, null, 2), "utf8");

// 2) âncoras e extras. Os arquivos são JSON em linha única: só acrescentamos as entradas do tema ao final
// (idempotente: se já existirem, são substituídas), sem reformatar as entradas dos outros temas.
const anchorsPath = path.resolve("./src/lib/storyElementAnchors.json");
const extrasPath = path.resolve("./src/lib/storyElementExtras.json");

const anchorEntries = {};
const extraEntries = {};
SCENES.forEach((_, index) => {
  const id = index === 0 ? "idiomas" : `idiomas-${String(index + 1).padStart(2, "0")}`;
  const built = buildScene(index);
  anchorEntries[id] = built.anchors.map(pct);
  extraEntries[id] = built.extras.map(([key, x, y]) => [key, ...pct([x, y])]);
});

function appendEntries(file, entries) {
  let raw = fs.readFileSync(file, "utf8").trimEnd();
  const cut = raw.indexOf(',"idiomas":');
  if (cut >= 0) raw = `${raw.slice(0, cut)}}`;
  const body = Object.entries(entries)
    .map(([key, value]) => `${JSON.stringify(key)}:${JSON.stringify(value)}`)
    .join(",");
  const merged = `${raw.slice(0, -1)},${body}}`;
  JSON.parse(merged); // garante que continua válido
  fs.writeFileSync(file, merged, "utf8");
}

appendEntries(anchorsPath, anchorEntries);
appendEntries(extrasPath, extraEntries);
console.log(`Tema ${THEME}: ${SCENES.length} cenas, ${Object.keys(LABELS).length} palavras de vocabulário. Dados gravados.`);
