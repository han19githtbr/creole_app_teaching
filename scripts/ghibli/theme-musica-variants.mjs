import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderMusica as renderMusica01 } from "./master-scenes-2.mjs";

export { renderMusica01 };

// Scene 2: "Concerto na praça"
export function renderMusica02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Concerto na praça - Mizik</title>
  <desc>Ghibli anime art: Concerto na praça com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(180, 560) scale(1.2)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(1020, 560) scale(1.2)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(380, 660) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(620, 580) scale(1.4) rotate(-10)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(750, 430) scale(1.35)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 3: "Estúdio de gravação musical"
export function renderMusica03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Estúdio de gravação musical - Mizik</title>
  <desc>Ghibli anime art: Estúdio de gravação musical com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#1e1b4b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(380, 600) scale(1.4)" filter="url(#dropShadow)">
    <!-- X-Stand -->
    <line x1="-50" y1="65" x2="50" y2="10" stroke="#475569" stroke-width="5"/>
    <line x1="50" y1="65" x2="-50" y2="10" stroke="#475569" stroke-width="5"/>
    <!-- Synth Body -->
    <rect x="-75" y="-5" width="150" height="22" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="-65" y="0" width="130" height="14" fill="#ffffff"/>
    
      <rect x="-60" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-49" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-38" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-27" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-16" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-5" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="6" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="17" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="28" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="39" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="50" y="0" width="6" height="9" fill="#0f172a"/>
    
    <!-- Controls & display screen -->
    <rect x="-20" y="-14" width="40" height="9" rx="2" fill="#0284c7"/>
    <circle cx="40" cy="-9" r="3" fill="#ef4444"/>
    <circle cx="50" cy="-9" r="3" fill="#22c55e"/>
  </g>
        <g transform="translate(680, 560) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="0" cy="80" r="22" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="80" x2="0" y2="-40" stroke="#94a3b8" stroke-width="5"/>
    <!-- Vintage Ribbon / Capsule Mic -->
    <rect x="-14" y="-75" width="28" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <line x1="-10" y1="-65" x2="10" y2="-65" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-55" x2="10" y2="-55" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-45" x2="10" y2="-45" stroke="#475569" stroke-width="2"/>
  </g>
        <g transform="translate(900, 620) scale(1.35)" filter="url(#dropShadow)">
    <!-- Headband arch -->
    <path d="M-35,15 Q-40,-45 0,-45 Q40,-45 35,15" stroke="#1e293b" stroke-width="6" fill="none"/>
    <!-- Earcups with padding -->
    <ellipse cx="-35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 4: "Piano ao entardecer"
export function renderMusica04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Piano ao entardecer - Mizik</title>
  <desc>Ghibli anime art: Piano ao entardecer com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <!-- Stage Spotlights -->
  <polygon points="150,-10 350,700 550,700" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="1050,-10 650,700 850,700" fill="#38bdf8" opacity="0.16" filter="url(#softGlow)"/>
        <g transform="translate(180, 560) scale(1.2)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(620, 580) scale(1.45)" filter="url(#dropShadow)">
    <!-- Grand Piano Body -->
    <path d="M-90,-10 L-90,-80 Q-60,-120 40,-120 Q110,-100 110,-10 Z" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <!-- Open Lid Prop -->
    <polygon points="-90,-80 40,-160 110,-80 -90,-80" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <line x1="40" y1="-160" x2="30" y2="-90" stroke="#facc15" stroke-width="4"/>
    <!-- Golden harp frame inside -->
    <ellipse cx="10" cy="-60" rx="40" ry="25" fill="#b45309" stroke="#facc15" stroke-width="2"/>
    <!-- Keyboard -->
    <rect x="-85" y="-10" width="190" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    
      <rect x="-80" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-67" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-54" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-41" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-28" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-15" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-2" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="11" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="24" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="37" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="50" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="63" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="76" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="89" y="-10" width="8" height="15" fill="#0f172a"/>
    
    <!-- Piano Legs -->
    <rect x="-80" y="14" width="10" height="50" fill="#0f172a"/>
    <rect x="85" y="14" width="10" height="50" fill="#0f172a"/>
  </g>
        <g transform="translate(820, 420) scale(1.4)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 5: "Banda de rua"
export function renderMusica05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Banda de rua - Mizik</title>
  <desc>Ghibli anime art: Banda de rua com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(300, 660) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(550, 580) scale(1.35) rotate(-15)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(720, 440) scale(1.35)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 6: "Palco de konpa"
