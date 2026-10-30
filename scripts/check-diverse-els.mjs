import fs from "fs";
import path from "path";

const diverseDir = "scripts/ghibli/diverse";
const files = fs.readdirSync(diverseDir).filter(f => f.startsWith("theme-") || f === "cultura-els.mjs" || f === "natureza-els.mjs");

const allElements = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(diverseDir, file), "utf8");
  const regex = /(\w+)\s*:\s*\{[^}]*k\s*:\s*"([^"]+)"[^}]*pt\s*:\s*"([^"]+)"[^}]*fr\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const [, id, k, pt, fr] = m;
    allElements[id] = { id, k, pt, fr, file };
  }
}

const imageBankCode = fs.readFileSync("src/lib/imageBank.ts", "utf8");
const ptMatch = imageBankCode.match(/export const KREYOL_TO_PT: Record<string, string> = {([\s\S]+?)};/);
const ptEntries = {};
if (ptMatch) {
  for (const line of ptMatch[1].split("\n")) {
    const m = line.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
    if (m) ptEntries[m[1]] = m[2];
  }
}

const frCode = fs.readFileSync("src/lib/frenchVocabulary.ts", "utf8");
const frMatch = frCode.match(/export const KREYOL_TO_FR: Record<string, string> = {([\s\S]+?)};/);
const frEntries = {};
if (frMatch) {
  for (const line of frMatch[1].split("\n")) {
    const m = line.match(/(?:"([^"]+)"|([\w\u00C0-\u024F]+))\s*:\s*"([^"]+)"/);
    if (m) frEntries[m[1] || m[2]] = m[3];
  }
}

const mismatches = [];
for (const [id, el] of Object.entries(allElements)) {
  const currentPt = ptEntries[el.k];
  const currentFr = frEntries[el.k];
  if (currentPt && currentPt !== el.pt) {
    mismatches.push({ id, k: el.k, definedPt: el.pt, currentPt, definedFr: el.fr, currentFr });
  }
}

console.log("Mismatches where defined pt differs from global KREYOL_TO_PT:", mismatches.length);
mismatches.forEach(m => console.log(m));
