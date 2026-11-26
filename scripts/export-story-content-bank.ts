import fs from "node:fs";
import path from "node:path";
import { IMAGE_THEMES, getBankImage } from "../src/lib/imageBank";
import { STORY_CONTENT_BANK } from "../src/lib/storyContentBank";

const errors: string[] = [];
const seenIds = new Set<string>();
const countsByTheme = new Map<string, number>();

for (const item of STORY_CONTENT_BANK) {
  if (seenIds.has(item.id)) errors.push(`ID duplicado: ${item.id}`);
  seenIds.add(item.id);

  countsByTheme.set(item.theme, (countsByTheme.get(item.theme) ?? 0) + 1);

  if (!IMAGE_THEMES.includes(item.theme)) {
    errors.push(`Tema fora de IMAGE_THEMES em ${item.id}: "${item.theme}"`);
  }

  const scene = getBankImage(item.suggestedSceneId);
  if (!scene) {
    errors.push(`Cena não encontrada em IMAGE_BANK para ${item.id}: "${item.suggestedSceneId}"`);
  }

  if (item.estimatedSeconds <= 0 || item.estimatedSeconds > 120) {
    errors.push(`Duração fora do limite (<=120s) em ${item.id}: ${item.estimatedSeconds}s`);
  }

  for (const [lang, text] of [
    ["fr", item.fr],
    ["kreyol", item.kreyol],
    ["pt", item.pt],
  ] as const) {
    const trimmed = text.trim();
    if (!trimmed) {
      errors.push(`Texto vazio (${lang}) em ${item.id}`);
    } else if (!/[.!?»"”)]$/.test(trimmed)) {
      errors.push(`Pontuação final ausente (${lang}) em ${item.id}: "${trimmed.slice(-20)}"`);
    }
    if (/  +/.test(trimmed)) {
      errors.push(`Espaços duplos (${lang}) em ${item.id}`);
    }
  }
}

for (const theme of new Set(IMAGE_THEMES)) {
  const count = countsByTheme.get(theme) ?? 0;
  if (count !== 10) {
    errors.push(`Tema "${theme}" tem ${count} conteúdos (esperado: 10)`);
  }
}

if (errors.length > 0) {
  console.error("Erros de validação encontrados:\n" + errors.join("\n"));
  process.exit(1);
}

const uniqueThemes = Array.from(new Set(IMAGE_THEMES));
const lines: string[] = [
  "# Banco de Conteúdos — Seção de Curiosidades",
  "",
  `Total de temas: **${uniqueThemes.length}** · Total de roteiros: **${STORY_CONTENT_BANK.length}** (10 por tema)`,
  "",
  "Cada roteiro foi estruturado em parágrafos curtos e naturais para gravações de **até ~2 minutos** (média de 60 a 70 segundos), reunindo curiosidades culturais/gerais e os elementos das cenas de `src/lib/imageBank.ts` para ativar as animações do player.",
  "",
  "## Índice de temas",
  "",
  ...uniqueThemes.map((t, idx) => {
    const anchor = t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-");
    return `${idx + 1}. [${t}](#${anchor}) (10 conteúdos)`;
  }),
  "",
];

for (const theme of uniqueThemes) {
  lines.push(`---`, "", `## ${theme}`, "");
  const items = STORY_CONTENT_BANK.filter((i) => i.theme === theme);
  items.forEach((item, index) => {
    lines.push(
      `### ${index + 1}. ${item.title.pt} (\`${item.id}\`)`,
      "",
      `- **Cena sugerida:** \`${item.suggestedSceneId}\` · **Duração estimada:** ~${item.estimatedSeconds} s`,
      `- **Elementos citados:** ${item.elementsCited.join(", ")}`,
      `- **Resumo:** ${item.summaryPt}`,
      "",
      `#### 🇫🇷 Francês — *${item.title.fr}*`,
      "",
      item.fr,
      "",
      `#### 🇭🇹 Kreyòl Ayisyen — *${item.title.kreyol}*`,
      "",
      item.kreyol,
      "",
      `#### 🇧🇷 Português (apoio) — *${item.title.pt}*`,
      "",
      item.pt,
      ""
    );
  });
}

const docsDir = path.resolve(process.cwd(), "docs");
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, "banco-conteudos-curiosidades.md"), lines.join("\n"), "utf8");
fs.writeFileSync(
  path.join(docsDir, "banco-conteudos-curiosidades.json"),
  JSON.stringify(STORY_CONTENT_BANK, null, 2),
  "utf8"
);

console.log(
  `OK: ${STORY_CONTENT_BANK.length} conteúdos validados em ${uniqueThemes.length} temas e exportados para docs/banco-conteudos-curiosidades.md e .json`
);
