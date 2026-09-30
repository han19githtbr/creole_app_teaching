import { W, H, f, ridge, tree, pine, house, bird, sparkles, flowers, butterfly, sway, bob, spin, pulse, drift, steamPath } from "./lib.mjs";

const hills = (p, r, far = 470, mid = 560, near = 650) => `
<path d="${ridge(r, far, 40)}" fill="${p.hillFar}"/><path d="${ridge(r, mid, 42)}" fill="${p.hillMid}"/><path d="${ridge(r, near, 34)}" fill="${p.hillNear}"/>`;
const front = (p, r, y = 730) => `<path d="${ridge(r, y, 22, 150)}" fill="${p.hillFront}"/>`;

/* 8. HISTÓRIA — fortaleza de pedra no alto do morro, canhões e bandeira */
export function historia(p, r) {
  const merlons = (x0, x1, y) => Array.from({ length: Math.floor((x1 - x0) / 34) }, (_, i) => `<rect x="${x0 + i * 34}" y="${y}" width="22" height="24" fill="${p.stone}"/>`).join("");
  const tower = (x, y, w, h) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${p.stone}"/><rect x="${x + w * 0.62}" y="${y}" width="${w * 0.38}" height="${h}" fill="${p.stoneShade}" opacity=".7"/>${merlons(x - 4, x + w + 4, y - 22)}<path d="M${x + w / 2 - 6},${y + h * 0.3} h12 v30 q-6,8 -12,0 Z" fill="${p.ink}" opacity=".7"/></g>`;
  const cannon = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40,-14 L26,-24 L28,-6 L-40,2 Z" fill="${p.ink}" transform="rotate(-12)"/><circle cx="-10" cy="4" r="14" fill="${p.wood}"/><circle cx="-10" cy="4" r="5" fill="${p.woodLight}"/></g>`;
  const flag = `<g transform="translate(600,236)"><path d="M0,0 L0,-120" stroke="${p.wood}" stroke-width="5"/><path d="M0,-118 Q30,-126 60,-116 T120,-116 L120,-72 Q90,-62 60,-72 T0,-72 Z" fill="#00209f"><animate attributeName="d" values="M0,-118 Q30,-126 60,-116 T120,-116 L120,-72 Q90,-62 60,-72 T0,-72 Z;M0,-118 Q30,-108 60,-118 T120,-114 L120,-70 Q90,-80 60,-70 T0,-72 Z;M0,-118 Q30,-126 60,-116 T120,-116 L120,-72 Q90,-62 60,-72 T0,-72 Z" dur="2.4s" repeatCount="indefinite"/></path>
<path d="M0,-95 Q30,-103 60,-94 T120,-93 L120,-72 Q90,-62 60,-72 T0,-72 Z" fill="#d21034"><animate attributeName="d" values="M0,-95 Q30,-103 60,-94 T120,-93 L120,-72 Q90,-62 60,-72 T0,-72 Z;M0,-95 Q30,-85 60,-95 T120,-91 L120,-70 Q90,-80 60,-70 T0,-72 Z;M0,-95 Q30,-103 60,-94 T120,-93 L120,-72 Q90,-62 60,-72 T0,-72 Z" dur="2.4s" repeatCount="indefinite"/></path></g>`;
  const torch = (x, y, d) => `<g transform="translate(${x},${y})"><rect x="-3" y="0" width="6" height="26" fill="${p.wood}"/><ellipse cx="0" cy="-8" rx="9" ry="14" fill="#ffb347"><animate attributeName="ry" values="14;18;12;16;14" dur="${1 + d}s" repeatCount="indefinite"/></ellipse><ellipse cx="0" cy="-6" rx="4" ry="8" fill="#fff2b0"/><circle cy="-8" r="34" fill="#ffb347" opacity=".22" filter="url(#fSoft)">${pulse(0.15, 0.35, 1.3, d)}</circle></g>`;
  return `<path d="${ridge(r, 470, 34)}" fill="${p.hillFar}"/><path d="M-40,800 L-40,560 Q300,500 520,330 L680,330 Q900,500 1240,560 L1240,800 Z" fill="${p.hillMid}"/>` +
    // fortaleza
    `<rect x="380" y="330" width="440" height="230" fill="${p.stone}"/><rect x="700" y="330" width="120" height="230" fill="${p.stoneShade}" opacity=".6"/>${merlons(376, 824, 308)}` +
    tower(340, 250, 84, 310) + tower(776, 250, 84, 310) + tower(540, 200, 120, 130) +
    `<path d="M528,560 L528,470 Q600,400 672,470 L672,560 Z" fill="${p.ink}" opacity=".85"/><path d="M528,560 L528,470 Q600,400 672,470 L672,560" fill="none" stroke="${p.stoneShade}" stroke-width="6"/>` +
    Array.from({ length: 6 }, (_, i) => `<path d="M${400 + i * 66},${420} h28 M${400 + i * 66},${470} h28" stroke="${p.stoneShade}" stroke-width="3" opacity=".5"/>`).join("") +
    flag + cannon(452, 322, 0.8) + cannon(748, 322, 0.8) + torch(500, 500, 0.2) + torch(700, 500, 0.6) +
    `<path d="M-40,800 L-40,640 Q400,600 600,640 Q900,600 1240,650 L1240,800 Z" fill="${p.hillNear}"/>` +
    `<path d="M560,800 Q590,700 600,640 Q610,700 660,800 Z" fill="${p.stone}" opacity=".85"/>` +
    pine(130, 690, 1.0, p) + pine(230, 700, 0.8, p) + pine(1030, 690, 1.0, p) + pine(1120, 700, 0.8, p) +
    front(p, r, 760) + bird(0, 190, 1.1, 55, 5, p) + bird(0, 160, 0.9, 70, 35, p) + sparkles(r, 16, p, p.light, 300, 700);
}

