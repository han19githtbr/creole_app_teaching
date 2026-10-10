// Fundos extras para as novas imagens do jogo "C'est quoi ?" (mesmo tamanho 490x350 da lib.mjs).
const grad = (id, a, b) =>
  `<linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

/** Noite estrelada + chão escuro. */
export function bgNight(id, a = "#0b1a3a", b = "#2b4a8a", ground = "#27403a") {
  const stars = [[40, 40], [110, 90], [190, 30], [300, 60], [370, 28], [440, 100], [70, 150], [420, 170], [330, 130], [150, 140]]
    .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.4}" fill="#fff" opacity="${0.55 + (i % 4) * 0.1}"/>`).join("");
  return `<defs>${grad(id, a, b)}</defs><rect width="490" height="350" fill="url(#g${id})"/>${stars}
<path d="M0 262 Q120 225 250 258 T490 250 V350 H0Z" fill="${ground}"/><rect x="0" y="278" width="490" height="72" fill="${ground}"/>
<ellipse cx="245" cy="312" rx="150" ry="12" fill="#000" opacity=".25"/>`;
}
/** Mar + areia (viagem, ilha, barco). */
export function bgSea(id, sky = ["#8fd0f2", "#e8f7ff"], sea = "#3d9bd6", sand = "#f1d9a0") {
  return `<defs>${grad(id, sky[0], sky[1])}</defs><rect width="490" height="350" fill="url(#g${id})"/>
<circle cx="415" cy="62" r="30" fill="#fff4b0" opacity=".9"/><ellipse cx="95" cy="68" rx="55" ry="16" fill="#fff" opacity=".85"/><ellipse cx="135" cy="56" rx="38" ry="13" fill="#fff" opacity=".85"/>
<rect x="0" y="200" width="490" height="90" fill="${sea}"/><path d="M0 214q30-10 60 0t60 0 60 0 60 0 60 0 60 0 60 0 70 0" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
<path d="M0 290 Q120 262 250 284 T490 276 V350 H0Z" fill="${sand}"/><ellipse cx="245" cy="318" rx="150" ry="12" fill="#000" opacity=".08"/>`;
}
/** Deserto. */
export function bgDesert(id) {
  return `<defs>${grad(id, "#bfe6f8", "#fff1cf")}</defs><rect width="490" height="350" fill="url(#g${id})"/>
<circle cx="410" cy="64" r="32" fill="#ffe9a0"/><path d="M0 250 Q110 205 230 245 T490 232 V350 H0Z" fill="#efd39a"/><rect x="0" y="272" width="490" height="78" fill="#e6c382"/>
<ellipse cx="245" cy="312" rx="150" ry="12" fill="#000" opacity=".1"/>`;
}
/** Fazenda: céu, colina e cerca ao fundo. */
export function bgFarm(id) {
  const posts = [20, 80, 140, 200, 260, 320, 380, 440].map((x) => `<rect x="${x}" y="228" width="8" height="38" fill="#b88a55"/>`).join("");
  return `<defs>${grad(id, "#a6dcf5", "#eef9ff")}</defs><rect width="490" height="350" fill="url(#g${id})"/>
<circle cx="415" cy="60" r="30" fill="#fff4b0" opacity=".9"/><ellipse cx="95" cy="66" rx="55" ry="16" fill="#fff" opacity=".85"/>
<path d="M0 235 Q120 190 250 232 T490 222 V350 H0Z" fill="#a4d78b"/>${posts}<rect x="0" y="238" width="490" height="7" fill="#c9a06a"/><rect x="0" y="252" width="490" height="7" fill="#c9a06a"/>
<rect x="0" y="272" width="490" height="78" fill="#86c46d"/><ellipse cx="245" cy="312" rx="150" ry="12" fill="#000" opacity=".1"/>`;
}
/** Neve/gelo (iceberg, polo). */
export function bgIce(id) {
  return `<defs>${grad(id, "#cfe8f7", "#f4fbff")}</defs><rect width="490" height="350" fill="url(#g${id})"/>
<rect x="0" y="230" width="490" height="120" fill="#4aa3d8"/><path d="M0 244q30-9 60 0t60 0 60 0 60 0 60 0 60 0 60 0 70 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>
<ellipse cx="245" cy="312" rx="150" ry="10" fill="#000" opacity=".1"/>`;
}
