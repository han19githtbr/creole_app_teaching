import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderLazeres as renderLazeres01 } from "./master-scenes-2.mjs";

export { renderLazeres01 };

// Scene 2: "Piquenique no parque"
export function renderLazeres02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Piquenique no parque - Lwazi</title>
  <desc>Ghibli anime art: Piquenique no parque com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(550, 680) scale(1.4)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
        <g transform="translate(550, 670) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-35" y="-15" width="70" height="40" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-35" y1="-5" x2="35" y2="-5" stroke="#b45309" stroke-width="2"/>
    <line x1="-35" y1="10" x2="35" y2="10" stroke="#b45309" stroke-width="2"/>
    <!-- Basket handles -->
    <path d="M-20,-15 Q0,-45 20,-15" stroke="#78350f" stroke-width="4" fill="none"/>
    <!-- Red apple & baguette sticking out -->
    <circle cx="-12" cy="-18" r="8" fill="#ef4444"/>
    <rect x="5" y="-32" width="12" height="28" rx="5" fill="#f59e0b" transform="rotate(20 5 -32)"/>
  </g>
      
</svg>`;
}

// Scene 3: "Pipas no campo"
export function renderLazeres03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pipas no campo - Lwazi</title>
  <desc>Ghibli anime art: Pipas no campo com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(420, 220) scale(1.35)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#facc15"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(820, 180) scale(0.9)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#3b82f6" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#ec4899"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(280, 690) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 4: "Passeio de bicicleta"
export function renderLazeres04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Passeio de bicicleta - Lwazi</title>
  <desc>Ghibli anime art: Passeio de bicicleta com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(580, 640) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="80" ry="14" fill="#000000" opacity="0.3"/>
    <!-- Wheels -->
    <circle cx="-55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-55" cy="20" r="4" fill="#0f172a"/>
    <line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 -55 20)"/>
    
    <circle cx="55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="55" cy="20" r="4" fill="#0f172a"/>
    <line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 55 20)"/>
    
    <!-- Vintage Turquoise Frame -->
    <line x1="-55" y1="20" x2="-10" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-55" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-25" y1="-20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="35" y1="-20" x2="55" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <!-- Handlebars and Wicker Basket -->
    <path d="M35,-20 L40,-45 Q45,-55 60,-50" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="42" y="-45" width="22" height="18" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
    <!-- Saddle -->
    <path d="M-35,-25 Q-25,-32 -15,-25" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 5: "Tarde no lago"
export function renderLazeres05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Tarde no lago - Lwazi</title>
  <desc>Ghibli anime art: Tarde no lago com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Lake Basin -->
  <path d="M-50,560 Q300,510 650,550 T1250,530 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <ellipse cx="600" cy="670" rx="420" ry="90" fill="#5eead4" opacity="0.5"/>
        <g transform="translate(420, 620) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(580, 640) scale(0.95)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(850, 690) scale(1.15)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
      
</svg>`;
}

// Scene 6: "Balanço no jardim"
export function renderLazeres06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Balanço no jardim - Lwazi</title>
  <desc>Ghibli anime art: Balanço no jardim com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(550, 480) scale(1.45)" filter="url(#dropShadow)">
    <!-- High Overhanging Tree Branch -->
    <path d="M-80,-140 Q0,-125 120,-140" stroke="#451a03" stroke-width="18" fill="none"/>
    <!-- Hanging Ropes -->
    <line x1="-25" y1="-130" x2="-25" y2="20" stroke="#d97706" stroke-width="3"/>
    <line x1="25" y1="-130" x2="25" y2="20" stroke="#d97706" stroke-width="3"/>
    <!-- Wooden Seat Plank -->
    <rect x="-35" y="20" width="70" height="10" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
  </g>
        <g transform="translate(820, 690) scale(1.3)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 7: "Jogos ao ar livre"
export function renderLazeres07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Jogos ao ar livre - Lwazi</title>
  <desc>Ghibli anime art: Jogos ao ar livre com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(780, 220) scale(1.25)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#f59e0b" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#10b981"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(380, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
        <g transform="translate(380, 670) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-35" y="-15" width="70" height="40" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-35" y1="-5" x2="35" y2="-5" stroke="#b45309" stroke-width="2"/>
    <line x1="-35" y1="10" x2="35" y2="10" stroke="#b45309" stroke-width="2"/>
    <!-- Basket handles -->
    <path d="M-20,-15 Q0,-45 20,-15" stroke="#78350f" stroke-width="4" fill="none"/>
    <!-- Red apple & baguette sticking out -->
    <circle cx="-12" cy="-18" r="8" fill="#ef4444"/>
    <rect x="5" y="-32" width="12" height="28" rx="5" fill="#f59e0b" transform="rotate(20 5 -32)"/>
  </g>
        <g transform="translate(680, 690) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 8: "Leitura sob a árvore"
export function renderLazeres08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Leitura sob a árvore - Lwazi</title>
  <desc>Ghibli anime art: Leitura sob a árvore com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 680) scale(1.45)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
        <g transform="translate(260, 670) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
      
