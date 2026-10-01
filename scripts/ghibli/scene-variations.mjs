import { bird, flowers, house, pine, ridge, tree } from "./lib.mjs";

const INDOOR = new Set(["lab", "workshop", "control", "classroom", "studio", "cinema", "concertHall", "library", "chapelInterior", "kitchen", "dining", "bakery", "farmhouse"]);
const WATER = new Set(["waterfall", "beach", "coast", "harbor", "river", "island", "lake"]);

function backdrop(setting, p, r) {
  if (INDOOR.has(setting)) {
    const shelves = setting === "library" || setting === "bakery"
      ? `<path d="M60,320 H1140 M60,450 H1140" stroke="${p.wood}" stroke-width="14" opacity=".7"/><path d="M70,290 V470 M1130,290 V470" stroke="${p.wood}" stroke-width="10"/>`
      : "";
    return `<rect y="250" width="1200" height="390" fill="${p.wallShade}" opacity=".52"/><path d="M0,640 H1200 V800 H0 Z" fill="${p.woodLight}"/><path d="M0,674 H1200 M0,730 H1200" stroke="${p.wood}" stroke-width="3" opacity=".24"/><rect x="90" y="300" width="170" height="190" rx="12" fill="${p.wall}" opacity=".75"/><path d="M175,300 V490 M90,395 H260" stroke="${p.woodLight}" stroke-width="12"/>${shelves}`;
  }

  const hills = `<path d="${ridge(r, 470, 42)}" fill="${p.hillFar}"/><path d="${ridge(r, 550, 38)}" fill="${p.hillMid}"/><path d="M0,620 Q260,570 520,620 T1200,605 V800 H0 Z" fill="${p.hillNear}"/><path d="M0,730 Q300,680 610,730 T1200,710 V800 H0 Z" fill="${p.hillFront}"/>`;
  const water = WATER.has(setting)
    ? `<path d="M0,560 Q260,525 490,565 T960,550 T1200,570 V800 H0 Z" fill="url(#gWater)"/><path d="M0,580 Q220,550 430,586 T850,572 T1200,585" fill="none" stroke="#fff" stroke-width="5" opacity=".35"><animate attributeName="d" values="M0,580 Q220,550 430,586 T850,572 T1200,585;M0,590 Q220,560 430,576 T850,590 T1200,575;M0,580 Q220,550 430,586 T850,572 T1200,585" dur="5s" repeatCount="indefinite"/></path>`
    : "";
  const town = [0, 1, 2, 3].map((index) => house(135 + index * 300, 600 + (index % 2) * 12, 1.05 + (index % 2) * 0.12, p, ["#f4d5a8", "#d5ead8", "#f3c4c3", "#d1dff2"][index], [p.roof, p.accent3, p.accent2, p.leaf][index])).join("");
  const trees = [tree(100, 715, 1.15, p), pine(1090, 720, 1.0, p)].join("");
  const foreground = setting === "town" || setting === "village" || setting === "square" || setting === "parade" || setting === "festival" || setting === "market"
    ? town
    : setting === "forest" || setting === "grove" || setting === "garden" || setting === "park" || setting === "meadow"
      ? trees + flowers(r, 32, p, 690, 790)
      : "";
  const context = setting === "volcano"
    ? `<path d="M300,620 L600,260 L900,620 Z" fill="${p.stoneShade}"/><path d="M545,335 L600,260 L655,335" fill="none" stroke="${p.accent2}" stroke-width="25"/>`
    : setting === "canyon"
      ? `<path d="M0,800 L0,430 L240,520 L300,800 Z M1200,800 L1200,420 L950,530 L900,800 Z" fill="${p.stoneShade}" opacity=".9"/>`
      : setting === "launch"
        ? `<path d="M0,670 H1200 V800 H0 Z" fill="#27344f"/><path d="M180,670 V520 H1020 V670" fill="none" stroke="${p.stoneShade}" stroke-width="12"/>`
        : setting === "airport"
          ? `<path d="M0,690 H1200 V800 H0 Z" fill="#666f79"/><path d="M0,752 H1200" stroke="#fff" stroke-width="5" stroke-dasharray="44 32" opacity=".7"/>`
          : "";
  return hills + water + foreground + context;
}

