"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { TrailWeather } from "@/lib/curiousTrailData";

export interface CuriousTrailStudentProps {
  weather: TrailWeather;
  hasUmbrella?: boolean;
  hasSnowGear?: boolean;
  isWalking?: boolean;
  isCheering?: boolean;
  isRaisingFlag?: boolean;
  size?: number;
  className?: string;
  flagProgress?: number; // 0..100 para animação de subida da bandeira
  facing?: "left" | "right";
  incline?: number; // ângulo de inclinação do terreno em graus (-15 a 15)
}

/**
 * Personagem animado e ultra-realista do aluno explorador da Trilha Curiosa:
 * - Movimento anatômico detalhado com mochila técnica de montanha, botas com sola de trilha e bastão.
 * - Na chuva (Níveis 4 e 5): empunha guarda-chuva com tecido tensionado e gotas respingando na cúpula.
 * - Na neve (Níveis 6 e 7): REAÇÃO REALISTA AO FRIO — treme o corpo inteiro pelo vento gélido,
 *   solta baforadas visíveis de vapor quente da respiração que se dissipam no ar,
 *   cruza os braços para se aquecer, fica com nariz e bochechas corados de frio e olhos semicerrados contra a nevasca!
 * - Ao concluir e no cume (Nível 7): hasteia AO VIVO a bandeira tricolor puxando as adriças do mastro,
 *   e celebra com saltos radiantes de vitória quando a bandeira atinge o topo!
 */
