import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderTecnologia as renderTecnologia01 } from "./master-scenes-1.mjs";

// Scene 1 is the master "Oficina tecnológica no campo"
export { renderTecnologia01 };

// Scene 2: "Laboratório de robótica" (Setting: lab, dia, objects: robot, monitor, lab, phone)
export function renderTecnologia02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Laboratório de robótica - Teknoloji</title>
  <desc>Ghibli anime art: Laboratório de robótica com robô, telas, bancada e comunicador.</desc>
  ${getGhibliDefs()}
  
  <!-- Laboratory Room Wall with Large Window -->
  <rect width="1200" height="800" fill="#f1f5f9" filter="url(#ghibliPaper)" />
  
  <!-- Large Arched Window showing sunny green hills outside -->
  <g transform="translate(600, 260)">
    <rect x="-350" y="-190" width="700" height="290" rx="16" fill="url(#skyDay)" stroke="#475569" stroke-width="8"/>
    <!-- Distant hills seen through window -->
    <path d="M-350,100 Q-100,-20 150,50 T350,20 L350,100 L-350,100 Z" fill="url(#hillMid)"/>
    <circle cx="220" cy="-60" r="38" fill="url(#sunGlowDay)"/>
    <!-- Window mullions -->
    <line x1="0" y1="-190" x2="0" y2="100" stroke="#475569" stroke-width="6"/>
    <line x1="-350" y1="-50" x2="350" y2="-50" stroke="#475569" stroke-width="6"/>
  </g>

  <!-- LAB (Bancadas Científicas, Prateleiras com Ferramentas e Peças) -->
  <!-- Upper shelf with electronic parts & beakers -->
  <rect x="80" y="80" width="1040" height="18" fill="url(#woodTone)" stroke="#3e2515" stroke-width="2"/>
  <circle cx="150" cy="55" r="16" fill="#38bdf8" opacity="0.8"/> <!-- Blue glass beaker -->
  <polygon points="140,55 160,55 154,30 146,30" fill="#38bdf8" opacity="0.8"/>
  <rect x="220" y="40" width="34" height="40" rx="4" fill="#a855f7" opacity="0.8"/>
  <rect x="940" y="42" width="65" height="38" rx="4" fill="#334155"/> <!-- Tool kit box -->

  <!-- High-tech Wooden & Steel Laboratory Workbench -->
  <rect x="0" y="480" width="1200" height="40" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
  <rect x="0" y="520" width="1200" height="280" fill="#334155"/>
  ${[100, 400, 800, 1100].map(x => `<rect x="${x}" y="520" width="24" height="280" fill="#1e293b"/>`).join("")}

  <!-- EKRAN / MONITOR (Telas Digitais Múltiplas com Gráficos e Dados de Robótica) -->
  <g transform="translate(320, 360)" filter="url(#dropShadow)">
    <!-- Monitor 1 (Main Big Curved Display) -->
    <rect x="-140" y="-120" width="280" height="190" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
    <rect x="-130" y="-110" width="260" height="170" rx="6" fill="#0f172a"/>
    <!-- Blue/Cyan Schematic Diagram of a Robot on Screen -->
    <circle cx="-50" cy="-35" r="26" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
    <rect x="-68" y="0" width="36" height="45" rx="6" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <text x="0" y="-70" font-family="monospace" font-size="12" font-weight="bold" fill="#34d399">> SISTÈM ROBO</text>
    <text x="0" y="-50" font-family="monospace" font-size="11" fill="#38bdf8">> Batri: 98%</text>
    <text x="0" y="-30" font-family="monospace" font-size="11" fill="#38bdf8">> Motè: OK</text>
    <text x="0" y="-10" font-family="monospace" font-size="11" fill="#facc15">> Kòd Kreyòl: Aktif</text>
    <!-- Screen waveform -->
    <path d="M0,25 Q30,5 60,35 T120,20" stroke="#4ade80" stroke-width="2.5" fill="none"/>
    <!-- Monitor Stand -->
    <rect x="-18" y="70" width="36" height="50" fill="#475569"/>
    <rect x="-45" y="115" width="90" height="10" rx="3" fill="#64748b"/>
  </g>

  <!-- ROBO (Robô Assistente Humanoide Gentil no Laboratório) -->
  <g transform="translate(740, 390)" filter="url(#dropShadow)">
    <!-- Shadow -->
    <ellipse cx="0" cy="190" rx="65" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Robot Legs -->
    <rect x="-35" y="110" width="26" height="85" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
    <rect x="10" y="110" width="26" height="85" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
    <!-- Ceramic & Chrome Torso -->
    <rect x="-55" y="5" width="110" height="115" rx="30" fill="#ffffff" stroke="#94a3b8" stroke-width="3.5"/>
    <circle cx="0" cy="55" r="22" fill="#0284c7" opacity="0.85"/>
    <circle cx="0" cy="55" r="14" fill="#38bdf8"/>
    <!-- Head with Visor Screen -->
    <rect x="-42" y="-65" width="84" height="65" rx="20" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
    <rect x="-32" y="-55" width="64" height="42" rx="12" fill="#0f172a"/>
    <!-- Friendly Glowing Eyes on Visor -->
    <ellipse cx="-14" cy="-35" rx="8" ry="10" fill="#38bdf8"/>
    <ellipse cx="14" cy="-35" rx="8" ry="10" fill="#38bdf8"/>
    <!-- Jointed Arms holding a digital tablet -->
    <path d="M-55,25 Q-85,60 -60,95 Q-40,95 -25,85" stroke="#94a3b8" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M55,25 Q85,60 60,95 Q40,95 25,85" stroke="#94a3b8" stroke-width="12" fill="none" stroke-linecap="round"/>
  </g>

  <!-- TELEFÒN (Smartphone / Comunicador Móvel sobre a Bancada) -->
  <g transform="translate(520, 490)" filter="url(#dropShadow)">
    <rect x="0" y="0" width="55" height="95" rx="8" fill="#0f172a" stroke="#cbd5e1" stroke-width="2.5"/>
    <rect x="4" y="6" width="47" height="83" rx="4" fill="#1e293b"/>
    <!-- Screen call/signal icon -->
    <circle cx="27" cy="35" r="14" fill="#22c55e"/>
    <text x="27" y="65" font-family="sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">KONEKTE</text>
  </g>