function shape(type, p, r) {
  const ink = p.ink;
  const wood = p.wood;
  const accent = p.accent1;
  if (["tree", "palm", "olive", "forest"].includes(type)) {
    if (type === "palm") return `<path d="M0,0 Q18,-80 0,-180" fill="none" stroke="${wood}" stroke-width="24"/><path d="M0,-170 Q-105,-245 -150,-200 Q-70,-190 0,-158 Q-85,-280 -52,-298 Q-27,-220 5,-160 Q5,-290 38,-300 Q46,-215 12,-155 Q112,-264 152,-222 Q65,-210 6,-150 Z" fill="${p.leaf}" stroke="${p.leafDark}" stroke-width="5"/>`;
    if (type === "olive") return `<path d="M-12,0 Q10,-90 -4,-190" stroke="${wood}" stroke-width="27" fill="none"/><ellipse cx="-60" cy="-210" rx="100" ry="50" fill="${p.leafDark}"/><ellipse cx="55" cy="-226" rx="110" ry="56" fill="${p.leaf}"/><ellipse cy="-272" rx="90" ry="52" fill="${p.leafLight}"/>${[[-48,-214],[52,-232],[4,-271],[98,-205]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="${p.accent3}"/>`).join("")}`;
    return tree(0, 0, 1.45, p);
  }
  if (type === "flower") return `<path d="M0,0 Q-6,-66 0,-125" stroke="${p.leafDark}" stroke-width="8"/><path d="M0,-70 q-46,-34 -55,-8 q28,2 55,24 M0,-48 q42,-30 55,-7 q-28,2 -55,23" fill="${p.leaf}"/><circle cy="-135" r="29" fill="${p.accent2}"/><circle cx="-34" cy="-135" r="20" fill="${p.accent1}"/><circle cx="34" cy="-135" r="20" fill="${p.accent3}"/><circle cy="-169" r="20" fill="#fff2c9"/><circle cy="-135" r="12" fill="${accent}"/>`;
  if (type === "butterfly") return `<path d="M0,-80 V-140" stroke="${ink}" stroke-width="7"/><path d="M0,-112 Q-72,-190 -76,-122 Q-65,-84 0,-108 Q72,-190 76,-122 Q65,-84 0,-108Z" fill="${p.accent2}"/><path d="M0,-108 Q-58,-100 -42,-62 Q-10,-60 0,-102 Q58,-100 42,-62 Q10,-60 0,-102Z" fill="${p.accent3}"/><circle cy="-108" r="8" fill="#fff"/>`;
  if (["bird", "dove", "duck"].includes(type)) {
    const body = type === "duck" ? p.warm : type === "dove" ? "#fff8e6" : p.accent3;
    return `<ellipse cx="0" cy="-76" rx="70" ry="42" fill="${body}"/><circle cx="54" cy="-112" r="30" fill="${body}"/><path d="M78,-110 l42,12 -42,14 Z" fill="${p.accent1}"/><path d="M-12,-82 Q-40,-142 24,-138 Q26,-98 8,-70Z" fill="${type === "dove" ? "#f3f5ff" : p.leafDark}"/><path d="M-38,-34 V0 M22,-34 V0" stroke="${wood}" stroke-width="8"/><circle cx="62" cy="-118" r="4" fill="${ink}"/>`;
  }
  if (["mountain", "volcano"].includes(type)) return `<path d="M-205,0 C-158,-61 -113,-131 -44,-220 Q-29,-239 -10,-213 L38,-144 L83,-190 Q96,-208 111,-186 C144,-135 177,-74 210,0Z" fill="${type === "volcano" ? p.stoneShade : p.hillFar}"/><path d="M-45,-218 Q-25,-229 -9,-211 L19,-170 L-8,-179 L-23,-161 L-31,-184 L-54,-177Z M82,-188 Q98,-202 112,-183 L143,-132 L115,-145 L99,-125 L91,-147 L71,-139Z" fill="#e8e6dd" opacity=".92"/><path d="M-154,-65 Q-102,-115 -71,-135 M-13,-112 L31,-91 M111,-93 L166,-57" stroke="${type === "volcano" ? p.ink : p.hillMid}" stroke-width="7" fill="none" opacity=".38"/><path d="M-204,0 Q-92,-10 0,0 T210,0" stroke="${p.hillFront}" stroke-width="8" fill="none"/>${type === "volcano" ? `<path d="M-38,-202 Q-4,-222 30,-202 L18,-182 Q-5,-190 -25,-180Z" fill="${p.accent2}"/>` : ""}`;
  if (["river", "ocean", "beach", "waterfall"].includes(type)) {
    if (type === "waterfall") return `<path d="M-128,-190 Q-70,-218 0,-194 Q67,-215 128,-188 L101,-115 Q70,-72 111,0 H-111 Q-66,-62 -98,-116Z" fill="${p.stoneShade}"/><path d="M-53,-177 Q-42,-158 -51,-127 C-59,-93 -35,-69 -41,-35 Q-14,-58 -20,-91 C-26,-124 -6,-151 -15,-178Z M22,-181 Q38,-151 25,-119 C12,-85 42,-58 35,-29 Q62,-60 49,-96 C38,-128 59,-157 43,-183Z" fill="url(#gWater)"/><path d="M-45,-155 Q-53,-109 -32,-75 M31,-158 Q18,-111 42,-82" fill="none" stroke="#f3f1e9" stroke-width="7" opacity=".8"/><ellipse cy="-9" rx="151" ry="28" fill="url(#gWater)"/><path d="M-120,-10 Q-62,-27 0,-9 T120,-12" fill="none" stroke="#e4eeeb" stroke-width="5" opacity=".62"/>`;
    return `<path d="M-220,-60 C-181,-92 -140,-94 -106,-67 C-63,-32 -20,-87 17,-61 C53,-37 81,-81 123,-63 C162,-45 185,-67 225,-53 L240,0 H-240Z" fill="${type === "beach" ? p.warm : "url(#gWater)"}"/><path d="M-205,-46 C-164,-66 -127,-67 -96,-47 C-51,-18 -17,-65 22,-43 C60,-20 90,-60 129,-43 C158,-30 187,-45 222,-36 M-183,-17 C-144,-36 -110,-36 -81,-17 C-42,5 -9,-34 32,-17 C72,1 99,-35 140,-19" fill="none" stroke="#f1eee4" stroke-width="5" stroke-linecap="round" opacity=".7"/><path d="M-210,-58 C-150,-79 -120,-77 -92,-58" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>`;
  }
  if (["house", "hotel", "farm", "church", "cinema", "fortress", "oldhouse", "monument", "lab", "bakery"].includes(type)) {
    const width = type === "fortress" || type === "monument" ? 300 : 225;
    const building = `<path d="M-${width/2},0 L-${width/2},-166 Q0,-179 ${width/2},-166 L${width/2},0Z" fill="url(#gWall)"/><path d="M-${width/2-18},-163 L0,-260 L${width/2-18},-163 Q0,-177 -${width/2-18},-163Z" fill="url(#gRoof)"/><path d="M-${width/2-23},-163 Q0,-177 ${width/2-23},-163" fill="none" stroke="${p.wood}" stroke-width="10"/><path d="M-23,0 V-67 Q0,-95 23,-67 V0Z" fill="url(#gWood)"/><path d="M0,-68 V-2" stroke="${p.woodLight}" stroke-width="3" opacity=".75"/>`;
    const windows = [-width/2+48, width/2-48].map((x)=>`<path d="M${x-20},-88 V-123 Q${x},-137 ${x+20},-123 V-88Z" fill="url(#gGlass)" stroke="${p.wallShade}" stroke-width="6"/><path d="M${x},-131 V-89 M${x-18},-108 H${x+18}" stroke="${p.wall}" stroke-width="3" opacity=".76"/>`).join("");
    const sign = type === "cinema" ? `<rect x="-72" y="-220" width="144" height="45" rx="8" fill="${ink}"/><circle cx="-45" cy="-198" r="8" fill="${accent}"/><circle cx="-15" cy="-198" r="8" fill="${p.accent2}"/><circle cx="15" cy="-198" r="8" fill="${p.accent1}"/><circle cx="45" cy="-198" r="8" fill="${p.accent3}"/>` : "";
    const cross = type === "church" ? `<path d="M0,-330 V-250 M-28,-300 H28" stroke="${accent}" stroke-width="15" stroke-linecap="round"/>` : "";
    const battlement = type === "fortress" ? `<path d="M-160,-170 V-225 H-115 V-170 M-70,-170 V-225 H-25 V-170 M25,-170 V-225 H70 V-170 M115,-170 V-225 H160 V-170" fill="${p.stone}"/>` : "";
    return building + windows + sign + cross + battlement;
  }
  if (type === "lighthouse") return `<path d="M-74,0 L-48,-250 H48 L74,0Z" fill="${p.wall}" stroke="${p.stoneShade}" stroke-width="8"/><path d="M-55,-155 H55 M-50,-92 H50" stroke="${p.accent2}" stroke-width="27"/><rect x="-68" y="-288" width="136" height="39" fill="${ink}"/><path d="M-78,-288 L0,-340 L78,-288Z" fill="${p.roof}"/><path d="M0,-323 L205,-385 V-260Z" fill="${p.warm}" opacity=".42"/><rect x="-20" y="-235" width="40" height="43" fill="${p.warm}"/>`;
  if (type === "camera") return `<rect x="-140" y="-155" width="280" height="155" rx="24" fill="${ink}"/><path d="M-74,-155 L-40,-208 H40 L74,-155" fill="${p.stone}"/><circle cy="-83" r="58" fill="${p.accent3}" stroke="${p.wall}" stroke-width="14"/><circle cy="-83" r="25" fill="${ink}"/>`;
  if (type === "projector") return `<rect x="-140" y="-145" width="280" height="125" rx="20" fill="${ink}"/><circle cx="88" cy="-83" r="42" fill="${p.stone}"/><circle cx="88" cy="-83" r="25" fill="${p.accent3}"/><circle cx="-82" cy="-83" r="23" fill="${p.accent2}"/><path d="M-75,-20 V0 M75,-20 V0" stroke="${wood}" stroke-width="16"/>`;
  if (type === "book") return `<path d="M-165,-190 Q-75,-210 0,-165 V0 Q-80,-38 -165,-12Z M165,-190 Q75,-210 0,-165 V0 Q80,-38 165,-12Z" fill="${p.wall}" stroke="${wood}" stroke-width="10"/><path d="M-125,-148 H-30 M-125,-110 H-30 M30,-148 H125 M30,-110 H125" stroke="${p.accent3}" stroke-width="9"/>`;
  if (["computer", "monitor", "screen", "phone", "ticket", "window", "keyboard", "headphones"].includes(type)) {
    if (type === "headphones") return `<path d="M-105,-88 V-145 Q0,-260 105,-145 V-88" fill="none" stroke="${ink}" stroke-width="24"/><rect x="-122" y="-112" width="44" height="92" rx="18" fill="${p.accent3}"/><rect x="78" y="-112" width="44" height="92" rx="18" fill="${p.accent3}"/>`;
    const width = type === "phone" || type === "ticket" ? 130 : type === "book" || type === "scroll" || type === "map" ? 210 : 270;
    const height = type === "phone" || type === "ticket" ? 215 : type === "book" || type === "scroll" || type === "map" ? 150 : 185;
    const frame = `<rect x="-${width/2}" y="-${height}" width="${width}" height="${height}" rx="${type === "phone" ? 28 : 14}" fill="${type === "book" || type === "scroll" || type === "map" ? p.warm : ink}"/><rect x="-${width/2+(-0)}" y="-${height-14}" width="${width}" height="${height-28}" rx="8" fill="${type === "book" || type === "scroll" || type === "map" ? p.wall : p.accent3}" opacity=".95"/>`;
    const stand = width > 200 ? `<path d="M0,-4 V30 M-55,30 H55" stroke="${p.stone}" stroke-width="16" stroke-linecap="round"/>` : "";
    const details = `<path d="M-${width/2+25},-${height-44} H${width/2-25} M-${width/2+25},-${height-74} H${width/2-25}" stroke="${p.accent1}" stroke-width="10" opacity=".9"/>`;
    return frame + details + stand;
  }
  if (["robot"].includes(type)) return `<rect x="-75" y="-145" width="150" height="135" rx="42" fill="${p.wall}" stroke="${p.accent3}" stroke-width="10"/><rect x="-55" y="-5" width="110" height="110" rx="30" fill="${p.accent3}"/><circle cx="-30" cy="-90" r="13" fill="${ink}"/><circle cx="30" cy="-90" r="13" fill="${ink}"/><path d="M-28,-48 Q0,-27 28,-48 M-65,-115 L-110,-138 M65,-115 L110,-138" fill="none" stroke="${ink}" stroke-width="12"/><circle cy="-165" r="12" fill="${p.accent2}"/>`;
  if (["drone", "airplane", "satellite"].includes(type)) {
    if (type === "satellite") return `<rect x="-55" y="-115" width="110" height="105" rx="18" fill="${p.warm}" stroke="${ink}" stroke-width="7"/><rect x="-178" y="-97" width="105" height="70" fill="${p.accent3}" stroke="${ink}" stroke-width="7"/><rect x="73" y="-97" width="105" height="70" fill="${p.accent3}" stroke="${ink}" stroke-width="7"/><path d="M0,-115 V-170 M-45,-170 H45" stroke="${ink}" stroke-width="8"/>`;
    if (type === "airplane") return `<path d="M-190,-80 L-24,-95 L40,-185 L83,-185 L66,-92 L190,-60 L190,-28 L61,-45 L42,0 L13,0 L6,-46 L-190,-48Z" fill="${p.wall}" stroke="${ink}" stroke-width="7"/>`;
    return `<ellipse cx="0" cy="-85" rx="68" ry="28" fill="${p.wall}"/><path d="M-60,-88 L-148,-145 M60,-88 L148,-145 M-44,-82 L-112,-28 M44,-82 L112,-28" stroke="${ink}" stroke-width="11"/><ellipse cx="-148" cy="-148" rx="54" ry="7" fill="${p.stone}"/><ellipse cx="148" cy="-148" rx="54" ry="7" fill="${p.stone}"/><circle cy="-86" r="13" fill="${p.accent2}"/>`;
  }
  if (type === "tractor") return `<path d="M-155,-18 V-112 H-42 L0,-176 H108 L146,-100 H180 V-18Z" fill="${p.accent3}" stroke="${ink}" stroke-width="9"/><rect x="-18" y="-165" width="104" height="88" fill="${p.wall}" stroke="${ink}" stroke-width="8"/><circle cx="-95" cy="-18" r="55" fill="${ink}"/><circle cx="-95" cy="-18" r="25" fill="${p.stone}"/><circle cx="116" cy="-18" r="34" fill="${ink}"/><circle cx="116" cy="-18" r="15" fill="${p.stone}"/>`;
  if (["turbine", "antenna", "flag", "cross", "bell", "candle", "torch", "lantern", "lamp", "light", "star"].includes(type)) {
    if (type === "turbine") return `<path d="M0,0 V-190" stroke="${p.wall}" stroke-width="16"/><g transform="translate(0,-190)"><circle r="18" fill="${p.accent1}"/><path d="M0,-15 Q-20,-145 0,-180 Q20,-145 8,-15 M14,8 Q140,35 163,64 Q145,89 14,26 M-14,8 Q-140,35 -163,64 Q-145,89 -14,26" fill="${p.wall}" stroke="${p.stoneShade}" stroke-width="5"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/></path></g>`;
    if (type === "flag") return `<path d="M-62,0 V-205" stroke="${wood}" stroke-width="12"/><path d="M-56,-198 Q25,-220 112,-193 L110,-92 Q24,-68 -56,-94 Z" fill="${p.accent3}"/><path d="M-56,-140 Q25,-164 110,-138 L110,-92 Q24,-68 -56,-94 Z" fill="${p.accent2}"/>`;
    if (type === "cross") return `<path d="M0,-215 V0 M-75,-145 H75" stroke="${p.wood}" stroke-width="25" stroke-linecap="round"/>`;
    if (type === "candle" || type === "torch" || type === "lantern" || type === "lamp" || type === "light") return `<rect x="-34" y="-100" width="68" height="100" rx="12" fill="${type === "lamp" ? p.wood : p.wall}"/><path d="M0,-105 Q-42,-148 0,-205 Q42,-148 0,-105Z" fill="${p.warm}"><animate attributeName="d" values="M0,-105 Q-42,-148 0,-205 Q42,-148 0,-105Z;M0,-105 Q-30,-154 2,-192 Q36,-150 0,-105Z;M0,-105 Q-42,-148 0,-205 Q42,-148 0,-105Z" dur="1s" repeatCount="indefinite"/></path><circle cy="-154" r="85" fill="${p.warm}" opacity=".1"/>`;
    if (type === "star") return `<path d="M0,-220 L52,-75 L205,-72 L85,20 L124,170 L0,82 L-124,170 L-85,20 L-205,-72 L-52,-75Z" fill="${p.warm}"/>`;
    if (type === "bell") return `<path d="M-90,-30 Q-82,-178 0,-178 Q82,-178 90,-30 L130,0 H-130Z" fill="${p.warm}" stroke="${ink}" stroke-width="8"/><circle cy="8" r="18" fill="${p.accent2}"/>`;
    return `<path d="M0,0 V-185 M-85,-165 Q0,-205 85,-165" stroke="${ink}" stroke-width="12"/><circle cy="-185" r="14" fill="${p.accent1}"/>`;
  }
  if (["boat", "balloon", "suitcase", "bridge", "well", "gate", "fence", "path", "stage", "swing", "bike", "kite", "parasol"].includes(type)) {
    if (type === "boat") return `<path d="M-170,-72 H170 L120,-8 H-115Z" fill="${wood}"/><path d="M0,-235 V-74 M12,-225 Q135,-174 145,-85 H12Z" fill="${p.wall}"/><path d="M-10,-205 Q-120,-150 -125,-82 H-10Z" fill="${p.accent3}"/>`;
    if (type === "balloon") return `<path d="M0,-275 C-132,-275 -139,-104 -35,-62 L35,-62 C139,-104 132,-275 0,-275Z" fill="${p.accent2}"/><path d="M0,-275 C-30,-275 -42,-118 -12,-62 H12 C42,-118 30,-275 0,-275Z" fill="${p.accent1}"/><path d="M-22,-62 L-15,-10 M22,-62 L15,-10" stroke="${ink}" stroke-width="8"/><rect x="-30" y="-12" width="60" height="45" rx="6" fill="${wood}"/>`;
    if (type === "suitcase") return `<rect x="-120" y="-175" width="240" height="170" rx="22" fill="${p.accent3}"/><path d="M-48,-175 V-215 Q-48,-245 0,-245 Q48,-245 48,-215 V-175 M0,-175 V-5" fill="none" stroke="${p.stone}" stroke-width="13"/><circle cx="-74" cy="8" r="10" fill="${ink}"/><circle cx="74" cy="8" r="10" fill="${ink}"/>`;
    if (type === "bike") return `<circle cx="-95" cy="-40" r="72" fill="none" stroke="${ink}" stroke-width="11"/><circle cx="105" cy="-40" r="72" fill="none" stroke="${ink}" stroke-width="11"/><path d="M-95,-40 L-25,-150 L45,-40 H-95 L-25,-150 L105,-40 M-45,-158 H-5 M72,-62 L125,-160" fill="none" stroke="${p.accent2}" stroke-width="12" stroke-linecap="round"/>`;
    if (type === "kite") return `<path d="M0,-250 L120,-125 L0,0 L-120,-125Z" fill="${p.accent2}"/><path d="M0,-250 V0 M-120,-125 H120" stroke="#fff" stroke-width="8"/><path d="M0,0 Q45,60 5,105 Q-40,145 18,190" fill="none" stroke="${p.accent3}" stroke-width="8" stroke-dasharray="20 14"/>`;
    if (type === "parasol") return `<path d="M-170,-100 Q0,-280 170,-100Z" fill="${p.accent2}"/><path d="M0,-100 V0 M-170,-100 Q-85,-45 0,-100 Q85,-45 170,-100" fill="none" stroke="${ink}" stroke-width="9"/>`;
    if (type === "well") return `<ellipse cx="0" cy="-30" rx="120" ry="42" fill="${p.stone}"/><path d="M-110,-30 V0 H110 V-30 M-82,-65 V-180 M82,-65 V-180 M-82,-180 H82" stroke="${wood}" stroke-width="15" fill="none"/><path d="M-58,-30 V0 H58 V-30Z" fill="${p.water}"/>`;
    if (type === "fence" || type === "gate") return `<path d="M-190,0 V-160 M-95,0 V-160 M0,0 V-160 M95,0 V-160 M190,0 V-160 M-210,-115 H210 M-210,-48 H210" stroke="${wood}" stroke-width="18"/>`;
    if (type === "bridge" || type === "path") return `<path d="M-220,0 Q0,-210 220,0 M-180,-25 V-95 M-95,-83 V-160 M0,-111 V-190 M95,-83 V-160 M180,-25 V-95" fill="none" stroke="${p.stone}" stroke-width="25"/>`;
    if (type === "swing") return `<path d="M-110,-5 V-255 M110,-5 V-255 M-110,-230 H110 M-60,-155 V-18 M60,-155 V-18" stroke="${wood}" stroke-width="15"/><rect x="-92" y="-32" width="184" height="24" rx="8" fill="${p.accent2}"/>`;
    if (type === "stage") return `<path d="M-220,0 V-130 H220 V0Z" fill="${wood}"/><path d="M-250,-132 Q0,-255 250,-132" fill="none" stroke="${p.accent2}" stroke-width="35"/><circle cx="-140" cy="-100" r="12" fill="${p.warm}"/><circle cx="0" cy="-140" r="12" fill="${p.warm}"/><circle cx="140" cy="-100" r="12" fill="${p.warm}"/>`;
  }
  if (type === "chair") return `<path d="M-90,-190 V-20 H105 V-115 H-72 M-60,-20 V0 M75,-20 V0" fill="none" stroke="${wood}" stroke-width="22" stroke-linecap="round"/><rect x="-78" y="-115" width="190" height="30" rx="10" fill="${p.accent2}"/>`;
  if (["dancer", "vendor", "sage", "costume", "horse", "goat", "chicken", "turtle", "mask"].includes(type)) {
    if (["horse", "goat", "chicken", "turtle"].includes(type)) {
      const body = type === "turtle" ? p.leaf : type === "chicken" ? p.wall : p.woodLight;
      const bodyShape = type === "turtle" ? `<ellipse cy="-64" rx="105" ry="65" fill="${p.leafDark}"/><path d="M-65,-88 Q0,-150 65,-88 M-50,-50 Q0,-105 50,-50" stroke="${p.leafLight}" stroke-width="9" fill="none"/>` : `<ellipse cx="-12" cy="-80" rx="100" ry="55" fill="${body}"/>`;
      return `${bodyShape}<circle cx="82" cy="-103" r="35" fill="${body}"/><circle cx="94" cy="-110" r="5" fill="${ink}"/><path d="M-55,-42 V0 M40,-42 V0 M105,-85 Q145,-94 157,-75" stroke="${wood}" stroke-width="13"/>${type === "chicken" ? `<path d="M70,-139 l18,-24 l12,24" fill="${p.accent2}"/>` : ""}`;
    }
    if (type === "mask") return `<path d="M-125,-210 Q0,-260 125,-210 L110,-75 Q0,5 -110,-75Z" fill="${p.accent2}" stroke="${wood}" stroke-width="12"/><path d="M-82,-155 Q-55,-180 -28,-155 M28,-155 Q55,-180 82,-155" stroke="${ink}" stroke-width="17"/><path d="M-28,-95 Q0,-75 28,-95" fill="none" stroke="${ink}" stroke-width="12"/>`;
    const clothing = type === "dancer" || type === "costume" ? p.accent2 : p.accent3;
    const figure = `<path d="M-42,-116 L36,-116 L54,0 H-52Z" fill="${clothing}"/><path d="M-33,-106 Q-71,-145 -84,-188 M30,-105 Q68,-139 92,-116" fill="none" stroke="#80553f" stroke-width="14" stroke-linecap="round"/><path d="M-21,-4 Q-24,23 -45,44 M21,-4 Q29,21 53,43" fill="none" stroke="#57453d" stroke-width="12" stroke-linecap="round"/><path d="M-28,-190 Q-25,-226 2,-230 Q32,-223 31,-187 L22,-163 Q5,-149 -13,-163Z" fill="url(#gSkin)"/><path d="M-31,-192 Q-47,-230 -4,-247 Q34,-248 39,-211 Q19,-225 2,-214 Q-10,-195 -31,-192Z" fill="${ink}"/><path d="M-16,-187 Q-9,-192 -3,-187 M12,-187 Q19,-192 25,-187" stroke="#332b27" stroke-width="3" fill="none"/><circle cx="-9" cy="-186" r="2.5" fill="#29231f"/><circle cx="19" cy="-186" r="2.5" fill="#29231f"/><path d="M2,-176 Q7,-171 12,-176 M-3,-161 Q8,-154 18,-162" stroke="#895844" stroke-width="2.5" fill="none"/><path d="M-28,-88 Q0,-71 31,-88" stroke="${p.wall}" stroke-width="5" opacity=".55"/>`;
    const danceCloth = type === "dancer" || type === "costume"
      ? `<path d="M-34,-116 L33,-116 L52,-51 Q94,-25 128,5 Q79,24 4,6 Q-69,26 -128,4 Q-85,-33 -52,-51Z" fill="${clothing}"/><path d="M-106,2 Q0,24 108,2 M-27,-99 Q-10,-62 -35,-30 M24,-98 Q7,-62 39,-31" stroke="${p.accent1}" stroke-width="5" fill="none" opacity=".8"/>`
      : "";
    return `<ellipse cy="8" rx="72" ry="14" fill="#29251f" opacity=".18"/><g>${figure}${danceCloth}<path d="M-51,-96 L-58,-25 M47,-95 L55,-26" stroke="${p.wall}" stroke-width="4" opacity=".48"/></g>`;
  }
  if (["drum", "guitar", "piano", "keyboard", "speaker", "mic", "music", "note", "fan"].includes(type)) {
    if (type === "guitar") return `<path d="M-12,-246 H12 V-82 H-12Z" fill="${wood}"/><ellipse cy="-55" rx="80" ry="70" fill="${p.woodLight}"/><ellipse cy="-26" rx="105" ry="72" fill="${wood}"/><circle cy="-50" r="20" fill="${ink}"/><path d="M0,-246 V18" stroke="#fff8e6" stroke-width="4"/>`;
    if (type === "drum") return `<path d="M-90,-155 H90 L70,0 H-70Z" fill="${p.accent2}"/><ellipse cy="-155" rx="90" ry="22" fill="${p.wall}"/><path d="M-78,-105 H78 M-72,-55 H72" stroke="${p.accent1}" stroke-width="12"/>`;
    if (type === "piano" || type === "keyboard") return `<rect x="-180" y="-155" width="360" height="155" rx="14" fill="${ink}"/><rect x="-162" y="-112" width="324" height="96" fill="#fff"/>${Array.from({length:8},(_,i)=>`<rect x="${-145+i*40}" y="-112" width="17" height="54" fill="${ink}"/>`).join("")}`;
    if (type === "speaker") return `<rect x="-105" y="-225" width="210" height="225" rx="18" fill="${ink}"/><circle cy="-152" r="52" fill="${p.accent3}" stroke="${p.stone}" stroke-width="10"/><circle cy="-48" r="30" fill="${p.accent2}"/>`;
    if (type === "mic") return `<rect x="-30" y="-235" width="60" height="148" rx="30" fill="${p.stone}"/><path d="M-72,-128 V-95 Q0,-35 72,-95 V-128 M0,-35 V0 M-50,0 H50" fill="none" stroke="${ink}" stroke-width="14"/>`;
    if (type === "fan") return `<circle cy="-120" r="20" fill="${ink}"/>${[0,120,240].map(a=>`<ellipse cy="-190" rx="38" ry="90" transform="rotate(${a} 0 -120)" fill="${p.accent3}"/>`).join("")}`;
    const notes = [0,1,2].map((i)=>`<g transform="translate(${-85+i*85},${-175-(i%2)*55})"><ellipse rx="22" ry="15" fill="${p.accent2}" transform="rotate(-20)"/><path d="M20,-4 V-86" stroke="${p.accent2}" stroke-width="10"/></g>`).join("");
    return notes;
  }
  if (["food", "fruit", "pepper", "vegetable", "bread", "pot", "table", "plate", "knife", "fork", "bottle", "popcorn", "jar"].includes(type)) {
    if (type === "pot") return `<path d="M-135,-135 H135 L112,-5 Q0,25 -112,-5Z" fill="#b5533b"/><ellipse cy="-135" rx="135" ry="25" fill="${p.stoneShade}"/><ellipse cy="-143" rx="112" ry="16" fill="${p.accent2}"/><path d="M-145,-90 H-200 M145,-90 H200" stroke="${ink}" stroke-width="15" stroke-linecap="round"/><path d="M-60,-175 q20,-40 0,-72 M0,-180 q20,-40 0,-72 M60,-175 q20,-40 0,-72" fill="none" stroke="#fff" stroke-width="8" opacity=".7"/>`;
    if (type === "table") return `<path d="M-200,-115 H200 V-82 H-200Z M-160,-82 V0 M160,-82 V0" fill="${wood}" stroke="${wood}" stroke-width="18"/>`;
    if (type === "plate") return `<ellipse cy="-42" rx="150" ry="48" fill="${p.wall}" stroke="${p.stoneShade}" stroke-width="12"/><ellipse cy="-48" rx="92" ry="24" fill="${p.accent1}"/>`;
    if (type === "bread") return `<path d="M-140,-12 Q-155,-135 0,-155 Q155,-135 140,-12Z" fill="#d9974e"/><path d="M-65,-55 q12,-52 32,-82 M0,-47 q15,-55 35,-90 M62,-46 q15,-45 32,-74" stroke="#f4c684" stroke-width="13" stroke-linecap="round"/>`;
    if (type === "pepper") return `<path d="M-2,-162 C-8,-188 12,-198 33,-186 C23,-170 10,-162 2,-151 C34,-169 75,-153 82,-116 C92,-66 52,-10 5,-8 C-40,-6 -84,-57 -74,-111 C-67,-151 -34,-171 -2,-162Z" fill="url(#gPepper)"/><path d="M-3,-161 C-11,-184 -8,-203 4,-214 M2,-158 C8,-181 25,-187 39,-181" fill="none" stroke="${p.leafDark}" stroke-width="10" stroke-linecap="round"/><path d="M-34,-143 C-59,-119 -56,-82 -39,-59" fill="none" stroke="#f3c49b" stroke-width="7" opacity=".58"/>`;
    if (type === "vegetable") return `<path d="M0,0 C-5,-70 -15,-111 -8,-174 C-54,-213 -99,-187 -93,-145 C-149,-151 -160,-105 -116,-79 C-158,-46 -121,-4 -80,-25 C-45,-1 -16,-8 0,0Z M0,0 C6,-70 17,-116 8,-176 C52,-214 99,-184 93,-145 C146,-153 160,-105 115,-79 C155,-44 121,-3 80,-25 C43,-1 15,-7 0,0Z" fill="url(#gLeaf)" stroke="${p.leafDark}" stroke-width="5"/><path d="M0,0 Q-2,-93 0,-178 M-4,-75 L-72,-140 M4,-92 L74,-148 M-4,-45 L-100,-81 M4,-53 L102,-82" fill="none" stroke="#c5cf9d" stroke-width="5" opacity=".72"/>`;
    if (type === "fruit") return `<path d="M-84,-22 C-102,-58 -84,-112 -42,-114 C-21,-115 -11,-102 0,-108 C19,-121 49,-113 66,-94 C103,-54 82,-7 51,18 C23,42 -53,37 -84,-22Z" fill="url(#gFruit)"/><path d="M0,-107 C4,-130 16,-141 31,-146 M9,-132 Q34,-151 52,-139 Q37,-121 9,-126Z" fill="${p.leaf}" stroke="${p.leafDark}" stroke-width="3"/><path d="M-61,-77 Q-72,-48 -55,-27" fill="none" stroke="#f5d4a6" stroke-width="8" stroke-linecap="round" opacity=".7"/>`;
    if (type === "food") return `<path d="M-142,-10 Q-151,-105 -91,-130 Q-51,-149 -4,-119 Q44,-151 93,-120 Q151,-84 137,-10Z" fill="url(#gWall)" stroke="${p.stoneShade}" stroke-width="7"/><path d="M-111,-34 Q-65,-53 -20,-34 T71,-34 T126,-31" fill="none" stroke="${p.accent2}" stroke-width="16" stroke-linecap="round"/><ellipse cx="-56" cy="-83" rx="25" ry="14" fill="${p.accent1}"/><ellipse cx="39" cy="-82" rx="27" ry="15" fill="${p.leaf}"/><path d="M-53,-100 Q-43,-116 -28,-112 M38,-99 Q51,-118 65,-111" fill="none" stroke="${p.leafDark}" stroke-width="5"/>`;
    if (type === "bottle") return `<path d="M-42,-210 H42 V-158 L78,-118 V0 H-78 V-118 L-42,-158Z" fill="${p.accent3}" stroke="${p.wall}" stroke-width="10"/><rect x="-36" y="-228" width="72" height="23" rx="5" fill="${wood}"/>`;
    if (type === "jar") return `<path d="M-75,-165 H75 L95,-20 Q0,10 -95,-20Z" fill="${p.accent3}" stroke="${p.wall}" stroke-width="10"/><rect x="-85" y="-198" width="170" height="34" rx="8" fill="${p.woodLight}"/><path d="M-46,-110 H46" stroke="${p.accent1}" stroke-width="18"/>`;
    if (type === "knife") return `<path d="M-14,-230 Q98,-200 80,-75 L10,-38Z" fill="${p.stone}" stroke="${ink}" stroke-width="8"/><rect x="-24" y="-45" width="48" height="95" rx="17" fill="${wood}"/>`;
    if (type === "fork") return `<path d="M-45,-230 V-150 Q0,-100 45,-150 V-230 M-22,-230 V-155 M22,-230 V-155 M0,-120 V0" fill="none" stroke="${p.stone}" stroke-width="17" stroke-linecap="round"/><rect x="-25" y="-12" width="50" height="55" rx="18" fill="${wood}"/>`;
    if (type === "popcorn") return `<path d="M-112,-140 H112 L88,0 H-88Z" fill="${p.accent2}"/><path d="M-42,-132 L-25,0 M30,-132 L42,0" stroke="#fff8e6" stroke-width="20"/><circle cx="-68" cy="-165" r="32" fill="#fff8e6"/><circle cy="-190" r="36" fill="#fff8e6"/><circle cx="70" cy="-165" r="32" fill="#fff8e6"/>`;
    return `<rect x="-145" y="-145" width="290" height="145" rx="18" fill="${p.wall}" stroke="${wood}" stroke-width="10"/><path d="M-108,-112 H108" stroke="${p.accent2}" stroke-width="13"/>`;
  }
  if (["flag", "clothing", "ribbon"].includes(type)) return `<path d="M0,0 V-230" stroke="${wood}" stroke-width="11"/><path d="M7,-222 Q100,-250 190,-205 L180,-107 Q95,-78 7,-112Z" fill="${p.accent2}"/><path d="M12,-165 Q95,-194 184,-157" stroke="${p.accent1}" stroke-width="18"/>`;
  if (["stone", "statue", "column", "monument"].includes(type)) return `<path d="M-145,0 L-115,-195 H115 L145,0Z" fill="${p.stone}"/><path d="M-150,-195 H150 V-222 H-150Z M-165,-222 H165 V-245 H-165Z" fill="${p.stoneShade}"/>${type === "column" ? `<path d="M-105,-175 V-28 M-50,-175 V-28 M5,-175 V-28 M60,-175 V-28" stroke="#fff" stroke-width="12" opacity=".42"/>` : ""}`;
  if (type === "cannon") return `<path d="M-145,-105 L110,-148 L126,-75 L-130,-24Z" fill="${ink}"/><circle cx="-80" cy="-6" r="49" fill="${wood}"/><circle cx="55" cy="-6" r="49" fill="${wood}"/>`;
  if (type === "horse") return `<ellipse cx="-5" cy="-88" rx="100" ry="53" fill="${wood}"/><path d="M52,-110 Q92,-220 140,-185 L126,-114 M-74,-52 V0 M60,-50 V0 M-94,-120 Q-170,-195 -130,-214" fill="none" stroke="${wood}" stroke-width="24"/><circle cx="132" cy="-180" r="5" fill="${ink}"/>`;
  if (type === "map" || type === "scroll") return `<path d="M-145,-180 L-50,-210 L45,-178 L145,-208 V-12 L45,18 L-50,-15 L-145,12Z" fill="${p.warm}" stroke="${wood}" stroke-width="10"/><path d="M-48,-198 V-4 M48,-190 V2 M-120,-135 H-78 M65,-135 H112" stroke="${p.roof}" stroke-width="9"/>`;
  if (type === "ticket") return `<path d="M-145,-180 H145 V-15 H-145 Q-112,-95 -145,-180Z" fill="${p.warm}" stroke="${wood}" stroke-width="9"/><path d="M0,-170 V-25" stroke="${wood}" stroke-width="8" stroke-dasharray="12 10"/>`;
  if (type === "mask") return `<path d="M-130,-210 Q0,-250 130,-210 L112,-62 Q0,8 -112,-62Z" fill="${p.accent2}"/><ellipse cx="-48" cy="-145" rx="25" ry="13" fill="${ink}"/><ellipse cx="48" cy="-145" rx="25" ry="13" fill="${ink}"/><path d="M-26,-92 Q0,-72 26,-92" fill="none" stroke="${ink}" stroke-width="10"/>`;
  if (type === "flag") return `<path d="M0,0 V-220" stroke="${wood}" stroke-width="10"/><path d="M6,-215 Q95,-244 178,-205 L170,-112 Q82,-80 6,-114Z" fill="${p.accent3}"/><path d="M8,-164 Q90,-185 174,-155" stroke="${p.accent2}" stroke-width="20"/>`;
  if (type === "lantern") return `<path d="M0,-228 V-196" stroke="${ink}" stroke-width="8"/><path d="M-68,-195 Q0,-225 68,-195 L52,-42 Q0,-12 -52,-42Z" fill="${p.accent1}" stroke="${p.wood}" stroke-width="8"/><path d="M-47,-75 H47" stroke="#fff" stroke-width="9" opacity=".6"/>`;
  if (type === "note") return `<ellipse cx="-38" cy="-25" rx="36" ry="24" fill="${p.accent2}" transform="rotate(-20 -38 -25)"/><path d="M-8,-30 V-230 Q85,-210 92,-138" fill="none" stroke="${p.accent2}" stroke-width="15"/>`;
  if (type === "turtle") return `<ellipse cy="-56" rx="114" ry="70" fill="${p.leafDark}"/><circle cx="125" cy="-62" r="39" fill="${p.leaf}"/><path d="M-70,-15 L-96,18 M70,-15 L96,18 M-40,-115 L-62,-145 M40,-115 L62,-145" stroke="${p.leaf}" stroke-width="27" stroke-linecap="round"/><circle cx="139" cy="-70" r="5" fill="${ink}"/>`;
  if (type === "flower") return `<path d="M0,0 V-105" stroke="${p.leafDark}" stroke-width="8"/><circle cy="-128" r="22" fill="${p.accent2}"/><circle cx="-27" cy="-128" r="18" fill="${p.accent1}"/><circle cx="27" cy="-128" r="18" fill="${p.accent3}"/><circle cy="-155" r="18" fill="#fff8e6"/>`;
  if (type === "antenna") return `<path d="M0,0 L0,-240 M-82,0 L0,-240 L82,0 M-62,-78 H62 M-40,-145 H40" fill="none" stroke="${ink}" stroke-width="12"/><path d="M0,-245 Q-80,-185 0,-125 Q80,-185 0,-245" fill="none" stroke="${p.accent2}" stroke-width="10"/>`;
  if (type === "solar") return `<path d="M-155,-40 L-112,-175 H130 L165,-40Z" fill="${p.accent3}" stroke="${ink}" stroke-width="10"/><path d="M-80,-170 L-88,-42 M0,-170 V-42 M78,-170 L92,-42 M-142,-105 H145" stroke="#fff" stroke-width="7" opacity=".7"/><path d="M0,-40 V0 M-70,0 H70" stroke="${ink}" stroke-width="12"/>`;
  if (type === "flag") return `<path d="M0,0 V-220" stroke="${wood}" stroke-width="10"/><path d="M6,-215 Q95,-244 178,-205 L170,-112 Q82,-80 6,-114Z" fill="${p.accent3}"/><path d="M8,-164 Q90,-185 174,-155" stroke="${p.accent2}" stroke-width="20"/>`;
  if (type === "compass") return `<circle cy="-112" r="112" fill="${p.wall}" stroke="${wood}" stroke-width="12"/><path d="M0,-192 L27,-105 L0,-35 L-27,-105Z" fill="${p.accent2}"/><path d="M0,-28 V-196 M-87,-112 H87" stroke="${p.stoneShade}" stroke-width="6"/>`;
  if (type === "island") return `<path d="M-195,-28 Q-125,-86 -40,-42 Q20,-138 95,-48 Q160,-95 200,-25Z" fill="${p.leaf}"/><path d="M-210,0 H210" stroke="${p.water}" stroke-width="18"/>`;
  if (type === "forest") return [pine(-85,0,1.25,p),pine(0,0,1.6,p),pine(95,0,1.2,p)].join("");
  if (type === "fence" || type === "gate") return `<path d="M-175,0 V-150 M-85,0 V-150 M0,0 V-150 M85,0 V-150 M175,0 V-150 M-195,-110 H195 M-195,-45 H195" stroke="${wood}" stroke-width="16"/>`;
  if (type === "wheat") return Array.from({length:7},(_,i)=>`<path d="M${-100+i*34},0 Q${-95+i*34},-80 ${-100+i*34},-190 M${-100+i*34},-140 q-30,-25 -25,-50 q30,5 25,50 M${-100+i*34},-115 q28,-27 30,-50 q-30,4 -30,50" stroke="${p.accent1}" stroke-width="8" fill="none"/>`).join("");
  if (type === "garden") return `<path d="M-190,-18 Q0,-72 190,-18 V0 H-190Z" fill="${p.wood}"/><path d="M-150,-20 V-115 M-55,-32 V-130 M45,-32 V-120 M140,-25 V-118" stroke="${p.leafDark}" stroke-width="10"/><path d="M-150,-86 q-45,-34 -55,-5 q30,3 55,25 M-55,-100 q-42,-32 -54,-4 q26,2 54,24 M45,-90 q42,-32 53,-4 q-25,2 -53,24 M140,-88 q-38,-30 -50,-4 q22,1 50,24" fill="${p.leaf}"/>${flowers(r, 4, p, -140, -110)}`;
  if (type === "fence") return `<path d="M-175,0 V-150 M-85,0 V-150 M0,0 V-150 M85,0 V-150 M175,0 V-150 M-195,-110 H195 M-195,-45 H195" stroke="${wood}" stroke-width="16"/>`;
  if (type === "well") return `<ellipse cy="-28" rx="110" ry="38" fill="${p.stone}"/><path d="M-95,-25 V0 H95 V-25 M-75,-65 V-180 M75,-65 V-180 M-75,-180 H75" fill="none" stroke="${wood}" stroke-width="14"/><path d="M-50,-25 V0 H50 V-25Z" fill="${p.water}"/>`;
  if (type === "goat" || type === "chicken" || type === "horse" || type === "duck" || type === "dove") return `<ellipse cx="-5" cy="-62" rx="86" ry="50" fill="${type === "chicken" || type === "dove" ? p.wall : p.woodLight}"/><circle cx="70" cy="-100" r="32" fill="${p.wall}"/><path d="M-55,-25 V0 M45,-25 V0 M86,-112 l38,10 -38,10Z" stroke="${wood}" stroke-width="10" fill="${p.accent1}"/><circle cx="78" cy="-108" r="5" fill="${ink}"/>`;
  if (type === "kite") return `<path d="M0,-240 L112,-120 L0,0 L-112,-120Z" fill="${p.accent2}"/><path d="M0,-240 V0 M-112,-120 H112" stroke="#fff" stroke-width="8"/><path d="M0,0 Q45,65 5,112 Q-40,160 14,206" fill="none" stroke="${p.accent3}" stroke-width="8" stroke-dasharray="18 12"/>`;
  if (type === "bike") return `<circle cx="-100" cy="-42" r="70" fill="none" stroke="${ink}" stroke-width="11"/><circle cx="100" cy="-42" r="70" fill="none" stroke="${ink}" stroke-width="11"/><path d="M-100,-42 L-28,-155 L43,-42 H-100 L-28,-155 L100,-42 M-42,-160 H-5" fill="none" stroke="${p.accent2}" stroke-width="12"/>`;
  if (type === "ball") return `<circle cy="-80" r="86" fill="${p.accent2}"/><path d="M-82,-104 Q0,-30 82,-104 M-50,-152 Q0,-85 50,-8 M0,-164 V4" fill="none" stroke="#fff" stroke-width="10"/>`;
  if (type === "blanket" || type === "picnic") return `<path d="M-190,-45 L170,-45 L210,0 H-220Z" fill="${p.accent2}"/><path d="M-120,-45 L-95,0 M-45,-45 L-20,0 M30,-45 L55,0 M105,-45 L130,0" stroke="#fff" stroke-width="14"/><ellipse cx="-65" cy="-70" rx="40" ry="18" fill="${p.woodLight}"/><circle cx="55" cy="-75" r="26" fill="${p.accent1}"/><circle cx="112" cy="-72" r="23" fill="${p.leaf}"/>`;
  if (type === "olive") return `<path d="M0,0 Q-20,-100 0,-210" stroke="${wood}" stroke-width="22"/><ellipse cx="-70" cy="-220" rx="100" ry="48" fill="${p.leafDark}"/><ellipse cx="50" cy="-226" rx="110" ry="55" fill="${p.leaf}"/>${[-60,15,70].map(x=>`<circle cx="${x}" cy="-215" r="8" fill="${p.accent3}"/>`).join("")}`;
  if (type === "sage") return `<path d="M-68,0 Q-82,-125 -50,-174 H50 Q82,-125 68,0Z" fill="${p.wall}"/><circle cy="-205" r="39" fill="#8a5a3c"/><path d="M-43,-210 Q0,-265 45,-205 Q10,-218 -43,-210Z" fill="#e8e0d0"/><path d="M-30,-168 Q0,-142 30,-168" fill="none" stroke="#e8e0d0" stroke-width="15"/><path d="M-120,-90 L0,-75 L120,-90" stroke="${p.woodLight}" stroke-width="18"/>`;
  if (type === "tree" || type === "palm" || type === "olive" || type === "forest") return tree(0,0,1.4,p);
  if (type === "flower") return flowers(r,1,p,-150,-130);
  if (type === "waterfall") return `<path d="M-130,-230 H130 L100,-110 Q40,-70 105,0 H-105 Q-45,-70 -100,-110Z" fill="${p.waterDeep}"/><path d="M-42,-205 Q-62,-100 -24,-28 M30,-200 Q5,-98 47,-38" stroke="#fff" stroke-width="16" fill="none"/><ellipse cy="-8" rx="148" ry="23" fill="${p.water}"/>`;
  if (type === "ocean" || type === "beach") return `<path d="M-215,-65 Q-150,-118 -82,-65 T50,-65 T184,-65 T250,-65 V0 H-250Z" fill="${type === "beach" ? p.warm : p.water}"/><path d="M-200,-55 Q-150,-92 -90,-55 T30,-55 T150,-55" stroke="#fff" stroke-width="12" fill="none"/>`;
  throw new Error(`No scene artwork registered for motif: ${type}`);
}

