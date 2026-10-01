import { W, f, ridge, tree, pine, house, bird, sparkles, flowers, butterfly, sway, bob, spin, pulse } from "./lib.mjs";

const hills = (p, r, far = 470, mid = 560, near = 650) => `
<path d="${ridge(r, far, 40)}" fill="${p.hillFar}"/>
<path d="${ridge(r, mid, 42)}" fill="${p.hillMid}"/>
<path d="${ridge(r, near, 34)}" fill="${p.hillNear}"/>`;
const front = (p, r, y = 730) => `<path d="${ridge(r, y, 22, 150)}" fill="${p.hillFront}"/>`;

/* 1. TECNOLOGIA — oficina no campo, turbinas eólicas, drone e robozinho */
export function tecnologia(p, r) {
  const turbine = (x, y, s, dur) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-3,0 L-1.5,-120 L1.5,-120 L3,0 Z" fill="${p.wall}"/>
<g transform="translate(0,-120)"><g>${spin(dur, 0, 0)}<ellipse cx="0" cy="-34" rx="4" ry="34" fill="${p.wall}"/><ellipse cx="0" cy="-34" rx="4" ry="34" fill="${p.wall}" transform="rotate(120)"/><ellipse cx="0" cy="-34" rx="4" ry="34" fill="${p.wall}" transform="rotate(240)"/></g><circle r="5" fill="${p.wallShade}"/></g></g>`;
  const dish = `<g transform="translate(846,548)"><path d="M0,0 L0,-26" stroke="${p.stoneShade}" stroke-width="3"/><path d="M-14,-30 Q0,-16 14,-30 Z" fill="${p.wall}" transform="rotate(-25 0 -26)"/></g>`;
  return hills(p, r, 470, 560, 640) +
    turbine(240, 500, 1.0, 9) + turbine(470, 520, 0.8, 11) + turbine(980, 500, 0.9, 10) +
    `<path d="${ridge(r, 660, 20, 150)}" fill="${p.hillFront}" opacity=".0"/>` +
    // oficina
    `<g transform="translate(770,660)">
<rect x="-110" y="-110" width="220" height="110" fill="${p.wall}"/><rect x="50" y="-110" width="60" height="110" fill="${p.wallShade}" opacity=".6"/>
<path d="M-128,-110 L0,-190 L128,-110 Z" fill="${p.roof}"/><path d="M0,-190 L128,-110 L70,-110 Z" fill="${p.roofDark}" opacity=".4"/>
<path d="M-70,-128 L-20,-158 L-8,-146 L-58,-116 Z" fill="#26386b"/><path d="M8,-158 L58,-128 L46,-116 L-4,-146 Z" fill="#26386b" transform="translate(8,0)"/>
<rect x="-92" y="-84" width="60" height="44" rx="4" fill="${p.warm}">${pulse(0.85, 1, 2.6)}</rect>
<rect x="-84" y="-76" width="44" height="12" fill="#2b3d6b" opacity=".75"/><rect x="-84" y="-60" width="30" height="6" fill="#2b3d6b" opacity=".5"/>
<rect x="-10" y="-70" width="46" height="70" rx="23" fill="${p.wood}"/><circle cx="24" cy="-34" r="3" fill="${p.warm}"/>
<rect x="60" y="-84" width="34" height="34" rx="3" fill="#bfe4f2"/></g>` + dish +
    front(p, r, 720) +
    // robô simpático
    `<g transform="translate(330,686)"><g>${bob(6, 2.2)}
<ellipse cx="0" cy="44" rx="34" ry="7" fill="#000" opacity=".18"/>
<rect x="-30" y="-6" width="60" height="50" rx="24" fill="${p.wall}"/><rect x="4" y="-6" width="26" height="50" rx="13" fill="${p.wallShade}" opacity=".6"/>
<rect x="-26" y="-58" width="52" height="46" rx="20" fill="${p.wall}"/><circle cx="-10" cy="-36" r="7" fill="${p.ink}"/><circle cx="10" cy="-36" r="7" fill="${p.ink}"/>
<circle cx="-8" cy="-38" r="2.2" fill="#fff"/><circle cx="12" cy="-38" r="2.2" fill="#fff"/>
<path d="M0,-58 L0,-76" stroke="${p.stoneShade}" stroke-width="3"/><circle cx="0" cy="-80" r="6" fill="${p.accent2}">${pulse(0.3, 1, 1.2)}</circle>
<rect x="-46" y="4" width="16" height="30" rx="8" fill="${p.wallShade}"/><rect x="30" y="4" width="16" height="30" rx="8" fill="${p.wallShade}"/>
<rect x="-14" y="8" width="28" height="18" rx="4" fill="${p.accent3}" opacity=".85"/></g></g>` +
    // drone com lanterna
    `<g transform="translate(600,290)"><g>${bob(16, 4.2, 0, 18)}
<ellipse cx="0" cy="0" rx="34" ry="14" fill="${p.wall}"/><ellipse cx="6" cy="4" rx="26" ry="9" fill="${p.wallShade}" opacity=".6"/>
<circle cx="0" cy="-2" r="7" fill="${p.accent3}"/>
<path d="M-32,-8 L-56,-16 M32,-8 L56,-16" stroke="${p.stoneShade}" stroke-width="3"/>
<ellipse cx="-56" cy="-18" rx="20" ry="3" fill="${p.ink}" opacity=".55"><animate attributeName="rx" values="20;4;20" dur=".18s" repeatCount="indefinite"/></ellipse>
<ellipse cx="56" cy="-18" rx="20" ry="3" fill="${p.ink}" opacity=".55"><animate attributeName="rx" values="4;20;4" dur=".18s" repeatCount="indefinite"/></ellipse>
<path d="M0,14 L0,36" stroke="${p.stoneShade}" stroke-width="2"/><circle cx="0" cy="44" r="12" fill="${p.warm}"><animate attributeName="opacity" values=".7;1;.7" dur="1.6s" repeatCount="indefinite"/></circle></g></g>` +
    sparkles(r, 18, p, "#9ff3ff", 300, 700);
}

/* 2. NATUREZA — árvore ancestral, prado, borboletas */
export function natureza(p, r) {
  return hills(p, r, 480, 570, 650) +
    `<g transform="translate(0,0)"><ellipse cx="820" cy="700" rx="230" ry="46" fill="url(#gWater)"/><ellipse cx="820" cy="694" rx="200" ry="30" fill="#ffffff" opacity=".18"><animate attributeName="rx" values="190;214;190" dur="5s" repeatCount="indefinite"/></ellipse></g>` +
    front(p, r, 730) +
    tree(290, 720, 2.4, p, 1.4) +
    pine(560, 690, 0.9, p) + pine(1010, 672, 0.7, p) +
    flowers(r, 70, p, 705, 790) +
    butterfly(520, 560, 1.2, 6, 0, p.accent1) + butterfly(700, 500, 1.0, 7.5, 2, p.accent2) + butterfly(880, 590, 0.9, 5.5, 4, "#ffffff") +
    sparkles(r, 26, p, p.light, 250, 720) +
    bird(0, 210, 1, 60, 20, p) + bird(0, 250, 0.8, 75, 40, p);
}

/* 3. CULTURA — praça em festa com bandeirolas, lanternas e barracas */
export function cultura(p, r) {
  const flagC = ["#d21034", "#00209f", "#f4b942", "#ffffff", "#2fa36b"];
  const bunting = (y0, y1, sagY) => {
    let s = `<path d="M-20,${y0} Q${W / 2},${sagY} ${W + 20},${y1}" fill="none" stroke="${p.ink}" stroke-width="2" opacity=".7"/>`;
    for (let i = 0; i < 18; i++) {
      const t = (i + 0.5) / 18, x = -20 + t * (W + 40);
      const y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * sagY + t * t * y1;
      const c = flagC[i % flagC.length];
      s += `<g transform="translate(${f(x)},${f(y)})"><g>${sway(6, 2 + (i % 3) * 0.4, 0, 0, i * 0.3)}<path d="M-14,0 L14,0 L0,30 Z" fill="${c}"/></g></g>`;
    }
    return s;
  };
  const stall = (x, y, c1, c2) => {
    let stripes = "";
    for (let i = 0; i < 6; i++) stripes += `<path d="M${-60 + i * 20},-70 L${-50 + i * 20},-70 L${-50 + i * 20},-48 Q${-55 + i * 20},-38 ${-60 + i * 20},-48 Z" fill="${i % 2 ? c2 : c1}"/>`;
    return `<g transform="translate(${x},${y})"><rect x="-56" y="-48" width="112" height="48" fill="${p.wood}"/><rect x="-56" y="-48" width="112" height="8" fill="${p.woodLight}"/>
<path d="M-64,-70 L64,-70 L52,-100 L-52,-100 Z" fill="${c1}"/>${stripes}
<circle cx="-26" cy="-56" r="8" fill="${p.accent1}"/><circle cx="-6" cy="-56" r="8" fill="${p.accent2}"/><circle cx="14" cy="-56" r="8" fill="${p.leafLight}"/><circle cx="34" cy="-56" r="8" fill="${p.accent1}"/></g>`;
  };
  const lantern = (x, y, c, d) => `<g transform="translate(${x},${y})"><g>${bob(6, 3 + d, d)}<path d="M0,-40 L0,-14" stroke="${p.ink}" stroke-width="2"/><ellipse cx="0" cy="0" rx="15" ry="19" fill="${c}"/><ellipse cx="0" cy="0" rx="26" ry="30" fill="${c}" opacity=".28" filter="url(#fSoft)">${pulse(0.2, 0.5, 2.4, d)}</ellipse></g></g>`;
  let confetti = "";
  for (let i = 0; i < 26; i++) {
    const x = f(r() * W), d = f(6 + r() * 6), c = flagC[i % flagC.length];
    confetti += `<rect x="${x}" y="-20" width="8" height="5" rx="1.5" fill="${c}" opacity=".9"><animateTransform attributeName="transform" type="translate" values="0 0;${f((r() - 0.5) * 120)} 860" dur="${d}s" begin="${-r() * d}s" repeatCount="indefinite"/><animateTransform attributeName="transform" additive="sum" type="rotate" values="0;360" dur="${f(2 + r() * 2)}s" repeatCount="indefinite"/></rect>`;
  }
  return hills(p, r, 500, 580, 660) +
    house(150, 610, 1.2, p, "#f7d9a8", "#c8483d") + house(330, 590, 1.0, p, "#bfe6d4", "#3f6fb5") + house(880, 600, 1.15, p, "#f5c6d0", "#2d8a6b") + house(1060, 585, 1.0, p, "#ffe9a8", "#d9603f") +
    bunting(150, 190, 300) + bunting(230, 260, 380) +
    front(p, r, 740) +
    `<path d="M420,800 Q600,690 780,800 Z" fill="${p.stone}" opacity=".85"/>` +
    stall(450, 745, "#d21034", "#ffffff") + stall(760, 745, "#00209f", "#ffffff") +
    lantern(210, 330, p.accent2, 0) + lantern(560, 350, p.accent1, 1) + lantern(980, 340, p.accent3, 2) +
    // tambor central
    `<g transform="translate(600,760)"><ellipse cx="0" cy="8" rx="42" ry="10" fill="#000" opacity=".2"/><path d="M-32,-56 L32,-56 L26,4 L-26,4 Z" fill="${p.wood}"/><ellipse cx="0" cy="-56" rx="32" ry="9" fill="${p.wall}"/><path d="M-30,-44 L30,-44 M-28,-28 L28,-28 M-27,-12 L27,-12" stroke="${p.accent2}" stroke-width="3"/></g>` +
    confetti + sparkles(r, 16, p, p.light, 260, 700);
}

/* 4. TURISMO — vila costeira, farol, balão e veleiro */
export function turismo(p, r) {
  let waves = "";
  for (let i = 0; i < 9; i++) {
    const y = 610 + i * 22, x = f(r() * 900);
    waves += `<path d="M${x},${y} q30,-10 60,0 t60,0 t60,0" fill="none" stroke="#ffffff" stroke-width="3" opacity=".45" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;40 0;0 0" dur="${f(5 + i * 0.6)}s" repeatCount="indefinite"/></path>`;
  }
  const balloon = `<g transform="translate(300,260)"><g>${bob(20, 7, 0, 30)}
<path d="M0,-64 C-56,-64 -62,4 -14,30 L14,30 C62,4 56,-64 0,-64 Z" fill="${p.accent2}"/><path d="M0,-64 C-24,-64 -30,4 -8,30 L8,30 C30,4 24,-64 0,-64 Z" fill="${p.accent1}"/><path d="M0,-64 C-8,-64 -10,4 -2,30 L2,30 C10,4 8,-64 0,-64 Z" fill="#ffffff" opacity=".8"/>
<path d="M-12,30 L-9,58 M12,30 L9,58" stroke="${p.ink}" stroke-width="2"/><rect x="-12" y="56" width="24" height="16" rx="3" fill="${p.wood}"/></g></g>`;
  const boat = `<g transform="translate(700,650)"><g>${bob(8, 3.4)}<g>${sway(2.2, 3.4, 0, 30)}
<path d="M-56,26 L56,26 L40,48 L-40,48 Z" fill="${p.wood}"/><path d="M-56,26 L56,26 L52,32 L-52,32 Z" fill="${p.woodLight}"/>
<path d="M0,-96 L0,26" stroke="${p.ink}" stroke-width="3"/><path d="M4,-92 Q46,-40 50,20 L4,20 Z" fill="#ffffff"/><path d="M-4,-70 Q-34,-30 -40,20 L-4,20 Z" fill="${p.wall}"/>
<path d="M0,-96 L14,-90 L0,-84 Z" fill="${p.accent2}"/></g></g></g>`;
  const lighthouse = `<g transform="translate(1020,520)"><path d="M-70,80 Q-30,-10 60,20 L130,80 Z" fill="${p.stoneShade}"/><path d="M-16,20 L-26,-120 L26,-120 L16,20 Z" fill="#ffffff"/><path d="M-22,-70 L22,-70 L20,-40 L-20,-40 Z" fill="${p.accent2}"/>
<rect x="-30" y="-140" width="60" height="20" fill="${p.ink}"/><rect x="-16" y="-160" width="32" height="20" fill="${p.warm}">${pulse(0.55, 1, 1.8)}</rect><path d="M-34,-160 L0,-190 L34,-160 Z" fill="${p.roof}"/>
<path d="M18,-150 L280,-200 L280,-110 Z" fill="${p.light}" opacity=".0"><animate attributeName="opacity" values="0;.35;0" dur="4s" repeatCount="indefinite"/></path></g>`;
  const town = [0, 1, 2, 3, 4].map((i) => house(130 + i * 78, 560 + (i % 2) * 22 - i * 4, 0.8 + (i % 3) * 0.1, p, ["#f8e1c0", "#cfe8d8", "#f6cdd3", "#fff0b8", "#cfe0f5"][i], ["#d9644a", "#3f6fb5", "#c8483d", "#2d8a6b", "#e0913a"][i])).join("");
  return `<path d="${ridge(r, 500, 30)}" fill="${p.hillFar}"/><path d="${ridge(r, 545, 34)}" fill="${p.hillMid}"/>` +
    `<rect x="0" y="600" width="${W}" height="200" fill="url(#gWater)"/><path d="M0,600 L${W},600" stroke="#ffffff" stroke-width="3" opacity=".5"/>` + waves +
    `<path d="M-20,800 L-20,560 Q140,520 300,600 L420,690 Q380,760 300,800 Z" fill="${p.hillNear}"/>` + town +
    lighthouse + balloon + boat +
    `<path d="M-20,800 L-20,700 Q120,680 240,760 L280,800 Z" fill="${p.hillFront}"/>` +
    bird(0, 300, 1.1, 50, 5, p) + bird(0, 340, 0.9, 62, 25, p) + bird(0, 280, 0.8, 70, 45, p) + sparkles(r, 14, p, "#ffffff", 610, 780);
}

