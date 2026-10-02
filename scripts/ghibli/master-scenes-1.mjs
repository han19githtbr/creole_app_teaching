import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";

export function renderTecnologia() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Oficina tecnológica no campo - Teknoloji</title>
  <desc>Ghibli anime art: Oficina com computador, robô, drone e moinho de vento.</desc>
  ${getGhibliDefs()}
  
  <!-- Sky -->
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  
  <!-- Sun & Clouds -->
  ${drawGhibliSun(980, 160, 48)}
  ${drawGhibliCloud(300, 140, 0.95)}
  ${drawGhibliCloud(820, 200, 0.85)}
  ${drawGhibliCloud(1120, 120, 0.7)}

  <!-- Distant Blue Mountains -->
  <path d="M-50,520 Q220,380 480,470 T1050,420 Q1180,450 1250,500 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.65"/>

  <!-- Mid Green Hills -->
  <path d="M-30,580 Q180,470 420,530 T950,500 Q1120,540 1230,570 L1230,800 L-30,800 Z" fill="url(#hillMid)"/>

  <!-- MOULEN VAN (Moinho de Vento) on middle hill -->
  <g transform="translate(360, 460)" filter="url(#dropShadow)">
    <!-- Tower Body -->
    <path d="M-36,90 L-22,-45 Q0,-55 22,-45 L36,90 Z" fill="url(#stoneTone)"/>
    <path d="M-28,-45 L0,-80 L28,-45 Z" fill="#6e3f28"/>
    <!-- Small arched windows -->
    <rect x="-6" y="-15" width="12" height="18" rx="6" fill="#2d3748"/>
    <rect x="-8" y="30" width="16" height="22" rx="8" fill="#2d3748"/>
    <!-- Windmill Blades / Rotor (Moulen van) -->
    <g transform="translate(0, -50)">
      <circle cx="0" cy="0" r="10" fill="#3a2312"/>
      <!-- Blade 1 -->
      <line x1="0" y1="0" x2="0" y2="-95" stroke="#4a301a" stroke-width="5"/>
      <rect x="3" y="-90" width="22" height="75" fill="#f4ebd9" opacity="0.9" stroke="#5a3d24" stroke-width="1.5"/>
      <!-- Blade 2 -->
      <line x1="0" y1="0" x2="95" y2="0" stroke="#4a301a" stroke-width="5"/>
      <rect x="15" y="3" width="75" height="22" fill="#f4ebd9" opacity="0.9" stroke="#5a3d24" stroke-width="1.5"/>
      <!-- Blade 3 -->
      <line x1="0" y1="0" x2="0" y2="95" stroke="#4a301a" stroke-width="5"/>
      <rect x="-25" y="15" width="22" height="75" fill="#f4ebd9" opacity="0.9" stroke="#5a3d24" stroke-width="1.5"/>
      <!-- Blade 4 -->
      <line x1="0" y1="0" x2="-95" y2="0" stroke="#4a301a" stroke-width="5"/>
      <rect x="-90" y="-25" width="75" height="22" fill="#f4ebd9" opacity="0.9" stroke="#5a3d24" stroke-width="1.5"/>
    </g>
  </g>

  <!-- Rolling Lush Foreground Hill -->
  <path d="M-50,660 Q280,590 620,640 T1250,620 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- DRÒN (Drone) hovering in sky -->
  <g transform="translate(680, 260)" filter="url(#dropShadow)">
    <!-- Carbon/wood cross arms -->
    <line x1="-55" y1="-25" x2="55" y2="25" stroke="#333f48" stroke-width="7" stroke-linecap="round"/>
    <line x1="-55" y1="25" x2="55" y2="-25" stroke="#333f48" stroke-width="7" stroke-linecap="round"/>
    <!-- Center fuselage -->
    <rect x="-22" y="-16" width="44" height="32" rx="10" fill="#d9a536" stroke="#222" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="12" ry="8" fill="#1b2a38"/>
    <!-- Cyan sensor lens -->
    <circle cx="0" cy="14" r="6" fill="#38bdf8"/>
    <!-- 4 Rotors with motion blur disks -->
    <g transform="translate(-55, -25)">
      <circle cx="0" cy="0" r="5" fill="#111"/>
      <ellipse cx="0" cy="0" rx="30" ry="8" fill="#e2e8f0" opacity="0.6" stroke="#94a3b8" stroke-width="1.5"/>
    </g>
    <g transform="translate(55, -25)">
      <circle cx="0" cy="0" r="5" fill="#111"/>
      <ellipse cx="0" cy="0" rx="30" ry="8" fill="#e2e8f0" opacity="0.6" stroke="#94a3b8" stroke-width="1.5"/>
    </g>
    <g transform="translate(-55, 25)">
      <circle cx="0" cy="0" r="5" fill="#111"/>
      <ellipse cx="0" cy="0" rx="30" ry="8" fill="#e2e8f0" opacity="0.6" stroke="#94a3b8" stroke-width="1.5"/>
    </g>
    <g transform="translate(55, 25)">
      <circle cx="0" cy="0" r="5" fill="#111"/>
      <ellipse cx="0" cy="0" rx="30" ry="8" fill="#e2e8f0" opacity="0.6" stroke="#94a3b8" stroke-width="1.5"/>
    </g>
    <!-- Landing legs -->
    <path d="M-18,16 L-24,34 M18,16 L24,34" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- WORKSHOP TERRACE / BENCH in foreground -->
  <g transform="translate(180, 570)" filter="url(#dropShadow)">
    <!-- Wooden table top -->
    <rect x="0" y="70" width="460" height="24" rx="4" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2"/>
    <rect x="30" y="94" width="22" height="140" fill="#5c381e"/>
    <rect x="408" y="94" width="22" height="140" fill="#5c381e"/>
    
    <!-- ÒDINATÈ (Computador Retro CRT) on desk -->
    <g transform="translate(140, -40)">
      <!-- CRT Monitor Housing -->
      <rect x="0" y="0" width="130" height="106" rx="14" fill="#e8dec8" stroke="#8c785d" stroke-width="3"/>
      <!-- Inner Screen Bezel -->
      <rect x="12" y="10" width="106" height="82" rx="8" fill="#1e2822" stroke="#4a554d" stroke-width="2"/>
      <!-- Glowing CRT Display with code -->
      <rect x="16" y="14" width="98" height="74" rx="6" fill="#0f1f17"/>
      <text x="24" y="36" font-family="monospace" font-size="11" font-weight="bold" fill="#34d399">> KREYÒL v2.0</text>
      <text x="24" y="52" font-family="monospace" font-size="10" fill="#10b981">> Teknoloji...</text>
      <text x="24" y="68" font-family="monospace" font-size="9" fill="#059669">> Aprann pi vit!</text>
      <rect x="24" y="72" width="7" height="9" fill="#34d399">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </rect>
      <!-- Monitor Stand -->
      <rect x="48" y="106" width="34" height="12" fill="#cfc2a9"/>
      <rect x="36" y="118" width="58" height="8" rx="2" fill="#b8a88c"/>
      <!-- Computer Tower -->
      <rect x="-56" y="24" width="46" height="102" rx="4" fill="#e0d4bc" stroke="#8c785d" stroke-width="2.5"/>
      <rect x="-48" y="36" width="30" height="8" rx="2" fill="#504537"/>
      <rect x="-48" y="50" width="30" height="8" rx="2" fill="#504537"/>
      <circle cx="-33" cy="74" r="3" fill="#10b981"/>
      <circle cx="-33" cy="86" r="4" fill="#dc2626"/>
      <!-- Keyboard -->
      <polygon points="10,124 120,124 130,146 0,146" fill="#ded3bc" stroke="#8c785d" stroke-width="2"/>
      <!-- Key rows -->
      <line x1="8" y1="130" x2="122" y2="130" stroke="#78674d" stroke-width="2" stroke-dasharray="5 3"/>
      <line x1="6" y1="137" x2="124" y2="137" stroke="#78674d" stroke-width="2" stroke-dasharray="5 3"/>
      <line x1="38" y1="142" x2="92" y2="142" stroke="#78674d" stroke-width="2.5"/>
    </g>

    <!-- ROBO (Robô Automaton Steampunk Ghibli) standing right -->
    <g transform="translate(360, -30)" filter="url(#dropShadow)">
      <!-- Shadow on desk/floor -->
      <ellipse cx="2" cy="144" rx="38" ry="10" fill="#000000" opacity="0.25"/>
      <!-- Legs -->
      <rect x="-24" y="90" width="16" height="50" rx="8" fill="#8c6227" stroke="#4a320f" stroke-width="2"/>
      <rect x="8" y="90" width="16" height="50" rx="8" fill="#8c6227" stroke="#4a320f" stroke-width="2"/>
      <!-- Brass Torso -->
      <rect x="-34" y="25" width="68" height="68" rx="22" fill="url(#brassTone)" stroke="#52390a" stroke-width="2.5"/>
      <!-- Torso gauge / dial -->
      <circle cx="0" cy="54" r="14" fill="#f8fafc" stroke="#52390a" stroke-width="2"/>
      <line x1="0" y1="54" x2="8" y2="48" stroke="#dc2626" stroke-width="2"/>
      <circle cx="0" cy="54" r="3" fill="#1e293b"/>
      <!-- Brass Collar -->
      <rect x="-18" y="16" width="36" height="12" rx="4" fill="#a17521"/>
      <!-- Round Head -->
      <ellipse cx="0" cy="-6" rx="30" ry="26" fill="url(#brassTone)" stroke="#52390a" stroke-width="2.5"/>
      <!-- Gentle glowing eye lens -->
      <circle cx="-10" cy="-6" r="9" fill="#1e293b" stroke="#52390a" stroke-width="1.5"/>
      <circle cx="-10" cy="-6" r="6" fill="#38bdf8"/>
      <circle cx="-12" cy="-8" r="2" fill="#ffffff"/>
      <circle cx="10" cy="-6" r="9" fill="#1e293b" stroke="#52390a" stroke-width="1.5"/>
      <circle cx="10" cy="-6" r="6" fill="#38bdf8"/>
      <circle cx="8" cy="-8" r="2" fill="#ffffff"/>
      <!-- Robot Antenna with friendly red light -->
      <line x1="0" y1="-32" x2="0" y2="-48" stroke="#52390a" stroke-width="3"/>
      <circle cx="0" cy="-52" r="6" fill="#ef4444"/>
      <!-- Articulated Arms holding a seedling -->
      <path d="M-32,38 Q-54,58 -38,82 Q-20,84 -14,70" fill="none" stroke="#785315" stroke-width="7" stroke-linecap="round"/>
      <path d="M32,38 Q52,58 38,80 Q20,84 14,70" fill="none" stroke="#785315" stroke-width="7" stroke-linecap="round"/>
      <!-- Tiny green sprout in hands -->
      <path d="M0,66 Q0,50 4,44 Q14,46 12,58 Z" fill="#22c55e"/>
      <path d="M0,66 Q0,50 -4,44 Q-14,46 -12,58 Z" fill="#4ade80"/>
    </g>
  </g>

  <!-- Foreground Grass & Flowers -->
  <g transform="translate(0, 750)">
    <circle cx="80" cy="10" r="14" fill="#facc15"/>
    <circle cx="80" cy="10" r="6" fill="#ea580c"/>
    <circle cx="150" cy="20" r="16" fill="#f43f5e"/>
    <circle cx="750" cy="15" r="15" fill="#facc15"/>
    <circle cx="920" cy="10" r="18" fill="#38bdf8"/>
    <circle cx="1080" cy="20" r="16" fill="#ec4899"/>
  </g>
