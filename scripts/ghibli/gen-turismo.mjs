import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Porto de veleiros", setting: "harbor", pal: "dia", sun: [900, 150, 48, false] },
  { num: 3, title: "Viagem de avião", setting: "airport", pal: "sunset", sun: [300, 260, 52, true] },
  { num: 4, title: "Passeio de balão", setting: "valley", pal: "dia", sun: [960, 160, 50, false] },
  { num: 5, title: "Travessia costeira", setting: "coast", pal: "sunset", sun: [820, 280, 54, true] },
  { num: 6, title: "Farol da ilha", setting: "island", pal: "night", sun: [920, 200, 42, false] },
  { num: 7, title: "Chegada ao hotel", setting: "town", pal: "dia", sun: [880, 140, 48, false] },
  { num: 8, title: "Descanso na praia", setting: "beach", pal: "dia", sun: [920, 160, 52, false] },
  { num: 9, title: "Roteiro pelas montanhas", setting: "mountain", pal: "sunset", sun: [320, 250, 50, true] },
  { num: 10, title: "Travessia pelo porto", setting: "harbor", pal: "night", sun: [850, 210, 44, false] },
  { num: 11, title: "Mirante sobre o oceano", setting: "cliff", pal: "dia", sun: [940, 150, 50, false] },
  { num: 12, title: "Voo panorâmico sobre o mar", setting: "sky", pal: "dia", sun: [860, 160, 48, false] },
  { num: 13, title: "Passeio de catamarã ao pôr do sol", setting: "coast", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 14, title: "Resort tropical à beira-mar", setting: "beach", pal: "dia", sun: [910, 140, 48, false] },
  { num: 15, title: "Farol sob as estrelas", setting: "island", pal: "night", sun: [980, 180, 40, false] },
  { num: 16, title: "Enseada dos pescadores", setting: "harbor", pal: "dia", sun: [930, 160, 50, false] },
  { num: 17, title: "Aeroporto na ilha caribenha", setting: "airport", pal: "dia", sun: [890, 150, 50, false] },
  { num: 18, title: "Aventura de balão no litoral", setting: "coast", pal: "sunset", sun: [340, 270, 52, true] },
  { num: 19, title: "Recepção elegante do hotel", setting: "town", pal: "sunset", sun: [820, 260, 52, true] },
  { num: 20, title: "Caminhada ao longo da falésia", setting: "cliff", pal: "dia", sun: [950, 150, 52, false] },
];

function drawBoat(x, y, scale = 1, type = 0) {
  if (type === 0) {
    return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
      <!-- Sloop Sailboat -->
      <ellipse cx="0" cy="50" rx="70" ry="14" fill="#0f766e" opacity="0.4"/>
      <path d="M-75,20 Q-50,55 0,55 Q50,55 75,20 L65,15 Q0,20 -65,15 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/>
      <path d="M-70,22 Q0,28 70,22 L68,30 Q0,35 -68,30 Z" fill="#ef4444"/>
      <line x1="0" y1="20" x2="0" y2="-130" stroke="#5a381e" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="15" x2="75" y2="8" stroke="#5a381e" stroke-width="3"/>
      <!-- Mainsail -->
      <path d="M0,-120 Q-30,-70 -55,-5 L0,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <line x1="0" y1="-65" x2="-30" y2="-65" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Jib sail -->
      <path d="M0,-110 Q35,-50 68,10 L0,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    </g>`;
  } else if (type === 1) {
    return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
      <!-- Catamaran / Twin Hull Boat -->
      <ellipse cx="0" cy="45" rx="80" ry="15" fill="#0f766e" opacity="0.4"/>
      <!-- Left hull -->
      <path d="M-65,25 Q-45,50 -20,50 L-15,22 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Right hull -->
      <path d="M20,22 L15,50 Q45,50 65,25 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Trampoline bridge -->
      <rect x="-25" y="20" width="50" height="10" fill="#3b82f6" rx="2"/>
      <!-- Mast & Twin striped sail -->
      <line x1="0" y1="20" x2="0" y2="-140" stroke="#334155" stroke-width="5"/>
      <path d="M0,-130 Q-40,-75 -65,-5 L0,5 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <path d="M0,-130 Q35,-75 60,-5 L0,5 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>
    </g>`;
  } else {
    return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
      <!-- Wooden Coastal Fishing Boat -->
      <ellipse cx="0" cy="35" rx="55" ry="12" fill="#0f766e" opacity="0.4"/>
      <path d="M-60,10 Q-35,40 0,40 Q35,40 60,10 L50,5 Q0,10 -50,5 Z" fill="#b45309" stroke="#78350f" stroke-width="2.5"/>
      <rect x="-20" y="5" width="40" height="12" fill="#d97706" rx="2"/>
      <!-- Small cabin and awning -->
      <rect x="5" y="-15" width="30" height="20" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <line x1="-30" y1="12" x2="-45" y2="-25" stroke="#78350f" stroke-width="3"/> <!-- Fishing rod -->
      <line x1="-45" y1="-25" x2="-20" y2="40" stroke="#38bdf8" stroke-width="1" opacity="0.8"/>
    </g>`;
  }
}

