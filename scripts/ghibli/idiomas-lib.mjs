// Tema "Idiomas" (Lang): ilustrações no mesmo estilo dos outros 14 temas.
// Cada cena é composta por: cenário (sala de aula, biblioteca, café, praça, estúdio...), objetos reconhecíveis
// (livro, dicionário, globo, balões de conversa, letras, bandeiras, fones, caderno, lápis, quadro-negro,
// professor, aluno, microfone, computador, mapa) e a mesa de madeira em primeiro plano.
//
// Como cada objeto é posicionado por nós, a posição exata do rótulo (âncora) é calculada junto com o desenho:
// gen-idiomas.mjs grava essas âncoras em src/lib/storyElementAnchors.json e storyElementExtras.json.
import { getGhibliDefs, drawGhibliCloud } from "./master-base.mjs";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

// Gerador pseudo-aleatório determinístico (as mesmas imagens a cada execução).
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------------------------------------------ pessoas */

function person({ shirt = "#3b82a0", skin = "#e0ac82", hair = "#2b1d14", pants = "#3a3f52", glasses = false, pointer = false, book = false, longHair = false }) {
  const arms = pointer
    ? `<path d="M34,-150 Q62,-135 78,-182" stroke="${shirt}" stroke-width="17" fill="none" stroke-linecap="round"/>
       <circle cx="80" cy="-188" r="9" fill="${skin}"/>
       <line x1="82" y1="-192" x2="150" y2="-292" stroke="#8b5a2b" stroke-width="5" stroke-linecap="round"/>
       <path d="M-34,-150 Q-48,-118 -30,-96" stroke="${shirt}" stroke-width="17" fill="none" stroke-linecap="round"/>
       <circle cx="-29" cy="-92" r="9" fill="${skin}"/>`
    : book
      ? `<path d="M-34,-150 Q-50,-112 -14,-100" stroke="${shirt}" stroke-width="17" fill="none" stroke-linecap="round"/>
         <path d="M34,-150 Q50,-112 14,-100" stroke="${shirt}" stroke-width="17" fill="none" stroke-linecap="round"/>
         <rect x="-26" y="-122" width="52" height="34" rx="4" fill="#c2410c" stroke="#7c2d12" stroke-width="2"/>
         <rect x="-22" y="-118" width="44" height="26" rx="2" fill="#fef3c7"/>
         <line x1="0" y1="-118" x2="0" y2="-92" stroke="#c2a36b" stroke-width="2"/>`
      : `<path d="M-34,-150 Q-52,-116 -38,-90" stroke="${shirt}" stroke-width="17" fill="none" stroke-linecap="round"/>
         <path d="M34,-150 Q52,-116 38,-90" stroke="${shirt}" stroke-width="17" fill="none" stroke-linecap="round"/>
         <circle cx="-37" cy="-86" r="9" fill="${skin}"/><circle cx="37" cy="-86" r="9" fill="${skin}"/>`;
  const hairBack = longHair ? `<path d="M-30,-196 Q-34,-150 -22,-140 L22,-140 Q34,-150 30,-196 Z" fill="${hair}"/>` : "";
  return `
    <ellipse cx="0" cy="4" rx="46" ry="9" fill="#000" opacity="0.22"/>
    <rect x="-22" y="-92" width="18" height="90" rx="6" fill="${pants}"/>
    <rect x="4" y="-92" width="18" height="90" rx="6" fill="${pants}"/>
    <ellipse cx="-14" cy="0" rx="17" ry="7" fill="#2a1f1a"/><ellipse cx="14" cy="0" rx="17" ry="7" fill="#2a1f1a"/>
    ${hairBack}
    <path d="M-36,-96 L-32,-158 Q0,-172 32,-158 L36,-96 Z" fill="${shirt}" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
    ${arms}
    <rect x="-8" y="-176" width="16" height="22" rx="6" fill="${skin}"/>
    <circle cx="0" cy="-198" r="28" fill="${skin}"/>
    <path d="M-29,-200 Q-30,-232 0,-230 Q30,-232 29,-200 Q18,-218 0,-216 Q-18,-218 -29,-200 Z" fill="${hair}"/>
    <circle cx="-10" cy="-197" r="3" fill="#2b1d14"/><circle cx="10" cy="-197" r="3" fill="#2b1d14"/>
    <path d="M-9,-186 Q0,-179 9,-186" stroke="#8a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${glasses ? `<circle cx="-10" cy="-197" r="9" fill="none" stroke="#1f2937" stroke-width="2"/><circle cx="10" cy="-197" r="9" fill="none" stroke="#1f2937" stroke-width="2"/><line x1="-1" y1="-197" x2="1" y2="-197" stroke="#1f2937" stroke-width="2"/>` : ""}`;
}

/* ------------------------------------------------------------------------------------------------ bandeiras */

function flagCloth(kind) {
  // pano de 150x100, origem no canto superior esquerdo da bandeira
  const wave = "M0,0 Q37,-8 75,0 T150,0 L150,100 Q112,108 75,100 T0,100 Z";
  switch (kind) {
    case "france":
      return `<clipPath id="fc-fr"><path d="${wave}"/></clipPath>
        <g clip-path="url(#fc-fr)"><rect x="0" y="-10" width="50" height="125" fill="#1d4ed8"/><rect x="50" y="-10" width="50" height="125" fill="#fafafa"/><rect x="100" y="-10" width="52" height="125" fill="#dc2626"/></g>`;
    case "brazil":
      return `<clipPath id="fc-br"><path d="${wave}"/></clipPath>
        <g clip-path="url(#fc-br)"><rect x="0" y="-10" width="150" height="125" fill="#16a34a"/>
        <polygon points="75,8 140,50 75,92 10,50" fill="#facc15"/><circle cx="75" cy="50" r="22" fill="#1d4ed8"/>
        <path d="M54,46 Q75,40 96,54" stroke="#fafafa" stroke-width="4" fill="none"/></g>`;
    case "uk":
      return `<clipPath id="fc-uk"><path d="${wave}"/></clipPath>
        <g clip-path="url(#fc-uk)"><rect x="0" y="-10" width="150" height="125" fill="#1e3a8a"/>
        <path d="M0,0 L150,100 M150,0 L0,100" stroke="#fafafa" stroke-width="16"/>
        <path d="M0,0 L150,100 M150,0 L0,100" stroke="#dc2626" stroke-width="6"/>
        <rect x="62" y="-10" width="26" height="125" fill="#fafafa"/><rect x="0" y="38" width="150" height="26" fill="#fafafa"/>
        <rect x="68" y="-10" width="14" height="125" fill="#dc2626"/><rect x="0" y="44" width="150" height="14" fill="#dc2626"/></g>`;
    case "spain":
      return `<clipPath id="fc-es"><path d="${wave}"/></clipPath>
        <g clip-path="url(#fc-es)"><rect x="0" y="-10" width="150" height="125" fill="#dc2626"/><rect x="0" y="25" width="150" height="50" fill="#facc15"/></g>`;
    default: // haiti
      return `<clipPath id="fc-ht"><path d="${wave}"/></clipPath>
        <g clip-path="url(#fc-ht)"><rect x="0" y="-10" width="150" height="62" fill="#1d3fa8"/><rect x="0" y="50" width="150" height="62" fill="#d21034"/>
        <rect x="52" y="30" width="46" height="40" rx="3" fill="#fafafa"/><path d="M75,38 L88,62 L62,62 Z" fill="#15803d"/><circle cx="75" cy="36" r="5" fill="#16a34a"/></g>`;
  }
}

