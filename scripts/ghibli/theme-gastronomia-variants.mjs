import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderGastronomia as renderGastronomia01 } from "./master-scenes-2.mjs";

export { renderGastronomia01 };

// Scene 2: "Mercado de frutas"
export function renderGastronomia02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mercado de frutas - Manje</title>
  <desc>Ghibli anime art: Mercado de frutas com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 620) scale(1.4)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(460, 560) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
        <g transform="translate(740, 570) scale(1.4)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
        <g transform="translate(220, 680) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
  </g>
      
</svg>`;
}

// Scene 3: "Panela no fogão"
export function renderGastronomia03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Panela no fogão - Manje</title>
  <desc>Ghibli anime art: Panela no fogão com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        <g transform="translate(460, 560) scale(1.55)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    
  </g>
        <g transform="translate(760, 560) scale(1.4)" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>
        <g transform="translate(220, 680) scale(1.3)" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
  </g>
      
</svg>`;
}

// Scene 4: "Mesa posta para o jantar"
export function renderGastronomia04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mesa posta para o jantar - Manje</title>
  <desc>Ghibli anime art: Mesa posta para o jantar com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#woodTone)"/>
        <g transform="translate(600, 600) scale(1.55)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(600, 540) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 5: "Pães recém-assados"
export function renderGastronomia05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pães recém-assados - Manje</title>
  <desc>Ghibli anime art: Pães recém-assados com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#fef9c3" filter="url(#ghibliPaper)" />
        <polygon points="-50,580 1250,580 1250,800 -50,800" fill="url(#woodTone)"/>
        <g transform="translate(600, 620) scale(1.4)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(480, 560) scale(1.5)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
        <g transform="translate(740, 560) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
        <g transform="translate(940, 570) scale(1.3)" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>
      
</svg>`;
}

// Scene 6: "Colheita de pimentas"
export function renderGastronomia06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Colheita de pimentas - Manje</title>
  <desc>Ghibli anime art: Colheita de pimentas com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 620) scale(1.35)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(480, 570) scale(1.55)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
        <g transform="translate(720, 560) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 7: "Cozinha haitiana"
export function renderGastronomia07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cozinha haitiana - Manje</title>
  <desc>Ghibli anime art: Cozinha haitiana com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#fed7aa" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        <g transform="translate(440, 560) scale(1.5)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    
  </g>
        <g transform="translate(680, 580) scale(1.4)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
        <g transform="translate(880, 570) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
        <g transform="translate(200, 670) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
  </g>
      
</svg>`;
}

// Scene 8: "Café da manhã no campo"
export function renderGastronomia08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Café da manhã no campo - Manje</title>
  <desc>Ghibli anime art: Café da manhã no campo com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 610) scale(1.45)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(460, 550) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
        <g transform="translate(740, 550) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 9: "Feira de legumes"
export function renderGastronomia09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Feira de legumes - Manje</title>
  <desc>Ghibli anime art: Feira de legumes com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 620) scale(1.4)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(440, 560) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
  </g>
        <g transform="translate(660, 570) scale(1.4)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
        <g transform="translate(840, 570) scale(1.35)" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>
      
</svg>`;
}

// Scene 10: "Banquete sob as lanternas"
export function renderGastronomia10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Banquete sob as lanternas - Manje</title>
  <desc>Ghibli anime art: Banquete sob as lanternas com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#334155"/>
        <g transform="translate(600, 610) scale(1.45)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(600, 530) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    
  </g>
        <g transform="translate(380, 550) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 11: "Fogão a lenha com caldeirão"
export function renderGastronomia11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Fogão a lenha com caldeirão - Manje</title>
  <desc>Ghibli anime art: Fogão a lenha com caldeirão com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <rect width="1200" height="800" fill="#f97316" opacity="0.3" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        <g transform="translate(480, 560) scale(1.6)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    
  </g>
        <g transform="translate(740, 570) scale(1.4)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
        <g transform="translate(880, 570) scale(1.35)" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>
        <g transform="translate(240, 680) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
  </g>
      
</svg>`;
}

// Scene 12: "Pães artesanais crocantes"
export function renderGastronomia12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pães artesanais crocantes - Manje</title>
  <desc>Ghibli anime art: Pães artesanais crocantes com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
        <polygon points="-50,580 1250,580 1250,800 -50,800" fill="url(#woodTone)"/>
        <g transform="translate(600, 610) scale(1.45)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(520, 540) scale(1.55)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
        <g transform="translate(800, 550) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 13: "Mesa com frutas tropicais"
