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

