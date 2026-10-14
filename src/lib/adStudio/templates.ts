// Modelos prontos do Estúdio de Propagandas. Cada modelo monta um ou mais slides a partir
// dos dados REAIS da plataforma (lições, imagens, níveis, conquistas, desafios) e do idioma.
import type { AppLanguage } from "@/lib/languageShared";
import { buildCaption, cleanUrl, COPY } from "./content";
import {
  buttonLayer,
  cardLayer,
  imageLayer,
  listLayer,
  newSlide,
  phoneLayer,
  shapeLayer,
  textLayer,
} from "./layers";
import type {
  AdChallenge,
  AdData,
  AdLesson,
  Background,
  Brand,
  FormatInfo,
  Layer,
  LibImage,
  Picks,
  Slide,
} from "./types";

export type { Picks };

export interface TemplateCtx {
  language: AppLanguage;
  format: FormatInfo;
  brand: Brand;
  data: AdData;
  picks: Picks;
}

export interface TemplateResult {
  slides: Slide[];
  caption: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  emoji: string;
  slides: number;
  languages: AppLanguage[];
  build: (ctx: TemplateCtx) => TemplateResult;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Mode = "stack" | "split";
type VisualFn = (box: Box, c: Resolved, mode: Mode) => Layer[];

interface Resolved extends TemplateCtx {
  lesson?: AdLesson;
  hero?: LibImage;
  gameImg?: LibImage;
  teacher?: LibImage;
  challenge?: AdChallenge;
  copy: (typeof COPY)[AppLanguage];
}

interface Spec {
  a: string;
  b?: string;
  sub?: string;
  bullets?: string[];
  cta: string;
  ctaIcon?: string;
  visual?: VisualFn;
  bg?: Partial<Background>;
  counter?: string;
  name: string;
  glow?: boolean;
}

// ---------------------------------------------------------------------------
// Resolução de escolhas (valores padrão a partir dos dados da plataforma)
// ---------------------------------------------------------------------------
function resolve(ctx: TemplateCtx): Resolved {
  const { data, picks, language } = ctx;
  const byId = (id?: string) => data.images.find((i) => i.id === id || i.src === id);
  const ghibli = data.images.filter((i) => i.kind === "ghibli" || i.kind === "generated");
  const prefer = language === "kreyol" ? "cultura" : "turismo";
  const hero = byId(picks.heroImage) ?? ghibli.find((i) => i.id === prefer) ?? ghibli[0];
  const challenge = data.challenges.find((c) => c.id === picks.challengeId) ?? data.challenges[0];
  const teachers = data.images.filter((i) => i.kind === "teacher");
  const teacher = byId(picks.teacherImage) ?? teachers.find((t) => t.id.includes("studio")) ?? teachers[0];
  const gameImg = byId(picks.gameImage);
  const lesson = data.lessons.find((l) => l.id === picks.lessonId) ?? data.lessons[0];
  return { ...ctx, hero, challenge, teacher, gameImg, lesson, copy: COPY[language] };
}

function estLines(text: string, size: number, width: number): number {
  const perLine = Math.max(4, Math.floor(width / (size * 0.5)));
  const words = text.split(/\s+/);
  let lines = 1;
  let cur = 0;
  for (const w of words) {
    const len = w.length + (cur ? 1 : 0);
    if (cur + len > perLine && cur > 0) {
      lines += 1;
      cur = w.length;
    } else cur += len;
  }
  return lines;
}

// ---------------------------------------------------------------------------
// Composição: texto + visual + CTA, adaptando ao formato (empilhado ou em duas colunas)
// ---------------------------------------------------------------------------
function compose(spec: Spec, c: Resolved): Slide {
  const { w: W, h: H, id: fid } = c.format;
  const story = fid === "story";
  const wide = fid === "landscape";
  const mode: Mode = fid === "square" || wide ? "split" : "stack";
  const layers: Layer[] = [];
  const url = cleanUrl(c.brand.url);

  const m = mode === "stack" ? 64 : wide ? 44 : 56;
  const top = story ? 250 : mode === "stack" ? 56 : m;
  const bottom = story ? H - 340 : H - (mode === "stack" ? 52 : m);

  const leftW = mode === "stack" ? W - m * 2 : wide ? 556 : 500;
  const lx = m;
  const hs0 = mode === "stack" ? (story ? 100 : 90) : wide ? 50 : 64;
  const ss = mode === "stack" ? 40 : wide ? 23 : 30;
  const ctaH = mode === "stack" ? (story ? 120 : 104) : wide ? 62 : 90;
  const footH = url || c.brand.contact ? (wide ? 28 : 38) : 0;
  const barH = wide ? 40 : mode === "split" ? 46 : 54;

  // Barra de marca
  layers.push(
    textLayer(`${c.brand.name ? "🎓 " + c.brand.name : ""}`, lx, top, leftW * (mode === "stack" ? 0.55 : 0.5), barH, {
      name: "Marca",
      size: wide ? 24 : 32,
      valign: "middle",
      color: "@light",
    }),
    textLayer(`${c.copy.flag} ${c.copy.name}`, lx + leftW * (mode === "stack" ? 0.5 : 0.46), top, leftW * (mode === "stack" ? 0.5 : 0.54), barH, {
      name: "Idioma",
      size: wide ? 22 : 30,
      align: "center",
      valign: "middle",
      color: "@dark",
      bgColor: "@primary",
      bgPadding: wide ? 10 : 12,
      bgRadius: 40,
      autoFit: true,
    })
  );
  // O texto do idioma fica ancorado à direita: ajusta a caixa para encostar na borda.
  const chip = layers[layers.length - 1] as Layer & { x: number; w: number };
  chip.w = leftW * (mode === "stack" ? 0.5 : 0.54);
  chip.x = lx + leftW - chip.w;
  (chip as unknown as { align: string }).align = "right";

  // Título
  let y = top + barH + (wide ? 18 : 34);
  let hs = hs0;
  const linesA = () => estLines(spec.a, hs, leftW);
  const linesB = () => (spec.b ? estLines(spec.b, hs, leftW) : 0);
  const maxLines = wide ? 4 : 4;
  while (linesA() + linesB() > maxLines && hs > 38) hs -= 4;
  const hA = Math.ceil(linesA() * hs * 1.08);
  const hB = spec.b ? Math.ceil(linesB() * hs * 1.08) : 0;
  layers.push(
    textLayer(spec.a, lx, y, leftW, hA, { name: "Título", size: hs, weight: 900, lineHeight: 1.06, letterSpacing: -1, shadow: true })
  );
  y += hA;
  if (spec.b) {
    layers.push(
      textLayer(spec.b, lx, y, leftW, hB, { name: "Título 2", size: hs, weight: 900, lineHeight: 1.06, letterSpacing: -1, color: "@primary", shadow: true })
    );
    y += hB;
  }
  y += wide ? 10 : 18;
  if (spec.sub) {
    const sl = estLines(spec.sub, ss, leftW);
    const sh = Math.ceil(sl * ss * 1.25);
    layers.push(textLayer(spec.sub, lx, y, leftW, sh, { name: "Subtítulo", size: ss, weight: 600, lineHeight: 1.22, opacity: 0.94 }));
    y += sh + (wide ? 8 : 16);
  }

  // Rodapé e botão
  const footY = bottom - footH;
  const ctaY = footY - (footH ? 16 : 0) - ctaH;
  if (footH) {
    const footText = [url, c.brand.contact].filter(Boolean).join("   •   ");
    layers.push(
      textLayer(footText, lx, footY, leftW, footH, {
        name: "Link",
        size: wide ? 20 : 28,
        weight: 700,
        align: mode === "stack" ? "center" : "left",
        valign: "middle",
        opacity: 0.9,
      })
    );
  }
  if (spec.counter) {
    layers.push(
      textLayer(spec.counter, W - m - 200, footH ? footY : ctaY + ctaH + 8, 200, footH || 36, {
        name: "Contador",
        size: 26,
        align: "right",
        valign: "middle",
        opacity: 0.85,
      })
    );
  }
  layers.push(
    buttonLayer(spec.cta, lx, ctaY, leftW, ctaH, { name: "Botão CTA", icon: spec.ctaIcon ?? "", size: mode === "stack" ? (story ? 52 : 46) : wide ? 28 : 36 })
  );

  // Marcadores (lista)
  let bulletsBlock: Layer | undefined;
  const bulletSize = mode === "stack" ? 38 : 30;
  if (spec.bullets?.length && !wide) {
    const n = spec.bullets.length;
    const bh = n * Math.round(bulletSize * 1.28) + (n - 1) * 12;
    bulletsBlock = listLayer(spec.bullets, lx, ctaY - 28 - bh, leftW, bh, { name: "Benefícios", size: bulletSize, gap: 12 });
  }

  // Área do visual
  let box: Box;
  if (mode === "stack") {
    const y1 = (bulletsBlock ? bulletsBlock.y : ctaY) - 26;
    box = { x: m, y, w: W - m * 2, h: y1 - y };
    if (box.h < 560 && bulletsBlock) {
      bulletsBlock = undefined;
      box = { x: m, y, w: W - m * 2, h: ctaY - 26 - y };
    }
  } else {
    const rx = lx + leftW + (wide ? 24 : 28);
    box = { x: rx, y: m, w: W - rx - m, h: H - m * 2 };
    if (bulletsBlock) {
      const room = bulletsBlock.y - y;
      if (room < bulletsBlock.h) bulletsBlock = undefined;
    }
  }
  if (bulletsBlock) layers.push(bulletsBlock);

  if (spec.visual && box.h > 120) {
    if (spec.glow !== false) {
      const d = Math.min(box.w, box.h) * 1.05;
      layers.unshift(
        shapeLayer(box.x + (box.w - d) / 2, box.y + (box.h - d) / 2, d, d, {
          name: "Brilho",
          shape: "circle",
          fill: "@light",
          opacity: 0.14,
          locked: false,
        })
      );
    }
    layers.push(...spec.visual(box, c, mode));
  }

  return newSlide(spec.name, layers, { pattern: "dots", patternOpacity: 0.07, ...spec.bg });
}

// ---------------------------------------------------------------------------
// Visuais reutilizáveis
// ---------------------------------------------------------------------------
function chip(text: string, x: number, y: number, w: number, rot: number, fill = "@light"): Layer {
  return textLayer(text, x, y, w, 70, {
    name: "Selo",
    size: 32,
    weight: 900,
    color: "@dark",
    align: "center",
    valign: "middle",
    bgColor: fill,
    bgPadding: 16,
    bgRadius: 40,
    rotation: rot,
    shadow: true,
  });
}

function phoneVisual(
  screen: "lessons" | "game" | "ranking" | "video" | "story" | "live" | "achievements",
  props: { title?: string; items?: string[]; imageSrc?: string },
  chips: { text: string; side: "left" | "right"; t: number }[] = []
): VisualFn {
  return (box, _c, mode) => {
    const ph = Math.min(box.h, box.w / 0.49, 1120);
    const pw = Math.round(ph * 0.49);
    const px = box.x + (box.w - pw) / 2;
    const py = box.y + (box.h - ph) / 2;
    const out: Layer[] = [
      phoneLayer(screen, px, py, ph, { title: props.title ?? "", items: props.items ?? [], imageSrc: props.imageSrc ?? "", accentColor: "@bg2", rotation: 0 }),
    ];
    const room = (box.w - pw) / 2;
    if (mode === "stack" && room > 250) {
      chips.forEach((ch) => {
        const w = Math.min(room + 90, 400);
        const x = ch.side === "left" ? px - w + 34 : px + pw - 34;
        out.push(chip(ch.text, x, py + ph * ch.t, w, ch.side === "left" ? -6 : 6));
      });
    }
    return out;
  };
}

function heroVisual(): VisualFn {
  return (box, c, mode) => {
    const ih = mode === "split" ? Math.min(box.h, box.w * 1.45) : box.h;
    const iy = box.y + (box.h - ih) / 2;
    const out: Layer[] = [];
    if (c.hero) {
      out.push(imageLayer(c.hero.src, box.x, iy, box.w, ih, { name: "Imagem principal", borderWidth: 10, radius: 48, shadow: true, focusX: 50, focusY: 55 }));
    }
    if (c.teacher) {
      const d = Math.round(Math.min(box.w, ih) * (mode === "split" ? 0.42 : 0.36));
      const tx = box.x + (mode === "split" ? 14 : 28);
      const ty = iy + ih - d - (mode === "split" ? 14 : 28);
      out.push(
        imageLayer(c.teacher.src, tx, ty, d, d, {
          name: "Foto do professor",
          radius: d / 2,
          borderWidth: 10,
          focusX: 50,
          focusY: 16,
          zoom: 1.25,
          shadow: true,
        })
      );
      if (c.brand.name) {
        out.push(
          textLayer(c.brand.name, tx + d - 8, ty + d * 0.58, Math.min(box.w - d - 40, 420), 66, {
            name: "Nome",
            size: 30,
            color: "@dark",
            bgColor: "@primary",
            bgPadding: 14,
            bgRadius: 36,
            valign: "middle",
            align: "center",
            shadow: true,
          })
        );
      }
    }
    return out;
  };
}

function gridVisual(): VisualFn {
  return (box, c) => {
    const feats = c.copy.features;
    const cols = box.w > 700 ? 2 : box.h / feats.length < 130 ? 2 : 1;
    const rows = Math.ceil(feats.length / cols);
    const gap = 18;
    const cw = (box.w - gap * (cols - 1)) / cols;
    const ch = (box.h - gap * (rows - 1)) / rows;
    const layout = cw < 340 ? "column" : "row";
    return feats.map((f, i) =>
      cardLayer(box.x + (i % cols) * (cw + gap), box.y + Math.floor(i / cols) * (ch + gap), cw, ch, {
        name: f.title,
        icon: f.icon,
        title: f.title,
        desc: f.desc,
        layout,
        accentColor: i % 2 ? "@accent" : "@bg2",
      })
    );
  };
}

function optionsVisual(ch: AdChallenge, reveal: boolean): VisualFn {
  return (box, c, mode) => {
    const out: Layer[] = [];
    const n = ch.options.length;
    const gap = 16;
    const portrait = c.data.images.find((i) => i.src === ch.image)?.portrait || ch.image.includes("question");
    let imgBox: Box;
    let optBox: Box;
    if (mode === "stack") {
      const iw = Math.round(box.w * 0.46);
      imgBox = { x: box.x, y: box.y, w: iw, h: box.h };
      optBox = { x: box.x + iw + 24, y: box.y, w: box.w - iw - 24, h: box.h };
    } else {
      const ih = Math.round(box.h * (portrait ? 0.56 : 0.44));
      imgBox = { x: box.x, y: box.y, w: box.w, h: ih };
      optBox = { x: box.x, y: box.y + ih + 18, w: box.w, h: box.h - ih - 18 };
    }
    out.push(
      imageLayer(reveal && ch.answerImage ? ch.answerImage : ch.image, imgBox.x, imgBox.y, imgBox.w, imgBox.h, {
        name: "Imagem do desafio",
        borderWidth: 8,
        radius: 40,
        shadow: true,
        focusY: portrait ? 35 : 50,
      })
    );
    const bh = Math.min(130, (optBox.h - gap * (n - 1)) / n);
    const total = bh * n + gap * (n - 1);
    const oy = optBox.y + (optBox.h - total) / 2;
    ch.options.forEach((opt, i) => {
      const ok = opt === ch.correct;
      const dim = reveal && !ok;
      out.push(
        buttonLayer(`${reveal && ok ? "✅ " : ""}${opt}`, optBox.x, oy + i * (bh + gap), optBox.w, bh, {
          name: `Opção ${i + 1}`,
          fill: reveal ? (ok ? "#22c55e" : "#94a3b8") : "@card",
          fill2: reveal ? (ok ? "#16a34a" : "#64748b") : "@card",
          color: reveal ? "#ffffff" : "@cardText",
          size: 38,
          arrow: false,
          radius: 36,
          opacity: dim ? 0.8 : 1,
        })
      );
    });
    return out;
  };
}

function wordVisual(c: Resolved): VisualFn {
  const w = c.copy.words[(c.picks.wordIndex ?? 0) % c.copy.words.length];
  return (box) => {
    const out: Layer[] = [];
    out.push(shapeLayer(box.x, box.y, box.w, box.h, { name: "Cartão da palavra", fill: "@card", radius: 56, shadow: true }));
    const px = box.x + 36;
    const pw = box.w - 72;
    out.push(
      textLayer("PALAVRA DO DIA", px, box.y + box.h * 0.07, pw, box.h * 0.07, { size: 28, color: "@bg2", align: "center", valign: "middle", letterSpacing: 4 }),
      textLayer(w.term, px, box.y + box.h * 0.16, pw, box.h * 0.22, { name: "Palavra", size: 120, weight: 900, color: "@cardText", align: "center", valign: "middle", letterSpacing: -2 }),
      textLayer(`= ${w.pt}`, px, box.y + box.h * 0.38, pw, box.h * 0.1, { name: "Tradução", size: 54, weight: 700, color: "@bg2", align: "center", valign: "middle" }),
      shapeLayer(box.x + box.w * 0.3, box.y + box.h * 0.52, box.w * 0.4, 6, { name: "Linha", fill: "@primary", radius: 3 }),
      textLayer(`“${w.example}”`, px, box.y + box.h * 0.56, pw, box.h * 0.18, { name: "Exemplo", size: 50, weight: 700, italic: true, color: "@cardText", align: "center", valign: "middle" }),
      textLayer(w.examplePt, px, box.y + box.h * 0.76, pw, box.h * 0.14, { name: "Exemplo (PT)", size: 38, weight: 600, color: "@cardText", align: "center", valign: "middle", opacity: 0.75 })
    );
    return out;
  };
}

// ---------------------------------------------------------------------------
// Dados auxiliares dos mockups
// ---------------------------------------------------------------------------
function lessonItems(c: Resolved): string[] {
  const list = [...c.data.lessons];
  if (c.lesson) {
    const idx = list.findIndex((l) => l.id === c.lesson!.id);
    if (idx > 0) list.unshift(...list.splice(idx, 1));
  }
  return list.slice(0, 7).map((l) => `${l.title}|${l.category}`);
}

function gameItems(c: Resolved): { items: string[]; image: string } {
  const ch = c.challenge;
  if (!ch) return { items: [], image: c.hero?.src ?? "" };
  const items = ch.options.map((o) => (o === ch.correct ? `✓ ${o}` : o));
  return { items, image: ch.image };
}

function badgeItems(c: Resolved): string[] {
  return c.data.badges.slice(0, 6).map((b) => `${b.emoji}|${b.native}`);
}

function levelTitle(c: Resolved): string {
  const lv = c.data.levels[Math.min(4, c.data.levels.length - 1)];
  return lv ? `${lv.emoji}|${lv.native}` : "👑|Nível";
}

// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------
const hero: TemplateInfo = {
  id: "hero",
  name: "Apresentação do professor",
  description: "Gancho principal: foto do professor + cena ilustrada + benefícios e botão.",
  emoji: "👋",
  slides: 1,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const k = c.language === "kreyol";
    const slide = compose(
      {
        name: "Apresentação",
        a: k ? "Aprenda o idioma" : "Fale francês",
        b: k ? "do Haiti comigo" : "com confiança",
        sub: k
          ? "Lições, aulas em vídeo, aulas ao vivo, jogos e histórias animadas — tudo em um só lugar."
          : "Lições, aulas ao vivo, vídeos e o jogo C'est quoi ? para você evoluir de verdade.",
        bullets: k
          ? ["Do zero, no seu ritmo", "Aulas ao vivo e gravadas", "Jogos que dão conquistas"]
          : ["Da base à preparação para o DELF", "Aulas ao vivo e gravadas", "Jogo C'est quoi ? com ranking"],
        cta: "Comece agora",
        ctaIcon: "🚀",
        visual: heroVisual(),
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, k ? "Aprenda crioulo haitiano comigo!" : "Aprenda francês comigo!") };
  },
};

