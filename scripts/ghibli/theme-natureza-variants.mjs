import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderNatureza as renderNatureza01 } from "./master-scenes-1.mjs";

export { renderNatureza01 };

// Scene 2: "Cachoeira na floresta" (waterfall, palm, bird, flower)
export function renderNatureza02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cachoeira na floresta - Lanati</title>
  <desc>Ghibli anime art: Cachoeira majestosa na selva, palmeiras, pássaros tropicais e orquídeas.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 50)}
  ${drawGhibliCloud(240, 130, 0.95)}
  ${drawGhibliCloud(950, 180, 0.85)}

  <!-- Towering Green Jungle Cliffs -->
  <polygon points="-50,550 380,180 820,550" fill="url(#stoneTone)"/>
  <polygon points="250,550 600,120 950,550" fill="url(#hillMid)"/>

  <!-- PALMIS (Palmeiras Tropicais Reais no Topo e Encosta) -->
  <g transform="translate(320, 320)" filter="url(#dropShadow)">
    <path d="M0,0 Q25,-80 0,-160" stroke="#78350f" stroke-width="12" fill="none"/>
    ${[-60, -30, 0, 30, 60].map(deg => `<path d="M0,-160 Q${deg*1.5},-220 ${deg*2.2},-180" stroke="#15803d" stroke-width="8" stroke-linecap="round" fill="none"/>`).join("")}
  </g>
  <g transform="translate(860, 380)" filter="url(#dropShadow)">
    <path d="M0,0 Q-20,-70 0,-140" stroke="#78350f" stroke-width="10" fill="none"/>
    ${[-50, -25, 0, 25, 50].map(deg => `<path d="M0,-140 Q${deg*1.5},-190 ${deg*2},-160" stroke="#16a34a" stroke-width="7" stroke-linecap="round" fill="none"/>`).join("")}
  </g>

  <!-- KASKAD (Cachoeira Majestosa de Águas Cristalinas com Espuma e Arco-Íris) -->
  <g transform="translate(560, 180)" filter="url(#dropShadow)">
    <!-- Waterfall Chute -->
    <path d="M-50,0 Q-30,180 -70,420 L70,420 Q30,180 50,0 Z" fill="#e0f2fe" opacity="0.95"/>
    <path d="M-30,0 Q-15,200 -40,420 L40,420 Q15,200 30,0 Z" fill="#ffffff"/>
    <path d="M-10,0 L-10,420 M10,0 L10,420" stroke="#38bdf8" stroke-width="3" opacity="0.6"/>
    <!-- Waterfall Foamy Pool at Bottom -->
    <ellipse cx="0" cy="420" rx="140" ry="35" fill="#bae6fd" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="420" rx="100" ry="22" fill="#ffffff" opacity="0.8"/>
    <!-- Rainbow mist arc -->
    <path d="M-80,360 Q0,290 80,360" stroke="#f43f5e" stroke-width="3" fill="none" opacity="0.5"/>
    <path d="M-75,365 Q0,295 75,365" stroke="#facc15" stroke-width="3" fill="none" opacity="0.5"/>
    <path d="M-70,370 Q0,300 70,370" stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.5"/>
  </g>

  <!-- ZWAZO (Pássaro Tropical de Plumas Vivas Voando Próximo à Queda d'Água) -->
  <g transform="translate(360, 240) scale(1.1)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="18" ry="11" fill="#0284c7"/>
    <path d="M-6,0 Q-24,-24 -36,-16 Q-20,-4 -6,0" fill="#0369a1"/>
    <circle cx="14" cy="-5" r="8" fill="#15803d"/>
    <polygon points="20,-6 28,-4 20,-2" fill="#eab308"/>
    <polygon points="-12,4 -32,18 -24,20 -8,6" fill="#ef4444"/>
  </g>

  <!-- Lush Lagoon River in Foreground -->
  <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  
  <!-- FLÈ (Orquídeas e Hibiscos Tropicais Florescendo nas Pedras em Primeiro Plano) -->
  <path d="M-50,680 Q320,620 680,670 T1250,650 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
  <g transform="translate(0, 690)">
    <circle cx="220" cy="20" r="18" fill="#f43f5e"/>
    <circle cx="220" cy="20" r="6" fill="#fde047"/>
    <circle cx="480" cy="30" r="16" fill="#a855f7"/>
    <circle cx="480" cy="30" r="5" fill="#fde047"/>
    <circle cx="780" cy="20" r="18" fill="#facc15"/>
    <circle cx="1020" cy="25" r="16" fill="#ef4444"/>
  </g>
</svg>`;
}

// Scene 3: "Praia das tartarugas" (turtle, ocean, palm, flower)
export function renderNatureza03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Praia das tartarugas marinhas - Lanati</title>
  <desc>Ghibli anime art: Tartaruga marinha na areia da praia, mar turquesa, palmeiras e flores.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 240, 52, true)}
  ${drawGhibliCloud(220, 160, 0.95, true)}
  ${drawGhibliCloud(980, 170, 0.85, true)}

  <!-- LANMÈ (Mar Caribenho com Ondas de Espuma e Água Turquesa Brilhante) -->
  <path d="M-50,460 L1250,460 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,520 Q300,480 650,520 T1250,500 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>
  <path d="M0,535 Q300,520 600,540 T1200,530" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.85"/>
  <path d="M0,580 Q250,565 500,585 T1000,575 T1200,585" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.8"/>

  <!-- PALMIS (Palmeiras Inclinadas sobre a Praia) -->
  <g transform="translate(180, 560)" filter="url(#dropShadow)">
    <path d="M0,0 Q60,-120 120,-240" stroke="#78350f" stroke-width="18" fill="none"/>
    <g transform="translate(120, -240)">
      ${[-70, -40, -10, 20, 50, 80].map(deg => `<path d="M0,0 Q${deg*1.6},-90 ${deg*2.4},-50" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>`).join("")}
      <circle cx="-10" cy="15" r="10" fill="#78350f"/> <!-- Coconuts -->
      <circle cx="10" cy="15" r="10" fill="#78350f"/>
    </g>
  </g>

  <!-- Golden Sandy Beach in Foreground -->
  <path d="M-50,600 Q320,540 680,600 T1250,570 L1250,800 L-50,800 Z" fill="#fde68a"/>

  <!-- TÒTI (Tartaruga Marinha em Destaque Nítido Caminhando para o Mar) -->
  <g transform="translate(560, 660)" filter="url(#dropShadow)">
    <!-- Sand track trail behind turtle -->
    <path d="M0,45 Q-20,75 -15,110 M0,45 Q20,75 15,110" stroke="#eab308" stroke-width="5" stroke-dasharray="8 6" fill="none"/>
    <ellipse cx="0" cy="15" rx="55" ry="42" fill="#000000" opacity="0.3"/>
    
    <!-- Carapace Shell (Olive/Brown with Scutes) -->
    <ellipse cx="0" cy="0" rx="58" ry="46" fill="#65a30d" stroke="#365314" stroke-width="3"/>
    <ellipse cx="0" cy="0" rx="46" ry="36" fill="#84cc16" stroke="#365314" stroke-width="2"/>
    <!-- Shell Pattern Scutes -->
    <polygon points="0,-22 18,-10 18,10 0,22 -18,10 -18,-10" fill="#4d7c0f"/>
    <line x1="-18" y1="-10" x2="-44" y2="-18" stroke="#365314" stroke-width="2"/>
    <line x1="18" y1="-10" x2="44" y2="-18" stroke="#365314" stroke-width="2"/>
    <line x1="-18" y1="10" x2="-44" y2="18" stroke="#365314" stroke-width="2"/>
    <line x1="18" y1="10" x2="44" y2="18" stroke="#365314" stroke-width="2"/>

    <!-- Head -->
    <ellipse cx="0" cy="-56" rx="16" ry="14" fill="#65a30d" stroke="#365314" stroke-width="2"/>
    <circle cx="-7" cy="-58" r="3" fill="#000000"/>
    <circle cx="7" cy="-58" r="3" fill="#000000"/>

    <!-- Front Flippers (Long Paddle-like) -->
    <path d="M-45,-25 Q-95,-55 -85,-10 Q-65,0 -45,-10 Z" fill="#65a30d" stroke="#365314" stroke-width="2"/>
    <path d="M45,-25 Q95,-55 85,-10 Q65,0 45,-10 Z" fill="#65a30d" stroke="#365314" stroke-width="2"/>
    <!-- Rear Flippers -->
    <path d="M-35,35 Q-65,65 -45,60 Z" fill="#4d7c0f"/>
    <path d="M35,35 Q65,65 45,60 Z" fill="#4d7c0f"/>
  </g>

  <!-- FLÈ (Campânulas e Flores da Praia nas Dunas) -->
  <g transform="translate(860, 680)">
    <circle cx="0" cy="0" r="14" fill="#a855f7"/>
    <circle cx="0" cy="0" r="4" fill="#facc15"/>
    <circle cx="50" cy="20" r="16" fill="#ec4899"/>
    <circle cx="50" cy="20" r="4" fill="#facc15"/>
    <circle cx="-40" cy="25" r="12" fill="#f43f5e"/>
  </g>
</svg>`;
}