</svg>`;
}

// Scene 3: "Parque de energia solar" (Setting: hill, entardecer, objects: solar, turbine, computer, drone)
export function renderTecnologia03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Parque de energia solar - Teknoloji</title>
  <desc>Ghibli anime art: Painéis solares na colina, moinho de vento, computador e drone.</desc>
  ${getGhibliDefs()}
  
  <!-- Sunset Golden Sky -->
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(300, 260, 52, true)}
  ${drawGhibliCloud(760, 160, 0.9, true)}
  ${drawGhibliCloud(1060, 120, 0.75, true)}

  <!-- Distant Mountains -->
  <path d="M-50,500 Q300,430 650,480 T1250,460 L1250,800 L-50,800 Z" fill="#6a3e5c" opacity="0.6"/>

  <!-- MOULEN VAN (Turbina / Moinho de Vento Moderno na Colina de Trás) -->
  <g transform="translate(920, 380)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="180" stroke="#cbd5e1" stroke-width="7"/>
    <circle cx="0" cy="0" r="12" fill="#475569"/>
    <!-- Spinning 3 blades -->
    <polygon points="0,0 -8,-110 8,-110" fill="#f8fafc"/>
    <polygon points="0,0 95,55 85,70" fill="#f8fafc"/>
    <polygon points="0,0 -95,55 -85,70" fill="#f8fafc"/>
  </g>

  <!-- Green Rolling Hills in Foreground -->
  <path d="M-50,560 Q320,490 680,540 T1250,510 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,640 Q280,580 620,630 T1250,610 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- DRÒN (Drone de Monitoramento Agrícola e Solar Voando) -->
  <g transform="translate(420, 240)" filter="url(#dropShadow)">
    <line x1="-40" y1="-18" x2="40" y2="18" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
    <line x1="-40" y1="18" x2="40" y2="-18" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
    <rect x="-18" y="-14" width="36" height="28" rx="8" fill="#eab308" stroke="#854d0e" stroke-width="2"/>
    <!-- Rotors -->
    <ellipse cx="-40" cy="-18" rx="24" ry="6" fill="#e2e8f0" opacity="0.7"/>
    <ellipse cx="40" cy="-18" rx="24" ry="6" fill="#e2e8f0" opacity="0.7"/>
    <ellipse cx="-40" cy="18" rx="24" ry="6" fill="#e2e8f0" opacity="0.7"/>
    <ellipse cx="40" cy="18" rx="24" ry="6" fill="#e2e8f0" opacity="0.7"/>
    <circle cx="0" cy="10" r="5" fill="#38bdf8"/> <!-- Camera -->
  </g>

  <!-- PANNO SOLÈ (Painéis Solares Fotovoltaicos em Grande Destaque) -->
  <g transform="translate(680, 560)" filter="url(#dropShadow)">
    <!-- Panel 1 (Facing sun) -->
    <polygon points="-160,20 20,-30 60,70 -120,120" fill="#1e3a8a" stroke="#93c5fd" stroke-width="3"/>
    <!-- Solar grid lines -->
    <line x1="-115" y1="3" x2="-25" y2="103" stroke="#60a5fa" stroke-width="2"/>
    <line x1="-70" y1="-14" x2="20" y2="86" stroke="#60a5fa" stroke-width="2"/>
    <line x1="-140" y1="45" x2="40" y2="-5" stroke="#60a5fa" stroke-width="2"/>
    <line x1="-130" y1="70" x2="50" y2="20" stroke="#60a5fa" stroke-width="2"/>
    <!-- Stand -->
    <line x1="-50" y1="45" x2="-50" y2="150" stroke="#475569" stroke-width="8"/>
    
    <!-- Panel 2 (Side by side) -->
    <polygon points="50,-38 230,-90 270,10 90,60" fill="#1e3a8a" stroke="#93c5fd" stroke-width="3"/>
    <line x1="160" y1="-14" x2="160" y2="90" stroke="#475569" stroke-width="8"/>
  </g>

  <!-- ÒDINATÈ (Laptop / Computador de Campo do Engenheiro sobre Mesa de Trabalho) -->
  <g transform="translate(240, 630)" filter="url(#dropShadow)">
    <rect x="-50" y="30" width="100" height="15" rx="3" fill="url(#woodTone)"/>
    <rect x="-40" y="45" width="12" height="90" fill="#543317"/>
    <rect x="28" y="45" width="12" height="90" fill="#543317"/>
    <!-- Rugged Laptop Open -->
    <polygon points="-38,30 38,30 46,18 -30,18" fill="#334155" stroke="#0f172a" stroke-width="2"/>
    <polygon points="-30,18 46,18 42,-45 -34,-45" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <!-- Screen with solar telemetry graph -->
    <rect x="-30" y="-40" width="68" height="52" fill="#0f172a"/>
    <path d="M-26,-10 Q-10,-35 8,-15 T32,-30" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    <text x="-25" y="-28" font-family="monospace" font-size="8" fill="#facc15">SOLÈ: 4.8 kW</text>
  </g>
</svg>`;
}

