// Toolkit de ilustração vetorial 2D cinematográfica original, gerada por código:
// nenhuma imagem ou personagem de terceiros é reproduzido.

export const W = 1200;
export const H = 800;

export const PAL = {
  dia: {
    label: "Dia claro",
    skyTop: "#5798b8", skyMid: "#c0d1cb", skyBot: "#f1e1c1",
    sun: "#f7e0aa", sunGlow: "#f2c779",
    cloudLight: "#f0f1eb", cloudShade: "#b8c2c1",
    hillFar: "#9cac91", hillMid: "#7f9b70", hillNear: "#64834e", hillFront: "#4e6c43",
    grass: "#899677", light: "#f3e5c3", ink: "#343c37",
    warm: "#e6c17f", water: "#72aeb6", waterDeep: "#477d8b",
    wall: "#e4ded0", wallShade: "#c7c0b1", roof: "#946c5c", roofDark: "#6d5147",
    wood: "#705b49", woodLight: "#9a8063", stone: "#b2aa98", stoneShade: "#898273",
    leaf: "#688c4e", leafDark: "#405d3b", leafLight: "#a0b96f",
    accent1: "#d9a843", accent2: "#c45b48", accent3: "#3e7596",
    night: false, glow: 0.0,
  },
  entardecer: {
    label: "Entardecer dourado",
    skyTop: "#4e6070", skyMid: "#c18362", skyBot: "#edc487",
    sun: "#ffe1a0", sunGlow: "#ed9f64",
    cloudLight: "#e8d8c6", cloudShade: "#9c8f88",
    hillFar: "#9d9273", hillMid: "#7d805d", hillNear: "#656d4e", hillFront: "#4c5c47",
    grass: "#7e8c70", light: "#e6c995", ink: "#343b39",
    warm: "#dfa765", water: "#6e9397", waterDeep: "#465f68",
    wall: "#e1d4c1", wallShade: "#b8a997", roof: "#875f53", roofDark: "#614844",
    wood: "#655044", woodLight: "#8b715a", stone: "#a99e8d", stoneShade: "#7f786f",
    leaf: "#69764d", leafDark: "#46533b", leafLight: "#9a9c62",
    accent1: "#e0a640", accent2: "#c3634c", accent3: "#526f83",
    night: true, glow: 1.0,
  },
};

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export const f = (n) => Number(n.toFixed(1));

/* ---------- animação ---------- */
export const sway = (deg, dur, cx, cy, delay = 0) =>
  `<animateTransform attributeName="transform" type="rotate" values="${-deg} ${cx} ${cy};${deg} ${cx} ${cy};${-deg} ${cx} ${cy}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="${dur}s" begin="${-delay}s" repeatCount="indefinite"/>`;
export const bob = (dy, dur, delay = 0, dx = 0) =>
  `<animateTransform attributeName="transform" type="translate" values="0 0;${dx} ${-dy};0 0" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="${dur}s" begin="${-delay}s" repeatCount="indefinite"/>`;
export const spin = (dur, cx, cy) =>
  `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${dur}s" repeatCount="indefinite"/>`;
export const pulse = (a, b, dur, delay = 0, attr = "opacity") =>
  `<animate attributeName="${attr}" values="${a};${b};${a}" dur="${dur}s" begin="${-delay}s" repeatCount="indefinite"/>`;
export const drift = (from, to, dur, delay = 0) =>
  `<animateTransform attributeName="transform" type="translate" from="${from} 0" to="${to} 0" dur="${dur}s" begin="${-delay}s" repeatCount="indefinite"/>`;

/* ---------- formas base ---------- */
export function ridge(r, base, amp, step = 130, close = H) {
  const pts = [];
  for (let x = -step; x <= W + step * 1.5; x += step) pts.push([x, base + (r() - 0.5) * 2 * amp]);
  let d = `M${pts[0][0]},${close} L${pts[0][0]},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    d += ` Q${x0},${f(y0)} ${f((x0 + x1) / 2)},${f((y0 + y1) / 2)}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0]},${f(l[1])} L${l[0]},${close} Z`;
}

export function cloud(x, y, s, dur, delay, p, opacity = 1) {
  return `<g transform="translate(${x},${y})" opacity="${opacity}"><g>${drift(-360 * s, W + 360 * s, dur, delay)}<g transform="scale(${s})">