</svg>`;
}

// Scene 9: "Passeio entre flores"
export function renderLazeres09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Passeio entre flores - Lwazi</title>
  <desc>Ghibli anime art: Passeio entre flores com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(340, 210) scale(1.2)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#8b5cf6" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#fef08a"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(650, 640) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="80" ry="14" fill="#000000" opacity="0.3"/>
    <!-- Wheels -->
    <circle cx="-55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-55" cy="20" r="4" fill="#0f172a"/>
    <line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 -55 20)"/>
    
    <circle cx="55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="55" cy="20" r="4" fill="#0f172a"/>
    <line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 55 20)"/>
    
    <!-- Vintage Turquoise Frame -->
    <line x1="-55" y1="20" x2="-10" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-55" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-25" y1="-20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="35" y1="-20" x2="55" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <!-- Handlebars and Wicker Basket -->
    <path d="M35,-20 L40,-45 Q45,-55 60,-50" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="42" y="-45" width="22" height="18" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
    <!-- Saddle -->
    <path d="M-35,-25 Q-25,-32 -15,-25" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 10: "Domingo no parque"
export function renderLazeres10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Domingo no parque - Lwazi</title>
  <desc>Ghibli anime art: Domingo no parque com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(420, 480) scale(1.35)" filter="url(#dropShadow)">
    <!-- High Overhanging Tree Branch -->
    <path d="M-80,-140 Q0,-125 120,-140" stroke="#451a03" stroke-width="18" fill="none"/>
    <!-- Hanging Ropes -->
    <line x1="-25" y1="-130" x2="-25" y2="20" stroke="#d97706" stroke-width="3"/>
    <line x1="25" y1="-130" x2="25" y2="20" stroke="#d97706" stroke-width="3"/>
    <!-- Wooden Seat Plank -->
    <rect x="-35" y="20" width="70" height="10" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
  </g>
        <g transform="translate(780, 670) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-35" y="-15" width="70" height="40" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-35" y1="-5" x2="35" y2="-5" stroke="#b45309" stroke-width="2"/>
    <line x1="-35" y1="10" x2="35" y2="10" stroke="#b45309" stroke-width="2"/>
    <!-- Basket handles -->
    <path d="M-20,-15 Q0,-45 20,-15" stroke="#78350f" stroke-width="4" fill="none"/>
    <!-- Red apple & baguette sticking out -->
    <circle cx="-12" cy="-18" r="8" fill="#ef4444"/>
    <rect x="5" y="-32" width="12" height="28" rx="5" fill="#f59e0b" transform="rotate(20 5 -32)"/>
  </g>
        <g transform="translate(950, 680) scale(1.2)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(240, 690) scale(1.3)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 11: "Revoada de pipas na colina"
export function renderLazeres11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Revoada de pipas na colina - Lwazi</title>
  <desc>Ghibli anime art: Revoada de pipas na colina com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(360, 210) scale(1.35)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#38bdf8"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(700, 180) scale(1.15)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#facc15" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#10b981"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(950, 240) scale(0.95)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#ec4899" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#fef08a"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(480, 690) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 12: "Piquenique com cesta de vime"
export function renderLazeres12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Piquenique com cesta de vime - Lwazi</title>
  <desc>Ghibli anime art: Piquenique com cesta de vime com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Lake Basin -->
  <path d="M-50,560 Q300,510 650,550 T1250,530 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <ellipse cx="600" cy="670" rx="420" ry="90" fill="#5eead4" opacity="0.5"/>
        <g transform="translate(820, 620) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(920, 640) scale(0.9)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(440, 680) scale(1.4)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
        <g transform="translate(440, 670) scale(1.4)" filter="url(#dropShadow)">
    <rect x="-35" y="-15" width="70" height="40" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-35" y1="-5" x2="35" y2="-5" stroke="#b45309" stroke-width="2"/>
    <line x1="-35" y1="10" x2="35" y2="10" stroke="#b45309" stroke-width="2"/>
    <!-- Basket handles -->
    <path d="M-20,-15 Q0,-45 20,-15" stroke="#78350f" stroke-width="4" fill="none"/>
    <!-- Red apple & baguette sticking out -->
    <circle cx="-12" cy="-18" r="8" fill="#ef4444"/>
    <rect x="5" y="-32" width="12" height="28" rx="5" fill="#f59e0b" transform="rotate(20 5 -32)"/>
  </g>
      
</svg>`;
}