/* 9. CINEMA — cinema de bairro ao entardecer, letreiro, projetor e pipoca */
export function cinema(p, r) {
  const bulbs = (x0, y0, x1, y1, n) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return `<circle cx="${f(x0 + (x1 - x0) * t)}" cy="${f(y0 + (y1 - y0) * t)}" r="5" fill="${p.warm}"><animate attributeName="opacity" values="1;.25;1" dur="1.4s" begin="${-(i % 2) * 0.7}s" repeatCount="indefinite"/></circle>`; }).join("");
  const popcorn = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-26,0 L26,0 L20,-64 L-20,-64 Z" fill="#d21034"/><path d="M-13,0 L-8,-64 L-2,-64 L-4,0 Z M12,0 L8,-64 L2,-64 L4,0 Z" fill="#ffffff"/>
${[[-16, -74], [0, -84], [16, -74], [-6, -68], [8, -70]].map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="12" fill="#fff4c4"><animate attributeName="cy" values="${b};${b - 6};${b}" dur="${1.4 + i * 0.3}s" repeatCount="indefinite"/></circle>`).join("")}</g>`;
  const beam = `<path d="M150,470 L820,250 L820,600 Z" fill="${p.light}" opacity=".0"><animate attributeName="opacity" values=".08;.22;.08" dur="2.2s" repeatCount="indefinite"/></path>`;
  const stars = Array.from({ length: 12 }, (_, i) => `<path d="M0,-12 L3.5,-4 L12,-3 L5.5,3 L7.5,12 L0,7.5 L-7.5,12 L-5.5,3 L-12,-3 L-3.5,-4 Z" transform="translate(${f(420 + i * 62)},${f(560 + (i % 2) * 40)}) scale(${f(0.7 + (i % 3) * 0.2)})" fill="${p.accent1}" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="${f(3 + (i % 4))}s" begin="${-i * 0.5}s" repeatCount="indefinite"/></path>`).join("");
  return hills(p, r, 500, 590, 670) +
    // prédio do cinema
    `<g transform="translate(600,690)"><rect x="-270" y="-330" width="540" height="330" fill="${p.wall}"/><rect x="130" y="-330" width="140" height="330" fill="${p.wallShade}" opacity=".6"/>
<rect x="-290" y="-350" width="580" height="30" fill="${p.roofDark}"/><rect x="-200" y="-300" width="400" height="120" rx="8" fill="#1e2a52"/>
<rect x="-188" y="-288" width="376" height="96" rx="4" fill="#26386b"/><text x="0" y="-232" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="54" fill="${p.warm}" letter-spacing="8">CINEMA<animate attributeName="opacity" values="1;.78;1;.9;1" dur="3s" repeatCount="indefinite"/></text>
<g transform="translate(0,-160)">${bulbs(-190, 0, 190, 0, 15)}</g>
<path d="M-90,0 L-90,-100 Q0,-140 90,-100 L90,0 Z" fill="${p.ink}" opacity=".85"/><path d="M0,0 L0,-118" stroke="${p.stoneShade}" stroke-width="3"/>
<rect x="-240" y="-110" width="100" height="120" fill="#26386b"/><rect x="-232" y="-102" width="84" height="104" fill="${p.accent2}" opacity=".85"/><path d="M-190,-72 l14,20 l-28,0 z" fill="#ffffff"/>
<rect x="140" y="-110" width="100" height="120" fill="#26386b"/><rect x="148" y="-102" width="84" height="104" fill="${p.accent3}" opacity=".85"/><circle cx="190" cy="-52" r="20" fill="#ffffff"/>
</g>` + beam + `<path d="M-20,800 L-20,730 Q600,700 1220,730 L1220,800 Z" fill="#3b3a4a"/><path d="M0,768 L${W},768" stroke="#ffd58a" stroke-width="4" stroke-dasharray="40 30" opacity=".55"/>` +
    // tapete vermelho e pessoas
    `<path d="M520,800 L560,700 L640,700 L680,800 Z" fill="#c62a3d"/>` + popcorn(230, 780, 1.1) + popcorn(980, 780, 0.9) + stars +
    tree(90, 740, 0.75, p) + tree(1120, 740, 0.75, p, 1.4, 1) + sparkles(r, 22, p, p.light, 200, 680) + bird(0, 130, 1, 60, 14, p);
}

