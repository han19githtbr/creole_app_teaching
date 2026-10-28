// Gera as imagens diversificadas (Cultura e Natureza, cenas 02..20) em public/ghibli e os dados que dependem delas:
//   · rótulos das histórias  → src/lib/storyElementAnchors.json   (ponto medido DENTRO de cada elemento visível)
//   · detalhes extras        → src/lib/storyElementExtras.json    (sol/lua, nuvem, céu, chão/água)
//   · cenas e vocabulário    → src/lib/imageSceneVariants.json    (objetos, títulos e palavras em Kreyòl)
//   · manifesto de títulos   → scripts/ghibli/manifest.json
// Depois rode:  ONLY=cultura-,natureza- node scripts/ghibli/scene-map/build-scene-map.mjs   (mapa de cena das novas imagens)
// Uso: node scripts/ghibli/diverse/build-diverse.mjs [cultura|natureza]   (requer @resvg/resvg-js)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { rng, f, commonDefs, skyDefs, skyRect, cloud, sunDisc, moonDisc, stars, rain, farLayer, groundDefs, ground, water } from "./kit.mjs";
import { DECOR } from "./decor.mjs";
import { CULTURA } from "./cultura-els.mjs";
import { NATUREZA } from "./natureza-els.mjs";
import { CULTURA_SCENES, NATUREZA_SCENES } from "./scenes.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const OUT = path.join(root, "public/ghibli");
const J = (p) => path.join(root, p);

const THEMES = {
  cultura: { label: "Cultura", reg: CULTURA, scenes: CULTURA_SCENES },
  natureza: { label: "Natureza", reg: NATUREZA, scenes: NATUREZA_SCENES },
};

const GROUND_LABEL = { meadow: "grama", grass: "grama", forest: "grama", moss: "grama", night: "grama", sand: "areia", nightsand: "areia", dune: "areia", cobble: "piso", dirt: "piso", rock: "piso" };

/* ------------------------------ utilitários de máscara ------------------------------ */
const MW = 300, MH = 200;
function render(svg, width = MW) {
  const img = new Resvg(svg, { fitTo: { mode: "width", value: width }, background: "rgba(0,0,0,0)", font: { loadSystemFonts: false } }).render();
  return { w: img.width, h: img.height, px: img.pixels };
}
const maskOf = (r) => { const m = new Uint8Array(r.w * r.h); for (let i = 0; i < m.length; i++) m[i] = r.px[i * 4 + 3] > 60 ? 1 : 0; return m; };
function dist(mask, w, h, target = 0) { // distância (px) ao pixel mais próximo cujo valor == !target ... aqui: dist até o pixel de valor `target`
  const INF = 1e9, d = new Float32Array(w * h);
  for (let i = 0; i < d.length; i++) d[i] = mask[i] === target ? 0 : INF;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 1); if (y > 0) d[i] = Math.min(d[i], d[i - w] + 1); if (x > 0 && y > 0) d[i] = Math.min(d[i], d[i - w - 1] + 1.41); if (x < w - 1 && y > 0) d[i] = Math.min(d[i], d[i - w + 1] + 1.41); }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) { const i = y * w + x; if (x < w - 1) d[i] = Math.min(d[i], d[i + 1] + 1); if (y < h - 1) d[i] = Math.min(d[i], d[i + w] + 1); if (x < w - 1 && y < h - 1) d[i] = Math.min(d[i], d[i + w + 1] + 1.41); if (x > 0 && y < h - 1) d[i] = Math.min(d[i], d[i + w - 1] + 1.41); }
  return d;
}
function largestComponent(mask, w, h) {
  const lab = new Int32Array(w * h); let n = 0; const sizes = [0];
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || lab[s]) continue;
    n++; sizes[n] = 0; const st = [s]; lab[s] = n;
    while (st.length) { const i = st.pop(); sizes[n]++; const x = i % w, y = (i / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const j = ny * w + nx; if (mask[j] && !lab[j]) { lab[j] = n; st.push(j); } }
    }
  }
  let best = 1; for (let k = 2; k <= n; k++) if (sizes[k] > sizes[best]) best = k;
  const out = new Uint8Array(w * h); for (let i = 0; i < out.length; i++) out[i] = lab[i] === best ? 1 : 0; return out;
}
/** ponto mais "interior" do elemento (maior distância à borda), em % da imagem */
function innerPoint(mask, w, h) {
  const comp = largestComponent(mask, w, h);
  const d = dist(comp, w, h, 0);
  let bi = 0, bv = -1; for (let i = 0; i < d.length; i++) if (comp[i] && d[i] > bv) { bv = d[i]; bi = i; }
  return [Math.round(((bi % w) + 0.5) / w * 1000) / 10, Math.round((((bi / w) | 0) + 0.5) / h * 1000) / 10];
}

