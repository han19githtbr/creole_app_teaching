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
import { buildWindowViews, getSceneWindows } from "@/lib/storyWindowLife";
import { buildWeather } from "@/lib/storyWeatherLife";
import { CABIN_DEFS, NIGHT_GROUND_DEFS, NIGHT_SKY_DEFS } from "@/lib/storyVignettesExtra";

const THEME_KEYS: Array<[RegExp, string]> = [
  [/tecnolog/, "tecnologia"], [/natureza/, "natureza"], [/cultura/, "cultura"], [/turismo/, "turismo"],
  [/interior|campo|rural/, "interior"], [/danca/, "danca"], [/geograf/, "geografia"], [/histor/, "historia"],
  [/cinema/, "cinema"], [/music/, "musica"], [/lazer/, "lazeres"], [/estoic/, "estoicismo"], [/religi/, "religiao"],
  [/gastronom/, "gastronomia"], [/idioma/, "idiomas"],
];

const ALL: Record<string, VignetteDef> = Object.fromEntries([...SKY_DEFS, ...STRIP_DEFS, ...GROUND_DEFS, ...WATER_DEFS, ...NIGHT_SKY_DEFS, ...NIGHT_GROUND_DEFS, ...CABIN_DEFS].map((d) => [d.id, d]));

/** o que cada tema costuma ter, em ordem de preferência */
const PLAN: Record<string, { ground: string[]; sky: string[]; water: string[]; strip: string[] }> = {
  tecnologia: { ground: ["robots", "classroom", "cyclist", "talkers", "cat"], sky: ["helicopter", "airplane", "flock"], water: ["fishSchool"], strip: ["airport"] },
  natureza: { ground: ["critters", "turtleLand", "cat", "picnic", "couple"], sky: ["flock", "balloon"], water: ["ducks", "fishSchool", "turtleSwim"], strip: [] },
  cultura: { ground: ["drummer", "dancers", "guitarist", "picnic", "talkers"], sky: ["flock", "balloon"], water: ["ducks"], strip: [] },
  turismo: { ground: ["couple", "picnic", "cyclist", "turtleLand", "guitarist"], sky: ["balloon", "airplane", "cabin", "flock"], water: ["sailing", "dolphin", "fishSchool", "turtleSwim"], strip: ["airport"] },
  interior: { ground: ["farm", "petsPlay", "cat", "cyclist", "picnic"], sky: ["flock", "balloon"], water: ["ducks", "fishSchool"], strip: [] },
  danca: { ground: ["dancers", "guitarist", "drummer", "picnic", "cat"], sky: ["flock"], water: [], strip: [] },
  geografia: { ground: ["classroom", "cyclist", "picnic", "talkers", "cat"], sky: ["airplane", "cabin", "balloon", "helicopter", "flock"], water: ["sailing", "dolphin", "fishSchool"], strip: ["airport"] },
  historia: { ground: ["rider", "classroom", "talkers", "cat"], sky: ["flock", "airplane"], water: ["sailing", "fishSchool"], strip: [] },
  cinema: { ground: ["talkers", "cat", "couple"], sky: ["airplane", "helicopter"], water: [], strip: [] },
  musica: { ground: ["guitarist", "drummer", "dancers", "cat"], sky: ["flock", "balloon"], water: [], strip: [] },
  lazeres: { ground: ["soccer", "picnic", "cyclist", "petsPlay", "guitarist"], sky: ["balloon", "flock", "airplane"], water: ["ducks", "fishSchool"], strip: [] },
  estoicismo: { ground: ["classroom", "talkers", "cat", "picnic"], sky: ["flock", "balloon"], water: ["ducks", "fishSchool"], strip: [] },
  religiao: { ground: ["talkers", "couple", "cat", "picnic"], sky: ["flock", "balloon"], water: ["ducks", "fishSchool"], strip: [] },
  gastronomia: { ground: ["dining", "cat", "talkers"], sky: ["flock"], water: ["fishSchool"], strip: [] },
  idiomas: { ground: [], sky: [], water: [], strip: [] },
};