</svg>`;
}

export function renderNatureza() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Árvore ancestral e prado florido - Lanati</title>
  <desc>Ghibli anime art: Árvore grandiosa, prado com flores, borboletas e pássaro.</desc>
  ${getGhibliDefs()}
  
  <!-- Sky -->
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  
  <!-- Sun & Volumetric Clouds -->
  ${drawGhibliSun(950, 150, 52)}
  ${drawGhibliCloud(220, 160, 1.05)}
  ${drawGhibliCloud(760, 180, 0.9)}
  ${drawGhibliCloud(1060, 110, 0.75)}

  <!-- Distant Blue Ridge Mountains -->
  <path d="M-50,480 Q240,360 520,440 T1150,390 Q1220,410 1250,440 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>

  <!-- Mid Forest Hills -->
  <path d="M-30,550 Q280,480 600,530 T1250,510 L1250,800 L-30,800 Z" fill="url(#hillMid)"/>

  <!-- Sparkling River curving through meadow -->
  <path d="M720,530 Q680,600 780,680 T880,800 L1020,800 Q920,680 840,600 T860,530 Z" fill="url(#waterTone)" opacity="0.85"/>
  <path d="M740,550 Q710,610 800,690" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.6"/>

  <!-- PYEBWA (Árvore Ancestral Ghibli Colossal) on the left -->
  <g transform="translate(190, 800)" filter="url(#dropShadow)">
    <!-- Massive Gnarled Roots and Trunk -->
    <path d="M-130,0 
      C-110,-120 -150,-240 -120,-380 
      C-100,-460 -140,-540 -70,-620 
      C-40,-650 30,-640 60,-590 
      C120,-500 80,-420 110,-320 
      C140,-200 170,-100 210,0 Z" 
      fill="url(#woodTone)" stroke="#382110" stroke-width="4"/>
    <!-- Bark Texture Grooves & Moss -->
    <path d="M-70,-100 Q-80,-280 -40,-420" stroke="#361e0f" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M0,-80 Q-20,-260 20,-450" stroke="#361e0f" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M70,-90 Q60,-240 70,-380" stroke="#361e0f" stroke-width="7" fill="none" stroke-linecap="round"/>
    <!-- Moss patches on bark -->
    <ellipse cx="-45" cy="-220" rx="18" ry="40" fill="#4d7c0f" opacity="0.7"/>
    <ellipse cx="35" cy="-300" rx="14" ry="32" fill="#4d7c0f" opacity="0.65"/>
    <!-- Major Sprawling Canopy Branches -->
    <path d="M-100,-420 Q-240,-460 -320,-540 Q-200,-510 -70,-460" fill="url(#woodTone)"/>
    <path d="M70,-400 Q220,-440 330,-500 Q200,-470 50,-430" fill="url(#woodTone)"/>

    <!-- Lush Foliage Billows (Ghibli painted leaf canopy) -->
    <!-- Back layer (Dark Forest Green) -->
    <ellipse cx="-80" cy="-620" rx="260" ry="190" fill="#14532d"/>
    <ellipse cx="140" cy="-580" rx="240" ry="180" fill="#166534"/>
    <ellipse cx="-220" cy="-540" rx="170" ry="130" fill="#14532d"/>
    <ellipse cx="260" cy="-510" rx="160" ry="120" fill="#166534"/>
    <!-- Mid layer (Rich Emerald / Olive) -->
    <ellipse cx="-60" cy="-640" rx="220" ry="160" fill="#15803d"/>
    <ellipse cx="120" cy="-610" rx="200" ry="150" fill="#22c55e"/>
    <ellipse cx="-190" cy="-560" rx="140" ry="110" fill="#16a34a"/>
    <ellipse cx="230" cy="-530" rx="130" ry="100" fill="#15803d"/>
    <!-- Top Highlights (Sun-kissed Chartreuse Green) -->
    <ellipse cx="-40" cy="-680" rx="160" ry="110" fill="#4ade80" opacity="0.8"/>
    <ellipse cx="100" cy="-650" rx="150" ry="100" fill="#86efac" opacity="0.75"/>
    <ellipse cx="-160" cy="-590" rx="100" ry="70" fill="#4ade80" opacity="0.75"/>
    <ellipse cx="200" cy="-560" rx="90" ry="60" fill="#86efac" opacity="0.7"/>

    <!-- ZWAZO (Pássaro Tropical Haitiano) perched on branch -->
    <g transform="translate(180, -435)">
      <!-- Branch perch -->
      <line x1="-30" y1="10" x2="40" y2="10" stroke="#361e0f" stroke-width="8" stroke-linecap="round"/>
      <!-- Bird Body -->
      <ellipse cx="0" cy="-14" rx="22" ry="14" fill="#0284c7" transform="rotate(-15)"/>
      <ellipse cx="-6" cy="-8" rx="14" ry="10" fill="#ef4444"/> <!-- Crimson chest -->
      <!-- Head -->
      <circle cx="16" cy="-24" r="11" fill="#047857"/>
      <!-- Beak -->
      <polygon points="26,-26 38,-22 26,-18" fill="#eab308"/>
      <!-- Eye -->
      <circle cx="20" cy="-25" r="2.5" fill="#000000"/>
      <circle cx="21" cy="-26" r="0.8" fill="#ffffff"/>
      <!-- Tail feathers -->
      <polygon points="-20,-10 -52,6 -44,12 -15,-6" fill="#0369a1"/>
    </g>
  </g>

  <!-- Rolling Fore Meadow -->
  <path d="M-50,680 Q320,620 680,670 T1250,650 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- PAPIYON (Borboletas) fluttering over meadow -->
  <!-- Butterfly 1: Monarch (Orange & Black) -->
  <g transform="translate(560, 520) scale(1.1)" filter="url(#dropShadow)">
    <!-- Wings left -->
    <path d="M0,0 Q-42,-38 -36,-72 Q-10,-68 0,-24" fill="#f97316" stroke="#0f172a" stroke-width="3"/>
    <path d="M0,-12 Q-38,-4 -28,32 Q-6,22 0,0" fill="#ea580c" stroke="#0f172a" stroke-width="3"/>
    <!-- Wings right -->
    <path d="M0,0 Q42,-38 36,-72 Q10,-68 0,-24" fill="#f97316" stroke="#0f172a" stroke-width="3"/>
    <path d="M0,-12 Q38,-4 28,32 Q6,22 0,0" fill="#ea580c" stroke="#0f172a" stroke-width="3"/>
    <!-- Wing White dots -->
    <circle cx="-30" cy="-60" r="2.5" fill="#ffffff"/>
    <circle cx="-24" cy="-48" r="2" fill="#ffffff"/>
    <circle cx="30" cy="-60" r="2.5" fill="#ffffff"/>
    <circle cx="24" cy="-48" r="2" fill="#ffffff"/>
    <!-- Body & Antennae -->
    <ellipse cx="0" cy="-8" rx="4" ry="18" fill="#0f172a"/>
    <path d="M-2,-24 Q-8,-40 -14,-46 M2,-24 Q8,-40 14,-46" stroke="#0f172a" stroke-width="1.5" fill="none"/>
  </g>

  <!-- Butterfly 2: Blue Morpho -->
  <g transform="translate(740, 460) scale(0.9)" filter="url(#dropShadow)">
    <path d="M0,0 Q-38,-34 -32,-64 Q-8,-60 0,-20" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>
    <path d="M0,-10 Q-32,-4 -24,28 Q-4,18 0,0" fill="#0369a1" stroke="#0f172a" stroke-width="2.5"/>
    <path d="M0,0 Q38,-34 32,-64 Q8,-60 0,-20" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>
    <path d="M0,-10 Q32,-4 24,28 Q4,18 0,0" fill="#0369a1" stroke="#0f172a" stroke-width="2.5"/>
    <!-- Iridescent Blue highlights -->
    <ellipse cx="-16" cy="-42" rx="10" ry="16" fill="#38bdf8" opacity="0.8"/>
    <ellipse cx="16" cy="-42" rx="10" ry="16" fill="#38bdf8" opacity="0.8"/>
    <ellipse cx="0" cy="-6" rx="3.5" ry="16" fill="#0f172a"/>
  </g>

  <!-- FLÈ (Flores exuberantes e detalhadas) in foreground -->
  <g transform="translate(0, 680)">
    <!-- Red Hibiscus 1 -->
    <g transform="translate(380, 40) scale(1.3)" filter="url(#dropShadow)">
      <circle cx="-16" cy="-10" r="18" fill="#e11d48"/>
      <circle cx="16" cy="-10" r="18" fill="#e11d48"/>
      <circle cx="-12" cy="14" r="18" fill="#be123c"/>
      <circle cx="12" cy="14" r="18" fill="#be123c"/>
      <circle cx="0" cy="-20" r="18" fill="#f43f5e"/>
      <circle cx="0" cy="0" r="10" fill="#9f1239"/>
      <!-- Golden stamen -->
      <line x1="0" y1="0" x2="6" y2="-28" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
      <circle cx="6" cy="-28" r="4" fill="#ea580c"/>
    </g>

    <!-- Red Hibiscus 2 -->
    <g transform="translate(680, 60) scale(1.1)" filter="url(#dropShadow)">
      <circle cx="-14" cy="-8" r="16" fill="#e11d48"/>
      <circle cx="14" cy="-8" r="16" fill="#e11d48"/>
      <circle cx="-10" cy="12" r="16" fill="#be123c"/>
      <circle cx="10" cy="12" r="16" fill="#be123c"/>
      <circle cx="0" cy="-16" r="16" fill="#f43f5e"/>
      <circle cx="0" cy="0" r="8" fill="#9f1239"/>
      <line x1="0" y1="0" x2="-4" y2="-24" stroke="#facc15" stroke-width="2.5" stroke-linecap="round"/>
    </g>

    <!-- Daisies cluster -->
    <g transform="translate(510, 60)">
      <circle cx="0" cy="0" r="10" fill="#eab308"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `<ellipse cx="0" cy="-18" rx="5" ry="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" transform="rotate(${deg} 0 0)"/>`).join("")}
      <circle cx="0" cy="0" r="9" fill="#f59e0b"/>
    </g>

    <g transform="translate(860, 40) scale(0.9)">
      <circle cx="0" cy="0" r="10" fill="#eab308"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `<ellipse cx="0" cy="-18" rx="5" ry="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" transform="rotate(${deg} 0 0)"/>`).join("")}
      <circle cx="0" cy="0" r="9" fill="#f59e0b"/>
    </g>

    <!-- Bluebell flowers -->
    <g transform="translate(1020, 50) scale(1.2)">
      <path d="M0,30 Q-10,0 20,-20" stroke="#15803d" stroke-width="3" fill="none"/>
      <circle cx="20" cy="-20" r="12" fill="#3b82f6"/>
      <circle cx="10" cy="-5" r="10" fill="#60a5fa"/>
    </g>
  </g>
</svg>`;
}