export function renderGastronomia13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mesa com frutas tropicais - Manje</title>
  <desc>Ghibli anime art: Mesa com frutas tropicais com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 610) scale(1.45)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(560, 540) scale(1.55)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
        <g transform="translate(820, 560) scale(1.35)" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>
      
</svg>`;
}

// Scene 14: "Caldo saboroso na panela"
export function renderGastronomia14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Caldo saboroso na panela - Manje</title>
  <desc>Ghibli anime art: Caldo saboroso na panela com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#fed7aa" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#stoneTone)"/>
        <g transform="translate(520, 560) scale(1.55)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    
  </g>
        <g transform="translate(780, 570) scale(1.45)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
        <g transform="translate(240, 670) scale(1.35)" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
  </g>
      
</svg>`;
}

// Scene 15: "Mesa posta para banquete"
export function renderGastronomia15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mesa posta para banquete - Manje</title>
  <desc>Ghibli anime art: Mesa posta para banquete com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 600) scale(1.55)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(600, 530) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 16: "Banca de pimentas e temperos"
export function renderGastronomia16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Banca de pimentas e temperos - Manje</title>
  <desc>Ghibli anime art: Banca de pimentas e temperos com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(910, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <polygon points="-50,600 1250,600 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 620) scale(1.4)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(460, 560) scale(1.6)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
        <g transform="translate(660, 560) scale(1.4)" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>
        <g transform="translate(880, 560) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-45" y="-10" width="90" height="35" rx="3" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="-45" y1="5" x2="45" y2="5" stroke="#b45309" stroke-width="2"/>
    <!-- Pumpkins, cabbages & yams inside -->
    <circle cx="-20" cy="-15" r="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <circle cx="15" cy="-16" r="15" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
    <ellipse cx="0" cy="-8" rx="14" ry="9" fill="#eab308"/>
  </g>
      
</svg>`;
}

// Scene 17: "Café da manhã com pão e frutas"
export function renderGastronomia17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Café da manhã com pão e frutas - Manje</title>
  <desc>Ghibli anime art: Café da manhã com pão e frutas com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 610) scale(1.45)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(480, 540) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="30" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Woven Bread Basket -->
    <path d="M-45,0 L45,0 Q50,25 35,30 L-35,30 Q-50,25 -45,0 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="45" ry="8" fill="#b45309"/>
    <!-- Golden Crusty Bread Loaf -->
    <ellipse cx="-15" cy="-12" rx="28" ry="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <!-- Slits in crust -->
    <line x1="-28" y1="-16" x2="-20" y2="-6" stroke="#78350f" stroke-width="2"/>
    <line x1="-15" y1="-18" x2="-7" y2="-8" stroke="#78350f" stroke-width="2"/>
    <!-- Baguette leaning -->
    <path d="M0,5 L38,-35 Q44,-42 50,-35 Q55,-28 48,-20 L15,10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  </g>
        <g transform="translate(740, 540) scale(1.45)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="25" rx="55" ry="12" fill="#000000" opacity="0.3"/>
    <!-- Wooden fruit bowl -->
    <path d="M-45,0 L45,0 Q50,22 35,25 L-35,25 Q-50,22 -45,0 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Pineapple -->
    <ellipse cx="15" cy="-25" rx="16" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <path d="M15,-48 Q8,-68 15,-75 Q22,-68 15,-48" stroke="#15803d" stroke-width="3" fill="#22c55e"/>
    <!-- Mangoes -->
    <ellipse cx="-20" cy="-12" rx="18" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    <ellipse cx="-16" cy="-14" rx="12" ry="8" fill="#facc15"/>
    <!-- Bananas -->
    <path d="M-30,-2 Q-10,-15 10,-2" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M-28,4 Q-8,-8 12,4" stroke="#facc15" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 18: "Cozinhando ao ar livre no quintal"
export function renderGastronomia18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cozinhando ao ar livre no quintal - Manje</title>
  <desc>Ghibli anime art: Cozinhando ao ar livre no quintal com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(750, 620) scale(1.35)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(420, 570) scale(1.5)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    
  </g>
        <g transform="translate(720, 570) scale(1.35)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 19: "Garrafas artesanais e pimentas"
export function renderGastronomia19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Garrafas artesanais e pimentas - Manje</title>
  <desc>Ghibli anime art: Garrafas artesanais e pimentas com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(600, 610) scale(1.45)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(520, 560) scale(1.5)" filter="url(#dropShadow)">
    <!-- Glass Bottle 1: Olive oil / Vinegar -->
    <path d="M-18,-45 L-18,-35 Q-25,-30 -25,-15 L-25,25 L-11,25 L-11,-15 Q-11,-30 -18,-35 Z" fill="#059669" opacity="0.85" stroke="#047857" stroke-width="1.5"/>
    <rect x="-19" y="-50" width="6" height="6" fill="#78350f"/> <!-- Cork -->
    <!-- Glass Bottle 2: Spiced Rum / Sauce -->
    <path d="M12,-55 L12,-42 Q3,-35 3,-15 L3,25 L21,25 L21,-15 Q21,-35 12,-42 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="10" y="-60" width="6" height="6" fill="#78350f"/>
  </g>
        <g transform="translate(720, 570) scale(1.45)" filter="url(#dropShadow)">
    <!-- Scotch Bonnet Peppers (Piman Bouk) -->
    <!-- Red pepper -->
    <g transform="translate(-18, 0)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M0,-15 Q-2,-25 6,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Yellow pepper -->
    <g transform="translate(14, -5)">
      <path d="M0,-15 Q-14,-5 -10,12 Q0,24 8,14 Q16,-2 0,-15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <path d="M0,-15 Q2,-25 -4,-24" stroke="#15803d" stroke-width="2.5" fill="none"/>
    </g>
    <!-- Orange pepper -->
    <g transform="translate(0, 10)">
      <path d="M0,-12 Q-12,-2 -8,12 Q0,20 6,12 Q14,0 0,-12 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M0,-12 Q-1,-20 4,-19" stroke="#15803d" stroke-width="2" fill="none"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 20: "Jantar especial acolhedor"
export function renderGastronomia20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Jantar especial acolhedor - Manje</title>
  <desc>Ghibli anime art: Jantar especial acolhedor com panelas, frutas e comida saborosa haitiana.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#woodTone)"/>
        <g transform="translate(600, 600) scale(1.55)" filter="url(#dropShadow)">
    <!-- Wooden Table Top -->
    <rect x="-160" y="-15" width="320" height="25" rx="4" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Table legs -->
    <rect x="-140" y="10" width="16" height="80" fill="#451a03"/>
    <rect x="124" y="10" width="16" height="80" fill="#451a03"/>
    <!-- Ceramic Plates on Table -->
    <g transform="translate(-70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <!-- Fork and Knife -->
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
    <g transform="translate(70, -25)">
      <ellipse cx="0" cy="0" rx="36" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e0f2fe"/>
      <line x1="-42" y1="-10" x2="-42" y2="10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="42" y1="-10" x2="42" y2="10" stroke="#94a3b8" stroke-width="2.5"/>
    </g>
  </g>
        <g transform="translate(600, 520) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="45" rx="55" ry="12" fill="#000000" opacity="0.35"/>
    <!-- Heavy Cast Iron Pot (Chodyè) -->
    <path d="M-45,-20 L45,-20 Q55,25 35,45 L-35,45 Q-55,25 -45,-20 Z" fill="#1c1917" stroke="#0c0a09" stroke-width="2.5"/>
    <!-- Pot rim and handles -->
    <ellipse cx="0" cy="-20" rx="45" ry="10" fill="#292524" stroke="#0c0a09" stroke-width="2"/>
    <path d="M-45,-20 Q-62,-20 -55,-5 Q-48,-5 -45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <path d="M45,-20 Q62,-20 55,-5 Q48,-5 45,-12" stroke="#292524" stroke-width="4" fill="none"/>
    <!-- Rich bubbling stew inside -->
    <ellipse cx="0" cy="-20" rx="40" ry="8" fill="#c2410c"/>
    <circle cx="-12" cy="-20" r="3" fill="#facc15"/>
    <circle cx="15" cy="-22" r="3" fill="#15803d"/>
    
      <!-- Steam vapors -->
      <path d="M-15,-30 Q-25,-55 -10,-80 Q0,-105 -15,-130" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M15,-30 Q25,-60 5,-90 Q-15,-115 5,-145" stroke="#f1f5f9" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round"/>
    
  </g>
      
</svg>`;
}