// Scene 4: "Estação de satélites" (Setting: mountain, dia, objects: satellite, antenna, monitor, solar)
export function renderTecnologia04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Estação de satélites no alto da montanha - Teknoloji</title>
  <desc>Ghibli anime art: Antena parabólica de satélite, torre de comunicação, painel solar e monitores.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(220, 160, 48)}
  ${drawGhibliCloud(720, 140, 0.95)}
  ${drawGhibliCloud(1050, 190, 0.85)}

  <!-- High Mountain Ridge -->
  <polygon points="-50,480 320,240 680,480" fill="#5b7f95" opacity="0.6"/>
  <polygon points="500,480 840,210 1250,480" fill="#4a6e84" opacity="0.7"/>
  <path d="M-50,560 Q340,490 700,540 T1250,520 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- ANTÈN (Torre de Comunicações Treliçada de Aço com Baliza Vermelha) -->
  <g transform="translate(860, 200)" filter="url(#dropShadow)">
    <!-- Steel Lattice Mast -->
    <polygon points="-24,360 24,360 5,-60 -5,-60" fill="none" stroke="#64748b" stroke-width="4"/>
    ${[320, 260, 200, 140, 80, 20, -40].map(y => `
      <line x1="-18" y1="${y}" x2="18" y2="${y}" stroke="#64748b" stroke-width="3"/>
      <line x1="-18" y1="${y}" x2="18" y2="${y-60}" stroke="#64748b" stroke-width="2"/>
    `).join("")}
    <!-- Red Beacon Light at Top -->
    <circle cx="0" cy="-68" r="8" fill="#ef4444" filter="url(#softGlow)"/>
    <line x1="0" y1="-60" x2="0" y2="-90" stroke="#cbd5e1" stroke-width="3"/>
  </g>

  <!-- SATELIT (Grande Antena Parabólica Branca Apontada para o Espaço) -->
  <g transform="translate(480, 420)" filter="url(#dropShadow)">
    <!-- Base concrete and steel swivel mount -->
    <rect x="-40" y="90" width="80" height="70" fill="url(#stoneTone)" stroke="#334155" stroke-width="3"/>
    <line x1="0" y1="90" x2="0" y2="10" stroke="#475569" stroke-width="14"/>
    
    <!-- Dish Back Structure -->
    <ellipse cx="0" cy="-20" rx="130" ry="85" fill="#cbd5e1" stroke="#475569" stroke-width="3" transform="rotate(-30)"/>
    <!-- Inner Dish Reflector Face -->
    <ellipse cx="0" cy="-20" rx="120" ry="75" fill="#f8fafc" stroke="#64748b" stroke-width="2.5" transform="rotate(-30)"/>
    <!-- Feedhorn Subreflector tripod -->
    <line x1="-40" y1="-50" x2="30" y2="-95" stroke="#334155" stroke-width="4"/>
    <line x1="40" y1="10" x2="30" y2="-95" stroke="#334155" stroke-width="4"/>
    <circle cx="30" cy="-95" r="12" fill="#eab308"/>
  </g>

  <!-- PANNO SOLÈ (Painel Solar para Alimentar a Estação) -->
  <g transform="translate(240, 560)" filter="url(#dropShadow)">
    <polygon points="-70,0 70,-40 90,40 -50,80" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2.5"/>
    <line x1="10" y1="20" x2="10" y2="110" stroke="#475569" stroke-width="6"/>
  </g>

  <!-- EKRAN (Estação de Controle com Monitores de Rastreamento Satelital) -->
  <g transform="translate(680, 600)" filter="url(#dropShadow)">
    <rect x="-80" y="-70" width="160" height="95" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <rect x="-72" y="-62" width="144" height="78" rx="4" fill="#0f172a"/>
    <!-- Polar radar tracking circle -->
    <circle cx="-25" cy="-24" r="28" fill="none" stroke="#10b981" stroke-width="2"/>
    <circle cx="-25" cy="-24" r="16" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 2"/>
    <line x1="-25" y1="-52" x2="-25" y2="4" stroke="#10b981" stroke-width="1.5"/>
    <line x1="-53" y1="-24" x2="3" y2="-24" stroke="#10b981" stroke-width="1.5"/>
    <!-- Signal Blip -->
    <circle cx="-15" cy="-32" r="4" fill="#facc15" filter="url(#softGlow)"/>
    <text x="12" y="-35" font-family="monospace" font-size="9" fill="#38bdf8">SAT-1</text>
    <text x="12" y="-20" font-family="monospace" font-size="8" fill="#34d399">AZ: 142°</text>
    <text x="12" y="-6" font-family="monospace" font-size="8" fill="#34d399">EL: 48°</text>
  </g>
