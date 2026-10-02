import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Colheita no campo", pal: "dia", sun: [920, 150, 50, false] },
  { num: 3, title: "Horta da fazenda", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 4, title: "Cabras perto do poço", pal: "dia", sun: [900, 140, 48, false] },
  { num: 5, title: "Casa entre árvores", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 6, title: "Trator na plantação", pal: "dia", sun: [950, 160, 50, false] },
  { num: 7, title: "Manhã no galinheiro", pal: "dia", sun: [880, 140, 48, false] },
  { num: 8, title: "Caminho da roça", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 9, title: "Jardim com poço antigo", pal: "dia", sun: [920, 150, 50, false] },
  { num: 10, title: "Fazenda ao pôr do sol", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 11, title: "Pastoreio no campo verde", pal: "dia", sun: [930, 160, 50, false] },
  { num: 12, title: "Pomar de frutas no sítio", pal: "dia", sun: [890, 150, 48, false] },
  { num: 13, title: "Descanso sob a figueira", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 14, title: "Galinheiro ao entardecer", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 15, title: "Manhã de arado na terra", pal: "dia", sun: [940, 150, 50, false] },
  { num: 16, title: "Poço de água na encosta", pal: "dia", sun: [900, 160, 48, false] },
  { num: 17, title: "Celeiro e fardos de trigo", pal: "sunset", sun: [820, 260, 52, true] },
  { num: 18, title: "Cabritos brincando na cerca", pal: "dia", sun: [920, 150, 50, false] },
  { num: 19, title: "Horta irrigada ao amanhecer", pal: "dia", sun: [880, 140, 48, false] },
  { num: 20, title: "Noite serena na fazenda", pal: "night", sun: [950, 180, 40, false] },
];

function drawTractor(x, y, scale = 1, color = "#16a34a") {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Tractor shadow -->
    <ellipse cx="0" cy="50" rx="90" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Engine chassis -->
    <path d="M-80,15 L-30,15 L-30,-25 L-80,-15 Z" fill="${color}" stroke="#14532d" stroke-width="2.5"/>
    <rect x="-75" y="-12" width="20" height="20" fill="#334155"/> <!-- Radiator grill -->
    <!-- Exhaust pipe with smoke puff -->
    <line x1="-65" y1="-25" x2="-65" y2="-55" stroke="#1e293b" stroke-width="4"/>
    <ellipse cx="-65" cy="-62" rx="6" ry="4" fill="#cbd5e1" opacity="0.6"/>
    <!-- Hood and cabin -->
    <rect x="-30" y="-45" width="60" height="60" fill="${color}" stroke="#14532d" stroke-width="2.5"/>
    <!-- Steering wheel and seat -->
    <circle cx="5" cy="-35" r="10" fill="none" stroke="#0f172a" stroke-width="3"/>
    <rect x="15" y="-30" width="16" height="20" rx="3" fill="#78350f"/>
    <!-- Big Rear Wheel -->
    <circle cx="35" cy="20" r="38" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <circle cx="35" cy="20" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="35" cy="20" r="8" fill="#1e293b"/>
    <!-- Small Front Wheel -->
    <circle cx="-65" cy="30" r="22" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="-65" cy="30" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  </g>`;
}

function drawGoat(x, y, scale = 1, flip = false) {
  const t = flip ? `translate(${x}, ${y}) scale(${-scale}, ${scale})` : `translate(${x}, ${y}) scale(${scale})`;
  return `<g transform="${t}" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

function drawChicken(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>`;
}

function drawWell(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="35" rx="55" ry="15" fill="#000000" opacity="0.3"/>
    <!-- Stone Base -->
    <path d="M-45,30 L-40,-15 Q0,-22 40,-15 L45,30 Q0,40 -45,30 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <ellipse cx="0" cy="-15" rx="40" ry="12" fill="#0284c7" stroke="#334155" stroke-width="2"/>
    <!-- Wooden posts -->
    <rect x="-35" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="27" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-48,-85 0,-125 48,-85" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <!-- Wooden crossbeam, spool & bucket -->
    <line x1="-30" y1="-75" x2="30" y2="-75" stroke="#78350f" stroke-width="5"/>
    <line x1="0" y1="-75" x2="0" y2="-40" stroke="#facc15" stroke-width="2"/>
    <rect x="-10" y="-40" width="20" height="18" rx="2" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
  </g>`;
}

function drawFence(x, y, scale = 1, length = 3) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="${length * 60 + 10}" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="${length * 60 + 10}" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    ${Array.from({ length: length + 1 }, (_, i) => `
      <polygon points="${i*60-6},15 ${i*60-6},-45 ${i*60},-52 ${i*60+6},-45 ${i*60+6},15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    `).join("")}
  </g>`;
}

function drawWheatField(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})">
    ${[0, 20, 40, 60, 80, 100, 120, 140, 160].map(wx => `
      <path d="M${wx},30 Q${wx-5},-30 ${wx+5},-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="${wx+5}" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="${wx+5}" y1="-85" x2="${wx+8}" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    `).join("")}
  </g>`;
}

function drawGardenBeds(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Rich soil mounds -->
    <ellipse cx="0" cy="0" rx="90" ry="24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="0" cy="40" rx="100" ry="26" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Cabbage & lettuce heads -->
    ${[-60, -20, 20, 60].map(cx => `
      <circle cx="${cx}" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="${cx}" cy="-2" r="7" fill="#86efac"/>
    `).join("")}
    <!-- Carrots / tomatoes -->
    ${[-70, -35, 0, 35, 70].map(tx => `
      <circle cx="${tx}" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="${tx-2},30 ${tx+2},30 ${tx},25" fill="#15803d"/>
    `).join("")}
  </g>`;
}

