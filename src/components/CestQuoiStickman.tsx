"use client";

// Boneco de boina do jogo "C'est quoi ?" (mesmo visual das imagens da pasta c-quoi).
// Estados: "think" (pensando, mão na cabeça), "dance" (acertou: pula e abre os braços),
// "sad" (errou/tempo esgotado: balança a cabeça e suspira).
export type StickmanMood = "think" | "dance" | "sad";

const OX = 245;

export function CestQuoiStickman({ mood }: { mood: StickmanMood }) {
  const happy = mood === "dance";
  const sad = mood === "sad";
  const arm = { fill: "none", stroke: "#111", strokeWidth: 4.5, strokeLinecap: "round" as const };

  return (
    <svg viewBox="0 0 490 490" className="h-full w-full" role="img" aria-label={`Boneco ${happy ? "feliz" : sad ? "triste" : "pensando"}`}>
      <g className={happy ? "cq-bounce" : ""}>
        {/* corpo e pernas */}
        <line x1={OX} y1="262" x2={OX} y2="392" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
        <path d={`M${OX} 392 L${OX - 22} 458 M${OX} 392 L${OX + 22} 458`} stroke="#111" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <ellipse cx={OX - 30} cy="466" rx="26" ry="9" fill="#111" />
        <ellipse cx={OX + 30} cy="466" rx="26" ry="9" fill="#111" />

        {/* braços */}
        {happy ? (
          <>
            <g className="cq-arm-l-dance" style={{ transformOrigin: `${OX}px 292px` }}>
              <path d={`M${OX} 292 Q${OX - 50} 280 ${OX - 86} 236`} {...arm} />
              <circle cx={OX - 88} cy="232" r="7" fill="#fff" stroke="#111" strokeWidth="3" />
            </g>
            <g className="cq-arm-r-dance" style={{ transformOrigin: `${OX}px 292px` }}>
              <path d={`M${OX} 292 Q${OX + 50} 280 ${OX + 86} 236`} {...arm} />
              <circle cx={OX + 88} cy="232" r="7" fill="#fff" stroke="#111" strokeWidth="3" />
            </g>
          </>
        ) : sad ? (
          <>
            <path d={`M${OX} 292 Q${OX - 26} 330 ${OX - 36} 372`} {...arm} />
            <path d={`M${OX} 292 Q${OX + 26} 330 ${OX + 36} 372`} {...arm} />
          </>
        ) : (
          <>
            {/* mão na cabeça + mão aberta (como na imagem original) */}
            <path d={`M${OX} 292 Q${OX - 56} 272 ${OX - 56} 214`} {...arm} />
            <circle cx={OX - 54} cy="206" r="8" fill="#fff" stroke="#111" strokeWidth="3" />
            <path d={`M${OX} 292 Q${OX + 40} 298 ${OX + 70} 316`} {...arm} />
            <path d={`M${OX + 70} 316 l14 -10 M${OX + 70} 316 l16 2 M${OX + 70} 316 l10 12`} {...arm} strokeWidth={3.5} />
          </>
        )}

        {/* cabeça (balança quando erra, oscila quando pensa) */}
        <g
          className={sad ? "cq-head-shake" : mood === "think" ? "cq-think" : ""}
          style={{ transformOrigin: `${OX}px 262px` }}
        >
          <circle cx={OX} cy="210" r="52" fill="#fff" stroke="#111" strokeWidth="4" />
          {happy ? (
            <>
              <path d={`M${OX - 22} 206 Q${OX - 15} 195 ${OX - 8} 206`} fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
              <path d={`M${OX + 8} 206 Q${OX + 15} 195 ${OX + 22} 206`} fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
              <path d={`M${OX - 20} 222 Q${OX} 248 ${OX + 20} 222Z`} fill="#fff" stroke="#111" strokeWidth="3.5" strokeLinejoin="round" />
            </>
          ) : sad ? (
            <>
              <circle cx={OX - 16} cy="208" r="4.5" fill="#111" />
              <circle cx={OX + 16} cy="208" r="4.5" fill="#111" />
              <path d={`M${OX - 26} 193 L${OX - 8} 198 M${OX + 26} 193 L${OX + 8} 198`} stroke="#111" strokeWidth="3" strokeLinecap="round" />
              <path d={`M${OX - 14} 236 Q${OX} 224 ${OX + 14} 236`} fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
              <path className="cq-sweat" d={`M${OX + 40} 170 q6 10 0 16 q-6 -6 0 -16z`} fill="#6fb7ea" />
            </>
          ) : (
            <>
              <circle cx={OX - 16} cy="206" r="4.5" fill="#111" />
              <circle cx={OX + 16} cy="206" r="4.5" fill="#111" />
              <path d={`M${OX - 24} 196 L${OX - 8} 199 M${OX + 24} 196 L${OX + 8} 199`} stroke="#111" strokeWidth="3" strokeLinecap="round" />
              <path d={`M${OX - 12} 230 Q${OX} 223 ${OX + 12} 230`} fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          {/* lenço vermelho */}
          <path d={`M${OX - 40} 256 L${OX} 272 L${OX + 40} 256 L${OX + 30} 280 L${OX} 288 L${OX - 30} 280Z`} fill="#d62828" />
          {/* boina azul com pompom tricolor */}
          <path d={`M${OX - 56} 186 Q${OX - 50} 142 ${OX - 4} 138 Q${OX + 52} 136 ${OX + 56} 180 Q${OX + 20} 168 ${OX - 56} 186Z`} fill="#1e3a9a" />
          <circle cx={OX - 26} cy="146" r="8" fill="#d62828" />
          <circle cx={OX - 32} cy="150" r="5" fill="#fff" />
          <circle cx={OX - 22} cy="142" r="4" fill="#1e3a9a" />
        </g>

        {mood === "think" && (
          <text className="cq-qmark" x={OX + 62} y="168" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="46" fill="#222" style={{ transformOrigin: `${OX + 78}px 150px` }}>
            ?
          </text>
        )}
        {happy && (
          <>
            <text className="cq-qmark" x={OX - 120} y="190" fontSize="30">✨</text>
            <text className="cq-qmark" x={OX + 92} y="170" fontSize="26">⭐</text>
          </>
        )}
      </g>
    </svg>
  );
}