</svg>`;
}

// Scene 5: "Oficina de pequenos robôs" (Setting: workshop, entardecer, objects: robot, computer, phone, turbine)
export function renderTecnologia05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Oficina de pequenos robôs ao entardecer - Teknoloji</title>
  <desc>Ghibli anime art: Pequenos robôs em oficina de madeira, computador, comunicador e moinho ao longe.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="#f5ede2" filter="url(#ghibliPaper)" />
  
  <!-- Window overlooking sunset hill with windmill -->
  <g transform="translate(860, 240)">
    <rect x="-180" y="-130" width="360" height="260" rx="8" fill="url(#skySunset)" stroke="#5c381e" stroke-width="8"/>
    <!-- MOULEN VAN / TURBINE visible through window -->
    <g transform="translate(60, 20)">
      <line x1="0" y1="0" x2="0" y2="80" stroke="#4a301a" stroke-width="5"/>
      <circle cx="0" cy="0" r="7" fill="#78350f"/>
      <line x1="0" y1="0" x2="0" y2="-50" stroke="#78350f" stroke-width="3"/>
      <line x1="0" y1="0" x2="45" y2="25" stroke="#78350f" stroke-width="3"/>
      <line x1="0" y1="0" x2="-45" y2="25" stroke="#78350f" stroke-width="3"/>
    </g>
    <!-- Window panes -->
    <line x1="0" y1="-130" x2="0" y2="130" stroke="#5c381e" stroke-width="4"/>
    <line x1="-180" y1="0" x2="180" y2="0" stroke="#5c381e" stroke-width="4"/>
  </g>

  <!-- WORKSHOP WOODEN BENCH -->
  <rect x="0" y="470" width="1200" height="40" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
  <rect x="0" y="510" width="1200" height="290" fill="#543317"/>

  <!-- ROBO (Pequenos Robôs Brincalhões Steampunk sobre a Bancada) -->
  <!-- Robot 1 (Tall brass robot) -->
  <g transform="translate(360, 390)" filter="url(#dropShadow)">
    <rect x="-24" y="30" width="48" height="60" rx="16" fill="url(#brassTone)" stroke="#452a13" stroke-width="2"/>
    <circle cx="0" cy="5" r="20" fill="url(#brassTone)" stroke="#452a13" stroke-width="2"/>
    <circle cx="-6" cy="5" r="5" fill="#38bdf8"/>
    <circle cx="6" cy="5" r="5" fill="#38bdf8"/>
    <line x1="0" y1="-15" x2="0" y2="-30" stroke="#785315" stroke-width="3"/>
    <circle cx="0" cy="-33" r="5" fill="#ea580c"/>
    <path d="M-24,45 Q-45,65 -30,85" stroke="#785315" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M24,45 Q45,65 30,85" stroke="#785315" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>

  <!-- Robot 2 (Cute round companion robot) -->
  <g transform="translate(480, 420)" filter="url(#dropShadow)">
    <circle cx="0" cy="30" r="32" fill="#f8fafc" stroke="#475569" stroke-width="3"/>
    <ellipse cx="0" cy="22" rx="16" ry="12" fill="#0f172a"/>
    <circle cx="-5" cy="22" r="4" fill="#22c55e"/>
    <circle cx="5" cy="22" r="4" fill="#22c55e"/>
    <rect x="-18" y="62" width="12" height="18" rx="6" fill="#64748b"/>
    <rect x="6" y="62" width="12" height="18" rx="6" fill="#64748b"/>
  </g>

  <!-- ÒDINATÈ (Computador de Bancada com Teclado e Diagrama) -->
  <g transform="translate(180, 360)" filter="url(#dropShadow)">
    <rect x="-70" y="-60" width="140" height="110" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
    <rect x="-62" y="-52" width="124" height="94" rx="4" fill="#0f172a"/>
    <text x="-50" y="-20" font-family="monospace" font-size="11" fill="#38bdf8">> ROBO-MINI v1</text>
    <text x="-50" y="0" font-family="monospace" font-size="10" fill="#4ade80">> Memwa: 100%</text>
    <rect x="-40" y="55" width="80" height="18" fill="#94a3b8" rx="2"/>
  </g>

  <!-- TELEFÒN (Smartphone sobre a Bancada) -->
  <g transform="translate(620, 475)" filter="url(#dropShadow)">
    <rect x="0" y="0" width="45" height="75" rx="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="3" y="5" width="39" height="65" rx="3" fill="#1e293b"/>
    <circle cx="22" cy="32" r="10" fill="#eab308"/>
  </g>
</svg>`;
}