/* 10. MÚSICA — palco ao ar livre, violão, tambor, notas musicais flutuando */
export function musica(p, r) {
  const notes = Array.from({ length: 14 }, (_, i) => {
    const x = f(340 + r() * 520), d = f(6 + r() * 4), c = [p.accent1, p.accent2, "#ffffff", p.accent3][i % 4], drift = f((r() - 0.5) * 140);
    return `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="${d}s" begin="${-r() * d}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="${x} 620;${f(x + drift)} 140" dur="${d}s" begin="${-r() * d}s" repeatCount="indefinite"/><ellipse cx="0" cy="0" rx="11" ry="8" fill="${c}" transform="rotate(-20)"/><path d="M9,-2 L9,-38 q14,4 16,18" stroke="${c}" stroke-width="3.5" fill="none"/></g>`;
  }).join("");
  const guitar = `<g transform="translate(450,700) rotate(-14)"><g>${sway(3, 1.2, 0, 0)}<path d="M-8,-160 L8,-160 L8,-30 L-8,-30 Z" fill="${p.wood}"/><path d="M-10,-176 h20 v20 h-20 Z" fill="${p.ink}"/><ellipse cx="0" cy="-8" rx="46" ry="38" fill="${p.woodLight}"/><ellipse cx="0" cy="34" rx="58" ry="48" fill="${p.wood}"/><ellipse cx="0" cy="34" rx="58" ry="48" fill="${p.woodLight}" opacity=".35"/><circle cx="0" cy="22" r="15" fill="${p.ink}"/><path d="M0,-176 L0,60" stroke="#ffffff" stroke-width="1.6" opacity=".8"/></g></g>`;
  const drum = (x, y, s, c) => `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="6" rx="46" ry="9" fill="#000" opacity=".18"/><path d="M-40,-70 L40,-70 L32,0 L-32,0 Z" fill="${c}"/><ellipse cx="0" cy="-70" rx="40" ry="10" fill="${p.wall}"><animate attributeName="ry" values="10;8;10" dur=".6s" repeatCount="indefinite"/></ellipse><path d="M-36,-52 L36,-52 M-34,-34 L34,-34 M-32,-16 L32,-16" stroke="${p.ink}" stroke-width="3" opacity=".5"/></g>`;
  const speaker = (x) => `<g transform="translate(${x},650)"><rect x="-38" y="-120" width="76" height="120" rx="8" fill="${p.ink}"/><circle cx="0" cy="-40" r="26" fill="#2c3f6a"><animate attributeName="r" values="26;28;26" dur=".5s" repeatCount="indefinite"/></circle><circle cx="0" cy="-92" r="10" fill="#2c3f6a"/></g>`;
  const pulseRing = [0, 1, 2].map((i) => `<circle cx="600" cy="560" r="20" fill="none" stroke="${p.warm}" stroke-width="3" opacity="0"><animate attributeName="r" values="20;280" dur="4s" begin="${-i * 1.33}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".55;0" dur="4s" begin="${-i * 1.33}s" repeatCount="indefinite"/></circle>`).join("");
  return hills(p, r, 500, 590, 670) + pulseRing +
    `<path d="M300,740 L300,640 Q600,560 900,640 L900,740 Z" fill="${p.wood}"/><path d="M280,640 Q600,540 920,640 L900,640 Q600,570 300,640 Z" fill="${p.roof}"/><path d="M300,640 Q600,570 900,640 L900,660 Q600,590 300,660 Z" fill="${p.roofDark}" opacity=".6"/>` +
    `<rect x="290" y="740" width="620" height="28" rx="6" fill="${p.woodLight}"/>` +
    drum(560, 738, 1.0, p.accent2) + drum(650, 742, 0.85, p.accent3) + speaker(340) + speaker(860) +
    Array.from({ length: 14 }, (_, i) => `<g transform="translate(${310 + i * 42},600)"><circle r="4" fill="${p.warm}"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" begin="${-i * 0.11}s" repeatCount="indefinite"/></circle></g>`).join("") +
    front(p, r, 770) + guitar + notes + tree(90, 740, 0.8, p) + tree(1120, 740, 0.8, p, 1.4, 1) + sparkles(r, 20, p, p.light, 220, 700);
}