/* ------------------------------ céu ------------------------------ */
function buildSky(sc, r) {
  const kind = sc.sky, out = [], info = { sun: null, moon: null, clouds: [] };
  out.push(skyRect(kind));
  if (kind === "night") {
    out.push(`<!-- starry sky -->\n<g>${stars(r, 70, 380)}</g>`);
    const mx = 120 + r() * 960, my = 110 + r() * 80, mr = 40 + r() * 10;
    info.moon = [mx, my]; info.moonMarkup = `<!-- moon glow -->\n${moonDisc(f(mx), f(my), f(mr), r() < 0.5 ? 1 : 0)}`;
  } else if (!["overcast", "rain"].includes(kind)) {
    const low = ["dawn", "sunset", "violet"].includes(kind);
    const x = 140 + r() * 920, y = low ? 250 + r() * 70 : 105 + r() * 110, rad = 42 + r() * 14;
    out.push(`<!-- sun glow -->\n${sunDisc(f(x), f(y), f(rad), kind)}`);
    info.sun = [x, y];
  }
  const kinds = { day: ["cumulus", "puffs", "wisp"], clear: ["wisp", "puffs"], golden: ["cumulus", "flat", "wisp"], dawn: ["flat", "wisp", "puffs"], sunset: ["flat", "cumulus"], violet: ["flat", "wisp"], mist: ["wisp", "flat"], overcast: ["flat", "flat", "cumulus"], rain: ["flat", "cumulus", "flat"], night: ["wisp", "flat"] }[kind];
  const n = kind === "clear" ? 2 : kind === "overcast" || kind === "rain" ? 5 : 3;
  for (let i = 0; i < n; i++) {
    const cx = 100 + ((i + r() * 0.6) * 1000) / n, cy = 90 + r() * (kind === "overcast" || kind === "rain" ? 190 : 150), s = 0.55 + r() * 0.5;
    const t = kinds[(i + Math.floor(r() * 3)) % kinds.length];
    out.push(`<!-- cloud ${i} -->\n${cloud(f(cx), f(cy), f(s), t, kind === "overcast" ? 0.95 : 0.9)}`);
    info.clouds.push([cx, cy, s]);
  }
  if (info.moonMarkup) out.push(info.moonMarkup);
  return { markup: out.join("\n"), info };
}