// Scene 4: "Trilha entre montanhas" (mountain, river, bird, tree)
export function renderNatureza04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Trilha entre montanhas - Lanati</title>
  <desc>Ghibli anime art: Trilha verdejante, montanhas imponentes, rio serpenteante, pássaros e árvores.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 150, 50)}
  ${drawGhibliCloud(260, 140, 1.0)}
  ${drawGhibliCloud(720, 180, 0.85)}

  <!-- MÒN (Cordilheira Imponente de Montanhas Verde-Azuladas) -->
  <polygon points="-50,480 240,200 560,480" fill="#4d728a" opacity="0.6"/>
  <polygon points="380,480 720,160 1080,480" fill="#3b5e74" opacity="0.75"/>
  <polygon points="780,480 1020,240 1250,480" fill="#4d728a" opacity="0.6"/>

  <!-- ZWAZO (Gavião / Pássaro Majestoso Voando Alto nas Montanhas) -->
  <g transform="translate(620, 220) scale(1.1)" filter="url(#dropShadow)">
    <path d="M0,0 Q-35,-25 -70,-15 Q-40,-5 0,0" fill="#1e293b"/>
    <path d="M0,0 Q35,-25 70,-15 Q40,-5 0,0" fill="#1e293b"/>
    <ellipse cx="0" cy="2" rx="10" ry="5" fill="#334155"/>
    <polygon points="0,5 -6,20 6,20" fill="#1e293b"/>
  </g>

  <!-- RIVYÈ (Rio Cristalino Sinouoso Cortando o Desfiladeiro Verde) -->
  <path d="M560,480 Q500,560 620,620 T540,800 L720,800 Q660,700 750,620 T650,480 Z" fill="url(#waterTone)"/>
  <path d="M530,520 Q610,580 570,680" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>

  <!-- PYEBWA (Pinheiros e Árvores Frondosas de Altitude nas Encostas) -->
  <g transform="translate(220, 620)" filter="url(#dropShadow)">
    <path d="M-15,0 Q-30,-110 -10,-200 Q10,-110 15,0 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-220" rx="90" ry="100" fill="#14532d"/>
    <ellipse cx="-35" cy="-200" rx="70" ry="80" fill="#15803d"/>
    <ellipse cx="35" cy="-200" rx="70" ry="80" fill="#16a34a"/>
  </g>
  <g transform="translate(980, 640)" filter="url(#dropShadow)">
    <path d="M-15,0 Q20,-100 0,-180" stroke="url(#woodTone)" stroke-width="12" fill="none"/>
    <polygon points="0,-240 -60,-170 60,-170" fill="#14532d"/>
    <polygon points="0,-190 -75,-120 75,-120" fill="#15803d"/>
    <polygon points="0,-140 -90,-60 90,-60" fill="#166534"/>
  </g>

  <!-- Hiking Trail Overlook in Foreground -->
  <path d="M-50,680 Q320,600 680,660 T1250,630 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
