import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderCultura as renderCultura01 } from "./master-scenes-1.mjs";

export { renderCultura01 };

// Scene 2: "Karnaval na praça" (mask, dancer, drum, flag)
export function renderCultura02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Karnaval na praça - Kilti</title>
  <desc>Ghibli anime art: Carnaval haitiano, máscaras de papier-mâché, dançarinos, tambor e bandeira.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 360, 52, true)}
  ${drawGhibliCloud(200, 160, 0.9, true)}
  ${drawGhibliCloud(960, 170, 0.85, true)}

  <!-- DRAPO (Bandeiras Bicolores do Haiti e Estandartes do Carnaval em Toda a Praça) -->
  <g>
    <path d="M-20,240 Q600,320 1220,250" stroke="#334155" stroke-width="2.5" fill="none"/>
    ${[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x, i) => {
      const c = ["#00209f", "#d21034", "#facc15"][i % 3];
      return `<polygon points="${x-15},${240 + Math.sin(x/1200*Math.PI)*80} ${x+15},${240 + Math.sin(x/1200*Math.PI)*80} ${x},${240 + Math.sin(x/1200*Math.PI)*80 + 36}" fill="${c}"/>`;
    }).join("")}
  </g>

  <!-- Plaza Cobblestones -->
  <path d="M-50,580 L1250,580 L1250,800 L-50,800 Z" fill="#78716c"/>

  <!-- MASK (Máscaras Festivas Tradicionais de Jacmel em Destaque) -->
  <!-- Mask 1 (Carnival Lion/Dragon Mask on pole) -->
  <g transform="translate(320, 480)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="180" stroke="#543317" stroke-width="6"/>
    <!-- Sculpted Papier-Mâché Head -->
    <ellipse cx="0" cy="0" rx="60" ry="50" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <!-- Yellow mane points -->
    ${[-45, -25, 0, 25, 45].map(deg => `<polygon points="0,-40 -12,-70 12,-70" fill="#facc15" transform="rotate(${deg} 0 0)"/>`).join("")}
    <!-- Eyes -->
    <circle cx="-22" cy="-8" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    <circle cx="-22" cy="-8" r="6" fill="#0f172a"/>
    <circle cx="22" cy="-8" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    <circle cx="22" cy="-8" r="6" fill="#0f172a"/>
    <!-- Snout & Teeth -->
    <polygon points="-12,14 0,32 12,14" fill="#facc15"/>
    <path d="M-30,28 Q0,48 30,28" stroke="#ffffff" stroke-width="6" fill="none"/>
  </g>

  <!-- DANSÈ (Dançarinos do Carnaval com Fantasias de Plumas e Fitas) -->
  <g transform="translate(620, 520)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="180" rx="60" ry="16" fill="#000000" opacity="0.35"/>
    <!-- Dancing Figure with Feathers & Colorful Skirt -->
    <path d="M-15,-20 C-60,30 -80,100 -50,110 C0,120 40,110 60,80 C70,40 30,-20 15,-20 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
    <path d="M-40,85 Q0,105 40,85" stroke="#ef4444" stroke-width="6" fill="none"/>
    <circle cx="0" cy="-55" r="14" fill="#8c5836"/>
    <!-- Headdress with Tall Colorful Carnival Feathers -->
    ${[-40, -20, 0, 20, 40].map((deg, i) => {
      const c = ["#ef4444", "#3b82f6", "#10b981", "#facc15", "#ec4899"][i];
      return `<path d="M0,-65 Q${deg*1.5},-140 ${deg*2.2},-110" stroke="${c}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    }).join("")}
  </g>

  <!-- TANBOU (Tambores Rara / Tanbou Vibrando com a Multidão) -->
  <g transform="translate(860, 600)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="55" ry="16" fill="#000000" opacity="0.35"/>
    <path d="M-42,-60 L42,-60 Q52,10 32,60 L-32,60 Q-52,10 -42,-60 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="3"/>
    <ellipse cx="0" cy="-60" rx="42" ry="14" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <path d="M-40,-50 L-20,15 L0,-50 L20,15 L40,-50" stroke="#facc15" stroke-width="3.5" fill="none"/>
  </g>
</svg>`;
}

// Scene 3: "Mercado de artesanato" (vendor, clothing, food, parasol)
export function renderCultura03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mercado de artesanato - Kilti</title>
  <desc>Ghibli anime art: Mercado de rua, vendedora sorridente, roupas coloridas, comida e guarda-sol.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 140, 50)}
  ${drawGhibliCloud(220, 150, 1.0)}

  <!-- Street Market Floor -->
  <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="#a8a29e"/>

  <!-- PARAPLI (Grandes Guarda-sóis / Toldos Listrados do Mercado) -->
  <g transform="translate(420, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="280" stroke="#543317" stroke-width="8"/>
    <!-- Striped Dome Parasol -->
    <path d="M-180,0 Q0,-160 180,0 Z" fill="#ef4444" stroke="#991b1b" stroke-width="3"/>
    <!-- Yellow Stripes on parasol -->
    <path d="M-120,0 Q0,-140 0,-140 Q0,-140 0,0 Z" fill="#fde047"/>
    <path d="M60,0 Q0,-140 0,-140 Q0,-140 120,0 Z" fill="#fde047"/>
  </g>

  <!-- MACHANN (Vendedora Haitiana Acolhedora na Barraca com Cesto de Palha) -->
  <g transform="translate(420, 500)" filter="url(#dropShadow)">
    <rect x="-110" y="50" width="220" height="110" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
    <!-- Vendor woman standing behind stall -->
    <circle cx="0" cy="-35" r="18" fill="#8c5836"/>
    <!-- Headwrap (Mouchwa) -->
    <ellipse cx="0" cy="-45" rx="20" ry="14" fill="#ef4444"/>
    <!-- Smock Dress -->
    <path d="M-25,-10 L-30,50 L30,50 L25,-10 Z" fill="#38bdf8"/>
  </g>

  <!-- RAD (Roupas e Tecidos Tradicionais Coloridos Pendurados à Venda) -->
  <g transform="translate(780, 380)" filter="url(#dropShadow)">
    <line x1="-120" y1="0" x2="120" y2="0" stroke="#543317" stroke-width="6"/>
    <!-- Hanging traditional Karabela and batiks -->
    <polygon points="-90,0 -110,140 -50,140 -70,0" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="-30,0 -50,150 10,150 -10,0" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <polygon points="30,0 10,140 70,140 50,0" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  </g>

  <!-- MANJE (Comida e Frutas Típicas nas Cestas da Barraca) -->
  <g transform="translate(420, 540)" filter="url(#dropShadow)">
    <!-- Bowls on stall -->
    <ellipse cx="-60" cy="5" rx="30" ry="12" fill="#78350f"/>
    <circle cx="-60" cy="-2" r="9" fill="#f97316"/> <!-- Fruits -->
    <circle cx="-72" cy="-1" r="7" fill="#facc15"/>
    <ellipse cx="60" cy="5" rx="30" ry="12" fill="#78350f"/>
    <rect x="45" y="-12" width="30" height="15" rx="4" fill="#d97706"/> <!-- Baked bread -->
  </g>
