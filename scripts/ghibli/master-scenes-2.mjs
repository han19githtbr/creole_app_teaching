import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";

export function renderHistoria() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Fortaleza de pedra no alto do morro - Istwa</title>
  <desc>Ghibli anime art: Citadelle Laferrière, canhões de bronze, tocha acesa e bandeira do Haiti.</desc>
  ${getGhibliDefs()}
  
  <!-- Dramatic Sunset Sky over Mountaintop -->
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(280, 240, 52, true)}
  ${drawGhibliCloud(780, 160, 0.95, true)}
  ${drawGhibliCloud(1060, 120, 0.8, true)}

  <!-- Distant Mountain Ridges below the clouds -->
  <path d="M-50,560 Q340,480 720,530 T1250,500 L1250,800 L-50,800 Z" fill="#58354c" opacity="0.7"/>

  <!-- FÒ (Citadelle Laferrière - Monumental Fortaleza de Pedra Haitiana) -->
  <g transform="translate(680, 480)" filter="url(#dropShadow)">
    <!-- Base Mountain Rock Bastion -->
    <polygon points="-420,180 -340,-20 -280,-140 180,-140 320,-40 380,180" fill="url(#stoneTone)" stroke="#3e3933" stroke-width="4"/>
    
    <!-- Massive Crenellated Battlements & Towers -->
    <!-- Tower Left -->
    <rect x="-320" y="-220" width="110" height="150" fill="url(#stoneTone)" stroke="#3e3933" stroke-width="3"/>
    ${[-320, -290, -260, -230].map(x => `<rect x="${x}" y="-240" width="18" height="20" fill="#78716c"/>`).join("")}
    
    <!-- Central Prow / Great Battery Bastion -->
    <polygon points="-210,-70 60,-240 180,-140 -50,60" fill="url(#stoneTone)" stroke="#3e3933" stroke-width="3"/>
    <!-- Gun port embrasures -->
    <rect x="-160" y="-120" width="24" height="28" rx="4" fill="#1c1917"/>
    <rect x="-90" y="-80" width="24" height="28" rx="4" fill="#1c1917"/>
    <rect x="-20" y="-40" width="24" height="28" rx="4" fill="#1c1917"/>

    <!-- Highest Tower Right with Flagpole -->
    <rect x="140" y="-260" width="90" height="180" fill="url(#stoneTone)" stroke="#3e3933" stroke-width="3"/>
    ${[140, 170, 200].map(x => `<rect x="${x}" y="-280" width="18" height="20" fill="#78716c"/>`).join("")}

    <!-- DRAPO (Bandeira Histórica do Haiti na Torre Mais Alta) -->
    <g transform="translate(185, -280)">
      <line x1="0" y1="0" x2="0" y2="-90" stroke="#d6d3d1" stroke-width="4"/>
      <!-- Flag waving -->
      <path d="M0,-90 Q30,-98 60,-90 T120,-90 L120,-45 Q60,-55 0,-45 Z" fill="#00209f"/>
      <path d="M0,-45 Q60,-55 120,-45 L120,0 Q60,-10 0,0 Z" fill="#d21034"/>
    </g>
  </g>

  <!-- Rampart Stone Parapet in Foreground -->
  <path d="M-50,600 L1250,580 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
  <rect x="0" y="580" width="1200" height="25" fill="#44403c"/>

  <!-- KANON (Canhão Histórico de Bronze / Ferro sobre Carruagem de Madeira) -->
  <g transform="translate(360, 630)" filter="url(#dropShadow)">
    <!-- Shadow on stone floor -->
    <ellipse cx="20" cy="55" rx="100" ry="20" fill="#000000" opacity="0.45"/>
    
    <!-- Heavy 4-Wheeled Wooden Gun Carriage -->
    <rect x="-40" y="5" width="120" height="42" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
    <!-- Iron wheels -->
    <circle cx="-25" cy="40" r="22" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="-25" cy="40" r="8" fill="#78716c"/>
    <circle cx="65" cy="40" r="22" fill="#292524" stroke="#1c1917" stroke-width="3"/>
    <circle cx="65" cy="40" r="8" fill="#78716c"/>

    <!-- Heavy Bronze Cannon Barrel pointing through rampart -->
    <polygon points="-70,5 110,-32 112,-8 -70,22" fill="url(#brassTone)" stroke="#452a13" stroke-width="3"/>
    <!-- Cascabel / rear round knob -->
    <circle cx="-76" cy="14" r="14" fill="#785315"/>
    <!-- Cannon reinforcement rings -->
    <line x1="-30" y1="2" x2="-30" y2="19" stroke="#36220a" stroke-width="4"/>
    <line x1="20" y1="-12" x2="20" y2="5" stroke="#36220a" stroke-width="4"/>
    <line x1="70" y1="-24" x2="70" y2="-7" stroke="#36220a" stroke-width="4"/>
    <!-- Muzzle opening -->
    <ellipse cx="111" cy="-20" rx="6" ry="12" fill="#1c1917"/>

    <!-- Stack of Cannonballs (Boulet) nearby -->
    <g transform="translate(140, 30)">
      <circle cx="0" cy="15" r="12" fill="#1c1917" stroke="#0c0a09" stroke-width="1.5"/>
      <circle cx="22" cy="15" r="12" fill="#1c1917" stroke="#0c0a09" stroke-width="1.5"/>
      <circle cx="44" cy="15" r="12" fill="#1c1917" stroke="#0c0a09" stroke-width="1.5"/>
      <circle cx="11" cy="-4" r="12" fill="#292524" stroke="#0c0a09" stroke-width="1.5"/>
      <circle cx="33" cy="-4" r="12" fill="#292524" stroke="#0c0a09" stroke-width="1.5"/>
      <circle cx="22" cy="-23" r="12" fill="#44403c" stroke="#0c0a09" stroke-width="1.5"/>
    </g>
  </g>

  <!-- FLANBO (Tocha de Ferro na Parede com Chamas Vivas e Brilho Quente) -->
  <g transform="translate(860, 520)" filter="url(#dropShadow)">
    <!-- Wrought Iron Wall Sconce Bracket -->
    <path d="M0,80 L20,40 L20,-10 L-5,-10" stroke="#1c1917" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="80" r="6" fill="#1c1917"/>
    <!-- Torch iron basket -->
    <polygon points="10,-10 30,-10 26,20 14,20" fill="#292524"/>
    
    <!-- Warm Torch Glow Halo -->
    <circle cx="20" cy="-30" r="70" fill="#f59e0b" opacity="0.3" filter="url(#softGlow)"/>
    
    <!-- Crackling Fire Flame -->
    <path d="M20,-65 
      C10,-50 5,-35 12,-20 
      C16,-12 24,-12 28,-20 
      C35,-35 30,-50 20,-65 Z" 
      fill="#ef4444"/>
    <path d="M20,-55 
      C14,-42 10,-30 16,-18 
      C19,-12 22,-12 25,-18 
      C30,-30 26,-42 20,-55 Z" 
      fill="#f97316"/>
    <path d="M20,-45 
      C17,-35 14,-25 18,-15 
      C20,-10 21,-10 23,-15 
      C27,-25 24,-35 20,-45 Z" 
      fill="#fef08a"/>
  </g>
