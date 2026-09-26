export type ParticleKind =
  | "none"
  | "rain"
  | "snow"
  | "leaves"
  | "confetti"
  | "fireflies"
  | "bubbles"
  | "steam"
  | "sparks"
  | "clouds";

export interface ParticleConfig {
  kind: ParticleKind;
  count?: number;
  colors?: string[];
}

export interface VideoBackgroundTheme {
  id: string;
  name: string;
  gradient: string;
  badge: string;
  textColor: string;
  /** Cor sólida aproximada do tema, usada em contextos que não suportam gradiente (ex: partículas CSS do player). */
  accentColor: string;
  /** Categoria usada para agrupar/rotular os temas na UI. */
  category: "estudio" | "tema";
  /** Configuração de partículas animadas (chuva, neve, confete, etc.) desenhadas por cima do canvasBg. */
  particles?: ParticleConfig;
  /** Pinta o fundo no canvas. Recebe `time` (ms, geralmente Date.now()) para permitir animação contínua,
   * já que o canvas é redesenhado a cada frame tanto na pré-visualização quanto durante a gravação —
   * ou seja, a animação fica "queimada" no vídeo exportado também. */
  canvasBg: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void;
}

export interface VideoAvatarPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  avatarSvg: string;
  drawAvatar: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    isSpeaking: boolean,
    audioLevel?: number
  ) => void;
}

/* ------------------------------------------------------------------ */
/* Utilidades de animação                                              */
/* ------------------------------------------------------------------ */

