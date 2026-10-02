import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderEstoicismo as renderEstoicismo01 } from "./master-scenes-2.mjs";

export { renderEstoicismo01 };

// Scene 2: "Pórtico entre oliveiras"
export function renderEstoicismo02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pórtico entre oliveiras - Sajès</title>
  <desc>Ghibli anime art: Pórtico entre oliveiras com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(220, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(750, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(950, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(520, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(400, 690) scale(1.3)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 3: "Estudo à luz da lamparina"
export function renderEstoicismo03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Estudo à luz da lamparina - Sajès</title>
  <desc>Ghibli anime art: Estudo à luz da lamparina com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#1c1917" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        <g transform="translate(450, 640) scale(1.6)" filter="url(#dropShadow)">
    <!-- Bronze Oil Lamp (Lamparina) -->
    <circle cx="-25" cy="-12" r="30" fill="#facc15" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M-30,-5 Q-20,15 0,15 Q20,15 30,-5 L25,-12 Q0,-10 -25,-12 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2"/>
    <path d="M-35,-10 Q-30,-2 -25,-5" stroke="#78350f" stroke-width="3" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="4" ry="7" fill="#f97316"/>
    <ellipse cx="-28" cy="-14" rx="2" ry="4" fill="#fef08a"/>
    <!-- Curved handle -->
    <path d="M25,-8 Q38,-15 32,5 Q26,15 18,12" stroke="#78350f" stroke-width="3" fill="none"/>
  </g>
        <g transform="translate(680, 660) scale(1.45)" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>
        <g transform="translate(560, 680) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
        <g transform="translate(880, 640) scale(1.3)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 4: "Jardim da reflexão"
export function renderEstoicismo04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Jardim da reflexão - Sajès</title>
  <desc>Ghibli anime art: Jardim da reflexão com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(180, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(1000, 560) scale(1.3)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(780, 620) scale(1.3)" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>
        <g transform="translate(460, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 5: "Portão do templo antigo"
export function renderEstoicismo05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Portão do templo antigo - Sajès</title>
  <desc>Ghibli anime art: Portão do templo antigo com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(600, 540) scale(1.4)" filter="url(#dropShadow)">
    <!-- Classical Stone Portal Arch -->
    <rect x="-90" y="-120" width="180" height="25" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <polygon points="-100,-120 0,-175 100,-120" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <!-- Twin Colonnade Pillars -->
    <rect x="-75" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="47" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  </g>
        <g transform="translate(200, 560) scale(1.3)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(850, 650) scale(1.4)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 6: "Leitura no pátio"
export function renderEstoicismo06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Leitura no pátio - Sajès</title>
  <desc>Ghibli anime art: Leitura no pátio com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(560, 590) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(400, 690) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
        <g transform="translate(720, 660) scale(1.35)" filter="url(#dropShadow)">
    <!-- Bronze Oil Lamp (Lamparina) -->
    <circle cx="-25" cy="-12" r="30" fill="#facc15" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M-30,-5 Q-20,15 0,15 Q20,15 30,-5 L25,-12 Q0,-10 -25,-12 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2"/>
    <path d="M-35,-10 Q-30,-2 -25,-5" stroke="#78350f" stroke-width="3" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="4" ry="7" fill="#f97316"/>
    <ellipse cx="-28" cy="-14" rx="2" ry="4" fill="#fef08a"/>
    <!-- Curved handle -->
    <path d="M25,-8 Q38,-15 32,5 Q26,15 18,12" stroke="#78350f" stroke-width="3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 7: "Estátua entre colunas"
export function renderEstoicismo07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Estátua entre colunas - Sajès</title>
  <desc>Ghibli anime art: Estátua entre colunas com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(340, 580) scale(1.35)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(860, 580) scale(1.35)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(600, 610) scale(1.45)" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>
        <g transform="translate(480, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>
      
</svg>`;
}

// Scene 8: "Caminho da sabedoria"
export function renderEstoicismo08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Caminho da sabedoria - Sajès</title>
  <desc>Ghibli anime art: Caminho da sabedoria com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(220, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(960, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(540, 590) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(740, 650) scale(1.35)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 9: "Biblioteca serena"
export function renderEstoicismo09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Biblioteca serena - Sajès</title>
  <desc>Ghibli anime art: Biblioteca serena com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#292524" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        <g transform="translate(200, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(1000, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(520, 670) scale(1.5)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
        <g transform="translate(720, 670) scale(1.4)" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>
        <g transform="translate(620, 630) scale(1.4)" filter="url(#dropShadow)">
    <!-- Bronze Oil Lamp (Lamparina) -->
    <circle cx="-25" cy="-12" r="30" fill="#facc15" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M-30,-5 Q-20,15 0,15 Q20,15 30,-5 L25,-12 Q0,-10 -25,-12 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2"/>
    <path d="M-35,-10 Q-30,-2 -25,-5" stroke="#78350f" stroke-width="3" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="4" ry="7" fill="#f97316"/>
    <ellipse cx="-28" cy="-14" rx="2" ry="4" fill="#fef08a"/>
    <!-- Curved handle -->
    <path d="M25,-8 Q38,-15 32,5 Q26,15 18,12" stroke="#78350f" stroke-width="3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 10: "Pátio das meditações"
export function renderEstoicismo10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pátio das meditações - Sajès</title>
  <desc>Ghibli anime art: Pátio das meditações com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(600, 540) scale(1.35)" filter="url(#dropShadow)">
    <!-- Classical Stone Portal Arch -->
    <rect x="-90" y="-120" width="180" height="25" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <polygon points="-100,-120 0,-175 100,-120" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <!-- Twin Colonnade Pillars -->
    <rect x="-75" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="47" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  </g>
        <g transform="translate(860, 620) scale(1.3)" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>
        <g transform="translate(420, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(600, 660) scale(1.3)" filter="url(#dropShadow)">
    <!-- Bronze Oil Lamp (Lamparina) -->
    <circle cx="-25" cy="-12" r="30" fill="#facc15" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M-30,-5 Q-20,15 0,15 Q20,15 30,-5 L25,-12 Q0,-10 -25,-12 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2"/>
    <path d="M-35,-10 Q-30,-2 -25,-5" stroke="#78350f" stroke-width="3" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="4" ry="7" fill="#f97316"/>
    <ellipse cx="-28" cy="-14" rx="2" ry="4" fill="#fef08a"/>
    <!-- Curved handle -->
    <path d="M25,-8 Q38,-15 32,5 Q26,15 18,12" stroke="#78350f" stroke-width="3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 11: "Ágora clássica sob o céu azul"
export function renderEstoicismo11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ágora clássica sob o céu azul - Sajès</title>
  <desc>Ghibli anime art: Ágora clássica sob o céu azul com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(240, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(420, 580) scale(1.2)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(900, 610) scale(1.35)" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>
        <g transform="translate(650, 590) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 12: "Escadaria do templo antigo"
export function renderEstoicismo12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Escadaria do templo antigo - Sajès</title>
  <desc>Ghibli anime art: Escadaria do templo antigo com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(560, 530) scale(1.4)" filter="url(#dropShadow)">
    <!-- Classical Stone Portal Arch -->
    <rect x="-90" y="-120" width="180" height="25" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <polygon points="-100,-120 0,-175 100,-120" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <!-- Twin Colonnade Pillars -->
    <rect x="-75" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="47" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  </g>
        <g transform="translate(920, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(340, 650) scale(1.4)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
        <g transform="translate(720, 680) scale(1.35)" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>
      
</svg>`;
}

// Scene 13: "Leitura meditativa na oliveira"
export function renderEstoicismo13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Leitura meditativa na oliveira - Sajès</title>
  <desc>Ghibli anime art: Leitura meditativa na oliveira com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(320, 560) scale(1.45)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(650, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(520, 690) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
        <g transform="translate(840, 650) scale(1.35)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 14: "Lamparina acesa sobre o papiro"
export function renderEstoicismo14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Lamparina acesa sobre o papiro - Sajès</title>
  <desc>Ghibli anime art: Lamparina acesa sobre o papiro com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(960, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0c0a09" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        <g transform="translate(480, 630) scale(1.6)" filter="url(#dropShadow)">
    <!-- Bronze Oil Lamp (Lamparina) -->
    <circle cx="-25" cy="-12" r="30" fill="#facc15" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M-30,-5 Q-20,15 0,15 Q20,15 30,-5 L25,-12 Q0,-10 -25,-12 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2"/>
    <path d="M-35,-10 Q-30,-2 -25,-5" stroke="#78350f" stroke-width="3" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="4" ry="7" fill="#f97316"/>
    <ellipse cx="-28" cy="-14" rx="2" ry="4" fill="#fef08a"/>
    <!-- Curved handle -->
    <path d="M25,-8 Q38,-15 32,5 Q26,15 18,12" stroke="#78350f" stroke-width="3" fill="none"/>
  </g>
        <g transform="translate(680, 660) scale(1.45)" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>
        <g transform="translate(340, 680) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
        <g transform="translate(880, 640) scale(1.35)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 15: "Busto de mármore do filósofo"
export function renderEstoicismo15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Busto de mármore do filósofo - Sajès</title>
  <desc>Ghibli anime art: Busto de mármore do filósofo com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(910, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(220, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(960, 580) scale(1.35)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(600, 610) scale(1.5)" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>
        <g transform="translate(420, 690) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 16: "Portão de pedra para o templo"
export function renderEstoicismo16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Portão de pedra para o templo - Sajès</title>
  <desc>Ghibli anime art: Portão de pedra para o templo com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(540, 530) scale(1.4)" filter="url(#dropShadow)">
    <!-- Classical Stone Portal Arch -->
    <rect x="-90" y="-120" width="180" height="25" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <polygon points="-100,-120 0,-175 100,-120" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <!-- Twin Colonnade Pillars -->
    <rect x="-75" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="47" y="-95" width="28" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  </g>
        <g transform="translate(880, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(260, 610) scale(1.35)" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>
      
</svg>`;
}

// Scene 17: "Diálogo filosófico ao ar livre"
export function renderEstoicismo17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Diálogo filosófico ao ar livre - Sajès</title>
  <desc>Ghibli anime art: Diálogo filosófico ao ar livre com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(200, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(980, 580) scale(1.35)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(480, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(700, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(580, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>
      
</svg>`;
}

// Scene 18: "Pátio circular com ânforas"
export function renderEstoicismo18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pátio circular com ânforas - Sajès</title>
  <desc>Ghibli anime art: Pátio circular com ânforas com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(280, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(880, 580) scale(1.3)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(580, 610) scale(1.4)" filter="url(#dropShadow)">
    <!-- Marble Pedestal Base -->
    <rect x="-35" y="40" width="70" height="30" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-25" y="-10" width="50" height="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marble Bust -->
    <ellipse cx="0" cy="-25" rx="20" ry="16" fill="#e2e8f0"/>
    <circle cx="0" cy="-45" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Chiseled features -->
    <path d="M-8,-40 Q0,-30 8,-40" stroke="#64748b" stroke-width="2" fill="none"/>
    <circle cx="-5" cy="-48" r="1.5" fill="#64748b"/>
    <circle cx="5" cy="-48" r="1.5" fill="#64748b"/>
  </g>
        <g transform="translate(420, 650) scale(1.35)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
        <g transform="translate(740, 650) scale(1.35)" filter="url(#dropShadow)">
    <!-- Terracotta Amphora / Jar -->
    <ellipse cx="0" cy="45" rx="25" ry="8" fill="#000000" opacity="0.3"/>
    <path d="M-18,-35 L18,-35 Q32,0 22,35 L-22,35 Q-32,0 -18,-35 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <ellipse cx="0" cy="-35" rx="18" ry="6" fill="#c2410c"/>
    <!-- Twin handles -->
    <path d="M-18,-25 Q-32,-15 -20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <path d="M18,-25 Q32,-15 20,10" stroke="#9a3412" stroke-width="4" fill="none"/>
    <!-- Classical Greek meander wave band -->
    <line x1="-24" y1="5" x2="24" y2="5" stroke="#fef08a" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 19: "Vigília filosófica noturna"
export function renderEstoicismo19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vigília filosófica noturna - Sajès</title>
  <desc>Ghibli anime art: Vigília filosófica noturna com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(880, 580) scale(1.35)" filter="url(#dropShadow)">
    <!-- Classical Fluted Column -->
    <!-- Base -->
    <rect x="-26" y="80" width="52" height="15" rx="2" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-22" y="70" width="44" height="10" fill="url(#stoneTone)" stroke="#44403c" stroke-width="1.5"/>
    <!-- Shaft with fluting grooves -->
    <rect x="-18" y="-120" width="36" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-10" y1="-120" x2="-10" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="-3" y1="-120" x2="-3" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="4" y1="-120" x2="4" y2="70" stroke="#94a3b8" stroke-width="1.5"/><line x1="11" y1="-120" x2="11" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Capital (Ionic scroll) -->
    <rect x="-24" y="-132" width="48" height="12" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <circle cx="-20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
    <circle cx="20" cy="-126" r="6" fill="#cbd5e1" stroke="#44403c" stroke-width="1.5"/>
  </g>
        <g transform="translate(480, 590) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(620, 650) scale(1.4)" filter="url(#dropShadow)">
    <!-- Bronze Oil Lamp (Lamparina) -->
    <circle cx="-25" cy="-12" r="30" fill="#facc15" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M-30,-5 Q-20,15 0,15 Q20,15 30,-5 L25,-12 Q0,-10 -25,-12 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2"/>
    <path d="M-35,-10 Q-30,-2 -25,-5" stroke="#78350f" stroke-width="3" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="4" ry="7" fill="#f97316"/>
    <ellipse cx="-28" cy="-14" rx="2" ry="4" fill="#fef08a"/>
    <!-- Curved handle -->
    <path d="M25,-8 Q38,-15 32,5 Q26,15 18,12" stroke="#78350f" stroke-width="3" fill="none"/>
  </g>
        <g transform="translate(360, 680) scale(1.35)" filter="url(#dropShadow)">
    <!-- Rolled Papyrus Scroll -->
    <rect x="-35" y="-8" width="70" height="16" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="35" cy="0" rx="4" ry="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
    <!-- Red ribbon tied in middle -->
    <rect x="-4" y="-9" width="8" height="18" fill="#dc2626"/>
  </g>
      
</svg>`;
}

// Scene 20: "Passeio sereno entre oliveiras"
export function renderEstoicismo20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Passeio sereno entre oliveiras - Sajès</title>
  <desc>Ghibli anime art: Passeio sereno entre oliveiras com colunas clássicas, oliveiras e sabedoria estóica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Classical Marble Terrace -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#e2e8f0"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#cbd5e1" stroke-width="6"/>
  <line x1="0" y1="600" x2="-30" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="200" y1="600" x2="170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="400" y1="600" x2="370" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="600" y1="600" x2="570" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="800" y1="600" x2="770" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1000" y1="600" x2="970" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/><line x1="1200" y1="600" x2="1170" y2="800" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
        <g transform="translate(240, 560) scale(1.4)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(940, 560) scale(1.4)" filter="url(#dropShadow)">
    <!-- Ancient Gnarled Trunk -->
    <path d="M-18,60 Q-35,-20 -10,-100 Q10,-20 18,60 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2.5"/>
    <path d="M-10,20 Q-20,-40 0,-90" stroke="#3e2515" stroke-width="5" fill="none"/>
    <!-- Canopy (Silvery-green leaves) -->
    <ellipse cx="0" cy="-130" rx="75" ry="55" fill="#4d7c0f"/>
    <ellipse cx="-40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="40" cy="-115" rx="55" ry="45" fill="#65a30d"/>
    <ellipse cx="0" cy="-155" rx="50" ry="38" fill="#a3e635" opacity="0.75"/>
    <!-- Purple Olives -->
    <circle cx="-25" cy="-120" r="5" fill="#3b0764"/>
    <circle cx="15" cy="-135" r="5" fill="#3b0764"/>
    <circle cx="35" cy="-105" r="5" fill="#3b0764"/>
  </g>
        <g transform="translate(580, 590) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="75" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    <!-- Draped Stoic Chiton / Robe -->
    <path d="M-22,-30 L22,-30 L30,70 L-30,70 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Fold draping sash -->
    <path d="M-22,-30 Q0,10 26,45 L15,70 Q-10,30 -22,-30 Z" fill="#e2e8f0"/>
    <!-- Head and beard -->
    <circle cx="0" cy="-52" r="14" fill="#a8714e"/>
    <!-- White beard & hair of wisdom -->
    <path d="M-14,-50 Q0,-30 14,-50 Q16,-20 0,-18 Q-16,-20 -14,-50 Z" fill="#f1f5f9"/>
    <!-- Walking staff or open scroll -->
    <line x1="28" y1="-45" x2="35" y2="70" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  </g>
        <g transform="translate(440, 690) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-60,-10 Q-30,-22 0,-12 Q30,-22 60,-10 L55,30 Q30,18 0,26 Q-30,18 -55,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
  </g>
      
</svg>`;
}