const features: TemplateInfo = {
  id: "features",
  name: "Tudo em um só app",
  description: "Grade com as 6 principais funcionalidades da plataforma.",
  emoji: "🧩",
  slides: 1,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const k = c.language === "kreyol";
    const slide = compose(
      {
        name: "Funcionalidades",
        a: "Tudo para você",
        b: "aprender de verdade",
        sub: k ? "Uma plataforma completa de Kreyòl, criada por um professor nativo." : "Uma plataforma completa de francês, criada por um professor nativo.",
        cta: "Quero começar",
        ctaIcon: "✨",
        visual: gridVisual(),
        glow: false,
        bg: { pattern: "diagonal", patternOpacity: 0.05 },
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, "Tudo o que você precisa para aprender em um só lugar!") };
  },
};

const game: TemplateInfo = {
  id: "game",
  name: "O jogo da plataforma",
  description: "Celular com o jogo (Jogo das Imagens ou C'est quoi ?) e selos de destaque.",
  emoji: "🎮",
  slides: 1,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const k = c.language === "kreyol";
    const g = gameItems(c);
    const slide = compose(
      {
        name: "Jogo",
        a: k ? "Aprenda" : "C'est quoi ?",
        b: k ? "brincando 🎮" : "O jogo que ensina francês",
        sub: k
          ? "No Jogo das Imagens você descobre as palavras certas em Kreyòl, ganha pontos e compartilha suas vitórias."
          : "Veja a imagem, escolha a palavra certa, use dicas e dispute o ranking com outros alunos.",
        bullets: k ? ["Cenas ilustradas de cultura, natureza e mais", "Sons de vitória e conquistas"] : ["Do nível Fácil ao Nativo", "Ranking com jogadores online"],
        cta: "Jogar agora",
        ctaIcon: "🎮",
        visual: phoneVisual("game", { title: k ? "Jogo das Imagens" : "C'est quoi ?", items: g.items, imageSrc: g.image }, [
          { text: k ? "🔥 Sequência de acertos" : "💡 Dicas em todos os níveis", side: "left", t: 0.22 },
          { text: k ? "🏆 Conquistas" : "🥇 Ranking online", side: "right", t: 0.62 },
        ]),
        bg: { pattern: "rays", patternOpacity: 0.08 },
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, k ? "Aprender brincando com o Jogo das Imagens!" : "C'est quoi ? O jogo que ensina francês!") };
  },
};

