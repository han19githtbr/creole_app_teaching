import fs from "node:fs";
import path from "node:path";
import {
  renderTecnologia,
  renderNatureza,
  renderCultura,
  renderTurismo,
  renderInterior,
  renderDanca,
  renderGeografia,
} from "./master-scenes-1.mjs";
import {
  renderHistoria,
  renderCinema,
  renderMusica,
  renderLazeres,
  renderEstoicismo,
  renderReligiao,
  renderGastronomia,
} from "./master-scenes-2.mjs";

import * as tecnologiaVariants from "./theme-tecnologia-variants.mjs";
import * as naturezaVariants from "./theme-natureza-variants.mjs";
import * as culturaVariants from "./theme-cultura-variants.mjs";

const OUT = path.resolve("./public/ghibli");
if (!fs.existsSync(OUT)) {
  fs.mkdirSync(OUT, { recursive: true });
}

const variantsData = JSON.parse(
  fs.readFileSync(path.resolve("./src/lib/imageSceneVariants.json"), "utf8")
);

const TECNOLOGIA_FNS = [
  tecnologiaVariants.renderTecnologia01,
  tecnologiaVariants.renderTecnologia02,
  tecnologiaVariants.renderTecnologia03,
  tecnologiaVariants.renderTecnologia04,
  tecnologiaVariants.renderTecnologia05,
  tecnologiaVariants.renderTecnologia06,
  tecnologiaVariants.renderTecnologia07,
  tecnologiaVariants.renderTecnologia08,
  tecnologiaVariants.renderTecnologia09,
  tecnologiaVariants.renderTecnologia10,
  tecnologiaVariants.renderTecnologia11,
  tecnologiaVariants.renderTecnologia12,
  tecnologiaVariants.renderTecnologia13,
  tecnologiaVariants.renderTecnologia14,
  tecnologiaVariants.renderTecnologia15,
  tecnologiaVariants.renderTecnologia16,
  tecnologiaVariants.renderTecnologia17,
  tecnologiaVariants.renderTecnologia18,
  tecnologiaVariants.renderTecnologia19,
  tecnologiaVariants.renderTecnologia20,
];

const NATUREZA_FNS = [
  naturezaVariants.renderNatureza01,
  naturezaVariants.renderNatureza02,
  naturezaVariants.renderNatureza03,
  naturezaVariants.renderNatureza04,
  naturezaVariants.renderNatureza05,
  naturezaVariants.renderNatureza06,
  naturezaVariants.renderNatureza07,
  naturezaVariants.renderNatureza08,
  naturezaVariants.renderNatureza09,
  naturezaVariants.renderNatureza10,
  naturezaVariants.renderNatureza11,
  naturezaVariants.renderNatureza12,
  naturezaVariants.renderNatureza13,
  naturezaVariants.renderNatureza14,
  naturezaVariants.renderNatureza15,
  naturezaVariants.renderNatureza16,
  naturezaVariants.renderNatureza17,
  naturezaVariants.renderNatureza18,
  naturezaVariants.renderNatureza19,
  naturezaVariants.renderNatureza20,
];

const CULTURA_FNS = [
  culturaVariants.renderCultura01,
  culturaVariants.renderCultura02,
  culturaVariants.renderCultura03,
  culturaVariants.renderCultura04,
  culturaVariants.renderCultura05,
  culturaVariants.renderCultura06,
  culturaVariants.renderCultura07,
  culturaVariants.renderCultura08,
  culturaVariants.renderCultura09,
  culturaVariants.renderCultura10,
  culturaVariants.renderCultura11,
  culturaVariants.renderCultura12,
  culturaVariants.renderCultura13,
  culturaVariants.renderCultura14,
  culturaVariants.renderCultura15,
  culturaVariants.renderCultura16,
  culturaVariants.renderCultura17,
  culturaVariants.renderCultura18,
  culturaVariants.renderCultura19,
  culturaVariants.renderCultura20,
];

const DEDICATED_VARIANTS = {
  tecnologia: TECNOLOGIA_FNS,
  natureza: NATUREZA_FNS,
  cultura: CULTURA_FNS,
};

const MASTER_SCENES = [
  { id: "tecnologia", theme: "Tecnologia", title: "Oficina tecnológica no campo", fn: renderTecnologia },
  { id: "natureza", theme: "Natureza", title: "Árvore ancestral e prado florido", fn: renderNatureza },
  { id: "cultura", theme: "Cultura", title: "Festa na praça com bandeirolas", fn: renderCultura },
  { id: "turismo", theme: "Turismo", title: "Vila costeira, farol e balão", fn: renderTurismo },
  { id: "interior", theme: "Vida no interior", title: "Fazenda ao meio-dia", fn: renderInterior },
  { id: "danca", theme: "Dança", title: "Dança sob as lanternas", fn: renderDanca },
  { id: "geografia", theme: "Geografia", title: "Montanhas, rio e bússola", fn: renderGeografia },
  { id: "historia", theme: "História", title: "Fortaleza de pedra no alto do morro", fn: renderHistoria },
  { id: "cinema", theme: "Cinema", title: "Cinema de bairro ao entardecer", fn: renderCinema },
  { id: "musica", theme: "Música", title: "Palco ao ar livre", fn: renderMusica },
  { id: "lazeres", theme: "Lazeres", title: "Tarde de piquenique e pipas", fn: renderLazeres },
  { id: "estoicismo", theme: "Estoicismo", title: "Pórtico de pedra e oliveiras", fn: renderEstoicismo },
  { id: "religiao", theme: "Religião", title: "Capela na colina e luz sagrada", fn: renderReligiao },
  { id: "gastronomia", theme: "Gastronomia", title: "Cozinha aconchegante", fn: renderGastronomia },
];

const manifest = [];

for (const scene of MASTER_SCENES) {
  const customFns = DEDICATED_VARIANTS[scene.id];
  const themeVariants = variantsData[scene.theme]?.scenes || [];

  // Variant 1 (Primary)
  const masterSvg = customFns ? customFns[0]() : scene.fn();
  const masterPath = path.join(OUT, `${scene.id}.svg`);
  fs.writeFileSync(masterPath, masterSvg, "utf8");
  manifest.push({
    id: scene.id,
    theme: scene.theme,
    title: scene.title,
    src: `/ghibli/${scene.id}.svg`,
  });

  // Variants 2 through 20
  for (let variant = 2; variant <= 20; variant++) {
    const variantId = `${scene.id}-${String(variant).padStart(2, "0")}`;
    const variantSvg = customFns && customFns[variant - 1] ? customFns[variant - 1]() : masterSvg;
    const variantPath = path.join(OUT, `${variantId}.svg`);
    fs.writeFileSync(variantPath, variantSvg, "utf8");

    const variantTitle =
      themeVariants[variant - 2]?.title || `${scene.title} — Cena ${variant}`;

    manifest.push({
      id: variantId,
      theme: scene.theme,
      title: variantTitle,
      src: `/ghibli/${variantId}.svg`,
    });
  }
}

fs.writeFileSync(
  path.resolve("./scripts/ghibli/manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);
console.log(`Geradas ${manifest.length} ilustrações Ghibli realistas em ${OUT}`);