const LAYOUTS = [
  [[190, 560, 1.05], [470, 640, 0.82], [750, 610, 1.18], [1010, 565, 0.96]],
  [[220, 635, 0.84], [505, 535, 1.15], [785, 645, 0.9], [1030, 545, 1.12]],
  [[170, 620, 0.82], [470, 570, 1.12], [735, 645, 0.85], [1015, 580, 1.22]],
  [[210, 545, 1.18], [500, 640, 0.86], [800, 555, 1.12], [1050, 645, 0.82]],
  [[185, 645, 0.88], [445, 560, 1.2], [760, 570, 1.03], [1030, 625, 0.94]],
  [[220, 570, 1.0], [485, 540, 1.16], [740, 645, 0.9], [1000, 565, 1.08]],
];

export function renderSceneVariation(plan, p, r, variantIndex) {
  const layout = LAYOUTS[variantIndex % LAYOUTS.length];
  let scene = backdrop(plan.setting, p, r);
  if (plan.setting === "forest" || plan.setting === "grove" || plan.setting === "garden" || plan.setting === "park") {
    scene += tree(80, 730, 1.15, p, 1.3, 0.5) + pine(1110, 735, 1, p);
  }
  if (plan.setting === "market" || plan.setting === "square" || plan.setting === "festival" || plan.setting === "parade") {
    scene += `<path d="M0,695 Q600,620 1200,695 V800 H0Z" fill="${p.stone}" opacity=".65"/>`;
  }
  if (plan.setting === "beach" || plan.setting === "coast" || plan.setting === "harbor" || plan.setting === "island") {
    scene += `<path d="M0,700 Q260,645 510,706 T1030,680 T1200,690 V800 H0Z" fill="${p.warm}" opacity=".45"/>`;
  }
  plan.objects.forEach((object, index) => {
    const [x, y, scale] = layout[index];
    scene += `<g transform="translate(${x},${y}) scale(${scale})"><ellipse cx="0" cy="9" rx="132" ry="20" fill="#171914" opacity=".2" filter="url(#fSoft)"/><g filter="url(#fObject)">${shape(object, p, r)}</g></g>`;
  });
  scene += flowers(r, 28, p, 735, 795);
  scene += bird(0, 220 + (variantIndex % 3) * 28, 0.9, 65, variantIndex, p);
  return scene;
}