const lesson: TemplateInfo = {
  id: "lesson",
  name: "Lição em destaque",
  description: "Divulga uma lição real da plataforma (escolha qual) dentro da lista de lições.",
  emoji: "📚",
  slides: 1,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const l = c.lesson;
    const slide = compose(
      {
        name: "Lição",
        a: l ? "Nova lição:" : "Lições para",
        b: l ? l.title : "todos os níveis",
        sub: l ? `${l.category} · disponível agora na plataforma.` : "Estude com explicações claras e exercícios.",
        bullets: ["Explicações passo a passo", "Exemplos e exercícios", "Acompanhe seu progresso"],
        cta: "Estudar esta lição",
        ctaIcon: "📘",
        visual: phoneVisual("lessons", { title: c.language === "kreyol" ? "Lições de Kreyòl" : "Lições de Francês", items: lessonItems(c) }),
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, l ? `Nova lição disponível: ${l.title}` : "Lições novas na plataforma!") };
  },
};

const live: TemplateInfo = {
  id: "live",
  name: "Aulas ao vivo e em vídeo",
  description: "Celular com a aula ao vivo (foto do professor) e chat dos alunos.",
  emoji: "📡",
  slides: 1,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const slide = compose(
      {
        name: "Ao vivo",
        a: "Aulas ao vivo",
        b: "com o professor",
        sub: "Tire dúvidas em tempo real, pratique a conversação e reveja tudo depois nas aulas gravadas.",
        bullets: ["Interação ao vivo pelo celular", "Aulas gravadas para rever quando quiser"],
        cta: "Quero participar",
        ctaIcon: "📡",
        visual: phoneVisual("live", { title: "Escreva sua dúvida…", items: ["👥 ao vivo", ...c.copy.chat], imageSrc: c.teacher?.src ?? "" }, [
          { text: "🎥 Aulas gravadas", side: "left", t: 0.2 },
          { text: "💬 Chat ao vivo", side: "right", t: 0.66 },
        ]),
        bg: { pattern: "waves", patternOpacity: 0.1 },
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, "Aulas ao vivo e gravadas com o professor!") };
  },
};