</svg>`;
}

export function renderCinema() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cinema de bairro ao entardecer - Sinema</title>
  <desc>Ghibli anime art: Fachada vintage do cinema, pipoca dourada, céu estrelado e árvores.</desc>
  ${getGhibliDefs()}
  
  <!-- Deep Twilight Indigo Sky with ZETWAL (Estrelas cintilantes) -->
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  
  <!-- Crescent Moon -->
  <path d="M1020,120 A 28 28 0 0 0 1000,165 A 36 36 0 1 1 1020,120 Z" fill="#fef08a" filter="url(#softGlow)"/>

  <!-- ZETWAL (Estrelas no Céu Noturno) -->
  ${[
    { x: 120, y: 80, r: 2 },
    { x: 260, y: 140, r: 2.5 },
    { x: 380, y: 90, r: 1.8 },
    { x: 520, y: 60, r: 2.2 },
    { x: 680, y: 110, r: 2 },
    { x: 840, y: 70, r: 2.4 },
    { x: 940, y: 130, r: 1.8 },
    { x: 1100, y: 90, r: 2.5 },
    { x: 180, y: 200, r: 1.5 },
    { x: 450, y: 170, r: 2 }
  ].map(s => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#ffffff" filter="url(#softGlow)"/>`).join("")}

  <!-- PYEBWA (Árvores da Calçada com Folhagem de Outono) framing left and right -->
  <g transform="translate(100, 580)" filter="url(#dropShadow)">
    <path d="M0,0 Q-20,-120 -10,-240 Q10,-120 0,0" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-260" rx="90" ry="110" fill="#15803d"/>
    <ellipse cx="-40" cy="-240" rx="70" ry="90" fill="#16a34a"/>
    <ellipse cx="40" cy="-240" rx="70" ry="90" fill="#f59e0b"/>
  </g>
  <g transform="translate(1100, 580)" filter="url(#dropShadow)">
    <path d="M0,0 Q20,-120 10,-240 Q-10,-120 0,0" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-260" rx="90" ry="110" fill="#15803d"/>
    <ellipse cx="40" cy="-240" rx="70" ry="90" fill="#16a34a"/>
    <ellipse cx="-40" cy="-240" rx="70" ry="90" fill="#f59e0b"/>
  </g>

  <!-- SINEMA (Prédio e Fachada do Cinema Art Déco com Letreiro Neon) -->
  <g transform="translate(600, 560)" filter="url(#dropShadow)">
    <!-- Building Facade -->
    <rect x="-260" y="-320" width="520" height="320" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>
    <rect x="-270" y="-335" width="540" height="20" fill="#334155"/>
    
    <!-- Grand Glowing Cinema Marquee Sign -->
    <rect x="-200" y="-280" width="400" height="95" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="4"/>
    <!-- Yellow Light Bulb Border -->
    ${[-180, -140, -100, -60, -20, 20, 60, 100, 140, 180].map(x => `
      <circle cx="${x}" cy="-270" r="4" fill="#fef08a"/>
      <circle cx="${x}" cy="-195" r="4" fill="#fef08a"/>
    `).join("")}
    
    <!-- Glowing Neon Text "SINEMA" -->
    <text x="0" y="-220" font-family="'Trebuchet MS', sans-serif" font-size="52" font-weight="900" fill="#fde047" letter-spacing="12" text-anchor="middle" filter="url(#softGlow)">SINEMA</text>
    
    <!-- Subtitle in Kreyòl -->
    <text x="0" y="-192" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8" letter-spacing="4" text-anchor="middle">SAL SINEMA KREYÒL</text>

    <!-- Entrance Doors with Glass and Warm Light from within -->
    <rect x="-90" y="-100" width="180" height="100" rx="4" fill="#fef08a" opacity="0.85"/>
    <rect x="-85" y="-95" width="80" height="95" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <rect x="5" y="-95" width="80" height="95" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Brass handles -->
    <line x1="-12" y1="-50" x2="-12" y2="-30" stroke="#facc15" stroke-width="3"/>
    <line x1="12" y1="-50" x2="12" y2="-30" stroke="#facc15" stroke-width="3"/>

    <!-- Movie Poster Display Cases -->
    <rect x="-220" y="-130" width="70" height="95" rx="3" fill="#38bdf8" stroke="#facc15" stroke-width="2"/>
    <circle cx="-185" cy="-85" r="16" fill="#f43f5e"/>
    <rect x="150" y="-130" width="70" height="95" rx="3" fill="#f43f5e" stroke="#facc15" stroke-width="2"/>
    <polygon points="185,-105 165,-70 205,-70" fill="#facc15"/>
  </g>

  <!-- Pavement / Sidewalk Terrace in Foreground -->
  <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="#334155"/>
  <rect x="0" y="620" width="1200" height="15" fill="#64748b"/>

  <!-- PÒP-KÒN (Balde de Pipoca Crocante e Dourada em Destaque na Mesinha) -->
  <g transform="translate(360, 680)" filter="url(#dropShadow)">
    <!-- Cafe table top -->
    <ellipse cx="0" cy="55" rx="90" ry="24" fill="#475569" stroke="#1e293b" stroke-width="3"/>
    <rect x="-10" y="70" width="20" height="70" fill="#1e293b"/>
    
    <!-- Red and White Striped Popcorn Bucket -->
    <polygon points="-40,40 40,40 32,-35 -32,-35" fill="#ffffff" stroke="#991b1b" stroke-width="2"/>
    <!-- Red stripes -->
    <polygon points="-22,-35 -14,-35 -18,40 -28,40" fill="#dc2626"/>
    <polygon points="-6,-35 4,-35 2,40 -8,40" fill="#dc2626"/>
    <polygon points="14,-35 22,-35 18,40 10,40" fill="#dc2626"/>
    
    <!-- Fluffy Golden Butter Popcorn Kernels overflowing -->
    ${[
      { x: 0, y: -45, r: 12 },
      { x: -16, y: -42, r: 11 },
      { x: 18, y: -40, r: 11 },
      { x: -28, y: -36, r: 9 },
      { x: 28, y: -35, r: 10 },
      { x: -10, y: -58, r: 12 },
      { x: 12, y: -56, r: 12 },
      { x: 0, y: -68, r: 11 }
    ].map(k => `
      <circle cx="${k.x}" cy="${k.y}" r="${k.r}" fill="#fef08a" stroke="#ca8a04" stroke-width="1.2"/>
      <circle cx="${k.x+2}" cy="${k.y-2}" r="${k.r*0.5}" fill="#ffffff" opacity="0.6"/>
    `).join("")}
  </g>
