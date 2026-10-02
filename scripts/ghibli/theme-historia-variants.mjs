import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderHistoria as renderHistoria01 } from "./master-scenes-2.mjs";

export { renderHistoria01 };

// Scene 2: "Escavação arqueológica"
export function renderHistoria02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Escavação arqueológica - Istwa</title>
  <desc>Ghibli anime art: Escavação arqueológica com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 L1250,540 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(920, 520) scale(0.95)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(320, 560) scale(1.25)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(640, 680) scale(1.4)" filter="url(#dropShadow)">
    <!-- Open Antique Leather Manuscript -->
    <path d="M-65,-10 Q-30,-25 0,-15 Q30,-25 65,-10 L60,35 Q30,20 0,30 Q-30,20 -60,35 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-15" x2="0" y2="30" stroke="#78350f" stroke-width="2"/>
    <!-- Text Lines -->
    
      <line x1="-50" y1="-5" x2="-10" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="-5" x2="50" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="5" x2="-10" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="5" x2="50" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="15" x2="-10" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="15" x2="50" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
  </g>
      
</svg>`;
}

// Scene 3: "Caravela histórica"
export function renderHistoria03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Caravela histórica - Istwa</title>
  <desc>Ghibli anime art: Caravela histórica com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,650 L1250,650 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(560, 480) scale(1.35)" filter="url(#dropShadow)">
    <!-- Caravel Wooden Hull -->
    <path d="M-100,20 Q-70,60 0,60 Q70,60 100,10 L90,0 Q0,10 -85,0 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <!-- High Stern Castle -->
    <rect x="-90" y="-25" width="35" height="35" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- Masts -->
    <line x1="-30" y1="20" x2="-30" y2="-130" stroke="#451a03" stroke-width="6"/>
    <line x1="30" y1="20" x2="30" y2="-150" stroke="#451a03" stroke-width="6"/>
    <!-- Square sails with red cross -->
    <rect x="-70" y="-120" width="80" height="65" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <line x1="-30" y1="-120" x2="-30" y2="-55" stroke="#dc2626" stroke-width="5"/>
    <line x1="-60" y1="-88" x2="0" y2="-88" stroke="#dc2626" stroke-width="5"/>
  </g>
        <g transform="translate(200, 590) scale(1.3)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(950, 590) scale(1.3)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
      
</svg>`;
}

// Scene 4: "Portões da fortaleza"
export function renderHistoria04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Portões da fortaleza - Istwa</title>
  <desc>Ghibli anime art: Portões da fortaleza com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <g transform="translate(600, 480) scale(1.6)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(250, 520) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(950, 520) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(580, 650) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="20" cy="50" rx="90" ry="18" fill="#000000" opacity="0.4"/>
    <rect x="-35" y="5" width="100" height="38" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <circle cx="-20" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="55" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <polygon points="-60,5 95,-28 97,-6 -60,20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2.5"/>
    <circle cx="-65" cy="12" r="12" fill="#785315"/>
    <!-- Stack of cannonballs -->
    <g transform="translate(115, 25)">
      <circle cx="0" cy="15" r="10" fill="#1c1917"/>
      <circle cx="18" cy="15" r="10" fill="#1c1917"/>
      <circle cx="9" cy="-2" r="10" fill="#292524"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 5: "Cavaleiros no castelo"
export function renderHistoria05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cavaleiros no castelo - Istwa</title>
  <desc>Ghibli anime art: Cavaleiros no castelo com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <g transform="translate(780, 470) scale(1.4)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(360, 620) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 6: "Monumento da praça"
