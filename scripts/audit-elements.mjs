import fs from "fs";

const variants = JSON.parse(fs.readFileSync("src/lib/imageSceneVariants.json", "utf8"));
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

for (const [theme, tData] of Object.entries(variants)) {
  if (!tData.labels) continue;
  for (const [obj, k] of Object.entries(tData.labels)) {
    const pt = ptEntries[k] || "MISSING";
    const fr = frEntries[k] || "MISSING";
    console.log(`[${theme}] ${obj} -> kreyol:"${k}" pt:"${pt}" fr:"${fr}"`);
  }
}