</svg>`;
}

export function renderMusica() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Palco ao ar livre - Mizik</title>
  <desc>Ghibli anime art: Violão acústico, tambor haitiano, notas musicais e alto-falante.</desc>
  ${getGhibliDefs()}
  
  <!-- Evening Musical Concert Sky -->
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 380, 52, true)}
  ${drawGhibliCloud(220, 160, 0.9, true)}
  ${drawGhibliCloud(960, 170, 0.85, true)}

  <!-- Distant Blue Ridge Hills -->
  <path d="M-50,530 Q320,460 650,510 T1250,480 L1250,800 L-50,800 Z" fill="#3b2b4a" opacity="0.6"/>

  <!-- Festival Lights Strung overhead -->
  <path d="M-20,240 Q600,320 1220,250" stroke="#475569" stroke-width="2.5" fill="none"/>
  ${[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x, i) => {
    const c = ["#facc15", "#f43f5e", "#38bdf8", "#4ade80"][i % 4];
    return `<circle cx="${x}" cy="${240 + Math.sin(x/1200*Math.PI)*80}" r="8" fill="${c}" filter="url(#softGlow)"/>`;
  }).join("")}

  <!-- Wooden Outdoor Festival Concert Stage -->
  <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#78350f"/>
  <rect x="0" y="600" width="1200" height="22" fill="#92400e" stroke="#451a03" stroke-width="2"/>
  ${[0, 120, 240, 360, 480, 600, 720, 840, 960, 1080].map(x => `<line x1="${x}" y1="620" x2="${x}" y2="800" stroke="#451a03" stroke-width="2.5"/>`).join("")}

  <!-- NÒT MIZIK (Notas Musicais e Pauta Dourada Flutuando no Ar) -->
  <g filter="url(#softGlow)">
    <!-- Swirling melody trails -->
    <path d="M460,540 Q550,380 680,440 T920,300" stroke="#facc15" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M480,555 Q570,395 700,455 T940,315" stroke="#facc15" stroke-width="1.5" fill="none" opacity="0.5"/>
    
    <!-- Treble Clef -->
    <g transform="translate(680, 420) scale(0.9)">
      <path d="M0,35 C0,45 -12,45 -12,35 C-12,25 0,25 0,15 L0,-35 C0,-55 18,-55 18,-35 C18,-15 -25,-10 -25,18 C-25,45 15,45 15,18 C15,0 -5,-15 -5,-25" stroke="#fde047" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Quaver & Semiquaver Notes -->
    <g transform="translate(560, 420)">
      <ellipse cx="0" cy="0" rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="-2" x2="8" y2="-36" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-36 Q20,-30 22,-18" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>

    <g transform="translate(790, 340)">
      <ellipse cx="0" cy="0" rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="-2" x2="8" y2="-36" stroke="#facc15" stroke-width="3"/>
      <ellipse cx="32" cy="-8" rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="40" y1="-10" x2="40" y2="-44" stroke="#facc15" stroke-width="3"/>
      <polygon points="8,-36 40,-44 40,-36 8,-28" fill="#facc15"/>
    </g>

    <g transform="translate(900, 290)">
      <ellipse cx="0" cy="0" rx="8" ry="6" fill="#facc15" transform="rotate(-20)"/>
      <line x1="6" y1="-2" x2="6" y2="-28" stroke="#facc15" stroke-width="2.5"/>
    </g>
  </g>

  <!-- OPALÈ (Alto-Falante / Caixa de Som Vintage de Madeira) on left stage -->
  <g transform="translate(180, 560)" filter="url(#dropShadow)">
    <rect x="-45" y="-120" width="90" height="150" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Speaker cones -->
    <circle cx="0" cy="-75" r="28" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <circle cx="0" cy="-75" r="12" fill="#475569"/>
    <circle cx="0" cy="-15" r="20" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <circle cx="0" cy="-15" r="8" fill="#475569"/>
  </g>

  <!-- GITA (Violão Acústico de Madeira Clássico em Grande Destaque) -->
  <g transform="translate(480, 610) rotate(-18)" filter="url(#dropShadow)">
    <!-- Shadow -->
    <ellipse cx="0" cy="90" rx="65" ry="18" fill="#000000" opacity="0.35"/>
    
    <!-- Wooden Chair resting on -->
    <rect x="-35" y="40" width="70" height="15" rx="3" fill="#543317"/>

    <!-- Guitar Body (Figure-8 contour) -->
    <path d="M-42,-30 
      C-60,-15 -62,20 -44,45 
      C-32,60 -56,90 -45,120 
      C-30,150 30,150 45,120 
      C56,90 32,60 44,45 
      C62,20 60,-15 42,-30 
      C28,-40 -28,-40 -42,-30 Z" 
      fill="#d97706" stroke="#78350f" stroke-width="3.5"/>
    <!-- Rosewood sides rim -->
    <path d="M-38,-26 C-54,-12 -56,18 -40,42 C-28,56 -50,86 -40,114 C-26,142 26,142 40,114 C50,86 28,56 40,42 C56,18 54,-12 38,-26" fill="none" stroke="#b45309" stroke-width="4"/>
    
    <!-- Soundhole Rosette & Hole -->
    <circle cx="0" cy="15" r="22" fill="#fffbeb" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="15" r="16" fill="#1c1917"/>

    <!-- Bridge & Saddle -->
    <rect x="-24" y="85" width="48" height="14" rx="3" fill="#451a03" stroke="#1c1917" stroke-width="1.5"/>
    <rect x="-18" y="88" width="36" height="4" fill="#f8fafc"/>

    <!-- Neck & Fretboard -->
    <rect x="-12" y="-170" width="24" height="140" fill="#451a03" stroke="#292524" stroke-width="2"/>
    <!-- Frets -->
    ${[-155, -140, -125, -110, -95, -80, -65, -50].map(y => `<line x1="-12" y1="${y}" x2="12" y2="${y}" stroke="#d6d3d1" stroke-width="1.5"/>`).join("")}

    <!-- Headstock & Tuning Pegs -->
    <polygon points="-14,-170 14,-170 16,-220 -16,-220" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- 6 Tuning pegs -->
    <circle cx="-22" cy="-205" r="4.5" fill="#facc15"/>
    <circle cx="-22" cy="-192" r="4.5" fill="#facc15"/>
    <circle cx="-22" cy="-179" r="4.5" fill="#facc15"/>
    <circle cx="22" cy="-205" r="4.5" fill="#facc15"/>
    <circle cx="22" cy="-192" r="4.5" fill="#facc15"/>
    <circle cx="22" cy="-179" r="4.5" fill="#facc15"/>

    <!-- 6 Silver Strings -->
    ${[-8, -5, -2, 2, 5, 8].map(x => `<line x1="${x}" y1="-210" x2="${x*1.5}" y2="90" stroke="#f8fafc" stroke-width="1.2" opacity="0.9"/>`).join("")}
  </g>

  <!-- TANBOU (Tambor Haitiano ao Lado do Violão) -->
  <g transform="translate(680, 650)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="55" ry="15" fill="#000000" opacity="0.35"/>
    <path d="M-40,-50 L40,-50 Q50,10 32,50 L-32,50 Q-50,10 -40,-50 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-50" rx="40" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <!-- Tension cords -->
    <path d="M-38,-42 L-20,10 L0,-42 L20,10 L38,-42" stroke="#facc15" stroke-width="3" fill="none"/>
  </g>
</svg>`;
}