<path d="M-158,25 C-150,4 -126,-4 -101,2 C-91,-30 -54,-45 -23,-28 C-5,-60 43,-61 66,-35 C101,-48 133,-27 135,2 C157,6 171,17 174,31 C125,43 -103,43 -158,25Z" fill="${p.cloudShade}" opacity=".5"/>
<path d="M-166,14 C-157,-7 -131,-13 -107,-6 C-99,-38 -64,-50 -33,-35 C-15,-65 29,-69 57,-45 C89,-57 121,-37 126,-9 C151,-6 168,7 171,22 C131,35 -122,36 -166,14Z" fill="url(#gCloud)"/>
<path d="M-99,-8 C-96,-34 -69,-47 -43,-35 C-30,-57 4,-62 25,-43 C45,-45 62,-32 66,-12 C19,-2 -50,-1 -99,-8Z" fill="${p.cloudLight}" opacity=".54"/>
</g></g></g>`;
}

export function tree(x, y, s, p, sw = 1.6, delay = 0) {
  return `<g transform="translate(${x},${y}) scale(${s})">
<path d="M-15,0 C-8,-31 -22,-59 -10,-91 C-3,-112 -17,-127 -28,-143 L-22,-151 C-3,-140 10,-121 5,-99 C1,-74 24,-41 17,0Z" fill="url(#gWood)"/>
<path d="M-5,-76 C-33,-99 -45,-121 -53,-143 M2,-89 C25,-105 39,-122 48,-145 M-11,-111 C-6,-132 -2,-148 1,-166" fill="none" stroke="${p.wood}" stroke-width="9" stroke-linecap="round"/>
<path d="M-91,-137 C-104,-163 -83,-195 -54,-196 C-47,-225 -9,-240 17,-222 C41,-249 83,-228 82,-198 C114,-189 125,-155 104,-135 C110,-105 79,-85 52,-99 C25,-77 -8,-91 -17,-108 C-47,-86 -83,-104 -91,-137Z" fill="${p.leafDark}"/>
<g>${sway(sw, 5 + delay, 0, -145, delay)}
<path d="M-82,-142 C-93,-165 -70,-189 -45,-186 C-37,-216 -2,-225 19,-205 C41,-230 73,-210 69,-183 C100,-176 108,-146 88,-128 C93,-102 62,-88 42,-105 C22,-83 -8,-98 -13,-116 C-40,-95 -74,-109 -82,-142Z" fill="url(#gLeaf)"/>
<path d="M-55,-169 C-39,-190 -17,-194 3,-183 M9,-199 C32,-213 55,-201 59,-181 M-27,-125 C-3,-145 23,-147 47,-132 M-69,-143 C-45,-158 -20,-157 1,-143" fill="none" stroke="${p.leafLight}" stroke-width="5" stroke-linecap="round" opacity=".62"/>
<ellipse cx="-48" cy="-177" rx="11" ry="5" transform="rotate(-32 -48 -177)" fill="${p.leafLight}"/><ellipse cx="28" cy="-208" rx="12" ry="5" transform="rotate(24 28 -208)" fill="${p.leafLight}"/><ellipse cx="68" cy="-159" rx="12" ry="5" transform="rotate(-18 68 -159)" fill="${p.leafLight}"/><ellipse cx="-3" cy="-119" rx="11" ry="5" transform="rotate(18 -3 -119)" fill="${p.leafLight}"/><ellipse cx="44" cy="-126" rx="10" ry="5" transform="rotate(-28 44 -126)" fill="${p.leafLight}"/></g></g>`;
}

export function pine(x, y, s, p) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6,0 C-3,-31 -8,-72 0,-118" fill="none" stroke="url(#gWood)" stroke-width="12"/>
<path d="M0,-119 C-12,-105 -20,-91 -41,-81 C-27,-77 -12,-81 0,-91 C13,-78 31,-78 47,-82 C27,-94 14,-107 0,-119Z" fill="${p.leafDark}"/>
<path d="M0,-92 C-16,-76 -30,-58 -56,-46 C-37,-42 -17,-49 0,-64 C17,-48 40,-44 61,-49 C36,-62 17,-78 0,-92Z" fill="url(#gLeaf)"/>
<path d="M0,-64 C-20,-47 -39,-28 -72,-14 C-48,-10 -19,-19 0,-37 C21,-18 50,-11 75,-18 C45,-31 20,-48 0,-64Z" fill="${p.leafDark}"/>
<path d="M-38,-80 L-2,-91 M-48,-45 L-2,-61 M-59,-14 L-2,-34" stroke="${p.leafLight}" stroke-width="3" opacity=".55"/></g>`;
}