const stories: TemplateInfo = {
  id: "stories",
  name: "Histórias animadas",
  description: "Mockup da história narrada em Kreyòl com legendas em português.",
  emoji: "✨",
  slides: 1,
  languages: ["kreyol"],
  build(ctx) {
    const c = resolve(ctx);
    const img = c.hero;
    const slide = compose(
      {
        name: "Histórias",
        a: "Histórias animadas",
        b: "em Kreyòl",
        sub: "Cada elemento da cena ganha vida, com narração em Kreyòl e legendas em português.",
        bullets: ["Treine o ouvido de forma divertida", "Baixe e compartilhe nas redes"],
        cta: "Ver as histórias",
        ctaIcon: "✨",
        visual: phoneVisual("story", { title: img?.title ?? "", items: (img?.elements ?? []).slice(0, 4), imageSrc: img?.src ?? "" }),
        bg: { pattern: "confetti", patternOpacity: 0.12 },
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, "Histórias animadas em Kreyòl com legendas em português!") };
  },
};

const progress: TemplateInfo = {
  id: "progress",
  name: "Níveis e conquistas",
  description: "Mostra os níveis e selos reais do idioma e o compartilhamento de vitórias.",
  emoji: "🏆",
  slides: 1,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const lv = c.data.levels;
    const first = lv[0]?.native ?? "";
    const last = lv[lv.length - 1]?.native ?? "";
    const slide = compose(
      {
        name: "Conquistas",
        a: "Suba de nível",
        b: "e ganhe conquistas",
        sub: "Cada acerto vale pontos. Desbloqueie selos e títulos e compartilhe suas vitórias.",
        bullets: [first && last ? `Do ${first} ao ${last}` : "Vários níveis para conquistar", "Selos e títulos para desbloquear", "Compartilhe no Instagram e Facebook"],
        cta: "Começar a evoluir",
        ctaIcon: "🏆",
        visual: phoneVisual("achievements", { title: levelTitle(c), items: badgeItems(c) }),
        bg: { pattern: "rays", patternOpacity: 0.07 },
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, "Suba de nível e desbloqueie conquistas!") };
  },
};