/* 5. VIDA NO INTERIOR — fazenda, plantação, fumaça na chaminé */
export function interior(p, r) {
  let rows = "";
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    rows += `<path d="M${f(-200 + i * 120)},800 L${f(420 + t * 360)},560" stroke="${i % 2 ? p.hillNear : p.grass}" stroke-width="${f(16 + t * 10)}" opacity=".55" stroke-linecap="round"/>`;
  }
  const smoke = [0, 1, 2, 3].map((i) => `<circle cx="0" cy="0" r="10" fill="#ffffff" opacity="0"><animate attributeName="opacity" values="0;.6;0" dur="5s" begin="${-i * 1.25}s" repeatCount="indefinite"/><animate attributeName="r" values="8;26" dur="5s" begin="${-i * 1.25}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;30 -90" dur="5s" begin="${-i * 1.25}s" repeatCount="indefinite"/></circle>`).join("");
  const fence = Array.from({ length: 12 }, (_, i) => `<rect x="${60 + i * 34}" y="${690 - i * 2}" width="6" height="40" fill="${p.woodLight}"/>`).join("") + `<rect x="60" y="702" width="400" height="5" fill="${p.woodLight}"/><rect x="60" y="716" width="400" height="5" fill="${p.woodLight}"/>`;
  let wheat = "";
  for (let i = 0; i < 90; i++) {
    const x = f(r() * W), y = f(730 + r() * 70), s = 0.7 + (y - 730) / 70 * 0.7;
    wheat += `<g transform="translate(${x},${y}) scale(${f(s)})"><g>${sway(5, 2.4 + r() * 2, 0, 0, r() * 3)}<path d="M0,0 L0,-46" stroke="${p.leafLight}" stroke-width="2.6"/><ellipse cx="0" cy="-52" rx="4" ry="12" fill="${p.accent1}"/></g></g>`;
  }
  const laundry = `<g transform="translate(700,640)"><path d="M0,0 L160,-4" stroke="${p.ink}" stroke-width="2"/><path d="M0,0 L0,60 M160,-4 L160,56" stroke="${p.wood}" stroke-width="4"/>${[26, 70, 114].map((x, i) => `<g transform="translate(${x},-2)"><g>${sway(4, 2.6, 0, 0, i)}<rect x="-14" y="0" width="28" height="30" fill="${["#ffffff", p.accent2, p.accent3][i]}"/></g></g>`).join("")}</g>`;
  return `<path d="${ridge(r, 470, 36)}" fill="${p.hillFar}"/><path d="${ridge(r, 540, 30)}" fill="${p.hillMid}"/>` +
    `<path d="M-20,800 L-20,570 Q300,540 620,560 Q900,575 1240,545 L1240,800 Z" fill="${p.hillNear}"/>` + rows +
    tree(130, 640, 0.9, p) + tree(1090, 630, 1.0, p, 1.4, 1) +
    // fazenda
    `<g transform="translate(560,640)"><rect x="-90" y="-80" width="180" height="80" fill="${p.wall}"/><rect x="40" y="-80" width="50" height="80" fill="${p.wallShade}" opacity=".6"/>
<path d="M-108,-80 L0,-150 L108,-80 Z" fill="${p.roof}"/><path d="M0,-150 L108,-80 L60,-80 Z" fill="${p.roofDark}" opacity=".4"/>
<rect x="50" y="-150" width="18" height="44" fill="${p.stone}"/><g transform="translate(59,-152)">${smoke}</g>
<rect x="-22" y="-52" width="34" height="52" rx="17" fill="${p.wood}"/><rect x="-74" y="-62" width="30" height="28" rx="2" fill="${p.warm}">${pulse(0.85, 1, 3)}</rect><rect x="30" y="-62" width="30" height="28" rx="2" fill="#bfe4f2"/></g>` +
    // celeiro
    `<g transform="translate(360,650)"><rect x="-56" y="-70" width="112" height="70" fill="#b5503f"/><path d="M-66,-70 L0,-118 L66,-70 Z" fill="${p.roofDark}"/><path d="M-22,0 L-22,-40 L22,-40 L22,0 M-22,-40 L22,0 M22,-40 L-22,0" stroke="#ffffff" stroke-width="3" fill="none"/></g>` +
    `<g>${fence}</g>` + laundry +
    `<path d="M520,800 Q560,700 600,660 L640,660 Q700,720 800,800 Z" fill="${p.stone}" opacity=".8"/>` +
    wheat + bird(0, 180, 1, 55, 10, p) + bird(0, 220, 0.8, 68, 30, p) + butterfly(900, 700, 1.0, 6, 1, p.accent1);
}

