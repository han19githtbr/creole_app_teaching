import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Vulcão na ilha", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 3, title: "Rio e ponte de pedra", pal: "dia", sun: [920, 150, 50, false] },
  { num: 4, title: "Exploração da floresta", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 5, title: "Mapa das montanhas", pal: "dia", sun: [900, 140, 48, false] },
  { num: 6, title: "Costa e arquipélago", pal: "dia", sun: [950, 160, 50, false] },
  { num: 7, title: "Travessia da garganta", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 8, title: "Mirante do vulcão", pal: "night", sun: [900, 200, 42, false] },
  { num: 9, title: "Nascente na floresta", pal: "dia", sun: [880, 150, 48, false] },
  { num: 10, title: "Bússola para a ilha", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 11, title: "Delta do grande rio", pal: "dia", sun: [930, 160, 50, false] },
  { num: 12, title: "Cume nevado e bandeira guia", pal: "dia", sun: [890, 140, 48, false] },
  { num: 13, title: "Lago da caldeira vulcânica", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 14, title: "Estreito marítimo e arquipélago", pal: "dia", sun: [940, 150, 50, false] },
  { num: 15, title: "Floresta equatorial densa", pal: "dia", sun: [900, 160, 48, false] },
  { num: 16, title: "Ponte suspensa no desfiladeiro", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 17, title: "Enseada do vulcão adormecido", pal: "night", sun: [950, 180, 40, false] },
  { num: 18, title: "Cartografia dos três picos", pal: "dia", sun: [920, 150, 50, false] },
  { num: 19, title: "Encontro das águas no manguezal", pal: "sunset", sun: [820, 260, 52, true] },
  { num: 20, title: "Vista aérea das ilhas caribenhas", pal: "dia", sun: [880, 140, 48, false] },
];

function drawCompass(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="${deg % 90 === 0 ? 3 : 1.5}" transform="rotate(${deg} 0 0)"/>
    `).join("")}
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>`;
}

function drawVolcano(x, y, scale = 1, active = true) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Mountain slopes -->
    <polygon points="-160,180 -40,-60 40,-60 160,180" fill="#44403c" stroke="#292524" stroke-width="3"/>
    <!-- Crater rim -->
    <ellipse cx="0" cy="-60" rx="42" ry="14" fill="#78350f" stroke="#b45309" stroke-width="2"/>
    ${active ? `
      <!-- Crater lava glow and smoke plume -->
      <ellipse cx="0" cy="-60" rx="28" ry="8" fill="#f97316"/>
      <ellipse cx="0" cy="-60" rx="14" ry="4" fill="#fef08a"/>
      <path d="M-15,-65 Q-30,-120 10,-170 Q40,-210 20,-260" stroke="#94a3b8" stroke-width="18" opacity="0.45" stroke-linecap="round" fill="none"/>
      <path d="M5,-65 Q25,-130 -5,-190 Q-25,-230 5,-280" stroke="#cbd5e1" stroke-width="12" opacity="0.55" stroke-linecap="round" fill="none"/>
    ` : `
      <ellipse cx="0" cy="-60" rx="28" ry="8" fill="#0284c7" opacity="0.8"/> <!-- Crater lake -->
    `}
  </g>`;
}

function drawBridge(x, y, scale = 1, type = 0) {
  if (type === 0) {
    // Stone Arch Bridge
    return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
      <!-- Deck -->
      <path d="M-130,-10 Q0,-35 130,-10 L130,25 Q0,5 -130,25 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
      <!-- Arch cutouts -->
      <path d="M-90,25 Q-60,-20 -30,25 Z" fill="#0f766e"/>
      <path d="M-20,25 Q10,-20 40,25 Z" fill="#0f766e"/>
      <path d="M50,25 Q80,-20 110,25 Z" fill="#0f766e"/>
      <!-- Railing -->
      <path d="M-130,-18 Q0,-43 130,-18" stroke="#78716c" stroke-width="4" fill="none"/>
    </g>`;
  } else {
    // Suspension Wooden Bridge
    return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
      <!-- Main cables -->
      <path d="M-140,-45 Q0,10 140,-45" stroke="#78350f" stroke-width="4" fill="none"/>
      <path d="M-140,-15 Q0,35 140,-15" stroke="#78350f" stroke-width="4" fill="none"/>
      <!-- Wooden planks -->
      ${[-100, -70, -40, -10, 20, 50, 80, 110].map(px => `
        <line x1="${px}" y1="-5" x2="${px}" y2="25" stroke="#92400e" stroke-width="3"/>
      `).join("")}
    </g>`;
  }
}

function drawRiver() {
  return `<!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>`;
}

function drawForestTrees(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})">
    ${[-60, -20, 20, 60, 100].map((tx, i) => `
      <g transform="translate(${tx}, ${(i % 2) * 15})">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    `).join("")}
  </g>`;
}