</svg>`;
}

// Scene 5: "Jardim de borboletas" (butterfly, flower, tree, bird)
export function renderNatureza05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Jardim de borboletas - Lanati</title>
  <desc>Ghibli anime art: Enxame de borboletas coloridas, canteiros floridos, árvore e pássaro cantando.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 140, 52)}
  ${drawGhibliCloud(220, 150, 1.0)}
  ${drawGhibliCloud(760, 170, 0.85)}

  <path d="M-50,540 Q300,470 650,520 T1250,490 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>

  <!-- PYEBWA (Árvore Frondosa Florida do Jardim) on left -->
  <g transform="translate(180, 600)" filter="url(#dropShadow)">
    <path d="M-20,0 Q-40,-120 -15,-240 Q15,-120 20,0 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-260" rx="130" ry="110" fill="#15803d"/>
    <ellipse cx="-50" cy="-240" rx="100" ry="90" fill="#22c55e"/>
    <ellipse cx="50" cy="-240" rx="100" ry="90" fill="#4ade80" opacity="0.8"/>
    
    <!-- ZWAZO (Pássaro no Galho Cantando) -->
    <g transform="translate(60, -210)">
      <ellipse cx="0" cy="0" rx="16" ry="10" fill="#f59e0b"/>
      <circle cx="12" cy="-6" r="7" fill="#ef4444"/>
      <polygon points="18,-7 26,-5 18,-3" fill="#facc15"/>
    </g>
  </g>

  <!-- PAPIYON (Borboletas Dançando em Enxame Alegre) -->
  <!-- Monarch 1 -->
  <g transform="translate(480, 360) scale(1.2)" filter="url(#dropShadow)">
    <path d="M0,0 Q-36,-30 -30,-60 Q-8,-55 0,-18" fill="#f97316" stroke="#0f172a" stroke-width="2.5"/>
    <path d="M0,0 Q36,-30 30,-60 Q8,-55 0,-18" fill="#f97316" stroke="#0f172a" stroke-width="2.5"/>
    <ellipse cx="0" cy="-6" rx="3.5" ry="16" fill="#0f172a"/>
  </g>
  <!-- Blue Morpho 2 -->
  <g transform="translate(680, 320) scale(1.1)" filter="url(#dropShadow)">
    <path d="M0,0 Q-34,-28 -28,-56 Q-6,-50 0,-16" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>
    <path d="M0,0 Q34,-28 28,-56 Q6,-50 0,-16" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>
    <ellipse cx="0" cy="-6" rx="3.5" ry="16" fill="#0f172a"/>
  </g>
  <!-- Yellow Swallowtail 3 -->
  <g transform="translate(860, 420) scale(0.9)" filter="url(#dropShadow)">
    <path d="M0,0 Q-34,-28 -28,-56 Q-6,-50 0,-16" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
    <path d="M0,0 Q34,-28 28,-56 Q6,-50 0,-16" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
    <ellipse cx="0" cy="-6" rx="3" ry="14" fill="#0f172a"/>
  </g>

  <!-- FLÈ (Canteiro Magnífico de Flores Multicoloridas no Primeiro Plano) -->
  <path d="M-50,640 Q320,580 680,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
  <g transform="translate(0, 660)">
    ${[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x, i) => {
      const colors = ["#f43f5e", "#a855f7", "#facc15", "#38bdf8", "#fb7185"];
      const c = colors[i % colors.length];
      return `
        <g transform="translate(${x}, ${(i%2)*25})">
          <circle cx="0" cy="0" r="18" fill="${c}"/>
          <circle cx="0" cy="0" r="6" fill="#ffffff"/>
        </g>
      `;
    }).join("")}
  </g>
</svg>`;
}

