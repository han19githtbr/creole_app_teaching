import fs from "fs";
import path from "path";

// 1. Gather all elements from diverse themes
const diverseDir = "scripts/ghibli/diverse";
const themeFiles = {
  "Tecnologia": "theme-tecnologia.mjs",
  "Natureza": "natureza-els.mjs",
  "Cultura": "cultura-els.mjs",
  "Turismo": "theme-turismo.mjs",
  "Vida no interior": "theme-interior.mjs",
  "Dança": "theme-danca.mjs",
  "Geografia": "theme-geografia.mjs",
  "História": "theme-historia.mjs",
  "Cinema": "theme-cinema.mjs",
  "Música": "theme-musica.mjs",
  "Lazeres": "theme-lazeres.mjs",
  "Estoicismo": "theme-estoicismo.mjs",
  "Religião": "theme-religiao.mjs",
  "Gastronomia": "theme-gastronomia.mjs",
  "Idiomas": "theme-idiomas.mjs",
};

const details = {};

for (const [theme, file] of Object.entries(themeFiles)) {
  details[theme] = {};
  const filePath = path.join(diverseDir, file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, "utf8");
  // regex for entries: key: { ... k: "...", pt: "...", fr: "..." ... }
  const regex = /(\w+)\s*:\s*\{[^}]*k\s*:\s*"([^"]+)"[^}]*pt\s*:\s*"([^"]+)"[^}]*fr\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const [, objId, k, pt, fr] = m;
    details[theme][objId] = { kreyol: k, pt, fr };
  }
}

// Add known Gastronomia / Idiomas / primary entries
if (details["Gastronomia"]) {
  details["Gastronomia"]["milk"] = { kreyol: "lèt", pt: "garrafa de leite", fr: "lait" };
  details["Gastronomia"]["bread"] = { kreyol: "pen", pt: "pão", fr: "pain" };
  details["Gastronomia"]["fruit"] = { kreyol: "fwi", pt: "frutas", fr: "fruits" };
  details["Gastronomia"]["pepper"] = { kreyol: "piman", pt: "pimentas", fr: "piments" };
}
if (details["Idiomas"]) {
  details["Idiomas"]["letters"] = { kreyol: "lèt", pt: "letras do alfabeto", fr: "lettres" };
  details["Idiomas"]["lèt"] = { kreyol: "lèt", pt: "letras do alfabeto", fr: "lettres" };
}
if (details["Tecnologia"]) {
  details["Tecnologia"]["keyboard"] = { kreyol: "klavye", pt: "teclado", fr: "clavier" };
}

fs.writeFileSync("src/lib/themeElementDetails.json", JSON.stringify(details, null, 2) + "\n", "utf8");
console.log("Generated themeElementDetails.json with themes:", Object.keys(details));
console.log("Gastronomia elements:", Object.keys(details["Gastronomia"]));
console.log("Gastronomia milk:", details["Gastronomia"]["milk"]);
