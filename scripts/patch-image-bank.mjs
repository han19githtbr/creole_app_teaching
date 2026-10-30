import fs from "fs";

let s = fs.readFileSync("src/lib/imageBank.ts", "utf8");

// 1. Add imports at the top
s = s.replace(
  `import measuredExtras from "./storyElementExtras.json";`,
  `import measuredExtras from "./storyElementExtras.json";\nimport themeElementDetails from "./themeElementDetails.json";\nimport type { AppLanguage } from "./languageShared";`
);

// 2. Add srcFr to BankImage interface
s = s.replace(
  `  src: string;`,
  `  src: string;\n  /** URL da versão em francês da imagem, quando existir texto localizado nela. */\n  srcFr?: string;`
);

// 3. Add FRENCH_IMAGE_IDS and getLanguageImageSrc before IMAGE_BANK
const helperCode = `
export const FRENCH_IMAGE_IDS = new Set([
  "cinema",
  "gastronomia-02",
  "gastronomia-10",
  "gastronomia-15",
  "gastronomia-20",
  "idiomas-03",
  "idiomas-04",
  "idiomas-09",
  "idiomas-13",
  "idiomas-14",
  "idiomas-16",
  "idiomas-17",
  "idiomas-20",
  "tecnologia",
  "turismo-icarai",
]);

export function getLanguageImageSrc(src: string | null | undefined, language: AppLanguage = "kreyol"): string {
  if (!src) return "";
  if (language === "francais") {
    if (src.startsWith("/ghibli/fr/")) return src;
    if (src.startsWith("/ghibli/")) {
      const id = src.replace("/ghibli/", "").replace(/\\.(svg|png|webp|jpe?g)$/i, "");
      if (FRENCH_IMAGE_IDS.has(id)) {
        return \`/ghibli/fr/\${id}.svg\`;
      }
    }
    return src;
  }
  if (src.startsWith("/ghibli/fr/")) {
    return src.replace("/ghibli/fr/", "/ghibli/");
  }
  return src;
}
`;

s = s.replace(
  `export const IMAGE_BANK: BankImage[] = IMAGE_THEMES_DATA.flatMap((image) =>`,
  helperCode + `\nexport const IMAGE_BANK: BankImage[] = IMAGE_THEMES_DATA.flatMap((image) =>`
);

// 4. Update elements mapping inside IMAGE_BANK
const oldElementsMapping = `    if (variantScene && sceneVariantsTyped[image.theme]) {
      const themeLabels = sceneVariantsTyped[image.theme].labels;
      elements = variantScene.objects.map((obj) => {
        const kreyol = themeLabels[obj] ?? obj;
        return {
          kreyol,
          pt: KREYOL_TO_PT[kreyol] ?? kreyol,
        };
      });
      caption = \`\${title} (\${image.theme}): identifique na cena \${elements
        .map((e) => \`\${e.pt} (\${e.kreyol})\`)
        .join(", ")}.\`;
    }`;

const newElementsMapping = `    if (variantScene && sceneVariantsTyped[image.theme]) {
      const themeLabels = sceneVariantsTyped[image.theme].labels;
      const detailsMap = (themeElementDetails as Record<string, Record<string, BankElement>>)[image.theme];
      elements = variantScene.objects.map((obj) => {
        const detail = detailsMap?.[obj];
        const kreyol = detail?.kreyol ?? themeLabels[obj] ?? obj;
        const pt = detail?.pt ?? KREYOL_TO_PT[kreyol] ?? kreyol;
        const fr = detail?.fr ?? (kreyol === "lèt" && (pt.includes("leite") || !pt.includes("alfabeto")) ? "lait" : KREYOL_TO_FR[kreyol]);
        return {
          kreyol,
          pt,
          ...(fr ? { fr } : {}),
        };
      });
      caption = \`\${title} (\${image.theme}): identifique na cena \${elements
        .map((e) => \`\${e.pt} (\${e.kreyol})\`)
        .join(", ")}.\`;
    }`;

s = s.replace(oldElementsMapping, newElementsMapping);

// 5. Add srcFr to returned object
s = s.replace(
  `      src: \`/ghibli/\${id}.svg\`,`,
  `      src: \`/ghibli/\${id}.svg\`,\n      srcFr: FRENCH_IMAGE_IDS.has(id) ? \`/ghibli/fr/\${id}.svg\` : undefined,`
);

