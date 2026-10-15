"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Download, FolderOpen, Layers, Plus, Redo2, Save, Share2, Trash2, Undo2, X, ZoomIn, ZoomOut } from "lucide-react";
import { buildCaption, COPY } from "@/lib/adStudio/content";
import { makeLayer, newSlide, textLayer, uid, imageLayer, LAYER_KIND_LABEL } from "@/lib/adStudio/layers";
import { DEFAULT_PALETTE, PALETTES } from "@/lib/adStudio/palettes";
import { collectImageSrcs, renderSlide } from "@/lib/adStudio/render";
import { getTemplate } from "@/lib/adStudio/templates";
import {
  FORMATS,
  FORMAT_ORDER,
  STORY_SAFE,
  type AdData,
  type AdDesign,
  type Background,
  type Brand,
  type FormatId,
  type Layer,
  type LayerKind,
  type LibImage,
  type Palette,
  type PaletteToken,
  type Picks,
  type ScreenKind,
  type Slide,
} from "@/lib/adStudio/types";
import type { AppLanguage } from "@/lib/languageShared";
import { cn } from "@/lib/utils";
import { Inspector } from "./AdStudioInspector";
import { BackgroundPanel, BrandPanel, ElementsPanel, ImagesPanel, TemplatesPanel } from "./AdStudioPanels";

type Tab = "modelos" | "elementos" | "imagens" | "fundo" | "marca";
type Handle = "nw" | "ne" | "sw" | "se";
type Drag =
  | { mode: "move"; id: string; sx: number; sy: number; ox: number; oy: number }
  | { mode: "resize"; id: string; handle: Handle; orig: Layer }
  | { mode: "rotate"; id: string };
type PickerTarget = { type: "layer" } | { type: "pick"; field: "heroImage" | "teachers" } | { type: "bg" };

interface SavedItem {
  _id: string;
  name: string;
  language: AppLanguage;
  format: string;
  slideCount: number;
  thumbnail: string;
}

const BRAND_KEY = "adstudio:brand";
const DEFAULT_BRAND: Brand = { name: "frances_com_tres_nativos", handle: "", url: "", contact: "" };

function paletteOf(d: AdDesign): Palette {
  return d.customPalette ?? PALETTES.find((p) => p.id === d.paletteId) ?? PALETTES[0];
}

function designFromTemplate(templateId: string, language: AppLanguage, format: FormatId, brand: Brand, data: AdData, picks: Picks, keep?: { customPalette?: Palette; paletteId?: string; name?: string }): AdDesign {
  const t = getTemplate(templateId) ?? getTemplate("hero")!;
  const res = t.build({ language, format: FORMATS[format], brand, data, picks });
  const used = new Set([picks.heroImage, picks.gameImage, ...(picks.teacherImages ?? [])]);
  const assets = data.images.filter((i) => i.id.startsWith("up-") && used.has(i.id));
  return {
    version: 1,
    source: { templateId: t.id, picks },
    assets: assets.length ? assets : undefined,
    name: keep?.name ?? `${t.name} · ${COPY[language].name}`,
    language,
    format,
    paletteId: keep?.paletteId ?? DEFAULT_PALETTE[language],
    customPalette: keep?.customPalette,
    brand,
    slides: res.slides,
    caption: res.caption,
  };
}

/** Redimensiona as camadas ao trocar de formato (quando o layout do modelo não pode ser refeito). */
function rescaleSlides(slides: Slide[], from: FormatId, to: FormatId): Slide[] {
  const a = FORMATS[from];
  const b = FORMATS[to];
  const sx = b.w / a.w;
  const sy = b.h / a.h;
  const sf = Math.min(sx, sy);
  return slides.map((s) => ({
    ...s,
    layers: s.layers.map((l) => {
      const next = { ...l, x: l.x * sx, y: l.y * sy, w: l.w * sx, h: l.h * sy } as Layer;
      if (l.kind === "text") (next as typeof l).size = Math.max(14, Math.round(l.size * sf));
      if (l.kind === "phone") {
        const h = l.h * sf;
        const w = h * 0.49;
        next.h = h;
        next.w = w;
        next.x = (l.x + l.w / 2) * sx - w / 2;
        next.y = (l.y + l.h / 2) * sy - h / 2;
      }
      return next;
    }),
  }));
}

function fileToDataUrl(file: File, max = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.86));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("img"));
    };
    img.src = url;
  });
}

