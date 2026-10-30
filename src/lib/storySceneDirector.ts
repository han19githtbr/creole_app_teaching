/**
 * Diretor de cena da camada de vida.
 *
 * Decide QUEM aparece em cada cena (por tema e pelo texto dos elementos), ONDE (usando o mapa espacial:
 * água para peixes/patos/barcos, chão livre para pessoas e animais, céu para aviões/aves/helicópteros, uma faixa
 * larga de chão para o aeroporto) e desenha os RÓTULOS dos elementos novos (Kreyòl/Français · Português) sem
 * encavalar nos rótulos já existentes nem uns nos outros.
 */
import { LIFE_W, LIFE_H, clamp, depth, f, norm, rngFrom, type LifeInput, type LifeScene } from "@/lib/storySceneLife";
import {
  GROUND, SKY, FAR, WATER, getSceneGrid, gridFromZones, overlaps, rectIs, rectShare, type Rect, type SceneGrid,
} from "@/lib/storySceneMap";
import { NAMES, SKY_DEFS, STRIP_DEFS, type LabelSpec, type Name, type VignetteDef, type VignetteInst } from "@/lib/storyVignettes";
import { GROUND_DEFS, WATER_DEFS } from "@/lib/storyVignettesLand";

const THEME_KEYS: Array<[RegExp, string]> = [
  [/tecnolog/, "tecnologia"], [/natureza/, "natureza"], [/cultura/, "cultura"], [/turismo/, "turismo"],
  [/interior|campo|rural/, "interior"], [/danca/, "danca"], [/geograf/, "geografia"], [/histor/, "historia"],
  [/cinema/, "cinema"], [/music/, "musica"], [/lazer/, "lazeres"], [/estoic/, "estoicismo"], [/religi/, "religiao"],
  [/gastronom/, "gastronomia"], [/idioma/, "idiomas"],
];

const ALL: Record<string, VignetteDef> = Object.fromEntries([...SKY_DEFS, ...STRIP_DEFS, ...GROUND_DEFS, ...WATER_DEFS].map((d) => [d.id, d]));

/**
 * O que PERTENCE a cada tema, em ordem de preferência. Nada fora desta lista entra na cena, nem por palavra-chave:
 * um avião não aparece numa fortaleza (História), um balão não aparece numa igreja (Religião), um gato doméstico não
 * aparece na mata (Natureza). Por isso as listas são curtas de propósito.
 */
const PLAN: Record<string, { ground: string[]; sky: string[]; water: string[]; strip: string[] }> = {
  tecnologia: { ground: ["robots", "classroom"], sky: ["helicopter", "airplane"], water: [], strip: [] },
  natureza: { ground: ["critters", "turtleLand"], sky: ["flock"], water: ["ducks", "fishSchool", "turtleSwim"], strip: [] },
  cultura: { ground: ["drummer", "dancers", "guitarist", "talkers"], sky: ["flock"], water: [], strip: [] },
  turismo: { ground: ["couple", "picnic", "cyclist", "turtleLand"], sky: ["balloon", "airplane"], water: ["sailing", "dolphin", "fishSchool", "turtleSwim"], strip: ["airport"] },
  interior: { ground: ["farm", "petsPlay", "cat", "cyclist"], sky: ["flock"], water: ["ducks", "fishSchool"], strip: [] },
  danca: { ground: ["dancers", "drummer", "guitarist"], sky: [], water: [], strip: [] },
  geografia: { ground: ["classroom"], sky: ["airplane", "balloon", "helicopter"], water: ["sailing", "dolphin", "fishSchool"], strip: [] },
  historia: { ground: ["rider", "classroom", "talkers"], sky: ["flock"], water: ["sailing"], strip: [] },
  cinema: { ground: ["talkers", "couple"], sky: [], water: [], strip: [] },
  musica: { ground: ["guitarist", "drummer", "dancers"], sky: [], water: [], strip: [] },
  lazeres: { ground: ["soccer", "picnic", "cyclist", "petsPlay", "guitarist"], sky: ["balloon", "flock"], water: ["ducks", "fishSchool"], strip: [] },
  estoicismo: { ground: ["classroom", "talkers"], sky: ["flock"], water: ["ducks"], strip: [] },
  religiao: { ground: ["talkers"], sky: ["flock"], water: [], strip: [] },
  gastronomia: { ground: ["dining"], sky: [], water: [], strip: [] },
  idiomas: { ground: [], sky: [], water: [], strip: [] },
};