// Scene 6: "Rio entre palmeiras" (river, palm, turtle, flower)
export function renderNatureza06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Rio sereno entre palmeiras - Lanati</title>
  <desc>Ghibli anime art: Rio tropical, palmeiras imperiais, tartaruga na margem e flores aquáticas.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 260, 52, true)}
  ${drawGhibliCloud(200, 160, 0.95, true)}
  ${drawGhibliCloud(960, 170, 0.85, true)}

  <!-- RIVYÈ (Rio Tropical Largo Espelhando o Céu Dourado) -->
  <path d="M-50,440 L1250,440 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <ellipse cx="600" cy="460" rx="350" ry="18" fill="#fde047" opacity="0.4" filter="url(#softGlow)"/>

  <!-- PALMIS (Bosque de Palmeiras Reais com Troncos Elegantes) -->
  <g transform="translate(240, 540)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-220" stroke="#78350f" stroke-width="14"/>
    <g transform="translate(0, -220)">
      ${[-60, -35, -10, 15, 40, 65].map(deg => `<path d="M0,0 Q${deg*1.8},-80 ${deg*2.6},-40" stroke="#15803d" stroke-width="9" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>
  <g transform="translate(940, 520)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-240" stroke="#78350f" stroke-width="14"/>
    <g transform="translate(0, -240)">
      ${[-60, -35, -10, 15, 40, 65].map(deg => `<path d="M0,0 Q${deg*1.8},-80 ${deg*2.6},-40" stroke="#15803d" stroke-width="9" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>

  <!-- Green Riverbank in Foreground -->
  <path d="M-50,620 Q320,560 680,610 T1250,590 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- TÒTI (Tartaruga Descansando Sobre uma Pedra na Beira do Rio) -->
  <g transform="translate(620, 630)" filter="url(#dropShadow)">
    <!-- Flat River Boulder -->
    <ellipse cx="0" cy="35" rx="80" ry="25" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    
    <!-- Turtle Body on rock -->
    <ellipse cx="0" cy="10" rx="42" ry="32" fill="#65a30d" stroke="#365314" stroke-width="2.5"/>
    <ellipse cx="0" cy="10" rx="32" ry="24" fill="#84cc16"/>
    <circle cx="36" cy="10" r="10" fill="#65a30d"/> <!-- Head -->
  </g>

  <!-- FLÈ (Vitórias-régias e Flores na Beira do Rio) -->
  <g transform="translate(380, 680)">
    <ellipse cx="0" cy="0" rx="35" ry="14" fill="#15803d"/>
    <circle cx="0" cy="-6" r="14" fill="#f43f5e"/>
    <circle cx="0" cy="-6" r="5" fill="#fde047"/>
  </g>
</svg>`;
}

// Scene 7: "Clareira florida" (flower, butterfly, mountain, tree)
export function renderNatureza07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Clareira florida sob as montanhas - Lanati</title>
  <desc>Ghibli anime art: Prado alpino com flores, borboletas esvoaçantes, montanhas e árvore ancestral.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(980, 150, 48)}
  ${drawGhibliCloud(200, 130, 0.95)}
  ${drawGhibliCloud(740, 170, 0.85)}

  <!-- MÒN (Picos Majestosos das Montanhas) -->
  <polygon points="-50,480 320,180 720,480" fill="#527891" opacity="0.65"/>
  <polygon points="450,480 840,150 1250,480" fill="#3e637a" opacity="0.75"/>

  <!-- PYEBWA (Árvore Ancestral na Encosta) -->
  <g transform="translate(180, 580)" filter="url(#dropShadow)">
    <path d="M-15,0 Q-30,-110 -10,-220 Q10,-110 15,0 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-240" rx="110" ry="95" fill="#15803d"/>
    <ellipse cx="-40" cy="-220" rx="80" ry="75" fill="#22c55e"/>
    <ellipse cx="40" cy="-220" rx="80" ry="75" fill="#4ade80" opacity="0.8"/>
  </g>

  <!-- PAPIYON (Borboletas Coloridas na Clareira) -->
  <g transform="translate(680, 420)" filter="url(#dropShadow)">
    <path d="M0,0 Q-30,-25 -24,-50 Q-5,-45 0,-15" fill="#f97316" stroke="#0f172a" stroke-width="2"/>
    <path d="M0,0 Q30,-25 24,-50 Q5,-45 0,-15" fill="#f97316" stroke="#0f172a" stroke-width="2"/>
    <ellipse cx="0" cy="-6" rx="3" ry="14" fill="#0f172a"/>
  </g>

  <!-- FLÈ (Tapete Denso de Flores Coloridas) -->
  <path d="M-50,620 Q320,560 680,610 T1250,590 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
  <g transform="translate(0, 640)">
    ${[80, 180, 280, 380, 480, 580, 680, 780, 880, 980, 1080].map((x, i) => {
      const c = ["#ef4444", "#eab308", "#3b82f6", "#ec4899", "#a855f7"][i % 5];
      return `<circle cx="${x}" cy="${(i%3)*20 + 20}" r="16" fill="${c}"/>`;
    }).join("")}
  </g>
</svg>`;
}

// Scene 8: "Costa dos pássaros" (ocean, bird, palm, turtle)
export function renderNatureza08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Costa dos pássaros - Lanati</title>
  <desc>Ghibli anime art: Costa marinha, bando de pássaros marinhos, palmeiras e tartaruga.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 50)}
  ${drawGhibliCloud(240, 150, 0.95)}
  ${drawGhibliCloud(680, 190, 0.85)}

  <!-- LANMÈ (Oceano Azul Profundo com Ondas Suaves) -->
  <path d="M-50,480 L1250,480 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,550 Q300,510 650,550 T1250,530 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.8"/>

  <!-- ZWAZO (Bando de Aves Marinhas / Gaivotas Sobrevoando a Costa) -->
  ${[
    { x: 380, y: 220, s: 1.0 },
    { x: 480, y: 190, s: 0.85 },
    { x: 580, y: 240, s: 0.75 },
    { x: 680, y: 210, s: 0.9 }
  ].map(b => `
    <g transform="translate(${b.x}, ${b.y}) scale(${b.s})" filter="url(#dropShadow)">
      <path d="M0,0 Q-24,-16 -48,-8 Q-26,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
      <path d="M0,0 Q24,-16 48,-8 Q26,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="8" ry="4" fill="#ffffff"/>
      <polygon points="6,-1 14,0 6,1" fill="#f59e0b"/>
    </g>
  `).join("")}

  <!-- PALMIS (Palmeiras Costeiras na Falésia) on right -->
  <g transform="translate(980, 520)" filter="url(#dropShadow)">
    <path d="M0,0 Q-40,-100 -20,-200" stroke="#78350f" stroke-width="15" fill="none"/>
    <g transform="translate(-20, -200)">
      ${[-50, -25, 0, 25, 50].map(deg => `<path d="M0,0 Q${deg*1.6},-80 ${deg*2.4},-50" stroke="#15803d" stroke-width="9" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>

  <!-- Sandy Cliff and Beach in Foreground -->
  <path d="M-50,620 Q320,560 680,610 T1250,580 L1250,800 L-50,800 Z" fill="#fde68a"/>

  <!-- TÒTI (Tartaruga Nadando e Subindo a Margem da Costa) -->
  <g transform="translate(380, 660)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="42" ry="32" fill="#65a30d" stroke="#365314" stroke-width="2.5"/>
    <ellipse cx="0" cy="0" rx="32" ry="24" fill="#84cc16"/>
    <circle cx="0" cy="-40" r="10" fill="#65a30d"/>
  </g>
</svg>`;
}

// Scene 9: "Vale verde depois da chuva" (tree, waterfall, flower, mountain)
export function renderNatureza09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vale verde depois da chuva - Lanati</title>
  <desc>Ghibli anime art: Vale viçoso após a chuva com arco-íris, cachoeira, montanhas, árvore e flores.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(300, 160, 48)}
  ${drawGhibliCloud(760, 140, 0.95)}

  <!-- Radiant Full Rainbow across valley -->
  <g filter="url(#softGlow)" opacity="0.65">
    <ellipse cx="600" cy="500" rx="480" ry="280" fill="none" stroke="#ef4444" stroke-width="8"/>
    <ellipse cx="600" cy="500" rx="472" ry="276" fill="none" stroke="#f97316" stroke-width="8"/>
    <ellipse cx="600" cy="500" rx="464" ry="272" fill="none" stroke="#facc15" stroke-width="8"/>
    <ellipse cx="600" cy="500" rx="456" ry="268" fill="none" stroke="#22c55e" stroke-width="8"/>
    <ellipse cx="600" cy="500" rx="448" ry="264" fill="none" stroke="#38bdf8" stroke-width="8"/>
    <ellipse cx="600" cy="500" rx="440" ry="260" fill="none" stroke="#818cf8" stroke-width="8"/>
  </g>

  <!-- MÒN (Montanhas Brilhando com Névoa Fresca) -->
  <polygon points="-50,520 280,240 640,520" fill="#4d728a" opacity="0.6"/>
  <polygon points="480,520 840,200 1250,520" fill="#3b5e74" opacity="0.75"/>

  <!-- KASKAD (Cachoeira de Montanha Rápida) on background cliff -->
  <g transform="translate(840, 290)" filter="url(#dropShadow)">
    <path d="M-20,0 L-25,180 L25,180 L20,0 Z" fill="#ffffff" opacity="0.9"/>
    <ellipse cx="0" cy="180" rx="45" ry="12" fill="#bae6fd"/>
  </g>

  <!-- PYEBWA (Árvore Frondosa com Folhas Úmidas e Brilhantes) -->
  <g transform="translate(240, 600)" filter="url(#dropShadow)">
    <path d="M-18,0 Q-35,-110 -12,-220 Q15,-110 18,0 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-240" rx="110" ry="95" fill="#15803d"/>
    <ellipse cx="-40" cy="-220" rx="85" ry="75" fill="#22c55e"/>
    <ellipse cx="40" cy="-220" rx="85" ry="75" fill="#86efac" opacity="0.8"/>
  </g>

  <!-- FLÈ (Flores do Prado com Pétalas Abertas) in foreground -->
  <path d="M-50,640 Q320,580 680,630 T1250,600 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
  <g transform="translate(0, 660)">
    <circle cx="480" cy="20" r="16" fill="#f43f5e"/>
    <circle cx="720" cy="30" r="18" fill="#facc15"/>
    <circle cx="950" cy="25" r="16" fill="#a855f7"/>
  </g>