export function house(x, y, s, p, wallC, roofC, lit = true) {
  const wc = wallC || p.wall, rc = roofC || p.roof;
  return `<g transform="translate(${x},${y}) scale(${s})">
<rect x="-46" y="-52" width="92" height="52" fill="${wc}"/><rect x="18" y="-52" width="28" height="52" fill="${p.wallShade}" opacity=".55"/>
<path d="M-58,-52 L0,-96 L58,-52 Z" fill="${rc}"/><path d="M0,-96 L58,-52 L30,-52 Z" fill="${p.roofDark}" opacity=".45"/>
<rect x="-14" y="-32" width="24" height="32" rx="12" fill="${p.wood}"/>
<rect x="-38" y="-42" width="16" height="16" rx="2" fill="${lit && p.night ? p.warm : "#bfe4f2"}">${lit && p.night ? pulse(0.85, 1, 3 + s) : ""}</rect>
<rect x="24" y="-42" width="14" height="16" rx="2" fill="${lit && p.night ? p.warm : "#bfe4f2"}"/></g>`;
}

export function bird(x, y, s, dur, delay, p) {
  const position = x || 690;
  return `<g transform="translate(${position},${y}) scale(${s})"><path d="M-31,0 C-22,-9 -13,-10 -3,-2 C5,-10 17,-11 29,-4 C19,-5 12,-1 5,7 C-3,2 -12,2 -20,8Z" fill="${p.ink}"/><circle cx="22" cy="-7" r="4" fill="${p.ink}"/><path d="M24,-7 L32,-4 L24,-3Z" fill="${p.warm}"/></g>`;
}

export function sparkles(r, n, p, color, y0 = 200, y1 = 700) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = f(60 + r() * (W - 120)), y = f(y0 + r() * (y1 - y0)), d = f(4 + r() * 5), s = f(1.6 + r() * 2.6);
    out += `<circle cx="${x}" cy="${y}" r="${s}" fill="${color || p.light}" opacity=".0"><animate attributeName="opacity" values="0;.95;0" dur="${d}s" begin="${-r() * d}s" repeatCount="indefinite"/><animate attributeName="cy" values="${y};${f(y - 34)};${y}" dur="${d}s" begin="${-r() * 2}s" repeatCount="indefinite"/></circle>`;
  }
  return out;
}

export function flowers(r, n, p, y0, y1, colors) {
  let out = "";
  const cols = colors || [p.accent2, p.accent1, "#ffffff", p.accent3];
  for (let i = 0; i < n; i++) {
    const x = f(r() * W), y = f(y0 + r() * (y1 - y0)), s = 0.6 + ((y - y0) / (y1 - y0)) * 0.9, c = cols[i % cols.length];
    const petals = Array.from({ length: 5 }, (_, petal) =>
      `<path d="M0,-5 C-7,-13 -6,-23 0,-27 C7,-22 7,-12 0,-5Z" transform="rotate(${petal * 72})" fill="${petal % 2 ? p.leafLight : c}"/>`
    ).join("");
    out += `<g transform="translate(${x},${y}) scale(${f(s)})"><g>${sway(2.5, 4 + r() * 2, 0, 0, r() * 3)}
<path d="M0,0 C2,-10 -2,-17 1,-25 M0,-10 Q-13,-17 -17,-10 Q-8,-7 0,-6 M0,-16 Q12,-23 17,-16 Q9,-13 0,-12" stroke="${p.leafDark}" stroke-width="2.2" fill="${p.leaf}" stroke-linecap="round"/>
${petals}<circle cy="-5" r="4.2" fill="${p.accent1}"/><circle cx="-1" cy="-6" r="1.3" fill="#f5e8c8"/></g></g>`;
  }
  return out;
}

export function butterfly(x, y, s, dur, delay, color) {
  return `<g transform="translate(${x},${y}) scale(${s})"><g>${bob(26, dur, delay, 34)}
<g><animateTransform attributeName="transform" type="scale" values="1 1;.25 1;1 1" dur=".55s" repeatCount="indefinite"/>
<path d="M0,0 C-16,-16 -22,2 -3,4 Z M0,0 C16,-16 22,2 3,4 Z" fill="${color}"/>
<path d="M0,3 C-12,10 -12,20 -2,10 Z M0,3 C12,10 12,20 2,10 Z" fill="${color}" opacity=".75"/></g></g></g>`;
}

export function steamPath(x, y, delay, color = "#ffffff") {
  return `<path d="M${x},${y} q10,-16 0,-30 q-10,-14 0,-30" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" opacity="0">
<animate attributeName="opacity" values="0;.55;0" dur="3.4s" begin="${-delay}s" repeatCount="indefinite"/>
<animateTransform attributeName="transform" type="translate" values="0 8;0 -34" dur="3.4s" begin="${-delay}s" repeatCount="indefinite"/></path>`;
}

