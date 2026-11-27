/**
 * Anima automaticamente os elementos vivos, veículos, água, nuvens e chamas nas ilustrações SVG
 * do banco que ainda não trazem `@keyframes` próprios (as 290+ cenas variadas de todos os temas).
 *
 * Como usa CSS `@keyframes` dentro de `<style>` + wrappers `<g class="...">` dentro do `<g transform="...">`
 * de cada objeto, funciona de forma 100% determinística tanto no player (live) quanto na exportação MP4/WebM
 * quadro a quadro via `buildSvgLayerKit(...).frozen(seconds)`.
 */

const MOTION_CSS = `
.sm-whale{transform-box:fill-box;transform-origin:center center;animation:smWhale 16s ease-in-out infinite}
@keyframes smWhale{0%{transform:translate(70px,6px) rotate(1.5deg) scaleX(1)}24%{transform:translate(0px,-8px) rotate(-1.5deg) scaleX(1)}47%{transform:translate(-70px,4px) rotate(1.5deg) scaleX(1)}49%{transform:translate(-72px,4px) rotate(0deg) scaleX(1)}50%{transform:translate(-72px,4px) rotate(0deg) scaleX(-1)}51%{transform:translate(-70px,4px) rotate(-1.5deg) scaleX(-1)}74%{transform:translate(0px,-8px) rotate(1.5deg) scaleX(-1)}97%{transform:translate(70px,6px) rotate(-1.5deg) scaleX(-1)}99%{transform:translate(72px,6px) rotate(0deg) scaleX(-1)}100%{transform:translate(72px,6px) rotate(0deg) scaleX(1)}}
.sm-dolphin{transform-box:fill-box;transform-origin:center;animation:smDolphin 4.8s ease-in-out infinite}
@keyframes smDolphin{0%,100%{transform:translate(-14px,5px) rotate(2.5deg)}45%{transform:translate(18px,-16px) rotate(-5deg)}}
.sm-spin{transform-origin:0px 0px;animation:smSpin 14s linear infinite}
@keyframes smSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.sm-swing-cab{transform-origin:0px -134px;animation:smSwingCab 4.6s ease-in-out infinite}
@keyframes smSwingCab{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
.sm-swing-ham{transform-origin:0px -170px;animation:smSwingHam 4.8s ease-in-out infinite}
@keyframes smSwingHam{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
.sm-swing-bal{transform-origin:0px -256px;animation:smSwingBal 4.2s ease-in-out infinite}
@keyframes smSwingBal{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}
.sm-lightning{animation:smLightning 5.5s ease-in-out infinite}
@keyframes smLightning{0%,72%,84%,100%{opacity:0.45}76%{opacity:1}80%{opacity:0.25}}
.sm-fish-0{transform-box:fill-box;transform-origin:center;animation:smFish0 9s ease-in-out infinite}
@keyframes smFish0{0%{transform:translate(48px,-8px) scaleX(1)}47%{transform:translate(-48px,8px) scaleX(1)}50%{transform:translate(-48px,8px) scaleX(-1)}97%{transform:translate(48px,-8px) scaleX(-1)}100%{transform:translate(48px,-8px) scaleX(1)}}
.sm-fish-1{transform-box:fill-box;transform-origin:center;animation:smFish1 11s ease-in-out infinite}
@keyframes smFish1{0%{transform:translate(42px,10px) scaleX(1)}47%{transform:translate(-42px,-10px) scaleX(1)}50%{transform:translate(-42px,-10px) scaleX(-1)}97%{transform:translate(42px,10px) scaleX(-1)}100%{transform:translate(42px,10px) scaleX(1)}}
.sm-fish-2{transform-box:fill-box;transform-origin:center;animation:smFish2 13s ease-in-out infinite}
@keyframes smFish2{0%{transform:translate(38px,-12px) scaleX(1)}47%{transform:translate(-38px,12px) scaleX(1)}50%{transform:translate(-38px,12px) scaleX(-1)}97%{transform:translate(38px,-12px) scaleX(-1)}100%{transform:translate(38px,-12px) scaleX(1)}}
.sm-bubbles{animation:smBubbles 4.2s ease-in-out infinite}
@keyframes smBubbles{0%,100%{transform:translateY(4px);opacity:.55}50%{transform:translateY(-14px);opacity:.95}}
.sm-coral{transform-origin:0px 0px;animation:smCoral 5.4s ease-in-out infinite}
@keyframes smCoral{0%,100%{transform:rotate(-2deg) skewX(-1deg)}50%{transform:rotate(2deg) skewX(1deg)}}
.sm-pulse{transform-box:fill-box;transform-origin:center;animation:smPulse 4s ease-in-out infinite}
@keyframes smPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
.sm-float{transform-box:fill-box;transform-origin:center;animation:smFloat 4.8s ease-in-out infinite}
@keyframes smFloat{0%,100%{transform:translate(-4px,2px) rotate(-1.2deg)}50%{transform:translate(5px,-4px) rotate(1.4deg)}}
.sm-boat{transform-origin:0px 0px;animation:smBoat 4.6s ease-in-out infinite}
@keyframes smBoat{0%,100%{transform:rotate(-1.2deg) translateY(0px)}50%{transform:rotate(1.2deg) translateY(-3px)}}
.sm-surf{animation:smSurf 4.4s ease-in-out infinite}
@keyframes smSurf{0%,100%{transform:translateY(0px);opacity:.65}50%{transform:translateY(-5px);opacity:.88}}
.sm-birds{transform-box:fill-box;transform-origin:center;animation:smBirds 5.6s ease-in-out infinite}
@keyframes smBirds{0%,100%{transform:translate(-14px,3px)}50%{transform:translate(16px,-6px)}}
.sm-hover{transform-box:fill-box;transform-origin:center;animation:smHover 4.4s ease-in-out infinite}
@keyframes smHover{0%,100%{transform:translate(-6px,4px) rotate(-2deg)}50%{transform:translate(8px,-9px) rotate(2.5deg)}}
.sm-fly{transform-box:fill-box;transform-origin:center;animation:smFly 6.4s ease-in-out infinite}
@keyframes smFly{0%,100%{transform:translate(-18px,4px) rotate(-1.5deg)}50%{transform:translate(18px,-7px) rotate(2deg)}}
.sm-crab{transform-origin:0px 0px;animation:smCrab 3.8s ease-in-out infinite}
@keyframes smCrab{0%,100%{transform:translateX(-9px) rotate(-1.2deg)}50%{transform:translateX(9px) rotate(1.2deg)}}
.sm-critter{transform-origin:0px 0px;animation:smCritter 4.2s ease-in-out infinite}
@keyframes smCritter{0%,100%{transform:scaleY(1) rotate(0deg)}50%{transform:scaleY(1.03) rotate(1.2deg)}}
.sm-bird-stand{transform-origin:0px 0px;animation:smBirdStand 4.6s ease-in-out infinite}
@keyframes smBirdStand{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.6deg)}}
.sm-dance{transform-origin:0px 0px;animation:smDance 2.6s ease-in-out infinite}
@keyframes smDance{0%,100%{transform:rotate(-3.2deg) translateY(0px)}50%{transform:rotate(3.2deg) translateY(-4px)}}
.sm-flame{transform-origin:0px 0px;animation:smFlame 1.4s ease-in-out infinite}
@keyframes smFlame{0%,100%{transform:scale(0.98,1);opacity:.92}50%{transform:scale(1.03,1.045);opacity:1}}
.sm-flag{transform-origin:0px 0px;animation:smFlag 3.2s ease-in-out infinite}
@keyframes smFlag{0%,100%{transform:skewX(-2deg)}50%{transform:skewX(2.4deg)}}
.sm-sway{transform-origin:0px 0px;animation:smSway 5.2s ease-in-out infinite}
.sm-reeds{transform-box:fill-box;transform-origin:center bottom;animation:smSway 5.2s ease-in-out infinite}
@keyframes smSway{0%,100%{transform:rotate(-1.3deg)}50%{transform:rotate(1.3deg)}}
.sm-water-shimmer{animation:smWaterShimmer 3.8s ease-in-out infinite}
@keyframes smWaterShimmer{0%,100%{opacity:.92;transform:translateY(0px)}50%{opacity:1;transform:translateY(-2px)}}
.sm-vehicle{transform-origin:0px 0px;animation:smVehicle 2.4s ease-in-out infinite}
@keyframes smVehicle{0%,100%{transform:translateY(0px)}50%{transform:translateY(-2px)}}
.sm-cloud-0{animation:smCloud0 26s ease-in-out infinite alternate}
.sm-cloud-1{animation:smCloud1 32s ease-in-out infinite alternate}
.sm-cloud-2{animation:smCloud2 22s ease-in-out infinite alternate}
@keyframes smCloud0{0%{transform:translateX(-16px)}100%{transform:translateX(20px)}}
@keyframes smCloud1{0%{transform:translateX(14px)}100%{transform:translateX(-18px)}}
@keyframes smCloud2{0%{transform:translateX(-12px)}100%{transform:translateX(15px)}}
.sm-fireflies{animation:smFireflies 4.6s ease-in-out infinite}
@keyframes smFireflies{0%,100%{transform:translateY(3px);opacity:.65}50%{transform:translateY(-7px);opacity:1}}
.sm-petals{animation:smPetals 5.8s ease-in-out infinite}
@keyframes smPetals{0%,100%{transform:translate(-5px,-3px);opacity:.72}50%{transform:translate(8px,7px);opacity:.95}}
.sm-rain{animation:smRain 1.2s linear infinite}
@keyframes smRain{0%{transform:translate(4px,-12px);opacity:.38}50%{opacity:.58}100%{transform:translate(-4px,12px);opacity:.38}}
`;

