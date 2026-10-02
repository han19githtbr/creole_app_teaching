import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Cinema ao ar livre", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 3, title: "Cabine de projeção", pal: "night", sun: [950, 180, 40, false] },
  { num: 4, title: "Noite de estreia", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 5, title: "Filmagem no bosque", pal: "dia", sun: [920, 150, 50, false] },
  { num: 6, title: "Sala de cinema clássica", pal: "night", sun: [900, 200, 42, false] },
  { num: 7, title: "Festival de curtas", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 8, title: "Projetor sob as estrelas", pal: "night", sun: [920, 190, 40, false] },
  { num: 9, title: "Bilheteria do cinema", pal: "dia", sun: [880, 140, 48, false] },
  { num: 10, title: "Estúdio de gravação", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 11, title: "Cineclube na praça florida", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 12, title: "Rolo de filme e câmera retrô", pal: "dia", sun: [930, 150, 50, false] },
  { num: 13, title: "Sacola de pipoca e ingressos", pal: "dia", sun: [890, 150, 48, false] },
  { num: 14, title: "Sessão cinema na praia à noite", pal: "night", sun: [960, 180, 42, false] },
  { num: 15, title: "Iluminação de cena no estúdio", pal: "dia", sun: [940, 160, 50, false] },
  { num: 16, title: "Fachada neon do cinema", pal: "night", sun: [900, 190, 40, false] },
  { num: 17, title: "Filmagem no jardim arborizado", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 18, title: "Sala com poltronas confortáveis", pal: "night", sun: [920, 190, 40, false] },
  { num: 19, title: "Projetor no piquenique do parque", pal: "sunset", sun: [340, 290, 52, true] },
  { num: 20, title: "Noite de gala do festival", pal: "night", sun: [950, 180, 40, false] },
];

function drawCinemaBuilding(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Art Deco Cinema Facade -->
    <rect x="-110" y="-120" width="220" height="200" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <!-- Marquee Canopy with neon bulbs -->
    <polygon points="-125,-60 125,-60 100,-10 -100,-10" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    ${[-90, -60, -30, 0, 30, 60, 90].map(lx => `<circle cx="${lx}" cy="-15" r="5" fill="#fef08a"/>`).join("")}
    <!-- Glowing "SINEMA" sign -->
    <rect x="-80" y="-105" width="160" height="35" rx="6" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
    <text x="0" y="-81" font-family="sans-serif" font-weight="900" font-size="20" fill="#facc15" text-anchor="middle" letter-spacing="4">SINEMA</text>
    <!-- Entrance Doors -->
    <rect x="-40" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="5" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Posters in glass frames -->
    <rect x="-95" y="5" width="35" height="55" rx="2" fill="#38bdf8" stroke="#facc15" stroke-width="1.5"/>
    <rect x="60" y="5" width="35" height="55" rx="2" fill="#f43f5e" stroke="#facc15" stroke-width="1.5"/>
  </g>`;
}

function drawProjector(x, y, scale = 1, castingBeam = true) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Tripod Stand -->
    <line x1="0" y1="20" x2="-40" y2="120" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="20" x2="40" y2="120" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="20" x2="0" y2="120" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
    <!-- Projector Body Box -->
    <rect x="-45" y="-30" width="90" height="50" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <!-- Twin film reels on top -->
    <circle cx="-25" cy="-55" r="22" fill="#64748b" stroke="#334155" stroke-width="2.5"/>
    <circle cx="-25" cy="-55" r="8" fill="#1e293b"/>
    <circle cx="25" cy="-55" r="22" fill="#64748b" stroke="#334155" stroke-width="2.5"/>
    <circle cx="25" cy="-55" r="8" fill="#1e293b"/>
    <!-- Projection Lens Cylinder -->
    <rect x="45" y="-18" width="22" height="26" rx="3" fill="#64748b"/>
    <ellipse cx="67" cy="-5" rx="5" ry="13" fill="#38bdf8"/>
    ${castingBeam ? `<polygon points="70,-5 600,-150 600,140" fill="#fef08a" opacity="0.22" filter="url(#softGlow)"/>` : ""}
  </g>`;
}