/** palavras do texto da cena que puxam um elemento para o começo da fila */
const BOOST: Array<[RegExp, string]> = [
  [/aviao|aeroporto|voo|avyon|avion/, "airport"], [/helicopt|elikopte/, "helicopter"], [/violao|guitarra|gita|guitare/, "guitarist"],
  [/tambor|tanbou|tambour/, "drummer"], [/professor|aula|escola|pwofese|ecole|quadro/, "classroom"], [/piquenique|pikniks/, "picnic"],
  [/vaca|galinha|fazenda|vach|poul|ferme/, "farm"], [/bicicleta|bisiklet|velo/, "cyclist"], [/cavalo|chwal|cheval/, "rider"],
  [/barco|veleiro|bato|voilier|navio/, "sailing"], [/golfinho|dofen|dauphin/, "dolphin"], [/tartaruga|toti|tortue/, "turtleLand"],
  [/futebol|foutbol|football/, "soccer"], [/pato|kanna|canard/, "ducks"], [/peixe|pwason|poisson/, "fishSchool"],
];

export interface DirectorInput extends LifeInput {
  /** idioma do rótulo principal */
  lang?: "kreyol" | "fr";
  /** pontos (px em 1200x800) dos objetos já rotulados na cena; usados para não colocar nada por cima dos nomes existentes */
  anchors?: Array<{ x: number; y: number }>;
}
export interface RenderOpts { labelPx?: number }

const LABEL_FONT = 'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
const pillRectOf = (a: { x: number; y: number }): Rect => ({ x0: a.x - 115, y0: a.y - 104, x1: a.x + 115, y1: a.y - 34 });

interface Planned { def: VignetteDef; inst: VignetteInst; rect: Rect; order: number; moving: Set<string>; skip: Set<string> }