</svg>`;
}

// Scene 10: "Ilha tropical" (turtle, palm, ocean, bird)
export function renderNatureza10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ilha tropical paradisíaca - Lanati</title>
  <desc>Ghibli anime art: Ilhota tropical, mar turquesa cristalino, palmeiras, tartaruga e gaivotas.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 52)}
  ${drawGhibliCloud(220, 140, 1.0)}
  ${drawGhibliCloud(680, 170, 0.85)}

  <!-- LANMÈ (Oceano Turquesa Transparente com Recife de Corais Visível) -->
  <path d="M-50,460 L1250,460 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,510 Q320,470 650,510 T1250,490 L1250,800 L-50,800 Z" fill="#2dd4bf" opacity="0.85"/>
  <path d="M-50,580 Q300,540 680,580 T1250,560 L1250,800 L-50,800 Z" fill="#5eead4" opacity="0.6"/>

  <!-- ZWAZO (Gaivotas Tropicais em Voo Livre) -->
  <g transform="translate(380, 200)" filter="url(#dropShadow)">
    <path d="M0,0 Q-20,-14 -40,-8 Q-22,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <path d="M0,0 Q20,-14 40,-8 Q22,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  </g>
  <g transform="translate(540, 160) scale(0.8)" filter="url(#dropShadow)">
    <path d="M0,0 Q-20,-14 -40,-8 Q-22,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <path d="M0,0 Q20,-14 40,-8 Q22,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  </g>

  <!-- Sandy Tropical Islet in Center-Foreground -->
  <ellipse cx="600" cy="650" rx="420" ry="120" fill="#fde68a" stroke="#fcd34d" stroke-width="3"/>

  <!-- PALMIS (Cluster de Coqueiros Tropicais na Ilhota) -->
  <g transform="translate(520, 600)" filter="url(#dropShadow)">
    <path d="M0,0 Q-30,-120 -15,-240" stroke="#78350f" stroke-width="18" fill="none"/>
    <g transform="translate(-15, -240)">
      ${[-65, -35, -5, 25, 55].map(deg => `<path d="M0,0 Q${deg*1.6},-90 ${deg*2.5},-50" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>`).join("")}
      <circle cx="0" cy="15" r="10" fill="#78350f"/>
    </g>
  </g>
  <g transform="translate(680, 610)" filter="url(#dropShadow)">
    <path d="M0,0 Q30,-110 15,-220" stroke="#78350f" stroke-width="16" fill="none"/>
    <g transform="translate(15, -220)">
      ${[-60, -30, 0, 30, 60].map(deg => `<path d="M0,0 Q${deg*1.6},-85 ${deg*2.4},-45" stroke="#16a34a" stroke-width="9" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>

  <!-- TÒTI (Pequena Tartaruga Marinha Rastejando na Areia Branca) -->
  <g transform="translate(380, 680)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="38" ry="28" fill="#65a30d" stroke="#365314" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="30" ry="20" fill="#84cc16"/>
    <circle cx="0" cy="-35" r="9" fill="#65a30d"/>
  </g>
</svg>`;
}

// Scene 11: "Lagoa dos lírios ao amanhecer" (objects: flower [flè], bird [zwazo], tree [pyebwa], river [rivyè])
export function renderNatureza11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Lagoa dos lírios ao amanhecer - Lanati</title>
  <desc>Ghibli anime art: Lagoa serena de rio ao amanhecer, lírios d'água cor-de-rosa, garça tropical e salgueiros.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skyDawn)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 50, true)}
  ${drawGhibliCloud(200, 160, 0.9, true)}
  ${drawGhibliCloud(980, 150, 0.85, true)}
  <!-- PYEBWA (Árvores Frondosas nas Margens da Lagoa) -->
  <g transform="translate(180, 480)" filter="url(#dropShadow)">
    <path d="M-20,120 Q0,0 -15,-140 Q0,-60 20,120 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <circle cx="-30" cy="-140" r="90" fill="#15803d"/>
    <circle cx="40" cy="-170" r="100" fill="#16a34a"/>
    <circle cx="-10" cy="-210" r="70" fill="#4ade80" opacity="0.9"/>
  </g>
  <g transform="translate(1040, 500)" filter="url(#dropShadow)">
    <path d="M-15,100 Q-10,0 20,-120 Q0,-50 15,100 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <circle cx="10" cy="-130" r="80" fill="#15803d"/>
    <circle cx="-40" cy="-160" r="90" fill="#16a34a"/>
  </g>
  <!-- RIVYÈ (Rio e Lagoa Serena com Reflexos Suaves) -->
  <path d="M-50,480 Q400,430 800,470 T1250,450 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <path d="M-50,560 Q350,520 750,550 T1250,530 L1250,800 L-50,800 Z" fill="#38bdf8" opacity="0.4"/>
  <!-- ZWAZO (Garça Branca Elegante na Margem da Água) -->
  <g transform="translate(420, 560)" filter="url(#dropShadow)">
    <line x1="-10" y1="50" x2="-10" y2="120" stroke="#f59e0b" stroke-width="3"/>
    <line x1="8" y1="50" x2="8" y2="120" stroke="#f59e0b" stroke-width="3"/>
    <ellipse cx="0" cy="30" rx="30" ry="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M15,20 Q35,-10 30,-40" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <polygon points="30,-40 55,-35 30,-30" fill="#f59e0b"/>
  </g>
  <!-- FLÈ (Lírios d'Água e Vitórias-Régias Flutuantes) -->
  ${[260, 580, 780, 920].map((x, i) => `
  <g transform="translate(${x}, ${630 + (i%2)*50})" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="42" ry="16" fill="#166534" stroke="#14532d" stroke-width="2"/>
    <circle cx="0" cy="-6" r="14" fill="${["#f472b6", "#fb7185", "#f43f5e", "#ec4899"][i%4]}"/>
    <circle cx="0" cy="-6" r="6" fill="#fef08a"/>
  </g>`).join("")}
</svg>`;
}

// Scene 12: "Cânion verde e rio caudaloso" (objects: mountain [mòn], river [rivyè], waterfall [kaskad], bird [zwazo])
export function renderNatureza12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cânion verde e rio caudaloso - Lanati</title>
  <desc>Ghibli anime art: Desfiladeiro monumental, cachoeira entre as rochas, rio caudaloso e aves de rapina.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 160, 48)}
  ${drawGhibliCloud(300, 120, 0.9)}
  <!-- MÒN (Altas Paredes de Rocha e Vegetação do Cânion) -->
  <polygon points="0,0 280,0 220,550 0,650" fill="url(#hillFar)"/>
  <polygon points="1200,0 920,0 980,550 1200,650" fill="url(#hillFar)"/>
  <polygon points="0,300 240,420 180,750 0,800" fill="url(#hillNear)"/>
  <polygon points="1200,300 960,420 1020,750 1200,800" fill="url(#hillNear)"/>
  <!-- KASKAD (Cachoeira Caudalosa Caindo da Encosta Esquerda) -->
  <g transform="translate(180, 240)">
    <path d="M0,0 Q15,80 5,280 L25,280 Q35,80 20,0 Z" fill="#e0f2fe" opacity="0.95"/>
    <ellipse cx="15" cy="285" rx="35" ry="12" fill="#ffffff" opacity="0.8"/>
  </g>
  <!-- RIVYÈ (Rio Caudaloso em Rápidos e Águas Transparentes) -->
  <polygon points="200,500 1000,500 1200,800 0,800" fill="url(#waterTone)"/>
  <path d="M300,550 Q600,520 900,550 L850,750 Q600,720 350,750 Z" fill="#38bdf8" opacity="0.5"/>
  <!-- ZWAZO (Falcão Tropical Voando no Vão do Cânion) -->
  <g transform="translate(600, 280)" filter="url(#dropShadow)">
    <path d="M0,0 Q-35,-20 -70,-5 Q-40,8 0,0" fill="#451a03"/>
    <path d="M0,0 Q35,-20 70,-5 Q40,8 0,0" fill="#451a03"/>
    <ellipse cx="0" cy="0" rx="8" ry="14" fill="#78350f"/>
  </g>
