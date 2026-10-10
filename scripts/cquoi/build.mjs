// Gera a coleção "C'est quoi ?" (mesmo formato das imagens de public/c-quoi):
//   public/c-quoi/collection/<tema>/<id>-scene.svg      cena (sem seta) usada no jogo
//   public/c-quoi/collection/<tema>/<id>-question.svg  imagem completa: seta + boneco pensando + relógio
//   public/c-quoi/collection/<tema>/<id>-answer.svg    imagem completa: seta + boneco feliz + "✔ Un objet."
//   src/lib/cquoiItems.json                              catálogo lido pelo jogo
// Os 7 utensílios de cozinha vêm das fotos originais (scripts/cquoi/extract_scenes.py).
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { composite, sceneOnly, SCENE_H, W } from "./lib.mjs";
import * as o1 from "./objects-1.mjs";
import * as o2 from "./objects-2.mjs";
import * as o3 from "./objects-3.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = join(root, "public", "c-quoi", "collection");

// mesma ordem dos temas da parte em crioulo
const THEMES = [o1.TECNOLOGIA, o1.NATUREZA, o1.CULTURA, o1.TURISMO, o2.INTERIOR, o2.DANCA, o2.GEOGRAFIA, o2.HISTORIA, o3.CINEMA, o3.MUSICA, o3.LAZERES, o3.ESTOICISMO, o3.RELIGIAO];

const split = (fr) => { const [art, ...rest] = fr.split(" "); return { article: art, name: rest.join(" ") }; };
const items = [];

for (const theme of THEMES) {
  mkdirSync(join(out, theme.id), { recursive: true });
  theme.items.forEach((it, k) => {
    const uid = `${theme.id}${k}`;
    const scene = it.draw(uid);
    const tip = { x: it.tip[0], y: it.tip[1] };
    const base = join(out, theme.id, it.id);
    writeFileSync(`${base}-scene.svg`, sceneOnly(scene));
    writeFileSync(`${base}-question.svg`, composite(scene, tip, "question", it.fr));
    writeFileSync(`${base}-answer.svg`, composite(scene, tip, "answer", it.fr));
    const { article, name } = split(it.fr);
    items.push({
      id: `${theme.id}-${it.id}`, themeId: theme.id, theme: theme.label, fr: it.fr, article, name, speak: it.fr.toLowerCase(),
      scene: `/c-quoi/collection/${theme.id}/${it.id}-scene.svg`, w: W, h: SCENE_H, arrow: tip,
      question: `/c-quoi/collection/${theme.id}/${it.id}-question.svg`, answer: `/c-quoi/collection/${theme.id}/${it.id}-answer.svg`,
    });
  });
}

// Gastronomia = os utensílios das imagens originais do usuário
const kitchen = JSON.parse(readFileSync(join(root, "scripts", "cquoi", "kitchen.json"), "utf8"));
for (const k of kitchen) {
  const { article, name } = split(k.fr);
  items.push({ id: `gastronomia-${k.id}`, themeId: "gastronomia", theme: "Gastronomia", fr: k.fr, article, name, speak: k.fr.toLowerCase(), scene: k.scene, w: k.w, h: k.h, arrow: k.arrow });
}

writeFileSync(join(root, "src", "lib", "cquoiItems.json"), JSON.stringify(items, null, 1));
console.log(`${items.length} objetos em ${new Set(items.map((i) => i.themeId)).size} temas`);
