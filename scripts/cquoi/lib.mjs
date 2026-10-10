// Peças compartilhadas para gerar a coleção "C'est quoi ?" no MESMO formato das
// imagens da pasta c-quoi: cena em cima (com seta vermelha apontando para o
// objeto) e painel bege embaixo com o boneco de boina (+ relógio na pergunta,
// + "✔ Un objet." na resposta).
export const W = 490;
export const SCENE_H = 350;
export const PANEL_H = 480;

// ---------- fundos temáticos (cena 490x350) ----------
const defs = (id, a, b) =>
  `<linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

/** Interior: parede + bancada. */
export function bgRoom(id, wall = ["#f3e3d0", "#e7cfb4"], floor = "#b98b5e", top = "#d9b48a") {
  return `<defs>${defs(id, wall[0], wall[1])}</defs>
<rect width="490" height="350" fill="url(#g${id})"/>
<rect x="30" y="30" width="120" height="110" rx="6" fill="#fff8ec" opacity=".75"/><path d="M90 30v110M30 85h120" stroke="#e2cfae" stroke-width="4"/>
<rect x="0" y="262" width="490" height="88" fill="${floor}"/><rect x="0" y="254" width="490" height="16" fill="${top}"/>
<ellipse cx="245" cy="300" rx="190" ry="14" fill="#000" opacity=".08"/>`;
}
/** Exterior: céu + chão. */
export function bgOutdoor(id, sky = ["#9ed8f5", "#e6f6ff"], ground = "#7bc46a", far = "#9bd58b") {
  return `<defs>${defs(id, sky[0], sky[1])}</defs>
<rect width="490" height="350" fill="url(#g${id})"/>
<circle cx="415" cy="60" r="30" fill="#fff4b0" opacity=".9"/>
<ellipse cx="90" cy="70" rx="55" ry="16" fill="#fff" opacity=".85"/><ellipse cx="130" cy="58" rx="40" ry="14" fill="#fff" opacity=".85"/>
<path d="M0 250 Q120 200 250 245 T490 235 V350 H0Z" fill="${far}"/>
<rect x="0" y="270" width="490" height="80" fill="${ground}"/>
<ellipse cx="245" cy="312" rx="150" ry="12" fill="#000" opacity=".1"/>`;
}
/** Palco/tecido (música, dança, cinema). */
export function bgStage(id, a = "#3b2a5e", b = "#6f4aa8") {
  return `<defs>${defs(id, a, b)}</defs>
<rect width="490" height="350" fill="url(#g${id})"/>
<path d="M0 0h90q-20 140 0 350H0z" fill="#7c1d2b"/><path d="M490 0h-90q20 140 0 350h90z" fill="#7c1d2b"/>
<path d="M130 0L60 350M360 0l70 350" stroke="#fff" stroke-opacity=".08" stroke-width="40"/>
<rect x="0" y="278" width="490" height="72" fill="#8a5a33"/><path d="M0 278h490" stroke="#c28a55" stroke-width="6"/>
<ellipse cx="245" cy="300" rx="150" ry="10" fill="#000" opacity=".22"/>`;
}
/** Parede antiga / pedra (história, estoicismo, religião). */
export function bgStone(id, a = "#d8cdb8", b = "#bfb08f") {
  const rows = Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => `<rect x="${c * 76 - (r % 2) * 38}" y="${r * 48}" width="72" height="44" rx="3" fill="#000" opacity="${0.03 + ((r * 7 + c) % 3) * 0.02}"/>`).join("")).join("");
  return `<defs>${defs(id, a, b)}</defs><rect width="490" height="350" fill="url(#g${id})"/>${rows}
<rect x="0" y="278" width="490" height="72" fill="#9a8a6a"/><path d="M0 278h490" stroke="#7a6a4c" stroke-width="5"/>
<ellipse cx="245" cy="300" rx="150" ry="10" fill="#000" opacity=".18"/>`;
}
/** Escritório/tecnologia (mesa + parede azulada). */
export function bgDesk(id) {
  return bgRoom(id, ["#dfe9f5", "#c4d4ea"], "#7d8fa8", "#e8eef7");
}

// ---------- seta vermelha (contorno branco), ponta em (0,0), aponta p/ baixo-direita ----------
export const ARROW_PATH = "M-104 -12 L-44 -12 L-50 -29 L0 0 L-50 29 L-44 12 L-104 12 Z";
export const arrowSvg = (x, y) =>
  `<g transform="translate(${x} ${y}) rotate(25)"><path d="${ARROW_PATH}" fill="#e60012" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="${ARROW_PATH}" fill="#e60012" stroke="#e60012" stroke-width="1" stroke-linejoin="round"/></g>`;

// ---------- relógio azul (canto superior esquerdo do painel) ----------
export function clockSvg(cx = 70, cy = 72, r = 64, angle = 78) {
  const ticks = [0, 90, 180, 270].map((a) => `<line x1="${cx}" y1="${cy - r + 11}" x2="${cx}" y2="${cy - r + 21}" stroke="#2c58c9" stroke-width="4" stroke-linecap="round" transform="rotate(${a} ${cx} ${cy})"/>`).join("");
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#2c58c9" stroke-width="10"/>${ticks}
<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r + 24}" stroke="#222" stroke-width="5" stroke-linecap="round" transform="rotate(${angle} ${cx} ${cy})"/>
<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r + 36}" stroke="#222" stroke-width="4" stroke-linecap="round" transform="rotate(${(angle * 12) % 360} ${cx} ${cy})"/>
<circle cx="${cx}" cy="${cy}" r="5" fill="#222"/>`;
}

