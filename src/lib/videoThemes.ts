export interface VideoBackgroundTheme {
  id: string;
  name: string;
  gradient: string;
  badge: string;
  textColor: string;
  canvasBg: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
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

export const VIDEO_BACKGROUNDS: Record<string, VideoBackgroundTheme> = {
  haiti_flag: {
    id: "haiti_flag",
    name: "Bandeira do Haiti 🇭🇹",
    gradient: "from-[#00209F] via-[#1e1b4b] to-[#D21034]",
    badge: "bg-[#00209F]/20 text-[#60a5fa] border-[#00209F]/40",
    textColor: "#ffffff",
    canvasBg: (ctx, width, height) => {
      // Top blue, bottom red gradient with central soft glow
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#00209F");
      grad.addColorStop(0.48, "#0f172a");
      grad.addColorStop(0.52, "#180911");
      grad.addColorStop(1, "#D21034");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle decorative pattern
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      for (let i = 0; i < width; i += 40) {
        ctx.fillRect(i, 0, 1, height);
      }
      for (let j = 0; j < height; j += 40) {
        ctx.fillRect(0, j, width, 1);
      }

      // Haitian Palm / Star emblem subtle glow
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fill();
    },
  },
  caribbean_sunset: {
    id: "caribbean_sunset",
    name: "Pôr do Sol no Caribe 🌅",
    gradient: "from-[#f97316] via-[#ec4899] to-[#6366f1]",
    badge: "bg-[#f97316]/20 text-[#fb923c] border-[#f97316]/40",
    textColor: "#ffffff",
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#1e1b4b");
      grad.addColorStop(0.3, "#701a75");
      grad.addColorStop(0.65, "#c2410c");
      grad.addColorStop(0.85, "#ea580c");
      grad.addColorStop(1, "#fbbf24");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Sun glow
      const sunGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.7,
        10,
        width * 0.5,
        height * 0.7,
        Math.min(width, height) * 0.4
      );
      sunGrad.addColorStop(0, "rgba(254, 240, 138, 0.6)");
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

      // Wood frame border
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
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#1e1b4b");
      grad.addColorStop(0.5, "#0f172a");
      grad.addColorStop(1, "#312e81");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Studio studio lights
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
    canvasBg: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#713f12");
      grad.addColorStop(0.5, "#451a03");
      grad.addColorStop(1, "#854d0e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    },
  },
};

export const VIDEO_AVATARS: Record<string, VideoAvatarPreset> = {
  webcam: {
    id: "webcam",
    name: "Câmera Real (Webcam)",
    description: "Usa seu vídeo ao vivo capturado pela câmera",
    icon: "📹",
    avatarSvg: "",
    drawAvatar: () => {},
  },
  prof_alex: {
    id: "prof_alex",
    name: "Prof. Alex (Bonequinho)",
    description: "Professor haitiano amigável com terno e óculos",
    icon: "👨🏿‍🏫",
    avatarSvg: "",
    drawAvatar: (ctx, x, y, size, isSpeaking, audioLevel = 0) => {
      ctx.save();
      ctx.translate(x, y);

      // Speaking bounce
      const bounce = isSpeaking ? Math.sin(Date.now() / 150) * 4 : 0;
      ctx.translate(0, bounce);

      const r = size / 2;

      // Glow halo when speaking
      if (isSpeaking || audioLevel > 0.05) {
        ctx.beginPath();
        ctx.arc(0, 0, r + 8 + audioLevel * 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.3)";
        ctx.fill();
      }

      // Outer Circle / Frame
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#1e1b4b";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#818cf8";
      ctx.stroke();
      ctx.clip();

      // Body / Suit (Haitian blue blazer)
      ctx.beginPath();
      ctx.ellipse(0, r * 0.95, r * 0.8, r * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1e3a8a";
      ctx.fill();

      // Shirt collar (white)
      ctx.beginPath();
      ctx.moveTo(-r * 0.25, r * 0.55);
      ctx.lineTo(0, r * 0.85);
      ctx.lineTo(r * 0.25, r * 0.55);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Red tie (Haitian red)
      ctx.beginPath();
      ctx.moveTo(-r * 0.08, r * 0.65);
      ctx.lineTo(r * 0.08, r * 0.65);
      ctx.lineTo(r * 0.12, r * 0.95);
      ctx.lineTo(0, r * 1.05);
      ctx.lineTo(-r * 0.12, r * 0.95);
      ctx.closePath();
      ctx.fillStyle = "#dc2626";
      ctx.fill();

      // Neck
      ctx.beginPath();
      ctx.rect(-r * 0.18, r * 0.25, r * 0.36, r * 0.35);
      ctx.fillStyle = "#5c3317";
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.05, r * 0.42, r * 0.48, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#6b3e1b";
      ctx.fill();

      // Hair
      ctx.beginPath();
      ctx.arc(0, -r * 0.2, r * 0.43, Math.PI, Math.PI * 2);
      ctx.fillStyle = "#1c1917";
      ctx.fill();

      // Eyes
      ctx.beginPath();
      ctx.arc(-r * 0.16, -r * 0.06, r * 0.06, 0, Math.PI * 2);
      ctx.arc(r * 0.16, -r * 0.06, r * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-r * 0.15, -r * 0.06, r * 0.035, 0, Math.PI * 2);
      ctx.arc(r * 0.17, -r * 0.06, r * 0.035, 0, Math.PI * 2);
      ctx.fillStyle = "#1c1917";
      ctx.fill();

      // Glasses
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#fbbf24";
      ctx.strokeRect(-r * 0.26, -r * 0.14, r * 0.2, r * 0.16);
      ctx.strokeRect(r * 0.06, -r * 0.14, r * 0.2, r * 0.16);
      ctx.beginPath();
      ctx.moveTo(-r * 0.06, -r * 0.06);
      ctx.lineTo(r * 0.06, -r * 0.06);
      ctx.stroke();

      // Nose
      ctx.beginPath();
      ctx.arc(0, r * 0.04, r * 0.05, 0, Math.PI);
      ctx.strokeStyle = "#4a2810";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mouth (animated speaking)
      ctx.beginPath();
      if (isSpeaking || audioLevel > 0.05) {
        const mouthOpen = Math.min(r * 0.15, r * 0.06 + audioLevel * 30);
        ctx.ellipse(0, r * 0.18, r * 0.14, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#450a0a";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-r * 0.08, r * 0.18 - mouthOpen * 0.7, r * 0.16, mouthOpen * 0.6);
      } else {
        ctx.arc(0, r * 0.15, r * 0.12, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.restore();
    },
  },
  prof_marie: {
    id: "prof_marie",
    name: "Profª. Marie (Bonequinha)",
    description: "Professora carismática com turbante colorido tradicional",
    icon: "👩🏿‍🏫",
    avatarSvg: "",
    drawAvatar: (ctx, x, y, size, isSpeaking, audioLevel = 0) => {
      ctx.save();
      ctx.translate(x, y);

      const bounce = isSpeaking ? Math.sin(Date.now() / 140) * 4 : 0;
      ctx.translate(0, bounce);

      const r = size / 2;

      // Glow halo when speaking
      if (isSpeaking || audioLevel > 0.05) {
        ctx.beginPath();
        ctx.arc(0, 0, r + 8 + audioLevel * 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244, 63, 94, 0.3)";
        ctx.fill();
      }

      // Outer Circle / Frame
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#2e1065";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#f43f5e";
      ctx.stroke();
      ctx.clip();

      // Body dress (vibrant red & gold)
      ctx.beginPath();
      ctx.ellipse(0, r * 0.95, r * 0.75, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#dc2626";
      ctx.fill();

      // Gold necklace
      ctx.beginPath();
      ctx.arc(0, r * 0.55, r * 0.25, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#fbbf24";
      ctx.stroke();

      // Neck
      ctx.beginPath();
      ctx.rect(-r * 0.16, r * 0.25, r * 0.32, r * 0.35);
      ctx.fillStyle = "#5c3317";
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.02, r * 0.4, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#6b3e1b";
      ctx.fill();

      // Traditional Haitian Headwrap (Maré Tèt) - blue, red & gold
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.32, r * 0.46, r * 0.32, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#0284c7";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.28, r * 0.42, r * 0.18, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#e11d48";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(r * 0.25, -r * 0.45, r * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();

      // Earrings (gold hoops)
      ctx.beginPath();
      ctx.arc(-r * 0.42, 0, r * 0.08, 0, Math.PI * 2);
      ctx.arc(r * 0.42, 0, r * 0.08, 0, Math.PI * 2);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#fbbf24";
      ctx.stroke();

      // Eyes with lashes
      ctx.beginPath();
      ctx.arc(-r * 0.15, -r * 0.04, r * 0.055, 0, Math.PI * 2);
      ctx.arc(r * 0.15, -r * 0.04, r * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-r * 0.14, -r * 0.04, r * 0.035, 0, Math.PI * 2);
      ctx.arc(r * 0.16, -r * 0.04, r * 0.035, 0, Math.PI * 2);
      ctx.fillStyle = "#26150b";
      ctx.fill();

      // Smile / Speaking mouth
      ctx.beginPath();
      if (isSpeaking || audioLevel > 0.05) {
        const mouthOpen = Math.min(r * 0.14, r * 0.05 + audioLevel * 25);
        ctx.ellipse(0, r * 0.18, r * 0.12, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#be123c";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-r * 0.07, r * 0.18 - mouthOpen * 0.6, r * 0.14, mouthOpen * 0.5);
      } else {
        ctx.arc(0, r * 0.15, r * 0.11, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.strokeStyle = "#fb7185";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.restore();
    },
  },
  ti_kreyol: {
    id: "ti_kreyol",
    name: "Ti Kreyòl (Mascote)",
    description: "Mascote alegre com chapéu de palha e sorriso contagiante",
    icon: "🌟",
    avatarSvg: "",
    drawAvatar: (ctx, x, y, size, isSpeaking, audioLevel = 0) => {
      ctx.save();
      ctx.translate(x, y);

      const bounce = isSpeaking ? Math.sin(Date.now() / 120) * 6 : 0;
      ctx.translate(0, bounce);

      const r = size / 2;

      // Glow halo
      if (isSpeaking || audioLevel > 0.05) {
        ctx.beginPath();
        ctx.arc(0, 0, r + 8 + audioLevel * 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(251, 191, 36, 0.4)";
        ctx.fill();
      }

      // Frame
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#064e3b";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fbbf24";
      ctx.stroke();
      ctx.clip();

      // Shirt (tropical floral)
      ctx.beginPath();
      ctx.ellipse(0, r * 0.95, r * 0.75, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#78350f";
      ctx.fill();

      // Straw hat
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.25, r * 0.55, r * 0.18, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#fef08a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -r * 0.35, r * 0.3, Math.PI, Math.PI * 2);
      ctx.fillStyle = "#fde047";
      ctx.fill();
      // Hat ribbon (red and blue)
      ctx.beginPath();
      ctx.rect(-r * 0.3, -r * 0.38, r * 0.6, r * 0.08);
      ctx.fillStyle = "#dc2626";
      ctx.fill();

      // Big expressive eyes
      ctx.beginPath();
      ctx.arc(-r * 0.16, -r * 0.02, r * 0.08, 0, Math.PI * 2);
      ctx.arc(r * 0.16, -r * 0.02, r * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-r * 0.14, -r * 0.02, r * 0.05, 0, Math.PI * 2);
      ctx.arc(r * 0.18, -r * 0.02, r * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = "#0284c7";
      ctx.fill();

      // Cheeks (blush)
      ctx.beginPath();
      ctx.arc(-r * 0.28, r * 0.12, r * 0.06, 0, Math.PI * 2);
      ctx.arc(r * 0.28, r * 0.12, r * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
      ctx.fill();

      // Animated mouth
      ctx.beginPath();
      if (isSpeaking || audioLevel > 0.05) {
        const mouthOpen = Math.min(r * 0.18, r * 0.08 + audioLevel * 30);
        ctx.ellipse(0, r * 0.18, r * 0.15, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#991b1b";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, r * 0.18 + mouthOpen * 0.3, r * 0.07, 0, Math.PI);
        ctx.fillStyle = "#f87171";
        ctx.fill();
      } else {
        ctx.arc(0, r * 0.14, r * 0.14, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.restore();
    },
  },
  creole_bot: {
    id: "creole_bot",
    name: "CreoleBot (Robô)",
    description: "Assistente de ensino inteligente e futurista",
    icon: "🤖",
    avatarSvg: "",
    drawAvatar: (ctx, x, y, size, isSpeaking, _audioLevel = 0) => {
      ctx.save();
      ctx.translate(x, y);

      const r = size / 2;

      // Outer Circle
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#38bdf8";
      ctx.stroke();
      ctx.clip();

      // Antenna
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.45);
      ctx.lineTo(0, -r * 0.7);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -r * 0.72, r * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = isSpeaking ? "#f43f5e" : "#38bdf8";
      ctx.fill();

      // Bot Head (rounded rectangle)
      const bw = r * 0.8;
      const bh = r * 0.65;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 16);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#38bdf8";
      ctx.stroke();

      // Screen Face
      ctx.beginPath();
      ctx.roundRect(-bw / 2 + 10, -bh / 2 + 10, bw - 20, bh - 20, 10);
      ctx.fillStyle = "#020617";
      ctx.fill();

      // LED Eyes
      ctx.beginPath();
      ctx.arc(-r * 0.18, -r * 0.06, r * 0.07, 0, Math.PI * 2);
      ctx.arc(r * 0.18, -r * 0.06, r * 0.07, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();

      // LED Sound Wave Mouth
      ctx.lineWidth = 3;
      ctx.strokeStyle = isSpeaking ? "#22c55e" : "#38bdf8";
      ctx.beginPath();
      const waveBars = 5;
      for (let i = 0; i < waveBars; i++) {
        const bx = -r * 0.2 + (i * r * 0.4) / (waveBars - 1);
        const height = isSpeaking ? Math.abs(Math.sin(Date.now() / 100 + i)) * r * 0.15 + 4 : 4;
        ctx.moveTo(bx, r * 0.12 - height / 2);
        ctx.lineTo(bx, r * 0.12 + height / 2);
      }
      ctx.stroke();

      ctx.restore();
    },
  },
  cartoon_scholar: {
    id: "cartoon_scholar",
    name: "Mestre Acadêmico (Cartoon)",
    description: "Professor sábio com capelo de formatura",
    icon: "🎓",
    avatarSvg: "",
    drawAvatar: (ctx, x, y, size, isSpeaking, audioLevel = 0) => {
      ctx.save();
      ctx.translate(x, y);

      const r = size / 2;

      // Frame
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#1e1b4b";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fbbf24";
      ctx.stroke();
      ctx.clip();

      // Capelo (Graduation Hat)
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.lineTo(r * 0.45, -r * 0.65);
      ctx.lineTo(0, -r * 0.45);
      ctx.lineTo(-r * 0.45, -r * 0.65);
      ctx.closePath();
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fbbf24";
      ctx.stroke();

      // Tassel
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.65);
      ctx.lineTo(r * 0.35, -r * 0.5);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(0, -r * 0.05, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "#5c3317";
      ctx.fill();

      // Round Glasses
      ctx.beginPath();
      ctx.arc(-r * 0.16, -r * 0.08, r * 0.09, 0, Math.PI * 2);
      ctx.arc(r * 0.16, -r * 0.08, r * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#fbbf24";
      ctx.stroke();

      // White Beard
      ctx.beginPath();
      ctx.arc(0, r * 0.12, r * 0.28, 0, Math.PI);
      ctx.fillStyle = "#f8fafc";
      ctx.fill();

      // Speaking mouth inside beard
      ctx.beginPath();
      if (isSpeaking || audioLevel > 0.05) {
        ctx.ellipse(0, r * 0.12, r * 0.08, r * 0.06, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#1e293b";
        ctx.fill();
      }

      ctx.restore();
    },
  },
};

export const VIDEO_FRAME_STYLES = [
  { id: "rounded", name: "Bordas Arredondadas (Padrão)", description: "Layout de estúdio elegante" },
  { id: "circle_pip", name: "Picture-in-Picture Flutuante", description: "Avatar no canto inferior sobre o fundo" },
  { id: "split", name: "Divisão com Fundo Temático", description: "Avatar e área temática lado a lado" },
  { id: "glow", name: "Borda Iluminada Neon", description: "Contorno vibrante com brilho suave" },
  { id: "banner", name: "Estúdio com Faixa de Título", description: "Faixa inferior com o tópico da aula" },
];