export function renderMusica06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Palco de konpa - Mizik</title>
  <desc>Ghibli anime art: Palco de konpa com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 200, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <!-- Stage Spotlights -->
  <polygon points="150,-10 350,700 550,700" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="1050,-10 650,700 850,700" fill="#38bdf8" opacity="0.16" filter="url(#softGlow)"/>
        <g transform="translate(200, 550) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(1000, 550) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(480, 580) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="80" r="22" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="80" x2="0" y2="-40" stroke="#94a3b8" stroke-width="5"/>
    <!-- Vintage Ribbon / Capsule Mic -->
    <rect x="-14" y="-75" width="28" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <line x1="-10" y1="-65" x2="10" y2="-65" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-55" x2="10" y2="-55" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-45" x2="10" y2="-45" stroke="#475569" stroke-width="2"/>
  </g>
        <g transform="translate(780, 660) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
      
</svg>`;
}

// Scene 7: "Aula de teclado"
export function renderMusica07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Aula de teclado - Mizik</title>
  <desc>Ghibli anime art: Aula de teclado com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(420, 580) scale(1.35)" filter="url(#dropShadow)">
    <!-- Grand Piano Body -->
    <path d="M-90,-10 L-90,-80 Q-60,-120 40,-120 Q110,-100 110,-10 Z" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <!-- Open Lid Prop -->
    <polygon points="-90,-80 40,-160 110,-80 -90,-80" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <line x1="40" y1="-160" x2="30" y2="-90" stroke="#facc15" stroke-width="4"/>
    <!-- Golden harp frame inside -->
    <ellipse cx="10" cy="-60" rx="40" ry="25" fill="#b45309" stroke="#facc15" stroke-width="2"/>
    <!-- Keyboard -->
    <rect x="-85" y="-10" width="190" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    
      <rect x="-80" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-67" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-54" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-41" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-28" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-15" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-2" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="11" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="24" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="37" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="50" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="63" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="76" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="89" y="-10" width="8" height="15" fill="#0f172a"/>
    
    <!-- Piano Legs -->
    <rect x="-80" y="14" width="10" height="50" fill="#0f172a"/>
    <rect x="85" y="14" width="10" height="50" fill="#0f172a"/>
  </g>
        <g transform="translate(820, 600) scale(1.35)" filter="url(#dropShadow)">
    <!-- X-Stand -->
    <line x1="-50" y1="65" x2="50" y2="10" stroke="#475569" stroke-width="5"/>
    <line x1="50" y1="65" x2="-50" y2="10" stroke="#475569" stroke-width="5"/>
    <!-- Synth Body -->
    <rect x="-75" y="-5" width="150" height="22" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="-65" y="0" width="130" height="14" fill="#ffffff"/>
    
      <rect x="-60" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-49" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-38" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-27" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-16" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-5" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="6" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="17" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="28" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="39" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="50" y="0" width="6" height="9" fill="#0f172a"/>
    
    <!-- Controls & display screen -->
    <rect x="-20" y="-14" width="40" height="9" rx="2" fill="#0284c7"/>
    <circle cx="40" cy="-9" r="3" fill="#ef4444"/>
    <circle cx="50" cy="-9" r="3" fill="#22c55e"/>
  </g>
        <g transform="translate(620, 630) scale(1.3)" filter="url(#dropShadow)">
    <!-- Headband arch -->
    <path d="M-35,15 Q-40,-45 0,-45 Q40,-45 35,15" stroke="#1e293b" stroke-width="6" fill="none"/>
    <!-- Earcups with padding -->
    <ellipse cx="-35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 8: "Música no jardim"
export function renderMusica08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Música no jardim - Mizik</title>
  <desc>Ghibli anime art: Música no jardim com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(240, 580) scale(1.15)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(540, 590) scale(1.4) rotate(-10)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(760, 450) scale(1.35)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 9: "Show de luzes e som"
export function renderMusica09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Show de luzes e som - Mizik</title>
  <desc>Ghibli anime art: Show de luzes e som com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <!-- Stage Spotlights -->
  <polygon points="150,-10 350,700 550,700" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="1050,-10 650,700 850,700" fill="#38bdf8" opacity="0.16" filter="url(#softGlow)"/>
        <g transform="translate(220, 550) scale(1.3)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(980, 550) scale(1.3)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(600, 580) scale(1.45)" filter="url(#dropShadow)">
    <circle cx="0" cy="80" r="22" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="80" x2="0" y2="-40" stroke="#94a3b8" stroke-width="5"/>
    <!-- Vintage Ribbon / Capsule Mic -->
    <rect x="-14" y="-75" width="28" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <line x1="-10" y1="-65" x2="10" y2="-65" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-55" x2="10" y2="-55" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-45" x2="10" y2="-45" stroke="#475569" stroke-width="2"/>
  </g>
        <g transform="translate(600, 390) scale(1.5)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 10: "Ensaio da banda"
export function renderMusica10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Ensaio da banda - Mizik</title>
  <desc>Ghibli anime art: Ensaio da banda com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(260, 660) scale(1.3)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(580, 610) scale(1.3)" filter="url(#dropShadow)">
    <!-- X-Stand -->
    <line x1="-50" y1="65" x2="50" y2="10" stroke="#475569" stroke-width="5"/>
    <line x1="50" y1="65" x2="-50" y2="10" stroke="#475569" stroke-width="5"/>
    <!-- Synth Body -->
    <rect x="-75" y="-5" width="150" height="22" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="-65" y="0" width="130" height="14" fill="#ffffff"/>
    
      <rect x="-60" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-49" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-38" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-27" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-16" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-5" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="6" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="17" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="28" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="39" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="50" y="0" width="6" height="9" fill="#0f172a"/>
    
    <!-- Controls & display screen -->
    <rect x="-20" y="-14" width="40" height="9" rx="2" fill="#0284c7"/>
    <circle cx="40" cy="-9" r="3" fill="#ef4444"/>
    <circle cx="50" cy="-9" r="3" fill="#22c55e"/>
  </g>
        <g transform="translate(880, 590) scale(1.35) rotate(10)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(680, 680) scale(1.15)" filter="url(#dropShadow)">
    <!-- Headband arch -->
    <path d="M-35,15 Q-40,-45 0,-45 Q40,-45 35,15" stroke="#1e293b" stroke-width="6" fill="none"/>
    <!-- Earcups with padding -->
    <ellipse cx="-35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 11: "Violão acústico ao luar"
export function renderMusica11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Violão acústico ao luar - Mizik</title>
  <desc>Ghibli anime art: Violão acústico ao luar com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 170, 42, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <g transform="translate(580, 580) scale(1.5) rotate(-15)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(750, 420) scale(1.4)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 12: "Roda de tambor comunitária"
export function renderMusica12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Roda de tambor comunitária - Mizik</title>
  <desc>Ghibli anime art: Roda de tambor comunitária com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(360, 660) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(600, 660) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(840, 660) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(600, 420) scale(1.4)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 13: "Cabine de mixagem com fones"
export function renderMusica13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Cabine de mixagem com fones - Mizik</title>
  <desc>Ghibli anime art: Cabine de mixagem com fones com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#1e1b4b" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(200, 540) scale(1.15)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(540, 600) scale(1.35)" filter="url(#dropShadow)">
    <!-- X-Stand -->
    <line x1="-50" y1="65" x2="50" y2="10" stroke="#475569" stroke-width="5"/>
    <line x1="50" y1="65" x2="-50" y2="10" stroke="#475569" stroke-width="5"/>
    <!-- Synth Body -->
    <rect x="-75" y="-5" width="150" height="22" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="-65" y="0" width="130" height="14" fill="#ffffff"/>
    
      <rect x="-60" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-49" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-38" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-27" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-16" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-5" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="6" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="17" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="28" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="39" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="50" y="0" width="6" height="9" fill="#0f172a"/>
    
    <!-- Controls & display screen -->
    <rect x="-20" y="-14" width="40" height="9" rx="2" fill="#0284c7"/>
    <circle cx="40" cy="-9" r="3" fill="#ef4444"/>
    <circle cx="50" cy="-9" r="3" fill="#22c55e"/>
  </g>
        <g transform="translate(780, 630) scale(1.3)" filter="url(#dropShadow)">
    <!-- Headband arch -->
    <path d="M-35,15 Q-40,-45 0,-45 Q40,-45 35,15" stroke="#1e293b" stroke-width="6" fill="none"/>
    <!-- Earcups with padding -->
    <ellipse cx="-35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  </g>
        <g transform="translate(980, 570) scale(1.25)" filter="url(#dropShadow)">
    <circle cx="0" cy="80" r="22" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="80" x2="0" y2="-40" stroke="#94a3b8" stroke-width="5"/>
    <!-- Vintage Ribbon / Capsule Mic -->
    <rect x="-14" y="-75" width="28" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <line x1="-10" y1="-65" x2="10" y2="-65" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-55" x2="10" y2="-55" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-45" x2="10" y2="-45" stroke="#475569" stroke-width="2"/>
  </g>
      
</svg>`;
}

