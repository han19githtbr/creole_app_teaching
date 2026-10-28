// Registro dos temas diversificados. Cultura e Natureza têm cenas escritas à mão (scenes.mjs); os demais usam grupos
// sorteados por solve-groups.mjs + ambientes de envs.mjs.
import { CULTURA } from "./cultura-els.mjs";
import { NATUREZA } from "./natureza-els.mjs";
import { CULTURA_SCENES, NATUREZA_SCENES } from "./scenes.mjs";
import { OUT_ENVS, BEACH_ENVS, IN_ENVS } from "./envs.mjs";
import { solveGroups } from "./solve-groups.mjs";
import { rng } from "./kit.mjs";

function makeScenes(reg, { seed, mode = "out", beach = [], beachScenes = [2, 11, 17] }) {
  const ids = Object.keys(reg);
  const r = rng(seed * 31 + 5);
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const bs = beach.length ? beachScenes : [];
  // tipo de ambiente de cada cena, definido ANTES de sortear os grupos (elementos "out" não entram em salas)
  const kind = Array.from({ length: 19 }, (_, i) => (bs.includes(i) ? "beach" : mode === "in" ? "in" : mode === "mixed" ? (i % 2 ? "in" : "out") : "out"));
  const isOut = (id) => reg[id].out || reg[id].hab === "air";
  const groups = solveGroups(ids, { beach, beachScenes: bs, seed, allow: (s, id) => kind[s] !== "in" || !isOut(id) });
  const outPool = shuffle(OUT_ENVS), inPool = shuffle(IN_ENVS), beachPool = shuffle(BEACH_ENVS);
  let bi = 0, oi = 0, ii = 0;
  return groups.map((g, i) => {
    const env = kind[i] === "beach" ? beachPool[bi++ % beachPool.length] : kind[i] === "in" ? inPool[ii++ % inPool.length] : outPool[oi++ % outPool.length];
    const pt = (id) => reg[id].pt.replace(/\s*\(.*\)/, "");
    return { n: i + 2, title: `${env.stem}: ${pt(g[0])} e ${pt(g[1])}`, ...env, els: g };
  });
}

export const THEMES = {
  cultura: { label: "Cultura", reg: CULTURA, scenes: CULTURA_SCENES },
  natureza: { label: "Natureza", reg: NATUREZA, scenes: NATUREZA_SCENES },
};

/** registra um tema gerado automaticamente */
export function addTheme(key, label, prefix, reg, opts) {
  THEMES[key] = { label, prefix, reg, scenes: makeScenes(reg, opts) };
}

// ---- temas adicionais (cada um num arquivo próprio) ----
const extra = ["tecnologia"];
for (const k of extra) await import(`./theme-${k}.mjs`).then((m) => addTheme(k, m.LABEL, m.PREFIX, m.REG, m.OPTS));
