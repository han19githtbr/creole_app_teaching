import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderGeografia as renderGeografia01 } from "./master-scenes-1.mjs";

export { renderGeografia01 };

// Scene 2: "Vulcão na ilha"
export function renderGeografia02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vulcão na ilha - Jewografi</title>
  <desc>Ghibli anime art: Vulcão na ilha com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,490 L1250,490 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <g transform="translate(600, 480) scale(1.4)" filter="url(#dropShadow)">
    <!-- Mountain slopes -->
    <polygon points="-160,180 -40,-60 40,-60 160,180" fill="#44403c" stroke="#292524" stroke-width="3"/>
    <!-- Crater rim -->
    <ellipse cx="0" cy="-60" rx="42" ry="14" fill="#78350f" stroke="#b45309" stroke-width="2"/>
    
      <!-- Crater lava glow and smoke plume -->
      <ellipse cx="0" cy="-60" rx="28" ry="8" fill="#f97316"/>
      <ellipse cx="0" cy="-60" rx="14" ry="4" fill="#fef08a"/>
      <path d="M-15,-65 Q-30,-120 10,-170 Q40,-210 20,-260" stroke="#94a3b8" stroke-width="18" opacity="0.45" stroke-linecap="round" fill="none"/>
      <path d="M5,-65 Q25,-130 -5,-190 Q-25,-230 5,-280" stroke="#cbd5e1" stroke-width="12" opacity="0.55" stroke-linecap="round" fill="none"/>
    
  </g>
        <g transform="translate(600, 680) scale(1.6)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(600, 360) scale(1.1)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
      
</svg>`;
}

// Scene 3: "Rio e ponte de pedra"
export function renderGeografia03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Rio e ponte de pedra - Jewografi</title>
  <desc>Ghibli anime art: Rio e ponte de pedra com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 Q250,400 550,460 T1150,420 L1250,480 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <path d="M-50,540 Q300,480 650,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(760, 580) scale(1.4)" filter="url(#dropShadow)">
      <!-- Deck -->
      <path d="M-130,-10 Q0,-35 130,-10 L130,25 Q0,5 -130,25 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
      <!-- Arch cutouts -->
      <path d="M-90,25 Q-60,-20 -30,25 Z" fill="#0f766e"/>
      <path d="M-20,25 Q10,-20 40,25 Z" fill="#0f766e"/>
      <path d="M50,25 Q80,-20 110,25 Z" fill="#0f766e"/>
      <!-- Railing -->
      <path d="M-130,-18 Q0,-43 130,-18" stroke="#78716c" stroke-width="4" fill="none"/>
    </g>
        <g transform="translate(320, 700) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 4: "Exploração da floresta"
export function renderGeografia04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Exploração da floresta - Jewografi</title>
  <desc>Ghibli anime art: Exploração da floresta com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(220, 620) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(880, 640) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(420, 680) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <g transform="translate(200, 480) scale(1.1)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
      
</svg>`;
}

// Scene 5: "Mapa das montanhas"
export function renderGeografia05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mapa das montanhas - Jewografi</title>
  <desc>Ghibli anime art: Mapa das montanhas com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,460 Q300,360 650,430 T1250,390 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.7"/>
        <path d="M-50,530 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(400, 690) scale(1.5)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
        <g transform="translate(650, 690) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 6: "Costa e arquipélago"
export function renderGeografia06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Costa e arquipélago - Jewografi</title>
  <desc>Ghibli anime art: Costa e arquipélago com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <g transform="translate(320, 540) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(780, 580) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(300, 480) scale(1)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
        <g transform="translate(520, 710) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 7: "Travessia da garganta"
export function renderGeografia07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Travessia da garganta - Jewografi</title>
  <desc>Ghibli anime art: Travessia da garganta com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,460 Q320,380 680,440 T1250,400 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.7"/>
        <path d="M-50,520 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(720, 590) scale(1.4)" filter="url(#dropShadow)">
      <!-- Main cables -->
      <path d="M-140,-45 Q0,10 140,-45" stroke="#78350f" stroke-width="4" fill="none"/>
      <path d="M-140,-15 Q0,35 140,-15" stroke="#78350f" stroke-width="4" fill="none"/>
      <!-- Wooden planks -->
      
        <line x1="-100" y1="-5" x2="-100" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="-70" y1="-5" x2="-70" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="-40" y1="-5" x2="-40" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="-10" y1="-5" x2="-10" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="20" y1="-5" x2="20" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="50" y1="-5" x2="50" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="80" y1="-5" x2="80" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="110" y1="-5" x2="110" y2="25" stroke="#92400e" stroke-width="3"/>
      
    </g>
        <g transform="translate(340, 690) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 8: "Mirante do vulcão"
