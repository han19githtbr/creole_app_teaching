import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderInterior as renderInterior01 } from "./master-scenes-1.mjs";

export { renderInterior01 };

// Scene 2: "Colheita no campo"
export function renderInterior02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Colheita no campo - Andeyò</title>
  <desc>Ghibli anime art: Colheita no campo no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,520 Q320,450 680,500 T1250,480 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <path d="M-50,570 Q280,510 600,560 T1250,530 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <g transform="translate(220, 560) scale(0.85)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(1020, 560) scale(1.2)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(420, 660) scale(1.4)">
    
      <path d="M0,30 Q-5,-30 5,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="5" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="5" y1="-85" x2="8" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M20,30 Q15,-30 25,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="25" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="25" y1="-85" x2="28" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M40,30 Q35,-30 45,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="45" y1="-85" x2="48" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M60,30 Q55,-30 65,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="65" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="65" y1="-85" x2="68" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M80,30 Q75,-30 85,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="85" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="85" y1="-85" x2="88" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M100,30 Q95,-30 105,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="105" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="105" y1="-85" x2="108" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M120,30 Q115,-30 125,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="125" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="125" y1="-85" x2="128" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M140,30 Q135,-30 145,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="145" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="145" y1="-85" x2="148" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M160,30 Q155,-30 165,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="165" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="165" y1="-85" x2="168" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(680, 640) scale(1.25)" filter="url(#dropShadow)">
    <!-- Tractor shadow -->
    <ellipse cx="0" cy="50" rx="90" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Engine chassis -->
    <path d="M-80,15 L-30,15 L-30,-25 L-80,-15 Z" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
    <rect x="-75" y="-12" width="20" height="20" fill="#334155"/> <!-- Radiator grill -->
    <!-- Exhaust pipe with smoke puff -->
    <line x1="-65" y1="-25" x2="-65" y2="-55" stroke="#1e293b" stroke-width="4"/>
    <ellipse cx="-65" cy="-62" rx="6" ry="4" fill="#cbd5e1" opacity="0.6"/>
    <!-- Hood and cabin -->
    <rect x="-30" y="-45" width="60" height="60" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
    <!-- Steering wheel and seat -->
    <circle cx="5" cy="-35" r="10" fill="none" stroke="#0f172a" stroke-width="3"/>
    <rect x="15" y="-30" width="16" height="20" rx="3" fill="#78350f"/>
    <!-- Big Rear Wheel -->
    <circle cx="35" cy="20" r="38" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <circle cx="35" cy="20" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="35" cy="20" r="8" fill="#1e293b"/>
    <!-- Small Front Wheel -->
    <circle cx="-65" cy="30" r="22" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="-65" cy="30" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 3: "Horta da fazenda"
export function renderInterior03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Horta da fazenda - Andeyò</title>
  <desc>Ghibli anime art: Horta da fazenda no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,540 Q350,470 750,530 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q300,560 650,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(880, 550) scale(0.9)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(150, 620) scale(1.1)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="250" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="250" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="234,15 234,-45 240,-52 246,-45 246,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(420, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Rich soil mounds -->
    <ellipse cx="0" cy="0" rx="90" ry="24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="0" cy="40" rx="100" ry="26" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Cabbage & lettuce heads -->
    
      <circle cx="-60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-60" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="-20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="60" cy="-2" r="7" fill="#86efac"/>
    
    <!-- Carrots / tomatoes -->
    
      <circle cx="-70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-72,30 -68,30 -70,25" fill="#15803d"/>
    
      <circle cx="-35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-37,30 -33,30 -35,25" fill="#15803d"/>
    
      <circle cx="0" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-2,30 2,30 0,25" fill="#15803d"/>
    
      <circle cx="35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="33,30 37,30 35,25" fill="#15803d"/>
    
      <circle cx="70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="68,30 72,30 70,25" fill="#15803d"/>
    
  </g>
        <g transform="translate(250, 710) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
        <g transform="translate(740, 720) scale(1.1)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 4: "Cabras perto do poço"