export function renderLazeres() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Tarde de piquenique e pipas - Lwazi</title>
  <desc>Ghibli anime art: Pipa voando, bicicleta encostada, toalha de piquenique e árvore frondosa.</desc>
  ${getGhibliDefs()}
  
  <!-- Sunny Meadow Afternoon Sky -->
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 140, 50)}
  ${drawGhibliCloud(280, 150, 1.0)}
  ${drawGhibliCloud(780, 190, 0.85)}

  <!-- KAP (Pipa Colorida / Sèvolan Haitiano Voando Alto no Céu) -->
  <g transform="translate(680, 190) rotate(15)" filter="url(#dropShadow)">
    <!-- Kite String -->
    <path d="M0,0 Q-120,180 -240,420" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 2" fill="none"/>
    
    <!-- Diamond Kite Frame -->
    <polygon points="0,-75 55,0 0,65 -55,0" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
    <!-- Colorful geometric quadrants -->
    <polygon points="0,-75 55,0 0,0" fill="#ef4444"/>
    <polygon points="0,-75 -55,0 0,0" fill="#3b82f6"/>
    <polygon points="0,65 55,0 0,0" fill="#10b981"/>
    <polygon points="0,65 -55,0 0,0" fill="#f59e0b"/>
    <!-- Wooden cross spars -->
    <line x1="0" y1="-75" x2="0" y2="65" stroke="#543317" stroke-width="3"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#543317" stroke-width="3"/>

    <!-- Fluttering Paper Tail Ribbon with Tassels -->
    <path d="M0,65 Q30,120 -20,170 T30,240 T-15,310" stroke="#f43f5e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <polygon points="12,105 28,112 18,125" fill="#38bdf8"/>
    <polygon points="-8,155 -24,162 -14,175" fill="#facc15"/>
    <polygon points="18,225 34,232 24,245" fill="#a855f7"/>
  </g>

  <!-- Distant Rolling Green Hills -->
  <path d="M-50,510 Q280,440 600,490 T1250,470 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
  <path d="M-30,570 Q300,510 650,560 T1250,530 L1250,800 L-30,800 Z" fill="url(#hillMid)"/>

  <!-- PYEBWA (Árvore Frondosa de Piquenique) on the right -->
  <g transform="translate(980, 680)" filter="url(#dropShadow)">
    <path d="M-25,0 Q-45,-120 -15,-260 Q20,-120 25,0 Z" fill="url(#woodTone)"/>
    <ellipse cx="0" cy="-300" rx="140" ry="120" fill="#15803d"/>
    <ellipse cx="-60" cy="-280" rx="110" ry="95" fill="#16a34a"/>
    <ellipse cx="60" cy="-280" rx="110" ry="95" fill="#22c55e"/>
    <ellipse cx="0" cy="-340" rx="90" ry="75" fill="#4ade80" opacity="0.8"/>
  </g>

  <!-- BISIKLÈT (Bicicleta Vintage com Cesta de Flores Encostada na Árvore) -->
  <g transform="translate(860, 630)" filter="url(#dropShadow)">
    <!-- Shadow -->
    <ellipse cx="0" cy="48" rx="85" ry="14" fill="#000000" opacity="0.35"/>
    
    <!-- Rear Wheel -->
    <circle cx="-65" cy="15" r="34" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="-65" cy="15" r="5" fill="#64748b"/>
    ${[0, 45, 90, 135].map(deg => `<line x1="-65" y1="-19" x2="-65" y2="49" stroke="#94a3b8" stroke-width="1.5" transform="rotate(${deg} -65 15)"/>`).join("")}

    <!-- Front Wheel -->
    <circle cx="65" cy="15" r="34" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="65" cy="15" r="5" fill="#64748b"/>
    ${[0, 45, 90, 135].map(deg => `<line x1="65" y1="-19" x2="65" y2="49" stroke="#94a3b8" stroke-width="1.5" transform="rotate(${deg} 65 15)"/>`).join("")}

    <!-- Teal Bicycle Frame Tubes -->
    <line x1="-65" y1="15" x2="-15" y2="15" stroke="#0d9488" stroke-width="5" stroke-linecap="round"/>
    <line x1="-15" y1="15" x2="-28" y2="-25" stroke="#0d9488" stroke-width="5" stroke-linecap="round"/>
    <line x1="-65" y1="15" x2="-28" y2="-25" stroke="#0d9488" stroke-width="5" stroke-linecap="round"/>
    <line x1="-28" y1="-25" x2="45" y2="-20" stroke="#0d9488" stroke-width="5" stroke-linecap="round"/>
    <line x1="-15" y1="15" x2="48" y2="-25" stroke="#0d9488" stroke-width="5" stroke-linecap="round"/>
    <line x1="65" y1="15" x2="48" y2="-45" stroke="#0d9488" stroke-width="5" stroke-linecap="round"/>

    <!-- Leather Spring Saddle -->
    <path d="M-38,-28 Q-28,-36 -16,-28 Q-26,-24 -38,-28 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Handlebars -->
    <path d="M46,-45 Q58,-58 70,-45" stroke="#94a3b8" stroke-width="4" fill="none" stroke-linecap="round"/>
    
    <!-- Wicker Handlebar Basket with Wildflowers -->
    <rect x="52" y="-45" width="28" height="20" rx="3" fill="#d97706" stroke="#78350f" stroke-width="2"/>
    <circle cx="58" cy="-48" r="6" fill="#f43f5e"/>
    <circle cx="68" cy="-49" r="6" fill="#facc15"/>
    <circle cx="76" cy="-47" r="5" fill="#38bdf8"/>
  </g>

  <!-- Rolling Meadow Foreground -->
  <path d="M-50,660 Q320,610 650,650 T1250,640 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- DRA (Toalha Quadriculada de Piquenique com Cesta na Grama) -->
  <g transform="translate(420, 680)" filter="url(#dropShadow)">
    <!-- Red & White Gingham Checkered Blanket -->
    <polygon points="-120,40 120,40 90,-25 -90,-25" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    ${[-90, -50, -10, 30, 70].map(x => `<line x1="${x}" y1="-25" x2="${x*1.2}" y2="40" stroke="#ef4444" stroke-width="12" opacity="0.65"/>`).join("")}
    ${[-15, 0, 15, 30].map(y => `<line x1="-110" y1="${y}" x2="110" y2="${y}" stroke="#ef4444" stroke-width="10" opacity="0.65"/>`).join("")}

    <!-- Wicker Picnic Hamper Basket on blanket -->
    <g transform="translate(-30, -5)">
      <rect x="-35" y="-20" width="70" height="40" rx="5" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <line x1="-35" y1="-2" x2="35" y2="-2" stroke="#451a03" stroke-width="2.5"/>
      <path d="M-15,-20 Q0,-40 15,-20" stroke="#78350f" stroke-width="3" fill="none"/>
    </g>

    <!-- Bowl of fresh red apples/strawberries -->
    <g transform="translate(40, 10)">
      <ellipse cx="0" cy="5" rx="20" ry="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="-6" cy="0" r="7" fill="#dc2626"/>
      <circle cx="6" cy="0" r="7" fill="#dc2626"/>
      <circle cx="0" cy="-6" r="7" fill="#ef4444"/>
    </g>
  </g>
