"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TRAIL_LEVELS, ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import { CuriousTrailStudent } from "./CuriousTrailStudent";
import { soundEffects } from "@/lib/soundEffects";
import { createWildlife, type Wildlife } from "@/lib/trailWildlife";
import { Check, Lock, Volume2 } from "lucide-react";

export type TrailRoundState = "asking" | "correct" | "retry" | "reveal";

export interface CuriousTrailMountainProps {
  currentLevel: number; // 1 a 7
  unlockedLevel: number; // 1 a 7
  completedLevels: number[];
  onSelectLevel?: (level: number) => void;
  /**
   * Modo JOGO: os objetos do nível aparecem no próprio mapa, ao longo da trilha, e o aluno
   * caminha pela curva do caminho a cada acerto. Sem `elements`, o mapa é só a prévia do lobby.
   */
  elements?: CestQuoiItem[];
  elementIndex?: number;
  roundState?: TrailRoundState;
  /** true depois do último objeto do nível: o aluno segue até a próxima estação. */
  levelFinished?: boolean;
  isCheering?: boolean;
  isRaisingFlag?: boolean;
  flagProgress?: number; // 0..100
  activeAnimalGreeting?: string | null;
  onAnimalClick?: (animalId: string, quote: string) => void;
  onSpeak?: (text: string) => void;
  themeColor?: string;
  className?: string;
  /** Conteúdo de tela (HUD direito, alternativas, contagem...), fixo sobre o mapa. */
  hudRight?: React.ReactNode;
  children?: React.ReactNode;
}

// ---------- Geometria da trilha (mesma curva de sempre, em um viewBox 1000x600) ----------
const PATH_D = "M 120 504 Q 190 460 260 420 T 440 348 T 320 264 T 560 204 T 740 132 T 880 60";
const VB_W = 1000;
const VB_H = 600;
/** Velocidade da caminhada em unidades do viewBox por segundo. */
const WALK_SPEED = 70;

