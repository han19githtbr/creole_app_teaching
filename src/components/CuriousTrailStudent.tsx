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
}

/**
 * Personagem animado do aluno explorador da Trilha Curiosa.
 * - Anda ritmadamente na montanha com mochila e bastão de caminhada
 * - Abre guarda-chuva amarelo/vermelho na chuva (níveis 4 e 5)
 * - Veste gorro com pompom e cachecol na neve (níveis 6 e 7)
 * - Comemora e sobe a bandeira da vitória no cume (nível 7)
 */
export function CuriousTrailStudent({
  weather,
  hasUmbrella = false,
  hasSnowGear = false,
  isWalking = false,
  isCheering = false,
  isRaisingFlag = false,
  size = 80,
  className,
  flagProgress = 100,
}: CuriousTrailStudentProps) {
  // Ajuste de largura e altura mantendo proporção
  const w = size;
  const h = size * 1.15;

  const showUmbrella = hasUmbrella && weather === "rain";
  const showSnowGear = hasSnowGear && weather === "snow";

  return (
    <div
      className={cn("relative inline-block select-none pointer-events-none", className)}
      style={{ width: w, height: h }}
      aria-label="Aluno curioso na trilha da montanha"
    >
      <svg
        viewBox="0 0 120 140"
        className={cn(
          "w-full h-full filter drop-shadow-md",
          isWalking && "animate-[bounce_0.6s_ease-in-out_infinite]"
        )}
      >
        <defs>
          {/* Gradiente da Boina Francesa */}
          <linearGradient id="beretGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Gradiente do Gorro de Inverno */}
          <linearGradient id="beanieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Gradiente do Guarda-chuva */}
          <linearGradient id="umbrellaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Gradiente da Jaqueta */}
          <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Gradiente da Mochila */}
          <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
        </defs>

        {/* ---------------- Sombra no solo ---------------- */}
        <ellipse cx="60" cy="132" rx="22" ry="5" fill="#000" opacity="0.25" />

        {/* ---------------- Efeito de passos / poça / neve ---------------- */}
        {isWalking && weather === "rain" && (
          <g opacity="0.7">
            <ellipse cx="50" cy="132" rx="10" ry="2" fill="#38bdf8" />
            <circle cx="42" cy="128" r="1.5" fill="#bae6fd" />
            <circle cx="70" cy="130" r="1.5" fill="#bae6fd" />
          </g>
        )}
        {isWalking && weather === "snow" && (
          <g opacity="0.8">
            <ellipse cx="52" cy="132" rx="9" ry="3" fill="#ffffff" />
            <circle cx="44" cy="130" r="2" fill="#e0f2fe" />
          </g>
        )}

        {/* ---------------- Mochila de trilha (nas costas) ---------------- */}
        <g transform="translate(32, 60)">
          <rect x="0" y="0" width="16" height="28" rx="6" fill="url(#backpackGrad)" stroke="#7c2d12" strokeWidth="1.5" />
          <rect x="-2" y="6" width="6" height="14" rx="3" fill="#ea580c" />
          {/* Se não estiver com guarda-chuva aberto, mostra o guarda-chuva amarrado na mochila */}
          {!showUmbrella && (
            <path d="M-4 2 L-6 26" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          )}
          {/* Rolo de esteira / saco de dormir no topo da mochila */}
          <rect x="-1" y="-5" width="18" height="6" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1" />
        </g>

        {/* ---------------- Pernas e Botas de caminhada ---------------- */}
        {/* Perna traseira (esquerda) */}
        <g className={isWalking ? "animate-[spin_1.2s_linear_infinite_alternate]" : ""}>
          <line x1="52" y1="94" x2="48" y2="120" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
          {/* Bota */}
          <path d="M42 120 L54 120 L56 128 L38 128 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
        </g>

        {/* Perna dianteira (direita) */}
        <g className={isWalking ? "animate-[spin_1.2s_linear_infinite_alternate-reverse]" : ""}>
          <line x1="68" y1="94" x2="72" y2="120" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
          {/* Bota */}
          <path d="M66 120 L78 120 L80 128 L62 128 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
        </g>

        {/* ---------------- Tronco / Jaqueta ---------------- */}
        <rect x="44" y="58" width="32" height="38" rx="10" fill="url(#jacketGrad)" stroke="#1e40af" strokeWidth="2" />
        {/* Zíper da jaqueta */}
        <line x1="60" y1="58" x2="60" y2="94" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" />

        {/* ---------------- Braço Traseiro / Bastão de caminhada ---------------- */}
        {!isRaisingFlag && !isCheering && (
          <g>
            {/* Bastão de montanha */}
            <line x1="38" y1="72" x2="34" y2="128" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="38" cy="72" r="3" fill="#1e293b" />
            <circle cx="34" cy="122" r="4" fill="#64748b" />
          </g>
        )}

        {/* ---------------- Cabeça e Rosto ---------------- */}
        <circle cx="60" cy="42" r="16" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
        {/* Bochechas coradas */}
        <circle cx="52" cy="46" r="3.2" fill="#f87171" opacity="0.6" />
        <circle cx="68" cy="46" r="3.2" fill="#f87171" opacity="0.6" />

        {/* Olhos alegres */}
        {isCheering || isRaisingFlag ? (
          // Olhos piscando de alegria (^ ^)
          <g stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M51 40 Q54 36 57 40" />
            <path d="M63 40 Q66 36 69 40" />
          </g>
        ) : (
          <g fill="#1f2937">
            <circle cx="54" cy="40" r="2.2" />
            <circle cx="66" cy="40" r="2.2" />
            {/* Brilho nos olhos */}
            <circle cx="55" cy="39" r="0.8" fill="#ffffff" />
            <circle cx="67" cy="39" r="0.8" fill="#ffffff" />
          </g>
        )}

        {/* Sorriso simpático */}
        <path d="M55 47 Q60 52 65 47" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />

        {/* ---------------- Cobertura de Cabeça: Boina ou Gorro ---------------- */}
        {showSnowGear ? (
          // Gorro de inverno vermelho com dobra branca e pompom
          <g>
            {/* Faixa branca de lã */}
            <rect x="42" y="27" width="36" height="9" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Cúpula do gorro */}
            <path d="M45 28 C45 14 75 14 75 28 Z" fill="url(#beanieGrad)" stroke="#7f1d1d" strokeWidth="1.5" />
            {/* Pompom felpudo branco */}
            <circle cx="60" cy="14" r="5.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            {/* Cachecol quente de inverno */}
            <g>
              <rect x="44" y="52" width="32" height="9" rx="4" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              {/* Ponta solta do cachecol esvoaçando */}
              <path d="M64 56 C74 58 78 68 76 76" fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
              <path d="M64 56 C74 58 78 68 76 76" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          </g>
        ) : (
          // Boina francesa estilosa azul-marinho
          <g>
            <ellipse cx="60" cy="28" rx="20" ry="7" fill="url(#beretGrad)" stroke="#172554" strokeWidth="1.5" />
            <path d="M43 27 C46 19 72 17 76 27 Z" fill="url(#beretGrad)" />
            {/* Rabicho da boina */}
            <line x1="60" y1="21" x2="60" y2="16" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ---------------- Braço Dianteiro & Guarda-chuva ou Celebração ---------------- */}
        {showUmbrella ? (
          // ALUNO SEGURANDO GUARDA-CHUVA ABERTO (Níveis 4 e 5)
          <g>
            {/* Braço segurando o cabo */}
            <path d="M68 66 Q80 64 78 48" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
            {/* Mão */}
            <circle cx="78" cy="46" r="3.5" fill="#fde047" />

            {/* Haste metálica do guarda-chuva */}
            <line x1="78" y1="48" x2="78" y2="10" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            {/* Cabo curvo na ponta inferior */}
            <path d="M78 48 Q78 55 73 54" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />

            {/* Cúpula do guarda-chuva aberto */}
            <g transform="translate(78, 12)">
              {/* Tecido aberto em arco */}
              <path
                d="M-36 6 Q0 -22 36 6 Q24 0 12 6 Q0 0 -12 6 Q-24 0 -36 6 Z"
                fill="url(#umbrellaGrad)"
                stroke="#b91c1c"
                strokeWidth="2"
              />
              {/* Ponta superior metálica */}
              <line x1="0" y1="-12" x2="0" y2="-17" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              {/* Gotas de chuva batendo e espirrando na cúpula */}
              <g className="animate-pulse">
                <circle cx="-18" cy="-8" r="1.5" fill="#67e8f9" />
                <circle cx="16" cy="-6" r="1.5" fill="#67e8f9" />
                <path d="M-20 -10 L-22 -14" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" />
                <path d="M18 -8 L22 -12" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" />
              </g>
            </g>
          </g>
        ) : isRaisingFlag ? (
          // ALUNO HASTEANDO A BANDEIRA NO CUME (Nível 7)
          <g>
            {/* Braços estendidos segurando a corda do mastro */}
            <path d="M68 68 L82 50" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
            <path d="M52 68 L76 46" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
            <circle cx="82" cy="50" r="3.5" fill="#fde047" />
            <circle cx="76" cy="46" r="3.5" fill="#fde047" />

            {/* Mastro da Bandeira cravado na montanha */}
            <g transform="translate(94, 0)">
              {/* Haste de madeira/metal dourada */}
              <line x1="0" y1="-20" x2="0" y2="132" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="-20" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />

              {/* Bandeira subindo conforme flagProgress */}
              {/* Posição Y da bandeira calculada a partir de flagProgress (0..100) */}
              {(() => {
                const minY = -18;
                const maxY = 65;
                const flagY = maxY - ((maxY - minY) * Math.min(100, Math.max(0, flagProgress))) / 100;
                return (
                  <g transform={`translate(2, ${flagY})`} className="animate-[wiggle_1.5s_ease-in-out_infinite]">
                    {/* Bandeira Tricolor Francesa 🇫🇷 (Azul, Branco, Vermelho) */}
                    <rect x="0" y="0" width="10" height="20" fill="#2563eb" />
                    <rect x="10" y="0" width="10" height="20" fill="#ffffff" />
                    <rect x="20" y="0" width="10" height="20" fill="#dc2626" />
                    {/* Borda e cordão */}
                    <rect x="0" y="0" width="30" height="20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="0" y1="0" x2="-2" y2="0" stroke="#f1f5f9" strokeWidth="1.5" />
                    <line x1="0" y1="20" x2="-2" y2="20" stroke="#f1f5f9" strokeWidth="1.5" />
                    {/* Brilhos de vitória */}
                    <text x="32" y="14" fontSize="11" fill="#f59e0b" fontWeight="bold">✨</text>
                  </g>
                );
              })()}
            </g>
          </g>
        ) : isCheering ? (
          // ALUNO COMEMORANDO COM BRAÇOS PARA O ALTO
          <g>
            <path d="M68 66 Q84 48 88 34" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
            <path d="M46 66 Q34 48 30 34" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
            <circle cx="88" cy="34" r="3.5" fill="#fde047" />
            <circle cx="30" cy="34" r="3.5" fill="#fde047" />
          </g>
        ) : (
          // Braço normal em postura de caminhada
          <g>
            <path d="M68 66 Q76 78 72 88" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
            <circle cx="72" cy="88" r="3.5" fill="#fde047" />
          </g>
        )}
      </svg>
    </div>
  );
}
