// Peças compartilhadas do gerador "diverse": cores, céus, fundos, chãos e utilitários de desenho.
// Mesmo formato (SVG 1200x800) e mesmo estilo (gradientes suaves, contorno escuro, sombra no chão) do banco Ghibli.

export const f = (n) => Math.round(n * 10) / 10;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** escurece uma cor #rrggbb (k 0..1) */
export function dk(hex, k = 0.35) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.round(v * (1 - k)));
  return `#${[c((n >> 16) & 255), c((n >> 8) & 255), c(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
/** clareia uma cor #rrggbb (k 0..1) */
export function lt(hex, k = 0.3) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.min(255, Math.round(v + (255 - v) * k));
  return `#${[c((n >> 16) & 255), c((n >> 8) & 255), c(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** forma preenchida com contorno mais escuro da mesma cor */
export const shape = (d, fill, sw = 2.5, extra = "") =>
  `<path d="${d}" fill="${fill}" stroke="${dk(fill.startsWith("#") ? fill : "#444444", 0.45)}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
export const ell = (cx, cy, rx, ry, fill, sw = 2.5, extra = "") =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" stroke="${dk(fill.startsWith("#") ? fill : "#444444", 0.45)}" stroke-width="${sw}" ${extra}/>`;
export const rect = (x, y, w, h, fill, sw = 2.5, rx = 3, extra = "") =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="${fill}" stroke="${dk(fill.startsWith("#") ? fill : "#444444", 0.45)}" stroke-width="${sw}" ${extra}/>`;
export const line = (x1, y1, x2, y2, stroke, w = 3, extra = "") =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
export const shadow = (rx, dy = 0) => `<ellipse cx="0" cy="${dy}" rx="${f(rx)}" ry="${f(rx * 0.2)}" fill="#1b1a14" opacity="0.28"/>`;
export const glossy = (cx, cy, rx, ry, op = 0.35) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="#ffffff" opacity="${op}"/>`;

export const SKIN = ["#8d5a3b", "#6f4429", "#a8704a", "#5a3520"];

/** figura humana simples (origem nos pés, ~170 px de altura) */
export function person({ skin = SKIN[0], shirt = "#d64545", pants = "#2f4a8a", hat = null, hair = "#1c1410", dress = false, arms = "down", held = "", headWrap = null, beard = false, lean = 0, scale = 1 }) {
  const legs = dress
    ? shape("M-30,-70 L30,-70 L40,0 L-40,0 Z", pants, 2.5)
    : `${rect(-16, -78, 14, 78, pants, 2.5, 5)}${rect(2, -78, 14, 78, dk(pants, 0.12), 2.5, 5)}${ell(-9, -1, 14, 6, "#2a1b14", 2)}${ell(9, -1, 14, 6, "#2a1b14", 2)}`;
  const torso = shape("M-26,-82 Q-30,-130 -18,-142 L18,-142 Q30,-130 26,-82 Z", shirt, 2.5);
  const armL = arms === "up" ? shape("M-24,-132 Q-52,-150 -48,-186", "none", 0) + line(-24, -132, -50, -184, shirt, 13) + ell(-50, -190, 8, 8, skin, 2) : line(-24, -132, -34, -92, shirt, 13) + ell(-35, -86, 8, 8, skin, 2);
  const armR = arms === "out" ? line(24, -132, 58, -118, shirt, 13) + ell(62, -117, 8, 8, skin, 2) : arms === "up" ? line(24, -132, 50, -184, shirt, 13) + ell(50, -190, 8, 8, skin, 2) : line(24, -132, 34, -92, shirt, 13) + ell(35, -86, 8, 8, skin, 2);
  const head = `${rect(-6, -152, 12, 14, skin, 2, 4)}${ell(0, -168, 17, 19, skin, 2.5)}`;
  const hairSvg = headWrap ? "" : `<path d="M-17,-170 Q-16,-190 0,-190 Q16,-190 17,-170 Q8,-178 0,-177 Q-9,-178 -17,-170 Z" fill="${hair}"/>`;
  const wrap = headWrap ? `<path d="M-19,-168 Q-18,-196 0,-196 Q19,-196 19,-168 Q8,-176 0,-175 Q-8,-176 -19,-168 Z" fill="${headWrap}" stroke="${dk(headWrap, 0.4)}" stroke-width="2"/><path d="M12,-190 Q30,-196 28,-180" fill="${headWrap}" stroke="${dk(headWrap, 0.4)}" stroke-width="2"/>` : "";
  const face = `<circle cx="-6" cy="-168" r="1.8" fill="#1a1210"/><circle cx="6" cy="-168" r="1.8" fill="#1a1210"/><path d="M-5,-160 Q0,-156 5,-160" stroke="#1a1210" stroke-width="1.8" fill="none"/>`;
  const beardSvg = beard ? `<path d="M-14,-162 Q0,-140 14,-162 Q8,-152 0,-151 Q-8,-152 -14,-162 Z" fill="#eeeeee" stroke="#aaaaaa" stroke-width="1.5"/>` : "";
  const hatSvg = hat === "straw" ? `${ell(0, -184, 38, 9, "#e6c56a", 2.5)}${shape("M-20,-186 Q-18,-212 0,-212 Q18,-212 20,-186 Z", "#efd27d", 2.5)}${rect(-20, -192, 40, 6, "#c0392b", 1.5, 2)}` : "";
  return `<g transform="scale(${scale}) rotate(${lean})">${shadow(40)}${legs}${armL}${torso}${armR}${head}${hairSvg}${wrap}${face}${beardSvg}${hatSvg}${held}</g>`;
}

/* ------------------------------ céus ------------------------------ */
const SKIES = {
  day: { stops: ["#2a74b5", "#6bb0de", "#bfe4f3", "#fdf3dc"], sun: "#fffded", glow: "#ffe9a8", cloud: ["#ffffff", "#c7d8e6"] },
  clear: { stops: ["#1c63a6", "#3f8fcf", "#8cc7ea", "#d8f0f8"], sun: "#fffbe0", glow: "#ffe38a", cloud: ["#ffffff", "#c7d8e6"] },
  dawn: { stops: ["#5b6fb0", "#c98fb0", "#f4b183", "#ffe2a8"], sun: "#fff3c4", glow: "#ffb86b", cloud: ["#fff1e0", "#d9a3a8"] },
  sunset: { stops: ["#31396b", "#8a4f7d", "#e0705a", "#fbc07a"], sun: "#ffe3a0", glow: "#ff8f4a", cloud: ["#ffe1c8", "#b9707f"] },
  golden: { stops: ["#4a7fb0", "#e8b86b", "#f6cf8a", "#fff0c4"], sun: "#fff6d2", glow: "#ffd36a", cloud: ["#fff6e4", "#e2b98c"] },
  overcast: { stops: ["#7d8c98", "#a9b7c0", "#c8d2d8", "#e1e7ea"], sun: null, glow: null, cloud: ["#eef1f3", "#a3afb8"] },
  rain: { stops: ["#4d5a68", "#6c7b88", "#8c9aa5", "#aab6bf"], sun: null, glow: null, cloud: ["#9aa6b0", "#566370"] },
  mist: { stops: ["#a9c3cf", "#c7d9de", "#dfe9ea", "#f2f4ee"], sun: "#fffbe6", glow: "#fff2c4", cloud: ["#ffffff", "#d3dfe3"] },
  night: { stops: ["#0b1330", "#16254f", "#2b3c70", "#4a5a8f"], sun: null, glow: null, cloud: ["#4b5a8c", "#232f55"] },
  violet: { stops: ["#2c2a5e", "#5c4a8f", "#b46f9b", "#f0a27c"], sun: "#ffe7b0", glow: "#ff9a6a", cloud: ["#f3cfd8", "#8b6a9a"] },
};

export function skyDefs(kind) {
  const s = SKIES[kind];
  const id = kind === "night" ? "skyNight" : "skyMain";
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.stops[0]}"/><stop offset=".38" stop-color="${s.stops[1]}"/><stop offset=".72" stop-color="${s.stops[2]}"/><stop offset="1" stop-color="${s.stops[3]}"/></linearGradient>
<linearGradient id="cloudG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.cloud[0]}"/><stop offset="1" stop-color="${s.cloud[1]}"/></linearGradient>
<radialGradient id="sunG"><stop offset="0" stop-color="${s.sun ?? "#ffffff"}"/><stop offset=".3" stop-color="${s.glow ?? "#ffffff"}" stop-opacity=".85"/><stop offset="1" stop-color="${s.glow ?? "#ffffff"}" stop-opacity="0"/></radialGradient>`;
}