/* 11. LAZERES — piquenique, pipa, bicicleta e balanço sob a árvore */
export function lazeres(p, r) {
  const kite = (x, y, c1, c2, s, d) => `<g transform="translate(${x},${y}) scale(${s})"><g>${bob(24, d, d, 20)}<g>${sway(8, d * 0.6, 0, 0)}
<path d="M0,-44 L30,0 L0,54 L-30,0 Z" fill="${c1}"/><path d="M0,-44 L30,0 L0,0 Z" fill="${c2}"/><path d="M0,54 L-30,0 L0,0 Z" fill="${c2}"/>
<path d="M0,54 q-18,22 6,40 q22,18 -2,44" fill="none" stroke="${c2}" stroke-width="4" stroke-dasharray="10 6"/></g></g></g>`;
  const blanket = `<g transform="translate(620,740)"><path d="M-170,-30 L170,-30 L220,30 L-220,30 Z" fill="#d21034"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${-170 + i * 42},-30 L${-150 + i * 46},30 L${-130 + i * 46},30 L${-148 + i * 42},-30 Z" fill="#ffffff" opacity=".9"/>`).join("")}
<ellipse cx="-60" cy="-38" rx="46" ry="14" fill="${p.woodLight}"/><path d="M-100,-40 Q-60,-86 -20,-40 Z" fill="${p.wall}"/>
<circle cx="70" cy="-44" r="16" fill="${p.accent2}"/><circle cx="102" cy="-40" r="14" fill="${p.accent1}"/><circle cx="130" cy="-42" r="14" fill="${p.leafLight}"/>
<rect x="150" y="-72" width="30" height="42" rx="6" fill="#ffffff" opacity=".9"/><rect x="150" y="-72" width="30" height="12" rx="4" fill="${p.accent3}"/></g>`;
  const bike = `<g transform="translate(220,720)"><g>${drift(0, 0, 1)}<g>${bob(3, 0.8)}<circle cx="-42" cy="0" r="30" fill="none" stroke="${p.ink}" stroke-width="5"/><circle cx="46" cy="0" r="30" fill="none" stroke="${p.ink}" stroke-width="5"/>