</svg>`;
}

// Scene 4: "Festa das lanternas" (lantern, flag, house, drum)
export function renderCultura04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Festa das lanternas à noite - Kilti</title>
  <desc>Ghibli anime art: Noite mágica com lanternas iluminadas, casas coloniais, tambor e bandeira.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="#0d1424" filter="url(#ghibliPaper)" />
  ${[
    { x: 120, y: 70, r: 2 }, { x: 340, y: 90, r: 2.5 }, { x: 580, y: 50, r: 1.8 },
    { x: 820, y: 80, r: 2.2 }, { x: 1040, y: 60, r: 2.5 }
  ].map(s => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#ffffff" filter="url(#softGlow)"/>`).join("")}

  <!-- KAY (Casas Coloniais Iluminadas pela Noite) in background -->
  <g transform="translate(240, 520)" filter="url(#dropShadow)">
    <rect x="-100" y="-140" width="200" height="140" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <polygon points="-120,-140 0,-220 120,-140" fill="#7f1d1d"/>
    <rect x="-60" y="-90" width="40" height="50" rx="3" fill="#fef08a" opacity="0.9" filter="url(#softGlow)"/>
    <rect x="20" y="-90" width="40" height="50" rx="3" fill="#fef08a" opacity="0.9" filter="url(#softGlow)"/>
  </g>
  <g transform="translate(940, 520)" filter="url(#dropShadow)">
    <rect x="-110" y="-150" width="220" height="150" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <polygon points="-130,-150 0,-230 130,-150" fill="#1e3a8a"/>
    <rect x="-40" y="-100" width="45" height="55" rx="3" fill="#fef08a" opacity="0.9" filter="url(#softGlow)"/>
  </g>

  <!-- DRAPO (Bandeiras Iluminadas Pelas Lanternas) -->
  <g transform="translate(600, 240)">
    <line x1="0" y1="0" x2="0" y2="180" stroke="#64748b" stroke-width="4"/>
    <path d="M0,0 Q35,-15 70,0 T140,0 L140,45 Q70,30 0,45 Z" fill="#00209f"/>
    <path d="M0,45 Q70,30 140,45 L140,90 Q70,75 0,90 Z" fill="#d21034"/>
  </g>

  <!-- LANP (Grandes Lanternas Iluminadas com Luz Quente de Velas) -->
  ${[
    { x: 220, y: 320, c: "#f59e0b" },
    { x: 420, y: 360, c: "#ef4444" },
    { x: 620, y: 340, c: "#facc15" },
    { x: 820, y: 360, c: "#ec4899" },
    { x: 1020, y: 320, c: "#3b82f6" }
  ].map(l => `
    <g transform="translate(${l.x}, ${l.y})" filter="url(#dropShadow)">
      <circle cx="0" cy="0" r="50" fill="${l.c}" opacity="0.35" filter="url(#softGlow)"/>
      <ellipse cx="0" cy="0" rx="26" ry="30" fill="${l.c}" stroke="#ffffff" stroke-width="2"/>
    </g>
  `).join("")}

  <!-- TANBOU (Tambor em Grande Destaque no Centro da Roda Noturna) -->
  <g transform="translate(600, 640)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="65" rx="65" ry="18" fill="#000000" opacity="0.45"/>
    <path d="M-48,-65 L48,-65 Q58,10 38,65 L-38,65 Q-58,10 -48,-65 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="3"/>
    <ellipse cx="0" cy="-65" rx="48" ry="16" fill="#fef3c7" stroke="#78350f" stroke-width="3"/>
    <path d="M-45,-55 L-25,18 L-5,-55 L15,18 L35,-55" stroke="#facc15" stroke-width="4" fill="none"/>
  </g>
</svg>`;
}

// Scene 5: "Música no vilarejo" (drum, house, dancer, food)
export function renderCultura05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Música e encontro no vilarejo - Kilti</title>
  <desc>Ghibli anime art: Vilarejo com casas típicas, tambor, dançarinos e mesa com comida farta.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(850, 260, 52, true)}
  ${drawGhibliCloud(220, 160, 0.9, true)}

  <!-- KAY (Casas Tradicionais Rústicas do Vilarejo) -->
  <g transform="translate(180, 540)" filter="url(#dropShadow)">
    <rect x="-100" y="-120" width="200" height="120" fill="#f5f5f4" stroke="#a8a29e" stroke-width="2"/>
    <polygon points="-120,-120 0,-190 120,-120" fill="#78350f"/>
    <rect x="-20" y="-80" width="40" height="80" rx="3" fill="#543317"/>
  </g>
  <g transform="translate(980, 540)" filter="url(#dropShadow)">
    <rect x="-110" y="-130" width="220" height="130" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="-130,-130 0,-200 130,-130" fill="#b91c1c"/>
  </g>

  <!-- Village Courtyard Ground -->
  <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#78716c"/>

  <!-- DANSÈ (Dançarinos Celebrando no Centro do Vilarejo) -->
  <g transform="translate(560, 520)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="180" rx="50" ry="14" fill="#000000" opacity="0.35"/>
    <path d="M-15,-20 C-50,20 -70,80 -40,90 C0,100 40,90 50,70 C60,40 20,-20 15,-20 Z" fill="#ef4444"/>
    <circle cx="0" cy="-45" r="14" fill="#8c5836"/>
    <path d="M-15,-48 Q0,-65 15,-48" stroke="#facc15" stroke-width="6" fill="none"/>
  </g>

  <!-- TANBOU (Tambores Marcando o Ritmo da Festa) -->
  <g transform="translate(380, 620)" filter="url(#dropShadow)">
    <path d="M-35,-50 L35,-50 Q45,10 28,50 L-28,50 Q-45,10 -35,-50 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-50" rx="35" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
  </g>

  <!-- MANJE (Mesa Farta com Pratos de Comida Compartilhada) -->
  <g transform="translate(800, 620)" filter="url(#dropShadow)">
    <rect x="-80" y="0" width="160" height="20" rx="4" fill="url(#woodTone)"/>
    <rect x="-70" y="20" width="15" height="90" fill="#543317"/>
    <rect x="55" y="20" width="15" height="90" fill="#543317"/>
    <!-- Dishes of food -->
    <ellipse cx="-35" cy="-8" rx="28" ry="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="-35" cy="-12" r="10" fill="#d97706"/>
    <ellipse cx="35" cy="-8" rx="28" ry="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="35" cy="-12" r="10" fill="#b91c1c"/>
  </g>
</svg>`;
}

