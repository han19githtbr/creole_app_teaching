import { IMAGE_BANK, getElementLabel, getBankImage, getLanguageImageSrc } from "../src/lib/imageBank.ts";

const img = getBankImage("gastronomia-02");
console.log("Image id:", img?.id);
console.log("Image src (default):", img?.src);
console.log("Image srcFr:", img?.srcFr);
console.log("Language image src for francais:", getLanguageImageSrc(img?.src, "francais"));
console.log("Elements:");
img?.elements.forEach(el => {
  console.log(` - kreyol: "${el.kreyol}", pt: "${el.pt}", fr: "${el.fr}" -> label FR: "${getElementLabel(el, "francais")}"`);
});

const imgFr = getBankImage("gastronomia-02", "francais");
console.log("getBankImage in francais src:", imgFr?.src);

const byFrSrc = getBankImage("/ghibli/fr/gastronomia-02.svg");
console.log("getBankImage by /ghibli/fr/ src id:", byFrSrc?.id);