function download(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function slug(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "propaganda";
}

export function AdStudio({ initialData }: { initialData: AdData }) {
  const [data, setData] = useState<AdData>(initialData);
  const [loadingLang, setLoadingLang] = useState(false);
  const [brand, setBrandState] = useState<Brand>({ ...DEFAULT_BRAND, url: initialData.appUrl });
  const [picks, setPicksState] = useState<Picks>({});
  const picksRef = useRef<Picks>({});
  const setPicks = useCallback((next: Picks | ((p: Picks) => Picks)) => {
    const value = typeof next === "function" ? next(picksRef.current) : next;
    picksRef.current = value;
    setPicksState(value);
  }, []);
  const [design, setDesignState] = useState<AdDesign>(() => designFromTemplate("hero", initialData.language, "feed45", { ...DEFAULT_BRAND, url: initialData.appUrl }, initialData, {}));
  const designRef = useRef(design);
  const hist = useRef<{ past: AdDesign[]; future: AdDesign[]; key?: string; at: number }>({ past: [], future: [], at: 0 });
  const [histInfo, setHistInfo] = useState({ undo: 0, redo: 0 });
  const [dirty, setDirty] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [selId, setSelId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("modelos");
  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const [showSafe, setShowSafe] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  const [toast, setToast] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedList, setSavedList] = useState<SavedItem[] | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);
  const [tick, setTick] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState({ w: 700, h: 700 });
  const dragRef = useRef<Drag | null>(null);
  const cache = useRef(new Map<string, HTMLImageElement>());
  const loaded = useRef(new Set<string>());
  const waiters = useRef(new Map<string, Promise<void>>());

  const fmt = FORMATS[design.format];
  const palette = useMemo(() => paletteOf(design), [design]);
  const slide = design.slides[Math.min(slideIdx, design.slides.length - 1)];
  const selected = slide.layers.find((l) => l.id === selId);

  // ---------------------------------------------------------------- utilidades
  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3200);
  }, []);

  const setDesign = useCallback((next: AdDesign) => {
    designRef.current = next;
    setDesignState(next);
  }, []);

  const pushHistory = useCallback((key?: string) => {
    const h = hist.current;
    const now = Date.now();
    if (key && h.key === key && now - h.at < 900) {
      h.at = now;
      return;
    }
    h.past.push(designRef.current);
    if (h.past.length > 80) h.past.shift();
    h.future = [];
    h.key = key;
    h.at = now;
    setHistInfo({ undo: hist.current.past.length, redo: hist.current.future.length });
  }, []);

  /** Altera o design; registra no histórico (desfazer) salvo `skipHistory`. */
  const commit = useCallback(
    (fn: (d: AdDesign) => AdDesign, opts?: { key?: string; skipHistory?: boolean; keepSource?: boolean }) => {
      const prev = designRef.current;
      const next = fn(prev);
      if (next === prev) return;
      if (!opts?.skipHistory) pushHistory(opts?.key);
      setDesign(opts?.keepSource ? next : next.source ? { ...next, source: next.source } : next);
      setDirty(true);
    },
    [pushHistory, setDesign]
  );

  const undo = useCallback(() => {
    const h = hist.current;
    const prev = h.past.pop();
    if (!prev) return;
    h.future.push(designRef.current);
    h.key = undefined;
    setDesign(prev);
    setSlideIdx((i) => Math.min(i, prev.slides.length - 1));
    setHistInfo({ undo: hist.current.past.length, redo: hist.current.future.length });
  }, [setDesign]);

  const redo = useCallback(() => {
    const h = hist.current;
    const nxt = h.future.pop();
    if (!nxt) return;
    h.past.push(designRef.current);
    h.key = undefined;
    setDesign(nxt);
    setSlideIdx((i) => Math.min(i, nxt.slides.length - 1));
    setHistInfo({ undo: hist.current.past.length, redo: hist.current.future.length });
  }, [setDesign]);

  const patchSlide = useCallback(
    (index: number, fn: (s: Slide) => Slide, opts?: { key?: string; skipHistory?: boolean }) =>
      commit((d) => ({ ...d, slides: d.slides.map((s, i) => (i === index ? fn(s) : s)) }), opts),
    [commit]
  );

  const patchLayer = useCallback(
    (id: string, patch: Partial<Layer>, opts?: { key?: string; skipHistory?: boolean }) =>
      patchSlide(slideIdx, (s) => ({ ...s, layers: s.layers.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l)) }), opts),
    [patchSlide, slideIdx]
  );

  // ---------------------------------------------------------------- imagens
  const ensureImage = useCallback((src: string): Promise<void> => {
    if (!src) return Promise.resolve();
    const existing = waiters.current.get(src);
    if (existing) return existing;
    const p = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        loaded.current.add(src);
        setTick((t) => t + 1);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
      cache.current.set(src, img);
    });
    waiters.current.set(src, p);
    return p;
  }, []);

  const getImage = useCallback((src: string) => (loaded.current.has(src) ? cache.current.get(src) : undefined), []);

  // ---------------------------------------------------------------- desenho do preview
  useEffect(() => {
    collectImageSrcs(slide).forEach((s) => void ensureImage(s));
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (canvas.width !== fmt.w || canvas.height !== fmt.h) {
      canvas.width = fmt.w;
      canvas.height = fmt.h;
    }
    renderSlide(ctx, slide, { width: fmt.w, height: fmt.h, palette, getImage });
  }, [slide, palette, fmt, getImage, ensureImage, tick]);

  // ---------------------------------------------------------------- tamanho da área
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setArea({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setArea({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const stageW = Math.max(160, Math.min(area.w - 32, (area.h - 32) * (fmt.w / fmt.h)) * zoom);
  const stageH = stageW * (fmt.h / fmt.w);

  // ---------------------------------------------------------------- marca (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BRAND_KEY);
      const saved = raw ? (JSON.parse(raw) as Partial<Brand>) : {};
      const merged: Brand = { ...DEFAULT_BRAND, ...saved };
      if (!merged.name || merged.name === "Prof. Handy") merged.name = DEFAULT_BRAND.name;
      if (!merged.url) merged.url = initialData.appUrl || window.location.origin;
      // Hidrata a marca salva neste navegador (só existe no cliente) e refaz o modelo inicial com ela.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBrandState(merged);
      const d = designRef.current;
      const next = d.source ? designFromTemplate(d.source.templateId, d.language, d.format, merged, initialData, d.source.picks, d) : { ...d, brand: merged };
      designRef.current = next;
      setDesignState(next);
    } catch {
      /* ignora */
    }
  }, [initialData]);

  const setBrand = (b: Brand) => {
    setBrandState(b);
    try {
      localStorage.setItem(BRAND_KEY, JSON.stringify(b));
    } catch {
      /* ignora */
    }
  };

  // ---------------------------------------------------------------- modelos / idioma / formato
  const applyTemplate = (templateId: string, mode: "replace" | "append") => {
    const d = designRef.current;
    if (mode === "replace") {
      if (dirty && !window.confirm("Substituir a peça atual por este modelo? As edições feitas serão perdidas (você pode desfazer com Ctrl+Z).")) return;
      pushHistory();
      setDesign(designFromTemplate(templateId, d.language, d.format, brand, data, picks, { paletteId: d.paletteId, customPalette: d.customPalette, name: d.name }));
      setDirty(false);
      setSlideIdx(0);
      setSelId(null);
      return;
    }
    const t = getTemplate(templateId);
    if (!t) return;
    const res = t.build({ language: d.language, format: FORMATS[d.format], brand, data, picks });
    commit((cur) => ({ ...cur, slides: [...cur.slides, ...res.slides].slice(0, 12) }));
    setSlideIdx(Math.min(designRef.current.slides.length - 1, d.slides.length));
  };

  const reapply = () => {
    const d = designRef.current;
    if (!d.source) return;
    pushHistory();
    setDesign(designFromTemplate(d.source.templateId, d.language, d.format, brand, data, picks, d));
    setDirty(false);
    setSlideIdx(0);
  };

  const changeFormat = (f: FormatId) => {
    const d = designRef.current;
    if (f === d.format) return;
    pushHistory();
    if (d.source && !dirty) {
      setDesign(designFromTemplate(d.source.templateId, d.language, f, d.brand, data, d.source.picks, d));
    } else {
      setDesign({ ...d, format: f, slides: rescaleSlides(d.slides, d.format, f) });
      if (d.source) flash("Camadas redimensionadas. Use “Refazer o layout do modelo” (aba Modelos) para recompor para este formato.");
    }
  };

  const changeLanguage = async (language: AppLanguage) => {
    const d = designRef.current;
    if (language === d.language) return;
    setLoadingLang(true);
    try {
      const res = await fetch(`/api/admin/ads/data?language=${language}`);
      if (!res.ok) throw new Error();
      const next = (await res.json()) as AdData;
      setData(next);
      setPicks({});
      pushHistory();
      setDesign(
        designFromTemplate(d.source?.templateId ?? "hero", language, d.format, brand, next, {}, { paletteId: DEFAULT_PALETTE[language], name: undefined, customPalette: undefined })
      );
      setDirty(false);
      setSavedId(null);
      setSlideIdx(0);
      setSelId(null);
    } catch {
      flash("Não foi possível carregar os dados desse idioma.");
    } finally {
      setLoadingLang(false);
    }
  };

  // ---------------------------------------------------------------- camadas
  const addLayer = (kind: LayerKind, extra?: { screen?: ScreenKind; src?: string; icon?: "instagram" | "facebook" }) => {
    const layer = makeLayer(kind, fmt.w, fmt.h, extra);
    if (layer.kind === "phone") {
      layer.accentColor = "@bg2";
      if (extra?.screen === "game") {
        layer.title = data.gameName;
        const ch = data.challenges[0];
        if (ch) {
          layer.items = ch.options.map((o) => (o === ch.correct ? `✓ ${o}` : o));
          layer.imageSrc = ch.image;
        }
      } else if (extra?.screen === "ranking") {
        layer.title = "Ranking";
        layer.items = ["Ana|1.240", "Você|1.180", "Léo|980", "Bia|870"];
      } else if (extra?.screen === "video") {
        layer.title = "Aula em vídeo";
        layer.items = ["Aula gravada · assista quando quiser", ...data.lessons.slice(0, 3).map((l) => l.title)];
        layer.imageSrc = data.images.find((i) => i.kind === "teacher")?.src ?? "";
      } else if (extra?.screen === "story") {
        const img = data.images.find((i) => i.kind === "ghibli");
        layer.title = img?.title ?? "";
        layer.items = (img?.elements ?? []).slice(0, 4);
        layer.imageSrc = img?.src ?? "";
      } else if (extra?.screen === "live") {
        layer.title = "Escreva sua dúvida…";
        layer.items = ["👥 ao vivo", ...COPY[design.language].chat];
        layer.imageSrc = data.images.find((i) => i.kind === "teacher")?.src ?? "";
      } else if (extra?.screen === "achievements") {
        const lv = data.levels[Math.min(4, data.levels.length - 1)];
        layer.title = lv ? `${lv.emoji}|${lv.native}` : "👑|Nível";
        layer.items = data.badges.slice(0, 6).map((b) => `${b.emoji}|${b.native}`);
      } else {
        layer.title = design.language === "kreyol" ? "Lições de Kreyòl" : "Lições de Francês";
        layer.items = data.lessons.slice(0, 6).map((l) => `${l.title}|${l.category}`);
      }
    }
    patchSlide(slideIdx, (s) => ({ ...s, layers: [...s.layers, layer] }));
    setSelId(layer.id);
    setRightOpen(true);
  };

  const addEmoji = (e: string) => {
    const l = textLayer(e, fmt.w / 2 - 90, fmt.h / 2 - 90, 180, 180, { name: `Emoji ${e}`, size: 130, align: "center", valign: "middle" });
    patchSlide(slideIdx, (s) => ({ ...s, layers: [...s.layers, l] }));
    setSelId(l.id);
  };

  const deleteLayer = (id = selId) => {
    if (!id) return;
    patchSlide(slideIdx, (s) => ({ ...s, layers: s.layers.filter((l) => l.id !== id) }));
    setSelId(null);
  };

  const duplicateLayer = (id = selId) => {
    const src = slide.layers.find((l) => l.id === id);
    if (!src) return;
    const copy = { ...src, id: uid(), name: `${src.name} (cópia)`, x: src.x + 30, y: src.y + 30 } as Layer;
    patchSlide(slideIdx, (s) => ({ ...s, layers: [...s.layers, copy] }));
    setSelId(copy.id);
  };

  const orderLayer = (id: string, dir: "up" | "down" | "front" | "back") => {
    patchSlide(slideIdx, (s) => {
      const i = s.layers.findIndex((l) => l.id === id);
      if (i < 0) return s;
      const arr = [...s.layers];
      const [it] = arr.splice(i, 1);
      const to = dir === "up" ? Math.min(arr.length, i + 1) : dir === "down" ? Math.max(0, i - 1) : dir === "front" ? arr.length : 0;
      arr.splice(to, 0, it);
      return { ...s, layers: arr };
    });
  };

  const alignLayer = (a: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!selected) return;
    const p: Partial<Layer> = {};
    if (a === "left") p.x = 0;
    if (a === "center") p.x = (fmt.w - selected.w) / 2;
    if (a === "right") p.x = fmt.w - selected.w;
    if (a === "top") p.y = 0;
    if (a === "middle") p.y = (fmt.h - selected.h) / 2;
    if (a === "bottom") p.y = fmt.h - selected.h;
    patchLayer(selected.id, p);
  };

  // ---------------------------------------------------------------- imagens da biblioteca
  const onLibraryClick = (img: LibImage) => {
    if (picker?.type === "pick") {
      if (picker.field === "teachers") {
        const cur = picksRef.current.teacherImages ?? [];
        if (cur.includes(img.id)) return flash("Essa foto já foi adicionada.");
        if (cur.length >= 5) return flash("Máximo de 5 fotos de professores.");
        setPicks({ ...picksRef.current, teacherImages: [...cur, img.id] });
        flash(`Foto adicionada (${cur.length + 1}). Clique em outras ou em “concluir”.`);
        return;
      }
      setPicks((p) => ({ ...p, heroImage: img.id }));
      setPicker(null);
      setTab("modelos");
      flash("Imagem escolhida. Clique em “Usar este” ou “Refazer o layout”.");
      return;
    }
    if (picker?.type === "bg") {
      applyAsBackground(img);
      setPicker(null);
      return;
    }
    if (picker?.type === "layer" && selected) {
      applyToSelected(img);
      setPicker(null);
      return;
    }
    const w = img.portrait ? fmt.w * 0.5 : fmt.w * 0.78;
    const h = img.portrait ? w * 1.7 : w * 0.66;
    const layer = imageLayer(img.src, (fmt.w - w) / 2, (fmt.h - h) / 2, w, Math.min(h, fmt.h * 0.8), { name: img.title, borderWidth: 8, shadow: true, focusY: img.kind === "teacher" ? 25 : 50 });
    patchSlide(slideIdx, (s) => ({ ...s, layers: [...s.layers, layer] }));
    setSelId(layer.id);
  };

  const applyAsBackground = (img: LibImage) => {
    patchSlide(slideIdx, (s) => ({ ...s, bg: { ...s.bg, type: "image", imageSrc: img.src, overlay: s.bg.overlay || 0.45 } }));
  };

  const applyToSelected = (img: LibImage) => {
    if (!selected) return;
    if (selected.kind === "image") patchLayer(selected.id, { src: img.src } as Partial<Layer>);
    else if (selected.kind === "phone") patchLayer(selected.id, { imageSrc: img.src } as Partial<Layer>);
    else flash("Selecione uma camada de imagem ou de celular para trocar a imagem.");
  };

  const onUpload = async (file: File) => {
    try {
      const url = await fileToDataUrl(file);
      const img: LibImage = { id: uid("up-"), src: url, title: file.name, group: "Enviadas", kind: "generated" };
      if (picker?.type === "pick") return void (await onUploadPick(file, picker.field));
      onLibraryClick(img);
      flash("Imagem enviada. Ela fica salva dentro da peça.");
    } catch {
      flash("Não foi possível ler essa imagem.");
    }
  };

  /** Envio direto para os modelos (foto de professor ou imagem principal). */
  const onUploadPick = async (file: File, field: "heroImage" | "teachers") => {
    try {
      const url = await fileToDataUrl(file, field === "teachers" ? 900 : 1400);
      const img: LibImage = { id: uid("up-"), src: url, title: file.name, group: "Enviadas", kind: field === "teachers" ? "teacher" : "generated", portrait: field === "teachers" };
      setData((d) => ({ ...d, images: [img, ...d.images] }));
      if (field === "teachers") {
        const cur = picksRef.current.teacherImages ?? [];
        if (cur.length >= 5) return flash("Máximo de 5 fotos de professores.");
        setPicks({ ...picksRef.current, teacherImages: [...cur, img.id] });
        flash(`Foto adicionada (${cur.length + 1}). Clique em “Usar este” ou “Refazer o layout”.`);
      } else {
        setPicks({ ...picksRef.current, heroImage: img.id });
      }
    } catch {
      flash("Não foi possível ler essa imagem.");
    }
  };

  // ---------------------------------------------------------------- ponteiro (arrastar, redimensionar, girar)
  const toDesign = (e: { clientX: number; clientY: number }) => {
    const r = stageRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * fmt.w) / r.width, y: ((e.clientY - r.top) * fmt.h) / r.height };
  };

  const hitTest = (p: { x: number; y: number }): Layer | undefined => {
    for (let i = slide.layers.length - 1; i >= 0; i--) {
      const l = slide.layers[i];
      if (l.hidden || l.locked) continue;
      const cx = l.x + l.w / 2;
      const cy = l.y + l.h / 2;
      const a = (-l.rotation * Math.PI) / 180;
      const dx = p.x - cx;
      const dy = p.y - cy;
      const lx = dx * Math.cos(a) - dy * Math.sin(a);
      const ly = dx * Math.sin(a) + dy * Math.cos(a);
      if (Math.abs(lx) <= l.w / 2 && Math.abs(ly) <= l.h / 2) return l;
    }
    return undefined;
  };

  const onStageDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const p = toDesign(e);
    const hit = hitTest(p);
    if (!hit) {
      setSelId(null);
      return;
    }
    setSelId(hit.id);
    setRightOpen(true);
    pushHistory();
    dragRef.current = { mode: "move", id: hit.id, sx: p.x, sy: p.y, ox: hit.x, oy: hit.y };
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const startHandle = (e: React.PointerEvent, mode: "resize" | "rotate", handle?: Handle) => {
    e.stopPropagation();
    if (!selected) return;
    pushHistory();
    dragRef.current = mode === "resize" ? { mode, id: selected.id, handle: handle!, orig: selected } : { mode, id: selected.id };
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const onStageMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const p = toDesign(e);
    if (d.mode === "move") {
      const l = designRef.current.slides[slideIdx].layers.find((x) => x.id === d.id);
      if (!l) return;
      let nx = d.ox + (p.x - d.sx);
      let ny = d.oy + (p.y - d.sy);
      const g: { x?: number; y?: number } = {};
      if (!e.altKey) {
        const T = 10;
        for (const [pos, target] of [[nx, 0], [nx + l.w / 2, fmt.w / 2], [nx + l.w, fmt.w], [nx, 64], [nx + l.w, fmt.w - 64]] as const) {
          if (Math.abs(pos - target) < T) {
            nx += target - pos;
            g.x = target;
            break;
          }
        }
        for (const [pos, target] of [[ny, 0], [ny + l.h / 2, fmt.h / 2], [ny + l.h, fmt.h]] as const) {
          if (Math.abs(pos - target) < T) {
            ny += target - pos;
            g.y = target;
            break;
          }
        }
      }
      setGuides(g);
      patchLayer(d.id, { x: Math.round(nx), y: Math.round(ny) }, { skipHistory: true });
    } else if (d.mode === "resize") {
      const o = d.orig;
      const th = (o.rotation * Math.PI) / 180;
      const cos = Math.cos(th);
      const sin = Math.sin(th);
      const cx = o.x + o.w / 2;
      const cy = o.y + o.h / 2;
      const dx = p.x - cx;
      const dy = p.y - cy;
      const P = { x: dx * cos + dy * sin, y: -dx * sin + dy * cos };
      const sx = d.handle.includes("e") ? 1 : -1;
      const sy = d.handle.includes("s") ? 1 : -1;
      const O = { x: -sx * (o.w / 2), y: -sy * (o.h / 2) };
      const nw = Math.max(30, sx * (P.x - O.x));
      let nh = Math.max(30, sy * (P.y - O.y));
      if (o.kind === "phone" || e.shiftKey) {
        const ratio = o.kind === "phone" ? 0.49 : o.w / o.h;
        nh = nw / ratio;
      }
      const Pn = { x: O.x + sx * nw, y: O.y + sy * nh };
      const c = { x: (O.x + Pn.x) / 2, y: (O.y + Pn.y) / 2 };
      const wcx = cx + c.x * cos - c.y * sin;
      const wcy = cy + c.x * sin + c.y * cos;
      patchLayer(d.id, { x: Math.round(wcx - nw / 2), y: Math.round(wcy - nh / 2), w: Math.round(nw), h: Math.round(nh) }, { skipHistory: true });
    } else {
      const l = designRef.current.slides[slideIdx].layers.find((x) => x.id === d.id);
      if (!l) return;
      let deg = (Math.atan2(p.y - (l.y + l.h / 2), p.x - (l.x + l.w / 2)) * 180) / Math.PI + 90;
      if (deg > 180) deg -= 360;
      if (e.shiftKey) deg = Math.round(deg / 15) * 15;
      else if (Math.abs(deg) < 4) deg = 0;
      patchLayer(d.id, { rotation: Math.round(deg) }, { skipHistory: true });
    }
  };

  const onStageUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      dragRef.current = null;
      setGuides({});
      try {
        stageRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* já liberado */
      }
    }
  };

  const onStageDouble = (e: React.MouseEvent) => {
    const hit = hitTest(toDesign(e));
    if (hit?.kind === "text") {
      setSelId(hit.id);
      setRightOpen(true);
      window.setTimeout(() => document.querySelector<HTMLTextAreaElement>('[data-ad-focus="text"]')?.focus(), 60);
    }
  };

  // ---------------------------------------------------------------- teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateLayer();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selId) {
          e.preventDefault();
          deleteLayer();
        }
      } else if (e.key === "Escape") {
        setSelId(null);
        setPicker(null);
      } else if (selId && e.key.startsWith("Arrow")) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const l = designRef.current.slides[slideIdx].layers.find((x) => x.id === selId);
        if (!l) return;
        const patch: Partial<Layer> = {};
        if (e.key === "ArrowLeft") patch.x = l.x - step;
        if (e.key === "ArrowRight") patch.x = l.x + step;
        if (e.key === "ArrowUp") patch.y = l.y - step;
        if (e.key === "ArrowDown") patch.y = l.y + step;
        patchLayer(selId, patch, { key: `nudge:${selId}` });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ---------------------------------------------------------------- slides
  const addSlide = () => {
    if (design.slides.length >= 12) return flash("Máximo de 12 slides por peça.");
    const s = newSlide(`Slide ${design.slides.length + 1}`, [], { ...slide.bg });
    commit((d) => ({ ...d, slides: [...d.slides, s] }));
    setSlideIdx(design.slides.length);
    setSelId(null);
  };
  const duplicateSlide = () => {
    if (design.slides.length >= 12) return flash("Máximo de 12 slides por peça.");
    const copy: Slide = { ...slide, id: uid("s"), name: `${slide.name} (cópia)`, layers: slide.layers.map((l) => ({ ...l, id: uid() }) as Layer) };
    commit((d) => ({ ...d, slides: [...d.slides.slice(0, slideIdx + 1), copy, ...d.slides.slice(slideIdx + 1)] }));
    setSlideIdx(slideIdx + 1);
  };
  const deleteSlide = () => {
    if (design.slides.length <= 1) return flash("A peça precisa ter ao menos um slide.");
    commit((d) => ({ ...d, slides: d.slides.filter((_, i) => i !== slideIdx) }));
    setSlideIdx(Math.max(0, slideIdx - 1));
    setSelId(null);
  };
  const moveSlide = (dir: -1 | 1) => {
    const to = slideIdx + dir;
    if (to < 0 || to >= design.slides.length) return;
    commit((d) => {
      const arr = [...d.slides];
      [arr[slideIdx], arr[to]] = [arr[to], arr[slideIdx]];
      return { ...d, slides: arr };
    });
    setSlideIdx(to);
  };

  // ---------------------------------------------------------------- exportação
  const renderBlob = async (s: Slide, scale: number, type: "image/png" | "image/jpeg" = "image/png"): Promise<Blob> => {
    await Promise.all(collectImageSrcs(s).map(ensureImage));
    const c = document.createElement("canvas");
    c.width = Math.round(fmt.w * scale);
    c.height = Math.round(fmt.h * scale);
    const ctx = c.getContext("2d")!;
    if (type === "image/jpeg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
    }
    renderSlide(ctx, s, { width: fmt.w, height: fmt.h, scale, palette, getImage });
    return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("blob"))), type, 0.92));
  };

  const fileName = (i: number) => `${slug(design.name)}-${design.language}-${design.format}-${String(i + 1).padStart(2, "0")}.png`;

  const exportCurrent = async (scale = 1) => {
    setBusy(true);
    try {
      download(await renderBlob(slide, scale), fileName(slideIdx));
    } catch {
      flash("Falha ao gerar a imagem.");
    } finally {
      setBusy(false);
    }
  };

  const exportAll = async () => {
    setBusy(true);
    try {
      for (let i = 0; i < design.slides.length; i++) {
        download(await renderBlob(design.slides[i], 1), fileName(i));
        await new Promise((r) => setTimeout(r, 450));
      }
      flash(`${design.slides.length} imagens baixadas (nomes numerados na ordem do carrossel).`);
    } catch {
      flash("Falha ao gerar as imagens.");
    } finally {
      setBusy(false);
    }
  };

  const shareFiles = async () => {
    setBusy(true);
    try {
      const files: File[] = [];
      for (let i = 0; i < design.slides.length; i++) files.push(new File([await renderBlob(design.slides[i], 1)], fileName(i), { type: "image/png" }));
      if (navigator.canShare?.({ files })) {
        await navigator.share({ files, text: design.caption });
      } else {
        flash("Este navegador não compartilha arquivos diretamente. Use “Baixar” e publique pelo Instagram/Facebook.");
      }
    } catch {
      /* compartilhamento cancelado */
    } finally {
      setBusy(false);
    }
  };

  const copyImage = async () => {
    try {
      const blob = await renderBlob(slide, 1);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("Imagem copiada! Cole (Ctrl+V) no Facebook ou no Meta Business Suite.");
    } catch {
      flash("Seu navegador não permitiu copiar a imagem. Use “Baixar PNG”.");
    }
  };

  // ---------------------------------------------------------------- salvar / abrir
  const makeThumb = async (): Promise<string> => {
    const c = document.createElement("canvas");
    const k = 240 / fmt.w;
    c.width = 240;
    c.height = Math.round(fmt.h * k);
    const ctx = c.getContext("2d")!;
    await Promise.all(collectImageSrcs(design.slides[0]).map(ensureImage));
    renderSlide(ctx, design.slides[0], { width: fmt.w, height: fmt.h, scale: k, palette, getImage });
    return c.toDataURL("image/jpeg", 0.6);
  };

  const save = async (asNew = false) => {
    setSaving(true);
    try {
      const body = JSON.stringify({ design: designRef.current, thumbnail: await makeThumb() });
      const update = savedId && !asNew;
      const res = await fetch(update ? `/api/admin/ads/${savedId}` : "/api/admin/ads", { method: update ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body });
      const json = (await res.json()) as { _id?: string; error?: string };
      if (!res.ok) throw new Error(json.error || "Erro ao salvar.");
      if (json._id) setSavedId(json._id);
      setDirty(false);
      flash("Propaganda salva!");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const openSaved = async () => {
    setShowSaved(true);
    try {
      const res = await fetch("/api/admin/ads");
      setSavedList(res.ok ? ((await res.json()) as SavedItem[]) : []);
    } catch {
      setSavedList([]);
    }
  };

  const loadSaved = async (item: SavedItem) => {
    try {
      const res = await fetch(`/api/admin/ads/${item._id}`);
      const json = (await res.json()) as { design: AdDesign };
      if (!res.ok) throw new Error();
      if (item.language !== data.language) {
        const dres = await fetch(`/api/admin/ads/data?language=${item.language}`);
        if (dres.ok) setData((await dres.json()) as AdData);
      }
      pushHistory();
      setDesign(json.design);
      setPicks(json.design.source?.picks ?? {});
      if (json.design.assets?.length) {
        const extra = json.design.assets;
        setData((d) => ({ ...d, images: [...extra.filter((a) => !d.images.some((i) => i.id === a.id)), ...d.images] }));
      }
      setSavedId(item._id);
      setSlideIdx(0);
      setSelId(null);
      setDirty(true);
      setShowSaved(false);
    } catch {
      flash("Não foi possível abrir essa peça.");
    }
  };

  const deleteSaved = async (item: SavedItem) => {
    if (!window.confirm(`Excluir a peça “${item.name}”?`)) return;
    await fetch(`/api/admin/ads/${item._id}`, { method: "DELETE" });
    setSavedList((l) => (l ? l.filter((x) => x._id !== item._id) : l));
    if (savedId === item._id) setSavedId(null);
  };

  // ---------------------------------------------------------------- paleta / fundo
  const setPalette = (id: string) => commit((d) => ({ ...d, paletteId: id, customPalette: undefined }));
  const setToken = (t: PaletteToken, hex: string) => commit((d) => ({ ...d, customPalette: { ...paletteOf(d), id: "custom", name: "Personalizada", colors: { ...paletteOf(d).colors, [t]: hex } } }), { key: `tok:${t}` });
  const setBg = (patch: Partial<Background>, key?: string) => patchSlide(slideIdx, (s) => ({ ...s, bg: { ...s.bg, ...patch } }), { key });

  const pickerLabel = picker?.type === "pick" ? (picker.field === "heroImage" ? "imagem principal do modelo" : "foto dos professores (clique em várias)") : picker?.type === "bg" ? "fundo do slide" : picker?.type === "layer" ? "imagem da camada selecionada" : null;
  const canUndo = histInfo.undo > 0;
  const canRedo = histInfo.redo > 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: "modelos", label: "Modelos" },
    { id: "elementos", label: "Elementos" },
    { id: "imagens", label: "Imagens" },
    { id: "fundo", label: "Fundo" },
    { id: "marca", label: "Marca/Legenda" },
  ];

  // ================================================================ render
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* barra superior */}
      <header className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2">
        <Link href="/admin" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)]">
          <ArrowLeft className="h-4 w-4" /> Painel
        </Link>
        <input
          value={design.name}
          onChange={(e) => commit((d) => ({ ...d, name: e.target.value }), { key: "name" })}
          className="min-w-[140px] flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-base font-bold hover:border-[var(--border)] focus:border-[var(--accent-soft)] focus:outline-none sm:max-w-xs"
          aria-label="Nome da propaganda"
        />
        <div className="flex gap-1">
          {FORMAT_ORDER.map((f) => (
            <button key={f} type="button" title={FORMATS[f].hint} onClick={() => changeFormat(f)} className={cn("cursor-pointer rounded-md px-2 py-1.5 text-xs font-bold", design.format === f ? "bg-[var(--accent-soft)] text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]")}>
              {FORMATS[f].label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <TopBtn title="Desfazer (Ctrl+Z)" onClick={undo} disabled={!canUndo}><Undo2 className="h-4 w-4" /></TopBtn>
          <TopBtn title="Refazer (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}><Redo2 className="h-4 w-4" /></TopBtn>
          <TopBtn title="Zoom −" onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}><ZoomOut className="h-4 w-4" /></TopBtn>
          <TopBtn title="Zoom +" onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}><ZoomIn className="h-4 w-4" /></TopBtn>
          <TopBtn title="Abrir peças salvas" onClick={openSaved}><FolderOpen className="h-4 w-4" /> <span className="hidden md:inline">Abrir</span></TopBtn>
          <button type="button" onClick={() => save(false)} disabled={saving} className="flex cursor-pointer items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-sm font-bold hover:bg-[var(--surface-2)] disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Salvando…" : "Salvar"}
          </button>
          <button type="button" onClick={() => exportCurrent(1)} disabled={busy} className="flex cursor-pointer items-center gap-1 rounded-md bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50">
            <Download className="h-4 w-4" /> Baixar PNG
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* painel esquerdo */}
        <aside className="flex max-h-[42vh] w-full shrink-0 flex-col border-b border-[var(--border)] bg-[var(--surface)] lg:max-h-none lg:w-[330px] lg:border-b-0 lg:border-r">
          <nav className="flex shrink-0 overflow-x-auto border-b border-[var(--border)]">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn("cursor-pointer whitespace-nowrap px-3 py-2.5 text-xs font-bold", tab === t.id ? "border-b-2 border-[var(--accent-soft)] text-[var(--accent-soft)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]")}>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "modelos" && (
              <TemplatesPanel
                language={design.language}
                data={data}
                picks={picks}
                setPicks={setPicks}
                hasSource={!!design.source}
                loading={loadingLang}
                onLanguage={changeLanguage}
                onApply={applyTemplate}
                onReapply={reapply}
                onPickImage={(field) => {
                  setPicker({ type: "pick", field });
                  setTab("imagens");
                }}
                onUploadPick={onUploadPick}
              />
            )}
            {tab === "elementos" && <ElementsPanel onAdd={addLayer} onAddEmoji={addEmoji} />}
            {tab === "imagens" && (
              <ImagesPanel
                images={data.images}
                selectedLabel={selected && (selected.kind === "image" || selected.kind === "phone") ? selected.name : null}
                onAdd={onLibraryClick}
                onBackground={applyAsBackground}
                onUseSelected={applyToSelected}
                onUpload={onUpload}
                pickerFor={pickerLabel}
                onCancelPicker={() => setPicker(null)}
              />
            )}
            {tab === "fundo" && (
              <BackgroundPanel
                bg={slide.bg}
                palette={palette}
                paletteId={design.paletteId}
                custom={!!design.customPalette}
                onBg={setBg}
                onPalette={setPalette}
                onToken={setToken}
                onPickBgImage={() => {
                  setPicker({ type: "bg" });
                  setTab("imagens");
                }}
              />
            )}
            {tab === "marca" && (
              <BrandPanel
                brand={brand}
                setBrand={setBrand}
                caption={design.caption}
                setCaption={(c) => commit((d) => ({ ...d, caption: c }), { key: "caption" })}
                onGenerate={() => commit((d) => ({ ...d, caption: buildCaption(d.language, brand, d.name.split("·")[0].trim()) }))}
                language={design.language}
                onReapplyBrand={() => {
                  const d = designRef.current;
                  if (d.source) reapply();
                  else commit((cur) => ({ ...cur, brand }));
                }}
              />
            )}
          </div>
        </aside>

        {/* centro: palco */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div ref={areaRef} className="relative flex min-h-[320px] flex-1 items-center justify-center overflow-auto bg-[radial-gradient(circle_at_center,var(--surface-2),var(--bg))] p-4">
            <div
              ref={stageRef}
              className="relative shrink-0 touch-none select-none shadow-2xl ring-1 ring-black/20"
              style={{ width: stageW, height: stageH }}
              onPointerDown={onStageDown}
              onPointerMove={onStageMove}
              onPointerUp={onStageUp}
              onPointerCancel={onStageUp}
              onDoubleClick={onStageDouble}
            >
              <canvas ref={canvasRef} width={fmt.w} height={fmt.h} className="pointer-events-none absolute inset-0 h-full w-full" />
              {/* zonas seguras do story */}
              {design.format === "story" && showSafe && (
                <>
                  <div className="pointer-events-none absolute inset-x-0 top-0 border-b border-dashed border-white/80 bg-black/25" style={{ height: `${(STORY_SAFE.top / fmt.h) * 100}%` }}>
                    <span className="m-1 block text-[10px] font-bold text-white/90">Zona coberta pelo perfil do Instagram</span>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-dashed border-white/80 bg-black/25" style={{ height: `${(STORY_SAFE.bottom / fmt.h) * 100}%` }}>
                    <span className="m-1 block text-[10px] font-bold text-white/90">Zona coberta por “Enviar mensagem”</span>
                  </div>
                </>
              )}
              {guides.x !== undefined && <div className="pointer-events-none absolute inset-y-0 w-px bg-fuchsia-500" style={{ left: `${(guides.x / fmt.w) * 100}%` }} />}
              {guides.y !== undefined && <div className="pointer-events-none absolute inset-x-0 h-px bg-fuchsia-500" style={{ top: `${(guides.y / fmt.h) * 100}%` }} />}
              {selected && !selected.hidden && (
                <div
                  className="pointer-events-none absolute border-2 border-sky-400"
                  style={{
                    left: `${(selected.x / fmt.w) * 100}%`,
                    top: `${(selected.y / fmt.h) * 100}%`,
                    width: `${(selected.w / fmt.w) * 100}%`,
                    height: `${(selected.h / fmt.h) * 100}%`,
                    transform: `rotate(${selected.rotation}deg)`,
                  }}
                >
                  {!selected.locked && (
                    <>
                      {(["nw", "ne", "sw", "se"] as Handle[]).map((h) => (
                        <span
                          key={h}
                          onPointerDown={(e) => startHandle(e, "resize", h)}
                          className="pointer-events-auto absolute h-3.5 w-3.5 rounded-sm border-2 border-sky-500 bg-white"
                          style={{ left: h.includes("w") ? -8 : undefined, right: h.includes("e") ? -8 : undefined, top: h.includes("n") ? -8 : undefined, bottom: h.includes("s") ? -8 : undefined, cursor: h === "nw" || h === "se" ? "nwse-resize" : "nesw-resize" }}
                        />
                      ))}
                      <span onPointerDown={(e) => startHandle(e, "rotate")} className="pointer-events-auto absolute -top-8 left-1/2 h-4 w-4 -translate-x-1/2 cursor-grab rounded-full border-2 border-sky-500 bg-white" title="Girar (Shift = passos de 15°)" />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* faixa de slides */}
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            {design.slides.map((s, i) => (
              <button key={s.id} type="button" onClick={() => { setSlideIdx(i); setSelId(null); }} className={cn("shrink-0 cursor-pointer rounded-md border px-3 py-1.5 text-xs font-bold", i === slideIdx ? "border-[var(--accent-soft)] bg-[var(--accent-soft)] text-white" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]")}>
                {i + 1}. {s.name.replace(/^\d+\s*·\s*/, "").slice(0, 18)}
              </button>
            ))}
            <TopBtn title="Novo slide em branco" onClick={addSlide}><Plus className="h-4 w-4" /></TopBtn>
            <TopBtn title="Duplicar slide" onClick={duplicateSlide}><Copy className="h-4 w-4" /></TopBtn>
            <TopBtn title="Mover para a esquerda" onClick={() => moveSlide(-1)}><ChevronLeft className="h-4 w-4" /></TopBtn>
            <TopBtn title="Mover para a direita" onClick={() => moveSlide(1)}><ChevronRight className="h-4 w-4" /></TopBtn>
            <TopBtn title="Excluir slide" onClick={deleteSlide}><Trash2 className="h-4 w-4 text-red-600" /></TopBtn>
            <span className="mx-1 h-5 w-px bg-[var(--border)]" />
            <TopBtn title="Baixar todos os slides" onClick={exportAll} disabled={busy}><Download className="h-4 w-4" /> <span className="hidden md:inline">Todos ({design.slides.length})</span></TopBtn>
            <TopBtn title="Baixar em alta resolução (2160 px)" onClick={() => exportCurrent(2)} disabled={busy}>HD</TopBtn>
            <TopBtn title="Copiar imagem" onClick={copyImage}><Copy className="h-4 w-4" /> <span className="hidden md:inline">Copiar imagem</span></TopBtn>
            <TopBtn title="Compartilhar pelo celular (Instagram, Facebook…)" onClick={shareFiles} disabled={busy}><Share2 className="h-4 w-4" /> <span className="hidden md:inline">Compartilhar</span></TopBtn>
            {design.format === "story" && (
              <label className="flex shrink-0 cursor-pointer items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]">
                <input type="checkbox" checked={showSafe} onChange={(e) => setShowSafe(e.target.checked)} /> Zonas seguras
              </label>
            )}
            <span className="ml-auto flex shrink-0 gap-3 text-xs font-semibold">
              <a href="https://business.facebook.com/latest/composer" target="_blank" rel="noreferrer" className="text-[var(--accent-soft)] underline">Publicar no Facebook/Instagram (Meta Business Suite)</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="text-[var(--accent-soft)] underline">Instagram</a>
            </span>
          </div>
        </main>

        {/* painel direito */}
        <aside className={cn("flex w-full shrink-0 flex-col border-t border-[var(--border)] bg-[var(--surface)] lg:w-[300px] lg:border-l lg:border-t-0", rightOpen ? "max-h-[45vh] lg:max-h-none" : "max-h-[44px] lg:max-h-none")}>
          <button type="button" onClick={() => setRightOpen((v) => !v)} className="flex shrink-0 cursor-pointer items-center justify-between border-b border-[var(--border)] px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] lg:hidden">
            Camadas e propriedades {rightOpen ? <X className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
          </button>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="border-b border-[var(--border)] p-2">
              <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">Camadas (de cima para baixo)</p>
              <ul className="max-h-48 space-y-0.5 overflow-y-auto">
                {[...slide.layers].reverse().map((l) => (
                  <li key={l.id}>
                    <button type="button" onClick={() => setSelId(l.id)} className={cn("flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 text-left text-xs", l.id === selId ? "bg-sky-100 font-bold text-sky-900" : "hover:bg-[var(--surface-2)]", l.hidden && "opacity-50")}>
                      <span className="rounded bg-[var(--surface-2)] px-1 text-[9px] font-bold uppercase text-[var(--text-muted)]">{LAYER_KIND_LABEL[l.kind]}</span>
                      <span className="truncate">{l.name}</span>
                      {l.locked && <span>🔒</span>}
                    </button>
                  </li>
                ))}
                {slide.layers.length === 0 && <li className="px-2 py-1 text-xs text-[var(--text-muted)]">Slide vazio — adicione elementos na aba “Elementos”.</li>}
              </ul>
            </div>
            <Inspector
              layer={selected}
              palette={palette}
              images={data.images}
              onChange={(patch, key) => selected && patchLayer(selected.id, patch, { key })}
              onPickImage={() => {
                setPicker({ type: "layer" });
                setTab("imagens");
              }}
              onDelete={() => deleteLayer()}
              onDuplicate={() => duplicateLayer()}
              onOrder={(dir) => selected && orderLayer(selected.id, dir)}
              onAlign={alignLayer}
            />
          </div>
        </aside>
      </div>

      {toast && <div className="pointer-events-none fixed bottom-20 left-1/2 z-[70] max-w-[90vw] -translate-x-1/2 rounded-lg bg-black/85 px-4 py-2 text-sm font-semibold text-white shadow-lg">{toast}</div>}

      {showSaved && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSaved(false)}>
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-[var(--surface)] p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold">Propagandas salvas</h3>
              <div className="flex gap-2">
                {savedId && <button type="button" onClick={() => { setShowSaved(false); void save(true); }} className="cursor-pointer rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-semibold hover:bg-[var(--surface-2)]">Salvar cópia da atual</button>}
                <button type="button" onClick={() => setShowSaved(false)} className="cursor-pointer rounded-md p-1.5 hover:bg-[var(--surface-2)]"><X className="h-5 w-5" /></button>
              </div>
            </div>
            {savedList === null && <p className="text-sm text-[var(--text-muted)]">Carregando…</p>}
            {savedList && savedList.length === 0 && <p className="text-sm text-[var(--text-muted)]">Nenhuma peça salva ainda. Clique em “Salvar” para guardar a propaganda atual.</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {savedList?.map((item) => (
                <div key={item._id} className="overflow-hidden rounded-lg border border-[var(--border)]">
                  <button type="button" onClick={() => loadSaved(item)} className="block w-full cursor-pointer bg-[var(--surface-2)]">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnail} alt={item.name} className="mx-auto h-40 w-full object-contain" />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-3xl">📣</div>
                    )}
                  </button>
                  <div className="flex items-center justify-between gap-1 p-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">{item.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{item.language === "kreyol" ? "🇭🇹" : "🇫🇷"} {FORMATS[item.format as FormatId]?.label ?? item.format} · {item.slideCount} slide(s)</p>
                    </div>
                    <button type="button" onClick={() => deleteSaved(item)} className="cursor-pointer rounded p-1 text-red-600 hover:bg-red-50" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TopBtn({ children, onClick, title, disabled }: { children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} disabled={disabled} className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-40">
      {children}
    </button>
  );
}
