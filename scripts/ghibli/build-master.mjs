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
import * as turismoVariants from "./theme-turismo-variants.mjs";
import * as interiorVariants from "./theme-interior-variants.mjs";
import * as dancaVariants from "./theme-danca-variants.mjs";
import * as geografiaVariants from "./theme-geografia-variants.mjs";
import * as historiaVariants from "./theme-historia-variants.mjs";
import * as cinemaVariants from "./theme-cinema-variants.mjs";
import * as musicaVariants from "./theme-musica-variants.mjs";
import * as lazeresVariants from "./theme-lazeres-variants.mjs";
import * as estoicismoVariants from "./theme-estoicismo-variants.mjs";
import * as religiaoVariants from "./theme-religiao-variants.mjs";
import * as gastronomiaVariants from "./theme-gastronomia-variants.mjs";

const OUT = path.resolve("./public/ghibli");
if (!fs.existsSync(OUT)) {
  fs.mkdirSync(OUT, { recursive: true });
}

const variantsData = JSON.parse(
  fs.readFileSync(path.resolve("./src/lib/imageSceneVariants.json"), "utf8")
);

function collectFns(mod, name) {
  const fns = [];
  for (let i = 1; i <= 20; i++) {
    const pad = String(i).padStart(2, "0");
    const fn = mod[`render${name}${pad}`];
    if (typeof fn === "function") {
      fns.push(fn);
    } else {
      throw new Error(`Missing function render${name}${pad}`);
    }
  }
  return fns;
}

const DEDICATED_VARIANTS = {
  tecnologia: collectFns(tecnologiaVariants, "Tecnologia"),
  natureza: collectFns(naturezaVariants, "Natureza"),
  cultura: collectFns(culturaVariants, "Cultura"),
  turismo: collectFns(turismoVariants, "Turismo"),
  interior: collectFns(interiorVariants, "Interior"),
  danca: collectFns(dancaVariants, "Danca"),
  geografia: collectFns(geografiaVariants, "Geografia"),
  historia: collectFns(historiaVariants, "Historia"),
  cinema: collectFns(cinemaVariants, "Cinema"),
  musica: collectFns(musicaVariants, "Musica"),
  lazeres: collectFns(lazeresVariants, "Lazeres"),
  estoicismo: collectFns(estoicismoVariants, "Estoicismo"),
  religiao: collectFns(religiaoVariants, "Religiao"),
  gastronomia: collectFns(gastronomiaVariants, "Gastronomia"),
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
