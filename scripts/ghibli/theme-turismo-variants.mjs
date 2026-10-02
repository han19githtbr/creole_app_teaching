import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderTurismo as renderTurismo01 } from "./master-scenes-1.mjs";

export { renderTurismo01 };

// Scene 2: "Porto de veleiros"
export function renderTurismo02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Porto de veleiros - Touris</title>
  <desc>Ghibli anime art: Porto de veleiros com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(1020, 320) scale(0.9)" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    <line x1="-18" y1="-96" x2="-18" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="-6" y1="-96" x2="-6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="6" y1="-96" x2="6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="18" y1="-96" x2="18" y2="-86" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    <polygon points="0,-102 -500,-60 -500,60" fill="#fef08a" opacity="0.2" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(450, 560) scale(1.2)" filter="url(#dropShadow)">
      <!-- Sloop Sailboat -->
      <ellipse cx="0" cy="50" rx="70" ry="14" fill="#0f766e" opacity="0.4"/>
      <path d="M-75,20 Q-50,55 0,55 Q50,55 75,20 L65,15 Q0,20 -65,15 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/>
      <path d="M-70,22 Q0,28 70,22 L68,30 Q0,35 -68,30 Z" fill="#ef4444"/>
      <line x1="0" y1="20" x2="0" y2="-130" stroke="#5a381e" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="15" x2="75" y2="8" stroke="#5a381e" stroke-width="3"/>
      <!-- Mainsail -->
      <path d="M0,-120 Q-30,-70 -55,-5 L0,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <line x1="0" y1="-65" x2="-30" y2="-65" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Jib sail -->
      <path d="M0,-110 Q35,-50 68,10 L0,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    </g>
        <g transform="translate(220, 520) scale(0.75)" filter="url(#dropShadow)">
      <!-- Catamaran / Twin Hull Boat -->
      <ellipse cx="0" cy="45" rx="80" ry="15" fill="#0f766e" opacity="0.4"/>
      <!-- Left hull -->
      <path d="M-65,25 Q-45,50 -20,50 L-15,22 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Right hull -->
      <path d="M20,22 L15,50 Q45,50 65,25 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Trampoline bridge -->
      <rect x="-25" y="20" width="50" height="10" fill="#3b82f6" rx="2"/>
      <!-- Mast & Twin striped sail -->
      <line x1="0" y1="20" x2="0" y2="-140" stroke="#334155" stroke-width="5"/>
      <path d="M0,-130 Q-40,-75 -65,-5 L0,5 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <path d="M0,-130 Q35,-75 60,-5 L0,5 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
        <g transform="translate(320, 720) scale(1.3)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 3: "Viagem de avião"