const OBJ_CLASS_MAP: Record<string, string> = {
  // Marinhos
  "baln": "sm-whale",
  "dfen": "sm-dolphin",
  "pwason": "sm-fish-group",
  "koray": "sm-coral",
  "zetwal lanm": "sm-pulse",
  "nenifa": "sm-float",
  // Aves e pequenos animais
  "krab": "sm-crab",
  "flamen": "sm-bird-stand",
  "pelikan": "sm-bird-stand",
  "chwt": "sm-bird-stand",
  "poul": "sm-critter",
  "kolibri": "sm-hover",
  "pijon": "sm-hover",
  "malfini": "sm-fly",
  "myl": "sm-hover",
  "koukouy": "sm-hover",
  "ekiry": "sm-critter",
  "lapen": "sm-critter",
  "kabrit": "sm-critter",
  "bf": "sm-critter",
  "chwal": "sm-critter",
  "mouton": "sm-critter",
  "kochon": "sm-critter",
  "krapo": "sm-critter",
  "lzar": "sm-critter",
  "bourik": "sm-critter",
  // Embarcações e ar
  "bato": "sm-boat",
  "karavl": "sm-boat",
  "kayak": "sm-boat",
  "avyon": "sm-fly",
  "balon": "sm-hover",
  "drn": "sm-hover",
  "kap": "sm-hover",
  "satelit": "sm-hover",
  "teleferik": "sm-sway",
  "tnad": "sm-sway",
  // Veículos e máquinas
  "tren": "sm-vehicle",
  "bis touristik": "sm-vehicle",
  "machin elektrik": "sm-vehicle",
  "skout": "sm-vehicle",
  "taptap": "sm-vehicle",
  "bisiklt": "sm-vehicle",
  "robo": "sm-critter",
  "bra robo": "sm-sway",
  "moulen van": "sm-sway",
  "moulen": "sm-sway",
  // Pessoas e dança
  "balerin": "sm-dance",
  "dans fi": "sm-dance",
  "dans gason": "sm-dance",
  "granmoun": "sm-critter",
  "timoun": "sm-critter",
  "dirijan": "sm-critter",
  "atis": "sm-critter",
  // Fogo, luzes, bandeiras, água e vegetação
  "dife": "sm-flame",
  "flanbo": "sm-flame",
  "bouji": "sm-flame",
  "lanp lwil": "sm-flame",
  "kandelab": "sm-flame",
  "boukann": "sm-flame",
  "drapo": "sm-flag",
  "bany": "sm-flag",
  "bany pwosesyon": "sm-flag",
  "kaskad": "sm-water-shimmer",
  "fontn": "sm-water-shimmer",
  "letan": "sm-water-shimmer",
  "lak": "sm-water-shimmer",
  "pisin": "sm-water-shimmer",
  "pyebwa": "sm-sway",
  "palmis": "sm-sway",
  "branch palmis": "sm-sway",
  "kokoye": "sm-sway",
  "pye mango": "sm-sway",
  "pye bannann": "sm-sway",
  "bambou": "sm-sway",
  "manglye": "sm-sway",
  "oliv": "sm-sway",
  "tounesl": "sm-sway",
  "lis": "sm-sway",
  "fouj": "sm-sway",
  "fl": "sm-sway",
  "nyaj lapli": "sm-cloud-0",
};