export function renderCultura() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Festa na praça com bandeirolas - Kilti</title>
  <desc>Ghibli anime art: Praça haitiana com tambor, bandeira, lanternas e casas coloniais.</desc>
  ${getGhibliDefs()}
  
  <!-- Warm Golden Sunset Sky -->
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 360, 54, true)}
  ${drawGhibliCloud(200, 160, 0.9, true)}
  ${drawGhibliCloud(960, 180, 0.85, true)}

  <!-- Distant Hilltops -->
  <path d="M-50,530 Q300,460 600,510 T1250,480 L1250,800 L-50,800 Z" fill="#6a3e5c" opacity="0.6"/>

  <!-- BUNTING FESTIVE FLAGS (Bandeirolas coloridas) -->
  <g>
    <!-- String 1 -->
    <path d="M-20,240 Q600,340 1220,260" stroke="#334155" stroke-width="2.5" fill="none"/>
    ${[60, 160, 260, 360, 460, 560, 660, 760, 860, 960, 1060, 1160].map((x, i) => {
      const colors = ["#00209f", "#d21034", "#f59e0b", "#10b981", "#ffffff"];
      const c = colors[i % colors.length];
      const y = 240 + Math.sin((x / 1200) * Math.PI) * 90;
      return `<polygon points="${x-14},${y} ${x+14},${y} ${x},${y+38}" fill="${c}" stroke="#1e293b" stroke-width="1"/>`;
    }).join("")}

    <!-- String 2 -->
    <path d="M-20,320 Q600,410 1220,330" stroke="#334155" stroke-width="2.5" fill="none"/>
    ${[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map((x, i) => {
      const colors = ["#d21034", "#00209f", "#ffffff", "#f59e0b", "#8b5cf6"];
      const c = colors[i % colors.length];
      const y = 320 + Math.sin((x / 1200) * Math.PI) * 85;
      return `<polygon points="${x-12},${y} ${x+12},${y} ${x},${y+32}" fill="${c}" stroke="#1e293b" stroke-width="1"/>`;
    }).join("")}
  </g>

  <!-- KAY (Casas Tradicionais Gingerbread Haitianas) in background -->
  <!-- Left House (Turquoise & Coral) -->
  <g transform="translate(180, 560)" filter="url(#dropShadow)">
    <rect x="-120" y="-140" width="240" height="140" fill="#2dd4bf" stroke="#0f766e" stroke-width="3"/>
    <!-- Pitch Roof with lace trim -->
    <polygon points="-140,-140 0,-240 140,-140" fill="#f43f5e" stroke="#be123c" stroke-width="3"/>
    <!-- Dentelle lace fretwork -->
    <path d="M-130,-140 Q-115,-125 -100,-140 Q-85,-125 -70,-140 Q-55,-125 -40,-140 Q-25,-125 -10,-140 Q5,-125 20,-140 Q35,-125 50,-140 Q65,-125 80,-140 Q95,-125 110,-140 Q125,-125 130,-140" stroke="#ffffff" stroke-width="4" fill="none"/>
    <!-- Arched Door & Louvered Windows -->
    <path d="M-24,0 L-24,-70 Q0,-95 24,-70 L24,0 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-90" y="-85" width="40" height="50" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="50" y="-85" width="40" height="50" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>

  <!-- Right House (Golden Yellow & Cobalt Blue) -->
  <g transform="translate(980, 560)" filter="url(#dropShadow)">
    <rect x="-110" y="-150" width="220" height="150" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="-130,-150 0,-250 130,-150" fill="#2563eb" stroke="#1d4ed8" stroke-width="3"/>
    <path d="M-120,-150 Q-105,-135 -90,-150 Q-75,-135 -60,-150 Q-45,-135 -30,-150 Q-15,-135 0,-150 Q15,-135 30,-150 Q45,-135 60,-150 Q75,-135 90,-150 Q105,-135 120,-150" stroke="#ffffff" stroke-width="4" fill="none"/>
    <path d="M-22,0 L-22,-70 Q0,-90 22,-70 L22,0 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <rect x="-85" y="-95" width="38" height="52" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <rect x="47" y="-95" width="38" height="52" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>

  <!-- Cobblestone Town Square Plaza -->
  <path d="M-50,620 Q600,560 1250,620 L1250,800 L-50,800 Z" fill="#78716c"/>
  <ellipse cx="600" cy="740" rx="480" ry="120" fill="#a8a29e" opacity="0.4"/>

  <!-- DRAPO (Bandeira do Haiti) on central flagpole -->
  <g transform="translate(380, 240)" filter="url(#dropShadow)">
    <!-- Flagpole -->
    <line x1="0" y1="0" x2="0" y2="400" stroke="#d6d3d1" stroke-width="7" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="9" fill="#f59e0b"/>
    <!-- Flag waving -->
    <!-- Top Blue -->
    <path d="M0,10 Q50,-4 100,10 T200,10 L200,75 Q150,60 100,75 T0,75 Z" fill="#00209f"/>
    <!-- Bottom Red -->
    <path d="M0,75 Q50,60 100,75 T200,75 L200,140 Q150,126 100,140 T0,140 Z" fill="#d21034"/>
    <!-- White center panel with Arms silhouette -->
    <rect x="75" y="55" width="50" height="40" rx="3" fill="#ffffff"/>
    <circle cx="100" cy="72" r="10" fill="#15803d"/>
    <line x1="100" y1="62" x2="100" y2="82" stroke="#854d0e" stroke-width="2.5"/>
  </g>

  <!-- LANP (Lanternas / Lâmpadas Festivas) hanging with warm glow -->
  <g transform="translate(480, 420)" filter="url(#dropShadow)">
    <line x1="0" y1="-80" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <!-- Glow halo -->
    <circle cx="0" cy="15" r="42" fill="#fef08a" opacity="0.3" filter="url(#softGlow)"/>
    <!-- Glass & Brass Kerosene Lamp (Lanp tèt gridap) -->
    <ellipse cx="0" cy="18" rx="20" ry="24" fill="#fef08a" opacity="0.85" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="16" rx="6" ry="12" fill="#f97316"/> <!-- Flame -->
    <ellipse cx="0" cy="18" rx="3" ry="7" fill="#ffffff"/>
    <rect x="-14" y="38" width="28" height="12" rx="3" fill="#78350f"/>
    <rect x="-10" y="-8" width="20" height="8" rx="2" fill="#78350f"/>
  </g>

  <g transform="translate(740, 400)" filter="url(#dropShadow)">
    <line x1="0" y1="-70" x2="0" y2="0" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="15" r="42" fill="#fef08a" opacity="0.3" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="18" rx="20" ry="24" fill="#fef08a" opacity="0.85" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="0" cy="16" rx="6" ry="12" fill="#f97316"/>
    <ellipse cx="0" cy="18" rx="3" ry="7" fill="#ffffff"/>
    <rect x="-14" y="38" width="28" height="12" rx="3" fill="#78350f"/>
    <rect x="-10" y="-8" width="20" height="8" rx="2" fill="#78350f"/>
  </g>

  <!-- TANBOU (Tambor Tradicional Haitiano Grandioso) in foreground -->
  <g transform="translate(620, 680)" filter="url(#dropShadow)">
    <!-- Shadow on cobblestones -->
    <ellipse cx="0" cy="72" rx="68" ry="18" fill="#000000" opacity="0.35"/>
    
    <!-- Wooden Drum Body (Hand-carved Mahogany) -->
    <path d="M-52,-70 L52,-70 Q62,10 42,70 L-42,70 Q-62,10 -52,-70 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="3"/>
    
    <!-- Natural Goatskin Drumhead Top -->
    <ellipse cx="0" cy="-70" rx="52" ry="16" fill="#fef3c7" stroke="#78350f" stroke-width="3"/>
    <ellipse cx="0" cy="-70" rx="46" ry="13" fill="#fde68a" opacity="0.7"/>
    <ellipse cx="-4" cy="-71" rx="26" ry="8" fill="#d97706" opacity="0.25"/> <!-- Playing wear -->

    <!-- Metal hoops and tuning ropes (Kòd tanbou) -->
    <ellipse cx="0" cy="-56" rx="54" ry="16" fill="none" stroke="#292524" stroke-width="5"/>
    <ellipse cx="0" cy="20" rx="51" ry="15" fill="none" stroke="#292524" stroke-width="4"/>
    <ellipse cx="0" cy="66" rx="43" ry="12" fill="none" stroke="#292524" stroke-width="4"/>

    <!-- V-laced tension cords -->
    <path d="M-50,-56 L-30,20 L-10,-56 L10,20 L30,-56 L50,20" stroke="#facc15" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M-40,20 L-20,66 L0,20 L20,66 L40,20" stroke="#facc15" stroke-width="3.5" fill="none" stroke-linecap="round"/>

    <!-- Drum tuning peg -->
    <polygon points="52,-20 68,-14 66,-24" fill="#a16207"/>
    <polygon points="-52,-20 -68,-14 -66,-24" fill="#a16207"/>
  </g>
</svg>`;
}

export function renderTurismo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vila costeira, farol e balão - Touris</title>
  <desc>Ghibli anime art: Mar caribenho, veleiro, farol na falésia e balão de ar quente.</desc>
  ${getGhibliDefs()}
  
  <!-- Bright Tropical Sea Sky -->
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 50)}
  ${drawGhibliCloud(180, 130, 0.95)}
  ${drawGhibliCloud(680, 190, 0.85)}

  <!-- BALON (Balão de Ar Quente Majestoso) floating high in sky -->
  <g transform="translate(320, 190)" filter="url(#dropShadow)">
    <!-- Striped Balloon Envelope -->
    <path d="M0,-120 
      C-75,-120 -85,-50 -60,20 
      C-45,60 -25,95 -14,105 
      L14,105 
      C25,95 45,60 60,20 
      C85,-50 75,-120 0,-120 Z" 
      fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
    <!-- Rainbow vertical stripes -->
    <path d="M-40,-112 C-60,-50 -35,50 -10,105 L10,105 C35,50 60,-50 40,-112 Z" fill="#facc15"/>
    <path d="M-20,-118 C-30,-50 -15,50 -6,105 L6,105 C15,50 30,-50 20,-118 Z" fill="#3b82f6"/>
    <!-- Burner ring with flame -->
    <line x1="-12" y1="105" x2="-8" y2="125" stroke="#475569" stroke-width="2"/>
    <line x1="12" y1="105" x2="8" y2="125" stroke="#475569" stroke-width="2"/>
    <ellipse cx="0" cy="116" rx="6" ry="10" fill="#f97316"/>
    <ellipse cx="0" cy="118" rx="3" ry="5" fill="#fef08a"/>
    <!-- Woven Wicker Basket -->
    <rect x="-14" y="125" width="28" height="22" rx="4" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <line x1="-14" y1="134" x2="14" y2="134" stroke="#78350f" stroke-width="2"/>
  </g>

  <!-- Distant Tropical Island Cliffs -->
  <path d="M-50,490 Q240,430 520,480 T1150,450 L1250,510 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>

  <!-- LANMÈ (Mar Caribenho Azul-Turquesa e Cristalino) -->
  <path d="M-50,500 L1250,500 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <!-- Turquoise shallow waters gradient overlay -->
  <path d="M-50,560 Q300,520 650,560 T1250,540 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.75"/>
  <path d="M-50,640 Q400,600 800,650 T1250,620 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>
  <!-- Gentle White Foamy Surf Waves -->
  <path d="M0,580 Q250,565 500,585 T1000,575 T1200,585" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M0,640 Q220,625 450,645 T900,635 T1200,645" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.75"/>

  <!-- FA (Farol Costeiro na Falésia de Pedra) on right cliff -->
  <g transform="translate(1020, 310)" filter="url(#dropShadow)">
    <!-- Sea Cliff Rock -->
    <path d="M-100,420 L-80,220 Q-20,180 80,210 L160,250 L160,420 Z" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    
    <!-- Lighthouse Tower Body -->
    <polygon points="-28,200 -18,-70 18,-70 28,200" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    <!-- Red Broad Stripe in Middle -->
    <polygon points="-24,70 -20,-10 20,-10 24,70" fill="#dc2626"/>
    <!-- Catwalk & Railing -->
    <rect x="-26" y="-76" width="52" height="6" fill="#1e293b"/>
    <line x1="-24" y1="-86" x2="24" y2="-86" stroke="#1e293b" stroke-width="2"/>
    <line x1="-20" y1="-86" x2="-20" y2="-76" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="-86" x2="0" y2="-76" stroke="#1e293b" stroke-width="2"/>
    <line x1="20" y1="-86" x2="20" y2="-76" stroke="#1e293b" stroke-width="2"/>
    <!-- Glass Lantern Room & Fresnel Dome -->
    <rect x="-16" y="-106" width="32" height="30" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-18,-106 Q0,-130 18,-106 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <circle cx="0" cy="-90" r="8" fill="#ffffff" filter="url(#softGlow)"/>
    <!-- Beacon Light Ray sweeping over water -->
    <polygon points="0,-90 -600,-40 -600,100" fill="#fef08a" opacity="0.22" filter="url(#softGlow)"/>
  </g>

  <!-- BATO (Barco a Vela Tradicional de Madeira) floating on clear waters -->
  <g transform="translate(480, 590)" filter="url(#dropShadow)">
    <!-- Water Ripple reflection -->
    <ellipse cx="0" cy="64" rx="80" ry="16" fill="#0f766e" opacity="0.5"/>
    <path d="M-70,72 Q0,82 70,72" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.8"/>
    
    <!-- Wooden Hull with Colorful Trim -->
    <path d="M-85,25 Q-60,65 0,65 Q60,65 85,25 L75,20 Q0,25 -75,20 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="3"/>
    <!-- Red sheer line stripe -->
    <path d="M-82,28 Q0,34 82,28 L80,36 Q0,42 -80,36 Z" fill="#ef4444"/>
    <rect x="-40" y="10" width="35" height="15" rx="3" fill="#78350f"/>
    
    <!-- Mast -->
    <line x1="5" y1="25" x2="5" y2="-150" stroke="#5a381e" stroke-width="6" stroke-linecap="round"/>
    <!-- Bowsprit pole -->
    <line x1="5" y1="20" x2="95" y2="10" stroke="#5a381e" stroke-width="4"/>

    <!-- Billowing Canvas Sail (Vwal) -->
    <!-- Mainsail -->
    <path d="M5,-140 Q-35,-80 -65,-10 L5,-5 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="5" y1="-75" x2="-35" y2="-75" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Jib triangular front sail -->
    <path d="M5,-130 Q45,-60 85,12 L5,-5 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2.5"/>
  </g>

  <!-- Golden Sandy Shoreline in front -->
  <path d="M-50,710 Q280,660 620,720 T1250,690 L1250,800 L-50,800 Z" fill="#fde68a"/>
</svg>`;
}

