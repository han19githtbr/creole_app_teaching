// Toolkit de ilustração vetorial (estilo aquarela suave, inspirado na estética
// dos filmes de animação japoneses). Tudo aqui é arte ORIGINAL gerada por código:
// nenhuma imagem ou personagem de terceiros é reproduzido.

export const W = 1200;
export const H = 800;

export const PAL = {
  dia: {
    label: "Dia claro",
    skyTop: "#4fa9e8", skyMid: "#9fd8f5", skyBot: "#eefaf0",
    sun: "#fff6c2", sunGlow: "#fffbe0",
    cloudLight: "#ffffff", cloudShade: "#c7dff0",
    hillFar: "#9ccdb4", hillMid: "#6fbb86", hillNear: "#49a06b", hillFront: "#357f57",
    grass: "#86d27c", light: "#fff4c4", ink: "#25453f",
    warm: "#ffd58a", water: "#6cc3e0", waterDeep: "#3f97c4",
    wall: "#f8f0df", wallShade: "#e7dbc2", roof: "#d9644a", roofDark: "#b04a38",
    wood: "#8c5b3c", woodLight: "#b98358", stone: "#d9d0bd", stoneShade: "#b9ad96",
    leaf: "#4c9c5a", leafDark: "#2f7a45", leafLight: "#8fd07a",
    accent1: "#f4b942", accent2: "#e8687b", accent3: "#5b7fd6",
    night: false, glow: 0.0,
  },
  entardecer: {
    label: "Entardecer dourado",
    skyTop: "#4d4a94", skyMid: "#e58aa0", skyBot: "#ffd9a0",
    sun: "#fff0b8", sunGlow: "#ffc48a",
    cloudLight: "#ffd7c4", cloudShade: "#b8749a",
    hillFar: "#8b7cab", hillMid: "#6b7a9a", hillNear: "#4f6f7c", hillFront: "#3b5a5e",
    grass: "#8fb87a", light: "#ffd9a0", ink: "#2c2a4a",
    warm: "#ffc06a", water: "#7a9fd0", waterDeep: "#4b6aa8",
    wall: "#f6e2cc", wallShade: "#d8b9a2", roof: "#c45a55", roofDark: "#8e3f4a",
    wood: "#6e4a3a", woodLight: "#a06a4c", stone: "#cbb7ad", stoneShade: "#a08e90",
    leaf: "#4f8a6a", leafDark: "#2f5c54", leafLight: "#98c084",
    accent1: "#ffb347", accent2: "#f27b8f", accent3: "#7a86e0",
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
  return `<g transform="translate(0,${y})" opacity="${opacity}"><g>${drift(-360 * s, W + 360 * s, dur, delay)}<g transform="translate(0,0) scale(${s})">
<ellipse cx="0" cy="26" rx="160" ry="22" fill="${p.cloudShade}" opacity=".45"/>
<circle cx="-84" cy="4" r="42" fill="url(#gCloud)"/><circle cx="-30" cy="-22" r="58" fill="url(#gCloud)"/>
<circle cx="38" cy="-10" r="50" fill="url(#gCloud)"/><circle cx="92" cy="8" r="36" fill="url(#gCloud)"/>
<ellipse cx="0" cy="14" rx="146" ry="24" fill="url(#gCloud)"/></g></g></g>`;
}

export function tree(x, y, s, p, sw = 1.6, delay = 0) {
  return `<g transform="translate(${x},${y}) scale(${s})">
<path d="M-9,0 Q-6,-60 -3,-100 L6,-100 Q8,-60 12,0 Z" fill="${p.wood}"/>
<g>${sway(sw, 5 + delay, 0, -90, delay)}
<circle cx="-42" cy="-118" r="46" fill="${p.leafDark}"/><circle cx="40" cy="-122" r="48" fill="${p.leafDark}"/>
<circle cx="0" cy="-152" r="56" fill="${p.leaf}"/><circle cx="-38" cy="-134" r="38" fill="${p.leaf}"/>
<circle cx="36" cy="-138" r="40" fill="${p.leaf}"/><circle cx="-6" cy="-168" r="34" fill="${p.leafLight}" opacity=".85"/>
<circle cx="24" cy="-150" r="22" fill="${p.leafLight}" opacity=".7"/></g></g>`;
}

export function pine(x, y, s, p) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-4" y="-16" width="8" height="16" fill="${p.wood}"/>
<path d="M0,-118 L-34,-50 L34,-50 Z" fill="${p.leafDark}"/><path d="M0,-92 L-42,-22 L42,-22 Z" fill="${p.leaf}"/>
<path d="M0,-66 L-50,0 L50,0 Z" fill="${p.leafDark}"/></g>`;
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
  return `<g transform="translate(${x},${y}) scale(${s})"><g>${drift(-120, W + 120, dur, delay)}
<path d="M-12,0 Q-6,-9 0,0 Q6,-9 12,0" fill="none" stroke="${p.ink}" stroke-width="2.2" stroke-linecap="round">
<animate attributeName="d" values="M-12,0 Q-6,-9 0,0 Q6,-9 12,0;M-12,-3 Q-6,4 0,0 Q6,4 12,-3;M-12,0 Q-6,-9 0,0 Q6,-9 12,0" dur="0.9s" repeatCount="indefinite"/></path></g></g>`;
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
    out += `<g transform="translate(${x},${y}) scale(${f(s)})"><g>${sway(4, 3 + r() * 2, 0, 0, r() * 3)}
<path d="M0,0 Q2,-12 0,-24" stroke="${p.leafDark}" stroke-width="2.4" fill="none"/>
<circle cx="0" cy="-26" r="6" fill="${c}"/><circle cx="0" cy="-26" r="2.4" fill="${p.accent1}"/></g></g>`;
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

/* ---------- moldura comum (céu, sol, nuvens, grão de aquarela) ---------- */
export function wrap(p, r, body, opts = {}) {
  const sunX = opts.sunX ?? 900, sunY = opts.sunY ?? (p.night ? 430 : 190), sunR = opts.sunR ?? 64;
  const stars = p.night && opts.stars !== false
    ? Array.from({ length: 46 }, () => {
        const x = f(r() * W), y = f(r() * 320), s = f(0.8 + r() * 1.6), d = f(2 + r() * 4);
        return `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff8e6" opacity=".2"><animate attributeName="opacity" values=".15;.95;.15" dur="${d}s" begin="${-r() * d}s" repeatCount="indefinite"/></circle>`;
      }).join("")
    : "";
  const clouds = opts.clouds === false ? "" :
    cloud(0, 120 + r() * 40, 1.0, 140, 30, p, p.night ? 0.7 : 0.95) +
    cloud(0, 230 + r() * 50, 0.7, 190, 110, p, p.night ? 0.6 : 0.85) +
    cloud(0, 70 + r() * 30, 0.55, 230, 170, p, p.night ? 0.5 : 0.7);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">