function drawLighthouse(x, y, scale = 1, night = false) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    ${[-18, -6, 6, 18].map(rx => `<line x1="${rx}" y1="-96" x2="${rx}" y2="-86" stroke="#1e293b" stroke-width="1.5"/>`).join("")}
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    ${night ? `<polygon points="0,-102 -700,-60 -700,80" fill="#fef08a" opacity="0.35" filter="url(#softGlow)"/>` : `<polygon points="0,-102 -500,-60 -500,60" fill="#fef08a" opacity="0.2" filter="url(#softGlow)"/>`}
  </g>`;
}

function drawBalloon(x, y, scale = 1, colors = ["#ef4444", "#facc15", "#3b82f6"]) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <path d="M0,-110 C-65,-110 -75,-45 -50,20 C-38,55 -20,85 -12,95 L12,95 C20,85 38,55 50,20 C75,-45 65,-110 0,-110 Z" fill="${colors[0]}" stroke="#7f1d1d" stroke-width="2"/>
    <path d="M-35,-102 C-52,-45 -30,45 -8,95 L8,95 C30,45 52,-45 35,-102 Z" fill="${colors[1]}"/>
    <path d="M-18,-108 C-26,-45 -14,45 -5,95 L5,95 C14,45 26,-45 18,-108 Z" fill="${colors[2]}"/>
    <line x1="-10" y1="95" x2="-6" y2="115" stroke="#475569" stroke-width="2"/>
    <line x1="10" y1="95" x2="6" y2="115" stroke="#475569" stroke-width="2"/>
    <ellipse cx="0" cy="106" rx="5" ry="8" fill="#f97316"/>
    <rect x="-12" y="115" width="24" height="18" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <line x1="-12" y1="123" x2="12" y2="123" stroke="#78350f" stroke-width="1.5"/>
  </g>`;
}

function drawAirplane(x, y, scale = 1, type = 0) {
  if (type === 0) {
    // Twin-prop Island Seaplane
    return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
      <ellipse cx="0" cy="0" rx="75" ry="18" fill="#ffffff" stroke="#334155" stroke-width="2.5"/>
      <path d="M-75,0 Q-40,-8 0,-8 Q40,-8 75,0" stroke="#0284c7" stroke-width="5" fill="none"/>
      <!-- Tail fin -->
      <polygon points="-75,-2 -55,-45 -40,-45 -55,-2" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <!-- Main high wings -->
      <polygon points="-15,-5 -10,-60 25,-60 15,-5" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      <polygon points="-15,5 -10,60 25,60 15,5" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      <!-- Propeller engines on wings -->
      <ellipse cx="5" cy="-35" rx="8" ry="12" fill="#0284c7"/>
      <line x1="5" y1="-55" x2="5" y2="-15" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="5" cy="35" rx="8" ry="12" fill="#0284c7"/>
      <line x1="5" y1="15" x2="5" y2="55" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      <!-- Windows -->
      ${[-25, -10, 5, 20, 35].map(wx => `<circle cx="${wx}" cy="-4" r="3.5" fill="#38bdf8"/>`).join("")}
      <!-- Cockpit windshield -->
      <path d="M50,-8 L65,-2 L50,0 Z" fill="#0284c7"/>
    </g>`;
  } else {
    // Jet airliner
    return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
      <ellipse cx="0" cy="0" rx="90" ry="16" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
      <path d="M-90,0 Q0,-6 85,0" stroke="#dc2626" stroke-width="4" fill="none"/>
      <!-- Swept wings -->
      <polygon points="-10,-3 15,-65 35,-65 20,-3" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <polygon points="-10,3 15,65 35,65 20,3" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
      <!-- Tail -->
      <polygon points="-90,-2 -70,-42 -55,-42 -68,-2" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
      <!-- Windows row -->
      ${[-40, -25, -10, 5, 20, 35, 50].map(wx => `<rect x="${wx}" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/>`).join("")}
    </g>`;
  }
}