/* ------------------------------------------------------------------------------------------------ objetos
 * Cada objeto: { cat, w, draw(opts) -> markup em coordenadas locais, anchor: [ax, ay] (relativo à origem) }
 * Origem: centro da base para objetos de mesa/chão; centro do objeto para "wall" e "air".
 */
const OBJECTS = {
  book: {
    cat: "desk",
    anchor: [0, -34],
    draw: () => `
      <ellipse cx="0" cy="2" rx="92" ry="10" fill="#000" opacity="0.25"/>
      <path d="M-86,-8 L-4,-22 L-4,2 L-86,12 Z" fill="#7c2d12"/>
      <path d="M86,-8 L4,-22 L4,2 L86,12 Z" fill="#7c2d12"/>
      <path d="M-82,-14 Q-40,-34 -2,-24 L-2,-4 Q-42,-14 -82,2 Z" fill="#fef3c7" stroke="#c2a36b" stroke-width="2"/>
      <path d="M82,-14 Q40,-34 2,-24 L2,-4 Q42,-14 82,2 Z" fill="#fffbeb" stroke="#c2a36b" stroke-width="2"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${-72 + i * 1} ${-14 - i * 4 + 0} Q${-44} ${-28 - i * 4} ${-12} ${-22 - i * 3}" stroke="#a8a29e" stroke-width="1.6" fill="none" opacity="0.7" transform="translate(0,${i * 4 + 2})"/>`).join("")}
      ${[0, 1, 2, 3].map((i) => `<path d="M${72 - i * 1} ${-14 - i * 4} Q${44} ${-28 - i * 4} ${12} ${-22 - i * 3}" stroke="#a8a29e" stroke-width="1.6" fill="none" opacity="0.7" transform="translate(0,${i * 4 + 2})"/>`).join("")}
      <path d="M0,-24 L0,2" stroke="#92400e" stroke-width="3"/>
      <rect x="-30" y="-62" width="60" height="38" rx="2" fill="none"/>`,
  },
  dictionary: {
    cat: "desk",
    anchor: [0, -58],
    draw: () => `
      <ellipse cx="0" cy="2" rx="62" ry="9" fill="#000" opacity="0.25"/>
      <rect x="-54" y="-116" width="108" height="116" rx="5" fill="#7f1d1d" stroke="#450a0a" stroke-width="3"/>
      <rect x="-54" y="-116" width="14" height="116" rx="4" fill="#991b1b"/>
      <rect x="-54" y="-6" width="108" height="6" fill="#fef3c7"/>
      <rect x="-30" y="-98" width="68" height="46" rx="3" fill="none" stroke="#f5cf72" stroke-width="3"/>
      <text x="4" y="-62" text-anchor="middle" font-family="${SERIF}" font-weight="bold" font-size="30" fill="#f5cf72">A–Z</text>
      <text x="4" y="-30" text-anchor="middle" font-family="${SERIF}" font-weight="bold" font-size="13" fill="#f5cf72" letter-spacing="2">DICIONÁRIO</text>
      <line x1="-30" y1="-20" x2="38" y2="-20" stroke="#f5cf72" stroke-width="2"/>`,
  },
  globe: {
    cat: "desk",
    anchor: [0, -112],
    draw: () => `
      <ellipse cx="0" cy="2" rx="56" ry="9" fill="#000" opacity="0.25"/>
      <path d="M-34,0 Q0,-14 34,0 L26,-22 L-26,-22 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
      <rect x="-5" y="-62" width="10" height="42" fill="#92400e"/>
      <path d="M-66,-112 A66,66 0 0 0 0,-46" stroke="#b45309" stroke-width="6" fill="none" stroke-linecap="round" transform="translate(0,0)"/>
      <circle cx="0" cy="-112" r="60" fill="#2a7fb8" stroke="#1e3a5f" stroke-width="3"/>
      <clipPath id="gl-clip"><circle cx="0" cy="-112" r="59"/></clipPath>
      <g clip-path="url(#gl-clip)">
        <path d="M-40,-150 Q-22,-168 -4,-150 Q6,-132 -12,-124 Q-22,-110 -36,-122 Q-48,-136 -40,-150 Z" fill="#4ca35c" stroke="#2f7a3e" stroke-width="1.5"/>
        <path d="M14,-136 Q36,-146 52,-126 Q54,-100 36,-96 Q22,-104 28,-118 Q10,-122 14,-136 Z" fill="#c9a25a" stroke="#8c6b2f" stroke-width="1.5"/>
        <path d="M-14,-92 Q4,-98 12,-82 Q10,-62 -2,-58 Q-12,-70 -14,-92 Z" fill="#4ca35c" stroke="#2f7a3e" stroke-width="1.5"/>
        <ellipse cx="-22" cy="-138" rx="26" ry="34" fill="#ffffff" opacity="0.13"/>
        <path d="M-60,-112 Q0,-96 60,-112 M-60,-112 Q0,-128 60,-112" stroke="#ffffff" stroke-width="1.2" opacity="0.35" fill="none"/>
      </g>
      <path d="M60,-112 A60,60 0 0 1 0,-52" stroke="#b45309" stroke-width="6" fill="none" stroke-linecap="round" opacity="0"/>`,
  },
  speech: {
    cat: "air",
    anchor: [0, 0],
    draw: ({ words = ["Bonjour", "Olá"] } = {}) => `
      <g filter="url(#dropShadow)">
        <path d="M-96,-62 Q-96,-92 -64,-92 L36,-92 Q68,-92 68,-62 L68,-34 Q68,-4 36,-4 L-34,-4 L-62,22 L-58,-4 Q-96,-6 -96,-34 Z" fill="#ffffff" stroke="#1d4ed8" stroke-width="4"/>
        <text x="-14" y="-40" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="26" fill="#1d4ed8">${words[0]}</text>
        <path d="M96,-2 Q96,-30 66,-30 L-4,-30 Q0,-30 0,-30 Z" fill="none"/>
        <path d="M110,20 Q110,-10 80,-10 L34,-10 Q10,-10 10,14 L10,42 Q10,68 34,68 L84,68 L112,96 L108,68 Q122,66 122,42 Z" fill="#fef3c7" stroke="#d97706" stroke-width="4" transform="translate(6,-4)"/>
        <text x="68" y="46" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="26" fill="#b45309" transform="translate(6,-4)">${words[1]}</text>
      </g>`,
  },
  letters: {
    cat: "desk",
    anchor: [0, -64],
    draw: () => {
      const block = (x, y, ch, fill, stroke) => `
        <rect x="${x}" y="${y}" width="64" height="64" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
        <rect x="${x + 5}" y="${y + 5}" width="54" height="54" rx="4" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>
        <text x="${x + 32}" y="${y + 46}" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="40" fill="#ffffff">${ch}</text>`;
      return `
        <ellipse cx="0" cy="2" rx="80" ry="9" fill="#000" opacity="0.25"/>
        ${block(-70, -64, "A", "#dc2626", "#7f1d1d")}
        ${block(6, -64, "B", "#2563eb", "#1e3a8a")}
        <g transform="rotate(-6 0 -100)">${block(-32, -126, "C", "#16a34a", "#14532d")}</g>`;
    },
  },
  flag: {
    cat: "stand",
    anchor: [72, -258],
    draw: ({ country = "haiti" } = {}) => `
      <ellipse cx="0" cy="3" rx="40" ry="8" fill="#000" opacity="0.22"/>
      <rect x="-5" y="-312" width="10" height="312" rx="4" fill="#d6d3d1" stroke="#78716c" stroke-width="2"/>
      <circle cx="0" cy="-316" r="8" fill="#f5cf72" stroke="#92400e" stroke-width="2"/>
      <g transform="translate(5,-308)">${flagCloth(country)}</g>
      <rect x="-26" y="-8" width="52" height="10" rx="4" fill="#57534e"/>`,
  },
  headphones: {
    cat: "desk",
    anchor: [0, -52],
    draw: () => `
      <ellipse cx="0" cy="2" rx="62" ry="8" fill="#000" opacity="0.25"/>
      <path d="M-44,-34 Q-44,-100 0,-100 Q44,-100 44,-34" stroke="#1f2937" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M-44,-34 Q-44,-96 0,-96 Q44,-96 44,-34" stroke="#f5cf72" stroke-width="3" fill="none" opacity="0.8"/>
      <rect x="-60" y="-48" width="30" height="46" rx="13" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>
      <rect x="30" y="-48" width="30" height="46" rx="13" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>
      <rect x="-54" y="-40" width="18" height="30" rx="8" fill="#fca5a5" opacity="0.5"/>
      <rect x="36" y="-40" width="18" height="30" rx="8" fill="#fca5a5" opacity="0.5"/>`,
  },
  notebook: {
    cat: "desk",
    anchor: [0, -14],
    draw: () => `
      <ellipse cx="0" cy="3" rx="92" ry="9" fill="#000" opacity="0.25"/>
      <path d="M-84,0 L-60,-30 L88,-30 L64,0 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="2.5"/>
      <path d="M-78,-4 L-56,-27 L82,-27 L60,-4 Z" fill="#fefce8"/>
      ${[0, 1, 2, 3].map((i) => `<line x1="${-66 + i * 5}" y1="${-9 - i * 5}" x2="${58 + i * 3}" y2="${-9 - i * 5}" stroke="#93c5fd" stroke-width="1.5"/>`).join("")}
      <path d="M-50,-12 Q-40,-16 -30,-12 T-10,-12" stroke="#1e3a8a" stroke-width="2" fill="none"/>
      <path d="M-44,-18 Q-34,-22 -24,-18 T-4,-18 T16,-18" stroke="#1e3a8a" stroke-width="2" fill="none"/>
      ${Array.from({ length: 8 }, (_, i) => `<circle cx="${-66 + i * 8.5}" cy="${-6 - i * 3.4}" r="2.4" fill="#e5e7eb" stroke="#6b7280" stroke-width="1"/>`).join("")}`,
  },
  pencil: {
    cat: "desk",
    anchor: [0, -62],
    draw: () => `
      <ellipse cx="0" cy="2" rx="46" ry="8" fill="#000" opacity="0.25"/>
      <g transform="rotate(-14 -10 -60)"><rect x="-16" y="-124" width="12" height="70" fill="#facc15" stroke="#a16207" stroke-width="1.5"/><polygon points="-16,-124 -4,-124 -10,-140" fill="#fde68a"/><polygon points="-13,-132 -7,-132 -10,-140" fill="#1f2937"/><rect x="-16" y="-58" width="12" height="8" fill="#f9a8d4"/></g>
      <g transform="rotate(10 8 -60)"><rect x="2" y="-120" width="12" height="66" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/><polygon points="2,-120 14,-120 8,-136" fill="#fde68a"/><polygon points="5,-128 11,-128 8,-136" fill="#1f2937"/></g>
      <g transform="rotate(-2 -2 -60)"><rect x="-6" y="-116" width="12" height="64" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/><polygon points="-6,-116 6,-116 0,-132" fill="#fde68a"/><polygon points="-3,-124 3,-124 0,-132" fill="#1f2937"/></g>
      <path d="M-34,-56 L-30,0 L30,0 L34,-56 Z" fill="#9333ea" stroke="#581c87" stroke-width="3"/>
      <ellipse cx="0" cy="-56" rx="34" ry="7" fill="#7e22ce" stroke="#581c87" stroke-width="2"/>
      <line x1="-24" y1="-34" x2="24" y2="-34" stroke="#c4b5fd" stroke-width="3" opacity="0.7"/>`,
  },
  blackboard: {
    cat: "wall",
    anchor: [0, 0],
    draw: ({ chalk = ["Hello", "Bonjour", "Bonjou", "Olá"] } = {}) => `
      <g filter="url(#dropShadow)">
        <rect x="-266" y="-136" width="532" height="272" rx="8" fill="#92643a" stroke="#5b3a1d" stroke-width="4"/>
        <rect x="-250" y="-120" width="500" height="240" rx="3" fill="#1f5f48" stroke="#14402f" stroke-width="3"/>
        <rect x="-250" y="-120" width="500" height="240" rx="3" fill="#ffffff" opacity="0.05"/>
        <text x="-200" y="-62" font-family="${SERIF}" font-weight="bold" font-size="46" fill="#f8fafc" opacity="0.95">${chalk[0]}</text>
        <text x="40" y="-62" font-family="${SERIF}" font-weight="bold" font-size="46" fill="#fde68a" opacity="0.95">${chalk[1]}</text>
        <text x="-200" y="10" font-family="${SERIF}" font-weight="bold" font-size="46" fill="#fbcfe8" opacity="0.95">${chalk[2]}</text>
        <text x="40" y="10" font-family="${SERIF}" font-weight="bold" font-size="46" fill="#bae6fd" opacity="0.95">${chalk[3]}</text>
        <text x="-200" y="84" font-family="${SERIF}" font-size="38" fill="#f8fafc" opacity="0.85" letter-spacing="6">A B C D E F</text>
        <path d="M-210,26 Q-100,34 -10,24" stroke="#f8fafc" stroke-width="2" opacity="0.4" fill="none"/>
        <rect x="-190" y="124" width="60" height="10" rx="3" fill="#e5e7eb"/><rect x="-110" y="124" width="26" height="10" rx="3" fill="#fde68a"/>
      </g>`,
  },
  teacher: {
    cat: "stand",
    anchor: [0, -150],
    draw: ({ shirt = "#b91c1c" } = {}) => person({ shirt, glasses: true, pointer: true, hair: "#4a3224", skin: "#c68b63", longHair: true }),
  },
  student: {
    cat: "stand",
    anchor: [0, -140],
    draw: ({ shirt = "#16a34a", skin = "#8d5a3b" } = {}) => person({ shirt, skin, hair: "#14110f", book: true, pants: "#1e3a5f" }),
  },
  mic: {
    cat: "desk",
    anchor: [18, -192],
    draw: () => `
      <ellipse cx="0" cy="2" rx="54" ry="8" fill="#000" opacity="0.25"/>
      <rect x="-30" y="-10" width="60" height="12" rx="5" fill="#374151"/>
      <rect x="-5" y="-150" width="10" height="142" fill="#4b5563"/>
      <path d="M-5,-150 Q-5,-168 14,-170" stroke="#4b5563" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="-4" y="-224" width="40" height="64" rx="19" fill="#1f2937" stroke="#111827" stroke-width="3" transform="rotate(14 16 -192)"/>
      <g transform="rotate(14 16 -192)">${[0, 1, 2, 3, 4].map((i) => `<line x1="-2" y1="${-214 + i * 10}" x2="34" y2="${-214 + i * 10}" stroke="#9ca3af" stroke-width="2"/>`).join("")}
      <rect x="-4" y="-196" width="40" height="8" fill="#f5cf72"/></g>`,
  },
  computer: {
    cat: "desk",
    anchor: [0, -76],
    draw: () => `
      <ellipse cx="0" cy="3" rx="110" ry="10" fill="#000" opacity="0.25"/>
      <path d="M-92,0 L-80,-14 L80,-14 L92,0 Z" fill="#9ca3af" stroke="#4b5563" stroke-width="2.5"/>
      <rect x="-82" y="-132" width="164" height="118" rx="7" fill="#1f2937" stroke="#111827" stroke-width="4"/>
      <rect x="-74" y="-124" width="148" height="102" rx="3" fill="#e0f2fe"/>
      <rect x="-74" y="-124" width="148" height="18" fill="#2563eb"/>
      <circle cx="-64" cy="-115" r="3" fill="#fca5a5"/><circle cx="-54" cy="-115" r="3" fill="#fde68a"/><circle cx="-44" cy="-115" r="3" fill="#86efac"/>
      <rect x="-64" y="-96" width="52" height="30" rx="3" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
      <text x="-38" y="-75" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="15" fill="#1d4ed8">Hello</text>
      <rect x="-2" y="-96" width="62" height="30" rx="3" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="29" y="-75" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="15" fill="#b45309">Bonjou</text>
      <line x1="-64" y1="-52" x2="56" y2="-52" stroke="#93c5fd" stroke-width="3"/><line x1="-64" y1="-42" x2="30" y2="-42" stroke="#93c5fd" stroke-width="3"/>`,
  },
  map: {
    cat: "wall",
    anchor: [0, 0],
    draw: () => `
      <g filter="url(#dropShadow)">
        <rect x="-150" y="-98" width="300" height="196" rx="5" fill="#92643a" stroke="#5b3a1d" stroke-width="4"/>
        <rect x="-140" y="-88" width="280" height="176" fill="#7fb8d8"/>
        <path d="M-120,-60 Q-92,-80 -60,-62 Q-44,-40 -62,-24 Q-84,-12 -100,-30 Q-124,-40 -120,-60 Z" fill="#7bb661" stroke="#4d7c3a" stroke-width="2"/>
        <path d="M-36,-70 Q0,-84 36,-66 Q58,-48 40,-30 Q18,-22 4,-36 Q-14,-30 -30,-44 Q-40,-56 -36,-70 Z" fill="#d4b062" stroke="#8c6b2f" stroke-width="2"/>
        <path d="M-6,-16 Q22,-20 34,2 Q36,42 14,64 Q-8,56 -12,24 Q-14,4 -6,-16 Z" fill="#7bb661" stroke="#4d7c3a" stroke-width="2"/>
        <path d="M58,-56 Q92,-70 118,-46 Q126,-24 100,-18 Q76,-22 62,-36 Z" fill="#d4b062" stroke="#8c6b2f" stroke-width="2"/>
        <path d="M-92,10 Q-70,-2 -50,18 Q-54,52 -78,62 Q-96,40 -92,10 Z" fill="#7bb661" stroke="#4d7c3a" stroke-width="2"/>
        <path d="M70,24 Q104,16 122,40 Q114,64 84,62 Z" fill="#7bb661" stroke="#4d7c3a" stroke-width="2"/>
        <path d="M-140,-30 L140,-30 M-140,20 L140,20" stroke="#ffffff" stroke-width="1" opacity="0.35" stroke-dasharray="6 5"/>
        <circle cx="-30" cy="-6" r="5" fill="#dc2626"/><circle cx="64" cy="-38" r="5" fill="#dc2626"/>
        <path d="M-30,-6 Q16,-52 64,-38" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-dasharray="7 5"/>
      </g>`,
  },
};

export const OBJECT_IDS = Object.keys(OBJECTS);

/* ------------------------------------------------------------------------------------------------ cenários */

const SKY = { dia: "url(#skyDay)", sunset: "url(#skySunset)", night: "url(#skyDusk)" };

let windowCounter = 0;
// Janela com céu, sol/lua e nuvem. Devolve o markup e os pontos (px) de sol/lua, nuvem e céu para os rótulos extras.
function windowBox(x, y, w, h, pal, { sun = true, cloud = true } = {}) {
  const id = `wclip${++windowCounter}`;
  const isNight = pal === "night";
  const sx = x + w * 0.68;
  const sy = y + h * 0.3;
  const body = `
    <rect x="${x - 12}" y="${y - 12}" width="${w + 24}" height="${h + 24}" rx="6" fill="#8a5a33" stroke="#5b3a1d" stroke-width="3"/>
    <clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
    <g clip-path="url(#${id})">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${SKY[pal]}"/>
      ${isNight && sun ? `<circle cx="${sx}" cy="${sy}" r="${w * 0.22}" fill="url(#sunGlowDay)" opacity="0.35"/><circle cx="${sx}" cy="${sy}" r="${w * 0.1}" fill="#fff8dc"/><circle cx="${sx + w * 0.04}" cy="${sy - w * 0.02}" r="${w * 0.085}" fill="#262f56" opacity="0.85"/>`
        : sun ? `<circle cx="${sx}" cy="${sy}" r="${w * 0.4}" fill="url(#${pal === "sunset" ? "sunGlowSunset" : "sunGlowDay"})"/><circle cx="${sx}" cy="${sy}" r="${w * 0.1}" fill="${pal === "sunset" ? "#ffdf99" : "#fffded"}"/>` : ""}
      ${isNight ? [[0.2, 0.2], [0.45, 0.12], [0.3, 0.5], [0.78, 0.62], [0.55, 0.38]].map(([a, b]) => `<circle cx="${x + w * a}" cy="${y + h * b}" r="2.4" fill="#fffbe6"/>`).join("") : ""}
      ${cloud && !isNight ? `<g transform="translate(${x + w * 0.3},${y + h * 0.62}) scale(0.3)">${drawGhibliCloud(0, 0, 1, pal === "sunset")}</g>` : ""}
    </g>
    <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#8a5a33" stroke-width="7"/>
    <line x1="${x}" y1="${y + h * 0.5}" x2="${x + w}" y2="${y + h * 0.5}" stroke="#8a5a33" stroke-width="7"/>
    <rect x="${x - 18}" y="${y + h + 8}" width="${w + 36}" height="12" rx="3" fill="#a77348" stroke="#5b3a1d" stroke-width="2"/>`;
  return {
    body,
    sun: [sx, sy],
    cloud: [x + w * 0.3, y + h * 0.58],
    sky: [x + w * 0.36, y + h * 0.3],
  };
}

function bunting(y, colors, x0 = 0, x1 = 1200, sag = 40) {
  const n = 18;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return [x0 + (x1 - x0) * t, y + Math.sin(t * Math.PI) * sag];
  });
  const flags = pts.slice(0, -1).map(([px, py], i) => {
    const [qx, qy] = pts[i + 1];
    const mx = (px + qx) / 2;
    const my = (py + qy) / 2;
    return `<polygon points="${px},${py} ${qx},${qy} ${mx},${my + 34}" fill="${colors[i % colors.length]}" stroke="rgba(0,0,0,.15)" stroke-width="1"/>`;
  });
  return `<path d="M${pts.map((p) => p.join(",")).join(" L")}" stroke="#57534e" stroke-width="3" fill="none"/>${flags.join("")}`;
}

function stringLights(y, x0 = 0, x1 = 1200, sag = 36) {
  const n = 16;
  let out = "";
  const path = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = x0 + (x1 - x0) * t;
    const py = y + Math.sin(t * Math.PI) * sag;
    path.push(`${px},${py}`);
    if (i % 1 === 0 && i < n) out += `<circle cx="${px}" cy="${py + 8}" r="7" fill="#fde68a"/><circle cx="${px}" cy="${py + 8}" r="16" fill="#fde68a" opacity="0.28"/>`;
  }
  return `<path d="M${path.join(" L")}" stroke="#44403c" stroke-width="2.5" fill="none"/>${out}`;
}

function bookshelf(x, y, w, h, seed) {
  const r = rng(seed);
  const palette = ["#b91c1c", "#1d4ed8", "#15803d", "#a16207", "#7c3aed", "#0e7490", "#be185d", "#c2410c", "#334155"];
  const rows = 4;
  const rowH = h / rows;
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#4a3322" stroke="#2c1d12" stroke-width="4"/>`;
  for (let row = 0; row < rows; row++) {
    const ry = y + row * rowH;
    out += `<rect x="${x + 6}" y="${ry + 6}" width="${w - 12}" height="${rowH - 6}" fill="#2f2014"/>`;
    let bx = x + 10;
    while (bx < x + w - 18) {
      const bw = 12 + r() * 16;
      const bh = rowH * (0.55 + r() * 0.35);
      if (bx + bw > x + w - 10) break;
      out += `<rect x="${bx}" y="${ry + rowH - bh}" width="${bw}" height="${bh}" fill="${palette[Math.floor(r() * palette.length)]}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>`;
      out += `<line x1="${bx + bw * 0.5}" y1="${ry + rowH - bh + 8}" x2="${bx + bw * 0.5}" y2="${ry + rowH - bh + 8 + bh * 0.25}" stroke="#f5cf72" stroke-width="2" opacity="0.8"/>`;
      bx += bw + 2 + r() * 2;
    }
    out += `<rect x="${x}" y="${ry + rowH - 4}" width="${w}" height="8" fill="#6b4a31"/>`;
  }
  return out;
}