export function renderGeografia08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mirante do vulcão - Jewografi</title>
  <desc>Ghibli anime art: Mirante do vulcão com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 200, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,470 Q320,390 680,450 T1250,410 L1250,800 L-50,800 Z" fill="#1e293b"/>
        <g transform="translate(600, 470) scale(1.35)" filter="url(#dropShadow)">
    <!-- Mountain slopes -->
    <polygon points="-160,180 -40,-60 40,-60 160,180" fill="#44403c" stroke="#292524" stroke-width="3"/>
    <!-- Crater rim -->
    <ellipse cx="0" cy="-60" rx="42" ry="14" fill="#78350f" stroke="#b45309" stroke-width="2"/>
    
      <!-- Crater lava glow and smoke plume -->
      <ellipse cx="0" cy="-60" rx="28" ry="8" fill="#f97316"/>
      <ellipse cx="0" cy="-60" rx="14" ry="4" fill="#fef08a"/>
      <path d="M-15,-65 Q-30,-120 10,-170 Q40,-210 20,-260" stroke="#94a3b8" stroke-width="18" opacity="0.45" stroke-linecap="round" fill="none"/>
      <path d="M5,-65 Q25,-130 -5,-190 Q-25,-230 5,-280" stroke="#cbd5e1" stroke-width="12" opacity="0.55" stroke-linecap="round" fill="none"/>
    
  </g>
        <g transform="translate(600, 350) scale(1.1)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
        <g transform="translate(360, 690) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 9: "Nascente na floresta"
export function renderGeografia09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Nascente na floresta - Jewografi</title>
  <desc>Ghibli anime art: Nascente na floresta com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <g transform="translate(240, 580) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(960, 580) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(700, 600) scale(1.3)" filter="url(#dropShadow)">
      <!-- Deck -->
      <path d="M-130,-10 Q0,-35 130,-10 L130,25 Q0,5 -130,25 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
      <!-- Arch cutouts -->
      <path d="M-90,25 Q-60,-20 -30,25 Z" fill="#0f766e"/>
      <path d="M-20,25 Q10,-20 40,25 Z" fill="#0f766e"/>
      <path d="M50,25 Q80,-20 110,25 Z" fill="#0f766e"/>
      <!-- Railing -->
      <path d="M-130,-18 Q0,-43 130,-18" stroke="#78716c" stroke-width="4" fill="none"/>
    </g>
      
</svg>`;
}

// Scene 10: "Bússola para a ilha"
export function renderGeografia10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Bússola para a ilha - Jewografi</title>
  <desc>Ghibli anime art: Bússola para a ilha com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,510 Q320,440 680,490 T1250,470 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.5"/>
        <g transform="translate(720, 560) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(360, 660) scale(1.45)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 11: "Delta do grande rio"
export function renderGeografia11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Delta do grande rio - Jewografi</title>
  <desc>Ghibli anime art: Delta do grande rio com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,500 Q320,430 680,480 T1250,460 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(650, 580) scale(1.35)" filter="url(#dropShadow)">
      <!-- Deck -->
      <path d="M-130,-10 Q0,-35 130,-10 L130,25 Q0,5 -130,25 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
      <!-- Arch cutouts -->
      <path d="M-90,25 Q-60,-20 -30,25 Z" fill="#0f766e"/>
      <path d="M-20,25 Q10,-20 40,25 Z" fill="#0f766e"/>
      <path d="M50,25 Q80,-20 110,25 Z" fill="#0f766e"/>
      <!-- Railing -->
      <path d="M-130,-18 Q0,-43 130,-18" stroke="#78716c" stroke-width="4" fill="none"/>
    </g>
      
</svg>`;
}

// Scene 12: "Cume nevado e bandeira guia"
export function renderGeografia12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cume nevado e bandeira guia - Jewografi</title>
  <desc>Ghibli anime art: Cume nevado e bandeira guia com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <polygon points="-50,600 350,260 750,600" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
        <polygon points="350,600 800,240 1250,600" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(800, 240) scale(1.2)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
        <g transform="translate(340, 680) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <g transform="translate(560, 690) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 13: "Lago da caldeira vulcânica"
