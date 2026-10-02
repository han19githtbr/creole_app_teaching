import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Escavação arqueológica", pal: "dia", sun: [920, 150, 50, false] },
  { num: 3, title: "Caravela histórica", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 4, title: "Portões da fortaleza", pal: "night", sun: [920, 190, 42, false] },
  { num: 5, title: "Cavaleiros no castelo", pal: "dia", sun: [900, 140, 50, false] },
  { num: 6, title: "Monumento da praça", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 7, title: "Biblioteca antiga", pal: "night", sun: [950, 180, 40, false] },
  { num: 8, title: "Muralhas e canhões", pal: "dia", sun: [940, 160, 50, false] },
  { num: 9, title: "Ruínas de pedra", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 10, title: "Praça dos heróis", pal: "dia", sun: [880, 140, 48, false] },
  { num: 11, title: "Bastilha da cidadela sob o sol", pal: "dia", sun: [930, 150, 50, false] },
  { num: 12, title: "Nau capitânia no ancoradouro", pal: "dia", sun: [890, 150, 48, false] },
  { num: 13, title: "Manuscrito dos patriotas", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 14, title: "Sentinela a cavalo na colina", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 15, title: "Obelisco da independência", pal: "dia", sun: [940, 140, 50, false] },
  { num: 16, title: "Mansão colonial preservada", pal: "dia", sun: [900, 150, 48, false] },
  { num: 17, title: "Canhoneira na muralha alta", pal: "sunset", sun: [820, 260, 52, true] },
  { num: 18, title: "Arquivo de tratados históricos", pal: "dia", sun: [910, 140, 48, false] },
  { num: 19, title: "Tochas acesas na fortaleza", pal: "night", sun: [950, 180, 40, false] },
  { num: 20, title: "Cerimônia junto ao monumento", pal: "sunset", sun: [600, 320, 56, true] },
];

function drawCannon(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="20" cy="50" rx="90" ry="18" fill="#000000" opacity="0.4"/>
    <rect x="-35" y="5" width="100" height="38" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <circle cx="-20" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="55" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <polygon points="-60,5 95,-28 97,-6 -60,20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2.5"/>
    <circle cx="-65" cy="12" r="12" fill="#785315"/>
    <!-- Stack of cannonballs -->
    <g transform="translate(115, 25)">
      <circle cx="0" cy="15" r="10" fill="#1c1917"/>
      <circle cx="18" cy="15" r="10" fill="#1c1917"/>
      <circle cx="9" cy="-2" r="10" fill="#292524"/>
    </g>
  </g>`;
}

function drawTorch(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>`;
}

function drawHorse(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>`;
}

function drawMonument(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>`;
}

function drawBook(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Open Antique Leather Manuscript -->
    <path d="M-65,-10 Q-30,-25 0,-15 Q30,-25 65,-10 L60,35 Q30,20 0,30 Q-30,20 -60,35 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-15" x2="0" y2="30" stroke="#78350f" stroke-width="2"/>
    <!-- Text Lines -->
    ${[-5, 5, 15].map(ly => `
      <line x1="-50" y1="${ly}" x2="-10" y2="${ly}" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="${ly}" x2="50" y2="${ly}" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    `).join("")}
  </g>`;
}

function drawFortressWalls(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    ${[-150, -100, -50, 0, 50, 100].map(cx => `<rect x="${cx}" y="-80" width="25" height="22" fill="#78716c"/>`).join("")}
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>`;
}

function drawOldHouse(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>`;
}

function drawHistoricShip(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Caravel Wooden Hull -->
    <path d="M-100,20 Q-70,60 0,60 Q70,60 100,10 L90,0 Q0,10 -85,0 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <!-- High Stern Castle -->
    <rect x="-90" y="-25" width="35" height="35" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- Masts -->
    <line x1="-30" y1="20" x2="-30" y2="-130" stroke="#451a03" stroke-width="6"/>
    <line x1="30" y1="20" x2="30" y2="-150" stroke="#451a03" stroke-width="6"/>
    <!-- Square sails with red cross -->
    <rect x="-70" y="-120" width="80" height="65" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <line x1="-30" y1="-120" x2="-30" y2="-55" stroke="#dc2626" stroke-width="5"/>
    <line x1="-60" y1="-88" x2="0" y2="-88" stroke="#dc2626" stroke-width="5"/>
  </g>`;
}

