/**
 * Divide uma cena SVG animada (animações CSS) em camadas para tocar e exportar com fluidez:
 *
 *  - below : tudo que fica ATRÁS dos elementos animados (céu, montanhas, nuvens...) — imagem estática, rasterizada uma vez;
 *  - mid   : os elementos animados (drone, moinho, robô, pássaros...) e o que está entre eles — o único pedaço redesenhado;
 *  - above : tudo que fica NA FRENTE (primeiro plano) — imagem estática, rasterizada uma vez.
 *
 * A ordem de pintura do SVG é preservada, então o resultado é idêntico ao SVG original.
 */

export interface SvgLayerKit {
  /** Marcação da camada de baixo (null se não houver nada atrás dos animados). */
  below: string | null;
  /** Marcação da camada da frente (null se não houver nada na frente dos animados). */
  above: string | null;
  /** Camada animada com as animações CSS VIVAS — para o player (HTML inline). */
  live: string;
  /** Camada animada CONGELADA no instante `seconds` — para a exportação (imagem). */
  frozen: (seconds: number) => string;
}

const PAINTED = "path,rect,circle,ellipse,line,polyline,polygon,text,image,use";
const NOT_PAINTED = "defs,clipPath,mask,pattern,symbol,marker,filter,linearGradient,radialGradient";
const ATTR = "data-sl";

function stripKeyframes(css: string): string {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@", i);
    if (at === -1) {
      out += css.slice(i);
      break;
    }
    if (!/^@(-\w+-)?keyframes/i.test(css.slice(at, at + 24))) {
      out += css.slice(i, at + 1);
      i = at + 1;
      continue;
    }
    out += css.slice(i, at);
    const open = css.indexOf("{", at);
    if (open === -1) break;
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    i = j;
  }
  return out;
}

function animatedSelectorsFrom(css: string): string[] {
  const clean = stripKeyframes(css.replace(/\/\*[\s\S]*?\*\//g, ""));
  const selectors: string[] = [];
  const rule = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = rule.exec(clean))) {
    const selectorText = match[1].trim();
    if (!selectorText || selectorText.startsWith("@")) continue;
    if (!/(?:^|[;\s])animation(?:-name)?\s*:\s*(?!none\b)[^;]+/i.test(match[2])) continue;
    for (const part of selectorText.split(",")) {
      const selector = part.trim();
      if (selector && !selector.includes(":")) selectors.push(selector);
    }
  }
  return selectors;
}

/** Devolve null quando o SVG não tem animação CSS (ou não pôde ser analisado): nesse caso use a imagem como está. */
export function buildSvgLayerKit(svgText: string): SvgLayerKit | null {
  if (typeof DOMParser === "undefined" || typeof XMLSerializer === "undefined") return null;
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const root = doc.documentElement;
    if (!root || root.nodeName.toLowerCase() !== "svg" || doc.querySelector("parsererror")) return null;

    const css = Array.from(doc.querySelectorAll("style")).map((node) => node.textContent ?? "").join("\n");
    const selectors = animatedSelectorsFrom(css).filter((selector) => {
      try {
        doc.querySelector(selector);
        return true;
      } catch {
        return false;
      }
    });
    if (!selectors.length) return null;
    const animatedSelector = selectors.join(",");

    const leaves = Array.from(doc.querySelectorAll(PAINTED)).filter((el) => !el.closest(NOT_PAINTED));
    const isAnimated = leaves.map((el) => {
      try {
        return el.closest(animatedSelector) !== null;
      } catch {
        return false;
      }
    });
    const first = isAnimated.indexOf(true);
    const last = isAnimated.lastIndexOf(true);
    if (first === -1) return null;

    let belowCount = 0;
    let aboveCount = 0;
    leaves.forEach((el, index) => {
      if (index < first) {
        el.setAttribute(ATTR, "b");
        belowCount++;
      } else if (index > last) {
        el.setAttribute(ATTR, "a");
        aboveCount++;
      } else {
        el.setAttribute(ATTR, "m");
      }
    });

    const serialized = new XMLSerializer().serializeToString(root);
    const openTag = /<svg\b[^>]*>/.exec(serialized);
    if (!openTag) return null;
    const cut = openTag.index + openTag[0].length;
    const inject = (rules: string, tag = openTag[0]) =>
      serialized.slice(0, openTag.index) + tag + `<style>${rules}</style>` + serialized.slice(cut);

    const only = (key: string) => `[${ATTR}]{visibility:hidden!important}[${ATTR}="${key}"]{visibility:visible!important}`;
    const noMotion = "*{animation:none!important}";
    const liveTag = openTag[0]
      .replace(/\spreserveAspectRatio="[^"]*"/, "")
      .replace(/>$/, ' preserveAspectRatio="xMidYMid slice">');

    return {
      below: belowCount ? inject(only("b") + noMotion) : null,
      above: aboveCount ? inject(only("a") + noMotion) : null,
      live: inject(only("m"), liveTag),
      frozen: (seconds: number) =>
        inject(only("m") + `*{animation-delay:-${Math.max(0, seconds).toFixed(3)}s!important;animation-play-state:paused!important}`),
    };
  } catch {
    return null;
  }
}

/** Carrega uma marcação SVG como imagem. Nunca fica pendurada: devolve null se passar do tempo. */
export function loadSvgImage(markup: string, timeoutMs = 1500): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.crossOrigin = "anonymous";
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (ok) {
        img.dataset.blobUrl = url;
        resolve(img);
      } else {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    const timer = setTimeout(() => finish(false), timeoutMs);
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = url;
  });
}

export function releaseSvgImage(img: HTMLImageElement | null | undefined) {
  const url = img?.dataset.blobUrl;
  if (url) URL.revokeObjectURL(url);
}

/** Rasteriza uma camada estática uma única vez (desenhar um canvas é muito mais barato do que re-renderizar o SVG). */
export function rasterizeLayer(img: HTMLImageElement, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
}
