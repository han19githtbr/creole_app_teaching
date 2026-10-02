// Módulo de Melhoria de Clareza Óptica, Filtros de Estúdio e Gestão de Dispositivos de Vídeo

export interface ClarityPreset {
  id: string;
  name: string;
  shortDesc: string;
  filter: string;
  icon: string;
}

export const CLARITY_PRESETS: ClarityPreset[] = [
  {
    id: "studio_bright",
    name: "Estúdio Luminoso",
    shortDesc: "Ilumina o rosto e reduz sombras (recomendado)",
    filter: "contrast(106%) saturate(106%) brightness(106%)",
    icon: "💡",
  },
  {
    id: "crisp_pro",
    name: "Nitidez & Contraste Pro",
    shortDesc: "Contorno facial nítido e definição máxima de detalhes",
    filter: "contrast(114%) saturate(108%) brightness(102%)",
    icon: "✨",
  },
  {
    id: "warm_caribbean",
    name: "Calor Tropical / Haiti",
    shortDesc: "Tons dourados e pele radiante caribenha",
    filter: "brightness(104%) contrast(106%) saturate(115%) sepia(6%)",
    icon: "🌅",
  },
  {
    id: "clean_cinema",
    name: "Clean / Cinematográfico",
    shortDesc: "Equilíbrio neutro profissional",
    filter: "contrast(108%) brightness(102%) saturate(102%)",
    icon: "🎬",
  },
  {
    id: "natural",
    name: "Original da Câmera",
    shortDesc: "Sem filtros adicionais",
    filter: "none",
    icon: "📹",
  },
];

export interface VideoDeviceOption {
  deviceId: string;
  label: string;
}

export interface RecordingQualityPreset {
  id: "ultra" | "high" | "balanced";
  name: string;
  tag: string;
  videoBitrate: number;
  audioBitrate: number;
  description: string;
}

export const RECORDING_QUALITIES: RecordingQualityPreset[] = [
  {
    id: "ultra",
    name: "Ultra HD Pro (12 Mbps)",
    tag: "Fidelidade Máxima",
    videoBitrate: 12000000,
    audioBitrate: 256000,
    description: "Sem compressão visível, movimentos perfeitos em Full HD 1080p.",
  },
  {
    id: "high",
    name: "Alta Definição (8 Mbps)",
    tag: "Recomendado",
    videoBitrate: 8000000,
    audioBitrate: 192000,
    description: "Excelente clareza óptica e tamanho de arquivo ideal.",
  },
  {
    id: "balanced",
    name: "Web Balanceada (4 Mbps)",
    tag: "Mais Rápido",
    videoBitrate: 4000000,
    audioBitrate: 128000,
    description: "Envio rápido, ideal para internet mais lenta.",
  },
];

/**
 * Enumera as câmeras disponíveis no dispositivo do professor
 */
export async function getAvailableVideoDevices(): Promise<VideoDeviceOption[]> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((d) => d.kind === "videoinput");
    return videoInputs.map((d, index) => ({
      deviceId: d.deviceId,
      label: d.label || `Câmera ${index + 1}`,
    }));
  } catch {
    return [];
  }
}

/**
 * Desenha uma luz frontal virtual de estúdio (Ring Light difusa)
 * suavemente sobre o canvas para preencher sombras no rosto do orador
 */
export function drawVirtualRingLight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity = 0.18
) {
  if (intensity <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";

  const centerX = width / 2;
  const centerY = height * 0.45;
  const radius = Math.max(width, height) * 0.55;

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.15,
    centerX,
    centerY,
    radius
  );
  gradient.addColorStop(0, `rgba(255, 252, 245, ${intensity})`);
  gradient.addColorStop(0.5, `rgba(255, 245, 230, ${intensity * 0.5})`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