// Scene 14: "Piano de cauda na sala nobre"
export function renderMusica14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Piano de cauda na sala nobre - Mizik</title>
  <desc>Ghibli anime art: Piano de cauda na sala nobre com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="#1e293b"/>
        <!-- Stage Spotlights -->
  <polygon points="150,-10 350,700 550,700" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="1050,-10 650,700 850,700" fill="#38bdf8" opacity="0.16" filter="url(#softGlow)"/>
        <g transform="translate(580, 560) scale(1.5)" filter="url(#dropShadow)">
    <!-- Grand Piano Body -->
    <path d="M-90,-10 L-90,-80 Q-60,-120 40,-120 Q110,-100 110,-10 Z" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <!-- Open Lid Prop -->
    <polygon points="-90,-80 40,-160 110,-80 -90,-80" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <line x1="40" y1="-160" x2="30" y2="-90" stroke="#facc15" stroke-width="4"/>
    <!-- Golden harp frame inside -->
    <ellipse cx="10" cy="-60" rx="40" ry="25" fill="#b45309" stroke="#facc15" stroke-width="2"/>
    <!-- Keyboard -->
    <rect x="-85" y="-10" width="190" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    
      <rect x="-80" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-67" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-54" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-41" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-28" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-15" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-2" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="11" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="24" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="37" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="50" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="63" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="76" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="89" y="-10" width="8" height="15" fill="#0f172a"/>
    
    <!-- Piano Legs -->
    <rect x="-80" y="14" width="10" height="50" fill="#0f172a"/>
    <rect x="85" y="14" width="10" height="50" fill="#0f172a"/>
  </g>
        <g transform="translate(880, 580) scale(1.3)" filter="url(#dropShadow)">
    <circle cx="0" cy="80" r="22" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="80" x2="0" y2="-40" stroke="#94a3b8" stroke-width="5"/>
    <!-- Vintage Ribbon / Capsule Mic -->
    <rect x="-14" y="-75" width="28" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <line x1="-10" y1="-65" x2="10" y2="-65" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-55" x2="10" y2="-55" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-45" x2="10" y2="-45" stroke="#475569" stroke-width="2"/>
  </g>
        <g transform="translate(750, 410) scale(1.4)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 15: "Palco do festival ao entardecer"
