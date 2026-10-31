"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  TRAIL_LEVELS,
  TRAIL_ROAM_SPOTS,
  ROAMING_ANIMAL_POOL,
  type TrailAnimal,
  type TrailWeather,
} from "@/lib/curiousTrailData";
import { CuriousTrailStudent } from "./CuriousTrailStudent";
import { soundEffects } from "@/lib/soundEffects";
import { Check, Lock, Sparkles, Flag, Volume2 } from "lucide-react";

export interface CuriousTrailMountainProps {
  currentLevel: number; // 1 a 7
  unlockedLevel: number; // 1 a 7
  completedLevels: number[];
  onSelectLevel?: (level: number) => void;
  isMoving?: boolean;
  isCheering?: boolean;
  isRaisingFlag?: boolean;
  flagProgress?: number; // 0..100
  activeAnimalGreeting?: string | null;
  onAnimalClick?: (animalId: string, quote: string) => void;
  themeColor?: string;
  className?: string;
}

interface Roamer {
  uid: number;
  animal: TrailAnimal;
  spot: number; // índice em TRAIL_ROAM_SPOTS
  facingLeft: boolean;
  walking: boolean;
  state: "idle" | "leaving" | "arriving";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  const studentCoord = currentCfg.coord;

  // ---------------- BICHOS PASSEANDO PELOS PONTOS DA ENCOSTA ----------------
  const MAX_ROAMERS = 5;
  const [roamers, setRoamers] = useState<Roamer[]>([]);
  const roamersRef = useRef<Roamer[]>([]);
  useEffect(() => {
    roamersRef.current = roamers;
  }, [roamers]);
  const uidRef = useRef(0);

  useEffect(() => {
    // Estado inicial sorteado só no cliente (evita divergência de hidratação)
    const initialAnimals = shuffle(ROAMING_ANIMAL_POOL).slice(0, MAX_ROAMERS);
    const initialSpots = shuffle(TRAIL_ROAM_SPOTS.map((_, i) => i)).slice(0, MAX_ROAMERS);
    setRoamers(
      initialAnimals.map((animal, i) => ({
        uid: uidRef.current++,
        animal,
        spot: initialSpots[i],
        facingLeft: false,
        walking: false,
        state: "idle" as const,
      }))
    );

    // Passeio: a cada poucos segundos um bicho caminha para outro ponto livre
    const walkTimer = setInterval(() => {
      const current = roamersRef.current;
      if (current.length === 0) return;
      const mover = current[Math.floor(Math.random() * current.length)];
      const taken = new Set(current.map((r) => r.spot));
      const free = TRAIL_ROAM_SPOTS.map((_, i) => i).filter((i) => !taken.has(i));
      if (free.length === 0) return;
      const target = free[Math.floor(Math.random() * free.length)];
      const facingLeft = TRAIL_ROAM_SPOTS[target].x < TRAIL_ROAM_SPOTS[mover.spot].x;
      setRoamers((prev) =>
        prev.map((r) => (r.uid === mover.uid ? { ...r, spot: target, facingLeft, walking: true } : r))
      );
      setTimeout(() => {
        setRoamers((prev) => prev.map((r) => (r.uid === mover.uid ? { ...r, walking: false } : r)));
      }, 3600);
    }, 2800);

    // Troca: um bicho vai embora e outra espécie aparece no lugar
    const swapTimer = setInterval(() => {
      const current = roamersRef.current;
      if (current.length === 0) return;
      const leaving = current[Math.floor(Math.random() * current.length)];
      const visibleIds = new Set(current.map((r) => r.animal.id));
      const candidates = ROAMING_ANIMAL_POOL.filter((a) => !visibleIds.has(a.id));
      if (candidates.length === 0) return;
      const arriving = candidates[Math.floor(Math.random() * candidates.length)];
      setRoamers((prev) => prev.map((r) => (r.uid === leaving.uid ? { ...r, state: "leaving" } : r)));
      setTimeout(() => {
        setRoamers((prev) =>
          prev.map((r) =>
            r.uid === leaving.uid
              ? {
                  uid: uidRef.current++,
                  animal: arriving,
                  spot: r.spot,
                  facingLeft: r.facingLeft,
                  walking: false,
                  state: "arriving" as const,
                }
              : r
          )
        );
      }, 900);
    }, 7000);

    return () => {
      clearInterval(walkTimer);
      clearInterval(swapTimer);
    };
  }, []);