// Scene 6: "Desfile de roupas tradicionais" (clothing, flag, dancer, lantern)
export function renderCultura06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Desfile de roupas tradicionais - Kilti</title>
  <desc>Ghibli anime art: Desfile festivo com vestidos tradicionais Karabela, bandeiras, dançarinas e lanternas.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 140, 52)}
  ${drawGhibliCloud(220, 140, 0.95)}

  <!-- DRAPO (Bandeiras do Haiti Tremulando no Cortejo) -->
  <g transform="translate(240, 220)">
    <line x1="0" y1="0" x2="0" y2="350" stroke="#64748b" stroke-width="5"/>
    <path d="M0,0 Q40,-15 80,0 T160,0 L160,50 Q80,35 0,50 Z" fill="#00209f"/>
    <path d="M0,50 Q80,35 160,50 L160,100 Q80,85 0,100 Z" fill="#d21034"/>
  </g>

  <!-- LANP (Lanternas de Papel Festivas) overhead -->
  <g transform="translate(600, 260)">
    <circle cx="0" cy="0" r="38" fill="#facc15" opacity="0.3" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="0" rx="22" ry="26" fill="#facc15" stroke="#ffffff" stroke-width="2"/>
  </g>

  <!-- DANSÈ & RAD (Dançarinas em Desfile Ostentando Roupas Tradicionais Karabela com Babados) -->
  <g transform="translate(580, 480)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="220" rx="90" ry="22" fill="#000000" opacity="0.35"/>
    <!-- Gorgeous Full Ruffled Skirt (Rad Karabela) -->
    <path d="M-25,-30 
      C-120,-10 -170,80 -120,110 
      C-40,130 40,130 120,110 
      C170,80 120,-10 25,-30 Z" 
      fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <!-- Red & Blue tier ruffles -->
    <path d="M-105,80 Q0,110 105,80" stroke="#dc2626" stroke-width="12" fill="none"/>
    <path d="M-85,50 Q0,80 85,50" stroke="#00209f" stroke-width="10" fill="none"/>
    <!-- Blouse & arms -->
    <rect x="-22" y="-60" width="44" height="40" rx="6" fill="#f8fafc"/>
    <circle cx="0" cy="-80" r="16" fill="#8c5836"/>
    <!-- Headwrap -->
    <ellipse cx="0" cy="-90" rx="22" ry="15" fill="#dc2626"/>
  </g>
</svg>`;
}

// Scene 7: "Barracas de comida haitiana" (food, vendor, parasol, house)
export function renderCultura07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Barracas de comida haitiana ao entardecer - Kilti</title>
  <desc>Ghibli anime art: Barracas de comida de rua, vendedora sorridente, guarda-sóis e casas coloniais.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(300, 240, 52, true)}
  ${drawGhibliCloud(820, 160, 0.9, true)}

  <!-- KAY (Casas Tradicionais da Praça) -->
  <g transform="translate(860, 480)" filter="url(#dropShadow)">
    <rect x="-120" y="-140" width="240" height="140" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
    <polygon points="-140,-140 0,-220 140,-140" fill="#991b1b"/>
  </g>

  <!-- PARAPLI (Guarda-sol Listrado da Barraca) -->
  <g transform="translate(460, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="280" stroke="#543317" stroke-width="8"/>
    <path d="M-170,0 Q0,-150 170,0 Z" fill="#f59e0b" stroke="#b45309" stroke-width="3"/>
    <path d="M-110,0 Q0,-130 0,-130 Q0,-130 0,0 Z" fill="#ffffff"/>
    <path d="M60,0 Q0,-130 0,-130 Q0,-130 110,0 Z" fill="#ffffff"/>
  </g>

  <!-- MACHANN (Vendedora com Avental Servindo Comida) -->
  <g transform="translate(460, 510)" filter="url(#dropShadow)">
    <rect x="-110" y="40" width="220" height="110" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
    <circle cx="0" cy="-35" r="18" fill="#8c5836"/>
    <ellipse cx="0" cy="-45" rx="20" ry="14" fill="#facc15"/>
    <rect x="-24" y="-10" width="48" height="60" rx="4" fill="#ffffff"/>
  </g>

  <!-- MANJE (Comida Típica Quente nas Travessas: Griot, Banana-pão e Picles) -->
  <g transform="translate(460, 545)" filter="url(#dropShadow)">
    <ellipse cx="-55" cy="0" rx="35" ry="14" fill="#44403c"/>
    <circle cx="-55" cy="-4" r="11" fill="#78350f"/> <!-- Griot -->
    <ellipse cx="55" cy="0" rx="35" ry="14" fill="#44403c"/>
    <circle cx="55" cy="-4" r="11" fill="#facc15"/> <!-- Fried plantain -->
  </g>
</svg>`;
}

// Scene 8: "Máscaras e tambores sob a lua" (mask, drum, lantern, dancer)
export function renderCultura08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Máscaras e tambores sob a lua - Kilti</title>
  <desc>Ghibli anime art: Máscaras de carnaval, tambor tradicional, lanternas douradas e dançarina.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="#0b1120" filter="url(#ghibliPaper)" />
  <circle cx="980" cy="140" r="38" fill="#fef08a" filter="url(#softGlow)"/>

  <!-- LANP (Lanternas Noturnas Iluminando a Roda) -->
  <g transform="translate(320, 280)">
    <circle cx="0" cy="0" r="45" fill="#f59e0b" opacity="0.35" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="0" rx="22" ry="26" fill="#f59e0b"/>
  </g>
  <g transform="translate(740, 280)">
    <circle cx="0" cy="0" r="45" fill="#ef4444" opacity="0.35" filter="url(#softGlow)"/>
    <ellipse cx="0" cy="0" rx="22" ry="26" fill="#ef4444"/>
  </g>

  <!-- MASK (Máscara de Carnaval de Jacmel Iluminada pela Fogueira/Lanternas) -->
  <g transform="translate(280, 520)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="55" ry="46" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
    <circle cx="-18" cy="-6" r="12" fill="#1e293b"/>
    <circle cx="18" cy="-6" r="12" fill="#1e293b"/>
    <polygon points="0,10 -15,28 15,28" fill="#dc2626"/>
  </g>

  <!-- DANSÈ (Dançarina em Movimento Mágico Noturno) -->
  <g transform="translate(680, 520)" filter="url(#dropShadow)">
    <path d="M-15,-20 C-60,30 -70,90 -40,100 C0,110 40,100 50,80 C60,40 20,-20 15,-20 Z" fill="#38bdf8"/>
    <circle cx="0" cy="-45" r="14" fill="#8c5836"/>
  </g>

  <!-- TANBOU (Tambor Central de Ritmo Rara) -->
  <g transform="translate(480, 640)" filter="url(#dropShadow)">
    <path d="M-40,-55 L40,-55 Q50,10 32,55 L-32,55 Q-50,10 -40,-55 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-55" rx="40" ry="12" fill="#fef3c7"/>
    <path d="M-38,-45 L-20,15 L0,-45 L20,15 L38,-45" stroke="#facc15" stroke-width="3" fill="none"/>
  </g>