export function renderTurismo03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Viagem de avião - Touris</title>
  <desc>Ghibli anime art: Viagem de avião com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(300, 260, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <!-- Airport runway and apron -->
        <polygon points="-50,540 1250,540 1250,800 -50,800" fill="#475569"/>
        <line x1="0" y1="620" x2="1200" y2="620" stroke="#facc15" stroke-width="6" stroke-dasharray="40 30"/>
        <g transform="translate(920, 480) scale(0.85)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(520, 360) scale(1.25)" filter="url(#dropShadow)">
      <ellipse cx="0" cy="0" rx="90" ry="16" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
      <path d="M-90,0 Q0,-6 85,0" stroke="#dc2626" stroke-width="4" fill="none"/>
      <!-- Swept wings -->
      <polygon points="-10,-3 15,-65 35,-65 20,-3" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <polygon points="-10,3 15,65 35,65 20,3" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
      <!-- Tail -->
      <polygon points="-90,-2 -70,-42 -55,-42 -68,-2" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
      <!-- Windows row -->
      <rect x="-40" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="-25" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="-10" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="5" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="20" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="35" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="50" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/>
    </g>
        <g transform="translate(220, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
        <g transform="translate(340, 710) scale(1.1)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 4: "Passeio de balão"
export function renderTurismo04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Passeio de balão - Touris</title>
  <desc>Ghibli anime art: Passeio de balão com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(960, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <path d="M-50,600 Q320,530 680,590 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(240, 590) scale(0.9)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(480, 240) scale(1.2)" filter="url(#dropShadow)">
    <path d="M0,-110 C-65,-110 -75,-45 -50,20 C-38,55 -20,85 -12,95 L12,95 C20,85 38,55 50,20 C75,-45 65,-110 0,-110 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/>
    <path d="M-35,-102 C-52,-45 -30,45 -8,95 L8,95 C30,45 52,-45 35,-102 Z" fill="#facc15"/>
    <path d="M-18,-108 C-26,-45 -14,45 -5,95 L5,95 C14,45 26,-45 18,-108 Z" fill="#3b82f6"/>
    <line x1="-10" y1="95" x2="-6" y2="115" stroke="#475569" stroke-width="2"/>
    <line x1="10" y1="95" x2="6" y2="115" stroke="#475569" stroke-width="2"/>
    <ellipse cx="0" cy="106" rx="5" ry="8" fill="#f97316"/>
    <rect x="-12" y="115" width="24" height="18" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <line x1="-12" y1="123" x2="12" y2="123" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <g transform="translate(880, 190) scale(0.7)" filter="url(#dropShadow)">
    <path d="M0,-110 C-65,-110 -75,-45 -50,20 C-38,55 -20,85 -12,95 L12,95 C20,85 38,55 50,20 C75,-45 65,-110 0,-110 Z" fill="#8b5cf6" stroke="#7f1d1d" stroke-width="2"/>
    <path d="M-35,-102 C-52,-45 -30,45 -8,95 L8,95 C30,45 52,-45 35,-102 Z" fill="#ec4899"/>
    <path d="M-18,-108 C-26,-45 -14,45 -5,95 L5,95 C14,45 26,-45 18,-108 Z" fill="#fef08a"/>
    <line x1="-10" y1="95" x2="-6" y2="115" stroke="#475569" stroke-width="2"/>
    <line x1="10" y1="95" x2="6" y2="115" stroke="#475569" stroke-width="2"/>
    <ellipse cx="0" cy="106" rx="5" ry="8" fill="#f97316"/>
    <rect x="-12" y="115" width="24" height="18" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <line x1="-12" y1="123" x2="12" y2="123" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <g transform="translate(820, 690) scale(1.3)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 5: "Travessia costeira"
export function renderTurismo05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Travessia costeira - Touris</title>
  <desc>Ghibli anime art: Travessia costeira com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 280, 54, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(720, 530) scale(1.1)" filter="url(#dropShadow)">
      <!-- Catamaran / Twin Hull Boat -->
      <ellipse cx="0" cy="45" rx="80" ry="15" fill="#0f766e" opacity="0.4"/>
      <!-- Left hull -->
      <path d="M-65,25 Q-45,50 -20,50 L-15,22 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Right hull -->
      <path d="M20,22 L15,50 Q45,50 65,25 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Trampoline bridge -->
      <rect x="-25" y="20" width="50" height="10" fill="#3b82f6" rx="2"/>
      <!-- Mast & Twin striped sail -->
      <line x1="0" y1="20" x2="0" y2="-140" stroke="#334155" stroke-width="5"/>
      <path d="M0,-130 Q-40,-75 -65,-5 L0,5 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <path d="M0,-130 Q35,-75 60,-5 L0,5 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
        <g transform="translate(340, 680) scale(1.4)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
      
</svg>`;
}

// Scene 6: "Farol da ilha"
export function renderTurismo06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Farol da ilha - Touris</title>
  <desc>Ghibli anime art: Farol da ilha com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 200, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(880, 330) scale(1.05)" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    <line x1="-18" y1="-96" x2="-18" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="-6" y1="-96" x2="-6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="6" y1="-96" x2="6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="18" y1="-96" x2="18" y2="-86" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    <polygon points="0,-102 -700,-60 -700,80" fill="#fef08a" opacity="0.35" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(260, 540) scale(0.8)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(520, 590) scale(0.9)" filter="url(#dropShadow)">
      <!-- Sloop Sailboat -->
      <ellipse cx="0" cy="50" rx="70" ry="14" fill="#0f766e" opacity="0.4"/>
      <path d="M-75,20 Q-50,55 0,55 Q50,55 75,20 L65,15 Q0,20 -65,15 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/>
      <path d="M-70,22 Q0,28 70,22 L68,30 Q0,35 -68,30 Z" fill="#ef4444"/>
      <line x1="0" y1="20" x2="0" y2="-130" stroke="#5a381e" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="15" x2="75" y2="8" stroke="#5a381e" stroke-width="3"/>
      <!-- Mainsail -->
      <path d="M0,-120 Q-30,-70 -55,-5 L0,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <line x1="0" y1="-65" x2="-30" y2="-65" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Jib sail -->
      <path d="M0,-110 Q35,-50 68,10 L0,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    </g>
      
</svg>`;
}

// Scene 7: "Chegada ao hotel"
export function renderTurismo07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Chegada ao hotel - Touris</title>
  <desc>Ghibli anime art: Chegada ao hotel com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <path d="M-50,600 Q400,550 800,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(850, 180) scale(0.8)" filter="url(#dropShadow)">
      <ellipse cx="0" cy="0" rx="90" ry="16" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
      <path d="M-90,0 Q0,-6 85,0" stroke="#dc2626" stroke-width="4" fill="none"/>
      <!-- Swept wings -->
      <polygon points="-10,-3 15,-65 35,-65 20,-3" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <polygon points="-10,3 15,65 35,65 20,3" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
      <!-- Tail -->
      <polygon points="-90,-2 -70,-42 -55,-42 -68,-2" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
      <!-- Windows row -->
      <rect x="-40" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="-25" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="-10" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="5" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="20" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="35" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/><rect x="50" y="-5" width="6" height="4" rx="1.5" fill="#0284c7"/>
    </g>
        <g transform="translate(580, 530) scale(1.3)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(280, 690) scale(1.35)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
        <g transform="translate(380, 715) scale(1.1)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 8: "Descanso na praia"
export function renderTurismo08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Descanso na praia - Touris</title>
  <desc>Ghibli anime art: Descanso na praia com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 160, 52, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(880, 200) scale(0.85)" filter="url(#dropShadow)">
    <path d="M0,-110 C-65,-110 -75,-45 -50,20 C-38,55 -20,85 -12,95 L12,95 C20,85 38,55 50,20 C75,-45 65,-110 0,-110 Z" fill="#ec4899" stroke="#7f1d1d" stroke-width="2"/>
    <path d="M-35,-102 C-52,-45 -30,45 -8,95 L8,95 C30,45 52,-45 35,-102 Z" fill="#facc15"/>
    <path d="M-18,-108 C-26,-45 -14,45 -5,95 L5,95 C14,45 26,-45 18,-108 Z" fill="#06b6d4"/>
    <line x1="-10" y1="95" x2="-6" y2="115" stroke="#475569" stroke-width="2"/>
    <line x1="10" y1="95" x2="6" y2="115" stroke="#475569" stroke-width="2"/>
    <ellipse cx="0" cy="106" rx="5" ry="8" fill="#f97316"/>
    <rect x="-12" y="115" width="24" height="18" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <line x1="-12" y1="123" x2="12" y2="123" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <g transform="translate(360, 550) scale(1)" filter="url(#dropShadow)">
      <!-- Sloop Sailboat -->
      <ellipse cx="0" cy="50" rx="70" ry="14" fill="#0f766e" opacity="0.4"/>
      <path d="M-75,20 Q-50,55 0,55 Q50,55 75,20 L65,15 Q0,20 -65,15 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/>
      <path d="M-70,22 Q0,28 70,22 L68,30 Q0,35 -68,30 Z" fill="#ef4444"/>
      <line x1="0" y1="20" x2="0" y2="-130" stroke="#5a381e" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="15" x2="75" y2="8" stroke="#5a381e" stroke-width="3"/>
      <!-- Mainsail -->
      <path d="M0,-120 Q-30,-70 -55,-5 L0,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <line x1="0" y1="-65" x2="-30" y2="-65" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Jib sail -->
      <path d="M0,-110 Q35,-50 68,10 L0,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
      
</svg>`;
}

// Scene 9: "Roteiro pelas montanhas"
export function renderTurismo09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Roteiro pelas montanhas - Touris</title>
  <desc>Ghibli anime art: Roteiro pelas montanhas com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 250, 50, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <path d="M-50,590 Q300,510 650,570 T1250,540 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
        <path d="M-50,670 Q350,610 750,660 T1250,630 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(860, 590) scale(0.95)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(260, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
        <g transform="translate(420, 700) scale(1.4)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 10: "Travessia pelo porto"
export function renderTurismo10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Travessia pelo porto - Touris</title>
  <desc>Ghibli anime art: Travessia pelo porto com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(850, 210, 44, false)}
  ${drawGhibliCloud(240, 140, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(980, 310) scale(0.95)" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    <line x1="-18" y1="-96" x2="-18" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="-6" y1="-96" x2="-6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="6" y1="-96" x2="6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="18" y1="-96" x2="18" y2="-86" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    <polygon points="0,-102 -700,-60 -700,80" fill="#fef08a" opacity="0.35" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(480, 560) scale(1.25)" filter="url(#dropShadow)">
      <!-- Sloop Sailboat -->
      <ellipse cx="0" cy="50" rx="70" ry="14" fill="#0f766e" opacity="0.4"/>
      <path d="M-75,20 Q-50,55 0,55 Q50,55 75,20 L65,15 Q0,20 -65,15 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/>
      <path d="M-70,22 Q0,28 70,22 L68,30 Q0,35 -68,30 Z" fill="#ef4444"/>
      <line x1="0" y1="20" x2="0" y2="-130" stroke="#5a381e" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="15" x2="75" y2="8" stroke="#5a381e" stroke-width="3"/>
      <!-- Mainsail -->
      <path d="M0,-120 Q-30,-70 -55,-5 L0,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <line x1="0" y1="-65" x2="-30" y2="-65" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Jib sail -->
      <path d="M0,-110 Q35,-50 68,10 L0,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
        <g transform="translate(220, 690) scale(1.35)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
      
</svg>`;
}

// Scene 11: "Mirante sobre o oceano"
export function renderTurismo11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mirante sobre o oceano - Touris</title>
  <desc>Ghibli anime art: Mirante sobre o oceano com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <g transform="translate(860, 340) scale(1)" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    <line x1="-18" y1="-96" x2="-18" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="-6" y1="-96" x2="-6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="6" y1="-96" x2="6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="18" y1="-96" x2="18" y2="-86" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    <polygon points="0,-102 -500,-60 -500,60" fill="#fef08a" opacity="0.2" filter="url(#softGlow)"/>
  </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
        <g transform="translate(360, 710) scale(1.35)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 12: "Voo panorâmico sobre o mar"
export function renderTurismo12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Voo panorâmico sobre o mar - Touris</title>
  <desc>Ghibli anime art: Voo panorâmico sobre o mar com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(860, 160, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <g transform="translate(360, 220) scale(1.2)" filter="url(#dropShadow)">
    <path d="M0,-110 C-65,-110 -75,-45 -50,20 C-38,55 -20,85 -12,95 L12,95 C20,85 38,55 50,20 C75,-45 65,-110 0,-110 Z" fill="#3b82f6" stroke="#7f1d1d" stroke-width="2"/>
    <path d="M-35,-102 C-52,-45 -30,45 -8,95 L8,95 C30,45 52,-45 35,-102 Z" fill="#f59e0b"/>
    <path d="M-18,-108 C-26,-45 -14,45 -5,95 L5,95 C14,45 26,-45 18,-108 Z" fill="#10b981"/>
    <line x1="-10" y1="95" x2="-6" y2="115" stroke="#475569" stroke-width="2"/>
    <line x1="10" y1="95" x2="6" y2="115" stroke="#475569" stroke-width="2"/>
    <ellipse cx="0" cy="106" rx="5" ry="8" fill="#f97316"/>
    <rect x="-12" y="115" width="24" height="18" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <line x1="-12" y1="123" x2="12" y2="123" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <g transform="translate(820, 260) scale(1.1)" filter="url(#dropShadow)">
      <ellipse cx="0" cy="0" rx="75" ry="18" fill="#ffffff" stroke="#334155" stroke-width="2.5"/>
      <path d="M-75,0 Q-40,-8 0,-8 Q40,-8 75,0" stroke="#0284c7" stroke-width="5" fill="none"/>
      <!-- Tail fin -->
      <polygon points="-75,-2 -55,-45 -40,-45 -55,-2" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <!-- Main high wings -->
      <polygon points="-15,-5 -10,-60 25,-60 15,-5" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      <polygon points="-15,5 -10,60 25,60 15,5" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      <!-- Propeller engines on wings -->
      <ellipse cx="5" cy="-35" rx="8" ry="12" fill="#0284c7"/>
      <line x1="5" y1="-55" x2="5" y2="-15" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="5" cy="35" rx="8" ry="12" fill="#0284c7"/>
      <line x1="5" y1="15" x2="5" y2="55" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      <!-- Windows -->
      <circle cx="-25" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="-10" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="5" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="20" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="35" cy="-4" r="3.5" fill="#38bdf8"/>
      <!-- Cockpit windshield -->
      <path d="M50,-8 L65,-2 L50,0 Z" fill="#0284c7"/>
    </g>
      
</svg>`;
}

// Scene 13: "Passeio de catamarã ao pôr do sol"
export function renderTurismo13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Passeio de catamarã ao pôr do sol - Touris</title>
  <desc>Ghibli anime art: Passeio de catamarã ao pôr do sol com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <g transform="translate(620, 540) scale(1.3)" filter="url(#dropShadow)">
      <!-- Catamaran / Twin Hull Boat -->
      <ellipse cx="0" cy="45" rx="80" ry="15" fill="#0f766e" opacity="0.4"/>
      <!-- Left hull -->
      <path d="M-65,25 Q-45,50 -20,50 L-15,22 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Right hull -->
      <path d="M20,22 L15,50 Q45,50 65,25 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Trampoline bridge -->
      <rect x="-25" y="20" width="50" height="10" fill="#3b82f6" rx="2"/>
      <!-- Mast & Twin striped sail -->
      <line x1="0" y1="20" x2="0" y2="-140" stroke="#334155" stroke-width="5"/>
      <path d="M0,-130 Q-40,-75 -65,-5 L0,5 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <path d="M0,-130 Q35,-75 60,-5 L0,5 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
      
</svg>`;
}

// Scene 14: "Resort tropical à beira-mar"
export function renderTurismo14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Resort tropical à beira-mar - Touris</title>
  <desc>Ghibli anime art: Resort tropical à beira-mar com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(910, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(820, 510) scale(0.75)" filter="url(#dropShadow)">
      <!-- Sloop Sailboat -->
      <ellipse cx="0" cy="50" rx="70" ry="14" fill="#0f766e" opacity="0.4"/>
      <path d="M-75,20 Q-50,55 0,55 Q50,55 75,20 L65,15 Q0,20 -65,15 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/>
      <path d="M-70,22 Q0,28 70,22 L68,30 Q0,35 -68,30 Z" fill="#ef4444"/>
      <line x1="0" y1="20" x2="0" y2="-130" stroke="#5a381e" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="15" x2="75" y2="8" stroke="#5a381e" stroke-width="3"/>
      <!-- Mainsail -->
      <path d="M0,-120 Q-30,-70 -55,-5 L0,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <line x1="0" y1="-65" x2="-30" y2="-65" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Jib sail -->
      <path d="M0,-110 Q35,-50 68,10 L0,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
        <g transform="translate(420, 580) scale(1.15)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(720, 690) scale(1.3)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
      
</svg>`;
}

// Scene 15: "Farol sob as estrelas"
export function renderTurismo15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Farol sob as estrelas - Touris</title>
  <desc>Ghibli anime art: Farol sob as estrelas com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(980, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(880, 320) scale(1.1)" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    <line x1="-18" y1="-96" x2="-18" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="-6" y1="-96" x2="-6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="6" y1="-96" x2="6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="18" y1="-96" x2="18" y2="-86" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    <polygon points="0,-102 -700,-60 -700,80" fill="#fef08a" opacity="0.35" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(360, 570) scale(0.9)" filter="url(#dropShadow)">
      <!-- Wooden Coastal Fishing Boat -->
      <ellipse cx="0" cy="35" rx="55" ry="12" fill="#0f766e" opacity="0.4"/>
      <path d="M-60,10 Q-35,40 0,40 Q35,40 60,10 L50,5 Q0,10 -50,5 Z" fill="#b45309" stroke="#78350f" stroke-width="2.5"/>
      <rect x="-20" y="5" width="40" height="12" fill="#d97706" rx="2"/>
      <!-- Small cabin and awning -->
      <rect x="5" y="-15" width="30" height="20" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <line x1="-30" y1="12" x2="-45" y2="-25" stroke="#78350f" stroke-width="3"/> <!-- Fishing rod -->
      <line x1="-45" y1="-25" x2="-20" y2="40" stroke="#38bdf8" stroke-width="1" opacity="0.8"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
        <g transform="translate(220, 710) scale(1.3)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 16: "Enseada dos pescadores"
export function renderTurismo16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Enseada dos pescadores - Touris</title>
  <desc>Ghibli anime art: Enseada dos pescadores com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <g transform="translate(420, 540) scale(1.2)" filter="url(#dropShadow)">
      <!-- Wooden Coastal Fishing Boat -->
      <ellipse cx="0" cy="35" rx="55" ry="12" fill="#0f766e" opacity="0.4"/>
      <path d="M-60,10 Q-35,40 0,40 Q35,40 60,10 L50,5 Q0,10 -50,5 Z" fill="#b45309" stroke="#78350f" stroke-width="2.5"/>
      <rect x="-20" y="5" width="40" height="12" fill="#d97706" rx="2"/>
      <!-- Small cabin and awning -->
      <rect x="5" y="-15" width="30" height="20" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
      <line x1="-30" y1="12" x2="-45" y2="-25" stroke="#78350f" stroke-width="3"/> <!-- Fishing rod -->
      <line x1="-45" y1="-25" x2="-20" y2="40" stroke="#38bdf8" stroke-width="1" opacity="0.8"/>
    </g>
        <g transform="translate(780, 520) scale(0.85)" filter="url(#dropShadow)">
      <!-- Sloop Sailboat -->
      <ellipse cx="0" cy="50" rx="70" ry="14" fill="#0f766e" opacity="0.4"/>
      <path d="M-75,20 Q-50,55 0,55 Q50,55 75,20 L65,15 Q0,20 -65,15 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/>
      <path d="M-70,22 Q0,28 70,22 L68,30 Q0,35 -68,30 Z" fill="#ef4444"/>
      <line x1="0" y1="20" x2="0" y2="-130" stroke="#5a381e" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="15" x2="75" y2="8" stroke="#5a381e" stroke-width="3"/>
      <!-- Mainsail -->
      <path d="M0,-120 Q-30,-70 -55,-5 L0,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <line x1="0" y1="-65" x2="-30" y2="-65" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Jib sail -->
      <path d="M0,-110 Q35,-50 68,10 L0,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
      
</svg>`;
}

// Scene 17: "Aeroporto na ilha caribenha"
export function renderTurismo17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Aeroporto na ilha caribenha - Touris</title>
  <desc>Ghibli anime art: Aeroporto na ilha caribenha com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#334155"/>
        <line x1="0" y1="640" x2="1200" y2="640" stroke="#facc15" stroke-width="5" stroke-dasharray="35 25"/>
        <g transform="translate(260, 520) scale(0.9)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(680, 380) scale(1.2)" filter="url(#dropShadow)">
      <ellipse cx="0" cy="0" rx="75" ry="18" fill="#ffffff" stroke="#334155" stroke-width="2.5"/>
      <path d="M-75,0 Q-40,-8 0,-8 Q40,-8 75,0" stroke="#0284c7" stroke-width="5" fill="none"/>
      <!-- Tail fin -->
      <polygon points="-75,-2 -55,-45 -40,-45 -55,-2" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <!-- Main high wings -->
      <polygon points="-15,-5 -10,-60 25,-60 15,-5" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      <polygon points="-15,5 -10,60 25,60 15,5" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      <!-- Propeller engines on wings -->
      <ellipse cx="5" cy="-35" rx="8" ry="12" fill="#0284c7"/>
      <line x1="5" y1="-55" x2="5" y2="-15" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="5" cy="35" rx="8" ry="12" fill="#0284c7"/>
      <line x1="5" y1="15" x2="5" y2="55" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      <!-- Windows -->
      <circle cx="-25" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="-10" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="5" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="20" cy="-4" r="3.5" fill="#38bdf8"/><circle cx="35" cy="-4" r="3.5" fill="#38bdf8"/>
      <!-- Cockpit windshield -->
      <path d="M50,-8 L65,-2 L50,0 Z" fill="#0284c7"/>
    </g>
        <g transform="translate(940, 680) scale(1.3)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
      
</svg>`;
}

// Scene 18: "Aventura de balão no litoral"
export function renderTurismo18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Aventura de balão no litoral - Touris</title>
  <desc>Ghibli anime art: Aventura de balão no litoral com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(980, 320) scale(0.9)" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    <line x1="-18" y1="-96" x2="-18" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="-6" y1="-96" x2="-6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="6" y1="-96" x2="6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="18" y1="-96" x2="18" y2="-86" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    <polygon points="0,-102 -500,-60 -500,60" fill="#fef08a" opacity="0.2" filter="url(#softGlow)"/>
  </g>
        <g transform="translate(440, 240) scale(1.25)" filter="url(#dropShadow)">
    <path d="M0,-110 C-65,-110 -75,-45 -50,20 C-38,55 -20,85 -12,95 L12,95 C20,85 38,55 50,20 C75,-45 65,-110 0,-110 Z" fill="#f43f5e" stroke="#7f1d1d" stroke-width="2"/>
    <path d="M-35,-102 C-52,-45 -30,45 -8,95 L8,95 C30,45 52,-45 35,-102 Z" fill="#fbbf24"/>
    <path d="M-18,-108 C-26,-45 -14,45 -5,95 L5,95 C14,45 26,-45 18,-108 Z" fill="#38bdf8"/>
    <line x1="-10" y1="95" x2="-6" y2="115" stroke="#475569" stroke-width="2"/>
    <line x1="10" y1="95" x2="6" y2="115" stroke="#475569" stroke-width="2"/>
    <ellipse cx="0" cy="106" rx="5" ry="8" fill="#f97316"/>
    <rect x="-12" y="115" width="24" height="18" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <line x1="-12" y1="123" x2="12" y2="123" stroke="#78350f" stroke-width="1.5"/>
  </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
      
</svg>`;
}

// Scene 19: "Recepção elegante do hotel"
export function renderTurismo19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Recepção elegante do hotel - Touris</title>
  <desc>Ghibli anime art: Recepção elegante do hotel com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <g transform="translate(880, 490) scale(0.7)" filter="url(#dropShadow)">
      <!-- Catamaran / Twin Hull Boat -->
      <ellipse cx="0" cy="45" rx="80" ry="15" fill="#0f766e" opacity="0.4"/>
      <!-- Left hull -->
      <path d="M-65,25 Q-45,50 -20,50 L-15,22 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Right hull -->
      <path d="M20,22 L15,50 Q45,50 65,25 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <!-- Trampoline bridge -->
      <rect x="-25" y="20" width="50" height="10" fill="#3b82f6" rx="2"/>
      <!-- Mast & Twin striped sail -->
      <line x1="0" y1="20" x2="0" y2="-140" stroke="#334155" stroke-width="5"/>
      <path d="M0,-130 Q-40,-75 -65,-5 L0,5 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <path d="M0,-130 Q35,-75 60,-5 L0,5 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>
    </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
        <g transform="translate(520, 560) scale(1.3)" filter="url(#dropShadow)">
    <!-- Caribbean Beachfront Hotel / Resort Villa -->
    <rect x="-80" y="-70" width="160" height="140" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <!-- Terracotta tiled hipped roof -->
    <polygon points="-95,-70 0,-140 95,-70" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
    <!-- Decorative gingerbread lace trim -->
    <path d="M-90,-70 Q-75,-58 -60,-70 Q-45,-58 -30,-70 Q-15,-58 0,-70 Q15,-58 30,-70 Q45,-58 60,-70 Q75,-58 90,-70" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Balcony / Veranda with turquoise railing -->
    <rect x="-70" y="0" width="140" height="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2"/>
    <line x1="-70" y1="-15" x2="70" y2="-15" stroke="#0891b2" stroke-width="2"/>
    <line x1="-60" y1="-15" x2="-60" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-40" y1="-15" x2="-40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="-20" y1="-15" x2="-20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="20" y1="-15" x2="20" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="40" y1="-15" x2="40" y2="0" stroke="#0891b2" stroke-width="2"/><line x1="60" y1="-15" x2="60" y2="0" stroke="#0891b2" stroke-width="2"/>
    <!-- Arched Double Doors -->
    <path d="M-20,70 L-20,15 Q0,-5 20,15 L20,70 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- French windows with shutters -->
    <rect x="-65" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <rect x="37" y="-50" width="28" height="32" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <!-- Welcome awning -->
    <path d="M-30,12 L30,12 L24,-2 L-24,-2 Z" fill="#ef4444"/>
  </g>
        <g transform="translate(240, 690) scale(1.35)" filter="url(#dropShadow)">
    <!-- Bottom Big Leather Luggage -->
    <rect x="-45" y="-10" width="90" height="55" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
    <line x1="-25" y1="-10" x2="-25" y2="45" stroke="#78350f" stroke-width="4"/>
    <line x1="25" y1="-10" x2="25" y2="45" stroke="#78350f" stroke-width="4"/>
    <!-- Corner brass reinforcements -->
    <rect x="-45" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="-10" width="10" height="10" fill="#facc15"/>
    <rect x="-45" y="35" width="10" height="10" fill="#facc15"/>
    <rect x="35" y="35" width="10" height="10" fill="#facc15"/>
    <!-- Top Smaller Teal Suitcase -->
    <rect x="-35" y="-55" width="70" height="45" rx="6" fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M-10,-55 L-10,-68 Q0,-74 10,-68 L10,-55" fill="none" stroke="#451a03" stroke-width="4" stroke-linecap="round"/>
    <!-- Travel Stickers -->
    <circle cx="-16" cy="-32" r="8" fill="#f97316"/>
    <rect x="8" y="-40" width="14" height="14" rx="2" fill="#eab308"/>
    <polygon points="12,-20 18,-28 24,-20" fill="#ec4899"/>
  </g>
        <g transform="translate(340, 710) scale(1.15)" filter="url(#dropShadow)">
    <!-- Unrolled Parchment Nautical Chart -->
    <path d="M-45,-30 L45,-35 L40,35 L-50,30 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <!-- Island contour lines -->
    <path d="M-25,-10 Q-15,-25 0,-15 Q15,-20 20,-5 Q25,15 5,20 Q-20,25 -25,-10 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <!-- Compass Rose -->
    <circle cx="24" cy="-18" r="8" fill="none" stroke="#b45309" stroke-width="1"/>
    <polygon points="24,-25 26,-18 24,-11 22,-18" fill="#dc2626"/>
    <polygon points="17,-18 24,-16 31,-18 24,-20" fill="#0284c7"/>
    <!-- Route dotted red line -->
    <path d="M-30,15 Q-10,0 15,10" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 20: "Caminhada ao longo da falésia"
export function renderTurismo20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Caminhada ao longo da falésia - Touris</title>
  <desc>Ghibli anime art: Caminhada ao longo da falésia com elementos de turismo e mar caribenho.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 150, 52, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Caribbean Ocean Waters -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,540 Q300,500 650,540 T1250,520 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M-50,620 Q400,580 800,630 T1250,600 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Surf foam lines -->
  <path d="M0,550 Q250,535 500,555 T1000,545 T1200,555" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,610 Q220,595 450,615 T900,605 T1200,615" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>
        <!-- Distant Mountains -->
  <path d="M-50,490 Q240,410 520,470 T1150,430 L1250,490 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-50,540 Q320,470 650,520 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)" opacity="0.5"/>
        <g transform="translate(780, 310) scale(1.1)" filter="url(#dropShadow)">
    <!-- Cliff Rock Base -->
    <path d="M-90,260 L-70,120 Q-20,90 70,110 L130,150 L130,260 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    <!-- Lighthouse Tower Body -->
    <polygon points="-26,130 -16,-80 16,-80 26,130" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Middle Stripe -->
    <polygon points="-23,35 -19,-25 19,-25 23,35" fill="#dc2626"/>
    <!-- Gallery platform & railing -->
    <rect x="-24" y="-86" width="48" height="6" fill="#1e293b"/>
    <line x1="-22" y1="-96" x2="22" y2="-96" stroke="#1e293b" stroke-width="2"/>
    <line x1="-18" y1="-96" x2="-18" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="-6" y1="-96" x2="-6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="6" y1="-96" x2="6" y2="-86" stroke="#1e293b" stroke-width="1.5"/><line x1="18" y1="-96" x2="18" y2="-86" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Lantern Room Glass -->
    <rect x="-14" y="-116" width="28" height="28" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,-116 Q0,-138 16,-116 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-102" r="7" fill="#ffffff" filter="url(#softGlow)"/>
    <polygon points="0,-102 -500,-60 -500,60" fill="#fef08a" opacity="0.2" filter="url(#softGlow)"/>
  </g>
        <!-- Golden Sand Shoreline -->
  <path d="M-50,670 Q280,620 620,680 T1250,650 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- Starfish & shells -->
  <polygon points="520,730 525,745 540,745 528,755 532,770 520,760 508,770 512,755 500,745 515,745" fill="#f97316"/>
  <circle cx="680" cy="740" r="8" fill="#f43f5e"/>
  <circle cx="686" cy="738" r="6" fill="#fecdd3"/>
      
</svg>`;
}
