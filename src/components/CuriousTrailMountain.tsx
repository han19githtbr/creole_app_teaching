"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TRAIL_LEVELS, ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";
import { CuriousTrailStudent } from "./CuriousTrailStudent";
import { soundEffects } from "@/lib/soundEffects";
import { createWildlife, type Wildlife } from "@/lib/trailWildlife";
import { Check, Lock } from "lucide-react";

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
 * Cenário visual ultra-realista da montanha alpina com a trilha sinuosa:
 * - Picos alpinos majestosos com luz e sombra facetadas, geleiras e neves eternas
 * - Encostas geológicas com estrato rochoso, tálus de cascalho, cascata de degelo e prados floridos
 * - Trilha alpina realista com ziguezagues, degraus de madeira rústicos, marcos de pedra (cairns)
 * - Na neve: trilha com pegadas afundadas e estacas de balizamento de nevasca
 * - Vida selvagem animada e realista passeando pela montanha
 * - Aluno explorador reagindo ao clima, tremendo de frio na neve e levantando a bandeira ao vivo no cume
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

  // Calcula a posição do aluno na estação atual ou subindo
  const nextCfg = TRAIL_LEVELS.find((level) => level.level === currentLevel + 1);
  const progress = Math.max(0, Math.min(1, climbProgress));
  const studentCoord = isRaisingFlag
    ? { x: 86, y: 12 } // No cume ao lado do mastro durante o hasteamento
    : {
        x: currentCfg.coord.x + ((nextCfg?.coord.x ?? currentCfg.coord.x) - currentCfg.coord.x) * progress,
        y: currentCfg.coord.y + ((nextCfg?.coord.y ?? currentCfg.coord.y) - currentCfg.coord.y) * progress,
      };

  // ---------------- BICHOS VIVOS NA ENCOSTA (movimento natural e realista) ----------------
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<Wildlife | null>(null);
  const sizeRef = useRef({ W: 0, H: 0 });
  const bubbleIdRef = useRef<string | null>(null);
  const bubbleId = localBubble?.id ?? activeAnimalGreeting ?? null;

  useEffect(() => {
    bubbleIdRef.current = bubbleId;
  }, [bubbleId]);

  useEffect(() => {
    const el = wrapRef.current;
    const svg = svgRef.current;
    if (!el || !svg) return;
    const world = createWildlife();
    worldRef.current = world;

    const measure = () => {
      const W = el.clientWidth, H = el.clientHeight;
      sizeRef.current = { W, H };
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { W, H } = sizeRef.current;
      if (W > 0 && H > 0) {
        world.step(dt, W, H);
        svg.innerHTML = world.render(W, H);
        const b = bubbleRef.current;
        const id = bubbleIdRef.current;
        if (b) {
          const c = id ? world.find(id) : undefined;
          if (c) {
            const p = world.position(c, W, H);
            const x = Math.min(Math.max(p.x, 110), W - 110);
            b.style.transform = `translate(${x}px, ${Math.max(p.y, 70)}px) translate(-50%, -100%)`;
            b.style.opacity = "1";
          } else {
            b.style.opacity = "0";
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      worldRef.current = null;
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

  function pointerPos(e: React.PointerEvent | React.MouseEvent) {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const world = worldRef.current;
    if (!world || !wrapRef.current) return;
    const { x, y } = pointerPos(e);
    const c = world.hit(x, y, sizeRef.current.W, sizeRef.current.H);
    if (c) {
      world.poke(c);
      handleAnimalTap(c.animal);
    }
  }
  function handleMapMove(e: React.PointerEvent<HTMLDivElement>) {
    const world = worldRef.current;
    if (!world || !wrapRef.current) return;
    const { x, y } = pointerPos(e);
    e.currentTarget.style.cursor = world.hit(x, y, sizeRef.current.W, sizeRef.current.H) ? "pointer" : "default";
  }

  const bubbleAnimal = bubbleId ? ROAMING_ANIMAL_POOL.find((a) => a.id === bubbleId) : undefined;
  const isAllCompleted = completedLevels.includes(7);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "trail-mountain relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden border-2 border-[var(--border)] shadow-2xl select-none transition-colors duration-1000",
        weather === "sunny" && "bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50/30",
        weather === "rain" && "bg-gradient-to-b from-slate-800 via-slate-700 to-emerald-950/80",
        weather === "snow" && "bg-gradient-to-b from-slate-500 via-slate-300 to-indigo-100/50",
        className
      )}
    >
      {/* ---------------- 1. CÉU ATMOSFÉRICO E EFEITOS DE CLIMA ---------------- */}
      {weather === "sunny" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Sol alpino radiante com auréola de calor */}
          <div className="absolute top-5 left-10 w-24 h-24 rounded-full bg-amber-200/50 blur-xl pointer-events-none" />
          <div className="absolute top-7 left-12 w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_50px_#f59e0b]" />
          {/* Raios solares suaves iluminando a montanha */}
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-gradient-to-br from-amber-300/20 via-transparent to-transparent rotate-12 blur-lg pointer-events-none" />
          {/* Nuvens brancas fofas e volumosas */}
          <div className="trail-cloud--first absolute top-7 right-16 h-16 w-52 rounded-full bg-white/75 blur-[2px] shadow-sm" />
          <div className="trail-cloud--second absolute top-14 left-1/3 h-12 w-40 rounded-full bg-white/65 blur-[2px]" />
        </div>
      )}

      {weather === "rain" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Nuvens pesadas de chuva carregadas nos picos */}
          <div className="absolute -top-12 inset-x-0 h-44 bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-transparent" />
          {/* Camada de chuva em perspectiva */}
          <svg className="trail-rain-layer absolute inset-0 h-full w-full opacity-70">
            <pattern id="rainPatternReal" width="70" height="70" patternUnits="userSpaceOnUse" patternTransform="rotate(22)">
              <line x1="12" y1="0" x2="12" y2="30" stroke="#bae6fd" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="36" y1="20" x2="36" y2="52" stroke="#7dd3fc" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="58" y1="40" x2="58" y2="68" stroke="#bae6fd" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="30" r="1" fill="#e0f2fe" opacity="0.6" />
              <circle cx="36" cy="52" r="1" fill="#e0f2fe" opacity="0.6" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#rainPatternReal)" />
          </svg>
          {/* Névoa densa descendo pela encosta */}
          <div className="trail-mist-layer absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-slate-950/50 via-slate-800/20 to-transparent" />
        </div>
      )}

      {weather === "snow" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Céu gélido de alta altitude */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-slate-700/60 via-indigo-950/30 to-transparent" />
          {/* Nevasca alpina multicamadas com flocos de vários tamanhos e rajadas */}
          <svg className="trail-snow-layer absolute inset-0 h-full w-full opacity-85">
            <pattern id="snowPatternReal" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="15" r="3.2" fill="#ffffff" />
              <circle cx="55" cy="22" r="2.2" fill="#f8fafc" />
              <circle cx="85" cy="35" r="3.8" fill="#ffffff" />
              <circle cx="38" cy="60" r="1.8" fill="#e2e8f0" />
              <circle cx="72" cy="78" r="2.6" fill="#ffffff" />
              <circle cx="15" cy="85" r="2.2" fill="#f1f5f9" />
              {/* Cristais de gelo pontiagudos */}
              <line x1="55" y1="20" x2="55" y2="24" stroke="#ffffff" strokeWidth="1" />
              <line x1="53" y1="22" x2="57" y2="22" stroke="#ffffff" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#snowPatternReal)" />
          </svg>
          {/* Vento polar sutil no cume */}
          <div className="absolute top-0 right-0 w-80 h-44 bg-gradient-to-bl from-white/20 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* ---------------- 2. CENÁRIO DA MONTANHA HIPER-REALISTA (SVG) ---------------- */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          {/* Gradientes dos Picos Mais Distantes */}
          <linearGradient id="farPeaksLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#f1f5f9" : weather === "rain" ? "#475569" : "#bae6fd"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#1e293b" : "#7dd3fc"} />
          </linearGradient>

          <linearGradient id="farPeaksShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#334155" : "#60a5fa"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#0f172a" : "#3b82f6"} />
          </linearGradient>

          {/* Cordilheira Média Granítica */}
          <linearGradient id="midRidgeLit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#334155" : "#6ee7b7"} />
            <stop offset="60%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#1e293b" : "#34d399"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#0f172a" : "#059669"} />
          </linearGradient>

          <linearGradient id="midRidgeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#1e293b" : "#047857"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#475569" : weather === "rain" ? "#022c22" : "#064e3b"} />
          </linearGradient>

          {/* Encosta Principal da Trilha (Terra e Pastagens) */}
          <linearGradient id="slopeGrassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#e2e8f0" : weather === "rain" ? "#15803d" : "#22c55e"} />
            <stop offset="45%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#166534" : "#16a34a"} />
            <stop offset="85%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#14532d" : "#15803d"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#052e16" : "#166534"} />
          </linearGradient>

          {/* Rochas Graníticas e Tálus */}
          <linearGradient id="graniteRockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#f1f5f9" : "#94a3b8"} />
            <stop offset="50%" stopColor={weather === "snow" ? "#94a3b8" : "#64748b"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#64748b" : "#475569"} />
          </linearGradient>

          {/* Geleira e Neve do Cume (Níveis 6 e 7) */}
          <linearGradient id="realGlacierSnow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f8fafc" />
            <stop offset="80%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Trilha de Terra Batida Natural */}
          <linearGradient id="trailDirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={weather === "snow" ? "#ffffff" : weather === "rain" ? "#451a03" : "#fef08a"} />
            <stop offset="50%" stopColor={weather === "snow" ? "#e2e8f0" : weather === "rain" ? "#78350f" : "#fde047"} />
            <stop offset="100%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#291103" : "#ca8a04"} />
          </linearGradient>

          {/* Riacho alpino de degelo */}
          <linearGradient id="alpineBrookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* ---------------- 2.1 PICOS DISTANTES ESCULPIDOS COM FACETAS DE LUZ ---------------- */}
        {/* Cordilheira de fundo: Face ensolarada (iluminada) */}
        <polygon
          points="0,480 120,290 240,430 380,210 520,380 680,160 810,320 920,210 1000,260 1000,600 0,600"
          fill="url(#farPeaksLight)"
          opacity="0.85"
        />
        {/* Cordilheira de fundo: Face sombreada (volume 3D das montanhas) */}
        <polygon
          points="120,290 240,430 180,440"
          fill="url(#farPeaksShadow)"
          opacity="0.75"
        />
        <polygon
          points="380,210 520,380 430,390"
          fill="url(#farPeaksShadow)"
          opacity="0.7"
        />
        <polygon
          points="680,160 810,320 730,330"
          fill="url(#farPeaksShadow)"
          opacity="0.7"
        />
        <polygon
          points="920,210 1000,260 950,290"
          fill="url(#farPeaksShadow)"
          opacity="0.65"
        />

        {/* Neve eterna e geleiras nos cumes distantes mais altos */}
        <polygon points="380,210 330,270 420,265" fill="#ffffff" opacity="0.95" />
        <polygon points="380,210 395,255 420,265" fill="#cbd5e1" opacity="0.8" />
        <polygon points="680,160 630,225 730,220" fill="#ffffff" opacity="0.95" />
        <polygon points="680,160 700,215 730,220" fill="#cbd5e1" opacity="0.8" />
        {/* Fendas glaciares sutis nos picos */}
        <path d="M360 250 Q375 258 395 254" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M660 205 Q685 212 705 208" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* ---------------- 2.2 CORDILHEIRA MÉDIA GRANÍTICA ---------------- */}
        <path
          d="M0 500 L80 420 L190 310 L310 440 L450 260 L590 400 L740 220 L890 340 L1000 240 L1000 600 L0 600 Z"
          fill="url(#midRidgeLit)"
          opacity="0.9"
        />
        {/* Faces de sombra da cordilheira média */}
        <polygon points="190,310 310,440 230,450" fill="url(#midRidgeShadow)" opacity="0.85" />
        <polygon points="450,260 590,400 490,420" fill="url(#midRidgeShadow)" opacity="0.85" />
        <polygon points="740,220 890,340 790,360" fill="url(#midRidgeShadow)" opacity="0.85" />

        {/* ---------------- 2.3 MACIÇO PRINCIPAL DA TRILHA (Curvas de Nível Geológicas) ---------------- */}
        {/* Encosta Verde e Rochosa Principal */}
        <path
          d="M0 600 L0 470 Q140 430 270 370 Q430 300 580 230 Q740 150 880 65 L980 85 L1000 120 L1000 600 Z"
          fill="url(#slopeGrassGrad)"
        />

        {/* Degraus geológicos e estratos de rocha na encosta */}
        <path
          d="M0 520 Q140 470 270 415 Q430 345 580 270 Q740 190 880 98"
          fill="none"
          stroke={weather === "snow" ? "#f1f5f9" : weather === "rain" ? "#86a99c" : "#86efac"}
          strokeWidth="3.5"
          opacity="0.32"
        />
        <path
          d="M60 580 Q240 500 380 440 T670 310 T930 140"
          fill="none"
          stroke={weather === "snow" ? "#64748b" : weather === "rain" ? "#052e24" : "#14532d"}
          strokeWidth="4"
          opacity="0.25"
        />

        {/* RIACHO ALPINO DE DEGELO CASCATEANDO ENTRE AS ROCHAS */}
        <g opacity="0.75">
          <path
            d="M580 240 Q550 310 520 370 Q490 440 450 510 Q420 560 400 600"
            fill="none"
            stroke="url(#alpineBrookGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Espuma branca das quedas d'água */}
          <path
            d="M580 240 Q550 310 520 370 Q490 440 450 510 Q420 560 400 600"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="8 14"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* ---------------- 2.4 AFLORAMENTOS ROCHOSOS COM ESTRATOS E SOMBRAS ---------------- */}
        {[
          { x: 310, y: 410, s: 1.1 },
          { x: 480, y: 320, s: 0.95 },
          { x: 670, y: 220, s: 0.85 },
          { x: 810, y: 150, s: 0.9 },
        ].map((rock, i) => (
          <g key={i} transform={`translate(${rock.x}, ${rock.y}) scale(${rock.s})`}>
            {/* Bloco principal de granito */}
            <path
              d="M-28 12 L-18 -8 L-6 -5 L5 -18 L19 -7 L30 12 Z"
              fill="url(#graniteRockGrad)"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Face iluminada no topo da rocha */}
            <path
              d="M-18 -8 L-6 -5 L5 -18 L11 -6 L2 -1 L-9 -3 Z"
              fill={weather === "snow" ? "#ffffff" : "#cbd5e1"}
              opacity="0.9"
            />
            {/* Fissuras e líquens na rocha */}
            <line x1="-5" y1="-5" x2="2" y2="8" stroke="#1e293b" strokeWidth="1" opacity="0.6" />
            <circle cx="8" cy="2" r="2.5" fill={weather === "snow" ? "#e2e8f0" : "#84cc16"} opacity="0.7" />
          </g>
        ))}

        {/* ---------------- 2.5 CUME DA VITÓRIA (ZONA NIVAL - NÍVEL 7) ---------------- */}
        {/* Manto de neve espesso do cume 3950m */}
        <path
          d="M770 170 Q860 60 930 70 Q980 110 1000 150 L1000 270 L730 280 Z"
          fill="url(#realGlacierSnow)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Sombras azuis nas dobras de neve do cume */}
        <path
          d="M800 150 Q880 90 940 95"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="3.5"
          opacity="0.65"
        />
        <path
          d="M850 130 Q910 80 960 90"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.5"
          opacity="0.5"
        />

        {/* ---------------- 2.6 PINHEIROS ALPINOS (Abetos com Galhos Escalonados) ---------------- */}
        {[
          { x: 150, y: 460, s: 1.15 },
          { x: 210, y: 485, s: 1.3 },
          { x: 260, y: 430, s: 0.95 },
          { x: 370, y: 370, s: 1.0 },
          { x: 440, y: 350, s: 0.85 },
          { x: 520, y: 290, s: 0.9 },
          { x: 610, y: 260, s: 0.78 },
          { x: 670, y: 275, s: 0.85 },
          { x: 740, y: 195, s: 0.7 },
        ].map((tree, i) => (
          <g key={i} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`}>
            {/* Tronco de casca grossa */}
            <rect x="-3.5" y="14" width="7" height="14" rx="1.5" fill="#451a03" stroke="#270e02" strokeWidth="0.8" />
            {/* Camadas da copa com agulhas alpinas */}
            <polygon
              points="0,-22 -14,-7 -4,-7 -18,7 -4,7 -22,22 22,22 4,7 18,7 4,-7 14,-7"
              fill={weather === "snow" ? "#334155" : weather === "rain" ? "#064e3b" : "#14532d"}
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* Neve fofa repousando nos galhos em clima nevado */}
            {weather === "snow" && (
              <g fill="#ffffff" opacity="0.95">
                <polygon points="0,-22 -7,-14 7,-14" />
                <path d="M-12 -7 Q0 -11 12 -7 L8 -5 Q0 -8 -8 -5 Z" />
                <path d="M-16 7 Q0 2 16 7 L12 9 Q0 5 -12 9 Z" />
                <path d="M-20 22 Q0 16 20 22 L16 24 Q0 19 -16 24 Z" />
              </g>
            )}
          </g>
        ))}

        {/* Flores silvestres nos prados baixos (Níveis 1 e 2) */}
        {weather !== "snow" && (
          <g opacity="0.85">
            {/* Edelweiss e Gencianas azuis */}
            {[
              { x: 90, y: 530, c: "#ffffff" },
              { x: 130, y: 550, c: "#3b82f6" },
              { x: 170, y: 520, c: "#fbbf24" },
              { x: 230, y: 470, c: "#ffffff" },
              { x: 280, y: 440, c: "#3b82f6" },
            ].map((fl, idx) => (
              <circle key={idx} cx={fl.x} cy={fl.y} r="2.8" fill={fl.c} />
            ))}
          </g>
        )}

        {/* ---------------- 3. A TRILHA ALPINA REALISTA (Sentier de Randonnée) ---------------- */}
        {/* Leito base escavado na montanha (borda externa de terra e cascalho) */}
        <path
          d="M 120 504 Q 190 460 260 420 T 440 348 T 320 264 T 560 204 T 740 132 T 880 60"
          fill="none"
          stroke={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#291103" : "#78350f"}
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* Leito da trilha com terra batida ou neve compactada */}
        <path
          d="M 120 504 Q 190 460 260 420 T 440 348 T 320 264 T 560 204 T 740 132 T 880 60"
          fill="none"
          stroke="url(#trailDirtGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pegadas nítidas ou pedras da trilha pontilhadas */}
        <path
          d="M 120 504 Q 190 460 260 420 T 440 348 T 320 264 T 560 204 T 740 132 T 880 60"
          fill="none"
          stroke={weather === "snow" ? "#64748b" : weather === "rain" ? "#3e1f06" : "#b45309"}
          strokeWidth="2.8"
          strokeDasharray="5 9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Degraus de madeira rústicos de montanha nas subidas íngremes */}
        {[
          { x1: 200, y1: 450, x2: 215, y2: 442 },
          { x1: 220, y1: 438, x2: 235, y2: 430 },
          { x1: 390, y1: 310, x2: 405, y2: 300 },
          { x1: 410, y1: 298, x2: 425, y2: 288 },
          { x1: 640, y1: 172, x2: 655, y2: 165 },
          { x1: 660, y1: 163, x2: 675, y2: 156 },
        ].map((step, idx) => (
          <line
            key={idx}
            x1={step.x1}
            y1={step.y1}
            x2={step.x2}
            y2={step.y2}
            stroke={weather === "snow" ? "#cbd5e1" : "#54280b"}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.9"
          />
        ))}

        {/* MARCOS DE PEDRA EMPILHADA DOS ALPES (Cairns) */}
        {[
          { x: 275, y: 410, s: 0.9 },
          { x: 575, y: 198, s: 0.8 },
          { x: 755, y: 125, s: 0.85 },
        ].map((cairn, idx) => (
          <g key={idx} transform={`translate(${cairn.x}, ${cairn.y}) scale(${cairn.s})`}>
            {/* Pedras empilhadas */}
            <ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#475569" stroke="#1e293b" strokeWidth="0.8" />
            <ellipse cx="0.5" cy="-4" rx="7" ry="3" fill="#64748b" stroke="#1e293b" strokeWidth="0.8" />
            <ellipse cx="-0.5" cy="-8" rx="5" ry="2.2" fill="#94a3b8" stroke="#1e293b" strokeWidth="0.8" />
            <ellipse cx="0" cy="-11" rx="3" ry="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            {/* Marca de tinta vermelha/branca da trilha GR */}
            <rect x="-2" y="-9" width="4" height="2" fill="#ef4444" />
          </g>
        ))}

        {/* Estacas de balizamento vermelho de neve nos níveis 6 e 7 */}
        {weather === "snow" && (
          <g>
            {[
              { x: 710, y: 145 },
              { x: 770, y: 115 },
              { x: 840, y: 80 },
            ].map((pole, idx) => (
              <g key={idx} transform={`translate(${pole.x}, ${pole.y})`}>
                <line x1="0" y1="0" x2="0" y2="-22" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="0" y1="-14" x2="0" y2="-8" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="0" cy="-22" r="2" fill="#fbbf24" />
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* ---------------- 4. BICHOS VIVOS REALISTAS (SVG ANIMADO) ---------------- */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 z-20" onClick={handleMapClick} onPointerMove={handleMapMove} />

      {/* Balão de fala do bicho clicado */}
      <div
        ref={bubbleRef}
        className="absolute left-0 top-0 z-30 pointer-events-none transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        {bubbleAnimal && (
          <div className="w-48 sm:w-56 p-2.5 bg-slate-900/95 text-white rounded-2xl shadow-2xl text-xs border border-amber-400/70 animate-in fade-in zoom-in-95 relative">
            <p className="font-extrabold text-amber-400 text-[11px] flex items-center gap-1.5">
              <span>{bubbleAnimal.emoji}</span>
              <span>{bubbleAnimal.name}</span>
            </p>
            <p className="mt-1 font-medium leading-snug italic text-slate-100">&ldquo;{bubbleAnimal.quote}&rdquo;</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </div>
        )}
      </div>

      {/* ---------------- 5. AS 7 ESTAÇÕES / WAYPOINTS ---------------- */}
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
                "relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-xs sm:text-sm shadow-xl transition-transform border-2",
                isCurrent
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white border-white ring-4 ring-amber-300/80 animate-pulse"
                  : isDone
                  ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white border-white"
                  : isUnlocked
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-white"
                  : "bg-slate-500 text-slate-200 border-slate-400"
              )}
            >
              {isDone ? (
                <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
              ) : isUnlocked ? (
                cfg.level
              ) : (
                <Lock className="h-3.5 w-3.5 text-white/80" />
              )}

              {/* Distintivo de Nível 7 com Coroa de Cume */}
              {cfg.level === 7 && (
                <span className="absolute -top-3.5 -right-2 text-sm sm:text-base animate-bounce">
                  👑
                </span>
              )}
            </span>

            {/* Etiqueta de Altitude e Nome */}
            <span
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap shadow-md border pointer-events-none transition-colors",
                isCurrent
                  ? "bg-amber-500 text-white border-amber-300 font-black"
                  : isDone
                  ? "bg-emerald-600/95 text-white border-emerald-400"
                  : "bg-slate-900/85 text-slate-100 border-slate-700"
              )}
            >
              N{cfg.level} · {cfg.altitude}m
            </span>
          </button>
        );
      })}

      {/* ---------------- 6. O ALUNO EXPLORADOR EM MOVIMENTO / HASTEANDO A BANDEIRA AO VIVO ---------------- */}
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
          isCheering={isCheering || (currentLevel === 7 && isAllCompleted)}
          isRaisingFlag={isRaisingFlag || (currentLevel === 7 && isAllCompleted)}
          flagProgress={flagProgress}
          size={84}
        />
      </div>

      {/* ---------------- 7. BANDEIRA DA VITÓRIA NO CUME AO VIVO (3950m) ---------------- */}
      <div
        className="absolute top-[6%] right-[7%] z-20 pointer-events-none flex flex-col items-center"
        title="Cume da Vitória · Hasteie a bandeira ao vivo ao concluir o Nível 7!"
      >
        {/* Mastro fixo dourado no topo com roldana */}
        <div className="relative w-2 h-20 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 rounded-full shadow-lg">
          {/* Esfera dourada no topo */}
          <div className="absolute -top-2.5 -left-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-700 shadow-md" />

          {/* Bandeira hasteada ao vivo quando concluído ou subindo */}
          {(isAllCompleted || isRaisingFlag) && (
            <div
              className="absolute left-2 flex w-14 h-9 rounded-sm overflow-hidden shadow-2xl border border-slate-900/30 trail-flag-wiggle origin-left"
              style={{
                transition: "top 0.4s ease-out",
                top: `${Math.max(0, 100 - flagProgress)}%`,
              }}
            >
              {/* Faixas Tricolor Francesas 🇫🇷 */}
              <div className="w-1/3 h-full bg-[#1d4ed8]" />
              <div className="w-1/3 h-full bg-[#ffffff]" />
              <div className="w-1/3 h-full bg-[#dc2626]" />
            </div>
          )}
        </div>

        <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-amber-400/60 shadow">
          🏔️ Cume 3950m
        </span>
      </div>

      {/* ---------------- 8. HUD INFORMATIVO SUPERIOR DA MONTANHA ---------------- */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        {/* Indicador do Clima e Altitude Atual */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 text-white border border-white/20 shadow-xl">
          <span className="text-xl">
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
                ? "Chuva na trilha (Guarda-chuva aberto!)"
                : "Neve alpina e Frio (Boneco agasalhado e tremendo de frio!)"}
            </span>
          </div>
        </div>

        {/* Quantidade de Elementos a Reconhecer neste Nível */}
        <div className="rounded-2xl bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 text-white border border-white/20 shadow-xl text-right">
          <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Meta deste Nível
          </span>
          <span className="block text-xs font-black text-emerald-400">
            {currentCfg.elementCount} {currentCfg.elementCount === 1 ? "Elemento" : "Elementos"}
          </span>
        </div>
      </div>
    </div>
  );
}