/* ------------------------------ layout dos elementos ------------------------------ */
function layout(sc, reg, r) {
  const gy = sc.ground ? sc.ground[1] : 735;
  const wy = sc.water ? { y0: sc.water[1], y1: Math.min(sc.water[2], 800) } : null;
  const seabed = sc.water && sc.water[2] >= 800 && sc.ground; // recife: fundo de areia sob a água
  const items = sc.els.map((id) => ({ id, e: reg[id], hab: reg[id].hab }));
  const attach = items.find((i) => i.id === "nenifa") && items.find((i) => i.id === "letan");
  const sky = items.filter((i) => i.hab === "sky");
  const rest = items.filter((i) => i.hab !== "sky" && !(attach && i.id === "nenifa"));
  // ordem horizontal embaralhada (determinística)
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  const depth = [0.2, 0.75, 0.4, 0.95].sort(() => r() - 0.5);
  rest.forEach((it, i) => {
    it.t = depth[i % 4];
    it.s0 = it.e.s * (0.88 + 0.22 * it.t);
  });
  // largura total → escala uniforme
  const gaps = 36 * (rest.length - 1);
  const total = rest.reduce((a, it) => a + it.e.w * it.s0, 0) + gaps;
  const k = Math.min(1, 1090 / total);
  rest.forEach((it) => { it.s = it.s0 * k; it.wpx = it.e.w * it.s; });
  const used = rest.reduce((a, it) => a + it.wpx, 0) + gaps;
  let x = 600 - used / 2;
  rest.forEach((it) => { it.x = x + it.wpx / 2; x += it.wpx + 36; });
  // y por habitat
  for (const it of rest) {
    const { hab } = it, h = it.e.h;
    if (hab === "land") it.y = Math.min(750, gy + 78 + it.t * (740 - gy - 78));
    else if (hab === "shore") it.y = seabed ? gy + 24 : Math.min(750, gy + 60 + it.t * 50);
    else if (hab === "air") it.y = 170 + it.t * 90;
    else if (hab === "water") {
      const band = wy ? wy.y1 - wy.y0 : 200;
      const mid = wy ? wy.y0 + band * (seabed ? 0.38 + it.t * 0.3 : 0.5 + it.t * 0.15) : 560;
      it.y = mid;
    }
    if (hab === "land" || hab === "shore") { const top = it.y - h * it.s; if (top < 135) it.s = Math.max(0.35, (it.y - 135) / h); }
    if (hab === "water" && wy && !seabed) { const room = wy.y1 - wy.y0 + 40; if (h * it.s > room) it.s = room / h; it.y = wy.y0 + (wy.y1 - wy.y0) * 0.62; }
    if (hab === "water" && it.id === "koray") it.y = seabed ? gy - 6 : (wy ? wy.y1 - 12 : 700);
    if (hab === "water" && (it.id === "zile" || it.id === "nenifa")) it.y = wy ? wy.y0 + (wy.y1 - wy.y0) * (seabed ? 0.2 : 0.55) : 520;
    if (hab === "water" && (it.id === "dofen" || it.id === "balen")) it.y = wy ? wy.y0 + (wy.y1 - wy.y0) * (seabed ? 0.5 : 0.62) : 560;
    if (hab === "water" && (it.id === "dofen" || it.id === "balen") && wy && !seabed) { const hh = it.e.h * it.s; if (it.y - hh < 130) it.s *= (it.y - 130) / hh; }
  }
  // arco-íris atrás de tudo
  for (const it of sky) { it.s = 1; it.x = 360 + r() * 480; it.y = wy && !sc.ground ? wy.y0 + 14 : gy - 26; it.wpx = 560; }
  const ordered = [...sky, ...rest.sort((a, b) => a.y - b.y)];
  if (attach) {
    const L = items.find((i) => i.id === "letan"), N = items.find((i) => i.id === "nenifa");
    N.s = 0.5; N.x = L.x + 26; N.y = L.y - 22; N.wpx = 140;
    ordered.splice(ordered.indexOf(L) + 1, 0, N);
  }
  return ordered;
}