export const skyRect = (kind) => `<rect width="1200" height="800" fill="url(#${kind === "night" ? "skyNight" : "skyMain"})"/>`;

/** nuvem pintada à mão; tipos: cumulus, flat, puffs, wisp */
export function cloud(x, y, s = 1, type = "cumulus", op = 0.95) {
  const g = (inner) => `<g transform="translate(${f(x)},${f(y)}) scale(${s})" opacity="${op}">${inner}</g>`;
  if (type === "flat")
    return g(`<path d="M-170,20 Q-160,-10 -110,-8 Q-80,-30 -30,-18 Q20,-34 70,-12 Q130,-22 160,10 Q190,24 160,34 L-150,34 Q-190,34 -170,20 Z" fill="url(#cloudG)"/><ellipse cx="-30" cy="-6" rx="60" ry="9" fill="#fff" opacity=".45"/>`);
  if (type === "puffs")
    return g(`<circle cx="-40" cy="0" r="34" fill="url(#cloudG)"/><circle cx="0" cy="-16" r="42" fill="url(#cloudG)"/><circle cx="46" cy="-2" r="32" fill="url(#cloudG)"/><rect x="-62" y="0" width="130" height="32" rx="16" fill="url(#cloudG)"/><circle cx="-4" cy="-26" r="24" fill="#fff" opacity=".4"/>`);
  if (type === "wisp")
    return g(`<path d="M-160,10 Q-100,-14 -30,4 Q40,22 100,-4 Q150,-18 190,6" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none" opacity=".55"/><path d="M-120,34 Q-50,18 20,34 Q80,46 130,30" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".4"/>`);
  return g(`<path d="M-180,40 C-200,10 -180,-30 -140,-40 C-150,-80 -100,-110 -50,-100 C-30,-150 40,-160 80,-130 C120,-160 180,-140 200,-90 C240,-80 260,-40 240,10 C270,40 250,90 200,95 L-150,95 C-190,90 -210,60 -180,40 Z" fill="url(#cloudG)"/><ellipse cx="60" cy="-110" rx="45" ry="32" fill="#fff" opacity=".5"/><ellipse cx="-20" cy="-80" rx="55" ry="38" fill="#fff" opacity=".4"/>`);
}