export function renderGeografia13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Lago da caldeira vulcânica - Jewografi</title>
  <desc>Ghibli anime art: Lago da caldeira vulcânica com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,500 Q320,430 680,480 T1250,460 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <g transform="translate(580, 500) scale(1.4)" filter="url(#dropShadow)">
    <!-- Mountain slopes -->
    <polygon points="-160,180 -40,-60 40,-60 160,180" fill="#44403c" stroke="#292524" stroke-width="3"/>
    <!-- Crater rim -->
    <ellipse cx="0" cy="-60" rx="42" ry="14" fill="#78350f" stroke="#b45309" stroke-width="2"/>
    
      <ellipse cx="0" cy="-60" rx="28" ry="8" fill="#0284c7" opacity="0.8"/> <!-- Crater lake -->
    
  </g>
        <g transform="translate(180, 620) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(580, 390) scale(1.1)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
      
</svg>`;
}

// Scene 14: "Estreito marítimo e arquipélago"
export function renderGeografia14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Estreito marítimo e arquipélago - Jewografi</title>
  <desc>Ghibli anime art: Estreito marítimo e arquipélago com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <g transform="translate(260, 540) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(650, 560) scale(1.2)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(980, 540) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(420, 680) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <g transform="translate(740, 690) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 15: "Floresta equatorial densa"
export function renderGeografia15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Floresta equatorial densa - Jewografi</title>
  <desc>Ghibli anime art: Floresta equatorial densa com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 160, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,490 Q320,420 680,470 T1250,450 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(160, 600) scale(1.35)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(380, 620) scale(1.25)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(960, 600) scale(1.35)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(680, 680) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 16: "Ponte suspensa no desfiladeiro"
export function renderGeografia16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ponte suspensa no desfiladeiro - Jewografi</title>
  <desc>Ghibli anime art: Ponte suspensa no desfiladeiro com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,460 Q320,380 680,440 T1250,400 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.7"/>
        <path d="M-50,520 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(180, 610) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(720, 590) scale(1.45)" filter="url(#dropShadow)">
      <!-- Main cables -->
      <path d="M-140,-45 Q0,10 140,-45" stroke="#78350f" stroke-width="4" fill="none"/>
      <path d="M-140,-15 Q0,35 140,-15" stroke="#78350f" stroke-width="4" fill="none"/>
      <!-- Wooden planks -->
      
        <line x1="-100" y1="-5" x2="-100" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="-70" y1="-5" x2="-70" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="-40" y1="-5" x2="-40" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="-10" y1="-5" x2="-10" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="20" y1="-5" x2="20" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="50" y1="-5" x2="50" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="80" y1="-5" x2="80" y2="25" stroke="#92400e" stroke-width="3"/>
      
        <line x1="110" y1="-5" x2="110" y2="25" stroke="#92400e" stroke-width="3"/>
      
    </g>
      
</svg>`;
}

// Scene 17: "Enseada do vulcão adormecido"
export function renderGeografia17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Enseada do vulcão adormecido - Jewografi</title>
  <desc>Ghibli anime art: Enseada do vulcão adormecido com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <g transform="translate(600, 470) scale(1.35)" filter="url(#dropShadow)">
    <!-- Mountain slopes -->
    <polygon points="-160,180 -40,-60 40,-60 160,180" fill="#44403c" stroke="#292524" stroke-width="3"/>
    <!-- Crater rim -->
    <ellipse cx="0" cy="-60" rx="42" ry="14" fill="#78350f" stroke="#b45309" stroke-width="2"/>
    
      <ellipse cx="0" cy="-60" rx="28" ry="8" fill="#0284c7" opacity="0.8"/> <!-- Crater lake -->
    
  </g>
        <g transform="translate(600, 670) scale(1.5)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(600, 360) scale(1.1)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
      