</svg>`;
}

// Scene 9: "Celebração sob as bandeiras" (flag, food, vendor, house)
export function renderCultura09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Celebração patriótica sob as bandeiras - Kilti</title>
  <desc>Ghibli anime art: Celebração patriótica com grandes bandeiras do Haiti, comidas, vendedora e casario.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 50)}
  ${drawGhibliCloud(240, 150, 0.95)}

  <!-- DRAPO (Múltiplas Bandeiras Bicolores do Haiti em Destaque) -->
  <g transform="translate(380, 180)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="400" stroke="#64748b" stroke-width="6"/>
    <path d="M0,0 Q60,-20 120,0 T240,0 L240,70 Q120,50 0,70 Z" fill="#00209f"/>
    <path d="M0,70 Q120,50 240,70 L240,140 Q120,120 0,140 Z" fill="#d21034"/>
  </g>

  <!-- KAY (Casas Coloniais Festivas no Fundo) -->
  <g transform="translate(860, 500)" filter="url(#dropShadow)">
    <rect x="-120" y="-130" width="240" height="130" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
    <polygon points="-140,-130 0,-210 140,-130" fill="#1d4ed8"/>
  </g>

  <!-- MACHANN & MANJE (Vendedora Servindo Pratos Comunitários) -->
  <g transform="translate(480, 540)" filter="url(#dropShadow)">
    <rect x="-90" y="40" width="180" height="110" fill="url(#woodTone)"/>
    <circle cx="0" cy="-35" r="18" fill="#8c5836"/>
    <ellipse cx="0" cy="-45" rx="20" ry="14" fill="#dc2626"/>
    <!-- Bowls of food -->
    <ellipse cx="-40" cy="35" rx="28" ry="10" fill="#ffffff"/>
    <circle cx="-40" cy="30" r="10" fill="#f59e0b"/>
    <ellipse cx="40" cy="35" rx="28" ry="10" fill="#ffffff"/>
    <circle cx="40" cy="30" r="10" fill="#15803d"/>
  </g>
</svg>`;
}

// Scene 10: "Dança no pátio" (dancer, drum, clothing, parasol)
export function renderCultura10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança no pátio com guarda-sóis - Kilti</title>
  <desc>Ghibli anime art: Dança folclórica no pátio ensolarado, tambor, vestidos coloridos e guarda-sol.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 220, 52, true)}
  ${drawGhibliCloud(220, 160, 0.95, true)}

  <!-- PARAPLI (Guarda-sol Decorativo Colorido Shading the Patio) -->
  <g transform="translate(240, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="280" stroke="#543317" stroke-width="7"/>
    <path d="M-150,0 Q0,-130 150,0 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
    <path d="M-90,0 Q0,-115 0,-115 Q0,-115 90,0 Z" fill="#facc15"/>
  </g>

  <!-- Patio Tiles Floor -->
  <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#854d0e"/>

  <!-- DANSÈ & RAD (Dançarinas Exibindo Roupas Folclóricas Espetaculares) -->
  <g transform="translate(620, 500)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="200" rx="80" ry="18" fill="#000000" opacity="0.35"/>
    <path d="M-20,-30 
      C-100,-10 -150,75 -110,105 
      C-30,120 30,120 110,105 
      C150,75 100,-10 20,-30 Z" 
      fill="#f43f5e" stroke="#be123c" stroke-width="3"/>
    <path d="M-90,75 Q0,105 90,75" stroke="#facc15" stroke-width="10" fill="none"/>
    <circle cx="0" cy="-75" r="15" fill="#8c5836"/>
    <ellipse cx="0" cy="-85" rx="20" ry="12" fill="#0284c7"/>
  </g>

  <!-- TANBOU (Tambor no Pátio Conduzindo a Dança) -->
  <g transform="translate(920, 620)" filter="url(#dropShadow)">
    <path d="M-40,-55 L40,-55 Q50,10 32,55 L-32,55 Q-50,10 -40,-55 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-55" rx="40" ry="14" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-38,-45 L-20,15 L0,-45 L20,15 L38,-45" stroke="#facc15" stroke-width="3" fill="none"/>
  </g>
</svg>`;
}

// Scene 11: "Ateliê de pintura e arte naïf" (objects: house [kay], flag [drapo], mask [mask], clothing [rad])
export function renderCultura11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ateliê de pintura e arte naïf - Kilti</title>
  <desc>Ghibli anime art: Varanda artística com pinturas coloridas, casa haitiana, bandeira, máscaras e avental bordado.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 160, 48)}
  ${drawGhibliCloud(300, 120, 0.9)}
  <!-- KAY (Varanda Colonial de Madeira com Detalhes Gingerbread) -->
  <rect x="0" y="240" width="1200" height="24" fill="#78350f"/>
  ${[120, 400, 780, 1060].map(x => `<rect x="${x}" y="240" width="28" height="560" fill="#451a03"/>`).join("")}
  <!-- DRAPO (Bandeira Haitiana Pintada com Orgulho na Tela do Cavalete) -->
  <g transform="translate(340, 460)" filter="url(#dropShadow)">
    <!-- Wooden Easel -->
    <line x1="0" y1="-180" x2="-60" y2="160" stroke="#78350f" stroke-width="6"/>
    <line x1="0" y1="-180" x2="60" y2="160" stroke="#78350f" stroke-width="6"/>
    <line x1="0" y1="-180" x2="0" y2="150" stroke="#451a03" stroke-width="5"/>
    <rect x="-80" y="40" width="160" height="14" fill="#78350f"/>
    <!-- Canvas with Haitian Flag Artwork -->
    <rect x="-70" y="-80" width="140" height="110" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
    <rect x="-65" y="-75" width="130" height="50" fill="#0284c7"/>
    <rect x="-65" y="-25" width="130" height="50" fill="#dc2626"/>
    <rect x="-20" y="-35" width="40" height="20" fill="#ffffff"/>
  </g>
  <!-- MASK (Máscaras Artesanais de Papier-Mâché na Parede) -->
  <g transform="translate(680, 340)" filter="url(#dropShadow)">
    <path d="M-30,-45 Q0,-65 30,-45 Q40,30 0,60 Q-40,30 -30,-45 Z" fill="#eab308" stroke="#78350f" stroke-width="2.5"/>
    <ellipse cx="-12" cy="-10" rx="8" ry="5" fill="#0f172a"/>
    <ellipse cx="12" cy="-10" rx="8" ry="5" fill="#0f172a"/>
    <polygon points="0,-5 0,15 -10,15" fill="#ef4444"/>
    <path d="M-15,30 Q0,45 15,30" stroke="#ef4444" stroke-width="4" fill="none"/>
  </g>
  <g transform="translate(820, 360)" filter="url(#dropShadow)">
    <path d="M-25,-35 Q0,-55 25,-35 Q35,25 0,50 Q-35,25 -25,-35 Z" fill="#ec4899" stroke="#9d174d" stroke-width="2.5"/>
    <ellipse cx="-10" cy="-8" rx="6" ry="4" fill="#0f172a"/>
    <ellipse cx="10" cy="-8" rx="6" ry="4" fill="#0f172a"/>
  </g>
  <!-- RAD (Avental e Roupas Bordadas do Pintor Penduradas no Cabideiro) -->
  <g transform="translate(1000, 440)" filter="url(#dropShadow)">
    <line x1="0" y1="-80" x2="0" y2="180" stroke="#78350f" stroke-width="6"/>
    <path d="M-35,-50 L35,-50 L45,60 L-45,60 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <circle cx="-15" cy="-10" r="8" fill="#ef4444"/>
    <circle cx="15" cy="15" r="10" fill="#facc15"/>
    <circle cx="-10" cy="35" r="7" fill="#10b981"/>
  </g>
</svg>`;
}

