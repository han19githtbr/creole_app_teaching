import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Piquenique no parque", pal: "dia", sun: [920, 150, 50, false] },
  { num: 3, title: "Pipas no campo", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 4, title: "Passeio de bicicleta", pal: "dia", sun: [900, 140, 48, false] },
  { num: 5, title: "Tarde no lago", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 6, title: "Balanço no jardim", pal: "dia", sun: [940, 160, 50, false] },
  { num: 7, title: "Jogos ao ar livre", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 8, title: "Leitura sob a árvore", pal: "dia", sun: [880, 140, 48, false] },
  { num: 9, title: "Passeio entre flores", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 10, title: "Domingo no parque", pal: "dia", sun: [930, 150, 50, false] },
  { num: 11, title: "Revoada de pipas na colina", pal: "dia", sun: [890, 150, 48, false] },
  { num: 12, title: "Piquenique com cesta de vime", pal: "dia", sun: [920, 160, 50, false] },
  { num: 13, title: "Bicicleta no caminho florido", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 14, title: "Balanço de corda no bosque", pal: "dia", sun: [940, 150, 50, false] },
  { num: 15, title: "Lago dos patos ao entardecer", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 16, title: "Jogo de bola no gramado", pal: "dia", sun: [900, 140, 48, false] },
  { num: 17, title: "Cantinho de leitura no jardim", pal: "dia", sun: [920, 150, 50, false] },
  { num: 18, title: "Pipa colorida sobre os campos", pal: "sunset", sun: [820, 260, 52, true] },
  { num: 19, title: "Tarde ensolarada na lagoa", pal: "dia", sun: [880, 140, 48, false] },
  { num: 20, title: "Passeio de bicicleta no fim da tarde", pal: "sunset", sun: [600, 320, 56, true] },
];

function drawKite(x, y, scale = 1, color1 = "#ef4444", color2 = "#facc15") {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="${color1}" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="${color2}"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    ${[120, 180, 240, 300].map(by => `
      <polygon points="${20},-2+${by} ${10},-8+${by} ${10},4+${by}" fill="#f43f5e"/>
      <polygon points="${20},-2+${by} ${30},-8+${by} ${30},4+${by}" fill="#f43f5e"/>
      <circle cx="20" cy="${by-2}" r="3" fill="#facc15"/>
    `).join("")}
  </g>`;
}

function drawBicycle(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="80" ry="14" fill="#000000" opacity="0.3"/>
    <!-- Wheels -->
    <circle cx="-55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-55" cy="20" r="4" fill="#0f172a"/>
    ${[0, 45, 90, 135].map(deg => `<line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(${deg} -55 20)"/>`).join("")}
    
    <circle cx="55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="55" cy="20" r="4" fill="#0f172a"/>
    ${[0, 45, 90, 135].map(deg => `<line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(${deg} 55 20)"/>`).join("")}
    
    <!-- Vintage Turquoise Frame -->
    <line x1="-55" y1="20" x2="-10" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-55" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-25" y1="-20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="35" y1="-20" x2="55" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <!-- Handlebars and Wicker Basket -->
    <path d="M35,-20 L40,-45 Q45,-55 60,-50" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="42" y="-45" width="22" height="18" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
    <!-- Saddle -->
    <path d="M-35,-25 Q-25,-32 -15,-25" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  </g>`;
}

function drawBlanket(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    ${[-80, -40, 0, 40, 80].map(lx => `
      <line x1="${lx}" y1="-25" x2="${lx * 1.2}" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    `).join("")}
  </g>`;
}

function drawPicnicBasket(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <rect x="-35" y="-15" width="70" height="40" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-35" y1="-5" x2="35" y2="-5" stroke="#b45309" stroke-width="2"/>
    <line x1="-35" y1="10" x2="35" y2="10" stroke="#b45309" stroke-width="2"/>
    <!-- Basket handles -->
    <path d="M-20,-15 Q0,-45 20,-15" stroke="#78350f" stroke-width="4" fill="none"/>
    <!-- Red apple & baguette sticking out -->
    <circle cx="-12" cy="-18" r="8" fill="#ef4444"/>
    <rect x="5" y="-32" width="12" height="28" rx="5" fill="#f59e0b" transform="rotate(20 5 -32)"/>
  </g>`;
}

function drawSwing(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- High Overhanging Tree Branch -->
    <path d="M-80,-140 Q0,-125 120,-140" stroke="#451a03" stroke-width="18" fill="none"/>
    <!-- Hanging Ropes -->
    <line x1="-25" y1="-130" x2="-25" y2="20" stroke="#d97706" stroke-width="3"/>
    <line x1="25" y1="-130" x2="25" y2="20" stroke="#d97706" stroke-width="3"/>
    <!-- Wooden Seat Plank -->
    <rect x="-35" y="20" width="70" height="10" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
  </g>`;
}

function drawBall(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>`;
}

function drawDuck(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>`;
}

function drawLake() {
  return `<!-- Lake Basin -->
  <path d="M-50,560 Q300,510 650,550 T1250,530 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <ellipse cx="600" cy="670" rx="420" ry="90" fill="#5eead4" opacity="0.5"/>`;
}

function drawParkMeadow() {
  return `<!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>`;
}

