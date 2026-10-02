import { getGhibliDefs, drawGhibliCloud, drawGhibliSun } from "./master-base.mjs";
import { renderReligiao as renderReligiao01 } from "./master-scenes-2.mjs";

export { renderReligiao01 };

// Scene 2: "Capela na montanha"
export function renderReligiao02() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Capela na montanha - Relijyon</title>
  <desc>Ghibli anime art: Capela na montanha com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,520 Q320,440 680,490 T1250,470 L1250,800 L-50,800 Z" fill="url(#hillDistant)" opacity="0.6"/>
        <path d="M-50,590 Q350,540 750,590 T1250,570 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(540, 530) scale(1.35)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(860, 620) scale(1.3)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(340, 680) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 3: "Velas ao anoitecer"
export function renderReligiao03() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Velas ao anoitecer - Relijyon</title>
  <desc>Ghibli anime art: Velas ao anoitecer com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <rect x="0" y="580" width="1200" height="220" fill="url(#woodTone)"/>
        <g transform="translate(600, 580) scale(1.6)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(420, 670) scale(1.45)" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>
        <g transform="translate(600, 690) scale(1.2)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 4: "Pomba sobre o jardim"
export function renderReligiao04() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pomba sobre o jardim - Relijyon</title>
  <desc>Ghibli anime art: Pomba sobre o jardim com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(840, 260, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(260, 540) scale(1.05)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(600, 320) scale(1.45) rotate(-15)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
        <g transform="translate(720, 680) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
        <g transform="translate(900, 680) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 5: "Sinos da igreja"
export function renderReligiao05() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Sinos da igreja - Relijyon</title>
  <desc>Ghibli anime art: Sinos da igreja com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(900, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(500, 520) scale(1.35)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(880, 480) scale(1.5)" filter="url(#dropShadow)">
    <!-- Yoke arch beam -->
    <rect x="-35" y="-55" width="70" height="15" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <circle cx="0" cy="-48" r="5" fill="#facc15"/>
    <!-- Polished Bronze Church Bell -->
    <path d="M-30,20 Q-32,-25 -14,-35 L14,-35 Q32,-25 30,20 L38,32 Q0,38 -38,32 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="38" r="7" fill="#78350f"/> <!-- Clapper -->
  </g>
        <g transform="translate(280, 620) scale(1.3)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
      
</svg>`;
}

// Scene 6: "Interior da capela"
export function renderReligiao06() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Interior da capela - Relijyon</title>
  <desc>Ghibli anime art: Interior da capela com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(320, 270, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <rect width="1200" height="800" fill="#1c1917" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 320) scale(1.4)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="55" fill="#1e1b4b" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="48" fill="#0284c7" opacity="0.85"/>
    <path d="M0,0 Q0,-25 0,-46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q17.677669529663685,-17.67766952966369 32.526911934581186,-32.526911934581186" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q25,-1.5308084989341915e-15 46,-2.8166876380389124e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q17.67766952966369,17.677669529663685 32.526911934581186,32.526911934581186" stroke="#10b981" stroke-width="7" fill="none"/><path d="M0,0 Q3.061616997868383e-15,25 5.633375276077825e-15,46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663685,17.677669529663692 -32.526911934581186,32.52691193458119" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q-25,4.592425496802574e-15 -46,8.450062914116736e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663692,-17.677669529663685 -32.52691193458119,-32.52691193458118" stroke="#10b981" stroke-width="7" fill="none"/>
    <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#78350f" stroke-width="2"/>
    <circle cx="0" cy="0" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(600, 620) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
  </g>
        <g transform="translate(280, 650) scale(1.3)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(920, 670) scale(1.35)" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>
      
</svg>`;
}

// Scene 7: "Caminho de flores"
export function renderReligiao07() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Caminho de flores - Relijyon</title>
  <desc>Ghibli anime art: Caminho de flores com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 160, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(860, 530) scale(1.15)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(320, 610) scale(1.4)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(520, 360) scale(1.35) rotate(10)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
        <g transform="translate(500, 680) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 8: "Vitral iluminado"
export function renderReligiao08() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vitral iluminado - Relijyon</title>
  <desc>Ghibli anime art: Vitral iluminado com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 190, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#020617" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 340) scale(1.6)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="55" fill="#1e1b4b" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="48" fill="#0284c7" opacity="0.85"/>
    <path d="M0,0 Q0,-25 0,-46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q17.677669529663685,-17.67766952966369 32.526911934581186,-32.526911934581186" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q25,-1.5308084989341915e-15 46,-2.8166876380389124e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q17.67766952966369,17.677669529663685 32.526911934581186,32.526911934581186" stroke="#10b981" stroke-width="7" fill="none"/><path d="M0,0 Q3.061616997868383e-15,25 5.633375276077825e-15,46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663685,17.677669529663692 -32.526911934581186,32.52691193458119" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q-25,4.592425496802574e-15 -46,8.450062914116736e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663692,-17.677669529663685 -32.52691193458119,-32.52691193458118" stroke="#10b981" stroke-width="7" fill="none"/>
    <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#78350f" stroke-width="2"/>
    <circle cx="0" cy="0" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(420, 660) scale(1.4)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(780, 670) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>
      
</svg>`;
}

// Scene 9: "Pequena igreja da vila"
export function renderReligiao09() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Pequena igreja da vila - Relijyon</title>
  <desc>Ghibli anime art: Pequena igreja da vila com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(350, 280, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(540, 520) scale(1.4)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(240, 520) scale(1.3)" filter="url(#dropShadow)">
    <!-- Yoke arch beam -->
    <rect x="-35" y="-55" width="70" height="15" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <circle cx="0" cy="-48" r="5" fill="#facc15"/>
    <!-- Polished Bronze Church Bell -->
    <path d="M-30,20 Q-32,-25 -14,-35 L14,-35 Q32,-25 30,20 L38,32 Q0,38 -38,32 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="38" r="7" fill="#78350f"/> <!-- Clapper -->
  </g>
        <g transform="translate(880, 680) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 10: "Celebração ao ar livre"
export function renderReligiao10() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Celebração ao ar livre - Relijyon</title>
  <desc>Ghibli anime art: Celebração ao ar livre com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(880, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 580) scale(1.5)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(340, 340) scale(1.4) rotate(-20)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
        <g transform="translate(450, 660) scale(1.35)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(780, 680) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>
      
</svg>`;
}

// Scene 11: "Campanário ao amanhecer"
export function renderReligiao11() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Campanário ao amanhecer - Relijyon</title>
  <desc>Ghibli anime art: Campanário ao amanhecer com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(930, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(450, 520) scale(1.4)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(880, 480) scale(1.55)" filter="url(#dropShadow)">
    <!-- Yoke arch beam -->
    <rect x="-35" y="-55" width="70" height="15" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <circle cx="0" cy="-48" r="5" fill="#facc15"/>
    <!-- Polished Bronze Church Bell -->
    <path d="M-30,20 Q-32,-25 -14,-35 L14,-35 Q32,-25 30,20 L38,32 Q0,38 -38,32 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="38" r="7" fill="#78350f"/> <!-- Clapper -->
  </g>
        <g transform="translate(720, 320) scale(1.35) rotate(-15)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
      
</svg>`;
}

// Scene 12: "Vitral gótico multicolorido"
export function renderReligiao12() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vitral gótico multicolorido - Relijyon</title>
  <desc>Ghibli anime art: Vitral gótico multicolorido com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(890, 150, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 320) scale(1.5)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="55" fill="#1e1b4b" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="48" fill="#0284c7" opacity="0.85"/>
    <path d="M0,0 Q0,-25 0,-46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q17.677669529663685,-17.67766952966369 32.526911934581186,-32.526911934581186" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q25,-1.5308084989341915e-15 46,-2.8166876380389124e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q17.67766952966369,17.677669529663685 32.526911934581186,32.526911934581186" stroke="#10b981" stroke-width="7" fill="none"/><path d="M0,0 Q3.061616997868383e-15,25 5.633375276077825e-15,46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663685,17.677669529663692 -32.526911934581186,32.52691193458119" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q-25,4.592425496802574e-15 -46,8.450062914116736e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663692,-17.677669529663685 -32.52691193458119,-32.52691193458118" stroke="#10b981" stroke-width="7" fill="none"/>
    <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#78350f" stroke-width="2"/>
    <circle cx="0" cy="0" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(600, 590) scale(1.35)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(600, 690) scale(1.35)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 13: "Altar com velas e escrituras"
export function renderReligiao13() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Altar com velas e escrituras - Relijyon</title>
  <desc>Ghibli anime art: Altar com velas e escrituras com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(820, 270, 52, true)}
  ${drawGhibliCloud(240, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <rect width="1200" height="800" fill="#1c1917" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 520) scale(1.45)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(420, 650) scale(1.4)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(780, 650) scale(1.4)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(600, 670) scale(1.5)" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>
      
</svg>`;
}

// Scene 14: "Revoada de pombas brancas"
export function renderReligiao14() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Revoada de pombas brancas - Relijyon</title>
  <desc>Ghibli anime art: Revoada de pombas brancas com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(940, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(780, 530) scale(1.25)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(320, 320) scale(1.4) rotate(-25)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
        <g transform="translate(480, 260) scale(1.2) rotate(-10)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
        <g transform="translate(640, 340) scale(1.3) rotate(-15)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
        <g transform="translate(220, 620) scale(1.35)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
      
</svg>`;
}

// Scene 15: "Procissão com flores e velas"
export function renderReligiao15() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Procissão com flores e velas - Relijyon</title>
  <desc>Ghibli anime art: Procissão com flores e velas com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(340, 290, 52, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(860, 530) scale(1.15)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(340, 600) scale(1.4)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(540, 660) scale(1.4)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(700, 680) scale(1.35)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 16: "Interior sereno do santuário"
export function renderReligiao16() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Interior sereno do santuário - Relijyon</title>
  <desc>Ghibli anime art: Interior sereno do santuário com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(950, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <rect width="1200" height="800" fill="#0f172a" filter="url(#ghibliPaper)" />
        <polygon points="-50,560 1250,560 1250,800 -50,800" fill="url(#stoneTone)"/>
        <g transform="translate(600, 330) scale(1.45)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="55" fill="#1e1b4b" stroke="#78350f" stroke-width="4"/>
    <circle cx="0" cy="0" r="48" fill="#0284c7" opacity="0.85"/>
    <path d="M0,0 Q0,-25 0,-46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q17.677669529663685,-17.67766952966369 32.526911934581186,-32.526911934581186" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q25,-1.5308084989341915e-15 46,-2.8166876380389124e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q17.67766952966369,17.677669529663685 32.526911934581186,32.526911934581186" stroke="#10b981" stroke-width="7" fill="none"/><path d="M0,0 Q3.061616997868383e-15,25 5.633375276077825e-15,46" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663685,17.677669529663692 -32.526911934581186,32.52691193458119" stroke="#facc15" stroke-width="7" fill="none"/><path d="M0,0 Q-25,4.592425496802574e-15 -46,8.450062914116736e-15" stroke="#3b82f6" stroke-width="7" fill="none"/><path d="M0,0 Q-17.677669529663692,-17.677669529663685 -32.52691193458119,-32.52691193458118" stroke="#10b981" stroke-width="7" fill="none"/>
    <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#78350f" stroke-width="2"/>
    <circle cx="0" cy="0" r="6" fill="#ef4444"/>
  </g>
        <g transform="translate(350, 650) scale(1.35)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(600, 670) scale(1.45)" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>
        <g transform="translate(850, 690) scale(1.2)" filter="url(#dropShadow)">
    
      <g transform="translate(-120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(-40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(40, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
      <g transform="translate(120, 0)">
        <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <rect x="-28" y="0" width="56" height="12" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
        <line x1="-24" y1="12" x2="-24" y2="40" stroke="#451a03" stroke-width="4"/>
        <line x1="24" y1="12" x2="24" y2="40" stroke="#451a03" stroke-width="4"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 17: "Capela costeira com cruz de pedra"
export function renderReligiao17() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Capela costeira com cruz de pedra - Relijyon</title>
  <desc>Ghibli anime art: Capela costeira com cruz de pedra com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skySunset)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(600, 320, 56, true)}
  ${drawGhibliCloud(880, 140, 0.9, true)}
  ${drawGhibliCloud(600, 120, 0.75, true)}
  
  
        <path d="M-50,500 L1250,500 L1250,800 L-50,800 Z" fill="url(#waterTone)"/>
        <path d="M-50,600 Q350,550 750,600 T1250,580 L1250,800 L-50,800 Z" fill="url(#stoneTone)"/>
        <g transform="translate(450, 520) scale(1.35)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(860, 610) scale(1.4)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(680, 360) scale(1.35) rotate(-15)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
      
</svg>`;
}

// Scene 18: "Grande sino de bronze"
export function renderReligiao18() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Grande sino de bronze - Relijyon</title>
  <desc>Ghibli anime art: Grande sino de bronze com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(910, 140, 48, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(600, 480) scale(1.7)" filter="url(#dropShadow)">
    <!-- Yoke arch beam -->
    <rect x="-35" y="-55" width="70" height="15" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <circle cx="0" cy="-48" r="5" fill="#facc15"/>
    <!-- Polished Bronze Church Bell -->
    <path d="M-30,20 Q-32,-25 -14,-35 L14,-35 Q32,-25 30,20 L38,32 Q0,38 -38,32 Z" fill="url(#brassTone)" stroke="#78350f" stroke-width="2.5"/>
    <circle cx="0" cy="38" r="7" fill="#78350f"/> <!-- Clapper -->
  </g>
        <g transform="translate(240, 620) scale(1.3)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(920, 360) scale(1.35) rotate(-20)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
      
</svg>`;
}

// Scene 19: "Jardim de oração com lírios"
export function renderReligiao19() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Jardim de oração com lírios - Relijyon</title>
  <desc>Ghibli anime art: Jardim de oração com lírios com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDay)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(920, 150, 50, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="url(#hillNear)"/>
        <g transform="translate(260, 540) scale(1.15)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(600, 590) scale(1.4)" filter="url(#dropShadow)">
    <!-- Sacred Cross on stone plinth -->
    <rect x="-25" y="45" width="50" height="20" rx="3" fill="url(#stoneTone)" stroke="#44403c" stroke-width="2"/>
    <!-- Wooden / Gold cross -->
    <line x1="0" y1="45" x2="0" y2="-80" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="-35" y1="-40" x2="35" y2="-40" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner gold inlay -->
    <line x1="0" y1="40" x2="0" y2="-75" stroke="#facc15" stroke-width="4"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#facc15" stroke-width="4"/>
  </g>
        <g transform="translate(820, 360) scale(1.3) rotate(-15)" filter="url(#dropShadow)">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <!-- Swept Wings -->
    <path d="M-6,0 Q-15,-45 -40,-35 Q-25,-10 4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M-6,0 Q15,-45 40,-35 Q25,-10 -4,-5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Tail -->
    <polygon points="-25,0 -48,-8 -44,8 -25,4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Head & Olive twig -->
    <circle cx="28" cy="-5" r="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="36,-5 44,-2 36,0" fill="#f59e0b"/>
    <circle cx="31" cy="-7" r="1.5" fill="#0f172a"/>
    <path d="M42,-1 Q48,-6 54,-2" stroke="#15803d" stroke-width="2" fill="none"/>
    <circle cx="50" cy="-5" r="2.5" fill="#22c55e"/>
  </g>
        <g transform="translate(420, 680) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
        <g transform="translate(780, 680) scale(1.4)" filter="url(#dropShadow)">
    
      <g transform="translate(-25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(0, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
      <g transform="translate(25, 0)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#15803d" stroke-width="2.5"/>
        <polygon points="0,-15 12,5 -12,5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="#facc15"/>
      </g>
    
  </g>
      
</svg>`;
}

// Scene 20: "Vigília de velas sob as estrelas"
export function renderReligiao20() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <title>Vigília de velas sob as estrelas - Relijyon</title>
  <desc>Ghibli anime art: Vigília de velas sob as estrelas com capelas históricas, fé e iluminação sagrada.</desc>
  ${getGhibliDefs()}
  
  <rect width="1200" height="800" fill="url(#skyDusk)" filter="url(#ghibliPaper)" />
  ${drawGhibliSun(960, 180, 40, false)}
  ${drawGhibliCloud(240, 180, 0.9, false)}
  ${drawGhibliCloud(600, 120, 0.75, false)}
  
  
        <path d="M-50,580 Q350,530 750,580 T1250,560 L1250,800 L-50,800 Z" fill="#0f172a"/>
        <g transform="translate(340, 540) scale(1.2)" filter="url(#dropShadow)">
    <!-- Church Nave -->
    <rect x="-90" y="-70" width="180" height="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-105,-70 0,-150 105,-70" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Belfry Steeple Tower on Left -->
    <rect x="-115" y="-180" width="55" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="-125,-180 -87,-260 -50,-180" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5"/>
    <!-- Cross atop steeple -->
    <line x1="-87" y1="-260" x2="-87" y2="-290" stroke="#facc15" stroke-width="4"/>
    <line x1="-97" y1="-278" x2="-77" y2="-278" stroke="#facc15" stroke-width="4"/>
    <!-- Belfry bell arched window -->
    <path d="M-100,-120 L-100,-150 Q-87,-165 -75,-150 L-75,-120 Z" fill="#1e293b"/>
    <ellipse cx="-87" cy="-135" rx="7" ry="10" fill="#facc15"/>
    <!-- Arched Portal Door -->
    <path d="M-22,70 L-22,0 Q0,-20 22,0 L22,70 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Rose stained glass window -->
    <circle cx="0" cy="-45" r="24" fill="#0284c7" stroke="#b45309" stroke-width="2"/>
    <line x1="0" y1="-45" x2="0" y2="-69" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="20.784609690826528" y2="-33.00000000000001" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="2.9391523179536475e-15" y2="-21" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826525" y2="-32.999999999999986" stroke="#facc15" stroke-width="2"/><line x1="0" y1="-45" x2="-20.784609690826528" y2="-57" stroke="#facc15" stroke-width="2"/>
  </g>
        <g transform="translate(700, 640) scale(1.55)" filter="url(#dropShadow)">
    
        <rect x="-36" y="-15" width="12" height="35" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="-30" y1="-15" x2="-30" y2="-21" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="-30" cy="-29" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="-30" cy="-29" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="-30" cy="-29" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="-6" y="5" width="12" height="15" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="0" y1="5" x2="0" y2="-1" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="0" cy="-9" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="0" cy="-9" rx="2" ry="4" fill="#ffffff"/>
      
        <rect x="24" y="-25" width="12" height="45" rx="3" fill="#fef3c7" stroke="#ca8a04" stroke-width="1"/>
        <line x1="30" y1="-25" x2="30" y2="-31" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="30" cy="-39" r="16" fill="#facc15" opacity="0.4" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="-39" rx="4" ry="8" fill="#f97316"/>
        <ellipse cx="30" cy="-39" rx="2" ry="4" fill="#ffffff"/>
      
  </g>
        <g transform="translate(880, 670) scale(1.4)" filter="url(#dropShadow)">
    <path d="M-55,-10 Q-28,-22 0,-12 Q28,-22 55,-10 L50,30 Q28,18 0,26 Q-28,18 -50,30 Z" fill="#fef3c7" stroke="#78350f" stroke-width="2.5"/>
    <line x1="0" y1="-12" x2="0" y2="26" stroke="#78350f" stroke-width="2"/>
    <!-- Gold Cross on Page -->
    <line x1="-28" y1="-2" x2="-28" y2="18" stroke="#facc15" stroke-width="2.5"/>
    <line x1="-35" y1="5" x2="-21" y2="5" stroke="#facc15" stroke-width="2.5"/>
  </g>
      
</svg>`;
}
