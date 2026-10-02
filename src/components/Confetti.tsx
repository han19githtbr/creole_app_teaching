"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  color: string;
  opacity: number;
  shape: "rect" | "circle";
}

const COLORS = [
  "#3b82f6", // Azul da bandeira do Haiti
  "#ef4444", // Vermelho da bandeira do Haiti
  "#f59e0b", // Dourado do brasão
  "#10b981", // Verde palmeira
  "#8b5cf6", // Roxo vibrante
  "#ec4899", // Rosa alegre
  "#ffffff", // Branco
];

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function onResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", onResize);

    const particles: Particle[] = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.3) - height * 0.1,
        w: 8 + Math.random() * 8,
        h: 4 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        angle: Math.random() * 360,
        vAngle: (Math.random() - 0.5) * 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 1,
        shape: Math.random() > 0.3 ? "rect" : "circle",
      });
    }

    let animId: number;
    const startTime = performance.now();
    const duration = 3200; // 3.2s de animação festiva

    function loop(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.vAngle;
        p.vy += 0.08; // Gravidade

        // Desvanecimento nos últimos 800ms
        if (elapsed > duration - 800) {
          p.opacity = Math.max(0, (duration - elapsed) / 800);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