export function renderMusica15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Palco do festival ao entardecer - Mizik</title>
  <desc>Ghibli anime art: Palco do festival ao entardecer com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <!-- Stage Spotlights -->
  <polygon points="150,-10 350,700 550,700" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="1050,-10 650,700 850,700" fill="#38bdf8" opacity="0.16" filter="url(#softGlow)"/>
        <g transform="translate(200, 550) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(450, 580) scale(1.35)" filter="url(#dropShadow)">
    <circle cx="0" cy="80" r="22" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <line x1="0" y1="80" x2="0" y2="-40" stroke="#94a3b8" stroke-width="5"/>
    <!-- Vintage Ribbon / Capsule Mic -->
    <rect x="-14" y="-75" width="28" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <line x1="-10" y1="-65" x2="10" y2="-65" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-55" x2="10" y2="-55" stroke="#475569" stroke-width="2"/><line x1="-10" y1="-45" x2="10" y2="-45" stroke="#475569" stroke-width="2"/>
  </g>
        <g transform="translate(750, 580) scale(1.4) rotate(-10)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(1000, 550) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
      
</svg>`;
}

// Scene 16: "Serenata sob as estrelas"
export function renderMusica16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Serenata sob as estrelas - Mizik</title>
  <desc>Ghibli anime art: Serenata sob as estrelas com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 L1250,600 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <g transform="translate(520, 580) scale(1.45) rotate(-15)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(700, 420) scale(1.4)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 17: "Oficina de tambores tradicionais"
export function renderMusica17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Oficina de tambores tradicionais - Mizik</title>
  <desc>Ghibli anime art: Oficina de tambores tradicionais com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(910, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <g transform="translate(180, 560) scale(1.15)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(420, 660) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(720, 660) scale(1.4)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(880, 450) scale(1.35)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 18: "Teclado eletrônico e fones"
export function renderMusica18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Teclado eletrônico e fones - Mizik</title>
  <desc>Ghibli anime art: Teclado eletrônico e fones com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(500, 600) scale(1.4)" filter="url(#dropShadow)">
    <!-- X-Stand -->
    <line x1="-50" y1="65" x2="50" y2="10" stroke="#475569" stroke-width="5"/>
    <line x1="50" y1="65" x2="-50" y2="10" stroke="#475569" stroke-width="5"/>
    <!-- Synth Body -->
    <rect x="-75" y="-5" width="150" height="22" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="-65" y="0" width="130" height="14" fill="#ffffff"/>
    
      <rect x="-60" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-49" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-38" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-27" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-16" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="-5" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="6" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="17" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="28" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="39" y="0" width="6" height="9" fill="#0f172a"/>
    
      <rect x="50" y="0" width="6" height="9" fill="#0f172a"/>
    
    <!-- Controls & display screen -->
    <rect x="-20" y="-14" width="40" height="9" rx="2" fill="#0284c7"/>
    <circle cx="40" cy="-9" r="3" fill="#ef4444"/>
    <circle cx="50" cy="-9" r="3" fill="#22c55e"/>
  </g>
        <g transform="translate(780, 630) scale(1.35)" filter="url(#dropShadow)">
    <!-- Headband arch -->
    <path d="M-35,15 Q-40,-45 0,-45 Q40,-45 35,15" stroke="#1e293b" stroke-width="6" fill="none"/>
    <!-- Earcups with padding -->
    <ellipse cx="-35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="35" cy="15" rx="14" ry="22" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  </g>
        <g transform="translate(650, 430) scale(1.4)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 19: "Trio acústico no parque"
export function renderMusica19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Trio acústico no parque - Mizik</title>
  <desc>Ghibli anime art: Trio acústico no parque com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(380, 580) scale(1.25)" filter="url(#dropShadow)">
    <!-- Grand Piano Body -->
    <path d="M-90,-10 L-90,-80 Q-60,-120 40,-120 Q110,-100 110,-10 Z" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <!-- Open Lid Prop -->
    <polygon points="-90,-80 40,-160 110,-80 -90,-80" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <line x1="40" y1="-160" x2="30" y2="-90" stroke="#facc15" stroke-width="4"/>
    <!-- Golden harp frame inside -->
    <ellipse cx="10" cy="-60" rx="40" ry="25" fill="#b45309" stroke="#facc15" stroke-width="2"/>
    <!-- Keyboard -->
    <rect x="-85" y="-10" width="190" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    
      <rect x="-80" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-67" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-54" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-41" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-28" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-15" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-2" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="11" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="24" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="37" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="50" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="63" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="76" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="89" y="-10" width="8" height="15" fill="#0f172a"/>
    
    <!-- Piano Legs -->
    <rect x="-80" y="14" width="10" height="50" fill="#0f172a"/>
    <rect x="85" y="14" width="10" height="50" fill="#0f172a"/>
  </g>
        <g transform="translate(720, 580) scale(1.35) rotate(-12)" filter="url(#dropShadow)">
    <!-- Acoustic Guitar Body -->
    <ellipse cx="0" cy="50" rx="42" ry="50" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-5" rx="32" ry="32" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <!-- Sound hole rosette -->
    <circle cx="0" cy="8" r="14" fill="#1c1917" stroke="#b45309" stroke-width="2"/>
    <circle cx="0" cy="8" r="17" fill="none" stroke="#facc15" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="-18" y="55" width="36" height="8" rx="2" fill="#292524"/>
    <!-- Neck & Fretboard -->
    <rect x="-7" y="-120" width="14" height="115" fill="#292524"/>
    <line x1="-7" y1="-100" x2="7" y2="-100" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-80" x2="7" y2="-80" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-60" x2="7" y2="-60" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-40" x2="7" y2="-40" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="-20" x2="7" y2="-20" stroke="#cbd5e1" stroke-width="1"/><line x1="-7" y1="0" x2="7" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Headstock & Tuning pegs -->
    <rect x="-9" y="-145" width="18" height="25" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <circle cx="-13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="-13" cy="-130" r="3" fill="#facc15"/>
    <circle cx="13" cy="-140" r="3" fill="#facc15"/>
    <circle cx="13" cy="-130" r="3" fill="#facc15"/>
    <!-- Strings -->
    <line x1="-4" y1="-140" x2="-4" y2="55" stroke="#fef08a" stroke-width="1"/>
    <line x1="4" y1="-140" x2="4" y2="55" stroke="#fef08a" stroke-width="1"/>
  </g>
        <g transform="translate(880, 430) scale(1.35)">
    <g transform="translate(0, 0)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
    </g>
    <g transform="translate(45, -25)">
      <ellipse rx="10" ry="7" fill="#facc15" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#facc15" stroke-width="3"/>
      <path d="M8,-30 Q22,-35 25,-20" stroke="#facc15" stroke-width="3" fill="none"/>
    </g>
    <g transform="translate(90, 15)">
      <ellipse rx="10" ry="7" fill="#f59e0b" transform="rotate(-20)"/>
      <line x1="8" y1="0" x2="8" y2="-30" stroke="#f59e0b" stroke-width="3"/>
    </g>
  </g>
      
</svg>`;
}