<g><animateTransform attributeName="transform" type="rotate" from="0 -42 0" to="360 -42 0" dur="1.8s" repeatCount="indefinite"/><path d="M-42,-28 V28 M-70,0 H-14" stroke="${p.stoneShade}" stroke-width="2"/></g>
<g><animateTransform attributeName="transform" type="rotate" from="0 46 0" to="360 46 0" dur="1.8s" repeatCount="indefinite"/><path d="M46,-28 V28 M18,0 H74" stroke="${p.stoneShade}" stroke-width="2"/></g>
<path d="M-42,0 L-6,-46 L34,-46 L46,0 M-6,-46 L4,0 L-42,0 M34,-46 L28,-62 L46,-62" fill="none" stroke="${p.accent2}" stroke-width="6" stroke-linecap="round"/><rect x="-14" y="-52" width="22" height="7" rx="3" fill="${p.ink}"/></g></g></g>`;
  const swing = `<g transform="translate(1000,700)"><g><path d="M-8,-330 L-46,-140" stroke="${p.wood}" stroke-width="0"/><g>${sway(16, 2.6, 0, -190)}<path d="M-32,-190 L-38,-40 M32,-190 L38,-40" stroke="${p.ink}" stroke-width="3"/><rect x="-46" y="-42" width="92" height="12" rx="4" fill="${p.woodLight}"/></g></g></g>`;
  return hills(p, r, 490, 580, 660) + tree(1000, 700, 1.9, p, 1.0, 2) + swing + tree(120, 700, 1.0, p, 1.4, 1) + front(p, r, 745) +
    kite(360, 250, p.accent2, p.accent1, 1.0, 6) + kite(560, 190, p.accent3, "#ffffff", 0.8, 7.5) + kite(780, 300, p.accent1, p.accent2, 0.7, 5.4) +
    blanket + bike + flowers(r, 60, p, 715, 790) + butterfly(480, 600, 1.1, 6, 1, p.accent1) + butterfly(820, 560, 0.9, 7, 3, "#fff") + bird(0, 130, 1, 60, 6, p) + sparkles(r, 18, p, p.light, 240, 700);
}

/* 12. ESTOICISMO — colunas de pedra, vento sereno, oliveira e um sábio lendo */
export function estoicismo(p, r) {
  const column = (x, y, h, w = 48) => `<g><rect x="${x - w / 2 - 10}" y="${y - 20}" width="${w + 20}" height="20" fill="${p.stone}"/><rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h - 20}" fill="${p.stone}"/><rect x="${x + w * 0.1}" y="${y - h}" width="${w * 0.4}" height="${h - 20}" fill="${p.stoneShade}" opacity=".6"/>${[-0.3, -0.05, 0.2].map((k) => `<path d="M${x + w * k},${y - h + 8} L${x + w * k},${y - 24}" stroke="${p.stoneShade}" stroke-width="2.5" opacity=".7"/>`).join("")}<rect x="${x - w / 2 - 12}" y="${y - h - 18}" width="${w + 24}" height="18" fill="${p.stone}"/><rect x="${x - w / 2 - 6}" y="${y - h - 30}" width="${w + 12}" height="12" fill="${p.stoneShade}"/></g>`;
  const olive = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-14,0 Q-30,-40 -6,-80 Q-28,-100 -10,-130 L8,-130 Q26,-90 6,-70 Q34,-40 16,0 Z" fill="${p.wood}"/><g>${sway(2, 5, 0, -120)}<ellipse cx="-40" cy="-150" rx="66" ry="34" fill="#7fa58a"/><ellipse cx="40" cy="-160" rx="70" ry="36" fill="#6f9a7c"/><ellipse cx="0" cy="-184" rx="60" ry="30" fill="#93b89a"/>${[[-30, -150], [30, -168], [0, -190], [-58, -140]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="#3d3a5a"/>`).join("")}</g></g>`;
  const sage = `<g transform="translate(640,712)"><ellipse cx="0" cy="6" rx="54" ry="9" fill="#000" opacity=".18"/><path d="M-40,0 Q-46,-60 -14,-96 L22,-96 Q50,-60 44,0 Z" fill="#f4ead8"/><path d="M20,-96 Q50,-60 44,0 L14,0 Q26,-50 8,-96 Z" fill="#dcccb0" opacity=".7"/><circle cx="-2" cy="-112" r="17" fill="#8a5a3c"/><path d="M-18,-118 Q-2,-138 16,-118 Q6,-124 -18,-118 Z" fill="#e8e0d0"/><path d="M-14,-102 Q-2,-84 12,-102 Z" fill="#e8e0d0"/>
<g>${bob(2, 3)}<path d="M-30,-66 L28,-62 L30,-40 L-28,-44 Z" fill="${p.woodLight}"/><path d="M0,-64 L0,-42" stroke="${p.wood}" stroke-width="2"/></g></g>`;
  const leaves = Array.from({ length: 12 }, (_, i) => `<ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#93b89a" opacity="0"><animate attributeName="opacity" values="0;.9;0" dur="${f(9 + i)}s" begin="${-i * 1.3}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="-40 ${f(300 + r() * 300)};1260 ${f(400 + r() * 300)}" dur="${f(9 + i)}s" begin="${-i * 1.3}s" repeatCount="indefinite"/></ellipse>`).join("");
  return `<path d="${ridge(r, 520, 30)}" fill="${p.hillFar}"/><path d="M0,600 Q300,540 600,580 T1200,570 L1200,800 L0,800 Z" fill="${p.hillMid}"/>` +
    // pórtico
    `<rect x="220" y="700" width="760" height="24" fill="${p.stone}"/><rect x="200" y="722" width="800" height="26" fill="${p.stoneShade}"/><rect x="180" y="746" width="840" height="30" fill="${p.stone}"/>` +
    [290, 430, 770, 910].map((x) => column(x, 700, 360)).join("") +
    `<path d="M240,306 L960,306 L900,240 L300,240 Z" fill="${p.stone}"/><path d="M300,240 L900,240 L960,306 L600,306 Z" fill="${p.stoneShade}" opacity=".4"/><rect x="240" y="306" width="720" height="18" fill="${p.stoneShade}"/>` +
    `<circle cx="600" cy="276" r="18" fill="none" stroke="${p.stoneShade}" stroke-width="4"/>` +
    sage + olive(110, 770, 1.0) + olive(1110, 776, 0.9) +
    `<path d="M-20,800 L-20,770 Q600,750 1220,772 L1220,800 Z" fill="${p.hillFront}"/>` +
    leaves + bird(0, 170, 1, 58, 6, p) + bird(0, 140, 0.8, 72, 34, p) + sparkles(r, 24, p, p.light, 220, 700);
}