/** Encontra o índice final (após `</g>`) de um bloco `<g ...>...</g>` começando em `openStart`. */
function findGroupEnd(svg: string, openStart: number): number {
  const tagRe = /<\/?g(?:\s[^>]*)?>/g;
  tagRe.lastIndex = openStart;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(svg))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth === 0) return m.index + m[0].length;
    } else if (!m[0].endsWith("/>")) {
      depth++;
    }
  }
  return -1;
}

/** Envolve os filhos de `<g ...>...</g>` com `<g class="${cls}">...</g>`. */
function wrapGroupInner(groupMarkup: string, cls: string): string {
  const openEnd = groupMarkup.indexOf(">");
  const closeStart = groupMarkup.lastIndexOf("</g>");
  if (openEnd === -1 || closeStart <= openEnd) return groupMarkup;
  return `${groupMarkup.slice(0, openEnd + 1)}<g class="${cls}">${groupMarkup.slice(openEnd + 1, closeStart)}</g></g>`;
}

/** Anima cada peixe filho dentro do cardume (`<!-- obj pwason -->`) com fase própria. */
function animateFishSchool(groupMarkup: string): string {
  const openEnd = groupMarkup.indexOf(">");
  const closeStart = groupMarkup.lastIndexOf("</g>");
  if (openEnd === -1 || closeStart <= openEnd) return groupMarkup;
  const inner = groupMarkup.slice(openEnd + 1, closeStart);
  let out = "";
  let pos = 0;
  let fishIdx = 0;
  while (pos < inner.length) {
    const nextG = inner.indexOf("<g", pos);
    if (nextG === -1) {
      out += inner.slice(pos);
      break;
    }
    out += inner.slice(pos, nextG);
    const end = findGroupEnd(inner, nextG);
    if (end === -1) {
      out += inner.slice(nextG);
      break;
    }
    const sub = inner.slice(nextG, end);
    // O último <g> dentro de pwason pode ser o grupo de bolhas (`fill="none" stroke="#e8fbff"`)
    const isBubbles = /stroke="#e8fbff"/.test(sub.slice(0, 80)) && !/transform=/.test(sub.slice(0, 60));
    out += wrapGroupInner(sub, isBubbles ? "sm-bubbles" : `sm-fish-${fishIdx++ % 3}`);
    pos = end;
  }
  return `${groupMarkup.slice(0, openEnd + 1)}${out}</g>`;
}