function skyline(topMin, topMax, seed, palette) {
  const r = rng(seed);
  let out = "";
  let x = -20;
  while (x < 1220) {
    const w = 110 + r() * 90;
    const top = topMin + r() * (topMax - topMin);
    const c = palette[Math.floor(r() * palette.length)];
    out += `<rect x="${x}" y="${top}" width="${w}" height="${820 - top}" fill="${c}" stroke="rgba(0,0,0,.2)" stroke-width="2"/>`;
    out += `<rect x="${x}" y="${top}" width="${w}" height="16" fill="rgba(0,0,0,.14)"/>`;
    for (let wy = top + 40; wy < 590; wy += 56) {
      for (let wx = x + 16; wx < x + w - 24; wx += 36) {
        out += `<rect x="${wx}" y="${wy}" width="20" height="30" rx="3" fill="#fde68a" opacity="0.88" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/>`;
      }
    }
    x += w + 4;
  }
  return out;
}

function backdrop(def) {
  const { setting, palette: pal } = def;
  const extras = []; // [chave, x, y] em px
  let body = "";
  const wallByPal = { dia: "#f1e2c2", sunset: "#f0cf9a", night: "#27324f" };

  const addWindowExtras = (win, { sun = true, cloud = true } = {}) => {
    if (sun) extras.push([pal === "night" ? "lua" : "sol", ...win.sun]);
    if (cloud && pal !== "night") extras.push(["nuvem", ...win.cloud]);
    extras.push(["ceu", ...win.sky]);
  };

  switch (setting) {
    case "library": {
      body += `<rect width="1200" height="800" fill="${pal === "night" ? "#2a1d14" : "#5b3f2a"}"/>`;
      body += bookshelf(30, 40, 360, 520, 11) + bookshelf(420, 40, 360, 520, 23) + bookshelf(810, 40, 360, 520, 37);
      body += `<ellipse cx="600" cy="120" rx="520" ry="260" fill="#fde68a" opacity="${pal === "night" ? 0.2 : 0.1}"/>`;
      break;
    }
    case "cafe": {
      const pastel = pal === "sunset" ? ["#6b4a68", "#7c4f5f", "#5a4570", "#8a5a5a"] : ["#c9a88f", "#b8a4c4", "#a3b4c8", "#d4b896"];
      // De dia o skyline sobe (o céu fica só na faixa de cima) para a camada de vida não confundir o céu com água.
      const sunY = pal === "sunset" ? 250 : 110;
      const cloudY = pal === "sunset" ? 170 : 120;
      body += `<rect width="1200" height="800" fill="${SKY[pal]}"/>`;
      body += `<circle cx="210" cy="${sunY}" r="190" fill="url(#${pal === "sunset" ? "sunGlowSunset" : "sunGlowDay"})"/><circle cx="210" cy="${sunY}" r="52" fill="${pal === "sunset" ? "#ffdf99" : "#fffded"}"/>`;
      extras.push(["sol", 210, sunY]);
      body += `<g transform="translate(900,${cloudY}) scale(0.7)">${drawGhibliCloud(0, 0, 1, pal === "sunset")}</g>`;
      extras.push(["nuvem", 900, cloudY - 10]);
      extras.push(["ceu", 560, pal === "sunset" ? 200 : 80]);
      body += pal === "sunset" ? skyline(330, 410, 71, pastel) : skyline(215, 245, 71, pastel);
      body += stringLights(pal === "sunset" ? 60 : 70, 0, 1200, 30);
      body += `<path d="M-10,0 L1210,0 L1210,52 Q1160,80 1110,52 Q1060,80 1010,52 Q960,80 910,52 Q860,80 810,52 Q760,80 710,52 Q660,80 610,52 Q560,80 510,52 Q460,80 410,52 Q360,80 310,52 Q260,80 210,52 Q160,80 110,52 Q60,80 10,52 L-10,52 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3"/>`;
      break;
    }
    case "plaza": {
      const facade = pal === "night" ? ["#3a3f66", "#4a3f66", "#34506b"] : ["#f2c9a0", "#f4e2a6", "#a9d6c2", "#f0b7b7", "#b9c8ee"];
      body += `<rect width="1200" height="800" fill="${SKY[pal]}"/>`;
      const sx = 960;
      const sy = 100;
      if (pal === "night") {
        body += `<circle cx="${sx}" cy="${sy}" r="90" fill="url(#sunGlowDay)" opacity="0.35"/><circle cx="${sx}" cy="${sy}" r="30" fill="#fff8dc"/><circle cx="${sx + 12}" cy="${sy - 6}" r="26" fill="#121832" opacity="0.8"/>`;
        body += [[120, 60], [300, 110], [520, 50], [700, 100], [820, 40], [1100, 170], [200, 190]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.8" fill="#fffbe6"/>`).join("");
        extras.push(["lua", sx, sy]);
      } else {
        body += `<circle cx="${sx}" cy="${sy}" r="150" fill="url(#${pal === "sunset" ? "sunGlowSunset" : "sunGlowDay"})"/><circle cx="${sx}" cy="${sy}" r="44" fill="${pal === "sunset" ? "#ffdf99" : "#fffded"}"/>`;
        extras.push(["sol", sx, sy]);
        body += `<g transform="translate(260,100) scale(0.55)">${drawGhibliCloud(0, 0, 1, pal === "sunset")}</g>`;
        extras.push(["nuvem", 260, 96]);
      }
      extras.push(["ceu", 560, 70]);
      body += skyline(190, 232, 91, facade);
      body += bunting(236, ["#dc2626", "#fbbf24", "#16a34a", "#2563eb", "#f8fafc", "#9333ea"], 0, 1200, 46);
      if (pal === "night") body += stringLights(300, 0, 1200, 40);
      break;
    }
    case "studio": {
      body += `<rect width="1200" height="800" fill="#2b3a4d"/>`;
      for (let i = 0; i < 6; i++) {
        const px = 40 + i * 190;
        body += `<rect x="${px}" y="90" width="170" height="470" rx="6" fill="#1f2a38" stroke="#111827" stroke-width="3"/>`;
        body += `<path d="${Array.from({ length: 9 }, (_, k) => `${k === 0 ? "M" : "L"}${px + 10 + k * 18},${k % 2 === 0 ? 110 : 150}`).join(" ")}" stroke="#334155" stroke-width="3" fill="none"/>`;
        for (let row = 0; row < 7; row++) {
          body += `<path d="M${px + 8},${130 + row * 60} l22,26 l22,-26 l22,26 l22,-26 l22,26 l22,-26 l18,22" stroke="#3b4a5e" stroke-width="3" fill="none"/>`;
        }
      }
      body += `<g filter="url(#dropShadow)"><rect x="500" y="22" width="200" height="56" rx="10" fill="#7f1d1d" stroke="#450a0a" stroke-width="3"/><rect x="508" y="30" width="184" height="40" rx="6" fill="#dc2626"/><text x="600" y="60" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="26" fill="#fff" letter-spacing="3">NO AR</text></g>`;
      body += `<ellipse cx="600" cy="330" rx="520" ry="240" fill="#f59e0b" opacity="0.09"/>`;
      break;
    }
    default: {
      // sala de aula / playroom / laboratório / salão
      const wall = def.wall ?? wallByPal[pal];
      body += `<rect width="1200" height="800" fill="${wall}"/>`;
      body += `<rect x="0" y="430" width="1200" height="190" fill="${pal === "night" ? "#3a3550" : "#b68a5c"}" opacity="0.85"/>`;
      body += `<rect x="0" y="424" width="1200" height="12" fill="${pal === "night" ? "#4a4468" : "#8a6338"}"/>`;
      if (setting === "playroom") {
        body += `<path d="M120,330 A480,300 0 0 1 1080,330" stroke="#ef4444" stroke-width="22" fill="none"/><path d="M146,330 A454,276 0 0 1 1054,330" stroke="#f59e0b" stroke-width="22" fill="none"/><path d="M172,330 A428,252 0 0 1 1028,330" stroke="#22c55e" stroke-width="22" fill="none"/><path d="M198,330 A402,228 0 0 1 1002,330" stroke="#3b82f6" stroke-width="22" fill="none"/>`;
        body += ["A", "B", "C", "D", "E", "F", "G"].map((ch, i) => `<rect x="${70 + i * 160}" y="6" width="54" height="54" rx="8" fill="${["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6"][i]}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><text x="${97 + i * 160}" y="46" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="34" fill="#fff">${ch}</text>`).join("");
      }
      if (setting === "lab") {
        body += [0, 1, 2].map((i) => `<rect x="${380 + i * 150}" y="150" width="130" height="90" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="4"/><rect x="${388 + i * 150}" y="158" width="114" height="74" fill="${["#1e40af", "#0f766e", "#7c3aed"][i]}" opacity="0.85"/><path d="M${396 + i * 150},${200} l16,-18 l16,12 l22,-26 l20,22 l22,-8" stroke="#fff" stroke-width="3" fill="none" opacity="0.8"/>`).join("");
      }
      const winL = windowBox(60, 80, 210, 250, pal, { sun: true, cloud: true });
      const winR = windowBox(930, 80, 210, 250, pal, { sun: false, cloud: true });
      body += winL.body + winR.body;
      addWindowExtras(winL, { sun: true, cloud: false });
      if (pal !== "night") extras.push(["nuvem", ...winR.cloud]);
      if (setting === "classroom" || setting === "hall" || setting === "playroom" || setting === "lab") {
        if (setting === "classroom" && !def.objects.some((o) => o.id === "blackboard") && !def.objects.some((o) => o.id === "map")) {
          // quadro decorativo (sem rótulo) quando a cena não usa quadro/mapa como elemento
          body += `<g transform="translate(600,236) scale(0.92)">${OBJECTS.blackboard.draw({ chalk: ["Hello", "Bonjour", "Bonjou", "Olá"] })}</g>`;
        }
      }
      break;
    }
  }
  return { body, extras };
}

/* ------------------------------------------------------------------------------------------------ mesa */

function desk(pal) {
  const top = pal === "night" ? "#6b4a31" : "#b07a4c";
  return `
    <g>
      <rect x="-20" y="612" width="1240" height="30" fill="${top}" stroke="#5b3a1d" stroke-width="3"/>
      <rect x="-20" y="612" width="1240" height="8" fill="#ffffff" opacity="0.18"/>
      <rect x="-20" y="642" width="1240" height="170" fill="url(#woodTone)"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${i * 220}" y1="642" x2="${i * 220 + 40}" y2="800" stroke="#3f2815" stroke-width="2" opacity="0.4"/>`).join("")}
      <rect x="-20" y="642" width="1240" height="10" fill="#000" opacity="0.18"/>
    </g>`;
}

/* ------------------------------------------------------------------------------------------------ cenas */

// Placement: { id, x, y?, s?, opts? }. y padrão: mesa=618, "stand"=700, wall/air = y informado.
const DEF_Y = { desk: 618, stand: 650 };

export const SCENES = [
  { title: "Sala de aula de idiomas", setting: "classroom", palette: "dia", labelIds: ["book", "globe", "speech", "letters"],
    objects: [
      { id: "blackboard", x: 600, y: 236, s: 0.92 },
      { id: "globe", x: 180, s: 1.05 }, { id: "book", x: 470, s: 1.3 }, { id: "letters", x: 760, s: 1.05 },
      { id: "speech", x: 1000, y: 500, s: 0.9, opts: { words: ["Bonjour", "Hello"] } },
    ] },
  { title: "Biblioteca de dicionários", setting: "library", palette: "dia", labelIds: ["dictionary", "book", "globe", "letters"],
    objects: [{ id: "dictionary", x: 200, s: 1.2 }, { id: "book", x: 470, s: 1.3 }, { id: "globe", x: 760, s: 1.05 }, { id: "letters", x: 1000, s: 1.05 }] },
  { title: "Conversa entre amigos no café", setting: "cafe", palette: "sunset", labelIds: ["speech", "flag", "notebook", "pencil"],
    objects: [{ id: "flag", x: 170, y: 705, s: 0.95, opts: { country: "france" } }, { id: "speech", x: 600, y: 360, s: 1.1, opts: { words: ["Salut!", "Oi!"] } }, { id: "notebook", x: 470, s: 1.3 }, { id: "pencil", x: 760, s: 1.1 }] },
  { title: "Aula com professor e quadro-negro", setting: "classroom", palette: "dia", labelIds: ["teacher", "blackboard", "student", "notebook"],
    objects: [{ id: "blackboard", x: 600, y: 226, s: 0.95 }, { id: "teacher", x: 330, y: 650, s: 1.3 }, { id: "student", x: 880, y: 650, s: 1.15, opts: { shirt: "#7c3aed" } }, { id: "notebook", x: 600, s: 1.3 }] },
  { title: "Mapa-múndi e bandeiras do mundo", setting: "hall", palette: "dia", labelIds: ["map", "flag", "globe", "speech"],
    objects: [{ id: "map", x: 600, y: 236, s: 1.2 }, { id: "flag", x: 150, y: 650, s: 0.95, opts: { country: "haiti" } }, { id: "flag", x: 990, y: 650, s: 0.95, opts: { country: "brazil" }, noLabel: true }, { id: "globe", x: 470, s: 1.0 }, { id: "speech", x: 880, y: 400, s: 0.9, opts: { words: ["Bonjou", "Oi"] } }] },
  { title: "Estudo noturno com fones de ouvido", setting: "classroom", palette: "night", wall: "#27324f", labelIds: ["headphones", "computer", "notebook", "book"],
    objects: [{ id: "computer", x: 330, s: 1.2 }, { id: "headphones", x: 620, s: 1.2 }, { id: "notebook", x: 880, s: 1.3 }, { id: "book", x: 1070, s: 1.3 }] },
  { title: "Estúdio de podcast bilíngue", setting: "studio", palette: "sunset", labelIds: ["mic", "headphones", "computer", "speech"],
    objects: [{ id: "mic", x: 330, s: 1.2 }, { id: "headphones", x: 600, s: 1.15 }, { id: "computer", x: 870, s: 1.2 }, { id: "speech", x: 600, y: 270, s: 1.0, opts: { words: ["Hello", "Bonjou"] } }] },
  { title: "Alfabeto nos blocos de madeira", setting: "playroom", palette: "dia", labelIds: ["letters", "student", "book", "pencil"],
    objects: [{ id: "student", x: 250, y: 650, s: 1.15, opts: { shirt: "#f59e0b", skin: "#e8b48f" } }, { id: "letters", x: 560, s: 1.35 }, { id: "book", x: 860, s: 1.3 }, { id: "pencil", x: 1060, s: 1.15 }] },
  { title: "Intercâmbio cultural na praça", setting: "plaza", palette: "dia", labelIds: ["flag", "teacher", "student", "speech"],
    objects: [{ id: "flag", x: 140, y: 650, s: 0.95, opts: { country: "uk" } }, { id: "teacher", x: 440, y: 650, s: 1.3, opts: { shirt: "#2563eb" } }, { id: "student", x: 760, y: 650, s: 1.15 }, { id: "speech", x: 980, y: 400, s: 0.95, opts: { words: ["Hello", "Olá"] } }] },
  { title: "Laboratório de idiomas", setting: "lab", palette: "dia", wall: "#dfe8ec", labelIds: ["computer", "headphones", "mic", "notebook"],
    objects: [{ id: "computer", x: 250, s: 1.2 }, { id: "headphones", x: 520, s: 1.15 }, { id: "mic", x: 790, s: 1.1 }, { id: "notebook", x: 1020, s: 1.3 }] },
  { title: "Dicionário e lápis na mesa de estudo", setting: "classroom", palette: "sunset", labelIds: ["dictionary", "pencil", "notebook", "globe"],
    objects: [{ id: "dictionary", x: 250, s: 1.3 }, { id: "pencil", x: 520, s: 1.2 }, { id: "notebook", x: 790, s: 1.3 }, { id: "globe", x: 1040, s: 1.0 }] },
  { title: "Clube de conversação", setting: "cafe", palette: "dia", labelIds: ["speech", "student", "teacher", "book"],
    objects: [{ id: "teacher", x: 280, y: 650, s: 1.3, opts: { shirt: "#0f766e" } }, { id: "student", x: 900, y: 650, s: 1.15, opts: { shirt: "#be185d" } }, { id: "speech", x: 590, y: 340, s: 1.2, opts: { words: ["Salut!", "Hello"] } }, { id: "book", x: 600, s: 1.3 }] },
  { title: "Tradução com mapa e dicionário", setting: "hall", palette: "sunset", labelIds: ["map", "dictionary", "pencil", "notebook"],
    objects: [{ id: "map", x: 600, y: 236, s: 1.25 }, { id: "dictionary", x: 230, s: 1.25 }, { id: "pencil", x: 530, s: 1.15 }, { id: "notebook", x: 880, s: 1.3 }] },
  { title: "Viagem pelo mundo das línguas", setting: "hall", palette: "dia", labelIds: ["globe", "flag", "map", "book"],
    objects: [{ id: "map", x: 600, y: 236, s: 1.1 }, { id: "flag", x: 950, y: 650, s: 0.95, opts: { country: "spain" } }, { id: "globe", x: 480, s: 1.3 }, { id: "book", x: 220, s: 1.3 }] },
  { title: "Escrevendo no quadro", setting: "classroom", palette: "sunset", labelIds: ["blackboard", "pencil", "letters", "student"],
    objects: [{ id: "blackboard", x: 600, y: 228, s: 1.0, opts: { chalk: ["Hello", "Bonjour", "Bonjou", "Olá"] } }, { id: "student", x: 250, y: 650, s: 1.15, opts: { shirt: "#ea580c" } }, { id: "letters", x: 600, s: 1.15 }, { id: "pencil", x: 940, s: 1.2 }] },
  { title: "Aula online com fones e computador", setting: "lab", palette: "dia", wall: "#e4ddd0", labelIds: ["computer", "headphones", "student", "speech"],
    objects: [{ id: "student", x: 230, y: 650, s: 1.15, opts: { shirt: "#0ea5e9", skin: "#d9a07b" } }, { id: "computer", x: 560, s: 1.35 }, { id: "headphones", x: 870, s: 1.15 }, { id: "speech", x: 1000, y: 480, s: 0.95, opts: { words: ["Hello", "Oi"] } }] },
  { title: "Leitura em voz alta na biblioteca", setting: "library", palette: "sunset", labelIds: ["book", "student", "teacher", "dictionary"],
    objects: [{ id: "teacher", x: 250, y: 650, s: 1.3, opts: { shirt: "#7c2d12" } }, { id: "student", x: 520, y: 650, s: 1.15, opts: { shirt: "#1d4ed8" } }, { id: "book", x: 800, s: 1.3 }, { id: "dictionary", x: 1030, s: 1.2 }] },
  { title: "Cartas e letras coloridas", setting: "playroom", palette: "dia", labelIds: ["letters", "notebook", "pencil", "flag"],
    objects: [{ id: "flag", x: 170, y: 650, s: 0.92, opts: { country: "brazil" } }, { id: "letters", x: 450, s: 1.25 }, { id: "notebook", x: 760, s: 1.3 }, { id: "pencil", x: 1010, s: 1.2 }] },
  { title: "Festival de idiomas", setting: "plaza", palette: "night", labelIds: ["flag", "mic", "speech", "globe"],
    objects: [{ id: "flag", x: 150, y: 650, s: 0.95, opts: { country: "haiti" } }, { id: "mic", x: 440, s: 1.2 }, { id: "globe", x: 700, s: 1.1 }, { id: "speech", x: 960, y: 400, s: 1.0, opts: { words: ["Bonjou", "Hello"] } }] },
  { title: "Noite de estudo na biblioteca", setting: "library", palette: "night", labelIds: ["book", "dictionary", "headphones", "globe"],
    objects: [{ id: "book", x: 250, s: 1.3 }, { id: "dictionary", x: 520, s: 1.3 }, { id: "headphones", x: 790, s: 1.2 }, { id: "globe", x: 1030, s: 1.05 }] },
];

// Ordem dos rótulos = ordem dos `labelIds` (o primeiro objeto com esse id na cena que não esteja marcado noLabel).
function placeObject(p) {
  const def = OBJECTS[p.id];
  const s = p.s ?? 1;
  const y = p.y ?? DEF_Y[def.cat] ?? 618;
  const markup = `<g transform="translate(${p.x}, ${y}) scale(${s})" ${def.cat === "wall" || def.cat === "air" ? "" : 'filter="url(#dropShadow)"'}>${def.draw(p.opts ?? {})}</g>`;
  const anchor = [p.x + def.anchor[0] * s, y + def.anchor[1] * s];
  return { markup, anchor, cat: def.cat };
}

/** Monta a cena e devolve o SVG + as âncoras (px, imagem 1200x800) de cada elemento rotulado e dos extras. */
export function buildScene(index) {
  const scene = SCENES[index];
  windowCounter = 0;
  const { body, extras } = backdrop(scene);
  const placed = scene.objects.map((p) => ({ p, ...placeObject(p) }));
  const order = { wall: 0, stand: 1, desk: 3, air: 4 };
  const behind = placed.filter((o) => o.cat === "wall" || o.cat === "stand").sort((a, b) => order[a.cat] - order[b.cat]);
  const front = placed.filter((o) => o.cat === "desk" || o.cat === "air").sort((a, b) => order[a.cat] - order[b.cat]);

  const anchors = scene.labelIds.map((id) => {
    const match = placed.find((o) => o.p.id === id && !o.p.noLabel);
    if (!match) throw new Error(`Cena ${index + 1}: objeto "${id}" não está desenhado`);
    return match.anchor;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Lang</title>
  <desc>Ghibli anime art: ${scene.title} com livros, letras, bandeiras e conversas em vários idiomas.</desc>
  ${getGhibliDefs()}
  ${body}
  ${behind.map((o) => o.markup).join("\n  ")}
  ${desk(scene.palette)}
  ${front.map((o) => o.markup).join("\n  ")}
  ${scene.palette === "night" ? `<rect width="1200" height="800" fill="#0b1026" opacity="0.18"/>` : scene.palette === "sunset" ? `<rect width="1200" height="800" fill="#f97316" opacity="0.07"/>` : ""}
</svg>`;

  return { svg, anchors, extras, title: scene.title, labelIds: scene.labelIds };
}

export function renderScene(index) {
  return buildScene(index).svg;
}