function drawCamera(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <line x1="0" y1="15" x2="-35" y2="110" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="0" y1="15" x2="35" y2="110" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="0" y1="15" x2="0" y2="110" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
    <!-- 35mm Movie Camera Body -->
    <rect x="-40" y="-30" width="80" height="45" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    <!-- Double Magazine Reels on top (Mickey Mouse shape) -->
    <circle cx="-16" cy="-45" r="18" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <circle cx="16" cy="-45" r="18" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <!-- Matte box and lens -->
    <polygon points="40,-20 65,-28 65,18 40,10" fill="#1e293b"/>
    <circle cx="52" cy="-5" r="10" fill="#0284c7"/>
  </g>`;
}

function drawScreen(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>`;
}

function drawPopcorn(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    ${[-30, -15, 0, 15, 30].map(px => `
      <circle cx="${px}" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="${px}" cy="-28" r="6" fill="#fde047"/>
    `).join("")}
    ${[-20, 0, 20].map(px => `
      <circle cx="${px}" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="${px}" cy="-42" r="7" fill="#fde047"/>
    `).join("")}
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>`;
}

function drawTickets(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <g transform="rotate(-15)">
      <rect x="-40" y="-20" width="80" height="40" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      <line x1="0" y1="-20" x2="0" y2="20" stroke="#78350f" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="0" cy="-20" r="5" fill="#ffffff"/>
      <circle cx="0" cy="20" r="5" fill="#ffffff"/>
      <text x="-20" y="4" font-family="monospace" font-size="9" font-weight="bold" fill="#78350f">TIKÈ</text>
      <text x="18" y="4" font-family="monospace" font-size="9" font-weight="bold" fill="#78350f">VIP</text>
    </g>
    <g transform="translate(20, 10) rotate(12)">
      <rect x="-40" y="-20" width="80" height="40" rx="4" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <line x1="0" y1="-20" x2="0" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="0" cy="-20" r="5" fill="#ffffff"/>
      <circle cx="0" cy="20" r="5" fill="#ffffff"/>
      <text x="-20" y="4" font-family="monospace" font-size="9" font-weight="bold" fill="#ffffff">TIKÈ</text>
      <text x="18" y="4" font-family="monospace" font-size="9" font-weight="bold" fill="#ffffff">N°1</text>
    </g>
  </g>`;
}

