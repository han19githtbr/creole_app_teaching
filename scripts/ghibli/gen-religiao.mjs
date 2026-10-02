import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Capela na montanha", pal: "dia", sun: [920, 150, 50, false] },
  { num: 3, title: "Velas ao anoitecer", pal: "night", sun: [950, 180, 40, false] },
  { num: 4, title: "Pomba sobre o jardim", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 5, title: "Sinos da igreja", pal: "dia", sun: [900, 140, 48, false] },
  { num: 6, title: "Interior da capela", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 7, title: "Caminho de flores", pal: "dia", sun: [940, 160, 50, false] },
  { num: 8, title: "Vitral iluminado", pal: "night", sun: [920, 190, 40, false] },
  { num: 9, title: "Pequena igreja da vila", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 10, title: "Celebração ao ar livre", pal: "dia", sun: [880, 140, 48, false] },
  { num: 11, title: "Campanário ao amanhecer", pal: "dia", sun: [930, 150, 50, false] },
  { num: 12, title: "Vitral gótico multicolorido", pal: "dia", sun: [890, 150, 48, false] },
  { num: 13, title: "Altar com velas e escrituras", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 14, title: "Revoada de pombas brancas", pal: "dia", sun: [940, 150, 50, false] },
  { num: 15, title: "Procissão com flores e velas", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 16, title: "Interior sereno do santuário", pal: "night", sun: [950, 180, 40, false] },
  { num: 17, title: "Capela costeira com cruz de pedra", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 18, title: "Grande sino de bronze", pal: "dia", sun: [910, 140, 48, false] },
  { num: 19, title: "Jardim de oração com lírios", pal: "dia", sun: [920, 150, 50, false] },
  { num: 20, title: "Vigília de velas sob as estrelas", pal: "night", sun: [960, 180, 40, false] },
];

function drawChurch(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    ${[0, 60, 120, 180, 240, 300].map(deg => `<line x1="0" y1="-45" x2="${Math.sin(deg*Math.PI/180)*24}" y2="${-45-Math.cos(deg*Math.PI/180)*24}" stroke="#facc15" stroke-width="2"/>`).join("")}
  </g>`;
}

function drawCross(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>`;
}

function drawCandlesCluster(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    ${[-30, 0, 30].map((cx, i) => {
      const h = [65, 85, 55][i];
      return `
        <rect x="${cx-6}" y="${h-80}" width="12" height="${80-h+20}" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="${cx}" y1="${h-80}" x2="${cx}" y2="${h-86}" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${h-94}" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="${cx}" cy="${h-94}" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="${cx}" cy="${h-94}" rx="2" ry="4" fill="#ffffff"/>
      `;
    }).join("")}
  </g>`;
}

function drawDove(x, y, scale = 1, angle = -10) {
  return `<g transform="translate(${x}, ${y}) scale(${scale}) rotate(${angle})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>`;
}

function drawRoseWindow(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="55" fill="#1e1b4b" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="48" fill="#0284c7" opacity="0.85"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const c = ["#ef4444", "#facc15", "#3b82f6", "#10b981"][i % 4];
      return `<path d="M0,0 Q${Math.sin(deg*Math.PI/180)*25},${-Math.cos(deg*Math.PI/180)*25} ${Math.sin(deg*Math.PI/180)*46},${-Math.cos(deg*Math.PI/180)*46}" stroke="${c}" stroke-width="7" fill="none"/>`;
    }).join("")}
    <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#78350f" stroke-width="2"/>
    <circle cx="0" cy="0" r="6" fill="#ef4444"/>
  </g>`;
}

function drawBell(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Yoke arch beam -->
    <rect x="-35" y="-55" width="70" height="15" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <circle cx="0" cy="-48" r="5" fill="#facc15"/>
    <!-- Polished Bronze Church Bell -->
    <path d="M-30,20 Q-32,-25 -14,-35 L14,-35 Q32,-25 30,20 L38,32 Q0,38 -38,32 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="38" r="7" fill="#78350f"/> <!-- Clapper -->
  </g>`;
}

function drawPews(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    ${[-120, -40, 40, 120].map(px => `
      <g transform="translate(${px}, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    `).join("")}
  </g>`;
}

function drawBible(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>`;
}