export function CuriousTrailStudent({
  weather,
  hasUmbrella = false,
  hasSnowGear = false,
  isWalking = false,
  isCheering = false,
  isRaisingFlag = false,
  size = 84,
  className,
  flagProgress = 100,
  facing = "right",
  incline = 0,
}: CuriousTrailStudentProps) {
  const w = size;
  const h = size * 1.18;

  const isSnow = weather === "snow";
  const showUmbrella = hasUmbrella && weather === "rain";
  const showSnowGear = hasSnowGear && isSnow;
  const isFlagAtTop = flagProgress >= 95;

  // Inclinação orgânica ao subir a montanha (inclina tronco para a frente no sentido do passo)
  const forwardLean = isWalking ? (facing === "left" ? -4 - Math.abs(incline) * 0.4 : 4 + Math.abs(incline) * 0.4) : 0;
  const scaleX = facing === "left" ? -1 : 1;

  return (
    <div
      className={cn(
        "relative inline-block select-none pointer-events-none transition-transform duration-300",
        isSnow && !isRaisingFlag && !isCheering && "trail-cold-shiver",
        isCheering && isFlagAtTop && "trail-victory-jump",
        className
      )}
      style={{
        width: w,
        height: h,
        transform: `scaleX(${scaleX}) rotate(${forwardLean}deg)`,
        transformOrigin: "50% 90%",
      }}
      aria-label="Aluno curioso explorando a montanha"
    >
      <svg
        viewBox="0 0 130 150"
        className="w-full h-full filter drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Sombreado da jaqueta alpina */}
          <linearGradient id="studJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Anorak térmico de inverno nos níveis nevados */}
          <linearGradient id="studSnowAnorak" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>

          {/* Gorro de lã vermelho térmico */}
          <linearGradient id="studBeanieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Boina francesa azul-marinho clássica */}
          <linearGradient id="studBeretGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="65%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Guarda-chuva montanhês com gomos */}
          <linearGradient id="studUmbrellaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="35%" stopColor="#ef4444" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          {/* Mochila de expedição */}
          <linearGradient id="studPackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="70%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>

          {/* Pele com iluminação volumétrica */}
          <radialGradient id="studSkinGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="80%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>

          {/* Mastro dourado no cume */}
          <linearGradient id="studPoleGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* ---------------- 1. SOMBRA REALISTA NO SOLO ---------------- */}
        <ellipse
          cx="62"
          cy="142"
          rx={isSnow ? 26 : 22}
          ry={isSnow ? 6 : 5}
          fill="#000"
          opacity={isSnow ? 0.28 : 0.22}
        />

        {/* Pegadas afundadas na neve fofa quando caminha */}
        {isSnow && (
          <g opacity="0.65">
            <ellipse cx="50" cy="142" rx="7" ry="2.5" fill="#94a3b8" />
            <ellipse cx="74" cy="143" rx="6.5" ry="2.5" fill="#94a3b8" />
            <circle cx="43" cy="140" r="1.5" fill="#f8fafc" />
            <circle cx="81" cy="141" r="1.5" fill="#f8fafc" />
          </g>
        )}

        {/* Respingos de poça d'água na chuva */}
        {weather === "rain" && (
          <g opacity="0.75">
            <ellipse cx="62" cy="142" rx="14" ry="3.5" fill="#38bdf8" opacity="0.5" />
            <circle cx="48" cy="138" r="1.5" fill="#bae6fd" />
            <circle cx="76" cy="139" r="1.8" fill="#bae6fd" />
          </g>
        )}

        {/* ---------------- 2. MOCHILA TÉCNICA DE MONTANHA (Costas) ---------------- */}
        <g
          transform="translate(30, 64)"
          style={isWalking ? { animation: "trailBackpackSway 0.7s ease-in-out infinite", transformOrigin: "12px 10px" } : undefined}
        >
          {/* Corpo volumoso da mochila */}
          <rect
            x="0"
            y="0"
            width="18"
            height="32"
            rx="7"
            fill="url(#studPackGrad)"
            stroke="#7c2d12"
            strokeWidth="1.5"
          />
          {/* Bolso frontal com zíper e fita refletiva */}
          <rect x="-2" y="8" width="7" height="16" rx="3.5" fill="#ea580c" stroke="#9a3412" strokeWidth="1" />
          <line x1="1" y1="10" x2="1" y2="22" stroke="#fed7aa" strokeWidth="1.2" strokeDasharray="2 1" />
          {/* Saco de dormir/isolante térmico verde enrolado no topo */}
          <rect x="-1" y="-6" width="20" height="7" rx="3.5" fill="#059669" stroke="#047857" strokeWidth="1.2" />
          <line x1="5" y1="-6" x2="5" y2="1" stroke="#047857" strokeWidth="1.2" />
          <line x1="13" y1="-6" x2="13" y2="1" stroke="#047857" strokeWidth="1.2" />
          {/* Garrafa d'água na lateral da mochila */}
          <rect x="14" y="10" width="5" height="12" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
          <circle cx="16.5" cy="8.5" r="1.5" fill="#e0f2fe" />
          {/* Se chover e o guarda-chuva estiver aberto, mostra bastão guardado */}
          {!showUmbrella && !isRaisingFlag && (
            <line x1="-5" y1="2" x2="-7" y2="30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          )}
        </g>

        {/* ---------------- 3. PERNAS E BOTAS DE EXPEDIÇÃO COM GUETRAS (Passada Realista) ---------------- */}
        {/* Perna Traseira (Esquerda) */}
        <g style={isWalking ? { animation: "trailHikerLegSwing 0.7s ease-in-out infinite", transformOrigin: "52px 98px" } : undefined}>
          {/* Calça impermeável reforçada */}
          <line
            x1="54"
            y1="98"
            x2="50"
            y2="128"
            stroke={isSnow ? "#0f172a" : "#1e293b"}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Polaina / Guetra de neve nos tornozelos */}
          {isSnow && (
            <rect x="46" y="118" width="9" height="7" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          )}
          {/* Bota de montanha com sola tratorada */}
          <path
            d="M44 128 L57 128 L59 137 L40 137 Z"
            fill="#54280b"
            stroke="#2e1405"
            strokeWidth="1.5"
          />
          {/* Sola de borracha preta com travas */}
          <rect x="39" y="137" width="21" height="3" rx="1" fill="#18181b" />
          <line x1="43" y1="139" x2="43" y2="140" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
          <line x1="51" y1="139" x2="51" y2="140" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
        </g>

        {/* Perna Dianteira (Direita) */}
        <g style={isWalking ? { animation: "trailHikerLegSwingAlt 0.7s ease-in-out infinite", transformOrigin: "72px 98px" } : undefined}>
          <line
            x1="70"
            y1="98"
            x2="74"
            y2="128"
            stroke={isSnow ? "#0f172a" : "#1e293b"}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {isSnow && (
            <rect x="70" y="118" width="9" height="7" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          )}
          <path
            d="M68 128 L81 128 L83 137 L64 137 Z"
            fill="#54280b"
            stroke="#2e1405"
            strokeWidth="1.5"
          />
          <rect x="63" y="137" width="21" height="3" rx="1" fill="#18181b" />
          <line x1="67" y1="139" x2="67" y2="140" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
          <line x1="75" y1="139" x2="75" y2="140" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
        </g>

        {/* ---------------- 4. TRONCO / ANORAK TÉRMICO E ZÍPER ---------------- */}
        <g style={isWalking ? { animation: "trailHikerTorsoBob 0.35s ease-in-out infinite", transformOrigin: "62px 98px" } : undefined}>
          <rect
            x="45"
            y="62"
            width="34"
            height="40"
            rx="11"
            fill={isSnow ? "url(#studSnowAnorak)" : "url(#studJacketGrad)"}
            stroke={isSnow ? "#075985" : "#1e40af"}
            strokeWidth="2"
          />
          {/* Zíper frontal reforçado com puxador */}
          <line x1="62" y1="62" x2="62" y2="100" stroke="#fcd34d" strokeWidth="2.2" strokeDasharray="3.5 2" />
          <rect x="60.5" y="74" width="3" height="5" rx="1" fill="#fbbf24" />
          {/* Bolsos peitorais com zíper */}
          <line x1="49" y1="76" x2="57" y2="76" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="67" y1="76" x2="75" y2="76" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          {/* Fita refletiva de segurança nos ombros */}
          <line x1="48" y1="65" x2="55" y2="67" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <line x1="69" y1="67" x2="76" y2="65" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

          {/* Neve acumulada nos ombros na tempestade de gelo */}
          {isSnow && (
            <g opacity="0.9">
              <path d="M46 64 Q52 61 57 65" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <path d="M67 65 Q72 61 77 64" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* ---------------- 5. BRAÇO TRASEIRO E BASTÃO DE TRILHA (Caminhada Articulada) ---------------- */}
        {!isRaisingFlag && !isCheering && (
          <g style={isWalking ? { animation: "trailHikerPolePlant 0.7s ease-in-out infinite", transformOrigin: "42px 76px" } : undefined}>
            {/* Bastão telescópico de caminhada com anel de neve */}
            <line x1="39" y1="78" x2="35" y2="136" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="39" cy="78" r="3.5" fill="#1e293b" />
            <circle cx="35.5" cy="128" r="5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <circle cx="35" cy="135" r="1.8" fill="#1e293b" />
            {/* Braço segurando empunhadura */}
            <line x1="49" y1="68" x2="39" y2="78" stroke={isSnow ? "#0369a1" : "#1d4ed8"} strokeWidth="6" strokeLinecap="round" />
            <circle cx="39" cy="78" r="4" fill={isSnow ? "#1e293b" : "url(#studSkinGrad)"} />
          </g>
        )}

        {/* ---------------- 6. CABEÇA, ROSTO E EXPRESSÃO DE FRIO ---------------- */}
        <circle
          cx="62"
          cy="44"
          r="17"
          fill="url(#studSkinGrad)"
          stroke={isSnow ? "#b45309" : "#ca8a04"}
          strokeWidth="1.5"
        />

        {/* BOCHECHAS: Na neve ficam MUITO mais vermelhas pelo frio intenso! */}
        <circle
          cx="53"
          cy="49"
          r={isSnow ? 4.5 : 3.2}
          fill={isSnow ? "#ef4444" : "#f87171"}
          opacity={isSnow ? 0.85 : 0.55}
        />
        <circle
          cx="71"
          cy="49"
          r={isSnow ? 4.5 : 3.2}
          fill={isSnow ? "#ef4444" : "#f87171"}
          opacity={isSnow ? 0.85 : 0.55}
        />

        {/* NARIZ: No frio cortante, a pontinha do nariz fica vermelha ardendo! */}
        {isSnow ? (
          <ellipse cx="62" cy="46" rx="2.8" ry="2.2" fill="#f43f5e" opacity="0.9" />
        ) : (
          <ellipse cx="62" cy="46" rx="1.6" ry="1.2" fill="#ea580c" opacity="0.6" />
        )}

        {/* OLHOS: Expressão realista */}
        {isRaisingFlag || isCheering ? (
          // Olhos radiantes de vitória (^ ^) com brilhos
          <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M52 42 Q56 36 60 42" />
            <path d="M64 42 Q68 36 72 42" />
            <circle cx="56" cy="38" r="1.2" fill="#f59e0b" stroke="none" />
            <circle cx="68" cy="38" r="1.2" fill="#f59e0b" stroke="none" />
          </g>
        ) : isSnow ? (
          // Na neve: OLHOS SEMICERRADOS E SOBRANCELHAS TENSAS CONTRA O VENTO GELADO!
          <g>
            {/* Sobrancelhas inclinadas para baixo contra o vento */}
            <path d="M51 38 L58 40" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M73 38 L66 40" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
            {/* Olho semicerrado esquerdo */}
            <path d="M52 42 Q56 40 59 42" fill="none" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="56" cy="42" r="1.5" fill="#1e293b" />
            <circle cx="56.5" cy="41.5" r="0.6" fill="#ffffff" />
            {/* Olho semicerrado direito */}
            <path d="M65 42 Q68 40 72 42" fill="none" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="68" cy="42" r="1.5" fill="#1e293b" />
            <circle cx="68.5" cy="41.5" r="0.6" fill="#ffffff" />
          </g>
        ) : (
          // Olhos curiosos, abertos e brilhantes
          <g>
            <path d="M52 38 Q56 37 59 39" fill="none" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M65 39 Q68 37 72 38" fill="none" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="56" cy="42" r="2.4" fill="#1e293b" />
            <circle cx="68" cy="42" r="2.4" fill="#1e293b" />
            <circle cx="57" cy="41" r="0.9" fill="#ffffff" />
            <circle cx="69" cy="41" r="0.9" fill="#ffffff" />
          </g>
        )}

        {/* BOCA E REAÇÃO DE FRIO: Na neve os dentes tremem ou queixo vibra! */}
        {isRaisingFlag || isCheering ? (
          // Sorriso triunfante aberto
          <g>
            <path d="M55 49 Q62 57 69 49 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            <path d="M57 50 Q62 52 67 50" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ) : isSnow ? (
          // Tremendo de frio: boca em ziguezague ondulante vibrando ("Brrrr!")
          <g className="animate-[trailColdShiver_0.18s_infinite]">
            <path
              d="M56 50 Q59 48 62 51 Q65 49 68 51"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        ) : (
          // Sorriso alegre e determinado
          <path d="M57 49 Q62 54 67 49" fill="none" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
        )}

        {/* ---------------- 7. FUMAÇA DE VAPOR DA RESPIRAÇÃO QUENTE NO AR GÉLIDO DA NEVE! ---------------- */}
        {isSnow && !isRaisingFlag && (
          <g transform="translate(68, 48)" className="trail-breath-vapor pointer-events-none">
            {/* Primeira bolha condensada */}
            <circle cx="2" cy="-2" r="3" fill="#ffffff" opacity="0.8" />
            {/* Segunda nuvem expandindo no ar */}
            <circle cx="8" cy="-6" r="4.5" fill="#f8fafc" opacity="0.65" />
            {/* Terceira nuvem dissipando com o vento alpino */}
            <circle cx="16" cy="-12" r="6" fill="#e0f2fe" opacity="0.45" />
            <circle cx="24" cy="-18" r="7.5" fill="#e0f2fe" opacity="0.25" />
          </g>
        )}

        {/* ---------------- 8. GORRO DE INVERNO OU BOINA FRANCESA ---------------- */}
        {showSnowGear ? (
          // Gorro de lã de inverno volumoso com pompom e dobra canelada
          <g>
            {/* Dobra canelada branca do gorro */}
            <rect x="43" y="29" width="38" height="9" rx="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="51" y1="30" x2="51" y2="37" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="59" y1="30" x2="59" y2="37" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="67" y1="30" x2="67" y2="37" stroke="#e2e8f0" strokeWidth="1" />
            {/* Cúpula do gorro vermelho */}
            <path
              d="M46 30 C46 15 78 15 78 30 Z"
              fill="url(#studBeanieGrad)"
              stroke="#7f1d1d"
              strokeWidth="1.6"
            />
            {/* Neve caindo e repousando no topo do gorro */}
            <path d="M51 22 Q62 17 73 22" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            {/* Pompom felpudo vibrando ao vento */}
            <circle cx="62" cy="14" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <circle cx="64" cy="12" r="1.5" fill="#f1f5f9" />

            {/* Cachecol de lã grosso em volta do pescoço */}
            <g>
              <rect x="44" y="55" width="36" height="10" rx="5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.6" />
              {/* Ponta do cachecol tremulando forte com o vento gélido da altitude */}
              <g className="animate-[wiggle_1.2s_ease-in-out_infinite]">
                <path
                  d="M66 60 C78 62 84 72 82 82"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M66 60 C78 62 84 72 82 82"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.2"
                  strokeDasharray="4 3"
                />
                {/* Franjas na ponta do cachecol */}
                <line x1="79" y1="84" x2="84" y2="87" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                <line x1="82" y1="83" x2="87" y2="85" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </g>
        ) : (
          // Boina francesa clássica azul-marinho
          <g>
            <ellipse cx="62" cy="30" rx="22" ry="8" fill="url(#studBeretGrad)" stroke="#172554" strokeWidth="1.5" />
            <path d="M43 29 C47 20 77 18 81 29 Z" fill="url(#studBeretGrad)" />
            {/* Rabicho da boina */}
            <line x1="62" y1="22" x2="62" y2="17" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}

        {/* ---------------- 9. BRAÇOS: GUARDA-CHUVA, FRIO ENCOLHIDO OU HASTEAR BANDEIRA AO VIVO ---------------- */}
        {showUmbrella ? (
          // ALUNO COM GUARDA-CHUVA NA CHUVA
          <g>
            <path d="M70 70 Q84 66 82 48" fill="none" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" />
            <circle cx="82" cy="46" r="4" fill="url(#studSkinGrad)" />
            <line x1="82" y1="48" x2="82" y2="8" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <path d="M82 48 Q82 56 76 55" fill="none" stroke="#92400e" strokeWidth="3.5" strokeLinecap="round" />
            <g transform="translate(82, 10)">
              <path
                d="M-40 6 Q0 -25 40 6 Q27 -1 14 6 Q0 -1 -14 6 Q-27 -1 -40 6 Z"
                fill="url(#studUmbrellaGrad)"
                stroke="#991b1b"
                strokeWidth="2.2"
              />
              <line x1="0" y1="-14" x2="0" y2="-20" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
              <g className="animate-pulse">
                <circle cx="-22" cy="-9" r="1.6" fill="#38bdf8" />
                <circle cx="18" cy="-7" r="1.6" fill="#38bdf8" />
                <path d="M-24 -11 L-27 -16" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M20 -9 L25 -14" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            </g>
          </g>
        ) : isRaisingFlag ? (
          // ALUNO HASTEANDO A BANDEIRA AO VIVO NO CUME!
          <g>
            {/* Corda da adriça esticada */}
            <line x1="104" y1="-15" x2="104" y2="140" stroke="#fef08a" strokeWidth="1.8" opacity="0.85" />
            <line x1="102" y1="-15" x2="102" y2="140" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="4 2" />

            {/* Braço esquerdo e direito puxando a corda ritmadamente */}
            <g className="animate-[trailHalyardPull_1s_ease-in-out_infinite]">
              <path d="M68 70 L98 48" fill="none" stroke={isSnow ? "#0369a1" : "#1d4ed8"} strokeWidth="7" strokeLinecap="round" />
              <circle cx="98" cy="48" r="4.5" fill={isSnow ? "#1e293b" : "url(#studSkinGrad)"} />
            </g>
            <g className="animate-[trailHalyardPull_1s_ease-in-out_infinite_reverse]">
              <path d="M52 70 L102 62" fill="none" stroke={isSnow ? "#0369a1" : "#1d4ed8"} strokeWidth="7" strokeLinecap="round" />
              <circle cx="102" cy="62" r="4.5" fill={isSnow ? "#1e293b" : "url(#studSkinGrad)"} />
            </g>

            {/* Mastro da Bandeira cravado na rocha no cume */}
            <g transform="translate(108, 0)">
              {/* Haste metálica dourada sólida */}
              <line x1="0" y1="-26" x2="0" y2="142" stroke="url(#studPoleGold)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Roldana e esfera dourada no topo */}
              <circle cx="0" cy="-26" r="6" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
              <circle cx="2" cy="-28" r="1.8" fill="#fef08a" />

              {/* BANDEIRA SUBINDO AO VIVO PELA HASTE! */}
              {(() => {
                const minY = -24; // Posição topo
                const maxY = 75;  // Posição base
                const pct = Math.min(100, Math.max(0, flagProgress));
                const currentY = maxY - ((maxY - minY) * pct) / 100;

                return (
                  <g
                    transform={`translate(3, ${currentY})`}
                    className="trail-flag-wiggle origin-left"
                    style={{
                      transition: "transform 0.4s ease-out",
                    }}
                  >
                    {/* Borda reforçada e presilhas na adriça */}
                    <line x1="-3" y1="2" x2="0" y2="2" stroke="#ffffff" strokeWidth="2" />
                    <line x1="-3" y1="22" x2="0" y2="22" stroke="#ffffff" strokeWidth="2" />

                    {/* Tecido da Bandeira Tricolor Francesa 🇫🇷 (Azul, Branco, Vermelho) */}
                    <g filter="url(#studPoleGold)">
                      <rect x="0" y="0" width="12" height="24" fill="#1d4ed8" />
                      <rect x="12" y="0" width="12" height="24" fill="#ffffff" />
                      <rect x="24" y="0" width="12" height="24" fill="#dc2626" />
                    </g>
                    {/* Costuras e contorno do tecido */}
                    <rect x="0" y="0" width="36" height="24" fill="none" stroke="#0f172a" strokeWidth="0.8" opacity="0.3" />

                    {/* Brilhos estelares e estrelas cintilantes ao atingir o topo */}
                    {pct >= 90 && (
                      <g className="animate-pulse">
                        <text x="39" y="14" fontSize="13" fill="#f59e0b">✨</text>
                        <text x="-12" y="-4" fontSize="11" fill="#f59e0b">⭐</text>
                      </g>
                    )}
                  </g>
                );
              })()}
            </g>
          </g>
        ) : isCheering ? (
          // ALUNO COMEMORANDO COM OS DOIS BRAÇOS ERGUIDOS
          <g>
            <path d="M70 68 Q88 46 94 28" fill="none" stroke={isSnow ? "#0369a1" : "#1d4ed8"} strokeWidth="7" strokeLinecap="round" />
            <path d="M46 68 Q30 46 24 28" fill="none" stroke={isSnow ? "#0369a1" : "#1d4ed8"} strokeWidth="7" strokeLinecap="round" />
            <circle cx="94" cy="28" r="4.5" fill={isSnow ? "#1e293b" : "url(#studSkinGrad)"} />
            <circle cx="24" cy="28" r="4.5" fill={isSnow ? "#1e293b" : "url(#studSkinGrad)"} />
          </g>
        ) : isSnow ? (
          // NA NEVE PARADO: BRAÇOS ENCOLHIDOS ABRAÇANDO O CORPO OU ESFREGANDO AS LUVAS!
          <g>
            {/* Braço direito cruzando o peito */}
            <path d="M72 68 Q64 80 50 82" fill="none" stroke="#0369a1" strokeWidth="7" strokeLinecap="round" />
            <circle cx="50" cy="82" r="4.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            {/* Braço esquerdo cruzando por baixo */}
            <path d="M46 68 Q56 80 66 84" fill="none" stroke="#0369a1" strokeWidth="6.5" strokeLinecap="round" />
            <circle cx="66" cy="84" r="4.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          </g>
        ) : (
          // Braço normal relaxado em postura de caminhada
          <g>
            <path d="M70 68 Q78 80 74 90" fill="none" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" />
            <circle cx="74" cy="90" r="4" fill="url(#studSkinGrad)" />
          </g>
        )}
      </svg>
    </div>
  );
}