// 6. Update getBankImage to accept optional language parameter and resolve correctly
const oldGetBankImage = `export function getBankImage(idOrSrc: string | null | undefined): BankImage | undefined {
  if (!idOrSrc) return undefined;
  return IMAGE_BANK.find((i) => i.id === idOrSrc || i.src === idOrSrc);
}`;

const newGetBankImage = `export function getBankImage(idOrSrc: string | null | undefined, language?: AppLanguage): BankImage | undefined {
  if (!idOrSrc) return undefined;
  const clean = idOrSrc.split("?")[0];
  const normalizedSrc = clean.replace("/ghibli/fr/", "/ghibli/");
  const idFromSrc = clean.replace(/^\\/ghibli\\/(?:fr\\/)?/, "").replace(/\\.(svg|png|webp|jpe?g)$/i, "");
  const base = IMAGE_BANK.find((i) => i.id === clean || i.id === idFromSrc || i.src === clean || i.src === normalizedSrc);
  if (!base) return undefined;
  if (language === "francais" && base.srcFr) {
    return { ...base, src: base.srcFr };
  }
  return base;
}`;

s = s.replace(oldGetBankImage, newGetBankImage);

// 7. Update isAllowedPostImageUrl regex
s = s.replace(
  `if (/^\\/(ghibli|images|gen)\\/[a-z0-9_-]+\\.(svg|png|webp|jpg|jpeg)$/i.test(url)) return true;`,
  `if (/^\\/(ghibli(\\/fr)?|images|gen)\\/[a-z0-9_-]+\\.(svg|png|webp|jpg|jpeg)$/i.test(url)) return true;`
);

// 8. Update KREYOL_TO_PT with missing items
s = s.replace(
  `  // Gastronomia\n  "legim": "legumes",`,
  `  // Gastronomia\n  "fwi": "frutas",\n  "piman": "pimentas",\n  "boutèy lèt": "garrafa de leite",\n  "legim": "legumes",`
);

// 9. Update PT_TO_FR with missing items
s = s.replace(
  `export const PT_TO_FR: Record<string, string> = {`,
  `export const PT_TO_FR: Record<string, string> = {\n  "garrafa de leite": "bouteille de lait",\n  "leite": "lait",\n  "colher de pau": "cuillère en bois",\n  "tábua de cortar": "planche à découper",\n  "ovos": "œufs",\n  "teclado": "clavier",`
);

// 10. Update getElementLabel with disambiguation for lèt and pen
const oldGetElementLabel = `export function getElementLabel(element: BankElement, language: "kreyol" | "francais" = "kreyol"): string {
  if (language === "francais") {
    if (element.fr) return element.fr;
    if (KREYOL_TO_FR[element.kreyol] ?? KREYOL_TO_FR[element.kreyol.toLowerCase()]) return kreyolToFrench(element.kreyol);
    const lowerPt = element.pt.toLowerCase().trim();
    if (PT_TO_FR[lowerPt]) return PT_TO_FR[lowerPt];
    for (const [ptKey, frVal] of Object.entries(PT_TO_FR)) {
      if (lowerPt.includes(ptKey) || ptKey.includes(lowerPt)) return frVal;
    }
    return element.pt;
  }
  return element.kreyol;
}`;

const newGetElementLabel = `export function getElementLabel(element: BankElement, language: "kreyol" | "francais" = "kreyol"): string {
  if (language === "francais") {
    if (element.fr) return element.fr;
    const lowerK = element.kreyol.toLowerCase().trim();
    const lowerPt = element.pt.toLowerCase().trim();
    if (lowerK === "lèt") {
      if (lowerPt.includes("leite") || !lowerPt.includes("alfabeto")) return "lait";
    }
    if (lowerK === "pen" && lowerPt.includes("pão")) {
      return "pain";
    }
    if (KREYOL_TO_FR[element.kreyol] ?? KREYOL_TO_FR[lowerK]) return kreyolToFrench(element.kreyol);
    if (PT_TO_FR[lowerPt]) return PT_TO_FR[lowerPt];
    for (const [ptKey, frVal] of Object.entries(PT_TO_FR)) {
      if (lowerPt.includes(ptKey) || ptKey.includes(lowerPt)) return frVal;
    }
    return element.pt;
  }
  return element.kreyol;
}`;

s = s.replace(oldGetElementLabel, newGetElementLabel);

fs.writeFileSync("src/lib/imageBank.ts", s, "utf8");
console.log("Successfully patched imageBank.ts");