/* 13. RELIGIÃO — capela na colina, vitral, velas, pomba e luz sagrada */
export function religiao(p, r) {
  const rays = Array.from({ length: 7 }, (_, i) => `<path d="M600,150 L${f(240 + i * 120)},760 L${f(280 + i * 120)},760 Z" fill="url(#gRay)" opacity=".0"><animate attributeName="opacity" values=".08;.36;.08" dur="${f(5 + i * 0.5)}s" begin="${-i * 0.8}s" repeatCount="indefinite"/></path>`).join("");
  const candle = (x, y, d) => `<g transform="translate(${x},${y})"><rect x="-6" y="-28" width="12" height="28" rx="3" fill="#fff8e6"/><ellipse cx="0" cy="-38" rx="6" ry="11" fill="#ffb347"><animate attributeName="ry" values="11;14;10;13;11" dur="${1 + d}s" repeatCount="indefinite"/></ellipse><ellipse cx="0" cy="-36" rx="3" ry="6" fill="#fff2b0"/><circle cy="-38" r="26" fill="#ffb347" opacity=".25" filter="url(#fSoft)">${pulse(0.15, 0.4, 1.2, d)}</circle></g>`;
  const dove = `<g transform="translate(880,240)"><g>${bob(22, 5, 0, 50)}<ellipse cx="0" cy="0" rx="26" ry="12" fill="#ffffff"/><circle cx="24" cy="-6" r="8" fill="#ffffff"/><path d="M30,-6 l10,2 l-10,3 Z" fill="${p.accent1}"/>
<path d="M-6,-2 Q-24,-40 6,-46 Q0,-20 10,-2 Z" fill="#f2f6ff"><animate attributeName="d" values="M-6,-2 Q-24,-40 6,-46 Q0,-20 10,-2 Z;M-6,0 Q-30,14 -4,32 Q2,14 10,0 Z;M-6,-2 Q-24,-40 6,-46 Q0,-20 10,-2 Z" dur=".9s" repeatCount="indefinite"/></path><path d="M-24,2 L-46,10 L-24,10 Z" fill="#f2f6ff"/></g></g>`;
  return rays + hills(p, r, 520, 600, 680) +
    `<path d="M-40,800 L-40,640 Q300,600 600,560 Q900,600 1240,640 L1240,800 Z" fill="${p.hillNear}"/>` +
    // capela
    `<g transform="translate(600,630)"><rect x="-150" y="-190" width="300" height="190" fill="${p.wall}"/><rect x="70" y="-190" width="80" height="190" fill="${p.wallShade}" opacity=".6"/>
<path d="M-170,-190 L0,-290 L170,-190 Z" fill="${p.roof}"/><path d="M0,-290 L170,-190 L90,-190 Z" fill="${p.roofDark}" opacity=".4"/>
<rect x="-30" y="-380" width="60" height="100" fill="${p.wall}"/><path d="M-40,-380 L0,-430 L40,-380 Z" fill="${p.roofDark}"/><path d="M0,-470 V-430 M-12,-455 H12" stroke="${p.accent1}" stroke-width="5" stroke-linecap="round"/><path d="M-10,-360 q10,-16 20,0 v20 h-20 Z" fill="${p.ink}" opacity=".7"/>
<circle cx="0" cy="-150" r="34" fill="#3a5bb0"/><circle cx="0" cy="-150" r="34" fill="none" stroke="${p.wallShade}" stroke-width="6"/>
${[0, 60, 120, 180, 240, 300].map((a, i) => `<path d="M0,-150 L${f(30 * Math.cos((a * Math.PI) / 180))},${f(-150 + 30 * Math.sin((a * Math.PI) / 180))} L${f(30 * Math.cos(((a + 60) * Math.PI) / 180))},${f(-150 + 30 * Math.sin(((a + 60) * Math.PI) / 180))} Z" fill="${[p.accent2, p.accent1, "#7dd3a8", p.accent3, p.accent2, p.accent1][i]}" opacity=".9">${pulse(0.65, 1, 3, i * 0.4)}</path>`).join("")}
<path d="M-40,0 L-40,-70 Q0,-112 40,-70 L40,0 Z" fill="${p.wood}"/><path d="M-40,0 L-40,-70 Q0,-112 40,-70 L40,0" fill="none" stroke="${p.woodLight}" stroke-width="5"/>
<path d="M-120,-100 v-40 q14,-20 28,0 v40 Z M92,-100 v-40 q14,-20 28,0 v40 Z" fill="${p.warm}">${pulse(0.75, 1, 3.2)}</path></g>` +
    `<path d="M560,800 Q590,720 600,630 Q610,720 660,800 Z" fill="${p.stone}" opacity=".9"/>` +
    candle(430, 760, 0) + candle(500, 780, 0.4) + candle(700, 780, 0.7) + candle(770, 760, 0.2) +
    tree(120, 720, 1.1, p) + tree(1090, 720, 1.1, p, 1.4, 1) + front(p, r, 780) + dove +
    flowers(r, 34, p, 740, 790, ["#ffffff", p.accent1, "#ffd0e0"]) + sparkles(r, 34, p, "#fff8d0", 160, 700);
}

/* 14. GASTRONOMIA — cozinha aconchegante: panela fumegante, frutas, pães */
export function gastronomia(p, r) {
  const pot = `<g transform="translate(600,560)"><ellipse cx="0" cy="118" rx="180" ry="24" fill="#000" opacity=".2"/><path d="M-150,0 L150,0 L130,116 Q0,140 -130,116 Z" fill="#b45a3c"/><path d="M-150,0 L150,0 L146,26 L-146,26 Z" fill="#d97a52"/><path d="M40,26 L150,0 L130,116 L60,124 Z" fill="#000" opacity=".12"/>
<ellipse cx="0" cy="0" rx="150" ry="24" fill="#8c3d28"/><ellipse cx="0" cy="-2" rx="132" ry="17" fill="#e2582f"><animate attributeName="ry" values="17;19;17" dur="2s" repeatCount="indefinite"/></ellipse>
${[[-60, -4], [-10, 0], [50, -6], [90, -2]].map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="7" fill="${[p.accent1, "#7dd3a8", "#fff4c4", p.accent2][i]}"><animate attributeName="cy" values="${b};${b - 4};${b}" dur="${1.4 + i * 0.3}s" repeatCount="indefinite"/></circle>`).join("")}
<path d="M-176,40 h-26 q-12,0 -12,12 v6 q0,12 12,12 h26 M176,40 h26 q12,0 12,12 v6 q0,12 -12,12 h-26" fill="none" stroke="${p.ink}" stroke-width="8" stroke-linecap="round"/>
${steamPath(-60, -30, 0)}${steamPath(0, -34, 1.1)}${steamPath(60, -30, 2.2)}${steamPath(-100, -26, 2.6)}${steamPath(110, -26, 0.6)}</g>`;
  const bread = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="10" rx="60" ry="10" fill="#000" opacity=".16"/><path d="M-56,0 Q-60,-44 0,-48 Q60,-44 56,0 Z" fill="#d9974e"/><path d="M-30,-10 q10,-24 22,-32 M-6,-8 q10,-24 22,-36 M18,-8 q10,-20 22,-28" stroke="#f4c684" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  const fruit = (x, y, c, r0, leaf) => `<g transform="translate(${x},${y})"><ellipse cx="0" cy="${r0 + 2}" rx="${r0}" ry="6" fill="#000" opacity=".14"/><circle r="${r0}" fill="${c}"/><circle cx="${-r0 * 0.3}" cy="${-r0 * 0.3}" r="${r0 * 0.3}" fill="#ffffff" opacity=".3"/>${leaf ? `<path d="M0,${-r0} q10,-16 22,-8 q-8,14 -22,8 Z" fill="${p.leaf}"/>` : ""}</g>`;
  const shelf = `<rect x="70" y="250" width="270" height="12" rx="4" fill="${p.woodLight}"/><rect x="860" y="250" width="270" height="12" rx="4" fill="${p.woodLight}"/><rect x="70" y="400" width="270" height="12" rx="4" fill="${p.woodLight}"/><rect x="860" y="400" width="270" height="12" rx="4" fill="${p.woodLight}"/>` +
    [[110, 250, "#e8b04a"], [170, 250, "#c8483d"], [230, 250, "#7dd3a8"], [290, 250, "#d9974e"], [900, 250, "#c8483d"], [960, 250, "#e8b04a"], [1020, 250, "#7dd3a8"], [1080, 250, "#d9974e"]].map(([x, y, c]) => `<rect x="${x - 20}" y="${y - 54}" width="40" height="54" rx="8" fill="${c}"/><rect x="${x - 14}" y="${y - 64}" width="28" height="12" rx="3" fill="${p.wall}"/>`).join("") +
    [[100, 400], [150, 400], [200, 400]].map(([x, y]) => `<path d="M${x - 22},${y} h44 l-6,-36 h-32 Z" fill="${p.wall}"/><path d="M${x - 16},${y - 20} h32" stroke="${p.accent2}" stroke-width="4"/>`).join("") +
    [[900, 400, "#e2582f"], [950, 400, "#f4b942"], [1000, 400, "#8fd07a"], [1050, 400, "#d2508a"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y - 20}" r="20" fill="${c}"/>`).join("");
  return `<rect width="${W}" height="${H}" fill="#f6dcb4"/><rect y="0" width="${W}" height="520" fill="${p.wallShade}" opacity=".35"/>` +
    // janela com paisagem
    `<g transform="translate(600,250)"><rect x="-150" y="-130" width="300" height="230" rx="16" fill="${p.wood}"/><rect x="-136" y="-116" width="272" height="202" rx="8" fill="url(#gSky)"/><path d="M-136,20 Q-60,-20 0,10 T136,0 V86 H-136 Z" fill="${p.hillNear}"/><path d="M-136,50 Q-40,20 30,50 T136,44 V86 H-136 Z" fill="${p.hillFront}"/><path d="M0,-116 V86 M-136,-14 H136" stroke="${p.wood}" stroke-width="8"/>
<circle cx="70" cy="-70" r="18" fill="${p.sun}"/>${cloudMini(-50, -70)}</g>` + shelf +
    // bancada
    `<rect x="0" y="640" width="${W}" height="160" fill="${p.wood}"/><rect x="0" y="640" width="${W}" height="26" fill="${p.woodLight}"/><path d="M0,690 H${W} M0,740 H${W}" stroke="${p.ink}" stroke-width="2" opacity=".18"/>` +
    pot + bread(250, 640, 1.0) + bread(340, 650, 0.8) + fruit(900, 626, "#e2582f", 26, true) + fruit(956, 630, "#f4b942", 22, true) + fruit(1010, 624, "#8fd07a", 24, true) + fruit(1064, 630, "#d2508a", 20, false) +
    // pimenta e ervas penduradas
    Array.from({ length: 7 }, (_, i) => `<g transform="translate(${480 + i * 40},120)"><g>${sway(6, 2.4 + (i % 3) * 0.5, 0, 0, i * 0.4)}<path d="M0,0 V70" stroke="${p.wood}" stroke-width="2"/><path d="M0,70 q-14,22 0,46 q14,-24 0,-46 Z" fill="${i % 2 ? p.accent2 : "#e2582f"}"/></g></g>`).join("") +
    `<rect x="470" y="116" width="280" height="6" rx="3" fill="${p.wood}"/>` + sparkles(r, 20, p, "#fff0c0", 300, 620);
}
const cloudMini = (x, y) => `<g transform="translate(${x},${y})"><g><animateTransform attributeName="transform" type="translate" values="-30 0;30 0;-30 0" dur="14s" repeatCount="indefinite"/><ellipse cx="0" cy="0" rx="28" ry="10" fill="#ffffff"/><circle cx="-8" cy="-8" r="12" fill="#ffffff"/><circle cx="8" cy="-6" r="10" fill="#ffffff"/></g></g>`;
