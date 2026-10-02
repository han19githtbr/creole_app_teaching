import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Baile sob as lanternas", pal: "night", sun: [880, 200, 42, false] },
  { num: 3, title: "Ensaio no salão", pal: "dia", sun: [920, 150, 48, false] },
  { num: 4, title: "Dança das fitas", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 5, title: "Ritmo dos tambores", pal: "night", sun: [950, 180, 40, false] },
  { num: 6, title: "Apresentação colorida", pal: "dia", sun: [900, 140, 50, false] },
  { num: 7, title: "Festa no jardim", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 8, title: "Dança ao ar livre", pal: "dia", sun: [920, 160, 50, false] },
  { num: 9, title: "Noite de konpa", pal: "night", sun: [890, 210, 44, false] },
  { num: 10, title: "Festival de dança", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 11, title: "Dança folclórica na praça", pal: "dia", sun: [940, 150, 50, false] },
  { num: 12, title: "Performance no teatro iluminado", pal: "night", sun: [920, 190, 40, false] },
  { num: 13, title: "Dança com leques coloridos", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 14, title: "Tambores e dança sob a lua", pal: "night", sun: [960, 180, 42, false] },
  { num: 15, title: "Bailarinas de fitas e flores", pal: "dia", sun: [890, 150, 48, false] },
  { num: 16, title: "Salão de konpa iluminado", pal: "night", sun: [930, 200, 42, false] },
  { num: 17, title: "Dança das sombrinhas e leques", pal: "dia", sun: [910, 140, 50, false] },
  { num: 18, title: "Celebração sob as lanternas", pal: "night", sun: [880, 190, 40, false] },
  { num: 19, title: "Cortejo carnavalesco vibrante", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 20, title: "Valsa sob as estrelas", pal: "night", sun: [950, 170, 44, false] },
];

function drawDancer(x, y, scale = 1, color = "#ef4444", secondary = "#facc15") {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="${color}" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="${secondary}" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="${secondary}"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>`;
}

function drawDrum(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>`;
}

function drawLantern(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>`;
}

function drawRibbons(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>`;
}