export function renderInterior() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Fazenda ao meio-dia - Andeyò</title>
  <desc>Ghibli anime art: Casa de fazenda no interior com árvores, horta e cerca rústica.</desc>
  ${getGhibliDefs()}
  
  <!-- Midday Country Sky -->
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(980, 150, 52)}
  ${drawGhibliCloud(240, 140, 1.0)}
  ${drawGhibliCloud(760, 190, 0.85)}

  <!-- Distant Blue Hills -->
  <path d="M-50,510 Q320,440 680,490 T1250,470 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>

  <!-- Mid Pastoral Slopes -->
  <path d="M-30,570 Q280,510 600,560 T1250,530 L1250,800 L-30,800 Z" fill="url(#hillMid)"/>

  <!-- PYEBWA (Árvores Frutíferas e Bananeiras ao redor da casa) -->
  <g transform="translate(160, 580)" filter="url(#dropShadow)">
    <!-- Tree Trunk -->
    <path d="M-15,0 Q-30,-90 -10,-170 Q10,-90 15,0 Z" fill="url(#woodTone)"/>
    <!-- Lush Mango Tree Canopy -->
    <ellipse cx="0" cy="-210" rx="90" ry="80" fill="#15803d"/>
    <ellipse cx="-45" cy="-190" rx="70" ry="65" fill="#16a34a"/>
    <ellipse cx="45" cy="-190" rx="70" ry="65" fill="#22c55e"/>
    <ellipse cx="0" cy="-240" rx="60" ry="50" fill="#4ade80" opacity="0.8"/>
    <!-- Ripe yellow/orange mangoes -->
    <circle cx="-30" cy="-200" r="7" fill="#f59e0b"/>
    <circle cx="20" cy="-220" r="7" fill="#f59e0b"/>
    <circle cx="40" cy="-180" r="7" fill="#f59e0b"/>
  </g>

  <!-- KAY (Casa de Campo Tradicional / Fazenda Aconchegante) -->
  <g transform="translate(560, 570)" filter="url(#dropShadow)">
    <!-- White-washed stone walls -->
    <rect x="-160" y="-120" width="320" height="120" fill="#f5f5f4" stroke="#a8a29e" stroke-width="3"/>
    
    <!-- Terracotta Clay Tile Gable Roof -->
    <polygon points="-185,-120 0,-215 185,-120" fill="#b45309" stroke="#78350f" stroke-width="3"/>
    <!-- Brick Chimney with gentle smoke -->
    <rect x="90" y="-190" width="28" height="50" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <path d="M104,-190 Q90,-220 110,-245 T95,-280" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>

    <!-- Wooden Veranda Porch with railings -->
    <rect x="-170" y="-30" width="340" height="30" fill="url(#woodTone)" stroke="#451a03" stroke-width="2"/>
    <!-- Porch support posts -->
    <rect x="-150" y="-120" width="12" height="90" fill="#78350f"/>
    <rect x="-70" y="-120" width="12" height="90" fill="#78350f"/>
    <rect x="70" y="-120" width="12" height="90" fill="#78350f"/>
    <rect x="150" y="-120" width="12" height="90" fill="#78350f"/>

    <!-- Front Wooden Door & Windows with Shutters -->
    <rect x="-24" y="-95" width="48" height="65" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="-120" y="-85" width="38" height="42" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
    <!-- Open wooden shutters -->
    <rect x="-140" y="-85" width="18" height="42" fill="#047857"/>
    <rect x="-80" y="-85" width="18" height="42" fill="#047857"/>
    <rect x="80" y="-85" width="38" height="42" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
    <rect x="60" y="-85" width="18" height="42" fill="#047857"/>
    <rect x="120" y="-85" width="18" height="42" fill="#047857"/>
  </g>

  <!-- JADEN (Jardim / Plantação Agrícola Florida) in mid-foreground -->
  <g transform="translate(860, 620)" filter="url(#dropShadow)">
    <!-- Raised soil beds -->
    <ellipse cx="80" cy="30" rx="120" ry="35" fill="#543b23"/>
    <ellipse cx="80" cy="22" rx="110" ry="30" fill="#78502d"/>
    <!-- Rows of lush crops: lettuce, cabbages, corn -->
    ${[0, 30, 60, 90, 120, 150].map((x, i) => `
      <g transform="translate(${x}, 15)">
        <circle cx="0" cy="0" r="14" fill="#22c55e"/>
        <circle cx="0" cy="-4" r="10" fill="#4ade80"/>
        <circle cx="0" cy="-8" r="6" fill="#86efac"/>
      </g>
    `).join("")}
  </g>

  <!-- Rolling Lush Yard Grass -->
  <path d="M-50,670 Q300,610 650,660 T1250,640 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- KLOTI (Cerca Rústica de Madeira com Flores) across the front -->
  <g transform="translate(0, 680)" filter="url(#dropShadow)">
    <!-- Horizontal rails -->
    <line x1="80" y1="35" x2="1140" y2="35" stroke="#784f30" stroke-width="8" stroke-linecap="round"/>
    <line x1="80" y1="70" x2="1140" y2="70" stroke="#784f30" stroke-width="8" stroke-linecap="round"/>

    <!-- Vertical Split-rail Posts -->
    ${[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x, i) => `
      <g transform="translate(${x}, 10)">
        <polygon points="-8,90 -10,-10 0,-25 10,-10 8,90" fill="#8c613c" stroke="#452a13" stroke-width="2"/>
        <!-- Wood grain crack -->
        <line x1="0" y1="0" x2="0" y2="70" stroke="#543317" stroke-width="2"/>
      </g>
    `).join("")}

    <!-- Morning Glory Vines and Wildflowers climbing the fence -->
    <path d="M120,70 Q180,20 240,50 T360,30 T480,60" stroke="#16a34a" stroke-width="4" fill="none"/>
    <circle cx="180" cy="35" r="9" fill="#8b5cf6"/>
    <circle cx="210" cy="25" r="7" fill="#a855f7"/>
    <circle cx="310" cy="40" r="9" fill="#ec4899"/>
    <circle cx="420" cy="30" r="8" fill="#3b82f6"/>
  </g>
