"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TRAIL_LEVELS, ROAMING_ANIMAL_POOL, type TrailAnimal, type TrailWeather } from "@/lib/curiousTrailData";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import { CuriousTrailStudent } from "./CuriousTrailStudent";
import { soundEffects } from "@/lib/soundEffects";
import { createWildlife, type Wildlife } from "@/lib/trailWildlife";
import { CURIOUS_TRAIL_PATH, CAMP_FRACS, MARKER_FRACS, WORLD_W, WORLD_H, HUT_DOOR, HUT_POSITION } from "@/lib/curiousTrailGeometry";
import { renderAvalancheSvg, avalancheShake } from "@/lib/trailAvalanche";
import { Check, Lock, Volume2 } from "lucide-react";

export type TrailRoundState = "asking" | "correct" | "retry" | "reveal";

/** Estado "ao vivo" da avalanche (escrito pelo jogo, lido a cada quadro pelo mapa). */
export interface AvalancheLive {
  active: boolean;
  /** posição da frente (fração da trilha) no instante `stamp` */
  front: number;
  /** velocidade atual (fração da trilha por segundo) */
  vel: number;
  stamp: number;
  danger: number;
}

export interface CuriousTrailMountainProps {
  currentLevel: number; // 1 a 7
  unlockedLevel: number; // 1 a 7
  completedLevels: number[];
  onSelectLevel?: (level: number) => void;
  /** Modo JOGO: os objetos do nível aparecem no próprio mapa, ao longo da trilha. Sem `elements`, é a prévia do lobby. */
  elements?: CestQuoiItem[];
  elementIndex?: number;
  roundState?: TrailRoundState;
  /** true depois do último objeto do nível: o aluno segue até a próxima estação. */
  levelFinished?: boolean;
  avalancheMode?: boolean;
  onAvalancheCaught?: () => void;
  isCheering?: boolean;
  /** Nível 7 concluído: o aluno entra feliz na casinha do cume. */
  enterHouse?: boolean;
  activeAnimalGreeting?: string | null;
  onAnimalClick?: (animalId: string, quote: string) => void;
  onSpeak?: (text: string) => void;
  themeColor?: string;
  className?: string;
  /** Avalanche (modo extra depois do Nativo). */
  avalancheRef?: React.MutableRefObject<AvalancheLive>;
  /** Conteúdo de tela (HUD direito, alternativas, contagem...), fixo sobre o mapa. */
  hudRight?: React.ReactNode;
  children?: React.ReactNode;
}

// ---------- Geometria do mundo (RETRATO: 1000 x 2201, a arte da mata) ----------
const VB_W = WORLD_W;
const VB_H = WORLD_H;
/** Velocidade da caminhada em unidades do mundo por segundo. */
const WALK_SPEED = 150;
/** Zoom da câmera durante o jogo, relativo ao mundo cobrindo a largura do palco. */
const PLAY_ZOOM = 1.55;
/** Imagem da mata (arte do cenário). */
export const TRAIL_SCENE_SRC = "/trilha/mata-trilha.jpg";

