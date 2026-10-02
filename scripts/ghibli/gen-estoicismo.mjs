import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Pórtico entre oliveiras", pal: "dia", sun: [920, 150, 50, false] },
  { num: 3, title: "Estudo à luz da lamparina", pal: "night", sun: [950, 180, 40, false] },
  { num: 4, title: "Jardim da reflexão", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 5, title: "Portão do templo antigo", pal: "dia", sun: [900, 140, 48, false] },
  { num: 6, title: "Leitura no pátio", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 7, title: "Estátua entre colunas", pal: "dia", sun: [940, 160, 50, false] },
  { num: 8, title: "Caminho da sabedoria", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 9, title: "Biblioteca serena", pal: "dia", sun: [880, 140, 48, false] },
  { num: 10, title: "Pátio das meditações", pal: "night", sun: [920, 190, 40, false] },
  { num: 11, title: "Ágora clássica sob o céu azul", pal: "dia", sun: [930, 150, 50, false] },
  { num: 12, title: "Escadaria do templo antigo", pal: "dia", sun: [890, 150, 48, false] },
  { num: 13, title: "Leitura meditativa na oliveira", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 14, title: "Lamparina acesa sobre o papiro", pal: "night", sun: [960, 180, 40, false] },
  { num: 15, title: "Busto de mármore do filósofo", pal: "dia", sun: [910, 140, 48, false] },
  { num: 16, title: "Portão de pedra para o templo", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 17, title: "Diálogo filosófico ao ar livre", pal: "dia", sun: [940, 160, 50, false] },
  { num: 18, title: "Pátio circular com ânforas", pal: "sunset", sun: [820, 260, 52, true] },
  { num: 19, title: "Vigília filosófica noturna", pal: "night", sun: [950, 180, 40, false] },
  { num: 20, title: "Passeio sereno entre oliveiras", pal: "sunset", sun: [600, 320, 56, true] },
];

function drawColumn(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    ${[-10, -3, 4, 11].map(gx => `<line x1="${gx}" y1="-120" x2="${gx}" y2="70" stroke="#94a3b8" stroke-width="1.5"/>`).join("")}
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>`;
}

function drawOliveTree(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>`;
}