</svg>`;
}

export function renderEstoicismo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pórtico de pedra e oliveiras - Sajès</title>
  <desc>Ghibli anime art: Colunas clássicas, filósofo sábio, oliveiras e livro aberto.</desc>
  ${getGhibliDefs()}
  
  <!-- Warm Contemplative Sunset Sky -->
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(850, 240, 52, true)}
  ${drawGhibliCloud(240, 170, 0.95, true)}
  ${drawGhibliCloud(980, 180, 0.85, true)}

  <!-- Tranquil Distant Sea & Horizon Islands -->
  <path d="M-50,510 L1250,510 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
  <ellipse cx="600" cy="520" rx="350" ry="15" fill="#fde047" opacity="0.4" filter="url(#softGlow)"/> <!-- Sunset path on water -->

  <!-- PYE OLIV (Oliveiras Centenárias com Folhagem Prateada) on left -->
  <g transform="translate(180, 560)" filter="url(#dropShadow)">
    <path d="M-18,0 Q-35,-110 -12,-220 Q15,-110 18,0 Z" fill="url(#woodTone)"/>
    <!-- Twisted gnarled olive branches -->
    <ellipse cx="0" cy="-250" rx="100" ry="85" fill="#3f6212"/>
    <ellipse cx="-45" cy="-230" rx="80" ry="70" fill="#4d7c0f"/>
    <ellipse cx="45" cy="-230" rx="80" ry="70" fill="#65a30d"/>
    <ellipse cx="0" cy="-290" rx="70" ry="60" fill="#84cc16" opacity="0.8"/>
    <!-- Small dark olives -->
    <circle cx="-30" cy="-240" r="5" fill="#1e293b"/>
    <circle cx="20" cy="-260" r="5" fill="#1e293b"/>
    <circle cx="40" cy="-220" r="5" fill="#1e293b"/>
  </g>

  <!-- KOLÒN (Colunas Clássicas de Mármore e Pórtico de Pedra) on right terrace -->
  <g transform="translate(760, 480)" filter="url(#dropShadow)">
    <!-- Entablature / Architrave beam on top -->
    <rect x="-80" y="-240" width="460" height="35" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="3"/>
    
    <!-- Column 1 -->
    <g transform="translate(0, 0)">
      <!-- Capital -->
      <rect x="-24" y="-205" width="48" height="15" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/>
      <!-- Fluted Column Shaft -->
      <rect x="-18" y="-190" width="36" height="230" fill="#e7e5e4" stroke="#44403c" stroke-width="2.5"/>
      <line x1="-8" y1="-190" x2="-8" y2="40" stroke="#a8a29e" stroke-width="2"/>
      <line x1="8" y1="-190" x2="8" y2="40" stroke="#a8a29e" stroke-width="2"/>
      <!-- Base -->
      <rect x="-24" y="40" width="48" height="18" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/>
    </g>

    <!-- Column 2 -->
    <g transform="translate(140, 0)">
      <rect x="-24" y="-205" width="48" height="15" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/>
      <rect x="-18" y="-190" width="36" height="230" fill="#e7e5e4" stroke="#44403c" stroke-width="2.5"/>
      <line x1="-8" y1="-190" x2="-8" y2="40" stroke="#a8a29e" stroke-width="2"/>
      <line x1="8" y1="-190" x2="8" y2="40" stroke="#a8a29e" stroke-width="2"/>
      <rect x="-24" y="40" width="48" height="18" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/>
    </g>

    <!-- Column 3 -->
    <g transform="translate(280, 0)">
      <rect x="-24" y="-205" width="48" height="15" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/>
      <rect x="-18" y="-190" width="36" height="230" fill="#e7e5e4" stroke="#44403c" stroke-width="2.5"/>
      <line x1="-8" y1="-190" x2="-8" y2="40" stroke="#a8a29e" stroke-width="2"/>
      <line x1="8" y1="-190" x2="8" y2="40" stroke="#a8a29e" stroke-width="2"/>
      <rect x="-24" y="40" width="48" height="18" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/>
    </g>
  </g>

  <!-- Stone Terrace Platform -->
  <path d="M-50,620 L1250,620 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
  <rect x="0" y="620" width="1200" height="20" fill="#57534e"/>

  <!-- MOUN SAJ (Filósofo Sábio Estoico em Túnica Branca e Contemplação Serena) -->
  <g transform="translate(560, 610)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="15" rx="35" ry="10" fill="#000000" opacity="0.35"/>
    
    <!-- Flowing Classical Linen Robes (Himation) -->
    <path d="M-18,-70 
      C-30,-20 -40,30 -25,12 
      L25,12 
      C40,30 30,-20 18,-70 Z" 
      fill="#f5f5f4" stroke="#d6d3d1" stroke-width="2"/>
    <!-- Draped fabric folds -->
    <path d="M-15,-60 Q0,-30 18,-50" stroke="#a8a29e" stroke-width="3" fill="none"/>
    <path d="M-22,-30 Q0,0 20,-20" stroke="#a8a29e" stroke-width="3" fill="none"/>
    
    <!-- Head with thoughtful profile and wise beard -->
    <circle cx="0" cy="-90" r="14" fill="#d7a179"/>
    <!-- Silver/grey hair and beard -->
    <path d="M-12,-95 Q0,-112 14,-95 Q18,-80 8,-75 Q0,-65 -8,-75 Z" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1.5"/>
    <!-- Serene gaze toward sunset -->
  </g>

  <!-- LIV (Livro / Manuscrito Aberto sobre Pedestal de Pedra em Destaque) -->
  <g transform="translate(380, 640)" filter="url(#dropShadow)">
    <!-- Carved Stone Lectern -->
    <polygon points="-40,40 40,40 25,-20 -25,-20" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2.5"/>
    <rect x="-35" y="-30" width="70" height="12" rx="2" fill="#78716c"/>
    
    <!-- Open Bound Leather Book -->
    <!-- Leather cover backing -->
    <path d="M-48,-32 L0,-24 L48,-32 L52,-60 L0,-52 L-52,-60 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Left open page -->
    <polygon points="-46,-34 -2,-26 -2,-54 -48,-58" fill="#fffbeb" stroke="#d6d3d1" stroke-width="1.5"/>
    <!-- Right open page -->
    <polygon points="2,-26 46,-34 48,-58 2,-54" fill="#fef3c7" stroke="#d6d3d1" stroke-width="1.5"/>
    <!-- Text lines in book -->
    <line x1="-38" y1="-50" x2="-8" y2="-47" stroke="#78350f" stroke-width="1.5"/>
    <line x1="-38" y1="-44" x2="-8" y2="-41" stroke="#78350f" stroke-width="1.5"/>
    <line x1="-38" y1="-38" x2="-14" y2="-35" stroke="#78350f" stroke-width="1.5"/>
    
    <line x1="8" y1="-47" x2="38" y2="-50" stroke="#78350f" stroke-width="1.5"/>
    <line x1="8" y1="-41" x2="38" y2="-44" stroke="#78350f" stroke-width="1.5"/>
    <line x1="8" y1="-35" x2="32" y2="-38" stroke="#78350f" stroke-width="1.5"/>
    <!-- Red ribbon bookmark -->
    <path d="M0,-24 Q6,-10 4,8" stroke="#dc2626" stroke-width="3" fill="none"/>
  </g>
</svg>`;
}