/**
 * Posição (fração 0..1 do comprimento da trilha) onde fica cada acampamento.
 * O trecho de cada nível é proporcional à quantidade de objetos, assim o aluno
 * sempre tem o mesmo espaço entre um objeto e outro. Índice 0..6 = níveis 1..7, índice 7 = cume.
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

/** Recorte do objeto no cenário original, com a seta vermelha apontando para ele. */
function ObjectLens({ item, px, ring, full = false }: { item: CestQuoiItem; px: number; ring?: string; full?: boolean }) {
  // full: mostra a cena inteira (o objeto nunca fica cortado); senão, miniatura circular recortada na seta
  const cw = Math.min(item.w, item.h) * 0.5;
  const x0 = full ? 0 : clampN(item.arrow.x - cw / 2, 0, item.w - cw);
  const y0 = full ? 0 : clampN(item.arrow.y - cw / 2, 0, item.h - cw);
  const vw = full ? item.w : cw;
  const vh = full ? item.h : cw;
  const arrowScale = full ? 0.9 : 0.55;
  return (
    <svg
      viewBox={`${x0} ${y0} ${vw} ${vh}`}
      width={px}
      height={full ? Math.round((px * item.h) / item.w) : px}
      className={cn("block bg-white", full ? "rounded-xl" : "rounded-full", ring)}
      aria-hidden
    >
      <image href={item.scene} x={0} y={0} width={item.w} height={item.h} preserveAspectRatio="none" />
      <g className="cq-sway">
        <g transform={`translate(${item.arrow.x} ${item.arrow.y}) rotate(25) scale(${arrowScale})`}>
          <path
            d="M-90 -10 L-40 -10 L-45 -25 L0 0 L-45 25 L-40 10 L-90 10 Z"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth={full ? 5 : 7}
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

/**
 * Cenário vivo da Trilha Curiosa: montanha, trilha sinuosa, 7 acampamentos, clima, bichos e o aluno.
 *
 * No modo jogo toda a dinâmica acontece aqui dentro: a câmera acompanha o aluno, os objetos do tema
 * aparecem como medalhões na trilha (com a seta vermelha), e a cada acerto o aluno CAMINHA pela curva
 * do caminho até o próximo ponto. As alternativas e o cronômetro são desenhados por cima, como `children`.
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
  const weather: TrailWeather = currentCfg.weather;
  const playing = !!elements;
  const summitDone = completedLevels.includes(7);
  const [localBubble, setLocalBubble] = useState<{ id: string; quote: string; name: string } | null>(null);

  // ---------------- medidas, trilha e posições ----------------
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const studentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const worldWildRef = useRef<Wildlife | null>(null);
  const sizeRef = useRef({ W: 0, H: 0, WW: 0, WH: 0 });
  const camRef = useRef({ tx: 0, ty: 0, s: 1 });
  const walkRef = useRef<number>(Number.NaN);
  const movingRef = useRef(false);
  const [stage, setStage] = useState({ W: 0, H: 0, WW: 0, WH: 0 });
  const [walking, setWalking] = useState(false);

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
  const cardPx = Math.round(clampN(stage.W * 0.36, 150, 250)); // cena do objeto atual
  const curItem = elements?.[elementIndex];
  const cardHeight = Math.round(cardPx * ((curItem?.h ?? 350) / (curItem?.w ?? 490))) + 70;

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

  // espelhos para o laço de animação (evita recriar o requestAnimationFrame a cada render)
  const live = useRef({ target: 0, focus: null as number | null, playing: false, animate: true, total: 0, cardH: 0 });
  useEffect(() => {
    live.current = { target: targetLen, focus: focusLen, playing, animate: playing, total, cardH: focusLen != null && !focusBelow ? cardHeight : 0 };
  });

  function pointPct(len: number): { x: number; y: number } | null {
    const { tbl, step } = pathInfo;
    if (total <= 0 || tbl.length < 2) return null;
    const f = clampN(len, 0, total) / step;
    const i = Math.min(Math.floor(f), tbl.length - 2);
    const k = f - i;
    const a = tbl[i], b = tbl[i + 1];
    return { x: ((a.x + (b.x - a.x) * k) / VB_W) * 100, y: ((a.y + (b.y - a.y) * k) / VB_H) * 100 };
  }

  // ---------------- bichos vivos + câmera + caminhada (um único laço) ----------------
  const bubbleIdRef = useRef<string | null>(null);
  const bubbleId = localBubble?.id ?? activeAnimalGreeting ?? null;
  useEffect(() => {
    bubbleIdRef.current = bubbleId;
  }, [bubbleId]);

  useEffect(() => {
    const stageEl = stageRef.current;
    const svg = svgRef.current;
    if (!stageEl || !svg) return;
    const wild = createWildlife();
    worldWildRef.current = wild;

    // O "mundo" mantém a proporção do desenho (1000x600) e COBRE o palco, como object-fit: cover.
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
        // 1) caminhada ao longo da curva
        let w = walkRef.current;
        if (Number.isNaN(w) || !L.animate) w = L.target;
        else {
          const d = L.target - w;
          const step = WALK_SPEED * dt;
          w = Math.abs(d) <= step ? L.target : w + Math.sign(d) * step;
        }
        walkRef.current = w;
        const moving = Math.abs(L.target - w) > 0.5;
        if (moving !== movingRef.current) {
          movingRef.current = moving;
          setWalking(moving);
        }
        const p = path.getPointAtLength(clampN(w, 0, L.total));
        const st = studentRef.current;
        if (st) {
          st.style.left = `${(p.x / VB_W) * 100}%`;
          st.style.top = `${(p.y / VB_H) * 100}%`;
        }

        // 2) câmera: acompanha o aluno e o próximo objeto
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
        // garante espaço, acima do ponto do objeto, para o cartão com a cena inteira
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

  function handleAnimalTap(animal: TrailAnimal) {
    soundEffects.playTap();
    setLocalBubble({ id: animal.id, quote: animal.quote, name: animal.name });
    onAnimalClick?.(animal.id, animal.quote);
    setTimeout(() => {
      setLocalBubble((prev) => (prev?.id === animal.id ? null : prev));
    }, 4500);
  }

  /** Converte o ponteiro (tela) para as coordenadas do mundo (considera o zoom da câmera). */
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
  const lensPx = Math.round(clampN(stage.W * 0.19, 76, 124)); // miniaturas

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
      {/* ================= MUNDO (sofre zoom/pan da câmera) ================= */}
      <div
        ref={worldRef}
        className="absolute left-0 top-0"
        style={{ transformOrigin: "0 0", width: stage.WW || "100%", height: stage.WH || "100%" }}
      >
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

        {/* Montanhas, encosta e trilha (o desenho continua além da borda de baixo para a câmera poder descer) */}
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="farPeaksGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={weather === "snow" ? "#e2e8f0" : weather === "rain" ? "#334155" : "#93c5fd"} />
              <stop offset="100%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#1e293b" : "#bfdbfe"} />
            </linearGradient>
            <linearGradient id="midMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#1e293b" : "#4ade80"} />
              <stop offset="100%" stopColor={weather === "snow" ? "#64748b" : weather === "rain" ? "#0f172a" : "#16a34a"} />
            </linearGradient>
            <linearGradient id="mainSlopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={weather === "snow" ? "#f1f5f9" : weather === "rain" ? "#14532d" : "#22c55e"} />
              <stop offset="60%" stopColor={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#064e3b" : "#15803d"} />
              <stop offset="100%" stopColor={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#022c22" : "#166534"} />
            </linearGradient>
            <linearGradient id="summitSnowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>

          <path d="M-300 450 L0 450 L140 280 L280 430 L450 210 L620 400 L760 170 L910 320 L1000 240 L1300 240 L1300 1200 L-300 1200 Z" fill="url(#farPeaksGrad)" opacity="0.75" />
          <polygon points="450,210 410,260 490,260" fill="#ffffff" opacity="0.9" />
          <polygon points="760,170 720,230 800,230" fill="#ffffff" opacity="0.9" />
          <path d="M410 260 L450 210 L490 260 L470 250 L450 238 L430 253 Z" fill="#cbd5e1" opacity=".8" />
          <path d="M720 230 L760 170 L800 230 L780 216 L760 200 L742 222 Z" fill="#cbd5e1" opacity=".8" />

          <path d="M-300 480 L0 480 L180 320 L360 460 L580 260 L780 420 L940 220 L1000 270 L1300 270 L1300 1200 L-300 1200 Z" fill="url(#midMountainGrad)" opacity="0.85" />

          <path d="M-300 1200 L-300 480 L0 480 Q150 440 280 380 Q450 310 600 240 Q750 160 880 70 L980 90 L1000 130 L1300 130 L1300 1200 Z" fill="url(#mainSlopeGrad)" />
          <path d="M0 525 Q150 475 280 420 Q450 350 600 278 Q750 198 880 108" fill="none" stroke={weather === "snow" ? "#fff" : weather === "rain" ? "#86a99c" : "#86efac"} strokeWidth="2" opacity=".24" />
          <path d="M80 590 Q260 510 390 450 T680 320 T940 150" fill="none" stroke={weather === "snow" ? "#64748b" : weather === "rain" ? "#052e24" : "#14532d"} strokeWidth="3" opacity=".18" />

          <path d="M800 180 Q880 70 940 80 Q980 120 1000 160 L1000 280 L760 300 Z" fill="url(#summitSnowGrad)" stroke="#94a3b8" strokeWidth="1.5" />

          {[
            { x: 180, y: 440, s: 0.9 }, { x: 230, y: 460, s: 1.1 }, { x: 270, y: 410, s: 0.8 },
            { x: 420, y: 340, s: 0.85 }, { x: 490, y: 370, s: 1.0 }, { x: 620, y: 270, s: 0.75 }, { x: 670, y: 290, s: 0.9 },
            { x: 60, y: 560, s: 1.3 }, { x: 330, y: 520, s: 1.2 }, { x: 560, y: 470, s: 1.1 }, { x: 760, y: 360, s: 1.0 },
          ].map((tree, i) => (
            <g key={i} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`}>
              <rect x="-3" y="15" width="6" height="12" fill="#78350f" />
              <polygon points="0,-18 -16,0 -4,0 -20,18 20,18 4,0 16,0" fill={weather === "snow" ? "#475569" : "#14532d"} />
              {weather === "snow" && (
                <>
                  <polygon points="0,-18 -8,-7 8,-7" fill="#ffffff" />
                  <path d="M-13 5 Q0 0 13 5" fill="none" stroke="#fff" strokeWidth="2" opacity=".9" />
                </>
              )}
            </g>
          ))}

          {[{ x: 360, y: 390, s: 1 }, { x: 540, y: 300, s: 0.75 }, { x: 790, y: 168, s: 0.85 }].map((rock) => (
            <g key={`${rock.x}-${rock.y}`} transform={`translate(${rock.x}, ${rock.y}) scale(${rock.s})`} opacity={weather === "snow" ? 0.75 : 0.9}>
              <path d="M-22 9 L-14 -4 L-5 -2 L4 -13 L15 -5 L23 9 Z" fill={weather === "snow" ? "#94a3b8" : "#64748b"} />
              <path d="M-14 -4 L-5 -2 L4 -13 L8 -3 L1 1 L-7 0 Z" fill={weather === "snow" ? "#f8fafc" : "#cbd5e1"} opacity=".8" />
            </g>
          ))}

          {/* A TRILHA: terra batida + pedrinhas */}
          <path d={PATH_D} fill="none" stroke={weather === "snow" ? "#cbd5e1" : weather === "rain" ? "#582f0e" : "#fef08a"} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <path ref={setPathEl} d={PATH_D} fill="none" stroke={weather === "snow" ? "#94a3b8" : weather === "rain" ? "#3e1f06" : "#ca8a04"} strokeWidth="3" strokeDasharray="6 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

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

        {/* ---------- AS 7 ESTAÇÕES (ficam sobre a curva da trilha) ---------- */}
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
                "trail-waypoint absolute z-20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 rounded-full",
                clickable ? "cursor-pointer" : "cursor-default",
                !isUnlocked && "opacity-60"
              )}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) scale(${inv})`, transformOrigin: "50% 50%" }}
            >
              <span
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-xs sm:text-sm shadow-lg transition-transform",
                  isCurrent && !playing
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-4 ring-amber-300/80 animate-pulse"
                    : isDone
                    ? "bg-emerald-500 text-white border-2 border-white"
                    : isUnlocked
                    ? "bg-blue-600 text-white border-2 border-white"
                    : "bg-slate-400 text-slate-200 border-2 border-slate-300",
                  isCurrent && playing && "ring-4 ring-amber-300/80"
                )}
              >
                {isDone ? <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" /> : isUnlocked ? cfg.level : <Lock className="h-3.5 w-3.5 text-white/80" />}
              </span>
              <span
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap shadow-sm border pointer-events-none",
                  isCurrent ? "bg-amber-500 text-white border-amber-300" : isDone ? "bg-emerald-600/90 text-white border-emerald-400" : "bg-slate-900/80 text-slate-100 border-slate-700"
                )}
              >
                N{cfg.level}
                <span className="hidden sm:inline"> · {cfg.altitude}m</span>
              </span>
            </button>
          );
        })}

        {/* ---------- OBJETOS DO NÍVEL, NO PRÓPRIO MAPA ---------- */}
        {playing &&
          total > 0 &&
          elements!.map((item, i) => {
            const pos = pointPct(elemLen(i));
            if (!pos) return null;
            const done = levelFinished || i < elementIndex;
            const current = !levelFinished && i === elementIndex;
            const below = pos.y < 30; // perto do topo: o medalhão abre para baixo
            const small = Math.round(lensPx * 0.38);

            if (current) {
              const revealed = roundState === "correct" || roundState === "reveal";
              return (
                <div
                  key={item.id}
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
                      <ObjectLens item={item} px={cardPx} full />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[11px] font-black text-amber-300 shadow">
                      {i + 1}
                    </span>
                  </div>
                  {revealed && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onSpeak?.(item.speak); }}
                      className={cn(
                        "mt-1.5 flex max-w-[220px] cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black text-white shadow-lg animate-in zoom-in-95",
                        roundState === "correct" ? "border-emerald-300 bg-emerald-600" : "border-amber-300 bg-amber-600"
                      )}
                    >
                      <Volume2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.fr}</span>
                    </button>
                  )}
                  {!below && <span className="h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-amber-400" />}
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="absolute z-30 pointer-events-none"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scale(${inv})`,
                  transformOrigin: "50% 50%",
                }}
                title={done ? item.fr : undefined}
              >
                {done ? (
                  <div className="relative rounded-full border-2 border-emerald-400 bg-white shadow-md">
                    <ObjectLens item={item} px={small} />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-emerald-500">
                      <Check className="h-2.5 w-2.5 text-white stroke-[4]" />
                    </span>
                  </div>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-white/80 bg-slate-900/45 text-[11px] font-black text-white/90 shadow">
                    ?
                  </span>
                )}
              </div>
            );
          })}

        {/* ---------- O ALUNO: caminha pela curva da trilha ---------- */}
        <div ref={studentRef} className="absolute z-[35] pointer-events-none" style={{ left: `${currentCfg.coord.x}%`, top: `${currentCfg.coord.y}%` }}>
          <div style={{ transform: `translate(-50%, -88%) scale(${inv})`, transformOrigin: "50% 88%" }}>
            <CuriousTrailStudent
              weather={weather}
              hasUmbrella={currentCfg.hasUmbrella}
              hasSnowGear={currentCfg.hasSnowGear}
              isWalking={walking}
              isCheering={isCheering}
              isRaisingFlag={isRaisingFlag || (currentLevel === 7 && summitDone)}
              flagProgress={flagProgress}
              size={studentPx}
            />
          </div>
        </div>

        {/* ---------- BANDEIRA DA VITÓRIA NO CUME ---------- */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{ right: "3%", top: "3%", transform: `scale(${inv})`, transformOrigin: "100% 0%" }}
          title="Cume da Vitória · Hasteie a bandeira ao passar no Nível 7!"
        >
          <div className="flex flex-col items-center">
            <div className="relative w-1.5 h-16 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 rounded-full shadow">
              <div className="absolute -top-2 -left-1.5 w-4 h-4 rounded-full bg-amber-400 border border-amber-600 shadow-md" />
              {(summitDone || isRaisingFlag) && (
                <div
                  className="absolute left-1.5 top-0 flex w-12 h-8 rounded-sm overflow-hidden shadow-lg border border-slate-900/20 animate-[wiggle_2s_ease-in-out_infinite]"
                  style={{ transition: "top 1.2s ease-out", top: `${100 - flagProgress}%` }}
                >
                  <div className="w-1/3 h-full bg-[#2563eb]" />
                  <div className="w-1/3 h-full bg-[#ffffff]" />
                  <div className="w-1/3 h-full bg-[#dc2626]" />
                </div>
              )}
            </div>
            <span className="mt-1 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/50">
              🏔️ Cume
            </span>
          </div>
        </div>
      </div>

      {/* ================= CLIMA (fixo na tela, não dá zoom) ================= */}
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
              Altitude: {currentCfg.altitude}m · {weather === "sunny" ? "Ensolarado" : weather === "rain" ? "Chuva (guarda-chuva aberto!)" : "Neve e frio"}
            </span>
          </div>
        </div>

        {hudRight ?? (
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-white border border-white/20 shadow-lg text-right shrink-0">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Meta deste Nível</span>
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
