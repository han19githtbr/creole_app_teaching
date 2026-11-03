"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TRAIL_LEVELS, ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import { CuriousTrailStudent } from "./CuriousTrailStudent";
import { soundEffects } from "@/lib/soundEffects";
import { createWildlife, type Wildlife } from "@/lib/trailWildlife";
import { CURIOUS_TRAIL_PATH } from "@/lib/curiousTrailGeometry";
import { Check, Lock, Volume2 } from "lucide-react";

export type TrailRoundState = "asking" | "correct" | "retry" | "reveal";

export interface CuriousTrailMountainProps {
  currentLevel: number; // 1 a 7
  unlockedLevel: number; // 1 a 7
  completedLevels: number[];
  onSelectLevel?: (level: number) => void;
  /**
   * Modo JOGO: os objetos do nÃ­vel aparecem no prÃ³prio mapa, ao longo da trilha, e o aluno
   * caminha pela curva do caminho a cada acerto. Sem `elements`, o mapa Ã© sÃ³ a prÃ©via do lobby.
   */
  elements?: CestQuoiItem[];
  elementIndex?: number;
  roundState?: TrailRoundState;
  /** true depois do Ãºltimo objeto do nÃ­vel: o aluno segue atÃ© a prÃ³xima estaÃ§Ã£o. */
  levelFinished?: boolean;
  avalancheMode?: boolean;
  onAvalancheCaught?: () => void;
  isCheering?: boolean;
  isRaisingFlag?: boolean;
  flagProgress?: number; // 0..100
  activeAnimalGreeting?: string | null;
  onAnimalClick?: (animalId: string, quote: string) => void;
  onSpeak?: (text: string) => void;
  themeColor?: string;
  className?: string;
  /** ConteÃºdo de tela (HUD direito, alternativas, contagem...), fixo sobre o mapa. */
  hudRight?: React.ReactNode;
  children?: React.ReactNode;
}

// ---------- Geometria da trilha (mesma curva de sempre, em um viewBox 1000x600) ----------
const VB_W = 1000;
const VB_H = 600;
/** Velocidade da caminhada em unidades do viewBox por segundo. */
const WALK_SPEED = 70;

/**
 * PosiÃ§Ã£o (fraÃ§Ã£o 0..1 do comprimento da trilha) onde fica cada acampamento.
 * O trecho de cada nÃ­vel Ã© proporcional Ã  quantidade de objetos, assim o aluno
              Cume · 3.950m
 */
const CAMP_FRACS: number[] = (() => {
  const weights = TRAIL_LEVELS.map((l) => l.elementCount + 3);
  const sum = weights.reduce((a, b) => a + b, 0);
  const out = [0];
  weights.forEach((w) => out.push(out[out.length - 1] + w / sum));
  out[out.length - 1] = 1;
  return out;
})();

const clampN = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Quantos px cada unidade do mapa (viewBox de 1000 de largura) ocupa durante o jogo. */
function pxPerUnit(W: number) {
  if (W < 480) return 1.3;
  if (W < 800) return 1.45;
  return 1.7;
}

/** Exibe a ilustração isolada do objeto durante a pergunta. */
function ObjectLens({ item, px, ring, full = false }: { item: CestQuoiItem; px: number; ring?: string; full?: boolean }) {
  // A miniatura circular ainda usa a cena; a pergunta mostra a ilustração isolada.
  const cw = Math.min(item.w, item.h) * 0.5;
  const x0 = full ? 0 : clampN(item.arrow.x - cw / 2, 0, item.w - cw);
  const y0 = full ? 0 : clampN(item.arrow.y - cw / 2, 0, item.h - cw);
  const vw = full ? item.w : cw;
  const vh = full ? item.h : cw;
  const arrowScale = 0.55;
  const isolatedSource = /^[a-z0-9-]+$/.test(item.id) ? `/ghibli/trail-objects/${item.id}.svg` : null;
  const source = full && item.scene.startsWith("/ghibli/") && isolatedSource ? isolatedSource : item.scene;
  return (
    <svg
      viewBox={`${x0} ${y0} ${vw} ${vh}`}
      width={px}
      height={full ? Math.round((px * item.h) / item.w) : px}
      className={cn("block bg-white", full ? "rounded-xl" : "rounded-full", ring)}
      aria-hidden
    >
      <image href={source} x={0} y={0} width={item.w} height={item.h} preserveAspectRatio={full ? "xMidYMid meet" : "none"} />
      {!full && (
        <g className="cq-sway">
          <g transform={`translate(${item.arrow.x} ${item.arrow.y}) rotate(25) scale(${arrowScale})`}>
            <path
              d="M-90 -10 L-40 -10 L-45 -25 L0 0 L-45 25 L-40 10 L-90 10 Z"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth={7}
              strokeLinejoin="round"
            />
          </g>
        </g>
      )}
    </svg>
  );
}

/**
 * CenÃ¡rio vivo da Trilha Curiosa: montanha, trilha sinuosa, 7 acampamentos, clima, bichos e o aluno.
 *
 * No modo jogo toda a dinÃ¢mica acontece aqui dentro: a cÃ¢mera acompanha o aluno, os objetos do tema
 * aparecem como medalhões com a ilustração isolada, e a cada acerto o aluno CAMINHA pela curva
 * do caminho atÃ© o prÃ³ximo ponto. As alternativas e o cronÃ´metro sÃ£o desenhados por cima, como `children`.
 */
