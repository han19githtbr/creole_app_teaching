import fs from "node:fs";
import path from "node:path";

const scenesData = [
  { num: 2, title: "Concerto na praça", pal: "sunset", sun: [820, 270, 52, true] },
  { num: 3, title: "Estúdio de gravação musical", pal: "night", sun: [950, 180, 40, false] },
  { num: 4, title: "Piano ao entardecer", pal: "sunset", sun: [320, 270, 52, true] },
  { num: 5, title: "Banda de rua", pal: "dia", sun: [920, 150, 50, false] },
  { num: 6, title: "Palco de konpa", pal: "night", sun: [900, 200, 42, false] },
  { num: 7, title: "Aula de teclado", pal: "dia", sun: [880, 140, 48, false] },
  { num: 8, title: "Música no jardim", pal: "sunset", sun: [840, 260, 52, true] },
  { num: 9, title: "Show de luzes e som", pal: "night", sun: [920, 190, 40, false] },
  { num: 10, title: "Ensaio da banda", pal: "dia", sun: [930, 150, 50, false] },
  { num: 11, title: "Violão acústico ao luar", pal: "night", sun: [950, 170, 42, false] },
  { num: 12, title: "Roda de tambor comunitária", pal: "dia", sun: [890, 150, 48, false] },
  { num: 13, title: "Cabine de mixagem com fones", pal: "dia", sun: [940, 160, 50, false] },
  { num: 14, title: "Piano de cauda na sala nobre", pal: "night", sun: [900, 190, 40, false] },
  { num: 15, title: "Palco do festival ao entardecer", pal: "sunset", sun: [600, 320, 56, true] },
  { num: 16, title: "Serenata sob as estrelas", pal: "night", sun: [920, 190, 40, false] },
  { num: 17, title: "Oficina de tambores tradicionais", pal: "dia", sun: [910, 140, 48, false] },
  { num: 18, title: "Teclado eletrônico e fones", pal: "sunset", sun: [350, 280, 52, true] },
  { num: 19, title: "Trio acústico no parque", pal: "dia", sun: [920, 150, 50, false] },
  { num: 20, title: "Grande orquestra e percussão", pal: "night", sun: [950, 180, 40, false] },
];

function drawGuitar(x, y, scale = 1, angle = -15) {
  return `<g transform="translate(${x}, ${y}) scale(${scale}) rotate(${angle})" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    ${[-100, -80, -60, -40, -20, 0].map(fy => `<line x1="-7" y1="${fy}" x2="7" y2="${fy}" stroke="#cbd5e1" stroke-width="1"/>`).join("")}
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>`;
}

function drawPiano(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Grand Piano Body -->
    <path d="M-90,-10 L-90,-80 Q-60,-120 40,-120 Q110,-100 110,-10 Z" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <!-- Open Lid Prop -->
    <polygon points="-90,-80 40,-160 110,-80 -90,-80" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <line x1="40" y1="-160" x2="30" y2="-90" stroke="#facc15" stroke-width="4"/>
    <!-- Golden harp frame inside -->
    <ellipse cx="10" cy="-60" rx="40" ry="25" fill="#b45309" stroke="#facc15" stroke-width="2"/>
    <!-- Keyboard -->
    <rect x="-85" y="-10" width="190" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    ${Array.from({ length: 14 }, (_, i) => `
      <rect x="${-80 + i * 13}" y="-10" width="8" height="15" fill="#0f172a"/>
    `).join("")}
    <!-- Piano Legs -->
    <rect x="-80" y="14" width="10" height="50" fill="#0f172a"/>
    <rect x="85" y="14" width="10" height="50" fill="#0f172a"/>
  </g>`;
}

function drawKeyboard(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- X-Stand -->
    <line x1="-50" y1="65" x2="50" y2="10" stroke="#475569" stroke-width="5"/>
    <line x1="50" y1="65" x2="-50" y2="10" stroke="#475569" stroke-width="5"/>
    <!-- Synth Body -->
    <rect x="-75" y="-5" width="150" height="22" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="-65" y="0" width="130" height="14" fill="#ffffff"/>
    ${Array.from({ length: 11 }, (_, i) => `
      <rect x="${-60 + i * 11}" y="0" width="6" height="9" fill="#0f172a"/>
    `).join("")}
    <!-- Controls & display screen -->
    <rect x="-20" y="-14" width="40" height="9" rx="2" fill="#0284c7"/>
    <circle cx="40" cy="-9" r="3" fill="#ef4444"/>
    <circle cx="50" cy="-9" r="3" fill="#22c55e"/>
  </g>`;
}