/* ------------------------------ montagem do SVG ------------------------------ */
function buildScene(theme, sc) {
  const { reg } = THEMES[theme];
  const id = `${theme}-${String(sc.n).padStart(2, "0")}`;
  const r = rng(sc.n * 7919 + (theme === "cultura" ? 17 : 101));
  const sky = buildSky(sc, r);
  const parts = [];
  parts.push(sky.markup);
  if (sc.sky === "rain") parts.push(`<!-- rain overlay -->\n${rain(r, 120)}`);
  const gy = sc.ground ? sc.ground[1] : 735;
  if (sc.far) parts.push(farLayer(sc.far[0], sc.far[1], r, sc.far[2]));
  if (sc.water) parts.push(water(sc.water[0], sc.water[1], sc.water[2], r));
  if (sc.ground) parts.push(ground(sc.ground[0], sc.ground[1], r, sc.water ? 12 : 26));
  for (const [name, ...args] of sc.decor ?? []) {
    const fn = DECOR[name];
    if (["palms", "fence", "crops", "parasols", "wall", "poles", "reeds", "pebbles", "mound", "trees"].includes(name)) parts.push(fn(r, gy, ...args));
    else parts.push(fn(r, ...args));
  }
  const placed = layout(sc, reg, r);
  const defs = `<defs>${commonDefs}${skyDefs(sc.sky)}${sc.ground ? groundDefs(sc.ground[0]) : ""}</defs>`;
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">`;
  const groups = placed.map((it) => {
    const tag = it.hab === "sky" ? "light beam rainbow" : "obj";
    return { it, markup: `<!-- ${tag} ${it.e.k.replace(/[^a-z0-9 ]/gi, "")} -->\n<g transform="translate(${f(it.x)},${f(it.y)}) scale(${f(it.s)})">${it.e.draw()}</g>` };
  });
  parts.push(...groups.map((g) => g.markup));
  if (sc.sky === "rain" || sc.sky === "mist") { /* já tem nuvens/névoa */ }
  const title = `<title>${sc.title}</title>`;
  const grain = `<!-- texture overlay -->\n<rect x="-1" y="0" width="1202" height="800" filter="url(#grain)" opacity=".55"/>`;
  const svg = `${open}${title}${defs}\n${parts.join("\n")}\n${grain}\n</svg>\n`;

  /* ---- âncoras dos rótulos: ponto dentro da parte VISÍVEL de cada elemento ---- */
  const masks = groups.map((g) => maskOf(render(`${open}${defs}${g.markup}</svg>`)));
  const anchors = placed.map((it, i) => {
    const vis = new Uint8Array(MW * MH); let own = 0, kept = 0;
    for (let p = 0; p < vis.length; p++) {
      if (!masks[i][p]) continue; own++;
      let occ = false; for (let j = i + 1; j < masks.length; j++) if (masks[j][p]) { occ = true; break; }
      if (!occ) { vis[p] = 1; kept++; }
    }
    let use = kept >= Math.max(6, own * 0.25) ? vis : masks[i];
    if (!own) return null;
    // o rótulo precisa ficar na área visível do palco (14%..86% da altura): prefere a parte do elemento que cabe nela
    const band = new Uint8Array(use); let inBand = 0;
    for (let p = 0; p < band.length; p++) { const yy = (p / MW) | 0; if (yy < MH * 0.14 || yy > MH * 0.86) band[p] = 0; else if (band[p]) inBand++; }
    if (inBand >= 6) use = band;
    const [x, y] = innerPoint(use, MW, MH);
    return [Math.min(94, Math.max(6, x)), Math.min(88, Math.max(12, y))];
  });
  // reordena as âncoras para a ordem de sc.els
  const byId = new Map(placed.map((it, i) => [it.id, anchors[i]]));
  const anchorsInOrder = sc.els.map((eid) => byId.get(eid) ?? null);

  /* ---- detalhes extras: sol/lua, chão/água, nuvem, céu ---- */
  const union = new Uint8Array(MW * MH); masks.forEach((m) => m.forEach((v, p) => { if (v) union[p] = 1; }));
  const dEl = dist(union, MW, MH, 1); // distância de cada pixel ao elemento mais próximo
  const pick = (x0, y0, x1, y1, extra = () => 1e9) => {
    let best = null, bv = -1;
    for (let y = Math.floor(y0 * MH); y < Math.floor(y1 * MH); y += 3) for (let x = Math.floor(x0 * MW); x < Math.floor(x1 * MW); x += 3) {
      const v = Math.min(dEl[y * MW + x], extra(x * 4, y * 4) / 4); if (v > bv) { bv = v; best = [x, y]; }
    }
    return best && bv > 6 ? [Math.round((best[0] + 0.5) / MW * 1000) / 10, Math.round((best[1] + 0.5) / MH * 1000) / 10] : null;
  };
  const extras = [];
  if (sky.info.sun) extras.push(["sol", Math.round(sky.info.sun[0] / 12 * 10) / 10, Math.round(sky.info.sun[1] / 8 * 10) / 10]);
  if (sky.info.moon) extras.push(["lua", Math.round(sky.info.moon[0] / 12 * 10) / 10, Math.round(sky.info.moon[1] / 8 * 10) / 10]);
  const nearCloud = (px, py) => Math.min(...sky.info.clouds.map(([cx, cy]) => Math.hypot(px - cx, py - cy) * 1.0).concat([1e9]));
  if (sc.water) { const p = pick(0.05, (sc.water[1] + 20) / 800, 0.95, Math.min(sc.water[2] - 10, 780) / 800); if (p) extras.push(["agua", p[0], p[1]]); }
  if (sc.ground && !(sc.water && sc.water[2] >= 800)) { const p = pick(0.05, (gy + 36) / 800, 0.95, 0.86); if (p) extras.push([GROUND_LABEL[sc.ground[0]] ?? "grama", p[0], p[1]]); }
  const ci = sky.info.clouds.sort((a, b) => b[2] - a[2])[0];
  if (ci) { const cxp = ci[0] / 12, cyp = ci[1] / 8; if (cyp > 11 && cyp < 60) extras.push(["nuvem", Math.round(cxp * 10) / 10, Math.round(cyp * 10) / 10]); }
  const sp = pick(0.06, 0.1, 0.94, 0.42, (px, py) => Math.min(nearCloud(px, py) - 130, sky.info.sun ? Math.hypot(px - sky.info.sun[0], py - sky.info.sun[1]) - 150 : 1e9, sky.info.moon ? Math.hypot(px - sky.info.moon[0], py - sky.info.moon[1]) - 120 : 1e9));
  if (sp) extras.push(["ceu", sp[0], sp[1]]);
  return { id, svg, anchors: anchorsInOrder, extras: extras.slice(0, 4) };
}