<title>${opts.title || ""}</title><desc>${opts.desc || ""}</desc>
<defs>
<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.skyTop}"/><stop offset=".55" stop-color="${p.skyMid}"/><stop offset="1" stop-color="${p.skyBot}"/></linearGradient>
<radialGradient id="gSun"><stop offset="0" stop-color="${p.sun}"/><stop offset=".35" stop-color="${p.sunGlow}" stop-opacity=".85"/><stop offset="1" stop-color="${p.sunGlow}" stop-opacity="0"/></radialGradient>
<linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.cloudLight}"/><stop offset="1" stop-color="${p.cloudShade}"/></linearGradient>
<linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.water}"/><stop offset="1" stop-color="${p.waterDeep}"/></linearGradient>
<linearGradient id="gShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1b1030" stop-opacity=".28"/></linearGradient>
<linearGradient id="gRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.light}" stop-opacity=".75"/><stop offset="1" stop-color="${p.light}" stop-opacity="0"/></linearGradient>
<filter id="fGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .3  0 0 0 0 .25  0 0 0 0 .2  0 0 0 .55 -.18"/></filter>
<filter id="fSoft"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="fSoft2"><feGaussianBlur stdDeviation="14"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#gSky)"/>
${stars}
<circle cx="${sunX}" cy="${sunY}" r="${sunR * 3.2}" fill="url(#gSun)">${pulse(0.85, 1, 6)}</circle>
<circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${p.sun}" opacity=".95"/>
${clouds}
${body}
<rect width="${W}" height="${H}" fill="url(#gShade)" opacity=".55"/>
<rect width="${W}" height="${H}" filter="url(#fGrain)" opacity=".5" style="mix-blend-mode:multiply"/>
</svg>`;
}
