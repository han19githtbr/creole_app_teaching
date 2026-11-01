"use client";

// Personagem do jogo "C'est quoi ?" — um aluno francês de boina, marinière, cachecol e tênis.
// Desenhado em SVG com sombreamento (gradientes, luz e sombra) para parecer um boneco 3D de verdade.
// Mantém a mesma API e o mesmo sistema de coordenadas do antigo "stickman", então vale em todas as telas.
// Estados: "think" (pensando, mão no queixo), "dance" (acertou: pula com os braços para cima),
// "sad" (errou/tempo esgotado: balança a cabeça, ombros caídos e uma gota de suor).
export type StickmanMood = "think" | "dance" | "sad";

const OX = 245;

// Paleta (troque aqui para mudar o personagem inteiro)
const SKIN_LIGHT = "#f6cfae";
const SKIN_MID = "#e3a77c";
const SKIN_DARK = "#bf7d52";
const NAVY = "#1f3a8a";
const NAVY_DARK = "#14245e";
const RED = "#d62828";
const HAIR = "#3a2416";

type Pt = [number, number];

/** Braço com manga listrada (marinière) + mão. `pts` = ombro, cotovelo, mão. */
function Arm({ pts, hand = true, cls, origin }: { pts: [Pt, Pt, Pt]; hand?: boolean; cls?: string; origin?: string }) {
  const [s, e, h] = pts;
  const d = `M${s[0]} ${s[1]} Q${e[0]} ${e[1]} ${h[0]} ${h[1]}`;
  return (
    <g className={cls} style={origin ? { transformOrigin: origin } : undefined}>
      <path d={d} fill="none" stroke="#000" strokeOpacity=".18" strokeWidth="21" strokeLinecap="round" transform="translate(2 3)" />
      <path d={d} fill="none" stroke="#f8fafc" strokeWidth="19" strokeLinecap="round" />
      <path d={d} fill="none" stroke={NAVY} strokeWidth="19" strokeDasharray="5 8" />
      <path d={d} fill="none" stroke="url(#cqc-sleeve-shade)" strokeWidth="19" strokeLinecap="round" opacity=".5" />
      {hand && (
        <g>
          <circle cx={h[0]} cy={h[1]} r="11.5" fill="url(#cqc-skin)" stroke={SKIN_DARK} strokeWidth="1.2" />
          <path d={`M${h[0] - 5} ${h[1] + 2} q5 5 10 0`} fill="none" stroke={SKIN_DARK} strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        </g>
      )}
    </g>
  );
}