// Scene 13: "Bicicleta no caminho florido"
export function renderLazeres13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Bicicleta no caminho florido - Lwazi</title>
  <desc>Ghibli anime art: Bicicleta no caminho florido com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(580, 640) scale(1.5)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="80" ry="14" fill="#000000" opacity="0.3"/>
    <!-- Wheels -->
    <circle cx="-55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-55" cy="20" r="4" fill="#0f172a"/>
    <line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 -55 20)"/>
    
    <circle cx="55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="55" cy="20" r="4" fill="#0f172a"/>
    <line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 55 20)"/>
    
    <!-- Vintage Turquoise Frame -->
    <line x1="-55" y1="20" x2="-10" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-55" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-25" y1="-20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="35" y1="-20" x2="55" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <!-- Handlebars and Wicker Basket -->
    <path d="M35,-20 L40,-45 Q45,-55 60,-50" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="42" y="-45" width="22" height="18" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
    <!-- Saddle -->
    <path d="M-35,-25 Q-25,-32 -15,-25" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 14: "Balanço de corda no bosque"
export function renderLazeres14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Balanço de corda no bosque - Lwazi</title>
  <desc>Ghibli anime art: Balanço de corda no bosque com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(580, 480) scale(1.45)" filter="url(#dropShadow)">
    <!-- High Overhanging Tree Branch -->
    <path d="M-80,-140 Q0,-125 120,-140" stroke="#451a03" stroke-width="18" fill="none"/>
    <!-- Hanging Ropes -->
    <line x1="-25" y1="-130" x2="-25" y2="20" stroke="#d97706" stroke-width="3"/>
    <line x1="25" y1="-130" x2="25" y2="20" stroke="#d97706" stroke-width="3"/>
    <!-- Wooden Seat Plank -->
    <rect x="-35" y="20" width="70" height="10" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
  </g>
        <g transform="translate(320, 690) scale(1.2)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
      
</svg>`;
}

// Scene 15: "Lago dos patos ao entardecer"
export function renderLazeres15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Lago dos patos ao entardecer - Lwazi</title>
  <desc>Ghibli anime art: Lago dos patos ao entardecer com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Lake Basin -->
  <path d="M-50,560 Q300,510 650,550 T1250,530 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <ellipse cx="600" cy="670" rx="420" ry="90" fill="#5eead4" opacity="0.5"/>
        <g transform="translate(480, 620) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(620, 640) scale(1.05)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(860, 680) scale(1.25)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
        <g transform="translate(860, 670) scale(1.2)" filter="url(#dropShadow)">
    <rect x="-35" y="-15" width="70" height="40" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-35" y1="-5" x2="35" y2="-5" stroke="#b45309" stroke-width="2"/>
    <line x1="-35" y1="10" x2="35" y2="10" stroke="#b45309" stroke-width="2"/>
    <!-- Basket handles -->
    <path d="M-20,-15 Q0,-45 20,-15" stroke="#78350f" stroke-width="4" fill="none"/>
    <!-- Red apple & baguette sticking out -->
    <circle cx="-12" cy="-18" r="8" fill="#ef4444"/>
    <rect x="5" y="-32" width="12" height="28" rx="5" fill="#f59e0b" transform="rotate(20 5 -32)"/>
  </g>
      
</svg>`;
}