const ranking: TemplateInfo = {
  id: "ranking",
  name: "Ranking online",
  description: "Compita com outros alunos no C'est quoi ? (mockup do ranking).",
  emoji: "🥇",
  slides: 1,
  languages: ["francais"],
  build(ctx) {
    const c = resolve(ctx);
    const slide = compose(
      {
        name: "Ranking",
        a: "Desafie outros",
        b: "alunos online",
        sub: "Jogue o C'est quoi ? ao vivo contra outros jogadores e suba no ranking.",
        bullets: ["Pontuação em tempo real", "Níveis até o Nativo", "Dicas para destravar"],
        cta: "Entrar no ranking",
        ctaIcon: "🥇",
        visual: phoneVisual("ranking", { title: "Ranking", items: ["Ana|1.240", "Você|1.180", "Léo|980", "Bia|870", "Caio|760", "Duda|640"] }),
        bg: { pattern: "dots", patternOpacity: 0.09 },
      },
      c
    );
    return { slides: [slide], caption: buildCaption(c.language, c.brand, "Entre no ranking do C'est quoi ?") };
  },
};

const challenge: TemplateInfo = {
  id: "challenge",
  name: "Desafio + resposta (engajamento)",
  description: "2 slides: pergunta com opções e resposta revelada. Ótimo para gerar comentários.",
  emoji: "🧠",
  slides: 2,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const ch = c.challenge;
    if (!ch) return { slides: [], caption: "" };
    const q = compose(
      {
        name: "Desafio",
        a: ch.question,
        sub: "Comente sua resposta 👇 e arraste para ver o gabarito.",
        cta: "Ver a resposta",
        ctaIcon: "👉",
        visual: optionsVisual(ch, false),
        counter: "1/2  ➜",
        bg: { pattern: "confetti", patternOpacity: 0.1 },
      },
      c
    );
    const a = compose(
      {
        name: "Resposta",
        a: "Resposta:",
        b: ch.correct,
        sub: ch.explain,
        cta: "Aprenda mais na plataforma",
        ctaIcon: "🚀",
        visual: optionsVisual(ch, true),
        counter: "2/2",
        bg: { pattern: "rays", patternOpacity: 0.08 },
      },
      c
    );
    return { slides: [q, a], caption: buildCaption(c.language, c.brand, `Desafio do dia: ${ch.question} Comente sua resposta!`) };
  },
};