// Scene 12: "Roda de contadores de histórias" (objects: lantern [lanp], drum [tanbou], house [kay], food [manje])
export function renderCultura12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Roda de contadores de histórias - Kilti</title>
  <desc>Ghibli anime art: Encontro noturno sob as estrelas (Krik? Krak!), lamparina brilhante, tambor e casinhas.</desc>
  ${getGhibliDefs()}
  <!-- Starry Night Sky -->
  <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
  ${Array.from({length: 35}, (_, i) => `<circle cx="${(i * 37) % 1200}" cy="${(i * 21) % 360}" r="${(i % 3) + 1.2}" fill="#ffffff" opacity="${0.4 + (i%5)*0.12}"/>`).join("")}
  <circle cx="200" cy="140" r="35" fill="#fef08a" opacity="0.85"/>
  <!-- KAY (Silhuetas Acolhedoras das Casinhas da Comunidade) -->
  <g transform="translate(860, 440)" filter="url(#dropShadow)">
    <polygon points="-120,40 0,-50 120,40" fill="#78350f"/>
    <rect x="-100" y="40" width="200" height="140" fill="#334155"/>
    <rect x="-30" y="70" width="60" height="110" fill="#451a03"/>
    <rect x="-80" y="60" width="40" height="40" fill="#fef08a" opacity="0.9"/>
  </g>
  <!-- Gathering Ground -->
  <path d="M-50,580 L1250,580 L1250,800 L-50,800 Z" fill="#1e293b"/>
  <!-- LANP (Lamparina Central Iluminando a Roda de Ouvintes) -->
  <g transform="translate(600, 600)" filter="url(#dropShadow)">
    <!-- Light Glow -->
    <circle cx="0" cy="0" r="160" fill="url(#sunGlowSunset)" opacity="0.75"/>
    <circle cx="0" cy="0" r="70" fill="#fef08a" opacity="0.9"/>
    <!-- Brass Lantern -->
    <rect x="-18" y="-30" width="36" height="60" rx="8" fill="#e2e8f0" opacity="0.85" stroke="#78350f" stroke-width="3"/>
    <polygon points="-22,-30 22,-30 0,-55" fill="#78350f"/>
    <circle cx="0" cy="0" r="10" fill="#ef4444"/>
    <path d="M-22,-50 Q0,-75 22,-50" stroke="#78350f" stroke-width="4" fill="none"/>
  </g>
  <!-- TANBOU (Tambor Tradicional no Pátio) -->
  <g transform="translate(380, 640)" filter="url(#dropShadow)">
    <path d="M-35,-45 L35,-45 Q45,10 28,45 L-28,45 Q-45,10 -35,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="35" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-32,-35 L-16,10 L0,-35 L16,10 L32,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
  <!-- MANJE (Tigela e Cesto com Petiscos Tradicionais Servidos na Roda) -->
  <g transform="translate(800, 660)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="45" ry="20" fill="#a16207" stroke="#713f12" stroke-width="2"/>
    <circle cx="-15" cy="-8" r="12" fill="#fef08a"/>
    <circle cx="10" cy="-10" r="10" fill="#eab308"/>
    <circle cx="0" cy="-4" r="11" fill="#f97316"/>
  </g>
</svg>`;
}

// Scene 13: "Oficina de escultura em ferro" (objects: mask [mask], vendor [machann], house [kay], flag [drapo])
export function renderCultura13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Oficina de escultura em ferro - Kilti</title>
  <desc>Ghibli anime art: Ateliê de ferro batido de Noailles, esculturas de máscara, artesão, galpão e bandeira.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 160, 48)}
  ${drawGhibliCloud(300, 140, 0.9)}
  <!-- KAY (Galpão Rústico de Artesanato com Paredes de Pedra) -->
  <g transform="translate(300, 420)" filter="url(#dropShadow)">
    <polygon points="-220,20 0,-80 220,20" fill="#78350f"/>
    <rect x="-180" y="20" width="360" height="240" fill="url(#stoneTone)" stroke="#3e2515" stroke-width="3"/>
    <rect x="-50" y="80" width="100" height="180" fill="#451a03"/>
  </g>
  <!-- DRAPO (Bandeira Tremulando no Mastro ao Lado da Oficina) -->
  <g transform="translate(560, 340)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="340" stroke="#334155" stroke-width="5"/>
    <polygon points="0,0 90,15 90,75 0,60" fill="#0284c7"/>
    <polygon points="0,60 90,75 90,135 0,120" fill="#dc2626"/>
  </g>
  <!-- MASK (Grande Escultura de Máscara em Ferro Batido / Fer Découpé) -->
  <g transform="translate(860, 460)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="90" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>
    <!-- Chiseled cutouts -->
    <ellipse cx="-30" cy="-20" rx="18" ry="12" fill="#ffffff"/>
    <ellipse cx="30" cy="-20" rx="18" ry="12" fill="#ffffff"/>
    <circle cx="-30" cy="-20" r="6" fill="#0f172a"/>
    <circle cx="30" cy="-20" r="6" fill="#0f172a"/>
    <path d="M-40,40 Q0,70 40,40" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Iron Sunburst Rays -->
    ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => `<line x1="${Math.cos(deg*Math.PI/180)*90}" y1="${Math.sin(deg*Math.PI/180)*90}" x2="${Math.cos(deg*Math.PI/180)*130}" y2="${Math.sin(deg*Math.PI/180)*130}" stroke="#1e293b" stroke-width="6"/>`).join("")}
  </g>
  <!-- MACHANN (Artesão Escultor Trabalhando com Martelo e Cinzel) -->
  <g transform="translate(680, 600)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="80" rx="45" ry="15" fill="#000000" opacity="0.3"/>
    <rect x="-25" y="-40" width="50" height="90" rx="10" fill="#1d4ed8"/>
    <circle cx="0" cy="-70" r="22" fill="#8c5836"/>
    <!-- Straw hat -->
    <ellipse cx="0" cy="-85" rx="35" ry="10" fill="#facc15"/>
    <circle cx="0" cy="-92" r="18" fill="#facc15"/>
    <!-- Hammer in hand -->
    <line x1="25" y1="-20" x2="55" y2="-50" stroke="#78350f" stroke-width="6"/>
    <rect x="45" y="-62" width="22" height="16" fill="#475569"/>
  </g>
</svg>`;
}