</svg>`;
}

// Scene 13: "Recife de corais e tartarugas" (objects: turtle [tòti], ocean [lanmè], palm [palmis], bird [zwazo])
export function renderNatureza13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Recife de corais e tartarugas - Lanati</title>
  <desc>Ghibli anime art: Águas claras do Caribe, tartaruga marinha nadando, palmeiras e gaivota tropical.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 160, 52)}
  ${drawGhibliCloud(300, 140, 0.9)}
  <!-- LANMÈ (Oceano Turquesa com Formações de Coral Visíveis na Água Transparente) -->
  <path d="M-50,420 L1250,420 L1250,800 L-50,800 Z" fill="#0ea5e9"/>
  <path d="M-50,480 Q320,440 680,480 T1250,460 L1250,800 L-50,800 Z" fill="#14b8a6"/>
  <path d="M-50,560 Q300,520 650,560 T1250,540 L1250,800 L-50,800 Z" fill="#2dd4bf"/>
  <!-- PALMIS (Coqueiro Curvado na Ponta da Praia) -->
  <g transform="translate(180, 580)" filter="url(#dropShadow)">
    <path d="M0,0 Q-40,-120 40,-260" stroke="#78350f" stroke-width="20" fill="none"/>
    <g transform="translate(40, -260)">
      ${[-70, -35, 0, 35, 70].map(deg => `<path d="M0,0 Q${deg*1.6},-90 ${deg*2.6},-50" stroke="#15803d" stroke-width="12" stroke-linecap="round" fill="none"/>`).join("")}
      <circle cx="-10" cy="15" r="10" fill="#78350f"/>
    </g>
  </g>
  <!-- TÒTI (Grande Tartaruga Marinha Nadando na Água Clara) -->
  <g transform="translate(680, 620)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="55" ry="40" fill="#15803d" stroke="#166534" stroke-width="3"/>
    <ellipse cx="0" cy="0" rx="44" ry="30" fill="#22c55e"/>
    <circle cx="50" cy="-10" r="14" fill="#15803d"/>
    <!-- Flippers -->
    <path d="M20,-30 Q40,-65 60,-50 Q45,-25 25,-15" fill="#166534"/>
    <path d="M20,30 Q40,65 60,50 Q45,25 25,15" fill="#166534"/>
    <path d="M-30,-25 Q-55,-40 -60,-30 Q-45,-15 -25,-10" fill="#166534"/>
    <path d="M-30,25 Q-55,40 -60,30 Q-45,15 -25,10" fill="#166534"/>
  </g>
  <!-- ZWAZO (Gaivota Branca Sobrevoando as Águas) -->
  <g transform="translate(850, 260)" filter="url(#dropShadow)">
    <path d="M0,0 Q-25,-18 -50,-10 Q-28,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <path d="M0,0 Q25,-18 50,-10 Q28,-2 0,0" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  </g>
</svg>`;
}

// Scene 14: "Pico da montanha ao pôr do sol" (objects: mountain [mòn], tree [pyebwa], bird [zwazo], butterfly [papiyon])
export function renderNatureza14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pico da montanha ao pôr do sol - Lanati</title>
  <desc>Ghibli anime art: Pico montanhoso sob luz magenta e dourada, pinheiro de pedra, andorinha e borboleta alpina.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(760, 240, 52, true)}
  ${drawGhibliCloud(220, 160, 0.95, true)}
  <!-- MÒN (Cordilheira Majestosa com Camadas de Montanhas Púrpuras) -->
  <polygon points="-50,560 300,340 700,560 1250,420 1250,800 -50,800" fill="#4a154b" opacity="0.6"/>
  <polygon points="-50,620 450,400 850,600 1250,520 1250,800 -50,800" fill="#6b21a8" opacity="0.5"/>
  <polygon points="-50,680 260,510 650,680 1250,600 1250,800 -50,800" fill="url(#hillNear)"/>
  <!-- PYEBWA (Pinheiro Alpino Centenário no Cume) -->
  <g transform="translate(280, 510)" filter="url(#dropShadow)">
    <path d="M-15,100 Q-20,0 15,-120 Q0,-60 15,100 Z" fill="#451a03" stroke="#271102" stroke-width="3"/>
    <circle cx="10" cy="-120" r="70" fill="#14532d"/>
    <circle cx="-30" cy="-140" r="60" fill="#166534"/>
    <circle cx="35" cy="-150" r="50" fill="#15803d"/>
  </g>
  <!-- PAPIYON (Borboleta de Cores Quentes Pousando na Rocha) -->
  <g transform="translate(560, 600)" filter="url(#dropShadow)">
    <polygon points="0,0 -22,-20 -28,-6 -14,14" fill="#fb923c"/>
    <polygon points="0,0 22,-20 28,-6 14,14" fill="#fb923c"/>
    <line x1="0" y1="-14" x2="0" y2="14" stroke="#451a03" stroke-width="2.5"/>
  </g>
  <!-- ZWAZO (Andorinha Voando Contra o Pôr do Sol) -->
  <g transform="translate(680, 320)" filter="url(#dropShadow)">
    <path d="M0,0 Q-30,-16 -60,-8 Q-32,-2 0,0" fill="#1e1b4b"/>
    <path d="M0,0 Q30,-16 60,-8 Q32,-2 0,0" fill="#1e1b4b"/>
  </g>
</svg>`;
}

// Scene 15: "Floresta tropical de bambus e palmeiras" (objects: palm [palmis], waterfall [kaskad], tree [pyebwa], flower [flè])
export function renderNatureza15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Floresta tropical de bambus e palmeiras - Lanati</title>
  <desc>Ghibli anime art: Floresta densa com raios de sol, palmeiras reais, cachoeira ao fundo e bromélias tropicais.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  <!-- Sun Rays Through Canopy -->
  <polygon points="400,0 520,0 680,800 500,800" fill="#fef08a" opacity="0.25"/>
  <polygon points="700,0 800,0 950,800 820,800" fill="#fef08a" opacity="0.2"/>
  <!-- KASKAD (Cachoeira Distante Entre as Folhagens) -->
  <path d="M600,350 Q610,480 605,620 L625,620 Q630,480 620,350 Z" fill="#e0f2fe" opacity="0.9"/>
  <!-- PYEBWA (Árvore Tropical Gigante com Cipós e Musgo) -->
  <g transform="translate(180, 480)" filter="url(#dropShadow)">
    <path d="M-40,320 Q0,0 -20,-300 Q20,-100 40,320 Z" fill="#78350f" stroke="#3e2515" stroke-width="4"/>
    <circle cx="-30" cy="-280" r="140" fill="#14532d"/>
    <circle cx="80" cy="-300" r="150" fill="#166534"/>
  </g>
  <!-- PALMIS (Palmeiras Reais Tropicais Elegantes) -->
  <g transform="translate(860, 520)" filter="url(#dropShadow)">
    <path d="M0,0 Q30,-140 10,-320" stroke="#78350f" stroke-width="16" fill="none"/>
    <g transform="translate(10, -320)">
      ${[-65, -35, -5, 25, 55].map(deg => `<path d="M0,0 Q${deg*1.6},-90 ${deg*2.6},-50" stroke="#15803d" stroke-width="11" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>
  <!-- Forest Floor -->
  <rect x="0" y="680" width="1200" height="120" fill="#14532d"/>
  <!-- FLÈ (Bromélias Tropicais Vermelhas e Alaranjadas) -->
  ${[380, 520, 720, 1020].map((x, i) => `
  <g transform="translate(${x}, 720)" filter="url(#dropShadow)">
    <path d="M0,0 L-25,-35 L0,-15 L25,-35 Z" fill="${["#ef4444", "#f97316", "#f43f5e", "#ea580c"][i%4]}"/>
    <path d="M0,-10 L-15,-45 L0,-25 L15,-45 Z" fill="#fef08a"/>
  </g>`).join("")}