export function CuriousTrailMountain({
  currentLevel,
  unlockedLevel,
  completedLevels,
  onSelectLevel,
  elements,
  elementIndex = 0,
  roundState = "asking",
  levelFinished = false,
  avalancheMode = false,
  onAvalancheCaught,
  isCheering = false,
  isRaisingFlag = false,
  flagProgress = 100,
  activeAnimalGreeting,
  onAnimalClick,
  onSpeak,
  themeColor = "#3b82f6",
  className,
  hudRight,
  children,
}: CuriousTrailMountainProps) {
  const currentCfg = TRAIL_LEVELS.find((l) => l.level === currentLevel) || TRAIL_LEVELS[0];
  const weather: TrailWeather = avalancheMode ? "snow" : currentCfg.weather;
  const playing = !!elements;
  const summitDone = completedLevels.includes(7);
  const [localBubble, setLocalBubble] = useState<{ id: string; quote: string; name: string } | null>(null);

  // ---------------- medidas, trilha e posiÃ§Ãµes ----------------
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const studentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const worldWildRef = useRef<Wildlife | null>(null);
  const wildlifeWeatherRef = useRef(weather);
  const sizeRef = useRef({ W: 0, H: 0, WW: 0, WH: 0 });
  const camRef = useRef({ tx: 0, ty: 0, s: 1 });
  const walkRef = useRef<number>(Number.NaN);
  const movingRef = useRef(false);
  const [stage, setStage] = useState({ W: 0, H: 0, WW: 0, WH: 0 });
  const [walking, setWalking] = useState(false);
  const [avalancheLen, setAvalancheLen] = useState(0);
  const avalancheRef = useRef({ len: 0, start: 0, caught: false, tick: 0 });
  const avalancheCaughtCallbackRef = useRef(onAvalancheCaught);
  useEffect(() => { avalancheCaughtCallbackRef.current = onAvalancheCaught; }, [onAvalancheCaught]);
  const [studentFacing, setStudentFacing] = useState<"left" | "right">("right");
  const [studentIncline, setStudentIncline] = useState<number>(0);
  const facingRef = useRef<"left" | "right">("right");
  const inclineRef = useRef<number>(0);

  // Tabela de pontos da trilha (1 amostra a cada 2 unidades), calculada quando o <path> entra na tela.
  const [pathInfo, setPathInfo] = useState<{ total: number; step: number; tbl: { x: number; y: number }[] }>({
    total: 0,
    step: 2,
    tbl: [],
  });
  const setPathEl = useCallback((el: SVGPathElement | null) => {
    pathRef.current = el;
    if (!el) return;
    const t = el.getTotalLength();
    const step = 2;
    const tbl: { x: number; y: number }[] = [];
    for (let l = 0; l <= t + step; l += step) {
      const pt = el.getPointAtLength(Math.min(l, t));
      tbl.push({ x: pt.x, y: pt.y });
    }
    setPathInfo({ total: t, step, tbl });
  }, []);
  const total = pathInfo.total;
  const curItem = elements?.[elementIndex];
  const maxCardHeight = clampN(stage.H * 0.48, 120, 310);
  const itemAspect = curItem && curItem.h > 0 ? curItem.w / curItem.h : 1;
  const cardPx = Math.round(Math.min(clampN(stage.W * 0.36, 150, 250), maxCardHeight * itemAspect));
  const cardHeight = curItem
    ? Math.round((cardPx * curItem.h) / curItem.w) + 70
    : 70;

  const N = currentCfg.elementCount;
  const campStart = CAMP_FRACS[currentLevel - 1] * total;
  const campEnd = CAMP_FRACS[currentLevel] * total;
  const segLen = campEnd - campStart;
  const elemLen = (i: number) => campStart + (segLen * (i + 1)) / (N + 1);

  const hasCurrent = playing && !levelFinished && elementIndex < (elements?.length ?? 0);
  let targetLen = campStart;
  if (!playing) targetLen = summitDone && currentLevel === 7 ? total : campStart;
  else if (levelFinished) targetLen = campEnd;
  else targetLen = elementIndex <= 0 ? campStart : elemLen(elementIndex - 1);
  const focusLen = hasCurrent ? elemLen(elementIndex) : null;
  const focusBelow = focusLen != null && (pointPct(focusLen)?.y ?? 50) < 30;
  const summitPoint = pointPct(total) ?? currentCfg.coord;

  // espelhos para o laÃ§o de animaÃ§Ã£o (evita recriar o requestAnimationFrame a cada render)
  const live = useRef({ target: 0, focus: null as number | null, playing: false, animate: true, total: 0, cardH: 0, avalancheMode: false });
  useEffect(() => {
    live.current = { target: targetLen, focus: focusLen, playing, animate: playing, total, cardH: focusLen != null && !focusBelow ? cardHeight : 0, avalancheMode };
  });

  useEffect(() => {
    const start = CAMP_FRACS[currentLevel - 1] * total;
    avalancheRef.current = { len: start - 115, start, caught: false, tick: 0 };
    setAvalancheLen(start - 115);
  }, [currentLevel, elements, total]);

  function pointPct(len: number): { x: number; y: number } | null {
    const { tbl, step } = pathInfo;
    if (total <= 0 || tbl.length < 2) return null;
    const f = clampN(len, 0, total) / step;
    const i = Math.min(Math.floor(f), tbl.length - 2);
    const k = f - i;
    const a = tbl[i], b = tbl[i + 1];
    return { x: ((a.x + (b.x - a.x) * k) / VB_W) * 100, y: ((a.y + (b.y - a.y) * k) / VB_H) * 100 };
  }

  // ---------------- bichos vivos + cÃ¢mera + caminhada (um Ãºnico laÃ§o) ----------------
  const bubbleIdRef = useRef<string | null>(null);
  const bubbleId = localBubble?.id ?? activeAnimalGreeting ?? null;
  useEffect(() => {
    bubbleIdRef.current = bubbleId;
  }, [bubbleId]);

  useEffect(() => {
    const stageEl = stageRef.current;
    const svg = svgRef.current;
    if (!stageEl || !svg) return;
    const wild = createWildlife(wildlifeWeatherRef.current);
    worldWildRef.current = wild;

    // O "mundo" mantÃ©m a proporÃ§Ã£o do desenho (1000x600) e COBRE o palco, como object-fit: cover.
    const measure = () => {
      const W = stageEl.clientWidth, H = stageEl.clientHeight;
      const WW = Math.max(W, (H * VB_W) / VB_H);
      const WH = (WW * VB_H) / VB_W;
      sizeRef.current = { W, H, WW, WH };
      svg.setAttribute("viewBox", `0 0 ${WW} ${WH}`);
      setStage((prev) => (prev.W === W && prev.H === H ? prev : { W, H, WW, WH }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stageEl);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { W, H, WW, WH } = sizeRef.current;
      const L = live.current;
      const path = pathRef.current;
      const world = worldRef.current;
      const cam = camRef.current;

      if (W > 0 && H > 0 && path && world && L.total > 0) {
        // 1) caminhada ao longo da curva com cinemática de montanha realista
        let w = walkRef.current;
        if (Number.isNaN(w) || !L.animate) w = L.target;
        else {
          const d = L.target - w;
          const dist = Math.abs(d);
          if (dist <= 0.35) {
            w = L.target;
          } else {
            // Aceleração suave e desaceleração progressiva ao se aproximar do objetivo
            const easeSpeed = Math.min(WALK_SPEED * 1.15, Math.max(22, Math.sqrt(dist * 135)));
            const step = easeSpeed * dt;
            w = dist <= step ? L.target : w + Math.sign(d) * step;
          }
        }
        walkRef.current = w;
        if (L.avalancheMode && !avalancheRef.current.caught) {
          const hazard = avalancheRef.current;
          hazard.len = Math.min(L.total, hazard.len + dt * 4.2);
          hazard.tick += dt;
          if (w - hazard.len <= 42 && hazard.len >= hazard.start) {
            hazard.caught = true;
            avalancheCaughtCallbackRef.current?.();
          }
          if (hazard.tick >= 0.12) {
            hazard.tick = 0;
            setAvalancheLen(hazard.len);
          }
        }
        const moving = Math.abs(L.target - w) > 0.5;
        if (moving !== movingRef.current) {
          movingRef.current = moving;
          setWalking(moving);
        }
        const p = path.getPointAtLength(clampN(w, 0, L.total));
        const pAhead = path.getPointAtLength(clampN(w + 4, 0, L.total));
        const pBehind = path.getPointAtLength(clampN(w - 4, 0, L.total));
        const tdx = pAhead.x - pBehind.x;
        const tdy = pAhead.y - pBehind.y;
        const curFacing: "left" | "right" = tdx < -0.05 ? "left" : "right";
        const curIncline = Math.min(12, Math.max(-12, (tdy / (Math.abs(tdx) + 0.001)) * 14));
        if (curFacing !== facingRef.current || Math.abs(curIncline - inclineRef.current) > 3) {
          facingRef.current = curFacing;
          inclineRef.current = curIncline;
          setStudentFacing(curFacing);
          setStudentIncline(curIncline);
        }
        const st = studentRef.current;
        if (st) {
          st.style.left = `${(p.x / VB_W) * 100}%`;
          st.style.top = `${(p.y / VB_H) * 100}%`;
        }

        // 2) cÃ¢mera: acompanha o aluno e o prÃ³ximo objeto
        const sx = (p.x / VB_W) * WW, sy = (p.y / VB_H) * WH;
        let fx = sx, fy = sy;
        let qy = -1;
        if (L.focus != null) {
          const q = path.getPointAtLength(clampN(L.focus, 0, L.total));
          fx = sx + ((q.x / VB_W) * WW - sx) * 0.45;
          fy = sy + ((q.y / VB_H) * WH - sy) * 0.45;
          qy = (q.y / VB_H) * WH;
        }
        const s = L.playing ? (pxPerUnit(W) * VB_W) / WW : 1;
        const dtx = L.playing ? clampN(W * 0.5 - fx * s, W - WW * s, 0) : (W - WW) / 2;
        let dty = L.playing ? clampN(H * 0.38 - fy * s, H - WH * s - H * 0.5, 0) : (H - WH) / 2;
        // garante espaÃ§o, acima do ponto do objeto, para o cartÃ£o com a cena inteira
        if (L.playing && L.cardH > 0 && qy >= 0) {
          const ey = dty + qy * s;
          if (ey < L.cardH) dty = Math.min(0, dty + (L.cardH - ey));
        }
        const k = 1 - Math.exp(-dt * 4.5);
        cam.s += (s - cam.s) * k;
        cam.tx += (dtx - cam.tx) * k;
        cam.ty += (dty - cam.ty) * k;
        world.style.transform = `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})`;
        world.style.setProperty("--inv", String(1 / cam.s));
      }

      // 3) bichos
      if (W > 0 && H > 0) {
        wild.step(dt, WW, WH);
        svg.innerHTML = wild.render(WW, WH);
        const b = bubbleRef.current;
        const id = bubbleIdRef.current;
        if (b) {
          const c = id ? wild.find(id) : undefined;
          if (c) {
            const p = wild.position(c, WW, WH);
            const x = Math.min(Math.max(p.x, 110), WW - 110);
            b.style.transform = `translate(${x}px, ${Math.max(p.y, 70)}px) translate(-50%, -100%) scale(${1 / cam.s})`;
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
      worldWildRef.current = null;
    };
  }, []);

  useEffect(() => {
    wildlifeWeatherRef.current = weather;
    worldWildRef.current?.setWeather(weather);
  }, [weather]);

  function handleAnimalTap(animal: TrailAnimal) {
    soundEffects.playTap();
    setLocalBubble({ id: animal.id, quote: animal.quote, name: animal.name });
    onAnimalClick?.(animal.id, animal.quote);
    setTimeout(() => {
      setLocalBubble((prev) => (prev?.id === animal.id ? null : prev));
    }, 4500);
  }

  /** Converte o ponteiro (tela) para as coordenadas do mundo (considera o zoom da cÃ¢mera). */
  function pointerPos(e: React.PointerEvent | React.MouseEvent) {
    const r = stageRef.current!.getBoundingClientRect();
    const cam = camRef.current;
    return { x: (e.clientX - r.left - cam.tx) / cam.s, y: (e.clientY - r.top - cam.ty) / cam.s };
  }
  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const wild = worldWildRef.current;
    if (!wild || !stageRef.current) return;
    const { x, y } = pointerPos(e);
    const c = wild.hit(x, y, sizeRef.current.WW, sizeRef.current.WH);
    if (c) {
      wild.poke(c);
      handleAnimalTap(c.animal);
    }
  }
  function handleMapMove(e: React.PointerEvent<HTMLDivElement>) {
    const wild = worldWildRef.current;
    if (!wild || !stageRef.current) return;
    const { x, y } = pointerPos(e);
    e.currentTarget.style.cursor = wild.hit(x, y, sizeRef.current.WW, sizeRef.current.WH) ? "pointer" : "default";
  }
  const bubbleAnimal = bubbleId ? ROAMING_ANIMAL_POOL.find((a) => a.id === bubbleId) : undefined;

  // ---------------- tamanhos que dependem da largura ----------------
  const studentPx = Math.round(clampN(stage.W * 0.14, 54, 76));
  const inv = "var(--inv, 1)";

  return (
    <div
      ref={stageRef}
      className={cn(
        "trail-mountain relative w-full max-h-[640px] rounded-3xl overflow-hidden border-2 border-[var(--border)] shadow-xl select-none transition-colors duration-1000",
        playing ? "aspect-[3/4] sm:aspect-[16/10]" : "aspect-[16/10] sm:aspect-[16/9] max-h-[580px]",
        weather === "sunny" && "bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50",
        weather === "rain" && "bg-gradient-to-b from-slate-700 via-slate-600 to-emerald-950/80",
        weather === "snow" && "bg-gradient-to-b from-slate-400 via-indigo-100 to-blue-50",
        className
      )}
    >
      {/* ================= MUNDO (sofre zoom/pan da cÃ¢mera) ================= */}
      <div
        ref={worldRef}
        className="absolute left-0 top-0"
        style={{ transformOrigin: "0 0", width: stage.WW || "100%", height: stage.WH || "100%" }}
      >
        <div
          className={cn("absolute inset-0 pointer-events-none bg-cover bg-center", weather === "rain" && "brightness-75 saturate-75", weather === "snow" && "brightness-110 saturate-50")}
          style={{ backgroundImage: "url('/trilha.jfif')" }}
          aria-hidden
        />
        {/* Sol e nuvens */}
        {weather === "sunny" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-12 w-20 h-20 rounded-full bg-amber-300 blur-sm opacity-90 animate-pulse" />
            <div className="absolute top-8 left-14 w-16 h-16 rounded-full bg-amber-400 shadow-[0_0_40px_#f59e0b]" />
            <div className="trail-cloud trail-cloud--first absolute top-8 right-20 h-14 w-44 rounded-full bg-white/70 blur-[2px]" />
            <div className="trail-cloud trail-cloud--second absolute top-16 left-1/3 h-10 w-36 rounded-full bg-white/60 blur-[2px]" />
          </div>
        )}
        {weather === "rain" && <div className="absolute -top-10 inset-x-0 h-36 pointer-events-none bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-transparent" />}
        {weather === "snow" && <div className="absolute top-0 inset-x-0 h-28 pointer-events-none bg-gradient-to-b from-slate-600/50 via-indigo-900/30 to-transparent" />}

        {/* Montanhas, encosta e trilha realista com profundidade geológica alpina */}
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-60">
          <defs>
            {/* Maciço distante com perspectiva atmosférica */}
            <linearGradient id="farPeaksGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={weather === "snow" ? "#f1f5f9" : weather === "rain" ? "#334155" : "#93c5fd"} />
              <stop offset="60%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#1e293b" : "#60a5fa"} />
              <stop offset="100%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#0f172a" : "#3b82f6"} />
            </linearGradient>

            {/* Sombras nos paredões rochosos norte do maciço */}
            <linearGradient id="farPeaksShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#0f172a" : "#1d4ed8"} stopOpacity="0.85" />
              <stop offset="100%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#020617" : "#1e3a8a"} stopOpacity="0.95" />
            </linearGradient>

            {/* Cristas e falésias da meia-montanha com estratos rochosos */}
            <linearGradient id="midMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#1e293b" : "#15803d"} />
              <stop offset="40%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#0f172a" : "#166534"} />
              <stop offset="100%" stopColor={weather === "snow" ? "#475569" : weather === "rain" ? "#022c22" : "#14532d"} />
            </linearGradient>

            {/* Encosta principal com pastagens alpinas e dobras de terreno */}
            <linearGradient id="mainSlopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={weather === "snow" ? "#f8fafc" : weather === "rain" ? "#166534" : "#22c55e"} />
              <stop offset="45%" stopColor={weather === "snow" ? "#e2e8f0" : weather === "rain" ? "#14532d" : "#16a34a"} />
              <stop offset="75%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#064e3b" : "#15803d"} />
              <stop offset="100%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#022c22" : "#14532d"} />
            </linearGradient>

            {/* Geleira e manto de neve permanente no cume */}
            <linearGradient id="summitSnowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f0f9ff" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>

            {/* Leito da trilha (terra batida + cascalho de montanha) */}
            <linearGradient id="trailEarthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#3e1f06" : "#a16207"} />
              <stop offset="50%" stopColor={weather === "snow" ? "#e2e8f0" : weather === "rain" ? "#582f0e" : "#ca8a04"} />
              <stop offset="100%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#291103" : "#854d0e"} />
            </linearGradient>

            {/* Sombra de escavação da encosta na borda da trilha */}
            <linearGradient id="trailCutShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. MACIÇO ROCHOSO DISTANTE (Picos Alpinos Afiados com Faces de Luz e Sombra) */}
          <g opacity={weather === "snow" ? 0.9 : weather === "rain" ? 0.75 : 0.88}>
            <path
              d="M-300 460 L-100 460 L60 300 L140 240 L210 320 L320 180 L440 290 L560 150 L680 270 L780 120 L890 230 L980 160 L1300 240 L1300 1200 L-300 1200 Z"
              fill="url(#farPeaksGrad)"
            />
            {/* Faces de sombra nas encostas voltadas para a esquerda/norte */}
            <path
              d="M140 240 L60 300 L140 330 Z M320 180 L210 320 L320 330 Z M560 150 L440 290 L560 310 Z M780 120 L680 270 L780 290 Z M980 160 L890 230 L980 250 Z"
              fill="url(#farPeaksShadow)"
            />
            {/* Cristas e nevados eternos nos picos do fundo */}
            <polygon points="140,240 120,270 160,270" fill="#ffffff" opacity="0.95" />
            <polygon points="320,180 295,225 345,225" fill="#ffffff" opacity="0.95" />
            <polygon points="560,150 530,205 590,205" fill="#ffffff" opacity="0.95" />
            <polygon points="780,120 745,175 815,175" fill="#ffffff" opacity="0.95" />
            <polygon points="980,160 955,200 1005,200" fill="#ffffff" opacity="0.95" />
            {/* Arestas de gelo e gretas glaciais */}
            <path d="M140 240 L135 285 M320 180 L315 240 M560 150 L555 220 M780 120 L775 190" stroke="#bae6fd" strokeWidth="1.8" opacity="0.8" />
          </g>

          {/* 2. CRISTAS MÉDIAS (Paredões de Granito, Desfiladeiros e Floresta Conífera) */}
          <path
            d="M-300 500 L-60 500 L110 370 L240 430 L390 310 L520 390 L680 230 L840 340 L970 190 L1300 280 L1300 1200 L-300 1200 Z"
            fill="url(#midMountainGrad)"
            opacity="0.92"
          />

          {/* Fissuras e estratos verticais de rocha na crista média */}
          <g stroke={weather === "snow" ? "#475569" : weather === "rain" ? "#022c22" : "#14532d"} strokeWidth="1.6" opacity="0.45" fill="none">
            <path d="M390 310 L410 380 M520 390 L535 440 M680 230 L695 320 M840 340 L855 410" />
            <path d="M380 340 L430 360 M670 270 L720 290 M830 370 L875 390" />
          </g>

          {/* Cascata alpina prateada descendo da geleira */}
          <g opacity={weather === "snow" ? 0.4 : 0.85}>
            <path
              d="M560 215 Q550 250 565 290 T555 350 T570 410"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="2.8"
              strokeDasharray="8 3"
              opacity="0.75"
            />
            <path
              d="M562 215 Q552 250 567 290 T557 350"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.4"
            />
            {/* Névoa na base da cascata */}
            <circle cx="570" cy="410" r="14" fill="#ffffff" opacity="0.25" filter="blur(3px)" />
          </g>

          {/* 3. ENCOSTA PRINCIPAL (Pastagens Alpinas, Relevo Ondulado e Curvas de Nível) */}
          <path
            d="M-300 1200 L-300 520 L0 520 Q140 460 280 400 Q440 330 600 250 Q750 170 880 70 L980 90 L1000 130 L1300 130 L1300 1200 Z"
            fill="url(#mainSlopeGrad)"
          />

          {/* Curvas de nível do terreno e dobras de pastagem */}
          <path d="M-50 560 Q130 500 270 435 Q440 365 600 285 Q750 205 880 112" fill="none" stroke={weather === "snow" ? "#ffffff" : weather === "rain" ? "#86a99c" : "#86efac"} strokeWidth="2.5" opacity="0.28" />
          <path d="M40 600 Q220 530 370 465 Q530 390 680 310 Q830 220 950 135" fill="none" stroke={weather === "snow" ? "#64748b" : weather === "rain" ? "#022c22" : "#14532d"} strokeWidth="3" opacity="0.22" />

          {/* Geleira e campo de neve no topo do cume da vitória */}
          <path d="M780 190 Q870 70 940 76 Q985 110 1000 150 L1000 310 L760 310 Z" fill="url(#summitSnowGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
          <path d="M840 140 Q900 110 970 115" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
          <path d="M820 170 Q890 145 950 155" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />

          {/* 4. PINHEIROS E CONÍFERAS ALPINAS REALISTAS (Com camadas e leve balanço) */}
          {[
            { x: 170, y: 440, s: 0.95 }, { x: 220, y: 465, s: 1.15 }, { x: 280, y: 415, s: 0.85 },
            { x: 410, y: 345, s: 0.9 }, { x: 475, y: 375, s: 1.05 }, { x: 610, y: 275, s: 0.8 },
            { x: 660, y: 295, s: 0.95 }, { x: 50, y: 565, s: 1.35 }, { x: 320, y: 525, s: 1.25 },
            { x: 550, y: 475, s: 1.15 }, { x: 740, y: 365, s: 1.05 }, { x: 860, y: 240, s: 0.75 },
          ].map((tree, i) => (
            <g key={`tree-${i}`} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`} className="trail-pine-breeze">
              {/* Sombra no solo */}
              <ellipse cx="0" cy="18" rx="14" ry="4" fill="#000000" opacity="0.25" />
              {/* Tronco robusto de pinheiro */}
              <rect x="-3.5" y="10" width="7" height="15" rx="1.5" fill="#451a03" stroke="#291103" strokeWidth="0.8" />
              {/* Copa de conífera em camadas triangulares densas */}
              <polygon points="0,-24 -18,-4 -5,-4 -22,12 22,12 5,-4 18,-4" fill={weather === "snow" ? "#334155" : "#14532d"} stroke={weather === "snow" ? "#1e293b" : "#0f381e"} strokeWidth="1" />
              <polygon points="0,-24 -13,-9 -3,-9 -16,4 16,4 3,-9 13,-9" fill={weather === "snow" ? "#475569" : "#166534"} />
              <polygon points="0,-24 -8,-14 -2,-14 -10,-3 10,-3 2,-14 8,-14" fill={weather === "snow" ? "#64748b" : "#15803d"} />
              {/* Neve acumulada nos ramos */}
              {weather === "snow" && (
                <>
                  <polygon points="0,-24 -9,-14 9,-14" fill="#ffffff" />
                  <path d="M-15 4 Q0 -2 15 4" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M-20 12 Q0 6 20 12" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
                </>
              )}
            </g>
          ))}

          {/* 5. ROCHAS DE GRANITO, TALUS E CASCALHO DA MONTANHA */}
          {[
            { x: 350, y: 395, s: 1.1 }, { x: 530, y: 305, s: 0.85 }, { x: 775, y: 172, s: 0.9 },
            { x: 190, y: 490, s: 0.95 }, { x: 670, y: 340, s: 1.0 }, { x: 825, y: 220, s: 0.8 },
          ].map((rock, idx) => (
            <g key={`rock-${idx}`} transform={`translate(${rock.x}, ${rock.y}) scale(${rock.s})`}>
              <ellipse cx="0" cy="8" rx="24" ry="6" fill="#000000" opacity="0.22" />
              {/* Rocha facetada com luz e sombra geológica */}
              <path d="M-24 8 L-16 -6 L-5 -3 L4 -16 L17 -7 L26 8 Z" fill={weather === "snow" ? "#64748b" : "#475569"} stroke={weather === "snow" ? "#475569" : "#334155"} strokeWidth="1.2" />
              <path d="M-16 -6 L-5 -3 L4 -16 L10 -5 L1 0 L-8 -1 Z" fill={weather === "snow" ? "#f8fafc" : "#94a3b8"} opacity="0.9" />
              {/* Cascalho e pedrinhas ao redor da base da rocha */}
              <circle cx="-20" cy="9" r="2.2" fill={weather === "snow" ? "#94a3b8" : "#64748b"} />
              <circle cx="22" cy="7" r="1.8" fill={weather === "snow" ? "#94a3b8" : "#64748b"} />
              <circle cx="12" cy="10" r="1.5" fill={weather === "snow" ? "#cbd5e1" : "#78716c"} />
            </g>
          ))}

          {/* 6. A TRILHA REALISTA (Corte na Encosta + Leito de Terra + Pedras de Borda + Marcação Alpina) */}
          {/* Sombra de escavação da encosta na borda da trilha */}
          <path
            d={CURIOUS_TRAIL_PATH}
            fill="none"
            stroke="rgba(45, 28, 12, 0.38)"
            strokeWidth="23"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0, 5)"
          />

          {/* Terra batida integrada à encosta, com bordas de solo exposto */}
          <path
            d={CURIOUS_TRAIL_PATH}
            fill="none"
            stroke="url(#trailEarthGrad)"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.96"
          />

          {/* Faixa central de terra mais escura, como marcas de uso real */}
          <path
            d={CURIOUS_TRAIL_PATH}
            fill="none"
            stroke={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#3f2614" : "#8b5a2b"}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />

          {/* Pedras claras e pequenas marcas no leito de terra */}
          <path
            d={CURIOUS_TRAIL_PATH}
            fill="none"
            stroke={weather === "snow" ? "#f8fafc" : weather === "rain" ? "#a8794e" : "#e7c68b"}
            strokeWidth="2"
            strokeDasharray="1 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path ref={setPathEl} d={CURIOUS_TRAIL_PATH} fill="none" stroke="transparent" strokeWidth="1" />

          {/* Contenção de encosta nas curvas fechadas (pranchas de madeira rústica e estacas) */}
          {[
            { x: 310, y: 270, r: -22 },
            { x: 445, y: 350, r: 18 },
            { x: 555, y: 210, r: -15 },
          ].map((bar, i) => (
            <g key={`bar-${i}`} transform={`translate(${bar.x}, ${bar.y}) rotate(${bar.r})`}>
              <line x1="-16" y1="9" x2="16" y2="9" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="-12" cy="11" r="2" fill="#18181b" />
              <circle cx="12" cy="11" r="2" fill="#18181b" />
            </g>
          ))}

          {/* Totens de trilha (Cairns de pedra com marcação de trilha alpina vermelho-e-branco) */}
          {[
            { x: 190, y: 450, s: 0.8 },
            { x: 380, y: 370, s: 0.75 },
            { x: 640, y: 235, s: 0.7 },
            { x: 810, y: 150, s: 0.7 },
          ].map((cairn, i) => (
            <g key={`cairn-${i}`} transform={`translate(${cairn.x}, ${cairn.y}) scale(${cairn.s})`}>
              {/* Pilha de pedras sobrepostas (Totem / Cairn) */}
              <ellipse cx="0" cy="4" rx="14" ry="5" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <ellipse cx="-1" cy="-2" rx="11" ry="4" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              <ellipse cx="0" cy="-7" rx="8" ry="3.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
              <ellipse cx="0" cy="-11" rx="5" ry="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              {/* Marcação clássica de trilha alpina GR: Branco / Vermelho / Branco */}
              <rect x="-2.5" y="-1" width="5" height="1.8" fill="#ffffff" />
              <rect x="-2.5" y="0.8" width="5" height="1.8" fill="#dc2626" />
              <rect x="-2.5" y="2.6" width="5" height="1.8" fill="#ffffff" />
            </g>
          ))}
        </svg>

        {avalancheMode && total > 0 && (
          <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 z-[15] h-full w-full overflow-visible pointer-events-none" aria-hidden>
            <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#dbeafe" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Math.max(0, avalancheLen)} ${total}`} className="trail-avalanche-shadow" />
            <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#f8fafc" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Math.max(0, avalancheLen)} ${total}`} className="trail-avalanche-flow" />
            <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#bae6fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Math.max(0, avalancheLen)} ${total}`} opacity=".9" />
          </svg>
        )}

        {/* Bichos vivos */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 z-20" onClick={handleMapClick} onPointerMove={handleMapMove} />
        <div
          ref={bubbleRef}
          className="absolute left-0 top-0 z-30 pointer-events-none transition-opacity duration-200"
          style={{ opacity: 0, transformOrigin: "50% 100%" }}
        >
          {bubbleAnimal && (
            <div className="w-48 sm:w-56 p-2.5 bg-slate-900/95 text-white rounded-2xl shadow-xl text-xs border border-amber-400/60 animate-in fade-in zoom-in-95 relative">
              <p className="font-extrabold text-amber-400 text-[11px]">{bubbleAnimal.emoji} {bubbleAnimal.name}</p>
              <p className="mt-1 font-medium leading-snug italic text-slate-100">&ldquo;{bubbleAnimal.quote}&rdquo;</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </div>
          )}
        </div>

        {/* ---------- AS 7 ESTAÃ‡Ã•ES (ficam sobre a curva da trilha) ---------- */}
        {TRAIL_LEVELS.map((cfg) => {
          const isCurrent = cfg.level === currentLevel;
          const isUnlocked = cfg.level <= unlockedLevel;
          const isDone = completedLevels.includes(cfg.level);
          const pos = pointPct(CAMP_FRACS[cfg.level - 1] * total) ?? cfg.coord;
          const clickable = !playing && isUnlocked && !!onSelectLevel;
          return (
            <button
              type="button"
              key={cfg.level}
              onClick={() => clickable && onSelectLevel?.(cfg.level)}
              disabled={!clickable}
              aria-label={`Nível ${cfg.level}, ${cfg.name}, ${cfg.altitude} metros${isDone ? ", concluído" : isUnlocked ? ", desbloqueado" : ", bloqueado"}`}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "trail-waypoint absolute z-20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 rounded-full group",
                clickable ? "cursor-pointer" : "cursor-default",
                !isUnlocked && "opacity-60"
              )}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) scale(${inv})`, transformOrigin: "50% 50%" }}
            >
              {/* Estaca de madeira rústica e base de pedra do marco */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2 h-7 bg-amber-950/80 rounded-sm -z-10 shadow-sm" />
              <span
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-xs sm:text-sm shadow-xl transition-all duration-300 border-2",
                  isCurrent && !playing
                    ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white border-amber-200 ring-4 ring-amber-400/70 animate-pulse scale-110 shadow-amber-500/50"
                    : isDone
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-emerald-300 shadow-emerald-900/40"
                    : isUnlocked
                    ? "bg-gradient-to-br from-sky-500 to-blue-700 text-white border-sky-300 shadow-blue-900/40 group-hover:scale-105"
                    : "bg-gradient-to-br from-slate-500 to-slate-700 text-slate-300 border-slate-400 shadow-slate-900/40",
                  isCurrent && playing && "ring-4 ring-amber-400/80 scale-105"
                )}
              >
                {isDone ? <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3.5]" /> : isUnlocked ? cfg.level : <Lock className="h-3.5 w-3.5 text-white/80" />}
              </span>
              <span
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap shadow-md border pointer-events-none transition-colors",
                  isCurrent ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-300 shadow-amber-500/30" : isDone ? "bg-emerald-700/95 text-white border-emerald-400" : "bg-slate-900/85 text-slate-100 border-slate-700"
                )}
              >
                N{cfg.level}
                <span className="hidden sm:inline"> · {cfg.altitude}m</span>
              </span>
            </button>
          );
        })}

        {/* ---------- OBJETOS DO NÃVEL, NO PRÃ“PRIO MAPA ---------- */}
        {playing && total > 0 && hasCurrent && curItem && (() => {
          const pos = pointPct(elemLen(elementIndex));
          if (!pos) return null;
          const below = pos.y < 30;
          const revealed = roundState === "correct" || roundState === "reveal";

          return (
            <div
              key={curItem.id}
              className="absolute z-40 flex flex-col items-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: below
                  ? `translate(-50%, 0) translate(0, calc(10px * ${inv})) scale(${inv})`
                  : `translate(-50%, -100%) translate(0, calc(-12px * ${inv})) scale(${inv})`,
                transformOrigin: below ? "50% 0%" : "50% 100%",
              }}
            >
              {below && <span className="h-0 w-0 border-x-[7px] border-b-[9px] border-x-transparent border-b-amber-400" />}
              <div className="relative">
                <span className="absolute -inset-1.5 rounded-3xl bg-amber-400/50 blur-md animate-pulse" aria-hidden />
                <div className="relative rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 p-[4px] shadow-2xl">
                  <ObjectLens item={curItem} px={cardPx} full />
                </div>
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[11px] font-black text-amber-300 shadow">
                  {elementIndex + 1}
                </span>
              </div>
              {revealed && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSpeak?.(curItem.speak); }}
                  className={cn(
                    "mt-1.5 flex max-w-[220px] cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black text-white shadow-lg animate-in zoom-in-95",
                    roundState === "correct" ? "border-emerald-300 bg-emerald-600" : "border-amber-300 bg-amber-600"
                  )}
                >
                  <Volume2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{curItem.fr}</span>
                </button>
              )}
              {!below && <span className="h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-amber-400" />}
            </div>
          );
        })()}

        {/* ---------- O ALUNO: caminha pela curva da trilha ---------- */}
        <div ref={studentRef} className="absolute z-[35] pointer-events-none" style={{ left: `${currentCfg.coord.x}%`, top: `${currentCfg.coord.y}%` }}>
          <div style={{ transform: `translate(-50%, -88%) scale(${inv})`, transformOrigin: "50% 88%" }}>
            <CuriousTrailStudent
              hasUmbrella={currentCfg.hasUmbrella}
              hasSnowGear={currentCfg.hasSnowGear || avalancheMode}
              weather={avalancheMode ? "snow" : weather}
              isWalking={walking}
              isCheering={isCheering}
              isRaisingFlag={isRaisingFlag || (currentLevel === 7 && summitDone)}
              flagProgress={flagProgress}
              size={studentPx}
              facing={studentFacing}
              incline={studentIncline}
            />
          </div>
        </div>

        {/* ---------- BANDEIRA DA VITÃ“RIA NO CUME ---------- */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{ left: `${summitPoint.x}%`, top: `${summitPoint.y}%`, transform: `translate(-50%, -100%) scale(${inv})`, transformOrigin: "50% 100%" }}
          title="Cabana do topo · Hasteie a bandeira ao concluir o Nível 7!"
        >
          <div className="flex flex-col items-center">
            <div className="relative w-1.5 h-16 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 rounded-full shadow">
              <div className="absolute -top-2 -left-1.5 w-4 h-4 rounded-full bg-amber-400 border border-amber-600 shadow-md" />
              {(summitDone || isRaisingFlag) && (
                <div
                  className="absolute left-1.5 top-0 flex w-12 h-8 rounded-sm overflow-hidden shadow-lg border border-slate-900/20 animate-[trailFlagWiggle_2.2s_ease-in-out_infinite]"
                  style={{ transition: "top 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)", top: `${100 - flagProgress}%` }}
                >
                  <div className="w-1/3 h-full bg-[#2563eb]" />
                  <div className="w-1/3 h-full bg-[#ffffff]" />
                  <div className="w-1/3 h-full bg-[#dc2626]" />
                </div>
              )}
            </div>
            <span className="mt-1 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/50">
              🏡 Cabana
            </span>
          </div>
        </div>
      </div>

      {/* ================= CLIMA (fixo na tela, nÃ£o dÃ¡ zoom) ================= */}
      {weather === "rain" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <svg className="trail-rain-layer absolute inset-0 h-full w-full opacity-60">
            <pattern id="rainPattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
              <line x1="10" y1="0" x2="10" y2="25" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="20" x2="30" y2="45" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="50" y1="40" x2="50" y2="60" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#rainPattern)" />
          </svg>
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-900/40 to-transparent" />
        </div>
      )}
      {weather === "snow" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
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

      {/* ================= HUD SUPERIOR ================= */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-white border border-white/20 shadow-lg min-w-0">
          <span className="text-lg">{weather === "sunny" ? "☀️" : weather === "rain" ? "🌧️" : "❄️"}</span>
          <div className="leading-tight min-w-0">
            <span className="block text-xs font-black text-amber-400 truncate">
              <span style={{ color: themeColor }}>Nível {currentLevel}</span> · {currentCfg.name}
            </span>
            <span className={cn("block text-[10px] text-slate-300 font-semibold truncate", playing && "hidden sm:block")}>
              Altitude: {currentCfg.altitude} m · {weather === "sunny" ? "Ensolarado" : weather === "rain" ? "Chuva (guarda-chuva aberto!)" : "Neve e frio"}
            </span>
          </div>
        </div>

        {hudRight ?? (
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-white border border-white/20 shadow-lg text-right shrink-0">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Meta deste nível</span>
            <span className="block text-xs font-extrabold text-emerald-400">
              {currentCfg.elementCount} {currentCfg.elementCount === 1 ? "Elemento" : "Elementos"}
            </span>
          </div>
        )}
      </div>

      {/* ================= CAMADA DE JOGO (alternativas, contagem, resultados) ================= */}
      {children && <div className="absolute inset-0 z-50 pointer-events-none">{children}</div>}
    </div>
  );
}