// Pseudo-aleatório determinístico (mesma partícula sempre nasce no mesmo
// lugar): evita "piscar"/re-embaralhar a cada frame, como aconteceria com
// Math.random() puro.
function seededRandom(i: number, salt = 0): number {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Desenha uma camada de partículas animadas (chuva, neve, folhas, confete,
 * vaga-lumes, bolhas, vapor, faíscas ou nuvens) sobre o fundo já pintado.
 * Compartilhada por todos os temas para manter o mesmo "motor" de animação.
 */
export function drawThemeParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  particles?: ParticleConfig
) {
  if (!particles || particles.kind === "none") return;
  const { kind, count = 36, colors = ["#ffffff"] } = particles;
  const t = time / 1000;

  ctx.save();

  if (kind === "rain") {
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1.4;
    for (let i = 0; i < count; i++) {
      const speed = 480 + seededRandom(i) * 260;
      const len = 14 + seededRandom(i, 2) * 12;
      const y = ((t * speed + seededRandom(i, 3) * height) % (height + len)) - len;
      const x = seededRandom(i, 1) * (width + 40) - 20 + (y / height) * 24;
      ctx.globalAlpha = 0.25 + seededRandom(i, 4) * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 7, y + len);
      ctx.stroke();
    }
  } else if (kind === "snow") {
    ctx.fillStyle = colors[0];
    for (let i = 0; i < count; i++) {
      const speed = 26 + seededRandom(i) * 38;
      const size = 1.4 + seededRandom(i, 2) * 2.6;
      const baseX = seededRandom(i, 1) * width;
      const sway = Math.sin(t * 0.8 + i) * 18;
      const y = ((t * speed + seededRandom(i, 3) * height) % (height + 20)) - 10;
      ctx.globalAlpha = 0.45 + seededRandom(i, 4) * 0.5;
      ctx.beginPath();
      ctx.arc(baseX + sway, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === "leaves") {
    for (let i = 0; i < count; i++) {
      const speed = 22 + seededRandom(i) * 24;
      const size = 5 + seededRandom(i, 2) * 5;
      const baseX = seededRandom(i, 1) * width;
      const sway = Math.sin(t * 0.6 + i * 1.3) * 32;
      const y = ((t * speed + seededRandom(i, 3) * height) % (height + 20)) - 10;
      const rot = t * (0.5 + seededRandom(i, 5)) + i;
      ctx.save();
      ctx.translate(baseX + sway, y);
      ctx.rotate(rot);
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else if (kind === "confetti") {
    for (let i = 0; i < count; i++) {
      const speed = 55 + seededRandom(i) * 55;
      const size = 4 + seededRandom(i, 2) * 4;
      const baseX = seededRandom(i, 1) * width;
      const sway = Math.sin(t * 1.4 + i) * 24;
      const y = ((t * speed + seededRandom(i, 3) * height) % (height + 20)) - 10;
      const rot = t * (2 + seededRandom(i, 5) * 3) + i;
      ctx.save();
      ctx.translate(baseX + sway, y);
      ctx.rotate(rot);
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(-size / 2, -size / 3, size, size * 0.66);
      ctx.restore();
    }
  } else if (kind === "fireflies") {
    for (let i = 0; i < count; i++) {
      const baseX = seededRandom(i, 1) * width;
      const baseY = seededRandom(i, 2) * height;
      const driftX = Math.sin(t * 0.4 + i) * 22;
      const driftY = Math.cos(t * 0.3 + i * 1.7) * 16;
      const twinkle = 0.25 + Math.abs(Math.sin(t * 1.5 + i * 3)) * 0.75;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(baseX + driftX, baseY + driftY, 1.5 + seededRandom(i, 4) * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === "bubbles") {
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1.4;
    for (let i = 0; i < count; i++) {
      const speed = 20 + seededRandom(i) * 30;
      const size = 3 + seededRandom(i, 2) * 6;
      const baseX = seededRandom(i, 1) * width;
      const wobble = Math.sin(t * 1.1 + i) * 12;
      const y = height - ((t * speed + seededRandom(i, 3) * height) % (height + 20));
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(baseX + wobble, y, size, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (kind === "steam") {
    ctx.fillStyle = colors[0];
    for (let i = 0; i < count; i++) {
      const speed = 16 + seededRandom(i) * 14;
      const baseX = seededRandom(i, 1) * width;
      const wobble = Math.sin(t * 0.8 + i * 2) * 14;
      const cycle = (t * speed + seededRandom(i, 3) * height) % height;
      const y = height - cycle;
      ctx.globalAlpha = Math.max(0, 0.22 * (1 - cycle / height));
      ctx.beginPath();
      ctx.ellipse(baseX + wobble, y, 9 + cycle * 0.04, 5 + cycle * 0.02, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === "sparks") {
    for (let i = 0; i < count; i++) {
      const speed = 40 + seededRandom(i) * 60;
      const baseX = seededRandom(i, 1) * width;
      const cycle = (t * speed + seededRandom(i, 3) * height) % height;
      const y = height - cycle;
      ctx.globalAlpha = Math.max(0, (1 - cycle / height) * 0.85);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(baseX, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === "clouds") {
    ctx.fillStyle = colors[0];
    for (let i = 0; i < count; i++) {
      const speed = 7 + seededRandom(i) * 9;
      const baseY = seededRandom(i, 2) * height * 0.5;
      const w = 60 + seededRandom(i, 4) * 70;
      const x = ((t * speed + seededRandom(i, 1) * (width + w)) % (width + w * 2)) - w;
      ctx.globalAlpha = 0.1 + seededRandom(i, 5) * 0.1;
      ctx.beginPath();
      ctx.ellipse(x, baseY, w, w * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Temas de fundo                                                      */
/* ------------------------------------------------------------------ */

export const VIDEO_BACKGROUNDS: Record<string, VideoBackgroundTheme> = {
  haiti_flag: {
    id: "haiti_flag",
    name: "Bandeira do Haiti 🇭🇹",
    gradient: "from-[#00209F] via-[#1e1b4b] to-[#D21034]",
    badge: "bg-[#00209F]/20 text-[#60a5fa] border-[#00209F]/40",
    textColor: "#ffffff",
    accentColor: "#00209F",
    category: "estudio",
    particles: { kind: "fireflies", count: 22, colors: ["#93c5fd", "#fca5a5", "#ffffff"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#00209F");
      grad.addColorStop(0.48, "#0f172a");
      grad.addColorStop(0.52, "#180911");
      grad.addColorStop(1, "#D21034");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      for (let i = 0; i < width; i += 40) ctx.fillRect(i, 0, 1, height);
      for (let j = 0; j < height; j += 40) ctx.fillRect(0, j, width, 1);

      const pulse = 0.03 + Math.sin(time / 900) * 0.01;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
      ctx.fill();
    },
  },
  caribbean_sunset: {
    id: "caribbean_sunset",
    name: "Pôr do Sol no Caribe 🌅",
    gradient: "from-[#f97316] via-[#ec4899] to-[#6366f1]",
    badge: "bg-[#f97316]/20 text-[#fb923c] border-[#f97316]/40",
    textColor: "#ffffff",
    accentColor: "#f97316",
    category: "estudio",
    particles: { kind: "clouds", count: 6, colors: ["#fed7aa"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#1e1b4b");
      grad.addColorStop(0.3, "#701a75");
      grad.addColorStop(0.65, "#c2410c");
      grad.addColorStop(0.85, "#ea580c");
      grad.addColorStop(1, "#fbbf24");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const pulse = 0.5 + Math.sin(time / 1200) * 0.08;
      const sunGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.7,
        10,
        width * 0.5,
        height * 0.7,
        Math.min(width, height) * 0.4
      );
      sunGrad.addColorStop(0, `rgba(254, 240, 138, ${pulse})`);
      sunGrad.addColorStop(0.4, "rgba(251, 146, 60, 0.2)");
      sunGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);
    },
  },
  chalkboard: {
    id: "chalkboard",
    name: "Quadro de Sala de Aula 🧑‍🏫",
    gradient: "from-[#064e3b] via-[#022c22] to-[#042f2e]",
    badge: "bg-[#064e3b]/30 text-[#34d399] border-[#064e3b]/50",
    textColor: "#ecfdf5",
    accentColor: "#064e3b",
    category: "estudio",
    particles: { kind: "sparks", count: 14, colors: ["#e2e8f0"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, "#065f46");
      grad.addColorStop(1, "#022c22");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 14;
      ctx.strokeStyle = "#78350f";
      ctx.strokeRect(7, 7, width - 14, height - 14);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#92400e";
      ctx.strokeRect(14, 14, width - 28, height - 28);
    },
  },
  indigo_studio: {
    id: "indigo_studio",
    name: "Estúdio Moderno 🎙️",
    gradient: "from-[#312e81] via-[#1e1b4b] to-[#0f172a]",
    badge: "bg-[#4338ca]/20 text-[#a5b4fc] border-[#4338ca]/40",
    textColor: "#ffffff",
    accentColor: "#4338ca",
    category: "estudio",
    particles: { kind: "sparks", count: 16, colors: ["#a5b4fc", "#f9a8d4"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#1e1b4b");
      grad.addColorStop(0.5, "#0f172a");
      grad.addColorStop(1, "#312e81");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const light1 = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.2, height * 0.2, 300);
      light1.addColorStop(0, "rgba(99, 102, 241, 0.25)");
      light1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = light1;
      ctx.fillRect(0, 0, width, height);

      const light2 = ctx.createRadialGradient(width * 0.8, height * 0.8, 0, width * 0.8, height * 0.8, 300);
      light2.addColorStop(0, "rgba(236, 72, 153, 0.2)");
      light2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = light2;
      ctx.fillRect(0, 0, width, height);
    },
  },
  emerald_island: {
    id: "emerald_island",
    name: "Ilha Esmeralda 🌴",
    gradient: "from-[#047857] via-[#065f46] to-[#0f766e]",
    badge: "bg-[#047857]/20 text-[#6ee7b7] border-[#047857]/40",
    textColor: "#ffffff",
    accentColor: "#047857",
    category: "estudio",
    particles: { kind: "leaves", count: 12, colors: ["#34d399", "#a7f3d0"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#064e3b");
      grad.addColorStop(0.5, "#047857");
      grad.addColorStop(1, "#0f766e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    },
  },
  citadelle_gold: {
    id: "citadelle_gold",
    name: "Citadelle Laferrière 🏰",
    gradient: "from-[#854d0e] via-[#713f12] to-[#451a03]",
    badge: "bg-[#854d0e]/20 text-[#fde047] border-[#854d0e]/40",
    textColor: "#ffffff",
    accentColor: "#854d0e",
    category: "estudio",
    particles: { kind: "fireflies", count: 14, colors: ["#fde047"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#713f12");
      grad.addColorStop(0.5, "#451a03");
      grad.addColorStop(1, "#854d0e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    },
  },

  /* ---------------- Novos temas animados por assunto ---------------- */

  natureza: {
    id: "natureza",
    name: "Natureza 🌿",
    gradient: "from-[#166534] via-[#15803d] to-[#84cc16]",
    badge: "bg-[#166534]/20 text-[#86efac] border-[#166534]/40",
    textColor: "#ffffff",
    accentColor: "#22c55e",
    category: "tema",
    particles: { kind: "leaves", count: 18, colors: ["#4ade80", "#bef264", "#fbbf24"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#a3e635");
      grad.addColorStop(0.35, "#4d7c0f");
      grad.addColorStop(0.75, "#14532d");
      grad.addColorStop(1, "#052e16");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Colinas suaves estilo pintura, com leve respiração de luz
      const glow = 0.12 + Math.sin(time / 1500) * 0.03;
      ctx.fillStyle = `rgba(255, 255, 200, ${glow})`;
      ctx.beginPath();
      ctx.ellipse(width * 0.3, height * 0.15, width * 0.5, height * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(20, 83, 45, 0.85)";
      for (const [cx, cy, r] of [
        [width * 0.1, height * 0.85, width * 0.35],
        [width * 0.55, height * 0.95, width * 0.45],
        [width * 0.9, height * 0.82, width * 0.3],
      ] as [number, number, number][]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  turismo: {
    id: "turismo",
    name: "Turismo ✈️",
    gradient: "from-[#0ea5e9] via-[#38bdf8] to-[#fbbf24]",
    badge: "bg-[#0ea5e9]/20 text-[#7dd3fc] border-[#0ea5e9]/40",
    textColor: "#0f172a",
    accentColor: "#0ea5e9",
    category: "tema",
    particles: { kind: "clouds", count: 7, colors: ["#ffffff"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0ea5e9");
      grad.addColorStop(0.55, "#7dd3fc");
      grad.addColorStop(1, "#fef3c7");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Balão de ar quente flutuando
      const floatY = Math.sin(time / 1400) * 14;
      const bx = width * 0.75;
      const by = height * 0.32 + floatY;
      const br = Math.min(width, height) * 0.12;
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.ellipse(bx, by, br, br * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fde68a";
      ctx.fillRect(bx - br * 0.35, by + br * 1.05, br * 0.7, br * 0.35);
      ctx.strokeStyle = "rgba(15,23,42,0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx - br * 0.35, by + br * 0.5);
      ctx.lineTo(bx - br * 0.3, by + br * 1.05);
      ctx.moveTo(bx + br * 0.35, by + br * 0.5);
      ctx.lineTo(bx + br * 0.3, by + br * 1.05);
      ctx.stroke();

      // Skyline simples
      ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
      const buildings = 7;
      for (let i = 0; i < buildings; i++) {
        const bw = width / buildings;
        const bh = height * (0.12 + seededRandom(i) * 0.16);
        ctx.fillRect(i * bw, height - bh, bw * 0.7, bh);
      }
    },
  },
  festas: {
    id: "festas",
    name: "Festas 🎉",
    gradient: "from-[#a21caf] via-[#c026d3] to-[#f472b6]",
    badge: "bg-[#a21caf]/20 text-[#f0abfc] border-[#a21caf]/40",
    textColor: "#ffffff",
    accentColor: "#c026d3",
    category: "tema",
    particles: { kind: "confetti", count: 34, colors: ["#f472b6", "#facc15", "#60a5fa", "#34d399", "#f87171"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#4a044e");
      grad.addColorStop(0.5, "#86198f");
      grad.addColorStop(1, "#db2777");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Holofotes pulsantes
      for (const [cx, hue] of [
        [width * 0.2, "rgba(250, 204, 21, 0.25)"],
        [width * 0.8, "rgba(96, 165, 250, 0.25)"],
      ] as [number, string][]) {
        const pulse = Math.min(width, height) * (0.3 + Math.sin(time / 700 + cx) * 0.05);
        const g = ctx.createRadialGradient(cx, 0, 0, cx, 0, pulse);
        g.addColorStop(0, hue);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }
    },
  },
  hiverno: {
    id: "hiverno",
    name: "Inverno ❄️",
    gradient: "from-[#1e3a8a] via-[#3b82f6] to-[#dbeafe]",
    badge: "bg-[#1e3a8a]/20 text-[#93c5fd] border-[#1e3a8a]/40",
    textColor: "#ffffff",
    accentColor: "#3b82f6",
    category: "tema",
    particles: { kind: "snow", count: 46, colors: ["#ffffff"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0f2557");
      grad.addColorStop(0.5, "#1d4ed8");
      grad.addColorStop(1, "#93c5fd");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Montanhas nevadas
      ctx.fillStyle = "rgba(219, 234, 254, 0.35)";
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width * 0.2, height * 0.62);
      ctx.lineTo(width * 0.4, height * 0.78);
      ctx.lineTo(width * 0.6, height * 0.55);
      ctx.lineTo(width * 0.85, height * 0.75);
      ctx.lineTo(width, height * 0.65);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    },
  },
  chuva: {
    id: "chuva",
    name: "Chuva 🌧️",
    gradient: "from-[#334155] via-[#475569] to-[#64748b]",
    badge: "bg-[#334155]/30 text-[#cbd5e1] border-[#334155]/50",
    textColor: "#f1f5f9",
    accentColor: "#64748b",
    category: "tema",
    particles: { kind: "rain", count: 60, colors: ["#e2e8f0"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#1e293b");
      grad.addColorStop(0.6, "#334155");
      grad.addColorStop(1, "#475569");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Relâmpago ocasional bem sutil
      const flash = Math.max(0, Math.sin(time / 4000)) ** 40;
      if (flash > 0.02) {
        ctx.fillStyle = `rgba(226, 232, 240, ${flash * 0.4})`;
        ctx.fillRect(0, 0, width, height);
      }
    },
  },
  praia: {
    id: "praia",
    name: "Praia 🏖️",
    gradient: "from-[#06b6d4] via-[#22d3ee] to-[#fde68a]",
    badge: "bg-[#06b6d4]/20 text-[#67e8f9] border-[#06b6d4]/40",
    textColor: "#0f172a",
    accentColor: "#06b6d4",
    category: "tema",
    particles: { kind: "bubbles", count: 16, colors: ["#ffffff"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0891b2");
      grad.addColorStop(0.55, "#22d3ee");
      grad.addColorStop(0.6, "#fde68a");
      grad.addColorStop(1, "#fbbf24");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Ondas suaves animadas na linha d'água
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 3;
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const baseY = height * 0.58 + w * 10;
        for (let x = 0; x <= width; x += 12) {
          const y = baseY + Math.sin(x / 40 + time / 500 + w) * 5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
  },
  tecnologia: {
    id: "tecnologia",
    name: "Tecnologia 💻",
    gradient: "from-[#0f172a] via-[#0e7490] to-[#22d3ee]",
    badge: "bg-[#0e7490]/20 text-[#67e8f9] border-[#0e7490]/40",
    textColor: "#ffffff",
    accentColor: "#22d3ee",
    category: "tema",
    particles: { kind: "sparks", count: 26, colors: ["#22d3ee", "#a855f7"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#020617");
      grad.addColorStop(1, "#0e293f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Grade digital com leve deslocamento
      ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
      ctx.lineWidth = 1;
      const offset = (time / 60) % 40;
      for (let x = -40 + offset; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    },
  },
  aeroporto: {
    id: "aeroporto",
    name: "Aeroporto ✈️",
    gradient: "from-[#1e293b] via-[#475569] to-[#f97316]",
    badge: "bg-[#475569]/20 text-[#fdba74] border-[#475569]/40",
    textColor: "#ffffff",
    accentColor: "#f97316",
    category: "tema",
    particles: { kind: "clouds", count: 5, colors: ["#cbd5e1"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.6, "#475569");
      grad.addColorStop(1, "#f97316");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Avião atravessando o céu com rastro
      const px = ((time / 30) % (width + 200)) - 100;
      const py = height * 0.25;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 90, py + 4);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.moveTo(px, py - 4);
      ctx.lineTo(px + 22, py);
      ctx.lineTo(px, py + 4);
      ctx.lineTo(px + 6, py);
      ctx.closePath();
      ctx.fill();

      // Luzes da pista
      ctx.fillStyle = "#fbbf24";
      for (let i = 0; i < 10; i++) {
        const lx = (i / 9) * width;
        ctx.globalAlpha = 0.4 + Math.abs(Math.sin(time / 300 + i)) * 0.6;
        ctx.beginPath();
        ctx.arc(lx, height - 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  },
  gastronomia: {
    id: "gastronomia",
    name: "Gastronomia 🍲",
    gradient: "from-[#7c2d12] via-[#c2410c] to-[#fbbf24]",
    badge: "bg-[#c2410c]/20 text-[#fdba74] border-[#c2410c]/40",
    textColor: "#ffffff",
    accentColor: "#c2410c",
    category: "tema",
    particles: { kind: "steam", count: 10, colors: ["#fef3c7"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#431407");
      grad.addColorStop(0.55, "#9a3412");
      grad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Prato/tigela estilizada na base
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 1.02, width * 0.32, height * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  cinema: {
    id: "cinema",
    name: "Cinema 🎬",
    gradient: "from-[#450a0a] via-[#7f1d1d] to-[#0f172a]",
    badge: "bg-[#7f1d1d]/20 text-[#fca5a5] border-[#7f1d1d]/40",
    textColor: "#ffffff",
    accentColor: "#dc2626",
    category: "tema",
    particles: { kind: "sparks", count: 12, colors: ["#fbbf24"] },
    canvasBg: (ctx, width, height, time) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#1c0a0a");
      grad.addColorStop(0.5, "#450a0a");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Cortinas laterais estilo teatro
      ctx.fillStyle = "rgba(127, 29, 29, 0.55)";
      ctx.fillRect(0, 0, width * 0.08, height);
      ctx.fillRect(width * 0.92, 0, width * 0.08, height);

      // Holofote central pulsante
      const pulse = Math.min(width, height) * (0.35 + Math.sin(time / 900) * 0.03);
      const spot = ctx.createRadialGradient(width / 2, height * 0.4, 0, width / 2, height * 0.4, pulse);
      spot.addColorStop(0, "rgba(255, 255, 255, 0.12)");
      spot.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, width, height);
    },
  },
  cultura: {
    id: "cultura",
    name: "Cultura 🎭",
    gradient: "from-[#7e22ce] via-[#db2777] to-[#f59e0b]",
    badge: "bg-[#db2777]/20 text-[#f9a8d4] border-[#db2777]/40",
    textColor: "#ffffff",
    accentColor: "#db2777",
    category: "tema",
    particles: { kind: "confetti", count: 20, colors: ["#fbbf24", "#f472b6", "#38bdf8", "#4ade80"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#581c87");
      grad.addColorStop(0.5, "#9d174d");
      grad.addColorStop(1, "#b45309");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Faixas decorativas estilo tecido tradicional
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(width * (0.15 + i * 0.18), height * 1.05, width * 0.18, Math.PI, 0);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  },
  universidade: {
    id: "universidade",
    name: "Universidade 🎓",
    gradient: "from-[#1e293b] via-[#1e40af] to-[#facc15]",
    badge: "bg-[#1e40af]/20 text-[#93c5fd] border-[#1e40af]/40",
    textColor: "#ffffff",
    accentColor: "#1e40af",
    category: "tema",
    particles: { kind: "confetti", count: 16, colors: ["#facc15", "#93c5fd", "#ffffff"] },
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.55, "#1e3a8a");
      grad.addColorStop(1, "#1e40af");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Brasão simplificado / emblema central sutil
      ctx.strokeStyle = "rgba(250, 204, 21, 0.25)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.32, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
};

export const THEME_CATEGORIES: { id: "estudio" | "tema"; label: string }[] = [
  { id: "estudio", label: "Clássicos de Estúdio" },
  { id: "tema", label: "Temas Animados por Assunto" },
];


/* ------------------------------------------------------------------ */
/* Bonequinhos / avatares                                              */
/* ------------------------------------------------------------------ */

// Sombra de contato suave sob o busto — dá profundidade e ancora o
// personagem no fundo em vez de parecer "colado" por cima.
function drawContactShadow(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, r * 1.15, r * 0.7, r * 0.14, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.filter = "blur(2px)";
  ctx.fill();
  ctx.restore();
}

// Par de orelhas simples (elipse) atrás da cabeça, na cor de pele informada.
function drawEars(ctx: CanvasRenderingContext2D, r: number, skin: string) {
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(-r * 0.42, r * 0.02, r * 0.07, r * 0.11, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.42, r * 0.02, r * 0.07, r * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Par de sobrancelhas — leve arco que se ergue quando o personagem "fala".
function drawEyebrows(ctx: CanvasRenderingContext2D, r: number, color: string, raised: boolean) {
  const lift = raised ? r * 0.02 : 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.045;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-r * 0.24, -r * 0.14 - lift);
  ctx.quadraticCurveTo(-r * 0.15, -r * 0.19 - lift, -r * 0.06, -r * 0.15 - lift);
  ctx.moveTo(r * 0.06, -r * 0.15 - lift);
  ctx.quadraticCurveTo(r * 0.15, -r * 0.19 - lift, r * 0.24, -r * 0.14 - lift);
  ctx.stroke();
}

// Brilho especular pequeno dentro do olho — o detalhe que faz um olho
// pintado parecer "vivo" em vez de um ponto opaco.
function drawEyeHighlight(ctx: CanvasRenderingContext2D, ex: number, ey: number, r: number) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(ex, ey, r * 0.018, 0, Math.PI * 2);
  ctx.fill();
}

/* ------------------------------------------------------------------ */
/* Avatares "Você" (foto real em estilo Ghibli)                        */
/* ------------------------------------------------------------------ */

// Cache simples de <img> por URL — evita recriar/recarregar a imagem a cada
// frame (o drawAvatar roda a ~60fps). Como HTMLImageElement não existe no
// servidor, o cache só é populado no browser (checagem `typeof Image`).
const photoAvatarImageCache = new Map<string, HTMLImageElement>();

function getPhotoAvatarImage(src: string): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  let img = photoAvatarImageCache.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    photoAvatarImageCache.set(src, img);
  }
  return img;
}

// Desenha a imagem inteira dentro do quadrado [dx, dy, dSize, dSize] com
// recorte "cover" (preenche todo o quadrado, cortando o excesso), do mesmo
// jeito que `object-fit: cover` faria em HTML/CSS.
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dSize: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(dSize / iw, dSize / ih);
  const sw = dSize / scale;
  const sh = dSize / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dSize, dSize);
}

/**
 * Cria uma função `drawAvatar` para uma foto real (estilo Ghibli) do
 * professor. `mouthY` é a posição vertical aproximada da boca na foto,
 * como fração (0 a 1) da altura do quadro — usada para desenhar a "boca
 * falando" por cima da foto quando o áudio detecta fala. Como é uma foto
 * estática, a "animação de fala" é simulada com: (1) leve balanço vertical,
 * (2) anel de brilho pulsante atrás do rosto, e (3) uma pequena boca aberta
 * semi-transparente sobreposta na posição estimada — mesma linguagem visual
 * usada nos demais avatares "bonequinho" acima.
 */
function makePhotoAvatarDrawer(src: string, mouthY: number) {
  return (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    isSpeaking: boolean,
    audioLevel = 0
  ) => {
    const speaking = isSpeaking || audioLevel > 0.05;
    const r = size / 2;

    ctx.save();
    ctx.translate(x, y);

    drawContactShadow(ctx, r);

    const bounce = speaking ? Math.sin(Date.now() / 150) * 3 : 0;
    ctx.translate(0, bounce);

    // Anel de brilho pulsante quando fala (mesmo efeito dos outros avatares)
    if (speaking) {
      ctx.beginPath();
      ctx.arc(0, 0, r + 8 + audioLevel * 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99, 102, 241, 0.3)";
      ctx.fill();
    }

    // Moldura circular
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1e1b4b";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#818cf8";
    ctx.stroke();
    ctx.clip();

    const img = getPhotoAvatarImage(src);
    if (img && img.complete && img.naturalWidth > 0) {
      drawImageCover(ctx, img, -r, -r, size);

      // Boca "falando" sobreposta na posição estimada da boca na foto
      if (speaking) {
        const mouthYAbs = -r + size * mouthY;
        const openHalf = size * (0.012 + audioLevel * 0.05);
        ctx.beginPath();
        ctx.ellipse(0, mouthYAbs, size * 0.045, openHalf, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(60, 24, 24, 0.55)";
        ctx.fill();
      }
    } else {
      // Enquanto a imagem carrega (raro, já que fica em cache), mostra um
      // fundo neutro em vez de deixar o quadro em branco.
      ctx.fillStyle = "#334155";
      ctx.fillRect(-r, -r, size, size);
    }

    ctx.restore();
  };
}

export const VIDEO_AVATARS: Record<string, VideoAvatarPreset> = {
  webcam: {
    id: "webcam",
    name: "Câmera Real (Webcam)",
    description: "Usa seu vídeo ao vivo capturado pela câmera",
    icon: "📹",
    avatarSvg: "",
    drawAvatar: () => {},
  },
  you_sunset: {
    id: "you_sunset",
    name: "Você (Pôr do Sol)",
    description: "Sua foto estilo Ghibli com a Baía de Guanabara ao entardecer",
    icon: "🌅",
    avatarSvg: "/avatars/you-sunset.png",
    drawAvatar: makePhotoAvatarDrawer("/avatars/you-sunset.png", 0.56),
  },
  you_studio: {
    id: "you_studio",
    name: "Você (Estúdio)",
    description: "Sua foto estilo Ghibli, ambiente de estúdio com estante de livros",
    icon: "📚",
    avatarSvg: "/avatars/you-studio.png",
    drawAvatar: makePhotoAvatarDrawer("/avatars/you-studio.png", 0.6),
  },
  you_thinking: {
    id: "you_thinking",
    name: "Você (Pensativo)",
    description: "Sua foto estilo Ghibli em close, mão no queixo",
    icon: "🤔",
    avatarSvg: "/avatars/you-thinking.png",
    drawAvatar: makePhotoAvatarDrawer("/avatars/you-thinking.png", 0.6),
  },
  you_trail: {
    id: "you_trail",
    name: "Você (Trilha)",
    description: "Sua foto estilo Ghibli ao ar livre, com o Corcovado ao fundo",
    icon: "🏞️",
    avatarSvg: "/avatars/you-trail.png",
    drawAvatar: makePhotoAvatarDrawer("/avatars/you-trail.png", 0.62),
  },
  you_night: {
    id: "you_night",
    name: "Você (Noite)",
    description: "Sua foto estilo Ghibli em close, à beira-mar à noite",
    icon: "🌙",
    avatarSvg: "/avatars/you-night.png",
    drawAvatar: makePhotoAvatarDrawer("/avatars/you-night.png", 0.56),
  },
  you_headphones: {
    id: "you_headphones",
    name: "Você (Fones)",
    description: "Sua foto estilo Ghibli em close, com fones de ouvido",
    icon: "🎧",
    avatarSvg: "/avatars/you-headphones.png",
    drawAvatar: makePhotoAvatarDrawer("/avatars/you-headphones.png", 0.58),
  },
};

export const VIDEO_FRAME_STYLES = [
  { id: "rounded", name: "Bordas Arredondadas (Padrão)", description: "Layout de estúdio elegante" },
  { id: "circle_pip", name: "Picture-in-Picture Flutuante", description: "Avatar no canto inferior sobre o fundo" },
  { id: "split", name: "Divisão com Fundo Temático", description: "Avatar e área temática lado a lado" },
  { id: "glow", name: "Borda Iluminada Neon", description: "Contorno vibrante com brilho suave" },
  { id: "banner", name: "Estúdio com Faixa de Título", description: "Faixa inferior com o tópico da aula" },
];