function drawIsland(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      ${[-50, -20, 10, 40].map(deg => `<path d="M0,0 Q${deg*1.4},-30 ${deg*2.2},-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>`;
}

function drawFlag(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>`;
}

function drawMapParchment(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
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
    case 2: // Vulcão na ilha (volcano, island, ocean, flag)
      specificObjects = `
        <path d="M-50,490 L1250,490 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        ${drawVolcano(600, 480, 1.4, true)}
        ${drawIsland(600, 680, 1.6)}
        ${drawFlag(600, 360, 1.1)}
      `;
      break;
    case 3: // Rio e ponte de pedra (river, bridge, mountain, map)
      specificObjects = `
        <path d="M-50,480 Q250,400 550,460 T1150,420 L1250,480 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <path d="M-50,540 Q300,480 650,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        ${drawRiver()}
        ${drawBridge(760, 580, 1.4, 0)}
        ${drawMapParchment(320, 700, 1.4)}
      `;
      break;
    case 4: // Exploração da floresta (forest, compass, river, flag)
      specificObjects = `
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        ${drawRiver()}
        ${drawForestTrees(220, 620, 1.3)}
        ${drawForestTrees(880, 640, 1.3)}
        ${drawCompass(420, 680, 1.35)}
        ${drawFlag(200, 480, 1.1)}
      `;
      break;
    case 5: // Mapa das montanhas (mountain, map, compass, river)
      specificObjects = `
        <path d="M-50,460 Q300,360 650,430 T1250,390 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.7"/>
        <path d="M-50,530 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        ${drawRiver()}
        ${drawMapParchment(400, 690, 1.5)}
        ${drawCompass(650, 690, 1.35)}
      `;
      break;
    case 6: // Costa e arquipélago (island, ocean, map, flag)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        ${drawIsland(320, 540, 1.3)}
        ${drawIsland(780, 580, 1.4)}
        ${drawFlag(300, 480, 1.0)}
        ${drawMapParchment(520, 710, 1.35)}
      `;
      break;
    case 7: // Travessia da garganta (bridge, river, mountain, compass)
      specificObjects = `
        <path d="M-50,460 Q320,380 680,440 T1250,400 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.7"/>
        <path d="M-50,520 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        ${drawRiver()}
        ${drawBridge(720, 590, 1.4, 1)}
        ${drawCompass(340, 690, 1.35)}
      `;
      break;
    case 8: // Mirante do vulcão (volcano, mountain, flag, map)
      specificObjects = `
        <path d="M-50,470 Q320,390 680,450 T1250,410 L1250,800 L-50,800 Z" fill="#1e293b"/>
        ${drawVolcano(600, 470, 1.35, true)}
        ${drawFlag(600, 350, 1.1)}
        ${drawMapParchment(360, 690, 1.4)}
      `;
      break;
    case 9: // Nascente na floresta (river, forest, bridge, ocean)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        ${drawForestTrees(240, 580, 1.3)}
        ${drawForestTrees(960, 580, 1.3)}
        ${drawRiver()}
        ${drawBridge(700, 600, 1.3, 0)}
      `;
      break;
    case 10: // Bússola para a ilha (compass, island, mountain, ocean)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,510 Q320,440 680,490 T1250,470 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.5"/>
        ${drawIsland(720, 560, 1.45)}
        ${drawCompass(360, 660, 1.45)}
      `;
      break;
    case 11: // Delta do grande rio (river, ocean, bridge, mountain)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,500 Q320,430 680,480 T1250,460 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        ${drawRiver()}
        ${drawBridge(650, 580, 1.35, 0)}
      `;
      break;
    case 12: // Cume nevado e bandeira guia (mountain, flag, compass, map)
      specificObjects = `
        <polygon points="-50,600 350,260 750,600" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
        <polygon points="350,600 800,240 1250,600" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawFlag(800, 240, 1.2)}
        ${drawCompass(340, 680, 1.35)}
        ${drawMapParchment(560, 690, 1.35)}
      `;
      break;
    case 13: // Lago da caldeira vulcânica (volcano, mountain, forest, flag)
      specificObjects = `
        <path d="M-50,500 Q320,430 680,480 T1250,460 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        ${drawVolcano(580, 500, 1.4, false)}
        ${drawForestTrees(180, 620, 1.3)}
        ${drawFlag(580, 390, 1.1)}
      `;
      break;
    case 14: // Estreito marítimo e arquipélago (island, ocean, compass, map)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        ${drawIsland(260, 540, 1.3)}
        ${drawIsland(650, 560, 1.2)}
        ${drawIsland(980, 540, 1.3)}
        ${drawCompass(420, 680, 1.35)}
        ${drawMapParchment(740, 690, 1.35)}
      `;
      break;
    case 15: // Floresta equatorial densa (forest, river, mountain, compass)
      specificObjects = `
        <path d="M-50,490 Q320,420 680,470 T1250,450 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        ${drawRiver()}
        ${drawForestTrees(160, 600, 1.35)}
        ${drawForestTrees(380, 620, 1.25)}
        ${drawForestTrees(960, 600, 1.35)}
        ${drawCompass(680, 680, 1.35)}
      `;
      break;
    case 16: // Ponte suspensa no desfiladeiro (bridge, mountain, river, forest)
      specificObjects = `
        <path d="M-50,460 Q320,380 680,440 T1250,400 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.7"/>
        <path d="M-50,520 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        ${drawRiver()}
        ${drawForestTrees(180, 610, 1.3)}
        ${drawBridge(720, 590, 1.45, 1)}
      `;
      break;
    case 17: // Enseada do vulcão adormecido (volcano, ocean, island, flag)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="#0f172a"/>
        ${drawVolcano(600, 470, 1.35, false)}
        ${drawIsland(600, 670, 1.5)}
        ${drawFlag(600, 360, 1.1)}
      `;
      break;
    case 18: // Cartografia dos três picos (map, compass, mountain, flag)
      specificObjects = `
        <polygon points="50,600 320,320 600,600" fill="url(#hillDistant)"/>
        <polygon points="320,600 620,270 920,600" fill="url(#hillDistant)"/>
        <polygon points="650,600 950,340 1200,600" fill="url(#hillDistant)"/>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFlag(620, 270, 1.15)}
        ${drawMapParchment(380, 690, 1.4)}
        ${drawCompass(640, 690, 1.35)}
      `;
      break;
    case 19: // Encontro das águas no manguezal (river, ocean, forest, bridge)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        ${drawForestTrees(220, 590, 1.3)}
        ${drawForestTrees(960, 590, 1.3)}
        ${drawRiver()}
        ${drawBridge(680, 610, 1.35, 0)}
      `;
      break;
    case 20: // Vista aérea das ilhas caribenhas (island, ocean, map, compass)
      specificObjects = `
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        ${drawIsland(250, 540, 1.3)}
        ${drawIsland(600, 530, 1.2)}
        ${drawIsland(940, 550, 1.35)}
        ${drawMapParchment(440, 690, 1.35)}
        ${drawCompass(720, 690, 1.35)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderGeografia${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Jewografi</title>
  <desc>Ghibli anime art: ${scene.title} com relevo, mapas e natureza geográfica.</desc>
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
import { renderGeografia as renderGeografia01 } from "./master-scenes-1.mjs";

export { renderGeografia01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-geografia-variants.mjs"), outContent, "utf8");
console.log("theme-geografia-variants.mjs gerado com sucesso!");