export function sunDisc(x, y, r, kind) {
  const s = SKIES[kind];
  return `<g><circle cx="${x}" cy="${y}" r="${r * 3.4}" fill="url(#sunG)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${s.sun}"/></g>`;
}
export function moonDisc(x, y, r, phase = 0) {
  const body = phase
    ? `<path d="M${x},${y - r} A${r},${r} 0 1 0 ${x},${y + r} A${f(r * 1.25)},${f(r * 1.25)} 0 0 1 ${x},${y - r} Z" fill="#fbf6df"/>`
    : `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbf6df"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.22}" fill="#e6dfc0"/><circle cx="${x + r * 0.35}" cy="${y + r * 0.25}" r="${r * 0.15}" fill="#e6dfc0"/>`;
  return `<g><circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="#cfe0ff" opacity=".14"/>${body}</g>`;
}
export function stars(r, n = 60, maxY = 420) {
  return Array.from({ length: n }, () => `<circle cx="${f(r() * 1200)}" cy="${f(r() * maxY)}" r="${f(0.8 + r() * 1.8)}" fill="#fff8e6" opacity="${f(0.45 + r() * 0.5)}"/>`).join("");
}
export function rain(r, n = 90) {
  return `<g stroke="#d5e3ee" stroke-width="2" opacity=".45" stroke-linecap="round">${Array.from({ length: n }, () => {
    const x = r() * 1240, y = r() * 780;
    return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 10)}" y2="${f(y + 34)}"/>`;
  }).join("")}</g>`;
}
export function rainbow(cx, cy, R) {
  const cols = ["#e8464a", "#f28c3a", "#f7d23e", "#5cb85c", "#3d9bd6", "#6a5bc0"];
  return cols.map((c, i) => `<path d="M${cx - R + i * 9},${cy} A${R - i * 9},${R - i * 9} 0 0 1 ${cx + R - i * 9},${cy}" fill="none" stroke="${c}" stroke-width="9" opacity=".5"/>`).join("");
}
export function godRays(x, y, color = "#fffbe6") {
  return [[-420, -200], [-120, 60], [240, 520]].map(([a, b]) => `<polygon points="${x},${y} ${x + a},800 ${x + b},800" fill="${color}" opacity=".09"/>`).join("");
}

/* -------------------------- fundos distantes -------------------------- */
const mix = (a, b, k) => {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const c = (s) => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k);
  return `#${[c(16), c(8), c(0)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
export { mix };