/** chance de a história ganhar o ciclo de chuva + interior da casa + arco-íris (cenas externas de dia) */
const WEATHER_CHANCE: Record<string, number> = {
  natureza: 0.9, lazeres: 0.8, interior: 0.8, cultura: 0.6, turismo: 0.6, geografia: 0.6, religiao: 0.5, historia: 0.5,
  estoicismo: 0.5, musica: 0.4, danca: 0.4, tecnologia: 0.25, cinema: 0.3, gastronomia: 0.3,
};

/** palavras do texto da cena que puxam um elemento para o começo da fila */
const BOOST: Array<[RegExp, string]> = [
  [/aviao|aeroporto|voo|avyon|avion/, "airport"], [/aviao|voo|avyon|avion|passageir/, "cabin"], [/helicopt|elikopte/, "helicopter"], [/violao|guitarra|gita|guitare/, "guitarist"],
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

interface Planned { def: VignetteDef; inst: VignetteInst; rect: Rect; order: number; moving: Set<string> }

export function createSceneLife(input: DirectorInput): LifeScene {
  const text = norm([input.title ?? "", ...(input.elements ?? []).flatMap((e) => [e.pt ?? "", e.kreyol ?? "", e.fr ?? ""])].join(" "));
  const themeNorm = norm(input.theme ?? "");
  const idBase = norm(input.sceneId).replace(/\.(svg|png|webp|jpg|jpeg)$/g, "").split("/").pop() ?? "";
  const theme = THEME_KEYS.find(([re]) => re.test(themeNorm))?.[1] ?? THEME_KEYS.find(([re]) => re.test(idBase))?.[1] ?? "natureza";
  const grid: SceneGrid = getSceneGrid(input.sceneId) ?? gridFromZones(input.zones ?? null);
  // Cena interna (cozinha, sala de aula, cinema...): nada de chão aberto, mas as JANELAS ganham vida
  // (pássaros, gente passando, noite com coruja e morcegos). Sem janela desenhada, a cena fica como está.
  const indoor = grid.indoor || theme === "idiomas" || idBase.startsWith("idiomas");
  const sceneWindows = indoor ? getSceneWindows(input.sceneId) : null;
  if (indoor && !sceneWindows) return { actors: [], render: () => "" };
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
  const clashes = (inst: VignetteInst): boolean => {
    const keys = inst.labels(0).map((l) => NAMES[l.key as string]).filter(Boolean) as Name[];
    return keys.some((n) => existing.has(norm(n.p)) || existing.has(norm(n.k)) || existing.has(norm(n.f)));
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
  const free = (rect: Rect, pad = 14) => !taken.some((t) => overlaps(rect, t, pad)) && coveredByNames(rect) <= 0.18;

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

  if (sceneWindows) {
    const winNight = night || rngFrom(`${input.sceneId}|noite`)() < 0.4;
    const views = buildWindowViews(sceneWindows, { sceneId: input.sceneId, night: winNight });
    views.forEach((inst, k) => {
      const w = sceneWindows.w[k].r;
      planned.push({ def: { id: "window", need: "sky", w: w[2] - w[0], h: w[3] - w[1], build: () => inst }, inst, rect: { x0: w[0], y0: w[1], x1: w[2], y1: w[3] }, order: planned.length, moving: new Set<string>() });
      taken.push({ x0: w[0], y0: w[1], x1: w[2], y1: w[3] });
    });
  }
  const caps = indoor ? { ground: 0, sky: 0, water: 0, strip: 0 } : { ground: 4, sky: night ? 2 : 3, water: 3, strip: 1 };
  const used = { ground: 0, sky: 0, water: 0, strip: 0 };
  const basePlan = PLAN[theme] ?? PLAN.natureza;
  // de noite: morcegos e coruja no céu, vaga-lumes (e grilos) no chão — nada de bando de pássaros ou balão
  const plan = night
    ? { ...basePlan, sky: ["bats", "owlFly", ...basePlan.sky.filter((id) => id !== "flock" && id !== "balloon")], ground: ["fireflies", ...basePlan.ground] }
    : basePlan;
  const boosted = BOOST.filter(([re]) => re.test(text)).map(([, id]) => id);
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
      if (clashes(inst)) continue;
      // quais rótulos se movem (decide a ordem de colocação: os parados primeiro)
      const moving = new Set<string>();
      const probes = [0, 3.7, 9.1, 15.3];
      const base = inst.labels(0);
      base.forEach((l, i) => { if (probes.some((t) => { const q = inst.labels(t)[i]; return q && (Math.abs(q.x - l.x) > 3 || Math.abs(q.y - l.y) > 3); })) moving.add(String(l.key)); });
      planned.push({ def, inst, rect: spot.rect, order: planned.length, moving });
      taken.push(spot.rect);
      used[kind]++;
    }
  }
  // clima: chuva, guarda-chuvas, interior da casa e arco-íris (só em cena externa, de dia, com céu aberto)
  const skyShare = rectShare(grid, { x0: 0, y0: 0, x1: LIFE_W, y1: LIFE_H }, [SKY, FAR]);
  if (!indoor && !night && skyShare > 0.12 && rngFrom(`${input.sceneId}|clima-on`)() < (WEATHER_CHANCE[theme] ?? 0.5)) {
    const inst = buildWeather({ sceneId: input.sceneId, gt });
    planned.push({ def: { id: "weather", need: "sky", w: 0, h: 0, build: () => inst }, inst, rect: { x0: -9, y0: -9, x1: -8, y1: -8 }, order: planned.length, moving: new Set<string>() });
  }
  // rótulos que mudam de lugar ao longo do tempo (janela/clima): os parados são colocados primeiro
  for (const pl of planned) {
    if (pl.def.id !== "window" && pl.def.id !== "weather") continue;
    const samples = Array.from({ length: 24 }, (_, k) => pl.inst.labels(k * 2.1));
    const first = new Map<string, { x: number; y: number }>();
    for (const ls of samples) for (const l of ls) {
      const k0 = String(l.key), prev = first.get(k0);
      if (!prev) first.set(k0, { x: l.x, y: l.y });
      else if (Math.abs(prev.x - l.x) > 3 || Math.abs(prev.y - l.y) > 3) pl.moving.add(k0);
    }
  }
  planned.sort((a, b) => a.inst.z - b.inst.z);

  const nameOf = (key: string): { main: string; pt: string } => {
    const n = NAMES[key];
    return n ? { main: lang === "fr" ? n.f : n.k, pt: n.p } : { main: key, pt: "" };
  };

  const cover = (t: number) => planned.reduce((m, p) => Math.max(m, p.inst.cover?.(t) ?? 0), 0);

  /* ---- rótulos: pílula acima do objeto, ligada por fio com seta; sem encavalar ---- */
  const labelLayer = (t: number, fs: number): string => {
    type Item = { id: string; spec: LabelSpec; vi: number; li: number; moving: boolean; main: string; pt: string; w: number; h: number };
    const items: Item[] = [];
    planned.forEach((pl, vi) => {
      const cvNow = pl.inst.cover ? 0 : cover(t);
      pl.inst.labels(t).forEach((rawSpec, li) => {
        const spec: LabelSpec = cvNow > 0 ? { ...rawSpec, alpha: (rawSpec.alpha ?? 1) * (1 - cvNow) } : rawSpec;
        const a = (spec.alpha ?? 1);
        if (a <= 0.02) return;
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
    soundCues: (duration: number) => planned.flatMap((p) => p.inst.cues?.(duration) ?? []),
    cover,
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