// Scene 14: "Feira de tecidos e roupas madan sara" (objects: vendor [machann], clothing [rad], parasol [parapli], food [manje])
export function renderCultura14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Feira de tecidos e roupas madan sara - Kilti</title>
  <desc>Ghibli anime art: Mercado movimentado, vendedora madan sara, vestidos karabela bordados e sombrinhas.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(780, 160, 48)}
  ${drawGhibliCloud(240, 140, 0.95)}
  <!-- PARAPLI (Guarda-sóis Listrados da Feira) -->
  <g transform="translate(420, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="300" stroke="#543317" stroke-width="8"/>
    <path d="M-160,0 Q0,-140 160,0 Z" fill="#f43f5e" stroke="#be123c" stroke-width="3"/>
    <path d="M-100,0 Q0,-120 0,-120 Q0,-120 100,0 Z" fill="#ffffff"/>
  </g>
  <!-- Market Stalls -->
  <rect x="0" y="520" width="1200" height="40" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
  <rect x="0" y="560" width="1200" height="240" fill="#78350f"/>
  <!-- RAD (Vestidos Tradicionais Karabela com Babados e Rendas) -->
  <g transform="translate(240, 460)" filter="url(#dropShadow)">
    <path d="M-40,-50 L40,-50 L60,80 L-60,80 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
    <path d="M-55,50 Q0,80 55,50" stroke="#f43f5e" stroke-width="8" fill="none"/>
    <ellipse cx="0" cy="-60" rx="30" ry="12" fill="#ffffff"/>
  </g>
  <!-- MACHANN (Vendedora Tradicional Sorridente com Lenço Colorido) -->
  <g transform="translate(680, 500)" filter="url(#dropShadow)">
    <rect x="-35" y="-30" width="70" height="110" rx="12" fill="#f59e0b"/>
    <circle cx="0" cy="-65" r="22" fill="#8c5836"/>
    <!-- Colorful Headwrap (Madras Turban) -->
    <ellipse cx="0" cy="-80" rx="28" ry="16" fill="#ef4444"/>
    <circle cx="0" cy="-92" r="14" fill="#facc15"/>
  </g>
  <!-- MANJE (Frutas Tropicais Frescas e Pães nos Cestos da Barraca) -->
  <g transform="translate(940, 500)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="20" rx="60" ry="24" fill="#a16207" stroke="#713f12" stroke-width="3"/>
    <circle cx="-25" cy="5" r="16" fill="#eab308"/>
    <circle cx="0" cy="0" r="18" fill="#f97316"/>
    <circle cx="25" cy="5" r="15" fill="#22c55e"/>
    <circle cx="10" cy="-14" r="14" fill="#ef4444"/>
  </g>
</svg>`;
}

// Scene 15: "Procissão festiva de Rara" (objects: flag [drapo], drum [tanbou], dancer [dansè], lantern [lanp])
export function renderCultura15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Procissão festiva de Rara - Kilti</title>
  <desc>Ghibli anime art: Desfile musical de Rara ao entardecer, estandartes coloridos, tambores, dançarinos e lanternas.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 220, 52, true)}
  ${drawGhibliCloud(240, 160, 0.95, true)}
  <!-- DRAPO (Grandes Estandartes e Bandeiras de Rara com Lantejoulas) -->
  <g transform="translate(300, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="340" stroke="#78350f" stroke-width="6"/>
    <polygon points="0,0 120,20 120,110 0,90" fill="#dc2626"/>
    <polygon points="0,90 120,110 120,200 0,180" fill="#2563eb"/>
    <circle cx="60" cy="100" r="25" fill="#fef08a"/>
  </g>
  <!-- TANBOU (Tocador de Tambor Tradicional Batucando) -->
  <g transform="translate(560, 540)" filter="url(#dropShadow)">
    <path d="M-35,-45 L35,-45 Q45,10 28,45 L-28,45 Q-45,10 -35,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="35" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-32,-35 L-16,10 L0,-35 L16,10 L32,-35" stroke="#facc15" stroke-width="3" fill="none"/>
  </g>
  <!-- DANSÈ (Dançarinos Rodopiando com Bastões e Fitas de Cetim) -->
  <g transform="translate(820, 480)" filter="url(#dropShadow)">
    <path d="M-20,-20 Q-80,60 -60,110 Q0,130 60,110 Q80,60 20,-20 Z" fill="#ec4899" stroke="#be185d" stroke-width="2"/>
    <circle cx="0" cy="-60" r="18" fill="#8c5836"/>
    <!-- Raised baton with streamers -->
    <line x1="20" y1="-30" x2="60" y2="-90" stroke="#facc15" stroke-width="5"/>
    <path d="M60,-90 Q90,-80 80,-50" stroke="#ef4444" stroke-width="4" fill="none"/>
  </g>
  <!-- LANP (Lanternas Festivas Penduradas Iluminando o Cortejo) -->
  <g transform="translate(1020, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="-120" x2="0" y2="0" stroke="#0f172a" stroke-width="3"/>
    <circle cx="0" cy="0" r="30" fill="url(#sunGlowSunset)"/>
    <rect x="-18" y="-25" width="36" height="50" rx="8" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
    <circle cx="0" cy="0" r="10" fill="#ef4444"/>
  </g>
</svg>`;
}

