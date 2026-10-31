"use client";

import React, { useState } from "react";
import type { CestQuoiItem } from "@/lib/cquoiContent";
import { GameDemoStudio } from "@/components/GameDemoStudio";
import { TrailDemoStudio } from "@/components/TrailDemoStudio";

export function AdminJogoVideosTabs({ items }: { items: CestQuoiItem[] }) {
  const [tab, setTab] = useState<"trail" | "classic">("trail");

  return (
    <div className="space-y-6">
      {/* SELETOR DE MÓDULOS DE VÍDEO */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] max-w-md">
        <button
          type="button"
          onClick={() => setTab("trail")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer ${
            tab === "trail"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md font-extrabold"
              : "text-[var(--text-secondary)] hover:text-[var(--text)]"
          }`}
        >
          🏔️ Trilha Curiosa
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-black uppercase">
            Novo
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab("classic")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer ${
            tab === "classic"
              ? "bg-blue-600 text-white shadow-md font-extrabold"
              : "text-[var(--text-secondary)] hover:text-[var(--text)]"
          }`}
        >
          🎯 C&apos;est quoi ? (Clássico)
        </button>
      </div>

      {tab === "trail" ? (
        <TrailDemoStudio items={items} />
      ) : (
        <GameDemoStudio items={items} />
      )}
    </div>
  );
}
