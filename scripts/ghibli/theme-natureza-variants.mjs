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