const word: TemplateInfo = {
  id: "word",
  name: "Palavra do dia",
  description: "Cartão com palavra, tradução e frase de exemplo — conteúdo que as pessoas salvam.",
  emoji: "💬",
  slides: 1,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const slide = compose(
      {
        name: "Palavra do dia",
        a: c.language === "kreyol" ? "Hoje em Kreyòl" : "Aujourd'hui en français",
        sub: "Salve este post e treine em voz alta!",
        cta: "Aprender mais",
        ctaIcon: "📘",
        visual: wordVisual(c),
        glow: false,
        bg: { pattern: "confetti", patternOpacity: 0.1 },
      },
      c
    );
    const w = c.copy.words[(c.picks.wordIndex ?? 0) % c.copy.words.length];
    return { slides: [slide], caption: buildCaption(c.language, c.brand, `Palavra do dia: ${w.term} (${w.pt}).`) };
  },
};

const carousel: TemplateInfo = {
  id: "carousel",
  name: "Carrossel de 5 slides",
  description: "Gancho → funcionalidades → lições → jogo/conquistas → chamada final.",
  emoji: "🎠",
  slides: 5,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const k = c.language === "kreyol";
    const g = gameItems(c);
    const n = 5;
    const s1 = compose(
      {
        name: "1 · Gancho",
        a: k ? "Quer aprender" : "Vous voulez",
        b: k ? "Kreyòl de verdade?" : "parler français ?",
        sub: "Deslize e veja tudo o que a plataforma oferece 👉",
        cta: "Arraste para o lado",
        ctaIcon: "👉",
        visual: heroVisual(),
        counter: `1/${n}  ➜`,
      },
      c
    );
    const s2 = compose(
      { name: "2 · Funcionalidades", a: "Tudo em um", b: "só lugar", cta: "Continue deslizando", ctaIcon: "👉", visual: gridVisual(), glow: false, counter: `2/${n}  ➜`, bg: { pattern: "diagonal", patternOpacity: 0.05 } },
      c
    );
    const s3 = compose(
      {
        name: "3 · Lições",
        a: "Lições claras",
        b: "e organizadas",
        sub: `${c.data.counts.lessons > 0 ? c.data.counts.lessons + " lições" : "Lições"} para estudar no seu ritmo.`,
        cta: "Tem mais 👉",
        visual: phoneVisual("lessons", { title: k ? "Lições de Kreyòl" : "Lições de Francês", items: lessonItems(c) }),
        counter: `3/${n}  ➜`,
      },
      c
    );
    const s4 = compose(
      {
        name: "4 · Jogo",
        a: "Jogue, evolua",
        b: "e conquiste",
        sub: k ? "Jogo das Imagens, níveis e selos para compartilhar." : "C'est quoi ?, ranking online, níveis e selos.",
        cta: "Último slide 👉",
        visual: phoneVisual("game", { title: k ? "Jogo das Imagens" : "C'est quoi ?", items: g.items, imageSrc: g.image }),
        counter: `4/${n}  ➜`,
        bg: { pattern: "rays", patternOpacity: 0.08 },
      },
      c
    );
    const s5 = compose(
      {
        name: "5 · Chamada final",
        a: "Vem aprender",
        b: "comigo!",
        sub: "Aulas ao vivo, vídeos, lições e jogos esperando por você.",
        bullets: ["Comece hoje mesmo", "No seu ritmo, pelo celular"],
        cta: "Acesse a plataforma",
        ctaIcon: "🚀",
        visual: heroVisual(),
        counter: `${n}/${n}`,
      },
      c
    );
    return { slides: [s1, s2, s3, s4, s5], caption: buildCaption(c.language, c.brand, k ? "Quer aprender Kreyòl? Deslize e conheça a plataforma!" : "Quer falar francês? Deslize e conheça a plataforma!") };
  },
};

