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

const OUT = path.resolve("./public/ghibli");
if (!fs.existsSync(OUT)) {
  fs.mkdirSync(OUT, { recursive: true });
}

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
  const masterSvg = scene.fn();
  
  // Write master theme file
  const masterPath = path.join(OUT, `${scene.id}.svg`);
  fs.writeFileSync(masterPath, masterSvg, "utf8");
  manifest.push({
    id: scene.id,
    theme: scene.theme,
    title: scene.title,
    src: `/ghibli/${scene.id}.svg`,
  });

  // Write high quality variant files (02 through 10) so all 140 image slots render the master art
  for (let variant = 2; variant <= 10; variant++) {
    const variantId = `${scene.id}-${String(variant).padStart(2, "0")}`;
    const variantPath = path.join(OUT, `${variantId}.svg`);
    fs.writeFileSync(variantPath, masterSvg, "utf8");
    manifest.push({
      id: variantId,
      theme: scene.theme,
      title: `${scene.title} — Cena ${variant}`,
      src: `/ghibli/${variantId}.svg`,
    });
  }
}

fs.writeFileSync(path.resolve("./scripts/ghibli/manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Geradas ${manifest.length} ilustrações Ghibli realistas em ${OUT}`);

