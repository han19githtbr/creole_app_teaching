// Gera uma folha de contato (PNG) dos objetos para conferência visual.
import { sceneOnly, arrowSvg } from "./lib.mjs";
import { writeFileSync } from "node:fs";
const mods = process.argv.slice(2);
let all = [];
for (const m of mods) { const mod = await import(`./${m}`); for (const v of Object.values(mod)) if (v?.items) all.push(...v.items.map((i) => ({ ...i, theme: v.id }))); }
const cols = 4, cw = 490, ch = 350;
const body = all.map((it, k) => `<g transform="translate(${(k % cols) * cw} ${Math.floor(k / cols) * ch})">${it.draw("p" + k)}${arrowSvg(it.tip[0], it.tip[1])}<text x="8" y="340" font-size="18" font-family="Arial" fill="#000" stroke="#fff" stroke-width="3" paint-order="stroke">${it.theme}/${it.id}</text></g>`).join("");
const rows = Math.ceil(all.length / cols);
writeFileSync("/home/claude/preview.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cw}" height="${rows * ch}">${body}</svg>`);