function drawSage(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

function drawOilLamp(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Bronze Oil Lamp (Lamparina) -->
    <circle cx="-25" cy="-12" r="30" fill="#facc15" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M-30,-5 Q-20,15 0,15 Q20,15 30,-5 L25,-12 Q0,-10 -25,-12 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2"/>
    <path d="M-35,-10 Q-30,-2 -25,-5" stroke="#78350f" stroke-width="3" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="4" ry="7" fill="#f97316"/>
    <ellipse cx="-28" cy="-14" rx="2" ry="4" fill="#fef08a"/>
    <!-- Curved handle -->
    <path d="M25,-8 Q38,-15 32,5 Q26,15 18,12" stroke="#78350f" stroke-width="3" fill="none"/>
  </g>`;
}

function drawAmphora(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>`;
}

function drawScroll(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>`;
}

function drawStatue(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>`;
}

function drawStoneGate(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Classical Stone Portal Arch -->
    <rect x="-90" y="-120" width="180" height="25" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <polygon points="-100,-120 0,-175 100,-120" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <!-- Twin Colonnade Pillars -->
    <rect x="-75" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="47" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  </g>`;
}

function drawBook(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>`;
}

function drawStoneTerrace() {
  return `<!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  ${[0, 200, 400, 600, 800, 1000, 1200].map(lx => `<line x1="${lx}" y1="600" x2="${lx-30}" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>`).join("")}`;
}

function generateScene(scene) {
  const isNight = scene.pal === "night";
  const isSunset = scene.pal === "sunset";
  const skyFill = isNight ? "url(#skyDusk)" : isSunset ? "url(#skySunset)" : "url(#skyDay)";
  const [sx, sy, sr, ssunset] = scene.sun;
  const numPad = String(scene.num).padStart(2, "0");

  let specificObjects = "";

  switch (scene.num) {
    case 2: // Pórtico entre oliveiras (column, olive, book, sage)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawOliveTree(220, 560, 1.35)}
        ${drawColumn(750, 580, 1.3)}
        ${drawColumn(950, 580, 1.3)}
        ${drawSage(520, 590, 1.4)}
        ${drawBook(400, 690, 1.3)}
      `;
      break;
    case 3: // Estudo à luz da lamparina (lamp, scroll, book, jar)
      specificObjects = `
        <rect width="1200" height="800" fill="#1c1917" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        ${drawOilLamp(450, 640, 1.6)}
        ${drawScroll(680, 660, 1.45)}
        ${drawBook(560, 680, 1.4)}
        ${drawAmphora(880, 640, 1.3)}
      `;
      break;
    case 4: // Jardim da reflexão (sage, olive, path, statue)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawOliveTree(180, 560, 1.35)}
        ${drawOliveTree(1000, 560, 1.3)}
        ${drawStatue(780, 620, 1.3)}
        ${drawSage(460, 590, 1.4)}
      `;
      break;
    case 5: // Portão do templo antigo (gate, column, jar, olive)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawStoneGate(600, 540, 1.4)}
        ${drawOliveTree(200, 560, 1.3)}
        ${drawAmphora(850, 650, 1.4)}
      `;
      break;
    case 6: // Leitura no pátio (book, sage, lamp, path)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawSage(560, 590, 1.45)}
        ${drawBook(400, 690, 1.4)}
        ${drawOilLamp(720, 660, 1.35)}
      `;
      break;
    case 7: // Estátua entre colunas (statue, column, scroll, olive)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawColumn(340, 580, 1.35)}
        ${drawColumn(860, 580, 1.35)}
        ${drawStatue(600, 610, 1.45)}
        ${drawScroll(480, 680, 1.3)}
      `;
      break;
    case 8: // Caminho da sabedoria (path, sage, olive, jar)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawOliveTree(220, 560, 1.35)}
        ${drawOliveTree(960, 560, 1.35)}
        ${drawSage(540, 590, 1.45)}
        ${drawAmphora(740, 650, 1.35)}
      `;
      break;
    case 9: // Biblioteca serena (book, scroll, column, lamp)
      specificObjects = `
        <rect width="1200" height="800" fill="#292524" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        ${drawColumn(200, 580, 1.3)}
        ${drawColumn(1000, 580, 1.3)}
        ${drawBook(520, 670, 1.5)}
        ${drawScroll(720, 670, 1.4)}
        ${drawOilLamp(620, 630, 1.4)}
      `;
      break;
    case 10: // Pátio das meditações (sage, statue, gate, lamp)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawStoneGate(600, 540, 1.35)}
        ${drawStatue(860, 620, 1.3)}
        ${drawSage(420, 590, 1.4)}
        ${drawOilLamp(600, 660, 1.3)}
      `;
      break;
    case 11: // Ágora clássica sob o céu azul (column, statue, sage, path)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawColumn(240, 580, 1.3)}
        ${drawColumn(420, 580, 1.2)}
        ${drawStatue(900, 610, 1.35)}
        ${drawSage(650, 590, 1.45)}
      `;
      break;
    case 12: // Escadaria do templo antigo (column, gate, jar, scroll)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawStoneGate(560, 530, 1.4)}
        ${drawColumn(920, 580, 1.3)}
        ${drawAmphora(340, 650, 1.4)}
        ${drawScroll(720, 680, 1.35)}
      `;
      break;
    case 13: // Leitura meditativa na oliveira (olive, book, sage, jar)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawOliveTree(320, 560, 1.45)}
        ${drawSage(650, 590, 1.4)}
        ${drawBook(520, 690, 1.4)}
        ${drawAmphora(840, 650, 1.35)}
      `;
      break;
    case 14: // Lamparina acesa sobre o papiro (lamp, scroll, book, jar)
      specificObjects = `
        <rect width="1200" height="800" fill="#0c0a09" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        ${drawOilLamp(480, 630, 1.6)}
        ${drawScroll(680, 660, 1.45)}
        ${drawBook(340, 680, 1.4)}
        ${drawAmphora(880, 640, 1.35)}
      `;
      break;
    case 15: // Busto de mármore do filósofo (statue, column, olive, book)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawOliveTree(220, 560, 1.35)}
        ${drawColumn(960, 580, 1.35)}
        ${drawStatue(600, 610, 1.5)}
        ${drawBook(420, 690, 1.35)}
      `;
      break;
    case 16: // Portão de pedra para o templo (gate, column, path, statue)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawStoneGate(540, 530, 1.4)}
        ${drawColumn(880, 580, 1.3)}
        ${drawStatue(260, 610, 1.35)}
      `;
      break;
    case 17: // Diálogo filosófico ao ar livre (sage, olive, scroll, column)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawOliveTree(200, 560, 1.35)}
        ${drawColumn(980, 580, 1.35)}
        ${drawSage(480, 590, 1.4)}
        ${drawSage(700, 590, 1.35)}
        ${drawScroll(580, 680, 1.3)}
      `;
      break;
    case 18: // Pátio circular com ânforas (column, jar, statue, path)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawColumn(280, 580, 1.3)}
        ${drawColumn(880, 580, 1.3)}
        ${drawStatue(580, 610, 1.4)}
        ${drawAmphora(420, 650, 1.35)}
        ${drawAmphora(740, 650, 1.35)}
      `;
      break;
    case 19: // Vigília filosófica noturna (sage, lamp, column, scroll)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawColumn(880, 580, 1.35)}
        ${drawSage(480, 590, 1.45)}
        ${drawOilLamp(620, 650, 1.4)}
        ${drawScroll(360, 680, 1.35)}
      `;
      break;
    case 20: // Passeio sereno entre oliveiras (olive, path, book, sage)
      specificObjects = `
        ${drawStoneTerrace()}
        ${drawOliveTree(240, 560, 1.4)}
        ${drawOliveTree(940, 560, 1.4)}
        ${drawSage(580, 590, 1.45)}
        ${drawBook(440, 690, 1.35)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderEstoicismo${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Sajès</title>
  <desc>Ghibli anime art: ${scene.title} com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  \${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="${skyFill}" filter="url(#ghibliPaper)" />
  \${drawGhibliSun(${sx}, ${sy}, ${sr}, ${ssunset})}
  \${drawGhibliCloud(${sx > 600 ? 240 : 880}, ${sy > 200 ? 140 : 180}, 0.9, ${ssunset})}
  \${drawGhibliCloud(600, 120, 0.75, ${ssunset})}
  
  ${specificObjects}
</svg>\`;
}`;
}

const outContent = `import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderEstoicismo as renderEstoicismo01 } from "./master-scenes-2.mjs";

export { renderEstoicismo01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-estoicismo-variants.mjs"), outContent, "utf8");
console.log("theme-estoicismo-variants.mjs gerado com sucesso!");