</svg>`;
}

// Scene 16: "Ninho dos pássaros no manguezal" (objects: bird [zwazo], tree [pyebwa], river [rivyè], butterfly [papiyon])
export function renderNatureza16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ninho dos pássaros no manguezal - Lanati</title>
  <desc>Ghibli anime art: Manguezal sereno com raízes aéreas, rio calmo, ninho de aves e borboletas.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 220, 50, true)}
  <!-- RIVYÈ (Rio Estuarino Refletindo o Céu Quente) -->
  <path d="M-50,480 Q450,420 850,470 T1250,450 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <!-- PYEBWA (Mangue com Raízes Aéreas Entrelaçadas) -->
  <g transform="translate(740, 520)" filter="url(#dropShadow)">
    <!-- Stilt Roots Arching Down into Water -->
    <path d="M0,-80 Q-80,40 -120,160" stroke="#78350f" stroke-width="12" fill="none"/>
    <path d="M0,-80 Q-40,60 -60,160" stroke="#78350f" stroke-width="10" fill="none"/>
    <path d="M0,-80 Q40,60 60,160" stroke="#78350f" stroke-width="10" fill="none"/>
    <path d="M0,-80 Q80,40 120,160" stroke="#78350f" stroke-width="12" fill="none"/>
    <!-- Trunk & Canopy -->
    <path d="M0,-80 L0,-240" stroke="#78350f" stroke-width="20"/>
    <circle cx="0" cy="-260" r="110" fill="#15803d"/>
    <circle cx="-60" cy="-280" r="90" fill="#16a34a"/>
    <circle cx="60" cy="-280" r="90" fill="#16a34a"/>
  </g>
  <!-- ZWAZO (Garças Tropicais Pousadas nos Galhos e Ninhos) -->
  <g transform="translate(680, 280)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="20" ry="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M12,-8 Q24,-24 20,-40" stroke="#ffffff" stroke-width="5" fill="none"/>
    <polygon points="20,-40 36,-36 20,-32" fill="#f59e0b"/>
  </g>
  <g transform="translate(780, 320)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="18" ry="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <polygon points="16,-4 30,-2 16,2" fill="#f59e0b"/>
  </g>
  <!-- PAPIYON (Borboletas Amarelas Flutuando Sobre o Rio) -->
  <g transform="translate(380, 560)" filter="url(#dropShadow)">
    <ellipse cx="-12" cy="-10" rx="14" ry="10" fill="#facc15"/>
    <ellipse cx="12" cy="-10" rx="14" ry="10" fill="#facc15"/>
    <ellipse cx="-8" cy="8" rx="10" ry="7" fill="#fbbf24"/>
    <ellipse cx="8" cy="8" rx="10" ry="7" fill="#fbbf24"/>
    <line x1="0" y1="-14" x2="0" y2="14" stroke="#451a03" stroke-width="2"/>
  </g>
</svg>`;
}