function classForComment(comment: string): string | null {
  const c = comment.trim();
  if (c.startsWith("obj ")) {
    return OBJ_CLASS_MAP[c.slice(4).trim()] ?? null;
  }
  if (c === "cloud 0") return "sm-cloud-0";
  if (c === "cloud 1" || c === "cloud 3") return "sm-cloud-1";
  if (c === "cloud 2" || c === "cloud 4") return "sm-cloud-2";
  if (c === "decor birds in flight") return "sm-birds";
  if (c === "decor bubbles sparkle") return "sm-bubbles";
  if (c === "decor reeds") return "sm-reeds";
  if (c === "decor surf foam") return "sm-surf";
  if (c === "fireflies sparkle") return "sm-fireflies";
  if (c === "sparkle petals drifting") return "sm-petals";
  if (c === "rain overlay") return "sm-rain";
  return null;
}

/**
 * Injeta animações CSS determinísticas em SVGs estáticos do banco (`/public/ghibli/*-02..20.svg`).
 * Se o SVG já possui `@keyframes`, retorna sem alterações.
 */
export function animateDiverseSvg(svgText: string): string {
  if (!svgText || /@keyframes/i.test(svgText)) return svgText;
  const defsClose = svgText.indexOf("</defs>");
  if (defsClose === -1) return svgText;

  const commentRe = /<!--\s*(obj [^->]+?|cloud [01234]|decor birds in flight|decor bubbles sparkle|decor reeds|decor surf foam|fireflies sparkle|sparkle petals drifting|rain overlay)\s*-->/g;
  const edits: Array<{ start: number; end: number; replacement: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = commentRe.exec(svgText))) {
    const cls = classForComment(m[1]);
    if (!cls) continue;
    let cursor = m.index + m[0].length;
    while (cursor < svgText.length && /\s/.test(svgText[cursor])) cursor++;

    if (cls === "sm-surf") {
      if (svgText.startsWith("<path", cursor)) {
        const pathEnd = svgText.indexOf("/>", cursor);
        if (pathEnd !== -1) {
          const pathTag = svgText.slice(cursor, pathEnd + 2);
          edits.push({ start: cursor, end: pathEnd + 2, replacement: `<g class="${cls}">${pathTag}</g>` });
        }
      }
      continue;
    }

    if (!svgText.startsWith("<g", cursor)) continue;
    const end = findGroupEnd(svgText, cursor);
    if (end === -1) continue;
    const orig = svgText.slice(cursor, end);
    const replacement = cls === "sm-fish-group" ? animateFishSchool(orig) : wrapGroupInner(orig, cls);
    if (replacement !== orig) edits.push({ start: cursor, end, replacement });
  }

  if (edits.length === 0) return svgText;

  let result = "";
  let pos = 0;
  for (const e of edits) {
    if (e.start < pos) continue;
    result += svgText.slice(pos, e.start) + e.replacement;
    pos = e.end;
  }
  result += svgText.slice(pos);

  const newDefsClose = result.indexOf("</defs>");
  if (newDefsClose === -1) return svgText;
  return `${result.slice(0, newDefsClose)}<style>${MOTION_CSS}</style>${result.slice(newDefsClose)}`;
}