export function renderHistoria06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Monumento da praça - Istwa</title>
  <desc>Ghibli anime art: Monumento da praça com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(240, 520) scale(1)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(960, 520) scale(1)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(600, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(420, 700) scale(1.3)" filter="url(#dropShadow)">
    <!-- Open Antique Leather Manuscript -->
    <path d="M-65,-10 Q-30,-25 0,-15 Q30,-25 65,-10 L60,35 Q30,20 0,30 Q-30,20 -60,35 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-15" x2="0" y2="30" stroke="#78350f" stroke-width="2"/>
    <!-- Text Lines -->
    
      <line x1="-50" y1="-5" x2="-10" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="-5" x2="50" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="5" x2="-10" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="5" x2="50" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="15" x2="-10" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="15" x2="50" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
  </g>
      
</svg>`;
}

// Scene 7: "Biblioteca antiga"
export function renderHistoria07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Biblioteca antiga - Istwa</title>
  <desc>Ghibli anime art: Biblioteca antiga com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#292524" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(200, 420) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(1000, 420) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(820, 540) scale(0.9)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(540, 660) scale(1.6)" filter="url(#dropShadow)">
    <!-- Open Antique Leather Manuscript -->
    <path d="M-65,-10 Q-30,-25 0,-15 Q30,-25 65,-10 L60,35 Q30,20 0,30 Q-30,20 -60,35 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-15" x2="0" y2="30" stroke="#78350f" stroke-width="2"/>
    <!-- Text Lines -->
    
      <line x1="-50" y1="-5" x2="-10" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="-5" x2="50" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="5" x2="-10" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="5" x2="50" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="15" x2="-10" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="15" x2="50" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
  </g>
      
</svg>`;
}

// Scene 8: "Muralhas e canhões"
export function renderHistoria08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Muralhas e canhões - Istwa</title>
  <desc>Ghibli anime art: Muralhas e canhões com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <g transform="translate(600, 470) scale(1.5)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(280, 630) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
        <g transform="translate(720, 640) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="20" cy="50" rx="90" ry="18" fill="#000000" opacity="0.4"/>
    <rect x="-35" y="5" width="100" height="38" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <circle cx="-20" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="55" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <polygon points="-60,5 95,-28 97,-6 -60,20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2.5"/>
    <circle cx="-65" cy="12" r="12" fill="#785315"/>
    <!-- Stack of cannonballs -->
    <g transform="translate(115, 25)">
      <circle cx="0" cy="15" r="10" fill="#1c1917"/>
      <circle cx="18" cy="15" r="10" fill="#1c1917"/>
      <circle cx="9" cy="-2" r="10" fill="#292524"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 9: "Ruínas de pedra"
export function renderHistoria09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ruínas de pedra - Istwa</title>
  <desc>Ghibli anime art: Ruínas de pedra com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(840, 530) scale(1.1)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(300, 560) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(540, 680) scale(1.4)" filter="url(#dropShadow)">
    <!-- Open Antique Leather Manuscript -->
    <path d="M-65,-10 Q-30,-25 0,-15 Q30,-25 65,-10 L60,35 Q30,20 0,30 Q-30,20 -60,35 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-15" x2="0" y2="30" stroke="#78350f" stroke-width="2"/>
    <!-- Text Lines -->
    
      <line x1="-50" y1="-5" x2="-10" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="-5" x2="50" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="5" x2="-10" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="5" x2="50" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="15" x2="-10" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="15" x2="50" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
  </g>
      
</svg>`;
}

// Scene 10: "Praça dos heróis"
export function renderHistoria10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Praça dos heróis - Istwa</title>
  <desc>Ghibli anime art: Praça dos heróis com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <g transform="translate(850, 480) scale(1.2)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,580 L1250,580 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(480, 550) scale(1.35)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(240, 640) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 11: "Bastilha da cidadela sob o sol"
export function renderHistoria11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Bastilha da cidadela sob o sol - Istwa</title>
  <desc>Ghibli anime art: Bastilha da cidadela sob o sol com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <g transform="translate(600, 460) scale(1.6)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(400, 650) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="20" cy="50" rx="90" ry="18" fill="#000000" opacity="0.4"/>
    <rect x="-35" y="5" width="100" height="38" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <circle cx="-20" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="55" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <polygon points="-60,5 95,-28 97,-6 -60,20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2.5"/>
    <circle cx="-65" cy="12" r="12" fill="#785315"/>
    <!-- Stack of cannonballs -->
    <g transform="translate(115, 25)">
      <circle cx="0" cy="15" r="10" fill="#1c1917"/>
      <circle cx="18" cy="15" r="10" fill="#1c1917"/>
      <circle cx="9" cy="-2" r="10" fill="#292524"/>
    </g>
  </g>
        <g transform="translate(800, 650) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="20" cy="50" rx="90" ry="18" fill="#000000" opacity="0.4"/>
    <rect x="-35" y="5" width="100" height="38" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <circle cx="-20" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="55" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <polygon points="-60,5 95,-28 97,-6 -60,20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2.5"/>
    <circle cx="-65" cy="12" r="12" fill="#785315"/>
    <!-- Stack of cannonballs -->
    <g transform="translate(115, 25)">
      <circle cx="0" cy="15" r="10" fill="#1c1917"/>
      <circle cx="18" cy="15" r="10" fill="#1c1917"/>
      <circle cx="9" cy="-2" r="10" fill="#292524"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 12: "Nau capitânia no ancoradouro"
export function renderHistoria12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Nau capitânia no ancoradouro - Istwa</title>
  <desc>Ghibli anime art: Nau capitânia no ancoradouro com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(620, 490) scale(1.4)" filter="url(#dropShadow)">
    <!-- Caravel Wooden Hull -->
    <path d="M-100,20 Q-70,60 0,60 Q70,60 100,10 L90,0 Q0,10 -85,0 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <!-- High Stern Castle -->
    <rect x="-90" y="-25" width="35" height="35" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- Masts -->
    <line x1="-30" y1="20" x2="-30" y2="-130" stroke="#451a03" stroke-width="6"/>
    <line x1="30" y1="20" x2="30" y2="-150" stroke="#451a03" stroke-width="6"/>
    <!-- Square sails with red cross -->
    <rect x="-70" y="-120" width="80" height="65" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <line x1="-30" y1="-120" x2="-30" y2="-55" stroke="#dc2626" stroke-width="5"/>
    <line x1="-60" y1="-88" x2="0" y2="-88" stroke="#dc2626" stroke-width="5"/>
  </g>
        <g transform="translate(240, 580) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
      
</svg>`;
}

// Scene 13: "Manuscrito dos patriotas"
export function renderHistoria13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Manuscrito dos patriotas - Istwa</title>
  <desc>Ghibli anime art: Manuscrito dos patriotas com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,550 L1250,550 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(300, 520) scale(1.15)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(950, 500) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(640, 670) scale(1.5)" filter="url(#dropShadow)">
    <!-- Open Antique Leather Manuscript -->
    <path d="M-65,-10 Q-30,-25 0,-15 Q30,-25 65,-10 L60,35 Q30,20 0,30 Q-30,20 -60,35 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-15" x2="0" y2="30" stroke="#78350f" stroke-width="2"/>
    <!-- Text Lines -->
    
      <line x1="-50" y1="-5" x2="-10" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="-5" x2="50" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="5" x2="-10" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="5" x2="50" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="15" x2="-10" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="15" x2="50" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
  </g>
      
</svg>`;
}

// Scene 14: "Sentinela a cavalo na colina"
export function renderHistoria14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Sentinela a cavalo na colina - Istwa</title>
  <desc>Ghibli anime art: Sentinela a cavalo na colina com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <g transform="translate(850, 470) scale(1.3)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,570 Q350,500 750,550 T1250,530 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(450, 620) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 15: "Obelisco da independência"
export function renderHistoria15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Obelisco da independência - Istwa</title>
  <desc>Ghibli anime art: Obelisco da independência com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 140, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(600, 540) scale(1.45)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(280, 640) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 16: "Mansão colonial preservada"
export function renderHistoria16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mansão colonial preservada - Istwa</title>
  <desc>Ghibli anime art: Mansão colonial preservada com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(550, 520) scale(1.3)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(920, 560) scale(1)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(240, 640) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 17: "Canhoneira na muralha alta"
export function renderHistoria17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Canhoneira na muralha alta - Istwa</title>
  <desc>Ghibli anime art: Canhoneira na muralha alta com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <g transform="translate(600, 470) scale(1.55)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(550, 640) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="20" cy="50" rx="90" ry="18" fill="#000000" opacity="0.4"/>
    <rect x="-35" y="5" width="100" height="38" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <circle cx="-20" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="55" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <polygon points="-60,5 95,-28 97,-6 -60,20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2.5"/>
    <circle cx="-65" cy="12" r="12" fill="#785315"/>
    <!-- Stack of cannonballs -->
    <g transform="translate(115, 25)">
      <circle cx="0" cy="15" r="10" fill="#1c1917"/>
      <circle cx="18" cy="15" r="10" fill="#1c1917"/>
      <circle cx="9" cy="-2" r="10" fill="#292524"/>
    </g>
  </g>
        <g transform="translate(950, 520) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
      
</svg>`;
}

// Scene 18: "Arquivo de tratados históricos"
export function renderHistoria18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Arquivo de tratados históricos - Istwa</title>
  <desc>Ghibli anime art: Arquivo de tratados históricos com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(910, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,550 L1250,550 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(250, 520) scale(1.05)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(880, 550) scale(1.15)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(560, 670) scale(1.45)" filter="url(#dropShadow)">
    <!-- Open Antique Leather Manuscript -->
    <path d="M-65,-10 Q-30,-25 0,-15 Q30,-25 65,-10 L60,35 Q30,20 0,30 Q-30,20 -60,35 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-15" x2="0" y2="30" stroke="#78350f" stroke-width="2"/>
    <!-- Text Lines -->
    
      <line x1="-50" y1="-5" x2="-10" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="-5" x2="50" y2="-5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="5" x2="-10" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="5" x2="50" y2="5" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
      <line x1="-50" y1="15" x2="-10" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="15" x2="50" y2="15" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
    
  </g>
      
</svg>`;
}

// Scene 19: "Tochas acesas na fortaleza"
export function renderHistoria19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Tochas acesas na fortaleza - Istwa</title>
  <desc>Ghibli anime art: Tochas acesas na fortaleza com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <g transform="translate(600, 470) scale(1.55)" filter="url(#dropShadow)">
    <polygon points="-200,100 -160,-60 160,-60 200,100" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <rect x="-150" y="-80" width="25" height="22" fill="#78716c"/><rect x="-100" y="-80" width="25" height="22" fill="#78716c"/><rect x="-50" y="-80" width="25" height="22" fill="#78716c"/><rect x="0" y="-80" width="25" height="22" fill="#78716c"/><rect x="50" y="-80" width="25" height="22" fill="#78716c"/><rect x="100" y="-80" width="25" height="22" fill="#78716c"/>
    <!-- Gun embrasures -->
    <rect x="-110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="0" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
    <rect x="110" y="-10" width="22" height="24" rx="3" fill="#1c1917"/>
  </g>
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(200, 500) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(550, 480) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(900, 500) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="15" cy="-25" r="55" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <line x1="0" y1="60" x2="15" y2="20" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
    <polygon points="5,20 25,20 20,-10 10,-10" fill="#292524"/>
    <!-- Flame -->
    <path d="M15,-50 C5,-35 2,-25 8,-10 C14,-2 26,-2 28,-15 C30,-30 22,-40 15,-50 Z" fill="#ef4444"/>
    <path d="M15,-40 C8,-28 6,-20 10,-10 C14,-4 22,-4 24,-14 C26,-24 20,-32 15,-40 Z" fill="#facc15"/>
  </g>
        <g transform="translate(700, 650) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="20" cy="50" rx="90" ry="18" fill="#000000" opacity="0.4"/>
    <rect x="-35" y="5" width="100" height="38" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <circle cx="-20" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="55" cy="38" r="20" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <polygon points="-60,5 95,-28 97,-6 -60,20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2.5"/>
    <circle cx="-65" cy="12" r="12" fill="#785315"/>
    <!-- Stack of cannonballs -->
    <g transform="translate(115, 25)">
      <circle cx="0" cy="15" r="10" fill="#1c1917"/>
      <circle cx="18" cy="15" r="10" fill="#1c1917"/>
      <circle cx="9" cy="-2" r="10" fill="#292524"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 20: "Cerimônia junto ao monumento"
export function renderHistoria20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cerimônia junto ao monumento - Istwa</title>
  <desc>Ghibli anime art: Cerimônia junto ao monumento com fortalezas, canhões e patrimônio histórico.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(880, 530) scale(1.1)" filter="url(#dropShadow)">
    <!-- Gingerbread Historic Mansion -->
    <rect x="-85" y="-80" width="170" height="150" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
    <polygon points="-105,-80 0,-165 105,-80" fill="#0369a1" stroke="#075985" stroke-width="3"/>
    <path d="M-100,-80 Q-80,-68 -60,-80 Q-40,-68 -20,-80 Q0,-68 20,-80 Q40,-68 60,-80 Q80,-68 100,-80" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,70 L-22,10 Q0,-8 22,10 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-65" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="33" y="-45" width="32" height="42" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(540, 550) scale(1.4)" filter="url(#dropShadow)">
    <!-- Monument Base Steps -->
    <rect x="-80" y="30" width="160" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-60" y="10" width="120" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <rect x="-40" y="-10" width="80" height="20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Obelisk Column -->
    <polygon points="-25,-10 -15,-180 0,-210 15,-180 25,-10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gold Medallion on Monument -->
    <circle cx="0" cy="-60" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(250, 640) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="75" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Legs -->
    <line x1="-40" y1="20" x2="-45" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="-25" y1="20" x2="-28" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <line x1="30" y1="20" x2="35" y2="65" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <line x1="45" y1="20" x2="48" y2="65" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="10" rx="65" ry="35" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Saddle -->
    <path d="M-15,-22 Q0,-12 15,-22 L18,-5 Q0,5 -18,-5 Z" fill="#dc2626"/>
    <!-- Neck and Head -->
    <path d="M30,-5 L55,-50 L80,-30 L55,20 Z" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <!-- Mane -->
    <path d="M35,-15 Q45,-45 52,-55" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
    <circle cx="68" cy="-38" r="3.5" fill="#0f172a"/>
    <!-- Tail -->
    <path d="M-60,0 Q-85,25 -75,55" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}