// Scene 6: "Satélite em órbita sob o céu estrelado" (Setting: launch/space, night, objects: satellite, antenna, monitor, solar)
export function renderTecnologia06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Satélite em órbita - Teknoloji</title>
  <desc>Ghibli anime art: Satélite em órbita na Terra, painéis solares, antena e tela de rastreamento.</desc>
  ${getGhibliDefs()}
  
  <!-- Deep Night Space Sky with Stars -->
  <rect width="1200" height="800" fill="#090d1a" filter="url(#ghibliPaper)" />
  ${[
    { x: 120, y: 90, r: 2 }, { x: 300, y: 140, r: 2.5 }, { x: 500, y: 70, r: 1.8 },
    { x: 800, y: 110, r: 2.4 }, { x: 950, y: 80, r: 2 }, { x: 1100, y: 140, r: 2.5 },
    { x: 200, y: 250, r: 1.6 }, { x: 700, y: 220, r: 2.2 }
  ].map(s => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#ffffff" filter="url(#softGlow)"/>`).join("")}

  <!-- Beautiful Curved Glowing Earth Horizon at Bottom -->
  <path d="M-50,620 Q600,480 1250,620 L1250,800 L-50,800 Z" fill="#0284c7" filter="url(#softGlow)"/>
  <path d="M-50,640 Q600,500 1250,640 L1250,800 L-50,800 Z" fill="#0369a1"/>
  <ellipse cx="600" cy="570" rx="350" ry="50" fill="#38bdf8" opacity="0.3" filter="url(#softGlow)"/>

  <!-- SATELIT (Satélite de Comunicações em Órbita no Espaço) -->
  <g transform="translate(600, 320)" filter="url(#dropShadow)">
    <!-- Central Golden Cuboid Bus Body -->
    <rect x="-55" y="-55" width="110" height="110" rx="8" fill="url(#brassTone)" stroke="#eab308" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
    
    <!-- ANTÈN (Antena Parabólica e Hastes de Rádio do Satélite) -->
    <g transform="translate(0, 55)">
      <line x1="0" y1="0" x2="0" y2="40" stroke="#cbd5e1" stroke-width="5"/>
      <ellipse cx="0" cy="45" rx="42" ry="18" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <circle cx="0" cy="55" r="4" fill="#ef4444"/>
    </g>
    <!-- Long Radio Antennas -->
    <line x1="-55" y1="-55" x2="-110" y2="-110" stroke="#f8fafc" stroke-width="2"/>
    <line x1="55" y1="-55" x2="110" y2="-110" stroke="#f8fafc" stroke-width="2"/>

    <!-- PANNO SOLÈ (Grandes Asas de Painéis Solares Azuis Estendidas de Ambos os Lados) -->
    <!-- Left Solar Wing -->
    <g transform="translate(-55, 0)">
      <line x1="0" y1="0" x2="-60" y2="0" stroke="#cbd5e1" stroke-width="8"/>
      <rect x="-260" y="-45" width="200" height="90" rx="4" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>
      ${[-210, -160, -110].map(x => `<line x1="${x}" y1="-45" x2="${x}" y2="45" stroke="#93c5fd" stroke-width="2"/>`).join("")}
      <line x1="-260" y1="0" x2="-60" y2="0" stroke="#93c5fd" stroke-width="2"/>
    </g>
    <!-- Right Solar Wing -->
    <g transform="translate(55, 0)">
      <line x1="0" y1="0" x2="60" y2="0" stroke="#cbd5e1" stroke-width="8"/>
      <rect x="60" y="-45" width="200" height="90" rx="4" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>
      ${[110, 160, 210].map(x => `<line x1="${x}" y1="-45" x2="${x}" y2="45" stroke="#93c5fd" stroke-width="2"/>`).join("")}
      <line x1="60" y1="0" x2="260" y2="0" stroke="#93c5fd" stroke-width="2"/>
    </g>
  </g>

  <!-- EKRAN / MONITOR (Tela de Telemetria e Órbita Terrestre no Canto) -->
  <g transform="translate(180, 640)" filter="url(#dropShadow)">
    <rect x="-80" y="-60" width="160" height="100" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
    <rect x="-72" y="-52" width="144" height="84" rx="4" fill="#0f172a"/>
    <text x="-60" y="-25" font-family="monospace" font-size="10" fill="#38bdf8">> SAT-ÒBIT: 420km</text>
    <text x="-60" y="-5" font-family="monospace" font-size="10" fill="#4ade80">> Vitès: 7.6 km/s</text>
    <text x="-60" y="15" font-family="monospace" font-size="10" fill="#facc15">> Kominikasyon: 100%</text>
  </g>
</svg>`;
}

// Scene 7: "Centro de controle digital" (Setting: control, night, objects: monitor, computer, phone, robot)
export function renderTecnologia07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Centro de controle digital - Teknoloji</title>
  <desc>Ghibli anime art: Centro de controle noturno com telas gigantes, computadores, robô e comunicador.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="#0b1120" filter="url(#ghibliPaper)" />
  
  <!-- EKRAN (Parede de Telas Gigantes de Monitoramento Global no Fundo) -->
  <g transform="translate(600, 260)" filter="url(#dropShadow)">
    <rect x="-450" y="-180" width="900" height="340" rx="16" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <rect x="-435" y="-165" width="870" height="310" rx="10" fill="#0f172a"/>
    <!-- World Map Vector Silhouette with Haiti glowing -->
    <circle cx="120" cy="-20" r="14" fill="#f43f5e" filter="url(#softGlow)"/>
    <text x="145" y="-15" font-family="sans-serif" font-size="14" font-weight="bold" fill="#fde047">HAITI KONEKTE</text>
    <path d="M-380,30 Q-200,-80 0,20 T380,-40" stroke="#38bdf8" stroke-width="3" fill="none"/>
    <text x="-400" y="-120" font-family="monospace" font-size="16" font-weight="bold" fill="#34d399">> SIVEYANS REZO NASYONAL</text>
    <text x="-400" y="-95" font-family="monospace" font-size="12" fill="#94a3b8">> Santral Teknoloji ak Devlopman</text>
  </g>

  <!-- Console Workstations in Foreground -->
  <rect x="0" y="520" width="1200" height="40" fill="#334155" stroke="#1e293b" stroke-width="2"/>
  <rect x="0" y="560" width="1200" height="240" fill="#1e293b"/>

  <!-- ÒDINATÈ (Workstations de Computador do Operador) -->
  <g transform="translate(340, 480)" filter="url(#dropShadow)">
    <rect x="-70" y="-70" width="140" height="95" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    <rect x="-62" y="-62" width="124" height="79" rx="3" fill="#0f172a"/>
    <text x="-50" y="-30" font-family="monospace" font-size="9" fill="#38bdf8">> SÈVÈ: LOKAL</text>
    <!-- Keyboard -->
    <polygon points="-50,35 50,35 60,60 -60,60" fill="#475569" stroke="#1e293b" stroke-width="2"/>
  </g>

  <!-- TELEFÒN (Aparelho Telefônico de Linha Direta na Bancada) -->
  <g transform="translate(540, 520)" filter="url(#dropShadow)">
    <rect x="0" y="0" width="60" height="50" rx="4" fill="#334155" stroke="#0f172a" stroke-width="2"/>
    <!-- Handset -->
    <rect x="-10" y="-12" width="80" height="18" rx="6" fill="#0f172a"/>
    <circle cx="50" cy="25" r="4" fill="#ef4444" filter="url(#softGlow)"/> <!-- Red alert line light -->
  </g>

  <!-- ROBO (Robô Androide de Manutenção no Centro de Comando) -->
  <g transform="translate(860, 440)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="180" rx="55" ry="15" fill="#000000" opacity="0.4"/>
    <rect x="-24" y="90" width="20" height="85" rx="8" fill="#e2e8f0"/>
    <rect x="8" y="90" width="20" height="85" rx="8" fill="#e2e8f0"/>
    <rect x="-45" y="0" width="90" height="100" rx="24" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
    <circle cx="0" cy="40" r="16" fill="#0284c7"/>
    <!-- Head -->
    <rect x="-32" y="-55" width="64" height="50" rx="16" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
    <ellipse cx="0" cy="-30" rx="20" ry="12" fill="#0f172a"/>
    <circle cx="-8" cy="-30" r="4" fill="#38bdf8"/>
    <circle cx="8" cy="-30" r="4" fill="#38bdf8"/>
  </g>
</svg>`;
}

// Scene 8: "Drones sobre a cidade" (Setting: town, dia, objects: drone, antenna, phone, solar)
export function renderTecnologia08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Drones sobre a cidade - Teknoloji</title>
  <desc>Ghibli anime art: Drones sobrevoando a cidade ensolarada com painéis solares, antenas e smartphone.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 50)}
  ${drawGhibliCloud(220, 130, 0.95)}
  ${drawGhibliCloud(680, 180, 0.85)}

  <!-- City Skyline with Colorful Ghibli Houses -->
  <g transform="translate(0, 500)" filter="url(#dropShadow)">
    <rect x="80" y="-120" width="160" height="220" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="60,-120 160,-200 260,-120" fill="#b91c1c"/>
    <rect x="300" y="-160" width="200" height="260" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <polygon points="280,-160 400,-250 520,-160" fill="#0369a1"/>
    <rect x="560" y="-100" width="170" height="200" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
    <rect x="780" y="-180" width="220" height="280" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <polygon points="760,-180 890,-260 1020,-180" fill="#15803d"/>
  </g>

  <!-- ANTÈN (Antena de Rádio e Telecomunicações no Telhado do Prédio) -->
  <g transform="translate(400, 250)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#334155" stroke-width="4"/>
    <line x1="-20" y1="-70" x2="20" y2="-70" stroke="#334155" stroke-width="3"/>
    <line x1="-14" y1="-50" x2="14" y2="-50" stroke="#334155" stroke-width="3"/>
    <circle cx="0" cy="-90" r="5" fill="#ef4444" filter="url(#softGlow)"/>
  </g>

  <!-- PANNO SOLÈ (Painéis Solares Instalados nos Telhados da Cidade) -->
  <g transform="translate(640, 440)" filter="url(#dropShadow)">
    <polygon points="-50,-20 50,-40 70,20 -30,40" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
  </g>

  <!-- DRÒN (Frota de Drones Modernos Voando pelo Céu da Cidade) -->
  <g transform="translate(560, 200)" filter="url(#dropShadow)">
    <line x1="-45" y1="-18" x2="45" y2="18" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <line x1="-45" y1="18" x2="45" y2="-18" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <rect x="-20" y="-15" width="40" height="30" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="12" r="5" fill="#38bdf8"/>
    <!-- Rotors -->
    <ellipse cx="-45" cy="-18" rx="26" ry="6" fill="#94a3b8" opacity="0.6"/>
    <ellipse cx="45" cy="-18" rx="26" ry="6" fill="#94a3b8" opacity="0.6"/>
    <ellipse cx="-45" cy="18" rx="26" ry="6" fill="#94a3b8" opacity="0.6"/>
    <ellipse cx="45" cy="18" rx="26" ry="6" fill="#94a3b8" opacity="0.6"/>
  </g>
  <!-- Smaller Drone in distance -->
  <g transform="translate(260, 160) scale(0.6)" filter="url(#dropShadow)">
    <rect x="-18" y="-12" width="36" height="24" rx="6" fill="#f8fafc"/>
    <ellipse cx="-35" cy="-12" rx="18" ry="4" fill="#94a3b8" opacity="0.6"/>
    <ellipse cx="35" cy="-12" rx="18" ry="4" fill="#94a3b8" opacity="0.6"/>
  </g>

  <!-- Foreground Balcony with TELEFÒN (Smartphone com App de Rota dos Drones) -->
  <path d="M-50,680 L1250,680 L1250,800 L-50,800 Z" fill="#64748b"/>
  <g transform="translate(320, 670)" filter="url(#dropShadow)">
    <rect x="0" y="0" width="55" height="95" rx="8" fill="#0f172a" stroke="#ffffff" stroke-width="2.5"/>
    <rect x="4" y="6" width="47" height="83" rx="4" fill="#1e293b"/>
    <circle cx="27" cy="40" r="14" fill="#0284c7"/>
    <polygon points="27,30 35,46 20,46" fill="#fde047"/>
  </g>
