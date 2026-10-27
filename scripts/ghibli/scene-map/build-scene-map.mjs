// Mapa de cada cena do banco: onde há céu, água, chão livre e objetos desenhados.
// Lê os SVGs em public/ghibli, separa os nós de topo (na ordem de desenho), renderiza a máscara de cada um
// e descobre, por célula de 25 px (grade 48x32 sobre 1200x800), quem fica por cima (o último a desenhar ali).
// Saída: src/lib/storySceneMap.json  (id -> { i: interior?, gt: topo do chão, rows: [48 colunas em RLE] }).
// Uso: node scripts/ghibli/scene-map/build-scene-map.mjs   (requer @resvg/resvg-js)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";
import { splitTop } from "../anchors/split.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, "../../../public/ghibli");
const OUT = path.resolve(here, "../../../src/lib/storySceneMap.json");
const GW = 48, GH = 32, CELL = 25, RW = 300, RH = 200;

const FX = /sun ray|\bray|cloud|glow|light beam|spotlight|shadow|sparkle|twinkl|starry|firefl|vignette|overlay|reflection|texture|bokeh|dust|haze|fog|mist/i;
const WATER = /ocean|river|\blake|waters\b|\bpond|tranquil distant sea|crater lake|waterfall pool|\brio\b|rivy[eè]|lanm[eè]|\bmar\b|oceano|\blago\b/i;
const NOT_WATER = /sea cliff|seagull|shell|starfish|sand|sunset path/i;
const GROUND = /meadow|terrace|floor|shoreline|cobblestone|pavement|sidewalk|courtyard|\bground\b|tiles|gathering|plaza|lawn|grass|pasture|field/i;
const BG = /mountain|peaks|hilltop|\bhills?\b|skyline|horizon|island|distant/i;

function render(openTag, defs, markup) {
  const m = markup.replace(/\sfilter="url\(#[^)]*\)"/g, "");
  try {
    const img = new Resvg(`${openTag}${defs}${m}</svg>`, { fitTo: { mode: "width", value: RW }, background: "rgba(0,0,0,0)", font: { loadSystemFonts: false } }).render();
    return { px: img.pixels, w: img.width, h: img.height };
  } catch { return null; }
}
/** células (GWxGH) cobertas por este nó: true se >=45% dos pixels da célula têm alfa */
function cover(r) {
  const out = new Uint8Array(GW * GH);
  if (!r) return out;
  const bw = r.w / GW, bh = r.h / GH;
  for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) {
    let on = 0, tot = 0;
    for (let y = Math.floor(gy * bh); y < Math.floor((gy + 1) * bh); y++) for (let x = Math.floor(gx * bw); x < Math.floor((gx + 1) * bw); x++) { tot++; if (r.px[(y * r.w + x) * 4 + 3] > 70) on++; }
    out[gy * GW + gx] = tot && on / tot >= 0.45 ? 1 : 0;
  }
  return out;
}
/** cor média (RGB) dos pixels opacos do nó */
function meanColor(r) {
  if (!r) return [0, 0, 0];
  let n = 0, R = 0, Gc = 0, B = 0;
  for (let i = 0; i < r.w * r.h; i++) { if (r.px[i * 4 + 3] > 70) { n++; R += r.px[i * 4]; Gc += r.px[i * 4 + 1]; B += r.px[i * 4 + 2]; } }
  return n ? [R / n, Gc / n, B / n] : [0, 0, 0];
}
function bbox(r) {
  if (!r) return null;
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) if (r.px[(y * r.w + x) * 4 + 3] > 70) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return null;
  const k = 1200 / r.w;
  return { x0: x0 * k, y0: y0 * k, x1: (x1 + 1) * k, y1: (y1 + 1) * k };
}
const rle = (s) => s.replace(/(.)\1*/g, (m) => m[0] + (m.length > 1 ? m.length : ""));