export function farLayer(kind, y, r, tint = "#7d9fb4") {
  const light = mix(tint, "#e8eef2", 0.35);
  if (kind === "mountains") {
    let d = `M-20,${y + 120} L-20,${y}`;
    for (let x = 0; x <= 1240; x += 130) d += ` L${x + 40},${y - 70 - r() * 110} L${x + 100},${y - r() * 20}`;
    d += ` L1240,${y + 120} Z`;
    return `<!-- distant mountains -->\n<path d="${d}" fill="${tint}" opacity=".8"/>\n<!-- distant mountains haze -->\n<path d="${d}" fill="${light}" opacity=".18" transform="translate(0,26)"/>`;
  }
  if (kind === "peaks") {
    const peaks = [[220, y - 190], [560, y - 260], [900, y - 200]];
    return `<!-- distant snow peaks -->` + peaks.map(([x, t]) => `<path d="M${x - 240},${y + 60} L${x},${t} L${x + 240},${y + 60} Z" fill="${tint}"/><path d="M${x - 62},${t + 80} L${x},${t} L${x + 62},${t + 80} L${x + 30},${t + 66} L${x},${t + 92} L${x - 30},${t + 64} Z" fill="#f4f8fb"/>`).join("");
  }
  if (kind === "hills") {
    let d = `M-20,${y + 140} L-20,${y}`;
    for (let x = 0; x <= 1240; x += 200) d += ` Q${x + 100},${y - 70 - r() * 50} ${x + 200},${y - 10 + r() * 20}`;
    d += ` L1240,${y + 140} Z`;
    return `<!-- distant hills -->\n<path d="${d}" fill="${tint}"/>`;
  }
  if (kind === "treeline") {
    let out = `<!-- distant hills treeline -->\n<rect x="-20" y="${y}" width="1240" height="140" fill="${mix(tint, "#2f5a3a", 0.5)}"/>`;
    for (let x = -10; x < 1230; x += 42 + r() * 18) out += `<circle cx="${f(x)}" cy="${f(y - 4 + r() * 12)}" r="${f(30 + r() * 26)}" fill="${mix(tint, "#2f5a3a", 0.45 + r() * 0.2)}"/>`;
    return out;
  }
  if (kind === "pines") {
    let out = `<!-- distant hills pines -->\n<rect x="-20" y="${y + 20}" width="1240" height="120" fill="${mix(tint, "#1f4a3a", 0.6)}"/>`;
    for (let x = -10; x < 1230; x += 46 + r() * 22) {
      const h = 70 + r() * 70;
      out += `<path d="M${f(x)},${y + 30} L${f(x - 24)},${y + 30} L${f(x)},${f(y + 30 - h)} L${f(x + 24)},${y + 30} Z" fill="${mix(tint, "#1f4a3a", 0.55 + r() * 0.25)}"/>`;
    }
    return out;
  }
  if (kind === "town") {
    let out = `<!-- distant skyline town -->`;
    for (let x = 0; x < 1220; x += 70 + r() * 40) {
      const w = 56 + r() * 34, h = 46 + r() * 70, c = mix(tint, ["#e9b8a2", "#a9c8d8", "#e8d49a", "#c9a6c6"][Math.floor(r() * 4)], 0.45);
      out += `<rect x="${f(x)}" y="${f(y - h)}" width="${f(w)}" height="${f(h + 60)}" fill="${c}"/><path d="M${f(x - 4)},${f(y - h)} L${f(x + w / 2)},${f(y - h - 26)} L${f(x + w + 4)},${f(y - h)} Z" fill="${mix(c, "#7a4a40", 0.4)}"/>`;
    }
    return out;
  }
  if (kind === "volcano") {
    return `<!-- distant mountain volcano -->\n<path d="M560,${y + 120} L760,${y - 190} L820,${y - 190} L1020,${y + 120} Z" fill="${mix(tint, "#4a3a3a", 0.5)}"/><path d="M760,${y - 190} L790,${y - 170} L820,${y - 190} Z" fill="#e5603a"/><path d="M-20,${y + 120} L-20,${y} Q200,${y - 120} 420,${y - 20} Q500,${y + 20} 560,${y + 120} Z" fill="${tint}"/>`;
  }
  if (kind === "islands") {
    return `<!-- distant island silhouettes -->\n<path d="M80,${y + 20} Q160,${y - 70} 280,${y + 20} Z" fill="${tint}"/><path d="M700,${y + 20} Q800,${y - 100} 960,${y + 20} Z" fill="${mix(tint, "#4a7a5a", 0.4)}"/><path d="M980,${y + 20} Q1040,${y - 40} 1120,${y + 20} Z" fill="${tint}"/>`;
  }
  return "";
}

