// Acrescenta, nos arquivos TypeScript, as palavras (Kreyòl → PT/FR) e os ícones dos elementos diversificados que ainda não existem.
// Uso: node scripts/ghibli/diverse/sync-vocab.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { THEMES } from "./themes.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const all = new Map();
for (const T of Object.values(THEMES)) for (const e of Object.values(T.reg)) if (!all.has(e.k)) all.set(e.k, e);

function patch(file, startMarker, entries, header) {
  const p = path.join(root, file);
  let s = fs.readFileSync(p, "utf8");
  const i = s.indexOf(startMarker), j = s.indexOf("\n};", i);
  const block = s.slice(i, j);
  const have = new Set([...block.matchAll(/^\s*(?:"([^"]+)"|([A-Za-zÀ-ÿ_][\wÀ-ÿ-]*))\s*:/gm)].map((m) => m[1] ?? m[2]));
  const add = entries.filter(([k]) => !have.has(k));
  if (!add.length) return 0;
  const lines = add.map(([k, v]) => `\n  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("");
  s = s.slice(0, j) + (block.includes(header) ? "" : `\n  // ${header}`) + lines + s.slice(j);
  fs.writeFileSync(p, s);
  return add.length;
}
const H = "Elementos diversificados dos temas";
const a = patch("src/lib/imageBank.ts", "export const KREYOL_TO_PT: Record<string, string> = {", [...all.values()].map((e) => [e.k, e.pt]), H);
const b = patch("src/lib/frenchVocabulary.ts", "export const KREYOL_TO_FR: Record<string, string> = {", [...all.values()].map((e) => [e.k, e.fr]), H);
const c = patch("src/lib/storyElementIcon.ts", "const ICONS: Record<string, string> = {", [...all.values()].filter((e) => e.ic).map((e) => [norm(e.pt), e.ic]), H);
console.log(`novas palavras PT: ${a} · FR: ${b} · ícones: ${c}`);