// Scene 17: "Enseada secreta com falésias" (objects: ocean [lanmè], mountain [mòn], palm [palmis], turtle [tòti])
export function renderNatureza17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Enseada secreta com falésias - Lanati</title>
  <desc>Ghibli anime art: Enseada litorânea com falésias de calcário, mar esmeralda, palmeiras e tartaruga.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 160, 48)}
  ${drawGhibliCloud(200, 140, 0.95)}
  <!-- MÒN (Falésias Altas de Pedra Calcária Coberta de Vegetação) -->
  <polygon points="0,0 350,0 260,540 0,640" fill="url(#stoneTone)"/>
  <polygon points="1200,0 850,0 940,540 1200,640" fill="url(#stoneTone)"/>
  <circle cx="200" cy="180" r="70" fill="#15803d"/>
  <circle cx="1000" cy="220" r="80" fill="#15803d"/>
  <!-- LANMÈ (Mar Esmeralda Cristalino da Enseada) -->
  <path d="M180,500 L1020,500 L1200,800 L0,800 Z" fill="#0d9488"/>
  <path d="M220,560 Q600,520 980,560 L1100,750 Q600,700 100,750 Z" fill="#2dd4bf" opacity="0.65"/>
  <!-- PALMIS (Palmeira Debruçada Sobre a Água) -->
  <g transform="translate(280, 520)" filter="url(#dropShadow)">
    <path d="M0,0 Q60,-90 120,-160" stroke="#78350f" stroke-width="16" fill="none"/>
    <g transform="translate(120, -160)">
      ${[-60, -30, 0, 30, 60].map(deg => `<path d="M0,0 Q${deg*1.6},-80 ${deg*2.4},-40" stroke="#16a34a" stroke-width="10" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>
  <!-- TÒTI (Tartaruga Descansando na Areia Clara da Enseada) -->
  <g transform="translate(620, 680)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="44" ry="32" fill="#65a30d" stroke="#365314" stroke-width="2.5"/>
    <ellipse cx="0" cy="0" rx="35" ry="24" fill="#84cc16"/>
    <circle cx="36" cy="-8" r="11" fill="#65a30d"/>
  </g>
</svg>`;
}

// Scene 18: "Bosque das borboletas azuis" (objects: butterfly [papiyon], tree [pyebwa], flower [flè], river [rivyè])
export function renderNatureza18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Bosque das borboletas azuis - Lanati</title>
  <desc>Ghibli anime art: Bosque mágico de árvores antigas, riacho claro, canteiro de flores e borboletas azuis brilhantes.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="#064e3b" filter="url(#ghibliPaper)" />
  <!-- Dappled Canopy Light -->
  ${[200, 420, 680, 940].map(x => `<ellipse cx="${x}" cy="150" rx="140" ry="100" fill="#10b981" opacity="0.3"/>`).join("")}
  <!-- PYEBWA (Troncos de Carvalho e Figueiras Antigas) -->
  <g transform="translate(240, 480)" filter="url(#dropShadow)">
    <path d="M-50,320 Q0,0 -30,-480 Q30,-200 50,320 Z" fill="#451a03"/>
    <circle cx="-10" cy="-280" r="160" fill="#047857"/>
  </g>
  <g transform="translate(960, 480)" filter="url(#dropShadow)">
    <path d="M-40,320 Q0,0 20,-480 Q40,-200 40,320 Z" fill="#451a03"/>
    <circle cx="10" cy="-280" r="160" fill="#047857"/>
  </g>
  <!-- RIVYÈ (Riacho Cristalino Cortando o Chão Musgoso) -->
  <path d="M480,480 Q620,620 540,800 L720,800 Q780,620 640,480 Z" fill="#38bdf8" opacity="0.75"/>
  <!-- FLÈ (Tapete de Flores Azuis e Amarelas) -->
  ${[180, 320, 780, 900].map((x, i) => `
  <g transform="translate(${x}, ${640 + (i%2)*50})" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="12" fill="${["#38bdf8", "#fbbf24", "#60a5fa", "#f59e0b"][i%4]}"/>
    <circle cx="0" cy="0" r="4" fill="#ffffff"/>
  </g>`).join("")}
  <!-- PAPIYON (Borboletas Morpho Azul Cintilantes) -->
  <g transform="translate(560, 380)" filter="url(#dropShadow)">
    <polygon points="0,0 -28,-26 -35,-8 -18,18" fill="#0284c7"/>
    <polygon points="0,0 -20,-20 -26,-6 -14,14" fill="#38bdf8"/>
    <polygon points="0,0 28,-26 35,-8 18,18" fill="#0284c7"/>
    <polygon points="0,0 20,-20 26,-6 14,14" fill="#38bdf8"/>
    <line x1="0" y1="-16" x2="0" y2="16" stroke="#0f172a" stroke-width="2.5"/>
  </g>
  <g transform="translate(740, 450) scale(0.75)" filter="url(#dropShadow)">
    <polygon points="0,0 -28,-26 -35,-8 -18,18" fill="#0284c7"/>
    <polygon points="0,0 28,-26 35,-8 18,18" fill="#0284c7"/>
  </g>
</svg>`;
}

// Scene 19: "Gruta com cascata sagrada" (objects: waterfall [kaskad], mountain [mòn], flower [flè], bird [zwazo])
export function renderNatureza19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Gruta com cascata sagrada - Lanati</title>
  <desc>Ghibli anime art: Entrada de gruta rochosa, cascata cristalina em arco, flores selvagens e pássaro tropical.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  <!-- MÒN (Arco Natural de Rocha Monumental e Paredão de Montanha) -->
  <path d="M0,0 L1200,0 L1200,800 L0,800 Z" fill="#334155"/>
  <path d="M220,800 Q300,180 600,180 Q900,180 980,800 Z" fill="url(#skySunset)"/>
  <circle cx="600" cy="340" r="45" fill="url(#sunGlowSunset)"/>
  <!-- KASKAD (Véu de Noiva de Cachoeira Despencando do Alto da Caverna) -->
  <g transform="translate(580, 200)">
    <path d="M0,0 Q10,180 0,600 L40,600 Q30,180 40,0 Z" fill="#bae6fd" opacity="0.85"/>
    <ellipse cx="20" cy="590" rx="70" ry="18" fill="#ffffff" opacity="0.7"/>
  </g>
  <!-- Pool of Water -->
  <path d="M200,680 Q600,620 1000,680 L1200,800 L0,800 Z" fill="url(#waterTone)"/>
  <!-- FLÈ (Campânulas e Flores Rupestres nas Frestas da Rocha) -->
  ${[120, 260, 940, 1080].map((x, i) => `
  <g transform="translate(${x}, ${540 + (i%2)*60})" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="14" fill="${["#ec4899", "#a855f7", "#f43f5e", "#d946ef"][i%4]}"/>
    <circle cx="0" cy="0" r="5" fill="#fef08a"/>
  </g>`).join("")}
  <!-- ZWAZO (Pássaro de Penas Azuis Pousado na Rocha da Margem) -->
  <g transform="translate(380, 640)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="22" ry="15" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
    <circle cx="16" cy="-8" r="10" fill="#38bdf8"/>
    <polygon points="26,-8 38,-5 26,-2" fill="#f59e0b"/>
  </g>
</svg>`;
}

// Scene 20: "Dunas costeiras com palmeiras" (objects: palm [palmis], ocean [lanmè], butterfly [papiyon], turtle [tòti])
export function renderNatureza20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dunas costeiras com palmeiras - Lanati</title>
  <desc>Ghibli anime art: Dunas douradas ao entardecer, palmeiras ao vento, oceano calmo e tartaruga.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(850, 240, 52, true)}
  ${drawGhibliCloud(240, 160, 0.9, true)}
  <!-- LANMÈ (Oceano na Linha do Horizonte) -->
  <path d="M-50,440 L1250,440 L1250,560 L-50,560 Z" fill="#0369a1"/>
  <!-- Golden Sand Dunes Rolling into View -->
  <path d="M-50,520 Q300,460 700,530 T1250,490 L1250,800 L-50,800 Z" fill="#fde047" opacity="0.9"/>
  <path d="M-50,590 Q350,530 800,600 T1250,560 L1250,800 L-50,800 Z" fill="#facc15"/>
  <path d="M-50,680 Q320,620 750,670 T1250,650 L1250,800 L-50,800 Z" fill="#eab308"/>
  <!-- PALMIS (Palmeiras Costeiras Balançando na Brisa Marinha) -->
  <g transform="translate(340, 580)" filter="url(#dropShadow)">
    <path d="M0,0 Q-30,-120 15,-240" stroke="#78350f" stroke-width="18" fill="none"/>
    <g transform="translate(15, -240)">
      ${[-65, -35, -5, 25, 55].map(deg => `<path d="M0,0 Q${deg*1.6},-90 ${deg*2.5},-50" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>`).join("")}
    </g>
  </g>
  <!-- PAPIYON (Borboleta Litorânea Voando Sobre a Vegetação da Duna) -->
  <g transform="translate(580, 520)" filter="url(#dropShadow)">
    <polygon points="0,0 -20,-18 -26,-5 -12,12" fill="#f97316"/>
    <polygon points="0,0 20,-18 26,-5 12,12" fill="#f97316"/>
    <line x1="0" y1="-12" x2="0" y2="12" stroke="#451a03" stroke-width="2"/>
  </g>
  <!-- TÒTI (Tartaruga Marinha Retornando Tranquilamente ao Mar) -->
  <g transform="translate(760, 680)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="42" ry="30" fill="#65a30d" stroke="#365314" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="33" ry="22" fill="#84cc16"/>
    <circle cx="34" cy="-6" r="10" fill="#65a30d"/>
  </g>
</svg>`;
}