/* 6. DANÇA — dançarinas com fitas ao vento sob lanternas */
export function danca(p, r) {
  const dancer = (x, y, s, skirt, top, flip, delay) => `<g transform="translate(${x},${y}) scale(${s * flip},${s})"><g>${bob(10, 1.6, delay)}
<ellipse cx="0" cy="8" rx="70" ry="10" fill="#000" opacity=".16"/>
<g>${sway(3, 1.6, 0, 0, delay)}
<path d="M-8,-10 L-18,-104 L-10,-104 L0,-40 Z" fill="${p.ink}" opacity="0"/>
<path d="M0,-100 Q-28,-24 -92,0 Q-30,10 0,-6 Q30,10 92,0 Q28,-24 0,-100 Z" fill="${skirt}"><animate attributeName="d" values="M0,-100 Q-28,-24 -92,0 Q-30,10 0,-6 Q30,10 92,0 Q28,-24 0,-100 Z;M0,-100 Q-20,-30 -70,-6 Q-24,14 0,-2 Q34,14 100,-4 Q34,-20 0,-100 Z;M0,-100 Q-28,-24 -92,0 Q-30,10 0,-6 Q30,10 92,0 Q28,-24 0,-100 Z" dur="1.6s" begin="${-delay}s" repeatCount="indefinite"/></path>
<path d="M-12,-100 L12,-100 L8,-142 L-8,-142 Z" fill="${top}"/><circle cx="0" cy="-156" r="15" fill="#8a5a3c"/><path d="M-15,-158 Q0,-180 15,-158 Q6,-166 -15,-158 Z" fill="${p.ink}"/>
<path d="M-8,-138 Q-46,-150 -60,-186" stroke="#8a5a3c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M8,-138 Q44,-140 66,-116" stroke="#8a5a3c" stroke-width="7" fill="none" stroke-linecap="round"/>
</g></g></g>`;
  const ribbon = (d, c, dur) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-dasharray="120 26" opacity=".9"><animate attributeName="stroke-dashoffset" values="0;-146" dur="${dur}s" repeatCount="indefinite"/></path>`;
  const petals = Array.from({ length: 28 }, (_, i) => {
    const x = f(r() * W), d = f(7 + r() * 6), c = [p.accent2, "#ffffff", p.accent1][i % 3];
    return `<ellipse cx="${x}" cy="-20" rx="6" ry="3.4" fill="${c}" opacity=".9"><animateTransform attributeName="transform" type="translate" values="0 0;${f((r() - 0.5) * 220)} 860" dur="${d}s" begin="${-r() * d}s" repeatCount="indefinite"/></ellipse>`;
  }).join("");
  const lanternString = (x0, x1, y) => {
    let s = `<path d="M${x0},${y} Q${(x0 + x1) / 2},${y + 70} ${x1},${y}" fill="none" stroke="${p.ink}" stroke-width="2" opacity=".6"/>`;
    for (let i = 1; i < 8; i++) { const t = i / 8, x = x0 + (x1 - x0) * t, yy = (1 - t) * (1 - t) * y + 2 * t * (1 - t) * (y + 70) + t * t * y;
      s += `<g transform="translate(${f(x)},${f(yy)})"><circle r="24" fill="${p.warm}" opacity=".28" filter="url(#fSoft)">${pulse(0.15, 0.45, 2.6, i * 0.4)}</circle><ellipse cx="0" cy="12" rx="9" ry="12" fill="${[p.accent2, p.accent1, p.accent3, p.warm][i % 4]}"/></g>`; }
    return s;
  };
  return hills(p, r, 500, 585, 660) + lanternString(-20, 620, 150) + lanternString(560, 1220, 170) +
    `<ellipse cx="600" cy="740" rx="470" ry="58" fill="${p.stone}" opacity=".75"/><ellipse cx="600" cy="736" rx="440" ry="46" fill="${p.wall}" opacity=".5"/>` +
    // tambor e bandeiras ao lado
    `<g transform="translate(150,730)"><path d="M-30,-70 L30,-70 L24,0 L-24,0 Z" fill="${p.wood}"/><ellipse cx="0" cy="-70" rx="30" ry="9" fill="${p.wall}"/><path d="M-28,-56 L28,-56 M-26,-40 L26,-40 M-25,-22 L25,-22" stroke="${p.accent2}" stroke-width="3"/></g>` +
    `<g transform="translate(1050,730)"><path d="M-26,-90 L26,-90 L20,0 L-20,0 Z" fill="${p.woodLight}"/><ellipse cx="0" cy="-90" rx="26" ry="8" fill="${p.wall}"/><path d="M-24,-68 L24,-68 M-22,-44 L22,-44" stroke="${p.accent3}" stroke-width="3"/></g>` +
    ribbon("M380,560 C440,420 520,640 600,500 S740,420 830,560", "#d21034", 2.2) +
    ribbon("M340,520 C420,380 540,600 640,470 S780,440 870,520", "#00209f", 2.8) +
    dancer(470, 748, 1.05, "#d21034", "#ffffff", 1, 0) + dancer(730, 748, 1.05, "#00209f", "#ffe9a8", -1, 0.8) +
    petals + sparkles(r, 20, p, p.light, 260, 700);
}

/* 7. GEOGRAFIA — montanhas, rio sinuoso e bússola */
export function geografia(p, r) {
  const peak = (x, y, w, h, c, snow) => `<path d="M${x - w},${y} L${x},${y - h} L${x + w},${y} Z" fill="${c}"/><path d="M${x},${y - h} L${x + w},${y} L${x + w * 0.2},${y} Z" fill="#000" opacity=".12"/><path d="M${x},${y - h} L${x - w * 0.22},${y - h * 0.72} L${x - w * 0.08},${y - h * 0.78} L${x + w * 0.02},${y - h * 0.66} L${x + w * 0.12},${y - h * 0.76} L${x + w * 0.22},${y - h * 0.72} Z" fill="${snow}"/>`;
  const compass = `<g transform="translate(200,210)"><g>${bob(8, 5, 0, 6)}<circle r="58" fill="${p.wall}" opacity=".92"/><circle r="58" fill="none" stroke="${p.woodLight}" stroke-width="5"/><circle r="46" fill="none" stroke="${p.stoneShade}" stroke-width="1.5"/>
<text y="-28" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="${p.ink}">N</text><text y="40" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="${p.ink}">S</text>
<g><animateTransform attributeName="transform" type="rotate" values="-18;22;-8;14;-18" dur="8s" repeatCount="indefinite"/><path d="M0,-38 L8,0 L-8,0 Z" fill="${p.accent2}"/><path d="M0,38 L8,0 L-8,0 Z" fill="${p.stoneShade}"/><circle r="4" fill="${p.ink}"/></g></g></g>`;
  let grid = "";
  for (let i = 0; i < 5; i++) grid += `<ellipse cx="880" cy="230" rx="${180 + i * 0}" ry="${30 + i * 26}" fill="none" stroke="#ffffff" stroke-width="1.4" opacity=".22" transform="rotate(${-14})"/>`;
  return grid +
    peak(300, 560, 300, 290, p.hillFar, "#ffffff") + peak(700, 560, 340, 340, p.hillMid, "#ffffff") + peak(1040, 560, 260, 240, p.hillFar, "#ffffff") + peak(520, 580, 230, 210, p.hillNear, "#f4f8ff") +
    `<path d="${ridge(r, 590, 26)}" fill="${p.hillNear}"/>` + pine(140, 640, 0.9, p) + pine(220, 650, 0.7, p) + pine(1080, 640, 0.9, p) +
    `<path d="M-20,800 L-20,660 Q400,610 700,650 Q980,680 1220,640 L1220,800 Z" fill="${p.hillFront}"/>` +
    // rio
    `<path d="M610,600 C560,640 700,660 640,700 C580,740 500,730 470,800 L640,800 C660,750 760,730 720,690 C690,660 660,640 670,600 Z" fill="url(#gWater)"/>` +
    `<path d="M630,610 C590,650 690,668 626,708 C570,748 520,750 500,800" fill="none" stroke="#ffffff" stroke-width="3" opacity=".6" stroke-dasharray="14 18"><animate attributeName="stroke-dashoffset" values="0;-64" dur="2.4s" repeatCount="indefinite"/></path>` +
    // caminhante com bandeira
    `<g transform="translate(316,286)"><path d="M0,0 L0,-42" stroke="${p.wood}" stroke-width="3"/><g><path d="M0,-42 L28,-34 L0,-24 Z" fill="${p.accent2}"><animate attributeName="d" values="M0,-42 L28,-34 L0,-24 Z;M0,-42 L24,-38 L0,-24 Z;M0,-42 L28,-34 L0,-24 Z" dur="1.1s" repeatCount="indefinite"/></path></g><circle cx="-12" cy="-12" r="6" fill="#8a5a3c"/><rect x="-18" y="-6" width="14" height="20" rx="5" fill="${p.accent3}"/></g>` +
    compass + bird(0, 170, 1.1, 60, 8, p) + bird(0, 130, 0.9, 74, 40, p) + sparkles(r, 12, p, "#ffffff", 300, 700);
}
