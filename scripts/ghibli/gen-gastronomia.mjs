import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Mercado de frutas", pal: "dia", sun: [920, 150, 50, false] },
  { num: 3, title: "Panela no fogão", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 4, title: "Mesa posta para o jantar", pal: "night", sun: [950, 180, 40, false] },
  { num: 5, title: "Pães recém-assados", pal: "dia", sun: [900, 140, 48, false] },
  { num: 6, title: "Colheita de pimentas", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 7, title: "Cozinha haitiana", pal: "dia", sun: [940, 160, 50, false] },
  { num: 8, title: "Café da manhã no campo", pal: "dia", sun: [880, 140, 48, false] },
  { num: 9, title: "Feira de legumes", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 10, title: "Banquete sob as lanternas", pal: "night", sun: [920, 190, 40, false] },
  { num: 11, title: "Fogão a lenha com caldeirão", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 12, title: "Pães artesanais crocantes", pal: "dia", sun: [930, 150, 50, false] },
  { num: 13, title: "Mesa com frutas tropicais", pal: "dia", sun: [890, 150, 48, false] },
  { num: 14, title: "Caldo saboroso na panela", pal: "dia", sun: [940, 160, 50, false] },
  { num: 15, title: "Mesa posta para banquete", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 16, title: "Banca de pimentas e temperos", pal: "dia", sun: [910, 140, 48, false] },
  { num: 17, title: "Café da manhã com pão e frutas", pal: "dia", sun: [920, 150, 50, false] },
  { num: 18, title: "Cozinhando ao ar livre no quintal", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 19, title: "Garrafas artesanais e pimentas", pal: "dia", sun: [880, 140, 48, false] },
  { num: 20, title: "Jantar especial acolhedor", pal: "night", sun: [950, 180, 40, false] },
];

function drawCookingPot(x, y, scale = 1, steaming = true) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    ${steaming ? `
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    ` : ""}
  </g>`;
}

function drawBreadBasket(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>`;
}

function drawPeppersCluster(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>`;
}

function drawTropicalFruits(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>`;
}

function drawTableSetting(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>`;
}

function drawBottles(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>`;
}