</svg>`;
}

export function renderDanca() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança sob as lanternas - Dans</title>
  <desc>Ghibli anime art: Dançarinos folclóricos, lanternas acesas, fitas e flores.</desc>
  ${getGhibliDefs()}
  
  <!-- Evening Dusk Sky -->
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 390, 48, true)}
  ${drawGhibliCloud(220, 170, 0.9, true)}
  ${drawGhibliCloud(920, 180, 0.85, true)}

  <!-- Distant Twilight Hills -->
  <path d="M-50,540 Q320,470 650,520 T1250,500 L1250,800 L-50,800 Z" fill="#3d2a45" opacity="0.6"/>

  <!-- LANP (Lanternas Festivas Iluminadas Overhead) -->
  <!-- Wire criss-crossing -->
  <path d="M-20,240 Q600,320 1220,240" stroke="#475569" stroke-width="2" fill="none"/>
  <path d="M-20,310 Q600,380 1220,310" stroke="#475569" stroke-width="2" fill="none"/>

  <!-- Glowing Paper Lanterns -->
  ${[
    { x: 180, y: 260, c: "#ef4444" },
    { x: 340, y: 290, c: "#f59e0b" },
    { x: 500, y: 310, c: "#ec4899" },
    { x: 700, y: 310, c: "#3b82f6" },
    { x: 860, y: 290, c: "#f59e0b" },
    { x: 1020, y: 260, c: "#10b981" },
    { x: 260, y: 330, c: "#f97316" },
    { x: 600, y: 375, c: "#e11d48" },
    { x: 940, y: 330, c: "#eab308" }
  ].map((l) => `
    <g transform="translate(${l.x}, ${l.y})" filter="url(#dropShadow)">
      <circle cx="0" cy="0" r="45" fill="${l.c}" opacity="0.3" filter="url(#softGlow)"/>
      <ellipse cx="0" cy="0" rx="24" ry="28" fill="${l.c}" stroke="#ffffff" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="14" ry="26" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.6"/>
      <rect x="-8" y="-32" width="16" height="6" fill="#1e293b"/>
      <rect x="-8" y="26" width="16" height="6" fill="#1e293b"/>
      <!-- Hanging tassel -->
      <line x1="0" y1="32" x2="0" y2="48" stroke="#facc15" stroke-width="2"/>
    </g>
  `).join("")}

  <!-- Outdoor Festival Wooden Dance Floor Stage -->
  <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="#451a03"/>
  <rect x="0" y="620" width="1200" height="20" fill="#78350f"/>
  ${[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map(x => `<line x1="${x}" y1="640" x2="${x}" y2="800" stroke="#331806" stroke-width="2"/>`).join("")}

  <!-- DANSÈ (Dançarinos Folclóricos Haitianos em Movimento Gracioso) -->
  <g transform="translate(600, 610)" filter="url(#dropShadow)">
    <!-- Stage warm light pool on floor -->
    <ellipse cx="0" cy="20" rx="260" ry="60" fill="#fef08a" opacity="0.25"/>

    <!-- Male Dancer (Left/Center) -->
    <g transform="translate(-110, -50)">
      <!-- Shadow -->
      <ellipse cx="0" cy="70" rx="25" ry="8" fill="#000000" opacity="0.3"/>
      <!-- Trousers -->
      <path d="M-14,0 L-22,65 L-4,65 L-6,10 L6,10 L4,65 L22,65 L14,0 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
      <!-- White Linen Shirt with red sash -->
      <path d="M-22,-45 L-35,10 L-18,5 L-12,0 L12,0 L18,5 L35,10 L22,-45 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="-14" y="-3" width="28" height="8" fill="#dc2626"/> <!-- Red sash -->
      <!-- Head & Straw Hat (Chapo pay) -->
      <circle cx="0" cy="-62" r="13" fill="#8c5836"/>
      <!-- Straw hat -->
      <ellipse cx="0" cy="-70" rx="34" ry="12" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
      <ellipse cx="0" cy="-76" rx="16" ry="10" fill="#eab308"/>
      <rect x="-14" y="-74" width="28" height="4" fill="#dc2626"/>
    </g>

    <!-- Female Dancer (Center/Right in magnificent swirling skirt) -->
    <g transform="translate(60, -60)">
      <ellipse cx="0" cy="80" rx="40" ry="10" fill="#000000" opacity="0.35"/>
      <!-- Voluminous Swirling Multitiered Skirt (Wòb Karabela) -->
      <path d="M-18,5 
        C-90,20 -150,75 -110,85 
        C-40,95 40,95 110,85 
        C150,75 90,20 18,5 Z" 
        fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
      <!-- Red and Blue Tiered Ruffles -->
      <path d="M-95,65 Q0,85 95,65" stroke="#dc2626" stroke-width="8" fill="none"/>
      <path d="M-80,45 Q0,65 80,45" stroke="#00209f" stroke-width="7" fill="none"/>
      
      <!-- Bodice / Blouse with frilled shoulders -->
      <path d="M-16,-35 L-20,8 L20,8 L16,-35 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M-28,-30 Q-15,-20 0,-30 Q15,-20 28,-30" stroke="#dc2626" stroke-width="4" fill="none"/>

      <!-- Graceful Arms outstretched holding skirt edges -->
      <path d="M-16,-30 Q-50,-20 -70,2" stroke="#8c5836" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M16,-30 Q50,-20 70,2" stroke="#8c5836" stroke-width="7" stroke-linecap="round" fill="none"/>

      <!-- Head & Elegant Headwrap (Mouchwa) -->
      <circle cx="0" cy="-50" r="12" fill="#8c5836"/>
      <!-- Smiling face profile -->
      <circle cx="6" cy="-48" r="2.5" fill="#fde047"/> <!-- Gold earring -->
      <path d="M-14,-52 Q0,-76 14,-52 Q22,-44 0,-40 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
      <!-- Flower in headwrap -->
      <circle cx="-10" cy="-58" r="5" fill="#facc15"/>
    </g>

    <!-- RIBAN (Fitas Coloridas Esvoaçantes no Ar) -->
    <path d="M-20,-80 Q-90,-160 -180,-110 T-310,-140" stroke="#f43f5e" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M40,-75 Q120,-150 220,-100 T360,-130" stroke="#38bdf8" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M10,-90 Q70,-180 160,-170 T280,-210" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>

  <!-- FLÈ (Flores Espalhadas no Chão de Madeira) in foreground -->
  <g transform="translate(0, 720)">
    <circle cx="220" cy="20" r="14" fill="#e11d48"/>
    <circle cx="220" cy="20" r="5" fill="#fde047"/>
    <circle cx="480" cy="40" r="12" fill="#facc15"/>
    <circle cx="750" cy="30" r="15" fill="#e11d48"/>
    <circle cx="980" cy="25" r="13" fill="#38bdf8"/>
  </g>
</svg>`;
}