// Scene 16: "Banquete comunitário no quintal" (objects: food [manje], house [kay], parasol [parapli], drum [tanbou])
export function renderCultura16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Banquete comunitário no quintal - Kilti</title>
  <desc>Ghibli anime art: Mesa de banquete ao ar livre, pratos haitianos deliciosos, casa colonial, guarda-sol e tambor.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 200, 50, true)}
  ${drawGhibliCloud(260, 160, 0.9, true)}
  <!-- KAY (Casa Colonial com Telhado Inclinado no Fundo) -->
  <g transform="translate(240, 380)" filter="url(#dropShadow)">
    <polygon points="-160,40 0,-60 160,40" fill="#78350f"/>
    <rect x="-140" y="40" width="280" height="180" fill="#fef3c7" stroke="#3e2515" stroke-width="3"/>
    <rect x="-40" y="90" width="80" height="130" fill="#451a03"/>
  </g>
  <!-- PARAPLI (Guarda-sol Proporcionando Sombra sobre a Mesa) -->
  <g transform="translate(760, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="300" stroke="#543317" stroke-width="8"/>
    <path d="M-180,0 Q0,-150 180,0 Z" fill="#0284c7" stroke="#0369a1" stroke-width="3"/>
    <path d="M-110,0 Q0,-130 0,-130 Q0,-130 110,0 Z" fill="#fef08a"/>
  </g>
  <!-- Banquet Wooden Table -->
  <rect x="360" y="520" width="760" height="40" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
  <rect x="400" y="560" width="680" height="180" fill="#3e2515"/>
  <!-- MANJE (Pratos Tradicionais: Travessas com Griot, Diri ak Djon-Djon e Banann Peze) -->
  <g transform="translate(520, 500)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="15" rx="55" ry="20" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
    <circle cx="-18" cy="8" r="14" fill="#78350f"/> <!-- Griot -->
    <circle cx="15" cy="8" r="15" fill="#facc15"/> <!-- Fried plantain -->
    <ellipse cx="0" cy="0" rx="20" ry="10" fill="#1e293b"/> <!-- Black mushroom rice -->
  </g>
  <g transform="translate(700, 500)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="15" rx="50" ry="18" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
    <circle cx="-12" cy="6" r="12" fill="#ef4444"/> <!-- Pikli / hot peppers -->
    <circle cx="16" cy="6" r="14" fill="#eab308"/>
  </g>
  <!-- TANBOU (Tambor Próximo para a Celebração Pós-Jantar) -->
  <g transform="translate(180, 620)" filter="url(#dropShadow)">
    <path d="M-35,-45 L35,-45 Q45,10 28,45 L-28,45 Q-45,10 -35,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="35" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
  </g>
</svg>`;
}

// Scene 17: "Confecção de tambores tradicionais" (objects: drum [tanbou], house [kay], mask [mask], lantern [lanp])
export function renderCultura17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Confecção de tambores tradicionais - Kilti</title>
  <desc>Ghibli anime art: Oficina de luthier com troncos entalhados, tambor em amarração, casinha, máscara e lamparina.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="#fef3c7" filter="url(#ghibliPaper)" />
  <!-- KAY (Oficina de Madeira Aconchegante) -->
  <rect x="0" y="180" width="1200" height="30" fill="#78350f"/>
  <rect x="0" y="210" width="1200" height="350" fill="#fed7aa" opacity="0.3"/>
  <!-- Workbench -->
  <rect x="0" y="520" width="1200" height="40" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
  <rect x="0" y="560" width="1200" height="240" fill="#451a03"/>
  <!-- LANP (Lanterna de Querosene Suspensa no Teto da Oficina) -->
  <g transform="translate(300, 280)" filter="url(#dropShadow)">
    <line x1="0" y1="-100" x2="0" y2="0" stroke="#0f172a" stroke-width="3"/>
    <circle cx="0" cy="0" r="50" fill="url(#sunGlowSunset)" opacity="0.8"/>
    <rect x="-16" y="-22" width="32" height="44" rx="6" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
    <circle cx="0" cy="0" r="8" fill="#ef4444"/>
  </g>
  <!-- MASK (Máscara Talhada em Madeira na Parede da Oficina) -->
  <g transform="translate(900, 320)" filter="url(#dropShadow)">
    <path d="M-30,-45 Q0,-65 30,-45 Q40,30 0,60 Q-40,30 -30,-45 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <ellipse cx="-12" cy="-10" rx="8" ry="4" fill="#fef08a"/>
    <ellipse cx="12" cy="-10" rx="8" ry="4" fill="#fef08a"/>
  </g>
  <!-- TANBOU (Tambor Mestre Sendo Montado com Cordas e Couro) -->
  <g transform="translate(600, 500)" filter="url(#dropShadow)">
    <!-- Carved Solid Wood Body -->
    <path d="M-55,-70 L55,-70 Q70,20 42,75 L-42,75 Q-70,20 -55,-70 Z" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
    <ellipse cx="0" cy="-70" rx="55" ry="18" fill="#fef3c7" stroke="#78350f" stroke-width="3"/>
    <!-- Tension Rope Pattern -->
    <path d="M-50,-55 L-25,25 L0,-55 L25,25 L50,-55" stroke="#f59e0b" stroke-width="4" fill="none"/>
    <path d="M-38,25 L0,-25 L38,25" stroke="#f59e0b" stroke-width="3" fill="none"/>
    <!-- Wooden Tuning Pegs -->
    ${[-45, -20, 10, 35].map(x => `<rect x="${x}" y="15" width="12" height="22" rx="3" fill="#78350f"/>`).join("")}
  </g>
</svg>`;
}

// Scene 18: "Dança Yanvalou na praia" (objects: dancer [dansè], drum [tanbou], clothing [rad], flag [drapo])
export function renderCultura18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Dança Yanvalou na praia - Kilti</title>
  <desc>Ghibli anime art: Dança ritual Yanvalou à beira-mar ao entardecer, trajes brancos, tambor e bandeira sagrada.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 240, 52, true)}
  ${drawGhibliCloud(240, 160, 0.95, true)}
  <!-- Ocean Waves Rolling into Shore -->
  <path d="M-50,480 L1250,480 L1250,600 L-50,600 Z" fill="#0284c7"/>
  <path d="M-50,540 Q300,500 700,540 T1250,520 L1250,620 L-50,620 Z" fill="#38bdf8" opacity="0.6"/>
  <!-- Sandy Beach Foreground -->
  <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#fde68a"/>
  <!-- DRAPO (Bandeira Branca e Azul Cerimonial na Praia) -->
  <g transform="translate(240, 440)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="260" stroke="#78350f" stroke-width="5"/>
    <polygon points="0,0 100,18 100,88 0,70" fill="#ffffff" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="0,70 100,88 100,158 0,140" fill="#0284c7"/>
  </g>
  <!-- DANSÈ & RAD (Dançarinos com Trajes Brancos Fluidos em Movimento Ondulatório) -->
  <g transform="translate(620, 520)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="180" rx="75" ry="18" fill="#000000" opacity="0.25"/>
    <!-- Flowing White Linen Skirt -->
    <path d="M-25,-30 
      C-90,0 -130,80 -95,115 
      C-20,130 20,130 95,115 
      C130,80 90,0 25,-30 Z" 
      fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <path d="M-80,85 Q0,115 80,85" stroke="#38bdf8" stroke-width="6" fill="none"/>
    <circle cx="0" cy="-75" r="16" fill="#8c5836"/>
    <!-- White headscarf -->
    <ellipse cx="0" cy="-85" rx="20" ry="12" fill="#ffffff"/>
  </g>
  <!-- TANBOU (Tambores Sagrados Apoiados na Areia) -->
  <g transform="translate(940, 600)" filter="url(#dropShadow)">
    <path d="M-35,-50 L35,-50 Q45,10 28,50 L-28,50 Q-45,10 -35,-50 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-50" rx="35" ry="13" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-32,-40 L-16,10 L0,-40 L16,10 L32,-40" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