// Scene 16: "Jogo de bola no gramado"
export function renderLazeres16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Jogo de bola no gramado - Lwazi</title>
  <desc>Ghibli anime art: Jogo de bola no gramado com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(360, 640) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="80" ry="14" fill="#000000" opacity="0.3"/>
    <!-- Wheels -->
    <circle cx="-55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-55" cy="20" r="4" fill="#0f172a"/>
    <line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 -55 20)"/>
    
    <circle cx="55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="55" cy="20" r="4" fill="#0f172a"/>
    <line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 55 20)"/>
    
    <!-- Vintage Turquoise Frame -->
    <line x1="-55" y1="20" x2="-10" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-55" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-25" y1="-20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="35" y1="-20" x2="55" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <!-- Handlebars and Wicker Basket -->
    <path d="M35,-20 L40,-45 Q45,-55 60,-50" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="42" y="-45" width="22" height="18" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
    <!-- Saddle -->
    <path d="M-35,-25 Q-25,-32 -15,-25" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  </g>
        <g transform="translate(750, 670) scale(1.5)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 17: "Cantinho de leitura no jardim"
export function renderLazeres17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cantinho de leitura no jardim - Lwazi</title>
  <desc>Ghibli anime art: Cantinho de leitura no jardim com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(420, 480) scale(1.35)" filter="url(#dropShadow)">
    <!-- High Overhanging Tree Branch -->
    <path d="M-80,-140 Q0,-125 120,-140" stroke="#451a03" stroke-width="18" fill="none"/>
    <!-- Hanging Ropes -->
    <line x1="-25" y1="-130" x2="-25" y2="20" stroke="#d97706" stroke-width="3"/>
    <line x1="25" y1="-130" x2="25" y2="20" stroke="#d97706" stroke-width="3"/>
    <!-- Wooden Seat Plank -->
    <rect x="-35" y="20" width="70" height="10" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
  </g>
        <g transform="translate(750, 680) scale(1.35)" filter="url(#dropShadow)">
    <!-- Red & White Checkered Picnic Blanket -->
    <polygon points="-110,-25 110,-25 135,35 -135,35" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    
      <line x1="-80" y1="-25" x2="-96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="-40" y1="-25" x2="-48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="0" y1="-25" x2="0" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="40" y1="-25" x2="48" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
      <line x1="80" y1="-25" x2="96" y2="35" stroke="#ef4444" stroke-width="12" opacity="0.65"/>
    
  </g>
      
</svg>`;
}

// Scene 18: "Pipa colorida sobre os campos"
export function renderLazeres18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pipa colorida sobre os campos - Lwazi</title>
  <desc>Ghibli anime art: Pipa colorida sobre os campos com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(480, 220) scale(1.45)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#fde047"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(820, 640) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="80" ry="14" fill="#000000" opacity="0.3"/>
    <!-- Wheels -->
    <circle cx="-55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-55" cy="20" r="4" fill="#0f172a"/>
    <line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 -55 20)"/>
    
    <circle cx="55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="55" cy="20" r="4" fill="#0f172a"/>
    <line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 55 20)"/>
    
    <!-- Vintage Turquoise Frame -->
    <line x1="-55" y1="20" x2="-10" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-55" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-25" y1="-20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="35" y1="-20" x2="55" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <!-- Handlebars and Wicker Basket -->
    <path d="M35,-20 L40,-45 Q45,-55 60,-50" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="42" y="-45" width="22" height="18" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
    <!-- Saddle -->
    <path d="M-35,-25 Q-25,-32 -15,-25" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  </g>
        <g transform="translate(240, 690) scale(1.3)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 19: "Tarde ensolarada na lagoa"
export function renderLazeres19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Tarde ensolarada na lagoa - Lwazi</title>
  <desc>Ghibli anime art: Tarde ensolarada na lagoa com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Lake Basin -->
  <path d="M-50,560 Q300,510 650,550 T1250,530 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <ellipse cx="600" cy="670" rx="420" ry="90" fill="#5eead4" opacity="0.5"/>
        <g transform="translate(420, 620) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(560, 635) scale(1)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="12" rx="28" ry="8" fill="#0f766e" opacity="0.4"/>
    <!-- Duck Body -->
    <ellipse cx="0" cy="0" rx="25" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="16" cy="-14" r="11" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Beak -->
    <polygon points="25,-14 34,-11 25,-8" fill="#f97316"/>
    <circle cx="18" cy="-16" r="2" fill="#0f172a"/>
    <!-- Wing -->
    <path d="M-10,0 Q2,8 10,0 Q0,-6 -10,0 Z" fill="#fde047"/>
  </g>
        <g transform="translate(820, 670) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-35" y="-15" width="70" height="40" rx="6" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-35" y1="-5" x2="35" y2="-5" stroke="#b45309" stroke-width="2"/>
    <line x1="-35" y1="10" x2="35" y2="10" stroke="#b45309" stroke-width="2"/>
    <!-- Basket handles -->
    <path d="M-20,-15 Q0,-45 20,-15" stroke="#78350f" stroke-width="4" fill="none"/>
    <!-- Red apple & baguette sticking out -->
    <circle cx="-12" cy="-18" r="8" fill="#ef4444"/>
    <rect x="5" y="-32" width="12" height="28" rx="5" fill="#f59e0b" transform="rotate(20 5 -32)"/>
  </g>
        <g transform="translate(250, 680) scale(1.3)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <path d="M-22,0 Q0,-15 22,0 Q0,15 -22,0 Z" fill="#facc15"/>
    <path d="M0,-22 Q-15,0 0,22 Q15,0 0,-22 Z" fill="#3b82f6"/>
  </g>
      
</svg>`;
}