export function createSceneLife(input: DirectorInput): LifeScene {
  const text = norm([input.title ?? "", ...(input.elements ?? []).flatMap((e) => [e.pt ?? "", e.kreyol ?? "", e.fr ?? ""])].join(" "));
  const themeNorm = norm(input.theme ?? "");
  const idBase = norm(input.sceneId).replace(/\.(svg|png|webp|jpg|jpeg)$/g, "").split("/").pop() ?? "";
  const theme = THEME_KEYS.find(([re]) => re.test(themeNorm))?.[1] ?? THEME_KEYS.find(([re]) => re.test(idBase))?.[1] ?? "natureza";
  if (theme === "idiomas" || idBase.startsWith("idiomas")) return { actors: [], render: () => "" };

  const grid: SceneGrid = getSceneGrid(input.sceneId) ?? gridFromZones(input.zones ?? null);
  if (grid.indoor) return { actors: [], render: () => "" };
  const night = Boolean(grid.night);
  const lang = input.lang ?? "kreyol";
  const r = rngFrom(`${input.sceneId}|${theme}|vida`);
  const gt = clamp(grid.groundTop, 430, 650);
  const anchors = input.anchors ?? [];
  const noGo: Rect[] = anchors.map(pillRectOf);
  const anchorPad = grid.source === "pixels" ? 90 : 20; // sem mapa exato, mais folga em volta dos nomes existentes
  const taken: Rect[] = [];
  const planned: Planned[] = [];

  // nomes que já existem na cena: um elemento novo com o mesmo nome seria repetição
  const existing = new Set((input.elements ?? []).flatMap((e) => [e.pt, e.kreyol, e.fr]).filter(Boolean).map((s) => norm(String(s))));
  /** rótulos do elemento novo cujo nome já existe na cena (ex.: a lição já tem "tambor"): esses nomes não são repetidos */
  const clashKeys = (inst: VignetteInst): Set<string> => {
    const out = new Set<string>();
    for (const l of inst.labels(0)) {
      const n = NAMES[l.key as string];
      if (n && (existing.has(norm(n.p)) || existing.has(norm(n.k)) || existing.has(norm(n.f)))) out.add(String(l.key));
    }
    return out;
  };
  // fração do retângulo coberta pelos nomes já existentes (um pouco de sobreposição é tolerada; muito, não)
  const coveredByNames = (rect: Rect) => {
    const area = Math.max(1, (rect.x1 - rect.x0) * (rect.y1 - rect.y0));
    let sum = 0;
    for (const n of noGo) {
      const w = Math.min(rect.x1, n.x1 + anchorPad - 20) - Math.max(rect.x0, n.x0 - (anchorPad - 20));
      const h = Math.min(rect.y1, n.y1) - Math.max(rect.y0, n.y0);
      if (w > 0 && h > 0) sum += w * h;
    }
    return sum / area;
  };
  const free = (rect: Rect, pad = 14) => !taken.some((t) => overlaps(rect, t, pad)) && coveredByNames(rect) <= 0.30;

  const sOf = (y: number) => clamp(depth(y, gt) * 1.1, 0.78, 1.2);

  /* ---- procura de lugar, por tipo ---- */
  const tryGround = (def: VignetteDef, strip: boolean): { p: Parameters<VignetteDef["build"]>[0]; rect: Rect } | null => {
    for (let k = 0; k < 140; k++) {
      const y = strip ? gt + 50 + r() * Math.max(10, 690 - gt - 50) : gt + 36 + r() * Math.max(20, 728 - gt - 36);
      const s = strip ? 1 : sOf(y);
      const w = def.w * (strip ? 1 : s), h = def.h * (strip ? 1 : s);
      const x = 40 + w / 2 + r() * Math.max(1, LIFE_W - 80 - w);
      const rect: Rect = strip ? { x0: x - w / 2, y0: y - 72, x1: x + w / 2, y1: y + 24 } : { x0: x - w / 2, y0: y - h, x1: x + w / 2, y1: y + 8 };
      if (rect.y1 > 748 || rect.x0 < 12 || rect.x1 > LIFE_W - 12) continue;
      if (!rectIs(grid, rect, [GROUND], 4)) continue;
      const band: Rect = { x0: rect.x0, y0: rect.y0 - 70, x1: rect.x1, y1: rect.y0 };
      if (!free(rect) || taken.some((t) => overlaps(band, t, 0))) continue;
      return { p: { x, y, s, w, h, dir: r() > 0.5 ? 1 : -1, seed: input.sceneId, night, gt }, rect };
    }
    return null;
  };
  const trySky = (def: VignetteDef): { p: Parameters<VignetteDef["build"]>[0]; rect: Rect } | null => {
    const lane = def.w >= 1000;
    for (let k = 0; k < 60; k++) {
      const y = 120 + r() * Math.max(30, Math.min(gt - 130, 360) - 120);
      const s = 0.85 + r() * 0.3;
      const rect: Rect = lane ? { x0: 0, y0: y - 60, x1: LIFE_W, y1: y + 36 } : { x0: 100 + r() * (LIFE_W - 340), y0: y - 100, x1: 0, y1: y + 130 };
      if (!lane) { rect.x1 = rect.x0 + def.w; }
      if (rectShare(grid, rect, [SKY, FAR]) < (lane ? 0.8 : 0.95)) continue;
      if (rect.y1 > gt - 40 && !lane) continue;
      if ((!lane && noGo.some((n) => overlaps(rect, n, 10))) || taken.some((t) => overlaps(rect, t, lane ? 0 : 18))) continue;
      const x = (rect.x0 + rect.x1) / 2;
      return { p: { x, y: lane ? y : y, s, w: def.w, h: def.h, dir: r() > 0.5 ? 1 : -1, seed: input.sceneId, night, gt }, rect };
    }
    return null;
  };
  const tryWater = (def: VignetteDef): { p: Parameters<VignetteDef["build"]>[0]; rect: Rect } | null => {
    // rios estreitos: se a vinheta inteira não cabe, tenta uma versão menor (peixes/barco percorrem menos espaço)
    for (const k0 of [1, 0.7, 0.5]) {
      const w = def.w * k0, h = def.h * (k0 === 1 ? 1 : 0.85);
      for (let k = 0; k < 70; k++) {
        const x = w / 2 + 30 + r() * Math.max(1, LIFE_W - w - 60), y = 150 + r() * 560;
        const rect: Rect = def.id === "dolphin" ? { x0: x - w / 2, y0: y - 60, x1: x + w / 2, y1: y + 34 } : { x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 };
        if (def.id === "dolphin") { if (rectShare(grid, rect, [WATER]) < 0.72 || !rectIs(grid, { x0: rect.x0, y0: y + 6, x1: rect.x1, y1: y + 34 }, [WATER])) continue; }
        else if (!rectIs(grid, rect, [WATER], 4)) continue;
        if (!free(rect, 10)) continue;
        return { p: { x, y, s: 1, w, h, dir: r() > 0.5 ? 1 : -1, seed: input.sceneId, night, gt }, rect };
      }
      if (def.id === "dolphin") break; // o golfinho só vale em água ampla
    }
    return null;
  };

  const caps = { ground: 4, sky: night ? 1 : 3, water: 3, strip: 1 };
  const used = { ground: 0, sky: 0, water: 0, strip: 0 };
  const plan = PLAN[theme] ?? PLAN.natureza;
  const allowed = new Set([...plan.ground, ...plan.sky, ...plan.water, ...plan.strip]);
  const boosted = BOOST.filter(([re]) => re.test(text)).map(([, id]) => id).filter((id) => allowed.has(id));
  const queue = (list: string[], kind: keyof typeof caps) => {
    const mine = boosted.filter((id) => ALL[id]?.need === (kind === "strip" ? "strip" : kind));
    return Array.from(new Set([...mine, ...list]));
  };
  const places: Array<[keyof typeof caps, string[]]> = [
    ["strip", queue(plan.strip, "strip")], ["water", queue(plan.water, "water")], ["ground", queue(plan.ground, "ground")], ["sky", queue(plan.sky, "sky")],
  ];
  // vinhetas de céu à noite: só o que faz sentido (avião/helicóptero com luzes)
  for (const [kind, ids] of places) {
    for (const id of ids) {
      if (used[kind] >= caps[kind]) break;
      const def = ALL[id];
      if (!def) continue;
      if (night && (id === "flock" || id === "balloon")) continue;
      if (def.need === "water" && !rectShare(grid, { x0: 0, y0: 0, x1: LIFE_W, y1: LIFE_H }, [WATER])) continue;
      const spot = def.need === "ground" ? tryGround(def, false) : def.need === "strip" ? tryGround(def, true) : def.need === "sky" ? trySky(def) : tryWater(def);
      if (!spot) continue;
      const inst = def.build(spot.p, rngFrom(`${input.sceneId}|${id}`));
      const skip = clashKeys(inst);
      if (skip.size >= inst.labels(0).length) continue; // todos os nomes já existem na cena: o elemento seria repetição
      // quais rótulos se movem (decide a ordem de colocação: os parados primeiro)
      const moving = new Set<string>();
      const probes = [0, 3.7, 9.1, 15.3];
      const base = inst.labels(0);
      base.forEach((l, i) => { if (probes.some((t) => { const q = inst.labels(t)[i]; return q && (Math.abs(q.x - l.x) > 3 || Math.abs(q.y - l.y) > 3); })) moving.add(String(l.key)); });
      planned.push({ def, inst, rect: spot.rect, order: planned.length, moving, skip });
      taken.push(spot.rect);
      used[kind]++;
    }
  }
  planned.sort((a, b) => a.inst.z - b.inst.z);

  const nameOf = (key: string): { main: string; pt: string } => {
    const n = NAMES[key];
    return n ? { main: lang === "fr" ? n.f : n.k, pt: n.p } : { main: key, pt: "" };
  };

  /* ---- rótulos: pílula acima do objeto, ligada por fio com seta; sem encavalar ---- */
  const labelLayer = (t: number, fs: number): string => {
    type Item = { id: string; spec: LabelSpec; vi: number; li: number; moving: boolean; main: string; pt: string; w: number; h: number };
    const items: Item[] = [];
    planned.forEach((pl, vi) => {
      pl.inst.labels(t).forEach((spec, li) => {
        const a = (spec.alpha ?? 1);
        if (a <= 0.02 || pl.skip.has(String(spec.key))) return;
        const nm = nameOf(String(spec.key));
        const w = (nm.main.length + nm.pt.length + 3) * fs * 0.56 + fs * 1.3;
        items.push({ id: `${vi}:${li}`, spec, vi, li, moving: pl.moving.has(String(spec.key)), main: nm.main, pt: nm.pt, w, h: fs * 1.6 });
      });
    });
    const statics = planned.map((pl, vi) => ({ vi, rect: pl.rect, moving: pl.moving.size > 0 })).filter((x) => !x.moving);
    items.sort((a, b) => Number(a.moving) - Number(b.moving) || a.vi - b.vi || a.li - b.li);
    const placed: Rect[] = [];
    let out = "";
    for (const it of items) {
      const ax = it.spec.x, ay = it.spec.y, hw = it.w / 2, hh = it.h / 2;
      const cands: Array<[number, number]> = [
        [0, -(fs * 2.4 + hh)], [0, -(fs * 4.0 + hh)], [-(hw * 0.7), -(fs * 2.4 + hh)], [hw * 0.7, -(fs * 2.4 + hh)], [-(hw + fs * 1.2), -(fs * 1.6)], [hw + fs * 1.2, -(fs * 1.6)],
        [0, -(fs * 5.8 + hh)], [-(hw * 0.7), -(fs * 4.0 + hh)], [hw * 0.7, -(fs * 4.0 + hh)], [0, hh + fs * 1.8],
      ];
      let best: { cx: number; cy: number; hit: number } | null = null;
      for (const [dx, dy] of cands) {
        const cx = clamp(ax + dx, hw + 22, LIFE_W - hw - 22), cy = clamp(ay + dy, 100 + hh, 716 - hh);
        const rect: Rect = { x0: cx - hw, y0: cy - hh, x1: cx + hw, y1: cy + hh };
        // o nome não pode cobrir outros nomes, os rótulos que já existem NEM os bonecos/bichos parados de outras vinhetas
        const hit = placed.filter((p) => overlaps(rect, p, 8)).length * 2 + noGo.filter((n) => overlaps(rect, n, 0)).length +
          statics.filter((st) => st.vi !== it.vi && overlaps(rect, st.rect, 2)).length * 2;
        if (!best || hit < best.hit) best = { cx, cy, hit };
        if (hit === 0) break;
      }
      if (!best) continue;
      if (best.hit > 0 && it.moving) continue; // objeto em movimento sem lugar livre agora: o nome volta quando houver espaço
      const rect: Rect = { x0: best.cx - hw, y0: best.cy - hh, x1: best.cx + hw, y1: best.cy + hh };
      placed.push(rect);
      const appear = clamp((t - (1.2 + it.vi * 0.9 + it.li * 0.45)) / 0.8, 0, 1) * (it.spec.alpha ?? 1);
      if (appear <= 0.01) continue;
      // fio com contorno escuro e ponta em seta sobre o objeto (mesmo visual dos rótulos já existentes)
      const ang = Math.atan2(ay - best.cy, ax - best.cx), hx = 11;
      const tipX = ax, tipY = ay, baseX = ax - Math.cos(ang) * hx * 1.5, baseY = ay - Math.sin(ang) * hx * 1.5;
      const sx = best.cx + Math.max(-hw + hh, Math.min(hw - hh, ax - best.cx)), sy = best.cy + (ay > best.cy ? hh : -hh);
      out += `<g opacity="${f(appear)}">` +
        `<line x1="${f(sx)}" y1="${f(sy)}" x2="${f(baseX)}" y2="${f(baseY)}" stroke="rgba(18,32,26,.85)" stroke-width="5" stroke-linecap="round"/>` +
        `<line x1="${f(sx)}" y1="${f(sy)}" x2="${f(baseX)}" y2="${f(baseY)}" stroke="#f5cf72" stroke-width="2.4" stroke-linecap="round"/>` +
        `<path d="M${f(tipX)} ${f(tipY)} L${f(baseX + Math.sin(ang) * 6)} ${f(baseY - Math.cos(ang) * 6)} L${f(baseX - Math.sin(ang) * 6)} ${f(baseY + Math.cos(ang) * 6)} Z" fill="#f5cf72" stroke="rgba(18,32,26,.85)" stroke-width="1.5" stroke-linejoin="round"/>` +
        `<rect x="${f(rect.x0)}" y="${f(rect.y0)}" width="${f(it.w)}" height="${f(it.h)}" rx="${f(hh)}" fill="rgba(18,32,26,.88)" stroke="#f5cf72" stroke-width="2"/>` +
        `<text x="${f(best.cx)}" y="${f(best.cy + fs * 0.35)}" text-anchor="middle" font-family='${LABEL_FONT}' font-size="${f(fs)}" font-weight="800" fill="#fff">${esc(it.main)}<tspan font-weight="500" fill="#cfe7d8"> &#160;·&#160; ${esc(it.pt)}</tspan></text></g>`;
    }
    return out;
  };

  const actorNames = planned.map((p) => p.inst.id);
  return {
    actors: actorNames,
    render: (t: number, opts?: RenderOpts) => {
      let out = "";
      for (const pl of planned) {
        try { out += pl.inst.draw(t); } catch { /* um elemento com falha não derruba a cena */ }
      }
      try { out += labelLayer(t, clamp(opts?.labelPx ?? 28, 18, 56)); } catch { /* idem */ }
      return out;
    },
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