function drawFarmhouse(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>`;
}

function drawTree(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
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
    case 2: // Colheita no campo (wheat, tractor, farm, tree)
      specificObjects = `
        <path d="M-50,520 Q320,450 680,500 T1250,480 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <path d="M-50,570 Q280,510 600,560 T1250,530 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        ${drawFarmhouse(220, 560, 0.85)}
        ${drawTree(1020, 560, 1.2)}
        ${drawWheatField(420, 660, 1.4)}
        ${drawTractor(680, 640, 1.25)}
      `;
      break;
    case 3: // Horta da fazenda (garden, farm, fence, chicken)
      specificObjects = `
        <path d="M-50,540 Q350,470 750,530 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q300,560 650,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFarmhouse(880, 550, 0.9)}
        ${drawFence(150, 620, 1.1, 4)}
        ${drawGardenBeds(420, 680, 1.3)}
        ${drawChicken(250, 710, 1.3)}
        ${drawChicken(740, 720, 1.1)}
      `;
      break;
    case 4: // Cabras perto do poço (goat, well, tree, fence)
      specificObjects = `
        <path d="M-50,540 Q350,470 750,530 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q300,560 650,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(180, 580, 1.3)}
        ${drawFence(350, 600, 1.1, 3)}
        ${drawWell(720, 620, 1.3)}
        ${drawGoat(450, 680, 1.3)}
        ${drawGoat(920, 670, 1.1, true)}
      `;
      break;
    case 5: // Casa entre árvores (house, tree, garden, chicken)
      specificObjects = `
        <path d="M-50,520 Q320,460 680,510 T1250,480 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q400,550 800,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(220, 560, 1.35)}
        ${drawTree(980, 550, 1.25)}
        ${drawFarmhouse(600, 540, 1.2)}
        ${drawGardenBeds(350, 690, 1.2)}
        ${drawChicken(820, 710, 1.3)}
      `;
      break;
    case 6: // Trator na plantação (tractor, wheat, fence, goat)
      specificObjects = `
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFence(100, 590, 1.1, 4)}
        ${drawWheatField(720, 620, 1.4)}
        ${drawTractor(460, 640, 1.3)}
        ${drawGoat(220, 680, 1.25)}
      `;
      break;
    case 7: // Manhã no galinheiro (chicken, farm, well, tree)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFarmhouse(280, 550, 1.05)}
        ${drawTree(1000, 560, 1.3)}
        ${drawWell(820, 640, 1.25)}
        ${drawChicken(500, 690, 1.35)}
        ${drawChicken(620, 710, 1.15)}
      `;
      break;
    case 8: // Caminho da roça (house, wheat, goat, fence)
      specificObjects = `
        <path d="M-50,520 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,540 750,590 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFarmhouse(880, 540, 0.95)}
        ${drawFence(200, 600, 1.15, 3)}
        ${drawWheatField(580, 640, 1.3)}
        ${drawGoat(350, 680, 1.3)}
      `;
      break;
    case 9: // Jardim com poço antigo (garden, well, house, tree)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(180, 570, 1.35)}
        ${drawFarmhouse(860, 540, 1.05)}
        ${drawWell(480, 630, 1.3)}
        ${drawGardenBeds(720, 690, 1.25)}
      `;
      break;
    case 10: // Fazenda ao pôr do sol (farm, tractor, chicken, wheat)
      specificObjects = `
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFarmhouse(280, 540, 1.15)}
        ${drawWheatField(800, 630, 1.3)}
        ${drawTractor(620, 640, 1.2)}
        ${drawChicken(450, 710, 1.3)}
      `;
      break;
    case 11: // Pastoreio no campo verde (goat, fence, tree, wheat)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(960, 560, 1.3)}
        ${drawFence(150, 600, 1.1, 4)}
        ${drawWheatField(650, 630, 1.25)}
        ${drawGoat(340, 680, 1.35)}
        ${drawGoat(520, 690, 1.1, true)}
      `;
      break;
    case 12: // Pomar de frutas no sítio (tree, garden, house, chicken)
      specificObjects = `
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(220, 560, 1.3)}
        ${drawTree(460, 570, 1.15)}
        ${drawFarmhouse(880, 540, 1.05)}
        ${drawGardenBeds(650, 690, 1.2)}
        ${drawChicken(340, 710, 1.3)}
      `;
      break;
    case 13: // Descanso sob a figueira (tree, well, farm, fence)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(280, 560, 1.4)}
        ${drawFarmhouse(900, 550, 0.95)}
        ${drawFence(600, 610, 1.05, 3)}
        ${drawWell(480, 640, 1.25)}
      `;
      break;
    case 14: // Galinheiro ao entardecer (chicken, fence, house, tree)
      specificObjects = `
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFarmhouse(260, 540, 1.1)}
        ${drawTree(980, 560, 1.25)}
        ${drawFence(480, 600, 1.1, 4)}
        ${drawChicken(620, 690, 1.35)}
        ${drawChicken(760, 705, 1.2)}
      `;
      break;
    case 15: // Manhã de arado na terra (tractor, farm, wheat, tree)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(160, 570, 1.3)}
        ${drawFarmhouse(880, 540, 1.0)}
        ${drawWheatField(720, 640, 1.3)}
        ${drawTractor(460, 640, 1.35, "#2563eb")}
      `;
      break;
    case 16: // Poço de água na encosta (well, goat, tree, garden)
      specificObjects = `
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(180, 560, 1.35)}
        ${drawWell(520, 630, 1.3)}
        ${drawGardenBeds(820, 670, 1.25)}
        ${drawGoat(340, 680, 1.3)}
      `;
      break;
    case 17: // Celeiro e fardos de trigo (wheat, tractor, farm, fence)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFarmhouse(860, 540, 1.15)}
        ${drawFence(150, 600, 1.1, 3)}
        ${drawWheatField(380, 630, 1.4)}
        ${drawTractor(620, 640, 1.25, "#dc2626")}
      `;
      break;
    case 18: // Cabritos brincando na cerca (goat, fence, house, chicken)
      specificObjects = `
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawFarmhouse(240, 540, 1.1)}
        ${drawFence(480, 610, 1.15, 4)}
        ${drawGoat(620, 680, 1.3)}
        ${drawGoat(800, 690, 1.05, true)}
        ${drawChicken(400, 715, 1.2)}
      `;
      break;
    case 19: // Horta irrigada ao amanhecer (garden, well, chicken, tree)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawTree(160, 560, 1.35)}
        ${drawWell(780, 630, 1.25)}
        ${drawGardenBeds(420, 680, 1.3)}
        ${drawChicken(650, 710, 1.3)}
      `;
      break;
    case 20: // Noite serena na fazenda (house, tree, fence, farm)
      specificObjects = `
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="#1e293b"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="#0f172a"/>
        ${drawTree(200, 560, 1.3)}
        ${drawFarmhouse(600, 540, 1.25)}
        ${drawFence(780, 610, 1.1, 3)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderInterior${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Andeyò</title>
  <desc>Ghibli anime art: ${scene.title} no interior campestre haitiano.</desc>
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
import { renderInterior as renderInterior01 } from "./master-scenes-1.mjs";

export { renderInterior01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-interior-variants.mjs"), outContent, "utf8");
console.log("theme-interior-variants.mjs gerado com sucesso!");