</svg>`;
}

// Scene 9: "Invenções na escola" (Setting: classroom, dia, objects: computer, robot, lab, monitor)
export function renderTecnologia09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Invenções na escola - Teknoloji</title>
  <desc>Ghibli anime art: Sala de aula com invenções, robô feito pelos alunos, computador e lousa interativa.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="#fef9ee" filter="url(#ghibliPaper)" />
  
  <!-- Sunlit Classroom Windows -->
  <g transform="translate(180, 220)">
    <rect x="-120" y="-140" width="240" height="260" rx="8" fill="url(#skyDay)" stroke="#78350f" stroke-width="8"/>
    <line x1="0" y1="-140" x2="0" y2="120" stroke="#78350f" stroke-width="6"/>
    <line x1="-120" y1="-10" x2="120" y2="-10" stroke="#78350f" stroke-width="6"/>
    <circle cx="60" cy="-60" r="34" fill="url(#sunGlowDay)"/>
  </g>

  <!-- EKRAN / LOUSA DIGITAL (Tela Interativa Escolar com Diagrama de Ciências em Kreyòl) -->
  <g transform="translate(680, 220)" filter="url(#dropShadow)">
    <rect x="-240" y="-120" width="480" height="240" rx="10" fill="#14532d" stroke="#78350f" stroke-width="8"/>
    <text x="-210" y="-70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#fef08a">KLAS TEKNOLOJI AYISYEN</text>
    <text x="-210" y="-35" font-family="sans-serif" font-size="14" fill="#ffffff">> Pwojè: Bati yon ti robo</text>
    <text x="-210" y="-10" font-family="sans-serif" font-size="14" fill="#ffffff">> Aprann kòd ak elektwonik</text>
    <circle cx="140" cy="10" r="45" fill="none" stroke="#facc15" stroke-width="3"/>
    <text x="140" y="16" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">ROBOTIK</text>
  </g>

  <!-- LAB / CLASSROOM DESKS IN FOREGROUND -->
  <rect x="0" y="490" width="1200" height="35" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
  <rect x="0" y="525" width="1200" height="275" fill="#543317"/>

  <!-- ÒDINATÈ (Computador Educativo das Crianças na Carteira Escolar) -->
  <g transform="translate(280, 400)" filter="url(#dropShadow)">
    <rect x="-60" y="-60" width="120" height="95" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
    <rect x="-52" y="-52" width="104" height="79" rx="4" fill="#0f172a"/>
    <text x="-40" y="-20" font-family="monospace" font-size="10" fill="#38bdf8">> KREYÒL KÒD</text>
    <text x="-40" y="0" font-family="monospace" font-size="10" fill="#22c55e">> Bon travay!</text>
    <!-- Keyboard -->
    <polygon points="-45,35 45,35 52,58 -52,58" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  </g>

  <!-- ROBO (Robô Amigável Construído pelos Alunos com Peças Coloridas) -->
  <g transform="translate(680, 390)" filter="url(#dropShadow)">
    <rect x="-35" y="10" width="70" height="85" rx="18" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/>
    <circle cx="0" cy="45" r="16" fill="#facc15"/>
    <circle cx="0" cy="45" r="8" fill="#ef4444"/>
    <!-- Head -->
    <rect x="-26" y="-45" width="52" height="45" rx="12" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5"/>
    <circle cx="-10" cy="-22" r="6" fill="#ffffff"/>
    <circle cx="-10" cy="-22" r="3" fill="#0f172a"/>
    <circle cx="10" cy="-22" r="6" fill="#ffffff"/>
    <circle cx="10" cy="-22" r="3" fill="#0f172a"/>
    <line x1="0" y1="-45" x2="0" y2="-62" stroke="#facc15" stroke-width="3"/>
    <circle cx="0" cy="-65" r="5" fill="#ef4444"/>
    <!-- Cute waving arm -->
    <path d="M35,25 Q60,10 65,-10" stroke="#facc15" stroke-width="8" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;
}

// Scene 10: "Moinho e sensores no campo" (Setting: farmland, entardecer, objects: turbine, drone, solar, phone)
export function renderTecnologia10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Moinho e sensores no campo ao entardecer - Teknoloji</title>
  <desc>Ghibli anime art: Moinho de vento rústico, drone agrícola, sensor solar e celular inteligente.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 200, 50, true)}
  ${drawGhibliCloud(240, 160, 0.95, true)}
  ${drawGhibliCloud(980, 180, 0.85, true)}

  <!-- Distant Blue Ridge Mountains -->
  <path d="M-50,510 Q320,440 680,490 T1250,470 L1250,800 L-50,800 Z" fill="#6a3e5c" opacity="0.6"/>

  <!-- MOULEN VAN / TURBINE (Moinho Rústico Tradicional de Vento no Cume da Colina) -->
  <g transform="translate(340, 420)" filter="url(#dropShadow)">
    <path d="M-40,110 L-25,-35 Q0,-45 25,-35 L40,110 Z" fill="url(#stoneTone)" stroke="#3e2515" stroke-width="3"/>
    <polygon points="-30,-35 0,-70 30,-35" fill="#78350f"/>
    <!-- 4 Wooden Windmill Blades -->
    <g transform="translate(0, -40)">
      <circle cx="0" cy="0" r="10" fill="#451a03"/>
      <line x1="0" y1="0" x2="0" y2="-90" stroke="#451a03" stroke-width="5"/>
      <rect x="3" y="-85" width="20" height="70" fill="#fef3c7" stroke="#78350f" stroke-width="1.5"/>
      <line x1="0" y1="0" x2="90" y2="0" stroke="#451a03" stroke-width="5"/>
      <rect x="15" y="3" width="70" height="20" fill="#fef3c7" stroke="#78350f" stroke-width="1.5"/>
      <line x1="0" y1="0" x2="0" y2="90" stroke="#451a03" stroke-width="5"/>
      <rect x="-23" y="15" width="20" height="70" fill="#fef3c7" stroke="#78350f" stroke-width="1.5"/>
      <line x1="0" y1="0" x2="-90" y2="0" stroke="#451a03" stroke-width="5"/>
      <rect x="-85" y="-23" width="70" height="20" fill="#fef3c7" stroke="#78350f" stroke-width="1.5"/>
    </g>
  </g>

  <!-- Farmland Terraces in Sunset Light -->
  <path d="M-50,580 Q300,520 650,570 T1250,540 L1250,800 L-50,800 Z" fill="url(#hillMid)"/>
  <path d="M-50,660 Q280,600 620,650 T1250,630 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>

  <!-- DRÒN (Drone de Monitoramento Agrícola Sobrevoando as Plantações) -->
  <g transform="translate(740, 290)" filter="url(#dropShadow)">
    <line x1="-40" y1="-16" x2="40" y2="16" stroke="#0f172a" stroke-width="5"/>
    <line x1="-40" y1="16" x2="40" y2="-16" stroke="#0f172a" stroke-width="5"/>
    <rect x="-16" y="-12" width="32" height="24" rx="6" fill="#eab308" stroke="#78350f" stroke-width="2"/>
    <ellipse cx="-40" cy="-16" rx="22" ry="5" fill="#f8fafc" opacity="0.7"/>
    <ellipse cx="40" cy="-16" rx="22" ry="5" fill="#f8fafc" opacity="0.7"/>
    <ellipse cx="-40" cy="16" rx="22" ry="5" fill="#f8fafc" opacity="0.7"/>
    <ellipse cx="40" cy="16" rx="22" ry="5" fill="#f8fafc" opacity="0.7"/>
  </g>

  <!-- PANNO SOLÈ (Estação Meteorológica e Sensor Agrícola Solar na Plantação) -->
  <g transform="translate(860, 600)" filter="url(#dropShadow)">
    <polygon points="-60,0 40,-30 60,30 -40,60" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2.5"/>
    <line x1="0" y1="15" x2="0" y2="110" stroke="#475569" stroke-width="6"/>
  </g>

  <!-- TELEFÒN (Smartphone do Agricultor na Cerca de Madeira com Alertas de Umidade) -->
  <g transform="translate(480, 660)" filter="url(#dropShadow)">
    <rect x="0" y="0" width="55" height="95" rx="8" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
    <rect x="4" y="6" width="47" height="83" rx="4" fill="#1e293b"/>
    <circle cx="27" cy="35" r="12" fill="#22c55e"/>
    <text x="27" y="62" font-family="sans-serif" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">JADEN: OK</text>
  </g>
</svg>`;
}