function generateScene(scene) {
  const isNight = scene.pal === "night";
  const isSunset = scene.pal === "sunset";
  const skyFill = isNight ? "url(#skyDusk)" : isSunset ? "url(#skySunset)" : "url(#skyDay)";
  const [sx, sy, sr, ssunset] = scene.sun;
  const numPad = String(scene.num).padStart(2, "0");

  let specificObjects = "";

  switch (scene.num) {
    case 2: // Piquenique no parque (blanket, picnic, tree, flower)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawBlanket(550, 680, 1.4)}
        ${drawPicnicBasket(550, 670, 1.35)}
      `;
      break;
    case 3: // Pipas no campo (kite, tree, ball, flower)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawKite(420, 220, 1.35, "#ef4444", "#facc15")}
        ${drawKite(820, 180, 0.9, "#3b82f6", "#ec4899")}
        ${drawBall(280, 690, 1.35)}
      `;
      break;
    case 4: // Passeio de bicicleta (bike, tree, book, flower)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawBicycle(580, 640, 1.45)}
      `;
      break;
    case 5: // Tarde no lago (duck, blanket, book, tree)
      specificObjects = `
        ${drawLake()}
        ${drawDuck(420, 620, 1.3)}
        ${drawDuck(580, 640, 0.95)}
        ${drawBlanket(850, 690, 1.15)}
      `;
      break;
    case 6: // Balanço no jardim (swing, flower, tree, ball)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawSwing(550, 480, 1.45)}
        ${drawBall(820, 690, 1.3)}
      `;
      break;
    case 7: // Jogos ao ar livre (ball, picnic, kite, blanket)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawKite(780, 220, 1.25, "#f59e0b", "#10b981")}
        ${drawBlanket(380, 680, 1.3)}
        ${drawPicnicBasket(380, 670, 1.25)}
        ${drawBall(680, 690, 1.35)}
      `;
      break;
    case 8: // Leitura sob a árvore (book, tree, blanket, duck)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawBlanket(600, 680, 1.45)}
        ${drawDuck(260, 670, 1.3)}
      `;
      break;
    case 9: // Passeio entre flores (bike, flower, kite, tree)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawKite(340, 210, 1.2, "#8b5cf6", "#fef08a")}
        ${drawBicycle(650, 640, 1.4)}
      `;
      break;
    case 10: // Domingo no parque (swing, picnic, duck, ball)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawSwing(420, 480, 1.35)}
        ${drawPicnicBasket(780, 670, 1.35)}
        ${drawDuck(950, 680, 1.2)}
        ${drawBall(240, 690, 1.3)}
      `;
      break;
    case 11: // Revoada de pipas na colina (kite, tree, flower, ball)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawKite(360, 210, 1.35, "#ef4444", "#38bdf8")}
        ${drawKite(700, 180, 1.15, "#facc15", "#10b981")}
        ${drawKite(950, 240, 0.95, "#ec4899", "#fef08a")}
        ${drawBall(480, 690, 1.35)}
      `;
      break;
    case 12: // Piquenique com cesta de vime (picnic, blanket, tree, duck)
      specificObjects = `
        ${drawLake()}
        ${drawDuck(820, 620, 1.35)}
        ${drawDuck(920, 640, 0.9)}
        ${drawBlanket(440, 680, 1.4)}
        ${drawPicnicBasket(440, 670, 1.4)}
      `;
      break;
    case 13: // Bicicleta no caminho florido (bike, tree, flower, book)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawBicycle(580, 640, 1.5)}
      `;
      break;
    case 14: // Balanço de corda no bosque (swing, tree, blanket, flower)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawSwing(580, 480, 1.45)}
        ${drawBlanket(320, 690, 1.2)}
      `;
      break;
    case 15: // Lago dos patos ao entardecer (duck, tree, blanket, picnic)
      specificObjects = `
        ${drawLake()}
        ${drawDuck(480, 620, 1.4)}
        ${drawDuck(620, 640, 1.05)}
        ${drawBlanket(860, 680, 1.25)}
        ${drawPicnicBasket(860, 670, 1.2)}
      `;
      break;
    case 16: // Jogo de bola no gramado (ball, tree, bike, flower)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawBicycle(360, 640, 1.35)}
        ${drawBall(750, 670, 1.5)}
      `;
      break;
    case 17: // Cantinho de leitura no jardim (book, tree, blanket, swing)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawSwing(420, 480, 1.35)}
        ${drawBlanket(750, 680, 1.35)}
      `;
      break;
    case 18: // Pipa colorida sobre os campos (kite, flower, bike, ball)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawKite(480, 220, 1.45, "#dc2626", "#fde047")}
        ${drawBicycle(820, 640, 1.3)}
        ${drawBall(240, 690, 1.3)}
      `;
      break;
    case 19: // Tarde ensolarada na lagoa (duck, picnic, ball, tree)
      specificObjects = `
        ${drawLake()}
        ${drawDuck(420, 620, 1.35)}
        ${drawDuck(560, 635, 1.0)}
        ${drawPicnicBasket(820, 670, 1.35)}
        ${drawBall(250, 680, 1.3)}
      `;
      break;
    case 20: // Passeio de bicicleta no fim da tarde (bike, flower, kite, book)
      specificObjects = `
        ${drawParkMeadow()}
        ${drawKite(820, 230, 1.2, "#3b82f6", "#f59e0b")}
        ${drawBicycle(500, 640, 1.45)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderLazeres${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Lwazi</title>
  <desc>Ghibli anime art: ${scene.title} com pipas, passeios e momentos de lazer.</desc>
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
import { renderLazeres as renderLazeres01 } from "./master-scenes-2.mjs";

export { renderLazeres01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-lazeres-variants.mjs"), outContent, "utf8");
console.log("theme-lazeres-variants.mjs gerado com sucesso!");