</svg>`;
}

// Scene 18: "Cartografia dos três picos"
export function renderGeografia18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cartografia dos três picos - Jewografi</title>
  <desc>Ghibli anime art: Cartografia dos três picos com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <polygon points="50,600 320,320 600,600" fill="url(#hillDistant)"/>
        <polygon points="320,600 620,270 920,600" fill="url(#hillDistant)"/>
        <polygon points="650,600 950,340 1200,600" fill="url(#hillDistant)"/>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(620, 270) scale(1.15)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
    <circle cx="0" cy="-90" r="5" fill="#f59e0b"/>
    <path d="M0,-85 Q25,-92 50,-85 T100,-85 L100,-55 Q75,-62 50,-55 T0,-55 Z" fill="#00209f"/>
    <path d="M0,-55 Q25,-62 50,-55 T100,-55 L100,-25 Q75,-32 50,-25 T0,-25 Z" fill="#d21034"/>
  </g>
        <g transform="translate(380, 690) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
        <g transform="translate(640, 690) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 19: "Encontro das águas no manguezal"
export function renderGeografia19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Encontro das águas no manguezal - Jewografi</title>
  <desc>Ghibli anime art: Encontro das águas no manguezal com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <g transform="translate(220, 590) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <g transform="translate(960, 590) scale(1.3)">
    
      <g transform="translate(-60, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(-20, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(20, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(60, 15)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
      <g transform="translate(100, 0)">
        <polygon points="0,-75 -25,0 25,0" fill="#14532d"/>
        <polygon points="0,-95 -20,-25 20,-25" fill="#166534"/>
        <polygon points="0,-115 -15,-50 15,-50" fill="#15803d"/>
        <rect x="-4" y="0" width="8" height="15" fill="#78350f"/>
      </g>
    
  </g>
        <!-- Winding River -->
  <path d="M680,480 Q620,560 720,630 T850,800 L1020,800 Q900,650 820,560 T860,480 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M700,500 Q650,570 740,640 T880,800" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6"/>
        <g transform="translate(680, 610) scale(1.35)" filter="url(#dropShadow)">
      <!-- Deck -->
      <path d="M-130,-10 Q0,-35 130,-10 L130,25 Q0,5 -130,25 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
      <!-- Arch cutouts -->
      <path d="M-90,25 Q-60,-20 -30,25 Z" fill="#0f766e"/>
      <path d="M-20,25 Q10,-20 40,25 Z" fill="#0f766e"/>
      <path d="M50,25 Q80,-20 110,25 Z" fill="#0f766e"/>
      <!-- Railing -->
      <path d="M-130,-18 Q0,-43 130,-18" stroke="#78716c" stroke-width="4" fill="none"/>
    </g>
      
</svg>`;
}

// Scene 20: "Vista aérea das ilhas caribenhas"
export function renderGeografia20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vista aérea das ilhas caribenhas - Jewografi</title>
  <desc>Ghibli anime art: Vista aérea das ilhas caribenhas com relevo, mapas e natureza geográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <g transform="translate(250, 540) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(600, 530) scale(1.2)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(940, 550) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="90" ry="24" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <ellipse cx="0" cy="12" rx="75" ry="18" fill="#22c55e"/>
    <!-- Palm trees on island -->
    <path d="M-15,10 Q-10,-40 -25,-70" stroke="#78350f" stroke-width="6" fill="none"/>
    <g transform="translate(-25, -70)">
      <path d="M0,0 Q-70,-30 -110.00000000000001,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q-28,-30 -44,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q14,-30 22,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M0,0 Q56,-30 88,-15" stroke="#15803d" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
        <g transform="translate(440, 690) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-60,-40 L60,-45 L50,45 L-70,40 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/>
    <path d="M-40,-15 Q-15,-30 10,-20 Q35,-25 40,-5 Q45,20 15,25 Q-20,30 -40,-15 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M-35,15 Q0,0 30,10" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" fill="none"/>
  </g>
        <g transform="translate(720, 690) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="50" fill="url(#brassTone)" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="42" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Cardinal ticks -->
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(0 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(45 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(90 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(135 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(180 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(225 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="3" transform="rotate(270 0 0)"/>
    
      <line x1="0" y1="-40" x2="0" y2="-32" stroke="#78350f" stroke-width="1.5" transform="rotate(315 0 0)"/>
    
    <!-- Needle: North (Red), South (Blue) -->
    <polygon points="0,-36 7,0 0,6 -7,0" fill="#dc2626"/>
    <polygon points="0,36 7,0 0,-6 -7,0" fill="#2563eb"/>
    <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
  </g>
      
</svg>`;
}