export function renderReligiao() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Capela na colina e luz sagrada - Relijyon</title>
  <desc>Ghibli anime art: Capela de pedra com cruz, pombas brancas, velas acesas e luz divina.</desc>
  ${getGhibliDefs()}
  
  <!-- Sacred Morning Blue Sky with Divine Sunbeams -->
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 160, 56)}
  ${drawGhibliCloud(200, 140, 1.0)}
  ${drawGhibliCloud(980, 160, 0.9)}

  <!-- Celestial Sunbeams (God Rays) breaking through clouds -->
  <polygon points="600,160 100,800 350,800" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="600,160 480,800 720,800" fill="#fef08a" opacity="0.22" filter="url(#softGlow)"/>
  <polygon points="600,160 850,800 1100,800" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>

  <!-- Distant Hilltops -->
  <path d="M-50,520 Q320,440 680,490 T1250,470 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.65"/>
  <path d="M-30,580 Q280,510 600,560 T1250,530 L1250,800 L-30,800 Z" fill="url(#hillMid)"/>

  <!-- LEGLIZ (Capela Histórica de Pedra Branca no Alto da Colina) -->
  <g transform="translate(600, 550)" filter="url(#dropShadow)">
    <!-- Whitewashed stone chapel body -->
    <rect x="-140" y="-140" width="280" height="140" fill="#fafaf9" stroke="#78716c" stroke-width="3"/>
    
    <!-- Terracotta Tiled Roof -->
    <polygon points="-165,-140 0,-240 165,-140" fill="#b45309" stroke="#78350f" stroke-width="3"/>

    <!-- Central Stone Bell Tower Spire -->
    <rect x="-35" y="-310" width="70" height="90" fill="#fafaf9" stroke="#78716c" stroke-width="3"/>
    <!-- Belfry Arch & Bell -->
    <path d="M-18,-240 L-18,-275 Q0,-295 18,-275 L18,-240 Z" fill="#292524"/>
    <ellipse cx="0" cy="-260" rx="10" ry="12" fill="#d97706"/> <!-- Bronze Bell -->

    <!-- Pyramidal Tower Spire -->
    <polygon points="-42,-310 0,-390 42,-310" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>

    <!-- KWA (Cruz de Madeira / Ouro no Topo do Campanário) -->
    <g transform="translate(0, -390)">
      <line x1="0" y1="0" x2="0" y2="-45" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
      <line x1="-16" y1="-32" x2="16" y2="-32" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
      <!-- Soft sacred glow -->
      <circle cx="0" cy="-32" r="16" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    </g>

    <!-- Arched Wooden Chapel Door -->
    <path d="M-28,0 L-28,-75 Q0,-105 28,-75 L28,0 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <circle cx="16" cy="-38" r="3.5" fill="#facc15"/>

    <!-- Stained Glass Windows with Warm Radiant Light -->
    <g transform="translate(-85, -90)">
      <path d="M-16,35 L-16,-10 Q0,-28 16,-10 L16,35 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
      <path d="M-16,35 L-16,10 Q0,2 16,10 L16,35 Z" fill="#f43f5e"/>
      <circle cx="0" cy="-2" r="6" fill="#facc15"/>
    </g>
    <g transform="translate(85, -90)">
      <path d="M-16,35 L-16,-10 Q0,-28 16,-10 L16,35 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
      <path d="M-16,35 L-16,10 Q0,2 16,10 L16,35 Z" fill="#f43f5e"/>
      <circle cx="0" cy="-2" r="6" fill="#facc15"/>
    </g>
  </g>

  <!-- PIJON (Pombas Brancas da Paz Voando em Direção à Luz Divina) -->
  <g transform="translate(360, 280) scale(1.1)" filter="url(#softGlow)">
    <path d="M0,0 Q-15,-30 20,-35 Q30,-15 15,0" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <path d="M0,0 Q-15,30 20,35 Q30,15 15,0" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <ellipse cx="10" cy="0" rx="18" ry="6" fill="#ffffff"/>
    <circle cx="24" cy="0" r="4" fill="#ffffff"/>
    <polygon points="28,-1 36,0 28,1" fill="#f59e0b"/>
  </g>
  <g transform="translate(840, 240) scale(0.9)" filter="url(#softGlow)">
    <path d="M0,0 Q-15,-30 20,-35 Q30,-15 15,0" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <path d="M0,0 Q-15,30 20,35 Q30,15 15,0" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <ellipse cx="10" cy="0" rx="18" ry="6" fill="#ffffff"/>
    <circle cx="24" cy="0" r="4" fill="#ffffff"/>
    <polygon points="28,-1 36,0 28,1" fill="#f59e0b"/>
  </g>

  <!-- Grassy Hillside with Stone Pathway -->
  <path d="M-50,660 Q320,600 650,650 T1250,630 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- BOUJI (Velas / Lanternas com Chamas Acolhedoras) in foreground garden altar -->
  <g transform="translate(360, 680)" filter="url(#dropShadow)">
    <rect x="-40" y="30" width="80" height="40" rx="4" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    
    <!-- Candle 1 -->
    <rect x="-24" y="-10" width="16" height="40" rx="2" fill="#fffbeb" stroke="#d6d3d1" stroke-width="1.5"/>
    <line x1="-16" y1="-10" x2="-16" y2="-18" stroke="#1c1917" stroke-width="2"/>
    <circle cx="-16" cy="-24" r="16" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="-16" cy="-24" rx="4" ry="8" fill="#f59e0b"/>
    <ellipse cx="-16" cy="-22" rx="2" ry="4" fill="#ffffff"/>

    <!-- Candle 2 (Taller) -->
    <rect x="8" y="-25" width="18" height="55" rx="2" fill="#fffbeb" stroke="#d6d3d1" stroke-width="1.5"/>
    <line x1="17" y1="-25" x2="17" y2="-34" stroke="#1c1917" stroke-width="2"/>
    <circle cx="17" cy="-40" r="18" fill="#fef08a" opacity="0.4" filter="url(#softGlow)"/>
    <ellipse cx="17" cy="-40" rx="5" ry="9" fill="#f59e0b"/>
    <ellipse cx="17" cy="-38" rx="2.5" ry="5" fill="#ffffff"/>
  </g>
