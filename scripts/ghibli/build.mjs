import fs from "node:fs";
import path from "node:path";
import { PAL, rng, wrap } from "./lib.mjs";
import * as A from "./scenes-a.mjs";
import * as B from "./scenes-b.mjs";

const OUT = path.resolve("../../public/ghibli");
fs.mkdirSync(OUT, { recursive: true });

const SCENES = [
  { id: "tecnologia", fn: A.tecnologia, theme: "Tecnologia", title: "Oficina tecnológica no campo", pal: "dia", opts: { sunX: 1010, sunY: 170 } },
  { id: "natureza", fn: A.natureza, theme: "Natureza", title: "Árvore ancestral e prado florido", pal: "dia", opts: { sunX: 930, sunY: 170 } },
  { id: "cultura", fn: A.cultura, theme: "Cultura", title: "Festa na praça com bandeirolas", pal: "entardecer", opts: { sunX: 620, sunY: 420, sunR: 60 } },
  { id: "turismo", fn: A.turismo, theme: "Turismo", title: "Vila costeira, farol e balão", pal: "dia", opts: { sunX: 820, sunY: 160 } },
  { id: "interior", fn: A.interior, theme: "Vida no interior", title: "Fazenda ao meio-dia", pal: "dia", opts: { sunX: 1000, sunY: 150 } },
  { id: "danca", fn: A.danca, theme: "Dança", title: "Dança sob as lanternas", pal: "entardecer", opts: { sunX: 180, sunY: 400, sunR: 50 } },
  { id: "geografia", fn: A.geografia, theme: "Geografia", title: "Montanhas, rio e bússola", pal: "dia", opts: { sunX: 1010, sunY: 140, clouds: true } },
  { id: "historia", fn: B.historia, theme: "História", title: "Fortaleza de pedra no alto do morro", pal: "entardecer", opts: { sunX: 240, sunY: 380, sunR: 56 } },
  { id: "cinema", fn: B.cinema, theme: "Cinema", title: "Cinema de bairro ao entardecer", pal: "entardecer", opts: { sunX: 1050, sunY: 300, sunR: 52 } },
  { id: "musica", fn: B.musica, theme: "Música", title: "Palco ao ar livre", pal: "entardecer", opts: { sunX: 1000, sunY: 380, sunR: 54 } },
  { id: "lazeres", fn: B.lazeres, theme: "Lazeres", title: "Tarde de piquenique e pipas", pal: "dia", opts: { sunX: 180, sunY: 150 } },
  { id: "estoicismo", fn: B.estoicismo, theme: "Estoicismo", title: "Pórtico de pedra e oliveiras", pal: "dia", opts: { sunX: 1000, sunY: 180 } },
  { id: "religiao", fn: B.religiao, theme: "Religião", title: "Capela na colina e luz sagrada", pal: "dia", opts: { sunX: 600, sunY: 130, sunR: 46 } },
  { id: "gastronomia", fn: B.gastronomia, theme: "Gastronomia", title: "Cozinha aconchegante", pal: "dia", opts: { sunX: 0, sunY: -999 } },
];

const manifest = [];
SCENES.forEach((s, sceneIndex) => {
  for (let variant = 1; variant <= 10; variant++) {
    const id = variant === 1 ? s.id : `${s.id}-${String(variant).padStart(2, "0")}`;
    const title = variant === 1 ? s.title : `${s.title} — Cena ${variant}`;
    const paletteName = variant === 1 || variant % 2 === 1
      ? s.pal
      : s.pal === "dia" ? "entardecer" : "dia";
    const p = PAL[paletteName];
    const r = rng(variant === 1 ? 1000 + sceneIndex * 77 : 1000 + sceneIndex * 77 + variant * 3413);
    const body = s.fn(p, r);
    const opts = variant === 1
      ? s.opts
      : {
          ...s.opts,
          sunX: (s.opts.sunX ?? 900) + ((sceneIndex + variant) % 5 - 2) * 52,
          sunY: (s.opts.sunY ?? 190) + ((sceneIndex * variant) % 3 - 1) * 28,
        };
    const svg = wrap(p, rng(variant === 1 ? 5 + sceneIndex : 5 + sceneIndex + variant * 197), body, {
      ...opts,
      title,
      desc: `Ilustração original em estilo aquarela de animação: ${title}.`,
    });
    fs.writeFileSync(path.join(OUT, `${id}.svg`), svg);
    manifest.push({ id, theme: s.theme, title, src: `/ghibli/${id}.svg` });
  }
});
fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));
console.log("gerado:", manifest.length, "cenas em", OUT);