function drawChairsRow(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    ${[-120, -40, 40, 120].map(cx => `
      <g transform="translate(${cx}, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
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
    case 2: // Cinema ao ar livre (screen, chair, tree, star)
      specificObjects = `
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawScreen(600, 480, 1.4)}
        ${drawChairsRow(600, 680, 1.25)}
      `;
      break;
    case 3: // Cabine de projeção (projector, camera, screen, lantern)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawScreen(250, 480, 0.9)}
        ${drawProjector(720, 520, 1.4, true)}
        ${drawCamera(980, 560, 1.15)}
      `;
      break;
    case 4: // Noite de estreia (cinema, ticket, star, popcorn)
      specificObjects = `
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#334155"/>
        ${drawCinemaBuilding(600, 480, 1.45)}
        ${drawPopcorn(280, 680, 1.35)}
        ${drawTickets(920, 690, 1.4)}
      `;
      break;
    case 5: // Filmagem no bosque (camera, tree, chair, star)
      specificObjects = `
        <path d="M-50,580 Q350,520 750,570 T1250,550 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawCamera(540, 570, 1.45)}
        ${drawChairsRow(880, 660, 1.0)}
      `;
      break;
    case 6: // Sala de cinema clássica (screen, chair, popcorn, lantern)
      specificObjects = `
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#1e1b4b"/>
        ${drawScreen(600, 380, 1.35)}
        ${drawChairsRow(600, 590, 1.35)}
        ${drawPopcorn(220, 680, 1.4)}
      `;
      break;
    case 7: // Festival de curtas (ticket, camera, star, tree)
      specificObjects = `
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawCamera(420, 560, 1.4)}
        ${drawTickets(820, 680, 1.5)}
      `;
      break;
    case 8: // Projetor sob as estrelas (projector, screen, star, chair)
      specificObjects = `
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="#0f172a"/>
        ${drawScreen(340, 480, 1.25)}
        ${drawProjector(820, 540, 1.35, true)}
        ${drawChairsRow(550, 680, 1.15)}
      `;
      break;
    case 9: // Bilheteria do cinema (cinema, ticket, lantern, popcorn)
      specificObjects = `
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#475569"/>
        ${drawCinemaBuilding(540, 480, 1.4)}
        ${drawTickets(880, 680, 1.4)}
        ${drawPopcorn(240, 680, 1.3)}
      `;
      break;
    case 10: // Estúdio de gravação (camera, projector, screen, chair)
      specificObjects = `
        <rect width="1200" height="800" fill="#1e293b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="#334155"/>
        ${drawScreen(300, 480, 1.1)}
        ${drawCamera(680, 560, 1.35)}
        ${drawProjector(980, 550, 1.2, false)}
      `;
      break;
    case 11: // Cineclube na praça florida (screen, chair, tree, lantern)
      specificObjects = `
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        ${drawScreen(600, 460, 1.35)}
        ${drawChairsRow(600, 670, 1.3)}
      `;
      break;
    case 12: // Rolo de filme e câmera retrô (camera, ticket, projector, screen)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawCamera(360, 560, 1.4)}
        ${drawProjector(720, 540, 1.3, false)}
        ${drawTickets(980, 680, 1.35)}
      `;
      break;
    case 13: // Sacola de pipoca e ingressos (popcorn, ticket, cinema, lantern)
      specificObjects = `
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#334155"/>
        ${drawCinemaBuilding(780, 480, 1.25)}
        ${drawPopcorn(380, 650, 1.55)}
        ${drawTickets(560, 680, 1.4)}
      `;
      break;
    case 14: // Sessão cinema na praia à noite (screen, star, chair, popcorn)
      specificObjects = `
        <path d="M-50,540 L1250,540 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="#451a03"/>
        ${drawScreen(500, 460, 1.3)}
        ${drawChairsRow(500, 660, 1.2)}
        ${drawPopcorn(900, 680, 1.35)}
      `;
      break;
    case 15: // Iluminação de cena no estúdio (lantern, camera, chair, screen)
      specificObjects = `
        <rect width="1200" height="800" fill="#1e293b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="#334155"/>
        ${drawScreen(280, 480, 1.15)}
        ${drawCamera(680, 560, 1.4)}
        ${drawChairsRow(960, 660, 0.95)}
      `;
      break;
    case 16: // Fachada neon do cinema (cinema, screen, star, popcorn)
      specificObjects = `
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#1e293b"/>
        ${drawCinemaBuilding(560, 470, 1.5)}
        ${drawPopcorn(950, 680, 1.4)}
      `;
      break;
    case 17: // Filmagem no jardim arborizado (camera, chair, tree, ticket)
      specificObjects = `
        <path d="M-50,580 Q350,520 750,570 T1250,550 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawCamera(450, 560, 1.4)}
        ${drawTickets(820, 680, 1.35)}
      `;
      break;
    case 18: // Sala com poltronas confortáveis (chair, screen, projector, lantern)
      specificObjects = `
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#31101e"/>
        ${drawScreen(600, 390, 1.35)}
        ${drawChairsRow(600, 600, 1.4)}
        ${drawProjector(1020, 620, 1.05, true)}
      `;
      break;
    case 19: // Projetor no piquenique do parque (projector, screen, tree, popcorn)
      specificObjects = `
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawScreen(380, 480, 1.25)}
        ${drawProjector(780, 560, 1.35, true)}
        ${drawPopcorn(980, 680, 1.35)}
      `;
      break;
    case 20: // Noite de gala do festival (cinema, lantern, ticket, star)
      specificObjects = `
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#0f172a"/>
        ${drawCinemaBuilding(560, 460, 1.55)}
        ${drawTickets(240, 680, 1.45)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderCinema${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Sinema</title>
  <desc>Ghibli anime art: ${scene.title} com telas, projetor e magia cinematográfica.</desc>
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
import { renderCinema as renderCinema01 } from "./master-scenes-2.mjs";

export { renderCinema01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-cinema-variants.mjs"), outContent, "utf8");
console.log("theme-cinema-variants.mjs gerado com sucesso!");