function drawSuitcase(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>`;
}

function drawMap(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>`;
}

function drawHotel(x, y, scale = 1, variant = 0) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    ${[-60, -40, -20, 0, 20, 40, 60].map(bx => `<line x1="${bx}" y1="-15" x2="${bx}" y2="0" stroke="#0891b2" stroke-width="2"/>`).join("")}
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>`;
}

function drawMountainBackground() {
  return `<!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>`;
}

function drawOceanBackground() {
  return `<!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>`;
}

function drawBeachForeground() {
  return `<!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>`;
}

function generateScene(scene) {
  const isNight = scene.pal === "night";
  const isSunset = scene.pal === "sunset";
  const skyFill = isNight ? "url(#skyDusk)" : isSunset ? "url(#skySunset)" : "url(#skyDay)";
  const [sx, sy, sr, ssunset] = scene.sun;
  const numPad = String(scene.num).padStart(2, "0");

  let specificObjects = "";

  switch (scene.num) {
    case 2: // Porto de veleiros (boat, ocean, lighthouse, map)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawLighthouse(1020, 320, 0.9, false)}
        ${drawBoat(450, 560, 1.2, 0)}
        ${drawBoat(220, 520, 0.75, 1)}
        ${drawBeachForeground()}
        ${drawMap(320, 720, 1.3)}
      `;
      break;
    case 3: // Viagem de avião (airplane, suitcase, map, hotel)
      specificObjects = `
        ${drawMountainBackground()}
        <!-- Airport runway and apron -->
        <polygon points="-50,540 1250,540 1250,800 -50,800" fill="#475569"/>
        <line x1="0" y1="620" x2="1200" y2="620" stroke="#facc15" stroke-width="6" stroke-dasharray="40 30"/>
        ${drawHotel(920, 480, 0.85)}
        ${drawAirplane(520, 360, 1.25, 1)}
        ${drawSuitcase(220, 680, 1.3)}
        ${drawMap(340, 710, 1.1)}
      `;
      break;
    case 4: // Passeio de balão (balloon, mountain, map, hotel)
      specificObjects = `
        ${drawMountainBackground()}
        <path d="M-50,600 Q320,530 680,590 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawHotel(240, 590, 0.9)}
        ${drawBalloon(480, 240, 1.2, ["#ef4444", "#facc15", "#3b82f6"])}
        ${drawBalloon(880, 190, 0.7, ["#8b5cf6", "#ec4899", "#fef08a"])}
        ${drawMap(820, 690, 1.3)}
      `;
      break;
    case 5: // Travessia costeira (suitcase, ocean, boat, beach)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawBoat(720, 530, 1.1, 1)}
        ${drawBeachForeground()}
        ${drawSuitcase(340, 680, 1.4)}
      `;
      break;
    case 6: // Farol da ilha (lighthouse, boat, ocean, hotel)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawLighthouse(880, 330, 1.05, true)}
        ${drawHotel(260, 540, 0.8)}
        ${drawBoat(520, 590, 0.9, 0)}
      `;
      break;
    case 7: // Chegada ao hotel (hotel, suitcase, map, airplane)
      specificObjects = `
        ${drawMountainBackground()}
        <path d="M-50,600 Q400,550 800,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawAirplane(850, 180, 0.8, 1)}
        ${drawHotel(580, 530, 1.3)}
        ${drawSuitcase(280, 690, 1.35)}
        ${drawMap(380, 715, 1.1)}
      `;
      break;
    case 8: // Descanso na praia (beach, ocean, boat, balloon)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawBalloon(880, 200, 0.85, ["#ec4899", "#facc15", "#06b6d4"])}
        ${drawBoat(360, 550, 1.0, 0)}
        ${drawBeachForeground()}
      `;
      break;
    case 9: // Roteiro pelas montanhas (map, suitcase, hotel, mountain)
      specificObjects = `
        ${drawMountainBackground()}
        <path d="M-50,590 Q300,510 650,570 T1250,540 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,670 Q350,610 750,660 T1250,630 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawHotel(860, 590, 0.95)}
        ${drawSuitcase(260, 680, 1.3)}
        ${drawMap(420, 700, 1.4)}
      `;
      break;
    case 10: // Travessia pelo porto (boat, lighthouse, suitcase, ocean)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawLighthouse(980, 310, 0.95, true)}
        ${drawBoat(480, 560, 1.25, 0)}
        ${drawBeachForeground()}
        ${drawSuitcase(220, 690, 1.35)}
      `;
      break;
    case 11: // Mirante sobre o oceano (ocean, lighthouse, mountain, map)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawMountainBackground()}
        ${drawLighthouse(860, 340, 1.0, false)}
        ${drawBeachForeground()}
        ${drawMap(360, 710, 1.35)}
      `;
      break;
    case 12: // Voo panorâmico sobre o mar (balloon, airplane, ocean, mountain)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawMountainBackground()}
        ${drawBalloon(360, 220, 1.2, ["#3b82f6", "#f59e0b", "#10b981"])}
        ${drawAirplane(820, 260, 1.1, 0)}
      `;
      break;
    case 13: // Passeio de catamarã ao pôr do sol (boat, ocean, beach, mountain)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawMountainBackground()}
        ${drawBoat(620, 540, 1.3, 1)}
        ${drawBeachForeground()}
      `;
      break;
    case 14: // Resort tropical à beira-mar (hotel, beach, suitcase, boat)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawBoat(820, 510, 0.75, 0)}
        ${drawBeachForeground()}
        ${drawHotel(420, 580, 1.15)}
        ${drawSuitcase(720, 690, 1.3)}
      `;
      break;
    case 15: // Farol sob as estrelas (lighthouse, ocean, boat, map)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawLighthouse(880, 320, 1.1, true)}
        ${drawBoat(360, 570, 0.9, 2)}
        ${drawBeachForeground()}
        ${drawMap(220, 710, 1.3)}
      `;
      break;
    case 16: // Enseada dos pescadores (boat, beach, ocean, mountain)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawMountainBackground()}
        ${drawBoat(420, 540, 1.2, 2)}
        ${drawBoat(780, 520, 0.85, 0)}
        ${drawBeachForeground()}
      `;
      break;
    case 17: // Aeroporto na ilha caribenha (airplane, suitcase, mountain, hotel)
      specificObjects = `
        ${drawMountainBackground()}
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#334155"/>
        <line x1="0" y1="640" x2="1200" y2="640" stroke="#facc15" stroke-width="5" stroke-dasharray="35 25"/>
        ${drawHotel(260, 520, 0.9)}
        ${drawAirplane(680, 380, 1.2, 0)}
        ${drawSuitcase(940, 680, 1.3)}
      `;
      break;
    case 18: // Aventura de balão no litoral (balloon, ocean, beach, lighthouse)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawLighthouse(980, 320, 0.9, false)}
        ${drawBalloon(440, 240, 1.25, ["#f43f5e", "#fbbf24", "#38bdf8"])}
        ${drawBeachForeground()}
      `;
      break;
    case 19: // Recepção elegante do hotel (hotel, suitcase, map, boat)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawBoat(880, 490, 0.7, 1)}
        ${drawBeachForeground()}
        ${drawHotel(520, 560, 1.3)}
        ${drawSuitcase(240, 690, 1.35)}
        ${drawMap(340, 710, 1.15)}
      `;
      break;
    case 20: // Caminhada ao longo da falésia (mountain, ocean, lighthouse, beach)
      specificObjects = `
        ${drawOceanBackground()}
        ${drawMountainBackground()}
        ${drawLighthouse(780, 310, 1.1, false)}
        ${drawBeachForeground()}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderTurismo${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Touris</title>
  <desc>Ghibli anime art: ${scene.title} com elementos de turismo e mar caribenho.</desc>
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
import { renderTurismo as renderTurismo01 } from "./master-scenes-1.mjs";

export { renderTurismo01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-turismo-variants.mjs"), outContent, "utf8");
console.log("theme-turismo-variants.mjs gerado com sucesso!");
