"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TRAIL_LEVELS, type TrailLevelConfig, type TrailWeather } from "@/lib/curiousTrailData";
import { CuriousTrailStudent } from "./CuriousTrailStudent";
import { soundEffects } from "@/lib/soundEffects";
import { Check, Lock, Volume2 } from "lucide-react";

export interface CuriousTrailMountainProps {
  currentLevel: number; // 1 a 7
  unlockedLevel: number; // 1 a 7
  completedLevels: number[];
  onSelectLevel?: (level: number) => void;
  isMoving?: boolean;
  climbProgress?: number;
  isCheering?: boolean;
  isRaisingFlag?: boolean;
  flagProgress?: number; // 0..100
  activeAnimalGreeting?: string | null;
  onAnimalClick?: (animalId: string, quote: string) => void;
  themeColor?: string;
  className?: string;
}

/**
 * Cenário visual da montanha com a trilha sinuosa, as 7 estações,
 * o aluno se movimentando, o clima dinâmico (sol, chuva com guarda-chuva, neve),
 * os bichos no caminho e a bandeira da vitória no cume.
 */
export function CuriousTrailMountain({
  currentLevel,
  unlockedLevel,
  completedLevels,
  onSelectLevel,
  isMoving = false,
  climbProgress = 0,
  isCheering = false,
  isRaisingFlag = false,
  flagProgress = 100,
  activeAnimalGreeting,
  onAnimalClick,
  themeColor = "#3b82f6",
  className,
}: CuriousTrailMountainProps) {
  const currentCfg = TRAIL_LEVELS.find((l) => l.level === currentLevel) || TRAIL_LEVELS[0];
  const weather: TrailWeather = currentCfg.weather;
  const [localBubble, setLocalBubble] = useState<{ id: string; quote: string; name: string } | null>(null);

  // Calcula a posição do aluno na estação atual
  const nextCfg = TRAIL_LEVELS.find((level) => level.level === currentLevel + 1);
  const progress = Math.max(0, Math.min(1, climbProgress));
  const studentCoord = {
    x: currentCfg.coord.x + ((nextCfg?.coord.x ?? currentCfg.coord.x) - currentCfg.coord.x) * progress,
    y: currentCfg.coord.y + ((nextCfg?.coord.y ?? currentCfg.coord.y) - currentCfg.coord.y) * progress,
  };

  function handleAnimalTap(cfg: TrailLevelConfig) {
    soundEffects.playTap();
    setLocalBubble({ id: cfg.animal.id, quote: cfg.animal.quote, name: cfg.animal.name });
    onAnimalClick?.(cfg.animal.id, cfg.animal.quote);
    setTimeout(() => {
      setLocalBubble((prev) => (prev?.id === cfg.animal.id ? null : prev));
    }, 4500);
  }

  return (
    <div
      className={cn(
        "trail-mountain relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden border-2 border-[var(--border)] shadow-xl select-none transition-colors duration-1000",
        weather === "sunny" && "bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50",
        weather === "rain" && "bg-gradient-to-b from-slate-700 via-slate-600 to-emerald-950/80",
        weather === "snow" && "bg-gradient-to-b from-slate-400 via-indigo-100 to-blue-50",
        className
      )}
    >
      {/* ---------------- CÉU E CLIMA ANIMADO ---------------- */}
      {weather === "sunny" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Sol radiante */}
          <div className="absolute top-6 left-12 w-20 h-20 rounded-full bg-amber-300 blur-sm opacity-90 animate-pulse" />
          <div className="absolute top-8 left-14 w-16 h-16 rounded-full bg-amber-400 shadow-[0_0_40px_#f59e0b]" />
          {/* Nuvens brancas suaves */}
          <div className="trail-cloud trail-cloud--first absolute top-8 right-20 h-14 w-44 rounded-full bg-white/70 blur-[2px]" />
          <div className="trail-cloud trail-cloud--second absolute top-16 left-1/3 h-10 w-36 rounded-full bg-white/60 blur-[2px]" />
        </div>
      )}

      {weather === "rain" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Nuvens pesadas de chuva */}
          <div className="absolute -top-10 inset-x-0 h-36 bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-transparent" />
          {/* Gotas de chuva animadas via SVG */}
          <svg className="trail-rain-layer absolute inset-0 h-full w-full opacity-60">
            <pattern id="rainPattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
              <line x1="10" y1="0" x2="10" y2="25" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="20" x2="30" y2="45" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="50" y1="40" x2="50" y2="60" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#rainPattern)" />
          </svg>
          {/* Névoa suave */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-900/40 to-transparent" />
        </div>
      )}

      {weather === "snow" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Céu gelado de altitude */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-slate-600/50 via-indigo-900/30 to-transparent" />
          {/* Flocos de neve caindo */}
          <svg className="trail-snow-layer absolute inset-0 h-full w-full opacity-80">
            <pattern id="snowPattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="15" r="2.5" fill="#ffffff" />
              <circle cx="60" cy="25" r="3" fill="#ffffff" />
              <circle cx="35" cy="55" r="2" fill="#ffffff" />
              <circle cx="70" cy="70" r="2.5" fill="#ffffff" />
              <circle cx="10" cy="75" r="1.5" fill="#f8fafc" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#snowPattern)" />
          </svg>
        </div>
      )}

      {/* ---------------- MONTANHAS DE FUNDO (PARALLAX SVG) ---------------- */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          {/* Gradiente dos Picos Distantes */}
          <linearGradient id="farPeaksGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#e2e8f0" : weather === "rain" ? "#334155" : "#93c5fd"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#1e293b" : "#bfdbfe"} />
          </linearGradient>

          {/* Gradiente das Montanhas Médias */}
          <linearGradient id="midMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#1e293b" : "#4ade80"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#0f172a" : "#16a34a"} />
          </linearGradient>

          {/* Gradiente da Encosta Principal */}
          <linearGradient id="mainSlopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#f1f5f9" : weather === "rain" ? "#14532d" : "#22c55e"} />
            <stop offset="60%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#064e3b" : "#15803d"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#022c22" : "#166534"} />
          </linearGradient>

          {/* Cume da Vitória (Neve Eterna) */}
          <linearGradient id="summitSnowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>

        {/* 1. Picos Distantes de Fundo */}
        <path
          d="M0 450 L140 280 L280 430 L450 210 L620 400 L760 170 L910 320 L1000 240 L1000 600 L0 600 Z"
          fill="url(#farPeaksGrad)"
          opacity="0.75"
        />
        {/* Neve nos picos distantes */}
        <polygon points="450,210 410,260 490,260" fill="#ffffff" opacity="0.9" />
        <polygon points="760,170 720,230 800,230" fill="#ffffff" opacity="0.9" />
        <path d="M410 260 L450 210 L490 260 L470 250 L450 238 L430 253 Z" fill="#cbd5e1" opacity=".8" />
        <path d="M720 230 L760 170 L800 230 L780 216 L760 200 L742 222 Z" fill="#cbd5e1" opacity=".8" />

        {/* 2. Cordilheira Média */}
        <path
          d="M0 480 L180 320 L360 460 L580 260 L780 420 L940 220 L1000 270 L1000 600 L0 600 Z"
          fill="url(#midMountainGrad)"
          opacity="0.85"
        />

        {/* 3. Encosta Principal da Trilha (onde o aluno sobe) */}
        <path
          d="M0 600 L0 480 Q150 440 280 380 Q450 310 600 240 Q750 160 880 70 L980 90 L1000 130 L1000 600 Z"
          fill="url(#mainSlopeGrad)"
        />
        <path
          d="M0 525 Q150 475 280 420 Q450 350 600 278 Q750 198 880 108"
          fill="none"
          stroke={weather === "snow" ? "#fff" : weather === "rain" ? "#86a99c" : "#86efac"}
          strokeWidth="2"
          opacity=".24"
        />
        <path
          d="M80 590 Q260 510 390 450 T680 320 T940 150"
          fill="none"
          stroke={weather === "snow" ? "#64748b" : weather === "rain" ? "#052e24" : "#14532d"}
          strokeWidth="3"
          opacity=".18"
        />

        {/* Cume Nevado com Rochas (Estação 7) */}
        <path
          d="M800 180 Q880 70 940 80 Q980 120 1000 160 L1000 280 L760 300 Z"
          fill="url(#summitSnowGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* Pinheiros ao longo da montanha */}
        {[
          { x: 180, y: 440, s: 0.9 },
          { x: 230, y: 460, s: 1.1 },
          { x: 270, y: 410, s: 0.8 },
          { x: 420, y: 340, s: 0.85 },
          { x: 490, y: 370, s: 1.0 },
          { x: 620, y: 270, s: 0.75 },
          { x: 670, y: 290, s: 0.9 },
        ].map((tree, i) => (
          <g key={i} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`}>
            {/* Tronco */}
            <rect x="-3" y="15" width="6" height="12" fill="#78350f" />
            {/* Camadas da copa verde ou com neve */}
            <polygon points="0,-18 -16,0 -4,0 -20,18 20,18 4,0 16,0" fill={weather === "snow" ? "#475569" : "#14532d"} />
            {weather === "snow" && (
              <>
                <polygon points="0,-18 -8,-7 8,-7" fill="#ffffff" />
                <path d="M-13 5 Q0 0 13 5" fill="none" stroke="#fff" strokeWidth="2" opacity=".9" />
              </>
            )}
          </g>
        ))}

        {/* Afloramentos rochosos para dar escala à encosta */}
        {[
          { x: 360, y: 390, s: 1 },
          { x: 540, y: 300, s: 0.75 },
          { x: 790, y: 168, s: 0.85 },
        ].map((rock) => (
          <g key={`${rock.x}-${rock.y}`} transform={`translate(${rock.x}, ${rock.y}) scale(${rock.s})`} opacity={weather === "snow" ? 0.75 : 0.9}>
            <path d="M-22 9 L-14 -4 L-5 -2 L4 -13 L15 -5 L23 9 Z" fill={weather === "snow" ? "#94a3b8" : "#64748b"} />
            <path d="M-14 -4 L-5 -2 L4 -13 L8 -3 L1 1 L-7 0 Z" fill={weather === "snow" ? "#f8fafc" : "#cbd5e1"} opacity=".8" />
          </g>
        ))}

        {/* 4. A TRILHA SINUOSA (Caminho desenhado do Nível 1 ao Nível 7) */}
        {/* Linha de terra da trilha */}
        <path
          d="M 120 504 Q 190 460 260 420 T 440 348 T 320 264 T 560 204 T 740 132 T 880 60"
          fill="none"
          stroke={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#582f0e" : "#fef08a"}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Detalhes de pegadas / pedras na trilha */}
        <path
          d="M 120 504 Q 190 460 260 420 T 440 348 T 320 264 T 560 204 T 740 132 T 880 60"
          fill="none"
          stroke={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#3e1f06" : "#ca8a04"}
          strokeWidth="3"
          strokeDasharray="6 8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ---------------- ANIMAIS DA MONTANHA AO LONGO DO CAMINHO ---------------- */}
      {TRAIL_LEVELS.map((cfg) => {
        const isNearCurrent = cfg.level === currentLevel;
        // Posição do bicho ligeiramente ao lado do waypoint
        const leftPct = cfg.coord.x + (cfg.level % 2 === 0 ? 5 : -4);
        const topPct = cfg.coord.y + 4;

        return (
          <button
            type="button"
            key={cfg.animal.id}
            onClick={() => handleAnimalTap(cfg)}
            aria-label={`Ouvir ${cfg.animal.namePt}: ${cfg.animal.quote}`}
            className={cn(
              "trail-animal absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300",
              isNearCurrent ? "scale-125" : "scale-100 hover:scale-110 opacity-90"
            )}
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            title={`${cfg.animal.name} (${cfg.animal.namePt}) - Clique para ouvir!`}
          >
            {/* Ícone / Emoji do bicho com pulso suave */}
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md border-2 border-amber-400 group-hover:border-amber-500 animate-[bounce_2.5s_ease-in-out_infinite]">
              <span className="text-xl sm:text-2xl leading-none">{cfg.animal.emoji}</span>
              {/* Notificação de áudio disponível */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] text-white font-bold">
                <Volume2 className="h-2.5 w-2.5" />
              </span>
            </div>

            {/* Balão de fala do bicho quando clicado ou ativo */}
            {(localBubble?.id === cfg.animal.id || activeAnimalGreeting === cfg.animal.id) && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 sm:w-56 p-2.5 bg-slate-900/95 text-white rounded-2xl shadow-xl text-xs z-30 border border-amber-400/60 pointer-events-auto animate-in fade-in zoom-in-95">
                <p className="font-extrabold text-amber-400 text-[11px] flex items-center justify-between">
                  <span>{cfg.animal.emoji} {cfg.animal.name}</span>
                  <span className="text-[9px] text-slate-400">{cfg.altitude}m</span>
                </p>
                <p className="mt-1 font-medium leading-snug italic text-slate-100">
                  &ldquo;{cfg.animal.quote}&rdquo;
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            )}
          </button>
        );
      })}

      {/* ---------------- AS 7 ESTAÇÕES / WAYPOINTS ---------------- */}
      {TRAIL_LEVELS.map((cfg) => {
        const isCurrent = cfg.level === currentLevel;
        const isUnlocked = cfg.level <= unlockedLevel;
        const isDone = completedLevels.includes(cfg.level);

        return (
          <button
            type="button"
            key={cfg.level}
            onClick={() => isUnlocked && onSelectLevel?.(cfg.level)}
            disabled={!isUnlocked || !onSelectLevel}
            aria-label={`Nível ${cfg.level}, ${cfg.name}, ${cfg.altitude} metros${isDone ? ", concluído" : isUnlocked ? ", desbloqueado" : ", bloqueado"}`}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "trail-waypoint absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300",
              isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-60",
              isCurrent ? "scale-125 z-30" : "hover:scale-110"
            )}
            style={{ left: `${cfg.coord.x}%`, top: `${cfg.coord.y}%` }}
          >
            {/* Círculo do Waypoint */}
            <span
              className={cn(
                "relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-xs sm:text-sm shadow-lg transition-transform",
                isCurrent
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-4 ring-amber-300/80 animate-pulse"
                  : isDone
                  ? "bg-emerald-500 text-white border-2 border-white"
                  : isUnlocked
                  ? "bg-blue-600 text-white border-2 border-white"
                  : "bg-slate-400 text-slate-200 border-2 border-slate-300"
              )}
            >
              {isDone ? (
                <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
              ) : isUnlocked ? (
                cfg.level
              ) : (
                <Lock className="h-3.5 w-3.5 text-white/80" />
              )}

              {/* Distintivo de Nível 7 com Bandeira no Cume */}
              {cfg.level === 7 && (
                <span className="absolute -top-3 -right-2 text-base">🚩</span>
              )}
            </span>

            {/* Etiqueta de Altitude e Nome */}
            <span
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap shadow-sm border pointer-events-none transition-colors",
                isCurrent
                  ? "bg-amber-500 text-white border-amber-300"
                  : isDone
                  ? "bg-emerald-600/90 text-white border-emerald-400"
                  : "bg-slate-900/80 text-slate-100 border-slate-700"
              )}
            >
              N{cfg.level} · {cfg.altitude}m
            </span>
          </button>
        );
      })}

      {/* ---------------- O ALUNO EM MOVIMENTO NA TRILHA ---------------- */}
      <div
        className={cn(
          "absolute z-30 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out",
          isMoving && "scale-105"
        )}
        style={{
          left: `${studentCoord.x}%`,
          top: `${studentCoord.y - 4}%`,
        }}
      >
        <CuriousTrailStudent
          weather={weather}
          hasUmbrella={currentCfg.hasUmbrella}
          hasSnowGear={currentCfg.hasSnowGear}
          isWalking={isMoving}
          isCheering={isCheering}
          isRaisingFlag={isRaisingFlag || (currentLevel === 7 && completedLevels.includes(7))}
          flagProgress={flagProgress}
          size={78}
        />
      </div>

      {/* ---------------- BANDEIRA DA VITÓRIA NO CUME (NÍVEL 7) ---------------- */}
      <div
        className="absolute top-[8%] right-[8%] z-20 pointer-events-none flex flex-col items-center"
        title="Cume da Vitória · Hasteie a bandeira ao passar no Nível 7!"
      >
        {/* Mastro fixo no topo */}
        <div className="relative w-1.5 h-16 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 rounded-full shadow">
          {/* Topo dourado */}
          <div className="absolute -top-2 -left-1.5 w-4 h-4 rounded-full bg-amber-400 border border-amber-600 shadow-md" />

          {/* Bandeira hasteada quando o nível 7 for concluído */}
          {(completedLevels.includes(7) || isRaisingFlag) && (
            <div
              className="absolute left-1.5 top-0 flex w-12 h-8 rounded-sm overflow-hidden shadow-lg border border-slate-900/20 animate-[wiggle_2s_ease-in-out_infinite]"
              style={{
                transition: "top 1.2s ease-out",
                top: `${100 - flagProgress}%`,
              }}
            >
              {/* Faixas Tricolor Francesas */}
              <div className="w-1/3 h-full bg-[#2563eb]" />
              <div className="w-1/3 h-full bg-[#ffffff]" />
              <div className="w-1/3 h-full bg-[#dc2626]" />
            </div>
          )}
        </div>
        <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/50">
          🏔️ Cume 3950m
        </span>
      </div>

      {/* ---------------- HUD INFORMATIVO SUPERIOR DA MONTANHA ---------------- */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        {/* Indicador do Clima e Altitude Atual */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 text-white border border-white/20 shadow-lg">
          <span className="text-lg">
            {weather === "sunny" ? "☀️" : weather === "rain" ? "🌧️" : "❄️"}
          </span>
          <div className="leading-tight">
            <span className="block text-xs font-black text-amber-400">
              <span style={{ color: themeColor }}>Nível {currentLevel}</span> · {currentCfg.name}
            </span>
            <span className="block text-[10px] text-slate-300 font-semibold">
              Altitude: {currentCfg.altitude}m · Clima:{" "}
              {weather === "sunny"
                ? "Ensolarado"
                : weather === "rain"
                ? "Chuva (Guarda-chuva aberto!)"
                : "Neve e Frio (Agasalho quente!)"}
            </span>
          </div>
        </div>

        {/* Quantidade de Elementos a Reconhecer neste Nível */}
        <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-white border border-white/20 shadow-lg text-right">
          <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Meta deste Nível
          </span>
          <span className="block text-xs font-extrabold text-emerald-400">
            {currentCfg.elementCount} {currentCfg.elementCount === 1 ? "Elemento" : "Elementos"}
          </span>
        </div>
      </div>
    </div>
  );
}
