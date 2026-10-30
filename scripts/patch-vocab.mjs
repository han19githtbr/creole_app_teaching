import fs from "fs";

let s = fs.readFileSync("src/lib/frenchVocabulary.ts", "utf8");
const targetRegex = /export function kreyolToFrench\(word: string\): string \{[\s\S]+?\}/;
const replacement = `export function kreyolToFrench(word: string, context?: string): string {
  const key = word.trim();
  const lower = key.toLowerCase();
  if (lower === "lèt") {
    if (context && /gastro|food|culin|recette|cuisine|leite|garrafa/i.test(context)) return "lait";
  }
  if (lower === "pen") {
    if (context && /gastro|food|culin|recette|cuisine|pão/i.test(context)) return "pain";
  }
  return KREYOL_TO_FR[key] ?? KREYOL_TO_FR[lower] ?? word;
}`;

s = s.replace(targetRegex, replacement);
fs.writeFileSync("src/lib/frenchVocabulary.ts", s, "utf8");
console.log("Updated kreyolToFrench successfully");
