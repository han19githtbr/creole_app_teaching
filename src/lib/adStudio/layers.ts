// Fábricas de camadas (valores padrão) — usadas pelos modelos e pelo painel "Elementos".
import type {
  Background,
  ButtonLayer,
  CardLayer,
  IconLayer,
  ImageLayer,
  Layer,
  LayerKind,
  ListLayer,
  PhoneLayer,
  ScreenKind,
  ShapeLayer,
  Slide,
  StatLayer,
  TextLayer,
} from "./types";

let counter = 0;
export function uid(prefix = "l"): string {
  counter += 1;
  return `${prefix}${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function base(name: string, x: number, y: number, w: number, h: number) {
  return { id: uid(), name, x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), rotation: 0, opacity: 1 };
}

export function textLayer(text: string, x: number, y: number, w: number, h: number, o: Partial<TextLayer> = {}): TextLayer {
  return {
    ...base(o.name ?? "Texto", x, y, w, h),
    kind: "text",
    text,
    font: "sans",
    size: 48,
    weight: 800,
    color: "@light",
    align: "left",
    valign: "top",
    italic: false,
    uppercase: false,
    lineHeight: 1.1,
    letterSpacing: 0,
    autoFit: true,
    strokeColor: "",
    strokeWidth: 0,
    bgColor: "",
    bgRadius: 28,
    bgPadding: 18,
    ...o,
  };
}

export function imageLayer(src: string, x: number, y: number, w: number, h: number, o: Partial<ImageLayer> = {}): ImageLayer {
  return {
    ...base(o.name ?? "Imagem", x, y, w, h),
    kind: "image",
    src,
    fit: "cover",
    radius: 36,
    borderColor: "@light",
    borderWidth: 0,
    focusX: 50,
    focusY: 50,
    zoom: 1,
    ...o,
  };
}

export function shapeLayer(x: number, y: number, w: number, h: number, o: Partial<ShapeLayer> = {}): ShapeLayer {
  return {
    ...base(o.name ?? "Forma", x, y, w, h),
    kind: "shape",
    shape: "rect",
    fill: "@primary",
    fill2: "",
    angle: 135,
    strokeColor: "@light",
    strokeWidth: 0,
    radius: 32,
    ...o,
  };
}

export function phoneLayer(screen: ScreenKind, x: number, y: number, h: number, o: Partial<PhoneLayer> = {}): PhoneLayer {
  const w = Math.round(h * 0.49);
  return {
    ...base(o.name ?? "Celular", x, y, w, h),
    kind: "phone",
    screen,
    title: "",
    items: [],
    imageSrc: "",
    frameColor: "#0b0b12",
    screenColor: "#f6f7fb",
    accentColor: "#3a1df4",
    shadow: true,
    ...o,
    w: o.w ?? w,
  };
}

export function cardLayer(x: number, y: number, w: number, h: number, o: Partial<CardLayer> = {}): CardLayer {
  return {
    ...base(o.name ?? "Cartão", x, y, w, h),
    kind: "card",
    icon: "⭐",
    title: "Funcionalidade",
    desc: "Descreva em uma frase curta.",
    fill: "@card",
    textColor: "@cardText",
    accentColor: "@bg2",
    radius: 30,
    layout: "row",
    shadow: true,
    ...o,
  };
}

export function statLayer(x: number, y: number, w: number, h: number, o: Partial<StatLayer> = {}): StatLayer {
  return {
    ...base(o.name ?? "Número", x, y, w, h),
    kind: "stat",
    value: "20",
    label: "lições",
    fill: "@card",
    valueColor: "@bg2",
    labelColor: "@cardText",
    radius: 30,
    shadow: true,
    ...o,
  };
}

export function listLayer(items: string[], x: number, y: number, w: number, h: number, o: Partial<ListLayer> = {}): ListLayer {
  return {
    ...base(o.name ?? "Lista", x, y, w, h),
    kind: "list",
    items,
    bullet: "✔",
    size: 40,
    color: "@light",
    bulletColor: "@primary",
    weight: 700,
    font: "sans",
    gap: 14,
    ...o,
  };
}

export function buttonLayer(text: string, x: number, y: number, w: number, h: number, o: Partial<ButtonLayer> = {}): ButtonLayer {
  return {
    ...base(o.name ?? "Botão", x, y, w, h),
    kind: "button",
    text,
    icon: "",
    fill: "@primary",
    fill2: "@accent",
    color: "@dark",
    size: 44,
    radius: 999,
    arrow: true,
    shadow: true,
    ...o,
  };
}

export function iconLayer(icon: IconLayer["icon"], x: number, y: number, size: number, o: Partial<IconLayer> = {}): IconLayer {
  return {
    ...base(o.name ?? (icon === "instagram" ? "Ícone Instagram" : "Ícone Facebook"), x, y, size, size),
    kind: "icon",
    icon,
    style: "brand",
    color: "@light",
    ...o,
  };
}

export function defaultBackground(o: Partial<Background> = {}): Background {
  return {
    type: "gradient",
    color: "@bg1",
    color2: "@bg2",
    angle: 160,
    imageSrc: "",
    overlay: 0.45,
    overlayColor: "#000000",
    blur: 0,
    pattern: "none",
    patternOpacity: 0.12,
    patternColor: "@light",
    ...o,
  };
}

export function newSlide(name: string, layers: Layer[] = [], bg: Partial<Background> = {}): Slide {
  return { id: uid("s"), name, bg: defaultBackground(bg), layers };
}

export const LAYER_KIND_LABEL: Record<LayerKind, string> = {
  text: "Texto",
  image: "Imagem",
  shape: "Forma",
  phone: "Celular",
  card: "Cartão",
  stat: "Número",
  list: "Lista",
  button: "Botão",
  icon: "Ícone",
};

/** Camada nova com conteúdo de exemplo, centralizada no formato. */
export function makeLayer(kind: LayerKind, W: number, H: number, extra: { src?: string; screen?: ScreenKind; icon?: IconLayer["icon"] } = {}): Layer {
  const cx = (w: number) => (W - w) / 2;
  const cy = (h: number) => (H - h) / 2;
  switch (kind) {
    case "text":
      return textLayer("Digite seu texto aqui", cx(W * 0.8), cy(160), W * 0.8, 160, { size: 72, align: "center", valign: "middle" });
    case "image": {
      const s = Math.min(W, H) * 0.6;
      return imageLayer(extra.src ?? "", cx(s), cy(s * 0.8), s, s * 0.8, { borderWidth: 8 });
    }
    case "shape":
      return shapeLayer(cx(W * 0.6), cy(220), W * 0.6, 220);
    case "phone": {
      const h = Math.min(H * 0.7, 1000);
      return phoneLayer(extra.screen ?? "lessons", cx(h * 0.49), cy(h), h, { title: "Lições", items: ["Primeira lição|Gramática", "Segunda lição|Vocabulário", "Terceira lição|Diálogos", "Quarta lição|Cultura"] });
    }
    case "card":
      return cardLayer(cx(W * 0.8), cy(190), W * 0.8, 190);
    case "stat":
      return statLayer(cx(300), cy(220), 300, 220);
    case "list":
      return listLayer(["Primeiro benefício", "Segundo benefício", "Terceiro benefício"], cx(W * 0.8), cy(300), W * 0.8, 300);
    case "icon":
      return iconLayer(extra.icon ?? "instagram", cx(140), cy(140), 140);
    case "button":
      return buttonLayer("Comece agora", cx(W * 0.7), cy(110), W * 0.7, 110);
  }
}