// Scene 20: "Passeio de bicicleta no fim da tarde"
export function renderLazeres20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Passeio de bicicleta no fim da tarde - Lwazi</title>
  <desc>Ghibli anime art: Passeio de bicicleta no fim da tarde com pipas, passeios e momentos de lazer.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Rolling Lush Green Park Meadow -->
  <path d="M-50,560 Q320,500 680,550 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,630 Q350,580 750,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(820, 230) scale(1.2)" filter="url(#dropShadow)">
    <!-- Diamond Kite -->
    <polygon points="0,-75 55,0 0,75 -55,0" fill="#3b82f6" stroke="#991b1b" stroke-width="2"/>
    <polygon points="0,-75 0,75 -55,0" fill="#f59e0b"/>
    <!-- Cross struts -->
    <line x1="0" y1="-75" x2="0" y2="75" stroke="#78350f" stroke-width="2.5"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#78350f" stroke-width="2.5"/>
    <!-- String and tail with bows -->
    <path d="M0,75 Q35,130 15,185 T45,260 T25,330" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    
      <polygon points="20,-2+120 10,-8+120 10,4+120" fill="#f43f5e"/>
      <polygon points="20,-2+120 30,-8+120 30,4+120" fill="#f43f5e"/>
      <circle cx="20" cy="118" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+180 10,-8+180 10,4+180" fill="#f43f5e"/>
      <polygon points="20,-2+180 30,-8+180 30,4+180" fill="#f43f5e"/>
      <circle cx="20" cy="178" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+240 10,-8+240 10,4+240" fill="#f43f5e"/>
      <polygon points="20,-2+240 30,-8+240 30,4+240" fill="#f43f5e"/>
      <circle cx="20" cy="238" r="3" fill="#facc15"/>
    
      <polygon points="20,-2+300 10,-8+300 10,4+300" fill="#f43f5e"/>
      <polygon points="20,-2+300 30,-8+300 30,4+300" fill="#f43f5e"/>
      <circle cx="20" cy="298" r="3" fill="#facc15"/>
    
  </g>
        <g transform="translate(500, 640) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="80" ry="14" fill="#000000" opacity="0.3"/>
    <!-- Wheels -->
    <circle cx="-55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-55" cy="20" r="4" fill="#0f172a"/>
    <line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 -55 20)"/><line x1="-55" y1="-12" x2="-55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 -55 20)"/>
    
    <circle cx="55" cy="20" r="32" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="55" cy="20" r="4" fill="#0f172a"/>
    <line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(0 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(45 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(90 55 20)"/><line x1="55" y1="-12" x2="55" y2="52" stroke="#94a3b8" stroke-width="1.5" transform="rotate(135 55 20)"/>
    
    <!-- Vintage Turquoise Frame -->
    <line x1="-55" y1="20" x2="-10" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-55" y1="20" x2="-25" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-25" y1="-20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="-10" y1="20" x2="35" y2="-20" stroke="#06b6d4" stroke-width="5"/>
    <line x1="35" y1="-20" x2="55" y2="20" stroke="#06b6d4" stroke-width="5"/>
    <!-- Handlebars and Wicker Basket -->
    <path d="M35,-20 L40,-45 Q45,-55 60,-50" stroke="#475569" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="42" y="-45" width="22" height="18" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
    <!-- Saddle -->
    <path d="M-35,-25 Q-25,-32 -15,-25" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  </g>
      
</svg>`;
}