/* ------------------------------ chãos ------------------------------ */
const GROUNDS = {
  meadow: ["#7fb85a", "#4f8a3a", "#34602a"],
  grass: ["#8cc063", "#5a9440", "#3a6a2c"],
  dirt: ["#c79a62", "#a77a48", "#7d5a34"],
  cobble: ["#b7ab9a", "#8f8474", "#6b6254"],
  sand: ["#f2dc9a", "#e0c277", "#c6a458"],
  forest: ["#5e8d45", "#3f6a35", "#27492a"],
  rock: ["#9a9488", "#756f64", "#524d44"],
  moss: ["#6fa05a", "#4a7a45", "#2e5a38"],
  dune: ["#f0cf8a", "#dcae62", "#b88a45"],
  dusk: ["#6a8a5a", "#486a45", "#2e4a3a"],
  night: ["#2d4a45", "#1f3633", "#142624"],
  nightsand: ["#5a5a72", "#43435a", "#2f2f44"],
};
export function groundDefs(kind) {
  const c = GROUNDS[kind];
  return `<linearGradient id="gndG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>`;
}
export function ground(kind, y, r, wave = 26) {
  const c = GROUNDS[kind];
  let top = `M-20,${y + 6}`;
  for (let x = 0; x <= 1240; x += 120) top += ` Q${x + 60},${f(y - wave + r() * wave * 1.2)} ${x + 120},${f(y + r() * 10)}`;
  top += ` L1240,820 L-20,820 Z`;
  let det = "";
  if (kind === "cobble") {
    for (let i = 0; i < 46; i++) det += `<ellipse cx="${f(r() * 1200)}" cy="${f(y + 20 + r() * (800 - y - 24))}" rx="${f(14 + r() * 14)}" ry="${f(5 + r() * 4)}" fill="${dk(c[1], 0.12)}" opacity=".5"/>`;
  } else if (kind === "sand" || kind === "dune") {
    for (let i = 0; i < 34; i++) det += `<path d="M${f(r() * 1200)},${f(y + 24 + r() * (780 - y))} q18,-5 36,0" stroke="${dk(c[1], 0.2)}" stroke-width="2.4" fill="none" opacity=".45"/>`;
  } else {
    for (let i = 0; i < 56; i++) {
      const x = r() * 1200, yy = y + 16 + r() * (790 - y);
      det += `<path d="M${f(x)},${f(yy)} q-3,-14 -8,-18 M${f(x)},${f(yy)} q3,-16 9,-20" stroke="${lt(c[0], 0.22)}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>`;
    }
  }
  return `<!-- ground ${kind} -->\n<g><path d="${top}" fill="url(#gndG)"/>${det}</g>`;
}

export function water(kind, y0, y1, r) {
  const deep = kind === "sea" ? ["#4cb4cc", "#2b86a8", "#165b7d"] : kind === "night" ? ["#27407a", "#1b2e5c", "#101c3d"] : ["#6fc0c9", "#3f98a8", "#25707f"];
  let waves = "";
  for (let i = 0; i < 16; i++) {
    const x = r() * 1180, y = y0 + 14 + r() * (y1 - y0 - 24), w = 30 + r() * 50;
    waves += `<path d="M${f(x)},${f(y)} q${f(w / 4)},-7 ${f(w / 2)},0 t${f(w / 2)},0" stroke="#e8fbff" stroke-width="2.5" fill="none" opacity=".5"/>`;
  }
  return `<!-- water ${kind === "lake" ? "lake pond" : "ocean"} -->\n<g><defs><linearGradient id="watG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${deep[0]}"/><stop offset=".55" stop-color="${deep[1]}"/><stop offset="1" stop-color="${deep[2]}"/></linearGradient></defs><rect x="-20" y="${y0}" width="1240" height="${y1 - y0 + 6}" fill="url(#watG)"/>${waves}</g>`;
}

/** defs comuns a todas as cenas (madeira, sombra suave, textura de papel) */
export const commonDefs = `<linearGradient id="woodTone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a77649"/><stop offset=".5" stop-color="#7d5231"/><stop offset="1" stop-color="#5a381e"/></linearGradient>
<linearGradient id="stoneTone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c5beb3"/><stop offset="1" stop-color="#7c7468"/></linearGradient>
<filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#1b1a14" flood-opacity=".25"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="11"/><feColorMatrix type="matrix" values="0 0 0 0 .34  0 0 0 0 .34  0 0 0 0 .32  0 0 0 .22 -.07"/></filter>`;