export function renderInterior04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cabras perto do poço - Andeyò</title>
  <desc>Ghibli anime art: Cabras perto do poço no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 Q350,470 750,530 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q300,560 650,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(180, 580) scale(1.3)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(350, 600) scale(1.1)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="190" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="190" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(720, 620) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="35" rx="55" ry="15" fill="#000000" opacity="0.3"/>
    <!-- Stone Base -->
    <path d="M-45,30 L-40,-15 Q0,-22 40,-15 L45,30 Q0,40 -45,30 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <ellipse cx="0" cy="-15" rx="40" ry="12" fill="#0284c7" stroke="#334155" stroke-width="2"/>
    <!-- Wooden posts -->
    <rect x="-35" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="27" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-48,-85 0,-125 48,-85" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <!-- Wooden crossbeam, spool & bucket -->
    <line x1="-30" y1="-75" x2="30" y2="-75" stroke="#78350f" stroke-width="5"/>
    <line x1="0" y1="-75" x2="0" y2="-40" stroke="#facc15" stroke-width="2"/>
    <rect x="-10" y="-40" width="20" height="18" rx="2" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
  </g>
        <g transform="translate(450, 680) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
        <g transform="translate(920, 670) scale(-1.1, 1.1)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 5: "Casa entre árvores"
export function renderInterior05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Casa entre árvores - Andeyò</title>
  <desc>Ghibli anime art: Casa entre árvores no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,520 Q320,460 680,510 T1250,480 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q400,550 800,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(220, 560) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(980, 550) scale(1.25)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(600, 540) scale(1.2)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(350, 690) scale(1.2)" filter="url(#dropShadow)">
    <!-- Rich soil mounds -->
    <ellipse cx="0" cy="0" rx="90" ry="24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="0" cy="40" rx="100" ry="26" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Cabbage & lettuce heads -->
    
      <circle cx="-60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-60" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="-20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="60" cy="-2" r="7" fill="#86efac"/>
    
    <!-- Carrots / tomatoes -->
    
      <circle cx="-70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-72,30 -68,30 -70,25" fill="#15803d"/>
    
      <circle cx="-35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-37,30 -33,30 -35,25" fill="#15803d"/>
    
      <circle cx="0" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-2,30 2,30 0,25" fill="#15803d"/>
    
      <circle cx="35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="33,30 37,30 35,25" fill="#15803d"/>
    
      <circle cx="70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="68,30 72,30 70,25" fill="#15803d"/>
    
  </g>
        <g transform="translate(820, 710) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 6: "Trator na plantação"
export function renderInterior06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Trator na plantação - Andeyò</title>
  <desc>Ghibli anime art: Trator na plantação no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(100, 590) scale(1.1)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="250" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="250" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="234,15 234,-45 240,-52 246,-45 246,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(720, 620) scale(1.4)">
    
      <path d="M0,30 Q-5,-30 5,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="5" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="5" y1="-85" x2="8" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M20,30 Q15,-30 25,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="25" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="25" y1="-85" x2="28" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M40,30 Q35,-30 45,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="45" y1="-85" x2="48" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M60,30 Q55,-30 65,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="65" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="65" y1="-85" x2="68" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M80,30 Q75,-30 85,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="85" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="85" y1="-85" x2="88" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M100,30 Q95,-30 105,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="105" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="105" y1="-85" x2="108" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M120,30 Q115,-30 125,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="125" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="125" y1="-85" x2="128" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M140,30 Q135,-30 145,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="145" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="145" y1="-85" x2="148" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M160,30 Q155,-30 165,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="165" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="165" y1="-85" x2="168" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(460, 640) scale(1.3)" filter="url(#dropShadow)">
    <!-- Tractor shadow -->
    <ellipse cx="0" cy="50" rx="90" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Engine chassis -->
    <path d="M-80,15 L-30,15 L-30,-25 L-80,-15 Z" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
    <rect x="-75" y="-12" width="20" height="20" fill="#334155"/> <!-- Radiator grill -->
    <!-- Exhaust pipe with smoke puff -->
    <line x1="-65" y1="-25" x2="-65" y2="-55" stroke="#1e293b" stroke-width="4"/>
    <ellipse cx="-65" cy="-62" rx="6" ry="4" fill="#cbd5e1" opacity="0.6"/>
    <!-- Hood and cabin -->
    <rect x="-30" y="-45" width="60" height="60" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
    <!-- Steering wheel and seat -->
    <circle cx="5" cy="-35" r="10" fill="none" stroke="#0f172a" stroke-width="3"/>
    <rect x="15" y="-30" width="16" height="20" rx="3" fill="#78350f"/>
    <!-- Big Rear Wheel -->
    <circle cx="35" cy="20" r="38" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <circle cx="35" cy="20" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="35" cy="20" r="8" fill="#1e293b"/>
    <!-- Small Front Wheel -->
    <circle cx="-65" cy="30" r="22" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="-65" cy="30" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(220, 680) scale(1.25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 7: "Manhã no galinheiro"
export function renderInterior07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Manhã no galinheiro - Andeyò</title>
  <desc>Ghibli anime art: Manhã no galinheiro no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(280, 550) scale(1.05)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(1000, 560) scale(1.3)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(820, 640) scale(1.25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="35" rx="55" ry="15" fill="#000000" opacity="0.3"/>
    <!-- Stone Base -->
    <path d="M-45,30 L-40,-15 Q0,-22 40,-15 L45,30 Q0,40 -45,30 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <ellipse cx="0" cy="-15" rx="40" ry="12" fill="#0284c7" stroke="#334155" stroke-width="2"/>
    <!-- Wooden posts -->
    <rect x="-35" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="27" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-48,-85 0,-125 48,-85" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <!-- Wooden crossbeam, spool & bucket -->
    <line x1="-30" y1="-75" x2="30" y2="-75" stroke="#78350f" stroke-width="5"/>
    <line x1="0" y1="-75" x2="0" y2="-40" stroke="#facc15" stroke-width="2"/>
    <rect x="-10" y="-40" width="20" height="18" rx="2" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
  </g>
        <g transform="translate(500, 690) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
        <g transform="translate(620, 710) scale(1.15)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 8: "Caminho da roça"
export function renderInterior08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Caminho da roça - Andeyò</title>
  <desc>Ghibli anime art: Caminho da roça no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,520 Q300,460 650,510 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,540 750,590 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(880, 540) scale(0.95)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(200, 600) scale(1.15)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="190" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="190" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(580, 640) scale(1.3)">
    
      <path d="M0,30 Q-5,-30 5,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="5" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="5" y1="-85" x2="8" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M20,30 Q15,-30 25,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="25" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="25" y1="-85" x2="28" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M40,30 Q35,-30 45,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="45" y1="-85" x2="48" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M60,30 Q55,-30 65,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="65" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="65" y1="-85" x2="68" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M80,30 Q75,-30 85,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="85" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="85" y1="-85" x2="88" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M100,30 Q95,-30 105,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="105" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="105" y1="-85" x2="108" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M120,30 Q115,-30 125,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="125" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="125" y1="-85" x2="128" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M140,30 Q135,-30 145,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="145" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="145" y1="-85" x2="148" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M160,30 Q155,-30 165,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="165" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="165" y1="-85" x2="168" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(350, 680) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 9: "Jardim com poço antigo"
export function renderInterior09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Jardim com poço antigo - Andeyò</title>
  <desc>Ghibli anime art: Jardim com poço antigo no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(180, 570) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(860, 540) scale(1.05)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(480, 630) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="35" rx="55" ry="15" fill="#000000" opacity="0.3"/>
    <!-- Stone Base -->
    <path d="M-45,30 L-40,-15 Q0,-22 40,-15 L45,30 Q0,40 -45,30 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <ellipse cx="0" cy="-15" rx="40" ry="12" fill="#0284c7" stroke="#334155" stroke-width="2"/>
    <!-- Wooden posts -->
    <rect x="-35" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="27" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-48,-85 0,-125 48,-85" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <!-- Wooden crossbeam, spool & bucket -->
    <line x1="-30" y1="-75" x2="30" y2="-75" stroke="#78350f" stroke-width="5"/>
    <line x1="0" y1="-75" x2="0" y2="-40" stroke="#facc15" stroke-width="2"/>
    <rect x="-10" y="-40" width="20" height="18" rx="2" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
  </g>
        <g transform="translate(720, 690) scale(1.25)" filter="url(#dropShadow)">
    <!-- Rich soil mounds -->
    <ellipse cx="0" cy="0" rx="90" ry="24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="0" cy="40" rx="100" ry="26" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Cabbage & lettuce heads -->
    
      <circle cx="-60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-60" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="-20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="60" cy="-2" r="7" fill="#86efac"/>
    
    <!-- Carrots / tomatoes -->
    
      <circle cx="-70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-72,30 -68,30 -70,25" fill="#15803d"/>
    
      <circle cx="-35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-37,30 -33,30 -35,25" fill="#15803d"/>
    
      <circle cx="0" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-2,30 2,30 0,25" fill="#15803d"/>
    
      <circle cx="35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="33,30 37,30 35,25" fill="#15803d"/>
    
      <circle cx="70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="68,30 72,30 70,25" fill="#15803d"/>
    
  </g>
      
</svg>`;
}

// Scene 10: "Fazenda ao pôr do sol"
export function renderInterior10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Fazenda ao pôr do sol - Andeyò</title>
  <desc>Ghibli anime art: Fazenda ao pôr do sol no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(280, 540) scale(1.15)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(800, 630) scale(1.3)">
    
      <path d="M0,30 Q-5,-30 5,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="5" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="5" y1="-85" x2="8" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M20,30 Q15,-30 25,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="25" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="25" y1="-85" x2="28" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M40,30 Q35,-30 45,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="45" y1="-85" x2="48" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M60,30 Q55,-30 65,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="65" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="65" y1="-85" x2="68" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M80,30 Q75,-30 85,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="85" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="85" y1="-85" x2="88" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M100,30 Q95,-30 105,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="105" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="105" y1="-85" x2="108" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M120,30 Q115,-30 125,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="125" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="125" y1="-85" x2="128" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M140,30 Q135,-30 145,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="145" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="145" y1="-85" x2="148" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M160,30 Q155,-30 165,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="165" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="165" y1="-85" x2="168" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(620, 640) scale(1.2)" filter="url(#dropShadow)">
    <!-- Tractor shadow -->
    <ellipse cx="0" cy="50" rx="90" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Engine chassis -->
    <path d="M-80,15 L-30,15 L-30,-25 L-80,-15 Z" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
    <rect x="-75" y="-12" width="20" height="20" fill="#334155"/> <!-- Radiator grill -->
    <!-- Exhaust pipe with smoke puff -->
    <line x1="-65" y1="-25" x2="-65" y2="-55" stroke="#1e293b" stroke-width="4"/>
    <ellipse cx="-65" cy="-62" rx="6" ry="4" fill="#cbd5e1" opacity="0.6"/>
    <!-- Hood and cabin -->
    <rect x="-30" y="-45" width="60" height="60" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
    <!-- Steering wheel and seat -->
    <circle cx="5" cy="-35" r="10" fill="none" stroke="#0f172a" stroke-width="3"/>
    <rect x="15" y="-30" width="16" height="20" rx="3" fill="#78350f"/>
    <!-- Big Rear Wheel -->
    <circle cx="35" cy="20" r="38" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <circle cx="35" cy="20" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="35" cy="20" r="8" fill="#1e293b"/>
    <!-- Small Front Wheel -->
    <circle cx="-65" cy="30" r="22" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="-65" cy="30" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  </g>
        <g transform="translate(450, 710) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 11: "Pastoreio no campo verde"
export function renderInterior11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pastoreio no campo verde - Andeyò</title>
  <desc>Ghibli anime art: Pastoreio no campo verde no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(960, 560) scale(1.3)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(150, 600) scale(1.1)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="250" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="250" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="234,15 234,-45 240,-52 246,-45 246,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(650, 630) scale(1.25)">
    
      <path d="M0,30 Q-5,-30 5,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="5" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="5" y1="-85" x2="8" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M20,30 Q15,-30 25,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="25" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="25" y1="-85" x2="28" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M40,30 Q35,-30 45,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="45" y1="-85" x2="48" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M60,30 Q55,-30 65,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="65" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="65" y1="-85" x2="68" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M80,30 Q75,-30 85,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="85" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="85" y1="-85" x2="88" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M100,30 Q95,-30 105,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="105" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="105" y1="-85" x2="108" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M120,30 Q115,-30 125,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="125" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="125" y1="-85" x2="128" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M140,30 Q135,-30 145,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="145" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="145" y1="-85" x2="148" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M160,30 Q155,-30 165,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="165" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="165" y1="-85" x2="168" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(340, 680) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
        <g transform="translate(520, 690) scale(-1.1, 1.1)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 12: "Pomar de frutas no sítio"
export function renderInterior12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pomar de frutas no sítio - Andeyò</title>
  <desc>Ghibli anime art: Pomar de frutas no sítio no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(220, 560) scale(1.3)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(460, 570) scale(1.15)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(880, 540) scale(1.05)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(650, 690) scale(1.2)" filter="url(#dropShadow)">
    <!-- Rich soil mounds -->
    <ellipse cx="0" cy="0" rx="90" ry="24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="0" cy="40" rx="100" ry="26" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Cabbage & lettuce heads -->
    
      <circle cx="-60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-60" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="-20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="60" cy="-2" r="7" fill="#86efac"/>
    
    <!-- Carrots / tomatoes -->
    
      <circle cx="-70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-72,30 -68,30 -70,25" fill="#15803d"/>
    
      <circle cx="-35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-37,30 -33,30 -35,25" fill="#15803d"/>
    
      <circle cx="0" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-2,30 2,30 0,25" fill="#15803d"/>
    
      <circle cx="35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="33,30 37,30 35,25" fill="#15803d"/>
    
      <circle cx="70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="68,30 72,30 70,25" fill="#15803d"/>
    
  </g>
        <g transform="translate(340, 710) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 13: "Descanso sob a figueira"
export function renderInterior13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Descanso sob a figueira - Andeyò</title>
  <desc>Ghibli anime art: Descanso sob a figueira no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(280, 560) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(900, 550) scale(0.95)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(600, 610) scale(1.05)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="190" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="190" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(480, 640) scale(1.25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="35" rx="55" ry="15" fill="#000000" opacity="0.3"/>
    <!-- Stone Base -->
    <path d="M-45,30 L-40,-15 Q0,-22 40,-15 L45,30 Q0,40 -45,30 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <ellipse cx="0" cy="-15" rx="40" ry="12" fill="#0284c7" stroke="#334155" stroke-width="2"/>
    <!-- Wooden posts -->
    <rect x="-35" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="27" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-48,-85 0,-125 48,-85" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <!-- Wooden crossbeam, spool & bucket -->
    <line x1="-30" y1="-75" x2="30" y2="-75" stroke="#78350f" stroke-width="5"/>
    <line x1="0" y1="-75" x2="0" y2="-40" stroke="#facc15" stroke-width="2"/>
    <rect x="-10" y="-40" width="20" height="18" rx="2" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
  </g>
      
</svg>`;
}

// Scene 14: "Galinheiro ao entardecer"
export function renderInterior14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Galinheiro ao entardecer - Andeyò</title>
  <desc>Ghibli anime art: Galinheiro ao entardecer no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(260, 540) scale(1.1)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(980, 560) scale(1.25)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(480, 600) scale(1.1)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="250" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="250" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="234,15 234,-45 240,-52 246,-45 246,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(620, 690) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
        <g transform="translate(760, 705) scale(1.2)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 15: "Manhã de arado na terra"
export function renderInterior15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Manhã de arado na terra - Andeyò</title>
  <desc>Ghibli anime art: Manhã de arado na terra no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(160, 570) scale(1.3)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(880, 540) scale(1)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(720, 640) scale(1.3)">
    
      <path d="M0,30 Q-5,-30 5,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="5" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="5" y1="-85" x2="8" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M20,30 Q15,-30 25,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="25" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="25" y1="-85" x2="28" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M40,30 Q35,-30 45,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="45" y1="-85" x2="48" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M60,30 Q55,-30 65,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="65" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="65" y1="-85" x2="68" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M80,30 Q75,-30 85,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="85" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="85" y1="-85" x2="88" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M100,30 Q95,-30 105,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="105" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="105" y1="-85" x2="108" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M120,30 Q115,-30 125,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="125" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="125" y1="-85" x2="128" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M140,30 Q135,-30 145,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="145" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="145" y1="-85" x2="148" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M160,30 Q155,-30 165,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="165" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="165" y1="-85" x2="168" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(460, 640) scale(1.35)" filter="url(#dropShadow)">
    <!-- Tractor shadow -->
    <ellipse cx="0" cy="50" rx="90" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Engine chassis -->
    <path d="M-80,15 L-30,15 L-30,-25 L-80,-15 Z" fill="#2563eb" stroke="#14532d" stroke-width="2.5"/>
    <rect x="-75" y="-12" width="20" height="20" fill="#334155"/> <!-- Radiator grill -->
    <!-- Exhaust pipe with smoke puff -->
    <line x1="-65" y1="-25" x2="-65" y2="-55" stroke="#1e293b" stroke-width="4"/>
    <ellipse cx="-65" cy="-62" rx="6" ry="4" fill="#cbd5e1" opacity="0.6"/>
    <!-- Hood and cabin -->
    <rect x="-30" y="-45" width="60" height="60" fill="#2563eb" stroke="#14532d" stroke-width="2.5"/>
    <!-- Steering wheel and seat -->
    <circle cx="5" cy="-35" r="10" fill="none" stroke="#0f172a" stroke-width="3"/>
    <rect x="15" y="-30" width="16" height="20" rx="3" fill="#78350f"/>
    <!-- Big Rear Wheel -->
    <circle cx="35" cy="20" r="38" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <circle cx="35" cy="20" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="35" cy="20" r="8" fill="#1e293b"/>
    <!-- Small Front Wheel -->
    <circle cx="-65" cy="30" r="22" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="-65" cy="30" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 16: "Poço de água na encosta"
export function renderInterior16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Poço de água na encosta - Andeyò</title>
  <desc>Ghibli anime art: Poço de água na encosta no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 160, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(180, 560) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(520, 630) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="35" rx="55" ry="15" fill="#000000" opacity="0.3"/>
    <!-- Stone Base -->
    <path d="M-45,30 L-40,-15 Q0,-22 40,-15 L45,30 Q0,40 -45,30 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <ellipse cx="0" cy="-15" rx="40" ry="12" fill="#0284c7" stroke="#334155" stroke-width="2"/>
    <!-- Wooden posts -->
    <rect x="-35" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="27" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-48,-85 0,-125 48,-85" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <!-- Wooden crossbeam, spool & bucket -->
    <line x1="-30" y1="-75" x2="30" y2="-75" stroke="#78350f" stroke-width="5"/>
    <line x1="0" y1="-75" x2="0" y2="-40" stroke="#facc15" stroke-width="2"/>
    <rect x="-10" y="-40" width="20" height="18" rx="2" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
  </g>
        <g transform="translate(820, 670) scale(1.25)" filter="url(#dropShadow)">
    <!-- Rich soil mounds -->
    <ellipse cx="0" cy="0" rx="90" ry="24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="0" cy="40" rx="100" ry="26" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Cabbage & lettuce heads -->
    
      <circle cx="-60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-60" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="-20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="60" cy="-2" r="7" fill="#86efac"/>
    
    <!-- Carrots / tomatoes -->
    
      <circle cx="-70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-72,30 -68,30 -70,25" fill="#15803d"/>
    
      <circle cx="-35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-37,30 -33,30 -35,25" fill="#15803d"/>
    
      <circle cx="0" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-2,30 2,30 0,25" fill="#15803d"/>
    
      <circle cx="35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="33,30 37,30 35,25" fill="#15803d"/>
    
      <circle cx="70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="68,30 72,30 70,25" fill="#15803d"/>
    
  </g>
        <g transform="translate(340, 680) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
      
</svg>`;
}

// Scene 17: "Celeiro e fardos de trigo"
export function renderInterior17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Celeiro e fardos de trigo - Andeyò</title>
  <desc>Ghibli anime art: Celeiro e fardos de trigo no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(860, 540) scale(1.15)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(150, 600) scale(1.1)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="190" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="190" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(380, 630) scale(1.4)">
    
      <path d="M0,30 Q-5,-30 5,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="5" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="5" y1="-85" x2="8" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M20,30 Q15,-30 25,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="25" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="25" y1="-85" x2="28" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M40,30 Q35,-30 45,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="45" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="45" y1="-85" x2="48" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M60,30 Q55,-30 65,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="65" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="65" y1="-85" x2="68" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M80,30 Q75,-30 85,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="85" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="85" y1="-85" x2="88" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M100,30 Q95,-30 105,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="105" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="105" y1="-85" x2="108" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M120,30 Q115,-30 125,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="125" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="125" y1="-85" x2="128" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M140,30 Q135,-30 145,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="145" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="145" y1="-85" x2="148" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
      <path d="M160,30 Q155,-30 165,-70" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <ellipse cx="165" cy="-75" rx="5" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="165" y1="-85" x2="168" y2="-98" stroke="#d97706" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(620, 640) scale(1.25)" filter="url(#dropShadow)">
    <!-- Tractor shadow -->
    <ellipse cx="0" cy="50" rx="90" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Engine chassis -->
    <path d="M-80,15 L-30,15 L-30,-25 L-80,-15 Z" fill="#dc2626" stroke="#14532d" stroke-width="2.5"/>
    <rect x="-75" y="-12" width="20" height="20" fill="#334155"/> <!-- Radiator grill -->
    <!-- Exhaust pipe with smoke puff -->
    <line x1="-65" y1="-25" x2="-65" y2="-55" stroke="#1e293b" stroke-width="4"/>
    <ellipse cx="-65" cy="-62" rx="6" ry="4" fill="#cbd5e1" opacity="0.6"/>
    <!-- Hood and cabin -->
    <rect x="-30" y="-45" width="60" height="60" fill="#dc2626" stroke="#14532d" stroke-width="2.5"/>
    <!-- Steering wheel and seat -->
    <circle cx="5" cy="-35" r="10" fill="none" stroke="#0f172a" stroke-width="3"/>
    <rect x="15" y="-30" width="16" height="20" rx="3" fill="#78350f"/>
    <!-- Big Rear Wheel -->
    <circle cx="35" cy="20" r="38" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <circle cx="35" cy="20" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="35" cy="20" r="8" fill="#1e293b"/>
    <!-- Small Front Wheel -->
    <circle cx="-65" cy="30" r="22" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="-65" cy="30" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 18: "Cabritos brincando na cerca"
export function renderInterior18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cabritos brincando na cerca - Andeyò</title>
  <desc>Ghibli anime art: Cabritos brincando na cerca no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,530 Q300,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(240, 540) scale(1.1)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(480, 610) scale(1.15)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="250" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="250" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="234,15 234,-45 240,-52 246,-45 246,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
        <g transform="translate(620, 680) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
        <g transform="translate(800, 690) scale(-1.05, 1.05)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="40" rx="35" ry="10" fill="#000000" opacity="0.3"/>
    <!-- Legs -->
    <line x1="-20" y1="10" x2="-22" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="-12" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="10" x2="16" y2="40" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    <line x1="25" y1="10" x2="28" y2="40" stroke="#542807" stroke-width="4" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <path d="M-30,-2 Q-38,-15 -25,-12 Z" fill="#94a3b8"/> <!-- Patch -->
    <!-- Tail -->
    <path d="M-34,2 Q-42,-8 -38,-12" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <!-- Neck and Head -->
    <path d="M15,-5 L28,-25 L45,-15 L28,12 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="36" cy="-20" r="3" fill="#0f172a"/>
    <!-- Horns -->
    <path d="M25,-26 Q20,-45 8,-38" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Beard -->
    <path d="M38,-8 L44,-2" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
  </g>
        <g transform="translate(400, 715) scale(1.2)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 19: "Horta irrigada ao amanhecer"
export function renderInterior19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Horta irrigada ao amanhecer - Andeyò</title>
  <desc>Ghibli anime art: Horta irrigada ao amanhecer no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(160, 560) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(780, 630) scale(1.25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="35" rx="55" ry="15" fill="#000000" opacity="0.3"/>
    <!-- Stone Base -->
    <path d="M-45,30 L-40,-15 Q0,-22 40,-15 L45,30 Q0,40 -45,30 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <ellipse cx="0" cy="-15" rx="40" ry="12" fill="#0284c7" stroke="#334155" stroke-width="2"/>
    <!-- Wooden posts -->
    <rect x="-35" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="27" y="-90" width="8" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-48,-85 0,-125 48,-85" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <!-- Wooden crossbeam, spool & bucket -->
    <line x1="-30" y1="-75" x2="30" y2="-75" stroke="#78350f" stroke-width="5"/>
    <line x1="0" y1="-75" x2="0" y2="-40" stroke="#facc15" stroke-width="2"/>
    <rect x="-10" y="-40" width="20" height="18" rx="2" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
  </g>
        <g transform="translate(420, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Rich soil mounds -->
    <ellipse cx="0" cy="0" rx="90" ry="24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <ellipse cx="0" cy="40" rx="100" ry="26" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Cabbage & lettuce heads -->
    
      <circle cx="-60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-60" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="-20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="-20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="20" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="20" cy="-2" r="7" fill="#86efac"/>
    
      <circle cx="60" cy="-2" r="12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="60" cy="-2" r="7" fill="#86efac"/>
    
    <!-- Carrots / tomatoes -->
    
      <circle cx="-70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-72,30 -68,30 -70,25" fill="#15803d"/>
    
      <circle cx="-35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-37,30 -33,30 -35,25" fill="#15803d"/>
    
      <circle cx="0" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="-2,30 2,30 0,25" fill="#15803d"/>
    
      <circle cx="35" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="33,30 37,30 35,25" fill="#15803d"/>
    
      <circle cx="70" cy="38" r="9" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
      <polygon points="68,30 72,30 70,25" fill="#15803d"/>
    
  </g>
        <g transform="translate(650, 710) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="18" ry="6" fill="#000000" opacity="0.25"/>
    <line x1="-6" y1="8" x2="-6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <line x1="6" y1="8" x2="6" y2="20" stroke="#ea580c" stroke-width="2.5"/>
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Wing -->
    <path d="M-10,0 Q0,10 8,0 Q-2,-8 -10,0 Z" fill="#fef08a"/>
    <!-- Tail feathers -->
    <path d="M-16,-6 Q-28,-18 -18,-2 M-16,-4 Q-26,-10 -16,4" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="16" cy="-12" r="8" fill="#ffffff"/>
    <polygon points="22,-12 28,-9 22,-6" fill="#f59e0b"/>
    <circle cx="18" cy="-14" r="1.5" fill="#0f172a"/>
    <!-- Red Comb & Wattle -->
    <path d="M14,-20 Q16,-24 18,-20 Q20,-24 22,-19" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="-4" r="2.5" fill="#ef4444"/>
  </g>
      
</svg>`;
}

// Scene 20: "Noite serena na fazenda"
export function renderInterior20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Noite serena na fazenda - Andeyò</title>
  <desc>Ghibli anime art: Noite serena na fazenda no interior campestre haitiano.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,540 Q320,480 680,530 T1250,510 L1250,800 L-50,800 Z" fill="#1e293b"/>
        <path d="M-50,610 Q350,560 750,610 T1250,580 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <g transform="translate(200, 560) scale(1.3)" filter="url(#dropShadow)">
    <path d="M-15,60 Q-25,-30 -8,-100 Q8,-30 15,60 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-130" rx="75" ry="65" fill="#15803d"/>
    <ellipse cx="-35" cy="-115" rx="55" ry="50" fill="#16a34a"/>
    <ellipse cx="35" cy="-115" rx="55" ry="50" fill="#22c55e"/>
    <ellipse cx="0" cy="-155" rx="50" ry="40" fill="#4ade80" opacity="0.8"/>
    <!-- Apples / mangoes -->
    <circle cx="-25" cy="-125" r="6" fill="#ef4444"/>
    <circle cx="15" cy="-140" r="6" fill="#ef4444"/>
    <circle cx="30" cy="-110" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(600, 540) scale(1.25)" filter="url(#dropShadow)">
    <!-- Farmhouse Body -->
    <rect x="-90" y="-80" width="180" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-110,-80 0,-165 110,-80" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="50" y="-150" width="22" height="40" fill="#78716c"/> <!-- Chimney -->
    <!-- Door & Windows -->
    <path d="M-22,70 L-22,10 Q0,-5 22,10 L22,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-70" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="35" y="-40" width="35" height="42" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Overhang porch -->
    <polygon points="-85,10 0,-5 85,10" fill="#b91c1c"/>
  </g>
        <g transform="translate(780, 610) scale(1.1)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="-10" y1="-30" x2="190" y2="-30" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <line x1="-10" y1="-10" x2="190" y2="-10" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    <!-- Posts -->
    
      <polygon points="-6,15 -6,-45 0,-52 6,-45 6,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="54,15 54,-45 60,-52 66,-45 66,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="114,15 114,-45 120,-52 126,-45 126,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
      <polygon points="174,15 174,-45 180,-52 186,-45 186,15" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    
  </g>
      
</svg>`;
}