export function CestQuoiStickman({ mood, compact = false }: { mood: StickmanMood; compact?: boolean }) {
  const happy = mood === "dance";
  const sad = mood === "sad";
  const think = mood === "think";

  return (
    <svg viewBox={compact ? "95 118 300 372" : "0 0 490 490"} className="h-full w-full overflow-visible" role="img" aria-label={`Boneco ${happy ? "feliz" : sad ? "triste" : "pensando"}`}>
      <defs>
        <radialGradient id="cqc-skin" cx="0.38" cy="0.32" r="0.85">
          <stop offset="0" stopColor={SKIN_LIGHT} />
          <stop offset="0.6" stopColor={SKIN_MID} />
          <stop offset="1" stopColor={SKIN_DARK} />
        </radialGradient>
        <radialGradient id="cqc-beret" cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#3b5bd6" />
          <stop offset="0.55" stopColor={NAVY} />
          <stop offset="1" stopColor={NAVY_DARK} />
        </radialGradient>
        <linearGradient id="cqc-scarf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="1" stopColor="#a31515" />
        </linearGradient>
        <linearGradient id="cqc-jeans" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#274b8f" />
          <stop offset="0.5" stopColor="#1f3d78" />
          <stop offset="1" stopColor="#152b57" />
        </linearGradient>
        <linearGradient id="cqc-sleeve-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#0b1b44" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="cqc-torso-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b1b44" stopOpacity="0.35" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#0b1b44" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="cqc-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.38" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id="cqc-torso-clip">
          <path d={`M${OX - 40} 290 Q${OX - 44} 270 ${OX - 26} 266 L${OX + 26} 266 Q${OX + 44} 270 ${OX + 40} 290 L${OX + 35} 378 Q${OX} 390 ${OX - 35} 378Z`} />
        </clipPath>
      </defs>

      {/* sombra no chão */}
      <ellipse cx={OX} cy="470" rx={happy ? 44 : 70} ry={happy ? 8 : 12} fill="url(#cqc-shadow)" style={{ transition: "all .2s" }} />

      <g className={happy ? "cq-bounce" : ""}>
        {/* ---------------- PERNAS (jeans) ---------------- */}
        <path d={`M${OX - 35} 370 L${OX - 1} 370 L${OX - 5} 456 L${OX - 31} 456Z`} fill="url(#cqc-jeans)" />
        <path d={`M${OX + 1} 370 L${OX + 35} 370 L${OX + 31} 456 L${OX + 5} 456Z`} fill="url(#cqc-jeans)" />
        <path d={`M${OX} 372 L${OX} 440`} stroke="#0d1e42" strokeWidth="1.5" opacity=".5" />
        <path d={`M${OX - 31} 440 L${OX - 5} 440 M${OX + 5} 440 L${OX + 31} 440`} stroke="#8fb0e6" strokeWidth="1.4" strokeDasharray="3 3" opacity=".55" />
        {/* tênis */}
        <g>
          <path d={`M${OX - 36} 452 Q${OX - 36} 446 ${OX - 22} 447 L${OX - 6} 449 Q${OX + 2} 454 ${OX} 464 Q${OX - 18} 468 ${OX - 40} 466 Q${OX - 44} 458 ${OX - 36} 452Z`} fill="#fff" stroke="#c9ced8" strokeWidth="1.5" />
          <path d={`M${OX - 41} 464 Q${OX - 18} 471 ${OX + 1} 464 L${OX + 1} 469 Q${OX - 20} 475 ${OX - 42} 469Z`} fill={RED} />
          <path d={`M${OX - 22} 448 q4 6 8 1 M${OX - 14} 450 q4 6 7 1`} stroke="#9aa3b5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d={`M${OX + 36} 452 Q${OX + 36} 446 ${OX + 22} 447 L${OX + 6} 449 Q${OX - 2} 454 ${OX} 464 Q${OX + 18} 468 ${OX + 40} 466 Q${OX + 44} 458 ${OX + 36} 452Z`} fill="#fff" stroke="#c9ced8" strokeWidth="1.5" />
          <path d={`M${OX + 41} 464 Q${OX + 18} 471 ${OX - 1} 464 L${OX - 1} 469 Q${OX + 20} 475 ${OX + 42} 469Z`} fill={RED} />
          <path d={`M${OX + 22} 448 q-4 6 -8 1 M${OX + 14} 450 q-4 6 -7 1`} stroke="#9aa3b5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>

        {/* ---------------- BRAÇOS DE TRÁS ---------------- */}
        {happy ? (
          <Arm pts={[[OX - 36, 284], [OX - 72, 274], [OX - 90, 226]]} cls="cq-arm-l-dance" origin={`${OX - 36}px 284px`} />
        ) : sad ? (
          <Arm pts={[[OX - 36, 284], [OX - 52, 330], [OX - 50, 368]]} />
        ) : (
          <Arm pts={[[OX - 36, 284], [OX - 62, 330], [OX - 40, 372]]} />
        )}

        {/* ---------------- TRONCO: marinière listrada ---------------- */}
        <g>
          <path d={`M${OX - 40} 290 Q${OX - 44} 270 ${OX - 26} 266 L${OX + 26} 266 Q${OX + 44} 270 ${OX + 40} 290 L${OX + 35} 378 Q${OX} 390 ${OX - 35} 378Z`} fill="#f8fafc" />
          <g clipPath="url(#cqc-torso-clip)">
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x={OX - 50} y={270 + i * 12 + 5} width="100" height="6" fill={NAVY} />
            ))}
            <rect x={OX - 50} y="262" width="100" height="130" fill="url(#cqc-torso-shade)" />
          </g>
          <path d={`M${OX - 40} 290 Q${OX - 44} 270 ${OX - 26} 266 L${OX + 26} 266 Q${OX + 44} 270 ${OX + 40} 290 L${OX + 35} 378 Q${OX} 390 ${OX - 35} 378Z`} fill="none" stroke={NAVY_DARK} strokeOpacity=".5" strokeWidth="1.5" />
          {/* cinto */}
          <rect x={OX - 35} y="370" width="70" height="8" rx="3" fill="#3a2416" />
          <rect x={OX - 6} y="371" width="12" height="6" rx="1.5" fill="#d9b25a" />
        </g>

        {/* ---------------- BRAÇO DA FRENTE ---------------- */}
        {happy ? (
          <Arm pts={[[OX + 36, 284], [OX + 72, 274], [OX + 90, 226]]} cls="cq-arm-r-dance" origin={`${OX + 36}px 284px`} />
        ) : sad ? (
          <Arm pts={[[OX + 36, 284], [OX + 52, 330], [OX + 50, 368]]} />
        ) : (
          // pensando: mão no queixo
          <Arm pts={[[OX + 36, 286], [OX + 74, 296], [OX + 18, 252]]} />
        )}

        {/* ---------------- PESCOÇO + CACHECOL ---------------- */}
        <rect x={OX - 13} y="250" width="26" height="24" rx="8" fill="url(#cqc-skin)" />
        <path d={`M${OX - 13} 254 Q${OX} 268 ${OX + 13} 254 L${OX + 13} 262 Q${OX} 276 ${OX - 13} 262Z`} fill="#000" opacity=".16" />
        <g>
          <path d={`M${OX - 34} 262 Q${OX} 286 ${OX + 34} 262 L${OX + 30} 280 Q${OX} 298 ${OX - 30} 280Z`} fill="url(#cqc-scarf)" />
          <path d={`M${OX - 28} 270 q6 8 10 14 M${OX - 6} 276 q5 6 8 12 M${OX + 14} 273 q5 7 8 12`} stroke="#7f1010" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".6" />
          {/* ponta do cachecol */}
          <path d={`M${OX + 12} 282 Q${OX + 30} 292 ${OX + 28} 322 L${OX + 14} 326 Q${OX + 16} 304 ${OX + 4} 290Z`} fill="url(#cqc-scarf)" />
          <path d={`M${OX + 14} 322 l14 -3 M${OX + 14} 326 l14 -3`} stroke="#fecaca" strokeWidth="1.5" opacity=".7" />
        </g>

        {/* ---------------- CABEÇA ---------------- */}
        <g className={sad ? "cq-head-shake" : think ? "cq-think" : ""} style={{ transformOrigin: `${OX}px 262px` }}>
          {/* cabelo atrás/laterais */}
          <path d={`M${OX - 50} 206 Q${OX - 56} 232 ${OX - 44} 246 Q${OX - 40} 226 ${OX - 36} 212Z`} fill={HAIR} />
          <path d={`M${OX + 50} 206 Q${OX + 56} 232 ${OX + 44} 246 Q${OX + 40} 226 ${OX + 36} 212Z`} fill={HAIR} />
          {/* orelhas */}
          <ellipse cx={OX - 47} cy="216" rx="7" ry="10" fill="url(#cqc-skin)" stroke={SKIN_DARK} strokeWidth="1" />
          <ellipse cx={OX + 47} cy="216" rx="7" ry="10" fill="url(#cqc-skin)" stroke={SKIN_DARK} strokeWidth="1" />
          <path d={`M${OX - 48} 212 q3 4 0 8 M${OX + 48} 212 q-3 4 0 8`} stroke={SKIN_DARK} strokeWidth="1.2" fill="none" opacity=".7" />
          {/* rosto */}
          <path d={`M${OX - 46} 196 Q${OX - 48} 250 ${OX} 258 Q${OX + 48} 250 ${OX + 46} 196 Q${OX + 40} 150 ${OX} 150 Q${OX - 40} 150 ${OX - 46} 196Z`} fill="url(#cqc-skin)" stroke={SKIN_DARK} strokeOpacity=".55" strokeWidth="1.4" />
          {/* franja sob a boina */}
          <path d={`M${OX - 44} 186 Q${OX - 30} 164 ${OX - 8} 172 Q${OX + 14} 160 ${OX + 44} 186 Q${OX + 30} 174 ${OX + 8} 180 Q${OX - 14} 170 ${OX - 44} 186Z`} fill={HAIR} />
          {/* bochechas */}
          <ellipse cx={OX - 30} cy="228" rx="9" ry="5.5" fill="#ff8a8a" opacity={happy ? 0.5 : 0.28} />
          <ellipse cx={OX + 30} cy="228" rx="9" ry="5.5" fill="#ff8a8a" opacity={happy ? 0.5 : 0.28} />

          {/* sobrancelhas */}
          {happy ? (
            <>
              <path d={`M${OX - 30} 192 Q${OX - 20} 184 ${OX - 10} 190`} stroke={HAIR} strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d={`M${OX + 10} 190 Q${OX + 20} 184 ${OX + 30} 192`} stroke={HAIR} strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : sad ? (
            <>
              <path d={`M${OX - 32} 196 L${OX - 10} 188`} stroke={HAIR} strokeWidth="4" strokeLinecap="round" />
              <path d={`M${OX + 32} 196 L${OX + 10} 188`} stroke={HAIR} strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d={`M${OX - 31} 190 Q${OX - 20} 183 ${OX - 9} 188`} stroke={HAIR} strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d={`M${OX + 9} 184 Q${OX + 20} 174 ${OX + 31} 184`} stroke={HAIR} strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* olhos */}
          {happy ? (
            <>
              <path d={`M${OX - 28} 208 Q${OX - 19} 195 ${OX - 10} 208`} stroke="#2b1a10" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d={`M${OX + 10} 208 Q${OX + 19} 195 ${OX + 28} 208`} stroke="#2b1a10" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            [-19, 19].map((dx) => {
              const look = think ? { x: 2.5, y: -3 } : sad ? { x: 0, y: 3 } : { x: 0, y: 0 };
              return (
                <g key={dx}>
                  <ellipse cx={OX + dx} cy={sad ? 207 : 205} rx="9.5" ry={sad ? 8 : 10.5} fill="#fff" stroke="#2b1a10" strokeOpacity=".35" strokeWidth="1" />
                  <circle cx={OX + dx + look.x} cy={(sad ? 209 : 205) + look.y} r="6" fill="#5b3a1e" />
                  <circle cx={OX + dx + look.x} cy={(sad ? 209 : 205) + look.y} r="3.2" fill="#140a04" />
                  <circle cx={OX + dx + look.x - 2} cy={(sad ? 209 : 205) + look.y - 2.4} r="1.7" fill="#fff" />
                  {sad && <path d={`M${OX + dx - 10} 201 Q${OX + dx} 197 ${OX + dx + 10} 201`} stroke={SKIN_DARK} strokeWidth="2.2" fill="none" strokeLinecap="round" />}
                </g>
              );
            })
          )}

          {/* nariz */}
          <path d={`M${OX - 3} 214 Q${OX - 7} 226 ${OX - 2} 228 Q${OX + 3} 230 ${OX + 6} 227`} stroke={SKIN_DARK} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".8" />
          <ellipse cx={OX - 5} cy="213" rx="3" ry="5" fill="#fff" opacity=".18" />

          {/* boca */}
          {happy ? (
            <>
              <path d={`M${OX - 22} 232 Q${OX} 262 ${OX + 22} 232 Q${OX} 238 ${OX - 22} 232Z`} fill="#7a1f1f" stroke="#4a0f0f" strokeWidth="2" strokeLinejoin="round" />
              <path d={`M${OX - 19} 234 Q${OX} 240 ${OX + 19} 234 L${OX + 17} 240 Q${OX} 245 ${OX - 17} 240Z`} fill="#fff" />
              <path d={`M${OX - 10} 249 Q${OX} 244 ${OX + 10} 249 Q${OX} 256 ${OX - 10} 249Z`} fill="#e86a6a" />
            </>
          ) : sad ? (
            <path d={`M${OX - 13} 242 Q${OX} 232 ${OX + 13} 242`} stroke="#6b2a1a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          ) : (
            <path d={`M${OX - 11} 238 Q${OX - 2} 242 ${OX + 9} 236`} stroke="#6b2a1a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          )}
          {sad && <path className="cq-sweat" d={`M${OX + 40} 176 q8 12 0 20 q-8 -8 0 -20z`} fill="#7cc4f2" stroke="#3b8fcb" strokeWidth="1" />}

          {/* BOINA azul com pompom (tige) */}
          <g>
            <path d={`M${OX - 58} 188 Q${OX - 60} 142 ${OX - 6} 134 Q${OX + 54} 128 ${OX + 60} 176 Q${OX + 62} 188 ${OX + 50} 190 Q${OX + 6} 178 ${OX - 58} 188Z`} fill="url(#cqc-beret)" stroke={NAVY_DARK} strokeWidth="1.5" />
            <path d={`M${OX - 54} 186 Q${OX - 10} 174 ${OX + 54} 188`} stroke="#0d1a4a" strokeWidth="5" fill="none" opacity=".55" strokeLinecap="round" />
            <path d={`M${OX - 36} 160 Q${OX - 16} 142 ${OX + 10} 142`} stroke="#8fa8ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".45" />
            <rect x={OX - 5} y="124" width="9" height="14" rx="4" fill={NAVY_DARK} transform={`rotate(-8 ${OX} 132)`} />
          </g>
        </g>

        {/* ---------------- EFEITOS ---------------- */}
        {think && (
          <text className="cq-qmark" x={OX + 62} y="168" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="50" fill="#f59e0b" stroke="#7c4a03" strokeWidth="1.4" style={{ transformOrigin: `${OX + 78}px 150px` }}>
            ?
          </text>
        )}
        {happy && (
          <>
            <text className="cq-qmark" x={OX - 128} y="196" fontSize="30">✨</text>
            <text className="cq-qmark" x={OX + 96} y="176" fontSize="26">⭐</text>
          </>
        )}
      </g>
    </svg>
  );
}