  function handleAnimalTap(animal: TrailAnimal) {
    soundEffects.playTap();
    setLocalBubble({ id: animal.id, quote: animal.quote, name: animal.name });
    onAnimalClick?.(animal.id, animal.quote);
    setTimeout(() => {
      setLocalBubble((prev) => (prev?.id === animal.id ? null : prev));
    }, 4500);
  }

  return (
    <div
      className={cn(
        "relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden border-2 border-[var(--border)] shadow-xl select-none transition-colors duration-1000",
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
          <div className="absolute top-8 right-20 w-44 h-14 bg-white/70 rounded-full blur-[2px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute top-16 left-1/3 w-36 h-10 bg-white/60 rounded-full blur-[2px]" />
        </div>
      )}

      {weather === "rain" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Nuvens pesadas de chuva */}
          <div className="absolute -top-10 inset-x-0 h-36 bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-transparent" />
          {/* Gotas de chuva animadas via SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-60">
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
          <svg className="absolute inset-0 w-full h-full opacity-80">
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
              <polygon points="0,-18 -8,-7 8,-7" fill="#ffffff" />
            )}
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

      {/* ---------------- BICHOS PASSEANDO PELA ENCOSTA (pontos marcados) ---------------- */}
      {roamers.map((r) => {
        const pos = TRAIL_ROAM_SPOTS[r.spot];
        const showBubble = localBubble?.id === r.animal.id || activeAnimalGreeting === r.animal.id;
        return (
          <div
            key={r.uid}
            onClick={() => handleAnimalTap(r.animal)}
            className={cn(
              "absolute z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2 group",
              "transition-[left,top,opacity,transform] duration-[3500ms] ease-in-out",
              r.state === "leaving" && "opacity-0 scale-50 !duration-700",
              r.state === "arriving" && "animate-in fade-in zoom-in-50 duration-700"
            )}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={`${r.animal.name} (${r.animal.namePt}) - Clique para ouvir!`}
          >
            <div
              className={cn(
                "relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md border-2 border-amber-400 group-hover:border-amber-500 hover:scale-110 transition-transform",
                r.walking ? "animate-[bounce_0.6s_ease-in-out_infinite]" : "animate-[bounce_2.5s_ease-in-out_infinite]"
              )}
            >
              <span
                className="text-xl sm:text-2xl leading-none inline-block"
                style={{ transform: r.facingLeft ? "scaleX(-1)" : undefined }}
              >
                {r.animal.emoji}
              </span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] text-white font-bold">
                <Volume2 className="h-2.5 w-2.5" />
              </span>
            </div>

            {showBubble && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 sm:w-56 p-2.5 bg-slate-900/95 text-white rounded-2xl shadow-xl text-xs z-30 border border-amber-400/60 pointer-events-auto animate-in fade-in zoom-in-95">
                <p className="font-extrabold text-amber-400 text-[11px]">
                  {r.animal.emoji} {r.animal.name}
                </p>
                <p className="mt-1 font-medium leading-snug italic text-slate-100">
                  &ldquo;{r.animal.quote}&rdquo;
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            )}
          </div>
        );
      })}

      {/* ---------------- AS 7 ESTAÇÕES / WAYPOINTS ---------------- */}
      {TRAIL_LEVELS.map((cfg) => {
        const isCurrent = cfg.level === currentLevel;
        const isUnlocked = cfg.level <= unlockedLevel;
        const isDone = completedLevels.includes(cfg.level);

        return (
          <div
            key={cfg.level}
            onClick={() => isUnlocked && onSelectLevel?.(cfg.level)}
            className={cn(
              "absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
              isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-60",
              isCurrent ? "scale-125 z-30" : "hover:scale-110"
            )}
            style={{ left: `${cfg.coord.x}%`, top: `${cfg.coord.y}%` }}
          >
            {/* Círculo do Waypoint */}
            <div
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
            </div>

            {/* Etiqueta de Altitude e Nome */}
            <div
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap shadow-sm border pointer-events-none transition-colors",
                isCurrent
                  ? "bg-amber-500 text-white border-amber-300"
                  : isDone
                  ? "bg-emerald-600/90 text-white border-emerald-400"
                  : "bg-slate-900/80 text-slate-100 border-slate-700"
              )}
            >
              {cfg.name} · {cfg.altitude}m
            </div>
          </div>
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
              Nível {currentLevel} · {currentCfg.name}
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