function generateScene(scene) {
  const isNight = scene.pal === "night";
  const isSunset = scene.pal === "sunset";
  const skyFill = isNight ? "url(#skyDusk)" : isSunset ? "url(#skySunset)" : "url(#skyDay)";
  const [sx, sy, sr, ssunset] = scene.sun;
  const numPad = String(scene.num).padStart(2, "0");

  let specificObjects = "";

  switch (scene.num) {
    case 2: // Escavação arqueológica (stone, book, monument, oldhouse)
      specificObjects = `
        <path d="M-50,540 L1250,540 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawOldHouse(920, 520, 0.95)}
        ${drawMonument(320, 560, 1.25)}
        ${drawBook(640, 680, 1.4)}
      `;
      break;
    case 3: // Caravela histórica (boat, flag, stone, torch)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,650 L1250,650 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawHistoricShip(560, 480, 1.35)}
        ${drawTorch(200, 590, 1.3)}
        ${drawTorch(950, 590, 1.3)}
      `;
      break;
    case 4: // Portões da fortaleza (fortress, torch, cannon, flag)
      specificObjects = `
        ${drawFortressWalls(600, 480, 1.6)}
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawTorch(250, 520, 1.4)}
        ${drawTorch(950, 520, 1.4)}
        ${drawCannon(580, 650, 1.3)}
      `;
      break;
    case 5: // Cavaleiros no castelo (horse, fortress, flag, stone)
      specificObjects = `
        ${drawFortressWalls(780, 470, 1.4)}
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawHorse(360, 620, 1.4)}
      `;
      break;
    case 6: // Monumento da praça (monument, flag, book, oldhouse)
      specificObjects = `
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawOldHouse(240, 520, 1.0)}
        ${drawOldHouse(960, 520, 1.0)}
        ${drawMonument(600, 560, 1.35)}
        ${drawBook(420, 700, 1.3)}
      `;
      break;
    case 7: // Biblioteca antiga (book, torch, stone, monument)
      specificObjects = `
        <rect width="1200" height="800" fill="#292524" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawTorch(200, 420, 1.4)}
        ${drawTorch(1000, 420, 1.4)}
        ${drawMonument(820, 540, 0.9)}
        ${drawBook(540, 660, 1.6)}
      `;
      break;
    case 8: // Muralhas e canhões (cannon, fortress, horse, flag)
      specificObjects = `
        ${drawFortressWalls(600, 470, 1.5)}
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawHorse(280, 630, 1.3)}
        ${drawCannon(720, 640, 1.35)}
      `;
      break;
    case 9: // Ruínas de pedra (stone, oldhouse, torch, book)
      specificObjects = `
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawOldHouse(840, 530, 1.1)}
        ${drawTorch(300, 560, 1.35)}
        ${drawBook(540, 680, 1.4)}
      `;
      break;
    case 10: // Praça dos heróis (monument, horse, flag, fortress)
      specificObjects = `
        ${drawFortressWalls(850, 480, 1.2)}
        <path d="M-50,580 L1250,580 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawMonument(480, 550, 1.35)}
        ${drawHorse(240, 640, 1.3)}
      `;
      break;
    case 11: // Bastilha da cidadela sob o sol (fortress, flag, cannon, stone)
      specificObjects = `
        ${drawFortressWalls(600, 460, 1.6)}
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawCannon(400, 650, 1.35)}
        ${drawCannon(800, 650, 1.35)}
      `;
      break;
    case 12: // Nau capitânia no ancoradouro (boat, stone, flag, torch)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawHistoricShip(620, 490, 1.4)}
        ${drawTorch(240, 580, 1.35)}
      `;
      break;
    case 13: // Manuscrito dos patriotas (book, torch, oldhouse, stone)
      specificObjects = `
        <path d="M-50,550 L1250,550 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawOldHouse(300, 520, 1.15)}
        ${drawTorch(950, 500, 1.4)}
        ${drawBook(640, 670, 1.5)}
      `;
      break;
    case 14: // Sentinela a cavalo na colina (horse, flag, fortress, stone)
      specificObjects = `
        ${drawFortressWalls(850, 470, 1.3)}
        <path d="M-50,570 Q350,500 750,550 T1250,530 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawHorse(450, 620, 1.45)}
      `;
      break;
    case 15: // Obelisco da independência (monument, flag, stone, horse)
      specificObjects = `
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawMonument(600, 540, 1.45)}
        ${drawHorse(280, 640, 1.3)}
      `;
      break;
    case 16: // Mansão colonial preservada (oldhouse, horse, stone, monument)
      specificObjects = `
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawOldHouse(550, 520, 1.3)}
        ${drawMonument(920, 560, 1.0)}
        ${drawHorse(240, 640, 1.3)}
      `;
      break;
    case 17: // Canhoneira na muralha alta (cannon, fortress, torch, flag)
      specificObjects = `
        ${drawFortressWalls(600, 470, 1.55)}
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawCannon(550, 640, 1.4)}
        ${drawTorch(950, 520, 1.4)}
      `;
      break;
    case 18: // Arquivo de tratados históricos (book, oldhouse, monument, stone)
      specificObjects = `
        <path d="M-50,550 L1250,550 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawOldHouse(250, 520, 1.05)}
        ${drawMonument(880, 550, 1.15)}
        ${drawBook(560, 670, 1.45)}
      `;
      break;
    case 19: // Tochas acesas na fortaleza (torch, fortress, cannon, flag)
      specificObjects = `
        ${drawFortressWalls(600, 470, 1.55)}
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawTorch(200, 500, 1.4)}
        ${drawTorch(550, 480, 1.4)}
        ${drawTorch(900, 500, 1.4)}
        ${drawCannon(700, 650, 1.35)}
      `;
      break;
    case 20: // Cerimônia junto ao monumento (monument, flag, horse, oldhouse)
      specificObjects = `
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawOldHouse(880, 530, 1.1)}
        ${drawMonument(540, 550, 1.4)}
        ${drawHorse(250, 640, 1.3)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderHistoria${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Istwa</title>
  <desc>Ghibli anime art: ${scene.title} com fortalezas, canhões e patrimônio histórico.</desc>
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
import { renderHistoria as renderHistoria01 } from "./master-scenes-2.mjs";

export { renderHistoria01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-historia-variants.mjs"), outContent, "utf8");
console.log("theme-historia-variants.mjs gerado com sucesso!");
