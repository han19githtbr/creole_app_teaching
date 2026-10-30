import fs from "fs";

let s = fs.readFileSync("src/lib/imageBank.ts", "utf8");

// Replace the elements mapping block:
const regexMapping = /if \(variantScene && sceneVariantsTyped\[image\.theme\]\) \{[\s\S]+?caption = `\${title} \(\${image\.theme}\): identifique na cena \${elements[\s\S]+?\}\./;

const newMapping = `if (variantScene && sceneVariantsTyped[image.theme]) {
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
        .join(", ")}.\``;

s = s.replace(regexMapping, newMapping);

// Replace getBankImage function:
const regexGetBankImage = /export function getBankImage\(idOrSrc: string \| null \| undefined\): BankImage \| undefined \{[\s\S]+?return IMAGE_BANK\.find[\s\S]+?\};/;

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
};`;

s = s.replace(regexGetBankImage, newGetBankImage);

fs.writeFileSync("src/lib/imageBank.ts", s, "utf8");
console.log("Applied elements and getBankImage patch successfully");