</svg>`;
}

export function renderGastronomia() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cozinha aconchegante - Manje</title>
  <desc>Ghibli anime art: Panela fumegante no fogo, pães rústicos, frutas tropicais e pimentas.</desc>
  ${getGhibliDefs()}
  
  <!-- Warm Cozy Kitchen Interior Wall (Ghibli Rustic Hearth) -->
  <rect width="1200" height="800" fill="#f5ece0" filter="url(#ghibliPaper)" />
  
  <!-- Kitchen Window on left looking out onto green courtyard -->
  <g transform="translate(180, 220)">
    <rect x="-100" y="-120" width="200" height="220" rx="8" fill="#bae6fd" stroke="#78350f" stroke-width="8"/>
    <!-- Window frame panes -->
    <line x1="0" y1="-120" x2="0" y2="100" stroke="#78350f" stroke-width="6"/>
    <line x1="-100" y1="-10" x2="100" y2="-10" stroke="#78350f" stroke-width="6"/>
    <!-- Green hills & warm sun seen outside -->
    <circle cx="40" cy="-60" r="30" fill="#fef08a"/>
    <ellipse cx="0" cy="80" rx="100" ry="40" fill="#22c55e"/>
  </g>

  <!-- PIMAN (Pimentas Vermelhas e Coloridas / Piman Bouk Penduradas na Parede) -->
  <g transform="translate(420, 220)" filter="url(#dropShadow)">
    <path d="M0,0 Q-10,80 0,160" stroke="#78350f" stroke-width="2.5" fill="none"/>
    <!-- Red Peppers -->
    ${[
      { y: 25, c: "#dc2626" },
      { y: 55, c: "#f97316" },
      { y: 85, c: "#dc2626" },
      { y: 115, c: "#facc15" },
      { y: 145, c: "#dc2626" }
    ].map((p, i) => `
      <g transform="translate(${i % 2 === 0 ? -12 : 12}, ${p.y}) rotate(${i % 2 === 0 ? -25 : 25})">
        <path d="M0,0 Q-12,18 0,36 Q12,18 0,0 Z" fill="${p.c}" stroke="#991b1b" stroke-width="1.5"/>
        <line x1="0" y1="0" x2="0" y2="-8" stroke="#15803d" stroke-width="2.5"/>
      </g>
    `).join("")}
  </g>

  <!-- Hanging Copper Cooking Ladles and Utensils -->
  <g transform="translate(680, 200)">
    <rect x="-80" y="-10" width="160" height="8" rx="2" fill="#78350f"/>
    <!-- Ladle -->
    <line x1="-50" y1="-5" x2="-50" y2="70" stroke="#d97706" stroke-width="3"/>
    <circle cx="-50" cy="80" r="14" fill="#b45309"/>
    <!-- Spoon -->
    <line x1="0" y1="-5" x2="0" y2="70" stroke="#78350f" stroke-width="4"/>
    <ellipse cx="0" cy="80" rx="10" ry="16" fill="#78350f"/>
    <!-- Whisk -->
    <line x1="50" y1="-5" x2="50" y2="60" stroke="#94a3b8" stroke-width="3"/>
    <ellipse cx="50" cy="75" rx="8" ry="14" fill="none" stroke="#94a3b8" stroke-width="2"/>
  </g>

  <!-- Brick Hearth / Stove on right -->
  <g transform="translate(940, 520)" filter="url(#dropShadow)">
    <rect x="-140" y="-120" width="280" height="200" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3"/>
    <rect x="-150" y="-135" width="300" height="25" fill="#44403c"/>
    <!-- Hearth Opening with Glowing Fire -->
    <path d="M-80,60 L-80,-20 Q0,-60 80,-20 L80,60 Z" fill="#1c1917"/>
    <!-- Fire logs and flames -->
    <circle cx="0" cy="20" r="38" fill="#f59e0b" opacity="0.4" filter="url(#softGlow)"/>
    <polygon points="-30,30 0,-15 30,30" fill="#ea580c"/>
    <polygon points="-15,30 0,0 15,30" fill="#fde047"/>

    <!-- CHODYÈ (Tradicional Caldeirão / Panela de Ferro Preta Haitiana Fervendo) -->
    <g transform="translate(0, -135)">
      <!-- Cast iron pot body -->
      <ellipse cx="0" cy="-35" rx="55" ry="38" fill="#1c1917" stroke="#0c0a09" stroke-width="3"/>
      <!-- Pot rim & lid opening -->
      <ellipse cx="0" cy="-60" rx="46" ry="14" fill="#292524" stroke="#0c0a09" stroke-width="2.5"/>
      <ellipse cx="0" cy="-60" rx="42" ry="11" fill="#b45309"/> <!-- Delicious simmering stew soup -->

      <!-- Pot Handles -->
      <path d="M-55,-40 Q-70,-40 -55,-25" stroke="#44403c" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M55,-40 Q70,-40 55,-25" stroke="#44403c" stroke-width="5" fill="none" stroke-linecap="round"/>

      <!-- Rising Fragrant Steam Clouds (Ghibli Food Steam) -->
      <path d="M-15,-75 Q-30,-115 -10,-145 T-20,-190" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.5" filter="url(#softGlow)"/>
      <path d="M15,-75 Q30,-115 10,-145 T20,-190" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.5" filter="url(#softGlow)"/>
      <path d="M0,-85 Q-15,-125 15,-165 T-5,-210" stroke="#ffffff" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.6" filter="url(#softGlow)"/>
    </g>
  </g>

  <!-- Large Solid Oak Kitchen Prep Table in Foreground -->
  <g transform="translate(380, 640)" filter="url(#dropShadow)">
    <rect x="-320" y="-30" width="640" height="35" rx="5" fill="url(#woodTone)" stroke="#451a03" stroke-width="3"/>
    <rect x="-290" y="5" width="28" height="150" fill="#543317"/>
    <rect x="262" y="5" width="28" height="150" fill="#543317"/>

    <!-- PEN (Pães Rústicos Dourados Recém-Saídos do Forno) -->
    <g transform="translate(-180, -35)">
      <!-- Wooden cutting board -->
      <polygon points="-80,0 80,0 70,-18 -70,-18" fill="#d97706" stroke="#92400e" stroke-width="2"/>
      
      <!-- Crusty Round Country Boule Bread -->
      <ellipse cx="-30" cy="-22" rx="38" ry="24" fill="#d97706" stroke="#78350f" stroke-width="2.5"/>
      <ellipse cx="-30" cy="-26" rx="32" ry="18" fill="#f59e0b"/>
      <!-- Slashed crust markings -->
      <path d="M-45,-26 Q-30,-34 -15,-26" stroke="#78350f" stroke-width="3" fill="none"/>
      <path d="M-30,-38 Q-30,-26 -30,-14" stroke="#78350f" stroke-width="3" fill="none"/>

      <!-- Baguette Loaf alongside -->
      <ellipse cx="35" cy="-16" rx="42" ry="15" fill="#d97706" stroke="#78350f" stroke-width="2.5" transform="rotate(-15 35 -16)"/>
      <line x1="15" y1="-22" x2="22" y2="-12" stroke="#78350f" stroke-width="2.5"/>
      <line x1="32" y1="-26" x2="39" y2="-16" stroke="#78350f" stroke-width="2.5"/>
      <line x1="48" y1="-30" x2="55" y2="-20" stroke="#78350f" stroke-width="2.5"/>
    </g>

    <!-- FWI (Frutas Tropicais Frescas em Cesta Trançada) -->
    <g transform="translate(100, -35)">
      <!-- Woven Basket -->
      <ellipse cx="0" cy="5" rx="65" ry="18" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
      
      <!-- Tropical Fruits in basket -->
      <!-- Ripe Mango (Red-Orange) -->
      <ellipse cx="-28" cy="-14" rx="20" ry="15" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(-20 -28 -14)"/>
      <ellipse cx="-24" cy="-18" rx="14" ry="10" fill="#fde047" opacity="0.8"/>
      
      <!-- Bananas / Plantains -->
      <path d="M-10,-5 Q20,-30 45,-5" stroke="#facc15" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M-6,2 Q24,-22 48,2" stroke="#eab308" stroke-width="10" stroke-linecap="round" fill="none"/>

      <!-- Fresh Coconut Halved -->
      <circle cx="28" cy="-16" r="16" fill="#78350f" stroke="#451a03" stroke-width="2"/>
      <circle cx="28" cy="-16" r="11" fill="#ffffff"/> <!-- White coconut meat -->

      <!-- Fresh Green Lime -->
      <circle cx="-5" cy="-8" r="11" fill="#84cc16" stroke="#4d7c0f" stroke-width="1.5"/>
    </g>
  </g>
</svg>`;
}