function drawFan(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>`;
}

function drawStagePlatform() {
  return `<!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  ${[0, 200, 400, 600, 800, 1000, 1200].map(lx => `<line x1="${lx}" y1="600" x2="${lx-40}" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>`).join("")}`;
}

function drawMusicNotes(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})">
    <g transform="translate(0, 0)">
      <ellipse rx="8" ry="6" fill="#facc15" transform="rotate(-20)"/>
      <line x1="6" y1="0" x2="6" y2="-25" stroke="#facc15" stroke-width="2.5"/>
    </g>
    <g transform="translate(40, -20)">
      <ellipse rx="8" ry="6" fill="#facc15" transform="rotate(-20)"/>
      <line x1="6" y1="0" x2="6" y2="-25" stroke="#facc15" stroke-width="2.5"/>
      <path d="M6,-25 Q18,-30 20,-18" stroke="#facc15" stroke-width="2.5" fill="none"/>
    </g>
    <g transform="translate(75, 10)">
      <ellipse rx="8" ry="6" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="6" y1="0" x2="6" y2="-25" stroke="#f59e0b" stroke-width="2.5"/>
    </g>
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
    case 2: // Baile sob as lanternas (dancer, lantern, ribbon, drum)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawLantern(220, 240, 1.2)}
        ${drawLantern(600, 210, 1.3)}
        ${drawLantern(980, 240, 1.2)}
        ${drawRibbons(600, 420, 1.3)}
        ${drawDrum(240, 680, 1.3)}
        ${drawDancer(520, 590, 1.35, "#ef4444", "#facc15")}
        ${drawDancer(780, 600, 1.25, "#3b82f6", "#ffffff")}
      `;
      break;
    case 3: // Ensaio no salão (dancer, music, costume, stage)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawMusicNotes(650, 400, 1.4)}
        ${drawDancer(420, 590, 1.3, "#ec4899", "#fef08a")}
        ${drawDancer(800, 590, 1.3, "#06b6d4", "#f8fafc")}
      `;
      break;
    case 4: // Dança das fitas (ribbon, flower, dancer, star)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawRibbons(550, 360, 1.5)}
        ${drawRibbons(550, 460, 1.4)}
        ${drawDancer(360, 590, 1.3, "#8b5cf6", "#fde047")}
        ${drawDancer(780, 590, 1.3, "#f43f5e", "#67e8f9")}
      `;
      break;
    case 5: // Ritmo dos tambores (drum, dancer, lantern, music)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawLantern(300, 260, 1.2)}
        ${drawLantern(900, 260, 1.2)}
        ${drawMusicNotes(450, 420, 1.3)}
        ${drawDrum(220, 680, 1.4)}
        ${drawDrum(980, 680, 1.4)}
        ${drawDancer(600, 590, 1.4, "#f59e0b", "#dc2626")}
      `;
      break;
    case 6: // Apresentação colorida (costume, stage, fan, flower)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawFan(300, 520, 1.4)}
        ${drawFan(880, 520, 1.4)}
        ${drawDancer(480, 590, 1.3, "#10b981", "#facc15")}
        ${drawDancer(720, 590, 1.3, "#ec4899", "#ffffff")}
      `;
      break;
    case 7: // Festa no jardim (dancer, flower, lantern, ribbon)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawLantern(260, 240, 1.2)}
        ${drawLantern(940, 240, 1.2)}
        ${drawRibbons(580, 400, 1.4)}
        ${drawDancer(600, 590, 1.35, "#3b82f6", "#fef08a")}
      `;
      break;
    case 8: // Dança ao ar livre (stage, music, star, dancer)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawMusicNotes(520, 380, 1.4)}
        ${drawDancer(380, 590, 1.3, "#dc2626", "#facc15")}
        ${drawDancer(820, 590, 1.3, "#0284c7", "#f8fafc")}
      `;
      break;
    case 9: // Noite de konpa (drum, fan, costume, lantern)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawLantern(200, 250, 1.2)}
        ${drawLantern(1000, 250, 1.2)}
        ${drawDrum(300, 680, 1.3)}
        ${drawFan(900, 540, 1.3)}
        ${drawDancer(600, 590, 1.4, "#8b5cf6", "#f43f5e")}
      `;
      break;
    case 10: // Festival de dança (dancer, ribbon, flower, music)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawRibbons(600, 380, 1.5)}
        ${drawMusicNotes(750, 420, 1.3)}
        ${drawDancer(420, 590, 1.35, "#facc15", "#2563eb")}
        ${drawDancer(780, 590, 1.35, "#ec4899", "#f8fafc")}
      `;
      break;
    case 11: // Dança folclórica na praça (dancer, ribbon, flower, drum)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawDrum(240, 680, 1.35)}
        ${drawRibbons(600, 390, 1.4)}
        ${drawDancer(540, 590, 1.35, "#ea580c", "#fde047")}
        ${drawDancer(820, 600, 1.25, "#10b981", "#ffffff")}
      `;
      break;
    case 12: // Performance no teatro iluminado (stage, costume, lantern, dancer)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawLantern(220, 230, 1.3)}
        ${drawLantern(600, 200, 1.3)}
        ${drawLantern(980, 230, 1.3)}
        ${drawDancer(460, 590, 1.35, "#be123c", "#fef08a")}
        ${drawDancer(740, 590, 1.35, "#4338ca", "#ffffff")}
      `;
      break;
    case 13: // Dança com leques coloridos (fan, dancer, costume, flower)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawFan(280, 520, 1.4)}
        ${drawFan(920, 520, 1.4)}
        ${drawDancer(600, 590, 1.4, "#0284c7", "#facc15")}
      `;
      break;
    case 14: // Tambores e dança sob a lua (drum, dancer, star, music)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawDrum(260, 680, 1.4)}
        ${drawMusicNotes(700, 410, 1.4)}
        ${drawDancer(550, 590, 1.35, "#f59e0b", "#991b1b")}
        ${drawDancer(850, 600, 1.25, "#3b82f6", "#fef08a")}
      `;
      break;
    case 15: // Bailarinas de fitas e flores (dancer, ribbon, flower, costume)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawRibbons(580, 360, 1.5)}
        ${drawDancer(360, 590, 1.35, "#f43f5e", "#a7f3d0")}
        ${drawDancer(800, 590, 1.35, "#8b5cf6", "#fef08a")}
      `;
      break;
    case 16: // Salão de konpa iluminado (dancer, lantern, music, stage)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawLantern(320, 240, 1.25)}
        ${drawLantern(880, 240, 1.25)}
        ${drawMusicNotes(600, 380, 1.4)}
        ${drawDancer(460, 590, 1.3, "#059669", "#facc15")}
        ${drawDancer(740, 590, 1.3, "#dc2626", "#f8fafc")}
      `;
      break;
    case 17: // Dança das sombrinhas e leques (fan, costume, dancer, ribbon)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawRibbons(600, 380, 1.35)}
        ${drawFan(280, 520, 1.3)}
        ${drawFan(920, 520, 1.3)}
        ${drawDancer(600, 590, 1.4, "#db2777", "#fef08a")}
      `;
      break;
    case 18: // Celebração sob as lanternas (dancer, star, lantern, drum)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawLantern(220, 230, 1.25)}
        ${drawLantern(600, 210, 1.3)}
        ${drawLantern(980, 230, 1.25)}
        ${drawDrum(300, 680, 1.3)}
        ${drawDancer(620, 590, 1.4, "#e11d48", "#facc15")}
      `;
      break;
    case 19: // Cortejo carnavalesco vibrante (costume, dancer, drum, ribbon)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawRibbons(600, 360, 1.5)}
        ${drawDrum(240, 680, 1.35)}
        ${drawDrum(960, 680, 1.35)}
        ${drawDancer(480, 590, 1.35, "#2563eb", "#facc15")}
        ${drawDancer(720, 590, 1.35, "#dc2626", "#ffffff")}
      `;
      break;
    case 20: // Valsa sob as estrelas (dancer, star, stage, flower)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawDancer(480, 590, 1.35, "#7c3aed", "#fef08a")}
        ${drawDancer(720, 590, 1.35, "#0284c7", "#ffffff")}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderDanca${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Dans</title>
  <desc>Ghibli anime art: ${scene.title} com dançarinos, música e ritmo caribenho.</desc>
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
import { renderDanca as renderDanca01 } from "./master-scenes-1.mjs";

export { renderDanca01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-danca-variants.mjs"), outContent, "utf8");
console.log("theme-danca-variants.mjs gerado com sucesso!");