// ---------- boneco de boina (pensando / feliz) ----------
export function stickmanSvg(mood = "think", ox = 245, oy = 0) {
  const happy = mood === "happy";
  const face = happy
    ? `<circle cx="${ox - 16}" cy="205" r="4.5" fill="#111"/><circle cx="${ox + 16}" cy="205" r="4.5" fill="#111"/><path d="M${ox - 16} 224 Q${ox} 242 ${ox + 16} 224" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>`
    : `<circle cx="${ox - 16}" cy="206" r="4.5" fill="#111"/><circle cx="${ox + 16}" cy="206" r="4.5" fill="#111"/><path d="M${ox - 24} 196 L${ox - 8} 199 M${ox + 24} 196 L${ox + 8} 199" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M${ox - 12} 230 Q${ox} 223 ${ox + 12} 230" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>`;
  const arms = happy
    ? `<path d="M${ox} 292 Q${ox - 40} 310 ${ox - 78} 332" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/><path d="M${ox} 292 Q${ox + 40} 308 ${ox + 70} 322" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>`
    : `<path d="M${ox} 292 Q${ox - 52} 270 ${ox - 52} 214" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/><path d="M${ox} 292 Q${ox + 40} 300 ${ox + 66} 318" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>`;
  const extra = happy ? "" : `<text x="${ox + 70}" y="168" font-family="Arial" font-weight="700" font-size="46" fill="#222">?</text>`;
  return `<g>
<line x1="${ox}" y1="262" x2="${ox}" y2="392" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
<path d="M${ox} 392 L${ox - 22} 458 M${ox} 392 L${ox + 22} 458" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
<ellipse cx="${ox - 30}" cy="466" rx="26" ry="9" fill="#111"/><ellipse cx="${ox + 30}" cy="466" rx="26" ry="9" fill="#111"/>
${arms}
<circle cx="${ox}" cy="210" r="52" fill="#fff" stroke="#111" stroke-width="4"/>
${face}
<path d="M${ox - 40} 256 L${ox} 272 L${ox + 40} 256 L${ox + 30} 280 L${ox} 288 L${ox - 30} 280Z" fill="#d62828"/>
<path d="M${ox - 56} 186 Q${ox - 50} 142 ${ox - 4} 138 Q${ox + 52} 136 ${ox + 56} 180 Q${ox + 20} 168 ${ox - 56} 186Z" fill="#1e3a9a"/>
<circle cx="${ox - 26}" cy="146" r="8" fill="#d62828"/><circle cx="${ox - 32}" cy="150" r="5" fill="#fff"/><circle cx="${ox - 22}" cy="142" r="4" fill="#1e3a9a"/>
${extra}</g>`;
}

const FRAME = (inner, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}">${inner}</svg>`;

/** Painel inferior (pergunta ou resposta). */
function panel(kind, label) {
  const bg = `<rect width="${W}" height="${PANEL_H}" fill="#f1ece1"/><rect width="${W}" height="${PANEL_H}" fill="#fff" opacity=".18"/>`;
  if (kind === "question") return `${bg}${clockSvg()}${stickmanSvg("think")}`;
  return `${bg}<g transform="translate(245 40)"><rect x="-140" y="-18" width="280" height="38" rx="6" fill="none"/><rect x="-128" y="-9" width="20" height="20" fill="#22b24c" stroke="#128a38" stroke-width="2" rx="2"/><path d="M-124 1l6 6 10-12" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><text x="-100" y="8" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#111">${label}.</text></g>${stickmanSvg("happy")}`;
}

/** Imagem completa (cena + seta + painel) no mesmo formato da pasta c-quoi. */
export function composite(sceneInner, arrow, kind, label) {
  const scene = `<g>${sceneInner}${arrowSvg(arrow.x, arrow.y)}</g>`;
  return FRAME(`${scene}<g transform="translate(0 ${SCENE_H})">${panel(kind, label)}</g>`, SCENE_H + PANEL_H);
}
/** Só a cena (sem seta — o jogo desenha e anima a seta por cima). */
export const sceneOnly = (sceneInner) => FRAME(sceneInner, SCENE_H);

// Atalhos de desenho
export const r = (x, y, w, h, fill, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
export const c = (x, y, rad, fill, extra = "") => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" ${extra}/>`;
export const e = (x, y, rx, ry, fill, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
export const p = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const ln = (d, stroke, w = 4, extra = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
