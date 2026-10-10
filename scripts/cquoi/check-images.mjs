// Confere se todas as imagens listadas em src/lib/cquoiItems.json existem em public/.
// Uso: node scripts/cquoi/check-images.mjs
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const items = JSON.parse(readFileSync(resolve("src/lib/cquoiItems.json"), "utf8"));
const missing = items.filter((i) => !existsSync(resolve("public" + i.scene)));
console.log(`${items.length} imagens no catálogo.`);
if (missing.length === 0) console.log("✔ Todas as imagens existem.");
else {
  console.log(`✖ ${missing.length} imagem(ns) faltando em public/:`);
  missing.forEach((i) => console.log("  -", i.scene));
  process.exitCode = 1;
}