const storySeq: TemplateInfo = {
  id: "story-seq",
  name: "Sequência de Stories (3 telas)",
  description: "Gancho → demonstração do jogo → chamada final. Use com o formato Story 9:16.",
  emoji: "📱",
  slides: 3,
  languages: ["kreyol", "francais"],
  build(ctx) {
    const c = resolve(ctx);
    const k = c.language === "kreyol";
    const g = gameItems(c);
    const s1 = compose(
      {
        name: "Story 1 · Gancho",
        a: k ? "Bon jou! 🇭🇹" : "Bonjour ! 🇫🇷",
        b: k ? "Vamos aprender?" : "On apprend ?",
        sub: k ? "Conheça a plataforma de Kreyòl Ayisyen." : "Conheça a plataforma de francês.",
        cta: "Toque para ver",
        ctaIcon: "👆",
        visual: heroVisual(),
        counter: "1/3",
      },
      c
    );
    const s2 = compose(
      {
        name: "Story 2 · Jogo",
        a: k ? "Aprender" : "C'est quoi ?",
        b: k ? "jogando 🎮" : "Teste agora 🎮",
        cta: "Quero jogar",
        ctaIcon: "🎮",
        visual: phoneVisual("game", { title: k ? "Jogo das Imagens" : "C'est quoi ?", items: g.items, imageSrc: g.image }),
        counter: "2/3",
        bg: { pattern: "rays", patternOpacity: 0.08 },
      },
      c
    );
    const s3 = compose(
      {
        name: "Story 3 · Chamada",
        a: "Entre agora",
        b: "na plataforma",
        sub: "Link no botão ou na bio.",
        cta: "Acessar",
        ctaIcon: "🚀",
        visual: phoneVisual("achievements", { title: levelTitle(c), items: badgeItems(c) }),
        counter: "3/3",
      },
      c
    );
    return { slides: [s1, s2, s3], caption: buildCaption(c.language, c.brand, "Conheça a plataforma!") };
  },
};

export const TEMPLATES: TemplateInfo[] = [hero, features, game, lesson, live, stories, progress, ranking, challenge, word, carousel, storySeq];

export function templatesFor(language: AppLanguage): TemplateInfo[] {
  return TEMPLATES.filter((t) => t.languages.includes(language));
}

export function getTemplate(id: string): TemplateInfo | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
