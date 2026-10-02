import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderDanca as renderDanca01 } from "./master-scenes-1.mjs";

export { renderDanca01 };

// Scene 2: "Baile sob as lanternas"
export function renderDanca02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Baile sob as lanternas - Dans</title>
  <desc>Ghibli anime art: Baile sob as lanternas com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 200, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(220, 240) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(600, 210) scale(1.3)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(980, 240) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(600, 420) scale(1.3)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(240, 680) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(520, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#facc15"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(780, 600) scale(1.25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#3b82f6" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#ffffff" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#ffffff"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 3: "Ensaio no salão"
export function renderDanca03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ensaio no salão - Dans</title>
  <desc>Ghibli anime art: Ensaio no salão com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(650, 400) scale(1.4)">
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
  </g>
        <g transform="translate(420, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#ec4899" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fef08a" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fef08a"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(800, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#06b6d4" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#f8fafc" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#f8fafc"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 4: "Dança das fitas"
export function renderDanca04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança das fitas - Dans</title>
  <desc>Ghibli anime art: Dança das fitas com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(550, 360) scale(1.5)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(550, 460) scale(1.4)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(360, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#8b5cf6" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fde047" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fde047"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(780, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#f43f5e" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#67e8f9" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#67e8f9"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 5: "Ritmo dos tambores"
export function renderDanca05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ritmo dos tambores - Dans</title>
  <desc>Ghibli anime art: Ritmo dos tambores com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(300, 260) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(900, 260) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(450, 420) scale(1.3)">
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
  </g>
        <g transform="translate(220, 680) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(980, 680) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(600, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#f59e0b" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#dc2626" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#dc2626"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 6: "Apresentação colorida"
export function renderDanca06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Apresentação colorida - Dans</title>
  <desc>Ghibli anime art: Apresentação colorida com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(300, 520) scale(1.4)" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>
        <g transform="translate(880, 520) scale(1.4)" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>
        <g transform="translate(480, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#10b981" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#facc15"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(720, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#ec4899" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#ffffff" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#ffffff"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 7: "Festa no jardim"
export function renderDanca07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Festa no jardim - Dans</title>
  <desc>Ghibli anime art: Festa no jardim com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(260, 240) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(940, 240) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(580, 400) scale(1.4)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(600, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#3b82f6" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fef08a" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fef08a"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 8: "Dança ao ar livre"
export function renderDanca08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança ao ar livre - Dans</title>
  <desc>Ghibli anime art: Dança ao ar livre com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(520, 380) scale(1.4)">
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
  </g>
        <g transform="translate(380, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#facc15"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(820, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#0284c7" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#f8fafc" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#f8fafc"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 9: "Noite de konpa"
export function renderDanca09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Noite de konpa - Dans</title>
  <desc>Ghibli anime art: Noite de konpa com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 210, 44, false)}
  ${drawGhibliCloud(240, 140, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(200, 250) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(1000, 250) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(300, 680) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(900, 540) scale(1.3)" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>
        <g transform="translate(600, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#8b5cf6" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#f43f5e" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#f43f5e"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 10: "Festival de dança"
export function renderDanca10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Festival de dança - Dans</title>
  <desc>Ghibli anime art: Festival de dança com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(600, 380) scale(1.5)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(750, 420) scale(1.3)">
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
  </g>
        <g transform="translate(420, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#facc15" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#2563eb" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#2563eb"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(780, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#ec4899" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#f8fafc" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#f8fafc"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 11: "Dança folclórica na praça"
export function renderDanca11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança folclórica na praça - Dans</title>
  <desc>Ghibli anime art: Dança folclórica na praça com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(240, 680) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(600, 390) scale(1.4)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(540, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#ea580c" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fde047" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fde047"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(820, 600) scale(1.25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#10b981" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#ffffff" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#ffffff"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 12: "Performance no teatro iluminado"
export function renderDanca12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Performance no teatro iluminado - Dans</title>
  <desc>Ghibli anime art: Performance no teatro iluminado com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(220, 230) scale(1.3)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(600, 200) scale(1.3)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(980, 230) scale(1.3)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(460, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#be123c" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fef08a" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fef08a"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(740, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#4338ca" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#ffffff" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#ffffff"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 13: "Dança com leques coloridos"
export function renderDanca13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança com leques coloridos - Dans</title>
  <desc>Ghibli anime art: Dança com leques coloridos com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(280, 520) scale(1.4)" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>
        <g transform="translate(920, 520) scale(1.4)" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>
        <g transform="translate(600, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#0284c7" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#facc15"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 14: "Tambores e dança sob a lua"
export function renderDanca14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Tambores e dança sob a lua - Dans</title>
  <desc>Ghibli anime art: Tambores e dança sob a lua com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(960, 180, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(260, 680) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(700, 410) scale(1.4)">
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
  </g>
        <g transform="translate(550, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#f59e0b" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#991b1b" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#991b1b"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(850, 600) scale(1.25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#3b82f6" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fef08a" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fef08a"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 15: "Bailarinas de fitas e flores"
export function renderDanca15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Bailarinas de fitas e flores - Dans</title>
  <desc>Ghibli anime art: Bailarinas de fitas e flores com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(580, 360) scale(1.5)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(360, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#f43f5e" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#a7f3d0" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#a7f3d0"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(800, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#8b5cf6" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fef08a" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fef08a"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 16: "Salão de konpa iluminado"
export function renderDanca16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Salão de konpa iluminado - Dans</title>
  <desc>Ghibli anime art: Salão de konpa iluminado com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 200, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(320, 240) scale(1.25)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(880, 240) scale(1.25)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(600, 380) scale(1.4)">
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
  </g>
        <g transform="translate(460, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#059669" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#facc15"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(740, 590) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#f8fafc" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#f8fafc"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 17: "Dança das sombrinhas e leques"
export function renderDanca17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança das sombrinhas e leques - Dans</title>
  <desc>Ghibli anime art: Dança das sombrinhas e leques com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(910, 140, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(600, 380) scale(1.35)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(280, 520) scale(1.3)" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>
        <g transform="translate(920, 520) scale(1.3)" filter="url(#dropShadow)">
    <path d="M0,0 L-45,-45 Q0,-75 45,-45 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
    <path d="M0,0 L-30,-55 Q0,-72 30,-55 Z" fill="#fef08a"/>
    <line x1="0" y1="0" x2="-45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="-15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="15" y2="-60" stroke="#78350f" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
  </g>
        <g transform="translate(600, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#db2777" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fef08a" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fef08a"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 18: "Celebração sob as lanternas"
export function renderDanca18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Celebração sob as lanternas - Dans</title>
  <desc>Ghibli anime art: Celebração sob as lanternas com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(220, 230) scale(1.25)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(600, 210) scale(1.3)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(980, 230) scale(1.25)" filter="url(#dropShadow)">
    <line x1="0" y1="-50" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="18" r="32" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="16" ry="20" fill="#fef08a" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="18" rx="5" ry="10" fill="#f97316"/>
    <rect x="-10" y="34" width="20" height="8" rx="2" fill="#78350f"/>
    <rect x="-8" y="-4" width="16" height="6" rx="2" fill="#78350f"/>
  </g>
        <g transform="translate(300, 680) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(620, 590) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#e11d48" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#facc15"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 19: "Cortejo carnavalesco vibrante"
export function renderDanca19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cortejo carnavalesco vibrante - Dans</title>
  <desc>Ghibli anime art: Cortejo carnavalesco vibrante com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(600, 360) scale(1.5)">
    <path d="M-120,0 Q-60,-80 0,0 T120,-30 T200,40" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-100,30 Q-40,-50 20,30 T140,0 T220,70" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-80,-20 Q-20,-100 40,-20 T160,-50 T240,20" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
        <g transform="translate(240, 680) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(960, 680) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(480, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#2563eb" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#facc15"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(720, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#ffffff" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#ffffff"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}

// Scene 20: "Valsa sob as estrelas"
export function renderDanca20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Valsa sob as estrelas - Dans</title>
  <desc>Ghibli anime art: Valsa sob as estrelas com dançarinos, música e ritmo caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 170, 44, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(480, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#7c3aed" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#fef08a" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#fef08a"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
        <g transform="translate(720, 590) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="110" rx="60" ry="15" fill="#000000" opacity="0.35"/>
    <!-- Swirling dress skirt -->
    <path d="M-20,0 
      C-70,20 -110,65 -85,90 
      C-40,105 40,105 85,90 
      C110,65 70,20 20,0 Z" 
      fill="#0284c7" stroke="#991b1b" stroke-width="2.5"/>
    <!-- Ruffle flounce trim -->
    <path d="M-75,80 Q0,105 75,80" stroke="#ffffff" stroke-width="8" fill="none"/>
    <!-- Torso and arms gracefully raised -->
    <rect x="-14" y="-35" width="28" height="40" rx="6" fill="#ffffff"/>
    <circle cx="0" cy="-52" r="14" fill="#8c5836"/>
    <!-- Raised dancing arms -->
    <path d="M-14,-25 Q-35,-45 -45,-65 M14,-25 Q35,-45 45,-65" stroke="#8c5836" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Flower or ribbon in hair -->
    <circle cx="-10" cy="-60" r="6" fill="#f43f5e"/>
  </g>
      
</svg>`;
}