const map = {};
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".svg")).sort()) {
  const id = f.replace(".svg", "");
  const svg = fs.readFileSync(path.join(dir, f), "utf8");
  const { openTag, nodes } = splitTop(svg);
  const defsNode = nodes.find((n) => n.tag === "defs");
  const styles = nodes.filter((n) => n.tag === "style").map((n) => n.markup).join("");
  const defs = (defsNode ? defsNode.markup : "") + styles;
  const owner = new Array(GW * GH).fill("S");
  let indoor = false, night = false, skyFound = false, gt = 800;
  for (const n of nodes) {
    if (["defs", "title", "desc", "style"].includes(n.tag)) continue;
    const inner = [...n.markup.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].trim());
    const text = `${n.comment || ""} ${inner[0] || ""}`;
    if (n.tag === "rect" && /width="1200"/.test(n.attrs || "") && /height="800"/.test(n.attrs || "")) {
      // retângulo do tamanho do quadro = fundo. O primeiro é o céu/parede; um segundo repinta o fundo (ex.: noite sólida)
      const hex = ((n.attrs || "").match(/fill="#([0-9a-f]{6})"/i) || [])[1];
      const lum = hex ? (0.299 * parseInt(hex.slice(0, 2), 16) + 0.587 * parseInt(hex.slice(2, 4), 16) + 0.114 * parseInt(hex.slice(4, 6), 16)) / 255 : 0;
      const isSkyUrl = /url\(#sky/i.test(n.attrs || "");
      if (!skyFound || hex || isSkyUrl) {
        skyFound = true;
        indoor = !isSkyUrl && lum > 0.45;
        night = !indoor && (/night|dark|stars/i.test(n.attrs || "") || !isSkyUrl);
        owner.fill(indoor ? "O" : "S");
        gt = 800;
      }
      continue;
    }
    if (FX.test(text)) continue;
    if (n.tag === "line" || (n.tag === "ellipse" && !n.comment)) continue; // riscos de piso e reflexos finos não são objetos
    const r = render(openTag, defs, n.markup);
    const c = cover(r);
    const bb = bbox(r);
    if (!bb) continue;
    let cls = "O";
    const wide = bb.x1 - bb.x0 >= 1000;
    if (WATER.test(text) && !NOT_WATER.test(text)) cls = "W";
    else if (GROUND.test(text) && wide) cls = "G";
    else if (BG.test(text)) cls = "B";
    else if (wide && bb.y1 >= 780 && bb.y0 >= 350) cls = "G"; // faixa larga que chega à base do quadro = chão
    else if (!n.comment && /^(polygon|path)$/.test(n.tag) && bb.y1 <= 560 && bb.x1 - bb.x0 >= 300) cls = "B"; // montanhas sem nome
    // faixa "de chão" azul/turquesa não é chão: são camadas de água sem nome (raso, fundo, espuma)
    if (cls === "G") { const [R, Gc, B] = meanColor(r); if (B >= R + 30 && (B + Gc) / 2 > 130 && B >= Gc - 25) cls = "W"; }
    if (cls === "G" || cls === "W") gt = Math.min(gt, bb.y0);
    for (let k = 0; k < c.length; k++) if (c[k]) owner[k] = cls;
  }
  // em cenas internas o "chão" é o piso desenhado; nas externas, o que sobrou sem dono (S) abaixo do chão vira céu mesmo
  // cena externa sem chão desenhado nem água (ex.: vila noturna sobre fundo liso): a faixa vazia da base funciona como chão
  if (!indoor && !owner.includes("G") && !owner.includes("W")) {
    for (let gy = 22; gy < GH - 1; gy++) for (let gx = 0; gx < GW; gx++) if (owner[gy * GW + gx] === "S") owner[gy * GW + gx] = "G";
    gt = 550;
  }
  const rows = [];
  for (let gy = 0; gy < GH; gy++) rows.push(rle(owner.slice(gy * GW, (gy + 1) * GW).join("")));
  map[id] = { i: indoor ? 1 : 0, n: night ? 1 : 0, gt: Math.round(Math.min(gt, 800)), rows };
}
fs.writeFileSync(OUT, JSON.stringify(map));
console.log("cenas:", Object.keys(map).length, "bytes:", fs.statSync(OUT).size);