function drawWhiteLilies(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    ${[-25, 0, 25].map(fx => `
      <g transform="translate(${fx}, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    `).join("")}
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
    case 2: // Capela na montanha (church, cross, window, flower)
      specificObjects = `
        <path d="M-50,520 Q320,440 680,490 T1250,470 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <path d="M-50,590 Q350,540 750,590 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(540, 530, 1.35)}
        ${drawCross(860, 620, 1.3)}
        ${drawWhiteLilies(340, 680, 1.4)}
      `;
      break;
    case 3: // Velas ao anoitecer (candle, book, light, chair)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawCandlesCluster(600, 580, 1.6)}
        ${drawBible(420, 670, 1.45)}
        ${drawPews(600, 690, 1.2)}
      `;
      break;
    case 4: // Pomba sobre o jardim (dove, flower, church, light)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(260, 540, 1.05)}
        ${drawDove(600, 320, 1.45, -15)}
        ${drawWhiteLilies(720, 680, 1.4)}
        ${drawWhiteLilies(900, 680, 1.4)}
      `;
      break;
    case 5: // Sinos da igreja (bell, church, cross, window)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(500, 520, 1.35)}
        ${drawBell(880, 480, 1.5)}
        ${drawCross(280, 620, 1.3)}
      `;
      break;
    case 6: // Interior da capela (chair, candle, book, window)
      specificObjects = `
        <rect width="1200" height="800" fill="#1c1917" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawRoseWindow(600, 320, 1.4)}
        ${drawPews(600, 620, 1.4)}
        ${drawCandlesCluster(280, 650, 1.3)}
        ${drawBible(920, 670, 1.35)}
      `;
      break;
    case 7: // Caminho de flores (flower, cross, dove, church)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(860, 530, 1.15)}
        ${drawCross(320, 610, 1.4)}
        ${drawDove(520, 360, 1.35, 10)}
        ${drawWhiteLilies(500, 680, 1.4)}
      `;
      break;
    case 8: // Vitral iluminado (window, light, candle, book)
      specificObjects = `
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawRoseWindow(600, 340, 1.6)}
        ${drawCandlesCluster(420, 660, 1.4)}
        ${drawBible(780, 670, 1.4)}
      `;
      break;
    case 9: // Pequena igreja da vila (church, bell, chair, flower)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(540, 520, 1.4)}
        ${drawBell(240, 520, 1.3)}
        ${drawWhiteLilies(880, 680, 1.4)}
      `;
      break;
    case 10: // Celebração ao ar livre (dove, book, cross, candle)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawCross(600, 580, 1.5)}
        ${drawDove(340, 340, 1.4, -20)}
        ${drawCandlesCluster(450, 660, 1.35)}
        ${drawBible(780, 680, 1.4)}
      `;
      break;
    case 11: // Campanário ao amanhecer (bell, church, dove, cross)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(450, 520, 1.4)}
        ${drawBell(880, 480, 1.55)}
        ${drawDove(720, 320, 1.35, -15)}
      `;
      break;
    case 12: // Vitral gótico multicolorido (window, light, chair, cross)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawRoseWindow(600, 320, 1.5)}
        ${drawCross(600, 590, 1.35)}
        ${drawPews(600, 690, 1.35)}
      `;
      break;
    case 13: // Altar com velas e escrituras (candle, book, cross, flower)
      specificObjects = `
        <rect width="1200" height="800" fill="#1c1917" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawCross(600, 520, 1.45)}
        ${drawCandlesCluster(420, 650, 1.4)}
        ${drawCandlesCluster(780, 650, 1.4)}
        ${drawBible(600, 670, 1.5)}
      `;
      break;
    case 14: // Revoada de pombas brancas (dove, church, cross, bell)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(780, 530, 1.25)}
        ${drawDove(320, 320, 1.4, -25)}
        ${drawDove(480, 260, 1.2, -10)}
        ${drawDove(640, 340, 1.3, -15)}
        ${drawCross(220, 620, 1.35)}
      `;
      break;
    case 15: // Procissão com flores e velas (candle, flower, church, cross)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(860, 530, 1.15)}
        ${drawCross(340, 600, 1.4)}
        ${drawCandlesCluster(540, 660, 1.4)}
        ${drawWhiteLilies(700, 680, 1.35)}
      `;
      break;
    case 16: // Interior sereno do santuário (chair, candle, window, book)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        ${drawRoseWindow(600, 330, 1.45)}
        ${drawCandlesCluster(350, 650, 1.35)}
        ${drawBible(600, 670, 1.45)}
        ${drawPews(850, 690, 1.2)}
      `;
      break;
    case 17: // Capela costeira com cruz de pedra (church, cross, dove, light)
      specificObjects = `
        <path d="M-50,500 L1250,500 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawChurch(450, 520, 1.35)}
        ${drawCross(860, 610, 1.4)}
        ${drawDove(680, 360, 1.35, -15)}
      `;
      break;
    case 18: // Grande sino de bronze (bell, cross, dove, light)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawBell(600, 480, 1.7)}
        ${drawCross(240, 620, 1.3)}
        ${drawDove(920, 360, 1.35, -20)}
      `;
      break;
    case 19: // Jardim de oração com lírios (flower, dove, cross, church)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawChurch(260, 540, 1.15)}
        ${drawCross(600, 590, 1.4)}
        ${drawDove(820, 360, 1.3, -15)}
        ${drawWhiteLilies(420, 680, 1.4)}
        ${drawWhiteLilies(780, 680, 1.4)}
      `;
      break;
    case 20: // Vigília de velas sob as estrelas (candle, light, church, book)
      specificObjects = `
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="#0f172a"/>
        ${drawChurch(340, 540, 1.2)}
        ${drawCandlesCluster(700, 640, 1.55)}
        ${drawBible(880, 670, 1.4)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderReligiao${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Relijyon</title>
  <desc>Ghibli anime art: ${scene.title} com capelas históricas, fé e iluminação sagrada.</desc>
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
import { renderReligiao as renderReligiao01 } from "./master-scenes-2.mjs";

export { renderReligiao01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-religiao-variants.mjs"), outContent, "utf8");
console.log("theme-religiao-variants.mjs gerado com sucesso!");
