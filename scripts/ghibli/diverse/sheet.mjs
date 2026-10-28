// Ferramenta de revisão: gera uma folha de contato com todos os elementos de um tema.
import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { commonDefs } from "./kit.mjs";
const theme = process.argv[2];
const mod = theme === "cultura" ? await import("./cultura-els.mjs") : await import("./natureza-els.mjs");
const els = Object.entries(mod[theme.toUpperCase()]);
const cols = 6, cw = 300, ch = 360;
const rows = Math.ceil(els.length / cols);
let body = "";
els.forEach(([id, e], i) => {
  const x = (i % cols) * cw + cw / 2, y = Math.floor(i / cols) * ch + ch - 40;
  const sc = Math.min(1, 300 / Math.max(e.w, 1), 300 / Math.max(e.h, 1));
  body += `<g transform="translate(${x},${y}) scale(${sc})">${e.draw()}</g><text x="${x}" y="${y + 26}" text-anchor="middle" font-family="DejaVu Sans" font-size="16" fill="#222">${i + 1}. ${e.k}</text>`;
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cw}" height="${rows * ch}" viewBox="0 0 ${cols * cw} ${rows * ch}"><defs>${commonDefs}</defs><rect width="100%" height="100%" fill="#d9e8d0"/>${body}</svg>`;
const out = process.argv[3] || `/home/claude/sheet-${theme}.png`;
fs.writeFileSync(out, new Resvg(svg, { fitTo: { mode: "width", value: 1800 }, font: { loadSystemFonts: true } }).render().asPng());
console.log("ok", els.length, out);