const clampN = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Filtro aplicado à arte conforme o clima (mesma receita usada no vídeo). */
const WEATHER_FILTER: Record<TrailWeather, string> = {
  sunny: "none",
  rain: "saturate(0.7) brightness(0.7) contrast(1.06)",
  snow: "saturate(0.3) brightness(1.14) contrast(0.94)",
};

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
 * Cenário vivo da Trilha Curiosa: a mata pintada (arte vertical), o caminho de terra, as 7 estações, o
 * clima (sol, chuva, neve), os bichos da mata reagindo ao aluno e a avalanche do modo extra.
 *
 * No modo jogo toda a dinâmica acontece aqui dentro: a câmera acompanha o aluno, os objetos do tema
 * aparecem como medalhões com a ilustração isolada, e a cada acerto o aluno CAMINHA pela curva do
 * caminho até o próximo ponto. No fim da trilha ele entra feliz na casinha do cume.
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
  enterHouse = false,
  activeAnimalGreeting,
  onAnimalClick,
  onSpeak,
  themeColor = "#3b82f6",
  className,
  avalancheRef,
  hudRight,
  children,
}: CuriousTrailMountainProps) {
  const currentCfg = TRAIL_LEVELS.find((l) => l.level === currentLevel) || TRAIL_LEVELS[0];
  const weather: TrailWeather = avalancheMode ? "snow" : currentCfg.weather;
  const playing = !!elements;
  const summitDone = completedLevels.includes(7);
  const [localBubble, setLocalBubble] = useState<{ id: string; quote: string; name: string } | null>(null);

  // ---------------- medidas, trilha e posições ----------------
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const studentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const avSvgRef = useRef<SVGSVGElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const worldWildRef = useRef<Wildlife | null>(null);
  const wildlifeWeatherRef = useRef(weather);
  const sizeRef = useRef({ W: 0, H: 0, WW: 0, WH: 0 });
  const camRef = useRef({ tx: 0, ty: 0, s: 1 });
  const walkRef = useRef<number>(Number.NaN);
  const movingRef = useRef(false);
  const panRef = useRef(0);
  const dragRef = useRef<{ y0: number; pan0: number; moved: boolean } | null>(null);
  const [stage, setStage] = useState({ W: 0, H: 0, WW: 0, WH: 0 });
  const [walking, setWalking] = useState(false);
  const [avalancheLen, setAvalancheLen] = useState(0);
  const avalancheChaseRef = useRef({ len: 0, start: 0, caught: false, tick: 0 });
  const avalancheCaughtCallbackRef = useRef(onAvalancheCaught);
  useEffect(() => { avalancheCaughtCallbackRef.current = onAvalancheCaught; }, [onAvalancheCaught]);
  const [studentFacing, setStudentFacing] = useState<"left" | "right">("right");
  const [studentIncline, setStudentIncline] = useState<number>(0);
  const facingRef = useRef<"left" | "right">("right");
  const inclineRef = useRef<number>(0);

  // Tabela de pontos da trilha (1 amostra a cada 3 unidades), calculada quando o <path> entra na tela.
  const [pathInfo, setPathInfo] = useState<{ total: number; step: number; tbl: { x: number; y: number }[] }>({
    total: 0,
    step: 3,
    tbl: [],
  });
  const setPathEl = useCallback((el: SVGPathElement | null) => {
    pathRef.current = el;
    if (!el) return;
    const t = el.getTotalLength();
    const step = 3;
    const tbl: { x: number; y: number }[] = [];
    for (let l = 0; l <= t + step; l += step) {
      const pt = el.getPointAtLength(Math.min(l, t));
      tbl.push({ x: pt.x, y: pt.y });
    }
    setPathInfo({ total: t, step, tbl });
  }, []);
  const total = pathInfo.total;
  const curItem = elements?.[elementIndex];
  const maxCardHeight = clampN(stage.H * 0.42, 120, 300);
  const itemAspect = curItem && curItem.h > 0 ? curItem.w / curItem.h : 1;
  const cardPx = Math.round(Math.min(clampN(stage.W * 0.46, 140, 250), maxCardHeight * itemAspect));
  const cardHeight = curItem ? Math.round((cardPx * curItem.h) / curItem.w) + 70 : 70;

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
  const focusBelow = focusLen != null && ((pointPct(focusLen)?.y ?? 50) / 100) * VB_H < 320;

  // espelhos para o laço de animação (evita recriar o requestAnimationFrame a cada render)
  const live = useRef({ target: 0, focus: null as number | null, playing: false, animate: true, total: 0, cardH: 0, avalancheMode: false });
  useEffect(() => {
    live.current = { target: targetLen, focus: focusLen, playing, animate: playing, total, cardH: focusLen != null && !focusBelow ? cardHeight : 0, avalancheMode };
  });
  const avRef = useRef(avalancheRef);
  useEffect(() => {
    avRef.current = avalancheRef;
  });

  useEffect(() => {
    const start = CAMP_FRACS[currentLevel - 1] * total;
    avalancheChaseRef.current = { len: start - 115, start, caught: false, tick: 0 };
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

  // ---------------- bichos vivos + câmera + caminhada + avalanche (um único laço) ----------------
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

    // O "mundo" mantém a proporção da arte (1000 x 2201) e COBRE a largura do palco.
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
    const t0 = last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const tSec = (now - t0) / 1000;
      const { W, H, WW, WH } = sizeRef.current;
      const L = live.current;
      const path = pathRef.current;
      const world = worldRef.current;
      const cam = camRef.current;
      let studentFrac: { x: number; y: number } | null = null;

      if (W > 0 && H > 0 && path && world && L.total > 0) {
        // 1) caminhada ao longo da curva
        let w = walkRef.current;
        if (Number.isNaN(w) || !L.animate) w = L.target;
        else {
          const d = L.target - w;
          const dist = Math.abs(d);
          if (dist <= 0.35) {
            w = L.target;
          } else {
            const easeSpeed = Math.min(WALK_SPEED * 1.15, Math.max(30, Math.sqrt(dist * 320)));
            const step = easeSpeed * dt;
            w = dist <= step ? L.target : w + Math.sign(d) * step;
          }
        }
        walkRef.current = w;
        if (L.avalancheMode && !avalancheChaseRef.current.caught) {
          const hazard = avalancheChaseRef.current;
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
        const pAhead = path.getPointAtLength(clampN(w + 6, 0, L.total));
        const pBehind = path.getPointAtLength(clampN(w - 6, 0, L.total));
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
        studentFrac = { x: p.x / VB_W, y: p.y / VB_H };

        // 2) câmera: acompanha o aluno e o próximo objeto (no lobby, a estação atual + arrastar)
        const sx = (p.x / VB_W) * WW, sy = (p.y / VB_H) * WH;
        wild.setFocus(p.x / VB_W, p.y / VB_H);
        let fx = sx, fy = sy;
        let qy = -1;
        if (L.focus != null) {
          const q = path.getPointAtLength(clampN(L.focus, 0, L.total));
          fx = sx + ((q.x / VB_W) * WW - sx) * 0.45;
          fy = sy + ((q.y / VB_H) * WH - sy) * 0.45;
          qy = (q.y / VB_H) * WH;
        }
        if (!L.playing) fy += (panRef.current / VB_H) * WH;
        const s = L.playing ? PLAY_ZOOM : 1;
        const dtx = clampN(W * 0.5 - fx * s, W - WW * s, 0);
        let dty = clampN(H * (L.playing ? 0.42 : 0.5) - fy * s, H - WH * s, 0);
        if (L.playing && L.cardH > 0 && qy >= 0) {
          const ey = dty + qy * s;
          if (ey < L.cardH) dty = Math.min(0, dty + (L.cardH - ey));
        }
        const k = 1 - Math.exp(-dt * 4.5);
        cam.s += (s - cam.s) * k;
        cam.tx += (dtx - cam.tx) * k;
        cam.ty += (dty - cam.ty) * k;

        // 3) avalanche: tremor de câmera + desenho da onda de neve
        const av = avRef.current?.current;
        let shakeX = 0, shakeY = 0;
        if (av && av.active && avSvgRef.current) {
          const front = av.front + (av.vel * (performance.now() - av.stamp)) / 1000;
          const sh = avalancheShake(tSec, av.danger);
          shakeX = sh.dx;
          shakeY = sh.dy;
          avSvgRef.current.innerHTML = renderAvalancheSvg(front, tSec, av.danger);
          if (vignetteRef.current) vignetteRef.current.style.opacity = String(Math.min(0.85, av.danger * av.danger * 0.9));
        } else {
          if (avSvgRef.current && avSvgRef.current.firstChild) avSvgRef.current.innerHTML = "";
          if (vignetteRef.current) vignetteRef.current.style.opacity = "0";
        }
        world.style.transform = `translate(${cam.tx + shakeX}px, ${cam.ty + shakeY}px) scale(${cam.s})`;
        world.style.setProperty("--inv", String(1 / cam.s));
      }

      // 4) bichos
      if (W > 0 && H > 0) {
        wild.step(dt, WW, WH, studentFrac);
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

  // ao mudar de nível o mapa volta a seguir a estação (zera o arrasto do lobby)
  useEffect(() => {
    panRef.current = 0;
  }, [currentLevel, playing]);

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
    if (dragRef.current?.moved) return;
    const wild = worldWildRef.current;
    if (!wild || !stageRef.current) return;
    const { x, y } = pointerPos(e);
    const c = wild.hit(x, y, sizeRef.current.WW, sizeRef.current.WH);
    if (c) {
      wild.poke(c);
      handleAnimalTap(c.animal);
    }
  }
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (playing) return;
    dragRef.current = { y0: e.clientY, pan0: panRef.current, moved: false };
  }
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const wild = worldWildRef.current;
    const d = dragRef.current;
    if (d && !playing) {
      const dy = e.clientY - d.y0;
      if (Math.abs(dy) > 6) d.moved = true;
      const ppu = (camRef.current.s * sizeRef.current.WW) / VB_W;
      panRef.current = clampN(d.pan0 - dy / ppu, -VB_H, VB_H);
    }
    if (!wild || !stageRef.current) return;
    const { x, y } = pointerPos(e);
    e.currentTarget.style.cursor = wild.hit(x, y, sizeRef.current.WW, sizeRef.current.WH) ? "pointer" : playing ? "default" : "grab";
  }
  function handlePointerUp() {
    // mantém "moved" por um instante para o clique de arrasto não acionar o bicho
    const d = dragRef.current;
    if (d) setTimeout(() => { if (dragRef.current === d) dragRef.current = null; }, 60);
  }
  const bubbleAnimal = bubbleId ? ROAMING_ANIMAL_POOL.find((a) => a.id === bubbleId) : undefined;

  // ---------------- tamanhos que dependem da largura ----------------
  const studentPx = Math.round(clampN(stage.W * 0.14, 54, 76));
  const inv = "var(--inv, 1)";
  const hutPct = { x: (HUT_POSITION.x / VB_W) * 100, y: (HUT_POSITION.y / VB_H) * 100 };
  const doorPct = { x: (HUT_DOOR.x / VB_W) * 100, y: (HUT_DOOR.y / VB_H) * 100 };

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "trail-mountain relative mx-auto w-full max-w-[560px] max-h-[760px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[var(--border)] shadow-xl select-none touch-pan-x bg-emerald-950",
        className
      )}
    >
      {/* ================= MUNDO (sofre zoom/pan da câmera) ================= */}
      <div
        ref={worldRef}
        className="absolute left-0 top-0"
        style={{ transformOrigin: "0 0", width: stage.WW || "100%", height: stage.WH || "100%" }}
      >
        {/* A mata: arte do cenário, com o clima aplicado por cima (filtro + névoa/geada) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={TRAIL_SCENE_SRC}
          alt=""
          draggable={false}
          className="trail-scene-img absolute inset-0 h-full w-full pointer-events-none"
          style={{ filter: WEATHER_FILTER[weather] }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-[1200ms]"
          style={{
            opacity: weather === "sunny" ? 0 : 1,
            background:
              weather === "rain"
                ? "linear-gradient(180deg, rgba(30,48,66,0.5) 0%, rgba(55,78,92,0.28) 55%, rgba(30,50,60,0.32) 100%)"
                : "linear-gradient(180deg, rgba(214,228,255,0.5) 0%, rgba(232,241,255,0.34) 60%, rgba(255,255,255,0.28) 100%)",
          }}
        />
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="trail-water-life absolute inset-0 z-[4] h-full w-full pointer-events-none"
          aria-hidden
        >
          <g className="trail-water-ripple">
            <ellipse cx="482" cy="597" rx="19" ry="5" />
          </g>
          <g className="trail-water-ripple trail-water-ripple--late">
            <ellipse cx="482" cy="597" rx="12" ry="3" />
          </g>
          <g className="trail-water-ripple trail-water-ripple--wide">
            <ellipse cx="813" cy="1574" rx="22" ry="6" />
          </g>
          <g className="trail-water-ripple trail-water-ripple--late">
            <ellipse cx="813" cy="1574" rx="13" ry="3.5" />
          </g>
          <g className="trail-water-ripple trail-water-ripple--wide">
            <ellipse cx="328" cy="2114" rx="18" ry="5" />
          </g>
        </svg>
        {/* Trilha coberta de neve / molhada (o desenho da trilha é o mesmo caminho do jogo) */}
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full pointer-events-none overflow-visible">
          {weather === "snow" && (
            <>
              <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#ffffff" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#eaf2ff" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60 70" opacity="0.7" />
            </>
          )}
          {weather === "rain" && <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#7fa7c4" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22 120" opacity="0.45" />}
          <path ref={setPathEl} d={CURIOUS_TRAIL_PATH} fill="none" stroke="transparent" strokeWidth="1" />
        </svg>
        {avalancheMode && total > 0 && (
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 z-[15] h-full w-full overflow-visible pointer-events-none" aria-hidden>
            <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#dbeafe" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Math.max(0, avalancheLen)} ${total}`} className="trail-avalanche-shadow" />
            <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#f8fafc" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Math.max(0, avalancheLen)} ${total}`} className="trail-avalanche-flow" />
            <path d={CURIOUS_TRAIL_PATH} fill="none" stroke="#bae6fd" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Math.max(0, avalancheLen)} ${total}`} opacity=".9" />
          </svg>
        )}

        {/* Bichos vivos */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 z-20" onClick={handleMapClick} />
        <div
          ref={bubbleRef}
          className="absolute left-0 top-0 z-30 pointer-events-none transition-opacity duration-200"
          style={{ opacity: 0, transformOrigin: "50% 100%" }}
        >
          {bubbleAnimal && (
            <div className="w-48 sm:w-56 p-2.5 bg-slate-900/95 text-white rounded-2xl shadow-xl text-xs border border-amber-400/60 animate-in fade-in zoom-in-95 relative">
              <p className="font-extrabold text-amber-400 text-[11px]">{bubbleAnimal.emoji} {bubbleAnimal.namePt}</p>
              <p className="mt-1 font-medium leading-snug italic text-slate-100">&ldquo;{bubbleAnimal.quote}&rdquo;</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </div>
          )}
        </div>

        {/* Avalanche (onda de neve que persegue o aluno) */}
        <svg
          ref={avSvgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full z-[38] pointer-events-none overflow-visible"
          aria-hidden
        />

        {/* ---------- AS 7 ESTAÇÕES (ficam sobre a curva da trilha) ---------- */}
        {TRAIL_LEVELS.map((cfg) => {
          const isCurrent = cfg.level === currentLevel;
          const isUnlocked = cfg.level <= unlockedLevel;
          const isDone = completedLevels.includes(cfg.level);
          const pos = pointPct(MARKER_FRACS[cfg.level - 1] * total);
          if (!pos) return null;
          const clickable = !playing && isUnlocked && !!onSelectLevel;
          return (
            <button
              type="button"
              key={cfg.level}
              onClick={() => clickable && !dragRef.current?.moved && onSelectLevel?.(cfg.level)}
              disabled={!clickable}
              aria-label={`Nível ${cfg.level}, ${cfg.name}, ${cfg.altitude} metros${isDone ? ", concluído" : isUnlocked ? ", desbloqueado" : ", bloqueado"}`}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "trail-waypoint absolute z-20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 rounded-full group",
                clickable ? "cursor-pointer" : "cursor-default",
                !isUnlocked && "opacity-70"
              )}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) scale(${inv})`, transformOrigin: "50% 50%" }}
            >
              <span
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-black text-xs sm:text-sm shadow-xl transition-all duration-300 border-2",
                  isCurrent && !playing
                    ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white border-amber-200 ring-4 ring-amber-400/70 animate-pulse scale-110 shadow-amber-500/50"
                    : isDone
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-emerald-300 shadow-emerald-900/40"
                    : isUnlocked
                    ? "bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900 border-white shadow-amber-900/40 group-hover:scale-105"
                    : "bg-gradient-to-br from-slate-500 to-slate-700 text-slate-300 border-slate-400 shadow-slate-900/40",
                  isCurrent && playing && "ring-4 ring-amber-400/80 scale-105"
                )}
              >
                {isDone ? <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3.5]" /> : isUnlocked ? cfg.level : <Lock className="h-3.5 w-3.5 text-white/80" />}
              </span>
              <span
                className={cn(
                  "absolute top-1/2 left-full ml-1.5 -translate-y-1/2 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap shadow-md border pointer-events-none transition-colors",
                  isCurrent ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-300" : isDone ? "bg-emerald-700/95 text-white border-emerald-400" : "bg-[#14193d]/90 text-slate-100 border-slate-600"
                )}
              >
                {cfg.name} · {cfg.altitude.toLocaleString("pt-BR")}m
              </span>
            </button>
          );
        })}

        {/* ---------- CASINHA DO CUME: o aluno entra feliz quando termina a trilha ---------- */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{ left: `${hutPct.x}%`, top: `${hutPct.y}%`, transform: `translate(-50%, -100%) scale(${inv})`, transformOrigin: "50% 100%" }}
        >
          <span className="mb-6 block whitespace-nowrap rounded-full border border-amber-300/70 bg-[#14193d]/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-lg">
            🏠 Casinha do Cume
          </span>
        </div>
        <div
          className={cn("absolute z-[21] pointer-events-none rounded-full transition-opacity duration-700", enterHouse || summitDone ? "opacity-100 trail-house-glow" : "opacity-0")}
          style={{ left: `${doorPct.x}%`, top: `${doorPct.y}%`, width: 46, height: 46, transform: `translate(-50%, -60%) scale(${inv})`, background: "radial-gradient(circle, rgba(255,226,140,0.95) 0%, rgba(255,200,90,0.5) 40%, rgba(255,200,90,0) 70%)" }}
        />

        {/* ---------- OBJETOS DO NÍVEL, NO PRÓPRIO MAPA ---------- */}
        {playing && total > 0 && hasCurrent && curItem && (() => {
          const pos = pointPct(elemLen(elementIndex));
          if (!pos) return null;
          const below = (pos.y / 100) * VB_H < 320;
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

        {/* ---------- O ALUNO: caminha pela curva da trilha e, no fim, entra na casinha ---------- */}
        <div ref={studentRef} className="absolute z-[35] pointer-events-none" style={{ left: "0%", top: "0%" }}>
          <div
            style={{
              transform: `translate(-50%, -88%) scale(calc(${inv} * ${enterHouse ? 0.45 : 1}))`,
              transformOrigin: "50% 88%",
              opacity: enterHouse ? 0 : 1,
              transition: "opacity 1.1s ease-in 0.5s, transform 1.4s ease-in",
            }}
          >
            <CuriousTrailStudent
              hasUmbrella={currentCfg.hasUmbrella}
              hasSnowGear={currentCfg.hasSnowGear || avalancheMode}
              weather={avalancheMode ? "snow" : weather}
              isWalking={walking}
              isCheering={isCheering}
              size={studentPx}
              facing={studentFacing}
              incline={studentIncline}
            />
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
      {/* aviso visual da avalanche: bordas geladas pulsando conforme o perigo */}
      <div
        ref={vignetteRef}
        className="trail-avalanche-vignette absolute inset-0 z-[12] pointer-events-none"
        style={{ opacity: 0, background: "radial-gradient(ellipse at center, rgba(255,255,255,0) 45%, rgba(190,215,255,0.75) 100%)" }}
      />

      {/* ================= HUD SUPERIOR ================= */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-white border border-white/20 shadow-lg min-w-0">
          <span className="text-lg">{weather === "sunny" ? "�˜€️" : weather === "rain" ? "�ŸŒ�️" : "�„️"}</span>
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

      {!playing && (
        <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-slate-900/70 px-3 py-1 text-[10px] font-bold text-slate-200 backdrop-blur pointer-events-none">
          ↕ Arraste para explorar a mata
        </div>
      )}

      {/* ================= CAMADA DE JOGO (alternativas, contagem, resultados) ================= */}
      {children && <div className="absolute inset-0 z-50 pointer-events-none">{children}</div>}
    </div>
  );
}