export function renderGeografia() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Montanhas, rio e bússola - Jewografi</title>
  <desc>Ghibli anime art: Cordilheira majestosa, rio sinuoso, bússola dourada e bandeira.</desc>
  ${getGhibliDefs()}
  
  <!-- Bright Mountain Blue Sky -->
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(1020, 140, 50)}
  ${drawGhibliCloud(200, 120, 1.0)}
  ${drawGhibliCloud(720, 160, 0.85)}

  <!-- MÒN (Grandiosas Montanhas Majestosas em Camadas - Estilo Cordilheira do Haiti) -->
  <!-- Layer 1: Distant Misty Peaks -->
  <polygon points="-50,480 180,240 380,480" fill="#6488a0" opacity="0.6"/>
  <polygon points="260,480 520,190 760,480" fill="#4d728a" opacity="0.7"/>
  <polygon points="650,480 880,220 1150,480" fill="#6488a0" opacity="0.6"/>

  <!-- DRAPO (Bandeira de Agrimensor no Cume da Montanha) -->
  <g transform="translate(520, 190)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-45" stroke="#ffffff" stroke-width="2.5"/>
    <polygon points="0,-45 28,-36 0,-27" fill="#dc2626"/>
  </g>

  <!-- Layer 2: Mid Lush Forest Ridges -->
  <path d="M-50,540 Q250,420 580,490 T1250,460 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>

  <!-- RIVYÈ (Rio Cristalino Sinuoso Serpenteando pelo Vale) -->
  <path d="M540,490 
    Q480,550 560,600 
    T460,690 
    T580,800 L760,800 
    Q660,700 700,640 
    T640,560 
    T620,490 Z" 
    fill="url(#waterTone)"/>
  <!-- River Rapids & Foamy Waterlines -->
  <path d="M510,540 Q570,580 500,630 T540,730" stroke="#e0f2fe" stroke-width="4" fill="none" opacity="0.8"/>
  <path d="M570,530 Q630,590 580,670 T660,780" stroke="#e0f2fe" stroke-width="4" fill="none" opacity="0.75"/>

  <!-- Layer 3: Closer Green Foothills -->
  <path d="M-50,620 Q240,540 500,620 L-50,800 Z" fill="url(#hillNear)"/>
  <path d="M720,620 Q950,550 1250,610 L1250,800 L680,800 Z" fill="url(#hillNear)"/>

  <!-- Foreground Overlook Stone Outcrop -->
  <path d="M-50,710 Q400,630 850,720 T1250,690 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>

  <!-- BOUSÒL (Bússola Antiga de Latão e Ouro em Destaque Nítido) -->
  <g transform="translate(360, 680)" filter="url(#dropShadow)">
    <!-- Shadow on rock -->
    <ellipse cx="0" cy="50" rx="85" ry="24" fill="#000000" opacity="0.4"/>
    
    <!-- Outer Heavy Brass Casing -->
    <circle cx="0" cy="0" r="76" fill="url(#brassTone)" stroke="#52390a" stroke-width="5"/>
    <!-- Top Attachment Ring -->
    <circle cx="0" cy="-86" r="16" fill="none" stroke="url(#brassTone)" stroke-width="6"/>

    <!-- Compass Dial Face (Parchment Ivory) -->
    <circle cx="0" cy="0" r="62" fill="#fffdf5" stroke="#785315" stroke-width="2"/>
    <!-- Outer Degree Ring with Ticks -->
    <circle cx="0" cy="0" r="56" fill="none" stroke="#a17521" stroke-width="1.5" stroke-dasharray="3 3"/>

    <!-- 8-Point Compass Rose Star -->
    <!-- North Point (Dark Blue/Black) -->
    <polygon points="0,0 -8,-20 0,-50 8,-20" fill="#1e293b"/>
    <!-- South Point -->
    <polygon points="0,0 -8,20 0,50 8,20" fill="#b45309"/>
    <!-- East Point -->
    <polygon points="0,0 20,-8 50,0 20,8" fill="#b45309"/>
    <!-- West Point -->
    <polygon points="0,0 -20,-8 -50,0 -20,8" fill="#b45309"/>
    <!-- Diagonals -->
    <polygon points="0,0 -6,-16 -34,-34 -16,-6" fill="#ca8a04"/>
    <polygon points="0,0 6,-16 34,-34 16,-6" fill="#ca8a04"/>
    <polygon points="0,0 -6,16 -34,34 -16,6" fill="#ca8a04"/>
    <polygon points="0,0 6,16 34,34 16,6" fill="#ca8a04"/>

    <!-- Cardinal Direction Letters -->
    <text x="0" y="-36" font-family="serif" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">N</text>
    <text x="0" y="46" font-family="serif" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">S</text>
    <text x="40" y="5" font-family="serif" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">E</text>
    <text x="-40" y="5" font-family="serif" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">O</text>

    <!-- Magnetic Needle (Red North, Silver South) -->
    <g transform="rotate(-28)">
      <polygon points="0,0 -6,-10 0,-56 6,-10" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
      <polygon points="0,0 -6,10 0,56 6,10" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
      <!-- Brass center pivot pin -->
      <circle cx="0" cy="0" r="7" fill="url(#brassTone)" stroke="#452a13" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="2.5" fill="#ffffff"/>
    </g>

    <!-- Glass Lens Highlight -->
    <path d="M-45,-45 A 62 62 0 0 1 45,-45 Z" fill="#ffffff" opacity="0.3"/>
  </g>
</svg>`;
}

