import fs from "fs";
import path from "path";

const inDir = "public/ghibli";
const outDir = "public/ghibli/fr";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Gastronomia (lèt -> lait)
const gastroIds = ["gastronomia-02", "gastronomia-10", "gastronomia-15", "gastronomia-20"];
for (const id of gastroIds) {
  const file = path.join(inDir, `${id}.svg`);
  const content = fs.readFileSync(file, "utf8");
  const frContent = content.replace(/>LÈT</g, ">LAIT<");
  fs.writeFileSync(path.join(outDir, `${id}.svg`), frContent, "utf8");
}

// 2. Idiomas
// Kaye -> Cahier
const kayeIds = ["idiomas-04", "idiomas-13", "idiomas-14"];
// DIKSYONÈ -> DICTIONNAIRE
const diksyonIds = ["idiomas-03", "idiomas-09", "idiomas-17"];
// flashcards (chat, kay, flè -> chat, maison, fleur)
const flashIds = ["idiomas-03", "idiomas-13", "idiomas-16", "idiomas-20"];

const allIdiomas = new Set([...kayeIds, ...diksyonIds, ...flashIds]);
for (const id of allIdiomas) {
  const file = path.join(inDir, `${id}.svg`);
  let s = fs.readFileSync(file, "utf8");
  if (kayeIds.includes(id)) {
    s = s.replace(/>Kaye</g, ">Cahier<");
  }
  if (diksyonIds.includes(id)) {
    s = s.replace(/DIKSYONÈ/g, "DICTIONNAIRE");
  }
  if (flashIds.includes(id)) {
    s = s.replace(/>kay<\/text>/g, ">maison</text>")
         .replace(/>flè<\/text>/g, ">fleur</text>");
  }
  fs.writeFileSync(path.join(outDir, `${id}.svg`), s, "utf8");
}

// 3. Tecnologia
{
  const file = path.join(inDir, "tecnologia.svg");
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(/> KREYÒL v2\.0</g, "> FRANÇAIS v2.0<")
       .replace(/> Teknoloji\.\.\.</g, "> Technologie...<")
       .replace(/> Aprann pi vit!</g, "> Apprendre plus vite!<");
  fs.writeFileSync(path.join(outDir, "tecnologia.svg"), s, "utf8");
}

// 4. Cinema
{
  const file = path.join(inDir, "cinema.svg");
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(/>SINEMA</g, ">CINÉMA<")
       .replace(/>SAL SINEMA KREYÒL</g, ">SALLE DE CINÉMA<");
  fs.writeFileSync(path.join(outDir, "cinema.svg"), s, "utf8");
}

// 5. Turismo-icarai
{
  const file = path.join(inDir, "turismo-icarai.svg");
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(/Touris — Niterói/g, "Tourisme — Niterói")
       .replace(/Icaraí \/ Mize Nimeye \(MAC\)/g, "Icaraí / Musée Niemeyer (MAC)")
       .replace(/>lame<\/text>/g, ">mer</text>")
       .replace(/>bato<\/text>/g, ">bateau</text>")
       .replace(/>mize<\/text>/g, ">musée</text>")
       .replace(/>plaj<\/text>/g, ">plage</text>")
       .replace(/>mòn<\/text>/g, ">montagne</text>")
       .replace(/>pye bwa<\/text>/g, ">arbre</text>")
       .replace(/>gòlèt<\/text>/g, ">mouette</text>");
  fs.writeFileSync(path.join(outDir, "turismo-icarai.svg"), s, "utf8");
}

console.log("Successfully generated French SVGs in", outDir);
const files = fs.readdirSync(outDir);
console.log("Files:", files);