function drawSpeaker(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>`;
}

function drawMicrophone(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <circle cx="0" cy="80" r="22" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="80" x2="0" y2="-40" stroke="#94a3b8" stroke-width="5"/>
    <!-- Vintage Ribbon / Capsule Mic -->
    <rect x="-14" y="-75" width="28" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    ${[-65, -55, -45].map(my => `<line x1="-10" y1="${my}" x2="10" y2="${my}" stroke="#475569" stroke-width="2"/>`).join("")}
  </g>`;
}

function drawHeadphones(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#dropShadow)">
    <!-- Headband arch -->
    <path d="M-35,15 Q-40,-45 0,-45 Q40,-45 35,15" stroke="#1e293b" stroke-width="6" fill="none"/>
    <!-- Earcups with padding -->
    <ellipse cx="-35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
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

function drawMusicNotes(x, y, scale = 1) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>`;
}

function drawStageLightBeams() {
  return `<!-- Stage Spotlights -->
  <polygon points="150,-10 350,700 550,700" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="1050,-10 650,700 850,700" fill="#38bdf8" opacity="0.16" filter="url(#softGlow)"/>`;
}

function drawStagePlatform() {
  return `<!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  ${[0, 200, 400, 600, 800, 1000, 1200].map(lx => `<line x1="${lx}" y1="600" x2="${lx-40}" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>`).join("")}`;
}

function generateScene(scene) {
  const isNight = scene.pal === "night";
  const isSunset = scene.pal === "sunset";
  const skyFill = isNight ? "url(#skyDusk)" : isSunset ? "url(#skySunset)" : "url(#skyDay)";
  const [sx, sy, sr, ssunset] = scene.sun;
  const numPad = String(scene.num).padStart(2, "0");

  let specificObjects = "";

  switch (scene.num) {
    case 2: // Concerto na praça (guitar, drum, speaker, note)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawSpeaker(180, 560, 1.2)}
        ${drawSpeaker(1020, 560, 1.2)}
        ${drawDrum(380, 660, 1.35)}
        ${drawGuitar(620, 580, 1.4, -10)}
        ${drawMusicNotes(750, 430, 1.35)}
      `;
      break;
    case 3: // Estúdio de gravação musical (mic, headphones, keyboard, light)
      specificObjects = `
        <rect width="1200" height="800" fill="#1e1b4b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawKeyboard(380, 600, 1.4)}
        ${drawMicrophone(680, 560, 1.4)}
        ${drawHeadphones(900, 620, 1.35)}
      `;
      break;
    case 4: // Piano ao entardecer (piano, note, light, speaker)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawStageLightBeams()}
        ${drawSpeaker(180, 560, 1.2)}
        ${drawPiano(620, 580, 1.45)}
        ${drawMusicNotes(820, 420, 1.4)}
      `;
      break;
    case 5: // Banda de rua (drum, guitar, dancer, note)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawDrum(300, 660, 1.35)}
        ${drawGuitar(550, 580, 1.35, -15)}
        ${drawMusicNotes(720, 440, 1.35)}
      `;
      break;
    case 6: // Palco de konpa (mic, speaker, dancer, drum)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawStageLightBeams()}
        ${drawSpeaker(200, 550, 1.25)}
        ${drawSpeaker(1000, 550, 1.25)}
        ${drawMicrophone(480, 580, 1.35)}
        ${drawDrum(780, 660, 1.35)}
      `;
      break;
    case 7: // Aula de teclado (keyboard, piano, headphones, light)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawPiano(420, 580, 1.35)}
        ${drawKeyboard(820, 600, 1.35)}
        ${drawHeadphones(620, 630, 1.3)}
      `;
      break;
    case 8: // Música no jardim (guitar, dancer, speaker, note)
      specificObjects = `
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawSpeaker(240, 580, 1.15)}
        ${drawGuitar(540, 590, 1.4, -10)}
        ${drawMusicNotes(760, 450, 1.35)}
      `;
      break;
    case 9: // Show de luzes e som (light, speaker, mic, note)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawStageLightBeams()}
        ${drawSpeaker(220, 550, 1.3)}
        ${drawSpeaker(980, 550, 1.3)}
        ${drawMicrophone(600, 580, 1.45)}
        ${drawMusicNotes(600, 390, 1.5)}
      `;
      break;
    case 10: // Ensaio da banda (guitar, drum, keyboard, headphones)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawDrum(260, 660, 1.3)}
        ${drawKeyboard(580, 610, 1.3)}
        ${drawGuitar(880, 590, 1.35, 10)}
        ${drawHeadphones(680, 680, 1.15)}
      `;
      break;
    case 11: // Violão acústico ao luar (guitar, note, dancer, light)
      specificObjects = `
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="#0f172a"/>
        ${drawGuitar(580, 580, 1.5, -15)}
        ${drawMusicNotes(750, 420, 1.4)}
      `;
      break;
    case 12: // Roda de tambor comunitária (drum, note, dancer, speaker)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawDrum(360, 660, 1.35)}
        ${drawDrum(600, 660, 1.4)}
        ${drawDrum(840, 660, 1.35)}
        ${drawMusicNotes(600, 420, 1.4)}
      `;
      break;
    case 13: // Cabine de mixagem com fones (headphones, keyboard, speaker, mic)
      specificObjects = `
        <rect width="1200" height="800" fill="#1e1b4b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawSpeaker(200, 540, 1.15)}
        ${drawKeyboard(540, 600, 1.35)}
        ${drawHeadphones(780, 630, 1.3)}
        ${drawMicrophone(980, 570, 1.25)}
      `;
      break;
    case 14: // Piano de cauda na sala nobre (piano, light, note, mic)
      specificObjects = `
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#1e293b"/>
        ${drawStageLightBeams()}
        ${drawPiano(580, 560, 1.5)}
        ${drawMicrophone(880, 580, 1.3)}
        ${drawMusicNotes(750, 410, 1.4)}
      `;
      break;
    case 15: // Palco do festival ao entardecer (speaker, mic, light, guitar)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawStageLightBeams()}
        ${drawSpeaker(200, 550, 1.25)}
        ${drawMicrophone(450, 580, 1.35)}
        ${drawGuitar(750, 580, 1.4, -10)}
        ${drawSpeaker(1000, 550, 1.25)}
      `;
      break;
    case 16: // Serenata sob as estrelas (guitar, note, light, dancer)
      specificObjects = `
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#0f172a"/>
        ${drawGuitar(520, 580, 1.45, -15)}
        ${drawMusicNotes(700, 420, 1.4)}
      `;
      break;
    case 17: // Oficina de tambores tradicionais (drum, note, speaker, dancer)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawSpeaker(180, 560, 1.15)}
        ${drawDrum(420, 660, 1.4)}
        ${drawDrum(720, 660, 1.4)}
        ${drawMusicNotes(880, 450, 1.35)}
      `;
      break;
    case 18: // Teclado eletrônico e fones (keyboard, headphones, light, note)
      specificObjects = `
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        ${drawKeyboard(500, 600, 1.4)}
        ${drawHeadphones(780, 630, 1.35)}
        ${drawMusicNotes(650, 430, 1.4)}
      `;
      break;
    case 19: // Trio acústico no parque (guitar, note, speaker, piano)
      specificObjects = `
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        ${drawPiano(380, 580, 1.25)}
        ${drawGuitar(720, 580, 1.35, -12)}
        ${drawMusicNotes(880, 430, 1.35)}
      `;
      break;
    case 20: // Grande orquestra e percussão (piano, drum, light, speaker)
      specificObjects = `
        ${drawStagePlatform()}
        ${drawStageLightBeams()}
        ${drawSpeaker(160, 550, 1.25)}
        ${drawPiano(480, 570, 1.35)}
        ${drawDrum(820, 660, 1.35)}
        ${drawSpeaker(1040, 550, 1.25)}
      `;
      break;
  }

  return `// Scene ${scene.num}: "${scene.title}"
export function renderMusica${numPad}() {
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>${scene.title} - Mizik</title>
  <desc>Ghibli anime art: ${scene.title} com instrumentos musicais, som e harmonia caribenha.</desc>
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
import { renderMusica as renderMusica01 } from "./master-scenes-2.mjs";

export { renderMusica01 };

${scenesData.map(generateScene).join("\n\n")}
`;

fs.writeFileSync(path.resolve("./scripts/ghibli/theme-musica-variants.mjs"), outContent, "utf8");
console.log("theme-musica-variants.mjs gerado com sucesso!");
