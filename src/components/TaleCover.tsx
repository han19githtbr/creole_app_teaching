"use client";

import { useEffect, useRef } from "react";
import { renderSceneArt, STAGE_H, STAGE_W } from "@/lib/tales/scene";
import type { Tale } from "@/lib/tales/tales";

/** Miniatura do conto: a cena de capa desenhada uma vez, nítida em qualquer tela. */
export function TaleCover({ tale, className }: { tale: Tale; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const s = canvas.width / STAGE_W;
    ctx.save();
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.rect(0, 0, STAGE_W, STAGE_H);
    ctx.clip();
    renderSceneArt(ctx, tale.scenes[tale.coverScene].art, 3.2, 0.5);
    ctx.restore();
  }, [tale]);
  return <canvas ref={ref} width={360} height={640} className={className} aria-label={`Capa: ${tale.title}`} />;
}