/* ------------------------------ execução ------------------------------ */
const only = process.argv[2];
const sceneVariants = JSON.parse(fs.readFileSync(J("src/lib/imageSceneVariants.json"), "utf8"));
const anchorsJson = JSON.parse(fs.readFileSync(J("src/lib/storyElementAnchors.json"), "utf8"));
const extrasJson = JSON.parse(fs.readFileSync(J("src/lib/storyElementExtras.json"), "utf8"));
const manifestPath = J("scripts/ghibli/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

for (const [theme, T] of Object.entries(THEMES)) {
  if (only && only !== theme) continue;
  const sv = sceneVariants[T.label];
  const scenes = [];
  for (const sc of T.scenes) {
    const res = buildScene(theme, sc);
    fs.writeFileSync(path.join(OUT, `${res.id}.svg`), res.svg);
    anchorsJson[res.id] = res.anchors;
    extrasJson[res.id] = res.extras;
    sc.els.forEach((eid) => { sv.labels[eid] = T.reg[eid].k; });
    scenes.push({ title: sc.title, setting: sc.ground ? sc.ground[0] : "sea", palette: sc.sky, objects: [...sc.els] });
    const m = manifest.find((x) => x.id === res.id);
    if (m) m.title = sc.title;
    console.log(res.id, sc.title, "| ancoras:", res.anchors.map((a) => (a ? a.join(",") : "-")).join(" ; "), "| extras:", res.extras.map((e) => e[0]).join(","));
  }
  sv.scenes = scenes;
}
fs.writeFileSync(J("src/lib/imageSceneVariants.json"), JSON.stringify(sceneVariants, null, 2) + "\n");
fs.writeFileSync(J("src/lib/storyElementAnchors.json"), JSON.stringify(anchorsJson));
fs.writeFileSync(J("src/lib/storyElementExtras.json"), JSON.stringify(extrasJson));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("ok");