// Scene 20: "Grande orquestra e percussão"
export function renderMusica20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Grande orquestra e percussão - Mizik</title>
  <desc>Ghibli anime art: Grande orquestra e percussão com instrumentos musicais, som e harmonia caribenha.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <!-- Wooden Stage Floor -->
  <polygon points="-50,600 1250,600 1250,800 -50,800" fill="#78350f"/>
  <line x1="-50" y1="600" x2="1250" y2="600" stroke="#b45309" stroke-width="8"/>
  <line x1="0" y1="600" x2="-40" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="200" y1="600" x2="160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="400" y1="600" x2="360" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="600" y1="600" x2="560" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="800" y1="600" x2="760" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1000" y1="600" x2="960" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/><line x1="1200" y1="600" x2="1160" y2="800" stroke="#451a03" stroke-width="2" opacity="0.6"/>
        <!-- Stage Spotlights -->
  <polygon points="150,-10 350,700 550,700" fill="#fef08a" opacity="0.16" filter="url(#softGlow)"/>
  <polygon points="1050,-10 650,700 850,700" fill="#38bdf8" opacity="0.16" filter="url(#softGlow)"/>
        <g transform="translate(160, 550) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
        <g transform="translate(480, 570) scale(1.35)" filter="url(#dropShadow)">
    <!-- Grand Piano Body -->
    <path d="M-90,-10 L-90,-80 Q-60,-120 40,-120 Q110,-100 110,-10 Z" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <!-- Open Lid Prop -->
    <polygon points="-90,-80 40,-160 110,-80 -90,-80" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <line x1="40" y1="-160" x2="30" y2="-90" stroke="#facc15" stroke-width="4"/>
    <!-- Golden harp frame inside -->
    <ellipse cx="10" cy="-60" rx="40" ry="25" fill="#b45309" stroke="#facc15" stroke-width="2"/>
    <!-- Keyboard -->
    <rect x="-85" y="-10" width="190" height="24" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    
      <rect x="-80" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-67" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-54" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-41" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-28" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-15" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="-2" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="11" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="24" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="37" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="50" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="63" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="76" y="-10" width="8" height="15" fill="#0f172a"/>
    
      <rect x="89" y="-10" width="8" height="15" fill="#0f172a"/>
    
    <!-- Piano Legs -->
    <rect x="-80" y="14" width="10" height="50" fill="#0f172a"/>
    <rect x="85" y="14" width="10" height="50" fill="#0f172a"/>
  </g>
        <g transform="translate(820, 660) scale(1.35)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="55" rx="45" ry="12" fill="#000000" opacity="0.3"/>
    <path d="M-38,-45 L38,-45 Q48,10 32,50 L-32,50 Q-48,10 -38,-45 Z" fill="url(#woodTone)" stroke="#451a03" stroke-width="2.5"/>
    <ellipse cx="0" cy="-45" rx="38" ry="12" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <path d="M-34,-35 L-18,12 L0,-35 L18,12 L34,-35" stroke="#facc15" stroke-width="2.5" fill="none"/>
  </g>
        <g transform="translate(1040, 550) scale(1.25)" filter="url(#dropShadow)">
    <rect x="-40" y="-70" width="80" height="130" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Woofer Cone -->
    <circle cx="0" cy="15" r="28" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="15" r="12" fill="#0f172a"/>
    <!-- Tweeter -->
    <circle cx="0" cy="-35" r="16" fill="#334155" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-35" r="6" fill="#0f172a"/>
  </g>
      
</svg>`;
}