function drawVegetablesCrate(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
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
    case 2: // Mercado de frutas (fruit, vegetable, pepper, table)
      specificObjects = `
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawTableSetting(600, 620, 1.4)}
        ${drawTropicalFruits(460, 560, 1.4)}
        ${drawPeppersCluster(740, 570, 1.4)}
        ${drawVegetablesCrate(220, 680, 1.35)}
      `;
      break;
    case 3: // Panela no fogão (pot, vegetable, table, bottle)
      specificObjects = `
        <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        ${drawCookingPot(460, 560, 1.55, true)}
        ${drawBottles(760, 560, 1.4)}
        ${drawVegetablesCrate(220, 680, 1.3)}
      `;
      break;
    case 4: // Mesa posta para o jantar (table, plate, knife, fork)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#woodTone)"/>
        ${drawTableSetting(600, 600, 1.55)}
        ${drawBreadBasket(600, 540, 1.3)}
      `;
      break;
    case 5: // Pães recém-assados (bread, table, fruit, bottle)
      specificObjects = `
        <rect width="1200" height="800" fill="#fef9c3" filter="url(#ghibliPaper)" />
        <polygon points="-50,580 1250,580 1250,800 -50,800" fill="url(#woodTone)"/>
        ${drawTableSetting(600, 620, 1.4)}
        ${drawBreadBasket(480, 560, 1.5)}
        ${drawTropicalFruits(740, 560, 1.3)}
        ${drawBottles(940, 570, 1.3)}
      `;
      break;
    case 6: // Colheita de pimentas (pepper, vegetable, fruit, table)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTableSetting(600, 620, 1.35)}
        ${drawPeppersCluster(480, 570, 1.55)}
        ${drawTropicalFruits(720, 560, 1.35)}
      `;
      break;
    case 7: // Cozinha haitiana (pot, pepper, bread, vegetable)
      specificObjects = `
        <rect width="1200" height="800" fill="#fed7aa" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        ${drawCookingPot(440, 560, 1.5, true)}
        ${drawPeppersCluster(680, 580, 1.4)}
        ${drawBreadBasket(880, 570, 1.3)}
        ${drawVegetablesCrate(200, 670, 1.35)}
      `;
      break;
    case 8: // Café da manhã no campo (bread, fruit, plate, table)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTableSetting(600, 610, 1.45)}
        ${drawBreadBasket(460, 550, 1.4)}
        ${drawTropicalFruits(740, 550, 1.4)}
      `;
      break;
    case 9: // Feira de legumes (vegetable, bottle, pepper, fruit)
      specificObjects = `
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawTableSetting(600, 620, 1.4)}
        ${drawVegetablesCrate(440, 560, 1.35)}
        ${drawPeppersCluster(660, 570, 1.4)}
        ${drawBottles(840, 570, 1.35)}
      `;
      break;
    case 10: // Banquete sob as lanternas (plate, fork, pot, bread)
      specificObjects = `
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#334155"/>
        ${drawTableSetting(600, 610, 1.45)}
        ${drawCookingPot(600, 530, 1.4, true)}
        ${drawBreadBasket(380, 550, 1.3)}
      `;
      break;
    case 11: // Fogão a lenha com caldeirão (pot, vegetable, pepper, bottle)
      specificObjects = `
        <rect width="1200" height="800" fill="#f97316" opacity="0.3" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        ${drawCookingPot(480, 560, 1.6, true)}
        ${drawPeppersCluster(740, 570, 1.4)}
        ${drawBottles(880, 570, 1.35)}
        ${drawVegetablesCrate(240, 680, 1.35)}
      `;
      break;
    case 12: // Pães artesanais crocantes (bread, table, knife, fruit)
      specificObjects = `
        <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
        <polygon points="-50,580 1250,580 1250,800 -50,800" fill="url(#woodTone)"/>
        ${drawTableSetting(600, 610, 1.45)}
        ${drawBreadBasket(520, 540, 1.55)}
        ${drawTropicalFruits(800, 550, 1.35)}
      `;
      break;
    case 13: // Mesa com frutas tropicais (fruit, table, bottle, plate)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTableSetting(600, 610, 1.45)}
        ${drawTropicalFruits(560, 540, 1.55)}
        ${drawBottles(820, 560, 1.35)}
      `;
      break;
    case 14: // Caldo saboroso na panela (pot, pepper, vegetable, plate)
      specificObjects = `
        <rect width="1200" height="800" fill="#fed7aa" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        ${drawCookingPot(520, 560, 1.55, true)}
        ${drawPeppersCluster(780, 570, 1.45)}
        ${drawVegetablesCrate(240, 670, 1.35)}
      `;
      break;
    case 15: // Mesa posta para banquete (plate, fork, knife, bread)
      specificObjects = `
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawTableSetting(600, 600, 1.55)}
        ${drawBreadBasket(600, 530, 1.4)}
      `;
      break;
    case 16: // Banca de pimentas e temperos (pepper, bottle, vegetable, fruit)
      specificObjects = `
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawTableSetting(600, 620, 1.4)}
        ${drawPeppersCluster(460, 560, 1.6)}
        ${drawBottles(660, 560, 1.4)}
        ${drawVegetablesCrate(880, 560, 1.25)}
      `;
      break;
    case 17: // Café da manhã com pão e frutas (bread, fruit, plate, table)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTableSetting(600, 610, 1.45)}
        ${drawBreadBasket(480, 540, 1.45)}
        ${drawTropicalFruits(740, 540, 1.45)}
      `;
      break;
    case 18: // Cozinhando ao ar livre no quintal (pot, table, pepper, vegetable)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTableSetting(750, 620, 1.35)}
        ${drawCookingPot(420, 570, 1.5, true)}
        ${drawPeppersCluster(720, 570, 1.35)}
      `;
      break;
    case 19: // Garrafas artesanais e pimentas (bottle, pepper, knife, plate)
      specificObjects = `
        <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawTableSetting(600, 610, 1.45)}
        ${drawBottles(520, 560, 1.5)}
        ${drawPeppersCluster(720, 570, 1.45)}
      `;
      break;
    case 20: // Jantar especial acolhedor (table, plate, fork, pot)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#woodTone)"/>
        ${drawTableSetting(600, 600, 1.55)}
        ${drawCookingPot(600, 520, 1.35, true)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderGastronomia${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Manje</title>
  <desc>Ghibli anime art: ${scene.title} com panelas, frutas e comida saborosa haitiana.</desc>
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
import { renderGastronomia as renderGastronomia01 } from "./master-scenes-2.mjs";

export { renderGastronomia01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-gastronomia-variants.mjs"), outContent, "utf8");
console.log("theme-gastronomia-variants.mjs gerado com sucesso!");