</svg>`;
}

// Scene 19: "Noite de carnaval com fantasias" (objects: mask [mask], dancer [dansè], lantern [lanp], clothing [rad])
export function renderCultura19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Noite de carnaval com fantasias - Kilti</title>
  <desc>Ghibli anime art: Avenida carnavalesca noturna iluminada, dançarinos com plumas e lantejoulas, máscara gigante e lanternas.</desc>
  ${getGhibliDefs()}
  <!-- Festive Night Sky -->
  <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
  ${Array.from({length: 30}, (_, i) => `<circle cx="${(i * 41) % 1200}" cy="${(i * 23) % 320}" r="${(i % 3) + 1.2}" fill="#ffffff" opacity="${0.4 + (i%5)*0.12}"/>`).join("")}
  <!-- LANP (Cordões de Lanternas Coloridas Iluminando a Avenida) -->
  <line x1="0" y1="120" x2="1200" y2="120" stroke="#64748b" stroke-width="2"/>
  ${[120, 280, 440, 600, 760, 920, 1080].map((x, i) => `
  <g transform="translate(${x}, 120)" filter="url(#dropShadow)">
    <circle cx="0" cy="30" r="35" fill="url(#sunGlowSunset)" opacity="0.8"/>
    <circle cx="0" cy="30" r="22" fill="${["#f43f5e", "#facc15", "#38bdf8", "#4ade80"][i%4]}"/>
    <circle cx="0" cy="30" r="10" fill="#ffffff"/>
  </g>`).join("")}
  <!-- Carnival Street Floor -->
  <path d="M-50,560 L1250,560 L1250,800 L-50,800 Z" fill="#1e1b4b"/>
  <!-- MASK (Máscara Monumental de Carnaval de Papier-Mâché) -->
  <g transform="translate(360, 480)" filter="url(#dropShadow)">
    <path d="M-60,-80 Q0,-120 60,-80 Q80,40 0,100 Q-80,40 -60,-80 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
    <!-- Big Carnival Eyes -->
    <ellipse cx="-25" cy="-20" rx="18" ry="12" fill="#ffffff"/>
    <ellipse cx="25" cy="-20" rx="18" ry="12" fill="#ffffff"/>
    <circle cx="-25" cy="-20" r="7" fill="#0f172a"/>
    <circle cx="25" cy="-20" r="7" fill="#0f172a"/>
    <!-- Feathers on top -->
    <path d="M0,-110 Q-30,-180 -50,-150" stroke="#ef4444" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M0,-110 Q0,-190 0,-160" stroke="#3b82f6" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M0,-110 Q30,-180 50,-150" stroke="#10b981" stroke-width="12" stroke-linecap="round" fill="none"/>
  </g>
  <!-- DANSÈ & RAD (Dançarinos Vestindo Trajes Festivos Reluzentes) -->
  <g transform="translate(800, 520)" filter="url(#dropShadow)">
    <path d="M-25,-30 Q-90,50 -70,110 Q0,130 70,110 Q90,50 25,-30 Z" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <path d="M-60,80 Q0,110 60,80" stroke="#facc15" stroke-width="8" fill="none"/>
    <circle cx="0" cy="-70" r="18" fill="#8c5836"/>
    <!-- Feather crown -->
    <path d="M0,-85 Q-20,-130 -30,-110" stroke="#f43f5e" stroke-width="8" fill="none"/>
    <path d="M0,-85 Q20,-130 30,-110" stroke="#38bdf8" stroke-width="8" fill="none"/>
  </g>
</svg>`;
}

// Scene 20: "Mercado sob sombrinhas floridas" (objects: parasol [parapli], vendor [machann], food [manje], house [kay])
export function renderCultura20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Mercado sob sombrinhas floridas - Kilti</title>
  <desc>Ghibli anime art: Mercado de rua ao entardecer, guarda-sóis coloridos, feirante haitiana, cestos de frutas e casinhas.</desc>
  ${getGhibliDefs()}
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(850, 220, 52, true)}
  ${drawGhibliCloud(240, 160, 0.95, true)}
  <!-- KAY (Casinhas Tradicionais Gingerbread em Fila) -->
  <g transform="translate(260, 420)" filter="url(#dropShadow)">
    <polygon points="-120,20 0,-60 120,20" fill="#78350f"/>
    <rect x="-100" y="20" width="200" height="150" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
    <rect x="-30" y="70" width="60" height="100" fill="#451a03"/>
    <rect x="-80" y="50" width="35" height="35" fill="#fef08a"/>
    <rect x="45" y="50" width="35" height="35" fill="#fef08a"/>
  </g>
  <!-- PARAPLI (Guarda-sóis Floridos e Vibrantes) -->
  <g transform="translate(540, 360)" filter="url(#dropShadow)">
    <line x1="0" y1="0" x2="0" y2="300" stroke="#543317" stroke-width="7"/>
    <path d="M-150,0 Q0,-130 150,0 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
    <path d="M-90,0 Q0,-115 0,-115 Q0,-115 90,0 Z" fill="#ef4444"/>
  </g>
  <!-- Market Counter -->
  <rect x="360" y="540" width="840" height="40" fill="url(#woodTone)" stroke="#3e2515" stroke-width="3"/>
  <rect x="360" y="580" width="840" height="220" fill="#78350f"/>
  <!-- MACHANN (Feirante Acolhedora Arrumando os Produtos) -->
  <g transform="translate(740, 500)" filter="url(#dropShadow)">
    <rect x="-30" y="-30" width="60" height="100" rx="10" fill="#0284c7"/>
    <circle cx="0" cy="-60" r="20" fill="#8c5836"/>
    <!-- Headscarf -->
    <ellipse cx="0" cy="-75" rx="24" ry="14" fill="#facc15"/>
  </g>
  <!-- MANJE (Frutas e Doces em Travessas e Cestos Artesanais) -->
  <g transform="translate(980, 520)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="15" rx="50" ry="18" fill="#a16207" stroke="#713f12" stroke-width="2"/>
    <circle cx="-16" cy="5" r="14" fill="#ef4444"/> <!-- Mango -->
    <circle cx="12" cy="5" r="15" fill="#eab308"/> <!-- Banana/papaya -->
    <circle cx="0" cy="-6" r="13" fill="#22c55e"/> <!-- Avocado -->
  </g>
</svg>`;
}


