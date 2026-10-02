import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderCinema as renderCinema01 } from "./master-scenes-2.mjs";

export { renderCinema01 };

// Scene 2: "Cinema ao ar livre"
export function renderCinema02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cinema ao ar livre - Sinema</title>
  <desc>Ghibli anime art: Cinema ao ar livre com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 480) scale(1.4)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(600, 680) scale(1.25)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 3: "Cabine de projeção"
export function renderCinema03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cabine de projeção - Sinema</title>
  <desc>Ghibli anime art: Cabine de projeção com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(250, 480) scale(0.9)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(720, 520) scale(1.4)" filter="url(#dropShadow)">
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
    <polygon points="70,-5 600,-150 600,140" fill="#fef08a" opacity="0.22" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(980, 560) scale(1.15)" filter="url(#dropShadow)">
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
  </g>
      
</svg>`;
}

// Scene 4: "Noite de estreia"
export function renderCinema04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Noite de estreia - Sinema</title>
  <desc>Ghibli anime art: Noite de estreia com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#334155"/>
        <g transform="translate(600, 480) scale(1.45)" filter="url(#dropShadow)">
    <!-- Art Deco Cinema Facade -->
    <rect x="-110" y="-120" width="220" height="200" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <!-- Marquee Canopy with neon bulbs -->
    <polygon points="-125,-60 125,-60 100,-10 -100,-10" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <circle cx="-90" cy="-15" r="5" fill="#fef08a"/><circle cx="-60" cy="-15" r="5" fill="#fef08a"/><circle cx="-30" cy="-15" r="5" fill="#fef08a"/><circle cx="0" cy="-15" r="5" fill="#fef08a"/><circle cx="30" cy="-15" r="5" fill="#fef08a"/><circle cx="60" cy="-15" r="5" fill="#fef08a"/><circle cx="90" cy="-15" r="5" fill="#fef08a"/>
    <!-- Glowing "SINEMA" sign -->
    <rect x="-80" y="-105" width="160" height="35" rx="6" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
    <text x="0" y="-81" font-family="sans-serif" font-weight="900" font-size="20" fill="#facc15" text-anchor="middle" letter-spacing="4">SINEMA</text>
    <!-- Entrance Doors -->
    <rect x="-40" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="5" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Posters in glass frames -->
    <rect x="-95" y="5" width="35" height="55" rx="2" fill="#38bdf8" stroke="#facc15" stroke-width="1.5"/>
    <rect x="60" y="5" width="35" height="55" rx="2" fill="#f43f5e" stroke="#facc15" stroke-width="1.5"/>
  </g>
        <g transform="translate(280, 680) scale(1.35)" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    
      <circle cx="-30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-30" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="-15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="0" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="30" cy="-28" r="6" fill="#fde047"/>
    
    
      <circle cx="-20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-20" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="0" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="20" cy="-42" r="7" fill="#fde047"/>
    
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(920, 690) scale(1.4)" filter="url(#dropShadow)">
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
  </g>
      
</svg>`;
}

// Scene 5: "Filmagem no bosque"
export function renderCinema05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Filmagem no bosque - Sinema</title>
  <desc>Ghibli anime art: Filmagem no bosque com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,520 750,570 T1250,550 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(540, 570) scale(1.45)" filter="url(#dropShadow)">
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
  </g>
        <g transform="translate(880, 660) scale(1)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 6: "Sala de cinema clássica"
export function renderCinema06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Sala de cinema clássica - Sinema</title>
  <desc>Ghibli anime art: Sala de cinema clássica com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 200, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#1e1b4b"/>
        <g transform="translate(600, 380) scale(1.35)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(600, 590) scale(1.35)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
        <g transform="translate(220, 680) scale(1.4)" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    
      <circle cx="-30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-30" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="-15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="0" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="30" cy="-28" r="6" fill="#fde047"/>
    
    
      <circle cx="-20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-20" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="0" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="20" cy="-42" r="7" fill="#fde047"/>
    
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 7: "Festival de curtas"
export function renderCinema07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Festival de curtas - Sinema</title>
  <desc>Ghibli anime art: Festival de curtas com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(420, 560) scale(1.4)" filter="url(#dropShadow)">
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
  </g>
        <g transform="translate(820, 680) scale(1.5)" filter="url(#dropShadow)">
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
  </g>
      
</svg>`;
}

// Scene 8: "Projetor sob as estrelas"
export function renderCinema08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Projetor sob as estrelas - Sinema</title>
  <desc>Ghibli anime art: Projetor sob as estrelas com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <g transform="translate(340, 480) scale(1.25)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(820, 540) scale(1.35)" filter="url(#dropShadow)">
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
    <polygon points="70,-5 600,-150 600,140" fill="#fef08a" opacity="0.22" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(550, 680) scale(1.15)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 9: "Bilheteria do cinema"
export function renderCinema09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Bilheteria do cinema - Sinema</title>
  <desc>Ghibli anime art: Bilheteria do cinema com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#475569"/>
        <g transform="translate(540, 480) scale(1.4)" filter="url(#dropShadow)">
    <!-- Art Deco Cinema Facade -->
    <rect x="-110" y="-120" width="220" height="200" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <!-- Marquee Canopy with neon bulbs -->
    <polygon points="-125,-60 125,-60 100,-10 -100,-10" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <circle cx="-90" cy="-15" r="5" fill="#fef08a"/><circle cx="-60" cy="-15" r="5" fill="#fef08a"/><circle cx="-30" cy="-15" r="5" fill="#fef08a"/><circle cx="0" cy="-15" r="5" fill="#fef08a"/><circle cx="30" cy="-15" r="5" fill="#fef08a"/><circle cx="60" cy="-15" r="5" fill="#fef08a"/><circle cx="90" cy="-15" r="5" fill="#fef08a"/>
    <!-- Glowing "SINEMA" sign -->
    <rect x="-80" y="-105" width="160" height="35" rx="6" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
    <text x="0" y="-81" font-family="sans-serif" font-weight="900" font-size="20" fill="#facc15" text-anchor="middle" letter-spacing="4">SINEMA</text>
    <!-- Entrance Doors -->
    <rect x="-40" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="5" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Posters in glass frames -->
    <rect x="-95" y="5" width="35" height="55" rx="2" fill="#38bdf8" stroke="#facc15" stroke-width="1.5"/>
    <rect x="60" y="5" width="35" height="55" rx="2" fill="#f43f5e" stroke="#facc15" stroke-width="1.5"/>
  </g>
        <g transform="translate(880, 680) scale(1.4)" filter="url(#dropShadow)">
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
  </g>
        <g transform="translate(240, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    
      <circle cx="-30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-30" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="-15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="0" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="30" cy="-28" r="6" fill="#fde047"/>
    
    
      <circle cx="-20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-20" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="0" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="20" cy="-42" r="7" fill="#fde047"/>
    
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 10: "Estúdio de gravação"
export function renderCinema10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Estúdio de gravação - Sinema</title>
  <desc>Ghibli anime art: Estúdio de gravação com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <rect width="1200" height="800" fill="#1e293b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="#334155"/>
        <g transform="translate(300, 480) scale(1.1)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(680, 560) scale(1.35)" filter="url(#dropShadow)">
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
  </g>
        <g transform="translate(980, 550) scale(1.2)" filter="url(#dropShadow)">
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
    
  </g>
      
</svg>`;
}

// Scene 11: "Cineclube na praça florida"
export function renderCinema11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cineclube na praça florida - Sinema</title>
  <desc>Ghibli anime art: Cineclube na praça florida com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(600, 460) scale(1.35)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(600, 670) scale(1.3)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 12: "Rolo de filme e câmera retrô"
export function renderCinema12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Rolo de filme e câmera retrô - Sinema</title>
  <desc>Ghibli anime art: Rolo de filme e câmera retrô com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(360, 560) scale(1.4)" filter="url(#dropShadow)">
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
  </g>
        <g transform="translate(720, 540) scale(1.3)" filter="url(#dropShadow)">
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
    
  </g>
        <g transform="translate(980, 680) scale(1.35)" filter="url(#dropShadow)">
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
  </g>
      
</svg>`;
}

// Scene 13: "Sacola de pipoca e ingressos"
export function renderCinema13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Sacola de pipoca e ingressos - Sinema</title>
  <desc>Ghibli anime art: Sacola de pipoca e ingressos com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#334155"/>
        <g transform="translate(780, 480) scale(1.25)" filter="url(#dropShadow)">
    <!-- Art Deco Cinema Facade -->
    <rect x="-110" y="-120" width="220" height="200" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <!-- Marquee Canopy with neon bulbs -->
    <polygon points="-125,-60 125,-60 100,-10 -100,-10" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <circle cx="-90" cy="-15" r="5" fill="#fef08a"/><circle cx="-60" cy="-15" r="5" fill="#fef08a"/><circle cx="-30" cy="-15" r="5" fill="#fef08a"/><circle cx="0" cy="-15" r="5" fill="#fef08a"/><circle cx="30" cy="-15" r="5" fill="#fef08a"/><circle cx="60" cy="-15" r="5" fill="#fef08a"/><circle cx="90" cy="-15" r="5" fill="#fef08a"/>
    <!-- Glowing "SINEMA" sign -->
    <rect x="-80" y="-105" width="160" height="35" rx="6" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
    <text x="0" y="-81" font-family="sans-serif" font-weight="900" font-size="20" fill="#facc15" text-anchor="middle" letter-spacing="4">SINEMA</text>
    <!-- Entrance Doors -->
    <rect x="-40" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="5" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Posters in glass frames -->
    <rect x="-95" y="5" width="35" height="55" rx="2" fill="#38bdf8" stroke="#facc15" stroke-width="1.5"/>
    <rect x="60" y="5" width="35" height="55" rx="2" fill="#f43f5e" stroke="#facc15" stroke-width="1.5"/>
  </g>
        <g transform="translate(380, 650) scale(1.55)" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    
      <circle cx="-30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-30" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="-15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="0" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="30" cy="-28" r="6" fill="#fde047"/>
    
    
      <circle cx="-20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-20" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="0" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="20" cy="-42" r="7" fill="#fde047"/>
    
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
        <g transform="translate(560, 680) scale(1.4)" filter="url(#dropShadow)">
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
  </g>
      
</svg>`;
}

// Scene 14: "Sessão cinema na praia à noite"
export function renderCinema14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Sessão cinema na praia à noite - Sinema</title>
  <desc>Ghibli anime art: Sessão cinema na praia à noite com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(960, 180, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 L1250,540 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="#451a03"/>
        <g transform="translate(500, 460) scale(1.3)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(500, 660) scale(1.2)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
        <g transform="translate(900, 680) scale(1.35)" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    
      <circle cx="-30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-30" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="-15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="0" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="30" cy="-28" r="6" fill="#fde047"/>
    
    
      <circle cx="-20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-20" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="0" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="20" cy="-42" r="7" fill="#fde047"/>
    
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 15: "Iluminação de cena no estúdio"
export function renderCinema15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Iluminação de cena no estúdio - Sinema</title>
  <desc>Ghibli anime art: Iluminação de cena no estúdio com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#1e293b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="#334155"/>
        <g transform="translate(280, 480) scale(1.15)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(680, 560) scale(1.4)" filter="url(#dropShadow)">
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
  </g>
        <g transform="translate(960, 660) scale(0.95)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 16: "Fachada neon do cinema"
export function renderCinema16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Fachada neon do cinema - Sinema</title>
  <desc>Ghibli anime art: Fachada neon do cinema com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#1e293b"/>
        <g transform="translate(560, 470) scale(1.5)" filter="url(#dropShadow)">
    <!-- Art Deco Cinema Facade -->
    <rect x="-110" y="-120" width="220" height="200" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <!-- Marquee Canopy with neon bulbs -->
    <polygon points="-125,-60 125,-60 100,-10 -100,-10" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <circle cx="-90" cy="-15" r="5" fill="#fef08a"/><circle cx="-60" cy="-15" r="5" fill="#fef08a"/><circle cx="-30" cy="-15" r="5" fill="#fef08a"/><circle cx="0" cy="-15" r="5" fill="#fef08a"/><circle cx="30" cy="-15" r="5" fill="#fef08a"/><circle cx="60" cy="-15" r="5" fill="#fef08a"/><circle cx="90" cy="-15" r="5" fill="#fef08a"/>
    <!-- Glowing "SINEMA" sign -->
    <rect x="-80" y="-105" width="160" height="35" rx="6" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
    <text x="0" y="-81" font-family="sans-serif" font-weight="900" font-size="20" fill="#facc15" text-anchor="middle" letter-spacing="4">SINEMA</text>
    <!-- Entrance Doors -->
    <rect x="-40" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="5" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Posters in glass frames -->
    <rect x="-95" y="5" width="35" height="55" rx="2" fill="#38bdf8" stroke="#facc15" stroke-width="1.5"/>
    <rect x="60" y="5" width="35" height="55" rx="2" fill="#f43f5e" stroke="#facc15" stroke-width="1.5"/>
  </g>
        <g transform="translate(950, 680) scale(1.4)" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    
      <circle cx="-30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-30" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="-15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="0" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="30" cy="-28" r="6" fill="#fde047"/>
    
    
      <circle cx="-20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-20" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="0" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="20" cy="-42" r="7" fill="#fde047"/>
    
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 17: "Filmagem no jardim arborizado"
export function renderCinema17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Filmagem no jardim arborizado - Sinema</title>
  <desc>Ghibli anime art: Filmagem no jardim arborizado com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,580 Q350,520 750,570 T1250,550 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(450, 560) scale(1.4)" filter="url(#dropShadow)">
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
  </g>
        <g transform="translate(820, 680) scale(1.35)" filter="url(#dropShadow)">
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
  </g>
      
</svg>`;
}

// Scene 18: "Sala com poltronas confortáveis"
export function renderCinema18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Sala com poltronas confortáveis - Sinema</title>
  <desc>Ghibli anime art: Sala com poltronas confortáveis com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#31101e"/>
        <g transform="translate(600, 390) scale(1.35)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(600, 600) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <!-- Velvet Red Theater Seat -->
        <rect x="-26" y="-45" width="52" height="45" rx="6" fill="#be123c" stroke="#881337" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="18" rx="4" fill="#9f1239" stroke="#881337" stroke-width="2"/>
        <line x1="-28" y1="18" x2="-28" y2="50" stroke="#1c1917" stroke-width="4"/>
        <line x1="28" y1="18" x2="28" y2="50" stroke="#1c1917" stroke-width="4"/>
      </g>
    
  </g>
        <g transform="translate(1020, 620) scale(1.05)" filter="url(#dropShadow)">
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
    <polygon points="70,-5 600,-150 600,140" fill="#fef08a" opacity="0.22" filter="url(#softGlow)"/>
  </g>
      
</svg>`;
}

// Scene 19: "Projetor no piquenique do parque"
export function renderCinema19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Projetor no piquenique do parque - Sinema</title>
  <desc>Ghibli anime art: Projetor no piquenique do parque com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(380, 480) scale(1.25)" filter="url(#dropShadow)">
    <!-- Projection Screen Frame -->
    <rect x="-140" y="-90" width="280" height="170" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <!-- Glowing White/Silver Screen Canvas -->
    <rect x="-130" y="-80" width="260" height="150" rx="3" fill="#f8fafc"/>
    <ellipse cx="0" cy="-5" rx="100" ry="60" fill="#e0f2fe" opacity="0.6" filter="url(#softGlow)"/>
    <!-- Screen Stands -->
    <line x1="-100" y1="80" x2="-100" y2="120" stroke="#334155" stroke-width="6"/>
    <line x1="100" y1="80" x2="100" y2="120" stroke="#334155" stroke-width="6"/>
  </g>
        <g transform="translate(780, 560) scale(1.35)" filter="url(#dropShadow)">
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
    <polygon points="70,-5 600,-150 600,140" fill="#fef08a" opacity="0.22" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(980, 680) scale(1.35)" filter="url(#dropShadow)">
    <!-- Popcorn Tub -->
    <polygon points="-35,50 35,50 45,-25 -45,-25" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-30,50 -20,50 -25,-25 -38,-25" fill="#dc2626"/>
    <polygon points="-8,50 2,50 5,-25 -7,-25" fill="#dc2626"/>
    <polygon points="15,50 25,50 35,-25 23,-25" fill="#dc2626"/>
    <!-- Overflowing Golden Popcorn Puffs -->
    
      <circle cx="-30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-30" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="-15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="0" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="15" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="15" cy="-28" r="6" fill="#fde047"/>
    
      <circle cx="30" cy="-28" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="30" cy="-28" r="6" fill="#fde047"/>
    
    
      <circle cx="-20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="-20" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="0" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="0" cy="-42" r="7" fill="#fde047"/>
    
      <circle cx="20" cy="-42" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="20" cy="-42" r="7" fill="#fde047"/>
    
    <circle cx="-8" cy="-56" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="10" cy="-54" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 20: "Noite de gala do festival"
export function renderCinema20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Noite de gala do festival - Sinema</title>
  <desc>Ghibli anime art: Noite de gala do festival com telas, projetor e magia cinematográfica.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <g transform="translate(560, 460) scale(1.55)" filter="url(#dropShadow)">
    <!-- Art Deco Cinema Facade -->
    <rect x="-110" y="-120" width="220" height="200" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <!-- Marquee Canopy with neon bulbs -->
    <polygon points="-125,-60 125,-60 100,-10 -100,-10" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <circle cx="-90" cy="-15" r="5" fill="#fef08a"/><circle cx="-60" cy="-15" r="5" fill="#fef08a"/><circle cx="-30" cy="-15" r="5" fill="#fef08a"/><circle cx="0" cy="-15" r="5" fill="#fef08a"/><circle cx="30" cy="-15" r="5" fill="#fef08a"/><circle cx="60" cy="-15" r="5" fill="#fef08a"/><circle cx="90" cy="-15" r="5" fill="#fef08a"/>
    <!-- Glowing "SINEMA" sign -->
    <rect x="-80" y="-105" width="160" height="35" rx="6" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
    <text x="0" y="-81" font-family="sans-serif" font-weight="900" font-size="20" fill="#facc15" text-anchor="middle" letter-spacing="4">SINEMA</text>
    <!-- Entrance Doors -->
    <rect x="-40" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="5" y="0" width="35" height="80" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Posters in glass frames -->
    <rect x="-95" y="5" width="35" height="55" rx="2" fill="#38bdf8" stroke="#facc15" stroke-width="1.5"/>
    <rect x="60" y="5" width="35" height="55" rx="2" fill="#f43f5e" stroke="#facc15" stroke-width="1.5"/>
  </g>
        <g transform="translate(240, 680) scale(1.45)" filter="url(#dropShadow)">
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
  </g>
      
</svg>`;
}
