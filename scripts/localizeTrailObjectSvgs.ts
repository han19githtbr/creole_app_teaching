import fs from "node:fs";
import path from "node:path";
import elementDetails from "@/lib/themeElementDetails.json";

const sourceDir = path.join(process.cwd(), "public/ghibli/trail-objects");
const outputDir = path.join(process.cwd(), "public/ghibli/fr/trail-objects");
const manifestPath = path.join(process.cwd(), "src/lib/trailObjectFrenchVariants.json");
const themeNames: Record<string, string> = {
  tecnologia: "Tecnologia", natureza: "Natureza", gastronomia: "Gastronomia", idiomas: "Idiomas",
  cultura: "Cultura", turismo: "Turismo", interior: "Vida no interior",
  musica: "Música", danca: "Dança", historia: "História", cinema: "Cinema", geografia: "Geografia",
  religiao: "Religião", estoicismo: "Estoicismo",
};
themeNames.lazeres = "Lazeres";
const extraLabels: Record<string, string> = {
  bonjou: "Bonjour", "bonjou bonjour": "Bonjour", "olá hello": "Bonjour",
  "alo!": "Allô !", gato: "chat", kay: "maison", casa: "maison", "flè": "fleur", flor: "fleur",
  diretor: "réalisateur", "sala 3": "salle 3", "cena 1": "scène 1", hotel: "hôtel", cinema: "cinéma", tap: "tap-tap", soda: "soda",
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-FR").trim().replace(/\s+/g, " ");
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function preserveCase(source: string, translation: string) {
  if (source === source.toLocaleUpperCase("fr-FR")) return translation.toLocaleUpperCase("fr-FR");
  if (source[0] === source[0]?.toLocaleUpperCase("fr-FR")) {
    return translation[0].toLocaleUpperCase("fr-FR") + translation.slice(1);
  }
  return translation;
}

const sourceFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith(".svg"));
const localizedIds: string[] = [];

for (const file of sourceFiles) {
  const id = file.slice(0, -4);
  const themeId = id.split("-")[0];
  const theme = themeNames[themeId];
  if (!theme) continue;
  const details = (elementDetails as Record<string, Record<string, { kreyol?: string; fr?: string }>>)[theme] ?? {};
  const translations = new Map<string, string>();
  Object.values(details).forEach((entry) => {
    if (entry.kreyol && entry.fr) translations.set(normalize(entry.kreyol), entry.fr);
  });
  Object.entries(extraLabels).forEach(([source, translation]) => translations.set(normalize(source), translation));

  const source = fs.readFileSync(path.join(sourceDir, file), "utf8");
  let changed = false;
  const localized = source.replace(/(<text\b[^>]*>)([\s\S]*?)(<\/text>)/gi, (match, open: string, inner: string, close: string) => {
    if (/<[^>]+>/.test(inner)) return match;
    const label = inner.replace(/&amp;/g, "&").trim();
    const translation = translations.get(normalize(label));
    if (!translation) return match;
    const translatedLabel = preserveCase(label, translation);
    if (label === translatedLabel) return match;
    changed = true;
    return `${open}${escapeXml(translatedLabel)}${close}`;
  });

  if (!changed) continue;
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, file), localized);
  localizedIds.push(id);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(localizedIds.sort(), null, 2)}\n`);
console.log(`Localized ${localizedIds.length} trail object SVGs for French.`);