/* ---------- moldura comum (céu, luz natural, nuvens e textura fina) ---------- */
export function wrap(p, r, body, opts = {}) {
  const sunX = opts.sunX ?? 900, sunY = opts.sunY ?? (p.night ? 430 : 190), sunR = opts.sunR ?? 64;
  const stars = p.night && opts.stars !== false
    ? Array.from({ length: 46 }, () => {
        const x = f(r() * W), y = f(r() * 320), s = f(0.8 + r() * 1.6), d = f(2 + r() * 4);
        return `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff8e6" opacity=".2"><animate attributeName="opacity" values=".15;.95;.15" dur="${d}s" begin="${-r() * d}s" repeatCount="indefinite"/></circle>`;
      }).join("")
    : "";
  const clouds = opts.clouds === false ? "" :
    cloud(245, 145 + r() * 18, 0.72, 140, 30, p, p.night ? 0.7 : 0.95) +
    cloud(710, 250 + r() * 18, 0.52, 190, 110, p, p.night ? 0.6 : 0.85) +
    cloud(1010, 88 + r() * 18, 0.62, 230, 170, p, p.night ? 0.5 : 0.7);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">
<title>${opts.title || ""}</title><desc>${opts.desc || ""}</desc>
<defs>
<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.skyTop}"/><stop offset=".55" stop-color="${p.skyMid}"/><stop offset="1" stop-color="${p.skyBot}"/></linearGradient>
<radialGradient id="gSun"><stop offset="0" stop-color="${p.sun}"/><stop offset=".35" stop-color="${p.sunGlow}" stop-opacity=".85"/><stop offset="1" stop-color="${p.sunGlow}" stop-opacity="0"/></radialGradient>
<linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.cloudLight}"/><stop offset="1" stop-color="${p.cloudShade}"/></linearGradient>
<linearGradient id="gLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.leafLight}"/><stop offset=".55" stop-color="${p.leaf}"/><stop offset="1" stop-color="${p.leafDark}"/></linearGradient>
<linearGradient id="gWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.wood}"/><stop offset=".42" stop-color="${p.woodLight}"/><stop offset=".68" stop-color="${p.wood}"/><stop offset="1" stop-color="${p.woodLight}"/></linearGradient>
<linearGradient id="gWall" x1="0" y1="0" x2="1" y2="0.8"><stop offset="0" stop-color="${p.wall}"/><stop offset=".62" stop-color="${p.wall}"/><stop offset="1" stop-color="${p.wallShade}"/></linearGradient>
<linearGradient id="gRoof" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.roof}"/><stop offset=".58" stop-color="${p.roof}"/><stop offset="1" stop-color="${p.roofDark}"/></linearGradient>
<linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b6d1d2"/><stop offset=".42" stop-color="#6f929d"/><stop offset="1" stop-color="#394f5b"/></linearGradient>
<linearGradient id="gSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c98a62"/><stop offset=".48" stop-color="#986044"/><stop offset="1" stop-color="#674334"/></linearGradient>
<linearGradient id="gFruit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0ad6c"/><stop offset=".36" stop-color="${p.accent2}"/><stop offset="1" stop-color="#85443b"/></linearGradient>
<linearGradient id="gPepper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efaa70"/><stop offset=".42" stop-color="${p.accent2}"/><stop offset="1" stop-color="#784038"/></linearGradient>
<linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.water}"/><stop offset="1" stop-color="${p.waterDeep}"/></linearGradient>
<linearGradient id="gShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#211d16" stop-opacity=".18"/></linearGradient>
<linearGradient id="gRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.light}" stop-opacity=".75"/><stop offset="1" stop-color="${p.light}" stop-opacity="0"/></linearGradient>
<filter id="fGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" seed="17" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .34  0 0 0 0 .34  0 0 0 0 .32  0 0 0 .24 -.08"/></filter>
<filter id="fSoft"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="fSoft2"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="fObject" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="2" dy="7" stdDeviation="5" flood-color="#29251f" flood-opacity=".24"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#gSky)"/>
${stars}
<circle cx="${sunX}" cy="${sunY}" r="${sunR * 3.2}" fill="url(#gSun)">${pulse(0.85, 1, 6)}</circle>
${clouds}
${body}
<rect width="${W}" height="${H}" fill="url(#gShade)" opacity=".34"/>
<rect width="${W}" height="${H}" filter="url(#fGrain)" opacity=".16" style="mix-blend-mode:soft-light"/>
</svg>`;
}
